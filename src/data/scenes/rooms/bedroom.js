import { useGameStore } from '../../../store/gameStore'

export default {
  'bedroom_entry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">最深处的卧室</h3>
    <p>你进入了幽暗庄园最深处的卧室。这里是庄园主人的私人空间，装饰豪华而典雅。一张巨大的四柱床立在房间中央，床上铺着精美的丝绸被褥。</p>
    <p>卧室的墙壁上挂着一些家族肖像，从古老的祖先到最近的主人，每一幅都展现着这个家族的辉煌历史。你注意到其中一幅肖像画中的人物与你之前见过的某个人非常相似。</p>
    <p>房间的一角有一个梳妆台，上面放着一些珠宝和化妆品。梳妆台旁边有一个衣柜，里面挂满了各种华丽的服装。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('卧室中挂着家族肖像，其中一幅与之前见过的人相似')
    },
    options: [
      {
        text: '查看家族肖像',
        target: 'bedroom_portraits'
      },
      {
        text: '检查梳妆台',
        target: 'bedroom_dresser'
      },
      {
        text: '打开衣柜',
        target: 'bedroom_wardrobe'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'bedroom_portraits': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">家族肖像</h3>
    <p>你仔细观察墙壁上的家族肖像。这些肖像画记录了这个家族几百年的历史，从庄园的建造者阿斯特·克劳利到最近的主人。</p>
    <p>你注意到其中一幅肖像画中的人物与你在画室见过的画中女子非常相似。肖像画下方有一块铭牌，上面写着："伊莲娜·韦恩，阿斯特·克劳利之妻。"</p>
    <p>你突然意识到，画室中的那幅画可能是伊莲娜的肖像，而她可能是庄园主人的妻子。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('伊莲娜·韦恩是阿斯特·克劳利的妻子，画室中的画是她的肖像')
    },
    options: [
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_dresser': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">梳妆台</h3>
    <p>你走到梳妆台前，仔细观察上面的物品。这里放着一些珠宝和化妆品，都是上等的品质。</p>
    <p>你注意到梳妆台的抽屉里有一本日记。你翻开日记，发现这是伊莲娜·韦恩的日记，记录着她与阿斯特的生活点滴。</p>
    <p>日记的最后一页写着："阿斯特说他要在庄园中隐藏一个巨大的秘密，只有收集到所有徽章的人才能发现。我不知道这个秘密是什么，但我相信阿斯特一定有他的理由。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('伊莲娜的日记')
      store.addClue('伊莲娜的日记提到阿斯特在庄园中隐藏了一个巨大的秘密')
    },
    options: [
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_wardrobe': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">衣柜</h3>
    <p>你打开衣柜，发现里面挂满了各种华丽的服装。这些服装都是上等的品质，有些甚至是几百年前的古董。</p>
    <p>你注意到衣柜的深处有一个小盒子。你打开盒子，发现里面放着一枚徽章和一张纸条。</p>
    <p>纸条上写着："这是最后一枚徽章，彩虹徽章。只有真正理解这个庄园秘密的人才能获得它。恭喜你，解谜者。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('彩虹徽章')
      store.addMedal()
      store.setFlag('bedroom_completed', true)
      store.showToast('获得彩虹徽章！')
    },
    options: [
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'bedroom_candle_midnight': {
    desc: () => {
      const store = useGameStore()
      const hasAllMedals = store.run.medals.length === 7
      if (hasAllMedals) {
        return `
        <h3 style="color: #d4af37; margin-bottom: 20px;">子时烛光</h3>
        <p>子时已到，你点燃了蜡烛。烛光在七枚徽章的光芒映照下，镜中浮现出一行字："七曜归位，真相之门已开。"</p>
        `
      } else {
        const needed = 7 - store.run.medals.length
        return `
        <h3 style="color: #d4af37; margin-bottom: 20px;">子时烛光</h3>
        <p>你点燃了子时的蜡烛，但镜中倒影依然模糊。你还缺少 ${needed} 枚徽章，或许集齐后会有不同。</p>
        `
      }
    },
    on_enter: (store) => {
      if (store.run.medals.length === 7) {
        store.addClue("子时烛光揭示了最终密室的方位")
        // 可以触发隐藏事件或直接跳转
        return { type: 'redirect', target: 'bedroom_candle_success' }
      }
    },
    options: [
      {
        text: "返回卧室",
        target: "bedroom_entry"
      },
      {
        text: "返回大厅",
        target: "hall_main"
      }
    ]
  },
  'bedroom_candle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">真相之门</h3>
    <p>烛光中，镜面化作一扇光门。你推开门，发现了一条通往庄园地下深处的密道。</p>
    `,
    options: [
      {
        text: "进入密道",
        target: "final_chamber_entry"
      },
      {
        text: "暂时不去",
        target: "bedroom_entry"
      }
    ]
  },
  'final_chamber_entry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">最终密室</h3>
    <p>你沿着密道来到了庄园的地下深处，这里是一个巨大的密室。密室的中央有一个石台，上面放着一个古老的盒子。</p>
    <p>石台上刻着一行字："只有真正理解庄园秘密的人才能打开这个盒子。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('最终密室中隐藏着庄园的终极秘密')
    },
    options: [
      {
        text: "打开盒子",
        target: "final_chamber_box"
      },
      {
        text: "返回卧室",
        target: "bedroom_candle_success"
      }
    ]
  },
  'final_chamber_box': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">神秘盒子</h3>
    <p>你打开了石台上的盒子，发现里面放着一本古老的日记和一枚钥匙。</p>
    <p>日记上写着："我，阿斯特·克劳利，在此记录下庄园的秘密。这个庄园是通往另一个世界的门户，而七枚徽章是打开门户的钥匙。但我意识到，这个秘密可能会带来灾难，所以我将它封印在这里，希望有一天能有一个真正善良的人发现它。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('阿斯特的日记')
      store.addItem('神秘钥匙')
      store.setFlag('final_chamber_discovered', true)
      store.showToast('获得阿斯特的日记和神秘钥匙！')
    },
    options: [
      {
        text: "继续探索",
        target: "final_chamber_explore"
      },
      {
        text: "返回卧室",
        target: "bedroom_candle_success"
      }
    ]
  },
  'final_chamber_explore': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">探索密室</h3>
    <p>你继续探索密室，发现墙壁上刻满了古老的符文和图案。这些图案似乎在讲述一个关于世界起源和命运的故事。</p>
    <p>突然，你注意到密室的尽头有一扇石门，上面刻着与你手中钥匙相匹配的图案。</p>
    `,
    options: [
      {
        text: "使用钥匙打开石门",
        target: "final_chamber_gate"
      },
      {
        text: "返回盒子",
        target: "final_chamber_box"
      }
    ]
  },
  'final_chamber_gate': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">命运之门</h3>
    <p>你使用钥匙打开了石门，发现门后是一个通往未知世界的通道。通道中散发着神秘的光芒，似乎在召唤你进入。</p>
    <p>这时，你听到了一个声音："你已经通过了所有的考验，现在你可以选择是否进入这个通道。进入后，你将永远离开这个世界，但你也将获得永生和无尽的知识。"</p>
    `,
    options: [
      {
        text: "进入通道",
        target: "ending_1"
      },
      {
        text: "留在这个世界",
        target: "ending_2"
      }
    ]
  },
  'bedroom_diary': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">日记</h3>
    <p>你在卧室中发现了一本日记。日记的封面已经有些磨损，但里面的字迹依然清晰。</p>
    <p>你翻开日记，发现这是庄园主人的日记，记录着他的日常生活和一些秘密。</p>
    `,
    options: [
      {
        text: '查看梳妆台',
        target: 'bedroom_dressing_table'
      },
      {
        text: '查看镜子',
        target: 'bedroom_mirror_delay'
      },
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_dressing_table': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">梳妆台</h3>
    <p>你仔细检查了梳妆台，发现上面有一些化妆品和珠宝。其中一个抽屉里放着一个小盒子。</p>
    <p>你打开盒子，发现里面放着一枚徽章和一张纸条。纸条上写着："这是美丽徽章，送给我最爱的人。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('美丽徽章')
      store.addMedal()
      store.showToast('获得美丽徽章！')
    },
    options: [
      {
        text: '返回日记',
        target: 'bedroom_diary'
      }
    ]
  },
  'bedroom_mirror_delay': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜子</h3>
    <p>你站在镜子前，发现镜子中的倒影似乎有些延迟。当你移动时，倒影需要几秒钟才能跟上你的动作。</p>
    <p>你仔细观察镜子，发现镜子的边缘有一些奇怪的符号。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('镜子中的倒影有延迟，边缘有奇怪的符号')
    },
    options: [
      {
        text: '返回日记',
        target: 'bedroom_diary'
      }
    ]
  },
  'bedroom_bed': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">床</h3>
    <p>你走到床边，仔细观察这张巨大的四柱床。床上铺着精美的丝绸被褥，看起来非常舒适。</p>
    <p>你注意到床底有一个盒子，似乎被藏在那里。</p>
    `,
    options: [
      {
        text: '查看衣柜',
        target: 'bedroom_closet'
      },
      {
        text: '检查床底盒子',
        target: 'bedroom_box_correct'
      },
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_closet': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">衣柜</h3>
    <p>你打开衣柜，发现里面挂满了各种华丽的服装。衣柜的深处有一个保险箱，上面有一个密码锁。</p>
    `,
    options: [
      {
        text: '尝试打开密码锁',
        target: 'bedroom_closet_lock'
      },
      {
        text: '返回床',
        target: 'bedroom_bed'
      }
    ]
  },
  'bedroom_closet_lock': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">密码锁</h3>
    <p>你尝试打开衣柜中的保险箱。保险箱上有一个数字密码锁，需要输入正确的密码才能打开。</p>
    `,
    input: {
      prompt: '请输入密码',
      placeholder: '例如：1234',
      validate: (input) => {
        return input === '1892'
      },
      success: 'bedroom_closet_back',
      failMsg: '密码不正确，请再仔细思考。',
      hints: [
        '提示1：密码可能与庄园的建造年份有关',
        '提示2：密码可能与家族的重要日期有关'
      ]
    },
    options: [
      {
        text: '返回衣柜',
        target: 'bedroom_closet'
      }
    ]
  },
  'bedroom_window': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">窗户</h3>
    <p>你走到窗户前，向外望去。窗外是庄园的花园，月光洒在花园里，显得非常美丽。</p>
    <p>你注意到花园中有一个喷泉，在月光下闪闪发光。喷泉旁边有一个望远镜。</p>
    `,
    options: [
      {
        text: '观察午夜喷泉',
        target: 'bedroom_midnight_fountain'
      },
      {
        text: '使用望远镜',
        target: 'bedroom_telescope'
      },
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_midnight_fountain': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">午夜喷泉</h3>
    <p>你通过窗户观察午夜的喷泉。喷泉在月光下散发着银色的光芒，水从喷泉中喷出，形成了一道美丽的水幕。</p>
    <p>突然，你发现喷泉的中央出现了一个发光的物体。仔细一看，是一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('月光徽章')
      store.addMedal()
      store.showToast('获得月光徽章！')
    },
    options: [
      {
        text: '返回窗户',
        target: 'bedroom_window'
      }
    ]
  },
  'bedroom_telescope': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">望远镜</h3>
    <p>你使用窗户旁边的望远镜观察夜空。夜空中繁星点点，非常美丽。</p>
    <p>你注意到一颗星星在闪烁，似乎在传递某种信息。当你仔细观察时，发现星星的闪烁形成了一个密码图案。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('星星的闪烁形成了一个密码图案')
    },
    options: [
      {
        text: '返回窗户',
        target: 'bedroom_window'
      }
    ]
  },
  'bedroom_painting': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">油画</h3>
    <p>你在卧室的墙壁上发现了一幅油画。油画描绘了一个美丽的花园，花园中有一个喷泉和一座小亭子。</p>
    <p>你注意到油画中的喷泉与你在窗外看到的喷泉非常相似。</p>
    `,
    options: [
      {
        text: '观察镜子反射',
        target: 'bedroom_mirror_reflection'
      },
      {
        text: '观察彩色光线',
        target: 'bedroom_color_light'
      },
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_mirror_reflection': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜子反射</h3>
    <p>你观察油画在镜子中的反射，发现反射中的油画与实际油画有所不同。反射中的油画中，喷泉的中央有一个发光的物体。</p>
    <p>你按照反射中的提示，在实际油画中找到了一个隐藏的机关。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('反射徽章')
      store.addMedal()
      store.showToast('获得反射徽章！')
    },
    options: [
      {
        text: '返回油画',
        target: 'bedroom_painting'
      }
    ]
  },
  'bedroom_color_light': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">彩色光线</h3>
    <p>你观察油画在彩色光线照射下的变化。当阳光通过彩色玻璃窗照射到油画上时，油画中的图案开始发生变化。</p>
    <p>变化后的图案显示了一个隐藏的宝藏位置。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('彩色光线照射下，油画显示了隐藏的宝藏位置')
    },
    options: [
      {
        text: '返回油画',
        target: 'bedroom_painting'
      }
    ]
  },
  'bedroom_answer_correct': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">回答正确</h3>
    <p>你正确回答了庄园主人的问题。主人非常满意，给了你一枚徽章和一本古老的书籍。</p>
    <p>书籍中记载着关于庄园的秘密和各种谜题的解法。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('智慧徽章')
      store.addMedal()
      store.addItem('谜题之书')
      store.showToast('获得智慧徽章和谜题之书！')
    },
    options: [
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_answer_wrong': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">回答错误</h3>
    <p>你回答错了庄园主人的问题。主人看起来有些失望，但还是给了你一个提示。</p>
    <p>提示："答案就在你身边，仔细观察周围的环境。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('答案就在身边，需要仔细观察周围环境')
    },
    options: [
      {
        text: '再次尝试',
        target: 'bedroom_question'
      },
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_closet_back': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">衣柜背面</h3>
    <p>你打开了衣柜的背面，发现了一个隐藏的空间。空间里放着一枚徽章和一些古老的物品。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('隐藏徽章')
      store.addMedal()
      store.showToast('获得隐藏徽章！')
    },
    options: [
      {
        text: '尝试符文解法',
        target: 'bedroom_rune_solution'
      },
      {
        text: '直接绘画',
        target: 'bedroom_direct_painting'
      },
      {
        text: '返回衣柜',
        target: 'bedroom_closet'
      }
    ]
  },
  'bedroom_rune_solution': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">符文解法</h3>
    <p>你使用符文解法打开了隐藏的机关，获得了更多的宝藏。机关中放着一枚徽章和一些珍贵的宝石。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('符文徽章')
      store.addMedal()
      store.addItem('珍贵宝石')
      store.showToast('获得符文徽章和珍贵宝石！')
    },
    options: [
      {
        text: '返回衣柜背面',
        target: 'bedroom_closet_back'
      }
    ]
  },
  'bedroom_direct_painting': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">直接绘画</h3>
    <p>你直接在衣柜背面的墙上绘画，画出了一个特殊的图案。当你完成绘画时，墙壁上出现了一个隐藏的门。</p>
    <p>门后是一个小房间，里面放着一枚徽章和一些古老的书籍。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('绘画徽章')
      store.addMedal()
      store.addItem('古老书籍')
      store.showToast('获得绘画徽章和古老书籍！')
    },
    options: [
      {
        text: '返回衣柜背面',
        target: 'bedroom_closet_back'
      }
    ]
  },
  'bedroom_box_correct': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">床底盒子</h3>
    <p>你打开了床底的盒子，发现里面放着一枚徽章和一张纸条。纸条上写着："恭喜你找到了我的秘密。这枚徽章将帮助你解开庄园的终极谜题。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('秘密徽章')
      store.addMedal()
      store.showToast('获得秘密徽章！')
    },
    options: [
      {
        text: '返回床',
        target: 'bedroom_bed'
      }
    ]
  },
  'bedroom_box_trap': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">盒子陷阱</h3>
    <p>你打开了床底的盒子，触发了一个陷阱。盒子中弹出了一些尖刺，差点伤到你。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('床底的盒子可能有陷阱，需要小心')
    },
    options: [
      {
        text: '返回床',
        target: 'bedroom_bed'
      }
    ]
  },
  'bedroom_mirror_curse': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜子诅咒</h3>
    <p>你在镜子前待的时间太长，触发了镜子的诅咒。镜子中的倒影开始变得扭曲，似乎要从镜子中出来。</p>
    `,
    options: [
      {
        text: '打破镜子',
        target: 'bedroom_break_mirror'
      },
      {
        text: '逃离卧室',
        target: 'bedroom_escape'
      }
    ]
  },
  'bedroom_fall': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">坠落</h3>
    <p>你在卧室中不小心踩空，从楼梯上坠落。你感到身体重重地摔在地上，失去了意识。</p>
    `,
    options: [
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'bedroom_break_mirror': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">打破镜子</h3>
    <p>你打破了镜子，诅咒被解除。镜子碎片中掉出了一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('诅咒徽章')
      store.addMedal()
      store.showToast('获得诅咒徽章！')
    },
    options: [
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_escape': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">逃离卧室</h3>
    <p>你成功逃离了被诅咒的卧室。当你关上门时，听到镜子破碎的声音。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('镜子可能被诅咒，需要小心')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'bedroom_question': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">主人的问题</h3>
    <p>你听到一个声音在问你："什么东西早晨四条腿，中午两条腿，晚上三条腿？"</p>
    `,
    input: {
      prompt: '请输入答案',
      placeholder: '例如：人',
      validate: (input) => {
        return input.toLowerCase() === '人' || input.toLowerCase() === '人类'
      },
      success: 'bedroom_answer_correct',
      failMsg: '答案不正确，请再仔细思考。',
      hints: [
        '提示1：这是一个经典的谜语',
        '提示2：答案与人类的生命周期有关'
      ]
    },
    options: [
      {
        text: '返回卧室',
        target: 'bedroom_entry'
      }
    ]
  },
  'bedroom_candle_midnight': {
    desc: () => {
      const store = useGameStore()
      const hasAllMedals = store.run.medals.length === 7
      if (hasAllMedals) {
        return `
        <h3 style="color: #d4af37; margin-bottom: 20px;">子时烛光</h3>
        <p>你点燃了子时的蜡烛，烛光摇曳，在镜中映出模糊的倒影。七枚徽章同时发光，镜面突然变得清晰，浮现出一行字："七曜归位，真相之门已开。"</p>
        `
      } else {
        const needed = 7 - store.run.medals.length
        return `
        <h3 style="color: #d4af37; margin-bottom: 20px;">子时烛光</h3>
        <p>你点燃了子时的蜡烛，但镜中倒影依然模糊。你还缺少 ${needed} 枚徽章，或许集齐后会有不同。</p>
        `
      }
    },
    on_enter: (store) => {
      if (store.run.medals.length === 7) {
        store.addClue("子时烛光揭示了最终密室的方位")
        return { type: 'redirect', target: 'bedroom_candle_success' }
      }
    },
    options: [
      { text: "返回卧室", target: "bedroom_entry" },
      { text: "返回大厅", target: "hall_main" }
    ]
  },
  'bedroom_candle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">真相之门</h3>
    <p>烛光中，镜面化作一扇光门。你推开门，发现了一条通往庄园地下深处的密道。</p>
    `,
    options: [
      { text: "进入密道", target: "final_chamber_entry" },
      { text: "暂时不去", target: "bedroom_entry" }
    ]
  },
  'bedroom_final_secret': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">祈祷室</h3>
    <p>衣柜背后的暗门滑开，露出一间狭小的祈祷室。墙上挂着一幅褪色的十字绣，绣着"宽恕"。祭坛上放着一本《克劳利家族忏悔录》和一枚沾着暗色污渍的银戒指。翻开忏悔录，最后几页是管家奥尔德斯的笔迹："我亲手封闭了地下的回响，却封闭不了自己的噩梦。哥哥，我错了。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('管家的忏悔录')
    },
    options: [
      { text: "返回卧室", target: "bedroom_entry" }
    ]
  },
  'bedroom_painting_details': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">油画细节</h3>
    <p>你用放大镜观察油画，发现每个亮着烛光的房间窗户里都藏着一个微小的符号：图书馆是一本翻开的书，钟楼是一个沙漏，音乐室是一个高音谱号，画室是一支画笔，温室是一朵花，地下室是一个六芒星。而漆黑的卧室窗户里，是一面破碎的镜子——镜中倒映着七角星。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('油画符号对应七个房间')
    },
    options: [
      { text: "返回卧室", target: "bedroom_entry" }
    ]
  },
  'bedroom_telescope': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">望远镜观察</h3>
    <p>你将望远镜对准喷泉池底，七角星图案清晰可见。每个角上有一个小孔，月光穿过小孔在池底投下光斑。你数了数，光斑的排列顺序与油画上七个房间的位置完全一致。你记下这个顺序：北-东北-东-东南-南-西南-西。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('喷泉光斑顺序：北、东北、东、东南、南、西南、西')
    },
    options: [
      { text: "返回落地窗前", target: "bedroom_window" },
      { text: "返回卧室", target: "bedroom_entry" }
    ]
  }
}
