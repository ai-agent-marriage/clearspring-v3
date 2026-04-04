# 清如 V3 API 接口文档 V1.0

> 文档版本：V1.0  
> 适用范围：微信小程序端、WEB 管理后台端  
> 接口风格：RESTful API  
> 数据格式：JSON

---

## 📋 一、通用规范

### 1.1 基础请求地址

| 环境 | 基础 URL |
|------|----------|
| **开发环境** | `http://localhost:8080/api` |
| **测试环境** | `https://test.qingru.com/api` |
| **生产环境** | `https://api.qingru.com/api` |

---

### 1.2 请求方式规范

| 请求方式 | 适用场景 |
|----------|----------|
| **GET** | 数据查询、列表获取、详情查看 |
| **POST** | 数据新增、提交表单、订单创建、支付发起 |
| **PUT** | 数据修改、状态更新、信息编辑 |
| **DELETE** | 数据删除、记录移除 |

---

### 1.3 统一请求头

所有接口请求必须携带以下请求头（登录接口除外）：

| 头部字段 | 必选 | 说明 |
|----------|------|------|
| `Content-Type` | 是 | 固定值 `application/json;charset=utf-8` |
| `Authorization` | 是 | 登录后返回的 token，格式 `Bearer {token}` |
| `openid` | 是 | 微信用户唯一标识，小程序端所有接口必传 |

---

### 1.4 统一响应体格式

所有接口返回统一 JSON 结构：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {},
  "timestamp": 1712345678901
}
```

**字段说明**:
- `code`: int，响应状态码，200 为成功，非 200 为失败
- `msg`: string，响应描述，成功/失败提示信息
- `data`: object/array，业务数据，无数据时返回 null
- `timestamp`: long，服务器时间戳

---

### 1.5 统一错误码定义

#### 通用错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误/格式错误 |
| 401 | 未登录/登录失效/token 过期 |
| 403 | 权限不足，禁止访问 |
| 404 | 接口/资源不存在 |
| 500 | 服务器内部错误 |

#### 业务错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户不存在/未注册 |
| 1002 | 微信授权失败，code 无效 |
| 1003 | 角色权限不匹配 |
| 1004 | 实名认证失败/未实名认证 |
| 2001 | 订单不存在 |
| 2002 | 订单状态异常，无法操作 |
| 2003 | 支付失败/金额不匹配 |
| 2004 | 无可用承接机构，无法创建订单 |
| 3001 | 该物种为禁止投放物种，无法提交 |
| 3002 | 护生记录不存在 |
| 4001 | 证书不存在 |
| 5001 | 机构资质未审核/已禁用 |
| 5002 | 志愿者未绑定机构，无法承接任务 |
| 6001 | 内容审核不通过，包含违规信息 |

---

## 📱 二、小程序端核心接口

### 2.1 用户认证与角色模块

#### 2.1.1 微信一键登录

**接口详情**:
- **接口名称**: 微信授权登录
- **请求方式**: POST
- **接口地址**: `/user/login`
- **是否需要登录**: 否

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| code | string | 是 | wx.login() 获取的微信临时授权码 |
| nickName | string | 否 | 用户微信昵称 |
| avatarUrl | string | 否 | 用户微信头像地址 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
    "userInfo": {
      "id": 1,
      "nickname": "清如用户",
      "avatar": "https://xxx/avatar.jpg",
      "roleCode": "user",
      "orgId": 0,
      "merit": 0
    }
  },
  "timestamp": 1712345678901
}
```

---

### 2.2 禅理内容模块

#### 2.2.1 获取随机禅理

**接口详情**:
- **接口名称**: 获取随机禅理
- **请求方式**: GET
- **接口地址**: `/zen/random`
- **是否需要登录**: 否

**请求参数（Query）**: 无

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 108,
    "content": "积善成德，而神明自得，圣心备焉",
    "author": "荀子",
    "createTime": "2026-04-04"
  },
  "timestamp": 1712345678901
}
```

---

#### 2.2.2 获取每日一禅

**接口详情**:
- **接口名称**: 获取当日每日一禅
- **请求方式**: GET
- **接口地址**: `/zen/daily`
- **是否需要登录**: 否

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| date | string | 否 | 日期，格式 yyyy-MM-dd，默认当日 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 200,
    "content": "心无挂碍，无挂碍故，无有恐怖",
    "author": "心经",
    "date": "2026-04-04",
    "backgroundList": [
      "https://xxx/bg1.jpg",
      "https://xxx/bg2.jpg"
    ]
  },
  "timestamp": 1712345678901
}
```

---

### 2.3 佛历数据接口

#### 2.3.1 获取今日佛历

**接口详情**:
- **接口名称**: 获取今日佛历信息
- **请求方式**: GET
- **接口地址**: `/lunar/today`
- **是否需要登录**: 否

**请求参数（Query）**: 无

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "date": "2026-04-07",
    "lunarDate": "二月十九",
    "lunarYear": "丙午年",
    "lunarMonth": "二月",
    "lunarDay": "十九",
    "jieqi": "",
    "pengzijie": "开",
    "suit": ["护生", "放生", "祈福", "斋戒"],
    "avoid": ["杀生", "祭祀"],
    "weekDay": "星期二",
    "timestamp": 1712345678901
  },
  "timestamp": 1712345678901
}
```

---

#### 2.3.2 判断日期是否宜护生

**接口详情**:
- **接口名称**: 判断日期是否适合护生
- **请求方式**: GET
- **接口地址**: `/lunar/suit`
- **是否需要登录**: 否

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| date | string | 否 | 日期，格式 yyyy-MM-dd，默认当日 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "date": "2026-04-07",
    "isSuit": true,
    "suitList": ["护生", "放生", "祈福", "斋戒"],
    "avoidList": ["杀生", "祭祀"],
    "reason": "今日宜护生放生，积德行善"
  },
  "timestamp": 1712345678901
}
```

---

### 2.4 物种查询接口

#### 2.4.1 获取物种列表

**接口详情**:
- **接口名称**: 获取护生物种列表
- **请求方式**: GET
- **接口地址**: `/species/list`
- **是否需要登录**: 否

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| type | int | 否 | 物种类型 1 鱼类 2 鸟类 3 其他 |
| keyword | string | 否 | 搜索关键词 |
| isForbid | int | 否 | 是否禁止 0 否 1 是 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "鲢鱼",
      "type": 1,
      "isForbid": 0,
      "remark": "原生淡水鱼类，适宜江河湖泊投放，净化水质",
      "sort": 1
    },
    {
      "id": 2,
      "name": "清道夫",
      "type": 1,
      "isForbid": 1,
      "remark": "入侵物种，严禁自然水域投放",
      "sort": 99
    }
  ],
  "timestamp": 1712345678901
}
```

---

#### 2.4.2 获取物种详情

**接口详情**:
- **接口名称**: 获取物种详细信息
- **请求方式**: GET
- **接口地址**: `/species/detail/{id}`
- **是否需要登录**: 否

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 物种 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "name": "鲢鱼",
    "type": 1,
    "isForbid": 0,
    "scientificName": "Hypophthalmichthys molitrix",
    "protectLevel": "无",
    "suitableHabitat": "淡水江河、湖泊、水库",
    "bestTime": "每年 3-6 月、9-11 月",
    "remark": "原生滤食性鱼类，可有效净化水体富营养化，合规投放首选物种",
    "forbidTip": "",
    "createTime": "2026-04-01"
  },
  "timestamp": 1712345678901
}
```

---

### 2.5 海报生成接口

#### 2.5.1 生成每日一禅海报

**接口详情**:
- **接口名称**: 生成每日一禅分享海报
- **请求方式**: POST
- **接口地址**: `/poster/daily-zen`
- **是否需要登录**: 否

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| quoteId | long | 是 | 禅理 ID |
| backgroundIndex | int | 否 | 背景图索引，默认 0 |
| customText | string | 否 | 自定义文案（可选） |

**响应示例**:

```json
{
  "code": 200,
  "msg": "海报生成成功",
  "data": {
    "posterUrl": "https://xxx/poster/zen-20260407.jpg",
    "quoteContent": "心无挂碍，无挂碍故，无有恐怖",
    "backgroundUrl": "https://xxx/bg1.jpg",
    "expireTime": "2026-04-14 23:59:59"
  },
  "timestamp": 1712345678901
}
```

---

## 📝 三、接口补充说明

### 3.1 图片/视频上传

所有涉及用户上传的图片/视频，需先调用微信上传接口，再将返回的 URL 提交至业务接口。

---

### 3.2 内容安全审核

所有用户提交的文本内容（心愿备注、执行备注、评价等），均需先经过微信内容安全 API 审核，审核通过后方可提交。

---

### 3.3 支付接口规范

支付相关接口需严格遵循微信支付 V3 接口规范，支付回调接口需做签名验签处理。

---

### 3.4 权限校验

所有涉及角色权限的接口，后端需做严格的权限校验，禁止越权操作。

---

### 3.5 安全校验

所有接口需做参数合法性校验，防止 SQL 注入、XSS 攻击等安全问题。

---

---

## 🛠️ 四、订单管理接口

### 4.1 订单状态流转接口

#### 4.1.1 取消订单

**接口详情**:
- **接口名称**: 取消订单
- **请求方式**: PUT
- **接口地址**: `/api/order/cancel/{orderNo}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单编号 |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| reason | string | 否 | 取消原因 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "订单取消成功",
  "data": {
    "orderNo": "ORD202604070001",
    "status": "cancelled",
    "cancelTime": "2026-04-07 14:30:00",
    "refundAmount": 0,
    "refundStatus": "no_payment"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅待支付状态的订单可取消
- 48 小时未支付自动取消（定时任务）
- 已支付订单取消需申请复核

---

#### 4.1.2 申请复核

**接口详情**:
- **接口名称**: 申请复核
- **请求方式**: POST
- **接口地址**: `/api/order/review/{orderNo}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单编号 |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| reviewReason | string | 是 | 复核原因 |
| contactPhone | string | 是 | 联系电话 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "复核申请已提交",
  "data": {
    "orderNo": "ORD202604070001",
    "reviewStatus": "pending",
    "submitTime": "2026-04-07 14:30:00",
    "expectedFeedbackTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅已取消/已完成状态的订单可申请复核
- 复核结果 24 小时内反馈
- 复核期间订单状态锁定

---

### 4.2 机构承接订单接口

#### 4.2.1 获取可承接订单

**接口详情**:
- **接口名称**: 获取可承接订单列表
- **请求方式**: GET
- **接口地址**: `/api/org/order/available`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |
| speciesType | int | 否 | 物种类型筛选 |
| waterArea | string | 否 | 水域筛选 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 15,
    "list": [
      {
        "orderNo": "ORD202604070001",
        "speciesName": "鲢鱼",
        "quantity": 50,
        "waterArea": "西湖",
        "scheduledDate": "2026-04-10",
        "serviceType": "basic",
        "totalAmount": 500,
        "createTime": "2026-04-07 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅已支付且未承接的订单可被承接
- 机构需有对应资质才能承接
- 按距离/评分/承接能力智能排序

---

#### 4.2.2 承接订单

**接口详情**:
- **接口名称**: 承接订单
- **请求方式**: POST
- **接口地址**: `/api/org/order/accept/{orderNo}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单编号 |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| executorName | string | 是 | 执行人姓名 |
| executorPhone | string | 是 | 执行人电话 |
| estimatedTime | string | 是 | 预计执行时间 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "订单承接成功",
  "data": {
    "orderNo": "ORD202604070001",
    "status": "pending_execution",
    "orgId": 1001,
    "orgName": "杭州护生协会",
    "executorName": "张师兄",
    "executorPhone": "138****1234",
    "acceptTime": "2026-04-07 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 承接后订单状态变更为"待执行"
- 同一订单只能被一个机构承接
- 承接后 24 小时内需执行完成

---

### 4.3 志愿者任务分配接口

#### 4.3.1 分配任务

**接口详情**:
- **接口名称**: 分配志愿者任务
- **请求方式**: POST
- **接口地址**: `/api/volunteer/task/assign`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单编号 |
| volunteerId | long | 是 | 志愿者 ID |
| taskType | string | 是 | 任务类型：execute/photograph/confirm |
| deadline | string | 是 | 截止时间 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "任务分配成功",
  "data": {
    "taskId": "TSK202604070001",
    "orderNo": "ORD202604070001",
    "volunteerId": 2001,
    "volunteerName": "李师兄",
    "taskType": "execute",
    "status": "assigned",
    "deadline": "2026-04-10 18:00:00",
    "assignTime": "2026-04-07 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 任务类型：execute（执行）、photograph（拍照）、confirm（确认）
- 志愿者需绑定机构才能接收任务
- 任务分配后发送通知给志愿者

---

#### 4.3.2 获取我的任务

**接口详情**:
- **接口名称**: 获取我的任务列表
- **请求方式**: GET
- **接口地址**: `/api/volunteer/task/my`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | string | 否 | 任务状态筛选：assigned/doing/done |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 5,
    "list": [
      {
        "taskId": "TSK202604070001",
        "orderNo": "ORD202604070001",
        "taskType": "execute",
        "speciesName": "鲢鱼",
        "quantity": 50,
        "waterArea": "西湖",
        "scheduledDate": "2026-04-10",
        "status": "assigned",
        "deadline": "2026-04-10 18:00:00",
        "assignTime": "2026-04-07 14:30:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回当前志愿者的所有任务
- 支持按状态筛选
- 即将到期的任务优先展示

---

### 4.4 结算接口

#### 4.4.1 创建结算单

**接口详情**:
- **接口名称**: 创建结算单
- **请求方式**: POST
- **接口地址**: `/api/settlement/create`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单编号 |
| orgId | long | 是 | 机构 ID |
| settlementAmount | number | 是 | 结算金额 |
| serviceFee | number | 是 | 服务费 |
| platformFee | number | 是 | 平台服务费 |
| remark | string | 否 | 备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "结算单创建成功",
  "data": {
    "settlementId": "SET202604070001",
    "settlementNo": "SETTLE202604070001",
    "orderNo": "ORD202604070001",
    "orgId": 1001,
    "orgName": "杭州护生协会",
    "settlementAmount": 450,
    "serviceFee": 50,
    "platformFee": 50,
    "totalAmount": 500,
    "status": "pending_confirm",
    "createTime": "2026-04-07 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 订单完成后自动生成结算单
- 结算金额 = 订单金额 - 平台服务费
- 结算单状态：待确认/已确认/已打款

---

#### 4.4.2 确认结算

**接口详情**:
- **接口名称**: 确认结算
- **请求方式**: POST
- **接口地址**: `/api/settlement/confirm/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 结算单 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| confirmBy | long | 是 | 确认人 ID |
| confirmRemark | string | 否 | 确认备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "结算确认成功",
  "data": {
    "settlementId": "SET202604070001",
    "settlementNo": "SETTLE202604070001",
    "status": "confirmed",
    "confirmTime": "2026-04-07 14:30:00",
    "confirmBy": 1001,
    "confirmByName": "管理员",
    "expectedPaymentTime": "2026-04-08 12:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅待确认状态的结算单可确认
- 确认后进入打款流程
- 打款完成后状态变更为"已打款"

---

*清如 V3 · API 接口文档 V1.0 完成* 🌊

**文档版本**: V1.1  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-04  
**更新内容**: 
- 添加佛历数据接口、禅理内容接口、物种查询接口、海报生成接口
- 添加订单状态流转接口（取消订单、申请复核）
- 添加机构承接订单接口（获取可承接订单、承接订单）
- 添加志愿者任务分配接口（分配任务、获取我的任务）
- 添加结算接口（创建结算单、确认结算）

---

## 🔧 五、后端核心接口（Phase 1 Day 4）

### 5.1 订单状态流转接口

#### 5.1.1 取消订单

**接口地址**: `PUT /order/cancel/{orderNo}`

**请求参数**:
- `orderNo` (path): 订单号

**响应示例**:
```json
{
  "code": 200,
  "msg": "订单取消成功",
  "data": null
}
```

**业务规则**:
- 订单状态流转：1 待承接 → 6 已取消
- 48 小时无承接自动取消（定时任务每小时执行）

---

#### 5.1.2 申请复核

**接口地址**: `POST /order/review/{orderNo}`

**请求参数**:
- `orderNo` (path): 订单号
- `reason` (body): 复核原因

**响应示例**:
```json
{
  "code": 200,
  "msg": "复核申请已提交",
  "data": null
}
```

---

### 5.2 机构承接订单接口

#### 5.2.1 获取可承接订单列表

**接口地址**: `GET /org/order/available`

**请求参数**:
- `orgId` (query): 机构 ID
- `pageNum` (query, 可选): 页码，默认 1
- `pageSize` (query, 可选): 每页数量，默认 10

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "orderNo": "PRO202604040001",
      "userId": 1,
      "speciesId": 1,
      "quantity": 10,
      "amount": 100.00,
      "status": 1,
      "address": "西湖"
    }
  ]
}
```

---

#### 5.2.2 承接订单

**接口地址**: `POST /org/order/accept/{orderNo}`

**请求参数**:
- `orderNo` (path): 订单号
- `orgId` (query): 机构 ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "承接成功",
  "data": null
}
```

**业务规则**:
- 仅状态为 1（待承接）的订单可承接
- 承接后订单状态变更为 2（待执行）
- 创建机构承接记录

---

### 5.3 志愿者任务分配接口

#### 5.3.1 分配任务

**接口地址**: `POST /volunteer/task/assign`

**请求参数**:
- `orderNo` (query): 订单号
- `volunteerId` (query): 志愿者 ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "分配成功",
  "data": null
}
```

**业务规则**:
- 志愿者必须绑定机构才能接收任务
- 创建志愿者任务记录，状态为 1（待执行）

---

#### 5.3.2 获取我的任务列表

**接口地址**: `GET /volunteer/task/my`

**请求参数**:
- `volunteerId` (query): 志愿者 ID
- `status` (query, 可选): 任务状态筛选
- `pageNum` (query, 可选): 页码
- `pageSize` (query, 可选): 每页数量

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": 1,
      "orderNo": "PRO202604040001",
      "volunteerId": 1,
      "status": 1,
      "assignTime": "2026-04-04 14:30:00"
    }
  ]
}
```

---

### 5.4 结算接口

#### 5.4.1 创建结算单

**接口地址**: `POST /settlement/create`

**请求参数**:
- `orderNo` (query): 订单号

**响应示例**:
```json
{
  "code": 200,
  "msg": "结算单创建成功",
  "data": {
    "id": 1,
    "orderNo": "PRO202604040001",
    "orgId": 100,
    "amount": 90.00,
    "platformFee": 10.00,
    "status": 1
  }
}
```

**业务规则**:
- 仅状态为 5（已完成）的订单可结算
- 平台服务费为订单金额的 10%
- 结算金额 = 订单金额 - 平台服务费

---

#### 5.4.2 确认结算

**接口地址**: `POST /settlement/confirm/{id}`

**请求参数**:
- `id` (path): 结算单 ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "结算确认成功",
  "data": null
}
```

**业务规则**:
- 确认后结算状态变更为 2（已结算）
- 订单状态变更为 6（已结算）

---

### 5.5 订单状态流转图

```
1 待承接 
  ├─→ 2 待执行（机构承接）
  └─→ 6 已取消（用户取消/超时自动取消）

2 待执行 
  ├─→ 3 执行中（志愿者开始执行）
  └─→ 6 已取消

3 执行中 → 4 待确认（执行完成待用户确认）

4 待确认 → 5 已完成（用户确认）

5 已完成 → 6 已结算（T+7 自动结算）
```

---

### 5.6 定时任务

**自动取消未承接订单**:
- Cron 表达式：`0 0 * * * ?`（每小时执行）
- 逻辑：查询创建时间超过 48 小时且状态为 1 的订单，自动取消并触发退款

---

## 🔷 六、志愿者接口（Phase 1 Day 5）

### 6.1 获取志愿者详情

**接口详情**:
- **接口名称**: 获取志愿者详情
- **请求方式**: GET
- **接口地址**: `/api/volunteer/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 志愿者 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 2001,
    "userId": 1001,
    "userName": "李师兄",
    "phone": "138****1234",
    "orgId": 1001,
    "orgName": "杭州护生协会",
    "role": "volunteer",
    "status": 1,
    "taskCount": 15,
    "completedCount": 12,
    "rating": 4.8,
    "bindTime": "2026-03-01 10:00:00",
    "lastTaskTime": "2026-04-06 15:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回志愿者基本信息及所属机构信息
- 包含任务统计数据
- 仅管理员或本人可查看

---

### 6.2 更新志愿者信息

**接口详情**:
- **接口名称**: 更新志愿者信息
- **请求方式**: PUT
- **接口地址**: `/api/volunteer/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 志愿者 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| phone | string | 否 | 联系电话 |
| status | int | 否 | 状态 1 启用 0 禁用 |
| remark | string | 否 | 备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 2001,
    "userName": "李师兄",
    "phone": "138****1234",
    "status": 1,
    "updateTime": "2026-04-07 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅允许更新部分字段
- 状态变更需管理员权限
- 更新后记录操作日志

---

## 📤 七、执行结果接口（Phase 1 Day 5）

### 7.1 提交执行结果

**接口详情**:
- **接口名称**: 提交执行结果
- **请求方式**: POST
- **接口地址**: `/api/task/execute/submit`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| taskId | long | 是 | 任务 ID |
| executeTime | string | 是 | 执行时间，yyyy-MM-dd HH:mm:ss |
| executeLocation | string | 是 | 执行点位/地点 |
| quantity | int | 是 | 执行数量 |
| remark | string | 否 | 备注 |
| photos | array | 是 | 照片 URL 列表（3-10 张） |
| video | string | 否 | 视频 URL（可选） |
| commitPhrase | string | 是 | 合规承诺语 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "提交成功",
  "data": {
    "executeId": 3001,
    "taskId": "TSK202604070001",
    "status": "pending_audit",
    "submitTime": "2026-04-07 16:30:00",
    "auditDeadline": "2026-04-08 16:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 提交后任务状态变更为"待审核"
- 照片必须 3-10 张，需包含执行过程
- 合规承诺语必须勾选确认
- 自动触发内容安全审核

---

### 7.2 审核执行结果

**接口详情**:
- **接口名称**: 审核执行结果
- **请求方式**: POST
- **接口地址**: `/api/task/execute/audit/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 执行结果 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| auditResult | int | 是 | 审核结果 1 通过 0 拒绝 |
| auditRemark | string | 否 | 审核备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "审核成功",
  "data": {
    "executeId": 3001,
    "auditResult": 1,
    "auditBy": 1001,
    "auditByName": "管理员",
    "auditTime": "2026-04-07 17:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 审核通过后任务状态变更为"已完成"
- 审核拒绝需填写原因，任务退回重新执行
- 仅管理员或机构负责人可审核

---

## 🏢 八、机构管理接口（Phase 1 Day 5）

### 8.1 获取机构详情

**接口详情**:
- **接口名称**: 获取机构详情
- **请求方式**: GET
- **接口地址**: `/api/org/manage/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 机构 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1001,
    "orgName": "杭州护生协会",
    "orgType": 1,
    "legalPerson": "张师兄",
    "contactPhone": "0571-****1234",
    "address": "浙江省杭州市西湖区",
    "qualification": "社会团体法人登记证书",
    "qualificationNo": "51330000****",
    "status": 1,
    "volunteerCount": 25,
    "completedOrderCount": 156,
    "rating": 4.9,
    "bindTime": "2026-01-15 09:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回机构基本信息及资质信息
- 包含志愿者数量、完成订单数等统计数据
- 仅管理员或机构自身可查看

---

### 8.2 更新机构信息

**接口详情**:
- **接口名称**: 更新机构信息
- **请求方式**: PUT
- **接口地址**: `/api/org/manage/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 机构 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| contactPhone | string | 否 | 联系电话 |
| address | string | 否 | 地址 |
| status | int | 否 | 状态 1 启用 0 禁用 |
| remark | string | 否 | 备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1001,
    "orgName": "杭州护生协会",
    "contactPhone": "0571-****1234",
    "status": 1,
    "updateTime": "2026-04-07 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅允许更新部分字段
- 资质信息变更需重新审核
- 状态变更需管理员权限

---

## 💰 九、结算接口增强（Phase 1 Day 5）

### 9.1 获取机构结算列表

**接口详情**:
- **接口名称**: 获取机构结算列表
- **请求方式**: GET
- **接口地址**: `/api/settlement/org/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 否 | 机构 ID 筛选 |
| status | int | 否 | 结算状态 1 待确认 2 已确认 3 已打款 |
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 15,
    "list": [
      {
        "settlementId": "SET202604070001",
        "settlementNo": "SETTLE202604070001",
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "orderNo": "ORD202604070001",
        "settlementAmount": 450,
        "serviceFee": 50,
        "platformFee": 50,
        "totalAmount": 500,
        "status": 1,
        "createTime": "2026-04-07 14:30:00",
        "confirmTime": null,
        "paymentTime": null
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持按机构、状态、时间范围筛选
- 返回结算单完整信息
- 管理员可查看所有，机构仅查看自身

---

### 9.2 批量结算

**接口详情**:
- **接口名称**: 批量结算
- **请求方式**: POST
- **接口地址**: `/api/settlement/batch-settle`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| settlementIds | array | 是 | 结算单 ID 列表 |
| paymentMethod | string | 是 | 支付方式：bank_transfer/alipay |
| paymentRemark | string | 否 | 支付备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "批量结算成功",
  "data": {
    "totalCount": 5,
    "successCount": 5,
    "failCount": 0,
    "totalAmount": 2250,
    "paymentNo": "PAY202604070001",
    "paymentTime": "2026-04-07 17:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅状态为"已确认"的结算单可批量结算
- 结算后状态变更为"已打款"
- 生成支付记录，支持导出

---

---

## 🧑‍🤝‍🧑 十、志愿者管理模块

### 10.1 获取志愿者详情

**接口详情**:
- **接口名称**: 获取志愿者详情
- **请求方式**: GET
- **接口地址**: `/api/volunteer/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 志愿者 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "userId": 100,
    "realName": "张三",
    "idCard": "330100199001011234",
    "phone": "13800138000",
    "orgId": 1001,
    "status": 1,
    "totalTasks": 25,
    "serviceHours": 50,
    "complianceRate": 96.00,
    "createTime": "2026-01-01 10:00:00"
  },
  "timestamp": 1712345678901
}
```

**字段说明**:
- `totalTasks`: 累计完成任务数
- `serviceHours`: 累计公益服务时长（小时）
- `complianceRate`: 合规执行率（百分比，0-100）

---

### 10.2 更新志愿者信息

**接口详情**:
- **接口名称**: 更新志愿者信息
- **请求方式**: PUT
- **接口地址**: `/api/volunteer/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 志愿者 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| realName | string | 否 | 真实姓名 |
| phone | string | 否 | 联系电话 |
| status | int | 否 | 状态 1 正常 0 禁用 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null,
  "timestamp": 1712345678901
}
```

---

## 📋 十一、执行结果模块

### 11.1 提交执行结果

**接口详情**:
- **接口名称**: 提交执行结果
- **请求方式**: POST
- **接口地址**: `/api/task/execute/submit`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号 |
| volunteerId | long | 是 | 志愿者 ID |
| address | string | 是 | 实际投放点位 |
| realQuantity | int | 是 | 实际投放数量 |
| images | string | 否 | 现场照片（逗号分隔） |
| videoUrl | string | 否 | 执行视频 |
| remark | string | 否 | 执行备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "提交成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 提交后自动进行内容安全审核（图片/文本）
- 审核通过后状态为"待审核"
- 订单状态更新为"待确认"

---

### 11.2 审核执行结果

**接口详情**:
- **接口名称**: 审核执行结果
- **请求方式**: POST
- **接口地址**: `/api/task/execute/audit/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 执行记录 ID |

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 是 | 审核状态 2 通过 3 驳回 |
| reason | string | 否 | 驳回原因（审核驳回时必填） |

**响应示例**:

```json
{
  "code": 200,
  "msg": "审核成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 审核通过：更新志愿者统计数据，订单状态变为"已完成"
- 审核驳回：订单状态回退到"待执行"

---

## 🏢 十二、机构管理模块

### 12.1 获取机构详情

**接口详情**:
- **接口名称**: 获取机构详情
- **请求方式**: GET
- **接口地址**: `/api/org/manage/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 机构 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1001,
    "orgName": "杭州护生协会",
    "creditCode": "91440300MA5DXXXXX",
    "address": "杭州市西湖区 XXX 路 XXX 号",
    "contactName": "李四",
    "contactPhone": "13900139000",
    "status": 1,
    "totalOrders": 150,
    "createTime": "2026-01-01 10:00:00"
  },
  "timestamp": 1712345678901
}
```

**字段说明**:
- `totalOrders`: 累计执行订单数

---

### 12.2 更新机构信息

**接口详情**:
- **接口名称**: 更新机构信息
- **请求方式**: PUT
- **接口地址**: `/api/org/manage/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 机构 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgName | string | 否 | 机构名称 |
| address | string | 否 | 机构地址 |
| contactName | string | 否 | 联系人姓名 |
| contactPhone | string | 否 | 联系电话 |
| status | int | 否 | 状态 1 正常 0 禁用 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null,
  "timestamp": 1712345678901
}
```

---

## 💰 十三、结算管理模块（增强）

### 13.1 获取机构结算列表（带状态过滤）

**接口详情**:
- **接口名称**: 获取机构结算列表
- **请求方式**: GET
- **接口地址**: `/api/settlement/org/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 是 | 机构 ID |
| status | int | 否 | 结算状态 1 待结算 2 已结算 |
| pageNum | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": 1,
      "orderNo": "PRO202604070001",
      "orgId": 1001,
      "amount": 450.00,
      "platformFee": 50.00,
      "status": 1,
      "settlementTime": null,
      "createTime": "2026-04-07 14:30:00"
    }
  ],
  "timestamp": 1712345678901
}
```

---

### 13.2 批量结算

**接口详情**:
- **接口名称**: 批量结算
- **请求方式**: POST
- **接口地址**: `/api/settlement/batch-settle`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| settlementIds | array | 是 | 结算单 ID 列表 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "批量结算成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 仅状态为"待结算"的结算单可批量结算
- 结算后状态变更为"已结算"
- 同时更新关联订单状态为"已结算"

---

*清如 V3 · API 接口文档 V1.2 更新完成* 🌊

**文档版本**: V1.2  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-07  
**本次更新内容**: 
- 添加志愿者接口（2 个）：获取志愿者详情、更新志愿者信息
- 添加执行结果接口（2 个）：提交执行结果、审核执行结果
- 添加机构管理接口（2 个）：获取机构详情、更新机构信息
- 完善结算接口（2 个）：获取机构结算列表、批量结算
- 新增接口总数：8 个

---

## 🏢 十四、机构端管理接口（Phase 1 Day 6）

### 14.1 获取机构工作台数据

**接口详情**:
- **接口名称**: 获取机构工作台数据
- **请求方式**: GET
- **接口地址**: `/api/org/manage/dashboard`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 是 | 机构 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "orgInfo": {
      "id": 1001,
      "orgName": "杭州护生协会",
      "orgType": 1,
      "status": 1,
      "volunteerCount": 25,
      "rating": 4.9
    },
    "statistics": {
      "pendingOrders": 5,
      "executingOrders": 3,
      "pendingSettlement": 8,
      "completedToday": 2,
      "totalMerit": 1560
    },
    "todoList": [
      {
        "type": "order_review",
        "title": "待审核执行结果",
        "count": 3,
        "priority": "high"
      },
      {
        "type": "settlement_confirm",
        "title": "待确认结算单",
        "count": 5,
        "priority": "medium"
      }
    ],
    "quickActions": [
      {"action": "accept_order", "label": "承接订单"},
      {"action": "assign_task", "label": "分配任务"},
      {"action": "audit_result", "label": "审核结果"},
      {"action": "confirm_settlement", "label": "确认结算"}
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回机构工作台核心数据概览
- 包含待办事项提醒（带红色角标数量）
- 提供快捷操作入口

---

### 14.2 生成志愿者邀请码

**接口详情**:
- **接口名称**: 生成志愿者邀请码
- **请求方式**: POST
- **接口地址**: `/api/org/manage/invite-code`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 是 | 机构 ID |
| expireDays | int | 否 | 有效期天数，默认 7 天 |
| maxUseCount | int | 否 | 最大使用次数，默认 10 次 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "邀请码生成成功",
  "data": {
    "inviteCode": "HZHS2026040701",
    "orgId": 1001,
    "orgName": "杭州护生协会",
    "expireTime": "2026-04-14 23:59:59",
    "maxUseCount": 10,
    "usedCount": 0,
    "qrCodeUrl": "https://xxx/qrcode/invite-HZHS2026040701.png",
    "shareUrl": "https://qingru.com/volunteer/invite?code=HZHS2026040701"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 邀请码用于志愿者绑定机构
- 支持设置有效期和使用次数限制
- 生成二维码和分享链接

---

## 📊 十五、数据统计接口（Phase 1 Day 6）

### 15.1 获取机构统计数据

**接口详情**:
- **接口名称**: 获取机构统计数据
- **请求方式**: GET
- **接口地址**: `/api/statistics/org`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 是 | 机构 ID |
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "overview": {
      "totalOrders": 156,
      "completedOrders": 142,
      "totalSettlement": 63900,
      "totalMerit": 1560,
      "volunteerCount": 25
    },
    "trend": {
      "orderTrend": [
        {"date": "2026-04-01", "count": 5},
        {"date": "2026-04-02", "count": 8},
        {"date": "2026-04-03", "count": 6}
      ],
      "settlementTrend": [
        {"date": "2026-04-01", "amount": 2250},
        {"date": "2026-04-02", "amount": 3600},
        {"date": "2026-04-03", "amount": 2700}
      ]
    },
    "speciesDistribution": [
      {"speciesName": "鲢鱼", "count": 80, "percentage": 56.3},
      {"speciesName": "鲫鱼", "count": 42, "percentage": 29.6},
      {"speciesName": "泥鳅", "count": 20, "percentage": 14.1}
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回机构维度的统计数据
- 支持时间范围筛选
- 包含趋势图和物种分布

---

### 15.2 获取平台统计数据

**接口详情**:
- **接口名称**: 获取平台统计数据
- **请求方式**: GET
- **接口地址**: `/api/statistics/platform`
- **是否需要登录**: 是（需管理员权限）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "overview": {
      "totalUsers": 15680,
      "totalOrders": 3256,
      "totalOrgs": 45,
      "totalVolunteers": 892,
      "totalSettlement": 1456000,
      "totalMerit": 32560
    },
    "trend": {
      "userGrowthTrend": [
        {"date": "2026-04-01", "newUsers": 120},
        {"date": "2026-04-02", "newUsers": 135},
        {"date": "2026-04-03", "newUsers": 128}
      ],
      "orderTrend": [
        {"date": "2026-04-01", "count": 85},
        {"date": "2026-04-02", "count": 92},
        {"date": "2026-04-03", "count": 88}
      ],
      "revenueTrend": [
        {"date": "2026-04-01", "amount": 38250},
        {"date": "2026-04-02", "amount": 41400},
        {"date": "2026-04-03", "amount": 39600}
      ]
    },
    "topOrgs": [
      {"orgId": 1001, "orgName": "杭州护生协会", "orderCount": 156, "rating": 4.9},
      {"orgId": 1002, "orgName": "苏州护生会", "orderCount": 142, "rating": 4.8}
    ],
    "speciesRanking": [
      {"speciesName": "鲢鱼", "count": 1850, "percentage": 56.8},
      {"speciesName": "鲫鱼", "count": 980, "percentage": 30.1}
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回平台整体运营数据
- 仅管理员可查看
- 包含用户增长、订单趋势、收入趋势

---

## 🛠️ 十六、后台管理接口（Phase 1 Day 6）

### 16.1 获取后台管理仪表盘

**接口详情**:
- **接口名称**: 获取后台管理仪表盘
- **请求方式**: GET
- **接口地址**: `/api/admin/dashboard`
- **是否需要登录**: 是（需管理员权限）

**请求参数（Query）**: 无

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "today": {
      "newUsers": 128,
      "newOrders": 88,
      "completedOrders": 76,
      "settlementAmount": 34200,
      "pendingReviews": 15
    },
    "alerts": [
      {
        "type": "warning",
        "title": "待审核执行结果",
        "count": 15,
        "link": "/admin/reviews"
      },
      {
        "type": "info",
        "title": "待处理投诉",
        "count": 3,
        "link": "/admin/complaints"
      }
    ],
    "quickStats": {
      "activeOrgs": 42,
      "activeVolunteers": 568,
      "onlineUsers": 1256
    }
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 管理员仪表盘核心数据
- 包含今日关键指标
- 显示待处理事项提醒

---

### 16.2 获取运营数据趋势

**接口详情**:
- **接口名称**: 获取运营数据趋势
- **请求方式**: GET
- **接口地址**: `/api/admin/trend`
- **是否需要登录**: 是（需管理员权限）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| metricType | string | 是 | 指标类型：users/orders/revenue/merit |
| timeRange | string | 是 | 时间范围：7d/30d/90d |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "metricType": "orders",
    "timeRange": "7d",
    "trend": [
      {"date": "2026-04-01", "value": 85, "growth": 5.2},
      {"date": "2026-04-02", "value": 92, "growth": 8.2},
      {"date": "2026-04-03", "value": 88, "growth": -4.3},
      {"date": "2026-04-04", "value": 95, "growth": 8.0},
      {"date": "2026-04-05", "value": 102, "growth": 7.4},
      {"date": "2026-04-06", "value": 98, "growth": -3.9},
      {"date": "2026-04-07", "value": 105, "growth": 7.1}
    ],
    "summary": {
      "total": 665,
      "avg": 95,
      "max": 105,
      "min": 85,
      "overallGrowth": 23.5
    }
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持多种指标类型查询
- 返回趋势数据和增长率
- 包含汇总统计信息

---

## 📤 十七、报表导出接口（Phase 1 Day 6）

### 17.1 导出订单报表

**接口详情**:
- **接口名称**: 导出订单报表
- **请求方式**: GET
- **接口地址**: `/api/export/orders`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 是 | 开始日期 yyyy-MM-dd |
| endDate | string | 是 | 结束日期 yyyy-MM-dd |
| orgId | long | 否 | 机构 ID 筛选 |
| status | int | 否 | 订单状态筛选 |
| exportType | string | 否 | 导出类型：xlsx/csv，默认 xlsx |

**响应示例**:

```json
{
  "code": 200,
  "msg": "导出成功",
  "data": {
    "fileUrl": "https://xxx/export/orders-20260401-20260407.xlsx",
    "fileName": "订单报表_20260401-20260407.xlsx",
    "fileSize": "256KB",
    "recordCount": 156,
    "expireTime": "2026-04-14 23:59:59"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 使用 Apache POI 生成 Excel 文件
- 支持按时间、机构、状态筛选
- 导出文件保留 7 天

**Excel 列头**:
- 订单号
- 用户姓名
- 物种名称
- 数量
- 金额
- 订单状态
- 承接机构
- 执行志愿者
- 创建时间
- 完成时间

---

*清如 V3 · API 接口文档 V1.3 更新完成* 🌊

**文档版本**: V1.3  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-07  
**Day 6 新增接口**: 
- 机构端管理接口（2 个）：获取机构工作台数据、生成志愿者邀请码
- 数据统计接口（2 个）：获取机构统计数据、获取平台统计数据
- 后台管理接口（2 个）：获取后台管理仪表盘、获取运营数据趋势
- 报表导出接口（1 个）：导出订单报表
- Day 6 新增接口总数：7 个

---
