// 财务报表
Page({
  data: {
    period: 'month',
    totalIncome: '128,450',
    totalExpense: '86,320',
    netProfit: '42,130',
    pendingSettle: '15,680',
    categories: [
      { id: 1, name: '任务执行收入', amount: '85,200', percentage: 66 },
      { id: 2, name: '平台服务费', amount: '25,600', percentage: 20 },
      { id: 3, name: '其他收入', amount: '17,650', percentage: 14 }
    ],
    details: [
      {
        id: 1,
        type: 'income',
        icon: 'arrow_downward',
        title: '任务完成 - 红锦鲤放生活动',
        time: '2024-05-01 14:30',
        amount: '+¥2,580',
        amountType: 'income'
      },
      {
        id: 2,
        type: 'expense',
        icon: 'arrow_upward',
        title: '平台服务费 - 订单 #20240501',
        time: '2024-05-01 14:30',
        amount: '-¥258',
        amountType: 'expense'
      },
      {
        id: 3,
        type: 'income',
        icon: 'arrow_downward',
        title: '任务完成 - 白鹭保护巡护',
        time: '2024-04-28 10:15',
        amount: '+¥1,860',
        amountType: 'income'
      },
      {
        id: 4,
        type: 'expense',
        icon: 'arrow_upward',
        title: '提现手续费',
        time: '2024-04-27 16:20',
        amount: '-¥50',
        amountType: 'expense'
      },
      {
        id: 5,
        type: 'income',
        icon: 'arrow_downward',
        title: '任务完成 - 山林古道洒扫',
        time: '2024-04-25 09:00',
        amount: '+¥3,200',
        amountType: 'income'
      }
    ]
  },

  onLoad() {
    // 加载财务数据
    this.loadFinancialData();
  },

  // 加载财务数据
  loadFinancialData() {
    // TODO: 调用云函数获取财务数据
    // [CLEANED] console.log('加载财务数据');
  },

  // 切换时间周期
  changePeriod(e) {
    const period = e.currentTarget.dataset.period;
    this.setData({ period });
    this.loadFinancialData();
  },

  // 导出报表
  exportReport() {
    wx.showActionSheet({
      itemList: ['导出 Excel', '导出 PDF', '发送邮件'],
      success: (res) => {
        // [CLEANED] console.log('导出报表', res.tapIndex);
      }
    });
  },

  // 切换菜单
  toggleMenu() {
    // [CLEANED] console.log('切换菜单');
  },

  // 筛选类型
  filterType() {
    wx.showActionSheet({
      itemList: ['全部', '收入', '支出', '待结算'],
      success: (res) => {
        // [CLEANED] console.log('筛选类型', res.tapIndex);
      }
    });
  }
});
