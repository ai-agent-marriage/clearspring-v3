// pages/zen/home1.js
// 全屏随机禅理页

Page({
  data: {
    zenQuote: '心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想',
    author: '心经',
    isCollected: false
  },

  onLoad() {
    this.loadRandomZenQuote()
  },

  /**
   * 加载随机禅理短句
   */
  loadRandomZenQuote() {
    const zenQuotes = [
      { text: '心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想', author: '心经' },
      { text: '积善成德，而神明自得，圣心备焉', author: '荀子·劝学' },
      { text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观', author: '金刚经' },
      { text: '菩提本无树，明镜亦非台。本来无一物，何处惹尘埃', author: '六祖坛经' },
      { text: '色不异空，空不异色，色即是空，空即是色', author: '心经' },
      { text: '诸行无常，诸法无我，涅槃寂静', author: '法印经' },
      { text: '应无所住而生其心', author: '金刚经' },
      { text: '知止而后有定，定而后能静，静而后能安', author: '大学' },
      { text: '上善若水，水善利万物而不争', author: '道德经' },
      { text: '祸兮福之所倚，福兮祸之所伏', author: '道德经' }
    ]

    const randomIndex = Math.floor(Math.random() * zenQuotes.length)
    const quote = zenQuotes[randomIndex]

    this.setData({
      zenQuote: quote.text,
      author: quote.author,
      isCollected: false
    })
  },

  /**
   * 刷新禅理
   */
  onRefresh() {
    wx.showLoading({ title: '加载中...' })
    setTimeout(() => {
      this.loadRandomZenQuote()
      wx.hideLoading()
    }, 300)
  },

  /**
   * 收藏禅理
   */
  onCollect() {
    const { isCollected } = this.data
    this.setData({
      isCollected: !isCollected
    })

    wx.showToast({
      icon: 'none',
      title: isCollected ? '已取消收藏' : '已加入收藏'
    })
  },

  /**
   * 上滑进入 home2
   */
  onSwipeUp() {
    wx.switchTab({
      url: '/pages/zen/home2'
    })
  }
})
