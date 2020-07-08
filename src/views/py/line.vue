<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'交易K线图':lang_text.Trading)" :canback="Boolean(1)"></m-header>
        <section class="body">
            
            <div class="top">
                <p v-for="(v,i) in topList" :key="i" @click="change(i)" :class="{'se':se==i}">{{v}}</p>
            </div>

            <div class="line">
                <div id="myChart" :style="{width: '100%', height: '200px'}"></div>
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
            xia:require('@/assets/images/jr/xia.png'),
            arr1:[],
            arr2:[],
            topList:[
                '日',
                '周',
                '月',
            ],
            se:0,
            lang_text:null,
            lang:null,
        }
    },
    mounted(){
        this.initData();
        this.kline('day');
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            // this.payPicker.setData(this.payList)
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');

            this.topList[0] = this.lang!='en'?'日':this.lang_text.day;
            this.topList[1] = this.lang!='en'?'周':this.lang_text.week;
            this.topList[2] = this.lang!='en'?'月':this.lang_text.month;
        },
        change(num){
            this.se = num;
            switch(num){
                case 0:
                    this.kline('day')
                    break;
                case 1:
                    this.kline('week')
                    break;
                case 2:
                    this.kline('month')
                    break;
            }
        },
        kline(type){
            Trade.kline({type}).then(res=>{
                if(res.code==1){
                    this.arr1 = [];
                    this.arr2 = [];
                    (res.data).forEach((v,i)=>{
                        if(!v){ return }
                        this.arr1.unshift(v.time)
                        this.arr2.unshift((+v.trade).toFixed(2))
                    })
                    this.drawLine(type!='day'?'line':'bar');
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        
        drawLine(type){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                // color:'#F04938', //  color=>线条颜色 bgc=>div背景颜色
                // color:'#4EB6AD', //  color=>线条颜色 bgc=>div背景颜色
                color:'#007AFF', //  color=>线条颜色 bgc=>div背景颜色
                // title: { text: 'FC/USDT' },
                tooltip: {},
                grid:{
                // left:'0%',
                // right:'0%',
                // bottom:0,
                left:'15%',
                right:'10%',
                bottom:'15%',
                top:'10%',
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    default: true,
                    // data: ["9/11","9/12","9/13","9/14","9/15"],
                    data: this.arr1,
                    axisTick: { show:false },
                    // axisLine: { show:false },
                    // axisLabel: {
                    //     // color: "#999999", //刻度线标签颜色
                        
                    //     show:false
                    // }
                    axisLabel:{
                        textStyle:{
                            // color:'red',
                            fontSize:"10"
                        },
                        // interval: 100000,
                        // showMinLabel: true,
                        // showMaxLabel: true,
                    }
                },
                yAxis: { 
                    default: true,
                    // show :false,
                    axisTick: { show:false },
                    // axisLine: { show:false },
                    // textStyle:{
                    //     // color:'red'
                    //     show:false
                    // },
                    // axisLabel: {
                    //   color: "#999999" //刻度线标签颜色
                    // },
                    splitLine: {     //网格线
                      "show": false
                    //   color:'#416180'
                    },
                    
                    axisLabel:{
                        textStyle:{
                            // color:'red',
                            fontSize:"10"
                        },
                    }


                },
                series: [{
                    name: '销量',
                    smooth:true,
                    type,
                    symbol: 'none',
                    // data: [20, 30, 40, 30, 35],
                    data: this.arr2,
                    areaStyle:{
                        // 填充
                        normal:{
                            // color:'rgba(78,182,173,0.1)',
                            color:'rgba(0,147,221,0.1)',
                        }
                    },
                    areaStyle: {
                        color:new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                // color: '#F09538'
                                // color: 'rgba(78,182,173,0.4)'
                                color: 'rgba(0,147,221,0.4)'
                            }, {
                                offset: 1,
                                // color: '#35322F'
                                // color: 'rgba(78,182,173,0.1)'
                                color: 'rgba(0,147,221,0.1)'
                            }])
                    }
                }]
            });
        },
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
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
    .line{
        width:690px;
        height:410px;
        // background:#333;
        background-color: #fff;
        border-radius:10px;
        margin: 30px;
        // padding-top: 110px;
        // padding-top: 30px;
        position: relative;
        .title{
            span{
                font-size:32px;
                color:rgba(255,255,255,1);
                &:first-child{
                position: absolute;
                top: 26px;
                left: 31px;
                }
                &:last-child{
                position: absolute;
                top: 26px;
                left: 313px;
                }
            }
        }
    }
}

</style>
