<template>
  <div class="settings-panel">
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
    <button class="sys-btn" @click="$emit('close')">关闭设置</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../store/gameStore'

const gameStore = useGameStore()

// 游戏设置状态
const fontSize = ref(16)
const typeSpeed = ref(25)
const noAnim = ref(false)
const brightness = ref(100)

const emit = defineEmits(['close', 'sync-login'])

const applySettings = () => {
  gameStore.applySettings({
    fontSize: fontSize.value,
    typeSpeed: typeSpeed.value,
    noAnim: noAnim.value,
    brightness: brightness.value
  })
}

const handleCloudSync = () => {
  if (!gameStore.isOnline) {
    emit('sync-login')
  } else {
    gameStore.loadFromCloud()
  }
}
</script>