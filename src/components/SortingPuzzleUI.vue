<template>
  <div class="sorting-puzzle-ui">
    <h3>{{ sceneData?.sorting?.prompt || '请按正确顺序排列以下元素' }}</h3>
    <p class="instruction">{{ sceneData?.sorting?.instruction || '拖动元素以重新排序' }}</p>
    
    <div class="sortable-list">
      <div 
        v-for="(item, index) in sortedItems" 
        :key="index"
        class="sortable-item"
        :class="{ 'correct': showResult && isCorrectPosition[index], 'incorrect': showResult && !isCorrectPosition[index] }"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent
        @drop="onDrop(index)"
      >
        <span class="drag-handle">☰</span>
        <span class="item-text">{{ item }}</span>
      </div>
    </div>
    
    <div class="feedback" v-if="feedbackMessage">{{ feedbackMessage }}</div>
    
    <div class="btn-container">
      <button class="check-btn" @click="checkAnswer" :disabled="showResult">
        检查答案
      </button>
      <button class="reset-btn" @click="resetItems">
        重置
      </button>
      <button class="cancel-btn" @click="$emit('close')">
        取消
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../store/gameStore'

const props = defineProps({
  sceneData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])
const store = useGameStore()

// 初始化物品列表
const originalItems = computed(() => {
  return props.sceneData.sorting?.items || []
})

const sortedItems = ref([])
const draggedIndex = ref(null)
const showResult = ref(false)
const feedbackMessage = ref('')

// 正确顺序
const correctOrder = computed(() => {
  return props.sceneData.sorting?.correctOrder || originalItems.value
})

// 检查每个位置是否正确
const isCorrectPosition = computed(() => {
  return sortedItems.value.map((item, index) => item === correctOrder.value[index])
})

// 初始化
onMounted(() => {
  resetItems()
})

// 重置物品
const resetItems = () => {
  sortedItems.value = [...originalItems.value].sort(() => Math.random() - 0.5)
  showResult.value = false
  feedbackMessage.value = ''
}

// 开始拖动
const onDragStart = (index) => {
  draggedIndex.value = index
}

// 放下
const onDrop = (targetIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return
  
  const draggedItem = sortedItems.value[draggedIndex.value]
  sortedItems.value.splice(draggedIndex.value, 1)
  sortedItems.value.splice(targetIndex, 0, draggedItem)
  draggedIndex.value = null
}

// 检查答案
const checkAnswer = () => {
  const isCorrect = sortedItems.value.every((item, index) => item === correctOrder.value[index])
  
  showResult.value = true
  
  if (isCorrect) {
    feedbackMessage.value = '✓ 正确！答案完全正确！'
    feedbackMessage.value = '✓ 正确！答案完全正确！'
    
    if (props.sceneData.sorting?.onSuccess) {
      props.sceneData.sorting.onSuccess()
    }
    
    setTimeout(() => {
      emit('success')
    }, 1000)
  } else {
    const correctCount = sortedItems.value.filter((item, index) => item === correctOrder.value[index]).length
    feedbackMessage.value = `✗ 不正确。你有 ${correctCount}/${sortedItems.value.length} 个元素在正确位置。`
    feedbackMessage.value = `✗ 不正确。你有 ${correctCount}/${sortedItems.value.length} 个元素在正确位置。`
  }
}
</script>

<style scoped>
.sorting-puzzle-ui {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d4af37;
  max-width: 500px;
  margin: 0 auto;
}

.sorting-puzzle-ui h3 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
}

.instruction {
  color: #aaa;
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 20px;
}

.sortable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.sortable-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s ease;
}

.sortable-item:hover {
  background: #333;
  border-color: #555;
}

.sortable-item:active {
  cursor: grabbing;
}

.sortable-item.correct {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.sortable-item.incorrect {
  background: rgba(244, 67, 54, 0.2);
  border-color: #f44336;
}

.drag-handle {
  color: #888;
  font-size: 1.2em;
}

.item-text {
  flex: 1;
}

.feedback {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.05);
}

.feedback.success {
  color: #4CAF50;
}

.feedback.error {
  color: #f44336;
}

.btn-container {
  display: flex;
  gap: 10px;
}

.check-btn, .reset-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.check-btn {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border: 1px solid #d4af37;
}

.check-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.4);
}

.check-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  background: #444;
  color: white;
  border: 1px solid #666;
}

.reset-btn:hover {
  background: #555;
}

.cancel-btn {
  background: #333;
  color: #aaa;
  border: 1px solid #444;
}

.cancel-btn:hover {
  background: #444;
  color: white;
}
</style>
