# wx-audio 音频播放库学习笔记

## 1. 项目概览

**项目地址**: https://github.com/xingbofeng/wx-audio

**核心功能**: 基于微信小程序平台开发的音乐播放器

**许可证**: MIT

**技术栈**: 
- 微信小程序原生 API
- wx.createInnerAudioContext
- Node.js 6.0+ (后端服务)

**主要功能**:
- 音乐搜索（网易云音乐 API）
- 播放控制（播放/暂停/停止）
- 进度监听与拖动
- 播放列表管理
- 后台播放支持

---

## 2. 安装配置步骤

### 2.1 克隆项目

```bash
git clone https://github.com/xingbofeng/wx-audio.git
cd wx-audio
```

### 2.2 安装依赖

```bash
# 安装项目依赖
yarn install
# 或
npm install
```

### 2.3 启动后端服务（可选）

```bash
# 启动本地服务器
yarn start
# 或
npm start
```

**注意**: 项目已部署到云端服务器，可直接使用：
- 服务地址：https://encounter.studio:3000
- 请求方法：POST
- 参数：musicname

### 2.4 微信开发者工具配置

1. 打开微信开发者工具
2. 导入 wx-audio 项目
3. 修改 `pages/index/index.js` 中的请求地址（如需本地调试）：
   ```javascript
   // 改为本地地址
   const API_URL = 'http://localhost:3000';
   ```

### 2.5 后台播放配置

在 `app.json` 中配置：

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于后台播放"
    }
  },
  "requiredBackgroundModes": ["audio"]
}
```

---

## 3. wx.createInnerAudioContext API 详解

### 3.1 创建音频实例

```javascript
// 创建内部音频上下文
const audioContext = wx.createInnerAudioContext();

// 配置音频
audioContext.src = 'https://example.com/music.mp3';
audioContext.autoplay = false;
audioContext.loop = false;
audioContext.obeyMuteSwitch = true; // 是否遵循静音开关
```

### 3.2 完整音频管理类

```javascript
// utils/audio-manager.js
class AudioManager {
  constructor() {
    this.audioContext = wx.createInnerAudioContext();
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
    
    this.initListeners();
  }
  
  // 初始化监听器
  initListeners() {
    // 播放进度更新
    this.audioContext.onTimeUpdate(() => {
      this.currentTime = this.audioContext.currentTime;
      this.duration = this.audioContext.duration;
      
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback({
          currentTime: this.currentTime,
          duration: this.duration,
          progress: (this.currentTime / this.duration) * 100
        });
      }
    });
    
    // 播放结束
    this.audioContext.onEnded(() => {
      this.isPlaying = false;
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    });
    
    // 播放错误
    this.audioContext.onError((res) => {
      console.error('音频播放错误', res);
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
    });
    
    // 播放开始
    this.audioContext.onPlay(() => {
      this.isPlaying = true;
    });
    
    // 播放暂停
    this.audioContext.onPause(() => {
      this.isPlaying = false;
    });
    
    // 播放停止
    this.audioContext.onStop(() => {
      this.isPlaying = false;
      this.currentTime = 0;
    });
  }
  
  // 设置音频源
  setSrc(src) {
    this.audioContext.src = src;
  }
  
  // 播放
  play() {
    this.audioContext.play();
  }
  
  // 暂停
  pause() {
    this.audioContext.pause();
  }
  
  // 停止
  stop() {
    this.audioContext.stop();
  }
  
  // 跳转到指定位置
  seek(position) {
    this.audioContext.seek(position);
  }
  
  // 设置进度更新回调
  onTimeUpdate(callback) {
    this.onTimeUpdateCallback = callback;
  }
  
  // 设置结束回调
  onEnded(callback) {
    this.onEndedCallback = callback;
  }
  
  // 销毁
  destroy() {
    this.audioContext.destroy();
  }
}

export default AudioManager;
```

---

## 4. 播放控制（播放/暂停/停止）

### 4.1 基础播放控制组件

```xml
<!-- components/audio-player/index.wxml -->
<view class="audio-player">
  <!-- 专辑封面 -->
  <image 
    class="cover {{isPlaying ? 'playing' : ''}}" 
    src="{{coverUrl}}" 
    mode="aspectFill"
  />
  
  <!-- 歌曲信息 -->
  <view class="song-info">
    <text class="title">{{title}}</text>
    <text class="artist">{{artist}}</text>
  </view>
  
  <!-- 进度条 -->
  <view class="progress-container">
    <text class="time">{{formatTime(currentTime)}}</text>
    <slider 
      class="progress"
      value="{{progress}}" 
      bind:change="onProgressChange"
      bind:changing="onProgressChanging"
      activeColor="#07c160"
    />
    <text class="time">{{formatTime(duration)}}</text>
  </view>
  
  <!-- 控制按钮 -->
  <view class="controls">
    <view class="btn" bind:tap="onPrev">
      <text class="icon">⏮</text>
    </view>
    <view class="btn play-btn" bind:tap="onTogglePlay">
      <text class="icon">{{isPlaying ? '⏸' : '▶'}}</text>
    </view>
    <view class="btn" bind:tap="onNext">
      <text class="icon">⏭</text>
    </view>
  </view>
  
  <!-- 额外控制 -->
  <view class="extra-controls">
    <view class="btn" bind:tap="onToggleLoop">
      <text class="icon">{{isLoop ? '🔁' : '🔂'}}</text>
    </view>
    <view class="btn" bind:tap="onSetRate">
      <text class="icon">{{playbackRate}}x</text>
    </view>
  </view>
</view>
```

```javascript
// components/audio-player/index.js
import AudioManager from '../../utils/audio-manager';

Component({
  data: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    title: '',
    artist: '',
    coverUrl: '',
    isLoop: false,
    playbackRate: 1.0,
    playlist: [],
    currentIndex: 0
  },
  
  lifetimes: {
    attached() {
      this.audioManager = new AudioManager();
      this.setupAudioListeners();
    },
    
    detached() {
      if (this.audioManager) {
        this.audioManager.destroy();
      }
    }
  },
  
  methods: {
    // 设置播放列表
    setPlaylist(playlist, index = 0) {
      this.setData({ playlist, currentIndex: index });
      this.loadSong(index);
    },
    
    // 加载歌曲
    loadSong(index) {
      const song = this.data.playlist[index];
      if (!song) return;
      
      this.setData({
        title: song.name,
        artist: song.artists[0]?.name || '',
        coverUrl: song.album?.picUrl || ''
      });
      
      this.audioManager.setSrc(song.audio);
    },
    
    // 设置音频监听
    setupAudioListeners() {
      this.audioManager.onTimeUpdate(({ currentTime, duration, progress }) => {
        this.setData({ currentTime, duration, progress });
      });
      
      this.audioManager.onEnded(() => {
        this.onNext(); // 自动播放下一首
      });
    },
    
    // 切换播放/暂停
    onTogglePlay() {
      if (this.data.isPlaying) {
        this.audioManager.pause();
      } else {
        this.audioManager.play();
      }
    },
    
    // 上一首
    onPrev() {
      let index = this.data.currentIndex - 1;
      if (index < 0) {
        index = this.data.playlist.length - 1;
      }
      this.setData({ currentIndex: index });
      this.loadSong(index);
      this.audioManager.play();
    },
    
    // 下一首
    onNext() {
      if (this.data.isLoop) {
        this.audioManager.seek(0);
        this.audioManager.play();
        return;
      }
      
      let index = this.data.currentIndex + 1;
      if (index >= this.data.playlist.length) {
        index = 0;
      }
      this.setData({ currentIndex: index });
      this.loadSong(index);
      this.audioManager.play();
    },
    
    // 进度条拖动
    onProgressChanging(e) {
      // 拖动中，可实时更新显示
    },
    
    onProgressChange(e) {
      const progress = e.detail.value;
      const position = (progress / 100) * this.data.duration;
      this.audioManager.seek(position);
    },
    
    // 切换循环
    onToggleLoop() {
      this.setData({ isLoop: !this.data.isLoop });
    },
    
    // 格式化时间
    formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
  }
});
```

### 4.2 播放/暂停/停止完整示例

```javascript
// pages/player/player.js
Page({
  data: {
    isPlaying: false,
    audioUrl: '',
    title: '歌曲名称',
    artist: '艺术家'
  },
  
  onLoad() {
    // 创建音频上下文
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.obeyMuteSwitch = true;
    
    // 设置音频源
    this.audioContext.src = 'https://example.com/music.mp3';
    
    // 绑定事件
    this.audioContext.onPlay(() => {
      this.setData({ isPlaying: true });
    });
    
    this.audioContext.onPause(() => {
      this.setData({ isPlaying: false });
    });
    
    this.audioContext.onStop(() => {
      this.setData({ isPlaying: false });
    });
    
    this.audioContext.onEnded(() => {
      this.setData({ isPlaying: false });
    });
    
    this.audioContext.onError((res) => {
      console.error('播放错误', res);
      wx.showToast({ title: '播放失败', icon: 'none' });
    });
  },
  
  // 播放
  play() {
    this.audioContext.play();
  },
  
  // 暂停
  pause() {
    this.audioContext.pause();
  },
  
  // 停止
  stop() {
    this.audioContext.stop();
  },
  
  // 切换播放状态
  togglePlay() {
    if (this.data.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },
  
  onUnload() {
    // 页面卸载时停止播放并销毁
    this.audioContext.stop();
    this.audioContext.destroy();
  }
});
```

---

## 5. 进度监听

### 5.1 实时进度监听

```javascript
// 监听播放进度
audioContext.onTimeUpdate(() => {
  const currentTime = audioContext.currentTime;
  const duration = audioContext.duration;
  const progress = (currentTime / duration) * 100;
  
  this.setData({
    currentTime,
    duration,
    progress
  });
});
```

### 5.2 进度条组件

```xml
<!-- 带缓冲进度的进度条 -->
<view class="progress-wrapper">
  <view class="progress-bg">
    <!-- 缓冲进度 -->
    <view 
      class="progress-buffer" 
      style="width: {{bufferProgress}}%"
    />
    <!-- 播放进度 -->
    <view 
      class="progress-current" 
      style="width: {{playProgress}}%"
    />
  </view>
  <slider
    value="{{playProgress}}"
    bind:change="onSeek"
    block-size="14"
    activeColor="#07c160"
  />
</view>
```

```javascript
// 缓冲进度监听（需要自行实现）
Page({
  data: {
    playProgress: 0,
    bufferProgress: 0
  },
  
  onLoad() {
    this.audioContext = wx.createInnerAudioContext();
    
    // 播放进度
    this.audioContext.onTimeUpdate(() => {
      const progress = (this.audioContext.currentTime / this.audioContext.duration) * 100;
      this.setData({ playProgress: progress });
    });
    
    // 模拟缓冲进度（实际项目中需要根据网络情况计算）
    this.simulateBufferProgress();
  },
  
  simulateBufferProgress() {
    // 模拟缓冲进度增长
    const interval = setInterval(() => {
      if (this.data.bufferProgress < 100) {
        this.setData({
          bufferProgress: Math.min(this.data.bufferProgress + 5, 100)
        });
      } else {
        clearInterval(interval);
      }
    }, 500);
  },
  
  onSeek(e) {
    const progress = e.detail.value;
    const position = (progress / 100) * this.audioContext.duration;
    this.audioContext.seek(position);
  }
});
```

### 5.3 锁屏进度显示

```javascript
// 设置媒体播放状态（iOS 锁屏显示）
wx.setInnerAudioOption({
  obeyMuteSwitch: true,
  success: () => {},
  fail: (err) => {
    console.error('设置失败', err);
  }
});

// 更新锁屏信息
function updateNowPlayingInfo(info) {
  // 小程序暂不支持直接设置锁屏信息
  // 但可以通过后台播放保持音频继续
}
```

---

## 6. 后台保活配置

### 6.1 app.json 配置

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "用于后台播放音频"
    }
  },
  "requiredBackgroundModes": ["audio"],
  "sitemapLocation": "sitemap.json"
}
```

### 6.2 后台播放设置

```javascript
// 设置后台播放选项
wx.setInnerAudioOption({
  // 是否遵循系统静音开关
  obeyMuteSwitch: true,
  // 是否允许后台播放
  // 注意：需要在 app.json 中配置 requiredBackgroundModes
  success: () => {
    console.log('后台播放设置成功');
  },
  fail: (err) => {
    console.error('后台播放设置失败', err);
  }
});
```

### 6.3 音频会话配置

```javascript
// 配置音频会话（iOS）
wx.setInnerAudioOption({
  // 是否与其他音频混合播放
  // true: 可以与其他音频同时播放
  // false: 独占音频通道
  mixWithOthers: false,
  success: () => {}
});
```

### 6.4 完整的后台播放管理器

```javascript
// utils/background-audio-manager.js
class BackgroundAudioManager {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.currentSong = null;
    this.playlist = [];
    this.currentIndex = 0;
    
    this.init();
  }
  
  init() {
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.obeyMuteSwitch = true;
    
    // 事件监听
    this.audioContext.onPlay(() => {
      this.isPlaying = true;
      this.updateBackgroundPlayState(true);
    });
    
    this.audioContext.onPause(() => {
      this.isPlaying = false;
      this.updateBackgroundPlayState(false);
    });
    
    this.audioContext.onEnded(() => {
      this.playNext();
    });
    
    this.audioContext.onError((res) => {
      console.error('播放错误', res);
    });
  }
  
  // 更新后台播放状态
  updateBackgroundPlayState(isPlaying) {
    // 可以在这里更新全局状态
    getApp().globalData.isPlaying = isPlaying;
  }
  
  // 播放
  play(song) {
    if (song) {
      this.currentSong = song;
      this.audioContext.src = song.audio;
    }
    this.audioContext.play();
  }
  
  // 暂停
  pause() {
    this.audioContext.pause();
  }
  
  // 停止
  stop() {
    this.audioContext.stop();
  }
  
  // 播放下一首
  playNext() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.play(this.playlist[this.currentIndex]);
  }
  
  // 播放上一首
  playPrev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.play(this.playlist[this.currentIndex]);
  }
  
  // 设置播放列表
  setPlaylist(playlist, index = 0) {
    this.playlist = playlist;
    this.currentIndex = index;
  }
  
  // 获取当前播放状态
  getPlayState() {
    return {
      isPlaying: this.isPlaying,
      currentSong: this.currentSong,
      currentTime: this.audioContext?.currentTime || 0,
      duration: this.audioContext?.duration || 0
    };
  }
  
  // 销毁
  destroy() {
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  }
}

// 导出单例
export default new BackgroundAudioManager();
```

---

## 7. 可复用代码片段

### 7.1 音乐搜索 API 封装

```javascript
// utils/music-api.js
const BASE_URL = 'https://encounter.studio:3000';

// 搜索音乐
export function searchMusic(keyword, type = 1, limit = 20) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL,
      method: 'POST',
      data: {
        musicname: keyword,
        type,
        limit
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          resolve(res.data.result);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 搜索类型
export const SEARCH_TYPE = {
  MUSIC: 1,      // 单曲
  ALBUM: 10,     // 专辑
  SINGER: 100,   // 歌手
  PLAYLIST: 1000,// 歌单
  USER: 1002     // 用户
};
```

### 7.2 播放历史管理

```javascript
// utils/play-history.js
const HISTORY_KEY = 'play_history';
const MAX_HISTORY = 50;

// 添加播放历史
export function addHistory(song) {
  const history = getHistory();
  
  // 移除已存在的相同歌曲
  const filtered = history.filter(item => item.id !== song.id);
  
  // 添加到开头
  filtered.unshift({
    ...song,
    playTime: Date.now()
  });
  
  // 限制数量
  if (filtered.length > MAX_HISTORY) {
    filtered.splice(MAX_HISTORY);
  }
  
  wx.setStorageSync(HISTORY_KEY, filtered);
}

// 获取播放历史
export function getHistory() {
  return wx.getStorageSync(HISTORY_KEY) || [];
}

// 清空播放历史
export function clearHistory() {
  wx.removeStorageSync(HISTORY_KEY);
}
```

### 7.3 收藏管理

```javascript
// utils/favorite-manager.js
const FAVORITE_KEY = 'favorite_songs';

// 收藏歌曲
export function addFavorite(song) {
  const favorites = getFavorites();
  
  // 检查是否已收藏
  const exists = favorites.some(item => item.id === song.id);
  if (!exists) {
    favorites.unshift({
      ...song,
      favoriteTime: Date.now()
    });
    wx.setStorageSync(FAVORITE_KEY, favorites);
    return true;
  }
  return false;
}

// 取消收藏
export function removeFavorite(songId) {
  const favorites = getFavorites();
  const filtered = favorites.filter(item => item.id !== songId);
  wx.setStorageSync(FAVORITE_KEY, filtered);
}

// 获取收藏列表
export function getFavorites() {
  return wx.getStorageSync(FAVORITE_KEY) || [];
}

// 检查是否已收藏
export function isFavorite(songId) {
  const favorites = getFavorites();
  return favorites.some(item => item.id === songId);
}
```

---

## 8. 踩坑记录

### 8.1 音频无法播放

**问题**: 调用 play() 后没有声音

**原因**:
1. 音频 URL 无效或跨域
2. 未用户交互触发（微信限制自动播放）
3. 音频格式不支持

**解决方案**:
- 检查音频 URL 是否可访问
- 确保在用户点击事件中调用 play()
- 使用常见格式（mp3, m4a, aac）

### 8.2 进度更新延迟

**问题**: 进度条更新不及时

**原因**: onTimeUpdate 事件触发频率有限

**解决方案**:
- 不要频繁 setData
- 使用节流函数控制更新频率
- 考虑使用 requestAnimationFrame

### 8.3 后台播放中断

**问题**: 切到后台后播放停止

**原因**:
1. 未配置 requiredBackgroundModes
2. 音频上下文被销毁
3. 系统资源回收

**解决方案**:
- 确保 app.json 配置正确
- 使用全局单例管理音频上下文
- 避免频繁创建销毁音频实例

### 8.4 锁屏控制失效

**问题**: 锁屏后无法控制播放

**解决方案**:
- 小程序对锁屏控制支持有限
- 确保 obeyMuteSwitch 设置正确
- 考虑使用背景音频 API（wx.getBackgroundAudioManager）

---

## 9. 清如项目复用建议

### 9.1 适用场景

1. **冥想音频播放**: 引导冥想、白噪音、自然声音
2. **课程音频**: 禅修课程、讲解音频
3. **背景音乐**: 页面背景轻音乐
4. **定时关闭**: 睡眠冥想定时停止

### 9.2 定制化建议

```javascript
// 清如项目音频配置
const qingruAudioConfig = {
  // 默认音量
  defaultVolume: 0.7,
  
  // 淡入淡出时间（毫秒）
  fadeDuration: 1000,
  
  // 定时关闭选项（分钟）
  sleepTimerOptions: [15, 30, 45, 60],
  
  // 音频分类
  categories: [
    { id: 'meditation', name: '冥想引导' },
    { id: 'whitenoise', name: '白噪音' },
    { id: 'nature', name: '自然声音' },
    { id: 'music', name: '禅意音乐' }
  ]
};
```

### 9.3 特色功能建议

1. **呼吸灯效果**: 播放时封面随节奏缩放
2. **定时关闭**: 支持 15/30/45/60 分钟定时
3. **收藏列表**: 用户可收藏喜欢的音频
4. **播放统计**: 记录用户收听时长
5. **离线缓存**: 支持音频离线下载

### 9.4 性能优化

1. **预加载**: 下一首音频预加载
2. **缓存策略**: 已播放音频缓存
3. **按需加载**: 列表分页加载
4. **图片优化**: 封面图压缩和懒加载

---

## 10. 总结

wx-audio 项目展示了如何使用微信小程序原生 API 构建完整的音频播放器，核心要点：

✅ **wx.createInnerAudioContext**: 核心音频 API  
✅ **事件监听**: onTimeUpdate/onEnded/onError 等  
✅ **播放控制**: play/pause/seek/stop  
✅ **后台播放**: requiredBackgroundModes 配置  
✅ **状态管理**: 播放列表、进度、收藏  

对于清如项目，可基于此构建冥想音频播放功能，配合禅意 UI 设计，提供沉浸式的收听体验。

---

**笔记创建时间**: 2026-04-04  
**参考项目**: xingbofeng/wx-audio
