<template>
    <div class="page">
        <!-- <m-header :title="lang_text&&(lang!='en'?'实名认证':lang_text.Verified)" :canback="Boolean(1)"></m-header> -->
        <div class="header">
            <i class="left iconfont iconback" @click="$router.push({name:'My2'})"></i>
            <div class="center">{{lang_text&&(lang!='en'?'实名认证':lang_text.Verified)}}</div>
        </div>
        <section class="body">

            <div class="card" v-show="!show">
                <div class="box" v-if="isreal!=1">
                    <ul>
                        <li>
                            <p class="p_title">{{lang_text&&(lang!='en'?'真实姓名':lang_text.a115)}}</p>
                            <input type="text" :placeholder="lang_text&&(lang!='en'?'真实姓名':lang_text.a115)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.username" @keydown.enter="realname_contrast">
                        </li>
                        <li>
                            <p class="p_title">{{lang_text&&(lang!='en'?'身份证号':lang_text.a170)}}</p>
                            <input type="text" :placeholder="lang_text&&(lang!='en'?'身份证号':lang_text.a170)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.card" @keydown.enter="realname_contrast">
                        </li>
                    </ul>
                </div>
                <div class="box" v-else>
                    <ul>
                        <li class="li_se">
                            <p class="p_title">{{lang_text&&(lang!='en'?'真实姓名':lang_text.a115)}}</p>
                            <input type="text" :placeholder="lang_text&&(lang!='en'?'真实姓名':lang_text.a115)" v-model="data.username" readonly>
                        </li>
                        <li class="li_se">
                            <p class="p_title">{{lang_text&&(lang!='en'?'身份证号':lang_text.a170)}}</p>
                            <input type="text" :placeholder="lang_text&&(lang!='en'?'身份证号':lang_text.a170)" v-model="data.card" readonly>
                        </li>
                    </ul>
                </div>
                <p class="box_bot" v-if="isreal==1"><span>{{lang_text&&(lang!='en'?'实名认证已完成':'Real name authentication completed')}}</span></p>
                
                <button class="bot_btn"  @click="realname_contrast" v-if="isreal!=1">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button>
            </div>

            
            <div class="capture" v-show="show">
            <!-- <div class="capture"> -->
                <img :src="src?(api+src):''" alt="">
                <!-- <p class="ts">{{lang_text&&(lang!='en'?`提示：实名认证需支付${money}L PETRO`:`Prompt: real name authentication needs to be paid${money}L PETRO`)}}</p> -->
                <button class="bot_btn" @click="Capture" v-show="!open_pwd">{{lang_text&&(lang!='en'?'拍摄人脸':'Face shooting')}}</button>
                
                <!-- <button class="bot_btn"  @click="realname_img">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button> -->
                <button class="bot_btn"  @click="open">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button>
            </div>
            <!-- <button class="bot_btn" @click="Capture">调用相机</button> -->
            <!-- <img :src="src" alt=""> -->
            
        <!-- <button class="bot_btn"  @click="createView">openView</button>
        <button class="bot_btn"  @click="$router.push({name:'Close'})">Close</button> -->
        </section>
        <m-pwd ref="pwd" @pay="pay"></m-pwd>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load,HB} from '@/assets/commonjs/utils.js';
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
            rule:{
                isCertifyCard:{
                    validate:true,
                    msg:'请输入正确的身份证号码！'
                }
            },
            data:{
                card:null,
                username:null,
            },
            lang_text:null,
            lang:null,
            isreal:null,
            verify_token:null,
            show:false,
            file_src:require('@/assets/images/jr/bg1.png'),
            src:null,
            money:null,
            open_pwd:false,
        }
    },
    created(){
        window.back3 = this.back3;
    },
    mounted(){
        this.initData();
        this.getUser();
        this.pay_info();
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
        },
        back3(){
            // this.getUser();
            // this.show = false;
            this.$router.go(0)
        },
        pay(pwd){
            this.pay_credit1(pwd);
        },
        // 参数
        pay_info(){
            Trade.pay_info().then(res=>{
                if(res.code==1){
                    this.money = res.data.money;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        open(){
            if(!this.src){
                mui.toast(this.lang_text&&(this.lang!='en'?`未检测到图片`:`No pictures detected`))
                return;
            }
            // let text = this.lang_text&&(this.lang!='en'?`提示：实名认证需支付${this.money}L PETRO`:`Prompt: real name authentication needs to be paid${this.money}L PETRO`);
            let text = this.lang_text&&(this.lang!='en'?`提示：新加坡今日链条已向iPayLinks公司质押70万LPETRO认证费`:`Singapore today chain has pledged 700,000 LPETRO certification fees to iPayLinks`);
            let _this = this;
            try{
                if(plus){
                    mui.confirm(text,actions=>{
                        if(actions.index == 0){
                            _this.realname_img();
                        }
                        
                    })
                }
            }catch(e){
                mui.confirm(text,actions=>{
                    if(actions.index == 1){
                        _this.realname_img();
                    }
                })
            }
        },
        // 校验实名认证信息
        realname_img(){
            if(this.open_pwd){
                this.$refs['pwd'].open();
                return;
            }
            Trade.realname_img({img:this.api+this.src}).then(res=>{
                // mui.toast(res.msg)
                if(res.code==1){
                    // let url = this.api+'/dist/index.html#/pay2?cookie='+localStorage.getItem("cookie")+'&lang='+localStorage.getItem('lang');
                    // setTimeout(()=>{
                    //     try {
                    //         if(plus){
                    //             plus.webview.open(url)
                    //         }
                    //     }catch(e){
                    //         // console.log('url',url)
                    //         // location.href = url2;
                    //         // mui.toast('请到APP实名');
                    //         this.$router.push({name:'pay3'})
                    //     }
                    // },500)
                    this.open_pwd = true;
                    this.$refs['pwd'].open()
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 支付
        pay_credit1(pwd){
            Trade.pay_credit1({paytype:1,pwd}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(0)
                    },500)
                }
            })
        },
        // 调用相机
        Capture(){
            
            if (mui.os.ios){
                HB.HBCapture2(this,res=>{
                // HB.HBCapture(this,res=>{
                    // console.log('res',res)
                    this.src = res;
                    this.open_pwd = false;
                })
            }else{
                HB.HBCapture(this,res=>{
                    // console.log('res',res)
                    this.src = res;
                    this.open_pwd = false;
                })
            }
        },
        // 校验实名认证信息
        realname_contrast(){
            if(this.show) return;
            Trade.realname_contrast(this.data).then(res=>{
                if(res.code==1){
                    // this.$router.push({name:"Capture"})
                    // this.goTo();
                    this.show = true;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        goTo(){
            // let url = this.api+'/dist/index.html#/openview?cookie='+localStorage.getItem("cookie");
            let url = this.api+'/dist/index.html#/capture?cookie='+localStorage.getItem("cookie");
            try {
                if(plus){
                    // console.log('url',url)
                    plus.webview.open(url)
                }
            }catch(e){
                // console.log('url',url)
                // location.href = url2;
                mui.toast('请到APP实名');
            }
        },
        getUser(){
            Init.getUser().then(res=>{
                if(res.code==1){
                    // this.data.creditid = res.data.creditid;
                    // this.data.realname = res.data.realname;

                    this.isreal = res.data.isreal;
                    if(this.isreal==1){
                        this.data.card = res.data.creditid;
                        this.data.username = res.data.realname;
                    }
                }else{
                    mui.toast(res.msg)
                }
            })
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
    .card{
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
                        // display: flex;
                        // justify-content: space-between;
                        text-align: center;
                        width: 100%;
                        >div{
                            width:291px;
                            background:rgba(238,238,238,1);
                            border-radius:8px;
                            text-align: center;
                            padding: 42px 0 39px;
                            position: relative;
                            margin: 0 auto;
                            .zw2{
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                            }
                            p{
                                font-size:24px;
                                color:rgba(153,153,153,1);
                                margin-top: 6px;
                            }
                            i{
                                font-size: 40px;
                                // color: linear-gradient(270deg, #0093dd 0%, #457adb 100%) !important;
                                color: #ccc;
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
    .capture{
        >img{
            width: 690px;
            // margin: 20px 30px;
            margin: 20px 30px;
            // max-height: 600px;
        }
        .bot_btn{
            width: 600px;
            height: 88px;
            margin: 20px 75px;
            background-color: #378ed5;
        }
        .ts{
            color: red;
            font-size: 28px;
            margin: 20px 100px;
        }
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
