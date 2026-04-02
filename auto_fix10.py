import re

with open('data.py', 'r', encoding='utf-8') as f:
    t = f.read()

t = re.sub(r'def musicroom_enter\(state\):\n', '    def musicroom_enter(state):\n', t)
t = re.sub(r'def studio_enter\(state\):\n', '    def studio_enter(state):\n', t)
t = re.sub(r'def basement_enter\(state\):\n', '    def basement_enter(state):\n', t)

t = t.replace('    # 音乐室支线触发: 完成音乐室获得旋律徽章后\n', '        # 音乐室支线触发: 完成音乐室获得旋律徽章后\n')
t = t.replace('    if state.has_item("旋律徽章")', '        if state.has_item("旋律徽章")')
t = t.replace('        state.set("flag_side_music_triggered"', '            state.set("flag_side_music_triggered"')
t = re.sub(r'        return \{"type": "redirect", "target": "side_story_4_start"\}\n', '            return {"type": "redirect", "target": "side_story_4_start"}\n', t)

t = t.replace('    if state.has_item("色彩徽章")', '        if state.has_item("色彩徽章")')
t = t.replace('        state.set("flag_side_painting_triggered"', '            state.set("flag_side_painting_triggered"')
t = re.sub(r'        return \{"type": "redirect", "target": "side_story_2_start"\}\n', '            return {"type": "redirect", "target": "side_story_2_start"}\n', t)

t = t.replace('    if state.has_item("深渊徽章")', '        if state.has_item("深渊徽章")')
t = t.replace('        state.set("flag_side_underground_triggered"', '            state.set("flag_side_underground_triggered"')
t = re.sub(r'        return \{"type": "redirect", "target": "side_story_3_start"\}\n', '            return {"type": "redirect", "target": "side_story_3_start"}\n', t)

with open('data.py', 'w', encoding='utf-8') as f:
    f.write(t)
print("Indents fixed")
