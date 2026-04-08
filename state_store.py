"""
状态存储管理模块

该模块负责游戏状态的存储、标准化、导出和验证。
它处理游戏存档的结构管理，确保数据的一致性和兼容性。

主要功能：
- 管理个人资料状态（跨存档共享）
- 管理单次运行状态（当前游戏进度）
- 支持旧版本存档的自动迁移
- 提供完整的状态验证机制
"""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from typing import Any

# 存档架构版本，用于后续升级兼容
SCHEMA_VERSION = 1
# 个人资料存档版本
PROFILE_SAVE_VERSION = 4

# 默认的个人资料状态（跨存档共享）
DEFAULT_PROFILE_STATE = {
    "save_version": PROFILE_SAVE_VERSION,
    "play_count": 0,           # 总游玩次数
    "endings_reached": [],     # 已达成的结局列表
    "achievements": [],        # 已获得的成就列表
    "visited_options": {},     # 已访问过的选项记录（用于灰显）
}

# 默认的单次运行状态（当前游戏进度）
DEFAULT_RUN_STATE = {
    "medals": [],              # 已获得的勋章
    "rooms_completed": [],     # 已完成的房间
    "items": [],               # 背包物品
    "clues": [],               # 发现的线索
    "side_quests": {},         # 支线任务进度
    "flags": {},               # 剧情标记/变量
    "hall_medal_count": 0,     # 大厅勋章总数
    "current_scene_id": "title", # 当前场景 ID
    "run_started_at": None,    # 本次运行开始时间
    "last_hall_medal_count": 0, # 上次检查的大厅勋章数
    "hint_levels": {},         # 各场景的提示等级
    "visited_options": [],     # 本次运行中访问过的选项
}

# 默认的完整根状态
DEFAULT_ROOT_STATE = {
    "schema_version": SCHEMA_VERSION,
    "profile": DEFAULT_PROFILE_STATE,
    "run": DEFAULT_RUN_STATE,
}

# 个人资料字段别名（用于处理旧版或不同格式的数据）
PROFILE_ALIASES = {
    "saveVersion": "save_version",
    "playCount": "play_count",
    "endingsReached": "endings_reached",
    "visitedOptions": "visited_options",
}

# 运行状态字段别名
RUN_ALIASES = {
    "currentSceneId": "current_scene_id",
    "runStartedAt": "run_started_at",
    "lastHallMedalCount": "last_hall_medal_count",
    "hintLevels": "hint_levels",
    "visitedOptions": "visited_options",
}


@dataclass(frozen=True)
class StateValidationIssue:
    """
    状态验证错误信息类
    
    Attributes:
        path: 错误字段路径
        message: 错误详细信息
    """
    path: str    # 错误字段路径
    message: str # 错误详细信息


def _clone(value: Any) -> Any:
    """
    深拷贝对象，确保状态不可变性
    
    Args:
        value: 要拷贝的对象
    
    Returns:
        拷贝后的新对象
    """
    return deepcopy(value)


def _is_mapping(value: Any) -> bool:
    """
    检查值是否为字典/映射类型
    
    Args:
        value: 要检查的值
    
    Returns:
        bool: 是否为映射类型
    """
    return isinstance(value, dict)


def _as_int(value: Any, default: int = 0) -> int:
    """
    将值转换为整数，失败则返回默认值
    
    Args:
        value: 要转换的值
        default: 转换失败时的默认值
    
    Returns:
        int: 转换后的整数
    """
    if isinstance(value, bool):
        return default
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return default


def _as_optional_int(value: Any) -> int | None:
    """
    将值转换为可选整数
    
    Args:
        value: 要转换的值
    
    Returns:
        int | None: 转换后的整数或 None
    """
    if value is None:
        return None
    return _as_int(value, default=None)  # type: ignore[arg-type]


def _unique_strings(value: Any) -> list[str]:
    """
    确保列表仅包含唯一的字符串
    
    Args:
        value: 要处理的值
    
    Returns:
        list[str]: 唯一字符串列表
    """
    if not isinstance(value, list):
        return []

    result: list[str] = []
    seen = set()
    for item in value:
        if isinstance(item, str) and item not in seen:
            seen.add(item)
            result.append(item)
    return result


def _bool_map(value: Any) -> dict[str, bool]:
    """
    将字典转换为字符串到布尔值的映射
    
    Args:
        value: 要处理的值
    
    Returns:
        dict[str, bool]: 字符串到布尔值的映射
    """
    if not _is_mapping(value):
        return {}
    return {str(key): bool(flag) for key, flag in value.items()}


def _generic_map(value: Any) -> dict[str, Any]:
    """
    通用字典清理，确保键为字符串并克隆值
    
    Args:
        value: 要处理的值
    
    Returns:
        dict[str, Any]: 清理后的字典
    """
    if not _is_mapping(value):
        return {}
    return {str(key): _clone(item) for key, item in value.items()}


def _int_map(value: Any) -> dict[str, int]:
    """
    将字典转换为字符串到整数的映射
    
    Args:
        value: 要处理的值
    
    Returns:
        dict[str, int]: 字符串到整数的映射
    """
    if not _is_mapping(value):
        return {}

    result: dict[str, int] = {}
    for key, item in value.items():
        if isinstance(item, bool):
            continue
        if isinstance(item, int):
            result[str(key)] = item
        elif isinstance(item, float) and item.is_integer():
            result[str(key)] = int(item)
    return result


def _normalize_profile_keys(data: dict[str, Any]) -> dict[str, Any]:
    """
    处理个人资料字段的别名映射
    
    Args:
        data: 原始个人资料数据
    
    Returns:
        dict[str, Any]: 标准化后的个人资料数据
    """
    normalized = {}
    for key, value in data.items():
        normalized[PROFILE_ALIASES.get(key, key)] = value
    return normalized


def _normalize_run_keys(data: dict[str, Any]) -> dict[str, Any]:
    """
    处理运行状态字段的别名映射
    
    Args:
        data: 原始运行状态数据
    
    Returns:
        dict[str, Any]: 标准化后的运行状态数据
    """
    normalized = {}
    for key, value in data.items():
        normalized[RUN_ALIASES.get(key, key)] = value
    return normalized


def normalize_profile_state(data: Any = None) -> dict[str, Any]:
    """
    标准化个人资料状态数据
    
    Args:
        data: 原始个人资料数据（可选）
    
    Returns:
        dict[str, Any]: 标准化后的个人资料数据
    """
    raw = _normalize_profile_keys(data) if _is_mapping(data) else {}
    return {
        "save_version": _as_int(raw.get("save_version"), PROFILE_SAVE_VERSION),
        "play_count": _as_int(raw.get("play_count"), 0),
        "endings_reached": _unique_strings(raw.get("endings_reached")),
        "achievements": _unique_strings(raw.get("achievements")),
        "visited_options": _bool_map(raw.get("visited_options")),
    }


def normalize_run_state(data: Any = None) -> dict[str, Any]:
    """
    标准化当前运行状态数据
    
    Args:
        data: 原始运行状态数据（可选）
    
    Returns:
        dict[str, Any]: 标准化后的运行状态数据
    """
    raw = _normalize_run_keys(data) if _is_mapping(data) else {}

    # 处理已访问选项，支持旧版布尔字典格式和新版列表格式
    visited_options = raw.get("visited_options")
    if _is_mapping(visited_options):
        normalized_visited_options = _unique_strings(
            [key for key, enabled in visited_options.items() if enabled]
        )
    else:
        normalized_visited_options = _unique_strings(visited_options)

    hint_levels = _int_map(raw.get("hint_levels"))
    flags = _generic_map(raw.get("flags"))

    normalized = {
        "medals": _unique_strings(raw.get("medals")),
        "rooms_completed": _unique_strings(raw.get("rooms_completed")),
        "items": _unique_strings(raw.get("items")),
        "clues": _unique_strings(raw.get("clues")),
        "side_quests": _generic_map(raw.get("side_quests")),
        "flags": flags,
        "hall_medal_count": _as_int(raw.get("hall_medal_count"), 0),
        "current_scene_id": raw.get("current_scene_id")
        if isinstance(raw.get("current_scene_id"), str)
        else DEFAULT_RUN_STATE["current_scene_id"],
        "run_started_at": _as_optional_int(raw.get("run_started_at")),
        "last_hall_medal_count": _as_int(raw.get("last_hall_medal_count"), 0),
        "hint_levels": hint_levels,
        "visited_options": normalized_visited_options,
    }

    # 将未识别的字段作为剧情标记 (flags) 处理
    known_keys = set(DEFAULT_RUN_STATE.keys()) | set(RUN_ALIASES.keys())
    for key, value in raw.items():
        if key in known_keys:
            continue
        # 特殊处理旧版提示等级字段 hint_level_{scene_id}
        if key.startswith("hint_level_"):
            scene_id = key[len("hint_level_") :]
            hint_value = _as_int(value, -1)
            if hint_value >= 0:
                normalized["hint_levels"][scene_id] = hint_value
            continue
        normalized["flags"][str(key)] = _clone(value)

    return normalized


def normalize_root_state(data: Any = None) -> dict[str, Any]:
    """
    标准化整个存档根状态
    
    Args:
        data: 原始根状态数据（可选）
    
    Returns:
        dict[str, Any]: 标准化后的根状态数据
    """
    if not _is_mapping(data):
        return _clone(DEFAULT_ROOT_STATE)

    # 检查是否具有完整的根结构（profile/run）
    has_root_shape = (
        "profile" in data
        or "run" in data
        or "schema_version" in data
    )

    if not has_root_shape:
        # 如果没有根结构，假设整个对象就是 run 状态（旧版兼容）
        return {
            "schema_version": SCHEMA_VERSION,
            "profile": _clone(DEFAULT_PROFILE_STATE),
            "run": normalize_run_state(data),
        }

    schema_version = _as_int(data.get("schema_version"), SCHEMA_VERSION)
    return {
        "schema_version": schema_version,
        "profile": normalize_profile_state(data.get("profile")),
        "run": normalize_run_state(data.get("run")),
    }


def validate_profile_state(data: Any) -> list[StateValidationIssue]:
    """
    验证个人资料状态的合法性
    
    Args:
        data: 要验证的个人资料数据
    
    Returns:
        list[StateValidationIssue]: 验证错误列表
    """
    issues: list[StateValidationIssue] = []
    if not _is_mapping(data):
        return [StateValidationIssue("profile", "个人资料必须是对象格式")]

    if not isinstance(data.get("save_version"), int):
        issues.append(StateValidationIssue("profile.save_version", "save_version 必须是整数"))
    if not isinstance(data.get("play_count"), int):
        issues.append(StateValidationIssue("profile.play_count", "play_count 必须是整数"))
    if not isinstance(data.get("endings_reached"), list):
        issues.append(StateValidationIssue("profile.endings_reached", "endings_reached 必须是列表"))
    if not isinstance(data.get("achievements"), list):
        issues.append(StateValidationIssue("profile.achievements", "achievements 必须是列表"))
    if not _is_mapping(data.get("visited_options")):
        issues.append(StateValidationIssue("profile.visited_options", "visited_options 必须是对象"))
    return issues


def validate_run_state(data: Any) -> list[StateValidationIssue]:
    """
    验证运行状态的合法性
    
    Args:
        data: 要验证的运行状态数据
    
    Returns:
        list[StateValidationIssue]: 验证错误列表
    """
    issues: list[StateValidationIssue] = []
    if not _is_mapping(data):
        return [StateValidationIssue("run", "运行状态必须是对象格式")]

    # 检查所有列表类型的键
    list_keys = {"medals", "rooms_completed", "items", "clues", "visited_options"}
    for key in list_keys:
        if not isinstance(data.get(key), list):
            issues.append(StateValidationIssue(f"run.{key}", f"{key} 必须是列表"))

    # 检查所有映射类型的键
    object_keys = {"side_quests", "flags", "hint_levels"}
    for key in object_keys:
        if not _is_mapping(data.get(key)):
            issues.append(StateValidationIssue(f"run.{key}", f"{key} 必须是对象"))

    if not isinstance(data.get("hall_medal_count"), int):
        issues.append(StateValidationIssue("run.hall_medal_count", "hall_medal_count 必须是整数"))
    if not isinstance(data.get("current_scene_id"), str):
        issues.append(StateValidationIssue("run.current_scene_id", "current_scene_id 必须是字符串"))

    run_started_at = data.get("run_started_at")
    if run_started_at is not None and not isinstance(run_started_at, int):
        issues.append(StateValidationIssue("run.run_started_at", "run_started_at 必须是 null 或整数"))

    if not isinstance(data.get("last_hall_medal_count"), int):
        issues.append(
            StateValidationIssue(
                "run.last_hall_medal_count",
                "last_hall_medal_count 必须是整数",
            )
        )

    return issues


def validate_root_state(data: Any) -> list[StateValidationIssue]:
    """
    验证根存档状态的合法性
    
    Args:
        data: 要验证的根状态数据
    
    Returns:
        list[StateValidationIssue]: 验证错误列表
    """
    issues: list[StateValidationIssue] = []
    if not _is_mapping(data):
        return [StateValidationIssue("root", "根存档必须是对象格式")]

    if not isinstance(data.get("schema_version"), int):
        issues.append(StateValidationIssue("schema_version", "schema_version 必须是整数"))
    issues.extend(validate_profile_state(data.get("profile")))
    issues.extend(validate_run_state(data.get("run")))
    return issues


class StateStore:
    """
    存档管理类，负责数据的存储、标准化、导出和验证
    
    该类提供以下功能：
    - 初始化和管理游戏存档数据
    - 提供对个人资料和运行状态的访问
    - 支持存档数据的替换和导出
    - 执行存档完整性验证
    """
    
    def __init__(self, initial_state: Any = None):
        """
        初始化存档，传入初始数据（可选）
        
        Args:
            initial_state: 初始存档数据（可选）
        """
        self._root = normalize_root_state(initial_state)

    @property
    def root(self) -> dict[str, Any]:
        """
        获取完整的根存档数据
        
        Returns:
            dict[str, Any]: 根存档数据
        """
        return self._root

    @property
    def profile(self) -> dict[str, Any]:
        """
        获取个人资料数据
        
        Returns:
            dict[str, Any]: 个人资料数据
        """
        return self._root["profile"]

    @property
    def run(self) -> dict[str, Any]:
        """
        获取当前运行状态数据
        
        Returns:
            dict[str, Any]: 当前运行状态数据
        """
        return self._root["run"]

    def replace_root(self, payload: Any) -> dict[str, Any]:
        """
        替换整个存档
        
        Args:
            payload: 新的存档数据
        
        Returns:
            dict[str, Any]: 替换后的存档数据
        """
        self._root = normalize_root_state(payload)
        return self._root

    def replace_profile(self, payload: Any) -> dict[str, Any]:
        """
        替换个人资料
        
        Args:
            payload: 新的个人资料数据
        
        Returns:
            dict[str, Any]: 替换后的个人资料数据
        """
        self._root["profile"] = normalize_profile_state(payload)
        return self._root["profile"]

    def replace_run(self, payload: Any) -> dict[str, Any]:
        """
        替换运行状态
        
        Args:
            payload: 新的运行状态数据
        
        Returns:
            dict[str, Any]: 替换后的运行状态数据
        """
        self._root["run"] = normalize_run_state(payload)
        return self._root["run"]

    def export_root(self) -> dict[str, Any]:
        """
        导出完整的根存档克隆
        
        Returns:
            dict[str, Any]: 根存档的深拷贝
        """
        return _clone(self._root)

    def export_profile(self) -> dict[str, Any]:
        """
        导出个人资料克隆
        
        Returns:
            dict[str, Any]: 个人资料的深拷贝
        """
        return _clone(self.profile)

    def export_run(self) -> dict[str, Any]:
        """
        导出运行状态克隆
        
        Returns:
            dict[str, Any]: 运行状态的深拷贝
        """
        return _clone(self.run)

    def validate(self) -> list[StateValidationIssue]:
        """
        执行存档完整性验证
        
        Returns:
            list[StateValidationIssue]: 验证错误列表
        """
        return validate_root_state(self._root)

