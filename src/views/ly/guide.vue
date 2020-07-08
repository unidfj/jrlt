<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'商学院':lang_text.a72)" :canback="Boolean(1)"></m-header>
    <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        
        <div class="box">
            <div class="top">
                <p v-for="(v,i) in topList" :key="i" @click="change(i)" :class="{'se':se==i}">{{v}}</p>
            </div>
        </div>

        <ul class="content" v-show="se==0">
            <li v-for="(v,i) in list" :key="i">
                <img :src="api+v.image" alt="" @click="openV(v.video)">
                <div class="right">
                    <p class="title">{{v.name}}</p>
                    <p>{{v.description}}</p>
                    <p>{{v.life_day}}{{lang_text&&(lang!='en'?'发布时间':lang_text.a12)}}：{{formatDate(v.createtime)}}</p>
                </div>
            </li>
        </ul>

        <ul class="bot" v-show="se==1">
            <li v-for="(v,i) in list2" :key="i" @click="goTo(v.id,yy?v.name:v.name_en)">
                <span>{{yy?v.name:v.name_en}}</span>
                <i class="iconfont iconright"></i>
            </li>
        </ul>



    </section>
    <m-load ref="load"></m-load>

    <div class="sp" v-show="v_show">
        <!-- <iframe id="mainIframe" name="mainIframe" src="https://www.baidu.com/" frameborder="0" scrolling="auto" ></iframe> -->
        <iframe id="mainIframe" name="mainIframe" src="" frameborder="0" scrolling="auto" ></iframe>
        <button @click="v_show = false">{{lang_text&&(lang!='en'?'关闭':lang_text.down)}}</button>
    </div>
  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
export default {
  data(){
        return {
            topList:[
                '视频专区',
                '百问百答',
            ],
            botList:[
                {
                    name:'矿机相关问题',
                    route:'GL',
                    type:'',
                },
                {
                    name:'奉献值相关问题',
                    route:'GL',
                    type:'',
                },
                {
                    name:'活跃度相关问题',
                    route:'GL',
                    type:'',
                },
                {
                    name:'炼油相关问题',
                    route:'GL',
                    type:'',
                },
                {
                    name:'今日链条APP相关问题',
                    route:'GL',
                    type:'',
                },
            ],
            se:0,
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            type:'sp',
            page:1,
            list:[],
            list2:[],
            v_show:false,
            screenHeight:null,
            noMore:false,
            yy:true,
            lang_text:null,
            lang:null,
        }
  },
  mounted() {
      this.initData();
      this.gettitles();
    //   this.gettitles2();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.screenHeight = window.screen.height || window.screen.availHeight;
        if(localStorage.getItem('lang')=='en'){this.yy = false;}
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
        // 百問百答返回處理
        if(sessionStorage.getItem('change')){
            this.change(sessionStorage.getItem('change'))
            sessionStorage.removeItem('change')
        }

        
        this.topList[0] = this.lang!='en'?'视频专区':this.lang_text.Video;
        this.topList[1] = this.lang!='en'?'百问百答':this.lang_text.a13;
    },
    change(i){
        this.se = i;
        this.page = 1;
        this.list = [];
        this.list2 = [];
        if(this.se == 0){
            this.gettitles();
        }else{
            this.gettitles2();
        }
    },
    lazyLoad(){
        this.page = this.page+1;
        if(!this.noMore){
            if(this.se == 0){
                this.gettitles();
            }else{
                this.gettitles2();
            }
        }
    },
    formatDate(date){
        return Util.formatDate(date)
    },
    goTo(id,name){
        this.$router.push({name:'List2',query:{id,name}})
    },
    openV(v){
        // document.getElementById('mainIframe').src = v;
        // this.$router.push('http://www.baidu.com')
        // this.v_show = true;

        
        try {
            if(plus){
                plus.webview.create(v).show();  
            }
        }catch(e){
            location.href = v;
        }
    },
    // 获取视频列表
    gettitles(){
        Trade.gettitles({page:1,type:'sp'}).then(res=>{
            if(res.code==1){
                // this.list = res.data;
                this.list = this.list.concat(res.data||[]);
                if(!res.data||res.data.length<10)
                this.noMore = true;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 获取列表
    gettitles2(){
        Trade.gettitles({page:this.page,type:'tc'}).then(res=>{
            if(res.code==1){
                // this.list2 = res.data;
                this.list2 = this.list2.concat(res.data||[]);
                if(!res.data||res.data.length<20)
                this.noMore = true;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    
  },
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: @bg-color;
    .top{
        margin: 20px 18px 0;
        display: flex;
        justify-content: space-between;
        border: 1px solid #007AFF;
        border-radius: 10px;
        p{
            flex: 1;
            font-size:26px;
            color:#007AFF;
            text-align: center;
            height: 58px;
            line-height: 60px;
            border-left: 1px solid #007AFF;
            &:first-child{
                border-left: none;
            }
        }
        .se{
            background-color: #007AFF;
            color: #fff;
        }
    }

    .content{
        margin: 44px 30px;
        li{
            margin-bottom: 20px;
            background-color: #fff;
            width: 100%;
            border-radius: 10px;
            padding: 30px;
            display: flex;
            justify-content: space-between;
            border: 1px solid rgba(0,147,221,.3);
            img{
                width: 204px;
                height: 134px;
            }
            .right{
                flex: 1;
                text-align: left;
                p{
                    font-size:24px;
                    margin-left: 20px;
                    &:first-child{
                        font-size:32px;
                        font-weight:550;
                        color:rgba(51,51,51,1);
                        margin-bottom: 12px;
                    }
                    &:nth-child(2){
                        color:rgba(102,102,102,1);
                        margin-bottom: 14px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 44%;
                    }
                    &:last-child{
                        color:rgba(170,170,170,1);
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
    
    .bot{
        margin: 34px 0;
        background-color: #fff;
        li{
            border-bottom: 1px solid #eee;
            height: 108px;
            line-height: 108px;
            display: flex;
            justify-content: space-between;
            padding: 0 32px;
            &:last-child{
                border-bottom: none;
            }
            span{
                font-size:34px;
                color:rgba(51,51,51,1);
            }
            i{
                color: #333333;
            }
        }
    }
}

.sp{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    #mainIframe{
        position: absolute;
        top: 0px;
        width: 100%;
        height: 90%;
        left: 0;
    }
    button{
        width: 100%;
        height: 10%;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        position: absolute;
        bottom: 0;
    }
    
}
</style>
