<template>
  <div class="puzzle-container item-submission">
    <h3 class="puzzle-title">{{ sceneData.itemSelection?.title || '物品提交' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="slots-container">
      <div 
        v-for="(slot, index) in slots" 
        :key="index"
        class="slot"
        :class="{ 'filled': slot.filled, 'correct': slot.correct, 'error': slot.error }"
        @dragover.prevent
        @drop="onDrop($event, index)"
      >
        <span v-if="slot.item" class="slot-item">{{ slot.item }}</span>
        <span v-else class="slot-placeholder">拖放物品</span>
      </div>
    </div>
    
    <div class="inventory-section">
      <h4>背包物品</h4>
      <div class="inventory-items">
        <div 
          v-for="item in inventoryItems" 
          :key="item"
          class="inventory-item"
          draggable="true"
          @dragstart="onDragStart($event, item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div class="puzzle-actions">
      <button class="submit-btn" @click="submit" :disabled="!canSubmit">
        提交
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
const errorMsg = ref('')
const draggedItem = ref(null)

// 初始化插槽
const slots = ref([])
const inventoryItems = computed(() => store.profile.inventory || [])

const canSubmit = computed(() => {
  return slots.value.every(slot => slot.filled)
})

onMounted(() => {
  // 根据配置初始化插槽
  const requiredItems = props.sceneData.itemSelection?.requiredItems || []
  slots.value = requiredItems.map(() => ({
    filled: false,
    correct: false,
    error: false,
    item: null
  }))
})

const onDragStart = (event, item) => {
  draggedItem.value = item
  event.dataTransfer.effectAllowed = 'copy'
}

const onDrop = (event, index) => {
  event.preventDefault()
  if (draggedItem.value) {
    slots.value[index] = {
      filled: true,
      correct: false,
      error: false,
      item: draggedItem.value
    }
  }
}

const submit = () => {
  const itemSelection = props.sceneData.itemSelection
  if (!itemSelection) return
  
  const requiredItems = itemSelection.requiredItems
  const currentItems = slots.value.map(slot => slot.item)
  
  // 验证逻辑
  let isValid = false
  
  if (typeof itemSelection.validate === 'function') {
    isValid = itemSelection.validate(currentItems)
  } else if (Array.isArray(requiredItems)) {
    // 简单的数组比较
    isValid = currentItems.length === requiredItems.length && 
              currentItems.every((item, index) => item === requiredItems[index])
  }
  
  if (isValid) {
    // 成功
    errorMsg.value = ''
    emit('success', itemSelection.successTarget)
  } else {
    // 失败
    errorMsg.value = itemSelection.failMsg || '物品组合不正确'
    // 标记错误的插槽
    slots.value.forEach((slot, index) => {
      slot.error = true
      slot.correct = false
    })
    // 触发失败回调
    if (itemSelection.onFail) {
      itemSelection.onFail(currentItems)
    }
    emit('fail')
  }
}
</script>

<style scoped>
.puzzle-container {
  max-width: 600px;
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
}

.slots-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.slot {
  width: 100px;
  height: 100px;
  border: 2px dashed #d4af37;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.slot:hover {
  border-color: #fff;
  background: rgba(212, 175, 55, 0.1);
}

.slot.filled {
  border-style: solid;
  background: rgba(212, 175, 55, 0.2);
}

.slot.correct {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.2);
}

.slot.error {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.2);
}

.slot-item {
  font-size: 14px;
  text-align: center;
  padding: 10px;
}

.slot-placeholder {
  color: #888;
  font-size: 12px;
  text-align: center;
  padding: 10px;
}

.inventory-section {
  margin-bottom: 30px;
}

.inventory-section h4 {
  color: #d4af37;
  margin-bottom: 15px;
}

.inventory-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.inventory-item {
  padding: 8px 12px;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid #d4af37;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s ease;
}

.inventory-item:hover {
  background: rgba(212, 175, 55, 0.4);
  transform: translateY(-2px);
}

.inventory-item:active {
  cursor: grabbing;
}

.error-message {
  color: #f44336;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
}

.puzzle-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.submit-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
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

.close-btn {
  background: #333;
  color: #fff;
  border: 1px solid #666;
}

.close-btn:hover {
  background: #444;
  transform: translateY(-2px);
}
</style>
