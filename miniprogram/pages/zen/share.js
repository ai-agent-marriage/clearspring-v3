// pages/zen/share.js
// 每日一禅分享页

Page({
  data: {
    zenQuote: '心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想',
    author: '心经',
    bgIndex: 0,
    backgrounds: [
      { url: 'https://picsum.photos/1080/1920?random=1', name: '山水' },
      { url: 'https://picsum.photos/1080/1920?random=2', name: '云雾' },
      { url: 'https://picsum.photos/1080/1920?random=3', name: '竹林' },
      { url: 'https://picsum.photos/1080/1920?random=4', name: '荷花' }
    ],
    isEditing: false,
    showShareModal: false
  },

  onLoad() {
    this.loadRandomZenQuote()
  },

  /**
   * 加载随机禅理
   */
  loadRandomZenQuote() {
    const zenQuotes = [
      { text: '心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想', author: '心经' },
      { text: '积善成德，而神明自得，圣心备焉', author: '荀子·劝学' },
      { text: '一切有为法，如梦幻泡影', author: '金刚经' },
      { text: '菩提本无树，明镜亦非台', author: '六祖坛经' },
      { text: '上善若水，水善利万物而不争', author: '道德经' }
    ]

    const randomIndex = Math.floor(Math.random() * zenQuotes.length)
    const quote = zenQuotes[randomIndex]

    this.setData({
      zenQuote: quote.text,
      author: quote.author
    })
  },

  /**
   * 切换背景
   */
  onBgTap(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      bgIndex: index
    })
  },

  /**
   * 编辑文案
   */
  onEditTap() {
    this.setData({
      isEditing: true
    })
  },

  /**
   * 文案输入
   */
  onQuoteInput(e) {
    this.setData({
      zenQuote: e.detail.value
    })
  },

  /**
   * 完成编辑
   */
  onEditComplete() {
    this.setData({
      isEditing: false
    })
  },

  /**
   * 生成海报
   */
  onGeneratePoster() {
    wx.showLoading({ title: '生成中...' })

    // TODO: 使用 this.data 中的值调用海报生成工具
    // const { zenQuote, author, backgrounds, bgIndex } = this.data
    
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        showShareModal: true
      })
    }, 1500)
  },

  /**
   * 关闭分享弹窗
   */
  onCloseShareModal() {
    this.setData({
      showShareModal: false
    })
  },

  /**
   * 分享方式
   */
  onShareMethod(e) {
    const { method } = e.currentTarget.dataset
    
    const shareMethods = {
      'wechat': '分享给微信好友',
      'moments': '分享到朋友圈',
      'qq': '分享给 QQ 好友',
      'save': '保存到相册'
    }

    wx.showToast({
      icon: 'none',
      title: shareMethods[method] || '分享'
    })

    this.setData({
      showShareModal: false
    })
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack()
  }
})
