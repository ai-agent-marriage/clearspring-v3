// 清如 ClearSpring - 执行者审核状态页逻辑

Page({
  data: {
    // 审核状态：pending(审核中), approved(通过), rejected(驳回), need 补充 (需补充)
    auditStatus: 'pending',
    statusClass: 'pending',
    statusTitle: '审核中',
    statusDesc: '您的资料已提交，正在审核中',
    
    // 进度
    currentStep: 2,
    progressPercent: 50,
    
    // 审核时间
    auditTime: '2026-03-28 14:30',
    
    // 驳回原因
    rejectReason: '身份证照片不够清晰，请重新拍摄并确保四个角都完整可见。手持身份证照片需要露出完整面部。',
    
    // 时间线
    timeline: [
      { id: 1, event: '提交资质审核', time: '2026-03-27 10:30', status: 'completed' },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
      { id: 2, event: '审核中', time: '2026-03-27 15:20', status: 'active' },
      { id: 3, event: '审核完成', time: '-', status: 'pending' }
    ]
  },

  onLoad(options) {
    // 从上个页面获取审核状态
    const status = options.status || 'pending';
    this.loadAuditStatus(status);
  },

  onShow() {
    // 页面显示时刷新状态
    this.refreshStatus();
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.refreshStatus();
  },

  // ========== 加载审核状态 ==========
  loadAuditStatus(status) {
    let statusData = {};
    
    switch(status) {
      case 'pending':
        statusData = {
          auditStatus: 'pending',
          statusClass: 'pending',
          statusTitle: '审核中',
          statusDesc: '您的资料已提交，正在审核中',
          currentStep: 2,
          progressPercent: 50
        };
        break;
      
      case 'approved':
        statusData = {
          auditStatus: 'approved',
          statusClass: 'approved',
          statusTitle: '审核通过',
          statusDesc: '恭喜您成为认证执行者',
          currentStep: 3,
          progressPercent: 100,
          timeline: [
            { id: 1, event: '提交资质审核', time: '2026-03-25 10:30', status: 'completed' },
            { id: 2, event: '开始审核', time: '2026-03-25 15:20', status: 'completed' },
            { id: 3, event: '审核通过', time: '2026-03-26 09:15', status: 'completed' }
          ]
        };
        break;
      
      case 'rejected':
        statusData = {
          auditStatus: 'rejected',
          statusClass: 'rejected',
          statusTitle: '审核未通过',
          statusDesc: '请根据审核意见修改后重新提交',
          currentStep: 2,
          progressPercent: 50
        };
        break;
      
      case 'need 补充':
        statusData = {
          auditStatus: 'need 补充',
          statusClass: 'need 补充',
          statusTitle: '需补充材料',
          statusDesc: '请补充相关材料后重新提交',
          currentStep: 2,
          progressPercent: 50
        };
        break;
    }
    
    this.setData(statusData);
  },

  // ========== 刷新状态 ==========
  refreshStatus() {
    wx.showLoading({ title: '刷新中...' });
    
    // TODO: 实际项目中调用云函数获取最新状态
    // wx.cloud.callFunction({
    //   name: 'getAuditStatus'
    // })
    
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      
      // 模拟状态更新
      wx.showToast({
        title: '已更新',
        icon: 'success'
      });
    }, 1000);
  },

  // ========== 事件处理 ==========
  onModify() {
    // 修改重新提交
    wx.navigateTo({
      url: '/pages/executor-qualification/executor-qualification?modify=true'
    });
  },

  onStartOrder() {
    // 开始接单
    wx.switchTab({
      url: '/pages/executor-home/executor-home'
    });
  },

  onContactService() {
    // 联系客服
    wx.makePhoneCall({
      phoneNumber: '400-xxx-xxxx',
      fail: () => {
        wx.showToast({
          title: '拨打失败',
          icon: 'none'
        });
      }
    });
  },

  onRefresh() {
    // 刷新状态
    this.refreshStatus();
  }
});
