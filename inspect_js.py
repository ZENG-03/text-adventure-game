import re

with open("build_js_all.py", "r", encoding="utf-8") as f:
    text = f.read()

# Let's find where to patch
# We just need to find: `elif (\n                    "获得奖励" in eff` and patch the blocks.
# Actually, the easiest is to read the file, find the huge `if "更新标签" in eff:` block and print it.

print(text.find('if "更新标签" in eff:'))
