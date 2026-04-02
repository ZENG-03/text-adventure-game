with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find the valid HTML start
html_starts = [i for i, l in enumerate(lines) if '<html' in l.lower()]
print("HTML starts at:", html_starts)

if len(html_starts) > 1:
    last_start = html_starts[-1]
    # Check if there's a doctype before it
    if last_start > 0 and '!DOCTYPE' in lines[last_start-1]:
        start = last_start - 1
    else:
        start = last_start
    lines = lines[start:]

content = "".join(lines)

# Inject the Hint button next to the Settings button
# <button id="settings-btn" class="nav-btn" onclick="toggleSettings()">设置</button>
hint_btn = '<button id="hint-btn" class="nav-btn" onclick="showHint()" style="color:#d4af37;">提示</button>'

if 'id="hint-btn"' not in content:
    content = content.replace(
        '<button id="settings-btn"',
        hint_btn + '\n        <button id="settings-btn"'
    )

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned up index.html and added hint button.")
