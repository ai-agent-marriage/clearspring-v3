// 原生拍摄 - O-06
Page({
  data: {
    flashOn: false,
    timerOn: false,
    ratio: '4:3',
    lastPhoto: null,
    showHint: false,
    cameraContext: null
  },

  onLoad() {
    // 创建相机上下文
    this.data.cameraContext = wx.createCameraContext();
  },

  onShow() {
    // 页面显示
  },

  onHide() {
    // 页面隐藏
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 关闭
  onClose() {
    wx.navigateBack();
  },

  // 相机初始化完成
  onCameraInit() {
    // [CLEANED] console.log('相机初始化完成');
  },

  // 相机错误
  onCameraError(e) {
    console.error('相机错误:', e.detail);
    wx.showToast({
      title: '相机启动失败',
      icon: 'none'
    });
  },

  // 拍摄
  onCapture() {
    const ctx = this.data.cameraContext;
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          lastPhoto: res.tempImagePath
        });
        
        // 显示提示
        this.setData({ showHint: true });
        setTimeout(() => {
          this.setData({ showHint: false });
        }, 2000);

        // 询问是否保存
        wx.showModal({
          title: '保存照片',
          content: '是否保存拍摄的照片？',
          success: (res) => {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.lastPhoto,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  });
                },
                fail: () => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  });
                }
              });
            }
          }
        });
      },
      fail: (err) => {
        console.error('拍摄失败:', err);
        wx.showToast({
          title: '拍摄失败',
          icon: 'none'
        });
      }
    });
  },

  // 查看相册
  onViewGallery() {
    if (this.data.lastPhoto) {
      wx.previewImage({
        urls: [this.data.lastPhoto],
        current: this.data.lastPhoto
      });
    } else {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          this.setData({
            lastPhoto: res.tempFilePaths[0]
          });
        }
      });
    }
  },

  // 翻转摄像头
  onFlipCamera() {
    // 切换前后摄像头
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    });
  },

  // 切换闪光灯
  onToggleFlash() {
    this.setData({
      flashOn: !this.data.flashOn
    });
  },

  // 切换定时器
  onToggleTimer() {
    this.setData({
      timerOn: !this.data.timerOn
    });
  },

  // 切换比例
  onToggleRatio() {
    const ratios = ['4:3', '16:9', '1:1'];
    const currentIndex = ratios.indexOf(this.data.ratio);
    const nextIndex = (currentIndex + 1) % ratios.length;
    this.setData({
      ratio: ratios[nextIndex]
    });
  }
});
