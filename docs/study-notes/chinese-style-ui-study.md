# 国风禅意 UI 模板学习笔记

## 1. 项目概览

**项目地址**: https://github.com/TeaTools/ChineseStyle-MiniProgram

**核心功能**: 国风/禅意风格小程序 UI 模板

**许可证**: MIT

**设计特点**:
- 传统国风配色方案
- 水墨元素运用
- 古典字体规范
- 禅意页面布局

**适用场景**:
- 茶文化应用
- 冥想/正念应用
- 国学/传统文化应用
- 中式美学产品
- 禅修/瑜伽应用

**注意**: 原项目仓库可能已归档或迁移，本笔记基于项目描述和国风禅意设计通用实践整理。

---

## 2. 配色方案详解

### 2.1 核心配色

```css
/* app.wxss - 国风禅意配色系统 */
page {
  /* 主色调 - 深绿色系（竹青/墨绿） */
  --primary-color: #4A5D4E;       /* 主色：深竹绿 */
  --primary-light: #5A6D5E;       /* 浅色 */
  --primary-dark: #3A4D3E;        /* 深色 */
  --primary-pale: #E8ECE8;        /* 极浅色 */
  
  /* 强调色 - 金色系（鎏金/古铜） */
  --accent-color: #C9B037;        /* 主强调：古铜金 */
  --accent-light: #D9C047;        /* 亮金 */
  --accent-dark: #B9A027;         /* 暗金 */
  --accent-pale: #F5F0D0;         /* 淡金 */
  
  /* 辅助色 - 棕色系（檀木/茶叶） */
  --secondary-color: #A68966;     /* 主辅助：檀木棕 */
  --secondary-light: #B69976;     /* 浅棕 */
  --secondary-dark: #967956;      /* 深棕 */
  --secondary-pale: #F0E8E0;      /* 淡棕 */
  
  /* 背景色 - 米白/宣纸色系 */
  --bg-color: #F5F5F0;            /* 主背景：米白 */
  --bg-light: #FAFAF5;            /* 亮背景 */
  --bg-dark: #E8E8E3;             /* 暗背景 */
  --bg-paper: #F2F0E9;            /* 宣纸色 */
  --bg-ink: #2B2B2B;              /* 墨色 */
  
  /* 文字颜色 */
  --text-primary: #333333;        /* 主文字：深墨 */
  --text-secondary: #666666;      /* 次要文字 */
  --text-light: #999999;          /* 浅色文字 */
  --text-placeholder: #CCCCCC;    /* 占位文字 */
  --text-ink: #2B2B2B;            /* 墨色文字 */
  
  /* 功能色 */
  --success-color: #5B8C5A;       /* 成功：竹绿 */
  --warning-color: #C9B037;       /* 警告：金色 */
  --error-color: #B85C5C;         /* 错误：朱红 */
  --info-color: #6B8CA8;          /* 信息：青蓝 */
}
```

### 2.2 传统国风配色扩展

```css
/* 扩展配色 - 传统中国色 */
page {
  /* 红色系 */
  --chinese-red: #C41E3A;         /* 中国红 */
  --vermilion: #E34234;           /* 朱砂 */
  --carmine: #9D2933;             /* 胭脂 */
  
  /* 蓝色系 */
  --chinese-blue: #003366;        /* 中国蓝 */
  --cyan: #00CED1;                /* 青色 */
  --azure: #007FFF;               /* 天青 */
  
  /* 绿色系 */
  --bamboo-green: #5B8C5A;        /* 竹绿 */
  --jade-green: #00A86B;          /* 玉绿 */
  --celadon: #ACE0A7;             /* 青瓷 */
  
  /* 黄色系 */
  --imperial-yellow: #FFD700;     /* 帝王黄 */
  --goldenrod: #DAA520;           /* 金麒麟 */
  --ochre: #CC7722;               /* 赭石 */
  
  /* 紫色系 */
  --imperial-purple: #663399;     /* 帝王紫 */
  --lavender: #E6E6FA;            /* 淡紫 */
}
```

### 2.3 配色使用示例

```css
/* 页面背景 */
.page-container {
  background-color: var(--bg-color);
  background-image: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-color) 100%);
}

/* 主按钮 */
.btn-primary {
  background-color: var(--primary-color);
  color: #fff;
}

/* 强调按钮 */
.btn-accent {
  background-color: var(--accent-color);
  color: #fff;
}

/* 卡片背景 */
.card {
  background-color: #fff;
  border: 1px solid var(--bg-dark);
}

/* 文字层级 */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-light { color: var(--text-light); }
.text-ink { color: var(--text-ink); }
```

### 2.4 渐变色定义

```css
/* 禅意渐变 */
.gradient-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
}

.gradient-accent {
  background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
}

.gradient-bg {
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-color) 100%);
}

/* 水墨渐变 */
.gradient-ink {
  background: linear-gradient(135deg, #2B2B2B 0%, #4A4A4A 50%, #6B6B6B 100%);
}

/* 金边渐变 */
.gradient-gold-border {
  background: linear-gradient(135deg, var(--accent-light), var(--accent-color), var(--accent-dark));
}
```

---

## 3. 水墨元素使用

### 3.1 水墨背景

```css
/* 水墨晕染背景 */
.ink-wash-bg {
  background-color: var(--bg-paper);
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(74, 93, 78, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(166, 137, 102, 0.1) 0%, transparent 50%);
}

/* 宣纸纹理 */
.rice-paper-bg {
  background-color: var(--bg-paper);
  background-image: url('/images/textures/rice-paper.png');
  background-size: 200px 200px;
}

/* 云纹背景 */
.cloud-pattern-bg {
  background-color: var(--bg-light);
  background-image: url('/images/textures/cloud-pattern.png');
  background-size: 100px 100px;
  opacity: 0.5;
}
```

### 3.2 水墨边框

```css
/* 墨线边框 */
.ink-border {
  border: 1px solid var(--text-ink);
  border-radius: var(--radius-md);
}

/* 渐变墨边 */
.gradient-ink-border {
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, var(--text-ink), var(--text-secondary)) 1;
  border-radius: var(--radius-lg);
}

/* 金边 */
.gold-border {
  border: 1px solid var(--accent-color);
  border-radius: var(--radius-md);
}

/* 双线边框 */
.double-border {
  border: 2px solid var(--primary-color);
  outline: 1px solid var(--accent-color);
  outline-offset: -4px;
  border-radius: var(--radius-md);
}
```

### 3.3 水墨装饰元素

```xml
<!-- 装饰性分隔线 -->
<view class="ink-divider">
  <view class="divider-line"></view>
  <view class="divider-dot"></view>
  <view class="divider-line"></view>
</view>
```

```css
.ink-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-xl) 0;
}

.divider-line {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--text-light), transparent);
}

.divider-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent-color);
  border-radius: 50%;
  margin: 0 var(--spacing-md);
}
```

### 3.4 印章效果

```xml
<!-- 印章装饰 -->
<view class="seal-stamp">
  <text class="seal-text">清如</text>
</view>
```

```css
.seal-stamp {
  width: 60px;
  height: 60px;
  background-color: var(--error-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--error-color);
  transform: rotate(-5deg);
}

.seal-text {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  font-family: 'STSong', 'KaiTi', serif;
  letter-spacing: 4px;
}
```

---

## 4. 字体规范

### 4.1 中文字体栈

```css
/* 全局字体设置 */
page {
  font-family: 
    /* 中文优先 */
    "PingFang SC",          /* 苹果苹方 */
    "Hiragino Sans GB",     /* 冬青黑体 */
    "Microsoft YaHei",      /* 微软雅黑 */
    "Source Han Sans CN",   /* 思源黑体 */
    "Noto Sans CJK SC",     /* 思源黑体 Google 版 */
    /* 英文回退 */
    -apple-system,
    "Helvetica Neue",
    "Arial",
    sans-serif;
}

/* 书法字体（用于标题/装饰） */
.calligraphy-font {
  font-family: 
    "STSong",               /* 华文宋体 */
    "KaiTi",                /* 楷体 */
    "KaiTi_GB2312",         /* 楷体_GB2312 */
    "FangSong",             /* 仿宋 */
    serif;
}
```

### 4.2 字号系统

```css
/* 字号规范 - 基于 2px 基准 */
:root {
  --text-xs: 12px;    /* 辅助文字 */
  --text-sm: 14px;    /* 次要文字 */
  --text-base: 16px;  /* 正文 */
  --text-lg: 18px;    /* 小标题 */
  --text-xl: 20px;    /* 中标题 */
  --text-2xl: 24px;   /* 大标题 */
  --text-3xl: 32px;   /* 特大标题 */
  --text-4xl: 40px;   /* 展示标题 */
}

/* 字号工具类 */
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }
```

### 4.3 字重规范

```css
/* 字重规范 */
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }

/* 标题字重 */
h1, h2, h3 {
  font-weight: var(--font-semibold);
  color: var(--text-ink);
}
```

### 4.4 行高与字间距

```css
/* 行高规范 */
:root {
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  --leading-loose: 2;
}

.leading-tight { line-height: var(--leading-tight); }
.leading-normal { line-height: var(--leading-normal); }
.leading-relaxed { line-height: var(--leading-relaxed); }
.leading-loose { line-height: var(--leading-loose); }

/* 字间距 */
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }

/* 中文排版优化 */
.chinese-text {
  text-align: justify;
  text-justify: inter-ideograph;
  line-height: var(--leading-relaxed);
}
```

### 4.5 竖排文字（古典风格）

```css
/* 竖排文字 */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.1em;
}

/* 从右到左排列 */
.vertical-rl {
  writing-mode: vertical-rl;
}

/* 从左到右排列 */
.vertical-lr {
  writing-mode: vertical-lr;
}
```

---

## 5. 页面布局

### 5.1 首页布局

```xml
<!-- pages/home/index.wxml -->
<view class="page-container">
  <!-- 顶部导航栏 -->
  <view class="header-bar">
    <view class="header-left">
      <text class="location-icon">📍</text>
      <text class="location-text">北京</text>
    </view>
    <view class="header-center">
      <text class="app-title">清如</text>
    </view>
    <view class="header-right">
      <view class="icon-btn">🔔</view>
    </view>
  </view>
  
  <!-- 问候区域 -->
  <view class="greeting-section">
    <text class="greeting-title">{{greetingText}}</text>
    <text class="greeting-subtitle">愿你今日心安</text>
    <view class="greeting-decoration"></view>
  </view>
  
  <!-- 核心功能入口 -->
  <view class="features-grid">
    <view class="feature-item" bind:tap="startMeditation">
      <view class="feature-icon">🧘</view>
      <text class="feature-name">冥想</text>
    </view>
    <view class="feature-item" bind:tap="startBreath">
      <view class="feature-icon">🌬️</view>
      <text class="feature-name">呼吸</text>
    </view>
    <view class="feature-item" bind:tap="playSound">
      <view class="feature-icon">🎵</view>
      <text class="feature-name">白噪音</text>
    </view>
    <view class="feature-item" bind:tap="viewStats">
      <view class="feature-icon">📊</view>
      <text class="feature-name">统计</text>
    </view>
  </view>
  
  <!-- 今日推荐 -->
  <view class="recommend-section">
    <view class="section-header">
      <text class="section-title">今日推荐</text>
      <text class="section-more">查看全部 ›</text>
    </view>
    
    <scroll-view class="cards-scroll" scroll-x>
      <view class="cards-list">
        <view class="course-card" wx:for="{{courses}}" wx:key="id">
          <image class="card-cover" src="{{item.cover}}" mode="aspectFill" />
          <view class="card-info">
            <text class="card-title">{{item.title}}</text>
            <text class="card-desc">{{item.duration}}分钟</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  
  <!-- 底部导航 -->
  <view class="tab-bar">
    <view class="tab-item active">
      <text class="tab-icon">🏠</text>
      <text class="tab-label">首页</text>
    </view>
    <view class="tab-item">
      <text class="tab-icon">📚</text>
      <text class="tab-label">课程</text>
    </view>
    <view class="tab-item">
      <text class="tab-icon">🎵</text>
      <text class="tab-label">声音</text>
    </view>
    <view class="tab-item">
      <text class="tab-icon">👤</text>
      <text class="tab-label">我的</text>
    </view>
  </view>
</view>
```

```css
/* pages/home/index.wxss */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-bottom: calc(var(--tab-bar-height) + var(--spacing-lg));
}

/* 顶部导航栏 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-light);
}

.header-center {
  flex: 1;
  text-align: center;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  font-family: "STSong", "KaiTi", serif;
  letter-spacing: 4px;
}

/* 问候区域 */
.greeting-section {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  background: linear-gradient(180deg, var(--primary-pale) 0%, var(--bg-color) 100%);
}

.greeting-title {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.greeting-subtitle {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
}

.greeting-decoration {
  width: 40px;
  height: 2px;
  background-color: var(--accent-color);
  margin: var(--spacing-md) auto 0;
}

/* 功能网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: #fff;
  margin: var(--spacing-md) 0;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-xs);
}

.feature-name {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 推荐区域 */
.recommend-section {
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
  font-size: 13px;
  color: var(--primary-color);
}

.cards-scroll {
  white-space: nowrap;
}

.cards-list {
  display: inline-flex;
  gap: var(--spacing-md);
}

.course-card {
  display: inline-block;
  width: 160px;
  background-color: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-cover {
  width: 100%;
  height: 100px;
}

.card-info {
  padding: var(--spacing-sm);
}

.card-title {
  display: block;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  display: block;
  font-size: 12px;
  color: var(--text-light);
}

/* 底部导航 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--tab-bar-height, 50px);
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid var(--bg-dark);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.tab-label {
  font-size: 11px;
  color: var(--text-light);
}

.tab-item.active .tab-label {
  color: var(--primary-color);
}
```

### 5.2 课程列表页布局

```xml
<!-- pages/courses/index.wxml -->
<view class="page-container">
  <!-- 搜索栏 -->
  <view class="search-bar">
    <view class="search-input">
      <text class="search-icon">🔍</text>
      <input 
        class="search-field" 
        placeholder="搜索课程" 
        placeholder-class="search-placeholder"
        bind:confirm="onSearch"
      />
    </view>
  </view>
  
  <!-- 分类筛选 -->
  <scroll-view class="category-scroll" scroll-x>
    <view class="category-list">
      <view 
        class="category-item {{currentCategory === item.id ? 'active' : ''}}"
        wx:for="{{categories}}"
        wx:key="id"
        bind:tap="selectCategory"
        data-id="{{item.id}}"
      >
        {{item.name}}
      </view>
    </view>
  </scroll-view>
  
  <!-- 课程列表 -->
  <view class="course-list">
    <view 
      class="course-item" 
      wx:for="{{courses}}" 
      wx:key="id"
      bind:tap="goToCourse"
      data-id="{{item.id}}"
    >
      <image class="course-cover" src="{{item.cover}}" mode="aspectFill" />
      <view class="course-content">
        <view class="course-header">
          <text class="course-title">{{item.title}}</text>
          <view class="course-tags">
            <text class="tag" wx:for="{{item.tags}}" wx:key="*this">{{item}}</text>
          </view>
        </view>
        <text class="course-desc">{{item.description}}</text>
        <view class="course-footer">
          <view class="course-meta">
            <text class="meta-item">⏱️ {{item.duration}}分钟</text>
            <text class="meta-item">👥 {{item.enrolled}}人学习</text>
          </view>
          <view class="course-price">
            <text class="price">{{item.price}}</text>
            <text class="price-original" wx:if="{{item.originalPrice}}">{{item.originalPrice}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</view>
```

```css
/* pages/courses/index.wxss */
/* 搜索栏 */
.search-bar {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: #fff;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-md);
}

.search-icon {
  font-size: 16px;
  margin-right: var(--spacing-sm);
}

.search-field {
  flex: 1;
  font-size: 14px;
}

.search-placeholder {
  color: var(--text-placeholder);
}

/* 分类筛选 */
.category-scroll {
  white-space: nowrap;
  background-color: #fff;
  border-bottom: 1px solid var(--bg-dark);
}

.category-list {
  display: inline-flex;
  padding: var(--spacing-sm) var(--spacing-lg);
  gap: var(--spacing-md);
}

.category-item {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 14px;
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  background-color: var(--bg-color);
}

.category-item.active {
  background-color: var(--primary-color);
  color: #fff;
}

/* 课程列表 */
.course-list {
  padding: var(--spacing-lg);
}

.course-item {
  display: flex;
  background-color: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.course-cover {
  width: 140px;
  height: 100px;
  flex-shrink: 0;
}

.course-content {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.course-tags {
  display: flex;
  gap: var(--spacing-xs);
}

.tag {
  font-size: 11px;
  padding: 2px var(--spacing-xs);
  background-color: var(--primary-pale);
  color: var(--primary-color);
  border-radius: var(--radius-sm);
}

.course-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: var(--spacing-xs) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-meta {
  display: flex;
  gap: var(--spacing-sm);
  font-size: 12px;
  color: var(--text-light);
}

.course-price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-color);
}

.price-original {
  font-size: 13px;
  color: var(--text-light);
  text-decoration: line-through;
}
```

---

## 6. 可复用组件

### 6.1 禅意卡片

```xml
<!-- components/zen-card/index.wxml -->
<view class="zen-card">
  <view class="card-header">
    <text class="card-title">{{title}}</text>
    <view class="card-decoration"></view>
  </view>
  <view class="card-body">
    <slot />
  </view>
  <view class="card-footer" wx:if="{{footer}}">
    {{footer}}
  </view>
</view>
```

```css
/* components/zen-card/index.wxss */
.zen-card {
  background-color: #fff;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--bg-dark);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: "STSong", "KaiTi", serif;
}

.card-decoration {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  margin-left: var(--spacing-md);
}

.card-body {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: var(--leading-relaxed);
}

.card-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--bg-dark);
  font-size: 13px;
  color: var(--text-light);
}
```

### 6.2 日签卡片

```xml
<!-- components/daily-quote/index.wxml -->
<view class="daily-quote">
  <view class="quote-header">
    <text class="quote-date">{{date}}</text>
    <text class="quote-lunar">{{lunarDate}}</text>
  </view>
  <view class="quote-content">
    <text class="quote-text">"{{text}}"</text>
    <text class="quote-author">—— {{author}}</text>
  </view>
  <view class="quote-decoration">
    <view class="seal"></view>
  </view>
</view>
```

```css
/* components/daily-quote/index.wxss */
.daily-quote {
  background: linear-gradient(135deg, var(--bg-paper) 0%, var(--bg-light) 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
}

.quote-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.quote-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.quote-lunar {
  font-size: 13px;
  color: var(--text-light);
  font-family: "KaiTi", serif;
}

.quote-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.quote-text {
  font-size: 18px;
  color: var(--text-ink);
  line-height: var(--leading-loose);
  font-family: "STSong", "KaiTi", serif;
}

.quote-author {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: right;
}

.quote-decoration {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
}

.seal {
  width: 30px;
  height: 30px;
  background-color: var(--error-color);
  border-radius: var(--radius-sm);
  opacity: 0.8;
}
```

---

## 7. 踩坑记录

### 7.1 字体兼容性问题

**问题**: 书法字体在某些设备上无法显示

**解决方案**:
- 提供字体回退方案
- 使用系统支持的字体
- 必要时使用图片替代

### 7.2 竖排文字适配

**问题**: 竖排文字在不同设备上显示不一致

**解决方案**:
- 测试多种设备
- 使用固定容器宽度
- 避免过长的竖排文字

### 7.3 背景图片性能

**问题**: 宣纸纹理等背景图片影响性能

**解决方案**:
- 压缩图片尺寸
- 使用 CSS 渐变替代
- 小图平铺代替大图

### 7.4 颜色对比度

**问题**: 部分配色对比度不足，影响可读性

**解决方案**:
- 使用对比度检测工具
- 确保文字与背景对比度≥4.5:1
- 重要文字使用深色

---

## 8. 清如项目复用建议

### 8.1 核心设计元素

1. **配色系统**: 直接使用文档中的禅意配色
2. **字体规范**: 采用楷体/宋体作为标题字体
3. **水墨元素**: 使用水墨边框、分隔线装饰
4. **页面布局**: 参考首页和列表页布局

### 8.2 清如特色定制

```css
/* 清如项目专属配置 */
page {
  /* 清如主题色 */
  --qingru-primary: #4A5D4E;
  --qingru-accent: #C9B037;
  --qingru-secondary: #A68966;
  
  /* 清如背景 */
  --qingru-bg: #F5F5F0;
  --qingru-paper: #F2F0E9;
  
  /* 清如文字 */
  --qingru-text: #333333;
  --qingru-ink: #2B2B2B;
}

/* 清如 Logo 字体 */
.qingru-logo {
  font-family: "STSong", "KaiTi", serif;
  font-size: 32px;
  letter-spacing: 8px;
  color: var(--qingru-primary);
}
```

### 8.3 设计原则

1. **留白**: 保持充足留白，营造禅意空间感
2. **克制**: 色彩使用克制，以素雅为主
3. **自然**: 使用自然元素（竹、石、水）装饰
4. **统一**: 保持整体风格统一

---

## 9. 总结

国风禅意 UI 模板提供了一套完整的中式美学设计方案，核心要点：

✅ **配色系统**: 竹青、鎏金、檀木等传统配色  
✅ **水墨元素**: 晕染背景、墨线边框、印章装饰  
✅ **字体规范**: 楷体/宋体标题，黑体正文  
✅ **页面布局**: 留白充足，层次分明  
✅ **装饰细节**: 分隔线、云纹、日签等  

对于清如项目，这套设计方案完美契合冥想修行的产品定位，可直接复用核心设计元素，打造专业的禅意体验。

---

**笔记创建时间**: 2026-04-04  
**参考项目**: TeaTools/ChineseStyle-MiniProgram（基于项目描述整理）
