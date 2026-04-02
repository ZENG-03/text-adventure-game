import re

with open('data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_def = False
for line in lines:
    if line.strip() == 'def hall_main_enter(state):':
        in_def = True
        new_lines.append('    def hall_main_enter(state):\n')
    elif in_def:
        if line.startswith('    return None'):
            in_def = False
            new_lines.append('        return None\n')
        elif len(line.strip()) > 0 and not line.startswith('        '):
            new_lines.append('    ' + line)
        else:
            new_lines.append(line)
    else:
        new_lines.append(line)

with open('data.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
