// 清如 ClearSpring - 公告管理页面

Page({
  data: {
    notices: [
      {
        id: 1,
        title: '关于规范护生行为的公告',
        publishTime: '2026-04-01',
        status: 1,
        statusName: '已发布'
      },
      {
        id: 2,
        title: '春季护生活动通知',
        publishTime: '2026-03-28',
        status: 1,
        statusName: '已发布'
      },
      {
        id: 3,
        title: '新增物种投放指南',
        publishTime: '2026-03-25',
        status: 0,
        statusName: '草稿'
      },
      {
        id: 4,
        title: '护生活动安全须知',
        publishTime: '2026-03-20',
        status: 2,
        statusName: '已下架'
      }
    ]
  },

  onLoad(options) {
    // [CLEANED] console.log('公告管理页面加载');
    this.loadNotices();
  },

  onShow() {
    this.refreshNotices();
  },

  onPullDownRefresh() {
    this.refreshNotices().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  
  async loadNotices() {
    try {
      // TODO: 实际从云函数获取公告列表
      // [CLEANED] console.log('加载公告列表');
    } catch (error) {
      console.error('加载公告列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshNotices() {
    try {
      // TODO: 实际从云函数刷新公告列表
      await new Promise(resolve => setTimeout(resolve, 500));
      // [CLEANED] console.log('公告列表刷新完成');
    } catch (error) {
      console.error('刷新公告列表失败:', error);
    }
  },

  // ========== 事件处理 ==========
  
  // 点击公告卡片
  onNoticeTap(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('点击公告:', id);
    
    wx.navigateTo({
      url: `/pages/admin/content/notice-detail?id=${id}`
    });
  },

  // 编辑公告
  onEditNotice(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('编辑公告:', id);
    
    wx.navigateTo({
      url: `/pages/admin/content/notice-edit?id=${id}&action=edit`
    });
  },

  // 删除公告
  onDeleteNotice(e) {
    const { id, title } = e.currentTarget.dataset;
    // [CLEANED] console.log('删除公告:', id, title);
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除公告"${title}"吗？此操作不可恢复。`,
      confirmColor: '#D4B87B',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用删除 API
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          
          // 从列表中移除
          const newNotices = this.data.notices.filter(item => item.id !== id);
          this.setData({
            notices: newNotices
          });
        }
      }
    });
  },

  // 上架公告
  onPublishNotice(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('上架公告:', id);
    
    wx.showModal({
      title: '确认上架',
      content: '确定要上架此公告吗？',
      confirmColor: '#D4B87B',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用上架 API
          wx.showToast({
            title: '上架成功',
            icon: 'success'
          });
          
          // 更新状态
          const notice = this.data.notices.find(item => item.id === id);
          if (notice) {
            notice.status = 1;
            notice.statusName = '已发布';
            this.setData({
              notices: [...this.data.notices]
            });
          }
        }
      }
    });
  },

  // 下架公告
  onUnpublishNotice(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('下架公告:', id);
    
    wx.showModal({
      title: '确认下架',
      content: '确定要下架此公告吗？',
      confirmColor: '#D4B87B',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用下架 API
          wx.showToast({
            title: '下架成功',
            icon: 'success'
          });
          
          // 更新状态
          const notice = this.data.notices.find(item => item.id === id);
          if (notice) {
            notice.status = 2;
            notice.statusName = '已下架';
            this.setData({
              notices: [...this.data.notices]
            });
          }
        }
      }
    });
  },

  // 新增公告
  onAddNotice() {
    wx.navigateTo({
      url: '/pages/admin/content/notice-edit?action=add'
    });
  },

  // 查看详情
  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/content/notice-detail?id=${id}`
    });
  }
});
