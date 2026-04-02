import os

target_file = 'tests/test_scene_regression.py'
with open(target_file, 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'side_quest_butler_done': 'side_butler_completed',
    'sq_butler_done': 'side_butler_completed',
    'sq_paint_full': 'side_painting_completed',
    'sq_underground_full': 'side_underground_completed',
    'sq_music_full': 'side_music_completed',
    'side_quest_clock_done': 'side_clock_completed',
    'sq_clock': 'side_clock_completed',
}
for old, new in replacements.items():
    text = text.replace('"' + old + '"', '"' + new + '"')
    text = text.replace("'" + old + "'", "'" + new + "'")

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(text)
