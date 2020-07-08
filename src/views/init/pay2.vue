<template>
    <div class="page">
        <!-- <m-header title="付款"></m-header> -->
        <div class="header">
            <p @click="back"><i class="left iconfont iconback"></i></p>
            <p class="center">付款</p>
            <p></p>
        </div>
        <section class="body" ref="aa">
            <ul class="ale">
                <li v-for="(v,i) in pay_list" :key="i">
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
            <!-- <button @click="goTo" class="btn">测试</button> -->
            <!-- <button class="btn" @click="$router.push({name:'Close'})">返回</button> -->
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
        this.pay2(3)
    },
    computed:{
        ...mapGetters(['api'])
    },
    methods:{
        initData(){
            let cookie = this.$route.query.cookie;
            let lang = this.$route.query.lang;
            localStorage.setItem('cookie',cookie)
            localStorage.setItem('lang',lang)

            setTimeout(()=>{
                var ws=plus.webview.currentWebview();
                console.log('ws',ws)
                console.log('json',ws)
                localStorage.setItem('ws',ws)
            },2000)
        },
        // 获取订单信息
        pay2(v){
            Load.loadStart(this);  
            Trade.pay({paytype:3}).then(res=>{
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
                }else{
                    mui.toast(res.msg)
                    setTimeout(()=>{
                        this.back()
                    },1000)
                }
            })
        },
        back(){
            var ws=plus.webview.currentWebview();
            ws.opener().evalJS(`back3()`);
            plus.webview.close(ws);
        },
        goTo(){
            var ws=plus.webview.currentWebview();
            console.log('json',ws)
            localStorage.setItem('ws',ws)
            this.$router.push({name:'Close'})
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
    .btn{
        width: 690px;
        height: 88px;
        margin: 20px 30px;
        background-color: red;
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

