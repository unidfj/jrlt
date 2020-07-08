<template>
    <div class="page">
        <m-header title="收货地址" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="box">
                <ul>
                    <li>
                        <p class="p_title">收货人</p>
                        <input type="text" placeholder="收货人" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.name">
                    </li>
                    <li>
                        <p class="p_title">手机号码</p>
                        <input type="text" placeholder="手机号码" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.phone">
                    </li>
                    <!-- <li>
                        <p class="p_title">所在地区</p>
                        <input type="text" placeholder="所在地区" @focus='focus_css($event)' @blur='blur_css($event)'>
                    </li> -->
                    <li>
                        <p class="p_title">详细地址</p>
                        <input type="text" placeholder="详细地址" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.detail">
                    </li>
                    <li class="li_bot li_se">
                        <p class="p_title">设置为默认收货地址</p>
                        <!-- <input type="text" placeholder="身份证号" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <div class="right" :class="{'xz':se}" @click="se = !se">
                            <div></div>
                        </div>
                    </li>
                    
                    <li  class="li_se" @click="showPopup">
                        <p class="p_title">所在地区：</p>
                        <!-- <p class="se" @click="choicePay0"> -->
                        <p class="se">
                            <span>{{data.province}}</span>
                            <img :src="xia" alt="">
                        </p>
                        <p class="se">
                        <!-- <p class="se" @click="choicePay1"> -->
                            <span>{{data.city}}</span>
                            <img :src="xia" alt="">
                        </p>
                        <p class="se" >
                        <!-- <p class="se" @click="choicePay2"> -->
                            <span>{{data.area}}</span>
                            <img :src="xia" alt="">
                        </p>
                    </li>
                </ul>
            </div>
            <van-popup v-model="show">
                <van-area :area-list="areaList"  @confirm="onConfirm($event)"/>
            </van-popup>
            <button class="bot_btn" @click="add">提交</button>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {cn,en} from '@/assets/json/cn.js';
import { Area,Popup } from 'vant';
import 'vant/lib/area/style';

export default {
    name:"invite",
    data(){
        return {
            file_src:require('@/assets/images/jr/s.png'),
            xia:require('@/assets/images/jr/xia.png'),
            img1:null,
            img2:null,
            rule:{
                isCertifyCard:{
                    validate:true,
                    msg:'请输入正确的身份证号码！'
                }
            },
            se:false,
            payPicker0:new mui.PopPicker(),
            payPicker1:new mui.PopPicker(),
            payPicker2:new mui.PopPicker(),
            isDown:true,
            payList0:[],
            payList1:[],
            payList2:[],
            data:{
                name:null,
                phone:null,
                detail:null,
                region:null,
                province:'北京',
                city:'北京市',
                area:'东城区',
            },
            show: false,
            areaList:{},
        }
    },
    mounted(){
        this.initData();
        // this.getlocation(0);
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            this.areaList = Object.assign({},cn)
        },
        add(){
            Trade.add(this.data).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    
                }
            })
        },
        // 确认
        onConfirm(e){
            this.show = false;
            this.data.province = e[0]?e[0].name:'';
            this.data.city = e[1]?e[1].name:'';
            this.data.area = e[2]?e[2].name:'';
            this.data.region = this.data.province +','+ this.data.city +','+ this.data.area;
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
                if(res.code==1){
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 城市选择器
        getlocation(type,id){
            Trade.getlocation({id}).then(res=>{
                if(res.code==1){
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
                            // console.log(this.data.area)
                            break;
                    }
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        IsCertifyCard(event){
            let regex = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i;
            if (event.target.value.match(regex)) {
                this.rule.isCertifyCard.validate = true;
            } else {
                this.rule.isCertifyCard.validate = false;            
            }
        },
        isValidate(){
          if(!Util.formValidate(this.rule)|| !Util.filterData(this.formData)){
              return false;
            }else{
              return true;
            }
        },
        // 获得焦点
        focus_css(e){
            // p标签显示
            e.currentTarget.previousElementSibling.style.display = 'block';
            e.currentTarget.placeholder = '',
            // li底部边框变色
            e.currentTarget.parentNode .style.borderBottom = '1px solid #0093DD';
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
        ul{
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
                    // height: 88px;
                    // line-height: 88;
                    // font-size:34px;
                    // color: #333;
                    border: none;
                    border-radius: 0;
                    margin-bottom: 0;
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
                    vertical-align: middle;
                    line-height: 88px;
                    margin-left: 3.5px;
                    display: block;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                }
                .se{
                    width: 130px;
                    height: 48px;
                    line-height: 48px;
                    border-radius: 8px;
                    color: #0093DD;
                    border: 1px solid #0093DD;
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
            .li_bot{
                >p{
                    display: block;
                }
                >div{
                    width:102px;
                    height:60px;
                    background:rgba(229,229,229,1);
                    border-radius:31px;
                    border:3px solid rgba(229,229,229,1);
                    vertical-align: middle;
                    margin-top: 10px;
                    >div{
                        width:56px;
                        height:54px;
                        background:rgba(255,255,255,1);
                        box-shadow:-2px 4px 4px 0px rgba(0,0,0,0.1),0px 4px 23px 0px rgba(0,0,0,0.08),0px 0px 4px 0px rgba(0,0,0,0.2);
                        border-radius: 50%;
                        z-index: 10;
                    }
                }
                .xz{
                    background:#0093dd;
                    text-align: right;
                    >div{
                        float: right;
                    }
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
