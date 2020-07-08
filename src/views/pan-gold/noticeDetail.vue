<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'公告详情':lang_text.Adetails)" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div >
        <div class="wrap">
          <div class="title">{{data.title}}</div>
          <div class="date">{{data.createtime}}</div>
        </div>
        <div class="new-con" v-html="data.contents"></div>
      </div>
    </section>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
import {a} from '@/assets/commonjs/lan.js';
export default {
  data() {
    return {
      id:null,
      list: [],
      lang_text:null,
      lang:null,
      data:{

      }
    };
  },
  mounted() {
    this.initData();
    let id = this.id;
    this.getNoticeDetail(id);
  },
  methods: {
    initData(){
      this.id = this.$route.params.id;
      this.lang_text = Object.assign({},a);
      this.lang = localStorage.getItem('lang');
    },
    /**
     * 公告详情
     */
    getNoticeDetail(id) {
      Owner.getNoticeDetail({id}).then(res => {
        if (res.code == 1) {
          this.list = res.data;
          this.data = res.data;
        } else {
          mui.toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  height: 100%;
  background:@bg-color;
  .wrap {
    margin: 30px 30px 0;
    // color: white;
    .title{
      font-size: 39px;
      text-align: center;
    }
    .date {
      color: #999;
    }
  }
  .new-con {
    margin: 10px 30px ;
    font-size: 28px;
    // color: white;
    /deep/ p{
      color: #333;
    }
  }
}
</style>
