// 清如 ClearSpring - 机构志愿者详情页 V-05
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // 志愿者基本信息
    volunteerInfo: {
      id: 'vol_001',
      volunteerNo: 'V2025001',
      name: '李明',
      avatar: 'https://example.com/avatar.jpg',
      verified: true,
      level: 5,
      status: 'active', // active, busy, offline
      statusText: '可接单',
      gender: '男',
      age: 28,
      location: '江苏省苏州市',
      registerDate: '2025-03-15',
      serviceDays: 128,
      completedOrders: 56,
      rating: 98,
      totalHours: 256,
      skills: ['护生执行', '活动组织', '摄影记录'],
      phone: '138****5678'
    },
    
    // 资质证书
    certificates: [
      {
        id: 'cert_001',
        name: '心理咨询师证书',
        type: 'skill',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2025-06-15'
      },
      {
        id: 'cert_002',
        name: '应急救援员证书',
        type: 'qualification',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2024-12-10'
      },
      {
        id: 'cert_003',
        name: '健康管理师证书',
        type: 'skill',
        status: 'pending',
        statusText: '审核中',
        issueDate: '2025-09-20'
      }
    ],
    
    // 服务记录
    serviceHistory: [
      {
        id: 'order_001',
        orderName: '太湖护生活动 #001',
        date: '2026-04-10',
        status: 'completed',
        statusText: '已完成',
        species: '鲫鱼 50 斤',
        amount: '299.00',
        rating: 5,
        ratingStars: '★★★★★',
        ratingComment: '非常专业，执行过程规范'
      },
      {
        id: 'order_002',
        orderName: '阳澄湖护生活动 #002',
        date: '2026-04-08',
        status: 'completed',
        statusText: '已完成',
        species: '鲤鱼 30 斤',
        amount: '199.00',
        rating: 5,
        ratingStars: '★★★★★',
        ratingComment: '态度很好，准时到达'
      },
      {
        id: 'order_003',
        orderName: '金鸡湖护生活动 #003',
        date: '2026-04-05',
        status: 'completed',
        statusText: '已完成',
        species: '草鱼 40 斤',
        amount: '259.00',
        rating: 4,
        ratingStars: '★★★★☆',
        ratingComment: '整体不错'
      }
    ],
    
    // 评价列表
    reviews: [
      {
        id: 'review_001',
        avatar: 'https://example.com/user1.jpg',
        reviewerName: '张女士',
        date: '2026-04-10',
        stars: '★★★★★',
        content: '李老师非常专业，整个护生过程非常规范，还给我们讲解了相关知识，非常感谢！',
        reply: '谢谢您的认可，这是我应该做的！'
      },
      {
        id: 'review_002',
        avatar: 'https://example.com/user2.jpg',
        reviewerName: '王先生',
        date: '2026-04-08',
        stars: '★★★★★',
        content: '准时到达，执行认真，好评！',
        reply: ''
      }
    ]
  },

  onLoad(options) {
    if (options.volunteerId) {
      this.loadVolunteerDetail(options.volunteerId);
    } else {
      this.loadMockData();
    }
  },

  onPullDownRefresh() {
    this.loadVolunteerDetail(this.data.volunteerInfo.id).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载志愿者详情
  async loadVolunteerDetail(volunteerId) {
    try {
      ErrorHandler.showLoading('加载中...');
      
      // TODO: 调用云函数获取志愿者详情
      // const res = await wx.cloud.callFunction({
      //   name: 'getVolunteerDetail',
      //   data: { volunteerId }
      // });
      
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('加载志愿者详情失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadVolunteerDetail',
        showToast: true
      });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  // 加载模拟数据
  loadMockData() {
    // 数据已在 data 中初始化
  },

  // 联系志愿者
  onContactVolunteer() {
    if (this.data.volunteerInfo.phone) {
      wx.makePhoneCall({
        phoneNumber: this.data.volunteerInfo.phone
      });
    } else {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
    }
  },

  // 分配任务
  onAssignTask() {
    wx.navigateTo({
      url: '/pages/org-task-assign/org-task-assign?volunteerId=' + this.data.volunteerInfo.id
    });
  },

  // 查看全部服务记录
  onViewAllHistory() {
    wx.navigateTo({
      url: '/pages/org-volunteer-history/org-volunteer-history?volunteerId=' + this.data.volunteerInfo.id
    });
  },

  // 查看简历
  onViewResume() {
    wx.showToast({
      title: '简历查看功能开发中',
      icon: 'none'
    });
  }
});
