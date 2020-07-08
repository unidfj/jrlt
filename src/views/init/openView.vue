<template>
    <div class="page">
        <div class="header">
            <i class="left iconfont iconback" @click="close"></i>
            <div class="center">实名认证</div>
        </div>
        <!-- <m-header title="实名认证"></m-header> -->
        <section class="body">
            <!-- <button class="bot_btn" @click="initData">测试</button>
            <button class="bot_btn" @click="$router.push({name:'Close'})">测试</button> -->
            <button class="bot_btn" @click="goTo">填写实名信息</button>
            <button class="bot_btn" @click="cs">开启摄像权限</button>
            <!-- <button class="bot_btn" @click="close">返回</button> -->
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
export default {
    data () {
        return {
            verify_token:null,
        }
    },
    mounted(){
        this.initData();
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            let cookie = this.$route.query.cookie;
            this.verify_token = this.$route.query.verify_token;
            localStorage.setItem('verify_token',this.verify_token)
            localStorage.setItem('cookie',cookie)
        },
        goTo(){
            let orderUrl = `https://brain.baidu.com/face/print/?token=${this.verify_token}&successUrl=${this.api+'/dist/index.html%23/pay?type=1'}&failedUrl=${this.api+'/dist/index.html%23/close2'}`
            location.href = orderUrl;
        },
        close(){
            var ws=plus.webview.currentWebview();
            ws.opener().evalJS(`back3()`);
            plus.webview.close(ws);
        },
        cs(){
            var msg = "请在应用权限里设置允许使用相机权限";  
            mui.alert(msg,"开启相机权限","去开启",function(){          
                if (mui.os.ios) {  
                    plus.runtime.openURL("app-settings:CAMERA");  
                } else {  
                    var main = plus.android.runtimeMainActivity();  
                    var Intent = plus.android.importClass("android.content.Intent");  
                    var Build = plus.android.importClass("android.os.Build");  
                    var Uri = plus.android.importClass("android.net.Uri");  
                    var intent = new Intent();  
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);  
                    if (Build.VERSION.SDK_INT >= 9) {//系统8.0以上的  
                        intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");  
                        intent.setData(Uri.fromParts("package", main.getPackageName(), null));  
                    } else if (Build.VERSION.SDK_INT <= 8) {//系统8.0以下的  
                        intent.setAction(Intent.ACTION_VIEW);  
                        intent.setClassName("com.android.settings", 			"com.android.setting.InstalledAppDetails");  
                        intent.putExtra("com.android.settings.ApplicationPkgName", main.getPackageName());  
                    }  
                    main.startActivity(intent);  
                    
                    //  
                }  
            })
        },
    },
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
    padding-top: 200px;
        .bot_btn{
            width:600px;
            height:88px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin-bottom: 30px;
            margin: 30px 75px;
            &:last-child{
                background:linear-gradient(270deg,rgba(255,220,0,1) 0%,rgba(255,182,0,1) 100%);
            }
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
</style >

