import { useGameStore } from '../../../store/gameStore'

export default {
  'library_entry': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">图书馆</h3>
    <p>推开沉重的橡木门，你踏入了一个仿佛被时间遗忘的知识殿堂。高耸的书架直达穹顶，空气中弥漫着纸张腐朽的气味和淡淡的墨水香。月光透过彩色玻璃窗，在红木地板上投下迷离的光斑，那些光斑的形状随着云层的移动缓缓变换，仿佛某种活着的符文。</p>
    <p>房间中央，一张巨大的书桌占据着核心位置，桌面上摊开着一本空白的书，书页边缘镶嵌着七种不同颜色的宝石凹槽。书桌的四个桌腿雕刻成狮鹫爪的形状，爪下踩着石球，石球可以转动。书架间的空隙里，隐约可见一些奇怪的工具——一架铜制星盘、一座布满灰尘的天球仪、以及几根用绳子悬挂的铅锤。</p>
    <p>管家的话在你脑中回响："谜题可能致命。"你需要决定如何开始探索。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('图书馆中有空白书、狮鹫爪桌腿、星盘和彩色玻璃窗')
    },
    options: [
      {
        text: '仔细检查书桌上的空白书',
        target: 'library_blank_book'
      },
      {
        text: '研究书桌的狮鹫爪桌腿',
        target: 'library_desk_legs'
      },
      {
        text: '探索书架寻找可疑的书籍',
        target: 'library_bookshelves'
      },
      {
        text: '检查星盘与天球仪',
        target: 'library_astrolabe'
      },
      {
        text: '观察天花板上的彩色玻璃窗',
        target: 'library_window'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      },
      {
        text: '无视复杂的线索，径直走到书架前拉动那本没有名字只有问号的书籍',
        target: 'library_pull_wisdom_ngplus',
        condition: () => {
          const store = useGameStore()
          return store.playCount > 0
        }
      }
    ]
  },
  'library_blank_book': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">空白书</h3>
    <p>你俯身观察那本空白的书。书页厚实，纸质坚韧，当你将手指放在纸面上时，能感到细微的凸起——是盲文？不，更像是某种密码压印。你试着用指甲轻轻划过，凸起的痕迹在灯光下投下微小的阴影，排列似乎有规律。</p>
    <p>书的封面是深棕色皮革，边缘烫金，封面上刻着一行拉丁文："Scientia est Clavis"（知识即钥匙）。封底则刻着一幅简图：七颗星星排成北斗七星的形状，但其中一颗星被圈了出来，旁边写着一个数字"4"。</p>
    <p>你注意到空白书的书脊处有一个小小的金属搭扣，可以打开，但搭扣需要正确的按压才能松开。</p>
    `,
    options: [
      {
        text: '尝试按压封面上的星星图案',
        target: 'library_press_star'
      },
      {
        text: '尝试解开金属搭扣',
        target: 'library_unlock_clasp'
      },
      {
        text: '继续翻看其他书页',
        target: 'library_other_pages'
      },
      {
        text: '暂时放下书，探索其他东西',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_press_star': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">按压星星</h3>
    <p>你按照封底简图的提示，按压北斗七星中被圈出的第四颗星。一声轻微的咔哒，书脊处的金属搭扣自动弹开。你小心地翻开封面，发现扉页上夹着一张泛黄的纸条，上面用工整的手写体写着：</p>
    <p style="font-style: italic;">"寻找那本无字天书，<br>
    它的秘密藏在七位学者的记忆里。<br>
    按出生年份排序，<br>
    他们的名字会告诉你正确的顺序。"</p>
    <p>纸条背面还列着七个名字，但部分被墨水污染，只能看清其中三个：</p>
    <ul>
      <li>亚里士多德（公元前384年）</li>
      <li>达·芬奇（1452年）</li>
      <li>哥白尼（1473年）</li>
    </ul>
    <p>另外四个名字模糊不清，但隐约能看出字迹的轮廓。你需要从书架上的书籍中找到完整的七位学者名单。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('七学者名单（部分）')
    },
    options: [
      {
        text: '去书架寻找完整名单',
        target: 'library_bookshelves'
      },
      {
        text: '继续研究书桌其他部分',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_unlock_clasp': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">解锁搭扣</h3>
    <p>你尝试直接强行打开搭扣。金属搭扣纹丝不动，反而触发了书桌内部的一个机关。只听"嗖"的一声，书桌侧面弹出一支短箭，擦着你的手臂飞过，钉在身后的书架上。好在你反应快，没有受伤，但这次鲁莽的行为让你出了一身冷汗。</p>
    `,
    options: [
      {
        text: '继续探索其他部分',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_other_pages': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">其他书页</h3>
    <p>你快速翻看空白书的其他页面，每一页都有不同的凸起图案，但看起来杂乱无章。当你翻到中间某页时，手指感到一阵刺痛——页面之间夹着一根极细的针。你猛地缩手，针上似乎涂有麻醉剂，你的手指开始发麻。幸好剂量不大，只是让你暂时无法灵活使用左手。</p>
    <p style="color: #ff6b6b;">状态：左手麻痹（会影响某些操作）</p>
    `,
    options: [
      {
        text: '继续探索',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_desk_legs': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">狮鹫爪桌腿</h3>
    <p>你蹲下身仔细观察四个桌腿。每个狮鹫爪下都踩着一个拳头大小的石球，石球可以转动。石球表面刻着不同的符号：第一个是太阳，第二个是月亮，第三个是星星，第四个是眼睛。你尝试转动石球，它们都能顺畅旋转，但每转一圈都会发出轻微的咔哒声，似乎内部有棘轮机构。</p>
    <p>在书桌的底部，你发现了一行刻字："凝视真理之眼，让日月星辰各归其位。"</p>
    `,
    options: [
      {
        text: '尝试转动太阳石球',
        target: 'library_turn_sun'
      },
      {
        text: '尝试转动月亮石球',
        target: 'library_turn_moon'
      },
      {
        text: '尝试转动星星石球',
        target: 'library_turn_star'
      },
      {
        text: '尝试转动眼睛石球',
        target: 'library_turn_eye'
      },
      {
        text: '尝试按特定顺序转动所有石球',
        target: 'library_combination'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_turn_sun': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">转动太阳石球</h3>
    <p>你转动太阳石球，它发出沉闷的咔哒声，转了三圈后停止。书桌轻微震动，但没有任何明显变化。你注意到，每转动一次，书桌上的空白书似乎有微光闪烁。</p>
    `,
    options: [
      {
        text: '返回',
        target: 'library_desk_legs'
      }
    ]
  },
  'library_turn_moon': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">转动月亮石球</h3>
    <p>转动月亮石球，它转了两圈半后卡住，无法再转动。书桌发出一声低鸣，抽屉方向传来轻微响声。</p>
    `,
    options: [
      {
        text: '返回',
        target: 'library_desk_legs'
      }
    ]
  },
  'library_turn_star': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">转动星星石球</h3>
    <p>星星石球可以无限制转动，但每转一圈，天花板上的彩色玻璃窗似乎改变颜色。</p>
    `,
    options: [
      {
        text: '返回',
        target: 'library_desk_legs'
      }
    ]
  },
  'library_turn_eye': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">转动眼睛石球</h3>
    <p>眼睛石球转动时，你会听到一种类似心跳的咚咚声，从书架深处传来。</p>
    `,
    options: [
      {
        text: '返回',
        target: 'library_desk_legs'
      }
    ]
  },
  'library_combination': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">石球组合</h3>
    <p>你决定尝试按某种顺序转动四个石球。你回忆起封底简图中的数字"4"，以及"知识即钥匙"的提示。或许顺序与七学者名单有关？但你目前只知道三个名字。</p>
    <p>你可以先尝试盲猜，但失败可能触发陷阱。</p>
    `,
    options: [
      {
        text: '尝试"太阳→月亮→星星→眼睛"的顺序',
        target: 'library_combo_fail'
      },
      {
        text: '尝试"眼睛→太阳→月亮→星星"的顺序',
        target: 'library_combo_fail'
      },
      {
        text: '先寻找更多线索',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_combo_fail': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">组合失败</h3>
    <p>当你按照选择的顺序转动石球后，书桌发出一声刺耳的金属摩擦声，四个狮鹫爪突然收紧，石球被牢牢锁死。一股黑烟从书桌缝隙中冒出，熏得你直咳嗽。虽然没有受伤，但石球暂时无法再转动，你必须找到解除锁定的方法。</p>
    <p style="color: #ff6b6b;">状态：石球锁定（需要其他线索才能重置）</p>
    `,
    options: [
      {
        text: '继续探索',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_bookshelves': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">书架探索</h3>
    <p>图书馆的书架如同迷宫，每一排都有数米高。你发现有些书脊上没有任何文字，只有烫金的符号；有些书则标有学者的名字。你决定：</p>
    `,
    options: [
      {
        text: '寻找与七学者有关的书籍',
        target: 'library_scholar_books'
      },
      {
        text: '注意那些书脊突出的书籍',
        target: 'library_protruding_books'
      },
      {
        text: '检查书架之间的空隙',
        target: 'library_gaps'
      },
      {
        text: '阅读书架侧面的分类标签',
        target: 'library_labels'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_scholar_books': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">学者书籍</h3>
    <p>你在书架间穿梭，很快找到了几本传记和著作：</p>
    <ul>
      <li>《亚里士多德全集》</li>
      <li>《达·芬奇笔记》</li>
      <li>《天体运行论》（哥白尼）</li>
      <li>还有一本《自然哲学的数学原理》（牛顿），但封面上有血迹？</li>
      <li>一本《几何原本》（欧几里得）</li>
      <li>一本《梦的解析》（弗洛伊德），但书页被撕掉了一半</li>
      <li>一本《时间简史》（霍金），却是全新的</li>
    </ul>
    <p>你注意到这些书的排列顺序似乎是随机的。你尝试按照封底纸条的提示"按出生年份排序"，但你需要知道所有七位学者的生卒年。</p>
    `,
    options: [
      {
        text: '仔细翻阅每本书，寻找年份信息',
        target: 'library_find_years'
      },
      {
        text: '根据已知年份，尝试排序',
        target: 'library_sort_attempt'
      },
      {
        text: '返回',
        target: 'library_bookshelves'
      }
    ]
  },
  'library_find_years': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">寻找年份</h3>
    <p>你快速翻阅这些书，在扉页或前言中找到了年份：</p>
    <ul>
      <li>亚里士多德：前384年</li>
      <li>欧几里得：约前325年</li>
      <li>哥白尼：1473年</li>
      <li>达·芬奇：1452年</li>
      <li>牛顿：1643年</li>
      <li>弗洛伊德：1856年</li>
      <li>霍金：1942年</li>
    </ul>
    <p>但你还发现了一个异常：这些书并非全部是原著，有些是后人编纂的，其中《梦的解析》的书页中夹着一张小纸条，写着："顺序即为答案，但小心不要唤醒不该唤醒的东西。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('完整七学者名单及年份')
    },
    options: [
      {
        text: '按年份排序',
        target: 'library_scholar_order'
      },
      {
        text: '注意纸条的警告，再检查一下书籍',
        target: 'library_check_books'
      },
      {
        text: '返回',
        target: 'library_bookshelves'
      }
    ]
  },
  'library_check_books': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">检查书籍</h3>
    <p>你仔细检查每本书，发现《梦的解析》的书页被撕掉的部分似乎是被刻意移除的，留下的半页上有字："第五位……镜子中的……"另外，《几何原本》的书脊处有轻微凸起，你摸到了一个隐藏的开关。按下后，书架后传来一声轻响。</p>
    `,
    options: [
      {
        text: '查看书架后的隐藏空间',
        target: 'library_hidden_niche'
      },
      {
        text: '先排序书籍',
        target: 'library_scholar_order'
      },
      {
        text: '返回',
        target: 'library_bookshelves'
      }
    ]
  },
  'library_hidden_niche': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">隐藏暗格</h3>
    <p>你移开《几何原本》，书架背面露出一个巴掌大的暗格，里面放着一个铜质小圆盘，上面刻着七颗星星和七条弧线，与火漆徽记相同。圆盘中央有一个可以旋转的指针。背面刻着："将此盘置于书桌凹槽，可显真章。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('星盘钥匙')
    },
    options: [
      {
        text: '返回书桌，将圆盘放入空白书的凹槽',
        target: 'library_use_disk'
      },
      {
        text: '继续探索书架',
        target: 'library_bookshelves'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_use_disk': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">使用星盘钥匙</h3>
    <p>你将铜质圆盘放入空白书的七宝石凹槽中，圆盘与凹槽完美契合。你旋转指针，按照七学者的年份顺序，将指针依次指向对应的星星图案（每个学者对应一颗星）。每指对一位，一枚宝石凹槽就会亮起。全部七位点亮后，空白书的书页上浮现出文字：</p>
    <p style="font-style: italic;">"拉出象征智慧的书脊，<br>
    但勿触及其他，<br>
    否则你将面对时间的审判。"</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('完整线索：拉动哪本书')
    },
    options: [
      {
        text: '前往书架拉动智慧之书',
        target: 'library_pull_wisdom'
      },
      {
        text: '先解除石球锁定（若锁定）',
        target: 'library_unlock_stones'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_pull_wisdom': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">智慧之书</h3>
    <p>你现在知道要拉动那本无书名、只有烫金问号的书（即智慧之书）。你走到书架前，毫不犹豫地拉动它。随着一声清脆的机械声，书桌缓缓打开，露出一枚蓝宝石徽章，以及一本皮质封面的日记。</p>
    <p style="color: #4ecdc4;">获得物品：蓝宝石徽章</p>
    <p style="color: #4ecdc4;">获得物品：克劳利的日记</p>
    <p>（日记内容：记述了庄园的秘密，特别提到钟楼谜题的关键是"将时间调至月升之时，听指针的低语"。）</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('蓝宝石徽章')
      store.addMedal()
      store.addItem('克劳利的日记')
      store.showToast('获得蓝宝石徽章和克劳利的日记！')
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_protruding_books': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">突出的书籍</h3>
    <p>你注意到有几本书的书脊比其他书突出一些，似乎是被故意放置的。这些书分别是：</p>
    <ul>
      <li>《密码学简史》（书脊有锁形图案）</li>
      <li>《七重天文学》（书脊有星形图案）</li>
      <li>《无字天书》（只有烫金问号，无书名）</li>
      <li>《时间之书》（书脊有沙漏图案）</li>
    </ul>
    `,
    options: [
      {
        text: '拉动《密码学简史》',
        target: 'library_trap_needle'
      },
      {
        text: '拉动《七重天文学》',
        target: 'library_trap_poison'
      },
      {
        text: '拉动《无字天书》',
        target: 'library_hidden_passage'
      },
      {
        text: '拉动《时间之书》',
        target: 'library_trap_clock'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_trap_needle': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">毒针陷阱</h3>
    <p>当你拉动《密码学简史》时，书架后弹出一排细针，你勉强侧身避开，但手臂被划伤，毒素让你眩晕。你退出图书馆，需要休息。</p>
    <p style="color: #ff6b6b;">状态：中毒（暂时无法再次尝试）</p>
    <p style="font-style: italic; color: #ff6b6b;">你的意识逐渐模糊。在最后的瞬间，你听见管家奥尔德斯的声音从遥远的地方传来："鲁莽是解谜的大敌。" 世界陷入黑暗。</p>
    `,
    options: [
      {
        text: '从最近的存档点重新尝试',
        target: 'library_entry'
      },
      {
        text: '回到大厅，暂时放弃这个房间',
        target: 'hall_main'
      }
    ]
  },
  'library_trap_poison': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">毒气陷阱</h3>
    <p>拉动《七重天文学》，一股绿色气体喷出，你捂住口鼻，但仍吸入少许，视线模糊。你踉跄逃出图书馆，在门口昏倒。醒来时发现自己在大厅，管家递给你一杯解药，并警告你"不要鲁莽"。</p>
    <p style="color: #ff6b6b;">状态：虚弱（但未死）</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      },
      {
        text: '重新尝试图书馆谜题',
        target: 'library_entry'
      }
    ]
  },
  'library_trap_clock': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">书架陷阱</h3>
    <p>拉动《时间之书》，书架后传来巨大的齿轮声，整个书架开始移动，你差点被夹在缝隙中。你迅速翻滚逃脱，但书架位置改变，图书馆内部结构似乎发生了变化。你失去了方向感，不得不退回大厅。</p>
    <p style="color: #ff6b6b;">状态：图书馆布局改变（某些区域暂时无法进入）</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_hidden_passage': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">隐藏通道</h3>
    <p>当你拉动《无字天书》时，书架无声地滑开，露出一条狭窄的通道。通道尽头是一间密室，里面放着一个精致的匣子。你打开匣子，里面是一枚银色的徽章，背面刻着："第一道谜题——智慧之证。"</p>
    <p>但奇怪的是，你并没有真正解开书桌的谜题。管家奥尔德斯的声音从通道外传来："取巧者将受诅咒。" 话音刚落，徽章在你手中变得滚烫，你不得不丢下它，通道也重新关闭。你被弹回图书馆，一无所获。</p>
    <p style="color: #ff6b6b;">（未获得徽章，但发现了隐藏通道）</p>
    `,
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_astrolabe': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">星盘与天球仪</h3>
    <p>星盘和天球仪放置在书架旁的一张高脚桌上。星盘由多层圆盘组成，可以旋转；天球仪上标注着星座和行星轨道。星盘的边缘刻着一圈铭文："当七曜归位，真理之门将敞开。" 天球仪的底座上有一行字："黄道十二宫，唯缺一宫。"</p>
    <p>你仔细观察，发现天球仪上的黄道十二宫符号中，天蝎座的符号被磨掉了，取而代之的是一小块空白区域，似乎可以镶嵌什么东西。星盘的指针可以转动，但需要特定的时间与星位数据。</p>
    `,
    options: [
      {
        text: '尝试调整星盘至当前时间',
        target: 'library_astrolabe_fail'
      },
      {
        text: '检查天球仪的空白区域',
        target: 'library_globe_gap'
      },
      {
        text: '使用星盘钥匙（若有）',
        target: 'library_astrolabe_success'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_astrolabe_fail': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">星盘失败</h3>
    <p>你随意调整星盘，试图让它对应现在的星空，但星盘毫无反应。当你转动过度时，星盘内部突然发出一声脆响，指针卡死，你无法再操作它。</p>
    <p style="color: #ff6b6b;">状态：星盘损坏（需修复）</p>
    `,
    options: [
      {
        text: '继续探索',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_globe_gap': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">天球仪空白</h3>
    <p>你注意到天球仪上天蝎座的位置确实有一个小凹槽，形状与你之前发现的铜质圆盘（星盘钥匙）相似？实际上，那个圆盘是用于空白书的。但这里是否也有类似的设计？你仔细搜索，在天球仪的底部发现一个抽屉，里面有一块天蝎座的小金属片，可以嵌入空白处。你嵌入后，天球仪开始缓慢自转，最终停止时，一根指针指向了星盘上的某个刻度。你记下这个刻度。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('星盘刻度（可用于校准）')
    },
    options: [
      {
        text: '尝试用此刻度调整星盘',
        target: 'library_astrolabe_calibrate'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_astrolabe_calibrate': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">星盘校准</h3>
    <p>你将星盘调整到对应刻度，星盘中央升起一个小台座，上面放着一枚银质徽章，但这次徽章上没有诅咒，因为你是通过正确途径获得的。但等等，这是否意味着你提前获得了徽章？实际上，图书馆的徽章应该是蓝宝石徽章，这枚银质徽章可能是另一个谜题的钥匙。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('银质徽章')
    },
    options: [
      {
        text: '继续探索图书馆',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_astrolabe_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">星盘成功</h3>
    <p>你使用星盘钥匙，星盘发出耀眼的光芒，显示出一条通往隐藏宝藏的路径。但这只是一个辅助线索，真正的图书馆徽章仍需要通过其他方式获得。</p>
    `,
    options: [
      {
        text: '继续探索',
        target: 'library_entry'
      }
    ]
  },
  'library_window': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">彩色玻璃窗</h3>
    <p>彩色玻璃窗在图书馆北墙，由七块不同颜色的玻璃拼成：红、橙、黄、绿、蓝、靛、紫。月光透过时，在地板上投下七色光斑。你发现光斑的位置随着时间移动，而且似乎与书架上的某些书籍位置有对应关系。当光斑落在某本书上时，那本书的书脊会微微发光。</p>
    `,
    options: [
      {
        text: '等待光斑移动，记录对应的书',
        target: 'library_light_tracking'
      },
      {
        text: '尝试移动窗户上的玻璃',
        target: 'library_window_move'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_light_tracking': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">光斑追踪</h3>
    <p>你耐心观察光斑的移动。当红色光斑落在一本《红字》上时，书脊发光；橙色光斑落在《柑橘与柠檬啊》上；黄色落在《黄衣王》上；绿色落在《绿野仙踪》上；蓝色落在《蓝宝石》上；靛色落在一本没有标题的靛蓝色书上；紫色落在《紫罗兰》上。你发现这些书恰好对应七种颜色，而且它们的书脊上都标有一个数字：红-1，橙-2，黄-3，绿-4，蓝-5，靛-6，紫-7。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('颜色数字对应关系')
    },
    options: [
      {
        text: '尝试按数字顺序拉动书脊',
        target: 'library_color_pull'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },

  'library_color_pull': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">颜色顺序拉动</h3>
    <p>你按照数字顺序拉动书脊，每拉一下，对应颜色的玻璃窗就会变亮。当七本书都被拉动后，彩色玻璃窗突然全部亮起，投射出一道光束，照在书桌的空白书上。空白书自动翻开，显示出完整的解谜指示（即前面通过学者名单获得的提示）。但如果你还没有获得学者名单，这里会给出一个不同的解谜路径。</p>
    `,
    options: [
      {
        text: '阅读书页上的指示',
        target: 'library_blank_book_reveal'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_blank_book_reveal': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">空白书揭示</h3>
    <p>书页上显示："欲得智慧之证，需将七色归位。按颜色顺序拉动书脊，书桌将开启。" 你照做后，书桌打开，获得蓝宝石徽章和日记。但注意，如果你之前已经通过学者路径获得了徽章，这里可能重复或触发其他机关。为避免矛盾，可以设计为两种路径最终都导向获得徽章，但细节不同。</p>
    <p style="color: #4ecdc4;">获得物品：蓝宝石徽章</p>
    <p style="color: #4ecdc4;">获得物品：克劳利的日记</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      if (!store.hasItem('蓝宝石徽章')) {
        store.addItem('蓝宝石徽章')
        store.addMedal()
        store.addItem('克劳利的日记')
        store.showToast('获得蓝宝石徽章和克劳利的日记！')
      }
    },
    options: [
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_unlock_stones': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">解除石球锁定</h3>
    <p>如果你之前错误操作导致石球锁定，需要找到重置方法。你可以在书架中寻找一本《机关术入门》，里面提到："狮鹫爪石球的锁定可由'时间的逆流'解除，即按相反顺序拉动对应书脊。" 你需要找到正确的书脊顺序。或者，你可以通过彩色玻璃窗的线索找到重置顺序。</p>
    `,
    options: [
      {
        text: '按相反顺序拉动彩色书脊',
        target: 'library_reset_success'
      },
      {
        text: '尝试其他方法',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },
  'library_reset_success': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">石球重置成功</h3>
    <p>你按照颜色数字相反顺序拉动书脊（7-6-5-4-3-2-1），四个石球同时发出一声闷响，重新可以转动。</p>
    <p style="color: #4ecdc4;">状态：石球解锁</p>
    `,
    options: [
      {
        text: '继续解谜',
        target: 'library_entry'
      },
      {
        text: '返回大厅',
        target: 'hall_main'
      }
    ]
  },

  'library_sort_attempt': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">尝试排序</h3>
    <p>你开始整理书架，将书籍按学科分类。但分类标准不统一，有些书属于多个学科。你感到困惑，决定先寻找更明确的指引——比如书架上是否有隐藏的编号或颜色标记。</p>
    `,
    options: [
      { text: '继续寻找线索', target: 'library_labels' },
      { text: '返回图书馆', target: 'library_entry' }
    ]
  },
  'library_fail': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">操作失败</h3>
    <p>你随意拉动了书架上的几本书，但什么也没有发生。书架纹丝不动，只是扬起了灰尘。你意识到需要更精确的顺序或线索。你决定先退出去，再仔细研究那些书籍的年份和作者。</p>
    `,
    options: [
      { text: '返回图书馆', target: 'library_entry' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'library_gaps': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">书架空隙</h3>
    <p>书架之间的缝隙非常狭窄，你侧身挤进去，发现里面只有厚厚的蛛网和灰尘。墙壁上什么也没有，只有一行用铅笔写的小字："别找了，秘密不在缝隙里，而在书里。" 你失望地退出来。</p>
    `,
    options: [
      { text: '返回书架前', target: 'library_bookshelves' },
      { text: '返回大厅', target: 'hall_main' }
    ]
  },
  'library_labels': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">书架标签</h3>
    <p>你仔细查看了书架上模糊的标签，隐约辨认出"天文"、"炼金"、"历史"、"诗歌"四个分类。每个分类下面还有一行小字：天文（智慧）、炼金（转化）、历史（记忆）、诗歌（情感）。这似乎暗示着七学者对应的学科领域。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addClue('书架四分类对应学科领域')
    },
    options: [
      { text: '开始整理', target: 'library_sort_attempt' },
      { text: '返回中心', target: 'library_entry' }
    ]
  },
  'library_scholar_order': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">学者排序</h3>
    <p>你按生卒年将七本书排序：亚里士多德（前384）、欧几里得（前325）、达·芬奇（1452）、哥白尼（1473）、牛顿（1643）、弗洛伊德（1856）、霍金（1942）。排好后，书架背后传来机械声，一个暗格弹开，里面是一张羊皮纸，画着庄园地下的结构图——包括一个未被标注的密室。</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('庄园地下结构图')
      store.addClue('地下存在未标注的密室')
    },
    options: [
      { text: '返回图书馆', target: 'library_entry' }
    ]
  },
  'library_window_move': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">移动玻璃窗</h3>
    <p>彩色玻璃窗的窗框是固定的，无法移动。但窗台上有一个小小的铜制手柄，你试着转动，窗户上的七块玻璃竟然可以独立倾斜。你调节每块玻璃的角度，发现它们可以改变光斑的位置。</p>
    `,
    options: [
      { text: '返回图书馆', target: 'library_entry' }
    ]
  },
  'library_pull_wisdom_ngplus': {
    desc: `
    <h3 style="color: #d4af37; margin-bottom: 20px;">前世记忆</h3>
    <p>你的脑海中浮现出前世为了解开这个图书馆谜题，而在无数枯燥的典籍、盲文、星图和拉丁文中苦苦挣扎的场景。现在的你根本不想再重温一遍学者们的生辰八字了。</p>
    <p>你径直走到那个特定的书架前，甚至连看都没看周围诱导你的陷阱书籍，准确地抽出了那本只有烫金问号的无字天书。</p>
    <p>随着一声清脆的机械声，巨大的书桌缓缓打开。你冷漠地看着里面浮现出来的蓝宝石徽章和克劳利的日记，犹如拿走一件本来就属于自己的失物。</p>
    <p>在那一瞬间，你仿佛看到了曾经在这里因为毒针和机关死去无数次的"自己"。知识确实是力量，但跨越生死的记忆，是比知识更可怕的挂弊。</p>
    <p style="color: #4ecdc4;">获得物品：蓝宝石徽章</p>
    <p style="color: #4ecdc4;">获得物品：克劳利的日记</p>
    `,
    on_enter: () => {
      const store = useGameStore()
      store.addItem('蓝宝石徽章')
      store.addMedal()
      store.addItem('克劳利的日记')
      store.showToast('获得蓝宝石徽章和克劳利的日记！')
    },
    options: [
      {
        text: '拿着日记和徽章离开',
        target: 'hall_main'
      }
    ]
  }
}
