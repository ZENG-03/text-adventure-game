<template>
  <div class="puzzle-container slider-puzzle">
    <h3 class="puzzle-title">{{ sceneData.slider?.title || '滑块拼图' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="slider-game">
      <div class="game-info">
        <div class="moves-info">
          步数：{{ moves }}
        </div>
        <div class="time-info">
          时间：{{ formatTime(timeElapsed) }}
        </div>
      </div>
      
      <div class="slider-grid" :style="gridStyle">
        <div 
          v-for="(tile, index) in tiles" 
          :key="index"
          class="slider-tile"
          :class="{
            'empty': tile === 0,
            'correct': isTileCorrect(index),
            'movable': isMovable(index)
          }"
          @click="onTileClick(index)"
          :style="getTileStyle(tile, index)"
        >
          <span v-if="tile !== 0">{{ tile }}</span>
        </div>
      </div>
      
      <div v-if="showPreview && sceneData.slider?.previewImage" class="preview-container">
        <h4>参考图片</h4>
        <img :src="sceneData.slider.previewImage" :alt="'拼图预览'" class="preview-image" />
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div class="puzzle-actions">
      <button class="reset-btn" @click="resetGame">
        重置
      </button>
      <button class="hint-btn" @click="showPreview = !showPreview">
        {{ showPreview ? '隐藏预览' : '显示预览' }}
      </button>
      <button class="close-btn" @click="$emit('close')">
        返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '../../store/gameStore'

const props = defineProps(['sceneData'])
const emit = defineEmits(['success', 'fail', 'close'])

const store = useGameStore()

// 游戏状态
const tiles = ref([])
const moves = ref(0)
const timeElapsed = ref(0)
const showPreview = ref(false)
const errorMsg = ref('')

// 定时器
let timer = null

// 配置
const sliderConfig = computed(() => props.sceneData.slider || {})
const gridSize = computed(() => sliderConfig.value.gridSize || 3)
const successTarget = computed(() => sliderConfig.value.successTarget)
const failMsg = computed(() => sliderConfig.value.failMsg || '拼图未完成')

const gridStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.value}, 1fr)`,
    maxWidth: `${gridSize.value * 80}px`
  }
})

onMounted(() => {
  initializeGame()
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

const initializeGame = () => {
  // 生成初始拼图
  const size = gridSize.value * gridSize.value
  tiles.value = Array.from({ length: size }, (_, i) => i)
  shuffleTiles()
  moves.value = 0
  timeElapsed.value = 0
  errorMsg.value = ''
  showPreview.value = false
}

const shuffleTiles = () => {
  // 随机打乱拼图
  let shuffled = [...tiles.value]
  do {
    shuffled = shuffled.sort(() => Math.random() - 0.5)
  } while (!isSolvable(shuffled) || isSolved(shuffled))
  tiles.value = shuffled
}

const isSolvable = (arr) => {
  // 检查拼图是否可解
  let inversions = 0
  const size = gridSize.value
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) continue
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === 0) continue
      if (arr[i] > arr[j]) inversions++
    }
  }
  
  if (size % 2 === 1) {
    return inversions % 2 === 0
  } else {
    const emptyRow = Math.floor(arr.indexOf(0) / size) + 1
    return (inversions + emptyRow) % 2 === 1
  }
}

const isSolved = (arr) => {
  // 检查拼图是否完成
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== i) return false
  }
  return true
}

const isTileCorrect = (index) => {
  return tiles.value[index] === index
}

const isMovable = (index) => {
  if (tiles.value[index] === 0) return false
  const emptyIndex = tiles.value.indexOf(0)
  return areAdjacent(index, emptyIndex)
}

const areAdjacent = (index1, index2) => {
  const size = gridSize.value
  const row1 = Math.floor(index1 / size)
  const col1 = index1 % size
  const row2 = Math.floor(index2 / size)
  const col2 = index2 % size
  
  return (Math.abs(row1 - row2) === 1 && col1 === col2) || 
         (Math.abs(col1 - col2) === 1 && row1 === row2)
}

const onTileClick = (index) => {
  if (!isMovable(index)) return
  
  // 交换 tiles
  const emptyIndex = tiles.value.indexOf(0)
  ;[tiles.value[index], tiles.value[emptyIndex]] = [tiles.value[emptyIndex], tiles.value[index]]
  moves.value++
  
  // 检查是否完成
  if (isSolved(tiles.value)) {
    stopTimer()
    emit('success', successTarget.value)
  }
}

const getTileStyle = (tile, index) => {
  if (tile === 0) return {}
  
  const size = gridSize.value
  const row = Math.floor(index / size)
  const col = index % size
  
  return {
    backgroundPosition: `${(tile - 1) % size * -100}% ${Math.floor((tile - 1) / size) * -100}%`
  }
}

const resetGame = () => {
  initializeGame()
  startTimer()
}

const startTimer = () => {
  stopTimer()
  timer = setInterval(() => {
    timeElapsed.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

.slider-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.slider-grid {
  display: grid;
  gap: 2px;
  margin: 0 auto 20px;
  background: #333;
  border: 3px solid #d4af37;
  border-radius: 8px;
  padding: 5px;
  aspect-ratio: 1;
}

.slider-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid #d4af37;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  position: relative;
}

.slider-tile:hover:not(.empty) {
  background: rgba(212, 175, 55, 0.4);
  transform: scale(0.95);
}

.slider-tile.empty {
  background: transparent;
  border: none;
  cursor: default;
}

.slider-tile.correct {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  animation: pulse 0.5s ease-in-out;
}

.slider-tile.movable {
  animation: pulse 0.3s ease-in-out infinite;
  animation-direction: alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

.preview-container {
  margin-top: 20px;
  text-align: center;
}

.preview-container h4 {
  color: #d4af37;
  margin-bottom: 10px;
}

.preview-image {
  max-width: 200px;
  border: 2px solid #d4af37;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
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

.reset-btn, .hint-btn, .close-btn {
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

.hint-btn {
  background: #333;
  color: #fff;
  border: 1px solid #666;
}

.hint-btn:hover {
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
  .slider-grid {
    max-width: 240px;
  }
  
  .slider-tile {
    font-size: 16px;
  }
}
</style>
