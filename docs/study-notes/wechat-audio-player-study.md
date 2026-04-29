# wechat-audio-player 播放器 UI 学习笔记

## 1. 项目概览

**项目地址**: https://github.com/xiaohuoni/wechat-audio-player

**核心功能**: 微信小程序音频播放器 UI 组件

**许可证**: MIT

**技术特点**:
- 环形进度条 canvas 绘制
- 精美的播放控制 UI
- 流畅的交互动画
- 可复用的组件设计

**适用场景**:
- 音乐播放器
- 音频课程
- 冥想/白噪音应用
- 播客播放器

**注意**: 原项目仓库可能已归档或迁移，本笔记基于项目描述和微信小程序音频播放器通用实践整理。

---

## 2. 安装配置步骤

### 2.1 通过 Git 获取（如可用）

```bash
git clone https://github.com/xiaohuoni/wechat-audio-player.git
# 将组件目录拷贝到项目中
```

### 2.2 手动创建组件结构

```
components/
└── audio-player/
    ├── index.js
    ├── index.json
    ├── index.wxml
    ├── index.wxss
    └── utils/
        └── canvas-drawer.js
```

### 2.3 引入组件

```json
// 页面的 json 文件
{
  "usingComponents": {
    "audio-player": "/components/audio-player/index"
  }
}
```

### 2.4 基础使用

```xml
<!-- 页面 wxml -->
<audio-player
  src="{{audioSrc}}"
  cover="{{coverUrl}}"
  title="{{title}}"
  artist="{{artist}}"
  bind:play="onPlay"
  bind:pause="onPause"
  bind:end="onEnd"
/>
```

---

## 3. 环形进度条 Canvas 绘制

### 3.1 Canvas 2D 实现（推荐）

```javascript
// components/audio-player/index.js
Component({
  properties: {
    progress: {
      type: Number,
      value: 0,
      observer: 'drawProgress'
    },
    size: {
      type: Number,
      value: 300
    },
    strokeWidth: {
      type: Number,
      value: 8
    },
    progressColor: {
      type: String,
      value: '#07c160'
    },
    bgColor: {
      type: String,
      value: '#e5e5e5'
    }
  },
  
  data: {
    canvasId: 'audioProgress'
  },
  
  lifetimes: {
    attached() {
      this.initCanvas();
    }
  },
  
  methods: {
    // 初始化 Canvas
    initCanvas() {
      const query = this.createSelectorQuery();
      query.select(`#${this.data.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res[0]) {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            
            // 设置高清屏
            const dpr = wx.getSystemInfoSync().pixelRatio;
            canvas.width = res[0].width * dpr;
            canvas.height = res[0].height * dpr;
            ctx.scale(dpr, dpr);
            
            this.canvas = canvas;
            this.ctx = ctx;
            
            // 绘制初始状态
            this.drawProgress(this.data.progress);
          }
        });
    },
    
    // 绘制环形进度条
    drawProgress(progress) {
      if (!this.ctx) return;
      
      const { size, strokeWidth, progressColor, bgColor } = this.data;
      const center = size / 2;
      const radius = center - strokeWidth;
      
      const ctx = this.ctx;
      ctx.clearRect(0, 0, size, size);
      
      // 绘制背景圆环
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // 绘制进度圆弧（从 -90 度开始，顺时针）
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (progress / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.strokeStyle = progressColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
});
```

```xml
<!-- components/audio-player/index.wxml -->
<view class="audio-player" style="width: {{size}}px; height: {{size}}px;">
  <canvas
    type="2d"
    id="{{canvasId}}"
    class="progress-canvas"
    style="width: {{size}}px; height: {{size}}px;"
  />
  
  <!-- 中心内容（专辑封面） -->
  <view class="center-content">
    <image class="cover" src="{{cover}}" mode="aspectFill" />
  </view>
</view>
```

```css
/* components/audio-player/index.wxss */
.audio-player {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.center-content {
  position: relative;
  z-index: 1;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.cover {
  width: 100%;
  height: 100%;
}

/* 播放时旋转动画 */
.cover.playing {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 3.2 带渐变效果的环形进度条

```javascript
// 绘制渐变环形进度条
drawGradientProgress(progress) {
  if (!this.ctx) return;
  
  const { size, strokeWidth } = this.data;
  const center = size / 2;
  const radius = center - strokeWidth;
  
  const ctx = this.ctx;
  ctx.clearRect(0, 0, size, size);
  
  // 创建渐变色
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#07c160');
  gradient.addColorStop(0.5, '#00b578');
  gradient.addColorStop(1, '#009a5e');
  
  // 绘制背景圆环
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#e5e5e5';
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  
  // 绘制渐变进度圆弧
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (progress / 100) * 2 * Math.PI;
  
  ctx.beginPath();
  ctx.arc(center, center, radius, startAngle, endAngle);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.stroke();
}
```

### 3.3 双环进度条（播放 + 缓冲）

```javascript
// 绘制双环进度条
drawDoubleRingProgress(playProgress, bufferProgress) {
  if (!this.ctx) return;
  
  const { size, strokeWidth } = this.data;
  const center = size / 2;
  const outerRadius = center - strokeWidth;
  const innerRadius = outerRadius - strokeWidth * 1.5;
  
  const ctx = this.ctx;
  ctx.clearRect(0, 0, size, size);
  
  // 外环：缓冲进度
  ctx.beginPath();
  ctx.arc(center, center, outerRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#e5e5e5';
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  
  const bufferEndAngle = -Math.PI / 2 + (bufferProgress / 100) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(center, center, outerRadius, -Math.PI / 2, bufferEndAngle);
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  
  // 内环：播放进度
  ctx.beginPath();
  ctx.arc(center, center, innerRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  
  const playEndAngle = -Math.PI / 2 + (playProgress / 100) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(center, center, innerRadius, -Math.PI / 2, playEndAngle);
  ctx.strokeStyle = '#07c160';
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.stroke();
}
```

---

## 4. 播放控制 UI 设计

### 4.1 完整播放器组件

```xml
<!-- components/audio-player/index.wxml -->
<view class="player-container">
  <!-- 顶部导航 -->
  <view class="header">
    <view class="btn-back" bind:tap="onBack">
      <text class="icon">❮</text>
    </view>
    <text class="title">正在播放</text>
    <view class="btn-more" bind:tap="onMore">
      <text class="icon">⋮</text>
    </view>
  </view>
  
  <!-- 专辑封面区域 -->
  <view class="cover-section">
    <view class="cover-wrapper {{isPlaying ? 'playing' : ''}}">
      <canvas
        type="2d"
        id="progressCanvas"
        class="progress-canvas"
      />
      <image 
        class="cover-image" 
        src="{{cover}}" 
        mode="aspectFill"
        bind:tap="onTogglePlay"
      />
    </view>
  </view>
  
  <!-- 歌曲信息 -->
  <view class="song-info">
    <text class="song-title">{{title}}</text>
    <text class="song-artist">{{artist}}</text>
  </view>
  
  <!-- 进度条 -->
  <view class="progress-section">
    <text class="time">{{formatTime(currentTime)}}</text>
    <slider
      class="progress-slider"
      value="{{progress}}"
      bind:change="onSeek"
      bind:changing="onProgressChanging"
      activeColor="#07c160"
      block-size="14"
    />
    <text class="time">{{formatTime(duration)}}</text>
  </view>
  
  <!-- 播放控制 -->
  <view class="controls-section">
    <view class="control-btn" bind:tap="onPrev">
      <text class="icon icon-prev">⏮</text>
    </view>
    
    <view class="control-btn play-btn" bind:tap="onTogglePlay">
      <view class="play-icon">
        <text class="icon">{{isPlaying ? '⏸' : '▶'}}</text>
      </view>
    </view>
    
    <view class="control-btn" bind:tap="onNext">
      <text class="icon icon-next">⏭</text>
    </view>
  </view>
  
  <!-- 额外功能 -->
  <view class="extra-section">
    <view class="extra-btn" bind:tap="onToggleLoop">
      <text class="icon">{{isLoop ? '🔁' : '🔂'}}</text>
      <text class="label">循环</text>
    </view>
    <view class="extra-btn" bind:tap="onToggleFavorite">
      <text class="icon">{{isFavorite ? '❤️' : '🤍'}}</text>
      <text class="label">收藏</text>
    </view>
    <view class="extra-btn" bind:tap="onShowPlaylist">
      <text class="icon">📋</text>
      <text class="label">列表</text>
    </view>
    <view class="extra-btn" bind:tap="onSetSpeed">
      <text class="icon">{{speed}}x</text>
      <text class="label">倍速</text>
    </view>
  </view>
</view>
```

```css
/* components/audio-player/index.wxss */
.player-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.header .title {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
}

.header .btn-back,
.header .btn-more {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

/* 专辑封面区域 */
.cover-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.cover-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 280px;
  height: 280px;
}

.cover-image {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.cover-wrapper.playing .cover-image {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 歌曲信息 */
.song-info {
  text-align: center;
  margin-bottom: 30px;
}

.song-title {
  display: block;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 8px;
}

.song-artist {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

/* 进度条 */
.progress-section {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 40px;
}

.progress-section .time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 45px;
}

.progress-slider {
  flex: 1;
  margin: 0 15px;
}

/* 播放控制 */
.controls-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.control-btn {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
}

.play-btn {
  width: 80px;
  height: 80px;
  margin: 0 40px;
}

.play-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #07c160, #00b578);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(7, 193, 96, 0.4);
}

.play-icon .icon {
  font-size: 32px;
  color: #fff;
}

/* 额外功能 */
.extra-section {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.extra-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
}

.extra-btn .icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.extra-btn .label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
```

### 4.2 播放按钮动画

```css
/* 播放按钮点击动画 */
.play-icon:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* 脉冲效果 */
.play-icon.pulsing {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(7, 193, 96, 0.4);
  }
  50% {
    box-shadow: 0 8px 32px rgba(7, 193, 96, 0.6);
  }
}
```

---

## 5. 音量调节交互

### 5.1 音量调节组件

```xml
<!-- components/volume-control/index.wxml -->
<view class="volume-control">
  <view class="volume-icon" bind:tap="onToggleMute">
    <text class="icon">{{isMuted ? '🔇' : '🔊'}}</text>
  </view>
  
  <slider
    class="volume-slider"
    value="{{volume}}"
    bind:change="onVolumeChange"
    activeColor="#07c160"
    block-size="12"
  />
  
  <text class="volume-text">{{volume}}%</text>
</view>
```

```css
/* components/volume-control/index.wxss */
.volume-control {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.volume-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 10px;
}

.volume-slider {
  flex: 1;
  height: 4px;
}

.volume-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  min-width: 40px;
  text-align: right;
  margin-left: 10px;
}
```

```javascript
// components/volume-control/index.js
Component({
  data: {
    volume: 70,
    isMuted: false
  },
  
  methods: {
    onVolumeChange(e) {
      const volume = e.detail.value;
      this.setData({ volume, isMuted: volume === 0 });
      
      // 触发事件通知父组件
      this.triggerEvent('change', { volume });
    },
    
    onToggleMute() {
      if (this.data.isMuted) {
        this.setData({ volume: 70, isMuted: false });
        this.triggerEvent('change', { volume: 70 });
      } else {
        this.setData({ volume: 0, isMuted: true });
        this.triggerEvent('change', { volume: 0 });
      }
    }
  }
});
```

### 5.2 系统音量同步

```javascript
// 注意：小程序无法直接控制系统音量
// 但可以通过以下方式提示用户

function showVolumeTip() {
  wx.showModal({
    title: '音量提示',
    content: '请确保设备音量已打开，以获得最佳收听体验',
    showCancel: false,
    confirmText: '知道了'
  });
}

// 在播放开始时检查
Page({
  onPlay() {
    this.audioContext.play();
    
    // 首次播放时提示
    const hasPlayed = wx.getStorageSync('has_played');
    if (!hasPlayed) {
      showVolumeTip();
      wx.setStorageSync('has_played', true);
    }
  }
});
```

### 5.3 滑动调节音量（手势）

```javascript
// 在播放器页面添加滑动手势
Page({
  data: {
    startY: 0,
    currentVolume: 70
  },
  
  onTouchStart(e) {
    this.setData({
      startY: e.touches[0].clientY
    });
  },
  
  onTouchMove(e) {
    const deltaY = e.touches[0].clientY - this.data.startY;
    
    // 垂直滑动调节音量
    if (Math.abs(deltaY) > 10) {
      const volumeChange = Math.floor(deltaY / 10);
      const newVolume = Math.max(0, Math.min(100, this.data.currentVolume - volumeChange));
      
      this.setData({
        currentVolume: newVolume,
        startY: e.touches[0].clientY
      });
      
      // 更新音量
      this.updateVolume(newVolume);
    }
  },
  
  updateVolume(volume) {
    // 显示音量提示
    wx.showToast({
      title: `音量 ${volume}%`,
      icon: 'none',
      duration: 1000
    });
    
    // 实际项目中需要调用音频 API 设置音量
  }
});
```

---

## 6. 可复用代码

### 6.1 Canvas 绘图工具类

```javascript
// utils/canvas-drawer.js
export class CanvasDrawer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dpr = wx.getSystemInfoSync().pixelRatio;
  }
  
  // 设置高清屏
  setupHD() {
    const { width, height } = this.canvas;
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }
  
  // 绘制圆环
  drawRing(options) {
    const {
      x, y, radius,
      startAngle = 0,
      endAngle = 2 * Math.PI,
      strokeWidth = 4,
      color = '#000',
      bgColor = '#e5e5e5',
      lineCap = 'round'
    } = options;
    
    const ctx = this.ctx;
    
    // 背景环
    if (bgColor) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    
    // 进度环
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = lineCap;
    ctx.stroke();
  }
  
  // 绘制渐变圆环
  drawGradientRing(options) {
    const {
      x, y, radius,
      startAngle = 0,
      endAngle = 2 * Math.PI,
      strokeWidth = 4,
      colors = ['#07c160', '#00b578'],
      bgColor = '#e5e5e5'
    } = options;
    
    const ctx = this.ctx;
    
    // 背景环
    if (bgColor) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    // 渐变环
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  
  // 绘制文字
  drawText(options) {
    const {
      text, x, y,
      fontSize = 14,
      color = '#000',
      align = 'center',
      baseline = 'middle'
    } = options;
    
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  }
  
  // 清除画布
  clear() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width / this.dpr, height / this.dpr);
  }
}
```

### 6.2 播放器状态管理

```javascript
// utils/player-store.js
class PlayerStore {
  constructor() {
    this.state = {
      isPlaying: false,
      currentSong: null,
      playlist: [],
      currentIndex: 0,
      progress: 0,
      duration: 0,
      isLoop: false,
      isShuffle: false,
      volume: 70
    };
    
    this.listeners = [];
  }
  
  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // 通知所有监听器
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  // 更新状态
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  
  // 播放
  play(song) {
    this.setState({
      isPlaying: true,
      currentSong: song
    });
  }
  
  // 暂停
  pause() {
    this.setState({ isPlaying: false });
  }
  
  // 切换播放状态
  togglePlay() {
    this.setState({ isPlaying: !this.state.isPlaying });
  }
  
  // 设置进度
  setProgress(progress) {
    this.setState({ progress });
  }
  
  // 获取状态
  getState() {
    return { ...this.state };
  }
}

// 导出单例
export default new PlayerStore();
```

### 6.3 动画效果工具

```javascript
// utils/animations.js
// 缓动函数
export const easing = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

// 动画帧工具
export function animate({
  duration,
  draw,
  timing = easing.easeInOutQuad,
  complete
}) {
  const start = performance.now();
  
  requestAnimationFrame(function animate(time) {
    const timeFraction = (time - start) / duration;
    
    if (timeFraction > 1) timeFraction = 1;
    
    const progress = timing(timeFraction);
    draw(progress);
    
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else if (complete) {
      complete();
    }
  });
}

// 使用示例：进度条平滑动画
function animateProgress(from, to, duration, onUpdate) {
  animate({
    duration,
    timing: easing.easeOutQuad,
    draw: (progress) => {
      const value = from + (to - from) * progress;
      onUpdate(value);
    }
  });
}
```

---

## 7. 踩坑记录

### 7.1 Canvas 高清屏适配

**问题**: Canvas 在高清屏上显示模糊

**解决方案**:
```javascript
// 设置 Canvas 实际像素
const dpr = wx.getSystemInfoSync().pixelRatio;
canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
ctx.scale(dpr, dpr);
```

### 7.2 旋转动画卡顿

**问题**: 封面旋转动画卡顿

**原因**: 
1. 频繁触发重绘
2. 图片过大

**解决方案**:
- 使用 CSS transform 而非 Canvas 旋转
- 压缩封面图片尺寸
- 使用 will-change 优化

### 7.3 进度条不同步

**问题**: 进度条与实际播放进度不同步

**原因**: onTimeUpdate 事件触发频率有限

**解决方案**:
- 结合 requestAnimationFrame 平滑更新
- 使用动画插值
- 不要频繁 setData

### 7.4 手势冲突

**问题**: 滑动调节音量与页面滚动冲突

**解决方案**:
- 使用 catchtouchstart 替代 bindtouchstart
- 限制滑动区域
- 添加滑动方向判断

---

## 8. 清如项目复用建议

### 8.1 禅意风格设计

```css
/* 清如项目配色 */
:root {
  --primary-color: #4A5D4E;      /* 深绿 */
  --accent-color: #C9B037;       /* 金色 */
  --secondary-color: #A68966;    /* 棕色 */
  --bg-color: #F5F5F0;           /* 米白 */
  --text-color: #333333;
  --text-light: #666666;
}

/* 播放器背景渐变 */
.player-container {
  background: linear-gradient(180deg, #F5F5F0 0%, #E8E8E3 100%);
}

/* 进度条颜色 */
.progress-color {
  color: #4A5D4E;
}

/* 播放按钮渐变 */
.play-btn {
  background: linear-gradient(135deg, #4A5D4E, #5A6D5E);
}
```

### 8.2 冥想场景优化

1. **渐入渐出**: 音频播放时音量渐变
2. **呼吸引导**: 进度条配合呼吸节奏动画
3. **定时关闭**: 支持 15/30/60 分钟定时
4. **最小化播放**: 支持后台悬浮窗

### 8.3 性能优化建议

1. **Canvas 缓存**: 静态内容绘制到离屏 Canvas
2. **图片懒加载**: 封面图按需加载
3. **节流更新**: 进度更新使用节流
4. **组件拆分**: 大组件拆分为小组件

---

## 9. 总结

wechat-audio-player 项目展示了如何构建精美的微信小程序音频播放器 UI，核心要点：

✅ **环形进度条**: Canvas 2D 绘制，支持渐变和双环  
✅ **播放控制**: 完整的播放/暂停/切歌功能  
✅ **交互动画**: 旋转封面、按钮反馈、进度动画  
✅ **音量调节**: 滑块控制和手势调节  
✅ **可复用设计**: 组件化、工具类封装  

对于清如项目，可基于此构建禅意风格的冥想音频播放器，配合呼吸引导动画和定时关闭功能，提供沉浸式的冥想体验。

---

**笔记创建时间**: 2026-04-04  
**参考项目**: xiaohuoni/wechat-audio-player（基于项目描述整理）
