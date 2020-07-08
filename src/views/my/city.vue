<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'城市大厅':lang_text.a53)" :canback="Boolean(1)">
        <!-- <span class="ly" @click="$router.push({name:'Rule',query:{type:10}})">{{lang_text&&(lang!='en'?'规则':lang_text.rule)}}</span> -->
    </m-header>

    <section class="body">
        
        <div class="box">
            <div class="top">
                <p v-for="(v,i) in topList" :key="i" @click="se = i" :class="{'se':se==i}">{{v}}</p>
            </div>
        </div>
        
        <ul class="list" v-show="se==0">
            <li>
                <p>{{lang_text&&(lang!='en'?'所在城市':'City')}}</p>
                <p>{{lang_text&&(lang!='en'?'城市合伙人':lang_text.a54)}}</p>
                <p>{{lang_text&&(lang!='en'?'联系方式':lang_text.Cdetails)}}</p>
                <p>{{lang_text&&(lang!='en'?'等级':lang_text.grade)}}</p>
            </li>

            <li v-for="(v,i) in list" :key="i">
                <p>{{v.city+v.area}}</p>
                <p>{{v.name}}</p>
                <p>{{v.mobile}}</p>
                <p>{{v.levelname}}</p>
            </li>
        </ul>

        <div class="city" v-show="se==1">
            <div v-if="data.type != 0">
                <button>{{data.type ==1?lang_text&&(lang!='en'?'已申请':lang_text.a173):lang_text&&(lang!='en'?'申请中':lang_text.a174)}}</button>
            </div>
            <div v-else>
                
                <p v-if="!data.content">{{lang_text&&(lang!='en'?'您还未成为城市合伙人':lang_text.a55)}}</p>
                <p v-if="!data.content">{{lang_text&&(lang!='en'?'点击申请成为城市合伙人':lang_text.a56)}}</p>
                <p v-else>{{data.content}}</p>
                <!-- <button @click="$router.push({name:'Addcity'})" v-if="data.type == 0">{{lang_text&&(lang!='en'?'立即申请':lang_text.a57)}}</button> -->
            </div>
            
            <p class="rule">{{data.application_rules}}</p>
        </div>
        
        <button @click="$router.push({name:'Addcity'})" v-if="data.type == 0">{{lang_text&&(lang!='en'?'立即申请':lang_text.a57)}}</button>



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
            topList:[
                '全部',
                '我的城市',
            ],
            se:0,
            list:[],
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            lang_text:null,
            lang:null,
            data:{
                application_rules:null,
                city:null,
                district:null,
                province:null,
                type:null,
            },
        }
  },
  mounted() {
      this.initData();
      this.city_all();
      this.city_rule();
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');

        this.topList[0] = this.lang!='en'?'全部':this.lang_text.All;
        this.topList[1] = this.lang!='en'?'我的城市':this.lang_text.Mcity;
    },
    
    city_all(){
        Trade.city_all().then(res=>{
            if(res.code==1){
                this.list = res.data;
            }else{
                mui.toast(res.msg)
            }
        })
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
  },
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: @bg-color;
    .top{
        margin: 20px 18px 0;
        display: flex;
        justify-content: space-between;
        border: 1px solid #0093DD;
        border-radius: 10px;
        p{
            flex: 1;
            font-size:26px;
            color:#0093DD;
            text-align: center;
            height: 62px;
            line-height: 64px;
            border-left: 1px solid #0093DD;
            &:first-child{
                border-left: none;
            }
        }
        .se{
            background-color: #0093DD;
            color: #fff;
        }
    }
    >.list{
        padding: 30px 30px 34px 26px;
        background-color: #fff;
        margin-top: 34px;
        // background-color: rgba(210, 65, 144, 1);
        background-color: rgba(251,195,208, 1);
        li{
            display: flex;
            justify-content: space-between;
            margin-bottom: 23px;
            border-bottom: 1px solid #eee;
            &:first-child{
                border-bottom: none;
            }
            p{
                text-align: center;
                font-size:24px;
                font-weight:400;
                color:rgba(153,153,153,1);
                flex: 10;
                color: #fff;
                &:first-child{
                    text-align: left;
                    flex: 8;
                }
                &:last-child{
                    text-align: right;
                    flex: 6;
                }
                // &:nth-child(2){
                //     flex: 8;
                // }
            }
            &:first-child{
                p{
                    font-size:28px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    margin-bottom: 13px;
                    color: #fff;
                }
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
    }
    >.city{
        // padding-top: 104px;
        padding-top: 30px;
        // background-color: rgba(210, 65, 144, 1);
        background-color: rgba(251,195,208, 1);
        width: 690px;
        margin: 30px;
        border-radius: 10px;
        padding-bottom: 20px;
        p{
            font-size:24px;
            color:rgba(153,153,153,1);
            text-align: center;
            color: #fff;
                
        }
        button{
            width:600px;
            height:88px;
            // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin: 60px 45px 20px;
            background-color: #000;
            color: #fff;
        }
        .rule{
            color: #fff;
            margin-top: 30px;
        }
    }
    >button{
        width:600px;
        height:88px;
        // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 60px 75px 20px;
        background-color: #000;
        color: #fff;
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
