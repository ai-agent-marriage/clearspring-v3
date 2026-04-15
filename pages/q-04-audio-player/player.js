Page({
  data: {
    isPlaying: false,
    progress: 0,
    currentTime: '00:00',
    totalTime: '05:32',
    playMode: 0, // 0: 列表循环，1: 单曲循环，2: 随机播放
    playModeText: '列表循环',
    currentIndex: 0,
    playlist: [
      { id: 1, title: '晨钟暮鼓', duration: '05:32' },
      { id: 2, title: '静心梵音', duration: '04:18' },
      { id: 3, title: '禅茶一味', duration: '06:45' },
      { id: 4, title: '空山鸟语', duration: '03:56' },
      { id: 5, title: '月下禅思', duration: '07:21' }
    ]
  },

  onLoad() {
    // 初始化播放器
  },

  // 播放/暂停
  onPlayPause() {
    this.setData({
      isPlaying: !this.data.isPlaying
    });
    // TODO: 调用音频播放 API
  },

  // 上一首
  onPrevious() {
    const newIndex = this.data.currentIndex > 0 ? this.data.currentIndex - 1 : this.data.playlist.length - 1;
    this.setData({
      currentIndex: newIndex,
      progress: 0,
      currentTime: '00:00'
    });
  },

  // 下一首
  onNext() {
    const newIndex = this.data.currentIndex < this.data.playlist.length - 1 ? this.data.currentIndex + 1 : 0;
    this.setData({
      currentIndex: newIndex,
      progress: 0,
      currentTime: '00:00'
    });
  },

  // 选择歌曲
  onSelectTrack(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      isPlaying: true,
      progress: 0,
      currentTime: '00:00'
    });
  },

  // 切换播放模式
  togglePlayMode() {
    const modes = ['列表循环', '单曲循环', '随机播放'];
    const newMode = (this.data.playMode + 1) % 3;
    this.setData({
      playMode: newMode,
      playModeText: modes[newMode]
    });
  }
});
