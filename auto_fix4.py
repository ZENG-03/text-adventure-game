import re

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'scenes\["(studio_entry|basement_entry|musicroom_entry)"\]', text):
    start = m.start()
    print(text[start:start+300])
