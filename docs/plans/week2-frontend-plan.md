# Week 2 前端开发计划

**制定日期**: 2026-04-04  
**执行周期**: 2026-04-07 ~ 2026-04-11  
**负责人**: 前端开发团队

---

## 📋 Week 2 任务概览

| 任务 | 优先级 | 预估工时 | 负责人 |
|------|--------|----------|--------|
| 内容管理后台开发 | P0 | 8 小时 | TBD |
| 数据统计可视化 | P1 | 6 小时 | TBD |
| 消息推送功能 | P1 | 4 小时 | TBD |
| 用户反馈系统 | P2 | 4 小时 | TBD |
| 技术预研 | P1 | 3 小时 | 全员 |

**总预估工时**: 25 小时

---

## Task 1: 内容管理后台开发（8 小时）

### 目标
为机构端提供内容管理功能，支持发布、编辑、删除服务内容和公告。

### 功能清单
- [ ] 内容列表页（支持筛选、搜索）
- [ ] 内容创建页（富文本编辑器）
- [ ] 内容编辑页
- [ ] 内容预览功能
- [ ] 内容上下架管理

### 技术方案
- **富文本编辑器**: 使用 `wx-editor` 组件或第三方 `towxml`
- **图片上传**: 复用现有 `utils/cloud.js:uploadEvidence`
- **内容存储**: 云数据库 `content` 集合

### 页面结构
```
pages/org-home/
├── content/
│   ├── list.js/wxml/wxss/json    # 内容列表
│   ├── create.js/wxml/wxss/json  # 创建内容
│   ├── edit.js/wxml/wxss/json    # 编辑内容
│   └── preview.js/wxml/wxss/json # 内容预览
```

### 接口需求
| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/content/list` | GET | 获取内容列表 |
| `/api/content/create` | POST | 创建内容 |
| `/api/content/update` | PUT | 更新内容 |
| `/api/content/delete` | DELETE | 删除内容 |
| `/api/content/publish` | POST | 发布/下架内容 |

### 验收标准
- [ ] 可创建、编辑、删除内容
- [ ] 富文本编辑器支持图文混排
- [ ] 内容列表支持分页加载
- [ ] 支持内容预览

---

## Task 2: 数据统计可视化（6 小时）

### 目标
为机构端和管理端提供数据可视化展示，帮助了解业务状况。

### 功能清单
- [ ] 订单统计图表（日/周/月）
- [ ] 志愿者增长趋势
- [ ] 收入统计图表
- [ ] 服务类型分布
- [ ] 数据导出功能

### 技术方案
- **图表库**: ECharts for WeChat（https://github.com/ecomfe/echarts-for-weixin）
- **数据获取**: 云函数聚合查询
- **缓存策略**: 使用 `utils/cache.js` 缓存统计结果

### 集成步骤
1. 下载 ECharts 小程序 SDK
2. 放置到 `lib/echarts` 目录
3. 在 `app.json` 中配置 usingComponents
4. 创建通用图表组件

### 页面结构
```
pages/org-home/
└── statistics/
    ├── index.js/wxml/wxss/json   # 统计概览
    ├── order-stats.js/wxml/wxss  # 订单统计
    └── volunteer-stats.js/wxml/wxss # 志愿者统计
```

### 图表类型
| 图表 | 用途 | 类型 |
|------|------|------|
| 订单趋势 | 展示订单数量变化 | 折线图 |
| 收入统计 | 展示收入变化 | 柱状图 |
| 服务分布 | 展示各服务类型占比 | 饼图 |
| 志愿者增长 | 展示志愿者数量趋势 | 面积图 |

### 验收标准
- [ ] ECharts 成功集成
- [ ] 至少 4 种图表正常展示
- [ ] 支持图表交互（点击、缩放）
- [ ] 数据实时更新

---

## Task 3: 消息推送功能（4 小时）

### 目标
实现微信订阅消息推送，提升用户活跃度。

### 功能清单
- [ ] 订阅消息模板配置
- [ ] 用户订阅授权
- [ ] 消息推送触发
- [ ] 推送记录查询

### 技术方案
- **消息类型**: 微信订阅消息
- **触发场景**:
  - 订单状态变更
  - 新任务通知
  - 活动提醒
  - 系统公告

### 模板配置
| 场景 | 模板 ID | 触发条件 |
|------|--------|----------|
| 订单创建 | TBD | 用户下单成功 |
| 订单完成 | TBD | 执行者完成服务 |
| 新任务 | TBD | 机构发布新任务 |
| 审核通过 | TBD | 资质审核通过 |

### 实现步骤
1. 在微信公众平台配置订阅消息模板
2. 前端请求用户授权 `wx.requestSubscribeMessage`
3. 后端保存用户订阅状态
4. 业务触发时调用云函数发送消息

### 代码示例
```javascript
// 请求订阅
wx.requestSubscribeMessage({
  tmplIds: ['TEMPLATE_ID_1', 'TEMPLATE_ID_2'],
  success: (res) => {
    if (res[TEMPLATE_ID_1] === 'accept') {
      // 保存订阅状态到云数据库
      saveSubscription(userId, TEMPLATE_ID_1)
    }
  }
})

// 发送消息（云函数）
await cloud.callFunction({
  name: 'sendSubscribeMessage',
  data: {
    touser: openid,
    templateId: TEMPLATE_ID_1,
    data: { /* 模板参数 */ },
    page: 'pages/order/detail'
  }
})
```

### 验收标准
- [ ] 用户可授权订阅消息
- [ ] 订单状态变更时推送通知
- [ ] 推送记录可查询
- [ ] 支持推送失败重试

---

## Task 4: 用户反馈系统（4 小时）

### 目标
建立用户反馈渠道，收集用户意见和建议。

### 功能清单
- [ ] 反馈提交页（支持文字、图片）
- [ ] 反馈列表页（用户查看自己的反馈）
- [ ] 反馈详情及回复
- [ ] 反馈类型选择
- [ ] 管理端反馈处理后台

### 技术方案
- **图片上传**: 复用 `utils/cloud.js:uploadEvidence`
- **数据存储**: 云数据库 `feedback` 集合
- **通知机制**: 新反馈时推送通知管理员

### 反馈类型
- 功能建议
- Bug 报告
- 投诉举报
- 其他

### 页面结构
```
pages/
├── feedback/
│   ├── submit.js/wxml/wxss/json  # 提交反馈
│   └── list.js/wxml/wxss/json    # 反馈列表
└── org-home/
    └── feedback-handle/          # 管理端处理（后续）
```

### 数据模型
```javascript
{
  _id: 'feedback_xxx',
  userId: 'openid',
  type: 'suggestion', // suggestion | bug | complaint | other
  content: '反馈内容',
  images: ['cloud_id_1', 'cloud_id_2'],
  status: 'pending', // pending | processing | resolved | rejected
  reply: '管理员回复',
  createTime: 1234567890,
  updateTime: 1234567890
}
```

### 验收标准
- [ ] 用户可提交反馈（文字 + 图片）
- [ ] 可查看自己的反馈历史
- [ ] 可查看管理员回复
- [ ] 反馈类型可选

---

## 🔬 技术预研（3 小时）

### 1. ECharts 图表库集成

**调研内容**:
- ECharts for WeChat 兼容性
- 性能表现（大数据量渲染）
- 自定义主题支持
- 与小程序样式系统集成

**输出**: `docs/study-notes/echarts-integration.md`

**参考资源**:
- https://github.com/ecomfe/echarts-for-weixin
- https://echarts.apache.org/zh/tutorial.html

---

### 2. 微信订阅消息配置

**调研内容**:
- 订阅消息模板申请流程
- 一次性订阅 vs 长期订阅
- 推送频次限制
- 用户授权最佳实践

**输出**: `docs/study-notes/wechat-subscribe-message.md`

**参考资源**:
- https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html

---

### 3. 富文本编辑器选型

**候选方案**:

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| wx-editor | 原生支持、轻量 | 功能较基础 | ⭐⭐⭐⭐ |
| towxml | 功能强大、支持 Markdown | 体积较大 | ⭐⭐⭐ |
| 第三方 SaaS | 功能完善 | 依赖外部服务 | ⭐⭐ |

**推荐**: 优先使用原生 `wx-editor`，如功能不足再考虑 towxml

**输出**: `docs/study-notes/rich-text-editor-selection.md`

---

## 📅 每日计划

| 日期 | 任务 | 目标 |
|------|------|------|
| 周一 (04-07) | 内容管理后台 | 完成列表页、创建页 |
| 周二 (04-08) | 内容管理后台 | 完成编辑页、预览、上下架 |
| 周三 (04-09) | 数据统计可视化 | ECharts 集成、订单统计 |
| 周四 (04-10) | 消息推送 + 反馈系统 | 完成订阅消息、反馈提交 |
| 周五 (04-11) | 测试与优化 | 功能测试、Bug 修复、代码审查 |

---

## 🎯 验收标准

### 功能验收
- [ ] 内容管理后台可正常使用
- [ ] 统计图表正常展示
- [ ] 订阅消息可推送
- [ ] 用户反馈可提交

### 代码质量
- [ ] 无 P0/P1 级别问题
- [ ] ESLint 检查通过
- [ ] 代码审查完成
- [ ] Git 提交规范

### 性能指标
- [ ] 首屏加载 < 2 秒
- [ ] 图表渲染 < 1 秒
- [ ] 图片懒加载生效
- [ ] 分包加载配置正确

---

## 📝 备注

1. **优先级调整**: 如遇到技术难点，及时调整任务优先级
2. **每日站会**: 每天 10:00 同步进度和问题
3. **代码审查**: 每完成一个任务立即进行代码审查
4. **文档更新**: 功能完成后同步更新 API 文档和用户手册

---

**制定人**: AI Agent  
**审核人**: TBD  
**最后更新**: 2026-04-04
