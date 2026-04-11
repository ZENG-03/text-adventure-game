import { useGameStore } from '../../../store/gameStore'
import { dynamicDescriptions } from '../../../utils/dynamicDesc'

export default {
  'musicroom_entry': {
    desc: (store) => dynamicDescriptions.musicroom_entry(store),
    on_enter: () => {
      const store = useGameStore()
      store.addClue('音乐室中有一架钢琴和一份未完成的乐谱')
    },
    options: [
      {
        text: '检查钢琴',
        target: 'musicroom_piano'
      },
      {
        text: '查看留声机',
        target: 'musicroom_phonograph'
      },
      {
        text: '查看音乐书籍',
        target: 'musicroom_books'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'musicroom_piano': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">钢琴</h3>
    <p>你走到钢琴前，仔细观察。这是一架精美的三角钢琴，琴身是用深色胡桃木制成的，上面刻着精美的花纹。琴键是用象牙制成的，虽然有些泛黄，但仍然光滑如新。</p>
    <p>钢琴上放着一份未完成的乐谱，标题是"夜莺与紫藤"。乐谱的作者是埃莉诺·布莱克伍德，一位著名的制琴师。乐谱只完成了一半，后面的部分是空白的。</p>
    <p>你注意到乐谱旁边有一张纸条，上面写着："只有真正理解音乐的人才能完成这首交响曲。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('未完成的乐谱')
      store.addClue('埃莉诺·布莱克伍德的乐谱需要完成')
    },
    options: [
      {
        text: '尝试完成乐谱',
        target: 'musicroom_puzzle_notes'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_phonograph': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">留声机</h3>
    <p>你走到留声机前，仔细观察。这是一台古老的留声机，黄铜制成的喇叭上刻着精美的花纹。留声机旁边堆放着一些黑胶唱片，标签都已经泛黄。</p>
    <p>你注意到其中一张唱片的标签上写着"夜莺与紫藤 - 埃莉诺·布莱克伍德"。你小心翼翼地将唱片放到留声机上，转动把手，优美的音乐响了起来。</p>
    <p>音乐中似乎隐藏着某种信息，你仔细聆听，发现旋律中蕴含着一些特殊的音符组合。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('黑胶唱片')
      store.addClue('留声机中的音乐隐藏着特殊的音符组合')
    },
    options: [
      {
        text: '记录音符组合',
        target: 'musicroom_notes'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_books': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音乐书籍</h3>
    <p>你走到书堆前，仔细查看。这些书籍都是关于音乐理论和作曲技巧的，有些书的出版日期可以追溯到19世纪。</p>
    <p>你注意到其中一本书的封面上写着"音乐密码学 - 如何用音符隐藏信息"。你翻开书，发现里面记载着各种用音符隐藏信息的方法。</p>
    <p>书中提到，埃莉诺·布莱克伍德是一位精通音乐密码学的制琴师，她经常在乐谱中隐藏秘密信息。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('音乐密码学书籍')
      store.addClue('埃莉诺·布莱克伍德精通音乐密码学，在乐谱中隐藏秘密信息')
    },
    options: [
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_notes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音符组合</h3>
    <p>你仔细聆听留声机中的音乐，记录下其中的特殊音符组合。音乐中隐藏着一段旋律，似乎是某种密码。</p>
    <p>你拿出"音乐密码学"书籍，对照着书中的方法，开始解读这段旋律。经过一番努力，你终于破解了密码。</p>
    <p>密码揭示了一个重要的线索："旋律徽章隐藏在钢琴的第三个踏板下。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('旋律徽章隐藏在钢琴的第三个踏板下')
    },
    options: [
      {
        text: '检查钢琴踏板',
        target: 'musicroom_pedal'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_pedal': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">钢琴踏板</h3>
    <p>你走到钢琴前，检查第三个踏板。你轻轻踩下踏板，听到一声轻微的"咔哒"声。钢琴的底部弹出了一个小抽屉，里面放着一枚精美的徽章。</p>
    <p>徽章上刻着音符的图案，散发着淡淡的金色光芒。这就是传说中的旋律徽章！</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('旋律徽章')
      store.addMedal()
      store.showToast('获得旋律徽章！')
    },
    options: [
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'musicroom_puzzle_notes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">完成乐谱</h3>
    <p>你坐在钢琴前，仔细研究未完成的乐谱。根据"音乐密码学"书籍中的方法，你开始尝试完成这首交响曲。</p>
    <p>你回忆起留声机中听到的旋律，将那些特殊的音符组合融入到乐谱中。随着你的演奏，音乐逐渐变得完整而优美。</p>
    <p>当你弹完最后一个音符时，钢琴发出了一道耀眼的光芒。一个隐藏的抽屉弹了出来，里面放着一枚徽章和一张纸条。</p>
    <p>纸条上写着："恭喜你，解谜者。你不仅完成了我的交响曲，还证明了你对音乐的理解。这枚翠绿徽章是对你才华的认可。"</p>
    `,
    input: {
      prompt: '请输入正确的音符序列来完成乐谱（提示：聆听留声机中的旋律）',
      placeholder: '例如：do re mi fa sol la si',
      validate: (input) => {
        const sequence = input.toLowerCase().trim()
        return sequence.includes('do') && sequence.includes('sol') && sequence.includes('mi')
      },
      success: 'musicroom_puzzle_success',
      failMsg: '音符序列不正确，请再仔细聆听留声机中的旋律。',
      hints: [
        '提示1：旋律以do开始',
        '提示2：注意sol音的位置',
        '提示3：mi音是关键的转折点'
      ]
    },
    options: [
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_puzzle_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">乐谱完成！</h3>
    <p>你成功地完成了埃莉诺·布莱克伍德的交响曲"夜莺与紫藤"。优美的旋律在房间中回荡，仿佛埃莉诺的灵魂在向你致谢。</p>
    <p>钢琴的隐藏抽屉中，你获得了一枚翠绿徽章，这是对你音乐才华的认可。同时，你还发现了一张埃莉诺的照片，背面写着："谢谢你完成了我的心愿。"</p>
    <p>你感到一种深深的满足感，不仅因为你解开了一个谜题，更因为你帮助了一位已故的艺术家完成了她的遗作。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('翠绿徽章')
      store.addMedal()
      store.addItem('埃莉诺的照片')
      store.setFlag('musicroom_puzzle_completed', true)
      store.setFlag('side_music_completed', true)
      store.triggerFlashback('music_room_complete')
      store.showToast('获得翠绿徽章和埃莉诺的照片！')
    },
    options: [
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'musicroom_piano_tuning_pins': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">钢琴调音</h3>
    <p>你注意到钢琴的调音针有些松动，钢琴的音准受到了影响。你决定尝试调音。</p>
    <p>你需要调整钢琴的调音针，使每个键都发出正确的音高。</p>
    `,
    options: [
      {
        text: '使用音叉调音',
        target: 'musicroom_tune_with_forks'
      },
      {
        text: '凭耳朵调音',
        target: 'musicroom_tune_by_ear'
      },
      {
        text: '返回钢琴',
        target: 'musicroom_piano'
      }
    ]
  },
  'musicroom_tune_with_forks': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音叉调音</h3>
    <p>你使用音叉来调音。音叉发出标准的A音，你以此为基准调整钢琴的各个键。</p>
    <p>经过一番努力，你成功地调整了钢琴的音准。当你弹奏时，钢琴发出了悦耳的声音。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('钢琴调音成功，现在可以演奏完整的乐谱')
    },
    options: [
      {
        text: '尝试演奏完整乐谱',
        target: 'musicroom_play_full_score'
      },
      {
        text: '返回钢琴',
        target: 'musicroom_piano'
      }
    ]
  },

  'musicroom_fill_score': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">补全乐谱</h3>
    <p>你决定补全埃莉诺·布莱克伍德的未完成乐谱。你根据乐谱的风格和主题，尝试创作缺失的部分。</p>
    <p>你沉浸在音乐创作中，仿佛与埃莉诺的灵魂交流。经过一番努力，你终于完成了乐谱的创作。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('完成的乐谱')
      store.addClue('乐谱补全成功，现在可以演奏完整的交响曲')
    },
    options: [
      {
        text: '演奏完整乐谱',
        target: 'musicroom_play_full_score'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_ensemble': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">合奏</h3>
    <p>你注意到音乐室里有各种乐器，你决定尝试合奏。你选择了几种乐器，尝试演奏同一首曲子。</p>
    <p>你还发现了一个自动演奏机，它可以模拟各种乐器的声音。</p>
    `,
    options: [
      {
        text: '使用自动演奏机',
        target: 'musicroom_autoplayer'
      },
      {
        text: '自己演奏多种乐器',
        target: 'musicroom_play_ensemble'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },

  'musicroom_play_ensemble': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">演奏合奏</h3>
    <p>你尝试自己演奏多种乐器，虽然这很有挑战性，但你还是成功地完成了一首简单的合奏。</p>
    <p>你的演奏吸引了庄园里的其他人，他们来到音乐室聆听你的表演。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('你的合奏表演吸引了庄园里的其他人')
    },
    options: [
      {
        text: '返回合奏',
        target: 'musicroom_ensemble'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_reflectors': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">反射板</h3>
    <p>你注意到音乐室的墙壁上有一些反射板，它们可以反射声音。你意识到这些反射板可能与音乐的传播有关。</p>
    <p>你决定调整反射板的角度，以获得最佳的音响效果。</p>
    `,
    options: [
      {
        text: '调整反射板',
        target: 'musicroom_adjust_reflectors'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_adjust_reflectors': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调整反射板</h3>
    <p>你调整了反射板的角度，使声音在房间中形成了完美的共鸣。当你弹奏钢琴时，音乐在房间中回荡，形成了一种环绕立体声的效果。</p>
    <p>当你调整完最后一个反射板时，墙壁上的一个隐藏面板打开了，里面放着一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('共鸣徽章')
      store.addMedal()
      store.showToast('获得共鸣徽章！')
    },
    options: [
      {
        text: '返回反射板',
        target: 'musicroom_reflectors'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_resonance': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音叉共鸣</h3>
    <p>你使用音叉来激发乐器的共鸣。当你敲击音叉时，它发出的声音会使某些乐器产生共鸣。</p>
    <p>你发现不同的音叉会使不同的乐器产生共鸣，形成了一种独特的音乐效果。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('音叉共鸣可以激发乐器的声音')
    },
    options: [
      {
        text: '尝试不同的音叉',
        target: 'musicroom_try_forks'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_try_forks': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">尝试音叉</h3>
    <p>你尝试了不同的音叉，发现它们会使不同的乐器产生共鸣。当你使用一个特殊的音叉时，钢琴开始自动演奏起来！</p>
    <p>钢琴演奏了埃莉诺的交响曲，当音乐结束时，钢琴的顶部弹出了一枚徽章。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('共鸣徽章')
      store.addMedal()
      store.showToast('获得共鸣徽章！')
    },
    options: [
      {
        text: '返回音叉共鸣',
        target: 'musicroom_resonance'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_play_full_score': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">演奏完整乐谱</h3>
    <p>你坐在钢琴前，开始演奏完整的乐谱。优美的旋律在房间中回荡，仿佛埃莉诺的灵魂在与你一起演奏。</p>
    <p>当你弹完最后一个音符时，整个音乐室开始发光，一个隐藏的空间出现在墙壁上。空间里放着一枚徽章和一张纸条。</p>
    <p>纸条上写着："恭喜你完成了我的交响曲。这枚音乐徽章是对你音乐才华的最高认可。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('音乐徽章')
      store.addMedal()
      store.showToast('获得音乐徽章！')
    },
    options: [
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'musicroom_deafening': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;"> deafening 声音</h3>
    <p>你不小心触碰到了一个机关，音乐室突然发出了震耳欲聋的声音。声音如此之大，你感到耳朵疼痛难忍。</p>
    <p>你意识到这是一个陷阱，必须尽快找到关闭声音的方法。</p>
    `,
    options: [
      {
        text: '寻找关闭声音的机关',
        target: 'musicroom_collapse'
      },
      {
        text: '捂住耳朵逃离',
        target: 'musicroom_escape'
      }
    ]
  },
  'musicroom_collapse': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音乐室崩溃</h3>
    <p>你试图寻找关闭声音的机关，但声音越来越大，最终导致音乐室的墙壁开始崩溃。你不得不逃离音乐室，以免被倒塌的墙壁砸伤。</p>
    <p>当你跑出音乐室时，身后传来了巨大的倒塌声。音乐室已经变成了一片废墟。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('musicroom_destroyed', true)
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'musicroom_escape': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">逃离音乐室</h3>
    <p>你捂住耳朵，快速逃离了音乐室。当你关上门时，声音被隔绝在了房间内。</p>
    <p>你感到耳朵嗡嗡作响，需要一段时间才能恢复。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('音乐室中有危险的声音陷阱')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'musicroom_organ': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管风琴</h3>
    <p>你走到管风琴前，仔细观察。这是一架巨大的管风琴，有多层键盘和许多音管。管风琴的表面刻着精美的花纹，看起来非常古老。</p>
    <p>你注意到管风琴的键盘上缺少一些键帽，音管也有一些损坏。</p>
    `,
    options: [
      {
        text: '放置键帽',
        target: 'musicroom_place_keycaps'
      },
      {
        text: '检查音管',
        target: 'musicroom_inside'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_place_keycaps': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">放置键帽</h3>
    <p>你尝试将键帽放在管风琴的键盘上，但发现它们无法固定。你需要先解锁键盘。</p>
    `,
    options: [
      {
        text: '寻找解锁方法',
        target: 'musicroom_entry'
      },
      {
        text: '返回管风琴',
        target: 'musicroom_organ'
      }
    ]
  },
  'musicroom_use_gear': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用齿轮</h3>
    <p>你将机械齿轮嵌入管风琴的内部，齿轮开始转动，管风琴发出了低沉的声音。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('organ_gear_installed', true)
    },
    options: [
      {
        text: '返回管风琴',
        target: 'musicroom_organ'
      }
    ]
  },
  'musicroom_place_keycaps_unlocked': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">解锁后放置键帽</h3>
    <p>现在键盘已经解锁，你成功地将键帽放在了管风琴的键盘上。管风琴发出了悦耳的声音。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('keycaps_placed', true)
    },
    options: [
      {
        text: '尝试演奏管风琴',
        target: 'musicroom_play_organ'
      },
      {
        text: '返回管风琴',
        target: 'musicroom_organ'
      }
    ]
  },
  'musicroom_bellows': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">鼓风机</h3>
    <p>你走到管风琴的鼓风机前，开始摇动鼓风机的手柄。鼓风机开始向管风琴的音管输送空气。</p>
    `,
    options: [
      {
        text: '固定鼓风机手柄',
        target: 'musicroom_lock_bellows'
      },
      {
        text: '返回管风琴',
        target: 'musicroom_organ'
      }
    ]
  },
  'musicroom_lock_bellows': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">固定鼓风机</h3>
    <p>你固定了鼓风机的手柄，使它能够持续向管风琴输送空气。现在管风琴可以正常工作了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('bellows_locked', true)
    },
    options: [
      {
        text: '返回管风琴',
        target: 'musicroom_organ'
      }
    ]
  },
  'musicroom_connect_power': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">连接钟楼动力</h3>
    <p>你将管风琴与钟楼的动力系统连接起来，管风琴获得了持续的动力。现在它可以自动演奏了。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('power_connected', true)
    },
    options: [
      {
        text: '返回管风琴',
        target: 'musicroom_organ'
      }
    ]
  },
  'musicroom_tuning_pins': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调音钉</h3>
    <p>你检查了钢琴的调音钉，发现它们有些松动。你需要调整这些调音钉来校准钢琴的音高。</p>
    `,
    options: [
      {
        text: '开始调音',
        target: 'musicroom_tune_piano'
      },
      {
        text: '返回钢琴',
        target: 'musicroom_piano'
      }
    ]
  },
  'musicroom_tune_piano': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">调音</h3>
    <p>你开始调整钢琴的调音钉，校准每个键的音高。这是一项需要耐心和精确的工作。</p>
    `,
    options: [
      {
        text: '使用音叉校准',
        target: 'musicroom_tune_with_forks'
      },
      {
        text: '凭听觉调音',
        target: 'musicroom_tune_by_ear'
      },
      {
        text: '返回钢琴',
        target: 'musicroom_piano'
      }
    ]
  },
  'musicroom_instruments': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">展柜乐器</h3>
    <p>你走到展柜前，仔细观察里面的乐器。展柜里有小提琴、中提琴、大提琴、长笛、单簧管等各种乐器。</p>
    `,
    options: [
      {
        text: '取出小提琴',
        target: 'musicroom_violin'
      },
      {
        text: '检查乐器摆放顺序',
        target: 'musicroom_instrument_order'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_violin': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">小提琴</h3>
    <p>你从展柜中取出小提琴，仔细观察。这是一把精美的小提琴，琴身是用优质的木材制成的，上面刻着精美的花纹。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('小提琴')
    },
    options: [
      {
        text: '返回展柜',
        target: 'musicroom_instruments'
      }
    ]
  },

  'musicroom_tuning_forks': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音叉架</h3>
    <p>你走到音叉架前，看到上面放着各种音叉。这些音叉可以用来校准乐器的音高。</p>
    `,
    options: [
      {
        text: '使用音叉',
        target: 'musicroom_resonance'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },

  'musicroom_painting': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">乐队油画</h3>
    <p>你走到乐队油画前，仔细观察。油画描绘了一支交响乐队在演奏，画面非常生动。</p>
    <p>你注意到油画中的乐器摆放顺序与展柜中的乐器摆放顺序有关。</p>
    `,
    options: [
      {
        text: '返回展柜',
        target: 'musicroom_instruments'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'musicroom_use_crystal': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用共鸣水晶</h3>
    <p>你使用共鸣水晶来快速校准乐器。水晶发出的声音与乐器产生共鸣，帮助你快速调整音高。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('instruments_tuned', true)
    },
    options: [
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },







  'musicroom_search_crystal': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找共鸣水晶</h3>
    <p>你在音乐室的每个角落寻找共鸣水晶：翻遍了钢琴、管风琴、展柜、甚至壁炉。只找到了一些玻璃弹珠和水晶杯，它们敲击时声音浑浊，不是你要找的。也许共鸣水晶在其他房间——比如画室或温室。</p>
    `,
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_autoplayer': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">自动演奏机</h3>
    <p>自动演奏机是一个复杂的机械装置，七个小木偶各持一件乐器，发条已经松弛。你需要给每个木偶上发条，并按正确的顺序启动它们。演奏机侧面有一块铜牌，刻着："顺序藏于乐谱，错一则音律崩坏。"</p>
    `,
    options: [
      { text: '检查周围乐谱寻找顺序', target: 'musicroom_find_score_parts' },
      { text: '随便乱按', target: 'hall_injured' },
      { text: '离开自动演奏机', target: 'musicroom_entry' }
    ]
  },
  'musicroom_copy_score': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">抄录乐谱</h3>
    <p>你尝试用桌上的羽毛笔和墨水抄写乐谱，但墨水已经干涸成块，纸张也脆得快要碎裂。你放弃了抄写，转而用手机拍照（如果有）。但手机在庄园里信号微弱，照片模糊。你需要找到原始的完整乐谱。</p>
    `,
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_find_score_parts': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找乐谱碎片</h3>
    <p>你在钢琴凳的夹层、管风琴的音管里、以及小提琴的琴盒中找到了三张撕碎的乐谱残页。将它们拼在一起，是一首三重奏的片段：大号、小提琴、定音鼓。乐谱边缘写着："第七乐章隐藏于此。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('三重奏乐谱：大号、小提琴、定音鼓')
    },
    options: [
      { text: '按乐谱指示开始演奏', target: 'musicroom_play_instruments_order' },
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_inside': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管风琴内部</h3>
    <p>你爬进管风琴内部，狭窄的空间里布满了音管和联动杆。音管上贴着标签，标注着音高和对应的键帽。你发现一根音管的底部有一个小暗格，里面放着一枚备用的音叉——音叉上刻着"E♭"，这是埃莉诺的调音偏好。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('备用音叉')
    },
    options: [
      { text: '返回管风琴前', target: 'musicroom_organ' },
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_inspect': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">检查展柜乐器</h3>
    <p>你仔细检查展柜里的每件乐器。小提琴的琴身背面有一行极小的刻字："埃莉诺·布莱克伍德，1888。" 中提琴的琴头雕刻着一只夜莺，大提琴的侧板上有一个微弱的字母"E"。这些标记证实了它们都是埃莉诺亲手制作的。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('乐器上的夜莺标记证实埃莉诺制作')
    },
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_instrument_order': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">乐器摆放顺序</h3>
    <p>你尝试将乐器按大小排列，但什么也没发生。你想起乐队油画中的乐器位置——小提琴在前排，中提琴在右侧，大提琴在左侧，低音提琴在后排。也许需要按照乐队布局来摆放，而不是单纯的大小顺序。</p>
    `,
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_order_by_score': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">按乐谱顺序放置键帽</h3>
    <p>你将七枚键帽按照《七重奏鸣曲》的乐章顺序（水、火、土、气、光、暗、生命）放在对应的音栓上。但音栓仍然锁死，因为气流还未激活。你需要先启动鼓风机。</p>
    `,
    options: [
      { text: '返回管风琴', target: 'musicroom_organ' },
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_play_instruments_order': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">奏响乐器</h3>
    <p>你按照三重奏乐谱的顺序，依次拉响大号、小提琴和定音鼓前的木偶发条。木偶开始机械地演奏，当最后一个音符落下时，演奏机侧面的暗门弹开，里面放着一枚【金色徽章】和一张纸条："埃莉诺的祝福，赠予知音。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('金色徽章')
      store.addMedal()
      store.showToast('获得金色徽章！')
    },
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_play_organ': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">试弹管风琴</h3>
    <p>你坐到管风琴前，试着按下琴键。音管发出微弱的"呼呼"声，但没有旋律——因为鼓风机没有提供足够的气流。你需要先摇动鼓风机手柄，或者用其他方式产生风压。</p>
    `,
    options: [
      { text: '返回管风琴', target: 'musicroom_organ' },
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_reflector_ropes': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">反射板绳索</h3>
    <p>天花板的反射板通过一组滑轮和绳索控制。你拉动绳索，反射板的角度改变，声音的聚焦点也随之移动。但绳索已经老化，你一用力就断了一根。反射板卡在半空，无法再调节。你需要找到备用绳索或放弃调节。</p>
    `,
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'musicroom_tune_by_ear': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">凭听觉调音</h3>
    <p>你凭听觉尝试调音，但钢琴的琴弦已经多年未校准，音高偏离严重。你调了半天，弹出来的还是刺耳的不和谐音。你需要音叉作为参考。</p>
    `,
    options: [
      { text: '返回三角钢琴', target: 'musicroom_piano' },
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  }
}
