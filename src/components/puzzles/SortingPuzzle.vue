<template>
  <div class="puzzle-container sorting-puzzle">
    <h3 class="puzzle-title">{{ sceneData.sorting?.title || '排序谜题' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="sorting-container">
      <div 
        class="sorting-track"
        @dragover.prevent
      >
        <div 
          v-for="(item, index) in currentOrder" 
          :key="index"
          class="sorting-item"
          draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent
          @drop="onDrop($event, index)"
          :class="{ 'correct': isCorrect(index) }"
        >
          {{ item }}
        </div>
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div v-if="showHint" class="hint-message">
      <strong>提示：</strong>{{ sceneData.sorting?.hint || '请按照正确的顺序排列' }}
    </div>
    
    <div class="puzzle-actions">
      <button v-if="!showHint && sceneData.sorting?.hint" class="hint-btn" @click="showHint = true">
        提示
      </button>
      <button class="submit-btn" @click="submit" :disabled="!canSubmit">
        提交
      </button>
      <button class="reset-btn" @click="reset">
        重置
      </button>
      <button class="close-btn" @click="$emit('close')">
        返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../../store/gameStore'

const props = defineProps(['sceneData'])
const emit = defineEmits(['success', 'fail', 'close'])

const store = useGameStore()
const currentOrder = ref([])
const draggedIndex = ref(null)
const errorMsg = ref('')
const showHint = ref(false)

const sortingConfig = computed(() => props.sceneData.sorting || {})
const correctOrder = computed(() => sortingConfig.value.correctOrder || [])
const successTarget = computed(() => sortingConfig.value.successTarget)
const failMsg = computed(() => sortingConfig.value.failMsg || '排序错误')

const canSubmit = computed(() => {
  return currentOrder.value.length === correctOrder.value.length
})

const isCorrect = (index) => {
  return currentOrder.value[index] === correctOrder.value[index]
}

onMounted(() => {
  // 初始化排序项
  const items = sortingConfig.value.items || []
  // 随机打乱顺序
  currentOrder.value = [...items].sort(() => Math.random() - 0.5)
  errorMsg.value = ''
  showHint.value = false
})

const onDragStart = (event, index) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

const onDrop = (event, targetIndex) => {
  event.preventDefault()
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    // 交换位置
    const newOrder = [...currentOrder.value]
    const [draggedItem] = newOrder.splice(draggedIndex.value, 1)
    newOrder.splice(targetIndex, 0, draggedItem)
    currentOrder.value = newOrder
  }
  draggedIndex.value = null
  errorMsg.value = ''
}

const reset = () => {
  const items = sortingConfig.value.items || []
  currentOrder.value = [...items].sort(() => Math.random() - 0.5)
  errorMsg.value = ''
  showHint.value = false
}

const submit = () => {
  // 验证排序是否正确
  const isSortedCorrectly = currentOrder.value.every((item, index) => {
    return item === correctOrder.value[index]
  })
  
  if (isSortedCorrectly) {
    // 成功
    errorMsg.value = ''
    emit('success', successTarget.value)
  } else {
    // 失败
    errorMsg.value = failMsg.value
    // 触发失败回调
    if (sortingConfig.value.onFail) {
      sortingConfig.value.onFail(currentOrder.value)
    }
    emit('fail')
  }
}
</script>

<style scoped>
.puzzle-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: #fff;
}

.puzzle-title {
  color: #d4af37;
  margin-bottom: 20px;
  text-align: center;
}

.puzzle-desc {
  margin-bottom: 25px;
  line-height: 1.5;
  text-align: center;
}

.sorting-container {
  margin-bottom: 30px;
}

.sorting-track {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 20px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  min-height: 100px;
  align-items: center;
}

.sorting-item {
  padding: 15px 20px;
  background: rgba(212, 175, 55, 0.2);
  border: 2px solid #d4af37;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.sorting-item:hover {
  background: rgba(212, 175, 55, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.sorting-item:active {
  cursor: grabbing;
}

.sorting-item.correct {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.error-message {
  color: #f44336;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
}

.hint-message {
  color: #4CAF50;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
  border-left: 4px solid #4CAF50;
}

.puzzle-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.hint-btn, .submit-btn, .reset-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.hint-btn {
  background: #333;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.hint-btn:hover {
  background: #444;
  transform: translateY(-2px);
}

.submit-btn {
  background: #d4af37;
  color: #000;
  font-weight: bold;
}

.submit-btn:hover:not(:disabled) {
  background: #f4d03f;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #888;
  cursor: not-allowed;
}

.reset-btn {
  background: #333;
  color: #fff;
  border: 1px solid #666;
}

.reset-btn:hover {
  background: #444;
  transform: translateY(-2px);
}

.close-btn {
  background: #333;
  color: #fff;
  border: 1px solid #666;
}

.close-btn:hover {
  background: #444;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .sorting-track {
    flex-direction: column;
    align-items: center;
  }
  
  .sorting-item {
    width: 80%;
    max-width: 200px;
  }
  
  .puzzle-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .puzzle-actions button {
    width: 80%;
    max-width: 200px;
  }
}
</style>
