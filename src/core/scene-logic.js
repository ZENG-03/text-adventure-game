import { useGameStore } from '../store/gameStore'

export function evaluateCondition(condStr) {
    if (!condStr) return true;
    
    const store = useGameStore();
    const parts = condStr.split(':');
    const type = parts[0];
    const target = parts.length > 1 ? parts[1].trim() : '';

    switch(type) {
        case 'hasItem': return store.run.items.includes(target);
        case 'notItem': return !store.run.items.includes(target);
        case 'hasClue': return store.run.clues.includes(target);
        case 'getFlag':
        case 'flag': return store.run.flags[target] === true;
        case 'notFlag': return store.run.flags[target] !== true;
        case 'medalCount': return store.run.medals.length >= parseInt(target);          case 'hasEndings': return store.profile.achievements.length >= parseInt(target);        case 'hasAutoSave': return localStorage.getItem('adventure_save') !== null;
        default:
            console.warn(`Unknown condition type: ${type}`);
            return false;
    }
}

export function evaluateConditions(condArray) {
    if (!condArray || condArray.length === 0) return true;
    return condArray.every(cond => evaluateCondition(cond));
}

export function executeEffect(effStr) {
    const store = useGameStore();
    let msg = "";
    
    // allow literal JS method mapping from legacy code if needed
    if (effStr.startsWith("run:")) {
        console.warn("Running legacy embedded scripts via string is not recommended.");
        return msg;
    }

    const parts = effStr.split(':');
    const type = parts[0];
    const target = parts.length > 1 ? parts[1].trim() : '';

    switch(type) {
        case 'gainItem':
            if (!store.run.items.includes(target)) {
                store.run.items.push(target);
                store.autoSync();
                msg += `<div class="system-message">【获得物品】：${target}</div>`;
            }
            break;
        case 'removeItem':
            if (store.run.items.includes(target)) {
                const index = store.run.items.indexOf(target);
                store.run.items.splice(index, 1);
                store.autoSync();
                msg += `<div class="system-message danger-message">【失去物品】：${target}</div>`;
            }
            break;
        case 'gainClue':
            if (!store.run.clues.includes(target)) {
                store.run.clues.push(target);
                store.autoSync();
                msg += `<div class="system-message clue-message">【获得线索】：${target}</div>`;
            }
            break;
        case 'setFlag':
            store.run.flags[target] = true;
            store.autoSync();
            break;
        case 'clearFlag':
            store.run.flags[target] = false;
            store.autoSync();
            break;
        case 'addMedal':
            if (!store.run.medals.includes(target)) {
                store.run.medals.push(target);
                store.autoSync();
                msg += `<div class="system-message medal-message">【获得奖章】：${target}</div>`;
            }
            break;
        case 'markEnding':
            store.addEnding(target);
            msg += `<div class="system-message ending-message">【结局达成】：${target}</div>`;
            break;
        default:
            console.warn(`Unknown effect type: ${type}`);
    }
    
    return msg;
}

export function executeEffects(effsArray) {
    if (!effsArray || effsArray.length === 0) return "";
    let totalMsg = "";
    effsArray.forEach(eff => {
        totalMsg += executeEffect(eff);
    });
    return totalMsg;
}
