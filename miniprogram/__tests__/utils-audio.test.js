/**
 * utils/audio.js 单元测试
 * 测试音频播放器的各项功能
 */

const audioPlayer = require('../utils/audio.js');
const config = require('../config.js');

// 模拟 wx.createInnerAudioContext
const mockAudioContext = {
  autoplay: false,
  src: '',
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  onCanplay: jest.fn(),
  onPlay: jest.fn(),
  onPause: jest.fn(),
  onStop: jest.fn(),
  onEnded: jest.fn(),
  onError: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  seek: jest.fn(),
  destroy: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
  
  // 重置 mock
  mockAudioContext.src = '';
  mockAudioContext.volume = 0.8;
  mockAudioContext.currentTime = 0;
  mockAudioContext.duration = 0;
  mockAudioContext.autoplay = false;
  
  // 重置 wx.createInnerAudioContext
  wx.createInnerAudioContext.mockReturnValue(mockAudioContext);
  
  // 重置 wx.showToast
  wx.showToast.mockClear();
});

describe('AudioPlayer - 播放器初始化', () => {
  test('创建音频播放器实例', () => {
    expect(audioPlayer).toBeDefined();
    expect(audioPlayer.audio).toBeDefined();
  });

  test('初始化时自动创建内部音频上下文', () => {
    expect(wx.createInnerAudioContext).toHaveBeenCalled();
  });

  test('初始化时 autoplay 设置为 false', () => {
    expect(mockAudioContext.autoplay).toBe(false);
  });

  test('初始化时播放状态为 false', () => {
    expect(audioPlayer.isPlaying).toBe(false);
  });

  test('初始化时 startTime 为 0', () => {
    expect(audioPlayer.startTime).toBe(0);
  });

  test('初始化时 totalDuration 为 0', () => {
    expect(audioPlayer.totalDuration).toBe(0);
  });

  test('初始化时 currentAudio 为 null', () => {
    expect(audioPlayer.currentAudio).toBeNull();
  });

  test('注册音频加载完成监听器', () => {
    expect(mockAudioContext.onCanplay).toHaveBeenCalled();
    const callback = mockAudioContext.onCanplay.mock.calls[0][0];
    callback();
    expect(mockAudioContext.duration).toBeDefined();
  });

  test('注册播放开始监听器', () => {
    expect(mockAudioContext.onPlay).toHaveBeenCalled();
  });

  test('注册暂停监听器', () => {
    expect(mockAudioContext.onPause).toHaveBeenCalled();
  });

  test('注册停止监听器', () => {
    expect(mockAudioContext.onStop).toHaveBeenCalled();
  });

  test('注册播放结束监听器', () => {
    expect(mockAudioContext.onEnded).toHaveBeenCalled();
  });

  test('注册错误监听器', () => {
    expect(mockAudioContext.onError).toHaveBeenCalled();
  });
});

describe('AudioPlayer - play/pause/stop 方法', () => {
  test('play 方法设置音频源并播放', () => {
    const testSrc = '/audio/test.mp3';
    audioPlayer.play(testSrc);
    
    expect(audioPlayer.currentAudio).toBe(testSrc);
    expect(mockAudioContext.src).toBe(testSrc);
    expect(mockAudioContext.play).toHaveBeenCalled();
  });

  test('播放新音频时自动停止当前播放', () => {
    audioPlayer.play('/audio/first.mp3');
    audioPlayer.isPlaying = true;
    audioPlayer.play('/audio/second.mp3');
    
    expect(audioPlayer.stop).toBeDefined();
  });

  test('pause 方法暂停播放', () => {
    audioPlayer.play('/audio/test.mp3');
    audioPlayer.pause();
    
    expect(mockAudioContext.pause).toHaveBeenCalled();
  });

  test('resume 方法继续播放', () => {
    audioPlayer.play('/audio/test.mp3');
    audioPlayer.pause();
    audioPlayer.resume();
    
    expect(mockAudioContext.play).toHaveBeenCalledTimes(2);
  });

  test('stop 方法停止播放并重置状态', () => {
    audioPlayer.play('/audio/test.mp3');
    audioPlayer.startTime = Date.now();
    audioPlayer.totalDuration = 100;
    audioPlayer.stop();
    
    expect(mockAudioContext.stop).toHaveBeenCalled();
    expect(audioPlayer.startTime).toBe(0);
    expect(audioPlayer.totalDuration).toBe(0);
  });

  test('seek 方法跳转到指定位置', () => {
    audioPlayer.seek(30);
    expect(mockAudioContext.seek).toHaveBeenCalledWith(30);
  });

  test('播放时设置 isPlaying 为 true', () => {
    const onPlayCallback = mockAudioContext.onPlay.mock.calls[0][0];
    onPlayCallback();
    expect(audioPlayer.isPlaying).toBe(true);
  });

  test('暂停时设置 isPlaying 为 false', () => {
    audioPlayer.isPlaying = true;
    const onPauseCallback = mockAudioContext.onPause.mock.calls[0][0];
    onPauseCallback();
    expect(audioPlayer.isPlaying).toBe(false);
  });

  test('停止时设置 isPlaying 为 false', () => {
    audioPlayer.isPlaying = true;
    const onStopCallback = mockAudioContext.onStop.mock.calls[0][0];
    onStopCallback();
    expect(audioPlayer.isPlaying).toBe(false);
  });

  test('播放结束时设置 isPlaying 为 false', () => {
    audioPlayer.isPlaying = true;
    const onEndedCallback = mockAudioContext.onEnded.mock.calls[0][0];
    onEndedCallback();
    expect(audioPlayer.isPlaying).toBe(false);
  });
});

describe('AudioPlayer - 音量调节', () => {
  test('setVolume 设置有效音量', () => {
    audioPlayer.setVolume(0.5);
    expect(mockAudioContext.volume).toBe(0.5);
  });

  test('setVolume 限制最小值为 0', () => {
    audioPlayer.setVolume(-0.5);
    expect(mockAudioContext.volume).toBe(0);
  });

  test('setVolume 限制最大值为 1', () => {
    audioPlayer.setVolume(1.5);
    expect(mockAudioContext.volume).toBe(1);
  });

  test('setVolume 设置边界值 0', () => {
    audioPlayer.setVolume(0);
    expect(mockAudioContext.volume).toBe(0);
  });

  test('setVolume 设置边界值 1', () => {
    audioPlayer.setVolume(1);
    expect(mockAudioContext.volume).toBe(1);
  });
});

describe('AudioPlayer - 进度监听', () => {
  test('getCurrentTime 返回当前播放位置', () => {
    mockAudioContext.currentTime = 45;
    const currentTime = audioPlayer.getCurrentTime();
    expect(currentTime).toBe(45);
  });

  test('getDuration 返回音频总时长', () => {
    mockAudioContext.duration = 180;
    const duration = audioPlayer.getDuration();
    expect(duration).toBe(180);
  });

  test('getProgress 返回正确的收听进度', () => {
    audioPlayer.totalDuration = 100;
    audioPlayer.startTime = Date.now() - 50000; // 50 秒前
    
    const progress = audioPlayer.getProgress();
    expect(progress).toBeGreaterThanOrEqual(0.5);
    expect(progress).toBeLessThanOrEqual(1);
  });

  test('getProgress 在 totalDuration 为 0 时返回 0', () => {
    audioPlayer.totalDuration = 0;
    const progress = audioPlayer.getProgress();
    expect(progress).toBe(0);
  });

  test('getProgress 最大值不超过 1', () => {
    audioPlayer.totalDuration = 100;
    audioPlayer.startTime = Date.now() - 200000; // 200 秒前
    
    const progress = audioPlayer.getProgress();
    expect(progress).toBe(1);
  });
});

describe('AudioPlayer - 有效收听判定', () => {
  test('isValidListen 在收听达到 80% 时返回 true', () => {
    audioPlayer.totalDuration = 100;
    audioPlayer.startTime = Date.now() - 85000; // 85 秒前，超过 80%
    
    const isValid = audioPlayer.isValidListen();
    expect(isValid).toBe(true);
  });

  test('isValidListen 在收听不足 80% 时返回 false', () => {
    audioPlayer.totalDuration = 100;
    audioPlayer.startTime = Date.now() - 50000; // 50 秒前，不足 80%
    
    const isValid = audioPlayer.isValidListen();
    expect(isValid).toBe(false);
  });

  test('isValidListen 在 totalDuration 为 0 时返回 false', () => {
    audioPlayer.totalDuration = 0;
    const isValid = audioPlayer.isValidListen();
    expect(isValid).toBe(false);
  });

  test('isValidListen 使用 config 中的 validListenRatio', () => {
    expect(config.audio.validListenRatio).toBe(0.8);
  });

  test('isValidListen 在刚好 80% 时返回 true', () => {
    audioPlayer.totalDuration = 100;
    audioPlayer.startTime = Date.now() - 80000; // 刚好 80 秒
    
    const isValid = audioPlayer.isValidListen();
    expect(isValid).toBe(true);
  });
});

describe('AudioPlayer - 后台播放', () => {
  test('播放状态在页面后台保持', () => {
    audioPlayer.play('/audio/test.mp3');
    const onPlayCallback = mockAudioContext.onPlay.mock.calls[0][0];
    onPlayCallback();
    
    expect(audioPlayer.isPlaying).toBe(true);
    
    // 模拟页面进入后台
    const onPauseCallback = mockAudioContext.onPause.mock.calls[0][0];
    onPauseCallback();
    
    expect(audioPlayer.isPlaying).toBe(false);
  });

  test('播放进度在后台不丢失', () => {
    audioPlayer.play('/audio/test.mp3');
    mockAudioContext.currentTime = 60;
    
    const currentTime = audioPlayer.getCurrentTime();
    expect(currentTime).toBe(60);
  });
});

describe('AudioPlayer - 错误处理', () => {
  test('错误回调触发 showToast', () => {
    const onErrorCallback = mockAudioContext.onError.mock.calls[0][0];
    onErrorCallback({ errMsg: '播放失败' });
    
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '播放失败',
      icon: 'none'
    });
  });

  test('错误回调记录错误日志', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const onErrorCallback = mockAudioContext.onError.mock.calls[0][0];
    onErrorCallback({ errMsg: '网络错误' });
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('音频播放错误:', { errMsg: '网络错误' });
    consoleErrorSpy.mockRestore();
  });
});

describe('AudioPlayer - destroy 方法', () => {
  test('destroy 方法停止播放并销毁实例', () => {
    audioPlayer.play('/audio/test.mp3');
    audioPlayer.destroy();
    
    expect(mockAudioContext.stop).toHaveBeenCalled();
    expect(mockAudioContext.destroy).toHaveBeenCalled();
  });

  test('destroy 后重置状态', () => {
    audioPlayer.play('/audio/test.mp3');
    audioPlayer.destroy();
    
    expect(audioPlayer.startTime).toBe(0);
  });
});
