import { useGameStore } from '../../store/gameStore'

// 谜题组件配置示例
export default {
  // 物品提交谜题示例
  'puzzle_item_submission': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">物品提交谜题</h3>
    <p>请将正确的物品放入凹槽中。</p>
    `,
    itemSelection: {
      title: '神圣祭坛',
      requiredItems: ['金色钥匙', '古老卷轴'],
      successTarget: 'puzzle_item_success',
      failMsg: '物品组合不正确',
      onFail: (items) => {
        console.log('物品提交失败:', items)
      }
    }
  },
  
  'puzzle_item_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">谜题成功</h3>
    <p>恭喜！你成功提交了正确的物品。祭坛发出了耀眼的光芒，一扇隐藏的门打开了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('神秘宝石')
      store.showToast('获得神秘宝石！')
    },
    options: [
      {
        text: '进入隐藏的门',
        target: 'hidden_room'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 文字输入谜题示例
  'puzzle_text_input': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">文字输入谜题</h3>
    <p>请输入正确的密码。</p>
    `,
    input: {
      title: '密码输入',
      prompt: '请输入密码',
      placeholder: '输入密码',
      validate: 'password123',
      successTarget: 'puzzle_text_success',
      failMsg: '密码错误',
      hint: '密码是：password123',
      maxAttempts: 3,
      onFail: (answer, attempts) => {
        console.log('密码输入失败:', answer, '尝试次数:', attempts)
      },
      onMaxAttempts: (attempts) => {
        console.log('达到最大尝试次数:', attempts)
      }
    }
  },
  
  'puzzle_text_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">密码正确</h3>
    <p>密码正确！保险箱打开了，里面有一份重要的文件。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('重要文件')
      store.showToast('获得重要文件！')
    },
    options: [
      {
        text: '查看文件',
        target: 'read_document'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 物品组合谜题示例
  'puzzle_combine': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">物品组合谜题</h3>
    <p>请将物品组合成新的物品。</p>
    `,
    combine: {
      title: '工作台',
      maxItems: 3,
      combinations: {
        '木材,铁钉': '木槌',
        '铁锭,木棍': '铁剑',
        '纸张,墨水': '信件'
      },
      successTarget: 'puzzle_combine_success',
      failMsg: '这些物品无法组合',
      onSuccess: (items, result) => {
        console.log('组合成功:', items, '结果:', result)
      },
      onFail: (items) => {
        console.log('组合失败:', items)
      }
    }
  },
  
  'puzzle_combine_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">组合成功</h3>
    <p>你成功组合了物品！</p>
    `,
    options: [
      {
        text: '继续组合',
        target: 'puzzle_combine'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 排序谜题示例
  'puzzle_sorting': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">排序谜题</h3>
    <p>请将物品按正确的顺序排列。</p>
    `,
    sorting: {
      title: '光谱排序',
      items: ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色'],
      correctOrder: ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色'],
      successTarget: 'puzzle_sorting_success',
      failMsg: '排序错误',
      hint: '按彩虹色顺序排列',
      onFail: (order) => {
        console.log('排序失败:', order)
      }
    }
  },
  
  'puzzle_sorting_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">排序成功</h3>
    <p>排序正确！墙壁上出现了一个隐藏的通道。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('hidden_passage_open', true)
      store.showToast('隐藏通道已打开！')
    },
    options: [
      {
        text: '进入通道',
        target: 'hidden_passage'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 记忆谜题示例
  'puzzle_memory': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">记忆谜题</h3>
    <p>请记住闪烁的序列并重复它。</p>
    `,
    memory: {
      title: '记忆挑战',
      gridSize: 4,
      maxLevel: 3,
      cellLabels: ['A', 'B', 'C', 'D'],
      successTarget: 'puzzle_memory_success',
      failMsg: '记忆错误',
      onFail: (playerSequence, correctSequence) => {
        console.log('记忆失败:', playerSequence, '正确序列:', correctSequence)
      }
    }
  },
  
  'puzzle_memory_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">记忆成功</h3>
    <p>恭喜！你的记忆力非常出色。一个宝箱打开了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('记忆之戒')
      store.showToast('获得记忆之戒！')
    },
    options: [
      {
        text: '佩戴戒指',
        target: 'wear_ring'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 滑块拼图示例
  'puzzle_slider': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">滑块拼图</h3>
    <p>请将拼图拼完整。</p>
    `,
    slider: {
      title: '古老拼图',
      gridSize: 3,
      successTarget: 'puzzle_slider_success',
      failMsg: '拼图未完成',
      previewImage: 'https://example.com/puzzle-preview.jpg'
    }
  },
  
  'puzzle_slider_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">拼图成功</h3>
    <p>拼图完成！墙上的机关被激活了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('mechanism_activated', true)
      store.showToast('机关已激活！')
    },
    options: [
      {
        text: '查看机关',
        target: 'examine_mechanism'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 节奏谜题示例
  'puzzle_rhythm': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">节奏谜题</h3>
    <p>请跟随节奏点击按钮。</p>
    `,
    rhythm: {
      title: '音乐挑战',
      buttonCount: 4,
      beatPattern: [0, 1, 2, 3, 0, 1, 2, 3],
      beatInterval: 600,
      successThreshold: 0.8,
      buttonLabels: ['♪', '♫', '♩', '♬'],
      successTarget: 'puzzle_rhythm_success',
      failMsg: '节奏错误'
    }
  },
  
  'puzzle_rhythm_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">节奏成功</h3>
    <p>太棒了！你完美地跟随了节奏。音乐盒打开了，里面有一张古老的乐谱。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('古老乐谱')
      store.showToast('获得古老乐谱！')
    },
    options: [
      {
        text: '查看乐谱',
        target: 'read_music'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 隐藏房间场景
  'hidden_room': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">隐藏房间</h3>
    <p>你进入了一个隐藏的房间，里面有许多宝藏。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('金币')
      store.addItem('宝石')
      store.showToast('获得宝藏！')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_item_success'
      }
    ]
  },
  
  // 阅读文档场景
  'read_document': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">重要文件</h3>
    <p>你阅读了重要文件，上面记载着庄园的秘密。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('庄园的秘密：地下有一个古老的宝藏')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_text_success'
      }
    ]
  },
  
  // 隐藏通道场景
  'hidden_passage': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">隐藏通道</h3>
    <p>你进入了隐藏通道，发现了一个地下密室。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('古代 artifact')
      store.showToast('获得古代 artifact！')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_sorting_success'
      }
    ]
  },
  
  // 佩戴戒指场景
  'wear_ring': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">佩戴戒指</h3>
    <p>你佩戴了记忆之戒，突然想起了一些被遗忘的记忆。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('你是庄园的继承人')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_memory_success'
      }
    ]
  },
  
  // 查看机关场景
  'examine_mechanism': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">机关</h3>
    <p>你查看了被激活的机关，发现它控制着庄园的所有门。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('all_doors_unlocked', true)
      store.showToast('所有门已解锁！')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_slider_success'
      }
    ]
  },
  
  // 阅读乐谱场景
  'read_music': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">古老乐谱</h3>
    <p>你阅读了古老乐谱，上面记载着一首神秘的旋律。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('神秘旋律可以打开音乐室的秘密')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_rhythm_success'
      }
    ]
  },
  
  // 数字推盘谜题示例
  'puzzle_fifteen': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">数字推盘谜题</h3>
    <p>请将数字按正确的顺序排列。</p>
    `,
    fifteen: {
      title: '书架排序',
      size: 4,
      successTarget: 'puzzle_fifteen_success',
      failMsg: '排序错误',
      previewImage: 'https://example.com/fifteen-preview.jpg'
    }
  },
  
  'puzzle_fifteen_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">排序成功</h3>
    <p>排序正确！书架移动，露出了一个隐藏的抽屉。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('古老钥匙')
      store.showToast('获得古老钥匙！')
    },
    options: [
      {
        text: '查看抽屉',
        target: 'open_drawer'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 接水管谜题示例
  'puzzle_pipe': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">接水管谜题</h3>
    <p>请旋转管道，使水流从起点流到终点。</p>
    `,
    pipe: {
      title: '灌溉系统',
      gridSize: { rows: 4, cols: 4 },
      start: { x: 0, y: 0, dir: 'right' },
      end: { x: 3, y: 3 },
      successTarget: 'puzzle_pipe_success',
      failMsg: '管道未连通'
    }
  },
  
  'puzzle_pipe_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管道连通</h3>
    <p>管道成功连通！水流开始流动，植物重新焕发活力。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('魔法种子')
      store.showToast('获得魔法种子！')
    },
    options: [
      {
        text: '种植种子',
        target: 'plant_seed'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 镜面反射谜题示例
  'puzzle_reflection': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜面反射谜题</h3>
    <p>请调整镜子的角度，使光线反射到目标位置。</p>
    `,
    reflection: {
      title: '七色光之路',
      gridSize: { rows: 5, cols: 5 },
      start: { x: 0, y: 2, dir: 'east' },
      targets: [{ x: 4, y: 2, color: 'red' }],
      mirrors: [
        { type: 'double', x: 1, y: 2, rotation: 0 },
        { type: 'double', x: 3, y: 2, rotation: 0 }
      ],
      successTarget: 'puzzle_reflection_success',
      failMsg: '光线未到达目标'
    }
  },
  
  'puzzle_reflection_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光线正确</h3>
    <p>光线成功反射到目标！墙壁上的隐藏门打开了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('光之宝石')
      store.showToast('获得光之宝石！')
    },
    options: [
      {
        text: '进入隐藏门',
        target: 'light_room'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 星盘校准谜题示例
  'puzzle_astrolabe': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">星盘校准谜题</h3>
    <p>请校准星盘到正确的位置。</p>
    `,
    astrolabe: {
      title: '星盘校准',
      markers: [
        { label: '春分', angle: 0 },
        { label: '夏至', angle: 90 },
        { label: '秋分', angle: 180 },
        { label: '冬至', angle: 270 }
      ],
      targetAngle: 45,
      successTarget: 'puzzle_astrolabe_success',
      failMsg: '校准失败'
    }
  },
  
  'puzzle_astrolabe_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">校准成功</h3>
    <p>星盘校准成功！天文台上的望远镜开始自动调整，指向了一颗特殊的星星。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('星象图')
      store.showToast('获得星象图！')
    },
    options: [
      {
        text: '观察星星',
        target: 'observe_stars'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 乐器演奏谜题示例
  'puzzle_instrument': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">乐器演奏谜题</h3>
    <p>请按照正确的顺序弹奏音符。</p>
    `,
    instrument: {
      title: '钢琴演奏',
      keys: [
        { label: 'C' },
        { label: 'D' },
        { label: 'E' },
        { label: 'F' },
        { label: 'G' },
        { label: 'A' },
        { label: 'B' }
      ],
      sequence: ['C', 'E', 'G', 'C', 'E', 'G'],
      successTarget: 'puzzle_instrument_success',
      failMsg: '演奏错误'
    }
  },
  
  'puzzle_instrument_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">演奏成功</h3>
    <p>你的演奏打开了音乐室的暗门，里面有一把魔法小提琴。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('魔法小提琴')
      store.showToast('获得魔法小提琴！')
    },
    options: [
      {
        text: '演奏小提琴',
        target: 'play_violin'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 化学配平谜题示例
  'puzzle_chemistry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">化学配平谜题</h3>
    <p>请选择正确的反应物进行化学反应。</p>
    `,
    chemistry: {
      title: '化学实验',
      elements: [
        { symbol: 'H', name: '氢' },
        { symbol: 'O', name: '氧' },
        { symbol: 'C', name: '碳' },
        { symbol: 'N', name: '氮' }
      ],
      reactions: [
        {
          reactants: ['H', 'O'],
          products: ['H2O'],
          description: '水的合成'
        }
      ],
      successTarget: 'puzzle_chemistry_success',
      failMsg: '配平失败'
    }
  },
  
  'puzzle_chemistry_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">配平成功</h3>
    <p>化学配平成功！实验产生了一种发光的液体。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('发光液体')
      store.showToast('获得发光液体！')
    },
    options: [
      {
        text: '研究液体',
        target: 'study_liquid'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 图形识别谜题示例
  'puzzle_pattern': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">图形识别谜题</h3>
    <p>请找出规律并选择正确的图形。</p>
    `,
    pattern: {
      title: '图形识别',
      grid: [
        { shape: 'circle', color: '#FF6B6B' },
        { shape: 'square', color: '#4ECDC4' },
        { shape: 'triangle', color: '#FFD166' },
        { shape: 'circle', color: '#4ECDC4' },
        { shape: 'square', color: '#FFD166' },
        { shape: 'triangle', color: '#FF6B6B' },
        { shape: 'circle', color: '#FFD166' },
        { shape: 'square', color: '#FF6B6B' },
        null
      ],
      options: [
        { shape: 'triangle', color: '#4ECDC4' },
        { shape: 'circle', color: '#4ECDC4' },
        { shape: 'square', color: '#4ECDC4' },
        { shape: 'triangle', color: '#FFD166' }
      ],
      correctAnswer: 0,
      successTarget: 'puzzle_pattern_success',
      failMsg: '选择错误'
    }
  },
  
  'puzzle_pattern_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">识别成功</h3>
    <p>图形识别正确！墙上的机关被触发，露出了一个宝箱。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('图案之石')
      store.showToast('获得图案之石！')
    },
    options: [
      {
        text: '打开宝箱',
        target: 'open_chest'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  
  // 新场景
  'open_drawer': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">隐藏抽屉</h3>
    <p>你打开了隐藏的抽屉，发现了一些古老的信件。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('信件中提到了一个地下宝藏')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_fifteen_success'
      }
    ]
  },
  
  'plant_seed': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">种植种子</h3>
    <p>你种下了魔法种子，它很快就发芽了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('魔法植物')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_pipe_success'
      }
    ]
  },
  
  'light_room': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光之房间</h3>
    <p>你进入了一个充满光明的房间，里面有一个光之祭坛。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('光明之石')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_reflection_success'
      }
    ]
  },
  
  'observe_stars': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">观察星星</h3>
    <p>你通过望远镜观察星星，发现了一个星座的秘密。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('星座指向了庄园的宝藏位置')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_astrolabe_success'
      }
    ]
  },
  
  'play_violin': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">演奏小提琴</h3>
    <p>你演奏了魔法小提琴，周围的植物开始跳舞。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('音乐之精华')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_instrument_success'
      }
    ]
  },
  
  'study_liquid': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">研究液体</h3>
    <p>你研究了发光液体，发现它有治愈的功效。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('治愈药水')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_chemistry_success'
      }
    ]
  },
  
  'open_chest': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">打开宝箱</h3>
    <p>你打开了宝箱，发现了一些珍贵的宝石。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('珍贵宝石')
    },
    options: [
      {
        text: '返回',
        target: 'puzzle_pattern_success'
      }
    ]
  },
  
  // 镜像谜题
  'puzzle_mirror': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜像谜题</h3>
    <p>你面前有一面古老的镜子，镜面似乎蕴含着某种魔力。</p>
    `,
    options: [
      {
        text: '触摸镜子',
        target: 'puzzle_mirror_touch'
      },
      {
        text: '仔细观察镜子',
        target: 'puzzle_mirror_inspect'
      },
      {
        text: '返回',
        target: 'hall_main'
      }
    ]
  },
  'puzzle_mirror_touch': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">触摸镜子</h3>
    <p>当你触摸镜子时，你感到一股吸力，被吸入了镜子中的世界。</p>
    `,
    options: [
      {
        text: '探索镜中世界',
        target: 'puzzle_mirror_world'
      }
    ]
  },
  'puzzle_mirror_inspect': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">观察镜子</h3>
    <p>你仔细观察镜子，发现镜子上有一些奇怪的符号。这些符号似乎在暗示着什么。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('镜子上的符号暗示着镜像世界')
    },
    options: [
      {
        text: '触摸镜子',
        target: 'puzzle_mirror_touch'
      },
      {
        text: '返回',
        target: 'puzzle_mirror'
      }
    ]
  },
  'puzzle_mirror_world': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜中世界</h3>
    <p>你进入了一个与现实世界镜像对称的世界。这里的一切都是颠倒的。</p>
    <p>你看到一个宝箱，它似乎是打开谜题的关键。</p>
    `,
    options: [
      {
        text: '打开宝箱',
        target: 'puzzle_mirror_chest'
      },
      {
        text: '返回现实世界',
        target: 'puzzle_mirror_return'
      }
    ]
  },
  'puzzle_mirror_chest': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜中宝箱</h3>
    <p>你打开了宝箱，发现里面有一个神秘的物品。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('镜像碎片')
    },
    options: [
      {
        text: '获得奖励',
        target: 'puzzle_mirror_reward'
      }
    ]
  },
  'puzzle_mirror_reward': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜像奖励</h3>
    <p>当你获得镜像碎片时，镜子发出了耀眼的光芒。你感到自己获得了一种特殊的能力。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('镜像之力')
      store.showToast('获得镜像之力！')
    },
    options: [
      {
        text: '返回现实世界',
        target: 'puzzle_mirror_return'
      }
    ]
  },
  'puzzle_mirror_return': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">返回现实</h3>
    <p>你成功返回了现实世界。这次经历让你对镜像的力量有了新的认识。</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'puzzle_mirror_correct': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">正确选择</h3>
    <p>你做出了正确的选择，解开了镜像谜题。镜子的魔力被解除，露出了隐藏的通道。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('mirror_puzzle_solved', true)
    },
    options: [
      {
        text: '进入通道',
        target: 'hidden_room'
      }
    ]
  },
  'puzzle_mirror_magic_reward': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">魔法奖励</h3>
    <p>你获得了镜子的魔法奖励，拥有了能够看到隐藏事物的能力。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('魔法眼镜')
      store.showToast('获得魔法眼镜！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'puzzle_mirror_wrong': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">错误选择</h3>
    <p>你做出了错误的选择，镜子的魔力将你送回了起点。你需要重新思考谜题的解法。</p>
    `,
    options: [
      {
        text: '重新尝试',
        target: 'puzzle_mirror'
      }
    ]
  },
  
  // 数字序列谜题
  'puzzle_number_sequence': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">数字序列谜题</h3>
    <p>你面前有一个数字面板，上面显示着一个序列：1, 4, 2, 8, 5, 7, ?</p>
    <p>你需要输入序列的下一个数字。</p>
    `,
    input: {
      title: '数字序列',
      prompt: '请输入序列的下一个数字',
      placeholder: '输入数字',
      validate: '1',
      successTarget: 'puzzle_number_success',
      failMsg: '数字错误',
      hint: '序列是142857的循环',
      maxAttempts: 3
    }
  },
  'puzzle_number_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">数字序列正确</h3>
    <p>恭喜！你正确解开了数字序列谜题。面板打开，露出了一个隐藏的物品。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('数字密钥')
      store.showToast('获得数字密钥！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  
  // 文字谜语谜题
  'puzzle_word_riddle': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">文字谜语</h3>
    <p>你遇到了一个斯芬克斯式的谜语：</p>
    <p>什么东西早晨四条腿，中午两条腿，晚上三条腿？</p>
    `,
    input: {
      title: '文字谜语',
      prompt: '请输入答案',
      placeholder: '输入答案',
      validate: '人',
      successTarget: 'puzzle_word_success',
      failMsg: '答案错误',
      hint: '这是关于人类的一生',
      maxAttempts: 3
    }
  },
  'puzzle_word_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">谜语正确</h3>
    <p>恭喜！你正确解开了文字谜语。斯芬克斯的雕像移动，露出了一个隐藏的通道。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('riddle_solved', true)
    },
    options: [
      {
        text: '进入通道',
        target: 'hidden_room'
      }
    ]
  },
  
  // 物品组合谜题
  'puzzle_item_combination': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">物品组合</h3>
    <p>你需要将火把和水瓶组合在一起，创造出一种新的物品。</p>
    `,
    combine: {
      title: '物品组合',
      maxItems: 2,
      combinations: {
        '火把,水瓶': '灭火工具'
      },
      successTarget: 'puzzle_combination_success',
      failMsg: '这些物品无法组合'
    }
  },
  'puzzle_combination_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">组合成功</h3>
    <p>你成功将火把和水瓶组合成了灭火工具。这个工具可以用来扑灭前方的火焰。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('灭火工具')
      store.showToast('获得灭火工具！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  
  // 记忆谜题
  'puzzle_memory': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">记忆谜题</h3>
    <p>你需要记住灯光闪烁的顺序并重复它。</p>
    `,
    memory: {
      title: '记忆挑战',
      gridSize: 4,
      maxLevel: 5,
      cellLabels: ['红', '绿', '蓝', '黄'],
      successTarget: 'puzzle_memory_success',
      failMsg: '记忆错误'
    }
  },
  
  // 逻辑谜题
  'puzzle_logic': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">逻辑谜题</h3>
    <p>有三个人：画家、音乐家和作家。他们分别住在不同的房子里，喜欢不同的颜色。</p>
    <p>1. 画家住在红色房子里。</p>
    <p>2. 音乐家不喜欢蓝色。</p>
    <p>3. 作家喜欢绿色。</p>
    <p>请确定每个人的职业和喜欢的颜色。</p>
    `,
    input: {
      title: '逻辑谜题',
      prompt: '请输入答案（格式：画家-颜色, 音乐家-颜色, 作家-颜色）',
      placeholder: '例如：画家-红色, 音乐家-黄色, 作家-绿色',
      validate: '画家-红色, 音乐家-黄色, 作家-绿色',
      successTarget: 'puzzle_logic_success',
      failMsg: '答案错误',
      hint: '根据线索逐一排除',
      maxAttempts: 3
    }
  },
  'puzzle_logic_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">逻辑正确</h3>
    <p>恭喜！你正确解开了逻辑谜题。墙壁上的机关被激活，露出了一个宝箱。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('逻辑之石')
      store.showToast('获得逻辑之石！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  }
}
