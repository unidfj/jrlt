<!-- 
    头部组件（全局注册组件）
    canback：是否可以回退
    nobg：背景是否为透明
    icon：title图标  iconfont
-->
<template>
    <section>
        <header :class="{'header':true,'no-shade':nobg}">
            <nav :class="{'nav':true,'no-bg':nobg}">
                <span class="left iconfont iconback" @click.stop="goBack" v-if="canback"></span>
                <p :class="{'center':true,'center-white':nobg}"><i :class="icon"></i> {{title}}</p>
                <p :class="{'right':true,'center-white':nobg}"><slot></slot></p>
            </nav>
        </header>
    </section>
</template>
<script>
export default {
    props:{
        title:{},
        canback:{
            type:Boolean,
            default(){
                return false;
            }
        },
        nobg:{
            type:Boolean,
            default(){
                return false;
            }
        },
        right:{
            type:Boolean,
            default(){
                return false;   
            }
        },
        setback:{
            type:Boolean,
            default(){
                return false;
            }
        },
        icon:{}
    },
    data(){
        return {}
    },
    methods:{
        goBack(){
            if(this.setback){
                this.$emit('back')
            }else {
                this.$router.go(-1);
            }
        }
    }
}
</script>
<style lang="less" scoped>
.header{
    width: 100%;
    min-height: 40PX;
    position: relative;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
    letter-spacing: 2px;
    z-index:2;
    .nav {
        // background-color: #304d79;
        // background-color: #fff;
        background-color: rgba(55,142,213,1) !important;
        height: 40PX;
        line-height: 40PX;
        position: relative;
        // border-bottom: 1PX solid #E6E6E6;
        width: 100%;
        .center{
                text-align: center;
                font-size: 17PX;
                // color: #fff;
                // color: #333333;
                color: #fff;
                font-size: 34px;
            }
            .center-white {
                // color: white;
                color: #333;
                color: #fff;
            }
            >.left,>.right{
                position: absolute;
                min-width: 25%;
                max-width:40%;
                height:100%;
                white-space: nowrap;
                white-space:nowrap;
                .iconfont,&.iconfont{
                    font-size: 34px;
                }
            }
            >.left{
                padding-left: 2%;
                left:0;
                top:0;
                color: #333;
                color: #fff;
                text-align: left;
            }
            >.right{
                padding-right: 5%;
                right:0;
                top:0;
                text-align:right;
                color: #fff;
            }
    }
    .no-bg {
        background: none;
        
    }
}
.no-shade {
    box-shadow:none;
    // color: white;
    color: #333;
}
</style>

