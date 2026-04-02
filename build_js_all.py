# -*- coding: utf-8 -*-
"""
从 文本/*.txt 解析场景，写入 js/game-scenes.js 中「自动生成的」区块。
保留文件开头手写场景（至第一个 // --- 自动生成的），并保留末尾 IIFE 闭合。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TEXT_DIR = ROOT / "文本"
SCENES_JS = ROOT / "js" / "game-scenes.js"

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
    "文本/谜题-地下室.txt",
    "文本/谜题-画室.txt",
    "文本/谜题-图书馆.txt",
    "文本/谜题-温室.txt",
    "文本/谜题-卧室.txt",
    "文本/谜题-音乐室.txt",
    "文本/谜题-钟楼1.txt",
    "文本/谜题-钟楼2.txt",
    "文本/支线1.txt",
    "文本/支线2.txt",
    "文本/支线3.txt",
    "文本/支线4.txt",
    "文本/大结局.txt",
    "文本/主线.txt",
    "文本/主线2.txt",
    "文本/补充1.txt",
    "文本/补充2.txt",
]


def parse_txt(file_path: Path) -> dict:
    if not file_path.is_file():
        print(f"Skipping missing file: {file_path}")
        return {}
    content = file_path.read_text(encoding="utf-8", errors="ignore")

    parts = re.split(r"场景ID:\s*([A-Za-z0-9_]+)", content)
    scenes = {}
    for i in range(1, len(parts), 2):
        scene_id = parts[i].strip()
        scene_body = parts[i + 1]

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
            # 纯加粗小标题行并入描述
            desc_lines.append(raw.replace("**", ""))

        desc = "\n".join(desc_lines).strip()

        options = []
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
            text = text_match.group(1).strip() if text_match else opt[1:].strip()
            # 去掉误解析进选项正文的括号说明
            text = re.sub(r"\s*\[.*$", "", text).strip()

            opt_cond = re.search(r"\[(?:条件|解锁条件)\s*[:：]\s*(.*?)\]", opt)
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
        }
    return scenes


def make_js_code(scenes: dict) -> str:
    js_lines = []
    for sid, sdata in scenes.items():
        js_lines.append(f'scenes["{sid}"] = {{')

        mark_end = sdata.get("mark_ending") or ""
        mark_esc = mark_end.replace("\\", "\\\\").replace('"', '\\"')
        effs = sdata.get("effs") or []

        if effs or mark_end:
            js_lines.append("    on_enter: () => {")
            js_lines.append('        let msg = "";')

            for eff in effs:
                if "获得线索" in eff or "线索：" in eff:
                    clue = eff.split("：", 1)[1].strip() if "：" in eff else eff.replace("获得线索", "").strip()
                    clue = clue.strip("* ")
                    js_lines.append(f'        if(!hasClue("{clue}")) {{')
                    js_lines.append(f'            gameState.clues.push("{clue}");')
                    js_lines.append(
                        f'            msg += `<div class="system-message">【获得线索】：{clue}</div>`;'
                    )
                    js_lines.append("        }")
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
                            js_lines.append(f'            gameState.items.push("{item}");')
                            js_lines.append(f'            if(typeof showItemPopup === "function") showItemPopup("{item}");')
                            if "徽章" in item:
                                js_lines.append(f'            gameState.medals.push("{item}");')
                                js_lines.append("            addMedal();")
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
                    opt_line += ', condition: () => hasItem("生命之露")'
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
    return frozenset(re.findall(r'scenes\["([^"]+)"\]', prefix))


def main():
    if not SCENES_JS.is_file():
        raise SystemExit(f"找不到 {SCENES_JS}")

    raw = SCENES_JS.read_text(encoding="utf-8")
    idx = raw.find(AUTO_MARKER)
    if idx == -1:
        raise SystemExit(f"{SCENES_JS} 中未找到「{AUTO_MARKER}」标记")

    footer_m = re.search(r"\n\s*\}\)\(\);\s*\Z", raw)
    if not footer_m:
        raise SystemExit("未找到 IIFE 结尾 })();")
    footer = raw[footer_m.start() :]
    prefix = raw[:idx].rstrip() + "\n\n"

    manual_ids = manual_scene_ids(prefix)
    skip_ids = set(manual_ids) | set(EXTRA_RESERVED)

    expansion_ids: set[str] = set()
    for rel in FILES:
        if any(k in rel for k in EXPANSION_FILE_KEYWORDS):
            fp = ROOT / rel.replace("\\", "/")
            expansion_ids |= set(parse_txt(fp).keys())
    for sid in expansion_ids:
        if sid not in PROTECTED_IDS:
            skip_ids.discard(sid)

    full_js = ""
    total = 0
    seen_ids: set[str] = set()
    for rel in FILES:
        fp = ROOT / rel.replace("\\", "/")
        scenes = parse_txt(fp)
        filtered = {k: v for k, v in scenes.items() if k not in skip_ids}
        # 主线2 与「谜题/支线」大量同 ID：只补充尚未出现过的场景，避免短剧本覆盖完整谜题
        if "主线2.txt" in rel:
            filtered = {k: v for k, v in filtered.items() if k not in seen_ids}
        full_js += f"\n// --- 自动生成的 {rel} 场景 ---\n"
        full_js += make_js_code(filtered)
        seen_ids |= set(filtered.keys())
        total += len(filtered)
        print(
            f"Parsed {rel}: {len(scenes)} scenes, emit {len(filtered)} "
            f"(skipped {len(scenes) - len(filtered)} manual/reserved)"
        )

    new_content = prefix + full_js.rstrip() + footer
    SCENES_JS.write_text(new_content, encoding="utf-8")
    print(f"\n已写入 {SCENES_JS}，共生成约 {total} 个场景块（跨文件累计，后者覆盖同 ID）。")
    print("请用本地服务器打开 index.html 验证。")


if __name__ == "__main__":
    main()
