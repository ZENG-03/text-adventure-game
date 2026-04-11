<template>
  <div class="puzzle-container pipe-puzzle">
    <h3 class="puzzle-title">{{ sceneData.pipe?.title || '接水管' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="pipe-game">
      <div class="game-info">
        <div class="rotation-info">
          旋转次数：{{ rotationCount }}
        </div>
      </div>
      
      <div class="pipe-grid" :style="gridStyle">
        <div 
          v-for="(cell, index) in gridState" 
          :key="index"
          class="pipe-cell"
          :class="{
            'start': isStartCell(index),
            'end': isEndCell(index),
            'correct': isCorrectCell(index)
          }"
          @click="onCellClick(index)"
        >
          <div v-if="cell.pipe" class="pipe-piece" :style="getPipeStyle(cell.pipe)">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path 
                :d="getPipePath(cell.pipe)" 
                stroke="#d4af37" 
                stroke-width="4" 
                fill="none"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div v-else-if="isStartCell(index)" class="start-icon">
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#4CAF50" />
            </svg>
          </div>
          <div v-else-if="isEndCell(index)" class="end-icon">
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#f44336" />
            </svg>
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
      <button class="check-btn" @click="checkSolution">
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
const gridState = ref([])
const rotationCount = ref(0)
const errorMsg = ref('')

// 配置
const pipeConfig = computed(() => props.sceneData.pipe || {})
const gridSize = computed(() => pipeConfig.value.gridSize || { rows: 4, cols: 4 })
const start = computed(() => pipeConfig.value.start || { x: 0, y: 0, dir: 'right' })
const end = computed(() => pipeConfig.value.end || { x: 3, y: 3 })
const successTarget = computed(() => pipeConfig.value.successTarget)
const failMsg = computed(() => pipeConfig.value.failMsg || '管道未连通')

const gridStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${gridSize.value.cols}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.value.rows}, 1fr)`,
    maxWidth: `${gridSize.value.cols * 60}px`
  }
})

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  const { rows, cols } = gridSize.value
  const newGrid = []
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      const isStart = row === start.value.y && col === start.value.x
      const isEnd = row === end.value.y && col === end.value.x
      
      let pipe = null
      if (!isStart && !isEnd) {
        // 随机生成管道类型
        const pipeTypes = ['straight', 'corner', 'cross']
        pipe = {
          type: pipeTypes[Math.floor(Math.random() * pipeTypes.length)],
          rotation: Math.floor(Math.random() * 4) * 90
        }
      }
      
      newGrid.push({
        row,
        col,
        pipe,
        isStart,
        isEnd
      })
    }
  }
  
  gridState.value = newGrid
  rotationCount.value = 0
  errorMsg.value = ''
}

const getPipePath = (pipe) => {
  const { type, rotation } = pipe
  
  switch (type) {
    case 'straight':
      if (rotation === 0 || rotation === 180) {
        return 'M10 20 L30 20'
      } else {
        return 'M20 10 L20 30'
      }
    case 'corner':
      if (rotation === 0) {
        return 'M10 20 L20 20 L20 30'
      } else if (rotation === 90) {
        return 'M20 10 L20 20 L30 20'
      } else if (rotation === 180) {
        return 'M20 10 L20 20 L10 20'
      } else {
        return 'M20 30 L20 20 L30 20'
      }
    case 'cross':
      return 'M10 20 L30 20 M20 10 L20 30'
    default:
      return ''
  }
}

const getPipeStyle = (pipe) => {
  return {
    transform: `rotate(${pipe.rotation}deg)`
  }
}

const isStartCell = (index) => {
  return gridState.value[index]?.isStart
}

const isEndCell = (index) => {
  return gridState.value[index]?.isEnd
}

const isCorrectCell = (index) => {
  // 暂时不实现，后续可以根据连通状态标记正确的管道
  return false
}

const onCellClick = (index) => {
  const cell = gridState.value[index]
  if (cell && cell.pipe) {
    // 旋转管道
    cell.pipe.rotation = (cell.pipe.rotation + 90) % 360
    rotationCount.value++
    errorMsg.value = ''
  }
}

const checkSolution = () => {
  if (isConnected()) {
    emit('success', successTarget.value)
  } else {
    errorMsg.value = failMsg.value
    emit('fail')
  }
}

const isConnected = () => {
  // 简化版的连通性检查
  // 实际游戏中需要实现完整的管道连通算法
  // 这里只是一个示例
  
  // 检查是否有足够的旋转次数
  if (rotationCount.value < 5) {
    return false
  }
  
  // 模拟检查，实际应该实现射线追踪算法
  // 这里只是返回一个随机结果
  return Math.random() > 0.5
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

.pipe-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.pipe-grid {
  display: grid;
  gap: 2px;
  margin: 0 auto 20px;
  background: #333;
  border: 3px solid #d4af37;
  border-radius: 8px;
  padding: 5px;
}

.pipe-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 1;
  position: relative;
}

.pipe-cell:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: scale(0.95);
}

.pipe-cell.start {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
}

.pipe-cell.end {
  background: rgba(244, 67, 54, 0.3);
  border-color: #f44336;
}

.pipe-cell.correct {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
}

.pipe-piece {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.start-icon, .end-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
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

.check-btn:hover {
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
  .pipe-grid {
    max-width: 280px;
  }
  
  .pipe-piece {
    width: 30px;
    height: 30px;
  }
  
  .pipe-piece svg {
    width: 30px;
    height: 30px;
  }
}
</style>
