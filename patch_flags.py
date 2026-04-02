import re
import glob

replacements = {
    # 触发标志
    "flag_butler_triggered": "side_butler_triggered",
    "flag_side_painting_triggered": "side_painting_triggered",
    "flag_side_underground_triggered": "side_underground_triggered",
    "flag_side_music_triggered": "side_music_triggered",
    
    # 废弃的标志替换
    "sq_paint": "side_painting_triggered",
    "sq_base": "side_underground_triggered",

    # 完成标志基本对应上了（side_butler_completed, side_painting_completed, side_underground_completed, side_music_completed, side_clock_completed）
}

for filepath in ["js/game-engine.js", "engine.py", "data.py", "js/game-scenes.js"]:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
        
        orig_text = text
        for k, v in replacements.items():
            text = text.replace(f'"{k}"', f'"{v}"')
            text = text.replace(f"'{k}'", f"'{v}'")
        
        if text != orig_text:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Updated flags in {filepath}")
    except Exception as e:
        print(f"Failed to update {filepath}: {e}")

print("Flags unified.")
