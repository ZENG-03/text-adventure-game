<template>
  <div class="memory-book-overlay" @click.self="close">
    <div class="memory-book">
      <h2>记忆之书</h2>
      <p class="subtitle">你走过的路，铸就了你的结局</p>
      
      <div class="timeline">
        <div 
          v-for="(choice, index) in keyChoices" 
          :key="index"
          class="timeline-node"
        >
          <div class="node-marker"></div>
          <div class="node-content">
            <div class="node-scene">{{ getSceneName(choice.sceneId) }}</div>
            <div class="node-choice">{{ choice.choiceText }}</div>
          </div>
        </div>
      </div>
      
      <div class="ending-analysis">
        <h3>结局分析</h3>
        <p>{{ endingExplanation }}</p>
      </div>
      
      <div class="buttons">
        <button class="restart-btn" @click="restartFromBeginning">重新开始</button>
        <button class="close-btn" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';

const store = useGameStore();
const emit = defineEmits(['close']);

const keyChoices = computed(() => store.profile.key_choices || []);

const getSceneName = (sceneId) => {
  const map = {
    'final_chamber': '最终密室',
    'side_butler_quarters': '管家起居室',
    'side_painting_trigger': '画室',
    'hall_main': '大厅',
    'basement_entry': '地下室入口',
    'bedroom_entry': '卧室入口',
    'clocktower_entry': '钟楼入口',
    'greenhouse_entry': '温室入口',
    'library_entry': '图书馆入口',
    'musicroom_entry': '音乐室入口',
    'studio_entry': '画室入口'
  };
  return map[sceneId] || sceneId;
};

const endingExplanation = computed(() => {
  // 根据玩家的关键选择和好感度生成动态分析
  const choices = keyChoices.value;
  const aff = store.profile.character_affection;
  let text = '你的旅程中，';
  if (choices.some(c => c.choiceText === '成为传播者')) {
    text += '你选择了将谜语公之于众，这让你获得了自由，但也失去了庄园的物质财富。';
  } else if (choices.some(c => c.choiceText === '成为守护者')) {
    text += '你选择了承担守护的责任，虽然失去了自由，但获得了内心的安宁。';
  }
  if (aff.elena >= 5) {
    text += ' 伊莲娜感受到了你的理解，她的灵魂得以安息。';
  }
  if (aff.butler >= 5) {
    text += ' 管家奥尔德斯对你产生了深厚的信任，将你视为家人。';
  }
  if (aff.elenor >= 5) {
    text += ' 埃莉诺的音乐在你的心中回荡，她的故事得以传承。';
  }
  if (aff.thomas >= 5) {
    text += ' 托马斯的研究成果得到了认可，他的精神得以延续。';
  }
  return text;
});

const restartFromBeginning = () => {
  // 重置游戏
  store.startNewGame();
  emit('close');
  window.location.reload(); // 或路由跳转
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.memory-book-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.memory-book {
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  background: #2a2418;
  border: 3px solid #d4af37;
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  color: #f0e6d0;
}

.memory-book h2 {
  text-align: center;
  color: #d4af37;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #b8860b;
  margin-bottom: 20px;
  font-style: italic;
}

.timeline {
  margin: 20px 0;
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #d4af37;
}

.timeline-node {
  display: flex;
  margin-bottom: 20px;
  position: relative;
}

.node-marker {
  position: absolute;
  left: -22px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d4af37;
  border: 2px solid #1a1a1a;
}

.node-content {
  background: #1e1a14;
  padding: 10px;
  border-radius: 8px;
  flex: 1;
}

.node-scene {
  font-size: 0.8em;
  color: #b8860b;
  margin-bottom: 5px;
}

.node-choice {
  font-weight: bold;
}

.ending-analysis {
  background: #1e1a14;
  padding: 15px;
  border-left: 4px solid #d4af37;
  margin: 20px 0;
}

.ending-analysis h3 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.restart-btn, .close-btn {
  padding: 10px 20px;
  background: #333;
  border: 1px solid #d4af37;
  color: #d4af37;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.restart-btn:hover, .close-btn:hover {
  background: #d4af37;
  color: #1a1a1a;
}

/* 滚动条样式 */
.memory-book::-webkit-scrollbar {
  width: 8px;
}

.memory-book::-webkit-scrollbar-track {
  background: #1e1a14;
  border-radius: 4px;
}

.memory-book::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}

.memory-book::-webkit-scrollbar-thumb:hover {
  background: #b8860b;
}
</style>
