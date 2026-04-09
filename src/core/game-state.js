/**
 * 游戏状态管理模块
 * 
 * 该模块负责游戏状态的管理，包括：
 * - 物品管理
 * - 线索管理
 * - 剧情标记管理
 * - 成就系统
 * - 状态操作 API
 */

import { loadState, saveState } from '../data/state-store.js';

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
window.rootState = rootState;

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
export function unlockAchievement(id, name) {
    if (!profile.achievements.includes(id)) {
        profile.achievements.push(id);
        return `<div class="system-message" style="color:#ead67d;font-weight:bold;">🏆 成就解锁：${name}</div>`;
    }
    return "";
}

/** 计入「谜语大师」的 19 项常规成就（不含第 20 项大师本身） */
export const ACHIEVEMENTS_FOR_MASTER = [
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
export function showAchievementToast(msg) {
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
export function checkAchievements() {
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
export function getAchievementNameById(id) {
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

/**
 * 自动保存存档
 */
export function autoSave() {
    saveState(rootState);
}

/**
 * 检查是否拥有物品
 */
export function hasItem(item) { 
    return run.items.includes(item); 
}

/**
 * 移除物品
 */
export function removeItem(item) { 
    const idx = run.items.indexOf(item);
    if (idx !== -1) {
        run.items.splice(idx, 1);
        return true;
    }
    return false;
}

/**
 * 检查是否拥有线索
 */
export function hasClue(clue) { 
    return run.clues.includes(clue); 
}

/**
 * 获取剧情标记
 */
export function getFlag(key) { 
    return run.flags[key] || false; 
}

/**
 * 设置剧情标记
 */
export function setFlag(key, val) { 
    run.flags[key] = val; 
}

/**
 * 增加大厅勋章计数
 */
export function addMedal() { 
    run.hall_medal_count += 1; 
}

/**
 * 增加数值类剧情标记
 */
export function incrementFlag(key, val=1) { 
    setFlag(key, (getFlag(key) || 0) + val); 
}

/**
 * 添加线索并返回提示 HTML
 */
export function addClue(clue) {
    if(!hasClue(clue)) {
        run.clues.push(clue);
        return `<div class="system-message">【获得线索】：${clue}</div>`;
    }
    return "";
}

/**
 * 添加物品并返回提示 HTML
 */
export function addItem(item) {
    if(!hasItem(item)) {
        run.items.push(item);
        // 如果有物品详情弹窗函数则调用
        if (typeof window.showItemPopup === "function") {
            window.showItemPopup(item);
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

// 导出全局函数
window.hasItem = hasItem;
window.removeItem = removeItem;
window.hasClue = hasClue;
window.getFlag = getFlag;
window.setFlag = setFlag;
window.addMedal = addMedal;
window.incrementFlag = incrementFlag;
window.addClue = addClue;
window.addItem = addItem;
window.checkAchievements = checkAchievements;
window.autoSave = autoSave;

// 二周目与Meta游戏相关API 暴露给全局以便 game-scenes.js 里调用
export function hasEnding(name) {
    return profile.endings_reached && profile.endings_reached.includes(name);
}
export function getPlayCount() {
    return profile.play_count || 0;
}
export function checkProfileVisited(key) {
    return profile.visited_options && profile.visited_options[key] === true;
}
export function markProfileVisited(key) {
    if (!profile.visited_options) profile.visited_options = {};
    profile.visited_options[key] = true;
    autoSave();
}
window.hasEnding = hasEnding;
window.getPlayCount = getPlayCount;
window.checkProfileVisited = checkProfileVisited;
window.markProfileVisited = markProfileVisited;