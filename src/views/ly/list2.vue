<template>
  <div class="page">
    <!-- <m-header :title="title" :canback="Boolean(1)">
    </m-header> -->
    <div class="header">
        <span class="left iconfont iconback" @click.stop="goBack"></span>
        <p>{{title}}</p>
    </div>
    <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        

        <ul class="bot">
            <li v-for="(v,i) in list2" :key="i" @click="goTo(v.id,yy?v.name:v.name_en)">
                <span>{{yy?v.name:v.name_en}}</span>
                <i class="iconfont iconright"></i>
            </li>
        </ul>



    </section>
    <m-load ref="load"></m-load>

  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
export default {
  data(){
        return {
            se:0,
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            page:1,
            list2:[],
            v_show:false,
            pid:null,
            screenHeight:null,
            noMore:false,
            yy:true,
            title:null,
        }
  },
  mounted() {
      this.initData();
      this.gettitles2();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.screenHeight = window.screen.height || window.screen.availHeight;
        this.pid = this.$route.query.id;
        this.title = this.$route.query.name;
        if(localStorage.getItem('lang')=='en'){this.yy = false;}
    },
    // 返回上一層
    goBack(){
        // this.$router.go(-2)
        // setTimeout(()=>{
        //     this.$router.push({name:'Guide',query:{id:1}})
        // },100)
        sessionStorage.setItem('change',1);
        this.$router.go(-1)
    },
    lazyLoad(){
        this.page = this.page+1;
        if(!this.noMore){
            this.gettitles2(); 
        }
    },
    formatDate(date){
        return Util.formatDate(date)
    },
    goTo(op_id,name){
        this.$router.push({name:'GD',query:{pid:this.pid,op_id,name}})
    },
    
    // 获取列表
    gettitles2(){
        Trade.gettitles({page:this.page,type:'tc',pid:this.pid}).then(res=>{
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
.header{
    width: 100%;
    height: 80px;
    line-height: 80px;
    background-color: rgba(55,142,213,1) !important;
    position: relative;
    >span{
        position: absolute;
        left: 30px;
        color: #fff;
    }
    p{
        text-align: center;
        flex: 1;
        color: #fff;
        font-size: 34px;
    }
}
</style>
