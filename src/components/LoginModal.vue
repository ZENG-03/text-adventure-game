<template>
  <div class="login-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a1a;border:2px solid #d4af37;padding:20px;border-radius:8px;z-index:9999;box-shadow:0 0 15px rgba(212,175,55,0.3);width:300px;color:#d4af37;">
    <h3 style="margin-top:0;text-align:center;">连接到云端档案室</h3>
    <div class="login-form">
      <div class="form-group" style="margin-bottom:10px;">
        <label style="display:block;margin-bottom:5px;">账号:</label>
        <input type="text" v-model="loginForm.username" placeholder="请输入用户名" style="width:100%;padding:8px;background:#2a2a2a;border:1px solid #555;color:#f0f0f0;box-sizing:border-box;">
      </div>
      <div class="form-group" style="margin-bottom:15px;">
        <label style="display:block;margin-bottom:5px;">密码:</label>
        <input type="password" v-model="loginForm.password" placeholder="请输入密码" style="width:100%;padding:8px;background:#2a2a2a;border:1px solid #555;color:#f0f0f0;box-sizing:border-box;">
      </div>
      <div class="modal-buttons" style="display:flex;gap:10px;justify-content:center;">
        <button class="sys-btn" style="flex:1;background:#2a2a2a;color:#d4af37;border:1px solid #d4af37;padding:5px;cursor:pointer;" @click="submitLogin">登 录</button>
        <button class="sys-btn" style="flex:1;background:#2a2a2a;color:#d4af37;border:1px solid #d4af37;padding:5px;cursor:pointer;" @click="submitRegister">注册</button>
        <button class="sys-btn" style="flex:1;background:#2a2a2a;color:#d4af37;border:1px solid #d4af37;padding:5px;cursor:pointer;" @click="$emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../store/gameStore'

const gameStore = useGameStore()
const loginForm = ref({ username: '', password: '' })

const emit = defineEmits(['close'])

const submitLogin = async () => {
  const success = await gameStore.loginAndConnect(loginForm.value.username, loginForm.value.password);
  if (success) {
    emit('close')
    loginForm.value.username = '';
    loginForm.value.password = '';
  }
}

const submitRegister = async () => {
  await gameStore.registerAccount(loginForm.value.username, loginForm.value.password);
}
</script>