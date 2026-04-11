import { useGameStore } from '../../../store/gameStore'

export default {
  'side_story_4_start': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">支线任务：未完成的交响曲</h3>
    <p>埃莉诺·布莱克伍德的声音在你耳边轻轻响起："谢谢你愿意帮助我。"</p>
    <p>"这首交响曲'夜莺与紫藤'是我毕生的心血，但它从未被完成。"埃莉诺的声音带着一丝忧伤，"我需要你帮我找到完成这首曲子所需的三件物品：夜莺的长笛、紫藤的花瓣和调音扳手。"</p>
    <p>"只有找到这三件物品，你才能完成我的交响曲，让我的灵魂得到安息。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_music_started', true)
      store.addClue('需要找到夜莺的长笛、紫藤的花瓣和调音扳手来完成交响曲')
    },
    options: [
      {
        text: '开始寻找',
        target: 'music_search_items'
      },
      {
        text: '暂时拒绝，返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'music_search_items': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找材料</h3>
    <p>你开始在庄园中寻找完成交响曲所需的材料。</p>
    <p>在钟楼中，你找到了夜莺的长笛——这是一支精美的银质长笛，上面刻着夜莺的图案。</p>
    <p>在温室花房中，你收集了一些紫藤的花瓣——这些花瓣散发着淡淡的紫色光芒，美丽而神秘。</p>
    <p>在音乐室中，你找到了调音扳手——这是一把精密的乐器调音工具，是完成交响曲的必需品。</p>
    <p>你将三件物品组合在一起，准备完成交响曲。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('夜莺长笛')
      store.addItem('紫藤花瓣')
      store.addItem('调音扳手')
      store.addClue('找到了夜莺长笛、紫藤花瓣和调音扳手，可以完成交响曲')
    },
    options: [
      {
        text: '完成交响曲',
        target: 'music_complete'
      }
    ]
  },
  'music_complete': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">完成交响曲</h3>
    <p>你坐在钢琴前，将夜莺长笛放在一旁，拿起调音扳手开始调整钢琴。</p>
    <p>然后，你将紫藤的花瓣撒在钢琴上，开始演奏"夜莺与紫藤"。</p>
    <p>优美的旋律从钢琴中流出，与空气中弥漫的紫藤花香交织在一起。整个音乐室都被音乐和光芒所笼罩。</p>
    <p>当最后一个音符落下时，一道耀眼的光芒闪过。你看到埃莉诺的灵魂在光芒中微笑着向你致谢，然后缓缓升向天空，消失在光明之中。</p>
    <p>埃莉诺的灵魂终于得到了安息，而你手中多了一枚精美的徽章——"音乐徽章"，这是对音乐家的最高荣誉。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_music_completed', true)
      store.addItem('音乐徽章')
      store.addMedal()
      store.addItem('埃莉诺的祝福')
      store.removeItem('夜莺长笛')
      store.removeItem('紫藤花瓣')
      store.showToast('完成支线任务：未完成的交响曲！获得音乐徽章！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_ask_butler_elenor': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">询问管家关于埃莉诺</h3>
    <p>你找到管家，询问他关于埃莉诺·布莱克伍德的事情。管家沉默了片刻，然后缓缓说道："埃莉诺小姐是一位天才制琴师，她曾经在庄园里住过一段时间。先生非常欣赏她的才华，邀请她为庄园制作乐器。"</p>
    <p>"她确实在创作一首交响曲，叫做'夜莺与紫藤'。但后来她突然离开了，没有人知道她去了哪里。先生为此很伤心，还派人寻找过她，但始终没有音讯。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('埃莉诺是天才制琴师，突然离开庄园')
    },
    options: [
      {
        text: '询问更多关于交响曲的细节',
        target: 'side_symphony_details'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_symphony_details': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">交响曲细节</h3>
    <p>管家回忆道："埃莉诺小姐说，这首交响曲共有七个乐章，分别代表一周的七天。她希望通过音乐表达生命的循环和自然的和谐。"</p>
    <p>"她在庄园的那段时间，经常在音乐室里工作到深夜。有一次，我经过音乐室，听到她在演奏一段非常优美的旋律，那应该就是'夜莺与紫藤'的一部分。"</p>
    <p>"她离开前，把一些乐谱和制琴工具留在了音乐室里。先生一直保存着这些东西，希望有一天她能回来。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('交响曲有七个乐章，代表一周七天')
    },
    options: [
      {
        text: '检查钢琴凳',
        target: 'side_piano_stool'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_piano_stool': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">琴凳中的乐谱</h3>
    <p>你打开钢琴凳的盖子，发现里面有一些泛黄的乐谱。这些乐谱看起来是埃莉诺的手写稿，上面写着'夜莺与紫藤'的部分乐章。</p>
    <p>在乐谱的旁边，你还发现了一枚精美的夜莺胸针。胸针的材质是银的，上面镶嵌着蓝色的宝石，看起来非常珍贵。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('埃莉诺的乐谱')
      store.addItem('夜莺胸针')
    },
    options: [
      {
        text: '查看胸针的线索',
        target: 'side_brooch_clue'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_brooch_clue': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">夜莺胸针指引</h3>
    <p>你仔细观察夜莺胸针，发现胸针的背面刻着一行小字："壁炉后的秘密"。这似乎是一个线索，指向音乐室的壁炉。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('胸针指向壁炉后的秘密')
    },
    options: [
      {
        text: '检查壁炉',
        target: 'side_fireplace_secret'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_fireplace_secret': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">壁炉后的密室</h3>
    <p>你检查音乐室的壁炉，发现壁炉的后壁可以移动。你用力推了推，墙壁果然打开了，露出一个隐藏的密室。</p>
    <p>密室里有一张桌子，上面放着一本日记和一些制琴工具。日记的封面写着"埃莉诺·布莱克伍德的制琴笔记"。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('制琴工具')
    },
    options: [
      {
        text: '阅读埃莉诺的日记',
        target: 'side_elenor_diary'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_elenor_diary': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">埃莉诺的制琴笔记</h3>
    <p>你翻开埃莉诺的日记，里面记录了她制作乐器的过程和创作交响曲的想法。最后几页的内容引起了你的注意：</p>
    <p>"我已经完成了'夜莺与紫藤'的前六个乐章，但第七乐章始终无法完成。我需要一把特殊的小提琴来演奏这个乐章，这把小提琴必须用紫藤木制作，并且要在特定的时间和地点演奏。"</p>
    <p>"我在庄园的花园里发现了一棵古老的紫藤树，它的木材非常适合制作小提琴。我已经开始制作这把小提琴，但还没有完成。"</p>
    <p>"如果有人能找到这把小提琴并完成第七乐章，我的灵魂就能得到安息。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('需要用紫藤木制作的小提琴来完成第七乐章')
    },
    options: [
      {
        text: '寻找紫藤木小提琴',
        target: 'side_play_elenor_violin'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_play_elenor_violin': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">演奏小提琴</h3>
    <p>你在密室的角落里找到了那把用紫藤木制作的小提琴。小提琴的外观非常精美，琴身散发着淡淡的紫色光芒。</p>
    <p>你拿起小提琴，按照埃莉诺乐谱中的指示开始演奏第七乐章。优美的旋律从琴弦中流出，整个密室都被音乐所包围。</p>
    <p>当你演奏完最后一个音符时，一道光芒从小提琴中射出，埃莉诺的灵魂出现在你面前。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('紫藤木小提琴')
    },
    options: [
      {
        text: '完成交响曲',
        target: 'side_symphony_complete'
      },
      {
        text: '返回音乐室',
        target: 'musicroom_entry'
      }
    ]
  },
  'side_symphony_complete': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">交响曲完成</h3>
    <p>埃莉诺的灵魂微笑着对你说："谢谢你完成了我的交响曲。现在，我可以安心离开了。但在离开之前，我想给你一个选择。"</p>
    <p>"你可以将我的交响曲公之于众，让更多的人听到它的美丽。或者，你可以将它留在沉默中，让它成为我们之间的秘密。"</p>
    `,
    options: [
      {
        text: '公之于众',
        target: 'side_ending_music_public'
      },
      {
        text: '留在沉默中',
        target: 'side_ending_music_keep'
      }
    ]
  },
  'side_ending_music_public': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局：公之于众</h3>
    <p>你选择将埃莉诺的交响曲公之于众。在你的努力下，'夜莺与紫藤'成为了世界闻名的古典音乐作品，被无数音乐家演奏。</p>
    <p>埃莉诺的名字被载入音乐史册，她的才华终于得到了应有的认可。你也因为发现并推广了这部杰作而成为了著名的音乐制作人。</p>
    <p>每当听到这首交响曲，你都会想起在谜语馆的那段经历，以及埃莉诺那美丽的灵魂。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_music_ending_public', true)
      store.showToast('获得成就：音乐传播者！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_ending_music_keep': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">结局：留在沉默中</h3>
    <p>你选择将埃莉诺的交响曲留在沉默中。你将乐谱和小提琴小心地放回密室，让它们成为谜语馆的一个秘密。</p>
    <p>每当你回到音乐室，你都会想起埃莉诺和她的音乐。这段经历成为了你内心深处最珍贵的回忆，只有你和埃莉诺知道这个秘密。</p>
    <p>有时候，你会独自演奏这首交响曲，让音乐在空荡的音乐室中回荡，仿佛埃莉诺就在你身边。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('side_music_ending_keep', true)
      store.showToast('获得成就：音乐守护者！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_music_final_mechanism': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">触发终极机关</h3>
    <p>当你完成埃莉诺的交响曲后，音乐室的墙壁开始发出光芒。墙壁上的音符图案开始旋转，最终形成一个复杂的机关。</p>
    <p>机关启动后，音乐室的地板打开，露出一个通往地下的通道。这个通道似乎通往谜语馆的核心区域，那里可能隐藏着最终的秘密。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.setFlag('music_mechanism_activated', true)
    },
    options: [
      {
        text: '进入通道',
        target: 'hall_main'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'side_music_hidden': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音乐室隐藏空间</h3>
    <p>你敲击音乐室的墙壁，发现壁炉右侧有一块空心的砖。你用刀撬开，里面是一个小铁盒，盒子里放着一枚夜莺徽章（不是主线徽章）和一张纸条："若你听到音乐，请戴上它。" 你戴上徽章，感到一股暖流涌入心间。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('夜莺徽章')
    },
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'side_music_room_play': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">音乐室自动演奏</h3>
    <p>你拉响埃莉诺的小提琴，主题旋律在房间回荡。突然，管风琴、钢琴、竖琴同时自动奏响，合奏出完整的第七乐章。音乐结束后，管风琴的暗门弹开，里面是一本完整的交响曲总谱。原来，埃莉诺把第七乐章藏在了乐器的共鸣里。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('完整的交响曲总谱')
    },
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'side_play_violin': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">拉响安魂曲</h3>
    <p>你拉响小提琴，琴声哀婉，像是埃莉诺在倾诉。当最后一个音符消散时，音乐室的蜡烛全部自动点燃，墙上浮现出一行字："谢谢你，陌生人。现在，你可以带走我的乐章了。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('安魂曲奏响')
    },
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'side_score_details': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">乐谱细节</h3>
    <p>乐谱空白处的红墨水字迹是："夜莺的歌声，藏在第七件乐器的共鸣箱里。" 你检查了七件有夜莺标记的乐器，发现单簧管的管身内部有一个小纸卷，展开后是第七乐章缺失的四个小节。补全后，旋律终于完整。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('夜莺与第七件乐器')
    },
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' }
    ]
  },
  'side_elenor_grave': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">埃莉诺的墓地</h3>
    <p>你找遍了花园的每个角落，甚至翻遍了教堂墓地，都没有找到埃莉诺的墓碑。管家后来告诉你："她的骨灰被阿斯特撒在了音乐室的管风琴里。她说，想让自己的灵魂永远与音乐同在。"</p>
    `,
    options: [
      { text: '返回音乐室', target: 'musicroom_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  }
}
