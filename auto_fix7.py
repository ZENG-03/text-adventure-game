import re

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# remove all def hall_main_enter and their injections
def remove_hall_func(text):
    return re.sub(r'def hall_main_enter\(state\):[\s\S]*?(?=scenes\["hall_main"\])', '', text)

text = remove_hall_func(text)

hall_func = """def hall_main_enter(state):
    # 动态描述 和 管家触发
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
        
    state.current_scene.desc = desc
    return None

"""

# We only prepend to the LAST hall_main definition
parts = text.rsplit('scenes["hall_main"] = Scene(', 1)
if len(parts) == 2:
    new_text = parts[0] + hall_func + 'scenes["hall_main"] = Scene(' + parts[1]
    
    # ensure the last hall_main has on_enter=hall_main_enter
    new_text = re.sub(
        r'(scenes\["hall_main"\] = Scene\(\s*"hall_main",[\s\S]*?\])\s*\)',
        r'\1,\n        on_enter=hall_main_enter\n    )',
        new_text
    )
    with open('data.py', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Fixed hall_main logic")
else:
    print("Could not split data.py")
