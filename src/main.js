/**
 * 游戏主入口模块
 * 
 * 该模块负责整合所有游戏模块，包括：
 * - 游戏状态管理
 * - 场景渲染
 * - 数据存储
 * - 游戏初始化
 */

// 导入游戏模块
import { loadState, saveState } from './data/state-store.js';
import { renderScene } from './ui/scene-renderer.js';
import * as gameState from './core/game-state.js';

// 游戏全局设置
window.gameSettings = {
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
// 为globalState添加字段别名，兼容驼峰命名
Object.defineProperty(window.globalState, 'endingsReached', {
    get: () => window.profile.endings_reached,
    set: (val) => { window.profile.endings_reached = val; },
    enumerable: true
});
Object.defineProperty(window.globalState, 'playCount', {
    get: () => window.profile.play_count,
    set: (val) => { window.profile.play_count = val; },
    enumerable: true
});
window.gameState = window.run;
window.rootState = rootState;

// 导出全局函数
window.loadState = loadState;
window.saveState = saveState;
window.renderScene = renderScene;

// 游戏加载函数
window.loadGame = function() {
    try {
        const saved = localStorage.getItem('adventure_save');
        if (saved) {
            const parsed = JSON.parse(saved);
            rootState = parsed;
            window.profile = rootState.profile;
            window.run = rootState.run;
            window.globalState = window.profile;
            window.gameState = window.run;
            window.rootState = rootState;
            
            // 跳转到保存时的场景
            const sceneId = rootState.run.current_scene_id || 'title';
            renderScene(sceneId);
        } else {
            renderScene('title');
        }
    } catch (e) {
        console.error('Failed to load game:', e);
        renderScene('title');
    }
};

// 检查是否有自动存档
window.hasAutoSave = function() {
    try {
        const saved = localStorage.getItem('adventure_save');
        return !!saved;
    } catch (e) {
        return false;
    }
};

// 显示提示框
window.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    toast.style.animation = 'fadeIn 0.3s ease-in-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
};

// 显示物品详情弹窗
window.showItemDetails = function(itemName, description) {
    const popup = document.createElement('div');
    popup.className = 'item-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.background = 'rgba(0, 0, 0, 0.9)';
    popup.style.color = 'white';
    popup.style.borderRadius = '10px';
    popup.style.zIndex = '1000';
    popup.style.maxWidth = '80%';
    popup.style.maxHeight = '80%';
    popup.style.overflow = 'auto';
    
    const title = document.createElement('h3');
    title.innerText = itemName;
    title.style.marginTop = '0';
    title.style.color = '#d4af37';
    
    const desc = document.createElement('p');
    desc.innerText = description;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '关闭';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.padding = '5px 15px';
    closeBtn.style.background = '#444';
    closeBtn.style.color = 'white';
    closeBtn.style.border = '1px solid #666';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        document.body.removeChild(popup);
    };
    
    popup.appendChild(title);
    popup.appendChild(desc);
    popup.appendChild(closeBtn);
    
    document.body.appendChild(popup);
};

// 物品描述映射
const ITEM_DESCRIPTIONS = {
    '起始徽章': '一枚刻有庄园标志的徽章，象征着你的冒险开始。',
    '智慧徽章': '图书馆谜题的奖励，代表着知识的力量。',
    '旋律徽章': '音乐室谜题的奖励，蕴含着和谐的力量。',
    '生命徽章': '温室谜题的奖励，象征着生命的活力。',
    '色彩徽章': '画室谜题的奖励，代表着创造力。',
    '深渊徽章': '地下室谜题的奖励，蕴含着神秘的力量。',
    '时空徽章': '钟楼谜题的奖励，象征着时间的智慧。',
    '机械齿轮': '启动管风琴的关键道具。',
    '调音扳手': '用于校准钢琴的工具。',
    '七色花苞': '温室中发现的特殊花苞。',
    '长柄夹': '用于安全地夹取物品的工具。',
    '古树血提取剂': '用于提取古树精华的药剂。',
    '七色花琥珀': '蕴含着生命力量的琥珀。',
    '七色神秘颜料': '用于在镜面上作画的特殊颜料。',
    '符文石': '地下室发现的古老符文石。',
    '齿轮钥匙': '用于调校钟楼的特殊钥匙。'
};

// 显示物品弹窗
window.showItemPopup = function(itemName) {
    const desc = ITEM_DESCRIPTIONS[itemName] || '未详细描述的物品';
    window.showItemDetails(itemName, desc);
};

// 初始化游戏
function initGame() {
    // 检查 DOM 是否加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startGame);
    } else {
        startGame();
    }
}

// 启动游戏
function startGame() {
    // 初始渲染标题场景
    renderScene('title');
}

// 导出初始化函数
export { initGame };

// 自动初始化游戏
if (typeof window !== 'undefined') {
    initGame();
}

// 导航按钮事件处理函数

/**
 * 返回大厅
 */
window.returnToHall = function() {
    renderScene('hall_main');
};

/**
 * 切换成就面板显示
 */
window.toggleAchievements = function() {
    const achievementPanel = document.getElementById('achievement-panel');
    const overlay = document.getElementById('overlay');
    
    if (achievementPanel.style.display === 'block') {
        achievementPanel.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        achievementPanel.style.display = 'block';
        overlay.style.display = 'block';
        // 更新成就数据
        updateAchievementPanel();
    }
};

/**
 * 显示提示
 */
window.showHint = function() {
    const currentScene = window.run.current_scene_id;
    if (!currentScene) {
        alert('当前场景未找到，无法提供提示');
        return;
    }
    
    // 初始化hint_levels对象
    if (!window.run.hint_levels) {
        window.run.hint_levels = {};
    }
    
    const hintLevel = window.run.hint_levels[currentScene] || 0;
    
    // 从hints.json加载提示
    fetch('src/data/hints.json')
        .then(response => response.json())
        .then(data => {
            let sceneHints = data[currentScene];
            
            // 如果当前场景没有提示，使用默认提示
            if (!sceneHints || sceneHints.length === 0) {
                sceneHints = data.default || [];
            }
            
            if (sceneHints.length === 0) {
                alert('当前场景暂无提示');
                return;
            }
            
            // 对于大厅场景，根据游戏进度显示不同的提示
            if (currentScene === 'hall_main') {
                const medalCount = window.run.hall_medal_count || 0;
                let progressHint = '';
                
                if (medalCount === 0) {
                    progressHint = '你还没有获得任何徽章，尝试探索不同的房间。';
                } else if (medalCount < 7) {
                    progressHint = `你已经获得了 ${medalCount} 枚徽章，还需要 ${7 - medalCount} 枚才能开启密室。`;
                } else {
                    progressHint = '你已经获得了所有徽章，可以尝试开启中央密室了。';
                }
                
                // 显示进度提示和当前等级的提示
                const hint = sceneHints[hintLevel % sceneHints.length];
                alert(`【进度提示】：${progressHint}\n【提示】：${hint}`);
            } else {
                // 对于其他场景，显示当前等级的提示
                if (hintLevel >= sceneHints.length) {
                    alert('已经没有更多提示了');
                    return;
                }
                
                const hint = sceneHints[hintLevel];
                alert(`【提示】：${hint}`);
            }
            
            // 增加提示等级
            window.run.hint_levels[currentScene] = hintLevel + 1;
        })
        .catch(error => {
            console.error('加载提示失败:', error);
            alert('提示功能暂时不可用');
        });
};

/**
 * 切换设置面板显示
 */
window.toggleSettings = function() {
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    
    if (settingsPanel.style.display === 'block') {
        settingsPanel.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        settingsPanel.style.display = 'block';
        overlay.style.display = 'block';
    }
};

/**
 * 切换背包面板显示
 */
window.toggleInventory = function() {
    const inventoryPanel = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    
    if (inventoryPanel.style.display === 'block') {
        inventoryPanel.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        inventoryPanel.style.display = 'block';
        overlay.style.display = 'block';
        // 更新背包数据
        updateInventoryPanel();
    }
};

/**
 * 关闭所有面板
 */
window.closePanels = function() {
    const panels = ['achievement-panel', 'inventory-panel', 'settings-panel'];
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = 'none';
        }
    });
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
};

/**
 * 更新成就面板
 */
function updateAchievementPanel() {
    const achTotal = document.getElementById('ach-total');
    const achEndingCount = document.getElementById('ach-ending-count');
    const achNgCount = document.getElementById('ach-ng-count');
    const achList = document.getElementById('ach-list');
    
    if (achTotal) {
        achTotal.textContent = window.profile.achievements ? window.profile.achievements.length : 0;
    }
    
    if (achEndingCount) {
        achEndingCount.textContent = window.profile.endings_reached ? window.profile.endings_reached.length : 0;
    }
    
    if (achNgCount) {
        achNgCount.textContent = window.profile.play_count || 0;
    }
    
    if (achList) {
        if (window.profile.achievements && window.profile.achievements.length > 0) {
            achList.innerHTML = window.profile.achievements.map(ach => 
                `<div class="achievement">${ach}</div>`
            ).join('');
        } else {
            achList.innerHTML = '<span class="empty-text">暂无成就</span>';
        }
    }
}

/**
 * 更新背包面板
 */
function updateInventoryPanel() {
    const medalCount = document.getElementById('medal-count');
    const invMedals = document.getElementById('inv-medals');
    const invItems = document.getElementById('inv-items');
    const invClues = document.getElementById('inv-clues');
    
    if (medalCount) {
        medalCount.textContent = window.run.medals ? window.run.medals.length : 0;
    }
    
    if (invMedals) {
        if (window.run.medals && window.run.medals.length > 0) {
            invMedals.innerHTML = window.run.medals.map(medal => 
                `<span class="medal">${medal}</span>`
            ).join(' ');
        } else {
            invMedals.textContent = '无';
        }
    }
    
    if (invItems) {
        if (window.run.items && window.run.items.length > 0) {
            invItems.innerHTML = window.run.items.map(item => 
                `<span class="inv-item">${item}</span>`
            ).join(' ');
        } else {
            invItems.textContent = '无';
        }
    }
    
    if (invClues) {
        if (window.run.clues && window.run.clues.length > 0) {
            invClues.innerHTML = window.run.clues.map(clue => 
                `<span class="inv-item">${clue}</span>`
            ).join(' ');
        } else {
            invClues.textContent = '无';
        }
    }
}

// 应用设置
window.applySettings = function() {
    const fontSize = document.getElementById('setting-fontsize').value;
    const typeSpeed = document.getElementById('setting-typespeed').value;
    const noAnim = document.getElementById('setting-noanim').checked;
    const brightness = document.getElementById('setting-brightness').value;
    
    document.getElementById('fontsize-val').textContent = fontSize + 'px';
    document.getElementById('typespeed-val').textContent = typeSpeed + 'ms';
    document.getElementById('brightness-val').textContent = brightness + '%';
    
    window.gameSettings.fontSize = parseInt(fontSize);
    window.gameSettings.typeSpeed = parseInt(typeSpeed);
    window.gameSettings.noAnim = noAnim;
    
    // 应用亮度设置
    document.body.style.filter = `brightness(${brightness}%)`;
};