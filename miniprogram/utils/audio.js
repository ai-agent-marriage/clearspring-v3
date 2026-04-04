// utils/audio.js - 音频播放工具类
const config = require('../config.js');

class AudioPlayer {
  constructor() {
    // 创建内部音频上下文
    this.audio = wx.createInnerAudioContext();
    this.audio.autoplay = false;
    
    // 播放开始时间
    this.startTime = 0;
    
    // 音频总时长 (秒)
    this.totalDuration = 0;
    
    // 当前播放的音频信息
    this.currentAudio = null;
    
    // 播放状态
    this.isPlaying = false;
    
    // 监听音频加载完成
    this.audio.onCanplay(() => {
      this.totalDuration = this.audio.duration;
      console.log('音频加载完成，时长:', this.totalDuration, '秒');
    });
    
    // 监听播放
    this.audio.onPlay(() => {
      this.isPlaying = true;
      this.startTime = Date.now();
      console.log('音频开始播放');
    });
    
    // 监听暂停
    this.audio.onPause(() => {
      this.isPlaying = false;
      console.log('音频暂停');
    });
    
    // 监听停止
    this.audio.onStop(() => {
      this.isPlaying = false;
      this.startTime = 0;
      console.log('音频停止');
    });
    
    // 监听播放结束
    this.audio.onEnded(() => {
      this.isPlaying = false;
      this.startTime = 0;
      console.log('音频播放结束');
    });
    
    // 监听错误
    this.audio.onError((err) => {
      console.error('音频播放错误:', err);
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
    });
  }
  
  /**
   * 播放音频
   * @param {String} src - 音频地址
   */
  play(src) {
    // 如果正在播放其他音频，先停止
    if (this.isPlaying && this.currentAudio !== src) {
      this.stop();
    }
    
    this.currentAudio = src;
    this.audio.src = src;
    this.audio.play();
  }
  
  /**
   * 暂停播放
   */
  pause() {
    this.audio.pause();
  }
  
  /**
   * 继续播放
   */
  resume() {
    this.audio.play();
  }
  
  /**
   * 停止播放
   */
  stop() {
    this.audio.stop();
    this.startTime = 0;
    this.totalDuration = 0;
  }
  
  /**
   * 跳转到指定位置
   * @param {Number} position - 位置 (秒)
   */
  seek(position) {
    this.audio.seek(position);
  }
  
  /**
   * 设置音量
   * @param {Number} volume - 音量 (0-1)
   */
  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }
  
  /**
   * 获取当前播放位置
   * @returns {Number} 当前位置 (秒)
   */
  getCurrentTime() {
    return this.audio.currentTime;
  }
  
  /**
   * 获取音频时长
   * @returns {Number} 总时长 (秒)
   */
  getDuration() {
    return this.audio.duration;
  }
  
  /**
   * 判断是否是有效收听
   * 有效收听定义：收听时长 >= 总时长的 80%
   * @returns {Boolean}
   */
  isValidListen() {
    if (this.totalDuration <= 0) {
      return false;
    }
    
    const listened = (Date.now() - this.startTime) / 1000;
    const threshold = this.totalDuration * config.audio.validListenRatio;
    
    return listened >= threshold;
  }
  
  /**
   * 获取收听进度
   * @returns {Number} 进度 (0-1)
   */
  getProgress() {
    if (this.totalDuration <= 0) {
      return 0;
    }
    
    const listened = (Date.now() - this.startTime) / 1000;
    return Math.min(1, listened / this.totalDuration);
  }
  
  /**
   * 销毁播放器
   */
  destroy() {
    this.stop();
    this.audio.destroy();
  }
}

// 导出单例
module.exports = new AudioPlayer();
