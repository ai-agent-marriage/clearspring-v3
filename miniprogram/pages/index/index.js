// pages/index/index.js
Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: '/assets/icons/default-avatar.png',
      nickName: '善缘'
    },
    
    // 当前日期（佛历 + 农历）
    currentDate: {
      year: 2026,
      yearText: '二零二六年',
      month: 4,
      day: 14,
      weekday: '星期二',
      lunarYear: 2569,
      lunarYearText: '二五六九年',
      lunarMonth: '三',
      lunarDay: '十七',
      ganzhi: '丙午'
    },
    
    // 宜忌
    suit: ['放生', '祈福', '诵经', '布施', '斋戒'],
    avoid: ['杀生', '偷盗', '邪淫', '妄语', '饮酒'],
    
    // 禅理短句
    zenQuote: {
      text: '心如工画师，能画诸世间。五蕴悉从生，无法而不造。',
      source: '《华严经》'
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

  onShow() {
    // 每次显示时刷新打卡状态
    this.loadCheckinStatus();
  },

  // 加载当前日期
  loadCurrentDate() {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    
    // 简化农历计算（实际应使用农历库）
    const lunarMonthIndex = (now.getMonth() + 2) % 12;
    
    this.setData({
      currentDate: {
        year: now.getFullYear(),
        yearText: this.toChineseNumber(now.getFullYear()),
        month: now.getMonth() + 1,
        day: now.getDate(),
        weekday: weekdays[now.getDay()],
        lunarYear: 2569,
        lunarYearText: '二五六九年',
        lunarMonth: lunarMonths[lunarMonthIndex],
        lunarDay: this.toChineseDay(now.getDate()),
        ganzhi: '丙午'
      }
    });
  },

  // 数字转中文大写
  toChineseNumber(num) {
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];
    let result = '';
    let str = num.toString();
    
    for (let i = 0; i < str.length; i++) {
      const digit = parseInt(str[i]);
      if (digit !== 0) {
        result += chars[digit] + units[str.length - i - 1];
      } else {
        result += chars[0];
      }
    }
    
    return result;
  },

  // 日期转中文
  toChineseDay(day) {
    const chars = ['初', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (day <= 10) {
      return '初' + chars[day];
    } else if (day < 20) {
      return '十' + chars[day - 10];
    } else if (day === 20) {
      return '二十';
    } else if (day < 30) {
      return '廿' + chars[day - 20];
    } else {
      return '三十';
    }
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
    } else {
      // 新的一天，重置打卡状态
      this.setData({
        morningChecked: false,
        eveningChecked: false
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
    
    const newContinuous = this.data.continuousDays + 1;
    const newTotal = this.data.totalDays + 1;
    
    this.setData({
      morningChecked: true,
      continuousDays: newContinuous,
      totalDays: newTotal
    });
    
    wx.showToast({
      title: '晨起礼佛 ✓',
      icon: 'success',
      duration: 2000
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
    
    const newTotal = this.data.totalDays + 1;
    
    this.setData({
      eveningChecked: true,
      totalDays: newTotal
    });
    
    wx.showToast({
      title: '晚间打坐 ✓',
      icon: 'success',
      duration: 2000
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
