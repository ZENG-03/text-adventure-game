with open('build_js_all.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_str = """        if not opts:
            opts.append('        { text: "返回大厅", target: "hall_main" }')"""

new_str = """        if not opts:
            if sid.startswith("ending_") or "death" in sid or sid == "game_over" or "gameover" in sid:
                opts.append('        { text: "【游戏结束】返回标题", target: "title" }')
            else:
                opts.append('        { text: "返回大厅", target: "hall_main" }')"""

if old_str in text:
    text = text.replace(old_str, new_str)
    with open('build_js_all.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched fallback options successfully!")
else:
    print("Fallback block not found in build_js_all.py")
