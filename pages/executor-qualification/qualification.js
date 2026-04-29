// 资质审核 - O-02
Page({
  data: {
    status: 'reviewing',
    progress: 60,
    steps: [
      { label: '已提交', completed: true },
      { label: '初审中', completed: true },
      { label: '复审', active: true },
      { label: '完成', completed: false }
    ],
    info: {
      type: '高级执行者',
      applyDate: '2024-11-01',
      certificateNo: 'EXE-2024-8892',
      serviceArea: '杭州地区'
    },
    materials: [
      { name: '身份证明', status: 'approved', icon: 'description' },
      { name: '资质证书', status: 'approved', icon: 'description' },
      { name: '培训记录', status: 'reviewing', icon: 'description' }
    ]
  },

  onLoad() {
    // 页面加载
  },

  onShow() {
    // 页面显示
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 更多操作
  onMore() {
    wx.showActionSheet({
      itemList: ['查看帮助', '联系客服'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '查看帮助', icon: 'none' });
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '联系客服', icon: 'none' });
        }
      }
    });
  }
});
