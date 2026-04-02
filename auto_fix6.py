import re

with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'def \w+_enter\(state\):[\s\S]{10,500}scenes\["\w+"\] = Scene\(', text):
    print("MATCH----------")
    print(m.group(0)[:150] + '...')
