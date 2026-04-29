# 清如小程序 V2.0 - 认证与权限 API 接口文档

**文档版本**: V1.0.0  
**创建日期**: 2026-04-16  
**适用范围**: 小程序端 + WEB 管理后台  

---

## 一、小程序端认证接口

### 1.1 微信登录授权

**URL**: `POST /api/v1/auth/wechat`

**描述**: 微信小程序登录，通过微信授权 code 换取用户身份

**请求头**:
```http
Content-Type: application/json
```

**请求参数**:
```json
{
  "code": "string",
  "encrypted_data": "string",
  "iv": "string",
  "raw_data": "string",
  "signature": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 微信登录凭证 code (wx.login 获取) |
| encrypted_data | string | 否 | 用户数据加密数据 (获取手机号时需要) |
| iv | string | 否 | 加密算法的初始向量 (获取手机号时需要) |
| raw_data | string | 否 | 用户信息原始数据 |
| signature | string | 否 | 签名 (raw_data 的签名) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.yyyyy",
    "expires_in": 7200,
    "user_info": {
      "user_id": "user_xxxxx",
      "open_id": "oxXXXXXX",
      "union_id": "XXXXXXXX",
      "nickname": "张三",
      "avatar": "https://cdn.qingru.com/avatars/user_xxxxx.jpg",
      "phone": "",
      "role": "prayer",
      "is_registered": false,
      "is_real_name_verified": false
    },
    "is_new_user": true
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 1001 | 微信授权失败 |
| 1001 | code 无效或已过期 |
| 500 | 微信服务器异常 |

**业务说明**:
1. 用户首次登录时，自动创建用户记录，`is_registered=false`
2. 返回的 token 用于后续接口鉴权，有效期 2 小时
3. refresh_token 用于刷新 token，有效期 30 天
4. 未注册用户可使用基础功能，部分功能需注册后使用

---

### 1.2 用户信息同步

**URL**: `POST /api/v1/auth/sync`

**描述**: 同步用户信息 (昵称、头像等)

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "nickname": "string",
  "avatar": "string",
  "gender": 1,
  "language": "zh_CN",
  "city": "杭州",
  "province": "浙江",
  "country": "中国"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像 URL |
| gender | number | 否 | 性别：0=未知，1=男，2=女 |
| language | string | 否 | 语言 |
| city | string | 否 | 城市 |
| province | string | 否 | 省份 |
| country | string | 否 | 国家 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "user_xxxxx",
    "nickname": "张三",
    "avatar": "https://cdn.qingru.com/avatars/user_xxxxx.jpg",
    "is_registered": true,
    "updated_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 5002 | 昵称包含敏感词 |

**业务说明**:
1. 调用此接口后，`is_registered` 状态变为 `true`
2. 用户信息同步后，解锁全量功能
3. 敏感词检测自动拦截违规昵称

---

### 1.3 获取手机号

**URL**: `POST /api/v1/auth/phone`

**描述**: 获取用户绑定手机号 (需用户主动触发授权)

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "code": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 微信获取手机头的 code (button open-type=getPhoneNumber) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "phone": "138****1234",
    "pure_phone": "13812341234",
    "bound_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 1001 | 微信授权失败 |

**业务说明**:
1. 手机号用于实名认证、订单联系等场景
2. 返回的 phone 为脱敏后的手机号
3. pure_phone 仅后台可见，前端不可获取

---

### 1.4 Token 刷新

**URL**: `POST /api/v1/auth/refresh`

**描述**: 使用 refresh_token 刷新访问 token

**请求头**:
```http
Content-Type: application/json
```

**请求参数**:
```json
{
  "refresh_token": {
    "type": "string",
    "required": true,
    "description": "Refresh Token（从 Cookie 自动读取）"
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200,
    "token_type": "Bearer"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | Refresh Token 无效或过期 |
| 403 | 用户已被封禁 |

**业务说明**:

#### Token 说明

**Access Token**:
- 有效期：2 小时
- 用途：API 请求鉴权
- 存储：客户端内存

**Refresh Token**:
- 有效期：7 天
- 用途：刷新 Access Token
- 存储：HttpOnly Cookie

#### 刷新流程

```
1. 客户端请求 API
2. 服务端返回 401（Token 过期）
3. 客户端调用刷新接口 POST /api/v1/auth/refresh
4. 服务端验证 Refresh Token
5. 返回新的 Access Token
6. 客户端重试原请求
```

#### Token 刷新策略

1. **自动刷新**: access_token 过期前 10 分钟自动刷新
2. **被动刷新**: access_token 过期后，收到 401 错误时调用刷新接口
3. **刷新失败**: refresh_token 过期或无效时，提示用户重新登录

---

### 1.5 退出登录

**URL**: `POST /api/v1/auth/logout`

**描述**: 用户退出登录，使 token 失效

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
    "logout_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 (即使 token 无效也返回成功) |

**业务说明**:
1. 退出登录后，token 加入黑名单，无法继续使用
2. 用户可重新登录获取新 token

---

### 1.6 账号注销

**URL**: `POST /api/v1/auth/cancel`

**描述**: 用户申请注销账号

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "confirm": true,
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| confirm | boolean | 是 | 确认注销 (必须为 true) |
| reason | string | 否 | 注销原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "user_xxxxx",
    "cancel_status": "pending",
    "cancel_time": 1713254400000,
    "grace_period_days": 7
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 400 | 存在未完成订单，无法注销 |

**业务说明**:
1. 账号注销有 7 天冷静期，期间可撤销注销申请
2. 冷静期后，用户数据永久删除，不可恢复
3. 存在未完成订单、待结算等情况下无法注销
4. 符合微信小程序账号注销规范

---

## 二、WEB 管理后台认证接口

### 2.1 管理员登录

**URL**: `POST /api/v1/admin/auth/login`

**描述**: WEB 管理后台管理员登录

**请求头**:
```http
Content-Type: application/json
```

**请求参数**:
```json
{
  "username": "string",
  "password": "string",
  "captcha": "string",
  "captcha_key": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 管理员账号 (用户名/手机号/邮箱) |
| password | string | 是 | 密码 (SHA-256 加密) |
| captcha | string | 是 | 验证码 |
| captcha_key | string | 是 | 验证码密钥 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_xxxxx",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_yyyyy",
    "expires_in": 28800,
    "admin_info": {
      "admin_id": "admin_xxxxx",
      "username": "admin",
      "name": "管理员 A",
      "role": "super_admin",
      "permissions": ["user_manage", "order_manage", "content_manage", "finance_manage", "system_config"],
      "last_login_at": 1713254400000,
      "last_login_ip": "192.168.1.100"
    }
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 验证码错误 |
| 401 | 账号或密码错误 |
| 403 | 账号已被禁用 |

**业务说明**:
1. 密码前端 SHA-256 加密后传输
2. token 有效期 8 小时
3. 登录失败 5 次后账号锁定 30 分钟
4. 登录 IP 记录到操作日志

---

### 2.2 获取验证码

**URL**: `GET /api/v1/admin/auth/captcha`

**描述**: 获取登录验证码

**请求头**: 无

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "captcha_key": "captcha_xxxxx",
    "captcha_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "expires_in": 300
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |

**业务说明**:
1. 验证码有效期 5 分钟
2. 每次请求生成新的验证码
3. 验证码使用一次即失效

---

### 2.3 管理员信息

**URL**: `GET /api/v1/admin/auth/info`

**描述**: 获取当前登录管理员信息

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
    "admin_id": "admin_xxxxx",
    "username": "admin",
    "name": "管理员 A",
    "role": "super_admin",
    "permissions": ["user_manage", "order_manage", "content_manage", "finance_manage", "system_config"],
    "avatar": "https://cdn.qingru.com/admins/admin_xxxxx.jpg",
    "email": "admin@qingru.com",
    "phone": "138****0000",
    "created_at": 1713254400000,
    "last_login_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |

---

### 2.4 修改密码

**URL**: `PUT /api/v1/admin/auth/password`

**描述**: 修改管理员密码

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "old_password": "string",
  "new_password": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| old_password | string | 是 | 原密码 (SHA-256 加密) |
| new_password | string | 是 | 新密码 (SHA-256 加密) |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "updated_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 400 | 原密码错误 |
| 400 | 新密码强度不足 (需包含大小写字母 + 数字，8 位以上) |

**业务说明**:
1. 密码修改后，所有已登录设备需重新登录
2. 密码修改记录到操作日志

---

### 2.5 退出登录

**URL**: `POST /api/v1/admin/auth/logout`

**描述**: 管理员退出登录

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
    "logout_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 (即使 token 无效也返回成功) |

---

## 三、权限控制接口

### 3.1 获取权限列表

**URL**: `GET /api/v1/admin/permissions`

**描述**: 获取系统所有权限定义

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
    "permissions": [
      {
        "permission_id": "perm_001",
        "name": "user_manage",
        "label": "用户管理",
        "module": "user",
        "actions": ["view", "create", "edit", "delete", "ban"]
      },
      {
        "permission_id": "perm_002",
        "name": "order_manage",
        "label": "订单管理",
        "module": "order",
        "actions": ["view", "audit", "cancel"]
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

### 3.2 获取角色列表

**URL**: `GET /api/v1/admin/roles`

**描述**: 获取后台角色列表

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
    "roles": [
      {
        "role_id": "role_001",
        "name": "super_admin",
        "label": "超级管理员",
        "permissions": ["all"],
        "description": "拥有所有权限",
        "created_at": 1713254400000
      },
      {
        "role_id": "role_002",
        "name": "content_admin",
        "label": "内容运营专员",
        "permissions": ["content_manage", "content_audit"],
        "description": "负责内容管理与审核",
        "created_at": 1713254400000
      },
      {
        "role_id": "role_003",
        "name": "compliance_admin",
        "label": "合规审核专员",
        "permissions": ["user_audit", "order_audit", "content_audit"],
        "description": "负责合规审核",
        "created_at": 1713254400000
      },
      {
        "role_id": "role_004",
        "name": "finance_admin",
        "label": "财务专员",
        "permissions": ["finance_reconciliation", "finance_settlement", "finance_invoice"],
        "description": "负责财务管理",
        "created_at": 1713254400000
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

### 3.3 创建角色

**URL**: `POST /api/v1/admin/roles`

**描述**: 创建后台角色

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "name": "string",
  "label": "string",
  "permissions": ["user_manage", "order_manage"],
  "description": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 角色英文名 |
| label | string | 是 | 角色中文名 |
| permissions | array | 是 | 权限列表 |
| description | string | 是 | 角色描述 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "role_id": "role_005",
    "name": "operation_admin",
    "label": "运营专员",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 400 | 角色名已存在 |

---

### 3.4 创建管理员

**URL**: `POST /api/v1/admin/accounts`

**描述**: 创建后台管理员账号

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "username": "string",
  "password": "string",
  "name": "string",
  "role_id": "string",
  "email": "string",
  "phone": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 登录账号 |
| password | string | 是 | 密码 (SHA-256 加密) |
| name | string | 是 | 管理员姓名 |
| role_id | string | 是 | 角色 ID |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 手机号 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "admin_id": "admin_xxxxx",
    "username": "new_admin",
    "name": "管理员 B",
    "role_id": "role_002",
    "created_at": 1713254400000
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 400 | 用户名已存在 |

---

### 3.5 获取管理员列表

**URL**: `GET /api/v1/admin/accounts`

**描述**: 获取后台管理员列表

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",
  "role_id": "string",
  "status": "active|disabled",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| role_id | string | 否 | 角色 ID |
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
        "admin_id": "admin_xxxxx",
        "username": "admin",
        "name": "管理员 A",
        "role_info": {
          "role_id": "role_001",
          "name": "super_admin",
          "label": "超级管理员"
        },
        "status": "active",
        "email": "admin@qingru.com",
        "phone": "138****0000",
        "last_login_at": 1713254400000,
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
| 403 | 无权限 |

---

### 3.6 禁用/启用管理员

**URL**: `POST /api/v1/admin/accounts/status`

**描述**: 禁用或启用管理员账号

**请求头**:
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:
```json
{
  "admin_id": "string",
  "action": "disable|enable",
  "reason": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| admin_id | string | 是 | 管理员 ID |
| action | string | 是 | 操作：disable=禁用，enable=启用 |
| reason | string | 否 | 操作原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "admin_id": "admin_xxxxx",
    "status": "disabled",
    "updated_at": 1713254400000,
    "updated_by": "admin_yyyyy"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 管理员不存在 |

---

## 四、安全相关接口

### 4.1 获取登录日志

**URL**: `GET /api/v1/admin/logs/logins`

**描述**: 获取后台登录日志

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "admin_id": "string",
  "status": "success|failed",
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| admin_id | string | 否 | 管理员 ID |
| status | string | 否 | 登录状态 |
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
        "log_id": "login_log_xxxxx",
        "admin_id": "admin_xxxxx",
        "admin_name": "管理员 A",
        "login_ip": "192.168.1.100",
        "login_location": "浙江省杭州市",
        "user_agent": "Mozilla/5.0...",
        "login_status": "success",
        "created_at": 1713254400000
      }
    ],
    "total": 567,
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

### 4.2 获取接口调用日志

**URL**: `GET /api/v1/admin/logs/api`

**描述**: 获取 API 接口调用日志

**请求头**:
```http
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "endpoint": "string",
  "method": "GET|POST|PUT|DELETE",
  "status_code": 200,
  "start_date": "2026-04-01",
  "end_date": "2026-04-16",
  "page": 1,
  "page_size": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| endpoint | string | 否 | 接口路径 |
| method | string | 否 | 请求方法 |
| status_code | number | 否 | 响应状态码 |
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
        "log_id": "api_log_xxxxx",
        "endpoint": "/api/v1/admin/users",
        "method": "GET",
        "status_code": 200,
        "request_params": {"page": 1, "page_size": 20},
        "response_time_ms": 156,
        "caller_ip": "192.168.1.100",
        "created_at": 1713254400000
      }
    ],
    "total": 12345,
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

### 4.3 限流配置

**URL**: `GET /api/v1/admin/configs/rate-limit`

**描述**: 获取接口限流配置

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
    "rate_limits": [
      {
        "endpoint": "/api/v1/auth/wechat",
        "limit": 100,
        "window_seconds": 60,
        "description": "微信登录接口，每分钟 100 次"
      },
      {
        "endpoint": "/api/v1/order/create",
        "limit": 10,
        "window_seconds": 60,
        "description": "创建订单接口，每分钟 10 次"
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

## 五、JWT Token 说明

### 5.1 Token 结构

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
---
{
  "user_id": "user_xxxxx",
  "open_id": "oxXXXXXX",
  "role": "prayer",
  "iat": 1713254400,
  "exp": 1713261600
}
---
[signature]
```

### 5.2 Token 有效期

| Token 类型 | 有效期 | 用途 | 存储方式 |
|------------|--------|------|----------|
| 小程序 access_token | 2 小时 | 接口鉴权 | 客户端内存 |
| 小程序 refresh_token | 7 天 | 刷新 access_token | HttpOnly Cookie |
| WEB 管理后台 token | 8 小时 | 后台接口鉴权 | localStorage |

### 5.3 Token 刷新策略

1. **小程序端**:
   - access_token 过期前 10 分钟自动刷新
   - access_token 过期后，收到 401 错误时调用刷新接口
   - refresh_token 过期后需重新登录
   - 刷新失败时提示用户重新登录

2. **WEB 管理后台**:
   - token 过期后自动跳转登录页
   - 支持"记住我"功能（7 天免登录）

### 5.4 刷新接口

**URL**: `POST /api/v1/auth/refresh`

**请求参数**:
```json
{
  "refresh_token": "string" // 从 Cookie 自动读取
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200,
    "token_type": "Bearer"
  }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 401 | Refresh Token 无效或过期 |
| 403 | 用户已被封禁 |

---

## 六、安全建议

### 6.1 密码安全

- 密码前端 SHA-256 加密后传输
- 后端 bcrypt 加密存储
- 密码强度要求：8 位以上，包含大小写字母 + 数字 + 特殊字符

### 6.2 Token 安全

- Token 使用 HS256 算法签名
- Token 存储在 localStorage (WEB) 或 storage (小程序)
- 敏感操作需二次验证

### 6.3 接口安全

- 所有接口 HTTPS 加密传输
- 敏感接口增加图形验证码
- 实现请求限流，防止暴力攻击
- 关键操作记录日志

### 6.4 数据安全

- 用户敏感信息加密存储
- 手机号、身份证等脱敏展示
- 数据库定期备份
- 操作日志永久留存

---

**文档结束**
