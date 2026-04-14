Page({
  data: {
    currentTab: 1,
    showModal: false,
    orders: [
      { 
        id: 'HS2024051001', 
        name: '锦鲤护生委托', 
        image: '/images/koi.jpg', 
        date: '05-15', 
        location: '放生池 A 区',
        status: 'processing'
      },
      { 
        id: 'HS2024050822', 
        name: '林鸟护生委托', 
        image: '/images/bird.jpg', 
        date: '05-12', 
        location: '南山林区',
        status: 'completed'
      }
    ]
  },

  onLoad() {
    // 加载委托订单数据
  },

  // 切换 Tab
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: parseInt(tab)
    })
  },

  // 立即预约
  onReserve() {
    this.setData({
      showModal: true
    })
  },

  // 确认合规
  onConfirm() {
    this.setData({
      showModal: false
    })
    wx.navigateTo({
      url: '/pages/protect/register'
    })
  },

  // 隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false
    })
  },

  // 停止事件冒泡
  stopPropagation() {
    // 防止点击弹窗内容时关闭
  },

  // 订单详情
  onOrderDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/order/detail?id=${id}`
    })
  }
})
