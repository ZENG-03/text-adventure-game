import { useGameStore } from '../../../store/gameStore'
import { dynamicDescriptions } from '../../../utils/dynamicDesc'

export default {
  'hall_injured': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">受伤归来</h3>
    <p>你跌跌撞撞地回到大厅，管家奥尔德斯看见你手臂上的伤口，面无表情地递给你一卷绷带和一瓶消毒水。你坐下包扎，他低声说：“鲁莽是解谜的大敌。下次，请三思。” 你点头，感到伤口火辣辣地疼，但并无大碍。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('injured', true)
    },
    options: [
      { text: '返回大厅（继续探索）', target: 'hall_main' }
    ]
  }
}