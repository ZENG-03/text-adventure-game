import re, os

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# move all "def hall_main_enter" to the top
text = text.replace('    def hall_main_enter(state):', '')
text = text.replace("""        count = state.get("hall_medal_count", 0)
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
        return None""", '')

hall_func = """    def hall_main_enter(state):
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
        return None\n\n"""

text = text.replace('    scenes = {}', '    scenes = {}\n\n' + hall_func)

with open('data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Moved function.")
