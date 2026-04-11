<template>
  <div class="puzzle-container instrument-puzzle">
    <h3 class="puzzle-title">{{ sceneData.instrument?.title || '乐器演奏' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="instrument-game">
      <div class="game-info">
        <div class="progress-info">
          进度：{{ currentStep }} / {{ targetSequence.length }}
        </div>
      </div>
      
      <div class="instrument-container">
        <div class="instrument-keys">
          <div 
            v-for="(key, index) in keys" 
            :key="index"
            class="instrument-key"
            :class="{
              'active': isKeyActive(index),
              'correct': isKeyCorrect(index),
              'error': isKeyError(index)
            }"
            @click="onKeyClick(index)"
          >
            <span class="key-label">{{ key.label }}</span>
          </div>
        </div>
        
        <div class="sequence-display">
          <div class="sequence-title">目标序列</div>
          <div class="sequence-steps">
            <div 
              v-for="(step, index) in targetSequence" 
              :key="index"
              class="sequence-step"
              :class="{
                'completed': index < currentStep,
                'current': index === currentStep
              }"
            >
              {{ step }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div class="puzzle-actions">
      <button class="reset-btn" @click="resetGame">
        重置
      </button>
      <button class="play-btn" @click="playSequence">
        播放序列
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

// 游戏状态
const currentStep = ref(0)
const userSequence = ref([])
const keyStates = ref([])
const errorMsg = ref('')

// 配置
const instrumentConfig = computed(() => props.sceneData.instrument || {})
const keys = computed(() => instrumentConfig.value.keys || [
  { label: 'C' },
  { label: 'D' },
  { label: 'E' },
  { label: 'F' },
  { label: 'G' },
  { label: 'A' },
  { label: 'B' }
])
const targetSequence = computed(() => instrumentConfig.value.sequence || ['C', 'E', 'G', 'C'])
const successTarget = computed(() => instrumentConfig.value.successTarget)
const failMsg = computed(() => instrumentConfig.value.failMsg || '演奏错误')

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  currentStep.value = 0
  userSequence.value = []
  keyStates.value = Array(keys.value.length).fill('')
  errorMsg.value = ''
}

const isKeyActive = (index) => {
  return keyStates.value[index] === 'active'
}

const isKeyCorrect = (index) => {
  return keyStates.value[index] === 'correct'
}

const isKeyError = (index) => {
  return keyStates.value[index] === 'error'
}

const onKeyClick = (index) => {
  const key = keys.value[index]
  
  // 检查是否是当前步骤的正确键
  if (key.label === targetSequence.value[currentStep.value]) {
    // 正确
    keyStates.value[index] = 'correct'
    userSequence.value.push(key.label)
    currentStep.value++
    
    // 检查是否完成
    if (currentStep.value === targetSequence.value.length) {
      emit('success', successTarget.value)
    }
  } else {
    // 错误
    keyStates.value[index] = 'error'
    errorMsg.value = failMsg.value
    
    // 重置当前步骤
    setTimeout(() => {
      keyStates.value[index] = ''
      errorMsg.value = ''
    }, 1000)
  }
}

const playSequence = () => {
  // 播放目标序列
  let step = 0
  const interval = setInterval(() => {
    if (step < targetSequence.value.length) {
      const keyIndex = keys.value.findIndex(k => k.label === targetSequence.value[step])
      if (keyIndex !== -1) {
        keyStates.value[keyIndex] = 'active'
        setTimeout(() => {
          keyStates.value[keyIndex] = ''
        }, 300)
      }
      step++
    } else {
      clearInterval(interval)
    }
  }, 500)
}

const resetGame = () => {
  initializeGame()
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
  text-align: center;
}

.instrument-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.instrument-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.instrument-keys {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.instrument-key {
  width: 60px;
  height: 80px;
  background: #333;
  border: 2px solid #d4af37;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.instrument-key:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.instrument-key.active {
  background: rgba(212, 175, 55, 0.4);
  transform: scale(0.95);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
}

.instrument-key.correct {
  background: rgba(76, 175, 80, 0.4);
  border-color: #4CAF50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
}

.instrument-key.error {
  background: rgba(244, 67, 54, 0.4);
  border-color: #f44336;
  box-shadow: 0 0 20px rgba(244, 67, 54, 0.6);
}

.key-label {
  font-size: 20px;
  font-weight: bold;
  color: #d4af37;
}

.sequence-display {
  text-align: center;
  width: 100%;
}

.sequence-title {
  color: #d4af37;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.sequence-steps {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.sequence-step {
  width: 40px;
  height: 40px;
  background: #333;
  border: 2px solid #666;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #999;
  transition: all 0.3s ease;
}

.sequence-step.completed {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  color: #4CAF50;
}

.sequence-step.current {
  background: rgba(212, 175, 55, 0.3);
  border-color: #d4af37;
  color: #d4af37;
  animation: pulse 1s ease-in-out infinite;
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

.puzzle-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.reset-btn, .play-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.reset-btn {
  background: #333;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.reset-btn:hover {
  background: #444;
  transform: translateY(-2px);
}

.play-btn {
  background: #d4af37;
  color: #000;
  font-weight: bold;
}

.play-btn:hover {
  background: #f4d03f;
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

@media (max-width: 480px) {
  .instrument-keys {
    gap: 5px;
  }
  
  .instrument-key {
    width: 50px;
    height: 70px;
  }
  
  .key-label {
    font-size: 16px;
  }
  
  .sequence-steps {
    gap: 10px;
  }
  
  .sequence-step {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
}
</style>
