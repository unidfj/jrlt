<template>
    <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'订单详情':lang_text.a167)" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div class="box">
          <ul>
                <li class="li_se" v-if="userInfo.mobile != data.sellmobile&&data.state!=1&&data.state!=12">
                    <p class="p_title">{{lang_text&&(lang!='en'?'卖家':lang_text.a168)}}：</p>
                    <input type="text" :value="`${data.buname}`" readonly>
                </li>
                <li class="li_se" v-if="userInfo.mobile == data.sellmobile&&data.state!=1&&data.state!=12">
                    <p class="p_title">{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}：</p>
                    <input type="text" :value="`${data.uuname}`" readonly>
                </li>
                <!-- <li class="li_se" v-if="userInfo.mobile == data.sellmobile&&data.state!=1&&data.state!=12">
                    <p class="p_title">{{lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)}}：</p>
                    <input type="text" :value="(data.buymobile).substring(0,4)+'****'+(data.buymobile).substring(7,11)" readonly>
                </li>
                <li class="li_se" v-if="userInfo.mobile != data.sellmobile&&data.state!=1&&data.state!=12">
                    <p class="p_title">{{lang_text&&(lang!='en'?'卖家手机号':lang_text.a169)}}：</p>
                    <input type="text" :value="(data.sellmobile).substring(0,4)+'****'+(data.sellmobile).substring(7,11)" readonly>
                </li> -->

                <li class="li_se" v-if="userInfo.mobile == data.sellmobile&&data.state!=1&&data.state!=12">
                    <p class="p_title">{{lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)}}：</p>
                    <input type="text" :value="data.buymobile" readonly>
                </li>
                <li class="li_se" v-if="userInfo.mobile != data.sellmobile&&data.state!=1&&data.state!=12">
                    <p class="p_title">{{lang_text&&(lang!='en'?'卖家手机号':lang_text.a169)}}：</p>
                    <input type="text" :value="data.sellmobile" readonly>
                </li>

                <li class="li_se">
                    <p class="p_title">{{lang_text&&(lang!='en'?'购买数量':lang_text.PurchaseA)}}：</p>
                    <input type="text" :value="data.amount1+' L'" readonly>
                </li>
                <li class="li_se">
                    <p class="p_title">{{lang_text&&(lang!='en'?'单价':lang_text.price)}}：</p>
                    <input type="text" :value="`$${data.uprice}/L`" readonly>
                </li>
                <li class="li_se">
                    <p class="p_title">{{lang_text&&(lang!='en'?'单价区间':lang_text.price2)}}：</p>
                    <input type="text" :value="`$${data.currency_price_min}-$${data.currency_price_max}`" readonly>
                </li>
                <li class="li_se">
                    <p class="p_title">{{lang_text&&(lang!='en'?'总金额':lang_text.totalA)}}：</p>
                    <input type="text" :value="`￥ ${data.totalprice}`" readonly>
                </li>
                <li class="li_se">
                    <p class="p_title">{{lang_text&&(lang!='en'?'状态':lang_text.status)}}：</p>
                    <input type="text" :value="`${getType(data.state)}`" readonly class="y_color"> 
                </li>
              
                <!-- 微信支付宝收款二维码显示 -->
                <li class="pay" v-if="data.state == 2&&userInfo.mobile != data.sellmobile">
                    <p class="title">{{lang_text&&(lang!='en'?'收款方式':lang_text.a76)}}</p>
                    <div class="bot">
                        <!-- 暂且隐藏以下 -->
                        <!-- <div>
                            <img :src="api + data.wechat_url" alt="" class="zw">
                            <p class="p_bot">{{lang_text&&(lang!='en'?'微信':lang_text.a77)}}</p>
                        </div> -->
                        <!-- 以上 -->
                        <div>
                            <!-- <img :src="api + data.wechat_url" alt="" class="zw"> -->
                            <img :src="api + data.alipay_url    " alt="" class="zw">
                            <p class="p_bot">{{lang_text&&(lang!='en'?'支付宝':lang_text.a78)}}</p>
                        </div>
                    </div>
                </li>

                
                <!-- <li class="li_se" v-if="data.ubankact">
                    <p class="p_title">{{lang_text&&(lang!='en'?'银行卡号':lang_text.a157)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'银行卡号':lang_text.a157)"  v-model="data.ubankact" readonly>
                </li> -->

                <!-- 暂且隐藏以下 -->
                <!-- <li class="li_se" v-if="data.ubankact&&(data.state==2||data.state==3)">
                    <p class="p_title">{{lang_text&&(lang!='en'?'银行名称':lang_text.a154)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'银行名称':lang_text.a154)" readonly v-model="data.bank">
                </li>
                <li class="li_se" v-if="data.ubankact&&(data.state==2||data.state==3)">
                    <p class="p_title">{{lang_text&&(lang!='en'?'支行名称':lang_text.a155)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'支行名称':lang_text.a155)" readonly v-model="data.bankname">
                </li>
                <li class="li_se" v-if="data.ubankact&&(data.state==2||data.state==3)">
                    <p class="p_title">{{lang_text&&(lang!='en'?'银行账户名':lang_text.a156)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'银行账户名':lang_text.a156)" readonly v-model="data.bankuname">
                </li>
                <li class="li_se" v-if="data.ubankact&&(data.state==2||data.state==3)">
                    <p class="p_title">{{lang_text&&(lang!='en'?'银行卡号':lang_text.a157)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'银行卡号':lang_text.a157)" readonly v-model="data.bbankact">
                </li> -->
                <!-- 以上 -->

                <!-- 选择支付方式 -->
                <li class="li_se"  @click="choicePay" v-if="data.state == 2&&userInfo.mobile != data.sellmobile&&!ss" >
                  <p class="p_title">{{lang_text&&(lang!='en'?'选择支付方式：':lang_text.a79)}}</p>
                  <input type="text" :value="value_" readonly class="y_color"> 
                </li>

                <!-- 上传支付凭证 -->
                <li class="li_file"  v-if="data.state == 2&&userInfo.mobile != data.sellmobile&&!ss">
                    <div>
                        <input type="file" class="file" accept="image/*" @change="change($event)">
                        <img :src="img1" alt="" class="zw2">
                        <img :src="file_src" alt="" class="zw">
                        <p class="p_bot">{{lang_text&&(lang!='en'?'上传支付凭证':lang_text.a82)}}</p>
                    </div>
                </li>

                <!-- 详情显示支付凭证图片 -->
                <li class="li_file"  v-if="data.state != 2&&data.state != 1">
                    <div>
                        <img :src="api+data.payproof" alt="" class="zw2" @click="show = true">
                    </div>
                </li>

                
                <li v-show="ss">
                    <p class="p_title">{{lang_text&&(lang!='en'?'申诉理由':lang_text.a81)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'申诉理由':lang_text.a81)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="contents">
                </li>

                
                <li class="li_file li_ss"  v-show="ss">
                    <div>
                        <input type="file" class="file" accept="image/*" @change="change($event)">
                        <img :src="img1" alt="" class="zw2">
                        <img :src="file_src" alt="" class="zw">
                        <p class="p_bot">{{lang_text&&(lang!='en'?'上传凭证':lang_text.a82)}}</p>
                    </div>
                </li>
                
                <li @click="show = true" v-show="img1||data.payproof" class="look">查看支付凭证</li>

                <li v-show="data.state==10" class="li_se">
                    <p class="p_title">{{lang_text&&(lang!='en'?'申诉理由':lang_text.a81)}}：</p>
                    <input type="text" :placeholder="lang_text&&(lang!='en'?'申诉理由':lang_text.a81)" v-model="data.des">
                </li>
                <li class="li_file li_ss"  v-show="data.state==10">
                    <div>
                        <img :src="api+data.image" alt="" class="zw2">
                    </div>
                </li>
            </ul>
      </div>
      <button @click="$refs['pwd'].open()" class="tj" v-if="data.state == 2&&userInfo.mobile != data.sellmobile">{{lang_text&&(lang!='en'?'付款':lang_text.a83)}}</button>
      <button @click="$refs['pwd'].open()" class="tj" v-if="data.state == 3&&userInfo.mobile == data.sellmobile&&!ss">{{lang_text&&(lang!='en'?'确认':lang_text.a86)}}</button>
      <!-- <button @click="ss = !ss" class="tj" v-if="data.state == 3&&!ss">{{lang_text&&(lang!='en'?'申诉':lang_text.a84)}}</button> -->
      <button @click="ss = !ss" class="tj" v-if="(data.state == 3||data.state==2)&&!ss">{{lang_text&&(lang!='en'?'申诉':lang_text.a84)}}</button>
      <button @click="complaint" class="tj" v-if="(data.state == 3||data.state==2)&&ss">{{lang_text&&(lang!='en'?'提交':lang_text.a85)}}{{lang_text&&(lang!='en'?'申诉':lang_text.a84)}}</button>
      <!-- <button type="button" class="bot_btn" @click="register()">确认</button> -->
    </section>
    <div class="ale" @click="show = false" v-show="show">
        <img :src="img1?img1:api+data.payproof" alt="" class="zw2">
    </div>
    <m-load ref="load"></m-load>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
        mPwd
    },
    data () {
        return {
            orderid:null,
            data:{
                uuname:null,
                buymobile:null,
                amount1:null,
                uprice:null,
                currency_price_min:null,
                currency_price_max:null,
                totalprice:null,
                des:null,
                image:null,
                ubankact:null,
                bbankact:null,
                bankuname:null,
                bankname:null,
                bank:null,
                sellmobile:'',
                buymobile:'',
            },
            lang_text:null,
            lang:null,
            
            file_src:require('@/assets/images/jr/s.png'),
            img1:null,
            // mui下拉选择
            payPicker:new mui.PopPicker(),
            payList:[
                // {
                //     value: '1',
                //     text: '微信',
                // },
                {
                    value: '2',
                    text: '支付宝',
                },
                // {
                //     value: '3',
                //     text: '银行卡',
                // },
            ],
            value_:'支付宝',
            // 确认订单
            payproof:null,
            paytype:2,
            // 申诉
            contents:null,
            images:null,
            ss:false,
            rmb_dollar:null,
            show:false,
        }
    },
    mounted(){
        this.initData();
        this.detailOrder();
    },
    computed: {
        ...mapGetters(['uid','api','userInfo'])
    },
    methods:{
        initData(){
            this.orderid = this.$route.query.orderid;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');

            // this.value_ = this.lang!='en'?'微信':this.lang_text.a77;
            // this.payList[0].text = this.lang!='en'?'微信':this.lang_text.a77;
            // this.payList[1].text = this.lang!='en'?'支付宝':this.lang_text.Alipay;
            // this.payList[2].text = this.lang!='en'?'银行卡':this.lang_text.a175;
            this.value_ = this.lang!='en'?'支付宝':this.lang_text.Alipay;
            this.payList[0].text = this.lang!='en'?'支付宝':this.lang_text.Alipay;
            this.payPicker.setData(this.payList);
        },
        // 申诉
        complaint(){
            Trade.complaint({tradesn:this.data.tradesn,contents:this.contents,images:this.images}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                }
            })
        },
        pay(pwd){
            if(this.data.state==3){
                this.confirm_Order(pwd)
            }else if(this.data.state==2){
                this.payOrder(pwd);
            }
        },
        // 确认订单
        confirm_Order(pwd){
            Trade.confirm_Order({pwd,orderid:this.data.id}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                }
            })
        },
        // 付款
        payOrder(pwd){
            Trade.payOrder({pwd,orderid:this.data.id,payproof:this.payproof,paytype:this.paytype}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                }
            })
        },
        detailOrder(){
            Trade.detailOrder({orderid:this.orderid}).then(res=>{
                if(res.code==1){
                    this.data = res.data;
                    this.getCcParam();
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 参数
        getCcParam(){
            Trade.getCcParam().then(res=>{
                if(res.code==1){
                    // this.data2 = res.data;
                    this.data = Object.assign({},this.data,{currency_price_max:res.data.currency_price_max},{currency_price_min:res.data.currency_price_min})
                    this.rmb_dollar = res.data.rmb_dollar;
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // 上传图片
        change(event){
            let _This = this;
            let formData = new FormData();
            Load.loadStart(_This);            
            Util.uploadImgLimit(event.target.files[0],url=>{
                formData.append('image',url);
                Base.upload(formData).then((res)=>{
                    Load.loadEnd(_This);
                    if(res.code == 1){
                        this.img1 = this.api+res.data;
                        this.payproof = res.data;
                        this.images = res.data;
                    }else {
                        mui.toast(res.msg);
                        return ;
                    }
                })
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
        getType(type){
            switch(type){
                case 1:
                    // return '已创建'
                    return this.lang!='en'?'已创建':this.lang_text.Created;
                case 2:
                    // return '待付款'
                    return this.lang!='en'?'待付款':this.lang_text.a64;
                case 3:
                    // return '待确认'
                    return this.lang!='en'?'待确认':this.lang_text.a65;
                case 4:
                    // return '已完成'
                    return this.lang!='en'?'已完成':this.lang_text.completed;
                case 10:
                    // return '审核中'
                    return this.lang!='en'?'审核中':this.lang_text.a176;
                case 12:
                    // return '已取消'
                    return this.lang!='en'?'已取消':this.lang_text.Cancelled;
                case 20:
                    // return '已失效'
                    return this.lang!='en'?'已失效':this.lang_text.a177;
            }
        },
        // 支付方式
        choicePay(){
            let _This = this;
            this.isDown = false;
            this.payPicker.show(function(items) {
                _This.value_=items[0].text;
                _This.paytype=items[0].value;
                
            })
        }
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
        margin: 56px 49px 30px;
        padding: 0px 33px 77px 26px;
        >.title{
          font-size:50px;
          font-weight:550;
          color:rgba(51,51,51,1);
          margin-left: 30px;
          margin-bottom: -20px;
        }
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
                }
                .y_color{
                    color: #FFB800;
                }
                &:first-child{
                    padding-top: 14px;
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
                    vertical-align: middle;
                    // padding-top: 14px;
                    padding-top: 28px;
                    padding-left: 0;
                    font-size: 28px;
                }
            }
            .pay{
                padding: 10px 20px;
                >p{
                    color: #b0bed7;
                }
                .bot{
                    display: flex;
                    justify-content: space-between;
                    text-align:center;
                    >div{
                        flex: 1;
                        margin-top: 20px;
                        >img{
                            width: 240px;
                        }
                        >p{
                            color: #b0bed7;
                        }
                    }
                }
            }
            .li_file{
                >div{
                    text-align: center;
                    position: relative;
                    padding: 20px 0;
                    background-color: #eeeeee;
                    // height: 240px;
                    height: 300px;
                    >input{
                        opacity: 0;
                        width: 100%;
                        position: absolute;
                        z-index: 99;
                        left: 0;
                        top: 0;
                        height: 100%;
                        // height: 100%;
                    }
                    .zw{
                        width: 80px;
                        margin-top: 70px;
                    }
                    .p_bot{
                        color: #b0bed7;
                        margin-top:10px;
                    }
                    .zw2{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                    }
                    // .max_he{
                    //     height: auto !important;
                    // }
                }

            }
            .look{
                text-align: center;
                height: 68px;
                line-height: 68px;
            }
            .li_ss{
                margin-top: 30px;
            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 0px 75px;
    }
    .tj{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 0px 75px 30px;

    }
}
.ale{
    background-color: rgba(0, 0, 0, .8);
    z-index: 99;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    img{
        width: 690px;
        margin: 100px 30px 0;
    }
}
</style >


