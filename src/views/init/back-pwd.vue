<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'找回密码':lang_text.Rpassword)" :canback="Boolean(1)"></m-header>
        <section class="body">
      <div class="box">
          <p class="title">{{lang_text&&(lang!='en'?'找回密码':lang_text.Rpassword)}}</p>
          <ul>
              <li>
                  <p class="p_title">{{lang_text&&(lang!='en'?'联系方式':lang_text.Cdetails)}}</p>
                  <input type="text" :placeholder="lang_text&&(lang!='en'?'联系方式':lang_text.Cdetails)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="formData.mobile"  oninput="if(value.length>11)value=value.slice(0,11)">
              </li>
              <li>
                  <p class="p_title">{{lang_text&&(lang!='en'?'新的密码':lang_text.Npassword)}}</p>
                  <input type="password" :placeholder="lang_text&&(lang!='en'?'新的密码':lang_text.Npassword)" @focus='focus_css($event)' @blur='blur_css($event);IsIntegerAndEnglishCharacter($event)' v-model="formData.newpassword">
              </li>
              <li>
                  <p class="p_title">{{lang_text&&(lang!='en'?'确认密码':lang_text.Cpassword)}}</p>
                  <input type="password" :placeholder="lang_text&&(lang!='en'?'确认密码':lang_text.Cpassword)" @focus='focus_css($event)' @blur='blur_css($event);confirmL($event)' v-model="formData.password" >
              </li>
              <li>
                  <p class="p_title">{{lang_text&&(lang!='en'?'验证码':lang_text.code)}}</p>
                  <input type="text" :placeholder="lang_text&&(lang!='en'?'验证码':lang_text.code)" v-model="formData.captcha" @focus='focus_css($event)' @blur='blur_css($event)'  oninput="if(value.length>4)value=value.slice(0,4)">
                  <button type="button" class="btn_code" :disabled="seconds>0" @click="getCode">{{seconds==0?lang_text&&(lang!='en'?'点击发送':lang_text.Csend):""+seconds+"s"}}</button>
              </li>
          </ul>
      </div>
      <button type="button" class="bot_btn" @click="confirm()">{{lang_text&&(lang!='en'?'确认':lang_text.confirm)}}</button>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base} from '@/server/server.js';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
    },
    data () {
        return {
            seconds:0,
            formData:{
                mobile:null,
                newpassword:null,
                captcha:null
            },            
            password:null,
            rule:{
              isMobile:{
                validate:true,
                msg:'请输入正确的手机号'
              },
              isPwd:{
                validate:true,
                msg:'密码应为8-12位字母+数字'
              },
              conFirmL:{
                validate:true,
                msg:'两次输入密码不一致！'
              },
            },
            lang_text:null,
            lang:null,
        }
    },
    mounted(){
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
        
        this.rule.isMobile.msg = this.lang!='en'?'请输入正确的手机号':this.lang_text.a22;
        this.rule.isPwd.msg = this.lang!='en'?'密码应为8-12位字母+数字':this.lang_text.a23;
        this.rule.conFirmL.msg = this.lang!='en'?'两次输入密码不一致！':this.lang_text.a24;
    },
    methods:{
        /**
         * 手机验证码
         */
        getCode(){
            if(!this.formData.mobile){
                mui.toast(this.lang!='en'?'请输入正确的手机号':this.lang_text.a22);
                return ;
            }
            this.seconds = 60;
            let get =  setInterval(()=>{
                this.$nextTick(()=>{
                    this.seconds = this.seconds-1;
                    if(this.seconds<=0){
                        clearInterval(get);
                    }
                })
            },1000);
// return ;
            // 发送验证码
            Base.sendCode({mobile:this.formData.mobile}).then((res)=>{
                mui.toast(res.msg);
            })
        },
        /**
         * 提交修改
         */
        confirm(){
            let _This = this;
            let msg = Util.isValidate(_This.formData,_This.rule);
            if(msg){
              mui.toast(msg);
              return ;
            }
                Load.loadStart(this);
                Init.backpwd(_This.formData).then((res)=>{
                    mui.toast(res.msg);
                    if(res.code == 1){
                        setTimeout(() => {
                            Load.loadEnd(this);
                            this.$router.go(-1);
                        }, 1000);
                    }else {
                        setTimeout(() => {
                            Load.loadEnd(this);
                            return ;
                        }, 1000);
                    }
                })
        },
        confirmL(event){
          if(event.target.value !=this.formData.newpassword){
            this.rule.conFirmL.validate = false;
            mui.toast(this.rule.conFirmL.msg)
          }else {
            this.rule.conFirmL.validate = true;
          }
        },
        IsMobilePhoneNumber(event) {
          let regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
          if (event.target.value.match(regex)) {
            this.rule.isMobile.validate = true;
          } else {
            this.rule.isMobile.validate = false;            
          }
        },
        IsIntegerAndEnglishCharacter(input) {
          var regex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
          if (event.target.value.match(regex)) {
            this.rule.isPwd.validate = true;
          } else {
            this.rule.isPwd.validate = false;
            mui.toast(this.rule.isPwd.msg)
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

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
    
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 56px 49px 117px;
        padding: 50px 33px 32px 26px;
        border: 1px solid rgba(0,147,221,.3);
        >.title{
          font-size:50px;
          font-weight:550;
          color:rgba(51,51,51,1);
          margin-left: 30px;
          margin-bottom: -20px;
        }
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
                padding:0 22px;
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
        margin: 0px 75px;
    }
    
    .btn_code{
        color: #0093DD !important;
    }
}
</style >


