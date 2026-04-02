import re

with open('js/game-engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_part = """    else if(sceneId.startsWith("final")) locationStr = "中央密室";

    // 动态添加房间离开过渡如果刚刚获得了新徽章
    if (sceneId === "hall_main") {
        let prevMedalCount = gameState.last_hall_medal_count || 0;
        if (gameState.hall_medal_count > prevMedalCount) {
            let transitionId = "sys_room_exit_transition";
            window.scenes[transitionId] = {
                desc: "你将刚刚获得的徽章小心翼翼地收好，长舒了一口气。\\n伴随着沉重的锁舌闭合声，这扇门在你身后缓缓关上，你再次回到了冰冷的大厅，但你的心境已经不再相同。",
                options: [{ text: "继续探索大厅", target: "hall_main" }]
            };
            gameState.last_hall_medal_count = gameState.hall_medal_count;
            renderScene(transitionId);
            return;
        }
        gameState.last_hall_medal_count = gameState.hall_medal_count;
    }"""

text = re.sub(r'else if\(sceneId\.startsWith\("final"\)\) locationStr = "中央密室";', new_part, text, count=1)

with open('js/game-engine.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Patched transition logic successfully!")
