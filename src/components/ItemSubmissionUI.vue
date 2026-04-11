<template>
  <div class="item-submission-ui">
    <h3>{{ promptText }}</h3>
    <div class="item-list">
      <button 
        v-for="item in availableItems" 
        :key="item"
        class="item-btn"
        @click="submitItem(item)"
      >
        ➤ 提交【{{ item }}】
      </button>
    </div>
    <div class="btn-container">
      <button class="back-btn" @click="goBack">返回</button>
      <button class="cancel-btn" @click="$emit('close')">放弃提交，返回</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../store/gameStore'

const props = defineProps({
  sceneData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])
const store = useGameStore()
const feedbackMessage = ref('')

// 计算可用物品列表
const availableItems = computed(() => {
  return store.run.items
})

// 计算提示文本
const promptText = computed(() => {
  const selection = props.sceneData.itemSelection
  const promptBase = selection?.prompt || '从背包中选择一件物品提交。'
  const requiredCount = Math.max(1, Number(selection?.requiredCount || 1))
  const submittedCount = submittedItems.value.length
  
  if (requiredCount > 1) {
    return `${promptBase}（已放入 ${submittedCount}/${requiredCount} 件）`
  }
  return promptBase
})

// 获取已提交的物品列表
const submittedItems = computed(() => {
  const sceneId = props.sceneData.id
  const selection = props.sceneData.itemSelection
  const key = (selection && selection.progressFlag) || (sceneId + "_submitted_items")
  const raw = store.run.flags[key]
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.filter((item) => typeof item === "string" && item)
})

// 提交物品
const submitItem = (item) => {
  const sceneId = props.sceneData.id
  const selection = props.sceneData.itemSelection
  const target = resolveItemSubmissionTarget(selection, item, sceneId)
  const isCorrect = target === (selection.correctTarget || target)
  const isFatal = selection.fatalTarget && target === selection.fatalTarget

  if (isCorrect) {
    // 处理正确提交
    const nextProgress = submittedItems.value.includes(item) 
      ? submittedItems.value.slice() 
      : submittedItems.value.concat(item)
    
    // 更新进度
    const key = (selection && selection.progressFlag) || (sceneId + "_submitted_items")
    store.setFlag(key, nextProgress)
    
    if (selection.consumeOnCorrect !== false) {
      store.removeItem(item)
    }
    
    const progressCount = nextProgress.length
    const requiredCount = Math.max(1, Number(selection.requiredCount || 1))
    
    if (requiredCount > 1 && progressCount < requiredCount) {
      // 多件提交中，继续停留在此场景
      feedbackMessage.value = `【${item}】已嵌入凹槽，当前进度 ${progressCount}/${requiredCount}。`
      alert(feedbackMessage.value)
      return
    }
    
    // 全部提交完成
    const completedFlag = selection.completedFlag || (sceneId + "_completed")
    store.setFlag(completedFlag, true)
    emit('success')
  } else if (isFatal) {
    // 处理致命错误
    if (selection.consumeOnFatal !== false) {
      store.removeItem(item)
    }
    alert('你提交了错误的物品，触发了陷阱！')
    emit('success')
  } else {
    // 处理普通错误
    if (selection.consumeOnWrong) {
      store.removeItem(item)
    }
    alert(`【${item}】似乎不能放在这里。`)
  }
}

// 解析物品提交的目标场景
const resolveItemSubmissionTarget = (selection, itemName, sceneId) => {
  if (!selection) {
    return sceneId
  }

  // 1. 优先使用自定义验证函数
  if (typeof selection.validator === "function") {
    try {
      const validatedTarget = selection.validator(itemName, store.run, sceneId)
      if (typeof validatedTarget === "string" && validatedTarget.trim()) {
        return validatedTarget.trim()
      }
    } catch (e) {
      console.error("Validator error:", e)
    }
  }

  // 2. 检查物品映射表
  if (selection.itemMap && selection.itemMap[itemName]) {
    return selection.itemMap[itemName]
  }

  // 3. 检查正确物品列表
  if (Array.isArray(selection.correctItems) && selection.correctItems.includes(itemName)) {
    return selection.correctTarget || sceneId
  }

  // 4. 检查致命物品列表（会导致即死或陷阱）
  if (Array.isArray(selection.fatalItems) && selection.fatalItems.includes(itemName)) {
    return selection.fatalTarget || selection.wrongTarget || sceneId
  }

  // 5. 检查致命关键字
  if (Array.isArray(selection.fatalKeywords) && 
      selection.fatalKeywords.some((kw) => kw && itemName.includes(kw))) {
    return selection.fatalTarget || selection.wrongTarget || sceneId
  }

  // 6. 默认返回错误目标
  return selection.wrongTarget || sceneId
}

// 返回上一场景
const goBack = () => {
  const selection = props.sceneData.itemSelection
  const backTarget = selection?.backTarget || props.sceneData.id
  store.selectOption(backTarget)
}
</script>

<style scoped>
.item-submission-ui {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d4af37;
  max-width: 400px;
  margin: 0 auto;
}

.item-submission-ui h3 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.item-btn {
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.item-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

.btn-container {
  display: flex;
  gap: 10px;
}

.back-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border-color: #d4af37;
}

.back-btn:hover {
  background: rgba(212, 175, 55, 0.4);
}

.cancel-btn {
  background: #444;
  color: white;
}

.cancel-btn:hover {
  background: #555;
}
</style>