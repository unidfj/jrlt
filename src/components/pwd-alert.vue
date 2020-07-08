<!-- 
    密码框 
-->
<template>
    <div >
        <section class="body" v-show="layer" >
            <div class="small-alert" @click.stop>
                <header class="header">
                    <span>{{lang_text&&(lang!='en'?'请输入交易密码':lang_text.a32)}}</span>
                    <span @click="forget">{{lang_text&&(lang!='en'?'忘记交易密码？':lang_text.a28)}}</span>
                </header>
                <section class="content">
                    <input :class="{'no-mar':paytype}" type="password" v-model="pwd" oninput="if(value>6)value=value.slice(0,6)" v-focus autofocus="autofocus">
                </section>
                <section v-if="paytype">
                    <ul class="mui-table-view mui-table-view-radio  radioNav">
                        <li class="mui-table-view-cell mui-selected" @click="savePaytype(1)">
                            <a class="mui-navigate-right">可售cc币</a>
                        </li>
                        <!-- <li class="mui-table-view-cell mui-disabled" @click="savePaytype(1)">
                            <a class="mui-navigate-right">冻结cc币</a>
                        </li> -->
                        <li class="mui-table-view-cell" @click="savePaytype(3)">
                            <a class="mui-navigate-right">锁定cc币</a>
                        </li>
                    </ul>
                </section>
                <footer class="btm-btn-group">
                    <button class="btn btn-origin" @click.stop="pay">{{lang_text&&(lang!='en'?'确定':lang_text.confirm)}}</button>
                    <button class="btn btn-cancel" @click.stop="layer = false">{{lang_text&&(lang!='en'?'取消':lang_text.cancel)}}</button>
                </footer>
            </div>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Load} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
    props:{
        paytype:{
            type:Boolean,
            default(){
                return false;
            }
        }
    },
    data () {
        return {
            layer:false,
            pwd:null,
            ccType:1,
            lang_text:null,
            lang:null,        
        }
    },
    mounted(){
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
    },
    methods:{
        open(){
            this.layer = true;
            this.pwd = null;
        },
        close(){
            this.layer = false;
        },
        pay(){
            if(this.pwd){
                this.layer = false;
                if(this.paytype){
                    Load.loadStart(this);
                    setTimeout(() => {
                        Load.loadEnd(this);
                        this.$emit('pay',[this.pwd,this.ccType]);
                    }, 1000);
                }else {
                    Load.loadStart(this);
                    setTimeout(() => {
                        Load.loadEnd(this);
                        this.$emit('pay',this.pwd);
                    }, 1000);
                }
            }else {
                mui.toast('交易密码不能为空！');
                return ;
            }
        },
        savePaytype(type){
            this.ccType = type;
        },
        forget(){
            this.$router.push({name:'SetPwd',params:{type:'trade'}});
        }
    }
}
</script>

<style scoped lang="less">
// @import '~link-less';
@import '~link-less';
.body {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .small-alert {
        position: absolute;
        width: 80%;
        // height: 500px;
        padding-bottom: 40px;
        border-radius: 20px;
        background-color: white;
        left: 50%;
        top: 20%;
        text-align: center;
        .transform(translateX(-50%));
        .header {
            .display-flex();
            justify-content: space-between;
            margin: @margin-primary;
            >span:last-child{
                color: @font-primary-color;
            }
        }
        .content {
            margin: @margin-primary;
            font-size: 28px;
            i {
                color: @btn-primary-color;
                font-size: 32px;
            }
            .no-mar {
                margin-bottom: 0;
            }
        }
        .radioNav{
            .display-flex();
            justify-content: space-between;
            width: 90%;
            margin:0 5% 5%;
            a {
                text-overflow: unset;
                &::after{
                    right: -6px;
                }
            }
        }
        .btm-btn-group{
            .display-flex();
            justify-content: space-between;
            .btn {
                border: 1px solid #999;
                flex: 1;
                margin-right: @margin-primary;
                border-radius: 20px;
            }
            .btn-cancel {
                color: #fff !important;
                border: none !important;
                background: linear-gradient(270deg, #0093dd 0%, #457adb 100%) !important;
            }
            .btn-origin {
                margin-left: @margin-primary;
                border: none;
            }
            // .btn-confirm {
            //     .btm-btn-primary();
            //     border: none;
            // }
        }
    }
}
</style >

