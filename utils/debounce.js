/**
 * 防抖工具函数
 * 用于限制函数在指定时间内的重复调用
 * @module utils/debounce
 */

/**
 * 防抖函数
 * 在函数被触发 n 秒后再执行，如果在这 n 秒内又被触发，则重新计时
 * @function debounce
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 返回防抖后的函数
 * 
 * @example
 * // 基础用法：搜索输入防抖
 * const searchHandler = debounce((keyword) => {
 *   // [CLEANED] console.log('搜索:', keyword);
 * }, 500);
 * 
 * input.on('input', (e) => {
 *   searchHandler(e.detail.value);
 * });
 * 
 * @example
 * // 立即执行：防止按钮重复点击
 * const submitBtn = debounce(() => {
 *   submitForm();
 * }, 1000, true);
 */
function debounce(func, wait = 300, immediate = false) {
  let timeout = null;
  
  return function(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * 节流函数
 * 在指定时间内只执行一次函数
 * @function throttle
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 返回节流后的函数
 * 
 * @example
 * // 滚动事件节流
 * const scrollHandler = throttle(() => {
 *   // [CLEANED] console.log('滚动中...');
 * }, 200);
 * 
 * page.onScroll(scrollHandler);
 */
function throttle(func, limit = 300) {
  let inThrottle = false;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

module.exports = {
  debounce,
  throttle
};
