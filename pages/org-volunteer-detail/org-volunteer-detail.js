// 清如 ClearSpring - 机构志愿者详情页 V-05
/**
 * @file 机构志愿者详情页面
 * @description 查看志愿者详细信息、服务记录、评价
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    volunteerInfo: {
      id: 'vol_001', volunteerNo: 'V2025001', name: '李明', avatar: 'https://example.com/avatar.jpg',
      verified: true, level: 5, status: 'active', statusText: '可接单', gender: '男', age: 28,
      location: '江苏省苏州市', registerDate: '2025-03-15', serviceDays: 128, completedOrders: 56,
      rating: 98, totalHours: 256, skills: ['护生执行', '活动组织', '摄影记录'], phone: '138****5678'
    },
    certificates: [],
    serviceHistory: [],
    reviews: []
  },

  onLoad(options) {
    if (options.volunteerId) { this.loadVolunteerDetail(options.volunteerId); }
    else { this.loadMockData(); }
  },

  onPullDownRefresh() { this.loadVolunteerDetail(this.data.volunteerInfo.id).then(() => wx.stopPullDownRefresh()); },

  /**
   * 加载志愿者详情
   * @async
   * @param {string} volunteerId - 志愿者 ID
   */
  async loadVolunteerDetail(volunteerId) {
    try {
      ErrorHandler.showLoading('加载中...');
      // TODO: 调用云函数获取志愿者详情
      await new Promise((resolve) => setTimeout(() => resolve(), 300));
    } catch (error) {
      console.error('加载志愿者详情失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'loadVolunteerDetail', showToast: true });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  loadMockData() { /* 数据已在 data 中初始化 */ },

  onContactVolunteer() {
    if (this.data.volunteerInfo.phone) { wx.makePhoneCall({ phoneNumber: this.data.volunteerInfo.phone }); }
    else { wx.showToast({ title: '暂无联系方式', icon: 'none' }); }
  },

  onAssignTask() { wx.navigateTo({ url: '/pages/org-task-assign/org-task-assign?volunteerId=' + this.data.volunteerInfo.id }); },
  onViewAllHistory() { wx.navigateTo({ url: '/pages/org-volunteer-history/org-volunteer-history?volunteerId=' + this.data.volunteerInfo.id }); },
  onViewResume() { wx.showToast({ title: '简历查看功能开发中', icon: 'none' }); }
});
