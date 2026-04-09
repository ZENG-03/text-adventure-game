with open('src/views/GameView.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'sceneDesc.value =' in line:
            for j in range(max(0, i-5), i+15):
                print(f'{j}: {lines[j]}', end='')
            break
