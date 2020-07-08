<template>
    <div class="page">
        <!-- <m-header title="测试" :canback="Boolean(1)"></m-header> -->
        <section class="body">
            <!-- <button class="bot_btn" @click="initData">重新实名信息</button>
            <button class="bot_btn" @click="initData">返回</button> -->
            <!-- <button class="bot_btn" @click="goTo">返回</button> -->
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import VConsole from 'vconsole';
import {mapGetters}  from 'vuex';
export default {
    data () {
        return {
            type:null,
        }
    },
    mounted(){
        this.initData();
        this.close();
    },
    computed:{
        ...mapGetters(['uid','userInfo','api'])
    },
    methods:{
        initData(){
            // let vConsole = new VConsole();

            // let ws = localStorage.getItem('ws')
            // console.log('ws',ws)
            // ws.opener().evalJS(`back3()`);
            // plus.webview.close(ws);
            
            // try {
            //     if(ws){
            //         ws.opener().evalJS(`back3()`);
            //         plus.webview.close(ws);
            //     }
            // }catch(e){
            //     var ws2=plus.webview.currentWebview();
            //     ws2.opener().evalJS(`back3()`);
            //     plus.webview.close(ws2);
            // }
            
        },
        close(){
            console.log('close')
            setTimeout(()=>{
                var ws=plus.webview.currentWebview();
                ws.opener().evalJS(`back3()`);
                plus.webview.close(ws);
            },500)
        },
        goTo(){
            let ws = localStorage.getItem('ws')
            console.log('ws',ws)
            setTimeout(()=>{
                ws.opener().evalJS(`back3()`);
                plus.webview.close(ws);
            },500)


            // let orderUrl = `https://brain.baidu.com/face/print/?token=${this.verify_token}&successUrl=${this.api+'/dist/index.html%23/pay?type=1'}&failedUrl=${this.api+'/dist/index.html%23/close?type=true'}`
            // location.href = orderUrl;
            // console.log('6')
            // console.log('url',this.api+'/dist/index.html#/pay2')
            // this.$router.push({name:'Pay2'});
            // location.href = this.api+'/dist/index.html#/pay2'
        },
    },
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
    
        .bot_btn{
            width:600px;
            height:88px;
            background:linear-gradient(270deg,rgba(0,147,221,1) 0%,rgba(69,122,219,1) 100%);
            border-radius:10px;
            margin: 30px 75px;
            &:last-child{
                background:linear-gradient(270deg,rgba(255,220,0,1) 0%,rgba(255,182,0,1) 100%);
            }
        }
}
</style >

