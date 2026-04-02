import os

target_file = 'data.py'
with open(target_file, 'r', encoding='utf-8') as f:
    text = f.read()

bedroom = 'Option("前往卧室", "bedroom_entry"),'
studio = 'Option("前往二楼画室 (谜题五)", "studio_entry"),'
if bedroom not in text:
    text = text.replace(studio, studio + '\n            ' + bedroom)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(text)
