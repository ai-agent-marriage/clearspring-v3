/**
 * Navbar 导航栏组件单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Navbar 导航栏组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('组件属性', () => {
    it('应该支持 title 属性', () => {
      const config = getNavbarComponent();
      expect(config.properties.title).toBeDefined();
      expect(config.properties.title.value).toBe('');
    });

    it('应该支持 showBack 和 backText', () => {
      const config = getNavbarComponent();
      expect(config.properties.showBack.value).toBe(false);
      expect(config.properties.backText.value).toBe('');
    });

    it('应该支持 rightText', () => {
      const config = getNavbarComponent();
      expect(config.properties.rightText.value).toBe('');
    });

    it('应该支持 titleEllipsis', () => {
      const config = getNavbarComponent();
      expect(config.properties.titleEllipsis.value).toBe(true);
    });

    it('应该支持 border', () => {
      const config = getNavbarComponent();
      expect(config.properties.border.value).toBe(true);
    });

    it('应该支持 variant 变体', () => {
      const config = getNavbarComponent();
      expect(config.properties.variant.value).toBe('default');
    });

    it('应该支持 textTheme', () => {
      const config = getNavbarComponent();
      expect(config.properties.textTheme.value).toBe('dark');
    });
  });

  describe('组件生命周期', () => {
    it('应该在 attached 时获取状态栏高度', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        data: { 
          statusBarHeight: 20, 
          variant: 'default', 
          textTheme: 'dark',
          customClass: '' 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalled();
      const callArg = mockComponent.setData.mock.calls[0][0];
      expect(callArg.statusBarHeight).toBe(20);
    });

    it('应该在 attached 时处理 variant', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        data: { 
          statusBarHeight: 20, 
          variant: 'dark', 
          textTheme: 'dark',
          customClass: '' 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      const callArg = mockComponent.setData.mock.calls[0][0];
      expect(callArg.customClass).toContain('navbar-dark');
    });

    it('应该在 attached 时处理 transparent variant 的 textTheme', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        data: { 
          statusBarHeight: 20, 
          variant: 'transparent', 
          textTheme: 'light',
          customClass: '' 
        },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      const callArg = mockComponent.setData.mock.calls[0][0];
      expect(callArg.customClass).toContain('navbar-light-text');
    });
  });

  describe('组件事件', () => {
    it('应该在 showBack 时调用 navigateBack', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        data: { showBack: true },
        triggerEvent: vi.fn()
      };
      
      config.methods.onLeftTap.call(mockComponent);
      
      expect(wx.navigateBack).toHaveBeenCalledWith({
        delta: 1,
        fail: expect.any(Function)
      });
      expect(mockComponent.triggerEvent).toHaveBeenCalledWith('lefttap', {}, {
        bubbles: false,
        composed: false
      });
    });

    it('应该在不显示返回按钮时只触发事件', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        data: { showBack: false },
        triggerEvent: vi.fn()
      };
      
      config.methods.onLeftTap.call(mockComponent);
      
      expect(wx.navigateBack).not.toHaveBeenCalled();
      expect(mockComponent.triggerEvent).toHaveBeenCalledWith('lefttap', {}, {
        bubbles: false,
        composed: false
      });
    });

    it('应该触发 titletap 事件', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        triggerEvent: vi.fn()
      };
      
      config.methods.onTitleTap.call(mockComponent);
      
      expect(mockComponent.triggerEvent).toHaveBeenCalledWith('titletap', {}, {
        bubbles: false,
        composed: false
      });
    });

    it('应该触发 righttap 事件', () => {
      const config = getNavbarComponent();
      const mockComponent = {
        triggerEvent: vi.fn()
      };
      
      config.methods.onRightTap.call(mockComponent);
      
      expect(mockComponent.triggerEvent).toHaveBeenCalledWith('righttap', {}, {
        bubbles: false,
        composed: false
      });
    });
  });
});

function getNavbarComponent() {
  let capturedConfig = null;
  
  const originalComponent = global.Component;
  global.Component = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  delete require.cache[require.resolve('../../components/navbar/index.js')];
  require('../../components/navbar/index.js');
  
  global.Component = originalComponent;
  
  return capturedConfig;
}
