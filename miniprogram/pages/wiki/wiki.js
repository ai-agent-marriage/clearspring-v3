// pages/wiki/wiki.js
Page({
  data: {
    showModal: false,
    orders: [
      {
        id: 1,
        name: '锦鲤护生委托',
        orderNumber: 'HS2024051001',
        image: 'https://example.com/koi-thumb.jpg',
        status: 'processing',
        statusText: '执行中',
        date: '05-15',
        location: '放生池 A 区'
      },
      {
        id: 2,
        name: '林鸟护生委托',
        orderNumber: 'HS2024050822',
        image: 'https://example.com/bird-thumb.jpg',
        status: 'completed',
        statusText: '已完成',
        date: '05-12',
        location: '南山林区'
      }
    ]
  },

  onReserve() {
    this.setData({ showModal: true });
  },

  onMaskTap() {
    this.setData({ showModal: false });
  },

  onConfirm() {
    this.setData({ showModal: false });
    wx.navigateTo({
      url: '/pages/release/initiate'
    });
  },

  onCancel() {
    this.setData({ showModal: false });
  },

  onOrderTap(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/detail?id=${orderId}`
    });
  },

  onLoad() {
    console.log('Wiki page loaded');
  }
});
