# Week 3 前端开发计划

**制定日期**: 2026-04-04  
**执行周期**: 2026-04-14 ~ 2026-04-18  
**负责人**: 前端开发团队  
**阶段**: Phase 1 Week 3

---

## 📋 Week 3 任务概览

| 任务 | 优先级 | 预估工时 | 负责人 | 状态 |
|------|--------|----------|--------|------|
| 内容管理后台完善 | P0 | 6 小时 | TBD | 待开始 |
| 数据统计可视化完善 | P0 | 6 小时 | TBD | 待开始 |
| 消息推送功能完善 | P1 | 4 小时 | TBD | 待开始 |
| 用户反馈系统完善 | P1 | 4 小时 | TBD | 待开始 |
| Phase 2 准备 | P1 | 3 小时 | 全员 | 待开始 |
| 技术预研 | P2 | 2 小时 | TBD | 待开始 |

**总预估工时**: 25 小时

---

## 🎯 Week 2 回顾

### 完成情况
- ✅ 内容管理系统基础框架（4 个页面）
- ✅ 数据统计可视化基础框架（3 个页面）
- ✅ 消息推送功能基础框架（3 个页面）
- ✅ 用户反馈系统基础框架（3 个页面）
- ✅ 代码审查报告已创建
- ✅ 性能优化已实施

### 遗留问题
- 🔴 P0: 统计可视化页面违反 Stitch 设计规范（3 处硬编码色值）
- 🟠 P1: TODO 功能未实现（数据接入、加载状态）
- 🟡 P2: 性能优化待验证（缓存、懒加载）

### Week 3 重点
1. **修复 Week 2 遗留问题**（优先级最高）
2. **完善功能细节**（错误处理、加载状态）
3. **Phase 2 技术预研**（订阅消息高级功能）

---

## Task 1: 内容管理后台完善（6 小时）

### 目标
修复 Week 2 遗留问题，完善内容管理功能

### 功能清单
- [ ] **P0**: 实现数据统计云函数接入
- [ ] **P1**: 添加加载状态和错误处理
- [ ] **P1**: 实现物种管理 CRUD 操作
- [ ] **P1**: 实现公告管理 CRUD 操作
- [ ] **P2**: 添加富文本编辑器（wx-editor）
- [ ] **P2**: 实现内容预览功能

### 技术方案
- **云函数**: `contentStats` - 获取统计数据
- **富文本**: 使用原生 `wx-editor` 组件
- **图片上传**: 复用 `utils/cloud.js:uploadEvidence`

### 接口需求
| 接口 | 方法 | 描述 | 状态 |
|------|------|------|------|
| `/api/content/list` | GET | 获取内容列表 | 待实现 |
| `/api/content/create` | POST | 创建内容 | 待实现 |
| `/api/content/update` | PUT | 更新内容 | 待实现 |
| `/api/content/delete` | DELETE | 删除内容 | 待实现 |

### 验收标准
- [ ] 统计数据真实显示（非 mock）
- [ ] 加载状态友好
- [ ] 错误提示清晰
- [ ] 所有 CRUD 操作正常

---

## Task 2: 数据统计可视化完善（6 小时）

### 目标
修复 Stitch 设计规范问题，优化图表性能

### 功能清单
- [ ] **P0**: 修复硬编码色值（改用 CSS 变量）
- [ ] **P0**: 统一浅色禅意主题
- [ ] **P1**: 实现真实数据接入
- [ ] **P1**: 优化 ECharts 性能（销毁、重建）
- [ ] **P2**: 添加数据导出功能
- [ ] **P2**: 实现图表交互（点击、缩放）

### 技术方案
- **CSS 变量**: 使用 `var(--gold-main)`, `var(--bg-xuan)` 等
- **ECharts 优化**: 实现 IntersectionObserver 按需渲染
- **数据导出**: 使用 `wx.saveFile` 导出 CSV

### 修复示例
```css
/* 修复前 */
.dashboard-container {
  background-color: #1a1a2e;
}

/* 修复后 */
.dashboard-container {
  background-color: var(--bg-xuan);
}
```

```javascript
// ECharts 配置使用 CSS 变量
const getCssVar = (name) => {
  // 小程序获取 CSS 变量需要通过 wx.getSystemInfoSync
  return wx.getStorageSync('css_' + name) || '#4A5D4E'
}

const option = {
  series: [{
    itemStyle: { color: getCssVar('--gold-main') }
  }]
}
```

### 验收标准
- [ ] 所有硬编码色值已替换
- [ ] 主题风格统一
- [ ] 图表渲染流畅（<1s）
- [ ] 无内存泄漏

---

## Task 3: 消息推送功能完善（4 小时）

### 目标
完善订阅消息功能，实现真实推送

### 功能清单
- [ ] **P0**: 实现订阅消息模板云函数
- [ ] **P1**: 添加用户授权流程
- [ ] **P1**: 实现推送记录查询
- [ ] **P2**: 添加推送失败重试机制
- [ ] **P2**: 实现批量推送功能

### 技术方案
- **微信订阅消息**: `wx.requestSubscribeMessage`
- **云函数**: `sendSubscribeMessage`
- **推送队列**: 云数据库 `push_queue` 集合

### 模板配置
| 场景 | 模板 ID | 触发条件 | 状态 |
|------|--------|----------|------|
| 订单创建 | 待申请 | 用户下单成功 | 待配置 |
| 订单完成 | 待申请 | 执行者完成服务 | 待配置 |
| 新任务 | 待申请 | 机构发布新任务 | 待配置 |
| 审核通过 | 待申请 | 资质审核通过 | 待配置 |

### 验收标准
- [ ] 用户可授权订阅
- [ ] 订单状态变更时推送通知
- [ ] 推送记录可查询
- [ ] 失败推送可重试

---

## Task 4: 用户反馈系统完善（4 小时）

### 目标
完善反馈功能，优化用户体验

### 功能清单
- [ ] **P1**: 实现图片压缩上传
- [ ] **P1**: 添加反馈状态跟踪
- [ ] **P1**: 实现管理员回复功能
- [ ] **P2**: 添加反馈分类筛选
- [ ] **P2**: 实现反馈导出功能

### 技术方案
- **图片压缩**: 使用 `wx.compressImage` API
- **状态跟踪**: 云数据库 `feedback` 集合 status 字段
- **回复功能**: 嵌套评论结构

### 数据模型
```javascript
{
  _id: 'feedback_xxx',
  userId: 'openid',
  type: 'suggestion',
  title: '反馈标题',
  content: '反馈内容',
  images: ['cloud_id_1', 'cloud_id_2'],
  contact: '联系方式',
  status: 'pending', // pending | processing | resolved | rejected
  reply: {
    content: '管理员回复',
    adminId: 'admin_openid',
    time: 1234567890
  },
  createTime: 1234567890,
  updateTime: 1234567890
}
```

### 验收标准
- [ ] 图片上传压缩正常
- [ ] 反馈状态可跟踪
- [ ] 管理员可回复
- [ ] 用户可查看回复

---

## Task 5: Phase 2 准备（3 小时）

### 目标
为 Phase 2 开发做准备

### 工作内容
- [ ] **P1**: Phase 2 需求评审
- [ ] **P1**: 技术方案设计
- [ ] **P1**: 任务分解和排期
- [ ] **P2**: 代码规范文档更新
- [ ] **P2**: Git 分支策略确认

### Phase 2 范围（预览）
1. **执行者端完善**
   - 任务接单系统
   - 执行记录管理
   - 收入统计
2. **管理端完善**
   - 订单审核
   - 执行者管理
   - 数据报表
3. **性能优化**
   - 虚拟列表
   - CDN 加速
   - 离线缓存

### 输出文档
- `docs/plans/phase2-overview.md`
- `docs/plans/phase2-tech-design.md`
- `docs/plans/phase2-wbs.md`

---

## 🔬 技术预研（2 小时）

### 1. 微信订阅消息高级功能

**调研内容**:
- 长期订阅资质申请
- 一次性订阅 vs 长期订阅
- 推送频次限制
- 模板消息审核流程

**输出**: `docs/study-notes/wechat-subscribe-advanced.md`

**参考资源**:
- https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html
- https://developers.weixin.qq.com/community/develop/doc/0006cc7d5087382d988a7b1a556c00

---

### 2. 数据导出优化

**调研内容**:
- 大数据量导出性能
- CSV vs Excel 格式选择
- 云函数导出 vs 前端导出
- 文件存储和下载

**输出**: `docs/study-notes/data-export-optimization.md`

**技术方案**:
```javascript
// 方案 1: 前端生成 CSV
function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).join(','))
  const csv = [headers, ...rows].join('\n')
  
  const fs = wx.getFileSystemManager()
  const path = `${wx.env.USER_DATA_PATH}/${filename}.csv`
  fs.writeFile({
    filePath: path,
    data: csv,
    encoding: 'utf-8',
    success: () => {
      wx.saveFile({
        tempFilePath: path,
        success: (res) => {
          wx.showToast({ title: '导出成功' })
        }
      })
    }
  })
}
```

---

### 3. 图片压缩上传

**调研内容**:
- 小程序图片压缩 API
- 压缩质量 vs 体积平衡
- 上传进度显示
- 失败重试机制

**输出**: `docs/study-notes/image-compression-upload.md`

**技术方案**:
```javascript
// 图片压缩上传
async function uploadCompressedImage(filePath) {
  // 1. 压缩图片
  const compressed = await wx.compressImage({
    src: filePath,
    quality: 80, // 压缩质量
    compressedWidth: 1080 // 最大宽度
  })
  
  // 2. 上传
  const result = await wx.cloud.uploadFile({
    cloudPath: `feedback/${Date.now()}_${Math.random()}.jpg`,
    filePath: compressed.tempFilePath
  })
  
  return result.fileID
}
```

---

## 📅 每日计划

| 日期 | 任务 | 目标 | 产出 |
|------|------|------|------|
| 周一 (04-14) | 内容管理后台完善 | 完成数据接入、加载状态 | 可运行的内容管理 |
| 周二 (04-15) | 数据统计可视化完善 | 修复设计规范问题 | 符合 Stitch 规范 |
| 周三 (04-16) | 消息推送功能完善 | 实现真实推送 | 可推送订阅消息 |
| 周四 (04-17) | 用户反馈系统完善 | 图片压缩、回复功能 | 完整反馈流程 |
| 周五 (04-18) | Phase 2 准备 + 测试 | 需求评审、任务分解 | Phase 2 计划文档 |

---

## 🎯 验收标准

### 功能验收
- [ ] 内容管理后台可正常使用（真实数据）
- [ ] 统计图表符合 Stitch 设计规范
- [ ] 订阅消息可推送
- [ ] 反馈系统图片压缩正常

### 代码质量
- [ ] P0/P1 问题全部修复
- [ ] ESLint 检查通过
- [ ] 代码审查完成
- [ ] Git 提交规范

### 性能指标
- [ ] 首屏加载 < 1.5 秒
- [ ] 图表渲染 < 1 秒
- [ ] 图片懒加载生效
- [ ] 缓存命中率 > 60%

### 文档产出
- [ ] Week 3 代码审查报告
- [ ] Week 3 性能优化报告
- [ ] Phase 2 技术方案文档
- [ ] 技术预研笔记（3 篇）

---

## 📝 备注

1. **优先级**: Week 2 遗留 P0 问题优先修复
2. **代码审查**: 每完成一个任务立即进行代码审查
3. **每日站会**: 每天 10:00 同步进度和问题
4. **文档更新**: 功能完成后同步更新 API 文档

---

## 🔗 相关文档

- [Week 2 前端开发计划](./week2-frontend-plan.md)
- [Week 2 代码审查报告](../review/frontend-week2-review.md)
- [Week 2 性能优化报告](../optimization/frontend-week2-optimization.md)
- [Stitch 设计系统 V3](../STITCH_DESIGN_SYSTEM_V3.md)

---

**制定人**: AI Agent  
**审核人**: TBD  
**最后更新**: 2026-04-04 17:50
