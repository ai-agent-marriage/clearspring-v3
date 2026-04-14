Page({
  data: {
    species: {
      name: '白鹭',
      latinName: 'Egretta garzetta',
      image: 'https://example.com/egret-hero.jpg',
      detailImage: 'https://example.com/egret-detail.jpg',
      compliance: true
    }
  },

  onLoad() {
    // 可在此处加载物种详情数据
    // const speciesId = this.options.id
  },

  // 去护生
  onProtect() {
    wx.navigateTo({
      url: '/pages/protect/register'
    })
  }
})
