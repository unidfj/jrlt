<template>
    <div class="page">
        <m-header title="收货地址" :canback="Boolean(1)" ></m-header>
        <section class="body">
            <p v-if="list.length==0" class="p_n">还没有地址~</p>
            <ul class="list" v-else>
                <li v-for="(v,i) in list" :key="i">
                    <p class="title">{{v.name + v.phone}}</p>
                    <p class="content">{{v.Area.province+v.Area.city+v.Area.region}}</p>
                </li>
            </ul>
            <button @click="$router.push({name:'Site'})">+立即添加</button>
        </section>
    </div>
</template>
<script>
import QRCode from 'qrcode';
import {Trade} from '@/server/server.js';
import {mapGetters} from 'vuex';
import Clipboard from 'clipboard'
export default {
    name:"invite",
    data(){
        return {
            inviteSrc:null,
            inviteUrl:null,
            myClipboard:null,
            bot_src:require('@/assets/images/jr/ewm_bg.png'),
            top_src:require('@/assets/images/jr/yqhy_wz.png'),
            list:[],
        }
    },
    mounted(){
        
        this.initData();
        this.lists();
        
    },
    computed:{
        ...mapGetters(['uid','userInfo','api',])
    },
    methods:{
        initData(){
            
        },
        lists(){
            Trade.lists().then(res=>{
                if(res.code==1){
                    this.list = res.data.list;
                }else{
                    mui.toast(res.msg)
                }
            })
        }
        
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;
        text-align: center;
        .p_n{
            font-size:32px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(170,170,170,1);
            margin-top: 80px;
        }
        button{
            width:600px;
            height:94px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin: 64px 75px;
        }
        .list{
            background-color: #fff;
            li{
                padding: 20px 30px;
                // height: 88px;
                // line-height: 88px;
                .title{
                    color: #aaa;
                    text-align: left;
                }
                .content{
                    color: #333;
                    text-align: left;
                }
            }
        }
    }
</style>
