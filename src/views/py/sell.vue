<template>
  <div class="page">
    <m-header :title="lang_text&&(lang!='en'?'卖给TA':lang_text.SellT)" :canback="Boolean(1)"></m-header>
    <section class="body">
        <ul>
            <li>
                <span>{{lang_text&&(lang!='en'?'买家':lang_text.Buyer)}}：</span>
                <span>{{data.uuname}}</span>
            </li>
            <!-- <li>
                <span>{{lang_text&&(lang!='en'?'买家手机号':lang_text.Buyer2)}}：</span>
                <span>{{data.buymobile}}</span>
            </li> -->
            <li>
                <span>{{lang_text&&(lang!='en'?'购买数量':lang_text.PurchaseA)}}：</span>
                <span>{{data.amount1}} L</span>
            </li>
            <li>
                <span>{{lang_text&&(lang!='en'?'单价':lang_text.price)}}：</span>
                <span>${{data.uprice}}/L</span>
            </li>
            <li>
                <span>{{lang_text&&(lang!='en'?'单价区间':lang_text.price2)}}：</span>
                <span>${{data2.currency_price_min}}-${{data2.currency_price_max}}</span>
            </li>
            <li>
                <span>{{lang_text&&(lang!='en'?'总金额':lang_text.totalA)}}：</span>
                <span>￥{{data.totalprice}}</span>
            </li>
            <li v-if="data.sxf">
                <span>{{lang_text&&(lang!='en'?'实际扣除':lang_text.Actual)}}：</span>
                <span>{{data.amount1*(100+ +data.sxf)/100}}L</span>
            </li>
            <li v-if="data.sxf">
                <span>{{lang_text&&(lang!='en'?'手续费':lang_text.fee)}}：{{data.sxf}}%</span>
            </li>
        </ul>
        <button  v-if="data.sxf"  @click="$refs['pwd'].open()">{{lang_text&&(lang!='en'?'立即卖出':'Sell')}}</button>
    </section>
    <m-load ref="load"></m-load>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>

  </div>
</template>
<script>
import {Init,Index,Base,Trade} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import mPwd from '@/components/pwd-alert.vue';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
        mPwd
    },
  data(){
        return {
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            id:null,
            data:{
                amount1:null,
                buymobile:null,
                uprice:null,
                totalprice:null,
                uuname:null,
                sxf:null,
                
            },
            data2:{
                currency_price_max:null,
                currency_price_min:null,
                dqprice:null,
                mobile:null,
                rmb_dollar:null,
            },
            lang_text:null,
            lang:null,
        }
  },
  mounted() {
      this.initData();
      this.detailOrder();
      this.getCcParam();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.id = this.$route.query.id;
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
    },
    pay(pwd){
        this.orderBuyOrder(pwd);
    },
    // 卖出买单
    orderBuyOrder(pwd){
        Trade.orderBuyOrder({pwd,orderid:this.data.id}).then(res=>{
            mui.toast(res.msg)
            if(res.code==1){
                setTimeout(()=>{this.$router.go(-1)},500)
            }
        })
    },
    // 买单信息
    detailOrder(){
        Trade.detailOrder({orderid:this.id}).then(res=>{
            if(res.code==1){
                this.data = res.data
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 参数
    getCcParam(){
        Trade.getCcParam({orderid:this.id}).then(res=>{
            if(res.code==1){
                this.data2 = res.data
            }else{
                mui.toast(res.msg)
            }
        })
    }
    
  },
  
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
    line-height: 36px;
    background-color: @bg-color;
    >ul{
        background-color: #F8F8FB;
        width: 652px;;
        margin: 56px 49px;
        border-radius: 20px;
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        background-image: url('../../assets/images/jr/bg1.png');
        li{
            height: 88px;
            line-height: 88px;
            padding: 0 33px 0 26px;
            border-bottom: 1px solid #F1F2F4;
            span{
                &:first-child{
                    // color: #B0BED7;
                    color: #fff;
                    font-size: 24px;
                }
                &:last-child{
                    // color: #333;
                    color: #fff;
                    font-size: 28px;
                }
            }
            &:last-child{
                border: none;
                span{
                    font-size:24px;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:rgba(255,184,0,1);
                }
            }
        }
    }
    >button{
        width:600px;
        height:88px;
        // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        background:#000;
        border-radius:10px;
        margin: 123px 75px 30px;
    }
    
}
</style>
