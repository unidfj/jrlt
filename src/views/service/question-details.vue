<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'问题详情':lang_text.a171)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="box">
                <ul>
                    <!-- <li class="li_se"  @click="choicePay">
                        <p class="p_title">{{lang_text&&(lang!='en'?'问题类型':'Type')}}：<span>{{value_}}</span> </p>
                    </li> -->
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'问题描述':lang_text.a43)}}：<span>{{data.question}}</span> </p>
                        <!-- <input type="text" placeholder="问题描述：" @focus='focus_css($event)' @blur='blur_css($event)' v-model="ask"> -->
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'后台回复':lang_text.a172)}}：<span>{{data.connect}}</span> </p>
                        <!-- <input type="text" placeholder="问题描述：" @focus='focus_css($event)' @blur='blur_css($event)' v-model="ask"> -->
                    </li>
                    <li v-if="data.img">
                        <div class="img_box" v-for="(v,i) in (data.img).split(',')" :key="i">
                          <!-- <span>{{v}}</span> -->
                          <img :src="api+v" alt="">
                        </div>
                    </li>
                </ul>
            </div>
            <!-- <button class="bot_btn"  @click="feedBack">提交</button> -->
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import { Help,Trade } from "@/server/server.js";
import {a} from '@/assets/commonjs/lan.js';
import {mapGetters}  from 'vuex';
export default {
  data() {
    return {
      details: null,
      question:null,
      data:{
        question:null,
        connect:null,
        img:'',
      },
      page:1,
      lang_text:null,
      lang:null,
      payPicker:new mui.PopPicker(),
      payList:[],
      value_:'',
      id:null,
      answer:null,
    };
  },
  mounted() {
    // this.question = this.$route.query.question;
    // this.page = this.$route.query.page;
    this.id = this.$route.query.id;
    this.answer = this.$route.query.answer;
    this.lang_text = Object.assign({},a);
    this.lang = localStorage.getItem('lang');
    this.feedBack();
    this.feedbackdetails();
  },
  computed:{
      ...mapGetters(['uid','userInfo','api'])
  },
  methods: {
    feedbackdetails(){
      Trade.feedbackdetails({fid:this.id}).then(res=>{
        if(res.code==1){
          this.data = res.data;
          console.log(this.data)
        }else{
          mui.toast(res.msg)
        }
      })
    },
    feedBack(){
      Trade.feedBack({page:this.page,answer:this.answer}).then(res=>{
        if(res.code==1){
          (res.data.category).forEach((v,i)=>{
            this.payList.push({
              text:v.name,
              value:v.id
            })
          })
          this.payPicker.setData(this.payList);
          this.value_ = (res.data.category).length!=0?res.data.category[0].name:'';
          // if((res.data.question).length!=0){
          //   (res.data.question).forEach(v=>{
          //     if(v.id==this.id){
          //       this.data = v;
          //     }
          //   })
          // }
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 种类切换
    choicePay(){
        let _This = this;
        this.payPicker.show(function(items) {
            _This.value_=items[0].text;
            // _This.lang = items[0].lang
            // _This.get_language();
            
        })
    },
  }
};
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: @bg-color;
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 56px 49px;
        padding: 0px 33px 50px 26px;
        ul{
            padding-top: 30px;
            li{
                border-bottom: 1px solid #F1F2F4;
                margin-bottom: 5px;
                >.p_title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: none;
                    margin-left: 30px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                    // font-size:34px;
                    // color: #333;
                    border: none;
                    border-radius: 0;
                    margin-bottom: 0;
                }
                &:first-child{
                    // padding-top: 30px;
                    // margin-top: 30px;
                }
                .img_box{
                  width: 100%;
                  img{
                    width: 100%;
                    margin-top: 10px;
                  }
                }
            }
            .li_se{
                display: flex;
                justify-content: space-between;
                padding:10px 22px;
                border-bottom: 1px solid #F1F2F4 !important;
                // height: 88px !important;
                // line-height: 88px !important;
                &:last-child{
                  // margin-top: 50px;
                }
                p{
                    vertical-align: middle;
                    margin-left: 3.5px;
                    margin-bottom: 10px;
                    span{
                      color: #333;
                    }
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                }
                >.p_title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: block;
                    // margin-left: 30px;
                }
            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 50px 75px;
    }
}

</style>
