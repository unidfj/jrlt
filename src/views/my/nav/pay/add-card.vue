<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'银行卡收款方式':lang_text.a158)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="box">
                <ul>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'银行名称':lang_text.a154)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'银行名称':lang_text.a154)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.bank">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'支行名称':lang_text.a155)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'支行名称':lang_text.a155)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.bankname">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'银行账户名':lang_text.a156)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'银行账户名':lang_text.a156)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.bankuname">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'银行卡号':lang_text.a157)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'银行卡号':lang_text.a157)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="data.bankact">
                    </li>
                </ul>
            </div>
            <button class="bot_btn"  @click="$refs['pwd'].open()">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button>
        </section>
        <m-load ref="load"></m-load>
        <m-pwd ref="pwd" @pay="pay"></m-pwd>
    </div>
</template>
<script>
import {Init,Base,Owner} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
        mPwd
    },
    name:"invite",
    data(){
        return {
            file_src:require('@/assets/images/jr/s.png'),
            img1:null,
            img2:null,
            data:{
                bank:null,
                bankname:null,
                bankuname:null,
                bankact:null,
            },
            lang_text:null,
            lang:null,
        }
    },
    mounted(){
        this.initData();
        this.getPayInfo()
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
        },
        getPayInfo(){
            Owner.getPayInfo().then(res=>{
                if(res.code==1){
                    this.data.bank = res.data[0].bank;
                    this.data.bankname = res.data[0].bankname;
                    this.data.bankuname = res.data[0].bankuname;
                    this.data.bankact = res.data[0].bankact;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        pay(paypwd){
            this.upbank(paypwd);
        },
        // 绑定银行卡
        upbank(paypwd){
            var obj = Object.assign({},this.data,{paypwd})
            Init.upbank(obj).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
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
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 56px 49px;
        padding: 0px 33px 32px 26px;
        ul{
            li{
                border-bottom: 1px solid #F1F2F4;
                margin-bottom: 5px;
                >.p_title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: none;
                    margin-left: 30px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                    // font-size:34px;
                    // color: #333;
                    border: none;
                    border-radius: 0;
                    margin-bottom: 0;
                }
                &:first-child{
                    padding-top: 30px;
                }
            }
            .li_se{
                display: flex;
                justify-content: space-between;
                padding:0 22px;
                border-bottom: 1px solid #F1F2F4 !important;
                p{
                    vertical-align: middle;
                    line-height: 88px;
                    margin-left: 3.5px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                }
            }
            .li_file{
                border-bottom: none;
                .title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: block;
                    margin: 30px 20px 20px;;
                }
                .zy{
                    display: block;
                    font-size:24px;
                    color:rgba(255,184,0,1);
                    margin-top: 21px;
                    margin-left: 10px;
                }
                .bot{
                    display: flex;
                    justify-content: space-between;
                    >div{
                        width:291px;
                        background:rgba(238,238,238,1);
                        border-radius:8px;
                        text-align: center;
                        padding: 42px 0 39px;
                        position: relative;
                        .zw{
                            width: 45px;
                        }
                        .zw2{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }
                        input{
                            width:291px;
                            height: 100%;
                            position: absolute;
                            opacity: 0;
                            // display: none;
                            top: 0;
                            left: 0;
                            z-index: 99;
                        }
                        p{
                            font-size:24px;
                            color:rgba(153,153,153,1);
                            margin-top: 6px;
                        }
                    }
                }

            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 50px 75px;
    }
}

</style>
