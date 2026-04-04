/**
 * 清如 ClearSpring - 缓存工具类
 * 基于 V4.0 规范：智能缓存、过期清理、内存管理
 */

// 缓存配置
const CACHE_CONFIG = {
  // 默认过期时间（毫秒）
  DEFAULT_EXPIRY: 5 * 60 * 1000, // 5 分钟
  
  // 最大缓存条目数
  MAX_CACHE_SIZE: 100,
  
  // 缓存前缀
  PREFIX: 'cache_',
  
  // 内存缓存（运行时）
  MEMORY_CACHE: {},
  
  // 缓存元数据
  METADATA_KEY: 'cache_metadata'
}

/**
 * 获取缓存键
 * @param {string} key - 原始键
 * @returns {string} 带前缀的键
 */
function getCacheKey(key) {
  return `${CACHE_CONFIG.PREFIX}${key}`
}

/**
 * 获取缓存元数据
 * @returns {Object} 元数据对象
 */
function getMetadata() {
  try {
    const metadata = wx.getStorageSync(CACHE_CONFIG.METADATA_KEY)
    return metadata ? JSON.parse(metadata) : { keys: [], lastClean: Date.now() }
  } catch (e) {
    return { keys: [], lastClean: Date.now() }
  }
}

/**
 * 保存缓存元数据
 * @param {Object} metadata - 元数据对象
 */
function saveMetadata(metadata) {
  try {
    wx.setStorageSync(CACHE_CONFIG.METADATA_KEY, JSON.stringify(metadata))
  } catch (e) {
    console.error('[缓存] 保存元数据失败', e)
  }
}

/**
 * 清理过期缓存
 * @param {boolean} force - 是否强制清理所有缓存
 */
function cleanExpired(force = false) {
  const metadata = getMetadata()
  const now = Date.now()
  const validKeys = []
  
  metadata.keys.forEach(key => {
    const cacheKey = getCacheKey(key)
    const cached = wx.getStorageSync(cacheKey)
    
    if (!cached || force) {
      // 缓存不存在或强制清理
      wx.removeStorageSync(cacheKey)
    } else {
      const { expiry } = cached
      if (expiry && expiry < now) {
        // 已过期
        wx.removeStorageSync(cacheKey)
      } else {
        // 仍然有效
        validKeys.push(key)
      }
    }
  })
  
  // 更新元数据
  metadata.keys = validKeys
  metadata.lastClean = now
  saveMetadata(metadata)
  
  console.log(`[缓存] 清理完成，剩余 ${validKeys.length} 条缓存`)
}

/**
 * 检查缓存大小，超出限制时清理最旧的缓存
 */
function checkCacheSize() {
  const metadata = getMetadata()
  
  if (metadata.keys.length >= CACHE_CONFIG.MAX_CACHE_SIZE) {
    // 清理最旧的 20% 缓存
    const keysToRemove = metadata.keys.slice(0, Math.floor(CACHE_CONFIG.MAX_CACHE_SIZE * 0.2))
    keysToRemove.forEach(key => {
      wx.removeStorageSync(getCacheKey(key))
    })
    
    metadata.keys = metadata.keys.slice(keysToRemove.length)
    saveMetadata(metadata)
    
    console.log(`[缓存] 容量超限，已清理 ${keysToRemove.length} 条旧缓存`)
  }
}

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {any} value - 缓存值
 * @param {Object} options - 选项
 * @param {number} options.expiry - 过期时间（毫秒），默认 5 分钟
 * @param {boolean} options.persistent - 是否持久化（默认 true，false 则仅内存缓存）
 */
export function set(key, value, options = {}) {
  const {
    expiry = CACHE_CONFIG.DEFAULT_EXPIRY,
    persistent = true
  } = options
  
  const cacheKey = getCacheKey(key)
  const cacheData = {
    value,
    expiry: expiry > 0 ? Date.now() + expiry : null,
    timestamp: Date.now()
  }
  
  try {
    if (persistent) {
      // 持久化缓存
      wx.setStorageSync(cacheKey, cacheData)
      
      // 更新元数据
      const metadata = getMetadata()
      if (!metadata.keys.includes(key)) {
        metadata.keys.push(key)
        saveMetadata(metadata)
      }
      
      // 检查缓存大小
      checkCacheSize()
    } else {
      // 仅内存缓存
      CACHE_CONFIG.MEMORY_CACHE[cacheKey] = cacheData
    }
    
    console.log(`[缓存] 设置缓存：${key}`)
  } catch (e) {
    console.error('[缓存] 设置缓存失败', key, e)
    
    // 存储失败时尝试清理
    if (e.errMsg && e.errMsg.includes('exceeds size limit')) {
      cleanExpired(true)
    }
  }
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @param {any} defaultValue - 默认值（缓存不存在或过期时返回）
 * @param {Object} options - 选项
 * @param {boolean} options.memoryOnly - 是否仅从内存读取（默认 false）
 * @returns {any} 缓存值或默认值
 */
export function get(key, defaultValue = null, options = {}) {
  const {
    memoryOnly = false
  } = options
  
  const cacheKey = getCacheKey(key)
  const now = Date.now()
  
  try {
    let cached
    
    if (memoryOnly) {
      // 仅从内存读取
      cached = CACHE_CONFIG.MEMORY_CACHE[cacheKey]
    } else {
      // 优先从内存读取
      cached = CACHE_CONFIG.MEMORY_CACHE[cacheKey]
      
      // 内存未命中，从存储读取
      if (!cached) {
        cached = wx.getStorageSync(cacheKey)
        
        // 写入内存缓存
        if (cached) {
          CACHE_CONFIG.MEMORY_CACHE[cacheKey] = cached
        }
      }
    }
    
    if (!cached) {
      return defaultValue
    }
    
    // 检查过期
    if (cached.expiry && cached.expiry < now) {
      // 已过期，删除缓存
      remove(key)
      return defaultValue
    }
    
    return cached.value
  } catch (e) {
    console.error('[缓存] 获取缓存失败', key, e)
    return defaultValue
  }
}

/**
 * 删除缓存
 * @param {string} key - 缓存键
 */
export function remove(key) {
  const cacheKey = getCacheKey(key)
  
  try {
    // 删除存储缓存
    wx.removeStorageSync(cacheKey)
    
    // 删除内存缓存
    delete CACHE_CONFIG.MEMORY_CACHE[cacheKey]
    
    // 更新元数据
    const metadata = getMetadata()
    metadata.keys = metadata.keys.filter(k => k !== key)
    saveMetadata(metadata)
    
    console.log(`[缓存] 删除缓存：${key}`)
  } catch (e) {
    console.error('[缓存] 删除缓存失败', key, e)
  }
}

/**
 * 清空所有缓存
 */
export function clear() {
  try {
    const metadata = getMetadata()
    
    // 删除所有缓存键
    metadata.keys.forEach(key => {
      wx.removeStorageSync(getCacheKey(key))
    })
    
    // 清空内存缓存
    CACHE_CONFIG.MEMORY_CACHE = {}
    
    // 重置元数据
    saveMetadata({ keys: [], lastClean: Date.now() })
    
    console.log('[缓存] 清空所有缓存')
  } catch (e) {
    console.error('[缓存] 清空缓存失败', e)
  }
}

/**
 * 检查缓存是否存在且未过期
 * @param {string} key - 缓存键
 * @returns {boolean} 是否存在
 */
export function has(key) {
  return get(key, null) !== null
}

/**
 * 获取缓存统计信息
 * @returns {Object} 统计信息
 */
export function getStats() {
  const metadata = getMetadata()
  const now = Date.now()
  
  let totalSize = 0
  let validCount = 0
  let expiredCount = 0
  
  metadata.keys.forEach(key => {
    try {
      const cached = wx.getStorageSync(getCacheKey(key))
      if (cached) {
        totalSize += JSON.stringify(cached).length
        if (cached.expiry && cached.expiry < now) {
          expiredCount++
        } else {
          validCount++
        }
      }
    } catch (e) {
      // 忽略错误
    }
  })
  
  return {
    totalKeys: metadata.keys.length,
    validCount,
    expiredCount,
    memoryKeys: Object.keys(CACHE_CONFIG.MEMORY_CACHE).length,
    totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
    lastClean: metadata.lastClean
  }
}

/**
 * 预加载缓存（后台静默加载）
 * @param {string} key - 缓存键
 * @param {Function} loader - 数据加载函数
 * @param {Object} options - 选项
 */
export async function preload(key, loader, options = {}) {
  // 如果已有有效缓存，直接返回
  if (has(key)) {
    return get(key)
  }
  
  try {
    const data = await loader()
    set(key, data, options)
    return data
  } catch (e) {
    console.error('[缓存] 预加载失败', key, e)
    throw e
  }
}

/**
 * 带缓存的请求（适用于 API 响应缓存）
 * @param {string} key - 缓存键
 * @param {Function} requestFn - 请求函数
 * @param {number} expiry - 过期时间（毫秒）
 * @returns {Promise<any>} 请求结果
 */
export async function cachedRequest(key, requestFn, expiry = CACHE_CONFIG.DEFAULT_EXPIRY) {
  // 尝试从缓存获取
  const cached = get(key)
  if (cached !== null) {
    console.log(`[缓存] 命中缓存：${key}`)
    return cached
  }
  
  // 缓存未命中，执行请求
  console.log(`[缓存] 未命中，执行请求：${key}`)
  const data = await requestFn()
  
  // 保存到缓存
  set(key, data, { expiry })
  
  return data
}

/**
 * 初始化缓存系统
 * 建议在 app.js 中调用
 */
export function initCache() {
  console.log('[缓存] 初始化缓存系统')
  
  // 启动时清理过期缓存
  cleanExpired()
  
  // 设置定时清理（每 30 分钟）
  setInterval(() => {
    cleanExpired()
  }, 30 * 60 * 1000)
}

export default {
  set,
  get,
  remove,
  clear,
  has,
  getStats,
  preload,
  cachedRequest,
  initCache,
  cleanExpired
}
