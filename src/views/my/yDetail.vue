<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'PETRO明细':'PETRO detailed')" :canback="Boolean(1)">
        <span class="ly" @click="$router.push({name:'Rule',query:{type:-1}})">{{lang_text&&(lang!='en'?'规则':lang_text.rule)}}</span>
    </m-header>
    <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        
        <div class="top">
            <div @click="change(0)">
                <p>{{lang_text&&(lang!='en'?'可用油余额':lang_text.a113)}}</p>
                <p>{{(info.credit1)}} L</p>
            </div>
            <div @click="change(1)">
                <p>{{lang_text&&(lang!='en'?'交易冻结':lang_text.a114)}}</p>
                <p>{{(info.credit7)}} L</p>
            </div>
        </div>

        <ul class="bot" >
            <li v-for="(v,i) in list" :key="i">
                <div>
                    <p>{{v.remark}}</p>
                    <!-- <span>{{v.num>0?'+':''}}{{(+v.num).toFixed(2)}}</span> -->
                    <div>
                        <p>{{v.num>0?'+':''}}{{(+v.num).toFixed(2)}}</p>
                        <!-- <p>{{v.dqcredit}}</p> -->
                    </div>
                </div>
                <p>
                    <span>{{v.createtime}}</span>
                    <span v-if="v.dqcredit">{{lang_text&&(lang!='en'?'可用PETRO':lang_text.a113)}}：{{(+v.dqcredit).toFixed(8)}}</span>
                </p>
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
            data:{

            },
            list:[],
            page:1,
            info:{
                credit1:'0',
                credit7:'0',
            },
            
            screenHeight:null,
            noMore:false,
            lang_text:null,
            lang:null,
        }
  },
  mounted() {
      this.initData();
      this.ccdetails();
      this.getUser();
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.screenHeight = window.screen.height || window.screen.availHeight;
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
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
    change(i){
        this.se = i;
        this.list = [];
        this.page = 1;
        if(this.se == 0){
            this.ccdetails()
        }else{
            this.ccdetails2()
        }
    },
    lazyLoad(){
        this.page = this.page+1;
        console.log(this.page)
        if(!this.noMore){
            if(this.se == 0){
                this.ccdetails()
            }else{
                this.ccdetails2()
            }
        }
    },
    ccdetails(){
        // this.page = 1;
        // this.list = [];
        Trade.ccdetails({page:this.page,type:'credit1'}).then(res=>{
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
    ccdetails2(){
        // this.page = 1;
        // this.list = [];
        Trade.ccdetails({page:this.page,type:'credit7'}).then(res=>{
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
    padding: 40px 30px;
    .top{
        display: flex;
        justify-content: space-between;
        >div{
            width: 330px;
            padding: 32px 0;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            p{
                text-align: center;
                &:first-child{
                    font-size:24px;
                    color:rgba(255,255,255,1);
                    margin-bottom: 10px;
                    
                }
                &:last-child{
                    font-size:32px;
                    font-weight:500;
                    color:rgba(255,255,255,1);
                }
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
            div{
                &:first-child{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    p{
                        flex: 10;
                        font-size:24px;
                        font-weight:400;
                        color:rgba(51,51,51,1);
                        word-break: break-all;
                    }
                    div{
                        flex: 5;
                        text-align: right;
                        p{
                            font-size:28px;
                            font-weight:500;
                            color:rgba(0,147,221,1);
                            // &:last-child{
                            //     color: red;
                            // }
                        }
                    }

                }   
            }
            >p{
                font-size:24px;
                font-weight:400;
                color:rgba(153,153,153,1);
                display: flex;
                justify-content: space-between;
                span{
                    &:nth-child(2){
                        color: red;
                    }
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
</style>
