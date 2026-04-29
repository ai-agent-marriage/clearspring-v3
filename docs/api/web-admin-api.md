# Web 管理端 API 文档

**版本**: v1.0  
**基础 URL**: `http://localhost:8080/api`  
**认证方式**: JWT Bearer Token  

---

## 目录

1. [认证模块](#认证模块)
2. [用户管理模块](#用户管理模块)
3. [角色权限模块](#角色权限模块)
4. [订单管理模块](#订单管理模块)
5. [内容管理模块](#内容管理模块)
6. [合规管理模块](#合规管理模块)
7. [财务管理模块](#财务管理模块)
8. [系统管理模块](#系统管理模块)

---

## 认证模块

### 1.1 管理员登录

**接口**: `POST /auth/login`

**描述**: 管理员登录，获取 JWT Token

**请求参数**:
```json
{
  "username": "string",    // 用户名（必填）
  "password": "string"     // 密码（必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",           // JWT Token
    "refreshToken": "string",    // 刷新 Token
    "expiresIn": 7200,           // 过期时间（秒）
    "userInfo": {
      "id": "string",
      "username": "string",
      "name": "string",
      "role": "string",
      "avatar": "string"
    }
  }
}
```

**错误码**:
- 401: 用户名或密码错误
- 403: 账号已被禁用
- 500: 服务器错误

---

### 1.2 退出登录

**接口**: `POST /auth/logout`

**描述**: 管理员退出登录，使 Token 失效

**请求参数**: 无

**响应格式**:
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

---

### 1.3 获取当前用户信息

**接口**: `GET /auth/me`

**描述**: 获取当前登录管理员的详细信息

**请求头**:
```
Authorization: Bearer {token}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "username": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "string",
    "permissions": ["string"],
    "avatar": "string",
    "createTime": "string"
  }
}
```

---

### 1.4 刷新 Token

**接口**: `POST /auth/refresh`

**描述**: 使用刷新 Token 获取新的访问 Token

**请求参数**:
```json
{
  "refreshToken": "string"  // 刷新 Token（必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "string",           // 新的 JWT Token
    "refreshToken": "string",    // 新的刷新 Token
    "expiresIn": 7200
  }
}
```

**错误码**:
- 401: 刷新 Token 无效或已过期
- 500: 服务器错误

---

### 1.5 修改密码

**接口**: `POST /auth/change-password`

**描述**: 修改当前管理员密码

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "oldPassword": "string",  // 旧密码（必填）
  "newPassword": "string"   // 新密码（必填）
}
```

**密码要求**:
- 长度至少 8 位
- 包含大写字母
- 包含小写字母
- 包含数字
- 包含特殊字符

**响应格式**:
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

---

## 用户管理模块

### 2.1 获取用户列表

**接口**: `GET /admin/users`

**描述**: 分页获取用户列表，支持筛选和搜索

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```
page: number       // 页码，默认 1
size: number       // 每页数量，默认 10
username: string   // 用户名搜索（可选）
phone: string      // 手机号搜索（可选）
status: string     // 状态筛选：active/disabled（可选）
role: string       // 角色筛选（可选）
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "string",
        "username": "string",
        "name": "string",
        "phone": "string",
        "email": "string",
        "role": "string",
        "status": "active",
        "createTime": "string",
        "lastLoginTime": "string"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10,
    "totalPages": 10
  }
}
```

---

### 2.2 获取用户详情

**接口**: `GET /admin/users/{userId}`

**描述**: 获取指定用户的详细信息

**路径参数**:
```
userId: string  // 用户 ID
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "username": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "idCard": "string",
    "role": "string",
    "status": "active",
    "skills": ["string"],
    "certificates": [
      {
        "name": "string",
        "level": "string",
        "issueDate": "string"
      }
    ],
    "createTime": "string",
    "updateTime": "string"
  }
}
```

---

### 2.3 创建用户

**接口**: `POST /admin/users`

**描述**: 创建新用户

**请求参数**:
```json
{
  "username": "string",      // 用户名（必填，唯一）
  "password": "string",      // 密码（必填）
  "name": "string",          // 姓名（必填）
  "phone": "string",         // 手机号（必填）
  "email": "string",         // 邮箱（可选）
  "role": "string",          // 角色（必填）
  "skills": ["string"],      // 技能列表（可选）
  "status": "active"         // 状态（可选，默认 active）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "string",
    "username": "string",
    "createTime": "string"
  }
}
```

**错误码**:
- 400: 参数错误
- 409: 用户名已存在

---

### 2.4 更新用户

**接口**: `PUT /admin/users/{userId}`

**描述**: 更新用户信息

**路径参数**:
```
userId: string  // 用户 ID
```

**请求参数**:
```json
{
  "name": "string",          // 姓名（可选）
  "phone": "string",         // 手机号（可选）
  "email": "string",         // 邮箱（可选）
  "role": "string",          // 角色（可选）
  "skills": ["string"],      // 技能列表（可选）
  "status": "string"         // 状态：active/disabled（可选）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

---

### 2.5 删除用户

**接口**: `DELETE /admin/users/{userId}`

**描述**: 删除指定用户

**路径参数**:
```
userId: string  // 用户 ID
```

**响应格式**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

### 2.6 批量禁用用户

**接口**: `POST /admin/users/batch-disable`

**描述**: 批量禁用多个用户

**请求参数**:
```json
{
  "userIds": ["string"]  // 用户 ID 列表（必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "批量禁用成功",
  "data": {
    "successCount": 5,
    "failCount": 0
  }
}
```

---

## 角色权限模块

### 3.1 获取角色列表

**接口**: `GET /admin/roles`

**描述**: 获取所有角色列表

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "permissions": ["string"],
      "createTime": "string"
    }
  ]
}
```

---

### 3.2 创建角色

**接口**: `POST /admin/roles`

**请求参数**:
```json
{
  "name": "string",          // 角色名称（必填）
  "code": "string",          // 角色编码（必填，唯一）
  "description": "string",   // 描述（可选）
  "permissions": ["string"]  // 权限列表（可选）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "string",
    "code": "string"
  }
}
```

---

### 3.3 更新角色

**接口**: `PUT /admin/roles/{roleId}`

**请求参数**:
```json
{
  "name": "string",
  "description": "string",
  "permissions": ["string"]
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

---

### 3.4 删除角色

**接口**: `DELETE /admin/roles/{roleId}`

**响应格式**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**错误码**:
- 400: 角色已被使用，无法删除

---

## 订单管理模块

### 4.1 获取订单列表

**接口**: `GET /admin/orders`

**请求参数**:
```
page: number        // 页码
size: number        // 每页数量
userId: string      // 用户 ID（可选）
status: string      // 订单状态（可选）
startTime: string   // 开始时间（可选）
endTime: string     // 结束时间（可选）
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "string",
        "orderNo": "string",
        "userId": "string",
        "userName": "string",
        "amount": "number",
        "status": "string",
        "createTime": "string",
        "payTime": "string"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

---

### 4.2 获取订单详情

**接口**: `GET /admin/orders/{orderId}`

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "orderNo": "string",
    "userId": "string",
    "userName": "string",
    "amount": "number",
    "status": "string",
    "items": [
      {
        "name": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "createTime": "string",
    "payTime": "string"
  }
}
```

---

## 内容管理模块

### 5.1 内容审核列表

**接口**: `GET /admin/content/audits`

**请求参数**:
```
page: number
size: number
status: string      // 审核状态：pending/approved/rejected
type: string        // 内容类型
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "string",
        "contentId": "string",
        "contentType": "string",
        "status": "pending",
        "submitTime": "string"
      }
    ],
    "total": 100
  }
}
```

---

### 5.2 审核内容

**接口**: `POST /admin/content/audits/{auditId}`

**请求参数**:
```json
{
  "status": "string",      // approved/rejected（必填）
  "reason": "string"       // 驳回原因（rejected 时必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "审核成功",
  "data": null
}
```

---

## 合规管理模块

### 6.1 资质审核列表

**接口**: `GET /admin/qualifications`

**请求参数**:
```
page: number
size: number
status: string      // 审核状态
skillType: string   // 技能类型
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "string",
        "userId": "string",
        "userName": "string",
        "skillType": "string",
        "certificates": ["string"],
        "status": "pending",
        "submitTime": "string"
      }
    ],
    "total": 100
  }
}
```

---

### 6.2 审核资质

**接口**: `POST /admin/qualifications/{qualificationId}`

**请求参数**:
```json
{
  "status": "string",      // approved/rejected（必填）
  "reason": "string"       // 驳回原因（rejected 时必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "审核成功",
  "data": null
}
```

---

### 6.3 申诉仲裁列表

**接口**: `GET /admin/appeals`

**响应格式**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "string",
        "userId": "string",
        "appealType": "string",
        "reason": "string",
        "status": "pending",
        "submitTime": "string"
      }
    ],
    "total": 100
  }
}
```

---

### 6.4 仲裁申诉

**接口**: `POST /admin/appeals/{appealId}`

**请求参数**:
```json
{
  "result": "string",      // upheld/rejected（必填）
  "remark": "string"       // 仲裁说明（必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "仲裁成功",
  "data": null
}
```

---

## 财务管理模块

### 7.1 分润统计

**接口**: `GET /admin/finance/profit-sharing`

**请求参数**:
```
startTime: string   // 开始时间
endTime: string     // 结束时间
userId: string      // 用户 ID（可选）
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalProfit": "number",
    "totalUsers": "number",
    "details": [
      {
        "userId": "string",
        "userName": "string",
        "profit": "number",
        "orderCount": "number"
      }
    ]
  }
}
```

---

### 7.2 数据导出

**接口**: `GET /admin/finance/export`

**请求参数**:
```
type: string        // 导出类型：profit/order/user
startTime: string
endTime: string
format: string      // 导出格式：xlsx/csv
```

**响应**: 文件流（application/vnd.openxmlformats-officedocument.spreadsheetml.sheet）

---

## 系统管理模块

### 8.1 仪表盘数据

**接口**: `GET /admin/dashboard`

**描述**: 获取仪表盘统计数据

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalUsers": "number",
    "totalOrders": "number",
    "todayOrders": "number",
    "pendingReviews": "number",
    "todayRevenue": "number",
    "userGrowth": [
      { "date": "string", "count": "number" }
    ],
    "orderStats": {
      "completed": "number",
      "pending": "number",
      "cancelled": "number"
    }
  }
}
```

---

### 8.2 操作日志列表

**接口**: `GET /admin/logs`

**请求参数**:
```
page: number
size: number
userId: string      // 用户 ID（可选）
action: string      // 操作类型（可选）
startTime: string
endTime: string
```

**响应格式**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "string",
        "userId": "string",
        "userName": "string",
        "action": "string",
        "module": "string",
        "ip": "string",
        "createTime": "string"
      }
    ],
    "total": 100
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 403 | 拒绝访问（权限不足） |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名已存在） |
| 500 | 服务器内部错误 |

---

## 安全说明

### CSRF 防护

所有 POST/PUT/PATCH/DELETE 请求需要在请求头中添加 CSRF Token：
```
X-CSRF-TOKEN: {csrf_token}
```

### XSS 防护

所有用户输入会自动进行 XSS 过滤，无需手动处理。

### Token 刷新

当收到 401 错误时，系统会自动尝试刷新 Token。刷新失败后会跳转到登录页。

---

*文档更新时间：2026-04-12*  
*文档版本：v1.0*
