<template>
  <div class="puzzle-container pattern-puzzle">
    <h3 class="puzzle-title">{{ sceneData.pattern?.title || '图形识别' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="pattern-game">
      <div class="game-info">
        <div class="pattern-info">
          找出规律并选择正确的图形
        </div>
      </div>
      
      <div class="pattern-container">
        <div class="pattern-grid">
          <div 
            v-for="(cell, index) in patternGrid" 
            :key="index"
            class="pattern-cell"
            :class="{
              'empty': cell === null,
              'selected': selectedAnswer === index
            }"
            @click="selectAnswer(index)"
          >
            <div v-if="cell" class="pattern-shape" :style="getShapeStyle(cell)"></div>
            <div v-else class="empty-cell">?</div>
          </div>
        </div>
        
        <div class="options-grid">
          <div 
            v-for="(option, index) in options" 
            :key="index"
            class="option-item"
            :class="{
              'selected': selectedOption === index
            }"
            @click="selectOption(index)"
          >
            <div class="pattern-shape" :style="getShapeStyle(option)"></div>
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
      <button class="check-btn" @click="checkSolution" :disabled="!selectedOption">
        检查
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
const selectedAnswer = ref(null)
const selectedOption = ref(null)
const errorMsg = ref('')

// 配置
const patternConfig = computed(() => props.sceneData.pattern || {})
const patternGrid = computed(() => patternConfig.value.grid || [
  { shape: 'circle', color: '#FF6B6B' },
  { shape: 'square', color: '#4ECDC4' },
  { shape: 'triangle', color: '#FFD166' },
  { shape: 'circle', color: '#4ECDC4' },
  { shape: 'square', color: '#FFD166' },
  { shape: 'triangle', color: '#FF6B6B' },
  { shape: 'circle', color: '#FFD166' },
  { shape: 'square', color: '#FF6B6B' },
  null // 空单元格，需要用户选择
])
const options = computed(() => patternConfig.value.options || [
  { shape: 'triangle', color: '#4ECDC4' },
  { shape: 'circle', color: '#4ECDC4' },
  { shape: 'square', color: '#4ECDC4' },
  { shape: 'triangle', color: '#FFD166' }
])
const correctAnswer = computed(() => patternConfig.value.correctAnswer || 0)
const successTarget = computed(() => patternConfig.value.successTarget)
const failMsg = computed(() => patternConfig.value.failMsg || '选择错误')

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  selectedAnswer.value = null
  selectedOption.value = null
  errorMsg.value = ''
}

const getShapeStyle = (shapeData) => {
  if (!shapeData) return {}
  
  const styles = {
    backgroundColor: shapeData.color
  }
  
  switch (shapeData.shape) {
    case 'circle':
      styles.borderRadius = '50%'
      break
    case 'triangle':
      styles.width = '0'
      styles.height = '0'
      styles.backgroundColor = 'transparent'
      styles.borderLeft = '20px solid transparent'
      styles.borderRight = '20px solid transparent'
      styles.borderBottom = `40px solid ${shapeData.color}`
      break
    case 'square':
      // 默认就是正方形
      break
  }
  
  return styles
}

const selectAnswer = (index) => {
  selectedAnswer.value = index
  errorMsg.value = ''
}

const selectOption = (index) => {
  selectedOption.value = index
  errorMsg.value = ''
}

const checkSolution = () => {
  if (selectedOption === correctAnswer.value) {
    emit('success', successTarget.value)
  } else {
    errorMsg.value = failMsg.value
    emit('fail')
  }
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

.pattern-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.pattern-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-width: 300px;
  margin: 0 auto;
}

.pattern-cell {
  width: 80px;
  height: 80px;
  background: #333;
  border: 2px solid #666;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.pattern-cell:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  transform: translateY(-5px);
}

.pattern-cell.selected {
  border-color: #4CAF50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.pattern-shape {
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.empty-cell {
  font-size: 32px;
  color: #999;
  font-weight: bold;
}

.options-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 400px;
}

.option-item {
  width: 80px;
  height: 80px;
  background: #333;
  border: 2px solid #666;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  transform: translateY(-5px);
}

.option-item.selected {
  border-color: #4CAF50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
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

.reset-btn, .check-btn, .close-btn {
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

.check-btn {
  background: #d4af37;
  color: #000;
  font-weight: bold;
}

.check-btn:hover:not(:disabled) {
  background: #f4d03f;
  transform: translateY(-2px);
}

.check-btn:disabled {
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

@media (max-width: 480px) {
  .pattern-grid {
    gap: 10px;
  }
  
  .pattern-cell {
    width: 60px;
    height: 60px;
  }
  
  .pattern-shape {
    width: 30px;
    height: 30px;
  }
  
  .options-grid {
    gap: 15px;
  }
  
  .option-item {
    width: 60px;
    height: 60px;
  }
}
</style>
