var gameSettings = {
    fontSize: 16,
    typeSpeed: 25,
    noAnim: false
};


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


function showAchievementToast(msg) {
    const toast = document.getElementById("achievement-toast");
    if (!toast) return;
    const ttext = document.getElementById("toast-text");
    if(ttext) ttext.innerHTML = msg;
    toast.style.display = "block";
    toast.style.animation = "slideInX 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
    setTimeout(() => {
        toast.style.animation = "slideOutX 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards";
    }, 4000);
}

function checkAchievements() {
    const msgs = [];
    const medalCount = gameState.hall_medal_count || gameState.medals.length;
    const clueCount = gameState.clues.length;
    const ends = globalState.endingsReached || [];
    const hasEnd = (name) => ends.includes(name);

    if (medalCount >= 1) msgs.push(unlockAchievement("ach_first_medal", "初入谜域"));
    if (medalCount >= 4) msgs.push(unlockAchievement("ach_half_medals", "半程智者"));
    if (medalCount >= 7) msgs.push(unlockAchievement("ach_all_medals", "七曜归位"));

    if (medalCount >= 7 && !getFlag("side_painting_triggered") && !getFlag("side_underground_triggered") && !getFlag("side_clock_completed") && !getFlag("side_butler_completed")) {
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
    if (typeof gameSettings !== "undefined" && gameSettings.noAnim) {
        clearInterval(typeWriterInterval);
        element.innerHTML = htmlString;
        isTyping = false;
        element.onclick = null;
        if (onComplete) onComplete();
        return;
    }
    speed = typeof gameSettings !== "undefined" ? gameSettings.typeSpeed : speed;

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
        document.getElementById("game-container").scrollTop = document.getElementById("game-container").scrollHeight;
    }, speed);
}

// ========== 图片资源与游戏程序整合开始 ==========
// 背景图片映射系统
const backgroundMap = {
    "hall_main": "images/backgrounds/hall_main.jpg",
    "library_entry": "images/backgrounds/library_entry.jpg",
    "musicroom_entry": "images/backgrounds/musicroom_entry.jpg",
    "greenhouse_entry": "images/backgrounds/greenhouse_entry.jpg",
    "studio_entry": "images/backgrounds/studio_entry.jpg",
    "basement_entry": "images/backgrounds/basement_entry.jpg",
    "clocktower_entry": "images/backgrounds/clocktower_entry.jpg",
    "bedroom_entry": "images/backgrounds/bedroom_entry.jpg",
    "final_chamber_entry": "images/backgrounds/final_chamber.jpg",
    "side_cellar": "images/backgrounds/side_cellar.jpg",
    "side_ancient_chamber": "images/backgrounds/ancient_chamber.jpg",
    "ending_1": "images/endings/ending_1.jpg",
    "ending_2": "images/endings/ending_2.jpg",
    "ending_3": "images/endings/ending_3.jpg",
    "ending_4": "images/endings/ending_4.jpg"
};

function setBackground(sceneId) {
    const bgDiv = document.getElementById("scene-background");
    if (!bgDiv) return;
    let bgUrl = backgroundMap[sceneId];
    if (bgUrl) {
        bgDiv.style.backgroundImage = `url(${bgUrl})`;
        bgDiv.style.opacity = "0.4"; // 可调透明度
    } else {
        bgDiv.style.backgroundImage = "none";
    }
}

function showItemPopup(itemName) {
    if (window.itemPopupTimeout) {
        clearTimeout(window.itemPopupTimeout);
        window.itemPopupTimeout = null;
    }
    let modal = document.getElementById("item-popup-custom");
    if (!modal) {
        const div = document.createElement("div");
        div.id = "item-popup-custom";
        div.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.9); border:2px solid gold; border-radius:16px; padding:20px; z-index:10001; text-align:center; display:none;";
        div.innerHTML = `<img id="popup-img-custom" style="max-width:80vw; max-height:70vh; border-radius:8px;"><div id="popup-text-custom" style="margin-top:10px; color:gold; font-size:1.5em;"></div>`;
        document.body.appendChild(div);
        modal = div;
    }
    const img = document.getElementById("popup-img-custom");
    const textDiv = document.getElementById("popup-text-custom");
    
    img.src = `images/item_popup/${encodeURIComponent(itemName)}.jpg`;
    img.onerror = () => { img.style.display = "none"; };
    img.onload = () => { img.style.display = "block"; };
    textDiv.innerText = `获得：${itemName}`;
    modal.style.display = "block";
    
    window.itemPopupTimeout = setTimeout(() => {
        modal.style.display = "none";
        window.itemPopupTimeout = null;
    }, 2500);
}
// ========== 图片资源与游戏程序整合结束 ==========

function renderScene(sceneId) {
    setBackground(sceneId);
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
    if (sceneId === "hall_main" && gameState.hall_medal_count >= 3 && !getFlag("side_butler_triggered")) {
        setFlag("side_butler_triggered", true);
        sceneId = "sys_side_story_1_trigger";
    } else if (sceneId === "studio_entry" && hasItem("色彩徽章") && !getFlag("side_painting_triggered")) {
        setFlag("side_painting_triggered", true);
        sceneId = "sys_side_story_2_trigger";
    } else if (sceneId === "basement_entry" && hasItem("深渊徽章") && !getFlag("side_underground_triggered")) {
        setFlag("side_underground_triggered", true);
        sceneId = "sys_side_story_3_trigger";
    } else if (sceneId === "musicroom_entry" && hasItem("旋律徽章") && !getFlag("side_music_triggered")) {
        setFlag("side_music_triggered", true);
        sceneId = "sys_side_story_4_trigger";
    }
    
    // Auto-set clock flag if Ruby Medal is obtained, to sync with endgame condition
    if (hasItem("红宝石徽章") && !getFlag("side_clock_completed")) {
        setFlag("side_clock_completed", true);
    }

    if (sceneId.startsWith("side_ending_")) {
        const p1 = ["side_ending_master", "side_ending_spreader", "side_ending_memento"];
        const p2 = ["side_ending_reconciliation", "side_ending_legacy"];
        const p3 = ["side_ending_seeker", "side_ending_guardian", "side_ending_truth", "side_ending_disappear"];
        const p4 = ["side_ending_music_public", "side_ending_music_keep"];
        if (p1.includes(sceneId)) setFlag("side_butler_completed", true);
        if (p2.includes(sceneId)) setFlag("side_painting_completed", true);
        if (p3.includes(sceneId)) setFlag("side_underground_completed", true);
        if (p4.includes(sceneId)) setFlag("side_music_completed", true);
    }

    const scene = scenes[sceneId] || window.scenes[sceneId];
    if(!scene) {
        if (sceneId !== "title" && sceneId !== "system_load_auto") {
            console.warn("Target scene missing:", sceneId);
            window.scenes[sceneId] = {
                desc: "【系统提示】该区域（" + sceneId + "）尚未实装，前路被浓雾封锁，你被迫退回大厅。",
                options: [{ text: "返回大厅", target: "hall_main" }]
            };
            setTimeout(() => renderScene(sceneId), 0);
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
        showToast("自动存档成功 💾");
        showToast("自动存档成功 💾");
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
    }
    
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
        
        const rFmt = (name, item) => {
            if (gameState.items.some(i => i.includes(item))) {
                return `<span style="color:#d4af37;text-shadow:0 0 5px #d4af37;font-weight:bold;">${name}(★已探索)</span>`;
            }
            return `<span style="color:#777;">${name}(未探索)</span>`;
        };

        dynamicDesc += `
<div style="background:rgba(0,0,0,0.5); border:1px solid #444; padding:10px; border-radius:5px; margin-top:20px; font-family:monospace; line-height:1.6;">
    <div style="color:#aaa; border-bottom:1px solid #444; padding-bottom:5px; margin-bottom:5px; font-weight:bold;">🗺️ 庄园状态简图</div>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二楼：${rFmt("画室", "色彩徽章")} | ${rFmt("最深处的卧室", "彩虹徽章")}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一楼：${rFmt("音乐室", "旋律徽章")} | ${rFmt("大厅", "起始徽章")} | ${rFmt("温室花房", "生命徽章")} | ${rFmt("书房/图书馆", "智慧徽章")}<br>
    &nbsp;&nbsp;东侧附属：${rFmt("钟楼", "时空徽章")}<br>
    &nbsp;&nbsp;&nbsp;地下：${rFmt("地下室", "深渊徽章")}
</div>`;
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
        } else if (isEndingScene && sceneId !== "game_over") {
            // 所有结局统一跳转到 game_over 进行结算
            options.push({ text: "查看成就与轮回信息", target: "game_over" });
        } else if (sceneId === "game_over") {
            options.push({ text: "返回主界面", target: "title" });
            options.push({ text: "带着记忆苏醒 (开启多周目)", target: "opening_studio_ng_plus", condition: () => globalState.endingsReached.length > 0 });
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
        var visitedKey = sceneId + "->" + opt.target;
        if (!globalState.visitedOptions) globalState.visitedOptions = {};
        if (globalState.visitedOptions[visitedKey]) {
            suffix += " <span style='color:#777;'>(已勘查)</span>";
        }

        if (roomMedalMap[opt.target]) {
            const req = roomMedalMap[opt.target];
            if (gameState.items.some(i => i.includes(req))) {
                suffix = ' <span style="color:#d4af37; font-weight:bold; font-size:1.1em;">(✓ 已解开)</span>';
            }
        }


            
            let btn = document.createElement("button");
            btn.className = "option-btn";
            
            if (isAvailable) {
                btn.innerHTML = "➤ " + optionText + suffix;
                btn.onclick = () => {
                    if (!globalState.visitedOptions) globalState.visitedOptions = {};
                    globalState.visitedOptions[visitedKey] = true;
                    if(opt.effectMsg) {
                        let hint = document.createElement("div");
                        hint.className = "system-message";
                        hint.innerText = opt.effectMsg;
                        storyElement.appendChild(hint);
                        document.getElementById("game-container").scrollTop = document.getElementById("game-container").scrollHeight;
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
                            document.getElementById("game-container").scrollTop = document.getElementById("game-container").scrollHeight;
                            renderScene(fallbackTarget);
                        }
                    } else if (!opt.effectMsg) {
                        let hint = document.createElement("div");
                        hint.className = "system-message";
                        hint.innerText = "这里暂时没有新的变化。";
                        storyElement.appendChild(hint);
                        document.getElementById("game-container").scrollTop = document.getElementById("game-container").scrollHeight;
                    }
                };
            } else {
                btn.innerHTML = "➤ <del>" + optionText + "</del> <span style='font-size:0.85em;color:#777;margin-left:8px;'>(线索或道具不足，无法解锁)</span>";
                btn.classList.add("disabled");
                btn.disabled = true;
            }
            optionsContainer.appendChild(btn);
        });
        document.getElementById("game-container").scrollTop = document.getElementById("game-container").scrollHeight;
    });
}


const ITEM_DESCRIPTIONS = {
    "蓝宝石徽章": "第一枚徽章，湛蓝色，表面有细密的星图纹路。",
    "红宝石徽章": "第二枚徽章，深红色，仿佛有一滴凝固的血。",
    "翠绿徽章": "第三枚徽章，翠绿色，触摸时能感到微微的振动。",
    "橙色徽章": "第四枚徽章，橙色，像秋日的落叶。",
    "金色徽章": "第五枚徽章，金色，散发着淡淡的草木香。",
    "紫色徽章": "第六枚徽章，紫色，表面刻着复杂的符文。",
    "彩虹徽章": "第七枚徽章，七色流转，是所有徽章中唯一会发光的。",
    "色彩徽章": "第四枚徽章，彩色。",
    "旋律徽章": "音乐室的徽章。",
    "深渊徽章": "地下室的徽章。",
    "克劳利的日记": "皮质封面，记录着庄园的部分秘密。",
    "机械齿轮": "铜质齿轮，边缘有编号，可用于其他机关。",
    "共鸣水晶": "透明水晶，敲击时会发出纯净的乐音。",
    "神秘颜料": "七色颜料混合而成，可以唤醒枯萎的植物。",
    "生命之露": "一小瓶清澈的液体，散发着草木的清香。",
    "符文石": "黑色石头上刻着古老的符文，微微发热。",
    "星盘钥匙": "铜质圆盘，可嵌入书桌凹槽。",
    "阿斯特的怀表": "停止的怀表，指针指向11:55。",
    "伊莲娜的纪念徽章": "心形彩虹色徽章，背面刻着“永存于画中”。",
    "夜莺胸针": "银质胸针，夜莺的眼睛是红宝石。",
    "埃莉诺的琴弓": "乌木琴弓，弓尾库镶着珍珠母贝。",
    "托马斯的笔记本": "地质学家的考察笔记。",
    "守护者符文": "手背上的银色符文，获得后可封印古老力量。"
};


window.showItemDetails = function(name, desc) {
    const modal = document.getElementById("item-modal");
    if (!modal) return;
    document.getElementById("item-modal-title").innerText = name;
    document.getElementById("item-modal-desc").innerText = desc || "这是一个神秘的物品，目前还没有更多的描述。";
    modal.style.display = "block";
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
};

window.closeItemDetails = function() {
    const modal = document.getElementById("item-modal");
    if (!modal) return;
    modal.style.opacity = "0";
    modal.style.transform = "translate(-50%, -50%) scale(0.95)";
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
};

function updateInventoryDisplay() {
    const invItems = document.getElementById("inv-items");
    const invClues = document.getElementById("inv-clues");
    const medalCountSpan = document.getElementById("medal-count");
    const invMedals = document.getElementById("inv-medals");

    let itemsHtml = "";
    let cluesHtml = "";
    let medalsCount = 0;
    let medalsHtml = "";

    // 过滤重复物品
    let uniqueItems = [...new Set(gameState.items)];

    for (let i = 0; i < uniqueItems.length; i++) {
        let item = uniqueItems[i];
        let rawItem = item.replace("[道具]", "").replace("【徽章】", "").trim();
        let desc = ITEM_DESCRIPTIONS[rawItem] || "";
        let titleAttr = desc ? ` onclick="showItemDetails('${rawItem}', '${desc}')" style="cursor:pointer; border-bottom: 1px dashed var(--accent-color);"` : "";
        
        let iconPath = `images/items/${encodeURIComponent(rawItem)}.png`;
        let imgTag = `<img src="${iconPath}" class="inv-icon" onerror="this.style.display='none'" style="width:24px;height:24px;vertical-align:middle;margin-right:4px;">`;
        let innerHTML = imgTag + rawItem;
        
        if (item.startsWith("[道具]")) {
            itemsHtml += "<span class='inv-item'" + titleAttr + ">" + innerHTML + "</span> ";
        } else if (item.startsWith("【徽章】") || rawItem.endsWith("徽章")) {
            medalsCount++;
            medalsHtml += "<span class='inv-item medal'" + titleAttr + ">" + innerHTML + "</span> ";
        } else {
            itemsHtml += "<span class='inv-item'" + titleAttr + ">" + innerHTML + "</span> ";
        }
    }for (let i = 0; i < gameState.clues.length; i++) {
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


window.showToast = function(msg) {
    let t = document.createElement("div");
    t.innerHTML = msg;
    t.style = "position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.8);color:#fff;padding:8px 15px;border-radius:5px;font-size:14px;z-index:9999;transition:opacity 0.5s;pointer-events:none;";
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 500); }, 1500);
};

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
if (typeof loadSettings === "function") {
    loadSettings();
}
renderScene("title");


// =============== 设置系统 (Settings) ===============

function loadSettings() {
    const saved = localStorage.getItem("riddle_settings");
    if (saved) {
        try {
            gameSettings = Object.assign(gameSettings, JSON.parse(saved));
        } catch(e) {}
    }
    // Init UI
    const elFs = document.getElementById("setting-fontsize");
    const elTs = document.getElementById("setting-typespeed");
    const elNa = document.getElementById("setting-noanim");
    if (elFs) elFs.value = gameSettings.fontSize;
    if (elTs) elTs.value = gameSettings.typeSpeed;
    if (elNa) elNa.checked = gameSettings.noAnim;
    applySettings(false);
}

function applySettings(save = true) {
    const elFs = document.getElementById("setting-fontsize");
    const elTs = document.getElementById("setting-typespeed");
    const elNa = document.getElementById("setting-noanim");
    
    if (elFs) {
        gameSettings.fontSize = parseInt(elFs.value);
        document.getElementById("fontsize-val").innerText = elFs.value + "px";
        document.body.style.fontSize = elFs.value + "px";
        const storyEl = document.getElementById("story-text");
        if (storyEl) storyEl.style.fontSize = (gameSettings.fontSize + 2) + "px";
    }
    if (elTs) {
        gameSettings.typeSpeed = parseInt(elTs.value);
        document.getElementById("typespeed-val").innerText = elTs.value + "ms";
    }
    if (elNa) {
        gameSettings.noAnim = elNa.checked;
    }
    if (save) {
        localStorage.setItem("riddle_settings", JSON.stringify(gameSettings));
    }
}

function toggleSettings() {
    const panel = document.getElementById("settings-panel");
    if(!panel) return;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        // hide others
        const inv = document.getElementById("inventory-panel");
        const ach = document.getElementById("achievement-panel");
        if (inv) inv.style.display = "none";
        if (ach) ach.style.display = "none";
        
        loadSettings();
        panel.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", loadSettings);



var gameHints = {
    "hall_main": [
        "观察大厅里哪些房间门可以进入。",
        "尝试进入不同的房间，寻找徽章。"
    ],
    "library_entry": [
        "你需要找到一种方法打开密室的门，或者在书架上寻找线索。",
        "注意书籍上的颜色、符号或特殊的排列。"
    ],
    "musicroom_entry": [
        "这里的乐器似乎都藏着秘密，试着弹奏或寻找琴谱。",
        "是否有物品可以放入管风琴或者用来修复某个乐器？"
    ],
    "greenhouse_entry": [
        "植物的生长需要特定的条件。",
        "水、土壤和可能需要的特殊生命液体。"
    ],
    "studio_entry": [
        "颜色似乎是这个房间的关键。",
        "检查画布和周围掉落的物品，可能有线索组合颜料。"
    ],
    "basement_entry": [
        "留意那些刻有符文的石板或祭坛。",
        "也许需要用到不同元素的组合以及从其他房间获得的特殊道具。"
    ],
    "clocktower_entry": [
        "时间是这里的核心，找找看有没有办法改变时钟的时间。",
        "怀表上的时间可能会给你指引。"
    ],
    "bedroom_entry": [
        "床铺或镜子周围可能有隐藏的空间。",
        "仔细检查一切可以反射光线的东西。"
    ],
    "final_room_entry": [
        "这里是最后的考验。",
        "回忆你之前在其他房间找到的关键线索和道具用法。"
    ],
    "default": [
        "仔细阅读周围的描述，不要漏掉任何细节。",
        "检查你的物品栏，看看身上有什么可以用的道具或线索。"
    ]
};
window.showHint = function() {
    displayHintMessage();
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

