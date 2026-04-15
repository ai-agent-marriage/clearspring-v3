/**
 * app-util.js 工具函数单元测试
 * 测试覆盖率目标：90%+
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDate,
  formatLunar,
  showLoading,
  showToast,
  showError,
  showActionSheet,
  debounce,
  throttle,
  deepClone,
  formatNumber
} from '../../utils/app-util.js';

describe('app-util.js 工具函数测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatDate - 日期格式化', () => {
    it('应该格式化 Date 对象', () => {
      const date = new Date('2026-04-14T12:30:45');
      const result = formatDate(date, 'YYYY-MM-DD');
      expect(result).toBe('2026-04-14');
    });

    it('应该格式化时间戳', () => {
      const timestamp = 1713081600000; // 2024-04-14
      const result = formatDate(timestamp, 'YYYY-MM-DD');
      expect(result).toBe('2024-04-14');
    });

    it('应该格式化日期字符串', () => {
      const dateStr = '2026-04-14';
      const result = formatDate(dateStr, 'YYYY/MM/DD');
      expect(result).toBe('2026/04/14');
    });

    it('应该使用默认格式', () => {
      const date = new Date('2026-04-14T12:30:45');
      const result = formatDate(date);
      expect(result).toContain('2026-04-14');
    });

    it('应该处理空值', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('应该处理无效日期', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = formatDate('invalid-date');
      expect(result).toBe('');
      expect(consoleWarn).toHaveBeenCalled();
      consoleWarn.mockRestore();
    });

    it('应该正确补零', () => {
      const date = new Date('2026-01-05T09:05:03');
      const result = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2026-01-05 09:05:03');
    });
  });

  describe('formatLunar - 农历转换', () => {
    it('应该返回农历信息对象', () => {
      const date = new Date('2026-04-14');
      const result = formatLunar(date);
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('day');
      expect(result).toHaveProperty('full');
    });

    it('应该处理空值', () => {
      expect(formatLunar(null)).toBeNull();
      expect(formatLunar(undefined)).toBeNull();
    });

    it('应该处理无效日期', () => {
      expect(formatLunar('invalid')).toBeNull();
    });

    it('应该返回天干地支年份', () => {
      const date = new Date('2026-04-14');
      const result = formatLunar(date);
      // 2026 年是丙午年
      expect(result.year).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
    });
  });

  describe('showLoading - 加载提示', () => {
    it('应该调用 wx.showLoading 默认参数', () => {
      showLoading();
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '加载中...',
        mask: true
      });
    });

    it('应该使用自定义标题', () => {
      showLoading('数据加载中');
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '数据加载中',
        mask: true
      });
    });

    it('应该支持关闭遮罩', () => {
      showLoading('加载中', false);
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '加载中',
        mask: false
      });
    });
  });

  describe('showToast - 成功提示', () => {
    it('应该调用 wx.showToast 默认参数', () => {
      showToast();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '操作成功',
        icon: 'success',
        duration: 1500,
        mask: true
      });
    });

    it('应该支持自定义时长', () => {
      showToast('保存成功', 2000);
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        mask: true
      });
    });
  });

  describe('showError - 错误提示', () => {
    it('应该调用 wx.showToast 显示错误', () => {
      showError();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '操作失败',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    });

    it('应该支持自定义错误信息', () => {
      showError('网络错误');
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '网络错误',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    });
  });

  describe('showActionSheet - 操作菜单', () => {
    it('应该调用 wx.showActionSheet', () => {
      const successCb = vi.fn();
      showActionSheet(['编辑', '删除'], successCb);
      expect(wx.showActionSheet).toHaveBeenCalledWith({
        itemList: ['编辑', '删除'],
        success: expect.any(Function),
        fail: expect.any(Function)
      });
    });

    it('应该执行成功回调', () => {
      const successCb = vi.fn();
      showActionSheet(['选项 1'], successCb);
      
      // 获取并执行 success 回调
      const call = wx.showActionSheet.mock.calls[0][0];
      call.success({ tapIndex: 0 });
      
      expect(successCb).toHaveBeenCalledWith({
        index: 0,
        tapIndex: 0
      });
    });
  });

  describe('debounce - 防抖函数', () => {
    it('应该延迟执行函数', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn();
      expect(fn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      
      vi.useRealTimers();
    });

    it('应该取消之前的调用', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      
      vi.useRealTimers();
    });

    it('应该传递参数', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
      vi.useRealTimers();
    });
  });

  describe('throttle - 节流函数', () => {
    it('应该限制执行频率', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      vi.advanceTimersByTime(100);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
      
      vi.useRealTimers();
    });

    it('应该传递参数', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn('arg1');
      throttledFn('arg2');
      
      expect(fn).toHaveBeenCalledWith('arg1');
      vi.useFakeTimers();
      vi.advanceTimersByTime(100);
      throttledFn('arg3');
      expect(fn).toHaveBeenCalledWith('arg3');
      vi.useRealTimers();
    });
  });

  describe('deepClone - 深拷贝', () => {
    it('应该拷贝基本类型', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('应该拷贝数组', () => {
      const original = [1, 2, { a: 3 }];
      const copy = deepClone(original);
      
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
      expect(copy[2]).not.toBe(original[2]);
    });

    it('应该拷贝对象', () => {
      const original = { a: 1, b: { c: 2 } };
      const copy = deepClone(original);
      
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
      expect(copy.b).not.toBe(original.b);
    });

    it('应该拷贝 Date 对象', () => {
      const original = new Date('2026-04-14');
      const copy = deepClone(original);
      
      expect(copy.getTime()).toBe(original.getTime());
      expect(copy).not.toBe(original);
    });

    it('应该处理嵌套结构', () => {
      const original = {
        a: 1,
        b: [2, 3, { c: 4 }],
        d: { e: { f: 5 } }
      };
      const copy = deepClone(original);
      
      expect(copy).toEqual(original);
      expect(copy.b[2]).not.toBe(original.b[2]);
      expect(copy.d.e).not.toBe(original.d.e);
    });
  });

  describe('formatNumber - 数字格式化', () => {
    it('应该添加千分位', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('应该保留两位小数', () => {
      expect(formatNumber(1000)).toBe('1,000.00');
    });

    it('应该处理空值', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });

    it('应该处理无效数字', () => {
      expect(formatNumber(NaN)).toBe('0');
      expect(formatNumber('invalid')).toBe('0');
    });

    it('应该支持自定义小数位', () => {
      expect(formatNumber(1234.5, 0)).toBe('1,235');
      expect(formatNumber(1234.567, 3)).toBe('1,234.567');
    });
  });
});
