<template>
    <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'交易订单':lang_text.a166)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <ul class="top">
                <li v-for="(v,i) in topList" :key="i" :class="{'se':num==i}" @click="changeNum(i)">{{v}}</li>
            </ul>

            <ul class="bot" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
                <li v-for="(v,i) in list" :key="i" @click="$router.push({name:'PyDetail',query:{orderid:v.id}})">
                    <div class="left">
                        <!-- <p>{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}：{{(v.mobile).substring(0,4)}}****{{(v.mobile).substring(7,11)}}</p> -->
                        <p>{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}：{{v.mobile}}</p>
                        <p>{{lang_text&&(lang!='en'?'单价':lang_text.price)}}：${{v.uprice}}　{{lang_text&&(lang!='en'?'数量':lang_text.Quantity)}}：{{v.amount1}}L</p>
                        <p>{{lang_text&&(lang!='en'?'总额':lang_text.sum)}}：¥{{v.totalprice}}</p>
                    </div>
                    <div class="right">
                        <button v-on:click.stop="withdraw_op(v.tradesn)" v-show="v.state == 1">{{lang_text&&(lang!='en'?'取消':lang_text.cancel)}}</button>
                        <button v-show="v.state == 2">{{userInfo.mobile==v.mobile?(lang_text&&(lang!='en'?'付款':lang_text.a83)):(lang!='en'?'查看':lang_text.a88)}}</button>
                        <button v-show="v.state == 3"  :class="{'y_color':userInfo.mobile!=v.mobile}">{{userInfo.mobile!=v.mobile?lang_text&&(lang!='en'?'确认':lang_text.confirm):lang_text&&(lang!='en'?'查看':lang_text.a88)}}</button>
                        <button v-show="v.state == 10||v.state==4">{{lang_text&&(lang!='en'?'查看':lang_text.a88)}}</button>
                        <button v-show="v.state == 12" style="background:#D6D6D6">{{lang_text&&(lang!='en'?'已取消':lang_text.Cancelled)}}</button>
                        <p>{{lang_text&&(lang!='en'?'最近30天成交量':lang_text.Volume)}}：{{v.deal}}</p>
                    </div>
                </li>
            </ul>
        </section>
        <!-- <m-Footer></m-Footer> -->
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex';
import {Base,Owner,Init,Trade} from '@/server/server.js';
import {Secret} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
    name:'my',
    data(){
        return {
            top_bgc:require('@/assets/images/jr/wd_bg.png'),
            topList:[
                '已创建',
                '待付款',
                '待确认',
                '已完成',
                '申诉',
                '已取消',
            ],
            num:0,
            page:1,
            state:1,
            list:[],
            screenHeight:null,
            noMore:false,
            lang_text:null,
            lang:null,
            rmb_dollar:null,
            
        }
    },
    mounted () {
        this.initData()
        this.ccOrder();
        this.getCcParam();
        
    },
    computed:{
        ...mapGetters(['api','uid','userInfo','coinTxt','proData'])
    },
    methods:{
        ...mapMutations(['saveCoinTxt','saveUserInfo']),
        initData(){
            this.screenHeight = window.screen.height || window.screen.availHeight;
            this.num = this.$route.query.num;
            if(this.num == 4){
                this.state = 12;
            }else if(this.num == 5){
                this.state = 10;
            }else{
                this.state = +this.num+1;
            }
            
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            
            this.topList[0] = this.lang!='en'?'已创建':this.lang_text.Created;
            this.topList[1] = this.lang!='en'?'待付款':this.lang_text.a64;
            this.topList[2] = this.lang!='en'?'待确认':this.lang_text.a65;
            this.topList[3] = this.lang!='en'?'已完成':this.lang_text.completed;
            this.topList[5] = this.lang!='en'?'申诉':this.lang_text.a84;
            this.topList[4] = this.lang!='en'?'已取消':this.lang_text.Cancelled;
        },
        // 参数
        getCcParam(){
            Trade.getCcParam({orderid:this.id}).then(res=>{
                if(res.code==1){
                    this.rmb_dollar = res.data.rmb_dollar;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        
        lazyLoad(){
            this.page = this.page+1;
            if(!this.noMore){
                this.ccOrder(); 
            }
        },
        // 取消订单
        withdraw_op(tradesn){
            
            try{
                if(plus){
                    mui.confirm(this.lang!='en'?'确定取消订单':this.lang_text.a89,actions=>{
                        if(actions.index == 0){
                            Trade.withdraw_op({tradesn}).then(res=>{
                                mui.toast(res.msg)
                                if(res.code==1){
                                    this.list = [];
                                    this.page = 1;
                                    this.ccOrder();
                                }
                            })
                        }
                    })
                }
            }catch(e){
                mui.confirm(this.lang!='en'?'确定取消订单':this.lang_text.a89,actions=>{
                    if(actions.index == 1){
                        Trade.withdraw_op({tradesn}).then(res=>{
                            mui.toast(res.msg)
                            if(res.code==1){
                                this.list = [];
                                this.page = 1;
                                this.ccOrder();
                            }
                        })
                    }
                })
            }
        },
        changeNum(i){
            this.num = i;
            this.page = 1;
            this.list = [];
            this.noMore = false;
            if(this.num == 4){
                this.state = 12;
            }else if(this.num == 5){
                this.state = 10;
            }else{
                this.state = +this.num+1;
            }
            this.ccOrder();
        },
        
        ccOrder(){
            Trade.ccOrder({type:1,state:this.state,page:this.page,time:0,op:0}).then(res=>{
                if(res.code==1){
                    // this.list = res.data;
                    
                    this.list = this.list.concat(res.data||[]);
                    
                    console.log(this.list)
                    if(!res.data||res.data.length<10)
                    this.noMore = true;
                }else{
                    mui.toast(res.msg)
                }
            })
        },

    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        // padding: @padding-primary;
        background-color: @bg-color;
        .top{
            display: flex;
            justify-content: space-between;
            // height: 88px;
            // line-height: 88px;
            background-color: #fff;
            overflow-x:auto;/*可滑动*/
            li{
                // flex: 1;
                width: 300px;
                text-align: center;
                font-size:32px;
                color:rgba(51,51,51,1);
                padding: 20px;
                white-space: nowrap;
            }
            .se{
                font-weight:500;
                color:rgba(0,147,221,1);
                position: relative;
                &::before{
                    content: '';
                    width: 80px;
                    height: 4px;
                    background-color: #0093DD;
                    position: absolute;
                    bottom: 0;
                    left: 34px;
                }
            }
        }
        .bot{
            margin: 30px;
            li{
                padding: 30px 30px 27px;
                background-color: #fff;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                border: 1px solid rgba(0,147,221,.3);
                .left{
                    p{
                        font-family:PingFangSC-Regular,PingFang SC;
                        color:rgba(51,51,51,1);
                        // margin-bottom: 16px;
                        &:last-child{margin-bottom: 0}
                        font-size: 24px;
                    }
                }
                .right{
                    text-align: right;
                    width: 220px;
                    button{
                        width:200px;
                        height:78px;
                        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                        border-radius:10px;
                        font-size:32px;
                        margin-bottom: 15px;
                    }
                    p{
                        font-size:24px;
                        color:rgba(170,170,170,1);
                        line-height:33px;
                        text-align: center;
                    }
                }
            }
            .y_color{
                background:linear-gradient(270deg,rgba(255,220,0,1) 0%,rgba(255,182,0,1) 100%) !important;
            }
        }
    }
</style>
