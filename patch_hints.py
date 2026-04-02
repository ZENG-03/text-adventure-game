import re

hint_code = """
let gameHints = null;

window.showHint = function() {
    if (!gameHints) {
        fetch('data/hints.json')
            .then(res => res.json())
            .then(data => {
                gameHints = data;
                displayHintMessage();
            })
            .catch(e => {
                window.showToast("无法加载提示数据，请在本机服务器下运行。");
                console.error(e);
            });
    } else {
        displayHintMessage();
    }
}

function displayHintMessage() {
    if (!gameState || !gameState.currentSceneId) return;
    
    let sid = gameState.currentSceneId;
    let hintList = gameHints[sid];
    if (!hintList) {
        let prefix = sid.split('_')[0] + "_entry";
        hintList = gameHints[prefix];
    }
    if (!hintList && sid.startsWith("hall_")) hintList = gameHints["hall_main"];
    if (!hintList) hintList = gameHints["default"];
    
    let hintStr = "";
    if (Array.isArray(hintList)) {
        hintStr = hintList[Math.floor(Math.random() * hintList.length)];
    } else {
        hintStr = hintList;
    }
    
    // Since toast disappears quickly, let's make it last 4 seconds for hints.
    let t = document.createElement("div");
    t.innerHTML = "<strong>💡 神秘指引：</strong><br>" + hintStr;
    t.style = "position:fixed;top:60px;right:20px;background:rgba(212,175,55,0.9);color:#000;padding:12px 20px;border-radius:8px;font-size:15px;z-index:9999;transition:opacity 0.5s;pointer-events:none;max-width:300px;box-shadow:0 4px 10px rgba(0,0,0,0.5);line-height:1.5;";
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 500); }, 5000);
}
"""

with open("js/game-engine.js", "r", encoding="utf-8") as f:
    text = f.read()

if "window.showHint =" not in text:
    text += "\n" + hint_code + "\n"
    with open("js/game-engine.js", "w", encoding="utf-8") as f:
        f.write(text)
    print("Added hint logic to game-engine.js")
