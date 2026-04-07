import re
f = 'js/game-scenes.js'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
if 'import { StateAPI }' not in content:
    content = 'import { StateAPI } from \'./game-engine.js\';\n' + content
content = re.sub(r'(?<!StateAPI\.)\b(hasItem|addItem|getFlag|setFlag|hasClue|addClue|removeItem)\(', r'StateAPI.\1(', content)
content = content.replace('gameState.items.push(', 'StateAPI.addItem(')
content = content.replace('gameState.medals.push(', '// ')
content = content.replace('gameState.clues.push(', 'StateAPI.addClue(')

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
print('Done!')
