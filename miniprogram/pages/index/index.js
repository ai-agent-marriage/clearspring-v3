// pages/index/index.js
const util = require('../../utils/util.js')

Page({
  data: {
    // 日期信息
    solarDate: '',
    lunarDate: '',
    ganzhi: '',
    
    // 宜忌
    suit: [],
    avoid: [],
    
    // 禅理
    zenQuote: '',
    
    // 打卡状态
    morningCheckIn: false,
    eveningCheckIn: false,
    
    // 功德林按钮状态
    meritCount: 0
  },

  onLoad() {
    this.initDateInfo()
    this.loadCheckInStatus()
    this.loadMeritCount()
  },

  onShow() {
    // 每次显示时刷新禅理
    this.setData({
      zenQuote: util.getRandomZenQuote()
    })
  },

  // 初始化日期信息
  initDateInfo() {
    const now = new Date()
    
    // 公历日期
    const solarDate = util.formatDate(now, 'YYYY 年 M 月 D 日 dddd')
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekDay = weekDays[now.getDay()]
    
    // 农历和干支
    const lunarInfo = util.getLunarDate(now)
    const buddhistDate = util.getBuddhistDate(now)
    
    // 宜忌
    const { suit, avoid } = util.getSuitAndAvoid(now)
    
    this.setData({
      solarDate: `${solarDate} ${weekDay}`,
      lunarDate: `${buddhistDate} ${lunarInfo.lunarMonth} ${lunarInfo.lunarDay}`,
      ganzhi: lunarInfo.ganzhi,
      suit,
      avoid,
      zenQuote: util.getRandomZenQuote()
    })
  },

  // 加载打卡状态
  loadCheckInStatus() {
    const today = util.formatDate(new Date(), 'YYYY-MM-DD')
    const checkInData = wx.getStorageSync('checkInData') || {}
    
    this.setData({
      morningCheckIn: checkInData[`${today}-morning`] || false,
      eveningCheckIn: checkInData[`${today}-evening`] || false
    })
  },

  // 加载功德数
  loadMeritCount() {
    const meritCount = wx.getStorageSync('meritCount') || 0
    this.setData({ meritCount })
  },

  // 晨起礼佛打卡
  onMorningCheckIn() {
    if (this.data.morningCheckIn) {
      wx.showToast({
        title: '今日已打卡',
        icon: 'none'
      })
      return
    }

    const today = util.formatDate(new Date(), 'YYYY-MM-DD')
    const checkInData = wx.getStorageSync('checkInData') || {}
    checkInData[`${today}-morning`] = true
    wx.setStorageSync('checkInData', checkInData)

    // 增加功德数
    this.addMerit(1)

    this.setData({ morningCheckIn: true })
    
    wx.showToast({
      title: '打卡成功',
      icon: 'success'
    })
  },

  // 晚间打坐打卡
  onEveningCheckIn() {
    if (this.data.eveningCheckIn) {
      wx.showToast({
        title: '今日已打卡',
        icon: 'none'
      })
      return
    }

    const today = util.formatDate(new Date(), 'YYYY-MM-DD')
    const checkInData = wx.getStorageSync('checkInData') || {}
    checkInData[`${today}-evening`] = true
    wx.setStorageSync('checkInData', checkInData)

    // 增加功德数
    this.addMerit(1)

    this.setData({ eveningCheckIn: true })
    
    wx.showToast({
      title: '打卡成功',
      icon: 'success'
    })
  },

  // 增加功德数
  addMerit(count = 1) {
    const newCount = this.data.meritCount + count
    wx.setStorageSync('meritCount', newCount)
    this.setData({ meritCount: newCount })
  },

  // 点击功德林按钮
  onMeritTap() {
    this.addMerit(1)
    
    wx.showToast({
      title: '功德 +1',
      icon: 'none'
    })

    // 震动反馈
    wx.vibrateShort({
      type: 'light'
    })
  },

  // 刷新禅理
  onRefreshZen() {
    this.setData({
      zenQuote: util.getRandomZenQuote()
    })
    
    wx.showToast({
      title: '已刷新',
      icon: 'none'
    })
  },

  // 收藏禅理
  onCollectZen() {
    const collectList = wx.getStorageSync('zenCollectList') || []
    collectList.push({
      content: this.data.zenQuote,
      createTime: Date.now()
    })
    wx.setStorageSync('zenCollectList', collectList)
    
    wx.showToast({
      title: '已收藏',
      icon: 'success'
    })
  }
})
