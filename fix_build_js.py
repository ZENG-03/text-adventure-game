import re
with open("build_js_all.py", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure we don't have duplicated 'elif "消耗物品" in eff or "失去物品" in eff:' blocks first
import re
new_content = re.sub(
    r'(\s*elif "消耗物品" in eff or "失去物品" in eff:.*?)(?=\s*elif "状态" in eff:)',
    r'\1',
    content,
    flags=re.DOTALL
)

old_block = """                elif (
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
                    )
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        cond_item = items[0]
                        js_lines.append(f'        if(!hasItem("{cond_item}")) {{')
                        js_lines.append(f'            gameState.items.push("{cond_item}");')
                        if "怀表" in cond_item:
                            js_lines.append("            addMedal();")
                        js_lines.append(
                            f'            msg += `<div class="system-message">【获得物品】：{item_part}</div>`;'
                        )
                        js_lines.append("        }")"""

new_block = """                elif "消耗物品" in eff or "失去物品" in eff:
                    item_part = eff.split("：", 1)[1].strip() if "：" in eff else re.sub(r"^(消耗|失去)(物品|道具)?[：]?", "", eff).strip()
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
                    )
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        cond_item = items[0]
                        js_lines.append(f'        if(!hasItem("{cond_item}")) {{')
                        js_lines.append(f'            gameState.items.push("{cond_item}");')
                        if "怀表" in cond_item:
                            js_lines.append("            addMedal();")
                        js_lines.append(
                            f'            msg += `<div class="system-message">【获得物品】：{item_part}</div>`;'
                        )
                        js_lines.append("        }")"""

new_content = new_content.replace(old_block, new_block)

# Remove the trailing original "消耗物品" block
trailing_block = """                elif "消耗物品" in eff or "失去物品" in eff:
                    item_part = eff.split("：", 1)[1].strip() if "：" in eff else re.sub(r"^(消耗|失去)(物品|道具)?[：]?", "", eff).strip()
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        for item in items:
                            js_lines.append(f'        if(hasItem("{item}")) {{')
                            js_lines.append(f'            removeItem("{item}");')
                            js_lines.append(f'            msg += `<div class="system-message danger-message">【失去物品】：{item}</div>`;')
                            js_lines.append("        }")
                elif "消耗物品" in eff or "失去物品" in eff:
                    item_part = eff.split("：", 1)[1].strip() if "：" in eff else re.sub(r"^(消耗|失去)(物品|道具)?[：]?", "", eff).strip()
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        for item in items:
                            js_lines.append(f'        if(hasItem("{item}")) {{')
                            js_lines.append(f'            removeItem("{item}");')
                            js_lines.append(f'            msg += `<div class="system-message danger-message">【失去物品】：{item}</div>`;')
                            js_lines.append("        }")"""
new_content = new_content.replace(trailing_block, "")

# remove duplicate if there's any just in case
new_content = re.sub(
    r'(                elif "消耗物品" in eff or "失去物品" in eff:.*?)(?=\n                elif "消耗物品" in eff or "失去物品" in eff:)',
    '',
    new_content,
    flags=re.DOTALL
)

with open("build_js_all.py", "w", encoding="utf-8") as f:
    f.write(new_content)
