with open('js/game-scenes.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_game_over = """scenes["game_over"] = {
    on_enter: () => {
        let msg = "";
        const endings = globalState.endingsReached;
        const lastEnding = endings.length > 0 ? endings[endings.length - 1] : "未知结局";
        const achMsg = checkAchievements();
        
        let desc = `<div style="text-align:center;">`;
        desc += `<h2>—— 游戏结束 ——</h2>`;
        desc += `<p>你解锁的结局：<span style="color:var(--hover-color);font-weight:bold;">${lastEnding}</span></p>`;
        if (achMsg) {
            desc += `<div style="margin-top:20px;padding:10px;border:1px solid #ccc;">${achMsg}</div>`;
        }
        desc += `</div>`;
        
        return desc;
    },
    desc: ``,
    options: [
        { text: "带着记忆苏醒 (开启多周目)", target: "opening_studio_ng_plus", condition: () => globalState.endingsReached.length > 0 },
        { text: "重新开始", target: "title", effectMsg: "时间倒流..." }
    ]
};

// --- 自动生成的"""

if '// --- 自动生成的' in text:
    text = text.replace('// --- 自动生成的', new_game_over, 1)
    with open('js/game-scenes.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched game_over into game-scenes.js!")
