import re

with open('data.py', 'r', encoding='utf-8') as f:
    s = f.read()

# We will just replace between scenes["hall_main"] and scenes["library_entry"]
start_idx = s.find('    scenes["hall_main"] = Scene(')
end_idx = s.find('    scenes["library_entry"] = Scene(')

replacement = '''    scenes["hall_main"] = Scene(
        "hall_main",
        """你站在大厅中央。大厅两侧各立着四座大理石雕像。通往各处的门紧闭着。
壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。""",
        [
            Option("🧭 探索庄园", "hall_explore_menu"),
            Option("📜 调查与支线", "hall_story_menu"),
            Option("⚙️ 系统", "hall_system_menu")
        ],
        on_enter=hall_main_enter
    )

    scenes["hall_explore_menu"] = Scene(
        "hall_explore_menu",
        "你将目光投向庄园各处，每个房间都隐藏着谜题。",
        [
            Option("🔍 检查大厅的雕像", "puzzle_statues"),
            Option("📚 图书馆 / 书房", "library_entry"),
            Option("🎵 音乐室", "musicroom_entry"),
            Option("🌿 温室花房", "greenhouse_entry"),
            Option("🎨 二楼画室", "studio_entry"),
            Option("🕳 地下室", "basement_entry"),
            Option("🕰 东侧钟楼", "clocktower_entry"),
            Option("前往二楼最深处的卧室", "bedroom_entry"),
            Option("🚪 中央密室大门 (大结局)", "final_chamber_entry", 
                   condition=lambda s: s.get("hall_medal_count") >= 7),
            Option("⬅ 返回大厅", "hall_main")
        ]
    )

    scenes["hall_story_menu"] = Scene(
        "hall_story_menu",
        "大厅中隐藏着未解的秘密与人物的故事。",
        [
            Option("📄 仔细观察大厅壁炉的纸片", "hall_fireplace"),
            Option("🧑‍💼 管家的秘密", "side_story_1_start", condition=lambda s: not s.get("side_butler_completed", False)),
            Option("🖼 画中之人", "side_story_2_start", condition=lambda s: s.get("side_painting_triggered")),
            Option("🎻 未完成的旋律", "side_story_4_start", condition=lambda s: s.get("side_music_triggered")),
            Option("⬅ 返回大厅", "hall_main")
        ]
    )

    scenes["hall_system_menu"] = Scene(
        "hall_system_menu",
        "你整理了一下思绪。",
        [
            Option("🔄 重置支线（消耗金币补救）", "sys_reset_all_side_quests", condition=lambda s: s.get("any_side_failed")),
            Option("⬅ 返回大厅", "hall_main")
        ]
    )

'''

s_new = s[:start_idx] + replacement + s[end_idx:]

with open('data.py', 'w', encoding='utf-8') as f:
    f.write(s_new)
