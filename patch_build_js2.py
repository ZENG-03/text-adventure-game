import re

with open("build_js_all.py", "r", encoding="utf-8") as f:
    text = f.read()

old_if = """                elif "若有" in cond_str:
                    opt_line += ', condition: () => hasItem("生命之露")'"""

new_if = """                elif "若有" in cond_str:
                    # extracts item name from text e.g. "嵌入机械齿轮（若有）"
                    match = re.search(r"([^\s（]+)（", text)
                    if match:
                        item_name = match.group(1).replace("嵌入", "").replace("消耗", "").replace("使用", "").strip()
                    else:
                        item_name = "生命之露"
                    opt_line += f', condition: () => hasItem("{item_name}")'"""

text = text.replace(old_if, new_if)

with open("build_js_all.py", "w", encoding="utf-8") as f:
    f.write(text)
