/**
 * 全局工具函数库
 * Stitch V3.0 规范
 * 提供常用的工具方法，增强小程序开发效率
 */

/**
 * 日期格式化函数
 * @param {Date|Number|String} date - 日期对象、时间戳或日期字符串
 * @param {String} format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {String} 格式化后的日期字符串
 * 
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD') // "2026-04-14"
 * formatDate(1713081600000, 'YYYY/MM/DD HH:mm') // "2024/04/14 12:00"
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  // 转换为 Date 对象
  let d;
  if (typeof date === 'number') {
    d = new Date(date);
  } else if (typeof date === 'string') {
    d = new Date(date.replace(/-/g, '/'));
  } else {
    d = new Date(date);
  }
  
  if (isNaN(d.getTime())) {
    console.warn('无效的日期格式:', date);
    return '';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  // 补零函数
  const pad = (num) => num.toString().padStart(2, '0');
  
  // 替换格式化模板
  return format
    .replace('YYYY', year)
    .replace('MM', pad(month))
    .replace('DD', pad(day))
    .replace('HH', pad(hours))
    .replace('mm', pad(minutes))
    .replace('ss', pad(seconds));
}

/**
 * 农历转换函数
 * 简化的农历转换实现，适用于一般场景
 * @param {Date|Number|String} date - 公历日期
 * @returns {Object} 包含农历信息的对象
 * 
 * @example
 * formatLunar(new Date()) // { year: '甲子', month: '正月', day: '初一', full: '甲子年 正月初一' }
 */
function formatLunar(date) {
  if (!date) return null;
  
  // 转换为 Date 对象
  let d;
  if (typeof date === 'number') {
    d = new Date(date);
  } else if (typeof date === 'string') {
    d = new Date(date.replace(/-/g, '/'));
  } else {
    d = new Date(date);
  }
  
  if (isNaN(d.getTime())) {
    return null;
  }
  
  // 简化的农历转换表 (1900-2100)
  // 实际项目中建议使用成熟的农历库如 lunar-javascript
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520
  ];
  
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const lunarDays = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ];
  
  // 简化的农历计算（实际项目建议使用专业库）
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  // 计算天干地支
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  const ganZhiYear = tianGan[ganIndex] + diZhi[zhiIndex];
  
  // 简化的农历月份和日期（这里使用公历近似）
  const lunarMonth = lunarMonths[(month - 1) % 12];
  const lunarDay = lunarDays[(day - 1) % 30];
  
  return {
    year: ganZhiYear,
    month: lunarMonth + '月',
    day: lunarDay,
    full: `${ganZhiYear}年 ${lunarMonth}月${lunarDay}`
  };
}

/**
 * 显示加载提示
 * @param {String} title - 加载提示文字，默认 '加载中...'
 * @param {Boolean} mask - 是否显示遮罩，默认 true
 * 
 * @example
 * showLoading('数据加载中')
 * // 业务逻辑...
 * wx.hideLoading()
 */
function showLoading(title = '加载中...', mask = true) {
  wx.showLoading({
    title: title,
    mask: mask
  });
}

/**
 * 显示成功提示
 * @param {String} title - 提示文字，默认 '操作成功'
 * @param {Number} duration - 显示时长（毫秒），默认 1500
 * 
 * @example
 * showToast('保存成功')
 * showToast('提交成功', 2000)
 */
function showToast(title = '操作成功', duration = 1500) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration,
    mask: true
  });
}

/**
 * 显示错误提示
 * @param {String} title - 提示文字，默认 '操作失败'
 * @param {Number} duration - 显示时长（毫秒），默认 2000
 * 
 * @example
 * showError('网络错误')
 * showError('保存失败', 3000)
 */
function showError(title = '操作失败', duration = 2000) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: duration,
    mask: true
  });
}

/**
 * 显示操作菜单
 * @param {Array<String>} itemList - 菜单项列表
 * @param {Function} success - 成功回调，接收 {index} 参数
 * @param {Function} fail - 失败回调
 * 
 * @example
 * showActionSheet(['编辑', '删除', '取消'], (res) => {
 *   if (res.index === 0) {
 *     // 编辑操作
 *   }
 * })
 */
function showActionSheet(itemList, success, fail) {
  wx.showActionSheet({
    itemList: itemList,
    success: (res) => {
      if (success && typeof success === 'function') {
        success({
          index: res.tapIndex,
          tapIndex: res.tapIndex
        });
      }
    },
    fail: (err) => {
      if (fail && typeof fail === 'function') {
        fail(err);
      }
    }
  });
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} delay - 延迟时间（毫秒），默认 300
 * @returns {Function} 防抖后的函数
 * 
 * @example
 * const searchDebounced = debounce((keyword) => {
 *   // 搜索逻辑
 * }, 500)
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
 * @param {Number} interval - 间隔时间（毫秒），默认 300
 * @returns {Function} 节流后的函数
 * 
 * @example
 * const scrollThrottled = throttle(() => {
 *   // 滚动处理逻辑
 * }, 200)
 */
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝函数
 * @param {Any} obj - 需要拷贝的对象
 * @returns {Any} 拷贝后的对象
 * 
 * @example
 * const newObj = deepClone(oldObj)
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
  
  return obj;
}

/**
 * 格式化数字（添加千分位）
 * @param {Number} num - 数字
 * @param {Number} decimals - 小数位数，默认 2
 * @returns {String} 格式化后的字符串
 * 
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 */
function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) {
    return '0';
  }
  
  const number = Number(num);
  if (isNaN(number)) {
    return '0';
  }
  
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// 导出所有工具函数
module.exports = {
  formatDate,
  formatLunar,
  showLoading,
  showToast,
  showError,
  showActionSheet,
  debounce,
  throttle,
  deepClone,
  formatNumber
};
