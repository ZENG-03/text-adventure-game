import os, glob, re

all_scenes = set()
all_targets = set()

for path in glob.glob("文本/*.txt"):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
    
    for sid in re.findall(r'场景ID[：:]\s*([a-zA-Z0-9_]+)', text):
        all_scenes.add(sid)
        
    for target in re.findall(r'\[前往\s+([a-zA-Z0-9_]+)\]', text):
        all_targets.add(target)

missing = all_targets - all_scenes
allowed_missing = {"title", "hall_main", "opening_studio"}
missing = missing - allowed_missing

if missing:
    with open("文本/补充3-自动补全缺失场景.txt", 'w', encoding='utf-8') as f:
        f.write("# 自动生成的缺失场景占位\n")
        f.write("# 这个文件包含了所有带有 [前往 XXX] 但是没有对应定义的场景。\n\n")
        
        for m in sorted(missing):
            if m == "hall_injured":
                f.write(f"场景ID：{m}\n")
                f.write(f"描述：你受伤了，剧烈的疼痛让你无法继续当前的探索。你只能跌跌撞撞地回到大厅休息，处理伤口。\n\n")
                f.write(f"**选项：**\n- 返回大厅 [前往 hall_main]\n\n")
            elif m == "library_fail":
                f.write(f"场景ID：{m}\n")
                f.write(f"描述：你拉动了书籍，但似乎缺少了什么核心条件，装置发出刺耳的摩擦声后彻底卡死了。目前无法继续操作。\n\n")
                f.write(f"**选项：**\n- 返回大厅 [前往 hall_main]\n\n")
            else:
                f.write(f"场景ID：{m}\n")
                f.write(f"描述：【系统提示】该区域（{m}）细节尚未实装，你发现前路被浓密的雾气封锁，被迫退回大厅。\n\n")
                f.write(f"**选项：**\n- 返回大厅 [前往 hall_main]\n\n")
    print(f"Generated placeholders for {len(missing)} missing scenes.")
else:
    print("No missing scenes.")
