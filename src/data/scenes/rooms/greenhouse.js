import { useGameStore } from '../../../store/gameStore'

export default {
  'greenhouse_entry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">温室花房</h3>
    <p>你进入了幽暗庄园的温室花房。这里充满了生机和活力，各种奇花异草在玻璃屋顶下茁壮成长。阳光透过彩色玻璃洒进来，在植物上形成了斑斓的光影。</p>
    <p>花房的中央有一个精美的喷泉，水流从石雕的花瓶中倾泻而下，发出悦耳的声音。喷泉周围种植着各种珍稀的花卉，包括一些你从未见过的品种。</p>
    <p>你注意到花房的一角有一个小温室，里面种植着一些特殊的植物。温室的门上挂着一块牌子，上面写着："只有懂得植物语言的人才能进入。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('温室花房中有一个小温室，需要懂得植物语言才能进入')
    },
    options: [
      {
        text: '检查喷泉',
        target: 'greenhouse_fountain'
      },
      {
        text: '查看珍稀花卉',
        target: 'greenhouse_flowers'
      },
      {
        text: '尝试进入小温室',
        target: 'greenhouse_puzzle_plants'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'greenhouse_fountain': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">喷泉</h3>
    <p>你走到喷泉前，仔细观察。喷泉是用白色大理石制成的，中央是一个石雕的花瓶，水流从瓶口中倾泻而下，形成了一道美丽的水幕。</p>
    <p>你注意到喷泉的底部有一些奇怪的符号，似乎是某种古老的文字。你仔细辨认，发现这些符号代表着不同的植物名称。</p>
    <p>喷泉旁边有一块石碑，上面写着："水是生命之源，植物是大地之子。只有理解它们的关系，才能获得生命的徽章。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('喷泉底部的符号代表着植物名称，与生命徽章有关')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_flowers': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">珍稀花卉</h3>
    <p>你走到珍稀花卉区，仔细观察这些美丽的植物。这里有来自世界各地的珍稀品种，每一株都有着独特的美丽。</p>
    <p>你注意到其中一株植物特别引人注目。它的花朵呈现出七种不同的颜色，从红色到紫色，形成了一道美丽的彩虹。花朵散发着淡淡的香气，让人感到宁静和愉悦。</p>
    <p>植物旁边有一个小牌子，上面写着："七色花 - 传说中的神奇植物，据说它的花苞中蕴含着生命的奥秘。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('七色花苞')
      store.addClue('七色花的花苞中蕴含着生命的奥秘')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_puzzle_plants': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">植物谜题</h3>
    <p>你站在小温室的门前，仔细观察门上的锁。这是一个特殊的密码锁，上面刻着五种不同的植物图案：玫瑰、百合、向日葵、薰衣草和紫藤。</p>
    <p>锁旁边有一张纸条，上面写着："按照植物开花的季节顺序排列，春、夏、秋、冬、四季。"</p>
    <p>你需要按照正确的顺序点击植物图案，才能打开这扇门。</p>
    `,
    input: {
      prompt: '请输入植物的正确顺序（用逗号分隔，例如：玫瑰,百合,向日葵,薰衣草,紫藤）',
      placeholder: '例如：玫瑰,百合,向日葵,薰衣草,紫藤',
      validate: (input) => {
        const sequence = input.toLowerCase().replace(/\s/g, '')
        return sequence === '玫瑰,向日葵,薰衣草,百合,紫藤' || 
               sequence === '玫瑰,向日葵,百合,薰衣草,紫藤'
      },
      success: 'greenhouse_puzzle_success',
      failMsg: '顺序不正确，请再仔细思考植物的开花季节。',
      hints: [
        '提示1：玫瑰在春天开花',
        '提示2：向日葵在夏天盛开',
        '提示3：薰衣草在夏末秋初开花',
        '提示4：百合在秋天开花',
        '提示5：紫藤四季常青'
      ]
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_puzzle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">小温室</h3>
    <p>你按照正确的顺序点击了植物图案，听到一声轻微的"咔哒"声，小温室的门缓缓打开了。</p>
    <p>你走进小温室，发现里面种植着一棵巨大的古树。古树的树干上有一个小洞，里面放着一枚徽章。</p>
    <p>徽章上刻着植物的图案，散发着淡淡的绿色光芒。这就是传说中的生命徽章！</p>
    <p>你同时还发现了一瓶古树血提取剂，这是制作生命精华的关键材料。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('生命徽章')
      store.addMedal()
      store.addItem('古树血提取剂')
      store.setFlag('greenhouse_puzzle_completed', true)
      store.showToast('获得生命徽章和古树血提取剂！')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'greenhouse_flower_beds': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">花坛探索</h3>
    <p>你仔细探索温室的花坛，发现了许多不同种类的花卉。有些花坛种植着常见的花卉，而有些则种植着珍稀的品种。</p>
    <p>你注意到一个花坛里有一些种子，似乎是七色花的种子。</p>
    `,
    options: [
      {
        text: '种植七色花种子',
        target: 'greenhouse_plant_seeds'
      },
      {
        text: '继续探索花坛',
        target: 'greenhouse_beds_explore'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_plant_seeds': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">种植七色花种子</h3>
    <p>你将七色花种子种入花坛中。种子需要适当的条件才能发芽生长。你需要提供七种生长条件：阳光、水分、肥料、通风、温度、湿度和土壤。</p>
    `,
    options: [
      {
        text: '提供生长条件',
        target: 'greenhouse_conditions'
      },
      {
        text: '返回花坛',
        target: 'greenhouse_flower_beds'
      }
    ]
  },
  'greenhouse_conditions': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">生长条件</h3>
    <p>你需要为七色花提供七种生长条件。温室里有各种设备可以调节这些条件。</p>
    `,
    options: [
      {
        text: '调节壁炉（温度）',
        target: 'greenhouse_fireplace'
      },
      {
        text: '使用水井（水分）',
        target: 'greenhouse_well'
      },
      {
        text: '添加肥料',
        target: 'greenhouse_fertilize'
      },
      {
        text: '开启风扇（通风）',
        target: 'greenhouse_fan'
      },
      {
        text: '调整遮阳棚（阳光）',
        target: 'greenhouse_shades'
      },
      {
        text: '检查条件',
        target: 'greenhouse_check_conditions'
      }
    ]
  },
  'greenhouse_fireplace': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">壁炉调节</h3>
    <p>你调节了壁炉的温度，使温室保持在适宜的温度。七色花需要温暖的环境才能生长。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_temperature', true)
    },
    options: [
      {
        text: '返回生长条件',
        target: 'greenhouse_conditions'
      }
    ]
  },
  'greenhouse_well': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">水井</h3>
    <p>你从水井中取水，为七色花种子浇水。适当的水分是种子发芽的必要条件。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_water', true)
    },
    options: [
      {
        text: '返回生长条件',
        target: 'greenhouse_conditions'
      }
    ]
  },
  'greenhouse_fertilize': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">添加肥料</h3>
    <p>你为七色花种子添加了肥料，提供了必要的营养。肥料可以帮助种子更快地发芽和生长。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_fertilizer', true)
    },
    options: [
      {
        text: '返回生长条件',
        target: 'greenhouse_conditions'
      }
    ]
  },
  'greenhouse_fan': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">开启风扇</h3>
    <p>你开启了风扇，为温室提供了良好的通风。通风可以防止病虫害的发生，有利于植物的生长。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_ventilation', true)
    },
    options: [
      {
        text: '返回生长条件',
        target: 'greenhouse_conditions'
      }
    ]
  },
  'greenhouse_shades': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调整遮阳棚</h3>
    <p>你调整了遮阳棚，为七色花提供了适当的阳光。阳光是植物进行光合作用的必要条件。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_sunlight', true)
    },
    options: [
      {
        text: '返回生长条件',
        target: 'greenhouse_conditions'
      }
    ]
  },
  'greenhouse_check_conditions': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">检查条件</h3>
    <p>你检查了七色花的生长条件，发现所有条件都已满足。种子开始发芽，长出了小小的嫩芽。</p>
    <p>随着时间的推移，嫩芽逐渐长大，最终开出了美丽的七色花。花朵散发出淡淡的香气，吸引了许多蝴蝶和蜜蜂。</p>
    <p>当七色花完全开放时，花蕊中出现了一枚徽章。这是一枚绿色的徽章，上面刻着花朵的图案。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('花卉徽章')
      store.addMedal()
      store.showToast('获得花卉徽章！')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_revive_parts': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">七血收集</h3>
    <p>你需要收集七种不同的血液来复活古树。这些血液来自不同的生物，每种都有不同的特性。</p>
    <p>你已经收集了六种血液，还需要最后一种。</p>
    `,
    options: [
      {
        text: '混合血液',
        target: 'greenhouse_mix_blood'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_mix_blood': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">混合血液</h3>
    <p>你将七种血液混合在一起，形成了一种特殊的液体。当你将液体倒入古树的树洞中时，古树开始焕发新的生机。</p>
    <p>古树的树干上出现了一个隐藏的空间，里面放着一枚徽章和一本古老的书籍。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('生命徽章')
      store.addMedal()
      store.addItem('生命之书')
      store.showToast('获得生命徽章和生命之书！')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_pond_tool': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">石盆取物</h3>
    <p>你注意到喷泉的石盆中有一个闪闪发光的物体。你决定尝试取出这个物体。</p>
    `,
    options: [
      {
        text: '用工具取出物体',
        target: 'greenhouse_retrieve_item'
      },
      {
        text: '直接用手取',
        target: 'greenhouse_hand_retrieve'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_retrieve_item': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">取出物体</h3>
    <p>你使用工具成功地从石盆中取出了物体。这是一枚徽章，上面刻着水的图案。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('水之徽章')
      store.addMedal()
      store.showToast('获得水之徽章！')
    },
    options: [
      {
        text: '返回石盆',
        target: 'greenhouse_pond_tool'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_hand_retrieve': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">用手取</h3>
    <p>你直接用手从石盆中取物体，当你的手接触到水时，感到一阵刺痛。水被下了毒！</p>
    <p>你感到头晕目眩，意识到自己中毒了。你需要尽快找到解药。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('poisoned', true)
    },
    options: [
      {
        text: '寻找解药',
        target: 'greenhouse_find_antidote'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_find_antidote': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找解药</h3>
    <p>你在温室中寻找解药，最终在一个药草架上找到了一种可以解毒的草药。你服用了草药，毒性逐渐消失。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('poisoned', false)
      store.addClue('石盆中的水被下了毒，需要小心')
    },
    options: [
      {
        text: '返回石盆',
        target: 'greenhouse_pond_tool'
      }
    ]
  },
  'greenhouse_tree_hole': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">树洞探索</h3>
    <p>你探索了古树的树洞，发现里面有一些古老的物品和文字。树洞中刻着关于生命和自然的智慧。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('古树的树洞中刻着关于生命和自然的智慧')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_poison_spore': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">毒孢子</h3>
    <p>你不小心触碰到了一种带有毒孢子的植物。孢子进入了你的呼吸道，你感到呼吸困难。</p>
    `,
    options: [
      {
        text: '寻找新鲜空气',
        target: 'greenhouse_collapse'
      },
      {
        text: '使用解毒剂',
        target: 'greenhouse_use_antidote'
      }
    ]
  },
  'greenhouse_collapse': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">温室崩溃</h3>
    <p>你试图寻找新鲜空气，但毒孢子的影响越来越严重。你感到头晕目眩，最终昏倒在地。</p>
    <p>当你醒来时，发现温室的部分结构已经崩溃，你躺在温室的废墟中。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_damaged', true)
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'greenhouse_use_antidote': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用解毒剂</h3>
    <p>你及时使用了解毒剂，缓解了毒孢子的影响。你感到呼吸逐渐恢复正常。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('有些植物带有毒孢子，需要小心')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_fan_accident': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">风扇事故</h3>
    <p>你在调节风扇时，不小心触碰到了电线，导致短路。风扇开始高速旋转，最终损坏了温室的一些植物。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('fan_damaged', true)
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_beds_explore': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">深入探索</h3>
    <p>你继续深入探索花坛，发现了更多有趣的植物。其中一种植物特别引人注目，它的叶子会随着音乐的节奏摆动。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('有些植物会对音乐产生反应')
    },
    options: [
      {
        text: '返回花坛',
        target: 'greenhouse_flower_beds'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_tree': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">古树</h3>
    <p>你走到温室中央的古树前，仔细观察。这是一棵巨大的古树，树干粗壮，枝叶茂盛。你注意到树干上有一个树洞，里面似乎有什么东西。</p>
    `,
    options: [
      {
        text: '探索树洞',
        target: 'greenhouse_tree_hole'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_pond_dip': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">石盆</h3>
    <p>你看到喷泉的石盆中有一个闪闪发光的物体，你直接用手去捞取。当你的手接触到水时，感到一阵刺痛。水被下了毒！</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('poisoned', true)
    },
    options: [
      {
        text: '寻找解药',
        target: 'greenhouse_find_antidote'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_plant_seeds': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">种植七色花种子</h3>
    <p>你将七色花种子种入花坛中。种子需要适当的条件才能发芽生长。</p>
    `,
    options: [
      {
        text: '提供生长条件',
        target: 'greenhouse_conditions'
      },
      {
        text: '返回花坛',
        target: 'greenhouse_flower_beds'
      }
    ]
  },
  'greenhouse_tool_shed': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">工具房</h3>
    <p>你进入温室的工具房，里面存放着各种园艺工具和用品。你看到一把铲子、一把剪刀、一个水壶和一些肥料。</p>
    `,
    options: [
      {
        text: '阅读工具手册',
        target: 'greenhouse_manual'
      },
      {
        text: '打开密码箱',
        target: 'greenhouse_wooden_box'
      },
      {
        text: '取工具',
        target: 'greenhouse_take_tools'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_manual': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">工具手册</h3>
    <p>你阅读了工具手册，上面详细介绍了各种园艺工具的使用方法和植物的养护知识。手册中提到了一种特殊的生长激素，可以用来复活枯萎的植物。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('生长激素可以复活枯萎的植物')
    },
    options: [
      {
        text: '返回工具房',
        target: 'greenhouse_tool_shed'
      }
    ]
  },
  'greenhouse_wooden_box': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">密码箱</h3>
    <p>你看到工具房中有一个密码箱，上面有一个数字锁。你需要输入正确的密码才能打开它。</p>
    `,
    input: {
      prompt: '请输入密码箱的密码',
      placeholder: '输入密码',
      validate: '1234',
      success: 'greenhouse_box_opened',
      failMsg: '密码错误',
      hints: [
        '提示1：密码与植物的生长周期有关',
        '提示2：密码是一个四位数',
        '提示3：密码与季节有关'
      ]
    },
    options: [
      {
        text: '返回工具房',
        target: 'greenhouse_tool_shed'
      }
    ]
  },
  'greenhouse_box_opened': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">密码箱打开</h3>
    <p>你输入了正确的密码，密码箱打开了。里面放着一瓶生长激素和一些种子。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('生长激素')
      store.addItem('七色花种子')
    },
    options: [
      {
        text: '返回工具房',
        target: 'greenhouse_tool_shed'
      }
    ]
  },
  'greenhouse_take_tools': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">取工具</h3>
    <p>你从工具房中取出了铲子、剪刀、水壶和肥料。这些工具将帮助你进行园艺工作。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('铲子')
      store.addItem('剪刀')
      store.addItem('水壶')
      store.addItem('肥料')
    },
    options: [
      {
        text: '返回工具房',
        target: 'greenhouse_tool_shed'
      }
    ]
  },
  'greenhouse_collect_plant_parts': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">收集植物部位</h3>
    <p>你需要收集七种不同的植物部位，包括根、茎、叶、花、果实、种子和树皮。</p>
    `,
    options: [
      {
        text: '复活植物部位',
        target: 'greenhouse_revive_parts'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_hydroponic': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">水培墙</h3>
    <p>你看到温室中有一面水培墙，上面种植着各种水培植物。水培墙的管道系统需要清理和维护。</p>
    `,
    options: [
      {
        text: '清理管道',
        target: 'greenhouse_clean_pipes'
      },
      {
        text: '配制营养液',
        target: 'greenhouse_mix_nutrient'
      },
      {
        text: '修复水泵',
        target: 'greenhouse_fix_pump'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_clean_pipes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">清理管道</h3>
    <p>你清理了水培墙的管道，去除了管道中的污垢和杂质。现在水可以顺畅地流动了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('pipes_cleaned', true)
    },
    options: [
      {
        text: '返回水培墙',
        target: 'greenhouse_hydroponic'
      }
    ]
  },
  'greenhouse_mix_nutrient': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">配制营养液</h3>
    <p>你配制了水培植物所需的营养液，为植物提供了必要的营养。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('nutrient_mixed', true)
    },
    options: [
      {
        text: '返回水培墙',
        target: 'greenhouse_hydroponic'
      }
    ]
  },
  'greenhouse_fix_pump': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">修复水泵</h3>
    <p>温室的水泵系统发生了严重的堵塞。你用旁边找来的扳手和工具，费力地拆开了过滤网，将里面常年积累的枯叶和不明的绿色藤蔓根结清理干净。随着一阵水流的轰鸣声，温室的灌溉系统恢复了运作！</p>
    `,
    options: [
      { text: '观察水流流向的水槽', target: 'greenhouse_basin' },
      { text: '返回温室中心', target: 'greenhouse_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'greenhouse_basin': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">水槽刻字</h3>
    <p>你看到温室中有一个水槽，上面刻着一些古老的文字。这些文字讲述了植物的生长周期和生命的奥秘。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('水槽上的刻字讲述了植物的生长周期')
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_pipes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管道阀门</h3>
    <p>你看到温室中有一些管道阀门，它们控制着水和营养液的流动。你需要调整这些阀门来确保植物获得足够的水分和营养。</p>
    `,
    options: [
      {
        text: '调整阀门',
        target: 'greenhouse_entry'
      },
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_use_fertilizer': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用肥料</h3>
    <p>你为植物添加了肥料，提供了必要的营养。植物开始茁壮成长。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('fertilizer_used', true)
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_check_seeds': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">检查种子发芽</h3>
    <p>你检查了种植的种子，发现它们已经开始发芽。嫩芽从土壤中钻出，展现出生命的活力。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('seeds_germinated', true)
    },
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_nursery': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">苗圃</h3>
    <p>你进入温室的苗圃，里面种植着各种幼苗。这些幼苗需要精心照料才能长成成熟的植物。</p>
    `,
    options: [
      {
        text: '返回温室花房',
        target: 'greenhouse_entry'
      }
    ]
  },
  'greenhouse_mix_dead': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">错误的混合</h3>
    <p>你将除草剂倒入营养液，混合后注入管道。几秒钟后，古树的叶片开始卷曲、发黑，树干发出“吱吱”的断裂声。一股腐臭的绿色气体从树根喷出，你捂住口鼻却已经吸入——视线模糊，四肢无力。你挣扎着爬出温室，倒在草地上。管家赶来时，你已陷入昏迷。醒来后，你发现温室被木板封死，管家说：“古树死了，你也差点陪葬。”</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('greenhouse_destroyed', true)
    },
    options: [
      { text: '返回大厅', target: 'hall_main' }
    ]
  }
}
