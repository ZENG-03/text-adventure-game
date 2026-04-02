import re
import json

with open("js/game-scenes.js", "r", encoding="utf-8") as f:
    text = f.read()

targets = set(re.findall(r'target:\s*[\"\']([A-Za-z0-9_]+)[\"\']', text))
scenes = set(re.findall(r'scenes\[[\"\']([A-Za-z0-9_]+)[\"\']\]\s*=', text))

missing = targets - scenes
# Exclude known external targets or functions if any
missing = {m for m in missing if m and m not in ("system_load_auto",)}

print("MISSING SCENES:", missing)

# Check dynamic description logic in game-engine.js vs hall_main
