# ECharts 集成学习笔记

## 概述

本文档记录在微信小程序中集成 ECharts 图表库的完整流程和最佳实践。

## 安装步骤

### 1. 安装 ECharts

```bash
cd miniprogram
npm install echarts --save
```

### 2. 构建 npm

在微信开发者工具中：
1. 点击「工具」→「构建 npm」
2. 等待构建完成

### 3. 配置 app.json

确保在 `app.json` 中正确配置页面路径：

```json
{
  "pages": [
    "pages/admin/stats/index",
    "pages/admin/stats/dashboard",
    "pages/admin/stats/trend"
  ]
}
```

## 工具类封装

### 核心函数

创建 `utils/echarts.js` 提供统一的图表操作接口：

```javascript
import * as echarts from 'echarts'

// 初始化图表（Promise 方式）
export function initChart(canvasId, option, options = {}) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const dpr = wx.getSystemInfoSync().pixelRatio
        
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        
        const chart = echarts.init(canvas, null, {
          renderer: 'canvas',
          devicePixelRatio: dpr
        })
        
        chart.setOption(option)
        resolve(chart)
      })
  })
}

// 销毁图表
export function disposeChart(chart) {
  if (chart) {
    chart.dispose()
  }
}
```

## 页面集成示例

### 基础折线图

```javascript
// pages/admin/stats/index.js
import * as echarts from 'echarts'

Page({
  data: {
    orderTrendChart: null
  },

  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#orderTrendChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const dpr = wx.getSystemInfoSync().pixelRatio
        
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        
        const chart = echarts.init(canvas, null, {
          renderer: 'canvas',
          devicePixelRatio: dpr
        })
        
        const option = {
          title: { text: '订单趋势' },
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7']
          },
          yAxis: { type: 'value' },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line',
            smooth: true,
            itemStyle: { color: '#4A5D4E' }
          }]
        }
        
        chart.setOption(option)
        this.setData({ orderTrendChart: chart })
      })
  },

  onUnload() {
    if (this.data.orderTrendChart) {
      this.data.orderTrendChart.dispose()
    }
  }
})
```

### WXML 模板

```xml
<view class="chart-container">
  <canvas type="2d" id="orderTrendChart" class="chart-canvas"></canvas>
</view>
```

### WXSS 样式

```css
.chart-container {
  width: 100%;
  height: 400rpx;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}
```

## 常见图表类型

### 1. 折线图（趋势分析）

```javascript
{
  title: { text: '订单趋势' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: dates },
  yAxis: { type: 'value' },
  series: [{
    data: values,
    type: 'line',
    smooth: true
  }]
}
```

### 2. 饼图（分布分析）

```javascript
{
  title: { text: '物种分布' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'horizontal', bottom: '0' },
  series: [{
    type: 'pie',
    radius: '60%',
    data: [
      { value: 256, name: '鱼类' },
      { value: 145, name: '鸟类' },
      { value: 55, name: '其他' }
    ]
  }]
}
```

### 3. 环形图（状态分布）

```javascript
{
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 120, name: '待承接' },
      { value: 200, name: '待执行' },
      { value: 150, name: '执行中' },
      { value: 80, name: '待确认' },
      { value: 456, name: '已完成' }
    ]
  }]
}
```

### 4. 柱状图（排行榜）

```javascript
{
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: names },
  series: [{
    type: 'bar',
    data: values,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#FFD700' },
        { offset: 1, color: '#FFA500' }
      ]),
      borderRadius: [0, 10, 10, 0]
    }
  }]
}
```

### 5. 组合图（多指标对比）

```javascript
{
  tooltip: { trigger: 'axis' },
  legend: { data: ['订单数', '成交金额'] },
  xAxis: { type: 'category', data: dates },
  yAxis: [
    { type: 'value', name: '订单数' },
    { type: 'value', name: '金额', axisLabel: { formatter: '{value}元' } }
  ],
  series: [
    { name: '订单数', type: 'bar', data: orderData },
    { name: '成交金额', type: 'line', yAxisIndex: 1, data: amountData }
  ]
}
```

## 深色主题配置

```javascript
const darkTheme = {
  backgroundColor: '#1a1a2e',
  textStyle: { color: '#ffffff' },
  axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
  splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
}
```

## 性能优化

### 1. 图表实例管理

- 在 `onUnload` 生命周期中销毁图表实例
- 避免重复创建图表

```javascript
onUnload() {
  if (this.data.chart) {
    this.data.chart.dispose()
  }
}
```

### 2. 数据更新优化

- 使用 `setOption` 的合并模式
- 只更新变化的数据

```javascript
chart.setOption({
  series: [{ data: newData }]
})
```

### 3. 响应式适配

- 监听屏幕旋转和尺寸变化
- 调用 `chart.resize()` 方法

```javascript
wx.onWindowResize(() => {
  if (this.data.chart) {
    this.data.chart.resize()
  }
})
```

## 常见问题

### Q1: 图表不显示

**原因**: Canvas 尺寸未正确设置

**解决**: 确保设置 `canvas.width` 和 `canvas.height`

```javascript
canvas.width = res[0].width * dpr
canvas.height = res[0].height * dpr
```

### Q2: 图表模糊

**原因**: 未考虑设备像素比

**解决**: 使用 `wx.getSystemInfoSync().pixelRatio`

### Q3: 内存泄漏

**原因**: 未销毁图表实例

**解决**: 在页面卸载时调用 `chart.dispose()`

## 最佳实践总结

1. **统一封装**: 创建工具类管理图表生命周期
2. **及时清理**: 页面卸载时销毁图表实例
3. **响应式**: 适配不同屏幕尺寸
4. **性能优先**: 避免频繁重绘，使用数据更新而非全量重绘
5. **主题一致**: 统一配色方案，保持视觉一致性

## 参考资料

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [微信小程序 Canvas 2D](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html)
- [ECharts 微信小程序适配](https://echarts.apache.org/zh/tutorial.html#%E5%9C%A8%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%AD%E4%BD%BF%E7%94%A8)
