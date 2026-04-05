# 内容安全三级审核机制 - 部署检查清单

## ✅ 完成情况总览

| 任务 | 状态 | 文件/位置 | 完成时间 |
|------|------|-----------|----------|
| 数据库建表 | ✅ | `cloud/database-schema-content-audit.sql` | 已完成 |
| 云函数 checkText | ✅ | `cloud/functions/content/checkText/` | 已完成 |
| 云函数 checkImage | ✅ | `cloud/functions/content/checkImage/` | 已完成 |
| 云函数 checkVideo | ✅ | `cloud/functions/content/checkVideo/` | 已完成 |
| 云函数 getAuditList | ✅ | `cloud/functions/admin/getAuditList/` | 已完成 |
| 云函数 auditContent | ✅ | `cloud/functions/admin/auditContent/` | 已完成 |
| 前端 security.js | ✅ | `utils/security.js` | 已完成 |
| 管理后台页面 | ✅ | `admin-pc/src/views/ContentAudit.vue` | 已完成 |
| 路由配置 | ✅ | `admin-pc/src/router/index.js` | 已完成 |
| 部署脚本 | ✅ | `cloud/deploy-content-audit.sh` | 已完成 |
| 实施文档 | ✅ | `CONTENT_AUDIT_IMPLEMENTATION.md` | 已完成 |

---

## 📋 部署步骤检查

### 1. 数据库初始化 [ ]

- [ ] 打开微信云开发控制台
- [ ] 进入数据库管理
- [ ] 执行 `cloud/database-schema-content-audit.sql`
- [ ] 验证表创建成功：`content_audit`

**验证 SQL**:
```sql
SHOW TABLES LIKE 'content_audit';
DESC content_audit;
```

---

### 2. 云函数部署 [ ]

- [ ] 运行部署脚本：`./cloud/deploy-content-audit.sh`
- [ ] 或在微信开发者工具中手动部署 5 个云函数
- [ ] 验证云函数状态：全部为「部署成功」

**云函数列表**:
- [ ] `content-checkText`
- [ ] `content-checkImage`
- [ ] `content-checkVideo`
- [ ] `admin-getAuditList`
- [ ] `admin-auditContent`

**验证方法**:
```bash
# 检查云函数文件
ls -la cloud/functions/content/checkText/
ls -la cloud/functions/content/checkImage/
ls -la cloud/functions/content/checkVideo/
ls -la cloud/functions/admin/getAuditList/
ls -la cloud/functions/admin/auditContent/

# 每个目录应包含：index.js + package.json
```

---

### 3. 云函数测试 [ ]

在微信开发者工具中测试每个云函数：

**测试 checkText**:
```json
{
  "content": "这是一段测试文本",
  "business_type": "comment",
  "business_id": "test_001"
}
```
期望返回：`{success: true, result: "pass", ...}`

**测试 checkImage**:
```json
{
  "file_id": "cloud://xxx.xxx.jpg",
  "business_type": "evidence",
  "business_id": "test_002"
}
```
期望返回：`{success: true, result: "pass", ...}`

**测试 getAuditList** (需要管理员权限):
```json
{
  "page": 1,
  "pageSize": 20
}
```
期望返回：`{success: true, data: {list: [], pagination: {...}, stats: {...}}}`

---

### 4. 前端集成 [ ]

- [ ] 在需要内容审核的页面引入 `utils/security.js`
- [ ] 调用 `checkContent()` 进行三级审核
- [ ] 根据审核结果处理业务逻辑（pass/review/block）

**集成示例**:
```javascript
import { checkContent } from '@/utils/security'

// 提交前审核
const result = await checkContent({
  type: 'text',
  content: formData.content,
  business_type: 'feedback',
  business_id: `feedback_${Date.now()}`
})

if (result.block) {
  // 拦截，禁止提交
  wx.showToast({ title: '内容违规', icon: 'none' })
  return
}

if (result.review) {
  // 待审核，可提交但暂不可见
  wx.showToast({ title: '内容待审核', icon: 'none' })
}

// 提交数据
```

---

### 5. 管理后台部署 [ ]

- [ ] 启动管理后台：`cd admin-pc && npm run dev`
- [ ] 访问：http://localhost:5173/content-audit
- [ ] 验证页面加载正常
- [ ] 验证筛选功能正常
- [ ] 验证审核操作（通过/驳回）正常

**菜单配置**:
在 `Dashboard.vue` 中添加菜单项：
```vue
<el-menu-item index="/content-audit">
  <el-icon><Shield /></el-icon>
  <span>内容安全审核</span>
</el-menu-item>
```

---

## 📊 验收标准验证

### 1. content_audit 表创建成功 [ ]

```sql
-- 验证表结构
DESC content_audit;

-- 验证索引
SHOW INDEX FROM content_audit;

-- 插入测试数据
INSERT INTO content_audit 
(type, content, user_openid, business_type, business_id, auto_audit_result)
VALUES 
(1, '测试内容', 'ou_xxx', 'feedback', 'test_001', 'pass');

-- 查询测试数据
SELECT * FROM content_audit WHERE business_id = 'test_001';
```

---

### 2. 5 个云函数部署成功 [ ]

- [ ] 云函数状态正常
- [ ] 云函数日志无报错
- [ ] 测试调用返回正确结果

---

### 3. 前端审核工具集成完成 [ ]

- [ ] `utils/security.js` 已更新
- [ ] 至少一个上传接口已集成审核
- [ ] 审核结果正确处理（pass/review/block）

---

### 4. 管理后台审核池可用 [ ]

- [ ] 页面可访问：`/content-audit`
- [ ] 列表数据加载正常
- [ ] 筛选功能正常
- [ ] 审核操作（通过/驳回）正常
- [ ] 详情查看正常

---

### 5. 违规内容拦截率≥99.9% [ ]

**监控指标**:
```sql
-- 今日审核统计
SELECT 
  auto_audit_result,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM content_audit WHERE DATE(create_time) = CURDATE()), 2) as percentage
FROM content_audit
WHERE DATE(create_time) = CURDATE()
GROUP BY auto_audit_result;

-- 违规拦截率
SELECT 
  ROUND(SUM(CASE WHEN auto_audit_result = 'block' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as block_rate
FROM content_audit
WHERE DATE(create_time) = CURDATE();

-- 人工审核介入率
SELECT 
  ROUND(SUM(CASE WHEN manual_audit_status = 'pending' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as review_rate
FROM content_audit
WHERE DATE(create_time) = CURDATE();
```

**目标**:
- 自动拦截率（block）: ≥1%（真实违规内容）
- 人工审核率（review）: <5%（疑似内容）
- 自动通过率（pass）: >94%（正常内容）
- 总拦截率（block + review）: ≥99.9%

---

## 🚀 快速部署命令

```bash
# 1. 进入项目目录
cd /root/.openclaw/workspace

# 2. 执行数据库建表（在微信云开发控制台手动执行）
# cloud/database-schema-content-audit.sql

# 3. 部署云函数
chmod +x cloud/deploy-content-audit.sh
./cloud/deploy-content-audit.sh

# 4. 启动管理后台（可选，用于测试）
cd admin-pc
npm install
npm run dev

# 5. 访问审核页面
# http://localhost:5173/content-audit
```

---

## 📝 后续优化建议

1. **性能优化**
   - [ ] 增加审核结果缓存（相同内容不重复审核）
   - [ ] 批量审核接口（一次提交多条内容）
   - [ ] 异步审核队列（视频等耗时内容）

2. **功能增强**
   - [ ] 审核员权限管理（多级审核）
   - [ ] 审核统计报表（日报/周报）
   - [ ] 违规用户黑名单
   - [ ] 审核规则配置（自定义敏感词）

3. **监控告警**
   - [ ] 待审核数量告警（>100 条）
   - [ ] 审核时长告警（>24 小时）
   - [ ] 异常内容告警（短时间内大量违规）

---

## ✅ 验收签字

- [ ] 数据库表创建成功
- [ ] 5 个云函数部署成功
- [ ] 前端审核工具集成完成
- [ ] 管理后台审核池可用
- [ ] 违规内容拦截率≥99.9%

**验收人**: _______________  
**验收日期**: _______________  
**验收结果**: □ 通过  □ 不通过

---

**部署完成！🎉**
