<template>
  <div class="page">
    <m-header title="修改头像" :canback="Boolean(1)"></m-header>
    <section class="body">
        <div class="box">
            <p>点击修改头像</p>
            <img :src="avatar||tx" alt="">
            <input type="file" class="file" accept="image/*" @change="change($event)">
        </div>
    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import {Base,Owner,Init} from '@/server/server.js';
import {a} from '@/assets/commonjs/lan.js';
import {mapGetters,mapMutations} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
export default {
  data() {
    return {
        avatar:null,
        tx:require('@/assets/images/jr/logo1.png'),
    };
  },
  mounted() {
    this.initData();
    this.getUser();
    
  },
  computed:{
      ...mapGetters(['api'])
  },
  methods: {
    initData(){
        
    },
    getUser(){
        Init.getUser().then(res=>{
            if(res.code==1){
                this.avatar = res.data.avatar;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    
    change(event){
        let _This = this;
        let formData = new FormData();
        Load.loadStart(_This);            
        Util.uploadImgLimit(event.target.files[0],url=>{
            formData.append('image',url);
            Base.upload(formData).then((res)=>{
                Load.loadEnd(_This);
                if(res.code == 1){
                    this.avatar = this.api+res.data;
                    this.head_portrait(this.avatar)
                    
                }else {
                    mui.toast(res.msg);
                    return ;
                }
            })
        })
    },
    head_portrait(avatar){
        Owner.head_portrait({avatar}).then(res=>{
            if(res.code==1){
                // setTimeout(()=>{
                //     this.getUser();
                // },500)
                    this.getUser();
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
  height: 100%;
  background:@bg-color;
//   padding: 60px;
//   .content{
    
//   }
    .box{
        width: 300px;
        position: relative;
        margin-left: 225px;
        margin-top: 200px;
        img{
            width: 100%;
            // position: absolute;
            // left: 0;
            // top: 40px;
        }
        input{
            position: absolute;
            left: 0;
            top: 0px;
            width: 100%;
            height: 100%;
            z-index: 100;
            opacity: 0;
        }
        p{
            color: #000;
            text-align: center;
        }
    }
}
</style>
