import { useGameStore } from '../../../store/gameStore'

export default {
  'musicroom_unlock': {
    on_enter: () => {
      const store = useGameStore()
      let msg = ""
      if (!store.hasItem('夜莺长笛')) {
        store.addItem('夜莺长笛')
        msg += `<div class="system-message">【获得关键道具】：夜莺长笛</div>`
      }
      return msg
    },
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音乐室解锁</h3>
    <p>输入正确！壁炉底座弹出一个暗格，里面躺着一把精美的【夜莺长笛】。或许这是音乐室某处机关的钥匙。</p>
    `,
    options: [
      {
        text: '带着长笛返回',
        target: 'hall_main'
      }
    ]
  },
  'puzzle_statues': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">大厅雕像</h3>
    <p>大厅两侧各立着四座大理石雕像：雅典娜、阿波罗、赫尔墨斯、阿尔忒弥斯。</p>
    <p>每座底部都有诗句，并可以旋转。</p>
    <p>你需要按一定顺序排列它们。</p>
    `,
    options: [
      {
        text: '按神话对应星座顺序排列 (雅典娜=1，阿波罗=5...)',
        target: 'statues_solved'
      },
      {
        text: '按诗句首字母解密',
        target: 'hall_main',
        effectMsg: '线索不足，完全没有头绪，你放弃了。'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'statues_solved': {
    on_enter: () => {
      const store = useGameStore()
      let msg = ""
      if (!store.hasItem('起始徽章')) {
        store.addItem('起始徽章')
        store.addItem('机械齿轮')
        store.addMedal()
        msg = `<div class="system-message">【获得奖励】：起始徽章、机械齿轮</div>`
      }
      return msg
    },
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">雕像解谜成功</h3>
    <p>你按照正确的星象逻辑旋转雕像，大厅中央的地板缓缓开启。</p>
    <p>从中升起一个精致的木盒。你打开木盒，里面有一枚【起始徽章】和一个【机械齿轮】。</p>
    `,
    options: [
      {
        text: '收起物品，返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'final_chamber_transition': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">通往最终密室</h3>
    <p>当第七枚徽章嵌入油画的瞬间，整个卧室都开始震动。油画中的七扇窗户同时亮起，光芒汇聚成一束，射向地面。地板裂开，露出一条螺旋石梯，石阶向下延伸，消失在淡蓝色的荧光中。</p>
    <p>管家不知何时站在门口，他的眼中映着七色光："这条路通往庄园的最深处，也是主人最后的谜题所在。我在这里等你回来。"</p>
    <p>你深吸一口气，踏上了石阶。身后的光芒逐渐暗淡，前方的黑暗却透出微弱的荧光。石梯似乎很长，每一步都回荡着你的心跳。螺旋下降的墙壁上刻着七道谜题的缩影——图书馆的星盘、钟楼的齿轮、音乐室的音符……你走过的路在身后化作星光。</p>
    <p>不知走了多久，你终于看到一扇敞开的石门。门楣上刻着一行字："最后的谜题，是你自己。"</p>
    <p>你跨过门槛，进入了中央密室。</p>
    `,
    options: [
      {
        text: '进入中央密室',
        target: 'final_chamber_entry'
      }
    ]
  },
  'return_from_': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">返回大厅</h3>
    <p>[room]</p>
    <p>你将[颜色]徽章收入怀中，最后看了一眼[房间名称]。似乎有什么东西在角落里轻轻叹息，然后一切归于沉寂。当你走出房门时，门在你身后无声地关闭，门把手上的光泽消失了——仿佛它已经完成了自己的使命。</p>
    <p>你回到大厅，将徽章与其他徽章并排放在壁炉台上。管家无声地递上一杯热茶，没有多问。</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'final_chamber_test': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">最终抉择</h3>
    <p>所有的物品严丝合缝地归位！匣子弹开，露出了阿斯特的最后亲笔信。</p>
    <p>他给了你决定庄园和自己命运的选择（部分选项需对应支线解锁）：</p>
    `,
    options: [
      {
        text: '抉择1：成为谜语馆主人，获得无尽财富困死在此',
        target: 'ending_1'
      },
      {
        text: '抉择2：成为自由传播者，放弃财富带走笔记',
        target: 'ending_2'
      },
      {
        text: '抉择3 (真结)：成为永恒守护者，镇压地底能量',
        target: 'ending_3',
        condition: () => {
          const store = useGameStore()
          return store.getFlag('side_underground_triggered')
        }
      },
      {
        text: '抉择4 (真结)：将此地改为博物馆，传承凄美的故事',
        target: 'ending_4',
        condition: () => {
          const store = useGameStore()
          return store.getFlag('side_painting_triggered')
        }
      }
    ]
  }
}
