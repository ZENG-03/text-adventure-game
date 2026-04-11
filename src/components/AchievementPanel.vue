<template>
  <div class="achievement-panel">
    <h2>成就墙</h2>
    <div class="achievement-stats">
      已解锁成就：<span id="ach-total">{{ achievementCount }}</span>
      <span>结局：<span id="ach-ending-count">{{ endingCount }}</span></span>
      <span>轮回：<span id="ach-ng-count">{{ playCount }}</span></span>
    </div>
    <div id="ach-list">
      <div v-for="(ending, index) in endings" :key="index" class="ach-item">
        <div class="ach-icon">🏆</div>
        <div class="ach-info">
          <div class="ach-name">{{ ending }}</div>
          <div class="ach-desc">已解锁该结局</div>
        </div>
      </div>
      <span v-if="endings.length === 0" class="empty-text">暂无成就</span>
    </div>
    <button class="sys-btn" @click="$emit('close')">关闭成就墙</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/gameStore'

const gameStore = useGameStore()

const achievementCount = computed(() => gameStore.endings.length)
const endingCount = computed(() => gameStore.endings.length)
const playCount = computed(() => gameStore.playCount)
const endings = computed(() => gameStore.endings)

defineEmits(['close'])
</script>