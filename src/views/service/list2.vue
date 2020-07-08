<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'问题类型':'Type')" :canback="Boolean(1)"></m-header>
    <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        

        <ul class="bot" >
            <li v-for="(v,i) in list" :key="i" @click="$router.push({name:'Problem',query:{id:v.id,name:v.name}})">
                <span>{{v.name}}</span>
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
import {a} from '@/assets/commonjs/lan.js';
export default {
  data(){
        return {
            list:[],
            lang_text:null,
            lang:null,
            screenHeight:null,
            id:null,
            page:1,
            name:null,
        }
  },
  mounted() {
      this.initData();
      this.feedBack();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.screenHeight = window.screen.height || window.screen.availHeight;
        this.id = this.$route.query.id;
        this.name = this.$route.query.name;
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
    },
    lazyLoad(){
        this.page = this.page+1;
        if(!this.noMore){
            
        }
    },
    formatDate(date){
        return Util.formatDate(date)
    },
    goTo(id,name){
        // this.$router.push({name:'List2',query:{id,name}})
    },
    feedBack(){
      Trade.feedBack({data:'category',page:this.page,pid:this.id,name:this.name}).then(res=>{
        if(res.code==1){
          // this.list = res.data;
          
          this.list = this.list.concat(res.data.category||[]);
          if(!res.data.question||res.data.question.length<20)
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
        // margin: 34px 0;
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
