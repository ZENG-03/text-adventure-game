/**
 * 场景渲染模块
 * 
 * 该模块负责游戏场景的渲染，包括：
 * - 场景描述的显示
 * - 选项按钮的渲染
 * - 打字机效果
 * - 物品提交界面
 * - 文本输入谜题
 * - 物品组合谜题
 * - 背景图片管理
 */

import { hasItem, removeItem, getFlag, setFlag } from '../core/game-state.js';

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
    const allSceneIds = Object.keys(window.scenes || {});
    if (!target || allSceneIds.length === 0) {
        return null;
    }

    const prefix = target.split("_")[0];
    // 优先寻找前缀相同且不是占位符的场景
    const preferred = allSceneIds.filter((id) => {
        const s = window.scenes[id];
        return id.startsWith(prefix + "_") && !isPlaceholderScene(s);
    });
    
    const candidates = preferred.length > 0
        ? preferred
        : allSceneIds.filter((id) => !isPlaceholderScene(window.scenes[id]));

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
            const validatedTarget = selection.validator(itemName, window.run, sceneId);
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
    const raw = window.run.flags[key];
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
    window.run.flags[key] = [...new Set(items.filter((item) => typeof item === "string" && item))];
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

    const uniqueItems = [...new Set((window.run.items || []).filter(Boolean))];
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
    if (typeof window.gameSettings !== "undefined" && window.gameSettings.noAnim) {
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
    speed = typeof window.gameSettings !== "undefined" ? window.gameSettings.typeSpeed : speed;

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
    if (window.run && window.run.current_scene_id && sceneId) {
        if (!window.profile.visited_options || typeof window.profile.visited_options !== "object") {
            window.profile.visited_options = {};
        }
        window.profile.visited_options[window.run.current_scene_id + "->" + sceneId] = true;
    }
    
    // 更新场景背景
    setBackground(sceneId);
    
    // 特殊场景：加载自动存档
    if (sceneId === "system_load_auto") {
        window.loadGame();
        return;
    }

    // 回到主界面：重置当前运行状态
    if(sceneId === "title" && window.run.current_scene_id !== "title") {
        window.run = {
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
        window.gameState = window.run; // 更新全局别名
    }

    // --- 拦截逻辑：支线和动态事件探测 ---
    
    // 1. 管家支线触发
    if (sceneId === "hall_main" && window.run.hall_medal_count >= 3 && !getFlag("side_butler_triggered")) {
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

    // 确保scenes对象存在
    window.scenes = window.scenes || {};
    // 获取场景对象
    const scene = window.scenes[sceneId];
    
    // 处理场景缺失情况
    if(!scene) {
        console.warn("Target scene missing:", sceneId);
        window.scenes[sceneId] = {
            desc: `厚重的铁门紧闭，上面布满奇异符号。\n你尝试推开，但纹丝不动。\n某种力量阻止了你继续深入……`,
            options: [{ text: "暂时离开", target: "hall_main" }]
        };
        setTimeout(() => renderScene(sceneId), 0);
        return;
    }

    // 处理占位场景：自动引导回安全位置
    if (isPlaceholderScene(scene)) {
        const fallbackTarget = window.scenes["hall_main"] ? "hall_main" : "title";
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
        const n = typeof window.run.flags.brutal_count === "number" ? window.run.flags.brutal_count : 0;
        window.run.flags.brutal_count = n + 1;
    }
    
    // 记录游戏开始时间（用于速度成就）
    if ((sceneId === "opening_studio" || sceneId === "opening_studio_ng_plus" || sceneId === "opening_gate") && !window.run.run_started_at) {
        window.run.run_started_at = Date.now();
    }
    
    // 执行自动存档
    const lowerSceneId = String(sceneId || "").toLowerCase();
    const shouldSkipAutoSave =
        lowerSceneId === "title" ||
        lowerSceneId.startsWith("ending_") ||
        /(trap|death|dead|poison|explosion|fail|game_over|bad_end|fall)/.test(lowerSceneId);
    
    window.run.current_scene_id = sceneId;
    if (!shouldSkipAutoSave) {
        window.saveState(window.rootState);
        if (typeof window.showToast === "function") {
            window.showToast("自动存档成功 💾");
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
        let prevMedalCount = window.run.last_hall_medal_count || 0;
        if (window.run.hall_medal_count > prevMedalCount) {
            let transitionId = "sys_room_exit_transition";
            window.scenes[transitionId] = {
                desc: "你将刚刚获得的徽章小心翼翼地收好，长舒了一口气。\n伴随着沉重的锁舌闭合声，这扇门在你身后缓缓关上，你再次回到了冰冷的大厅，但你的心境已经不再相同。",
                options: [{ text: "继续探索大厅", target: "hall_main" }]
            };
            window.run.last_hall_medal_count = window.run.hall_medal_count;
            renderScene(transitionId);
            return;
        }
        window.run.last_hall_medal_count = window.run.hall_medal_count;
    }
    
    const locationNameEl = document.getElementById("location-name");
    if (locationNameEl) 
        {
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
        if (window.run.hall_medal_count >= 5) {
            dynamicDesc += "\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]";
        } else if (window.run.hall_medal_count >= 3) {
            dynamicDesc += "\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]";
        }
        
        // 渲染简易地图
        const rFmt = (name, possibleItems) => {
            const itemsList = Array.isArray(possibleItems) ? possibleItems : [possibleItems];
            if (window.run.items.some(i => itemsList.some(pat => i.includes(pat)))) {
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
    const achMsg = window.checkAchievements();
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

        // 为庄园状态简图中的房间添加点击事件
        setTimeout(() => {
            const roomElements = storyElement.querySelectorAll('span');
            roomElements.forEach(element => {
                const text = element.textContent;
                if (text.includes('画室')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('studio_entry');
                } else if (text.includes('最深处的卧室')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('bedroom_entry');
                } else if (text.includes('音乐室')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('musicroom_entry');
                } else if (text.includes('大厅')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('hall_main');
                } else if (text.includes('温室花房')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('greenhouse_entry');
                } else if (text.includes('书房/图书馆')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('library_entry');
                } else if (text.includes('钟楼')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('clocktower_entry');
                } else if (text.includes('地下室')) {
                    element.style.cursor = 'pointer';
                    element.onclick = () => renderScene('basement_entry');
                }
            });
        }, 100);

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
                                if (typeof window.showToast === "function") {
                                    window.showToast("最多只能选择 " + (scene.combine.maxSelect || 2) + " 个物品进行组合。");
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
                        window.addItem(scene.combine.result);
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

            options.push({ text: "重新挑战", target: roomEntry });
            options.push({ text: "返回大厅", target: "hall_main" });
        }

        // 渲染选项按钮
        options.forEach((option) => {
            // 检查选项条件
            if (option.cond) {
                let conditionMet = true;
                for (const cond of option.cond) {
                    if (cond.startsWith("hasItem:")) {
                        const item = cond.substring(8);
                        if (!hasItem(item)) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("notItem:")) {
                        const item = cond.substring(8);
                        if (hasItem(item)) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("hasClue:")) {
                        const clue = cond.substring(8);
                        if (!window.run.clues.includes(clue)) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("notClue:")) {
                        const clue = cond.substring(8);
                        if (window.run.clues.includes(clue)) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("hasEndings:")) {
                        const count = parseInt(cond.substring(10));
                        if ((window.profile.endings_reached || []).length < count) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond === "hasAutoSave") {
                        if (!window.hasAutoSave) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond === "hasMedals") {
                        if ((window.run.medals || []).length === 0) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("medalCount:")) {
                        const count = parseInt(cond.substring(11));
                        if ((window.run.hall_medal_count || 0) < count) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("flag:")) {
                        const flag = cond.substring(5);
                        if (!getFlag(flag)) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("notFlag:")) {
                        const flag = cond.substring(8);
                        if (getFlag(flag)) {
                            conditionMet = false;
                            break;
                        }
                    } else if (cond.startsWith("getFlag:")) {
                        const flag = cond.substring(8);
                        if (!getFlag(flag)) {
                            conditionMet = false;
                            break;
                        }
                    }
                }
                if (!conditionMet) {
                    return;
                }
            }

            const btn = document.createElement("button");
            btn.className = "option-btn";
            
            // 检查选项是否已访问
            const optionKey = window.run.current_scene_id + "->" + option.target;
            if (window.profile.visited_options && window.profile.visited_options[optionKey]) {
                btn.classList.add("visited-option");
            }
            
            btn.innerHTML = option.text;
            btn.onclick = () => {
                if (option.effectMsg) {
                    const msgBox = document.createElement("div");
                    msgBox.className = "system-message";
                    msgBox.innerText = option.effectMsg;
                    storyElement.appendChild(msgBox);
                    
                    const gameContainer = document.getElementById("game-container");
                    if (gameContainer) {
                        gameContainer.scrollTop = gameContainer.scrollHeight;
                    }
                }
                
                renderScene(option.target);
            };
            
            optionsContainer.appendChild(btn);
        });
    });
}


// 导出全局渲染函数
window.renderScene = renderScene;