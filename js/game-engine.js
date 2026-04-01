
// 全局与多周目状态管理
let globalState = {
    saveVersion: 2,
    playCount: 0,
    endingsReached: [],
    achievements: []
};
function safeParseJSON(raw, fallbackValue) {
    if (!raw) return fallbackValue;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return fallbackValue;
    }
}
function isValidGlobalState(data) {
    return data && typeof data === "object" && Array.isArray(data.endingsReached);
}
function isValidGameState(data) {
    return data
        && typeof data === "object"
        && Array.isArray(data.medals)
        && Array.isArray(data.items)
        && Array.isArray(data.clues)
        && typeof data.flags === "object"
        && typeof data.currentSceneId === "string";
}
function migrateSave(data, type) {
    if (!data || typeof data !== "object") return null;
    if (type === "global") {
        return {
            saveVersion: 2,
            playCount: typeof data.playCount === "number" ? data.playCount : 0,
            endingsReached: Array.isArray(data.endingsReached) ? data.endingsReached : [],
            achievements: Array.isArray(data.achievements) ? data.achievements : []
        };
    }
    if (type === "game") {
        return {
            medals: Array.isArray(data.medals) ? data.medals : [],
            items: Array.isArray(data.items) ? data.items : [],
            clues: Array.isArray(data.clues) ? data.clues : [],
            flags: (data.flags && typeof data.flags === "object") ? data.flags : {},
            currentSceneId: typeof data.currentSceneId === "string" ? data.currentSceneId : "title",
            hall_medal_count: typeof data.hall_medal_count === "number" ? data.hall_medal_count : 0
        };
    }
    return data;
}
function unlockAchievement(id, name) {
    if (!globalState.achievements.includes(id)) {
        globalState.achievements.push(id);
        return `<div class="system-message" style="color:#ead67d;font-weight:bold;">🏆 成就解锁：${name}</div>`;
    }
    return "";
}
function checkAchievements() {
    const msgs = [];
    const medalCount = gameState.hall_medal_count || gameState.medals.length;
    const clueCount = gameState.clues.length;
    const uniqueEndings = new Set(globalState.endingsReached || []).size;
    if (medalCount >= 1) msgs.push(unlockAchievement("ach_first_medal", "初入谜域"));
    if (medalCount >= 4) msgs.push(unlockAchievement("ach_half_medals", "半程智者"));
    if (medalCount >= 7) msgs.push(unlockAchievement("ach_all_medals", "七曜归位"));
    if (clueCount >= 10) msgs.push(unlockAchievement("ach_clue_hunter", "线索猎人"));
    if (gameState.currentSceneId && gameState.currentSceneId.startsWith("final_")) msgs.push(unlockAchievement("ach_final_room", "密室访客"));
    if ((globalState.endingsReached || []).includes("自由的智者")) msgs.push(unlockAchievement("ach_ending_free", "自由的智者"));
    if ((globalState.endingsReached || []).includes("永恒的守护者")) msgs.push(unlockAchievement("ach_ending_guardian", "永恒的守护者"));
    if ((globalState.endingsReached || []).includes("谜语馆的回响")) msgs.push(unlockAchievement("ach_ending_echo", "回响"));
    if (uniqueEndings >= 3) msgs.push(unlockAchievement("ach_multi_ending", "命运见证者"));
    if (globalState.achievements.length >= 9) msgs.push(unlockAchievement("ach_master", "谜语大师"));
    if (msgs.some(Boolean)) localStorage.setItem("riddle_global", JSON.stringify(globalState));
    return msgs.filter(Boolean).join("<br>");
}

function getAchievementNameById(id) {
    const names = {
        ach_first_medal: "初入谜域",
        ach_half_medals: "半程智者",
        ach_all_medals: "七曜归位",
        ach_clue_hunter: "线索猎人",
        ach_final_room: "密室访客",
        ach_ending_free: "自由的智者",
        ach_ending_guardian: "永恒的守护者",
        ach_ending_echo: "回响",
        ach_multi_ending: "命运见证者",
        ach_master: "谜语大师"
    };
    return names[id] || id;
}
try {
    const gs = safeParseJSON(localStorage.getItem("riddle_global"), null);
    if (isValidGlobalState(gs)) {
        globalState = migrateSave(gs, "global");
    }
} catch (e) {}

// 单局游戏状态管理
let gameState = {
    medals: [],
    items: [],
    clues: [],
    flags: {}, // 用于存储支线等状态
    currentSceneId: "title",
    hall_medal_count: 0
};

// 辅助方法
function hasItem(item) { return gameState.items.includes(item); }
function hasClue(clue) { return gameState.clues.includes(clue); }
function getFlag(key) { return gameState.flags[key] || false; }
function setFlag(key, val) { gameState.flags[key] = val; }
function addMedal() { gameState.hall_medal_count += 1; }

// 场景定义表

window.scenes = window.scenes || {};
const scenes = window.scenes;

// 设置UI
const storyElement = document.getElementById("story-text");
const optionsContainer = document.getElementById("options-container");

let typeWriterInterval = null;
let isTyping = false;

function isPlaceholderScene(sceneObj) {
    if (!sceneObj || typeof sceneObj.desc !== "string") return false;
    return sceneObj.desc.includes("尚在整理中") || sceneObj.desc.includes("剧情节点");
}

function inferSceneTarget(target) {
    const allSceneIds = Object.keys(scenes || {});
    if (!target || allSceneIds.length === 0) return null;

    const prefix = target.split("_")[0];
    const preferred = allSceneIds.filter((id) => {
        const s = scenes[id];
        return id.startsWith(prefix + "_") && !isPlaceholderScene(s);
    });
    const candidates = preferred.length > 0
        ? preferred
        : allSceneIds.filter((id) => !isPlaceholderScene(scenes[id]));

    const tTokens = new Set(target.split("_"));
    let bestId = null;
    let bestScore = -9999;

    for (let i = 0; i < candidates.length; i++) {
        const id = candidates[i];
        const cTokens = new Set(id.split("_"));
        let overlap = 0;
        tTokens.forEach((tk) => { if (cTokens.has(tk)) overlap++; });

        let commonPrefix = 0;
        const minLen = Math.min(target.length, id.length);
        while (commonPrefix < minLen && target[commonPrefix] === id[commonPrefix]) {
            commonPrefix++;
        }

        const score = overlap * 20 + commonPrefix - Math.abs(id.length - target.length);
        if (score > bestScore) {
            bestScore = score;
            bestId = id;
        }
    }
    return bestScore >= 6 ? bestId : null;
}

function typeWriterHTML(element, htmlString, speed, onComplete) {
    clearInterval(typeWriterInterval);
    element.innerHTML = "";
    isTyping = true;
    
    let i = 0;
    let currentText = "";
    
    // 点击任意位置跳过打字效果
    element.onclick = () => {
        if (isTyping) {
            clearInterval(typeWriterInterval);
            element.innerHTML = htmlString;
            isTyping = false;
            element.onclick = null;
            if (onComplete) onComplete();
        }
    };

    typeWriterInterval = setInterval(() => {
        if (i >= htmlString.length) {
            clearInterval(typeWriterInterval);
            isTyping = false;
            element.onclick = null;
            element.innerHTML = htmlString;
            if (onComplete) onComplete();
            return;
        }
        
        if (htmlString[i] === '<') {
            let tag = "";
            while(i < htmlString.length && htmlString[i] !== '>') {
                tag += htmlString[i];
                i++;
            }
            tag += '>';
            currentText += tag; // 标签瞬间闭合并加入
        } else {
            currentText += htmlString[i];
            i++;
        }
        element.innerHTML = currentText + '<span class="cursor"></span>';
        element.scrollTop = element.scrollHeight;
    }, speed);
}

function renderScene(sceneId) {
    if (sceneId === "system_load_auto") {
        const saved = safeParseJSON(localStorage.getItem("riddle_auto_save"), null);
        const migrated = migrateSave(saved, "game");
        if (isValidGameState(migrated)) {
            gameState = migrated;
            renderScene(gameState.currentSceneId || "title");
        } else {
        }
        return;
    }

    if(sceneId === "title" && gameState.currentSceneId !== "title") {
        // 重置游戏
        gameState = {
            medals: [],
            items: [],
            clues: [],
            flags: {},
            currentSceneId: "title",
            hall_medal_count: 0
        };
    }

    const scene = scenes[sceneId];
    if(!scene) {
        if (sceneId !== "title") {
        }
        return;
    }
    
    gameState.currentSceneId = sceneId;
    
    // 执行自动存档（只有不是在标题和结局界面才存档）
    if (sceneId !== "title" && !sceneId.startsWith("ending_")) {
        localStorage.setItem("riddle_auto_save", JSON.stringify(gameState));
    }

    let locationStr = sceneId;
    if(sceneId === "title") locationStr = "主界面";
    else if(sceneId.startsWith("hall")) locationStr = "大厅";
    else if(sceneId.startsWith("library")) locationStr = "图书馆";
    else if(sceneId.startsWith("musicroom")) locationStr = "音乐室";
    else if(sceneId.startsWith("greenhouse")) locationStr = "温室";
    else if(sceneId.startsWith("studio")) locationStr = "画室";
    else if(sceneId.startsWith("basement")) locationStr = "地下室";
    else if(sceneId.startsWith("clocktower")) locationStr = "钟楼";
    else if(sceneId.startsWith("final")) locationStr = "中央密室";
    
    const locationNameEl = document.getElementById("location-name");
    if (locationNameEl) {
        locationNameEl.innerText = "位置：" + locationStr;
    }

    let extraMsg = "";
    if (scene.on_enter) {
        extraMsg = scene.on_enter();
    }
    const achMsg = checkAchievements();
    if (achMsg) {
        extraMsg += (extraMsg ? "<br><br>" : "") + achMsg;
    }

    let fullDescHTML = scene.desc.replace(/\\n/g, "<br>") + (extraMsg ? "<br><br>" + extraMsg : "");
    
    // 清空并隐藏选项，等待打字机效果结束
    optionsContainer.innerHTML = "";
    optionsContainer.style.display = "none";

    typeWriterHTML(storyElement, fullDescHTML, 25, () => {
        optionsContainer.style.display = "flex";

        const options = Array.isArray(scene.options) ? [...scene.options] : [];
        const isEndingScene = sceneId === "game_over" || sceneId.startsWith("ending_");
        if (isEndingScene) {
            options.push({ text: "返回主界面", target: "title" });
            options.push({ text: "返回大厅", target: "hall_main" });
        }

        if (options.length === 0) {
            options.push({ text: "返回主界面", target: "title" });
        }

        options.forEach(opt => {
            let isAvailable = true;
            if (opt.condition) {
                try {
                    isAvailable = !!opt.condition();
                } catch (e) {
                    isAvailable = true;
                }
            }
            const rawText = (opt.text || "").trim();
            const isPlaceholderText = /^[-—－\s]+$/.test(rawText);
            const optionText = (rawText && !isPlaceholderText)
                ? rawText
                : (opt.target === "title"
                    ? "返回主界面"
                    : ((opt.target === "hall_main" || opt.target === "hall") ? "返回大厅" : "继续探索"));
            
            let btn = document.createElement("button");
            btn.className = "option-btn";
            
            if (isAvailable) {
                btn.innerHTML = "➤ " + optionText;
                btn.onclick = () => {
                    if(opt.effectMsg) {
                        let hint = document.createElement("div");
                        hint.className = "system-message";
                        hint.innerText = opt.effectMsg;
                        storyElement.appendChild(hint);
                        storyElement.scrollTop = storyElement.scrollHeight;
                    }
                    const nextTarget = opt.target || sceneId;
                    let normalizedTarget = nextTarget === "hall" ? "hall_main" : nextTarget;

                    const currentTargetScene = scenes[normalizedTarget];
                    if (!currentTargetScene || isPlaceholderScene(currentTargetScene)) {
                        const inferred = inferSceneTarget(normalizedTarget);
                        if (inferred) {
                            normalizedTarget = inferred;
                        }
                    }

                    if(normalizedTarget !== sceneId) {
                        if (normalizedTarget === "system_load_auto" || scenes[normalizedTarget]) {
                            renderScene(normalizedTarget);
                        } else {
                            const fallbackTarget = scenes["hall_main"] ? "hall_main" : "title";
                            const fallbackLabel = fallbackTarget === "hall_main" ? "大厅" : "主界面";
                            let hint = document.createElement("div");
                            hint.className = "danger-message";
                            hint.innerText = "该选项对应场景尚未完成，已为你返回" + fallbackLabel + "。";
                            storyElement.appendChild(hint);
                            storyElement.scrollTop = storyElement.scrollHeight;
                            renderScene(fallbackTarget);
                        }
                    } else if (!opt.effectMsg) {
                        let hint = document.createElement("div");
                        hint.className = "system-message";
                        hint.innerText = "这里暂时没有新的变化。";
                        storyElement.appendChild(hint);
                        storyElement.scrollTop = storyElement.scrollHeight;
                    }
                };
            } else {
                btn.innerHTML = "➤ <del>" + optionText + "</del> <span style='font-size:0.85em;color:#777;margin-left:8px;'>(线索或道具不足，无法解锁)</span>";
                btn.classList.add("disabled");
                btn.disabled = true;
            }
            optionsContainer.appendChild(btn);
        });
        storyElement.scrollTop = storyElement.scrollHeight;
    });
}


function updateInventoryDisplay() {
    const invItems = document.getElementById("inv-items");
    const invClues = document.getElementById("inv-clues");
    const medalCountSpan = document.getElementById("medal-count");
    const invMedals = document.getElementById("inv-medals");
    
    let itemsHtml = "";
    let cluesHtml = "";
    let medalsCount = 0;
    let medalsHtml = "";
    
    for (let i = 0; i < gameState.items.length; i++) {
        let item = gameState.items[i];
        if (item.startsWith("[道具]")) {
            itemsHtml += "<span class='inv-item'>" + item.replace("[道具]", "").trim() + "</span> ";
        } else if (item.startsWith("【徽章】")) {
            medalsCount++;
            medalsHtml += "<span class='inv-item medal'>" + item.replace("【徽章】", "").trim() + "</span> ";
        } else {
            itemsHtml += "<span class='inv-item'>" + item.trim() + "</span> ";
        }
    }
    
    for (let i = 0; i < gameState.clues.length; i++) {
        let clue = gameState.clues[i];
        if (clue.startsWith("[线索]")) {
            cluesHtml += "<span class='inv-item'>" + clue.replace("[线索]", "").trim() + "</span> ";
        } else {
            cluesHtml += "<span class='inv-item'>" + clue.trim() + "</span> ";
        }
    }
    
    if (invItems) invItems.innerHTML = itemsHtml ? itemsHtml : "<span class='empty-text'>无</span>";
    if (invClues) invClues.innerHTML = cluesHtml ? cluesHtml : "<span class='empty-text'>无</span>";
    if (medalCountSpan) medalCountSpan.innerText = gameState.hall_medal_count || medalsCount;
    if (invMedals) invMedals.innerHTML = medalsHtml ? medalsHtml : "<span class='empty-text'>无</span>";

    const ngCountSpan = document.getElementById("ng-count");
    const endingCountSpan = document.getElementById("ending-count");
    const invAch = document.getElementById("inv-achievements");
    
    if (ngCountSpan) ngCountSpan.innerText = globalState.playCount || 0;
    
    let reachedEndings = globalState.endingsReached || [];
    let uniqueEndings = new Set(reachedEndings).size;
    
    if (endingCountSpan) endingCountSpan.innerText = uniqueEndings;
    
    if (invAch) {
        let achHtml = "";
        let uniqueArr = Array.from(new Set(reachedEndings));
        for(let i = 0; i < uniqueArr.length; i++) {
            let e = uniqueArr[i];
            let e_name = e.replace("ending_", "");
            if (e_name === "normal") e_name = "梦境的终结(大结局)";
            achHtml += "<div class='inv-item achievement' style='display:block;margin-bottom:5px;'><span class='icon'>✨</span> 结局: " + e_name + "</div>";
        }
        if (Array.isArray(globalState.achievements) && globalState.achievements.length > 0) {
            achHtml += "<div class='inv-item achievement' style='display:block;margin-bottom:5px;'><span class='icon'>🏆</span> 成就数量: " + globalState.achievements.length + "</div>";
        }
        if(achHtml === "") achHtml = "<span class='empty-text'>暂无成就</span>";
        invAch.innerHTML = achHtml;
    }
}

function updateAchievementDisplay() {
    const achTotal = document.getElementById("ach-total");
    const achEndingCount = document.getElementById("ach-ending-count");
    const achNgCount = document.getElementById("ach-ng-count");
    const achList = document.getElementById("ach-list");
    if (!achList) return;

    const allAchievements = Array.isArray(globalState.achievements) ? globalState.achievements : [];
    const uniqueEndings = new Set(globalState.endingsReached || []).size;

    if (achTotal) achTotal.innerText = String(allAchievements.length);
    if (achEndingCount) achEndingCount.innerText = String(uniqueEndings);
    if (achNgCount) achNgCount.innerText = String(globalState.playCount || 0);

    if (allAchievements.length === 0) {
        achList.innerHTML = "<span class='empty-text'>暂无成就</span>";
        return;
    }

    let html = "";
    for (let i = 0; i < allAchievements.length; i++) {
        const id = allAchievements[i];
        html += "<div class='inv-item achievement' style='display:block;margin-bottom:5px;'><span class='icon'>🏆</span> " + getAchievementNameById(id) + "</div>";
    }
    achList.innerHTML = html;
}

window.closePanels = function() {
    const overlay = document.getElementById("overlay");
    const inventoryPanel = document.getElementById("inventory-panel");
    const achievementPanel = document.getElementById("achievement-panel");

    if (inventoryPanel) {
        inventoryPanel.classList.remove("open");
        inventoryPanel.style.display = "none";
    }
    if (achievementPanel) {
        achievementPanel.classList.remove("open");
        achievementPanel.style.display = "none";
    }
    if (overlay) overlay.style.display = "none";
};

window.toggleInventory = function() {
    let panel = document.getElementById("inventory-panel");
    let achievementPanel = document.getElementById("achievement-panel");
    let overlay = document.getElementById("overlay");
    if (!panel || !overlay) return;
    if(panel.classList.contains("open")){
        closePanels();
    } else {
        if (achievementPanel) {
            achievementPanel.classList.remove("open");
            achievementPanel.style.display = "none";
        }
        updateInventoryDisplay();
        panel.style.display = "block";
        panel.classList.add("open");
        overlay.style.display = "block";
    }
}

window.toggleAchievements = function() {
    let panel = document.getElementById("achievement-panel");
    let inventoryPanel = document.getElementById("inventory-panel");
    let overlay = document.getElementById("overlay");
    if (!panel || !overlay) return;
    if(panel.classList.contains("open")){
        closePanels();
    } else {
        if (inventoryPanel) {
            inventoryPanel.classList.remove("open");
            inventoryPanel.style.display = "none";
        }
        updateAchievementDisplay();
        panel.style.display = "block";
        panel.classList.add("open");
        overlay.style.display = "block";
    }
}

window.returnToHall = function() {
    if (gameState.currentSceneId === 'hall_main' || gameState.currentSceneId === 'hall_initial_enter') {
        let hint = document.createElement("div");
        hint.className = "danger-message";
        hint.innerText = "你已经在门厅了。";
        const storyEl = document.getElementById("story-text");
        if (storyEl) {
            storyEl.appendChild(hint);
        }
        return;
    }
    renderScene('hall_main');
}

window.saveGame = function() {
    gameState = migrateSave(gameState, "game");
    globalState = migrateSave(globalState, "global");
    localStorage.setItem("riddle_save", JSON.stringify(gameState));
    localStorage.setItem("riddle_global", JSON.stringify(globalState));
    alert("游戏已保存至浏览器！");
}

window.loadGame = function() {
    const saved = safeParseJSON(localStorage.getItem("riddle_save"), null);
    const migrated = migrateSave(saved, "game");
    if (isValidGameState(migrated)) {
        gameState = migrated;
        renderScene(gameState.currentSceneId || "title");
        alert("读取成功！");
    } else {
        alert("找不到可用存档，或存档已损坏。");
    }
}

// 初始渲染
renderScene("title");
