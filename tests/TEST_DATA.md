# 清如 ClearSpring - 测试数据文档

**更新时间**: 2026-03-29 09:25  
**用途**: 单元测试、集成测试、演示数据

---

## 📊 测试数据概览

| 数据类型 | 数量 | 用途 |
|---------|------|------|
| 测试用户 | 3 个 | 祈福者、执行者、管理员 |
| 测试物种 | 5 个 | 推荐放生清单 |
| 测试订单 | 3 个 | 不同状态的订单 |
| 测试证据 | 2 个 | 视频和照片证据 |
| 推荐水域 | 3 个 | 放生地点 |

---

## 👥 测试用户

### 1. 祈福者测试账号

```javascript
{
  openid: 'oTest_Prayer_OpenID_12345',
  nickName: '祈福者测试',
  role: 'prayer',
  phone: '138****5678' // 脱敏
}
```

**用途**: 测试祈福者端所有功能
- 登录注册
- 发布任务
- 查看订单
- 功德林查看

### 2. 执行者测试账号

```javascript
{
  openid: 'oTest_Executor_OpenID_67890',
  nickName: '执行者测试',
  role: 'executor',
  phone: '139****4321', // 脱敏
  executorProfile: {
    qualificationStatus: 'approved', // 已审核
    rating: 4.9,
    totalOrders: 127,
    totalIncome: 12580.00
  }
}
```

**用途**: 测试执行者端所有功能
- 资质审核（已通过）
- 抢单大厅
- 任务执行
- 收入管理

### 3. 管理员测试账号

```javascript
{
  openid: 'oTest_Admin_OpenID_11111',
  nickName: '管理员',
  role: 'admin'
}
```

**用途**: 测试管理端功能
- 资质审核
- 申诉仲裁
- 分账配置

---

## 🐟 测试物种清单

### 推荐放生物种（5 个）

| ID | 名称 | 类型 | 适放季节 | 说明 |
|----|------|------|---------|------|
| species_001 | 鲫鱼 | 淡水鱼 | 四季 | 本地物种，生命力顽强 |
| species_002 | 鲤鱼 | 淡水鱼 | 春秋 | 适应性强，适合春季 |
| species_003 | 泥鳅 | 淡水鱼 | 夏秋 | 底栖鱼类，净化水质 |
| species_004 | 螺蛳 | 软体动物 | 春夏 | 滤食藻类，净化水质 |
| species_005 | 乌龟 | 爬行动物 | 春夏 | 中华草龟，本土龟种 |

**用途**: 
- 测试物种选择功能
- 测试科普百科页面
- 验证物种正面清单

---

## 📦 测试订单

### 订单状态流转

```
pending → grabbed → executing → submitted → confirmed → completed
```

### 测试订单（3 个）

| 订单号 | 物种 | 状态 | 金额 | 用途 |
|--------|------|------|------|------|
| ORD202603290001 | 鲫鱼 | pending | ¥299 | 测试抢单 |
| ORD202603290002 | 鲤鱼 | grabbed | ¥199 | 测试执行 |
| ORD202603290003 | 泥鳅 | executing | ¥399 | 测试证据提交 |

---

## 📍 推荐水域

| ID | 名称 | 距离 | 特点 |
|----|------|------|------|
| water_001 | 钱塘江流域 | 5.2km | 大型水域，生态保护区 |
| water_002 | 西湖水域 | 8.1km | 景区，管理严格 |
| water_003 | 富春江 | 15.3km | 优质水源，生态良好 |

**用途**: 
- 测试位置选择功能
- 测试科普百科页面
- 验证地理位置校验

---

## 🔧 使用方法

### 在测试中导入

```javascript
const testData = require('./test-data');

// 使用测试用户
const prayerUser = testData.users.prayer;

// 使用测试物种
const species = testData.species[0]; // 鲫鱼

// 使用测试订单
const order = testData.orders[0];

// 生成新订单号
const newOrderId = testData.generateOrderId();
```

### 在开发中使用

```javascript
// 快速创建测试订单
const testOrder = {
  ...testData.orders[0],
  orderId: testData.generateOrderId()
};

// 生成测试用户
const newUser = testData.generateUser('prayer');
```

---

## 📝 数据说明

### 手机号脱敏

所有测试手机号都已脱敏：
- 原始：`13812345678`
- 脱敏：`138****5678`

### 身份证脱敏

- 原始：`440101199001011234`
- 脱敏：`4401********1234`

### 地理位置

所有测试坐标都是真实地理位置：
- 广州白云区：23.1234, 113.2345
- 深圳南山区：22.4833, 113.9167
- 杭州西湖区：30.2441, 120.1488

---

## ⚠️ 注意事项

1. **测试数据不要提交到生产环境**
   - 测试 openid 都有 `oTest_` 前缀
   - 测试订单号都有特殊格式

2. **敏感信息已脱敏**
   - 手机号：中间 4 位用 `****` 替代
   - 身份证：中间 8 位用 `****` 替代

3. **测试数据可重置**
   - 测试数据库可随时清空重建
   - 不影响生产数据

---

## 🔄 更新记录

| 时间 | 更新内容 | 负责人 |
|------|---------|--------|
| 2026-03-29 09:25 | 初始版本，包含基础测试数据 | AI Agent |

---

**文件位置**: `/home/admin/.openclaw/workspace/projects/clearspring/tests/test-data.js`  
**维护方式**: 随功能迭代持续更新
