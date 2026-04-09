# -*- coding: utf-8 -*-
"""
从 文本/*.txt 解析场景，写入 js/game-scenes.js 中「自动生成的」区块。
保留文件开头手写场景（至第一个 // --- 自动生成的），并保留末尾 IIFE 闭合。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TEXT_DIR = ROOT / "文本"
SCENES_JS = ROOT / "src" / "data" / "game-scenes.js"

AUTO_MARKER = "// --- 自动生成的"

# 绝不覆盖：与引擎/主线手写强绑定的场景（仅当它们出现在手写区时跳过 txt 版本）
EXTRA_RESERVED = frozenset({
    "system_load_auto",
})

# 手写区必须保留、不允许被任何 txt 覆盖的枢纽场景
PROTECTED_IDS = frozenset({
    "title",
    "opening_studio_ng_plus",
    "opening_studio",
    "opening_studio_map",
    "opening_gate",
    "hall_initial_enter",
    "hall_history",
    "hall_main",
    "hall_fireplace",
    "puzzle_statues",
    "statues_solved",
    "ending_1",
    "ending_2",
    "ending_3",
    "ending_4",
    "game_over",
})

# 来自这些文件的场景 ID 允许覆盖「手写区」里同名定义（后生成的块会覆盖先赋值的 scenes）
EXPANSION_FILE_KEYWORDS = ("谜题-", "支线", "大结局.txt", "补充2.txt")

FILES = [
    "文本/补充1.txt",
    "文本/补充2.txt",
    "文本/补全占位.txt",
    "文本/谜题-地下室.txt",
    "文本/谜题-画室.txt",
    "文本/谜题-图书馆.txt",
    "文本/谜题-温室.txt",
    "文本/谜题-卧室.txt",
    "文本/谜题-音乐室.txt",
    "文本/谜题-钟楼.txt",
    "文本/支线1.txt",
    "文本/支线2.txt",
    "文本/支线3.txt",
    "文本/支线4.txt",
    "文本/大结局.txt",
    "文本/主线.txt",
    "文本/主线2.txt",
    "文本/主线3_补全内容.txt",
    "文本/主线4_机关与结局.txt",
]


def js_str(value: str) -> str:
    """
    转义字符串中的特殊字符，使其可以安全地用于JavaScript代码中
    
    Args:
        value (str): 需要转义的字符串
    
    Returns:
        str: 转义后的字符串
    """
    return value.replace("\\", "\\\\").replace('"', '\\"').replace("`", "\\`")


def parse_txt(file_path: Path) -> dict:
    """
    解析文本文件中的场景定义
    
    该函数读取指定文本文件，解析其中的场景定义，
    包括场景描述、选项、条件、效果和结局标记。
    
    Args:
        file_path (Path): 要解析的文本文件路径
    
    Returns:
        dict: 场景字典，键为场景ID，值为场景数据对象
        
        场景数据对象包含：
            - desc: 场景描述文本
            - options: 选项列表，每个选项包含 text、target、cond_str
            - effs: 效果列表
            - mark_ending: 结局标记
            - item_selection: 物品选择配置
    """
    # 检查文件是否存在
    if not file_path.is_file():
        print(f"Skipping missing file: {file_path}")
        return {}
    # 读取文件内容
    content = file_path.read_text(encoding="utf-8", errors="ignore")

    parts = re.split(r"场景ID:\s*([A-Za-z0-9_]+)", content)
    scenes = {}
    local_seen: set[str] = set()
    for i in range(1, len(parts), 2):
        scene_id = parts[i].strip()
        scene_body = parts[i + 1]

        if scene_id in local_seen:
            print(f"[WARN] 文件内重复场景ID，后者将覆盖前者: {file_path.name} -> {scene_id}")
        local_seen.add(scene_id)

        condition_match = re.search(r"条件：([^\n]+)", scene_body)
        _condition = condition_match.group(1).strip() if condition_match else None

        mark_ending_m = re.search(r"(?m)^结局标记[：:]\s*(.+?)\s*$", scene_body)
        mark_ending = mark_ending_m.group(1).strip() if mark_ending_m else None

        # 支持 **选项：** / **选项:** / 单独一行「选项：」
        options_section = re.search(
            r"(?:\*\*选项[：:]\*\*|^选项[：:])\s*\n(.*)\Z",
            scene_body,
            re.S | re.M,
        )
        if options_section:
            desc_part = scene_body[: options_section.start()].strip()
            options_text = options_section.group(1).strip()
        else:
            desc_part = scene_body.strip()
            options_text = ""

        desc_lines = []
        effs = []
        for line in desc_part.split("\n"):
            raw = line.strip()
            if not raw:
                continue
            if raw.startswith("条件：") or raw.startswith("---") or raw.startswith("##"):
                continue
            if re.match(r"^结局标记[：:]", raw):
                continue
            # 去掉引用块标记
            if raw.startswith(">"):
                raw = raw.lstrip(">").strip()
            if re.match(
                r"^\*\*(?:消耗物品|失去物品|获得线索|状态|获得状态|获得物品|获得奖励|线索|状态更新|奖励：|物品：|提示：|获得：)",
                raw,
            ):
                effs.append(raw.replace("**", "").strip())
                continue
            
            eff_match = re.match(r"^效果：\[(.*?)\]", raw)
            if eff_match:
                eff_content = eff_match.group(1).strip()
                if "获得 线索：" in eff_content:
                    effs.append("获得线索：" + eff_content.replace("获得 线索：", "").strip())
                elif "获得 " in eff_content:
                    effs.append("获得：" + eff_content.replace("获得 ", "").strip())
                elif "消耗 " in eff_content:
                    effs.append("消耗物品：" + eff_content.replace("消耗 ", "").strip())
                else:
                    effs.append(eff_content)
                continue

            # 纯加粗小标题行并入描述
            desc_lines.append(raw.replace("**", ""))

        desc = "\n".join(desc_lines).strip()

        options = []
        item_selection = None
        for opt in options_text.split("\n"):
            opt = opt.strip()
            if not opt.startswith("-"):
                continue
            # 跳过分隔线 ---（否则会被当成选项并默认 target 为 hall_main）
            if re.match(r"^-\s*-{2,}\s*$", opt):
                continue
            target_match = re.search(r"\[(?:前往|返回)\s+([A-Za-z0-9_]+)\]", opt)
            target = target_match.group(1) if target_match else "hall_main"
            text_match = re.search(r"-\s*(.*?)\s*(?:\[|$)", opt)
            raw_text = text_match.group(1).strip() if text_match else opt[1:].strip()
            text = re.sub(r"\s*\[.*$", "", raw_text).strip()

            is_item_selector = "[选择物品]" in opt or raw_text.startswith("[选择物品]")
            if is_item_selector:
                prompt_match = re.search(r"\[选择物品\]\s*(.*?)(?:\s*\[[^\]]+\]\s*)*$", opt)
                clean_text = prompt_match.group(1).strip() if prompt_match else ""
                if not clean_text:
                    clean_text = re.sub(r"\s*\[选择物品\]\s*", "", raw_text).strip()
                if not clean_text:
                    clean_text = "从背包中选择一件物品"

                def tag_value(prefix: str) -> str | None:
                    m = re.search(rf"\[{prefix}\s*[:：]\s*(.*?)\]", opt)
                    return m.group(1).strip() if m else None

                def parse_item_list(raw_value: str | None) -> list[str]:
                    if not raw_value:
                        return []
                    return [x.strip() for x in re.split(r"[|、，,]", raw_value) if x.strip()]

                item_selection = {
                    "prompt": clean_text,
                    "back_target": tag_value("返回目标") or target,
                    "correct_target": tag_value("正确目标") or target,
                    "wrong_target": tag_value("错误目标") or target,
                    "completed_target": tag_value("完成目标") or tag_value("完成后") or None,
                    "required_count": None,
                    "fatal_target": tag_value("致命目标") or tag_value("死亡目标"),
                    "consume_on_correct": tag_value("正确时消耗") != "否",
                    "consume_on_wrong": tag_value("错误时消耗") == "是",
                    "consume_on_fatal": tag_value("致命时消耗") != "否",
                    "correct_items": parse_item_list(tag_value("正确物品") or tag_value("可用物品")),
                    "fatal_items": parse_item_list(tag_value("致命物品")),
                    "fatal_keywords": parse_item_list(tag_value("致命词")),
                    "item_map": {},
                    "validator_js": None,
                }

                map_raw = tag_value("物品映射") or tag_value("物品规则")
                if map_raw:
                    for pair in re.split(r"[|；;]", map_raw):
                        pair = pair.strip()
                        if not pair:
                            continue
                        if "=>" in pair:
                            item_name, target_name = pair.split("=>", 1)
                        elif "->" in pair:
                            item_name, target_name = pair.split("->", 1)
                        elif "=" in pair:
                            item_name, target_name = pair.split("=", 1)
                        else:
                            continue
                        item_selection["item_map"][item_name.strip()] = target_name.strip()

                rule_js = tag_value("规则") or tag_value("validator")
                if rule_js and rule_js.startswith("js:"):
                    item_selection["validator_js"] = rule_js[3:].strip()

                count_raw = tag_value("目标数量") or tag_value("需要数量") or tag_value("完成数量")
                if count_raw:
                    try:
                        item_selection["required_count"] = max(1, int(count_raw))
                    except ValueError:
                        item_selection["required_count"] = None

                continue

            opt_cond = re.search(r"\[(?:条件|解锁条件)\s*[:：]\s*(.*)\]", opt)
            if opt_cond:
                opt_cond_str = opt_cond.group(1)
            else:
                opt_cond2 = re.search(r"（(需要|若有|拥有)(.*?)）", text)
                opt_cond_str = opt_cond2.group(0) if opt_cond2 else None

            options.append({"text": text, "target": target, "cond_str": opt_cond_str})

        if not desc and not options and not mark_ending:
            continue

        scenes[scene_id] = {
            "desc": desc.replace("\\", "\\\\").replace("`", "\\`"),
            "options": options,
            "effs": effs,
            "mark_ending": mark_ending,
            "item_selection": item_selection,
        }
    return scenes


def make_js_code(scenes: dict) -> str:
    """
    将场景数据转换为 JavaScript 代码
    
    该函数接收解析后的场景字典，生成对应的 JavaScript 场景定义代码。
    包括场景描述、选项、进入效果、结局标记和物品选择配置。
    
    Args:
        scenes (dict): 场景字典，由 parse_txt() 函数返回
    
    Returns:
        str: 生成的 JavaScript 代码字符串
    """
    # 存储生成的 JavaScript 代码行
    js_lines = []
    # 遍历每个场景
    for sid, sdata in scenes.items():
        # 开始定义场景对象
        js_lines.append(f'scenes["{sid}"] = {{')

        # 获取结局标记并转义
        mark_end = sdata.get("mark_ending") or ""
        mark_esc = mark_end.replace("\\", "\\\\").replace('"', '\\"')
        # 获取效果列表
        effs = sdata.get("effs") or []

        if effs or mark_end:
            js_lines.append("    on_enter: () => {")
            js_lines.append('        let msg = "";')

            for eff in effs:
                if "获得线索" in eff or "线索：" in eff:
                    clue = eff.split("：", 1)[1].strip() if "：" in eff else eff.replace("获得线索", "").strip()
                    clue = clue.strip("* ")
                    js_lines.append(f'        msg += addClue("{clue}");')
                elif "消耗物品" in eff or "失去物品" in eff:
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
                    )
                    items = [x.strip() for x in re.split(r"[、，,]", item_part) if x.strip()]
                    if items:
                        cond_item = items[0]
                        js_lines.append(f'        if(!hasItem("{cond_item}")) {{')
                        for item in items:
                            js_lines.append(f'            msg += addItem("{item}");')
                        js_lines.append(
                            f'            msg += `<div class="system-message">【获得物品】：{item_part}</div>`;'
                        )
                        js_lines.append("        }")
                elif "状态" in eff:
                    state_part = (
                        eff.split("：", 1)[1].strip()
                        if "：" in eff
                        else eff.replace("状态", "").replace("获得状态", "").strip()
                    )
                    state_key = state_part[:80] if len(state_part) > 80 else state_part
                    js_lines.append(f'        if(!getFlag("{state_key}")) {{')
                    js_lines.append(f'            setFlag("{state_key}", true);')
                    if "封印" in state_part or "麻痹" in state_part or "稀释" in state_part:
                        js_lines.append(
                            f'            msg += `<div class="danger-message">【状态】：{state_part}</div>`;'
                        )
                    else:
                        js_lines.append(
                            f'            msg += `<div class="system-message">【状态】：{state_part}</div>`;'
                        )
                    js_lines.append("        }")

            if mark_end:
                js_lines.append(f'        msg += markEnding("{mark_esc}");')
            js_lines.append("        return msg;")
            js_lines.append("    },")

        desc_text = sdata["desc"].replace("$", "\\$")
        js_lines.append(f"    desc: `{desc_text}`,")

        item_selection = sdata.get("item_selection")
        if item_selection:
            js_lines.append("    itemSelection: {")
            js_lines.append(f'        prompt: "{js_str(item_selection["prompt"])}",')
            js_lines.append(f'        backTarget: "{js_str(item_selection["back_target"])}",')
            js_lines.append(f'        correctTarget: "{js_str(item_selection["correct_target"])}",')
            js_lines.append(f'        wrongTarget: "{js_str(item_selection["wrong_target"])}",')
            if item_selection.get("completed_target"):
                js_lines.append(f'        completedTarget: "{js_str(item_selection["completed_target"])}",')
            if item_selection.get("required_count"):
                js_lines.append(f'        requiredCount: {int(item_selection["required_count"])},')
            if item_selection.get("fatal_target"):
                js_lines.append(f'        fatalTarget: "{js_str(item_selection["fatal_target"])}",')
            js_lines.append(f'        consumeOnCorrect: {str(bool(item_selection.get("consume_on_correct"))).lower()},')
            js_lines.append(f'        consumeOnWrong: {str(bool(item_selection.get("consume_on_wrong"))).lower()},')
            js_lines.append(f'        consumeOnFatal: {str(bool(item_selection.get("consume_on_fatal"))).lower()},')

            if item_selection.get("correct_items"):
                arr = ", ".join(f'"{js_str(x)}"' for x in item_selection["correct_items"])
                js_lines.append(f"        correctItems: [{arr}],")
            if item_selection.get("fatal_items"):
                arr = ", ".join(f'"{js_str(x)}"' for x in item_selection["fatal_items"])
                js_lines.append(f"        fatalItems: [{arr}],")
            if item_selection.get("fatal_keywords"):
                arr = ", ".join(f'"{js_str(x)}"' for x in item_selection["fatal_keywords"])
                js_lines.append(f"        fatalKeywords: [{arr}],")
            if item_selection.get("item_map"):
                js_lines.append("        itemMap: {")
                for item_name, target_name in item_selection["item_map"].items():
                    js_lines.append(f'            "{js_str(item_name)}": "{js_str(target_name)}",')
                js_lines.append("        },")
            if item_selection.get("validator_js"):
                js_lines.append(f"        validator: (itemName) => {{ {item_selection['validator_js']} }},")
            js_lines.append("    },")

        js_lines.append("    options: [")
        opts = []
        for opt in sdata["options"]:
            raw_text = opt["text"].strip()
            if raw_text in ("--", "—", "——", "…", "...", "返回", "离开"):
                raw_text = "返回大厅"
            text = raw_text.replace("\\", "\\\\").replace('"', '\\"').replace("`", "\\`")
            target = opt["target"]
            cond_str = opt["cond_str"]

            opt_line = f'        {{ text: "{text}", target: "{target}"'

            if cond_str:
                cs = cond_str.strip()
                if cs.startswith("flag:"):
                    fk = cs[5:].strip()
                    opt_line += f', condition: () => getFlag("{fk}")'
                elif cs.startswith("js:"):
                    js_code = cs[3:].strip()
                    opt_line += f', condition: () => {js_code}'
                elif "前世记忆" in cond_str:
                    opt_line += f', condition: () => getPlayCount() > 0'
                elif cs.startswith("allflags:"):
                    keys = [x.strip() for x in cs[9:].split("|") if x.strip()]
                    if keys:
                        inner = " && ".join(f'getFlag("{k}")' for k in keys)
                        opt_line += f", condition: () => {inner}"
                elif "不" in cond_str and "线索" in cond_str:
                    item = re.sub(r"[不需要拥有线索（）：:]", "", cond_str).strip()
                    opt_line += f', condition: () => !hasClue("{item}")'
                elif "线索" in cond_str:
                    item = re.sub(r"[需要拥有线索（）：:]", "", cond_str).strip()
                    opt_line += f', condition: () => hasClue("{item}")'
                elif "不" in cond_str and "状态" in cond_str:
                    item = re.sub(r"[不需要状态（）：:]", "", cond_str).strip()
                    opt_line += f', condition: () => !getFlag("{item}")'
                elif "状态" in cond_str:
                    item = re.sub(r"[需要状态（）：:]", "", cond_str).strip()
                    opt_line += f', condition: () => getFlag("{item}")'
                elif "需要" in cond_str or "拥有" in cond_str or "获得过" in cond_str:
                    item = re.sub(
                        r"需要拥有|需要|拥有|获得过|[（）：:]", "", cond_str
                    ).strip()
                    opt_line += f', condition: () => hasItem("{item}")'
                elif "若有" in cond_str:
                        text_for_item = opt["text"]
                        if "生命之露" in text_for_item: item = "生命之露"
                        elif "机械齿轮" in text_for_item: item = "机械齿轮"
                        elif "日记" in text_for_item: item = "克劳利的日记"
                        elif "共鸣水晶" in text_for_item: item = "共鸣水晶"
                        elif "神秘颜料" in text_for_item: item = "神秘颜料"
                        elif "符文石" in text_for_item: item = "符文石"
                        elif "星盘钥匙" in text_for_item: item = "星盘钥匙"
                        else: item = "未知物品"
                        opt_line += f', condition: () => hasItem("{item}")'
            opt_line += " }"
            opts.append(opt_line)

        targets = {o["target"] for o in sdata["options"]}
        # 替换原「--」占位：统一为可读的返回大厅
        if "hall_main" not in targets and sid not in EXTRA_RESERVED:
            if not sid.startswith("ending_"):
                opts.append('        { text: "返回大厅", target: "hall_main" }')

        if not opts:
            if sid.startswith("ending_") or "death" in sid or sid == "game_over" or "gameover" in sid:
                opts.append('        { text: "【游戏结束】返回标题", target: "title" }')
            else:
                opts.append('        { text: "返回大厅", target: "hall_main" }')

        js_lines.append(",\n".join(opts))
        js_lines.append("    ]")
        js_lines.append("};\n")

    return "\n".join(js_lines)


def manual_scene_ids(prefix: str) -> frozenset:
    """
    从手写场景代码中提取场景ID
    
    该函数使用正则表达式从手写场景代码中提取所有场景ID，
    用于确定哪些场景需要保留，不被自动生成的代码覆盖。
    
    Args:
        prefix (str): 手写场景代码部分
    
    Returns:
        frozenset: 场景ID的不可变集合
    """
    return frozenset(re.findall(r'scenes\["([^"]+)"\]', prefix))


def main():
    """
    主函数：执行场景构建流程
    
    该函数执行以下操作：
    1. 检查 game-scenes.js 文件是否存在
    2. 读取文件内容，找到自动生成标记和 IIFE 结尾
    3. 提取手写场景ID，确定需要跳过的场景
    4. 解析所有文本文件，生成对应的 JavaScript 代码
    5. 处理跨文件重复场景ID
    6. 将生成的代码写入 game-scenes.js 文件
    
    Returns:
        None
    """
    # 检查 game-scenes.js 文件是否存在
    if not SCENES_JS.is_file():
        raise SystemExit(f"找不到 {SCENES_JS}")

    # 读取文件内容
    raw = SCENES_JS.read_text(encoding="utf-8")
    # 找到自动生成标记的位置
    idx = raw.find(AUTO_MARKER)
    if idx == -1:
        raise SystemExit(f"{SCENES_JS} 中未找到「{AUTO_MARKER}」标记")

    # 找到 IIFE 结尾
    footer_m = re.search(r"\n\s*\}\)\(\);\s*\Z", raw)
    if not footer_m:
        raise SystemExit("未找到 IIFE 结尾 })();")
    footer = raw[footer_m.start() :]
    # 提取手写场景代码部分
    prefix = raw[:idx].rstrip() + "\n\n"

    # 提取手写场景ID
    manual_ids = manual_scene_ids(prefix)
    # 确定需要跳过的场景ID（手写场景和额外保留场景）
    skip_ids = set(manual_ids) | set(EXTRA_RESERVED)

    # 处理扩展文件中的场景ID，允许覆盖手写场景
    expansion_ids: set[str] = set()
    for rel in FILES:
        if any(k in rel for k in EXPANSION_FILE_KEYWORDS):
            fp = ROOT / rel.replace("\\", "/")
            expansion_ids |= set(parse_txt(fp).keys())
    # 从跳过列表中移除扩展文件中的场景ID（非保护场景）
    for sid in expansion_ids:
        if sid not in PROTECTED_IDS:
            skip_ids.discard(sid)

    # 生成 JavaScript 代码
    full_js = ""
    total = 0
    seen_ids: set[str] = set()
    first_owner: dict[str, str] = {}
    cross_file_dup_count = 0
    
    # 遍历所有文本文件
    for rel in FILES:
        fp = ROOT / rel.replace("\\", "/")
        # 解析文本文件
        scenes = parse_txt(fp)

        # 处理跨文件重复场景ID
        for sid in scenes.keys():
            if sid in first_owner:
                cross_file_dup_count += 1
                print(
                    f"[WARN] 跨文件重复场景ID（后写覆盖前写）: {sid} | "
                    f"first={first_owner[sid]} | now={rel}"
                )
            else:
                first_owner[sid] = rel

        # 过滤掉需要跳过的场景
        filtered = {k: v for k, v in scenes.items() if k not in skip_ids}
        # 添加文件注释和生成的代码
        full_js += f"\n// --- 自动生成的 {rel} 场景 ---\n"
        full_js += make_js_code(filtered)
        seen_ids |= set(filtered.keys())
        total += len(filtered)
        print(
            f"Parsed {rel}: {len(scenes)} scenes, emit {len(filtered)} "
            f"(skipped {len(scenes) - len(filtered)} manual/reserved)"
        )

    # 组合新内容并写入文件
    new_content = prefix + full_js.rstrip() + footer
    SCENES_JS.write_text(new_content, encoding="utf-8")
    print(f"\n已写入 {SCENES_JS}，共生成约 {total} 个场景块（跨文件累计，后者覆盖同 ID）。")
    if cross_file_dup_count:
        print(f"检测到跨文件重复ID：{cross_file_dup_count} 处，请优先清理文本源。")
    print("请用本地服务器打开 index.html 验证。")


if __name__ == "__main__":
    main()

