import re

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. musicroom_entry
# Find musicroom_entry Definition
# scenes["musicroom_entry"] = Scene( ... )
music_func = """def musicroom_enter(state):
    # 音乐室支线触发: 完成音乐室获得旋律徽章后
    if state.has_item("旋律徽章") and not state.get("flag_side_music_triggered"):
        state.set("flag_side_music_triggered", True)
        return {"type": "redirect", "target": "side_story_4_start"}
"""
text = text.replace(
    'scenes["musicroom_entry"] = Scene(\n        "musicroom_entry",',
    music_func + '\n    scenes["musicroom_entry"] = Scene(\n        "musicroom_entry",',
)
text = re.sub(
    r'(scenes\["musicroom_entry"\] = Scene\([\s\S]*?\[[\s\S]*?\])\n    \)',
    r'\1,\n        on_enter=musicroom_enter\n    )',
    text
)

# 2. studio_entry
studio_func = """def studio_enter(state):
    if state.has_item("色彩徽章") and not state.get("flag_side_painting_triggered"):
        state.set("flag_side_painting_triggered", True)
        return {"type": "redirect", "target": "side_story_2_start"}
"""
text = text.replace(
    'scenes["studio_entry"] = Scene(\n        "studio_entry",',
    studio_func + '\n    scenes["studio_entry"] = Scene(\n        "studio_entry",',
)
text = re.sub(
    r'(scenes\["studio_entry"\] = Scene\([\s\S]*?\[[\s\S]*?\])\n    \)',
    r'\1,\n        on_enter=studio_enter\n    )',
    text
)

# 3. basement_entry
basement_func = """def basement_enter(state):
    if state.has_item("深渊徽章") and not state.get("flag_side_underground_triggered"):
        state.set("flag_side_underground_triggered", True)
        return {"type": "redirect", "target": "side_story_3_start"}
"""
text = text.replace(
    'scenes["basement_entry"] = Scene(\n        "basement_entry",',
    basement_func + '\n    scenes["basement_entry"] = Scene(\n        "basement_entry",',
)
text = re.sub(
    r'(scenes\["basement_entry"\] = Scene\([\s\S]*?\[[\s\S]*?\])\n    \)',
    r'\1,\n        on_enter=basement_enter\n    )',
    text
)

# 4. hall_main
# For hall_main, we have to handle dynamic description + side_story_1_start
# Find the second hall_main
hall_func = """def hall_main_enter(state):
    # 动态描述
    count = state.get("hall_medal_count", 0)
    desc = \"\"\"你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。
壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。\"\"\"
    if count >= 3:
        desc += "\\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]"
    elif count >= 5:
        desc += "\\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]"
        
    # Python版的动态描述注入有点麻烦，如果直接改self.current_scene.desc
    # 或者直接在这里返回redirect
    if count >= 3 and not state.get("flag_butler_triggered"):
        state.set("flag_butler_triggered", True)
        return {"type": "redirect", "target": "side_story_1_start"}
    
    # 因为Python版的Scene不能动态改变desc，我们就不动态变了或者直接在这改scene对象
    return None
"""
text = text.replace(
    'scenes["hall_main"] = Scene(\n        "hall_main",\n        """你站在大厅中央。',
    hall_func + '\n    scenes["hall_main"] = Scene(\n        "hall_main",\n        """你站在大厅中央。'
)
# Ensure on_enter is replaced for the second hall_main definition
text = re.sub(
    r'(scenes\["hall_main"\] = Scene\(\n        "hall_main",[\s\S]*?\[[\s\S]*?\])\n    \)',
    r'\1,\n        on_enter=hall_main_enter\n    )',
    text
)

with open('data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("data.py patched for on_enter jumps.")
