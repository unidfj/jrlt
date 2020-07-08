<template>
    <div id="app" :style="{'padding-top': paddingTop+'px','padding-bottom':paddingBottom+'px'}">
    <!-- <div id="app"> -->
        <!-- <transition name="slide-fade">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
        <transition name="slide-fade">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
         </transition> -->
         
        <keep-alive>
            <router-view v-if="$route.meta.keepActive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepActive"/>
    </div>
</template>
<script>
import VConsole from 'vconsole';
import {HB} from '@/assets/commonjs/utils.js';
import {Base} from '@/server/server.js';
import {mapMutations} from 'vuex';
import safeAreaInsets  from 'safe-area-insets';
export default {
    name: 'app',
    data () {
        return{
            userName:" ",
            paddingTop: safeAreaInsets.top,
            paddingBottom: safeAreaInsets.bottom
            
        }
    },
    mounted:function(){
        // let vConsole = new VConsole();
        this.getData();
        setTimeout(() => {
            HB.autoUpdate();
        }, 3000);
    },
    created(){
        //挂载完之后监听安全区域的位置
        safeAreaInsets.onChange((style)=>{
            this.paddingTop = style.top;
            this.paddingBottom = style.bottom
            localStorage.setItem('top',style.top)
            localStorage.setItem('bottom',style.bottom)
        })
        // console.log('height',document.body.clientHeight)
    },
    methods:{
        ...mapMutations(['saveProData']),
        async getData(){
            await Base.getData().then(res=>{
                if(res.code ==1){
                    this.saveProData(res.data);
                    localStorage.setItem('proData',JSON.stringify(res.data));
                }else
                mui.toast(res.msg||'加载项目信息失败！')
            })
        },
        screen(){
            // 如果不允许进入全屏，发出不允许提示
            if (!screenfull.enabled) {
                this.$message('您的浏览器不能全屏');
                return false
            }
                screenfull.toggle();
                this.$message.success('全屏啦')
        }
    }
}
</script>
<style lang="less">
    @import "./assets/style/common.less";
</style>
<style lang="less">
    /* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(5px);
  opacity: 0;
}
</style>
