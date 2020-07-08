<template>
    <div class="page">
        <m-header :title="setTitle(type)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="box">
                <ul>
                    <li class="li_se">
                        <p class="p_title" style="display:block !important;">{{lang_text&&(lang!='en'?'联系方式':lang_text.a35)}}</p>
                        <input type="text" :value="formData.mobile" >
                    </li>
                    <li>
                        <p class="p_title">{{type== 'login'?lang_text&&(lang!='en'?'新的登录密码':lang_text.a36):lang_text&&(lang!='en'?'新的交易密码':lang_text.a37)}}</p>
                        <input v-if="type=='login'" type="password" :placeholder="lang_text&&(lang!='en'?'新的登录密码':lang_text.a36)" v-model="formData.newpassword" @focus='focus_css($event)' @blur='blur_css($event)'>
                        <input v-else type="password" :placeholder="lang_text&&(lang!='en'?'新的交易密码':lang_text.a37)" v-model="formData.newpassword" maxlength="6" @focus='focus_css($event)' @blur='blur_css($event)'>
                    </li>
                    <li>
                        <p class="p_title">{{type== 'login'?lang_text&&(lang!='en'?'确认登录密码':lang_text.a38):lang_text&&(lang!='en'?'确认交易密码':lang_text.a39)}}</p>
                        <input v-if="type=='login'" type="password" :placeholder="lang_text&&(lang!='en'?'确认登录密码':lang_text.a38)" v-model="formData.password" @focus='focus_css($event)' @blur='blur_css($event)'>
                        <input v-else type="password" :placeholder="lang_text&&(lang!='en'?'确认交易密码':lang_text.a39)" v-model="formData.password" maxlength="6" @focus='focus_css($event)' @blur='blur_css($event)'>
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'手机验证码':lang_text.code)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'手机验证码':lang_text.code)" v-model="formData.captcha" @focus='focus_css($event)' @blur='blur_css($event)'  oninput="if(value.length>4)value=value.slice(0,4)">
                        <button type="button" class="btn_code" :disabled="seconds>0" @click="getCode">{{seconds==0?lang_text&&(lang!='en'?'点击发送':lang_text.Csend):""+seconds+"s"}}</button>
                    </li>
                </ul>
            </div>
            
            <button type="button" class="bot_btn" @click="confirm">{{lang_text&&(lang!='en'?'确定':lang_text.confirm)}}</button>
            <m-load ref="load"></m-load>
        </section>
    </div>
</template>
<script>
import {Init,Base} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
    },
    data () {
        return {
            seconds:0,
            type:null,
            formData:{
                mobile:null,
                newpassword:null,
                password:null,
                captcha:null
            },
            lang_text:null,
            lang:null,            
        }
    },
    mounted(){
        this.initData();
    },
    computed:{
        ...mapGetters(['uid','userInfo'])
    },
    methods:{
        initData(){
            this.type = this.$route.query.type;
            this.formData.mobile = this.userInfo.mobile;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
        },
        getCode(){
            this.seconds = 60;
            let get =  setInterval(()=>{
                this.$nextTick(()=>{
                    this.seconds = this.seconds-1;
                    if(this.seconds<=0){
                        clearInterval(get);
                    }
                });
            },1000)
// return ;
            // 发送验证码
            Base.sendCode({mobile:this.userInfo.mobile}).then((res)=>{
                mui.toast(res.msg);
            })            
        },
        // isMobile(mobile,callback){
        //     if(!mobile|| mobile.length<13){
        //         mui.toast('请添加区(地域)号，如：(86)中国');
        //         return false
        //     }else {
        //         callback();
        //     }
        // },
        confirm(){
            let _This = this;
            if(this.type == 'login'){
                let msg = Util.isValidate(this.formData);
                if(msg){
                    mui.toast(msg);
                    return ;
                }
                Load.loadStart(this);
                // console.log(this.formData);return ;
                Init.backpwd(this.formData).then(res=>{
                    if(res.code == 1){
                        setTimeout(() => {
                            Load.loadEnd(this);
                            mui.toast(res.msg);
                            this.clearLocal();
                            this.$router.replace({name:'Login'});
                        }, 1000);
                    }else {
                        Load.loadEnd(this);
                        mui.toast(res.msg);
                        return;
                    }
                })
            }else {
                if(this.formData.newpassword!=this.formData.password){
                    mui.toast(this.lang!='en'?'两次输入密码不一致！':this.lang_text.a24)
                    return
                }
                let params = {
                    mobile:this.formData.mobile,
                    newpassword:this.formData.newpassword,
                    password:this.formData.password,
                    id:this.uid,
                    captcha:this.formData.captcha,
                }
                let msg = Util.isValidate(params);
                if(msg){
                    mui.toast(msg);
                    return ;
                }
                Load.loadStart(this);
                Init.backTrade(params).then(res=>{
                    if(res.code == 1){
                        mui.toast(res.msg);
                        setTimeout(() => {
                            Load.loadEnd(this);
                            this.$router.go(-1);
                        }, 1000);
                    }else {
                        Load.loadEnd(this);
                        mui.toast(res.msg);
                        return;
                    }
                })
            }
        },
        setTitle(type){
            switch(type){
                case 'login':
                    return '修改登录密码';
                    break;
                case 'trade':
                    return '修改交易密码';
                    break;
            }
        },
        clearLocal(){
            localStorage.clear();
            this.$store.commit('saveUserInfo',null);
            this.$store.commit('saveUserID',null);
            sessionStorage.setItem('btmNav',1);
            Util.clearAllCookie();
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

<style scoped lang="less">
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
                position: relative;
                .btn_code{
                    position: absolute;
                    right: 14px;
                    top: 24px;
                    color: #0093DD;
                }
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
                padding:0 28px;
                border-bottom: 1px solid #F1F2F4 !important;
                p{
                    vertical-align: middle;
                    line-height: 88px;
                    margin-left: 3.5px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                }
            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 60px 75px;
    }
    .btn_code{
        color: #0093DD !important;
    }
}
</style >



