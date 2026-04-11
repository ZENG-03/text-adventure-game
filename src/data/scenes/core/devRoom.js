import { useGameStore } from '../../../store/gameStore';

export default {
  'dev_room_entry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">✨ 开发者密室 ✨</h3>
    <p>你推开那扇从未见过的门，眼前是一个光线柔和的小房间。墙上贴满了便签、概念图和未完成的画稿。</p>
    <p>房间中央有一张桌子，桌上放着一本留言簿和一台老式打字机。</p>
    `,
    options: [
      { text: '查看留言簿', target: 'dev_guestbook' },
      { text: '查看墙上的概念图', target: 'dev_concept_art' },
      { text: '使用打字机', target: 'dev_typewriter' },
      { text: '聆听制作人留言', target: 'dev_voice_message' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  
  'dev_guestbook': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">留言簿</h3>
    <p>你翻开厚厚的留言簿，上面写满了开发者的笔记：</p>
    <p>"谜语馆的第一块砖，是在一个雨夜砌下的。"<br>
    "伊莲娜的原型是我大学时的一位朋友，她喜欢画画，但后来失联了。"<br>
    "钟楼的齿轮谜题差点让我放弃整个项目，还好坚持下来了。"<br>
    "如果你读到了这里，谢谢你。真的。"</p>
    <p>最后一页是一行手写小字："保持好奇，保持探索。 —— 制作人"</p>
    `,
    options: [
      { text: '返回开发者房间', target: 'dev_room_entry' }
    ]
  },
  
  'dev_concept_art': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">概念图</h3>
    <p>墙壁上挂着几张泛黄的草图：</p>
    <p>📜 最初的庄园设计——比现在的版本多了一座塔楼。<br>
    🎨 伊莲娜的早期形象——她原本有一头黑发。<br>
    ⚙️ 钟楼的内部结构图——齿轮数量是现在的两倍。<br>
    🖼️ 一幅从未使用的画作——一个男人站在窗前，窗外是燃烧的庄园。</p>
    <p>每张图旁边都贴着便签，写着"废弃"、"太复杂"、"以后再说"。</p>
    `,
    options: [
      { text: '返回开发者房间', target: 'dev_room_entry' }
    ]
  },
  
  'dev_typewriter': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">老式打字机</h3>
    <p>你靠近打字机，发现纸槽里已经夹着一张纸。纸上打印着一行字：</p>
    <p>"恭喜你找到了这里。如果你愿意，可以输入一个词作为纪念。"</p>
    `,
    input: {
      placeholder: '输入一个词...',
      validate: (input) => true,  // 任何输入都接受
      onSuccess: (input, store) => {
        store.setFlag(`dev_typed_${input}`, true);
        store.showToast(`"${input}"被刻在了墙上。`);
      },
      success: 'dev_typewriter_success',
      failMsg: '',
      hints: []
    },
    options: [
      { text: '返回开发者房间', target: 'dev_room_entry' }
    ]
  },
  
  'dev_typewriter_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">刻印完成</h3>
    <p>你按下回车键，打字机发出清脆的"咔哒"声。墙上的一小块空白处，多了一行小字——正是你输入的那个词。</p>
    <p>虽然没人会看到，但你知道，它在那里。</p>
    `,
    options: [
      { text: '返回开发者房间', target: 'dev_room_entry' }
    ]
  },
  
  'dev_voice_message': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">制作人留言</h3>
    <p>你按下桌上的老式录音机，磁带开始转动：</p>
    <p>"如果你听到了这段录音，说明你真的把游戏玩透了。谢谢你的耐心。"<br>
    "这个项目花了我很长时间，中间很多次想放弃。但每次想到有人会像你一样发现这些隐藏的东西，就觉得值得。"<br>
    "谜语馆的故事结束了，但你的故事还在继续。去吧，外面的世界还有很多谜题等着你。"<br>
    "—— 塞拉斯·诺斯（其实是制作人本尊）"</p>
    <p>磁带尽头是一段空白，然后突然冒出一句：<br>
    "对了，密码箱的密码是'COURTESY'。别告诉别人。"</p>
    `,
    options: [
      { text: '返回开发者房间', target: 'dev_room_entry' }
    ]
  }
};