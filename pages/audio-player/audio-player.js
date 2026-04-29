// 梵音音频播放详情页
const app = getApp();

Page({
  data: {
    // 当前播放曲目
    currentTrack: {
      id: 'track_001',
      name: '金刚般若波罗蜜经',
      artist: '清净梵音',
      coverUrl: '/images/album-cover-01.jpg',
      audioUrl: '/audio/jin-gang-jing.mp3',
      duration: '28:35'
    },
    // 播放列表
    tracks: [
      { id: 'track_001', name: '金刚般若波罗蜜经', artist: '清净梵音', duration: '28:35', coverUrl: '/images/album-cover-01.jpg', audioUrl: '/audio/jin-gang-jing.mp3' },
      { id: 'track_002', name: '心经', artist: '清净梵音', duration: '08:12', coverUrl: '/images/album-cover-02.jpg', audioUrl: '/audio/xin-jing.mp3' },
      { id: 'track_003', name: '往生咒', artist: '清净梵音', duration: '12:45', coverUrl: '/images/album-cover-03.jpg', audioUrl: '/audio/wang-sheng-zhou.mp3' },
      { id: 'track_004', name: '普门品', artist: '清净梵音', duration: '22:18', coverUrl: '/images/album-cover-04.jpg', audioUrl: '/audio/pu-men-pin.mp3' },
      { id: 'track_005', name: '药师咒', artist: '清净梵音', duration: '15:30', coverUrl: '/images/album-cover-05.jpg', audioUrl: '/audio/yao-shi-zhou.mp3' }
    ],
    // 播放状态
    isPlaying: false,
    isLooping: false,
    isShuffling: false,
    progress: 0,
    currentTime: '00:00',
    totalTime: '28:35',
    // 音频上下文
    audioContext: null
  },

  onLoad(options) {
    // 获取传递的曲目ID
    const trackId = options.id || 'track_001';
    this.setCurrentTrack(trackId);
    
    // 初始化音频上下文
    this.initAudioContext();
    
    // 恢复播放状态
    this.restorePlaybackState();
  },

  onShow() {
    // 页面显示时恢复播放
    if (this.data.isPlaying) {
      this.play();
    }
  },

  onHide() {
    // 页面隐藏时暂停播放
    if (this.data.isPlaying) {
      this.pause();
    }
  },

  onUnload() {
    // 页面卸载时停止播放
    this.stop();
  },

  // 设置当前曲目
  setCurrentTrack(trackId) {
    const track = this.data.tracks.find(t => t.id === trackId);
    if (track) {
      this.setData({
        currentTrack: track,
        totalTime: track.duration,
        progress: 0,
        currentTime: '00:00'
      });
    }
  },

  // 初始化音频上下文
  initAudioContext() {
    const audioContext = wx.createInnerAudioContext();
    audioContext.src = this.data.currentTrack.audioUrl;
    
    // 监听音频事件
    audioContext.onPlay(() => {
      this.setData({ isPlaying: true });
      this.startProgressTimer();
    });
    
    audioContext.onPause(() => {
      this.setData({ isPlaying: false });
      this.stopProgressTimer();
    });
    
    audioContext.onStop(() => {
      this.setData({ isPlaying: false, progress: 0, currentTime: '00:00' });
      this.stopProgressTimer();
    });
    
    audioContext.onEnded(() => {
      this.handleTrackEnd();
    });
    
    audioContext.onError((res) => {
      console.error('音频播放错误:', res);
      wx.showToast({ title: '播放失败', icon: 'none' });
    });
    
    this.setData({ audioContext });
  },

  // 播放
  play() {
    if (this.data.audioContext) {
      this.data.audioContext.play();
    }
  },

  // 暂停
  pause() {
    if (this.data.audioContext) {
      this.data.audioContext.pause();
    }
  },

  // 停止
  stop() {
    if (this.data.audioContext) {
      this.data.audioContext.stop();
    }
  },

  // 切换播放/暂停
  togglePlay() {
    if (this.data.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  // 上一首
  playPrevious() {
    const currentIndex = this.data.tracks.findIndex(t => t.id === this.data.currentTrack.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.data.tracks.length - 1;
    }
    this.switchTrack(this.data.tracks[prevIndex].id);
  },

  // 下一首
  playNext() {
    const currentIndex = this.data.tracks.findIndex(t => t.id === this.data.currentTrack.id);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= this.data.tracks.length) {
      nextIndex = 0;
    }
    this.switchTrack(this.data.tracks[nextIndex].id);
  },

  // 切换曲目
  switchTrack(trackId) {
    this.stop();
    this.setCurrentTrack(trackId);
    if (this.data.audioContext) {
      this.data.audioContext.src = this.data.currentTrack.audioUrl;
      this.play();
    }
  },

  // 选择曲目
  selectTrack(e) {
    const trackId = e.currentTarget.dataset.id;
    this.switchTrack(trackId);
  },

  // 处理曲目结束
  handleTrackEnd() {
    if (this.data.isLooping) {
      // 循环播放当前曲目
      this.seekTo(0);
      this.play();
    } else {
      // 播放下一首
      this.playNext();
    }
  },

  // 进度条变化
  onProgressChange(e) {
    const progress = e.detail.value;
    this.setData({ progress });
    
    // 计算目标时间
    const totalTimeSeconds = this.parseTime(this.data.totalTime);
    const targetTime = (progress / 100) * totalTimeSeconds;
    this.seekTo(targetTime);
  },

  // 跳转进度
  seekTo(seconds) {
    if (this.data.audioContext) {
      this.data.audioContext.seek(seconds);
    }
  },

  // 切换循环模式
  toggleLoop() {
    this.setData({ isLooping: !this.data.isLooping });
  },

  // 切换随机播放
  toggleShuffle() {
    this.setData({ isShuffling: !this.data.isShuffling });
  },

  // 启动进度计时器
  startProgressTimer() {
    this.progressTimer = setInterval(() => {
      if (this.data.audioContext) {
        const currentTime = this.data.audioContext.currentTime;
        const duration = this.data.audioContext.duration || 1;
        const progress = (currentTime / duration) * 100;
        
        this.setData({
          progress: Math.min(progress, 100),
          currentTime: this.formatTime(currentTime)
        });
      }
    }, 1000);
  },

  // 停止进度计时器
  stopProgressTimer() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 解析时间字符串
  parseTime(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 恢复播放状态
  restorePlaybackState() {
    // 从全局状态或本地存储恢复播放状态
    const savedState = wx.getStorageSync('audioPlayerState');
    if (savedState && savedState.trackId === this.data.currentTrack.id) {
      this.setData({
        progress: savedState.progress || 0,
        currentTime: savedState.currentTime || '00:00'
      });
    }
  },

  // 保存播放状态
  savePlaybackState() {
    wx.setStorageSync('audioPlayerState', {
      trackId: this.data.currentTrack.id,
      progress: this.data.progress,
      currentTime: this.data.currentTime
    });
  }
});
