/**
 * TabBar 自定义标签栏组件单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TabBar 自定义标签栏组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('组件数据', () => {
    it('应该初始化 currentIndex 为 0', () => {
      const config = getTabBarComponent();
      expect(config.data.currentIndex).toBe(0);
    });

    it('应该包含 animationClass', () => {
      const config = getTabBarComponent();
      expect(config.data.animationClass).toBe('tab-bar-animation');
    });

    it('应该包含页面路径配置', () => {
      const config = getTabBarComponent();
      expect(config.data.pages).toEqual([
        '/pages/yinyin/index',
        '/pages/chanli/index',
        '/pages/mine/index'
      ]);
    });
  });

  describe('组件生命周期', () => {
    it('应该在 attached 时设置当前选中状态', () => {
      const config = getTabBarComponent();
      
      // 模拟 getCurrentPages 返回 yinyin 页面
      const originalGetCurrentPages = global.getCurrentPages;
      global.getCurrentPages = vi.fn(() => [{ route: 'yinyin/index' }]);
      
      const mockComponent = {
        data: { 
          currentIndex: 0, 
          pages: config.data.pages 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        currentIndex: 0
      });
      
      global.getCurrentPages = originalGetCurrentPages;
    });

    it('应该在 chanli 页面时设置索引为 1', () => {
      const config = getTabBarComponent();
      
      const originalGetCurrentPages = global.getCurrentPages;
      global.getCurrentPages = vi.fn(() => [{ route: 'chanli/index' }]);
      
      const mockComponent = {
        data: { 
          currentIndex: 0, 
          pages: config.data.pages 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        currentIndex: 1
      });
      
      global.getCurrentPages = originalGetCurrentPages;
    });

    it('应该在 mine 页面时设置索引为 2', () => {
      const config = getTabBarComponent();
      
      const originalGetCurrentPages = global.getCurrentPages;
      global.getCurrentPages = vi.fn(() => [{ route: 'mine/index' }]);
      
      const mockComponent = {
        data: { 
          currentIndex: 0, 
          pages: config.data.pages 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        currentIndex: 2
      });
      
      global.getCurrentPages = originalGetCurrentPages;
    });

    it('应该在页面不匹配时保持原索引', () => {
      const config = getTabBarComponent();
      
      const originalGetCurrentPages = global.getCurrentPages;
      global.getCurrentPages = vi.fn(() => [{ route: 'other/index' }]);
      
      const mockComponent = {
        data: { 
          currentIndex: 0, 
          pages: config.data.pages 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      // 不应该调用 setData
      expect(mockComponent.setData).not.toHaveBeenCalled();
      
      global.getCurrentPages = originalGetCurrentPages;
    });
  });

  describe('组件事件', () => {
    it('应该跳转到目标页面', () => {
      const config = getTabBarComponent();
      const mockComponent = {
        data: { 
          currentIndex: 0,
          pages: ['/pages/yinyin/index', '/pages/chanli/index', '/pages/mine/index']
        },
        setData: vi.fn()
      };
      const mockEvent = {
        currentTarget: {
          dataset: { index: 1 }
        }
      };
      
      config.methods.onTabTap.call(mockComponent, mockEvent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        currentIndex: 1,
        animationClass: ''
      });
      
      expect(wx.switchTab).toHaveBeenCalledWith({
        url: '/pages/chanli/index',
        fail: expect.any(Function)
      });
    });

    it('应该不重复跳转当前页面', () => {
      const config = getTabBarComponent();
      const mockComponent = {
        data: { 
          currentIndex: 1,
          pages: ['/pages/yinyin/index', '/pages/chanli/index', '/pages/mine/index']
        },
        setData: vi.fn()
      };
      const mockEvent = {
        currentTarget: {
          dataset: { index: 1 }
        }
      };
      
      config.methods.onTabTap.call(mockComponent, mockEvent);
      
      expect(mockComponent.setData).not.toHaveBeenCalled();
      expect(wx.switchTab).not.toHaveBeenCalled();
    });

    it('应该在跳转失败时显示提示', () => {
      const config = getTabBarComponent();
      const mockComponent = {
        data: { 
          currentIndex: 0,
          pages: ['/pages/yinyin/index']
        },
        setData: vi.fn()
      };
      const mockEvent = {
        currentTarget: {
          dataset: { index: 0 }
        }
      };
      
      // 模拟 switchTab 失败
      wx.switchTab.mockImplementation(({ fail }) => {
        fail(new Error('跳转失败'));
      });
      
      config.methods.onTabTap.call(mockComponent, mockEvent);
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '页面跳转失败',
        icon: 'none'
      });
    });
  });

  describe('组件方法', () => {
    it('应该支持 setCurrent 方法', () => {
      const config = getTabBarComponent();
      const mockComponent = {
        setData: vi.fn()
      };
      
      config.methods.setCurrent.call(mockComponent, 2);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        currentIndex: 2,
        animationClass: ''
      });
    });
  });
});

function getTabBarComponent() {
  let capturedConfig = null;
  
  const originalComponent = global.Component;
  global.Component = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  // 添加 getCurrentPages 模拟
  global.getCurrentPages = vi.fn(() => []);
  
  delete require.cache[require.resolve('../../custom-tab-bar/index.js')];
  require('../../custom-tab-bar/index.js');
  
  global.Component = originalComponent;
  
  return capturedConfig;
}
