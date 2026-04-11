import { useGameStore } from '../../../store/gameStore'

export default {
  'side_butler_quarters': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">管家起居室</h3><p>你进入了管家的起居室，房间不大但整洁有序。一张单人床、一个书桌和一个衣柜构成了基本家具。书桌上放着一本日记和一盏台灯，衣柜上摆放着一些相框。</p><p>你注意到书桌上的日记是打开的，似乎刚被人翻阅过。</p>',
    options: [
      {
        text: '查看日记',
        target: 'side_butler_diary'
      },
      {
        text: '检查衣柜',
        target: 'side_butler_closet'
      },
      {
        text: '查看相框',
        target: 'side_butler_photos'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_butler_diary': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">管家的日记</h3><p>你翻开日记，里面记录着管家的日常工作和一些个人想法。最近的几页内容引起了你的注意：</p><p>"主人的身体越来越差，他总是在深夜前往地下室。我担心他在做一些危险的实验。"</p><p>"今天，主人把自己关在书房里一整天，出来时脸色苍白，手里拿着一个小盒子。"</p><p>"我在整理主人的书桌时，发现了一封未寄出的信，收信人是伊莲娜·布莱克伍德。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家的日记：主人深夜前往地下室，与伊莲娜有联系')
    },
    options: [
      {
        text: '继续查看日记',
        target: 'side_butler_diary_more'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_butler_diary_more': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">日记的秘密</h3><p>你继续阅读日记，发现了更多线索：</p><p>"主人临终前，把一个小盒子交给我，说如果有一天有人能解开庄园的所有谜题，就把这个盒子交给他。"</p><p>"盒子里装着主人的遗嘱和一把钥匙，钥匙可以打开地窖的门。"</p><p>"我知道主人的秘密，他不是自杀，而是被人谋杀的。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家的日记：主人不是自杀，而是被谋杀的')
    },
    options: [
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_butler_closet': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">管家的衣柜</h3><p>你打开衣柜，里面挂着几件整洁的西装和衬衫。在衣柜的底部，你发现了一个小盒子，上面有一把小锁。</p>',
    options: [
      {
        text: '寻找钥匙',
        target: 'side_butler_find_key'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_butler_find_key': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">寻找钥匙</h3><p>你在起居室里寻找钥匙，最终在书桌的抽屉里找到了一把小钥匙。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('小钥匙')
    },
    options: [
      {
        text: '用钥匙打开盒子',
        target: 'side_butler_open_box'
      },
      {
        text: '返回衣柜',
        target: 'side_butler_closet'
      }
    ]
  },
  'side_butler_open_box': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">打开盒子</h3><p>你用钥匙打开了盒子，里面放着一封密封的信和一把地窖钥匙。信上写着："致解开谜题的探索者"。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('地窖钥匙')
      store.addItem('密封的信')
    },
    options: [
      {
        text: '阅读信件',
        target: 'side_butler_read_letter'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_butler_read_letter': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">密封的信</h3><p>你打开密封的信，里面是阿斯特·克劳利的亲笔信：</p><p>"如果你读到这封信，说明你已经解开了庄园的所有谜题。我有一个秘密要告诉你：我不是自杀，而是被我的弟弟托马斯谋杀的。他想要得到我的研究成果，但我拒绝了他。"</p><p>"托马斯现在可能已经回到了庄园，他会试图阻止你揭开真相。请你务必找到我的遗嘱，它在地窖里。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('阿斯特的信：他是被弟弟托马斯谋杀的')
    },
    options: [
      {
        text: '前往地窖',
        target: 'side_cellar'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_butler_photos': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">相框</h3><p>你查看了衣柜上的相框，里面有几张老照片：一张是管家年轻时的照片，一张是阿斯特·克劳利的照片，还有一张是阿斯特和一个年轻女子的合影，女子应该是伊莲娜。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('照片：阿斯特和伊莲娜的合影')
    },
    options: [
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_fireplace': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">壁炉余烬</h3><p>你在管家起居室的壁炉里发现了一些未完全烧毁的纸张。你用壁炉钳拨弄余烬，找到了几片未完全烧毁的纸，上面有手写的字迹。</p>',
    options: [
      {
        text: '查看纸张',
        target: 'side_fireplace_papers'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_fireplace_papers': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">烧毁的纸张</h3><p>你仔细查看烧毁的纸张，上面的字迹有些模糊，但你还是能辨认出一些内容：</p><p>"...托马斯...实验...危险..."</p><p>"...伊莲娜...信..."</p><p>"...遗嘱...地窖..."</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('烧毁的纸张：提到托马斯、实验、伊莲娜的信和遗嘱')
    },
    options: [
      {
        text: '返回壁炉',
        target: 'side_fireplace'
      }
    ]
  },
  'side_under_bed': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">床底皮箱</h3><p>你在管家的床底发现了一个皮箱，上面有一把锁。</p>',
    options: [
      {
        text: '寻找钥匙',
        target: 'side_under_bed_find_key'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_under_bed_find_key': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">寻找皮箱钥匙</h3><p>你在起居室里寻找皮箱的钥匙，最终在书桌的笔筒里找到了一把钥匙。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('皮箱钥匙')
    },
    options: [
      {
        text: '用钥匙打开皮箱',
        target: 'side_under_bed_open_box'
      },
      {
        text: '返回床底',
        target: 'side_under_bed'
      }
    ]
  },
  'side_under_bed_open_box': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">打开皮箱</h3><p>你用钥匙打开了皮箱，里面放着一些信件和一个小盒子。信件是伊莲娜写给阿斯特的，小盒子里装着一枚银手镯。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('伊莲娜的信')
      store.addItem('银手镯')
    },
    options: [
      {
        text: '阅读信件',
        target: 'side_under_bed_read_letters'
      },
      {
        text: '返回起居室',
        target: 'side_butler_quarters'
      }
    ]
  },
  'side_under_bed_read_letters': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">伊莲娜的信</h3><p>你阅读了伊莲娜写给阿斯特的信：</p><p>"亲爱的阿斯特，我不能再继续我们的实验了。它太危险了，我害怕会伤害到你。请你停止吧，为了我们的未来。"</p><p>"我已经离开了庄园，不要来找我。我会永远记得我们在一起的时光。"</p><p>"如果有一天你需要我，就看看我们的银手镯，它会指引你找到我。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('伊莲娜的信：她因为实验太危险而离开了庄园')
    },
    options: [
      {
        text: '返回皮箱',
        target: 'side_under_bed_open_box'
      }
    ]
  },
  'side_cellar': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">地窖入口</h3><p>你使用地窖钥匙打开了地窖的门。地窖里阴暗潮湿，空气中弥漫着一股霉味。台阶向下延伸，尽头是一个酒窖。</p>',
    options: [
      {
        text: '进入酒窖',
        target: 'side_cellar_wine'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_cellar_wine': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">酒窖</h3><p>酒窖里排列着许多橡木酒桶，但大部分都是空的。在酒窖的角落里，你发现了一个铁箱，上面有一把锁。</p>',
    options: [
      {
        text: '寻找钥匙',
        target: 'side_cellar_find_key'
      },
      {
        text: '检查酒桶',
        target: 'side_cellar_check_barrels'
      },
      {
        text: '返回地窖入口',
        target: 'side_cellar'
      }
    ]
  },
  'side_cellar_find_key': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">寻找铁箱钥匙</h3><p>你在酒窖里寻找铁箱的钥匙，最终在一个酒桶的底部找到了一把钥匙。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('铁箱钥匙')
    },
    options: [
      {
        text: '用钥匙打开铁箱',
        target: 'side_cellar_open_box'
      },
      {
        text: '返回酒窖',
        target: 'side_cellar_wine'
      }
    ]
  },
  'side_cellar_check_barrels': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">检查酒桶</h3><p>你检查了酒窖里的酒桶，发现其中一个酒桶上有一个奇怪的标记。你撬开酒桶，里面不是酒，而是一些文件和一个小盒子。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('阿斯特的文件')
      store.addItem('小盒子')
    },
    options: [
      {
        text: '查看文件',
        target: 'side_cellar_read_files'
      },
      {
        text: '返回酒窖',
        target: 'side_cellar_wine'
      }
    ]
  },
  'side_cellar_read_files': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">阿斯特的文件</h3><p>你查看了阿斯特的文件，发现其中包含了他的研究笔记和遗嘱。遗嘱中明确指出，他的所有财产和研究成果都留给解开庄园谜题的人。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('阿斯特的遗嘱：所有财产和研究成果留给解开谜题的人')
    },
    options: [
      {
        text: '返回酒桶',
        target: 'side_cellar_check_barrels'
      }
    ]
  },
  'side_cellar_open_box': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">打开铁箱</h3><p>你用钥匙打开了铁箱，里面放着阿斯特的遗嘱和一把钥匙。遗嘱中详细说明了他的死因和托马斯的罪行。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('阿斯特的遗嘱')
      store.addItem('神秘钥匙')
    },
    options: [
      {
        text: '阅读遗嘱',
        target: 'side_truth'
      },
      {
        text: '返回酒窖',
        target: 'side_cellar_wine'
      }
    ]
  },
  'side_reveal_1': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">与管家对峙</h3><p>你找到了管家，将你发现的证据摆在他面前。管家沉默了很久，最终开口："是的，我知道主人是被谋杀的。但我没有勇气揭露真相，我害怕托马斯会伤害我。"</p>',
    options: [
      {
        text: '追问更多细节',
        target: 'side_reveal_2'
      },
      {
        text: '原谅管家',
        target: 'side_reveal_3'
      }
    ]
  },
  'side_reveal_2': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">追问细节</h3><p>你追问管家更多细节，他告诉你："托马斯是主人的弟弟，他一直嫉妒主人的才华。那天晚上，我听到他们在书房里争吵，然后听到一声枪响。当我冲进去时，主人已经倒在地上，托马斯拿着枪站在旁边。他威胁我不要告诉任何人，否则就杀了我。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家的证词：托马斯在书房枪杀了阿斯特')
    },
    options: [
      {
        text: '询问阿斯特自杀的细节',
        target: 'side_ask_more'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_reveal_3': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">原谅管家</h3><p>你原谅了管家，告诉他你理解他的恐惧。管家感激地说："谢谢你的理解。我会帮助你找到托马斯，让他为自己的罪行付出代价。"</p>',
    options: [
      {
        text: '询问阿斯特自杀的细节',
        target: 'side_ask_more'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_truth': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">遗嘱真相</h3><p>你阅读了阿斯特的遗嘱，上面详细说明了他的死因和托马斯的罪行。遗嘱中还提到，他将庄园和所有研究成果留给解开谜题的人，并希望这个人能揭露托马斯的罪行。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('遗嘱真相：阿斯特被托马斯谋杀，遗产留给解开谜题的人')
    },
    options: [
      {
        text: '返回酒窖',
        target: 'side_cellar_wine'
      }
    ]
  },
  'side_ask_more': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">询问阿斯特自杀的细节</h3><p>你询问管家关于阿斯特自杀的细节，管家告诉你："托马斯伪造了自杀现场，他把枪放在主人手里，然后离开了庄园。第二天，我发现了主人的尸体，报警后警方认定为自杀。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('阿斯特自杀的细节：托马斯伪造了自杀现场')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_ending_master': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">结局：成为谜语馆主人</h3><p>你成功解开了庄园的所有谜题，揭露了托马斯的罪行，并继承了阿斯特的遗产。你决定将庄园改造成一个谜语馆，向世人展示阿斯特的研究成果和庄园的秘密。</p><p>管家成为了你的助手，帮助你管理谜语馆。庄园从此成为了一个著名的旅游景点，吸引着来自世界各地的谜题爱好者。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_butler_completed', true)
      store.triggerFlashback('butler_reconciliation')
      store.showToast('成为谜语馆主人！')
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  },
  'side_ending_spreader': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">结局：成为传播者</h3><p>你成功解开了庄园的所有谜题，揭露了托马斯的罪行，并继承了阿斯特的遗产。你决定将阿斯特的研究成果公之于众，让更多的人受益。</p><p>你撰写了一本关于阿斯特研究的书籍，成为了著名的学者。庄园则被捐赠给了当地的大学，作为研究和教育的场所。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_butler_completed', true)
      store.triggerFlashback('butler_reconciliation')
      store.showToast('成为传播者！')
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  },
  'side_cellar_wall': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">地窖壁画线索</h3><p>你在地窖的墙壁上发现了一些古老的壁画，描绘了庄园的历史和一些神秘的事件。壁画中包含了一些关于谜题的线索。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('地窖壁画：包含谜题线索')
    },
    options: [
      {
        text: '返回酒窖',
        target: 'side_cellar_wine'
      }
    ]
  },
  'side_cellar_diary': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">地窖隐藏日记</h3><p>你在地窖的一个隐藏角落发现了一本日记，是托马斯写的。日记中详细记录了他谋杀阿斯特的过程和他对阿斯特研究成果的渴望。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('托马斯的日记')
      store.addClue('托马斯的日记：详细记录了谋杀过程')
    },
    options: [
      {
        text: '返回酒窖',
        target: 'side_cellar_wine'
      }
    ]
  },
  'side_ending_memento': {
    desc: '<h3 style="color: #d4af37; margin-bottom: 20px;">纪念品结局（怀表）</h3><p>你成功解开了庄园的所有谜题，揭露了托马斯的罪行。在离开庄园之前，管家给了你一个怀表，说是阿斯特生前最喜欢的物品。</p><p>怀表的背面刻着："时间会揭示一切真相。" 你将怀表带在身上，作为这段经历的纪念。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('阿斯特的怀表')
      store.setFlag('side_butler_completed', true)
      store.triggerFlashback('butler_reconciliation')
      store.showToast('获得阿斯特的怀表！')
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  },
  'side_ask_butler': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">询问管家</h3>
    <p>你在大厅拦住管家，将找到的旧照片和信件摊在桌上。"奥尔德斯先生，你究竟隐瞒了什么？" 管家的手微微颤抖，沉默良久后说："有些事情，知道得越少越好。" 但他没有否认，只是转身离开。你感到他内心的挣扎。</p>
    `,
    options: [
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'side_attic': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">阁楼</h3>
    <p>阁楼里堆满了盖着白布的旧家具，空气中弥漫着樟脑丸的气味。最里面有一个木箱，箱子里有一张全家福：两个年轻男人和一个少女。少女的脸被黑笔涂掉了，照片背面写着："她不该出现在这里，1890。" 旁边还有一本《少女日记》，但缺了很多页。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('被涂脸的全家福')
    },
    options: [
      { text: '继续搜索', target: 'side_hidden_drawer' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'side_butler_knows': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管家的坦白</h3>
    <p>你逼问管家："托马斯·赫胥黎是不是被你们害死的？" 管家颓然坐下，老泪纵横："不……是意外。哥哥想阻止他离开，在争执中洞穴塌方了。我……我帮他掩盖了真相。这些年，我每晚都梦见托马斯敲着石头求救。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家的坦白：托马斯死于意外')
    },
    options: [
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'side_butler_last_days': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管家之死</h3>
    <p>管家倒在你怀里，胸口插着一把银匕首——那是阿斯特的遗物。他用最后的力气说："密室……不要打开……它会毁掉一切……" 你抱着他，感到他的身体逐渐冰冷。你合上他的眼睛，心中充满悲凉。</p>
    `,
    options: [
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'side_cellar_key': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">地窖钥匙</h3>
    <p>地窖的门后是一条向下的石阶，尽头是一个酒窖。橡木酒桶排列整齐，但都是空的。墙角有一个木架，上面放着一瓶积满灰尘的红酒，标签写着"1888"。酒瓶旁边有一张纸条："哥哥，原谅我。" 这是管家的笔迹。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家纸条："哥哥，原谅我"')
    },
    options: [
      { text: '返回地窖入口', target: 'side_cellar' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'side_servant_room': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">仆人房间</h3>
    <p>仆人房间的衣柜里有一件旧制服，口袋里有一张值班表。值班表上，管家的名字在最近一个月里频繁出现在午夜时分的"地窖巡逻"一栏。旁边还有一行小字："他每晚都去那里，像是在等什么人。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家子时去地窖')
    },
    options: [
      { text: '返回大厅', target: 'hall_main' }
    ]
  }
}
