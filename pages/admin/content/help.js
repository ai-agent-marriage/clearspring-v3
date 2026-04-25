// 清如 ClearSpring - 帮助文档管理页面

Page({
  data: {
    helpDocs: [
      {
        id: 1,
        title: '如何参与护生活动',
        category: '护生指南',
        updateTime: '2026-04-01'
      },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
      {
        id: 2,
        title: '物种投放注意事项',
        category: '护生指南',
        updateTime: '2026-03-28'
      },
      {
        id: 3,
        title: '常见问题解答',
        category: 'FAQ',
        updateTime: '2026-03-25'
      },
      {
        id: 4,
        title: '志愿者认证流程',
        category: '志愿者',
        updateTime: '2026-03-20'
      },
      {
        id: 5,
        title: '订单执行规范',
        category: '执行者',
        updateTime: '2026-03-15'
      }
    ]
  },

  onLoad(options) {
    // [CLEANED] console.log('帮助文档管理页面加载');
    this.loadHelpDocs();
  },

  onShow() {
    this.refreshHelpDocs();
  },

  onPullDownRefresh() {
    this.refreshHelpDocs().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  
  async loadHelpDocs() {
    try {
      // TODO: 实际从云函数获取帮助文档列表
      // [CLEANED] console.log('加载帮助文档列表');
    } catch (error) {
      console.error('加载帮助文档列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshHelpDocs() {
    try {
      // TODO: 实际从云函数刷新帮助文档列表
      await new Promise(resolve => setTimeout(resolve, 500));
      // [CLEANED] console.log('帮助文档列表刷新完成');
    } catch (error) {
      console.error('刷新帮助文档列表失败:', error);
    }
  },

  // ========== 事件处理 ==========
  
  // 点击文档卡片
  onDocTap(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('点击文档:', id);
    
    wx.navigateTo({
      url: `/pages/admin/content/help-detail?id=${id}`
    });
  },

  // 编辑文档
  onEditDoc(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('编辑文档:', id);
    
    wx.navigateTo({
      url: `/pages/admin/content/help-edit?id=${id}&action=edit`
    });
  },

  // 删除文档
  onDeleteDoc(e) {
    const { id, title } = e.currentTarget.dataset;
    // [CLEANED] console.log('删除文档:', id, title);
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除文档"${title}"吗？此操作不可恢复。`,
      confirmColor: '#D4B87B',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用删除 API
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          
          // 从列表中移除
          const newHelpDocs = this.data.helpDocs.filter(item => item.id !== id);
          this.setData({
            helpDocs: newHelpDocs
          });
        }
      }
    });
  },

  // 新增文档
  onAddDoc() {
    wx.navigateTo({
      url: '/pages/admin/content/help-edit?action=add'
    });
  },

  // 查看详情
  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/content/help-detail?id=${id}`
    });
  }
});
