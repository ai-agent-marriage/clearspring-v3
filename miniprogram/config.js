// config.js - 全局配置
module.exports = {
  // API 基础地址
  baseUrl: 'https://api.example.com',
  
  // API 版本
  apiVersion: 'v1',
  
  // 应用版本
  appVersion: '1.0.0',
  
  // 超时时间 (毫秒)
  timeout: 10000,
  
  // 是否开启日志
  debug: true,
  
  // 图片上传地址
  uploadUrl: 'https://api.example.com/upload',
  
  // WebSocket 地址
  wsUrl: 'wss://api.example.com/ws',
  
  // 默认分页大小
  pageSize: 20,
  
  // 音频配置
  audio: {
    // 音频有效收听比例 (80%)
    validListenRatio: 0.8,
    // 默认音量
    defaultVolume: 0.8
  },
  
  // 缓存配置
  cache: {
    // 缓存过期时间 (毫秒)
    expireTime: 3600000,
    // 最大缓存数量
    maxCount: 100
  }
}
