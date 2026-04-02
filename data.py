from engine import Scene, Option

def build_scenes():
    scenes = {}

    def clocktower_enter(s):
        if s.has_item('红宝石徽章'): s.set('side_clock_completed', True)

    def hall_main_enter(state):
        count = state.get("hall_medal_count", 0)
        if count >= 3 and not state.get("side_butler_triggered"):
            state.set("side_butler_triggered", True)
            return {"type": "redirect", "target": "side_story_1_start"}
            
        desc = """你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。
壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。
[ 庄园简图 ]
     二楼：画室 | 最深处的卧室
     一楼：音乐室 | 大厅 | 温室花房 | 书房/图书馆
  东侧附属：钟楼
   地下：地下室"""
        if count >= 5:
            desc += "\n\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]"
        elif count >= 3:
            desc += "\n\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]"
            
        if "hall_main" in scenes:
            scenes["hall_main"].desc = desc
        return None



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

    def on_enter_ng_plus(state):
        if "怀表" not in state.items:
            state.items.append("怀表")
        if "前世记忆" not in state.clues:
            state.clues.append("前世记忆")
        print("【多周目奖励】：这是你一次新的轮回。\n你醒来时，手中紧紧握着一块没有指针的[怀表]。同时脑海里闪过了许多[前世记忆]的碎片。")

    scenes["opening_studio_ng_plus"] = Scene(
        "opening_studio_ng_plus",
        """起风了。这是新的一次轮回。你坐在自己的工作室里。壁炉的火光跳动，将房间染成暖橙色。
桌上摊开着侦探笔记，旁边放着一封午夜来信。

信上写着：“致敏锐的探索者：当月光照亮七面镜，谜语的血脉将再度流淌... ——阿斯特·克劳利”
信纸背面是一张手绘地图，指向城郊迷雾山谷中的一座古老庄园。""",
        [
            Option("立刻动身", "opening_gate"),
            Option("研究地图", "opening_studio_map")
        ],
        on_enter=on_enter_ng_plus
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

    # --- 大厅初始逻辑 --- 

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

    scenes["side_story_1_start"] = Scene(
        "side_story_1_start",
        """你在大厅里等了许久，仍不见管家奥尔德斯的身影。壁炉台上多了一张纸条：
“我去地下室取些东西，请稍候。”
纸条背面还有一行几乎被擦掉的字：不要相信……
你意识到，管家身上藏着秘密。""",
        [
            Option("前往管家的起居室", "side_butler_quarters"),
            Option("前往仆人房间", "side_servant_room"),
            Option("前往阁楼", "side_attic"),
            Option("返回大厅", "hall_main")
        ],
        on_enter=lambda s: s.set("side_quest_butler_started", True)
    )

    scenes["side_servant_room"] = Scene(
        "side_servant_room",
        """仆人房间里堆着整齐的床铺和旧制服。墙边挂着一张庄园值班表，最近几天管家的名字总是出现在午夜时分。
你还发现一枚断裂的袖扣，上面刻着阿斯特家族的家徽。""",
        [Option("继续寻找管家", "side_story_1_start")],
        on_enter=lambda s: s.add_clue("管家最近在午夜频繁出没")
    )

    scenes["side_attic"] = Scene(
        "side_attic",
        """阁楼里堆满旧箱子和被布盖住的画像。最靠里的箱子里放着一张褪色地图，标出了通往地窖的隐藏楼梯。
灰尘中还有一行字：哥哥不会希望你一直守在这里。""",
        [Option("回到大厅侧边", "side_story_1_start")],
        on_enter=lambda s: s.add_clue("阁楼里有通往地窖的隐藏楼梯")
    )

    scenes["side_butler_quarters"] = Scene(
        "side_butler_quarters",
        """管家起居室在大厅右侧一扇不起眼的木门后。房间整洁而简朴：一张单人床、一张书桌、一个衣柜、一个壁炉。
书桌上有一本翻开的账本，记录着庄园的日常开销，但最近几页被撕掉了。抽屉里有一张旧照片，照片中的年轻管家正与一个与你年龄相仿的年轻人并肩而立。""",
        [
            Option("检查壁炉", "side_fireplace"),
            Option("查看床底", "side_under_bed"),
            Option("用钥匙试试地窖的门", "side_cellar_key", condition=lambda s: s.has_item("生锈的钥匙")),
            Option("返回大厅", "hall_main")
        ],
        on_enter=lambda s: (s.add_item("旧照片"), s.add_item("生锈的钥匙"), s.add_item("对不起，哥哥的纸条"))
    )

    scenes["side_fireplace"] = Scene(
        "side_fireplace",
        """壁炉的余烬中有一块未完全烧毁的纸片。你用火钳夹出，上面写着：“我无法继续隐瞒……他其实……”
纸片的材质与账本相同，很可能是被撕下的账本页。""",
        [Option("返回起居室", "side_butler_quarters")],
        on_enter=lambda s: s.add_clue("管家在隐瞒什么")
    )

    scenes["side_under_bed"] = Scene(
        "side_under_bed",
        """床底有一个落满灰尘的皮箱。里面是几封寄给“奥尔德斯·克劳利”的信件，落款都是阿斯特。
最末一封信提到：遗嘱会放在中央密室，若有人失败，就让他离开，不要伤害任何人。""",
        [Option("继续寻找管家", "side_story_1_start"), Option("前往地窖", "side_cellar")],
        on_enter=lambda s: s.add_clue("管家与主人的兄弟关系")
    )

    scenes["side_cellar_key"] = Scene(
        "side_cellar_key",
        """你用生锈的钥匙打开了地下更深处的木门，石阶后是一段向下延伸的通道。空气潮湿阴冷，墙壁上有古老符文。
你终于来到了地窖入口。""",
        [Option("进入地窖", "side_cellar")],
        on_enter=lambda s: s.add_clue("地窖入口已经打开")
    )

    scenes["side_cellar"] = Scene(
        "side_cellar",
        """地窖比地下室更深，是一个天然岩洞改造的空间。洞壁上刻着古老的符文，中央是一座石棺，石棺盖半开。
石棺内壁上有一行血字：“我在这里等了你七年。” 阴影里，管家奥尔德斯安静地站着。""",
        [
            Option("质问他的身份", "side_reveal_1"),
            Option("询问血字的意思", "side_reveal_2"),
            Option("保持警惕，准备战斗", "side_reveal_3"),
            Option("继续追问真相", "side_truth")
        ]
    )

    scenes["side_reveal_1"] = Scene(
        "side_reveal_1",
        """“你是阿斯特·克劳利的弟弟。”你亮出旧照片和信件。
管家沉默片刻，缓缓点头：“是的。我以管家的身份守护庄园，等待能够通过七谜考验的人。”""",
        [Option("继续追问", "side_cellar")],
        on_enter=lambda s: s.add_clue("管家是阿斯特的弟弟")
    )

    scenes["side_reveal_2"] = Scene(
        "side_reveal_2",
        """你问起血字。管家走近石棺，手指轻触石壁：这是阿斯特留下的最后留言。他在这里写下遗嘱之前，先留下了这句等候。""",
        [Option("继续追问", "side_cellar")],
        on_enter=lambda s: s.add_clue("阿斯特留下了地窖血字")
    )

    scenes["side_reveal_3"] = Scene(
        "side_reveal_3",
        """你后退一步，管家却只是摇摇头：“我不会伤害你。七年来，我见过太多失败者，也见过几个有潜力的探索者。”
他取出一卷羊皮纸，低声说：“这是哥哥真正的遗嘱。”""",
        [Option("继续追问", "side_cellar")],
        on_enter=lambda s: s.add_clue("管家在执行主人的遗愿")
    )

    scenes["side_truth"] = Scene(
        "side_truth",
        """管家展开羊皮纸，在灯光下念出阿斯特的真正遗嘱：通过七谜的人可以继承谜语馆，但必须做出选择。
如果他选择成为主人，就要终身守护这里；如果选择传播者，就把谜题公之于众。""",
        [
            Option("选择成为主人", "side_ending_master"),
            Option("选择成为传播者", "side_ending_spreader"),
            Option("询问更多关于阿斯特自杀的细节", "side_ask_more"),
            Option("领取怀表纪念", "side_ending_memento")
        ],
        on_enter=lambda s: s.set("side_quest_butler_revealed", True)
    )

    scenes["side_ask_more"] = Scene(
        "side_ask_more",
        """管家缓缓讲述阿斯特的最后时日：谜语馆最初是智慧的殿堂，后来却变成了阿斯特自己也走不出的迷宫。
“我创造了无数谜题，却解不开自己的心。”这是他留下的最后一句话。""",
        [Option("回到真相选择", "side_truth")]
    )

    scenes["side_ending_memento"] = Scene(
        "side_ending_memento",
        """管家将一只银怀表递给你：“这是哥哥的遗物。他曾说过，时间会证明一切。现在，它属于你了。”""",
        [Option("带着怀表回到真相", "side_truth")],
        on_enter=lambda s: (s.add_item("阿斯特的怀表"), s.set("side_quest_butler_memento", True))
    )

    scenes["side_ending_master"] = Scene(
        "side_ending_master",
        """你选择成为谜语馆的主人。管家尊重你的决定，将钥匙交给你，但也提醒你：门可以从里面打开，心却可能被锁住。
庄园从此成为你的责任。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: s.set("side_butler_completed", True)
    )

    scenes["side_ending_spreader"] = Scene(
        "side_ending_spreader",
        """你选择成为传播者。管家露出七年来第一个微笑，愿意与你一起整理并出版谜题笔记。
你带走的不是遗产，而是让谜语继续流动下去的方式。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (s.set("side_butler_completed", True), s.add_clue("谜语的意义在于分享，而不是禁锢"))
    )

    # --- 支线二：画中女子 ---
    scenes["side_story_2_start"] = Scene(
        "side_story_2_start",
        """你再次回到画室，发现南墙彩色玻璃窗投下的光斑在地面上拼出一个女人的侧影。
七幅画里都隐约出现了同一张面孔。一个轻柔的声音在脑海中响起：
“他把我画进了每一道光里，却始终画不出我的灵魂。”""",
        [
            Option("检查七幅画的背面", "side_painting_back"),
            Option("研究调色板和画笔", "side_palette_clue"),
            Option("再次观察肖像画中的镜子", "side_mirror_again"),
            Option("询问管家", "side_ask_butler"),
            Option("在画室中寻找隐藏抽屉", "side_hidden_drawer"),
            Option("去钟楼核对‘节拍与七色顺序’", "side2_clocktower_link", condition=lambda s: s.has_item("时空徽章")),
            Option("去卧室核对‘纪念与传承’线索", "side2_bedroom_link", condition=lambda s: s.has_item("彩虹徽章")),
            Option("粗暴刮除画层（危险）", "side_ending_paint_curse"),
            Option("先返回画室主区域", "studio_entry")
        ],
        on_enter=lambda s: s.set("side_story_2_started", True)
    )

    scenes["side2_clocktower_link"] = Scene(
        "side2_clocktower_link",
        """你带着画室线索来到钟楼，发现摆锤的节拍与七幅画的情绪序列存在同构关系：由急促到舒缓，再归于平静。
这让你确认：伊莲娜线索并非孤立回忆，而是贯穿庄园整体叙事的主轴之一。""",
        [Option("带着新理解返回画室", "side_story_2_start")],
        on_enter=lambda s: s.add_clue("钟楼节拍与画室七色叙事相互印证")
    )

    scenes["side2_bedroom_link"] = Scene(
        "side2_bedroom_link",
        """在卧室油画前，你意识到“最后的答案”并非技巧，而是对人心与代价的理解。
当你提及伊莲娜时，烛光短暂变亮，仿佛某段未竟心事得到回应。""",
        [Option("返回画室继续追查", "side_story_2_start")],
        on_enter=lambda s: s.add_clue("卧室认可‘纪念而非占有’的回答方向")
    )

    scenes["side_ending_paint_curse"] = Scene(
        "side_ending_paint_curse",
        """你粗暴刮开画层，颜料像血一样渗开。画室骤然降温，玻璃震响，所有画框同时发出刺耳声。
一股无形力量将你推出房门，画室短时间内拒绝你再次深入。""",
        [Option("狼狈退回大厅", "hall_main")],
        on_enter=lambda s: s.set("side_story_2_failed", True)
    )

    scenes["side_painting_back"] = Scene(
        "side_painting_back",
        """你把七幅画逐一取下，背面都写着女子的手书：
“他画我的笑，却不知我的心在哭。”
“我试图逃离，却发现自己已经变成了颜料。”
最后一幅写着：“最后一幅画完成时，我消失了。”""",
        [Option("前往紫藤花架", "side_wisteria"), Option("继续调查画室", "side_story_2_start")],
        on_enter=lambda s: (s.add_clue("画背面的女子自述"), s.add_clue("1890年，紫藤花架"))
    )

    scenes["side_palette_clue"] = Scene(
        "side_palette_clue",
        """你检查调色板，发现中央凹槽有旧奖章摩擦痕迹。凹槽内壁刻着极小字迹：
“若你看见她，请把故事带出去。”""",
        [Option("继续调查画室", "side_story_2_start")],
        on_enter=lambda s: s.add_clue("调色板中央凹槽可触发机关")
    )

    scenes["side_mirror_again"] = Scene(
        "side_mirror_again",
        """你再次看向肖像画里的镜子，镜中短暂映出紫藤花架和一只银手镯，然后迅速恢复正常。""",
        [Option("继续调查画室", "side_story_2_start")],
        on_enter=lambda s: s.add_clue("镜中提示：紫藤花架与银手镯")
    )

    scenes["side_ask_butler"] = Scene(
        "side_ask_butler",
        """管家沉默良久，只说了一句：
“伊莲娜小姐是哥哥最重要的人。若你真想知道真相，去花园东南角的紫藤花架。”""",
        [Option("前往紫藤花架", "side_wisteria"), Option("继续调查画室", "side_story_2_start")],
        on_enter=lambda s: s.add_clue("伊莲娜与紫藤花架有关")
    )

    scenes["side_hidden_drawer"] = Scene(
        "side_hidden_drawer",
        """你在画架背后找到一个暗抽屉，里面有一把生锈的小钥匙和半张旧票根。
票根上写着：阿斯特·克劳利个人画展，1890年秋。""",
        [Option("前往紫藤花架", "side_wisteria"), Option("继续调查画室", "side_story_2_start")],
        on_enter=lambda s: (s.add_item("画室小钥匙"), s.add_clue("1890年画展票根"))
    )

    scenes["side_wisteria"] = Scene(
        "side_wisteria",
        """你在花园东南角的紫藤花架下发现石板刻字：
“献给伊莲娜，我的光与影。阿斯特·克劳利，1890。”
石板下埋着铁盒，里面有画展目录和艺术奖章。""",
        [Option("将奖章带回画室", "side_medal_trigger"), Option("继续搜寻伊莲娜踪迹", "side_search_elenor")],
        on_enter=lambda s: (s.add_item("艺术奖章"), s.add_item("画展目录"))
    )

    scenes["side_search_elenor"] = Scene(
        "side_search_elenor",
        """你顺着画展目录和石板线索继续追查，确认伊莲娜在画展前失踪，之后阿斯特再也没有停止寻找她。""",
        [Option("带着线索回画室", "side_medal_trigger")],
        on_enter=lambda s: s.add_clue("伊莲娜在画展前失踪")
    )

    scenes["side_medal_trigger"] = Scene(
        "side_medal_trigger",
        """你将艺术奖章放入调色板中央凹槽。调色板发出轻响，侧面抽屉弹开，里面是一把铜钥匙和一张纸条：
“地窖，第七级台阶下。”""",
        [Option("前往地窖台阶", "side_cellar_steps")],
        on_enter=lambda s: (s.add_item("铜钥匙"), s.add_clue("地窖第七级台阶藏有秘密"))
    )

    scenes["side_cellar_steps"] = Scene(
        "side_cellar_steps",
        """你在地窖第七级台阶下方暗格中找到《伊莲娜日记》和银手镯。
日记记录了她与阿斯特从相爱到失衡的全过程，也记录了她最后一次逃离庄园。""",
        [Option("阅读关键页并继续追查", "side_read_diary")],
        on_enter=lambda s: (s.add_item("伊莲娜的日记"), s.add_item("银手镯"), s.add_clue("伊莲娜的失踪与阿斯特的悔恨"))
    )

    scenes["side_read_diary"] = Scene(
        "side_read_diary",
        """日记最后的空白页有阿斯特的补写：
“我把你画进每一幅画，却忘了把你留在身边。若后来者看到这些，请替我说一声对不起。”""",
        [Option("检查暗格深处", "side_cellar_hidden"), Option("返回画室尝试银手镯机关", "side_bracelet_trigger")]
    )

    scenes["side_cellar_hidden"] = Scene(
        "side_cellar_hidden",
        """你撬开暗格底层，发现干枯紫藤花束、旧照片和一小块画布碎片。
画布上只画了一只眼睛，背面写着：“我的灵魂在这里。”""",
        [Option("带着证物返回画室", "side_bracelet_trigger")],
        on_enter=lambda s: (s.add_item("紫藤花束"), s.add_item("旧照片"), s.add_item("画布碎片"))
    )

    scenes["side_bracelet_trigger"] = Scene(
        "side_bracelet_trigger",
        """你把银手镯贴近紫色画，画布像门一样开启。后方密室里满墙都是伊莲娜素描，桌上放着阿斯特未写完的遗信。
信中承认：他建造谜语馆并非为了财富，而是试图用谜题与画作留住失去的人。""",
        [Option("追查伊莲娜最终归宿", "side_elenor_fate")],
        on_enter=lambda s: s.add_item("阿斯特的遗信")
    )

    scenes["side_elenor_fate"] = Scene(
        "side_elenor_fate",
        """你在密室抽屉里找到最后的行踪记录：伊莲娜离开庄园后贫病而逝。
当你把遗信与日记并排放好，室内蜡烛自动点燃，墙上浮现一句话：
“传承他们的故事，让后来者懂得：爱不是占有，而是成全。”""",
        [Option("将纪念徽章带回大厅", "side_ending_reconciliation"), Option("将纪念徽章留在画室", "side_ending_legacy")],
        on_enter=lambda s: s.add_item("伊莲娜纪念徽章")
    )

    scenes["side_ending_reconciliation"] = Scene(
        "side_ending_reconciliation",
        """你将纪念徽章带回大厅。几天后，徽章旁多了一束新鲜紫藤花。
从此以后，画室不再阴冷，像终于完成了一场迟到的和解。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (s.set("side_painting_completed", True), s.set("side_quest_painting_done", True), s.add_clue("伊莲娜与阿斯特的故事被完整看见"))
    )

    scenes["side_ending_legacy"] = Scene(
        "side_ending_legacy",
        """你把纪念徽章留在画室密室，决定将这段往事写成书。
谜语馆开始吸引真正愿意理解历史的人，而不只是猎奇的寻宝者。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (s.set("side_painting_completed", True), s.set("side_quest_painting_done", True), s.add_clue("你决定将画中往事整理为可传承的故事"))
    )

    # --- 支线三：地下的回响 ---
    scenes["side_story_3_start"] = Scene(
        "side_story_3_start",
        """地下室入口旁的墙壁出现一道新裂缝，冷风从缝隙里渗出。你贴耳细听，深处传来有节奏的敲击声。
管家神色不自然地说“那后面什么都没有”，这让你更确信墙后藏着秘密。""",
        [
            Option("扩大裂缝并进入", "side_cave_table"),
            Option("先问管家是否知情", "side_tell_butler"),
            Option("去钟楼校验敲击节奏", "side3_clocktower_link", condition=lambda s: s.has_item("时空徽章")),
            Option("去卧室核对家族日志", "side3_bedroom_link", condition=lambda s: s.has_item("彩虹徽章")),
            Option("直接爆破裂缝（极高风险）", "side_ending_disappear"),
            Option("暂时返回地下室", "basement_entry")
        ],
        on_enter=lambda s: s.set("side_story_3_started", True)
    )

    scenes["side3_clocktower_link"] = Scene(
        "side3_clocktower_link",
        """你在钟楼记录敲击间隔，发现它与地下回响的停顿比例一致，像是人为编码的引导信号。
这说明地下通道并非天然遗迹，而曾被系统性改造过。""",
        [Option("带着节拍记录返回裂缝处", "side_story_3_start")],
        on_enter=lambda s: s.add_clue("地下敲击声与钟楼节拍存在人为编码关系")
    )

    scenes["side3_bedroom_link"] = Scene(
        "side3_bedroom_link",
        """你在卧室日记与家训边注里找到对应描述：
“若深处回响再起，谨记先求证，再开门。”
这与托马斯笔记中的警告完全一致。""",
        [Option("返回地下裂缝继续调查", "side_story_3_start")],
        on_enter=lambda s: s.add_clue("卧室家训验证了托马斯对地下风险的判断")
    )

    scenes["side_tell_butler"] = Scene(
        "side_tell_butler",
        """管家短暂沉默后只说了一句：“如果你一定要下去，就把看到的一切记下来。不要轻易触动石柱。”""",
        [Option("进入裂缝通道", "side_cave_table"), Option("返回地下室", "basement_entry")],
        on_enter=lambda s: s.add_clue("管家知道地下石柱的存在")
    )

    scenes["side_cave_table"] = Scene(
        "side_cave_table",
        """你穿过狭窄岩缝来到洞穴，石桌上散落着地质锤、测量仪和写有 T.H. 的帆布包。
包里是《托马斯·赫胥黎地质考察笔记》与未寄出的家书。""",
        [Option("研究墙壁笔记", "side_cave_notes"), Option("探索洞穴深处", "side_cave_deeper")],
        on_enter=lambda s: (s.add_item("托马斯地质笔记本"), s.add_item("矿石标本"), s.add_clue("托马斯可能被困于庄园地下"))
    )

    scenes["side_cave_notes"] = Scene(
        "side_cave_notes",
        """墙壁上的炭笔记录写道：
“第二条通道塌方了。真的是意外吗？”
箭头指向洞穴更深处，旁边只有一个词：通道。""",
        [Option("跟随箭头前进", "side_cave_passage"), Option("返回洞穴入口", "side_cave_table")],
        on_enter=lambda s: s.add_clue("塌方可能是人为制造")
    )

    scenes["side_cave_deeper"] = Scene(
        "side_cave_deeper",
        """洞穴深处出现更明显的人工开凿痕迹，你在石缝间捡到一枚刻着 T.H. 的金属牌。
前方有两条路：一条通往塌方区，一条通往古老壁画区。""",
        [Option("前往塌方区", "side_cave_passage"), Option("前往古殿壁画区", "side_ancient_chamber")],
        on_enter=lambda s: s.add_item("托马斯身份牌")
    )

    scenes["side_cave_passage"] = Scene(
        "side_cave_passage",
        """通道被碎石封堵，石堆里混着木板残片，明显不像自然塌方。你在石缝里摸到一把地质锤。""",
        [
            Option("返回庄园寻找工具", "side_find_tools"),
            Option("寻找其他路径", "side_alternate_path"),
            Option("用地质锤强行挖掘", "side_dig_with_hammer")
        ],
        on_enter=lambda s: s.add_item("托马斯的地质锤")
    )

    scenes["side_find_tools"] = Scene(
        "side_find_tools",
        """你回到庄园搜集到撬棍、镐和少量黑火药。现在可以选择稳妥清理或爆破穿洞。""",
        [Option("手动清理塌方", "side_manual_clear"), Option("使用黑火药爆破", "side_dynamite")]
    )

    scenes["side_alternate_path"] = Scene(
        "side_alternate_path",
        """你沿着侧洞前进，绕到了塌方另一侧，虽然路更险，但成功避开了最厚的石堆。""",
        [Option("进入古老殿堂", "side_ancient_chamber")],
        on_enter=lambda s: s.add_clue("洞穴有备用通路")
    )

    scenes["side_dig_with_hammer"] = Scene(
        "side_dig_with_hammer",
        """你用地质锤敲击碎石，效率极低却听见回音异常。继续硬挖可能引发更大塌方。""",
        [Option("停止硬挖，回去找工具", "side_find_tools"), Option("冒险继续深入", "side_ending_disappear")]
    )

    scenes["side_manual_clear"] = Scene(
        "side_manual_clear",
        """你用撬棍和镐花了很久才清出一条勉强通过的狭缝。对面壁画区空气潮湿，石柱轮廓若隐若现。""",
        [Option("进入古老殿堂", "side_ancient_chamber")],
        on_enter=lambda s: s.add_clue("你以低风险方式通过塌方区")
    )

    scenes["side_dynamite"] = Scene(
        "side_dynamite",
        """爆破打通了道路，但洞顶裂痕增多。你必须加快探索节奏，否则随时可能再次坍塌。""",
        [Option("快速进入古老殿堂", "side_ancient_chamber")],
        on_enter=lambda s: s.add_clue("洞穴结构已不稳定")
    )

    scenes["side_ancient_chamber"] = Scene(
        "side_ancient_chamber",
        """你进入巨大的天然殿堂。壁画描绘七颗星辰围绕祭坛旋转，石柱底部有与你符文石匹配的凹槽。
浮现文字写着：以记忆换力量，以自由换智慧。""",
        [
            Option("将符文石放入石柱", "side_activate_pillar", condition=lambda s: s.has_item("符文石")),
            Option("追踪托马斯最后足迹", "side_thomas_trail"),
            Option("记录后离开", "side_refuse")
        ]
    )

    scenes["side_thomas_trail"] = Scene(
        "side_thomas_trail",
        """你在石壁侧室找到托马斯遗信：他认为阿斯特曾试图利用地下力量，并在塌方后被困。
信背面的简图标出东侧出口与石柱位置。""",
        [Option("寻找东侧出口", "side_east_exit"), Option("回到石柱前", "side_activate_pillar")],
        on_enter=lambda s: s.add_item("托马斯遗信")
    )

    scenes["side_east_exit"] = Scene(
        "side_east_exit",
        """你在东侧封堵出口处发现托马斯遗骸与身份证明。你将其安葬后，决定把真相带回庄园。""",
        [Option("带着证据返回石柱", "side_activate_pillar")],
        on_enter=lambda s: (s.add_item("托马斯身份证明"), s.add_clue("托马斯未能逃出生天"))
    )

    scenes["side_activate_pillar"] = Scene(
        "side_activate_pillar",
        """符文石嵌入后，石柱亮起。你被迫做出选择：
求知者，获得远古知识但失去部分记忆；
守护者，获得封印之力但背负长期责任；
拒绝者，带着证据离开并公开真相。""",
        [
            Option("选择成为求知者", "side_seeker"),
            Option("选择成为守护者", "side_guardian"),
            Option("拒绝交换，带着证据离开", "side_refuse")
        ]
    )

    scenes["side_seeker"] = Scene(
        "side_seeker",
        """你接受古老知识，脑海涌入庞大符号体系。你看懂了更多秘密，却开始遗忘普通生活里的细节。""",
        [Option("记录代价并返回大厅", "side_ending_seeker")],
        on_enter=lambda s: s.add_clue("你获得知识但开始遗忘过去")
    )

    scenes["side_guardian"] = Scene(
        "side_guardian",
        """你选择守护，双手浮现银色符文。你能封印地下力量，但必须长期守望这片区域。""",
        [Option("接受守护者之责", "side_ending_guardian")],
        on_enter=lambda s: s.add_clue("你获得了守护者符文")
    )

    scenes["side_refuse"] = Scene(
        "side_refuse",
        """你拒绝用记忆或自由交换力量，决定把托马斯与地下遗迹的真相带给世人。""",
        [Option("整理证据并离开洞穴", "side_ending_truth")]
    )

    scenes["side_ending_seeker"] = Scene(
        "side_ending_seeker",
        """【支线三结局：知识的代价】
你获得远古知识，却逐渐被其同化。你越来越难与普通人共情，也更难回到原本的人生节奏。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (s.set("side_underground_completed", True), s.set("side_underground_completed", True), s.set("side_ending_seeker", True))
    )

    scenes["side_ending_guardian"] = Scene(
        "side_ending_guardian",
        """【支线三结局：守护者的责任】
你继承了封印职责，决定守住地下秘密，避免它再次被狂热者滥用。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (s.set("side_underground_completed", True), s.set("side_underground_completed", True), s.set("side_ending_guardian", True))
    )

    scenes["side_ending_truth"] = Scene(
        "side_ending_truth",
        """【支线三结局：真相的传播者】
你把托马斯遗物与调查记录公之于众，谜语馆地下遗迹被纳入公开研究。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (s.set("side_underground_completed", True), s.set("side_underground_completed", True), s.add_clue("托马斯地质学会正名"))
    )

    scenes["side_ending_disappear"] = Scene(
        "side_ending_disappear",
        """你在洞穴不稳定区继续冒险，塌方突发，退路被封。多年后，入口处多了一块石碑。
“献给一位勇敢的探索者，他找到了最后的谜题，却未能带回答案。”""",
        [Option("重新步入轮回", "title")]
    )

    scenes["side_story_4_start"] = Scene(
        "side_story_4_start",
        """你再次经过音乐室，门内传出微弱的小提琴独奏。推门后乐声戛然而止。
琴谱架上多了一份手稿：《第七交响曲：未完成》，署名埃莉诺·布莱克伍德。""",
        [
            Option("询问管家是否认识埃莉诺", "side_ask_butler_elenor"),
            Option("检查手稿细节", "side_score_details"),
            Option("尝试演奏小提琴", "side_play_violin"),
            Option("搜索音乐室暗格", "side_music_hidden"),
            Option("返回音乐室主区域", "musicroom_entry")
        ],
        on_enter=lambda s: s.set("side_story_4_started", True)
    )

    scenes["side_ask_butler_elenor"] = Scene(
        "side_ask_butler_elenor",
        """管家沉默良久，承认埃莉诺曾是庄园最重要的音乐家与制琴师。
她病逝前只完成了交响曲前六乐章，第七乐章只留下主题。""",
        [Option("追问交响曲细节", "side_symphony_details"), Option("询问安息地点", "side_elenor_grave"), Option("回音乐室继续查证", "side_story_4_start")],
        on_enter=lambda s: s.add_clue("埃莉诺留下七件夜莺标记乐器")
    )

    scenes["side_symphony_details"] = Scene(
        "side_symphony_details",
        """管家告诉你：前六乐章完整乐谱被藏在三角钢琴琴凳里，第七乐章只剩主题旋律。""",
        [Option("打开琴凳寻找乐谱", "side_piano_stool"), Option("返回继续调查", "side_story_4_start")],
        on_enter=lambda s: s.add_clue("前六乐章在钢琴琴凳内")
    )

    scenes["side_elenor_grave"] = Scene(
        "side_elenor_grave",
        """管家只给你一句含糊提示：“若你真的让第七乐章完成，她会自己带你去该去的地方。”""",
        [Option("回音乐室继续追查", "side_story_4_start")],
        on_enter=lambda s: s.add_clue("完成第七乐章后会出现安息地线索")
    )

    scenes["side_score_details"] = Scene(
        "side_score_details",
        """手稿最后页有红墨注记：
“献给谜语馆，以及永远听不到它的人。”
边角还有夜莺符号与七个小节拍记号。""",
        [Option("回音乐室继续调查", "side_story_4_start")],
        on_enter=lambda s: s.add_clue("第七乐章与夜莺标记有关")
    )

    scenes["side_play_violin"] = Scene(
        "side_play_violin",
        """你试着拉响小提琴，琴弦仍有余温，但旋律残缺不稳。
若强行演奏，可能触发反噬；若按线索推进，也许能让乐器群共鸣。""",
        [Option("稳妥推进线索", "side_story_4_start"), Option("强行演奏（失败分支）", "side_ending_music_silence")]
    )

    scenes["side_music_hidden"] = Scene(
        "side_music_hidden",
        """你在壁炉与展柜间找到暗槽机关，里面有一枚夜莺形锁片。锁片背后刻着：
“花园紫藤架下，1888。”""",
        [Option("带着线索回到调查起点", "side_story_4_start"), Option("直接去紫藤花架", "side_brooch_clue")],
        on_enter=lambda s: s.add_item("夜莺锁片")
    )

    scenes["side_piano_stool"] = Scene(
        "side_piano_stool",
        """你打开琴凳，找到前六乐章完整总谱与一枚夜莺胸针。第七乐章页脚写着：
“若我未完成，请让音乐室自己演奏它。”""",
        [Option("研究夜莺胸针", "side_brooch_clue"), Option("回音乐室继续调查", "side_story_4_start")],
        on_enter=lambda s: (s.add_item("埃莉诺前六乐章总谱"), s.add_item("夜莺胸针"))
    )

    scenes["side_brooch_clue"] = Scene(
        "side_brooch_clue",
        """你旋转胸针机关，背面弹针指向“花园紫藤架”。石板下铁盒里有埃莉诺遗信与铜钥匙。
遗信提到：最后的礼物藏在音乐室壁炉后。""",
        [Option("用钥匙打开音乐室壁炉", "side_fireplace_secret")],
        on_enter=lambda s: (s.add_item("埃莉诺遗信"), s.add_item("音乐室铜钥匙"))
    )

    scenes["side_fireplace_secret"] = Scene(
        "side_fireplace_secret",
        """壁炉后密道打开，尽头是简陋工作室。台上放着《制琴笔记》与一把保存完好的琴弓，弓杆刻着：
“奏响我，我将归来。”""",
        [Option("阅读埃莉诺日记", "side_elenor_diary")],
        on_enter=lambda s: (s.add_item("埃莉诺制琴笔记"), s.add_item("埃莉诺琴弓"))
    )

    scenes["side_elenor_diary"] = Scene(
        "side_elenor_diary",
        """日记记录了她在病痛中完成七件乐器与前六乐章的过程。
最后一页写着：
“第七乐章叫‘重生’，若我不在，请替我奏完最后一个音符。”""",
        [Option("用琴弓与主题旋律尝试共鸣", "side_play_elenor_violin"), Option("带着资料返回音乐室", "side_story_4_start")],
        on_enter=lambda s: s.add_clue("第七乐章主题可激活乐器群共鸣")
    )

    scenes["side_play_elenor_violin"] = Scene(
        "side_play_elenor_violin",
        """你用埃莉诺琴弓拉响主题，七件夜莺标记乐器同时共鸣，自动补全第七乐章。
乐曲终止时，中央暗格开启，出现夜莺徽章与完整交响曲总谱。""",
        [Option("整理并决定如何处理交响曲", "side_symphony_complete")],
        on_enter=lambda s: (s.add_item("夜莺徽章"), s.add_item("埃莉诺七乐章全本"), s.set("side_music_completed", True))
    )

    scenes["side_symphony_complete"] = Scene(
        "side_symphony_complete",
        """你站在音乐室中央，意识到“未完成”已经被真正完成。你需要决定：
让作品公之于众，或将其留在庄园沉默之中，或继续触发终极机关。""",
        [
            Option("将交响曲公之于众", "side_ending_music_public"),
            Option("将交响曲留在谜语馆", "side_ending_music_keep"),
            Option("触发音乐室终极机关", "side_music_final_mechanism")
        ]
    )

    scenes["side_ending_music_public"] = Scene(
        "side_ending_music_public",
        """【支线四结局：永恒的回响】
你将交响曲交给公开乐团演出，埃莉诺名字重回舞台中央。
首演当晚，第七乐章“重生”响起时，你确信音乐室在远方也作出了回应。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (
            s.set("side_music_completed", True),
            s.set("side_music_completed", True),
            s.set("side_music_route", "public"),
            s.add_clue("音乐的传承已完成")
        )
    )

    scenes["side_ending_music_keep"] = Scene(
        "side_ending_music_keep",
        """【支线四结局：留在沉默中】
你把乐谱与琴弓留在密室，选择守住这段只属于庄园与故人的对话。""",
        [Option("返回大厅", "hall_main")],
        on_enter=lambda s: (
            s.set("side_music_completed", True),
            s.set("side_music_completed", True),
            s.set("side_music_route", "keep"),
            s.add_clue("你选择守护音乐室的秘密")
        )
    )

    scenes["side_music_final_mechanism"] = Scene(
        "side_music_final_mechanism",
        """你把夜莺徽章嵌入管风琴凹槽，并拉响第七乐章主题。墙后暗道开启，通往埃莉诺安息地。
墓前紫藤在暗处绽放，你获得一枚“灵感加成”的祝福。""",
        [Option("带着祝福返回大厅", "hall_main")],
        on_enter=lambda s: (
            s.set("side_music_completed", True),
            s.set("side_music_completed", True),
            s.set("side_music_route", "mechanism"),
            s.add_item("埃莉诺的祝福")
        )
    )

    scenes["side_ending_music_silence"] = Scene(
        "side_ending_music_silence",
        """你在未完成准备时强行演奏，琴弦骤断，尖锐噪音回荡。音乐室机关短暂锁死，所有乐器陷入沉默。
你被迫退出，必须冷静后再回来按线索推进。""",
        [Option("退回大厅调整状态", "hall_main")],
        on_enter=lambda s: s.set("side_story_4_failed", True)
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
壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。
[ 庄园简图 ]
     二楼：画室 | 最深处的卧室
     一楼：音乐室 | 大厅 | 温室花房 | 书房/图书馆
  东侧附属：钟楼
   地下：地下室""",
        [
            Option("仔细观察大厅壁炉的纸片", "hall_fireplace"),
            Option("检查大厅的雕像", "puzzle_statues"),
            Option("寻找失踪的管家", "side_story_1_start"),
            Option("前往书房/图书馆", "library_entry"),
            Option("前往音乐室", "musicroom_entry"),
            Option("前往温室花房", "greenhouse_entry"),
            Option("前往二楼画室", "studio_entry"),
            Option("前往卧室", "bedroom_entry"),
            Option("前往地下室", "basement_entry"),
            Option("前往东侧钟楼", "clocktower_entry"),
            Option("前往二楼最深处的卧室", "bedroom_entry"),
            Option("开启中央密室大门 (结局)", "final_chamber_entry", 
                   condition=lambda s: s.get("hall_medal_count") >= 7) # 收集满7个即可触发最后
        ],
        on_enter=hall_main_enter
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
        [Option("拿走徽章，返回图书馆", "library_entry")],
        on_enter=gain_library_medal
    )
    
    scenes["library_check_books"] = Scene(
        "library_check_books",
        """《梦的解析》被撕掉了半页，写着“第五位...镜子中的...”。
《几何原本》书脊处有一个隐藏开关。""",
        [Option("按下隐藏开关", "library_scholar_order", effect=lambda s: print("开关咔哒一声响了..."))],
    )

    # --- 音乐室谜题 ---
    def musicroom_enter(state):
        if state.has_item("旋律徽章") and not state.get("side_music_triggered"):
            state.set("side_music_triggered", True)
            return {"type": "redirect", "target": "side_story_4_start"}

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
            Option("追查未完成交响曲", "side_story_4_start", condition=lambda s: s.has_item("旋律徽章") and not s.get("side_music_completed", False)),
            Option("返回大厅", "hall_main")
        ],
        on_enter=musicroom_enter
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
            state.set("side_music_completed", True)
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

    # --- 画室谜题 ---
    def studio_enter(state):
        if state.has_item("色彩徽章") and not state.get("side_painting_triggered"):
            state.set("side_painting_triggered", True)
            return {"type": "redirect", "target": "side_story_2_start"}

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
            Option("追查画中女子的真相", "side_story_2_start", condition=lambda s: s.has_item("色彩徽章") and not s.get("side_painting_completed", False)),
            Option("返回大厅", "hall_main")
        ],
        on_enter=studio_enter
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

    # --- 地下室谜题 ---
    def basement_enter(state):
        if state.has_item("深渊徽章") and not state.get("side_underground_triggered"):
            state.set("side_underground_triggered", True)
            return {"type": "redirect", "target": "side_story_3_start"}

    scenes["basement_entry"] = Scene(
        "basement_entry",
        """地下室显得极其阴森。入口处有一个沉重的铁门，墙壁上画满了晦涩的学术符文。
这里原来是庄园的炼金阵与地质学禁区。""",
        [
            Option("探查炼金阵与符文", "basement_alchemy"),
            Option("接取地下室地质支线", "side_quest_basement", condition=lambda s: not s.get("side_underground_completed", False)),
            Option("追查地下裂缝的回响", "side_story_3_start", condition=lambda s: s.has_item("深渊徽章") and not s.get("side_underground_completed", False)),
            Option("返回大厅", "hall_main")
        ],
        on_enter=basement_enter
    )

    scenes["side_quest_basement"] = Scene(
        "side_quest_basement",
        """【支线：地底的回响】
你找到了托马斯留下的地质笔记，里面记载了这片土地下方蕴含着古老的神秘力量。
阿斯特设立谜语并非是在寻找继承人，而是为了筛选有资格镇压这股力量的守护者！""",
        [Option("合上笔记（完成支线）", "basement_entry")],
        on_enter=lambda s: (s.add_clue("托马斯的地质笔记"), s.set("side_underground_completed", True))
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
        [Option("拿走物品，继续探索地下室", "basement_entry")],
        on_enter=gain_basement_medal
    )

    # --- 钟楼谜题 ---
    scenes["clocktower_entry"] = Scene(
        "clocktower_entry",
        """钟楼位于庄园东侧，是一座独立的石塔，与主楼通过一条玻璃连廊相连。
巨大的机械钟占据了塔内三层楼的高度，无数齿轮、摆锤发出有节奏的轰鸣。
底层是工坊，中层是观察窗，顶层是钟盘。""",
        [
            Option("探索底层工坊", "clocktower_workshop"),
            Option("前往顶层检查钟盘与操作台", "clocktower_top"),
            Option("接取钟楼观测支线", "side_quest_clock", condition=lambda s: not s.get("side_clock_completed", False)),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["side_quest_clock"] = Scene(
        "side_quest_clock",
        """【支线：星月的低语】
你在中层观察窗找到了一份泛黄的观测记录，记载着月相与钟楼时间同步的秘密。
这让你理解了克劳利对时间精确度的痴迷，甚至超越了普通的密码学。""",
        [Option("收起记录（完成支线）", "clocktower_entry")],
        on_enter=lambda s: (s.add_clue("观测记录"), s.set("side_clock_completed", True))
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
        [Option("取走徽章，继续探索钟楼", "clocktower_entry")],
        on_enter=gain_clock_medal
    )

    # --- 卧室谜题 (第七谜题) ---
    scenes["bedroom_entry"] = Scene(
        "bedroom_entry",
        """卧室位于庄园二层最深处，是主人阿斯特·克劳利的私人寝居。推开胡桃木雕花门，一股混合着薰衣草、旧纸张和封尘气息的味道扑面而来。
月光从落地窗倾泻而入，在地毯上投下银白色的光带。

最引人注目的是正对床尾的那幅巨大庄园油画。画中七个房间——图书馆、钟楼、音乐室、画室、温室、地下室和卧室——以透视图呈现，其中六个房间的窗户里亮着烛光，唯独卧室的窗户一片漆黑。""",
        [
            Option("检查四柱床和帷幔", "bedroom_bed"),
            Option("翻阅床头柜上的日记", "bedroom_diary"),
            Option("探索衣柜", "bedroom_closet"),
            Option("研究梳妆台和镜子", "bedroom_dressing_table"),
            Option("仔细观察庄园油画", "bedroom_painting"),
            Option("检查落地窗和窗帘", "bedroom_window"),
            Option("使用符文石点亮油画", "bedroom_rune_solution", condition=lambda s: s.has_item("符文石")),
            Option("返回大厅", "hall_main")
        ]
    )

    scenes["bedroom_bed"] = Scene(
        "bedroom_bed",
        """四柱床的四根柱子雕刻着藤蔓和花蕾，帷幔是深红色的天鹅绒，落满灰尘。你掀开帷幔，床上的丝绸被褥已经发黄。
枕头下有一把黄铜钥匙，钥匙柄上刻着“衣柜”。床头板上还有一只停止的怀表，指针指向11:55。""",
        [
            Option("用钥匙打开衣柜", "bedroom_closet_key", condition=lambda s: s.has_item("衣柜钥匙")),
            Option("研究怀表", "bedroom_pocket_watch"),
            Option("返回卧室", "bedroom_entry")
        ],
        on_enter=lambda s: (s.add_item("衣柜钥匙"), s.add_item("停止的怀表"))
    )

    scenes["bedroom_pocket_watch"] = Scene(
        "bedroom_pocket_watch",
        """怀表已经停止，表盖内侧刻着“时间停止的地方，答案开始”。你盯着表盘，隐约觉得它和钟楼的11:55是同一个时刻。""",
        [Option("返回四柱床", "bedroom_bed")],
    )

    scenes["bedroom_diary"] = Scene(
        "bedroom_diary",
        """日记本封面是深棕色皮革，烫金标题《谜语馆纪事》。扉页写着：
“我，阿斯特·克劳利，将毕生收藏与智慧封于此馆。若你已集齐六枚徽章，便证明你足以承受最后的真相。”

日记后半部分记录了庄园的建造历程、每个房间的设计思路，以及主人对谜题的热爱。最后一页写着：
“真正的传承，不在于遗产，而在于让谜语之火永不熄灭。”""",
        [
            Option("继续探索房间", "bedroom_entry"),
            Option("去落地窗看看", "bedroom_window")
        ],
        on_enter=lambda s: (s.add_clue("主人建造谜语馆的动机——传承谜语精神"), s.add_clue("窗外可能有提示"))
    )

    scenes["bedroom_dressing_table"] = Scene(
        "bedroom_dressing_table",
        """梳妆台是维多利亚风格的，银质梳妆镜的镜面严重斑驳，只能模糊映出你的轮廓。你靠近时，镜中的影像似乎比现实动作慢半拍。
抽屉里刻着“记忆之镜”，粉盒里则写着“七色光聚，真相方显”。""",
        [
            Option("寻找抽屉钥匙", "bedroom_find_key"),
            Option("尝试在子时点燃蜡烛", "bedroom_candle_midnight"),
            Option("研究梳妆镜的延迟现象", "bedroom_mirror_delay"),
            Option("返回卧室", "bedroom_entry")
        ]
    )

    scenes["bedroom_candle_midnight"] = Scene(
        "bedroom_candle_midnight",
        """你试着在烛台前等待子时，蜡烛底座上的“子时之光”似乎在暗示一个固定时间。可惜现在还不到真正的时刻。""",
        [Option("返回梳妆台", "bedroom_dressing_table")],
        on_enter=lambda s: s.add_clue("子时的烛光与卧室机关有关")
    )

    scenes["bedroom_find_key"] = Scene(
        "bedroom_find_key",
        """你在梳妆台背面找到了一个隐蔽的小铁盒，里面是一把铜钥匙。打开第四个抽屉后，里面是一本皮革封面的小册子《克劳利家训》。
家训里反复强调：谜语是连接过去与未来的桥梁。""",
        [Option("继续探索", "bedroom_entry")],
        on_enter=lambda s: s.add_clue("克劳利家训，强调谜语精神的传承")
    )

    scenes["bedroom_mirror_delay"] = Scene(
        "bedroom_mirror_delay",
        """你反复在梳妆镜前移动，发现镜像大约会延迟七秒。你几乎可以确认：镜子不仅能照出你，还能投射别的房间的影像。
如果将七枚徽章依次映入，也许能让油画产生反应。""",
        [
            Option("尝试用镜子投射所有徽章", "bedroom_mirror_projection"),
            Option("返回梳妆台", "bedroom_dressing_table")
        ],
        on_enter=lambda s: s.add_clue("镜子可以投射影像，需要将七枚徽章的影像依次映出")
    )

    scenes["bedroom_mirror_projection"] = Scene(
        "bedroom_mirror_projection",
        """你依次将徽章举到镜前。每举一枚，镜中就会延迟七秒后出现该徽章嵌入油画画框对应凹槽的影像。
当七枚全部映完，油画中的卧室窗户短暂亮起了烛光。""",
        [
            Option("等待子时再试", "bedroom_midnight_mirror"),
            Option("返回梳妆台", "bedroom_dressing_table")
        ],
        on_enter=lambda s: s.add_clue("顺序很重要，可能需按房间解谜的顺序或某种逻辑顺序")
    )

    scenes["bedroom_midnight_mirror"] = Scene(
        "bedroom_midnight_mirror",
        """你把镜子带到窗边，等待子时。月光与镜光叠在一起，卧室油画上的窗户终于彻底点亮。
衣柜背后的墙壁传来机关开启的轻响。""",
        [Option("检查衣柜背后", "bedroom_closet_back")],
        on_enter=lambda s: s.add_clue("需要在子时结合镜光与月光")
    )

    scenes["bedroom_window"] = Scene(
        "bedroom_window",
        """落地窗正对庄园花园，月光下的荒芜一览无遗。你擦去窗玻璃上的霜，发现上面刻着：站在此处，望向花园中央的喷泉，子夜时分，倒影会揭示答案。
窗台上还有一副旧望远镜，能看见喷泉池底的七角星图案。""",
        [
            Option("等待子夜观察倒影", "bedroom_midnight_fountain"),
            Option("尝试用望远镜寻找其他线索", "bedroom_telescope"),
            Option("返回卧室", "bedroom_entry")
        ],
        on_enter=lambda s: (s.add_clue("喷泉池底的七角星图案"), s.add_clue("子夜时喷泉倒影可能揭示答案"))
    )

    scenes["bedroom_telescope"] = Scene(
        "bedroom_telescope",
        """通过望远镜，你能更清楚地看到喷泉池底的七角星投影。那投影与油画上的七个房间似乎一一对应。""",
        [Option("返回落地窗", "bedroom_window")],
    )

    scenes["bedroom_midnight_fountain"] = Scene(
        "bedroom_midnight_fountain",
        """子夜时分，月光将喷泉池底的七角星投影到卧室的墙壁上。你根据投影将七枚徽章重新排列在画框凹槽中。
当最后一枚徽章放入，油画中的卧室窗户终于亮起稳定的烛光。""",
        [
            Option("根据日记和家训回答：传承谜语精神", "bedroom_answer_correct"),
            Option("回答错误", "bedroom_answer_wrong"),
            Option("返回卧室", "bedroom_entry")
        ]
    )

    scenes["bedroom_answer_correct"] = Scene(
        "bedroom_answer_correct",
        """你回答：“因为谜语不是为了囚禁人，而是为了传承好奇心和探索欲。”
油画彻底亮起，衣柜背后的墙壁发出轻响。""",
        [Option("检查衣柜背后", "bedroom_closet_back")],
        on_enter=lambda s: s.add_clue("主人建造谜语馆的动机——传承谜语精神")
    )

    scenes["bedroom_answer_wrong"] = Scene(
        "bedroom_answer_wrong",
        """油画的烛火闪烁了一下又熄灭了。看来你的回答还不够接近阿斯特的心意。""",
        [Option("重新思考", "bedroom_midnight_fountain")],
    )

    scenes["bedroom_painting"] = Scene(
        "bedroom_painting",
        """你仔细观察油画，发现六个已亮起烛光的房间里都藏着对应的核心道具图案：书、齿轮、音符、调色板、花朵、符文。
卧室窗口则仍然漆黑，像是在等待最后的理解。""",
        [
            Option("尝试用梳妆镜反射光线", "bedroom_mirror_reflection"),
            Option("用望远镜观察油画细节", "bedroom_painting_details"),
            Option("将符文石放在油画上", "bedroom_rune_solution", condition=lambda s: s.has_item("符文石")),
            Option("返回卧室", "bedroom_entry")
        ]
    )

    scenes["bedroom_painting_details"] = Scene(
        "bedroom_painting_details",
        """你注意到卧室那一格的镜子里，映出的并不是你本人，而是七角星的图案。你隐约意识到，最后的钥匙不在画上，而在理解庄园这段历史的人心中。""",
        [Option("返回油画前", "bedroom_painting")],
        on_enter=lambda s: s.add_clue("需要回答主人的问题")
    )

    scenes["bedroom_mirror_reflection"] = Scene(
        "bedroom_mirror_reflection",
        """你取下梳妆镜，将月光反射到油画上卧室窗口的位置。窗户微微闪烁，却还不足以彻底点亮。你感觉还需要别的光。""",
        [Option("寻找七色光源", "bedroom_color_light"), Option("返回油画前", "bedroom_painting")]
    )

    scenes["bedroom_color_light"] = Scene(
        "bedroom_color_light",
        """你用粉盒里的小镜片将月光分成七色，天花板上浮现出彩色光斑。当这些光斑依次落到油画上，卧室窗户终于稳定点亮。
衣柜背后传来一声轻响。""",
        [Option("检查衣柜背后", "bedroom_closet_back")],
        on_enter=lambda s: s.add_clue("需要七色光")
    )

    scenes["bedroom_closet"] = Scene(
        "bedroom_closet",
        """衣柜门半开，里面挂着几件旧式礼服和睡袍。你推开门，内部空间比预想的大。柜门内侧有一张纸条：“我最后的秘密，藏在镜中世界的七步之遥。”""",
        [
            Option("尝试打开内层衣柜", "bedroom_closet_key", condition=lambda s: s.has_item("衣柜钥匙")),
            Option("检查衣柜背后的墙壁", "bedroom_closet_back"),
            Option("返回卧室", "bedroom_entry")
        ]
    )

    scenes["bedroom_closet_key"] = Scene(
        "bedroom_closet_key",
        """你用衣柜钥匙打开了内层锁，里面挂着一件华丽的深紫色礼服。礼服胸针上镶嵌着一颗彩虹色宝石，但你摘下后发现它只是普通玻璃。
礼服口袋里有一张纸条：“彩虹徽章不在衣柜里，而在你的理解中。”""",
        [Option("继续寻找隐藏机关", "bedroom_closet_back")],
        on_enter=lambda s: s.add_clue("徽章不在衣柜，需要通过理解庄园的意义获得")
    )

    scenes["bedroom_closet_back"] = Scene(
        "bedroom_closet_back",
        """你移开衣柜，发现墙壁上有一个隐藏的壁龛，里面放着一只精致的木盒。木盒上刻着七角星图案。盒盖弹开时，最后一枚徽章静静躺在里面。""",
        [Option("前往中央密室", "final_chamber_entry")],
        on_enter=lambda s: (not s.has_item("彩虹徽章") and s.add_item("彩虹徽章") and s.set("hall_medal_count", s.get("hall_medal_count") + 1))
    )

    scenes["bedroom_rune_solution"] = Scene(
        "bedroom_rune_solution",
        """你将符文石放在油画上那片黑暗的卧室位置。符文石发出柔和的光，画中卧室的烛光被点燃，真实的卧室里所有蜡烛同时亮起。
衣柜门自动打开，里面是一个暗格，暗格中放着一枚彩虹色的徽章——最后一枚。""",
        [Option("前往中央密室", "final_chamber_entry")],
        on_enter=lambda s: (not s.has_item("彩虹徽章") and s.add_item("彩虹徽章") and s.set("hall_medal_count", s.get("hall_medal_count") + 1))
    )

    # --- 最终密室大结局 ---
    scenes["final_chamber_entry"] = Scene(
        "final_chamber_entry",
        """当七枚徽章齐聚，庄园都在震动。你来到了庄园的最深处——中央密室。
石台上放着一个古朴的金属匣子，上面有七道凹槽。
你现在必须将收集到的物品放入其中。但最重要的不是放入物品，而是你的觉悟。""",
        [
            Option("走向石台，开始匣子前的考验", "final_test_1"),
        ]
    )

    scenes["final_test_1"] = Scene(
        "final_test_1",
        """你看着石台上的七道凹槽，以及你收集的七件特殊物品。每件物品都来自一个房间，也来自一段故事。
你需要将它们放入正确的凹槽——不是按照房间顺序，而是按照你对它们含义的理解。""",
        [
            Option("按照上述对应放入物品", "final_test_1_correct"),
            Option("尝试其他组合", "final_test_1_wrong")
        ]
    )

    scenes["final_test_1_correct"] = Scene(
        "final_test_1_correct",
        """当你将最后一件物品放入凹槽，匣子发出一声轻响，盖子微微弹起，但没有完全打开。
盖子上浮现出第二行字：“七物已归，七谜已解。但你可曾明白，我为何建造谜语馆？”""",
        [Option("在心中作答，并继续下一重考验", "final_test_2")]
    )

    scenes["final_test_1_wrong"] = Scene(
        "final_test_1_wrong",
        """如果放错物品，匣子会发出刺目的红光，一股斥力将你推开。你需要重新整理物品再试。""",
        [Option("重新整理物品再试", "final_test_1")]
    )

    scenes["final_test_2"] = Scene(
        "final_test_2",
        """匣子表面浮现出七幅微缩画像，分别对应你在画室中见过的颜色与故事。顺序被打乱了，你需要按照故事的时间顺序重新排列。""",
        [
            Option("按故事顺序排列", "final_test_2_correct"),
            Option("按光谱顺序排列", "final_test_2_wrong")
        ]
    )

    scenes["final_test_2_correct"] = Scene(
        "final_test_2_correct",
        """画面排列正确后，匣子表面浮现出伊莲娜的侧影，她微微一笑，消散在光芒中。匣子再次弹开一些，出现第三行字：“你读懂了我的画，但你读懂了我吗？”""",
        [Option("继续聆听匣子的考验", "final_test_3")]
    )

    scenes["final_test_2_wrong"] = Scene(
        "final_test_2_wrong",
        """如果排列错误，画面会变得模糊，你需要重新尝试。""",
        [Option("重新观察画面", "final_test_2")]
    )

    scenes["final_test_3"] = Scene(
        "final_test_3",
        """匣子开始发出音乐。七种乐器依次奏出一个音符，但旋律缺了最后一个音。你需要补上那个音符，让整段旋律完整。""",
        [
            Option("使用夜莺徽章", "final_test_3_correct"),
            Option("哼出Do音", "final_test_3_correct"),
            Option("尝试其他音符", "final_test_3_wrong")
        ]
    )

    scenes["final_test_3_wrong"] = Scene(
        "final_test_3_wrong",
        """匣子发出刺耳的不和谐音，旋律骤然中断。你深吸一口气，知道自己补错了那一个音符。""",
        [Option("静下心来再听一遍", "final_test_3")]
    )

    scenes["final_test_3_correct"] = Scene(
        "final_test_3_correct",
        """旋律完整了。七种乐器的声音在密室中回荡，交织成壮丽的交响。当最后一个音符消散，匣子完全打开。""",
        [Option("拼合碎片，面对最终抉择", "final_test_4")]
    )

    def final_test_4_enter(state):
        route = state.get("side_music_route")
        if route == "public":
            print("你忽然想起首演那晚的掌声。埃莉诺的旋律被世界听见，选择也因此更沉重。")
        elif route == "keep":
            print("你想起自己把总谱留在密室的那一刻。沉默并非遗忘，而是另一种守护。")
        elif route == "mechanism":
            print("你感到那枚祝福仍在掌心发热。走过安息地后，你更明白这座庄园的真正重量。")

    scenes["final_test_4"] = Scene(
        "final_test_4",
        """七块碎片拼在一起，成为一面破碎的镜子。镜中倒映着你的脸，但镜像中的你戴着和阿斯特肖像画中一样的面具。
    小匣子里放着三样东西：阿斯特的亲笔信、庄园大门钥匙、一本空白笔记本。
    信中写道：谜语馆真正的遗产不是财富，而是选择。你现在要决定，这座庄园将被怎样记住。""",
        [
            Option("第一条路：成为谜语馆的主人", "ending_1"),
            Option("第二条路：成为谜语的传播者", "ending_2"),
            Option("第三条路：成为守护者，封印地下的力量", "ending_3", condition=lambda s: s.get("side_underground_completed", False) or s.get("side_underground_completed", False)),
            Option("第四条路：成为故事的讲述者", "ending_4", condition=lambda s: s.get("side_painting_completed", False) and s.get("side_clock_completed", False)),
            Option("第五条路：传承谜语精神，并同时纪念伊莲娜、埃莉诺与管家", "ending_5_truth", condition=lambda s: s.get("side_butler_completed", False) and s.get("side_underground_completed", False) and s.get("side_painting_completed", False) and s.get("side_clock_completed", False) and s.get("side_music_completed", False)),
            Option("第六条路：将谜语馆改造成公开纪念馆", "ending_7_museum", condition=lambda s: s.get("side_painting_completed", False) and s.get("side_butler_completed", False)),
            Option("迟疑、误解或逃避", "ending_6_forgotten")
        ],
        on_enter=final_test_4_enter
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

    scenes["ending_5_truth"] = Scene(
        "ending_5_truth",
        """【结局五：七重谜语的真相】\n七色光在穹顶汇聚成两道人影，像阿斯特与伊莲娜终于完成了迟到的告别。
    你走出密室后，庄园焕然一新：枯死植物重新抽芽，破碎玻璃恢复完整，尘封走廊被晨光照亮。
    你明白自己继承的不是金库，而是把谜语、音乐、绘画与真相一并传承下去的责任。""",
        [Option("重新步入轮回", "title")]
    )

    scenes["ending_6_forgotten"] = Scene(
        "ending_6_forgotten",
        """【结局六：被遗忘的探索者】\n你没有做出清晰选择。密室机关缓缓启动，将你送回庄园外的迷雾山道。
    大门在你身后关闭，徽记黯淡，连脚印都被雾气抹去。你努力回想这段旅程，却只剩模糊片段。""",
        [Option("重新步入轮回", "title")]
    )

    scenes["ending_7_museum"] = Scene(
        "ending_7_museum",
        """【结局七：纪念馆之光】\n你拒绝把谜语馆变成私人囚笼，也不让它沦为猎奇的传闻。
    在管家协助下，你将庄园改造为公开纪念馆：
    画室陈列伊莲娜手稿，音乐室保留埃莉诺旋律，地下展厅公开托马斯调查档案。
    后来人来到这里，不再只是寻找答案，而是学习如何提问、如何共情、如何在真相前保持谦逊。""",
        [Option("重新步入轮回", "title")]
    )

    return scenes
