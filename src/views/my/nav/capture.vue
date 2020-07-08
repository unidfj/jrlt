<template>
    <div class="page">
        <div class="header">
            <i class="left iconfont iconback" @click="$router.push({name:'My2'})"></i>
            <div class="center">{{lang_text&&(lang!='en'?'实名认证':lang_text.Verified)}}</div>
        </div>
        <section class="body">
            

            <!-- <img :src="file_src" alt=""> -->
            <img :src="src?(api+src):''" alt="">
            <button class="bot_btn" @click="Capture">{{lang_text&&(lang!='en'?'拍照':'Capture')}}</button>
            <button class="bot_btn"  @click="realname_img">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load,HB} from '@/assets/commonjs/utils.js';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
        mPwd
    },
    name:"invite",
    data(){
        return {
            file_src:require('@/assets/images/jr/bg1.png'),
            src:null,
            lang_text:null,
            lang:null,
        }
    },
    created(){
        window.back3 = this.back3;
    },
    mounted(){
        this.initData();
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            // this.formData.id = this.uid;
            // this.formData.mobile = this.userInfo.mobile;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            
            let cookie = this.$route.query.cookie;
            if(cookie){
                localStorage.setItem('cookie',cookie)
            }
        },
        // 调用相机
        Capture(){
            HB.HBCapture(this,res=>{
                console.log('res',res)
                this.src = res;
            })
        },
        // 校验实名认证信息
        realname_img(){
            Trade.realname_img({img:this.api+this.src}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    this.$router.push({name:'Pay2'})
                }
            })
        },
        // 获得焦点
        focus_css(e){
            // p标签显示
            e.currentTarget.previousElementSibling.style.display = 'block';
            e.currentTarget.placeholder = '',
            // li底部边框变色
            e.currentTarget.parentNode .style.borderBottom = '1px solid #0093DD';
            e.currentTarget.parentNode .style.margin = '20px 0';
            // li删除类名
            e.currentTarget.parentNode.classList.remove("li_se");

        },
        //  失去焦点
        blur_css(e){
            if((e.target.value).replace(/^(\s|\u00A0)+/,'')){
                // li添加类名
                e.currentTarget.parentNode.classList.add("li_se");
            }else{
                // p标签隐藏
                e.currentTarget.previousElementSibling.style.display = 'none';
                // li底部边框变色
                e.currentTarget.parentNode.style.borderBottom = '1px solid #F1F2F4';
                // li删除类名
                e.currentTarget.parentNode.classList.remove("li_se");
                e.currentTarget.placeholder = e.currentTarget.previousElementSibling.innerHTML;
            }
            e.currentTarget.parentNode .style.margin = '0px 0 5px 0';
        },
        
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: @bg-color;
    >img{
        width: 690px;
        // margin: 20px 30px;
        margin: 20px 30px;
        max-height: 600px;
    }
    .bot_btn{
        width: 600px;
        height: 88px;
        margin: 20px 75px;
        background-color: #378ed5;
    }
    
}
.page{
    position: relative;
    
    .header{
        width: 100%;
        height: 80px;
        line-height: 80px;
        display: flex;
        justify-content: space-between;
        background-color: #378ed5;
        .center{
            text-align: center;
            font-size: 17PX;
            // color: #fff;
            // color: #333333;
            color: #fff;
            font-size: 34px;
            flex: 15;
            text-align: left;
            color: #333;
            color: #fff;
        }
        .left{
            flex: 10;
            padding-left: 30px;
            color: #fff;
        }
    }
}
</style>
