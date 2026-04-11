export const journalEntries = {
  // 初始日记条目
  'initial': {
    id: 'initial',
    title: '探索开始',
    content: `
    <p>今天，我来到了传说中的幽暗庄园。这座庄园据说隐藏着无数的秘密和宝藏，我决定一探究竟。</p>
    <p>庄园的大门紧闭，但我找到了一把生锈的钥匙，成功进入了庄园。一进门，我就被眼前的景象所震撼 - 一座宏伟的大厅，中央矗立着一座雅典娜雕像。</p>
    <p>我注意到大厅的墙上挂着一幅古老的地图，上面标记着庄园的各个房间。我决定从画室开始探索。</p>
    `,
    unlockCondition: null, // 初始解锁
    date: '2024-01-01'
  },
  
  // 画室相关条目
  'studio_entry': {
    id: 'studio_entry',
    title: '神秘的画室',
    content: `
    <p>我进入了画室，这里充满了艺术的气息。墙上挂满了各种画作，其中一幅女子的肖像画特别引人注目。</p>
    <p>画室的角落里有一个颜料柜，里面存放着各种颜料和画笔。我注意到颜料柜后面的墙皮有几道细微的裂缝，裂缝中透出微弱的光。</p>
    <p>调色板上有一块干涸的颜料，颜色异常鲜艳。我用手指刮下一点粉末，闻起来有股奇怪的香味。</p>
    <p>画笔的笔尖夹着一根长长的金色发丝。我轻轻抽出，发丝在月光下闪着光。这可能是伊莲娜的头发。</p>
    `,
    unlockCondition: (store) => store.run.observed_details.includes('studio_entry_studio_cracks'),
    date: '2024-01-02'
  },
  
  // 音乐室相关条目
  'musicroom_entry': {
    id: 'musicroom_entry',
    title: '音乐室的秘密',
    content: `
    <p>我来到了音乐室，这里摆放着各种乐器，其中一架古老的钢琴格外显眼。</p>
    <p>我打开钢琴盖，发现琴弦上缠着一根白色的丝带，丝带上绣着"E.B."（埃莉诺·布莱克伍德）。这可能是埃莉诺的遗物。</p>
    <p>音乐室的墙上挂着一幅埃莉诺的画像，她看起来很悲伤。我注意到画像下方有一个隐蔽的抽屉，里面可能藏着什么秘密。</p>
    `,
    unlockCondition: (store) => store.run.observed_details.includes('musicroom_entry_music_piano_inside'),
    date: '2024-01-03'
  },
  
  // 地下室相关条目
  'basement_entry': {
    id: 'basement_entry',
    title: '幽暗的地下室',
    content: `
    <p>我进入了地下室，这里阴暗潮湿，空气中弥漫着一股霉味。墙壁上挂着一些古老的油灯，发出微弱的光芒。</p>
    <p>地下室的中央有一个巨大的石台，上面刻着一些奇怪的符号。石台周围摆放着一些古老的器具，看起来像是某种祭祀用品。</p>
    <p>我注意到墙壁上有一些奇怪的划痕，看起来像是某种符号。这些符号与石台上的符文有些相似。</p>
    <p>我感到有微弱的气流从某个方向吹来。顺着气流的方向，我发现墙角有一个隐蔽的通风口。通风口后面可能有秘密通道。</p>
    `,
    unlockCondition: (store) => store.run.observed_details.includes('basement_entry_basement_air_flow'),
    date: '2024-01-04'
  },
  
  // 大厅相关条目
  'hall_main': {
    id: 'hall_main',
    title: '大厅的奥秘',
    content: `
    <p>我回到了大厅，再次仔细观察中央的雅典娜雕像。雕像的底座背面刻着一行小字："智慧生于头，却死于沉默。"这可能与雕像谜题有关。</p>
    <p>壁炉左侧第三块砖似乎有些松动。我试着按了按，没有反应，但能感到后面是空的。也许需要特定物品或时机。</p>
    <p>大厅的墙上挂着一幅古老的地图，上面标记着庄园的各个房间。我注意到地图上有一些标记，可能指示着隐藏的宝藏位置。</p>
    `,
    unlockCondition: (store) => store.run.observed_details.includes('hall_main_hall_statue_base'),
    date: '2024-01-05'
  },
  
  // 特殊事件条目
  'special_event_1': {
    id: 'special_event_1',
    title: '管家的请求',
    content: `
    <p>今天，管家奥尔德斯·克劳利向我提出了一个请求。他的主人阿斯特·克劳利已经失踪了三天，最后一次见到他是在钟楼。</p>
    <p>奥尔德斯看起来非常担心，他希望我能找到他的主人。我答应了他的请求，决定前往钟楼一探究竟。</p>
    `,
    unlockCondition: (store) => store.flags.side_butler_available,
    date: '2024-01-06'
  },
  
  'special_event_2': {
    id: 'special_event_2',
    title: '画中女子',
    content: `
    <p>当我经过画室时，我注意到一幅肖像画中的女子似乎在看着我。突然，女子的声音在我耳边响起。</p>
    <p>她告诉我她被囚禁在这幅画中已经一百年了，只有找到传说中的真实之镜，才能解除这个诅咒。</p>
    <p>我决定帮助她，寻找真实之镜的下落。</p>
    `,
    unlockCondition: (store) => store.flags.side_painting_available,
    date: '2024-01-07'
  }
};