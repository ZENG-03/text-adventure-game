with open("build_js_all.py", "r", encoding="utf-8") as f:
    text = f.read()

import re

target_block1 = """                if (
                    "获得物品" in eff
                    or "获得奖励" in eff
                    or "奖励：" in eff
                    or "物品：" in eff
                    or "获得：" in eff
                    or "获得道具" in eff
                    or "获取" in eff
                ):"""

target_block2 = """                elif "消耗物品" in eff or "失去物品" in eff:"""

# We need to swap the first `if "获得"` block and `elif "消耗"` block.
# Actually, the easiest is to just modify the condition for `if "获得"` to exclude `"失去"` and `"消耗"`.

new_block1 = """                if "消耗物品" in eff or "失去物品" in eff:
                    item_part = eff.split("：", 1)[1].strip() if "：" in eff else re.sub(r"^(消耗|失去)(物品|道具)?[：]?", "", eff).strip()
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        for item in items:
                            js_lines.append(f'        if(hasItem("{item}")) {{')
                            js_lines.append(f'            removeItem("{item}");')
                            js_lines.append(f'            msg += `<div class="system-message danger-message">【失去物品】：{item}</div>`;')
                            js_lines.append("        }")
                elif (
                    "获得物品" in eff
                    or "获得奖励" in eff
                    or "奖励：" in eff
                    or "物品：" in eff
                    or "获得：" in eff
                    or "获得道具" in eff
                    or "获取" in eff
                ):"""

replaced = re.sub(
    r'                if \(\n                    "获得物品" in eff\n[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+\n                \):.*?                elif "消耗物品" in eff or "失去物品" in eff:(.*?                \}\n)',
    new_block1,
    text,
    flags=re.DOTALL
)

with open("build_js_all.py", "w", encoding="utf-8") as f:
    f.write(replaced)

print("Patched correctly if sizes differ. Sizes:", len(text), len(replaced))
