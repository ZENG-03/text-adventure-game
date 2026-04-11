import { useGameStore } from '../../../store/gameStore'
import { metaDialogues } from '../../../data/metaDialogues'
import { checkEasterEgg, validateWithEasterEgg } from '../../../utils/easterEggHelper'

export default {
  'hall_initial_enter': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">黄昏的庄园</h3>
    <p>铁门没有锁，只是虚掩着。你推开时，锈蚀的铰链发出刺耳的尖叫。一条碎石路通向主楼，路两旁的梧桐树遮天蔽日，将夕阳切割成碎片。空气里弥漫着潮湿的霉味和某种淡淡的香料气息。</p>
    <p>主楼是一座三层英式建筑，石墙上爬满了常春藤，有些窗户用木板钉死，有些则黑洞洞地敞着。门廊下站着一个穿黑色燕尾服的老人，满头银发梳理得一丝不苟。他看见你，微微欠身。</p>
    <p>"沈墨先生。我是霍华德·格雷，庄园管家。您比预定时间早了十分钟。"</p>
    <p>"其他人呢？"</p>
    <p>"加上您，一共五位参赛者。还有四位正在路上。"他引你进入大厅。天花板极高，水晶灯蒙着灰，墙壁上挂满了油画和动物标本。最显眼的是正对门的壁炉上方，一幅巨大的油画：一个中年男人坐在书桌前，手里握着一本书，眼神锐利而忧郁。画框底部刻着名字——多尔法尔·索尔维。</p>
    <p>壁炉前的长桌上已经摆好了四份文件。格雷示意你坐下，为你倒了一杯红茶。</p>
    <p>半小时后，其余四人陆续到达：</p>
    <p>方晓，男，27岁，自称"独立历史研究员"，戴金丝眼镜，说话慢条斯理，背包里塞满文献复印件。</p>
    <p>林小禾，女，22岁，你同校的计算机系研究生，短发，T恤上印着二进制代码，一进门就掏出手机扫描墙上的画。</p>
    <p>艾琳，女，30岁出头，混血面孔，自称是伦敦一家拍卖行的鉴定师，衣着考究，随身带一个皮制工具箱。</p>
    <p>老周，男，五十多岁，穿工装裤，沉默寡言，自称是附近村里的木匠，收到信时以为开玩笑。</p>
    <p>格雷关上大门，从怀中取出一只铜质怀表，放在桌上。</p>
    <p>"诸位，规则很简单：庄园内共有七个谜题，分布在不同的房间。你们需要在明天黎明前解开所有谜题，到达最终密室。第一个完成的人就是胜者。如果无人完成，比赛作废，庄园将永久封闭。"</p>
    <p>他顿了顿："容我提醒，庄园年久失修，有些地方不太安全。请诸君小心。"</p>
    <p>方晓举起手："格雷先生，您说'第一个完成的人获胜'，那我们可以合作吗？"</p>
    <p>格雷面无表情："规则没有禁止合作。但遗产只有一份。"</p>
    <p>林小禾低声对你说："合作的话，信息可以共享，但最后怎么分？"</p>
    <p>艾琳已经站起来，拎起工具箱："各位，我先去熟悉一下环境。祝好运。"高跟鞋敲击地板的声音渐渐远去。</p>
    <p>老周却看着壁炉上的油画，喃喃道："这画……我好像见过。"</p>
    <p>格雷宣布比赛开始。你站在大厅中央，手里攥着那张羊皮纸。你的第一个选择是：</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('庄园的建造者是多尔法尔·索尔维，一位著名的密码学家')
    },
    options: [
      {
        text: '独自探索二楼，从书房开始',
        target: 'library_entry'
      },
      {
        text: '跟着林小禾，她似乎有电子设备辅助',
        target: 'musicroom_entry'
      },
      {
        text: '找老周聊聊，他说的"见过"是什么意思',
        target: 'hall_history'
      },
      {
        text: '先仔细观察大厅，寻找线索',
        target: 'hall_fireplace'
      }
    ]
  },
  'hall_main': {
    desc: (store) => {
      const metaLevel = store.metaLevel;
      const dialogueList = metaDialogues.butler[metaLevel];
      const randomIndex = Math.floor(Math.random() * dialogueList.length);
      const metaLine = dialogueList[randomIndex];
      
      return `
      <h3 style="color: #d4af37; margin-bottom: 20px;">大厅</h3>
      <p>你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。</p>
      <p>壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。</p>
      <p>管家奥尔德斯站在一旁，看着你说道：<br>"${metaLine}"</p>
      `;
    },
    options: (store) => {
      const baseOptions = [
        {
          text: '仔细观察大厅壁炉的纸片',
          target: 'hall_fireplace'
        },
        {
          text: '寻找管家下落（支线《管家的秘密》）',
          target: 'side_story_1_start'
        },
        {
          text: '检查大厅的雕像',
          target: 'puzzle_statues'
        },
        {
          text: '前往书房/图书馆',
          target: 'library_entry'
        },
        {
          text: '前往音乐室',
          target: 'musicroom_entry'
        },
        {
          text: '前往温室花房',
          target: 'greenhouse_entry'
        },
        {
          text: '前往二楼画室',
          target: 'studio_entry'
        },
        {
          text: '前往地下室',
          target: 'basement_entry'
        },
        {
          text: '前往东侧钟楼',
          target: 'clocktower_entry'
        },
        {
          text: '开启中央密室大门 (大结局)',
          target: 'final_chamber_entry',
          condition: () => {
            return store.run.medals.length >= 7
          }
        }
      ];
      
      // 添加开发者房间入口
      if (store.hasAllAchievements && !store.getFlag('dev_room_unlocked')) {
        baseOptions.push({
          text: '✨ 一扇从未见过的门 ✨',
          target: 'dev_room_entry',
          effect: (store) => store.setFlag('dev_room_unlocked', true)
        });
      }
      
      return baseOptions;
    }
  },
  'hall_history': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">大厅的历史</h3>
    <p>你走到老周身边，他正盯着壁炉上的油画发呆。</p>
    <p>"您说您见过这幅画？"</p>
    <p>老周回头看了你一眼，点了点头："我父亲年轻时在这庄园里做过帮工。他说庄园主人是个外国绅士，总把自己关在书房里研究什么。有一次他给我父亲看过一张照片，就是这幅画。"</p>
    <p>"照片？"</p>
    <p>"嗯，背面还写着字。我父亲不识字，就拿给村里的先生看。先生说上面写着'致我的挚友，愿我们的秘密永远沉睡'。"</p>
    <p>管家奥尔德斯不知何时站在你们身后："老周，你的父亲是个忠诚的人。他守口如瓶，直到去世。"</p>
    <p>老周哼了一声："他只是个普通人，不想惹麻烦。"</p>
    <p>奥尔德斯转向你："探索者，时间宝贵。你确定要开始了吗？"</p>
    `,
    options: [
      {
        text: '我准备好了，开始探索',
        target: 'hall_main'
      }
    ]
  },
  'hall_fireplace': {
    on_enter: () => {
      const store = useGameStore()
      let msg = ""
      if (!store.hasClue('烧焦的纸片 (凯撒密码提示)')) {
        store.addClue('烧焦的纸片 (凯撒密码提示)')
        msg += '<div class="system-message">【获得线索】：烧焦的纸片 (凯撒密码提示)</div>'
      }
      return msg
    },
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">壁炉</h3>
    <p>你用壁炉钳拨开灰烬，找到几片未完全烧毁的纸，上面有手写的字迹：</p>
    <p>"……第五个房间的钥匙藏在音乐里，但小心那个……音不准……"</p>
    <p>另一片纸上只有一行数字：11-15-21-18-20-5-19-25。你认出这是凯撒密码，但偏移量未知。你试着用常见的偏移量（3）解码，得到"HOURTESY"——无意义。换成偏移量5，得到"FMPOZPN"——也不对。</p>
    <p>林小禾凑过来："烧掉的是什么？"</p>
    <p>"好像是提示。"你把碎片给她看。她皱眉，用手机拍下照片，快速写了个小程序，几秒钟后说："凯撒偏移量是9，解码是'COURTESY'——礼貌。什么意思？"</p>
    <p>你环顾大厅，壁炉上方油画里，索尔维手里那本书的封面有几个烫金字母：C O U R T E S Y。正是这个词。你走到油画前，踮起脚试图取下那本书，但它只是画上去的。可你发现书的侧面有一道细微的缝隙。你轻轻按下去，"咔嗒"一声，壁炉左侧的墙壁弹开一道暗门。</p>
    <p>林小禾瞪大眼睛："你怎么知道的？"</p>
    <p>"因为碎片提示'第五个房间的钥匙藏在音乐里，但小心音不准'——那应该不是这个谜题。但这条线索让我想到，大厅本身可能就是第一个谜题。"</p>
    <p>暗门后是一条向下的石阶，漆黑一片。林小禾打开手机闪光灯照进去："下去吗？"</p>
    `,
    options: [
      {
        text: '下去探索',
        target: 'basement_entry'
      },
      {
        text: '先记录位置，回头再来',
        target: 'hall_main'
      },
      {
        text: '叫其他人一起',
        target: 'hall_main'
      }
    ],
    hints: [
      "A=1, B=2, C=3...",
      "11=K, 15=O, 21=U... 凯撒偏移量是9，解码是'COURTESY'",
      "答案是 courtesy，对应油画中书的封面字母"
    ],
    input: {
      validate: (ans, store) => {
        const lowerAns = ans.trim().toLowerCase();
        // 正常谜底
        if (lowerAns === 'courtesy') return 'normal';
        // 检查彩蛋
        const eggResult = validateWithEasterEgg(ans, store);
        if (eggResult) return eggResult;
        return false;
      },
      onSuccess: (ans, store, result) => {
        if (result === 'normal') {
          // 正常跳转
          return 'musicroom_unlock';
        } else {
          // 彩蛋触发
          checkEasterEgg(ans, store);
          // 彩蛋后仍允许正常继续
          return 'musicroom_unlock';
        }
      },
      failMsg: "密码错误，暗格发出一声沉闷的声响。"
    }
  },
  'hall_1_medal': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">大厅状态</h3>
    <p>你将[颜色]徽章放在壁炉台上。蓝宝石在火光中闪烁，映出一小片星图。管家瞥了一眼，微微点头："第一枚。还有六道门等待着你。"</p>
    <p>你注意到墙上七幅抽象画中的第一幅似乎变得明亮了一些，原本模糊的线条现在隐约能看出——那是图书馆的轮廓。</p>
    <p>管家对话（1枚徽章后）：</p>
    <p>"你已经踏出了第一步。但后面的谜题只会更难。如果需要休息，随时可以回到这里。"</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'hall_3_medals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">大厅状态</h3>
    <p>三枚徽章在壁炉台上并排闪烁，光芒交织成柔和的虹彩。大厅的光线似乎比之前更亮了，三幅抽象画已经焕发出清晰的色彩——图书馆的书籍、钟楼的齿轮、音乐室的音符，栩栩如生。</p>
    <p>管家递给你一杯热茶："你比我想象的更快。但后面的谜题会更难。有些人在这里停下了脚步，希望你不一样。"</p>
    <p>管家对话（3枚徽章后）：</p>
    <p>"主人的日记里提到，画室和温室藏着最私密的记忆。如果你在那里看到什么……不必惊讶。"</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'hall_6_medals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">大厅状态</h3>
    <p>六枚徽章的光芒照亮了整个房间，壁炉台几乎成了一座小小的灯塔。墙上的六幅抽象画已经变成了生动的场景——图书馆的静谧、钟楼的庄严、音乐室的辉煌、画室的色彩、温室的生机、地下室的神秘。只差最后一幅。</p>
    <p>管家的声音里带着一丝期待，也有一丝不易察觉的颤抖："最后一枚徽章在卧室。主人的私人空间，藏着最终的秘密。那扇门……我已经很久没有打开了。"</p>
    <p>管家对话（6枚徽章后）：</p>
    <p>"卧室的谜题不在地上，而在心里。主人的遗嘱说，最后一扇门只向真正理解谜语意义的人敞开。"</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'hall_7_medals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">大厅状态</h3>
    <p>七枚徽章齐聚的瞬间，大厅中央的石台发出轰鸣，缓缓下沉，露出一条螺旋石梯，石阶向下延伸，消失在淡蓝色的荧光中。七幅抽象画同时燃烧起来——不是真的燃烧，而是化作七色光，汇聚成一道光束，照亮了石梯的入口。</p>
    <p>管家站在阴影中，深深鞠躬，声音沙哑："主人等候已久。请沿着这条路，去揭开最后的谜底。我……在这里等你回来。"</p>
    `,
    options: [
      {
        text: '进入中央密室',
        target: 'final_chamber_entry'
      }
    ]
  },
  'hall_injured': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">受伤</h3>
    <p>你受伤了，剧烈的疼痛让你无法继续当前的探索。你只能跌跌撞撞地回到大厅休息，处理伤口。</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  }
}
