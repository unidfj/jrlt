<template>
  <div class="page">
    <!-- <m-header :title="lang_text&&(lang!='en'?'当前':lang_text.current)+' '+title+'：'+ (+num).toFixed(2)" :canback="Boolean(1)" v-if="type!=0"> -->
    <m-header :title="lang_text&&(lang!='en'?'当前':' ')+title+'：'+ (+num).toFixed(2)" :canback="Boolean(1)" v-if="type!=0">
        <span class="ly" @click="$router.push({name:'Rule',query:{type:type}})">{{lang_text&&(lang!='en'?'规则':lang_text.rule)}}</span>
    </m-header>
    <m-header :title="title+(lang_text&&(lang!='en'?'明细':lang_text.a217))" :canback="Boolean(1)" v-else>
        <span class="ly" @click="$router.push({name:'Rule',query:{type:type}})">{{lang_text&&(lang!='en'?'规则':lang_text.rule)}}</span>
    </m-header>
    <p class="title" v-if="type==0" @click="$router.push({name:'NumDetail2',query:{type:6}})">{{(+num).toFixed(2)}} + {{(+credit6).toFixed(2)}}  ({{lang_text&&(lang!='en'?'明细':lang_text.a217)}})</p>
    <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        <!-- <p class="top">
            {{lang_text&&(lang!='en'?'当前':lang_text.current)}}{{title}}：{{num}}
        </p> -->
        <ul class="bot">
            <li v-for="(v,i) in list" :key="i">
                <p>
                    <span>{{v.remark}}</span>
                    <!-- <span>{{v.num>0?'+':''}}{{(+v.num).toFixed(2)}}</span> -->
                    <span>{{v.num>0?'+':''}}{{v.num}}</span>
                </p>
                <p>{{v.createtime}}</p>
            </li>
        </ul>

    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
export default {
  data(){
        return {
            se:0,
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            type:'0',
            list:[],
            title:null,
            lang_text:null,
            lang:null,
            
            screenHeight:null,
            noMore:false,
            page:1,
            num:0,
            credit6:null,

        }
  },
  mounted() {
        this.initData();
            //   this.ccdetails();
        this.getType();
        this.getUser();
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.type = this.$route.query.type;
        this.screenHeight = window.screen.height || window.screen.availHeight;
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
    },
    
    getUser(){
        Init.getUser().then(res=>{
            if(res.code==1){
                this.credit6 = res.data.credit6;
                switch(+this.type){
                    case 0:
                        this.num = res.data.credit2;
                        break;
                    case 1:
                        this.num = res.data.credit4;
                        break;
                    case 2:
                        this.num = res.data.credit3;
                        break;
                    case 6:
                        this.num = res.data.credit6;
                        break;
                }
            }else{
                mui.toast(res.msg)
            }
        })
    },
    lazyLoad(){
        this.page = this.page+1;
        if(!this.noMore){
            this.getType();
        }
    },
    getType(){
            switch(+this.type){
                case 0:
                    this.ccdetails('credit2')
                    this.title = this.lang!='en'?'活跃度':this.lang_text.Activity;
                    break;
                case 1:
                    this.ccdetails('credit4')
                    this.title = this.lang!='en'?'荣耀值':this.lang_text.Honor;
                    break;
                case 2:
                    this.ccdetails('credit3')
                    this.title = this.lang!='en'?'奉献值':this.lang_text.Contribution;
                    break;
                case 6:
                    this.ccdetails('credit6')
                    this.title = this.lang!='en'?'推广活跃度':'Promotion activity';
                    break;
            }
            console.log(this.type,this.title)
    },
    ccdetails(type){
        Trade.ccdetails({page:this.page,type}).then(res=>{
            if(res.code==1){
                // this.list = res.data;
                
                this.list = this.list.concat(res.data||[]);
                if(!res.data||res.data.length<10)
                this.noMore = true;
            }else{
                mui.toast(res.msg)
            }
        })
    }
  },
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    // line-height: 36px;
    background-color: @bg-color;
    // padding: 40px 30px;
    .top{
        color: #0093dd;
        font-weight: 550;
        font-size: 36px;
        text-align: center;
        margin: 60px 0 60px;
    }
    >.list{
        padding: 30px 30px 34px 26px;
        background-color: #fff;
        margin-top: 34px;
        li{
            display: flex;
            justify-content: space-between;
            margin-bottom: 23px;
            
            p{
                text-align: center;
                font-size:24px;
                font-weight:400;
                color:rgba(153,153,153,1);
                flex: 10;
                &:first-child{
                    // text-align: left;
                    // flex: 8;
                }
                &:last-child{
                    // text-align: right;
                    flex: 16;
                }
            }
            &:first-child{
                p{
                    font-size:28px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    margin-bottom: 13px;
                }
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
    }
    
    >.bot{
        margin-top: 30px;
        li{
            background-color: #fff;
            border: 10px;
            padding: 22px 30px;
            margin-bottom: 20px;
            border: 1px solid rgba(0,147,221,.3);
            p{
                &:first-child{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    span{
                        &:first-child{
                            font-size:24px;
                            font-weight:400;
                            color:rgba(51,51,51,1);
                            word-break:break-all;
                        }
                        &:last-child{
                            font-size:28px;
                            font-weight:500;
                            color:rgba(0,147,221,1);
                        }
                    }
                }   
                &:last-child{
                    font-size:24px;
                    font-weight:400;
                    color:rgba(153,153,153,1);
                }
            }
        }
    }
    
}
.ly{
    color: #333;
}

.page{
  /deep/ section .header .nav{
    background-color: rgba(55,142,213,1) !important;
    span{
      color: #fff;
    }
    .center{
      color: #fff;
      font-weight: 550;
    }
  }
}
.title{
    height: 88px;
    line-height: 88px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-weight: 550;
    font-size: 36px;
    background-color: rgba(55,142,213,1) !important;
}
</style>
