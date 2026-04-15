// 清如 ClearSpring - 收入管理页逻辑

Page({
  data: {
    // 收入数据
    totalIncome: '12,580.00',
    pendingAmount: '2,300.00',
    withdrawableAmount: '8,500.00',
    
    // 概览数据
    currentTab: 'month',
    overview: {
      completed: 45,
      hours: 126,
      rating: 4.9,
      rate: '98%'
    },
    
    // 交易记录
    transactions: [
      {
        id: 1,
        type: 'income',
        title: '心理疏导服务 - 李女士',
        amount: '+200.00',
        amountClass: 'positive',
        time: '2026-03-28 15:30',
        status: 'completed',
        statusText: '已完成'
      },
      {
        id: 2,
        type: 'income',
        title: '法律咨询服务 - 王先生',
        amount: '+300.00',
        amountClass: 'positive',
        time: '2026-03-28 14:00',
        status: 'pending',
        statusText: '待结算'
      },
      {
        id: 3,
        type: 'withdraw',
        title: '提现到银行卡',
        amount: '-5,000.00',
        amountClass: 'negative',
        time: '2026-03-27 10:00',
        status: 'completed',
        statusText: '已到账'
      },
      {
        id: 4,
        type: 'income',
        title: '职业规划咨询 - 张女士',
        amount: '+250.00',
        amountClass: 'positive',
        time: '2026-03-26 16:30',
        status: 'completed',
        statusText: '已完成'
      },
      {
        id: 5,
        type: 'refund',
        title: '订单取消退款',
        amount: '-150.00',
        amountClass: 'negative',
        time: '2026-03-25 09:00',
        status: 'completed',
        statusText: '已退款'
      }
    ],
    
    loading: false,
    noMore: false,
    page: 1
  },

  onLoad(options) {
    this.loadIncomeData();
  },

  onShow() {
    this.refreshData();
  },

  onReachBottom() {
    if (!this.data.loading && !this.data.noMore) {
      this.loadMore();
    }
  },

  onPullDownRefresh() {
    this.refreshData();
  },

  // ========== 加载数据 ==========
  loadIncomeData() {
    // TODO: 调用云函数获取收入数据
    // wx.cloud.callFunction({
    //   name: 'getIncomeData'
    // })
    // [CLEANED] console.log('加载收入数据');
  },

  // ========== 刷新数据 ==========
  refreshData() {
    wx.showLoading({ title: '刷新中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '已更新',
        icon: 'success'
      });
    }, 1000);
  },

  // ========== 加载更多 ==========
  loadMore() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      this.setData({
        loading: false,
        page: this.data.page + 1,
        noMore: this.data.page >= 5
      });
    }, 1000);
  },

  // ========== 切换 Tab ==========
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    
    // 根据 Tab 加载不同时间段的数据
    this.loadIncomeData();
  },

  // ========== 筛选 ==========
  onFilterType() {
    const types = ['全部类型', '服务收入', '提现', '退款'];
    wx.showActionSheet({
      itemList: types,
      success: (res) => {
        // [CLEANED] console.log('选择类型:', types[res.tapIndex]);
        // TODO: 根据类型筛选
      }
    });
  },

  onFilterStatus() {
    const statuses = ['全部状态', '已完成', '待结算', '失败'];
    wx.showActionSheet({
      itemList: statuses,
      success: (res) => {
        // [CLEANED] console.log('选择状态:', statuses[res.tapIndex]);
        // TODO: 根据状态筛选
      }
    });
  },

  // ========== 提现 ==========
  onWithdraw() {
    if (this.data.withdrawableAmount <= 0) return;
    
    wx.navigateTo({
      url: `/pages/executor-withdraw/executor-withdraw?amount=${this.data.withdrawableAmount}`
    });
  },

  // ========== 交易详情 ==========
  onTransactionDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/executor-transaction-detail/executor-transaction-detail?id=${id}`
    });
  }
});
