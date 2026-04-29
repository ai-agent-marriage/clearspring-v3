// pages/zen-daily/zen-daily.js
const app = getApp();

Page({
  data: {
    loading: true,
    zenData: {
      zen_id: '',
      date: '',
      content: '',
      source: '',
      background_images: [],
      default_background: '',
      category: ''
    },
    currentBg: '',
    currentIndex: 0,
    showPosterModal: false,
    posterUrl: '',
    posterGenerating: false
  },

  onLoad() {
    this.fetchDailyZen();
  },

  // 获取每日一禅
  async fetchDailyZen() {
    try {
      const res = await app.api.request({
        url: '/api/v1/zen/daily',
        method: 'GET'
      });

      if (res.code === 200) {
        const zenData = res.data;
        this.setData({
          zenData,
          currentBg: zenData.default_background,
          loading: false
        });
      } else {
        this.handleError(res.message || '加载失败');
      }
    } catch (error) {
      console.error('获取每日一禅失败:', error);
      this.handleError('网络异常，请稍后重试');
    }
  },

  // 切换背景图
  onBgChange(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.zenData.background_images;
    
    if (index >= 0 && index < images.length) {
      this.setData({
        currentBg: images[index],
        currentIndex: index
      });
    }
  },

  // 生成海报
  async onGeneratePoster() {
    if (this.data.posterGenerating) return;

    wx.showLoading({ title: '生成中...' });
    this.setData({ posterGenerating: true });

    try {
      const res = await app.api.request({
        url: '/api/v1/zen/poster',
        method: 'POST',
        data: {
          zen_id: this.data.zenData.zen_id,
          background_index: this.data.currentIndex
        }
      });

      if (res.code === 200) {
        this.setData({
          posterUrl: res.data.poster_url,
          showPosterModal: true,
          posterGenerating: false
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        this.setData({ posterGenerating: false });
        wx.showToast({ title: res.message || '生成失败', icon: 'none' });
      }
    } catch (error) {
      console.error('生成海报失败:', error);
      wx.hideLoading();
      this.setData({ posterGenerating: false });
      wx.showToast({ title: '生成失败，请稍后重试', icon: 'none' });
    }
  },

  // 分享
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    });

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  // 隐藏海报弹窗
  hidePosterModal() {
    this.setData({ showPosterModal: false });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数
  },

  // 海报加载完成
  onPosterLoad() {
    wx.hideLoading();
  },

  // 保存海报
  onSavePoster() {
    if (!this.data.posterUrl) return;

    wx.showLoading({ title: '保存中...' });
    
    wx.downloadFile({
      url: this.data.posterUrl,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading();
            wx.showToast({ title: '保存成功', icon: 'success' });
            this.setData({ showPosterModal: false });
          },
          fail: (err) => {
            wx.hideLoading();
            if (err.errMsg.includes('auth deny')) {
              wx.showModal({
                title: '提示',
                content: '需要授权相册权限才能保存',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting();
                  }
                }
              });
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' });
            }
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '下载失败', icon: 'none' });
      }
    });
  },

  // 分享海报
  onSharePoster() {
    wx.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    });

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  // 错误处理
  handleError(message) {
    this.setData({ loading: false });
    wx.showModal({
      title: '加载失败',
      content: message,
      showCancel: false,
      confirmText: '重试',
      success: (res) => {
        if (res.confirm) {
          this.setData({ loading: true });
          this.fetchDailyZen();
        }
      }
    });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: `每日一禅 - ${this.data.zenData.content}`,
      path: `/pages/zen-daily/zen-daily`,
      imageUrl: this.data.currentBg
    };
  }
});
