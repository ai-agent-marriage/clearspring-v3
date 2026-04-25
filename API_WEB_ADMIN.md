# 清如小程序 V2.0 - WEB 管理后台 API 接口文档

**文档版本**: V1.0.0  
**创建日期**: 2026-04-16  
**适用端**: WEB 管理后台 (B 端)  

---

## 一、超级管理员接口

### 1.1 控制台首页

#### 1.1.1 获取核心数据大盘

**URL**: `GET /api/v1/admin/dashboard/overview`

**描述**: 获取平台核心运营数据

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
    "user_statistics": {
      "total_users": 15678,
      "daily_active": 1234,
      "monthly_active": 8901,
      "new_users_today": 156,
      "retention_7d": 0.65,
      "retention_30d": 0.42
    },
    "order_statistics": {
      "total_orders": 2345,
      "orders_today": 45,
      "completion_rate": 0.89,
      "total_amount": 567890.00,
      "platform_revenue": 85183.50,
      "average_order_value": 242.17
    },
    "compliance_statistics": {
      "content_audit_pass_rate": 0.96,
      "order_compliance_rate": 0.98,
      "violation_count": 12,
      "banned_accounts": 5
    },
    "update_time": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 (仅超级管理员) |

---

#### 1.1.2 获取待办事项

**URL**: `GET /api/v1/admin/dashboard/todos`

**描述**: 获取待办事项提醒

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
    "pending_institution_audit": 3,
    "pending_order_audit": 12,
    "pending_complaints": 5,
    "pending_settlements": 8,
    "pending_invoices": 15,
    "todos": [
      {
        "type": "institution_audit",
        "title": "待审核机构资质",
        "count": 3,
        "priority": "high",
        "url": "/admin/institutions/audit"
      },
      {
        "type": "order_audit",
        "title": "待审核订单",
        "count": 12,
        "priority": "medium",
        "url": "/admin/orders/audit"
      }
    ]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.1.3 获取运营数据趋势

**URL**: `GET /api/v1/admin/dashboard/trends`

**描述**: 获取运营数据趋势图

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "metric": "orders|revenue|users",
  "dimension": "day|week|month",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| metric | string | 是 | 指标类型：orders=订单量，revenue=营收，users=用户数 |
| dimension | string | 是 | 时间维度：day=日，week=周，month=月 |
| start_date | string | 是 | 开始日期 |
| end_date | string | 是 | 结束日期 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "metric": "orders",
    "dimension": "day",
    "data_points": [
      {
        "date": "2026-04-01",
        "value": 45,
        "amount": 10890.00
      },
      {
        "date": "2026-04-02",
        "value": 52,
        "amount": 12580.00
      }
    ]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

### 1.2 用户管理

#### 1.2.1 获取用户列表

**URL**: `GET /api/v1/admin/users`

**描述**: 获取祈福者用户列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "role": "prayer|volunteer|institution",
  "status": "active|banned",
  "real_name_verified": true,
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 (昵称/手机号) |
| role | string | 否 | 用户角色筛选 |
| status | string | 否 | 账号状态筛选 |
| real_name_verified | boolean | 否 | 实名认证状态 |
| start_date | string | 否 | 注册时间起始 |
| end_date | string | 否 | 注册时间截止 |
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
        "user_id": "user_xxxxx",
        "open_id": "oxXXXXXX",
        "nickname": "张三",
        "avatar": "https://cdn.qingru.com/avatars/user_xxxxx.jpg",
        "phone": "138****1234",
        "role": "prayer",
        "status": "active",
        "real_name_verified": false,
        "total_orders": 5,
        "total_amount": 1495.00,
        "created_at": 1713254400000
      }
    ],
    "total": 15678,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.2.2 获取用户详情

**URL**: `GET /api/v1/admin/users/:user_id`

**描述**: 获取用户详细信息

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无 (user_id 通过 URL 路径传递)

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
    "status": "active",
    "real_name_verified": false,
    "signature": "积善成德，虚极静笃",
    "statistics": {
      "total_audio_listen": 156,
      "total_protection_count": 12,
      "continuous_checkin_days": 15,
      "total_certificates": 28
    },
    "order_count": 5,
    "total_amount": 1495.00,
    "created_at": 1713254400000,
    "updated_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 用户不存在 |

---

#### 1.2.3 封禁/解封用户

**URL**: `POST /api/v1/admin/users/ban`

**描述**: 封禁或解封用户账号

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "user_id": "string",
  "action": "ban|unban",
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户 ID |
| action | string | 是 | 操作：ban=封禁，unban=解封 |
| reason | string | 是 | 操作原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "user_xxxxx",
    "status": "banned",
    "banned_at": 1713254400000,
    "banned_by": "admin_xxxxx",
    "reason": "多次提交违规内容"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 用户不存在 |

---

#### 1.2.4 获取志愿者列表

**URL**: `GET /api/v1/admin/volunteers`

**描述**: 获取公益志愿者列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "institution_id": "string",
  "status": "active|banned",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 (姓名/ID) |
| institution_id | string | 否 | 绑定机构 ID |
| status | string | 否 | 账号状态 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "volunteer_id": "vol_xxxxx",
        "user_id": "user_xxxxx",
        "name": "李四",
        "phone": "139****5678",
        "real_name_verified": true,
        "institution_id": "inst_xxxxx",
        "institution_name": "xx 生态科技公司",
        "status": "active",
        "total_tasks": 25,
        "compliance_rate": 0.98,
        "created_at": 1713254400000
      }
    ],
    "total": 345,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.2.5 获取机构列表

**URL**: `GET /api/v1/admin/institutions`

**描述**: 获取合规执行机构列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "audit_status": "pending|approved|rejected",
  "status": "active|banned",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 (机构名称/统一社会信用代码) |
| audit_status | string | 否 | 审核状态 |
| status | string | 否 | 账号状态 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "institution_id": "inst_xxxxx",
        "name": "xx 生态科技公司",
        "credit_code": "91330100MA2XXXXX",
        "legal_person": "王五",
        "contact_phone": "138****9999",
        "audit_status": "approved",
        "status": "active",
        "total_orders": 156,
        "created_at": 1713254400000
      }
    ],
    "total": 23,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.2.6 审核机构资质

**URL**: `POST /api/v1/admin/institutions/audit`

**描述**: 审核机构注册资质

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "institution_id": "string",
  "action": "approve|reject",
  "reason": "string",
  "authorized_waters": ["water_001", "water_002"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| institution_id | string | 是 | 机构 ID |
| action | string | 是 | 操作：approve=通过，reject=驳回 |
| reason | string | 否 | 驳回原因 (reject 时必填) |
| authorized_waters | array | 否 | 授权水域列表 (approve 时可选) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "institution_id": "inst_xxxxx",
    "audit_status": "approved",
    "audited_at": 1713254400000,
    "audited_by": "admin_xxxxx",
    "authorized_waters": ["water_001", "water_002"]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 机构不存在 |
| 6001 | 资质审核未通过 |

---

### 1.3 订单管理

#### 1.3.1 获取订单列表

**URL**: `GET /api/v1/admin/orders`

**描述**: 获取全平台委托订单列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "order_no": "string",
  "user_id": "string",
  "institution_id": "string",
  "status": "pending|accepted|executing|confirming|completed|disputed|cancelled",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "min_amount": 0,
  "max_amount": 10000,
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_no | string | 否 | 订单编号 |
| user_id | string | 否 | 用户 ID |
| institution_id | string | 否 | 机构 ID |
| status | string | 否 | 订单状态 |
| start_date | string | 否 | 下单时间起始 |
| end_date | string | 否 | 下单时间截止 |
| min_amount | number | 否 | 最小金额 |
| max_amount | number | 否 | 最大金额 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

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
        "user_info": {
          "user_id": "user_xxxxx",
          "nickname": "张三"
        },
        "institution_info": {
          "institution_id": "inst_xxxxx",
          "name": "xx 生态科技公司"
        },
        "status": "completed",
        "status_text": "已完成",
        "amount": 299.00,
        "protection_date": "2026-04-20",
        "water_area": "xx 江",
        "species_name": "鲤鱼",
        "quantity": 500,
        "created_at": 1713254400000,
        "updated_at": 1713600000000
      }
    ],
    "total": 2345,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.3.2 获取订单详情

**URL**: `GET /api/v1/admin/orders/:order_id`

**描述**: 获取订单完整详情

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**: 无 (order_id 通过 URL 路径传递)

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "order_no": "QR-ORDER-20260416-005678",
    "status": "completed",
    "user_info": {
      "user_id": "user_xxxxx",
      "nickname": "张三",
      "phone": "138****1234"
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
    "service_items": ["exec", "feedback", "certificate"],
    "wish": "愿事业顺利",
    "execution_materials": {
      "photos": ["https://cdn.qingru.com/files/exec_1.jpg"],
      "video": "https://cdn.qingru.com/files/exec_video.mp4",
      "feedback": "已完成投放，全程录像"
    },
    "payment_info": {
      "pay_time": 1713254400000,
      "pay_method": "wechat",
      "transaction_id": "xxxxxxxxxxxxxx"
    },
    "settlement_info": {
      "platform_fee": 44.85,
      "institution_amount": 254.15,
      "settlement_status": "pending",
      "settlement_time": null
    },
    "certificate_info": {
      "certificate_id": "cert_order_xxxxx",
      "certificate_no": "QR-CERT-20260420-005678"
    },
    "audit_log": [
      {
        "action": "created",
        "operator": "user_xxxxx",
        "time": 1713254400000
      },
      {
        "action": "accepted",
        "operator": "inst_xxxxx",
        "time": 1713340800000
      }
    ],
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
| 403 | 无权限 |

---

#### 1.3.3 审核订单

**URL**: `POST /api/v1/admin/orders/audit`

**描述**: 审核订单 (驳回违规订单)

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "order_id": "string",
  "action": "approve|reject",
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |
| action | string | 是 | 操作：approve=通过，reject=驳回 |
| reason | string | 否 | 驳回原因 (reject 时必填) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "audit_status": "rejected",
    "audited_at": 1713254400000,
    "audited_by": "admin_xxxxx",
    "reason": "投放物种为禁止投放的入侵物种",
    "refund_status": "processing"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.3.4 获取自主护生记录列表

**URL**: `GET /api/v1/admin/protection-records`

**描述**: 获取全平台自主护生记录列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "user_id": "string",
  "status": "pending_audit|approved|rejected",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 否 | 用户 ID |
| status | string | 否 | 审核状态 |
| start_date | string | 否 | 日期起始 |
| end_date | string | 否 | 日期截止 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "record_id": "record_xxxxx",
        "record_no": "QR-PROTECT-20260416-001234",
        "user_info": {
          "user_id": "user_xxxxx",
          "nickname": "张三"
        },
        "protection_date": "2026-04-16",
        "water_area": "xx 湖",
        "species_name": "鲫鱼",
        "quantity": 100,
        "photos": ["https://cdn.qingru.com/files/photo_1.jpg"],
        "status": "approved",
        "created_at": 1713254400000
      }
    ],
    "total": 5678,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

### 1.4 内容管理

#### 1.4.1 管理禅理内容

**URL**: `GET /api/v1/admin/zen`

**描述**: 获取禅理内容列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "category": "string",
  "status": "active|inactive",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 分类 |
| status | string | 否 | 上下架状态 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "zen_id": "zen_001",
        "content": "应无所住而生其心",
        "source": "《金刚经》",
        "category": "国学正念",
        "status": "active",
        "is_daily": true,
        "daily_date": "2026-04-16",
        "created_at": 1713254400000
      }
    ],
    "total": 356,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/zen`

**描述**: 新增禅理内容

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "content": "string",
  "source": "string",
  "category": "string",
  "background_images": ["url1", "url2"],
  "is_daily": false,
  "daily_date": "2026-04-17"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 禅理内容 |
| source | string | 否 | 出处 |
| category | string | 是 | 分类 |
| background_images | array | 否 | 背景图 URL 列表 |
| is_daily | boolean | 否 | 是否设为每日一禅 |
| daily_date | string | 否 | 每日一禅日期 (is_daily=true 时必填) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "zen_id": "zen_357",
    "content": "应无所住而生其心",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.4.2 管理物种库

**URL**: `GET /api/v1/admin/species`

**描述**: 获取物种库列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "category": "fish|bird|amphibian|reptile",
  "is_releasable": true,
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 分类 |
| is_releasable | boolean | 否 | 是否可投放 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

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
        "category": "fish",
        "is_releasable": true,
        "protection_level": "无危",
        "status": "active",
        "created_at": 1713254400000
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
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/species`

**描述**: 新增物种信息

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "name": "string",
  "scientific_name": "string",
  "common_names": ["鲫鱼", "鲫瓜子"],
  "category": "fish",
  "is_releasable": true,
  "protection_level": "无危",
  "description": "string",
  "cultural_meaning": "string",
  "suitable_habitat": "string",
  "best_release_season": "string",
  "release_requirements": [],
  "warnings": [],
  "cover_url": "string",
  "images": []
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 物种名称 |
| scientific_name | string | 是 | 学名 |
| common_names | array | 否 | 俗称列表 |
| category | string | 是 | 分类 |
| is_releasable | boolean | 是 | 是否可投放 |
| protection_level | string | 是 | 保护级别 |
| description | string | 是 | 描述 |
| cultural_meaning | string | 否 | 文化寓意 |
| suitable_habitat | string | 是 | 适宜生境 |
| best_release_season | string | 是 | 最佳投放时机 |
| release_requirements | array | 是 | 投放要求 |
| warnings | array | 否 | 特别提醒 |
| cover_url | string | 是 | 封面图 URL |
| images | array | 否 | 图片 URL 列表 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "species_id": "species_057",
    "name": "鲫鱼",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.4.3 管理合规水域

**URL**: `GET /api/v1/admin/waters`

**描述**: 获取合规水域列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "status": "active|inactive",
  "institution_id": "string",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 开放状态 |
| institution_id | string | 否 | 合作机构 ID |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "water_id": "water_001",
        "name": "xx 湖",
        "location": "xx 省 xx 市",
        "type": "湖泊",
        "status": "active",
        "authorized_institutions": [
          {
            "institution_id": "inst_xxxxx",
            "name": "xx 生态科技公司"
          }
        ],
        "requirements": "禁止在饮用水源地投放",
        "created_at": 1713254400000
      }
    ],
    "total": 23,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/waters`

**描述**: 新增合规水域

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "name": "string",
  "location": "string",
  "type": "湖泊 | 河流 | 池塘",
  "status": "active",
  "authorized_institutions": ["inst_xxxxx"],
  "requirements": "string",
  "latitude": 30.123456,
  "longitude": 120.123456
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 水域名称 |
| location | string | 是 | 地理位置 |
| type | string | 是 | 水域类型 |
| status | string | 是 | 开放状态 |
| authorized_institutions | array | 是 | 授权机构 ID 列表 |
| requirements | string | 是 | 投放要求 |
| latitude | number | 否 | 纬度 |
| longitude | number | 否 | 经度 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "water_id": "water_024",
    "name": "xx 湖",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.4.4 内容审核

**URL**: `GET /api/v1/admin/content/audit-queue`

**描述**: 获取待审核内容列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "type": "photo|text|wish",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 内容类型 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "audit_id": "audit_xxxxx",
        "type": "photo",
        "content_url": "https://cdn.qingru.com/files/photo_xxxxx.jpg",
        "user_info": {
          "user_id": "user_xxxxx",
          "nickname": "张三"
        },
        "scene": "protection",
        "auto_audit_result": "pending",
        "created_at": 1713254400000
      }
    ],
    "total": 45,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/content/audit`

**描述**: 审核内容

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "audit_id": "string",
  "action": "approve|reject",
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| audit_id | string | 是 | 审核 ID |
| action | string | 是 | 操作：approve=通过，reject=驳回 |
| reason | string | 否 | 驳回原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "audit_id": "audit_xxxxx",
    "audit_result": "approved",
    "audited_at": 1713254400000,
    "audited_by": "admin_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.4.5 敏感词管理

**URL**: `GET /api/v1/admin/sensitive-words`

**描述**: 获取敏感词列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "category": "string",
  "page": 1,
  "page_size": 100
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 分类 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "word_id": "word_001",
        "word": "敏感词示例",
        "category": "政治",
        "level": "high",
        "status": "active",
        "created_at": 1713254400000
      }
    ],
    "total": 567,
    "page": 1,
    "page_size": 100
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/sensitive-words`

**描述**: 新增敏感词

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "word": "string",
  "category": "string",
  "level": "high|medium|low"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| word | string | 是 | 敏感词 |
| category | string | 是 | 分类 |
| level | string | 是 | 级别 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "word_id": "word_568",
    "word": "敏感词示例",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

### 1.5 财务管理

#### 1.5.1 订单对账

**URL**: `GET /api/v1/admin/finance/reconciliation`

**描述**: 获取订单对账列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "order_no": "string",
  "transaction_id": "string",
  "reconciliation_status": "success|failed|pending",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_no | string | 否 | 订单编号 |
| transaction_id | string | 否 | 微信支付流水号 |
| reconciliation_status | string | 否 | 对账状态 |
| start_date | string | 否 | 支付时间起始 |
| end_date | string | 否 | 支付时间截止 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "reconciliation_id": "recon_xxxxx",
        "order_no": "QR-ORDER-20260416-005678",
        "transaction_id": "xxxxxxxxxxxxxx",
        "amount": 299.00,
        "pay_time": 1713254400000,
        "reconciliation_status": "success",
        "reconciliation_time": 1713255400000,
        "created_at": 1713254400000
      }
    ],
    "total": 2345,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.5.2 获取结算列表

**URL**: `GET /api/v1/admin/finance/settlement`

**描述**: 获取结算管理列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "institution_id": "string",
  "settlement_status": "pending|completed",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| institution_id | string | 否 | 机构 ID |
| settlement_status | string | 否 | 结算状态 |
| start_date | string | 否 | 日期起始 |
| end_date | string | 否 | 日期截止 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "settlement_id": "settle_xxxxx",
        "settlement_no": "QR-SETTLE-20260416-001234",
        "institution_info": {
          "institution_id": "inst_xxxxx",
          "name": "xx 生态科技公司"
        },
        "order_count": 15,
        "total_amount": 4485.00,
        "platform_fee": 672.75,
        "settlement_amount": 3812.25,
        "settlement_status": "pending",
        "invoice_status": "pending",
        "created_at": 1713254400000
      }
    ],
    "total": 45,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/finance/settlement`

**描述**: 执行结算操作

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "settlement_id": "string",
  "action": "settle",
  "transfer_proof": "string",
  "remark": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| settlement_id | string | 是 | 结算 ID |
| action | string | 是 | 操作：settle=结算 |
| transfer_proof | string | 是 | 转账凭证 URL |
| remark | string | 否 | 备注 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "settlement_id": "settle_xxxxx",
    "settlement_status": "completed",
    "settled_at": 1713254400000,
    "settled_by": "admin_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.5.3 获取财务报表

**URL**: `GET /api/v1/admin/finance/report`

**描述**: 获取财务报表数据

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "report_type": "revenue|settlement|order",
  "dimension": "day|week|month|year",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| report_type | string | 是 | 报表类型：revenue=营收，settlement=结算，order=订单 |
| dimension | string | 是 | 时间维度 |
| start_date | string | 是 | 开始日期 |
| end_date | string | 是 | 结束日期 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "report_type": "revenue",
    "dimension": "day",
    "summary": {
      "total_revenue": 85183.50,
      "total_orders": 2345,
      "average_order_value": 242.17
    },
    "data_points": [
      {
        "date": "2026-04-01",
        "revenue": 5678.90,
        "order_count": 45
      },
      {
        "date": "2026-04-02",
        "revenue": 6234.50,
        "order_count": 52
      }
    ]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.5.4 发票管理

**URL**: `GET /api/v1/admin/finance/invoices`

**描述**: 获取发票管理列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "type": "institution|user",
  "status": "pending|approved|rejected|mailed",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 发票类型：institution=机构，user=用户 |
| status | string | 否 | 发票状态 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "invoice_id": "invoice_xxxxx",
        "type": "institution",
        "institution_info": {
          "institution_id": "inst_xxxxx",
          "name": "xx 生态科技公司"
        },
        "amount": 3812.25,
        "invoice_title": "xx 生态科技公司",
        "tax_number": "91330100MA2XXXXX",
        "status": "pending",
        "created_at": 1713254400000
      }
    ],
    "total": 67,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `POST /api/v1/admin/finance/invoices/audit`

**描述**: 审核发票

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "invoice_id": "string",
  "action": "approve|reject",
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| invoice_id | string | 是 | 发票 ID |
| action | string | 是 | 操作：approve=通过，reject=驳回 |
| reason | string | 否 | 驳回原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "invoice_id": "invoice_xxxxx",
    "audit_status": "approved",
    "audited_at": 1713254400000,
    "audited_by": "admin_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

### 1.6 系统设置

#### 1.6.1 获取系统配置

**URL**: `GET /api/v1/admin/configs`

**描述**: 获取系统配置列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "category": "basic|payment|notification"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 配置分类 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "configs": [
      {
        "config_key": "app_name",
        "config_value": "清如",
        "category": "basic",
        "description": "小程序名称"
      },
      {
        "config_key": "platform_fee_rate",
        "config_value": "0.15",
        "category": "payment",
        "description": "平台服务费比例"
      }
    ]
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**URL**: `PUT /api/v1/admin/configs`

**描述**: 更新系统配置

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "config_key": "string",
  "config_value": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| config_key | string | 是 | 配置键 |
| config_value | string | 是 | 配置值 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "config_key": "platform_fee_rate",
    "config_value": "0.15",
    "updated_at": 1713254400000,
    "updated_by": "admin_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.6.2 获取操作日志

**URL**: `GET /api/v1/admin/logs/operations`

**描述**: 获取后台操作日志

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "admin_id": "string",
  "action": "string",
  "module": "string",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| admin_id | string | 否 | 操作人 ID |
| action | string | 否 | 操作类型 |
| module | string | 否 | 模块 |
| start_date | string | 否 | 时间起始 |
| end_date | string | 否 | 时间截止 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "log_id": "log_xxxxx",
        "admin_id": "admin_xxxxx",
        "admin_name": "管理员 A",
        "action": "audit_order",
        "module": "order",
        "target_id": "order_xxxxx",
        "result": "success",
        "ip_address": "192.168.1.100",
        "created_at": 1713254400000
      }
    ],
    "total": 5678,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 1.6.3 用户操作日志查询

##### 查询用户操作日志列表

**URL**: `GET /api/v1/admin/logs`

**描述**: 查询用户操作日志列表（PRD 要求操作日志留痕）

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "user_id": {
    "type": "integer",
    "required": false,
    "description": "用户 ID"
  },
  "action": {
    "type": "string",
    "required": false,
    "description": "操作类型"
  },
  "start_time": {
    "type": "string",
    "required": false,
    "format": "YYYY-MM-DD HH:mm:ss",
    "description": "开始时间"
  },
  "end_time": {
    "type": "string",
    "required": false,
    "format": "YYYY-MM-DD HH:mm:ss",
    "description": "结束时间"
  },
  "page": {
    "type": "integer",
    "required": false,
    "default": 1,
    "description": "页码"
  },
  "page_size": {
    "type": "integer",
    "required": false,
    "default": 20,
    "max": 100,
    "description": "每页数量"
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": 1,
        "user_id": 123,
        "action": "protect_life_submit",
        "module": "护生功德林",
        "request_params": "{\"species_id\":1,\"quantity\":10}",
        "response_code": 200,
        "ip_address": "192.168.1.100",
        "create_time": "2026-04-16 10:00:00"
      }
    ],
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

##### 导出操作日志

**URL**: `POST /api/v1/admin/logs/export`

**描述**: 导出操作日志为 Excel 文件

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "start_time": {
    "type": "string",
    "required": true,
    "format": "YYYY-MM-DD HH:mm:ss"
  },
  "end_time": {
    "type": "string",
    "required": true,
    "format": "YYYY-MM-DD HH:mm:ss"
  },
  "action": {
    "type": "string",
    "required": false,
    "description": "操作类型（可选）"
  }
}
```

**响应**:
- Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Content-Disposition: attachment; filename="logs_20260416.xlsx"

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 400 | 时间范围格式错误 |

---

## 二、机构管理员接口

### 2.1 控制台首页

#### 2.1.1 获取机构数据大盘

**URL**: `GET /api/v1/institution/dashboard`

**描述**: 获取机构核心数据

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
    "order_statistics": {
      "pending_accept": 5,
      "pending_execute": 8,
      "pending_confirm": 3,
      "completed_total": 156
    },
    "volunteer_statistics": {
      "total_volunteers": 25,
      "active_volunteers": 18
    },
    "settlement_statistics": {
      "pending_settlement": 3812.25,
      "settled_total": 45678.90
    },
    "update_time": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 (仅机构管理员) |

---

### 2.2 订单管理

#### 2.2.1 获取订单列表

**URL**: `GET /api/v1/institution/orders`

**描述**: 获取本机构订单列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "status": "pending|accepted|executing|confirming|completed|disputed|cancelled",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 订单状态 |
| start_date | string | 否 | 日期起始 |
| end_date | string | 否 | 日期截止 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

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
        "user_info": {
          "user_id": "user_xxxxx",
          "nickname": "张三"
        },
        "status": "pending_accept",
        "status_text": "待承接",
        "amount": 299.00,
        "protection_date": "2026-04-20",
        "water_area": "xx 江",
        "species_name": "鲤鱼",
        "quantity": 500,
        "created_at": 1713254400000
      }
    ],
    "total": 156,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 2.2.2 承接订单

**URL**: `POST /api/v1/institution/orders/accept`

**描述**: 机构承接订单

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
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

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_id": "order_xxxxx",
    "status": "accepted",
    "accepted_at": 1713254400000,
    "accepted_by": "inst_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 4002 | 订单状态异常 |
| 401 | 未登录 |
| 403 | 无权限 |
| 6002 | 机构无权限承接 (跨水域) |

---

#### 2.2.3 分配执行任务

**URL**: `POST /api/v1/institution/tasks/assign`

**描述**: 分配执行任务给志愿者

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "order_id": "string",
  "volunteer_id": "string",
  "execution_date": "2026-04-20",
  "remark": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |
| volunteer_id | string | 是 | 志愿者 ID |
| execution_date | string | 是 | 执行日期 |
| remark | string | 否 | 备注 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "task_id": "task_xxxxx",
    "order_id": "order_xxxxx",
    "volunteer_id": "vol_xxxxx",
    "status": "pending_execute",
    "assigned_at": 1713254400000,
    "assigned_by": "inst_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 订单不存在 |
| 4002 | 订单状态异常 |
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 2.2.4 审核执行材料

**URL**: `POST /api/v1/institution/tasks/audit`

**描述**: 审核志愿者提交的执行材料

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "task_id": "string",
  "action": "approve|reject",
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| task_id | string | 是 | 任务 ID |
| action | string | 是 | 操作：approve=通过，reject=驳回 |
| reason | string | 否 | 驳回原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "task_id": "task_xxxxx",
    "audit_status": "approved",
    "audited_at": 1713254400000,
    "audited_by": "inst_xxxxx"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 4001 | 任务不存在 |
| 401 | 未登录 |
| 403 | 无权限 |

---

### 2.3 志愿者管理

#### 2.3.1 获取志愿者列表

**URL**: `GET /api/v1/institution/volunteers`

**描述**: 获取本机构志愿者列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "status": "active|banned",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 账号状态 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "volunteer_id": "vol_xxxxx",
        "user_id": "user_xxxxx",
        "name": "李四",
        "phone": "139****5678",
        "real_name_verified": true,
        "status": "active",
        "total_tasks": 25,
        "compliance_rate": 0.98,
        "bound_at": 1713254400000
      }
    ],
    "total": 25,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 2.3.2 绑定志愿者

**URL**: `POST /api/v1/institution/volunteers/bind`

**描述**: 绑定志愿者到机构

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "volunteer_id": "string",
  "action": "bind|unbind"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| volunteer_id | string | 是 | 志愿者 ID |
| action | string | 是 | 操作：bind=绑定，unbind=解绑 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "volunteer_id": "vol_xxxxx",
    "institution_id": "inst_xxxxx",
    "bound_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

### 2.4 结算管理

#### 2.4.1 获取结算列表

**URL**: `GET /api/v1/institution/settlements`

**描述**: 获取本机构结算列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "status": "pending|completed",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 结算状态 |
| start_date | string | 否 | 日期起始 |
| end_date | string | 否 | 日期截止 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "settlement_id": "settle_xxxxx",
        "settlement_no": "QR-SETTLE-20260416-001234",
        "order_count": 15,
        "total_amount": 4485.00,
        "platform_fee": 672.75,
        "settlement_amount": 3812.25,
        "settlement_status": "pending",
        "invoice_status": "pending",
        "created_at": 1713254400000
      }
    ],
    "total": 45,
    "page": 1,
    "page_size": 20
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

#### 2.4.2 提交发票信息

**URL**: `POST /api/v1/institution/invoices`

**描述**: 提交发票信息

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "settlement_id": "string",
  "invoice_title": "string",
  "tax_number": "string",
  "invoice_amount": 3812.25,
  "invoice_images": ["url1", "url2"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| settlement_id | string | 是 | 结算 ID |
| invoice_title | string | 是 | 发票抬头 |
| tax_number | string | 是 | 税号 |
| invoice_amount | number | 是 | 发票金额 |
| invoice_images | array | 是 | 发票图片 URL 列表 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "invoice_id": "invoice_xxxxx",
    "status": "pending",
    "submitted_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |

---

**文档结束**
