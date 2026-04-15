Page({
  data: {
    cert: {
      id: 501,
      type: 1, // 1 免费证书 2 付费证书
      certNo: 'QR202604040001',
      date: '2026-04-04',
      content: '于 2026 年 04 月 04 日在珠江广州段完成科学护生行动，特发此证',
      certUrl: '/images/cert_1001.jpg',
      certName: '护生圆满证书'
    },
    statusBarHeight: 0
  },

  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 20
    });

    // [CLEANED] console.log('证书预览页加载，certId:', options.id);
    // 实际场景中应根据 options.id 从后端获取证书数据
  },

  // 保存到相册
  saveToAlbum() {
    wx.showLoading({
      title: '保存中...',
      mask: true
    });

    // 下载证书图片
    wx.downloadFile({
      url: this.data.cert.certUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '已保存到相册',
                icon: 'success'
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('保存失败:', err);
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('下载失败:', err);
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享给好友
  shareToFriend() {
    // 打开分享面板
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none'
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  },

  // 处理分享
  onShareAppMessage() {
    return {
      title: '我的护生证书 - 清如 ClearSpring',
      path: '/pages/protect/cert-preview?id=' + this.data.cert.id,
      imageUrl: this.data.cert.certUrl
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '我的护生证书',
      query: 'id=' + this.data.cert.id,
      imageUrl: this.data.cert.certUrl
    };
  }
});
