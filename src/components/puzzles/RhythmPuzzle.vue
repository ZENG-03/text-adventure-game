<template>
  <div class="puzzle-container rhythm-puzzle">
    <h3 class="puzzle-title">{{ sceneData.rhythm?.title || '节奏谜题' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="rhythm-game">
      <div class="game-status">
        <span v-if="gameState === 'waiting'" class="status-text">准备开始...</span>
        <span v-else-if="gameState === 'playing'" class="status-text">跟随节奏点击...</span>
        <span v-else-if="gameState === 'success'" class="status-text success">成功！</span>
        <span v-else-if="gameState === 'fail'" class="status-text error">错误！</span>
      </div>
      
      <div class="rhythm-display">
        <div class="rhythm-track">
          <div 
            v-for="(beat, index) in beats" 
            :key="index"
            class="beat"
            :class="{
              'active': activeBeats.includes(index),
              'correct': correctBeats.includes(index),
              'missed': missedBeats.includes(index)
            }"
          ></div>
        </div>
      </div>
      
      <div class="rhythm-buttons">
        <button 
          v-for="(button, index) in buttonCount" 
          :key="index"
          class="rhythm-btn"
          :class="{
            'active': activeButton === index,
            'pressed': pressedButtons.includes(index)
          }"
          @click="onButtonClick(index)"
          :disabled="gameState !== 'playing'"
        >
          {{ buttonLabels[index] || index + 1 }}
        </button>
      </div>
      
      <div class="game-info">
        <div class="score-info">
          分数：{{ score }} / {{ maxScore }}
        </div>
        <div class="accuracy-info">
          准确率：{{ accuracy }}%
        </div>
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div class="puzzle-actions">
      <button v-if="gameState === 'waiting'" class="start-btn" @click="startGame">
        开始游戏
      </button>
      <button v-else-if="gameState === 'fail'" class="restart-btn" @click="resetGame">
        重新开始
      </button>
      <button class="close-btn" @click="$emit('close')">
        返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../../store/gameStore'

const props = defineProps(['sceneData'])
const emit = defineEmits(['success', 'fail', 'close'])

const store = useGameStore()

// 游戏状态
const gameState = ref('waiting') // waiting, playing, success, fail
const beats = ref([])
const activeBeats = ref([])
const correctBeats = ref([])
const missedBeats = ref([])
const pressedButtons = ref([])
const activeButton = ref(null)
const score = ref(0)
const maxScore = ref(0)
const accuracy = ref(100)
const errorMsg = ref('')

// 定时器
let beatTimer = null
let gameTimer = null

// 配置
const rhythmConfig = computed(() => props.sceneData.rhythm || {})
const buttonCount = computed(() => rhythmConfig.value.buttonCount || 4)
const beatPattern = computed(() => rhythmConfig.value.beatPattern || [0, 1, 2, 3, 0, 1, 2, 3])
const beatInterval = computed(() => rhythmConfig.value.beatInterval || 500)
const successThreshold = computed(() => rhythmConfig.value.successThreshold || 0.8)
const successTarget = computed(() => rhythmConfig.value.successTarget)
const failMsg = computed(() => rhythmConfig.value.failMsg || '节奏错误')
const buttonLabels = computed(() => rhythmConfig.value.buttonLabels || [])

onMounted(() => {
  initializeGame()
})

onUnmounted(() => {
  clearTimers()
})

const clearTimers = () => {
  if (beatTimer) clearInterval(beatTimer)
  if (gameTimer) clearTimeout(gameTimer)
  beatTimer = null
  gameTimer = null
}

const initializeGame = () => {
  gameState.value = 'waiting'
  beats.value = [...beatPattern.value]
  activeBeats.value = []
  correctBeats.value = []
  missedBeats.value = []
  pressedButtons.value = []
  activeButton.value = null
  score.value = 0
  maxScore.value = beats.value.length
  accuracy.value = 100
  errorMsg.value = ''
  clearTimers()
}

const startGame = () => {
  initializeGame()
  gameState.value = 'playing'
  startBeatSequence()
}

const startBeatSequence = () => {
  let currentBeat = 0
  
  beatTimer = setInterval(() => {
    if (currentBeat < beats.value.length) {
      // 显示当前节拍
      activeButton.value = beats.value[currentBeat]
      activeBeats.value = [currentBeat]
      
      // 延迟清除
      setTimeout(() => {
        activeBeats.value = []
        // 检查是否错过
        if (!correctBeats.value.includes(currentBeat) && !missedBeats.value.includes(currentBeat)) {
          missedBeats.value.push(currentBeat)
          updateScore()
        }
      }, beatInterval.value * 0.8)
      
      currentBeat++
    } else {
      // 游戏结束
      clearInterval(beatTimer)
      beatTimer = null
      
      // 计算最终分数
      updateScore()
      
      // 检查是否成功
      const successRate = score.value / maxScore.value
      if (successRate >= successThreshold.value) {
        gameState.value = 'success'
        emit('success', successTarget.value)
      } else {
        gameState.value = 'fail'
        errorMsg.value = failMsg.value
        emit('fail')
      }
    }
  }, beatInterval.value)
}

const onButtonClick = (buttonIndex) => {
  if (gameState.value !== 'playing') return
  
  // 记录按下的按钮
  pressedButtons.value.push(buttonIndex)
  
  // 检查是否正确
  const currentBeat = activeBeats.value[0]
  if (currentBeat !== undefined) {
    if (buttonIndex === beats.value[currentBeat]) {
      // 正确
      correctBeats.value.push(currentBeat)
      score.value++
      updateScore()
    } else {
      // 错误
      missedBeats.value.push(currentBeat)
      updateScore()
    }
  }
  
  // 清除按下状态
  setTimeout(() => {
    pressedButtons.value = pressedButtons.value.filter(index => index !== buttonIndex)
  }, 200)
}

const updateScore = () => {
  const totalBeats = correctBeats.value.length + missedBeats.value.length
  if (totalBeats > 0) {
    accuracy.value = Math.round((correctBeats.value.length / totalBeats) * 100)
  }
}

const resetGame = () => {
  initializeGame()
  startGame()
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

.rhythm-game {
  margin-bottom: 30px;
}

.game-status {
  text-align: center;
  margin-bottom: 20px;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 4px;
  display: inline-block;
}

.status-text.success {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.status-text.error {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.rhythm-display {
  margin-bottom: 30px;
}

.rhythm-track {
  display: flex;
  gap: 5px;
  padding: 10px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  overflow-x: auto;
}

.beat {
  flex: 1;
  height: 20px;
  background: rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
  min-width: 20px;
}

.beat.active {
  background: #d4af37;
  animation: pulse 0.5s ease-in-out;
}

.beat.correct {
  background: #4CAF50;
}

.beat.missed {
  background: #f44336;
}

@keyframes pulse {
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(2);
  }
  100% {
    transform: scaleY(1);
  }
}

.rhythm-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.rhythm-btn {
  width: 80px;
  height: 80px;
  border: 3px solid #d4af37;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rhythm-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.4);
  transform: scale(1.05);
}

.rhythm-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.rhythm-btn.active {
  background: #d4af37;
  color: #000;
  animation: pulse 0.5s ease-in-out;
}

.rhythm-btn.pressed {
  background: #4CAF50;
  border-color: #4CAF50;
  color: #fff;
}

.rhythm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 14px;
  color: #d4af37;
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

.start-btn, .restart-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.start-btn {
  background: #d4af37;
  color: #000;
  font-weight: bold;
}

.start-btn:hover {
  background: #f4d03f;
  transform: translateY(-2px);
}

.restart-btn {
  background: #333;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.restart-btn:hover {
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

@media (max-width: 480px) {
  .rhythm-btn {
    width: 60px;
    height: 60px;
    font-size: 16px;
  }
  
  .rhythm-buttons {
    gap: 10px;
  }
}
</style>
