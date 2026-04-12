// 清如 ClearSpring - 机构志愿者管理页
/**
 * @file 机构志愿者管理页面
 * @description 管理志愿者列表、邀请码、志愿者操作
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');

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

  /**
   * 页面加载
   */
  onLoad() {
    console.log('志愿者管理页加载');
    this.loadVolunteers();
  },

  /**
   * 页面显示
   */
  onShow() {
    this.refreshVolunteers();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.refreshVolunteers().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载志愿者列表
   * @async
   * @returns {Promise<void>}
   */
  async loadVolunteers() {
    try {
      ErrorHandler.showLoading('加载中...');
      
      const res = await wx.cloud.callFunction({
        name: 'volunteer-list',
        data: { 
          orgId: this.data.orgId || 'org_001',
          filterRegion: this.data.filterRegion,
          filterCompliance: this.data.filterCompliance,
          timestamp: Date.now()
        }
      });
      
      if (res.result && res.result.code === 0 && res.result.data) {
        const volunteers = res.result.data.volunteers || [];
        const stats = res.result.data.stats || {};
        this.setData({ 
          volunteers: volunteers,
          stats: {
            totalVolunteers: stats.total || volunteers.length,
            activeVolunteers: stats.active || 0,
            totalTasks: stats.totalTasks || 0
          },
          isEmpty: volunteers.length === 0,
          loading: false
        });
        ErrorHandler.hideLoading();
      } else {
        throw new Error(res.result?.msg || '志愿者加载失败');
      }
    } catch (error) {
      console.error('加载志愿者失败:', error);
      ErrorHandler.hideLoading();
      wx.showToast({
        title: error.message || '加载失败，请重试',
        icon: 'none',
        duration: 2000
      });
      
      // 记录错误日志
      wx.cloud.callFunction({
        name: 'log-error',
        data: { 
          error: error.message, 
          page: 'org-home-volunteers',
          timestamp: Date.now()
        }
      });
      
      this.setData({ 
        volunteers: [],
        isEmpty: true,
        loading: false 
      });
    }
  },

  /**
   * 刷新志愿者
   * @async
   * @returns {Promise<void>}
   */
  async refreshVolunteers() {
    try {
      ErrorHandler.showLoading('刷新中...');
      await this.loadVolunteers();
      ErrorHandler.hideLoading();
      console.log('志愿者刷新完成');
    } catch (error) {
      ErrorHandler.hideLoading();
      console.error('刷新志愿者失败:', error);
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
  },

  /**
   * 生成邀请码
   */
  onGenerateInvite() {
    this.setData({ showInviteModal: true });
  },

  /**
   * 关闭邀请码弹窗
   */
  onCloseInviteModal() {
    this.setData({ showInviteModal: false });
  },

  /**
   * 复制邀请码
   */
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

  /**
   * 分享邀请
   */
  onShareInvite() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 切换筛选栏
   */
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  /**
   * 筛选区域变化
   * @param {Event} e - 事件对象
   */
  onFilterRegionChange(e) {
    this.setData({
      filterRegion: e.detail.value
    });
  },

  /**
   * 筛选合规率变化
   * @param {Event} e - 事件对象
   */
  onFilterComplianceChange(e) {
    this.setData({
      filterCompliance: e.detail.value
    });
  },

  /**
   * 应用筛选
   */
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

  /**
   * 重置筛选
   */
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

  /**
   * 志愿者操作
   * @param {Event} e - 点击事件
   */
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

  /**
   * 查看志愿者详情
   * @param {Object} volunteer - 志愿者信息
   */
  viewVolunteerDetail(volunteer) {
    wx.navigateTo({
      url: `/pages/org-home/volunteer-detail?id=${volunteer.id}`
    });
  },

  /**
   * 分配任务给志愿者
   * @param {Object} volunteer - 志愿者信息
   */
  assignTaskToVolunteer(volunteer) {
    wx.navigateTo({
      url: `/pages/org-home/assign-task?volunteerId=${volunteer.id}`
    });
  },

  /**
   * 解绑志愿者
   * @param {Object} volunteer - 志愿者信息
   */
  unbindVolunteer(volunteer) {
    wx.showModal({
      title: '解绑志愿者',
      content: `确定要解绑志愿者 ${volunteer.name} 吗？`,
      confirmText: '解绑',
      confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
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

  /**
   * 拉黑志愿者
   * @param {Object} volunteer - 志愿者信息
   */
  blacklistVolunteer(volunteer) {
    wx.showModal({
      title: '拉黑志愿者',
      content: `确定要将 ${volunteer.name} 加入黑名单吗？拉黑后将无法再接收平台任务。`,
      confirmText: '拉黑',
      confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
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

  /**
   * 分享
   * @returns {Object} 分享配置
   */
  onShareAppMessage() {
    return {
      title: '加入清如志愿者团队',
      path: `/pages/protect/register?inviteCode=${this.data.inviteCode}`
    };
  }
});
