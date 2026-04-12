/**
 * Q-04 梵音播放页测试用例
 * 文件：__tests__/q-04-audio-player.test.js
 */

describe('Q-04 梵音播放页测试', () => {
  beforeEach(() => {
    wx.clearStorageSync();
  });

  test('1. 页面正常加载', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    expect(page).toBeDefined();
    expect(page.data.isPlaying).toBe(false);
  });

  test('2. 播放列表加载', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.loadPlaylist();
    expect(page.data.playlist.length).toBeGreaterThan(0);
  });

  test('3. 切换播放/暂停', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.data.isPlaying = false;
    
    page.togglePlay();
    expect(page.audioPlayer.play).toHaveBeenCalled();
    
    page.data.isPlaying = true;
    page.togglePlay();
    expect(page.audioPlayer.pause).toHaveBeenCalled();
  });

  test('4. 播放上一曲', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.data.playlist = [
      { id: 1, title: '曲目 1' },
      { id: 2, title: '曲目 2' },
      { id: 3, title: '曲目 3' }
    ];
    page.data.currentAudio = { id: 2 };
    
    page.playPrevious();
    expect(page.data.currentAudio.id).toBe(1);
  });

  test('5. 播放下一曲（循环模式）', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.data.playlist = [
      { id: 1, title: '曲目 1' },
      { id: 2, title: '曲目 2' }
    ];
    page.data.currentAudio = { id: 1 };
    page.data.playMode = 'loop';
    
    page.playNext();
    expect(page.data.currentAudio.id).toBe(2);
  });

  test('6. 播放下一曲（随机模式）', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.data.playlist = [
      { id: 1, title: '曲目 1' },
      { id: 2, title: '曲目 2' }
    ];
    page.data.playMode = 'random';
    
    page.playNext();
    // 随机模式应该调用 Math.random
    expect(page.data.currentAudio.id).toBeDefined();
  });

  test('7. 切换播放模式', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    
    page.togglePlayMode();
    expect(page.data.playMode).toBe('random');
    expect(page.data.playModeIcon).toBe('🔀');
    
    page.togglePlayMode();
    expect(page.data.playMode).toBe('single');
    expect(page.data.playModeIcon).toBe('🔂');
    
    page.togglePlayMode();
    expect(page.data.playMode).toBe('loop');
  });

  test('8. 切换收藏状态', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.data.isFavorite = false;
    
    page.toggleFavorite();
    expect(page.data.isFavorite).toBe(true);
    
    page.toggleFavorite();
    expect(page.data.isFavorite).toBe(false);
  });

  test('9. 进度定时器管理', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    
    page.startProgressTimer();
    expect(page.progressTimer).toBeDefined();
    
    page.stopProgressTimer();
    expect(page.progressTimer).toBeNull();
  });

  test('10. 格式化时间', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    
    expect(page.formatTime(0)).toBe('00:00');
    expect(page.formatTime(65)).toBe('01:05');
    expect(page.formatTime(3661)).toBe('61:01');
  });

  test('11. 定时关闭功能', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    
    page.setTimer({ currentTarget: { dataset: { duration: 900000 } } });
    expect(page.data.timerDuration).toBe(900000);
    expect(page.data.showTimerModal).toBe(false);
  });

  test('12. 播放列表项点击', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    const item = { id: 2, title: '测试曲目' };
    
    page.onPlaylistItemTap({ currentTarget: { dataset: { item } } });
    expect(page.data.currentAudio.id).toBe(2);
  });

  test('13. 分享功能', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.shareAudio();
    expect(wx.showShareMenu).toHaveBeenCalled();
  });

  test('14. 返回功能', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.goBack();
    expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 1 });
  });

  test('15. 页面分享', () => {
    const page = getInstance('/pages/q-04-audio-player/q-04-audio-player');
    page.data.currentAudio = { id: 1, title: '大悲咒' };
    
    const shareMessage = page.onShareAppMessage();
    expect(shareMessage.title).toContain('大悲咒');
    expect(shareMessage.path).toContain('id=1');
  });
});
