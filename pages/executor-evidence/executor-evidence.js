// 清如 ClearSpring - 证据提交页逻辑

Page({
  data: {
    // 任务信息
    taskInfo: {
      id: 'TSK20260328001',
      title: '心理疏导服务 - 李女士',
      date: '2026-03-28'
    },
    
    // 照片列表
    photos: [],
    
    // 视频列表
    videos: [],
    
    // 文字说明
    description: '',
    
    // 位置信息
    location: {
      address: '',
      latitude: null,
      longitude: null
    },
    
    // 状态
    canSubmit: false,
    submitting: false,
    failedCount: 0
  },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
    // 清理 setTimeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },

  onLoad(options) {
    // 获取任务 ID
    this.taskId = options.id;
    // [CLEANED] console.log('证据提交页加载，任务 ID:', this.taskId);
    
    // 获取位置信息
    this.getLocation();
  },

  // ========== 位置信息 ==========
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
            address: `${res.latitude}, ${res.longitude}` // TODO: 逆地理编码
          }
        });
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        wx.showToast({
          title: '位置获取失败',
          icon: 'none'
        });
      }
    });
  },

  onGetLocation() {
    this.getLocation();
  },

  // ========== 照片上传 ==========
  onAddPhoto() {
    if (this.data.photos.length >= 9) {
      wx.showToast({
        title: '最多上传 9 张照片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 9 - this.data.photos.length,
      mediaType: ['image'],
      sourceType: ['camera'], // 仅允许相机
      sizeType: ['compressed'],
      camera: 'back',
      success: (res) => {
        const tempFiles = res.tempFiles.map(file => ({
          path: file.tempFilePath,
          size: file.size,
          uploadStatus: 'pending'
        }));
        
        const newPhotos = [...this.data.photos, ...tempFiles];
        this.setData({ photos: newPhotos });
        
        // 开始上传
        this.uploadPhotos(newPhotos.slice(-tempFiles.length));
      },
      fail: (err) => {
        if (err.errMsg !== 'chooseMedia:fail cancel') {
          wx.showToast({
            title: '选择失败',
            icon: 'none'
          });
        }
      }
    });
  },

  uploadPhotos(photosToUpload) {
    photosToUpload.forEach((photo, index) => {
      // 性能优化：建议收集数据后批量 setData，而不是在循环中每次调用
      const realIndex = this.data.photos.length - photosToUpload.length + index;
      
      this.setData({
        [`photos[${realIndex}].uploadStatus`]: 'uploading'
      });

      // TODO: 实际项目中使用云存储上传，支持断点续传
      // wx.cloud.uploadFile({
      //   filePath: photo.path,
      //   cloudPath: `evidence/${this.taskId}/${Date.now()}_${index}.jpg`,
      //   success: (res) => {
      //     this.setData({
      //       [`photos[${realIndex}].uploadStatus`]: 'success',
      //       [`photos[${realIndex}].fileID`]: res.fileID
      //     });
      //   },
      //   fail: (err) => {
      //     this.setData({
      //       [`photos[${realIndex}].uploadStatus`]: 'failed'
      //     });
      //     this.checkFailedCount();
      //   }
      // })

      // 模拟上传
      setTimeout(() => {
        this.setData({
          [`photos[${realIndex}].uploadStatus`]: 'success'
        });
        this.validateSubmit();
      }, 1000 + Math.random() * 2000);
    });
  },

  onPreviewPhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photoUrls = this.data.photos.map(p => p.path);
    
    wx.previewImage({
      urls: photoUrls,
      current: index
    });
  },

  onDeletePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photos = this.data.photos;
    photos.splice(index, 1);
    
    this.setData({ photos });
    this.validateSubmit();
  },

  // ========== 视频上传 ==========
  onAddVideo() {
    if (this.data.videos.length >= 3) {
      wx.showToast({
        title: '最多上传 3 个视频',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 3 - this.data.videos.length,
      mediaType: ['video'],
      sourceType: ['camera'], // 仅允许相机
      success: (res) => {
        const newVideos = res.tempFiles.map(file => ({
          path: file.tempFilePath,
          thumb: file.thumbTempFilePath,
          duration: this.formatDuration(file.duration),
          size: this.formatSize(file.size),
          name: `video_${Date.now()}.mp4`,
          uploading: true,
          progress: 0
        }));
        
        const videos = [...this.data.videos, ...newVideos];
        this.setData({ videos });
        
        // 开始上传
        this.uploadVideos(newVideos);
      },
      fail: (err) => {
        if (err.errMsg !== 'chooseMedia:fail cancel') {
          wx.showToast({
            title: '选择失败',
            icon: 'none'
          });
        }
      }
    });
  },

  uploadVideos(videosToUpload) {
    videosToUpload.forEach((video, index) => {
      // 性能优化：建议收集数据后批量 setData，而不是在循环中每次调用
      const realIndex = this.data.videos.length - videosToUpload.length + index;
      
      // 模拟上传进度
      let progress = 0;
      const timer = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(timer);
          const videos = this.data.videos;
          videos[realIndex].uploading = false;
          videos[realIndex].progress = 100;
          this.setData({ videos });
          this.validateSubmit();
        } else {
          this.setData({
            [`videos[${realIndex}].progress`]: progress
          });
        }
      }, 500);
    });
  },

  onPreviewVideo(e) {
    const index = e.currentTarget.dataset.index;
    const video = this.data.videos[index];
    
    wx.previewMedia({
      sources: [{
        url: video.path,
        type: 'video'
      }]
    });
  },

  onDeleteVideo(e) {
    const index = e.currentTarget.dataset.index;
    const videos = this.data.videos;
    videos.splice(index, 1);
    
    this.setData({ videos });
    this.validateSubmit();
  },

  // ========== 文字说明 ==========
  onDescriptionInput(e) {
    // 【安全增强】XSS 过滤
    const input = e.detail.value || '';
    const sanitizedInput = this.sanitizeInput(input);
    
    this.setData({
      description: sanitizedInput
    });
    this.validateSubmit();
  },
  
  // 【安全增强】输入过滤方法
  sanitizeInput(input) {
    // 导入安全工具（在文件顶部添加 import）
    // 这里使用内联实现，避免破坏模块结构
    if (typeof input !== 'string') return input;
    
    // 移除危险标签
    let result = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    result = result.replace(/javascript:/gi, '');
    result = result.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // 转义 HTML 实体
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    result = result.replace(/[&<>"']/g, (char) => htmlEntities[char]);
    
    return result;
  },

  // ========== 验证提交 ==========
  validateSubmit() {
    const { photos, description } = this.data;
    const uploadedPhotos = photos.filter(p => p.uploadStatus === 'success').length;
    
    const canSubmit = 
      uploadedPhotos > 0 &&
      description.trim().length >= 10;
    
    this.setData({ canSubmit });
  },

  checkFailedCount() {
    const failedCount = this.data.photos.filter(p => p.uploadStatus === 'failed').length;
    this.setData({ failedCount });
  },

  // ========== 提交 ==========
  onSubmit() {
    if (!this.data.canSubmit || this.data.submitting) return;

    this.setData({ submitting: true });

    const submitData = {
      taskId: this.taskId,
      photos: this.data.photos.filter(p => p.uploadStatus === 'success').map(p => p.fileID),
      videos: this.data.videos.map(v => v.fileID),
      description: this.data.description,
      location: this.data.location,
      submitTime: new Date().getTime()
    };

    // [CLEANED] console.log('提交证据:', submitData);

    // TODO: 调用云函数提交证据
    // wx.cloud.callFunction({
    //   name: 'submitEvidence',
    //   data: submitData
    // })

    // 模拟提交
    setTimeout(() => {
      this.setData({ submitting: false });
      
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500);
    }, 2000);
  },

  // ========== 工具方法 ==========
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  formatSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  }
});
