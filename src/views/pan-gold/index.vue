<template>
  <div class="page">
    <div class="header" >
        <div class="left">
            <i class="iconfont icondingwei"></i>
            <span>{{city}}</span>
        </div>
        <!-- <p class="center">交易</p> -->
        <!-- <img :src="top" alt="" class="center"> -->
        
        <scroller 
              ref="my_scroller"
              :on-refresh="refresh"
              :on-infinite="infinite">
        </scroller>

        <p class="right" @click="choicePay">
          <span>{{value_}}</span>
          <i class="iconfont icontubiaozhizuo-1"></i>
          <!-- <img :src="sjx" alt=""> -->
        </p>
    </div>
    
    <section class="body"  :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
      <div class="notice" @click="notice()"> 
        <div class="notice-inner">
          <!-- <i class="iconfont icongonggao mark"></i><span style="margin:0 5px;">公告:</span> -->
          <!-- <img :src="lbUrl"> -->
          <i class="iconfont icongonggao notice_icon"></i><span style="margin:0 5px;">{{lang_text&&(lang!='en'?'公告':lang_text.announcement)}}:</span>
            <ul v-if="noticeList && noticeList.length>0" class="notice-list">
                <li class="notice-item" v-for="(item,index) in noticeList" :key="index" >{{item.title}}</li>
            </ul>
            <span v-else>{{lang_text&&(lang!='en'?'暂无':lang_text.nm)}}</span>
        </div>
      </div>
      <!-- <img class="banner" :src="bannerSrc?api+bannerSrc:defaultBanner" alt> -->
      <swiper :options="swiperOption" class="swiper-wrap" ref="mySwiper" v-if="banner.length!=0">
        <swiper-slide v-for="(item, index) in banner" :key="index">
          <img :src="api+item.image" class="title-img"  @click="$router.push({name:'BannerDetail',query:{id:item.id}})"/>
        </swiper-slide>
        <!-- 常见的小圆点 -->
        <div
          class="swiper-pagination"
          v-for="(item,index) in banner"
          :key="index"
          slot="pagination"
        ></div>
      </swiper>

      <div class="box">
        <div class="top_zw"></div>
        <div class="top">
          <ul>
            <li v-for="(v,i) in topList" :key="i" :class="{se:se == i}" @click="change(i,v.id)">{{v.name}}</li>
          </ul>
        </div>

        <div class="content">
          <ul>
            <li v-for="(v,i) in news_list" :key="i" @click="goDetail(v.id)">
              <p class="title">{{v.title}}</p>
              <!-- <p class="content">这里是内容简介这里是内容简介这里是内容简介这里是内容简这里是内容简介这里是内容简介这里是内容简介这里是内容简</p> -->
              <div class="img_box">
                <!-- <img :src="(v.join==1?api:(v.thumb).indexOf('http:')==-1?'http:':'')+v.thumb" alt=""> -->
                <div v-for="(v2,i2) in (v.thumb).split(',')" :key="i2" :class="{'d_n':!v.thumb,'one':((v.thumb).split(',')).length<3}">
                  <img alt=""  :src="'https:'+v2" :class="{'d_n':((v.thumb).split(',')).length<3&&i2==1}">
                </div>
              </div>
              <!-- <p class="time">2019-12-09 18:06</p> -->
            </li>
          </ul>
        </div>

      </div>
      
      
    </section>
    <div class="notice_new" v-show="notice_show">
    <!-- <div class="notice_new" > -->
      <div class="box">
          <img :src="logo" alt="">
          <p class="title">{{notice_data.title}}</p>
          <div v-html="notice_data.contents"></div>
      </div>
      <p @click="notice_show = false"><i class="iconfont iconclose"></i></p>
    </div>
    <m-Footer></m-Footer>
    <m-load ref="load"></m-load>

  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import {Init,Index,Base,Trade,Owner} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
const CryptoJS = require("crypto-js");
require("swiper/dist/css/swiper.css"); //引入swiper.css
import html2canvas from 'html2canvas';
import {cn,en} from '@/assets/json/cn.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
  components: {
    swiper,
    swiperSlide
  },
  data(){
      return {
        noticeList:[],
        defaultBanner:require('@/assets/images/gzlz/banner.png'),
        swiperOption: {
          loop: true,
          // autoplay: {
          //   delay: 2500,
          //   stopOnLastSlide: false,
          //   /* 触摸滑动后是否继续轮播 */
          //   disableOnInteraction: false
          // },
          // 分页器设置
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "bullets"
          }
        },
        banner: [],
        lbUrl:require('@/assets/images/jr/lb.png'),
        sjx:require('@/assets/images/jr/sjx.png'),
        top:require('@/assets/images/jr/01top.png'),
        // logo:require('@/assets/images/jr/logo1.png'),
        // logo:require('@/assets/images/jr/logo.jpg'),
        logo:require('@/assets/images/jr/logo2.jpg'),
        se:0,
        topList:[],
        news_list:[],
        // mui下拉选择
        payPicker:new mui.PopPicker(),
        payList:[
            {
                value: '1',
                text: '简体中文',
                lang:'zh-cn',
            },
            {
                value: '2',
                text: 'English',
                lang:'en',
            },
        ],
        value_:'简体中文',
        type:1,
        city:null,
        lang_text:null,
        lang:null,
        
        screenHeight:null,
        noMore:false,
        page:1,
        // notice_show:false,
        notice_show:false,
        notice_data:{
          title:null,
          contents:null,
        }
      }
  },
  // mounted() {
  created() {
      this.initData();
      this.get_language();
      this.notice_new();
      this.getImg();
      this.lang_text = Object.assign({},a);
      
  },
  activated(){
      // this.initData();
      // this.get_language();
      // this.notice_new();
      // this.getImg();
      // this.lang_text = Object.assign({},a);
      document.getElementsByClassName("body")[0].scrollTop = Number(sessionStorage.getItem("pageTop"));
  },
  computed: {
    ...mapGetters(['uid','api','bannerSrc','coinTxt','proData','n_show'])
  },
  methods: {
    ...mapMutations(['saveBanner','saveLang','saveN_show']),
    initData(){
      sessionStorage.setItem('btmNav',0);
      this.payPicker.setData(this.payList);
      this.news_list = [];

      // 多语言初始信息
      if(localStorage.getItem('lang')){
        this.lang = localStorage.getItem('lang');
      }else{
        localStorage.setItem('lang','zh-cn');
        this.lang = 'zh-cn'
      }
      this.value_ = this.lang == 'zh-cn'?'简体中文':'English';

    },
    goDetail(id){
      sessionStorage.setItem("pageTop",document.getElementsByClassName("body")[0].scrollTop)
      this.$router.push({name:'Cd',query:{id}})
    },
    
      // //定位获得当前位置信息
      // getMyLocation() {
      //     var geolocation = new qq.maps.Geolocation("QR3BZ-QON6P-YZ7DH-VUZO3-FGSIO-PVBBC", "定位");
      //     // geolocation.getIpLocation(this.showPosition, this.showErr);
      //     geolocation.getLocation(this.showPosition, this.showErr);//或者用getLocation精确度比较高
      // },
      // showPosition(position) {
      //     this.city = position.city;
      // },
      // showErr(e) {
      //     console.log("定位失败",e);
      //     // this.getMyLocation();//定位失败再请求定位，测试使用
      // },
      
      lazyLoad(){
          this.page = this.page+1;
          if(!this.noMore){
              this.get_news_list();
          }
      },
      /**
       * 下拉刷新
       */
      refresh(){
        // history.go(0)

          // location.reload()
          this.page = 1;
          this.news_list = [];
          this.get_news_list();
          setTimeout(() => {
              this.$refs.my_scroller.finishPullToRefresh();
              mui.toast('加载完毕！')
          }, 1000);
      },
      infinite(){},
      notice_new(){
        Owner.notice_new().then(res=>{
          if(res.code==1){
            if(res.msg){
              this.notice_data = res.msg;
            }
            // if(!this.n_show){
            //   this.notice_show = true;
            //   this.saveN_show(true)
            //   // localStorage.setItem('notice_show',true)
            // }
            if(!sessionStorage.getItem('notice_show')){
              this.notice_show = true;
              sessionStorage.setItem('notice_show',true)
            }
          }else{
            mui.toast(res.msg)
          }
        })
      },
      ready () {
        if(localStorage.getItem('city')){
          this.city = localStorage.getItem('city');
          return
        }
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition((r) => {
            // console.log('百度地图',r)
            this.city = r.address.city;
            localStorage.setItem('city',this.city);
            let obj = Object.assign({},cn.city_list)
            let obj2 = Object.assign({},en.city_list)
            for(let key in obj){
              if(obj[key]==this.city){
                for(let key2 in obj){
                  if(key2==key){
                    console.log(obj2[key2])
                  }
                }
              }
            }
        
        }, { enableHighAccuracy: true })
      },
      // 多语言
      get_language(){
        Trade.get_language({lang:this.lang}).then(res=>{
          if(res.code==1){
            this.get_category();
            this.getTitle();
            this.getImg();
            this.get_news_list();
            this.ready();
          }else{
            mui.toast(res.msg)
          }
        })
      },
      // 多语言切换
      choicePay(){
          let _This = this;
          this.payPicker.show(function(items) {
              _This.value_=items[0].text;
              _This.saveLang(items[0].lang)
              
              localStorage.setItem('lang',items[0].lang);
              _This.$router.go(0)
              // _This.lang = items[0].lang
              // _This.get_language();
              
          })
      },
      // 新闻列表
      get_news_list(bl){
        Base.get_news_list({page:this.page,type:this.type}).then(res=>{
          if(res.code==1){
            if(!bl){

              this.news_list = this.news_list.concat(res.data||[]);
              if(!res.data||res.data.length<10)
              this.noMore = true;
            }else{

              this.news_list = res.data;
            }
          }else{
            mui.toast(res.msg)
          }
        })
      },
      
      // 新闻分类
      get_category(){
        this.topList = [];
        Base.get_category().then(res=>{
          if(res.code==1){
            (res.data).forEach(v=>{
              this.topList.push({name:v.name,id:v.id})
            })
            // console.log(this.topList)
          }else{
            mui.toast(res.msg)
          }
        })
      },
      // 切换新闻种类
      change(i,id){
        this.se = i;
        this.news_list = [];
        this.type = id;
        this.get_news_list(true);
      },
      // 轮播图
      getImg(){
        Base.getImg().then(res=>{
          if(res.code==1){
            this.banner = res.data.bannerlist;
            setTimeout(()=>{
              const arr = document.querySelectorAll('.swiper-slide');
              const long = arr.length;
              let _this = this;
              arr[0].onclick = function(){
                console.log('_this:',_this.banner)
                _this.$router.push({name:'BannerDetail',query:{id:_this.banner[_this.banner.length-1].id}})
              }
              arr[long-1].onclick = function(){
                _this.$router.push({name:'BannerDetail',query:{id:_this.banner[0].id}})
              }
            },1000)
          }else{
            mui.toast(res.msg)
          }
        })
      },
      goTo(routeName) {
        this.$router.push({name:routeName});
      },
      /**
       * 获取公告
       */
      getTitle(){
          Index.getTitle({type:'mh'}).then(res=>{
              if(res.code == 1){
                  this.noticeList = res.data;
              }else {
                mui.toast(res.msg);
              }
          })
      },
      /**
       * 公告入口
       */
      notice(){
          this.$router.push({name:'Notice',query:{type:'mh'}});
      },
      /**
       * 获取单张banner
       */
      getBanner(){
        Index.getBanner().then(res=>{
            if(res.code == 1){
              if(res.data && res.data.banner_img && res.data.banner_img!='')
              this.saveBanner(res.data.banner_img)
            }
        })
      },
      
      formatTime(time){
        return Util.formatTime(time).substr(0,5);
      },
  },
  // beforeRouteEnter(to, from, next) { 
  //   if(from.name=='HouseholdCenter'|| from.name=='CartIndex'||from.name=='My') {
  //     sessionStorage.setItem("pageTop",0)
  //   }
  //     next()
  // },
  beforeRouteLeave (to, from, next) {
    if(to.path != "/pan-gold/cDetail") {
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

  @keyframes lunbo {
    from {
      right: -75%;
    }
    to {
      right: 75%;
    }
  }
  .swiper-wrap .title-img {
      height: 300px;width: 100%;
  }
  .notice {
        position: relative;
        // margin:0 2%;
        height: 40PX;
        line-height: 40PX;
        color: #333;
        font-size: 28px;
        // border-radius:40px;
        overflow: hidden;
        padding-left:5%;
        // background-color: rgba(50,50,40,1);
        background-color: #18689a;
        i,span {
            vertical-align: top;
            font-size: 12PX;
            color: #fff !important;
        }
        .notice-inner {
            position: absolute;right: -75%;top: 0;
            background: transparent;
            width: 120%;
            animation-name:lunbo;animation-duration:12s;animation-iteration-count:infinite;
            z-index: 2;
        }
        .notice-list {
            width: 70%;
            display: inline-block;vertical-align: top;
        }
        .notice-item {
            // color: @bg-color;
            color: #333;
            background: transparent;
            font-size: 28px;
            text-overflow: ellipsis;overflow: hidden;white-space: nowrap;
            color: #fff;
        }
        img{
          width: 38px;
          vertical-align: middle;
        }
  }
  .banner {
    width: 100%;height: 300px;
  }
  .box{
    position: relative;
    margin-bottom: 20px;
    .top{
      overflow: hidden;
      background-color: #fff;
      overflow-x:auto;/*可滑动*/
      position: relative;
      &::-webkit-scrollbar {
          background-color: #fff;
          height: 1px;
          opacity: 0;
      }
      ul{
        width: 100%;
        white-space: nowrap;/*文本不会换行，文本会在在同一行上继续*/
        padding: 0 34px;
        // overflow: hidden;
        li{
          display: inline-block;
          // min-width: 130px;
          min-width: 70px;
          font-size:32px;
          color:#333333;
          text-align: center;
          height: 88px;
          line-height: 88px;
          margin-right: 30px;
        }
        .se{
          // min-width: 130px;
          min-width: 70px;
          color: #0093DD;
          position: relative;
          &::before{
            content: '';
            width:80px;
            height:4px;
            background:rgba(0,147,221,1);
            position: absolute;
            // left: 25px;
            left: -5px;
            bottom: 0;
          }
        }
      }
    }
    .top_zw{
      width: 34px;
      height: 88px;
      position: absolute;
      right: 0;
      top: 0;
      background-color: #fff;
      z-index: 2;
    }
    .content{
      background-color: #fff;
      margin-top: 20px;
      ul{
        li{
          border-bottom: 1px solid #eee;
          padding: 30px;
          padding-bottom: 12px;
          // display: flex;
          // justify-content: space-between;
          width: 100%;
          &:last-child{
            border: none;
          }
          .title{
            font-size:28px;
            color:rgba(51,51,51,1);
            // width: 62%;
            width: 100%;
            word-break: break-all;
          }
          >div{
            margin-top: 20px;
            >div{
              display: inline-block;
              flex: 1;
              text-align: center;
              &:nth-child(2){
                margin: 0 20px;
              }
            }
            img{
              width:210px;
              height:140px;
              display: inline-block;
              // margin: 16px 0 10px 20px;
              margin-left: 30px;
              &:first-child{
                margin-left: 0;
              }
            }
          }
          .d_n{
            display: none;
          }
          .one{
            width: 100%;
            img{
              width: 100%;
              height: auto;
            }
          }
        }
      }
    }

  }
  
}

.header{
    background-color: #fff;
    height: 88px;
    line-height: 88px;
    // padding: 0 30px 0 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    z-index: 99;
    position: relative;
    
    /deep/ ._v-container{
      // height: 100% !important;
      // z-index: 10;
      // pointer-events: none;
      // pointer-events: auto;
      // width: 570px !important;
      position: absolute;
      left: 20%;
      top: 0;
      // top: -130px;
      top: -10px;
      height: 230px;
      z-index: 999;
      width: 60% !important;
      // background-color: red;
    }
    .left{
        // flex: 1;
        margin-left: 44px;
        width: 300px;;
        span{
            font-size:32px;
            &:first-child{
                color:rgba(0,147,221,1);
            }
            &:last-child{
                margin-left: 8px;
                color: rgba(24, 104, 154, 1)
                
            }
        }
        i{
          color: rgba(24, 104, 154, 1)
        }
    }
    .center{
        // text-align: center;
        // flex: 1;
        // font-size:34px;
        // color: #333;
        width: 307px;
        height: auto !important;
    }
    .right{
        // flex: 1;
        text-align: right;
        background-color: rgba(24, 104, 154, 1);
        // background-color: rgba(30, 144, 255, 1);
        width: 180px;
        text-align: left;
        padding-left: 24px;
        z-index: 99;
        box-sizing: border-box;
        border-bottom: 1px solid #fff;
        display: inline-block;
        span{
          font-size: 24px;
          // color: #B0BED7;
          // color: #fff;
          // color: rgba(24, 104, 154, 1);
          color: #fff;
        }
        i{
          color: #fff;
          font-size: 20px;
          
        }
        img{
          vertical-align: middle;
          width: 22px;
          margin-left: 4px;
        }
    }
}
.notice_new{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.3);
  z-index: 900;
  >.box{
    width: 500px;
    position: relative;
    // position: absolute;
    // top: 180px;
    // left: 125px;
    margin-top: 240px;
    margin-left: 125px;
    background-color: #fff;
    border-radius: 30px;
    z-index: 991;
    text-align: center;
    padding: 80px 30px 30px;
    // max-height:1000px;
    // overflow: hidden;
    >img{
      width: 160px;
      position: absolute;
      top: -80px;
      left: 170px;
      border: 12px solid #fff;
      border-radius: 20px;
    }
    .title{
      color: rgba(55,142,213,1);
      font-style: 32px;
      font-weight: 550;
    }
    >div{
      margin-bottom: 30px;
      overflow: hidden;
      max-height:430px;
      // overflow-y: scroll;
      overflow-y: auto;
      /deep/ p{
        display: block;
        overflow-y: scroll;
        color: #333;
        word-break: break-all !important;
        width: 100%;
      }
    }
  }
  >p{
    text-align: center;
    margin-top: 40px;
    >i{
      font-size:40px;
      color: #fff;  
      border: 1px solid #fff;
      border-radius: 50%;
    }
  }
}
.page{
  position: relative;
}
</style>
<style lang="less">
// ._v-container {
//   height: 300px!important;
//   margin-top: -40PX!important;
//     z-index: 1;
// }
// ._v-container>._v-content>.loading-layer .spinner-holder .spinner, ._v-container>._v-content>.pull-to-refresh-layer .spinner-holder .spinner{
//     margin-top: 0!important;
//     fill: white!important;
//     stroke: white!important;
//     z-index: 1;
// }
</style>
