"""
场景验证工具模块

该模块用于验证游戏场景文件的完整性和正确性，包括：
- 验证场景ID的合法性
- 验证场景目标的存在性
- 验证静态资源引用的有效性
- 检查重复的场景定义

使用方法：
    直接运行此脚本即可自动验证场景文件的正确性。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


# 项目根目录
ROOT = Path(__file__).resolve().parent
# 默认场景JSON文件路径
DEFAULT_SCENE_JSON = ROOT / "src" / "data" / "scenes.dsl.json"
# 默认场景JS文件路径
DEFAULT_SCENE_JS = ROOT / "js" / "game-scenes.js"
# 资产扫描的文件模式
ASSET_SCAN_GLOBS = ("index.html", "js/*.js", "data/*.json")
# 允许的外部目标场景
ALLOWED_EXTERNAL_TARGETS = {"system_load_auto"}
# 场景赋值的正则表达式
SCENE_ASSIGN_RE = re.compile(r'scenes\["([^"]+)"\]\s*=')
# 资产路径的正则表达式
ASSET_PATH_RE = re.compile(r'(?P<quote>["\'`])(images/[^"\'`\r\n]+)(?P=quote)')
# 有效的场景ID正则表达式
VALID_SCENE_ID_RE = re.compile(r"^[A-Za-z0-9_]+$")


class PairList(list):
    """用于跟踪JSON解析中的重复键"""
    pass


@dataclass(frozen=True)
class Issue:
    """
    验证问题类
    
    Attributes:
        code: 问题代码
        location: 问题位置
        message: 问题描述
    """
    code: str
    location: str
    message: str


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数
    
    Returns:
        argparse.Namespace: 解析后的命令行参数
    """
    parser = argparse.ArgumentParser(
        description="Validate scene ids, scene targets, and static asset references."
    )
    parser.add_argument(
        "--scene-json",
        type=Path,
        default=DEFAULT_SCENE_JSON,
        help="Path to the authoritative scene JSON file.",
    )
    parser.add_argument(
        "--scene-js",
        type=Path,
        default=DEFAULT_SCENE_JS,
        help="Path to the generated JS scene file used for duplicate assignment checks.",
    )
    return parser.parse_args()


def object_pairs_hook(pairs: list[tuple[str, Any]]) -> PairList:
    """
    JSON解析的钩子函数，用于跟踪重复键
    
    Args:
        pairs: JSON键值对列表
        
    Returns:
        PairList: 包含所有键值对的PairList对象
    """
    return PairList(pairs)


def load_json_with_duplicate_tracking(path: Path) -> tuple[Any | None, list[Issue]]:
    """
    加载JSON文件并跟踪重复键
    
    Args:
        path: JSON文件路径
        
    Returns:
        tuple[Any | None, list[Issue]]: 解析后的数据和问题列表
    """
    issues: list[Issue] = []
    raw = path.read_text(encoding="utf-8")

    try:
        parsed = json.loads(raw, object_pairs_hook=object_pairs_hook)
    except json.JSONDecodeError as exc:
        issues.append(
            Issue(
                code="invalid_json",
                location=f"{path}:{exc.lineno}:{exc.colno}",
                message=exc.msg,
            )
        )
        return None, issues

    def convert(value: Any, path_label: str) -> Any:
        """
        转换JSON值，同时检查重复键
        
        Args:
            value: 要转换的值
            path_label: 当前值的路径标签
            
        Returns:
            Any: 转换后的值
        """
        if isinstance(value, PairList):
            result: dict[str, Any] = {}
            for key, child in value:
                child_path = f"{path_label}.{key}" if path_label != "$" else f"$.{key}"
                if key in result:
                    issues.append(
                        Issue(
                            code="duplicate_key",
                            location=f"{path}:{path_label}",
                            message=f"Duplicate key '{key}' detected; later value overrides earlier one.",
                        )
                    )
                result[key] = convert(child, child_path)
            return result
        if isinstance(value, list):
            return [convert(child, f"{path_label}[{index}]") for index, child in enumerate(value)]
        return value

    return convert(parsed, "$"), issues


def validate_scene_json(path: Path) -> tuple[dict[str, Any] | None, list[Issue]]:
    """
    验证场景JSON文件的完整性和正确性
    
    Args:
        path: 场景JSON文件路径
        
    Returns:
        tuple[dict[str, Any] | None, list[Issue]]: 验证后的数据和问题列表
    """
    data, issues = load_json_with_duplicate_tracking(path)
    if data is None:
        return None, issues
    if not isinstance(data, dict):
        issues.append(
            Issue(
                code="invalid_root",
                location=str(path),
                message="Scene JSON root must be an object keyed by scene id.",
            )
        )
        return None, issues

    scene_ids = set(data.keys())

    for scene_id, scene in data.items():
        # 验证场景ID的合法性
        if not VALID_SCENE_ID_RE.fullmatch(scene_id):
            issues.append(
                Issue(
                    code="invalid_scene_id",
                    location=f"{path}:$.{scene_id}",
                    message=f"Scene id '{scene_id}' contains unsupported characters.",
                )
            )

        # 验证场景对象的类型
        if not isinstance(scene, dict):
            issues.append(
                Issue(
                    code="invalid_scene",
                    location=f"{path}:$.{scene_id}",
                    message="Scene value must be an object.",
                )
            )
            continue
            
        # 检查场景描述是否包含未完成的内容标记
        desc = scene.get("desc", "")
        if isinstance(desc, str):
            for pattern in ["尚未实装", "TODO", "占位"]:
                if pattern in desc:
                    issues.append(
                        Issue(
                            code="incomplete_content",
                            location=f"{path}:$.{scene_id}.desc",
                            message=f"Scene description contains incomplete content marker: '{pattern}'",
                        )
                    )

        # 验证选项列表
        options = scene.get("options", [])
        if not isinstance(options, list):
            issues.append(
                Issue(
                    code="invalid_options",
                    location=f"{path}:$.{scene_id}.options",
                    message="Scene options must be a list.",
                )
            )
            options = []

        # 验证每个选项
        for index, option in enumerate(options):
            option_path = f"{path}:$.{scene_id}.options[{index}]"
            if not isinstance(option, dict):
                issues.append(
                    Issue(
                        code="invalid_option",
                        location=option_path,
                        message="Option must be an object.",
                    )
                )
                continue

            # 验证选项目标
            target = option.get("target")
            if not isinstance(target, str) or not target.strip():
                issues.append(
                    Issue(
                        code="missing_target",
                        location=option_path,
                        message="Option target is missing or empty.",
                    )
                )
            elif target not in scene_ids and target not in ALLOWED_EXTERNAL_TARGETS:
                issues.append(
                    Issue(
                        code="dangling_target",
                        location=option_path,
                        message=f"Option target '{target}' does not exist in scene JSON.",
                    )
                )

        # 验证进入场景时的效果
        on_enter = scene.get("on_enter", [])
        if isinstance(on_enter, list):
            for index, entry in enumerate(on_enter):
                entry_path = f"{path}:$.{scene_id}.on_enter[{index}]"
                if not isinstance(entry, dict):
                    continue
                effs = entry.get("effs", [])
                if not isinstance(effs, list):
                    continue
                for effect in effs:
                    if not isinstance(effect, str) or not effect.startswith("redirect:"):
                        continue
                    target = effect.split(":", 1)[1].strip()
                    if not target:
                        issues.append(
                            Issue(
                                code="missing_target",
                                location=entry_path,
                                message="Redirect effect is missing a target scene id.",
                            )
                        )
                    elif target not in scene_ids and target not in ALLOWED_EXTERNAL_TARGETS:
                        issues.append(
                            Issue(
                                code="dangling_target",
                                location=entry_path,
                                message=f"Redirect target '{target}' does not exist in scene JSON.",
                            )
                        )

    return data, issues


def validate_generated_scene_js(path: Path) -> list[Issue]:
    """
    验证生成的场景JS文件是否存在重复的场景赋值
    
    Args:
        path: 生成的场景JS文件路径
        
    Returns:
        list[Issue]: 问题列表
    """
    if not path.is_file():
        return [
            Issue(
                code="missing_file",
                location=str(path),
                message="Generated scene JS file does not exist.",
            )
        ]

    issues: list[Issue] = []
    text = path.read_text(encoding="utf-8", errors="ignore")
    occurrences: dict[str, list[int]] = defaultdict(list)

    # 查找所有场景赋值语句
    for line_number, line in enumerate(text.splitlines(), start=1):
        match = SCENE_ASSIGN_RE.search(line)
        if match:
            occurrences[match.group(1)].append(line_number)

    # 检查是否有重复的场景赋值
    for scene_id, lines in sorted(occurrences.items()):
        if len(lines) > 1:
            issues.append(
                Issue(
                    code="duplicate_scene_assignment",
                    location=f"{path}:{','.join(str(line) for line in lines)}",
                    message=f"Scene id '{scene_id}' is assigned {len(lines)} times in generated JS.",
                )
            )

    return issues


def collect_asset_references(root: Path) -> dict[str, list[str]]:
    """
    收集项目中所有资产引用
    
    Args:
        root: 项目根目录路径
        
    Returns:
        dict[str, list[str]]: 资产路径到引用位置的映射
    """
    references: dict[str, list[str]] = defaultdict(list)

    # 遍历所有资产扫描模式
    for pattern in ASSET_SCAN_GLOBS:
        for file_path in root.glob(pattern):
            if not file_path.is_file():
                continue
            text = file_path.read_text(encoding="utf-8", errors="ignore")
            # 查找所有资产路径引用
            for match in ASSET_PATH_RE.finditer(text):
                asset_path = match.group(2)
                if "${" in asset_path:
                    continue
                line_number = text.count("\n", 0, match.start()) + 1
                references[asset_path].append(f"{file_path}:{line_number}")

    return references


def validate_assets(root: Path) -> list[Issue]:
    """
    验证项目中所有资产引用的有效性
    
    Args:
        root: 项目根目录路径
        
    Returns:
        list[Issue]: 问题列表
    """
    issues: list[Issue] = []
    references = collect_asset_references(root)

    # 检查每个资产是否存在
    for asset_path, locations in sorted(references.items()):
        resolved = root / Path(asset_path)
        if resolved.exists():
            continue
        issues.append(
            Issue(
                code="missing_asset",
                location="; ".join(locations),
                message=f"Asset '{asset_path}' does not exist.",
            )
        )

    return issues


def print_report(issues: list[Issue]) -> None:
    """
    打印验证报告
    
    Args:
        issues: 问题列表
    """
    if not issues:
        print("Scene validation passed.")
        return

    print(f"Scene validation failed with {len(issues)} issue(s):")
    for issue in issues:
        print(f"- [{issue.code}] {issue.location} :: {issue.message}")


def main() -> int:
    """
    主函数：执行场景验证
    
    Returns:
        int: 0表示验证通过，1表示验证失败
    """
    args = parse_args()
    issues: list[Issue] = []

    # 验证场景JSON文件
    if not args.scene_json.is_file():
        issues.append(
            Issue(
                code="missing_file",
                location=str(args.scene_json),
                message="Scene JSON file does not exist.",
            )
        )
    else:
        _, json_issues = validate_scene_json(args.scene_json)
        issues.extend(json_issues)

    # 验证生成的场景JS文件
    issues.extend(validate_generated_scene_js(args.scene_js))
    # 验证资产引用
    issues.extend(validate_assets(ROOT))

    # 排序并打印验证报告
    issues.sort(key=lambda item: (item.code, item.location, item.message))
    print_report(issues)
    return 1 if issues else 0


if __name__ == "__main__":
    sys.exit(main())
