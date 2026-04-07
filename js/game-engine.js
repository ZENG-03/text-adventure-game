import { loadState, saveState } from "./state-store.js";

var gameSettings = {
    fontSize: 16,
    typeSpeed: 25,
    noAnim: false
};

let rootState = loadState();
// 全局与多周目状态管理
window.profile = rootState.profile;
// 单局游戏状态管理
window.run = rootState.run;

// 为了反向兼容，确保本地变量也指向它们
let profile = window.profile;
let run = window.run;

export const StateAPI = {
    hasItem: (name) => run.items.includes(name),
    addItem: (name) => {
        if (!run.items.includes(name)) run.items.push(name);
    },
    removeItem: (name) => {
        const idx = run.items.indexOf(name);
        if (idx !== -1) run.items.splice(idx, 1);
    },
    hasClue: (name) => run.clues.includes(name),
    addClue: (name) => {
        if (!run.clues.includes(name)) run.clues.push(name);
    },
    getFlag: (key) => !!run.flags[key],
    setFlag: (key, val = true) => run.flags[key] = val
};

function unlockAchievement(id, name) {
    if (!profile.achievements.includes(id)) {
        profile.achievements.push(id);
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
    const medalCount = run.hall_medal_count || run.medals.length;
    const clueCount = run.clues.length;
    const ends = profile.endings_reached || [];
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

    const runMs = run.run_started_at ? Date.now() - run.run_started_at : 0;
    if (medalCount >= 7 && runMs > 0 && runMs < 50 * 60 * 1000) {
        msgs.push(unlockAchievement("ach_lightning", "闪电破解"));
    }

    if (medalCount >= 7 && !getFlag("player_hit_trap")) {
        msgs.push(unlockAchievement("ach_cautious", "谨慎行者"));
    }

    const brutal = typeof run.flags.brutal_count === "number" ? run.flags.brutal_count : 0;
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

    const gotAllRegular = ACHIEVEMENTS_FOR_MASTER.every((id) => profile.achievements.includes(id));
    if (gotAllRegular) msgs.push(unlockAchievement("ach_master", "谜语大师"));

    if (msgs.some(Boolean)) saveState(rootState);
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

// 辅助方法
function autoSave() {
    saveState(rootState);
}
function hasItem(item) { return run.items.includes(item); }
function removeItem(item) { 
    const idx = run.items.indexOf(item);
    if (idx !== -1) {
        run.items.splice(idx, 1);
        return true;
    }
    return false;
}
function hasClue(clue) { return run.clues.includes(clue); }
function getFlag(key) { return run.flags[key] || false; }
function setFlag(key, val) { run.flags[key] = val; }
function addMedal() { run.hall_medal_count += 1; }

function addClue(clue) {
function incrementFlag(key, val=1) { setFlag(key, (getFlag(key) || 0) + val); }
    if(!hasClue(clue)) {
        run.clues.push(clue);
        return `<div class="system-message">【获得线索】：${clue}</div>`;
    }
    return "";
}

function addItem(item) {
    if(!hasItem(item)) {
        run.items.push(item);
        if (typeof showItemPopup === "function") showItemPopup(item);
        if (item.includes("徽章")) {
            run.medals.push(item);
            addMedal();
        }
        return `<div class="system-message">【获得物品】：${item}</div>`;
    }
    return "";
}

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
    return sceneObj.desc.includes("尚在整理中")
        || sceneObj.desc.includes("剧情节点")
        || sceneObj.desc.includes("细节尚未实装")
        || sceneObj.desc.includes("该区域（");
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

function resolveItemSubmissionTarget(selection, itemName, sceneId) {
    if (!selection) return sceneId;

    if (typeof selection.validator === "function") {
        try {
            const validatedTarget = selection.validator(itemName, run, sceneId);
            if (typeof validatedTarget === "string" && validatedTarget.trim()) {
                return validatedTarget.trim();
            }
        } catch (e) {}
    }

    if (selection.itemMap && selection.itemMap[itemName]) {
        return selection.itemMap[itemName];
    }

    if (Array.isArray(selection.correctItems) && selection.correctItems.includes(itemName)) {
        return selection.correctTarget || sceneId;
    }

    if (Array.isArray(selection.fatalItems) && selection.fatalItems.includes(itemName)) {
        return selection.fatalTarget || selection.wrongTarget || sceneId;
    }

    if (Array.isArray(selection.fatalKeywords) && selection.fatalKeywords.some((kw) => kw && itemName.includes(kw))) {
        return selection.fatalTarget || selection.wrongTarget || sceneId;
    }

    return selection.wrongTarget || sceneId;
}

function getItemSubmissionProgressKey(sceneId, selection) {
    return (selection && selection.progressFlag) || (sceneId + "_submitted_items");
}

function getItemSubmissionProgress(sceneId, selection) {
    const key = getItemSubmissionProgressKey(sceneId, selection);
    const raw = run.flags[key];
    if (!Array.isArray(raw)) return [];
    return raw.filter((item) => typeof item === "string" && item);
}

function setItemSubmissionProgress(sceneId, selection, items) {
    const key = getItemSubmissionProgressKey(sceneId, selection);
    run.flags[key] = [...new Set(items.filter((item) => typeof item === "string" && item))];
}

function renderItemSubmissionScene(sceneId, selection) {
    const container = optionsContainer;
    if (!container) return;

    const uniqueItems = [...new Set((run.items || []).filter(Boolean))];
    const requiredCount = Math.max(1, Number(selection.requiredCount || 1));
    const submittedItems = getItemSubmissionProgress(sceneId, selection);
    const submittedSet = new Set(submittedItems);
    const promptBase = selection.prompt || "从背包中选择一件物品提交。";
    const prompt = requiredCount > 1
        ? `${promptBase}（已放入 ${submittedItems.length}/${requiredCount} 件）`
        : promptBase;
    const completedFlag = selection.completedFlag || (sceneId + "_completed");

    if (getFlag(completedFlag) && selection.completedTarget) {
        renderScene(selection.completedTarget);
        return;
    }

    const promptBox = document.createElement("div");
    promptBox.className = "system-message";
    promptBox.innerText = prompt;
    storyElement.appendChild(promptBox);

    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.scrollTop = gameContainer.scrollHeight;
    }

    container.innerHTML = "";

    if (uniqueItems.length === 0) {
        const emptyBox = document.createElement("div");
        emptyBox.className = "danger-message";
        emptyBox.innerText = "你没有任何可提交的物品。";
        storyElement.appendChild(emptyBox);
    }

    const backBtn = document.createElement("button");
    backBtn.className = "option-btn";
    backBtn.innerText = "返回";
    backBtn.onclick = () => renderScene(selection.backTarget || sceneId);
    container.appendChild(backBtn);

    uniqueItems.forEach((itemName) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = "➤ 提交【" + itemName + "】";
        btn.onclick = () => {
            const target = resolveItemSubmissionTarget(selection, itemName, sceneId);
            const isCorrect = target === (selection.correctTarget || target);
            const isFatal = selection.fatalTarget && target === selection.fatalTarget;

            if (isCorrect) {
                const nextProgress = submittedSet.has(itemName) ? submittedItems.slice() : submittedItems.concat(itemName);
                setItemSubmissionProgress(sceneId, selection, nextProgress);
                if (selection.consumeOnCorrect !== false) {
                    removeItem(itemName);
                }
                const progressCount = nextProgress.length;
                if (requiredCount > 1 && progressCount < requiredCount) {
                    const progressBox = document.createElement("div");
                    progressBox.className = "system-message";
                    progressBox.innerText = `【${itemName}】已嵌入凹槽，当前进度 ${progressCount}/${requiredCount}。`;
                    storyElement.appendChild(progressBox);
                    const gameContainer = document.getElementById("game-container");
                    if (gameContainer) {
                        gameContainer.scrollTop = gameContainer.scrollHeight;
                    }
                    renderScene(selection.correctTarget || sceneId);
                    return;
                }
                setFlag(completedFlag, true);
                renderScene(selection.completedTarget || target || selection.correctTarget || sceneId);
                return;
            }

            if (isFatal) {
                if (selection.consumeOnFatal !== false) {
                    removeItem(itemName);
                }
                renderScene(target);
                return;
            }

            if (selection.consumeOnWrong) {
                removeItem(itemName);
            }

            const hint = document.createElement("div");
            hint.className = "danger-message";
            hint.innerText = `【${itemName}】似乎不能放在这里。`;
            storyElement.appendChild(hint);
            if (gameContainer) {
                gameContainer.scrollTop = gameContainer.scrollHeight;
            }

            renderScene(target || selection.wrongTarget || sceneId);
        };
        container.appendChild(btn);
    });

    if (uniqueItems.length === 0) {
        return;
    }

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "option-btn";
    cancelBtn.innerText = "放弃提交，返回";
    cancelBtn.onclick = () => renderScene(selection.backTarget || sceneId);
    container.appendChild(cancelBtn);
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
    
    const finishTypingNow = () => {
        if (!isTyping) return;
        clearInterval(typeWriterInterval);
        element.innerHTML = htmlString;
        isTyping = false;
        element.onclick = null;
        if (containerEl && containerSkipHandler) {
            containerEl.removeEventListener("click", containerSkipHandler);
        }
        if (onComplete) onComplete();
    };

    const containerEl = document.getElementById("game-container");
    const containerSkipHandler = () => finishTypingNow();

    // 点击剧情区或容器空白区域都可跳过打字
    element.onclick = () => finishTypingNow();
    if (containerEl) {
        containerEl.addEventListener("click", containerSkipHandler);
    }

    typeWriterInterval = setInterval(() => {
        if (i >= htmlString.length) {
            clearInterval(typeWriterInterval);
            isTyping = false;
            element.onclick = null;
            if (containerEl && containerSkipHandler) {
                containerEl.removeEventListener("click", containerSkipHandler);
            }
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

window.showItemPopup = function(itemName) {
    const desc = ITEM_DESCRIPTIONS[itemName] || "未详细描述的物品";
    window.showItemDetails(itemName, desc);
};
// ========== 图片资源与游戏程序整合结束 ==========

function renderScene(sceneId) {
    if (run && run.current_scene_id && sceneId) {
        // Track from current scene to next scene globally
        if (!profile.visited_options || typeof profile.visited_options !== "object") {
            profile.visited_options = {};
        }
        profile.visited_options[run.current_scene_id + "->" + sceneId] = true;
    }
    setBackground(sceneId);
    if (sceneId === "system_load_auto") {
        window.loadGame();
        return;
    }

    if(sceneId === "title" && run.current_scene_id !== "title") {
        // 重置游戏
        run = {
            medals: [],
            items: [],
            clues: [],
            flags: {},
            current_scene_id: "title",
            hall_medal_count: 0,
            run_started_at: null
        };
    }

    // --- 拦截逻辑：支线和动态事件探测 ---
    if (sceneId === "hall_main" && run.hall_medal_count >= 3 && !getFlag("side_butler_triggered")) {
        setFlag("side_butler_triggered", true);
        sceneId = "sys_side_story_1_trigger";
    } else if (sceneId === "studio_entry" && (hasItem("色彩徽章") || hasItem("橙色徽章")) && !getFlag("side_painting_triggered")) {
        setFlag("side_painting_triggered", true);
        sceneId = "sys_side_story_2_trigger";
    } else if (sceneId === "basement_entry" && hasItem("深渊徽章") && !getFlag("side_underground_triggered")) {
        setFlag("side_underground_triggered", true);
        sceneId = "sys_side_story_3_trigger";
    } else if (sceneId === "musicroom_entry" && hasItem("旋律徽章") && !getFlag("side_music_triggered")) {
        setFlag("side_music_triggered", true);
        sceneId = "sys_side_story_4_trigger";
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
                desc: `厚重的铁门紧闭，上面布满奇异符号。
你尝试推开，但纹丝不动。
某种力量阻止了你继续深入……`,
                options: [{ text: "暂时离开", target: "hall_main" }]
            };
            setTimeout(() => renderScene(sceneId), 0);
        }
        return;
    }

    if (isPlaceholderScene(scene)) {
        const fallbackTarget = scenes["hall_main"] ? "hall_main" : "title";
        const fallbackText = fallbackTarget === "hall_main" ? "返回大厅" : "返回主界面";
        window.scenes[sceneId] = {
            desc: "【系统提示】该场景仍是占位内容，已临时收束为安全出口。",
            options: [{ text: fallbackText, target: fallbackTarget }]
        };
    }
    
    const trapScenes = new Set(["library_unlock_clasp", "side_ending_disappear", "side_ending_seeker"]);
    const brutalScenes = new Set(["library_unlock_clasp", "basement_force_furnace", "clocktower_lever_early"]);
    if (trapScenes.has(sceneId)) setFlag("player_hit_trap", true);
    if (brutalScenes.has(sceneId)) {
        const n = typeof run.flags.brutal_count === "number" ? run.flags.brutal_count : 0;
        run.flags.brutal_count = n + 1;
    }
    if (
        (sceneId === "opening_studio" || sceneId === "opening_studio_ng_plus" || sceneId === "opening_gate")
        && !run.run_started_at
    ) {
        run.run_started_at = Date.now();
    }
    
    // 执行自动存档（死亡/陷阱/失败场景不存，避免坏档覆盖）
    const lowerSceneId = String(sceneId || "").toLowerCase();
    const shouldSkipAutoSave =
        lowerSceneId === "title" ||
        lowerSceneId.startsWith("ending_") ||
        /(trap|death|dead|poison|explosion|fail|game_over|bad_end|fall)/.test(lowerSceneId);
    
    run.current_scene_id = sceneId;
    if (!shouldSkipAutoSave) {
        autoSave();
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
        let prevMedalCount = run.last_hall_medal_count || 0;
        if (run.hall_medal_count > prevMedalCount) {
            let transitionId = "sys_room_exit_transition";
            window.scenes[transitionId] = {
                desc: "你将刚刚获得的徽章小心翼翼地收好，长舒了一口气。\\n伴随着沉重的锁舌闭合声，这扇门在你身后缓缓关上，你再次回到了冰冷的大厅，但你的心境已经不再相同。",
                options: [{ text: "继续探索大厅", target: "hall_main" }]
            };
            run.last_hall_medal_count = run.hall_medal_count;
            renderScene(transitionId);
            return;
        }
        run.last_hall_medal_count = run.hall_medal_count;
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

    let dynamicDesc = typeof scene.desc === "function" ? scene.desc() : scene.desc;
    if (scene.itemSelection) {
        const completedFlag = scene.itemSelection.completedFlag || (sceneId + "_completed");
        if (getFlag(completedFlag) && scene.itemSelection.completedTarget) {
            renderScene(scene.itemSelection.completedTarget);
            return;
        }
    }
    if (sceneId === "hall_main") {
        if (run.hall_medal_count >= 5) {
            dynamicDesc += "\\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]";
        } else if (run.hall_medal_count >= 3) {
            dynamicDesc += "\\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]";
        }
        
        const rFmt = (name, possibleItems) => {
            const itemsList = Array.isArray(possibleItems) ? possibleItems : [possibleItems];
            if (run.items.some(i => itemsList.some(pat => i.includes(pat)))) {
                return `<span style="color:#d4af37;text-shadow:0 0 5px #d4af37;font-weight:bold;">${name}(★已探索)</span>`;
            }
            return `<span style="color:#777;">${name}(未探索)</span>`;
        };

        dynamicDesc += `
<div style="background:rgba(0,0,0,0.5); border:1px solid #444; padding:10px; border-radius:5px; margin-top:20px; font-family:monospace; line-height:1.6;">
    <div style="color:#aaa; border-bottom:1px solid #444; padding-bottom:5px; margin-bottom:5px; font-weight:bold;">🗺️ 庄园状态简图</div>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二楼：${rFmt("画室", ["色彩徽章", "橙色徽章"])} | ${rFmt("最深处的卧室", "彩虹徽章")}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一楼：${rFmt("音乐室", ["旋律徽章", "翠绿徽章"])} | ${rFmt("大厅", "起始徽章")} | ${rFmt("温室花房", ["生命徽章", "金色徽章"])} | ${rFmt("书房/图书馆", ["智慧徽章", "蓝宝石徽章"])}<br>
    &nbsp;&nbsp;东侧附属：${rFmt("钟楼", ["时空徽章", "红宝石徽章"])}<br>
    &nbsp;&nbsp;&nbsp;地下：${rFmt("地下室", ["深渊徽章", "紫色徽章"])}
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

        if (scene.itemSelection) {
            renderItemSubmissionScene(sceneId, scene.itemSelection);
            return;
        }

        if (scene.input) {
            let inputContainer = document.createElement("div");
            inputContainer.className = "puzzle-input-container";
            inputContainer.style.margin = "20px 0";
            inputContainer.style.padding = "15px";
            inputContainer.style.background = "rgba(0,0,0,0.4)";
            inputContainer.style.border = "1px solid #555";
            inputContainer.style.borderRadius = "5px";
            inputContainer.style.textAlign = "center";

            let inputField = document.createElement("input");
            inputField.id = "puzzle-input";
            inputField.type = "text";
            inputField.placeholder = scene.input.placeholder || "输入答案...";
            inputField.className = "puzzle-input";
            inputField.style.padding = "10px";
            inputField.style.width = "70%";
            inputField.style.maxWidth = "300px";
            inputField.style.fontSize = "16px";
            inputField.style.border = "1px solid #777";
            inputField.style.background = "#222";
            inputField.style.color = "#eee";
            inputField.style.borderRadius = "4px";

            let submitBtn = document.createElement("button");
            submitBtn.innerText = "确认";
            submitBtn.className = "action-btn puzzle-submit";
            submitBtn.style.padding = "10px 20px";
            submitBtn.style.marginLeft = "10px";
            submitBtn.style.cursor = "pointer";
            submitBtn.style.background = "#444";
            submitBtn.style.color = "#fff";
            submitBtn.style.border = "1px solid #666";
            submitBtn.style.borderRadius = "4px";

            let feedbackDiv = document.createElement("div");
            feedbackDiv.className = "puzzle-feedback";
            feedbackDiv.style.color = "#d9534f";
            feedbackDiv.style.marginTop = "15px";
            feedbackDiv.style.minHeight = "24px";

            submitBtn.onclick = () => {
                let val = inputField.value.trim();
                if (!val) return;
                
                if (scene.input.validate(val)) {
                    feedbackDiv.style.color = "#5cb85c";
                    feedbackDiv.innerText = "通过！";
                    if (scene.input.onSuccess) {
                        scene.input.onSuccess();
                    }
                    if (scene.input.success) {
                        setTimeout(() => renderScene(scene.input.success), 500);
                    }
                } else {
                    window.run.puzzleFails = window.run.puzzleFails || {};
                    window.run.puzzleFails[sceneId] = (window.run.puzzleFails[sceneId] || 0) + 1;
                    
                    let failMsg = scene.input.failMsg || "不对...似乎还有什么没考虑到。";
                    let hints = window.run.hint_levels || {};
                    let hintLvl = hints[sceneId] || 0;
                    
                    if (window.run.puzzleFails[sceneId] >= 3 && scene.input.hints && hintLvl < scene.input.hints.length) {
                        failMsg += "<br><span style='color:#f0ad4e'>【系统提示】" + scene.input.hints[hintLvl] + "</span>";
                        hints[sceneId] = hintLvl + 1;
                        window.run.hint_levels = hints;
                    } else if (scene.input.hints && hintLvl > 0) {
                        let lastHint = Math.min(hintLvl - 1, scene.input.hints.length - 1);
                        failMsg += "<br><span style='color:#f0ad4e'>【系统提示】" + scene.input.hints[lastHint] + "</span>";
                    }
                    
                    feedbackDiv.innerHTML = failMsg;
                    if (scene.input.onFail) scene.input.onFail(val);
                }
            };
            
            inputField.addEventListener("keypress", (e) => {
                if (e.key === "Enter") submitBtn.click();
            });

            inputContainer.appendChild(inputField);
            inputContainer.appendChild(submitBtn);
            inputContainer.appendChild(feedbackDiv);
            optionsContainer.appendChild(inputContainer);
            
            setTimeout(() => {
                const gameContainer = document.getElementById("game-container");
                if (gameContainer) gameContainer.scrollTop = gameContainer.scrollHeight;
                inputField.focus();
            }, 50);
        }

        if (scene.combine) {
            let mixContainer = document.createElement("div");
            mixContainer.className = "puzzle-mix-container";
            mixContainer.style.margin = "20px 0";
            mixContainer.style.padding = "15px";
            mixContainer.style.background = "rgba(0,0,0,0.4)";
            mixContainer.style.border = "1px solid #555";
            mixContainer.style.borderRadius = "5px";
            mixContainer.style.textAlign = "center";

            let mixTitle = document.createElement("h4");
            mixTitle.innerText = scene.combine.title || "物品组合实验台";
            mixTitle.style.color = "#d4af37";
            mixTitle.style.marginTop = "0";
            mixContainer.appendChild(mixTitle);

            let selectedItems = new Set();
            let itemsDiv = document.createElement("div");
            itemsDiv.style.display = "flex";
            itemsDiv.style.flexWrap = "wrap";
            itemsDiv.style.gap = "10px";
            itemsDiv.style.justifyContent = "center";
            itemsDiv.style.marginBottom = "15px";

            let inventory = window.run.items || [];
            
            if (inventory.length === 0) {
                let emptyMsg = document.createElement("div");
                emptyMsg.innerText = "背包空空如也，没有可组合的物品。";
                emptyMsg.style.color = "#777";
                emptyMsg.style.fontStyle = "italic";
                itemsDiv.appendChild(emptyMsg);
            } else {
                inventory.forEach(itemName => {
                    let itemBtn = document.createElement("button");
                    itemBtn.innerText = itemName;
                    itemBtn.className = "option-btn";
                    itemBtn.style.margin = "0";
                    itemBtn.style.padding = "5px 10px";
                    itemBtn.style.border = "1px solid #777";
                    itemBtn.style.background = "#222";
                    itemBtn.style.color = "#ccc";
                    itemBtn.style.cursor = "pointer";
                    itemBtn.style.transition = "all 0.2s";

                    itemBtn.onclick = () => {
                        if (selectedItems.has(itemName)) {
                            selectedItems.delete(itemName);
                            itemBtn.style.background = "#222";
                            itemBtn.style.border = "1px solid #777";
                            itemBtn.style.color = "#ccc";
                            itemBtn.style.boxShadow = "none";
                        } else {
                            if (selectedItems.size >= (scene.combine.maxSelect || 2)) {
                                showToast("最多只能选择 " + (scene.combine.maxSelect || 2) + " 个物品进行组合。");
                                return;
                            }
                            selectedItems.add(itemName);
                            itemBtn.style.background = "#5c4033";
                            itemBtn.style.border = "1px solid #d4af37";
                            itemBtn.style.color = "#fff";
                            itemBtn.style.boxShadow = "0 0 8px rgba(212, 175, 55, 0.5)";
                        }
                    };
                    itemsDiv.appendChild(itemBtn);
                });
            }
            mixContainer.appendChild(itemsDiv);

            let combineBtn = document.createElement("button");
            combineBtn.innerText = "尝试组合";
            combineBtn.className = "action-btn";
            combineBtn.style.padding = "10px 20px";
            combineBtn.style.cursor = "pointer";
            combineBtn.style.background = "#444";
            combineBtn.style.color = "#fff";
            combineBtn.style.border = "1px solid #666";
            combineBtn.style.borderRadius = "4px";
            combineBtn.style.display = inventory.length > 0 ? "inline-block" : "none";

            let mixFeedback = document.createElement("div");
            mixFeedback.style.color = "#d9534f";
            mixFeedback.style.marginTop = "15px";
            mixFeedback.style.minHeight = "24px";

            combineBtn.onclick = () => {
                if (selectedItems.size === 0) return;
                
                let selectedArr = Array.from(selectedItems);
                let requiredArr = scene.combine.required || [];
                
                // Check if match
                let isMatch = selectedArr.length === requiredArr.length && 
                              requiredArr.every(req => selectedArr.includes(req));
                
                if (isMatch) {
                    mixFeedback.style.color = "#5cb85c";
                    mixFeedback.innerText = "组合成功！";
                    
                    // Consume ingredients by default
                    if (scene.combine.consume !== false) {
                        requiredArr.forEach(req => removeItem(req));
                    }
                    
                    // Add result if any
                    if (scene.combine.result) {
                        addItem(scene.combine.result);
                    }
                    
                    if (scene.combine.onSuccess) {
                        scene.combine.onSuccess();
                    }
                    
                    if (scene.combine.success) {
                        setTimeout(() => renderScene(scene.combine.success), 800);
                    }
                } else {
                    mixFeedback.innerHTML = scene.combine.failMsg || "组合似乎没有产生任何反应……可能是配方不对。";
                    
                    // Clear selection
                    selectedItems.clear();
                    Array.from(itemsDiv.children).forEach(btn => {
                        if(btn.tagName && btn.tagName.toLowerCase() === "button") {
                            btn.style.background = "#222";
                            btn.style.border = "1px solid #777";
                            btn.style.color = "#ccc";
                            btn.style.boxShadow = "none";
                        }
                    });
                }
            };

            mixContainer.appendChild(combineBtn);
            mixContainer.appendChild(mixFeedback);
            optionsContainer.appendChild(mixContainer);
        }

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
            options.push({ text: "带着记忆苏醒 (开启多周目)", target: "opening_studio_ng_plus", condition: () => profile.endings_reached.length > 0 });
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
            "studio_entry": "洞察徽章",
            "basement_entry": "转化徽章",
            "clocktower_entry": "怀表"
        };
        var visitedKey = sceneId + "->" + opt.target;
        if (!profile.visited_options) profile.visited_options = {};
        if (profile.visited_options[visitedKey]) {
            suffix += " <span style='color:#777;'>(已勘查)</span>";
        }

        if (roomMedalMap[opt.target]) {
            const req = roomMedalMap[opt.target];
            if (run.items.some(i => i.includes(req))) {
                suffix = ' <span style="color:#d4af37; font-weight:bold; font-size:1.1em;">(✓ 已解开)</span>';
            }
        }


            
            let btn = document.createElement("button");
            btn.className = "option-btn";
            
            if (isAvailable) {
                btn.innerHTML = "➤ " + optionText + suffix;
                btn.onclick = () => {
                    if (!profile.visited_options) profile.visited_options = {};
                    profile.visited_options[visitedKey] = true;
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
                        renderScene(normalizedTarget);
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
    "古树血提取剂": "用七种植物血液调配的深红色液体，能唤醒枯死的古树。",
    "七色花肥料": "能迅速为七色花提供丰富营养的肥料。",
    "七色花苞": "一枚被妥善保存的花苞，花萼边缘呈现不自然的七色过渡，像在等待某种催化。",
    "七色花琥珀": "一块封存着七色花花瓣的古老琥珀，背面刻着“以七血滋养，可复生机”。",
    "长柄夹": "一把细长的取物夹，适合从深槽、石盆和狭窄缝隙中安全夹取目标。",
    "旧照片": "照片背面的字迹让你察觉到管家隐藏的过去。",
    "管家在隐瞒什么": "管家似乎在替主人隐瞒一段不为人知的秘密。",
    "色彩徽章": "第四枚徽章，彩色。",
    "旋律徽章": "音乐室的徽章。",
    "深渊徽章": "地下室的徽章。",
    "停止的怀表": "一块没有指针的怀表，表盘上只有细密的刻度。表盖内侧刻着一行小字：“时间停止的地方，答案开始。”",
    "衣柜钥匙": "一把黄铜钥匙，钥匙柄上刻着“衣柜”二字，表面有轻微的锈迹，但仍能使用。",
    "铜钥匙": "一枚古铜色钥匙，钥匙齿纹路清晰，似乎能打开某处隐秘的锁。",
    "艺术奖章": "一枚铜质奖章，正面刻着“年度最佳肖像画家”，背面有阿斯特·克劳利的名字和1890年的日期。",
    "画展目录": "一本泛黄的小册子，封面印着“阿斯特·克劳利个人画展，1890年秋”。目录中列出了七幅画作，备注栏写着模特伊莲娜在画展前失踪。",
    "伊莲娜的日记": "伊莲娜·韦恩的私人日记，皮质封面烫金。日记记录了她与阿斯特从相爱到恐惧的全过程，最后一页有阿斯特的忏悔。",
    "银手镯": "一只银质手镯，内壁刻着“A.C. to E.W.”（阿斯特·克劳利赠伊莲娜·韦恩）。触摸时能感到一丝冰凉。",
    "紫藤花束": "一束干枯的紫藤花，用褪色的丝带扎着，散发出淡淡的、几不可闻的香气。花瓣虽已枯黄，却仍保持着绽放的姿态。",
    "照片": "一张褪色的旧照片，照片中一对年轻男女并肩站在紫藤花架下，笑容温暖。背面写着：“1890年春，我们曾拥有过一切。”",
    "画布碎片": "一小块从画布上撕下的碎片，上面画着一只传神的眼睛——伊莲娜的眼睛，仿佛在凝视着你。背面写着：“我的灵魂在这里。”",
    "阿斯特的遗信": "阿斯特·克劳利写给伊莲娜的未寄出的信，信纸泛黄，字迹时而工整时而潦草。信中承认他建造谜语馆是为了纪念伊莲娜，并请求原谅。",
    "夜莺锁片": "一枚夜莺形状的小锁片，背后刻着“花园紫藤架下，1888”。锁片内部似乎藏着某种机关，可以旋转。",
    "埃莉诺前六乐章总谱": "一份完整的手写乐谱，包含埃莉诺·布莱克伍德交响曲的前六个乐章：诞生、爱情、漂泊、归乡、告别、等待。乐谱边缘有铅笔注释。",
    "埃莉诺遗信": "埃莉诺写给阿斯特的遗信，字迹娟秀但虚弱。信中交代她将最后的秘密藏在音乐室壁炉后，并希望有人能完成第七乐章。",
    "音乐室铜钥匙": "一把造型古朴的铜钥匙，钥匙柄上刻着夜莺图案，可用于打开音乐室壁炉后的密道。",
    "埃莉诺制琴笔记": "一本深蓝色丝绒封面的笔记，记录了埃莉诺制作七件乐器的技术细节和心路历程，末尾附有她的病中日记。",
    "夜莺徽章（纪念品）": "一枚银色的夜莺徽章，不是主线的七徽章之一。背面刻着：“感谢你让我完成最后的乐章。”",
    "埃莉诺的完整交响曲（七乐章全本）": "一份完整的交响曲总谱，共七个乐章，第七乐章标题为“重生”。这是埃莉诺未竟之作的最终完成版。",
    "紫藤花种子": "几粒干瘪的紫藤花种子，用纸包裹着。纸包上写着：“种在安息地前，她将不再孤单。”",
    "克劳利的日记": "皮质封面，记录着庄园的部分秘密。",
    "机械齿轮": "铜质齿轮，边缘有编号，可用于其他机关。",
    "调音扳手": "用于校准管风琴与弦乐器音高的精密工具。",
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
    let uniqueItems = [...new Set(run.items)];

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
    }for (let i = 0; i < run.clues.length; i++) {
        let clue = run.clues[i];
        if (clue.startsWith("[线索]")) {
            cluesHtml += "<span class='inv-item'>" + clue.replace("[线索]", "").trim() + "</span> ";
        } else {
            cluesHtml += "<span class='inv-item'>" + clue.trim() + "</span> ";
        }
    }
    
    if (invItems) invItems.innerHTML = itemsHtml ? itemsHtml : "<span class='empty-text'>无</span>";
    if (invClues) invClues.innerHTML = cluesHtml ? cluesHtml : "<span class='empty-text'>无</span>";
    if (medalCountSpan) medalCountSpan.innerText = run.hall_medal_count || medalsCount;
    if (invMedals) invMedals.innerHTML = medalsHtml ? medalsHtml : "<span class='empty-text'>无</span>";

    const ngCountSpan = document.getElementById("ng-count");
    const endingCountSpan = document.getElementById("ending-count");
    const invAch = document.getElementById("inv-achievements");
    
    if (ngCountSpan) ngCountSpan.innerText = profile.play_count || 0;
    
    let reachedEndings = profile.endings_reached || [];
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
        if (Array.isArray(profile.achievements) && profile.achievements.length > 0) {
            achHtml += "<div class='inv-item achievement' style='display:block;margin-bottom:5px;'><span class='icon'>🏆</span> 成就数量: " + profile.achievements.length + "</div>";
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

    const allAchievements = Array.isArray(profile.achievements) ? profile.achievements : [];
    const uniqueEndings = new Set(profile.endings_reached || []).size;

    if (achTotal) achTotal.innerText = String(allAchievements.length);
    if (achEndingCount) achEndingCount.innerText = String(uniqueEndings);
    if (achNgCount) achNgCount.innerText = String(profile.play_count || 0);

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
    if (run.current_scene_id === 'hall_main' || run.current_scene_id === 'hall_initial_enter') {
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
    autoSave();
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
    rootState = loadState();
    window.profile = rootState.profile;
    window.run = rootState.run;
    profile = window.profile;
    run = window.run;
    renderScene(run.current_scene_id || "title");
    alert("读取成功！");
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
    if (!run || !run.current_scene_id) return;
    
    let sid = run.current_scene_id;
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

