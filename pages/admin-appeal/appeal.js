// 申诉仲裁页面
Page({
  data: {
    currentTab: 0,
    appeals: [
      {
        id: 'AP20240501',
        appealNo: '#AP20240501',
        orderNo: '#20240488',
        type: '订单取消争议',
        appellant: '清如公益中心',
        appellee: '西湖放生团队',
        reason: '被诉方未按约定时间到达放生地点，导致活动延期，要求退还部分费用并赔偿损失。',
        evidence: ['聊天记录截图', '现场照片', '付款凭证'],
        submitTime: '2024-05-01 16:30',
        status: 'pending'
      },
      {
        id: 'AP20240495',
        appealNo: '#AP20240495',
        orderNo: '#20240475',
        type: '服务质量投诉',
        appellant: '张先生',
        appellee: '灵隐寺文物保护委员会',
        reason: '认养的古树养护不到位，树叶枯黄，要求重新养护或退款。',
        progress: '已联系双方进行调解，等待现场核查',
        submitTime: '2024-04-25 10:15',
        status: 'processing'
      },
      {
        id: 'AP20240480',
        appealNo: '#AP20240480',
        orderNo: '#20240460',
        type: '退款申请',
        appellant: '李女士',
        appellee: '九溪放生点',
        result: '支持申诉方，责令被诉方全额退款，并扣除信用分 10 分。',
        closeTime: '2024-04-22 14:00',
        status: 'completed'
      }
    ]
  },

  onLoad() {
    // 加载申诉列表
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 显示筛选
  showFilter() {
    console.log('显示筛选');
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    console.log('搜索关键词:', keyword);
  },

  // 切换 Tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  // 驳回申诉
  rejectAppeal(e) {
    const appealId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认驳回',
      content: '请填写驳回原因',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          console.log('驳回申诉:', appealId, '原因:', res.content);
          wx.showToast({
            title: '已驳回',
            icon: 'success'
          });
        }
      }
    });
  },

  // 开始处理申诉
  processAppeal(e) {
    const appealId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-appeal/process?id=${appealId}`
    });
  },

  // 查看申诉详情
  viewAppealDetail(e) {
    const appealId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-appeal/detail?id=${appealId}`
    });
  }
});
