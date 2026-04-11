<template>
  <div class="text-input-ui">
    <h3>{{ sceneData?.input?.prompt || '请输入答案' }}</h3>
    <div class="input-container">
      <input 
        type="text" 
        v-model="userInput"
        class="text-input"
        :placeholder="sceneData?.input?.placeholder || '输入答案...'"
        @keyup.enter="submitAnswer"
        ref="inputRef"
      />
      <div class="input-actions">
        <button class="voice-btn" @click="toggleVoiceInput" :class="{ 'listening': isListening }" title="语音输入">
          🎤
        </button>
        <button class="help-btn" @click="showContextHelp" title="上下文帮助">
          ❓
        </button>
      </div>
    </div>
    <div class="feedback" v-if="feedbackMessage">{{ feedbackMessage }}</div>
    <div class="context-help" v-if="showHelp">
      <h4>上下文帮助</h4>
      <p>{{ contextHelpText }}</p>
      <button class="close-help-btn" @click="showHelp = false">关闭</button>
    </div>
    <div class="btn-container">
      <button class="submit-btn" @click="submitAnswer">确认</button>
      <button class="cancel-btn" @click="$emit('close')">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../store/gameStore'

const props = defineProps({
  sceneData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])
const userInput = ref('')
const feedbackMessage = ref('')
const inputRef = ref(null)
const store = useGameStore()

// 语音输入相关
const isListening = ref(false)
const recognition = ref(null)

// 上下文帮助相关
const showHelp = ref(false)
const contextHelpText = ref('')

// 提交答案
const submitAnswer = () => {
  const val = userInput.value.trim()
  if (!val) {
    return
  }
  
  const inputConfig = props.sceneData.input
  
  if (inputConfig.validate(val)) {
    feedbackMessage.value = '通过！'
    feedbackMessage.value = '通过！'
    
    if (inputConfig.onSuccess) {
      inputConfig.onSuccess()
    }
    
    setTimeout(() => {
      emit('success')
    }, 500)
  } else {
    // 记录失败次数
    if (!store.run.puzzleFails) {
      store.run.puzzleFails = {}
    }
    const sceneId = props.sceneData.id
    store.run.puzzleFails[sceneId] = (store.run.puzzleFails[sceneId] || 0) + 1
    
    let failMsg = inputConfig.failMsg || '不对...似乎还有什么没考虑到。'
    const hints = store.run.hint_levels || {}
    const hintLvl = hints[sceneId] || 0
    
    // 失败3次以上触发提示
    if (store.run.puzzleFails[sceneId] >= 3 && inputConfig.hints && hintLvl < inputConfig.hints.length) {
      failMsg += `\n【系统提示】${inputConfig.hints[hintLvl]}`
      hints[sceneId] = hintLvl + 1
      store.run.hint_levels = hints
    } else if (inputConfig.hints && hintLvl > 0) {
      const lastHint = Math.min(hintLvl - 1, inputConfig.hints.length - 1)
      failMsg += `\n【系统提示】${inputConfig.hints[lastHint]}`
    }
    
    feedbackMessage.value = failMsg
    if (inputConfig.onFail) {
      inputConfig.onFail(val)
    }
  }
}

// 语音输入功能
const toggleVoiceInput = () => {
  // 检查浏览器是否支持语音识别
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    feedbackMessage.value = '您的浏览器不支持语音识别功能'
    return
  }

  if (isListening.value) {
    // 停止录音
    if (recognition.value) {
      recognition.value.stop()
    }
  } else {
    // 开始录音
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'zh-CN'
    recognition.value.continuous = false
    recognition.value.interimResults = false

    recognition.value.onstart = () => {
      isListening.value = true
      feedbackMessage.value = '正在聆听...'
    }

    recognition.value.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      userInput.value = transcript
      feedbackMessage.value = '语音输入成功'
    }

    recognition.value.onerror = (event) => {
      feedbackMessage.value = '语音识别失败，请重试'
      isListening.value = false
    }

    recognition.value.onend = () => {
      isListening.value = false
    }

    recognition.value.start()
  }
}

// 上下文帮助功能
const showContextHelp = () => {
  // 根据当前场景提供上下文帮助
  const sceneId = props.sceneData.id
  const helpMap = {
    'library_puzzle': '图书馆的谜题可能与书籍的排列或书架上的线索有关。',
    'music_room_puzzle': '音乐室的谜题可能与音符、节奏或乐器有关。',
    'art_gallery_puzzle': '艺术画廊的谜题可能与画作的内容、排列或颜色有关。',
    'greenhouse_puzzle': '温室的谜题可能与植物、生长周期或自然元素有关。',
    'basement_puzzle': '地下室的谜题可能与机械、管道或黑暗中的线索有关。',
    'clock_tower_puzzle': '钟楼的谜题可能与时间、齿轮或钟声有关。',
    'hall_puzzle': '大厅的谜题可能与徽章、雕像或建筑结构有关。'
  }

  contextHelpText.value = helpMap[sceneId] || '根据当前场景的线索，尝试找出谜题的答案。注意观察周围环境中的细节。'
  showHelp.value = true
}

// 组件挂载后聚焦输入框
onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})

// 组件卸载时停止语音识别
onUnmounted(() => {
  if (recognition.value && isListening.value) {
    recognition.value.stop()
  }
})
</script>

<style scoped>
.text-input-ui {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d4af37;
  max-width: 400px;
  margin: 0 auto;
}

.text-input-ui h3 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.text-input {
  flex: 1;
  padding: 10px;
  background: #2a2a2a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.input-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.voice-btn, .help-btn {
  padding: 10px;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-btn:hover, .help-btn:hover {
  background: #444;
  transform: translateY(-1px);
}

.voice-btn.listening {
  background: rgba(212, 175, 55, 0.3);
  border-color: #d4af37;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(212, 175, 55, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
  }
}

.context-help {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #444;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.context-help h4 {
  color: #d4af37;
  margin-top: 0;
  margin-bottom: 10px;
}

.context-help p {
  margin-bottom: 15px;
  line-height: 1.4;
}

.close-help-btn {
  padding: 5px 10px;
  background: #444;
  color: white;
  border: 1px solid #666;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.close-help-btn:hover {
  background: #555;
}

.feedback {
  color: #d9534f;
  margin-bottom: 20px;
  min-height: 24px;
  line-height: 1.4;
}

.feedback.success {
  color: #5cb85c;
}

.btn-container {
  display: flex;
  gap: 10px;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border: 1px solid #d4af37;
}

.submit-btn:hover {
  background: rgba(212, 175, 55, 0.4);
}

.cancel-btn {
  background: #444;
  color: white;
  border: 1px solid #666;
}

.cancel-btn:hover {
  background: #555;
}
</style>