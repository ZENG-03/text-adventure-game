<template>
  <div class="puzzle-container text-input-puzzle">
    <h3 class="puzzle-title">{{ sceneData.input?.title || '文字输入' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="input-container">
      <p class="prompt">{{ sceneData.input?.prompt || '请输入答案' }}</p>
      <input 
        v-model="answer" 
        @keyup.enter="submit" 
        :placeholder="placeholder"
        :type="inputType"
        class="input-field"
      />
      <div class="input-actions">
        <button class="submit-btn" @click="submit">
          确认
        </button>
        <button 
          v-if="hasHint" 
          class="hint-btn" 
          @click="showHint"
          :disabled="hintUsed"
        >
          {{ hintUsed ? '提示已使用' : '提示' }}
        </button>
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div v-if="hintVisible" class="hint-message">
      <strong>提示：</strong>{{ hint }}
    </div>
    
    <div v-if="showAttempts" class="attempts-info">
      尝试次数：{{ attempts }}/{{ maxAttempts }}
    </div>
    
    <div class="puzzle-actions">
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
const answer = ref('')
const errorMsg = ref('')
const attempts = ref(0)
const hintVisible = ref(false)
const hintUsed = ref(false)

const inputConfig = computed(() => props.sceneData.input || {})
const placeholder = computed(() => inputConfig.value.placeholder || '')
const inputType = computed(() => inputConfig.value.type || 'text')
const hint = computed(() => inputConfig.value.hint || '无提示')
const hasHint = computed(() => !!inputConfig.value.hint)
const maxAttempts = computed(() => inputConfig.value.maxAttempts || 3)
const showAttempts = computed(() => maxAttempts.value > 0)

onMounted(() => {
  // 重置状态
  answer.value = ''
  errorMsg.value = ''
  attempts.value = 0
  hintVisible.value = false
  hintUsed.value = false
})

const showHint = () => {
  hintVisible.value = true
  hintUsed.value = true
  // 可以添加提示使用的逻辑，比如扣除分数等
}

const submit = () => {
  const validate = inputConfig.value.validate
  const successTarget = inputConfig.value.successTarget
  const failMsg = inputConfig.value.failMsg || '答案错误'
  
  // 增加尝试次数
  attempts.value++
  
  // 验证逻辑
  let isValid = false
  
  if (typeof validate === 'function') {
    isValid = validate(answer.value)
  } else if (typeof validate === 'string') {
    isValid = answer.value.trim().toLowerCase() === validate.toLowerCase()
  }
  
  if (isValid) {
    // 成功
    errorMsg.value = ''
    emit('success', successTarget)
  } else {
    // 失败
    errorMsg.value = failMsg
    
    // 检查是否达到最大尝试次数
    if (maxAttempts.value > 0 && attempts.value >= maxAttempts.value) {
      // 达到最大尝试次数，可以触发特殊逻辑
      if (inputConfig.value.onMaxAttempts) {
        inputConfig.value.onMaxAttempts(attempts.value)
      }
    }
    
    // 触发失败回调
    if (inputConfig.value.onFail) {
      inputConfig.value.onFail(answer.value, attempts.value)
    }
    
    emit('fail')
  }
}
</script>

<style scoped>
.puzzle-container {
  max-width: 500px;
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

.input-container {
  margin-bottom: 25px;
}

.prompt {
  margin-bottom: 10px;
  font-size: 16px;
  color: #d4af37;
}

.input-field {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #d4af37;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #f4d03f;
  background: rgba(255, 255, 255, 0.15);
}

.input-field::placeholder {
  color: #888;
}

.input-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.submit-btn, .hint-btn, .close-btn {
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

.submit-btn:hover {
  background: #f4d03f;
  transform: translateY(-2px);
}

.hint-btn {
  background: #333;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.hint-btn:hover:not(:disabled) {
  background: #444;
  transform: translateY(-2px);
}

.hint-btn:disabled {
  background: #222;
  color: #666;
  border-color: #666;
  cursor: not-allowed;
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

.attempts-info {
  color: #d4af37;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.puzzle-actions {
  display: flex;
  justify-content: center;
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
