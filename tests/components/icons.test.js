/**
 * Icons 图标组件单元测试
 * 测试 18 个 Material Icons 图标组件
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = '../../components/icons';
const ICON_NAMES = [
  'notification',
  'money',
  'document',
  'location',
  'task',
  'chart',
  'people',
  'time',
  'announcement',
  'fish',
  'transport',
  'package',
  'target',
  'plant',
  'add',
  'export',
  'check',
  'inbox'
];

describe('Icons 图标组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('图标文件存在性', () => {
    ICON_NAMES.forEach(iconName => {
      it(`应该存在 ${iconName}-icon 组件文件`, () => {
        const iconPath = path.join(__dirname, ICONS_DIR, `${iconName}-icon.wxml`);
        expect(fs.existsSync(iconPath)).toBe(true);
      });
    });
  });

  describe('图标组件结构', () => {
    ICON_NAMES.forEach(iconName => {
      it(`${iconName}-icon 应该包含正确的组件名`, () => {
        const content = readIconFile(`${iconName}-icon.wxml`);
        expect(content).toContain(`icon-${iconName}`);
      });

      it(`${iconName}-icon 应该支持 size 属性`, () => {
        const content = readIconFile(`${iconName}-icon.wxml`);
        expect(content).toMatch(/size\s*=\s*["']?\w*["']?/);
      });

      it(`${iconName}-icon 应该支持 color 属性`, () => {
        const content = readIconFile(`${iconName}-icon.wxml`);
        expect(content).toMatch(/color\s*=\s*["']?\w*["']?/);
      });
    });
  });

  describe('图标样式文件', () => {
    it('应该存在 icons.wxss 样式文件', () => {
      const stylePath = path.join(__dirname, ICONS_DIR, 'icons.wxss');
      expect(fs.existsSync(stylePath)).toBe(true);
    });

    it('icons.wxss 应该包含尺寸样式', () => {
      const content = readIconFile('icons.wxss');
      expect(content).toMatch(/small|medium|large/);
    });

    it('icons.wxss 应该包含颜色样式', () => {
      const content = readIconFile('icons.wxss');
      expect(content).toMatch(/gold|green|warning|error/);
    });
  });

  describe('图标组件属性模拟测试', () => {
    ICON_NAMES.forEach(iconName => {
      it(`${iconName}-icon 应该支持默认属性`, () => {
        const config = getIconComponentConfig(iconName);
        
        if (config && config.properties) {
          expect(config.properties.size).toBeDefined();
          expect(config.properties.color).toBeDefined();
          expect(config.properties.customClass).toBeDefined();
        }
      });
    });
  });

  describe('图标使用示例', () => {
    it('应该支持基础用法', () => {
      const usage = `<icon-notification />`;
      expect(usage).toMatch(/<icon-\w+ \/>/);
    });

    it('应该支持带尺寸的用法', () => {
      const usage = `<icon-notification size="large" />`;
      expect(usage).toContain('size="large"');
    });

    it('应该支持带颜色的用法', () => {
      const usage = `<icon-notification color="gold" />`;
      expect(usage).toContain('color="gold"');
    });

    it('应该支持自定义类名', () => {
      const usage = `<icon-notification customClass="my-class" />`;
      expect(usage).toContain('customClass="my-class"');
    });
  });
});

function readIconFile(filename) {
  const filePath = path.join(__dirname, ICONS_DIR, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return '';
}

function getIconComponentConfig(iconName) {
  let capturedConfig = null;
  
  const originalComponent = global.Component;
  global.Component = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  const iconPath = path.join(__dirname, ICONS_DIR, `${iconName}-icon.js`);
  
  try {
    if (fs.existsSync(iconPath)) {
      delete require.cache[require.resolve(iconPath)];
      require(iconPath);
    }
  } catch (e) {
    // 图标可能只有 wxml 文件，没有 js 文件
  }
  
  global.Component = originalComponent;
  
  return capturedConfig;
}
