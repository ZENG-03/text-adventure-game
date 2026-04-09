with open('src/views/GameView.vue', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('sceneDesc.value = descHtml.replace(/\\ng/, \"<br>\");', 'sceneDesc.value = descHtml.replace(/\\\\n/g, \"<br>\");')
with open('src/views/GameView.vue', 'w', encoding='utf-8') as f:
    f.write(text)
