from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from typing import Any


SCHEMA_VERSION = 1
PROFILE_SAVE_VERSION = 4

DEFAULT_PROFILE_STATE = {
    "save_version": PROFILE_SAVE_VERSION,
    "play_count": 0,
    "endings_reached": [],
    "achievements": [],
    "visited_options": {},
}

DEFAULT_RUN_STATE = {
    "medals": [],
    "rooms_completed": [],
    "items": [],
    "clues": [],
    "side_quests": {},
    "flags": {},
    "hall_medal_count": 0,
    "current_scene_id": "title",
    "run_started_at": None,
    "last_hall_medal_count": 0,
    "hint_levels": {},
    "visited_options": [],
}

DEFAULT_ROOT_STATE = {
    "schema_version": SCHEMA_VERSION,
    "profile": DEFAULT_PROFILE_STATE,
    "run": DEFAULT_RUN_STATE,
}

PROFILE_ALIASES = {
    "saveVersion": "save_version",
    "playCount": "play_count",
    "endingsReached": "endings_reached",
    "visitedOptions": "visited_options",
}

RUN_ALIASES = {
    "currentSceneId": "current_scene_id",
    "runStartedAt": "run_started_at",
    "lastHallMedalCount": "last_hall_medal_count",
    "hintLevels": "hint_levels",
    "visitedOptions": "visited_options",
}


@dataclass(frozen=True)
class StateValidationIssue:
    path: str
    message: str


def _clone(value: Any) -> Any:
    return deepcopy(value)


def _is_mapping(value: Any) -> bool:
    return isinstance(value, dict)


def _as_int(value: Any, default: int = 0) -> int:
    if isinstance(value, bool):
        return default
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return default


def _as_optional_int(value: Any) -> int | None:
    if value is None:
        return None
    return _as_int(value, default=None)  # type: ignore[arg-type]


def _unique_strings(value: Any) -> list[str]:
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
    if not _is_mapping(value):
        return {}
    return {str(key): bool(flag) for key, flag in value.items()}


def _generic_map(value: Any) -> dict[str, Any]:
    if not _is_mapping(value):
        return {}
    return {str(key): _clone(item) for key, item in value.items()}


def _int_map(value: Any) -> dict[str, int]:
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
    normalized = {}
    for key, value in data.items():
        normalized[PROFILE_ALIASES.get(key, key)] = value
    return normalized


def _normalize_run_keys(data: dict[str, Any]) -> dict[str, Any]:
    normalized = {}
    for key, value in data.items():
        normalized[RUN_ALIASES.get(key, key)] = value
    return normalized


def normalize_profile_state(data: Any = None) -> dict[str, Any]:
    raw = _normalize_profile_keys(data) if _is_mapping(data) else {}
    return {
        "save_version": _as_int(raw.get("save_version"), PROFILE_SAVE_VERSION),
        "play_count": _as_int(raw.get("play_count"), 0),
        "endings_reached": _unique_strings(raw.get("endings_reached")),
        "achievements": _unique_strings(raw.get("achievements")),
        "visited_options": _bool_map(raw.get("visited_options")),
    }


def normalize_run_state(data: Any = None) -> dict[str, Any]:
    raw = _normalize_run_keys(data) if _is_mapping(data) else {}

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

    known_keys = set(DEFAULT_RUN_STATE.keys()) | set(RUN_ALIASES.keys())
    for key, value in raw.items():
        if key in known_keys:
            continue
        if key.startswith("hint_level_"):
            scene_id = key[len("hint_level_") :]
            hint_value = _as_int(value, -1)
            if hint_value >= 0:
                normalized["hint_levels"][scene_id] = hint_value
            continue
        normalized["flags"][str(key)] = _clone(value)

    return normalized


def normalize_root_state(data: Any = None) -> dict[str, Any]:
    if not _is_mapping(data):
        return _clone(DEFAULT_ROOT_STATE)

    has_root_shape = (
        "profile" in data
        or "run" in data
        or "schema_version" in data
    )

    if not has_root_shape:
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
    issues: list[StateValidationIssue] = []
    if not _is_mapping(data):
        return [StateValidationIssue("profile", "profile must be an object")]

    if not isinstance(data.get("save_version"), int):
        issues.append(StateValidationIssue("profile.save_version", "save_version must be an integer"))
    if not isinstance(data.get("play_count"), int):
        issues.append(StateValidationIssue("profile.play_count", "play_count must be an integer"))
    if not isinstance(data.get("endings_reached"), list):
        issues.append(StateValidationIssue("profile.endings_reached", "endings_reached must be a list"))
    if not isinstance(data.get("achievements"), list):
        issues.append(StateValidationIssue("profile.achievements", "achievements must be a list"))
    if not _is_mapping(data.get("visited_options")):
        issues.append(StateValidationIssue("profile.visited_options", "visited_options must be an object"))
    return issues


def validate_run_state(data: Any) -> list[StateValidationIssue]:
    issues: list[StateValidationIssue] = []
    if not _is_mapping(data):
        return [StateValidationIssue("run", "run must be an object")]

    list_keys = {"medals", "rooms_completed", "items", "clues", "visited_options"}
    for key in list_keys:
        if not isinstance(data.get(key), list):
            issues.append(StateValidationIssue(f"run.{key}", f"{key} must be a list"))

    object_keys = {"side_quests", "flags", "hint_levels"}
    for key in object_keys:
        if not _is_mapping(data.get(key)):
            issues.append(StateValidationIssue(f"run.{key}", f"{key} must be an object"))

    if not isinstance(data.get("hall_medal_count"), int):
        issues.append(StateValidationIssue("run.hall_medal_count", "hall_medal_count must be an integer"))
    if not isinstance(data.get("current_scene_id"), str):
        issues.append(StateValidationIssue("run.current_scene_id", "current_scene_id must be a string"))

    run_started_at = data.get("run_started_at")
    if run_started_at is not None and not isinstance(run_started_at, int):
        issues.append(StateValidationIssue("run.run_started_at", "run_started_at must be null or an integer"))

    if not isinstance(data.get("last_hall_medal_count"), int):
        issues.append(
            StateValidationIssue(
                "run.last_hall_medal_count",
                "last_hall_medal_count must be an integer",
            )
        )

    return issues


def validate_root_state(data: Any) -> list[StateValidationIssue]:
    issues: list[StateValidationIssue] = []
    if not _is_mapping(data):
        return [StateValidationIssue("root", "root state must be an object")]

    if not isinstance(data.get("schema_version"), int):
        issues.append(StateValidationIssue("schema_version", "schema_version must be an integer"))
    issues.extend(validate_profile_state(data.get("profile")))
    issues.extend(validate_run_state(data.get("run")))
    return issues


class StateStore:
    def __init__(self, initial_state: Any = None):
        self._root = normalize_root_state(initial_state)

    @property
    def root(self) -> dict[str, Any]:
        return self._root

    @property
    def profile(self) -> dict[str, Any]:
        return self._root["profile"]

    @property
    def run(self) -> dict[str, Any]:
        return self._root["run"]

    def replace_root(self, payload: Any) -> dict[str, Any]:
        self._root = normalize_root_state(payload)
        return self._root

    def replace_profile(self, payload: Any) -> dict[str, Any]:
        self._root["profile"] = normalize_profile_state(payload)
        return self._root["profile"]

    def replace_run(self, payload: Any) -> dict[str, Any]:
        self._root["run"] = normalize_run_state(payload)
        return self._root["run"]

    def export_root(self) -> dict[str, Any]:
        return _clone(self._root)

    def export_profile(self) -> dict[str, Any]:
        return _clone(self.profile)

    def export_run(self) -> dict[str, Any]:
        return _clone(self.run)

    def validate(self) -> list[StateValidationIssue]:
        return validate_root_state(self._root)
