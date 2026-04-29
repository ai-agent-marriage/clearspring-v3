// 清如 ClearSpring - 机构财务报表页 V-08
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // 统计周期
    statPeriod: '2026 年 4 月',
    dateFilter: 'month', // today, week, month, year, custom
    
    // 核心数据汇总
    summary: {
      totalIncome: '12,580.00',
      totalExpense: '8,960.00',
      netProfit: '3,620.00',
      incomeTrend: 15.8, // 较上期增长百分比
      expenseTrend: -5.2,
      profitTrend: 28.5
    },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
    
    // 收入明细
    incomeDetail: {
      entrustedIncome: '10,200.00', // 委托护生
      selfIncome: '1,800.00', // 自主护生
      valueAddedIncome: '580.00' // 增值服务
    },
    
    // 支出明细
    expenseDetail: {
      volunteerPayment: '6,500.00', // 志愿者酬劳
      speciesPurchase: '1,800.00', // 物种采购
      transportation: '460.00', // 交通费用
      materials: '200.00' // 物料成本
    },
    
    // 订单统计
    orderStats: {
      total: 48,
      completed: 42,
      pending: 4,
      executing: 2
    }
  },

  onLoad() {
    this.loadFinancialData();
  },

  onPullDownRefresh() {
    this.loadFinancialData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载财务数据
  async loadFinancialData() {
    try {
      ErrorHandler.showLoading('加载中...');
      
      // TODO: 调用云函数获取财务数据
      // const res = await wx.cloud.callFunction({
      //   name: 'getFinancialReport',
      //   data: {
      //     period: this.data.dateFilter
      //   }
      // });
      
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('加载财务数据失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadFinancialData',
        showToast: true
      });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  // 日期筛选切换
  onDateFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ dateFilter: type });
    
    // 更新统计周期显示
    const periodMap = {
      today: this.formatDate(new Date(), 'YYYY 年 MM 月 DD 日'),
      week: this.getWeekRange(),
      month: this.formatDate(new Date(), 'YYYY 年 MM 月'),
      year: this.formatDate(new Date(), 'YYYY 年'),
      custom: '自定义'
    };
    
    this.setData({
      statPeriod: periodMap[type]
    });
    
    // 重新加载数据
    this.loadFinancialData();
  },

  // 自定义日期选择
  onCustomDateSelect() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date();
    
    wx.showModal({
      title: '自定义日期范围',
      content: `开始：${this.formatDate(startDate)}\n结束：${this.formatDate(endDate)}`,
      showCancel: false,
      confirmText: '知道了'
    });
    
    // TODO: 使用日期选择器组件
  },

  // 导出报表
  onExportReport(e) {
    const type = e.currentTarget.dataset.type || 'excel';
    
    wx.showLoading({
      title: '生成报表中...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // TODO: 调用云函数生成报表
      // const res = await wx.cloud.callFunction({
      //   name: 'exportFinancialReport',
      //   data: {
      //     type,
      //     period: this.data.dateFilter
      //   }
      // });
      
      wx.showToast({
        title: '报表已生成',
        icon: 'success'
      });
      
      // 模拟下载
      setTimeout(() => {
        wx.showToast({
          title: '已保存到下载中心',
          icon: 'success'
        });
      }, 1000);
    }, 1500);
  },

  // 查看明细
  onViewDetails() {
    wx.navigateTo({
      url: '/pages/org-financial-detail/org-financial-detail?period=' + this.data.dateFilter
    });
  },

  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
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

  // 获取周范围
  getWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return `${this.formatDate(monday, 'MM.DD')} - ${this.formatDate(sunday, 'MM.DD')}`;
  }
});
