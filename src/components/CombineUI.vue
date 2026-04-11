<template>
  <div class="combine-ui">
    <h3>{{ sceneData?.combine?.title || '物品组合实验台' }}</h3>
    <div class="items-container">
      <div class="selected-items">
        <div 
          v-for="(item, index) in selectedItems" 
          :key="index"
          class="selected-item"
        >
          {{ item }}
          <button class="remove-btn" @click="removeItem(item)">×</button>
        </div>
      </div>
      <div class="item-list">
        <button 
          v-for="item in availableItems" 
          :key="item"
          class="item-btn"
          :class="{ selected: selectedItems.includes(item) }"
          @click="toggleItem(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <div class="feedback" v-if="feedbackMessage">{{ feedbackMessage }}</div>
    <div class="btn-container">
      <button class="combine-btn" @click="combineItems" :disabled="selectedItems.length === 0">
        尝试组合
      </button>
      <button class="cancel-btn" @click="$emit('close')">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../store/gameStore'

const props = defineProps({
  sceneData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])
const store = useGameStore()
const selectedItems = ref([])
const feedbackMessage = ref('')

// 计算可用物品列表
const availableItems = computed(() => {
  return store.run.items
})

// 切换物品选择状态
const toggleItem = (item) => {
  const maxSelect = props.sceneData.combine?.maxSelect || 2
  
  if (selectedItems.value.includes(item)) {
    // 移除已选择的物品
    selectedItems.value = selectedItems.value.filter(i => i !== item)
  } else {
    // 添加新物品
    if (selectedItems.value.length >= maxSelect) {
      alert(`最多只能选择 ${maxSelect} 个物品进行组合。`)
      return
    }
    selectedItems.value.push(item)
  }
}

// 移除已选择的物品
const removeItem = (item) => {
  selectedItems.value = selectedItems.value.filter(i => i !== item)
}

// 组合物品
const combineItems = () => {
  if (selectedItems.value.length === 0) {
    return
  }
  
  const combineConfig = props.sceneData.combine
  const requiredArr = combineConfig.required || []
  
  // 检查配方是否匹配
  const isMatch = selectedItems.value.length === requiredArr.length && 
                  requiredArr.every(req => selectedItems.value.includes(req))
  
  if (isMatch) {
    feedbackMessage.value = '组合成功！'
    
    // 默认消耗材料
    if (combineConfig.consume !== false) {
      requiredArr.forEach(req => store.removeItem(req))
    }
    
    // 添加产物
    if (combineConfig.result) {
      store.addItem(combineConfig.result)
    }
    
    if (combineConfig.onSuccess) {
      combineConfig.onSuccess()
    }
    
    setTimeout(() => {
      emit('success')
    }, 800)
  } else {
    feedbackMessage.value = combineConfig.failMsg || '组合似乎没有产生任何反应……可能是配方不对。'
    
    // 清空选择
    selectedItems.value = []
  }
}
</script>

<style scoped>
.combine-ui {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d4af37;
  max-width: 400px;
  margin: 0 auto;
}

.combine-ui h3 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.items-container {
  margin-bottom: 20px;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: #5c4033;
  border: 1px solid #d4af37;
  border-radius: 15px;
  color: #fff;
  font-size: 0.9em;
}

.remove-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 15px;
}

.item-btn {
  margin: 0;
  padding: 5px 10px;
  border: 1px solid #777;
  border-radius: 4px;
  background: #222;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
}

.item-btn:hover {
  background: #333;
  border-color: #999;
}

.item-btn.selected {
  background: #5c4033;
  border: 1px solid #d4af37;
  color: #fff;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
}

.feedback {
  color: #d9534f;
  margin-bottom: 20px;
  min-height: 24px;
  text-align: center;
}

.feedback.success {
  color: #5cb85c;
}

.btn-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.combine-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.combine-btn {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border: 1px solid #d4af37;
}

.combine-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.4);
}

.combine-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: #444;
  color: white;
  border: 1px solid #666;
}

.cancel-btn:hover {
  background: #555;
}
</style>