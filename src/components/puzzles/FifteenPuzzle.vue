<template>
  <div class="puzzle-container fifteen-puzzle">
    <h3 class="puzzle-title">{{ sceneData.fifteen?.title || '数字推盘' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="fifteen-game">
      <div class="game-info">
        <div class="moves-info">
          步数：{{ moves }}
        </div>
      </div>
      
      <div class="fifteen-grid" :style="gridStyle">
        <div 
          v-for="(number, index) in puzzleState" 
          :key="index"
          class="fifteen-tile"
          :class="{
            'empty': number === null,
            'movable': isMovable(index),
            'correct': isCorrect(index)
          }"
          @click="onTileClick(index)"
        >
          <span v-if="number !== null">{{ number }}</span>
        </div>
      </div>
      
      <div v-if="showPreview && sceneData.fifteen?.previewImage" class="preview-container">
        <h4>参考图片</h4>
        <img :src="sceneData.fifteen.previewImage" :alt="'拼图预览'" class="preview-image" />
      </div>
    </div>
    
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    
    <div class="puzzle-actions">
      <button class="reset-btn" @click="resetGame">
        重置
      </button>
      <button v-if="!showPreview && sceneData.fifteen?.previewImage" class="hint-btn" @click="showPreview = !showPreview">
        {{ showPreview ? '隐藏预览' : '显示预览' }}
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
const puzzleState = ref([])
const moves = ref(0)
const showPreview = ref(false)
const errorMsg = ref('')

// 配置
const fifteenConfig = computed(() => props.sceneData.fifteen || {})
const gridSize = computed(() => fifteenConfig.value.size || 4)
const successTarget = computed(() => fifteenConfig.value.successTarget)
const failMsg = computed(() => fifteenConfig.value.failMsg || '拼图未完成')

const gridStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.value}, 1fr)`,
    maxWidth: `${gridSize.value * 70}px`
  }
})

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  // 生成初始拼图
  const size = gridSize.value * gridSize.value
  const initialState = Array.from({ length: size }, (_, i) => i + 1)
  initialState[size - 1] = null // 最后一个位置为空
  
  // 打乱拼图
  puzzleState.value = shufflePuzzle([...initialState])
  moves.value = 0
  errorMsg.value = ''
  showPreview.value = false
}

const shufflePuzzle = (puzzle) => {
  // 打乱拼图，确保可解
  let shuffled = [...puzzle]
  do {
    shuffled = shuffled.sort(() => Math.random() - 0.5)
  } while (!isSolvable(shuffled) || isSolved(shuffled))
  return shuffled
}

const isSolvable = (puzzle) => {
  // 检查拼图是否可解
  let inversions = 0
  const size = gridSize.value
  
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] === null) continue
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[j] === null) continue
      if (puzzle[i] > puzzle[j]) inversions++
    }
  }
  
  if (size % 2 === 1) {
    return inversions % 2 === 0
  } else {
    const emptyRow = Math.floor(puzzle.indexOf(null) / size) + 1
    return (inversions + emptyRow) % 2 === 1
  }
}

const isSolved = (puzzle) => {
  // 检查拼图是否完成
  for (let i = 0; i < puzzle.length - 1; i++) {
    if (puzzle[i] !== i + 1) return false
  }
  return puzzle[puzzle.length - 1] === null
}

const getEmptyIndex = () => {
  return puzzleState.value.indexOf(null)
}

const isMovable = (index) => {
  if (puzzleState.value[index] === null) return false
  const emptyIndex = getEmptyIndex()
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

const isCorrect = (index) => {
  if (index === puzzleState.value.length - 1) {
    return puzzleState.value[index] === null
  }
  return puzzleState.value[index] === index + 1
}

const onTileClick = (index) => {
  if (!isMovable(index)) return
  
  // 交换 tiles
  const emptyIndex = getEmptyIndex()
  ;[puzzleState.value[index], puzzleState.value[emptyIndex]] = [puzzleState.value[emptyIndex], puzzleState.value[index]]
  moves.value++
  
  // 检查是否完成
  if (isSolved(puzzleState.value)) {
    emit('success', successTarget.value)
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

.fifteen-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.fifteen-grid {
  display: grid;
  gap: 2px;
  margin: 0 auto 20px;
  background: #333;
  border: 3px solid #d4af37;
  border-radius: 8px;
  padding: 5px;
  aspect-ratio: 1;
}

.fifteen-tile {
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

.fifteen-tile:hover:not(.empty) {
  background: rgba(212, 175, 55, 0.4);
  transform: scale(0.95);
}

.fifteen-tile.empty {
  background: transparent;
  border: none;
  cursor: default;
}

.fifteen-tile.correct {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
}

.fifteen-tile.movable {
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
  .fifteen-grid {
    max-width: 280px;
  }
  
  .fifteen-tile {
    font-size: 16px;
  }
}
</style>
