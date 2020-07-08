import axios from 'axios'
import qs from 'qs'
import {Secret} from '@/assets/commonjs/utils.js';

/**
 * 基础模块
 */
export const Base = new class {
    constructor(){
        this.uploadApi = '/api/user/upload';  //上传
        this.sendcodeApi = '/api/sms/send';//验证码
        this.imgcodeApi = '/api/Captcha/get'; //图形验证码
        this.bankApi = '/api/user/getbank';//银行
        this.download = '/api/app/info'; //下载
        this.uploadWgtApi = '/api/upload/upFile';//上传wgt
        this.downloadWgtAPi = '/api/upload/downfile';//下载资源更新
        this.getVersionAPi = '/api/upload/getVersion'; //获取服务器版本号
        this.getTextApi =  '/api/app/gettext'; //币与按钮名称
        this.dataApi = '/api/index/getImg'; //基础数据
        this.textSeAPi = '/api/demo/test1';//测试加解密
        this.getImgApi = '/addons/litestore/api.index/index'; //轮播图数据
        this.getnewApi = '/addons/litestore/api.index/getnew'; //轮播图详情
        this.bestApi = '/addons/litestore/api.goods/best'; //商品列表
        this.get_news_listApi = '/api/news/get_news_list'; //新闻列表
        this.get_categoryApi = '/api/news/get_category'; //新闻分类
        this.get_news_contentApi = '/api/news/get_news_content'; //新闻内容
        this.shareApi = '/api/news/share'; //新闻内容
        this.get_secondApi = '/api/news/get_second'; //获取定时任务秒数
        this.dailyjobApi = '/api/news/dailyjob'; //获取每天阅读分享任务数
        this.readApi = '/api/news/read'; //阅读增加奉献值
        
    }
    read(params){
        return axios.get(this.readApi,{params}).then((res)=>res.data); 
    }
    dailyjob(params){
        return axios.get(this.dailyjobApi,{params}).then((res)=>res.data); 
    }
    get_second(params){
        return axios.get(this.get_secondApi,{params}).then((res)=>res.data); 
    }
    share(params){
        return axios.get(this.shareApi,{params}).then((res)=>res.data); 
    }
    get_news_content(params){
        return axios.get(this.get_news_contentApi,{params}).then((res)=>res.data); 
    }
    get_category(params){
        return axios.get(this.get_categoryApi,{params}).then((res)=>res.data); 
    }
    get_news_list(params){
        return axios.get(this.get_news_listApi,{params}).then((res)=>res.data); 
    }
    best(params){
        return axios.get(this.bestApi,{params}).then((res)=>res.data); 
    }
    getnew(params){
        return axios.get(this.getnewApi,{params}).then((res)=>res.data); 
    }
    getImg(params){
        return axios.get(this.getImgApi,{params}).then((res)=>res.data); 
    }
    getBank(){
        return axios.post(this.bankApi).then((res)=>res.data);
    }
    upload(params){
        return  axios.post(this.uploadApi,params).then((res)=>res.data);
    }
    sendCode(params){
        // return axios.post(this.sendcodeApi,qs.stringify(params)).then((res)=>res.data); 
        return  axios.post(this.sendcodeApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    sendCode2(params){
        // return axios.post(this.sendcodeApi,qs.stringify(params)).then((res)=>res.data); 
        return  axios.post(this.sendcodeApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    getImgCode(params){
        return axios.get(this.imgcodeApi,{params}).then((res)=>res.data); 
    }
    getDownload(){
        return axios.get(this.download).then((res)=>res.data); 
    }
    uploadWgt(params){
        return axios.post(this.uploadWgtApi,params).then((res)=>res.data); 
    }
    getVersion(){
        return axios.get(this.getVersionAPi).then((res)=>res.data); 
    }
    getText(){
        return axios.get(this.getTextApi).then((res)=>res.data); 
    }
    getData(){
        return axios.post(this.dataApi).then(res=>res.data)
    }
    getTest(params){
        return axios.get(this.textSeAPi,{params}).then(res=>res.data)
    }
}

/**
 * 用户模块
 */
 export const Init = new class {
     constructor(){
        this.registerApi = '/api/user/register';  //注册
        this.changepwdApi = '/api/user/getbackpass';  //修改密码
        this.backpwdApi = '/api/user/getbackpass';  //忘记密码
        this.userApi = '/api/user/getinfo'; //用户信息
        this.capitalApi = ''; //用户资产
        this.realApi = '/api/user/changeisreal';  //实名认证
        this.loginApi = '/api/user/login';  //登录
        this.backTradeApi = '/api/user/uppaypsw';//修改交易密码
        this.quitApi = '/api/user/logout';//退出登录

        this.changeisrealApi = '/api/user/changeisreal';  //实名
        this.upwecharApi = '/api/user/upwechar';  //微信
        this.uppayApi = '/api/user/uppay';  //支付宝
        this.upbankApi = '/api/user/upbank';  //银行卡
    }
    upbank(params){
        return  axios.post(this.upbankApi,qs.stringify(params)).then((res)=>res.data)
    }
    uppay(params){
        return  axios.post(this.uppayApi,qs.stringify(params)).then((res)=>res.data)
    }
    upwechar(params){
        return  axios.post(this.upwecharApi,qs.stringify(params)).then((res)=>res.data)
    }
    changeisreal(params){
        return  axios.post(this.changeisrealApi,qs.stringify(params)).then((res)=>res.data)
    }
     register(params){
        return  axios.post(this.registerApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
        // return  axios.post(this.registerApi,qs.stringify(params)).then((res)=>res.data)
    }
    changePwd(params){
        return  axios.post(this.changepwdApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    backpwd(params){
        // return  axios.post(this.backpwdApi,qs.stringify(params)).then((res)=>res.data)
        return  axios.post(this.backpwdApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    getUser(params){
        return  axios.post(this.userApi,qs.stringify(params)).then((res)=>res.data)
    }
    getCapital(params){
        return  axios.post(this.capitalApi,qs.stringify(params)).then((res)=>res.data)
    }
    toReal(params){
        return  axios.post(this.realApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    login(params){
        return  axios.post(this.loginApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
        // return  axios.post(this.loginApi,qs.stringify(params)).then((res)=>res.data)    
    }
    backTrade(params){
        return  axios.post(this.backTradeApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
        // return  axios.post(this.backTradeApi,qs.stringify(params)).then((res)=>res.data)    
    }
    quit(){
        return  axios.get(this.quitApi).then((res)=>res.data)
    }
 }
 

/**
 * 个人中心
 */
export const Owner = new class {
    constructor(){
        this.bespeakListApi = '';//预约列表
        this.teamApi = '/api/user/team';//团队
        this.kjfeeApi = '/api/user/getkjfee';//充值矿机费率
        this.payInfoApi = '/api/user/payinfo';//支付信息
        this.bindaliApi = '/api/user/uppay'; //支付宝绑定
        this.bindwechatApi = '/api/user/upwechar'; //微信绑定
        this.userCoinApi= '/api/user/getUserCoin'; //资产模块
        this.coinOrderApi = '/api/user/getCoinOrder';//明细 
        this.coinApi = '/api/user/getCoin';//矿机与推广收益
        this.transferApi = '/api/user/transfer';//转出
        this.shaituApi = '/api/usershow/add';  //晒图
        this.rechargeInfoApi = '/api/user/getRechargeInfo'; //矿机充值信息
        this.rechargeApi = '/api/user/addRechargeLog'; //充值信息
        this.booklistApi = '/api/booking/booking/getlog'; //预约记录
        this.sellInfoApi = '/api/order/order/getSellPay'; //预约记录
        this.bindbankApi = '/api/user/upbank'; //银行卡绑定
        this.payApi= '/api/order/order/payment'; //支付
        this.diallistApi = '/api/turntable/getlist';  //转盘奖品
        this.rewardApi = '/api/turntable/getreward';  //奖品

        // 矿机记录
        this.buystutasApi = '/api/order/order/buyStutas'; //抢矿中列表
        this.buystutas2Api = '/api/order/order/buyStutas2'; //抢矿收益中列表
        this.buyappealApi = '/api/order/order/buyAppeal'; //抢矿申诉列表
        
        // 转让记录
        this.sellstatusApi = '/api/order/order/sellStatus'; //待转让列表
        this.sellstatus2Api = '/api/order/order/sellStatus2'; //转让中列表
        this.sellstatus4Api = '/api/order/order/sellStatus4'; //转让完成列表
        this.sellappealApi = '/api/order/order/sellAppeal'; //转让申诉列表
        // 申诉记录
        this.setappealApi = '/api/order/order/setAppeal';  //申诉
        this.buyerApi = '/api/order/order/payment'; //买家信息

        this.contractApi = '/api/order/order/renewContract'; //续约

        this.sellLogApi = '/api/order/sell/getselllog';  //收益出售记录   !!!!暂时不用！！！
        this.setSellApi = '/api/order/sell/setselllog';  //收益出售

        this.applyApi = '/api/wallet/apply'; //提取
        this.applyLogApi = '/api/wallet/lists'; //提取记录
        this.rateApi = '/api/wallet/getRate'; //兑换比例
        // this.titleApi = '/api/notice/gettitles';  //公告
        this.titleApi = '/api/notice/gettitles';  //公告
        this.noticeDetailApi = '/api/notice/details';  //公告详情
        this.head_portraitApi = '/api/user/head_portrait';//修改头像
        this.notice_newApi = '/api/notice/notice_new';//公告弹窗

    }

    notice_new(params){
        return  axios.post(this.notice_newApi,qs.stringify(params)).then((res)=>res.data);
    }
    head_portrait(params){
        return  axios.post(this.head_portraitApi,qs.stringify(params)).then((res)=>res.data);
    }
    getTeam(params){
        return  axios.post(this.teamApi,qs.stringify(params)).then((res)=>res.data);
    }
    getPayInfo(params){
        return  axios.get(this.payInfoApi,{params}).then((res)=>res.data);
    }
    getUserCoin(params){
        return  axios.get(this.userCoinApi,{params}).then((res)=>res.data);
    }
    getCoinOrder(params){
        return  axios.get(this.coinOrderApi,{params}).then((res)=>res.data);
    }
    getCoin(params){
        return  axios.post(this.coinApi,qs.stringify(params)).then((res)=>res.data);
    }
    getTransfer(params) {
        return axios.post(this.transferApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    shaitu(params) {
        return axios.post(this.shaituApi,qs.stringify(params)).then(res => res.data);
    }
    getRechargeInfo(params) {
        return axios.post(this.rechargeInfoApi,qs.stringify(params)).then(res => res.data);
    }
    recharge(params) {
        return axios.post(this.rechargeApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    getBooklist(params) {
        return axios.get(this.booklistApi,{params}).then(res => res.data);
    }
    getSellInfo(params) {
        return axios.get(this.sellInfoApi,{params}).then(res => res.data);
    }
    bindAli(params) {
        return axios.post(this.bindaliApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    bindwechat(params) {
        return axios.post(this.bindwechatApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    getOrder(params) {
        return axios.get(this.orderListApi,{params}).then(res => res.data);
    }
    addBank(params) {
        return axios.post(this.bindbankApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    buyStutas(params){
        return axios.get(this.buystutasApi,{params}).then(res => res.data);
    }
    buyStutas2(params){
        return axios.get(this.buystutas2Api,{params}).then(res => res.data);
    }
    buyAppeal(params){
        return axios.get(this.buyappealApi,{params}).then(res => res.data);
    }
    sellStatus(params){
        return axios.get(this.sellstatusApi,{params}).then(res => res.data);
    }
    sellStatus2(params){
        return axios.get(this.sellstatus2Api,{params}).then(res => res.data);
    }
    sellStatus4(params){
        return axios.get(this.sellstatus4Api,{params}).then(res => res.data);
    }
    sellAppeal(params){
        return axios.get(this.sellappealApi,{params}).then(res => res.data);
    }
    setAppeal(params){
        return axios.post(this.setappealApi,params).then(res => res.data);
    }
    minePay(params){
        return axios.post(this.payApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    buyer(params){
        return axios.get(this.buyerApi,{params}).then(res => res.data);
    }
    getDialList(params){
        return axios.get(this.diallistApi,{params}).then(res => res.data);
    }
    getReward(params){
        return axios.get(this.rewardApi,{params}).then(res => res.data);
    }
    contract(params){
        return axios.post(this.contractApi,qs.stringify(params)).then(res => res.data);
    }
    sellLog(){
        return axios.get(this.sellLogApi).then(res => res.data);
    }
    setSell(params){
        return axios.post(this.setSellApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    apply(params){
        return axios.post(this.applyApi,qs.stringify(params)).then(res => res.data);
    }
    getapplyList(params){
        return axios.get(this.applyLogApi,{params}).then(res => res.data);
    }
    getrate(){
        return axios.get(this.rateApi).then(res => res.data);
    }
    getKjfee(){
        return axios.get(this.kjfeeApi).then(res => res.data);
    }
    getTitle(params){
        return axios.get(this.titleApi,{params}).then(res=>res.data)
    }
    getNoticeDetail(params){
        return axios.get(this.noticeDetailApi,{params}).then(res=>res.data)
    }
}

/**
 *  帮助中心 
 */
export const Help = new class {
    constructor(){
        this.getCategoryListApi = '/api/question/getCategoryList';//全部问题
        this.getAllListApi = '/api/question/getAllList'
        this.getDetailApi = '/api/question/getDetail';//问题详情
        this.getCenterApi = '/api/question/getCenter';
        this.feedbackApi = '/api/question/addFeedback';  //提交问题

    }
    getCategoryList(params) {
        return axios.get(this.getCategoryListApi,{params}).then((res) => res.data)
    }
    getAllList(params) {
        return axios.post(this.getAllListApi,qs.stringify(params)).then((res) => res.data)
    }

    getDetail(params) {
        return axios.post(this.getDetailApi,qs.stringify(params)).then((res) => res.data)
    }
    getCenter(params) {
        return axios.get(this.getCenterApi,{params}).then((res) => res.data)
    }
    addFeedback(params) {
        return axios.post(this.feedbackApi,qs.stringify(params)).then((res) => res.data)
    }
}

/**
 * 主页
 */
export const Index = new class {
    constructor(){
        // this.fa_blockApi = '/api/user/fa_block';  //矿机这也列表
        this.fa_blockApi = '/api/ore/ore/getorelevel';  //矿机这也列表
        this.miningApi = '/api/mining/mining/index';  //抢矿
        this.oreResultApi = '/api/mining/mining/getOreResult';  //抢矿结果
        this.bookingApi = '/api/booking/booking/setBooking';  //预约
        this.countDownApi = '/api/ore/ore/countDown'; //抢矿倒计时
        this.titleApi = '/api/notice/gettitles';  //公告
        this.bannerAPi = '/api/question/getTopImg';   //banner     


    }
    getMine(){
        return axios.get(this.fa_blockApi).then((res) => res.data)
    }
    mining(params){
        return axios.get(this.miningApi,{params}).then((res) => res.data)
    }
    booking(params){
        return axios.get(this.bookingApi,{params}).then((res) => res.data)
    }
    getcountDown(params){
        return axios.post(this.countDownApi,qs.stringify(params)).then(res=>res.data)
    }
    getoreResult(params){
        return axios.post(this.oreResultApi,qs.stringify(params)).then(res=>res.data)
    }
    getTitle(params){
        return axios.get(this.titleApi,{params}).then(res=>res.data)
    }
    getBanner(){
        return axios.post(this.bannerAPi).then(res=>res.data)

    }
}

export const Trade = new class {
    constructor(){
          
        // CC币
        this.ccOrderApi = '/api/cc/ccOrder';  //cc币订单
        this.detailOrderApi = '/api/cc/detailOrder';  //cc币订单
        this.getCcParamApi = '/api/cc/getCcParam';  //cc币订单
        this.create_Buy_OrderAPi = '/api/cc/create_Buy_Order';   //发布买单   
        this.orderBuyOrderAPi = '/api/cc/orderBuyOrder';   //卖出买单   
        this.confirm_OrderAPi = '/api/cc/confirm_Order';   //卖家确认   
        this.complaintAPi = '/api/cc/complaint';   //申诉   
        this.withdraw_opAPi = '/api/cc/withdraw_op';   //订单失效   
        this.ccOrderApi = '/api/cc/ccOrder';  //查全部订单价高50条
        this.payOrderAPi = '/api/cc/payOrder';   //买家付款   
        // 投资包
        this.getListApi = '/api/machine/getList';  //列表
        this.detailApi = '/api/machine/detail';  //详情
        this.tradeApi = '/api/machine/trade';  //购买
        this.orderListApi = '/api/machine/orderList';  //投资包订单列表
        this.produceCcApi = '/api/machine/produceCc';  //炼油并且领取
        this.lyj_stateApi = '/api/machine/lyj_state';  //炼油机当前状态
        // 消息
        this.config_opAPi = '/api/user/config_op';   //群聊   
        this.gettitlesApi = '/api/notice/gettitles2';  //列表
        this.ccdetailsApi = '/api/log/ccdetails';  //明细
        this.city_allAPi = '/api/user/city_all';   //城市合伙人列表   
        this.city_applyAPi = '/api/user/city_apply';   //城市合伙人申请   
        this.city_ruleAPi = '/api/user/city_rule';   //城市合伙人规则   
        this.systemNewAPi = '/api/user/systemNew';   //系统内部消息   
        this.ztsxfAPi = '/api/log/ztsxf';   //会员推荐手续费奖   
        // 滨
        this.teamAPi = '/api/user/team';   //我的团队   
        this.getlocationAPi = '/api/user/getlocation';   //省市区/县查询接口   
        this.klineAPi = '/api/cc/kline';   //K线图接口  
        this.exchangeAPi = '/api/cc/exchange';   //股权兑换接口  
        this.exlogAPi = '/api/cc/exlog';   //股权兑换记录接口  
        this.feedBackAPi = '/api/question/feedBack';   //问题反馈  
        this.feedbackdetailsPi = '/api/question/feedbackdetails';  //问题反馈详情  
        this.inviteAPi = '/api/user/invite';   //邀请好友  
        // -------------
        this.addAPi = '/addons/litestore/api.adress/add';   //添加地址  
        this.listsAPi = '/addons/litestore/api.adress/lists';   //地址列表  
        this.get_languageAPi = '/api/news/get_language';   //多语言  
        this.rulesAPi = '/api/user/rules';   //明细规则
        this.fx_credit3APi = '/api/user/fx_credit3';   //奉献值等级

        this.payAPi = '/api/pay/pay';  //获取订单信息  
        this.tokenAPi = '/api/pay/token';  //cs  
        this.token2APi = '/api/pay/token2';  //verify_token  
        this.infoAPi = '/api/pay/info';  //verify_token  
        this.realname_imgAPi = '/api/pay/realname_img';  //上传身份照片 
        this.realname_contrastAPi = '/api/pay/realname_contrast';  //检验实名 
        this.pay_credit1APi = '/api/pay/pay_credit1';  //支付 
        this.pay_infoAPi = '/api/pay/pay_info';  //参数
        
    }

    pay_info(params){
        return axios.post(this.pay_infoAPi,qs.stringify(params)).then(res=>res.data)
    }
    pay_credit1(params){
        return axios.post(this.pay_credit1APi,qs.stringify(params)).then(res=>res.data)
    }
    realname_contrast(params){
        return axios.post(this.realname_contrastAPi,qs.stringify(params)).then(res=>res.data)
    }
    realname_img(params){
        return axios.post(this.realname_imgAPi,qs.stringify(params)).then(res=>res.data)
    }
    getInfo(params){
        return axios.post(this.infoAPi,qs.stringify(params)).then(res=>res.data)
    }
    getToken2(params){
        return axios.post(this.token2APi,qs.stringify(params)).then(res=>res.data)
    }
    getToken(params){
        return axios.post(this.tokenAPi,qs.stringify(params)).then(res=>res.data)
    }
    pay(params){
        return axios.post(this.payAPi,qs.stringify(params)).then(res=>res.data)
    }
    feedbackdetails(params){
        return axios.post(this.feedbackdetailsPi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
        // return axios.post(this.feedbackdetailsPi,qs.stringify(params)).then(res=>res.data)
    }
    fx_credit3(params){
        return axios.get(this.fx_credit3APi,{params}).then(res=>res.data)
    }
    rules(params){
        return axios.get(this.rulesAPi,{params}).then(res=>res.data)
    }
    get_language(params){
        return axios.get(this.get_languageAPi,{params}).then(res=>res.data)
    }
    lists(params){
        return axios.post(this.listsAPi,qs.stringify(params)).then(res=>res.data)
    }
    add(params){
        return axios.post(this.addAPi,qs.stringify(params)).then(res=>res.data)
    }
    invite(params){
        return axios.get(this.inviteAPi,{params}).then(res=>res.data)
    }
    feedBack(params){
        return axios.get(this.feedBackAPi,{params}).then(res=>res.data)
        // return axios.post(this.feedBackAPi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    feedBack2(params){
        return axios.post(this.feedBackAPi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
        // return axios.post(this.feedBackAPi,qs.stringify(params)).then(res=>res.data)
    }
    exlog(params){
        // return axios.get(this.exlogAPi,{params}).then(res=>res.data)
        return axios.post(this.exlogAPi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    exchange(params){
        // return axios.post(this.exchangeAPi,qs.stringify(params)).then(res=>res.data)
        return axios.post(this.exchangeAPi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    kline(params){
        return axios.get(this.klineAPi,{params}).then(res=>res.data)
    }
    getlocation(params){
        return axios.post(this.getlocationAPi,qs.stringify(params)).then(res=>res.data)
    }
    team(params){
        return axios.post(this.teamAPi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    ztsxf(params){
        return axios.get(this.ztsxfAPi,{params}).then(res=>res.data)
    }
    systemNew(params){
        return axios.post(this.systemNewAPi,qs.stringify(params)).then(res=>res.data)
    }
    city_rule(params){
        return axios.post(this.city_ruleAPi,qs.stringify(params)).then(res=>res.data)
    }
    city_apply(params){
        return axios.post(this.city_applyAPi,qs.stringify(params)).then(res=>res.data)
    }
    city_all(params){
        return axios.post(this.city_allAPi,qs.stringify(params)).then(res=>res.data)
    }
    ccdetails(params){
        return axios.get(this.ccdetailsApi,{params}).then(res=>res.data)
    }
    gettitles(params){
        return axios.get(this.gettitlesApi,{params}).then(res=>res.data)
    }
    config_op(params){
        return axios.post(this.config_opAPi,qs.stringify(params)).then(res=>res.data)
    }
    payOrder(params){
        return axios.post(this.payOrderAPi,qs.stringify(params)).then(res=>res.data)
    }
    lyj_state(params){
        return axios.get(this.lyj_stateApi,{params}).then(res=>res.data)
    }
    produceCc(params){
        return axios.get(this.produceCcApi,{params}).then(res=>res.data)
    }
    orderList(params){
        return axios.get(this.orderListApi,{params}).then(res=>res.data)
    }
    trade(params){
        // return axios.get(this.tradeApi,{params}).then(res=>res.data)
        return axios.post(this.tradeApi,qs.stringify(params)).then(res=>res.data)
    }
    detail(params){
        return axios.get(this.detailApi,{params}).then(res=>res.data)
    }
    getList(params){
        return axios.get(this.getListApi,{params}).then(res=>res.data)
    }
    ccOrder(params){
        return axios.get(this.ccOrderApi,{params}).then(res=>res.data)
    }
    withdraw_op(params){
        return axios.post(this.withdraw_opAPi,qs.stringify(params)).then(res=>res.data)
    }
    complaint(params){
        return axios.post(this.complaintAPi,qs.stringify(params)).then(res=>res.data)
    }
    confirm_Order(params){
        return axios.post(this.confirm_OrderAPi,qs.stringify(params)).then(res=>res.data)
    }
    orderBuyOrder(params){
        return axios.post(this.orderBuyOrderAPi,qs.stringify(params)).then(res=>res.data)
    }
    create_Buy_Order(params){
        return axios.post(this.create_Buy_OrderAPi,qs.stringify(params)).then(res=>res.data)
    }
    getCcParam(params){
        return axios.get(this.getCcParamApi,{params}).then(res=>res.data)
    }
    detailOrder(params){
        return axios.get(this.detailOrderApi,{params}).then(res=>res.data)
    }
    ccOrder(params){
        return axios.get(this.ccOrderApi,{params}).then(res=>res.data)
    }
}