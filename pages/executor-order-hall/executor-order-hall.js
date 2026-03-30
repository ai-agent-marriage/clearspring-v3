// 清如 ClearSpring - 抢单大厅逻辑

Page({
  data: {
    // 筛选条件
    filterType: '全部类型',
    filterDistance: '距离优先',
    filterPrice: '全部价格',
    
    // 订单列表
    orders: [],
    loading: false,
    noMore: false,
    page: 1,
    pageSize: 10
  },

  onLoad(options) {
    this.loadOrders();
  },

  onShow() {
    // 页面显示时刷新
  },

  onReachBottom() {
    // 加载更多
    if (!this.data.loading && !this.data.noMore) {
      this.loadMore();
    }
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.refreshOrders();
  },

  // ========== 加载订单 ==========
  loadOrders(isRefresh = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    // 调用云函数获取订单列表
    wx.cloud.callFunction({
      name: 'getAvailableOrders',
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize,
        type: this.data.filterType,
        sortBy: this.data.filterDistance
      },
      success: (res) => {
        const orders = isRefresh ? [] : this.data.orders;
        const newOrders = res.result?.data || [];
        
        this.setData({
          orders: [...orders, ...newOrders],
          loading: false,
          noMore: newOrders.length < this.data.pageSize,
          page: this.data.page + 1
        });

        if (isRefresh) {
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '已更新',
            icon: 'success'
          });
        }
      },
      fail: (err) => {
        console.error('[加载订单失败]', err);
        this.setData({ loading: false });
        
        if (isRefresh) {
          wx.stopPullDownRefresh();
        }
        
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // ========== 刷新订单 ==========
  refreshOrders() {
    this.setData({ page: 1, noMore: false });
    this.loadOrders(true);
  },

  // ========== 加载更多 ==========
  loadMore() {
    this.loadOrders(false);
  },

  // ========== 筛选 ==========
  onFilterType() {
    const types = ['全部类型', '心理咨询', '法律援助', '职业规划', '情感疏导', '健康指导'];
    wx.showActionSheet({
      itemList: types,
      success: (res) => {
        this.setData({ filterType: types[res.tapIndex] });
        this.refreshOrders();
      }
    });
  },

  onFilterDistance() {
    const distances = ['距离优先', '时间优先', '价格优先'];
    wx.showActionSheet({
      itemList: distances,
      success: (res) => {
        this.setData({ filterDistance: distances[res.tapIndex] });
        this.refreshOrders();
      }
    });
  },

  onFilterPrice() {
    const prices = ['全部价格', '100-200 元', '200-300 元', '300-500 元', '500 元以上'];
    wx.showActionSheet({
      itemList: prices,
      success: (res) => {
        this.setData({ filterPrice: prices[res.tapIndex] });
        this.refreshOrders();
      }
    });
  },

  // ========== 抢单 ==========
  onGrabOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const orderIndex = this.data.orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return;

    const order = this.data.orders[orderIndex];
    if (order.grabbing || order.grabbed) return;

    // 立即置灰，防止重复点击
    this.setData({
      [`orders[${orderIndex}].grabbing`]: true
    });

    // 调用云函数抢单
    wx.cloud.callFunction({
      name: 'grabOrder',
      data: { orderId }
    }).then((res) => {
      if (res.result?.success) {
        this.setData({
          [`orders[${orderIndex}].grabbing`]: false,
          [`orders[${orderIndex}].grabbed`]: true
        });

        wx.showToast({
          title: '抢单成功',
          icon: 'success',
          duration: 2000
        });

        // 跳转到任务详情
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/executor-task-detail/executor-task-detail?id=${orderId}`
          });
        }, 1500);
      } else {
        // 抢单失败，恢复状态
        this.setData({
          [`orders[${orderIndex}].grabbing`]: false
        });

        wx.showToast({
          title: res.result?.message || '抢单失败',
          icon: 'none'
        });
      }
    }).catch((err) => {
      console.error('[抢单失败]', err);
      
      // 抢单失败，恢复状态
      this.setData({
        [`orders[${orderIndex}].grabbing`]: false
      });

      wx.showToast({
        title: '抢单失败，请重试',
        icon: 'none'
      });
    });
  },

  // ========== 订单详情 ==========
  onOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    // 如果已经抢单成功，查看详情；否则先抢单
    const order = this.data.orders.find(o => o.id === orderId);
    
    if (order && order.grabbed) {
      wx.navigateTo({
        url: `/pages/executor-task-detail/executor-task-detail?id=${orderId}`
      });
    }
  },

  // ========== 刷新列表 ==========
  onRefresh() {
    this.refreshOrders();
  }
});
