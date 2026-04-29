# Git 分支管理策略

## 分支结构

```
main (生产环境)
  ↑
staging (预发布环境)
  ↑
develop (开发环境)
  ↑
feature/* (功能分支)
```

## 分支说明

### main - 生产分支
- **用途**: 存放生产环境的稳定代码
- **保护**: 禁止直接推送，只能通过 Pull Request 合并
- **部署**: 自动部署到生产环境
- **版本标签**: 每次合并都打标签 (v1.0.0, v1.1.0, etc.)

### staging - 预发布分支
- **用途**: 存放待发布的代码，用于最终测试
- **保护**: 禁止直接推送，需要 Code Review
- **部署**: 自动部署到预发布环境
- **灰度发布**: 从此分支进行灰度发布

### develop - 开发分支
- **用途**: 日常开发集成分支
- **保护**: 需要至少 1 人 Review
- **部署**: 自动部署到测试环境
- **合并**: 功能分支完成后合并到此分支

### feature/* - 功能分支
- **命名**: feature/功能名称-日期 (如：feature/feedback-0330)
- **用途**: 开发新功能
- **生命周期**: 从 develop 分支，完成后合并回 develop
- **保护**: 无，开发者自由管理

## 工作流程

### 1. 新功能开发
```bash
# 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 开发完成后合并回 develop
git checkout develop
git merge --no-ff feature/new-feature
git push origin develop
```

### 2. 发布流程
```bash
# 从 develop 创建 release 分支
git checkout -b release/v1.0.0

# 在 staging 环境测试
# 修复 bug 后合并到 staging
git checkout staging
git merge --no-ff release/v1.0.0
git push origin staging

# 灰度发布验证
# 验证通过后合并到 main
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### 3. 紧急修复 (Hotfix)
```bash
# 从 main 创建 hotfix 分支
git checkout -b hotfix/bug-fix

# 修复后合并到 main 和 develop
git checkout main
git merge --no-ff hotfix/bug-fix
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

git checkout develop
git merge --no-ff hotfix/bug-fix

git push origin main develop --tags
```

## 灰度发布流程

### 阶段 1: 内部测试 (5%)
```bash
# 从 staging 部署到灰度环境
git checkout staging
# 配置灰度比例 5%
# 监控 2 天
```

### 阶段 2: 扩大测试 (10%)
```bash
# 调整灰度比例到 10%
# 监控 3 天，收集用户反馈
```

### 阶段 3: 大规模测试 (30%)
```bash
# 调整灰度比例到 30%
# 监控 2 天，验证系统稳定性
```

### 阶段 4: 全量发布 (100%)
```bash
# 合并到 main，全量发布
git checkout main
git merge --no-ff staging
git push origin main
```

## 分支保护规则

### main 分支
- [x] 需要 Pull Request
- [x] 至少 2 人批准
- [x] 需要 CI 通过
- [x] 禁止强制推送
- [x] 需要 Code Owner 审核

### staging 分支
- [x] 需要 Pull Request
- [x] 至少 1 人批准
- [x] 需要 CI 通过
- [x] 禁止强制推送

### develop 分支
- [x] 需要 Pull Request
- [x] 至少 1 人批准
- [x] 禁止强制推送

## Commit 规范

### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 示例
```
feat(feedback): 添加用户反馈组件
fix(api): 修复登录接口超时问题
docs(readme): 更新部署文档
```

## 版本命名

遵循语义化版本规范 (Semantic Versioning):

- **MAJOR.MINOR.PATCH** (如：1.2.3)
- MAJOR: 不兼容的 API 变更
- MINOR: 向后兼容的功能性新增
- PATCH: 向后兼容的问题修复
