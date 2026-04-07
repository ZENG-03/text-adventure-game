import unittest
from pathlib import Path

from validate_scenes import validate_assets, validate_generated_scene_js, validate_scene_json


FIXTURE_ROOT = Path(__file__).resolve().parent / "fixtures" / "validate_scenes"


class ValidateScenesTests(unittest.TestCase):
    def test_validate_scene_json_detects_duplicate_ids(self):
        path = FIXTURE_ROOT / "duplicate_ids.json"

        _, issues = validate_scene_json(path)

        self.assertTrue(any(issue.code == "duplicate_key" for issue in issues))

    def test_validate_scene_json_detects_missing_targets(self):
        path = FIXTURE_ROOT / "missing_target.json"

        _, issues = validate_scene_json(path)

        self.assertTrue(any(issue.code == "dangling_target" for issue in issues))

    def test_validate_scene_json_allows_known_external_targets(self):
        path = FIXTURE_ROOT / "external_target.json"

        _, issues = validate_scene_json(path)

        self.assertFalse(any(issue.code == "dangling_target" for issue in issues))

    def test_validate_generated_scene_js_detects_duplicate_assignments(self):
        path = FIXTURE_ROOT / "duplicate_scenes.js"

        issues = validate_generated_scene_js(path)

        self.assertTrue(any(issue.code == "duplicate_scene_assignment" for issue in issues))

    def test_validate_assets_detects_missing_files(self):
        root = FIXTURE_ROOT / "asset_root"

        issues = validate_assets(root)

        self.assertTrue(any(issue.code == "missing_asset" for issue in issues))
        self.assertEqual(
            sum(1 for issue in issues if issue.code == "missing_asset"),
            1,
        )


if __name__ == "__main__":
    unittest.main()
