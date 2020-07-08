<template>
  <div class="page">
    <m-header :title="title" :canback="Boolean(1)">
    </m-header>
    <section class="body">
        <ul class="bot">
            <li v-for="(v,i) in botList" :key="i" @click="goTo(v.route,v.name)">
                <span>{{v.name}}</span>
                <i class="iconfont iconright"></i>
            </li>
        </ul>
    </section>
    <m-load ref="load"></m-load>

  </div>
</template>
<script>
import {Init,Index,Base} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
export default {
  data(){
        return {
            botList:[
                {
                    name:'矿机相关问题',
                    route:'GD',
                    type:'',
                },
                {
                    name:'奉献值相关问题',
                    route:'GD',
                    type:'',
                },
                {
                    name:'活跃度相关问题',
                    route:'GD',
                    type:'',
                },
                {
                    name:'炼油相关问题',
                    route:'GD',
                    type:'',
                },
                {
                    name:'今日链条APP相关问题',
                    route:'GD',
                    type:'',
                },
            ],
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            title:null,
        }
  },
  mounted() {
      this.initData();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.title = this.$route.query.title
        console.log(this.title)
    },
    
    goTo(route,title){
        this.$router.push({name:route,query:{title}})
    }
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
</style>
