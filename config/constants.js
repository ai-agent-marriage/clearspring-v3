/**
 * 清如 ClearSpring - 常量定义
 * 集中管理所有魔法数字和常量配置
 * @module config/constants
 * @version 1.0.0
 */

const constants = {
  // ==================== 时间相关常量 ====================
  
  /** 1 分钟（毫秒） */
  ONE_MINUTE: 60 * 1000,
  
  /** 1 小时（毫秒） */
  ONE_HOUR: 60 * 60 * 1000,
  
  /** 1 天（毫秒） */
  ONE_DAY: 24 * 60 * 60 * 1000,
  
  /** 1 周（毫秒） */
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  
  /** 1 个月（毫秒，按 30 天计算） */
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  
  /** CSRF Token 有效期（1 小时） */
  CSRF_TOKEN_EXPIRY: 3600000,
  
  /** 请求签名有效期（5 分钟） */
  SIGNATURE_EXPIRY: 5 * 60 * 1000,
  
  // ==================== 限流相关常量 ====================
  
  /** 普通请求限流：每分钟最大请求数 */
  RATE_LIMIT_REQUESTS: 10,
  
  /** 普通请求限流：时间窗口（毫秒） */
  RATE_LIMIT_WINDOW: 60000,
  
  /** 文件上传限流：每分钟最大上传次数 */
  UPLOAD_RATE_LIMIT: 5,
  
  /** 文件上传限流：时间窗口（毫秒） */
  UPLOAD_RATE_LIMIT_WINDOW: 60000,
  
  // ==================== 日志相关常量 ====================
  
  /** 日志保留天数 */
  LOG_RETENTION_DAYS: 7,
  
  /** 最大错误日志条数 */
  MAX_ERROR_LOGS: 100,
  
  /** 最大访问日志条数 */
  MAX_ACCESS_LOGS: 200,
  
  /** 最大操作日志条数 */
  MAX_OPERATION_LOGS: 150,
  
  /** 日志清理间隔（1 天） */
  LOG_CLEAN_INTERVAL: 24 * 60 * 60 * 1000,
  
  // ==================== 支付相关常量 ====================
  
  /** 支付超时时间（15 分钟） */
  PAY_TIMEOUT: 15 * 60 * 1000,
  
  /** 支付轮询间隔（3 秒） */
  PAY_POLL_INTERVAL: 3000,
  
  /** 支付最大轮询次数 */
  PAY_MAX_POLL_COUNT: 300,
  
  // ==================== 分账相关常量 ====================
  
  /** 执行者分成比例（90%） */
  EXECUTOR_RATIO: 0.9,
  
  /** 平台分成比例（10%） */
  PLATFORM_RATIO: 0.1,
  
  /** 最小金额（分） */
  MIN_AMOUNT: 1,
  
  // ==================== 图片相关常量 ====================
  
  /** 图片最大上传大小（10MB） */
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,
  
  /** 图片压缩质量（0-1） */
  IMAGE_COMPRESS_QUALITY: 0.8,
  
  /** 图片最大宽度（像素） */
  IMAGE_MAX_WIDTH: 1920,
  
  /** 图片最大高度（像素） */
  IMAGE_MAX_HEIGHT: 1920,
  
  // ==================== 缓存相关常量 ====================
  
  /** 缓存默认有效期（1 小时） */
  CACHE_DEFAULT_TTL: 60 * 60 * 1000,
  
  /** 用户信息缓存有效期（1 天） */
  CACHE_USER_INFO_TTL: 24 * 60 * 60 * 1000,
  
  /** 配置信息缓存有效期（1 周） */
  CACHE_CONFIG_TTL: 7 * 24 * 60 * 60 * 1000,
  
  // ==================== 请求相关常量 ====================
  
  /** 请求超时时间（30 秒） */
  REQUEST_TIMEOUT: 30000,
  
  /** 重试次数 */
  REQUEST_RETRY_COUNT: 3,
  
  /** 重试间隔（毫秒） */
  REQUEST_RETRY_INTERVAL: 1000,
  
  // ==================== 分页相关常量 ====================
  
  /** 默认每页条数 */
  DEFAULT_PAGE_SIZE: 20,
  
  /** 最小每页条数 */
  MIN_PAGE_SIZE: 10,
  
  /** 最大每页条数 */
  MAX_PAGE_SIZE: 100,
  
  // ==================== 验证相关常量 ====================
  
  /** 手机号最小长度 */
  PHONE_MIN_LENGTH: 11,
  
  /** 手机号最大长度 */
  PHONE_MAX_LENGTH: 11,
  
  /** 手机号正则表达式 */
  PHONE_PATTERN: /^1[3-9]\d{9}$/,
  
  /** 邮箱最大长度 */
  EMAIL_MAX_LENGTH: 255,
  
  /** 邮箱正则表达式 */
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /** URL 最大长度 */
  URL_MAX_LENGTH: 2048,
  
  /** URL 正则表达式 */
  URL_PATTERN: /^https?:\/\/.+/,
  
  // ==================== 错误码相关常量 ====================
  
  /** 成功 */
  CODE_SUCCESS: 0,
  
  /** 系统繁忙 */
  CODE_SYSTEM_BUSY: 1000,
  
  /** 网络异常 */
  CODE_NETWORK_ERROR: 1004,
  
  /** 请求超时 */
  CODE_TIMEOUT: 1005,
  
  /** 登录过期 */
  CODE_TOKEN_EXPIRED: 2001,
  
  /** 权限不足 */
  CODE_PERMISSION_DENIED: 2002,
  
  /** 限流错误 */
  CODE_RATE_LIMIT: 429
}

// 冻结常量对象，防止运行时修改
Object.freeze(constants)

module.exports = constants
