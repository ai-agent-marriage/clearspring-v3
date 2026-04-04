# API 接口文档

本文档描述了护生放生小程序的后端 API 接口。

## 基础信息

- **基础 URL**: `/api`（根据实际部署配置）
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

所有接口返回统一格式：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

### 响应码说明

| 响应码 | 说明 |
|--------|------|
| 200 | 成功 |
| 500 | 失败 |

---

## 佛历数据接口

### 1. 获取今日佛历

**接口**: `GET /lunar/today`

**描述**: 获取今日佛历信息，包括公历、农历、佛历、干支、宜忌等。

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "solarDate": "2026 年 4 月 7 日 星期一",
    "lunarDate": "农历 二月 十七",
    "foDate": "佛历 2569 年 二月 十七",
    "ganzhi": "乙巳年 庚辰月",
    "suit": ["护生", "行善", "祈福"],
    "avoid": ["杀生", "偷盗", "妄语"],
    "zenQuote": "积善成德，而神明自得，圣心备焉"
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| solarDate | string | 公历日期 |
| lunarDate | string | 农历日期 |
| foDate | string | 佛历日期 |
| ganzhi | string | 干支纪年 |
| suit | array | 宜做事项列表 |
| avoid | array | 忌做事项列表 |
| zenQuote | string | 当日禅理 |

---

### 2. 判断是否宜护生

**接口**: `GET /lunar/suit`

**描述**: 判断指定日期是否适合护生放生。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | date | 是 | 日期，格式：yyyy-MM-dd |

**请求示例**:
```
GET /lunar/suit?date=2026-04-07
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": true
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| data | boolean | true-宜护生，false-不宜护生 |

---

## 禅理内容接口

### 1. 随机获取禅理

**接口**: `GET /zen/random`

**描述**: 随机获取一条禅理短句。

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "content": "积善成德，而神明自得，圣心备焉",
    "author": "《荀子·劝学》",
    "status": 1,
    "createTime": "2026-04-07 10:00:00"
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | long | 主键 ID |
| content | string | 禅理内容 |
| author | string | 出处 |
| status | integer | 状态：1 启用 0 禁用 |
| createTime | datetime | 创建时间 |

---

### 2. 获取当日每日一禅

**接口**: `GET /zen/daily`

**描述**: 获取当日推荐的每日一禅。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | string | 否 | 日期，默认今天 |

**请求示例**:
```
GET /zen/daily
GET /zen/daily?date=2026-04-07
```

**响应示例**: 同随机获取禅理

---

### 3. 根据 ID 获取禅理

**接口**: `GET /zen/{id}`

**描述**: 根据主键 ID 获取禅理详情。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 禅理 ID |

**请求示例**:
```
GET /zen/1
```

**响应示例**: 同随机获取禅理

---

## 物种查询接口

### 1. 获取物种列表

**接口**: `GET /species/list`

**描述**: 获取物种列表，支持分类筛选和关键词搜索。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | integer | 否 | 类型：1 鱼类 2 鸟类 3 其他 |
| keyword | string | 否 | 关键词，支持名称和学名搜索 |

**请求示例**:
```
GET /species/list
GET /species/list?type=1
GET /species/list?keyword=鲤鱼
GET /species/list?type=1&keyword=鲤
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "鲤鱼",
      "scientificName": "Cyprinus carpio",
      "type": 1,
      "isForbid": 0,
      "remark": "常见淡水鱼，适合放生",
      "protectLevel": "无危",
      "suitableHabitat": "淡水湖泊、河流",
      "bestTime": "春季、秋季",
      "sort": 1
    }
  ]
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | long | 主键 ID |
| name | string | 物种名称 |
| scientificName | string | 学名 |
| type | integer | 类型：1 鱼类 2 鸟类 3 其他 |
| isForbid | integer | 是否入侵物种：0 否 1 是 |
| remark | string | 备注/警示语 |
| protectLevel | string | 保护级别 |
| suitableHabitat | string | 适宜生境 |
| bestTime | string | 最佳投放时机 |
| sort | integer | 排序 |

---

### 2. 获取物种详情

**接口**: `GET /species/detail/{id}`

**描述**: 根据主键 ID 获取物种详细信息。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 物种 ID |

**请求示例**:
```
GET /species/detail/1
```

**响应示例**: 同物种列表（单条）

---

## 海报生成接口

### 1. 生成每日禅理海报

**接口**: `POST /poster/daily-zen`

**描述**: 根据禅理内容和背景图生成分享海报。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| zenQuote | string | 是 | 禅理内容 |
| bgUrl | string | 是 | 背景图 URL |

**请求示例**:
```json
{
  "zenQuote": "积善成德，而神明自得，圣心备焉",
  "bgUrl": "https://example.com/bg.jpg"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "海报生成成功",
  "data": "/tmp/posters/zen_1712476800000.jpg"
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| data | string | 海报文件路径 |

---

## 错误处理

### 常见错误码

| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |

### 错误响应示例

```json
{
  "code": 500,
  "msg": "海报生成失败",
  "data": null
}
```

---

## 护生记录接口

### 1. 创建护生记录

**接口**: `POST /protect/record/add`

**描述**: 创建一条新的护生记录，包含内容安全审核和证书自动生成。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userOpenid | string | 否 | 用户 openid（未注册为空） |
| speciesId | long | 是 | 物种 ID |
| quantity | integer | 是 | 数量 |
| address | string | 是 | 护生地点 |
| remark | string | 否 | 备注 |
| images | string | 否 | 现场照片（逗号分隔） |

**请求示例**:
```json
{
  "userOpenid": "oXXXX123456",
  "speciesId": 1,
  "quantity": 10,
  "address": "西湖放生池",
  "remark": "今日护生，功德无量",
  "images": "/tmp/img1.jpg,/tmp/img2.jpg"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "护生记录创建成功",
  "data": {
    "id": 1,
    "userOpenid": "oXXXX123456",
    "speciesId": 1,
    "quantity": 10,
    "address": "西湖放生池",
    "status": 1,
    "createTime": "2026-04-07 10:00:00"
  }
}
```

---

### 2. 获取我的护生记录

**接口**: `GET /protect/record/my`

**描述**: 获取用户的护生记录列表，支持分页。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| openid | string | 是 | 用户 openid |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页数量，默认 10 |

**请求示例**:
```
GET /protect/record/my?openid=oXXXX123456&pageNum=1&pageSize=10
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "id": 1,
      "speciesId": 1,
      "quantity": 10,
      "address": "西湖放生池",
      "status": 1,
      "createTime": "2026-04-07 10:00:00"
    }
  ]
}
```

---

### 3. 获取护生记录详情

**接口**: `GET /protect/record/detail/{id}`

**描述**: 根据主键 ID 获取护生记录详情。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 记录 ID |

**请求示例**:
```
GET /protect/record/detail/1
```

**响应示例**: 同创建护生记录（单条）

---

### 4. 更新护生记录

**接口**: `PUT /protect/record/update/{id}`

**描述**: 更新护生记录信息。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 记录 ID |
| quantity | integer | 否 | 数量 |
| address | string | 否 | 护生地点 |
| remark | string | 否 | 备注 |
| images | string | 否 | 现场照片 |
| status | integer | 否 | 状态 |

---

## 订单接口

### 1. 创建订单

**接口**: `POST /order/create`

**描述**: 创建护生订单。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | long | 是 | 用户 ID |
| orgId | long | 否 | 承接机构 ID |
| volunteerId | long | 否 | 执行志愿者 ID |
| speciesId | long | 是 | 物种 ID |
| quantity | integer | 是 | 数量 |
| amount | decimal | 是 | 订单金额 |
| address | string | 是 | 护生地点 |

**请求示例**:
```json
{
  "userId": 1,
  "speciesId": 1,
  "quantity": 100,
  "amount": 100.00,
  "address": "西湖放生池"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "订单创建成功",
  "data": {
    "orderNo": "PRO202604070001",
    "userId": 1,
    "status": 1,
    "createTime": "2026-04-07 10:00:00"
  }
}
```

---

### 2. 支付订单

**接口**: `POST /order/pay`

**描述**: 调用微信支付统一下单。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号 |
| openid | string | 是 | 用户 openid |

**请求示例**:
```json
{
  "orderNo": "PRO202604070001",
  "openid": "oXXXX123456"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "支付下单成功",
  "data": {
    "appId": "wx123456",
    "timeStamp": "1234567890",
    "nonceStr": "xxxxx",
    "package": "prepay_id=xxx",
    "signType": "RSA",
    "paySign": "xxxxx"
  }
}
```

---

### 3. 获取我的订单

**接口**: `GET /order/my`

**描述**: 获取用户的订单列表。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | long | 是 | 用户 ID |
| status | integer | 否 | 状态筛选 |
| pageNum | integer | 否 | 页码 |
| pageSize | integer | 否 | 每页数量 |

---

### 4. 确认订单

**接口**: `PUT /order/confirm/{orderNo}`

**描述**: 确认订单完成，包含评分和评价。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号 |
| score | integer | 是 | 评分（1-5） |
| comment | string | 否 | 评价 |

---

## 证书接口

### 1. 获取我的证书

**接口**: `GET /cert/my`

**描述**: 获取用户的证书列表。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | long | 是 | 用户 ID |
| certType | integer | 否 | 证书类型：1 免费 2 付费 |
| pageNum | integer | 否 | 页码 |
| pageSize | integer | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "id": 1,
      "certNo": "QR202604070001",
      "certType": 1,
      "certUrl": "/certificates/QR202604070001.jpg",
      "content": "于西湖放生池完成科学护生行动，特发此证",
      "createTime": "2026-04-07 10:00:00"
    }
  ]
}
```

---

### 2. 获取证书详情

**接口**: `GET /cert/detail/{id}`

**描述**: 根据主键 ID 获取证书详情。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 证书 ID |

---

## 内容安全接口

### 1. 图片审核

**接口**: 内部调用（通过 SecurityCheckService）

**描述**: 调用微信内容安全 API 审核图片。

**审核结果**:
- 0: 通过
- 1: 违规
- 2: 疑似（按违规处理）

---

### 2. 文本审核

**接口**: 内部调用（通过 SecurityCheckService）

**描述**: 调用微信内容安全 API 审核文本内容。

---

## 错误处理

### 常见错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 500 | 失败 |
| 500 | 图片包含违规内容 |
| 500 | 文本包含违规内容 |
| 500 | 订单不存在 |
| 500 | 证书不存在 |

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-04-07 | 初始版本，包含佛历、禅理、物种、海报接口 |
| v1.1 | 2026-04-07 | 新增护生记录、订单、证书接口，集成内容安全 API |
