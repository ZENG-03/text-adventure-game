from engine import Scene, Option

def build_scenes():
    scenes = {}

    # --- 开场模块 ---
    scenes["title"] = Scene(
        "title",
        """《谜语遗产：七重谜域》
        
黑幕中，七条弧线交织的徽记在黑暗中旋转，逐渐化作七道光芒...
远处，一座维多利亚风格的庄园若隐若现。""",
        [
            Option("开始新游戏", "opening_studio"),
            Option("查看成就 (暂未开放)", "title"),
        ]
    )

    scenes["opening_studio"] = Scene(
        "opening_studio",
        """你坐在自己的工作室里。壁炉的火光跳动，将房间染成暖橙色。
桌上摊开着侦探笔记，旁边放着一封午夜来信。

信上写着：“致敏锐的探索者：当月光照亮七面镜，谜语的血脉将再度流淌... ——阿斯特·克劳利”
信纸背面是一张手绘地图，指向城郊迷雾山谷中的一座古老庄园。""",
        [
            Option("立刻动身", "opening_gate"),
            Option("研究地图", "opening_studio_map")
        ]
    )
    
    scenes["opening_studio_map"] = Scene(
        "opening_studio_map",
        "地图上标注着七颗星，角落写着：“迷雾山谷只在满月之夜显现入口。若错过时机，请等下一次月圆。”\n今晚正是满月。",
        [Option("立刻动身", "opening_gate")]
    )

    scenes["opening_gate"] = Scene(
        "opening_gate",
        """马车停在迷雾山谷中。一座巨大的铁艺大门矗立在雾中。
大门虚掩着，你推开铁门，踏入一条鹅卵石小径。
尽头是一扇橡木门，门上镶嵌着七色玻璃。你推门而入...""",
        [Option("进入大厅", "hall_initial_enter")]
    )

    scenes["hall_initial_enter"] = Scene(
        "hall_initial_enter",
        """门厅宏伟，水晶吊灯蒙着薄灰。壁炉台上的油灯还在冒着青烟。
管家奥尔德斯如同幽灵般出现。

“欢迎，探索者。庄园内设有七道谜题，分别位于七个房间。
每解开一道，你将获得一枚宝石徽章。集齐七枚徽章，便可开启密室。”
他冷冷地看着你：“你确定要开始吗？”""",
        [
            Option("我准备好了", "hall_main"),
            Option("打听庄园历史", "hall_history")
        ]
    )
    
    scenes["hall_history"] = Scene(
        "hall_history",
        "管家冷冷地回答：“主人多尔法尔·索尔维是密码学家，这里的一切都是他的杰作。其余的，你自己去发现。”",
        [Option("我准备好了，开始探索", "hall_main")]
    )

    # --- 大厅与分支 ---
    scenes["hall_main"] = Scene(
        "hall_main",
        """你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。
壁炉里有烧焦的纸片。""",
        [
            Option("仔细观察大厅壁炉的纸片", "hall_fireplace"),
            Option("检查大厅的雕像 (谜题一)", "puzzle_statues"),
            Option("前往图书馆 (谜题二)", "library_entry")
        ]
    )

    def gain_clue_paper(state):
        state.add_clue("烧焦的纸片 (凯撒密码提示)")
        
    scenes["hall_fireplace"] = Scene(
        "hall_fireplace",
        """你用壁炉钳拨开灰烬，找到几片未完全烧毁的纸。
写着：“第五个房间的钥匙藏在音乐里... 小心音不准...”
还有一串数字：11-15-21-18-20-5-19-25。好像是凯撒密码。""",
        [
            Option("返回大厅", "hall_main")
        ],
        on_enter=gain_clue_paper
    )

    scenes["puzzle_statues"] = Scene(
        "puzzle_statues",
        """大厅两侧各立着四座大理石雕像：雅典娜、阿波罗、赫尔墨斯、阿尔忒弥斯。
每座底部都有诗句，并可以旋转。
你需要按一定顺序排列它们。""",
        [
            Option("按神话对应星座顺序排列 (雅典娜=1(头)，阿波罗=5(火/太阳狮子座)...)", "statues_solved"),
            Option("按诗句首字母解密", "hall_main", effect=lambda s: print("线索不足，暂无头绪.")),
            Option("返回大厅", "hall_main")
        ]
    )

    def gain_statue_medal(state):
        if not state.has_item("起始徽章"):
            state.add_item("起始徽章")
            state.add_item("机械齿轮")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：起始徽章、机械齿轮】")

    scenes["statues_solved"] = Scene(
        "statues_solved",
        """你按照正确的星象逻辑旋转雕像，大厅中央的地板缓缓开启。
从中升起一个精致的木盒。你打开木盒，里面有一枚【起始徽章】和一个【机械齿轮】。""",
        [Option("收起物品，返回大厅", "hall_main")],
        on_enter=gain_statue_medal
    )

    # --- 大厅与分支 更新版 ---
    # 需要在hall_main更新选项，增加前往音乐室、温室、画室、地下室和最终密室
    scenes["hall_main"] = Scene(
        "hall_main",
        """你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。
壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。""",
        [
            Option("仔细观察大厅壁炉的纸片", "hall_fireplace"),
            Option("检查大厅的雕像 (谜题一)", "puzzle_statues"),
            Option("前往书房/图书馆 (谜题二)", "library_entry"),
            Option("前往音乐室 (谜题三)", "musicroom_entry"),
            Option("前往温室花房 (谜题四)", "greenhouse_entry"),
            Option("前往二楼画室 (谜题五)", "studio_entry"),
            Option("前往地下室 (谜题六)", "basement_entry"),
            Option("前往东侧钟楼 (谜题七)", "clocktower_entry"),
            Option("开启中央密室大门 (结局)", "final_chamber_entry", 
                   condition=lambda s: s.get("hall_medal_count") >= 7) # 收集满7个即可触发最后
        ]
    )
    scenes["library_entry"] = Scene(
        "library_entry",
        """图书馆高耸的书架直达穹顶。中央有一张巨大的书桌，桌面上摊开着一本空白的书。
书桌腿是狮鹫爪，踩着石球。""",
        [
            Option("仔细检查书桌上的空白书", "library_blank_book"),
            Option("探索书架寻找可疑的书籍", "library_bookshelves"),
            Option("返回大厅", "hall_main")
        ]
    )
    
    scenes["library_blank_book"] = Scene(
        "library_blank_book",
        """书封面刻着“知识即钥匙”，封底画着七颗星，第四颗被圈住，写着“4”。
书脊处有一个金属搭扣。""",
        [
            Option("按压封面上的第四颗星图案", "library_press_star"),
            Option("强行解开金属搭扣", "library_unlock_clasp", effect=lambda s: print("嗖！一支短箭擦过你的手臂！")),
            Option("返回图书馆", "library_entry")
        ]
    )
    
    def gain_scholar_clue(state):
        state.add_clue("七学者名单 (部分)")

    scenes["library_press_star"] = Scene(
        "library_press_star",
        """咔哒。搭扣弹开。里面有一张纸条：
“寻找无字天书，它的秘密藏在七位学者的记忆里。按出生年份排序。”
名单上能看清：亚里士多德、达·芬奇、哥白尼。""",
        [Option("去书架寻找完整名单", "library_bookshelves")],
        on_enter=gain_scholar_clue
    )
    
    scenes["library_unlock_clasp"] = Scene(
        "library_unlock_clasp",
        "你触发了陷阱！短箭飞出，差点射中你。",
        [Option("返回", "library_entry")]
    )

    scenes["library_bookshelves"] = Scene(
        "library_bookshelves",
        """你在书架间穿梭，找到了多本传记：《亚里士多德全集》《达·芬奇笔记》《天体运行论》《自然哲学的数学原理》《几何原本》《梦的解析》《时间简史》。""",
        [
            Option("仔细翻阅每本书，寻找年份并排序", "library_scholar_order", condition=lambda s: s.has_clue("七学者名单 (部分)")),
            Option("检查《梦的解析》等书的异常", "library_check_books"),
            Option("返回", "library_entry")
        ]
    )
    
    def gain_library_medal(state):
        if not state.has_item("智慧徽章"):
            state.add_item("智慧徽章")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：智慧徽章】")

    scenes["library_scholar_order"] = Scene(
        "library_scholar_order",
        """你按生卒年成功将书籍排序！
书架缓缓移开，露出一个暗格，里面放着一枚闪闪发亮的【智慧徽章】。""",
        [Option("拿走徽章，返回大厅", "hall_main")],
        on_enter=gain_library_medal
    )
    
    scenes["library_check_books"] = Scene(
        "library_check_books",
        """《梦的解析》被撕掉了半页，写着“第五位...镜子中的...”。
《几何原本》书脊处有一个隐藏开关。""",
        [Option("按下隐藏开关", "library_scholar_order", effect=lambda s: print("开关咔哒一声响了..."))],
    )

    # --- 音乐室谜题 ---
    scenes["musicroom_entry"] = Scene(
        "musicroom_entry",
        """音乐室位于庄园一层西侧，宛如一座微型歌剧院。
中央矗立着巨大的管风琴，琴键上散落着七枚金属键帽。
左侧有三角钢琴，右侧有定音鼓和装满乐器的展柜。
角落里排列着七枚音叉。""",
        [
            Option("检查管风琴", "musicroom_organ"),
            Option("查看三角钢琴和乐谱", "musicroom_piano"),
            Option("观察音叉与乐器", "musicroom_instruments"),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["musicroom_organ"] = Scene(
        "musicroom_organ",
        """管风琴有七个音栓，但拉不动。侧面有一个齿轮状的凹槽。
背面有一个手摇鼓风机，需要提供气流才能发声。""",
        [
            Option("放入金属键帽并尝试拉音栓", "musicroom_organ", effect=lambda s: print("音栓被锁住了...没反应。")),
            Option("嵌入机械齿轮", "musicroom_organ_unlock", condition=lambda s: s.has_item("机械齿轮")),
            Option("返回音乐室", "musicroom_entry")
        ]
    )

    scenes["musicroom_organ_unlock"] = Scene(
        "musicroom_organ_unlock",
        """机械齿轮完美嵌入。齿轮转动，音栓锁扣完全松开！
但还需要鼓风机供气和相应的弹奏逻辑。""",
        [
            Option("摇动并在供气状态下放置键帽演奏", "musicroom_solved"),
            Option("离开", "musicroom_entry")
        ]
    )

    def gain_music_medal(state):
        if not state.has_item("旋律徽章"):
            state.add_item("旋律徽章")
            state.add_item("调音扳手")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：旋律徽章、调音扳手】")

    scenes["musicroom_solved"] = Scene(
        "musicroom_solved",
        """管风琴发出雄浑的轰鸣声，正确的旋律与音高产生了共鸣！
旁边的地板滑开，露出了隐藏的【旋律徽章】和一把【调音扳手】。""",
        [Option("收好物品，离开", "musicroom_entry")],
        on_enter=gain_music_medal
    )

    scenes["musicroom_piano"] = Scene(
        "musicroom_piano",
        """三角钢琴的琴盖布满灰尘。琴谱架上放着本《七重奏鸣曲》，上面画着一个七角星和音符。
但钢琴由于失调，弹出来的声音极其刺耳。也许需要某样工具才能校准。""",
        [
            Option("用调音扳手进行校准", "musicroom_piano_tuned", condition=lambda s: s.has_item("调音扳手")),
            Option("离开", "musicroom_entry")
        ]
    )

    scenes["musicroom_piano_tuned"] = Scene(
        "musicroom_piano_tuned",
        """你利用扳手将钢琴调回标准音高...钢琴响起了纯洁清澈的回音！
在琴底暗格，你发现了一些【七色花苞】。""",
        [Option("装起花苞并返回", "musicroom_entry")],
        on_enter=lambda s: s.add_item("七色花苞")
    )

    scenes["musicroom_instruments"] = Scene(
        "musicroom_instruments",
        """你看了看七把音叉，分别对应着展柜里的七件乐器：小提琴、中提琴、长笛...
似乎每件乐器都有自己的共鸣频率。""",
        [Option("返回", "musicroom_entry")]
    )

    # --- 温室花房谜题 ---
    scenes["greenhouse_entry"] = Scene(
        "greenhouse_entry",
        """推开生锈的铁门，潮湿腐朽的热带花园废墟气味扑面而来。
中央有一棵巨大的干枯古树被七个花坛包围，树干写着：“生命之水，需以七色之血唤醒。”
北边有工具房和水井。""",
        [
            Option("检查中央古树与石盆", "greenhouse_tree"),
            Option("探索七个花坛与种花", "greenhouse_flower_beds"),
            Option("去工具房寻找线索和工具", "greenhouse_tool_shed"),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["greenhouse_tree"] = Scene(
        "greenhouse_tree",
        """古树底部有个石盆，装满浑浊的水。底下埋着什么东西，直接用手摸可能会中毒。""",
        [
            Option("伸手捞取", "greenhouse_tree", effect=lambda s: print("啊！被刺了一下，稍微有些中毒发麻。")),
            Option("用长柄夹夹出", "greenhouse_tree_safe", condition=lambda s: s.has_item("长柄夹")),
            Option("返回", "greenhouse_entry")
        ]
    )

    scenes["greenhouse_tree_safe"] = Scene(
        "greenhouse_tree_safe",
        """你用夹子捞出一个铜盒，内部有一块【七色花琥珀】！
说明书上写着：“以七血（根茎叶花果种苗）滋养，可复生机。”""",
        [Option("收起琥珀", "greenhouse_entry")],
        on_enter=lambda s: s.add_item("七色花琥珀")
    )

    scenes["greenhouse_tool_shed"] = Scene(
        "greenhouse_tool_shed",
        """工具房有一本《温室养护手册》，上面有个带密码锁的木箱。
你还能在旁边的架子上顺手拿走一把长柄夹。""",
        [
            Option("拿走工具并破译木箱 (188)", "greenhouse_box_open"),
            Option("离开", "greenhouse_entry")
        ]
    )

    scenes["greenhouse_box_open"] = Scene(
        "greenhouse_box_open",
        """你输入了根据文本建成年份的密码 188。箱子开了！
你找到了【长柄夹】和【古树血提取剂】。""",
        [Option("返回", "greenhouse_entry")],
        on_enter=lambda s: (s.add_item("长柄夹"), s.add_item("古树血提取剂"))
    )

    def gain_greenhouse_medal(state):
        if not state.has_item("生命徽章"):
            state.add_item("生命徽章")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：生命徽章】 古树重生了！")

    scenes["greenhouse_flower_beds"] = Scene(
        "greenhouse_flower_beds",
        """花坛干涸，你需要七色花相关的道具、提取剂等生命元素唤醒古树。""",
        [
            Option("融合七彩琥珀、花苞与提取剂，唤醒古树", "greenhouse_solved", 
                condition=lambda s: s.has_item("七色花琥珀") and s.has_item("七色花苞") and s.has_item("古树血提取剂")),
            Option("没有足够的道具", "greenhouse_flower_beds", effect=lambda s: print("你需要更多的生命元素和植物血的提取物。")),
            Option("返回温室", "greenhouse_entry")
        ]
    )

    scenes["greenhouse_solved"] = Scene(
        "greenhouse_solved",
        """你将七色琥珀种下，并混合花苞与提取剂浇灌在古树底部的盆中。
奇迹发生了：枯萎的古树瞬间爆发出惊人的绿意，在茂密的树冠顶端，
一枚象征着生机的【生命徽章】正熠熠生辉！""",
        [Option("取下徽章并返回", "greenhouse_entry")],
        on_enter=gain_greenhouse_medal
    )

    # --- 画室谜题 (包含支线关联) ---
    scenes["studio_entry"] = Scene(
        "studio_entry",
        """画室位于庄园二层东侧。月光透过天窗洒落，照亮了满墙空白的画布。
只有画框上标注了相应的七色。
房间中央是一个巨大的调色板，旁边立着几块未雕琢的石头（矿石）。
最主要的墙壁上是一幅庞大的【肖像画】。""",
        [
            Option("检查巨大的调色板", "studio_palette"),
            Option("研究雕塑台上的矿石和柜子", "studio_sculpture"),
            Option("研究东墙的大幅肖像画", "studio_portrait"),
            Option("接取油画支线调查", "side_quest_painting", condition=lambda s: not s.get("side_quest_painting_done", False)),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["side_quest_painting"] = Scene(
        "side_quest_painting",
        """【支线：伊莲娜的哀叹】
你在画室角落找到了一本属于女主人伊莲娜的日记。
日记中记载：“阿斯特沉迷于谜语，我感觉他在变成另一个人...”
这段支线剧情让你更深刻理解了男主人的痴迷，和她最终未能完成的那幅画。""",
        [Option("将日记收好（完成支线）", "studio_entry")],
        on_enter=lambda s: (s.add_clue("伊莲娜的日记"), s.set("side_quest_painting_done", True))
    )

    scenes["studio_palette"] = Scene(
        "studio_palette",
        """调色板上有七个颜料槽，但这几个槽空空如也，连着看不到的输送管。
似乎需要某种机关来激活颜料。""",
        [Option("返回", "studio_entry")]
    )

    scenes["studio_sculpture"] = Scene(
        "studio_sculpture",
        """雕塑台上有七块原矿石。台底文字写道：将七石归位于光谱（红橙黄绿青蓝紫），可启颜料之源。""",
        [
            Option("按照光谱顺序排列归位", "studio_palette_active"),
            Option("放弃排列", "studio_entry")
        ]
    )

    scenes["studio_palette_active"] = Scene(
        "studio_palette_active",
        """随着你按照：赤、橙、黄、绿、青、蓝、紫的顺序排列。
一束光闪过后，远处的调色板开始涌出鲜活的【七色神秘颜料】！""",
        [Option("获取颜料并去肖像画前作画", "studio_entry")],
        on_enter=lambda s: s.add_item("七色神秘颜料")
    )

    def gain_studio_medal(state):
        if not state.has_item("色彩徽章"):
            state.add_item("色彩徽章")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：色彩徽章】")

    scenes["studio_portrait"] = Scene(
        "studio_portrait",
        """画像中是一位身着长袍的男子，手里拿着一面真正的椭圆形镜子镶嵌在画内。
你需要用七色神秘颜料在镜面作画才能解开秘密。""",
        [
            Option("在镜面上作画", "studio_solved", condition=lambda s: s.has_item("七色神秘颜料")),
            Option("没有颜料，无法作画", "studio_portrait", effect=lambda s: print("你需要先想办法激活调色板。")),
            Option("返回", "studio_entry")
        ]
    )

    scenes["studio_solved"] = Scene(
        "studio_solved",
        """你将七色颜料涂抹在镜子上，镜中混乱的颜色开始流转，最终形成了一个完美的色轮。
画框背后的暗门开启，里面静静地躺着一枚【色彩徽章】！""",
        [Option("取走徽章，返回", "studio_entry")],
        on_enter=gain_studio_medal
    )

    # --- 地下室谜题 (包含支线关联) ---
    scenes["basement_entry"] = Scene(
        "basement_entry",
        """地下室显得极其阴森。入口处有一个沉重的铁门，墙壁上画满了晦涩的学术符文。
这里原来是庄园的炼金阵与地质学禁区。""",
        [
            Option("探查炼金阵与符文", "basement_alchemy"),
            Option("接取地下室地质支线", "side_quest_basement", condition=lambda s: not s.get("side_quest_basement_done", False)),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["side_quest_basement"] = Scene(
        "side_quest_basement",
        """【支线：地底的回响】
你找到了托马斯留下的地质笔记，里面记载了这片土地下方蕴含着古老的神秘力量。
阿斯特设立谜语并非是在寻找继承人，而是为了筛选有资格镇压这股力量的守护者！""",
        [Option("合上笔记（完成支线）", "basement_entry")],
        on_enter=lambda s: (s.add_clue("托马斯的地质笔记"), s.set("side_quest_basement_done", True))
    )

    def gain_basement_medal(state):
        if not state.has_item("深渊徽章"):
            state.add_item("深渊徽章")
            state.add_item("符文石")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：深渊徽章、符文石】")

    scenes["basement_alchemy"] = Scene(
        "basement_alchemy",
        """中央的祭坛上有一个缺口，要求你献祭一样从别处得来的具有生命气息的极品（例如温室得到的七色花相关提取物或直接注入生命）。
解开这里的封印可以拿到符文石。""",
        [
            Option("投入七色花琥珀的共鸣力量", "basement_solved", condition=lambda s: s.has_item("生命徽章") or s.has_item("七色花琥珀")),
            Option("离开", "basement_entry")
        ]
    )

    scenes["basement_solved"] = Scene(
        "basement_solved",
        """祭坛感受到你身上强大的生命气息，缓缓下沉。
从深处浮现出一块古老的【符文石】及一枚散发着幽光的【深渊徽章】！""",
        [Option("拿走物品，原路返回", "hall_main")],
        on_enter=gain_basement_medal
    )

    # --- 钟楼谜题 (谜题七) ---
    scenes["clocktower_entry"] = Scene(
        "clocktower_entry",
        """钟楼位于庄园东侧，是一座独立的石塔，与主楼通过一条玻璃连廊相连。
巨大的机械钟占据了塔内三层楼的高度，无数齿轮、摆锤发出有节奏的轰鸣。
底层是工坊，中层是观察窗，顶层是钟盘。""",
        [
            Option("探索底层工坊", "clocktower_workshop"),
            Option("前往顶层检查钟盘与操作台", "clocktower_top"),
            Option("接取钟楼观测支线", "side_quest_clock", condition=lambda s: not s.get("side_quest_clock_done", False)),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["side_quest_clock"] = Scene(
        "side_quest_clock",
        """【支线：星月的低语】
你在中层观察窗找到了一份泛黄的观测记录，记载着月相与钟楼时间同步的秘密。
这让你理解了克劳利对时间精确度的痴迷，甚至超越了普通的密码学。""",
        [Option("收起记录（完成支线）", "clocktower_entry")],
        on_enter=lambda s: (s.add_clue("观测记录"), s.set("side_quest_clock_done", True))
    )

    scenes["clocktower_workshop"] = Scene(
        "clocktower_workshop",
        """底层是一个半地下的工坊，布满了工具。
你在铁皮柜里找到了一把形状奇特的【齿轮钥匙】，可以用于调节齿轮室。""",
        [Option("拿取钥匙", "clocktower_entry")],
        on_enter=lambda s: s.add_item("齿轮钥匙")
    )

    scenes["clocktower_top"] = Scene(
        "clocktower_top",
        """顶层的钟盘停留在11:55，分针卡滞。操作台旁有一个齿轮室。
墙上的铭文写着：“七声钟鸣，间隔相等。如心律之搏动。”""",
        [
            Option("插入齿轮钥匙并调整节拍", "clocktower_solved", condition=lambda s: s.has_item("齿轮钥匙")),
            Option("强行拨动指针", "clocktower_trap"),
            Option("返回", "clocktower_entry")
        ]
    )

    scenes["clocktower_trap"] = Scene(
        "clocktower_trap",
        """你没有用正确的钥匙进行节拍调整，而是强行拔动了钟表的分针！
钟楼骤然触发高压电防御机制。你被电击弹飞，受到了伤害。""",
        [Option("退回入口", "clocktower_entry")]
    )

    def gain_clock_medal(state):
        if not state.has_item("时空徽章"):
            state.add_item("时空徽章")
            state.set("hall_medal_count", state.get("hall_medal_count") + 1)
            print("【获得：时空徽章】")

    scenes["clocktower_solved"] = Scene(
        "clocktower_solved",
        """你使用齿轮钥匙，根据在其他房间学到的节奏，将传动轴调整至完美。
“铛——铛——铛——”钟声连续极其平稳地响了七声！
随着钟表恢复运转，钟盘下方的小门弹开，里面存放着一枚【时空徽章】。""",
        [Option("取走徽章，返回", "hall_main")],
        on_enter=gain_clock_medal
    )

    # --- 最终密室大结局 ---
    scenes["final_chamber_entry"] = Scene(
        "final_chamber_entry",
        """当六枚徽章齐聚，庄园都在震动。你来到了庄园的最深处——中央密室。
石台上放着一个古朴的金属匣子，上面有七道凹槽。
你现在必须将收集到的物品放入其中。但最重要的不是放入物品，而是你的觉悟。""",
        [
            Option("将星盘钥匙、齿轮、扳手、颜料、琥珀、符文石等献上", "final_chamber_test"),
        ]
    )

    scenes["final_chamber_test"] = Scene(
        "final_chamber_test",
        """所有物品归位！匣子打开了，里面是一封阿斯特的亲笔信。
他解释了谜语馆的建立真相，并给了你四个选择来决定庄园和你自己的命运：""",
        [
            Option("结局一：成为谜语馆主人，囚禁于此守护遗产", "ending_1"),
            Option("结局二：成为传播者，带着谜语离开，将智慧公之于众", "ending_2"),
            Option("结局三：成为守护者，封印地底的古老力量！", "ending_3", condition=lambda s: s.get("side_quest_basement_done", False)),
            Option("结局四：成为故事的讲述者，公开所有的日记与乐谱", "ending_4", condition=lambda s: s.get("side_quest_painting_done", False))
        ]
    )

    scenes["ending_1"] = Scene(
        "ending_1",
        """【结局一：永恒的回廊】\n你成庄园的主人，从此大门紧闭，你被永远囚禁在这里，等待下一个挑战者的到来...""",
        [Option("结束游戏", "title")]
    )
    scenes["ending_2"] = Scene(
        "ending_2",
        """【结局二：自由的智者】\n你出版了谜题笔记。虽然失去了物质的财富，却成为了闻名天下的智者！""",
        [Option("结束游戏", "title")]
    )
    scenes["ending_3"] = Scene(
        "ending_3",
        """【结局三：永恒的守护者】\n因为你理解了托马斯的地质警告，你选择了封印地下古老力量，拯救了可能被波及的千万人。""",
        [Option("结束游戏", "title")]
    )
    scenes["ending_4"] = Scene(
        "ending_4",
        """【结局四：谜语馆的回响】\n你将伊莲娜、阿斯特等人的故事写成了书。这里被改造成了博物馆，他们的爱情和悲剧被世人永远铭记。""",
        [Option("结束游戏", "title")]
    )

    return scenes
