/**
 * 清如 ClearSpring - 公共工具函数库
 * 
 * 提取各页面重复使用的公共函数，减少代码冗余
 * 
 * @version 1.0.0
 * @date 2026-04-15
 */

// ========== 日期格式化 ==========

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  // 转换为 Date 对象
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化相对时间（如：刚刚、5 分钟前、1 小时前等）
 * @param {Date|string|number} date - 日期
 * @returns {string} 相对时间字符串
 */
function formatRelativeTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else {
    return formatDate(d, 'YYYY-MM-DD');
  }
}

/**
 * 格式化时间（仅时分）
 * @param {Date|string|number} date - 日期
 * @returns {string} HH:mm 格式
 */
function formatTime(date) {
  return formatDate(date, 'HH:mm');
}

/**
 * 格式化日期（仅日期）
 * @param {Date|string|number} date - 日期
 * @returns {string} YYYY-MM-DD 格式
 */
function formatSimpleDate(date) {
  return formatDate(date, 'YYYY-MM-DD');
}

// ========== 金额格式化 ==========

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数，默认 2
 * @returns {string} 格式化后的金额（如：¥1,234.56）
 */
function formatMoney(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '¥0.00';
  }
  
  const num = parseFloat(amount);
  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  
  // 添加千分位分隔符
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `¥${parts.join('.')}`;
}

/**
 * 格式化金额（不带符号）
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的金额（如：1,234.56）
 */
function formatMoneyPlain(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  
  const num = parseFloat(amount);
  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
}

// ========== 状态处理 ==========

/**
 * 订单状态映射
 */
const ORDER_STATUS_MAP = {
  0: { name: '待支付', class: 'pending-pay' },
  1: { name: '待承接', class: 'pending-accept' },
  2: { name: '待执行', class: 'pending-execute' },
  3: { name: '执行中', class: 'processing' },
  4: { name: '待确认', class: 'pending-confirm' },
  5: { name: '已完成', class: 'completed' },
  6: { name: '已取消', class: 'cancelled' }
};

/**
 * 获取状态名称
 * @param {number} status - 状态值
 * @param {string} type - 类型（order/volunteer/cert）
 * @returns {string} 状态名称
 */
function getStatusName(status, type = 'order') {
  if (type === 'order') {
    return ORDER_STATUS_MAP[status]?.name || '未知状态';
  }
  
  // 志愿者状态
  if (type === 'volunteer') {
    const volunteerStatus = {
      0: '未认证',
      1: '审核中',
      2: '已认证',
      3: '已禁用'
    };
    return volunteerStatus[status] || '未知状态';
  }
  
  // 证书状态
  if (type === 'cert') {
    const certStatus = {
      0: '未获得',
      1: '已获得'
    };
    return certStatus[status] || '未知状态';
  }
  
  return '未知状态';
}

/**
 * 获取状态样式类名
 * @param {number} status - 状态值
 * @param {string} type - 类型
 * @returns {string} 样式类名
 */
function getStatusClass(status, type = 'order') {
  if (type === 'order') {
    return ORDER_STATUS_MAP[status]?.class || '';
  }
  
  // 志愿者状态
  if (type === 'volunteer') {
    const volunteerClass = {
      0: 'unverified',
      1: 'verifying',
      2: 'verified',
      3: 'disabled'
    };
    return volunteerClass[status] || '';
  }
  
  return '';
}

/**
 * 获取状态颜色
 * @param {number} status - 状态值
 * @returns {string} 颜色值
 */
function getStatusColor(status) {
  const colorMap = {
    0: '#999',
    1: '#ff9500',
    2: '#1890ff',
    3: '#52c41a',
    4: '#faad14',
    5: '#52c41a',
    6: '#999'
  };
  return colorMap[status] || '#999';
}

// ========== 字符串处理 ==========

/**
 * 手机号脱敏
 * @param {string} phone - 手机号
 * @returns {string} 脱敏后的手机号
 */
function maskPhone(phone) {
  if (!phone) return '';
  const str = String(phone);
  if (str.length !== 11) return str;
  return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 身份证号脱敏
 * @param {string} idCard - 身份证号
 * @returns {string} 脱敏后的身份证号
 */
function maskIdCard(idCard) {
  if (!idCard) return '';
  const str = String(idCard);
  if (str.length < 8) return str;
  return str.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
}

/**
 * 姓名脱敏
 * @param {string} name - 姓名
 * @returns {string} 脱敏后的姓名
 */
function maskName(name) {
  if (!name || name.length < 2) return '*';
  return name[0] + '*'.repeat(name.length - 1);
}

/**
 * 截断文本
 * @param {string} text - 文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} 截断后的文本
 */
function truncateText(text, maxLength = 50, suffix = '...') {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}

// ========== 数据验证 ==========

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(String(phone));
}

/**
 * 验证身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
function isValidIdCard(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(String(idCard));
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
function isValidEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email));
}

// ========== 工具函数 ==========

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(fn, delay = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 深拷贝（简单实现）
 * @param {any} obj - 需要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 生成唯一 ID
 * @returns {string} 唯一 ID
 */
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ========== 导出 ==========
module.exports = {
  // 日期格式化
  formatDate,
  formatRelativeTime,
  formatTime,
  formatSimpleDate,
  
  // 金额格式化
  formatMoney,
  formatMoneyPlain,
  
  // 状态处理
  getStatusName,
  getStatusClass,
  getStatusColor,
  ORDER_STATUS_MAP,
  
  // 字符串处理
  maskPhone,
  maskIdCard,
  maskName,
  truncateText,
  
  // 数据验证
  isValidPhone,
  isValidIdCard,
  isValidEmail,
  
  // 工具函数
  debounce,
  throttle,
  deepClone,
  generateId
};
