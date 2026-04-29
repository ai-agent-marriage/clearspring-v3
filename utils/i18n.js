/**
 * 清如 ClearSpring - 国际化 (i18n) 工具类
 * @file i18n.js
 * @description 提供多语言支持，预留国际化接口
 * @version 1.0.0
 * @create 2026-04-12
 * 
 * @example
 * // 引入工具类
 * const i18n = require('../../utils/i18n');
 * 
 * // 初始化（在 app.js 中调用）
 * i18n.init('zh-CN');
 * 
 * // 获取翻译文本
 * const text = i18n.t('common.loading');
 * 
 * // 带参数的翻译
 * const text = i18n.t('order.count', { count: 5 });
 */

// 默认语言
const DEFAULT_LANG = 'zh-CN';

// 支持的语言列表
const SUPPORTED_LANGS = ['zh-CN', 'en-US'];

// 语言包
const messages = {
  // 中文简体
  'zh-CN': {
    // 通用
    'common.loading': '加载中...',
    'common.refreshing': '刷新中...',
    'common.success': '成功',
    'common.failed': '失败',
    'common.cancel': '取消',
    'common.confirm': '确定',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.noData': '暂无数据',
    'common.networkError': '网络错误，请重试',
    
    // 订单相关
    'order.title': '订单管理',
    'order.all': '全部',
    'order.pendingAccept': '待承接',
    'order.pendingExecute': '待执行',
    'order.executing': '执行中',
    'order.pendingConfirm': '待确认',
    'order.completed': '已完成',
    'order.cancelled': '已取消',
    'order.count': '订单数量：{count}',
    'order.detail': '订单详情',
    'order.accept': '承接订单',
    'order.assign': '分配任务',
    'order.audit': '审核材料',
    
    // 志愿者相关
    'volunteer.title': '志愿者管理',
    'volunteer.name': '志愿者姓名',
    'volunteer.phone': '联系电话',
    'volunteer.status': '状态',
    'volunteer.active': '活跃',
    'volunteer.inactive': '未激活',
    
    // 结算相关
    'settlement.title': '结算管理',
    'settlement.amount': '结算金额',
    'settlement.date': '结算日期',
    'settlement.status': '结算状态',
    
    // 状态提示
    'status.audited': '已审核',
    'status.pending': '待审核',
    'status.rejected': '已拒绝',
    
    // 错误提示
    'error.loadFailed': '加载失败，请重试',
    'error.submitFailed': '提交失败，请重试',
    'error.networkTimeout': '网络超时',
    'error.serverError': '服务器错误',
    'error.unauthorized': '未授权，请先登录',
    
    // 操作提示
    'action.switch': '切换视角',
    'action.switchConfirm': '确定要切换为{target}视角吗？',
    'action.refreshSuccess': '刷新成功',
    'action.refreshFailed': '刷新失败',
    'action.saveSuccess': '保存成功',
    'action.saveFailed': '保存失败',
    'action.deleteConfirm': '确定要删除吗？',
    
    // 时间相关
    'time.today': '今日',
    'time.yesterday': '昨日',
    'time.thisWeek': '本周',
    'time.lastWeek': '上周',
    'time.thisMonth': '本月',
    'time.lastMonth': '上月'
  },
  
  // 英文
  'en-US': {
    // Common
    'common.loading': 'Loading...',
    'common.refreshing': 'Refreshing...',
    'common.success': 'Success',
    'common.failed': 'Failed',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.noData': 'No Data',
    'common.networkError': 'Network Error, Please Retry',
    
    // Order
    'order.title': 'Order Management',
    'order.all': 'All',
    'order.pendingAccept': 'Pending Accept',
    'order.pendingExecute': 'Pending Execute',
    'order.executing': 'Executing',
    'order.pendingConfirm': 'Pending Confirm',
    'order.completed': 'Completed',
    'order.cancelled': 'Cancelled',
    'order.count': 'Order Count: {count}',
    'order.detail': 'Order Detail',
    'order.accept': 'Accept Order',
    'order.assign': 'Assign Task',
    'order.audit': 'Audit Material',
    
    // Volunteer
    'volunteer.title': 'Volunteer Management',
    'volunteer.name': 'Volunteer Name',
    'volunteer.phone': 'Phone Number',
    'volunteer.status': 'Status',
    'volunteer.active': 'Active',
    'volunteer.inactive': 'Inactive',
    
    // Settlement
    'settlement.title': 'Settlement Management',
    'settlement.amount': 'Settlement Amount',
    'settlement.date': 'Settlement Date',
    'settlement.status': 'Settlement Status',
    
    // Status
    'status.audited': 'Audited',
    'status.pending': 'Pending',
    'status.rejected': 'Rejected',
    
    // Error
    'error.loadFailed': 'Load Failed, Please Retry',
    'error.submitFailed': 'Submit Failed, Please Retry',
    'error.networkTimeout': 'Network Timeout',
    'error.serverError': 'Server Error',
    'error.unauthorized': 'Unauthorized, Please Login First',
    
    // Action
    'action.switch': 'Switch View',
    'action.switchConfirm': 'Are you sure to switch to {target} view?',
    'action.refreshSuccess': 'Refresh Success',
    'action.refreshFailed': 'Refresh Failed',
    'action.saveSuccess': 'Save Success',
    'action.saveFailed': 'Save Failed',
    'action.deleteConfirm': 'Are you sure to delete?',
    
    // Time
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.thisWeek': 'This Week',
    'time.lastWeek': 'Last Week',
    'time.thisMonth': 'This Month',
    'time.lastMonth': 'Last Month'
  }
};

// 当前语言
let currentLang = DEFAULT_LANG;

/**
 * 初始化 i18n
 * @param {string} lang - 语言代码 (zh-CN, en-US)
 * @returns {boolean} 初始化是否成功
 */
function init(lang = DEFAULT_LANG) {
  if (SUPPORTED_LANGS.includes(lang)) {
    currentLang = lang;
    // [CLEANED] console.log('[i18n] 初始化成功，当前语言:', lang);
    return true;
  } else {
    console.warn('[i18n] 不支持的语言:', lang, '使用默认语言:', DEFAULT_LANG);
    currentLang = DEFAULT_LANG;
    return false;
  }
}

/**
 * 获取翻译文本
 * @param {string} key - 翻译键 (例如：'common.loading')
 * @param {Object} params - 参数对象 (用于替换占位符 {param})
 * @returns {string} 翻译后的文本
 * 
 * @example
 * // 简单翻译
 * i18n.t('common.loading'); // '加载中...'
 * 
 * // 带参数翻译
 * i18n.t('order.count', { count: 5 }); // '订单数量：5'
 */
function t(key, params = {}) {
  const langMessages = messages[currentLang] || messages[DEFAULT_LANG];
  let text = langMessages[key] || key;
  
  // 替换占位符 {param}
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      const placeholder = new RegExp(`\\{${paramKey}\\}`, 'g');
      text = text.replace(placeholder, params[paramKey]);
    });
  }
  
  return text;
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
function getLang() {
  return currentLang;
}

/**
 * 设置语言
 * @param {string} lang - 语言代码
 * @returns {boolean} 设置是否成功
 */
function setLang(lang) {
  return init(lang);
}

/**
 * 获取支持的语言列表
 * @returns {string[]} 支持的语言代码列表
 */
function getSupportedLangs() {
  return [...SUPPORTED_LANGS];
}

/**
 * 添加自定义翻译
 * @param {string} lang - 语言代码
 * @param {string} key - 翻译键
 * @param {string} value - 翻译值
 */
function addMessage(lang, key, value) {
  if (!messages[lang]) {
    messages[lang] = {};
  }
  messages[lang][key] = value;
  // [CLEANED] console.log('[i18n] 添加自定义翻译:', lang, key, value);
}

/**
 * 批量添加翻译
 * @param {string} lang - 语言代码
 * @param {Object} newMessages - 翻译对象
 */
function addMessages(lang, newMessages) {
  if (!messages[lang]) {
    messages[lang] = {};
  }
  Object.assign(messages[lang], newMessages);
  // [CLEANED] console.log('[i18n] 批量添加翻译:', lang, Object.keys(newMessages).length, '条');
}

module.exports = {
  init,
  t,
  getLang,
  setLang,
  getSupportedLangs,
  addMessage,
  addMessages,
  // 导出语言包（用于调试或扩展）
  messages
};
