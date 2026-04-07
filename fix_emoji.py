import re

with open('js/game-scenes.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'[\ufffd\?\s]+查看笔记', '📘 查看笔记', text)

with open('js/game-scenes.js', 'w', encoding='utf-8') as f:
    f.write(text)
