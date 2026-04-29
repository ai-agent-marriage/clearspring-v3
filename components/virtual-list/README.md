# 虚拟列表组件 (Virtual List)

高性能列表组件，通过只渲染可见区域的项目来优化长列表性能。

## 使用场景

- 订单列表（50+ 条记录）
- 消息列表
- 志愿者列表
- 任何长列表场景

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| list | Array | [] | 列表数据 |
| itemHeight | Number | 100 | 每个项目的高度（px） |
| bufferSize | Number | 1 | 缓冲区大小（上下各渲染多少屏） |
| threshold | Number | 50 | 启用虚拟列表的阈值（列表长度超过此值时启用） |
| containerHeight | Number | 600 | 容器高度（px） |

## 事件

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| bind:itemtap | 项目点击事件 | {item, index} |

## 使用方法

### 1. 在页面 JSON 中引入组件

```json
{
  "usingComponents": {
    "virtual-list": "/components/virtual-list/virtual-list"
  }
}
```

### 2. 在 WXML 中使用

```xml
<virtual-list
  list="{{orders}}"
  item-height="120"
  container-height="600"
  threshold="30"
  bind:itemtap="onOrderTap"
>
  <view slot-scope="{item, index}" class="order-card">
    <text>{{item.orderNo}}</text>
    <text>{{item.statusName}}</text>
  </view>
</virtual-list>
```

### 3. 在 JS 中处理事件

```javascript
Page({
  onOrderTap(e) {
    const { item, index } = e.detail;
    console.log('点击了订单:', item);
  }
});
```

## 性能优化建议

1. **设置合适的 itemHeight**：根据实际项目高度设置，避免计算偏差
2. **调整 bufferSize**：网络状况好时可以减小，差时增大
3. **降低 threshold**：移动端建议设置为 20-30
4. **避免复杂嵌套**：slot 中的内容尽量简洁

## 注意事项

- 虚拟列表要求所有项目高度一致
- 如果项目高度动态变化，需要重新计算
- 首次渲染可能有轻微闪烁，属于正常现象

## 性能对比

| 场景 | 普通列表 | 虚拟列表 | 提升 |
|------|----------|----------|------|
| 50 条数据 | 50 个 DOM | 50 个 DOM | - |
| 100 条数据 | 100 个 DOM | ~30 个 DOM | 60%+ |
| 500 条数据 | 500 个 DOM | ~30 个 DOM | 90%+ |
| 1000 条数据 | 1000 个 DOM | ~30 个 DOM | 95%+ |
