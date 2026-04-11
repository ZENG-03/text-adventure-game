import { useGameStore } from '../../../store/gameStore'
import { dynamicDescriptions } from '../../../utils/dynamicDesc'

export default {
  'basement_entry': {
    desc: (store) => dynamicDescriptions.basement_entry(store),
    on_enter: () => {
      const store = useGameStore()
      store.addClue('地下室中有一个上锁的铁门，后面似乎隐藏着秘密')
    },
    options: [
      {
        text: '检查石台',
        target: 'basement_altar'
      },
      {
        text: '尝试打开铁门',
        target: 'basement_puzzle_runes'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'basement_altar': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">石台</h3>
    <p>你走到石台前，仔细观察。石台是用黑色大理石制成的，上面刻着一些古老的符文。这些符文似乎在讲述一个故事，关于一座古老的文明和他们的宝藏。</p>
    <p>石台的中央有一个凹槽，形状像是一枚徽章。你猜测这里可能是放置某种徽章的地方。</p>
    <p>石台旁边有一块石碑，上面写着："深渊的徽章只属于那些敢于面对黑暗的人。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('石台上的凹槽可能是放置徽章的地方，与深渊徽章有关')
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_puzzle_runes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">符文谜题</h3>
    <p>你站在铁门前，仔细观察门上的锁。这是一个特殊的密码锁，上面刻着五种不同的符文图案。</p>
    <p>锁旁边有一张纸条，上面写着："按照元素的力量顺序排列，土、水、火、风、空。"</p>
    <p>你需要按照正确的顺序点击符文图案，才能打开这扇门。</p>
    `,
    input: {
      prompt: '请输入符文的正确顺序（用逗号分隔，例如：土,水,火,风,空）',
      placeholder: '例如：土,水,火,风,空',
      validate: (input) => {
        const sequence = input.toLowerCase().replace(/\s/g, '')
        return sequence === '土,水,火,风,空'
      },
      success: 'basement_puzzle_success',
      failMsg: '顺序不正确，请再仔细思考元素的力量顺序。',
      hints: [
        '提示1：土是基础，代表大地',
        '提示2：水滋养万物',
        '提示3：火带来变革',
        '提示4：风传播种子',
        '提示5：空是最高层次，代表精神'
      ]
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_puzzle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">密室</h3>
    <p>你按照正确的顺序点击了符文图案，听到一声沉重的"轰隆"声，铁门缓缓打开了。</p>
    <p>你走进密室，发现里面有一个古老的祭坛。祭坛上放着一枚徽章，徽章上刻着深渊的图案，散发着淡淡的紫色光芒。这就是传说中的深渊徽章！</p>
    <p>你同时还发现了一本古老的书籍，记载着关于深渊的秘密。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('深渊徽章')
      store.addMedal()
      store.addItem('深渊之书')
      store.setFlag('basement_puzzle_completed', true)
      store.showToast('获得深渊徽章和深渊之书！')
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'basement_altar_use_dew': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用露水</h3>
    <p>你将收集到的露水倒在石台上的凹槽中。露水与符文发生反应，产生了一道微弱的光芒。</p>
    <p>光芒逐渐增强，最终形成了一个小型的水元素。水元素围绕着你旋转，似乎在传递某种信息。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('露水与符文发生反应，产生了水元素')
    },
    options: [
      {
        text: '返回石台',
        target: 'basement_altar'
      }
    ]
  },
  'basement_altar_blood_attempt': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">血液尝试</h3>
    <p>你尝试将血液滴在石台上的凹槽中。血液与符文发生反应，产生了一道红色的光芒。</p>
    <p>光芒逐渐增强，最终形成了一个小型的火元素。火元素围绕着你旋转，似乎在警告你什么。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('血液与符文发生反应，产生了火元素')
    },
    options: [
      {
        text: '返回石台',
        target: 'basement_altar'
      }
    ]
  },
  'basement_alchemy_table': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">炼金工作台</h3>
    <p>你在地下室的一角发现了一个炼金工作台。工作台上摆放着各种炼金工具和材料，包括坩埚、试管、烧杯等。</p>
    <p>工作台上有一本打开的笔记，上面记载着一些炼金配方。</p>
    `,
    options: [
      {
        text: '阅读笔记',
        target: 'basement_read_notes'
      },
      {
        text: '进行蒸馏',
        target: 'basement_distillation'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_read_notes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">阅读笔记</h3>
    <p>你阅读了炼金工作台上的笔记，上面记载着各种炼金配方和实验记录。笔记中提到了一种特殊的精华，可以通过蒸馏七种金属来获得。</p>
    <p>笔记还提到了一个关于元素调和的秘密，说是可以通过特定的仪式来激活元素的力量。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('炼金笔记中记载了通过蒸馏七种金属获得精华的方法')
    },
    options: [
      {
        text: '返回炼金工作台',
        target: 'basement_alchemy_table'
      }
    ]
  },
  'basement_distillation': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">蒸馏</h3>
    <p>你使用炼金工作台上的蒸馏装置，开始蒸馏一些金属。随着蒸馏的进行，你获得了一些金属精华。</p>
    <p>这些精华散发出不同的光芒，每种都代表着不同的元素属性。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('金属精华')
    },
    options: [
      {
        text: '返回炼金工作台',
        target: 'basement_alchemy_table'
      }
    ]
  },
  'basement_balance': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">天平</h3>
    <p>你在地下室中发现了一个古老的天平。天平的两边各有一个托盘，似乎是用来称量物品的。</p>
    <p>天平旁边有一些药瓶，里面装着不同颜色的液体。</p>
    `,
    options: [
      {
        text: '使用药瓶',
        target: 'basement_vials'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_vials': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">药瓶</h3>
    <p>你使用天平称量了不同的药瓶，发现它们的重量各不相同。通过调整药瓶的组合，你找到了一种平衡的状态。</p>
    <p>当天平达到平衡时，天平下方的一个抽屉打开了，里面放着一枚徽章和一些炼金材料。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('平衡徽章')
      store.addMedal()
      store.addItem('炼金材料')
      store.showToast('获得平衡徽章和炼金材料！')
    },
    options: [
      {
        text: '返回天平',
        target: 'basement_balance'
      }
    ]
  },
  'basement_furnace': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">熔炉</h3>
    <p>你在地下室的一角发现了一个古老的熔炉。熔炉的炉膛里还有一些余烬，似乎最近被使用过。</p>
    <p>熔炉旁边有一些燃料和工具，看起来是用来冶炼金属的。</p>
    `,
    options: [
      {
        text: '打开熔炉',
        target: 'basement_open_furnace'
      },
      {
        text: '强行打开熔炉',
        target: 'basement_force_furnace'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_open_furnace': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">打开熔炉</h3>
    <p>你小心地打开了熔炉，发现里面有一些正在熔化的金属。金属散发出不同的颜色，似乎是七种不同的金属。</p>
    <p>你使用工具将熔化的金属倒入模具中，铸成了一个特殊的形状。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('金属铸件')
    },
    options: [
      {
        text: '返回熔炉',
        target: 'basement_furnace'
      }
    ]
  },
  'basement_force_furnace': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">强行打开熔炉</h3>
    <p>你强行打开了熔炉，里面的高温气体突然喷涌而出，差点伤到你。你注意到熔炉内部有一些熔化的金属，但你无法安全地接近。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('强行打开熔炉很危险，需要小心操作')
    },
    options: [
      {
        text: '返回熔炉',
        target: 'basement_furnace'
      }
    ]
  },
  'basement_rune_stones': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">符文石板</h3>
    <p>你在地下室的墙壁上发现了一些符文石板。石板上刻着古老的符文，似乎在讲述一个关于元素的故事。</p>
    <p>你注意到石板上有一些可以按压的凸起，似乎是某种机关。</p>
    `,
    options: [
      {
        text: '激活石板',
        target: 'basement_activate_stones'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_activate_stones': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">激活石板</h3>
    <p>你按照正确的顺序按压了符文石板上的凸起，石板开始发光。光芒逐渐增强，最终形成了一个元素通道。</p>
    <p>通道的另一端连接着一个隐藏的房间，里面放着一枚徽章和一些元素精华。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('元素徽章')
      store.addMedal()
      store.addItem('元素精华')
      store.showToast('获得元素徽章和元素精华！')
    },
    options: [
      {
        text: '返回符文石板',
        target: 'basement_rune_stones'
      }
    ]
  },
  'basement_stone_trap': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">石板陷阱</h3>
    <p>你按压了符文石板上的凸起，但按错了顺序。石板突然弹出，差点伤到你。</p>
    <p>你注意到石板上有一个警告："只有正确的顺序才能激活。"</p>
    `,
    options: [
      {
        text: '再次尝试',
        target: 'basement_activate_stones'
      },
      {
        text: '返回符文石板',
        target: 'basement_rune_stones'
      }
    ]
  },
  'basement_find_metals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找金属</h3>
    <p>你需要寻找七种不同的金属来炼制七金精华。这些金属散落在地下室的各个角落。</p>
    <p>你已经找到了六种金属，还需要最后一种。</p>
    `,
    options: [
      {
        text: '熔炼精华',
        target: 'basement_smelt_essence'
      },
      {
        text: '继续寻找金属',
        target: 'basement_search_metals'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_smelt_essence': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">熔炼精华</h3>
    <p>你将七种金属放入熔炉中熔炼，获得了七金精华。精华散发出七种不同的光芒，非常美丽。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('七金精华')
    },
    options: [
      {
        text: '放置精华',
        target: 'basement_place_essence'
      },
      {
        text: '返回寻找金属',
        target: 'basement_find_metals'
      }
    ]
  },
  'basement_place_essence': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">放置精华</h3>
    <p>你将七金精华放置在石台上的凹槽中。精华与符文发生反应，产生了一道强烈的光芒。</p>
    <p>光芒逐渐增强，最终形成了一个通往更高层次的通道。通道的另一端连接着一个神秘的房间，里面放着一枚徽章和一本古老的书籍。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('七金徽章')
      store.addMedal()
      store.addItem('七金之书')
      store.showToast('获得七金徽章和七金之书！')
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_search_metals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">继续寻找金属</h3>
    <p>你在地下室中继续寻找最后一种金属，最终在一个隐藏的角落里找到了它。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('第七种金属')
    },
    options: [
      {
        text: '返回寻找金属',
        target: 'basement_find_metals'
      }
    ]
  },
  'basement_altar_direct': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">直接祭坛</h3>
    <p>你决定直接在祭坛上进行元素调和仪式。你将各种元素精华放在祭坛上，按照特定的顺序排列。</p>
    `,
    options: [
      {
        text: '激活元素',
        target: 'basement_elemental_activation'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_elemental_activation': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">元素激活</h3>
    <p>你成功激活了元素调和仪式。元素精华开始融合，形成了一个强大的元素核心。</p>
    <p>元素核心散发出七种不同的光芒，最终形成了一枚徽章。这是一枚元素徽章，上面刻着七种元素的图案。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('元素徽章')
      store.addMedal()
      store.showToast('获得元素徽章！')
    },
    options: [
      {
        text: '返回直接祭坛',
        target: 'basement_altar_direct'
      }
    ]
  },
  'basement_poison_gas': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">毒气</h3>
    <p>你在地下室中不小心触发了一个陷阱，释放出了有毒的气体。气体散发出刺鼻的气味，你感到呼吸困难。</p>
    `,
    options: [
      {
        text: '寻找出口',
        target: 'basement_escape_gas'
      },
      {
        text: '使用防毒面具',
        target: 'basement_use_mask'
      }
    ]
  },
  'basement_furnace_explosion': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">熔炉爆炸</h3>
    <p>你在操作熔炉时，不小心导致了熔炉爆炸。爆炸产生的火焰和碎片四处飞溅，差点伤到你。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('furnace_damaged', true)
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_rune_curse': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">符文诅咒</h3>
    <p>你在激活符文石板时，不小心触发了一个诅咒。诅咒的力量开始影响你，你感到身体变得沉重。</p>
    `,
    options: [
      {
        text: '解除诅咒',
        target: 'basement_remove_curse'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_escape_gas': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">逃离毒气</h3>
    <p>你在毒气中寻找出口，最终找到了通往地面的楼梯。你迅速爬楼梯，成功逃离了毒气的范围。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('地下室中有毒气陷阱，需要小心')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'basement_use_mask': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用防毒面具</h3>
    <p>你使用了随身携带的防毒面具，成功抵御了毒气的影响。你可以继续在地下室中探索。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('防毒面具可以抵御毒气')
    },
    options: [
      {
        text: '返回毒气',
        target: 'basement_poison_gas'
      }
    ]
  },
  'basement_remove_curse': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">解除诅咒</h3>
    <p>你使用元素精华解除了符文诅咒。诅咒的力量逐渐消失，你感到身体恢复了正常。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('元素精华可以解除诅咒')
    },
    options: [
      {
        text: '返回符文诅咒',
        target: 'basement_rune_curse'
      }
    ]
  },
  'basement_activate_planets': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">激活行星仪</h3>
    <p>你依照墙壁上模糊的壁画，尝试转动行星仪上的金属球。每转动一个，对应的符文石板就会闪烁一下。当七颗行星全部归位，祭坛中央传来一声低沉的共鸣——但祭坛上并没有出现徽章。你意识到，行星仪只是校准装置，真正的激活还需要七种金属精粹。你记下了行星的顺序（水、金、地、火、木、土、天），也许这个顺序在其他地方有用。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('行星顺序：水、金、地、火、木、土、天')
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_extract_essence': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">提取精华</h3>
    <p>熔炉的高温将矿石中的精华逼出，凝结成一小块散发着热量的晶体。你用金属钳小心夹出，晶体在空气中冷却，变成深红色的【火之精华】。它握在手中微微发烫，似乎可以用于融化冻结的机关或为某些机械提供动力。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('火之精华')
    },
    options: [
      {
        text: '收好精华，返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_furnace_with_key': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">熔炉解锁</h3>
    <p>你用刚刚找到的一把厚重铁钥匙，成功插入了熔炉控制闸下方那个生锈的钥匙孔。伴随着令人牙酸的“嘎吱”一声，锁芯弹开，熔炉的通风阀被完全打开了。炉火再度旺盛地燃烧起来，照亮了整个地下室的角落。</p>
    `,
    options: [
      { text: '尝试提取熔炉内的结晶', target: 'basement_extract_essence' },
      { text: '离开熔炉前往地下室入口', target: 'basement_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'basement_periodic_table': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">元素周期表</h3>
    <p>墙上的元素周期表与现代化学不同，它用炼金术符号标注了七种金属：金（☉）、银（☽）、铜（♀）、铁（♂）、锡（♃）、铅（♄）、汞（☿）。每个符号旁边都标注了一个数字——那是它们在地下矿石中的相对含量比例。你记下这些比例，也许用于调整配方。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('金属含量比例')
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_prepare_materials': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">准备材料</h3>
    <p>你在工作台上整理材料：硫磺、硝石、明矾、蒸馏水，以及从各处收集的金属矿石。你需要按照《炼金术士笔记》的配方，先调和四元素（火、水、土、气），再熔炼七金。台面上有一个铜制研钵，你开始研磨硫磺和硝石。</p>
    `,
    options: [
      {
        text: '寻找金属矿石',
        target: 'basement_search_metals'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_put_metals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">放入金属</h3>
    <p>你将金、银、铜、铁、锡、铅、汞分别放入对应的坩埚。汞是液态，你用滴管小心注入。然后拉下熔炉的鼓风手柄，火焰变成白炽色。金属开始熔化，不同颜色的蒸汽从坩埚中升起，汇聚到中央收集器中，凝结成七种颜色的精粹液滴。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('七金精粹')
    },
    options: [
      {
        text: '将精粹放在符文石板上',
        target: 'basement_place_essence'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_runes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">符文石板</h3>
    <p>你蹲下身，用手指触摸地上的符文。每个符文都微微发热，当你按顺序触摸它们时（从东侧开始顺时针），符文依次亮起。但当你摸到第五个时，一股斥力将你的手弹开——顺序不对。你想起祭坛底部的提示，也许需要按照“金、银、铜、铁、锡、铅、汞”的顺序。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('符文顺序可能与七金有关')
    },
    options: [
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_search_metals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">搜寻金属</h3>
    <p>你在房间内仔细搜寻金属材料。熔炉旁散落着几枚铁钉，工作台的抽屉里有一块焊锡条，蒸馏装置的管道是铜制的，可以拆下一小段。祭坛底座缝隙里有一枚银币，灰烬中有一枚金戒指。加上汞瓶里的水银和天平的铅砝码，你凑齐了七种金属。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('七种金属材料')
    },
    options: [
      {
        text: '返回熔炉炼制精粹',
        target: 'basement_smelt_essence'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  },
  'basement_weigh_metals': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">称量金属</h3>
    <p>你将找到的金属放在天平上。天平底座刻着“等量者，得其魂”。你用小刀将金戒指、银币、铜管、铁钉、锡条、铅砝码切下等重的部分（约5克），水银则用滴管量取等体积。天平平衡后，你得到了七份等量的金属材料。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('等量金属材料')
    },
    options: [
      {
        text: '加入反应釜',
        target: 'basement_put_metals'
      },
      {
        text: '返回地下室',
        target: 'basement_entry'
      }
    ]
  }
}
