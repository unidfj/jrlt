<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'我的团队':lang_text.Mteam)" :canback="Boolean(1)">
            <span class="ly" @click="$router.push({name:'Rule',query:{type:11}})">{{lang_text&&(lang!='en'?'规则':lang_text.rule)}}</span>
        </m-header>
        <section class="body" :style="'height:'+(screenHeight)+'px;overflow:auto;'" v-lazy-load="lazyLoad">

            <div class="top">
                <div class="top_top">
                    <p class="level">{{data.level}}</p>
                    <p class="num">{{lang_text&&(lang!='en'?'团队人数':lang_text.a146)}} <span>{{data.team_num}}</span></p>
                </div>
                <ul class="top_bot">
                    <li>
                        <p>{{lang_text&&(lang!='en'?'直推/实名':lang_text.a149)}}</p>
                        <p>{{data.dr_num}}/{{data.vdr_num}}</p>
                    </li>
                    <li>
                        <p>{{lang_text&&(lang!='en'?'团队活跃度':lang_text.a150)}}</p>
                        <p v-if="lang=='en'"> <br/> </p>
                        <p>{{data.team_liveness_sum}}</p>
                    </li>
                    <li @click="$router.push({name:'Rule2',query:{type:12}})">
                        <p>{{lang_text&&(lang!='en'?'大区活跃度':lang_text.a151)}}</p>
                        <p>{{data.la_liveness_sum}}</p>
                    </li>
                    <li @click="$router.push({name:'Rule2',query:{type:13}})">
                        <p>{{lang_text&&(lang!='en'?'小区活跃度':lang_text.a152)}}</p>
                        <p>{{data.sa_liveness_sum}}</p>
                    </li>
                </ul>
            </div>

            <ul class="list">
                <li>
                    <p>{{lang_text&&(lang!='en'?'团队活跃':'Member')}}</p>
                    <p @click="changeSe('teamnum')">
                        <span :class="{'se':field=='teamnum'}">{{lang_text&&(lang!='en'?'团队人数':lang_text.a146)}}</span>
                        <span class="r_i">
                            <i :class="{'iconfont icontubiaozhizuo-':true,'se':field=='teamnum'&&order=='ASC'}" ></i>  
                            <i :class="{'iconfont icontubiaozhizuo-1':true,'se':field=='teamnum'&&order=='DESC'}"></i>   
                        </span>
                    </p>
                    <!-- <p @click="changeSe('level')">
                        <span :class="{'se':field=='level'}">{{lang_text&&(lang!='en'?'炼油师':lang_text.a185)}}</span>
                        <span class="r_i">
                            <i :class="{'iconfont icontubiaozhizuo-':true,'se':field=='level'&&order=='ASC'}" ></i>  
                            <i :class="{'iconfont icontubiaozhizuo-1':true,'se':field=='level'&&order=='DESC'}"></i>   
                        </span>
                    </p> -->
                    
                    <p>{{lang_text&&(lang!='en'?'奉献值':'Contribution')}}</p>
                    <p @click="changeSe('createtime')">
                        <span :class="{'se':field=='createtime'}">{{lang_text&&(lang!='en'?'注册时间':lang_text.a148)}}</span>
                        <span class="r_i">
                            <i :class="{'iconfont icontubiaozhizuo-':true,'se':field=='createtime'&&order=='ASC'}" ></i>  
                            <i :class="{'iconfont icontubiaozhizuo-1':true,'se':field=='createtime'&&order=='DESC'}"></i>   
                        </span>
                    </p>
                </li>

                <li v-for="(v,i) in team_user" :key="i">
                    <!-- <p>{{v.username}}</p> -->
                    <p>{{v.mobile}}</p>
                    <p>{{v.team_num}}</p>
                    <!-- <p>{{v.levelname}}</p> -->
                    <p>{{v.fx_level}}</p>
                    <p>{{(v.createtime).substring(0,10)}}</p>
                </li>
            </ul>
            
            <m-load ref="load"></m-load>
        </section>
    </div>
</template>
<script>
import {Init,Base,Trade} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {a} from '@/assets/commonjs/lan.js';
export default {
    components:{
    },
    data () {
        return {
            page:1,
            data:{
                level:null,
                team_num:null,
                dr_num:null,
                vdr_num:null,
                team_liveness_sum:null,
                la_liveness_sum:null,
                sa_liveness_sum:null,
                team_user:[],
            },
            team_user:[],
            lang_text:null,
            lang:null,
            field:'teamnum',
            order:'DESC',
            noMore:false,
            screenHeight:null,
        }
    },
    mounted(){
        this.initData();
        this.team();
    },
    computed:{
        ...mapGetters(['uid','userInfo'])
    },
    methods:{
        initData(){
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            this.screenHeight = window.screen.height || window.screen.availHeight;
        },
        lazyLoad(){
            console.log(this.page)
            this.page = this.page+1;
            if(!this.noMore){
                this.team(); 
            }
        },
        changeSe(v){
            this.team_user = [];
            this.page = 1;
            if(v == this.field){
                this.order = this.order=='DESC'?'ASC':'DESC';
            }else{
                this.field = v;
                this.order = 'DESC';
            }
            this.team();
        },
        team(){
            Trade.team({page:this.page,do:'team',field:this.field,order:this.order}).then(res=>{
                if(res.code==1){
                    this.data = res.data;
                    // this.data = JSON.parse(Secret.decrypt(res.data));
                    
                    this.team_user = this.team_user.concat(res.data.team_user||[]);
                    if(!res.data.team_user||res.data.team_user.length<15)
                    this.noMore = true
                }else{
                    mui.toast(res.msg)
                }
            })
        }
        
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: #f7f7f7;
    .top{
        width:690px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 30px 30px 0;
        padding: 43px 34px 36px;
        .top_top{
            margin-bottom: 48px;
            .level{
                width:160px;
                display: inline-block;
                height:68px;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 10px 0px rgba(0,147,221,0.58);
                border-radius:39px;
                line-height: 68px;
                text-align: center;
                font-size:24px;
                color:rgba(0,147,221,1);
            }
            .num{
                // font-size:24px;
                color:rgba(255,255,255,1);
                margin-left: 93px;
                display: inline-block;
                line-height: 40px;
                font-size:30px;
                span{
                    font-size:32px;
                    font-weight:500;
                    color:rgba(255,255,255,1);
                    margin-left: 16px;
                }
            }
            
        }
        .top_bot{
            display: flex;
            justify-content: space-between;
            li{
                flex: 1;
                text-align: center;
                p{
                    &:first-child{
                        font-size:24px;
                        color:rgba(255,255,255,1);
                    }
                    &:last-child{
                        font-size:32px;
                        font-weight:500;
                        color:rgba(255,255,255,1);
                    }
                }
                
            }
        }
    }
    >.list{
        padding: 30px 30px 34px 26px;
        background-color: #fff;
        margin-top: 34px;
        li{
            display: flex;
            justify-content: space-between;
            margin-bottom: 23px;
            p{
                text-align: center;
                font-size:24px;
                font-weight:400;
                color:rgba(153,153,153,1);
                flex: 10;
                &:first-child{
                    text-align: left;
                    // flex: 10;
                }
                &:last-child{
                    text-align: right;
                    // flex: 16;
                }
                // &:nth-child(2){
                //     flex: 8;
                // }
            }
            &:first-child{
                p{
                    font-size:28px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    // margin-bottom: 13px;
                    span{
                        &:last-child{
                            // margin-left: 6px;
                            display: inline-block;
                            width: 20px;
                            line-height: 16.5px;
                            vertical-align: middle;
                            margin-top: -6px;
                            i{
                                font-size: 20px;
                                color: #B0BED7;
                            }
                            .se{
                                color: #0093DD;
                            }
                        }
                    }
                }
                .se{
                    color: #0093DD;
                }
            }
            &:last-child{
                margin-bottom: 0;
            }
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
      font-weight: 550;
    }
  }
}
</style >



