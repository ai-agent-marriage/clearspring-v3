// pages/q-17-order-review/q-17-order-review.js

Page({
  data: {
    // 订单信息
    orderInfo: {
      orderNo: 'CR202604110001',
      statusText: '已完成',
      statusClass: 'completed',
      serviceImage: '/assets/images/service-1.jpg',
      serviceName: '物种保护捐赠',
      serviceSpec: '东北虎保护 × 1',
      price: '199.00',
      executorAvatar: '/assets/images/avatar-1.jpg',
      executorName: '张守护者',
      executorRating: [1, 1, 1, 1, 1],
      serviceTime: '2026-04-10 14:30'
    },
    
    // 评分
    overallRating: 0,
    overallRatingText: '请评分',
    serviceRating: 0,
    qualityRating: 0,
    
    // 评价标签
    reviewTags: [
      { id: 1, text: '服务热情', active: false },
      { id: 2, text: '专业认真', active: false },
      { id: 3, text: '及时反馈', active: false },
      { id: 4, text: '态度友好', active: false },
      { id: 5, text: '效率高', active: false },
      { id: 6, text: '非常满意', active: false }
    ],
    
    // 评价内容
    reviewContent: '',
    
    // 上传图片
    reviewImages: [],
    
    // 匿名评价
    isAnonymous: false,
    
    // 是否可以提交
    canSubmit: false
  },

  onLoad(options) {
    // 从参数获取订单 ID
    if (options.orderId) {
      this.loadOrderInfo(options.orderId);
    }
  },

  onReady() {
    console.log('Q-17 订单评价页渲染完成');
  },

  onShow() {
    this.checkCanSubmit();
  },

  /**
   * 加载订单信息
   */
  async loadOrderInfo(orderId) {
    try {
      // 调用云函数获取订单详情
      // const res = await wx.cloud.callFunction({
      //   name: 'getOrderDetail',
      //   data: { orderId }
      // });
      
      // 模拟数据
      console.log('加载订单:', orderId);
    } catch (error) {
      console.error('加载订单信息失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 整体评分点击
   */
  onOverallRatingTap(e) {
    const index = e.currentTarget.dataset.index;
    const rating = index + 1;
    
    const ratingTexts = ['非常不满意', '不满意', '一般', '满意', '非常满意'];
    
    this.setData({
      overallRating: rating,
      overallRatingText: ratingTexts[index]
    });
    
    this.checkCanSubmit();
  },

  /**
   * 服务态度评分点击
   */
  onServiceRatingTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      serviceRating: index + 1
    });
    
    this.checkCanSubmit();
  },

  /**
   * 服务质量评分点击
   */
  onQualityRatingTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      qualityRating: index + 1
    });
    
    this.checkCanSubmit();
  },

  /**
   * 评价标签点击
   */
  onTagTap(e) {
    const tagId = e.currentTarget.dataset.id;
    const tags = this.data.reviewTags;
    
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      tag.active = !tag.active;
      this.setData({ reviewTags: tags });
    }
  },

  /**
   * 评价内容输入
   */
  onReviewInput(e) {
    this.setData({
      reviewContent: e.detail.value
    });
    
    this.checkCanSubmit();
  },

  /**
   * 上传图片
   */
  onUploadImage() {
    const maxCount = 9;
    const remainCount = maxCount - this.data.reviewImages.length;
    
    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath);
        const images = this.data.reviewImages.concat(tempFiles);
        this.setData({ reviewImages: images });
        this.checkCanSubmit();
      }
    });
  },

  /**
   * 删除图片
   */
  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.reviewImages;
    images.splice(index, 1);
    this.setData({ reviewImages: images });
  },

  /**
   * 匿名评价开关
   */
  onAnonymousChange(e) {
    this.setData({
      isAnonymous: e.detail.value
    });
  },

  /**
   * 检查是否可以提交
   */
  checkCanSubmit() {
    const { overallRating, serviceRating, qualityRating } = this.data;
    const canSubmit = overallRating > 0 && serviceRating > 0 && qualityRating > 0;
    
    this.setData({ canSubmit });
  },

  /**
   * 提交评价
   */
  async submitReview() {
    if (!this.data.canSubmit) {
      wx.showToast({
        title: '请完成评分',
        icon: 'none'
      });
      return;
    }
    
    try {
      wx.showLoading({
        title: '提交中...'
      });
      
      // 构建评价数据
      const reviewData = {
        orderId: this.data.orderInfo.orderNo,
        overallRating: this.data.overallRating,
        serviceRating: this.data.serviceRating,
        qualityRating: this.data.qualityRating,
        tags: this.data.reviewTags.filter(t => t.active).map(t => t.text),
        content: this.data.reviewContent,
        images: this.data.reviewImages,
        isAnonymous: this.data.isAnonymous
      };
      
      // 调用云函数提交评价
      // const res = await wx.cloud.callFunction({
      //   name: 'submitReview',
      //   data: reviewData
      // });
      
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      wx.hideLoading();
      
      wx.showToast({
        title: '评价提交成功',
        icon: 'success',
        duration: 2000
      });
      
      // 延迟跳转
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500);
      
    } catch (error) {
      console.error('提交评价失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: '我的订单评价',
      path: '/pages/q-17-order-review/q-17-order-review'
    };
  }
});
