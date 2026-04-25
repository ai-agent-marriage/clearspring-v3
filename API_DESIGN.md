# 清如小程序 V2.0 - API 接口设计文档

**文档版本**: V1.0.0  
**创建日期**: 2026-04-16  
**文档状态**: 正式版本  

---

## 一、接口设计规范

### 1.1 设计原则

- **RESTful 风格**: 所有接口遵循 RESTful 架构风格
- **版本控制**: 所有接口统一使用 `/api/v1/` 前缀
- **统一响应格式**: 所有接口返回统一格式
- **JWT 鉴权**: 用户认证接口使用 JWT Token
- **请求限流**: 所有接口实施请求限流保护
- **日志记录**: 所有操作留痕，支持审计追溯

### 1.2 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 1.3 统一请求头

```http
Authorization: Bearer {token}
Content-Type: application/json
```

### 1.4 全局错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 请求成功 | - |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 未登录/Token 过期 | 重新登录获取 Token |
| 403 | 无权限访问 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源 ID |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器内部错误 | 联系技术支持 |
| 503 | 服务暂时不可用 | 稍后重试 |

### 1.5 业务错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 微信授权失败 |
| 1002 | 用户未注册 |
| 1003 | 用户已被封禁 |
| 2001 | 音频不存在 |
| 2002 | 收听记录无效 |
| 3001 | 物种不存在 |
| 3002 | 物种禁止投放 |
| 4001 | 订单不存在 |
| 4002 | 订单状态异常 |
| 4003 | 支付失败 |
| 4004 | 订单已取消 |
| 5001 | 内容审核未通过 |
| 5002 | 敏感词拦截 |
| 6001 | 资质审核未通过 |
| 6002 | 机构无权限承接 |

---

## 二、接口分类索引

### 2.1 认证与权限接口 (`API_AUTH.md`)

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 微信登录授权 | `/api/v1/auth/wechat` | POST | 微信小程序登录 |
| 用户信息同步 | `/api/v1/auth/sync` | POST | 同步用户信息 |
| Token 刷新 | `/api/v1/auth/refresh` | POST | 刷新访问 Token |
| 退出登录 | `/api/v1/auth/logout` | POST | 退出登录 |

### 2.2 小程序端接口 (`API_MINIPROGRAM.md`)

#### 公共模块

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 文件上传 | `/api/v1/upload` | POST | 上传图片/视频 |
| 内容安全检测 | `/api/v1/content/check` | POST | 微信内容安全 API |

#### 梵音板块

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 获取梵音列表 | `/api/v1/audio/list` | GET | 获取 9 首梵音列表 |
| 获取梵音详情 | `/api/v1/audio/detail` | GET | 获取单首梵音详情 |
| 提交收听记录 | `/api/v1/audio/record` | POST | 提交有效收听记录 |
| 获取收听统计 | `/api/v1/audio/statistics` | GET | 获取用户收听统计 |
| 生成里程碑证书 | `/api/v1/audio/certificate` | POST | 生成收听里程碑证书 |

#### 禅理板块

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 获取每日一禅 | `/api/v1/zen/daily` | GET | 获取当日禅理 |
| 生成分享海报 | `/api/v1/zen/poster` | POST | 生成分享海报 |
| 获取物种列表 | `/api/v1/species/list` | GET | 获取物种列表 |
| 获取物种详情 | `/api/v1/species/detail` | GET | 获取物种详情 |
| 获取佛历吉日 | `/api/v1/calendar/lunar` | GET | 获取佛历日历 |
| 提交打卡记录 | `/api/v1/calendar/checkin` | POST | 提交修行打卡 |
| 获取打卡统计 | `/api/v1/calendar/statistics` | GET | 获取打卡统计 |

#### 护生功德林

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 自主护生登记 | `/api/v1/protection/register` | POST | 提交自主护生记录 |
| 获取护生列表 | `/api/v1/protection/list` | GET | 获取护生记录列表 |
| 获取护生详情 | `/api/v1/protection/detail` | GET | 获取护生记录详情 |
| 创建委托订单 | `/api/v1/order/create` | POST | 创建委托护生订单 |
| 获取订单列表 | `/api/v1/order/list` | GET | 获取订单列表 |
| 获取订单详情 | `/api/v1/order/detail` | GET | 获取订单详情 |
| 确认订单完成 | `/api/v1/order/confirm` | POST | 确认订单完成 |
| 提交订单异议 | `/api/v1/order/dispute` | POST | 提交订单异议 |
| 生成护生证书 | `/api/v1/protection/certificate` | POST | 生成护生圆满证书 |

#### 个人中心

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 获取用户信息 | `/api/v1/user/profile` | GET | 获取用户个人信息 |
| 更新用户信息 | `/api/v1/user/profile` | PUT | 更新用户个人信息 |
| 获取修行数据 | `/api/v1/user/statistics` | GET | 获取修行数据统计 |
| 获取证书列表 | `/api/v1/user/certificates` | GET | 获取用户证书列表 |
| 获取台账列表 | `/api/v1/user/ledger` | GET | 获取用户台账列表 |

### 2.3 WEB 管理后台接口 (`API_WEB_ADMIN.md`)

#### 超级管理员

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 获取用户列表 | `/api/v1/admin/users` | GET | 获取用户列表 |
| 审核用户资质 | `/api/v1/admin/users/audit` | POST | 审核用户资质 |
| 封禁/解封用户 | `/api/v1/admin/users/ban` | POST | 封禁/解封用户 |
| 获取订单列表 | `/api/v1/admin/orders` | GET | 获取全量订单 |
| 审核订单 | `/api/v1/admin/orders/audit` | POST | 审核订单 |
| 管理禅理内容 | `/api/v1/admin/zen` | CRUD | 禅理内容管理 |
| 管理物种库 | `/api/v1/admin/species` | CRUD | 物种库管理 |
| 管理水域 | `/api/v1/admin/waters` | CRUD | 合规水域管理 |
| 获取对账列表 | `/api/v1/admin/finance/reconciliation` | GET | 订单对账 |
| 获取结算列表 | `/api/v1/admin/finance/settlement` | GET | 结算管理 |
| 获取财务报表 | `/api/v1/admin/finance/report` | GET | 财务报表 |

#### 机构管理员

| 接口名称 | URL | 方法 | 说明 |
|----------|-----|------|------|
| 获取订单列表 | `/api/v1/institution/orders` | GET | 获取本机构订单 |
| 承接订单 | `/api/v1/institution/orders/accept` | POST | 承接订单 |
| 分配执行任务 | `/api/v1/institution/tasks/assign` | POST | 分配任务给志愿者 |
| 审核执行材料 | `/api/v1/institution/tasks/audit` | POST | 审核执行材料 |
| 获取志愿者列表 | `/api/v1/institution/volunteers` | GET | 获取志愿者列表 |
| 绑定志愿者 | `/api/v1/institution/volunteers/bind` | POST | 绑定志愿者 |
| 获取结算列表 | `/api/v1/institution/settlements` | GET | 获取本机构结算 |

---

## 三、特殊接口要求

### 3.1 支付接口

- **对接方式**: 微信支付 V3
- **安全要求**: HTTPS 加密传输
- **签名验证**: 所有支付请求必须验证签名
- **回调处理**: 异步通知处理订单状态

### 3.2 文件上传接口

- **对接方式**: 微信内容安全 API
- **文件格式**: 支持 jpg/png/gif/webp/mp4
- **大小限制**: 图片≤10MB，视频≤100MB
- **安全检测**: 自动检测违规内容

### 3.3 敏感数据处理

- **手机号**: 中间 4 位脱敏 (138****1234)
- **身份证**: 仅保留前 3 位和后 4 位
- **银行卡**: 仅保留后 4 位
- **存储加密**: AES-256 加密存储

### 3.4 合规数据留痕

- **操作日志**: 所有关键操作记录日志
- **日志内容**: 操作人、操作时间、操作内容、IP 地址
- **留存时间**: 至少 3 年
- **审计支持**: 支持按条件查询导出

---

## 四、接口详细说明

详细接口文档请查看:

- [`API_AUTH.md`](./API_AUTH.md) - 认证与权限接口
- [`API_MINIPROGRAM.md`](./API_MINIPROGRAM.md) - 小程序端接口
- [`API_WEB_ADMIN.md`](./API_WEB_ADMIN.md) - WEB 管理后台接口

---

## 五、附录

### 5.1 数据结构定义

#### User (用户)

```json
{
  "user_id": "string",
  "open_id": "string",
  "union_id": "string",
  "nickname": "string",
  "avatar": "string",
  "phone": "string",
  "role": "prayer|volunteer|institution",
  "status": "active|banned",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Order (订单)

```json
{
  "order_id": "string",
  "order_no": "string",
  "user_id": "string",
  "institution_id": "string",
  "status": "pending|accepted|executing|confirming|completed|disputed|cancelled",
  "amount": "number",
  "protection_date": "timestamp",
  "water_area": "string",
  "species": "string",
  "quantity": "number",
  "wish": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Certificate (证书)

```json
{
  "certificate_id": "string",
  "certificate_no": "string",
  "user_id": "string",
  "type": "protection|audio|checkin",
  "title": "string",
  "content": "string",
  "image_url": "string",
  "qr_code": "string",
  "created_at": "timestamp"
}
```

### 5.2 状态枚举定义

#### 订单状态

| 状态码 | 状态名 | 说明 |
|--------|--------|------|
| 1 | pending | 待机构承接 |
| 2 | accepted | 已承接 |
| 3 | executing | 执行中 |
| 4 | confirming | 待用户确认 |
| 5 | completed | 已完成 |
| 6 | disputed | 有异议 |
| 7 | cancelled | 已取消 |

#### 用户角色

| 角色码 | 角色名 | 说明 |
|--------|--------|------|
| prayer | 祈福者 | C 端普通用户 |
| volunteer | 公益志愿者 | 个人执行者 |
| institution | 合规执行机构 | 机构执行者 |

---

**文档结束**
