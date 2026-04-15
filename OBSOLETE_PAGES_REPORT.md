# 废弃页面目录清理报告

**生成时间**: 2026-04-15 13:45 GMT+8  
**检查范围**: pages/, miniprogram/, projects/  
**检查依据**: app.json 页面定义、代码引用依赖、目录内容分析

---

## 📊 检查摘要

| 类别 | 数量 | 状态 |
|------|------|------|
| 未在 app.json 中定义的页面目录 | 68+ | 需分类处理 |
| admin-* 系列目录 | 12 个 | 部分在用 |
| org-* 系列目录 | 8 个 | 部分在用 |
| q-xx-* 系列目录 | 33+ 个 | 设计稿/测试页面 |
| miniprogram/ | 1 个 | 旧项目目录 |
| projects/ | 1 个 | 备份项目 |

---

## ✅ 删除列表 (可安全删除)

### 1. projects/ 目录
**路径**: `/root/.openclaw/workspace/projects/`  
**原因**: 
- 备份项目目录，包含 clearspring-v2 完整备份
- 有独立备份文件 `clearspring-v2-backup-20260330-123930.tar.gz`
- 当前项目无引用依赖
- 仅在报告文档中被提及作为历史参考

**建议操作**: 
```bash
# 确认备份 tar.gz 文件存在后删除
rm -rf /root/.openclaw/workspace/projects/
```

---

### 2. pages/admin/ 目录 (空壳)
**路径**: `/root/.openclaw/workspace/pages/admin/`  
**原因**:
- 仅包含 `content/` 子目录，无实际页面文件
- 实际使用的是 `pages/admin-content/` 等独立目录
- 这是一个空壳目录

**建议操作**:
```bash
rm -rf /root/.openclaw/workspace/pages/admin/
```

---

### 3. pages/q-xx-* 系列 (设计稿页面 - 部分)
**路径**: `/root/.openclaw/workspace/pages/q-*`  
**可删除的设计稿页面**:

| 目录 | 原因 | 引用情况 |
|------|------|----------|
| q-01-launch | 启动页设计稿，未在主 app.json 定义 | 无引用 |
| q-04-audio-player | 音频播放器设计稿 | miniprogram/中有独立实现 |
| q-13-service | 服务页设计稿 | 无外部引用 |
| q-14-confirm | 确认页设计稿 | 内部引用 q-15-result |
| q-15-result | 结果页设计稿 | 被 q-14 引用 |
| q-16-order-detail | 订单详情设计稿 | 无外部引用 |
| q-17-certificate | 证书页设计稿 | 被 q-16 引用 |
| q-18-ranking | 排行榜设计稿 | 无引用 |
| q-19-forest | 森林页设计稿 | 无引用 |
| q-20-tree | 树页面设计稿 | 无引用 |
| q-21-water | 浇水页设计稿 | 无引用 |
| q-22-record | 记录页设计稿 | 无引用 |
| q-23-share | 分享页设计稿 | 无引用 |
| q-24-invite | 邀请页设计稿 | 无引用 |
| q-25-guest | 访客页设计稿 | 无引用 |
| q-26-task | 任务页设计稿 | 无引用 |
| q-27-signin | 签到页设计稿 | 无引用 |
| q-28-calendar | 日历页设计稿 | 无引用 |
| q-29-notification | 通知页设计稿 | 无引用 |
| q-30-settings | 设置页设计稿 | 无引用 |
| q-31-about | 关于页设计稿 | 无引用 |
| q-32-help | 帮助页设计稿 | 无引用 |
| q-33-feedback | 反馈页设计稿 | 无引用 |

**共同特征**:
- 均为主 app.json 未定义的页面
- 文件修改时间较早 (Apr 15 12:01-12:08)
- 无实际业务逻辑引用
- 属于设计稿/原型页面

**建议操作**:
```bash
# 批量删除设计稿页面
rm -rf /root/.openclaw/workspace/pages/q-{01,04,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33}-*
```

---

## ⚠️ 保留列表 (需保留)

### 1. admin-* 系列 (管理端页面 - 在用)
**保留目录**:
- `pages/admin-appeal/` - 申诉管理，被 admin-final 引用
- `pages/admin-config/` - 配置管理
- `pages/admin-dashboard/` - 仪表盘
- `pages/admin-executor/` - 执行者管理
- `pages/admin-export/` - 导出管理
- `pages/admin-final/` - 管理端主页，核心页面
- `pages/admin-financial/` - 财务管理
- `pages/admin-order/` - 订单管理
- `pages/admin-qualification/` - 资质管理
- `pages/admin-qualification-org/` - 机构资质管理
- `pages/admin-settings/` - 设置管理

**保留原因**:
- 虽然未在主 app.json 中定义，但可能是分包页面
- 代码中存在大量内部引用 (344+ 处引用)
- auto-screenshot.js 脚本依赖部分 admin 页面进行截图
- 是管理端功能的核心组成部分

---

### 2. org-* 系列 (机构端页面 - 在用)
**保留目录**:
- `pages/org-financial-report/` - 财务报表
- `pages/org-home/` - 机构主页，核心页面
- `pages/org-order-detail/` - 订单详情
- `pages/org-qualification/` - 资质管理
- `pages/org-settings/` - 设置
- `pages/org-task-assign/` - 任务分配
- `pages/org-volunteer-detail/` - 志愿者详情

**保留原因**:
- 代码中存在相互引用 (org-home 引用 org-task-assign 等)
- 测试文件中有引用 (`miniprogram/__tests__/org/`)
- 可能是特定角色的分包页面
- 文件修改时间较新，说明仍在维护

---

### 3. miniprogram/ 目录 (待确认)
**路径**: `/root/.openclaw/workspace/miniprogram/`  
**状态**: ⚠️ **待确认**

**特征**:
- 包含独立的 app.json (定义了 3 个页面)
- 包含完整的测试套件 (`__tests__/` 目录)
- 包含 node_modules 依赖
- 有独立的 pages/ 目录结构

**保留原因**:
- 可能是旧版主程序目录
- 包含测试代码和开发工具
- 需要确认是否还在使用

**建议**: 需要人工确认此目录的用途

---

## ❓ 待确认列表

### 1. miniprogram/pages/q-* 系列
**路径**: `/root/.openclaw/workspace/miniprogram/pages/q-*`

**目录列表**:
- q-01-launch
- q-04-audio-player
- q-17-order-review
- q-19-certificate-detail
- q-20-profile-lite

**问题**:
- 这些页面在 miniprogram/ 子项目中
- 部分在测试文件中被引用
- 需要确认 miniprogram/ 是否还在使用

**建议操作**: 
1. 确认 miniprogram/ 目录是否还在使用
2. 如果 miniprogram/ 已废弃，可整体删除
3. 如果仍在使用，需单独评估这些 q-* 页面

---

### 2. auto-screenshot.js 依赖的 admin 页面
**文件**: `/root/.openclaw/workspace/auto-screenshot.js`

**依赖页面**:
- `pages/admin/content/index` - 内容审核
- `pages/admin/order/index` - 订单管理  
- `pages/admin/user/index` - 用户管理
- `pages/admin/stats/index` - 数据统计

**问题**:
- 这些页面在代码中被引用，但对应的目录不存在
- 可能是旧版路径，需要更新截图脚本

**建议操作**:
```javascript
// 更新 auto-screenshot.js 中的路径
// 从 'pages/admin/content/index' 
// 改为 'pages/admin-content/index' (实际存在的路径)
```

---

## 📋 清理建议总结

### 优先级 P0 (可立即删除)
```bash
# 1. 备份项目目录
rm -rf /root/.openclaw/workspace/projects/

# 2. 空壳 admin 目录
rm -rf /root/.openclaw/workspace/pages/admin/
```

### 优先级 P1 (设计稿页面清理)
```bash
# 删除 q-xx 设计稿页面 (共 23 个目录)
for dir in q-01-launch q-04-audio-player q-13-service q-14-confirm q-15-result \
           q-16-order-detail q-17-certificate q-18-ranking q-19-forest q-20-tree \
           q-21-water q-22-record q-23-share q-24-invite q-25-guest q-26-task \
           q-27-signin q-28-calendar q-29-notification q-30-settings \
           q-31-about q-32-help q-33-feedback; do
  rm -rf /root/.openclaw/workspace/pages/$dir
done
```

### 优先级 P2 (需要人工确认)
1. **miniprogram/** 目录 - 确认是否还在使用
2. **auto-screenshot.js** - 更新页面路径引用

---

## 📈 预计清理效果

| 指标 | 清理前 | 清理后 | 减少 |
|------|--------|--------|------|
| pages/ 目录数 | ~68 | ~45 | -23 |
| 总目录数 | ~75 | ~50 | -25 |
| 设计稿页面 | 23 个 | 0 个 | -100% |
| 备份文件 | 1 个 | 0 个 | -1 |

---

## 🔍 检查方法说明

1. **app.json 比对**: 提取主 app.json 中定义的 pages 和 subPackages
2. **代码引用扫描**: `grep -r "pages/xxx"` 查找所有引用
3. **目录内容分析**: 检查目录是否包含实际页面文件
4. **修改时间分析**: 通过文件时间戳判断活跃度
5. **依赖关系图谱**: 分析页面间的跳转引用关系

---

**报告生成完成** ✅  
**下一步**: 请人工审核待确认列表后执行清理操作
