<template>
  <div class="bottom-navigation" v-if="isMobile">
    <div class="nav-item" @click="openPanel('inventory')" title="背包">
      <span class="nav-icon">🎒</span>
      <span class="nav-label">背包</span>
    </div>
    <div class="nav-item" @click="openPanel('achievements')" title="成就">
      <span class="nav-icon">🏆</span>
      <span class="nav-label">成就</span>
    </div>
    <div class="nav-item" @click="openPanel('saveLoad')" title="存档">
      <span class="nav-icon">💾</span>
      <span class="nav-label">存档</span>
    </div>
    <div class="nav-item" @click="openPanel('settings')" title="设置">
      <span class="nav-icon">⚙️</span>
      <span class="nav-label">设置</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMobile = ref(false);

// 检查是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// 打开面板
const openPanel = (panel) => {
  window.dispatchEvent(new CustomEvent('open-panel', { detail: panel }));
};

// 监听窗口大小变化
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-top: 1px solid #444;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.nav-item:hover {
  background: rgba(212, 175, 55, 0.2);
  border-radius: 8px;
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 12px;
  color: #d4af37;
}

/* 确保游戏内容在底部导航栏上方 */
@media (max-width: 767px) {
  .game-content {
    padding-bottom: 80px !important;
  }
}
</style>