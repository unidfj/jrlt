<template>
  <div class="page" :style="'height:'+(screenHeight)+'px;overflow:auto;'">
    <m-header :title="lang_text&&(lang!='en'?'油机':lang_text.Miner)" :canback="Boolean(1)"></m-header>
    <section class="body"  v-lazy-load="lazyLoad">
        
        <div class="box">
            <div class="top">
                <p v-for="(v,i) in topList" :key="i" @click="change(i)" :class="{'se':se==i}">{{v}}</p>
            </div>
        </div>

        <ul class="content" v-show="se != 1">
            <li v-for="(v,i) in list" :key="i" >
                <div    :class="{'c1':v.name=='体验炼油机'||v.name=='Experience refining machine',
                        'c2':v.name=='初级炼油机'||v.name=='Primary refining machine',
                        'c3':v.name=='中级炼油机'||v.name=='Intermediate refining machine',
                        'c4':v.name=='高级炼油机'||v.name=='Advanced Refining Machine',
                        'c5':v.name=='顶级炼油机'||v.name=='Top refining machine',
                        'c6':v.name=='大师炼油机'||v.name=='Guru refining machine',
                        'c7':v.name=='宗师炼油机'||v.name=='Experts refining machine',
                        'c8':v.name=='专家炼油机'||v.name=='Master refining machine',
                        'c9':v.name=='赠送炼油机'||v.name=='Complimentary refinery'}"
                        >
                    <p>
                        <!-- <span class="title">{{lang_text&&(lang!='en'?'小时':lang_text.hour)}}</span> -->
                        <span class="title">{{v.name}}</span>
                        <span>{{v.life_day}}{{lang_text&&(lang!='en'?'小时':lang_text.hour)}}</span>
                    </p>
                    <p>
                        <span >{{lang_text&&(lang!='en'?'PETRO产量':lang_text.a19)}}：{{(+v.power).toFixed(0)}} L</span>
                        <span>{{lang_text&&(lang!='en'?'运行周期':lang_text.Oc)}}：{{v.yxfile}}{{lang_text&&(lang!='en'?'天':lang_text.day)}}</span>
                    </p>
                    <p>
                        <span v-if="v.name=='体验炼油机'||v.name=='Experience refining machine'">{{lang_text&&(lang!='en'?'剩余炼油次数':lang_text.rtr)}}：{{v.life}}{{lang_text&&(lang!='en'?'次':lang_text.Times)}}</span>
                        <span v-else>{{lang_text&&(lang!='en'?'剩余炼油次数':lang_text.rtr)}}：{{v.life}}{{lang_text&&(lang!='en'?'天':lang_text.day)}}</span>
                    </p>
                </div>
                    
            </li>
        </ul>

        
        <ul class="content" v-show="se == 1">
            <li v-for="(v,i) in list2" :key="i" >
                <div v-if="v.name!='体验炼油机'&&v.name!='Experience refining machine'"
                         :class="{'c1':v.name=='体验炼油机'||v.name=='Experience refining machine',
                         'c2':v.name=='初级炼油机'||v.name=='Primary refining machine',
                         'c3':v.name=='中级炼油机'||v.name=='Intermediate refining machine',
                         'c4':v.name=='高级炼油机'||v.name=='Advanced Refining Machine',
                         'c5':v.name=='顶级炼油机'||v.name=='Top refining machine',
                         'c6':v.name=='大师炼油机'||v.name=='Guru refining machine',
                         'c7':v.name=='宗师炼油机'||v.name=='Experts refining machine',
                         'c8':v.name=='专家炼油机'||v.name=='Master refining machine',
                         'c9':v.name=='赠送炼油机'||v.name=='Complimentary refinery'}">
                    <p>
                        <span class="title">{{v.name}}</span>
                        <span>{{lang_text&&(lang!='en'?'活跃度奖励':lang_text.a17)}}：{{(+v.nissan).toFixed(0)}}</span>
                    </p>
                    <p>
                        <span>{{lang_text&&(lang!='en'?'兑换所需':lang_text.price)}}：{{(+v.price).toFixed(0)}} L</span>
                        <span>{{lang_text&&(lang!='en'?'PETRO产量':lang_text.a19)}}：{{(+v.power).toFixed(0)}} L</span>
                    </p>
                    <p>
                        <span>{{lang_text&&(lang!='en'?'运行市场':lang_text.a20)}}：{{v.life_day}}{{lang_text&&(lang!='en'?'小时/天':lang_text.a21)}}</span>
                        <span>{{lang_text&&(lang!='en'?'运行周期':lang_text.Oc)}}：{{v.life}}{{lang_text&&(lang!='en'?'天':lang_text.day)}}</span>
                    </p>
                    <button v-show="se == 1" class="btn_top" @click="open(v.id)">{{lang_text&&(lang!='en'?'兑换':lang_text.exchange)}}</button>
                    <button v-show="se == 2" class="btn_bot" style="background:DDDDDD;">{{lang_text&&(lang!='en'?'已过期':lang_text.expired)}}</button>
                </div>
                    
            </li>
        </ul>

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
            topList:[
                '我的炼油机',
                '油机商店',
                '过期油机',
            ],
            se:0,
            list:[],
            list2:[],
            id:null,
            status:0,
            page:1,
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            screenHeight:null,
            noMore:false,
            lang_text:null,
            lang:null,
        }
  },
  mounted() {
      this.initData();
      this.orderList();
    //   this.getList();
      
  },
  computed: {
    ...mapGetters(['uid','api'])
  },
  methods: {
    initData(){
        this.se = this.$route.query.num;
        this.screenHeight = window.screen.height || window.screen.availHeight;
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
        
        this.topList[0] = this.lang!='en'?'我的炼油机':this.lang_text.Mrefiner;
        this.topList[1] = this.lang!='en'?'油机商店':this.lang_text.Store;
        this.topList[2] = this.lang!='en'?'过期油机':this.lang_text.Eminer;
    },
    lazyLoad(){
        this.page = this.page+1;
        console.log(this.page,this.noMore,this.se)
        if(!this.noMore){
            console.log('222')
        // this.list = [];
        // this.list2 = [];
            switch(+this.se){
                case 0:
                    console.log('111')
                    this.orderList();
                    break;
                case 1:
                    this.getList();
                    break;
                case 2:
                    this.orderList();
                    break;
            }
        }
    },
    open(id){
        this.id = id;
        this.$refs['pwd'].open();
    },
    pay(pwd){
        this.trade(pwd)
    },
    // 购买矿机
    trade(pwd){
        Trade.trade({pwd,id:this.id,cc_type:1}).then(res=>{
            mui.toast(res.msg)
            if(res.code==1){
                setTimeout(()=>{
                    this.list = [];
                    this.getList();
                },500)
            }
        })
    },
    change(i){
        this.se = i;
        this.list = [];
        this.list2 = [];
        this.page = 1;
        this.noMore = false;
        switch(this.se){
            case 0:
                this.status = 0;
                this.orderList();
                break;
            case 1:
                this.getList();
                break;
            case 2:
                this.status = 1;
                this.orderList();
                break;
        }
        
    },
    // 矿机列表
    getList(){
        Trade.getList({page:this.page}).then(res=>{
            if(res.code==1){
                // this.list2 = res.data;
                
                this.list2 = this.list2.concat(res.data||[]);
                if(!res.data||res.data.length<10)
                this.noMore = true
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 订单列表
    orderList(){
        Trade.orderList({page:this.page,status:this.status}).then(res=>{
            if(res.code==1){
                // this.list = res.data;
                this.list = this.list.concat(res.data||[]);
                console.log(!res.data||res.data.length<10)
                if(!res.data||res.data.length<10)
                this.noMore = true
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
    .top{
        margin: 20px 18px 0;
        display: flex;
        justify-content: space-between;
        border: 1px solid #007AFF;
        border-radius: 10px;
        p{
            flex: 1;
            font-size:26px;
            color:#007AFF;
            text-align: center;
            height: 58px;
            line-height: 60px;
            border-left: 1px solid #007AFF;
            &:first-child{
                border-left: none;
            }
        }
        .se{
            background-color: #007AFF;
            color: #fff;
        }
    }
    .content{
        margin: 30px 30px 400px;
        height: auto;
        li{
            div{
                width: 100%;
                background-color: #fff;
                // border-radius: 10px;
                border-radius: 30px;
                margin-bottom: 20px;
                padding: 30px 30px 20px;
                p{
                    font-size:24px;
                    font-weight:400;
                    // color:rgba(153,153,153,1);
                    color:#fff;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    &:last-child{
                        margin-bottom: 0;
                    }
                    .title{
                        font-size:28px;
                        font-family:PingFangSC-Medium,PingFang SC;
                        font-weight:500;
                        color:rgba(0,147,221,1);
                        color: #fff;
                    }
                }
                button{
                    height:88px;
                    border-radius:10px;
                    width: 50%;
                    // margin-top: 10px;
                    margin: 10px 25% 0;
                    border: 1px solid #fff;
                }
                .btn_bot{
                    // background-color: #DDDDDD !important;
                    background-color: rgba(0,0,0,0)
                }
                .btn_top{
                    // background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
                    background-color: rgba(0,0,0,0)
                }
            }
                
        }
        .c1{
            // background-color: rgba(217,75,89,1);
            background-color: rgba(60,90,155,1);
        }
        .c2{
            // background-color: rgba(147,63,190,1);
            background-color: rgba(90,120,150,1);
        }
        .c3{
            // background-color: rgba(254,218,0,1);
            background-color: rgba(40,50,55,1);
        }
        .c4{
            // background-color: rgba(236,122,0,1);
            background-color: rgba(50,50,40,1);
        }
        .c5{
            // background-color: rgba(0,128,1,1);
            background-color: rgba(155,61,61,1);
        }
        .c6{
            // background-color: rgba(204,59,138,1);
            background-color: rgba(255,206,202,1);
        }
        .c7{
            // background-color: rgba(228,103,136,1);
            background-color: rgba(104,61,103,1);
        }
        .c8{
            // background-color: rgba(55,142,213,1);
            background-color: rgba(122,90,153,1);
        }
        .c9{
            background-color: rgba(252,103,107,1);
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
      color: #fff;
    }
  }
}
</style>
