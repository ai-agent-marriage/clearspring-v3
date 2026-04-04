/**
 * 清如 ClearSpring - 优化版缓存工具类
 * 
 * 功能特性:
 * - 支持内存缓存 + 本地存储双缓存
 * - 支持自定义过期时间
 * - 支持缓存统计和监控
 * - 支持批量操作
 * - 自动清理过期缓存
 * 
 * @version 2.0.0
 * @author AI Agent
 * @date 2026-04-04
 */

// ========== 配置项 ==========
const CONFIG = {
  // 缓存前缀（避免 key 冲突）
  PREFIX: 'clearspring_cache_',
  
  // 内存缓存最大条目数
  MAX_MEMORY_ITEMS: 100,
  
  // 默认缓存时间（秒）
  DEFAULT_EXPIRE: 300, // 5 分钟
  
  // 自动清理间隔（毫秒）
  CLEANUP_INTERVAL: 60000, // 1 分钟
  
  // 是否启用本地存储
  ENABLE_STORAGE: true,
  
  // 是否启用调试日志
  DEBUG: false
}

// ========== 内存缓存 ==========
const memoryCache = new Map()

// ========== 缓存统计 ==========
const stats = {
  hits: 0,      // 命中次数
  misses: 0,    // 未命中次数
  sets: 0,      // 设置次数
  deletes: 0,   // 删除次数
  cleanups: 0   // 清理次数
}

// ========== 清理定时器 ==========
let cleanupTimer = null

/**
 * 初始化缓存系统
 * 启动自动清理定时器，恢复本地存储缓存
 */
function init() {
  if (CONFIG.DEBUG) {
    console.log('[Cache] 初始化缓存系统')
  }
  
  // 从本地存储恢复缓存
  if (CONFIG.ENABLE_STORAGE) {
    restoreFromStorage()
  }
  
  // 启动自动清理定时器
  startCleanupTimer()
}

/**
 * 启动自动清理定时器
 */
function startCleanupTimer() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
  }
  
  cleanupTimer = setInterval(() => {
    cleanup()
  }, CONFIG.CLEANUP_INTERVAL)
}

/**
 * 停止自动清理定时器
 */
function stopCleanupTimer() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
}

/**
 * 生成缓存 key
 * @param {string} key - 原始 key
 * @returns {string} 带前缀的 key
 */
function makeKey(key) {
  return `${CONFIG.PREFIX}${key}`
}

/**
 * 移除缓存 key 前缀
 * @param {string} key - 带前缀的 key
 * @returns {string} 原始 key
 */
function removeKeyPrefix(key) {
  return key.replace(CONFIG.PREFIX, '')
}

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {*} value - 缓存值（会被 JSON 序列化）
 * @param {number} expireSeconds - 过期时间（秒），默认 300 秒
 * @returns {boolean} 是否设置成功
 */
function set(key, value, expireSeconds = CONFIG.DEFAULT_EXPIRE) {
  try {
    const fullKey = makeKey(key)
    const now = Date.now()
    const expireTime = expireSeconds > 0 ? now + expireSeconds * 1000 : null
    
    const cacheItem = {
      value: value,
      expire: expireTime,
      createTime: now,
      accessTime: now
    }
    
    // 写入内存缓存
    memoryCache.set(fullKey, cacheItem)
    
    // 检查内存缓存大小，超出则清理最久未使用的
    if (memoryCache.size > CONFIG.MAX_MEMORY_ITEMS) {
      evictOldest()
    }
    
    // 写入本地存储
    if (CONFIG.ENABLE_STORAGE) {
      saveToStorage(fullKey, cacheItem)
    }
    
    // 更新统计
    stats.sets++
    
    if (CONFIG.DEBUG) {
      console.log(`[Cache] SET: ${key}, expire: ${expireSeconds}s`)
    }
    
    return true
  } catch (error) {
    console.error('[Cache] SET 失败:', error)
    return false
  }
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @param {number} expireSeconds - 过期时间（秒），用于验证
 * @returns {*} 缓存值，不存在或已过期返回 null
 */
function get(key, expireSeconds) {
  try {
    const fullKey = makeKey(key)
    const cacheItem = memoryCache.get(fullKey)
    
    // 内存缓存未命中，尝试从本地存储加载
    if (!cacheItem && CONFIG.ENABLE_STORAGE) {
      const stored = loadFromStorage(fullKey)
      if (stored) {
        memoryCache.set(fullKey, stored)
        return getCachedValue(key, stored, expireSeconds)
      }
    }
    
    return getCachedValue(key, cacheItem, expireSeconds)
  } catch (error) {
    console.error('[Cache] GET 失败:', error)
    return null
  }
}

/**
 * 获取缓存值的内部方法
 * @param {string} key - 原始 key
 * @param {Object} cacheItem - 缓存项
 * @param {number} expireSeconds - 过期时间
 * @returns {*} 缓存值或 null
 */
function getCachedValue(key, cacheItem, expireSeconds) {
  if (!cacheItem) {
    stats.misses++
    if (CONFIG.DEBUG) {
      console.log(`[Cache] MISS: ${key}`)
    }
    return null
  }
  
  const now = Date.now()
  
  // 检查是否过期
  if (cacheItem.expire && now > cacheItem.expire) {
    remove(key)
    stats.misses++
    if (CONFIG.DEBUG) {
      console.log(`[Cache] EXPIRED: ${key}`)
    }
    return null
  }
  
  // 如果传入了 expireSeconds，验证是否匹配
  if (expireSeconds !== undefined && cacheItem.expire) {
    const remaining = cacheItem.expire - now
    if (remaining <= 0) {
      remove(key)
      stats.misses++
      return null
    }
  }
  
  // 更新访问时间
  cacheItem.accessTime = now
  memoryCache.set(makeKey(key), cacheItem)
  
  stats.hits++
  
  if (CONFIG.DEBUG) {
    console.log(`[Cache] HIT: ${key}`)
  }
  
  return cacheItem.value
}

/**
 * 检查缓存是否存在且未过期
 * @param {string} key - 缓存键
 * @returns {boolean} 是否存在
 */
function has(key) {
  const fullKey = makeKey(key)
  const cacheItem = memoryCache.get(fullKey)
  
  if (!cacheItem) {
    return false
  }
  
  if (cacheItem.expire && Date.now() > cacheItem.expire) {
    remove(key)
    return false
  }
  
  return true
}

/**
 * 删除缓存
 * @param {string} key - 缓存键
 * @returns {boolean} 是否删除成功
 */
function remove(key) {
  try {
    const fullKey = makeKey(key)
    
    // 从内存缓存删除
    const deleted = memoryCache.delete(fullKey)
    
    // 从本地存储删除
    if (CONFIG.ENABLE_STORAGE) {
      try {
        wx.removeStorageSync(fullKey)
      } catch (e) {
        // 忽略存储删除失败
      }
    }
    
    if (deleted) {
      stats.deletes++
      if (CONFIG.DEBUG) {
        console.log(`[Cache] REMOVE: ${key}`)
      }
    }
    
    return deleted
  } catch (error) {
    console.error('[Cache] REMOVE 失败:', error)
    return false
  }
}

/**
 * 清空所有缓存
 * @returns {boolean} 是否清空成功
 */
function clear() {
  try {
    // 清空内存缓存
    memoryCache.clear()
    
    // 清空本地存储
    if (CONFIG.ENABLE_STORAGE) {
      try {
        const keys = getAllStorageKeys()
        keys.forEach(key => {
          if (key.startsWith(CONFIG.PREFIX)) {
            wx.removeStorageSync(key)
          }
        })
      } catch (e) {
        // 忽略存储清空失败
      }
    }
    
    // 重置统计
    resetStats()
    
    if (CONFIG.DEBUG) {
      console.log('[Cache] CLEAR ALL')
    }
    
    return true
  } catch (error) {
    console.error('[Cache] CLEAR 失败:', error)
    return false
  }
}

/**
 * 批量设置缓存
 * @param {Array} items - 缓存项数组 [{key, value, expire}]
 * @returns {number} 成功设置的数量
 */
function setBatch(items) {
  let successCount = 0
  
  items.forEach(item => {
    if (set(item.key, item.value, item.expire)) {
      successCount++
    }
  })
  
  return successCount
}

/**
 * 批量获取缓存
 * @param {Array} keys - 缓存键数组
 * @returns {Object} 缓存值对象 {key: value}
 */
function getBatch(keys) {
  const result = {}
  
  keys.forEach(key => {
    result[key] = get(key)
  })
  
  return result
}

/**
 * 批量删除缓存
 * @param {Array} keys - 缓存键数组
 * @returns {number} 成功删除的数量
 */
function removeBatch(keys) {
  let successCount = 0
  
  keys.forEach(key => {
    if (remove(key)) {
      successCount++
    }
  })
  
  return successCount
}

/**
 * 清理过期缓存
 * @returns {number} 清理的数量
 */
function cleanup() {
  try {
    const now = Date.now()
    let count = 0
    
    // 清理内存缓存
    memoryCache.forEach((cacheItem, key) => {
      if (cacheItem.expire && now > cacheItem.expire) {
        memoryCache.delete(key)
        count++
      }
    })
    
    // 清理本地存储
    if (CONFIG.ENABLE_STORAGE) {
      const keys = getAllStorageKeys()
      keys.forEach(key => {
        if (key.startsWith(CONFIG.PREFIX)) {
          try {
            const item = wx.getStorageSync(key)
            if (item && item.expire && now > item.expire) {
              wx.removeStorageSync(key)
              count++
            }
          } catch (e) {
            // 忽略单个缓存读取失败
          }
        }
      })
    }
    
    if (count > 0) {
      stats.cleanups += count
      if (CONFIG.DEBUG) {
        console.log(`[Cache] CLEANUP: ${count} items`)
      }
    }
    
    return count
  } catch (error) {
    console.error('[Cache] CLEANUP 失败:', error)
    return 0
  }
}

/**
 * 获取缓存统计信息
 * @returns {Object} 统计信息
 */
function getStats() {
  const total = stats.hits + stats.misses
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : 0
  
  return {
    hits: stats.hits,
    misses: stats.misses,
    hitRate: hitRate + '%',
    sets: stats.sets,
    deletes: stats.deletes,
    cleanups: stats.cleanups,
    memorySize: memoryCache.size,
    maxMemorySize: CONFIG.MAX_MEMORY_ITEMS
  }
}

/**
 * 重置统计信息
 */
function resetStats() {
  stats.hits = 0
  stats.misses = 0
  stats.sets = 0
  stats.deletes = 0
  stats.cleanups = 0
}

/**
 * 逐出最久未使用的缓存项
 */
function evictOldest() {
  let oldestKey = null
  let oldestTime = Infinity
  
  memoryCache.forEach((cacheItem, key) => {
    if (cacheItem.accessTime < oldestTime) {
      oldestTime = cacheItem.accessTime
      oldestKey = key
    }
  })
  
  if (oldestKey) {
    memoryCache.delete(oldestKey)
    if (CONFIG.DEBUG) {
      console.log(`[Cache] EVICT: ${removeKeyPrefix(oldestKey)}`)
    }
  }
}

/**
 * 保存缓存到本地存储
 * @param {string} key - 缓存键
 * @param {Object} cacheItem - 缓存项
 */
function saveToStorage(key, cacheItem) {
  try {
    wx.setStorageSync(key, cacheItem)
  } catch (error) {
    // 存储空间不足时，清理部分缓存
    if (error.errMsg && error.errMsg.includes('exceed')) {
      cleanup()
      // 重试一次
      try {
        wx.setStorageSync(key, cacheItem)
      } catch (e) {
        console.warn('[Cache] 存储空间不足，跳过本地存储')
      }
    }
  }
}

/**
 * 从本地存储加载缓存
 * @param {string} key - 缓存键
 * @returns {Object|null} 缓存项
 */
function loadFromStorage(key) {
  try {
    return wx.getStorageSync(key) || null
  } catch (error) {
    return null
  }
}

/**
 * 获取所有本地存储键
 * @returns {Array} 键数组
 */
function getAllStorageKeys() {
  try {
    const info = wx.getStorageInfoSync()
    return info.keys || []
  } catch (error) {
    return []
  }
}

/**
 * 恢复本地存储缓存到内存
 */
function restoreFromStorage() {
  try {
    const keys = getAllStorageKeys()
    const now = Date.now()
    let count = 0
    
    keys.forEach(key => {
      if (key.startsWith(CONFIG.PREFIX) && memoryCache.size < CONFIG.MAX_MEMORY_ITEMS) {
        try {
          const item = wx.getStorageSync(key)
          if (item && (!item.expire || now < item.expire)) {
            memoryCache.set(key, item)
            count++
          }
        } catch (e) {
          // 忽略单个缓存加载失败
        }
      }
    })
    
    if (CONFIG.DEBUG) {
      console.log(`[Cache] 从存储恢复 ${count} 项缓存`)
    }
  } catch (error) {
    console.error('[Cache] 恢复存储失败:', error)
  }
}

/**
 * 预加载缓存（启动时加载常用数据）
 * @param {Array} items - 预加载项 [{key, loader, expire}]
 * @returns {Promise} 预加载完成 Promise
 */
async function preload(items) {
  const promises = items.map(async item => {
    // 如果缓存已存在且未过期，跳过
    if (has(item.key)) {
      return
    }
    
    // 调用加载器获取数据
    try {
      const data = await item.loader()
      if (data !== null && data !== undefined) {
        set(item.key, data, item.expire)
      }
    } catch (error) {
      console.error(`[Cache] 预加载失败 ${item.key}:`, error)
    }
  })
  
  await Promise.all(promises)
  
  if (CONFIG.DEBUG) {
    console.log('[Cache] 预加载完成')
  }
}

// ========== 导出 API ==========
module.exports = {
  // 初始化
  init,
  
  // 基本操作
  set,
  get,
  has,
  remove,
  clear,
  
  // 批量操作
  setBatch,
  getBatch,
  removeBatch,
  
  // 缓存管理
  cleanup,
  preload,
  
  // 统计信息
  getStats,
  resetStats,
  
  // 配置（只读）
  config: CONFIG
}
