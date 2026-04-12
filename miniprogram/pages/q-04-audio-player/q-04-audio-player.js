// pages/q-04-audio-player/q-04-audio-player.js

const audioUtil = require('../../utils/audio.js');

Page({
  data: {
    // 当前播放音频
    currentAudio: {
      id: 1,
      title: '大悲咒',
      artist: '法师唱诵',
      cover: '/assets/images/audio-cover-1.jpg',
      src: ''
    },
    
    // 播放列表
    playlist: [],
    
    // 播放状态
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    
    // 播放模式
    playMode: 'loop', // loop, random, single
    playModeIcon: '🔁',
    playModeText: '循环',
    
    // 收藏状态
    isFavorite: false,
    
    // UI 状态
    showPlaylist: false,
    showTimerModal: false,
    timerDuration: 0
  },

  // 音频播放器实例
  audioPlayer: null,

  // 定时器
  progressTimer: null,
  sleepTimer: null,

  onLoad(options) {
    this.initAudioPlayer();
    this.loadPlaylist();
    
    // 如果有传入音频 ID，加载指定音频
    if (options.id) {
      this.loadAudioById(options.id);
    }
  },

  onReady() {
    console.log('Q-04 梵音播放页渲染完成');
  },

  onShow() {
    // 恢复播放状态
    this.restorePlayState();
  },

  onHide() {
    // 保存播放状态
    this.savePlayState();
  },

  onUnload() {
    // 清理定时器
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
    }
  },

  /**
   * 初始化音频播放器
   */
  initAudioPlayer() {
    this.audioPlayer = audioUtil.create();
    
    // 注册事件监听
    this.audioPlayer.onPlay(() => {
      this.setData({ isPlaying: true });
      this.startProgressTimer();
    });

    this.audioPlayer.onPause(() => {
      this.setData({ isPlaying: false });
      this.stopProgressTimer();
    });

    this.audioPlayer.onEnded(() => {
      this.handleAudioEnded();
    });

    this.audioPlayer.onError((error) => {
      console.error('音频播放错误:', error);
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
    });
  },

  /**
   * 加载播放列表
   */
  async loadPlaylist() {
    try {
      // 从云函数或本地加载播放列表
      const playlist = [
        { id: 1, title: '大悲咒', artist: '法师唱诵', cover: '/assets/images/audio-cover-1.jpg', src: '' },
        { id: 2, title: '心经', artist: '法师唱诵', cover: '/assets/images/audio-cover-2.jpg', src: '' },
        { id: 3, title: '金刚经', artist: '法师唱诵', cover: '/assets/images/audio-cover-3.jpg', src: '' },
        { id: 4, title: '阿弥陀佛', artist: '法师唱诵', cover: '/assets/images/audio-cover-4.jpg', src: '' },
        { id: 5, title: '观音菩萨圣号', artist: '法师唱诵', cover: '/assets/images/audio-cover-5.jpg', src: '' }
      ];
      
      this.setData({ playlist });
      
      // 如果没有指定音频，播放第一首
      if (!this.data.currentAudio.src) {
        this.loadAudioById(playlist[0].id);
      }
    } catch (error) {
      console.error('加载播放列表失败:', error);
    }
  },

  /**
   * 根据 ID 加载音频
   */
  async loadAudioById(id) {
    try {
      const audio = this.data.playlist.find(item => item.id === id);
      if (audio) {
        this.setData({ currentAudio: audio });
        this.audioPlayer.setSrc(audio.src);
        this.updateFavoriteStatus(id);
      }
    } catch (error) {
      console.error('加载音频失败:', error);
    }
  },

  /**
   * 切换播放/暂停
   */
  togglePlay() {
    if (this.data.isPlaying) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play();
    }
  },

  /**
   * 播放上一曲
   */
  playPrevious() {
    const currentIndex = this.data.playlist.findIndex(item => item.id === this.data.currentAudio.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.data.playlist.length - 1;
    this.loadAudioById(this.data.playlist[previousIndex].id);
    this.audioPlayer.play();
  },

  /**
   * 播放下一曲
   */
  playNext() {
    const currentIndex = this.data.playlist.findIndex(item => item.id === this.data.currentAudio.id);
    let nextIndex;
    
    if (this.data.playMode === 'random') {
      nextIndex = Math.floor(Math.random() * this.data.playlist.length);
    } else {
      nextIndex = currentIndex < this.data.playlist.length - 1 ? currentIndex + 1 : 0;
    }
    
    this.loadAudioById(this.data.playlist[nextIndex].id);
    this.audioPlayer.play();
  },

  /**
   * 处理音频播放结束
   */
  handleAudioEnded() {
    if (this.data.playMode === 'single') {
      // 单曲循环
      this.audioPlayer.play();
    } else {
      // 播放下一曲
      this.playNext();
    }
  },

  /**
   * 切换播放模式
   */
  togglePlayMode() {
    const modes = ['loop', 'random', 'single'];
    const currentIndex = modes.indexOf(this.data.playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    const modeConfig = {
      loop: { icon: '🔁', text: '循环' },
      random: { icon: '🔀', text: '随机' },
      single: { icon: '🔂', text: '单曲' }
    };
    
    this.setData({
      playMode: nextMode,
      playModeIcon: modeConfig[nextMode].icon,
      playModeText: modeConfig[nextMode].text
    });
    
    wx.showToast({
      title: `已切换为${modeConfig[nextMode].text}模式`,
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 切换收藏状态
   */
  async toggleFavorite() {
    try {
      const isFavorite = !this.data.isFavorite;
      this.setData({ isFavorite });
      
      // 调用云函数更新收藏状态
      // await wx.cloud.callFunction({
      //   name: 'toggleFavorite',
      //   data: {
      //     audioId: this.data.currentAudio.id,
      //     isFavorite: isFavorite
      //   }
      // });
      
      wx.showToast({
        title: isFavorite ? '已收藏' : '已取消收藏',
        icon: 'none'
      });
    } catch (error) {
      console.error('切换收藏状态失败:', error);
    }
  },

  /**
   * 更新收藏状态
   */
  async updateFavoriteStatus(audioId) {
    try {
      // 从云函数或本地存储获取收藏状态
      const favorites = wx.getStorageSync('favorites') || [];
      const isFavorite = favorites.includes(audioId);
      this.setData({ isFavorite });
    } catch (error) {
      console.error('更新收藏状态失败:', error);
    }
  },

  /**
   * 开始进度定时器
   */
  startProgressTimer() {
    this.stopProgressTimer();
    this.progressTimer = setInterval(() => {
      const currentTime = this.audioPlayer.getCurrentTime();
      const duration = this.audioPlayer.getDuration();
      
      if (duration > 0) {
        const progress = (currentTime / duration) * 100;
        this.setData({
          currentTime,
          duration,
          progress
        });
      }
    }, 1000);
  },

  /**
   * 停止进度定时器
   */
  stopProgressTimer() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  },

  /**
   * 进度条点击
   */
  onProgressBarTap(e) {
    try {
      const query = wx.createSelectorQuery();
      query.select('.progress-bar').boundingClientRect((rect) => {
        const touchX = e.touches[0].clientX - rect.left;
        const progress = touchX / rect.width;
        const position = progress * this.data.duration;
        
        this.audioPlayer.seek(position);
        this.setData({ progress: progress * 100 });
      });
      query.exec();
    } catch (error) {
      console.error('进度条跳转失败:', error);
    }
  },

  /**
   * 播放列表项点击
   */
  onPlaylistItemTap(e) {
    const item = e.currentTarget.dataset.item;
    this.loadAudioById(item.id);
    this.audioPlayer.play();
  },

  /**
   * 切换播放列表显示
   */
  togglePlaylist() {
    this.setData({
      showPlaylist: !this.data.showPlaylist
    });
  },

  /**
   * 显示定时关闭
   */
  showTimer() {
    this.setData({
      showTimerModal: true
    });
  },

  /**
   * 关闭定时关闭弹窗
   */
  closeTimer() {
    this.setData({
      showTimerModal: false
    });
  },

  /**
   * 设置定时关闭
   */
  setTimer(e) {
    const duration = e.currentTarget.dataset.duration;
    this.setData({
      timerDuration: duration,
      showTimerModal: false
    });
    
    // 清除之前的定时器
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
    }
    
    // 设置新的定时器
    if (duration > 0) {
      this.sleepTimer = setTimeout(() => {
        if (this.data.isPlaying) {
          this.audioPlayer.pause();
        }
        wx.showToast({
          title: '定时关闭已触发',
          icon: 'none'
        });
      }, duration);
      
      wx.showToast({
        title: `已设置${duration / 60000}分钟后关闭`,
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: '已关闭定时',
        icon: 'none'
      });
    }
  },

  /**
   * 分享音频
   */
  shareAudio() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: '点击右上角分享',
      icon: 'none'
    });
  },

  /**
   * 下载音频
   */
  async downloadAudio() {
    try {
      wx.showLoading({
        title: '下载中...'
      });
      
      // 下载文件
      const downloadTask = wx.downloadFile({
        url: this.data.currentAudio.src,
        success: (res) => {
          if (res.statusCode === 200) {
            // 保存文件
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: (saveRes) => {
                wx.hideLoading();
                wx.showToast({
                  title: '下载成功',
                  icon: 'success'
                });
              }
            });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          });
        }
      });
    } catch (error) {
      console.error('下载音频失败:', error);
      wx.hideLoading();
    }
  },

  /**
   * 显示更多选项
   */
  showMore() {
    wx.showActionSheet({
      itemList: ['查看专辑', '查看歌手', '举报', '其他'],
      success: (res) => {
        console.log('用户选择了:', res.tapIndex);
      }
    });
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
   * 格式化时间
   */
  formatTime(seconds) {
    if (!seconds) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * 保存播放状态
   */
  savePlayState() {
    const playState = {
      audioId: this.data.currentAudio.id,
      currentTime: this.data.currentTime,
      isPlaying: this.data.isPlaying,
      playMode: this.data.playMode
    };
    wx.setStorageSync('playState', playState);
  },

  /**
   * 恢复播放状态
   */
  restorePlayState() {
    const playState = wx.getStorageSync('playState');
    if (playState && playState.audioId) {
      // 恢复播放状态逻辑
    }
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: `我正在听${this.data.currentAudio.title}`,
      path: `/pages/q-04-audio-player/q-04-audio-player?id=${this.data.currentAudio.id}`
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: `我正在听${this.data.currentAudio.title}`,
      query: `id=${this.data.currentAudio.id}`
    };
  }
});
