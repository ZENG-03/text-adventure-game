import json
import os
import tempfile
import unittest
from pathlib import Path

from engine import GameState
from state_store import StateStore, validate_root_state


class StateStoreTests(unittest.TestCase):
    def test_legacy_flat_flags_migrate_into_run_flags(self):
        state = GameState(
            {
                "hall_medal_count": 3,
                "current_scene_id": "hall_main",
                "side_butler_completed": True,
                "hint_level_hall_main": 2,
                "visited_options": ["title->hall_main"],
            }
        )

        self.assertEqual(state.get("hall_medal_count"), 3)
        self.assertEqual(state.get("current_scene_id"), "hall_main")
        self.assertTrue(state.get("side_butler_completed"))
        self.assertEqual(state.flags["side_butler_completed"], True)
        self.assertEqual(state.get("hint_level_hall_main"), 2)
        self.assertEqual(state.state["hint_levels"]["hall_main"], 2)
        self.assertEqual(state.get("visited_options"), ["title->hall_main"])

    def test_items_and_clues_properties_remain_mutable(self):
        state = GameState()

        state.items.append("怀表")
        state.clues.append("前世记忆")

        self.assertTrue(state.has_item("怀表"))
        self.assertTrue(state.has_clue("前世记忆"))

    def test_save_and_load_round_trip_uses_root_schema(self):
        fd, temp_name = tempfile.mkstemp(suffix=".json")
        os.close(fd)
        save_path = Path(temp_name)

        try:
            state = GameState()
            state.profile["play_count"] = 2
            state.set("hall_medal_count", 5)
            state.set("current_scene_id", "hall_main")
            state.set("side_music_route", "public")
            state.set("hint_level_hall_main", 1)
            state.save(save_path)

            payload = json.loads(save_path.read_text(encoding="utf-8"))
            self.assertEqual(payload["schema_version"], 1)
            self.assertEqual(validate_root_state(payload), [])

            loaded = GameState()
            scene_id = loaded.load(save_path)
        finally:
            try:
                if save_path.exists():
                    save_path.unlink()
            except PermissionError:
                pass

        self.assertEqual(scene_id, "hall_main")
        self.assertEqual(loaded.profile["play_count"], 2)
        self.assertEqual(loaded.get("side_music_route"), "public")
        self.assertEqual(loaded.get("hint_level_hall_main"), 1)

    def test_state_store_normalizes_profile_aliases(self):
        store = StateStore(
            {
                "schema_version": 1,
                "profile": {
                    "playCount": 4,
                    "endingsReached": ["ending_a", "ending_a"],
                    "visitedOptions": {"title->start": 1},
                },
                "run": {},
            }
        )

        self.assertEqual(store.profile["play_count"], 4)
        self.assertEqual(store.profile["endings_reached"], ["ending_a"])
        self.assertEqual(store.profile["visited_options"], {"title->start": True})

    def test_state_store_normalizes_legacy_run_aliases(self):
        store = StateStore(
            {
                "medals": ["起始徽章", "起始徽章"],
                "currentSceneId": "title",
                "runStartedAt": 123456,
                "side_painting_completed": True,
            }
        )

        self.assertEqual(store.run["medals"], ["起始徽章"])
        self.assertEqual(store.run["current_scene_id"], "title")
        self.assertEqual(store.run["run_started_at"], 123456)
        self.assertEqual(store.run["flags"]["side_painting_completed"], True)
        self.assertEqual(validate_root_state(store.export_root()), [])


if __name__ == "__main__":
    unittest.main()
