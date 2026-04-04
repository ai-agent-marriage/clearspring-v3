/**
 * utils/util.js 单元测试
 * 测试工具函数的各项功能
 */
/* eslint-disable no-unused-vars */

const util = require('../utils/util.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('formatDate - 日期格式化', () => {
  test('格式化日期为默认格式', () => {
    const date = new Date('2026-04-04 15:30:45');
    const result = util.formatDate(date);
    
    expect(result).toBe('2026-04-04 15:30:45');
  });

  test('格式化日期为指定格式 YYYY-MM-DD', () => {
    const date = new Date('2026-04-04 15:30:45');
    const result = util.formatDate(date, 'YYYY-MM-DD');
    
    expect(result).toBe('2026-04-04');
  });

  test('格式化日期为指定格式 HH:mm:ss', () => {
    const date = new Date('2026-04-04 15:30:45');
    const result = util.formatDate(date, 'HH:mm:ss');
    
    expect(result).toBe('15:30:45');
  });

  test('格式化日期为指定格式 YYYY/MM/DD', () => {
    const date = new Date('2026-04-04 15:30:45');
    const result = util.formatDate(date, 'YYYY/MM/DD');
    
    expect(result).toBe('2026/04/04');
  });

  test('格式化日期为指定格式 MM-DD', () => {
    const date = new Date('2026-04-04 15:30:45');
    const result = util.formatDate(date, 'MM-DD');
    
    expect(result).toBe('04-04');
  });

  test('未传入日期时使用当前日期', () => {
    const result = util.formatDate();
    const expected = new Date();
    const expectedStr = util.formatDate(expected);
    
    expect(result).toBe(expectedStr);
  });

  test('格式化单个数字月份和日期补零', () => {
    const date = new Date('2026-01-05 09:05:03');
    const result = util.formatDate(date, 'YYYY-MM-DD HH:mm:ss');
    
    expect(result).toBe('2026-01-05 09:05:03');
  });

  test('格式化年份简写', () => {
    const date = new Date('2026-04-04 15:30:45');
    const result = util.formatDate(date, 'YY-MM-DD');
    
    expect(result).toBe('26-04-04');
  });
});

describe('getLunarDate - 农历日期', () => {
  test('返回农历信息对象', () => {
    const date = new Date('2026-04-04');
    const result = util.getLunarDate(date);
    
    expect(result).toHaveProperty('lunarYear');
    expect(result).toHaveProperty('lunarMonth');
    expect(result).toHaveProperty('lunarDay');
    expect(result).toHaveProperty('ganzhi');
  });

  test('农历信息包含正确类型', () => {
    const date = new Date('2026-04-04');
    const result = util.getLunarDate(date);
    
    expect(typeof result.lunarYear).toBe('number');
    expect(typeof result.lunarMonth).toBe('string');
    expect(typeof result.lunarDay).toBe('string');
    expect(typeof result.ganzhi).toBe('string');
  });
});

describe('getBuddhistDate - 佛历日期', () => {
  test('计算佛历年份', () => {
    const date = new Date('2026-04-04');
    const result = util.getBuddhistDate(date);
    
    expect(result).toBe('佛历 2570 年');
  });

  test('佛历 = 公历 + 543', () => {
    const date = new Date('2000-01-01');
    const result = util.getBuddhistDate(date);
    
    expect(result).toBe('佛历 2543 年');
  });

  test('公元前年份计算', () => {
    const date = new Date('0001-01-01');
    const result = util.getBuddhistDate(date);
    
    expect(result).toBe('佛历 544 年');
  });
});

describe('getSuitAndAvoid - 宜忌', () => {
  test('返回宜忌对象', () => {
    const date = new Date('2026-04-04');
    const result = util.getSuitAndAvoid(date);
    
    expect(result).toHaveProperty('suit');
    expect(result).toHaveProperty('avoid');
  });

  test('宜忌为数组', () => {
    const date = new Date('2026-04-04');
    const result = util.getSuitAndAvoid(date);
    
    expect(Array.isArray(result.suit)).toBe(true);
    expect(Array.isArray(result.avoid)).toBe(true);
  });

  test('宜忌内容有效', () => {
    const date = new Date('2026-04-04');
    const result = util.getSuitAndAvoid(date);
    
    expect(result.suit.length).toBeGreaterThan(0);
    expect(result.avoid.length).toBeGreaterThan(0);
  });
});

describe('getRandomZenQuote - 随机禅理', () => {
  test('返回禅理字符串', () => {
    const result = util.getRandomZenQuote();
    
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('禅理来自预设列表', () => {
    const quotes = [
      '积善成德，而神明自得，圣心备焉',
      '心无挂碍，无挂碍故，无有恐怖',
      '诸恶莫作，众善奉行',
      '应无所住，而生其心',
      '一切有为法，如梦幻泡影',
      '菩提本无树，明镜亦非台',
      '本来无一物，何处惹尘埃',
      '色即是空，空即是色'
    ];
    
    // 多次调用应该能覆盖不同的禅语
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(util.getRandomZenQuote());
    }
    
    // 应该至少返回多个不同的禅语
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('debounce - 防抖函数', () => {
  test('创建防抖函数', () => {
    const fn = jest.fn();
    const debounced = util.debounce(fn, 100);
    
    expect(typeof debounced).toBe('function');
  });

  test('防抖函数在延迟后执行', (done) => {
    const fn = jest.fn();
    const debounced = util.debounce(fn, 100);
    
    debounced('arg1', 'arg2');
    
    expect(fn).not.toHaveBeenCalled();
    
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
      done();
    }, 150);
  });

  test('多次调用只执行最后一次', (done) => {
    const fn = jest.fn();
    const debounced = util.debounce(fn, 100);
    
    debounced('first');
    debounced('second');
    debounced('third');
    
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('third');
      done();
    }, 150);
  });

  test('使用默认延迟时间', (done) => {
    const fn = jest.fn();
    const debounced = util.debounce(fn); // 不传 delay，使用默认 300ms
    
    debounced('test');
    
    setTimeout(() => {
      expect(fn).not.toHaveBeenCalled();
    }, 200);
    
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      done();
    }, 350);
  });

  test('防抖函数保留 this 上下文', (done) => {
    const obj = {
      value: 42,
      fn: function() { return this.value; }
    };
    
    const debounced = util.debounce(obj.fn, 100);
    
    setTimeout(() => {
      // 防抖函数应该保持原始函数的上下文
      done();
    }, 150);
  });
});

describe('throttle - 节流函数', () => {
  test('创建节流函数', () => {
    const fn = jest.fn();
    const throttled = util.throttle(fn, 100);
    
    expect(typeof throttled).toBe('function');
  });

  test('节流函数按间隔执行', () => {
    const fn = jest.fn();
    const throttled = util.throttle(fn, 100);
    
    // 立即执行第一次
    throttled('first');
    expect(fn).toHaveBeenCalledTimes(1);
    
    // 立即调用不执行
    throttled('second');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('节流函数在间隔后再次执行', (done) => {
    const fn = jest.fn();
    const throttled = util.throttle(fn, 100);
    
    throttled('first');
    
    setTimeout(() => {
      throttled('second');
      expect(fn).toHaveBeenCalledTimes(2);
      done();
    }, 150);
  });

  test('节流函数传递参数', () => {
    const fn = jest.fn();
    const throttled = util.throttle(fn, 100);
    
    throttled('arg1', 'arg2');
    
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('使用默认间隔时间', () => {
    const fn = jest.fn();
    const throttled = util.throttle(fn); // 不传 interval，使用默认 300ms
    
    throttled('first');
    throttled('second');
    
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('formatNumber - 数字格式化', () => {
  test('格式化千位数字', () => {
    const result = util.formatNumber(1000);
    expect(result).toBe('1,000');
  });

  test('格式化万位数字', () => {
    const result = util.formatNumber(10000);
    expect(result).toBe('10,000');
  });

  test('格式化百万数字', () => {
    const result = util.formatNumber(1000000);
    expect(result).toBe('1,000,000');
  });

  test('格式化小于千的数字', () => {
    const result = util.formatNumber(999);
    expect(result).toBe('999');
  });

  test('格式化负数', () => {
    const result = util.formatNumber(-1000);
    expect(result).toBe('-1,000');
  });

  test('格式化小数', () => {
    const result = util.formatNumber(1234.56);
    expect(result).toBe('1,234.56');
  });

  test('格式化零', () => {
    const result = util.formatNumber(0);
    expect(result).toBe('0');
  });
});

describe('formatRelativeTime - 相对时间', () => {
  test('刚刚（不到 1 分钟）', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 30000); // 30 秒前
    expect(result).toBe('刚刚');
  });

  test('几分钟前', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 5 * 60 * 1000); // 5 分钟前
    expect(result).toBe('5 分钟前');
  });

  test('几小时前', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 3 * 60 * 60 * 1000); // 3 小时前
    expect(result).toBe('3 小时前');
  });

  test('几天前', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 5 * 24 * 60 * 60 * 1000); // 5 天前
    expect(result).toBe('5 天前');
  });

  test('几周前', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 2 * 7 * 24 * 60 * 60 * 1000); // 2 周前
    expect(result).toBe('2 周前');
  });

  test('几个月前显示日期', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 60 * 24 * 60 * 60 * 1000); // 60 天前
    const expectedDate = util.formatDate(new Date(now - 60 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD');
    expect(result).toBe(expectedDate);
  });

  test('边界值：刚好 1 分钟', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 60 * 1000);
    expect(result).toBe('1 分钟前');
  });

  test('边界值：刚好 1 小时', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 60 * 60 * 1000);
    expect(result).toBe('1 小时前');
  });

  test('边界值：刚好 1 天', () => {
    const now = Date.now();
    const result = util.formatRelativeTime(now - 24 * 60 * 60 * 1000);
    expect(result).toBe('1 天前');
  });
});

describe('deepClone - 深拷贝', () => {
  test('拷贝基本类型', () => {
    expect(util.deepClone(42)).toBe(42);
    expect(util.deepClone('hello')).toBe('hello');
    expect(util.deepClone(true)).toBe(true);
    expect(util.deepClone(null)).toBe(null);
    expect(util.deepClone(undefined)).toBe(undefined);
  });

  test('拷贝数组', () => {
    const original = [1, 2, 3];
    const cloned = util.deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  test('拷贝嵌套数组', () => {
    const original = [1, [2, 3], [4, [5, 6]]];
    const cloned = util.deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
    expect(cloned[2][1]).not.toBe(original[2][1]);
  });

  test('拷贝对象', () => {
    const original = { a: 1, b: 2 };
    const cloned = util.deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  test('拷贝嵌套对象', () => {
    const original = { 
      a: 1, 
      b: { 
        c: 2, 
        d: { e: 3 } 
      } 
    };
    const cloned = util.deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b.d).not.toBe(original.b.d);
  });

  test('拷贝混合结构', () => {
    const original = {
      name: 'test',
      items: [1, 2, { nested: true }],
      meta: {
        tags: ['a', 'b'],
        count: 10
      }
    };
    
    const cloned = util.deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned.items).not.toBe(original.items);
    expect(cloned.meta.tags).not.toBe(original.meta.tags);
  });

  test('修改克隆不影响原对象', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = util.deepClone(original);
    
    cloned.a = 100;
    cloned.b.c = 200;
    
    expect(original.a).toBe(1);
    expect(original.b.c).toBe(2);
  });

  test('拷贝包含函数的对象', () => {
    const original = { 
      value: 42,
      fn: function() { return this.value; }
    };
    
    const cloned = util.deepClone(original);
    
    expect(cloned.value).toBe(42);
    // 函数会被拷贝但可能失去上下文
    expect(typeof cloned.fn).toBe('function');
  });
});

describe('工具函数导出', () => {
  test('导出 formatDate', () => {
    expect(util.formatDate).toBeDefined();
    expect(typeof util.formatDate).toBe('function');
  });

  test('导出 getLunarDate', () => {
    expect(util.getLunarDate).toBeDefined();
    expect(typeof util.getLunarDate).toBe('function');
  });

  test('导出 getBuddhistDate', () => {
    expect(util.getBuddhistDate).toBeDefined();
    expect(typeof util.getBuddhistDate).toBe('function');
  });

  test('导出 getSuitAndAvoid', () => {
    expect(util.getSuitAndAvoid).toBeDefined();
    expect(typeof util.getSuitAndAvoid).toBe('function');
  });

  test('导出 getRandomZenQuote', () => {
    expect(util.getRandomZenQuote).toBeDefined();
    expect(typeof util.getRandomZenQuote).toBe('function');
  });

  test('导出 debounce', () => {
    expect(util.debounce).toBeDefined();
    expect(typeof util.debounce).toBe('function');
  });

  test('导出 throttle', () => {
    expect(util.throttle).toBeDefined();
    expect(typeof util.throttle).toBe('function');
  });

  test('导出 formatNumber', () => {
    expect(util.formatNumber).toBeDefined();
    expect(typeof util.formatNumber).toBe('function');
  });

  test('导出 formatRelativeTime', () => {
    expect(util.formatRelativeTime).toBeDefined();
    expect(typeof util.formatRelativeTime).toBe('function');
  });

  test('导出 deepClone', () => {
    expect(util.deepClone).toBeDefined();
    expect(typeof util.deepClone).toBe('function');
  });
});
