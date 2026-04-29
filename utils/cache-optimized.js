/**
 * 清如 ClearSpring - 优化版缓存工具类（后端 Node.js 版本）
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
 * @date 2026-04-12
 */

const fs = require('fs');
const path = require('path');

// ========== 配置项 ==========
const CONFIG = {
  // 缓存前缀（避免 key 冲突）
  PREFIX: 'clearspring_cache_',
  
  // 内存缓存最大条目数
  MAX_MEMORY_ITEMS: 1000,
  
  // 默认缓存时间（毫秒）
  DEFAULT_EXPIRE: 300000, // 5 分钟
  
  // 自动清理间隔（毫秒）
  CLEANUP_INTERVAL: 60000, // 1 分钟
  
  // 是否启用文件存储
  ENABLE_STORAGE: true,
  
  // 存储路径
  STORAGE_PATH: path.join(__dirname, '../.cache'),
  
  // 是否启用调试日志
  DEBUG: false
};

// ========== 内存缓存 ==========
const memoryCache = new Map();

// ========== 缓存统计 ==========
const stats = {
  hits: 0,      // 命中次数
  misses: 0,    // 未命中次数
  sets: 0,      // 设置次数
  deletes: 0,   // 删除次数
  cleanups: 0   // 清理次数
};

// ========== 清理定时器 ==========
let cleanupTimer = null;

/**
 * 初始化缓存系统
 * 启动自动清理定时器，恢复本地存储缓存
 */
function init() {
  if (CONFIG.DEBUG) {
    // [CLEANED] console.log('[Cache] 初始化缓存系统');
  }
  
  // 创建存储目录
  if (CONFIG.ENABLE_STORAGE) {
    try {
      if (!fs.existsSync(CONFIG.STORAGE_PATH)) {
        fs.mkdirSync(CONFIG.STORAGE_PATH, { recursive: true });
      }
      restoreFromStorage();
    } catch (error) {
      console.error('[Cache] 初始化存储失败:', error);
    }
  }
  
  // 启动自动清理定时器
  startCleanupTimer();
}

/**
 * 启动自动清理定时器
 */
function startCleanupTimer() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
  }
  
  cleanupTimer = setInterval(() => {
    cleanup();
  }, CONFIG.CLEANUP_INTERVAL);
}

/**
 * 生成缓存 key
 * @param {string} key - 原始 key
 * @returns {string} 带前缀的 key
 */
function makeKey(key) {
  return `${CONFIG.PREFIX}${key}`;
}

/**
 * 移除缓存 key 前缀
 * @param {string} key - 带前缀的 key
 * @returns {string} 原始 key
 */
function removeKeyPrefix(key) {
  return key.replace(CONFIG.PREFIX, '');
}

/**
 * 获取文件存储路径
 * @param {string} key - 缓存键
 * @returns {string} 文件路径
 */
function getStoragePath(key) {
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(CONFIG.STORAGE_PATH, `${safeKey}.json`);
}

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {*} value - 缓存值（会被 JSON 序列化）
 * @param {number} expireMilliseconds - 过期时间（毫秒），默认 300000
 * @returns {boolean} 是否设置成功
 */
function set(key, value, expireMilliseconds = CONFIG.DEFAULT_EXPIRE) {
  try {
    const fullKey = makeKey(key);
    const now = Date.now();
    const expireTime = expireMilliseconds > 0 ? now + expireMilliseconds : null;
    
    const cacheItem = {
      value: value,
      expire: expireTime,
      createTime: now,
      accessTime: now
    };
    
    // 写入内存缓存
    memoryCache.set(fullKey, cacheItem);
    
    // 检查内存缓存大小，超出则清理最久未使用的
    if (memoryCache.size > CONFIG.MAX_MEMORY_ITEMS) {
      evictOldest();
    }
    
    // 写入文件存储
    if (CONFIG.ENABLE_STORAGE) {
      saveToStorage(fullKey, cacheItem);
    }
    
    // 更新统计
    stats.sets++;
    
    if (CONFIG.DEBUG) {
      // [CLEANED] console.log(`[Cache] SET: ${key}, expire: ${expireMilliseconds}ms`);
    }
    
    return true;
  } catch (error) {
    console.error('[Cache] SET 失败:', error);
    return false;
  }
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @param {number} expireMilliseconds - 过期时间（毫秒），用于验证
 * @returns {*} 缓存值，不存在或已过期返回 null
 */
function get(key, expireMilliseconds) {
  try {
    const fullKey = makeKey(key);
    const cacheItem = memoryCache.get(fullKey);
    
    // 内存缓存未命中，尝试从文件存储加载
    if (!cacheItem && CONFIG.ENABLE_STORAGE) {
      const stored = loadFromStorage(fullKey);
      if (stored) {
        memoryCache.set(fullKey, stored);
        return getCachedValue(key, stored, expireMilliseconds);
      }
    }
    
    return getCachedValue(key, cacheItem, expireMilliseconds);
  } catch (error) {
    console.error('[Cache] GET 失败:', error);
    return null;
  }
}

/**
 * 获取缓存值的内部方法
 * @param {string} key - 原始 key
 * @param {Object} cacheItem - 缓存项
 * @param {number} expireMilliseconds - 过期时间
 * @returns {*} 缓存值或 null
 */
function getCachedValue(key, cacheItem, expireMilliseconds) {
  if (!cacheItem) {
    stats.misses++;
    if (CONFIG.DEBUG) {
      // [CLEANED] console.log(`[Cache] MISS: ${key}`);
    }
    return null;
  }
  
  const now = Date.now();
  
  // 检查是否过期
  if (cacheItem.expire && now > cacheItem.expire) {
    remove(key);
    stats.misses++;
    if (CONFIG.DEBUG) {
      // [CLEANED] console.log(`[Cache] EXPIRED: ${key}`);
    }
    return null;
  }
  
  // 如果传入了 expireMilliseconds，验证是否匹配
  if (expireMilliseconds !== undefined && cacheItem.expire) {
    const remaining = cacheItem.expire - now;
    if (remaining <= 0) {
      remove(key);
      stats.misses++;
      return null;
    }
  }
  
  // 更新访问时间
  cacheItem.accessTime = now;
  memoryCache.set(makeKey(key), cacheItem);
  
  stats.hits++;
  
  if (CONFIG.DEBUG) {
    // [CLEANED] console.log(`[Cache] HIT: ${key}`);
  }
  
  return cacheItem.value;
}

/**
 * 检查缓存是否存在且未过期
 * @param {string} key - 缓存键
 * @returns {boolean} 是否存在
 */
function has(key) {
  const fullKey = makeKey(key);
  const cacheItem = memoryCache.get(fullKey);
  
  if (!cacheItem) {
    return false;
  }
  
  if (cacheItem.expire && Date.now() > cacheItem.expire) {
    remove(key);
    return false;
  }
  
  return true;
}

/**
 * 删除缓存
 * @param {string} key - 缓存键
 * @returns {boolean} 是否删除成功
 */
function remove(key) {
  try {
    const fullKey = makeKey(key);
    
    // 从内存缓存删除
    const deleted = memoryCache.delete(fullKey);
    
    // 从文件存储删除
    if (CONFIG.ENABLE_STORAGE) {
      try {
        const storagePath = getStoragePath(fullKey);
        if (fs.existsSync(storagePath)) {
          fs.unlinkSync(storagePath);
        }
      } catch (e) {
        // 忽略存储删除失败
      }
    }
    
    if (deleted) {
      stats.deletes++;
      if (CONFIG.DEBUG) {
        // [CLEANED] console.log(`[Cache] REMOVE: ${key}`);
      }
    }
    
    return deleted;
  } catch (error) {
    console.error('[Cache] REMOVE 失败:', error);
    return false;
  }
}

/**
 * 清空所有缓存
 * @returns {boolean} 是否清空成功
 */
function clear() {
  try {
    // 清空内存缓存
    memoryCache.clear();
    
    // 清空文件存储
    if (CONFIG.ENABLE_STORAGE) {
      try {
        if (fs.existsSync(CONFIG.STORAGE_PATH)) {
          const files = fs.readdirSync(CONFIG.STORAGE_PATH);
          files.forEach(file => {
            if (file.startsWith(CONFIG.PREFIX.replace(/[^a-zA-Z0-9_-]/g, '_'))) {
              fs.unlinkSync(path.join(CONFIG.STORAGE_PATH, file));
            }
          });
        }
      } catch (e) {
        // 忽略存储清空失败
      }
    }
    
    // 重置统计
    resetStats();
    
    if (CONFIG.DEBUG) {
      // [CLEANED] console.log('[Cache] CLEAR ALL');
    }
    
    return true;
  } catch (error) {
    console.error('[Cache] CLEAR 失败:', error);
    return false;
  }
}

/**
 * 批量设置缓存
 * @param {Array} items - 缓存项数组 [{key, value, expire}]
 * @returns {number} 成功设置的数量
 */
function setBatch(items) {
  let successCount = 0;
  
  items.forEach(item => {
    if (set(item.key, item.value, item.expire)) {
      successCount++;
    }
  });
  
  return successCount;
}

/**
 * 批量获取缓存
 * @param {Array} keys - 缓存键数组
 * @returns {Object} 缓存值对象 {key: value}
 */
function getBatch(keys) {
  const result = {};
  
  keys.forEach(key => {
    result[key] = get(key);
  });
  
  return result;
}

/**
 * 批量删除缓存
 * @param {Array} keys - 缓存键数组
 * @returns {number} 成功删除的数量
 */
function removeBatch(keys) {
  let successCount = 0;
  
  keys.forEach(key => {
    if (remove(key)) {
      successCount++;
    }
  });
  
  return successCount;
}

/**
 * 清理过期缓存
 * @returns {number} 清理的数量
 */
function cleanup() {
  try {
    const now = Date.now();
    let count = 0;
    
    // 清理内存缓存
    memoryCache.forEach((cacheItem, key) => {
      if (cacheItem.expire && now > cacheItem.expire) {
        memoryCache.delete(key);
        count++;
      }
    });
    
    // 清理文件存储
    if (CONFIG.ENABLE_STORAGE) {
      try {
        const files = fs.readdirSync(CONFIG.STORAGE_PATH);
        files.forEach(file => {
          const filePath = path.join(CONFIG.STORAGE_PATH, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const item = JSON.parse(content);
            if (item && item.expire && now > item.expire) {
              fs.unlinkSync(filePath);
              count++;
            }
          } catch (e) {
            // 忽略单个缓存读取失败
          }
        });
      } catch (e) {
        // 忽略目录读取失败
      }
    }
    
    if (count > 0) {
      stats.cleanups += count;
      if (CONFIG.DEBUG) {
        // [CLEANED] console.log(`[Cache] CLEANUP: ${count} items`);
      }
    }
    
    return count;
  } catch (error) {
    console.error('[Cache] CLEANUP 失败:', error);
    return 0;
  }
}

/**
 * 获取缓存统计信息
 * @returns {Object} 统计信息
 */
function getStats() {
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : 0;
  
  let storageSize = 0;
  if (CONFIG.ENABLE_STORAGE) {
    try {
      const files = fs.readdirSync(CONFIG.STORAGE_PATH);
      files.forEach(file => {
        const stat = fs.statSync(path.join(CONFIG.STORAGE_PATH, file));
        storageSize += stat.size;
      });
    } catch (e) {
      // 忽略统计失败
    }
  }
  
  return {
    hits: stats.hits,
    misses: stats.misses,
    hitRate: hitRate + '%',
    sets: stats.sets,
    deletes: stats.deletes,
    cleanups: stats.cleanups,
    memorySize: memoryCache.size,
    maxMemorySize: CONFIG.MAX_MEMORY_ITEMS,
    storageSize: `${(storageSize / 1024).toFixed(2)} KB`
  };
}

/**
 * 重置统计信息
 */
function resetStats() {
  stats.hits = 0;
  stats.misses = 0;
  stats.sets = 0;
  stats.deletes = 0;
  stats.cleanups = 0;
}

/**
 * 逐出最久未使用的缓存项
 */
function evictOldest() {
  let oldestKey = null;
  let oldestTime = Infinity;
  
  memoryCache.forEach((cacheItem, key) => {
    if (cacheItem.accessTime < oldestTime) {
      oldestTime = cacheItem.accessTime;
      oldestKey = key;
    }
  });
  
  if (oldestKey) {
    memoryCache.delete(oldestKey);
    if (CONFIG.DEBUG) {
      // [CLEANED] console.log(`[Cache] EVICT: ${removeKeyPrefix(oldestKey)}`);
    }
  }
}

/**
 * 保存缓存到文件存储
 * @param {string} key - 缓存键
 * @param {Object} cacheItem - 缓存项
 */
function saveToStorage(key, cacheItem) {
  try {
    const storagePath = getStoragePath(key);
    fs.writeFileSync(storagePath, JSON.stringify(cacheItem), 'utf8');
  } catch (error) {
    // 存储空间不足时，清理部分缓存
    if (error.code === 'ENOSPC') {
      cleanup();
      // 重试一次
      try {
        const storagePath = getStoragePath(key);
        fs.writeFileSync(storagePath, JSON.stringify(cacheItem), 'utf8');
      } catch (e) {
        console.warn('[Cache] 存储空间不足，跳过文件存储');
      }
    }
  }
}

/**
 * 从文件存储加载缓存
 * @param {string} key - 缓存键
 * @returns {Object|null} 缓存项
 */
function loadFromStorage(key) {
  try {
    const storagePath = getStoragePath(key);
    if (fs.existsSync(storagePath)) {
      const content = fs.readFileSync(storagePath, 'utf8');
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 恢复文件存储缓存到内存
 */
function restoreFromStorage() {
  try {
    if (!fs.existsSync(CONFIG.STORAGE_PATH)) {
      return;
    }
    
    const files = fs.readdirSync(CONFIG.STORAGE_PATH);
    const now = Date.now();
    let count = 0;
    
    files.forEach(file => {
      const filePath = path.join(CONFIG.STORAGE_PATH, file);
      if (memoryCache.size < CONFIG.MAX_MEMORY_ITEMS) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const item = JSON.parse(content);
          if (item && (!item.expire || now < item.expire)) {
            memoryCache.set(file, item);
            count++;
          }
        } catch (e) {
          // 忽略单个缓存加载失败
        }
      }
    });
    
    if (CONFIG.DEBUG) {
      // [CLEANED] console.log(`[Cache] 从存储恢复 ${count} 项缓存`);
    }
  } catch (error) {
    console.error('[Cache] 恢复存储失败:', error);
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
      return;
    }
    
    // 调用加载器获取数据
    try {
      const data = await item.loader();
      if (data !== null && data !== undefined) {
        set(item.key, data, item.expire);
      }
    } catch (error) {
      console.error(`[Cache] 预加载失败 ${item.key}:`, error);
    }
  });
  
  await Promise.all(promises);
  
  if (CONFIG.DEBUG) {
    // [CLEANED] console.log('[Cache] 预加载完成');
  }
}

/**
 * 带缓存的异步操作（适用于数据库查询、API 调用等）
 * @param {string} key - 缓存键
 * @param {Function} loader - 数据加载函数（异步）
 * @param {number} expireMilliseconds - 过期时间（毫秒）
 * @returns {Promise<any>} 数据结果
 */
async function cachedAsync(key, loader, expireMilliseconds = CONFIG.DEFAULT_EXPIRE) {
  // 尝试从缓存获取
  const cached = get(key);
  if (cached !== null) {
    // [CLEANED] console.log(`[Cache] 命中缓存：${key}`);
    return cached;
  }
  
  // 缓存未命中，执行加载器
  // [CLEANED] console.log(`[Cache] 未命中，执行加载：${key}`);
  const data = await loader();
  
  // 保存到缓存
  set(key, data, { expire: expireMilliseconds });
  
  return data;
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
  cachedAsync,
  
  // 统计信息
  getStats,
  resetStats,
  
  // 配置（只读）
  config: CONFIG
};
