import { useGameStore } from '../../../store/gameStore'
import { observationPoints } from '../../observationPoints'

export default {
  'sys_room_exit_transition': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">离开房间</h3>
    <p>你准备离开这个房间，回到大厅。</p>
    `,
    options: [
      {
        text: '确认离开',
        target: 'hall_main'
      },
      {
        text: '取消',
        target: 'hall_main'
      }
    ]
  },
  'sys_side_story_1_trigger': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">管家的请求</h3>
    <p>管家奥尔德斯·克劳利走到你面前，表情严肃而恭敬。</p>
    <p>"打扰了，解谜者，"奥尔德斯说道，"我有一个请求。我的主人阿斯特·克劳利已经失踪了三天，我最后一次见到他是在钟楼。如果你能找到他，我将感激不尽。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_butler_available', true)
    },
    options: [
      {
        text: '接受请求',
        target: 'side_story_1_start'
      },
      {
        text: '拒绝',
        target: 'hall_main'
      }
    ]
  },
  'sys_side_story_2_trigger': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">画中女子</h3>
    <p>当你经过画室时，你注意到一幅肖像画中的女子似乎在看着你。</p>
    <p>突然，女子的声音在你耳边响起："请帮助我，解谜者。我被囚禁在这幅画中已经一百年了。只有找到传说中的真实之镜，才能解除这个诅咒。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_painting_available', true)
    },
    options: [
      {
        text: '帮助她',
        target: 'side_story_2_start'
      },
      {
        text: '离开',
        target: 'hall_main'
      }
    ]
  },
  'sys_side_story_3_trigger': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">地下秘密</h3>
    <p>当你经过地下室时，你听到了微弱的呼救声。</p>
    <p>你循声而去，发现一个被囚禁在铁栏杆后面的人。他看起来像是一位地质学家。</p>
    <p>"请帮助我，"他说道，"我被那些贪婪的寻宝者囚禁在这里。我在地下发现了一个古老的文明遗迹，里面有重要的知识和宝藏。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_underground_available', true)
    },
    options: [
      {
        text: '帮助他',
        target: 'side_story_3_start'
      },
      {
        text: '离开',
        target: 'hall_main'
      }
    ]
  },
  'sys_side_story_4_trigger': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">未完成的交响曲</h3>
    <p>当你经过音乐室时，你听到了优美的钢琴声。</p>
    <p>你循声而去，发现一位女子坐在钢琴前，正在弹奏一首未完成的交响曲。</p>
    <p>"请帮助我，"她说道，"这首交响曲是我毕生的心血，但它从未被完成。我需要你帮我找到完成这首曲子所需的材料。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_music_available', true)
    },
    options: [
      {
        text: '帮助她',
        target: 'side_story_4_start'
      },
      {
        text: '离开',
        target: 'hall_main'
      }
    ]
  },
  'system_observe': {
    desc: (store, args) => {
      const { sceneId, observationId } = args;
      const points = observationPoints[sceneId] || [];
      const point = points.find(p => p.id === observationId);
      
      if (!point) {
        return `
        <h3 style="color: #d4af37; margin-bottom: 20px;">观察</h3>
        <p>没有发现什么特别的东西。</p>
        `;
      }
      
      let description = `
      <h3 style="color: #d4af37; margin-bottom: 20px;">观察</h3>
      <p>${point.text}</p>
      `;
      
      if (point.hint) {
        description += `<p style="color: #888; font-style: italic;">${point.hint}</p>`;
      }
      
      return description;
    },
    on_enter: (store, args) => {
      const { sceneId, observationId } = args;
      const points = observationPoints[sceneId] || [];
      const point = points.find(p => p.id === observationId);
      
      if (point) {
        // 标记为已观察
        store.addObservedDetail(`${sceneId}_${observationId}`);
        
        // 执行奖励
        if (typeof point.reward === 'function') {
          point.reward();
        }
        
        // 解锁标记
        if (point.unlockFlag) {
          store.setFlag(point.unlockFlag, true);
        }
      }
    },
    options: [
      {
        text: '继续探索',
        target: (store, args) => args.returnScene || 'hall_main'
      }
    ]
  }
}
