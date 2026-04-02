import re

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# remove old bad indent definition
text = re.sub(r'    def hall_main_enter\(state\):\n(?:.*\n){1,20}scenes\["hall_main"\] = Scene\(', 'scenes["hall_main"] = Scene(', text)

# Insert nice explicitly formatted definition
good_hall = """
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

text = text.replace('scenes["hall_main"] = Scene(', good_hall)
with open('data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done rewrite")
