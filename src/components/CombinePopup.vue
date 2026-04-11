<template>
  <div class="combine-popup">
    <h3>物品组合</h3>
    <div class="combine-form">
      <div class="form-group">
        <label>物品 1:</label>
        <select v-model="selectedItem1">
          <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>物品 2:</label>
        <select v-model="selectedItem2">
          <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <button class="btn-primary" @click="combineItems">组合物品</button>
      <button class="btn-secondary" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../store/gameStore'

const gameStore = useGameStore()
const items = computed(() => gameStore.items)

const selectedItem1 = ref('')
const selectedItem2 = ref('')

const emit = defineEmits(['close'])

const combineItems = () => {
  if (selectedItem1.value && selectedItem2.value && selectedItem1.value !== selectedItem2.value) {
    const result = gameStore.combineItems(selectedItem1.value, selectedItem2.value)
    if (result) {
      gameStore.showToast(`成功组合 ${selectedItem1.value} 和 ${selectedItem2.value}，获得 ${result}！`)
      emit('close')
    } else {
      gameStore.showToast('这两个物品无法组合')
    }
  } else {
    gameStore.showToast('请选择两个不同的物品')
  }
}
</script>