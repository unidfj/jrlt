import Vue from 'vue';
import Router from 'vue-router';
import {Util} from '@/assets/commonjs/utils.js';
// import store from '../store/index';
// import { resolve } from 'url';

const notFoundPage=()=>import('@/views/404Page');
const Welcome=()=>import('@/views/welcome');
const UploadWgt=()=>import('@/views/uploadWgt');


//淘金区
const PanGold=()=>import('@/views/pan-gold/index.vue');
const Service=()=>import('@/views/service/index.vue');
const My=()=>import('@/views/my/index.vue');
const My2=()=>import('@/views/my/index2.vue');
const Ly=()=>import('@/views/ly/index.vue');
const Py=()=>import('@/views/py/index.vue');


// 淘金区模块  --start

const StartMining =resolve => require(['@/views/pan-gold/start-mining.vue'], resolve)
const BuyResule = resolve => require(['@/views/pan-gold/buy-result.vue'], resolve)
//申诉
const Appeal = resolve => require(['@/views/pan-gold/appeal.vue'], resolve)
const NoticeDetail = resolve => require(['@/views/pan-gold/noticeDetail.vue'], resolve)
const Notice = resolve => require(['@/views/pan-gold/notice.vue'], resolve)
const Cd = resolve => require(['@/views/pan-gold/cDetail.vue'], resolve)
const BannerDetail = resolve => require(['@/views/pan-gold/bannerDetail.vue'], resolve)
// 淘金区模块  --end


//客服中心
const Customer = resolve => require(['@/views/service/customer.vue'], resolve)
const Help = resolve => require(['@/views/service/help.vue'], resolve)
const Problem = resolve =>require(['@/views/service/problem.vue'], resolve)
const QuestionDetails = resolve =>require(['@/views/service/question-details.vue'], resolve)
const QuestionList = resolve =>require(['@/views/service/question-list.vue'], resolve)
const Qlist = resolve =>require(['@/views/service/list.vue'], resolve)
const Qlist2 = resolve =>require(['@/views/service/list2.vue'], resolve)


// 炼油  ----start
const Mill=()=>import('@/views/ly/mill.vue');
const Guide=()=>import('@/views/ly/guide.vue');
const GL=()=>import('@/views/ly/gList.vue');
const GD=()=>import('@/views/ly/gDetail.vue');
const Group=()=>import('@/views/ly/group.vue');
const Generalize=()=>import('@/views/ly/generalize.vue');
const List2=()=>import('@/views/ly/list2.vue');
// 炼油  ----end

// 交易  ----start

const Sell=()=>import('@/views/py/sell.vue');
const Sbuy=()=>import('@/views/py/buy.vue');
const Line=()=>import('@/views/py/line.vue');
// 交易  ----end



// 我的  --start
const Bestpeak = resolve => require(['@/views/my/record/bestpeak.vue'], resolve);
const Mine = resolve => require(['@/views/my/record/mine.vue'], resolve);
const Attorn = resolve => require(['@/views/my/record/attorn.vue'], resolve);
const Detail = resolve => require(['@/views/my/record/detail.vue'], resolve);
const Invite = resolve => require(['@/views/my/nav/invite.vue'], resolve);
const Certify = resolve => require(['@/views/my/nav/certify.vue'], resolve);
const Certify2 = resolve => require(['@/views/my/nav/certify2.vue'], resolve);
const Capture = resolve => require(['@/views/my/nav/capture.vue'], resolve);
const PayInfo = resolve => require(['@/views/my/nav/pay/index.vue'], resolve);
const AddCard = resolve => require(['@/views/my/nav/pay/add-card.vue'], resolve);
const Bind = resolve => require(['@/views/my/nav/pay/bind.vue'], resolve);
const Team = resolve => require(['@/views/my/nav/team/index.vue'], resolve);
const TeamList = resolve => require(['@/views/my/nav/team/team-list.vue'], resolve);
const Set = resolve => require(['@/views/my/set.vue'], resolve);
const ShaiTu = resolve => require(['@/views/my/shaitu.vue'], resolve);
const Dial = resolve => require(['@/views/my/dial.vue'], resolve);
const BlockMine = resolve => require(['@/views/my/middle/block-mine.vue'], resolve);
const Extract =resolve => require(['@/views/my/middle/extract.vue'], resolve);
const ExtractRecord =resolve => require(['@/views/my/middle/extract-record.vue'], resolve)
const MiningMachine =resolve => require(['@/views/my/middle/mining-machine.vue'], resolve)
const TurnOut =resolve => require(['@/views/my/middle/turn-out.vue'], resolve)
const Recharge =resolve => require(['@/views/my/middle/recharge.vue'], resolve)
const CheckUpdate =resolve => require(['@/views/my/checkUpdate.vue'], resolve)
const PyList =resolve => require(['@/views/my/pyList.vue'], resolve)
const City =resolve => require(['@/views/my/city.vue'], resolve)
const Ydetail =resolve => require(['@/views/my/yDetail.vue'], resolve)
const NumDetail =resolve => require(['@/views/my/numDetail.vue'], resolve)
const NumDetail2 =resolve => require(['@/views/my/numDetail2.vue'], resolve)
const Site =resolve => require(['@/views/my/nav/site.vue'], resolve)
const Dz =resolve => require(['@/views/my/nav/dz.vue'], resolve)
const Sk =resolve => require(['@/views/my/sk.vue'], resolve)
const Conversion =resolve => require(['@/views/my/nav/conversion.vue'], resolve)
const Crecord =resolve => require(['@/views/my/nav/record.vue'], resolve)
const PyDetail =resolve => require(['@/views/my/pyDetail.vue'], resolve)
const Addcity =resolve => require(['@/views/my/addcity.vue'], resolve)
const Rule =resolve => require(['@/views/my/rule.vue'], resolve)
const Rule2 =resolve => require(['@/views/my/rule2.vue'], resolve)
const Change =resolve => require(['@/views/my/change.vue'], resolve)
const Level =resolve => require(['@/views/my/level.vue'], resolve)
const Agreement =resolve => require(['@/views/my/agreement.vue'], resolve)
// 我的  --end


// 用户相关  -start
const SetPwd = resolve => require(['@/views/init/set-pwd.vue'], resolve);
const Login = resolve => require(['@/views/init/login.vue'], resolve);
const BackPwd = resolve => require(['@/views/init/back-pwd.vue'], resolve);
const Register = resolve => require(['@/views/init/register.vue'], resolve);
const Close = resolve => require(['@/views/init/close.vue'], resolve);
const Close2 = resolve => require(['@/views/init/close2.vue'], resolve);
const Pay = resolve => require(['@/views/init/pay.vue'], resolve);
const Pay3 = resolve => require(['@/views/init/pay3.vue'], resolve);
const Pay2 = resolve => require(['@/views/init/pay2.vue'], resolve);
const openView = resolve => require(['@/views/init/openView.vue'], resolve);

// 用户相关  -end

// 下载
const Download = resolve => require(['@/views/download.vue'], resolve)



Vue.use(Router);
let routes=[
    {
        path: '/',
        redirect:{name:'PanGold'}
    },
    {
        path: '/welcome',
        name:'Welcome',
        component:Welcome
    },
    {
        path: '/uploadwgt',
        name:'UploadWgt',
        component:UploadWgt
    },


    //淘金区
    {
        path:'/pan-gold',
        name:'PanGold',
        component:PanGold,
        meta:{
            keepActive:true
        }
    },
    {
        path:'/service',
        name:'Service',
        component:Service
    },
    {
        path:'/my',
        name:'My',
        component:My
    },
    {
        path:'/my2',
        name:'My2',
        component:My2
    },
    {
        path:'/bestpeak',
        name:'Bestpeak',
        component:Bestpeak
    },
    {
        path:'/bestpeak',
        name:'Bestpeak',
        component:Bestpeak
    },
    {
        path:'/mine',
        name:'Mine',
        component:Mine
    },
    {
        path:'/attorn',
        name:'Attorn',
        component:Attorn
    },
    {
        path:'/detail',
        name:'Detail',
        component:Detail
    },
    {
        path:'/invite',
        name:'Invite',
        component:Invite
    },
    {
        path:'/certify',
        name:'Certify',
        component:Certify
    },
    {
        path:'/certify2',
        name:'Certify2',
        component:Certify2
    },
    {
        path:'/capture',
        name:'Capture',
        component:Capture
    },
    {
        path:'/payinfo',
        name:'PayInfo',
        component:PayInfo
    },
    {
        path:'/addcard',
        name:'AddCard',
        component:AddCard
    },
    {
        path:'/team',
        name:'Team',
        component:Team
    },
    {
        path:'/teamlist',
        name:'TeamList',
        component:TeamList
    },
    {
        path:'/bind/:type',
        name:'Bind',
        component:Bind
    },
    {
        path:'/set',
        name:'Set',
        component:Set
    },
    {
        path:'/setpwd',
        name:'SetPwd',
        component:SetPwd
    },
    {
        path:'/shaitu',
        name:'ShaiTu',
        component:ShaiTu
    },
    {
        path:'/login',
        name:'Login',
        component:Login
    },
    {
        path:'/backpwd',
        name:'BackPwd',
        component:BackPwd
    },
    {
        path:'/pay3',
        name:'Pay3',
        component:Pay3
    },
    {
        path:'/pay',
        name:'Pay',
        component:Pay
    },
    {
        path:'/pay2',
        name:'Pay2',
        component:Pay2
    },
    {
        path:'/openview',
        name:'openView',
        component:openView
    },
    {
        path:'/close',
        name:'Close',
        component:Close
    },
    {
        path:'/close2',
        name:'Close2',
        component:Close2
    },
    {
        path:'/register',
        name:'Register',
        component:Register
    },
    {
        path:'/dial',
        name:'Dial',
        component:Dial
    },
    {
        path:'/my/middle/block-mine',
        name:'BlockMine',
        component:BlockMine
    },
    {
        path:'/my/middle/extract',
        name:'Extract',
        component:Extract
    },
    {
        path:'/my/middle/extract-record',
        name:'ExtractRecord',
        component:ExtractRecord
    },
    {
        path:'/my/middle/mining-machine',
        name:'MiningMachine',
        component:MiningMachine
    },
    {
        path:'/my/middle/turn-out',
        name:'TurnOut',
        component:TurnOut
    },
    {
        path:'/my/middle/recharge',
        name:'Recharge',
        component:Recharge
    },
    {
        path:'/pan-gold/notice',
        name:'Notice',
        component:Notice
    },
    {
        path:'/pan-gold/noticeDetail/:id',
        name:"NoticeDetail",
        component:NoticeDetail
    },
    {
        path:'/pan-gold/cDetail',
        name:"Cd",
        component:Cd
    },
    {
        path:'/pan-gold/bannerDetail',
        name:"BannerDetail",
        component:BannerDetail
    },
    {
        path:'/my/checkupdate',
        name:"CheckUpdate",
        component:CheckUpdate
    },
    {
        path:'/my/pyList',
        name:"PyList",
        component:PyList
    },
    {
        path:'/my/city',
        name:"City",
        component:City
    },
    {
        path:'/my/yDetail',
        name:"Ydetail",
        component:Ydetail
    },
    {
        path:'/my/numDetail',
        name:"NumDetail",
        component:NumDetail
    },
    {
        path:'/my/numDetail2',
        name:"NumDetail2",
        component:NumDetail2
    },
    {
        path:'/my/site',
        name:"Site",
        component:Site
    },
    {
        path:'/my/sk',
        name:"Sk",
        component:Sk
    },
    {
        path:'/my/conversion',
        name:"Conversion",
        component:Conversion
    },
    {
        path:'/my/record',
        name:"Crecord",
        component:Crecord
    },
    {
        path:'/my/pyDetail',
        name:"PyDetail",
        component:PyDetail
    },
    {
        path:'/my/addcity',
        name:"Addcity",
        component:Addcity
    },
    {
        path:'/my/rule',
        name:"Rule",
        component:Rule
    },
    {
        path:'/my/rule2',
        name:"Rule2",
        component:Rule2
    },
    {
        path:'/my/change',
        name:"Change",
        component:Change
    },
    {
        path:'/my/agreement',
        name:"Agreement",
        component:Agreement
    },
    {
        path:'/my/level',
        name:"Level",
        component:Level
    },
    {
        path:'/my/dz',
        name:"Dz",
        component:Dz
    },



// 淘金区模块  --start
    {
        path:'/pan-gold/start-mining/:level',
        name:'StartMining',
        component:StartMining
    },
    {
        path:'/pan-gold/buy-result',
        name:'BuyResule',
        component:BuyResule
    },
    {
        path:'/pan-gold/appeal',
        name:"Appeal",
        component:Appeal
    },


//客服中心
    {
        path:'/service/customer',
        name:'Customer',
        component:Customer
    },
    {
        path:'/service/help',
        name:'Help',
        component:Help
    },
    {
        path:'/service/problem',
        name:'Problem',
        component:Problem
    },
    {
        path:'/service/question-details',
        name:'QuestionDetails',
        component:QuestionDetails
    },
    {
        path:'/service/question-list',
        name:'QuestionList',
        component:QuestionList
    },
    {
        path:'/service/list',
        name:'Qlist',
        component:Qlist
    },
    {
        path:'/service/list2',
        name:'Qlist2',
        component:Qlist2
    },
    {
        path:'/ly/mill',
        name:'Mill',
        component:Mill
    },
    {
        path:'/ly/guide',
        name:'Guide',
        component:Guide
    },
    {
        path:'/ly/gList',
        name:'GL',
        component:GL
    },
    {
        path:'/ly/gDetail',
        name:'GD',
        component:GD
    },
    {
        path:'/ly/group',
        name:'Group',
        component:Group
    },
    {
        path:'/ly/generalize',
        name:'Generalize',
        component:Generalize
    },
    {
        path:'/ly/list2',
        name:'List2',
        component:List2
    },
    {
        path:'/py',
        name:'Py',
        component:Py,
        meta:{
            keepActive:true
        }
    },
    {
        path:'/py/sell',
        name:'Sell',
        component:Sell
    },
    {
        path:'/py/buy',
        name:'Sbuy',
        component:Sbuy
    },
    {
        path:'/py/line',
        name:'Line',
        component:Line
    },
    
    {
        path:'/download',
        name:'Download',
        component:Download
    },
    {
        path:'/ly',
        name:'Ly',
        component:Ly
    },
    {
        path:'*',
        name:'404Page',
        component: notFoundPage
    }
];
// routes = routes.concat(myCenterRouter);

let router = new Router({
    mode:"hash",
    routes: routes
});
router.beforeEach((to,from,next)=>{
    if(localStorage.getItem('cookie')){
        if(Util.isWhite(to.name)){
            if(to.name =='Login'){
                next({name:'PanGold'})
            }else {
                next({name:from.name});
            }
        }else {
            next();
        }
    }else {
        if(Util.isWhite(to.name)){
            next();
        }else {
            next({name:'Login'});
            // next({name:'Welcome'});
        }
    }
});

// router.beforeEach((to,from,next)=>{
//     if(localStorage.getItem('vip') ||to.name =='Login'){
//         next()
//     }else {
//         next({name:'Login'});
//     }
// });
export default router;
