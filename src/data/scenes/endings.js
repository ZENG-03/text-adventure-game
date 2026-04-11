import { useGameStore } from '../../store/gameStore'
import { emitter } from '../../utils/eventBus'

export default {
  'ending_1': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">进入未知世界</h3>
    <p>你选择进入了通道，离开了这个世界。在通道的另一端，你发现了一个全新的世界，那里充满了知识和智慧。你成为了这个世界的一员，获得了永生和无尽的知识。</p>
    <p>虽然你永远离开了原来的世界，但你带走了庄园的秘密，成为了一个传说。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_2': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">留在这个世界</h3>
    <p>你选择留在了这个世界。你将庄园的秘密保守在心中，继续过着平凡的生活。</p>
    <p>虽然你没有获得永生和无尽的知识，但你获得了内心的平静和满足。你知道，有些秘密最好让它们永远成为秘密。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_3': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">成为庄园的新主人</h3>
    <p>你成功解开了庄园的所有谜题，成为了庄园的新主人。你将庄园改造成了一个博物馆，向世人展示庄园的历史和秘密。</p>
    <p>你的名字成为了传奇，庄园也因为你而焕发出新的生机。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_4': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">探索者的结局</h3>
    <p>你成为了一名伟大的探索者，继续探索世界各地的神秘场所。你将庄园的秘密作为你探索的起点，开启了一段新的冒险。</p>
    <p>你的故事被人们传颂，成为了一个传奇。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_5': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">学者的结局</h3>
    <p>你成为了一名学者，专注于研究庄园的历史和秘密。你撰写了一本关于庄园的书籍，成为了权威。</p>
    <p>你的研究为后人留下了宝贵的财富，庄园的秘密也因为你而被更多人了解。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_5_truth': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">真结局：七重谜语的真相</h3>
    <p>你成功解开了庄园的所有谜题，发现了七重谜语的真相。原来，庄园是一个通往不同世界的门户，而七枚徽章是打开这个门户的钥匙。</p>
    <p>你成为了这个门户的守护者，平衡着不同世界之间的力量。你获得了真正的智慧和力量，成为了一个传奇。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_6_forgotten': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">被遗忘的探索者</h3>
    <p>你在探索庄园的过程中迷失了自己，最终被庄园的秘密所吞噬。你成为了庄园的一部分，永远被遗忘在历史的长河中。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_7_harmony': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">完美和谐</h3>
    <p>你成功地平衡了庄园的力量，实现了完美的和谐。庄园成为了一个和平的圣地，吸引着世界各地的人们前来参观。</p>
    <p>你成为了庄园的守护者，守护着这份和谐与平衡。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_8_time': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">时空旅行者</h3>
    <p>你利用庄园的力量成为了一名时空旅行者，穿越不同的时间和空间。你见证了历史的变迁，探索了未来的可能性。</p>
    <p>你的旅程永无止境，成为了一个传说。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_9_shadow': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">暗影主宰</h3>
    <p>你被庄园的黑暗力量所诱惑，成为了暗影的主宰。你获得了强大的力量，但也失去了自己的灵魂。</p>
    <p>你成为了一个黑暗的传说，被人们所畏惧。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_10_light': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光明使者</h3>
    <p>你成功地净化了庄园的黑暗力量，成为了光明的使者。你将庄园改造成了一个充满光明和希望的地方，吸引着人们前来寻求庇护。</p>
    <p>你成为了一个光明的传说，被人们所敬仰。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'epilogue_true_end': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">日谈：一年后的尾声</h3>
    <p>一年后，你回到了庄园。庄园已经恢复了生机，成为了一个著名的旅游景点。你看着庄园的变化，心中充满了感慨。</p>
    <p>你知道，你的冒险已经结束，但庄园的故事还在继续。你将永远记住这段经历，它将成为你生命中最宝贵的财富。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_true': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">真实结局</h3>
    <p>你成功地解开了庄园的所有谜题，发现了庄园的真实面目。你成为了一个真正的英雄，被人们所敬仰。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_false': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">虚假结局</h3>
    <p>你以为你解开了庄园的谜题，但实际上你只是触及了表面。你被庄园的幻象所迷惑，最终一事无成。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'ending_giveup': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">放弃结局</h3>
    <p>你放弃了探索庄园的秘密，选择了平凡的生活。虽然你没有获得什么，但你也没有失去什么。</p>
    `,
    options: [
      {
        text: '翻开记忆之书',
        target: 'show_memory_book'
      },
      {
        text: '重新开始',
        target: 'hall_main'
      }
    ]
  },
  'show_memory_book': {
    desc: '',
    on_enter: (store) => {
      // 触发显示记忆之书组件，不渲染文本
      emitter.emit('show-memory-book');
      return { type: 'redirect', target: 'title' }; // 或者停留
    }
  }
}
