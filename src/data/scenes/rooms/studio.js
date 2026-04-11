import { useGameStore } from '../../../store/gameStore'
import { dynamicDescriptions } from '../../../utils/dynamicDesc'
import { checkEasterEgg, validateWithEasterEgg } from '../../../utils/easterEggHelper'

export default {
  'studio_entry': {
    desc: (store) => dynamicDescriptions.studio_entry(store),
    on_enter: () => {
      const store = useGameStore()
      store.addClue('画室中有一个箱子，需要懂得色彩才能打开')
    },
    options: [
      {
        text: '查看未完成的画作',
        target: 'studio_painting'
      },
      {
        text: '尝试打开箱子',
        target: 'studio_puzzle_colors'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'studio_painting': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">未完成的画作</h3>
    <p>你走到画架前，仔细观察这幅未完成的画作。画布上只勾勒出了一些线条，似乎是一位女子的肖像画。</p>
    <p>你注意到画架旁边有一些颜料和画笔，还有一张纸条。纸条上写着："完成这幅画，你将获得色彩的认可。"</p>
    <p>你仔细观察线条，发现画中的女子有着金色的长发和蓝色的眼睛，她的表情带着一丝忧伤。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('需要完成画架上的肖像画')
    },
    options: [
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_puzzle_colors': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">色彩谜题</h3>
    <p>你站在箱子前，仔细观察上面的符号。这些符号代表着七种颜色：红、橙、黄、绿、蓝、靛、紫。</p>
    <p>箱子旁边有一张纸条，上面写着："按照彩虹的颜色顺序排列，从外到内。"</p>
    <p>你需要按照正确的顺序点击颜色符号，才能打开这个箱子。</p>
    `,
    input: {
      prompt: '请输入颜色的正确顺序（用逗号分隔，例如：红,橙,黄,绿,蓝,靛,紫）',
      placeholder: '例如：红,橙,黄,绿,蓝,靛,紫',
      validate: (input) => {
        const sequence = input.toLowerCase().replace(/\s/g, '')
        return sequence === '红,橙,黄,绿,蓝,靛,紫'
      },
      success: 'studio_puzzle_success',
      failMsg: '顺序不正确，请再仔细思考彩虹的颜色顺序。',
      hints: [
        '提示1：彩虹的最外层是红色',
        '提示2：彩虹的最内层是紫色',
        '提示3：中间的颜色是绿、蓝、靛'
      ]
    },
    options: [
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_puzzle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">箱子打开</h3>
    <p>你按照正确的顺序点击了颜色符号，听到一声轻微的"咔哒"声，箱子缓缓打开了。</p>
    <p>箱子里面放着一枚徽章和一些绘画工具。徽章上刻着彩虹的图案，散发着淡淡的橙色光芒。这就是传说中的色彩徽章！</p>
    <p>你同时还发现了一些珍贵的颜料，包括一种你从未见过的金色颜料。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('色彩徽章')
      store.addMedal()
      store.addItem('金色颜料')
      store.setFlag('studio_puzzle_completed', true)
      store.showToast('获得色彩徽章和金色颜料！')
    },
    options: [
      {
        text: '返回画室',
        target: 'studio_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'studio_palette': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调色板</h3>
    <p>你走到画室的一角，发现了一个巨大的调色板。调色板上有各种颜色的颜料，有些已经干涸，有些还是湿润的。</p>
    <p>你注意到调色板的底部有一些管道，似乎与某种装置相连。</p>
    `,
    options: [
      {
        text: '检查调色板管道',
        target: 'studio_palette_pipes'
      },
      {
        text: '添加水到颜料',
        target: 'studio_add_water'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_palette_pipes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调色板管道</h3>
    <p>你仔细检查了调色板底部的管道，发现它们连接到一个隐藏的水源。当你转动管道上的阀门时，水流开始流动，湿润了干涸的颜料。</p>
    <p>随着水流的流动，调色板上的颜料开始混合，形成了一种新的颜色。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('调色板的管道连接到隐藏的水源')
    },
    options: [
      {
        text: '返回调色板',
        target: 'studio_palette'
      }
    ]
  },
  'studio_add_water': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">添加水</h3>
    <p>你试图添加水到颜料中，但发现画室里没有水源。你需要找到一种溶剂来湿润颜料。</p>
    `,
    options: [
      {
        text: '寻找溶剂',
        target: 'studio_find_solvent'
      },
      {
        text: '返回调色板',
        target: 'studio_palette'
      }
    ]
  },
  'studio_find_solvent': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找溶剂</h3>
    <p>你在画室中寻找溶剂，最终在一个柜子里找到了一瓶松节油。这是一种常用的绘画溶剂，可以用来稀释颜料。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('松节油')
    },
    options: [
      {
        text: '返回添加水',
        target: 'studio_add_water'
      }
    ]
  },
  'studio_stained_glass': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">彩色玻璃窗</h3>
    <p>你注意到画室的窗户是彩色玻璃制成的。阳光透过彩色玻璃洒进来，在墙上形成了斑斓的光影。</p>
    <p>你发现光影的位置随着时间的推移而变化，似乎在墙上形成了某种图案。</p>
    `,
    options: [
      {
        text: '用调色板捕捉光线',
        target: 'studio_light_palette'
      },
      {
        text: '用镜子反射光线',
        target: 'studio_light_mirror'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_light_palette': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光线调色板</h3>
    <p>你将调色板放在光影的位置，捕捉到了彩色的光线。调色板上的颜料开始发光，形成了一种独特的色彩组合。</p>
    <p>当所有颜色都被激活时，调色板的中心出现了一个隐藏的空间，里面放着一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('光徽章')
      store.addMedal()
      store.showToast('获得光徽章！')
    },
    options: [
      {
        text: '返回彩色玻璃窗',
        target: 'studio_stained_glass'
      }
    ]
  },
  'studio_light_mirror': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光线反射</h3>
    <p>你用镜子反射彩色玻璃窗的光线，将光线聚焦到画室的一个角落。光线照射的地方出现了一个隐藏的开关。</p>
    <p>当你按下开关时，墙壁上出现了一个暗门。</p>
    `,
    options: [
      {
        text: '进入暗门',
        target: 'studio_secret_room'
      },
      {
        text: '返回彩色玻璃窗',
        target: 'studio_stained_glass'
      }
    ]
  },
  'studio_secret_room': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">秘密房间</h3>
    <p>你进入了暗门后的秘密房间。房间里有一个画架，上面放着一幅完成的肖像画。画中的女子有着金色的长发和蓝色的眼睛，她的表情带着一丝忧伤。</p>
    <p>画架旁边有一个小盒子，里面放着一枚徽章和一本绘画笔记。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('艺术徽章')
      store.addMedal()
      store.addItem('绘画笔记')
      store.showToast('获得艺术徽章和绘画笔记！')
    },
    options: [
      {
        text: '返回彩色玻璃窗',
        target: 'studio_stained_glass'
      }
    ]
  },
  'studio_portrait': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">肖像画</h3>
    <p>你仔细观察画室里的肖像画。画中的女子有着金色的长发和蓝色的眼睛，她的表情带着一丝忧伤。</p>
    <p>你注意到肖像画的眼睛部分有一些奇怪的凸起，似乎是镶嵌着宝石。</p>
    `,
    options: [
      {
        text: '按压宝石',
        target: 'studio_press_gems'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_press_gems': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">按压宝石</h3>
    <p>你按压了肖像画眼睛上的宝石，听到一声轻微的"咔哒"声。肖像画的框架打开了，露出了一个隐藏的空间。</p>
    <p>空间里放着一枚徽章和一张纸条。纸条上写着："只有真正懂得艺术的人才能发现这个秘密。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('肖像徽章')
      store.addMedal()
      store.showToast('获得肖像徽章！')
    },
    options: [
      {
        text: '返回肖像画',
        target: 'studio_portrait'
      }
    ]
  },
  'studio_gem_wrong': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">错误的宝石</h3>
    <p>你按压了肖像画眼睛上的宝石，但按错了顺序。肖像画的框架突然弹出，吓了你一跳。</p>
    <p>你注意到框架上有一个警告："只有正确的顺序才能打开。"</p>
    `,
    options: [
      {
        text: '再次尝试',
        target: 'studio_press_gems'
      },
      {
        text: '返回肖像画',
        target: 'studio_portrait'
      }
    ]
  },
  'studio_paint_mirror': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">在镜子上作画</h3>
    <p>你在画室的镜子上作画，使用金色颜料画出了一幅美丽的图案。当你完成画作时，镜子开始发光，显示出一个隐藏的信息。</p>
    <p>信息指引你找到了一个隐藏的宝藏，里面放着一枚徽章和一些珍贵的绘画工具。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('镜子徽章')
      store.addMedal()
      store.addItem('高级绘画工具')
      store.showToast('获得镜子徽章和高级绘画工具！')
    },
    options: [
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_fixative': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">固定剂</h3>
    <p>你需要一种固定剂来保护你的画作。固定剂可以防止颜料脱落，使画作更加持久。</p>
    `,
    options: [
      {
        text: '寻找管道源头',
        target: 'studio_pipe_source'
      },
      {
        text: '研磨石头',
        target: 'studio_grind_stones'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_pipe_source': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管道源头</h3>
    <p>你找到了管道的源头，发现它连接到一个隐藏的地下室。地下室里有一个蒸馏装置，可以用来制作固定剂。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('固定剂')
    },
    options: [
      {
        text: '返回固定剂',
        target: 'studio_fixative'
      }
    ]
  },
  'studio_grind_stones': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">研磨石头</h3>
    <p>你研磨了一些特殊的石头，得到了一种粉末。这种粉末可以作为固定剂的替代品。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('石头粉末')
    },
    options: [
      {
        text: '返回固定剂',
        target: 'studio_fixative'
      }
    ]
  },
  'studio_poison_pigment': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">毒颜料</h3>
    <p>你不小心使用了一种有毒的颜料。颜料散发出刺鼻的气味，你感到头晕目眩。</p>
    `,
    options: [
      {
        text: '寻找解毒剂',
        target: 'studio_find_antidote'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_glass_shard': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">玻璃碎片</h3>
    <p>你在画室中不小心打碎了一块玻璃，碎片划伤了你的手。你需要处理伤口。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('injured', true)
    },
    options: [
      {
        text: '处理伤口',
        target: 'studio_treat_wound'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_mirror_trap': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜子陷阱</h3>
    <p>你在镜子前观察自己时，镜子突然开始发光，产生了强烈的光线。你感到眼睛刺痛，无法睁开。</p>
    `,
    options: [
      {
        text: '遮挡光线',
        target: 'studio_block_light'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_find_antidote': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找解毒剂</h3>
    <p>你在画室中寻找解毒剂，最终在一个药箱中找到了一瓶解毒药。你服用了解毒药，毒性逐渐消失。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('poisoned', false)
      store.addClue('有些颜料是有毒的，需要小心')
    },
    options: [
      {
        text: '返回毒颜料',
        target: 'studio_poison_pigment'
      }
    ]
  },
  'studio_treat_wound': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">处理伤口</h3>
    <p>你用清水冲洗了伤口，然后用绷带包扎。伤口的疼痛逐渐减轻。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('injured', false)
      store.addClue('玻璃碎片很锋利，需要小心')
    },
    options: [
      {
        text: '返回玻璃碎片',
        target: 'studio_glass_shard'
      }
    ]
  },
  'studio_block_light': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">遮挡光线</h3>
    <p>你用衣服遮挡了强烈的光线，眼睛的刺痛感逐渐消失。当你再次睁开眼睛时，镜子已经恢复了正常。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('镜子可能会产生强光，需要小心')
    },
    options: [
      {
        text: '返回镜子陷阱',
        target: 'studio_mirror_trap'
      }
    ]
  },
  'studio_arrange_stones': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">排列矿石</h3>
    <p>你在雕塑台上看到一些彩色矿石，需要按照正确的顺序排列它们。</p>
    `,
    options: [
      {
        text: '按照彩虹顺序排列',
        target: 'studio_gem_correct'
      },
      {
        text: '随意排列',
        target: 'studio_gem_wrong'
      },
      {
        text: '返回雕塑台',
        target: 'studio_sculpture'
      }
    ]
  },
  'studio_rotate_scale': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">旋转刻度盘</h3>
    <p>你看到雕塑台上有一个刻度盘，需要旋转到正确的位置。</p>
    `,
    options: [
      {
        text: '旋转到红色刻度',
        target: 'studio_palette_active'
      },
      {
        text: '旋转到蓝色刻度',
        target: 'studio_palette_active'
      },
      {
        text: '返回雕塑台',
        target: 'studio_sculpture'
      }
    ]
  },
  'studio_palette_active': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调色板激活</h3>
    <p>调色板被激活，开始发光。颜料开始自动混合，形成了一种特殊的颜色。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('palette_activated', true)
    },
    options: [
      {
        text: '混合颜料',
        target: 'studio_mix'
      },
      {
        text: '返回调色板',
        target: 'studio_palette'
      }
    ]
  },
  'studio_cabinet': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">颜料柜</h3>
    <p>你看到画室中有一个颜料柜，里面存放着各种颜料。</p>
    `,
    options: [
      {
        text: '打开颜料柜',
        target: 'studio_cabinet_open'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_password_drawer': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">密码抽屉</h3>
    <p>你看到颜料柜中有一个密码抽屉，需要输入正确的密码才能打开。</p>
    `,
    input: {
      prompt: '请输入密码抽屉的密码',
      placeholder: '输入密码',
      validate: (ans, store) => {
        // 正常密码
        if (ans === '777') return 'normal';
        // 检查彩蛋
        const eggResult = validateWithEasterEgg(ans, store);
        if (eggResult) return eggResult;
        return false;
      },
      onSuccess: (ans, store, result) => {
        if (result === 'normal') {
          // 正常跳转
          return 'studio_drawer_opened';
        } else {
          // 彩蛋触发
          checkEasterEgg(ans, store);
          // 彩蛋后仍允许正常继续
          return 'studio_drawer_opened';
        }
      },
      failMsg: '密码错误',
      hints: [
        '提示1：密码与颜色有关',
        '提示2：密码是一个三位数',
        '提示3：密码与彩虹的颜色数量有关'
      ]
    },
    options: [
      {
        text: '返回颜料柜',
        target: 'studio_cabinet'
      }
    ]
  },
  'studio_drawer_opened': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">抽屉打开</h3>
    <p>你输入了正确的密码，抽屉打开了。里面放着一些珍贵的颜料和一张纸条。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('珍贵颜料')
    },
    options: [
      {
        text: '返回颜料柜',
        target: 'studio_cabinet'
      }
    ]
  },
  'studio_sculpture': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">雕塑台</h3>
    <p>你看到画室中有一个雕塑台，上面放着一些工具和矿石。</p>
    `,
    options: [
      {
        text: '排列矿石',
        target: 'studio_arrange_stones'
      },
      {
        text: '旋转刻度盘',
        target: 'studio_rotate_scale'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_gem_correct': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">正确顺序</h3>
    <p>你按照正确的顺序排列了矿石，雕塑台发出了耀眼的光芒。一个隐藏的抽屉打开了，里面放着一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('矿石徽章')
      store.addMedal()
      store.setFlag('side_painting_completed', true)
      store.triggerFlashback('studio_painting_complete')
      store.showToast('获得矿石徽章！')
    },
    options: [
      {
        text: '返回雕塑台',
        target: 'studio_sculpture'
      }
    ]
  },
  'studio_paint_mirror_fix': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">镜中门</h3>
    <p>你在镜子上作画后，镜子开始发光，出现了一扇通往另一个空间的门。</p>
    `,
    options: [
      {
        text: '穿过镜中门',
        target: 'studio_paint_portrait'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_paint_portrait': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">黑白异空间</h3>
    <p>你穿过镜中门，进入了一个黑白的异空间。这里的一切都是黑白的，只有你手中的颜料是彩色的。你需要为这里的世界上色。</p>
    `,
    options: [
      {
        text: '为世界上色',
        target: 'studio_entry'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_mix': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">混合颜料</h3>
    <p>你混合了调色板上的颜料，形成了一种彩虹色的颜料。当你完成时，调色板的中心出现了一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('彩虹徽章')
      store.addMedal()
      store.showToast('获得彩虹徽章！')
    },
    options: [
      {
        text: '返回调色板',
        target: 'studio_palette'
      }
    ]
  },
  'studio_cabinet_open': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">打开颜料柜</h3>
    <p>你打开了颜料柜，里面存放着各种颜色的颜料。你看到了一些你从未见过的特殊颜料。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('特殊颜料')
    },
    options: [
      {
        text: '打开密码抽屉',
        target: 'studio_password_drawer'
      },
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_sketches': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">查看草稿</h3>
    <p>你看到画室中有一些素描草稿，上面画着各种人物和场景。这些草稿似乎是画家的创作灵感。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('草稿中包含画家的创作灵感')
    },
    options: [
      {
        text: '返回画室',
        target: 'studio_entry'
      }
    ]
  },
  'studio_water_tank': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">洗笔水槽</h3>
    <p>你走近画室角落里废弃的洗笔水槽。水槽中积满了一层浑浊的、散发着刺鼻化学气味的暗色液体。借着微弱的光线，你注意到水底似乎沉着一块刻着符号的奇怪薄片。</p>
    `,
    options: [
      { text: '强忍不适，伸手摸索水底的物品', target: 'studio_water_tank_success' },
      { text: '还是不要随意触碰不明化学液体了', target: 'studio_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'studio_water_tank_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">捞出的物品</h3>
    <p>你将手伸入冰冷刺骨且粘稠的洗笔水中，摸索了片刻，捞出了一块【沾满颜料的调色刮刀】。刮刀的柄上刻着一个小小的“E”字（代表埃莉诺）。这也是画室主人生前常用的工具之一。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('沾满颜料的调色刮刀')
      store.showToast('获得调色刮刀！')
    },
    options: [
      { text: '返回画室中心', target: 'studio_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  }
}
