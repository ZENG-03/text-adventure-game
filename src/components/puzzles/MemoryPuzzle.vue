<template>
  <div class="puzzle-container memory-puzzle">
    <h3 class="puzzle-title">{{ sceneData.memory?.title || '记忆谜题' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="memory-game">
      <div class="game-status">
        <span v-if="gameState === 'waiting'" class="status-text">准备开始...</span>
        <span v-else-if="gameState === 'showing'" class="status-text">记住序列...</span>
        <span v-else-if="gameState === 'playing'" class="status-text">重复序列...</span>
        <span v-else-if="gameState === 'success'" class="status-text success">成功！</span>
        <span v-else-if="gameState === 'fail'" class="status-text error">错误！</span>
      </div>
      
      <div class="memory-grid">
        <div 
          v-for="(_, index) in gridSize" 
          :key="index"
          class="memory-cell"
          :class="{
            'active': activeCells.includes(index),
            'correct': correctCells.includes(index),
            'error': errorCells.includes(index)
          }"
          @click="onCellClick(index)"
          :disabled="gameState !== 'playing'"
        >
          {{ cellLabels[index] || index + 1 }}
        </div>
      </div>
      
      <div class="game-info">
        <div class="level-info">
          回合：{{ currentLevel }}/{{ maxLevel }}
        </div>
        <div class="sequence-info">
          序列长度：{{ currentSequence.length }}
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

const props = defineProps(['sceneData'])
const emit = defineEmits(['success', 'fail', 'close'])

// 游戏状态
const gameState = ref('waiting') // waiting, showing, playing, success, fail
const currentSequence = ref([])
const playerSequence = ref([])
const currentLevel = ref(1)
const activeCells = ref([])
const correctCells = ref([])
const errorCells = ref([])
const errorMsg = ref('')

// 定时器
let showTimer = null
let sequenceTimer = null

// 配置
const memoryConfig = computed(() => props.sceneData.memory || {})
const gridSize = computed(() => memoryConfig.value.gridSize || 4)
const maxLevel = computed(() => memoryConfig.value.maxLevel || 5)
const cellLabels = computed(() => memoryConfig.value.cellLabels || [])
const successTarget = computed(() => memoryConfig.value.successTarget)
const failMsg = computed(() => memoryConfig.value.failMsg || '记忆错误')

onMounted(() => {
  resetGame()
})

onUnmounted(() => {
  clearTimers()
})

const clearTimers = () => {
  if (showTimer) clearTimeout(showTimer)
  if (sequenceTimer) clearInterval(sequenceTimer)
  showTimer = null
  sequenceTimer = null
}

const resetGame = () => {
  gameState.value = 'waiting'
  currentSequence.value = []
  playerSequence.value = []
  currentLevel.value = 1
  activeCells.value = []
  correctCells.value = []
  errorCells.value = []
  errorMsg.value = ''
  clearTimers()
}

const startGame = () => {
  resetGame()
  gameState.value = 'showing'
  generateSequence()
  showSequence()
}

const generateSequence = () => {
  // 生成新的序列
  const newNumber = Math.floor(Math.random() * gridSize.value)
  currentSequence.value.push(newNumber)
}

const showSequence = () => {
  let index = 0
  activeCells.value = []
  
  sequenceTimer = setInterval(() => {
    if (index < currentSequence.value.length) {
      activeCells.value = [currentSequence.value[index]]
      index++
    } else {
      clearInterval(sequenceTimer)
      sequenceTimer = null
      
      // 延迟进入玩家输入阶段
      showTimer = setTimeout(() => {
        activeCells.value = []
        gameState.value = 'playing'
        playerSequence.value = []
        correctCells.value = []
        errorCells.value = []
      }, 500)
    }
  }, 1000)
}

const onCellClick = (index) => {
  if (gameState.value !== 'playing') return
  
  playerSequence.value.push(index)
  
  // 检查当前点击是否正确
  const currentIndex = playerSequence.value.length - 1
  if (playerSequence.value[currentIndex] === currentSequence.value[currentIndex]) {
    // 正确
    correctCells.value.push(index)
    
    // 检查是否完成当前回合
    if (playerSequence.value.length === currentSequence.value.length) {
      // 检查是否完成所有回合
      if (currentLevel.value >= maxLevel.value) {
        // 游戏成功
        gameState.value = 'success'
        emit('success', successTarget.value)
      } else {
        // 进入下一回合
        currentLevel.value++
        gameState.value = 'showing'
        generateSequence()
        showSequence()
      }
    }
  } else {
    // 错误
    errorCells.value.push(index)
    gameState.value = 'fail'
    errorMsg.value = failMsg.value
    
    // 触发失败回调
    if (memoryConfig.value.onFail) {
      memoryConfig.value.onFail(playerSequence.value, currentSequence.value)
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
  text-align: center;
}

.memory-game {
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
  background: rgba(76, 175, 55, 0.1);
}

.status-text.error {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  max-width: 300px;
  margin: 0 auto 20px;
}

@media (min-width: 400px) {
  .memory-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.memory-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.2);
  border: 2px solid #d4af37;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24px;
  font-weight: bold;
  user-select: none;
}

.memory-cell:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.4);
  transform: scale(1.05);
}

.memory-cell:active:not(:disabled) {
  transform: scale(0.95);
}

.memory-cell.active {
  background: #d4af37;
  color: #000;
  animation: pulse 0.5s ease-in-out;
}

.memory-cell.correct {
  background: #4CAF50;
  color: #fff;
  animation: pulse 0.5s ease-in-out;
}

.memory-cell.error {
  background: #f44336;
  color: #fff;
  animation: shake 0.5s ease-in-out;
}

.memory-cell:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
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
</style>
