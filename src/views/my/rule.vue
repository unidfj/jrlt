<template>
  <div class="page">
    <m-header :title="title" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div class="box">
          <div class="content" v-if="type==10">
          {{data.application_rules}}
        </div>

        <!-- <div class="rule" v-else-if="type==-1">
          <ul v-for="(v,i) in rule_1" :key="i">
            <li>
              <p class="text" v-if="v.content">{{i+1}}. {{v}}</p>
            </li>
          </ul>
        </div> -->

        <div class="content" v-else-if="type==10">
          {{text}}
          <!-- {{text.replace(/↵/g,"<br />")}} -->
        </div>
        <div class="rule" v-else>
          <ul>
            <li v-for="(v,i) in list" :key="i">
              <p class="text" v-if="v.content">{{i+1}}. {{v}}</p>
              <div v-else>
                  <p class="title">{{v.title}}</p>
                  <ul v-for="(v2,i2) in v.arr" :key="i2">
                    <li>
                      <p>{{v2}}</p>
                    </li>
                  </ul>
              </div>
            </li>
          </ul>
        </div>

      </div>
      
    </section>
  </div>
</template>
<script>
import { Owner,Trade } from "@/server/server.js";
import {a} from '@/assets/commonjs/lan.js';
export default {
  data() {
    return {
      id:null,
      list: [],
      data:{
        application_rules:null,
        credit1_rule:null,
        credit2_rule:null,
        credit3_rule:null,
        credit4_rule:null,
      },
      text:null,
      type:null,
      title:null,
      lang_text:null,
      lang:null,
      //油规则
      rule_1:[
        {
          title:'',
          content:'',
          arr:[
            '1.所产石油可用于跨境商城购物',
            '2.所产石油可在交易平台进行交易',
            '3.所产石油可兑换股权',
            '4.所产石油可兑换炼油机',
            ],
        },
      ],
      // 活跃度规则
      rule_3:[
        {
          title:'1.活跃度价值',
          content:'',
          arr:['活跃度越高，油产量越高'],
        },
        {
          title:'2.活跃度组成',
          content:'',
          arr:['活跃度组成=炼油机活跃度+推广活跃度（扣除活跃度）'],
        },
        {
          title:'3.炼油机活跃度',
          content:'',
          arr:['用户持有有效炼油机赠送活跃度'],
        },
        {
          title:'4.推广活跃度',
          content:'',
          arr:[
            '1，当用户（炼油机活跃度总和）>下级（炼油机活跃度总和）时用户享受直推下级（实名通过）的（炼油机活跃度总和）的5%',
            '<列>',
            '小明是小红的直属上级',
            '小明个人的（炼油机活跃度总和）为20，小红个人的（炼油机活跃度总和）为10',
            '---小明推广活跃度计算--',
            '10×5%=0.5（小明享受0.5推广活跃度加成）',
            '2，当用户【炼油机活跃度总和】＜下级【炼油机活跃度总和】时用户享受用户个人的【炼油机活跃度总和】的5%',
            '注：特殊炼油机不计算在【炼油机活跃度总和】内',
            '（例如进阶炼油机/高级炼油机等）',
            '<例>',
            '小明是小红的直属上级',
            '小明个人的【炼油机活跃度总和】为10',
            '小红个人的【炼油机活跃度总和】为20',
            '---小明的推广活跃度计算---',
            '10×5%=0.5（小明享受0.5推广活跃度加成）',
          ]
        },
        {
          title:'5.扣除活跃度',
          content:'',
          arr:[
            '当用户的【炼油机活跃度总和】小于下级的【炼油机活跃度总和】时，扣除活跃度不计算在推广活跃度内。',
            '扣除活跃度计算=（下级炼油机活跃度总和-上级炼油机活跃度总和）×5%',
            '<例>',
            '小明是小红的直属上级',
            '小明个人的【炼油机活跃度总和】为10',
            '小红个人的【炼油机活跃度总和】为320',
            '---小明的扣除活跃度计算---',
            '（30-10）×5%=1（小明的扣除活跃度为1）',
            '特别提示：',
            '当用户的【炼油机活跃度总和】≧下级的【炼油机活跃度总和】时，扣除活跃度会重新计入推广活跃度内',
          ]
        },
      ],
      //荣耀值规则
      rule_4:[
        {
          title:'荣耀值的价值',
          content:'',
          arr:['所产石油可用于跨境商城购物','每出售成功1升油减少1个荣耀值'],
        },
        {
          title:'荣耀值的来源',
          content:'',
          arr:[
            '1.每直推一名用户【实名】可增加1个荣耀值',
            '2.每购买1升油可增加2个荣耀值',
            '3.登入阅读新闻一篇可增加0.1荣耀值（每天上限0.5）',
            '4.兑换/续费炼油机增加荣耀值、',
            '初级炼油机奖励10点荣耀值',
            '中级炼油机奖励80点荣耀值',
            '高级炼油机奖励300点荣耀值',
            '顶级炼油机奖励800点荣耀值',
            '专家炼油机奖励3000点荣耀值',
            '大师炼油机奖励10000点荣耀值',
            '宗师炼油机奖励40000点荣耀值',
            'PS:分享后点击“返回今日链条Pro”生效',
            ],
        },
      ],
      //奉献值规则
      rule_5:[
        {
          title:'',
          content:'',
          arr:['奉献值是指会员对平台推广的奉献程度，它直接决定用户会员等级，会员等级越高，油交易手续费越低'],
        },
        {
          title:'奉献值等级划分',
          content:'',
          arr:[
            'LV0  注册未实名认证通过的用户',
            '不能交易只能购买',
            'LV1  注册实名认证通过的用户',
            '交易手续费50%',
            'LV2  奉献值≧100点',
            '交易手续费35%',
            'LV3  奉献值≧200点',
            '交易手续费30%',
            'LV4  奉献值≧2000点',
            '交易手续费28%',
            'LV5  奉献值≧5000点',
            '交易手续费25%',
            ],
        },
      ],
      //交易规则
      rule_6:[
        {
          title:'1.交易开放时间',
          content:'',
          arr:['交易开放时间为：早9:00—晚23:00（超出规定时间无法出售炼油值╱发布买单）在规定的时间内已进行的订单可继续完成'],
        },
        {
          title:'2.不可以同时进行交易',
          content:'',
          arr:['买卖炼油值只可以同时进行一单，每天卖炼油值次数上限为三次'],
        },
        {
          title:'3.发布买单炼油值上限为500',
          content:'',
          arr:[],
        },
        {
          title:'4.交易中手续费计算',
          content:'',
          arr:['根据会员等级不同手续费不同，可以在页面【我的】点击会员查看具体的手续费规则'],
        },
        {
          title:'5.交易中荣耀值用途',
          content:'',
          arr:['每出售一枚炼油值需要扣除1点荣耀值，荣耀值为0或不足将无法出售炼油值'],
        },
        {
          title:'6.交易流程—购买',
          content:'',
          arr:[
            '挂单买入',
            '步骤一：点击底部导航栏【交易】',
            '步骤二：点击【买单列表】--【发布买单】，填写单价-数量-交易密码-点击【确认】，买单发布，等待匹配成交',
            '步骤三：卖家匹配成功后，系统会显示该卖家的账号信息，按交易系统显示的账号信息操作，操作完成之后截图上传，等待卖家确认并且发送炼油值',
            ],
        },
        {
          title:'7.交易流程—出售',
          content:'',
          arr:[
            '出售',
            '步骤一：点击底部导航栏【交易】',
            '步骤二：点击【买单列表】--寻找合适的买单点击【出售】，确认交易信息输入交易密码，点击【确认】，出售成功，等待买家付款。',
            '步骤三：买家支付宝操作并且上传截图，点击已付款，卖家确认买家提供的截图是否正确，点击发送炼油值。',
            ],
        },
        {
          title:'8.申诉问题',
          content:'',
          arr:[
            '买家出现提交虚假截图等情况点了已付款后，卖家可以进行申诉，提交相关证据后进行申诉，申诉后订单将停止倒计时进入冻结状态，由官方进行判定。',
            '申诉通过：订单取消，炼油值退回卖家账户，针对买家的行为影响程度会进行封号等处理。',
            ],
        },
        {
          title:'9.交易注意事项',
          content:'',
          arr:[
            '1.交易匹配之后：买家需在2小时内付款并上传凭证确认付款，如诺超过2小时未付款，交易自动取消，炼油值退回卖家账户，系统会按1天╱3天╱永久封号功能。',
            '2.交易匹配之后：买家付款并上传打款截图，卖家未及时确认发送炼油值，系统会在2小时之后自动将交易炼油值划分到买家账户，同时扣除卖家交易炼油值数量10%的炼油值，买家获得一定比例（20%）的卖家额外扣除的炼油值。',
            '3.交易匹配之后：如果买家上传虚假交易凭证，卖家提交申诉，此时冻结交易订单，卖家申诉╱联系客服，查实后，确认买家未按要求付款，则交易订单取消，炼油值退回到卖家账户。',
            '4.为了规范交易市场，打击虚假交易，交易付款必须按照订单详情的总金额支付，并且只能使用支付宝支付，禁止使用微信或者其他方式支付，付款之前核对对方信息，支付完成后上传支付截图时，备注该笔交易的支付交易号，（必须上传该笔付款的交易详情，并且非付款页面）',
            '5.使用支付宝时，必须验证对方姓名，如遇姓名与支付宝不符，切勿支付，请及时联系客服处理。',
            '6.卖家在未收到款或者买家上传虚假交易凭证情况下都可申诉，判定结果会有消息通知，判定恶意申诉会对卖家账号进行相应的处罚。',
            ],
        },
      ],
      //大区活跃度规则
      rule_7:[
        {
          title:'最高的2个团队活跃度之和',
          content:'',
          arr:[],
        },
      ],
      //小区活跃度规则
      rule_8:[
        {
          title:'除最高2个团队活跃度外其它团队活跃度之和',
          content:'',
          arr:[],
        },
      ],
      //商城规则
      rule_9:[
        {
          title:'1.商城购买物品资格必须二级炼油师以上',
          content:'',
          arr:[],
        },
        {
          title:'2.商城所有物品需用炼油值交易',
          content:'',
          arr:[],
        },
        {
          title:'3.商城购买物品成功了，请填写有效的联系方式和地址',
          content:'',
          arr:[],
        },
        {
          title:'4.商城物品一经出售除质量问题，一律不许退换货',
          content:'',
          arr:[],
        },
        {
          title:'5.跨境商城所有物品属于海外直邮，邮递时间以到货时间为准。（请购买的会员耐心等待）',
          content:'',
          arr:[],
        },
        {
          title:'Pos:所有物品解释权归今日链条',
          content:'',
          arr:[],
        },
      ],
      //我的团队规则
      rule_10:[
        {
          title:'一级炼油师：',
          content:'',
          arr:[
            '有效直推20人',
            '大区活跃度500点',
            '奖励初级炼油机一台，享受团队底下所有会员交易手续费10%分红。',
          ],
        },
        {
          title:'二级炼油师：',
          content:'',
          arr:[
            '有效直推20人',
            '大区活跃度达到1500点，小区活跃度达到（500点）',
            '奖励高级炼油机一台，享受团队底下所有会员交易手续费20%分红',
          ],
        },
        {
          title:'三级炼油师：',
          content:'',
          arr:[
            '有效直推20人',
            '大区活跃度达到6000点，小区活跃度达到（3000点）',
            '奖励顶级炼油机一台，享受团队底下所有会员交易手续费17%分红',
          ],
        },
        {
          title:'四级炼油师：',
          content:'',
          arr:[
            '有效直推20人',
            '大区活跃度达到80000点，小区活跃度达到（15000点）',
            '奖励专家炼油机一台，享受团队底下所有会员交易手续费8%分红',
          ],
        },
        {
          title:'五级炼油师：',
          content:'',
          arr:[
            '有效直推20人',
            '大区活跃度达到200000点，小区活跃度达到（70000点）',
            '奖励宗师炼油机一台，享受团队底下所有会员交易手续费5%分红',
          ],
        },
      ],
      //推广活跃度规则
      rule_11:[
        {
          title:'怎么拥有更多推广活跃度',
          content:'',
          arr:[
            '推广活跃度是指您直推下级购买炼油机，给您额外的奖励。',
          ],
        },
        {
          title:'推广活跃度的计算方式',
          content:'',
          arr:[
            '您直推下级购买了一部初级炼油机，初级炼油机的基础活跃度为1，抽取直推下级初级炼油机基础活跃度1的5%，您得到（1×5%＝）0.05的推广活跃度奖励。',
            '您直推下级购买了一部中级炼油机，中级炼油机的基础活跃度为10，抽取直推下级级炼油机基础活跃度10的5%，您得到（10×5%＝）0.5的推广活跃度奖励。',
            '您直推下级购买了一部高级炼油机，高级炼油机的基础活跃度为40，抽取直推下级炼油机基础活跃度40的5%，您得到（40×5%＝）2的推广活跃度奖励。',
            '您直推下级购买了一部顶级炼油机，顶级炼油机的基础活跃度为100，抽取直推下级炼油机基础活跃度100的5%，您得到（100×5%＝）5的推广活跃度奖励。',
            '您直推下级购买油机，专家炼油机的基础活跃度为400，抽取直推下级专家炼油机基础活跃度400的5%，您得到（400×5%＝）20广活跃度奖励。',
            '您直推下级购买油机，大师炼油机的基础活跃度为1000，抽取直推下级大师炼油机基础活跃度1000的5%，您得到（1000×5%＝）50广活跃度奖励。',
            '您直推下级购买油机，宗师炼油机的基础活跃度为1000，抽取直推下级宗师炼油机基础活跃度10000的5%，您得到（10000×5%＝）500广活跃度奖励',
            '你直推的下级矿机越多您的推广活跃度加成越高',
            'Ps：直推下级购买的炼油机到期以后，您的推广活跃度也会相应的减少。',
          ],
        },
      ],
      list:[],

    }
  },
  mounted() {
    this.initData();
    this.city_rule();
    this.rules();
    this.getType();
  },
  methods: {
    initData(){
      // this.id = this.$route.params.id;
      this.type = this.$route.query.type;
      this.lang_text = Object.assign({},a);
      this.lang = localStorage.getItem('lang');
    },
    
    // 自身省市区和规则
    city_rule(){
        Trade.city_rule({type:2}).then(res=>{
            if(res.code==1){
                this.data = res.data;
            }else{
                mui.toast(res.msg)
            }
        })
    },
    // 明细规则
    rules(){
      Trade.rules().then(res=>{
        if(res.code==1){
          if(this.type==99){
            this.text = res.msg.shop_rule;
            return;
          }else if(this.type==11){
            this.text = res.msg.team_rule;
            return;
          }else if(this.type==12){
            this.text = res.msg.daqu_rule;
            return;
          }else if(this.type==13){
            this.text = res.msg.xiaoqu_rule;
            return;
          }else if(this.type==14){
            // this.text = res.msg.xiaoqu_rule;
            this.text = res.msg.cc_rule;
            return;
          }
          this.text = res.msg[`credit${+this.type+2}_rule`];
          console.log(this.text)
          // this.text = '<p>'+this.text.replace(/↵/g,"</p><p>")+'</p>'
          // console.log('<p>'+this.text.replace(/↵/g,"</p><p>")+'</p>')
        }else{
          mui.toast(res.msg)
        }
      })
    },
    getType(){
        switch(+this.type){
            case 0:
                this.title = this.lang!='en'?'活跃度规则':this.lang_text.a90;
                this.list = this.lang!='en'?this.rule_3:this.lang_text.a203;
                break;
            case 1:
                this.title = this.lang!='en'?'荣耀值规则':this.lang_text.a101;
                this.list = this.lang!='en'?this.rule_4:this.lang_text.a204;
                break;
            case 2:
                this.title = this.lang!='en'?'奉献值规则':this.lang_text.a102;
                this.list = this.lang!='en'?this.rule_5:this.lang_text.a205;
                break;
            case 6:
                this.title = this.lang!='en'?'推广活跃度规则':this.lang_text.a218;
                this.list = this.lang!='en'?this.rule_11:this.lang_text.a219;
                break;
            case 10:
                this.title = this.lang!='en'?'城市合伙人规则':this.lang_text.a104;
                break;
            case 11:
                this.title = this.lang!='en'?'团队规则':this.lang_text.a179;
                this.list = this.lang!='en'?this.rule_10:this.lang_text.a210;
                break;
            case 12:
                this.title = this.lang!='en'?'大区活跃度规则':this.lang_text.a180;
                this.list = this.lang!='en'?this.rule_7:this.lang_text.a208;
                break;
            case 13:
                this.title = this.lang!='en'?'小区活跃度规则':this.lang_text.a181;
                this.list = this.lang!='en'?this.rule_8:this.lang_text.a207;
                break;
            case 14:
                this.title = this.lang!='en'?'交易规则':this.lang_text.a182;
                this.list = this.lang!='en'?this.rule_6:this.lang_text.a206;
                break;
            case -1:
                this.title = this.lang!='en'?'油规则':this.lang_text.a103;
                this.list = this.lang!='en'?this.rule_1:this.lang_text.a201;
                break;
            case 99:
                this.title = this.lang!='en'?'规则':'Rule';
                this.list = this.lang!='en'?this.rule_9:this.lang_text.a209;
                break;
        }
        
    },
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  height: 100%;
  background:@bg-color;
  // padding: 60px;
  
  // background-color: rgba(210, 65, 144, 1);
  background-color: rgba(251,195,208, 1);
  .box{
      // background-color: rgba(210, 65, 144, 1);
      background-color: #fff;
      border-radius: 10px;
      width: 690px;
      margin: 20px 30px;
      padding: 30px;
      // color: #fff;
      color: #000;
  }
  .rule{
    ul{
      li{
        p{
          // color: rgb(142, 225, 236);
          color: rgb(0, 140, 196);
        }
        >div{
          margin-bottom: 30px;
          .title{
            font-weight: 550;
            font-size: 32px;
            margin-bottom: 10px;
            // margin-top: 20px;
          }
          ul{
            li{
              p{
                margin-bottom: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
