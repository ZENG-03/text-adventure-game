<template>
  <div class="home">
    <!-- 动态背景组件 -->
    <DynamicBackground />
    
    <div class="hero">
      <h1 class="title-animation">谜语遗产：七重谜域</h1>
      <p>探索幽暗庄园，解开七重谜题，寻找隐藏的真相</p>
      <div class="buttons">
        <button @click="startNewGame" class="btn-primary">开始新游戏</button>
        <button @click="continueGame" class="btn-secondary" :disabled="!hasSave">继续游戏</button>
        <button @click="loadNGPlus" class="btn-secondary" :disabled="!hasEndings">多周目模式</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../store/gameStore'
import DynamicBackground from '../components/DynamicBackground.vue'

const router = useRouter()
const gameStore = useGameStore()
const hasSave = ref(false)
const hasEndings = ref(false)

onMounted(() => {
  hasSave.value = gameStore.hasAutoSave()
  hasEndings.value = gameStore.hasEndings()
})

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game')
}

const continueGame = () => {
  gameStore.loadGame()
  router.push('/game')
}

const loadNGPlus = () => {
  gameStore.startNGPlus()
  router.push('/game')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background: rgba(26, 26, 26, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #cccccc;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.btn-primary {
  padding: 12px 30px;
  font-size: 1.1rem;
  background-color: #d4af37;
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #f0c14b;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  padding: 10px 25px;
  font-size: 1rem;
  background-color: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 羽毛笔书写效果 */
.title-animation {
  position: relative;
  display: inline-block;
}

.title-animation::after {
  content: '✍️';
  position: absolute;
  right: -30px;
  top: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.title-animation:hover::after {
  opacity: 1;
}

/* 按钮悬停特效 */
.btn-primary, .btn-secondary {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-primary::before, .btn-secondary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  transition: width 0.4s, height 0.4s;
}

.btn-primary:hover::before, .btn-secondary:hover::before {
  width: 200px;
  height: 200px;
}
</style>