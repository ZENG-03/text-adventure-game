<template>
  <div class="panel save-load-panel">
    <div class="panel-header">
      <h2>存档管理</h2>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>
    <div class="panel-content">
      <div class="save-slots">
        <div v-for="slot in 5" :key="slot" class="save-slot">
          <div class="slot-header">
            <h3>存档槽位 {{ slot }}</h3>
            <div class="slot-actions">
              <button class="slot-btn save-btn" @click="saveGame(slot)">保存</button>
              <button class="slot-btn load-btn" @click="loadGame(slot)">读取</button>
              <button class="slot-btn delete-btn" @click="deleteSave(slot)">删除</button>
            </div>
          </div>
          <div class="slot-info" v-if="getSaveInfo(slot)">
            <p class="save-date">{{ getSaveInfo(slot).date }}</p>
            <p class="save-scene">位置：{{ getSaveInfo(slot).sceneName || getSaveInfo(slot).sceneId }}</p>
            <p class="save-status" v-if="getSaveInfo(slot).status">状态：{{ getSaveInfo(slot).status }}</p>
          </div>
          <div class="slot-info empty" v-else>
            <p>空存档</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/gameStore'

const emit = defineEmits(['close'])
const gameStore = useGameStore()

// 获取所有存档信息
const saves = computed(() => gameStore.getSaves())

// 获取指定槽位的存档信息
const getSaveInfo = (slot) => {
  return saves.value.find(save => save.slot === slot) || null
}

// 保存游戏到指定槽位
const saveGame = (slot) => {
  gameStore.saveGame(slot)
}

// 从指定槽位加载游戏
const loadGame = async (slot) => {
  const sceneId = gameStore.loadGame(slot)
  if (sceneId) {
    // 通知父组件加载场景
    emit('load-scene', sceneId)
    emit('close')
  }
}

// 删除指定槽位的存档
const deleteSave = (slot) => {
  gameStore.deleteSave(slot)
}
</script>

<style scoped>
.save-load-panel {
  position: fixed;
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
  background-color: #2a2a2a;
  z-index: 1000;
  overflow-y: auto;
}

.save-slots {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.save-slot {
  border: 1px solid #444;
  border-radius: 5px;
  padding: 15px;
  background-color: #2a2a2a;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.slot-header h3 {
  margin: 0;
  color: #d4af37;
}

.slot-actions {
  display: flex;
  gap: 10px;
}

.slot-btn {
  padding: 5px 10px;
  border: 1px solid #666;
  border-radius: 3px;
  background-color: #333;
  color: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slot-btn:hover {
  background-color: #444;
  transform: translateY(-1px);
}

.save-btn:hover {
  background-color: #2d5a2d;
  border-color: #4caf50;
}

.load-btn:hover {
  background-color: #2d4a5a;
  border-color: #2196f3;
}

.delete-btn:hover {
  background-color: #5a2d2d;
  border-color: #f44336;
}

.slot-info {
  font-size: 0.9em;
  color: #aaa;
  margin-top: 10px;
}

.slot-info.empty {
  color: #666;
  font-style: italic;
}

.slot-info p {
  margin: 5px 0;
}
</style>