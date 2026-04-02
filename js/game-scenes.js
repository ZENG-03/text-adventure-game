window.scenes = window.scenes || {};

(() => {
const scenes = window.scenes;

scenes["title"] = {
    desc: `《谜语遗产：七重谜域》\n\n黑幕中，七条弧线交织的徽记在黑暗中旋转，逐渐化作七道光芒...\n远处，一座维多利亚风格的庄园若隐若现。`,
    on_enter: () => {
        let msg = "";
        if(globalState.endingsReached.length > 0) {
            msg = `<div class="system-message" style="color:var(--hover-color);">【轮回记录】<br>已轮回次数：${globalState.playCount}<br>已解锁结局：${new Set(globalState.endingsReached).size} 种<br>（包含：${[...new Set(globalState.endingsReached)].join("，")}）</div>`;
        }
        return msg;
    },
    options: [
        { text: "开始新游戏", target: "opening_studio" },
        { 
            text: "继续游戏 (读取自动存档)", 
            target: "system_load_auto",
            condition: () => localStorage.getItem("riddle_auto_save") !== null 
        },
        { 
            text: "带着记忆苏醒 (开启多周目)", 
            target: "opening_studio_ng_plus", 
            condition: () => globalState.endingsReached.length > 0 
        }
    ]
};

scenes["opening_studio_ng_plus"] = {
    on_enter: () => {
        gameState.items.push("怀表");
        gameState.clues.push("前世记忆");
        return `<div class="system-message">【多周目奖励】：这是你一次新的轮回。<br>你醒来时，手中紧紧握着一块没有指针的[怀表]。同时脑海里闪过了许多[前世记忆]的碎片。</div>`;
    },
    desc: `你坐在自己的工作室里。壁炉的火光跳动，将房间染成暖橙色。\n桌上摊开着侦探笔记，旁边放着一封午夜来信。\n\n信上写着：“致敏锐的探索者：当月光照亮七面镜，谜语的血脉将再度流淌... ——阿斯特·克劳利”\n信纸背面是一张手绘地图，指向城郊迷雾山谷中的一座古老庄园。`,
    options: [
        { text: "立刻动身", target: "opening_gate" },
        { text: "研究地图", target: "opening_studio_map" }
    ]
};

scenes["opening_studio"] = {
    desc: `你坐在自己的工作室里。壁炉的火光跳动，将房间染成暖橙色。\n桌上摊开着侦探笔记，旁边放着一封午夜来信。\n\n信上写着：“致敏锐的探索者：当月光照亮七面镜，谜语的血脉将再度流淌... ——阿斯特·克劳利”\n信纸背面是一张手绘地图，指向城郊迷雾山谷中的一座古老庄园。`,
    options: [
        { text: "立刻动身", target: "opening_gate" },
        { text: "研究地图", target: "opening_studio_map" }
    ]
};

scenes["opening_studio_map"] = {
    desc: `地图上标注着七颗星，角落写着：“迷雾山谷只在满月之夜显现入口。若错过时机，请等下一次月圆。”\n今晚正是满月。`,
    options: [{ text: "立刻动身", target: "opening_gate" }]
};

scenes["opening_gate"] = {
    desc: `马车停在迷雾山谷中。一座巨大的铁艺大门矗立在雾中。\n大门虚掩着，你推开铁门，踏入一条鹅卵石小径。\n尽头是一扇橡木门，门上镶嵌着七色玻璃。你推门而入...`,
    options: [{ text: "进入大厅", target: "hall_initial_enter" }]
};

scenes["hall_initial_enter"] = {
    desc: `门厅宏伟，水晶吊灯蒙着薄灰。壁炉台上的油灯还在冒着青烟。\n管家奥尔德斯如同幽灵般出现。\n\n“欢迎，探索者。庄园内设有七道谜题，分别位于七个房间。\n每解开一道，你将获得一枚宝石徽章。集齐七枚徽章，便可开启密室。”\n他冷冷地看着你：“你确定要开始吗？”`,
    options: [
        { text: "我准备好了", target: "hall_main" },
        { text: "打听庄园历史", target: "hall_history" }
    ]
};

scenes["hall_history"] = {
    desc: `管家冷冷地回答：“主人多尔法尔·索尔维是密码学家，这里的一切都是他的杰作。其余的，你自己去发现。”`,
    options: [{ text: "我准备好了，开始探索", target: "hall_main" }]
};

scenes["hall_main"] = {
    desc: `你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。\n壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。`,
    options: [
        { text: "仔细观察大厅壁炉的纸片", target: "hall_fireplace" },
        { text: "寻找管家下落（支线《管家的秘密》）", target: "side_story_1_start" },
        { text: "检查大厅的雕像 (谜题一)", target: "puzzle_statues" },
        { text: "前往书房/图书馆 (谜题二)", target: "library_entry" },
        { text: "前往音乐室 (谜题三)", target: "musicroom_entry" },
        { text: "前往温室花房 (谜题四)", target: "greenhouse_entry" },
        { text: "前往二楼画室 (谜题五)", target: "studio_entry" },
        { text: "前往地下室 (谜题六)", target: "basement_entry" },
        { text: "前往东侧钟楼 (谜题七)", target: "clocktower_entry" },
        { 
            text: "开启中央密室大门 (大结局)", 
            target: "final_chamber_entry",
            condition: () => gameState.hall_medal_count >= 7
        }
    ]
};

scenes["hall_fireplace"] = {
    on_enter: () => {
        if(!hasClue("烧焦的纸片 (凯撒密码提示)")) {
            gameState.clues.push("烧焦的纸片 (凯撒密码提示)");
            return `<div class="system-message">【获得线索】：烧焦的纸片</div>`;
        }
        return "";
    },
    desc: `你用壁炉钳拨开灰烬，找到几片未完全烧毁的纸。\n写着：“第五个房间的钥匙藏在音乐里... 小心音不准...”\n还有一串数字：11-15-21-18-20-5-19-25。好像是凯撒密码。`,
    options: [{ text: "返回大厅", target: "hall_main" }]
};

scenes["puzzle_statues"] = {
    desc: `大厅两侧各立着四座大理石雕像：雅典娜、阿波罗、赫尔墨斯、阿尔忒弥斯。\n每座底部都有诗句，并可以旋转。\n你需要按一定顺序排列它们。`,
    options: [
        { text: "按神话对应星座顺序排列 (雅典娜=1，阿波罗=5...)", target: "statues_solved" },
        { text: "按诗句首字母解密", target: "hall_main", effectMsg: "线索不足，完全没有头绪，你放弃了。" },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["statues_solved"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("起始徽章")) {
            gameState.items.push("起始徽章", "机械齿轮");
            gameState.medals.push("起始徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：起始徽章、机械齿轮</div>`;
        }
        return msg;
    },
    desc: `你按照正确的星象逻辑旋转雕像，大厅中央的地板缓缓开启。\n从中升起一个精致的木盒。你打开木盒，里面有一枚【起始徽章】和一个【机械齿轮】。`,
    options: [{ text: "收起物品，返回大厅", target: "hall_main" }]
};

scenes["library_entry"] = {
    desc: `图书馆高耸的书架直达穹顶。中央有一张巨大的书桌，桌面上摊开着一本空白的书。\n书桌腿是狮鹫爪，踩着石球。`,
    options: [
        { text: "仔细检查书桌上的空白书", target: "library_blank_book" },
        { text: "探索书架寻找可疑的书籍", target: "library_bookshelves" },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["library_blank_book"] = {
    desc: `书封面刻着“知识即钥匙”，封底画着七颗星，第四颗被圈住。\n书脊处有一个金属搭扣。`,
    options: [
        { text: "按压封面上的第四颗星图案", target: "library_press_star" },
        { text: "强行解开金属搭扣", target: "library_unlock_clasp" },
        { text: "返回", target: "library_entry" }
    ]
};
scenes["library_press_star"] = {
    on_enter: () => {
        if(!hasClue("七学者名单 (部分)")) {
            gameState.clues.push("七学者名单 (部分)");
            return `<div class="system-message">【获得线索】：七学者名单</div>`;
        }
        return "";
    },
    desc: `咔哒。搭扣弹开。里面有一张纸条：\n“寻找无字天书，它的秘密藏在七位学者的记忆里。按出生年份排序。”\n名单上能看清：亚里士多德、达·芬奇、哥白尼。`,
    options: [{ text: "去书架寻找完整名单", target: "library_bookshelves" }]
};
scenes["library_unlock_clasp"] = {
    desc: `<span class="danger-message">你触发了陷阱！短箭飞出，擦破了你的手臂，好在没有大碍。</span>`,
    options: [{ text: "退后", target: "library_entry" }]
};
scenes["library_bookshelves"] = {
    desc: `你在书架间穿梭，找到了多本传记：《亚里士多德全集》《达·芬奇笔记》《天体运行论》《自然哲学的数学原理》《几何原本》《梦的解析》《时间简史》。`,
    options: [
        { text: "仔细翻阅每本书，寻找年份并排序", target: "library_scholar_order", condition: () => hasClue("七学者名单 (部分)") },
        { text: "检查《梦的解析》等书的异常", target: "library_check_books" },
        { text: "返回", target: "library_entry" }
    ]
};
scenes["library_scholar_order"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("智慧徽章")) {
            gameState.items.push("智慧徽章");
            gameState.medals.push("智慧徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：智慧徽章</div>`;
        }
        return msg;
    },
    desc: `你按生卒年成功将书籍排序！\n书架缓缓移开，露出一个暗格，里面放着一枚闪闪发亮的【智慧徽章】。`,
    options: [{ text: "拿走徽章，返回大厅", target: "hall_main" }]
};
scenes["library_check_books"] = {
    desc: `《梦的解析》被撕掉了半页。\n《几何原本》书脊处有一个隐藏开关。`,
    options: [{ text: "按下隐藏开关", target: "library_scholar_order", effectMsg: "开关咔哒一声脆响..." }]
};

scenes["musicroom_entry"] = {
    desc: `音乐室位于庄园一层西侧，宛如微型歌剧院。\n中央矗立着巨大的管风琴，左侧有失调的三角钢琴。角落排列着音叉。`,
    options: [
        { text: "检查管风琴", target: "musicroom_organ" },
        { text: "查看三角钢琴和乐谱", target: "musicroom_piano" },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["musicroom_organ"] = {
    desc: `管风琴有七个音栓，但拉不动（被锁死）。侧面有一个齿轮状的凹槽。`,
    options: [
        { text: "嵌入机械齿轮解锁", target: "musicroom_organ_unlock", condition: () => hasItem("机械齿轮") },
        { text: "硬拔音栓", target: "musicroom_organ", effectMsg: "死死的卡着，纹丝不动。" },
        { text: "返回", target: "musicroom_entry" }
    ]
};
scenes["musicroom_organ_unlock"] = {
    desc: `机械齿轮完美嵌入。音栓锁扣完全松开！\n你需要在此弹奏出完美的共鸣。`,
    options: [{ text: "放置键帽演奏", target: "musicroom_solved" }]
};
scenes["musicroom_solved"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("旋律徽章")) {
            gameState.items.push("旋律徽章", "调音扳手");
            gameState.medals.push("旋律徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：旋律徽章、调音扳手</div>`;
        }
        return msg;
    },
    desc: `管风琴发出雄浑的轰鸣声，产生了完美的共鸣！\n暗格滑开，露出了【旋律徽章】和一把【调音扳手】。`,
    options: [{ text: "收起物品，离开", target: "musicroom_entry" }]
};
scenes["musicroom_piano"] = {
    desc: `三角钢琴失调，弹出来的声音极其刺耳。也许需要某样工具才能校准。`,
    options: [
        { text: "用调音扳手进行校准", target: "musicroom_piano_tuned", condition: () => hasItem("调音扳手") },
        { text: "返回", target: "musicroom_entry" }
    ]
};
scenes["musicroom_piano_tuned"] = {
    on_enter: () => {
        if(!hasItem("七色花苞")) {
            gameState.items.push("七色花苞");
            return `<div class="system-message">【获得关键道具】：七色花苞</div>`;
        }
        return "";
    },
    desc: `钢琴响起了纯洁清澈的回音！在琴底暗格，你发现了一些【七色花苞】。`,
    options: [{ text: "返回", target: "musicroom_entry" }]
};

scenes["greenhouse_entry"] = {
    desc: `温室充满潮湿腐朽气味。中央有一棵枯死古树被七个花坛包围。\n树旁写着：“生命之水，需以七色之血唤醒。”`,
    options: [
        { text: "检查中央古树与浑浊石盆", target: "greenhouse_tree" },
        { text: "去工具房寻找线索和工具", target: "greenhouse_tool_shed" },
        { text: "尝试唤醒古树（融合道具）", target: "greenhouse_solved", condition: () => hasItem("七色花琥珀") && hasItem("七色花苞") && hasItem("古树血提取剂") },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["greenhouse_tree"] = {
    desc: `石盆底部埋着东西，水泛着毒光，直接手摸可能会中毒。`,
    options: [
        { text: "用手强捞", target: "greenhouse_tree", effectMsg: "啊！手麻痹了，这水有毒！" },
        { text: "用长柄夹夹出", target: "greenhouse_tree_safe", condition: () => hasItem("长柄夹") },
        { text: "返回", target: "greenhouse_entry" }
    ]
};
scenes["greenhouse_tree_safe"] = {
    on_enter: () => {
        if(!hasItem("七色花琥珀")){
            gameState.items.push("七色花琥珀");
            return `<div class="system-message">【获得关键道具】：七色花琥珀</div>`;
        }
        return "";
    },
    desc: `你用夹子捞出一个铜盒，内部有一块【七色花琥珀】！`,
    options: [{ text: "收好返回", target: "greenhouse_entry" }]
};
scenes["greenhouse_tool_shed"] = {
    desc: `工具房有个密码为建成年份的木箱。同时旁边挂着一把长柄夹。`,
    options: [
        { text: "破译木箱(密码188)并拿走架子上的夹子", target: "greenhouse_box_open" },
        { text: "返回", target: "greenhouse_entry" }
    ]
};
scenes["greenhouse_box_open"] = {
    on_enter: () => {
        if(!hasItem("长柄夹")){
            gameState.items.push("长柄夹", "古树血提取剂");
            return `<div class="system-message">【获得道具】：长柄夹、古树血提取剂</div>`;
        }
        return "";
    },
    desc: `箱子开了！你拿到了夹子和用于植物的【古树血提取剂】。`,
    options: [{ text: "返回", target: "greenhouse_entry" }]
};
scenes["greenhouse_solved"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("生命徽章")) {
            gameState.items.push("生命徽章");
            gameState.medals.push("生命徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：生命徽章</div>`;
        }
        return msg;
    },
    desc: `你将七色琥珀种下，并混合花苞与提取剂浇灌在古树盆中。\n奇迹发生，枯萎古树瞬间爆发出绿意，树冠顶端结出了【生命徽章】！`,
    options: [{ text: "取下徽章返回", target: "greenhouse_entry" }]
};

scenes["studio_entry"] = {
    desc: `画室在二层。满墙空白画布，只有画框上标注了相应的七色。\n中央是一个巨大的调色板，最主要墙壁上是一幅庞大的肖像画。`,
    options: [
        { text: "接取支线：调查落灰的日记本", target: "side_quest_painting", condition: () => !getFlag("sq_paint") },
        { text: "研究雕塑台上的矿石", target: "studio_sculpture" },
        { text: "研究巨大肖像画上的镜面", target: "studio_portrait" },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["side_quest_painting"] = {
    on_enter: () => {
        setFlag("sq_paint", true);
        gameState.clues.push("伊莲娜的日记");
        return `<div class="system-message">【支线进度】：达成，获得线索“伊莲娜的日记”</div>`;
    },
    desc: `【支线：伊莲娜的哀叹】\n这是女主人伊莲娜的日记。日记记载：“阿斯特沉迷于谜语，我感觉他在变成另一个人...”\n你深刻理解了这是由于男主人的某种痴迷造成的悲剧。`,
    options: [{ text: "合上日记，继续调查画室", target: "studio_entry" }]
};
scenes["studio_sculpture"] = {
    desc: `雕塑台上有七块原矿石。台底写道：将七石归位于光谱（红橙黄绿青蓝紫），可启颜料之源。`,
    options: [
        { text: "按照光谱顺序排列归位", target: "studio_palette_active" },
        { text: "放弃", target: "studio_entry" }
    ]
};
scenes["studio_palette_active"] = {
    on_enter: () => {
        if(!hasItem("七色神秘颜料")){
            gameState.items.push("七色神秘颜料");
            return `<div class="system-message">【获得关键道具】：七色神秘颜料</div>`;
        }
        return "";
    },
    desc: `光闪过后，调色板涌出了鲜活的【七色神秘颜料】！`,
    options: [{ text: "取走颜料", target: "studio_entry" }]
};
scenes["studio_portrait"] = {
    desc: `画像中的男子拿着一面椭圆形真镜面。\n你需要用神秘颜料在镜面作画才能解开秘密。`,
    options: [
        { text: "用七色颜料在镜面作画", target: "studio_solved", condition: () => hasItem("七色神秘颜料") },
        { text: "返回", target: "studio_entry" }
    ]
};
scenes["studio_solved"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("色彩徽章")) {
            gameState.items.push("色彩徽章");
            gameState.medals.push("色彩徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：色彩徽章</div>`;
        }
        return msg;
    },
    desc: `你将颜料涂抹后，画框背后暗门开启，里面躺着一枚【色彩徽章】！`,
    options: [{ text: "返回画室门口", target: "studio_entry" }]
};

scenes["basement_entry"] = {
    desc: `地下室阴森恐怖。入口充满了晦涩的学术符文。这里是炼金阵与地质学禁区。`,
    options: [
        { text: "接取支线：查阅散落的笔记", target: "side_quest_basement", condition: () => !getFlag("sq_base") },
        { text: "探查中央祭坛", target: "basement_alchemy" },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["side_quest_basement"] = {
    on_enter: () => {
        setFlag("sq_base", true);
        gameState.clues.push("托马斯的地质笔记");
        return `<div class="system-message">【支线进度】：达成，获得线索“托马斯的地质笔记”</div>`;
    },
    desc: `【支线：地底的回响】\n你找到了托马斯的笔记，得知这片土地下有毁灭性的古老力量。\n阿斯特设计谜语其实是为了筛选有资格镇压这股力量的守护者！`,
    options: [{ text: "合上笔记", target: "basement_entry" }]
};
scenes["basement_alchemy"] = {
    desc: `祭坛要求献祭强大的生命气息（如从温室获得的生命极品）。`,
    options: [
        { text: "投入七色花生命的共鸣力量", target: "basement_solved", condition: () => hasItem("生命徽章") || hasItem("七色花琥珀") },
        { text: "条件不足，离开", target: "basement_entry" }
    ]
};
scenes["basement_solved"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("深渊徽章")) {
            gameState.items.push("深渊徽章", "符文石");
            gameState.medals.push("深渊徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：深渊徽章、符文石</div>`;
        }
        return msg;
    },
    desc: `祭坛缓缓下沉。浮现出一块古老的【符文石】及一枚【深渊徽章】！`,
    options: [{ text: "拿走物品，原路返回", target: "hall_main" }]
};


scenes["clocktower_entry"] = {
    desc: `钟楼内满是齿轮，底部是工坊，顶层是巨大的钟盘。`,
    options: [
        { text: "接取支线：查阅观测台日志", target: "side_quest_clock", condition: () => !getFlag("side_clock_completed") },
        { text: "翻找底层工坊工具", target: "clocktower_workshop" },
        { text: "前往顶层调校钟盘", target: "clocktower_top" },
        { text: "返回大厅", target: "hall_main" }
    ]
};
scenes["side_quest_clock"] = {
    on_enter: () => {
        setFlag("side_clock_completed", true);
        gameState.clues.push("观测记录");
        return `<div class="system-message">【支线进度】：达成，获得“星月观测记录”</div>`;
    },
    desc: `【支线：星月的低语】\n记录显示了阿斯特对时间精确度的变态痴迷。`,
    options: [{ text: "返回", target: "clocktower_entry" }]
};
scenes["clocktower_workshop"] = {
    on_enter: () => {
        if(!hasItem("齿轮钥匙")){
            gameState.items.push("齿轮钥匙");
            return `<div class="system-message">【获得道具】：齿轮钥匙</div>`;
        }
        return "";
    },
    desc: `你在铁皮柜里找到了一把形状奇特的【齿轮钥匙】，可以安全调节钟楼。`,
    options: [{ text: "返回", target: "clocktower_entry" }]
};
scenes["clocktower_top"] = {
    desc: `顶层钟盘停在11:55。铭文写着需要连续平稳的七声钟鸣。`,
    options: [
        { text: "插入齿轮钥匙调校节拍", target: "clocktower_solved", condition: () => hasItem("齿轮钥匙") },
        { text: "徒手强行拨动长针", target: "clocktower_entry", effectMsg: "遭到高压电击防御机制！你被弹飞了。" },
        { text: "返回", target: "clocktower_entry" }
    ]
};
scenes["clocktower_solved"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("时空徽章")) {
            gameState.items.push("时空徽章");
            gameState.medals.push("时空徽章");
            addMedal();
            msg = `<div class="system-message">【获得奖励】：时空徽章</div>`;
        }
        return msg;
    },
    desc: `你用齿轮钥匙完美调校！“铛——”钟声平稳响了七下。\n钟盘开启，露出最后一枚【时空徽章】。`,
    options: [{ text: "取走并返回", target: "hall_main" }]
};


scenes["final_chamber_entry"] = {
    desc: `当七枚徽章齐聚，庄园都在震动。你来到了庄园的最深处的中央密室。\n石台上放着一个含有七道凹槽的古老匣子。你必须将收集到的物品和你的觉悟一同献上。`,
    options: [
        { text: "将所有极品（徽章、齿轮、符文石等）放入凹槽", target: "final_chamber_test" }
    ]
};
scenes["final_chamber_test"] = {
    desc: `所有的物品严丝合缝地归位！匣子弹开，露出了阿斯特的最后亲笔信。\n他给了你决定庄园和自己命运的选择（部分选项需对应支线解锁）：`,
    options: [
        { text: "抉择1：成为谜语馆主人，获得无尽财富困死在此", target: "ending_1" },
        { text: "抉择2：成为自由传播者，放弃财富带走笔记", target: "ending_2" },
        { text: "抉择3 (真结)：成为永恒守护者，镇压地底能量", target: "ending_3", condition: () => getFlag("sq_base") },
        { text: "抉择4 (真结)：将此地改为博物馆，传承凄美的故事", target: "ending_4", condition: () => getFlag("sq_paint") }
    ]
};

function markEnding(name) {
    if(!globalState.endingsReached.includes(name)) {
        globalState.endingsReached.push(name);
    }
    globalState.playCount += 1;
    const achMsg = checkAchievements();
    localStorage.setItem("riddle_global", JSON.stringify(globalState));
    localStorage.removeItem("riddle_auto_save"); // 通关后删掉自动存档避免死循环
    return `<div class="system-message" style="color:var(--hover-color); font-weight:bold; font-size:1.1em;">【命运定格】<br>已达成结局 - ${name}</div>${achMsg ? "<br>" + achMsg : ""}`;
}

scenes["ending_1"] = { 
    desc: `【结局一：永恒的回廊】\n你成为了主人，大门紧闭，你永远被囚禁，等待下一个挑战者...`, 
    on_enter: () => markEnding("永恒的回廊"),
    options: [{text:"重新步入轮回", target:"title", effectMsg:"时间沙漏倒转，一切归零..."}] 
};
scenes["ending_2"] = { 
    desc: `【结局二：自由的智者】\n你失去财富出版了笔记，成了名士，重获自由！`, 
    on_enter: () => markEnding("自由的智者"),
    options: [{text:"重新步入轮回", target:"title", effectMsg:"时间沙漏倒转，一切归零..."}] 
};
scenes["ending_3"] = { 
    desc: `【结局三：永恒的守护者 (大结局)】\n因为你读过地质日记，你明白了他的苦心，你选择永恒封印了毁灭的力量，拯救了世人。`, 
    on_enter: () => markEnding("永恒的守护者"),
    options: [{text:"重新步入轮回", target:"title", effectMsg:"时间沙漏倒转，一切归零..."}] 
};
scenes["ending_4"] = { 
    desc: `【结局四：谜语馆的回响 (大结局)】\n因为你读懂了女主人的悲剧，你公开了这绝美的爱情故事，使其名留青史...`, 
    on_enter: () => markEnding("谜语馆的回响"),
    options: [{text:"重新步入轮回", target:"title", effectMsg:"时间沙漏倒转，一切归零..."}] 
};


// --- 自动生成的 文本/谜题-地下室.txt 场景 ---
scenes["basement_entry"] = {
    desc: `地下室的入口位于大厅楼梯下方，一扇沉重的铁门布满锈迹。推开铁门，一股混合着泥土、铁锈和某种古老香料的气味扑面而来。石阶向下延伸，两侧墙壁上的火把在你经过时自动燃起，发出幽蓝的火焰。
地下室是一个宽阔的圆形大厅，穹顶高耸，墙壁上镶嵌着暗色的石砖。房间中央是一座石头祭坛，祭坛表面刻满复杂的符文，中心有一个泪滴形状的凹槽。祭坛周围的地面上，七块石板围成一圈，每块石板上都刻有不同的符文，微微散发着暗红色的光芒。
房间的左侧有一座巨大的熔炉，炉膛早已冰冷，但炉门上刻着火焰纹章。右侧是一张炼金工作台，上面摆满了玻璃器皿、研钵、天平和几本发霉的笔记。工作台后面的架子上，整齐地码放着各种矿石粉末和草药标本。墙壁上还挂着一幅巨大的元素周期表，但上面的符号并非现代化学符号，而是炼金术的古老标志：硫磺、水银、盐，以及七种金属的符号。
你注意到祭坛符文的微光似乎在随着你的呼吸脉动，仿佛活物。管家曾警告：“地下室的谜题关乎转化与平衡，错误的操作可能唤醒不该唤醒的东西。”`,
    options: [
        { text: "检查中央祭坛", target: "basement_altar" },
        { text: "检查熔炉", target: "basement_furnace" },
        { text: "检查炼金工作台", target: "basement_alchemy_table" },
        { text: "研究地面上的七块符文石板", target: "basement_rune_stones" },
        { text: "阅读墙上的元素周期表", target: "basement_periodic_table" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_altar"] = {
    desc: `祭坛由一整块黑色花岗岩雕成，表面被打磨得光滑如镜。中央的泪滴形凹槽深约两指，底部有一个极小的孔洞。祭坛的四个侧面分别刻着四种元素的符号：火、水、土、气，以及一段铭文：“万物皆由四元生，七金乃天地之精。欲启真门，需以生命之露灌之，以七金之魂合之。”
你用手指触摸凹槽，感到一丝温热。凹槽的底部似乎有某种吸力，像是在等待某种液体。你想起之前在其他房间可能获得过“生命之露”（温室谜题的奖励）。如果你已经拥有生命之露，可以直接使用。`,
    options: [
        { text: "将生命之露倒入凹槽（若有）", target: "basement_use_dew", condition: () => hasItem("生命之露") },
        { text: "检查祭坛底部", target: "basement_altar_bottom" },
        { text: "尝试用自己的血液代替", target: "basement_blood_attempt" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_use_dew"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要七种金属对应的物品（七金之魂）来激活全部符文")) {
            gameState.clues.push("需要七种金属对应的物品（七金之魂）来激活全部符文");
            msg += `<div class="system-message">【获得线索】：需要七种金属对应的物品（七金之魂）来激活全部符文</div>`;
        }
        return msg;
    },
    desc: `你将生命之露缓缓倒入凹槽。液体没有溢出，而是迅速被吸入，凹槽周围亮起柔和的绿光。光芒沿着祭坛表面的纹路扩散，点亮了所有符文，然后流入地面上的七块符文石板。石板依次亮起，但只亮到第五块就停了，第六、第七块依然暗淡。祭坛中央浮现出一行字：“七金之魂缺失，转化无法完成。”`,
    options: [
        { text: "检查熔炉和工作台，寻找七金", target: "basement_search_metals" },
        { text: "查看祭坛是否还有其他机关", target: "basement_altar" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_altar_bottom"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("七金对应位置")) {
            gameState.clues.push("七金对应位置");
            msg += `<div class="system-message">【获得线索】：七金对应位置</div>`;
        }
        return msg;
    },
    desc: `你趴下检查祭坛底部。在底座内侧，你发现了一行极小的刻字：“金、银、铜、铁、锡、铅、汞，七金之序，对应七曜。以火锻之，以水淬之，以气凝之，以土固之。” 下面还有一个简图，显示七种金属在祭坛周围的对应位置：金（东）、银（西）、铜（南）、铁（北）、锡（东南）、铅（西北）、汞（中央？但中央是凹槽）。实际上，简图显示祭坛周围的七个符文石板各对应一种金属，需要将相应的金属物品放在石板上。`,
    options: [
        { text: "寻找七种金属物品", target: "basement_search_metals" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_blood_attempt"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("祭坛封印（暂时无法使用，需要找到重置方法）")) {
            setFlag("祭坛封印（暂时无法使用，需要找到重置方法）", true);
            msg += `<div class="danger-message">【状态】：祭坛封印（暂时无法使用，需要找到重置方法）</div>`;
        }
        return msg;
    },
    desc: `你咬破手指，将几滴血滴入凹槽。鲜血接触凹槽的瞬间，祭坛发出刺目的红光，符文剧烈闪烁，一股强大的斥力将你弹飞，撞在墙上。你感到头晕目眩，祭坛的光芒逐渐暗淡，地面上的符文石板全部熄灭，似乎被暂时封印了。你听见一个苍老的声音在空气中回荡：“汝非吾血，不可妄动。”`,
    options: [
        { text: "探索其他地方寻找重置方法", target: "basement_search_reset" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_alchemy_table"] = {
    desc: `工作台覆盖着一层薄灰，但仪器摆放整齐。你注意到台面上有几样东西值得仔细检查：
- 一本皮革封面的《炼金术士笔记》，书页泛黄，字迹潦草
- 一套玻璃蒸馏装置，连接着各种曲颈瓶
- 一个铜制天平，左右托盘各有一个小碗
- 一个研钵，里面残留着某种黑色粉末
- 一个木架，上面放着七个小瓶子，分别标有七种金属的炼金符号，但大部分是空的，只有“金”和“汞”两个瓶子里还有少量物质`,
    options: [
        { text: "阅读《炼金术士笔记》", target: "basement_read_notes" },
        { text: "检查蒸馏装置", target: "basement_distillation" },
        { text: "检查天平和研钵", target: "basement_balance" },
        { text: "查看七个小瓶子", target: "basement_vials" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_read_notes"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("元素调和配方")) {
            gameState.clues.push("元素调和配方");
            msg += `<div class="system-message">【获得线索】：元素调和配方</div>`;
        }
        if(!hasClue("七金之魂需要熔炉炼制")) {
            gameState.clues.push("七金之魂需要熔炉炼制");
            msg += `<div class="system-message">【获得线索】：七金之魂需要熔炉炼制</div>`;
        }
        return msg;
    },
    desc: `笔记的前半部分是炼金术记录，后半部分是日记。你快速翻阅，找到几页关键内容：
“第四十七日：终于完成了七金的提纯。金从王水中还原，银从硝酸银中析出，铜……但汞总是难以固化，只能以液态保存。”
“第七十二日：主人要求我将七金之‘魂’注入符文石板。所谓魂，并非金属本身，而是其‘精粹’——经过炼金术转化的活性形态。我熔炼了金、银、铜、铁、锡、铅，但汞无法熔炼，只能以原态使用。”
“第一百零三日：熔炉的火焰必须达到‘白热’才能完成转化。我设计了七个坩埚，分别对应七种金属。但熔炉的燃料不足，只有将四种元素调和到平衡状态，炉火才能达到所需温度。”
“最后一页：祭坛的符文需要按正确的元素顺序激活。土→水→火→气，循环三次，中央的泪滴才会接纳生命之露。切记，顺序不可错，否则……”
笔记中夹着一张折好的羊皮纸，展开后是一幅元素调和图：火、水、土、气四个符号排成十字形，每个符号旁边标注着需要添加到熔炉中的物质：火（硫磺）、水（水银）、土（盐）、气（硝石）。图下面有一行小字：“等量调和，点燃即可。”`,
    options: [
        { text: "根据配方准备材料", target: "basement_prepare_materials" },
        { text: "检查熔炉", target: "basement_furnace" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_distillation"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("熔炉钥匙")) {
            gameState.items.push("熔炉钥匙");
            msg += `<div class="system-message">【获得物品】：熔炉钥匙</div>`;
        }
        return msg;
    },
    desc: `蒸馏装置由三个球形瓶和一根冷凝管组成。最左边的烧瓶里还有少量淡蓝色液体，中间的是空的，右边的收集瓶里有几滴黄色油状物。冷凝管连接着一个水槽，但水槽早已干涸。你轻轻拧开左边烧瓶的塞子，一股刺鼻的气味涌出，你赶紧塞回去。瓶身上贴着标签：“王水（腐蚀性）”。
你注意到蒸馏装置的支架上挂着一把铜钥匙，钥匙柄上刻着熔炉的图案。`,
    options: [
        { text: "用钥匙打开熔炉", target: "basement_furnace_with_key" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_balance"] = {
    desc: `铜制天平的两个托盘都有磨损。左边的托盘里有一小撮白色粉末，右边的托盘里有一颗灰色的小石子。你拿起石子端详，发现它其实是铅块，上面刻着“Pb”。白色粉末很可能是某种盐类。天平目前是平衡的，但如果你移动任何东西，天平就会倾斜。
你注意到天平底座上刻着一行字：“权衡七金，轻重有度。唯等量者，可得其魂。” 这可能意味着你需要在天平上称量出七种金属的等量“精粹”才能用于熔炼。`,
    options: [
        { text: "用天平称量金属材料", target: "basement_weigh_metals" },
        { text: "暂时不动", target: "basement_alchemy_table" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_vials"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要获得七种金属的材料")) {
            gameState.clues.push("需要获得七种金属的材料");
            msg += `<div class="system-message">【获得线索】：需要获得七种金属的材料</div>`;
        }
        return msg;
    },
    desc: `七个小瓶子按照炼金术的七金顺序排列：金（☉）、银（☽）、铜（♀）、铁（♂）、锡（♃）、铅（♄）、汞（☿）。只有金瓶里有一小块金箔，汞瓶里有几滴银色液体（水银）。其他瓶子都是空的。
瓶身都有刻度，显示每种金属所需的“精粹”量似乎是相同的体积（约5毫升）。金箔的体积显然不够，你需要从其他地方获得更多的金、银等金属材料。`,
    options: [
        { text: "在房间里寻找金属材料", target: "basement_find_metals" },
        { text: "检查熔炉", target: "basement_furnace" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_furnace"] = {
    desc: `熔炉是一座齐腰高的砖砌结构，炉门是铸铁的，上面铸有火焰纹章。炉门紧锁，你需要钥匙才能打开。炉顶有一个烟囱直通上方，烟道口有一个风门调节杆。炉前的地面上散落着一些煤渣和铁屑。
如果你已经获得了熔炉钥匙（从蒸馏装置或别处），可以打开炉门。`,
    options: [
        { text: "用熔炉钥匙打开炉门", target: "basement_open_furnace" },
        { text: "检查炉门周围是否有其他机关", target: "basement_furnace_surround" },
        { text: "尝试强行撬开炉门", target: "basement_force_furnace" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_open_furnace"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要先调和四元素产生火焰，再将金属材料放入坩埚炼制")) {
            gameState.clues.push("需要先调和四元素产生火焰，再将金属材料放入坩埚炼制");
            msg += `<div class="system-message">【获得线索】：需要先调和四元素产生火焰，再将金属材料放入坩埚炼制</div>`;
        }
        return msg;
    },
    desc: `钥匙插入锁孔，转动后炉门弹开。炉膛内部有七个凹槽，每个凹槽里有一个小坩埚，坩埚上分别刻着七金的符号。坩埚底部有管道连接到一个中央收集器。炉膛的底部有燃烧室，里面残留着一些灰烬。
你在炉膛内壁发现一段铭文：“四元调和，炉火自生。七金入埚，精魂乃成。” 旁边有一个刻度盘，标有火、水、土、气四个档位，还有一个点火按钮。目前刻度盘是空的。`,
    options: [
        { text: "寻找四元素调和材料", target: "basement_prepare_materials" },
        { text: "先尝试将金属放入坩埚", target: "basement_put_metals" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_furnace_surround"] = {
    desc: `你检查炉门周围，发现炉门铰链处有一个隐蔽的凹槽，形状与之前在其他房间获得的某种道具相似（例如星盘钥匙？但这里是地下室，或许有独立的机关）。你摸到一个松动的砖块，取出后里面是一个小铁盒，盒子里有一张纸条：“熔炉钥匙在蒸馏装置上，拿走它。” 但你若已经拿走，这里只是确认。`,
    options: [
        { text: "去蒸馏装置拿钥匙", target: "basement_distillation" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_force_furnace"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("烫伤（影响操作）")) {
            setFlag("烫伤（影响操作）", true);
            msg += `<div class="system-message">【状态】：烫伤（影响操作）</div>`;
        }
        return msg;
    },
    desc: `你试图用工具撬开炉门，但炉门纹丝不动，反而触发了机关。炉门上的火焰纹章突然喷出一股高温蒸汽，你的手被严重烫伤。你惨叫一声，退后几步。蒸汽消散后，炉门仍然紧闭，但你的手需要包扎处理。`,
    options: [
        { text: "去大厅寻找医疗物品", target: "hall_injured" },
        { text: "继续用另一只手探索", target: "basement_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_rune_stones"] = {
    desc: `地面上的七块石板围成一圈，每块石板约有脸盆大小，表面刻着不同的符文。你蹲下仔细观察，发现符文是炼金术中的行星符号与元素符号的组合。例如：
- 东侧石板：太阳符号（☉）与土元素符号组合
- 西侧：月亮符号（☽）与水元素组合
- 南侧：金星符号（♀）与火元素组合
- 北侧：火星符号（♂）与气元素组合
- 东南：木星符号（♃）与土元素组合
- 西北：土星符号（♄）与水元素组合
- 中央石板（祭坛正下方）是水星符号（☿）与火元素组合
石板表面有细微的划痕，似乎可以被激活。当你触摸一块石板时，它会发出微弱的光芒，但随即熄灭。你想起祭坛的提示，可能需要按特定顺序激活它们。`,
    options: [
        { text: "尝试按元素顺序激活石板", target: "basement_activate_stones" },
        { text: "尝试按行星顺序激活", target: "basement_activate_planets" },
        { text: "先寻找关于激活顺序的线索", target: "basement_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_activate_stones"] = {
    desc: `如果你没有线索，盲目尝试激活，可能触发陷阱。你可以选择一种顺序：
- 火→水→土→气循环三次 [前往 basement_stone_trap]
- 土→水→火→气循环三次 [前往 basement_stone_correct? 但需配合七金]
实际上，正确的激活顺序与祭坛的转化流程有关。笔记中提到“土→水→火→气，循环三次”，但这是元素调和炉火的顺序，而非符文石板。石板可能需要按行星的顺序激活，与七金对应。
为了简化，我们设计两种正确路径：
1. 先完成七金炼制，将金属精粹放在石板上，石板自然激活。
2. 或者通过元素调和与祭坛联动。
我们设计一个独立的分支：如果玩家在没有七金的情况下尝试激活石板，会失败并触发陷阱。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_stone_trap"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("麻痹，石板损坏（需修复）")) {
            setFlag("麻痹，石板损坏（需修复）", true);
            msg += `<div class="danger-message">【状态】：麻痹，石板损坏（需修复）</div>`;
        }
        return msg;
    },
    desc: `你按下一个石板，它短暂亮起，然后所有石板同时发出刺目的红光，一股冲击波将你击倒。你感到全身麻痹，符文的力量在你体内乱窜。你勉强爬起，发现石板已经全部熄灭，而且表面出现了裂纹。短时间内无法再次尝试。`,
    options: [
        { text: "返回大厅休息", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_find_metals"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("七种金属材料（每种一份）")) {
            gameState.items.push("七种金属材料（每种一份）");
            msg += `<div class="system-message">【获得物品】：七种金属材料（每种一份）</div>`;
        }
        return msg;
    },
    desc: `你需要七种金属材料（金、银、铜、铁、锡、铅、汞）来炼制“精粹”。你在房间内搜寻：
- 金：工作台的金瓶里有一小片金箔，但量太少。你在熔炉的灰烬里发现了一枚金戒指（可能是之前炼金术士遗落的）。
- 银：在祭坛的底座缝隙里，你找到一枚银币。
- 铜：蒸馏装置的管道是铜制的，可以拆下一小段。
- 铁：熔炉门上的铰链是铁的，可以拆下几颗铁钉。
- 锡：工作台的一个抽屉里有一块焊锡条。
- 铅：天平的砝码是铅的，可以取下一个。
- 汞：工作台的汞瓶里有水银。`,
    options: [
        { text: "去熔炉炼制精粹", target: "basement_smelt_essence" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_smelt_essence"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("七金精粹（七瓶）")) {
            gameState.items.push("七金精粹（七瓶）");
            msg += `<div class="system-message">【获得物品】：七金精粹（七瓶）</div>`;
        }
        return msg;
    },
    desc: `你打开炉门，将七种金属分别放入对应的坩埚中。然后你需要调和四元素点燃炉火。根据笔记的配方，你需要准备：
- 火元素：硫磺（工作台架子上有硫磺粉）
- 水元素：水银（使用汞瓶中的水银，但水银需要用于炼制，你可能需要另外的水银来源？笔记中水元素用的是水银，但水银也是七金之一。这里可能冲突。我们设计为：水元素可用“蒸馏水”替代，工作台有蒸馏水瓶）
- 土元素：盐（工作台有食盐）
- 气元素：硝石（工作台有硝石粉）
你找到这些材料，按等量（各一小勺）放入炉膛的燃烧室。将刻度盘依次转到土、水、火、气各一次，然后按下点火按钮。炉膛内升起蓝色火焰，温度逐渐升高。坩埚中的金属开始熔化，通过管道流入中央收集器，形成七种不同颜色的“精粹”液滴，分别滴入七个小瓶（你从工作台取来空瓶接取）。`,
    options: [
        { text: "将精粹放在符文石板上", target: "basement_place_essence" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_place_essence"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("紫色徽章（6/7）")) {
            gameState.items.push("紫色徽章（6/7）");
            gameState.medals.push("紫色徽章（6/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：紫色徽章（6/7）</div>`;
        }
        if(!hasItem("符文石")) {
            gameState.items.push("符文石");
            msg += `<div class="system-message">【获得物品】：符文石</div>`;
        }
        return msg;
    },
    desc: `你按照祭坛底部简图的对应关系，将七瓶精粹分别放在七块符文石板上：
- 金精粹 → 东侧石板
- 银精粹 → 西侧
- 铜精粹 → 南侧
- 铁精粹 → 北侧
- 锡精粹 → 东南
- 铅精粹 → 西北
- 汞精粹 → 中央（祭坛下方的石板）
每放一瓶，对应的石板就亮起稳定的光芒。当最后一瓶放好，所有石板同时亮起，光芒汇聚到祭坛中央的泪滴凹槽。祭坛开始震动，凹槽内浮现出一团旋转的光球。光球逐渐凝实，化为一枚紫色的徽章和一块符文石。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_altar_direct"] = {
    desc: `如果你已经拥有生命之露，但尚未炼制七金精粹，也可以尝试通过元素调和直接激活祭坛。笔记中提到的“土→水→火→气，循环三次”实际上也是激活符文的一种方式。你可以在祭坛周围的四个方向（东、南、西、北）分别放置对应的元素代表物，然后按顺序激活。
具体操作：在祭坛东侧放土元素代表物（一块泥土或盐），南侧放火（硫磺），西侧放水（蒸馏水），北侧放气（硝石）。然后按土、水、火、气的顺序触摸祭坛侧面相应元素的符号，循环三次。祭坛会激活，但可能只能获得部分奖励（比如一块辅助道具），而非徽章。完整的徽章仍需七金。`,
    options: [
        { text: "尝试元素调和激活祭坛", target: "basement_elemental_activation" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_elemental_activation"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("符文石碎片（可在后续与其他碎片组合）")) {
            gameState.items.push("符文石碎片（可在后续与其他碎片组合）");
            msg += `<div class="system-message">【获得物品】：符文石碎片（可在后续与其他碎片组合）</div>`;
        }
        return msg;
    },
    desc: `你按照步骤操作。当你第三次循环结束时，祭坛中央浮现出一块符文碎片，光芒散去后，你获得了符文石的一部分，但徽章并未出现。祭坛上的铭文显示：“七金未全，仅得其半。”`,
    options: [
        { text: "继续寻找七金", target: "basement_find_metals" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_poison_gas"] = {
    desc: `如果你在炼金工作台上错误混合了某些化学物质（例如将王水与硫磺混合），会产生有毒气体。你吸入后中毒，倒在地上。管家赶来时，你已经奄奄一息。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_furnace_explosion"] = {
    desc: `如果你在熔炉中放入错误比例的调和物，或者点火顺序错误，炉膛会爆炸。你被碎片击中，重伤不治。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_rune_curse"] = {
    desc: `如果你在未完成祭坛准备的情况下强行触碰所有符文石板，符文会释放诅咒，你的身体逐渐石化。在你完全变成石像前，你听见管家的叹息：“鲁莽的代价。”
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_search_reset"] = {
    desc: `如果你触发了祭坛封印（例如用血激活失败），需要找到重置方法。你可以在炼金工作台找到一瓶“净化之水”，将其倒在祭坛上，符文会恢复原状。`,
    options: [
        { text: "使用净化之水", target: "basement_reset_success" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_reset_success"] = {
    desc: `净化之水洗净了祭坛上的血迹，符文重新开始脉动。祭坛恢复可用状态。`,
    options: [
        { text: "重新尝试", target: "basement_altar" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（返回大厅，地下室谜题完成）
以上扩展为地下室之谜提供了丰富的分支、线索收集、炼金机制、元素调和、多种解谜路径和失败结局，总文本量约5000字。您可以根据需要调整分支深度和选项数量，确保与其他房间（如温室的生命之露）的线索联动自然。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-画室.txt 场景 ---
scenes["studio_entry"] = {
    desc: `画室位于庄园二层东侧，是一间宽敞明亮的房间，原本应充满艺术气息，如今却笼罩在诡异的沉寂中。推开雕花木门，月光透过天窗洒落，照亮了满墙的画作——但所有画布都是空白的，只有画框上标着不同的颜色名称：赤、橙、黄、绿、青、蓝、紫。
房间中央立着一块巨大的调色板，直径近两米，上面有七个颜料槽，但全部干涸，结成硬块。调色板旁边有一支画笔，笔尖触碰画布时会留下透明的痕迹，随即消失。靠墙摆放着几幅完成的肖像画，画中人物都戴着一副奇怪的面具，面具上只有眼睛部位留有空隙。
最引人注目的是东墙上那幅最大的肖像画：画中是一位身着文艺复兴长袍的男子（似乎是庄园主人阿斯特·克劳利），他手中握着一面椭圆形镜子，镜中倒映着七种颜色，但顺序混乱。镜子的边框镶着七颗宝石，与之前图书馆空白书上的凹槽类似。
画室的南墙有一扇彩色玻璃窗，窗上有七块不同颜色的玻璃，但被灰尘覆盖。北墙立着几个画架，上面有未完成的草稿。西墙是一排颜料柜，抽屉上标有颜料名称。房间角落里还有一座小型雕塑台，上面放着几块未雕琢的石头和一个放大镜。
管家曾经暗示：“画室的谜题关乎真实与虚幻，颜色与光线。只有让镜中的色彩归位，才能揭示隐藏的真相。”`,
    options: [
        { text: "检查中央调色板和画笔", target: "studio_palette" },
        { text: "研究东墙的大幅肖像画", target: "studio_portrait" },
        { text: "探索彩色玻璃窗", target: "studio_stained_glass" },
        { text: "检查颜料柜", target: "studio_cabinet" },
        { text: "查看画架上的草稿", target: "studio_sketches" },
        { text: "检查雕塑台", target: "studio_sculpture" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_palette"] = {
    desc: `巨大的调色板由整块大理石雕成，边缘装饰着藤蔓花纹。七个颜料槽呈扇形排列，每个槽底部都有一个微小的孔洞，连接着看不见的管道。颜料槽内壁残留着干涸的色块，你用手指轻轻刮擦，得到一些粉末：
- 赤色槽：铁锈红的粉末
- 橙色槽：偏黄的橙粉
- 黄色槽：明亮的黄粉
- 绿色槽：草绿色的粉末
- 青色槽：蓝绿色粉末
- 蓝色槽：深蓝色粉末
- 紫色槽：紫罗兰色粉末
这些粉末闻起来有矿物质的气味，似乎是某种矿石颜料。调色板中央有一个凹陷的圆盘，上面刻着：“色之本源，七石所出。调和以水，可绘真形。”
画笔搁在调色板边缘，笔杆是乌木制成，笔尖的毫毛已经干硬。你将笔尖蘸水，在调色板上试着画了一下，留下淡淡的水痕，但没有颜色。显然，需要先让颜料槽恢复活性。`,
    options: [
        { text: "尝试向颜料槽中加水", target: "studio_add_water" },
        { text: "检查调色板底部的管道", target: "studio_palette_pipes" },
        { text: "寻找能够溶解干涸颜料的东西", target: "studio_find_solvent" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_add_water"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("颜料槽被稀释（需要重新干燥或清理）")) {
            setFlag("颜料槽被稀释（需要重新干燥或清理）", true);
            msg += `<div class="danger-message">【状态】：颜料槽被稀释（需要重新干燥或清理）</div>`;
        }
        return msg;
    },
    desc: `你从旁边的水桶里舀水倒入每个颜料槽。水渗入干涸的颜料，但很快就被吸收，颜料并没有变得可用，反而变成一滩稀泥，毫无色泽。看来需要特殊的溶剂，或者需要先研磨颜料。`,
    options: [
        { text: "继续寻找其他方法", target: "studio_palette" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_palette_pipes"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("颜料来自管道，可能从别处输送")) {
            gameState.clues.push("颜料来自管道，可能从别处输送");
            msg += `<div class="system-message">【获得线索】：颜料来自管道，可能从别处输送</div>`;
        }
        return msg;
    },
    desc: `你趴下检查调色板底部，发现每个颜料槽下方都连接着一根细铜管，七根铜管汇聚到一根总管，通向墙壁。铜管上附着一些干涸的颜料结晶，但管道似乎畅通。管道的入口处有一个旋塞，目前处于关闭状态。你试着打开旋塞，没有反应——可能需要先提供某种流体（比如油或水）才能将颜料输送到调色板。`,
    options: [
        { text: "顺着管道寻找源头", target: "studio_pipe_source" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_cabinet"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("七种矿石与颜色的对应关系")) {
            gameState.clues.push("七种矿石与颜色的对应关系");
            msg += `<div class="system-message">【获得线索】：七种矿石与颜色的对应关系</div>`;
        }
        if(!hasClue("颜料配方手册")) {
            gameState.clues.push("颜料配方手册");
            msg += `<div class="system-message">【获得线索】：颜料配方手册</div>`;
        }
        return msg;
    },
    desc: `颜料柜是一排深色木柜，有数十个小抽屉，每个抽屉上贴着标签：朱砂、雌黄、石绿、石青、铅白、藤黄……但许多抽屉是空的。你逐一拉开，发现几个抽屉里有残留的粉末，但量很少。
在柜子最底层，你发现一个上了锁的抽屉，锁是密码式的，需要输入四个数字。抽屉面板上刻着一行字：“七色之花，生于七石。” 你想起之前在温室获得的七色花琥珀，也许相关。如果你已经解开了温室谜题，可能知道七种颜色对应的矿石。
另一个抽屉里有一本《颜料配方手册》，记载了古代画家如何从矿物、植物中提取颜料。手册中提到：“朱砂得自辰砂，雌黄得自雄黄，石绿得自孔雀石，石青得自蓝铜矿，铅白得自白铅矿，藤黄得自植物树脂，紫胶得自昆虫。” 每种颜料都有对应的产地和提纯方法。
手册最后几页夹着一张手绘地图，标注了庄园附近七处矿点，每处对应一种颜色矿石。但地图年代久远，有些地点已经模糊。`,
    options: [
        { text: "尝试打开密码抽屉", target: "studio_password_drawer" },
        { text: "按照地图寻找矿石（可能需要去庄园外，但本谜题限于画室内）", target: "hall_main" },
        { text: "检查雕塑台上的石头", target: "studio_sculpture" }
    ]
};

scenes["studio_password_drawer"] = {
    desc: `密码抽屉需要四位数字。你想起调色板上有七个颜料槽，但密码是四位。也许与七种颜色无关，而是与画室中的某幅画或某个数字有关。你观察抽屉表面，发现边缘有一行极小的字：“镜子中的秘密，藏在第一幅画里。”
你走到墙边，寻找“第一幅画”。墙上有许多空白画框，但有一幅小画与众不同——它上面有一层淡淡的底稿痕迹，似乎是某种草稿。底稿上画着一个色轮，色轮上标有数字：红1、橙2、黄3、绿4、青5、蓝6、紫7。也许密码就是这些数字的某种组合？但四位数字可能是“1-2-3-4”或“7-6-5-4”？你尝试输入1234，锁没有反应。输入7654，也没有。
你仔细观察底稿，发现色轮中央有一个箭头，指向红色，但红色旁边有一个很小的数字“3”。原来，这是另一种编码：每种颜色对应一个位置，而箭头所指的颜色是“起始”。也许密码是颜色在色轮上的顺序，但需要从红色开始。红色=1，橙色=2，但箭头指向红色却写了个3，矛盾。
你换一种思路：也许“第一幅画”不是这幅底稿，而是进门后第一眼看到的那幅画。你转身，正对门口的那幅画是一个空白画框，但画框上标着“赤”。赤色是红色，对应数字？在色轮中红色是1。也许密码就是1-?-?-? 你需要更多线索。
（这种分支可以设计为需要其他房间的线索才能解开。例如，如果已经解开了图书馆，可能得到一本《色彩密码》之类的书，提供对应关系。为简化，我们设计另一种解法：密码抽屉里其实是空的，或者需要从别处得到钥匙。）
实际上，我们可以让这个密码抽屉在得到某种钥匙（如从雕塑台获得）后直接打开，而不是复杂的密码。`,
    options: [
        { text: "暂时放弃，探索其他地方", target: "studio_cabinet" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_sculpture"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("七色矿石")) {
            gameState.items.push("七色矿石");
            msg += `<div class="system-message">【获得物品】：七色矿石</div>`;
        }
        return msg;
    },
    desc: `雕塑台是一个旋转台面，上面放着几块未经雕琢的石头。你用放大镜观察，发现这些石头其实是矿石：一块朱红色的辰砂、一块金黄色的雄黄、一块翠绿色的孔雀石、一块天蓝色的蓝铜矿、一块白色的白铅矿、一块黄色的藤黄树脂、一块紫色的紫胶虫胶。它们恰好对应七种颜料原料！
石头上都刻着编号I到VII，但顺序混乱。台面边缘有一圈刻度，可以旋转。台座底部有一行字：“将七石归位于光谱，可启颜料之源。”
你意识到，需要将这些矿石按照光谱顺序（红、橙、黄、绿、青、蓝、紫）排列在旋转台上，然后旋转到某个位置，才能激活颜料输送管道。`,
    options: [
        { text: "将矿石按光谱顺序排列", target: "studio_arrange_stones" },
        { text: "检查旋转台的刻度", target: "studio_rotate_scale" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_arrange_stones"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("颜料柜解锁，调色板获得颜料")) {
            setFlag("颜料柜解锁，调色板获得颜料", true);
            msg += `<div class="system-message">【状态】：颜料柜解锁，调色板获得颜料</div>`;
        }
        return msg;
    },
    desc: `你将矿石按照颜色顺序排列在台面上：辰砂（红）→？橙色矿石？实际上，你并没有橙色的矿石。雄黄是金黄色，接近橙色但偏黄；藤黄是黄色；孔雀石是绿色；蓝铜矿是青色/蓝色；紫胶是紫色。缺少纯橙色和纯蓝色之间的过渡。但也许可以用雄黄（橙黄）和蓝铜矿（深蓝）替代。光谱顺序应是：红、橙、黄、绿、青、蓝、紫。你只有六种矿石？再检查：辰砂（红）、雄黄（橙黄）、藤黄（黄）、孔雀石（绿）、蓝铜矿（蓝/青）、紫胶（紫）。实际上蓝铜矿可以同时代表青和蓝？但你需要七种。也许还有一块石青（蓝）？你仔细找，在台面角落发现一块小的蓝铜矿（深蓝），和之前那块（浅蓝）不同。这样就有七种了。
你按红、橙、黄、绿、青、蓝、紫排列好。台面中央升起一个小柱子，柱顶有一个按钮。你按下按钮，台面缓缓旋转，每转到一个刻度，就有一道光线从台面射出，射向对应的颜料柜抽屉。当七道光线全部射出后，颜料柜中传来咔哒声，所有抽屉自动解锁，并且调色板上的颜料槽开始渗出新鲜的颜料。`,
    options: [
        { text: "检查调色板", target: "studio_palette_active" },
        { text: "检查颜料柜", target: "studio_cabinet_open" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_palette_active"] = {
    desc: `现在七个颜料槽里充满了鲜艳的颜料：赤、橙、黄、绿、青、蓝、紫。你用画笔蘸取颜料，在旁边的试纸上试画，色彩饱满。但是，当你用这些颜料在空白画布上作画时，颜色会很快褪去，无法留下痕迹。你需要一种“定色剂”或某种特殊的光线条件才能让画作永久保存。
你想起肖像画中的镜子，也许需要正确的光线照射。`,
    options: [
        { text: "尝试在肖像画上作画", target: "studio_paint_portrait" },
        { text: "研究彩色玻璃窗", target: "studio_stained_glass" },
        { text: "寻找定色剂", target: "studio_fixative" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_stained_glass"] = {
    desc: `南墙的彩色玻璃窗由七块不同颜色的玻璃拼成，但覆盖着厚厚的灰尘。你擦去灰尘，月光透过玻璃，在地板上投下七色光斑。光斑的位置随着月亮的移动而变化。你注意到，当光斑落在调色板上时，颜料会微微发光。
窗框旁边有一个曲柄，可以转动玻璃窗的角度。你试着转动曲柄，七块玻璃可以独立调节倾斜角度，从而改变光斑的位置。`,
    options: [
        { text: "调节玻璃角度，使七色光斑分别照在调色板的七个颜料槽上", target: "studio_light_palette" },
        { text: "调节光斑照在肖像画的镜子上", target: "studio_light_mirror" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_light_palette"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要用调色板上的颜料在肖像画的镜子上作画")) {
            gameState.clues.push("需要用调色板上的颜料在肖像画的镜子上作画");
            msg += `<div class="system-message">【获得线索】：需要用调色板上的颜料在肖像画的镜子上作画</div>`;
        }
        return msg;
    },
    desc: `你将七色光斑依次对准调色板的七个颜料槽。每对准一个，该颜料槽就发出更亮的光，颜料变得活跃。当七个光斑都对准后，调色板中央浮现出一行字：“光已备，色已活。请绘真形于镜中。”`,
    options: [
        { text: "去肖像画处", target: "studio_portrait" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_light_mirror"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要在镜子中央作画")) {
            gameState.clues.push("需要在镜子中央作画");
            msg += `<div class="system-message">【获得线索】：需要在镜子中央作画</div>`;
        }
        return msg;
    },
    desc: `你将七色光斑汇聚到肖像画中那面镜子的位置。镜子表面突然变得像真实的镜面一样反射光芒，镜中的颜色开始流动，原本混乱的顺序逐渐重组，最终形成一个标准的色轮（红、橙、黄、绿、青、蓝、紫顺时针排列）。色轮中心出现一个空白的圆形区域，仿佛等待填充。`,
    options: [
        { text: "用画笔在镜子中央作画", target: "studio_paint_mirror" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_portrait"] = {
    desc: `大幅肖像画中的男子目光深邃，手中的镜子似乎有魔力。你走近观察，发现镜子其实是一块嵌入画布的真正的镜面玻璃，表面有细微的划痕。当你靠近时，镜中倒映出你自己的脸，但镜像中的你脸上戴着一副面具，面具上只有眼睛部位留空。你试着改变表情，镜像却保持不变——它似乎不是实时反射，而是某种预设的画面。
镜框上的七颗宝石，每颗都对应一种颜色。你试着触摸宝石，它们可以按动。当你按下一颗宝石，镜中相应的颜色就会闪烁。你想起图书馆空白书的宝石凹槽，也许需要按正确的顺序按下宝石。`,
    options: [
        { text: "按颜色顺序（红橙黄绿青蓝紫）依次按下宝石", target: "studio_press_gems" },
        { text: "按光谱顺序（红橙黄绿蓝靛紫）但这里有七色，靛色由青色和蓝色替代？实际上，我们的七色是赤橙黄绿青蓝紫，所以顺序就是赤橙黄绿青蓝紫", target: "studio_gem_correct" },
        { text: "尝试其他顺序", target: "studio_gem_wrong" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_gem_correct"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("橙色徽章（4/7）")) {
            gameState.items.push("橙色徽章（4/7）");
            gameState.medals.push("橙色徽章（4/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：橙色徽章（4/7）</div>`;
        }
        if(!hasItem("神秘颜料")) {
            gameState.items.push("神秘颜料");
            msg += `<div class="system-message">【获得物品】：神秘颜料</div>`;
        }
        return msg;
    },
    desc: `你按赤、橙、黄、绿、青、蓝、紫的顺序按下宝石。每按下一颗，镜中对应的颜色就亮起，并且镜子表面泛起涟漪。当第七颗按完，镜面突然变得透明，露出后面一个暗格，里面放着一枚橙色徽章？等等，画室应该给什么颜色的徽章？根据之前设定，画室是第四谜题？实际顺序可能不同，我们统一为：图书馆（蓝宝石）、钟楼（红宝石）、音乐室（翠绿）、画室（橙色）、温室（金色）、地下室（紫色）、卧室（彩虹）。所以画室应给橙色徽章。
暗格中有一枚橙色徽章，还有一块“共鸣水晶”（如果之前没有获得，这里可以获得；如果已经获得，可能是别的东西）。但根据之前的设定，音乐室需要机械齿轮，画室需要共鸣水晶，所以画室的奖励可以是徽章和“神秘颜料”（用于温室）。我们设定画室最终获得橙色徽章和神秘颜料。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_gem_wrong"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("镜子暂时无法使用")) {
            setFlag("镜子暂时无法使用", true);
            msg += `<div class="system-message">【状态】：镜子暂时无法使用</div>`;
        }
        return msg;
    },
    desc: `如果你按错了顺序，宝石会发出刺目的红光，镜子中投射出一束强光，照得你头晕目眩。你踉跄后退，暂时无法操作镜子。宝石需要一段时间才能重置。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_paint_mirror"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("橙色徽章（4/7）")) {
            gameState.items.push("橙色徽章（4/7）");
            gameState.medals.push("橙色徽章（4/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：橙色徽章（4/7）</div>`;
        }
        if(!hasItem("神秘颜料")) {
            gameState.items.push("神秘颜料");
            msg += `<div class="system-message">【获得物品】：神秘颜料</div>`;
        }
        return msg;
    },
    desc: `你拿起画笔，蘸取调色板上的颜料，在镜子中央的空白圆形区域作画。你需要画出什么？也许是色轮，也许是七色花，或者就是简单的七色圆点。根据线索，你画了一个色轮，七种颜色均匀分布。画完后，颜料渗入镜子，镜子表面泛起彩虹色光芒，然后分裂成七块碎片，每块碎片飞向一幅空白画框，瞬间填充了那幅画——空白画布上出现了栩栩如生的景物：赤色画中是一轮红日，橙色是秋叶，黄色是麦田，绿色是森林，青色是湖水，蓝色是海洋，紫色是晚霞。
七幅画完成后，房间中央的调色板缓缓下沉，取而代之升起一座石台，台上放着橙色徽章和神秘颜料。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_fixative"] = {
    desc: `如果你没有通过光线激活镜子，而是尝试用颜料直接作画，就需要定色剂。你在颜料柜中翻找，发现一瓶标签模糊的液体，写着“阿拉伯树胶”。这是古代画家常用的定色剂。你将树胶与颜料混合，然后在画布上作画，颜色终于固定。但你不知道应该画什么，需要从别处获得线索。
你想起肖像画中的镜子，也许应该在镜子上作画。你用混合了定色剂的颜料在镜子表面画出色轮，同样触发了徽章的出现。`,
    options: [
        { text: "在镜子上作画", target: "studio_paint_mirror_fix" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_pipe_source"] = {
    desc: `你顺着调色板底部的铜管找到墙壁上的接口，铜管穿过墙壁进入隔壁房间（可能是储藏室或水房）。你进入隔壁，发现一个小型工作间，里面有一个大型的颜料研磨机和一个水箱。研磨机由手摇曲柄驱动，可以将矿石研磨成粉末。水箱连接着管道，可以为调色板提供水源。你发现研磨机里还有残留的矿石粉末，也许你需要自己研磨七色矿石来制作颜料。`,
    options: [
        { text: "用研磨机研磨七色矿石", target: "studio_grind_stones" },
        { text: "检查水箱", target: "studio_water_tank" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_grind_stones"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("新鲜颜料（与光线激活效果相同）")) {
            gameState.items.push("新鲜颜料（与光线激活效果相同）");
            msg += `<div class="system-message">【获得物品】：新鲜颜料（与光线激活效果相同）</div>`;
        }
        return msg;
    },
    desc: `你将七色矿石分别放入研磨机，摇动曲柄，将它们磨成细粉。然后通过管道输送到调色板，再加水调和，就能得到新鲜颜料。这样就不需要依赖彩色玻璃窗的光线激活了。`,
    options: [
        { text: "用颜料在镜子上作画", target: "studio_paint_mirror" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_poison_pigment"] = {
    desc: `如果你误食或吸入某些有毒颜料（如辰砂、铅白），会中毒。在研磨时没有戴口罩，吸入粉尘，导致头晕呕吐。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_glass_shard"] = {
    desc: `彩色玻璃窗的玻璃松动，你不小心碰落一块，碎片划破动脉，失血过多。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_mirror_trap"] = {
    desc: `如果你在镜子前做出错误操作（比如用力敲击镜子），镜子碎裂，露出后面的机关，射出毒针。
（游戏结束）
- 如果你已经获得了“共鸣水晶”（音乐室），可以将它放在调色板中央的凹陷处，水晶会发出七色光，自动激活颜料槽，无需光线调节。
- 如果你已经获得了“神秘颜料”（本房间的奖励），可以带去温室使用。
- 如果你在钟楼获得了“齿轮钥匙”，可能可以打开颜料柜的某个隐藏抽屉。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（返回大厅，画室谜题完成）
以上扩展为画室之谜提供了丰富的分支、颜料制作、光影解谜、矿石排列等机制，总文本量约5000字。您可以根据需要调整分支深度和选项数量，确保与其他房间（如温室、音乐室）的线索联动自然。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-图书馆.txt 场景 ---
scenes["library_entry"] = {
    desc: `推开沉重的橡木门，你踏入了一个仿佛被时间遗忘的知识殿堂。高耸的书架直达穹顶，空气中弥漫着纸张腐朽的气味和淡淡的墨水香。月光透过彩色玻璃窗，在红木地板上投下迷离的光斑，那些光斑的形状随着云层的移动缓缓变换，仿佛某种活着的符文。
房间中央，一张巨大的书桌占据着核心位置，桌面上摊开着一本空白的书，书页边缘镶嵌着七种不同颜色的宝石凹槽。书桌的四个桌腿雕刻成狮鹫爪的形状，爪下踩着石球，石球可以转动。书架间的空隙里，隐约可见一些奇怪的工具——一架铜制星盘、一座布满灰尘的天球仪、以及几根用绳子悬挂的铅锤。
管家的话在你脑中回响：“谜题可能致命。”你需要决定如何开始探索。`,
    options: [
        { text: "仔细检查书桌上的空白书", target: "library_blank_book" },
        { text: "研究书桌的狮鹫爪桌腿", target: "library_desk_legs" },
        { text: "探索书架寻找可疑的书籍", target: "library_bookshelves" },
        { text: "检查星盘与天球仪", target: "library_astrolabe" },
        { text: "观察天花板上的彩色玻璃窗", target: "library_window" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_blank_book"] = {
    desc: `你俯身观察那本空白的书。书页厚实，纸质坚韧，当你将手指放在纸面上时，能感到细微的凸起——是盲文？不，更像是某种密码压印。你试着用指甲轻轻划过，凸起的痕迹在灯光下投下微小的阴影，排列似乎有规律。
书的封面是深棕色皮革，边缘烫金，封面上刻着一行拉丁文：“Scientia est Clavis”（知识即钥匙）。封底则刻着一幅简图：七颗星星排成北斗七星的形状，但其中一颗星被圈了出来，旁边写着一个数字“4”。
你注意到空白书的书脊处有一个小小的金属搭扣，可以打开，但搭扣需要正确的按压才能松开。`,
    options: [
        { text: "尝试按压封面上的星星图案", target: "library_press_star" },
        { text: "尝试解开金属搭扣", target: "library_unlock_clasp" },
        { text: "继续翻看其他书页", target: "library_other_pages" },
        { text: "暂时放下书，探索其他东西", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_press_star"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("七学者名单（部分）")) {
            gameState.clues.push("七学者名单（部分）");
            msg += `<div class="system-message">【获得线索】：七学者名单（部分）</div>`;
        }
        return msg;
    },
    desc: `你按照封底简图的提示，按压北斗七星中被圈出的第四颗星。一声轻微的咔哒，书脊处的金属搭扣自动弹开。你小心地翻开封面，发现扉页上夹着一张泛黄的纸条，上面用工整的手写体写着：
“寻找那本无字天书，
它的秘密藏在七位学者的记忆里。
按出生年份排序，
他们的名字会告诉你正确的顺序。”
纸条背面还列着七个名字，但部分被墨水污染，只能看清其中三个：
- 亚里士多德（公元前384年）
- 达·芬奇（1452年）
- 哥白尼（1473年）
另外四个名字模糊不清，但隐约能看出字迹的轮廓。你需要从书架上的书籍中找到完整的七位学者名单。`,
    options: [
        { text: "去书架寻找完整名单", target: "library_bookshelves" },
        { text: "继续研究书桌其他部分", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_unlock_clasp"] = {
    desc: `你尝试直接强行打开搭扣。金属搭扣纹丝不动，反而触发了书桌内部的一个机关。只听“嗖”的一声，书桌侧面弹出一支短箭，擦着你的手臂飞过，钉在身后的书架上。好在你反应快，没有受伤，但这次鲁莽的行为让你出了一身冷汗。`,
    options: [
        { text: "继续探索其他部分", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_other_pages"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("左手麻痹（会影响某些操作）")) {
            gameState.items.push("左手麻痹（会影响某些操作）");
            msg += `<div class="system-message">【获得物品】：左手麻痹（会影响某些操作）</div>`;
        }
        return msg;
    },
    desc: `你快速翻看空白书的其他页面，每一页都有不同的凸起图案，但看起来杂乱无章。当你翻到中间某页时，手指感到一阵刺痛——页面之间夹着一根极细的针。你猛地缩手，针上似乎涂有麻醉剂，你的手指开始发麻。幸好剂量不大，只是让你暂时无法灵活使用左手。`,
    options: [
        { text: "继续探索", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_desk_legs"] = {
    desc: `你蹲下身仔细观察四个桌腿。每个狮鹫爪下都踩着一个拳头大小的石球，石球可以转动。石球表面刻着不同的符号：第一个是太阳，第二个是月亮，第三个是星星，第四个是眼睛。你尝试转动石球，它们都能顺畅旋转，但每转一圈都会发出轻微的咔哒声，似乎内部有棘轮机构。
在书桌的底部，你发现了一行刻字：“凝视真理之眼，让日月星辰各归其位。”`,
    options: [
        { text: "尝试转动太阳石球", target: "library_turn_sun" },
        { text: "尝试转动月亮石球", target: "library_turn_moon" },
        { text: "尝试转动星星石球", target: "library_turn_star" },
        { text: "尝试转动眼睛石球", target: "library_turn_eye" },
        { text: "尝试按特定顺序转动所有石球", target: "library_combination" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_turn_sun"] = {
    desc: `你转动太阳石球，它发出沉闷的咔哒声，转了三圈后停止。书桌轻微震动，但没有任何明显变化。你注意到，每转动一次，书桌上的空白书似乎有微光闪烁。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_turn_moon"] = {
    desc: `转动月亮石球，它转了两圈半后卡住，无法再转动。书桌发出一声低鸣，抽屉方向传来轻微响声。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_turn_star"] = {
    desc: `星星石球可以无限制转动，但每转一圈，天花板上的彩色玻璃窗似乎改变颜色。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_turn_eye"] = {
    desc: `眼睛石球转动时，你会听到一种类似心跳的咚咚声，从书架深处传来。
（这些单独转动都不会直接解谜，但会给予提示或改变环境状态。为简化分支，可以设计成需要组合顺序。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_combination"] = {
    desc: `你决定尝试按某种顺序转动四个石球。你回忆起封底简图中的数字“4”，以及“知识即钥匙”的提示。或许顺序与七学者名单有关？但你目前只知道三个名字。
你可以先尝试盲猜，但失败可能触发陷阱。`,
    options: [
        { text: "尝试“太阳→月亮→星星→眼睛”的顺序", target: "library_combo_fail" },
        { text: "尝试“眼睛→太阳→月亮→星星”的顺序", target: "library_combo_fail" },
        { text: "先寻找更多线索", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_combo_fail"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("石球锁定（需要其他线索才能重置）")) {
            setFlag("石球锁定（需要其他线索才能重置）", true);
            msg += `<div class="system-message">【状态】：石球锁定（需要其他线索才能重置）</div>`;
        }
        return msg;
    },
    desc: `当你按照选择的顺序转动石球后，书桌发出一声刺耳的金属摩擦声，四个狮鹫爪突然收紧，石球被牢牢锁死。一股黑烟从书桌缝隙中冒出，熏得你直咳嗽。虽然没有受伤，但石球暂时无法再转动，你必须找到解除锁定的方法。`,
    options: [
        { text: "继续探索", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_bookshelves"] = {
    desc: `图书馆的书架如同迷宫，每一排都有数米高。你发现有些书脊上没有任何文字，只有烫金的符号；有些书则标有学者的名字。你决定：`,
    options: [
        { text: "寻找与七学者有关的书籍", target: "library_scholar_books" },
        { text: "注意那些书脊突出的书籍", target: "library_protruding_books" },
        { text: "检查书架之间的空隙", target: "library_gaps" },
        { text: "阅读书架侧面的分类标签", target: "library_labels" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_scholar_books"] = {
    desc: `你在书架间穿梭，很快找到了几本传记和著作：
- 《亚里士多德全集》
- 《达·芬奇笔记》
- 《天体运行论》（哥白尼）
- 还有一本《自然哲学的数学原理》（牛顿），但封面上有血迹？
- 一本《几何原本》（欧几里得）
- 一本《梦的解析》（弗洛伊德），但书页被撕掉了一半
- 一本《时间简史》（霍金），却是全新的
你注意到这些书的排列顺序似乎是随机的。你尝试按照封底纸条的提示“按出生年份排序”，但你需要知道所有七位学者的生卒年。`,
    options: [
        { text: "仔细翻阅每本书，寻找年份信息", target: "library_find_years" },
        { text: "根据已知年份，尝试排序", target: "library_sort_attempt" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_find_years"] = {
    desc: `你快速翻阅这些书，在扉页或前言中找到了年份：
- 亚里士多德：前384年
- 欧几里得：约前325年
- 哥白尼：1473年
- 达·芬奇：1452年
- 牛顿：1643年
- 弗洛伊德：1856年
- 霍金：1942年
但你还发现了一个异常：这些书并非全部是原著，有些是后人编纂的，其中《梦的解析》的书页中夹着一张小纸条，写着：“顺序即为答案，但小心不要唤醒不该唤醒的东西。”
获得完整七学者名单及年份`,
    options: [
        { text: "按年份排序", target: "library_scholar_order" },
        { text: "注意纸条的警告，再检查一下书籍", target: "library_check_books" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_check_books"] = {
    desc: `你仔细检查每本书，发现《梦的解析》的书页被撕掉的部分似乎是被刻意移除的，留下的半页上有字：“第五位……镜子中的……”另外，《几何原本》的书脊处有轻微凸起，你摸到了一个隐藏的开关。按下后，书架后传来一声轻响。`,
    options: [
        { text: "查看书架后的隐藏空间", target: "library_hidden_niche" },
        { text: "先排序书籍", target: "library_scholar_order" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_hidden_niche"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("星盘钥匙")) {
            gameState.items.push("星盘钥匙");
            msg += `<div class="system-message">【获得物品】：星盘钥匙</div>`;
        }
        return msg;
    },
    desc: `你移开《几何原本》，书架背面露出一个巴掌大的暗格，里面放着一个铜质小圆盘，上面刻着七颗星星和七条弧线，与火漆徽记相同。圆盘中央有一个可以旋转的指针。背面刻着：“将此盘置于书桌凹槽，可显真章。”`,
    options: [
        { text: "返回书桌，将圆盘放入空白书的凹槽", target: "library_use_disk" },
        { text: "继续探索书架", target: "library_bookshelves" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_use_disk"] = {
    desc: `你将铜质圆盘放入空白书的七宝石凹槽中，圆盘与凹槽完美契合。你旋转指针，按照七学者的年份顺序，将指针依次指向对应的星星图案（每个学者对应一颗星）。每指对一位，一枚宝石凹槽就会亮起。全部七位点亮后，空白书的书页上浮现出文字：
“拉出象征智慧的书脊，
但勿触及其他，
否则你将面对时间的审判。”
获得完整线索：拉动哪本书`,
    options: [
        { text: "去书架拉动智慧之书", target: "library_pull_wisdom" },
        { text: "先解除石球锁定（若锁定）", target: "library_unlock_stones" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_pull_wisdom"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("蓝宝石徽章（1/7）")) {
            gameState.items.push("蓝宝石徽章（1/7）");
            gameState.medals.push("蓝宝石徽章（1/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：蓝宝石徽章（1/7）</div>`;
        }
        if(!hasItem("克劳利的日记")) {
            gameState.items.push("克劳利的日记");
            msg += `<div class="system-message">【获得物品】：克劳利的日记</div>`;
        }
        return msg;
    },
    desc: `你现在知道要拉动那本无书名、只有烫金问号的书（即智慧之书）。你走到书架前，毫不犹豫地拉动它。随着一声清脆的机械声，书桌缓缓打开，露出一枚蓝宝石徽章，以及一本皮质封面的日记。
（日记内容：记述了庄园的秘密，特别提到钟楼谜题的关键是“将时间调至月升之时，听指针的低语”。）`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_protruding_books"] = {
    desc: `你注意到有几本书的书脊比其他书突出一些，似乎是被故意放置的。这些书分别是：
- 《密码学简史》（书脊有锁形图案）
- 《七重天文学》（书脊有星形图案）
- 《无字天书》（只有烫金问号，无书名）
- 《时间之书》（书脊有沙漏图案）`,
    options: [
        { text: "拉动《密码学简史》", target: "library_trap_needle" },
        { text: "拉动《七重天文学》", target: "library_trap_poison" },
        { text: "拉动《无字天书》", target: "library_hidden_passage" },
        { text: "拉动《时间之书》", target: "library_trap_clock" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_trap_needle"] = {
    desc: `当你拉动《密码学简史》时，书架后弹出一排细针，你勉强侧身避开，但手臂被划伤，毒素让你眩晕。你退出图书馆，需要休息。
（状态：中毒，暂时无法再次尝试）`,
    options: [
        { text: "返回大厅", target: "hall_injured" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_trap_poison"] = {
    desc: `拉动《七重天文学》，一股绿色气体喷出，你捂住口鼻，但仍吸入少许，视线模糊。你踉跄逃出图书馆，在门口昏倒。醒来时发现自己在大厅，管家递给你一杯解药，并警告你“不要鲁莽”。
（状态：虚弱，但未死）`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_trap_clock"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("图书馆布局改变（某些区域暂时无法进入）")) {
            setFlag("图书馆布局改变（某些区域暂时无法进入）", true);
            msg += `<div class="system-message">【状态】：图书馆布局改变（某些区域暂时无法进入）</div>`;
        }
        return msg;
    },
    desc: `拉动《时间之书》，书架后传来巨大的齿轮声，整个书架开始移动，你差点被夹在缝隙中。你迅速翻滚逃脱，但书架位置改变，图书馆内部结构似乎发生了变化。你失去了方向感，不得不退回大厅。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_hidden_passage"] = {
    desc: `当你拉动《无字天书》时，书架无声地滑开，露出一条狭窄的通道。通道尽头是一间密室，里面放着一个精致的匣子。你打开匣子，里面是一枚银色的徽章，背面刻着：“第一道谜题——智慧之证。”
但奇怪的是，你并没有真正解开书桌的谜题。管家奥尔德斯的声音从通道外传来：“取巧者将受诅咒。” 话音刚落，徽章在你手中变得滚烫，你不得不丢下它，通道也重新关闭。你被弹回图书馆，一无所获。
（未获得徽章，但发现了隐藏通道）`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_astrolabe"] = {
    desc: `星盘和天球仪放置在书架旁的一张高脚桌上。星盘由多层圆盘组成，可以旋转；天球仪上标注着星座和行星轨道。星盘的边缘刻着一圈铭文：“当七曜归位，真理之门将敞开。” 天球仪的底座上有一行字：“黄道十二宫，唯缺一宫。”
你仔细观察，发现天球仪上的黄道十二宫符号中，天蝎座的符号被磨掉了，取而代之的是一小块空白区域，似乎可以镶嵌什么东西。星盘的指针可以转动，但需要特定的时间与星位数据。`,
    options: [
        { text: "尝试调整星盘至当前时间", target: "library_astrolabe_fail" },
        { text: "检查天球仪的空白区域", target: "library_globe_gap" },
        { text: "使用星盘钥匙（若有）", target: "library_astrolabe_success", condition: () => hasItem("生命之露") },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_astrolabe_fail"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("星盘损坏（需修复）")) {
            setFlag("星盘损坏（需修复）", true);
            msg += `<div class="system-message">【状态】：星盘损坏（需修复）</div>`;
        }
        return msg;
    },
    desc: `你随意调整星盘，试图让它对应现在的星空，但星盘毫无反应。当你转动过度时，星盘内部突然发出一声脆响，指针卡死，你无法再操作它。`,
    options: [
        { text: "继续探索", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_globe_gap"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("星盘刻度（可用于校准）")) {
            gameState.clues.push("星盘刻度（可用于校准）");
            msg += `<div class="system-message">【获得线索】：星盘刻度（可用于校准）</div>`;
        }
        return msg;
    },
    desc: `你注意到天球仪上天蝎座的位置确实有一个小凹槽，形状与你之前发现的铜质圆盘（星盘钥匙）相似？实际上，那个圆盘是用于空白书的。但这里是否也有类似的设计？你仔细搜索，在天球仪的底部发现一个抽屉，里面有一块天蝎座的小金属片，可以嵌入空白处。你嵌入后，天球仪开始缓慢自转，最终停止时，一根指针指向了星盘上的某个刻度。你记下这个刻度。`,
    options: [
        { text: "尝试用此刻度调整星盘", target: "library_astrolabe_calibrate" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_astrolabe_calibrate"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("银质徽章（非七枚之一")) {
            gameState.items.push("银质徽章（非七枚之一");
            gameState.medals.push("银质徽章（非七枚之一");
            addMedal();
            gameState.items.push("但可能有用）");
            msg += `<div class="system-message">【获得物品】：银质徽章（非七枚之一，但可能有用）</div>`;
        }
        return msg;
    },
    desc: `你将星盘调整到对应刻度，星盘中央升起一个小台座，上面放着一枚银质徽章，但这次徽章上没有诅咒，因为你是通过正确途径获得的。但等等，这是否意味着你提前获得了徽章？实际上，图书馆的徽章应该是蓝宝石徽章，这枚银质徽章可能是另一个谜题的钥匙。`,
    options: [
        { text: "继续探索图书馆", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_window"] = {
    desc: `彩色玻璃窗在图书馆北墙，由七块不同颜色的玻璃拼成：红、橙、黄、绿、蓝、靛、紫。月光透过时，在地板上投下七色光斑。你发现光斑的位置随着时间移动，而且似乎与书架上的某些书籍位置有对应关系。当光斑落在某本书上时，那本书的书脊会微微发光。`,
    options: [
        { text: "等待光斑移动，记录对应的书", target: "library_light_tracking" },
        { text: "尝试移动窗户上的玻璃", target: "library_window_move" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_light_tracking"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("颜色数字对应关系")) {
            gameState.clues.push("颜色数字对应关系");
            msg += `<div class="system-message">【获得线索】：颜色数字对应关系</div>`;
        }
        return msg;
    },
    desc: `你耐心观察光斑的移动。当红色光斑落在一本《红字》上时，书脊发光；橙色光斑落在《柑橘与柠檬啊》上；黄色落在《黄衣王》上；绿色落在《绿野仙踪》上；蓝色落在《蓝宝石》上；靛色落在一本没有标题的靛蓝色书上；紫色落在《紫罗兰》上。你发现这些书恰好对应七种颜色，而且它们的书脊上都标有一个数字：红-1，橙-2，黄-3，绿-4，蓝-5，靛-6，紫-7。`,
    options: [
        { text: "尝试按数字顺序拉动书脊", target: "library_color_pull" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_color_pull"] = {
    desc: `你按照数字顺序拉动书脊，每拉一下，对应颜色的玻璃窗就会变亮。当七本书都被拉动后，彩色玻璃窗突然全部亮起，投射出一道光束，照在书桌的空白书上。空白书自动翻开，显示出完整的解谜指示（即前面通过学者名单获得的提示）。但如果你还没有获得学者名单，这里会给出一个不同的解谜路径。`,
    options: [
        { text: "阅读书页上的指示", target: "library_blank_book_reveal" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_blank_book_reveal"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("蓝宝石徽章（1/7）")) {
            gameState.items.push("蓝宝石徽章（1/7）");
            gameState.medals.push("蓝宝石徽章（1/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：蓝宝石徽章（1/7）</div>`;
        }
        if(!hasItem("克劳利的日记")) {
            gameState.items.push("克劳利的日记");
            msg += `<div class="system-message">【获得物品】：克劳利的日记</div>`;
        }
        return msg;
    },
    desc: `书页上显示：“欲得智慧之证，需将七色归位。按颜色顺序拉动书脊，书桌将开启。” 你照做后，书桌打开，获得蓝宝石徽章和日记。但注意，如果你之前已经通过学者路径获得了徽章，这里可能重复或触发其他机关。为避免矛盾，可以设计为两种路径最终都导向获得徽章，但细节不同。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_unlock_stones"] = {
    desc: `如果你之前错误操作导致石球锁定，需要找到重置方法。你可以在书架中寻找一本《机关术入门》，里面提到：“狮鹫爪石球的锁定可由‘时间的逆流’解除，即按相反顺序拉动对应书脊。” 你需要找到正确的书脊顺序。或者，你可以通过彩色玻璃窗的线索找到重置顺序。`,
    options: [
        { text: "按相反顺序拉动彩色书脊", target: "library_reset_success" },
        { text: "尝试其他方法", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_reset_success"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("石球解锁")) {
            setFlag("石球解锁", true);
            msg += `<div class="system-message">【状态】：石球解锁</div>`;
        }
        return msg;
    },
    desc: `你按照颜色数字相反顺序拉动书脊（7-6-5-4-3-2-1），四个石球同时发出一声闷响，重新可以转动。`,
    options: [
        { text: "继续解谜", target: "library_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_death_needle"] = {
    desc: `若在拉动《密码学简史》时未能避开毒针，毒针射中颈部，你当场死亡。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_death_poison"] = {
    desc: `吸入大量毒气，未能及时逃出，死在书架间。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_death_crush"] = {
    desc: `拉动《时间之书》时被移动的书架夹住，窒息而亡。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（大厅场景，承接获得第一枚徽章后的状态。此处可简单描述，或与序章大厅合并。但作为模块，可以在此结束并返回主大厅。）
以上扩展为图书馆之谜提供了丰富的分支、多种解谜路径、线索收集、陷阱和死亡结局，总文本量约5000字。您可以根据实际需要调整分支深度和选项数量，确保与主线的衔接自然。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-温室.txt 场景 ---
scenes["greenhouse_entry"] = {
    desc: `温室位于庄园西侧，是一座巨大的玻璃穹顶建筑，与主建筑通过一条鹅卵石小径相连。推开生锈的铁门，一股潮湿腐朽的气息扑面而来。玻璃穹顶上爬满了枯死的藤蔓，破碎的玻璃缺口处漏下几束惨白的月光。
内部是一个热带花园的废墟。曾经繁茂的植物如今只剩下枯黄的骨架：棕榈树的叶片卷曲发脆，蕨类植物的孢子囊干瘪开裂，藤蔓从穹顶垂落，像绞刑架的绳索。空气中弥漫着一股腐烂的甜腻，混合着泥土和霉菌的气味。
房间中央有一棵巨大的古树，树干粗壮如石柱，树冠几乎触及穹顶。古树已经完全枯死，树皮剥落，露出灰白的木质。树干上刻着一行古老的文字：“生命之水，需以七色之血唤醒。”树干底部有一个石盆，盆中盛着浑浊的液体，水面漂浮着枯叶和霉菌。
古树周围环绕着七个花坛，呈半圆形排列，每个花坛边缘镶嵌着不同颜色的瓷砖：赤、橙、黄、绿、青、蓝、紫。花坛内全是干裂的泥土，没有一丝绿意。花坛外侧立着七根石柱，每根石柱顶端刻着一种元素的符号：火、水、土、气、光、暗、生命。
温室东侧有一间工具房，半掩的木门后面隐约可见锄头、水壶和花剪。西侧有一个小型苗圃，搭着遮阳棚，棚下摆着几十个育苗盆，但全部干枯。南墙有一口水井，井口被石板盖住，旁边有一个生锈的轱辘。北墙是一面巨大的水培墙，层层叠叠的管道如今空无一物。`,
    options: [
        { text: "检查中央古树和石盆", target: "greenhouse_tree" },
        { text: "探索七个花坛", target: "greenhouse_flower_beds" },
        { text: "进入工具房", target: "greenhouse_tool_shed" },
        { text: "检查苗圃", target: "greenhouse_nursery" },
        { text: "查看水井", target: "greenhouse_well" },
        { text: "研究水培墙", target: "greenhouse_hydroponic" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_tree"] = {
    desc: `古树粗壮的树干需要两人才能合抱。树皮上刻着的文字“生命之水，需以七色之血唤醒”旁边，还有一个更小的铭文，被苔藓覆盖。你刮掉苔藓，看到：“七色者，赤橙黄绿青蓝紫。七血者，根茎叶花果种苗。” 树干底部有一个碗口大的树洞，向内窥视，里面漆黑一片，隐约可见一些细小的根须。
石盆直径约半米，盆沿雕刻着波浪纹。盆中的液体呈灰绿色，散发着刺鼻的气味。你用小棍搅动，发现底部有一层厚厚的淤泥。淤泥中似乎埋着什么东西。如果你有工具，可以捞出来看看。`,
    options: [
        { text: "伸手入盆捞取", target: "greenhouse_pond_dip" },
        { text: "用工具捞取（需要从工具房找工具）", target: "greenhouse_pond_tool", condition: () => hasItem("从工具房找工具") },
        { text: "检查树洞", target: "greenhouse_tree_hole" },
        { text: "研究树干上的铭文", target: "greenhouse_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_pond_dip"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("中毒（轻微，影响部分操作）")) {
            setFlag("中毒（轻微，影响部分操作）", true);
            msg += `<div class="system-message">【状态】：中毒（轻微，影响部分操作）</div>`;
        }
        if(!hasClue("石盆中有危险生物，需要用工具取物")) {
            gameState.clues.push("石盆中有危险生物，需要用工具取物");
            msg += `<div class="system-message">【获得线索】：石盆中有危险生物，需要用工具取物</div>`;
        }
        return msg;
    },
    desc: `你将手伸入盆中，淤泥冰凉滑腻。你摸到一个硬物，正要取出，手指突然被什么东西刺了一下。你猛地抽手，发现指尖有一个细小的伤口，渗出黑色的血珠。淤泥中有什么活物！你的手开始发麻，视野模糊。你踉跄后退，靠在古树上，过了好一会儿才恢复。手臂依然有些僵硬。`,
    options: [
        { text: "寻找工具", target: "greenhouse_tool_shed" },
        { text: "放弃，探索其他地方", target: "greenhouse_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_pond_tool"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("七色花琥珀")) {
            gameState.items.push("七色花琥珀");
            msg += `<div class="system-message">【获得物品】：七色花琥珀</div>`;
        }
        if(!hasClue("需要七种植物部位（根、茎、叶、花、果、种、苗）来激活七色花种")) {
            gameState.clues.push("需要七种植物部位（根、茎、叶、花、果、种、苗）来激活七色花种");
            msg += `<div class="system-message">【获得线索】：需要七种植物部位（根、茎、叶、花、果、种、苗）来激活七色花种</div>`;
        }
        return msg;
    },
    desc: `你用长柄夹深入石盆，夹出一个巴掌大的铜盒。盒子锈迹斑斑，但锁扣完好。打开后，里面是一块琥珀，琥珀中封存着一朵七色花的花瓣——七片花瓣，每片颜色不同。琥珀背面刻着：“七色花种，唯此一株。以七血滋养，可复生机。”`,
    options: [
        { text: "检查七个花坛", target: "greenhouse_flower_beds" },
        { text: "检查苗圃", target: "greenhouse_nursery" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_tree_hole"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("古树血粉（七血之一：木血）")) {
            gameState.items.push("古树血粉（七血之一：木血）");
            msg += `<div class="system-message">【获得物品】：古树血粉（七血之一：木血）</div>`;
        }
        return msg;
    },
    desc: `你把手伸进树洞，指尖触到一些干燥的粉末。你刮出一些，发现是木屑和一种暗红色的粉末。粉末闻起来有血腥味。你突然意识到，这可能是古树自身的“血液”——树液干涸后的残留。树干上的铭文说需要“七血”，也许其中一种就是古树的“血”（树液）。你用小瓶收集了一些粉末。`,
    options: [
        { text: "继续探索", target: "greenhouse_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_flower_beds"] = {
    desc: `七个花坛呈半圆形环绕古树，每个花坛的瓷砖颜色对应一种颜色：赤、橙、黄、绿、青、蓝、紫。花坛内的泥土完全干裂，但深度不同。你蹲下观察，发现每个花坛底部都有一个排水孔，连接到地下的管道系统。
花坛外侧的石柱顶端，元素符号旁边还有小字：
- 火柱旁：“赤花需火，以热催芽”
- 水柱旁：“橙花需水，以润养根”
- 土柱旁：“黄花需土，以肥培茎”
- 气柱旁：“绿花需气，以风传粉”
- 光柱旁：“青花需光，以明展叶”
- 暗柱旁：“蓝花需暗，以静结果”
- 生命柱旁：“紫花需命，以血凝种”
这似乎说明，要培育七色花，需要为每个花坛提供不同的生长条件。如果你有七色花琥珀中的种子，就可以开始培育。`,
    options: [
        { text: "将七色花琥珀放在古树下", target: "greenhouse_plant_seeds" },
        { text: "研究如何提供七种条件", target: "greenhouse_conditions" },
        { text: "检查花坛底部的管道", target: "greenhouse_pipes" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_plant_seeds"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要为每个花坛提供对应的元素条件")) {
            gameState.clues.push("需要为每个花坛提供对应的元素条件");
            msg += `<div class="system-message">【获得线索】：需要为每个花坛提供对应的元素条件</div>`;
        }
        return msg;
    },
    desc: `你将琥珀放在古树下的石台上。琥珀中的七色花微微发光，随即碎裂，七颗颜色各异的种子滚落出来，分别滚向对应颜色的花坛，自行埋入土中。每个花坛的泥土表面浮现出对应颜色的微光，但很快暗淡下去——种子需要特定的生长条件才能发芽。`,
    options: [
        { text: "去工具房寻找提供条件的方法", target: "greenhouse_tool_shed" },
        { text: "研究水井和水培系统", target: "greenhouse_well" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_tool_shed"] = {
    desc: `工具房是一个狭窄的木屋，墙壁上挂着各种园艺工具：锄头、铲子、修枝剪、喷壶、长柄夹（如果你还没拿）、温度计、湿度计。工作台上有一本《温室养护手册》和一个木箱。木箱上锁，锁是三位数字密码。`,
    options: [
        { text: "阅读《温室养护手册》", target: "greenhouse_manual" },
        { text: "尝试打开木箱", target: "greenhouse_wooden_box" },
        { text: "取走需要的工具（长柄夹、喷壶等）", target: "greenhouse_take_tools" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_manual"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("七血配方、灌溉系统、温度控制、风力控制")) {
            gameState.clues.push("七血配方、灌溉系统、温度控制、风力控制");
            msg += `<div class="system-message">【获得线索】：七血配方、灌溉系统、温度控制、风力控制</div>`;
        }
        return msg;
    },
    desc: `手册是一本手写笔记，记录着温室的设计和维护方法。你快速翻阅，找到几页关键内容：
“第七页：温室的灌溉系统连接水井，通过管道输送到花坛和水培墙。水井的水源来自地下水，但水质偏碱性，需要加入酸性物质中和。配方：一桶水加三勺明矾。”
“第十五页：古树的枯死是因为土壤中的生命元素耗尽。七色花种需要七种‘血’来补充生命元素：根血（任何植物的根）、茎血（任何植物的茎）、叶血（绿叶）、花血（花瓣）、果血（果实）、种血（种子）、苗血（幼苗）。将七血混合成溶液，浇灌古树，可使其复苏。”
“第二十三页：温室的温度控制系统已损坏。若要提供‘火’元素条件，需要点燃壁炉（工具房北墙有一个小壁炉），调节风门控制温度。”
“第三十一页：水培墙的风扇可以产生气流，提供‘气’元素条件。风扇需要电力，发电机在苗圃后面的小屋里。”`,
    options: [
        { text: "收集七种植物部位", target: "greenhouse_collect_plant_parts" },
        { text: "去水井调节水质", target: "greenhouse_well" },
        { text: "点燃壁炉", target: "greenhouse_fireplace" },
        { text: "启动水培墙风扇", target: "greenhouse_fan" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_wooden_box"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("七色花肥料")) {
            gameState.items.push("七色花肥料");
            gameState.items.push("生长激素");
            gameState.items.push("园艺剪");
            gameState.items.push("管道地图");
            msg += `<div class="system-message">【获得物品】：七色花肥料、生长激素、园艺剪、管道地图</div>`;
        }
        return msg;
    },
    desc: `木箱的密码锁是三位数字。你在手册里找到线索：“温室建成的年份是三组数字，记录在第二页。” 你翻到第二页，上面写着“温室建于1887年春”。密码是188？或者是“188”的某种变换？你尝试输入188，锁开了。
箱子里有：一包七色花肥料（七种颜色的小颗粒）、一瓶植物生长激素、一把园艺剪、一张温室管道地图。`,
    options: [
        { text: "使用肥料帮助花坛生长", target: "greenhouse_use_fertilizer" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_take_tools"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("长柄夹")) {
            gameState.items.push("长柄夹");
            gameState.items.push("喷壶");
            gameState.items.push("温度计");
            gameState.items.push("湿度计");
            msg += `<div class="system-message">【获得物品】：长柄夹、喷壶、温度计、湿度计</div>`;
        }
        return msg;
    },
    desc: `你从墙上取走长柄夹（可用于石盆取物）、喷壶、温度计、湿度计。`,
    options: [
        { text: "继续探索", target: "greenhouse_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_collect_plant_parts"] = {
    desc: `根据手册，你需要收集七种植物部位：根、茎、叶、花、果、种、苗。温室虽然枯死，但仍有残留：
- 根：在苗圃里拔出一棵枯死的幼苗，根部尚存（获得：枯根）
- 茎：从枯死的藤蔓上剪下一段茎（获得：枯茎）
- 叶：从棕榈树上摘下一片枯叶（获得：枯叶）
- 花：在花坛里找到一朵干枯的花苞（获得：枯花）
- 果：古树上有几个干瘪的果实，用园艺剪取下（获得：枯果）
- 种：在苗圃的育苗盆里找到几粒干瘪的种子（获得：枯种）
- 苗：工具房角落有一盆枯死的幼苗（获得：枯苗）
这些全是枯死的，但手册说需要“血”——也许通过某种方式可以提取它们的生命精华？你想起地下室可能有炼金设备，或者可以用生长激素复活它们。`,
    options: [
        { text: "用生长激素复活植物部位", target: "greenhouse_revive_parts" },
        { text: "去地下室用炼金术提取精华", target: "basement_extract_essence" },
        { text: "直接混合枯物尝试", target: "greenhouse_mix_dead" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_revive_parts"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("七血（七个小瓶）")) {
            gameState.items.push("七血（七个小瓶）");
            msg += `<div class="system-message">【获得物品】：七血（七个小瓶）</div>`;
        }
        return msg;
    },
    desc: `你将生长激素滴在每样枯物上。奇迹发生了：枯根重新变得饱满，枯茎泛出绿色，枯叶舒展，枯花绽放（虽然只有一瞬），枯果变得饱满，枯种裂开露出胚芽，枯苗挺直了腰。虽然它们很快又枯萎，但在短暂的“复活”过程中，你收集到了它们滴落的汁液——七种颜色的“血”。`,
    options: [
        { text: "将七血混合成溶液", target: "greenhouse_mix_blood" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_mix_blood"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("古树复苏（七色花生长条件之一：生命元素充足）")) {
            gameState.items.push("古树复苏（七色花生长条件之一：生命元素充足）");
            msg += `<div class="system-message">【获得物品】：古树复苏（七色花生长条件之一：生命元素充足）</div>`;
        }
        return msg;
    },
    desc: `你将七瓶血液倒入石盆（先清理掉原来的脏水）。溶液在盆中旋转，逐渐变成透明的液体，散发出清新的草木香气。古树的树根开始微微颤动，树干上的铭文发出绿光。你将溶液浇在古树根部，古树以肉眼可见的速度复苏：树皮重新变得湿润，枝头冒出嫩芽，枯叶脱落，新叶展开。古树活了！
古树复苏后，树冠中垂下七根藤蔓，每根藤蔓的末端有一朵发光的花苞，分别对应七种颜色。花苞朝向七个花坛，似乎要将花粉传递给七色花种子。`,
    options: [
        { text: "检查花坛中的种子是否发芽", target: "greenhouse_check_seeds" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_conditions"] = {
    desc: `种子已经埋入花坛，古树也复苏了，但还需要为每个花坛提供对应的元素条件。根据石柱上的提示：
- 赤花（火）：需要热量。工具房北墙有一个壁炉，点燃后可以调节温度。将壁炉的火力调到“高”，热量会通过地下管道传递到赤花坛。
- 橙花（水）：需要水分。水井的水通过管道输送到花坛，但水质需要中和。用明矾处理水后，开启橙花坛的阀门。
- 黄花（土）：需要肥沃的土壤。将七色花肥料施入黄花坛。
- 绿花（气）：需要气流。启动水培墙的风扇，调节风向吹向绿花坛。
- 青花（光）：需要光照。温室穹顶有遮光帘，用工具房的摇杆拉开，让月光照在青花坛上。如果是白天，阳光也可。
- 蓝花（暗）：需要黑暗。将遮光帘拉上，覆盖蓝花坛区域。
- 紫花（生命）：需要生命能量。古树复苏后，其根系与紫花坛相连，自动提供。`,
    options: [
        { text: "点燃壁炉", target: "greenhouse_fireplace" },
        { text: "处理水井水质", target: "greenhouse_well" },
        { text: "施肥", target: "greenhouse_fertilize" },
        { text: "启动风扇", target: "greenhouse_fan" },
        { text: "调节遮光帘", target: "greenhouse_shades" },
        { text: "检查所有条件是否就绪", target: "greenhouse_check_conditions" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_fireplace"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("火条件满足")) {
            setFlag("火条件满足", true);
            msg += `<div class="system-message">【状态】：火条件满足</div>`;
        }
        return msg;
    },
    desc: `工具房北墙的壁炉里堆着干柴。你点燃火柴，火焰升起。壁炉上方有一个风门，可以调节火力大小。你将风门开到最大，热量通过墙壁内的管道传向温室。赤花坛的泥土开始微微发热。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_well"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("水条件满足")) {
            setFlag("水条件满足", true);
            msg += `<div class="system-message">【状态】：水条件满足</div>`;
        }
        return msg;
    },
    desc: `水井的井口被石板盖住。你掀开石板，用轱辘放下水桶，打上一桶水。水有些浑浊，你按照手册的配方，加入三勺明矾（工具房有），搅拌后静置，水变清澈。然后你找到水井旁的分水阀，将处理过的水引入橙花坛的管道，开启阀门。水流入花坛，湿润了泥土。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_fertilize"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("土条件满足")) {
            setFlag("土条件满足", true);
            msg += `<div class="system-message">【状态】：土条件满足</div>`;
        }
        return msg;
    },
    desc: `你将七色花肥料均匀撒在黄花坛的土壤表面，用锄头轻轻翻入土中。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_fan"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("气条件满足")) {
            setFlag("气条件满足", true);
            msg += `<div class="system-message">【状态】：气条件满足</div>`;
        }
        return msg;
    },
    desc: `水培墙后面有一个大型风扇，但需要电力。你找到苗圃后面的小发电机，发现它是一台手摇发电机。你摇动把手，发电机嗡嗡作响，风扇开始旋转。你将风扇的出风口对准绿花坛方向。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_shades"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("光条件满足、暗条件满足")) {
            setFlag("光条件满足、暗条件满足", true);
            msg += `<div class="system-message">【状态】：光条件满足、暗条件满足</div>`;
        }
        return msg;
    },
    desc: `温室穹顶有电动遮光帘，但电力不足。你用手动摇杆（在工具房外墙上）操作。摇动后，遮光帘缓缓移动。你将青花坛上方的遮光帘完全打开，让月光照射；将蓝花坛上方的遮光帘完全关闭，制造黑暗。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_check_conditions"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("金色徽章（5/7）")) {
            gameState.items.push("金色徽章（5/7）");
            gameState.medals.push("金色徽章（5/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：金色徽章（5/7）</div>`;
        }
        if(!hasItem("生命之露")) {
            gameState.items.push("生命之露");
            msg += `<div class="system-message">【获得物品】：生命之露</div>`;
        }
        return msg;
    },
    desc: `你检查所有七个花坛：
- 赤花坛：土壤温热 ✓
- 橙花坛：土壤湿润 ✓
- 黄花坛：土壤肥沃（有肥料）✓
- 绿花坛：有气流吹拂 ✓
- 青花坛：有光照 ✓
- 蓝花坛：完全黑暗 ✓
- 紫花坛：古树根系连接 ✓
所有条件满足！七色花的种子同时破土而出，嫩芽迅速生长，抽枝展叶，形成七株不同颜色的花苗。花苗继续生长，直到齐腰高，然后绽放出七朵硕大的花朵，每朵花只有一片花瓣，颜色分别是赤、橙、黄、绿、青、蓝、紫。
七朵花同时释放花粉，花粉在空中汇聚，形成一道彩虹，落入古树的树冠。古树颤抖着，树干中央裂开一道缝隙，从中滚出一枚金色的徽章和一小瓶“生命之露”。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_hydroponic"] = {
    desc: `如果你不想通过培育七色花来解谜，也可以尝试修复水培墙。水培墙是一面多层管道结构，原本用于无土栽培。管道中有残留的营养液结晶，水泵已经停止工作。如果你能修复水培系统，种植出七种颜色的水培植物，也可以获得类似的奖励。
这需要你：
1. 清理管道中的结晶（用工具房的长柄刷）
2. 配制营养液（根据手册配方：水、明矾、硝石、磷粉）
3. 修复水泵（需要替换一个零件，可能在木箱里）
4. 种植七种颜色的植物种子（种子可能在苗圃找到）
这条路径更复杂，但提供另一种解谜方式。由于篇幅，简要列出关键步骤。`,
    options: [
        { text: "清理管道", target: "greenhouse_clean_pipes" },
        { text: "配制营养液", target: "greenhouse_mix_nutrient" },
        { text: "修复水泵", target: "greenhouse_fix_pump" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_poison_spore"] = {
    desc: `如果你在古树复苏过程中使用了错误的溶液（比如直接混合枯物），古树会释放有毒孢子。你吸入后肺部灼烧，倒在花坛间。当你醒来，发现自己躺在庄园外，管家说：“你差点死在里面。古树的愤怒不是凡人能承受的。”
（游戏结束或返回大厅，温室暂时无法进入）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_collapse"] = {
    desc: `如果你同时开启所有花坛的条件但顺序错误（例如先开火再开水导致蒸汽爆炸），温室管道会爆裂，高温蒸汽喷出，你被严重烫伤。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_fan_accident"] = {
    desc: `如果你在风扇运转时将手伸入，手指会被叶片切断。失血过多，昏迷。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（返回大厅，温室谜题完成）
以上扩展为温室之谜提供了丰富的分支、植物培育机制、生态解谜、七血收集和七种生长条件的设定，总文本量约5000字。您可以根据需要调整分支深度和选项数量，确保与其他房间（如地下室的生命之露、画室的颜料）的线索联动自然。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-卧室.txt 场景 ---
scenes["bedroom_entry"] = {
    desc: `卧室位于庄园二层最深处，是主人阿斯特·克劳利的私人寝居。推开胡桃木雕花门，一股混合着薰衣草、旧纸张和封尘气息的气味扑面而来。月光从落地窗倾泻而入，在地毯上投下银白色的光带。
房间比想象中宽敞。一张巨大的四柱床占据中央，深红色帷幔半掩，丝绸床单早已褪色。床头柜上放着一盏熄灭的油灯和一本书脊开裂的日记。靠墙是一尊高大的胡桃木衣柜，柜门半开，里面似乎藏着什么。床尾的长椅上随意搭着一件睡袍。梳妆台上摆着银质梳镜，镜面布满水银斑驳。
最引人注目的是正对床尾的墙壁上挂着的那幅巨大的庄园油画。画中七个房间——图书馆、钟楼、音乐室、画室、温室、地下室和卧室——以透视图呈现，其中六个房间的窗户里亮着温暖的烛光，只有卧室的窗户一片漆黑。画框底部镶嵌着七颗宝石凹槽，其中六颗已经嵌入了你之前获得的各色宝石徽章，唯独最右边那颗空着。
你的目光在房间里游移。管家最后的提醒在脑中回响：“最后一间房藏着主人的私人秘密。只有真正理解庄园历史的人，才能点亮最后的烛火。”`,
    options: [
        { text: "检查四柱床和帷幔", target: "bedroom_bed" },
        { text: "翻阅床头柜上的日记", target: "bedroom_diary" },
        { text: "探索衣柜", target: "bedroom_closet" },
        { text: "研究梳妆台和镜子", target: "bedroom_dressing_table" },
        { text: "仔细观察庄园油画", target: "bedroom_painting" },
        { text: "检查落地窗和窗帘", target: "bedroom_window" },
        { text: "查看床底", target: "bedroom_under_bed" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_diary"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("主人建造谜语馆的动机——传承谜语精神")) {
            gameState.clues.push("主人建造谜语馆的动机——传承谜语精神");
            msg += `<div class="system-message">【获得线索】：主人建造谜语馆的动机——传承谜语精神</div>`;
        }
        if(!hasClue("窗外可能有提示")) {
            gameState.clues.push("窗外可能有提示");
            msg += `<div class="system-message">【获得线索】：窗外可能有提示</div>`;
        }
        return msg;
    },
    desc: `日记本封面是深棕色皮革，烫金标题《谜语馆纪事》。翻开扉页，是一段手写体：
“我，阿斯特·克劳利，将毕生收藏与智慧封于此馆。若你已集齐六枚徽章，便证明你足以承受最后的真相。卧室的烛光，需要你回答一个问题：‘我为何建造谜语馆？’答案不在别处，在我一生的记录中。”
日记的后面几页记录了庄园的建造历程、每个房间的设计思路，以及主人对谜题的热爱。其中一页夹着一张泛黄的便条，上面写着：“真正的传承，不在于遗产，而在于让谜语之火永不熄灭。最后一盏灯，只留给懂得继承谜语精神的人。”
日记的最后几页被撕掉了，只留下一个残句：“…若你迷茫，看看窗外，庄园的倒影会告诉你。”`,
    options: [
        { text: "继续探索房间", target: "bedroom_entry" },
        { text: "去落地窗看看", target: "bedroom_window" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_dressing_table"] = {
    desc: `梳妆台是维多利亚风格的，台面铺着白色蕾丝桌布。银质梳妆镜的镜面严重斑驳，只能模糊映出你的轮廓。当你靠近时，镜中的影像似乎比现实动作慢半拍，产生诡异的延迟。
梳妆台上有几个抽屉。你逐一拉开：
- 第一个抽屉：空的，但底部刻着“记忆之镜”。
- 第二个抽屉：一把银质发刷，刷毛里缠着几根灰白头发。
- 第三个抽屉：一个圆形粉盒，打开后里面是空的，但盒盖内侧有一面小镜子，镜面上用指甲刻着“七色光聚，真相方显”。
- 第四个抽屉：上锁，需要钥匙。
梳妆台旁边的小桌上放着一盏烛台，烛台上插着一根未燃尽的蜡烛。蜡烛底座刻着“子时之光”。`,
    options: [
        { text: "寻找抽屉钥匙", target: "bedroom_find_key" },
        { text: "尝试在子时点燃蜡烛", target: "bedroom_candle_midnight" },
        { text: "研究梳妆镜的延迟现象", target: "bedroom_mirror_delay" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_find_key"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("克劳利家训，强调谜语精神的传承")) {
            gameState.clues.push("克劳利家训，强调谜语精神的传承");
            msg += `<div class="system-message">【获得线索】：克劳利家训，强调谜语精神的传承</div>`;
        }
        return msg;
    },
    desc: `你在房间里寻找钥匙。检查床头柜、枕头下、床底、衣柜，都没有。最终你注意到梳妆台背面有一个隐蔽的磁铁吸附的小铁盒，里面是一把铜钥匙。打开第四个抽屉，里面是一本皮革封面的小册子，标题是《克劳利家训》。翻开第一页：“谜语是连接过去与未来的桥梁。建造谜语馆，是为让后人永葆好奇之心。” 后面记录了家族几代人设计谜题的故事。`,
    options: [
        { text: "继续探索", target: "bedroom_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_mirror_delay"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("镜子可以投射影像，需要将七枚徽章的影像依次映出")) {
            gameState.clues.push("镜子可以投射影像，需要将七枚徽章的影像依次映出");
            msg += `<div class="system-message">【获得线索】：镜子可以投射影像，需要将七枚徽章的影像依次映出</div>`;
        }
        return msg;
    },
    desc: `你反复在梳妆镜前移动，发现延迟的时间大约是七秒。你试着做出一个动作，七秒后镜像才跟上。你突发奇想，从口袋里拿出一枚徽章（比如蓝宝石徽章）举在镜前，七秒后镜像中的徽章竟然发出了蓝光，然后镜像中的你转身，走到油画前，将徽章嵌入了某个位置——但这个动作你并没有做。镜像似乎有独立意志。随后镜像消失，镜子恢复正常。
你低头一看，手中的蓝宝石徽章还在，但镜中刚才显示的嵌入动作给你一个启发：也许需要以某种顺序将徽章“映”入镜子，才能触发油画机关。`,
    options: [
        { text: "尝试用镜子投射所有徽章", target: "bedroom_mirror_projection" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_mirror_projection"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("顺序很重要，可能需按房间解谜的顺序或某种逻辑顺序")) {
            gameState.clues.push("顺序很重要，可能需按房间解谜的顺序或某种逻辑顺序");
            msg += `<div class="system-message">【获得线索】：顺序很重要，可能需按房间解谜的顺序或某种逻辑顺序</div>`;
        }
        return msg;
    },
    desc: `你依次将七枚徽章举到镜前。每举一枚，镜中就会延迟七秒后出现该徽章嵌入油画画框对应凹槽的影像。当七枚全部映完，油画中的卧室窗户突然亮起微弱的烛光，但很快又熄灭了——似乎还不够。你需要按照正确的顺序投射，并且可能需要在子时进行。`,
    options: [
        { text: "寻找正确顺序的线索", target: "bedroom_order_clue" },
        { text: "等待子时再试", target: "bedroom_midnight_mirror" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_bed"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("衣柜钥匙")) {
            gameState.items.push("衣柜钥匙");
            msg += `<div class="system-message">【获得物品】：衣柜钥匙</div>`;
        }
        if(!hasItem("停止的怀表")) {
            gameState.items.push("停止的怀表");
            msg += `<div class="system-message">【获得物品】：停止的怀表</div>`;
        }
        return msg;
    },
    desc: `四柱床的四根柱子雕刻着藤蔓和花蕾，帷幔是深红色的天鹅绒，落满灰尘。你掀开帷幔，床上的丝绸被褥已经发黄。枕头下有一个硬物，是一把黄铜钥匙，钥匙柄上刻着“衣柜”。
床架是实木的，你可以检查床板。掀起被褥，床板上刻着几行字：“我在梦中建造了七个谜题，却在醒来时忘记最后一个。请将我的梦归还于我。”
床头板有一个隐藏的暗格，你摸索着找到了一个弹簧按钮，按下后弹出一个抽屉，里面放着一只怀表。怀表已经停止，指针指向11:55（与钟楼谜题相同）。表盖内侧刻着“时间停止的地方，答案开始。”`,
    options: [
        { text: "用钥匙打开衣柜", target: "bedroom_closet_key" },
        { text: "研究怀表", target: "bedroom_pocket_watch" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_closet"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("密码锁需要颜色顺序")) {
            gameState.clues.push("密码锁需要颜色顺序");
            msg += `<div class="system-message">【获得线索】：密码锁需要颜色顺序</div>`;
        }
        if(!hasClue("时间线索（子夜、七年前）")) {
            gameState.clues.push("时间线索（子夜、七年前）");
            msg += `<div class="system-message">【获得线索】：时间线索（子夜、七年前）</div>`;
        }
        return msg;
    },
    desc: `衣柜门半开，里面挂着几件旧式礼服和睡袍。你推开门，内部空间比预想的大。衣柜深处挂着主人的衣物，衣架上挂着一条围巾，围巾口袋里有一张纸条：“我最后的秘密，藏在镜中世界的七步之遥。”
衣柜底部有一个暗层，你掀起隔板，下面是一个小箱子。箱子上有一个七位密码锁，每个数字盘对应一种颜色（红、橙、黄、绿、青、蓝、紫）。你需要按正确的颜色顺序输入密码。
衣柜内壁贴着一张发黄的报纸剪报，标题是《谜语大师克劳利逝世，遗产成谜》，日期是七年前的某一天。剪报旁有人用铅笔写着：“七年前的那个子夜，他最后一次走进卧室，再也没有出来。”`,
    options: [
        { text: "尝试破解密码锁", target: "bedroom_closet_lock" },
        { text: "检查衣柜背后的墙壁", target: "bedroom_closet_back" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_closet_key"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("徽章不在衣柜，需要通过理解庄园的意义获得")) {
            gameState.clues.push("徽章不在衣柜，需要通过理解庄园的意义获得");
            msg += `<div class="system-message">【获得线索】：徽章不在衣柜，需要通过理解庄园的意义获得</div>`;
        }
        return msg;
    },
    desc: `你用钥匙打开衣柜的锁（原来半开的门只是虚掩，但还有一个上锁的内层）。内层衣柜里挂着一件华丽的深紫色礼服，礼服胸针上镶嵌着一颗彩虹色宝石——但你摘下宝石，它只是一颗普通玻璃。礼服口袋里有一张纸条：“彩虹徽章不在衣柜里，而在你的理解中。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_closet_lock"] = {
    desc: `密码锁需要七位颜色顺序。你从日记、油画、梳妆镜等线索中推断，顺序可能是：
- 按光谱顺序（红橙黄绿青蓝紫）
- 按解谜顺序（图书馆→钟楼→音乐室→画室→温室→地下室→卧室，但颜色未知）
- 按七元素顺序（水、火、土、气、光、暗、生命，每种对应一个颜色？）
如果你已经完成了所有其他谜题，可能从其他房间获得了颜色与元素的对应关系。例如，图书馆（蓝，智慧）、钟楼（红，时间）、音乐室（绿，和谐）、画室（橙，色彩）、温室（金，生命）、地下室（紫，转化）、卧室（彩虹，统一）。但这里的颜色顺序可能不同。
另一种思路：密码可能是七年前那个子夜的具体时间（比如11:55转化为颜色？）或者与怀表有关。
为了简化，我们可以设计成密码需要从镜子谜题中获得。如果玩家已经通过镜子投射获得了顺序，就可以解开衣柜，得到最后一个关键道具（比如“主人的怀表”或“镜片”）。`,
    options: [
        { text: "尝试输入光谱顺序", target: "bedroom_lock_fail" },
        { text: "先完成镜子谜题", target: "bedroom_dressing_table" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_lock_fail"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("密码锁锁定，需等待或找到重置方法")) {
            setFlag("密码锁锁定，需等待或找到重置方法", true);
            msg += `<div class="system-message">【状态】：密码锁锁定，需等待或找到重置方法</div>`;
        }
        return msg;
    },
    desc: `你输入了一个错误的颜色顺序，密码锁发出刺耳的蜂鸣声，衣柜暗层弹出一根毒针，你勉强躲过。密码锁被暂时锁定，需要等待一段时间才能重试。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_window"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("喷泉池底的七角星图案")) {
            gameState.clues.push("喷泉池底的七角星图案");
            msg += `<div class="system-message">【获得线索】：喷泉池底的七角星图案</div>`;
        }
        if(!hasClue("子夜时喷泉倒影可能揭示答案")) {
            gameState.clues.push("子夜时喷泉倒影可能揭示答案");
            msg += `<div class="system-message">【获得线索】：子夜时喷泉倒影可能揭示答案</div>`;
        }
        return msg;
    },
    desc: `落地窗正对庄园花园，窗外是一片月光下的荒芜。窗帘是厚重的丝绒，你拉开窗帘，月光倾泻而入。玻璃窗上有一层薄霜，你用手擦去，发现窗玻璃上刻着几行细小的字：“站在此处，望向花园中央的喷泉，子夜时分，倒影会揭示答案。”
透过窗户，你能看到花园中央的圆形喷泉，但喷泉早已干涸。喷泉池底似乎有某种图案，但距离太远看不清楚。你注意到窗台上有一副旧望远镜，镜片布满灰尘。擦干净后，你可以通过望远镜观察喷泉池底。池底铺着马赛克，拼成一个七角星图案，每个角上有一个符号（与图书馆星盘上的符号相同）。`,
    options: [
        { text: "等待子夜观察倒影", target: "bedroom_midnight_fountain" },
        { text: "尝试用望远镜寻找其他线索", target: "bedroom_telescope" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_midnight_fountain"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要回答主人的问题")) {
            gameState.clues.push("需要回答主人的问题");
            msg += `<div class="system-message">【获得线索】：需要回答主人的问题</div>`;
        }
        return msg;
    },
    desc: `子夜时分，月光直射喷泉池底，水面虽然干涸，但月光在池底马赛克上形成反射，将七角星的投影投射到卧室的墙壁上。投影中，七角星的每个角都指向油画上的一个房间。你根据投影，将七枚徽章按照投影指向的顺序重新排列在画框凹槽中。当最后一枚徽章放入，油画中的卧室窗户终于亮起稳定的烛光。
但烛光只亮了片刻，又熄灭了。油画底部浮现出一行字：“徽章归位，但你仍未理解谜语的含义。请告诉我，我为何建造谜语馆？”`,
    options: [
        { text: "根据日记和家训回答（谜语精神、传承等）", target: "bedroom_answer_correct" },
        { text: "回答错误", target: "bedroom_answer_wrong" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_painting"] = {
    desc: `油画是卧室的核心谜题。画框底部有七个凹槽，你已经嵌入了六枚徽章（如果你已经获得了前六枚）。第七个凹槽空着。画中的六个房间亮着烛光，只有卧室是黑暗的。
你仔细观察油画，发现画面中的细节非常丰富。在亮着烛光的六个房间里，你可以看到微小的、几乎不可见的符号：
- 图书馆窗口内有一本书
- 钟楼窗口内有一个齿轮
- 音乐室窗口内有一个音符
- 画室窗口内有一个调色板
- 温室窗口内有一朵花
- 地下室窗口内有一个符文
这些符号似乎与每个谜题的核心道具对应。卧室窗口是空的，但画面中卧室的墙壁上挂着一面镜子，镜中倒映着七角星图案。你意识到，卧室的烛光需要通过“镜像”来点亮——可能是将其他房间的光芒反射进卧室。`,
    options: [
        { text: "尝试用梳妆镜反射光线", target: "bedroom_mirror_reflection" },
        { text: "用望远镜观察油画细节", target: "bedroom_painting_details" },
        { text: "将符文石（若从地下室获得）放在油画上", target: "bedroom_rune_solution" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_mirror_reflection"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要七色光")) {
            gameState.clues.push("需要七色光");
            msg += `<div class="system-message">【获得线索】：需要七色光</div>`;
        }
        return msg;
    },
    desc: `你取下梳妆台上的银镜，走到油画前。月光从窗户射入，你调整镜子的角度，将月光反射到油画上卧室窗口的位置。当光斑落在窗口时，画面中卧室的烛火微微闪烁，但没有完全点亮。你需要更多的光——或许需要同时反射七种颜色的光，或者需要子时的特殊光线。`,
    options: [
        { text: "寻找七色光源", target: "bedroom_color_light" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_color_light"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("衣柜背后有机关")) {
            gameState.clues.push("衣柜背后有机关");
            msg += `<div class="system-message">【获得线索】：衣柜背后有机关</div>`;
        }
        return msg;
    },
    desc: `你想起音乐室的彩色玻璃窗或画室的调色板，但那些在别的房间。卧室里有没有彩色光源？你检查台灯、窗帘，发现窗帘的材质在月光下会透出淡淡的彩虹色（其实是灰尘和霉菌造成的衍射）。但效果太微弱。你想起梳妆台上的粉盒镜片，它可能是一个棱镜，可以将白光分解成七色。你取下粉盒盖上的小镜片，对着月光调整角度，果然在天花板上投射出七色光斑。你将这些光斑逐一引导到油画上卧室窗口，每引导一个颜色，画面中卧室的烛火就亮一分。当七色光斑全部汇聚，卧室窗口终于完全点亮。
油画开始变化：画面中的镜子突然变得清晰，镜中倒映出你的脸，但你的脸上戴着和画中其他人物一样的面具。面具的眼睛部位突然发光，射出一道光线，照在房间的某个角落——那里正是衣柜背后的墙壁。`,
    options: [
        { text: "检查衣柜背后", target: "bedroom_closet_back" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_closet_back"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("彩虹徽章（7/7）")) {
            gameState.items.push("彩虹徽章（7/7）");
            gameState.medals.push("彩虹徽章（7/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：彩虹徽章（7/7）</div>`;
        }
        return msg;
    },
    desc: `你移开衣柜，发现墙壁上有一个隐藏的壁龛，里面放着一只精致的木盒。木盒上刻着七角星图案，盒盖有一个钥匙孔。你四处寻找钥匙，最终在枕头下找到一把小钥匙（之前可能漏掉了）。打开盒子，里面是一枚彩虹色的徽章——最后一枚。
当七枚徽章齐聚的瞬间，你感到整个庄园都在震动。大厅的方向传来沉重的石门开启之声。`,
    options: [
        { text: "前往中央密室", target: "final_chamber" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_rune_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("彩虹徽章（7/7）")) {
            gameState.items.push("彩虹徽章（7/7）");
            gameState.medals.push("彩虹徽章（7/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：彩虹徽章（7/7）</div>`;
        }
        return msg;
    },
    desc: `如果你已经完成了地下室谜题并获得了符文石，可以直接将符文石放在油画上卧室窗口的位置。符文石发出柔和的光，画中卧室的烛光被点燃，衣柜背后的壁龛自动打开，露出最后一枚徽章。这是快速解法。`,
    options: [
        { text: "前往中央密室", target: "final_chamber" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_answer_correct"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("彩虹徽章（7/7）")) {
            gameState.items.push("彩虹徽章（7/7）");
            gameState.medals.push("彩虹徽章（7/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：彩虹徽章（7/7）</div>`;
        }
        return msg;
    },
    desc: `油画上浮现的问题：“我为何建造谜语馆？” 你根据日记和家训，回答道：“为了传承谜语的精神，让后人永远保持好奇与探索之心。”
油画沉默片刻，然后卧室的烛光全部亮起，镜子中你的面具碎裂，露出你的真实面容。油画缓缓从墙上滑落，露出后面一个暗门。暗门里是一枚彩虹徽章。`,
    options: [
        { text: "前往中央密室", target: "final_chamber" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_answer_wrong"] = {
    desc: `你给出了一个错误答案（比如“为了财富”“为了名声”等）。油画中的烛火全部熄灭，六个房间的烛光也逐一熄灭。整个房间陷入黑暗。你听见管家奥尔德斯的声音：“主人失望了。” 一扇暗门打开，你被礼貌地请出庄园，一无所获。
（游戏结束：被驱逐）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_pocket_watch"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("棱镜铜片（可用于彩色光反射）")) {
            gameState.items.push("棱镜铜片（可用于彩色光反射）");
            msg += `<div class="system-message">【获得物品】：棱镜铜片（可用于彩色光反射）</div>`;
        }
        return msg;
    },
    desc: `停止的怀表指向11:55。你想起钟楼谜题中，时间需要调到月升之时。也许这块怀表可以重新启动。你尝试上发条，但发条已经锈死。你注意到怀表背面有一个小盖子，打开后里面是一块刻着七角星图案的铜片。铜片可以取下，大小正好可以嵌入油画框的某个位置？实际上，油画框的凹槽是放徽章的，铜片可能用于别处。
你发现梳妆台上的粉盒正好有一个同样大小的凹槽，将铜片嵌入后，粉盒内侧的小镜子突然发光，投射出七色光谱。这帮助你完成了之前的镜子反射谜题。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_under_bed"] = {
    desc: `你趴下查看床底，黑暗中似乎有什么东西在反光。你伸手去够，摸到一个木盒。拉出来一看，是一个鞋盒大小的匣子，上面刻着“最后的谜题”。盒盖上有七个按钮，每个按钮上有一个房间的图标。你需要按正确的顺序按下按钮。顺序是什么？也许是你解谜的顺序，或者是主人建造的顺序。如果你之前没有注意，可以随机尝试。
- 尝试按解谜顺序 [前往 bedroom_box_correct]
- 尝试按其他顺序 [前往 bedroom_box_trap]`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_box_correct"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("镜子反射月光")) {
            gameState.clues.push("镜子反射月光");
            msg += `<div class="system-message">【获得线索】：镜子反射月光</div>`;
        }
        return msg;
    },
    desc: `你按照自己解谜的顺序（图书馆→钟楼→音乐室→画室→温室→地下室→卧室）按下按钮。盒子咔哒一声打开，里面是一张纸条：“你已经证明了你的智慧，但最后一枚徽章不在盒子里。它在你心中。” 纸条背面有一幅简图，显示如何通过镜子反射月光点亮油画。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_box_trap"] = {
    desc: `错误顺序导致盒子喷出一股烟雾，你吸入后头晕目眩，过了好一会儿才恢复。盒子暂时锁定。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_closet_trap"] = {
    desc: `如果强行撬开衣柜的密码锁，会触发毒气机关，窒息而死。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_mirror_curse"] = {
    desc: `如果对着镜子做出不敬的行为（比如砸碎镜子），镜中会伸出无数只手将你拖入镜中世界，永远困在镜像里。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["bedroom_fall"] = {
    desc: `如果爬上窗户试图查看喷泉，窗台年久失修，坍塌导致坠落。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（获得彩虹徽章后，可前往中央密室）
以上扩展为卧室之谜提供了丰富的分支，包含日记、镜子、衣柜、油画、窗户等多种元素，以及与之前房间获得的符文石、怀表等物品的联动，总文本量约5000字。您可以根据需要调整分支深度和选项数量，确保最终谜题的哲学内涵（传承谜语精神）与序章呼应。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-音乐室.txt 场景 ---
scenes["musicroom_entry"] = {
    desc: `音乐室位于庄园一层西侧，是一间穹顶圆形大厅，宛如一座微型歌剧院。推开厚重的隔音门，一股混合着松香、木蜡和旧纸张的气味扑面而来。月光透过穹顶的彩色玻璃，在地板上投下琴键般的光影。
房间中央偏后的位置矗立着一架巨大的管风琴，它的音管从地面直抵穹顶，镀金装饰在暗光中闪烁。管风琴前有一张长椅，琴键上散落着七枚金属键帽，上面刻着不同的音符符号（Do、Re、Mi、Fa、Sol、La、Si）。键帽可以拿起，但似乎需要按特定顺序放置。
管风琴左侧立着一架三角钢琴，琴盖紧闭，琴谱架上放着一本发黄的乐谱。右侧是一组定音鼓，鼓面布满灰尘。靠墙的展柜里陈列着各种乐器：小提琴、中提琴、大提琴、竖琴、长笛、单簧管、圆号，但全部沉寂无声。墙上挂着一幅巨大的交响乐队油画，画中指挥家的指挥棒指向一个空白的乐谱架。
房间的声学设计极为讲究，墙壁上有波浪形的扩散板，天花板上悬挂着几个可调节的反射板。角落里的一个音叉架子上，排列着七枚不同大小的音叉，每枚音叉的底座上刻着一个音符符号。
管家曾提到：“音乐室的谜题关乎和谐与共鸣。只有奏出正确的旋律，隐藏的门才会开启。”`,
    options: [
        { text: "检查管风琴", target: "musicroom_organ" },
        { text: "查看三角钢琴和乐谱", target: "musicroom_piano" },
        { text: "研究展柜里的乐器", target: "musicroom_instruments" },
        { text: "观察音叉架", target: "musicroom_tuning_forks" },
        { text: "检查天花板上的反射板", target: "musicroom_reflectors" },
        { text: "研究乐队油画", target: "musicroom_painting" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_organ"] = {
    desc: `管风琴的琴键有上下两排，共数十个。目前只有中央区域的几个键可以按下，其他的似乎被锁住了。琴键上方的音栓（控制音色的拉杆）有七个，每个音栓上都刻着一个音符符号，但拉不动。琴键上散落的七枚金属键帽显然是用来激活音栓的。
琴身侧面有一个齿轮状的凹槽，大小与你之前在钟楼获得的“机械齿轮”完全吻合。如果你已经获得了机械齿轮，可以嵌入。
管风琴的背面有一个手摇鼓风机，用于产生气流。鼓风机的手柄很沉，需要用力摇动才能产生足够的风压。`,
    options: [
        { text: "尝试将金属键帽放到音栓上", target: "musicroom_place_keycaps" },
        { text: "嵌入机械齿轮（若有）", target: "musicroom_use_gear", condition: () => hasItem("生命之露") },
        { text: "摇动鼓风机", target: "musicroom_bellows" },
        { text: "检查管风琴内部", target: "musicroom_inside" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_place_keycaps"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("可能需要先启动鼓风机或按正确顺序")) {
            gameState.clues.push("可能需要先启动鼓风机或按正确顺序");
            msg += `<div class="system-message">【获得线索】：可能需要先启动鼓风机或按正确顺序</div>`;
        }
        return msg;
    },
    desc: `你将七枚键帽分别放到对应音符的音栓上（Do、Re、Mi、Fa、Sol、La、Si）。但键帽放上去后没有反应，音栓仍然拉不动。也许需要按特定的顺序放置，或者需要先激活气流。`,
    options: [
        { text: "尝试摇动鼓风机", target: "musicroom_bellows" },
        { text: "尝试按乐谱顺序放置键帽", target: "musicroom_order_by_score" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_use_gear"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("音栓解锁")) {
            setFlag("音栓解锁", true);
            msg += `<div class="system-message">【状态】：音栓解锁</div>`;
        }
        return msg;
    },
    desc: `你将机械齿轮嵌入管风琴侧面的凹槽，齿轮与内部机构咬合。你转动齿轮，听到一连串咔哒声，音栓上的锁扣全部松开，七个音栓都可以拉动了。但音栓本身还是需要键帽才能操作。`,
    options: [
        { text: "放置键帽", target: "musicroom_place_keycaps_unlocked" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_bellows"] = {
    desc: `你用力摇动鼓风机的手柄，风箱发出沉重的呼吸声，管风琴内部开始有气流涌动。几个音管发出低沉的嗡鸣。但气流不够稳定，需要持续摇动才能维持。如果你一个人，很难同时摇动鼓风机和弹奏。也许可以找到固定手柄的方法，或者用其他方式产生气流。
你注意到鼓风机旁边有一个皮带轮，可以用绳子连接到别处。如果有其他动力源（比如钟楼的齿轮传动），可以借用。`,
    options: [
        { text: "寻找固定手柄的方法", target: "musicroom_lock_bellows" },
        { text: "尝试用绳子连接其他动力源（需已有钟楼齿轮联动）", target: "musicroom_connect_power" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_lock_bellows"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("气流稳定")) {
            setFlag("气流稳定", true);
            msg += `<div class="system-message">【状态】：气流稳定</div>`;
        }
        return msg;
    },
    desc: `你在工具架上找到一根皮带，可以将手柄固定在一个位置。固定后，风箱持续供气，管风琴可以演奏了。`,
    options: [
        { text: "返回操作管风琴", target: "musicroom_organ" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_connect_power"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("气流稳定")) {
            setFlag("气流稳定", true);
            msg += `<div class="system-message">【状态】：气流稳定</div>`;
        }
        return msg;
    },
    desc: `你将鼓风机的皮带轮与钟楼的传动轴连接（通过墙内的通道），钟楼的齿轮转动为鼓风机提供持续动力。管风琴获得稳定气流。`,
    options: [
        { text: "返回操作管风琴", target: "musicroom_organ" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_piano"] = {
    desc: `三角钢琴的琴盖布满灰尘，你掀开盖子，琴键发黄，但还能按下。琴谱架上放着一本《七重奏鸣曲》手稿，封面有克劳利的签名。乐谱共七页，每页标题为“第一乐章：水”“第二乐章：火”“第三乐章：土”“第四乐章：气”“第五乐章：光”“第六乐章：暗”“第七乐章：生命”。
乐谱上标注了音符，但每页都有几个小节被墨水涂黑，无法辨认。涂黑的地方用铅笔写着小字：“唯有共鸣之心，可补全遗失之章。” 乐谱最后一页的空白处，画着一个七角星，每个角上标有一个音符符号，星中央有一颗水晶的图案。
钢琴的琴盖内侧贴着一张泛黄的纸条：“此琴之音可调，旋动调音钉，可使音高偏移。共鸣水晶可校准音准。”
如果你已经获得了“共鸣水晶”（可能在画室获得，但画室在音乐室之后？实际上，设定中音乐室获得共鸣水晶用于画室，所以这里还没有。可能另一种解法是使用其他物品，或通过音叉校准。）`,
    options: [
        { text: "尝试弹奏乐谱", target: "musicroom_play_piano" },
        { text: "检查钢琴的调音钉", target: "musicroom_tuning_pins" },
        { text: "寻找共鸣水晶（尚未获得，但可先记录）", target: "musicroom_search_crystal" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_play_piano"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要补全乐谱")) {
            gameState.clues.push("需要补全乐谱");
            msg += `<div class="system-message">【获得线索】：需要补全乐谱</div>`;
        }
        return msg;
    },
    desc: `你试着按乐谱弹奏，但由于缺少几个小节，旋律不完整。弹到空缺处时，钢琴发出刺耳的不和谐音，整个房间的乐器都跟着共鸣，震得你耳膜发疼。你必须停下来。`,
    options: [
        { text: "寻找其他乐器或线索来补全乐谱", target: "musicroom_find_score_parts" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_tuning_pins"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("调音扳手")) {
            gameState.items.push("调音扳手");
            msg += `<div class="system-message">【获得物品】：调音扳手</div>`;
        }
        return msg;
    },
    desc: `钢琴的弦轴板上有一排调音钉，每个钉对应一根琴弦。你发现有几个调音钉的位置明显偏离了标准位置，似乎被人为调乱。调音钉需要用专用扳手才能旋转。你在钢琴底部的工具箱里找到了一把调音扳手。`,
    options: [
        { text: "尝试将钢琴调回标准音高", target: "musicroom_tune_piano" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_tune_piano"] = {
    desc: `你需要将钢琴的每个音调准。标准音高可以用音叉架上的音叉作为参考。你拿起一枚音叉（比如A=440Hz），敲击后听其音高，然后旋转对应的调音钉，使琴弦音高与音叉一致。这个过程需要耐心和听力。如果你有绝对音感或音乐知识，可以轻松完成；否则，可能需要反复尝试。错误调音可能导致琴弦崩断。`,
    options: [
        { text: "用音叉逐一校准", target: "musicroom_tune_with_forks" },
        { text: "尝试直接按乐谱弹奏，通过听觉调整", target: "musicroom_tune_by_ear" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_tune_with_forks"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("乐谱空缺处需要根据其他乐器的共鸣来补全")) {
            gameState.clues.push("乐谱空缺处需要根据其他乐器的共鸣来补全");
            msg += `<div class="system-message">【获得线索】：乐谱空缺处需要根据其他乐器的共鸣来补全</div>`;
        }
        return msg;
    },
    desc: `你利用音叉架上的七枚音叉（对应Do、Re、Mi、Fa、Sol、La、Si）将钢琴的七个基本音校准。校准后，钢琴的音色变得纯净。你再弹奏乐谱，空缺处仍然不和谐，但整体比之前好多了。乐谱上涂黑的地方似乎随着正确的音高而显现出淡淡的音符——原来，被涂黑的音符需要根据“共鸣”原理来补全，而不仅仅是音高正确。`,
    options: [
        { text: "尝试用其他乐器配合", target: "musicroom_ensemble" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_instruments"] = {
    desc: `展柜中的乐器虽然陈旧，但保存完好。小提琴、长笛等都可以取用。你注意到每件乐器的某个部位都刻有一个数字：小提琴刻着“1”，中提琴“2”，大提琴“3”，竖琴“4”，长笛“5”，单簧管“6”，圆号“7”。似乎与七重奏鸣曲的七个乐章对应。
展柜的玻璃门上有锁，但锁是简单的搭扣，可以撬开。你找到一根铁丝，拨开搭扣，取出乐器。但乐器都需要调音才能使用。`,
    options: [
        { text: "取出小提琴并尝试调音", target: "musicroom_violin" },
        { text: "取出其他乐器", target: "hall_main" },
        { text: "观察乐器的摆放顺序", target: "musicroom_instrument_order" }
    ]
};

scenes["musicroom_violin"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("获得小提琴（可演奏）")) {
            setFlag("获得小提琴（可演奏）", true);
            msg += `<div class="system-message">【状态】：获得小提琴（可演奏）</div>`;
        }
        return msg;
    },
    desc: `小提琴的琴弦松弛，需要拧紧弦轴。你尝试调音，但因为没有参考音高，很难调准。你可以用音叉来帮助调音。调好后，你拉响空弦，音色悠扬。但单独一把小提琴无法解谜，可能需要与其他乐器合奏。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_tuning_forks"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("音叉与乐器的对应关系（音叉1→小提琴，音叉2→中提琴，等等）")) {
            gameState.clues.push("音叉与乐器的对应关系（音叉1→小提琴，音叉2→中提琴，等等）");
            msg += `<div class="system-message">【获得线索】：音叉与乐器的对应关系（音叉1→小提琴，音叉2→中提琴，等等）</div>`;
        }
        return msg;
    },
    desc: `音叉架是一个木制支架，上面有七个凹槽，每个凹槽里放着一枚音叉。音叉的叉股上刻着音符符号，底座上还刻有一个数字（1-7）。你拿起一枚音叉，轻轻敲击，它发出纯净的乐音，余音在房间里回荡很久，说明房间的声学设计极佳。
音叉架后面有一张图表，显示了音叉的频率和对应的“共鸣物体”。图表上画着七个不同形状的共鸣箱，每个共鸣箱对应一个音叉。共鸣箱的图画旁边标注着位置——它们似乎就是展柜里的七件乐器！也就是说，每件乐器都是某个音叉的共鸣箱。`,
    options: [
        { text: "尝试用音叉激发对应乐器共鸣", target: "musicroom_resonance" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_resonance"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("用音叉激发对应乐器，可补全乐谱空缺")) {
            gameState.clues.push("用音叉激发对应乐器，可补全乐谱空缺");
            msg += `<div class="system-message">【获得线索】：用音叉激发对应乐器，可补全乐谱空缺</div>`;
        }
        return msg;
    },
    desc: `你拿起音叉1，敲击后靠近小提琴（即使没有演奏），小提琴的琴身开始微微振动，发出同样的音高，而且音量被放大。这验证了图表的内容。如果你同时让多个音叉激发多个乐器，可能会产生复杂的和声。
你想到，乐谱上的空缺部分可能需要用这种共鸣方式来“补全”——将正确的音叉敲响，让对应的乐器共鸣，空缺的音符就会自然显现。`,
    options: [
        { text: "根据乐谱空缺，选择正确的音叉组合", target: "musicroom_fill_score" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_reflectors"] = {
    desc: `天花板上的反射板可以通过墙壁上的拉绳调节角度。每块反射板都对应一个乐器位置，可以改变声音的传播路径。反射板的边缘刻有音符符号，你可以将它们对准不同的方向。`,
    options: [
        { text: "调节反射板角度", target: "musicroom_adjust_reflectors" },
        { text: "检查反射板的连接绳索", target: "musicroom_reflector_ropes" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_adjust_reflectors"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("声学环境优化")) {
            setFlag("声学环境优化", true);
            msg += `<div class="system-message">【状态】：声学环境优化</div>`;
        }
        return msg;
    },
    desc: `你将反射板分别对准七个乐器位置，使声音能够聚焦到房间中央的某个点（比如管风琴前的长椅）。这样，当你演奏时，声音会形成共鸣场。但这似乎不是解谜的关键，而是辅助条件。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_painting"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("奏响乐器的顺序（对应七元素）")) {
            gameState.clues.push("奏响乐器的顺序（对应七元素）");
            msg += `<div class="system-message">【获得线索】：奏响乐器的顺序（对应七元素）</div>`;
        }
        return msg;
    },
    desc: `巨大的油画描绘了一支管弦乐队，指挥家站在中央，指挥棒指向一个空白的乐谱架。乐谱架上有一行字：“当七种声音合一，指挥家将为你指引。” 画中乐手的乐器位置与展柜中乐器的编号顺序一致。
油画的画框底部有一个隐蔽的抽屉，你拉动抽屉，里面有一张羊皮纸，上面写着：“七重奏鸣曲的完整旋律，藏在七种乐器的共鸣之中。依次奏响乐器，顺序为：水、火、土、气、光、暗、生命。每奏响一种，对应的乐谱小节将显现。”`,
    options: [
        { text: "按照七元素顺序奏响乐器", target: "musicroom_play_instruments_order" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_fill_score"] = {
    desc: `根据线索，你需要按照七元素顺序（水、火、土、气、光、暗、生命）依次用音叉激发对应的乐器，使乐谱空缺部分显现。但元素与乐器的对应关系需要从其他线索中获得。你可以从乐谱的标题推断：第一乐章“水”对应什么乐器？也许是长笛（水般流动）？或者竖琴（水波）？需要更明确的对应。
在乐谱的第一页（水乐章），涂黑的小节旁边有一个很小的水波纹图案。图案的旁边画着一个乐器轮廓——看起来像长笛。第二页（火）旁边画着圆号（火焰般的音色）。第三页（土）旁边画着大提琴（深沉如大地）。第四页（气）旁边画着单簧管（轻盈如风）。第五页（光）旁边画着小提琴（明亮光辉）。第六页（暗）旁边画着中提琴（柔和暗淡）。第七页（生命）旁边画着竖琴（生命之泉）。
你按照这个对应关系，依次敲响对应的音叉，让乐器共鸣。每共鸣一个，乐谱上对应的小节就浮现出完整的音符。当七个空缺全部补全，乐谱变得完整。
获得完整乐谱`,
    options: [
        { text: "在管风琴上演奏完整乐谱", target: "musicroom_play_full_score" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_play_full_score"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("翠绿徽章（3/7）")) {
            gameState.items.push("翠绿徽章（3/7）");
            gameState.medals.push("翠绿徽章（3/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：翠绿徽章（3/7）</div>`;
        }
        if(!hasItem("共鸣水晶")) {
            gameState.items.push("共鸣水晶");
            msg += `<div class="system-message">【获得物品】：共鸣水晶</div>`;
        }
        return msg;
    },
    desc: `你坐到管风琴前，将七枚键帽按乐谱顺序放置到音栓上（每个乐章对应一个音栓），拉出音栓，然后开始演奏完整的七重奏鸣曲。管风琴的音管奏出庄严的旋律，房间内的所有乐器都开始共鸣，形成宏大的交响。当最后一个音符消散，管风琴后方的墙壁裂开，露出一枚翠绿徽章和一块晶莹的共鸣水晶。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_use_crystal"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("翠绿徽章（3/7）")) {
            gameState.items.push("翠绿徽章（3/7）");
            gameState.medals.push("翠绿徽章（3/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：翠绿徽章（3/7）</div>`;
        }
        return msg;
    },
    desc: `如果你已经通过其他途径获得了共鸣水晶（例如画室，但按顺序画室应在音乐室之后，所以这里主要是为多周目或灵活顺序设计），可以将共鸣水晶放在管风琴的中央音栓位置。水晶会发出七彩光芒，自动校准所有音栓，并补全乐谱。然后你只需按下启动按钮，管风琴就会自动演奏，获得徽章。这是快速解法。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_ensemble"] = {
    desc: `如果你没有通过音叉补全乐谱，也可以尝试用其他乐器合奏来解谜。例如，你调好钢琴，又取出了小提琴、长笛等乐器，但一个人无法同时演奏多件乐器。你可以使用房间里的机械装置——在展柜后面发现一个自动演奏机构，可以将乐谱输入，让机械手演奏乐器。这需要你先将乐谱完整抄录到纸带上，然后启动机构。
这个分支更复杂，可以作为替代路径。`,
    options: [
        { text: "寻找自动演奏机构", target: "musicroom_autoplayer" },
        { text: "抄录乐谱", target: "musicroom_copy_score" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_deafening"] = {
    desc: `如果错误地同时敲响所有音叉，产生的声波冲击会损伤你的听力，导致暂时性耳聋。你踉跄逃出音乐室，需要休息。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_collapse"] = {
    desc: `如果演奏时使用错误的音栓组合，管风琴会发出不和谐的强音，震碎穹顶玻璃，碎片落下砸伤你。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（返回大厅，音乐室谜题完成）
以上扩展为音乐室之谜提供了丰富的分支、乐器解谜、声学机制、乐谱补全以及与音叉、共鸣水晶的联动，总文本量约5000字。您可以根据需要调整分支深度和选项数量，确保与之前房间的线索（如钟楼的机械齿轮）联动自然。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-钟楼1.txt 场景 ---
scenes["clocktower_entry"] = {
    desc: `钟楼位于庄园东侧，是一座独立的石塔，与主楼通过一条玻璃连廊相连。推开铸铁大门，一股混合着机油和铜锈的气味扑面而来。螺旋石梯盘旋而上，石阶边缘被岁月磨得光滑。巨大的机械钟占据了塔内三层楼的高度，无数齿轮、摆锤、弹簧和连杆在墙壁上轰鸣运转，发出有节奏的金属撞击声。
钟盘位于塔楼第三层，直径超过三米，罗马数字镶边，两根巨大的指针——时针和分针——停留在11:55的位置，但分针微微颤抖，仿佛被什么卡住。钟盘下方有一个操作台，台上布满拉杆、旋钮和几个仪表盘。墙上用哥特体刻着一行字：“时间从不等待，但真相总在间隙中浮现。”
你注意到钟楼内有几个值得探索的区域：
底层有一个小型工坊，堆满了工具和零件。
中层（第二层）有一排观察窗，可以俯瞰庄园。
顶层（第三层）是钟盘和操作台所在，墙上还挂着一块巨大的布告板，上面贴满泛黄的图纸和便签。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_workshop"] = {
    desc: `底层是一个半地下的工坊，墙壁上挂满了各种钟表工具：螺丝刀、齿轮夹、油壶、小锤子，还有一个巨大的工作台，台上散落着零件和一本翻开的维修手册。角落里有一个铁皮柜，柜门半开，里面放着几个木箱。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_manual"] = {
    desc: `维修手册已经泛黄，书页边缘被油渍浸透。你翻到夹着书签的一页，上面用红笔画着钟楼的内部结构图，旁边写着详细的笔记：
“11:55 故障记录：分针卡滞，疑似擒纵轮磨损。尝试更换备用擒纵轮（编号A-7），存放在二楼零件箱。调整后需重新校准时间：将分针拨至12点位置，同时拉动计时拉杆三秒，待钟声响起即完成。”
“警告：未经校准强行拨动指针，将触发安全装置——高压电流会通过指针传导。务必先断开主电源！主电源开关在底层配电箱，红色手柄。”
你合上手册，记下了关键信息。手册的最后一页还夹着一张褪色的照片：一个老人站在钟楼前，笑容温和，照片背面写着“阿斯特·克劳利，1952年”。
获得线索：维修手册笔记
获得线索：配电箱位置`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_parts"] = {
    desc: `工作台上散落着各种齿轮、弹簧和螺丝。你注意到其中有一个齿轮的齿有明显磨损，旁边放着一个崭新的齿轮，标签上写着“擒纵轮，备用”。你拿起备用齿轮，觉得它可能有用。
获得：备用擒纵轮`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_cabinet"] = {
    desc: `铁皮柜里放着几个木箱，你打开最大的一个，里面是一套精致的钟表匠工具：放大镜、镊子、小扳手，还有一小瓶润滑油。另一个箱子里有一本《钟表机构原理》，翻到其中一页，夹着一张手绘的钟楼齿轮传动图，图上标注了几个关键节点的编号。你注意到传动图上有一个地方用红圈标出，旁边写着：“若擒纵轮损坏，此处会发出异响。”
获得：钟表匠工具
获得：齿轮传动图`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_midfloor"] = {
    desc: `第二层是一个半圆形平台，设有三个拱形观察窗，可以俯瞰庄园的庭院、花园和远处的山谷。每个窗户旁都有一个望远镜架，但镜片已经模糊。墙上挂着一块布告板，上面钉着几份泛黄的观测记录和一张星图。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_observations"] = {
    desc: `观测记录是手写的，日期从1950年到1955年不等，记录着每晚的天象：月相、行星位置、流星等。其中一页被折角，上面写着：“1953年7月15日，月升时间21:47，与钟楼时间校准一致。”另一页则写着：“月升之时，秒针低语。将时间调至月升时刻，钟声将指引方向。”
获得线索：月升时间的重要性`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_starchart"] = {
    desc: `星图上标注着北半球的星座，但有几处被红笔修改过。你发现北斗七星被圈了出来，旁边写着“7”。还有一张小纸条夹在星图里：“钟楼的秘密不在星辰，而在月亮的轨迹。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_window_mechanism"] = {
    desc: `你检查窗户边缘，发现每个窗户的铰链处都有一个微小的刻度盘，可以旋转。刻度盘上标有0到360的数字，但没有任何说明。你尝试旋转其中一个，窗户没有变化，但远处传来轻微的机械声。或许它们与钟楼的校准有关？
获得线索：窗户刻度盘`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_record_scales"] = {
    desc: `你记录下三个窗户的当前刻度：东窗125°，南窗270°，西窗45°。但这些数字目前没有意义，或许需要结合其他线索。
获得：窗户刻度数值`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_top"] = {
    desc: `第三层是钟楼的核心。巨大的钟盘占据了整面墙，透过玻璃可以看到背后的齿轮组。钟盘下方是一个黄铜操作台，上面有：
三个拉杆（分别标有“时”、“分”、“秒”）
两个旋钮（“快调”、“微调”）
一个小型仪表盘，指针指向一个红色区域，旁边写着“电压”
一个钥匙孔，形状特殊
一个圆形凹槽，大小与之前获得的星盘钥匙（铜质圆盘）相似？
钟盘的分针仍在微微颤抖，偶尔发出“咔咔”的摩擦声。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_control_panel"] = {
    desc: `你仔细检查操作台。仪表盘上的电压指针在红色区域，说明电路处于通电状态。拉杆都被锁住了，无法拉动。旋钮可以转动，但转动时只有仪表盘指针会轻微晃动。钥匙孔的形状是七边形，中间有一个小孔，或许需要特定的钥匙。圆形凹槽直径约8厘米，与之前获得的铜质圆盘（星盘钥匙）大小吻合。你试着将圆盘放入凹槽，它完美嵌入，但没有任何反应，或许需要先断电？`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_turn_disk"] = {
    desc: `你转动铜质圆盘，操作台内部传来齿轮啮合的声音，仪表盘指针微微跳动，但拉杆依然锁死。你注意到圆盘上的星星图案与操作台上一个隐藏的刻度对应，当你将指针指向某个特定星座时，一个抽屉弹出，里面是一本小册子《克劳利天文笔记》，记载了月相与钟楼校准的详细方法。
获得：克劳利天文笔记`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_read_astro_notes"] = {
    desc: `笔记中写道：“钟楼的校准依赖于月亮的准确位置。每月十五，月升时刻与钟楼时间同步，此时断开电源，将分针拨至12，秒针归零，然后重新通电，钟声会响起。但若擒纵轮磨损，需先更换。” 笔记中还附有一张表格，记录了不同日期月升时刻的计算公式。
获得：月升时刻校准法`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_powerbox"] = {
    desc: `你根据维修手册的提示，在底层找到了配电箱（实际上在工坊角落）。配电箱有一个红色手柄，旁边贴着警示标签：“断电前请确保所有拉杆在初始位置。” 你检查了操作台，拉杆都锁死在初始位置，应该没问题。你拉下红色手柄，钟楼内所有的灯光熄灭，齿轮的轰鸣声逐渐停止，只有钟盘上的夜光指针还在微弱发光。仪表盘上的电压指针归零。
状态：钟楼断电`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_replace_escapement"] = {
    desc: `你根据齿轮传动图找到擒纵轮的位置——在钟盘背后一个可拆卸的盖板后面。你用钟表匠工具打开盖板，小心地取下磨损的擒纵轮，换上备用件。更换后，你转动了几下齿轮，感觉顺畅多了。
状态：擒纵轮已更换`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_adjust_safe"] = {
    desc: `在断电状态下，你可以安全地拨动指针。你走到钟盘前，用手轻轻推动分针。分针可以顺畅移动。你需要将时间调整到某个特定时刻。根据你收集的线索：
维修手册说：将分针拨至12点位置，拉动计时拉杆三秒。
观测记录说：月升之时，秒针低语，将时间调至月升时刻。
天文笔记说：每月十五，月升时刻与钟楼时间同步。
你需要确定当前是什么日子？你可以查看钟楼内是否有日历，或者从观测记录中推断。布告板上或许有线索。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_bulletin"] = {
    desc: `布告板上贴满了图纸、便签和一张褪色的日历。日历翻到1955年7月15日，上面用红笔画了一个圈，旁边写着“月圆之夜，校准仪式”。你注意到今天的日期（游戏中的时间）是否与这个日期有关？游戏设定是午夜，但具体日期未明确。你可以设计一个简单的月相计算或直接给出月升时间：根据观测记录，7月15日月升时间为21:47。但游戏中的时间是午夜，所以可能需要将时间调到21:47？但指针在11:55，直接拨动似乎不合理。另一种解释：钟楼的时间本身就是错误的，需要校准到正确的真实时间（月升时刻）。但月升时刻是21:47，而钟表显示11:55，差了近10小时？这需要调整时钟到21:47？但钟表只有12小时制，所以可能是将时针指向9，分针指向47？但罗马数字盘上只有12个刻度，分针需要精确到分钟。
实际上，可以让玩家将指针调到“月升”对应的位置，而不是具体时间数字。钟盘上或许有特殊标记。你仔细看钟盘，发现罗马数字XII（12）的位置有一个微小的月牙标记，XI（11）的位置有一个星星标记。或许月升时刻对应某个特殊位置？根据观测记录，月升时间是21:47，即晚上9:47，时针在9-10之间，分针在47分。但钟盘上没有分钟刻度，只有小时刻度。所以调整到分针指向47分的位置需要精确。
为了简化，可以设计为：钟盘周围有一圈隐秘的刻度，只有靠近才能看到。你用手触摸钟盘边缘，发现确实有60个微小凹痕，对应分钟。你找到了47分的位置。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_set_moonrise_detailed"] = {
    desc: `你小心地将时针和分针调整到21:47的位置。当你完成时，钟盘后传来一声清脆的“咔哒”，似乎内部有机构复位。然后你按照维修手册的指示，拉动计时拉杆（断电状态下拉杆可以拉动）。你拉动拉杆三秒，然后松开。一切安静。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_power_on"] = {
    desc: `你返回底层，将配电箱的红色手柄推回原位。钟楼重新通电，灯光亮起，齿轮开始转动。你快步返回顶层。钟盘上的指针开始移动，缓慢地走向12点位置。当分针与时针在12点重合时，钟楼的大钟突然敲响，震耳欲聋的钟声回荡在庄园上空。钟声持续了七下。随着最后一声钟响，钟盘后的暗门缓缓打开，露出一个暗格。
暗格中放着一枚红宝石徽章和一块机械齿轮。齿轮上刻着“音乐室专用”。
获得：红宝石徽章（2/7）
获得：机械齿轮`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_adjust_unsafe"] = {
    desc: `如果玩家没有断电就直接尝试拨动指针，会触发电流陷阱。但我们在主线中已设计了维修手册提示，玩家如果忽略，可以选择强行调整。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_electrocution"] = {
    desc: `你握住分针，一股强大的电流从金属传递到你的手臂！你被弹开，摔下楼梯，幸好抓住了栏杆才没有重伤。但钟楼内警报大作，你被迫逃离，暂时无法再进入。手臂被烧伤，需要处理。
状态：烧伤，钟楼暂时封锁`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_trap_lever"] = {
    desc: `你拉动拉杆，操作台突然弹出数根铁针，扎入你的手掌。鲜血直流，你痛得松手，但拉杆已经触发了一个机关，大量沙土从天花板倾泻而下，你险些被活埋。你挣扎着逃出钟楼。
状态：重伤，钟楼暂时无法进入`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_stopped_clock"] = {
    desc: `在工坊角落里有一个老式座钟，指针停在21:47，旁边有一张纸条：“最后的校准时刻”。玩家可以将这个时间作为目标。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_secret_compartment"] = {
    desc: `在钟楼第二层，有一块地砖感觉松动。你撬开地砖，下面是一个小暗格，里面放着一把七边形钥匙。钥匙柄上刻着“操作台”。这可以用于解锁操作台上的钥匙孔，或许能获得额外的校准信息。
获得：七边形钥匙`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_use_key"] = {
    desc: `你将钥匙插入操作台的钥匙孔，转动后，操作台侧面打开一个小抽屉，里面是一本《校准日志》，详细记录了历次校准的日期和时间，以及对应的月相。日志最后一页写着：“1955年7月15日，月圆，21:47，校准成功。” 这确认了目标时间。
获得：校准日志
陷阱与死亡结局（可选）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_gear_crush"] = {
    desc: `如果在更换擒纵轮时操作失误，齿轮突然转动，手指被卷入齿轮组，造成严重伤害甚至死亡。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_fall"] = {
    desc: `在爬楼梯时，如果之前触发过陷阱导致楼梯损坏，可能会失足坠落。
完成后的离开`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（返回大厅）
以上为钟楼之谜的完整扩展，包含多种分支路径：通过维修手册和工具正确解谜，通过观测记录和天文笔记解谜，通过隐藏钥匙和日志解谜，以及失败陷阱。总文本量约5000字。确保与主线连贯，且道具（机械齿轮）可用于后续音乐室谜题。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/谜题-钟楼2.txt 场景 ---
scenes["clocktower_entry"] = {
    desc: `钟楼位于庄园东侧，是一座独立的石制塔楼，与主建筑通过一条封闭的玻璃廊桥相连。推开厚重的橡木门，一股夹杂着机油和铁锈的气味扑面而来。螺旋石梯盘旋而上，石阶被岁月磨得光滑。巨大的机械钟占据了三层楼的高度，齿轮、摆锤、擒纵轮在幽暗中隐约可见，发出有节奏的轰鸣。
钟盘位于塔楼第三层，直径足有两米，指针停留在11:55，分针微微颤抖，仿佛被什么卡住。钟盘下方有一扇小门，门上刻着一行拉丁文：“Tempus edax rerum”（时间吞噬万物）。
墙面和楼梯扶手上随处可见齿轮图案和钟表零件装饰。二层平台处有一张工作台，散落着各种钟表修理工具和一叠泛黄的图纸。三层钟盘旁有一个观察窗，可以俯瞰庄园全貌。
管家曾提醒过你：“钟楼的谜题与时间有关，但强行拨动指针可能触发致命的机关。”`,
    options: [
        { text: "登上螺旋楼梯，前往二层工作台", target: "clocktower_workbench" },
        { text: "直接上三层，检查钟盘", target: "clocktower_clockface" },
        { text: "观察钟摆后的空间", target: "clocktower_pendulum" },
        { text: "先查看廊桥入口处的铭牌", target: "clocktower_plaque" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_workbench"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("钟楼维护日志（部分）")) {
            gameState.clues.push("钟楼维护日志（部分）");
            msg += `<div class="system-message">【获得线索】：钟楼维护日志（部分）</div>`;
        }
        if(!hasClue("齿轮传动图纸")) {
            gameState.clues.push("齿轮传动图纸");
            msg += `<div class="system-message">【获得线索】：齿轮传动图纸</div>`;
        }
        return msg;
    },
    desc: `工作台布满灰尘，但工具摆放整齐：螺丝刀、镊子、放大镜、一小瓶润滑油，还有一个打开的工具箱。台面上摊着一张机械图纸，上面画着钟楼的内部结构，标注着齿轮编号和传动路线。图纸一角有手写注释：“第三级传动轮偏移2度，导致分针卡滞。需在月升时校准，否则触发防护机关。”
图纸旁有一本皮质封面的《钟楼维护日志》，最近一条记录日期是二十年前：“主人在此设置考验。欲解谜者，需使钟鸣七声，且每声间隔相等。调整之法，见齿轮室。”
你翻看日志，发现中间几页被撕掉了，只留下一些残句：“…分针与时针重合于12…”“…听指针的低语…”“…切勿在子时前触碰…”`,
    options: [
        { text: "根据图纸寻找齿轮室", target: "clocktower_gear_room" },
        { text: "检查工作台上的工具", target: "clocktower_tools" },
        { text: "继续上三层", target: "clocktower_clockface" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_tools"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("齿轮钥匙（VII号）")) {
            gameState.items.push("齿轮钥匙（VII号）");
            msg += `<div class="system-message">【获得物品】：齿轮钥匙（VII号）</div>`;
        }
        return msg;
    },
    desc: `你仔细检查工具。放大镜的镜片有轻微的裂痕，但还能用。润滑油瓶几乎空了，底部残留少许深色油液。工具箱底层有一把造型奇特的钥匙，钥匙柄是一个齿轮形状，上面刻着编号“VII”。你把钥匙收好。`,
    options: [
        { text: "继续探索", target: "clocktower_workbench" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_gear_room"] = {
    desc: `根据图纸，齿轮室位于二层与三层之间的夹层，入口是一扇伪装成石墙的暗门，需要用齿轮钥匙打开。你找到暗门，将VII号钥匙插入锁孔，轻轻旋转。门后是一条狭窄的通道，通向一个圆形小室。
齿轮室中央是一个复杂的齿轮组，大小不一的齿轮互相咬合，从地板延伸到天花板。墙壁上有七个齿轮轴端，每个轴端都有一个编号（I至VII）和一个可以插入手柄的方孔。图纸显示，通过旋转这些轴端可以调整传动比，从而改变钟声的间隔。
齿轮室的地板上刻着一行字：“七声钟鸣，间隔相等。如心律之搏动，如潮汐之涨落。”
你发现齿轮组中，I至VI号齿轮都可以转动，但VII号齿轮的轴端是空的——你手中的钥匙正是用来转动它的？实际上，钥匙已经用来开门，现在你需要一个手柄来转动轴端。工作台上的工具箱里或许有。`,
    options: [
        { text: "返回工作台寻找手柄", target: "clocktower_find_handle" },
        { text: "尝试直接用手转动轴端", target: "clocktower_turn_by_hand" },
        { text: "检查齿轮组是否有其他线索", target: "clocktower_gear_clues" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_find_handle"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("摇柄")) {
            gameState.items.push("摇柄");
            msg += `<div class="system-message">【获得物品】：摇柄</div>`;
        }
        return msg;
    },
    desc: `你回到工作台，在工具箱底层找到一根可拆卸的摇柄，正好可以插入齿轮轴端的方孔。`,
    options: [
        { text: "返回齿轮室", target: "clocktower_gear_room_2" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_turn_by_hand"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("受伤，铁栅栏封锁（需要另寻出路）")) {
            setFlag("受伤，铁栅栏封锁（需要另寻出路）", true);
            msg += `<div class="system-message">【状态】：受伤，铁栅栏封锁（需要另寻出路）</div>`;
        }
        return msg;
    },
    desc: `你试图用手转动VII号轴端，但齿轮阻力极大，你的手指被齿轮咬合处夹伤，鲜血直流。你赶紧抽手，但齿轮已经偏移，整个传动系统发出刺耳的噪音，钟楼剧烈震动。你意识到可能触发了机关，急忙退出齿轮室。回到二层时，发现通往三层的楼梯已经降下一道铁栅栏，将你困在二层。`,
    options: [
        { text: "寻找其他出口", target: "clocktower_escape" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_gear_room_2"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("需要校准七个齿轮的转动量，使钟声间隔相等")) {
            gameState.clues.push("需要校准七个齿轮的转动量，使钟声间隔相等");
            msg += `<div class="system-message">【获得线索】：需要校准七个齿轮的转动量，使钟声间隔相等</div>`;
        }
        return msg;
    },
    desc: `你将摇柄插入VII号轴端，顺时针旋转。齿轮缓缓转动，发出沉重的机械声。每转一圈，钟楼某处就传来一声低沉的钟鸣。你数着圈数，当转到第七圈时，钟鸣连续响了七声，但间隔并不相等——有的间隔长，有的短。
你意识到需要调整每个齿轮的转动量，使七声钟鸣的时间间隔完全相等。图纸上标注了每个齿轮对应的传动比，但你需要找到一个参考时间。日志中提到“听指针的低语”——或许需要观察钟盘指针的移动。`,
    options: [
        { text: "去三层观察钟盘指针的移动", target: "clocktower_observe_hands" },
        { text: "在齿轮室寻找校准标准", target: "clocktower_calibration" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_observe_hands"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("指针低语模式（七组节奏）")) {
            gameState.clues.push("指针低语模式（七组节奏）");
            msg += `<div class="system-message">【获得线索】：指针低语模式（七组节奏）</div>`;
        }
        return msg;
    },
    desc: `你来到三层，站在巨大的钟盘前。分针仍然卡在11:55的位置，秒针在12的位置微微颤动。你注意到钟盘外圈有一圈细小的刻度，每两个数字之间有五格，代表分钟。当秒针跳动时，分针几乎不动。
你想起日志中的提示：“听指针的低语”。你贴近钟盘，听到指针内部有细微的咔哒声，像是某种编码。你仔细分辨，发现秒针每跳一下，咔哒声的间隔并不恒定——有时快，有时慢。你拿出侦探笔记，记录下声音模式：
- 第一分钟：长-短-短-长-短
- 第二分钟：短-长-短-长-长
- 第三分钟：……（如此重复）
你意识到这可能是摩尔斯电码。你尝试翻译第一段：“-.. .- - .-”（DATA），第二段：“.-.. .. -- .”（LIME），第三段：“... --- .. .-..”（SOIL）——数据？石灰？土壤？似乎没有意义。你继续记录，发现一共有七组，每组对应一分钟。第七组是：“- .. -- .”（TIME）。
你恍然大悟：这七组摩尔斯电码对应七个齿轮的调整值！每组代表一个数字（摩尔斯电码中的数字有标准表示法）。但刚才翻译的是字母，可能你需要的是数字。再仔细听，其实声音模式更像是数字摩尔斯：
第一组：“-....” = 6
第二组：“.--.” 这不对，数字摩尔斯没有这种。也许不是标准摩尔斯，而是某种自定义编码。你决定先记下所有七组声音的节奏模式，待会儿在齿轮室对照。`,
    options: [
        { text: "返回齿轮室，尝试匹配节奏", target: "clocktower_match_rhythm" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_match_rhythm"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("红宝石徽章（2/7）")) {
            gameState.items.push("红宝石徽章（2/7）");
            gameState.medals.push("红宝石徽章（2/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：红宝石徽章（2/7）</div>`;
        }
        if(!hasItem("便条（内容：“齿轮钥匙可开启更多秘密。VII号门后")) {
            gameState.items.push("便条（内容：“齿轮钥匙可开启更多秘密。VII号门后");
            gameState.items.push("有通往画室的密道。”）");
            msg += `<div class="system-message">【获得物品】：便条（内容：“齿轮钥匙可开启更多秘密。VII号门后，有通往画室的密道。”）</div>`;
        }
        return msg;
    },
    desc: `你回到齿轮室，根据记录的七组节奏，用摇柄依次转动I至VII号轴端，使每组齿轮转动的圈数或角度与节奏的“长-短”模式对应。你设定：长代表转一圈，短代表转半圈。按此调整后，你拉动钟绳，钟声连续响起，间隔完全相等——每一响之间恰好间隔七秒。
随着最后一声钟鸣，钟楼内响起一阵齿轮咬合的声音，钟盘上的分针终于开始移动，指向12。钟盘下方的小门自动打开，露出一枚红宝石徽章和一张泛黄的便条。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "探索VII号门", target: "clocktower_door_vii" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_door_vii"] = {
    desc: `你拿着齿轮钥匙，在钟楼内寻找“VII号门”。最终在二层楼梯拐角处发现一扇与墙壁融为一体的铁门，门上有罗马数字VII。插入钥匙，门开后是一条狭窄的通道，尽头是一扇通往画室的暗门。你打开暗门，发现自己站在画室的书架后面。
（这为画室谜题提供了捷径，但不会直接获得画室徽章。）`,
    options: [
        { text: "进入画室", target: "studio_entry" },
        { text: "返回钟楼", target: "clocktower_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_clockface"] = {
    desc: `你站在三层，仰头观察巨大的钟盘。指针停在11:55，分针有轻微颤动。钟盘玻璃上有一道细小的裂纹，裂纹的形状像一条蛇。钟盘外圈的数字是罗马数字，但IV被写成了IIII（常见于古老钟表）。数字下方有微小的孔洞，可能是用于固定指针的螺丝。
钟盘中央有一个小盖板，可以打开，里面是机芯。你打开盖板，看到复杂的齿轮系，但最显眼的是分针轴心处有一个小杠杆，似乎可以拨动。杠杆旁边刻着：“勿于子时前动此杆。”
你看了看怀表，现在是晚上十一点（23:00），距离子时（午夜）还有一个小时。`,
    options: [
        { text: "等待到子时再拨动杠杆", target: "clocktower_lever_midnight" },
        { text: "现在强行拨动杠杆", target: "clocktower_lever_early" },
        { text: "检查钟盘背后的空间", target: "clocktower_behind_clock" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_lever_midnight"] = {
    desc: `你耐心等待。当怀表指针指向12点整，子时来临。你拨动杠杆，只听“咔”一声，分针开始缓缓移动，经过12、1、2……一直走到11:55的位置停下。钟声没有响起，但钟盘下方的小门开了。你走进去，发现里面是一个小房间，房间中央的石台上放着一枚红宝石徽章，但周围布满细线，细线连接着墙壁上的箭头——显然有陷阱。`,
    options: [
        { text: "尝试绕过细线取徽章", target: "clocktower_trap_room" },
        { text: "先检查房间四周", target: "clocktower_trap_inspect" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_trap_room"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("受伤（但获得徽章）")) {
            setFlag("受伤（但获得徽章）", true);
            msg += `<div class="system-message">【状态】：受伤（但获得徽章）</div>`;
        }
        if(!hasItem("红宝石徽章（2/7）")) {
            gameState.items.push("红宝石徽章（2/7）");
            gameState.medals.push("红宝石徽章（2/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：红宝石徽章（2/7）</div>`;
        }
        return msg;
    },
    desc: `你小心翼翼地在细线间穿行。这些线几乎透明，在昏暗的光线中很难看清。你跨过一根，低头避开另一根，但脚下一滑，碰断了一根线。墙壁上的箭矢瞬间射出，你勉强躲过，但另一根箭射中了你的肩膀。你忍痛取出箭，简单包扎，然后取走徽章，退出房间。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_trap_inspect"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("红宝石徽章（2/7）")) {
            gameState.items.push("红宝石徽章（2/7）");
            gameState.medals.push("红宝石徽章（2/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：红宝石徽章（2/7）</div>`;
        }
        return msg;
    },
    desc: `你仔细检查房间，发现细线连接的不是箭矢，而是一些铃铛。原来这是一个警报系统，而非致命陷阱。你轻轻解开细线，没有触发警报，顺利拿到徽章。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_lever_early"] = {
    desc: `你不顾警告，强行拨动杠杆。分针突然快速旋转，整个钟楼发出震耳欲聋的轰鸣，齿轮疯狂转动，摆锤猛烈摆动。你被摆锤击中，从三层摔落到二层，头破血流，当场昏迷。等你醒来，发现自己躺在庄园外的草地上，管家站在一旁：“你违反了时间的规则，被钟楼驱逐了。若想再试，需等下一个子夜。”
（游戏未结束，但钟楼暂时无法进入，需要等待游戏内时间流逝。你可以先去其他房间。）`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_pendulum"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("钟楼结构图")) {
            gameState.items.push("钟楼结构图");
            msg += `<div class="system-message">【获得物品】：钟楼结构图</div>`;
        }
        return msg;
    },
    desc: `钟摆悬挂在塔楼中央，从三层一直垂到一层，巨大的金属摆锤表面刻满了纹路。你绕到钟摆背面，发现摆锤的背面有一个凹槽，形状与齿轮钥匙（VII号）相似。你将钥匙插入，轻轻转动，摆锤内部发出咔哒声，摆锤侧面弹开一个小门，里面是一个暗格，放着一卷羊皮纸。
羊皮纸上画着钟楼的侧视图，标注了每个楼层的秘密房间，并特别指出：“齿轮室VII号轴调整正确后，可开启钟楼顶部的天文望远镜，观察星象以解画室之谜。”`,
    options: [
        { text: "继续探索", target: "clocktower_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_plaque"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("月相观察窗")) {
            gameState.clues.push("月相观察窗");
            msg += `<div class="system-message">【获得线索】：月相观察窗</div>`;
        }
        return msg;
    },
    desc: `廊桥入口处有一块铜质铭牌，上面写着：“此钟楼建于1865年，由著名钟表匠赫雷米亚斯·克劳利设计。其子阿斯特·克劳利在此设置七谜之一。欲破此谜，须知时间并非直线，而是循环之圆。”
铭牌下方有一个小的金属旋钮，旋钮上刻着“月相”。你转动旋钮，发现它可以调节到一个观察窗，透过观察窗可以看到月亮。当前月亮接近满月。`,
    options: [
        { text: "尝试调节月相至满月", target: "clocktower_full_moon" },
        { text: "继续探索", target: "clocktower_entry" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_full_moon"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("秒针阴影提示")) {
            gameState.clues.push("秒针阴影提示");
            msg += `<div class="system-message">【获得线索】：秒针阴影提示</div>`;
        }
        return msg;
    },
    desc: `你将月相旋钮调到满月位置，钟楼内部传来一声轻响，一束月光通过棱镜折射，照在二层工作台的图纸上，显现出之前看不见的隐藏文字：“月升之时，秒针的阴影会指向正确的齿轮调整值。”`,
    options: [
        { text: "等待月升，观察秒针阴影", target: "clocktower_shadow" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_shadow"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("齿轮调整顺序（6-3-1-7-4-2-5）")) {
            gameState.clues.push("齿轮调整顺序（6-3-1-7-4-2-5）");
            msg += `<div class="system-message">【获得线索】：齿轮调整顺序（6-3-1-7-4-2-5）</div>`;
        }
        return msg;
    },
    desc: `午夜时分，月亮升至中天，月光透过钟盘玻璃上的裂纹，在钟楼地板上投下秒针的阴影。阴影指向地面上的一个数字刻度盘，刻度盘上标有1至7。秒针阴影每跳动一次，指向的数字就变化一次，依次指向：6, 3, 1, 7, 4, 2, 5。你记下这个顺序。`,
    options: [
        { text: "去齿轮室按此顺序调整齿轮", target: "clocktower_shadow_solution" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_shadow_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("红宝石徽章（2/7）")) {
            gameState.items.push("红宝石徽章（2/7）");
            gameState.medals.push("红宝石徽章（2/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：红宝石徽章（2/7）</div>`;
        }
        return msg;
    },
    desc: `你回到齿轮室，按照秒针阴影指示的顺序（6,3,1,7,4,2,5）依次转动对应编号的齿轮轴端，每个转动一圈。完成后，钟声自动响起，间隔相等，钟门开启，获得红宝石徽章。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_calibration"] = {
    desc: `如果你没有获得指针低语或月相阴影的线索，也可以尝试通过逻辑推理校准齿轮。齿轮室墙壁上有一幅星图，标注了七颗行星的位置，每颗行星旁边有一个数字，代表它们的公转周期比（简化版）。你需要将这些比例转化为齿轮转动圈数，使七声钟鸣的间隔等于某个恒定值。
你可以尝试解这个谜题，但若推理错误，可能触发陷阱。`,
    options: [
        { text: "按照行星顺序转动齿轮", target: "clocktower_calibration_fail" },
        { text: "按照行星周期比例转动", target: "clocktower_calibration_success" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_calibration_fail"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("受伤，钟楼暂时无法进入")) {
            setFlag("受伤，钟楼暂时无法进入", true);
            msg += `<div class="system-message">【状态】：受伤，钟楼暂时无法进入</div>`;
        }
        return msg;
    },
    desc: `你按照直觉转动齿轮，钟声响起，但间隔不均，且最后一声钟响时，钟楼内喷出大量蒸汽，你被烫伤，慌忙逃出。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_calibration_success"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("红宝石徽章（2/7）")) {
            gameState.items.push("红宝石徽章（2/7）");
            gameState.medals.push("红宝石徽章（2/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：红宝石徽章（2/7）</div>`;
        }
        return msg;
    },
    desc: `你根据行星公转周期的比例（水星:金星:地球:火星:木星:土星:天王星 = 0.24:0.615:1:1.88:11.86:29.46:84.01），将它们简化为整数比，然后按比例转动齿轮。完成后，钟声均匀响起，获得徽章。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_escape"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("失去外套（无实质影响）")) {
            setFlag("失去外套（无实质影响）", true);
            msg += `<div class="system-message">【状态】：失去外套（无实质影响）</div>`;
        }
        return msg;
    },
    desc: `如果你被铁栅栏困在二层，需要寻找出路。二层有一个通风管道，但管道狭窄，需要脱掉外套才能挤进去。你成功爬出，但外套被卡住，你只能舍弃它。出来后是庄园的花园，你绕回大厅。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_death_gear"] = {
    desc: `在齿轮室中，如果你错误地强行转动VII号轴端且没有摇柄，齿轮脱扣，巨大的齿轮飞脱，将你碾压致死。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_death_fall"] = {
    desc: `在拨动杠杆时被摆锤击中摔死。
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall"] = {
    desc: `（返回大厅，钟楼谜题完成）
以上扩展为钟楼之谜提供了丰富的分支、多种解谜路径、线索联动、陷阱机制和失败结局，总文本量约5000字。您可以根据实际需要调整分支深度和选项数量，确保与已有谜题（如图书馆）的线索联动自然衔接。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/支线1.txt 场景 ---
scenes["side_story_1_start"] = {
    desc: `你在大厅等了半小时，管家仍未回来。你决定去寻找他。庄园里你尚未探索的区域还有几处：通往地窖的楼梯、仆人的房间、以及阁楼。你决定先检查管家常去的地方。`,
    options: [
        { text: "前往仆人房间（位于一层走廊尽头）", target: "side_servant_room" },
        { text: "前往地窖（地下室入口旁还有一扇小门）", target: "side_cellar" },
        { text: "前往阁楼（三层尽头的梯子）", target: "side_attic" },
        { text: "先检查管家的起居室（你可能之前没注意，在大厅侧门）", target: "side_butler_quarters" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_butler_quarters"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("旧照片")) {
            gameState.items.push("旧照片");
            msg += `<div class="system-message">【获得物品】：旧照片</div>`;
        }
        if(!hasItem("生锈的钥匙")) {
            gameState.items.push("生锈的钥匙");
            msg += `<div class="system-message">【获得物品】：生锈的钥匙</div>`;
        }
        if(!hasItem("纸条（写有“对不起")) {
            gameState.items.push("纸条（写有“对不起");
            gameState.items.push("哥哥”）");
            msg += `<div class="system-message">【获得物品】：纸条（写有“对不起，哥哥”）</div>`;
        }
        return msg;
    },
    desc: `管家起居室在大厅右侧一扇不起眼的木门后。房间整洁而简朴：一张单人床、一张书桌、一个衣柜、一个壁炉。壁炉里还有余烬，说明管家不久前还在这里。书桌上有一本翻开的账本，记录着庄园的日常开销，但最近几页被撕掉了。抽屉里有一张庄园的旧照片，照片中年轻的管家和一个与你年龄相仿的年轻人并肩而立，背景是谜语馆。照片背面写着：“阿斯特与我，1888年。”
你惊讶地发现，照片中的年轻人正是画室肖像画中的阿斯特·克劳利！而管家奥尔德斯年轻时与现在判若两人——那时的他面带微笑，眼神温暖。
衣柜里除了几件管家制服，还有一件沾着颜料的工作服，口袋里有一把生锈的钥匙和一张纸条：“对不起，哥哥。”`,
    options: [
        { text: "检查壁炉", target: "side_fireplace" },
        { text: "查看床底", target: "side_under_bed" },
        { text: "用钥匙试试地窖的门", target: "side_cellar_key" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_fireplace"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("管家在隐瞒什么")) {
            gameState.clues.push("管家在隐瞒什么");
            msg += `<div class="system-message">【获得线索】：管家在隐瞒什么</div>`;
        }
        return msg;
    },
    desc: `壁炉的余烬中有一块未完全烧毁的纸片。你用火钳夹出，上面写着：“我无法继续隐瞒……他其实……” 其余部分已化为灰烬。纸片的材质与账本相同，很可能是被撕下的账本页。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_under_bed"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("管家与主人的兄弟关系")) {
            gameState.clues.push("管家与主人的兄弟关系");
            msg += `<div class="system-message">【获得线索】：管家与主人的兄弟关系</div>`;
        }
        if(!hasClue("中央密室有隐藏暗格")) {
            gameState.clues.push("中央密室有隐藏暗格");
            msg += `<div class="system-message">【获得线索】：中央密室有隐藏暗格</div>`;
        }
        if(!hasClue("管家在执行主人的遗愿")) {
            gameState.clues.push("管家在执行主人的遗愿");
            msg += `<div class="system-message">【获得线索】：管家在执行主人的遗愿</div>`;
        }
        return msg;
    },
    desc: `床底有一个落满灰尘的皮箱。你拉出来打开，里面是一些旧衣物和几封信。信的收件人都是“奥尔德斯·克劳利”，寄件人署名“阿斯特”。你快速翻阅：
第一封信（日期最早）：“亲爱的弟弟，父亲将庄园留给了我，但我会为你留一个位置。来谜语馆吧，我们可以一起守护家族的秘密。”
第二封信：“你终于来了。我知道你心中仍有怨，但时间会治愈一切。让我们携手，让谜语馆成为智慧的殿堂。”
第三封信（日期最近）：“奥尔德斯，我时日无多。我将遗嘱放在中央密室的暗格里。请在我死后，按照我的计划行事。记住，继承人必须通过七谜考验。若有人失败，便让他离开，不要伤害任何人。这是我对你的最后一个请求。”
最后一封信没有封口，里面是一张地图，标注了中央密室的一个隐藏暗格。地图背面写着：“若你读到此信，说明我已经离开。请替我守护谜语馆，直到真正的继承人出现。你的哥哥，阿斯特。”`,
    options: [
        { text: "继续寻找管家", target: "side_story_1_start" },
        { text: "前往地窖", target: "side_cellar" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cellar"] = {
    desc: `地窖的入口在地下室入口旁，是一扇低矮的木门。你用生锈的钥匙打开锁，门后是一段向下延伸的石阶。空气潮湿阴冷，墙壁上挂着一盏油灯，你点燃后继续下行。
地窖比地下室更深，是一个天然岩洞改造的空间。洞壁上刻着古老的符文，与地下室祭坛上的符文相似。房间中央有一座石棺，石棺盖半开。石棺上刻着“克劳利家族之墓”。你走近，发现石棺里是空的，但内壁上有一行血字：“我在这里等了你七年。”
你后背发凉，突然听见身后有脚步声。你猛地转身，管家奥尔德斯站在阴影中，手中提着一盏灯，面无表情。
“你找到了这里。”他的声音平静如水，“我本以为你会更早发现。”`,
    options: [
        { text: "质问他的身份", target: "side_reveal_1" },
        { text: "询问血字的意思", target: "side_reveal_2" },
        { text: "保持警惕，准备战斗", target: "side_reveal_3" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_reveal_1"] = {
    desc: `“你是阿斯特·克劳利的弟弟。”你亮出旧照片和信件。
管家沉默片刻，缓缓点头：“是的。奥尔德斯·克劳利。哥哥死后，我以管家的身份守护庄园，等待能够通过七谜考验的人。”
“为什么隐瞒？”
“因为我不想让外人知道克劳利家族的秘密。而且……”他顿了顿，“我在等一个能够理解谜语真谛的人，而不是贪图遗产的投机者。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_reveal_2"] = {
    desc: `“这血字是谁写的？”
管家走近石棺，手指轻触血字：“这是我哥哥留下的。他在这里度过了生命最后的日子，将谜语馆的最终秘密刻在石棺内壁。血字是他用指尖蘸着血写的——‘我在这里等了你七年’是对我说的。他在等我来取遗嘱，但我一直不敢面对。”
“为什么？”
“因为遗嘱里写的东西，会改变一切。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_reveal_3"] = {
    desc: `你后退一步，手按在腰间（如果有武器）。管家却只是摇摇头：“我不会伤害你。七年来，我见过太多失败者，也见过几个有潜力的探索者。但你是第一个走到这里的人。”
他叹了口气，从怀中取出一卷羊皮纸：“这是哥哥的遗嘱。真正的遗嘱，不是中央密室里的那封。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_truth"] = {
    desc: `管家展开羊皮纸，在灯光下念出内容：
“我，阿斯特·克劳利，在此立下最后遗嘱。若有人通过七谜考验，他将继承谜语馆的所有财产和谜题收藏。但在此之前，他必须做出选择：是成为谜语馆的主人，还是成为谜语精神的传播者。
若他选择成为主人，他将获得一切物质财富，但必须终身守护谜语馆，不得离开。
若他选择成为传播者，他可以将谜语馆的谜题公之于众，让更多人体验解谜的乐趣，但他将失去物质遗产，只能带走一本我的谜题笔记。
我的弟弟奥尔德斯，将作为见证者，确保选择被忠实执行。
此外，我在中央密室暗格中藏了一封信，信中写有我的真实死因——不是病故，而是我选择结束自己的生命，因为我发现谜语馆变成了禁锢我灵魂的牢笼。我不希望继承人重蹈覆辙。”
管家读完，沉默良久。
“我哥哥是自杀的。”他的声音颤抖，“他在遗嘱中写道，他建造谜语馆的初衷是传播智慧，但后来他发现自己被谜题困住，成了自己创造的迷宫的囚徒。他不希望任何人重复他的悲剧。”
“所以，你一直在等一个能够理解这层含义的人？”
管家点头：“如果你选择成为主人，我将尊重遗嘱，将谜语馆交给你。但我会劝你离开。财富不值得用自由换取。如果你选择传播谜语，我愿意将哥哥的谜题笔记送给你，并帮你将谜语馆的谜题整理出版。”`,
    options: [
        { text: "选择成为主人", target: "side_ending_master" },
        { text: "选择成为传播者", target: "side_ending_spreader" },
        { text: "询问更多关于阿斯特自杀的细节", target: "side_ask_more" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ask_more"] = {
    desc: `“能告诉我更多吗？”
管家缓缓道来：“哥哥年轻时是著名的谜语大师，他的谜题享誉欧洲。但他逐渐沉迷于创造更复杂的谜题，最终将自己困在谜语馆里。他开始害怕外面的世界，害怕与人接触，只与谜题为伴。有一天，他在日记中写道：‘我创造了无数谜题，却解不开自己的心。’ 然后，他走进这间地窖，再也没有出来。”
“我找到他时，他已经在石棺里了。他留了一封信，说这是他最后的谜题——让继承人来选择自己的命运。”
“所以，这个支线的意义是让你明白，谜语馆既是智慧的殿堂，也可能是心灵的牢笼。”`,
    options: [
        { text: "选择成为主人", target: "side_ending_master" },
        { text: "选择成为传播者", target: "side_ending_spreader" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_master"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_butler_completed")) {
            gameState.items.push("side_butler_completed");
            msg += `<div class="system-message">【获得物品】：side_butler_completed</div>`;
        }
        return msg;
    },
    desc: `你沉思片刻，最终说：“我愿意成为谜语馆的主人。这里的一切都太迷人了，我无法放弃。”
管家长叹一声：“如你所愿。”他将一把钥匙交给你，“这是中央密室的钥匙。从今以后，谜语馆就是你的家。但请记住，门可以从里面打开，但你的心可能会被锁住。”
你接过钥匙，感到一种说不清的沉重。管家默默离开，他的背影消失在黑暗中。
多年后，你成了谜语馆的新主人，日复一日地守护着谜题，等待着下一个继承人的到来。偶尔，你会站在窗前，看着外面自由的世界，心中涌起一丝悔意。但门已经关上。
（支线结束。获得特殊结局：谜语馆主人。该结局会影响主线最终密室的选择，如果你在此选择了成为主人，在主线结局中你将无法选择“传播者”路线，只能继承谜语馆。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_spreader"] = {
    desc: `你看着管家：“我想成为传播者。谜语的乐趣在于分享，而不是禁锢。”
管家露出七年来第一个微笑：“哥哥会为你骄傲的。”
他从石棺暗格中取出一本厚厚的笔记：“这是哥哥毕生收集的谜题，加上他自己创作的。足够出版好几本书。另外，中央密室的遗产你可以自由支配，用来出版和传播。”
“那你呢？”
“我……我想离开了。七年来，我从未走出过庄园。我想去看看外面的世界，用哥哥的方式，将谜语带到更多地方。”
你们一同走出地窖。晨光中，你第一次看清管家的脸——他其实并不老，只是被岁月和忧伤磨去了棱角。
（支线结束。获得特殊道具：克劳利谜题笔记。在主线结局中，你将可以解锁“传播者”结局，并得到管家的祝福。）
在主线对话之前，如果你先探索地窖其他地方，会发现更多线索。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cellar_wall"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("克劳利家族的历史")) {
            gameState.clues.push("克劳利家族的历史");
            msg += `<div class="system-message">【获得线索】：克劳利家族的历史</div>`;
        }
        return msg;
    },
    desc: `地窖的墙壁上有几幅壁画，描绘了克劳利家族的起源：第一代家主是一位炼金术士，他在山中发现了蕴含神秘力量的矿石，并用它们建造了谜语馆的基础。壁画中还出现了七个符号，与你见过的七谜徽章一致。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cellar_diary"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("阿斯特的内心独白")) {
            gameState.clues.push("阿斯特的内心独白");
            msg += `<div class="system-message">【获得线索】：阿斯特的内心独白</div>`;
        }
        return msg;
    },
    desc: `在地窖角落的石头缝里，你发现一本被遗忘的日记，封面写着“阿斯特·克劳利，最后的日子”。里面记录了主人最后的心理挣扎，以及对弟弟的愧疚。其中一页写道：“我留给奥尔德斯的选择题：是让继承人成为另一个我，还是打破这个循环？我想他知道答案。”
如果你在触发主线对话前，先收集了所有关于管家的线索（信件、照片、日记），可以解锁额外的对话选项，让管家敞开心扉，讲述他年轻时与哥哥的矛盾。这将影响他对你的信任度，最终在结局时，他会赠送你一件特殊的纪念品——阿斯特的怀表。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_memento"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_butler_completed")) {
            gameState.items.push("side_butler_completed");
            msg += `<div class="system-message">【获得物品】：side_butler_completed</div>`;
        }
        if(!hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）")) {
            gameState.items.push("阿斯特的怀表（可在后续谜题中作为提示道具使用）");
            msg += `<div class="system-message">【获得物品】：阿斯特的怀表（可在后续谜题中作为提示道具使用）</div>`;
        }
        return msg;
    },
    desc: `管家将一只银怀表递给你：“这是哥哥的遗物。他曾说过，时间会证明一切。现在，它属于你了。”
如果你在支线中做出错误选择（例如威胁管家、试图偷窃遗嘱等），管家会对你失望，关闭地窖并将你驱逐出庄园，导致游戏提前结束。
1. 支线完成后，在卧室谜题中，回答“为何建造谜语馆”时，如果你选择了“传播谜语精神”，会获得额外的认可，直接获得彩虹徽章。
2. 在最终密室，你会多出一个选项：“打开匣子，但选择不继承遗产，而是将谜语公之于众。” 这将导向一个特殊的真结局。
3. 怀表可以在钟楼谜题中直接跳过部分解谜（因为怀表时间已校准）。
以上支线一《管家的秘密》总文本量约1万字，包含多个场景、分支、结局和与主线的联动。您可以根据需要调整细节和深度。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/支线2.txt 场景 ---
scenes["side_story_2_start"] = {
    desc: `你站在画室中央，环顾四周。七幅画已完成，但此刻它们似乎有了生命。你走近那幅赤色画（红日），在太阳的光芒中，你隐约看到一个女子的侧脸。橙色画（秋叶）的落叶间，她的裙摆一闪而过。黄色画（麦田）的麦浪里，她的长发随风飘扬。绿色画（森林）的树影间，她的眼眸明亮如星。青色画（湖水）的水面下，她的倒影清晰可见。蓝色画（海洋）的波浪中，她的手臂在划水。紫色画（晚霞）的云层里，她的微笑若隐若现。
七幅画，同一张面孔，七种姿态。
你的手不自觉地抬起，触碰赤色画的表面。画面微微发烫，你的指尖感到一种从未有过的震颤。一个声音在脑海中响起，轻柔却清晰：“他把我画进了每一道光里，却始终画不出我的灵魂。”
你猛地缩手，声音消失了。但你知道，画室里还有未解的秘密。`,
    options: [
        { text: "检查七幅画的背面", target: "side_painting_back" },
        { text: "研究调色板和画笔（是否有残留颜料）", target: "side_palette_clue" },
        { text: "再次观察大肖像画中的镜子", target: "side_mirror_again" },
        { text: "询问管家（若尚未触发管家支线或已完成）", target: "side_ask_butler" },
        { text: "在画室中寻找隐藏的暗格或抽屉", target: "side_hidden_drawer" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_painting_back"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("画背面的女子自述")) {
            gameState.clues.push("画背面的女子自述");
            msg += `<div class="system-message">【获得线索】：画背面的女子自述</div>`;
        }
        if(!hasClue("1890年，紫藤花架")) {
            gameState.clues.push("1890年，紫藤花架");
            msg += `<div class="system-message">【获得线索】：1890年，紫藤花架</div>`;
        }
        return msg;
    },
    desc: `你小心翼翼地将七幅画从墙上取下（它们只是挂着，没有固定）。每幅画的背面都写着一行字，笔迹娟秀，似乎是女子手书：
赤色画背面：“1890年春，他第一次见我，在紫藤花架下。”
橙色画背面：“他说我是他的缪斯，我信了。”
黄色画背面：“他画我的笑，却不知我的心在哭。”
绿色画背面：“我成了画中的囚徒，每一笔都是牢笼。”
青色画背面：“他爱我吗？还是只爱画中的我？”
蓝色画背面：“我试图逃离，却发现自己已经变成了颜料。”
紫色画背面：“最后一幅画完成时，我消失了。他哭了，但已经太迟。”
这些文字让你感到一阵寒意。你重新挂好画，心中有了一个轮廓：一位女模特，被画家过度迷恋，最终在艺术中迷失自我，甚至可能遭遇不测。`,
    options: [
        { text: "前往庄园的紫藤花架（花园角落）", target: "side_wisteria" },
        { text: "继续研究画室其他物品", target: "side_story_2_start" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_wisteria"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("画展目录")) {
            gameState.items.push("画展目录");
            msg += `<div class="system-message">【获得物品】：画展目录</div>`;
        }
        if(!hasItem("艺术奖章")) {
            gameState.items.push("艺术奖章");
            msg += `<div class="system-message">【获得物品】：艺术奖章</div>`;
        }
        return msg;
    },
    desc: `紫藤花架在花园东南角，靠近画室的窗户。如今紫藤早已枯死，只剩下锈蚀的铁架。你拨开枯藤，发现花架下的石板上刻着两行字：“献给伊莲娜，我的光与影。阿斯特·克劳利，1890。”
伊莲娜——这是画中女子的名字。石板周围有被翻动过的痕迹。你搬开石板，下面是一个铁盒，盒子里有一本小册子和一枚铜质奖章。小册子是画展的目录，封面上印着“阿斯特·克劳利个人画展，1890年秋”。目录中列出了七幅画：《晨光》《秋韵》《麦浪》《幽林》《镜湖》《海潮》《暮色》——正是你画室中的那七幅！但目录的备注栏写着：“模特：伊莲娜·韦恩，可惜她在画展前失踪，未能亲眼见到自己的美被永恒定格。”
奖章是某艺术协会颁发的“年度最佳肖像画家”奖，背面刻着阿斯特的名字。`,
    options: [
        { text: "继续寻找伊莲娜的踪迹", target: "side_search_elenor" },
        { text: "将奖章带回画室，也许有机关", target: "side_medal_trigger" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_medal_trigger"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("铜钥匙")) {
            gameState.items.push("铜钥匙");
            msg += `<div class="system-message">【获得物品】：铜钥匙</div>`;
        }
        if(!hasItem("纸条（地窖第七级台阶）")) {
            gameState.items.push("纸条（地窖第七级台阶）");
            msg += `<div class="system-message">【获得物品】：纸条（地窖第七级台阶）</div>`;
        }
        return msg;
    },
    desc: `你将铜质奖章带回画室。奖章的大小与调色板中央的凹陷恰好吻合。你将奖章放入，调色板发出一声轻响，颜料槽里的颜料开始自动搅拌，最终在调色板中央浮现出一幅微型画像——一个年轻女子的面容，与画中一致。画像下方出现一行字：“你找到了我的过去，但你能找到我的现在吗？”
调色板侧面弹出一个抽屉，里面是一把铜钥匙和一张纸条。纸条上写着：“地窖，第七级台阶下。”`,
    options: [
        { text: "前往地窖", target: "side_cellar_steps" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cellar_steps"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("伊莲娜的日记")) {
            gameState.items.push("伊莲娜的日记");
            msg += `<div class="system-message">【获得物品】：伊莲娜的日记</div>`;
        }
        if(!hasItem("银手镯")) {
            gameState.items.push("银手镯");
            msg += `<div class="system-message">【获得物品】：银手镯</div>`;
        }
        return msg;
    },
    desc: `地窖你已经来过（如果触发过管家支线），但这次你专注于台阶。地窖的石阶共有十二级，你从下往上数，第七级台阶的边缘有一条细缝。你用铜钥匙插入，轻轻旋转，台阶表面弹开，露出一个暗格。
暗格里有一本皮革日记，封面烫金：“伊莲娜·韦恩的日记”。还有一只银质手镯，内壁刻着“A.C. to E.W.”（阿斯特·克劳利赠伊莲娜·韦恩）。
你翻开日记，纸张已经泛黄，字迹时而工整时而潦草，记录着一段悲伤的故事。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_read_diary"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("伊莲娜的失踪与阿斯特的悔恨")) {
            gameState.clues.push("伊莲娜的失踪与阿斯特的悔恨");
            msg += `<div class="system-message">【获得线索】：伊莲娜的失踪与阿斯特的悔恨</div>`;
        }
        return msg;
    },
    desc: `你坐在石阶上，借着油灯阅读日记。以下是关键内容：
“3月2日，1890年。今天在艺术沙龙遇见阿斯特·克劳利先生。他是一位天才画家，也是谜语爱好者。他邀请我去他的庄园做客，说那里的光线最适合创作。我答应了。”
“4月15日。他为我画了第一幅肖像，在紫藤花下。他说我是他见过的最美的光。我的心跳得好快。”
“6月。他越来越沉迷于作画，每天要我摆出不同的姿势。他说要画一组七幅画，献给七种光。我累了，但他不肯停。每次我想休息，他就说‘再坚持一下，伊莲娜，这幅画会永垂不朽’。”
“8月。我开始害怕。他看我的眼神变了，不再是看一个人，而是看一件艺术品。他抚摸我的脸颊，说‘这抹红，这个角度，完美’。我感觉自己正在消失，变成画布上的颜料。”
“9月。我试图离开，但他锁了庄园的门。他说画展在即，我不能走。我在夜里哭泣，他把我的眼泪也画进了画里——在青色那幅的湖水中。”
“10月15日。七幅画完成了。他看着它们，喃喃自语：‘还不够，伊莲娜的灵魂我还没有画出来。’ 他看着我，眼神狂热。我害怕极了。”
“10月16日。最后一页。我决定今晚逃走。如果失败，我会躲进地窖的暗格里，那是他带我看过的地方，但他以为我忘了。我要把真相留在这里。阿斯特，我爱你，但我不能成为你的囚徒。再见。”
日记到此结束。最后一页的空白处，有人用另一种笔迹（很可能是阿斯特的）写了几行字：“伊莲娜，你走了，带走了我的光。我找了你七年，画了无数幅画，却再也画不出你眼中的星辰。我错了。我把你画进了每一幅画，却忘了把你留在身边。如果你读到这些，请原谅我。”`,
    options: [
        { text: "检查地窖暗格深处", target: "side_cellar_hidden" },
        { text: "返回画室，用银手镯触发什么", target: "side_bracelet_trigger" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cellar_hidden"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("紫藤花束")) {
            gameState.items.push("紫藤花束");
            gameState.items.push("照片");
            gameState.items.push("画布碎片");
            msg += `<div class="system-message">【获得物品】：紫藤花束、照片、画布碎片</div>`;
        }
        return msg;
    },
    desc: `你仔细检查放置日记的暗格，发现底部还有一层隔板。撬开后，里面是一束干枯的紫藤花，用丝带扎着，旁边有一张褪色的照片——照片中，伊莲娜和阿斯特并肩站在紫藤花架下，两人都年轻而幸福。照片背面写着：“1890年春，我们曾拥有过一切。”
在照片下面，还有一小块画布碎片。碎片上画着一只眼睛，是伊莲娜的眼睛，画得极其传神，仿佛在凝视着你。画布背面有字：“我的灵魂在这里。”
你感到一阵莫名的心酸。你将照片和画布碎片小心收好。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_bracelet_trigger"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("阿斯特的遗信")) {
            gameState.items.push("阿斯特的遗信");
            msg += `<div class="system-message">【获得物品】：阿斯特的遗信</div>`;
        }
        return msg;
    },
    desc: `你回到画室，将银手镯放在调色板中央。手镯与奖章的凹槽不同，这次调色板没有反应。你将手镯靠近七幅画，当靠近紫色画（暮色）时，手镯微微发光。你将手镯贴在紫色画的云层处，画面中的云突然散开，露出一扇门——一扇画在画布上的门，但门把手是真实的金属。
你转动把手，画布像真正的门一样打开，露出后面一个狭窄的空间——画中画！原来这七幅画背后藏着一个密室，入口就在紫色画的后面。
你侧身挤进去，发现里面是一间狭小的工作室，只有一张桌子、一把椅子，和满墙的素描。素描画的都是同一个女人——伊莲娜的各种姿态。桌上有一封未写完的信，是阿斯特的笔迹：
“伊莲娜，如果你看到这封信，说明有人找到了这里。我建造谜语馆，不是为了财富，而是为了纪念你。七谜考验是为了筛选出真正有耐心、有同情心的人，因为只有这样的人，才会发现你的故事。画室的谜题是我最用心的——因为那是关于你的。七色光，七种心情，七幅画。你是我永远的谜题，而我永远解不开。如果你在天有灵，请原谅一个用艺术囚禁爱情的人。”
信的末尾，日期是1897年——阿斯特去世前一年。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_elenor_fate"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("伊莲娜纪念徽章")) {
            gameState.items.push("伊莲娜纪念徽章");
            gameState.medals.push("伊莲娜纪念徽章");
            addMedal();
            msg += `<div class="system-message">【获得物品】：伊莲娜纪念徽章</div>`;
        }
        return msg;
    },
    desc: `你在工作室里继续搜寻。桌子抽屉里有一本小册子，记录了伊莲娜离开庄园后的行踪。阿斯特雇了侦探寻找她，但始终没有找到。最后一页写着：“侦探最后一次报告：伊莲娜·韦恩于1890年11月在伦敦街头因贫病交加去世。她始终没有回到庄园。”
你的眼眶湿润了。两个相爱的人，一个因过度痴迷而失去所爱，一个因恐惧而逃离，最终在孤独中死去。而谜语馆，这座看似辉煌的建筑，竟是一座巨大的哀悼纪念碑。
你将阿斯特的信和伊莲娜的日记放在一起，放在工作室的桌上。突然，室内的蜡烛全部自动点燃，墙壁上所有的素描画中的伊莲娜都露出了微笑。一个轻柔的声音在空气中回荡：“谢谢。我终于被完整地看见了。”
声音消散后，工作室的墙壁上浮现出一行金色的字：“传承他们的故事，让后来者懂得：爱不是占有，而是成全。”
在你站立的桌面上，出现了一枚心形的彩虹色徽章——不是主线中的徽章，而是一枚特殊的纪念徽章，背面刻着“伊莲娜与阿斯特，永存于画中”。`,
    options: [
        { text: "将徽章带回大厅", target: "side_ending_reconciliation" },
        { text: "将徽章留在画室", target: "side_ending_legacy" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_reconciliation"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_painting_completed")) {
            gameState.items.push("side_painting_completed");
            msg += `<div class="system-message">【获得物品】：side_painting_completed</div>`;
        }
        return msg;
    },
    desc: `你将纪念徽章带回大厅，放在壁炉台上。几天后（游戏内时间），你发现管家在徽章旁边放了一束新鲜的紫藤花（他从哪里弄来的？）。他没有说什么，只是默默地点了点头。
从此以后，画室里的七幅画似乎比以前更加明亮了。有时候深夜，你能听到画室里传来轻柔的笑声，像是两个人在对话。你不再害怕，你知道那是阿斯特和伊莲娜终于重逢了。
（支线结束。获得特殊能力：在画室谜题中，你可以直接获得“伊莲娜的祝福”，跳过部分解谜步骤。同时，在主线结局中，你会多出一个选项：“将谜语馆改造成纪念伊莲娜和阿斯特的艺术馆”，这将解锁一个独特的和平结局。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_legacy"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_painting_completed")) {
            gameState.items.push("side_painting_completed");
            msg += `<div class="system-message">【获得物品】：side_painting_completed</div>`;
        }
        return msg;
    },
    desc: `你将纪念徽章留在画室的工作室里，让它永远陪伴着阿斯特的遗信和伊莲娜的日记。你决定将他们的故事写成书，让更多人知道这段悲伤而美丽的往事。
多年后，你的书出版了，名为《画中囚徒》。谜语馆因此闻名，无数人前来参观，不是为了遗产，而是为了感受这段跨越生死的爱情。画室成了最受欢迎的地方，七幅画前总是有人驻足沉思。
管家的身影也出现在了签售会上。他微笑着对你说：“哥哥会为你骄傲的。”
（支线结束。获得特殊结局：作家之路。在主线结局中，你将自动获得“传播者”路线的最佳版本，并得到出版商的资助。）
如果你在支线过程中与管家交谈（尤其是已触发管家支线的情况下），他会告诉你更多关于伊莲娜的事。管家年轻时见过伊莲娜，记得她是个“温柔而敏感的女孩”。他还透露，阿斯特在伊莲娜离开后，将画室的窗户改成了彩色玻璃，将七种颜色对应七种情绪，试图用光来弥补失去的色彩。
对话选项：
- 询问管家是否知道伊莲娜的死讯 [前往 side_butler_knows]
- 询问阿斯特最后的时光 [前往 side_butler_last_days]
这些对话会加深支线的情感深度，并提供额外的线索（如彩色玻璃窗的象征意义）。
如果你在支线中做出不当行为（例如损毁画作、试图将纪念品占为己有而不传播故事），画室中的声音会变成愤怒的诅咒，你被一股力量推出画室，再也无法进入。同时，你会失去画室谜题的奖励，徽章也会消失，导致主线无法完成。
1. 完成此支线后，在画室谜题中，你可以直接获得“伊莲娜的祝福”，无需进行复杂的颜料混合和光线调节，只需将银手镯放在调色板上即可完成谜题。
2. 在卧室谜题中，当你回答“为何建造谜语馆”时，如果你提到“为了纪念伊莲娜”，主人会特别感动，直接认可你的答案。
3. 在最终密室的抉择中，如果你选择将谜语馆改造成艺术纪念馆，会解锁一个独特结局。
4. 纪念徽章可以作为特殊道具，在后续谜题中用于安抚某些不安的灵魂（如果有其他超自然元素）。
如果你在支线完成后再次检查画室的彩色玻璃窗，你会发现每块玻璃的背面都刻着一行小字，合起来是：“伊莲娜，我用七种颜色画你，却画不出你的心跳。请原谅我。”
此外，在钟楼谜题中，如果你使用阿斯特的怀表（来自管家支线）在子时观察，会看到表盘上浮现出伊莲娜的侧影，为你指引正确的齿轮顺序。这体现了支线之间的联动。
以上支线二《画中女子》总文本量约1万字，包含完整的叙事、情感深度、多个场景、分支、结局以及与主线和管家支线的联动。您可以根据需要调整细节，确保情感真实、谜题合理。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/支线3.txt 场景 ---
scenes["side_story_3_start"] = {
    desc: `你决定探索墙壁后面的空间。裂缝太窄无法通过，你需要扩大开口。工具房里有锤子和凿子（若已探索温室），或者你可以从地下室搬来一些工具。你花了半小时，终于将裂缝扩大到足以侧身挤入的大小。
墙后面是一条天然形成的岩缝通道，仅容一人通过。空气中弥漫着潮湿和矿物质的气味，远处有水滴落的声音。你点燃携带的油灯（或用手电筒），小心翼翼地前行。
通道向下倾斜，走了大约十分钟后，你进入一个相对宽敞的洞穴。洞穴中央有一张石桌，桌上放着一盏熄灭的石灯。石桌周围散落着一些工具——地质锤、凿子、测量仪，还有一个破旧的帆布包。帆布包上绣着“T.H.”两个字母。
洞穴的墙壁上有着明显的人工开凿痕迹，还有一些用炭笔写的笔记和数字。你发现墙壁上有一幅用炭笔绘制的庄园剖面图，标注了各个房间的位置，以及——在你脚下的位置——一个更大的空间，标注着“未完成”。`,
    options: [
        { text: "检查石桌和帆布包", target: "side_cave_table" },
        { text: "研究墙壁上的笔记", target: "side_cave_notes" },
        { text: "探索洞穴深处", target: "side_cave_deeper" },
        { text: "返回庄园告知管家", target: "side_tell_butler" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cave_table"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("托马斯·赫胥黎的笔记本")) {
            gameState.items.push("托马斯·赫胥黎的笔记本");
            msg += `<div class="system-message">【获得物品】：托马斯·赫胥黎的笔记本</div>`;
        }
        if(!hasItem("矿石标本（七种金属）")) {
            gameState.items.push("矿石标本（七种金属）");
            msg += `<div class="system-message">【获得物品】：矿石标本（七种金属）</div>`;
        }
        if(!hasItem("未寄出的信")) {
            gameState.items.push("未寄出的信");
            msg += `<div class="system-message">【获得物品】：未寄出的信</div>`;
        }
        if(!hasItem("照片")) {
            gameState.items.push("照片");
            msg += `<div class="system-message">【获得物品】：照片</div>`;
        }
        return msg;
    },
    desc: `帆布包里有一本笔记本、几块矿石标本、一封揉皱的信，和一张褪色的照片。笔记本封面写着“托马斯·赫胥黎，地质考察笔记，1892年”。你翻开笔记本，快速浏览：
“第47天：在庄园下方发现异常的地质结构。这里的岩层有明显的热液活动痕迹，但该地区没有火山活动记录。岩石样本中含有罕见的七种金属元素，且纯度极高。”
“第63天：向克劳利先生报告了发现。他非常感兴趣，邀请我在庄园长期驻留研究。他似乎在寻找什么——某种‘能量源’？他没有明说。”
“第89天：我在地下更深处发现了一个巨大的空洞，洞壁上有古老的壁画，描绘着七颗星辰和一条蛇。这些壁画至少有数千年历史。克劳利先生得知后，变得异常兴奋。他说这就是他一直在寻找的东西。”
“第112天：克劳利先生开始在空洞上方建造地下室和祭坛。他说要将‘古老的力量’纳入谜语馆的设计中。我开始感到不安。这些壁画上的符号与任何已知的文明都不符。”
“第150天：克劳利先生越来越沉迷。他禁止我将发现告诉任何人，甚至开始限制我离开庄园。他说‘谜语馆需要这股力量来完成’。我开始害怕。”
“第178天：我必须离开。但克劳利先生发现了我收拾行李。他……他恳求我留下，说研究即将完成。他的眼神让我害怕——不是愤怒，而是某种狂热。我假装答应，但今晚我会从洞穴的另一条通道逃走。”
笔记本到这里就结束了。最后一页沾着深褐色的斑点——很可能是血迹。照片是一个年轻的地质学家站在岩壁前微笑，照片背面写着“托马斯，1892年春”。那封信是托马斯写给妻子的，但从未寄出：“亲爱的玛格丽特，我可能无法按时回来。这里的发现太过惊人，克劳利先生不愿让我离开。如果我出了什么事，请来找我。”`,
    options: [
        { text: "继续深入洞穴", target: "side_cave_deeper" },
        { text: "研究墙壁笔记", target: "side_cave_notes" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cave_notes"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("托马斯认为塌方可能是人为的")) {
            gameState.clues.push("托马斯认为塌方可能是人为的");
            msg += `<div class="system-message">【获得线索】：托马斯认为塌方可能是人为的</div>`;
        }
        if(!hasClue("通道方向")) {
            gameState.clues.push("通道方向");
            msg += `<div class="system-message">【获得线索】：通道方向</div>`;
        }
        return msg;
    },
    desc: `墙壁上的炭笔笔记记录了地质数据：岩层厚度、矿物成分、温度变化等。但有几条笔记引起了你的注意：
“11月3日：在主空洞发现壁画。符号与克劳利家族的徽记有七处相似。难道是巧合？”
“12月：克劳利先生开始翻译壁画上的符号。他说这些符号记录了‘七曜之力’的召唤方法。”
“1月15日：克劳利先生在地下室建造了祭坛。他说这可以‘引导’地下的能量。我越来越不安。”
“2月：第二条通道塌方了。真的是意外吗？”
“3月：最后一次记录。如果我能出去，一定要报警。但克劳利先生收走了我的地图。”
在笔记的末尾，有一个潦草的箭头指向洞穴深处，旁边写着“通道”。还有一个更小的字：“小心塌方。”`,
    options: [
        { text: "跟随箭头方向", target: "side_cave_passage" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_cave_passage"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("托马斯的地质锤")) {
            gameState.items.push("托马斯的地质锤");
            msg += `<div class="system-message">【获得物品】：托马斯的地质锤</div>`;
        }
        return msg;
    },
    desc: `箭头指向洞穴东侧的一条狭窄通道。你走进去，大约二十米后，通道被一堆碎石堵住。这些碎石显然是从上方落下的，堵住了去路。你仔细观察，发现碎石堆中有一块木板的残片——这不像自然塌方，更像是有人用炸药或工具故意制造的坍塌。
你试图搬开碎石，但石块太大，没有工具很难移动。你在碎石堆边缘发现了一个小缝隙，用手探入，摸到一个金属物体——是一把地质锤，锤柄上刻着“T.H.”。锤子被卡在碎石中，似乎托马斯在塌方时试图用它挖开通道。
你用力拔出锤子，碎石堆轻微松动，但整体仍然稳固。你需要更专业的方法来清理通道。`,
    options: [
        { text: "返回庄园寻找工具（炸药或撬棍）", target: "side_find_tools" },
        { text: "寻找其他路径（洞穴可能有另一条出口）", target: "side_alternate_path" },
        { text: "用地质锤尝试挖掘", target: "side_dig_with_hammer" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_find_tools"] = {
    desc: `你回到庄园，在工具房、地下室、甚至钟楼的工作台寻找可用于清理塌方的工具。最终你找到了几样有用的东西：
- 一根铁撬棍（工具房）
- 一小包黑火药和引信（地下室熔炉旁的柜子里，似乎是克劳利用于“特殊工程”的）
- 一把镐（花园工具棚）
你带着工具返回洞穴。`,
    options: [
        { text: "用撬棍和镐尝试手动清理", target: "side_manual_clear" },
        { text: "使用黑火药爆破", target: "side_dynamite" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_manual_clear"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("体力消耗（后续行动可能受影响）")) {
            setFlag("体力消耗（后续行动可能受影响）", true);
            msg += `<div class="system-message">【状态】：体力消耗（后续行动可能受影响）</div>`;
        }
        return msg;
    },
    desc: `你花了整整两个小时，用撬棍和镐一点点搬开碎石。汗水湿透衣衫，手掌磨出水泡。终于，你在碎石堆中清出一条勉强能挤过去的通道。通道另一侧是另一段岩洞，空气中有一股奇特的气味——像是臭氧和硫磺的混合。
你侧身挤过去，发现这边的洞穴更加开阔。墙壁上开始出现壁画——红色的线条描绘着七颗星辰围绕一个圆盘旋转，圆盘中央有一条衔尾蛇。壁画风格古老而原始，但线条极其精确，像是用某种测量工具绘制的。`,
    options: [
        { text: "继续深入", target: "side_ancient_chamber" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_dynamite"] = {
    on_enter: () => {
        let msg = "";
        if(!getFlag("洞穴不稳定（后续行动需谨慎）")) {
            setFlag("洞穴不稳定（后续行动需谨慎）", true);
            msg += `<div class="system-message">【状态】：洞穴不稳定（后续行动需谨慎）</div>`;
        }
        return msg;
    },
    desc: `你决定使用黑火药。你将火药填入碎石堆的缝隙，安置好引信，退到安全距离，点燃。一声闷响后，碎石被炸开一个大洞，通道畅通了。但爆炸也引起了洞穴的轻微震动，几块小石头从头顶落下。你快速冲过通道，进入另一边。
爆炸的烟尘散去后，你发现这边的洞穴更加开阔，但空气中弥漫着刺鼻的硫磺味。墙壁上有一些新出现的裂缝——爆炸可能损坏了岩壁结构。`,
    options: [
        { text: "快速探索", target: "side_ancient_chamber" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ancient_chamber"] = {
    desc: `你进入一个巨大的天然空洞，穹顶高达十几米，洞壁上布满了壁画和雕刻。洞中央有一根天然石柱，石柱上刻满了符号——与你见过的七谜徽章、地下室符文同源的符号，但更加古老和复杂。石柱底部有一个凹槽，形状与你在图书馆获得的“星盘钥匙”或“符文石”相似。
洞壁上有一幅巨大的壁画，描绘着一个仪式场景：七个人围绕一个祭坛站立，每人手持一种颜色的光球，祭坛中央是一颗旋转的星辰。壁画下方有一段文字，但不是任何你认识的文字。然而，当你凝视时，文字似乎在流动，变换成你能理解的语言：
“当七曜之力汇聚，沉睡者将苏醒。但唤醒者须付出代价——以记忆换力量，以自由换智慧。此乃远古契约，不可违背。”
你感到一阵眩晕。这段文字让你想起托马斯笔记本中的警告——“古老的力量”。`,
    options: [
        { text: "将符文石放入石柱凹槽（若有）", target: "side_activate_pillar", condition: () => hasItem("生命之露") },
        { text: "研究壁画的其他部分", target: "side_study_murals" },
        { text: "寻找托马斯的踪迹（他可能来过这里）", target: "side_thomas_trail" },
        { text: "记录一切后离开", target: "side_leave_cave" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_thomas_trail"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("托马斯的遗信")) {
            gameState.items.push("托马斯的遗信");
            msg += `<div class="system-message">【获得物品】：托马斯的遗信</div>`;
        }
        if(!hasItem("洞穴地图")) {
            gameState.items.push("洞穴地图");
            msg += `<div class="system-message">【获得物品】：洞穴地图</div>`;
        }
        return msg;
    },
    desc: `你在洞壁的一侧发现了一个用石头垒成的简易庇护所，里面有一张毯子、几个空罐头，和一封压在石头下的信。信纸皱巴巴的，字迹潦草：
“如果有人读到这封信——我叫托马斯·赫胥黎，地质学家。我被困在这个洞穴里，出口被克劳利炸毁了。我发现了这里的秘密，他不能让我离开。
壁画记载的是一种古老的‘能量’，据说可以通过七种金属和特定的仪式召唤。克劳利建造谜语馆，不是为了谜题，而是为了掩人耳目地研究这种能量。他疯了，他相信这种能量可以让他获得永生。
我已经三天没有食物了。如果我能找到另一条出路，我会去报警。但如果我死了，请将我的笔记本交给英国地质学会，告诉玛格丽特，我爱她。”
信的背面画了一张简易地图，标注了洞穴的另一个出口——在庄园东侧的悬崖上。但地图上标注“出口已封”的字样。`,
    options: [
        { text: "寻找东侧出口", target: "side_east_exit" },
        { text: "继续研究石柱", target: "side_activate_pillar" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_activate_pillar"] = {
    desc: `你将符文石（从地下室获得）放入石柱的凹槽。石柱开始发出低沉的嗡鸣，表面的符号依次亮起，光芒沿着柱身向上蔓延，最终汇聚到穹顶。穹顶上出现了一幅星图，七颗明亮的星辰以某种规律旋转。
星图下方浮现出一行字：“选择你的道路：求知者，将获得古老的知识，但代价是失去部分记忆。守护者，将获得封印的力量，但必须终身守护此地的秘密。”
这是一个选择。如果你选择“求知者”，你会获得关于这种古老能量的大量知识，但会忘记自己的一部分过去（比如忘记某个谜题的解法，或忘记与某个人的联系）。如果你选择“守护者”，你会获得封印这股能量的能力，但必须承诺终身不离开谜语馆一定范围。`,
    options: [
        { text: "选择成为求知者", target: "side_seeker" },
        { text: "选择成为守护者", target: "side_guardian" },
        { text: "拒绝选择，取出符文石", target: "side_refuse" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_seeker"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("远古知识（所有谜题的解法自动知晓）")) {
            gameState.items.push("远古知识（所有谜题的解法自动知晓）");
            msg += `<div class="system-message">【获得物品】：远古知识（所有谜题的解法自动知晓）</div>`;
        }
        if(!hasItem("星之印记（额头）")) {
            gameState.items.push("星之印记（额头）");
            msg += `<div class="system-message">【获得物品】：星之印记（额头）</div>`;
        }
        return msg;
    },
    desc: `你选择接受古老的知识。石柱的光芒笼罩了你，你的脑海中涌入无数画面、符号和文字——关于远古文明、七曜之力、以及这种能量的运作原理。你感到自己的记忆在翻涌，一些不重要的细节开始模糊：你忘了童年时住过的街道，忘了最喜欢的书的书名，忘了某位故人的面孔。但你也获得了前所未有的洞察力——谜语馆的每一个谜题在你眼中都变得透明，你能看穿它们的结构、原理和隐藏的陷阱。
光芒消散后，你发现自己的额头上出现了一个淡金色的符号——七角星。你可以用手遮住它，但它永远存在。
失去：部分个人记忆（具体由玩家选择或随机）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_guardian"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("守护者符文（可封印古老能量）")) {
            gameState.items.push("守护者符文（可封印古老能量）");
            msg += `<div class="system-message">【获得物品】：守护者符文（可封印古老能量）</div>`;
        }
        if(!hasItem("克劳利家族的认可")) {
            gameState.items.push("克劳利家族的认可");
            msg += `<div class="system-message">【获得物品】：克劳利家族的认可</div>`;
        }
        if(!getFlag("被束缚于谜语馆周边")) {
            setFlag("被束缚于谜语馆周边", true);
            msg += `<div class="system-message">【状态】：被束缚于谜语馆周边</div>`;
        }
        return msg;
    },
    desc: `你选择成为守护者。石柱的光芒变得柔和，在你的双手上留下银色的符文。你感到一股力量流入你的身体，同时一种责任感沉入心底。你知道，从今以后，你有能力封印这地下的古老能量，防止任何人（包括你自己）滥用它。但代价是，你不能离开谜语馆周围十英里范围，否则符文会灼烧你的双手。
管家不知何时出现在你身后（他可能从另一条路跟来了）。他看着你手上的符文，轻声说：“克劳利家族世代守护这个秘密。哥哥建造谜语馆，也是为了保护它不被外人发现。现在，这个责任交给你了。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_refuse"] = {
    desc: `你取出符文石，石柱的光芒熄灭。你不想用记忆或自由交换力量。“有些秘密不该被唤醒。”你说。
洞穴中恢复了寂静。你带着托马斯的遗物和笔记本离开。至少，你可以将他的故事告诉世人。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_east_exit"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("托马斯的骨骸（可安葬）")) {
            gameState.items.push("托马斯的骨骸（可安葬）");
            msg += `<div class="system-message">【获得物品】：托马斯的骨骸（可安葬）</div>`;
        }
        if(!hasItem("身份证明和遗书")) {
            gameState.items.push("身份证明和遗书");
            msg += `<div class="system-message">【获得物品】：身份证明和遗书</div>`;
        }
        return msg;
    },
    desc: `根据托马斯的地图，你找到了洞穴东侧的一条通道。通道很长，逐渐向上倾斜，最终通向一个被碎石和泥土封堵的出口。你用工兵铲（如果带了）挖掘，半小时后，新鲜空气涌入——出口在庄园东侧的悬崖半腰，俯瞰着山谷。
从这里，你可以看到谜语馆的全貌。夕阳下，庄园的七扇窗户反射着金光，像一个沉睡的巨人。
你在出口处发现了一具骨骸，蜷缩在角落里。骨骸旁边有一个皮包，里面是托马斯的身份证明和一封未寄出的信。骨骸的手指紧紧握着一把地质锤（你已经在碎石堆里找到了一把，这是第二把）。看来，托马斯在塌方后找到了另一条路，但出口被封，他最终没能逃出去。
你将骨骸小心收殓，用石块垒了一个简易的坟墓。你决定将托马斯的遗物带给他的后人——如果他们还活着的话。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_seeker"] = {
    desc: `你带着古老的知识回到庄园。每一个谜题对你来说都易如反掌，但你发现自己越来越难以与普通人交流——你看到的世界与别人不同，你能看到墙壁后的能量流动，能看到谜题背后的设计意图，却看不到人心的温度。
管家注意到你的变化，叹了口气：“哥哥也曾经这样。知道得太多的人，往往最孤独。”
你完成了七谜考验，获得了遗产，但你发现那些远古知识正在慢慢侵蚀你的记忆——你开始忘记为什么来到谜语馆，忘记自己的名字，甚至忘记时间。最终，你变成了另一个阿斯特·克劳利——一个被困在自己知识和谜题中的囚徒。
（支线结束。获得特殊状态：全知者。主线将自动走向“囚徒”结局，且无法更改。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_guardian"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_underground_completed")) {
            gameState.items.push("side_underground_completed");
            msg += `<div class="system-message">【获得物品】：side_underground_completed</div>`;
        }
        return msg;
    },
    desc: `你接受了守护者的身份。管家教你如何用符文封印洞穴中的能量，如何定期检查封印是否完好。你成为谜语馆的新守护者，不是主人，而是看门人。
每年，你会接待一些解谜者，让他们尝试七谜考验，但你会悄悄观察他们的动机——如果是为了财富，你会让他们失败；如果是为了智慧，你会暗中帮助他们。你知道，这地下的秘密不能落入错误的人手中。
多年后，你站在庄园的窗前，看着远方。你的手上符文微微发光。你知道自己失去了自由，但获得了一种更深层的安宁。
（支线结束。获得特殊状态：守护者。主线结局中，你将可以选择“守护者”路线，永久守护谜语馆和地下的秘密。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_truth"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_underground_completed")) {
            gameState.items.push("side_underground_completed");
            msg += `<div class="system-message">【获得物品】：side_underground_completed</div>`;
        }
        if(!hasClue("托马斯地质学会正名")) {
            gameState.clues.push("托马斯地质学会正名");
            msg += `<div class="system-message">【获得线索】：托马斯地质学会正名</div>`;
        }
        return msg;
    },
    desc: `你拒绝激活石柱，选择将托马斯的真相公之于众。你将托马斯的遗物交给了英国地质学会，他的故事被写成报道，刊登在伦敦的报纸上。谜语馆地下有远古文明遗迹的消息引起了学术界的轰动。
考古学家和地质学家涌入庄园，你不得不开放谜语馆供研究。七谜考验被暂时关闭，地下室和洞穴被封锁进行科学考察。管家虽然不情愿，但默许了你的决定。
数月后，科学家们宣布，洞穴中的壁画和符号属于一个未知的远古文明，其历史可能超过一万年。但“七曜之力”只是古人对矿物质的崇拜，并无超自然力量。谜语馆因此成为重要的考古遗址，而你成了联系学术圈和庄园的桥梁。
你既没有成为谜语馆的主人，也没有成为守护者，而是成为了一个历史的见证者和传播者。
（支线结束。获得特殊成就：历史的见证者。主线结局中，你将自动获得“传播者”路线的最高评价，并得到学术界资助将谜语馆改造为博物馆。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_disappear"] = {
    desc: `如果你在探索洞穴时选择过于冒险的行动（比如无视警告继续深入、强行使用炸药导致大面积塌方），洞穴可能坍塌，将你永远埋在岩石之下。
多年后，管家会在洞穴入口立一块石碑：“献给一位勇敢的探索者，他找到了最后的谜题，但未能带回答案。”
（游戏结束：葬身地下）
1. 完成此支线后，在地下室谜题中，你可以直接获得“远古知识”的提示，无需进行复杂的符文解谜。
2. 在最终密室，如果你获得了“守护者”状态，可以选择“封印古老力量”的选项，解锁一个独特的结局。
3. 托马斯的遗物（地质锤、笔记本）可以作为特殊道具，在后续谜题中用于分析矿石成分或破解地质相关的谜题。
4. 如果你完成了管家支线，管家会告诉你更多关于克劳利家族与地下洞穴的关系——原来克劳利家族世代都知道洞穴的存在，但只有阿斯特试图深入研究。
以上支线三《地下的回响》总文本量约1万字，包含完整的地质探索叙事、道德选择、多种结局以及与主线和其他支线的联动。您可以根据需要调整细节，确保与已有设定一致。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/支线4.txt 场景 ---
scenes["side_story_4_start"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("埃莉诺·布莱克伍德的名字")) {
            gameState.clues.push("埃莉诺·布莱克伍德的名字");
            msg += `<div class="system-message">【获得线索】：埃莉诺·布莱克伍德的名字</div>`;
        }
        if(!hasClue("夜莺符号")) {
            gameState.clues.push("夜莺符号");
            msg += `<div class="system-message">【获得线索】：夜莺符号</div>`;
        }
        if(!hasClue("七件有标记的乐器")) {
            gameState.clues.push("七件有标记的乐器");
            msg += `<div class="system-message">【获得线索】：七件有标记的乐器</div>`;
        }
        return msg;
    },
    desc: `你拿起小提琴，翻转过来，在琴身背面的底板上发现了一行刻字，被岁月磨得有些模糊：“埃莉诺·布莱克伍德，1888年制于伦敦。” 这不是一把普通的工厂琴，而是一位制琴师亲手制作的作品。你仔细端详，发现琴身的木材纹路非常特别——背板是一整块带有火焰纹的枫木，面板是年轮极其细密的云杉，琴头雕刻得栩栩如生。这显然是一位大师的杰作。
你试图在音乐室中寻找更多关于埃莉诺的痕迹。你检查了管风琴、三角钢琴、定音鼓、展柜里的其他乐器，发现每件乐器上都有一个小标记——不是埃莉诺的名字，而是一个符号：一只展翅的夜莺。夜莺符号用极细的刻刀刻在乐器不起眼的角落，不仔细看根本发现不了。
你数了数，有标记的乐器正好是七件：小提琴、中提琴、大提琴、低音提琴、长笛、双簧管、单簧管。唯独没有铜管和打击乐。这似乎暗示着埃莉诺与这七件弦乐和木管乐器有特殊的联系。`,
    options: [
        { text: "询问管家是否认识埃莉诺", target: "side_ask_butler_elenor" },
        { text: "检查乐谱手稿的更多细节", target: "side_score_details" },
        { text: "尝试演奏那把小提琴", target: "side_play_violin" },
        { text: "在音乐室寻找暗格或隐藏空间", target: "side_music_hidden" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ask_butler_elenor"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("埃莉诺与阿斯特的爱情故事")) {
            gameState.clues.push("埃莉诺与阿斯特的爱情故事");
            msg += `<div class="system-message">【获得线索】：埃莉诺与阿斯特的爱情故事</div>`;
        }
        if(!hasClue("埃莉诺死于肺痨，未能完成交响曲")) {
            gameState.clues.push("埃莉诺死于肺痨，未能完成交响曲");
            msg += `<div class="system-message">【获得线索】：埃莉诺死于肺痨，未能完成交响曲</div>`;
        }
        if(!hasClue("七件乐器是她制作的")) {
            gameState.clues.push("七件乐器是她制作的");
            msg += `<div class="system-message">【获得线索】：七件乐器是她制作的</div>`;
        }
        return msg;
    },
    desc: `你找到管家，向他展示小提琴上的刻字。他的表情瞬间凝固，沉默了很久，才缓缓开口：“埃莉诺·布莱克伍德……这个名字我已经二十多年没有听到了。”
“她是谁？”
“她是一位天才制琴师，也是作曲家。更重要的是……” 管家停顿了一下，“她是我哥哥爱过的女人。在伊莲娜之前。”
你愣住了。画室支线中你已经知道伊莲娜的故事，没想到在伊莲娜之前还有一位埃莉诺。
“哥哥年轻时在维也纳学习音乐，遇到了埃莉诺。她比他大几岁，已经是小有名气的制琴师。两人相爱，但埃莉诺患有不治之症——肺痨。医生说她活不过三十岁。哥哥带她回到谜语馆，希望庄园的空气能让她好转。她在这里度过了生命中最后三年，期间为庄园制作了七件乐器，并开始创作一首交响曲。”
“《第七交响曲：未完成》？”你问。
管家点头：“她没能完成。第七乐章只写了开头，她就……走了。哥哥悲痛欲绝，将她的乐器封存在音乐室，再也没有碰过。他后来沉迷于绘画，遇到了伊莲娜，但那是另一个故事了。”
“为什么我从未在日记或记录中看到她的名字？”
“哥哥从不提起她。那三年的记忆对他来说是最大的痛苦。他把她的名字从庄园的所有记录中删除了，只留下音乐室里的这些乐器。我以为他会把那些乐器也毁掉，但他没有。”`,
    options: [
        { text: "询问更多关于交响曲的事", target: "side_symphony_details" },
        { text: "询问埃莉诺的安息之处", target: "side_elenor_grave" },
        { text: "感谢管家，继续探索音乐室", target: "side_story_4_start" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_symphony_details"] = {
    on_enter: () => {
        let msg = "";
        if(!hasClue("前六个乐章的乐谱在琴凳里")) {
            gameState.clues.push("前六个乐章的乐谱在琴凳里");
            msg += `<div class="system-message">【获得线索】：前六个乐章的乐谱在琴凳里</div>`;
        }
        return msg;
    },
    desc: `“那首交响曲，她写了多少？”
管家沉思片刻：“前六个乐章是完整的。第七乐章只写了主题，她是在病床上哼出那个旋律的。哥哥把它记了下来，就是你现在看到的那份手稿。他想找人完成它，但没有人能做到——那是埃莉诺的音乐，只有她能完成。”
“前六个乐章的乐谱呢？”
“在三角钢琴的琴凳里。哥哥把它们藏在那里，再也没有打开过。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_piano_stool"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("埃莉诺的完整乐谱（前六乐章）")) {
            gameState.items.push("埃莉诺的完整乐谱（前六乐章）");
            msg += `<div class="system-message">【获得物品】：埃莉诺的完整乐谱（前六乐章）</div>`;
        }
        if(!hasItem("夜莺胸针")) {
            gameState.items.push("夜莺胸针");
            msg += `<div class="system-message">【获得物品】：夜莺胸针</div>`;
        }
        return msg;
    },
    desc: `你打开三角钢琴的琴凳，里面果然有一叠泛黄的乐谱，用丝带捆扎。丝带上系着一枚银质胸针，形状是一只夜莺。乐谱封面写着：“埃莉诺·布莱克伍德，第六交响曲‘谜语’（后更名为第七交响曲），献给A.C.” 前六个乐章完整，第七乐章只有第一页，写着主题旋律和一行小字：“如果我未能完成，请让音乐室自己演奏它。”
你翻阅乐谱，发现前六个乐章的标题分别是：I. 诞生、II. 爱情、III. 漂泊、IV. 归乡、V. 告别、VI. 等待。第七乐章没有标题，只有那个主题旋律。乐谱的空白处有铅笔写的注释，似乎是阿斯特的笔迹：“她走的那天，窗外的夜莺在唱歌。她说那是她的灵魂。”`,
    options: [
        { text: "尝试理解“让音乐室自己演奏”的意思", target: "side_music_room_play" },
        { text: "将胸针带到某个地方", target: "side_brooch_clue" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_brooch_clue"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("埃莉诺的遗信")) {
            gameState.items.push("埃莉诺的遗信");
            msg += `<div class="system-message">【获得物品】：埃莉诺的遗信</div>`;
        }
        if(!hasItem("铜钥匙")) {
            gameState.items.push("铜钥匙");
            msg += `<div class="system-message">【获得物品】：铜钥匙</div>`;
        }
        return msg;
    },
    desc: `你仔细端详夜莺胸针，发现夜莺的眼睛是两颗细小的红宝石，其中一颗可以转动。你轻轻旋转，胸针背面弹出一根细针，针尖上刻着极小的字：“花园，紫藤架下，1888年。”
紫藤架——你在画室支线中已经去过那里。难道埃莉诺也与紫藤架有关？你带着胸针前往花园。
紫藤架下，你将胸针对着月光。光线穿过红宝石，在石板上投射出一个光点。光点指向石板边缘的一个缝隙。你撬开石板，下面有一个小小的铁盒，盒子里放着一封信和一把铜钥匙。信是埃莉诺写给阿斯特的，字迹娟秀但虚弱：
“亲爱的阿斯特，当你读到这封信时，我大概已经不在了。不要悲伤，我在音乐中永生。我把最后的秘密藏在音乐室的壁炉后面。那是我为你准备的最后的礼物。原谅我未能完成交响曲，但我知道，总有一天，会有人替我奏响最后一个音符。永远爱你的，埃莉诺。”`,
    options: [
        { text: "返回音乐室，用钥匙打开壁炉", target: "side_fireplace_secret" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_fireplace_secret"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("埃莉诺的制琴笔记")) {
            gameState.items.push("埃莉诺的制琴笔记");
            msg += `<div class="system-message">【获得物品】：埃莉诺的制琴笔记</div>`;
        }
        return msg;
    },
    desc: `音乐室的壁炉早已不用，炉膛里堆着灰烬。你清理掉灰烬，在炉膛内壁发现了一个钥匙孔。插入铜钥匙，轻轻旋转，炉膛后壁无声地滑开，露出一条狭窄的通道。通道尽头是一间小小的密室，只有几平方米，布置得像一间简陋的工作室。
密室里有一张工作台，台上放着制琴工具：刨子、刮刀、音柱钩、琴码、弦轴。墙壁上挂着几块制作中的琴板，已经蒙尘。工作台上方有一幅素描——画的是一个年轻女人坐在窗边拉琴，窗外是紫藤花架。画中的女人有着温柔的眼睛和纤瘦的身形，显然是埃莉诺。素描的角落有阿斯特的签名。
工作台的抽屉里有一本日记，封面是深蓝色丝绒，烫金标题“埃莉诺的制琴笔记”。你翻开，里面不仅有制琴的技术记录，还有她的私人日记。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_elenor_diary"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("埃莉诺的琴弓")) {
            gameState.items.push("埃莉诺的琴弓");
            msg += `<div class="system-message">【获得物品】：埃莉诺的琴弓</div>`;
        }
        return msg;
    },
    desc: `你坐在密室里，借着油灯阅读日记。以下是关键内容：
“1886年3月。阿斯特带我来到谜语馆。这里的空气比维也纳好太多，他的温柔让我暂时忘记了病痛。他说要为我建一座音乐室，让我的琴声永远回荡在庄园里。”
“1886年8月。我开始为庄园制作乐器。我要做七件，每一件都用最好的木材。阿斯特说七是谜语馆的圣数，那就七件吧。我要让这些乐器比我的生命更长久。”
“1887年1月。第一把小提琴完成了。我用夜莺的图案作为标记，因为窗外的夜莺总是在我咳嗽时唱歌，仿佛在安慰我。阿斯特说，夜莺是诗人的象征，也是我的象征。”
“1887年6月。中提琴完成。我的病情加重了，有时候握不住刨子。阿斯特不让我继续工作，但我不听。我的时间不多了，必须完成。”
“1887年12月。第七件——单簧管——终于完成。七件乐器，七种声音，却少了一首配得上它们的曲子。我要写一首交响曲，用这七件乐器作为主角。”
“1888年2月。前六个乐章写完了。我把我的一生都写进去了——诞生、爱情、漂泊、归乡、告别、等待。第七乐章应该是‘重生’，但我写不出来。我不知道重生是什么感觉，也许死亡之后才能知道。”
“1888年4月。我咳血了。阿斯特哭了。我对他说，不要悲伤，等我走了，把乐器留在音乐室里，总有一天，会有人让它们再次歌唱。第七乐章的旋律我已经哼给他听了，他记了下来。如果没有人能完成它，就让音乐室自己演奏吧。”
“1888年5月。最后一天。窗外的夜莺在叫。阿斯特，原谅我先走一步。我把最后的秘密藏在壁炉后面，那是为你准备的礼物——一把我用最后的木材制作的琴弓，用它演奏我的小提琴，可以听到我留在琴身里的声音。”
日记到此结束。工作台上方的小盒子里，果然有一把琴弓，弓杆是乌木，弓尾库镶着珍珠母贝，马尾洁白如新。弓杆上刻着：“奏响我，我将归来。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_play_elenor_violin"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("夜莺徽章（纪念品）")) {
            gameState.items.push("夜莺徽章（纪念品）");
            gameState.medals.push("夜莺徽章（纪念品）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：夜莺徽章（纪念品）</div>`;
        }
        if(!hasItem("埃莉诺的完整交响曲（七乐章全本）")) {
            gameState.items.push("埃莉诺的完整交响曲（七乐章全本）");
            msg += `<div class="system-message">【获得物品】：埃莉诺的完整交响曲（七乐章全本）</div>`;
        }
        return msg;
    },
    desc: `你拿起埃莉诺的小提琴，装上她的琴弓，深吸一口气，拉响空弦。琴声比任何乐器都纯净，带着一种穿透灵魂的温暖。你试着拉出埃莉诺日记中哼过的第七乐章主题旋律——那是一个简单而优美的旋律，像是夜莺的歌声，又像是一个人在轻声诉说。
琴声在音乐室里回荡，墙壁上的反射板开始微微振动。然后，神奇的事情发生了——其他六件有夜莺标记的乐器开始共鸣，不需要人演奏，它们自己发出了声音。小提琴、中提琴、大提琴、低音提琴、长笛、双簧管、单簧管，七件乐器同时奏响，合奏出第七乐章的旋律——不，不只是主题，是完整的第七乐章！埃莉诺把第七乐章“藏”在了这些乐器里，只有用她的琴弓演奏主题，其他乐器才会回应，将乐章完整地呈现出来。
音乐在穹顶下回荡，壮丽而哀伤，像是一个人的灵魂终于找到了归宿。当最后一个音符消散时，你看到音乐室中央的空气中有微弱的光在闪烁，然后凝聚成一个人影——一个女人，穿着长裙，手持小提琴，微笑着。她看了你一眼，然后转身走向管风琴，消失在琴键的光芒中。
管风琴的琴键自动按下，奏出一个深沉的和弦。和弦消散后，管风琴侧面的暗门弹开，里面有一个小匣子。匣子里放着一枚特殊的徽章——不是主线的七徽章之一，而是一枚银色的夜莺徽章，背面刻着：“感谢你让我完成最后的乐章。”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_symphony_complete"] = {
    desc: `你站在音乐室中央，手中握着夜莺徽章。空气中有一种奇特的宁静，像是某个漫长等待终于结束了。你决定将埃莉诺的完整交响曲抄录下来，让更多人听到。
在抄录的过程中，你注意到第七乐章的乐谱上出现了一行之前没有的字：“重生”。这是埃莉诺一直寻找的标题。现在，它终于有了名字。`,
    options: [
        { text: "将交响曲公之于众", target: "side_ending_music_public" },
        { text: "将交响曲留在谜语馆", target: "side_ending_music_keep" },
        { text: "用交响曲触发音乐室的某个机关", target: "side_music_final_mechanism" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_music_public"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_music_completed")) {
            gameState.items.push("side_music_completed");
            msg += `<div class="system-message">【获得物品】：side_music_completed</div>`;
        }
        return msg;
    },
    desc: `你将埃莉诺的交响曲交给伦敦皇家音乐学院，由最顶尖的乐团演奏。首演之夜，你坐在观众席上，当第七乐章“重生”奏响时，你感到身边的空气微微震动——你确信你看到了一个女人的轮廓坐在空椅子上，静静地聆听。
演出结束后，指挥家走上台，激动地说：“这是二十年来最伟大的交响曲发现。埃莉诺·布莱克伍德的名字，将与贝多芬、莫扎特并列。”
你回到谜语馆，将演出节目单放在音乐室的管风琴上。从此以后，每当有人演奏这首交响曲，音乐室的乐器都会轻轻共鸣，仿佛在回应。
（支线结束。获得特殊成就：音乐的传承。在主线结局中，你将获得将谜语馆改造为“布莱克伍德音乐厅”的选项，解锁一个独特的艺术结局。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_ending_music_keep"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("side_music_completed")) {
            gameState.items.push("side_music_completed");
            msg += `<div class="system-message">【获得物品】：side_music_completed</div>`;
        }
        return msg;
    },
    desc: `你决定将埃莉诺的交响曲留在谜语馆，作为庄园永远的秘密。你将乐谱放在管风琴的乐谱架上，将琴弓放回密室。走出音乐室时，你回头看了一眼——那把小提琴静静地躺在展柜里，琴弦上似乎还有余温。
你觉得这是埃莉诺和阿斯特之间的私密对话，不应该被外人打扰。谜语馆已经承载了太多故事，这一个，让它留在墙内吧。
（支线结束。获得特殊状态：秘密的守护者。在主线结局中，你将更倾向于选择“守护者”路线。）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["side_music_final_mechanism"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("紫藤花种子（可种在庄园花园）")) {
            gameState.items.push("紫藤花种子（可种在庄园花园）");
            msg += `<div class="system-message">【获得物品】：紫藤花种子（可种在庄园花园）</div>`;
        }
        if(!hasItem("埃莉诺的祝福（在最终密室中")) {
            gameState.items.push("埃莉诺的祝福（在最终密室中");
            gameState.items.push("你将获得一次“灵感”加成");
            gameState.items.push("自动破解一个难题）");
            msg += `<div class="system-message">【获得物品】：埃莉诺的祝福（在最终密室中，你将获得一次“灵感”加成，自动破解一个难题）</div>`;
        }
        return msg;
    },
    desc: `如果你在完成音乐室主线谜题时没有完全触发所有机关，完成此支线后，你可以用埃莉诺的琴弓和夜莺徽章激活音乐室的终极机关。将徽章放入管风琴中央的凹槽，用琴弓拉响第七乐章的主题，管风琴背后的墙壁会完全打开，露出一条通往庄园地下更深处的通道——通往埃莉诺真正的安息之地。
那里有一座小小的石墓，墓前种着一株紫藤（不知为何在黑暗中生长）。墓碑上刻着：“埃莉诺·布莱克伍德，制琴师，作曲家，1888年归于宁静。她从未离开，她的音乐在这里。”
墓前有一块石板，上面刻着：“如果你找到了这里，请为我奏一曲。” 你拿出小提琴，拉响第七乐章的主题。墓前的紫藤花瞬间绽放，花香充满了整个空间。在花香中，你感到一种前所未有的平静。
如果你在支线完成后，带着埃莉诺的笔记和琴弓前往伦敦（游戏允许离开庄园的设定下），可以找到她曾经工作过的制琴作坊。作坊早已关闭，但旧址上有一家小咖啡馆，店主是埃莉诺的后人（远亲）。你可以将埃莉诺的故事告诉他们，他们会送给你一张埃莉诺年轻时的照片，以及她制作的第一把小提琴的草图。
这条分支需要额外的场景设计，但可以极大地丰富支线的深度。
1. 完成此支线后，在音乐室谜题中，你可以直接使用埃莉诺的琴弓演奏第七乐章主题，跳过所有解谜步骤获得徽章。
2. 在画室支线中，如果你提到埃莉诺的名字，阿斯特的“幽灵”（如果有）会表现出更复杂的情绪，解锁额外的对话。
3. 在最终密室，如果你选择“传播谜语精神”的路线，你可以选择将埃莉诺的交响曲作为谜语馆最珍贵的收藏公开展示。
4. 夜莺徽章可以作为特殊道具，在后续与音乐相关的谜题（如果有）中提供加成。
以上支线四《未完成的交响曲》总文本量约1万字，包含完整的音乐叙事、情感深度、多个场景、分支、结局以及与主线和其他支线的联动。您可以根据需要调整细节，确保音乐主题与庄园的谜语氛围和谐共存。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/大结局.txt 场景 ---
scenes["final_chamber_entry"] = {
    desc: `当七枚徽章在卧室油画上齐聚的瞬间，整个庄园都在震动。大厅方向传来沉重的石门开启声，你沿着螺旋石梯向下，穿过一道又一道拱门，最终来到庄园的最深处。
中央密室比想象中更加宏大。圆形大厅的穹顶上绘着七曜星辰的壁画，星辰以缓慢的速度旋转，投射下流动的光影。地板上镶嵌着七枚徽章的凹槽，你已经将徽章放入，它们严丝合缝，发出柔和的七色光芒。
地面开始震动，中央升起一座石台。石台上放着一个古朴的金属匣子，匣子表面没有任何锁或把手，只有七道凹槽——每道凹槽的形状都不同，对应着你从七个房间获得的某种特殊物品：图书馆的星盘钥匙、钟楼的机械齿轮、音乐室的共鸣水晶、画室的神秘颜料、温室的生命之露、地下室的符文石、卧室的夜莺胸针（或银手镯，取决于你完成了哪些支线）。
匣子的盖子上刻着一行字：“七物归位，真相方显。但最后的钥匙，不在匣中，而在你心中。”
你的手悬在匣子上方。你知道，打开这个匣子不需要蛮力，而需要理解——理解谜语馆的意义，理解阿斯特·克劳利的一生，理解你走过的每一条路、读过的每一页日记、听过的每一个故事。`,
    options: [
        { text: "走向石台，开始匣子前的考验", target: "final_test_1" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_1"] = {
    desc: `你看着石台上的七道凹槽，以及你收集的七件特殊物品。每件物品都来自一个房间，也来自一段故事。你需要将它们放入正确的凹槽——不是按照房间顺序，而是按照你对它们含义的理解。
凹槽的形状分别是：
- 一道螺旋线（象征迷宫与探索）
- 一个齿轮（象征时间与机械）
- 一个音符（象征音乐与情感）
- 一滴颜料（象征艺术与色彩）
- 一颗种子（象征生命与成长）
- 一个符文（象征秘密与力量）
- 一只夜莺（象征记忆与传承）
你将物品一一比对：
- 星盘钥匙（图书馆）——螺旋线凹槽？钥匙上的星图纹路与螺旋线吻合。
- 机械齿轮（钟楼）——齿轮凹槽，毫无疑问。
- 共鸣水晶（音乐室）——音符凹槽，水晶在音乐中诞生。
- 神秘颜料（画室）——颜料凹槽。
- 生命之露（温室）——种子凹槽，生命之露让种子发芽。
- 符文石（地下室）——符文凹槽。
- 夜莺胸针（卧室/支线）——夜莺凹槽。
但如果你没有完成某些支线，可能缺少对应的物品。例如，如果你没有完成画中女子支线，你可能只有银手镯而不是夜莺胸针；如果你没有完成管家支线，你可能没有阿斯特的怀表。系统会根据你实际拥有的物品调整凹槽数量和解锁方式。`,
    options: [
        { text: "按照上述对应放入物品", target: "final_test_1_correct" },
        { text: "尝试其他组合", target: "final_test_1_wrong" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_1_correct"] = {
    desc: `当你将最后一件物品放入凹槽，匣子发出一声轻响，盖子微微弹起，但没有完全打开。盖子上浮现出第二行字：“七物已归，七谜已解。但你可曾明白，我为何建造谜语馆？”
匣子重新闭合，你需要回答这个问题。`,
    options: [
        { text: "在心中作答，并继续下一重考验", target: "final_test_2" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_1_wrong"] = {
    desc: `如果放错物品，匣子会发出刺目的红光，一股斥力将你推开。你手中的物品散落一地，需要重新拾起并再次尝试。没有致命的惩罚，但错误会消耗时间，并让密室中的光线变暗一些（增加紧张感）。`,
    options: [
        { text: "重新整理物品再试", target: "final_test_1" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_2"] = {
    desc: `匣子上出现了一个新的谜题。不是文字，而是一幅画面——在匣子的表面，七幅微缩画像依次浮现，分别是你在画室中完成的那七幅画：红日、秋叶、麦田、森林、湖水、海洋、晚霞。但顺序被打乱了，你需要按照某种逻辑重新排列它们。
你回忆起画室支线中伊莲娜日记的线索——七幅画对应七种情绪，也对应七种光，更对应阿斯特与伊莲娜的故事。正确的顺序应该是故事的时间顺序：初见（紫藤花下）→ 热恋（秋叶）→ 痴迷（麦田）→ 挣扎（森林）→ 逃离（湖水）→ 追寻（海洋）→ 永别（晚霞）。对应到画面颜色：紫（紫藤）→ 橙（秋叶）→ 黄（麦田）→ 绿（森林）→ 青（湖水）→ 蓝（海洋）→ 紫红（晚霞）。
但你没有完成画室支线的话，这个顺序需要从其他线索中推理——例如从阿斯特日记的只言片语，从管家的话语，从画背面的文字。`,
    options: [
        { text: "按故事顺序排列", target: "final_test_2_correct" },
        { text: "按光谱顺序排列", target: "final_test_2_wrong" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_2_correct"] = {
    desc: `画面排列正确后，匣子表面浮现出伊莲娜的侧影，她微微一笑，消散在光芒中。匣子再次弹开一些，出现第三行字：“你读懂了我的画，但你读懂了我吗？”`,
    options: [
        { text: "继续聆听匣子的考验", target: "final_test_3" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_2_wrong"] = {
    desc: `如果排列错误，画面会变得模糊，你需要重新尝试。连续错误三次后，匣子会暂时锁定，需要等待几分钟才能再次尝试（游戏内时间流逝）。`,
    options: [
        { text: "重新观察画面", target: "final_test_2" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_3"] = {
    desc: `匣子开始发出声音——不是说话，而是音乐。七种乐器依次奏出一个音符：小提琴、中提琴、大提琴、低音提琴、长笛、双簧管、单簧管。这七个音符组成一个旋律，正是埃莉诺第七交响曲的主题片段。
但旋律不完整，缺了最后一个音符。你需要“补上”这个音符——不是用乐器，而是用你的声音，或者用你从支线中获得的某个物品。
如果你完成了音乐室支线，你拥有夜莺徽章或埃莉诺的琴弓。将徽章贴近匣子，或者轻声哼出第七乐章的主题，最后一个音符会自动补全。
如果你没有完成支线，你需要从埃莉诺日记的线索中推断出最后一个音符——它应该是“Do”，象征“重生”的开始。`,
    options: [
        { text: "使用夜莺徽章", target: "final_test_3_correct" },
        { text: "哼出Do音", target: "final_test_3_correct" },
        { text: "尝试其他音符", target: "final_test_3_wrong" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_3_wrong"] = {
    desc: `匣子发出刺耳的不和谐音，旋律骤然中断。你深吸一口气，知道自己补错了那一个音符。`,
    options: [
        { text: "静下心来再听一遍", target: "final_test_3" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_3_correct"] = {
    desc: `旋律完整了。七种乐器的声音在密室中回荡，交织成壮丽的交响。当最后一个音符消散，匣子完全打开。
但匣子里面不是金银财宝，也不是一封信——而是一个更小的匣子，以及七块碎片。小匣子上刻着最后一行字：“最后的谜题，是你自己。”`,
    options: [
        { text: "拼合碎片，面对镜中与最终抉择", target: "final_test_4" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_test_4"] = {
    desc: `七块碎片散落在石台上。你将它们拼在一起，发现是一面破碎的镜子——镜中倒映着你的脸，但镜像中的你戴着和阿斯特肖像画中一样的面具。面具的眼睛部位空洞，等待着被“填入”什么。
小匣子打开了，里面是三样东西：
1. 一封阿斯特的亲笔信
2. 一把钥匙（形状与庄园大门相同）
3. 一本空白的笔记本
信的内容如下：
“致最终找到这里的人：
如果你正在读这封信，说明你已经完成了七谜考验，也读过了我的日记、伊莲娜的故事、埃莉诺的音乐，或许还有托马斯的地质笔记。你知道了我的一生——我的痴迷、我的悔恨、我的孤独。
现在，轮到你了。谜语馆的遗产不是财富，而是选择。你可以选择以下道路中的一条：
第一条路：成为谜语馆的主人。你将继承这座庄园、所有谜题和收藏，但必须终身守护这里，等待下一个继承人的到来。这是财富之路，也是囚徒之路。
第二条路：成为谜语的传播者。你可以带走我的谜题笔记，将谜语馆的谜题公之于众，让更多人体验解谜的乐趣。但你会失去物质遗产，只能带走一本笔记。这是自由之路，也是智慧之路。
第三条路：成为守护者。谜语馆地下隐藏着古老的力量（托马斯发现的那个）。你可以选择封印它，守护它不被滥用。这是责任之路，也是孤独之路。
第四条路：成为故事的讲述者。你可以将伊莲娜、埃莉诺、托马斯的故事写成书，让他们的生命被世人记住。谜语馆可以变成博物馆、音乐厅，或者一座普通的庄园。这是传承之路，也是和解之路。
但无论你选择哪条路，请记住：谜语的最终意义不是答案，而是提问的过程。保持好奇，保持探索，不要像我一样，被困在自己创造的迷宫里。
阿斯特·克劳利
1897年秋”`,
    options: [
        { text: "第一条路：成为谜语馆的主人", target: "ending_1" },
        { text: "第二条路：成为谜语的传播者", target: "ending_2" },
        { text: "第三条路：成为守护者，封印地下的力量", target: "ending_3", condition: () => getFlag("side_underground_completed") },
        { text: "第四条路：成为故事的讲述者（博物馆与传记）", target: "ending_4", condition: () => getFlag("side_painting_completed") && getFlag("side_clock_completed") },
        { text: "第五条路：传承谜语精神，并同时纪念伊莲娜与埃莉诺", target: "ending_5_truth", condition: () => getFlag("side_butler_completed") && getFlag("side_painting_completed") && getFlag("side_underground_completed") && getFlag("side_music_completed") },
        { text: "迟疑、误解或逃避", target: "ending_6_forgotten" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["ending_5_truth"] = {
    on_enter: () => {
        let msg = "";
        msg += markEnding("七重谜语的真相");
        return msg;
    },
    desc: `这个结局是结局四的深化版。当你做出选择后，密室中出现了异象——七色光汇聚成两个人影，一男一女，手牵着手。男人是阿斯特，女人是伊莲娜（或埃莉诺，取决于你对两位女性的理解深度）。他们向你微笑，然后消散在光芒中。
当你走出密室时，发现庄园焕然一新——枯死的植物重新变绿，破碎的玻璃恢复完整，灰尘被清扫干净。管家站在大厅里，不是老年管家的模样，而是年轻时与阿斯特并肩而立的样子。他对你说：“谢谢你，解开了我们所有人的谜题。”
你离开庄园时，回头看了一眼。谜语馆的七扇窗户里，七盏烛火同时亮起，像是七颗星星，又像是七只眼睛，注视着你的背影。你知道，你带走的不是遗产，而是一段历史，一个故事，一种传承。
（真结局：七重谜语的真相）`,
    options: [
        { text: "重新步入轮回", target: "title" }
    ]
};

scenes["ending_6_forgotten"] = {
    on_enter: () => {
        let msg = "";
        msg += markEnding("被遗忘的探索者");
        return msg;
    },
    desc: `密室触发机关，将你送出庄园。管家站在门口，面无表情地说：“你不适合这里。”
大门在你身后关闭。你站在迷雾中，手里什么都没有。谜语馆消失了，像是从未存在过。你甚至开始怀疑，这一切是不是一场梦。
（结局：被遗忘的探索者）`,
    options: [
        { text: "重新步入轮回", target: "title" }
    ]
};

// --- 自动生成的 文本/主线.txt 场景 ---

// --- 自动生成的 文本/主线2.txt 场景 ---
scenes["start"] = {
    desc: `你是一名独来独往的私家侦探，在深秋的午夜，一封没有邮戳的信静静躺在你的门垫上。信封用暗红色的火漆封缄，上面压印着一个由七条弧线交织成的神秘徽记。
展开信纸，优雅而古老的手写体映入眼帘：
“致敏锐的探索者：
当月光照亮七面镜，谜语的血脉将再度流淌。我，阿斯特·克劳利，谜语大师，已将毕生智慧与遗产封存在我的庄园‘谜语馆’中。唯有通过七重谜域的考验者，方能继承我的遗产与终极秘密。地图在此，期待你的到来。
——阿斯特·克劳利”
信纸背面，是一张手绘地图，指向城郊迷雾山谷中的一座古老庄园。你感到一阵难以名状的悸动——这不仅是一个委托，更像是一场宿命的召唤。
你简单收拾行装，带上从不离身的侦探笔记，踏上了前往谜语馆的路。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_inspect_book"] = {
    desc: `你俯身观察那本空白的书。书页虽无字，但当你将手指放在纸面上时，能感到细微的凸起——是盲文？不，更像是某种密码压印。书的封面上刻着一行小字：“知识即钥匙，顺序即答案。”
你尝试着用指腹感受那些凸起的排列，似乎对应着某种规律，但缺少关键的线索来解读它们。也许书架中藏着与之对应的密码本。
（获得线索：空白书的秘密）`,
    options: [
        { text: "返回继续探索图书馆", target: "library_entry" },
        { text: "去书架寻找对应密码本", target: "library_find_codex" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_pull_books"] = {
    desc: `你走到书架前，注意到有几本书的书脊比其他书突出一些。一本是《密码学简史》，一本是《七重天文学》，还有一本没有书名，只有烫金的问号。
你决定：
- 拉动《密码学简史》 [前往 library_trap]
- 拉动《七重天文学》 [前往 library_success? 但缺少核心条件? 暂定失败分支]
- 拉动无书名之书 [前往 library_hidden_passage]`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_trap"] = {
    desc: `当你拉动《密码学简史》时，书架后突然射出一排毒针！你勉强侧身避开，但手臂还是被划伤了一道。毒素让你感到眩晕，你不得不退出图书馆，回到大厅休息。
（状态：受伤，但无生命危险。但解谜失败，暂时无法再次尝试。你需要找到解药或从其他房间获得线索才能重返。）`,
    options: [
        { text: "返回大厅", target: "hall_injured" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_find_codex"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("蓝宝石徽章（1/7）")) {
            gameState.items.push("蓝宝石徽章（1/7）");
            gameState.medals.push("蓝宝石徽章（1/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：蓝宝石徽章（1/7）</div>`;
        }
        if(!hasItem("克劳利的日记")) {
            gameState.items.push("克劳利的日记");
            msg += `<div class="system-message">【获得物品】：克劳利的日记</div>`;
        }
        return msg;
    },
    desc: `你在书架深处找到一本《克劳利密码本》，里面记载了一种基于七种基本符号的编码方式。对照空白书上的凸起，你终于解读出那行字：“拉动象征智慧的书脊。”
你走到书架前，拉动那本烫金问号的书（智慧之书），这一次，书桌缓缓打开，露出一枚蓝宝石徽章，以及一本皮质封面的日记。
（日记内容：记述了庄园的秘密，特别提到钟楼谜题的关键是“将时间调至月升之时，听指针的低语”。）`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_diary_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("红宝石徽章（2/7）")) {
            gameState.items.push("红宝石徽章（2/7）");
            gameState.medals.push("红宝石徽章（2/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：红宝石徽章（2/7）</div>`;
        }
        if(!hasItem("机械齿轮")) {
            gameState.items.push("机械齿轮");
            msg += `<div class="system-message">【获得物品】：机械齿轮</div>`;
        }
        return msg;
    },
    desc: `你翻开日记，其中一页画着钟楼的内部结构图，旁边注释：“月升之时，聆听秒针的低语。当分针与时针重合于12，真相之窗将打开。”
你抬头望向窗外，此刻正是午夜，月亮升至中天。你耐心等待秒针走到12的位置，然后轻轻推动分针与时针重合。随着一声清脆的咔哒声，钟盘后的暗门开启，露出一个暗格，里面是一枚红宝石徽章。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["clocktower_adjust"] = {
    desc: `你决定强行调整指针。当你握住分针时，一股强大的电流从金属传递到你的手臂！你被弹开，摔下楼梯，幸好抓住了栏杆才没有重伤。但钟楼内警报大作，你被迫逃离，暂时无法再进入。
（解谜失败，需从其他房间获得线索或找到重置方法。）`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["musicroom_gear_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("翠绿徽章（3/7）")) {
            gameState.items.push("翠绿徽章（3/7）");
            gameState.medals.push("翠绿徽章（3/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：翠绿徽章（3/7）</div>`;
        }
        if(!hasItem("共鸣水晶")) {
            gameState.items.push("共鸣水晶");
            msg += `<div class="system-message">【获得物品】：共鸣水晶</div>`;
        }
        return msg;
    },
    desc: `你想起钟楼获得的机械齿轮与管风琴侧面一个齿轮缺口完全吻合。你将齿轮嵌入，轻轻转动，管风琴的琴键自动亮起，按照某种旋律依次按下。一曲终了，管风琴后方的墙壁裂开，露出一枚翠绿徽章和一块共鸣水晶。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["studio_crystal_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("橙色徽章（4/7）")) {
            gameState.items.push("橙色徽章（4/7）");
            gameState.medals.push("橙色徽章（4/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：橙色徽章（4/7）</div>`;
        }
        if(!hasItem("神秘颜料")) {
            gameState.items.push("神秘颜料");
            msg += `<div class="system-message">【获得物品】：神秘颜料</div>`;
        }
        return msg;
    },
    desc: `你将共鸣水晶放在调色板中央，水晶突然发出柔和的七色光芒，依次照亮每个颜料槽。干涸的颜料重新焕发生机，你按照光芒顺序蘸取颜料，在空白画布上画下七道彩虹弧线。画作完成的瞬间，肖像画中的镜子射出光芒，一枚橙色徽章从镜中掉落。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_pigment_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("金色徽章（5/7）")) {
            gameState.items.push("金色徽章（5/7）");
            gameState.medals.push("金色徽章（5/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：金色徽章（5/7）</div>`;
        }
        if(!hasItem("生命之露")) {
            gameState.items.push("生命之露");
            msg += `<div class="system-message">【获得物品】：生命之露</div>`;
        }
        return msg;
    },
    desc: `你将神秘颜料分别滴入七个花盆，颜料渗入土壤后，枯死的植物竟然瞬间焕发生机，绽放出七色花朵。花朵的花粉飘向古树，树干上缓缓渗出一滴晶莹的露珠，落入石盆。石盆中的液体变得清澈，你从中捞出一枚金色徽章和一小瓶“生命之露”。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["basement_dew_solution"] = {
    on_enter: () => {
        let msg = "";
        if(!hasItem("紫色徽章（6/7）")) {
            gameState.items.push("紫色徽章（6/7）");
            gameState.medals.push("紫色徽章（6/7）");
            addMedal();
            msg += `<div class="system-message">【获得物品】：紫色徽章（6/7）</div>`;
        }
        if(!hasItem("符文石")) {
            gameState.items.push("符文石");
            msg += `<div class="system-message">【获得物品】：符文石</div>`;
        }
        return msg;
    },
    desc: `你将生命之露倒入祭坛的凹槽。液体流入符文的沟槽中，符文瞬间绽放出耀眼的光芒。祭坛缓缓下沉，露出一个石匣，里面躺着一枚紫色徽章和一块符文石。`,
    options: [
        { text: "返回大厅", target: "hall" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_chamber"] = {
    desc: `中央密室位于大厅正下方，一道螺旋石梯通向深处。密室是一个圆形大厅，穹顶上绘着七曜星辰，地板上镶嵌着七枚徽章的凹槽。你小心翼翼地将七枚徽章放入凹槽，它们严丝合缝。
地面开始震动，中央升起一座石台，上面放着一个古朴的金属匣子。匣子没有锁，但盒盖上刻着一个谜题：
“我有城市却没有房屋，
有山却没有树，
有水却没有鱼。
我是什么？”
你的手心微微出汗。这是最后的考验。`,
    options: [
        { text: "回答：“地图”", target: "ending_true" },
        { text: "回答：“画”", target: "ending_false" },
        { text: "回答：“天空”", target: "ending_false" },
        { text: "放弃回答", target: "ending_giveup" },
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["ending_true"] = {
    desc: `匣子应声而开，里面放着一本厚厚的笔记，扉页上写着：“致解开所有谜题的人——你证明了智慧与耐心的价值。我的遗产并非金银，而是我毕生收集的谜题与知识，它们将引导你走向更深的真相。”
笔记中还夹着一张世界地图，上面标注着数十个神秘地点，每一个都隐藏着未解的谜题。管家奥尔德斯不知何时站在你身后，微微鞠躬：“主人等待的就是您这样的人。从今以后，您便是谜语馆的新主人。”
你走出庄园，晨光刺破浓雾。你知道，这不是结束，而是无数冒险的开始。
（游戏通关）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["ending_false"] = {
    desc: `金属匣子猛地弹开，喷出一股绿色的烟雾。你立刻捂住口鼻，但已经吸入少许。视线开始模糊，你听到管家奥尔德斯的声音从远处传来：“答案错误。主人的遗嘱：失败者将永远留在这里，成为新的谜题的一部分。”
你倒在地上，意识逐渐消散。当你再次醒来时，发现自己变成了一幅画中的角色，永远困在谜语馆的走廊里。
（游戏结束：永恒囚徒）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["ending_giveup"] = {
    desc: `你合上匣子，转身离开。身后，七枚徽章从凹槽中弹出，散落一地，石台也重新沉入地面。你走出庄园，迷雾中再难找到回去的路。或许有一天，会有另一个人完成这七重考验，但那个人不会是你。
（游戏结束：平庸的离开）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["library_death"] = {
    desc: `毒针未能完全避开，一支针扎入你的颈部。毒素迅速蔓延，你倒在书架间，意识消失前，只看到奥尔德斯冰冷的身影：“鲁莽是解谜的大敌。”
（游戏结束）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["greenhouse_poison"] = {
    desc: `你将错误的液体倒入石盆，枯树中喷出腐臭的毒气，你来不及逃离，窒息倒下。
（游戏结束）
（注：实际实现时，可设计更多分支与失败结局，此处仅展示核心成功路线与部分失败场景，文本总量已接近一万字。您可在此基础上扩展更多选项与描述，以满足完整分支需求。）
 :WofI D :   h a l l _ i n j u r e d 
 
 \`OSN\$OƉΑnn!j|0
NwSǏNYEN\`O(W'YSQQv0Wg
Neg0
 {[eY\\_e(W NeQQ0Ww@w\`O
 
 c"}\`Ov؏@wbT0
 
 * * 	y* * 
 -   p0Wzweg~~c"}  [ MR_  h a l l _ m a i n ] 
 
 
 `,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

// --- 自动生成的 文本/补充1.txt 场景 ---

// --- 自动生成的 文本/补充2.txt 场景 ---
scenes["prologue_character"] = {
    desc: `你叫塞拉斯·诺斯，三十四岁，是迷雾城最出色的私家侦探。你以破解冷案和谜团闻名，从不依靠运气，只相信逻辑与观察。随身携带的侦探笔记记录了你经手的每一个案件——从失窃的油画到消失的遗产，没有一桩难倒过你。此刻，空白页正等待着新的谜题。

午夜，一封没有邮戳的信静静躺在门垫上。火漆上压印着七条弧线交织的徽记。你合上笔记，将地图折好放进口袋。直觉告诉你，这次委托将不同于以往任何案件。
侦探笔记功能说明（在序章后插入提示）：
*提示：在游戏过程中，所有获得的关键线索、日记内容、地图都会自动记录在笔记中。你可以随时输入“查看笔记”来回顾已获得的线索。*
初始大厅（已有，但补充管家对话）`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall_initial"] = {
    desc: `门厅内，水晶吊灯蒙着薄灰，墙壁上挂着七幅抽象画，每一幅都似乎在注视着你。一位身着燕尾服、面容古板的老人无声地出现在你面前，眼睛如同深不见底的黑曜石。

“欢迎，探索者。我是管家奥尔德斯，主人的意志将由我传达。”他的声音沙哑而平静，“主人留下遗嘱：庄园内设有七道谜题，分别位于七个房间。每解开一道，你将获得一枚宝石徽章。集齐七枚徽章，便可开启中央密室，获取遗产。但请记住——谜题可能致命，而选择不可逆转。你确定要开始吗？”`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall_1_medal"] = {
    desc: `你将[颜色]徽章放在壁炉台上。蓝宝石在火光中闪烁，映出一小片星图。管家瞥了一眼，微微点头：“第一枚。还有六道门等待着你。”

你注意到墙上七幅抽象画中的第一幅似乎变得明亮了一些，原本模糊的线条现在隐约能看出——那是图书馆的轮廓。
管家对话（1枚徽章后）：
“你已经踏出了第一步。但后面的谜题只会更难。如果需要休息，随时可以回到这里。”
大厅状态2：获得3枚徽章后`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall_3_medals"] = {
    desc: `三枚徽章在壁炉台上并排闪烁，光芒交织成柔和的虹彩。大厅的光线似乎比之前更亮了，三幅抽象画已经焕发出清晰的色彩——图书馆的书籍、钟楼的齿轮、音乐室的音符，栩栩如生。

管家递给你一杯热茶：“你比我想象的更快。但后面的谜题会更难。有些人在这里停下了脚步，希望你不一样。”
管家对话（3枚徽章后）：
“主人的日记里提到，画室和温室藏着最私密的记忆。如果你在那里看到什么……不必惊讶。”
大厅状态3：获得6枚徽章后`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall_6_medals"] = {
    desc: `六枚徽章的光芒照亮了整个房间，壁炉台几乎成了一座小小的灯塔。墙上的六幅抽象画已经变成了生动的场景——图书馆的静谧、钟楼的庄严、音乐室的辉煌、画室的色彩、温室的生机、地下室的神秘。只差最后一幅。

管家的声音里带着一丝期待，也有一丝不易察觉的颤抖：“最后一枚徽章在卧室。主人的私人空间，藏着最终的秘密。那扇门……我已经很久没有打开了。”
管家对话（6枚徽章后）：
“卧室的谜题不在地上，而在心里。主人的遗嘱说，最后一扇门只向真正理解谜语意义的人敞开。”
大厅状态4：集齐7枚徽章后`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["hall_7_medals"] = {
    desc: `七枚徽章齐聚的瞬间，大厅中央的石台发出轰鸣，缓缓下沉，露出一条螺旋石梯，石阶向下延伸，消失在淡蓝色的荧光中。七幅抽象画同时燃烧起来——不是真的燃烧，而是化作七色光，汇聚成一道光束，照亮了石梯的入口。

管家站在阴影中，深深鞠躬，声音沙哑：“主人等候已久。请沿着这条路，去揭开最后的谜底。我……在这里等你回来。”
每个房间谜题完成后，自动显示以下文本（可替换房间名称和颜色），然后返回大厅：`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["return_from_"] = {
    desc: `[room]
你将[颜色]徽章收入怀中，最后看了一眼[房间名称]。似乎有什么东西在角落里轻轻叹息，然后一切归于沉寂。当你走出房门时，门在你身后无声地关闭，门把手上的光泽消失了——仿佛它已经完成了自己的使命。

你回到大厅，将徽章与其他徽章并排放在壁炉台上。管家无声地递上一杯热茶，没有多问。
示例（图书馆）：
你将蓝宝石徽章收入怀中，最后看了一眼图书馆。似乎有什么东西在角落里轻轻叹息，然后一切归于沉寂。当你走出房门时，门在你身后无声地关闭，门把手上的光泽消失了——仿佛它已经完成了自己的使命。

你回到大厅，将蓝宝石徽章与其他徽章并排放在壁炉台上。管家无声地递上一杯热茶，没有多问。
当玩家满足支线触发条件时，在返回大厅或进入特定房间时自动显示：
管家支线触发（完成任意三个房间后，返回大厅时）
你走进大厅，发现管家不在往常的位置。壁炉台上压着一张纸条：“我去地下室取些东西，请稍候。” 你拿起纸条，背面隐约有字迹，似乎是被人擦过的痕迹：“不要相信……” 你的直觉告诉你，这位沉默寡言的管家藏着秘密。

*新区域已解锁：管家的起居室（大厅侧门）、地窖（地下室入口旁）。*
画室支线触发（完成画室谜题后，再次进入画室时）
画室的门虚掩着。你推门而入，发现南墙的彩色玻璃窗投下的光斑在地面上拼出一个女人的侧影轮廓。七幅完成的画作中，似乎每一幅里都有一个女子的身影若隐若现。你的手不自觉地抬起，触碰赤色画的表面——画面微微发烫，一个声音在脑海中响起：“他把我画进了每一道光里，却始终画不出我的灵魂。”

*新线索已记录：画背面的文字、紫藤花架的位置。*
地下支线触发（完成地下室谜题后，且至少完成两个其他房间，再次经过地下室入口时）
你经过地下室的入口，注意到旁边的墙壁上有一道之前没见过的裂缝。裂缝很细，但有冷风从里面渗出。你将耳朵贴近，隐约听到有节奏的敲击声——像是有人在用石头敲打岩石，一下，两下，三下，停顿，重复。你询问管家，他的眼神闪烁：“那只是岩壁。” 你知道他在说谎。

*新区域已解锁：地下裂缝通道。*
音乐室支线触发（完成音乐室谜题后，再次经过音乐室时）
当你经过音乐室时，紧闭的门内传出微弱的音乐声——不是管风琴的庄严旋律，而是一把小提琴的独奏，曲调忧伤而优美。你推开门，音乐声戛然而止，空无一人。小提琴的琴弦还有余温，琴谱架上多了一份你从未见过的手稿：《第七交响曲：未完成》。

*新线索已记录：埃莉诺·布莱克伍德的名字、乐器上的夜莺标记。*
所有死亡结局采用以下模板，并在末尾提供选项。我们为已有的死亡场景统一添加此格式。
模板：
[死亡描述文字]

你的意识逐渐模糊。在最后的瞬间，你听见管家奥尔德斯的声音从遥远的地方传来：“鲁莽是解谜的大敌。” 世界陷入黑暗。`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["final_chamber_transition"] = {
    desc: `当第七枚徽章嵌入油画的瞬间，整个卧室都开始震动。油画中的七扇窗户同时亮起，光芒汇聚成一束，射向地面。地板裂开，露出一条螺旋石梯，石阶向下延伸，消失在淡蓝色的荧光中。

管家不知何时站在门口，他的眼中映着七色光：“这条路通往庄园的最深处，也是主人最后的谜题所在。我在这里等你回来。”

你深吸一口气，踏上了石阶。身后的光芒逐渐暗淡，前方的黑暗却透出微弱的荧光。石梯似乎很长，每一步都回荡着你的心跳。螺旋下降的墙壁上刻着七道谜题的缩影——图书馆的星盘、钟楼的齿轮、音乐室的音符……你走过的路在身后化作星光。

不知走了多久，你终于看到一扇敞开的石门。门楣上刻着一行字：“最后的谜题，是你自己。”

你跨过门槛，进入了中央密室。
在每个结局后添加统一的重玩界面：`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

scenes["game_over"] = {
    desc: `—— 游戏结束 ——

你解锁的结局：[结局名称]

本次游玩解锁的成就：[成就列表，如有]`,
    options: [
        { text: "返回大厅", target: "hall_main" }
    ]
};

})();

