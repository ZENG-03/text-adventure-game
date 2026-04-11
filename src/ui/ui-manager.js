// 显示提示框
export function showToast(message) {
  // 现在使用store中的showToast方法，该方法已经使用Vue的方式实现
  import('../store/gameStore').then(({ useGameStore }) => {
    const store = useGameStore();
    store.showToast(message);
  });
}

// 显示物品详情弹窗
export function showItemDetails(itemName, description) {
  // 现在使用全局事件来触发ItemModal组件的显示
  // 这种方式可以与Vue组件通信，而不需要DOM操作
  const event = new CustomEvent('showItemDetails', {
    detail: { itemName, description }
  });
  window.dispatchEvent(event);
}

// 返回大厅
export function returnToHall() {
  // 现在使用store的selectOption方法，而不是直接调用renderScene
  import('../store/gameStore').then(({ useGameStore }) => {
    const store = useGameStore();
    store.selectOption('hall_main');
  });
}

// 切换成就显示
export function toggleAchievements() {
  // 现在使用全局事件来触发成就面板的显示
  const event = new CustomEvent('toggleAchievements');
  window.dispatchEvent(event);
}

// 切换设置显示
export function toggleSettings() {
  // 现在使用全局事件来触发设置面板的显示
  const event = new CustomEvent('toggleSettings');
  window.dispatchEvent(event);
}

// 切换背包显示
export function toggleInventory() {
  // 现在使用全局事件来触发背包面板的显示
  const event = new CustomEvent('toggleInventory');
  window.dispatchEvent(event);
}

// 物品组合系统
export function combineItems(item1, item2) {
  // 现在使用store的combineItems方法
  import('../store/gameStore').then(({ useGameStore }) => {
    const store = useGameStore();
    return store.combineItems(item1, item2);
  });
}

// 显示物品组合界面
export function showItemCombine() {
  // 现在使用全局事件来触发物品组合界面的显示
  const event = new CustomEvent('showItemCombine');
  window.dispatchEvent(event);
}

// 关闭所有面板
export function closePanels() {
  // 现在使用全局事件来关闭所有面板
  const event = new CustomEvent('closePanels');
  window.dispatchEvent(event);
}

// 应用设置
export function applySettings(settings) {
  // 现在使用store的方法来应用设置
  import('../store/gameStore').then(({ useGameStore }) => {
    const store = useGameStore();
    store.updateSettings(settings);
  });
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
  // 现在使用全局事件来触发人物图鉴面板的显示
  const event = new CustomEvent('toggleCharacters');
  window.dispatchEvent(event);
}

// 关闭物品详情弹窗
export function closeItemDetails() {
  // 现在使用全局事件来关闭物品详情弹窗
  const event = new CustomEvent('closeItemDetails');
  window.dispatchEvent(event);
}

// 显示提示
export function showHint() {
  // 现在使用store的showHint方法
  import('../store/gameStore').then(({ useGameStore }) => {
    const store = useGameStore();
    store.showHint();
  });
}

// 内部函数已被移除，所有功能现在通过Vue组件和store实现
