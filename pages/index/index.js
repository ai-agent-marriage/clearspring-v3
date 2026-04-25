Page({
  data: {
    // 佛历信息
    buddhistYear: 2568,
    solarYear: '',
    solarMonth: '',
    solarMonthStr: '',
    solarDate: '',
    lunarMonthStr: '',
    lunarDayStr: '',
    lunarDay: '',

    // 宜忌
    appropriate: '安身 守道',
    forbidden: '贪嗔 妄语',

    // 禅语
    quote: '心如工画师，能画诸世间。五蕴悉从生，无法而不造。',
    quoteSource: '华严经',

    // 打卡状态
    morningChecked: false,
    eveningChecked: false,

    // 功德统计
    consecutiveDays: 12,
    totalDays: 156
  },

  onLoad() {
    this.initDate();
    this.loadCheckinStatus();
  },

  onShow() {
    this.loadCheckinStatus();
  },

  /**
   * 初始化日期信息
   */
  initDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    // 佛历 = 公历 + 2494（简化计算）
    const buddhistYear = year + 2494;

    // 月份中文
    const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    const monthStr = month <= 10 ? `${month}月` : (month === 11 ? '冬月' : '腊月');

    // 简化农历显示（实际应调用农历库）
    const lunarMonthStr = monthNames[month - 1] ? `农历${monthNames[month - 1]}月` : '';
    const lunarDayStr = this.getLunarDay(date);

    this.setData({
      buddhistYear,
      solarYear: `${year}年`,
      solarMonth: `${month}`,
      solarMonthStr: monthStr,
      solarDate: `${date}`,
      lunarMonthStr,
      lunarDayStr,
      lunarDay: `${date}`
    });
  },

  /**
   * 简化农历日显示
   */
  getLunarDay(day) {
    const lunarDays = [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ];
    return lunarDays[(day - 1) % 30] || '初一';
  },

  /**
   * 加载今日打卡状态
   */
  loadCheckinStatus() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const morningKey = `checkin_morning_${today}`;
      const eveningKey = `checkin_evening_${today}`;
      const morningChecked = wx.getStorageSync(morningKey) || false;
      const eveningChecked = wx.getStorageSync(eveningKey) || false;

      this.setData({ morningChecked, eveningChecked });
    } catch (e) {
      // 静默失败
    }
  },

  /**
   * 晨起礼佛打卡
   */
  onMorningCheck() {
    if (this.data.morningChecked) return;

    const today = new Date().toISOString().slice(0, 10);
    wx.setStorageSync(`checkin_morning_${today}`, true);

    this.setData({ morningChecked: true });
    wx.showToast({ title: '晨起礼佛 ✓', icon: 'none' });

    // 更新累计数据
    this.updateStats();
  },

  /**
   * 晚间打坐打卡
   */
  onEveningCheck() {
    if (this.data.eveningChecked) return;

    const today = new Date().toISOString().slice(0, 10);
    wx.setStorageSync(`checkin_evening_${today}`, true);

    this.setData({ eveningChecked: true });
    wx.showToast({ title: '晚间打坐 ✓', icon: 'none' });

    // 更新累计数据
    this.updateStats();
  },

  /**
   * 更新功德统计
   */
  updateStats() {
    const total = this.data.morningChecked && this.data.eveningChecked
      ? this.data.totalDays + 1
      : this.data.totalDays;
    const consecutive = this.data.totalDays + 1;

    this.setData({
      totalDays: total,
      consecutiveDays: consecutive
    });
  },

  /**
   * 前往功德林
   */
  goToMeritForest() {
    wx.switchTab({ url: '/pages/merit-forest/merit-forest' });
  }
});
