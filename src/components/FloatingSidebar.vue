<template>
  <div class="floating-sidebar" :class="{ expanded: isExpanded }" @mouseenter="expand" @mouseleave="collapse">
    <div class="sidebar-tab">
      <span>⚙️</span>
    </div>
    <div class="sidebar-icons">
      <button @click="openPanel('inventory')" title="侦探笔记">📖</button>
      <button @click="openPanel('achievements')" title="成就">🏆</button>
      <button @click="openPanel('saveLoad')" title="存档">💾</button>
      <button @click="openPanel('settings')" title="设置">⚙️</button>
      <button @click="returnToHall" title="返回大厅">🏠</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGameStore } from '@/store/gameStore';

const store = useGameStore();
const isExpanded = ref(false);

const expand = () => { isExpanded.value = true; };
const collapse = () => { isExpanded.value = false; };

const openPanel = (panel) => {
  // 通过事件总线或直接修改父组件状态
  window.dispatchEvent(new CustomEvent('open-panel', { detail: panel }));
};

const returnToHall = () => {
  store.selectOption('hall_main');
};
</script>

<style scoped>
.floating-sidebar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  background: rgba(0,0,0,0.6);
  border-radius: 24px 0 0 24px;
  backdrop-filter: blur(8px);
  transition: width 0.3s;
  z-index: 100;
  overflow: hidden;
}

.floating-sidebar.expanded {
  width: 120px;
}

.sidebar-tab {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #d4af37;
  color: #000;
  border-radius: 24px 0 0 24px;
}

.sidebar-icons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
  align-items: center;
}

.sidebar-icons button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #d4af37;
  transition: transform 0.2s;
}

.sidebar-icons button:hover {
  transform: scale(1.1);
}
</style>