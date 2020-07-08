<template>
    <div class="page">
        <m-header title="网络错误">
        </m-header>
        
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex';
import {Base,Owner,Init,Trade} from '@/server/server.js';
import {Secret} from '@/assets/commonjs/utils.js';
export default {
    name:'my',
    data(){
        return {
            obj:null,
        }
    },
    mounted () {
        
    },
    computed:{
        ...mapGetters(['api','uid','userInfo','coinTxt','proData'])
    },
    methods:{
        ...mapMutations(['saveCoinTxt','saveUserInfo']),
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        padding: @padding-primary;
        background-color: @bg-color;
        width: 100%;
        height: 100%;
        button{
            width: 100%;
            height: 88px;
            background-color: #333;
        }
    }
</style>
