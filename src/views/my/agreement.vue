<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'身份实名认证':'Identity real name authentication')" :canback="Boolean(1)"></m-header>
        <section class="body">
            <img :src="logo" alt="" class="logo">
            <div class="text_box">
                <p class="title">{{lang_text&&(lang!='en'?'授权声明':lang_text.a215)}}</p>
                <p class="text">
                    {{lang_text&&(lang!='en'?text1:lang_text.a213)}}
                </p>
                <p class="text">
                    {{lang_text&&(lang!='en'?text2:lang_text.a214)}}
                </p>
            </div>
            <div class="btn_box">
                <button @click="back">{{lang_text&&(lang!='en'?'退出':lang_text.a211)}}</button>
                <button @click="$router.push({name:'Certify2'})">{{lang_text&&(lang!='en'?'同意':lang_text.a212)}}</button>
            </div>
        </section>
        
        <m-load ref="load"></m-load>
        
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';

export default {
    
    name:"invite",
    data(){
        return {
            logo:require('@/assets/images/jr/105.jpg'),
            lang_text:null,
            lang:null,
            text1:'iPayLinks服务于全球顶尖航旅企业、品牌电商、数字娱乐等客户。公司已陆续在香港、新加坡、马来西亚、英国、美国、迪拜等地设立分支机构，拥有国际AI实名刷脸认证PCI-DSS Level-1最高安全认证及多个海外金融支付牌照，iPayLinks作为业内领先的跨境AI智能刷脸认证，与新加坡“今日链条”达成战略合作伙伴，并打造一站式收单与下发体系。深挖行业、聚焦地区，新加坡唯一拥有成熟的石油（petro）行业区块链体系，多方知名奢侈品牌的顾客信息保存加密功能，助力今日链条全球客户业务发展。',
            text2:'点击“同意”则表示本人同意我们根据以上方式和目的的收集、使用及存储您提供的本人身份材料、面部特征等信息用于实名认证',
        }
    },
    mounted(){
        this.initData();
        // this.getlocation(0);
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
        },
        back(){
            this.$router.go(-1);
        }
        
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: #fff;
    .logo{
        // margin: 60px auto;
        width: 120px;
        margin: 60px 315px;
    }
    .text_box{
        width: 690px;
        margin: 0 30px 60px;
        .title{
            text-align: center;
            margin-bottom: 30px;
            color: #000;
            font-size: 36px;
        }
        .text{
            text-align: left;
            margin-bottom: 60px;
            color: #000;
        }
    }
    .btn_box{
        display: flex;
        justify-content: space-between;
        width: 660px;
        margin: 0 45px 30px;
        button{
            width: 300px;
            height: 88px;
            border:1px solid #3b85f5;
            border-radius: 60px;
            &:last-child{
                background-color: #3b85f5;
                color: #fff;
            }
            &:first-child{
                color: #3b85f5 !important;
            }
        }
    }
}

.page{
  /deep/ section .header .nav{
    background-color: rgba(55,142,213,1) !important;
    span{
      color: #fff;
    }
    .center{
      font-weight: 550;
    }
  }
}

</style>
