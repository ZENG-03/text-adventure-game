import { useGameStore } from '../../../store/gameStore'

export default {
  'ending_1': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局一：真相揭晓</h3>
    <p>你收集到了所有七枚徽章，大厅中央的石台开始发光。一道神秘的光芒从石台射出，在大厅的墙壁上形成了一个通道。</p>
    <p>你走进通道，发现里面是一个巨大的密室。密室的中央有一个古老的祭坛，上面放着一本古老的书籍和一个精美的盒子。</p>
    <p>你打开盒子，发现里面是一颗闪闪发光的宝石。当你触摸宝石时，你突然明白了一切。</p>
    <p>原来，这座庄园是一个测试，用来寻找一个能够解开所有谜题的人。而你，就是那个被选中的人。</p>
    <p>宝石中蕴含着强大的力量，它可以实现你的一个愿望。你思考了很久，最终决定用它来帮助那些需要帮助的人。</p>
    <p>当你离开庄园时，你知道你的生活将永远改变。你已经获得了真正的宝藏——智慧和勇气。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('first_ending')
      store.setFlag('ending_1_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_2': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局二：守护者</h3>
    <p>你收集到了所有七枚徽章，但是当你触摸宝石时，你感受到了一种强大的责任。</p>
    <p>原来，这座庄园是一个守护者的居所，而宝石是守护这个世界的关键。你意识到，你已经被选中成为新的守护者。</p>
    <p>你决定留在庄园中，成为新的守护者，保护这个世界免受邪恶的侵害。</p>
    <p>虽然你将永远无法离开庄园，但是你知道你的选择是正确的。你已经找到了自己的使命。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('guardian_ending')
      store.setFlag('ending_2_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_3': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局三：时空旅行者</h3>
    <p>你收集到了所有七枚徽章，当你触摸宝石时，你突然被一股强大的力量吸入了一个时空隧道。</p>
    <p>当你醒来时，你发现自己回到了过去。你看到了庄园的建造过程，看到了阿斯特·克劳利的一生。</p>
    <p>你了解到，阿斯特建造这座庄园是为了寻找一个能够改变世界的人。而你，就是那个被选中的人。</p>
    <p>你决定利用这个机会，改变过去，创造一个更美好的未来。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('time_traveler_ending')
      store.setFlag('ending_3_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_4': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局四：收藏家</h3>
    <p>你收集到了所有七枚徽章，但是当你打开盒子时，你发现里面是空的。</p>
    <p>突然，你意识到，真正的宝藏不是宝石，而是你在解谜过程中获得的知识和经验。</p>
    <p>你决定成为一个收藏家，收集世界各地的谜题和宝藏。你将你的经历写成了一本书，成为了一名著名的探险家和作家。</p>
    <p>虽然你没有获得宝石，但是你获得了更珍贵的东西——自由和快乐。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('collector_ending')
      store.setFlag('ending_4_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_5': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局五：新的开始</h3>
    <p>你收集到了所有七枚徽章，当你触摸宝石时，你感受到了一种强大的力量。</p>
    <p>但是，你并没有使用这种力量，而是将它放回了祭坛。你意识到，真正的力量来自于内心，而不是外部的宝物。</p>
    <p>你决定离开庄园，开始新的生活。你带着在庄园中获得的智慧和勇气，面对未来的挑战。</p>
    <p>虽然你没有获得宝石，但是你获得了真正的自由。你已经准备好迎接新的开始。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('new_beginning_ending')
      store.setFlag('ending_5_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_5_truth': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">真结局：七重谜语的真相</h3>
    <p>你收集到了所有七枚徽章，并且完成了所有支线任务。当你触摸宝石时，你感受到了一股前所未有的强大力量。</p>
    <p>突然，你看到了阿斯特·克劳利的灵魂出现在你面前。他微笑着对你说："恭喜你，你已经解开了所有的谜题，包括我隐藏最深的秘密。"</p>
    <p>阿斯特告诉你，谜语馆的真正目的是为了寻找一个能够同时拥有智慧、勇气和同情心的人。而你，就是那个被选中的人。</p>
    <p>他将谜语馆的所有秘密都告诉了你，包括七重谜语的真正含义和庄园的起源。最后，他将庄园的所有权和所有的研究成果都交给了你。</p>
    <p>当你离开庄园时，你知道你已经成为了谜语馆的新主人，并且肩负着传承阿斯特意志的使命。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('true_ending')
      store.setFlag('ending_5_truth_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_6_forgotten': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">被遗忘的探索者</h3>
    <p>你在庄园中迷失了方向，无法找到任何出口。你尝试了所有的方法，但都无法离开这个神秘的地方。</p>
    <p>随着时间的推移，你开始忘记自己的名字和来自哪里。你成为了庄园的一部分，永远被困在了这个谜题的世界中。</p>
    <p>有时候，你会看到其他的探索者进入庄园，但你无法与他们交流。你只能默默地看着他们，希望他们能够成功离开。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('forgotten_ending')
      store.setFlag('ending_6_forgotten_unlocked', true)
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  },
  'ending_7_harmony': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">完美和谐</h3>
    <p>你成功解开了所有的谜题，并且与庄园中的所有灵魂达成了和解。当你触摸宝石时，你感受到了一种完美的和谐。</p>
    <p>庄园的所有机关都停止了运作，取而代之的是一片宁静和祥和。你看到阿斯特、埃莉诺、伊莲娜和托马斯的灵魂都微笑着向你致谢。</p>
    <p>你意识到，谜语馆的真正目的不是为了考验，而是为了让这些灵魂得到安息。你成功地完成了这个使命，让庄园恢复了平静。</p>
    <p>当你离开庄园时，你知道你已经完成了一件伟大的事情，并且获得了内心的平静。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('harmony_ending')
      store.setFlag('ending_7_harmony_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_8_time': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">时空旅行者</h3>
    <p>你收集到了所有七枚徽章，当你触摸宝石时，你被一股强大的力量吸入了时空隧道。</p>
    <p>但是，这次你没有回到过去，而是来到了未来。你看到了谜语馆在未来的样子，它已经成为了一个著名的旅游景点，吸引着来自世界各地的游客。</p>
    <p>你还看到了自己的后代，他们正在管理着谜语馆，并且将你的故事传递给下一代。你意识到，你的选择和行动已经影响了未来。</p>
    <p>当你回到现在时，你知道你已经获得了一种特殊的能力——能够看到时间的流动。你决定用这种能力来帮助别人，让世界变得更加美好。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('time_ending')
      store.setFlag('ending_8_time_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_9_shadow': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">暗影主宰</h3>
    <p>你收集到了所有七枚徽章，但是当你触摸宝石时，你被里面的黑暗力量所控制。你开始变得贪婪和邪恶，想要统治整个世界。</p>
    <p>你利用宝石的力量获得了强大的能力，但是你的灵魂也被黑暗所侵蚀。你成为了一个暗影主宰，统治着谜语馆和周围的世界。</p>
    <p>但是，你很快就发现，这种力量并没有给你带来快乐，反而让你变得孤独和痛苦。你意识到自己犯了一个错误，但是已经无法回头。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('shadow_ending')
      store.setFlag('ending_9_shadow_unlocked', true)
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  },
  'ending_10_light': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光明使者</h3>
    <p>你收集到了所有七枚徽章，并且保持了内心的纯洁和善良。当你触摸宝石时，你被一股强大的光明力量所包围。</p>
    <p>你成为了一个光明使者，拥有了治愈和帮助他人的能力。你决定用这种能力来帮助那些需要帮助的人，让世界变得更加美好。</p>
    <p>你离开了谜语馆，开始了一段新的旅程。你知道，你的使命是传播光明和希望，让每个人都能感受到爱的力量。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('light_ending')
      store.setFlag('ending_10_light_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'epilogue_true_end': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">日谈：一年后的尾声</h3>
    <p>一年后，你回到了谜语馆。你发现庄园已经发生了很大的变化，变得更加美丽和充满生机。</p>
    <p>管家告诉你，自从你离开后，庄园的诅咒已经被解除，所有的灵魂都得到了安息。现在，谜语馆已经成为了一个和平的地方，不再有谜题和挑战。</p>
    <p>你在庄园中漫步，回忆起一年前的经历。你意识到，那段经历已经成为了你生命中最宝贵的财富，让你变得更加成熟和坚强。</p>
    <p>当你离开时，你知道你会永远记住这个地方，以及在这里遇到的每一个人和每一个故事。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('epilogue_unlocked')
      store.setFlag('epilogue_true_end_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_true': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">真结局</h3>
    <p>你成功解开了所有的谜题，并且做出了正确的选择。你获得了谜语馆的认可，成为了它的新主人。</p>
    <p>当你离开庄园时，你知道你已经完成了自己的使命，并且获得了真正的幸福。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('true_ending_simple')
      store.setFlag('ending_true_unlocked', true)
    },
    options: [
      {
        text: '返回标题画面',
        target: 'title'
      }
    ]
  },
  'ending_false': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">假结局</h3>
    <p>你尝试解开谜题，但是没有成功。你被庄园的幻象所迷惑，最终选择了放弃。</p>
    <p>当你离开庄园时，你知道你错过了一个伟大的机会，但是你也意识到，有时候放弃也是一种智慧。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('false_ending')
      store.setFlag('ending_false_unlocked', true)
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  },
  'ending_giveup': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">放弃</h3>
    <p>你在解谜的过程中遇到了太多的困难，最终选择了放弃。你离开了庄园，回到了平凡的生活。</p>
    <p>但是，你永远不会忘记在谜语馆的那段经历，以及它带给你的启示。你知道，有时候坚持并不总是最好的选择，放弃也是一种勇气。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.unlockAchievement('giveup_ending')
      store.setFlag('ending_giveup_unlocked', true)
    },
    options: [
      {
        text: '重新开始',
        target: 'title'
      }
    ]
  }
}
