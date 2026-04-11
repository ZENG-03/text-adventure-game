import { useGameStore } from '../../../store/gameStore'

export default {
  'title': {
    desc: `
    <h2 style="color: #d4af37; text-align: center; margin-bottom: 20px;">幽暗庄园的秘密</h2>
    <p style="text-align: center; margin-bottom: 30px;">探索每个房间，寻找线索，解开谜题</p>
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="/src/assets/backgrounds/hall_main.jpg" style="max-width: 80%; height: auto; border: 2px solid #d4af37; border-radius: 10px;">
    </div>
    <p>你收到了一封神秘的邀请函，邀请你前往一座古老的庄园参加一场解谜游戏。据说，解开所有谜题的人将获得一份丰厚的奖励。</p>
    <p>当你抵达庄园时，大门已经敞开，仿佛在等待你的到来。你深吸一口气，踏入了这座充满神秘气息的建筑。</p>
    `,
    options: [
      {
        text: '开始新游戏',
        target: 'start'
      },
      {
        text: '继续游戏',
        target: 'system_load_auto',
        cond: ['hasAutoSave']
      },
      {
        text: '开始多周目游戏',
        target: 'start_ng_plus',
        cond: ['hasEndings:1']
      }
    ]
  },
  'start': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">序章：神秘的邀请</h3>
    <p>你站在幽暗庄园的门口，手中握着那封神秘的邀请函。信纸是用一种你从未见过的古老纸张制成的，上面的字迹优雅而神秘。</p>
    <p>"亲爱的解谜者，"信中写道，"你被选中参加一场有史以来最伟大的解谜游戏。在这座庄园中，隐藏着七枚珍贵的徽章，每一枚都代表着一个谜题的答案。当你收集到所有徽章时，你将获得一个改变命运的机会。"</p>
    <p>你推开门，走进了庄园的大厅。大厅宽敞而华丽，中央有一个巨大的水晶吊灯，墙壁上挂着古老的油画，地板上的大理石图案精美绝伦。</p>
    <p>突然，你注意到大厅的正中央有一个奇怪的石台，上面刻着一些神秘的符号。石台旁边有一张纸条，上面写着："开始你的旅程吧，解谜者。第一个谜题就在这座庄园的某个角落等待着你。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.startNewGame()
    },
    options: [
      {
        text: '探索大厅',
        target: 'hall_initial_enter'
      }
    ]
  },
  'start_ng_plus': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">多周目：记忆的碎片</h3>
    <p>你再次站在幽暗庄园的门口，但是这一次，你心中充满了对过去的记忆。你知道这座庄园的秘密，你知道那些谜题的答案，你知道那些徽章的所在。</p>
    <p>但是，当你推开门时，你发现庄园似乎发生了一些变化。一些你之前没有注意到的细节现在变得清晰起来，一些新的路径和房间出现在你的眼前。</p>
    <p>你感到口袋里有什么东西，拿出来一看，是一块古老的怀表。表壳上刻着一些你熟悉的符号，指针指向了一个特定的时间。</p>
    <p>"欢迎回来，解谜者，"一个熟悉的声音在你耳边响起，"这一次，你将发现更多的秘密。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.startNGPlus()
    },
    options: [
      {
        text: '探索大厅',
        target: 'hall_initial_enter'
      }
    ]
  }
}
