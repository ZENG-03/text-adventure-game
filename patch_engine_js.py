import os
import re

file_path = "js/game-engine.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip_settings = False
inside_settings = False

# We will collect the gameSettings declaration
game_settings_block = []

i = 0
while i < len(lines):
    line = lines[i]
    if line.strip() == "var gameSettings = {" or line.strip() == "let gameSettings = {":
        inside_settings = True
        game_settings_block.append(line)
        i += 1
        while i < len(lines):
            line = lines[i]
            game_settings_block.append(line)
            if "};" in line:
                inside_settings = False
                i += 1
                break
            i += 1
        continue
    
    if "let gameHints = null;" in line:
        # Just skip this declaration since var gameHints follows
        i += 1
        continue

    new_lines.append(line)
    i += 1

# Insert gameSettings block at the very top, after the first comment
inserted = False
for j, line in enumerate(new_lines):
    if not line.strip().startswith("//"):
        # Insert here
        final_lines = new_lines[:j] + game_settings_block + ["\n"] + new_lines[j:]
        inserted = True
        break

if not inserted:
    final_lines = game_settings_block + ["\n"] + new_lines

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(final_lines)

print("game-engine.js patched!")
