<template>
  <div class="puzzle-container reflection-puzzle">
    <h3 class="puzzle-title">{{ sceneData.reflection?.title || '镜面反射' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="reflection-game">
      <div class="game-info">
        <div class="mirror-info">
          镜子数量：{{ mirrorCount }}
        </div>
      </div>
      
      <div class="reflection-grid" :style="gridStyle">
        <div 
          v-for="(cell, index) in gridState" 
          :key="index"
          class="reflection-cell"
          :class="{
            'start': isStartCell(index),
            'target': isTargetCell(index),
            'mirror': hasMirror(index),
            'light': isLightPath(index),
            'correct': isCorrectCell(index)
          }"
          @click="onCellClick(index)"
        >
          <div v-if="isStartCell(index)" class="start-icon">
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#FFD700" />
            </svg>
          </div>
          <div v-else-if="isTargetCell(index)" class="target-icon">
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#f44336" />
            </svg>
          </div>
          <div v-else-if="hasMirror(index)" class="mirror-piece" :style="getMirrorStyle(cell.mirror)">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <line 
                x1="10" 
                y1="10" 
                x2="30" 
                y2="30" 
                stroke="#d4af37" 
                stroke-width="3" 
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div v-else-if="isLightPath(index)" class="light-path">
            <div class="light-dot"></div>
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
const lightPath = ref([])
const mirrorCount = ref(0)
const errorMsg = ref('')

// 配置
const reflectionConfig = computed(() => props.sceneData.reflection || {})
const gridSize = computed(() => reflectionConfig.value.gridSize || { rows: 5, cols: 5 })
const start = computed(() => reflectionConfig.value.start || { x: 0, y: 2, dir: 'east' })
const targets = computed(() => reflectionConfig.value.targets || [{ x: 4, y: 2, color: 'red' }])
const mirrors = computed(() => reflectionConfig.value.mirrors || [])
const successTarget = computed(() => reflectionConfig.value.successTarget)
const failMsg = computed(() => reflectionConfig.value.failMsg || '光线未到达目标')

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
      const isTarget = targets.value.some(target => target.y === row && target.x === col)
      
      let mirror = null
      const mirrorConfig = mirrors.value.find(m => m.y === row && m.x === col)
      if (mirrorConfig) {
        mirror = {
          type: mirrorConfig.type || 'double',
          rotation: mirrorConfig.rotation || 0
        }
        mirrorCount.value++
      }
      
      newGrid.push({
        row,
        col,
        mirror,
        isStart,
        isTarget
      })
    }
  }
  
  gridState.value = newGrid
  lightPath.value = []
  errorMsg.value = ''
  
  // 计算初始光线路径
  calculateLightPath()
}

const isStartCell = (index) => {
  return gridState.value[index]?.isStart
}

const isTargetCell = (index) => {
  return gridState.value[index]?.isTarget
}

const hasMirror = (index) => {
  return !!gridState.value[index]?.mirror
}

const isLightPath = (index) => {
  return lightPath.value.includes(index)
}

const isCorrectCell = (index) => {
  // 暂时不实现，后续可以根据光线是否到达目标标记正确的镜子
  return false
}

const getMirrorStyle = (mirror) => {
  return {
    transform: `rotate(${mirror.rotation}deg)`
  }
}

const onCellClick = (index) => {
  const cell = gridState.value[index]
  if (cell && cell.mirror) {
    // 旋转镜子
    cell.mirror.rotation = (cell.mirror.rotation + 45) % 360
    calculateLightPath()
    errorMsg.value = ''
  }
}

const calculateLightPath = () => {
  // 简化版的光线路径计算
  // 实际游戏中需要实现完整的光线反射算法
  const newLightPath = []
  const { rows, cols } = gridSize.value
  
  // 从起点开始
  let currentX = start.value.x
  let currentY = start.value.y
  let direction = start.value.dir
  
  // 模拟光线路径
  for (let i = 0; i < 20; i++) { // 限制最大步数
    const index = currentY * cols + currentX
    newLightPath.push(index)
    
    // 检查是否到达目标
    if (gridState.value[index]?.isTarget) {
      break
    }
    
    // 检查是否遇到镜子
    if (gridState.value[index]?.mirror) {
      // 简单的反射逻辑
      direction = (direction === 'east') ? 'north' : 'east'
    }
    
    // 移动到下一个位置
    switch (direction) {
      case 'east':
        currentX++
        break
      case 'west':
        currentX--
        break
      case 'north':
        currentY--
        break
      case 'south':
        currentY++
        break
    }
    
    // 检查是否超出边界
    if (currentX < 0 || currentX >= cols || currentY < 0 || currentY >= rows) {
      break
    }
  }
  
  lightPath.value = newLightPath
}

const checkSolution = () => {
  if (isLightReachedTarget()) {
    emit('success', successTarget.value)
  } else {
    errorMsg.value = failMsg.value
    emit('fail')
  }
}

const isLightReachedTarget = () => {
  // 检查光线是否到达目标
  for (const target of targets.value) {
    const targetIndex = target.y * gridSize.value.cols + target.x
    if (lightPath.value.includes(targetIndex)) {
      return true
    }
  }
  return false
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

.reflection-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.reflection-grid {
  display: grid;
  gap: 2px;
  margin: 0 auto 20px;
  background: #333;
  border: 3px solid #d4af37;
  border-radius: 8px;
  padding: 5px;
}

.reflection-cell {
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

.reflection-cell:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: scale(0.95);
}

.reflection-cell.start {
  background: rgba(255, 215, 0, 0.3);
  border-color: #FFD700;
}

.reflection-cell.target {
  background: rgba(244, 67, 54, 0.3);
  border-color: #f44336;
}

.reflection-cell.mirror {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

.reflection-cell.light {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
}

.reflection-cell.correct {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
}

.start-icon, .target-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.mirror-piece {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.light-path {
  position: relative;
  width: 100%;
  height: 100%;
}

.light-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #FFD700;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #FFD700;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
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
  .reflection-grid {
    max-width: 280px;
  }
  
  .mirror-piece {
    width: 30px;
    height: 30px;
  }
  
  .mirror-piece svg {
    width: 30px;
    height: 30px;
  }
}
</style>
