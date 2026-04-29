/**
 * Button 按钮组件单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Button 按钮组件测试', () => {
  let component;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('组件属性', () => {
    it('应该支持 text 属性', () => {
      const config = getButtonComponent();
      expect(config.properties.text).toBeDefined();
      expect(config.properties.text.value).toBe('按钮');
    });

    it('应该支持 type 类型', () => {
      const config = getButtonComponent();
      expect(config.properties.type.value).toBe('primary');
    });

    it('应该支持 size 尺寸', () => {
      const config = getButtonComponent();
      expect(config.properties.size.value).toBe('medium');
    });

    it('应该支持 shape 形状', () => {
      const config = getButtonComponent();
      expect(config.properties.shape.value).toBe('default');
    });

    it('应该支持 icon 图标', () => {
      const config = getButtonComponent();
      expect(config.properties.icon.value).toBe('');
    });

    it('应该支持 disabled 和 loading 状态', () => {
      const config = getButtonComponent();
      expect(config.properties.disabled.value).toBe(false);
      expect(config.properties.loading.value).toBe(false);
    });

    it('应该支持 block 块级按钮', () => {
      const config = getButtonComponent();
      expect(config.properties.block.value).toBe(false);
    });
  });

  describe('组件生命周期', () => {
    it('应该在 attached 时处理 shape', () => {
      const config = getButtonComponent();
      const mockComponent = {
        data: { shape: 'round', block: false, customClass: '' },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        shapeClass: 'btn-round',
        customClass: ''
      });
    });

    it('应该在 attached 时处理 block', () => {
      const config = getButtonComponent();
      const mockComponent = {
        data: { shape: 'default', block: true, customClass: '' },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        shapeClass: 'btn-block',
        customClass: 'btn-block'
      });
    });

    it('应该在 attached 时同时处理 shape 和 block', () => {
      const config = getButtonComponent();
      const mockComponent = {
        data: { shape: 'square', block: true, customClass: 'my-class' },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        shapeClass: 'btn-square btn-block',
        customClass: 'my-class btn-block'
      });
    });
  });

  describe('组件事件', () => {
    it('应该在正常状态下触发 tap 事件', () => {
      const config = getButtonComponent();
      const mockComponent = {
        data: { disabled: false, loading: false },
        triggerEvent: vi.fn()
      };
      const mockEvent = { type: 'tap' };
      
      config.methods.onTap.call(mockComponent, mockEvent);
      
      expect(mockComponent.triggerEvent).toHaveBeenCalledWith('tap', {
        originalEvent: mockEvent
      }, {
        bubbles: false,
        composed: false
      });
    });

    it('应该在 disabled 状态下不触发事件', () => {
      const config = getButtonComponent();
      const mockComponent = {
        data: { disabled: true, loading: false },
        triggerEvent: vi.fn()
      };
      
      config.methods.onTap.call(mockComponent, {});
      
      expect(mockComponent.triggerEvent).not.toHaveBeenCalled();
    });

    it('应该在 loading 状态下不触发事件', () => {
      const config = getButtonComponent();
      const mockComponent = {
        data: { disabled: false, loading: true },
        triggerEvent: vi.fn()
      };
      
      config.methods.onTap.call(mockComponent, {});
      
      expect(mockComponent.triggerEvent).not.toHaveBeenCalled();
    });
  });
});

function getButtonComponent() {
  let capturedConfig = null;
  
  const originalComponent = global.Component;
  global.Component = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  delete require.cache[require.resolve('../../components/button/index.js')];
  require('../../components/button/index.js');
  
  global.Component = originalComponent;
  
  return capturedConfig;
}
