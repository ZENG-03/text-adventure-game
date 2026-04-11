<template>
  <div class="puzzle-container chemistry-puzzle">
    <h3 class="puzzle-title">{{ sceneData.chemistry?.title || '化学配平' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="chemistry-game">
      <div class="game-info">
        <div class="reaction-info">
          反应：{{ currentReaction }}
        </div>
      </div>
      
      <div class="chemistry-container">
        <div class="reactants-section">
          <h4>反应物</h4>
          <div class="elements-grid">
            <div 
              v-for="(element, index) in elements" 
              :key="index"
              class="element-item"
              :class="{
                'selected': isElementSelected(element)
              }"
              @click="toggleElement(element)"
            >
              <span class="element-symbol">{{ element.symbol }}</span>
              <span class="element-name">{{ element.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="reaction-section">
          <div class="reaction-formula">
            <div class="reactants">
              <span v-for="(reactant, index) in selectedReactants" :key="index" class="reactant">
                {{ reactant.symbol }}
              </span>
            </div>
            <div class="arrow">→</div>
            <div class="products">
              <span v-for="(product, index) in products" :key="index" class="product">
                {{ product.symbol }}
              </span>
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
const selectedReactants = ref([])
const products = ref([])
const errorMsg = ref('')

// 配置
const chemistryConfig = computed(() => props.sceneData.chemistry || {})
const elements = computed(() => chemistryConfig.value.elements || [
  { symbol: 'H', name: '氢' },
  { symbol: 'O', name: '氧' },
  { symbol: 'C', name: '碳' },
  { symbol: 'N', name: '氮' },
  { symbol: 'Na', name: '钠' },
  { symbol: 'Cl', name: '氯' }
])
const reactions = computed(() => chemistryConfig.value.reactions || [
  {
    reactants: ['H', 'O'],
    products: ['H2O'],
    description: '水的合成'
  }
])
const successTarget = computed(() => chemistryConfig.value.successTarget)
const failMsg = computed(() => chemistryConfig.value.failMsg || '配平失败')

const currentReaction = computed(() => {
  return reactions.value[0]?.description || '未知反应'
})

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  selectedReactants.value = []
  products.value = []
  errorMsg.value = ''
}

const isElementSelected = (element) => {
  return selectedReactants.value.some(reactant => reactant.symbol === element.symbol)
}

const toggleElement = (element) => {
  const index = selectedReactants.value.findIndex(reactant => reactant.symbol === element.symbol)
  if (index === -1) {
    selectedReactants.value.push(element)
  } else {
    selectedReactants.value.splice(index, 1)
  }
  errorMsg.value = ''
}

const checkSolution = () => {
  if (isReactionCorrect()) {
    emit('success', successTarget.value)
  } else {
    errorMsg.value = failMsg.value
    emit('fail')
  }
}

const isReactionCorrect = () => {
  // 检查反应是否正确
  const reactantSymbols = selectedReactants.value.map(r => r.symbol).sort()
  
  for (const reaction of reactions.value) {
    if (arraysEqual(reactantSymbols, reaction.reactants.sort())) {
      products.value = reaction.products.map(p => ({ symbol: p, name: p }))
      return true
    }
  }
  return false
}

const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
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

.chemistry-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.chemistry-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.reactants-section {
  text-align: center;
}

.reactants-section h4 {
  color: #d4af37;
  margin-bottom: 15px;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.element-item {
  padding: 15px;
  background: #333;
  border: 2px solid #666;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.element-item:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  transform: translateY(-5px);
}

.element-item.selected {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.element-symbol {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 5px;
}

.element-name {
  display: block;
  font-size: 12px;
  color: #999;
}

.reaction-section {
  text-align: center;
  margin: 20px 0;
}

.reaction-formula {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  border: 2px solid #d4af37;
}

.reactants, .products {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.reactant, .product {
  padding: 10px 15px;
  background: #333;
  border: 1px solid #d4af37;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  color: #d4af37;
}

.arrow {
  font-size: 24px;
  color: #d4af37;
  font-weight: bold;
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
  .elements-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .element-item {
    padding: 10px;
  }
  
  .element-symbol {
    font-size: 20px;
  }
  
  .reaction-formula {
    flex-direction: column;
    gap: 10px;
  }
  
  .reactants, .products {
    gap: 5px;
  }
  
  .reactant, .product {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>
