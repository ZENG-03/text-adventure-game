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

import { useGameStore } from '../store/gameStore';

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
    hasItem: (name) => useGameStore().hasItem(name),
    
    /**
     * 添加物品（去重）
     * @param {string} name - 物品名称
     */
    addItem: (name) => useGameStore().addItem(name),
    
    /**
     * 移除物品
     * @param {string} name - 物品名称
     */
    removeItem: (name) => useGameStore().removeItem(name),
    
    /**
     * 检查是否拥有线索
     * @param {string} name - 线索名称
     * @returns {boolean} - 是否拥有该线索
     */
    hasClue: (name) => useGameStore().hasClue(name),
    
    /**
     * 添加线索（去重）
     * @param {string} name - 线索名称
     */
    addClue: (name) => useGameStore().addClue(name),
    
    /**
     * 获取剧情标记（布尔值）
     * @param {string} key - 标记键名
     * @returns {boolean} - 标记值（转换为布尔值）
     */
    getFlag: (key) => useGameStore().getFlag(key),
    
    /**
     * 设置剧情标记
     * @param {string} key - 标记键名
     * @param {*} val - 标记值（默认为true）
     */
    setFlag: (key, val = true) => useGameStore().setFlag(key, val)
};

/**
 * 解锁成就
 * @param {string} id 成就 ID
 * @param {string} name 成就名称
 * @returns {string} 提示 HTML 字符串
 */
export function unlockAchievement(id, name) {
    return useGameStore().unlockAchievement(id, name);
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
    return useGameStore().checkAchievements();
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
    useGameStore().saveState();
}

/**
 * 检查是否拥有物品
 */
export function hasItem(item) { 
    return useGameStore().hasItem(item); 
}

/**
 * 移除物品
 */
export function removeItem(item) { 
    return useGameStore().removeItem(item); 
}

/**
 * 检查是否拥有线索
 */
export function hasClue(clue) { 
    return useGameStore().hasClue(clue); 
}

/**
 * 获取剧情标记
 */
export function getFlag(key) { 
    return useGameStore().getFlag(key); 
}

/**
 * 设置剧情标记
 */
export function setFlag(key, val) { 
    useGameStore().setFlag(key, val); 
}

/**
 * 增加大厅勋章计数
 */
export function addMedal() { 
    useGameStore().addMedal(); 
}

/**
 * 增加数值类剧情标记
 */
export function incrementFlag(key, val=1) { 
    useGameStore().incrementFlag(key, val); 
}

/**
 * 添加线索并返回提示 HTML
 */
export function addClue(clue) {
    return useGameStore().addClue(clue);
}

/**
 * 添加物品并返回提示 HTML
 */
export function addItem(item) {
    return useGameStore().addItem(item);
}

// 二周目与Meta游戏相关API
export function hasEnding(name) {
    return useGameStore().hasEnding(name);
}
export function getPlayCount() {
    return useGameStore().getPlayCount();
}
export function checkProfileVisited(key) {
    return useGameStore().checkProfileVisited(key);
}
export function markProfileVisited(key) {
    useGameStore().markProfileVisited(key);
}