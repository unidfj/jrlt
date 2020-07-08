<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'详情':lang_text.Details)" :canback="Boolean(1)"></m-header>
    <section class="body">
        
      <div class="box">
          <div class="top">
                <p class="title">{{data.title}}</p>
                <p class="time">{{data.updatetime}}</p>
          </div>
          <div class="content">
              <!-- <p class="text">{{data.content}}</p> -->
              <div v-html="data.content" class="text"></div>
              <!-- <img :src="api+data.image" alt=""> -->
          </div>
      </div>

    </section>
  </div>
</template>
<script>
import { Owner,Base } from "@/server/server.js";
import {mapGetters,mapMutations} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
export default {
  data() {
    return {
      noticeList: [],
      type:'mh',
      id:null,
      lang_text:null,
      lang:null,
      data:{
        title:null,
        updatetime:null,
        content:null,
      }
    };
  },
  mounted() {
      this.initData();
      this.getnew();
      
  },
  computed: {
    ...mapGetters(['uid','api','bannerSrc','coinTxt','proData'])
  },
  methods: {
    initData(){
    //   this.type = this.$route.query.type;
        this.id = this.$route.query.id;
        
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');

    },
    getnew(){
        Base.getnew({new_id:this.id}).then(res=>{
            if(res.code==1){
                this.data = res.data.newdata;
                let i = this.data.content.indexOf('/uploads');
                this.data.content = this.data.content.slice(0,i) + this.api + this.data.content.slice(i,9999999)
            }else{
                mui.toast(res.msg)
            }
        })
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background: @bg-color;
  padding: @padding-primary;
  height: 100%;
    .text{
        /deep/ p{
            color: #333 !important;
        }
    }
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
            /deep/ p{
              img{
                width: 100%;
              }
            }
        }
    }
}
</style>

