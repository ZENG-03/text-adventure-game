import unittest

from data import build_scenes
from engine import GameState


class SceneRegressionTests(unittest.TestCase):
    def setUp(self):
        self.scenes = build_scenes()

    def test_all_option_targets_exist(self):
        missing_targets = []
        for scene_id, scene in self.scenes.items():
            for opt in scene.options:
                if opt.target not in self.scenes:
                    missing_targets.append((scene_id, opt.target))

        self.assertEqual(
            missing_targets,
            [],
            msg=f"Found option targets pointing to missing scenes: {missing_targets}",
        )

    def test_scene_graph_reachability_from_title(self):
        self.assertIn("title", self.scenes, msg="Start scene 'title' is missing")

        visited = set()
        queue = ["title"]

        while queue:
            scene_id = queue.pop(0)
            if scene_id in visited:
                continue
            visited.add(scene_id)

            scene = self.scenes.get(scene_id)
            if scene is None:
                continue

            for opt in scene.options:
                if opt.target not in visited:
                    queue.append(opt.target)

        # opening_studio_ng_plus is accessed from game_over when endings > 0
        visited.add('opening_studio_ng_plus')
        unreachable = sorted(set(self.scenes.keys()) - visited)
        self.assertEqual(
            unreachable,
            [],
            msg=f"Unreachable scenes from 'title': {unreachable}",
        )

    def test_no_dead_end_scenes(self):
        dead_ends = [
            scene_id
            for scene_id, scene in self.scenes.items()
            if len(scene.options) == 0
        ]

        self.assertEqual(
            dead_ends,
            [],
            msg=f"Found dead-end scenes without options: {dead_ends}",
        )

    def test_final_chamber_unlock_condition(self):
        hall_main = self.scenes.get("hall_explore_menu")
        self.assertIsNotNone(hall_main, msg="Scene 'hall_explore_menu' is missing")

        final_entry_opt = None
        for opt in hall_main.options:
            if opt.target == "final_chamber_entry":
                final_entry_opt = opt
                break

        self.assertIsNotNone(
            final_entry_opt,
            msg="No option to 'final_chamber_entry' found in 'hall_explore_menu'",
        )
        self.assertIsNotNone(
            final_entry_opt.condition,
            msg="Final chamber option should have a medal-count condition",
        )

        state = GameState()
        state.set("hall_medal_count", 6)
        self.assertFalse(
            final_entry_opt.condition(state),
            msg="Final chamber should stay locked when medal count < 7",
        )

        state.set("hall_medal_count", 7)
        self.assertTrue(
            final_entry_opt.condition(state),
            msg="Final chamber should unlock when medal count >= 7",
        )

    def test_endings_are_triggerable_with_expected_conditions(self):
        bedroom_entry = self.scenes.get("bedroom_entry")
        self.assertIsNotNone(bedroom_entry, msg="Scene 'bedroom_entry' is missing")

        side_story_1_start = self.scenes.get("side_story_1_start")
        self.assertIsNotNone(side_story_1_start, msg="Scene 'side_story_1_start' is missing")

        side_story_4_start = self.scenes.get("side_story_4_start")
        self.assertIsNotNone(side_story_4_start, msg="Scene 'side_story_4_start' is missing")

        final_test = self.scenes.get("final_test_4")
        self.assertIsNotNone(final_test, msg="Scene 'final_test_4' is missing")

        options_by_target = {opt.target: opt for opt in final_test.options}
        expected_targets = {"ending_1", "ending_2", "ending_3", "ending_4", "ending_5_truth", "ending_6_forgotten", "ending_7_museum"}

        self.assertTrue(
            expected_targets.issubset(options_by_target.keys()),
            msg=(
                "Scene 'final_test_4' does not expose all expected endings. "
                f"Found: {sorted(options_by_target.keys())}"
            ),
        )

        self.assertIsNone(
            options_by_target["ending_1"].condition,
            msg="ending_1 should not require side quest flags",
        )
        self.assertIsNone(
            options_by_target["ending_2"].condition,
            msg="ending_2 should not require side quest flags",
        )

        ending3_cond = options_by_target["ending_3"].condition
        ending4_cond = options_by_target["ending_4"].condition
        self.assertIsNotNone(ending3_cond, msg="ending_3 should have a condition")
        self.assertIsNotNone(ending4_cond, msg="ending_4 should have a condition")

        state = GameState()
        self.assertFalse(
            ending3_cond(state),
            msg="ending_3 should be locked before basement side quest completion",
        )
        state.set("side_underground_completed", True)
        self.assertTrue(
            ending3_cond(state),
            msg="ending_3 should unlock after basement side quest completion",
        )

        state = GameState()
        self.assertFalse(
            ending4_cond(state),
            msg="ending_4 should be locked before painting side quest completion",
        )
        state.set("side_painting_completed", True)
        state.set("side_clock_completed", True)
        self.assertTrue(
            ending4_cond(state),
            msg="ending_4 should unlock after painting side quest completion",
        )

        truth_cond = options_by_target["ending_5_truth"].condition
        self.assertIsNotNone(truth_cond, msg="ending_5_truth should have a condition")
        state = GameState()
        self.assertFalse(
            truth_cond(state),
            msg="ending_5_truth should be locked before side quest completion",
        )
        state.set("side_butler_completed", True)
        state.set("side_underground_completed", True)
        state.set("side_painting_completed", True)
        state.set("side_music_completed", True)
        self.assertFalse(
            truth_cond(state),
            msg="ending_5_truth should stay locked when side_clock_completed is missing",
        )
        state.set("side_clock_completed", True)
        self.assertTrue(
            truth_cond(state),
            msg="ending_5_truth should unlock after side_clock_completed is also set",
        )

        state = GameState()
        state.set("side_butler_completed", True)
        state.set("side_underground_completed", True)
        state.set("side_painting_completed", True)
        state.set("side_clock_completed", True)
        state.set("side_music_completed", True)
        self.assertTrue(
            truth_cond(state),
            msg="ending_5_truth should unlock after the tracked side quests are completed",
        )

        museum_cond = options_by_target["ending_7_museum"].condition
        self.assertIsNotNone(museum_cond, msg="ending_7_museum should have a condition")
        state = GameState()
        self.assertFalse(
            museum_cond(state),
            msg="ending_7_museum should be locked before butler and paint full flags",
        )
        state.set("side_butler_completed", True)
        state.set("side_painting_completed", True)
        self.assertTrue(
            museum_cond(state),
            msg="ending_7_museum should unlock after butler and paint full flags",
        )

        self.assertIsNone(
            options_by_target["ending_6_forgotten"].condition,
            msg="ending_6_forgotten should always be available",
        )


if __name__ == "__main__":
    unittest.main()
