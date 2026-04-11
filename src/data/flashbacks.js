export const flashbacks = {
  // 画室支线 - 伊莲娜离开后的阿斯特
  'studio_painting_complete': {
    id: 'studio_painting_complete',
    title: '记忆碎片：最后的画笔',
    content: '她走的那天，我把最后一笔红色涂在她的唇上……那是血的颜色。\n\n我画了无数个她，却永远画不出她的灵魂。',
    trigger: { type: 'flag', key: 'side_painting_completed', value: true },
    character: 'astre',
    position: 'center',  // 或 'left', 'right'
    autoClose: 5000      // 毫秒，0表示需手动关闭
  },
  // 音乐室支线 - 埃莉诺的绝唱
  'music_room_complete': {
    id: 'music_room_complete',
    title: '记忆碎片：未完成的乐章',
    content: '我咳血了。阿斯特哭了。\n我对他说，不要悲伤，等我走了，把乐器留在音乐室里，总有一天，会有人让它们再次歌唱。',
    trigger: { type: 'flag', key: 'side_music_completed', value: true },
    character: 'elenor',
    autoClose: 6000
  },
  // 管家支线 - 兄弟的决裂
  'butler_reconciliation': {
    id: 'butler_reconciliation',
    title: '记忆碎片：兄弟之约',
    content: '弟弟，原谅我。我本想让你继承庄园，却把你困在了这里七年。',
    trigger: { type: 'flag', key: 'side_butler_completed', value: true },
    character: 'astre',
    autoClose: 4000
  },
  // 地下支线 - 托马斯的最后
  'underground_complete': {
    id: 'underground_complete',
    title: '记忆碎片：地下的回响',
    content: '亲爱的玛格丽特，我可能无法按时回来。这里的发现太过惊人……如果我出了什么事，请来找我。',
    trigger: { type: 'flag', key: 'side_underground_completed', value: true },
    character: 'thomas',
    autoClose: 5000
  },
  // 多周目特殊闪回
  'ngplus_awakening': {
    id: 'ngplus_awakening',
    title: '记忆碎片：轮回的烙印',
    content: '你又来了。\n\n不，不对……你从未离开过。',
    trigger: { type: 'playCount', min: 2 },
    character: 'astre',
    autoClose: 3000
  }
};
