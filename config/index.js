/**
 * 配置文件 - 集中管理所有环境配置
 * 
 * 使用说明：
 * 1. 生产环境：使用环境变量或保持默认值
 * 2. 开发环境：复制此文件为 config.local.js 并修改配置
 * 3. config.local.js 已加入 .gitignore，不会提交到版本控制
 */

// 环境检测
const isDev = process && process.env && process.env.NODE_ENV === 'development';

// 基础配置
const config = {
  // 环境标识
  env: isDev ? 'dev' : 'prod',
  
  // 云开发环境
  cloudEnv: process.env.WX_CLOUD_ENV || 'clearspring-prod',
  
  // API 基础地址
  apiBase: process.env.WX_API_BASE || 'https://api.clearspring.com',
  
  // 支付配置
  pay: {
    // 支付超时时间（毫秒）
    timeout: 15 * 60 * 1000,
    // 轮询间隔（毫秒）
    pollInterval: 3000,
    // 最大轮询次数
    maxPollCount: 300
  },
  
  // 安全配置
  security: {
    // 是否启用内容安全审核
    enableContentCheck: true,
    // 是否启用输入验证
    enableInputValidation: true,
    // 是否启用 XSS 过滤
    enableXSSFilter: true,
    // 请求签名密钥（生产环境应从环境变量读取）
    signSecret: process.env.WX_SIGN_SECRET || 'clearspring_sign_secret_2026_secure_key'
  },
  
  // 请求配置
  request: {
    // 请求超时时间（毫秒）
    timeout: 30000,
    // 限流配置
    rateLimit: {
      // 时间窗口（毫秒）
      window: 60000,
      // 最大请求数
      max: 10
    }
  },
  
  // 分账配置
  division: {
    // 执行者分成比例（90%）
    executorRatio: 0.9,
    // 平台分成比例（10%）
    platformRatio: 0.1,
    // 最小金额（分）
    minAmount: 1
  },
  
  // 常量引用（方便统一使用）
  constants: require('./constants.js')
};

// 开发环境覆盖配置
if (isDev) {
  try {
    // 尝试加载本地开发配置（不提交到版本控制）
    const localConfig = require('./config.local.js');
    Object.assign(config, localConfig);
    console.log('[配置] 已加载开发环境配置');
  } catch (e) {
    console.log('[配置] 未找到本地配置文件，使用默认配置');
  }
}

// 冻结配置，防止运行时修改
Object.freeze(config);
Object.freeze(config.pay);
Object.freeze(config.security);
Object.freeze(config.request);
Object.freeze(config.division);

module.exports = config;
