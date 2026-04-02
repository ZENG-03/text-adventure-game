
// 全局与多周目状态管理
let globalState = {
    saveVersion: 3,
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
            saveVersion: 3,
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
            hall_medal_count: typeof data.hall_medal_count === "number" ? data.hall_medal_count : 0,
            runStartedAt: typeof data.runStartedAt === "number" ? data.runStartedAt : null
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
/** 计入「谜语大师」的 19 项常规成就（不含第 20 项大师本身） */
const ACHIEVEMENTS_FOR_MASTER = [
    "ach_first_medal",
    "ach_half_medals",
    "ach_all_medals",
    "ach_all_seeing",
    "ach_manor_child",
    "ach_lightning",
    "ach_cautious",
    "ach_brutal",
    "ach_clue_hunter",
    "ach_uncrowned",
    "ach_brother",
    "ach_painting_meet",
    "ach_symphony_done",
    "ach_underground_echo",
    "ach_all_stories",
    "ach_nightingale_gift",
    "ach_ending_free",
    "ach_eternal_echo",
    "ach_true_end"
];

function checkAchievements() {
    const msgs = [];
    const medalCount = gameState.hall_medal_count || gameState.medals.length;
    const clueCount = gameState.clues.length;
    const ends = globalState.endingsReached || [];
    const hasEnd = (name) => ends.includes(name);

    if (medalCount >= 1) msgs.push(unlockAchievement("ach_first_medal", "初入谜域"));
    if (medalCount >= 4) msgs.push(unlockAchievement("ach_half_medals", "半程智者"));
    if (medalCount >= 7) msgs.push(unlockAchievement("ach_all_medals", "七曜归位"));

    if (medalCount >= 7 && !getFlag("sq_paint") && !getFlag("sq_base") && !getFlag("side_clock_completed") && !getFlag("side_butler_completed")) {
        msgs.push(unlockAchievement("ach_all_seeing", "全知之眼"));
    }

    if (
        getFlag("side_butler_completed") && getFlag("side_painting_completed") && getFlag("side_underground_completed")
        && getFlag("side_music_completed") && medalCount >= 7
    ) {
        msgs.push(unlockAchievement("ach_manor_child", "庄园之子"));
    }

    const runMs = gameState.runStartedAt ? Date.now() - gameState.runStartedAt : 0;
    if (medalCount >= 7 && runMs > 0 && runMs < 50 * 60 * 1000) {
        msgs.push(unlockAchievement("ach_lightning", "闪电破解"));
    }

    if (medalCount >= 7 && !getFlag("player_hit_trap")) {
        msgs.push(unlockAchievement("ach_cautious", "谨慎行者"));
    }

    const brutal = typeof gameState.flags.brutal_count === "number" ? gameState.flags.brutal_count : 0;
    if (brutal >= 3) msgs.push(unlockAchievement("ach_brutal", "暴力解谜者"));

    if (clueCount >= 20) msgs.push(unlockAchievement("ach_clue_hunter", "线索猎人"));

    if (
        medalCount >= 7
        && !hasItem("埃莉诺的琴弓")
        && !hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）")
        && !hasItem("伊莲娜纪念徽章")
        && !hasItem("守护者符文（可封印古老能量）")
    ) {
        msgs.push(unlockAchievement("ach_uncrowned", "无冕之王"));
    }

    if (getFlag("side_butler_completed") && (hasEnd("自由的智者") || hasEnd("谜语馆的回响") || hasEnd("七重谜语的真相"))) {
        msgs.push(unlockAchievement("ach_brother", "兄弟之约"));
    }
    if (getFlag("side_painting_completed")) msgs.push(unlockAchievement("ach_painting_meet", "画中重逢"));
    if (getFlag("side_music_completed")) msgs.push(unlockAchievement("ach_symphony_done", "未完成的完成"));
    if (getFlag("side_underground_completed")) msgs.push(unlockAchievement("ach_underground_echo", "地下的回响"));
    if (
        getFlag("side_butler_completed") && getFlag("side_painting_completed") && getFlag("side_underground_completed") && getFlag("side_music_completed")
    ) {
        msgs.push(unlockAchievement("ach_all_stories", "所有故事"));
    }
    if (hasItem("夜莺徽章（纪念品）") && hasItem("埃莉诺的琴弓")) {
        msgs.push(unlockAchievement("ach_nightingale_gift", "夜莺的馈赠"));
    }

    if (hasEnd("自由的智者")) msgs.push(unlockAchievement("ach_ending_free", "自由的智者"));
    if (hasEnd("永恒的守护者")) msgs.push(unlockAchievement("ach_ending_guardian", "永恒的守护者"));
    if (hasEnd("谜语馆的回响") || hasEnd("七重谜语的真相")) {
        const sideN = [getFlag("side_painting_completed"), getFlag("side_underground_completed"), getFlag("side_music_completed"), getFlag("side_butler_completed")].filter(Boolean).length;
        if (sideN >= 2) msgs.push(unlockAchievement("ach_eternal_echo", "永恒的回响"));
    }
    if (hasEnd("七重谜语的真相")) msgs.push(unlockAchievement("ach_true_end", "七重谜语的真相"));

    if (hasEnd("被遗忘的探索者")) msgs.push(unlockAchievement("ach_ending_forgotten", "被遗忘的探索者"));

    if (getFlag("side_painting_completed") && getFlag("side_music_completed") && hasEnd("七重谜语的真相")) {
        msgs.push(unlockAchievement("ach_egg_nightingale_wisteria", "夜莺与紫藤"));
    }
    if (hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）") && hasEnd("永恒的守护者")) {
        msgs.push(unlockAchievement("ach_egg_brother_reconcile", "兄弟和解"));
    }
    if (getFlag("side_underground_completed") && hasClue("托马斯地质学会正名")) {
        msgs.push(unlockAchievement("ach_egg_geologist", "地质学家的复仇"));
    }
    if (
        medalCount >= 7
        && hasItem("伊莲娜纪念徽章")
        && hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）")
        && hasItem("夜莺徽章（纪念品）")
        && hasItem("守护者符文（可封印古老能量）")
    ) {
        msgs.push(unlockAchievement("ach_egg_all_collector", "全徽章收集者"));
    }

    const gotAllRegular = ACHIEVEMENTS_FOR_MASTER.every((id) => globalState.achievements.includes(id));
    if (gotAllRegular) msgs.push(unlockAchievement("ach_master", "谜语大师"));

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
    hall_medal_count: 0,
    runStartedAt: null
};

// 辅助方法
function hasItem(item) { return gameState.items.includes(item); }
function removeItem(item) { 
    const idx = gameState.items.indexOf(item);
    if (idx !== -1) {
        gameState.items.splice(idx, 1);
        return true;
    }
    return false;
}
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
            hall_medal_count: 0,
            runStartedAt: null
        };
    }

    // --- 拦截逻辑：支线和动态事件探测 ---
    if (sceneId === "hall_main" && gameState.hall_medal_count >= 3 && !getFlag("flag_butler_triggered")) {
        setFlag("flag_butler_triggered", true);
        sceneId = "side_story_1_start";
    } else if (sceneId === "studio_entry" && hasItem("色彩徽章") && !getFlag("flag_side_painting_triggered")) {
        setFlag("flag_side_painting_triggered", true);
        sceneId = "side_story_2_start";
    } else if (sceneId === "basement_entry" && hasItem("深渊徽章") && !getFlag("flag_side_underground_triggered")) {
        setFlag("flag_side_underground_triggered", true);
        sceneId = "side_story_3_start";
    } else if (sceneId === "musicroom_entry" && hasItem("旋律徽章") && !getFlag("flag_side_music_triggered")) {
        setFlag("flag_side_music_triggered", true);
        sceneId = "side_story_4_start";
    }
    
    // Auto-set clock flag if Ruby Medal is obtained, to sync with endgame condition
    if (hasItem("红宝石徽章") && !getFlag("side_clock_completed")) {
        setFlag("side_clock_completed", true);
    }

    const scene = scenes[sceneId];
    if(!scene) {
        if (sceneId !== "title") {
        }
        return;
    }
    
    gameState.currentSceneId = sceneId;

    const trapScenes = new Set(["library_unlock_clasp", "side_ending_disappear", "side_ending_seeker"]);
    const brutalScenes = new Set(["library_unlock_clasp", "basement_force_furnace", "clocktower_lever_early"]);
    if (trapScenes.has(sceneId)) setFlag("player_hit_trap", true);
    if (brutalScenes.has(sceneId)) {
        const n = typeof gameState.flags.brutal_count === "number" ? gameState.flags.brutal_count : 0;
        gameState.flags.brutal_count = n + 1;
    }
    if (
        (sceneId === "opening_studio" || sceneId === "opening_studio_ng_plus" || sceneId === "opening_gate")
        && !gameState.runStartedAt
    ) {
        gameState.runStartedAt = Date.now();
    }
    
    // 执行自动存档（只有不是在标题和结局界面才存档）
    if (sceneId !== "title" && !sceneId.startsWith("ending_")) {
        localStorage.setItem("riddle_auto_save", JSON.stringify(gameState));
    }

    let locationStr = sceneId;
    if(sceneId === "title") locationStr = "主界面";
    else if(sceneId.startsWith("hall_main")) locationStr = "大厅";
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
        const res = scene.on_enter();
        if (typeof res === 'object' && res !== null && res.type === 'redirect' && res.target) {
            renderScene(res.target);
            return;
        } else if (typeof res === 'string') {
            extraMsg = res;
        }
    }

    let dynamicDesc = scene.desc;
    if (sceneId === "hall_main") {
        if (gameState.hall_medal_count >= 5) {
            dynamicDesc += "\\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]";
        } else if (gameState.hall_medal_count >= 3) {
            dynamicDesc += "\\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]";
        }
    }

    const achMsg = checkAchievements();
    if (achMsg) {
        extraMsg += (extraMsg ? "<br><br>" : "") + achMsg;
    }

    let fullDescHTML = dynamicDesc.replace(/\\n/g, "<br>") + (extraMsg ? "<br><br>" + extraMsg : "");
    
    // 清空并隐藏选项，等待打字机效果结束
    optionsContainer.innerHTML = "";
    optionsContainer.style.display = "none";

    typeWriterHTML(storyElement, fullDescHTML, 25, () => {
        optionsContainer.style.display = "flex";

        const options = Array.isArray(scene.options) ? [...scene.options] : [];
        const isEndingScene = sceneId === "game_over" || sceneId.startsWith("ending_");

        const isTrapScene = sceneId.includes("trap") || sceneId.includes("death") || sceneId.includes("explosion") || sceneId.includes("failure") || sceneId.includes("dead");

        if (isTrapScene && options.length <= 1) {
            options.length = 0; // Clear auto-generated "return to hall"
            let roomEntry = "hall_main";
            if (sceneId.startsWith("library")) roomEntry = "library_entry";
            else if (sceneId.startsWith("basement")) roomEntry = "basement_entry";
            else if (sceneId.startsWith("greenhouse")) roomEntry = "greenhouse_entry";
            else if (sceneId.startsWith("musicroom")) roomEntry = "musicroom_entry";
            else if (sceneId.startsWith("studio")) roomEntry = "studio_entry";
            else if (sceneId.startsWith("clocktower")) roomEntry = "clocktower_entry";
            else if (sceneId.startsWith("bedroom")) roomEntry = "bedroom_entry";
            
            options.push({ text: "重新挑战 (回到当前房间入口)", target: roomEntry });
            options.push({ text: "返回大厅休息", target: "hall_main" });
            options.push({ text: "读取上一存档", target: "system_load_auto" });
        } else if (isEndingScene) {
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
                    : ((opt.target === "hall_main" || opt.target === "hall_main") ? "返回大厅" : "继续探索"));
            
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
                    let normalizedTarget = nextTarget === "hall_main" ? "hall_main" : nextTarget;

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
