<template>
    <div class="page">
        <section class="body">
            <div class="top">
                <!-- <img :src="proData &&api+proData.user_photo" alt="" class="tx"> -->
                <!-- <img :src="info.avatar &&api+info.avatar" alt="" class="tx" @click="$router.push({name:'Change'})"> -->
                <img :src="info.avatar||tx" alt="" class="tx" @click="$router.push({name:'Change'})">
                <img :src="top_bgc" alt="" class="top_bgc">
                <div class="content">
                    <p>{{info.realname}}</p>
                    <p>{{info.username}}</p>
                    <p>{{lang_text&&(lang!='en'?'等级':lang_text.grade)}}：<span>{{info.levelname}}</span></p>
                </div>
                <div class="right" v-if="info.city == 1 ">
                <!-- <div class="right" > -->
                    <img :src="top_right" alt="">
                    <span>{{lang_text&&(lang!='en'?'城市合伙人':lang_text.a54)}}</span>
                </div>
                <i class="iconfont iconchilun sz" @click="$router.push({name:'Set'})"></i>
                <p class="p_right" v-if="app_version">{{lang_text&&(lang!='en'?'版本号':'Edition')}} {{app_version||'1.0.5'}}</p>
            </div>
            
            <scroller 
                    ref="my_scroller"
                    :on-refresh="refresh"
                    :on-infinite="infinite">
            </scroller>
            <ul class="sj">
                <li @click="goTo('Ydetail')">
                    <p>{{(+info.credit1).toFixed(2)}} L</p>
                    <p>{{lang_text&&(lang!='en'?'PETRO':lang_text.oil)}}</p>
                </li>
                <li @click="goTo('NumDetail',0)">
                    <p>{{(+info.credit2).toFixed(2)}}</p>
                    <p>{{lang_text&&(lang!='en'?'活跃度':lang_text.Activity)}}</p>
                </li>
                <li @click="goTo('NumDetail',1)">
                    <p>{{(+info.credit4).toFixed(2)}}</p>
                    <p>{{lang_text&&(lang!='en'?'荣耀值':lang_text.Honor)}}</p>
                </li>
                <li @click="goTo('NumDetail',2)">
                    <p>{{(+info.credit3).toFixed(2)}}</p>
                    <p>{{lang_text&&(lang!='en'?'奉献值':lang_text.Contribution)}}</p>
                </li>
            </ul>

            <div class="rw">
                <p class="title">{{lang_text&&(lang!='en'?'个人任务':lang_text.Ptask)}}</p>
                <ul>
                    <li>
                        <p>{{lang_text&&(lang!='en'?'我的点赞':lang_text.Mlikes)}}</p>
                        <p>{{data.has_share}}/{{data.share}}</p>
                    </li>
                    <li>
                        <p>{{lang_text&&(lang!='en'?'浏览新闻':lang_text.a58)}}</p>
                        <p>{{data.has_read}}/{{data.read}}</p>
                    </li>
                    <li @click="$router.push({name:'Level'})">
                        <p>{{lang_text&&(lang!='en'?'奉献值等级':lang_text.a59)}}</p>
                        <p>{{info.credit3_level}}</p>
                    </li>
                </ul>
            </div>

            <div class="py">
                <p>
                    <span>{{lang_text&&(lang!='en'?'我的交易':lang_text.a60)}}</span>
                    <!-- <span>查看全部交易</span> -->
                </p>
                <ul>
                    <li v-for="(v,i) in pyList" :key="i" @click="$router.push({name:'PyList',query:{num:i}})">
                        <img :src="v.src" alt="">
                        <p>{{v.name}}</p>
                    </li>
                </ul>
            </div>

            <div class="message">
                <p class="title">{{lang_text&&(lang!='en'?'基本信息':lang_text.a61)}}</p>
                <ul>
                    <li v-for="(v,i) in mList" :key="i" @click="goTo(v.route)">
                        <img :src="v.src" alt="">
                        <span>{{v.name}}</span>
                        <span ><br v-if="(i==0||i==1||i==7||i==6||i==8)&&lang=='en'"/></span>
                    </li>
                </ul>
            </div>

            
            <div class="bot py">
                <p>
                    <span>{{lang_text&&(lang!='en'?'我的商品订单':lang_text.a62)}}</span>
                    <span @click="toOrder(0)">{{lang_text&&(lang!='en'?'查看全部订单':lang_text.a63)}}</span>
                </p>
                <ul>
                    <li v-for="(v,i) in botList" :key="i" @click="toOrder(i+1)">
                        <img :src="v.src" alt="">
                        <p>{{v.name}}</p>
                    </li>
                </ul>
            </div>
        </section>
        <m-Footer></m-Footer>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex';
import {Base,Owner,Init,Trade} from '@/server/server.js';
import {Secret} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
import safeAreaInsets  from 'safe-area-insets';
export default {
    name:'my',
    data(){
        return {
            top_bgc:require('@/assets/images/jr/wd_bg.png'),
            top_right:require('@/assets/images/jr/wd_right.png'),
            tx:require('@/assets/images/jr/logo1.png'),
            pyList:[
                {
                    name:'已创建',
                    src:require('@/assets/images/jr/21.png'),
                    route:'PyList',
                    type:'0',
                },
                {
                    name:'待付款',
                    src:require('@/assets/images/jr/22.png'),
                    route:'PyList',
                    type:'1',
                },
                {
                    name:'待确认',
                    src:require('@/assets/images/jr/23.png'),
                    route:'PyList',
                    type:'3',
                },
                {
                    name:'已完成',
                    src:require('@/assets/images/jr/24.png'),
                    route:'PyList',
                    type:'4',
                },
                {
                    name:'已取消',
                    src:require('@/assets/images/jr/25.png'),
                    route:'PyList',
                    type:'20',
                },
            ],
            mList:[
                {
                    name:'实名认证',
                    src:require('@/assets/images/jr/31.png'),
                    // route:'Certify',
                    route:'Certify2',
                    type:'',
                },
                {
                    name:'我的团队',
                    src:require('@/assets/images/jr/32.png'),
                    route:'Team',
                    type:'',
                },
                {
                    name:'邀请好友',
                    src:require('@/assets/images/jr/33.png'),
                    route:'Invite',
                    type:'',
                },
                {
                    name:'地址管理',
                    src:require('@/assets/images/jr/34.png'),
                    route:'Dz',
                    type:'',
                },
                {
                    name:'收款账户',
                    src:require('@/assets/images/jr/35.png'),
                    route:'Sk',
                    type:'',
                },
                {
                    name:'兑换股权',
                    src:require('@/assets/images/jr/36.png'),
                    route:'Conversion',
                    type:'',
                },
                {
                    name:'城市大厅',
                    src:require('@/assets/images/jr/37.png'),
                    route:'City',
                    type:'',
                },
                {
                    name:'问题反馈',
                    src:require('@/assets/images/jr/38.png'),
                    route:'Help',
                    type:'',
                },
                // {
                //     name:'安全设置',
                //     src:require('@/assets/images/jr/39.png'),
                //     route:'Set',
                //     type:'',
                // },
                {
                    name:'消息',
                    src:require('@/assets/images/jr/39.png'),
                    route:'Notice',
                    type:'mh',
                },
                {
                    name:'商学院',
                    src:require('@/assets/images/jr/40.png'),
                    route:'Guide',
                    type:'2',
                },
            ],
            botList:[
                {
                    name:'待付款',
                    src:require('@/assets/images/jr/26.png'),
                    route:'',
                    type:'',
                },
                {
                    name:'待发货',
                    src:require('@/assets/images/jr/27.png'),
                    route:'',
                    type:'',
                },
                {
                    name:'待收货',
                    src:require('@/assets/images/jr/28.png'),
                    route:'',
                    type:'',
                },
                {
                    name:'已完成',
                    src:require('@/assets/images/jr/29.png'),
                    route:'',
                    type:'',
                },
                {
                    name:'退换货',
                    src:require('@/assets/images/jr/30.png'),
                    route:'',
                    type:'',
                },
            ],
            data:{
                read:null,
                share:null,
                has_read:null,
                has_share:null,
            },
            info:{
                credit1:'0',
                credit2:'0',
                credit3:'0',
                credit4:'0',
                credit5:'0',
                username:null,
                mobile:null,
                levelname:null,
                city:null,
                credit3_level:null,
                avatar:null,
            },
            orderUrl:null,//商城订单的url
            showType:0,//商城订单的状态
            addressUrl:null,//地址管理
            lang_text:null,
            lang:null,
            app_version:null,
            obj:{},
        }
    },
    created(){
        //挂载完之后监听安全区域的位置
        // safeAreaInsets.onChange((style)=>{
        //     this.paddingTop = style.top;
        //     this.paddingBottom = style.bottom
        // })
    },
    mounted () {
        this.initData();
        this.dailyjob();
        this.getUser();
        this.getDownload();
        // this.pay();
        // this.fx_credit3();
        this.$refs.my_scroller.finishPullToRefresh();

    },
    computed:{
        ...mapGetters(['api','uid','userInfo','coinTxt','proData'])
    },
    methods:{
        ...mapMutations(['saveCoinTxt','saveUserInfo','saveLang']),
        // 测试
        // pay(){
        //     Trade.pay().then(res=>{
        //         if(res.code==1){
        //             let form = new FormData();
        //             this.obj = res.data.date;
        //             for(let key in this.obj){
        //                 form.append(key,this.obj[key])
        //                 // console.log(key+':'+form.get(key))
        //             }
        //         }else{
        //             mui.toast(res.msg)
        //         }
        //     })
        // },
        initData(){
            this.addressUrl = this.api+'/addons/litestore#/adresslist?cookie='+localStorage.getItem('cookie')+'&lang='+localStorage.getItem('lang');
            this.saveLang(localStorage.getItem('lang'))
            
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            sessionStorage.setItem('btmNav',4);
            
            this.pyList[0].name = this.lang!='en'?'已创建':this.lang_text.Created;
            this.pyList[1].name = this.lang!='en'?'待付款':this.lang_text.a64;
            this.pyList[2].name = this.lang!='en'?'待确认':this.lang_text.a65;
            this.pyList[3].name = this.lang!='en'?'已完成':this.lang_text.completed;
            this.pyList[4].name = this.lang!='en'?'已取消':this.lang_text.Cancelled;

            this.mList[0].name = this.lang!='en'?'实名认证':this.lang_text.Verified;
            this.mList[1].name = this.lang!='en'?'我的团队':this.lang_text.Mteam;
            this.mList[2].name = this.lang!='en'?'邀请好友':this.lang_text.a67;
            this.mList[3].name = this.lang!='en'?'地址管理':this.lang_text.a68;
            this.mList[4].name = this.lang!='en'?'收款账户':this.lang_text.a69;
            this.mList[5].name = this.lang!='en'?'兑换股权':this.lang_text.a70;
            this.mList[6].name = this.lang!='en'?'城市大厅':this.lang_text.a53;
            this.mList[7].name = this.lang!='en'?'问题反馈':this.lang_text.feedback;
            // this.mList[8].name = this.lang!='en'?'安全设置':this.lang_text.a71;
            this.mList[8].name = this.lang!='en'?'消息':'Message';
            this.mList[9].name = this.lang!='en'?'商学院':this.lang_text.a72;

            this.botList[0].name = this.lang!='en'?'待付款':this.lang_text.a73;
            this.botList[1].name = this.lang!='en'?'待发货':this.lang_text.a74;
            this.botList[2].name = this.lang!='en'?'待收货':this.lang_text.a75;
            this.botList[3].name = this.lang!='en'?'已完成':this.lang_text.completed;
            this.botList[4].name = this.lang!='en'?'退换货':this.lang_text.Returns;
        },
        /**
         * 下拉刷新
         */
        refresh(){
            // history.go(0)
            this.dailyjob();
            this.getUser();
            this.getDownload();
            // this.fx_credit3();
            setTimeout(() => {
                this.$refs.my_scroller.finishPullToRefresh();
                mui.toast('加载完毕！')
            }, 1000);
        },
        // 版本号
        getDownload(){
            Base.getDownload().then(res=>{
                if(res.code==1){
                    this.app_version = res.data.app_version
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        infinite(){},
        // fx_credit3(){
        //     Trade.fx_credit3().then(res=>{

        //     })
        // },
        toOrder(i){
            this.orderUrl = this.api+'/addons/litestore#/my/myorder?showType='+i+'&cookie='+localStorage.getItem('cookie')+'&lang='+localStorage.getItem('lang');
            if(i==5) this.orderUrl = this.api+'/addons/litestore#/center/AfterSaleList?cookie='+localStorage.getItem('cookie');
            try {
                if(plus){
                    let b = sessionStorage.getItem('bottom')
                    let h = document.body.clientHeight - (b/2);
                    plus.webview.open(this.orderUrl,'openView',{height:h+'px',background:'#fff'})
                }
            }catch(e){
                location.href = this.orderUrl;
            }
        },
        getUser(){
            Init.getUser().then(res=>{
                if(res.code==1){
                    this.info = res.data;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 获取每天阅读分享任务数
        dailyjob(){
            Base.dailyjob().then(res=>{
                if(res.code==1){
                    this.data = res.data;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        goTo(route,type){
            // if(route=='Certify'){
            //     mui.toast('维护中......')
            //     return;
            // }
            if(route=='Certify2'){
                if(this.info.isreal==0){
                    // mui.toast('666')
                    this.$router.push({name:'Agreement'})
                    return;
                }
            }
            if(route=='Conversion'||route=='City'){
                mui.toast(this.lang!='en'?'基础建设中，敬请期待......':'Coming soon......')
                return;
            }
            if(route=='Dz'){
                try{
                    if(plus){
                        // plus.webview.create(that.addressUrl).show();  

                        
                        // let t = this.paddingTop;
                        // let b = this.paddingBottom;
                        // let h = document.body.clientHeight - (t+b);
                        // // plus.webview.open(_this.addressUrl,'openView',{top:t+'px',bottom:b+'px',background:'#000'})
                        // plus.webview.open(_this.addressUrl,'openView',{margin:t+'px 0 '+b+'px',background:'#000',height:h+'px'})

                        
                        let b = sessionStorage.getItem('bottom')
                        let h = document.body.clientHeight - (b/2);
                        plus.webview.open(this.addressUrl,'openView',{height:h+'px',background:'#fff'});
                    }
                }catch(e){
                    location.href = this.addressUrl;
                }
            }
            else this.$router.push({name:route,query:{type}})
        }
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        // padding: @padding-primary;
        background-color: @bg-color;
        position: relative;
        .top{
            position: relative;
            padding-top: 103px;

            
            width: 690px;
            margin: 0 30px;
            padding-top: 43px;
            .top_bgc{
                width: 100%;
                position: absolute;
                left: 0;
                z-index: -100;
                top: 0;
                
            }
            .tx{
                display: inline-block;
                width: 140px;
                height: 140px;
                // border-radius: 50%;
                margin-left: 40px;
                box-shadow:0px 0px 10px 0px rgba(0,147,221,1);
                vertical-align: middle;
            }
            .content{
                display: inline-block;
                margin-left: 20px;
                vertical-align: middle;
                padding-top: 16px;
                p{
                    margin-bottom: 7px;
                    &:first-child{
                        font-size:34px;
                    }
                    &:nth-child(2){
                        font-size:28px;
                    }
                    &:last-child{
                        font-size: 24px;
                        span{
                            color: #FFB800;
                        }
                    }
                    
                }
            }
            .right{
                background-color: #fff;
                border-radius:100px 0px 0px 100px;
                position: absolute;
                right: 0;
                // top: 134px;
                height: 78px;
                line-height: 78px;
                // width: 212px;
                // top: 54px;
                // top: 84px;
                top: 134px;
                img{
                    display: inline-block;
                    width:45px;
                    height:39px;
                    vertical-align: middle;
                    margin-left: 17px;
                }
                span{
                    color: #0093DD;
                    // width: 100%;
                    flex: 1;
                }
            }
            .sz{
                position: absolute;
                right: 30px;
                // top: 30px;
                top: 54px;
                color: #fff;
                font-size: 32px;
            }
            .p_right{
                
                position: absolute;
                right: 30px;
                // top: 30px;
                top: 90px;
                color: #fff;
                font-size: 24px;
            }
        }
        .sj{
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            padding: 22px 0;
            width: 100%;
            margin-top: 67.5px;
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
        .rw{
            // margin: 30px;
            margin: 20px 30px;
            border-radius:30px;
            background-color: #fff;
            padding: 32px 30px 20px;
            border: 1px solid rgba(30,144,255,.25);
            .title{
                font-size:40px;
                font-weight:550;
                color:rgba(51,51,51,1);
                margin-bottom: 22px;
            }
            ul{
                display: flex;
                justify-content: space-between;
                padding: 16px;
                li{
                    // flex: 1;
                    p{
                        text-align: center;
                        &:first-child{
                            font-size:28px;
                            font-weight:400;
                            color:rgba(102,102,102,1);
                        }
                        &:last-child{
                            margin-top: 5px;
                            font-size:36px;
                            font-weight:550;
                            color:rgba(0,147,221,1)
                        }
                    }
                    // &:nth-child(2){
                    //     p{
                    //         text-align: center;
                    //     }
                    // }
                }
            }
        }
        .py{
            // margin: 0 30px 20px;
            margin: 0 30px 0px;
            background-color: #fff;
            border-radius: 30px;
            padding: 30px 10px;
            padding-bottom: 34px;
            border: 1px solid rgba(30,144,255,.25);
            >p{
                margin-bottom: 40px;
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
                span{
                    &:first-child{
                        font-size:40px;
                        font-weight:550;
                        color:rgba(51,51,51,1);
                    }
                    &:last-child{
                        // font-size:28px;
                        // color:rgba(176,190,215,1);
                    }
                }
            }
            ul{
                display: flex;
                justify-content: space-between;
                li{
                    flex: 1;
                    text-align: center;
                    img{
                        width: 46px;
                        height: 46px;
                    }
                    p{
                        font-size:24px;
                        color:rgba(102,102,102,1);
                    }
                }
            }
        }
        .message{
            padding: 30px 0;
            background-color: #fff;
            border-radius: 30px;
            margin: 20px 30px;
            border: 1px solid rgba(30,144,255,.25);
            p{
                font-size:40px;
                font-weight:550;
                color:rgba(51,51,51,1);
                margin-bottom: 30px;
                margin-left: 30px;
            }
            ul{
                // display: flex;
                // justify-content: space-between;
                li{
                    // flex: 1;
                    width: 19%;
                    display: inline-block;
                    text-align: center;
                    margin-left: 1%;
                    img{
                        width: 90px;
                        height: 90px;
                    }
                    span{
                        font-size:24px;
                        color:rgba(102,102,102,1);
                        display: block;
                        margin-top: -10px;
                        &:last-child{
                            margin-top: 0px;
                        }
                    }
                    &:nth-child(n+6){
                        margin-top: 16px;
                    }
                }
            }
        }
        .bot{
            margin-bottom: 20px;
            >p{
                span{
                    &:last-child{
                        color: #000;
                    }
                }
            }
        }
        
        /deep/ ._v-container{
            position: absolute;
            width: 50% !important;
            height: 640px !important;
            z-index: 10;
            left: 32%;
            top: -320px;
        }
    }
    .page{
        position: relative;
    }
</style>
