// pages/index/index.js
Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: '/assets/icons/default-avatar.png',
      nickName: '善缘'
    },
    
    // 当前日期
    currentDate: {
      year: 2026,
      month: 4,
      day: 14,
      weekday: '星期二',
      lunarYear: 2569,
      lunarMonth: '三月',
      lunarDay: '十七',
      ganZhi: '丙午'
    },
    
    // 宜忌
    suit: ['放生', '祈福', '诵经', '布施', '斋戒'],
    avoid: ['杀生', '偷盗', '邪淫', '妄语', '饮酒'],
    
    // 禅理短句
    zenQuote: {
      text: '菩提本无树，明镜亦非台',
      author: '六祖慧能'
    },
    
    // 打卡状态
    morningChecked: false,
    eveningChecked: false,
    
    // 打卡数据
    continuousDays: 12,
    totalDays: 156
  },

  onLoad() {
    this.loadCurrentDate();
    this.loadCheckinStatus();
  },

  onPullDownRefresh() {
    this.refreshData();
  },

  // 加载当前日期
  loadCurrentDate() {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    
    this.setData({
      currentDate: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        weekday: weekdays[now.getDay()],
        lunarYear: 2569, // 简化处理，实际应计算佛历
        lunarMonth: '三月', // 简化处理，实际应计算农历
        lunarDay: '十七',
        ganZhi: '丙午'
      }
    });
  },

  // 加载打卡状态
  loadCheckinStatus() {
    const today = new Date().toDateString();
    const checkinData = wx.getStorageSync('checkinData') || {};
    
    if (checkinData.lastCheckinDate === today) {
      this.setData({
        morningChecked: checkinData.morning || false,
        eveningChecked: checkinData.evening || false
      });
    }
  },

  // 刷新数据
  refreshData() {
    wx.showLoading({ title: '刷新中...' });
    
    setTimeout(() => {
      this.loadCurrentDate();
      this.loadCheckinStatus();
      wx.hideLoading();
      wx.stopPullDownRefresh();
      
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 晨起礼佛
  morningCheckin() {
    if (this.data.morningChecked) return;
    
    const today = new Date().toDateString();
    const checkinData = wx.getStorageSync('checkinData') || {};
    
    checkinData.lastCheckinDate = today;
    checkinData.morning = true;
    wx.setStorageSync('checkinData', checkinData);
    
    this.setData({
      morningChecked: true,
      continuousDays: this.data.continuousDays + 1
    });
    
    wx.showToast({
      title: '晨起礼佛 ✓',
      icon: 'success'
    });
    
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
  },

  // 晚间打坐
  eveningCheckin() {
    if (this.data.eveningChecked) return;
    
    const today = new Date().toDateString();
    const checkinData = wx.getStorageSync('checkinData') || {};
    
    checkinData.lastCheckinDate = today;
    checkinData.evening = true;
    wx.setStorageSync('checkinData', checkinData);
    
    this.setData({
      eveningChecked: true
    });
    
    wx.showToast({
      title: '晚间打坐 ✓',
      icon: 'success'
    });
    
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
  },

  // 跳转设置
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 跳转个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/index'
    });
  },

  // 跳转功德林
  goToForest() {
    wx.navigateTo({
      url: '/pages/merit-forest/merit-forest'
    });
  }
});
