# 订单流程实现学习笔记

## 📅 学习时间
2026-04-04 | Phase 1 Week 1 Day 4

## 🎯 学习目标
完成订单板块 4 个核心页面的开发，掌握微信小程序订单流程的设计与实现。

## 📚 核心知识点

### 1. 页面结构设计

#### 1.1 下单页 (create)
- **顶部导航栏**: 使用渐变色背景，白色标题
- **合规承诺书**: 通栏白色卡片，必须勾选才能继续
- **表单组件**: 
  - 日期选择器 (picker mode="date")
  - 下拉选择器 (picker mode="selector")
  - 数字输入框 (input type="number")
  - 复选框组 (checkbox-group)
  - 多行文本 (textarea)
- **底部金额栏**: 固定定位，实时计算总额

#### 1.2 确认页 (confirm)
- **订单信息区**: 分模块展示所有订单信息
- **金额明细区**: 清晰展示费用构成
- **协议确认**: 复选框 + 可点击协议链接
- **吸底支付按钮**: 展示订单总额

#### 1.3 列表页 (list)
- **状态 Tab 栏**: 横向滚动，支持状态筛选
- **订单卡片**: 展示核心信息 + 状态标签
- **操作按钮**: 根据订单状态动态显示
- **空状态**: 极简插画 + 提示文字

#### 1.4 详情页 (detail)
- **进度条**: 步骤式展示订单流转状态
- **信息卡片**: 分区域展示订单详情
- **执行材料**: 图片网格 + 放大预览
- **底部操作**: 根据状态显示不同按钮

### 2. 关键技术实现

#### 2.1 实时金额计算
```javascript
calculateTotal() {
  const { form, species, extraServices } = this.data;
  
  // 基础金额
  let baseAmount = 0;
  const selectedSpecies = species.find(s => s.name === form.species);
  if (selectedSpecies) {
    baseAmount = selectedSpecies.price * form.quantity;
  }

  // 增值服务金额
  let extraAmount = 0;
  form.extraServices.forEach(serviceId => {
    const service = extraServices.find(s => s.id === parseInt(serviceId));
    if (service) {
      extraAmount += service.price;
    }
  });

  this.setData({
    totalAmount: baseAmount + extraAmount
  });
}
```

#### 2.2 日期范围限制
```javascript
onLoad() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 7);  // 未来 7 天
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30); // 未来 30 天

  this.setData({
    minDate: this.formatDate(minDate),
    maxDate: this.formatDate(maxDate)
  });
}
```

#### 2.3 状态筛选
```javascript
getFilteredOrders() {
  const { activeTab, orders } = this.data;
  if (activeTab === 0) return orders; // 全部
  return orders.filter(order => order.status === activeTab);
}
```

#### 2.4 图片预览
```javascript
previewImage(e) {
  const url = e.currentTarget.dataset.url;
  const { executeImages } = this.data.order;
  
  wx.previewImage({
    current: url,
    urls: executeImages
  });
}
```

### 3. 样式规范

#### 3.1 色彩系统
```css
--gold-main: #D4B87B;     /* 禅意金主 - 核心元素 */
--gold-dim: #6E5E00;      /* 暖沙金暗 - 次主色 */
--bg-xuan: #EFEEE9;       /* 宣纸底 - 全局基底 */
--text-main: #434843;     /* 墨灰主 - 正文 */
--text-dim: #727772;      /* 浅墨次 - 辅助文字 */
```

#### 3.2 状态标签颜色
- 待承接 (status-1): 橙色警告
- 待执行 (status-2): 蓝色信息
- 执行中 (status-3): 绿色处理
- 待确认 (status-4): 金色高亮
- 已完成 (status-5): 绿色成功
- 已取消 (status-6): 灰色取消

#### 3.3 按钮样式
- 主按钮：金色渐变背景，白色文字
- 次按钮：浅色背景，金色/绿色边框
- 危险按钮：红色背景，用于取消操作

### 4. 用户体验优化

#### 4.1 表单验证
- 必填项标记 (*)
- 实时计算金额
- 提交前完整性校验
- 合规承诺前置确认

#### 4.2 交互反馈
- 按钮点击态 (active)
- Loading 状态展示
- Toast 提示消息
- Modal 二次确认

#### 4.3 空状态处理
- 极简插画
- 友好提示文字
- 引导操作按钮

## 🔧 遇到的问题与解决方案

### 问题 1: 日期选择器范围限制
**问题**: 需要限制只能选择未来 7-30 天的日期
**解决**: 在 onLoad 中计算 minDate 和 maxDate，传递给 picker 组件

### 问题 2: 动态金额计算
**问题**: 多个表单字段变化都需要重新计算总额
**解决**: 封装 calculateTotal 方法，在每个字段变化时调用

### 问题 3: 状态 Tab 切换
**问题**: 需要根据 Tab 筛选不同状态的订单
**解决**: 使用 getFilteredOrders 方法，根据 activeTab 返回筛选后的数组

### 问题 4: 图片预览
**问题**: 执行材料图片需要支持点击放大
**解决**: 使用 wx.previewImage API，传入当前图片和图片数组

## 📝 代码规范要点

1. **命名规范**
   - 文件名：小写 + 连字符 (order-create.js)
   - 函数名：驼峰命名 (calculateTotal)
   - 数据属性：驼峰命名 (totalAmount)

2. **注释规范**
   - 文件头部注释说明页面功能
   - 关键函数添加注释
   - 复杂逻辑添加行内注释

3. **样式规范**
   - 使用 CSS 变量
   - 遵循 BEM 命名
   - 保持样式复用性

## 🚀 后续优化方向

1. **数据持久化**: 使用本地存储缓存表单数据
2. **网络请求**: 封装 API 请求，添加错误处理
3. **性能优化**: 图片懒加载，列表虚拟滚动
4. **可访问性**: 添加 aria 标签，支持屏幕阅读器
5. **国际化**: 抽离文案，支持多语言

## 📖 参考资料

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Stitch 设计规范](内部文档)
- [V4.0 禅意美学规范](内部文档)

---
*笔记创建时间：2026-04-04*
*作者：前端开发-Agent*
