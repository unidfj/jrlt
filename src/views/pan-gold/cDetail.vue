<template>
  <div class="page">
    <!-- <m-header :title="lang_text&&(lang!='en'?'资讯内容':lang_text.a45)" :canback="Boolean(1)"></m-header> -->
    <m-header :title="lang_text&&(lang!='en'?'今日链条':'News')" :canback="Boolean(1)"></m-header>
    <section class="body">
        
      <div class="box">
          <div class="top">
                <p class="title">{{data.title}}</p>
                <p class="time">{{data.createtime}}</p>
          </div>
          <div class="content">
              <!-- <p class="text">今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录今日链条APP用户量超过10w：创造各界APP用户量新纪录</p> -->
              <div class="text" v-html="data.content"></div>
              <!-- <img :src="defaultBanner" alt=""> -->
          </div>
          <div class="bot">
              <p @click="changeAle" :class="{'b_color':has_share}">
                  <i class="iconfont icondianzan"></i>
                  <span>{{data.share}}</span>
              </p>
              <p @click="ss" >
                  <i class="iconfont iconzhuanfa-"></i>
                  <span>{{lang_text&&(lang!='en'?'分享':lang_text.a46)}}</span>
              </p>
          </div>
      </div>

    </section>
    <div class="ale" v-show="ale">
        <div class="box">
            <p class="title">{{lang_text&&(lang!='en'?'点赞':lang_text.like)}}</p>
            <p class="content">{{tips}}</p>
            <button @click="share">{{lang_text&&(lang!='en'?'确认':lang_text.confirm)}}</button>
        </div>
    </div>
    <div class="setIn" v-show="!has_read">
        <span class="se_time">{{(+time).toFixed(1)}}s</span>
        <div class="rect-box">
            <div class="rect left">
                <div class="circle" :style="{'-webkit-animation': `left ${time2}s linear`}"></div>  
            </div>
            <div class="rect right">
                <div class="circle" :style="{'-webkit-animation': `right ${time2}s linear`}"></div>  
            </div>
        </div>
    </div>
    <div class="share_box" @click="share_show = false" v-show="share_show">
        <ul class="share_btn" >
            <li v-for="(v,i) in share_list" :key="i" @click="getShare(i)">
                <img :src="v.img" alt="">
                <p>{{v.title}}</p>
            </li>
            <vue-native-share :shareMenu="shareMenu" :config="config" />
        </ul>
    </div>
    <m-load ref="load"></m-load>

  </div>
</template>
<script>
import {Init,Index,Base} from '@/server/server.js';
import {Util,Load,Secret,Share} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
import vueNativeShare from 'vue-native-share';
export default {
  components:{
    vueNativeShare
  },
  data(){
      return {
        defaultBanner:require('@/assets/images/gzlz/banner.png'),
        ale:false,
        time:99,
        time2:99,
        id:null,
        has_read:null,
        has_share:null,
        data:{
            title:null,
            createtime:null,
            content:null,
            share:null,
        },
        info:{
            content:null,
        },
        lang_text:null,
        lang:null,
        tips:null,
        setTime:null,
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
            title: '今日链条',
            desc:'不可描述',
            img:require('@/assets/images/gzlz/banner.png'),
            img_title:'图片标题',
            link: 'http://www.baidu.com',
            // success: () => {console.log('success')}, //成功回调
            // cancel: () => {console.log('cancel')}, //取消回调
        },
        // share_show:true,
      }
  },
  created(){
      this.get_second();
  },
  mounted() {
      this.initData();
      this.get_news_content();
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.id = this.$route.query.id;
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
    },
    Dtime(){
        if(this.has_read){
            return
        }
        this.setTime = setInterval(()=>{
            // console.log(this.time)
            this.time -= 0.1
            if(this.time<=0){
                
                if(!this.$route.query.id){
                    clearInterval(this.setTime)
                    return;
                }
                document.querySelector('.left .circle').style.border = '4px solid #0093DD';
                document.querySelector('.right .circle' ).style.border = '4px solid #0093DD'; 
                document.querySelector('.setIn' ).style.border = '2px solid #0093DD'; 
                document.querySelector('.se_time' ).style.left = '8px'; 
                document.querySelector('.se_time' ).style.top = '10px'; 
                document.querySelector('.setIn').style.display = 'none';
                clearInterval(this.setTime)
                this.time = 0;
                this.read();
            }
        },100)
    },
    ss(){
        this.share_show = true;
        document.querySelector('.label').innerHTML = '';
        // console.log(document.querySelector('.label').innerHTML)
    },
    // 分享
    getShare(i){
        switch(+i){
            case 0:
                Share._initShare();
                setTimeout(()=>{
                    Share.sendShare(i+1,'WXSceneSession',this.api+'/dist/index.html#'+this.$route.fullPath,false,this.data.title);
                },200)
                break;
            case 1:
                Share._initShare();
                setTimeout(()=>{
                    // Share.sendShare(i,'WXSceneSession',this.api+'/dist/index.html#'+this.$route.fullPath);
                    Share.sendShare(0,'WXSceneSession',this.api+'/dist/index.html#'+this.$route.fullPath,false,this.data.title);
                },200)
                break;
            case 2:
                Share._initShare();
                setTimeout(()=>{
                    // Share.sendShare(2,'WXSceneTimeline',this.api+'/dist/index.html#'+this.$route.fullPath);
                    Share.sendShare(0,'WXSceneTimeline',this.api+'/dist/index.html#'+this.$route.fullPath,false,this.data.title);
                },200)
                break;
            case 3:
                this.subinfo()
                break;
            
        }
             
    },   
    subinfo(){
        this.shareToQq(this.data.title,encodeURIComponent(this.api+'/dist/index.html#'+this.$route.fullPath));
    },
    shareToQq(title,url,picurl){
        var shareqqzonestring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+title+'&pics='+picurl+'&url='+url;
        window.open(shareqqzonestring,'newwindow','height=400,width=400,top=100,left=100');
    },
    // 获取定时任务秒数
    get_second(){
        Base.get_second().then(res=>{
            if(res.code==1){
                this.time = res.data.second;
                this.time2 = res.data.second;
                this.tips = res.data.tips;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 点赞
    share(){
        this.ale = false;
        Base.share({id:this.id}).then(res=>{
            mui.toast(res.msg)
            if(res.code==1){
                this.has_share = true;
                this.data.share = this.data.share+1;
            }else{
                // mui.toast(res.msg)
            }
        })
    },
    
    // 阅读增加奉献值
    read(){
      Base.read({id:this.id}).then(res=>{
        mui.toast(res.msg)
      })
    },
    // 内容
    get_news_content(){
      Base.get_news_content({id:this.id}).then(res=>{
        if(res.code==1){
            this.has_read = res.data.has_read;
            this.has_share = res.data.has_share;
            this.data = res.data.data;

            this.config.title = this.data.title;
            this.config.img_title = this.data.img_title;
            this.config.desc = this.data.desc;
            this.config.link = this.api+'/dist/index.html#'+this.$route.fullPath;
            this.config.img = "https://ftp.bmp.ovh/imgs/2020/04/93aa0cdc8264eef5.png";

            this.Dtime();
            // 添加前缀
            this.info  = res.data.data;
            if(this.info.content){
                let strArr = this.info.content.split('//inews');
                for(let i = 0;i<strArr.length;i++){
                    if(i>0){
                        strArr[i] = 'https://inews'+strArr[i];
                    }
                }
                this.info.content = strArr.join('');
            }
            //添加前缀结束
            

        }else{
          mui.toast(res.msg)
        }
      })
    },
    changeAle(){
        if(this.has_share){return}
        this.ale = true;
    },
    formatTime(time){
      return Util.formatTime(time).substr(0,5);
    },
  },
    beforeDestroy(){
        clearInterval(this.setTime);
    },
    beforeRouteLeave (to, from, next) {
        clearInterval(this.setTime);
        next();
    }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: #fff;
    padding: 30px 38px;
    .box{
        .top{
            border-bottom: 1px solid #eee;
            .title{
                font-size:34px;
                color:rgba(51,51,51,1);
                margin-bottom: 6px;
                font-weight: 550;
                line-height: 48px;
            }
            .time{
                font-size:24px;
                color:rgba(170,170,170,1);
                text-align: rect;
                margin-bottom: 12px;
            }
        }
        .content{
            margin-top: 20px;
            .text{
                font-size:24px;
                color:rgba(102,102,102,1);
            }
            img{
                width:674px;
                margin-top: 30px;
            }
        }
        .bot{
            width: 100%;
            text-align: right;
            margin-top: 30px;
            p{
                font-size:24px;
                color:rgba(102,102,102,1);
                display: inline-block;
                i{
                    font-size: 48px;
                    margin-right: 10px;
                }
                &:last-child{
                    margin-left: 64px;
                }
            }
            .b_color{
                color: #0093DD;
            }
        }
    }
  
}
.ale{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .box{
        text-align: center;
        position: absolute;
        width: 540px;
        padding-top: 30px;
        border-radius: 10px;
        top: 480px;
        left: 105px;
        background-color: #fff;
        .title{
            font-size:36px;
            font-weight:550;
            color:rgba(0,147,221,1);
            margin-bottom: 15px;
        }
        .content{
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            padding: 0 30px 48px;
        }
        button{
            width: 100%;
            height: 88px;
            border-radius: 0;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        }
    }
}
.setIn{
    position: fixed;
    right: 34px;
    bottom: 440px;
    z-index: 9;
    background-color: #fff;
    box-shadow:0px 0px 10px 0px rgba(0,147,221,0.29);
    border-radius: 50%;
    // position: relative;
    span{
        position: absolute;
        left: 18px;
        top: 20px;
        font-size: 20px;
        color: #FFB800;
    }
            .rect-box{
                width: 80px;
                height: 80px;
                /*border: 1px solid #ccc;*/
                // box-sizing: border-box;
                position: relative;
            }
            .rect{
                width: 40.5px;
                height: 80px;
                // box-sizing: border-box;
                position: absolute;
                overflow:hidden;
                top: 0;
            }
            .left{
                // left: 0.03125px;
                left: 0;
            }
            .right{
                // right: 0.625px;
                right: 0;
            }
            .rect > div{
                width: 80px;   
                height: 80px;   
                border:4px solid transparent;   
                border-radius: 50%;   
                // box-sizing: border-box;
                position: absolute;   
                top:0;  
                z-index: 3;
                transform: rotate(45deg);
            }
            .right .circle{   
                border:4px solid #EBEBEB;       
                right:0;   
                // -webkit-animation: right 5s linear ;   
                // animation: right 10s linear ;
            }   
            .left .circle{   
                border:4px solid #EBEBEB;     
                left:0;   
                // -webkit-animation: left 5s linear ; 
                // animation: right 10s linear ;
                
            }   
            @-webkit-keyframes right{   
                0%{   
                    border-left:4px solid #0093DD;
                    border-bottom:4px solid #0093DD;
                    -webkit-transform: rotate(45deg);   
                }   
                50%{   
                
                    border-left:4px solid #0093DD;   
                    border-bottom:4px solid #0093DD;   
                    -webkit-transform: rotate(225deg);   
                }   
                100%{   
                    border-left:4px solid #0093DD;   
                    border-bottom:4px solid #0093DD;   
                    -webkit-transform: rotate(225deg);   
                }   
            }   
            @-webkit-keyframes left{   
                0%{   
                    border-top:4px solid #0093DD;   
                    border-right:4px solid #0093DD;  
                    -webkit-transform: rotate(45deg);   
                }   
                50%{   
                        
                    border-top:4px solid #0093DD;   
                    border-right:4px solid #0093DD;   
                    -webkit-transform: rotate(45deg);   
                }   
                100%{   
                    border-top:4px solid #0093DD;   
                    border-right:4px solid #0093DD;   
                    -webkit-transform: rotate(225deg);   
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


<style lang="less" scoped>
.text{
    /deep/ p{
        color: #333;
    }
    
    /deep/ img{
        max-width: 100% !important;
    }
}
.adBoxItem1 {
    padding-top: 20px;
    padding-bottom: 15px;
    overflow: hidden;
    padding-right: 0px;
    /*border-bottom: 1px solid #CCCCCC;*/
    margin: 0px 0px 0px 0px;
    background: #FFF;
}
.adPic{
    margin-right: 0px;
    float: left;
}
.adPic img {
    margin: 5px 15px 10px 0px;
    width: 200px;
    height: 112px;
}
.adBoxItem1 h3 {
    margin: 0px 0px 0px 0px;
    padding: 0px;
    font-size: 22px;
    font-weight: normal;
    font-family: "微软雅黑";
    line-height: 28px;
}
.adText p {
    margin: 5px 0px 13px 0px;
    padding: 0px;
    font-size: 14px;
    color: #333;
    line-height: 18px;
    font-family: "微软雅黑";
}
.adBoxItem2 h3 {
    margin: 0px 0px 0px 0px;
    padding: 0px;
    font-size: 22px;
    font-weight: normal;
    font-family: "微软雅黑";
    line-height: 28px;
}
.source{
    display: block;
    line-height: 18px;
    height: 18px;
    overflow: hidden;
    padding: 0 0 0 30px;
}
.ad_flag{
	font-size:14px;
	color:#2a90d7;
	float:left;
	border: 1px solid #2a90d7;
}
.picItem{
    margin-top: 10px;
    margin-bottom: 8px;
}
.picItem  a{
    float: left;
    margin-right: 32px;
}
.adBoxItem2 .from{
    margin-top: 123px;
}
/*灰色框2*/
.left-huikuang2{
	margin:25px 0px 0px 0px;
	padding:10px 1px 5px 7px;
	border:1px solid #CCCCCC;
	overflow:hidden;
	font-family:"微软雅黑";
	}
.left-huikuang2 h3{
	margin:5px 0px 10px 0px;
	font-size:18px;
	font-weight:normal;
	color:#083E6D;
}
.kua-left2{
	margin:0px;
	padding:0px;
	float:left;
	width:150px;
	}
.kua-left2 p{
	margin:0px 0px 5px 0px;
	padding:0px;
	font-size:12px;
	color:#333;
	}
.kua-left2 p a:link,.kua-left2 p a:visited{
	text-decoration:none;
	color:#333;
	}
.kua-left2 p a:hover{
	text-decoration:underline;
	}
.kua-right2{
	margin:0px;
	padding:0px;
	float:right;
	width:150px;
	}
.kua-right2 p{
	margin:0px 0px 5px 0px;
	padding:0px;
	font-size:12px;
	color:#333;
	}
.kua-right2 p a:link,.kua-right2 p a:visited{
	text-decoration:none;
	color:#333;
	}
.kua-right2 p a:hover{
	text-decoration:underline;
	}
</style>
