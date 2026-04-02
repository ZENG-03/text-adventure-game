import re

with open("data.py", "r", encoding="utf-8") as f:
    text = f.read()

# Replace state.current_scene logic with accessing the dictionary
text = re.sub(
    r'if\s+state\.current_scene:\s*state\.current_scene\.desc\s*=\s*desc',
    r'if "hall_main" in scenes:\n            scenes["hall_main"].desc = desc',
    text
)

with open("data.py", "w", encoding="utf-8") as f:
    f.write(text)

print("data.py patched successfully.")
