<template>
  <div class="puzzle-container combine-puzzle">
    <h3 class="puzzle-title">{{ sceneData.combine?.title || '物品组合' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="workbench-container">
      <h4>工作台</h4>
      <div class="workbench" @dragover.prevent @drop="onDrop">
        <div 
          v-for="(item, index) in workbenchItems" 
          :key="index"
          class="workbench-item"
          @click="removeFromWorkbench(index)"
        >
          {{ item }}
          <span class="remove-btn">×</span>
        </div>
        <div v-if="workbenchItems.length === 0" class="workbench-placeholder">
          拖放物品到此处或从背包中点击添加
        </div>
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
          @click="addToWorkbench(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div v-if="successMsg" class="success-message">
      {{ successMsg }}
    </div>
    
    <div class="puzzle-actions">
      <button class="clear-btn" @click="clearWorkbench" :disabled="workbenchItems.length === 0">
        清空
      </button>
      <button class="combine-btn" @click="combine" :disabled="workbenchItems.length < 2">
        组合
      </button>
      <button class="close-btn" @click="$emit('close')">
        返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../../store/gameStore'

const props = defineProps(['sceneData'])
const emit = defineEmits(['success', 'fail', 'close'])

const store = useGameStore()
const workbenchItems = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const draggedItem = ref(null)

const inventoryItems = computed(() => store.profile.inventory || [])
const combineConfig = computed(() => props.sceneData.combine || {})

const onDragStart = (event, item) => {
  draggedItem.value = item
  event.dataTransfer.effectAllowed = 'copy'
}

const onDrop = (event) => {
  event.preventDefault()
  if (draggedItem.value) {
    addToWorkbench(draggedItem.value)
  }
}

const addToWorkbench = (item) => {
  // 检查工作台是否已满
  const maxItems = combineConfig.value.maxItems || 3
  if (workbenchItems.value.length >= maxItems) {
    errorMsg.value = `工作台最多只能放${maxItems}个物品`
    setTimeout(() => {
      errorMsg.value = ''
    }, 2000)
    return
  }
  
  // 检查物品是否已在工作台
  if (workbenchItems.value.includes(item)) {
    errorMsg.value = '该物品已在工作台上'
    setTimeout(() => {
      errorMsg.value = ''
    }, 2000)
    return
  }
  
  workbenchItems.value.push(item)
  errorMsg.value = ''
  successMsg.value = ''
}

const removeFromWorkbench = (index) => {
  workbenchItems.value.splice(index, 1)
  errorMsg.value = ''
  successMsg.value = ''
}

const clearWorkbench = () => {
  workbenchItems.value = []
  errorMsg.value = ''
  successMsg.value = ''
}

const combine = () => {
  if (workbenchItems.value.length < 2) {
    errorMsg.value = '至少需要两个物品才能组合'
    setTimeout(() => {
      errorMsg.value = ''
    }, 2000)
    return
  }
  
  const combinations = combineConfig.value.combinations || {}
  const validate = combineConfig.value.validate
  const successTarget = combineConfig.value.successTarget
  const failMsg = combineConfig.value.failMsg || '这些物品无法组合'
  
  // 对物品进行排序，确保组合顺序不影响结果
  const sortedItems = [...workbenchItems.value].sort().join(',')
  
  // 验证逻辑
  let isValid = false
  let result = null
  
  if (typeof validate === 'function') {
    const validation = validate(workbenchItems.value)
    isValid = validation.valid
    result = validation.result
  } else if (combinations[sortedItems]) {
    // 从配置中查找组合结果
    isValid = true
    result = combinations[sortedItems]
  }
  
  if (isValid) {
    // 成功
    errorMsg.value = ''
    successMsg.value = result ? `组合成功！获得：${result}` : '组合成功！'
    
    // 可以在这里添加物品到背包的逻辑
    if (result) {
      store.addItem(result)
    }
    
    // 触发成功回调
    if (combineConfig.value.onSuccess) {
      combineConfig.value.onSuccess(workbenchItems.value, result)
    }
    
    // 清空工作台
    workbenchItems.value = []
    
    // 延迟触发成功事件，让用户看到成功消息
    setTimeout(() => {
      emit('success', successTarget)
    }, 1000)
  } else {
    // 失败
    errorMsg.value = failMsg
    successMsg.value = ''
    
    // 触发失败回调
    if (combineConfig.value.onFail) {
      combineConfig.value.onFail(workbenchItems.value)
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

.workbench-container {
  margin-bottom: 30px;
}

.workbench-container h4 {
  color: #d4af37;
  margin-bottom: 15px;
}

.workbench {
  min-height: 120px;
  border: 2px dashed #d4af37;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.workbench:hover {
  border-color: #fff;
  background: rgba(212, 175, 55, 0.1);
}

.workbench-placeholder {
  color: #888;
  font-size: 14px;
  text-align: center;
  width: 100%;
  font-style: italic;
}

.workbench-item {
  padding: 8px 12px;
  background: rgba(212, 175, 55, 0.3);
  border: 1px solid #d4af37;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.workbench-item:hover {
  background: rgba(212, 175, 55, 0.5);
  transform: translateY(-2px);
}

.remove-btn {
  font-size: 18px;
  font-weight: bold;
  color: #f44336;
  cursor: pointer;
  margin-left: 5px;
  padding: 0 5px;
  border-radius: 50%;
  background: rgba(244, 67, 54, 0.2);
}

.remove-btn:hover {
  background: rgba(244, 67, 54, 0.4);
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.inventory-item:hover {
  background: rgba(212, 175, 55, 0.4);
  transform: translateY(-2px);
}

.error-message {
  color: #f44336;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
}

.success-message {
  color: #4CAF50;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
}

.puzzle-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.clear-btn, .combine-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.clear-btn {
  background: #333;
  color: #fff;
  border: 1px solid #666;
}

.clear-btn:hover:not(:disabled) {
  background: #444;
  transform: translateY(-2px);
}

.clear-btn:disabled {
  background: #222;
  color: #666;
  cursor: not-allowed;
}

.combine-btn {
  background: #d4af37;
  color: #000;
  font-weight: bold;
}

.combine-btn:hover:not(:disabled) {
  background: #f4d03f;
  transform: translateY(-2px);
}

.combine-btn:disabled {
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
