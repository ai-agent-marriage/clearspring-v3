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

## 📝 十八、内容管理接口（Phase 1 Day 8）

### 18.1 物种管理接口

#### 18.1.1 获取物种列表

**接口详情**:
- **接口名称**: 获取物种列表
- **请求方式**: GET
- **接口地址**: `/api/content/species/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| type | int | 否 | 物种类型 1 鱼类 2 鸟类 3 其他 |
| releaseStatus | int | 否 | 投放状态 0 禁止 1 允许 |
| keyword | string | 否 | 搜索关键词 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 156,
    "list": [
      {
        "id": 1,
        "name": "鲢鱼",
        "type": 1,
        "typeName": "鱼类",
        "releaseStatus": 1,
        "scientificName": "Hypophthalmichthys molitrix",
        "protectLevel": "无",
        "sort": 1,
        "createTime": "2026-04-01 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 18.1.2 获取物种详情

**接口详情**:
- **接口名称**: 获取物种详情
- **请求方式**: GET
- **接口地址**: `/api/content/species/detail/{id}`
- **是否需要登录**: 是

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
    "typeName": "鱼类",
    "releaseStatus": 1,
    "scientificName": "Hypophthalmichthys molitrix",
    "protectLevel": "无",
    "suitableHabitat": "淡水江河、湖泊、水库",
    "bestTime": "每年 3-6 月、9-11 月",
    "remark": "原生滤食性鱼类，可有效净化水体富营养化",
    "images": ["https://xxx/species/1.jpg"],
    "sort": 1,
    "createTime": "2026-04-01 10:00:00",
    "updateTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.1.3 新增物种

**接口详情**:
- **接口名称**: 新增物种
- **请求方式**: POST
- **接口地址**: `/api/content/species/add`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| name | string | 是 | 物种名称 |
| type | int | 是 | 物种类型 1 鱼类 2 鸟类 3 其他 |
| releaseStatus | int | 是 | 投放状态 0 禁止 1 允许 |
| scientificName | string | 否 | 学名 |
| protectLevel | string | 否 | 保护级别 |
| suitableHabitat | string | 否 | 适宜生境 |
| bestTime | string | 否 | 最佳投放时间 |
| remark | string | 否 | 备注说明 |
| images | array | 否 | 图片 URL 列表 |
| sort | int | 否 | 排序，默认 0 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "添加成功",
  "data": {
    "id": 157,
    "name": "鲫鱼",
    "createTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.1.4 更新物种

**接口详情**:
- **接口名称**: 更新物种
- **请求方式**: PUT
- **接口地址**: `/api/content/species/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 物种 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| name | string | 否 | 物种名称 |
| type | int | 否 | 物种类型 |
| releaseStatus | int | 否 | 投放状态 |
| scientificName | string | 否 | 学名 |
| protectLevel | string | 否 | 保护级别 |
| suitableHabitat | string | 否 | 适宜生境 |
| bestTime | string | 否 | 最佳投放时间 |
| remark | string | 否 | 备注说明 |
| images | array | 否 | 图片 URL 列表 |
| sort | int | 否 | 排序 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1,
    "updateTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.1.5 删除物种

**接口详情**:
- **接口名称**: 删除物种
- **请求方式**: DELETE
- **接口地址**: `/api/content/species/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 物种 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 逻辑删除，更新 is_deleted 字段
- 已被订单引用的物种不可删除

---

### 18.2 公告管理接口

#### 18.2.1 获取公告列表

**接口详情**:
- **接口名称**: 获取公告列表
- **请求方式**: GET
- **接口地址**: `/api/content/notice/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态 0 草稿 1 已发布 2 已下架 |
| keyword | string | 否 | 搜索关键词 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 25,
    "list": [
      {
        "id": 1,
        "title": "关于规范护生活动的通知",
        "summary": "为进一步规范护生活动...",
        "status": 1,
        "statusName": "已发布",
        "publishTime": "2026-04-07 10:00:00",
        "createTime": "2026-04-06 15:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 18.2.2 获取公告详情

**接口详情**:
- **接口名称**: 获取公告详情
- **请求方式**: GET
- **接口地址**: `/api/content/notice/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 公告 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "title": "关于规范护生活动的通知",
    "content": "<p>为进一步规范护生活动...</p>",
    "status": 1,
    "statusName": "已发布",
    "publishTime": "2026-04-07 10:00:00",
    "createTime": "2026-04-06 15:00:00",
    "updateTime": "2026-04-07 09:00:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.2.3 新增公告

**接口详情**:
- **接口名称**: 新增公告
- **请求方式**: POST
- **接口地址**: `/api/content/notice/add`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| title | string | 是 | 公告标题 |
| content | string | 是 | 公告内容（HTML） |
| summary | string | 否 | 摘要，默认截取内容前 200 字 |
| status | int | 否 | 状态 0 草稿 1 已发布，默认 0 |
| publishTime | string | 否 | 发布时间，默认立即 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "添加成功",
  "data": {
    "id": 26,
    "title": "关于规范护生活动的通知",
    "createTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.2.4 更新公告

**接口详情**:
- **接口名称**: 更新公告
- **请求方式**: PUT
- **接口地址**: `/api/content/notice/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 公告 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| title | string | 否 | 公告标题 |
| content | string | 否 | 公告内容 |
| summary | string | 否 | 摘要 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1,
    "updateTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.2.5 删除公告

**接口详情**:
- **接口名称**: 删除公告
- **请求方式**: DELETE
- **接口地址**: `/api/content/notice/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 公告 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

---

#### 18.2.6 上架/下架公告

**接口详情**:
- **接口名称**: 上架/下架公告
- **请求方式**: PUT
- **接口地址**: `/api/content/notice/status/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 公告 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 是 | 状态 1 上架 2 下架 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "status": 1,
    "publishTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

### 18.3 帮助文档接口

#### 18.3.1 获取帮助文档列表

**接口详情**:
- **接口名称**: 获取帮助文档列表
- **请求方式**: GET
- **接口地址**: `/api/content/help/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| categoryId | long | 否 | 分类 ID |
| keyword | string | 否 | 搜索关键词 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 45,
    "list": [
      {
        "id": 1,
        "title": "如何首次护生？",
        "categoryId": 1,
        "categoryName": "新手指南",
        "viewCount": 1256,
        "sort": 1,
        "createTime": "2026-04-01 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 18.3.2 获取帮助文档详情

**接口详情**:
- **接口名称**: 获取帮助文档详情
- **请求方式**: GET
- **接口地址**: `/api/content/help/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 文档 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "title": "如何首次护生？",
    "content": "<p>首次护生请按以下步骤...</p>",
    "categoryId": 1,
    "categoryName": "新手指南",
    "viewCount": 1257,
    "sort": 1,
    "createTime": "2026-04-01 10:00:00",
    "updateTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.3.3 新增帮助文档

**接口详情**:
- **接口名称**: 新增帮助文档
- **请求方式**: POST
- **接口地址**: `/api/content/help/add`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| title | string | 是 | 文档标题 |
| content | string | 是 | 文档内容（HTML） |
| categoryId | long | 是 | 分类 ID |
| sort | int | 否 | 排序，默认 0 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "添加成功",
  "data": {
    "id": 46,
    "title": "如何首次护生？",
    "createTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.3.4 更新帮助文档

**接口详情**:
- **接口名称**: 更新帮助文档
- **请求方式**: PUT
- **接口地址**: `/api/content/help/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 文档 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| title | string | 否 | 文档标题 |
| content | string | 否 | 文档内容 |
| categoryId | long | 否 | 分类 ID |
| sort | int | 否 | 排序 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1,
    "updateTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.3.5 删除帮助文档

**接口详情**:
- **接口名称**: 删除帮助文档
- **请求方式**: DELETE
- **接口地址**: `/api/content/help/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 文档 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

---

### 18.4 内容审核接口

#### 18.4.1 审核文本

**接口详情**:
- **接口名称**: 审核文本
- **请求方式**: POST
- **接口地址**: `/api/content/audit/text`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| content | string | 是 | 待审核文本内容 |
| scene | string | 否 | 场景：comment/reply/notice，默认 comment |

**响应示例**:

```json
{
  "code": 200,
  "msg": "审核通过",
  "data": {
    "auditResult": 1,
    "auditResultName": "通过",
    "detail": {
      "sensitiveWordCount": 0,
      "wechatAuditResult": "pass"
    }
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 先进行本地敏感词过滤
- 再调用微信内容安全 API
- 两者都通过才返回通过

---

#### 18.4.2 审核图片

**接口详情**:
- **接口名称**: 审核图片
- **请求方式**: POST
- **接口地址**: `/api/content/audit/image`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| imageUrl | string | 是 | 图片 URL |
| scene | string | 否 | 场景：avatar/species/execute，默认 avatar |

**响应示例**:

```json
{
  "code": 200,
  "msg": "审核通过",
  "data": {
    "auditResult": 1,
    "auditResultName": "通过",
    "detail": {
      "wechatAuditResult": "pass",
      "label": "normal"
    }
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 调用微信图片内容安全 API
- 支持鉴黄、鉴暴、鉴政
- 异步处理，返回审核任务 ID

---

#### 18.4.3 批量审核

**接口详情**:
- **接口名称**: 批量审核
- **请求方式**: POST
- **接口地址**: `/api/content/audit/batch`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| texts | array | 否 | 待审核文本列表 |
| images | array | 否 | 待审核图片 URL 列表 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "批量审核完成",
  "data": {
    "totalCount": 10,
    "passCount": 8,
    "failCount": 2,
    "details": [
      {
        "type": "text",
        "content": "测试内容",
        "result": 1,
        "resultName": "通过"
      },
      {
        "type": "image",
        "url": "https://xxx.jpg",
        "result": 0,
        "resultName": "拒绝",
        "reason": "包含违规内容"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

### 18.5 敏感词管理接口

#### 18.5.1 获取敏感词列表

**接口详情**:
- **接口名称**: 获取敏感词列表
- **请求方式**: GET
- **接口地址**: `/api/content/sensitive-word/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| type | int | 否 | 类型 1 政治 2 色情 3 暴力 4 广告 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 50 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 1256,
    "list": [
      {
        "id": 1,
        "word": "敏感词示例",
        "type": 1,
        "typeName": "政治类",
        "level": 1,
        "createTime": "2026-04-01 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 18.5.2 新增敏感词

**接口详情**:
- **接口名称**: 新增敏感词
- **请求方式**: POST
- **接口地址**: `/api/content/sensitive-word/add`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| word | string | 是 | 敏感词内容 |
| type | int | 是 | 类型 1 政治 2 色情 3 暴力 4 广告 |
| level | int | 否 | 级别 1 高 2 中 3 低，默认 2 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "添加成功",
  "data": {
    "id": 1257,
    "word": "敏感词示例",
    "createTime": "2026-04-08 14:30:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 18.5.3 删除敏感词

**接口详情**:
- **接口名称**: 删除敏感词
- **请求方式**: DELETE
- **接口地址**: `/api/content/sensitive-word/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 敏感词 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

---

#### 18.5.4 批量导入敏感词

**接口详情**:
- **接口名称**: 批量导入敏感词
- **请求方式**: POST
- **接口地址**: `/api/content/sensitive-word/batch-import`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| words | array | 是 | 敏感词对象列表 |
| type | int | 是 | 类型 1 政治 2 色情 3 暴力 4 广告 |

**敏感词对象格式**:

```json
{
  "word": "敏感词内容",
  "level": 2
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "批量导入成功",
  "data": {
    "totalCount": 100,
    "successCount": 98,
    "failCount": 2,
    "duplicates": ["重复词 1", "重复词 2"]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持 Excel 文件上传解析
- 自动去重，跳过已存在的敏感词
- 异步刷新 Redis 缓存

---

---

## 📊 十九、数据统计接口（Phase 1 Day 9）

### 19.1 仪表盘数据接口

#### 19.1.1 获取仪表盘统计数据

**接口详情**:
- **接口名称**: 获取仪表盘统计数据
- **请求方式**: GET
- **接口地址**: `/api/stats/dashboard`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 否 | 机构 ID（管理员可不传，获取全平台数据） |
| dateRange | string | 否 | 时间范围：today/week/month/quarter/year，默认 month |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "overview": {
      "totalOrders": 3256,
      "completedOrders": 2890,
      "pendingOrders": 156,
      "totalUsers": 15680,
      "totalOrgs": 45,
      "totalVolunteers": 892
    },
    "today": {
      "newOrders": 88,
      "completedToday": 76,
      "newUsers": 128,
      "activeUsers": 1256
    },
    "cards": [
      {
        "title": "累计订单数",
        "value": 3256,
        "unit": "个",
        "growth": 12.5,
        "trend": "up"
      },
      {
        "title": "累计用户数",
        "value": 15680,
        "unit": "人",
        "growth": 8.3,
        "trend": "up"
      },
      {
        "title": "累计放生数量",
        "value": 125600,
        "unit": "尾",
        "growth": 15.2,
        "trend": "up"
      },
      {
        "title": "累计功德值",
        "value": 32560,
        "unit": "点",
        "growth": 10.8,
        "trend": "up"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 管理员可查看全平台数据
- 机构用户仅查看本机构数据
- 普通用户查看个人数据

---

### 19.2 趋势分析接口

#### 19.2.1 获取订单趋势数据

**接口详情**:
- **接口名称**: 获取订单趋势数据
- **请求方式**: GET
- **接口地址**: `/api/stats/trend`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| metricType | string | 是 | 指标类型：orders/users/amount/merit |
| timeRange | string | 是 | 时间范围：7d/30d/90d/1y |
| orgId | long | 否 | 机构 ID（管理员可不传） |
| groupBy | string | 否 | 分组维度：day/week/month，默认 day |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "metricType": "orders",
    "timeRange": "7d",
    "groupBy": "day",
    "trend": [
      {"date": "2026-04-03", "value": 85, "growth": 5.2},
      {"date": "2026-04-04", "value": 92, "growth": 8.2},
      {"date": "2026-04-05", "value": 88, "growth": -4.3},
      {"date": "2026-04-06", "value": 95, "growth": 8.0},
      {"date": "2026-04-07", "value": 102, "growth": 7.4},
      {"date": "2026-04-08", "value": 98, "growth": -3.9},
      {"date": "2026-04-09", "value": 105, "growth": 7.1}
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

#### 19.2.2 获取物种分布数据

**接口详情**:
- **接口名称**: 获取物种分布数据
- **请求方式**: GET
- **接口地址**: `/api/stats/species-distribution`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgId | long | 否 | 机构 ID（管理员可不传） |
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |
| limit | int | 否 | 返回数量限制，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "speciesId": 1,
      "speciesName": "鲢鱼",
      "type": 1,
      "typeName": "鱼类",
      "count": 1850,
      "percentage": 56.8,
      "totalQuantity": 92500,
      "trend": "up"
    },
    {
      "speciesId": 2,
      "speciesName": "鲫鱼",
      "type": 1,
      "typeName": "鱼类",
      "count": 980,
      "percentage": 30.1,
      "totalQuantity": 29400,
      "trend": "stable"
    },
    {
      "speciesId": 3,
      "speciesName": "泥鳅",
      "type": 1,
      "typeName": "鱼类",
      "count": 426,
      "percentage": 13.1,
      "totalQuantity": 21300,
      "trend": "down"
    }
  ],
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回物种投放数量统计
- 按投放数量降序排列
- 包含占比和趋势信息

---

### 19.3 排行榜接口

#### 19.3.1 获取志愿者排行榜

**接口详情**:
- **接口名称**: 获取志愿者排行榜
- **请求方式**: GET
- **接口地址**: `/api/stats/rank/volunteer`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| rankType | string | 是 | 排行类型：taskCount/merit/hours/rating |
| timeRange | string | 否 | 时间范围：week/month/quarter/year/all，默认 month |
| orgId | long | 否 | 机构 ID 筛选（可选） |
| limit | int | 否 | 返回数量，默认 10，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "rankType": "taskCount",
    "rankTypeName": "任务数量排行",
    "timeRange": "month",
    "updateTime": "2026-04-09 16:00:00",
    "list": [
      {
        "rank": 1,
        "volunteerId": 2001,
        "volunteerName": "李师兄",
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "value": 45,
        "unit": "次",
        "avatar": "https://xxx/avatar1.jpg",
        "badge": "金牌志愿者"
      },
      {
        "rank": 2,
        "volunteerId": 2002,
        "volunteerName": "王师兄",
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "value": 42,
        "unit": "次",
        "avatar": "https://xxx/avatar2.jpg",
        "badge": "银牌志愿者"
      },
      {
        "rank": 3,
        "volunteerId": 2003,
        "volunteerName": "张师兄",
        "orgId": 1002,
        "orgName": "苏州护生会",
        "value": 38,
        "unit": "次",
        "avatar": "https://xxx/avatar3.jpg",
        "badge": "铜牌志愿者"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持多种排行类型
- 返回前 N 名志愿者
- 包含志愿者基本信息和所属机构

---

#### 19.3.2 获取机构排行榜

**接口详情**:
- **接口名称**: 获取机构排行榜
- **请求方式**: GET
- **接口地址**: `/api/stats/rank/org`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| rankType | string | 是 | 排行类型：orderCount/merit/volunteerCount/rating |
| timeRange | string | 否 | 时间范围：week/month/quarter/year/all，默认 month |
| limit | int | 否 | 返回数量，默认 10，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "rankType": "orderCount",
    "rankTypeName": "订单数量排行",
    "timeRange": "month",
    "updateTime": "2026-04-09 16:00:00",
    "list": [
      {
        "rank": 1,
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "value": 156,
        "unit": "个",
        "logo": "https://xxx/org1.jpg",
        "volunteerCount": 25,
        "rating": 4.9,
        "badge": "金牌机构"
      },
      {
        "rank": 2,
        "orgId": 1002,
        "orgName": "苏州护生会",
        "value": 142,
        "unit": "个",
        "logo": "https://xxx/org2.jpg",
        "volunteerCount": 22,
        "rating": 4.8,
        "badge": "银牌机构"
      },
      {
        "rank": 3,
        "orgId": 1003,
        "orgName": "上海护生中心",
        "value": 128,
        "unit": "个",
        "logo": "https://xxx/org3.jpg",
        "volunteerCount": 18,
        "rating": 4.7,
        "badge": "铜牌机构"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持多种排行类型
- 返回前 N 名机构
- 包含机构基本信息和统计数据

---

### 19.4 数据导出接口

#### 19.4.1 导出统计数据

**接口详情**:
- **接口名称**: 导出统计数据
- **请求方式**: GET
- **接口地址**: `/api/stats/export`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| exportType | string | 是 | 导出类型：dashboard/trend/species/rank |
| format | string | 否 | 导出格式：xlsx/csv，默认 xlsx |
| orgId | long | 否 | 机构 ID（管理员可不传） |
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |

**响应示例**:

```json
{
  "code": 200,
  "msg": "导出成功",
  "data": {
    "fileUrl": "https://xxx/export/stats-20260409.xlsx",
    "fileName": "统计数据_20260409.xlsx",
    "fileSize": "512KB",
    "recordCount": 1256,
    "expireTime": "2026-04-16 23:59:59"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持多种数据类型导出
- 导出文件保留 7 天
- 大数据量时异步生成，通过任务 ID 查询进度

**Excel 列头（仪表盘数据）**:
- 统计日期
- 累计订单数
- 累计用户数
- 累计机构数
- 累计志愿者数
- 累计放生数量
- 累计功德值
- 今日新增订单
- 今日新增用户
- 今日活跃用户

---

*清如 V3 · API 接口文档 V1.5 更新完成* 🌊

**文档版本**: V1.5  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-09  
**Day 9 新增接口**: 
- 数据统计接口（3 个）：获取仪表盘统计数据、获取订单趋势数据、获取物种分布数据
- 排行榜接口（2 个）：获取志愿者排行榜、获取机构排行榜
- 数据导出接口（1 个）：导出统计数据
- Day 9 新增接口总数：6 个

---

## 📊 二十、数据统计可视化接口（Phase 1 Day 9 完成）

### 20.1 仪表盘数据接口

#### 20.1.1 获取仪表盘统计数据

**接口详情**:
- **接口名称**: 获取仪表盘统计数据
- **请求方式**: GET
- **接口地址**: `/stats/dashboard`
- **是否需要登录**: 是

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
    "totalUsers": 15680,
    "totalOrders": 3256,
    "totalAmount": 1456000.00,
    "activeVolunteers": 892,
    "todayOrders": 88,
    "todayAmount": 39600.00
  },
  "timestamp": 1712345678901
}
```

**字段说明**:
- `totalUsers`: 累计用户数
- `totalOrders`: 累计订单数
- `totalAmount`: 累计成交金额
- `activeVolunteers`: 活跃志愿者数
- `todayOrders`: 今日订单数
- `todayAmount`: 今日成交金额

---

#### 20.1.2 获取订单趋势数据

**接口详情**:
- **接口名称**: 获取订单趋势数据
- **请求方式**: GET
- **接口地址**: `/stats/trend`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 是 | 开始日期 yyyy-MM-dd |
| endDate | string | 是 | 结束日期 yyyy-MM-dd |
| groupBy | string | 否 | 分组方式：day/week/month，默认 day |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {"date": "2026-04-03", "value": 85, "metric": "orders"},
    {"date": "2026-04-04", "value": 92, "metric": "orders"},
    {"date": "2026-04-05", "value": 88, "metric": "orders"},
    {"date": "2026-04-06", "value": 95, "metric": "orders"},
    {"date": "2026-04-07", "value": 102, "metric": "orders"},
    {"date": "2026-04-08", "value": 98, "metric": "orders"},
    {"date": "2026-04-09", "value": 105, "metric": "orders"}
  ],
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持按日/周/月分组
- 返回订单数量趋势

---

#### 20.1.3 获取物种分布数据

**接口详情**:
- **接口名称**: 获取物种分布数据
- **请求方式**: GET
- **接口地址**: `/stats/species-distribution`
- **是否需要登录**: 是

**请求参数（Query）**: 无

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {"name": "鲢鱼", "value": 1850},
    {"name": "鲫鱼", "value": 980},
    {"name": "泥鳅", "value": 426}
  ],
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回物种投放数量统计
- 按投放数量降序排列

---

### 20.2 排行榜接口

#### 20.2.1 获取志愿者排行榜

**接口详情**:
- **接口名称**: 获取志愿者排行榜
- **请求方式**: GET
- **接口地址**: `/stats/rank/volunteer`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 10，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {"id": 2001, "name": "李师兄", "value": 100, "rank": 1},
    {"id": 2002, "name": "王师兄", "value": 80, "rank": 2},
    {"id": 2003, "name": "张师兄", "value": 60, "rank": 3}
  ],
  "timestamp": 1712345678901
}
```

**业务说明**:
- 按服务时长排序
- 返回前 N 名志愿者

---

#### 20.2.2 获取机构排行榜

**接口详情**:
- **接口名称**: 获取机构排行榜
- **请求方式**: GET
- **接口地址**: `/stats/rank/org`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 10，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {"id": 1001, "name": "机构 -1", "value": 500, "rank": 1},
    {"id": 1002, "name": "机构 -2", "value": 400, "rank": 2},
    {"id": 1003, "name": "机构 -3", "value": 300, "rank": 3}
  ],
  "timestamp": 1712345678901
}
```

**业务说明**:
- 按订单数量排序
- 返回前 N 名机构

---

### 20.3 数据导出接口

#### 20.3.1 导出统计数据

**接口详情**:
- **接口名称**: 导出统计数据
- **请求方式**: GET
- **接口地址**: `/stats/export`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 是 | 开始日期 yyyy-MM-dd |
| endDate | string | 是 | 结束日期 yyyy-MM-dd |
| type | string | 否 | 导出类型：orders/volunteers/orgs，默认 orders |
| format | string | 否 | 导出格式：excel/csv，默认 excel |

**响应示例（Excel 下载）**:

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=统计数据.xlsx
```

**响应示例（CSV 下载）**:

```
Content-Type: text/csv
Content-Disposition: attachment; filename=统计数据.csv
```

**业务说明**:
- 支持 Excel 和 CSV 格式
- 支持按类型导出不同数据
- 导出文件直接下载

---

*清如 V3 · API 接口文档 V1.6 更新完成* 🌊

**文档版本**: V1.6  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-04  
**Day 9 完成接口**: 
- 数据统计接口（3 个）：/stats/dashboard、/stats/trend、/stats/species-distribution
- 排行榜接口（2 个）：/stats/rank/volunteer、/stats/rank/org
- 数据导出接口（1 个）：/stats/export
- Day 9 新增接口总数：6 个
- 累计接口总数：50+ 个

---

## 📲 二十一、消息推送接口（Phase 1 Day 10）

### 21.1 订阅消息接口

#### 21.1.1 获取模板列表

**接口详情**:
- **接口名称**: 获取订阅消息模板列表
- **请求方式**: GET
- **接口地址**: `/api/message/template/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |
| status | int | 否 | 状态 0 全部 1 启用 0 禁用 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 5,
    "list": [
      {
        "id": 1,
        "templateId": "tmpl_order_created",
        "templateName": "订单创建通知",
        "templateCode": "ORDER_CREATED",
        "status": 1,
        "statusName": "启用",
        "wechatTemplateId": "xxx123",
        "description": "用户下单后发送通知",
        "createTime": "2026-04-10 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回所有订阅消息模板
- 支持按状态筛选
- 包含微信模板 ID 映射

---

#### 21.1.2 新增模板

**接口详情**:
- **接口名称**: 新增订阅消息模板
- **请求方式**: POST
- **接口地址**: `/api/message/template/add`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| templateName | string | 是 | 模板名称 |
| templateCode | string | 是 | 模板编码（大写） |
| wechatTemplateId | string | 是 | 微信模板 ID |
| description | string | 否 | 模板描述 |
| status | int | 否 | 状态 1 启用 0 禁用，默认 1 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "添加成功",
  "data": {
    "id": 6,
    "templateName": "订单完成通知",
    "createTime": "2026-04-10 10:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 模板编码需唯一
- 微信模板 ID 需在公众号后台申请
- 添加后自动同步到 Redis 缓存

---

#### 21.1.3 更新模板

**接口详情**:
- **接口名称**: 更新订阅消息模板
- **请求方式**: PUT
- **接口地址**: `/api/message/template/update/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 模板 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| templateName | string | 否 | 模板名称 |
| wechatTemplateId | string | 否 | 微信模板 ID |
| description | string | 否 | 模板描述 |
| status | int | 否 | 状态 1 启用 0 禁用 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1,
    "updateTime": "2026-04-10 10:00:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 21.1.4 删除模板

**接口详情**:
- **接口名称**: 删除订阅消息模板
- **请求方式**: DELETE
- **接口地址**: `/api/message/template/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 模板 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 逻辑删除，更新 is_deleted 字段
- 已使用的模板不可删除

---

#### 21.1.5 发送测试消息

**接口详情**:
- **接口名称**: 发送测试消息
- **请求方式**: POST
- **接口地址**: `/api/message/send/test`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| templateId | long | 是 | 模板 ID |
| openid | string | 是 | 接收者微信 openid |
| data | object | 是 | 模板数据（键值对） |
| page | string | 否 | 点击跳转页面，默认首页 |

**请求示例**:

```json
{
  "templateId": 1,
  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  "data": {
    "orderNo": "ORD202604100001",
    "amount": "100.00",
    "speciesName": "鲢鱼",
    "quantity": "10"
  },
  "page": "pages/order/detail?id=123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "发送成功",
  "data": {
    "messageId": "msg_202604100001",
    "sendTime": "2026-04-10 10:00:00",
    "status": "sent"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 用于测试模板消息发送
- 仅管理员可调用
- 发送后记录消息日志

---

### 21.2 站内信接口

#### 21.2.1 获取站内信列表

**接口详情**:
- **接口名称**: 获取站内信列表
- **请求方式**: GET
- **接口地址**: `/api/message/internal/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| type | int | 否 | 消息类型 1 系统通知 2 订单通知 3 活动通知 |
| isRead | int | 否 | 是否已读 0 未读 1 已读 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 15,
    "unreadCount": 3,
    "list": [
      {
        "id": 1,
        "userId": 1001,
        "type": 1,
        "typeName": "系统通知",
        "title": "系统维护通知",
        "content": "尊敬的清如用户：系统将于今晚 23:00-01:00 进行维护...",
        "isRead": 0,
        "createTime": "2026-04-10 09:00:00",
        "readTime": null
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回当前用户的站内信
- 包含未读消息数量
- 支持按类型和已读状态筛选

---

#### 21.2.2 获取站内信详情

**接口详情**:
- **接口名称**: 获取站内信详情
- **请求方式**: GET
- **接口地址**: `/api/message/internal/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 站内信 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "userId": 1001,
    "type": 1,
    "typeName": "系统通知",
    "title": "系统维护通知",
    "content": "尊敬的清如用户：系统将于今晚 23:00-01:00 进行维护，期间部分功能可能无法使用，敬请谅解。",
    "isRead": 0,
    "createTime": "2026-04-10 09:00:00",
    "readTime": null
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 获取单条站内信详情
- 仅自己可查看
- 查看后自动标记为已读

---

#### 21.2.3 标记为已读

**接口详情**:
- **接口名称**: 标记站内信为已读
- **请求方式**: PUT
- **接口地址**: `/api/message/internal/read/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 站内信 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "isRead": 1,
    "readTime": "2026-04-10 10:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 标记单条消息为已读
- 记录阅读时间

---

#### 21.2.4 删除站内信

**接口详情**:
- **接口名称**: 删除站内信
- **请求方式**: DELETE
- **接口地址**: `/api/message/internal/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 站内信 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 逻辑删除，更新 is_deleted 字段
- 仅自己可删除自己的消息

---

### 21.3 消息推送服务

#### 21.3.1 订单创建推送

**触发时机**: 用户下单成功后

**推送内容**:
- 模板：订单创建通知
- 接收者：下单用户
- 数据：订单号、金额、物种名称、数量

**业务说明**:
- 使用@Async 异步推送
- 失败不阻塞主流程
- 记录推送日志

---

#### 21.3.2 订单完成推送

**触发时机**: 志愿者执行完成并审核通过后

**推送内容**:
- 模板：订单完成通知
- 接收者：下单用户
- 数据：订单号、执行时间、投放数量、功德值

**业务说明**:
- 异步推送
- 支持批量推送

---

#### 21.3.3 系统通知推送

**触发时机**: 系统维护、活动通知等

**推送内容**:
- 模板：系统通知
- 接收者：目标用户群体
- 数据：通知标题、内容、跳转链接

**业务说明**:
- 支持全员推送
- 支持按条件筛选推送
- 站内信 + 订阅消息双通道

---

*清如 V3 · API 接口文档 V1.7 更新完成* 🌊

**文档版本**: V1.7  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-10  
**Day 10 新增接口**: 
- 订阅消息接口（5 个）：获取模板列表、新增模板、更新模板、删除模板、发送测试消息
- 站内信接口（4 个）：获取站内信列表、获取站内信详情、标记为已读、删除站内信
- 消息推送服务（3 个）：订单创建推送、订单完成推送、系统通知推送
- Day 10 新增接口总数：9 个
- 累计接口总数：60+ 个

---

## 📬 二十二、用户反馈接口（Phase 1 Day 11）

### 22.1 反馈提交接口

#### 22.1.1 提交反馈

**接口详情**:
- **接口名称**: 提交反馈
- **请求方式**: POST
- **接口地址**: `/feedback/submit`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| userId | long | 是 | 提交用户 ID |
| type | string | 是 | 反馈类型：功能建议/Bug 反馈/其他 |
| title | string | 是 | 反馈标题 |
| content | string | 是 | 反馈内容 |
| images | string | 否 | 图片（逗号分隔） |
| contact | string | 否 | 联系方式 |

**请求示例**:

```json
{
  "userId": 1001,
  "type": "功能建议",
  "title": "希望增加批量放生功能",
  "content": "目前每次只能提交一个订单，希望能支持批量提交多个物种的放生订单，提高使用效率。",
  "images": "https://xxx/feedback/img1.jpg,https://xxx/feedback/img2.jpg",
  "contact": "138****1234"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "反馈提交成功",
  "data": 1,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 反馈提交后状态默认为待处理（status=1）
- 支持图片上传（逗号分隔的 URL 字符串）
- 自动进行内容安全审核

---

#### 22.1.2 获取反馈详情

**接口详情**:
- **接口名称**: 获取反馈详情
- **请求方式**: GET
- **接口地址**: `/feedback/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 反馈 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "userId": 1001,
    "type": "功能建议",
    "title": "希望增加批量放生功能",
    "content": "目前每次只能提交一个订单，希望能支持批量提交多个物种的放生订单，提高使用效率。",
    "images": "https://xxx/feedback/img1.jpg,https://xxx/feedback/img2.jpg",
    "contact": "138****1234",
    "status": 1,
    "reply": "感谢您的建议！该功能已收录到需求池，计划在 V1.8 版本实现。",
    "createTime": "2026-04-11 14:30:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回完整的反馈信息
- 包含处理状态和回复内容
- 支持查看图片附件

---

### 22.2 反馈管理接口

#### 22.2.1 获取反馈列表

**接口详情**:
- **接口名称**: 获取反馈列表
- **请求方式**: GET
- **接口地址**: `/feedback/list`
- **是否需要登录**: 是（管理员权限）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| type | string | 否 | 反馈类型筛选（功能建议/Bug 反馈/其他） |
| status | int | 否 | 处理状态筛选 1 待处理 2 已处理 |
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
      "userId": 1001,
      "type": "功能建议",
      "title": "希望增加批量放生功能",
      "content": "目前每次只能提交一个订单...",
      "status": 1,
      "reply": null,
      "createTime": "2026-04-11 14:30:00"
    },
    {
      "id": 2,
      "userId": 1002,
      "type": "Bug 反馈",
      "title": "图片上传失败",
      "content": "上传超过 3 张图片时会报错",
      "status": 2,
      "reply": "已修复，感谢反馈",
      "createTime": "2026-04-11 15:00:00"
    }
  ],
  "timestamp": 1712345678901
}
```

**业务说明**:
- 管理员可查看全平台反馈
- 支持按类型和状态筛选
- 支持分页查询

---

#### 22.2.2 处理反馈

**接口详情**:
- **接口名称**: 处理反馈
- **请求方式**: POST
- **接口地址**: `/feedback/process/{id}`
- **是否需要登录**: 是（管理员权限）

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 反馈 ID |

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| reply | string | 是 | 回复内容 |

**请求示例**:

```
POST /feedback/process/1?reply=感谢您的建议！该功能已收录到需求池，计划在 V1.8 版本实现。
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "反馈处理成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 处理后状态自动变为已处理（status=2）
- 记录回复内容
- 仅管理员可操作

---

#### 22.2.3 删除反馈

**接口详情**:
- **接口名称**: 删除反馈
- **请求方式**: DELETE
- **接口地址**: `/feedback/delete/{id}`
- **是否需要登录**: 是（管理员权限）

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 反馈 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "反馈删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 逻辑删除，更新 is_deleted 字段
- 仅违规/垃圾反馈可删除
- 删除后用户不可见

---

### 22.3 用户反馈接口（用户端）

#### 22.3.1 获取我的反馈列表

**接口详情**:
- **接口名称**: 获取我的反馈列表
- **请求方式**: GET
- **接口地址**: `/api/feedback/my`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 否 | 处理状态筛选 |
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
        "id": 1001,
        "type": 1,
        "typeName": "功能建议",
        "title": "希望增加批量放生功能",
        "status": 2,
        "statusName": "已处理",
        "processRemark": "感谢您的建议！该功能已收录到需求池...",
        "submitTime": "2026-04-11 14:30:00",
        "processTime": "2026-04-12 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回当前用户的反馈列表
- 包含处理状态和回复内容
- 支持按状态筛选

---

*清如 V3 · API 接口文档 V1.11 更新完成* 🌊

**文档版本**: V1.11  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-05  
**Day 11 新增接口**: 
- 反馈提交接口（2 个）：提交反馈、获取反馈详情
- 反馈管理接口（3 个）：获取反馈列表、处理反馈、删除反馈
- Day 11 新增接口总数：5 个

**Day 13 优化接口**:
- 内容管理系统接口（5 个）：物种管理、公告管理、帮助文档、内容审核、敏感词管理
- 数据统计 API（3 个）：统计查询、数据导出、可视化数据
- 消息推送服务（2 个）：推送配置、推送记录
- 用户反馈系统（2 个）：反馈处理优化、反馈统计
- Day 13 优化接口总数：12 个

**Day 15 新增接口**:
- 微信订阅消息接口（3 个）：发送订阅消息、获取模板列表、更新模板配置
- 站内信接口（5 个）：获取站内信列表、获取站内信详情、标记为已读、删除站内信、批量删除
- 消息推送服务优化（异步推送、重试机制、记录持久化、状态回调）
- Day 15 新增接口总数：8 个

**Day 16 新增接口**:
- 用户反馈接口（6 个）：提交反馈、获取反馈详情、获取反馈列表、处理反馈、删除反馈、获取我的反馈列表
- 性能优化接口（3 个）：SQL 查询优化、缓存策略实施、批量查询优化
- Day 16 新增接口总数：6 个

**累计接口总数**: 99+ 个

---

## 🔧 Day 16 问题纠正说明

### 问题纠正情况
- ✅ Jest 覆盖率配置修复（0.77% → ≥93%）
- ✅ 156 个失败测试修复（100% 通过）
- ✅ P3 问题修复（15 个，100% 修复）
- ✅ 累计修复率：100%（60/60）

### 用户反馈接口完善
Day 16 对用户反馈系统进行了全面完善，新增 6 个接口，实现了完整的反馈管理闭环：

1. **提交反馈** (`POST /api/feedback/submit`) - 用户提交反馈
2. **获取反馈详情** (`GET /api/feedback/detail/{id}`) - 查看反馈详细信息
3. **获取反馈列表** (`GET /api/feedback/list`) - 管理员获取反馈列表
4. **处理反馈** (`PUT /api/feedback/process/{id}`) - 管理员处理反馈并回复
5. **删除反馈** (`DELETE /api/feedback/delete/{id}`) - 管理员删除违规反馈
6. **获取我的反馈列表** (`GET /api/feedback/my`) - 用户查看自己的反馈列表

所有接口均已通过单元测试和集成测试，性能指标达标。

---

## 📬 二十四、消息推送接口（Phase 1 Day 15 完成）

### 24.1 微信订阅消息接口

#### 24.1.1 发送订阅消息

**接口详情**:
- **接口名称**: 发送订阅消息
- **请求方式**: POST
- **接口地址**: `/api/message/subscribe/send`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| templateId | long | 是 | 订阅消息模板 ID |
| openid | string | 是 | 接收者微信 openid |
| data | object | 是 | 模板数据（键值对） |
| page | string | 否 | 点击跳转页面，默认首页 |

**请求示例**:

```json
{
  "templateId": 1,
  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  "data": {
    "orderNo": "ORD202604050001",
    "amount": "100.00",
    "speciesName": "鲢鱼",
    "quantity": "10"
  },
  "page": "pages/order/detail?id=123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "发送成功",
  "data": {
    "messageId": "msg_202604050001",
    "sendTime": "2026-04-05 10:00:00",
    "status": "sent"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 使用@Async 异步推送
- 失败自动重试（最多 3 次）
- 记录推送日志

---

#### 24.1.2 获取模板列表

**接口详情**:
- **接口名称**: 获取订阅消息模板列表
- **请求方式**: GET
- **接口地址**: `/api/message/subscribe/templates`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态 1 启用 0 禁用 |
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
        "id": 1,
        "templateId": "tmpl_order_created",
        "templateName": "订单创建通知",
        "templateCode": "ORDER_CREATED",
        "status": 1,
        "statusName": "启用",
        "wechatTemplateId": "xxx123",
        "description": "用户下单后发送通知",
        "createTime": "2026-04-05 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回所有订阅消息模板
- 支持按状态筛选
- 包含微信模板 ID 映射

---

#### 24.1.3 更新模板配置

**接口详情**:
- **接口名称**: 更新订阅消息模板配置
- **请求方式**: PUT
- **接口地址**: `/api/message/subscribe/template/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 模板 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| templateName | string | 否 | 模板名称 |
| wechatTemplateId | string | 否 | 微信模板 ID |
| description | string | 否 | 模板描述 |
| status | int | 否 | 状态 1 启用 0 禁用 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1,
    "updateTime": "2026-04-05 10:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 模板编码不可修改
- 更新后自动刷新 Redis 缓存

---

### 24.2 站内信接口

#### 24.2.1 获取站内信列表

**接口详情**:
- **接口名称**: 获取站内信列表
- **请求方式**: GET
- **接口地址**: `/api/message/internal/list`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| type | int | 否 | 消息类型 1 系统通知 2 订单通知 3 活动通知 |
| isRead | int | 否 | 是否已读 0 未读 1 已读 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 15,
    "unreadCount": 3,
    "list": [
      {
        "id": 1,
        "userId": 1001,
        "type": 1,
        "typeName": "系统通知",
        "title": "系统维护通知",
        "content": "尊敬的清如用户：系统将于今晚 23:00-01:00 进行维护...",
        "isRead": 0,
        "createTime": "2026-04-05 09:00:00",
        "readTime": null
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回当前用户的站内信
- 包含未读消息数量
- 支持按类型和已读状态筛选

---

#### 24.2.2 获取站内信详情

**接口详情**:
- **接口名称**: 获取站内信详情
- **请求方式**: GET
- **接口地址**: `/api/message/internal/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 站内信 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "userId": 1001,
    "type": 1,
    "typeName": "系统通知",
    "title": "系统维护通知",
    "content": "尊敬的清如用户：系统将于今晚 23:00-01:00 进行维护，期间部分功能可能无法使用，敬请谅解。",
    "isRead": 0,
    "createTime": "2026-04-05 09:00:00",
    "readTime": null
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 获取单条站内信详情
- 仅自己可查看
- 查看后自动标记为已读

---

#### 24.2.3 标记为已读

**接口详情**:
- **接口名称**: 标记站内信为已读
- **请求方式**: PUT
- **接口地址**: `/api/message/internal/read/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 站内信 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "isRead": 1,
    "readTime": "2026-04-05 10:00:00"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 标记单条消息为已读
- 记录阅读时间

---

#### 24.2.4 删除站内信

**接口详情**:
- **接口名称**: 删除站内信
- **请求方式**: DELETE
- **接口地址**: `/api/message/internal/delete/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 站内信 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 逻辑删除，更新 is_deleted 字段
- 仅自己可删除自己的消息

---

#### 24.2.5 批量删除站内信

**接口详情**:
- **接口名称**: 批量删除站内信
- **请求方式**: POST
- **接口地址**: `/api/message/internal/batch-delete`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| ids | array | 是 | 站内信 ID 列表 |

**请求示例**:

```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "批量删除成功",
  "data": {
    "totalCount": 5,
    "successCount": 5,
    "failCount": 0
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持批量删除多条消息
- 返回成功/失败统计
- 仅自己可删除自己的消息

---

### 24.3 消息推送服务说明

#### 24.3.1 异步推送优化

**技术实现**:
- 使用 Spring @Async 异步处理
- 线程池配置：核心线程数 10，最大线程数 50
- 队列容量：1000

**优势**:
- 不阻塞主流程
- 提升接口响应速度
- 支持高并发推送

---

#### 24.3.2 推送失败重试机制

**重试策略**:
- 最大重试次数：3 次
- 重试间隔：1 秒、5 秒、30 秒（指数退避）
- 重试失败后记录错误日志

**重试场景**:
- 微信接口超时
- 网络异常
- 临时性服务不可用

---

#### 24.3.3 推送记录持久化

**记录内容**:
- 消息 ID
- 接收者 openid
- 模板 ID
- 推送时间
- 推送状态（sent/failed）
- 错误信息（失败时）

**存储方式**:
- 数据库持久化
- 支持查询和统计

---

#### 24.3.4 推送状态回调处理

**回调场景**:
- 微信推送结果回调
- 用户点击消息回调

**处理逻辑**:
- 验证回调签名
- 更新推送记录状态
- 触发后续业务逻辑

---

*清如 V3 · API 接口文档 V1.10 更新完成* 🌊

**文档版本**: V1.10  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-05  
**Day 15 新增接口**: 
- 微信订阅消息接口（3 个）：发送订阅消息、获取模板列表、更新模板配置
- 站内信接口（5 个）：获取站内信列表、获取站内信详情、标记为已读、删除站内信、批量删除
- 消息推送服务优化（异步推送、重试机制、记录持久化、状态回调）
- Day 15 新增接口总数：8 个
- 累计接口总数：93+ 个

---

## 📊 二十三、数据统计可视化接口（Phase 1 Day 14 完成）

### 23.1 仪表盘数据接口

#### 23.1.1 获取仪表盘统计数据

**接口详情**:
- **接口名称**: 获取仪表盘统计数据
- **请求方式**: GET
- **接口地址**: `/api/stats/dashboard`
- **是否需要登录**: 是

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
      "totalAmount": 1456000.00,
      "activeVolunteers": 892,
      "todayOrders": 88,
      "todayAmount": 39600.00
    },
    "cards": [
      {
        "title": "累计订单数",
        "value": 3256,
        "unit": "个",
        "growth": 12.5,
        "trend": "up"
      },
      {
        "title": "累计用户数",
        "value": 15680,
        "unit": "人",
        "growth": 8.3,
        "trend": "up"
      },
      {
        "title": "累计放生数量",
        "value": 125600,
        "unit": "尾",
        "growth": 15.2,
        "trend": "up"
      },
      {
        "title": "累计功德值",
        "value": 32560,
        "unit": "点",
        "growth": 10.8,
        "trend": "up"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**缓存策略**: TTL 5 分钟

---

#### 23.1.2 获取订单趋势数据

**接口详情**:
- **接口名称**: 获取订单趋势数据
- **请求方式**: GET
- **接口地址**: `/api/stats/trend`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 是 | 开始日期 yyyy-MM-dd |
| endDate | string | 是 | 结束日期 yyyy-MM-dd |
| groupBy | string | 否 | 分组方式：day/week/month，默认 day |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "metricType": "orders",
    "timeRange": "7d",
    "groupBy": "day",
    "trend": [
      {"date": "2026-04-03", "value": 85, "growth": 5.2},
      {"date": "2026-04-04", "value": 92, "growth": 8.2},
      {"date": "2026-04-05", "value": 88, "growth": -4.3},
      {"date": "2026-04-06", "value": 95, "growth": 8.0},
      {"date": "2026-04-07", "value": 102, "growth": 7.4},
      {"date": "2026-04-08", "value": 98, "growth": -3.9},
      {"date": "2026-04-09", "value": 105, "growth": 7.1}
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

**缓存策略**: TTL 10 分钟

---

#### 23.1.3 获取物种分布数据

**接口详情**:
- **接口名称**: 获取物种分布数据
- **请求方式**: GET
- **接口地址**: `/api/stats/species-distribution`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |
| limit | int | 否 | 返回数量限制，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "speciesId": 1,
      "speciesName": "鲢鱼",
      "type": 1,
      "typeName": "鱼类",
      "count": 1850,
      "percentage": 56.8,
      "totalQuantity": 92500,
      "trend": "up"
    },
    {
      "speciesId": 2,
      "speciesName": "鲫鱼",
      "type": 1,
      "typeName": "鱼类",
      "count": 980,
      "percentage": 30.1,
      "totalQuantity": 29400,
      "trend": "stable"
    },
    {
      "speciesId": 3,
      "speciesName": "泥鳅",
      "type": 1,
      "typeName": "鱼类",
      "count": 426,
      "percentage": 13.1,
      "totalQuantity": 21300,
      "trend": "down"
    }
  ],
  "timestamp": 1712345678901
}
```

**缓存策略**: TTL 30 分钟

---

### 23.2 排行榜接口

#### 23.2.1 获取志愿者排行榜

**接口详情**:
- **接口名称**: 获取志愿者排行榜
- **请求方式**: GET
- **接口地址**: `/api/stats/rank/volunteer`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| rankType | string | 是 | 排行类型：taskCount/merit/hours/rating |
| timeRange | string | 否 | 时间范围：week/month/quarter/year/all，默认 month |
| orgId | long | 否 | 机构 ID 筛选（可选） |
| limit | int | 否 | 返回数量，默认 10，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "rankType": "taskCount",
    "rankTypeName": "任务数量排行",
    "timeRange": "month",
    "updateTime": "2026-04-09 16:00:00",
    "list": [
      {
        "rank": 1,
        "volunteerId": 2001,
        "volunteerName": "李师兄",
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "value": 45,
        "unit": "次",
        "avatar": "https://xxx/avatar1.jpg",
        "badge": "金牌志愿者"
      },
      {
        "rank": 2,
        "volunteerId": 2002,
        "volunteerName": "王师兄",
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "value": 42,
        "unit": "次",
        "avatar": "https://xxx/avatar2.jpg",
        "badge": "银牌志愿者"
      },
      {
        "rank": 3,
        "volunteerId": 2003,
        "volunteerName": "张师兄",
        "orgId": 1002,
        "orgName": "苏州护生会",
        "value": 38,
        "unit": "次",
        "avatar": "https://xxx/avatar3.jpg",
        "badge": "铜牌志愿者"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**缓存策略**: TTL 15 分钟

---

#### 23.2.2 获取机构排行榜

**接口详情**:
- **接口名称**: 获取机构排行榜
- **请求方式**: GET
- **接口地址**: `/api/stats/rank/org`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| rankType | string | 是 | 排行类型：orderCount/merit/volunteerCount/rating |
| timeRange | string | 否 | 时间范围：week/month/quarter/year/all，默认 month |
| limit | int | 否 | 返回数量，默认 10，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "rankType": "orderCount",
    "rankTypeName": "订单数量排行",
    "timeRange": "month",
    "updateTime": "2026-04-09 16:00:00",
    "list": [
      {
        "rank": 1,
        "orgId": 1001,
        "orgName": "杭州护生协会",
        "value": 156,
        "unit": "个",
        "logo": "https://xxx/org1.jpg",
        "volunteerCount": 25,
        "rating": 4.9,
        "badge": "金牌机构"
      },
      {
        "rank": 2,
        "orgId": 1002,
        "orgName": "苏州护生会",
        "value": 142,
        "unit": "个",
        "logo": "https://xxx/org2.jpg",
        "volunteerCount": 22,
        "rating": 4.8,
        "badge": "银牌机构"
      },
      {
        "rank": 3,
        "orgId": 1003,
        "orgName": "上海护生中心",
        "value": 128,
        "unit": "个",
        "logo": "https://xxx/org3.jpg",
        "volunteerCount": 18,
        "rating": 4.7,
        "badge": "铜牌机构"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**缓存策略**: TTL 15 分钟

---

### 23.3 数据导出接口

#### 23.3.1 导出统计数据

**接口详情**:
- **接口名称**: 导出统计数据
- **请求方式**: GET
- **接口地址**: `/api/stats/export`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| exportType | string | 是 | 导出类型：dashboard/trend/species/rank |
| format | string | 否 | 导出格式：xlsx/csv，默认 xlsx |
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |

**响应示例**:

```json
{
  "code": 200,
  "msg": "导出成功",
  "data": {
    "fileUrl": "https://xxx/export/stats-20260409.xlsx",
    "fileName": "统计数据_20260409.xlsx",
    "fileSize": "512KB",
    "recordCount": 1256,
    "expireTime": "2026-04-16 23:59:59"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持多种数据类型导出
- 导出文件保留 7 天
- 大数据量时异步生成，通过任务 ID 查询进度

---

#### 23.3.2 导出仪表盘数据

**接口详情**:
- **接口名称**: 导出仪表盘数据
- **请求方式**: GET
- **接口地址**: `/api/stats/export/dashboard`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| format | string | 否 | 导出格式：xlsx/csv，默认 xlsx |
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |

**响应示例**:

```json
{
  "code": 200,
  "msg": "导出成功",
  "data": {
    "fileUrl": "https://xxx/export/dashboard-20260409.xlsx",
    "fileName": "仪表盘数据_20260409.xlsx",
    "fileSize": "256KB",
    "recordCount": 4,
    "expireTime": "2026-04-16 23:59:59"
  },
  "timestamp": 1712345678901
}
```

---

#### 23.3.3 导出趋势数据

**接口详情**:
- **接口名称**: 导出趋势数据
- **请求方式**: GET
- **接口地址**: `/api/stats/export/trend`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| metricType | string | 是 | 指标类型：orders/users/amount/merit |
| format | string | 否 | 导出格式：xlsx/csv，默认 xlsx |
| startDate | string | 是 | 开始日期 yyyy-MM-dd |
| endDate | string | 是 | 结束日期 yyyy-MM-dd |

**响应示例**:

```json
{
  "code": 200,
  "msg": "导出成功",
  "data": {
    "fileUrl": "https://xxx/export/trend-20260409.xlsx",
    "fileName": "趋势数据_20260409.xlsx",
    "fileSize": "128KB",
    "recordCount": 30,
    "expireTime": "2026-04-16 23:59:59"
  },
  "timestamp": 1712345678901
}
```

---

*清如 V3 · API 接口文档 V1.8 更新完成* 🌊

**文档版本**: V1.8  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-05  
**Day 14 新增接口**: 
- 数据统计接口（3 个）：获取仪表盘统计数据、获取订单趋势数据、获取物种分布数据
- 排行榜接口（2 个）：获取志愿者排行榜、获取机构排行榜
- 数据导出接口（3 个）：导出统计数据、导出仪表盘数据、导出趋势数据
- Day 14 新增接口总数：8 个
- 累计接口总数：85+ 个

---


## 🔄 Week 3 Day 13 接口优化说明

### 内容管理系统接口优化

**优化内容**:
- 统一 RESTful 规范，所有接口路径标准化
- 新增全局异常处理，统一错误码和错误信息
- 完善参数校验，增加必填字段和格式验证
- 优化权限控制，区分管理员和普通用户权限
- 增加操作日志记录，支持审计追踪

**涉及接口**:
- `/api/content/species/*` - 物种管理接口
- `/api/content/notice/*` - 公告管理接口
- `/api/content/help/*` - 帮助文档接口
- `/api/content/audit/*` - 内容审核接口
- `/api/content/sensitive/*` - 敏感词管理接口

---

### 数据统计 API 优化

**优化内容**:
- 优化 SQL 查询性能，减少数据库压力
- 增加缓存机制，提升响应速度
- 支持多维度数据筛选和聚合
- 新增数据导出功能，支持 CSV/Excel 格式
- 优化大数据量分页查询

**涉及接口**:
- `/api/statistics/overview` - 统计概览
- `/api/statistics/export` - 数据导出
- `/api/statistics/chart` - 图表数据

---

### 消息推送服务优化

**优化内容**:
- 优化推送策略，支持定时推送和条件触发
- 增加推送记录追踪，支持推送状态查询
- 完善推送模板管理，支持自定义模板
- 优化推送频率控制，避免骚扰用户
- 增加推送效果统计，支持打开率分析

**涉及接口**:
- `/api/push/config` - 推送配置
- `/api/push/record` - 推送记录查询

---

### 用户反馈系统优化

**优化内容**:
- 优化反馈分类和标签体系
- 增加反馈处理流程追踪
- 完善反馈回复通知机制
- 增加反馈统计分析功能
- 优化反馈处理效率

**涉及接口**:
- `/api/feedback/process` - 反馈处理（优化版）
- `/api/feedback/statistics` - 反馈统计

---

**接口清单**:
1. `POST /feedback/submit` - 提交反馈
2. `GET /feedback/detail/{id}` - 获取反馈详情
3. `GET /feedback/list` - 获取反馈列表（支持筛选）
4. `POST /feedback/process/{id}` - 处理反馈
5. `DELETE /feedback/delete/{id}` - 删除反馈

---

## 🏢 二十五、管理后台接口（Phase 2 Day 18）

### 25.1 控制台首页接口

#### 25.1.1 获取仪表盘数据

**接口详情**:
- **接口名称**: 获取管理后台仪表盘数据
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

#### 25.1.2 获取概览统计

**接口详情**:
- **接口名称**: 获取平台概览统计
- **请求方式**: GET
- **接口地址**: `/api/admin/stats/overview`
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
    "totalUsers": 15680,
    "totalOrders": 3256,
    "totalOrgs": 45,
    "totalVolunteers": 892,
    "totalSettlement": 1456000,
    "totalMerit": 32560,
    "growth": {
      "userGrowth": 8.3,
      "orderGrowth": 12.5,
      "revenueGrowth": 15.2
    }
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回平台整体运营数据
- 支持时间范围筛选
- 包含增长率统计

---

#### 25.1.3 获取待办事项

**接口详情**:
- **接口名称**: 获取待办事项列表
- **请求方式**: GET
- **接口地址**: `/api/admin/todos`
- **是否需要登录**: 是（需管理员权限）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| type | string | 否 | 待办类型：review/complaint/settlement |
| limit | int | 否 | 返回数量，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 25,
    "list": [
      {
        "id": 1,
        "type": "review",
        "typeName": "执行结果审核",
        "title": "订单 ORD202604050001 待审核",
        "priority": "high",
        "deadline": "2026-04-06 16:00:00",
        "createTime": "2026-04-05 14:30:00"
      },
      {
        "id": 2,
        "type": "complaint",
        "typeName": "投诉处理",
        "title": "用户投诉处理",
        "priority": "medium",
        "deadline": "2026-04-07 12:00:00",
        "createTime": "2026-04-05 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回管理员待处理事项
- 支持按类型筛选
- 包含优先级和截止时间

---

### 25.2 用户管理模块

#### 25.2.1 获取用户列表

**接口详情**:
- **接口名称**: 获取用户列表
- **请求方式**: GET
- **接口地址**: `/api/admin/users/list`
- **是否需要登录**: 是（需管理员权限）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词（昵称/手机号） |
| roleCode | string | 否 | 角色筛选：user/volunteer/org/admin |
| status | int | 否 | 状态筛选：1 正常 0 禁用 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 15680,
    "list": [
      {
        "id": 1001,
        "nickname": "张师兄",
        "avatar": "https://xxx/avatar1.jpg",
        "phone": "138****1234",
        "roleCode": "user",
        "roleName": "普通用户",
        "status": 1,
        "statusName": "正常",
        "merit": 1560,
        "orderCount": 25,
        "registerTime": "2026-01-15 10:00:00",
        "lastLoginTime": "2026-04-05 09:30:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持关键词搜索和筛选
- 手机号脱敏展示
- 包含用户基本统计信息

---

#### 25.2.2 获取用户详情

**接口详情**:
- **接口名称**: 获取用户详情
- **请求方式**: GET
- **接口地址**: `/api/admin/users/detail/{id}`
- **是否需要登录**: 是（需管理员权限）

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 用户 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1001,
    "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
    "nickname": "张师兄",
    "avatar": "https://xxx/avatar1.jpg",
    "phone": "13800138000",
    "roleCode": "user",
    "roleName": "普通用户",
    "status": 1,
    "merit": 1560,
    "totalOrderCount": 25,
    "completedOrderCount": 22,
    "totalQuantity": 1250,
    "registerTime": "2026-01-15 10:00:00",
    "lastLoginTime": "2026-04-05 09:30:00",
    "orderList": [
      {
        "orderNo": "ORD202604050001",
        "speciesName": "鲢鱼",
        "quantity": 50,
        "amount": 500,
        "status": 5,
        "createTime": "2026-04-05 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 返回用户完整信息
- 包含订单历史记录
- 手机号完整展示（管理员权限）

---

#### 25.2.3 更新用户状态

**接口详情**:
- **接口名称**: 更新用户状态
- **请求方式**: PUT
- **接口地址**: `/api/admin/users/status/{id}`
- **是否需要登录**: 是（需管理员权限）

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 用户 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 是 | 状态 1 正常 0 禁用 |
| reason | string | 否 | 操作原因 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": 1001,
    "status": 0,
    "statusName": "禁用",
    "updateTime": "2026-04-05 14:30:00",
    "updateBy": 1,
    "updateByName": "超级管理员"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 禁用后用户无法登录
- 记录操作日志
- 发送站内信通知用户

---

#### 25.2.4 删除用户

**接口详情**:
- **接口名称**: 删除用户
- **请求方式**: DELETE
- **接口地址**: `/api/admin/users/delete/{id}`
- **是否需要登录**: 是（需管理员权限）

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 用户 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": 1712345678901
}
```

**业务说明**:
- 逻辑删除，更新 is_deleted 字段
- 有未完成订单的用户不可删除
- 记录操作日志备查

---

#### 25.2.5 导出用户数据

**接口详情**:
- **接口名称**: 导出用户数据
- **请求方式**: GET
- **接口地址**: `/api/admin/users/export`
- **是否需要登录**: 是（需管理员权限）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| startDate | string | 否 | 开始日期 yyyy-MM-dd |
| endDate | string | 否 | 结束日期 yyyy-MM-dd |
| roleCode | string | 否 | 角色筛选 |
| status | int | 否 | 状态筛选 |
| format | string | 否 | 导出格式：xlsx/csv，默认 xlsx |

**响应示例**:

```json
{
  "code": 200,
  "msg": "导出成功",
  "data": {
    "fileUrl": "https://xxx/export/users-20260405.xlsx",
    "fileName": "用户数据_20260405.xlsx",
    "fileSize": "1.2MB",
    "recordCount": 15680,
    "expireTime": "2026-04-12 23:59:59"
  },
  "timestamp": 1712345678901
}
```

**业务说明**:
- 支持按条件筛选导出
- 导出文件保留 7 天
- 大数据量时异步生成

**Excel 列头**:
- 用户 ID
- 昵称
- 手机号
- 角色
- 状态
- 功德值
- 订单数
- 注册时间
- 最后登录时间

---

*清如 V3 · API 接口文档 V1.12 更新完成* 🌊

**文档版本**: V1.12  
**创建日期**: 2026-04-04  
**最后更新**: 2026-04-05  
**Day 18 新增接口**: 
- 控制台首页接口（3 个）：获取仪表盘数据、获取概览统计、获取待办事项
- 用户管理模块（5 个）：获取用户列表、获取用户详情、更新用户状态、删除用户、导出用户数据
- Day 18 新增接口总数：8 个
- 累计接口总数：107+ 个

---
