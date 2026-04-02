import os, glob, re

all_scenes = set()
all_targets = set()

for path in glob.glob("文本/*.txt"):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
    
    # 提取所有 场景ID: xxx
    for sid in re.findall(r'场景ID[：:]\s*([a-zA-Z0-9_]+)', text):
        all_scenes.add(sid)
        
    # 提取所有 [前往 xxx]
    for target in re.findall(r'\[前往\s+([a-zA-Z0-9_]+)\]', text):
        all_targets.add(target)

missing = all_targets - all_scenes
# 还有一些在 data.py 里的目标如 title, ending_X 等
allowed_missing = {"title", "hall_main", "opening_studio"}

missing = missing - allowed_missing
print(f"Total defined scenes: {len(all_scenes)}")
print(f"Total target links: {len(all_targets)}")
print(f"Missing targets ({len(missing)}):")
for m in sorted(missing):
    print(f" - {m}")
