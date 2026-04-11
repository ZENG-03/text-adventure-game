import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { scenesMap } from './store/gameStore'
import { getAllSceneIds, loadScene } from './data/scenes/index.js'

async function init() {
    const pinia = createPinia()
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