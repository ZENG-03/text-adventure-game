# auto_fix.py
import re
import os
import glob

# 1. 替换所有旧的支线标志
replacements = {
    'side_quest_butler_done': 'side_butler_completed',
    'sq_butler_done': 'side_butler_completed',
    'sq_paint_full': 'side_painting_completed',
    'sq_underground_full': 'side_underground_completed',
    'sq_music_full': 'side_music_completed',
    'sq_clock': 'side_clock_completed',
    'hall': 'hall_main'
}

def apply_replacements(text):
    for old, new in replacements.items():
        if old == 'hall':
            # 只替换独立作为目标ID或字符串时的hall
            text = re.sub(r'\"hall\"', '"hall_main"', text)
            text = re.sub(r'\'hall\'', "'hall_main'", text)
        else:
            text = text.replace(old, new)
    return text

files_to_fix = ['data.py', 'js/game-scenes.js', 'js/game-engine.js'] + glob.glob('文本/*.txt')

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = apply_replacements(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("标志名和 hall->hall_main 替换完成！")
