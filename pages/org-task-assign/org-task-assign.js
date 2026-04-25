// 清如 ClearSpring - 机构任务分配页 V-06
/**
 * @file 机构任务分配页面
 * @description 分配任务给志愿者
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');
const { debounce } = require('../../utils/debounce');

Page({
  data: {
    orderInfo: null,
    filterType: 'all',
    volunteers: [],
    assignmentHistory: [],
    loading: false,
    hasMore: true
  },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },

  onLoad(options) {
    if (options.orderId) { this.loadOrderInfo(options.orderId); }
    if (options.volunteerId) { this.highlightVolunteer(options.volunteerId); }
  },

  onPullDownRefresh() { this.loadVolunteers().then(() => wx.stopPullDownRefresh()); },

  /**
   * 加载订单信息
   * @async
   * @param {string} orderId - 订单 ID
   */
  async loadOrderInfo(orderId) {
    try {
      const mockOrder = {
        orderNo: 'ORD20260412001', status: 'pending', statusText: '待分配',
        speciesName: '鲫鱼', speciesQuantity: '50', speciesUnit: '斤',
        waterArea: '太湖', executeDate: '2026-04-13', amount: '299.00'
      };
      this.setData({ orderInfo: mockOrder });
    } catch (error) {
      console.error('加载订单信息失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'loadOrderInfo', showToast: false });
    }
  },

  /**
   * 加载志愿者列表
   * @async
   */
  async loadVolunteers() {
    this.setData({ loading: true });
    try {
      await new Promise((resolve) => setTimeout(() => { this.setData({ loading: false }); resolve(); }, 500));
    } catch (error) {
      console.error('加载志愿者列表失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'loadVolunteers', showToast: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.filterVolunteers(type);
  },

  filterVolunteers(type) {
    const filtered = type === 'all' ? this.data.volunteers : this.data.volunteers.filter(v => v.status === type);
    this.setData({ volunteers: filtered });
  },

  onRefresh() { this.loadVolunteers(); wx.showToast({ title: '已刷新', icon: 'success' }); },
  onLoadMore() { if (this.data.hasMore && !this.data.loading) { this.loadMoreVolunteers(); } },

  async loadMoreVolunteers() {
    this.setData({ loading: true });
    try {
      await new Promise((resolve) => setTimeout(() => { this.setData({ loading: false, hasMore: false }); resolve(); }, 500));
    } catch (error) {
      console.error('加载更多失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'loadMoreVolunteers', showToast: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  onViewDetail(e) { wx.navigateTo({ url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=' + e.currentTarget.dataset.id }); },

  /**
   * 分配志愿者（防抖处理）
   * @param {Event} e - 点击事件
   */
  onAssignVolunteer(e) {
    const volunteerId = e.currentTarget.dataset.id;
    const volunteer = this.data.volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    wx.showModal({
      title: '确认分配',
      content: `确定要将任务分配给 ${volunteer.name} 吗？`,
      confirmText: '分配',
      confirmColor: '#4A5D4E',
      success: (res) => { if (res.confirm) { this.doAssignVolunteer(volunteerId); } }
    });
  },

  /**
   * 执行分配
   * @async
   * @param {string} volunteerId - 志愿者 ID
   */
  async doAssignVolunteer(volunteerId) {
    try {
      ErrorHandler.showLoading('分配中...');
      // TODO: 调用云函数分配任务
      wx.showToast({ title: '分配成功', icon: 'success' });
      
      const newRecord = {
        id: 'assign_' + Date.now(),
        volunteerName: this.data.volunteers.find(v => v.id === volunteerId)?.name || '未知',
        assignTime: this.formatDate(new Date()),
        status: 'pending',
        statusText: '待接受'
      };
      
      this.setData({ assignmentHistory: [newRecord, ...this.data.assignmentHistory] });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (error) {
      console.error('分配任务失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'doAssignVolunteer', showToast: true });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  highlightVolunteer(volunteerId) { // [CLEANED] console.log('高亮志愿者:', volunteerId); },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});
