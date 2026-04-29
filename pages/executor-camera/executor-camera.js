// 清如 ClearSpring - 原生拍摄页逻辑

const ctx = wx.createCameraContext();

Page({
  data: {
    showCamera: true,
    currentMode: 'photo', // photo/video
    isCapturing: false,
    flashOn: false,
    showGrid: false,
    
    // 预览相关
    showPreview: false,
    previewImage: '',
    tempFilePath: '',
    
    // 提示
    toast: ''
  },

  onLoad(options) {
    // 获取传入参数
    this.purpose = options.purpose || 'evidence'; // 拍摄用途：evidence/idcard/handheld
    // [CLEANED] console.log('拍摄页加载，用途:', this.purpose);
  },

  onShow() {
    // 页面显示时启动相机
    this.startCamera();
  },

  onHide() {
    // 页面隐藏时停止相机
    this.stopCamera();
  },

  onUnload() {
    // 页面卸载时清理
    this.stopCamera();
  },

  // ========== 相机控制 ==========
  startCamera() {
    this.setData({ showCamera: true });
  },

  stopCamera() {
    this.setData({ showCamera: false });
  },

  onCameraStop() {
    // [CLEANED] console.log('相机停止');
  },

  onCameraError(e) {
    console.error('相机错误:', e.detail);
    this.showToast('相机启动失败，请检查权限');
  },

  // ========== 模式切换 ==========
  onSwitchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ currentMode: mode });
  },

  // ========== 拍摄 ==========
  onCapture() {
    if (this.data.isCapturing) return;

    if (this.data.currentMode === 'photo') {
      this.takePhoto();
    } else {
      this.startVideo();
    }
  },

  takePhoto() {
    this.setData({ isCapturing: true });

    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // [CLEANED] console.log('拍照成功:', res.tempImagePath);
        
        this.setData({
          isCapturing: false,
          previewImage: res.tempImagePath,
          tempFilePath: res.tempImagePath,
          showPreview: true
        });
      },
      fail: (err) => {
        console.error('拍照失败:', err);
        this.setData({ isCapturing: false });
        this.showToast('拍照失败，请重试');
      }
    });
  },

  startVideo() {
    // 录像功能（长按开始，松开停止）
    this.setData({ isCapturing: true });
    this.showToast('录像中...');
    
    ctx.startRecord({
      timeoutCallback: (res) => {
        // [CLEANED] console.log('录像超时');
        this.handleVideoResult(res.tempThumbPath, res.tempVideoPath);
      }
    });
  },

  stopVideo() {
    ctx.stopRecord({
      success: (res) => {
        // [CLEANED] console.log('录像成功');
        this.handleVideoResult(res.tempThumbPath, res.tempVideoPath);
      },
      fail: (err) => {
        console.error('录像失败:', err);
        this.setData({ isCapturing: false });
      }
    });
  },

  handleVideoResult(thumbPath, videoPath) {
    this.setData({
      isCapturing: false,
      previewImage: thumbPath,
      tempFilePath: videoPath,
      showPreview: true
    });
  },

  // ========== 功能选项 ==========
  onToggleFlash() {
    this.setData({ flashOn: !this.data.flashOn });
    // TODO: 实际设置相机闪光灯
  },

  onSwitchCamera() {
    // 切换前后摄像头
    this.showToast('切换摄像头');
  },

  onGridToggle() {
    this.setData({ showGrid: !this.data.showGrid });
  },

  // ========== 预览确认 ==========
  onModalBackdropTap() {
    // 点击背景不关闭，强制确认
  },

  onModalContentTap() {
    // 阻止冒泡
  },

  onRetake() {
    // 重拍
    this.setData({
      showPreview: false,
      previewImage: '',
      tempFilePath: ''
    });
  },

  onConfirmUse() {
    // 确认使用 - 禁止从相册选择，只能使用拍摄的照片
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (prevPage && prevPage.onCameraCapture) {
      prevPage.onCameraCapture(this.data.tempFilePath);
    }
    
    wx.navigateBack({
      delta: 1
    });
  },

  // ========== 工具方法 ==========
  showToast(message) {
    this.setData({ toast: message });
    setTimeout(() => {
      this.setData({ toast: '' });
    }, 2000);
  }
});
