<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'安全设置':lang_text.a108)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <ul class="list">
                <li v-for="(item,index) in navList" :key="index">
                    <router-link class="item" :to="{name:item.route,query:{type:item.type}}" >
                        <span>{{item.name}}</span>
                        <i class="iconfont iconright"></i>
                    </router-link>
                </li>
            </ul>
            <button class="btn btn-blue btn-quit" @click="toQuit">{{lang_text&&(lang!='en'?'退出登录':lang_text.a107)}}</button>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init} from '@/server/server.js';
import {Util,Load,HB} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations}  from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
export default {
    name:'set',
    data(){
        return {
            isApp:false,
            navList:[
                {
                    name:'修改登录密码',
                    route:'SetPwd',
                    type:'login'
                },
                {
                    name:'修改交易密码',
                    route:'SetPwd',
                    type:'trade'
                },
            ],
            lang_text:null,
            lang:null,
        }
    },
    mounted(){
        this.initData();
    },
    computed:{
        ...mapGetters(['userInfo','version'])
    },
    methods:{
        ...mapMutations(['saveUserInfo','saveUserID','saveCoinTxt','saveProData','saveVersion']),
        initData(){
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');

            this.navList[0].name = this.lang!='en'?'修改登录密码':this.lang_text.a40;
            this.navList[1].name = this.lang!='en'?'修改交易密码':this.lang_text.a41;
        },
        getShare(){
            try{
                if(plus){
                    plus.share.getServices(res=>{
                        res[2].send( {type:'image',pictures:['http://fagzlz.a6shop.net:80/uploads/20190821/2924b90238ff3e6e48b4e85b71b5b39b.png'],extra:{scene:'WXSceneSession'}}, function(){
                            alert("分享成功！");
                        }, function(e){
                            alert("分享失败："+e.message);
                        });
                    },err=>{
                        console.log(err)
                    });
                }
            }catch(e){}
        },
        /**
         * 退出确认
         */
        toQuit(){
            try{
                if(plus){
                    mui.confirm('退出登录',actions=>{
                        if(actions.index==0)
                        this.quit();
                    })
                }
            }catch(e){
                mui.confirm('退出登录',actions=>{
                    if(actions.index==1)
                    this.quit();
                })
            }
        },
        /**
         * 退出操作
         */
        quit(){
            Load.loadStart(this);
            Init.quit().then(res=>{
                if(res.code == 1){
                    mui.toast(res.msg);
                    setTimeout(() => {
                        this.clearLocal();
                        Load.loadEnd(this);
                        this.$router.replace({name:'Login'});
                    }, 500);
                }else {
                    setTimeout(() => {
                        Load.loadEnd(this);
                        return ;                        
                    }, 500);
                }
            })
        },
        /**
         * 清楚缓存
         */
        clearLocal(){
            localStorage.clear();
            this.saveUserInfo(null);
            this.saveUserID(null);
            this.saveCoinTxt(null);
            this.saveProData(null);
            sessionStorage.setItem('btmNav',0);
        }
    }
    
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;
        // color: white;
        padding-top: 20px;
        .list {
            // margin: @margin-primary;
            // padding: 0 30px;
            background-color: #fff;
            li{
                padding: 0 30px;
                border-bottom: 1px solid rgba(0,147,221,.3);
                    // border: 1px solid rgba(0,147,221,.3);
                &:first-child{
                    border-top: 1px solid rgba(0,147,221,.3);
                }
                .item {
                    .display-flex();
                    justify-content: space-between;align-items: center;
                    padding: @padding-primary 0;
                }
            }
        }
        .btn-quit {
            width:630px;
            height:88px;
            border-radius:10px;
            border:1px solid rgba(0,147,221,1);
            margin: 110px 60px;
            background-color: rgba(0,0,0,0);
            color: #0093DD !important;
        }
    }
</style>

