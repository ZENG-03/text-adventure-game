<template>
  <div class="puzzle-container astrolabe-puzzle">
    <h3 class="puzzle-title">{{ sceneData.astrolabe?.title || '星盘校准' }}</h3>
    <p class="puzzle-desc">{{ sceneData.desc || '' }}</p>
    
    <div class="astrolabe-game">
      <div class="game-info">
        <div class="rotation-info">
          旋转角度：{{ rotationAngle }}°
        </div>
      </div>
      
      <div class="astrolabe-container">
        <div class="astrolabe-base">
          <div class="astrolabe-dial" :style="dialStyle" @click="onDialClick">
            <div class="dial-center"></div>
            <div 
              v-for="(marker, index) in markers" 
              :key="index"
              class="dial-marker"
              :style="getMarkerStyle(marker)"
            >
              <span class="marker-text">{{ marker.label }}</span>
            </div>
          </div>
        </div>
        
        <div class="target-indicator">
          <div class="target-line"></div>
          <div class="target-label">目标位置</div>
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
const rotationAngle = ref(0)
const errorMsg = ref('')

// 配置
const astrolabeConfig = computed(() => props.sceneData.astrolabe || {})
const markers = computed(() => astrolabeConfig.value.markers || [
  { label: '春分', angle: 0 },
  { label: '夏至', angle: 90 },
  { label: '秋分', angle: 180 },
  { label: '冬至', angle: 270 }
])
const targetAngle = computed(() => astrolabeConfig.value.targetAngle || 0)
const successTarget = computed(() => astrolabeConfig.value.successTarget)
const failMsg = computed(() => astrolabeConfig.value.failMsg || '校准失败')

const dialStyle = computed(() => {
  return {
    transform: `rotate(${rotationAngle.value}deg)`
  }
})

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  // 随机初始角度
  rotationAngle.value = Math.floor(Math.random() * 360)
  errorMsg.value = ''
}

const getMarkerStyle = (marker) => {
  const angle = marker.angle - rotationAngle.value
  return {
    transform: `rotate(${angle}deg) translateY(-100px)`
  }
}

const onDialClick = (event) => {
  const dial = event.currentTarget
  const rect = dial.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI
  rotationAngle.value = (angle + 90 + 360) % 360
  errorMsg.value = ''
}

const checkSolution = () => {
  if (isCalibrated()) {
    emit('success', successTarget.value)
  } else {
    errorMsg.value = failMsg.value
    emit('fail')
  }
}

const isCalibrated = () => {
  // 检查是否校准到目标角度（允许一定误差）
  const difference = Math.abs(rotationAngle.value - targetAngle.value)
  return difference < 5 || (360 - difference) < 5
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

.astrolabe-game {
  margin-bottom: 30px;
}

.game-info {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #d4af37;
}

.astrolabe-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.astrolabe-base {
  position: relative;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #1a1a2e 0%, #16213e 100%);
  border: 3px solid #d4af37;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.astrolabe-dial {
  position: relative;
  width: 240px;
  height: 240px;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid #d4af37;
  border-radius: 50%;
  top: 20px;
  left: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.astrolabe-dial:hover {
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
}

.dial-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #d4af37;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.dial-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center bottom;
  text-align: center;
  pointer-events: none;
}

.marker-text {
  display: block;
  color: #d4af37;
  font-size: 12px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #d4af37;
}

.target-indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 30px;
  background: #f44336;
  z-index: 10;
}

.target-line {
  width: 2px;
  height: 100%;
  background: #f44336;
  box-shadow: 0 0 10px #f44336;
}

.target-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #f44336;
  font-size: 12px;
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
  .astrolabe-container {
    width: 250px;
    height: 250px;
  }
  
  .astrolabe-base {
    width: 230px;
    height: 230px;
  }
  
  .astrolabe-dial {
    width: 190px;
    height: 190px;
    top: 20px;
    left: 20px;
  }
  
  .dial-marker {
    transform: rotate(var(--angle)) translateY(-80px);
  }
  
  .marker-text {
    font-size: 10px;
  }
}
</style>
