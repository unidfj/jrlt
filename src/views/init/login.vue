<template>
    <div class="page"  @keyup.13="login">
        <!-- <m-header title="登录"></m-header> -->
        <section class="body">
            <img :src="bgc" alt="" class="login_bgc">
            <div class="top_right"  @click="choicePay">
                <span>{{value_}}</span>
                <img :src="login_1" alt="">
            </div>

            
            <div class="box">
                <p class="title">{{lang_text&&(lang!='en'?'登录':lang_text.Login)}}</p>
                <ul>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'手机号':lang_text.phone)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'手机号':lang_text.phone)"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="formData.account" oninput="if(value.length>11)value=value.slice(0,11)">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'输入密码':lang_text.a26)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="password" :placeholder="lang_text&&(lang!='en'?'输入密码':lang_text.a26)"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="formData.password" >
                    </li>
                </ul>
                <div class="box_bot">
                    <p @click="$router.push({name:'Register'})">{{lang_text&&(lang!='en'?'立即注册':lang_text.register)}}</p>
                    <p @click="backPwd">{{lang_text&&(lang!='en'?'忘记密码？':lang_text.a28)}}</p>
                </div>
                <button class="bot_btn"  @click="login">{{lang_text&&(lang!='en'?'登录':lang_text.Login)}}</button>
                <button class="bot_btn"  @click="goToDownload">{{lang_text&&(lang!='en'?'下载APP':lang_text.a29)}}</button>
            </div>

        </section>
        <div id="captcha"></div>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {Util,Load,HB,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
export default {
    data () {
        return {
            formData:{
                account:null,
                password:null,
                NECaptchaValidate: null,
                // identifier:null,
                // captcha:null,
            },
            imgCode:null,
            randomCode:null,
            barcode:null,
            scan:null,
            isApp:false,
            bgc:require('@/assets/images/jr/login_bc.png'),
            login_1:require('@/assets/images/jr/login_1.png'),
            // mui下拉选择
            payPicker:new mui.PopPicker(),
            payList:[
                {
                    value: '1',
                    text: '简体中文',
                    lang:'zh-cn',
                },
                {
                    value: '2',
                    text: 'English',
                    lang:'en',
                },
            ],
            value_:'简体中文',
            lang:null,
            lang_text:null,
            lang:null,

            identifier:null,
            captcha:null,
            show2:false,
            captchaIns:null,
            validate:null,
        }
    },
    mounted(){
        this.initData();
        // this.getRandom();
        this.get_language();
        this.initScript()
    },
    computed:{
        ...mapGetters(['api','proData'])
    },
    methods:{
        ...mapMutations(['saveProData','saveUserID','saveUserInfo','saveLang']),
        initData(){
            this.payPicker.setData(this.payList);
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            mui.init({
                swipeBack:true //启用右滑关闭功能
            });
            try{
                if(plus){
                    this.isApp = true;
                }
            }catch(e){}
            
            // 多语言
            if(localStorage.getItem('lang')){
                this.lang = localStorage.getItem('lang');
            }else{
                localStorage.setItem('lang','zh-cn');
                this.lang = 'zh-cn'
            }
            this.value_ = this.lang == 'zh-cn'?'简体中文':'English';

        },
        // 动态生成云盾JS链接————因为时间戳的关系
        initScript(){
            var url = 'https://cstaticdun.126.net/load.min.js' + '?t=' + this.getTimestamp(1 * 60 * 1000) // 时长1分钟，建议时长分钟级别
            let script = document.getElementById('yundun');
            script.src = url;
            setTimeout(()=>{
                this.init();
            },800)
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
                enableClose: true, // 由业务方控制验证码弹框关闭
                // feedbackEnable: false, // 业务方关闭反馈入口
                onClose: function () {
                // 弹出关闭结束后将会触发该函数
                    _this.captchaIns.refresh()
                },
                onVerify: function (err,data) {
                    // console.log('data',data)
                    if (!err) {
                        // 验证成功后，调用close方法关闭弹框（enableClose为true时调用）
                        _this.formData.NECaptchaValidate = data.validate;
                        // console.log(_this.formData.NECaptchaValidate)
                        _this.captchaIns.close()
                    }else {
                        _this.captchaIns.refresh()
                    }
                    // setTimeout(()=>{
                    // },1000)
                }
            }, function (instance) {
                // 初始化成功后得到验证实例instance，可以调用实例的方法
                _this.captchaIns = instance
                _this.open();
                // document.querySelector('.yidun_modal__close').style.display = 'none'
            }, function (err) {
                // 初始化失败后触发该函数，err对象描述当前错误信息
            })
        },
        open(){
            this.captchaIns && this.captchaIns.popUp()
        },
        get_language(){
            Trade.get_language({lang:this.lang}).then(res=>{
                if(res.code==1){
                this.getData();
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 多语言切换
        choicePay(){
            let _This = this;
            // this.isDown = false;
            this.payPicker.show(function(items) {
                _This.value_=items[0].text;
                _This.saveLang(items[0].lang)
                
                localStorage.setItem('lang',items[0].lang);
                _This.lang = items[0].lang
                _This.get_language();
                // _This.paytype=items[0].value;
                
            })
        },
        /**
         * 找回密码
         */
        backPwd(){
            this.$router.push({name:'BackPwd'})
        },
        /**
         * 登录
         */
        login(){
            try {
                if(plus) {
                    this.formData.plus = 'plus'
                }
            } catch (error) {
                this.formData.plus = null;
                return mui.toast("请前往App登录")
            }
            let params = this.formData;
// console.log(params);
// return ;
            let msg = Util.isValidate(params);
            if(msg){
              mui.toast(msg);
              return ;
            }
            // Load.loadStart(this);
            console.log(this.formData)
            Init.login(params).then((res)=>{
                mui.toast(res.msg);
                if(res.code == 1){
                    let InfoData = JSON.parse(Secret.decrypt(res.data));
                    
                    // localStorage.setItem('user_id',res.data.id);
                    this.saveUserInfo(InfoData);
                    this.saveUserID(InfoData.id);
                    localStorage.setItem('userInfo',res.data);
                    localStorage.setItem('cookie',InfoData.token);
                    setTimeout(() => {
                        Load.loadEnd(this);
                        this.$router.replace({name:'index'})
                    }, 800);
                }else {
                    setTimeout(() => {
                        Load.loadEnd(this);
                        return ;
                    }, 800);
                }
            })
        },
        /**
         * 扫码选项  相机 相册
         */
        actionSheet(){
            let _this = this;
            try{
                plus.nativeUI.actionSheet({
                    // title:"Plus is ready!",
                    cancel:"取消",
                    buttons:[
                        {
                            title:"相机"
                        },{
                            title:"相册"
                            }
                    ]},
                    function(e){
                        console.log("User pressed: "+e.index);
                        if(e.index == 1){
                            _this.toScan();
                        }else {
                            _this.selectGallery();
                        }
                    });

            }catch(e){}
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
            this.formData.identifier = this.randomCode;
        },
        /**
         * 相册扫码
         */
        selectGallery(){
            let _This = this;
                HB.picForGallery(_This,res=>{
                    Load.loadStart(_This);
                    plus.downloader.createDownload( _This.api+res, {filename:"_doc/images/"}, function(d,status){  
                        if ( status == 200 ) {   
                                plus.barcode.scan( d.filename, function(type,result) {
                                    Load.loadEnd(_This);
                                    plus.nativeUI.confirm("确定跳转?", function(e){
                                        if(e.index == 0){
                                            plus.runtime.openURL(JSON.parse(result));
                                        }
                                    });
                            }, function(e){
                                console.log("Scan failed: "+JSON.stringify(e));
                            } );
                        } else {  
                            console.log("下载图片文件失败！");  
                        }  
                        plus.nativeUI.closeWaiting();  
                    }).start(); 
                })
        },
        /**
         * 相机扫码
         */
        toScan(){
            let _This = this;
            if(!this.barcode){
                this.barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
                    top:'100px',
                    left:'0px',
                    width: '100%',
                    height: '500px',
                    position: 'static'
                });
                this.barcode.onmarked = _This.onmarked;
                plus.webview.currentWebview().append(this.barcode);
            }
            this.barcode.start();
            // this.scan = new plus.barcode.Barcode('bcid');
            // this.scan.onmarked = this.onmarked();
            // this.scan.start();
        },
        /**
         * 扫码回调
         */
        onmarked(type, result) {
            var text = '未知: ';
            switch(type){
                case plus.barcode.QR:
                text = 'QR: ';
                break;
                case plus.barcode.EAN13:
                text = 'EAN13: ';
                break;
                case plus.barcode.EAN8:
                text = 'EAN8: ';
                break;
            }
            if(result){
                // alert( text+result );
                this.barcode.close();
                try{
                    if(plus){
                        mui.confirm('确定跳转',actions=>{
                            if(actions.index == 0)
                            plus.runtime.openURL(result);
                            
                        })
                    }
                }catch(e){
                    mui.confirm('确定跳转',actions=>{
                        if(actions.index == 1)
                        plus.runtime.openURL(result);
                    })
                }
            }
        },
        /**
         * 下载
         */
        goToDownload() {
          this.$router.push({name:'Download'})
        },
        async getData(){
            await Base.getData().then(res=>{
                if(res.code ==1){
                    this.saveProData(res.data);
                    localStorage.setItem('proData',JSON.stringify(res.data));
                }else
                mui.toast(res.msg||'加载项目信息失败！')
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
    },
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
    .img-box {
        .display-flex();
        justify-content: center;align-items: center;
        .logo {
            margin:60px 0;
            height: 180px;
        }
    }
    .tj-form {
        .btn-white {
            background-color: whitesmoke;color: #333;
            font-size: 40px;letter-spacing: 5PX;font-family: fantasy; //monospace fantasy
        }
    }
    .other {
        .display-flex();
        justify-content: space-between;
        margin: 0 @margin-primary  @margin-primary ;
        color: white;
        font-size: 24px;
        a {
            padding: 10px 20px;
        }
    }
    .btn-download {
      display: block;margin: 0 auto 4vw;
      width: 92%;height: 44PX;
      background: #78bc43;
    }
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 293px 49px;
        padding: 24px 33px 32px 26px;
        border: 1px solid rgba(0,147,221,.3);
        .title{
            font-size:50px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:550;
            color:rgba(51,51,51,1);
            margin: 24px 37px 0;
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
        .box_bot{
            display: flex;
            justify-content: space-between;
            padding: 37px 22px 43px;
            p{
                font-size:24px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(176,190,215,1);
                &:last-child{
                    color: #0093DD;
                }
            }
        }
        
        .bot_btn{
            width:600px;
            height:88px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin-bottom: 30px;
            &:last-child{
                background:linear-gradient(270deg,rgba(255,220,0,1) 0%,rgba(255,182,0,1) 100%);
            }
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
    .top_right{
        position: fixed;
        right: 30px;
        top: 60px;
        border: 1px solid rgba(256,256,256,0.5);
        border-radius: 10px;
        color: rgba(256,256,256,0.8);
        width: 180px;
        height: 68px;
        line-height: 68px;
        padding-left: 20px;
        img{
            position: absolute;
            // display: inline-block;
            width: 18px;
            // vertical-align: middle;
            opacity: 0.9;
            right: 20px;
            top: 30px;

        }
    }
}
</style >

