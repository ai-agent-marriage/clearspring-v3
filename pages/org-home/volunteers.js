// 清如 ClearSpring - 机构志愿者管理页

Page({
  data: {
    // 邀请码弹窗
    showInviteModal: false,
    inviteCode: 'VOL2026040701',
    
    // 筛选栏
    showFilter: false,
    filterRegion: '',
    filterCompliance: '',
    
    // 数据统计
    stats: {
      totalVolunteers: 25,
      activeVolunteers: 18,
      totalTasks: 156
    },
    
    // 志愿者列表
    volunteers: [
      {
        id: 1,
        name: '张三',
        certified: true,
        region: '广州',
        totalTasks: 15,
        complianceRate: 98,
        actions: ['详情', '分配', '解绑']
      },
      {
        id: 2,
        name: '李四',
        certified: true,
        region: '深圳',
        totalTasks: 22,
        complianceRate: 95,
        actions: ['详情', '分配', '解绑']
      },
      {
        id: 3,
        name: '王五',
        certified: false,
        region: '珠海',
        totalTasks: 5,
        complianceRate: 100,
        actions: ['详情', '分配']
      }
    ],
    
    // 空状态
    isEmpty: false
  },

  onLoad(options) {
    console.log('志愿者管理页加载');
    this.loadVolunteers();
  },

  onShow() {
    this.refreshVolunteers();
  },

  onPullDownRefresh() {
    this.refreshVolunteers().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  async loadVolunteers() {
    try {
      // TODO: 实际从云函数获取志愿者列表
      console.log('加载志愿者列表');
    } catch (error) {
      console.error('加载志愿者失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshVolunteers() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('志愿者刷新完成');
    } catch (error) {
      console.error('刷新志愿者失败:', error);
    }
  },

  // ========== 邀请码 ==========
  onGenerateInvite() {
    this.setData({ showInviteModal: true });
  },

  onCloseInviteModal() {
    this.setData({ showInviteModal: false });
  },

  onCopyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => {
        wx.showToast({
          title: '已复制邀请码',
          icon: 'success'
        });
        this.setData({ showInviteModal: false });
      }
    });
  },

  onShareInvite() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // ========== 筛选栏 ==========
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  onFilterRegionChange(e) {
    this.setData({
      filterRegion: e.detail.value
    });
  },

  onFilterComplianceChange(e) {
    this.setData({
      filterCompliance: e.detail.value
    });
  },

  onApplyFilter() {
    console.log('应用筛选:', {
      region: this.data.filterRegion,
      compliance: this.data.filterCompliance
    });
    this.setData({ showFilter: false });
    wx.showToast({
      title: '筛选已应用',
      icon: 'success'
    });
  },

  onResetFilter() {
    this.setData({
      filterRegion: '',
      filterCompliance: ''
    });
    wx.showToast({
      title: '已重置筛选',
      icon: 'none'
    });
  },

  // ========== 志愿者操作 ==========
  onVolunteerAction(e) {
    const { action, volunteer } = e.currentTarget.dataset;
    console.log('志愿者操作:', action, volunteer);
    
    switch (action) {
      case 'detail':
        this.viewVolunteerDetail(volunteer);
        break;
      case 'assign':
        this.assignTaskToVolunteer(volunteer);
        break;
      case 'unbind':
        this.unbindVolunteer(volunteer);
        break;
      case 'blacklist':
        this.blacklistVolunteer(volunteer);
        break;
    }
  },

  // 查看详情
  viewVolunteerDetail(volunteer) {
    wx.navigateTo({
      url: `/pages/org-home/volunteer-detail?id=${volunteer.id}`
    });
  },

  // 分配任务
  assignTaskToVolunteer(volunteer) {
    wx.navigateTo({
      url: `/pages/org-home/assign-task?volunteerId=${volunteer.id}`
    });
  },

  // 解绑志愿者
  unbindVolunteer(volunteer) {
    wx.showModal({
      title: '解绑志愿者',
      content: `确定要解绑志愿者 ${volunteer.name} 吗？`,
      confirmText: '解绑',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已解绑',
            icon: 'success'
          });
        }
      }
    });
  },

  // 拉黑志愿者
  blacklistVolunteer(volunteer) {
    wx.showModal({
      title: '拉黑志愿者',
      content: `确定要将 ${volunteer.name} 加入黑名单吗？拉黑后将无法再接收平台任务。`,
      confirmText: '拉黑',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已拉黑',
            icon: 'success'
          });
        }
      }
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '加入清如志愿者团队',
      path: `/pages/protect/register?inviteCode=${this.data.inviteCode}`
    };
  }
});
