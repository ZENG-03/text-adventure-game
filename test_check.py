import re
with open('data.py', 'r', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.split('\n')):
    if 'Scene(id="hall_main"' in line or "Scene('hall_main'" in line or "id='hall_main'" in line:
        for j, l in enumerate(text.split('\n')[i-2:i+20]):
            print(f'{i-2+j}: {l}')
        print('======')
