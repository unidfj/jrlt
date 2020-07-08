<template>
  <div class="page">
    <!-- <m-header title="交易">
        <span class="ly">我的交易</span>
    </m-header> -->
    <!-- 头部 -->
    <div class="header">
        <div class="left">
            <!-- <span @click="$router.push({name:'Line'})">{{lang_text&&(lang!='en'?'K线图':lang_text.diagram)}}</span> -->
            <span @click="linShow = true;kline('day');buyShow = false;">{{lang_text&&(lang!='en'?'K线图':lang_text.diagram)}}</span>
             
            <!-- <span @click="$router.push({name:'Rule',query:{type:14}})">{{lang_text&&(lang!='en'?'交易':lang_text.rule)}}</span> -->
            <!-- <span>规则</span> -->
        </div>
        <p class="center">
            {{lang_text&&(lang!='en'?'交易':lang_text.transaction)}}
        </p>
        <p class="right">
            <span @click="$router.push({name:'PyList',query:{num:0}})">{{lang_text&&(lang!='en'?'我的交易':lang_text.a60)}}</span>
            <span @click="$router.push({name:'Rule',query:{type:14}})">【{{lang_text&&(lang!='en'?'规则':lang_text.rule)}}】</span>
        </p>
    </div>
    
    <scroller 
            ref="my_scroller"
            :on-refresh="refresh"
            :on-infinite="infinite">
    </scroller>
    <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">

        <!-- 内嵌网页 -->
        <!-- <iframe :src="api+'/dist/index.html#'+'/py/line'" frameborder="0"></iframe> -->
        <!-- <iframe :src="api+'/#'+'/py/line'" frameborder="0"></iframe> -->
        
        <!-- <p class="rules">交易规则：{{rule}}</p> -->
        <!-- 发布买单 -->
        <div class="buy_box" v-show="buyShow">
            <div class="box">
                    <ul>
                    <li  class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'买家':lang_text.Buyer)" readonly :value="userInfo.username">
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)" readonly :value="userInfo.mobile">
                    </li>
                    <li class="li2">
                        <p class="p_title">{{lang_text&&(lang!='en'?'购买数量':lang_text.PurchaseA)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'购买数量':lang_text.PurchaseA)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="amount1">
                        <span class="p_bot">L</span>
                    </li>
                    <li class="li2">
                        <p class="p_title">{{lang_text&&(lang!='en'?'单价':lang_text.price)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'单价':lang_text.price)"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="uprice">
                        <span class="p_bot">$/L</span>
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'单价区间':lang_text.price2)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'单价区间':lang_text.price2)" readonly :value="'$'+data3.currency_price_min+'-$'+data3.currency_price_max">
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'总金额':lang_text.totalA)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'总金额':lang_text.totalA)" readonly :value="((+amount1 * +uprice)*data3.rmb_dollar).toFixed(2)"> 
                        <span class="p_bot">￥</span>
                    </li>
                    <p class="p_bot" v-show="data3.time.start&&data3.time.end">温馨提示，交易时间为 {{data3.time.start>10?data3.time.start:('0'+data3.time.start)}}:00 - {{data3.time.end}}:00</p>
                </ul>
            </div>
            <div class="btn_box">
                <button @click="buyShow = false">取消</button>
                <button @click="$refs['pwd'].open()">发布买单</button>
            </div>
        </div>
        <!-- 折线图 -->
        <div class="line" v-show="linShow">
            <div class="top">
                <p v-for="(v,i) in topList2" :key="i" @click="change(i)" :class="{'se':se1==i}">{{v}}</p>
            </div>

            <div class="line">
                <div id="myChart" :style="{width: '100%', height: '200px'}"></div>
            </div>

            <button @click="linShow = false;se1 = 0">关闭</button>
        </div>
        <!-- 行情 -->
        <ul class="top">
            <li v-for="(v,i) in topList" :key="i">
                <p>{{v.name}}</p>
                <p v-if="lang=='en'&&(i==2||i==5||i==4)"><br/></p>
                <!-- <p>{{(+v.num).toFixed(2)}}</p> -->
                <p>{{v.num}}</p>
                <!-- <p v-if="i!=3&&i!=4">{{v.num}}</p>
                <p v-else>{{Number(v.num).toFixed(2)}}</p> -->
            </li>
        </ul>
        <!-- 索引 -->
        <ul class="center">
            <li v-for="(v,i) in cList" :key="i" @click="changeSe(i)">
                <p>
                    <span :class="{'se':se==i}">{{v}}</span>
                    <!-- <i class="iconfont iconshangxiajiantou-"></i>    -->
                      
                    <span class="r_i">
                        <i :class="{'iconfont icontubiaozhizuo-':true,'se':se==i&&(data.time==1||data.uprice==1||data.amount1==1||mr&&i==3)}" ></i>  
                        <i :class="{'iconfont icontubiaozhizuo-1':true,'se':se==i&&(data.time==0||data.uprice==0||data.amount1==0)}" v-if="i!=3"></i>   
                    </span>
  
                </p>
            </li>
        </ul>
        <!-- 输入手机号 -->
        <div class="inp" v-show="mr">
            <input type="text" :placeholder="lang_text&&(lang!='en'?'手机号':lang_text.phone)" v-model="data.mobile">
            <button @click="mS">{{lang_text&&(lang!='en'?'搜索':lang_text.a178)}}</button>
        </div>
        <!-- 商品列表 -->
        <ul class="bot">
            <li v-for="(v,i) in list" :key="i" >
                <img :src="defaultBanner" alt="">
                <div class="center">
                    <!-- <p>{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}：{{v.mobile}}</p> -->
                    <p>{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}：{{(v.mobile).substring(0,3)}}*****{{(v.mobile).substring(7,11)}}</p>
                    <p class="b_color">{{lang_text&&(lang!='en'?'单价':lang_text.price)}}：${{v.uprice}}</p>
                    <p class="b_color">{{lang_text&&(lang!='en'?'数量':lang_text.Quantity)}}：{{v.amount1}}L</p>
                    <p>{{lang_text&&(lang!='en'?'总额':lang_text.sum)}}：￥{{v.totalprice}}</p>
                </div>
                <div class="right">
                    <button @click="toDetail(v.id)">{{lang_text&&(lang!='en'?'卖给TA':lang_text.SellT)}}</button>
                    <p>{{lang_text&&(lang!='en'?'最近30天成交量':lang_text.Volume)}}：{{v.deal}}</p>
                </div>
            </li>
        </ul>

    </section>
    <m-Footer></m-Footer>
    <m-load ref="load"></m-load>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
    
    <!-- <div class="buy" @click="$router.push({name:'Sbuy'})"> -->
    <div class="buy" @click="buyShow = true;linShow = false;">
        {{lang_text&&(lang!='en'?'购买':lang_text.buy)}}
    </div>
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
            topList:[
                {
                    name:'均价(昨/今)',
                    num:'',
                },
                {
                    name:'最高(昨/今)',
                    num:'',
                },
                {
                    name:'当前',
                    num:'',
                },
                {
                    name:'成交(昨/今)',
                    num:'',
                },
                {
                    name:'买量',
                    num:'',
                },
                {
                    name:'涨跌',
                    num:'',
                },
            ],
            cList:[
                '时间',
                '单价',
                '数量',
                '手机号',
            ],
            se:0,
            rule:null,
            defaultBanner:require('@/assets/images/jr/py.png'),
            list:[],
            data:{
                time:0,
                uprice:null,
                amount1:null,
                mobile:null,
                type:1,
                state:1,
                // devide:1,
                page:1,
                op:1,
            },
            mr:false,
            lang_text:null,
            lang:null,
            noMore:false,
            screenHeight:null,
            data2:{
                rmb_dollar:null,
            },
            // 折线图
            linShow:false,
            arr1:[],
            arr2:[],
            topList2:[
                '日',
                '周',
                '月',
            ],
            se1:0,
            // 发布买单
            buyShow:false,
            seconds:0,
            type:null,
            data3:{
                currency_price_max:null,
                currency_price_min:null,
                dqprice:null,
                mobile:null,
                rmb_dollar:null,
                time:{
                    end:null,
                    start:null,
                }
            },
            uprice:null,
            amount1:null,   
        }
  },
  created() {
      this.initData();
      this.ccOrder();
      this.getCcParam();
      this.rules();
  },
  activated(){
      document.getElementsByClassName("body")[0].scrollTop = Number(sessionStorage.getItem("pageTop"));
  },
  computed: {
    ...mapGetters(['uid','api','userInfo'])
  },
  methods: {
    initData(){
        sessionStorage.setItem('btmNav',3);
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
        this.screenHeight = window.screen.height || window.screen.availHeight;

        
        this.topList[0].name = this.lang!='en'?'均价(昨/今)':this.lang_text.a1;
        this.topList[1].name = this.lang!='en'?'最高(昨/今)':this.lang_text.a2;
        this.topList[2].name = this.lang!='en'?'当前':this.lang_text.current;
        this.topList[3].name = this.lang!='en'?'成交(昨/今)':this.lang_text.a3;
        this.topList[4].name = this.lang!='en'?'买量':this.lang_text.Purchase;
        this.topList[5].name = this.lang!='en'?'涨跌':this.lang_text.a4;

        this.cList[0] = this.lang!='en'?'时间':this.lang_text.time;
        this.cList[1] = this.lang!='en'?'单价':this.lang_text.price;
        this.cList[2] = this.lang!='en'?'数量':this.lang_text.Quantity;
        this.cList[3] = this.lang!='en'?'手机号':this.lang_text.phone;

        
        this.topList2[0] = this.lang!='en'?'日':this.lang_text.day;
        this.topList2[1] = this.lang!='en'?'周':this.lang_text.week;
        this.topList2[2] = this.lang!='en'?'月':this.lang_text.month;
        
    },
    toDetail(id){
        sessionStorage.setItem("pageTop",document.getElementsByClassName("body")[0].scrollTop)
        this.$router.push({name:'Sell',query:{id}})
    },
    /**
     * 下拉刷新
     */
    refresh(){
        // history.go(0)
        // location.reload()

        this.list = [];
        // this.page = 1;
        this.data.page = 1;
        this.ccOrder();
        this.getCcParam();
        this.rules();
        setTimeout(() => {
            this.$refs.my_scroller.finishPullToRefresh();
            mui.toast('加载完毕！')
        }, 1000);
    },
    infinite(){},
    lazyLoad(){
        this.data.page = this.data.page+1;
        console.log(this.data.page)
        if(!this.noMore){
            this.ccOrder(); 
        }
    },
    mS(){
        this.list = [];
        this.ccOrder();
        this.mr = false;
    },
    // 规则
    rules(){
      Trade.rules().then(res=>{
        if(res.code==1){
            this.rule = res.msg.cc_rule;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    changeSe(i){
        if(i!=3){
            this.mr = false;
        }
        if(this.se == i){
            switch(i){
                case 0:
                    this.data.time = this.data.time==1?0:1;
                    break;
                case 1:
                    this.data.uprice = this.data.uprice==1?0:1;
                    break;
                case 2:
                    this.data.amount1 = this.data.amount1==1?0:1;
                    break;
                case 3:
                    // this.data.mobile = this.data.mobile==1?0:1;
                    
                    this.mr = !this.mr;
                    break;
            }
            this.data.page = 1;
            this.list = [];
            this.ccOrder();
            this.noMore = false;
        }else{
            this.se = i;
            this.noMore = false;
            this.list = [];
            switch(i){
                case 0:
                    this.data = {
                                    time:1,
                                    uprice:null,
                                    amount1:null,
                                    mobile:null,
                                    type:1,
                                    state:1,
                                    // devide:1,
                                    page:1,
                                    op:1,
                                }
                    break;
                case 1:
                    this.data = {
                                    time:null,
                                    uprice:1,
                                    amount1:null,
                                    mobile:null,
                                    type:1,
                                    state:1,
                                    // devide:1,
                                    page:1,
                                    op:1,
                                }
                    break;
                case 2:
                    this.data = {
                                    time:null,
                                    uprice:null,
                                    amount1:1,
                                    mobile:null,
                                    type:1,
                                    state:1,
                                    // devide:1,
                                    page:1,
                                    op:1,
                                }
                    break;
                case 3:
                    this.data = {
                                    time:null,
                                    uprice:null,
                                    amount1:null,
                                    // mobile:1,
                                    type:1,
                                    state:1,
                                    // devide:1,
                                    page:1,
                                    op:1,
                                }
                    this.mr = !this.mr;
                    // return;
                    break;
            }
            this.ccOrder();
        }
        console.log(this.se,i)
    },
    ccOrder(){
        Trade.ccOrder(this.data).then(res=>{
            if(res.code==1){
                // this.list = res.data;
                
                this.list = this.list.concat(res.data||[]);
                if(!res.data||res.data.length<10)
                this.noMore = true;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    
    getCcParam(){
        Trade.getCcParam({orderid:this.id}).then(res=>{
            if(res.code==1){
                this.data2 = res.data;
                this.data3 = res.data;
                this.topList[0].num = `$${(+res.data.zt_price_avg).toFixed(2)}/$${(+res.data.to_price_avg).toFixed(2)}`;
                this.topList[1].num = `$${(+res.data.zt_price_max).toFixed(2)}/$${(+res.data.to_price_max).toFixed(2)}`;
                this.topList[2].num = `$${(+res.data.dqprice).toFixed(2)}`;
                this.topList[3].num = `${(+res.data.zt_price_sum).toFixed(0)}/${(+res.data.to_price_sum).toFixed(0)}`;
                this.topList[4].num = `${(+res.data.sum).toFixed(0)}`;
                this.topList[5].num = `${++res.data.ups_and_downs>0?'+':'-'}${(+res.data.ups_and_downs).toFixed(2)}%`;
                
            }else{
                mui.toast(res.msg)
            }
        })
    },
    goTo(route,i){
        this.$router.push({name:route,query:{num:i}})
    },
    // K线图数据格式
    change(num){
        this.se1 = num;
        switch(num){
            case 0:
                this.kline('day')
                break;
            case 1:
                this.kline('week')
                break;
            case 2:
                this.kline('month')
                break;
        }
    },
    // K线图数据
    kline(type){
        Trade.kline({type}).then(res=>{
            if(res.code==1){
                this.arr1 = [];
                this.arr2 = [];
                (res.data).forEach((v,i)=>{
                    if(!v){ return }
                    this.arr1.unshift(v.time)
                    this.arr2.unshift((+v.trade).toFixed(2))
                })
                this.drawLine(type!='day'?'line':'bar');
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // K线图格式
    drawLine(type){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            // color:'#F04938', //  color=>线条颜色 bgc=>div背景颜色
            // color:'#4EB6AD', //  color=>线条颜色 bgc=>div背景颜色
            // color:'#007AFF', //  color=>线条颜色 bgc=>div背景颜色
            color:'#FEDA00', //  color=>线条颜色 bgc=>div背景颜色
            // title: { text: 'FC/USDT' },
            tooltip: {},
            grid:{
            // left:'0%',
            // right:'0%',
            // bottom:0,
            left:'15%',
            right:'10%',
            bottom:'15%',
            top:'10%',
            },
            xAxis: {
                type: 'category',
                // boundaryGap: false,
                // default: true,
                // data: ["9/11","9/12","9/13","9/14","9/15"],
                data: this.arr1,
                axisTick: { show:false },
                axisLine: { 
                    show:true,
                    lineStyle:{
                        color:'#fff',
                    }
                },
                // axisLine: { show:false },
                // axisLabel: {
                //     // color: "#999999", //刻度线标签颜色
                    
                //     show:false
                // }
                axisLabel:{
                    textStyle:{
                        // color:'red',
                        fontSize:"10",
                        color:'#fff'
                    },
                    // interval: 100000,
                    // showMinLabel: true,
                    // showMaxLabel: true,
                }
            },
            yAxis: { 
                default: true,
                // show :false,
                axisTick: { show:false },
                axisLine: { 
                    show:true,
                    lineStyle:{
                        color:'#fff',
                    }
                },
                color:'red',
                // textStyle:{
                //     // color:'red'
                //     show:false
                // },
                // axisLabel: {
                //   color: "red" //刻度线标签颜色
                // },
                splitLine: {     //网格线
                    "show": false
                //   color:'#416180'
                },
                
                axisLabel:{
                    textStyle:{
                        // color:'red',
                        fontSize:"10",
                        color:'#fff'
                    },
                }


            },
            series: [{
                name: '销量',
                smooth:true,
                type,
                symbol: 'none',
                // data: [20, 30, 40, 30, 35],
                data: this.arr2,
                areaStyle:{
                    // 填充
                    normal:{
                        // color:'rgba(78,182,173,0.1)',
                        color:'rgba(0,147,221,0.1)',
                    }
                },
                areaStyle: {
                    color:new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            // color: '#F09538'
                            // color: 'rgba(78,182,173,0.4)'
                            color: 'rgba(0,147,221,0.4)'
                        }, {
                            offset: 1,
                            // color: '#35322F'
                            // color: 'rgba(78,182,173,0.1)'
                            color: 'rgba(0,147,221,0.1)'
                        }])
                }
            }]
        });
    },
    
    pay(pwd){
        this.create_Buy_Order(pwd);
    },
    // 发布买单
    create_Buy_Order(pwd){
        Trade.create_Buy_Order({amount1:this.amount1,uprice:this.uprice,pwd}).then(res=>{
            mui.toast(res.msg)
            if(res.code==1){
                setTimeout(()=>{
                    // this.$router.go(0);
                    // history.go(0)
                    this.refresh();
                    this.buyShow = false;
                },500);
            }
        })
    },
    // 获得焦点
    focus_css(e){
        // p标签显示
        e.currentTarget.previousElementSibling.style.display = 'block';
        e.currentTarget.placeholder = '',
        // li底部边框变色
        // e.currentTarget.parentNode .style.borderBottom = '1px solid #0093DD';
        e.currentTarget.parentNode .style.borderBottom = '1px solid #fff';
        e.currentTarget.parentNode .style.margin = '20px 0';
        // li删除类名
        e.currentTarget.parentNode.classList.remove("li_se");

    },
    //  失去焦点
    blur_css(e){
        if((e.target.value).replace(/^(\s|\u00A0)+/,'')){
            // li添加类名
            e.currentTarget.parentNode.classList.add("li_se");
        }else{
            // p标签隐藏
            e.currentTarget.previousElementSibling.style.display = 'none';
            // li底部边框变色
            e.currentTarget.parentNode.style.borderBottom = '1px solid #F1F2F4';
            // li删除类名
            e.currentTarget.parentNode.classList.remove("li_se");

            
            e.currentTarget.placeholder = e.currentTarget.previousElementSibling.innerHTML;
        }
        e.currentTarget.parentNode .style.margin = '0px 0 5px 0';
    },
  },
  beforeRouteLeave (to, from, next) {
    if(to.path != "/py/sell") {
      from.meta.keepActive = false;
    }else {
      from.meta.keepActive = true;
    }
    next()
  }
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: @bg-color;
    position: relative;
    // 规则
    .rules{
        width: 690px;
        margin: 20px 30px 0;
        padding-left:20px; 
        color: rgba(217,75,89,1);
    }
    // 发布买单
    .buy_box{
        width: 100%;
        background-color: #fff;
        // position: absolute;
        position: fixed;
        // top: 0;
        top: 88px;
        left: 0;
        z-index: 99;
        >.box{
            width:652px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
            border-radius:20px;
            // margin: 56px 49px;
            margin: 30px 49px;
            padding: 0px 33px 32px 26px;
            background-image: url('../../assets/images/jr/bg1.png');
            ul{
                li{
                    border-bottom: 1px solid #F1F2F4;
                    margin-bottom: 5px;
                    position: relative;
                    .btn_code{
                        position: absolute;
                        right: 14px;
                        top: 24px;
                        color: #0093DD;
                    }
                    >.p_title{
                        font-size:24px;
                        color:rgba(176,190,215,1);
                        display: none;
                        margin-left: 30px;
                        color: #fff;
                    }
                    .p_bot{
                        // display: inline-block !important;
                        // width: 10px;
                        position: absolute;
                        right: 26px;
                        bottom: 18px;
                        color: #fff;
                    }
                    input{
                        flex: 1;
                        // vertical-align: middle;
                        height: 80px;
                        line-height: 80px;
                        // font-size:34px;
                        // color: #333;
                        border: none;
                        border-radius: 0;
                        margin-bottom: 0;
                        background-color: rgba(0, 0, 0, 0);
                        color: #fff;
                    }
                    &:first-child{
                        padding-top: 30px;
                    }
                }
                .li_se{
                    display: flex;
                    justify-content: space-between;
                    padding:0 22px;
                    border-bottom: 1px solid #F1F2F4 !important;
                    p{
                        // vertical-align: middle;
                        line-height: 88px;
                        margin-left: 3.5px;
                        display: block;
                        color: #fff;
                    }
                    input{
                        flex: 1;
                        // vertical-align: middle;
                        // line-height: 50px;
                    }
                }
                .p_bot{
                    color: pink;
                    margin-top: 20px;
                }
                .li2{
                    input{
                        padding-left: 28px;
                    }
                }
            }
        }
        >.btn_box{
            display: flex;
            justify-content: space-between;
            button{
                flex: 1;
                height: 88px;
                color: #fff;
                border-radius: 0;
                &:first-child{
                    background-color: #aaa;
                }
                &:last-child{
                    // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                    background:#000;
                }
            }
        }
    }
    // 折线图
    >.line{
        background-color: #fff;
        padding-bottom: 30px;
        position: absolute;
        position: fixed;
        top: 0px;
        top: 88px;
        left: 0;
        z-index: 990;
        // border-radius: 0 0 30px 30px;
        box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
        .top{
            margin: 20px 18px 0;
            display: flex;
            justify-content: space-between;
            // border: 1px solid #007AFF;
            border: 1px solid #000;
            border-radius: 10px;
            z-index: 991;
            p{
                flex: 1;
                font-size:26px;
                // color:#007AFF;
                color:#000;
                text-align: center;
                height: 58px;
                line-height: 60px;
                // border-left: 1px solid #007AFF;
                border-left: 1px solid #000;
                &:first-child{
                    border-left: none;
                }
            }
            .se{
                // background-color: #007AFF;
                background-color: #000;
                color: #fff;
            }
        }
        >.line{
            width:690px;
            height:410px;
            background-color: #000;
            border-radius:10px;
            margin: 30px;
            position: relative;
            .title{
                span{
                    font-size:32px;
                    color:rgba(255,255,255,1);
                    &:first-child{
                        position: absolute;
                        top: 26px;
                        left: 31px;
                    }
                    &:last-child{
                        position: absolute;
                        top: 26px;
                        left: 313px;
                    }
                }
            }
        }
        >button{
            width: 690px;
            // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            background:#000;
            color: #fff;
            border-radius: 10px;
            margin-left: 30px;
            height: 88px;
        }
    }
    >.top{
        margin: 30px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        padding: 40px 0 36px;
        text-align: center;
        li{
            display: inline-block;
            width: 32%;
            margin-left: 1%;
            &:nth-child(n+4){
                margin-top: 30px;
            }
            p{
                &:first-child{
                    font-size:24px;
                    font-weight: 400;
                }
                &:last-child{
                    margin-top: 12px;
                    font-size:28px;
                    // font-size:28px;
                }
            }
        }
    }
    >.center{
        width: 100%;
        background-color: #fff;
        height: 80px;
        line-height: 80px;
        display: flex;
        justify-content: space-between;
        padding: 0 56px;
        li{
            p{
                span{
                    font-size:32px;
                    color:rgba(176,190,215,1);
                    &:last-child{
                        margin-left: 6px;
                        display: inline-block;
                        width: 20px;
                        line-height: 16px;
                        vertical-align: middle;
                        >i{
                            font-size: 20px;
                            color: #B0BED7;
                        }
                        .se{
                            color: #0093DD;
                        }
                    }
                }
                .se{
                    color: #0093DD;
                }
                &:last-child{
                    span{
                        &:last-child{
                            margin-top: -6px;
                        }
                    }
                }
            }
        }
    }
    .inp{
        width: 80%;
        background-color: #fff;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        margin-left: 10%;
        margin-top: 30px;
        input{
            // width: 80%;
            display: inline-block;
            margin-bottom: 0px;
            vertical-align: middle;

        }
        button{
            display: inline-block;
            width:200px;
            height:78px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin-left: 30px;
        }
    }
    >.bot{
        margin: 30px;
        li{
            background-color: #fff;
            margin-bottom: 20px;
            border-radius: 10px;
            padding: 30px 30px 30px 20px;
            display: flex;
            justify-content: space-between;
            // box-shadow: 1px 1px 1px 1px rgba(0,0,256,0.1);
            border: 1px solid rgba(30,144,255,.25);
            >img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                // box-shadow:0px 0px 10px 0px rgba(0,147,221,0.29);
                margin-top: 56px;
                // display: inline-block;
            }
            .center{
                flex: 1;
                margin-left: 40px;
                // display: inline-block;
                p{
                    font-size:24px;
                    color:rgba(51,51,51,1);
                    text-align: left;
                    margin-top: 14px;
                    // &:nth-child(2){
                    //     color: #0093DD;
                    //     margin: 10px 0;
                    // }
                }
                .b_color{
                    color: #0093DD;
                }
            }
            .right{
                // display: inline-block;
                text-align: right;
                width: 220px;
                button{
                    width:200px;
                    height:78px;
                    background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                    border-radius:10px;
                    margin-top: 40px;
                    margin-bottom: 15px;
                }
                p{
                    font-size:20px;
                    // font-family:PingFangSC-Regular,PingFang SC;
                    // font-weight:400;
                    color:rgba(170,170,170,1);
                    text-align: center;
                }
            }
        }
    }
}
.header{
    // background-color: #fff;
    height: 88px;
    line-height: 88px;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    background-color: rgba(55,142,213,1) !important;
    .left{
        flex: 1;
        span{
            font-size:28px;
            color: #fff;
            &:first-child{
                // color:rgba(0,147,221,1);
                color: #fff;
            }
            &:last-child{
                color: #333;
                // margin-left: 44px;
                margin-left: 20px;
                color: #fff;
            }
        }
    }
    .center{
        text-align: center;
        flex: 1;
        font-size:34px;
        position: relative;
        color: #333;
        
    }
    .right{
        // flex: 1;
        text-align: right;
        font-size: 28px;
        // color: #0093DD;
        color: #fff;
        z-index: 999;
        span{

        }
    }
}
.buy{
    position: fixed;
    bottom: 118px;
    right: 30px;
    width: 100px;
    height: 100px;
    // background:linear-gradient(270deg,rgba(255,220,0,1) 0%,rgba(255,182,0,1) 100%);
    background-color: rgba(64, 39, 42, 1);
    box-shadow:0px 0px 10px 0px rgba(255,184,0,0.66);
    line-height: 100px;
    text-align: center;
    z-index: 99;
    border-radius:50%;
    color: #fff;
}

input::-webkit-input-placeholder {
  font-size: 24px !important;
  color: #fff !important;
}
input::-moz-placeholder {
  font-size: 24px !important;
  color: #fff !important;
}
input::-ms-input-placeholder {
  font-size: 24px !important;
  color: #fff !important;
}

.page{
    position: relative;
  .header {
    background-color: rgba(55,142,213,1) !important;
    span{
      color: #fff;
    }
    .center{
      color: #fff;
      font-weight: 550;
    }
  }
  
    /deep/ ._v-container{
        position: absolute;
        width: 40% !important;
        height: 450px !important;
        z-index: 10;
        left: 25%;  
        top:-166px;
    }
}
</style>
