import { easterEggs } from '../data/easterEggs';

export function checkEasterEgg(input, store) {
  const normalized = input.trim().toLowerCase();
  const egg = easterEggs.find(e => e.keyword === normalized);
  if (egg) {
    store.showToast(`✨ 彩蛋触发：${egg.displayDate} ✨`);
    store.addClue(`你输入了特殊日期：${egg.displayDate}，${egg.message}`);
    if (egg.achievement) store.unlockAchievement(egg.achievement);
    if (egg.rewardItem) store.addItem(egg.rewardItem);
    return true;
  }
  return false;
}

export function validateWithEasterEgg(ans, store) {
  const lowerAns = ans.trim().toLowerCase();
  // 检查彩蛋
  const egg = easterEggs.find(e => e.keyword === lowerAns);
  if (egg) return egg.id;
  return false;
}