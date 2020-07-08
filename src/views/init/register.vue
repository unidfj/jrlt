<template>
  <div class="page">
    <!-- <m-header title="注册"></m-header> -->
    <section class="body">
      <img :src="bgc" alt="" class="login_bgc">
      <div class="box">
          <p class="title">{{lang_text&&(lang!='en'?'注册':lang_text.registered)}}</p>
          <ul>
                <!-- <li>
                    <p class="p_title">会员编号</p>
                    <input type="text" placeholder="会员编号" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.tjname">
                </li> -->
                <li>
                    <p class="p_title">{{lang_text&&(lang!='en'?'用户姓名':lang_text.username)}}</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'用户姓名':lang_text.username)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.realname">
                </li>
                <li>
                    <p class="p_title">{{lang_text&&(lang!='en'?'手机号码':lang_text.phone)}}</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'手机号码':lang_text.phone)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.mobile"  oninput="if(value.length>11)value=value.slice(0,11)">
                </li>
                <li>
                    <p class="p_title">{{lang_text&&(lang!='en'?'登录密码':lang_text.lp)}}</p>
                    <input type="password" :placeholder="lang_text&&(lang!='en'?'登录密码':lang_text.lp)" @focus='focus_css($event)' @blur='blur_css($event);IsIntegerAndEnglishCharacter($event)' v-model="data.password">
                </li>
                <li>
                    <p class="p_title">{{lang_text&&(lang!='en'?'交易密码':lang_text.a32)}}</p>
                    <input type="password" :placeholder="lang_text&&(lang!='en'?'交易密码':lang_text.a32)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.paypwd" maxlength="6" >
                </li>
                <li>
                    <p class="p_title">{{lang_text&&(lang!='en'?'推荐人编号':lang_text.a33)}}</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'推荐人编号':lang_text.a33)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.tjname">
                </li>
                <li>
                    <p class="p_title">{{lang_text&&(lang!='en'?'手机验证码':lang_text.code)}}</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'手机验证码':lang_text.code)" v-model="data.captcha" @focus='focus_css($event)' @blur='blur_css($event)'  oninput="if(value.length>4)value=value.slice(0,4)">
                    <!-- <button type="button" class="btn_code" :disabled="seconds>0" @click="sendCode">{{seconds==0?lang_text&&(lang!='en'?'点击发送':lang_text.Csend):""+seconds+"s"}}</button> -->
                    <!-- <button type="button" class="btn_code" :disabled="seconds>0" @click="show2 = true">{{seconds==0?lang_text&&(lang!='en'?'点击发送':lang_text.Csend):""+seconds+"s"}}</button> -->
                    <button type="button" class="btn_code" :disabled="seconds>0" @click="open">{{seconds==0?lang_text&&(lang!='en'?'点击发送':lang_text.Csend):""+seconds+"s"}}</button>
                </li>
                <li  class="li_se" @click="showPopup">
                    <p class="p_title">{{lang_text&&(lang!='en'?'所在地区':lang_text.Area)}}：</p>
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
                    <p class="se">
                    <!-- <p class="se" @click="choicePay2"> -->
                        <span>{{data.district}}</span>
                        <img :src="xia" alt="">
                    </p>
                </li>
          </ul>
          <div id="allmap"></div>
      </div>
        <van-popup v-model="show">
            <van-area :area-list="areaList"  @confirm="onConfirm($event)"/>
        </van-popup>
        
        <p class="ts">{{lang!='en'?'提示：交易密码为6为纯数字':'Prompt: the transaction password is 6, which is a pure number'}}</p>
        <button type="button" class="bot_btn" @click="register()">{{lang_text&&(lang!='en'?'注册':lang_text.registered)}}</button>
        <button class="bot_btn"  @click="goToDownload">{{lang_text&&(lang!='en'?'下载APP':lang_text.a29)}}</button>
    </section>
    
    <div class="ale" v-show="show2">
        <div class="ale_box">
            <div class="ale_top">
                <input type="text" :placeholder="lang_text&&(lang!='en'?'请输入图形验证码':lang_text.a216)" v-model="captcha">
                <img class="btn img-code" :src="api+'/api/Captcha/get?identifier='+randomCode" alt="" @click="getRandom()">
            </div>
            <div class="ale_bot">
                <button @click="show2=false,captcha=''">{{lang_text&&(lang!='en'?'取消':lang_text.cancel)}}</button>
                <button @click="sendCode">{{lang_text&&(lang!='en'?'点击发送':lang_text.Csend)}}</button>
            </div>
        </div>
    </div>
    <div id="captcha"></div>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {mapGetters} from 'vuex';
import {cn,en} from '@/assets/json/cn.js';
import { Area } from 'vant';
import { Popup } from 'vant';
import 'vant/lib/area/style';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
    },
    data () {
        return {
            seconds:0,
            randomCode:null,
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
              conFirmP:{
                validate:true,
                msg:'两次输入密码不一致！'
              },
            },
            bgc:require('@/assets/images/jr/login_bc.png'),
            xia:require('@/assets/images/jr/xia.png'),
            payPicker0:new mui.PopPicker(),
            payPicker1:new mui.PopPicker(),
            payPicker2:new mui.PopPicker(),
            isDown:true,
            payList0:[],
            payList1:[],
            payList2:[],
            data:{
                realname:null,
                mobile:null,
                password:null,
                paypwd:null,
                tjname:null,
                captcha:null,
                province:'加载中',
                city:'加载中',
                district:'加载中',
            },
            show: false,
            areaList:{},
            lang_text:null,
            lang:null,
            jsfd:true,

            identifier:null,
            captcha:null,
            show2:false,
            captchaIns:null,
            validate:null,
        }
    },
    mounted(){
        this.initData();
        this.getRandom();
        // setTimeout(()=>{
        // this.init();
        // },3000)
        // this.map();
        // this.getMyLocation()
        // this.getlocation();
        // this.ready();
        this.initScript()
        
    },
    computed:{
      ...mapGetters(['api'])
    },
    methods:{
        initData(){
            // this.data.tjjr = this.$route.params.id;
            this.data.tjname = this.$route.query.username;
            // this.areaList = Object.assign({},cn)
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            
            this.areaList = Object.assign({},this.lang!='en'?cn:en)
            this.data.province = this.areaList.province_list[110000];
            this.data.city = this.areaList.city_list[110100];
            this.data.district = this.areaList.county_list[110101];
            // console.log('areaList',this.areaList)
            
            this.rule.isMobile.msg = this.lang!='en'?'请输入正确的手机号':this.lang_text.a22;
            this.rule.isPwd.msg = this.lang!='en'?'密码应为8-12位字母+数字':this.lang_text.a23;
            this.rule.conFirmL.msg = this.lang!='en'?'两次输入密码不一致！':this.lang_text.a24;
            this.rule.conFirmP.msg = this.lang!='en'?'两次输入密码不一致！':this.lang_text.a24;
            
        },
        // 动态生成云盾JS链接————因为时间戳的关系
        initScript(){
            var url = 'https://cstaticdun.126.net/load.min.js' + '?t=' + this.getTimestamp(1 * 60 * 1000) // 时长1分钟，建议时长分钟级别
            let script = document.getElementById('yundun');
            script.src = url;
            setTimeout(()=>{
                this.init();
            },500)
        },
        // 时间戳
        getTimestamp (msec) {
            msec = !msec && msec !== 0 ? msec : 1
            return parseInt((new Date()).valueOf() / msec, 10)
        },
        // 初始化云盾
        init(){
            let _this = this;
            initNECaptcha({
                element: '#captcha',
                captchaId: 'b5af7f2f400447ebae70917125a2c846',
                mode: 'popup',
                width: '320px',
                // enableClose: true, // 由业务方控制验证码弹框关闭
                // feedbackEnable: false, // 业务方关闭反馈入口
                onClose: function () {
                // 弹出关闭结束后将会触发该函数
                    _this.captchaIns.refresh()
                },
                onVerify: function (e,data) {
                    console.log('data',data)
                    _this.validate = data.validate;
                    _this.sendCode();
                    setTimeout(()=>{
                        _this.captchaIns.refresh()
                    },1000)
                }
            }, function (instance) {
                // 初始化成功后得到验证实例instance，可以调用实例的方法
                _this.captchaIns = instance
            }, function (err) {
                // 初始化失败后触发该函数，err对象描述当前错误信息
            })
        },
        open(){
            this.captchaIns && this.captchaIns.popUp()
        },
        /**
         * 随机标识key
         */
        getRandom(){
            let random1 = parseInt(Math.random(0,1)*100000000);
            let random2 = parseInt(Math.random(0,1)*100000000);
            let str = 'abcdd';
            // return  random1+'abcdd'+random2;
            this.randomCode = random1+'abcdd'+random2+'-'+new Date().getTime();
            this.identifier = this.randomCode;
            // console.log('identifier',this.identifier)
        },
        // //定位获得当前位置信息
        getMyLocation() {
            var geolocation = new qq.maps.Geolocation("QR3BZ-QON6P-YZ7DH-VUZO3-FGSIO-PVBBC", "定位");
            geolocation.getIpLocation(this.showPosition, this.showErr);
            //geolocation.getLocation(this.showPosition, this.showErr);//或者用getLocation精确度比较高
        },
        showPosition(position) {
            // console.log('腾讯地图：',position);
            // if(!position.district){
            //     this.ready();
            //     return;
            // }
            this.data.province = position.province;
            this.data.city = position.city;
            this.data.district = position.district;
        },
        showErr() {
            // console.log("定位失败");
            // this.ready();
            // mui.toast('获取位置信息失败')
            // setTimeout(()=>{
            //     this.ready();
            // },500)
            // this.getMyLocation();//定位失败再请求定位，测试使用
        },
        
        ready () {
            var _this = this;
            if(!this.jsfd) return;
            this.jsfd = false;
            Load.loadStart(_this)
            var geolocation = new BMap.Geolocation()
            geolocation.getCurrentPosition((r) => {
                // console.log('百度地图',r)
                this.jsfd = true;
                Load.loadEnd(_this);
                if(!r){
                    this.getMyLocation();
                    return
                }
                // console.log(this.jsfd)
                this.data.province = r.address.province;
                this.data.city = r.address.city;
                this.data.district = r.address.district;
                
                if(!r.address.district){
                    this.getMyLocation();
                    return
                }
            }, { enableHighAccuracy: true })
        },
        onConfirm(e){
            this.show = false;
            this.data.province = e[0]?e[0].name:'';
            this.data.city = e[1]?e[1].name:'';
            this.data.area = e[2]?e[2].name:'';
            
            this.data.district = e[2]?e[2].name:'';
            
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
                _This.data.district = items[0].text;
            });
        },
        // 城市选择器
        getlocation(type,id){
            // console.log('id',id)
            Trade.getlocation({id}).then(res=>{
                if(res.code==1){
                    // console.log(type)
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
                            this.data.district = this.payList2[0].text;
                            // console.log(this.data.district)
                            break;
                    }
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        /**
         * 发送验证码
         */
        sendCode(){
            // if(!this.data.mobile){
            //     mui.toast('请输入正确的手机号！');
            //     return ;
            // }
            this.seconds = 60;
            let get =  setInterval(()=>{
                this.$nextTick(()=>{
                    this.seconds = this.seconds-1;
                    if(this.seconds<=0){
                        clearInterval(get);
                    }
                })
            },1000)
            // 发送验证码
            Base.sendCode2({mobile:this.data.mobile,event:'register_verification',NECaptchaValidate:this.validate}).then((res)=>{
                mui.toast(res.msg);
                this.show2 = false;
                this.captcha = null;
            })
        },
        /**
         * 注册
         */
        register(){
            // console.log(this.data);return;
            // this.data.username = this.data.mobile;
            // console.log(this.data)
            let msg = Util.isValidate(this.data,this.rule);
            if(msg){
              mui.toast(msg);
              return ;
            }
            if(!this.data.captcha||!this.data.tjname){
                mui.toast('请输入完整信息')
                return;
            }
            Load.loadStart(this);
            Init.register(this.data).then((res)=>{
                mui.toast(res.msg);
                if(res.code == 1){
                    setTimeout(() => {
                        Load.loadEnd(this);
                        this.$router.replace({name:'Login'});
                    }, 500);
                }else {
                    setTimeout(() => {
                        Load.loadEnd(this);
                        return ;
                    }, 500);
                }
            })
        },
        /**
         * 随机码key
         */
        // getRandom(){
        //     let random1 = parseInt(Math.random(0,1)*100000000);
        //     let random2 = parseInt(Math.random(0,1)*100000000);
        //     let str = 'bacdd';
        //     this.randomCode = random1+'abcdd'+random2+'-'+new Date().getTime();
        //     this.data.identifier = this.randomCode;
        // },
        confirmL(event){
          if(event.target.value !=this.data.password){
            this.rule.conFirmL.validate = false;
          }else {
            this.rule.conFirmL.validate = true;
          }
        },
        confirmP(event){
          if(event.target.value !=this.data.paypwd){
            this.rule.conFirmP.validate = false;
          }else {
            this.rule.conFirmP.validate = true;
          }
        },
        IsMobilePhoneNumber(event) {
          var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
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
        
        /**
         * 下载
         */
        goToDownload() {
          this.$router.push({name:'Download'})
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
@import "~link-less";
.body {
  background-color: @bg-color;
  .tj-form {
    .btn-white {
      background-color: whitesmoke;color: #333;
      font-size: 40px;letter-spacing: 5px;font-family: fantasy; //monospace fantasy
    }
  }
  .error {
    position: absolute;bottom: 0;left: 0;
    color: red;
    font-size: 24px;
  }
  
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 124px 49px 0;
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
                    color: #0093DD !important;
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
            .btn_bot{
                width: 30%;
                height: 68px;
                line-height: 68px;
                margin:  0 35%;
                background:rgb(112, 230, 200);
            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 30px 75px 0 ;
        &:last-child{
            background:linear-gradient(270deg,rgba(255,220,0,1) 0%,rgba(255,182,0,1) 100%);
        }
    }
    
    .login_bgc{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: auto !important;
        z-index: -10;
    }
    .ts{
        color: red;
        margin: 20px 70px 0;
    }
}
.ale{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    .ale_box{
        width: 600px;
        margin: 400px 75px;
        background-color: #fff;
        border-radius: 20px;
        padding: 30px;
        >.ale_top{
            display: flex;
            justify-content: space-between;
            >img{
                height: 98px;
                margin-left: -10px;
                border-radius: 0;
            }
            input{
                height: 98px;
                border-radius: 0;
            }
        }
        .ale_bot{
            display: flex;
            justify-content: space-between;
            button{
                width: 100%;
                height: 88px;
                background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                color: #fff;
                &:first-child{
                    background: #ccc !important;
                    margin-right: 30px;
                }
            }
        }

    }   
}
</style >

