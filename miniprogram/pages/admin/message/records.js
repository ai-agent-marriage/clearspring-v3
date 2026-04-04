// pages/admin/message/records.js
Page({
  data: {
    showFilter: false,
    filterDateRange: '近 7 天',
    filterType: 'all',
    filterStatus: 'all',
    records: [],
    filteredRecords: [],
    loading: false,
    refreshing: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    dateRangeOptions: ['近 7 天', '近 30 天', '近 3 个月', '自定义'],
    typeOptions: [
      { label: '全部', value: 'all' },
      { label: '订单通知', value: 'order' },
      { label: '系统通知', value: 'system' },
      { label: '营销消息', value: 'marketing' }
    ],
    statusOptions: [
      { label: '全部', value: 'all' },
      { label: '成功', value: 'success' },
      { label: '失败', value: 'failed' },
      { label: '发送中', value: 'sending' }
    ],
    exporting: false,
    exportProgress: 0
  },

  onLoad() {
    this.loadRecords();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
    this.loadRecords(true).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    });
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.loadMore();
    }
  },

  // 加载消息记录（分页加载）
  loadRecords(refresh = false) {
    if (this.data.loading) return Promise.resolve();
    
    this.setData({ loading: true });
    
    return new Promise((resolve) => {
      // wx.cloud.callFunction({
      //   name: 'getMessageRecords',
      //   data: {
      //     page: this.data.page,
      //     pageSize: this.data.pageSize,
      //     dateRange: this.data.filterDateRange,
      //     type: this.data.filterType,
      //     status: this.data.filterStatus
      //   },
      //   success: (res) => {
      //     const { data, hasMore } = res.result
      //     const records = refresh ? data : [...this.data.records, ...data]
      //     this.setData({
      //       records,
      //       filteredRecords: records,
      //       hasMore,
      //       page: this.data.page + 1,
      //       loading: false
      //     })
      //     resolve()
      //   },
      //   fail: () => {
      //     wx.showToast({ title: '加载失败', icon: 'none' })
      //     this.setData({ loading: false })
      //     resolve()
      //   }
      // })
      
      // 模拟数据
      setTimeout(() => {
        const mockRecords = [
          {
            id: Date.now() - Math.random() * 1000000,
            title: '订单创建通知',
            recipient: '张三',
            sendTime: '2026-04-07 10:00:00',
            status: 1,
            statusName: '成功',
            content: '您有新的护生订单，订单号：PRO202604070001',
            templateId: 'ORDER_CREATE'
          },
          {
            id: Date.now() - Math.random() * 1000000,
            title: '订单完成通知',
            recipient: '李四',
            sendTime: '2026-04-07 09:30:00',
            status: 1,
            statusName: '成功',
            content: '您的护生订单已完成，感谢您的参与！',
            templateId: 'ORDER_COMPLETE'
          },
          {
            id: Date.now() - Math.random() * 1000000,
            title: '系统通知',
            recipient: '王五',
            sendTime: '2026-04-06 15:20:00',
            status: 0,
            statusName: '失败',
            content: '系统维护通知',
            templateId: 'SYSTEM_NOTIFY'
          },
          {
            id: Date.now() - Math.random() * 1000000,
            title: '订单创建通知',
            recipient: '赵六',
            sendTime: '2026-04-06 11:00:00',
            status: 1,
            statusName: '成功',
            content: '您有新的护生订单，订单号：PRO202604060001',
            templateId: 'ORDER_CREATE'
          },
          {
            id: Date.now() - Math.random() * 1000000,
            title: '订单取消通知',
            recipient: '孙七',
            sendTime: '2026-04-05 16:45:00',
            status: 1,
            statusName: '成功',
            content: '您的订单已取消，如有问题请联系客服',
            templateId: 'ORDER_CANCEL'
          }
        ];
        
        const records = refresh ? mockRecords : [...this.data.records, ...mockRecords];
        this.setData({
          records,
          filteredRecords: records,
          hasMore: this.data.page < 5,
          page: this.data.page + 1,
          loading: false
        });
        resolve();
      }, 500);
    });
  },

  // 加载更多
  loadMore() {
    this.loadRecords();
  },

  // 切换筛选栏
  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  // 日期范围选择
  onDateRangeChange(e) {
    const value = e.detail.value;
    const range = this.data.dateRangeOptions[value];
    this.setData({ filterDateRange: range });
  },

  // 消息类型选择
  onTypeChange(e) {
    const value = e.detail.value;
    this.setData({ filterType: value });
  },

  // 发送状态选择
  onStatusChange(e) {
    const value = e.detail.value;
    this.setData({ filterStatus: value });
  },

  // 应用筛选（实时筛选）
  applyFilter() {
    this.setData({ showFilter: false, page: 1, hasMore: true });
    this.loadRecords(true);
    
    wx.showToast({ title: '筛选完成', icon: 'success' });
  },

  // 重置筛选
  resetFilter() {
    this.setData({
      filterDateRange: '近 7 天',
      filterType: 'all',
      filterStatus: 'all'
    });
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.filteredRecords[index];
    
    wx.vibrateShort({ type: 'light' });
    
    wx.showModal({
      title: record.title,
      content: record.content,
      showCancel: false,
      confirmText: '关闭',
      confirmColor: '#4A5D4E'
    });
  },

  // 重新发送
  resend(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.filteredRecords[index];
    
    wx.vibrateShort({ type: 'medium' });
    
    wx.showModal({
      title: '重新发送',
      content: `将向"${record.recipient}"重新发送消息，是否继续？`,
      confirmColor: '#4A5D4E',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '发送中...' });
          
          // 模拟发送
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '发送成功', icon: 'success' });
            
            // 更新状态
            const key = `filteredRecords[${index}].status`;
            const statusNameKey = `filteredRecords[${index}].statusName`;
            this.setData({
              [key]: 1,
              [statusNameKey]: '成功'
            });
            
            // 同步到总记录
            const recordIndex = this.data.records.findIndex(r => r.id === record.id);
            if (recordIndex >= 0) {
              this.setData({
                [`records[${recordIndex}].status`]: 1,
                [`records[${recordIndex}].statusName`]: '成功'
              });
            }
          }, 1000);
        }
      }
    });
  },

  // 导出数据（进度提示）
  exportData() {
    if (this.data.exporting) return;
    
    wx.vibrateShort({ type: 'light' });
    
    wx.showModal({
      title: '导出数据',
      content: `将导出当前筛选条件下的 ${this.data.filteredRecords.length} 条记录为 Excel 文件，是否继续？`,
      confirmColor: '#4A5D4E',
      success: (res) => {
        if (res.confirm) {
          this.setData({ exporting: true, exportProgress: 0 });
          
          wx.showLoading({ title: '准备导出...', mask: true });
          
          // 模拟导出进度
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            this.setData({ exportProgress: progress });
            
            if (progress >= 100) {
              clearInterval(interval);
              wx.hideLoading();
              
              wx.showToast({
                title: '导出成功',
                icon: 'success',
                duration: 2000
              });
              
              this.setData({ exporting: false, exportProgress: 0 });
            } else {
              wx.showLoading({ 
                title: `导出中... ${progress}%`, 
                mask: true 
              });
            }
          }, 200);
          
          // wx.cloud.callFunction({
          //   name: 'exportMessageRecords',
          //   data: {
          //     dateRange: this.data.filterDateRange,
          //     type: this.data.filterType,
          //     status: this.data.filterStatus
          //   },
          //   success: (res) => {
          //     wx.hideLoading()
          //     wx.showToast({ title: '导出成功', icon: 'success' })
          //     this.setData({ exporting: false, exportProgress: 0 })
          //   },
          //   fail: () => {
          //     wx.hideLoading()
          //     wx.showToast({ title: '导出失败', icon: 'none' })
          //     this.setData({ exporting: false, exportProgress: 0 })
          //   }
          // })
        }
      }
    });
  },

  // 刷新筛选后的列表
  refreshFilteredRecords() {
    let filtered = [...this.data.records];
    
    // 按类型筛选
    if (this.data.filterType !== 'all') {
      filtered = filtered.filter(r => {
        if (this.data.filterType === 'order') {
          return r.templateId && r.templateId.includes('ORDER');
        } else if (this.data.filterType === 'system') {
          return r.templateId && r.templateId.includes('SYSTEM');
        }
        return true;
      });
    }
    
    // 按状态筛选
    if (this.data.filterStatus !== 'all') {
      const statusValue = this.data.filterStatus === 'success' ? 1 : 0;
      filtered = filtered.filter(r => r.status === statusValue);
    }
    
    this.setData({ filteredRecords: filtered });
  }
});
