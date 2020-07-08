<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'收款账户':lang_text.a69)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <ul class="list">
                <li v-for="(item,index) in navList" :key="index">
                    <router-link class="item" :to="{name:item.route,params:{type:item.type}}" >
                        <span>{{item.name}}</span>
                        <i class="iconfont iconright"></i>
                    </router-link>
                </li>
                
            </ul>
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
                // {
                //     name:'微信收款方式',
                //     route:'Bind',
                //     type:'wechat'
                // },
                {
                    name:'支付宝收款方式',
                    route:'Bind',
                    type:'ali'
                },
                // {
                //     name:'添加银行卡',
                //     route:'AddCard',
                //     type:''
                // },
                
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

            // this.navList[0].name = this.lang!='en'?'微信收款方式':this.lang_text.a110;
            // this.navList[1].name = this.lang!='en'?'支付宝收款方式':this.lang_text.a111;
            // this.navList[2].name = this.lang!='en'?'添加银行卡':this.lang_text.a112;

            this.navList[0].name = this.lang!='en'?'支付宝收款方式':this.lang_text.a111;
        },
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
    }
</style>

