// ====== src/api/index.js ======
import axios from 'axios';

// 创建 Axios 实例并配置基础设定
const api = axios.create({
  // 在实际环境中应使用环境变量 (如 import.meta.env.VITE_API_URL)
  baseURL: 'http://localhost:8000', 
  timeout: 5000 // 超时时间
});

// ================= 请求拦截器 =================
api.interceptors.request.use(config => {
  // 如果本地存在登录Token，则附加在请求头中，用于后端鉴权
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// ================= 响应拦截器 =================
api.interceptors.response.use(response => {
  return response.data;
}, error => {
  // 统一错误处理，例如 401 登出处理
  if (error.response && error.response.status === 401) {
    console.warn('登录失效，请重新登录');
    // 可以触发对应的登出动作
  }
  return Promise.reject(error);
});

export const ServerAPI = {
  login: (username, password) => api.post("/api/user/login", { username, password }),
  register: (username, password) => api.post("/api/user/register", { username, password }),

  /**
   * 热更新接口：获取最新远端剧本 (DSL JSON)
   * => 可以实现不发版修改文本、谜题选项等
   */
  fetchScenesDSL: () => api.get('/api/game/scenes'),

  /**
   * 上传玩家云存档 (多周目数据 + 当前周目 run)
   * @param {Object} saveData 整个玩家储存信息的 JSON
   */
  syncSaveData: (saveData) => api.post('/api/user/save', saveData),

  /**
   * 拉取玩家云存档
   * => 登录后或者多端切换时，获取云端最新覆盖的存档数据
   */
  fetchSaveData: () => api.get('/api/user/save'),
  
  /**
   * 成就/多周目排行榜
   */
  fetchLeaderboard: () => api.get('/api/game/leaderboard')
};

export default api;