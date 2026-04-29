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

#### 2.1.1 微信一键登录（必选，小程序启动调用）

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

#### 2.1.2 获取用户详情

**接口详情**:
- **接口名称**: 获取用户详情
- **请求方式**: GET
- **接口地址**: `/user/info`
- **是否需要登录**: 是

**请求参数（Query）**: 无额外参数，通过请求头 openid 识别用户

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
    "nickname": "清如用户",
    "avatar": "https://xxx/avatar.jpg",
    "phone": "13800138000",
    "roleCode": "user",
    "orgId": 0,
    "merit": 120,
    "listenCount": 36,
    "protectCount": 5,
    "continuousDays": 7,
    "certCount": 3,
    "createTime": "2026-04-01 10:00:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 2.1.3 志愿者注册认证

**接口详情**:
- **接口名称**: 志愿者实名认证注册
- **请求方式**: POST
- **接口地址**: `/user/volunteer/register`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| realName | string | 是 | 真实姓名 |
| idCard | string | 是 | 身份证号 |
| phone | string | 是 | 联系电话 |
| address | string | 是 | 所在区域 |
| inviteCode | string | 否 | 机构邀请码 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "注册成功，系统自动审核通过",
  "data": {
    "roleCode": "volunteer",
    "orgId": 2,
    "status": 1
  },
  "timestamp": 1712345678901
}
```

---

#### 2.1.4 机构注册申请

**接口详情**:
- **接口名称**: 机构入驻申请
- **请求方式**: POST
- **接口地址**: `/user/org/register`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orgName | string | 是 | 机构全称 |
| creditCode | string | 是 | 统一社会信用代码 |
| contactName | string | 是 | 联系人姓名 |
| contactPhone | string | 是 | 联系电话 |
| address | string | 是 | 机构地址 |
| licenseUrl | string | 是 | 营业执照图片地址 |
| qualificationUrl | string | 是 | 护生资质证明图片地址 |
| waterAgreementUrl | string | 是 | 水域合作协议图片地址 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "申请提交成功，等待平台审核",
  "data": {
    "applyId": 1001,
    "status": 0
  },
  "timestamp": 1712345678901
}
```

---

### 2.2 梵音音频模块

#### 2.2.1 获取音频列表

**接口详情**:
- **接口名称**: 获取梵音音频列表
- **请求方式**: GET
- **接口地址**: `/audio/list`
- **是否需要登录**: 否

**请求参数（Query）**: 无

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "静心梵音·心经",
      "url": "https://xxx/audio/xinjing.mp3",
      "duration": 300,
      "sort": 1,
      "listenCount": 1256
    },
    {
      "id": 2,
      "title": "禅意冥想·静心",
      "url": "https://xxx/audio/jingxin.mp3",
      "duration": 480,
      "sort": 2,
      "listenCount": 987
    }
  ],
  "timestamp": 1712345678901
}
```

---

#### 2.2.2 提交有效收听记录

**接口详情**:
- **接口名称**: 提交有效收听记录
- **请求方式**: POST
- **接口地址**: `/audio/listen`
- **是否需要登录**: 否（未登录本地记录，登录后云端同步）

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| audioId | long | 是 | 音频 ID |
| listenDuration | int | 是 | 实际收听时长（秒） |
| totalDuration | int | 是 | 音频总时长（秒） |

**响应示例**:

```json
{
  "code": 200,
  "msg": "记录成功",
  "data": {
    "isValid": true,
    "listenCount": 5,
    "milestone": "已达成 10 次收听里程碑"
  },
  "timestamp": 1712345678901
}
```

---

### 2.3 禅理内容模块

#### 2.3.1 获取随机禅理短句

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

#### 2.3.2 获取每日一禅

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
    "content": "心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想",
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

#### 2.3.3 护生物种列表查询

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

#### 2.3.4 物种详情查询

**接口详情**:
- **接口名称**: 获取物种详情
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

### 2.4 免费护生记录模块

#### 2.4.1 提交免费护生记录

**接口详情**:
- **接口名称**: 提交护生记录
- **请求方式**: POST
- **接口地址**: `/protect/record/add`
- **是否需要登录**: 否（未注册用户 openid 关联记录）

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| speciesId | long | 是 | 物种 ID（仅可选择非禁止物种） |
| quantity | int | 是 | 投放数量 |
| address | string | 是 | 投放地点 |
| protectDate | string | 是 | 护生日期，格式 yyyy-MM-dd |
| remark | string | 否 | 心愿备注 |
| images | string | 否 | 现场照片，多图用逗号分隔 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "提交成功，证书已生成",
  "data": {
    "recordId": 1001,
    "certId": 501,
    "certUrl": "https://xxx/cert/1001.jpg"
  },
  "timestamp": 1712345678901
}
```

---

#### 2.4.2 我的护生记录列表

**接口详情**:
- **接口名称**: 获取我的护生记录
- **请求方式**: GET
- **接口地址**: `/protect/record/my`
- **是否需要登录**: 否（通过 openid 匹配）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| pageNum | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 5,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "id": 1001,
        "speciesName": "鲢鱼",
        "quantity": 100,
        "address": "珠江广州段",
        "protectDate": "2026-04-01",
        "remark": "平安顺遂",
        "status": 1,
        "certUrl": "https://xxx/cert/1001.jpg",
        "createTime": "2026-04-01 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

### 2.5 付费护生订单模块

#### 2.5.1 创建护生委托订单

**接口详情**:
- **接口名称**: 创建委托订单
- **请求方式**: POST
- **接口地址**: `/order/create`
- **是否需要登录**: 是（仅注册祈福者可创建）

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| speciesId | long | 是 | 物种 ID |
| quantity | int | 是 | 投放份数 |
| executeDate | string | 是 | 执行日期，格式 yyyy-MM-dd（仅可选择未来 7-30 天） |
| addressId | long | 是 | 投放水域 ID |
| extraServiceIds | string | 否 | 增值服务 ID，多选用逗号分隔 |
| remark | string | 否 | 心愿寄语 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "订单创建成功",
  "data": {
    "orderNo": "PRO202604040001",
    "amount": 299.00,
    "payDeadline": "2026-04-04 10:15:00"
  },
  "timestamp": 1712345678901
}
```

---

#### 2.5.2 发起微信支付

**接口详情**:
- **接口名称**: 订单支付唤起
- **请求方式**: POST
- **接口地址**: `/order/pay`
- **是否需要登录**: 是

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "支付参数生成成功",
  "data": {
    "appId": "wx1234567890abcdef",
    "timeStamp": "1712345678",
    "nonceStr": "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
    "package": "prepay_id=wx201410272009395522657a690389285100",
    "signType": "RSA",
    "paySign": "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7hRvwUpr89A3tZfkMDbEmsY64LS2+s6/8U6h2Hveth4BxWw=="
  },
  "timestamp": 1712345678901
}
```

---

#### 2.5.3 我的订单列表

**接口详情**:
- **接口名称**: 获取我的委托订单
- **请求方式**: GET
- **接口地址**: `/order/my`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 否 | 订单状态 1 待承接 2 待执行 3 执行中 4 待确认 5 已完成 6 已取消 |
| pageNum | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 3,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "orderNo": "PRO202604040001",
        "speciesName": "鲢鱼",
        "quantity": 10,
        "amount": 299.00,
        "status": 5,
        "statusName": "已完成",
        "address": "珠江广州段",
        "executeDate": "2026-04-02",
        "orgName": "XX 生态护生协会",
        "executeImages": "https://xxx/img1.jpg,https://xxx/img2.jpg",
        "certUrl": "https://xxx/cert/202604040001.jpg",
        "createTime": "2026-04-01 10:00:00",
        "completeTime": "2026-04-02 15:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 2.5.4 确认订单执行完成

**接口详情**:
- **接口名称**: 确认订单完成
- **请求方式**: PUT
- **接口地址**: `/order/confirm/{orderNo}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号 |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| score | int | 否 | 服务评分 1-5 分 |
| comment | string | 否 | 评价内容 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "确认成功，证书已生成",
  "data": {
    "certId": 502,
    "certUrl": "https://xxx/cert/202604040001.jpg"
  },
  "timestamp": 1712345678901
}
```

---

### 2.6 证书模块

#### 2.6.1 我的证书列表

**接口详情**:
- **接口名称**: 获取我的证书列表
- **请求方式**: GET
- **接口地址**: `/cert/my`
- **是否需要登录**: 是

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| certType | int | 否 | 证书类型 1 免费护生证书 2 付费订单证书 3 收听里程碑证书 |
| pageNum | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 3,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "id": 501,
        "certType": 1,
        "certTypeName": "护生圆满证书",
        "certUrl": "https://xxx/cert/1001.jpg",
        "orderNo": "",
        "recordId": 1001,
        "createTime": "2026-04-01 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 2.6.2 证书详情

**接口详情**:
- **接口名称**: 获取证书详情
- **请求方式**: GET
- **接口地址**: `/cert/detail/{id}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| id | long | 是 | 证书 ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 501,
    "userId": 1,
    "userName": "清如用户",
    "certType": 1,
    "certTypeName": "护生圆满证书",
    "certUrl": "https://xxx/cert/1001.jpg",
    "content": "于 2026 年 04 月 01 日在珠江广州段完成科学护生行动，特发此证",
    "certNo": "QR202604010001",
    "createTime": "2026-04-01 10:00:00"
  },
  "timestamp": 1712345678901
}
```

---

### 2.7 践行者（志愿者/机构）模块

#### 2.7.1 志愿者 - 我的任务列表

**接口详情**:
- **接口名称**: 获取我的执行任务
- **请求方式**: GET
- **接口地址**: `/volunteer/task/my`
- **是否需要登录**: 是（仅志愿者角色可访问）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| status | int | 否 | 任务状态 1 待执行 2 执行中 3 已完成 |
| pageNum | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 2,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "taskId": 2001,
        "orderNo": "PRO202604040001",
        "speciesName": "鲢鱼",
        "quantity": 10,
        "executeDate": "2026-04-04",
        "address": "珠江广州段",
        "remark": "平安顺遂",
        "status": 1,
        "orgName": "XX 生态护生协会",
        "createTime": "2026-04-03 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 2.7.2 志愿者 - 提交任务执行结果

**接口详情**:
- **接口名称**: 提交执行结果
- **请求方式**: POST
- **接口地址**: `/volunteer/task/execute/{taskId}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| taskId | long | 是 | 任务 ID |

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| executeTime | string | 是 | 执行时间，格式 yyyy-MM-dd HH:mm:ss |
| address | string | 是 | 实际投放点位 |
| realQuantity | int | 是 | 实际投放数量 |
| images | string | 是 | 现场照片，多图逗号分隔 |
| videoUrl | string | 否 | 执行视频地址 |
| remark | string | 否 | 执行备注 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "提交成功，等待机构审核",
  "data": {
    "taskId": 2001,
    "status": 2
  },
  "timestamp": 1712345678901
}
```

---

#### 2.7.3 机构 - 可承接订单列表

**接口详情**:
- **接口名称**: 获取可承接订单
- **请求方式**: GET
- **接口地址**: `/org/order/available`
- **是否需要登录**: 是（仅审核通过的机构可访问）

**请求参数（Query）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| pageNum | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "total": 5,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "orderNo": "PRO202604040002",
        "speciesName": "鳙鱼",
        "quantity": 20,
        "amount": 598.00,
        "executeDate": "2026-04-10",
        "address": "珠江广州段",
        "remark": "学业有成",
        "createTime": "2026-04-04 10:00:00",
        "expireTime": "2026-04-06 10:00:00"
      }
    ]
  },
  "timestamp": 1712345678901
}
```

---

#### 2.7.4 机构 - 承接订单

**接口详情**:
- **接口名称**: 承接委托订单
- **请求方式**: POST
- **接口地址**: `/org/order/accept/{orderNo}`
- **是否需要登录**: 是

**路径参数**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "承接成功",
  "data": {
    "orderNo": "PRO202604040002",
    "status": 2
  },
  "timestamp": 1712345678901
}
```

---

## 🖥️ 三、WEB 管理后台接口

### 3.1 后台登录接口

**接口详情**:
- **接口名称**: 后台账号密码登录
- **请求方式**: POST
- **接口地址**: `/admin/login`
- **是否需要登录**: 否

**请求参数（Body）**:

| 字段 | 类型 | 必选 | 说明 |
|------|------|------|------|
| username | string | 是 | 账号 |
| password | string | 是 | 密码（MD5 加密） |
| captcha | string | 是 | 验证码 |
| uuid | string | 是 | 验证码唯一标识 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "userId": 1,
      "username": "admin",
      "nickName": "超级管理员",
      "roleKeys": ["admin"],
      "permissions": ["*:*:*"]
    }
  },
  "timestamp": 1712345678901
}
```

---

### 3.2 核心管理接口概览

| 模块 | 接口名称 | 请求方式 | 接口地址 | 权限要求 |
|------|----------|----------|----------|----------|
| **用户管理** | 用户列表查询 | GET | `/admin/user/list` | admin |
| **用户管理** | 机构入驻审核 | PUT | `/admin/org/audit/{id}` | admin |
| **订单管理** | 全量订单列表 | GET | `/admin/order/list` | admin |
| **订单管理** | 订单强制取消 | PUT | `/admin/order/cancel/{orderNo}` | admin |
| **内容管理** | 禅理内容新增 | POST | `/admin/zen/add` | admin |
| **内容管理** | 物种信息编辑 | PUT | `/admin/species/update/{id}` | admin |
| **财务管理** | 待结算订单列表 | GET | `/admin/finance/settle/list` | finance |
| **财务管理** | 订单结算确认 | POST | `/admin/finance/settle/confirm` | finance |
| **系统管理** | 系统配置更新 | PUT | `/admin/config/update` | admin |
| **统计管理** | 运营数据大盘 | GET | `/admin/statistics/dashboard` | admin |

**说明**: 后台完整接口可基于若依 (RuoYi-Vue) 框架标准接口扩展，完全匹配 PRD 中后台模块的所有功能需求，与小程序端接口共用底层业务逻辑。

---

## 📝 四、接口补充说明

### 4.1 图片/视频上传

所有涉及用户上传的图片/视频，需先调用微信上传接口，再将返回的 URL 提交至业务接口。

---

### 4.2 内容安全审核

所有用户提交的文本内容（心愿备注、执行备注、评价等），均需先经过微信内容安全 API 审核，审核通过后方可提交。

---

### 4.3 支付接口规范

支付相关接口需严格遵循微信支付 V3 接口规范，支付回调接口需做签名验签处理。

---

### 4.4 权限校验

所有涉及角色权限的接口，后端需做严格的权限校验，禁止越权操作。

---

### 4.5 安全校验

所有接口需做参数合法性校验，防止 SQL 注入、XSS 攻击等安全问题。

---

*清如 V3 · API 接口文档 V1.0 完成* 🌊
