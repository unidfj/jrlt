<template>
  <div class="page">
    <m-header :title="title" :canback="Boolean(1)">
    </m-header>
    <section class="body">
        <div class="top">
            <img :src="topimg" alt="">
            <span>{{yy?data.name:data.name_en}}</span>
        </div>
        <div class="bot">
            <img :src="botimg" alt="">
            <div class="right">
                <p>{{yy?data.description:description_en}}</p>
                <img :src="api+data.image" alt="">
            </div>
        </div>
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
            // topimg:require('@/assets/images/jr/16.png'),
            topimg:require('@/assets/images/jr/logo1.png'),
            botimg:require('@/assets/images/jr/17.png'),
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            title:null,
            op_id:null,
            pid:null,
            yy:true,
            data:{
                description:null,
                name:null,
                image:null,
            },
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
        // this.title = this.$route.query.title
        // console.log(this.title)
        this.pid = this.$route.query.pid;
        this.op_id = this.$route.query.op_id;
        this.title = this.$route.query.name;
        if(localStorage.getItem('lang')=='en'){this.yy = false;}
    },
    
    // 获取列表
    gettitles2(){
        Trade.gettitles({page:this.page,type:'tc',pid:this.pid,op_id:this.op_id}).then(res=>{
            if(res.code==1){
                this.data = res.data;
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
    background-color: #fff;
    .top{
        height: 100px;
        line-height: 88px;
        padding: 0 30px;
        background-color: #fff;
        border-bottom: 20px solid @bg-color;
        >img{
            width: 40px;
            vertical-align: middle;
            margin-right: 20px;
        }
        span{
            font-size:34px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:550;
            color:rgba(51,51,51,1);
        }
    }
    .bot{
        display: flex;
        justify-content: space-between;
        padding: 22px 32px;
        img{
            width: 36px;;
            height: 45px;
            margin-right: 20px;
        }
        .right{
            p{
                font-size:24px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(102,102,102,1);
            }
            img{
                width: 617px;
                margin-top: 20px;
                height: auto;
            }
        }
    }
    
}
</style>
