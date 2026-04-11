<template>
  <Transition name="fade">
    <div v-if="visible" class="flashback-overlay" @click="manualClose">
      <div class="flashback-container" :class="positionClass">
        <div class="flashback-header">
          <span class="flashback-title">{{ flash.title }}</span>
          <button class="close-btn" @click="manualClose">✕</button>
        </div>
        <div class="flashback-content">
          <p>{{ flash.content }}</p>
        </div>
        <div class="flashback-footer">
          <span class="character-signature">—— {{ characterName }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { emitter } from '../utils/eventBus';

const visible = ref(false);
const flash = ref(null);
let autoTimer = null;

const characterName = computed(() => {
  const map = {
    astre: '阿斯特·克劳利',
    elenor: '埃莉诺·布莱克伍德',
    elena: '伊莲娜·韦恩',
    thomas: '托马斯·赫胥黎'
  };
  return map[flash.value?.character] || '谜语馆';
});

const positionClass = computed(() => {
  const pos = flash.value?.position || 'center';
  return `flashback-${pos}`;
});

const manualClose = () => {
  if (autoTimer) clearTimeout(autoTimer);
  visible.value = false;
};

onMounted(() => {
  emitter.on('show-flashback', (data) => {
    flash.value = data;
    visible.value = true;
    if (data.autoClose && data.autoClose > 0) {
      autoTimer = setTimeout(() => {
        visible.value = false;
      }, data.autoClose);
    }
  });
});

onUnmounted(() => {
  emitter.off('show-flashback');
  if (autoTimer) clearTimeout(autoTimer);
});
</script>

<style scoped>
.flashback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flashback-container {
  max-width: 500px;
  background: #1e1a14;
  border: 2px solid #d4af37;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  animation: fadeInUp 0.4s ease-out;
}

.flashback-center {
  margin: 0 auto;
}

.flashback-left {
  align-self: flex-start;
  margin-left: 10%;
}

.flashback-right {
  align-self: flex-end;
  margin-right: 10%;
}

.flashback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d4af37;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

.flashback-title {
  font-family: 'Georgia', serif;
  font-size: 1.2em;
  color: #d4af37;
  letter-spacing: 2px;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.2em;
  cursor: pointer;
}

.close-btn:hover {
  color: #d4af37;
}

.flashback-content {
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  line-height: 1.6;
  color: #f0e6d0;
  white-space: pre-wrap;
  margin-bottom: 15px;
}

.flashback-footer {
  text-align: right;
  font-style: italic;
  color: #b8860b;
  font-size: 0.9em;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
