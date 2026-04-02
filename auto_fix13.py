import re, os

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. musicroom_entry
music_func = """def musicroom_enter(state):
        if state.has_item("旋律徽章") and not state.get("flag_side_music_triggered"):
            state.set("flag_side_music_triggered", True)
            return {"type": "redirect", "target": "side_story_4_start"}

    scenes["musicroom_entry"] = Scene(
        "musicroom_entry","""
text = text.replace(
    'scenes["musicroom_entry"] = Scene(\n        "musicroom_entry",',
    music_func,
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

    scenes["studio_entry"] = Scene(
        "studio_entry","""
text = text.replace(
    'scenes["studio_entry"] = Scene(\n        "studio_entry",',
    studio_func,
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

    scenes["basement_entry"] = Scene(
        "basement_entry","""
text = text.replace(
    'scenes["basement_entry"] = Scene(\n        "basement_entry",',
    basement_func,
)
text = re.sub(
    r'(scenes\["basement_entry"\] = Scene\([\s\S]*?\[[\s\S]*?\])\n    \)',
    r'\1,\n        on_enter=basement_enter\n    )',
    text
)

# 4. hall_main
# Second one
hall_func = """def hall_main_enter(state):
        count = state.get("hall_medal_count", 0)
        if count >= 3 and not state.get("flag_butler_triggered"):
            state.set("flag_butler_triggered", True)
            return {"type": "redirect", "target": "side_story_1_start"}
            
        desc = \"\"\"你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。
壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。\"\"\"
        if count >= 5:
            desc += "\\n\\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]"
        elif count >= 3:
            desc += "\\n\\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]"
            
        if state.current_scene:
            state.current_scene.desc = desc
        return None

    scenes["hall_main"] = Scene(
        "hall_main","""
# Because hall_main is duplicated, we split by the last one
parts = text.rsplit('scenes["hall_main"] = Scene(\n        "hall_main",', 1)
if len(parts) == 2:
    text = parts[0] + hall_func + parts[1]
    
text = re.sub(
    r'(scenes\["hall_main"\] = Scene\(\n        "hall_main",[\s\S]*?\[[\s\S]*?\])\n    \)',
    r'\1,\n        on_enter=hall_main_enter\n    )',
    text
)

repls = {
    'side_quest_basement_done': 'side_underground_completed',
    'side_quest_clock_done': 'side_clock_completed',
    'side_quest_music_done': 'side_music_completed',
    'side_quest_butler_done': 'side_butler_completed',
    'sq_butler_done': 'side_butler_completed',
    'sq_paint_full': 'side_painting_completed',
    'sq_underground_full': 'side_underground_completed',
    'sq_music_full': 'side_music_completed',
    'sq_clock': 'side_clock_completed'
}
for old, new in repls.items():
    text = text.replace(old, new)


with open('data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("data.py rewritten.")
