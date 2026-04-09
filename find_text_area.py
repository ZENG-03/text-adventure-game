with open('src/views/GameView.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'text-area' in line or 'sceneDesc' in line:
            print(f'{i}: {line.strip()}')
