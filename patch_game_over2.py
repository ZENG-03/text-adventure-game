with open('js/game-scenes.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_game_over = """scenes["game_over"] = {
    on_enter: () => {
        const endings = globalState.endingsReached;
        const lastEnding = endings.length > 0 ? endings[endings.length - 1] : "未知结局";
        const achMsg = checkAchievements();
        
        let msg = `<div style="text-align:center;">`;
        msg += `<h2 style="color:var(--hover-color);">—— 游戏结束 ——</h2>`;
        msg += `<h3>你解锁的结局：<br><span style="color:var(--hover-color);font-size:1.5em;line-height:2em;">${lastEnding}</span></h3>`;
        if (achMsg) {
            msg += `<div style="margin-top:20px;padding:10px;border:1px dashed #ccc;text-align:left;">${achMsg}</div>`;
        }
        msg += `</div>`;
        
        return msg;
    },
    desc: ``,
    options: []
};

// --- 自动生成的"""

if '// --- 自动生成的' in text and 'scenes["game_over"] =' not in text[:text.find('// --- 自动生成的')]:
    text = text.replace('// --- 自动生成的', new_game_over, 1)
    with open('js/game-scenes.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched game_over into game-scenes.js!")
else:
    print("Already patched or could not find anchor.")
