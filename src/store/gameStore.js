import { defineStore } from 'pinia'
export const scenesMap = {};
import hints from '../data/hints.json'
import { executeEffects, evaluateConditions } from '../core/scene-logic.js'

// ===== 静态词典数据单独抽出，减少内存与网络开销 =====
const staticData = {
// 物品组合规则
  itemCombinations: {
    '七色花苞+古树血提取剂': '生命精华',
    '机械齿轮+调音扳手': '精密齿轮',
    '夜莺长笛+调音扳手': '调好的长笛',
    '起始徽章+旋律徽章': '双徽章',
    '生命徽章+色彩徽章': '自然之章'
  },
  // 物品描述
  itemDescriptions: {
    '七色花苞': '七种颜色的花苞，看起来非常美丽',
    '古树血提取剂': '从古树中提取的液体，具有生命能量',
    '生命精华': '由七色花苞和古树血提取剂组合而成，具有强大的生命能量',
    '机械齿轮': '一个精密的机械齿轮',
    '调音扳手': '用于调音的工具',
    '精密齿轮': '由机械齿轮和调音扳手组合而成，更加精密',
    '夜莺长笛': '一只精美的长笛，上面刻有夜莺图案',
    '调好的长笛': '由夜莺长笛和调音扳手组合而成，音质更加优美',
    '起始徽章': '第一枚徽章，象征着开始',
    '旋律徽章': '音乐室的徽章，象征着旋律',
    '双徽章': '由起始徽章和旋律徽章组合而成',
    '生命徽章': '温室的徽章，象征着生命',
    '色彩徽章': '画室的徽章，象征着色彩',
    '自然之章': '由生命徽章和色彩徽章组合而成，象征着自然'
  }
};

export const useGameStore = defineStore('game', {
  state: () => ({
    // 游戏状态
    profile: {
      endings_reached: [],
      play_count: 0,
      achievements: [],
      met_characters: []
    },
    run: {
      current_scene_id: 'title',
      items: [],
      clues: [],
      medals: [],
      hall_medal_count: 0,
      hint_levels: {},
      flags: {}
    },
    // 游戏设置
    settings: {
      fontSize: 16,
      typeSpeed: 25,
      noAnim: false,
      brightness: 100
    },

    // ===== 系统与连网状态 =====
    isOnline: false, // 离线优先，连接服务端后置为 true
    isSyncing: false // 防抖同步状态防重入
  }),
  getters: {
    // 获取当前场景
    currentScene: (state) => {
      return scenesMap[state.run.current_scene_id] || null
    },
    // 获取物品列表
    items: (state) => {
      return state.run.items
    },
    // 获取线索列表
    clues: (state) => {
      return state.run.clues
    },
    // 获取徽章列表
    medals: (state) => {
      return state.run.medals
    },
    // 获取结局列表
    endings: (state) => {
      return state.profile.endings_reached
    },
    // 获取游戏次数
    playCount: (state) => {
      return state.profile.play_count
    }
  },
  actions: {
    // 开始新游戏
    startNewGame() {
      this.profile = {
        endings_reached: this.profile.endings_reached,
        play_count: this.profile.play_count + 1,
        achievements: this.profile.achievements
      }
      this.run = {
        current_scene_id: 'title',
        items: [],
        clues: [],
        medals: [],
        hall_medal_count: 0,
        hint_levels: {},
        flags: {}
      }
      this.saveState()
    },
    // 开始多周目游戏
    startNGPlus() {
      this.profile = {
        endings_reached: this.profile.endings_reached,
        play_count: this.profile.play_count + 1,
        achievements: this.profile.achievements
      }
      this.run = {
        current_scene_id: 'title',
        items: ['怀表'],
        clues: ['前世记忆'],
        medals: [],
        hall_medal_count: 0,
        hint_levels: {},
        flags: {}
      }
      this.saveState()
    },
    // 加载游戏
    loadGame() {
      try {
        const saved = localStorage.getItem('adventure_save')
        if (saved) {
          const parsed = JSON.parse(saved)
          this.profile = parsed.profile
          this.run = parsed.run
        }
      } catch (e) {
        console.error('Failed to load game:', e)
      }
    },
    // ===== 统一持久化逻辑 (离线+云端同步) =====
    // 取代原有散乱的 saveState() ，提供异步云同步能力，同时做防抖避免高频调用
    async autoSync() {
      // 1. 优先写本地，确保断网也能玩
      try {
        const state = {
          profile: this.profile,
          run: this.run,
          settings: this.settings
        };
        localStorage.setItem('adventure_save', JSON.stringify(state));
      } catch (e) {
        console.error('保存本地失败:', e);
      }

      // 2. 若已登录且连通后端，则触发静默云同步，做防抖限制
      if (this.isOnline && !this.isSyncing) {
        this.isSyncing = true;
        try {
          const api = await import('../api/index.js');
          await api.ServerAPI.syncSaveData({ profile: this.profile, run: this.run, settings: this.settings });
        } catch (error) {
          console.warn("云存档同步失败，当前仅在本地保存", error);
        } finally {
          this.isSyncing = false;
        }
      }
    },
    saveState() { 
      // 向后兼容已有的全局调用
      if (this._saveTimer) clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(() => {
        this.autoSync(); 
      }, 500);
    },

    // ===== 在线特性动作 =====
    // 从云端强行拉取并覆盖本地存档 (用于跨设备登录)
    async loadFromCloud() {
      try {
        const api = await import('../api/index.js');
        const response = await api.ServerAPI.fetchSaveData();
        if (response && response.data) {
          const parsed = response.data;
          if (parsed.profile) this.profile = parsed.profile;
          if (parsed.run) this.run = parsed.run;
          this.autoSync();
          this.showToast('云存档拉取成功！');
          return true;
        }
      } catch(e) {
        this.showToast('云端无数据或提取失败');
        return false;
      }
    },

    // 获取最新剧本热更新
    async fetchScenesUpdate() {
      try {
        const api = await import('../api/index.js');
        const response = await api.ServerAPI.fetchScenesDSL();
        if (response && response.data) {
           // Object.assign(scenes, response.data);
           console.log("游戏文本/解谜树 热更新完成");
        }
      } catch(e) {
         console.warn("使用本地离线剧本");
      }
    },

    // 使用真实账号密码登录
    async loginAndConnect(username, password) {
      if (!username || !password) {
        this.showToast('请输入账号和密码！');
        return;
      }
      this.showToast('正在登录...');
      try {
        const api = await import('../api/index.js');
        const res = await api.ServerAPI.login(username, password);
        
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.isOnline = true;
          this.showToast('登录成功，已接通档案服务器');
          await this.loadFromCloud();
          this.fetchScenesUpdate();
          return true;
        }
      } catch (e) {
        console.error(e);
        const errMsg = e.response?.data?.error || '账号或密码错误';
        this.showToast(errMsg);
        return false;
      }
    },

    // 注册账号
    async registerAccount(username, password) {
      if (!username || !password) {
        this.showToast('请输入账号和密码！');
        return;
      }
      this.showToast('正在注册...');
      try {
        const api = await import('../api/index.js');
        const res = await api.ServerAPI.register(username, password);
        this.showToast(res.message || '注册成功！请登录');
        return true;
      } catch (e) {
        const errMsg = e.response?.data?.error || '注册失败，可能用户名已存在';
        this.showToast(errMsg);
        return false;
      }
    },
    hasAutoSave() {
      try {
        return !!localStorage.getItem('adventure_save')
      } catch (e) {
        return false
      }
    },
    // 检查是否有结局
    hasEndings() {
      return this.profile.endings_reached.length > 0
    },
    // 获取场景
    getScene(sceneId) {
      return scenesMap[sceneId] || null
    },
    // 添加物品
    addItem(item) {
      if (!this.run.items.includes(item)) {
        this.run.items.push(item)
        this.saveState()
        return `<div class="system-message">【获得物品】：${item}</div>`
      }
      return ''
    },
    // 移除物品
    removeItem(item) {
      const index = this.run.items.indexOf(item)
      if (index > -1) {
        this.run.items.splice(index, 1)
        this.saveState()
        return `<div class="system-message danger-message">【失去物品】：${item}</div>`
      }
      return ''
    },
    // 添加线索
    addClue(clue) {
      if (!this.run.clues.includes(clue)) {
        this.run.clues.push(clue)
        this.saveState()
        return `<div class="system-message">【获得线索】：${clue}</div>`
      }
      return ''
    },
    // 添加徽章
    addMedal(medal) {
      if (!this.run.medals.includes(medal)) {
        this.run.medals.push(medal)
        this.run.hall_medal_count = this.run.medals.length
        this.saveState()
        return `<div class="system-message">【获得徽章】：${medal}</div>`
      }
      return ''
    },
    // 添加结局
    addEnding(ending) {
      if (!this.profile.endings_reached.includes(ending)) {
        this.profile.endings_reached.push(ending)
        this.saveState()
        return `<div class="system-message" style="color:var(--hover-color); font-weight:bold; font-size:1.1em;">【命运定格】<br>已达成结局 - ${ending}</div>`
      }
      return ''
    },
    // 设置标志
    setFlag(flag, value) {
      this.run.flags[flag] = value
      this.saveState()
    },
    // 获取标志
    getFlag(flag) {
      return this.run.flags[flag] || false
    },
    // 显示提示
    showHint(sceneId) {
      if (!sceneId) return
      
      // 初始化hint_levels对象
      if (!this.run.hint_levels) {
        this.run.hint_levels = {}
      }
      
      const hintLevel = this.run.hint_levels[sceneId] || 0
      
      // 使用导入的hints模块
      let sceneHints = hints[sceneId]
      
      // 如果当前场景没有提示，使用默认提示
      if (!sceneHints || sceneHints.length === 0) {
        sceneHints = hints.default || []
      }
      
      if (sceneHints.length === 0) {
        this.showToast('当前场景暂无提示')
        return
      }
      
      // 对于大厅场景，根据游戏进度显示不同的提示
      if (sceneId === 'hall_main') {
        const medalCount = this.run.hall_medal_count || 0
        let progressHint = ''
        
        if (medalCount === 0) {
          progressHint = '你还没有获得任何徽章，尝试探索不同的房间。'
        } else if (medalCount < 7) {
          progressHint = `你已经获得了 ${medalCount} 枚徽章，还需要 ${7 - medalCount} 枚才能开启密室。`
        } else {
          progressHint = '你已经获得了所有徽章，可以尝试开启中央密室了。'
        }
        
        // 显示进度提示和当前等级的提示
        const hint = sceneHints[hintLevel % sceneHints.length]
        this.showToast(`【进度提示】：${progressHint}\n【提示】：${hint}`)
      } else {
        // 对于其他场景，显示当前等级的提示
        if (hintLevel >= sceneHints.length) {
          this.showToast('已经没有更多提示了')
          return
        }
        
        const hint = sceneHints[hintLevel]
        this.showToast(`【提示】：${hint}`)
      }
      
      // 增加提示等级
      this.run.hint_levels[sceneId] = hintLevel + 1
      this.saveState()
    },
    // 物品组合
    combineItems(item1, item2) {
      const key1 = `${item1}+${item2}`
      const key2 = `${item2}+${item1}`
      
      let result = null
      if (staticData.itemCombinations[key1]) {
        result = staticData.itemCombinations[key1]
      } else if (staticData.itemCombinations[key2]) {
        result = staticData.itemCombinations[key2]
      }
      
      if (result) {
        // 移除原物品
        this.removeItem(item1)
        this.removeItem(item2)
        // 添加新物品
        this.addItem(result)
        this.saveState()
      }
      
      return result
    },
    // 获取物品描述
    getItemDescription(item) {
      return staticData.itemDescriptions[item] || '暂无描述'
    },
    // 应用设置
    applySettings(settings) {
      this.settings = { ...this.settings, ...settings }
      // 应用亮度设置
      document.body.style.filter = `brightness(${this.settings.brightness}%)`
      // 应用字体大小
      document.body.style.fontSize = `${this.settings.fontSize}px`
    },
    // 显示提示框
    showToast(message) {
      const toast = document.createElement('div')
      toast.className = 'toast'
      toast.innerText = message
      toast.style.position = 'fixed'
      toast.style.bottom = '20px'
      toast.style.left = '50%'
      toast.style.transform = 'translateX(-50%)'
      toast.style.padding = '10px 20px'
      toast.style.background = 'rgba(0, 0, 0, 0.8)'
      toast.style.color = 'white'
      toast.style.borderRadius = '5px'
      toast.style.zIndex = '1000'
      toast.style.animation = 'fadeIn 0.3s ease-in-out'
      
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in-out'
        setTimeout(() => {
          if (toast.parentNode) document.body.removeChild(toast)
        }, 300)
      }, 3000)
    }
  }
})