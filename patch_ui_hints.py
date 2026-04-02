import re

with open("js/game-engine.js", "r", encoding="utf-8") as f:
    text = f.read()

old_block = """                let optionText = opt.text || (opt.target === "title" 
                    ? "返回主界面" 
                    : ((opt.target === "hall_main" || opt.target === "hall_main") ? "返回大厅" : "继续探索"));

                let btn = document.createElement("button");
                btn.className = "option-btn";

                if (isAvailable) {
                    btn.innerHTML = "➜ " + optionText;
                    btn.onclick = () => {"""

new_block = """                let optionText = opt.text || (opt.target === "title" 
                    ? "返回主界面" 
                    : ((opt.target === "hall_main" || opt.target === "hall_main") ? "返回大厅" : "继续探索"));

                // Map UI completion hint
                let suffix = "";
                const roomMedalMap = {
                    "puzzle_statues": "勇气徽章",
                    "library_entry": "知识徽章",
                    "musicroom_entry": "和谐徽章",
                    "greenhouse_entry": "生命徽章",
                    "studio_entry": "洞察徽章",
                    "basement_entry": "转化徽章",
                    "clocktower_entry": "怀表"
                };
                if (roomMedalMap[opt.target]) {
                    const req = roomMedalMap[opt.target];
                    if (gameState.items.some(i => i.includes(req))) {
                        suffix = ' <span style="color:#d4af37; font-weight:bold;">🏆(已解开)</span>';
                    }
                }

                let btn = document.createElement("button");
                btn.className = "option-btn";

                if (isAvailable) {
                    btn.innerHTML = "➜ " + optionText + suffix;
                    btn.onclick = () => {"""

if old_block in text:
    text = text.replace(old_block, new_block, 1)
    with open("js/game-engine.js", "w", encoding="utf-8") as f:
        f.write(text)
    print("Patched UI completion hints successfully!")
else:
    print("Could not find the target block for UI hints.")
