import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { scenesMap, useGameStore } from './store/gameStore'
import { getAllSceneIds, loadScene } from './data/scenes/index.js'

function registerLegacyGlobals(pinia) {
    setActivePinia(pinia)
    const getStore = () => useGameStore()

    const hasItem = (item) => getStore().run.items.includes(item)
    const hasClue = (clue) => getStore().run.clues.includes(clue)
    const getFlag = (flag) => !!getStore().run.flags[flag]
    const setFlag = (flag, value = true) => getStore().setFlag(flag, value)
    const addItem = (item) => getStore().addItem(item) || ''
    const removeItem = (item) => getStore().removeItem(item) || ''
    const addClue = (clue) => getStore().addClue(clue) || ''

    globalThis.hasItem = hasItem
    globalThis.hasClue = hasClue
    globalThis.getFlag = getFlag
    globalThis.setFlag = setFlag
    globalThis.addItem = addItem
    globalThis.removeItem = removeItem
    globalThis.addClue = addClue

    globalThis.StateAPI = {
        hasItem,
        hasClue,
        getFlag,
        setFlag,
        addItem,
        removeItem,
        addClue
    }

    Object.defineProperty(globalThis, 'gameState', {
        configurable: true,
        get() {
            return getStore().run
        }
    })
}

async function init() {
    const pinia = createPinia()
    registerLegacyGlobals(pinia)
    try {
        console.log('[Engine] Preloading all scenes...');
        const ids = getAllSceneIds();
        await Promise.all(ids.map(async id => {
            try {
                const scene = await loadScene(id);
                if (scene) {
                    scenesMap[id] = scene;
                }
            } catch (e) {
                console.warn(`[Engine] Skipped module scene: ${id}`);
            }
        }));

        try {
            const legacyScenes = await import('./data/game-scenes.js');
            if (legacyScenes && legacyScenes.default) {
                Object.assign(scenesMap, legacyScenes.default);
                console.log('[Engine] Merged extensive storyline from game-scenes.js');
            }
        } catch(e) {
            console.error('[Engine] Failed to load game-scenes.js', e);
        }

        console.log('[Engine] Loaded scenes dynamically.', Object.keys(scenesMap).length);
    } catch (e) {
        console.error('[Engine] Failed to load scenes dynamically', e);
    }
    const app = createApp(App)
    app.use(pinia)
    app.use(router)
    app.mount('#app')
}

init();