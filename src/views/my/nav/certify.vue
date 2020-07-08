<template>
    <div class="page">
        <!-- <m-header :title="lang_text&&(lang!='en'?'实名认证':lang_text.Verified)" :canback="Boolean(1)"></m-header> -->
        <div class="header">
            <i class="left iconfont iconback" @click="$router.push({name:'My2'})"></i>
            <div class="center">{{lang_text&&(lang!='en'?'实名认证':lang_text.Verified)}}</div>
        </div>
        <section class="body">
            <!-- <div class="box" v-if="isreal!=1">
                <ul>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'真实姓名':lang_text.a115)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'真实姓名':lang_text.a115)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.realname">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'身份证号':lang_text.a170)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'身份证号':lang_text.a170)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.creditid">
                    </li>
                    <li class="li_file">
                        <p class="title">{{lang_text&&(lang!='en'?'上传身份证':lang_text.a117)}}</p>
                        <div class="bot">
                            <div>
                                <input type="file" class="file" accept="image/*" @change="change($event,true)">
                                <img :src="img1" alt="" class="zw2">
                                <img :src="file_src" alt="" class="zw">
                                <p class="p_bot">{{lang_text&&(lang!='en'?'上传身份证正面':lang_text.a116)}}</p>
                            </div>
                            <div>
                                <input type="file" class="file" accept="image/*" @change="change($event,false)">
                                <img :src="img2" alt="" class="zw2">
                                <img :src="file_src" alt="" class="zw">
                                <p class="p_bot">{{lang_text&&(lang!='en'?'上传身份证反面':lang_text.a118)}}</p>
                            </div>
                        </div>
                        <p class="zy">{{lang_text&&(lang!='en'?'注意：实名认证需扣除 1 L 油':lang_text.a120)}}</p>
                    </li>
                </ul>
            </div>
            <div class="box" v-else>
                <ul>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'真实姓名':lang_text.a115)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'真实姓名':lang_text.a115)" v-model="data.realname" readonly>
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'身份证号':lang_text.a170)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'身份证号':lang_text.a170)" v-model="data.creditid" readonly>
                    </li>
                </ul>
            </div>
            <p class="box_bot" v-if="isreal==1"><span>{{lang_text&&(lang!='en'?'实名认证已完成':'Real name authentication completed')}}</span></p> -->
            
            <!-- <button class="bot_btn"  @click="$refs['pwd'].open()" v-if="isreal!=1">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button> -->


        <button class="bot_btn"  v-if="isreal==1" >已实名</button>
        <button class="bot_btn"  @click="goTo" v-else :class="{'c_g':!verify_token}">去实名</button>
        
            
        <!-- <button class="bot_btn"  @click="createView">openView</button>
        <button class="bot_btn"  @click="$router.push({name:'Close'})">Close</button> -->
        </section>
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
export default {
    components:{
        mPwd
    },
    name:"invite",
    data(){
        return {
            file_src:require('@/assets/images/jr/s.png'),
            img1:null,
            img2:null,
            rule:{
                isCertifyCard:{
                    validate:true,
                    msg:'请输入正确的身份证号码！'
                }
            },
            data:{
                creditid:null,
                realname:null,
                card_file_z:null,
                card_file_f:null,
            },
            lang_text:null,
            lang:null,
            isreal:null,
            verify_token:null,
            obj:null,
            type:null,
            show:false,
            pay_list:[
                {
                    name:'支付宝支付',
                    type:2,
                    icon:'iconfont iconalipay'
                },
                {
                    name:'微信支付',
                    type:3,
                    icon:'iconfont iconwechat'
                },
            ],
            paytype:2,
        }
    },
    created(){
        window.back3 = this.back3;
    },
    mounted(){
        this.initData();
        this.getUser();
        this.getToken2();
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            // this.formData.id = this.uid;
            // this.formData.mobile = this.userInfo.mobile;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            localStorage.setItem('goto',null);
        },
        back3(i){
            this.initData();
            this.getUser();
            this.getToken2();
        },
        // 获取实名的token
        getToken2(){
            Trade.getToken2().then(res=>{
                if(res.code==1){
                    this.verify_token = res.data.result.verify_token;
                    localStorage.setItem('verify_token',this.verify_token)
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 跳转到实名认证
        goTo(){
            if(!this.verify_token){
                return;
            }
            let url2 = `https://brain.baidu.com/face/print/?token=${this.verify_token}&successUrl=${this.api+'/dist/index.html%23/certify'}&failedUrl=${this.api+'/dist/index.html%23/certify?type=2'}`
            let url = this.api+'/dist/index.html#/openview?cookie='+localStorage.getItem("cookie")+'&verify_token='+this.verify_token;
            try {
                if(plus){
                    // console.log('url',url)
                    plus.webview.open(url)
                }
            }catch(e){
                // console.log('url',url)
                location.href = url2;
            }
        },
        createView(){
            let url = this.api+'/dist/index.html#/openview?cookie='+localStorage.getItem("cookie")+'&verify_token='+this.verify_token;
            try {
                if(plus){
                    console.log('url',url)
                    plus.webview.open(url)
                }
            }catch(e){
                // console.log('url',url)
                mui.toast('意外错误')
            }
        },
        getUser(){
            Init.getUser().then(res=>{
                if(res.code==1){
                    this.data.creditid = res.data.creditid;
                    this.data.realname = res.data.realname;
                    this.isreal = res.data.isreal;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        pay(paypwd){
            this.changeisreal(paypwd);
        },
        // 实名
        changeisreal(paypwd){
            var obj = Object.assign({},this.data,{paypwd})
            Init.changeisreal(obj).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    this.$router.go(0)
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
        
        change(event,bl){
            let _This = this;
            let formData = new FormData();
            Load.loadStart(_This);            
            if(!event.target.files[0]){
                Load.loadEnd(_This);
                return;
            }           
            Util.uploadImgLimit(event.target.files[0],url=>{
                formData.append('image',url);
                Base.upload(formData).then((res)=>{
                    Load.loadEnd(_This);
                    if(res.code == 1){
                        if(bl){
                            this.img1 = this.api+res.data;
                            this.data.card_file_z = res.data;
                        }else{
                            this.img2 = this.api+res.data;
                            this.data.card_file_f = res.data;
                        }
                    }else {
                        mui.toast(res.msg);
                        return ;
                    }
                })
            })
        },
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: @bg-color;
    padding-top: 200px;
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 56px 49px;
        padding: 0px 33px 32px 26px;
        border: 1px solid rgba(0,147,221,.3);
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
                    line-height: 88px;
                    margin-left: 3.5px;
                    display: block;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                    padding-top: 14px;
                    padding-left: 0;
                    font-size: 28px;
                    padding-left: 30px;
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
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 50px 75px;
    }
    .box_bot{
        margin: 0 auto;
        text-align: center;
        span{
            color: rgba(0,147,221,.8);
            border: 1px solid rgba(0,147,221,.3);
            border-radius: 20px;
            padding: 20px;
        }
    }
    .c_g{
        background: rgba(0, 0, 0,.3) !important;
    }
}
.page{
    position: relative;
    .ale{
        z-index: 99;
        position: absolute;
        background-color: #ccc;
        top: 300px;
        width: 100%;
        left: 75px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        width: 600px;
        border-radius: 16px;
        padding-top: 20px;
        li{
            height: 100px;
            line-height: 100px;
            padding: 0 60px;
            >i{
                color: #fff;
            }
            .c_g{
                color: #378ed5 ;
            }
            .b_g{
                border: 1px solid #378ed5;
                border-radius: 50%;
                box-sizing: border-box;
                font-size: 28px;
            }
            p{  
                display: inline-block;
                margin-left: 30px;
                font-size: 36px;
                color: #000;
                i{
                    color: #378ed5;
                    font-size: 44px;
                    margin-right: 10px;
                }
            }
            &:nth-child(2){
                p{
                    i{
                        color: #04BE02;
                    }
                }
            }
        }
        
        .sq{
            width: 540px;
            height: 88px;
            background-color: red;
            margin: 30px;
        }
        .form-inline{
            width: 100%;
            // margin: 0 75px;
            border: 10%;
            overflow: hidden;
        }
    }
    .header{
        width: 100%;
        height: 80px;
        line-height: 80px;
        display: flex;
        justify-content: space-between;
        background-color: #378ed5;
        .center{
            text-align: center;
            font-size: 17PX;
            // color: #fff;
            // color: #333333;
            color: #fff;
            font-size: 34px;
            flex: 15;
            text-align: left;
            color: #333;
            color: #fff;
        }
        .left{
            flex: 10;
            padding-left: 30px;
            color: #fff;
        }
    }
}
</style>
