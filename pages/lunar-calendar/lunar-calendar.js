// pages/lunar-calendar/lunar-calendar.js
const app = getApp();

Page({
  data: {
    loading: true,
    currentYear: 0,
    currentMonth: 0,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    todayInfo: {},
    todayCheckin: { morning: false, evening: false },
    selectedDay: null,
    stats: {
      total_checkin_days: 0,
      continuous_days: 0,
      morning_count: 0,
      evening_count: 0
    }
  },

  onLoad() {
    const now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1
    });
    this.loadCalendar();
    this.loadStatistics();
  },

  // 加载日历数据
  async loadCalendar() {
    this.setData({ loading: true });

    try {
      const res = await app.api.request({
        url: '/api/v1/calendar/lunar',
        method: 'GET',
        data: {
          year: this.data.currentYear,
          month: this.data.currentMonth
        }
      });

      if (res.code === 200) {
        const { days, today_checkin_status } = res.data;
        
        // 处理日期数据
        const processedDays = days.map(day => {
          const date = new Date(day.date);
          return {
            ...day,
            day: date.getDate(),
            lunar_short: day.lunar_date.substring(0, 2),
            is_future: date > new Date()
          };
        });

        this.setData({
          days: processedDays,
          todayCheckin: today_checkin_status,
          todayInfo: days.find(d => d.is_today) || {},
          loading: false
        });
      } else {
        this.handleError(res.message);
      }
    } catch (error) {
      console.error('加载日历失败:', error);
      this.handleError('网络异常，请稍后重试');
    }
  },

  // 加载统计数据
  async loadStatistics() {
    try {
      const res = await app.api.request({
        url: '/api/v1/calendar/statistics',
        method: 'GET'
      });

      if (res.code === 200) {
        this.setData({ stats: res.data });
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  // 上个月
  onPrevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    this.setData({ currentYear, currentMonth });
    this.loadCalendar();
  },

  // 下个月
  onNextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    this.setData({ currentYear, currentMonth });
    this.loadCalendar();
  },

  // 点击日期
  onDayTap(e) {
    const day = e.currentTarget.dataset.day;
    if (day.is_future) {
      wx.showToast({ title: '未来日期不可打卡', icon: 'none' });
      return;
    }
    this.setData({ selectedDay: day });
  },

  // 打卡
  async onCheckin(e) {
    const type = e.currentTarget.dataset.type;
    const date = this.data.selectedDay.date;

    wx.showLoading({ title: '打卡中...' });

    try {
      const res = await app.api.request({
        url: '/api/v1/calendar/checkin',
        method: 'POST',
        data: {
          date,
          type
        }
      });

      if (res.code === 200) {
        wx.hideLoading();
        wx.showToast({ title: '打卡成功', icon: 'success' });
        
        // 更新状态
        if (date === this.data.todayInfo.date) {
          this.setData({
            [`todayCheckin.${type}`]: true
          });
        }

        // 刷新统计
        this.loadStatistics();
        this.loadCalendar();
      } else {
        wx.hideLoading();
        wx.showToast({ title: res.message || '打卡失败', icon: 'none' });
      }
    } catch (error) {
      console.error('打卡失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '打卡失败，请稍后重试', icon: 'none' });
    }
  },

  // 错误处理
  handleError(message) {
    this.setData({ loading: false });
    wx.showToast({ title: message, icon: 'none' });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: `佛历吉日 - ${this.data.todayInfo.lunar_date}`,
      path: '/pages/lunar-calendar/lunar-calendar'
    };
  }
});
