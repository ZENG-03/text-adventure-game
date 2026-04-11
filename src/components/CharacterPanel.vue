<template>
  <div class="character-panel">
    <h2>人物图鉴 <span id="char-count">({{ characters.length }}/{{ characters.length }})</span></h2>
    <div id="char-list">
      <div v-for="(character, index) in characters" :key="index" class="char-card">
        <div class="char-image">
          <img :src="`${basePath}images/characters/${character.image}`" :alt="character.name">
        </div>
        <h4>{{ character.name }}</h4>
        <p class="char-role">{{ character.role }}</p>
        <p class="char-description">{{ character.description }}</p>
      </div>
    </div>
    <button class="sys-btn" @click="$emit('close')">关闭图鉴</button>
  </div>
</template>

<script setup>
const basePath = import.meta.env.BASE_URL;

const characters = [
  {
    name: '阿斯特·克劳利',
    role: '谜语馆主人',
    description: '庄园的主人，一个神秘的人物，似乎隐藏着许多秘密。',
    image: '谜语馆主人阿斯特·克劳利1.png'
  },
  {
    name: '奥尔德斯·克劳利',
    role: '管家',
    description: '庄园的管家，忠诚且神秘，似乎知道许多关于庄园的秘密。',
    image: '管家奥尔德斯·克劳利1.png'
  },
  {
    name: '伊莲娜·韦恩',
    role: '画中女子',
    description: '一幅画中的女子，似乎与庄园的历史有着密切的联系。',
    image: '画中女子伊莲娜·韦恩1.png'
  },
  {
    name: '埃莉诺·布莱克伍德',
    role: '制琴师',
    description: '一位才华横溢的制琴师，与音乐室有着不解之缘。',
    image: '制琴师埃莉诺·布莱克伍德1.png'
  },
  {
    name: '托马斯·赫胥黎',
    role: '地质学家',
    description: '一位专注的地质学家，对庄园的地下室有着浓厚的兴趣。',
    image: '地质学家托马斯·赫胥黎1.png'
  },
  {
    name: '塞拉斯·诺斯',
    role: '神秘访客',
    description: '一位神秘的访客，似乎与庄园的秘密有着某种联系。',
    image: '塞拉斯·诺斯.png'
  }
]

defineEmits(['close'])
</script>