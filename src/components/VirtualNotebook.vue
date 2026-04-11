<template>
  <div class="notebook-container">
    <div class="notebook-header">
      <h2>虚拟笔记本</h2>
      <button class="close-btn" @click="$emit('close')">关闭</button>
    </div>
    
    <div class="notebook-content">
      <div class="entry-list">
        <div 
          v-for="entry in availableEntries" 
          :key="entry.id"
          class="entry-item"
          :class="{ active: selectedEntryId === entry.id }"
          @click="selectEntry(entry.id)"
        >
          <div class="entry-date">{{ entry.date }}</div>
          <div class="entry-title">{{ entry.title }}</div>
        </div>
      </div>
      
      <div class="entry-detail">
        <div v-if="selectedEntry" class="entry-content">
          <h3>{{ selectedEntry.title }}</h3>
          <div class="entry-meta">日期: {{ selectedEntry.date }}</div>
          <div class="entry-text" v-html="selectedEntry.content"></div>
          
          <div class="annotations-section">
            <h4>我的注释</h4>
            <textarea 
              v-model="currentAnnotation" 
              placeholder="添加你的注释..."
              class="annotation-input"
              @input="saveAnnotation"
            ></textarea>
            <div v-if="getAnnotation(selectedEntry.id)" class="existing-annotation">
              <p>{{ getAnnotation(selectedEntry.id) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-selection">
          <p>请选择一个日记条目</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../store/gameStore'
import { journalEntries } from '../data/journalEntries'

const emit = defineEmits(['close'])
const store = useGameStore()

const selectedEntryId = ref('initial')
const currentAnnotation = ref('')

// 计算可用的日记条目
const availableEntries = computed(() => {
  return Object.values(journalEntries).filter(entry => {
    if (!entry.unlockCondition) return true
    return entry.unlockCondition(store)
  })
})

// 计算当前选中的条目
const selectedEntry = computed(() => {
  return journalEntries[selectedEntryId.value]
})

// 选择条目
const selectEntry = (entryId) => {
  selectedEntryId.value = entryId
  currentAnnotation.value = getAnnotation(entryId) || ''
}

// 获取注释
const getAnnotation = (entryId) => {
  const journalEntry = store.run.journal_entries.find(e => e.id === entryId)
  return journalEntry?.annotation || ''
}

// 保存注释
const saveAnnotation = () => {
  if (selectedEntryId.value) {
    store.updateJournalAnnotation(selectedEntryId.value, currentAnnotation.value)
  }
}

// 监听选中条目变化，更新注释
watch(selectedEntryId, (newId) => {
  currentAnnotation.value = getAnnotation(newId) || ''
})

// 初始化
selectEntry('initial')
</script>

<style scoped>
.notebook-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 1000px;
  height: 80%;
  max-height: 800px;
  background: #f5f5dc;
  border: 3px solid #8b4513;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.notebook-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #8b4513;
  color: #f5f5dc;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
}

.notebook-header h2 {
  margin: 0;
  font-family: 'Georgia', serif;
  font-size: 1.5em;
}

.close-btn {
  padding: 8px 15px;
  background: #f5f5dc;
  color: #8b4513;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.close-btn:hover {
  background: #e8e8c0;
}

.notebook-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.entry-list {
  width: 30%;
  background: #e8e8c0;
  border-right: 2px solid #8b4513;
  overflow-y: auto;
  padding: 10px;
}

.entry-item {
  padding: 15px;
  margin-bottom: 10px;
  background: #f5f5dc;
  border: 1px solid #8b4513;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.entry-item:hover {
  background: #e8e8c0;
  transform: translateX(5px);
}

.entry-item.active {
  background: #d4af37;
  border-color: #d4af37;
}

.entry-date {
  font-size: 0.8em;
  color: #8b4513;
  margin-bottom: 5px;
}

.entry-title {
  font-weight: bold;
  color: #333;
}

.entry-detail {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f5dc;
}

.entry-content h3 {
  margin-top: 0;
  color: #8b4513;
  font-family: 'Georgia', serif;
  border-bottom: 2px solid #8b4513;
  padding-bottom: 10px;
}

.entry-meta {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 20px;
  font-style: italic;
}

.entry-text {
  line-height: 1.6;
  color: #333;
  margin-bottom: 30px;
}

.annotations-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #8b4513;
}

.annotations-section h4 {
  color: #8b4513;
  margin-bottom: 10px;
}

.annotation-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  background: #fff;
  border: 1px solid #8b4513;
  border-radius: 5px;
  resize: vertical;
  font-family: 'Georgia', serif;
  font-size: 1em;
  margin-bottom: 15px;
}

.existing-annotation {
  padding: 10px;
  background: #e8e8c0;
  border: 1px solid #8b4513;
  border-radius: 5px;
  margin-top: 10px;
}

.existing-annotation p {
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-style: italic;
}

/* 滚动条样式 */
.entry-list::-webkit-scrollbar,
.entry-detail::-webkit-scrollbar {
  width: 8px;
}

.entry-list::-webkit-scrollbar-track,
.entry-detail::-webkit-scrollbar-track {
  background: #e8e8c0;
}

.entry-list::-webkit-scrollbar-thumb,
.entry-detail::-webkit-scrollbar-thumb {
  background: #8b4513;
  border-radius: 4px;
}

.entry-list::-webkit-scrollbar-thumb:hover,
.entry-detail::-webkit-scrollbar-thumb:hover {
  background: #6b3503;
}
</style>