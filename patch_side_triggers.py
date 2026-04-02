import re

with open("js/game-engine.js", "r", encoding="utf-8") as f:
    engine_text = f.read()

# 1. Strip dynamic window.scenes assignments
to_remove = [
    r'window\.scenes\["sys_side_story_1_trigger"\] = \{\s*desc: "你抱着刚获得的徽章返回大厅，却发现周围安静得可怕\.\.\.\\n管家奥尔德斯不在大厅，只留下一张烧焦了一半的纸条\.\.\.（支线任务触发）",\s*options: \[\{ text: "检查纸条", target: "side_story_1_start" \}\]\s*\};\s*',
    r'window\.scenes\["sys_side_story_2_trigger"\] = \{\s*desc: "当你返回画室，这里的气氛变了。南墙彩色玻璃窗投下的光斑在地面上拼出一个女人的侧影轮廓\.\.\.（支线任务触发）",\s*options: \[\{ text: "靠近观察", target: "side_story_2_start" \}\]\s*\};\s*',
    r'window\.scenes\["sys_side_story_3_trigger"\] = \{\s*desc: "地下室墙后的低语声越发强烈，你手中的深渊徽章也在微微发热\.\.\.（支线任务触发）",\s*options: \[\{ text: "继续探索", target: "side_story_3_start" \}\]\s*\};\s*',
    r'window\.scenes\["sys_side_story_4_trigger"\] = \{\s*desc: "即使你已经破解了管风琴，当你要踏出音乐室时，钢琴那里却响起了熟悉的旋律，这一次它不是你弹奏的\.\.\.（支线任务触发）",\s*options: \[\{ text: "回去看看", target: "side_story_4_start" \}\]\s*\};\s*'
]

for pat in to_remove:
    engine_text = re.sub(pat, '', engine_text)

# 2. Add dynamic description for hall_main
dyn_desc_code = """
    // 动态计算 hall_main 的描述
    if (sceneId === "hall_main") {
        let extra = [];
        let completedCount = gameState.hall_medal_count || 0;
        if (completedCount >= 1) extra.push("几座大理石雕像的底座上隐约亮起了光晕，似乎感知到了你解开谜题的成就。");
        if (completedCount >= 4) extra.push("大理石地面上的纹路开始流转变幻，勾勒出了残缺不全的庄园阵法图。");
        if (completedCount >= 7) extra.push("通往中央密室的大门正在这股力量下隆隆震动，深邃的走廊中吹来冰凉的寒风！");
        
        let sceneObj = window.scenes["hall_main"];
        // Ensure we preserve the base text
        if (!sceneObj._baseDesc) {
            sceneObj._baseDesc = sceneObj.desc;
        }
        sceneObj.desc = sceneObj._baseDesc + (extra.length > 0 ? "\\n\\n" + extra.join("\\n") : "");
    }
"""

if "// 动态计算 hall_main" not in engine_text:
    engine_text = engine_text.replace('const scene = window.scenes[sceneId];', dyn_desc_code + '\n    const scene = window.scenes[sceneId];')

with open("js/game-engine.js", "w", encoding="utf-8") as f:
    f.write(engine_text)


# 3. Add static definitions to js/game-scenes.js
static_triggers = """
// 静态定义的支线中转触发
scenes["sys_side_story_1_trigger"] = {
    desc: "你抱着刚获得的徽章返回大厅，却发现周围安静得可怕...\\n管家奥尔德斯不在大厅，只留下一张烧焦了一半的纸条...（支线任务触发）",
    options: [{ text: "检查纸条", target: "side_story_1_start" }]
};

scenes["sys_side_story_2_trigger"] = {
    desc: "当你返回画室，这里的气氛变了。南墙彩色玻璃窗投下的光斑在地面上拼出一个女人的侧影轮廓...（支线任务触发）",
    options: [{ text: "靠近观察", target: "side_story_2_start" }]
};

scenes["sys_side_story_3_trigger"] = {
    desc: "地下室墙后的低语声越发强烈，你手中的深渊徽章也在微微发热...（支线任务触发）",
    options: [{ text: "继续探索", target: "side_story_3_start" }]
};

scenes["sys_side_story_4_trigger"] = {
    desc: "即使你已经破解了管风琴，当你要踏出音乐室时，钢琴那里却响起了熟悉的旋律，这一次它不是你弹奏的...（支线任务触发）",
    options: [{ text: "回去看看", target: "side_story_4_start" }]
};

"""

with open("js/game-scenes.js", "r", encoding="utf-8") as f:
    scenes_text = f.read()

if "scenes[\"sys_side_story_1_trigger\"] =" not in scenes_text:
    scenes_text = scenes_text.replace('// --- 自动生成的', static_triggers + '// --- 自动生成的')
    with open("js/game-scenes.js", "w", encoding="utf-8") as f:
        f.write(scenes_text)

print("Patched Dynamic Description and Side Triggers!")
