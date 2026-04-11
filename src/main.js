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
            const scene = await loadScene(id);
            scenesMap[id] = scene;
        }));
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