import { renderScene } from './scene-renderer.js';

// 显示提示框
export function showToast(message) {
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
            if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 显示物品详情弹窗
export function showItemDetails(itemName, description) {
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
    title.style.textAlign = 'center';
    
    const imgDiv = document.createElement('div');
    imgDiv.style.textAlign = 'center';
    imgDiv.style.margin = '15px 0';
    imgDiv.innerHTML = `<img src="images/items/${itemName}.png" style="max-width:200px; max-height:200px; border:1px solid #555; background:#111; padding:5px; border-radius:4px;" onerror="this.style.display='none'">`;
    
    const desc = document.createElement('p');
    desc.innerText = description;
    desc.style.lineHeight = '1.6';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '关闭';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.padding = '5px 15px';
    closeBtn.style.background = '#444';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '5px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        if (popup.parentNode) document.body.removeChild(popup);
    };
    
    popup.appendChild(title);
    popup.appendChild(imgDiv);
    popup.appendChild(desc);
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);
}

// 返回大厅
export function returnToHall() {
    renderScene('hall_main');
}

// 切换成就显示
export function toggleAchievements() {
    const achievementPanel = document.getElementById('achievement-panel');
    const overlay = document.getElementById('overlay');
    if (achievementPanel.style.display === 'none') {
        updateAchievementPanel();
        achievementPanel.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        achievementPanel.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// 切换设置显示
export function toggleSettings() {
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        settingsPanel.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// 切换背包显示
export function toggleInventory() {
    const inventoryPanel = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    if (inventoryPanel.style.right === '-300px' || !inventoryPanel.style.right) {
        updateInventoryPanel();
        inventoryPanel.style.right = '0';
        overlay.style.display = 'block';
    } else {
        inventoryPanel.style.right = '-300px';
        overlay.style.display = 'none';
    }
}

// 物品组合系统
export function combineItems(item1, item2) {
    // 物品组合逻辑
    const combinations = {
        '七色花苞+古树血提取剂': '生命精华',
        '机械齿轮+调音扳手': '精密齿轮',
        '夜莺长笛+调音扳手': '调好的长笛',
        '起始徽章+旋律徽章': '双徽章',
        '生命徽章+色彩徽章': '自然之章'
    };
    
    const key1 = `${item1}+${item2}`;
    const key2 = `${item2}+${item1}`;
    
    if (combinations[key1]) {
        return combinations[key1];
    } else if (combinations[key2]) {
        return combinations[key2];
    }
    return null;
}

// 显示物品组合界面
export function showItemCombine() {
    const popup = document.createElement('div');
    popup.className = 'combine-popup';
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
    title.innerText = '物品组合';
    title.style.marginTop = '0';
    title.style.color = '#d4af37';
    title.style.textAlign = 'center';
    
    const items = window.run.items || [];
    const itemSelect1 = document.createElement('select');
    itemSelect1.id = 'combine-item-1';
    itemSelect1.style.width = '100%';
    itemSelect1.style.padding = '8px';
    itemSelect1.style.marginBottom = '10px';
    itemSelect1.style.background = '#2a2a2a';
    itemSelect1.style.color = 'white';
    itemSelect1.style.border = '1px solid #444';
    
    const itemSelect2 = document.createElement('select');
    itemSelect2.id = 'combine-item-2';
    itemSelect2.style.width = '100%';
    itemSelect2.style.padding = '8px';
    itemSelect2.style.marginBottom = '15px';
    itemSelect2.style.background = '#2a2a2a';
    itemSelect2.style.color = 'white';
    itemSelect2.style.border = '1px solid #444';
    
    items.forEach(item => {
        const option1 = document.createElement('option');
        option1.value = item;
        option1.textContent = item;
        itemSelect1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = item;
        option2.textContent = item;
        itemSelect2.appendChild(option2);
    });
    
    const combineBtn = document.createElement('button');
    combineBtn.innerText = '组合物品';
    combineBtn.style.marginTop = '10px';
    combineBtn.style.padding = '10px 20px';
    combineBtn.style.background = '#444';
    combineBtn.style.color = 'white';
    combineBtn.style.border = 'none';
    combineBtn.style.borderRadius = '5px';
    combineBtn.style.cursor = 'pointer';
    combineBtn.onclick = () => {
        const item1 = itemSelect1.value;
        const item2 = itemSelect2.value;
        
        if (item1 && item2 && item1 !== item2) {
            const result = combineItems(item1, item2);
            if (result) {
                // 移除原物品
                window.run.items = window.run.items.filter(item => item !== item1 && item !== item2);
                // 添加新物品
                window.run.items.push(result);
                showToast(`成功组合 ${item1} 和 ${item2}，获得 ${result}！`);
                // 更新背包
                updateInventoryPanel();
                // 关闭弹窗
                if (popup.parentNode) document.body.removeChild(popup);
            } else {
                showToast('这两个物品无法组合');
            }
        } else {
            showToast('请选择两个不同的物品');
        }
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '关闭';
    closeBtn.style.marginTop = '10px';
    closeBtn.style.padding = '10px 20px';
    closeBtn.style.background = '#444';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '5px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        if (popup.parentNode) document.body.removeChild(popup);
    };
    
    popup.appendChild(title);
    popup.appendChild(document.createElement('br'));
    popup.appendChild(document.createTextNode('物品 1:'));
    popup.appendChild(document.createElement('br'));
    popup.appendChild(itemSelect1);
    popup.appendChild(document.createElement('br'));
    popup.appendChild(document.createTextNode('物品 2:'));
    popup.appendChild(document.createElement('br'));
    popup.appendChild(itemSelect2);
    popup.appendChild(document.createElement('br'));
    popup.appendChild(combineBtn);
    popup.appendChild(document.createElement('br'));
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);
}

// 关闭所有面板
export function closePanels() {
    const panels = ['achievement-panel', 'inventory-panel', 'settings-panel'];
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (panel) {
            if (panelId === 'inventory-panel') {
                panel.style.right = '-300px';
            } else {
                panel.style.display = 'none';
            }
        }
    });
    document.getElementById('overlay').style.display = 'none';
}

// 应用设置
export function applySettings() {
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
    
    document.body.style.filter = `brightness(${brightness}%)`;
}

// 暴露为全局API给 index.html onClick 或其它处使用
window.showToast = showToast;
window.showItemDetails = showItemDetails;
window.returnToHall = returnToHall;
window.toggleAchievements = toggleAchievements;
window.toggleSettings = toggleSettings;
window.toggleInventory = toggleInventory;
window.closePanels = closePanels;
window.applySettings = applySettings;
window.toggleCharacters = toggleCharacters;
window.closeItemDetails = closeItemDetails;
window.showHint = showHint;
window.showItemCombine = showItemCombine;

// 切换人物图鉴显示
export function toggleCharacters() {
    const characterPanel = document.getElementById('character-panel');
    const overlay = document.getElementById('overlay');
    if (characterPanel.style.display === 'none' || !characterPanel.style.display) {
        updateCharacterPanel();
        characterPanel.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        characterPanel.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// 关闭物品详情弹窗
export function closeItemDetails() {
    const itemModal = document.getElementById('item-modal');
    if (itemModal) {
        itemModal.style.display = 'none';
    }
}

// 显示提示
export function showHint() {
    const currentScene = window.run.current_scene_id;
    if (!currentScene) {
        showToast('当前场景未找到，无法提供提示');
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
                showToast('当前场景暂无提示');
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
                showToast(`【进度提示】：${progressHint}\n【提示】：${hint}`);
            } else {
                // 对于其他场景，显示当前等级的提示
                if (hintLevel >= sceneHints.length) {
                    showToast('已经没有更多提示了');
                    return;
                }
                
                const hint = sceneHints[hintLevel];
                showToast(`【提示】：${hint}`);
            }
            
            // 增加提示等级
            window.run.hint_levels[currentScene] = hintLevel + 1;
        })
        .catch(error => {
            console.error('加载提示失败:', error);
            showToast('提示功能暂时不可用');
        });
}

// 依赖内部函数的逻辑
function updateAchievementPanel() {
    if (!window.run || !window.profile) return;
    const achTotal = document.getElementById('ach-total');
    const achEndingCount = document.getElementById('ach-ending-count');
    const achNgCount = document.getElementById('ach-ng-count');
    
    achEndingCount.textContent = window.profile.endings_reached ? window.profile.endings_reached.length : 0;
    achNgCount.textContent = window.profile.play_count || 0;
    achTotal.textContent = (window.profile.endings_reached ? window.profile.endings_reached.length : 0);
    
    const achList = document.getElementById('ach-list');
    achList.innerHTML = '';
    
    if (window.profile.endings_reached && window.profile.endings_reached.length > 0) {
        window.profile.endings_reached.forEach(ending => {
            const item = document.createElement('div');
            item.className = 'ach-item';
            item.innerHTML = `<div class='ach-icon'>🏆</div><div class='ach-info'><div class='ach-name'>${ending}</div><div class='ach-desc'>已解锁该结局</div></div>`;
            achList.appendChild(item);
        });
    } else {
        achList.innerHTML = '<span class="empty-text">暂无成就</span>';
    }
}

function updateInventoryPanel() {
    if (!window.run) return;
    const medalCount = document.getElementById('medal-count');
    const invMedals = document.getElementById('inv-medals');
    const invItems = document.getElementById('inv-items');
    const invClues = document.getElementById('inv-clues');
    
    medalCount.textContent = window.run.medals ? window.run.medals.length : 0;
    
    if (window.run.medals && window.run.medals.length > 0) {
        invMedals.innerHTML = window.run.medals.map(m => `<span class='inv-item medal'>${m}</span>`).join('');
    } else {
        invMedals.innerHTML = '<span class="empty-text">无</span>';
    }
    
    if (window.run.items && window.run.items.length > 0) {
        invItems.innerHTML = window.run.items.map(i => `<div class="inv-item" onclick="showItemPopup('${i}')" style="display:flex; align-items:center; gap:8px; background:#2a2a2a; border:1px solid #444; border-radius:4px; padding:5px 10px; margin-bottom:8px; cursor:pointer;"><img src="images/items/${i}.png" style="width:24px; height:24px; object-fit:contain; border-radius:3px;" onerror="this.style.display='none'"> <span>${i}</span></div>`).join('');
    } else {
        invItems.innerHTML = '<span class="empty-text">无</span>';
    }
    
    if (window.run.clues && window.run.clues.length > 0) {
        invClues.innerHTML = window.run.clues.map(c => `<div class='clue-item'>· ${c}</div>`).join('');
    } else {
        invClues.innerHTML = '<span class="empty-text">无</span>';
    }
}

function updateCharacterPanel() {
    const charList = document.getElementById('char-list');
    const charCount = document.getElementById('char-count');
    
    // 人物数据
    const characters = [
        {
            name: '阿斯特·克劳利',
            role: '谜语馆主人',
            description: '庄园的主人，一个神秘的人物，似乎隐藏着许多秘密。',
            image: '谜语馆主人阿斯特·克劳利1.png'
        },
        {
            name: '奥尔德斯·克劳利',
            role: '管家',
            description: '庄园的管家，忠诚且神秘，似乎知道许多关于庄园的秘密。',
            image: '管家奥尔德斯·克劳利1.png'
        },
        {
            name: '伊莲娜·韦恩',
            role: '画中女子',
            description: '一幅画中的女子，似乎与庄园的历史有着密切的联系。',
            image: '画中女子伊莲娜·韦恩1.png'
        },
        {
            name: '埃莉诺·布莱克伍德',
            role: '制琴师',
            description: '一位才华横溢的制琴师，与音乐室有着不解之缘。',
            image: '制琴师埃莉诺·布莱克伍德1.png'
        },
        {
            name: '托马斯·赫胥黎',
            role: '地质学家',
            description: '一位专注的地质学家，对庄园的地下室有着浓厚的兴趣。',
            image: '地质学家托马斯·赫胥黎1.png'
        },
        {
            name: '塞拉斯·诺斯',
            role: '神秘访客',
            description: '一位神秘的访客，似乎与庄园的秘密有着某种联系。',
            image: '塞拉斯·诺斯.png'
        }
    ];
    
    charCount.textContent = `(${characters.length}/${characters.length})`;
    charList.innerHTML = '';
    
    characters.forEach(character => {
        const charCard = document.createElement('div');
        charCard.className = 'char-card';
        charCard.style.width = '150px';
        charCard.style.padding = '10px';
        charCard.style.background = '#2a2a2a';
        charCard.style.border = '1px solid #444';
        charCard.style.borderRadius = '8px';
        charCard.style.textAlign = 'center';
        
        charCard.innerHTML = `
            <div style="margin-bottom: 10px;">
                <img src="images/characters/${character.image}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid var(--accent-color);">
            </div>
            <h4 style="margin: 0; color: var(--accent-color);">${character.name}</h4>
            <p style="margin: 5px 0; font-size: 0.9em; color: #aaa;">${character.role}</p>
            <p style="margin: 10px 0; font-size: 0.8em; color: #bbb; line-height: 1.4;">${character.description}</p>
        `;
        
        charList.appendChild(charCard);
    });
}
