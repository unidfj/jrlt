<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'兑换记录':lang_text.a122)" :canback="Boolean(1)"></m-header>
        <section class="body" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">


        <ul class="list">
            <li>
                <p>{{lang_text&&(lang!='en'?'会员昵称':lang_text.a137)}}</p>
                <p>{{lang_text&&(lang!='en'?'股权数量':lang_text.a138)}}</p>
                <p>{{lang_text&&(lang!='en'?'油数量':lang_text.a140)}}</p>
                <p>{{lang_text&&(lang!='en'?'兑换时间':lang_text.a139)}}</p>
            </li>

            <li v-for="(v,i) in list" :key="i">
                <p>{{v.username}}</p>
                <p>{{v.target_money}}</p>
                <p>{{v.source_money}}</p>
                <p>{{v.checktime}}</p>
            </li>
        </ul>
            
            <m-load ref="load"></m-load>
        </section>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
    },
    data () {
        return {
            list:[],
            page:1,
            screenHeight:null,
            noMore:false,
            lang_text:null,
            lang:null,
        }
    },
    mounted(){
        this.initData();
        this.exlog()
    },
    computed:{
        ...mapGetters(['uid','userInfo'])
    },
    methods:{
        initData(){
            this.screenHeight = window.screen.height || window.screen.availHeight;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
        },
        
        lazyLoad(){
            this.page = this.page+1;
            if(!this.noMore){
                this.exlog(); 
            }
        },
        exlog(){
            Trade.exlog({do:'select',page:this.page}).then(res=>{
                if(res.code==1){
                    // this.list = res.data;
                    
                    this.list = this.list.concat(res.data||[]);
                    if(!res.data||res.data.length<20)
                    this.noMore = true;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: #f7f7f7;
    
    >.list{
        padding: 30px 30px 34px 26px;
        background-color: #fff;
        margin-top: 34px;
        li{
            display: flex;
            justify-content: space-between;
            margin-bottom: 23px;
            p{
                text-align: center;
                font-size:24px;
                font-weight:400;
                color:rgba(153,153,153,1);
                flex: 10;
                &:first-child{
                    text-align: left;
                    flex: 8;
                }
                &:last-child{
                    text-align: right;
                    flex: 16;
                }
                // &:nth-child(2){
                //     flex: 8;
                // }
            }
            &:first-child{
                p{
                    font-size:28px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    margin-bottom: 13px;
                }
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
    }
}
</style >



