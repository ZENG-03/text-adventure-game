with open("js/game-engine.js", "r", encoding="utf-8") as f:
    text = f.read()

old_intercept = """    // --- 拦截逻辑：支线和动态事件探测 ---
    if (sceneId === "hall_main" && gameState.hall_medal_count >= 3 && !getFlag("flag_butler_triggered")) {
        setFlag("flag_butler_triggered", true);
        sceneId = "side_story_1_start";
    } else if (sceneId === "studio_entry" && hasItem("色彩徽章") && !getFlag("flag_side_painting_triggered")) {
        setFlag("flag_side_painting_triggered", true);
        sceneId = "side_story_2_start";
    } else if (sceneId === "basement_entry" && hasItem("深渊徽章") && !getFlag("flag_side_underground_triggered")) {
        setFlag("flag_side_underground_triggered", true);
        sceneId = "side_story_3_start";
    } else if (sceneId === "musicroom_entry" && hasItem("旋律徽章") && !getFlag("flag_side_music_triggered")) {
        setFlag("flag_side_music_triggered", true);
        sceneId = "side_story_4_start";
    }"""

new_intercept = """    // --- 拦截逻辑：支线和动态事件探测 ---
    if (sceneId === "hall_main" && gameState.hall_medal_count >= 3 && !getFlag("flag_butler_triggered")) {
        setFlag("flag_butler_triggered", true);
        window.scenes["sys_side_story_1_trigger"] = {
            desc: "你抱着刚获得的徽章返回大厅，却发现周围安静得可怕...\\n管家奥尔德斯不在大厅，只留下一张烧焦了一半的纸条...（支线任务触发）",
            options: [{ text: "检查纸条", target: "side_story_1_start" }]
        };
        sceneId = "sys_side_story_1_trigger";
    } else if (sceneId === "studio_entry" && hasItem("色彩徽章") && !getFlag("flag_side_painting_triggered")) {
        setFlag("flag_side_painting_triggered", true);
        window.scenes["sys_side_story_2_trigger"] = {
            desc: "当你返回画室，这里的气氛变了。南墙彩色玻璃窗投下的光斑在地面上拼出一个女人的侧影轮廓...（支线任务触发）",
            options: [{ text: "靠近观察", target: "side_story_2_start" }]
        };
        sceneId = "sys_side_story_2_trigger";
    } else if (sceneId === "basement_entry" && hasItem("深渊徽章") && !getFlag("flag_side_underground_triggered")) {
        setFlag("flag_side_underground_triggered", true);
        window.scenes["sys_side_story_3_trigger"] = {
            desc: "地下室墙后的低语声越发强烈，你手中的深渊徽章也在微微发热...（支线任务触发）",
            options: [{ text: "继续探索", target: "side_story_3_start" }]
        };
        sceneId = "sys_side_story_3_trigger";
    } else if (sceneId === "musicroom_entry" && hasItem("旋律徽章") && !getFlag("flag_side_music_triggered")) {
        setFlag("flag_side_music_triggered", true);
        window.scenes["sys_side_story_4_trigger"] = {
            desc: "即使你已经破解了管风琴，当你要踏出音乐室时，钢琴那里却响起了熟悉的旋律，这一次它不是你弹奏的...（支线任务触发）",
            options: [{ text: "回去看看", target: "side_story_4_start" }]
        };
        sceneId = "sys_side_story_4_trigger";
    }"""
text = text.replace(old_intercept, new_intercept)

old_ending_options = """        } else if (isEndingScene) {
            options.push({ text: "返回主界面", target: "title" });
            options.push({ text: "返回大厅", target: "hall_main" });
        }"""
new_ending_options = """        } else if (isEndingScene && sceneId !== "game_over") {
            // 所有结局统一跳转到 game_over 进行结算
            options.push({ text: "查看成就与轮回信息", target: "game_over" });
        } else if (sceneId === "game_over") {
            options.push({ text: "返回主界面", target: "title" });
            options.push({ text: "带着记忆苏醒 (开启多周目)", target: "opening_studio_ng_plus", condition: () => globalState.endingsReached.length > 0 });
        }"""
text = text.replace(old_ending_options, new_ending_options)

# For "补充房间完成后的过渡描述": Let's add room transition before reaching hall_main 
text = text.replace("} else if(sceneId.startsWith(\"final\")) locationStr = \"中央密室\";", 
"""} else if(sceneId.startsWith("final")) locationStr = "中央密室";

    // 动态添加房间离开过渡如果刚刚获得了新徽章
    if (sceneId === "hall_main") {
        let prevMedalCount = gameState.last_hall_medal_count || 0;
        if (gameState.hall_medal_count > prevMedalCount) {
            let transitionId = "sys_room_exit_transition";
            window.scenes[transitionId] = {
                desc: "你将刚刚获得的徽章小心翼翼地收好，长舒了一口气。\\n伴随着沉重的锁舌闭合声，这扇门在你身后缓缓关上，你再次回到了冰冷的大厅，但你的心境已经不再相同。",
                options: [{ text: "继续探索大厅", target: "hall_main" }]
            };
            gameState.last_hall_medal_count = gameState.hall_medal_count;
            renderScene(transitionId);
            return;
        }
        gameState.last_hall_medal_count = gameState.hall_medal_count;
    }""")

with open("js/game-engine.js", "w", encoding="utf-8") as f:
    f.write(text)
print("js/game-engine.js has been successfully updated!")
