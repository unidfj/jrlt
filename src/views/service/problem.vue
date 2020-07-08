<template>
    <div class="page">
        <m-header :title="lang_text&&(lang!='en'?'提交问题':lang_text.a42)" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="box">
                <ul>
                    <!-- <li class="li_se"  @click="choicePay"> -->
                    <li class="li_se">
                        <p class="p_title">{{lang_text&&(lang!='en'?'问题类型':'Type')}}：<span>{{name}}</span> </p>
                        <!-- <input type="text" placeholder="问题描述：" @focus='focus_css($event)' @blur='blur_css($event)' v-model="ask"> -->
                    </li>
                    <li>
                        <p class="p_title">{{lang_text&&(lang!='en'?'问题描述':lang_text.a43)}}</p>
                        <input type="text" :placeholder="lang_text&&(lang!='en'?'问题描述':lang_text.a43)" @focus='focus_css($event)' @blur='blur_css($event)' v-model="ask">
                    </li>
                    <li class="li_file">
                        <p class="title">{{lang_text&&(lang!='en'?'上传图片':'upload')}}</p>
                        <div class="bot">
                            <div>
                                <input type="file" class="file" accept="image/*" @change="change($event,0)">
                                <img :src="img0" alt="" class="zw2">
                                <img :src="file_src" alt="" class="zw">
                                <!-- <p class="p_bot">{{lang_text&&(lang!='en'?'上传图片':'upload')}}</p> -->
                            </div>
                            <div v-show="img0">
                                    <input type="file" class="file" accept="image/*" @change="change($event,1)">
                                    <img :src="img1" alt="" class="zw2">
                                    <img :src="file_src" alt="" class="zw">
                                    <!-- <p class="p_bot">{{lang_text&&(lang!='en'?'上传图片':'upload')}}</p> -->
                            </div>
                            <div v-show="!img1" style="background:#fff">

                            </div>
                            <div v-show="img1">
                                    <input type="file" class="file" accept="image/*" @change="change($event,2)">
                                    <img :src="img2" alt="" class="zw2">
                                    <img :src="file_src" alt="" class="zw">
                                    <!-- <p class="p_bot">{{lang_text&&(lang!='en'?'上传图片':'upload')}}</p> -->
                            </div>
                        </div>
                        <p class="zy">{{lang_text&&(lang!='en'?'注意：请上传凭证 以供工作人员核查':'Note: please upload the voucher for the staff to check')}}</p>
                    </li>
                </ul>
            </div>
            <button class="bot_btn"  @click="feedBack">{{lang_text&&(lang!='en'?'提交':lang_text.submit)}}</button>
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
            file_src:require('@/assets/images/jr/s.png'),
            ask:null,
            lang_text:null,
            lang:null,
            payPicker:new mui.PopPicker(),
            payList:[],
            value_:'请选择问题类型',
            img0:null,
            img1:null,
            img2:null,
            img:[],
            cate:null,
            name:null,
            id:null,
        }
    },
    mounted(){
        this.initData();
        this.feedBack2();
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            this.id = this.$route.query.id;
            this.name = this.$route.query.name;
            this.lang_text = Object.assign({},a);
            this.lang = localStorage.getItem('lang');
            this.value_ = this.lang!='en'?'请选择问题类型':'Please select question type';
            
        },
        feedBack2(){
            Trade.feedBack({page:this.page}).then(res=>{
                if(res.code==1){
                    (res.data.category).forEach((v,i)=>{
                        this.payList.push({
                        text:v.name,
                        value:v.id
                        })
                    })
                    this.payPicker.setData(this.payList);
                    // this.value_ = (res.data.category).length!=0?res.data.category[0].name:'';
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        //提交问题
        feedBack(){
            // let img = [this.img0,this.img1,this.img2]
            // console.log(this.img);
            // return;
            Trade.feedBack2({do:'asking',ask:this.ask,img:this.img,cate:this.id}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                setTimeout(()=>{
                    this.$router.go(-1)
                },500)
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
        // 种类切换
        choicePay(){
            let _This = this;
            this.payPicker.show(function(items) {
                _This.value_=items[0].text;
                _This.cate=items[0].value;
                // _This.lang = items[0].lang
                // _This.get_language();
                
            })
        },
        change(event,num){
            let _This = this;
            let formData = new FormData();
            Load.loadStart(_This);
            if(!event.target.files[0]){
                Load.loadEnd(_This);
                return;
            }           
            Util.uploadImgLimit(event.target.files[0],url=>{
                formData.append('image',url);
                Base.upload(formData).then((res)=>{
                    Load.loadEnd(_This);
                    if(res.code == 1){
                        // if(bl){
                        //     this.img1 = this.api+res.data;
                        //     this.data.card_file_z = res.data;
                        // }else{
                        //     this.img2 = this.api+res.data;
                        //     this.data.card_file_f = res.data;
                        // }
                        switch(+num){
                            case 0:
                                _This.img0 = _This.api+res.data;
                                if(!_This.img[0]){ _This.img.push(res.data) }
                                break;
                            case 1:
                                _This.img1 = _This.api+res.data;
                                if(!_This.img[1]){ _This.img.push(res.data) }
                                break;
                            case 2:
                                _This.img2 = _This.api+res.data;
                                if(!_This.img[2]){ _This.img.push(res.data) }
                                break;
                        }
                    }else {
                        mui.toast(res.msg);
                        return ;
                    }
                })
            })
        },
        
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: @bg-color;
    .box{
        width:652px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 60px 0px rgba(0,148,221,0.15);
        border-radius:20px;
        margin: 56px 49px;
        padding: 0px 33px 320px 26px;
        ul{
            li{
                border-bottom: 1px solid #F1F2F4;
                margin-bottom: 5px;
                >.p_title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: none;
                    margin-left: 30px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
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
                    vertical-align: middle;
                    line-height: 88px;
                    margin-left: 3.5px;
                }
                input{
                    flex: 1;
                    vertical-align: middle;
                }
                >.p_title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: block;
                    // margin-left: 30px;
                }
            }
            .li_file{
                border-bottom: none;
                .title{
                    font-size:24px;
                    color:rgba(176,190,215,1);
                    display: block;
                    margin: 30px 20px 20px;;
                }
                .zy{
                    display: block;
                    font-size:24px;
                    color:rgba(255,184,0,1);
                    margin-top: 21px;
                    margin-left: 10px;
                }
                .bot{
                    display: flex;
                    justify-content: space-between;
                    >div{
                        // width:291px;
                        width: 180px;
                        background:rgba(238,238,238,1);
                        border-radius:8px;
                        text-align: center;
                        padding: 42px 0 39px;
                        position: relative;
                        margin-left: 20px;
                        .zw{
                            width: 45px;
                        }
                        .zw2{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }
                        input{
                            width:291px;
                            height: 100%;
                            position: absolute;
                            opacity: 0;
                            // display: none;
                            top: 0;
                            left: 0;
                            z-index: 99;
                        }
                        p{
                            font-size:24px;
                            color:rgba(153,153,153,1);
                            margin-top: 6px;
                        }
                    }
                }

            }
        }
    }
    .bot_btn{
        width:600px;
        height:88px;
        background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
        border-radius:10px;
        margin: 50px 75px;
    }
}

</style>
