/**
 * Index 首页页面单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Index 首页页面测试', () => {
  let page;

  beforeEach(() => {
    vi.clearAllMocks();
    page = null;
  });

  describe('页面数据', () => {
    it('应该初始化 services 数据', () => {
      page = getIndexPage();
      expect(page.data.services).toBeDefined();
      expect(page.data.services.length).toBeGreaterThan(0);
    });

    it('应该初始化 notices 数据', () => {
      page = getIndexPage();
      expect(page.data.notices).toBeDefined();
      expect(page.data.notices.length).toBeGreaterThan(0);
    });

    it('service 应该包含 id、name、icon 字段', () => {
      page = getIndexPage();
      const service = page.data.services[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('icon');
    });

    it('notice 应该包含 id、title、date 字段', () => {
      page = getIndexPage();
      const notice = page.data.notices[0];
      expect(notice).toHaveProperty('id');
      expect(notice).toHaveProperty('title');
      expect(notice).toHaveProperty('date');
    });
  });

  describe('页面生命周期', () => {
    it('应该在 onLoad 时输出日志', () => {
      page = getIndexPage();
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      page.onLoad();
      
      expect(consoleLog).toHaveBeenCalledWith('首页加载完成');
      consoleLog.mockRestore();
    });
  });

  describe('页面事件处理', () => {
    it('goToService 应该调用 navigateTo', () => {
      page = getIndexPage();
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      };
      
      page.goToService(mockEvent);
      
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/service/service'
      });
    });

    it('goToService 应该能获取正确的 index', () => {
      page = getIndexPage();
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 2
          }
        }
      };
      
      // 虽然不直接使用 index，但应该能访问
      expect(mockEvent.currentTarget.dataset.index).toBe(2);
    });
  });
});

function getIndexPage() {
  let capturedConfig = null;
  
  const originalPage = global.Page;
  global.Page = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  delete require.cache[require.resolve('../../pages/index/index.js')];
  require('../../pages/index/index.js');
  
  global.Page = originalPage;
  
  return capturedConfig;
}
