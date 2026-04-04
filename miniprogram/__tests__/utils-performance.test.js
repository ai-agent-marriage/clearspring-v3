/**
 * utils/performance.js 单元测试
 * 测试性能优化工具类的各项功能
 */
/* eslint-disable no-unused-vars */

const perfUtils = require('../utils/performance.js');
const {
  CacheManager,
  RequestManager,
  RenderOptimizer,
  ImageOptimizer,
  PerformanceMonitor,
  VirtualList,
  cacheManager,
  requestManager,
  performanceMonitor
} = require('../utils/performance.js');

// 模拟 wx 的存储 API
const mockStorage = new Map();

beforeEach(() => {
  jest.clearAllMocks();
  mockStorage.clear();
  
  // 重置 wx storage mock
  wx.getStorageSync.mockImplementation((key) => {
    return mockStorage.get(key) || null;
  });
  
  wx.setStorageSync.mockImplementation((key, value) => {
    mockStorage.set(key, value);
  });
  
  wx.removeStorageSync.mockImplementation((key) => {
    mockStorage.delete(key);
  });
  
  wx.getStorageInfoSync.mockReturnValue({
    keys: Array.from(mockStorage.keys()),
    currentSize: mockStorage.size * 100,
    limitSize: 10000
  });
});

describe('CacheManager - 缓存管理', () => {
  describe('初始化', () => {
    test('创建 CacheManager 实例', () => {
      const cm = new CacheManager();
      expect(cm).toBeDefined();
      expect(cm.memoryCache).toBeDefined();
    });

    test('使用默认配置初始化', () => {
      const cm = new CacheManager();
      expect(cm.defaultTTL).toBe(5 * 60 * 1000);
      expect(cm.storagePrefix).toBe('cache_');
    });

    test('使用自定义配置初始化', () => {
      const cm = new CacheManager({
        defaultTTL: 10000,
        storagePrefix: 'my_prefix_'
      });
      expect(cm.defaultTTL).toBe(10000);
      expect(cm.storagePrefix).toBe('my_prefix_');
    });
  });

  describe('get 方法 - 获取缓存', () => {
    test('从内存缓存获取未过期数据', () => {
      const cm = new CacheManager();
      cm.set('test_key', 'test_value', 60000);
      
      const result = cm.get('test_key');
      expect(result).toBe('test_value');
    });

    test('从本地存储获取未过期数据', () => {
      const cm = new CacheManager();
      cm.set('test_key', 'test_value', 60000, true);
      
      // 清除内存缓存，强制从本地存储读取
      cm.memoryCache.clear();
      
      const result = cm.get('test_key');
      expect(result).toBe('test_value');
    });

    test('获取过期缓存返回 null', () => {
      const cm = new CacheManager();
      cm.set('test_key', 'test_value', 1); // 1ms 过期
      
      // 等待过期
      setTimeout(() => {
        const result = cm.get('test_key');
        expect(result).toBe(null);
      }, 10);
    });

    test('获取不存在的缓存返回 null', () => {
      const cm = new CacheManager();
      const result = cm.get('non_existent_key');
      expect(result).toBe(null);
    });

    test('获取过期缓存后清理本地存储', () => {
      const cm = new CacheManager();
      cm.set('test_key', 'test_value', 1);
      
      setTimeout(() => {
        cm.get('test_key');
        expect(mockStorage.has('cache_test_key')).toBe(false);
      }, 10);
    });
  });

  describe('set 方法 - 设置缓存', () => {
    test('设置缓存到内存', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1');
      
      expect(cm.memoryCache.has('key1')).toBe(true);
    });

    test('设置缓存到本地存储', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1', 60000, true);
      
      expect(mockStorage.has('cache_key1')).toBe(true);
    });

    test('设置缓存时不持久化到本地存储', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1', 60000, false);
      
      expect(mockStorage.has('cache_key1')).toBe(false);
      expect(cm.memoryCache.has('key1')).toBe(true);
    });

    test('设置缓存记录时间戳', () => {
      const cm = new CacheManager();
      const before = Date.now();
      cm.set('key1', 'value1');
      const after = Date.now();
      
      const cached = cm.memoryCache.get('key1');
      expect(cached.timestamp).toBeGreaterThanOrEqual(before);
      expect(cached.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('delete 方法 - 删除缓存', () => {
    test('从内存缓存删除', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1');
      cm.delete('key1');
      
      expect(cm.memoryCache.has('key1')).toBe(false);
    });

    test('从本地存储删除', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1', 60000, true);
      cm.delete('key1');
      
      expect(mockStorage.has('cache_key1')).toBe(false);
    });
  });

  describe('clear 方法 - 清空缓存', () => {
    test('清空内存缓存', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1');
      cm.set('key2', 'value2');
      cm.clear();
      
      expect(cm.memoryCache.size).toBe(0);
    });

    test('清空本地存储中带前缀的缓存', () => {
      const cm = new CacheManager({ storagePrefix: 'test_' });
      mockStorage.set('test_key1', 'value1');
      mockStorage.set('test_key2', 'value2');
      mockStorage.set('other_key', 'other_value');
      
      cm.clear();
      
      expect(mockStorage.has('test_key1')).toBe(false);
      expect(mockStorage.has('test_key2')).toBe(false);
      expect(mockStorage.has('other_key')).toBe(true);
    });
  });

  describe('getStats 方法 - 获取统计信息', () => {
    test('返回缓存统计信息', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1');
      cm.set('key2', 'value2', 60000, true);
      
      const stats = cm.getStats();
      expect(stats).toHaveProperty('memoryCount');
      expect(stats).toHaveProperty('storageCount');
      expect(stats).toHaveProperty('storageSize');
      expect(stats).toHaveProperty('storageLimit');
    });

    test('memoryCount 反映内存缓存数量', () => {
      const cm = new CacheManager();
      cm.set('key1', 'value1');
      cm.set('key2', 'value2');
      
      const stats = cm.getStats();
      expect(stats.memoryCount).toBe(2);
    });
  });
});

describe('RequestManager - 请求优化', () => {
  describe('request 方法 - 发起请求', () => {
    test('从缓存返回结果', async () => {
      const rm = new RequestManager();
      const mockResult = { data: 'test' };
      
      // 先设置缓存
      rm.cache.set('test_key', mockResult, 60000);
      
      const result = await rm.request('test_key', jest.fn());
      expect(result).toBe(mockResult);
    });

    test('发起新请求并缓存结果', async () => {
      const rm = new RequestManager();
      const mockResult = { data: 'test' };
      const requestFn = jest.fn().mockResolvedValue(mockResult);
      
      const result = await rm.request('new_key', requestFn, 60000);
      
      expect(requestFn).toHaveBeenCalled();
      expect(result).toBe(mockResult);
      
      // 验证缓存
      const cached = rm.cache.get('new_key');
      expect(cached).toBe(mockResult);
    });

    test('合并重复请求', async () => {
      const rm = new RequestManager();
      const mockResult = { data: 'test' };
      const requestFn = jest.fn().mockResolvedValue(mockResult);
      
      // 同时发起两个相同请求
      const [result1, result2] = await Promise.all([
        rm.request('same_key', requestFn),
        rm.request('same_key', requestFn)
      ]);
      
      // 只应该调用一次 requestFn
      expect(requestFn).toHaveBeenCalledTimes(1);
      expect(result1).toBe(mockResult);
      expect(result2).toBe(mockResult);
    });

    test('请求失败后清除 pending 状态', async () => {
      const rm = new RequestManager();
      const requestFn = jest.fn().mockRejectedValue(new Error('Network error'));
      
      try {
        await rm.request('fail_key', requestFn);
      } catch (e) {
        // 预期错误
      }
      
      expect(rm.pendingRequests.has('fail_key')).toBe(false);
    });
  });

  describe('batchRequest 方法 - 批量请求', () => {
    test('批量发起多个请求', async () => {
      const rm = new RequestManager();
      const requests = [
        { key: 'key1', fn: jest.fn().mockResolvedValue('result1') },
        { key: 'key2', fn: jest.fn().mockResolvedValue('result2') },
        { key: 'key3', fn: jest.fn().mockResolvedValue('result3') }
      ];
      
      const results = await rm.batchRequest(requests);
      
      expect(results).toEqual(['result1', 'result2', 'result3']);
    });
  });

  describe('cancel 方法 - 取消请求', () => {
    test('取消 pending 的请求', () => {
      const rm = new RequestManager();
      const pendingPromise = new Promise(() => {}); // 永不 resolve
      rm.pendingRequests.set('to_cancel', pendingPromise);
      
      rm.cancel('to_cancel');
      
      expect(rm.pendingRequests.has('to_cancel')).toBe(false);
    });

    test('取消不存在的请求不报错', () => {
      const rm = new RequestManager();
      expect(() => rm.cancel('non_existent')).not.toThrow();
    });
  });

  describe('cancelAll 方法 - 取消所有请求', () => {
    test('清除所有 pending 请求', () => {
      const rm = new RequestManager();
      rm.pendingRequests.set('req1', Promise.resolve());
      rm.pendingRequests.set('req2', Promise.resolve());
      rm.pendingRequests.set('req3', Promise.resolve());
      
      rm.cancelAll();
      
      expect(rm.pendingRequests.size).toBe(0);
    });
  });
});

describe('RenderOptimizer - 渲染优化', () => {
  describe('初始化', () => {
    test('创建 RenderOptimizer 实例', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      expect(ro).toBeDefined();
      expect(ro.page).toBe(mockPage);
      expect(ro.throttleDelay).toBe(100);
    });
  });

  describe('update 方法 - 批量更新', () => {
    test('立即更新数据', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.update({ key1: 'value1' }, true);
      
      expect(mockPage.setData).toHaveBeenCalledWith({ key1: 'value1' });
    });

    test('节流更新数据', (done) => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.update({ key1: 'value1' });
      
      // 节流延迟后应该调用 setData
      setTimeout(() => {
        expect(mockPage.setData).toHaveBeenCalled();
        done();
      }, 150);
    });

    test('合并多次更新', (done) => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.update({ key1: 'value1' });
      ro.update({ key2: 'value2' });
      ro.update({ key3: 'value3' });
      
      setTimeout(() => {
        expect(mockPage.setData).toHaveBeenCalledTimes(1);
        expect(mockPage.setData).toHaveBeenCalledWith({
          key1: 'value1',
          key2: 'value2',
          key3: 'value3'
        });
        done();
      }, 150);
    });
  });

  describe('flush 方法 - 执行更新', () => {
    test('执行队列中的更新', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.update({ key1: 'value1' }, false);
      ro.update({ key2: 'value2' }, false);
      ro.flush();
      
      expect(mockPage.setData).toHaveBeenCalled();
    });

    test('空队列时不调用 setData', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.flush();
      
      expect(mockPage.setData).not.toHaveBeenCalled();
    });

    test('清空更新队列', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.update({ key1: 'value1' }, false);
      ro.flush();
      
      expect(ro.updateQueue.size).toBe(0);
    });
  });

  describe('setThrottleDelay 方法', () => {
    test('设置节流延迟', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.setThrottleDelay(200);
      
      expect(ro.throttleDelay).toBe(200);
    });
  });

  describe('clear 方法', () => {
    test('清空更新队列', () => {
      const mockPage = { setData: jest.fn() };
      const ro = new RenderOptimizer(mockPage);
      
      ro.update({ key1: 'value1' }, false);
      ro.clear();
      
      expect(ro.updateQueue.size).toBe(0);
      expect(ro.isThrottling).toBe(false);
    });
  });
});

describe('ImageOptimizer - 图片优化', () => {
  describe('preload 方法 - 预加载图片', () => {
    test('预加载单张图片', async () => {
      const io = new ImageOptimizer();
      wx.getImageInfo.mockImplementation(({ success }) => {
        success({ width: 100, height: 100 });
      });
      
      const results = await io.preload(['https://example.com/image.jpg']);
      
      expect(wx.getImageInfo).toHaveBeenCalled();
      expect(results[0].success).toBe(true);
    });

    test('预加载多张图片', async () => {
      const io = new ImageOptimizer();
      wx.getImageInfo.mockImplementation(({ success }) => {
        success({ width: 100, height: 100 });
      });
      
      const results = await io.preload([
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ]);
      
      expect(results).toHaveLength(2);
    });

    test('处理加载失败的图片', async () => {
      const io = new ImageOptimizer();
      wx.getImageInfo.mockImplementation(({ fail }) => {
        fail({ errMsg: 'Network error' });
      });
      
      const results = await io.preload(['https://example.com/broken.jpg']);
      
      expect(results[0].success).toBe(false);
      expect(results[0].error).toBeDefined();
    });
  });

  describe('lazyLoad 方法 - 懒加载', () => {
    test('创建交叉观察器', () => {
      const io = new ImageOptimizer();
      
      wx.createIntersectionObserver.mockReturnValue({
        relativeToViewport: jest.fn().mockReturnValue({
          observe: jest.fn()
        })
      });
      
      const observer = io.lazyLoad(['.image-1', '.image-2'], jest.fn());
      
      expect(wx.createIntersectionObserver).toHaveBeenCalled();
    });

    test('图片进入视口时触发回调', () => {
      const io = new ImageOptimizer();
      const callback = jest.fn();
      
      let observeCallback;
      wx.createIntersectionObserver.mockReturnValue({
        relativeToViewport: jest.fn().mockReturnValue({
          observe: jest.fn((selector, cb) => {
            observeCallback = cb;
          })
        })
      });
      
      io.lazyLoad(['.image-1'], callback);
      
      // 模拟进入视口
      observeCallback({ intersectionRatio: 1, dataset: { index: 0 } });
      
      expect(callback).toHaveBeenCalledWith(0);
    });
  });

  describe('batchPreload 方法 - 批量预加载', () => {
    test('按并发数批量预加载', async () => {
      const io = new ImageOptimizer();
      wx.getImageInfo.mockImplementation(({ success }) => {
        success({ width: 100, height: 100 });
      });
      
      const urls = [
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
        'https://example.com/3.jpg',
        'https://example.com/4.jpg'
      ];
      
      await io.batchPreload(urls, 2);
      
      expect(wx.getImageInfo).toHaveBeenCalledTimes(4);
    });
  });

  describe('getImageInfo 方法', () => {
    test('获取图片信息', async () => {
      const io = new ImageOptimizer();
      wx.getImageInfo.mockImplementation(({ success }) => {
        success({ width: 800, height: 600 });
      });
      
      const info = await io.getImageInfo('https://example.com/image.jpg');
      
      expect(info.width).toBe(800);
      expect(info.height).toBe(600);
    });
  });

  describe('clearLoaded 方法', () => {
    test('清除已加载图片记录', () => {
      const io = new ImageOptimizer();
      io.loadedImages.add(1);
      io.loadedImages.add(2);
      
      io.clearLoaded();
      
      expect(io.loadedImages.size).toBe(0);
    });
  });
});

describe('PerformanceMonitor - 性能监控', () => {
  describe('start/end 方法 - 计时', () => {
    test('开始计时', () => {
      const pm = new PerformanceMonitor();
      pm.start('test_timer');
      
      expect(pm.metrics.has('test_timer')).toBe(true);
    });

    test('结束计时返回耗时', () => {
      const pm = new PerformanceMonitor();
      pm.start('test_timer');
      
      // 等待一点时间
      const duration = pm.end('test_timer');
      
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    test('记录多次计时', () => {
      const pm = new PerformanceMonitor();
      pm.start('test_timer');
      pm.end('test_timer');
      pm.start('test_timer');
      pm.end('test_timer');
      
      const metric = pm.metrics.get('test_timer');
      expect(metric.count).toBe(2);
    });
  });

  describe('getAverage 方法 - 获取平均耗时', () => {
    test('计算平均耗时', () => {
      const pm = new PerformanceMonitor();
      pm.start('test_timer');
      pm.end('test_timer');
      pm.start('test_timer');
      pm.end('test_timer');
      
      const avg = pm.getAverage('test_timer');
      expect(avg).toBeGreaterThanOrEqual(0);
    });

    test('不存在的计时器返回 0', () => {
      const pm = new PerformanceMonitor();
      const avg = pm.getAverage('non_existent');
      expect(avg).toBe(0);
    });
  });

  describe('getReports 方法 - 获取报告', () => {
    test('返回性能报告', () => {
      const pm = new PerformanceMonitor();
      pm.start('test_timer');
      pm.end('test_timer');
      
      const reports = pm.getReports();
      
      expect(reports).toHaveLength(1);
      expect(reports[0]).toHaveProperty('name');
      expect(reports[0]).toHaveProperty('duration');
      expect(reports[0]).toHaveProperty('timestamp');
    });
  });

  describe('clear 方法', () => {
    test('清除所有指标和报告', () => {
      const pm = new PerformanceMonitor();
      pm.start('test_timer');
      pm.end('test_timer');
      pm.clear();
      
      expect(pm.metrics.size).toBe(0);
      expect(pm.reports).toHaveLength(0);
    });
  });

  describe('monitorSetData 方法', () => {
    test('监控页面 setData 性能', () => {
      const pm = new PerformanceMonitor();
      const mockPage = { setData: jest.fn() };
      
      pm.monitorSetData(mockPage, 'test_page');
      
      expect(mockPage.setData).toBeDefined();
      
      // 调用 setData 应该被监控
      mockPage.setData({ key: 'value' });
      
      const reports = pm.getReports();
      expect(reports.length).toBeGreaterThan(0);
    });
  });
});

describe('VirtualList - 虚拟列表', () => {
  describe('初始化', () => {
    test('创建 VirtualList 实例', () => {
      const vl = new VirtualList({
        itemHeight: 80,
        screenHeight: 600,
        bufferSize: 5,
        totalCount: 100
      });
      
      expect(vl).toBeDefined();
      expect(vl.itemHeight).toBe(80);
      expect(vl.screenHeight).toBe(600);
      expect(vl.totalCount).toBe(100);
    });

    test('使用默认配置', () => {
      const vl = new VirtualList();
      
      expect(vl.itemHeight).toBe(80);
      expect(vl.screenHeight).toBe(600);
      expect(vl.bufferSize).toBe(5);
      expect(vl.totalCount).toBe(0);
    });
  });

  describe('getVisibleRange 方法 - 计算可见区域', () => {
    test('计算可见范围', () => {
      const vl = new VirtualList({
        itemHeight: 80,
        screenHeight: 600,
        totalCount: 100
      });
      vl.scrollTop = 0;
      
      const range = vl.getVisibleRange();
      
      expect(range).toHaveProperty('startIndex');
      expect(range).toHaveProperty('endIndex');
      expect(range).toHaveProperty('visibleCount');
      expect(range).toHaveProperty('totalHeight');
      expect(range).toHaveProperty('offsetTop');
    });

    test('startIndex 不小于 0', () => {
      const vl = new VirtualList({ totalCount: 100 });
      vl.scrollTop = 0;
      
      const range = vl.getVisibleRange();
      
      expect(range.startIndex).toBeGreaterThanOrEqual(0);
    });

    test('endIndex 不超过 totalCount-1', () => {
      const vl = new VirtualList({
        itemHeight: 80,
        totalCount: 10
      });
      vl.scrollTop = 1000; // 滚动到底部
      
      const range = vl.getVisibleRange();
      
      expect(range.endIndex).toBeLessThanOrEqual(9);
    });

    test('计算总高度', () => {
      const vl = new VirtualList({
        itemHeight: 80,
        totalCount: 100
      });
      
      const range = vl.getVisibleRange();
      
      expect(range.totalHeight).toBe(8000);
    });
  });

  describe('onScroll 方法 - 处理滚动', () => {
    test('更新滚动位置并返回可见范围', () => {
      const vl = new VirtualList({ totalCount: 100 });
      
      const range = vl.onScroll(500);
      
      expect(vl.scrollTop).toBe(500);
      expect(range).toBeDefined();
    });
  });

  describe('updateConfig 方法 - 更新配置', () => {
    test('更新配置项', () => {
      const vl = new VirtualList({
        itemHeight: 80,
        totalCount: 100
      });
      
      vl.updateConfig({
        itemHeight: 100,
        bufferSize: 10
      });
      
      expect(vl.itemHeight).toBe(100);
      expect(vl.bufferSize).toBe(10);
      expect(vl.totalCount).toBe(100); // 未更新的保持不变
    });
  });
});

describe('模块导出 - 单例和初始化', () => {
  test('导出 CacheManager 类', () => {
    expect(CacheManager).toBeDefined();
  });

  test('导出 RequestManager 类', () => {
    expect(RequestManager).toBeDefined();
  });

  test('导出 RenderOptimizer 类', () => {
    expect(RenderOptimizer).toBeDefined();
  });

  test('导出 ImageOptimizer 类', () => {
    expect(ImageOptimizer).toBeDefined();
  });

  test('导出 PerformanceMonitor 类', () => {
    expect(PerformanceMonitor).toBeDefined();
  });

  test('导出 VirtualList 类', () => {
    expect(VirtualList).toBeDefined();
  });

  test('导出 cacheManager 单例', () => {
    expect(cacheManager).toBeDefined();
    expect(cacheManager).toBeInstanceOf(CacheManager);
  });

  test('导出 requestManager 单例', () => {
    expect(requestManager).toBeDefined();
    expect(requestManager).toBeInstanceOf(RequestManager);
  });

  test('导出 performanceMonitor 单例', () => {
    expect(performanceMonitor).toBeDefined();
    expect(performanceMonitor).toBeInstanceOf(PerformanceMonitor);
  });

  test('导出 init 方法', () => {
    expect(perfUtils.init).toBeDefined();
  });

  test('导出 optimizePage 方法', () => {
    expect(perfUtils.optimizePage).toBeDefined();
  });
});
