<template>
  <div class="page">
    <m-header :title="lang!='en'?'会员等级':'Membership level'" :canback="Boolean(1)"></m-header>
    <section class="body">
        <div class="box">
            <div class="top">
                <p class="title">{{lang_text&&(lang!='en'?'当前会员等级':'Current membership level')}}</p>
                <p class="level" v-if="isreal==0">Lv0</p>
                <p class="level" v-else>{{data.level}}</p>
                <p class="bot">{{lang_text&&(lang!='en'?'当前奉献值':'Current contribution value')}} {{data.credit3}}</p>
            </div>
            <ul class="list">
                <li>
                    <div class="title">{{lang_text&&(lang!='en'?'会员等级':'Membership level')}}Lv0</div>
                    <p>
                        <span>{{lang_text&&(lang!='en'?'注册未实名认证通过的用户':'Register users who have not passed real name authentication')}}</span>
                        <span>{{lang_text&&(lang!='en'?'可以买不准卖':"You can buy it, you can't sell it")}}</span>
                    </p>
                </li>
                <li v-for="(v,i) in data.info" :key="i">
                    <div class="title">{{lang_text&&(lang!='en'?'会员等级':'Membership level')}}{{v.level}}</div>
                    <p>
                        <span>{{lang_text&&(lang!='en'?'奉献值':lang_text.Contribution)}}{{v.rule}}</span>
                        <span>{{lang_text&&(lang!='en'?'交易手续费':'Transaction fee')}}{{v.sxf}}%</span>
                    </p>
                </li>
            </ul>
        </div>
    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import {Base,Owner,Init,Trade} from '@/server/server.js';
import {a} from '@/assets/commonjs/lan.js';
import {mapGetters,mapMutations} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
export default {
  data() {
    return {
        avatar:null,
        data:{
            credit3:null,
            level:null,
            info:[],
        },
        isreal:null,
        lang:null,
        lang_text:null,
        
    };
  },
  mounted() {
    this.initData();
    this.fx_credit3();
    this.getUser();
  },
  computed:{
      ...mapGetters(['api'])
  },
  methods: {
    initData(){
      this.lang_text = Object.assign({},a);
      this.lang = localStorage.getItem('lang');
    },
    // 获取用户信息
    getUser(){
        Init.getUser().then(res=>{
            if(res.code==1){
                // this.info = res.data;
                this.isreal = res.data.isreal;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    fx_credit3(){
        Trade.fx_credit3().then(res=>{
            this.data = res.msg;
        })
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  height: 100%;
  background:@bg-color;
  .box{
      .top{
            width: 690px;
            margin: 20px 30px;
            border-radius: 20px;
            background-color: rgb(176, 209, 176);
            padding: 30px 50px; 
            >p{
                color: #fff;   
            }
            .title{
                // font-weight: 550;
                font-size: 32px;
            }
            .level{
                font-weight: 550;
                font-size: 64px;
                margin: 50px 0 36px;
            }
            .bot{
                font-size: 28px;
            }
      }
      .list{
          width: 690px;
          margin: 20px 30px;
          li{
                width: 100%;
                border-radius: 10px;
                border: 1px solid rgba(30,144,255,.25);
                padding: 20px 30px;
                margin-bottom: 20px;
                >.title{
                    font-weight: 550;
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                >p{
                    display: flex;
                    justify-content: space-between;
                    span{
                        color: #aaa;
                    }
                }
          }
      }
  }
}
</style>
