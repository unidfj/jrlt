<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'股权兑换':lang_text.a121)" :canback="Boolean(1)">
            <p @click="$router.push({name:'Crecord'})">{{lang_text&&(lang!='en'?'兑换记录':lang_text.a122)}}</p>
        </m-header>
        <section class="body">

            <div class="top">
                <p class="title">{{lang_text&&(lang!='en'?'账户信息':lang_text.a123)}}</p>

                <p>{{lang_text&&(lang!='en'?'姓名':lang_text.username)}}：{{data.realname}}</p>
                <p>{{lang_text&&(lang!='en'?'油数量':lang_text.a140)}}：{{data.credit1}}</p>
                <p>{{data.machine_level}}{{lang_text&&(lang!='en'?'及以上数量':lang_text.a124)}}：{{data.machine_num}}</p>
                <p>{{lang_text&&(lang!='en'?'累计提交申请股权份数':lang_text.a125)}}：{{data.credit5}}</p>
            </div>

            <div class="box">
                <p class="title">{{lang_text&&(lang!='en'?'电子兑换证书':lang_text.a183)}}</p>
                <ul>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'兑换油升数':lang_text.a126)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'兑换油升数':lang_text.a126)"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="formData.oilnum">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'交易密码':lang_text.a32)}}</p>
                        <input type="password" :placeholder="lang_text&&(lang!='en'?'交易密码':lang_text.a32)"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="formData.paypsw">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'邮箱地址':'Email')}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'邮箱地址':'Email')"  @focus='focus_css($event)' @blur='blur_css($event)' v-model="formData.exemail">
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'验证码':lang_text.code)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'验证码':lang_text.code)" v-model="formData.code" @focus='focus_css($event)' @blur='blur_css($event)'  oninput="if(value.length>4)value=value.slice(0,4)">
                        <button type="button" class="btn_code" :disabled="seconds>0" @click="getCode">{{seconds==0?lang_text&&(lang!='en'?'点击发送':lang_text.Csend):""+seconds+"s"}}</button>
                    </li>
                </ul>
                <button type="button" class="bot_btn" @click="exchange('exchange')">{{lang_text&&(lang!='en'?'兑换':lang_text.exchange)}}</button>
            </div>

            <!-- <p class="rule">{{exchange_rule}}</p> -->
            <ul class="rule">
                <li v-for="(v,i) in rule_2" :key="i">
                    <p>{{i+1}}.{{v}}</p>
                </li>
            </ul>
            
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
    data(){
        return {
            seconds:0,
            type:null,
            formData:{
                oilnum:null,
                exemail:null,
                paypsw:null,
                code:null
            },
            data:{
                credit1:null,
                realname:null,
                credit5:null,
                oilnum:null,
                machine_level:null,
                machine_num:null,
                ratio:null,
            },
            lang_text:null,
            lang:null,
            exchange_rule:null,
            // 股权兑换规则
            rule_2:[
                '兑换股权比例为：1升石油兑换TODAY S CHAIN PTE.LTD.3份股东权益。',
                '兑换完股权，后台将发送电子版证书至您的邮箱。',
            ],
        }
    },
    mounted(){
        this.initData();
        this.exchange('select');
        this.rules()
    },
    computed:{
        ...mapGetters(['uid','userInfo'])
    },
    methods:{
        initData(){
            this.type = this.$route.query.type;
            this.formData.mobile = this.userInfo.mobile;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
        },

        pay(pwd){

        },
        
        // 明细规则
        rules(){
            Trade.rules().then(res=>{
                if(res.code==1){
                    this.exchange_rule = res.msg.exchange_rule
                }else{
                mui.toast(res.msg)
                }
            })
        },
        // 股权兑换
        exchange(do1){
            if(do1=='exchange'){
                var obj = Object.assign({do:do1},this.formData)
            }else{
                obj = {do:do1}
            }
            Trade.exchange(obj).then(res=>{
                if(res.code==1){
                    this.data = res.data;
                    if(do1=='exchange'){
                        mui.toast(res.msg)
                        setTimeout(()=>{
                            this.$router.go(0)
                        },500)
                    }
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        getCode(){
            this.seconds = 60;
            let get =  setInterval(()=>{
                this.$nextTick(()=>{
                    this.seconds = this.seconds-1;
                    if(this.seconds<=0){
                        clearInterval(get);
                    }
                });
            },1000)
            // 发送验证码
            Base.sendCode({mobile:this.userInfo.mobile}).then((res)=>{
                mui.toast(res.msg);
            })            
        },
        // 获得焦点
        focus_css(e){
            // p标签显示
            e.currentTarget.previousElementSibling.style.display = 'block';
            e.currentTarget.placeholder = '',
            // li底部边框变色
            // e.currentTarget.parentNode .style.borderBottom = '1px solid #0093DD';
            e.currentTarget.parentNode .style.borderBottom = '1px solid #fff';
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
    background-color: #f7f7f7;
    .top{
        width: 690px;
        margin: 40px 30px 0;
        background-color: #fff;
        border-radius: 30px;
        padding: 24px 47px 33px;
        border: 1px solid rgba(0,147,221,.3);
        >p{
            // font-size:24px;
            font-size:28px;
            font-weight:400;
            color:rgba(51,51,51,1);
            border-bottom: 1px solid #eee;
            padding:10px 0;
        }
        .title{
            font-weight: 550;
            text-align: center;
            margin-bottom: 27px;
            font-size: 32px;
            border-bottom: none !important;
            padding: 0;
        }
    }
    .box{
        width:690px;
        background:rgba(255,255,255,1);
        // box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:30px;
        margin: 56px 30px 20px;
        padding: 24px 33px 32px 26px;
        background-color: rgba(55,142,213,1);
        >.title{
            font-size:32px;
            font-weight:550;
            // color:rgba(51,51,51,1);
            text-align: center;
            color: #fff;
        }
        ul{
            li{
                border-bottom: 1px solid #F1F2F4;
                margin-bottom: 5px;
                position: relative;
                .btn_code{
                    position: absolute;
                    right: 14px;
                    top: 16px;
                    // color: #0093DD !important;
                    color: #fff;
                }
                >.p_title{
                    font-size:28px;
                    // color:rgba(176,190,215,1);
                    display: none;
                    margin-left: 30px;
                    color: #fff !important;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                    // height: 88px;
                    // line-height: 88;
                    // font-size:34px;
                    // color: #333;
                    border: none;
                    border-radius: 0;
                    margin-bottom: 0;
                    background-color: rgba(0,0,0,0);
                    color: #fff;
                    font-size: 28px;
                }
                &:first-child{
                    padding-top: 10px;
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
                    color: #fff;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                }
            }
        }

        .bot_btn{
            width:600px;
            height:94px;
            // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            background:#fff;
            border-radius:10px;
            color: rgba(55,142,213,1) !important;
            margin-top: 30px;
            width: 50%;
            margin-left: 25%;
        }
    }
    // .rule{
    //     width: 690px;;
    //     color: rgba(228,103,136,1);
    //     margin-left: 30px;
    //     padding: 0 20px;
    // }
    .rule{
        // padding: 0 20px;
        width: 690px;
        margin-left: 30px;
        li{
            margin-bottom: 20px;
            p{
                color: rgb(0, 140, 196);
            }
        }
    }
}
input::-webkit-input-placeholder {
  font-size: 28px !important;
  color: #fff !important;
}
input::-moz-placeholder {
  font-size: 28px !important;
  color: #fff !important;
}
input::-ms-input-placeholder {
  font-size: 28px !important;
  color: #fff !important;
}
</style >



