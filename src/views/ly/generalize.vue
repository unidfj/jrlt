<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'物料推广':lang_text.promotion)" :canback="Boolean(1)"></m-header>
    <section class="body">
        <div class="box">
            <p class="top">{{lang_text&&(lang!='en'?'地推链接':lang_text.Ground)}}：</p>
            <p class="content">{{data.skydrive}}</p>
            <button ref="copy" data-clipboard-target="#url" data-clipboard-action="copy" @click="copy">{{lang_text&&(lang!='en'?'复制链接':lang_text.copyL)}}</button>
            <!-- <p class="bot">{{lang_text&&(lang!='en'?'点击链接进行下载/查看':lang_text.a6)}}</p> -->
            <p class="bot">{{lang_text&&(lang!='en'?'复制链接后打开淘宝粘贴链接进行购买物料':lang_text.a6)}}</p>
        </div>
        
    <input class="inp_url" type="text" id="url" :value="data.skydrive" readonly style="opacity:0">
    </section>
    <m-load ref="load"></m-load>

  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import Clipboard from 'clipboard';
import {a} from '@/assets/commonjs/lan.js';
export default {
  data(){
        return {
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            myClipboard:null,
            lang_text:null,
            lang:null,
            data:{
              skydrive:null,
            }
            
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
        // text-align: center;
        padding: 67px 26px 56px;
        .top{
            font-size:24px;
            font-weight:400;
            color:rgba(51,51,51,1);
            margin-left: 20px;
        }
        .content{
            width: 100%;
            color: #0093DD;
            border-bottom: 1px solid #0093DD;
            padding: 0 20px;
            height: 80px;
            line-height: 80px;
        }
        button{
            width:320px;
            height:88px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin: 46px 140px;
        }
        .bot{
            font-size:28px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(102,102,102,1);
            text-align: center;
        }
    }
    
}
</style>
