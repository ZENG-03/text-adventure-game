import re

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Python scripts should be indented by 4 spaces inside build_scenes()
music_func = """    def musicroom_enter(state):
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

studio_func = """    def studio_enter(state):
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

basement_func = """    def basement_enter(state):
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

def remove_hall_func(text):
    return re.sub(r'    def hall_main_enter\(state\):\n(?:.*\n){1,20}scenes\["hall_main"\] = Scene\(', 'scenes["hall_main"] = Scene(', text)

text = remove_hall_func(text)

hall_func = """
    def hall_main_enter(state):
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

    scenes["hall_main"] = Scene("""

# We prepended to the LAST hall_main definition
parts = text.rsplit('scenes["hall_main"] = Scene(', 1)
if len(parts) == 2:
    new_text = parts[0] + hall_func + '"hall_main",' + parts[1].split('"hall_main",', 1)[1]
    
    new_text = re.sub(
        r'(scenes\["hall_main"\] = Scene\(\s*"hall_main",[\s\S]*?\])\s*\)',
        r'\1,\n        on_enter=hall_main_enter\n    )',
        new_text
    )
    text = new_text

with open('data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("data.py patched")
