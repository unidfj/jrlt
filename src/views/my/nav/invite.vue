<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'分享推荐':lang_text.a131)" :canback="Boolean(1)">
            <span @click="ss" style="color:#fff">分享</span>
        </m-header>
        
        <!-- <img :src="api+share_poster" alt="" class="bgc"> -->
        <section class="body" :style="{'backgroundImage':`url(${api+share_poster})`,'backgroundSize':'100% 100%'}">
            <!-- <div class="img-box">
                <img class="img" :src="inviteSrc" alt="">
                <p class="tip">扫描二维码即可分享好友哟</p>
                <p v-if="userInfo" class="url">{{inviteUrl}}</p>
                <input class="inp_url" type="text" id="url" :value="inviteUrl" readonly>
                <button ref="copy" class="btn btn-copy" data-clipboard-target="#url" data-clipboard-action="copy" @click="copy">复制</button>
            </div> -->
            <!-- <div class="box">
                <img :src="top_src" alt="" class="title">
                <div class="bot">
                    <img :src="bot_src" alt="" class="b_t">
                    <p class="p_t">{{lang_text&&(lang!='en'?'扫描二维码注册':lang_text.a132)}}</p>
                    <img :src="inviteSrc" alt="" class="code">
                    <p class="t_bot">
                        {{lang_text&&(lang!='en'?'邀请码':lang_text.a133)}}：
                        <span>{{username}}</span>
                    </p>
                    <button ref="copy" class="btn btn-copy" data-clipboard-target="#url" data-clipboard-action="copy" @click="copy">{{lang_text&&(lang!='en'?'复制':lang_text.a134)}}</button>
                    <input class="inp_url" type="text" id="url" :value="username" readonly>
                </div>
            </div> -->
            
            <div class="share_box" @click="share_show = false" v-show="share_show">
                <ul class="share_btn" >
                    <li v-for="(v,i) in share_list" :key="i" @click="cutView(i)">
                        <img :src="v.img" alt="">
                        <p>{{v.title}}</p>
                    </li>
                    <vue-native-share :shareMenu="shareMenu" :config="config" />
                </ul>
            </div>
            <img :src="inviteSrc" alt="" class="img_l">
            <img :src="avatar||tx" alt="" class="img_r">
            <div class="box2">
                <p class="top">我是：{{isreal!=1?username:realname}}</p>
                <p class="bot">邀请码：{{username}}</p>
            </div>
        </section>
    </div>
</template>
<script>
import { Help,Trade,Base,Init } from "@/server/server.js";
import QRCode from 'qrcode';
import {mapGetters} from 'vuex';
import Clipboard from 'clipboard'
import {a} from '@/assets/commonjs/lan.js';
import {Util,Load,Secret,HB,Share} from '@/assets/commonjs/utils.js';
import vueNativeShare from 'vue-native-share';
export default {
    name:"invite",
    components:{
        vueNativeShare
    },
    data(){
        return {
            inviteSrc:null,
            tx:require('@/assets/images/jr/logo1.png'),
            inviteUrl:null,
            myClipboard:null,
            bot_src:require('@/assets/images/jr/ewm_bg.png'),
            top_src:require('@/assets/images/jr/yqhy_wz.png'),
            username:null,
            lang_text:null,
            lang:null,
            share_list:[
                {
                    title:'QQ',
                    img:require('@/assets/images/jr/102.png'),
                },
                {
                    title:'微信',
                    img:require('@/assets/images/jr/101.png'),
                },
                {
                    title:'朋友圈',
                    img:require('@/assets/images/jr/103.png'),
                },
                // {
                //     title:'QQ空间',
                //     img:require('@/assets/images/jr/104.png'),
                // },
            ],
            share_show:false,

            // shareMenu: [0,1,2,3,4,5],
            shareMenu: [4],
            config: {
                title: '分享推荐',
                desc:'分享',
                img:require('@/assets/images/gzlz/banner.png'),
                img_title:'分享',
                link: 'http://www.baidu.com',
                // success: () => {console.log('success')}, //成功回调
                // cancel: () => {console.log('cancel')}, //取消回调
            },
            share_poster:null,
            avatar:null,
            username2:null,
            isreal:0,
            realname:null,
        }
    },
    mounted(){
        // console.log(this.userInfo)
        this.invite();
        this.initData();
        this.config_op();
        this.getUser();
        // this.setCode(this.inviteUrl);
        // this.myClipboard = new Clipboard(this.$refs['copy']);
    },
    computed:{
        ...mapGetters(['uid','userInfo','api',])
    },
    methods:{
        initData(){
            // this.inviteUrl = this.api+'/dist/index.html#'+'/register/'+this.uid+'/'+this.userInfo.mobile;
            // this.inviteUrl = this.api+'/dist/index.html#'+'/register?username='+this.username;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
        },
        config_op(){
            Trade.config_op().then(res=>{
                if(res.code==1){
                    this.share_poster = res.msg.share_poster;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        
        getUser(){
            Init.getUser().then(res=>{
                if(res.code==1){
                    // this.info = res.data;
                    this.avatar = res.data.avatar;
                    this.username2 = res.data.username;
                    this.isreal = res.data.isreal;
                    this.realname = res.data.realname;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        ss(){
            this.share_show = true;
            document.querySelector('.label').innerHTML = '';
            console.log(document.querySelector('.label').innerHTML)
        },
        // 截图
        cutView(i){
            let that = this;
            /**
             * 页面生成图片
             */
            // setTimeout(()=>{
            // Util.pageToImg(that,(base64)=>{
            //     let formData = new FormData();
            //     formData.append('image',base64);
            //     // base64上传
            //     Base.upload(formData).then((res)=>{
            //         if(res.code == 1){
            //             console.log(that.api+res.data)
            //             this.getShare(i,that.api+res.data)
            //         }else {
            //             mui.toast(res.msg);
            //             return ;
            //         }
            //     })
            // },'.page')
            // },1000)
            setTimeout(()=>{
                HB.saveScreen(function(res){
                    console.log('res',res)
                    if (mui.os.ios){
                        that.getShare(i,res.details.path)
                    }else{
                        that.getShare(i,res.details.file)
                    }
                })
            },200)
        },
        

        // 分享
        getShare(i,url){
            switch(+i){
                case 0:
                    Share._initShare();
                    setTimeout(()=>{
                        Share.sendShare(i+1,'WXSceneSession',url,true);
                    },200)
                    break;
                case 1:
                    Share._initShare();
                    setTimeout(()=>{
                        Share.sendShare(0,'WXSceneSession',url,true);
                    },200)
                    break;
                case 2:
                    Share._initShare();
                    
                    setTimeout(()=>{
                        Share.sendShare(0,'WXSceneTimeline',url,true);
                    },200)
                    break;
                case 3:
                    this.subinfo(url)
                    break;
                
            }
                
        },   
        invite(){
            Trade.invite().then(res=>{
                if(res.code==1){
                    this.username = res.data.username;
                    this.inviteUrl = this.api+'/dist/index.html#'+'/register?username='+this.username;
                    this.setCode(this.inviteUrl);
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        setCode(url){
            QRCode.toDataURL(url).then(url => {
                this.inviteSrc = url;
            })
            .catch(err => {
                console.error(err)
            })
        },
        copy(){
            this.myClipboard.on('success',(e)=>{
                mui.toast(this.lang!='en'?'复制成功！':this.lang_text.a135);
            })
            this.myClipboard.on('error',(e)=>{
                mui.toast(this.lang!='en'?'复制失败，请手动复制':this.lang_text.a136);
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .page{
        // background-image: url('../../../assets/images/jr/fx.jpg');
        // background-size: 100% 100%;
        // /deep/ header {
        //     box-shadow:none !important;
        //     .nav{
        //         background-color: rgba(0,0,0,0) !important;
        //     }
        // }
    }
    .body {
        // background: transparent;
        // background-color: #fff;
        
        // background-image: url('../../../assets/images/jr/fx.jpg');
        // background-size: 100% 100%;
        text-align: center;
        // border-top: 1px solid rgba(255,255,255,0.3);
        position: relative;
        .box{
            >img{
                width: 508px;
                margin: 83px 120px 36px;
            }
            .bot{
                position: relative;
                padding-top: 82px;
                .b_t{
                    width: 640px;
                    margin-left: 55px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -2;
                }
                .p_t{
                    font-size:32px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    margin-bottom: 40px;
                }
                .code{
                    width: 270px;
                    display: block;
                    margin: 0;
                    margin-bottom: 50px;
                    margin-left: 240px;
                }
                .t_bot{
                    font-size:32px;
                    color:rgba(51,51,51,1);
                    display: inline-block;
                    span{
                        color: #0093DD;
                    }
                }
                button{
                    width:150px;
                    height:68px;
                    background:rgba(0,147,221,1);
                    border-radius:8px;
                    vertical-align: middle;
                    margin-left: 30px;
                }
                #url{
                    opacity: 0;
                }
            }
        }
        .box2{
            position: fixed;
            // top: 1160px;
            right: 0;
            bottom: 6%;
            // background-color: red;
            width: 320px;
            text-align: center;
            padding-right: 36px;
            .top{
                font-weight: 650;
                font-size: 30px;
            }
            .bot{
                font-size: 20px;
            }
        }
        .img_l{
            width: 208px;
            // height: 180px;
            height: 208px;
            position: fixed;
            // top: 966px;
            bottom: 14%;
            // top: 938px;
            left: 82px;
            // opacity: 0.3;
        }
        
        .img_r{
            width: 208px;
            // height: 180px;
            height: 208px;
            position: fixed;
            right: 78px;
            bottom: 14%;
            // top: 966px;
            // top: 938px;
            // background-color: red;;
            // opacity: 0.3;
        }

    }
    // .bgc{
    //     position: fixed;
    //     width: 100%;
        
    // }
    
.share_box{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 998;
    .share_btn{
        width: 100%;
        position: fixed;
        // bottom: 88px;
        bottom: 0;
        left: 0;
        background-color: #fff;
        padding: 50px 30px 20px;
        display: flex;
        z-index: 999;
        // border-top: 1px solid rgba(55,142,213,1);
        // border-bottom: 1px solid rgba(55,142,213,1);
        li{
            flex: 1;
            text-align: center;
            img{
                width: 68px;
            }
            p{
                color: #333;
            }
        }
        /deep/ #nativeShare{
            flex:1;
            padding: 0;
            .list{
                .list-item{
                    margin: 0;
                    display: inline-block;
                    width: 100%;
                }
            }
        }
    }
}
</style>
