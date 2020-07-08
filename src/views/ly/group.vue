<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'加入群聊':lang_text.a10)" :canback="Boolean(1)"></m-header>
    <section class="body">
        <div class="box">
            <img :src="api+data.wx_code" alt="">
            <!-- <img :src="defaultBanner" alt=""> -->
            <p class="title">{{lang_text&&(lang!='en'?'微信号':lang_text.a8)}}：{{data.wx_number}}</p>
            <p class="bot">{{lang_text&&(lang!='en'?'添加群主微信，一起加入群聊吧！':lang_text.a9)}}</p>
            <button ref="copy" data-clipboard-target="#url" data-clipboard-action="copy" @click="copy">{{lang_text&&(lang!='en'?'复制微信号':'Copy')}}</button>
        </div>
        <!-- <vue-native-share :shareMenu="shareMenu" :config="config" /> -->
    <input class="inp_url" type="text" id="url" :value="data.wx_number" readonly style="opacity:0">
    </section>
    <m-load ref="load"></m-load>

  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret,HB,Share} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
import Clipboard from 'clipboard';
import vueNativeShare from 'vue-native-share';

export default {
  data(){
        return {
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            lang_text:null,
            lang:null,
            data:{

            },

        }
  },
  mounted() {
      this.initData();
      this.config_op();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.myClipboard = new Clipboard(this.$refs['copy']);
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');

        this.config.title = this.lang_text&&(this.lang!='en'?'加入群聊':this.lang_text.a10);
        this.config.img = this.api+this.data.wx_code;
        this.config.link = this.api+'/dist/index.html#'+this.$route.fullPath;
        
        
    },
    // 朋友圈分享
    subinfo(url){
        this.shareToQq(url);
    },
    // 朋友圈分享
    shareToQq(picurl){
        var shareqqzonestring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=欢迎加入群聊'+'&pics='+picurl+'&url='+this.api+'/dist/index.html#'+this.$route.fullPath;
        window.open(shareqqzonestring,'qZone','height=400,width=400,top=100,left=100');
    },
    config_op(){
      Trade.config_op().then(res=>{
        if(res.code==1){
          this.data = res.msg;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    copy(){
        this.myClipboard.on('success',(e)=>{
            mui.toast('复制成功！');
        })
        this.myClipboard.on('error',(e)=>{
            mui.toast('复制失败，请手动复制');
        })
    }
  },
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: @bg-color;
    .box{
        background-color: #F8F8FB;
        width: 652px;;
        margin: 56px 49px;
        border-radius: 20px;
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        text-align: center;
        padding: 116px;
        img{
            width: 270px;
            height: 270px;
        }
        .title{
            font-size:34px;
            font-weight:400;
            color:rgba(0,147,221,1);
            margin-top: 30px;
            margin-bottom: 28px;
        }
        .bot{
            font-size:28px;
            font-weight:400;
            color:rgba(102,102,102,1)
        }
        button{
            width:320px;
            height:88px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            // margin: 46px 140px;
            margin-top: 30px;
        }
    }
    
}
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
