<template>
  <div class="inventory-panel" style="right:0;">
    <h2>侦探笔记</h2>
    <div>
      <h3>【已获徽章】 ({{ medalCount }}/7)</h3>
      <p id="inv-medals">
        <span v-for="(medal, index) in medals" :key="index" class="inv-item medal">{{ medal }}</span>
        <span v-if="medals.length === 0" class="empty-text">无</span>
      </p>

      <h3>【收集道具】</h3>
      <p id="inv-items">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="inv-item"
          @click="$emit('show-item', item)"
        >
          <img :src="`${basePath}images/items/${item}.png`" :alt="item" onerror="this.style.display='none'">
          <span>{{ item }}</span>
        </div>
        <span v-if="items.length === 0" class="empty-text">无</span>
      </p>

      <h3>【掌握线索】</h3>
      <p id="inv-clues">
        <div v-for="(clue, index) in clues" :key="index" class="clue-item">· {{ clue }}</div>
        <span v-if="clues.length === 0" class="empty-text">无</span>
      </p>
    </div>
    <button class="sys-btn" @click="$emit('close')">关闭笔记</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/gameStore'

const basePath = import.meta.env.BASE_URL;
const gameStore = useGameStore()

const medals = computed(() => gameStore.medals)
const medalCount = computed(() => gameStore.medals.length)
const items = computed(() => gameStore.items)
const clues = computed(() => gameStore.clues)

defineEmits(['close', 'show-item'])
</script>