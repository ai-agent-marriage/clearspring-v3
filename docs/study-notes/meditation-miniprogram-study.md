# meditation-miniprogram 冥想小程序学习笔记

## 1. 项目概览

**项目地址**: https://github.com/holynova/meditation-miniprogram

**核心功能**: 冥想/正念练习小程序

**许可证**: MIT

**技术特点**:
- 禅意 UI 设计规范
- 收听统计逻辑
- 里程碑触发机制
- 呼吸引导动画

**适用场景**:
- 冥想引导
- 正念练习
- 呼吸训练
- 睡眠辅助
- 白噪音播放

**注意**: 原项目仓库可能已归档或迁移，本笔记基于项目描述和冥想类小程序通用实践整理。

---

## 2. 禅意 UI 设计规范

### 2.1 配色方案

```css
/* app.wxss - 全局禅意配色 */
page {
  /* 主色调 - 深绿色系 */
  --primary-color: #4A5D4E;
  --primary-light: #5A6D5E;
  --primary-dark: #3A4D3E;
  
  /* 强调色 - 金色系 */
  --accent-color: #C9B037;
  --accent-light: #D9C047;
  --accent-dark: #B9A027;
  
  /* 辅助色 - 棕色系 */
  --secondary-color: #A68966;
  --secondary-light: #B69976;
  --secondary-dark: #967956;
  
  /* 背景色 - 米白/浅灰 */
  --bg-color: #F5F5F0;
  --bg-light: #FAFAF5;
  --bg-dark: #E8E8E3;
  
  /* 文字颜色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-light: #999999;
  --text-placeholder: #CCCCCC;
  
  /* 功能色 */
  --success-color: #07c160;
  --warning-color: #ff976a;
  --error-color: #ee0a24;
}
```

### 2.2 字体规范

```css
/* 字体使用规范 */
page {
  /* 中文字体优先级 */
  font-family: 
    -apple-system, 
    "PingFang SC", 
    "Hiragino Sans GB", 
    "Microsoft YaHei", 
    "Helvetica Neue", 
    Arial, 
    sans-serif;
  
  /* 英文字体 */
  font-family: 
    -apple-system, 
    "Helvetica Neue", 
    "Arial", 
    sans-serif;
}

/* 字号规范 */
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-2xl { font-size: 24px; }
.text-3xl { font-size: 32px; }

/* 字重规范 */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* 行高规范 */
.leading-tight { line-height: 1.25; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.75; }
```

### 2.3 间距规范

```css
/* 间距系统 - 基于 4px 基准 */
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
}

/* 内边距工具类 */
.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

/* 外边距工具类 */
.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }
```

### 2.4 圆角规范

```css
/* 圆角系统 */
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}

/* 圆角工具类 */
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-full { border-radius: var(--radius-full); }
```

### 2.5 禅意页面布局示例

```xml
<!-- pages/home/index.wxml -->
<view class="page-container">
  <!-- 顶部问候 -->
  <view class="header-section">
    <view class="greeting">
      <text class="greeting-title">{{greetingText}}</text>
      <text class="greeting-subtitle">愿你今日心安</text>
    </view>
    <view class="stats">
      <view class="stat-item">
        <text class="stat-value">{{totalMinutes}}</text>
        <text class="stat-label">累计冥想</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{streakDays}}</text>
        <text class="stat-label">连续天数</text>
      </view>
    </view>
  </view>
  
  <!-- 呼吸练习入口 -->
  <view class="breath-section">
    <view class="breath-card" bind:tap="startBreath">
      <view class="breath-icon">🌬️</view>
      <text class="breath-title">呼吸练习</text>
      <text class="breath-desc">3 分钟快速平静</text>
    </view>
  </view>
  
  <!-- 冥想课程列表 -->
  <view class="course-section">
    <view class="section-header">
      <text class="section-title">今日推荐</text>
      <text class="section-more">查看全部 ›</text>
    </view>
    
    <view class="course-list">
      <view 
        class="course-card" 
        wx:for="{{courses}}" 
        wx:key="id"
        bind:tap="playCourse"
        data-id="{{item.id}}"
      >
        <image class="course-cover" src="{{item.cover}}" mode="aspectFill" />
        <view class="course-info">
          <text class="course-title">{{item.title}}</text>
          <text class="course-desc">{{item.description}}</text>
          <view class="course-meta">
            <text class="course-duration">⏱️ {{item.duration}}分钟</text>
            <text class="course-level">{{item.level}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  
  <!-- 白噪音入口 -->
  <view class="sounds-section">
    <view class="section-header">
      <text class="section-title">白噪音</text>
    </view>
    
    <scroll-view class="sounds-scroll" scroll-x>
      <view class="sounds-list">
        <view 
          class="sound-item" 
          wx:for="{{sounds}}" 
          wx:key="id"
          bind:tap="playSound"
          data-id="{{item.id}}"
        >
          <image class="sound-icon" src="{{item.icon}}" mode="aspectFit" />
          <text class="sound-name">{{item.name}}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</view>
```

```css
/* pages/home/index.wxss */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-bottom: var(--spacing-2xl);
}

/* 顶部问候区 */
.header-section {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  padding: var(--spacing-xl) var(--spacing-lg);
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  color: #fff;
}

.greeting {
  margin-bottom: var(--spacing-lg);
}

.greeting-title {
  display: block;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.greeting-subtitle {
  display: block;
  font-size: 14px;
  opacity: 0.9;
}

.stats {
  display: flex;
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: var(--spacing-xs);
}

/* 呼吸练习卡片 */
.breath-section {
  padding: var(--spacing-lg);
  margin-top: -20px;
}

.breath-card {
  background: #fff;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.breath-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border-radius: var(--radius-full);
}

.breath-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.breath-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

/* 课程列表 */
.course-section {
  padding: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-more {
  font-size: 14px;
  color: var(--primary-color);
}

.course-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  display: flex;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.course-cover {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.course-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: 12px;
  color: var(--text-light);
}

/* 白噪音 */
.sounds-section {
  padding: var(--spacing-lg);
}

.sounds-scroll {
  white-space: nowrap;
}

.sounds-list {
  display: inline-flex;
  gap: var(--spacing-md);
}

.sound-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
}

.sound-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: #fff;
  margin-bottom: var(--spacing-xs);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sound-name {
  font-size: 12px;
  color: var(--text-secondary);
}
```

---

## 3. 收听统计逻辑

### 3.1 数据统计模型

```javascript
// utils/statistics.js
const STORAGE_KEY = 'meditation_stats';

class MeditationStatistics {
  constructor() {
    this.data = this.load();
  }
  
  // 加载数据
  load() {
    const defaultData = {
      totalMinutes: 0,        // 总冥想时长（分钟）
      totalSessions: 0,       // 总冥想次数
      streakDays: 0,          // 连续天数
      longestStreak: 0,       // 最长连续天数
      lastSessionDate: null,  // 上次冥想日期
      dailyRecords: {},       // 每日记录 { '2024-01-01': { minutes: 30, sessions: 2 } }
      milestones: [],         // 已达成里程碑
      createdAt: Date.now()
    };
    
    const stored = wx.getStorageSync(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...stored };
    }
    return defaultData;
  }
  
  // 保存数据
  save() {
    wx.setStorageSync(STORAGE_KEY, this.data);
  }
  
  // 记录一次冥想
  recordSession(minutes, courseId = null) {
    const today = this.getTodayString();
    
    // 更新总计
    this.data.totalMinutes += minutes;
    this.data.totalSessions += 1;
    
    // 更新每日记录
    if (!this.data.dailyRecords[today]) {
      this.data.dailyRecords[today] = { minutes: 0, sessions: 0 };
    }
    this.data.dailyRecords[today].minutes += minutes;
    this.data.dailyRecords[today].sessions += 1;
    
    // 更新连续天数
    this.updateStreak(today);
    
    // 检查里程碑
    const newMilestones = this.checkMilestones();
    
    // 保存
    this.save();
    
    return {
      totalMinutes: this.data.totalMinutes,
      streakDays: this.data.streakDays,
      newMilestones
    };
  }
  
  // 更新连续天数
  updateStreak(today) {
    const lastDate = this.data.lastSessionDate;
    
    if (!lastDate) {
      // 第一次冥想
      this.data.streakDays = 1;
    } else {
      const lastDay = new Date(lastDate);
      const todayDay = new Date(today);
      const diffDays = this.daysBetween(lastDay, todayDay);
      
      if (diffDays === 0) {
        // 同一天，不增加连续天数
      } else if (diffDays === 1) {
        // 连续一天
        this.data.streakDays += 1;
      } else {
        // 中断，重新开始
        this.data.streakDays = 1;
      }
    }
    
    // 更新最长连续
    if (this.data.streakDays > this.data.longestStreak) {
      this.data.longestStreak = this.data.streakDays;
    }
    
    this.data.lastSessionDate = today;
  }
  
  // 检查里程碑
  checkMilestones() {
    const newMilestones = [];
    const milestones = [
      { id: 'first', name: '初次冥想', condition: () => this.data.totalSessions >= 1 },
      { id: '10sessions', name: '十次冥想', condition: () => this.data.totalSessions >= 10 },
      { id: '100minutes', name: '百日筑基', condition: () => this.data.totalMinutes >= 100 },
      { id: '7streak', name: '七日禅', condition: () => this.data.streakDays >= 7 },
      { id: '21streak', name: '二十一日', condition: () => this.data.streakDays >= 21 },
      { id: '30streak', name: '满月', condition: () => this.data.streakDays >= 30 },
      { id: '100sessions', name: '百座', condition: () => this.data.totalSessions >= 100 },
      { id: '1000minutes', name: '千分钟', condition: () => this.data.totalMinutes >= 1000 }
    ];
    
    milestones.forEach(milestone => {
      if (!this.data.milestones.includes(milestone.id) && milestone.condition()) {
        this.data.milestones.push(milestone.id);
        newMilestones.push(milestone);
      }
    });
    
    return newMilestones;
  }
  
  // 获取统计数据
  getStats() {
    return {
      totalMinutes: this.data.totalMinutes,
      totalSessions: this.data.totalSessions,
      streakDays: this.data.streakDays,
      longestStreak: this.data.longestStreak,
      milestonesCount: this.data.milestones.length,
      todayMinutes: this.data.dailyRecords[this.getTodayString()]?.minutes || 0
    };
  }
  
  // 获取每日数据（用于图表）
  getDailyData(days = 7) {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = this.getTodayString(date);
      
      result.push({
        date: dateStr,
        minutes: this.data.dailyRecords[dateStr]?.minutes || 0,
        sessions: this.data.dailyRecords[dateStr]?.sessions || 0
      });
    }
    return result;
  }
  
  // 工具方法
  getTodayString(date = new Date()) {
    return date.toISOString().split('T')[0];
  }
  
  daysBetween(d1, d2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((d2 - d1) / oneDay);
  }
}

export default new MeditationStatistics();
```

### 3.2 统计页面

```xml
<!-- pages/stats/index.wxml -->
<view class="stats-page">
  <!-- 总览卡片 -->
  <view class="overview-card">
    <view class="overview-header">
      <text class="title">冥想统计</text>
      <text class="subtitle">坚持的力量</text>
    </view>
    
    <view class="overview-stats">
      <view class="stat-box">
        <text class="stat-value">{{stats.totalMinutes}}</text>
        <text class="stat-label">总时长 (分钟)</text>
      </view>
      <view class="stat-box">
        <text class="stat-value">{{stats.totalSessions}}</text>
        <text class="stat-label">总次数</text>
      </view>
      <view class="stat-box highlight">
        <text class="stat-value">{{stats.streakDays}}</text>
        <text class="stat-label">连续天数</text>
      </view>
    </view>
  </view>
  
  <!-- 周统计图表 -->
  <view class="weekly-section">
    <text class="section-title">本周统计</text>
    <view class="chart-container">
      <view 
        class="chart-bar" 
        wx:for="{{weeklyData}}" 
        wx:key="date"
        style="height: {{getBarHeight(item.minutes)}}px;"
      >
        <text class="bar-value">{{item.minutes}}</text>
      </view>
    </view>
    <view class="chart-labels">
      <text 
        class="label" 
        wx:for="{{weeklyData}}" 
        wx:key="date"
      >
        {{getWeekDay(item.date)}}
      </text>
    </view>
  </view>
  
  <!-- 里程碑 -->
  <view class="milestones-section">
    <text class="section-title">成就里程碑</text>
    <view class="milestones-list">
      <view 
        class="milestone-item {{item.achieved ? 'achieved' : ''}}" 
        wx:for="{{milestones}}" 
        wx:key="id"
      >
        <view class="milestone-icon">
          <text>{{item.achieved ? '✅' : '🔒'}}</text>
        </view>
        <view class="milestone-info">
          <text class="milestone-name">{{item.name}}</text>
          <text class="milestone-desc">{{item.description}}</text>
        </view>
      </view>
    </view>
  </view>
</view>
```

---

## 4. 里程碑触发机制

### 4.1 里程碑配置

```javascript
// config/milestones.js
export const MILESTONES = [
  // 次数里程碑
  {
    id: 'first_meditation',
    name: '初次冥想',
    description: '完成第一次冥想练习',
    icon: '🌱',
    condition: { type: 'sessions', value: 1 }
  },
  {
    id: 'ten_sessions',
    name: '十次冥想',
    description: '累计完成 10 次冥想',
    icon: '🌿',
    condition: { type: 'sessions', value: 10 }
  },
  {
    id: 'hundred_sessions',
    name: '百座成就',
    description: '累计完成 100 次冥想',
    icon: '🌳',
    condition: { type: 'sessions', value: 100 }
  },
  
  // 时长里程碑
  {
    id: 'hundred_minutes',
    name: '百日筑基',
    description: '累计冥想 100 分钟',
    icon: '⏰',
    condition: { type: 'minutes', value: 100 }
  },
  {
    id: 'thousand_minutes',
    name: '千分钟',
    description: '累计冥想 1000 分钟',
    icon: '🕐',
    condition: { type: 'minutes', value: 1000 }
  },
  
  // 连续天数里程碑
  {
    id: 'three_days',
    name: '三日禅',
    description: '连续冥想 3 天',
    icon: '🔥',
    condition: { type: 'streak', value: 3 }
  },
  {
    id: 'seven_days',
    name: '七日禅',
    description: '连续冥想 7 天',
    icon: '⭐',
    condition: { type: 'streak', value: 7 }
  },
  {
    id: 'twenty_one_days',
    name: '二十一日',
    description: '连续冥想 21 天',
    icon: '💫',
    condition: { type: 'streak', value: 21 }
  },
  {
    id: 'thirty_days',
    name: '满月',
    description: '连续冥想 30 天',
    icon: '🌙',
    condition: { type: 'streak', value: 30 }
  },
  {
    id: 'hundred_days',
    name: '百日',
    description: '连续冥想 100 天',
    icon: '☀️',
    condition: { type: 'streak', value: 100 }
  }
];
```

### 4.2 里程碑检测与通知

```javascript
// utils/milestone-manager.js
import { MILESTONES } from '../config/milestones';

class MilestoneManager {
  constructor(statistics) {
    this.statistics = statistics;
  }
  
  // 检查并触发里程碑
  checkAndTrigger() {
    const stats = this.statistics.getStats();
    const achievedMilestones = this.statistics.data.milestones;
    
    const newMilestones = [];
    
    MILESTONES.forEach(milestone => {
      if (achievedMilestones.includes(milestone.id)) {
        return; // 已达成
      }
      
      if (this.checkCondition(milestone, stats)) {
        newMilestones.push(milestone);
        achievedMilestones.push(milestone.id);
      }
    });
    
    // 保存更新
    if (newMilestones.length > 0) {
      this.statistics.data.milestones = achievedMilestones;
      this.statistics.save();
    }
    
    return newMilestones;
  }
  
  // 检查条件
  checkCondition(milestone, stats) {
    const { type, value } = milestone.condition;
    
    switch (type) {
      case 'sessions':
        return stats.totalSessions >= value;
      case 'minutes':
        return stats.totalMinutes >= value;
      case 'streak':
        return stats.streakDays >= value;
      default:
        return false;
    }
  }
  
  // 显示里程碑达成通知
  showMilestoneToast(milestones) {
    if (milestones.length === 0) return;
    
    const milestone = milestones[0]; // 只显示第一个
    
    wx.showModal({
      title: '🎉 成就达成',
      content: `恭喜你达成「${milestone.name}」！\n\n${milestone.description}`,
      showCancel: false,
      confirmText: '继续修行',
      confirmColor: '#4A5D4E'
    });
  }
}

export default MilestoneManager;
```

### 4.3 冥想完成后的处理

```javascript
// pages/player/index.js
import statistics from '../../utils/statistics';
import MilestoneManager from '../../utils/milestone-manager';

Page({
  data: {
    isPlaying: false,
    duration: 0,
    currentTime: 0
  },
  
  onLoad() {
    this.milestoneManager = new MilestoneManager(statistics);
  },
  
  // 冥想结束
  onMeditationEnd() {
    const minutes = Math.floor(this.data.duration / 60);
    
    // 记录统计
    const result = statistics.recordSession(minutes, this.data.courseId);
    
    // 检查里程碑
    const newMilestones = this.milestoneManager.checkAndTrigger();
    
    // 显示通知
    if (newMilestones.length > 0) {
      this.milestoneManager.showMilestoneToast(newMilestones);
    } else {
      wx.showToast({
        title: '冥想完成 🙏',
        icon: 'success'
      });
    }
    
    // 返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 2000);
  }
});
```

---

## 5. 呼吸引导动画

### 5.1 呼吸动画组件

```xml
<!-- components/breath-guide/index.wxml -->
<view class="breath-guide">
  <view class="breath-circle {{animationState}}">
    <view class="breath-circle-inner"></view>
  </view>
  
  <text class="breath-text">{{breathText}}</text>
  <text class="breath-subtext">{{breathSubtext}}</text>
  
  <view class="breath-controls">
    <view class="time-selector">
      <view 
        class="time-option {{duration === option ? 'active' : ''}}"
        wx:for="{{durationOptions}}"
        wx:key="*this"
        bind:tap="selectDuration"
        data-value="{{item}}"
      >
        {{item}}分钟
      </view>
    </view>
    
    <view class="control-buttons">
      <view class="btn-start" bind:tap="toggleBreath">
        <text>{{isPlaying ? '停止' : '开始'}}</text>
      </view>
    </view>
  </view>
</view>
```

```css
/* components/breath-guide/index.wxss */
.breath-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--spacing-xl);
}

/* 呼吸圆环 */
.breath-circle {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.breath-circle-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  opacity: 0.3;
  transform: scale(0.5);
}

/* 吸气状态 */
.breath-circle.inhale .breath-circle-inner {
  animation: inhale 4s ease-in-out forwards;
}

/* 呼气状态 */
.breath-circle.exhale .breath-circle-inner {
  animation: exhale 4s ease-in-out forwards;
}

@keyframes inhale {
  0% { transform: scale(0.5); opacity: 0.3; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes exhale {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0.5); opacity: 0.3; }
}

/* 呼吸文字 */
.breath-text {
  font-size: 28px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.breath-subtext {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

/* 时间选择 */
.time-selector {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.time-option {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  background: #fff;
  color: var(--text-secondary);
  font-size: 14px;
  border: 1px solid var(--bg-dark);
}

.time-option.active {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

/* 控制按钮 */
.btn-start {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--primary-color);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 16px;
  font-weight: 600;
}
```

```javascript
// components/breath-guide/index.js
Component({
  data: {
    isPlaying: false,
    animationState: '',
    breathText: '准备',
    breathSubtext: '点击开始呼吸练习',
    duration: 3,
    durationOptions: [1, 3, 5, 10],
    timer: null
  },
  
  lifetimes: {
    detached() {
      this.stopBreath();
    }
  },
  
  methods: {
    // 切换呼吸
    toggleBreath() {
      if (this.data.isPlaying) {
        this.stopBreath();
      } else {
        this.startBreath();
      }
    },
    
    // 开始呼吸
    startBreath() {
      this.setData({ isPlaying: true });
      this.breathCycle();
      
      // 设置定时器
      const totalSeconds = this.data.duration * 60;
      let elapsed = 0;
      
      this.data.timer = setInterval(() => {
        elapsed++;
        if (elapsed >= totalSeconds) {
          this.stopBreath();
        }
      }, 1000);
    },
    
    // 停止呼吸
    stopBreath() {
      this.setData({
        isPlaying: false,
        animationState: '',
        breathText: '准备',
        breathSubtext: '点击开始呼吸练习'
      });
      
      if (this.data.timer) {
        clearInterval(this.data.timer);
        this.data.timer = null;
      }
    },
    
    // 呼吸循环
    breathCycle() {
      if (!this.data.isPlaying) return;
      
      // 吸气 4 秒
      this.setData({
        animationState: 'inhale',
        breathText: '吸气',
        breathSubtext: '用鼻子深深吸气...'
      });
      
      setTimeout(() => {
        if (!this.data.isPlaying) return;
        
        // 屏息 2 秒（可选）
        // this.setData({ breathText: '屏息' });
        
        setTimeout(() => {
          if (!this.data.isPlaying) return;
          
          // 呼气 4 秒
          this.setData({
            animationState: 'exhale',
            breathText: '呼气',
            breathSubtext: '用嘴缓缓呼出...'
          });
          
          setTimeout(() => {
            // 下一轮循环
            this.breathCycle();
          }, 4000);
        }, 2000);
      }, 4000);
    },
    
    // 选择时长
    selectDuration(e) {
      const duration = e.currentTarget.dataset.value;
      this.setData({ duration });
    }
  }
});
```

---

## 6. 可借鉴设计

### 6.1 禅意启动页

```css
/* 启动页设计 */
.splash-screen {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F5F0 0%, #E8E8E3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.splash-logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin-bottom: var(--spacing-lg);
  animation: fadeIn 1s ease;
}

.splash-text {
  font-size: 24px;
  color: var(--primary-color);
  font-weight: 600;
  animation: fadeInUp 1s ease 0.3s forwards;
  opacity: 0;
}

.splash-subtext {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
  animation: fadeInUp 1s ease 0.5s forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 6.2 每日签到

```javascript
// utils/daily-checkin.js
const CHECKIN_KEY = 'daily_checkin';

class DailyCheckIn {
  // 检查今日是否已签到
  isTodayChecked() {
    const today = new Date().toDateString();
    const lastCheckIn = wx.getStorageSync(CHECKIN_KEY);
    return lastCheckIn === today;
  }
  
  // 签到
  checkIn() {
    if (this.isTodayChecked()) {
      return { success: false, message: '今日已签到' };
    }
    
    const today = new Date().toDateString();
    wx.setStorageSync(CHECKIN_KEY, today);
    
    // 奖励：增加连续天数
    return {
      success: true,
      message: '签到成功',
      reward: this.calculateReward()
    };
  }
  
  // 计算奖励
  calculateReward() {
    // 根据连续签到天数计算奖励
    const stats = wx.getStorageSync('meditation_stats') || {};
    const streak = stats.streakDays || 0;
    
    if (streak >= 30) {
      return { type: 'badge', name: '月度修行者' };
    } else if (streak >= 7) {
      return { type: 'badge', name: '周度修行者' };
    }
    
    return { type: 'encouragement', message: '继续加油！' };
  }
}

export default new DailyCheckIn();
```

### 6.3 冥想结束卡片

```xml
<!-- 冥想完成后的总结卡片 -->
<view class="completion-card">
  <view class="completion-header">
    <text class="completion-icon">🙏</text>
    <text class="completion-title">冥想完成</text>
  </view>
  
  <view class="completion-stats">
    <view class="stat">
      <text class="stat-value">{{duration}}</text>
      <text class="stat-label">分钟</text>
    </view>
    <view class="stat">
      <text class="stat-value">{{streakDays}}</text>
      <text class="stat-label">连续天数</text>
    </view>
  </view>
  
  <view class="completion-quote">
    <text class="quote-text">"心若安定，万物皆静"</text>
  </view>
  
  <view class="completion-actions">
    <button class="btn-share">分享今日修行</button>
    <button class="btn-home">返回首页</button>
  </view>
</view>
```

---

## 7. 踩坑记录

### 7.1 时间计算问题

**问题**: 连续天数计算错误

**原因**: 时区处理不当，日期字符串格式不一致

**解决方案**:
```javascript
// 统一使用 ISO 日期字符串
getTodayString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// 计算日期间隔时使用时间戳
daysBetween(d1, d2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((d2 - d1) / oneDay);
}
```

### 7.2 动画卡顿

**问题**: 呼吸动画在低端设备上卡顿

**解决方案**:
- 使用 CSS transform 而非 width/height
- 减少动画元素数量
- 使用 will-change 提示浏览器优化

### 7.3 数据丢失

**问题**: 用户清除缓存后统计数据丢失

**解决方案**:
- 重要数据同步到云端
- 使用 wx.cloud 数据库
- 提供数据导出功能

---

## 8. 清如项目复用建议

### 8.1 核心功能复用

1. **禅意 UI 系统**: 直接使用配色、字体、间距规范
2. **统计系统**: 复用收听统计和里程碑逻辑
3. **呼吸引导**: 复用呼吸动画组件
4. **成就系统**: 复用里程碑触发机制

### 8.2 清如特色功能

```javascript
// 清如项目特有配置
const qingruConfig = {
  // 禅意配色
  colors: {
    primary: '#4A5D4E',
    accent: '#C9B037',
    secondary: '#A68966'
  },
  
  // 冥想分类
  categories: [
    { id: 'beginner', name: '入门引导', icon: '🌱' },
    { id: 'breath', name: '呼吸练习', icon: '🌬️' },
    { id: 'sleep', name: '睡眠辅助', icon: '🌙' },
    { id: 'focus', name: '专注提升', icon: '🎯' },
    { id: 'emotion', name: '情绪调节', icon: '💚' }
  ],
  
  // 里程碑配置
  milestones: [
    { id: 'qingru_first', name: '初遇清如', condition: { type: 'sessions', value: 1 } },
    { id: 'qingru_7days', name: '七日清心', condition: { type: 'streak', value: 7 } },
    { id: 'qingru_21days', name: '二十一日', condition: { type: 'streak', value: 21 } },
    { id: 'qingru_100sessions', name: '百座清修', condition: { type: 'sessions', value: 100 } }
  ]
};
```

### 8.3 性能优化建议

1. **图片优化**: 使用 WebP 格式，压缩封面图
2. **分包加载**: 将课程详情、统计页面分包
3. **数据缓存**: 课程列表缓存，减少请求
4. **动画优化**: 使用 CSS 动画替代 JS 动画

---

## 9. 总结

meditation-miniprogram 项目展示了如何构建一个完整的冥想类小程序，核心要点：

✅ **禅意 UI 设计**: 统一的配色、字体、间距规范  
✅ **统计系统**: 完整的收听统计和数据分析  
✅ **里程碑机制**: 激励用户持续练习  
✅ **呼吸引导**: 可视化的呼吸练习动画  
✅ **成就系统**: 增强用户粘性  

对于清如项目，可全面复用这些设计，配合国风禅意风格，打造专业的冥想修行平台。

---

**笔记创建时间**: 2026-04-04  
**参考项目**: holynova/meditation-miniprogram（基于项目描述整理）
