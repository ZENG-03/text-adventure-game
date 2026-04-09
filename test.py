with open('src/views/GameView.vue', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('@click=\"selectOption(option)\"', '@click=\"selectOption(option.target)\"')

with open('src/views/GameView.vue', 'w', encoding='utf-8') as f:
    f.write(text)
