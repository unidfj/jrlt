<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'申请城市合伙人':lang_text.a49)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="box">
                <ul>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'姓名':lang_text.username)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'姓名':lang_text.username)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.name">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'手机号码':lang_text.phone)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'手机号码':lang_text.phone)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.mobile">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'微信账号':lang_text.a50)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'微信账号':lang_text.a50)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.wx">
                    </li>
                    <li  class="li_se"  @click="showPopup">
                        <p class="p_title">{{lang_text&&(lang!='en'?'所在地区':lang_text.Area)}}</p>
                        <p class="se">
                            <span>{{data.province}}</span>
                            <img :src="xia" alt="">
                        </p>
                        <p class="se">
                            <span>{{data.city}}</span>
                            <img :src="xia" alt="">
                        </p>
                        <p class="se">
                            <span>{{data.area}}</span>
                            <img :src="xia" alt="">
                        </p>
                    </li>
    
                </ul>
            </div>
            <button class="bot_btn"  @click="city_apply">{{lang_text&&(lang!='en'?'提交审核':lang_text.a51)}}</button>
        </section>
        
        <van-popup v-model="show">
            <van-area :area-list="areaList"  @confirm="onConfirm($event)"/>
        </van-popup>
        <m-load ref="load"></m-load>
        <m-pwd ref="pwd" @pay="pay"></m-pwd>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
import {cn,en} from '@/assets/json/cn.js';
import { Area,Popup } from 'vant';
import 'vant/lib/area/style';
export default {
    components:{
        mPwd
    },
    name:"invite",
    data(){
        return {
            xia:require('@/assets/images/jr/xia.png'),
            payPicker0:new mui.PopPicker(),
            payPicker1:new mui.PopPicker(),
            payPicker2:new mui.PopPicker(),
            isDown:true,
            payList0:[],
            payList1:[],
            payList2:[],
            lang_text:null,
            lang:null,
            show:false,
            areaList:null,
            data:{
                name:null,
                mobile:null,
                wx:null,
                // province:'加载中',
                // city:'加载中',
                // area:'加载中',
                province:'北京',
                city:'北京市',
                area:'东城区',
            }
        }
    },
    mounted(){
        this.initData();
        this.city_rule();
        // this.getlocation(0);
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            // this.payPicker.setData(this.payList)
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            this.areaList = Object.assign({},this.lang!='en'?cn:en)
            this.data.province = this.areaList.province_list[110000];
            this.data.city = this.areaList.city_list[110100];
            this.data.area = this.areaList.county_list[110101];
        },
        // 位置信息
        city_rule(){
            Trade.city_rule().then(res=>{
                if(res.code==1){
                    
                    this.data.province = res.data.province;
                    this.data.city = res.data.city;
                    this.data.area = res.data.district
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 确认
        onConfirm(e){
            this.show = false;
            this.data.province = e[0]?e[0].name:'';
            this.data.city = e[1]?e[1].name:'';
            this.data.area = e[2]?e[2].name:'';
            // this.data.region = this.data.province +','+ this.data.city +','+ this.data.area;
            // console.log(this.data)
        },
        showPopup() {
            this.show = true;
            setTimeout(()=>{
                document.querySelector('.van-picker__cancel').onclick = ()=>{this.show = false}
                document.querySelector('.van-popup--center').style.position = 'fixed';
                document.querySelector('.van-popup--center').style.left = '0';
                document.querySelector('.van-popup--center').style.right = '0';
                document.querySelector('.van-popup--center').style.bottom = '0';
            },100)
        },
        choicePay0(){
            let _This = this;
            this.payPicker0.show(function(items) {
                _This.data.province = items[0].text;
                _This.data.city = '加载中';
                _This.data.district = '加载中';
                _This.getlocation(1,items[0].value)
            });
        },
        choicePay1(){
            let _This = this;
            this.payPicker1.show(function(items) {
                _This.data.city = items[0].text;
                _This.data.district = '加载中';
                _This.getlocation(2,items[0].value)
            });
        },
        choicePay2(){
            let _This = this;
            this.payPicker2.show(function(items) {
                _This.data.area = items[0].text;
            });
        },
        // 提交申请
        city_apply(){
            Trade.city_apply(this.data).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 城市选择器
        getlocation(type,id){
            Trade.getlocation({id}).then(res=>{
                if(res.code==1){
                    console.log(type)
                    switch(type){
                        case 0:
                            this.payList0 = [];
                            (res.data.result[0]).forEach((v,i)=>{
                                this.payList0.push({value:v.id,text:v.fullname})
                            })
                            this.payPicker0.setData(this.payList0)
                            this.getlocation(1,this.payList0[0].value);
                            this.data.province = this.payList0[0].text;
                            break;
                        case 1:
                            this.payList1 = [];
                            (res.data.result[0]).forEach((v,i)=>{
                                this.payList1.push({value:v.id,text:v.fullname})
                            })
                            this.payPicker1.setData(this.payList1)
                            this.getlocation(2,this.payList1[0].value);
                            this.data.city = this.payList1[0].text;
                            break;
                        case 2:
                            this.payList2 = [];
                            (res.data.result[0]).forEach((v,i)=>{
                                this.payList2.push({value:v.id,text:v.fullname})
                            })
                            this.payPicker2.setData(this.payList2)
                            this.data.area = this.payList2[0].text;
                            console.log(this.data.area)
                            break;
                    }
                }else{
                    mui.toast(res.msg)
                }
            })
        },

        pay(pwd){
            
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
    }
}
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
        padding: 0px 33px 32px 26px;
        // background-color: rgba(210, 65, 144, 1);
        background-color: rgba(251,195,208, 1);
        ul{
            li{
                border-bottom: 1px solid #F1F2F4;
                margin-bottom: 5px;
                >.p_title{
                    font-size:24px;
                    // color:rgba(176,190,215,1);
                    display: none;
                    margin-left: 30px;
                    color: #fff;
                }
                input{
                    flex: 1;
                    // vertical-align: middle;
                    // font-size:34px;
                    // color: #333;
                    border: none;
                    border-radius: 0;
                    margin-bottom: 0;
                    background-color: rgba(0, 0, 0, 0);
                    color:#fff;
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
                    line-height: 88px;
                    margin-left: 3.5px;
                    display: block;
                    color: #fff;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                    color:#fff;
                    height: 80px;
                    line-height: 80px;
                }
                .se{
                    width: 130px;
                    height: 48px;
                    line-height: 48px;
                    border-radius: 8px;
                    color: #0093DD;
                    border: 1px solid #0093DD;
                    // border: 1px solid #fff;
                    font-size: 24px;
                    padding-left: 12px;
                    margin-top: 18px;
                    img{
                        margin-left: 4px;
                        width: 12px;
                        vertical-align: middle;
                    }
                    span{
                        display: inline-block;
                        width:70%;
                        white-space: nowrap;
                        overflow: hidden;
                        vertical-align: middle;
                        text-overflow: ellipsis;
                    }
                }
            }
            .li_file{
                border-bottom: none;
                .title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: block;
                    margin: 30px 20px 20px;;
                }
                .zy{
                    display: block;
                    font-size:24px;
                    color:rgba(255,184,0,1);
                    margin-top: 21px;
                    margin-left: 10px;
                }
                .bot{
                    display: flex;
                    justify-content: space-between;
                    >div{
                        width:291px;
                        background:rgba(238,238,238,1);
                        border-radius:8px;
                        text-align: center;
                        padding: 42px 0 39px;
                        position: relative;
                        .zw{
                            width: 45px;
                        }
                        .zw2{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }
                        input{
                            width:291px;
                            height: 100%;
                            position: absolute;
                            opacity: 0;
                            // display: none;
                            top: 0;
                            left: 0;
                            z-index: 99;
                        }
                        p{
                            font-size:24px;
                            color:rgba(153,153,153,1);
                            margin-top: 6px;
                        }
                    }
                }

            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 50px 75px;
        background-color: #000;
        color: #fff;
    }
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
</style>
