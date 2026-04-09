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
    </main>

    <!-- 背包面板 -->
    <div class="inventory-panel" :style="{ right: inventoryOpen ? '0' : '-300px' }">
      <h2>侦探笔记</h2>
      <div>
        <h3>【已获徽章】 ({{ medalCount }}/7)</h3>
        <p id="inv-medals">
          <span v-for="(medal, index) in medals" :key="index" class="inv-item medal">{{ medal }}</span>
          <span v-if="medals.length === 0" class="empty-text">无</span>
        </p>

        <h3>【收集道具】</h3>
        <p id="inv-items">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            class="inv-item"
            @click="showItemDetails(item)"
          >
            <img :src="`${basePath}images/items/${item}.png`" :alt="item" onerror="this.style.display='none'">
            <span>{{ item }}</span>
          </div>
          <span v-if="items.length === 0" class="empty-text">无</span>
        </p>

        <h3>【掌握线索】</h3>
        <p id="inv-clues">
          <div v-for="(clue, index) in clues" :key="index" class="clue-item">· {{ clue }}</div>
          <span v-if="clues.length === 0" class="empty-text">无</span>
        </p>
      </div>
      <button class="sys-btn" @click="toggleInventory">关闭笔记</button>
    </div>

    <!-- 成就面板 -->
    <div class="achievement-panel" :style="{ display: achievementsOpen ? 'block' : 'none' }">
      <h2>成就墙</h2>
      <div class="achievement-stats">
        已解锁成就：<span id="ach-total">{{ achievementCount }}</span>
        <span>结局：<span id="ach-ending-count">{{ endingCount }}</span></span>
        <span>轮回：<span id="ach-ng-count">{{ playCount }}</span></span>
      </div>
      <div id="ach-list">
        <div v-for="(ending, index) in endings" :key="index" class="ach-item">
          <div class="ach-icon">🏆</div>
          <div class="ach-info">
            <div class="ach-name">{{ ending }}</div>
            <div class="ach-desc">已解锁该结局</div>
          </div>
        </div>
        <span v-if="endings.length === 0" class="empty-text">暂无成就</span>
      </div>
      <button class="sys-btn" @click="toggleAchievements">关闭成就墙</button>
    </div>

    <!-- 设置面板 -->
    <div class="settings-panel" :style="{ display: settingsOpen ? 'block' : 'none' }">
      <h2>设置</h2>
      <div class="setting-item">
        <label>字体大小：</label>
        <input type="range" id="setting-fontsize" min="14" max="24" v-model.number="fontSize" @input="applySettings">
        <span id="fontsize-val">{{ fontSize }}px</span>
      </div>
      <div class="setting-item">
        <label>打字机速度：</label>
        <input type="range" id="setting-typespeed" min="10" max="60" v-model.number="typeSpeed" @input="applySettings">
        <span id="typespeed-val">{{ typeSpeed }}ms</span>
      </div>
      <div class="setting-item">
        <label>关闭动画：</label>
        <input type="checkbox" id="setting-noanim" v-model="noAnim" @change="applySettings">
      </div>
      <div class="setting-item">
        <label>亮度：</label>
        <input type="range" id="setting-brightness" min="50" max="150" v-model.number="brightness" @input="applySettings">
        <span id="brightness-val">{{ brightness }}%</span>
      </div>
      <div class="setting-item">
        <label>云存档通讯：</label>
        <button class="sys-btn" @click="handleCloudSync" 
                :style="{ background: gameStore.isOnline ? '#4caf50' : '#d4af37', padding: '5px 10px', fontSize: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer', color: '#1a1a1a', marginLeft: '10px' }">
          {{ gameStore.isOnline ? '已连接云端 (点击强制拉取)' : '开启云同步' }}
        </button>
      </div>
      <button class="sys-btn" @click="toggleSettings">关闭设置</button>
    </div>

    <!-- 人物图鉴面板 -->
    <div class="character-panel" :style="{ display: charactersOpen ? 'block' : 'none' }">
      <h2>人物图鉴 <span id="char-count">({{ characters.length }}/{{ characters.length }})</span></h2>
      <div id="char-list">
        <div v-for="(character, index) in characters" :key="index" class="char-card">
          <div class="char-image">
            <img :src="`${basePath}images/characters/${character.image}`" :alt="character.name">
          </div>
          <h4>{{ character.name }}</h4>
          <p class="char-role">{{ character.role }}</p>
          <p class="char-description">{{ character.description }}</p>
        </div>
      </div>
      <button class="sys-btn" @click="toggleCharacters">关闭图鉴</button>
    </div>

    <!-- 物品组合界面 -->
    <div class="combine-popup" v-if="combineOpen">
      <h3>物品组合</h3>
      <div class="combine-form">
        <div class="form-group">
          <label>物品 1:</label>
          <select v-model="selectedItem1">
            <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>物品 2:</label>
          <select v-model="selectedItem2">
            <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
        <button class="btn-primary" @click="combineItems">组合物品</button>
        <button class="btn-secondary" @click="combineOpen = false">关闭</button>
      </div>
    </div>

    <!-- 物品详情弹窗 -->
    <div class="item-modal" v-if="itemDetailsOpen">
      <h3>{{ selectedItem }}</h3>
      <div class="item-image">
        <img :src="`${basePath}images/items/${selectedItem}.png`" :alt="selectedItem" onerror="this.style.display='none'">
      </div>
      <p>{{ itemDescription }}</p>
      <button class="sys-btn" @click="itemDetailsOpen = false">关闭</button>
    </div>

    
    <!-- 登录注册弹窗 -->
    <div class="login-modal" v-if="loginOpen" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a1a;border:2px solid #d4af37;padding:20px;border-radius:8px;z-index:9999;box-shadow:0 0 15px rgba(212,175,55,0.3);width:300px;color:#d4af37;">
      <h3 style="margin-top:0;text-align:center;">连接到云端档案室</h3>
      <div class="login-form">
        <div class="form-group" style="margin-bottom:10px;">
          <label style="display:block;margin-bottom:5px;">账号:</label>
          <input type="text" v-model="loginForm.username" placeholder="请输入用户名" style="width:100%;padding:8px;background:#2a2a2a;border:1px solid #555;color:#f0f0f0;box-sizing:border-box;">
        </div>
        <div class="form-group" style="margin-bottom:15px;">
          <label style="display:block;margin-bottom:5px;">密码:</label>
          <input type="password" v-model="loginForm.password" placeholder="请输入密码" style="width:100%;padding:8px;background:#2a2a2a;border:1px solid #555;color:#f0f0f0;box-sizing:border-box;">
        </div>
        <div class="modal-buttons" style="display:flex;gap:10px;justify-content:center;">
          <button class="sys-btn" style="flex:1;background:#2a2a2a;color:#d4af37;border:1px solid #d4af37;padding:5px;cursor:pointer;" @click="submitLogin">登录</button>
          <button class="sys-btn" style="flex:1;background:#2a2a2a;color:#d4af37;border:1px solid #d4af37;padding:5px;cursor:pointer;" @click="submitRegister">注册</button>
          <button class="sys-btn" style="flex:1;background:#2a2a2a;color:#d4af37;border:1px solid #d4af37;padding:5px;cursor:pointer;" @click="loginOpen = false">取消</button>
        </div>
      </div>
    </div>
\n    <!-- 遮罩层 -->
    <div class="overlay" v-if="overlayOpen" @click="closePanels"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '../store/gameStore'

const basePath = import.meta.env.BASE_URL;

const gameStore = useGameStore()

// 游戏状态
const currentScene = ref('title')
const sceneDesc = ref('')
const availableOptions = ref([])
const currentSceneName = ref('主界面')

// 面板状态
const inventoryOpen = ref(false)
const achievementsOpen = ref(false)
const settingsOpen = ref(false)
const charactersOpen = ref(false)
const combineOpen = ref(false)
const itemDetailsOpen = ref(false)
const overlayOpen = ref(false)
const loginOpen = ref(false)
const loginForm = ref({ username: '', password: '' })

// 物品组合
const selectedItem1 = ref('')
const selectedItem2 = ref('')

// 物品详情
const selectedItem = ref('')
const itemDescription = ref('')

// 游戏设置
const fontSize = ref(16)
const typeSpeed = ref(25)
const noAnim = ref(false)
const brightness = ref(100)

// 人物数据
const characters = ref([
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
])

// 计算属性
const items = computed(() => gameStore.items)
const clues = computed(() => gameStore.clues)
const medals = computed(() => gameStore.medals)
const medalCount = computed(() => gameStore.medals.length)
const achievementCount = computed(() => gameStore.endings.length)
const endingCount = computed(() => gameStore.endings.length)
const playCount = computed(() => gameStore.playCount)
const endings = computed(() => gameStore.endings)

// 生命周期
onMounted(() => {
  loadScene('title')
})

// 方法
const selectOption = (targetId) => {
  if (targetId) {
    loadScene(targetId)
  }
}

const loadScene = (sceneId) => {
  currentScene.value = sceneId
  const scene = gameStore.getScene(sceneId)
  if (scene) {
    currentSceneName.value = scene.name || sceneId
    let descHtml = typeof scene.desc === 'function' ? scene.desc() : scene.desc
    
    // 如果是大厅，则单独渲染动态描述与庄园简图
    if (sceneId === 'hall_main') {
        const medalCount = gameStore.achievements.filter(a => a.includes('徽章')).length || 0;
        if (medalCount >= 5) {
            descHtml += "\n[大厅发生了剧变：空气中弥漫着压抑的气息，中央密室的大门开始渗出微光。]";
        } else if (medalCount >= 3) {
            descHtml += "\n[大厅发生了变化：一些雕像的眼睛似乎在盯着你。]";
        }
        
        const rFmt = (name, possibleItems, targetId) => {
            const itemsList = Array.isArray(possibleItems) ? possibleItems : [possibleItems];
            const isExplored = gameStore.inventory.some(i => itemsList.some(pat => i.includes(pat)));
            const colorStyle = isExplored ? "color:#d4af37;text-shadow:0 0 5px #d4af37;font-weight:bold;" : "color:#777;";
            const text = isExplored ? `${name}(★已探索)` : `${name}(未探索)`;
            return `<span style="${colorStyle} cursor:pointer; text-decoration: underline;" onclick="window.handleMapClick('${targetId}')">${text}</span>`;
        };

        descHtml += `
<div style="background:rgba(0,0,0,0.5); border:1px solid #444; padding:10px; border-radius:5px; margin-top:20px; font-family:monospace; line-height:1.6;">
    <div style="color:#aaa; border-bottom:1px solid #444; padding-bottom:5px; margin-bottom:5px; font-weight:bold;">🗺️ 庄园状态简图</div>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二楼：${rFmt("画室", ["色彩徽章", "橙色徽章"], 'studio_entry')} | ${rFmt("最深处的卧室", "彩虹徽章", 'bedroom_entry')}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一楼：${rFmt("音乐室", ["旋律徽章", "翠绿徽章"], 'musicroom_entry')} | ${rFmt("大厅", "起始徽章", 'hall_main')} | ${rFmt("温室花房", ["生命徽章", "金色徽章"], 'greenhouse_entry')} | ${rFmt("书房/图书馆", ["智慧徽章", "蓝宝石徽章"], 'library_entry')}<br>
    &nbsp;&nbsp;东侧附属：${rFmt("钟楼", ["时空徽章", "红宝石徽章"], 'clocktower_entry')}<br>
    &nbsp;&nbsp;&nbsp;地下：${rFmt("地下室", ["深渊徽章", "紫色徽章"], 'basement_entry')}
</div>`;
    }
    
    // 渲染打字机效果并替换 \n
    sceneDesc.value = descHtml.replace(/\\n/g, "<br>");
    availableOptions.value = scene.options || []
  }
}

// 暴露给全局以便 HTML onclick 能调用到
window.handleMapClick = selectOption;

const returnToHall = () => {
  loadScene('hall_main')
}

const toggleAchievements = () => {
  achievementsOpen.value = !achievementsOpen.value
  overlayOpen.value = achievementsOpen.value
}

const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value
  overlayOpen.value = settingsOpen.value
}

const toggleCharacters = () => {
  charactersOpen.value = !charactersOpen.value
  overlayOpen.value = charactersOpen.value
}

const toggleInventory = () => {
  inventoryOpen.value = !inventoryOpen.value
  overlayOpen.value = inventoryOpen.value
}

const showItemCombine = () => {
  combineOpen.value = true
  overlayOpen.value = true
}

const showHint = () => {
  gameStore.showHint(currentScene.value)
}

const showItemDetails = (item) => {
  selectedItem.value = item
  itemDescription.value = gameStore.getItemDescription(item)
  itemDetailsOpen.value = true
  overlayOpen.value = true
}

const closePanels = () => {
  inventoryOpen.value = false
  achievementsOpen.value = false
  settingsOpen.value = false
  charactersOpen.value = false
  combineOpen.value = false
  itemDetailsOpen.value = false
  overlayOpen.value = false
}

const handleCloudSync = () => {
  if (!gameStore.isOnline) {
    loginOpen.value = true;
  } else {
    gameStore.loadFromCloud();
  }
}

const submitLogin = async () => {
  const success = await gameStore.loginAndConnect(loginForm.value.username, loginForm.value.password);
  if (success) {
    loginOpen.value = false;
    loginForm.value.username = '';
    loginForm.value.password = '';
  }
}

const submitRegister = async () => {
  await gameStore.registerAccount(loginForm.value.username, loginForm.value.password);
}

const applySettings = () => {
  gameStore.applySettings({
    fontSize: fontSize.value,
    typeSpeed: typeSpeed.value,
    noAnim: noAnim.value,
    brightness: brightness.value
  })
}

const combineItems = () => {
  if (selectedItem1.value && selectedItem2.value && selectedItem1.value !== selectedItem2.value) {
    const result = gameStore.combineItems(selectedItem1.value, selectedItem2.value)
    if (result) {
      gameStore.showToast(`成功组合 ${selectedItem1.value} 和 ${selectedItem2.value}，获得 ${result}！`)
      combineOpen.value = false
      overlayOpen.value = false
    } else {
      gameStore.showToast('这两个物品无法组合')
    }
  } else {
    gameStore.showToast('请选择两个不同的物品')
  }
}
</script>

<style scoped>
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
  transition: right 0.3s ease;
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

/* 设置项 */
.setting-item {
  margin-bottom: 15px;
}

.setting-item input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

/* 成就项 */
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
</style>