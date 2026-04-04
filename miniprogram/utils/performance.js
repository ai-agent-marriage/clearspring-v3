/**
 * 性能优化工具类
 * 
 * 提供页面加载优化、数据请求优化、渲染优化、图片优化等功能
 * 
 * @author AI Agent
 * @version 1.0.0
 * @date 2026-04-04
 */

// ==================== 缓存管理 ====================

/**
 * 数据缓存管理器
 * 支持内存缓存和本地存储缓存
 */
class CacheManager {
  constructor(options = {}) {
    this.memoryCache = new Map();
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 默认 5 分钟
    this.storagePrefix = options.storagePrefix || 'cache_';
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键
   * @param {number} ttl - 可选的自定义过期时间 (ms)
   * @returns {any|null} 缓存的数据，过期或不存在返回 null
   */
  get(key, ttl = this.defaultTTL) {
    // 先检查内存缓存
    const memCache = this.memoryCache.get(key);
    if (memCache) {
      const { data, timestamp } = memCache;
      if (Date.now() - timestamp < ttl) {
        return data;
      }
      this.memoryCache.delete(key);
    }

    // 再检查本地存储
    try {
      const storageKey = this.storagePrefix + key;
      const storageData = wx.getStorageSync(storageKey);
      if (storageData) {
        const { data, timestamp } = JSON.parse(storageData);
        if (Date.now() - timestamp < ttl) {
          // 回写到内存缓存
          this.memoryCache.set(key, { data, timestamp });
          return data;
        }
        // 过期数据，清理
        wx.removeStorageSync(storageKey);
      }
    } catch (error) {
      console.error('Cache get error:', error);
    }

    return null;
  }

  /**
   * 设置缓存数据
   * @param {string} key - 缓存键
   * @param {any} data - 缓存数据
   * @param {number} ttl - 可选的自定义过期时间 (ms)
   * @param {boolean} persist - 是否持久化到本地存储
   */
  set(key, data, ttl = this.defaultTTL, persist = true) {
    const timestamp = Date.now();
    const cacheData = { data, timestamp };

    // 内存缓存
    this.memoryCache.set(key, cacheData);

    // 本地存储
    if (persist) {
      try {
        const storageKey = this.storagePrefix + key;
        wx.setStorageSync(storageKey, JSON.stringify(cacheData));
      } catch (error) {
        console.error('Cache set error:', error);
      }
    }
  }

  /**
   * 删除缓存
   * @param {string} key - 缓存键
   */
  delete(key) {
    this.memoryCache.delete(key);
    try {
      wx.removeStorageSync(this.storagePrefix + key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.memoryCache.clear();
    try {
      const keys = wx.getStorageInfoSync().keys;
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          wx.removeStorageSync(key);
        }
      });
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * 获取缓存统计信息
   * @returns {object} 缓存统计
   */
  getStats() {
    try {
      const info = wx.getStorageInfoSync();
      const cacheKeys = info.keys.filter(k => k.startsWith(this.storagePrefix));
      return {
        memoryCount: this.memoryCache.size,
        storageCount: cacheKeys.length,
        storageSize: info.currentSize,
        storageLimit: info.limitSize
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { memoryCount: 0, storageCount: 0, storageSize: 0, storageLimit: 0 };
    }
  }
}

// ==================== 请求优化 ====================

/**
 * 请求管理器
 * 支持请求去重、合并、缓存等功能
 */
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
    this.cache = new CacheManager({ storagePrefix: 'req_' });
  }

  /**
   * 发起请求（带缓存和去重）
   * @param {string} key - 请求唯一标识
   * @param {Function} requestFn - 请求函数
   * @param {number} cacheTime - 缓存时间 (ms)
   * @returns {Promise<any>} 请求结果
   */
  async request(key, requestFn, cacheTime = 5 * 60 * 1000) {
    // 检查缓存
    const cached = this.cache.get(key, cacheTime);
    if (cached) {
      console.log('[Request] Cache hit:', key);
      return cached;
    }

    // 检查是否有相同请求正在进行
    if (this.pendingRequests.has(key)) {
      console.log('[Request] Merge duplicate:', key);
      return this.pendingRequests.get(key);
    }

    // 发起新请求
    const promise = requestFn()
      .then(result => {
        this.cache.set(key, result, cacheTime);
        return result;
      })
      .catch(error => {
        console.error('[Request] Error:', key, error);
        throw error;
      })
      .finally(() => {
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * 批量请求（合并多个请求）
   * @param {Array} requests - 请求配置数组 [{key, fn, cacheTime}]
   * @returns {Promise<Array>} 所有请求结果
   */
  async batchRequest(requests) {
    const promises = requests.map(req => 
      this.request(req.key, req.fn, req.cacheTime)
    );
    return Promise.all(promises);
  }

  /**
   * 取消 pending 的请求
   * @param {string} key - 请求标识
   */
  cancel(key) {
    if (this.pendingRequests.has(key)) {
      this.pendingRequests.delete(key);
    }
  }

  /**
   * 取消所有 pending 请求
   */
  cancelAll() {
    this.pendingRequests.clear();
  }
}

// ==================== 渲染优化 ====================

/**
 * 渲染优化器
 * 提供 setData 节流、批量更新等功能
 */
class RenderOptimizer {
  constructor(pageContext) {
    this.page = pageContext;
    this.updateQueue = new Map();
    this.isThrottling = false;
    this.throttleDelay = 100; // 默认 100ms 节流
  }

  /**
   * 批量 setData（合并多次更新）
   * @param {object} data - 要更新的数据
   * @param {boolean} immediate - 是否立即更新
   */
  update(data, immediate = false) {
    // 合并到更新队列
    Object.keys(data).forEach(key => {
      this.updateQueue.set(key, data[key]);
    });

    if (immediate) {
      this.flush();
    } else if (!this.isThrottling) {
      this.isThrottling = true;
      setTimeout(() => this.flush(), this.throttleDelay);
    }
  }

  /**
   * 执行批量更新
   */
  flush() {
    if (this.updateQueue.size === 0) {
      this.isThrottling = false;
      return;
    }

    const data = {};
    this.updateQueue.forEach((value, key) => {
      data[key] = value;
    });

    if (this.page && typeof this.page.setData === 'function') {
      this.page.setData(data);
    }

    this.updateQueue.clear();
    this.isThrottling = false;
  }

  /**
   * 设置节流延迟
   * @param {number} delay - 延迟时间 (ms)
   */
  setThrottleDelay(delay) {
    this.throttleDelay = delay;
  }

  /**
   * 清空更新队列
   */
  clear() {
    this.updateQueue.clear();
    this.isThrottling = false;
  }
}

// ==================== 图片优化 ====================

/**
 * 图片优化器
 * 提供图片懒加载、预加载、压缩等功能
 */
class ImageOptimizer {
  constructor() {
    this.loadedImages = new Set();
    this.preloadQueue = [];
    this.isPreloading = false;
  }

  /**
   * 图片懒加载（监听滚动）
   * @param {Array} imageSelectors - 图片选择器数组
   * @param {Function} callback - 加载完成回调
   */
  lazyLoad(imageSelectors, callback) {
    const observer = wx.createIntersectionObserver({
      thresholds: [0],
      initialRatio: 0,
      observeAll: true
    });

    imageSelectors.forEach(selector => {
      observer.relativeToViewport({ bottom: 300 }).observe(selector, (res) => {
        if (res.intersectionRatio > 0) {
          const index = res.dataset.index;
          if (!this.loadedImages.has(index)) {
            this.loadedImages.add(index);
            callback && callback(index);
          }
          observer.unobserve(selector);
        }
      });
    });

    return observer;
  }

  /**
   * 图片预加载
   * @param {Array} imageUrls - 图片 URL 数组
   * @returns {Promise<Array>} 预加载结果
   */
  async preload(imageUrls) {
    const promises = imageUrls.map(url => {
      return new Promise((resolve) => {
        wx.getImageInfo({
          src: url,
          success: (res) => resolve({ url, success: true, info: res }),
          fail: (err) => resolve({ url, success: false, error: err })
        });
      });
    });

    return Promise.all(promises);
  }

  /**
   * 批量预加载（带队列管理）
   * @param {Array} imageUrls - 图片 URL 数组
   * @param {number} concurrency - 并发数
   */
  async batchPreload(imageUrls, concurrency = 3) {
    this.preloadQueue.push(...imageUrls);

    if (this.isPreloading) {
      return;
    }

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, concurrency);
      await this.preload(batch);
    }

    this.isPreloading = false;
  }

  /**
   * 清除已加载图片记录
   */
  clearLoaded() {
    this.loadedImages.clear();
  }

  /**
   * 获取图片信息（用于计算宽高比）
   * @param {string} imageUrl - 图片 URL
   * @returns {Promise<object>} 图片信息
   */
  async getImageInfo(imageUrl) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: imageUrl,
        success: resolve,
        fail: reject
      });
    });
  }

  /**
   * 压缩图片（使用 Canvas）
   * @param {string} imageUrl - 原图 URL
   * @param {number} quality - 压缩质量 (0-1)
   * @param {number} maxWidth - 最大宽度
   * @returns {Promise<string>} 压缩后的临时文件路径
   */
  async compress(imageUrl, quality = 0.8, maxWidth = 800) {
    try {
      const imageInfo = await this.getImageInfo(imageUrl);
      const scale = maxWidth / imageInfo.width;
      const width = maxWidth;
      const height = imageInfo.height * scale;

      const canvas = wx.createCanvasContext('compressCanvas');
      canvas.drawImage(imageUrl, 0, 0, width, height);
      
      return new Promise((resolve, reject) => {
        canvas.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'compressCanvas',
            quality: quality,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        });
      });
    } catch (error) {
      console.error('Image compress error:', error);
      throw error;
    }
  }
}

// ==================== 性能监控 ====================

/**
 * 性能监控器
 * 监控页面加载时间、setData 耗时等
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.reports = [];
  }

  /**
   * 开始计时
   * @param {string} name - 计时器名称
   */
  start(name) {
    this.metrics.set(name, {
      start: Date.now(),
      count: 0
    });
  }

  /**
   * 结束计时
   * @param {string} name - 计时器名称
   * @returns {number} 耗时 (ms)
   */
  end(name) {
    const metric = this.metrics.get(name);
    if (!metric) return 0;

    const duration = Date.now() - metric.start;
    metric.count++;
    metric.lastDuration = duration;
    metric.totalDuration = (metric.totalDuration || 0) + duration;

    // 记录报告
    this.reports.push({
      name,
      duration,
      timestamp: Date.now(),
      count: metric.count
    });

    // 控制台输出
    console.log(`[Performance] ${name}: ${duration}ms (avg: ${this.getAverage(name)}ms)`);

    return duration;
  }

  /**
   * 获取平均耗时
   * @param {string} name - 计时器名称
   * @returns {number} 平均耗时
   */
  getAverage(name) {
    const metric = this.metrics.get(name);
    if (!metric || !metric.count) return 0;
    return Math.round(metric.totalDuration / metric.count);
  }

  /**
   * 获取所有报告
   * @returns {Array} 性能报告
   */
  getReports() {
    return this.reports;
  }

  /**
   * 清除报告
   */
  clear() {
    this.metrics.clear();
    this.reports = [];
  }

  /**
   * 监控 setData 性能
   * @param {object} page - 页面对象
   * @param {string} pageName - 页面名称
   */
  monitorSetData(page, pageName) {
    const originalSetData = page.setData;
    const self = this;

    page.setData = function(data) {
      const key = `${pageName}_setData`;
      self.start(key);
      
      const result = originalSetData.call(this, data);
      
      const duration = self.end(key);
      
      // 警告：setData 超过 100ms
      if (duration > 100) {
        console.warn(`[Performance] ${pageName} setData slow: ${duration}ms`, data);
      }
      
      return result;
    };
  }
}

// ==================== 虚拟列表 ====================

/**
 * 虚拟列表渲染器
 * 用于长列表性能优化
 */
class VirtualList {
  constructor(options) {
    this.itemHeight = options.itemHeight || 80; // 单项高度
    this.screenHeight = options.screenHeight || 600; // 屏幕高度
    this.bufferSize = options.bufferSize || 5; // 缓冲数量
    this.totalCount = options.totalCount || 0; // 总数据量
    this.scrollTop = 0; // 滚动位置
  }

  /**
   * 计算可见区域
   * @returns {object} 可见区域信息
   */
  getVisibleRange() {
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
    const visibleCount = Math.ceil(this.screenHeight / this.itemHeight);
    const endIndex = Math.min(this.totalCount - 1, startIndex + visibleCount + this.bufferSize * 2);

    return {
      startIndex,
      endIndex,
      visibleCount,
      totalHeight: this.totalCount * this.itemHeight,
      offsetTop: startIndex * this.itemHeight
    };
  }

  /**
   * 处理滚动事件
   * @param {number} scrollTop - 滚动位置
   * @returns {object} 可见区域信息
   */
  onScroll(scrollTop) {
    this.scrollTop = scrollTop;
    return this.getVisibleRange();
  }

  /**
   * 更新配置
   * @param {object} options - 新配置
   */
  updateConfig(options) {
    Object.assign(this, options);
  }
}

// ==================== 导出单例 ====================

// 创建单例实例
const cacheManager = new CacheManager();
const requestManager = new RequestManager();
const performanceMonitor = new PerformanceMonitor();

module.exports = {
  // 类导出
  CacheManager,
  RequestManager,
  RenderOptimizer,
  ImageOptimizer,
  PerformanceMonitor,
  VirtualList,
  
  // 单例导出
  cacheManager,
  requestManager,
  performanceMonitor,
  
  /**
   * 初始化性能优化（在 App.onLaunch 中调用）
   */
  init() {
    console.log('[Performance] 性能优化模块已初始化');
    
    // 监控内存使用
    if (wx.onMemoryWarning) {
      wx.onMemoryWarning(() => {
        console.warn('[Performance] 内存警告，清理缓存');
        cacheManager.clear();
        requestManager.cancelAll();
      });
    }
  },

  /**
   * 页面性能优化（在 Page onLoad 中调用）
   * @param {object} page - 页面对象
   * @param {string} pageName - 页面名称
   */
  optimizePage(page, pageName) {
    performanceMonitor.monitorSetData(page, pageName);
    page.$performance = {
      cache: cacheManager,
      request: requestManager,
      monitor: performanceMonitor
    };
  }
};
