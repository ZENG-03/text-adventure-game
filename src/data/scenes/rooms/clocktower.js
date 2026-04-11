import { useGameStore } from '../../../store/gameStore'
import { metaDialogues } from '../../../data/metaDialogues'

export default {
  'clocktower_entry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">钟楼</h3>
    <p>你进入了幽暗庄园的钟楼。这里高耸入云，巨大的钟摆在头顶缓缓摆动，发出沉闷的"滴答"声。阳光透过彩色玻璃窗洒进来，在地板上形成了美丽的光影。</p>
    <p>钟楼的墙壁上挂满了各种时钟，从古老的摆钟到精美的怀表，每一件都显示着不同的时间。你注意到这些时钟似乎并不是随意摆放的，而是按照某种规律排列。</p>
    <p>钟楼的中央有一个巨大的机械装置，齿轮和杠杆相互咬合，驱动着整个钟楼的运转。装置旁边有一个控制台，上面刻着一些奇怪的符号。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('钟楼中的时钟按照某种规律排列，中央有一个机械装置')
    },
    options: [
      {
        text: '检查机械装置',
        target: 'clocktower_mechanism'
      },
      {
        text: '查看时钟排列',
        target: 'clocktower_clocks'
      },
      {
        text: '尝试操作控制台',
        target: 'clocktower_puzzle_time'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'clocktower_mechanism': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">机械装置</h3>
    <p>你走到机械装置前，仔细观察。这是一个复杂的齿轮系统，由数百个大小不一的齿轮组成。齿轮之间相互咬合，精确地传递着动力。</p>
    <p>你注意到装置的中心有一个特殊的齿轮，上面刻着一些符号。这些符号似乎代表着不同的时间单位：秒、分、时、日、月、年。</p>
    <p>装置旁边有一块铭牌，上面写着："时间是宇宙的语言，理解它的人将获得时空的认可。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('机械装置中心的齿轮刻着时间单位符号，与时空徽章有关')
    },
    options: [
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_clocks': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">时钟排列</h3>
    <p>你仔细观察墙壁上的时钟排列。这些时钟并不是按照时间顺序排列的，而是按照某种特殊的规律。</p>
    <p>你注意到每个时钟都显示着不同的时间，但这些时间似乎有着某种联系。你仔细记录下了这些时间：3:15、6:30、9:45、12:00、2:30、5:45。</p>
    <p>你突然意识到，这些时间可能代表着某种密码或线索。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('时钟显示的时间可能是某种密码：3:15、6:30、9:45、12:00、2:30、5:45')
    },
    options: [
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_puzzle_time': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">时间谜题</h3>
    <p>你站在控制台前，仔细观察上面的符号。这些符号代表着不同的时间单位：秒、分、时、日、月、年。</p>
    <p>控制台旁边有一张纸条，上面写着："按照时间的流逝顺序排列，从最小到最大。"</p>
    <p>你需要按照正确的顺序点击符号，才能解开这个谜题。</p>
    `,
    input: {
      prompt: '请输入时间单位的正确顺序（用逗号分隔，例如：秒,分,时,日,月,年）',
      placeholder: '例如：秒,分,时,日,月,年',
      validate: (input) => {
        const sequence = input.toLowerCase().replace(/\s/g, '')
        return sequence === '秒,分,时,日,月,年'
      },
      success: 'clocktower_puzzle_success',
      failMsg: '顺序不正确，请再仔细思考时间的流逝顺序。',
      hints: [
        '提示1：秒是最小的时间单位',
        '提示2：年是最大的时间单位',
        '提示3：中间的时间单位是分、时、日、月'
      ]
    },
    options: [
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_puzzle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">时空之门</h3>
    <p>你按照正确的顺序点击了时间符号，听到一声清脆的"叮"声，控制台缓缓打开了。</p>
    <p>控制台里面放着一枚徽章和一个精致的怀表。徽章上刻着时钟的图案，散发着淡淡的红宝石光芒。这就是传说中的时空徽章！</p>
    <p>你拿起怀表，发现它并不是普通的怀表，而是一个可以显示不同时区时间的神奇装置。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('时空徽章')
      store.addMedal()
      store.addItem('阿斯特的怀表')
      store.setFlag('clocktower_puzzle_completed', true)
      store.showToast('获得时空徽章和阿斯特的怀表！')
    },
    options: [
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'clocktower_workbench': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">工作台</h3>
    <p>你在钟楼的一角发现了一个工作台。工作台上摆放着各种工具和零件，看起来是用来维修时钟的。</p>
    <p>工作台旁边有一个工具箱，里面装满了各种维修工具。</p>
    `,
    options: [
      {
        text: '使用工具',
        target: 'clocktower_tools'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_tools': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用工具</h3>
    <p>你使用工作台上的工具维修了一个损坏的时钟。时钟开始正常运行，发出清脆的滴答声。</p>
    <p>当你完成维修时，时钟的表盘打开了，露出了一个隐藏的空间。里面放着一枚徽章和一些时钟零件。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('维修徽章')
      store.addMedal()
      store.addItem('时钟零件')
      store.showToast('获得维修徽章和时钟零件！')
    },
    options: [
      {
        text: '返回工作台',
        target: 'clocktower_workbench'
      }
    ]
  },
  'clocktower_gear_room': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">齿轮室</h3>
    <p>你进入了钟楼的齿轮室。这里布满了各种大小不一的齿轮，齿轮之间相互咬合，发出巨大的噪音。</p>
    <p>你注意到一个齿轮似乎卡住了，需要找到一个手柄来转动它。</p>
    `,
    options: [
      {
        text: '寻找手柄',
        target: 'clocktower_find_handle'
      },
      {
        text: '徒手转动齿轮',
        target: 'clocktower_turn_by_hand'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_find_handle': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找手柄</h3>
    <p>你在齿轮室中寻找手柄，最终在一个角落里找到了它。手柄是用金属制成的，上面刻着一些符号。</p>
    <p>你将手柄插入齿轮的孔中，转动它，齿轮开始正常运转。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('手柄可以用来转动卡住的齿轮')
    },
    options: [
      {
        text: '返回齿轮室',
        target: 'clocktower_gear_room'
      }
    ]
  },
  'clocktower_turn_by_hand': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">徒手转动齿轮</h3>
    <p>你尝试徒手转动卡住的齿轮，但齿轮非常沉重，你无法转动它。你需要找到一个手柄来帮助你。</p>
    `,
    options: [
      {
        text: '寻找手柄',
        target: 'clocktower_find_handle'
      },
      {
        text: '返回齿轮室',
        target: 'clocktower_gear_room'
      }
    ]
  },
  'clocktower_observe_hands': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">观察指针</h3>
    <p>你仔细观察时钟的指针，发现它们似乎在以一种特定的节奏移动。指针的移动似乎在传递某种信息，就像是在低语一样。</p>
    `,
    options: [
      {
        text: '匹配节奏',
        target: 'clocktower_match_rhythm'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_match_rhythm': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">匹配节奏</h3>
    <p>你尝试匹配时钟指针的节奏，按照它们的移动规律点击控制台。当你成功匹配节奏时，控制台发出了清脆的声音，打开了一个隐藏的空间。</p>
    <p>空间里放着一枚徽章和一个节奏指示器。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('节奏徽章')
      store.addMedal()
      store.addItem('节奏指示器')
      store.showToast('获得节奏徽章和节奏指示器！')
    },
    options: [
      {
        text: '返回观察指针',
        target: 'clocktower_observe_hands'
      }
    ]
  },
  'clocktower_calibration': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">行星周期校准</h3>
    <p>你需要校准时钟的行星周期。时钟上显示着不同行星的运行周期，你需要将它们调整到正确的位置。</p>
    `,
    options: [
      {
        text: '尝试校准',
        target: 'clocktower_calibration_success'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_calibration_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">校准成功</h3>
    <p>你成功校准了时钟的行星周期。当时钟校准完成时，发出了一声清脆的声音，打开了一个隐藏的空间。</p>
    <p>空间里放着一枚徽章和一个行星模型。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('行星徽章')
      store.addMedal()
      store.addItem('行星模型')
      store.showToast('获得行星徽章和行星模型！')
    },
    options: [
      {
        text: '返回校准',
        target: 'clocktower_calibration'
      }
    ]
  },
  'clocktower_calibration_fail': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">校准失败</h3>
    <p>你尝试校准时钟的行星周期，但校准失败了。时钟发出了一声警告声，似乎在提示你校准错误。</p>
    `,
    options: [
      {
        text: '再次尝试',
        target: 'clocktower_calibration'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_shadow': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">秒针阴影</h3>
    <p>你注意到时钟的秒针在地板上投下了一个阴影。阴影的位置随着秒针的移动而变化，似乎在地板上形成了某种图案。</p>
    `,
    options: [
      {
        text: '观察阴影解法',
        target: 'clocktower_shadow_solution'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_shadow_solution': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">阴影解法</h3>
    <p>你观察了秒针阴影的移动，发现它在地板上形成了一个密码图案。你按照图案的指示操作控制台，成功解开了谜题。</p>
    <p>控制台打开了一个隐藏的空间，里面放着一枚徽章和一个阴影指示器。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('阴影徽章')
      store.addMedal()
      store.addItem('阴影指示器')
      store.showToast('获得阴影徽章和阴影指示器！')
    },
    options: [
      {
        text: '返回秒针阴影',
        target: 'clocktower_shadow'
      }
    ]
  },
  'clocktower_lever_midnight': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">午夜杠杆</h3>
    <p>你在钟楼的一角发现了一个杠杆，上面刻着"午夜"的字样。你决定在午夜时分拨动这个杠杆。</p>
    `,
    options: [
      {
        text: '拨动杠杆',
        target: 'clocktower_lever_effect'
      },
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_lever_early': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">提前拨动杠杆</h3>
    <p>你决定提前拨动杠杆，而不是等到午夜。当你拨动杠杆时，钟楼开始剧烈摇晃，似乎要倒塌了。</p>
    `,
    options: [
      {
        text: '逃离钟楼',
        target: 'clocktower_escape'
      }
    ]
  },
  'clocktower_lever_effect': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">杠杆效果</h3>
    <p>你在午夜时分拨动了杠杆，钟楼开始发出神秘的光芒。光芒逐渐增强，最终形成了一个通往时空的通道。</p>
    <p>通道的另一端连接着一个神秘的房间，里面放着一枚徽章和一个时空钥匙。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('时空钥匙')
      store.addMedal()
      store.addItem('时空徽章')
      store.showToast('获得时空钥匙和时空徽章！')
    },
    options: [
      {
        text: '返回钟楼',
        target: 'clocktower_entry'
      }
    ]
  },
  'clocktower_trap_room': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">陷阱房</h3>
    <p>你进入了钟楼的陷阱房。房间里布满了各种陷阱，包括尖刺、陷阱门和落石。</p>
    <p>你注意到房间的中央有一枚徽章，但要拿到它需要避开所有的陷阱。</p>
    `,
    options: [
      {
        text: '检查陷阱',
        target: 'clocktower_inspect'
      },
      {
        text: '直接拿徽章',
        target: 'clocktower_death_trap'
      }
    ]
  },
  'clocktower_inspect': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">检查陷阱</h3>
    <p>你仔细检查了房间里的陷阱，找到了避开它们的方法。你小心翼翼地穿过陷阱，成功拿到了中央的徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('陷阱徽章')
      store.addMedal()
      store.showToast('获得陷阱徽章！')
    },
    options: [
      {
        text: '返回陷阱房',
        target: 'clocktower_trap_room'
      }
    ]
  },
  'clocktower_escape': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">逃脱</h3>
    <p>你成功逃离了正在倒塌的钟楼。当你跑出钟楼时，它在你身后轰然倒塌，扬起了巨大的灰尘。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('提前拨动杠杆会导致钟楼倒塌')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'clocktower_death_gear': {
    desc: (store) => {
      const deathCount = store.run.death_count || 0;
      const metaLevel = store.metaLevel;
      const dialogueList = metaDialogues.death[metaLevel];
      const randomIndex = Math.floor(Math.random() * dialogueList.length);
      let deathLine = dialogueList[randomIndex];
      
      // 替换死亡次数占位符
      if (deathLine.includes('${deathCount}')) {
        deathLine = deathLine.replace('${deathCount}', deathCount);
      }
      
      return `
      <h3 style="color: #d4af37; margin-bottom: 20px;">齿轮死亡</h3>
      <p>你在齿轮室中不小心被齿轮卡住，无法逃脱。齿轮的力量越来越大，最终将你卷入其中。</p>
      <p>${deathLine}</p>
      `;
    },
    on_enter: () => {
      const store = useGameStore();
      store.incrementDeathCount();
    },
    options: [
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'clocktower_death_fall': {
    desc: (store) => {
      const deathCount = store.run.death_count || 0;
      const metaLevel = store.metaLevel;
      const dialogueList = metaDialogues.death[metaLevel];
      const randomIndex = Math.floor(Math.random() * dialogueList.length);
      let deathLine = dialogueList[randomIndex];
      
      // 替换死亡次数占位符
      if (deathLine.includes('${deathCount}')) {
        deathLine = deathLine.replace('${deathCount}', deathCount);
      }
      
      return `
      <h3 style="color: #d4af37; margin-bottom: 20px;">坠落死亡</h3>
      <p>你在钟楼中不小心踩中了陷阱，从高处坠落。你感到身体重重地摔在地上，失去了意识。</p>
      <p>${deathLine}</p>
      `;
    },
    on_enter: () => {
      const store = useGameStore();
      store.incrementDeathCount();
    },
    options: [
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'clocktower_death_trap': {
    desc: (store) => {
      const deathCount = store.run.death_count || 0;
      const metaLevel = store.metaLevel;
      const dialogueList = metaDialogues.death[metaLevel];
      const randomIndex = Math.floor(Math.random() * dialogueList.length);
      let deathLine = dialogueList[randomIndex];
      
      // 替换死亡次数占位符
      if (deathLine.includes('${deathCount}')) {
        deathLine = deathLine.replace('${deathCount}', deathCount);
      }
      
      return `
      <h3 style="color: #d4af37; margin-bottom: 20px;">陷阱死亡</h3>
      <p>你直接冲向徽章，触发了房间里的陷阱。尖刺从地板中弹出，刺中了你的身体。你感到一阵剧痛，倒在了地上。</p>
      <p>${deathLine}</p>
      `;
    },
    on_enter: () => {
      const store = useGameStore();
      store.incrementDeathCount();
    },
    options: [
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'clocktower_behind_clock': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">表盘后方</h3>
    <p>你绕到钟楼巨大的表盘后方，这里是齿轮与摆锤的森林。中央有一个青铜齿轮，轮辐上刻着罗马数字“XII”。齿轮下方有一扇小铁门，门上有一个数字转盘，需要输入三位数密码。齿轮边缘有一行小字：“时间的三重锁：月升、子夜、七响。”</p>
    `,
    options: [
      { text: '检查小铁门', target: 'clocktower_door' },
      { text: '检查齿轮运转轨迹', target: 'clocktower_gears' },
      { text: '返回钟楼', target: 'clocktower_entry' }
    ]
  },
  'clocktower_door': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">小铁门</h3>
    <p>小铁门上的密码盘由三个独立转轮组成，每个转轮上有0-9的数字。你尝试输入“127”（月升=12:7？），门纹丝不动。你想起钟楼维护日志中提到的“七声钟鸣，间隔相等”——也许密码是“777”？你输入777，门内传来一声轻响，缓缓打开。里面是一个暗格，放着一枚备用齿轮和一本《钟楼校准手册》。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('备用齿轮')
      store.addItem('钟楼校准手册')
    },
    options: [
      { text: '返回表盘后方', target: 'clocktower_behind_clock' }
    ]
  },
  'clocktower_gear_clues': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">齿轮线索</h3>
    <p>你检查齿轮组，发现VII号齿轮的轴端有新鲜的划痕——有人不久前转动过它。齿轮上还缠着一根白色棉线，线头系着一张小纸条：“顺序：6-3-1-7-4-2-5”。这是秒针阴影的顺序！你撕下纸条，收好。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('齿轮调整顺序：6-3-1-7-4-2-5')
    },
    options: [
      { text: '返回齿轮室', target: 'clocktower_gear_room' }
    ]
  },
  'clocktower_gears': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">齿轮辐条</h3>
    <p>巨大的齿轮咬合转动，发出有节奏的滴答声。你注意到齿轮辐条上除了罗马数字，还有一些极小的刻字："III - 月亏"、"VII - 月盈"、"XII - 月望"。这些可能与月相有关。你记下对应关系，也许在子夜时有用。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('齿轮刻字：III-月亏，VII-月盈，XII-月望')
    },
    options: [
      { text: '返回表盘后方', target: 'clocktower_behind_clock' }
    ]
  },
  'clocktower_door_vii': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">VII号门</h3>
    <p>你拿着齿轮钥匙，在钟楼内寻找"VII号门"。最终在二层楼梯拐角处发现一扇与墙壁融为一体的铁门，门上有罗马数字VII。插入钥匙，门开后是一条狭窄的通道，通道尽头是一扇通往画室的暗门。你打开暗门，发现自己站在画室的书架后面。</p>
    <p>（这为画室谜题提供了捷径，但不会直接获得画室徽章。）</p>
    `,
    options: [
      { text: '进入画室', target: 'studio_entry' },
      { text: '返回钟楼', target: 'clocktower_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  }
}
