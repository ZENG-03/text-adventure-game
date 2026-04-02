with open('data.py', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '"hall_main":' in line.replace(" ", "") or "'hall_main':" in line.replace(" ", ""):
            print(f'Line {i+1}: {line.strip()}')