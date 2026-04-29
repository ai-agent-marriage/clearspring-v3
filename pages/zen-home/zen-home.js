// 禅理功能聚合主页
const app = getApp();

Page({
  data: {
    // 今日日期
    todayDate: '',
    // 每日一禅内容
    dailyWisdom: {
      id: 'wisdom_001',
      text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
      source: '金刚经',
      isCollected: false
    },
    // 收藏状态
    isCollected: false
  },

  onLoad() {
    // 设置今日日期
    this.setTodayDate();
    
    // 加载每日一禅
    this.loadDailyWisdom();
    
    // 检查收藏状态
    this.checkCollectStatus();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadDailyWisdom();
  },

  // 设置今日日期
  setTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.setData({
      todayDate: `${year}年${month}月${day}日`
    });
  },

  // 加载每日一禅
  loadDailyWisdom() {
    // 从云函数或本地存储加载每日一禅
    const savedWisdom = wx.getStorageSync('dailyWisdom');
    const savedDate = wx.getStorageSync('dailyWisdomDate');
    
    const today = new Date().toDateString();
    
    if (savedWisdom && savedDate === today) {
      // 使用缓存的今日禅理
      this.setData({ dailyWisdom: savedWisdom });
    } else {
      // 加载新的每日禅理（这里使用模拟数据）
      const wisdoms = [
        { id: 'wisdom_001', text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', source: '金刚经' },
        { id: 'wisdom_002', text: '菩提本无树，明镜亦非台，本来无一物，何处惹尘埃。', source: '六祖坛经' },
        { id: 'wisdom_003', text: '色不异空，空不异色，色即是空，空即是色。', source: '心经' },
        { id: 'wisdom_004', text: '人生得意须尽欢，莫使金樽空对月。', source: '李白' },
        { id: 'wisdom_005', text: '行到水穷处，坐看云起时。', source: '王维' }
      ];
      
      // 根据日期选择禅理（简单哈希）
      const index = new Date().getDate() % wisdoms.length;
      const wisdom = wisdoms[index];
      
      this.setData({ dailyWisdom: wisdom });
      
      // 保存到本地存储
      wx.setStorageSync('dailyWisdom', wisdom);
      wx.setStorageSync('dailyWisdomDate', today);
    }
  },

  // 检查收藏状态
  checkCollectStatus() {
    const collectedIds = wx.getStorageSync('collectedWisdomIds') || [];
    const isCollected = collectedIds.includes(this.data.dailyWisdom.id);
    this.setData({ isCollected });
  },

  // 分享禅理
  shareWisdom() {
    const wisdom = this.data.dailyWisdom;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    // 设置分享内容
    wx.setClipboardData({
      data: `${wisdom.text} —— ${wisdom.source}`,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // 收藏禅理
  collectWisdom() {
    const wisdomId = this.data.dailyWisdom.id;
    let collectedIds = wx.getStorageSync('collectedWisdomIds') || [];
    
    if (this.data.isCollected) {
      // 取消收藏
      collectedIds = collectedIds.filter(id => id !== wisdomId);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      // 添加收藏
      collectedIds.push(wisdomId);
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }
    
    wx.setStorageSync('collectedWisdomIds', collectedIds);
    this.setData({ isCollected: !this.data.isCollected });
  },

  // 打开设置
  openSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  // 导航到物种查询
  navigateToSpecies() {
    wx.navigateTo({ url: '/pages/species-list/species-list' });
  },

  // 导航到功德证书
  navigateToCerts() {
    wx.navigateTo({ url: '/pages/profile/certs' });
  },

  // 导航到修行数据
  navigateToPractice() {
    wx.navigateTo({ url: '/pages/practice-data/practice-data' });
  },

  // 导航到梵音收听
  navigateToAudio() {
    wx.navigateTo({ url: '/pages/audio-player/audio-player' });
  },

  // 导航到禅理收藏
  navigateToCollect() {
    wx.navigateTo({ url: '/pages/wisdom-collect/wisdom-collect' });
  },

  // 导航到科普专区
  navigateToWiki() {
    wx.navigateTo({ url: '/pages/wiki/wiki' });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
