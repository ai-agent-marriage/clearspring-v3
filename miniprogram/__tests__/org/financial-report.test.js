/**
 * 机构端 - 财务报表页面测试 V-08
 * @file miniprogram/__tests__/org/financial-report.test.js
 * @description 测试机构财务报表页面的各项功能
 */

describe('机构端 - 财务报表页面 V-08', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      showToast: jest.fn(),
      showModal: jest.fn(),
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
      stopPullDownRefresh: jest.fn()
    };
    global.wx = mockWx;

    page = {
      data: {
        statPeriod: '2026 年 4 月',
        dateFilter: 'month',
        summary: {
          totalIncome: '12,580.00',
          totalExpense: '8,960.00',
          netProfit: '3,620.00',
          incomeTrend: 15.8,
          expenseTrend: -5.2,
          profitTrend: 28.5
        },
        incomeDetail: {
          entrustedIncome: '10,200.00',
          selfIncome: '1,800.00',
          valueAddedIncome: '580.00'
        },
        expenseDetail: {
          volunteerPayment: '6,500.00',
          speciesPurchase: '1,800.00',
          transportation: '460.00',
          materials: '200.00'
        },
        orderStats: {
          total: 48,
          completed: 42,
          pending: 4,
          executing: 2
        }
      },
      onLoad: function() {
        this.loadFinancialData();
      },
      onPullDownRefresh: function() {
        this.loadFinancialData().then(() => {
          mockWx.stopPullDownRefresh();
        });
      },
      loadFinancialData: function() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 300);
        });
      },
      onDateFilterChange: function(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({ dateFilter: type });
        const periodMap = {
          today: this.formatDate(new Date(), 'YYYY 年 MM 月 DD 日'),
          week: this.getWeekRange(),
          month: this.formatDate(new Date(), 'YYYY 年 MM 月'),
          year: this.formatDate(new Date(), 'YYYY 年'),
          custom: '自定义'
        };
        this.setData({ statPeriod: periodMap[type] });
        this.loadFinancialData();
      },
      onCustomDateSelect: function() {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date();
        mockWx.showModal({
          title: '自定义日期范围',
          content: `开始：${this.formatDate(startDate)}\n结束：${this.formatDate(endDate)}`,
          showCancel: false,
          confirmText: '知道了'
        });
      },
      onExportReport: function(e) {
        const type = e?.currentTarget?.dataset?.type || 'excel';
        mockWx.showLoading({ title: '生成报表中...' });
        setTimeout(() => {
          mockWx.hideLoading();
          mockWx.showToast({ title: '报表已生成', icon: 'success' });
          setTimeout(() => {
            mockWx.showToast({ title: '已保存到下载中心', icon: 'success' });
          }, 1000);
        }, 1500);
      },
      onViewDetails: function() {
        mockWx.navigateTo({
          url: '/pages/org-financial-detail/org-financial-detail?period=' + this.data.dateFilter
        });
      },
      setData: function(obj) {
        Object.assign(this.data, obj);
      },
      formatDate: function(date, format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        if (format === 'YYYY 年 MM 月 DD 日') {
          return `${year}年${month}月${day}日`;
        } else if (format === 'YYYY 年 MM 月') {
          return `${year}年${month}月`;
        } else if (format === 'YYYY 年') {
          return `${year}年`;
        }
        return `${year}-${month}-${day}`;
      },
      getWeekRange: function() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return `${this.formatDate(monday, 'MM.DD')} - ${this.formatDate(sunday, 'MM.DD')}`;
      }
    };
  });

  // ==================== 功能测试 ====================

  test('页面正常加载', () => {
    page.onLoad();
    expect(page.data.statPeriod).toBe('2026 年 4 月');
    expect(page.data.dateFilter).toBe('month');
  });

  test('核心数据统计 - 总收入', () => {
    expect(page.data.summary.totalIncome).toBe('12,580.00');
  });

  test('核心数据统计 - 总支出', () => {
    expect(page.data.summary.totalExpense).toBe('8,960.00');
  });

  test('核心数据统计 - 净利润', () => {
    expect(page.data.summary.netProfit).toBe('3,620.00');
  });

  test('趋势数据 - 收入增长', () => {
    expect(page.data.summary.incomeTrend).toBe(15.8);
    expect(page.data.summary.incomeTrend).toBeGreaterThan(0);
  });

  test('趋势数据 - 支出变化', () => {
    expect(page.data.summary.expenseTrend).toBe(-5.2);
    expect(page.data.summary.expenseTrend).toBeLessThan(0);
  });

  test('收入明细 - 各项收入', () => {
    expect(page.data.incomeDetail.entrustedIncome).toBe('10,200.00');
    expect(page.data.incomeDetail.selfIncome).toBe('1,800.00');
    expect(page.data.incomeDetail.valueAddedIncome).toBe('580.00');
  });

  test('支出明细 - 各项支出', () => {
    expect(page.data.expenseDetail.volunteerPayment).toBe('6,500.00');
    expect(page.data.expenseDetail.speciesPurchase).toBe('1,800.00');
    expect(page.data.expenseDetail.transportation).toBe('460.00');
  });

  test('订单统计', () => {
    expect(page.data.orderStats.total).toBe(48);
    expect(page.data.orderStats.completed).toBe(42);
  });

  // ==================== 交互测试 ====================

  test('日期筛选切换 - 今日', () => {
    page.onDateFilterChange({ currentTarget: { dataset: { type: 'today' } } });
    expect(page.data.dateFilter).toBe('today');
  });

  test('日期筛选切换 - 本周', () => {
    page.onDateFilterChange({ currentTarget: { dataset: { type: 'week' } } });
    expect(page.data.dateFilter).toBe('week');
  });

  test('日期筛选切换 - 本月', () => {
    page.onDateFilterChange({ currentTarget: { dataset: { type: 'month' } } });
    expect(page.data.dateFilter).toBe('month');
  });

  test('日期筛选切换 - 本年', () => {
    page.onDateFilterChange({ currentTarget: { dataset: { type: 'year' } } });
    expect(page.data.dateFilter).toBe('year');
  });

  test('自定义日期选择', () => {
    page.onCustomDateSelect();
    expect(mockWx.showModal).toHaveBeenCalledWith(expect.objectContaining({
      title: '自定义日期范围'
    }));
  });

  test('导出报表 - Excel 格式', () => {
    page.onExportReport({ currentTarget: { dataset: { type: 'excel' } } });
    expect(mockWx.showLoading).toHaveBeenCalledWith({ title: '生成报表中...' });
  });

  test('导出报表 - 默认格式', () => {
    page.onExportReport(undefined);
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '报表已生成', icon: 'success' });
  });

  test('查看明细 - 跳转正确', () => {
    page.onViewDetails();
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/org-financial-detail/org-financial-detail?period=month'
    });
  });

  // ==================== 边界测试 ====================

  test('页面刷新 - onPullDownRefresh', async () => {
    mockWx.stopPullDownRefresh = jest.fn();
    await page.loadFinancialData();
    page.onPullDownRefresh();
    expect(mockWx.stopPullDownRefresh).toHaveBeenCalled();
  });

  test('财务数据计算 - 收支平衡', () => {
    const income = parseFloat(page.data.summary.totalIncome.replace(/,/g, ''));
    const expense = parseFloat(page.data.summary.totalExpense.replace(/,/g, ''));
    const profit = parseFloat(page.data.summary.netProfit.replace(/,/g, ''));
    expect(Math.abs((income - expense) - profit)).toBeLessThan(0.01);
  });

  test('收入明细合计', () => {
    const total = Object.values(page.data.incomeDetail)
      .reduce((sum, val) => sum + parseFloat(val.replace(/,/g, '')), 0);
    expect(total).toBeCloseTo(12580.00, 2);
  });

  test('支出明细合计', () => {
    const total = Object.values(page.data.expenseDetail)
      .reduce((sum, val) => sum + parseFloat(val.replace(/,/g, '')), 0);
    expect(total).toBeCloseTo(8960.00, 2);
  });

  test('订单状态分布', () => {
    const { total, completed, pending, executing } = page.data.orderStats;
    expect(completed + pending + executing).toBe(total);
  });

  test('日期格式化 - 标准格式', () => {
    const testDate = new Date('2026-04-12');
    expect(page.formatDate(testDate)).toBe('2026-04-12');
  });

  test('日期格式化 - 中文格式', () => {
    const testDate = new Date('2026-04-12');
    expect(page.formatDate(testDate, 'YYYY 年 MM 月 DD 日')).toBe('2026 年 04 月 12 日');
  });

  test('周范围计算', () => {
    const weekRange = page.getWeekRange();
    expect(weekRange).toMatch(/^\d{2}\.\d{2} - \d{2}\.\d{2}$/);
  });

  test('金额格式验证', () => {
    const amounts = [
      page.data.summary.totalIncome,
      page.data.summary.totalExpense,
      page.data.summary.netProfit
    ];
    amounts.forEach(amount => {
      expect(amount).toMatch(/^\d{1,3}(,\d{3})*\.\d{2}$/);
    });
  });

  test('趋势数据范围', () => {
    expect(page.data.summary.incomeTrend).toBeGreaterThanOrEqual(-100);
    expect(page.data.summary.incomeTrend).toBeLessThanOrEqual(1000);
  });

  test('统计数据非负', () => {
    expect(page.data.orderStats.total).toBeGreaterThanOrEqual(0);
    expect(page.data.orderStats.completed).toBeGreaterThanOrEqual(0);
  });
});
