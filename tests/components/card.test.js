/**
 * Card 卡片组件单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Card 卡片组件测试', () => {
  let component;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('组件属性', () => {
    it('应该支持 title 属性', () => {
      const config = getCardComponent();
      expect(config.properties.title).toBeDefined();
      expect(config.properties.title.type).toBe(String);
      expect(config.properties.title.value).toBe('');
    });

    it('应该支持 subtitle 属性', () => {
      const config = getCardComponent();
      expect(config.properties.subtitle).toBeDefined();
      expect(config.properties.subtitle.value).toBe('');
    });

    it('应该支持 headerSlot 和 footerSlot', () => {
      const config = getCardComponent();
      expect(config.properties.headerSlot.value).toBe(false);
      expect(config.properties.footerSlot.value).toBe(false);
    });

    it('应该支持 variant 变体', () => {
      const config = getCardComponent();
      expect(config.properties.variant.value).toBe('default');
    });

    it('应该支持 customClass 和 customStyle', () => {
      const config = getCardComponent();
      expect(config.properties.customClass.value).toBe('');
      expect(config.properties.customStyle.value).toBe('');
    });
  });

  describe('组件生命周期', () => {
    it('应该在 attached 时处理 variant', () => {
      const config = getCardComponent();
      const mockComponent = {
        data: { variant: 'shadow-lg', customClass: '' },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        customClass: 'card-shadow-lg'
      });
    });

    it('应该在 attached 时保留原有 customClass', () => {
      const config = getCardComponent();
      const mockComponent = {
        data: { variant: 'borderless', customClass: 'my-class' },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        customClass: 'my-class card-borderless'
      });
    });

    it('应该在 variant 为 default 时不添加额外类名', () => {
      const config = getCardComponent();
      const mockComponent = {
        data: { variant: 'default', customClass: '' },
        setData: vi.fn()
      };
      
      config.lifetimes.attached.call(mockComponent);
      
      expect(mockComponent.setData).toHaveBeenCalledWith({
        customClass: ''
      });
    });
  });

  describe('组件事件', () => {
    it('应该触发 tap 事件', () => {
      const config = getCardComponent();
      const mockComponent = {
        triggerEvent: vi.fn()
      };
      
      config.methods.onTap.call(mockComponent);
      
      expect(mockComponent.triggerEvent).toHaveBeenCalledWith('tap', {}, {
        bubbles: false,
        composed: false
      });
    });
  });

  describe('组件配置', () => {
    it('应该启用多插槽支持', () => {
      const config = getCardComponent();
      expect(config.options.multipleSlots).toBe(true);
    });
  });
});

function getCardComponent() {
  // 模拟 Component 函数返回配置
  let capturedConfig = null;
  
  const originalComponent = global.Component;
  global.Component = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  // 重新加载组件文件
  delete require.cache[require.resolve('../../components/card/index.js')];
  require('../../components/card/index.js');
  
  // 恢复原始 Component
  global.Component = originalComponent;
  
  return capturedConfig;
}
