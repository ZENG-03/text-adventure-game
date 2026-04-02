import re

with open("build_js_all.py", "r", encoding="utf-8") as f:
    text = f.read()

original_block = """                elif (
                    "获得奖励" in eff
                    or "获得物品" in eff
                    or "奖励：" in eff
                    or "物品：" in eff
                    or (eff.startswith("获得") and "线索" not in eff)
                ):
                    item_part = (
                        eff.split("：", 1)[1].strip()
                        if "：" in eff
                        else re.sub(r"^获得(奖励|物品)?[：:]?", "", eff).strip()
                    )"""

new_block = """                elif "消耗物品" in eff or "失去物品" in eff:
                    item_part = eff.split("：", 1)[1].strip() if "：" in eff else re.sub(r"^(消耗|失去)(物品|道具)?[：:]?", "", eff).strip()
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        for item in items:
                            js_lines.append(f'        if(hasItem("{item}")) {{')
                            js_lines.append(f'            removeItem("{item}");')
                            js_lines.append(f'            msg += `<div class="system-message danger-message">【失去物品】：{item}</div>`;')
                            js_lines.append("        }")
                elif (
                    "获得奖励" in eff
                    or "获得物品" in eff
                    or "奖励：" in eff
                    or ("物品：" in eff and "失去" not in eff and "消耗" not in eff)
                    or (eff.startswith("获得") and "线索" not in eff)
                ):
                    item_part = (
                        eff.split("：", 1)[1].strip()
                        if "：" in eff
                        else re.sub(r"^获得(奖励|物品)?[：:]?", "", eff).strip()
                    )"""

if original_block in text:
    new_text = text.replace(original_block, new_block)
    with open("build_js_all.py", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Successfully patched item loss logic!")
else:
    print("Could not find the original block.")