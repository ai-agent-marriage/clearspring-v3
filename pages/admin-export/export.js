const auth = require('../../utils/auth');

// 数据导出
Page({
  data: {
    dataType: 'order',
    timeRange: 'month',
    startDate: '2024-04-01',
    endDate: '2024-05-01',
    exportFormat: 'excel',
    canExport: true,
    previewData: [
      { id: 1, orderNo: 'ORD-20240501-001', type: '任务收入', amount: '¥2,580', time: '2024-05-01' },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
      { id: 2, orderNo: 'ORD-20240428-002', type: '任务收入', amount: '¥1,860', time: '2024-04-28' },
      { id: 3, orderNo: 'ORD-20240425-003', type: '任务收入', amount: '¥3,200', time: '2024-04-25' },
      { id: 4, orderNo: 'ORD-20240420-004', type: '服务费', amount: '¥258', time: '2024-04-20' },
      { id: 5, orderNo: 'ORD-20240415-005', type: '任务收入', amount: '¥4,500', time: '2024-04-15' }
    ]
  },

  onLoad() {
    // 【安全修复】验证管理员登录状态
    if (!auth.requireAdminAuth(this)) { return; }

    // 页面加载
  },

  // 选择数据类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ dataType: type });
    this.loadPreviewData();
  },

  // 选择时间范围
  selectTimeRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ timeRange: range });
  },

  // 开始日期改变
  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
  },

  // 结束日期改变
  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
  },

  // 选择导出格式
  selectFormat(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({ exportFormat: format });
  },

  // 加载预览数据
  loadPreviewData() {
    // TODO: 根据数据类型加载预览数据
    // [CLEANED] console.log('加载预览数据', this.data.dataType);
  },

  // 开始导出
  startExport() {
    const { dataType, timeRange, startDate, endDate, exportFormat } = this.data;
    
    wx.showLoading({ title: '正在导出数据...' });
    
    // TODO: 调用云函数导出数据
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出成功',
        content: `数据已导出为 .${exportFormat} 文件，可在下载记录中查看`,
        showCancel: false
      });
    }, 2000);
  },

  // 导出历史
  exportHistory() {
    wx.navigateTo({
      url: '/pages/admin-export-history/history'
    });
  },

  // 切换菜单
  toggleMenu() {
    // [CLEANED] console.log('切换菜单');
  }
});
