import re

with open('src/views/GameView.vue', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('\images/items/\.png\', '\\images/items/\.png\')
text = text.replace('\images/characters/\\', '\\images/characters/\\')
text = text.replace('\images/items/\.png\', '\\images/items/\.png\')

with open('src/views/GameView.vue', 'w', encoding='utf-8') as f:
    f.write(text)
