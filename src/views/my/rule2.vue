<template>
  <div class="page">
    <m-header :title="title" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div :class="{'box':true,'c2':type!=12}">
        <p class="title"><i class="iconfont icongou"></i>{{type==12?(lang_text&&(lang!='en'?'大区活跃度':lang_text.a151)):(lang_text&&(lang!='en'?'小区活跃度':lang_text.a152))}}</p>
        <div class="content" v-if="type==10">
          {{data.application_rules}}
        </div>
        <div class="content" v-else>
          {{text}}
        </div>
      </div>
      
    </section>
  </div>
</template>
<script>
import { Owner,Trade } from "@/server/server.js";
import {a} from '@/assets/commonjs/lan.js';
export default {
  data() {
    return {
      id:null,
      list: [],
      data:{
        application_rules:null,
        credit1_rule:null,
        credit2_rule:null,
        credit3_rule:null,
        credit4_rule:null,
      },
      text:null,
      type:null,
      title:null,
      lang_text:null,
      lang:null,
    };
  },
  mounted() {
    this.initData();
    this.city_rule();
    this.rules();
    this.getType();
  },
  methods: {
    initData(){
      // this.id = this.$route.params.id;
      this.type = this.$route.query.type;
      this.lang_text = Object.assign({},a);
      this.lang = localStorage.getItem('lang');
    },
    
    // 自身省市区和规则
    city_rule(){
        Trade.city_rule({type:2}).then(res=>{
            if(res.code==1){
                this.data = res.data;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 明细规则
    rules(){
      Trade.rules().then(res=>{
        if(res.code==1){
          if(this.type==99){
            this.text = res.msg.shop_rule;
            return;
          }else if(this.type==11){
            this.text = res.msg.team_rule;
            return;
          }else if(this.type==12){
            this.text = res.msg.daqu_rule;
            return;
          }else if(this.type==13){
            this.text = res.msg.xiaoqu_rule;
            return;
          }else if(this.type==14){
            // this.text = res.msg.xiaoqu_rule;
            this.text = res.msg.cc_rule;
            return;
          }
          this.text = res.msg[`credit${+this.type+2}_rule`];
        }else{
          mui.toast(res.msg)
        }
      })
    },
    getType(){
        switch(+this.type){
            case 0:
                this.title = this.lang!='en'?'活跃度规则':this.lang_text.a90;
                break;
            case 1:
                this.title = this.lang!='en'?'荣耀值规则':this.lang_text.a101;
                break;
            case 2:
                this.title = this.lang!='en'?'奉献值规则':this.lang_text.a102;
                break;
            case 10:
                this.title = this.lang!='en'?'城市合伙人规则':this.lang_text.a104;
                break;
            case 11:
                this.title = this.lang!='en'?'团队规则':this.lang_text.a179;
                break;
            case 12:
                this.title = this.lang!='en'?'大区活跃度规则':this.lang_text.a180;
                break;
            case 13:
                this.title = this.lang!='en'?'小区活跃度规则':this.lang_text.a181;
                break;
            case 14:
                this.title = this.lang!='en'?'交易规则':this.lang_text.a182;
                break;
            case -1:
                this.title = this.lang!='en'?'油规则':this.lang_text.a103;
                break;
            case 99:
                this.title = this.lang!='en'?'规则':'Rule';
                break;
        }
    },
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  height: 100%;
  background:@bg-color;
  // padding: 60px;
  
  // background-color: rgba(210, 65, 144, 1);
  // background-color: rgba(251,195,208, 1);
  background-color: #fff;
  .box{
      // background-color: rgba(210, 65, 144, 1);
      background-color: rgba(205, 105, 107, 1);
      // background-color: #fff;
      border-radius: 10px;
      width: 690px;
      margin: 20px 30px;
      padding: 30px;
      // color: #fff;
      color: #fff;
      .title{
        i{
          color: yellow;
          margin-right: 10px;
        }
      }
  }
  .c2{
      background-color: rgba(162, 145, 130, 1);
  }
}
</style>
