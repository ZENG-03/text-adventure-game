<template>
  <div class="item-modal">
    <h3>{{ selectedItem }}</h3>
    <div class="item-image">
      <img :src="`${basePath}images/items/${selectedItem}.png`" :alt="selectedItem" onerror="this.style.display='none'">
    </div>
    <p>{{ itemDescription }}</p>
    <button class="sys-btn" @click="$emit('close')">关闭</button>
  </div>
</template>

<script setup>
const basePath = import.meta.env.BASE_URL;

defineProps({
  selectedItem: {
    type: String,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>