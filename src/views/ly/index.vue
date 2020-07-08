<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'炼油':lang_text.Refining)"></m-header>
    
    <scroller 
            ref="my_scroller"
            :on-refresh="refresh"
            :on-infinite="infinite">
    </scroller>
    <section class="body">
        <div class="box">
            <ul class="top">
                <li v-for="(v,i) in topList" :key="i" @click="goTo(v.route,i)">
                    <img :src="v.img" alt="">
                    <p>{{v.name}}</p>
                </li>
            </ul>

            <div class="center">
                <p class="title">
                    <img :src="newUrl" alt="">
                    <span>{{lang_text&&(lang!='en'?'我的炼油':lang_text.Mrefinery)}}</span>
                </p>
                <div class="content">
                    <img :src="gif01" alt="">
                    <button @click="produceCc">{{getType(data.type)}}</button>
                </div>
                <p class="bot" v-show="data.type==1">{{lang_text&&(lang!='en'?'炼油倒计时':lang_text.a14)}}：{{time2}}</p>
                <p class="bot" v-show="data.type==1||data.type==2">{{lang_text&&(lang!='en'?'已产出PETRO':'Refined oil output')}}：{{data.cc&&data.cc}}L</p>
                <!-- <p class="bot">{{lang_text&&(lang!='en'?'已产出炼油量':'Refined oil output')}}：{{data.cc&&data.cc}}L</p> -->
            </div>

            
            <ul class="sj">
                <li @click="goTo('Ydetail')">
                    <p>{{(+info.credit1).toFixed(2)}} L</p>
                    <p>{{lang_text&&(lang!='en'?'PETRO':lang_text.oil)}}</p>
                </li>
                <li @click="goTo2('NumDetail',0)">
                    <p>{{(+info.credit2).toFixed(2)}}</p>
                    <p>{{lang_text&&(lang!='en'?'活跃度':lang_text.Activity)}}</p>
                </li>
                <li @click="goTo2('NumDetail',1)">
                    <p>{{(+info.credit4).toFixed(2)}}</p>
                    <p>{{lang_text&&(lang!='en'?'荣耀值':lang_text.Honor)}}</p>
                </li>
                <li @click="goTo2('NumDetail',2)">
                    <p>{{(+info.credit3).toFixed(2)}}</p>
                    <p>{{lang_text&&(lang!='en'?'奉献值':lang_text.Contribution)}}</p>
                </li>
            </ul>
            
            <div class="bot">
                <p class="title">
                    <img :src="newUrl" alt="">
                    <span>{{lang_text&&(lang!='en'?'推荐炼油机':lang_text.a16)}}</span>
                </p>
                <ul>
                    <li v-for="(v,i) in list" :key="i" >
                        <div v-if="v.name!='体验炼油机'&&v.name!='Experience refining machine'" 
                                :class="{'c1':v.name=='体验炼油机'||v.name=='Experience refining machine',
                                'c2':v.name=='初级炼油机'||v.name=='Primary refining machine',
                                'c3':v.name=='中级炼油机'||v.name=='Intermediate refining machine',
                                'c4':v.name=='高级炼油机'||v.name=='Advanced Refining Machine',
                                'c5':v.name=='顶级炼油机'||v.name=='Top refining machine',
                                'c6':v.name=='大师炼油机'||v.name=='Guru refining machine',
                                'c7':v.name=='宗师炼油机'||v.name=='Experts refining machine',
                                'c8':v.name=='专家炼油机'||v.name=='Master refining machine',
                                'c9':v.name=='赠送炼油机'||v.name=='Complimentary refinery'}" > 
                            <p>
                                <span class="title">{{v.name}}</span>
                                <span>{{lang_text&&(lang!='en'?'活跃度奖励':lang_text.a17)}}：{{(+v.nissan).toFixed(0)}}</span>
                            </p>
                            <p>
                                <span>{{lang_text&&(lang!='en'?'兑换所需':lang_text.price)}}：{{(+v.price).toFixed(0)}} L</span>
                                <span>{{lang_text&&(lang!='en'?'PETRO产量':lang_text.a19)}}：{{(+v.power).toFixed(0)}}L</span>
                            </p>
                            <p>
                                <span>{{lang_text&&(lang!='en'?'运行市场':lang_text.a20)}}：{{v.life_day}}{{lang_text&&(lang!='en'?'小时/天':lang_text.a21)}}</span>
                                <span>{{lang_text&&(lang!='en'?'运行周期':lang_text.Oc)}}：{{v.life}}{{lang_text&&(lang!='en'?'天':lang_text.day)}}</span>
                            </p>
                            <button @click="open(v.id)">{{lang_text&&(lang!='en'?'兑换':lang_text.exchange)}}</button>
                        </div>
                        
                    </li>
                </ul>
            </div>
        </div>

    </section>
    <m-Footer></m-Footer>
    <m-load ref="load"></m-load>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>

  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
  components:{
      mPwd
  },
  data(){
        return {
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            topList:[
                // {
                //     img:require('@/assets/images/jr/11.png'),
                //     name:'我的炼油机',
                //     route:'Mill',
                // },
                {
                    img:require('@/assets/images/jr/12.png'),
                    name:'矿机商店',
                    route:'Mill',
                },
                {
                    img:require('@/assets/images/jr/13.png'),
                    name:'商学院',
                    route:'Guide',
                },
                {
                    img:require('@/assets/images/jr/14.png'),
                    name:'群聊',
                    route:'Group',
                },
                {
                    img:require('@/assets/images/jr/15.png'),
                    name:'物料地推',
                    route:'Generalize',
                },
            ],
            list:[],
            id:null,
            data:{
                cc:0.00000000,
                time:0,
                dpcc:0,
                type:0,
            },
            info:{
                credit1:'0',
                credit2:'0',
                credit3:'0',
                credit4:'0',
            },
            time:0,
            time2:0,
            lang_text:null,
            lang:null,
            gif01:require('@/assets/images/jr/01.gif'),
            newUrl:require('@/assets/images/jr/new.png'),
        }
  },
  mounted() {
      this.initData();
      this.getList();
      this.lyj_state();
      this.getUser();
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
        // this.topList[0].name = this.lang!='en'?'我的炼油机':this.lang_text.Mrefiner;
        this.topList[0].name = this.lang!='en'?'炼油机':this.lang_text.Refiner;
        this.topList[1].name = this.lang!='en'?'商学院':this.lang_text.Mrefiner;
        this.topList[2].name = this.lang!='en'?'群聊':this.lang_text.group;
        this.topList[3].name = this.lang!='en'?'物料地推':'Material pushing';
        
        sessionStorage.setItem('btmNav',1);
    },
    /**
     * 下拉刷新
     */
    refresh(){
        // history.go(0)
        // location.reload()
        this.list = [];
        this.getList();
        this.lyj_state();
        this.getUser();
        setTimeout(() => {
            this.$refs.my_scroller.finishPullToRefresh();
            mui.toast('加载完毕！')
        }, 1000);
    },
    infinite(){},
    // 获取个人信息和资产状况
    getUser(){
        Init.getUser().then(res=>{
            if(res.code==1){
                this.info = res.data;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 倒计时
    ly(){
        let addY = setInterval(()=>{
            this.data.cc += +this.data.dpcc;
            this.time = this.data.time - (+new Date())/1000
            let h = Math.floor(this.time/3600)<10?'0'+Math.floor(this.time/3600):Math.floor(this.time/3600)
            let m = Math.floor((this.time%3600)/60)<10?'0'+Math.floor((this.time%3600)/60):Math.floor((this.time%3600)/60)
            let s = Math.floor(this.time%60)<10?'0'+Math.floor(this.time%60):Math.floor(this.time%60)
            this.time2 = h+'：'+m+'：'+s
            if(this.time <= 0){
                clearInterval(addY)
                this.lyj_state();
            }
        },1000)
    },
    open(id){
        this.id = id;
        this.$refs['pwd'].open();
    },
    pay(pwd){
        this.trade(pwd);
    },
    getType(type){
        switch(type){
            case 0:
                // return '点击炼油';
                return this.lang!='en'?'炼油':this.lang_text.Refining
            case 1:
                // return '炼油中';
                return this.lang!='en'?'炼油中':'oil refining'
            case 2:
                // return '点击领取';
                return this.lang!='en'?'领取':'Receive'
            case 3:
                // return '今日已炼油';
                return this.lang!='en'?'今日已炼油':'Non refining'
        }
    },
    // 矿机状态
    lyj_state(){
        Trade.lyj_state().then(res=>{
            if(res.code==1){
                if(!res.data.cc){
                    this.data = Object.assign({cc:0.00000000},res.data)
                }else{
                    this.data = res.data;
                }
                if(res.data.type==1){
                    this.ly()
                }
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 炼油或领取
    produceCc(){
        if(this.data.type==1&&this.data.type==3){
            return;
        }
        Trade.produceCc().then(res=>{
            if(res.code==1){
                if(this.data.type==2){
                    mui.toast(res.msg)
                }
                this.getUser();
                this.lyj_state();
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 时间
    formatDate(date){
        return Util.formatDate(date)
    },
    // 购买矿机
    trade(pwd){
        Trade.trade({pwd,id:this.id,cc_type:1}).then(res=>{
            mui.toast(res.msg)
            if(res.code==1){
                setTimeout(()=>{
                    // this.list = [];
                    // this.getList();
                    this.$router.go(0);
                },500)
            }
        })
    },
    // 矿机列表
    getList(){
        Trade.getList().then(res=>{
            if(res.code==1){
                this.list = res.data;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    goTo(route,i){
        this.$router.push({name:route,query:{num:i}})
    },
    goTo2(route,type){
        this.$router.push({name:route,query:{type}})
    }
  },
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: @bg-color;
    position: relative;
    .box{
        .top{
            display: flex;
            justify-content: space-between;
            padding: 28px 20px 20px;
            // background-color: #fff;
            background-color: rgba(55,142,213,1) !important;
            li{
                display: inline-block;
                flex: 1;
                text-align: center;
                img{
                    height: 40px;
                    margin-bottom: 6px;
                }
                p{
                    font-size:20px;
                    font-weight:400;
                    // color:rgba(153,153,153,1);
                    // color: #000;
                    color: #fff;
                }
            }
        }
        .center{
            background-color: #fff;
            margin-top: 20px;
            padding: 22px 40px;
            .title{
                img{
                    width: 38px;
                    height: 38px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                span{
                    font-size:32px;
                    font-family:PingFangSC-Semibold,PingFang SC;
                    font-weight:600;
                    color:rgba(51,51,51,1);
                    vertical-align: middle;
                }
            }
            .content{
                text-align: center;
                margin-top: 10px;
                img{
                    width: 400px;
                    height: 400px;
                    display: block;
                    margin-left: 144px;
                }
                button{
                    width:400px;
                    height:88px;
                    background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                    border-radius:10px;
                    display: block;
                    margin-left: 144px;
                    margin-top: 30px;
                }
            }
            .bot{
                font-size:24px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(0,147,221,1);
                margin-top: 15px;
                text-align: center;
                width: 100%;
            }
        }
        
        .sj{
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            padding: 22px 0;
            width: 100%;
            // margin-top: 67.5px;
            li{
                flex: 1;
                p{
                    text-align: center;
                    &:first-child{
                        font-size:36px;
                        font-weight:500;
                        color:rgba(0,147,221,1);
                    }
                    &:last-child{
                        font-size:28px;
                        font-weight:400;
                        color:rgba(102,102,102,1);
                        margin-top: 6px;
                    }
                }
            }
        }
        .bot{
            padding: 0px 30px 0;
            margin-top: 30px;
            .title{
                img{
                    width: 38px;
                    height: 38px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                span{
                    font-size:32px;
                    font-family:PingFangSC-Semibold,PingFang SC;
                    font-weight:600;
                    color:rgba(51,51,51,1);
                    // color:#fff;
                    vertical-align: middle;
                }
            }
            ul{
                margin-top: 20px;
                li{
                    >div{

                        background:#fff;
                        border-radius:30px;
                        padding: 30px;
                        margin-bottom: 20px;
                        p{  
                            display: flex;
                            justify-content: space-between;
                            font-size:24px;
                            // color:rgba(153,153,153,1);  
                            margin-bottom: 16px;
                            .title{
                                color: #0093DD;
                                font-size:28px;
                                font-weight:550;   
                                color: #fff;
                            }
                            &:nth-child(n+3){
                                margin-bottom: 0;
                            }
                        }
                        button{
                            // width: 100%;
                            // height:88px;
                            // // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                            // border-radius:10px;
                            // margin-top: 30px;
                            // background-color: rgba(0, 0, 0, 0);
                            // border: 1px solid #fff;
                            
                            height:88px;
                            border-radius:10px;
                            width: 50%;
                            margin: 30px 25% 0;
                            border: 1px solid #fff;
                        }
                    }
                        
                }
                .c1{
                    // background-color: rgba(217,75,89,1);
                    background-color: rgba(60,90,155,1);
                }
                .c2{
                    // background-color: rgba(147,63,190,1);
                    background-color: rgba(90,120,150,1);
                }
                .c3{
                    // background-color: rgba(254,218,0,1);
                    background-color: rgba(40,50,55,1);
                }
                .c4{
                    // background-color: rgba(236,122,0,1);
                    background-color: rgba(50,50,40,1);
                }
                .c5{
                    // background-color: rgba(0,128,1,1);
                    background-color: rgba(155,61,61,1);
                }
                .c6{
                    // background-color: rgba(204,59,138,1);
                    background-color: rgba(255,206,202,1);
                }
                .c7{
                    // background-color: rgba(228,103,136,1);
                    background-color: rgba(104,61,103,1);
                }
                .c8{
                    // background-color: rgba(55,142,213,1);
                    background-color: rgba(122,90,153,1);
                }
                .c9{
                    background-color: rgba(252,103,107,1);
                }
            }
        }
    }
}
.ly{
    color: #333;
}
.page{
    position: relative;
    /deep/ ._v-container{
      // height: 100% !important;
      // z-index: 10;
      // pointer-events: none;
      // pointer-events: auto;
      // width: 570px !important;
      position: absolute;
      top: -144px;
      left: 0;
      width: 100%;
      height: 228px !important;
      z-index: 9999;

    }
}
</style>
