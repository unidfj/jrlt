<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'发布买单':lang_text.pay2)" :canback="Boolean(1)"></m-header>
        <section class="body">
            
            <div class="box">
                <ul>
                    <li  class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'买家':lang_text.Buyer)" readonly :value="userInfo.username">
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)" readonly :value="userInfo.mobile">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'购买数量':lang_text.PurchaseA)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'购买数量':lang_text.PurchaseA)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="amount1">
                        <span class="p_bot">L</span>
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'单价':lang_text.price)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'单价':lang_text.price)"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="uprice">
                        <span class="p_bot">$/L</span>
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'单价区间':lang_text.price2)}}：</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'单价区间':lang_text.price2)" readonly :value="'$'+data2.currency_price_min+'-$'+data2.currency_price_max">
                    </li>
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'总金额':lang_text.totalA)}}</p>
                        <!-- <input type="text" placeholder="真实姓名" @focus='focus_css($event)' @blur='blur_css($event)'> -->
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'总金额':lang_text.totalA)" readonly :value="((+amount1 * +uprice)*data2.rmb_dollar).toFixed(2)"> 
                        <span class="p_bot">￥</span>
                    </li>
                </ul>
            </div>
            
            <button type="button" class="bot_btn" @click="$refs['pwd'].open()">{{lang_text&&(lang!='en'?'发布买单':lang_text.pay2)}}</button>
            <m-load ref="load"></m-load>
            <m-pwd ref="pwd" @pay="pay"></m-pwd>
        </section>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
        mPwd
    },
    data () {
        return {
            seconds:0,
            type:null,
            data2:{
                currency_price_max:null,
                currency_price_min:null,
                dqprice:null,
                mobile:null,
                rmb_dollar:null,
            },
            uprice:null,
            amount1:null,    
            lang_text:null,
            lang:null,
        }
    },
    mounted(){
        this.initData();
        this.getCcParam();
    },
    computed:{
        ...mapGetters(['uid','userInfo'])
    },
    methods:{
        initData(){
            // this.type = this.$route.query.type;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
        },
        pay(pwd){
            this.create_Buy_Order(pwd);
        },
        // 发布买单
        create_Buy_Order(pwd){
            Trade.create_Buy_Order({amount1:this.amount1,uprice:this.uprice,pwd}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{this.$router.go(-1)},500)
                }
            })
        },
        // 参数
        getCcParam(){
            Trade.getCcParam({orderid:this.id}).then(res=>{
                if(res.code==1){
                    this.data2 = res.data
                    console.log(this.data2)
                }else{
                    mui.toast(res.msg)
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

<style scoped lang="less">
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
                position: relative;
                .btn_code{
                    position: absolute;
                    right: 14px;
                    top: 24px;
                    color: #0093DD;
                }
                >.p_title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: none;
                    margin-left: 30px;
                }
                .p_bot{
                    // display: inline-block !important;
                    // width: 10px;
                    position: absolute;
                    right: 26px;
                    bottom: 18px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                    // height: 88px;
                    // line-height: 88px;
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
                    // vertical-align: middle;
                    line-height: 88px;
                    margin-left: 3.5px;
                    display: block;
                }
                input{
                    flex: 1;
                    // vertical-align: middle;
                    // line-height: 50px;
                }
            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 60px 75px;
    }
}
</style >



