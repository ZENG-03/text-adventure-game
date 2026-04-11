<template>
  <div class="jigsaw-puzzle-ui">
    <h3>{{ sceneData?.jigsaw?.prompt || '请完成拼图' }}</h3>
    <p class="instruction">{{ sceneData?.jigsaw?.instruction || '点击拼图块以交换位置' }}</p>
    
    <div class="puzzle-container">
      <div 
        v-for="(piece, index) in puzzlePieces" 
        :key="index"
        class="puzzle-piece"
        :class="{ 'selected': selectedIndex === index, 'correct': showResult && piece.correct }"
        @click="onPieceClick(index)"
        :style="{ backgroundColor: piece.color }"
      >
        <span class="piece-number">{{ piece.number }}</span>
      </div>
    </div>
    
    <div class="reference-image" v-if="sceneData?.jigsaw?.showReference">
      <p>参考图片：</p>
      <div class="reference-grid">
        <div 
          v-for="i in totalPieces" 
          :key="i"
          class="reference-cell"
          :style="{ backgroundColor: getCorrectColor(i - 1) }"
        >
          {{ i }}
        </div>
      </div>
    </div>
    
    <div class="feedback" v-if="feedbackMessage">{{ feedbackMessage }}</div>
    
    <div class="btn-container">
      <button class="check-btn" @click="checkAnswer" :disabled="showResult">
        检查答案
      </button>
      <button class="reset-btn" @click="resetPuzzle">
        重置
      </button>
      <button class="cancel-btn" @click="$emit('close')">
        取消
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../store/gameStore'

const props = defineProps({
  sceneData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])
const store = useGameStore()

// 拼图配置
const rows = computed(() => props.sceneData.jigsaw?.rows || 3)
const cols = computed(() => props.sceneData.jigsaw?.cols || 3)
const totalPieces = computed(() => rows.value * cols.value)

// 拼图块
const puzzlePieces = ref([])
const selectedIndex = ref(null)
const showResult = ref(false)
const feedbackMessage = ref('')

// 颜色配置
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#95a5a6']

// 初始化拼图
onMounted(() => {
  resetPuzzle()
})

// 重置拼图
const resetPuzzle = () => {
  const pieces = []
  for (let i = 0; i < totalPieces.value; i++) {
    pieces.push({
      number: i + 1,
      color: colors[i % colors.length],
      correct: false
    })
  }
  puzzlePieces.value = pieces.sort(() => Math.random() - 0.5)
  selectedIndex.value = null
  showResult.value = false
  feedbackMessage.value = ''
}

// 获取正确位置的颜色
const getCorrectColor = (index) => {
  return colors[index % colors.length]
}

// 点击拼图块
const onPieceClick = (index) => {
  if (showResult.value) return
  
  if (selectedIndex.value === null) {
    selectedIndex.value = index
  } else if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else {
    // 交换两个拼图块
    const temp = puzzlePieces.value[selectedIndex.value]
    puzzlePieces.value[selectedIndex.value] = puzzlePieces.value[index]
    puzzlePieces.value[index] = temp
    selectedIndex.value = null
  }
}

// 检查答案
const checkAnswer = () => {
  const isCorrect = puzzlePieces.value.every((piece, index) => {
    return piece.number === index + 1
  })
  
  showResult.value = true
  
  // 标记正确的拼图块
  puzzlePieces.value.forEach((piece, index) => {
    piece.correct = piece.number === index + 1
  })
  
  if (isCorrect) {
    feedbackMessage.value = '✓ 正确！拼图完成！'
    feedbackMessage.value = '✓ 正确！拼图完成！'
    
    if (props.sceneData.jigsaw?.onSuccess) {
      props.sceneData.jigsaw.onSuccess()
    }
    
    setTimeout(() => {
      emit('success')
    }, 1500)
  } else {
    const correctCount = puzzlePieces.value.filter((piece, index) => piece.number === index + 1).length
    feedbackMessage.value = `✗ 不正确。你有 ${correctCount}/${totalPieces.value} 个拼图块在正确位置。`
    feedbackMessage.value = `✗ 不正确。你有 ${correctCount}/${totalPieces.value} 个拼图块在正确位置。`
  }
}
</script>

<style scoped>  
.jigsaw-puzzle-ui {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d4af37;
  max-width: 500px;
  margin: 0 auto;
}

.jigsaw-puzzle-ui h3 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
}

.instruction {
  color: #aaa;
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 20px;
}

.puzzle-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-bottom: 20px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.puzzle-piece {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  font-size: 1.2em;
}

.puzzle-piece:hover {
  transform: scale(1.05);
  border-color: #d4af37;
}

.puzzle-piece.selected {
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.puzzle-piece.correct {
  border-color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.piece-number {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.reference-image {
  margin-bottom: 20px;
  text-align: center;
}

.reference-image p {
  color: #aaa;
  margin-bottom: 10px;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  max-width: 150px;
  margin: 0 auto;
}

.reference-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-size: 0.8em;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.feedback {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

</style>