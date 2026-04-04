// pages/admin/feedback/manage.js
Page({
  data: {
    showFilter: false,
    filterType: 'all',
    filterStatus: 'all',
    feedbackList: [
      {
        id: 1,
        type: 'suggestion',
        typeName: '功能建议',
        title: '希望增加数据统计功能',
        submitTime: '2026-04-07 10:00:00',
        status: 1,
        statusName: '待处理'
      },
      {
        id: 2,
        type: 'bug',
        typeName: 'Bug 反馈',
        title: '订单页面加载失败',
        submitTime: '2026-04-07 09:30:00',
        status: 1,
        statusName: '待处理'
      },
      {
        id: 3,
        type: 'suggestion',
        typeName: '功能建议',
        title: '建议优化搜索功能',
        submitTime: '2026-04-06 16:20:00',
        status: 2,
        statusName: '已处理'
      },
      {
        id: 4,
        type: 'other',
        typeName: '其他',
        title: '其他问题反馈',
        submitTime: '2026-04-06 14:15:00',
        status: 2,
        statusName: '已处理'
      },
      {
        id: 5,
        type: 'bug',
        typeName: 'Bug 反馈',
        title: '支付页面闪退问题',
        submitTime: '2026-04-06 11:00:00',
        status: 1,
        statusName: '待处理'
      }
    ],
    filterTypes: [
      { value: 'all', label: '全部类型' },
      { value: 'suggestion', label: '功能建议' },
      { value: 'bug', label: 'Bug 反馈' },
      { value: 'other', label: '其他' }
    ],
    filterStatuses: [
      { value: 'all', label: '全部状态' },
      { value: '1', label: '待处理' },
      { value: '2', label: '已处理' }
    ],
    isLoading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad(options) {
    // 从 URL 参数获取筛选条件
    if (options.status === 'pending') {
      this.setData({
        filterStatus: '1'
      });
    }
    
    // 加载反馈列表
    this.loadFeedbackList();
  },

  onShow() {
    // 刷新列表
    this.loadFeedbackList();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      feedbackList: []
    });
    this.loadFeedbackList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadFeedbackList();
    }
  },

  // 切换筛选栏显示
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  // 选择反馈类型
  onTypeChange(e) {
    const { value } = e.detail;
    this.setData({
      filterType: value,
      page: 1,
      feedbackList: []
    });
    this.loadFeedbackList();
  },

  // 选择处理状态
  onStatusChange(e) {
    const { value } = e.detail;
    this.setData({
      filterStatus: value,
      page: 1,
      feedbackList: []
    });
    this.loadFeedbackList();
  },

  // 加载反馈列表
  loadFeedbackList() {
    this.setData({
      isLoading: true
    });

    return new Promise((resolve) => {
      // TODO: 替换为实际 API 调用
      // api.getFeedbackList({
      //   type: this.data.filterType,
      //   status: this.data.filterStatus,
      //   page: this.data.page,
      //   pageSize: this.data.pageSize
      // }).then(res => { ... })

      // 模拟数据加载
      setTimeout(() => {
        const newList = this.getFilteredList();
        const hasMore = newList.length >= this.data.page * this.data.pageSize;
        
        this.setData({
          feedbackList: this.data.page === 1 
            ? newList 
            : [...this.data.feedbackList, ...newList],
          isLoading: false,
          hasMore: hasMore,
          page: this.data.page + 1
        });
        resolve();
      }, 500);
    });
  },

  // 获取筛选后的列表
  getFilteredList() {
    let list = [...this.data.feedbackList];
    
    // 类型筛选
    if (this.data.filterType !== 'all') {
      list = list.filter(item => item.type === this.data.filterType);
    }
    
    // 状态筛选
    if (this.data.filterStatus !== 'all') {
      list = list.filter(item => item.status.toString() === this.data.filterStatus);
    }
    
    return list;
  },

  // 查看详情
  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/feedback/detail?id=${id}`
    });
  },

  // 处理反馈
  onProcess(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '处理反馈',
      content: '确认标记为已处理？',
      success: (res) => {
        if (res.confirm) {
          this.processFeedback(id);
        }
      }
    });
  },

  // 回复反馈
  onReply(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/feedback/reply?id=${id}`
    });
  },

  // 处理反馈
  processFeedback(id) {
    // TODO: 替换为实际 API 调用
    // api.processFeedback(id).then(res => { ... })

    // 模拟处理
    const list = this.data.feedbackList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 2,
          statusName: '已处理'
        };
      }
      return item;
    });

    this.setData({
      feedbackList: list
    });

    wx.showToast({
      title: '处理成功',
      icon: 'success'
    });
  },

  // 导出数据
  onExport() {
    wx.showModal({
      title: '导出数据',
      content: '将导出当前筛选条件下的所有反馈数据为 Excel 文件，是否继续？',
      success: (res) => {
        if (res.confirm) {
          this.exportFeedback();
        }
      }
    });
  },

  // 导出反馈
  exportFeedback() {
    wx.showLoading({
      title: '导出中...'
    });

    // TODO: 替换为实际 API 调用
    // api.exportFeedback({
    //   type: this.data.filterType,
    //   status: this.data.filterStatus
    // }).then(res => { ... })

    // 模拟导出
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '导出成功',
        icon: 'success'
      });
    }, 1500);
  },

  // 重置筛选
  onResetFilter() {
    this.setData({
      filterType: 'all',
      filterStatus: 'all',
      page: 1,
      feedbackList: []
    });
    this.loadFeedbackList();
  }
});
