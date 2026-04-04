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

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-04-07 | 初始版本，包含佛历、禅理、物种、海报接口 |
