<template>
  <div class="game">
    <!-- 游戏头部 -->
    <header class="game-header">
      <div class="game-title">
        <h1>幽暗庄园的秘密</h1>
        <p>探索每个房间，寻找线索，解开谜题</p>
      </div>
      <div class="nav-buttons">
        <button class="nav-btn" @click="returnToHall">返回大厅</button>
        <button class="nav-btn" @click="toggleAchievements">成就</button>
        <button class="nav-btn" @click="showHint" style="color:#d4af37;">提示</button>
        <button class="nav-btn" @click="toggleSettings">设置</button>
        <button class="nav-btn" @click="showItemCombine">物品组合</button>
        <button class="nav-btn" @click="toggleCharacters">人物</button>
        <button class="nav-btn" @click="toggleInventory">背包</button>
      </div>
    </header>

    <!-- 游戏状态栏 -->
    <div class="status-bar">
      <span id="location-name">位置：{{ currentSceneName }}</span>
    </div>

    <!-- 游戏内容 -->
    <main class="game-content">
      <Transition name="fade" mode="out-in">
      <div :key="currentScene" class="scene-wrapper">
        <!-- 场景描述 -->
      <div class="story-text" v-html="sceneDesc"></div>

      <!-- 选项按钮 -->
      <div class="options-container">
        <button 
          v-for="(option, index) in availableOptions" 
          :key="index"
          class="option-btn"
          @click="selectOption(option.target)"
        >
          {{ option.text }}
        </button>
      </div>
          </div>
    </Transition>
    </main>

    <!-- 动态面板区 -->
    <Transition name="fade">
      <InventoryPanel v-if="uiState.inventory" @close="uiState.inventory = false" @show-item="showItemDetails" />
    </Transition>

    <Transition name="fade">
      <AchievementPanel v-if="uiState.achievements" @close="uiState.achievements = false" />
    </Transition>

    <Transition name="fade">
      <SettingsPanel v-if="uiState.settings" @close="uiState.settings = false" @sync-login="uiState.login = true" />
    </Transition>

    <Transition name="fade">
      <CharacterPanel v-if="uiState.characters" @close="uiState.characters = false" />
    </Transition>

    <Transition name="fade">
      <CombinePopup v-if="uiState.combine" @close="uiState.combine = false" />
    </Transition>

    <Transition name="fade">
      <ItemModal v-if="uiState.itemDetails" :selected-item="selectedItem" :item-description="itemDescription" @close="uiState.itemDetails = false" />
    </Transition>

    
    <!-- 登录注册弹窗 -->
    <Transition name="fade">
      <LoginModal v-if="uiState.login" @close="uiState.login = false" />
    </Transition>

    <!-- 遮罩层-->
    <Transition name="fade">
    <div class="overlay" v-if="overlayOpen" @click="closePanels"></div>
  </Transition>
  </div>
</template>

<script setup>
import { ref, shallowRef, reactive, computed, onMounted, watch } from 'vue'
import { useGameStore } from '../store/gameStore'
import { executeEffects, evaluateConditions } from '../core/scene-logic.js'
import { defineAsyncComponent } from 'vue'
const InventoryPanel = defineAsyncComponent(() => import('../components/InventoryPanel.vue'))
const AchievementPanel = defineAsyncComponent(() => import('../components/AchievementPanel.vue'))
const SettingsPanel = defineAsyncComponent(() => import('../components/SettingsPanel.vue'))
const CharacterPanel = defineAsyncComponent(() => import('../components/CharacterPanel.vue'))
const CombinePopup = defineAsyncComponent(() => import('../components/CombinePopup.vue'))
const ItemModal = defineAsyncComponent(() => import('../components/ItemModal.vue'))
const LoginModal = defineAsyncComponent(() => import('../components/LoginModal.vue'))

const basePath = import.meta.env.BASE_URL;

const gameStore = useGameStore()

// 游戏状态
const currentScene = ref('title')
const currentSceneName = ref('')
const sceneDesc = ref('')
  const availableOptions = shallowRef([])
// 面板状态（收敛管理）
const uiState = reactive({
  inventory: false,
  achievements: false,
  settings: false,
  characters: false,
  combine: false,
  itemDetails: false,
  login: false
})
const overlayOpen = computed(() => Object.values(uiState).some(v => v))


// 物品详情
const selectedItem = ref('')
const itemDescription = ref('')




// 生命周期
onMounted(() => {
  loadScene('title')
})

// 方法
const selectOption = (targetId) => {
    if (targetId) {
      if (targetId === 'system_load_auto') {
        gameStore.loadGame()
        loadScene(gameStore.run.current_scene_id || 'title')
        return
      }
      loadScene(targetId)
    }
  }

const loadScene = (sceneId) => {
    currentScene.value = sceneId
    if (sceneId !== 'title' && sceneId !== 'system_load_auto') {
      gameStore.run.current_scene_id = sceneId
      if (sceneId.startsWith('ending_') || sceneId === 'epilogue_true_end') {
        gameStore.addEnding(sceneId)
      }
    }
    const scene = gameStore.getScene(sceneId)
  if (scene) {
    currentSceneName.value = scene.name || sceneId
    let descHtml = typeof scene.desc === 'function' ? scene.desc(gameStore) : scene.desc

    // 执行场景进入特效（获取物品、进入特殊状态等），并将返回的文本追加到描述中
    if (scene.effs && scene.effs.length > 0) {
        const effectHtml = executeEffects(scene.effs)
        if (effectHtml) {
            descHtml += '\n' + effectHtml
        }
    }
    
    // 如果是大厅，则单独渲染动态描述与庄园简图
    if (sceneId === 'hall_main') {
        const medalCount = (gameStore.profile.achievements || []).filter(a => a.includes('徽章')).length || 0;
        if (medalCount >= 5) {
            descHtml += "\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]";
        } else if (medalCount >= 3) {
            descHtml += "\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]";
        }
        
        const rFmt = (name, possibleItems, targetId) => {
            const itemsList = Array.isArray(possibleItems) ? possibleItems : [possibleItems];
            const isExplored = gameStore.items.some(i => itemsList.some(pat => i.includes(pat)));
            const colorStyle = isExplored ? "color:#d4af37;text-shadow:0 0 5px #d4af37;font-weight:bold;" : "color:#777;";
            const text = isExplored ? `${name}(★已探索)` : `${name}(未探索)`;
            return `<span style="${colorStyle} cursor:pointer; text-decoration: underline;" onclick="window.handleMapClick('${targetId}')">${text}</span>`;
        };

        descHtml += `
<div style="background:rgba(0,0,0,0.5); border:1px solid #444; padding:10px; border-radius:5px; margin-top:20px; font-family:monospace; line-height:1.6;">
    <div style="color:#aaa; border-bottom:1px solid #444; padding-bottom:5px; margin-bottom:5px; font-weight:bold;">🗺️ 庄园状态简图</div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二楼：${rFmt("画室", ["色彩徽章", "橙色徽章"], 'studio_entry')} | ${rFmt("最深处的卧室", "彩虹徽章", 'bedroom_entry')}<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一楼：${rFmt("音乐室", ["旋律徽章", "翠绿徽章"], 'musicroom_entry')} | ${rFmt("大厅", "起始徽章", 'hall_main')} | ${rFmt("温室花房", ["生命徽章", "金色徽章"], 'greenhouse_entry')} | ${rFmt("书房/图书室", ["智慧徽章", "蓝宝石徽章"], 'library_entry')}<br>
      &nbsp;&nbsp;东侧附属建筑：${rFmt("钟楼", ["时空徽章", "红宝石徽章"], 'clocktower_entry')}<br>
      &nbsp;&nbsp;&nbsp;地下：${rFmt("地下室", ["深渊徽章", "紫色徽章"], 'basement_entry')}
</div>`;
    }
    
    // 渲染打字机效果并替换 \n
    sceneDesc.value = (descHtml || "").replace(/\\n/g, "<br>");
    
    // 过滤选项：兼容函数式 options、数组 options 以及旧剧本 condition/cond 写法
    const evaluatedOptions = typeof scene.options === 'function' ? scene.options(gameStore) : scene.options
    const rawOptions = Array.isArray(evaluatedOptions) ? evaluatedOptions : []
    availableOptions.value = rawOptions.filter((opt) => {
      if (!opt || typeof opt !== 'object') return false
      try {
        if (typeof opt.condition === 'function') {
          return !!opt.condition(gameStore)
        }
        if (Array.isArray(opt.cond)) {
          return evaluateConditions(opt.cond)
        }
        return true
      } catch (err) {
        console.warn('Skip invalid option condition:', err)
        return false
      }
    })
  }
}

// 暴露给全局以便 HTML onclick 能调用到
window.handleMapClick = selectOption;

const returnToHall = () => {
  loadScene('hall_main')
}

const togglePanel = (panelName) => {
  const current = uiState[panelName]
  closePanels()
  uiState[panelName] = !current
}

const toggleAchievements = () => togglePanel('achievements')
const toggleSettings = () => togglePanel('settings')
const toggleCharacters = () => togglePanel('characters')
const toggleInventory = () => togglePanel('inventory')

const showItemCombine = () => {
  closePanels()
  uiState.combine = true
}

const showHint = () => {
  gameStore.showHint(currentScene.value)
}

const showItemDetails = (item) => {
  closePanels()
  selectedItem.value = item
  itemDescription.value = gameStore.getItemDescription(item)
  uiState.itemDetails = true
}

const closePanels = () => {
  Object.keys(uiState).forEach(k => uiState[k] = false)
}

const handleCloudSyncLogin = () => {
    uiState.login = true;
}

</script>

<style>
.game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #333;
}

.game-title h1 {
  margin: 0;
  color: #d4af37;
}

.game-title p {
  margin: 5px 0 0 0;
  font-size: 0.9em;
  color: #aaa;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-btn {
  padding: 8px 15px;
  background-color: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background-color: rgba(212, 175, 55, 0.4);
}

.status-bar {
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #333;
}

.game-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.story-text {
  margin-bottom: 30px;
  line-height: 1.6;
  font-size: 1.1em;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  padding: 12px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-btn:hover {
  background-color: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

/* 面板样式 */
.inventory-panel,
.achievement-panel,
.settings-panel,
.character-panel {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: #2a2a2a;
  border-left: 2px solid #d4af37;
  padding: 20px;
  overflow-y: auto;
  
  z-index: 1000;
}

.achievement-panel,
.settings-panel,
.character-panel {
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  height: auto;
  max-height: 80vh;
  width: 80%;
  max-width: 500px;
  border: 2px solid #d4af37;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}

.inventory-panel h2,
.achievement-panel h2,
.settings-panel h2,
.character-panel h2 {
  color: #d4af37;
  margin-top: 0;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

.inventory-panel h3,
.achievement-panel h3,
.settings-panel h3 {
  color: #aaa;
  margin-bottom: 5px;
  font-size: 1em;
}

.inv-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 5px 10px;
  margin-bottom: 8px;
  cursor: pointer;
}

.inv-item img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 3px;
}

.clue-item {
  margin-bottom: 5px;
}

.empty-text {
  color: #666;
}

.sys-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #444;
  color: #ddd;
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
}

.sys-btn:hover {
  background-color: #555;
}

/* 物品组合界面 */
.combine-popup,
.item-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 10px;
  z-index: 1000;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  border: 2px solid #d4af37;
}

.combine-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group select {
  padding: 8px;
  background: #2a2a2a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  cursor: pointer;
}

/* 人物卡片 */
#char-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.char-card {
  width: 150px;
  padding: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  text-align: center;
}

.char-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #d4af37;
}

.char-card h4 {
  margin: 10px 0 5px 0;
  color: #d4af37;
}

.char-role {
  margin: 5px 0;
  font-size: 0.9em;
  color: #aaa;
}

.char-description {
  margin: 10px 0;
  font-size: 0.8em;
  color: #bbb;
  line-height: 1.4;
}

/* 设置*/
.setting-item {
  margin-bottom: 15px;
}

.setting-item input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

/* 成就*/
.achievement-stats {
  margin-bottom: 10px;
  color: #bbb;
}

.achievement-stats span {
  margin-left: 12px;
}

.ach-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.ach-icon {
  font-size: 1.5em;
}

.ach-name {
  font-weight: bold;
  color: #d4af37;
}

.ach-desc {
  font-size: 0.9em;
  color: #aaa;
}

/* 物品详情弹窗 */
.item-modal h3 {
  margin-top: 0;
  color: #d4af37;
  text-align: center;
}

.item-image {
  text-align: center;
  margin: 15px 0;
}

.item-image img {
  max-width: 150px;
  max-height: 150px;
  border: 1px solid #555;
  background: #111;
  padding: 5px;
  border-radius: 4px;
}

.item-modal p {
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Vue Transition CSS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


