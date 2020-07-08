<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'公告信息':lang_text.news)" :canback="Boolean(1)"></m-header>
    <section class="body"  :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
      
      <div class="top">
          <p v-for="(v,i) in topList" :key="i" @click="change(i)" :class="{'se':se==i}">{{v}}</p>
      </div>

      <ul class="bot" v-show="se == 0">
        <li v-for="item of noticeList" :key="item.id" @click="goto(item.id)">
                <span>{{item.title}}</span>
                <i class="iconfont iconright"></i>
        </li>
      </ul>

      <ul v-show="se == 1" class="my">
        <li v-for="(v,i) in list" :key="i">
          <div>
            <p class="name">{{v.username}}</p>
            <p class="time">{{formatDate(v.createtime)}}</p>
          </div>
          <p class="content">{{v.content}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { Owner,Trade } from "@/server/server.js";
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
  data() {
    return {
      noticeList: [],
      type:'mh',
      se:0,
      topList:[
          '系统公告',
          '我的消息',
      ],
      list:[],
      screenHeight:null,
      noMore:false,
      page:1,
      lang_text:null,
      lang:null,
    };
  },
  mounted() {
      this.initData();
      let noticeParams = {
          type: this.type,
          page: 1
      }
      this.getNotice(noticeParams)
      this.systemNew();
  },
  methods: {
    initData(){
      this.type = this.$route.query.type;
      this.screenHeight = window.screen.height || window.screen.availHeight;
      this.lang_text = Object.assign({},a);
      this.lang = localStorage.getItem('lang');

      
      this.topList[0] = this.lang!='en'?'系统公告':this.lang_text.a48;
      this.topList[1] = this.lang!='en'?'我的消息':this.lang_text.Mmessage;
    },
    
    lazyLoad(){
        this.page = this.page+1;
        if(!this.noMore){
          if(this.se == 0){
            this.getNotice();
          }else{
            this.systemNew();
          }
        }
    },
    change(i){
      this.se = i;
      this.list = [];
      this.noticeList = [];
      this.page = 1;
      this.noMore = false;
      if(this.se == 0){
        this.getNotice();
      }else{
        this.systemNew();
      }
    },
    formatDate(date){
        return Util.formatDate(date)
    },
    // 我的消息
    systemNew(){
      Trade.systemNew().then(res=>{
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
    /**
     * 公告
     */
    getNotice(params) {
      Owner.getTitle({type:'mh'}).then(res=>{
            if(res.code == 1){
                // this.noticeList = res.data;
                
                this.noticeList = this.noticeList.concat(res.data||[]);
                if(!res.data||res.data.length<10)
                this.noMore = true;
            }else {
              mui.toast(res.msg);
            }
        })
    },
    goto(id) {
        this.$router.push({name:'NoticeDetail',params:{id:id}})
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background: @bg-color;
  height: 100%;
  // padding-top: 30px;
  
  .top{
      margin: 20px 18px 0;
      display: flex;
      justify-content: space-between;
      border: 1px solid #007AFF;
      border-radius: 10px;
      p{
          flex: 1;
          font-size:26px;
          color:#007AFF;
          text-align: center;
          height: 58px;
          line-height: 60px;
          border-left: 1px solid #007AFF;
          &:first-child{
              border-left: none;
          }
      }
      .se{
          background-color: #007AFF;
          color: #fff;
      }
  }
  .bot{
      margin: 34px 0;
      background-color: #fff;
      li{
          border-bottom: 1px solid #eee;
          height: 108px;
          line-height: 108px;
          display: flex;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid rgba(0,147,221,.3);
          // border: 1px solid rgba(0,147,221,.3);
          &:first-child{
            border-top: 1px solid rgba(0,147,221,.3);
          }
          &:last-child{
              // border-bottom: none;
          }
          span{
              font-size:34px;
              color:rgba(51,51,51,1);
          }
          i{
              color: #333333;
          }
      }
  }
  .my{
    background-color: #fff;
    padding: 30px;
    li{
      margin-bottom: 20px;
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 30px;
      border: 1px solid rgba(0,147,221,.3);
      >div{
        display: flex;
        justify-content: space-between;
        .name{
          color: #333;
          font-weight: 550;
        }
        .time{
          color: #aaa;
        }
      }
      .content{
        color: #999;
      }
    }
  }
}
</style>
