<template>
    <div class="page">
        <!-- <m-header title="付款"></m-header> -->
        <div class="header">
            <p @click="back"><i class="left iconfont iconback"></i></p>
            <p class="center">付款</p>
            <p></p>
        </div>
        <section class="body" ref="aa">
            <!-- <ul class="ale">
                <li v-for="(v,i) in pay_list" :key="i" @click="pay2(v.type,true)">
                        <i :class="{'iconfont':true,'iconyuan b_g':paytype!=v.type,'icongou1 c_g':paytype==v.type}"></i>
                        <p>
                            <i :class="v.icon"></i>
                            <span>{{v.name}}</span>
                        </p>
                </li>
                <form class="form-inline" id="payform" method="post" action="http://www.unionchinapay.com/Pay_Index.html" >
                    <div id="box"></div>
                    <button type="submit" class="sq">去付款</button>
                </form>
            </ul> -->
            <ul class="ale">
                <li v-for="(v,i) in pay_list" :key="i">
                        <!-- <i :class="{'iconfont':true,'iconyuan b_g':paytype!=v.type,'icongou1 c_g':paytype==v.type}"></i> -->
                        <p>
                            <i :class="v.icon"></i>
                            <span>{{v.name}}</span>
                        </p>
                </li>
                <form class="form-inline" id="payform" method="post" action="http://www.unionchinapay.com/Pay_Index.html" >
                    <div id="box"></div>
                    <button type="submit" class="sq" v-show="show">去付款</button>
                </form>
            </ul>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
    data () {
        return {
            paytype:2,
            pay_list:[
                // {
                //     name:'支付宝支付',
                //     type:2,
                //     icon:'iconfont iconalipay'
                // },
                {
                    name:'微信支付',
                    type:3,
                    icon:'iconfont iconwechat'
                },
            ],
            verify_token:null,
            realname:null,
            card:null,
            token:null,
            show:false,
        }
    },
    mounted(){
        this.initData();
        // this.pay2(3)
    },
    methods:{
        initData(){
            this.verify_token = localStorage.getItem('verify_token');
            this.token = localStorage.getItem('cookie');
            console.log('verify_token',this.verify_token)
            console.log('token',this.token)
            this.getInfo(this.verify_token);
            // this.getInfo('vh5npAFzNw7xXgrEuYvce6Kq');
        },
        // 获取订单信息
        pay2(v){
            // if(bl){
            //     if(v == this.paytype) return;
            //     this.paytype = v;
            // }
            let params = {
                paytype:3,
                realname:this.realname,
                card:this.card,
            }
            Load.loadStart(this);  
            Trade.pay(params).then(res=>{
                          
                setTimeout(()=>{
                    Load.loadEnd(this);
                },2000)
                if(res.code==1){
                    var npx = document.getElementById('box');
                    npx.innerHTML = '';
                    this.obj = res.data.date;
                    for(let key in this.obj){
                        let inp = document.createElement("input")
                        inp.type = 'text';
                        inp.name = key;
                        inp.style.position = 'fixed';
                        inp.style.left = '-100px';
                        inp.style.top = '-100px';
                        inp.value = this.obj[key];
                        inp.classList.add('fixed_inp')
                        npx.appendChild(inp)
                    }
                    
                    this.show = true;
                    // let btn = document.createElement("button")
                    // btn.type = 'submit';
                    // btn.classList.add('sq');
                    // btn.innerHTML = '去付款';
                    // btn.style.width = '80%';
                    // btn.style.height = '40px';
                    // btn.style.margin = '20px 10%';
                    // btn.style.background = 'red';
                    // npx.appendChild(btn)
                    // $nextTick()
                }else{
                    mui.toast(res.msg)
                    setTimeout(()=>{
                        this.back()
                    },500)
                }
            })
        },
        back(){
            var ws=plus.webview.currentWebview();
            ws.opener().evalJS(`back3()`);
            plus.webview.close(ws);
        },
        // 获取实名信息
        getInfo(verify_token){
            Trade.getInfo({verify_token}).then(res=>{
                if(res.code==1){
                    this.realname = res.data.result.idcard_confirm.name;
                    this.card = res.data.result.idcard_confirm.idcard_number;
                    this.pay2(3)
                }else{
                    mui.toast(res.msg)
                    setTimeout(()=>{
                        this.back()
                    },500)
                }
            })
        }
    },
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
    position: relative;
    .ale{
        z-index: 99;
        position: absolute;
        background-color: #ccc;
        top: 300px;
        width: 100%;
        left: 75px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        width: 600px;
        border-radius: 16px;
        padding-top: 20px;
        padding-bottom: 20px;
        border: 1px solid rgba(0,147,221,.3);
        li{
            height: 100px;
            line-height: 100px;
            padding: 0 60px;
            >i{
                color: #fff;
            }
            .c_g{
                color: #378ed5 ;
            }
            .b_g{
                border: 1px solid #378ed5;
                border-radius: 50%;
                box-sizing: border-box;
                font-size: 28px;
            }
            p{  
                display: inline-block;
                margin-left: 30px;
                font-size: 36px;
                color: #000;
                i{
                    // color: #378ed5;
                    color: #04BE02;
                    font-size: 44px;
                    margin-right: 10px;
                }
            }
            // &:nth-child(2){
            //     p{
            //         i{
            //             color: #04BE02;
            //         }
            //     }
            // }
        }
        
        .sq{
            width: 540px;
            height: 88px;
            background-color: #378ed5;
            margin: 30px;
        }
        .form-inline{
            width: 100%;
            // margin: 0 75px;
            border: 10%;
            overflow: hidden;
        }
    }
}
.header{
    width: 100%;
    height: 88px;
    line-height: 88px;
    background-color: #378ed5;
    display: flex;
    justify-content: space-between;
    .center{
        text-align: center;
        font-weight: 550;
    }
    p{
        flex: 1;
        font-size: 34px;
    }
    .left{
        padding-left: 30px;
    }
}
</style >

