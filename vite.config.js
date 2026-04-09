import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/text-adventure-game/', // 必须和你的 GitHub 仓库名称一致！否则会报 404
  plugins: [vue()],
  server: {
    port: 3000
  }
})