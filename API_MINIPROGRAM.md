# 清如小程序 V2.0 - 小程序端 API 接口文档

**文档版本**: V1.0.0  
**创建日期**: 2026-04-16  
**适用端**: 微信小程序 (C 端)  

---

## 一、公共模块接口

### 1.1 文件上传

**URL**: `POST /api/v1/upload/image`

**描述**: 上传图片（护生照片、头像等）

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求参数**:
```
Content-Type: multipart/form-data

file: File (required)
  - 大小限制：≤ 5MB
  - 格式限制：jpg/png/webp
  - 分辨率限制：≤ 4096×4096
scene: String (required)
  - 可选值：protect_life（护生照片）、avatar（头像）、certificate（证书）
```

**参数验证规则**:
```json
{
  "file": {
    "type": "file",
    "required": true,
    "max_size_mb": 5,
    "allowed_formats": ["image/jpeg", "image/png", "image/webp"],
    "max_width": 4096,
    "max_height": 4096
  },
  "scene": {
    "type": "string",
    "required": true,
    "enum": ["protect_life", "avatar", "certificate"],
    "description": "使用场景"
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "file_id": "img_abc123",
    "url": "https://cdn.example.com/images/abc123.jpg",
    "width": 1920,
    "height": 1080,
    "size": 1024000,
    "format": "image/jpeg",
    "upload_time": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 参数错误 |
| 401 | 未登录 |
| 413 | 文件过大（>5MB） |
| 415 | 文件格式不支持 |
| 1001 | 图片包含违规内容（内容安全检测失败） |

**内容安全检测流程**:
```
1. 客户端上传图片
2. 服务端保存到临时目录
3. 调用微信内容安全 API
   - imgSecCheck 接口
   - 检测色情、暴力、政治敏感等
4. 检测通过：移动到正式目录，返回 URL
5. 检测失败：删除临时文件，返回错误码 1001
```

---

### 1.2 内容安全检测

**URL**: `POST /api/v1/content/check`

**描述**: 检测文本或图片内容是否合规，调用微信内容安全 API

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "content": "string",
  "type": "text|image"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 待检测内容 (文本或图片 file_id) |
| type | string | 是 | 内容类型：text=文本，image=图片 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "result": "pass",
    "detail": [],
    "check_time": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 参数错误 |
| 5002 | 包含敏感词 |
| 5001 | 内容违规 |

---

## 二、梵音板块接口

### 2.1 获取梵音列表

**URL**: `GET /api/v1/audio/list`

**描述**: 获取 9 首固定梵音音频列表及收听次数统计

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "audio_id": "audio_001",
        "title": "心经",
        "description": "般若波罗蜜多心经",
        "duration": 180,
        "cover_url": "https://cdn.qingru.com/audio/cover_001.jpg",
        "audio_url": "https://cdn.qingru.com/audio/audio_001.mp3",
        "effective_count": 156,
        "is_cached": false
      },
      {
        "audio_id": "audio_002",
        "title": "金刚经",
        "description": "金刚般若波罗蜜经",
        "duration": 600,
        "cover_url": "https://cdn.qingru.com/audio/cover_002.jpg",
        "audio_url": "https://cdn.qingru.com/audio/audio_002.mp3",
        "effective_count": 89,
        "is_cached": false
      }
    ],
    "total_count": 9
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 401 | 未登录 |

---

### 2.2 获取梵音详情

**URL**: `GET /api/v1/audio/detail`

**描述**: 获取单首梵音的详细信息

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "audio_id": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| audio_id | string | 是 | 音频 ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "audio_id": "audio_001",
    "title": "心经",
    "description": "般若波罗蜜多心经",
    "duration": 180,
    "cover_url": "https://cdn.qingru.com/audio/cover_001.jpg",
    "audio_url": "https://cdn.qingru.com/audio/audio_001.mp3",
    "effective_count": 156,
    "user_listen_count": 12,
    "lyrics": "观自在菩萨，行深般若波罗蜜多时...",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 2001 | 音频不存在 |
| 401 | 未登录 |

---

### 2.3 提交收听记录

**URL**: `POST /api/v1/audio/record`

**描述**: 提交有效收听记录，单次播放时长≥80% 记为有效

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "audio_id": "string",
  "listen_duration": 150,
  "total_duration": 180,
  "listen_time": 1713254400000
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| audio_id | string | 是 | 音频 ID |
| listen_duration | number | 是 | 实际收听时长 (秒) |
| total_duration | number | 是 | 音频总时长 (秒) |
| listen_time | number | 是 | 收听完成时间戳 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "is_effective": true,
    "current_count": 13,
    "milestone_reached": false,
    "next_milestone": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 2001 | 音频不存在 |
| 2002 | 收听记录无效 (时长不足 80%) |
| 401 | 未登录 |

---

### 2.4 获取收听统计

**URL**: `GET /api/v1/audio/statistics`

**描述**: 获取用户的梵音收听统计数据

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total_effective_count": 156,
    "total_listen_duration": 28800,
    "audio_statistics": [
      {
        "audio_id": "audio_001",
        "title": "心经",
        "effective_count": 45
      },
      {
        "audio_id": "audio_002",
        "title": "金刚经",
        "effective_count": 23
      }
    ],
    "milestones": [
      {
        "type": "single_audio",
        "audio_id": "audio_001",
        "count": 10,
        "achieved_at": 1713254400000
      },
      {
        "type": "total_count",
        "count": 100,
        "achieved_at": 1713340800000
      }
    ]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 2.5 生成里程碑证书

**URL**: `POST /api/v1/audio/certificate`

**描述**: 收听达到里程碑时自动生成证书

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "milestone_type": "single_audio|total_count",
  "audio_id": "string",
  "count": 100
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| milestone_type | string | 是 | 里程碑类型：single_audio=单首，total_count=总计 |
| audio_id | string | 否 | 音频 ID (single_audio 类型必填) |
| count | number | 是 | 达成次数 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "certificate_id": "cert_audio_xxxxx",
    "certificate_no": "QR-AUDIO-20260416-001234",
    "title": "梵音收听里程碑证书",
    "content": "恭喜您完成《心经》收听 100 次",
    "image_url": "https://cdn.qingru.com/certificates/cert_audio_xxxxx.jpg",
    "qr_code": "https://cdn.qingru.com/qr/cert_audio_xxxxx.png",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 400 | 未达里程碑 |

---

## 三、禅理板块接口

### 3.1 获取每日一禅

**URL**: `GET /api/v1/zen/daily`

**描述**: 获取当日禅理短句及背景图

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "zen_id": "zen_20260416",
    "date": "2026-04-16",
    "content": "应无所住而生其心",
    "source": "《金刚经》",
    "background_images": [
      "https://cdn.qingru.com/zen/bg_001.jpg",
      "https://cdn.qingru.com/zen/bg_002.jpg",
      "https://cdn.qingru.com/zen/bg_003.jpg"
    ],
    "default_background": "https://cdn.qingru.com/zen/bg_001.jpg",
    "category": "国学正念"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |

---

### 3.2 生成分享海报

**URL**: `POST /api/v1/zen/poster`

**描述**: 生成每日一禅分享海报

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "zen_id": "string",
  "background_index": 0,
  "custom_text": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| zen_id | string | 是 | 禅理 ID |
| background_index | number | 否 | 背景图索引，默认 0 |
| custom_text | string | 否 | 自定义文案 (注册用户可用) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "poster_id": "poster_xxxxx",
    "poster_url": "https://cdn.qingru.com/posters/poster_xxxxx.jpg",
    "width": 1080,
    "height": 1920,
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 (自定义文案时) |
| 5001 | 文案包含敏感词 |
| 5002 | 内容违规 |

---

### 3.3 获取物种列表

**URL**: `GET /api/v1/species/list`

**描述**: 获取科学护生物种列表，支持分类筛选和搜索

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "category": "string",
  "keyword": "string",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 分类：all|fish|bird|amphibian|reptile |
| keyword | string | 否 | 搜索关键词 (名称/学名/俗称) |
| page | number | 否 | 页码，默认 1 |
| page_size | number | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "species_id": "species_001",
        "name": "鲫鱼",
        "scientific_name": "Carassius auratus",
        "common_names": ["鲫鱼", "鲫瓜子"],
        "category": "fish",
        "protection_level": "无危",
        "is_releasable": true,
        "cover_url": "https://cdn.qingru.com/species/cover_001.jpg",
        "brief": "常见淡水鱼类，适应性强"
      },
      {
        "species_id": "species_002",
        "name": "巴西龟",
        "scientific_name": "Trachemys scripta elegans",
        "common_names": ["巴西龟", "红耳龟"],
        "category": "reptile",
        "protection_level": "入侵物种",
        "is_releasable": false,
        "cover_url": "https://cdn.qingru.com/species/cover_002.jpg",
        "brief": "外来入侵物种，严禁投放"
      }
    ],
    "total": 56,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |

---

### 3.4 获取物种详情

**URL**: `GET /api/v1/species/detail`

**描述**: 获取物种详细信息及合规投放要求

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "species_id": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| species_id | string | 是 | 物种 ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "species_id": "species_001",
    "name": "鲫鱼",
    "scientific_name": "Carassius auratus",
    "common_names": ["鲫鱼", "鲫瓜子"],
    "category": "fish",
    "protection_level": "无危",
    "is_releasable": true,
    "cover_url": "https://cdn.qingru.com/species/cover_001.jpg",
    "images": [
      "https://cdn.qingru.com/species/img_001_1.jpg",
      "https://cdn.qingru.com/species/img_001_2.jpg"
    ],
    "description": "鲫鱼是鲤科鲫属鱼类，原产于东亚，是中国常见的淡水食用鱼。",
    "cultural_meaning": "寓意年年有余，吉祥如意",
    "suitable_habitat": "湖泊、河流、池塘等淡水水域",
    "best_release_season": "春季 (3-5 月)、秋季 (9-11 月)",
    "release_requirements": [
      "选择无污染的自然水域",
      "避免在饮用水源地投放",
      "投放数量适中，避免过度密集",
      "使用本地原生种群"
    ],
    "warnings": [],
    "legal_basis": "《水生生物增殖放流管理规定》"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 3001 | 物种不存在 |

---

### 3.5 获取佛历吉日

**URL**: `GET /api/v1/calendar/lunar`

**描述**: 获取佛历日历、宜忌事项、当日禅理

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "year": 2026,
  "month": 4
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 否 | 年份，默认当前年 |
| month | number | 否 | 月份，默认当前月 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "year": 2026,
    "month": 4,
    "days": [
      {
        "date": "2026-04-16",
        "lunar_date": "三月十九",
        "ganzhi": "丙寅年 壬辰月 甲子日",
        "buddhist_date": "农历三月十九",
        "suitable": ["护生", "放生", "祈福", "打坐"],
        "avoid": ["杀生", "争吵"],
        "zen_content": "应无所住而生其心",
        "is_today": true,
        "has_checkin": false
      }
    ],
    "today_checkin_status": {
      "morning": false,
      "evening": false
    },
    "total_checkin_days": 15
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |

---

### 3.6 提交打卡记录

**URL**: `POST /api/v1/calendar/checkin`

**描述**: 提交晨起礼佛或晚间打坐打卡记录

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "date": "2026-04-16",
  "type": "morning|evening",
  "audio_id": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | string | 是 | 打卡日期 |
| type | string | 是 | 打卡类型：morning=晨起，evening=晚间 |
| audio_id | string | 否 | 关联的音频 ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "checkin_id": "checkin_xxxxx",
    "date": "2026-04-16",
    "type": "morning",
    "continuous_days": 15,
    "total_days": 28,
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 今日已打卡 |
| 401 | 未登录 |

---

### 3.7 获取打卡统计

**URL**: `GET /api/v1/calendar/statistics`

**描述**: 获取用户修行打卡统计数据

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total_checkin_days": 28,
    "continuous_days": 15,
    "max_continuous_days": 30,
    "morning_count": 18,
    "evening_count": 10,
    "current_month_days": 12,
    "checkin_calendar": [
      {
        "date": "2026-04-01",
        "morning": true,
        "evening": true
      },
      {
        "date": "2026-04-02",
        "morning": true,
        "evening": false
      }
    ]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

## 四、护生功德林接口

### 4.1 自主护生登记

**URL**: `POST /api/v1/protect-life/self-submit`

**描述**: 用户提交自主护生行动记录

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "protect_date": {
    "type": "string",
    "required": true,
    "format": "YYYY-MM-DD",
    "description": "护生日期"
  },
  "water_area": {
    "type": "string",
    "required": true,
    "max_length": 200,
    "description": "投放水域"
  },
  "species_id": {
    "type": "integer",
    "required": true,
    "min": 1,
    "description": "护生物种 ID"
  },
  "quantity": {
    "type": "integer",
    "required": true,
    "min": 1,
    "max": 10000,
    "description": "投放数量"
  },
  "photos": {
    "type": "array",
    "required": true,
    "min_items": 1,
    "max_items": 6,
    "description": "现场照片 URL 数组"
  },
  "wish_message": {
    "type": "string",
    "required": false,
    "max_length": 200,
    "description": "护生心愿"
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "record_id": 12345,
    "status": 1,
    "status_text": "待审核",
    "certificate_url": "https://.../certificate/12345.png",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 参数错误 |
| 401 | 未登录 |
| 403 | 无权限 |
| 500 | 服务器错误 |
| 1001 | 物种已禁止投放 |
| 1002 | 水域不在合规列表 |
| 1003 | 照片包含违规内容 |

---

### 4.2 获取护生列表

**URL**: `GET /api/v1/protection/list`

**描述**: 获取用户护生记录列表 (含自主登记和委托订单)

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "type": "all|self|order",
  "status": "string",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 类型：all=全部，self=自主登记，order=委托订单 |
| status | string | 否 | 状态筛选 |
| page | number | 否 | 页码，默认 1 |
| page_size | number | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "record_id": "record_xxxxx",
        "type": "self",
        "record_no": "QR-PROTECT-20260416-001234",
        "protection_date": "2026-04-16",
        "water_area": "xx 湖",
        "species_name": "鲫鱼",
        "quantity": 100,
        "status": "approved",
        "has_certificate": true,
        "created_at": 1713254400000
      },
      {
        "order_id": "order_xxxxx",
        "type": "order",
        "order_no": "QR-ORDER-20260416-005678",
        "protection_date": "2026-04-20",
        "water_area": "xx 江",
        "species_name": "鲤鱼",
        "quantity": 500,
        "status": "completed",
        "amount": 299.00,
        "has_certificate": true,
        "created_at": 1713254400000
      }
    ],
    "total": 12,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 4.3 获取护生详情

**URL**: `GET /api/v1/protection/detail`

**描述**: 获取护生记录或订单详情

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "record_id": "string",
  "type": "self|order"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| record_id | string | 是 | 记录 ID 或订单 ID |
| type | string | 是 | 类型：self=自主登记，order=委托订单 |

**响应示例** (自主登记):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "record_id": "record_xxxxx",
    "type": "self",
    "record_no": "QR-PROTECT-20260416-001234",
    "protection_date": "2026-04-16",
    "water_area": "xx 湖",
    "species_name": "鲫鱼",
    "species_scientific_name": "Carassius auratus",
    "quantity": 100,
    "photos": [
      "https://cdn.qingru.com/files/photo_1.jpg",
      "https://cdn.qingru.com/files/photo_2.jpg"
    ],
    "wish": "愿家人平安健康",
    "status": "approved",
    "audit_time": 1713340800000,
    "certificate": {
      "certificate_id": "cert_protect_xxxxx",
      "certificate_no": "QR-CERT-20260416-001234",
      "image_url": "https://cdn.qingru.com/certificates/cert_protect_xxxxx.jpg"
    },
    "created_at": 1713254400000
  }
}
```

**响应示例** (委托订单):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "type": "order",
    "order_no": "QR-ORDER-20260416-005678",
    "status": "completed",
    "user_info": {
      "user_id": "user_xxxxx",
      "nickname": "张三"
    },
    "institution_info": {
      "institution_id": "inst_xxxxx",
      "name": "xx 生态科技公司"
    },
    "protection_date": "2026-04-20",
    "water_area": "xx 江",
    "species_name": "鲤鱼",
    "species_spec": "10-15cm",
    "quantity": 500,
    "amount": 299.00,
    "service_items": ["现场执行", "执行反馈", "圆满证书"],
    "wish": "愿事业顺利",
    "execution_photos": [
      "https://cdn.qingru.com/files/exec_1.jpg",
      "https://cdn.qingru.com/files/exec_2.jpg"
    ],
    "execution_video": "https://cdn.qingru.com/files/exec_video.mp4",
    "feedback": "已完成投放，全程录像",
    "certificate": {
      "certificate_id": "cert_order_xxxxx",
      "certificate_no": "QR-CERT-20260420-005678",
      "image_url": "https://cdn.qingru.com/certificates/cert_order_xxxxx.jpg"
    },
    "payment_info": {
      "pay_time": 1713254400000,
      "pay_method": "wechat",
      "transaction_id": "xxxxxxxxxxxxxx"
    },
    "created_at": 1713254400000,
    "updated_at": 1713600000000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 401 | 未登录 |
| 403 | 无权限查看 |

---

### 4.4 创建委托订单

**URL**: `POST /api/v1/order/create`

**描述**: 创建委托护生服务订单 (付费)

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "protection_date": "2026-04-20",
  "water_area_id": "string",
  "species_id": "string",
  "species_spec": "string",
  "quantity": 500,
  "service_items": ["exec", "feedback", "certificate"],
  "wish": "string",
  "commitment_accepted": true,
  "agreement_accepted": true
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| protection_date | string | 是 | 护生执行日期 (未来 7-30 天) |
| water_area_id | string | 是 | 合规水域 ID |
| species_id | string | 是 | 物种 ID |
| species_spec | string | 是 | 物种规格 |
| quantity | number | 是 | 投放数量 |
| service_items | array | 是 | 服务项目：exec=执行，feedback=反馈，certificate=证书 |
| wish | string | 否 | 护生心愿 |
| commitment_accepted | boolean | 是 | 是否接受二次合规承诺 |
| agreement_accepted | boolean | 是 | 是否同意委托服务协议 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "order_no": "QR-ORDER-20260416-005678",
    "amount": 299.00,
    "status": "pending_payment",
    "expire_time": 1713255300000,
    "pay_params": {
      "appId": "wxXXXXXXXX",
      "timeStamp": "1713254400",
      "nonceStr": "xxxxxxxxxxxxxx",
      "package": "prepay_id=xxxxxxxxxxxxxx",
      "signType": "RSA",
      "paySign": "xxxxxxxxxxxxxx"
    }
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 3002 | 物种禁止投放 |
| 400 | 未接受合规承诺或协议 |
| 400 | 执行日期不在允许范围内 |
| 401 | 未登录 |
| 1002 | 用户未注册 |

---

### 4.5 获取订单列表

**URL**: `GET /api/v1/order/list`

**描述**: 获取用户委托订单列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "status": "string",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态筛选：pending|accepted|executing|confirming|completed|disputed|cancelled |
| page | number | 否 | 页码，默认 1 |
| page_size | number | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "order_id": "order_xxxxx",
        "order_no": "QR-ORDER-20260416-005678",
        "status": "completed",
        "status_text": "已完成",
        "protection_date": "2026-04-20",
        "water_area": "xx 江",
        "species_name": "鲤鱼",
        "quantity": 500,
        "amount": 299.00,
        "institution_name": "xx 生态科技公司",
        "has_certificate": true,
        "can_confirm": false,
        "can_dispute": false,
        "created_at": 1713254400000
      }
    ],
    "total": 5,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 4.6 获取订单详情

**URL**: `GET /api/v1/order/detail`

**描述**: 获取订单详细信息 (同 4.3 护生详情 order 类型)

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "order_id": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |

**响应示例**: 参考 4.3 委托订单详情

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 401 | 未登录 |
| 403 | 无权限查看 |

---

### 4.7 确认订单完成

**URL**: `POST /api/v1/order/confirm`

**描述**: 用户确认订单执行完成

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "order_id": "string",
  "satisfied": true,
  "feedback": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |
| satisfied | boolean | 是 | 是否满意 |
| feedback | string | 否 | 用户反馈 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "status": "completed",
    "certificate_generated": true,
    "certificate_id": "cert_order_xxxxx",
    "confirmed_at": 1713600000000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 4002 | 订单状态异常 (不可确认) |
| 401 | 未登录 |
| 403 | 无权限操作 |

---

### 4.8 提交订单异议

**URL**: `POST /api/v1/order/dispute`

**描述**: 用户对订单执行结果提出异议

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "order_id": "string",
  "reason": "string",
  "photos": ["file_xxxxx1"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |
| reason | string | 是 | 异议原因 |
| photos | array | 否 | 佐证照片 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "status": "disputed",
    "dispute_id": "dispute_xxxxx",
    "expected_reply_time": 1713772800000,
    "submitted_at": 1713600000000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 4002 | 订单状态异常 (不可异议) |
| 401 | 未登录 |
| 403 | 无权限操作 |

---

### 4.9 生成护生证书

**URL**: `POST /api/v1/protection/certificate`

**描述**: 生成护生圆满证书

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "record_id": "string",
  "type": "self|order"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| record_id | string | 是 | 记录 ID 或订单 ID |
| type | string | 是 | 类型：self=自主登记，order=委托订单 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "certificate_id": "cert_xxxxx",
    "certificate_no": "QR-CERT-20260416-001234",
    "title": "护生圆满证书",
    "content": "恭喜您完成科学护生行动",
    "image_url": "https://cdn.qingru.com/certificates/cert_xxxxx.jpg",
    "qr_code": "https://cdn.qingru.com/qr/cert_xxxxx.png",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 记录不存在 |
| 401 | 未登录 |

---

## 五、个人中心接口

### 5.1 获取用户信息

**URL**: `GET /api/v1/user/profile`

**描述**: 获取用户个人信息

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "user_xxxxx",
    "open_id": "oxXXXXXX",
    "union_id": "XXXXXXXX",
    "nickname": "张三",
    "avatar": "https://cdn.qingru.com/avatars/user_xxxxx.jpg",
    "phone": "138****1234",
    "role": "prayer",
    "signature": "积善成德，虚极静笃",
    "real_name_verified": false,
    "status": "active",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 5.2 更新用户信息

**URL**: `PUT /api/v1/user/profile`

**描述**: 更新用户个人信息 (昵称、签名)

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "nickname": "string",
  "signature": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| signature | string | 否 | 个性签名 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "user_xxxxx",
    "nickname": "张三",
    "signature": "积善成德，虚极静笃",
    "updated_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 5002 | 包含敏感词 |

---

### 5.3 获取修行数据

**URL**: `GET /api/v1/user/statistics`

**描述**: 获取用户修行数据统计

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total_audio_listen": 156,
    "total_protection_count": 12,
    "continuous_checkin_days": 15,
    "total_certificates": 28,
    "total_shares": 45,
    "audio_statistics": {
      "total_count": 156,
      "total_duration": 28800
    },
    "protection_statistics": {
      "self_count": 8,
      "order_count": 4
    },
    "checkin_statistics": {
      "total_days": 28,
      "continuous_days": 15,
      "morning_count": 18,
      "evening_count": 10
    }
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 5.4 获取证书列表

**URL**: `GET /api/v1/user/certificates`

**描述**: 获取用户证书列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "type": "all|protection|audio|checkin",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 类型筛选：all=全部，protection=护生，audio=收听，checkin=打卡 |
| page | number | 否 | 页码，默认 1 |
| page_size | number | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "certificate_id": "cert_xxxxx",
        "certificate_no": "QR-CERT-20260416-001234",
        "type": "protection",
        "title": "护生圆满证书",
        "content": "恭喜您完成科学护生行动",
        "image_url": "https://cdn.qingru.com/certificates/cert_xxxxx.jpg",
        "created_at": 1713254400000
      },
      {
        "certificate_id": "cert_audio_xxxxx",
        "certificate_no": "QR-AUDIO-20260415-001234",
        "type": "audio",
        "title": "梵音收听里程碑证书",
        "content": "恭喜您完成《心经》收听 100 次",
        "image_url": "https://cdn.qingru.com/certificates/cert_audio_xxxxx.jpg",
        "created_at": 1713168000000
      }
    ],
    "total": 28,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 5.5 获取台账列表

**URL**: `GET /api/v1/user/ledger`

**描述**: 获取用户台账列表 (护生记录汇总)

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "type": "all|self|order",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 类型：all=全部，self=自主登记，order=委托订单 |
| start_date | string | 否 | 开始日期 |
| end_date | string | 否 | 结束日期 |
| page | number | 否 | 页码，默认 1 |
| page_size | number | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summary": {
      "total_count": 12,
      "self_count": 8,
      "order_count": 4,
      "total_quantity": 2500,
      "total_amount": 1196.00
    },
    "list": [
      {
        "record_id": "record_xxxxx",
        "type": "self",
        "record_no": "QR-PROTECT-20260416-001234",
        "protection_date": "2026-04-16",
        "water_area": "xx 湖",
        "species_name": "鲫鱼",
        "quantity": 100,
        "status": "approved",
        "created_at": 1713254400000
      }
    ],
    "total": 12,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

**文档结束**
