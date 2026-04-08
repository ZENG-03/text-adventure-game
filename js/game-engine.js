/**
 * 游戏引擎核心模块
 * 
 * 该模块负责游戏的核心逻辑，包括：
 * - 状态管理：加载、保存游戏状态
 * - 成就系统：解锁和管理成就
 * - 场景渲染：处理场景切换和显示
 * - 用户交互：处理选项选择、物品提交等
 * - 特殊效果：打字机效果、背景切换等
 * 
 * 依赖：
 * - state-store.js：负责游戏状态的存储和加载
 */

import { loadState, saveState } from "./state-store.js";

// 游戏全局设置
var gameSettings = {
    fontSize: 16,     // 字体大小
    typeSpeed: 25,    // 打字机速度 (ms)
    noAnim: false     // 是否禁用动画
};

// 加载初始存档
let rootState = loadState();

// 全局与多周目状态管理
window.profile = rootState.profile;
// 单局游戏状态管理
window.run = rootState.run;

// 为了反向兼容，确保本地变量也指向它们
let profile = window.profile;
let run = window.run;

// 增加全局别名，兼容 game-scenes.js 和 index.html 中的调用
window.globalState = window.profile;
window.gameState = window.run;

/**
 * 状态操作 API，提供给场景脚本调用
 * 
 * 该对象提供了一系列方法，用于操作游戏状态，包括物品、线索和剧情标记的管理。
 * 场景脚本可以通过这些方法来检查和修改游戏状态，实现各种游戏逻辑。
 */
export const StateAPI = {
    /**
     * 检查是否拥有物品
     * @param {string} name - 物品名称
     * @returns {boolean} - 是否拥有该物品
     */
    hasItem: (name) => run.items.includes(name),
    
    /**
     * 添加物品（去重）
     * @param {string} name - 物品名称
     */
    addItem: (name) => {
        if (!run.items.includes(name)) {
            run.items.push(name);
        }
    },
    
    /**
     * 移除物品
     * @param {string} name - 物品名称
     */
    removeItem: (name) => {
        const idx = run.items.indexOf(name);
        if (idx !== -1) {
            run.items.splice(idx, 1);
        }
    },
    
    /**
     * 检查是否拥有线索
     * @param {string} name - 线索名称
     * @returns {boolean} - 是否拥有该线索
     */
    hasClue: (name) => run.clues.includes(name),
    
    /**
     * 添加线索（去重）
     * @param {string} name - 线索名称
     */
    addClue: (name) => {
        if (!run.clues.includes(name)) {
            run.clues.push(name);
        }
    },
    
    /**
     * 获取剧情标记（布尔值）
     * @param {string} key - 标记键名
     * @returns {boolean} - 标记值（转换为布尔值）
     */
    getFlag: (key) => !!run.flags[key],
    
    /**
     * 设置剧情标记
     * @param {string} key - 标记键名
     * @param {*} val - 标记值（默认为true）
     */
    setFlag: (key, val = true) => {
        run.flags[key] = val;
    }
};

/**
 * 解锁成就
 * @param {string} id 成就 ID
 * @param {string} name 成就名称
 * @returns {string} 提示 HTML 字符串
 */
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

/**
 * 显示成就弹窗
 * @param {string} msg 
 */
function showAchievementToast(msg) {
    const toast = document.getElementById("achievement-toast");
    if (!toast) return;
    const ttext = document.getElementById("toast-text");
    if(ttext) {
        ttext.innerHTML = msg;
    }
    toast.style.display = "block";
    toast.style.animation = "slideInX 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
    
    setTimeout(() => {
        toast.style.animation = "slideOutX 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards";
    }, 4000);
}

/**
 * 检查并更新成就状态
 * @returns {string} 所有新解锁成就的 HTML 汇总
 */
function checkAchievements() {
    const msgs = [];
    const medalCount = run.hall_medal_count || run.medals.length;
    const clueCount = run.clues.length;
    const ends = profile.endings_reached || [];
    const hasEnd = (name) => ends.includes(name);

    // 基础勋章成就
    if (medalCount >= 1) msgs.push(unlockAchievement("ach_first_medal", "初入谜域"));
    if (medalCount >= 4) msgs.push(unlockAchievement("ach_half_medals", "半程智者"));
    if (medalCount >= 7) msgs.push(unlockAchievement("ach_all_medals", "七曜归位"));

    // 全知之眼：集齐勋章但未触发任何支线（纯主线通关）
    if (medalCount >= 7 && 
        !getFlag("side_painting_triggered") && 
        !getFlag("side_underground_triggered") && 
        !getFlag("side_clock_completed") && 
        !getFlag("side_butler_completed")) {
        msgs.push(unlockAchievement("ach_all_seeing", "全知之眼"));
    }

    // 庄园之子：完成所有主要支线
    if (getFlag("side_butler_completed") && 
        getFlag("side_painting_completed") && 
        getFlag("side_underground_completed") && 
        getFlag("side_music_completed") && 
        medalCount >= 7) {
        msgs.push(unlockAchievement("ach_manor_child", "庄园之子"));
    }

    // 速度成就：50分钟内集齐勋章
    const runMs = run.run_started_at ? Date.now() - run.run_started_at : 0;
    if (medalCount >= 7 && runMs > 0 && runMs < 50 * 60 * 1000) {
        msgs.push(unlockAchievement("ach_lightning", "闪电破解"));
    }

    // 谨慎行者：未触发任何陷阱
    if (medalCount >= 7 && !getFlag("player_hit_trap")) {
        msgs.push(unlockAchievement("ach_cautious", "谨慎行者"));
    }

    // 暴力解谜：触发3次以上暴力破解
    const brutal = typeof run.flags.brutal_count === "number" ? run.flags.brutal_count : 0;
    if (brutal >= 3) msgs.push(unlockAchievement("ach_brutal", "暴力解谜者"));

    // 线索猎人
    if (clueCount >= 20) msgs.push(unlockAchievement("ach_clue_hunter", "线索猎人"));

    // 无冕之王：不带任何关键道具集齐勋章
    if (medalCount >= 7 && 
        !hasItem("埃莉诺的琴弓") && 
        !hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）") && 
        !hasItem("伊莲娜纪念徽章") && 
        !hasItem("守护者符文（可封印古老能量）")) {
        msgs.push(unlockAchievement("ach_uncrowned", "无冕之王"));
    }

    // 剧情类成就
    if (getFlag("side_butler_completed") && (hasEnd("自由的智者") || hasEnd("谜语馆的回响") || hasEnd("七重谜语的真相"))) {
        msgs.push(unlockAchievement("ach_brother", "兄弟之约"));
    }
    if (getFlag("side_painting_completed")) msgs.push(unlockAchievement("ach_painting_meet", "画中重逢"));
    if (getFlag("side_music_completed")) msgs.push(unlockAchievement("ach_symphony_done", "未完成的完成"));
    if (getFlag("side_underground_completed")) msgs.push(unlockAchievement("ach_underground_echo", "地下的回响"));
    
    if (getFlag("side_butler_completed") && 
        getFlag("side_painting_completed") && 
        getFlag("side_underground_completed") && 
        getFlag("side_music_completed")) {
        msgs.push(unlockAchievement("ach_all_stories", "所有故事"));
    }
    
    if (hasItem("夜莺徽章（纪念品）") && hasItem("埃莉诺的琴弓")) {
        msgs.push(unlockAchievement("ach_nightingale_gift", "夜莺的馈赠"));
    }

    // 结局类成就
    if (hasEnd("自由的智者")) msgs.push(unlockAchievement("ach_ending_free", "自由的智者"));
    if (hasEnd("永恒的守护者")) msgs.push(unlockAchievement("ach_ending_guardian", "永恒的守护者"));
    
    if (hasEnd("谜语馆的回响") || hasEnd("七重谜语的真相")) {
        const sideN = [
            getFlag("side_painting_completed"), 
            getFlag("side_underground_completed"), 
            getFlag("side_music_completed"), 
            getFlag("side_butler_completed")
        ].filter(Boolean).length;
        if (sideN >= 2) msgs.push(unlockAchievement("ach_eternal_echo", "永恒的回响"));
    }
    
    if (hasEnd("七重谜语的真相")) msgs.push(unlockAchievement("ach_true_end", "七重谜语的真相"));
    if (hasEnd("被遗忘的探索者")) msgs.push(unlockAchievement("ach_ending_forgotten", "被遗忘的探索者"));

    // 彩蛋类成就
    if (getFlag("side_painting_completed") && getFlag("side_music_completed") && hasEnd("七重谜语的真相")) {
        msgs.push(unlockAchievement("ach_egg_nightingale_wisteria", "夜莺与紫藤"));
    }
    if (hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）") && hasEnd("永恒的守护者")) {
        msgs.push(unlockAchievement("ach_egg_brother_reconcile", "兄弟和解"));
    }
    if (getFlag("side_underground_completed") && hasClue("托马斯地质学会正名")) {
        msgs.push(unlockAchievement("ach_egg_geologist", "地质学家的复仇"));
    }
    if (medalCount >= 7 && 
        hasItem("伊莲娜纪念徽章") && 
        hasItem("阿斯特的怀表（可在后续谜题中作为提示道具使用）") && 
        hasItem("夜莺徽章（纪念品）") && 
        hasItem("守护者符文（可封印古老能量）")) {
        msgs.push(unlockAchievement("ach_egg_all_collector", "全徽章收集者"));
    }

    // 最终大师成就
    const gotAllRegular = ACHIEVEMENTS_FOR_MASTER.every((id) => profile.achievements.includes(id));
    if (gotAllRegular) msgs.push(unlockAchievement("ach_master", "谜语大师"));

    // 自动保存新解锁的成就
    if (msgs.some(Boolean)) {
        saveState(rootState);
    }
    return msgs.filter(Boolean).join("<br>");
}

/**
 * 根据 ID 获取成就显示名称
 */
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

// ========== 辅助操作方法 ==========

// 自动保存存档
function autoSave() {
    saveState(rootState);
}

// 检查是否拥有物品
function hasItem(item) { 
    return run.items.includes(item); 
}

// 移除物品
function removeItem(item) { 
    const idx = run.items.indexOf(item);
    if (idx !== -1) {
        run.items.splice(idx, 1);
        return true;
    }
    return false;
}

// 检查是否拥有线索
function hasClue(clue) { 
    return run.clues.includes(clue); 
}

// 获取剧情标记
function getFlag(key) { 
    return run.flags[key] || false; 
}

// 设置剧情标记
function setFlag(key, val) { 
    run.flags[key] = val; 
}

// 增加大厅勋章计数
function addMedal() { 
    run.hall_medal_count += 1; 
}

// 增加数值类剧情标记
function incrementFlag(key, val=1) { 
    setFlag(key, (getFlag(key) || 0) + val); 
}

/**
 * 添加线索并返回提示 HTML
 */
function addClue(clue) {
    if(!hasClue(clue)) {
        run.clues.push(clue);
        return `<div class="system-message">【获得线索】：${clue}</div>`;
    }
    return "";
}

/**
 * 添加物品并返回提示 HTML
 */
function addItem(item) {
    if(!hasItem(item)) {
        run.items.push(item);
        // 如果有物品详情弹窗函数则调用
        if (typeof showItemPopup === "function") {
            showItemPopup(item);
        }
        // 特殊处理勋章物品
        if (item.includes("徽章")) {
            run.medals.push(item);
            addMedal();
        }
        return `<div class="system-message">【获得物品】：${item}</div>`;
    }
    return "";
}

// ========== 场景定义与 UI 管理 ==========

window.scenes = window.scenes || {};
const scenes = window.scenes;

// 绑定 UI 元素
const storyElement = document.getElementById("story-text");
const optionsContainer = document.getElementById("options-container");

let typeWriterInterval = null;
let isTyping = false;

/**
 * 检查场景是否为占位内容
 */
function isPlaceholderScene(sceneObj) {
    if (!sceneObj || typeof sceneObj.desc !== "string") {
        return false;
    }
    const d = sceneObj.desc;
    return d.includes("尚在整理中") || 
           d.includes("剧情节点") || 
           d.includes("细节尚未实装") || 
           d.includes("该区域（");
}


/**
 * 推断场景跳转目标
 * 当目标场景不存在或为占位场景时，尝试通过前缀和令牌匹配寻找最接近的可用场景
 * @param {string} target 原始目标 ID
 * @returns {string|null} 推断出的目标 ID
 */
function inferSceneTarget(target) {
    const allSceneIds = Object.keys(scenes || {});
    if (!target || allSceneIds.length === 0) {
        return null;
    }

    const prefix = target.split("_")[0];
    // 优先寻找前缀相同且不是占位符的场景
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
        tTokens.forEach((tk) => { 
            if (cTokens.has(tk)) {
                overlap++; 
            }
        });

        // 计算公共前缀长度
        let commonPrefix = 0;
        const minLen = Math.min(target.length, id.length);
        while (commonPrefix < minLen && target[commonPrefix] === id[commonPrefix]) {
            commonPrefix++;
        }

        // 评分逻辑：令牌重合度权重最高，其次是前缀长度，最后是长度差异惩罚
        const score = overlap * 20 + commonPrefix - Math.abs(id.length - target.length);
        if (score > bestScore) {
            bestScore = score;
            bestId = id;
        }
    }
    
    // 只有分数达到一定阈值才认为是有效匹配
    return bestScore >= 6 ? bestId : null;
}

/**
 * 解析物品提交的目标场景
 * @param {Object} selection 提交配置
 * @param {string} itemName 提交的物品名称
 * @param {string} sceneId 当前场景 ID
 * @returns {string} 目标场景 ID
 */
function resolveItemSubmissionTarget(selection, itemName, sceneId) {
    if (!selection) {
        return sceneId;
    }

    // 1. 优先使用自定义验证函数
    if (typeof selection.validator === "function") {
        try {
            const validatedTarget = selection.validator(itemName, run, sceneId);
            if (typeof validatedTarget === "string" && validatedTarget.trim()) {
                return validatedTarget.trim();
            }
        } catch (e) {
            console.error("Validator error:", e);
        }
    }

    // 2. 检查物品映射表
    if (selection.itemMap && selection.itemMap[itemName]) {
        return selection.itemMap[itemName];
    }

    // 3. 检查正确物品列表
    if (Array.isArray(selection.correctItems) && selection.correctItems.includes(itemName)) {
        return selection.correctTarget || sceneId;
    }

    // 4. 检查致命物品列表（会导致即死或陷阱）
    if (Array.isArray(selection.fatalItems) && selection.fatalItems.includes(itemName)) {
        return selection.fatalTarget || selection.wrongTarget || sceneId;
    }

    // 5. 检查致命关键字
    if (Array.isArray(selection.fatalKeywords) && 
        selection.fatalKeywords.some((kw) => kw && itemName.includes(kw))) {
        return selection.fatalTarget || selection.wrongTarget || sceneId;
    }

    // 6. 默认返回错误目标
    return selection.wrongTarget || sceneId;
}

/**
 * 获取物品提交进度的 Flag 键名
 */
function getItemSubmissionProgressKey(sceneId, selection) {
    return (selection && selection.progressFlag) || (sceneId + "_submitted_items");
}

/**
 * 获取已提交的物品列表
 */
function getItemSubmissionProgress(sceneId, selection) {
    const key = getItemSubmissionProgressKey(sceneId, selection);
    const raw = run.flags[key];
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw.filter((item) => typeof item === "string" && item);
}

/**
 * 更新已提交物品进度
 */
function setItemSubmissionProgress(sceneId, selection, items) {
    const key = getItemSubmissionProgressKey(sceneId, selection);
    run.flags[key] = [...new Set(items.filter((item) => typeof item === "string" && item))];
}

/**
 * 渲染物品提交场景（特殊 UI）
 * @param {string} sceneId 
 * @param {Object} selection 
 */
function renderItemSubmissionScene(sceneId, selection) {
    const container = optionsContainer;
    if (!container) {
        return;
    }

    const uniqueItems = [...new Set((run.items || []).filter(Boolean))];
    const requiredCount = Math.max(1, Number(selection.requiredCount || 1));
    const submittedItems = getItemSubmissionProgress(sceneId, selection);
    const submittedSet = new Set(submittedItems);
    
    const promptBase = selection.prompt || "从背包中选择一件物品提交。";
    const prompt = requiredCount > 1
        ? `${promptBase}（已放入 ${submittedItems.length}/${requiredCount} 件）`
        : promptBase;
    
    const completedFlag = selection.completedFlag || (sceneId + "_completed");

    // 如果已完成，直接跳转
    if (getFlag(completedFlag) && selection.completedTarget) {
        renderScene(selection.completedTarget);
        return;
    }

    // 显示提示文本
    const promptBox = document.createElement("div");
    promptBox.className = "system-message";
    promptBox.innerText = prompt;
    storyElement.appendChild(promptBox);

    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.scrollTop = gameContainer.scrollHeight;
    }

    container.innerHTML = "";

    // 背包为空提示
    if (uniqueItems.length === 0) {
        const emptyBox = document.createElement("div");
        emptyBox.className = "danger-message";
        emptyBox.innerText = "你没有任何可提交的物品。";
        storyElement.appendChild(emptyBox);
    }

    // 返回按钮
    const backBtn = document.createElement("button");
    backBtn.className = "option-btn";
    backBtn.innerText = "返回";
    backBtn.onclick = () => renderScene(selection.backTarget || sceneId);
    container.appendChild(backBtn);

    // 渲染物品选项
    uniqueItems.forEach((itemName) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = "➤ 提交【" + itemName + "】";
        btn.onclick = () => {
            const target = resolveItemSubmissionTarget(selection, itemName, sceneId);
            const isCorrect = target === (selection.correctTarget || target);
            const isFatal = selection.fatalTarget && target === selection.fatalTarget;

            if (isCorrect) {
                // 处理正确提交
                const nextProgress = submittedSet.has(itemName) 
                    ? submittedItems.slice() 
                    : submittedItems.concat(itemName);
                
                setItemSubmissionProgress(sceneId, selection, nextProgress);
                
                if (selection.consumeOnCorrect !== false) {
                    removeItem(itemName);
                }
                
                const progressCount = nextProgress.length;
                if (requiredCount > 1 && progressCount < requiredCount) {
                    // 多件提交中，继续停留在此场景
                    const progressBox = document.createElement("div");
                    progressBox.className = "system-message";
                    progressBox.innerText = `【${itemName}】已嵌入凹槽，当前进度 ${progressCount}/${requiredCount}。`;
                    storyElement.appendChild(progressBox);
                    
                    if (gameContainer) {
                        gameContainer.scrollTop = gameContainer.scrollHeight;
                    }
                    renderScene(selection.correctTarget || sceneId);
                    return;
                }
                
                // 全部提交完成
                setFlag(completedFlag, true);
                renderScene(selection.completedTarget || target || selection.correctTarget || sceneId);
                return;
            }

            if (isFatal) {
                // 处理致命错误
                if (selection.consumeOnFatal !== false) {
                    removeItem(itemName);
                }
                renderScene(target);
                return;
            }

            // 处理普通错误
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

    // 底部取消按钮
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "option-btn";
    cancelBtn.innerText = "放弃提交，返回";
    cancelBtn.onclick = () => renderScene(selection.backTarget || sceneId);
    container.appendChild(cancelBtn);
}


/**
 * 带有 HTML 支持的打字机效果
 * 
 * 该函数实现了带有打字机效果的文本显示，支持HTML标签，并且可以通过点击跳过打字过程。
 * 
 * @param {HTMLElement} element - 目标元素，用于显示文本
 * @param {string} htmlString - HTML 内容字符串
 * @param {number} speed - 打字速度 (ms)
 * @param {Function} onComplete - 完成后的回调函数
 */
function typeWriterHTML(element, htmlString, speed, onComplete) {
    // 检查是否禁用动画
    if (typeof gameSettings !== "undefined" && gameSettings.noAnim) {
        clearInterval(typeWriterInterval);
        element.innerHTML = htmlString;
        isTyping = false;
        element.onclick = null;
        if (onComplete) {
            onComplete();
        }
        return;
    }
    
    // 使用游戏设置中的打字速度
    speed = typeof gameSettings !== "undefined" ? gameSettings.typeSpeed : speed;

    // 清除之前的打字动画
    clearInterval(typeWriterInterval);
    element.innerHTML = "";
    isTyping = true;
    
    let i = 0;
    let currentText = "";
    
    /**
     * 立即完成打字效果
     */
    const finishTypingNow = () => {
        if (!isTyping) {
            return;
        }
        clearInterval(typeWriterInterval);
        element.innerHTML = htmlString;
        isTyping = false;
        element.onclick = null;
        if (containerEl && containerSkipHandler) {
            containerEl.removeEventListener("click", containerSkipHandler);
        }
        if (onComplete) {
            onComplete();
        }
    };

    const containerEl = document.getElementById("game-container");
    const containerSkipHandler = () => finishTypingNow();

    // 点击剧情区或容器空白区域都可跳过打字
    element.onclick = () => finishTypingNow();
    if (containerEl) {
        containerEl.addEventListener("click", containerSkipHandler);
    }

    // 开始打字动画
    typeWriterInterval = setInterval(() => {
        if (i >= htmlString.length) {
            // 打字完成
            clearInterval(typeWriterInterval);
            isTyping = false;
            element.onclick = null;
            if (containerEl && containerSkipHandler) {
                containerEl.removeEventListener("click", containerSkipHandler);
            }
            element.innerHTML = htmlString;
            if (onComplete) {
                onComplete();
            }
            return;
        }
        
        // 处理 HTML 标签，确保标签内部内容瞬间出现
        if (htmlString[i] === '<') {
            let tag = "";
            while(i < htmlString.length && htmlString[i] !== '>') {
                tag += htmlString[i];
                i++;
            }
            tag += '>';
            currentText += tag; 
        } else {
            currentText += htmlString[i];
            i++;
        }
        
        // 更新元素内容并添加光标
        element.innerHTML = currentText + '<span class="cursor"></span>';
        
        // 自动滚动到底部
        const gameContainer = document.getElementById("game-container");
        if (gameContainer) {
            gameContainer.scrollTop = gameContainer.scrollHeight;
        }
    }, speed);
}

// ========== 图片资源管理 ==========

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

/**
 * 设置当前场景背景
 * @param {string} sceneId 
 */
function setBackground(sceneId) {
    const bgDiv = document.getElementById("scene-background");
    if (!bgDiv) {
        return;
    }
    let bgUrl = backgroundMap[sceneId];
    if (bgUrl) {
        bgDiv.style.backgroundImage = `url(${bgUrl})`;
        bgDiv.style.opacity = "0.4"; // 默认透明度
    } else {
        bgDiv.style.backgroundImage = "none";
        bgDiv.style.opacity = "0";
    }
}

/**
 * 显示物品详情弹窗
 * @param {string} itemName 
 */
window.showItemPopup = function(itemName) {
    const desc = ITEM_DESCRIPTIONS[itemName] || "未详细描述的物品";
    window.showItemDetails(itemName, desc);
};

// ========== 核心渲染逻辑 ==========

/**
 * 渲染指定场景
 * 
 * 该函数是游戏引擎的核心函数，负责处理场景的渲染和各种游戏逻辑，包括：
 * - 记录选项访问路径
 * - 更新场景背景
 * - 处理特殊场景（如加载存档）
 * - 重置游戏状态（如返回主界面）
 * - 触发支线和动态事件
 * - 处理场景缺失和占位场景
 * - 记录游戏统计信息
 * - 执行自动存档
 * - 更新UI位置信息
 * - 处理场景进入触发器
 * - 渲染场景描述和选项
 * - 处理特殊UI（如物品提交、文本输入、物品组合）
 * 
 * @param {string} sceneId - 要渲染的场景ID
 */
export function renderScene(sceneId) {
    // 记录访问过的选项路径（用于灰显已访问的选项）
    if (run && run.current_scene_id && sceneId) {
        if (!profile.visited_options || typeof profile.visited_options !== "object") {
            profile.visited_options = {};
        }
        profile.visited_options[run.current_scene_id + "->" + sceneId] = true;
    }
    
    // 更新场景背景
    setBackground(sceneId);
    
    // 特殊场景：加载自动存档
    if (sceneId === "system_load_auto") {
        window.loadGame();
        return;
    }

    // 回到主界面：重置当前运行状态
    if(sceneId === "title" && run.current_scene_id !== "title") {
        run = {
            medals: [],
            items: [],
            clues: [],
            flags: {},
            current_scene_id: "title",
            hall_medal_count: 0,
            run_started_at: null,
            last_hall_medal_count: 0,
            hint_levels: {},
            visited_options: []
        };
        window.gameState = run; // 更新全局别名
    }

    // --- 拦截逻辑：支线和动态事件探测 ---
    
    // 1. 管家支线触发
    if (sceneId === "hall_main" && run.hall_medal_count >= 3 && !getFlag("side_butler_triggered")) {
        setFlag("side_butler_triggered", true);
        sceneId = "sys_side_story_1_trigger";
    } 
    // 2. 画室支线触发
    else if (sceneId === "studio_entry" && (hasItem("色彩徽章") || hasItem("橙色徽章")) && !getFlag("side_painting_triggered")) {
        setFlag("side_painting_triggered", true);
        sceneId = "sys_side_story_2_trigger";
    } 
    // 3. 地下室支线触发
    else if (sceneId === "basement_entry" && hasItem("深渊徽章") && !getFlag("side_underground_triggered")) {
        setFlag("side_underground_triggered", true);
        sceneId = "sys_side_story_3_trigger";
    } 
    // 4. 音乐室支线触发
    else if (sceneId === "musicroom_entry" && hasItem("旋律徽章") && !getFlag("side_music_triggered")) {
        setFlag("side_music_triggered", true);
        sceneId = "sys_side_story_4_trigger";
    }
    
    // 支线完成状态自动更新
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

    // 获取场景对象
    const scene = scenes[sceneId] || window.scenes[sceneId];
    
    // 处理场景缺失情况
    if(!scene) {
        if (sceneId !== "title" && sceneId !== "system_load_auto") {
            console.warn("Target scene missing:", sceneId);
            window.scenes[sceneId] = {
                desc: `厚重的铁门紧闭，上面布满奇异符号。\n你尝试推开，但纹丝不动。\n某种力量阻止了你继续深入……`,
                options: [{ text: "暂时离开", target: "hall_main" }]
            };
            setTimeout(() => renderScene(sceneId), 0);
        }
        return;
    }

    // 处理占位场景：自动引导回安全位置
    if (isPlaceholderScene(scene)) {
        const fallbackTarget = scenes["hall_main"] ? "hall_main" : "title";
        const fallbackText = fallbackTarget === "hall_main" ? "返回大厅" : "返回主界面";
        window.scenes[sceneId] = {
            desc: "【系统提示】该场景仍是占位内容，已临时收束为安全出口。",
            options: [{ text: fallbackText, target: fallbackTarget }]
        };
    }
    
    // 陷阱与暴力解谜记录
    const trapScenes = new Set(["library_unlock_clasp", "side_ending_disappear", "side_ending_seeker"]);
    const brutalScenes = new Set(["library_unlock_clasp", "basement_force_furnace", "clocktower_lever_early"]);
    
    if (trapScenes.has(sceneId)) {
        setFlag("player_hit_trap", true);
    }
    
    if (brutalScenes.has(sceneId)) {
        const n = typeof run.flags.brutal_count === "number" ? run.flags.brutal_count : 0;
        run.flags.brutal_count = n + 1;
    }
    
    // 记录游戏开始时间（用于速度成就）
    if ((sceneId === "opening_studio" || sceneId === "opening_studio_ng_plus" || sceneId === "opening_gate") && !run.run_started_at) {
        run.run_started_at = Date.now();
    }
    
    // 执行自动存档
    const lowerSceneId = String(sceneId || "").toLowerCase();
    const shouldSkipAutoSave =
        lowerSceneId === "title" ||
        lowerSceneId.startsWith("ending_") ||
        /(trap|death|dead|poison|explosion|fail|game_over|bad_end|fall)/.test(lowerSceneId);
    
    run.current_scene_id = sceneId;
    if (!shouldSkipAutoSave) {
        autoSave();
        if (typeof showToast === "function") {
            showToast("自动存档成功 💾");
        }
    }

    // 更新 UI 上的位置名称
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

    // 大厅过渡逻辑：当获得新勋章返回大厅时触发
    if (sceneId === "hall_main") {
        let prevMedalCount = run.last_hall_medal_count || 0;
        if (run.hall_medal_count > prevMedalCount) {
            let transitionId = "sys_room_exit_transition";
            window.scenes[transitionId] = {
                desc: "你将刚刚获得的徽章小心翼翼地收好，长舒了一口气。\n伴随着沉重的锁舌闭合声，这扇门在你身后缓缓关上，你再次回到了冰冷的大厅，但你的心境已经不再相同。",
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

    // 处理场景进入触发器
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

    // 处理动态描述
    let dynamicDesc = typeof scene.desc === "function" ? scene.desc() : scene.desc;
    
    // 处理物品提交完成后的重定向
    if (scene.itemSelection) {
        const completedFlag = scene.itemSelection.completedFlag || (sceneId + "_completed");
        if (getFlag(completedFlag) && scene.itemSelection.completedTarget) {
            renderScene(scene.itemSelection.completedTarget);
            return;
        }
    }

    // 大厅动态环境描述
    if (sceneId === "hall_main") {
        if (run.hall_medal_count >= 5) {
            dynamicDesc += "\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]";
        } else if (run.hall_medal_count >= 3) {
            dynamicDesc += "\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]";
        }
        
        // 渲染简易地图
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

    // 检查成就解锁
    const achMsg = checkAchievements();
    if (achMsg) {
        extraMsg += (extraMsg ? "<br><br>" : "") + achMsg;
    }

    // 拼接最终描述 HTML
    let fullDescHTML = dynamicDesc.replace(/\\n/g, "<br>") + (extraMsg ? "<br><br>" + extraMsg : "");
    
    // 清空并隐藏选项，等待打字机效果结束
    optionsContainer.innerHTML = "";
    optionsContainer.style.display = "none";

    // 启动打字机效果
    typeWriterHTML(storyElement, fullDescHTML, 25, () => {
        // 打字结束后显示选项
        optionsContainer.style.display = "flex";


        // 处理物品提交特殊 UI
        if (scene.itemSelection) {
            renderItemSubmissionScene(sceneId, scene.itemSelection);
            return;
        }

        // 处理文本输入谜题
        if (scene.input) {
            const inputContainer = document.createElement("div");
            inputContainer.className = "puzzle-input-container";
            inputContainer.style.margin = "20px 0";
            inputContainer.style.padding = "15px";
            inputContainer.style.background = "rgba(0,0,0,0.4)";
            inputContainer.style.border = "1px solid #555";
            inputContainer.style.borderRadius = "5px";
            inputContainer.style.textAlign = "center";

            const inputField = document.createElement("input");
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

            const submitBtn = document.createElement("button");
            submitBtn.innerText = "确认";
            submitBtn.className = "action-btn puzzle-submit";
            submitBtn.style.padding = "10px 20px";
            submitBtn.style.marginLeft = "10px";
            submitBtn.style.cursor = "pointer";
            submitBtn.style.background = "#444";
            submitBtn.style.color = "#fff";
            submitBtn.style.border = "1px solid #666";
            submitBtn.style.borderRadius = "4px";

            const feedbackDiv = document.createElement("div");
            feedbackDiv.className = "puzzle-feedback";
            feedbackDiv.style.color = "#d9534f";
            feedbackDiv.style.marginTop = "15px";
            feedbackDiv.style.minHeight = "24px";

            submitBtn.onclick = () => {
                const val = inputField.value.trim();
                if (!val) {
                    return;
                }
                
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
                    // 记录失败次数
                    window.run.puzzleFails = window.run.puzzleFails || {};
                    window.run.puzzleFails[sceneId] = (window.run.puzzleFails[sceneId] || 0) + 1;
                    
                    let failMsg = scene.input.failMsg || "不对...似乎还有什么没考虑到。";
                    const hints = window.run.hint_levels || {};
                    const hintLvl = hints[sceneId] || 0;
                    
                    // 失败3次以上触发提示
                    if (window.run.puzzleFails[sceneId] >= 3 && scene.input.hints && hintLvl < scene.input.hints.length) {
                        failMsg += `<br><span style='color:#f0ad4e'>【系统提示】${scene.input.hints[hintLvl]}</span>`;
                        hints[sceneId] = hintLvl + 1;
                        window.run.hint_levels = hints;
                    } else if (scene.input.hints && hintLvl > 0) {
                        const lastHint = Math.min(hintLvl - 1, scene.input.hints.length - 1);
                        failMsg += `<br><span style='color:#f0ad4e'>【系统提示】${scene.input.hints[lastHint]}</span>`;
                    }
                    
                    feedbackDiv.innerHTML = failMsg;
                    if (scene.input.onFail) {
                        scene.input.onFail(val);
                    }
                }
            };
            
            inputField.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    submitBtn.click();
                }
            });

            inputContainer.appendChild(inputField);
            inputContainer.appendChild(submitBtn);
            inputContainer.appendChild(feedbackDiv);
            optionsContainer.appendChild(inputContainer);
            
            setTimeout(() => {
                const gameContainer = document.getElementById("game-container");
                if (gameContainer) {
                    gameContainer.scrollTop = gameContainer.scrollHeight;
                }
                inputField.focus();
            }, 50);
        }

        // 处理物品组合谜题
        if (scene.combine) {
            const mixContainer = document.createElement("div");
            mixContainer.className = "puzzle-mix-container";
            mixContainer.style.margin = "20px 0";
            mixContainer.style.padding = "15px";
            mixContainer.style.background = "rgba(0,0,0,0.4)";
            mixContainer.style.border = "1px solid #555";
            mixContainer.style.borderRadius = "5px";
            mixContainer.style.textAlign = "center";

            const mixTitle = document.createElement("h4");
            mixTitle.innerText = scene.combine.title || "物品组合实验台";
            mixTitle.style.color = "#d4af37";
            mixTitle.style.marginTop = "0";
            mixContainer.appendChild(mixTitle);

            const selectedItems = new Set();
            const itemsDiv = document.createElement("div");
            itemsDiv.style.display = "flex";
            itemsDiv.style.flexWrap = "wrap";
            itemsDiv.style.gap = "10px";
            itemsDiv.style.justifyContent = "center";
            itemsDiv.style.marginBottom = "15px";

            const inventory = window.run.items || [];
            
            if (inventory.length === 0) {
                const emptyMsg = document.createElement("div");
                emptyMsg.innerText = "背包空空如也，没有可组合的物品。";
                emptyMsg.style.color = "#777";
                emptyMsg.style.fontStyle = "italic";
                itemsDiv.appendChild(emptyMsg);
            } else {
                inventory.forEach(itemName => {
                    const itemBtn = document.createElement("button");
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
                                if (typeof showToast === "function") {
                                    showToast("最多只能选择 " + (scene.combine.maxSelect || 2) + " 个物品进行组合。");
                                }
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

            const combineBtn = document.createElement("button");
            combineBtn.innerText = "尝试组合";
            combineBtn.className = "action-btn";
            combineBtn.style.padding = "10px 20px";
            combineBtn.style.cursor = "pointer";
            combineBtn.style.background = "#444";
            combineBtn.style.color = "#fff";
            combineBtn.style.border = "1px solid #666";
            combineBtn.style.borderRadius = "4px";
            combineBtn.style.display = inventory.length > 0 ? "inline-block" : "none";

            const mixFeedback = document.createElement("div");
            mixFeedback.style.color = "#d9534f";
            mixFeedback.style.marginTop = "15px";
            mixFeedback.style.minHeight = "24px";

            combineBtn.onclick = () => {
                if (selectedItems.size === 0) {
                    return;
                }
                
                const selectedArr = Array.from(selectedItems);
                const requiredArr = scene.combine.required || [];
                
                // 检查配方是否匹配
                const isMatch = selectedArr.length === requiredArr.length && 
                                requiredArr.every(req => selectedArr.includes(req));
                
                if (isMatch) {
                    mixFeedback.style.color = "#5cb85c";
                    mixFeedback.innerText = "组合成功！";
                    
                    // 默认消耗材料
                    if (scene.combine.consume !== false) {
                        requiredArr.forEach(req => removeItem(req));
                    }
                    
                    // 添加产物
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
                    
                    // 清空选择
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

        // 处理普通选项
        const options = Array.isArray(scene.options) ? [...scene.options] : [];
        const isEndingScene = sceneId === "game_over" || sceneId.startsWith("ending_");
        const isTrapScene = sceneId.includes("trap") || sceneId.includes("death") || sceneId.includes("explosion") || sceneId.includes("failure") || sceneId.includes("dead");

        // 如果是陷阱场景，提供重新挑战选项
        if (isTrapScene && options.length <= 1) {
            options.length = 0; 
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
        } 
        // 结局结算
        else if (isEndingScene && sceneId !== "game_over") {
            options.push({ text: "查看成就与轮回信息", target: "game_over" });
        } 
        // 游戏结束界面
        else if (sceneId === "game_over") {
            options.push({ text: "返回主界面", target: "title" });
            options.push({ 
                text: "带着记忆苏醒 (开启多周目)", 
                target: "opening_studio_ng_plus", 
                condition: () => profile.endings_reached.length > 0 
            });
        }

        // 兜底选项
        if (options.length === 0) {
            options.push({ text: "返回主界面", target: "title" });
        }

        // 渲染选项按钮
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
            
            const visitedKey = sceneId + "->" + opt.target;
            if (!profile.visited_options) {
                profile.visited_options = {};
            }
            
            // 已访问过的选项标记
            if (profile.visited_options[visitedKey]) {
                suffix += " <span style='color:#777;'>(已勘查)</span>";
            }

            // 已获得对应勋章的房间标记
            if (roomMedalMap[opt.target]) {
                const req = roomMedalMap[opt.target];
                if (run.items.some(i => i.includes(req))) {
                    suffix = ' <span style="color:#d4af37; font-weight:bold; font-size:1.1em;">(✓ 已解开)</span>';
                }
            }
            
            const btn = document.createElement("button");
            btn.className = "option-btn";
            
            if (isAvailable) {
                btn.innerHTML = "➤ " + optionText + suffix;
                btn.onclick = () => {
                    if (!profile.visited_options) {
                        profile.visited_options = {};
                    }
                    profile.visited_options[visitedKey] = true;
                    
                    if(opt.effectMsg) {
                        const hint = document.createElement("div");
                        hint.className = "system-message";
                        hint.innerText = opt.effectMsg;
                        storyElement.appendChild(hint);
                        
                        const gameContainer = document.getElementById("game-container");
                        if (gameContainer) {
                            gameContainer.scrollTop = gameContainer.scrollHeight;
                        }
                    }
                    
                    const nextTarget = opt.target || sceneId;
                    let normalizedTarget = nextTarget === "hall_main" ? "hall_main" : nextTarget;

                    // 检查目标是否存在，不存在则尝试推断
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
                        const hint = document.createElement("div");
                        hint.className = "system-message";
                        hint.innerText = "这里暂时没有新的变化。";
                        storyElement.appendChild(hint);
                        
                        const gameContainer = document.getElementById("game-container");
                        if (gameContainer) {
                            gameContainer.scrollTop = gameContainer.scrollHeight;
                        }
                    }
                };
            } else {
                // 无法解锁的选项
                btn.innerHTML = "➤ <del>" + optionText + "</del> <span style='font-size:0.85em;color:#777;margin-left:8px;'>(线索或道具不足，无法解锁)</span>";
                btn.classList.add("disabled");
                btn.disabled = true;
            }
            optionsContainer.appendChild(btn);
        });
        
        const gameContainer = document.getElementById("game-container");
        if (gameContainer) {
            gameContainer.scrollTop = gameContainer.scrollHeight;
        }
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


export { renderScene };
