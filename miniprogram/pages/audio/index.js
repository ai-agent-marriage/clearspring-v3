// pages/audio/index.js
const util = require('../../utils/util.js');
const AudioPlayer = require('../../utils/audio.js');

Page({
  data: {
    // 禅理
    zenQuote: '',
    
    // 音频列表
    audioList: []
  },

  onLoad() {
    this.initZenQuote();
    this.initAudioList();
  },

  onShow() {
    // 刷新禅理
    this.setData({
      zenQuote: util.getRandomZenQuote()
    });
  },

  // 初始化禅理
  initZenQuote() {
    this.setData({
      zenQuote: util.getRandomZenQuote()
    });
  },

  // 初始化音频列表
  initAudioList() {
    const audioList = [
      { id: 1, title: '大悲咒', listenCount: 1256, cover: '/assets/audio/dabeizhou.jpg', duration: '05:32' },
      { id: 2, title: '心经', listenCount: 987, cover: '/assets/audio/xinjing.jpg', duration: '03:45' },
      { id: 3, title: '金刚经', listenCount: 756, cover: '/assets/audio/jingangjing.jpg', duration: '12:20' },
      { id: 4, title: '地藏经', listenCount: 654, cover: '/assets/audio/dizangjing.jpg', duration: '15:10' },
      { id: 5, title: '阿弥陀经', listenCount: 543, cover: '/assets/audio/amituojing.jpg', duration: '08:15' },
      { id: 6, title: '药师经', listenCount: 432, cover: '/assets/audio/yaoshijing.jpg', duration: '10:30' },
      { id: 7, title: '普门品', listenCount: 398, cover: '/assets/audio/pumenpin.jpg', duration: '07:45' },
      { id: 8, title: '往生咒', listenCount: 321, cover: '/assets/audio/wangshengzhou.jpg', duration: '02:30' },
      { id: 9, title: '六字真言', listenCount: 289, cover: '/assets/audio/liuzizhenyan.jpg', duration: '04:20' }
    ];
    
    this.setData({ audioList });
  },

  // 刷新禅理
  onRefreshZen() {
    this.setData({
      zenQuote: util.getRandomZenQuote()
    });
    
    wx.showToast({
      title: '已刷新',
      icon: 'none'
    });
  },

  // 收藏禅理
  onCollectZen() {
    const collectList = wx.getStorageSync('zenCollectList') || [];
    collectList.push({
      content: this.data.zenQuote,
      createTime: Date.now()
    });
    wx.setStorageSync('zenCollectList', collectList);
    
    wx.showToast({
      title: '已收藏',
      icon: 'success'
    });
  },

  // 播放音频
  onPlayAudio(e) {
    const { id } = e.currentTarget.dataset;
    const audio = this.data.audioList.find(item => item.id === id);
    
    if (!audio) return;

    // 使用音频播放器
    AudioPlayer.play(`/assets/audio/${id}.mp3`);
    
    // 记录播放历史
    this.recordPlayHistory(audio);
    
    // 增加收听次数
    this.updateListenCount(id);
    
    wx.showToast({
      title: `正在播放：${audio.title}`,
      icon: 'none'
    });
  },

  // 记录播放历史
  recordPlayHistory(audio) {
    const playHistory = wx.getStorageSync('playHistory') || [];
    
    // 移除已存在的记录
    const filtered = playHistory.filter(item => item.id !== audio.id);
    
    // 添加到开头
    filtered.unshift({
      id: audio.id,
      title: audio.title,
      cover: audio.cover,
      playTime: Date.now()
    });
    
    // 保留最近 50 条
    const limited = filtered.slice(0, 50);
    
    wx.setStorageSync('playHistory', limited);
  },

  // 更新收听次数
  updateListenCount(id) {
    const audioList = this.data.audioList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          listenCount: item.listenCount + 1
        };
      }
      return item;
    });
    
    this.setData({ audioList });
  },

  // 跳转播放记录
  goToPlayHistory() {
    wx.navigateTo({
      url: '/pages/audio/history/index'
    });
  },

  // 暂停播放
  onPause() {
    AudioPlayer.pause();
    wx.showToast({
      title: '已暂停',
      icon: 'none'
    });
  }
});
