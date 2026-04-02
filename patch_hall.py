with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re

target = r'''    # --- 大厅与分支 ---
    scenes\["hall_main"\] = Scene\(
        "hall_main",
        """(.*?)""",
        \[
            Option\("仔细观察大厅壁炉的纸片", "hall_fireplace"\),
            Option\("检查大厅的雕像 \(谜题一\)", "puzzle_statues"\),
            Option\("前往图书馆 \(谜题二\)", "library_entry"\)
        \],
        on_enter=hall_main_enter
    \)'''

new_text = re.sub(target, "    # --- 大厅初始逻辑 --- ", text, flags=re.DOTALL)
if new_text != text:
    with open('data.py', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Deleted first hall_main")
else:
    print("Could not find the target to delete")
