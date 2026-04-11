import { useGameStore } from '../../store/gameStore'

export default {
  'side_story_1_start': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>支线任务：神秘的地窖</h3><p>你在庄园的角落里发现了一个隐藏的地窖入口。入口被一块大石头挡住了，你需要想办法移开它。</p>',
    options: [
      {
        text: '尝试移开石头',
        target: 'side_story_1_move_rock'
      },
      {
        text: '寻找工具',
        target: 'side_story_1_find_tool'
      },
      {
        text: '放弃探索',
        target: 'hall_main'
      }
    ]
  },
  'side_story_1_move_rock': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>移开石头</h3><p>你尝试移开挡住地窖入口的石头。经过一番努力，你成功地将石头移开了，露出了下面的地窖入口。</p>',
    options: [
      {
        text: '进入地窖',
        target: 'side_story_1_enter_cellar'
      }
    ]
  },
  'side_story_1_find_tool': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>寻找工具</h3><p>你在庄园里寻找可以用来移开石头的工具。最终，你在花园的工具棚里找到了一把铁铲。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('铁铲')
    },
    options: [
      {
        text: '返回移开石头',
        target: 'side_story_1_move_rock'
      }
    ]
  },
  'side_story_1_enter_cellar': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>进入地窖</h3><p>你进入了地窖。地窖里阴暗潮湿，空气中弥漫着一股霉味。墙壁上挂着一些古老的工具和物品。</p><p>你注意到地窖的一角有一个箱子，上面有一个锁。</p>',
    options: [
      {
        text: '检查箱子',
        target: 'side_story_1_check_box'
      },
      {
        text: '探索地窖',
        target: 'side_story_1_explore_cellar'
      },
      {
        text: '返回地面',
        target: 'side_story_1_start'
      }
    ]
  },
  'side_story_1_check_box': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>检查箱子</h3><p>你检查了地窖里的箱子。箱子上有一个复杂的锁，需要找到钥匙才能打开。</p>',
    options: [
      {
        text: '寻找钥匙',
        target: 'side_story_1_find_key'
      },
      {
        text: '返回探索地窖',
        target: 'side_story_1_explore_cellar'
      }
    ]
  },
  'side_story_1_explore_cellar': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>探索地窖</h3><p>你在窖里探索，发现了一些古老的物品和工具。其中，你在一个角落里找到了一把生锈的钥匙。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('生锈的钥匙')
    },
    options: [
      {
        text: '返回检查箱子',
        target: 'side_story_1_check_box'
      }
    ]
  },
  'side_story_1_find_key': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>寻找钥匙</h3><p>你在窖里寻找钥匙，最终在一个角落里找到了一把生锈的钥匙。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('生锈的钥匙')
    },
    options: [
      {
        text: '返回检查箱子',
        target: 'side_story_1_check_box'
      }
    ]
  },
  'side_story_1_open_box': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>打开箱子</h3><p>你使用生锈的钥匙打开了箱子。箱子里放着一枚徽章和一些古老的金币。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('地窖徽章')
      store.addMedal()
      store.addItem('古老金币')
      store.showToast('获得地窖徽章和古老金币！')
    },
    options: [
      {
        text: '返回地窖',
        target: 'side_story_1_enter_cellar'
      },
      {
        text: '返回地面',
        target: 'side_story_1_start'
      }
    ]
  },
  'side_cellar_wall': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>地窖墙壁</h3><p>你在窖的墙壁上发现了一些古老的壁画。壁画描绘了庄园的历史和一些神秘的事件。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('地窖墙壁上的壁画描绘了庄园的历史和神秘事件')
    },
    options: [
      {
        text: '返回地窖',
        target: 'side_story_1_enter_cellar'
      }
    ]
  },
  'side_cellar_diary': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>地窖日记</h3><p>你在窖里发现了一本古老的日记。日记记录了庄园主人的一些秘密和地窖的用途。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('地窖日记')
      store.addClue('地窖日记记录了庄园主人的秘密和地窖的用途')
    },
    options: [
      {
        text: '返回地窖',
        target: 'side_story_1_enter_cellar'
      }
    ]
  },
  'side_ending_master': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>主人的结局</h3><p>你完成了所有的支线任务，找到了庄园的所有秘密。庄园的主人出现了，他对你的智慧和勇气表示赞赏。</p><p>主人给了你一枚特殊的徽章，作为对你的奖励。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('主人徽章')
      store.addMedal()
      store.showToast('获得主人徽章！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_story_2_start': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>支线任务：迷失的小猫</h3><p>你在庄园里发现了一只迷失的小猫。小猫看起来很害怕，你决定帮助它找到回家的路。</p>',
    options: [
      {
        text: '跟随小猫',
        target: 'side_story_2_follow_cat'
      },
      {
        text: '寻找猫的主人',
        target: 'side_story_2_find_owner'
      },
      {
        text: '放弃帮助',
        target: 'hall_main'
      }
    ]
  },
  'side_story_2_follow_cat': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>跟随小猫</h3><p>你跟随小猫穿过庄园的花园和走廊。最终，小猫带你来到了一个小房间，里面有一个猫窝和一些食物。</p>',
    options: [
      {
        text: '检查房间',
        target: 'side_story_2_check_room'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_story_2_find_owner': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>寻找猫的主人</h3><p>你在庄园里寻找猫的主人。最终，你在卧室里找到了一位老妇人，她是小猫的主人。</p>',
    options: [
      {
        text: '将小猫还给主人',
        target: 'side_story_2_return_cat'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_story_2_check_room': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>检查房间</h3><p>你检查了小猫的房间，发现里面有一些猫玩具和一本日记。日记记录了老妇人对小猫的爱。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('小猫的房间里有老妇人的日记，记录了她对小猫的爱')
    },
    options: [
      {
        text: '返回跟随小猫',
        target: 'side_story_2_follow_cat'
      }
    ]
  },
  'side_story_2_return_cat': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>将小猫还给主人</h3><p>你将小猫还给了老妇人。老妇人非常感激，给了你一枚徽章作为奖励。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('爱心徽章')
      store.addMedal()
      store.showToast('获得爱心徽章！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_story_3_start': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>支线任务：神秘的信件</h3><p>你在庄园的邮箱里发现了一封神秘的信件。信件上没有寄信人地址，只有一个奇怪的符号。</p>',
    options: [
      {
        text: '打开信件',
        target: 'side_story_3_open_letter'
      },
      {
        text: '寻找寄信人',
        target: 'side_story_3_find_sender'
      },
      {
        text: '放弃探索',
        target: 'hall_main'
      }
    ]
  },
  'side_story_3_open_letter': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>打开信件</h3><p>你打开了信件，里面有一张纸条和一枚徽章。纸条上写着："感谢你发现了这个秘密。这枚徽章将帮助你解开庄园的终极谜题。"</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addItem('信件徽章')
      store.addMedal()
      store.showToast('获得信件徽章！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_story_3_find_sender': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>寻找寄信人</h3><p>你在庄园里寻找信件的寄信人。最终，你在图书馆里找到了一位学者，他是信件的寄信人。</p>',
    options: [
      {
        text: '与学者交谈',
        target: 'side_story_3_talk_scholar'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_story_3_talk_scholar': {
    desc: '<h3 style=\'color: #d4af37; margin-bottom: 20px;\'>与学者交谈</h3><p>你与学者交谈，学者告诉你他是庄园的前主人，现在已经退休。他给了你一些关于庄园秘密的提示。</p>',
    on_enter: () => {
      const store = useGameStore()
      store.addClue('学者是庄园的前主人，他提供了一些关于庄园秘密的提示')
    },
    options: [
      {
        text: '返回寻找寄信人',
        target: 'side_story_3_find_sender'
      }
    ]
  }
}
