import re

with open("build_js_all.py", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(r'^\*\*(?:获得线索|状态', r'^\*\*(?:消耗物品|失去物品|获得线索|状态')
with open("build_js_all.py", "w", encoding="utf-8") as f:
    f.write(text)
print("Patched regex!")
