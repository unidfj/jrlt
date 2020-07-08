<!-- 
  底部组件（全局注册组件）
  navInd：导航的默认值
-->
<template>
    <footer class="index_footer">
      <nav>
        <!-- <a v-for="(item,index) in proData&&proData.home_bottom_nav.length>0&&proData.home_bottom_nav ||navNameList" @click="goTo(index)" :class="{'nav-bg':navInd == index}" :key="index">
          <i :class="'iconfont'+' '+iconList[index]"></i>
          <span>{{item.name}}</span>
        </a> -->
        <a v-for="(item,index) in navNameList" @click="goTo(index)" :class="{'nav-bg':navInd == index,'bot_nav':true}" :key="index">
          <img :src="imgList[index]" alt="">
          <span>{{item.name}}</span>
        </a>
      </nav>
    </footer>
</template>

<script>
import {mapGetters} from 'vuex';
import {a} from '@/assets/commonjs/lan.js';
import safeAreaInsets  from 'safe-area-insets';
export default{
  data(){
    return {
        navInd:0,
        iconList:['iconshouye1','iconqkk_icon_fuwu','iconqkk_icon_wode','iconqkk_icon_wode'],
        routeName:['PanGold','Ly','My','Py','My2'],
        imgList:[
          require('@/assets/images/jr/06.png'),
          require('@/assets/images/jr/02.png'),
          require('@/assets/images/jr/03.png'),
          require('@/assets/images/jr/04.png'),
          require('@/assets/images/jr/05.png'),
        ],
        navNameList:[
          {
            name:'首页'
          },
          {
            name:'挖矿'
          },
          {
            name:'跨境商城'
          },
          {
            name:'交易'
          },
          {
            name:'我的'
          },
        ],
        shopUrl:null,
        lang_text:null,
        lang:null,      
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom
    }
  },
  created() {
      this.shopUrl = this.api +'/addons/litestore#/?cookie='+localStorage.getItem('cookie')+'&lang='+localStorage.getItem('lang');
      window.back2 = this.back2;
      
        //挂载完之后监听安全区域的位置
        safeAreaInsets.onChange((style)=>{
            this.paddingTop = style.top;
            this.paddingBottom = style.bottom
        })

  },
  mounted(){
        
        this.lang_text = Object.assign({},a);
        this.lang = localStorage.getItem('lang');
        
        this.navNameList[0].name = this.lang!='en'?'首页':'Home';
        this.navNameList[1].name = this.lang!='en'?'炼油':'Refining';
        this.navNameList[2].name = this.lang!='en'?'跨境商城':'Shopping';
        this.navNameList[3].name = this.lang!='en'?'交易':'Transaction';
        this.navNameList[4].name = this.lang!='en'?'我的':'My';
        this.activeNav();
  },
  computed:{
        ...mapGetters(['proData','api'])
  },
  methods:{
    
    goBack(){
      // this.$router.replace({name:'Index'})
    },
    goTo(index){
        let that = this;
        // if(index==2){sessionStorage.setItem('btmNav',0)}
        if(index!=2) {
          this.$router.push({name:this.routeName[index]});
        } else {
            try {
                if(plus){
                    // plus.webview.create(that.shopUrl).show();  
                    // this.$router.push({name:'PanGold'})
                    // let t = sessionStorage.getItem('top')
                    let b = sessionStorage.getItem('bottom');
                    // let t = this.paddingTop;
                    // let b = this.paddingBottom;
                    let h = document.body.clientHeight - (b/2);
                    // plus.webview.open(that.shopUrl,'openView',{top:t+'px',bottom:b+'px',background:'#000',height:h+'px'})
                    plus.webview.open(that.shopUrl,'openView',{background:'#fff',height:h+'px'})


                    
                }
            }catch(e){
                location.href = this.shopUrl;
            }
            return;
        }
        
        sessionStorage.setItem('btmNav',index);
        this.navInd = index;
        switch(index){
            case '0':
                this.imgList = [
                    require('@/assets/images/jr/06.png'),
                    require('@/assets/images/jr/02.png'),
                    require('@/assets/images/jr/03.png'),
                    require('@/assets/images/jr/04.png'),
                    require('@/assets/images/jr/05.png'),
                ]
                return 
            case '1':
                this.imgList = [
                    require('@/assets/images/jr/01.png'),
                    require('@/assets/images/jr/07.png'),
                    require('@/assets/images/jr/03.png'),
                    require('@/assets/images/jr/04.png'),
                    require('@/assets/images/jr/05.png'),
                ]
                return 
            case '2':
                this.imgList = [
                    require('@/assets/images/jr/01.png'),
                    require('@/assets/images/jr/02.png'),
                    require('@/assets/images/jr/08.png'),
                    require('@/assets/images/jr/04.png'),
                    require('@/assets/images/jr/05.png'),
                ]
                return 
            case '3':
                this.imgList = [
                    require('@/assets/images/jr/01.png'),
                    require('@/assets/images/jr/02.png'),
                    require('@/assets/images/jr/03.png'),
                    require('@/assets/images/jr/09.png'),
                    require('@/assets/images/jr/05.png'),
                ]
                return 
            case '4':
                this.imgList = [
                    require('@/assets/images/jr/01.png'),
                    require('@/assets/images/jr/02.png'),
                    require('@/assets/images/jr/03.png'),
                    require('@/assets/images/jr/04.png'),
                    require('@/assets/images/jr/10.png'),
                ]
                return 
        }
    },
    
    back2(i){
      this.$router.push({name:this.routeName[i]})
      sessionStorage.setItem('btmNav',i)
    },
    activeNav(){
      // console.log(sessionStorage.getItem('btmNav'));
        if(sessionStorage.getItem('btmNav')){
            let index = sessionStorage.getItem('btmNav');
            this.navInd = index;
        }
        const arr = document.querySelectorAll('.bot_nav');
        arr.forEach((v,i)=>{
          if(this.navInd==i){
            v.classList.add("nav-bg")
          }else{
            v.classList.remove("nav-bg");
          }
        })
        switch(this.navInd){
                case '0':
                    this.imgList = [
                        require('@/assets/images/jr/06.png'),
                        require('@/assets/images/jr/02.png'),
                        require('@/assets/images/jr/03.png'),
                        require('@/assets/images/jr/04.png'),
                        require('@/assets/images/jr/05.png'),
                    ]
                    return 
                case '1':
                    this.imgList = [
                        require('@/assets/images/jr/01.png'),
                        require('@/assets/images/jr/07.png'),
                        require('@/assets/images/jr/03.png'),
                        require('@/assets/images/jr/04.png'),
                        require('@/assets/images/jr/05.png'),
                    ]
                    return 
                case '2':
                    this.imgList = [
                        require('@/assets/images/jr/01.png'),
                        require('@/assets/images/jr/02.png'),
                        require('@/assets/images/jr/08.png'),
                        require('@/assets/images/jr/04.png'),
                        require('@/assets/images/jr/05.png'),
                    ]
                    return 
                case '3':
                    this.imgList = [
                        require('@/assets/images/jr/01.png'),
                        require('@/assets/images/jr/02.png'),
                        require('@/assets/images/jr/03.png'),
                        require('@/assets/images/jr/09.png'),
                        require('@/assets/images/jr/05.png'),
                    ]
                    return 
                case '4':
                    this.imgList = [
                        require('@/assets/images/jr/01.png'),
                        require('@/assets/images/jr/02.png'),
                        require('@/assets/images/jr/03.png'),
                        require('@/assets/images/jr/04.png'),
                        require('@/assets/images/jr/10.png'),
                    ]
                    return 
            }
        
    }
  }
}

</script>
<style scoped lang="less">
@import '~link-less';
  nav {
    box-sizing: border-box;
    width: 100%;height: 50PX;
    color:#96accd;
    background-color: #fff;
    .display-flex();
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,.1);
    a {
      flex: 1;
      display: -webkit-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12PX;
      i {
        font-size: 20PX;
      }
      img {
        width: 20PX;
        margin-top: 11px;
      }
    }
    .nav-bg {
      color: @font-primary-color;
    }
  }

</style>
