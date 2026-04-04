// utils/util.js - 工具函数

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {String} fmt - 格式化字符串 (默认：'YYYY-MM-DD HH:mm:ss')
 * @returns {String} 格式化后的日期字符串
 */
const formatDate = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    date = new Date()
  }
  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  
  const o = {
    'M+': month,
    'D+': day,
    'H+': hours,
    'm+': minutes,
    's+': seconds
  }
  
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(year).substr(4 - RegExp.$1.length))
  }
  
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      const v = String(o[k])
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? v : ('00' + v).substr(v.length))
    }
  }
  
  return fmt
}

/**
 * 获取农历日期
 * @param {Date} date - 公历日期
 * @returns {Object} 农历信息 {lunarYear, lunarMonth, lunarDay, ganzhi}
 */
const getLunarDate = (date) => {
  // TODO: 实现农历转换算法
  // 这里先返回 mock 数据
  return {
    lunarYear: 2569,
    lunarMonth: '二月',
    lunarDay: '十七',
    ganzhi: '乙巳年 庚辰月 癸未日'
  }
}

/**
 * 获取佛历日期
 * @param {Date} date - 公历日期
 * @returns {String} 佛历字符串
 */
const getBuddhistDate = (date) => {
  const year = date.getFullYear()
  const buddhistYear = year + 543 // 佛历 = 公历 + 543
  return `佛历 ${buddhistYear}年`
}

/**
 * 获取宜忌
 * @param {Date} date - 日期
 * @returns {Object} {suit: [], avoid: []}
 */
const getSuitAndAvoid = (date) => {
  // TODO: 实现宜忌计算
  return {
    suit: ['护生', '行善', '祈福'],
    avoid: ['杀生', '偷盗', '妄语']
  }
}

/**
 * 获取随机禅理
 * @returns {String} 禅理短句
 */
const getRandomZenQuote = () => {
  const quotes = [
    '积善成德，而神明自得，圣心备焉',
    '心无挂碍，无挂碍故，无有恐怖',
    '诸恶莫作，众善奉行',
    '应无所住，而生其心',
    '一切有为法，如梦幻泡影',
    '菩提本无树，明镜亦非台',
    '本来无一物，何处惹尘埃',
    '色即是空，空即是色'
  ]
  const index = Math.floor(Math.random() * quotes.length)
  return quotes[index]
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} delay - 延迟时间 (毫秒)
 * @returns {Function} 防抖后的函数
 */
const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {Number} interval - 间隔时间 (毫秒)
 * @returns {Function} 节流后的函数
 */
const throttle = (fn, interval = 300) => {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 格式化数字 (添加千分位)
 * @param {Number} num - 数字
 * @returns {String} 格式化后的字符串
 */
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 计算相对时间
 * @param {Number} timestamp - 时间戳 (毫秒)
 * @returns {String} 相对时间字符串
 */
const formatRelativeTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前'
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前'
  } else {
    return formatDate(new Date(timestamp), 'YYYY-MM-DD')
  }
}

/**
 * 深拷贝
 * @param {*} obj - 需要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }
  
  const cloned = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

module.exports = {
  formatDate,
  getLunarDate,
  getBuddhistDate,
  getSuitAndAvoid,
  getRandomZenQuote,
  debounce,
  throttle,
  formatNumber,
  formatRelativeTime,
  deepClone
}
