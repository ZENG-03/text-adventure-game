<template>
  <div class="dynamic-bg">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>
    <div class="candles">
      <div v-for="i in 7" :key="i" class="candle" :style="{ animationDelay: `${i * 0.5}s` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let animationId = null;
let particles = [];

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', initCanvas);
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', initCanvas);
});

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  
  // 初始化雾气粒子
  particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 40 + 15,
      opacity: Math.random() * 0.25,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.15
    });
  }

  function animate() {
    if (!canvas) return;
    ctx.clearRect(0, 0, width, height);
    
    // 绘制深色背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制庄园剪影（简单梯形）
    ctx.fillStyle = '#2a2a3e';
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height);
    ctx.lineTo(width * 0.3, height * 0.7);
    ctx.lineTo(width * 0.7, height * 0.7);
    ctx.lineTo(width * 0.8, height);
    ctx.fill();
    
    // 绘制窗户（七个小光点）
    for (let i = 0; i < 7; i++) {
      const x = width * (0.35 + i * 0.05);
      const y = height * 0.6;
      ctx.fillStyle = `rgba(212, 175, 55, ${0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2})`;
      ctx.fillRect(x, y, 8, 12);
    }
    
    // 绘制雾气粒子
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 220, 230, ${p.opacity})`;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -100) p.x = width + 100;
      if (p.x > width + 100) p.x = -100;
      if (p.y < -100) p.y = height + 100;
      if (p.y > height + 100) p.y = -100;
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
};
</script>

<style scoped>
.dynamic-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}
.bg-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.candles {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 10px;
}
.candle {
  width: 20px;
  height: 40px;
  background: linear-gradient(to top, #ffd700, #ffaa00);
  border-radius: 2px 2px 8px 8px;
  animation: flicker 1s infinite alternate;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}
@keyframes flicker {
  0% { opacity: 0.6; height: 38px; }
  100% { opacity: 1; height: 42px; }
}
</style>