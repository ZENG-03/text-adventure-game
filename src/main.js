import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { scenesMap } from './store/gameStore'

async function init() {
    const baseUrl = import.meta.env.BASE_URL || '/';
    try {
        const res = await fetch(baseUrl + 'scenes.json');
        const data = await res.json();
        Object.assign(scenesMap, data);
        console.log('[Engine] Loaded scenes from JSON.', Object.keys(data).length);
    } catch (e) {
        console.error('[Engine] Failed to load scenes.json', e);
    }
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
}

init();