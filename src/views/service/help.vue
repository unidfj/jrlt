<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'问题反馈':lang_text.feedback)" :canback="Boolean(1)">
      <!-- <span style="color:#fff;" @click="goTo('Problem')">{{lang_text&&(lang!='en'?'提交问题':lang_text.a85)}}</span> -->
      <span style="color:#fff;" @click="goTo('Qlist')">{{lang_text&&(lang!='en'?'提交问题':lang_text.a85)}}</span>
    </m-header>
    <div class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
      <div class="top">
        <p :class="{'se':se==0}" @click="chang(0)">{{lang_text&&(lang!='en'?'已处理':'Processed')}}</p>
        <p :class="{'se':se==1}" @click="chang(1)"> {{lang_text&&(lang!='en'?'处理中':'In processing')}}</p>
      </div>
      <ul>
        <li class="list" v-for="item in list" :key="item.id" @click="goTo('QuestionDetails', item.id)">
          <span>{{item.question}}</span>
          <i class="iconfont iconright"></i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Help,Trade } from "@/server/server.js";
import {a} from '@/assets/commonjs/lan.js';
export default {
  data() {
    return {
      list: [],
      page:1,
      screenHeight:null,
      noMore:false,
      lang_text:null,
      lang:null,
      se:0,
      arr1:[],
      arr2:[],
      answer:'had',
    };
  },
  mounted() {
    this.screenHeight = window.screen.height || window.screen.availHeight;
    this.feedBack();
    
    this.lang_text = Object.assign({},a);
    this.lang = localStorage.getItem('lang');
  },
  methods: {
    
    lazyLoad(){
        if(!this.noMore){
            this.page = this.page+1;
            this.feedBack(); 
        }
    },
    chang(i){
      if(this.se==i) return;
      this.se = i;
      this.page = 1;
      this.list = [];
      switch(+i){
        case 0:
          this.answer = 'had';
          break;
        case 1:
          this.answer = 'ing';
          break;
      }
      this.feedBack();
    },
    feedBack(){
      Trade.feedBack({page:this.page,answer:this.answer,pid:0}).then(res=>{
        if(res.code==1){
          // this.list = res.data;
          
          this.list = this.list.concat(res.data.question||[]);
          if(!res.data.question||res.data.question.length<20)
          this.noMore = true;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    goTo(routerName, id) {
      this.$router.push({ name: routerName, query:{ id,answer:this.answer}});
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background: @bg-color;
  font-size: 32px;
  padding-top: 30px;
  .top{
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid rgba(55,142,213,1);
    width: 690px;
    margin: 0 30px;
    height: 68px;
    line-height: 68px;
    margin-bottom: 20px;
    p{
      flex: 1;
      color: rgba(55,142,213,1);
      text-align: center;
      background-color: #fff;
      &:last-child{
        border-left: 1px solid rgba(55,142,213,1);
      }
    }
    .se{
      background-color: rgba(55,142,213,1);
      color: #fff;
    }
  }
  .list {
    .display-flex();
    justify-content: space-between;
    padding: 30px;
    background-color: #fff;
    color: #333;
    border-bottom: 1px solid rgba(0,147,221,.3);
    // border: 1px solid rgba(0,147,221,.3);
    &:first-child{
      border-top: 1px solid rgba(0,147,221,.3);
    }
    span{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
