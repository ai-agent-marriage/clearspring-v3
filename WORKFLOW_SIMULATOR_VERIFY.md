# 模拟器验证流程

**用途**：每次重大重构或配置修改后，必须用微信开发者工具模拟器验证

**验证时机**：代码提交前 + 推送 GitHub 后

---

## 🎯 验证目标

确保小程序能够：
1. ✅ 正常编译（无编译错误）
2. ✅ 正常启动（无运行时错误）
3. ✅ 核心功能可用（TabBar 跳转、页面加载）

---

## 📋 验证步骤

### 步骤 1：拉取最新代码

```bash
cd /e/wechatsoft/clearspring-v3
git pull origin main
```

### 步骤 2：清除缓存

在微信开发者工具中：
1. 菜单栏 → **工具** → **清除缓存**
2. 选择 **清除全部缓存**
3. 等待清除完成

### 步骤 3：重新编译

在微信开发者工具中：
1. 点击 **编译** 按钮
2. 等待编译完成
3. 观察控制台输出

### 步骤 4：检查编译错误

**期望结果**：
- ✅ 控制台无红色错误
- ✅ 无 WXML 编译错误
- ✅ 无 JS 运行时错误

**常见错误处理**：

| 错误类型 | 处理方法 |
|---------|----------|
| WXML 标签不匹配 | 检查开始/结束标签是否匹配 |
| data 属性语法错误 | 改用简单值，不用对象字面量 |
| 组件引用错误 | 检查组件路径和文件名 |
| process is not defined | 移除 Node.js 代码 |

### 步骤 5：检查启动情况

**期望结果**：
- ✅ 模拟器显示首页
- ✅ TabBar 正常显示
- ✅ 页面无白屏

**检查项**：
- [ ] 首页内容正常显示
- [ ] TabBar 图标和文字可见
- [ ] 点击 TabBar 可以切换页面
- [ ] 页面无报错弹窗

### 步骤 6：核心功能测试

**必测功能**：
- [ ] TabBar 切换（所有 Tab 项）
- [ ] 页面跳转（至少 3 个页面）
- [ ] 数据加载（首页数据）
- [ ] 用户交互（点击按钮）

---

## 📊 验证报告模板

```markdown
# 模拟器验证报告

**验证日期**: 2026-04-15
**验证人**: [姓名]
**代码版本**: [Git commit hash]

## 验证环境

- 微信开发者工具版本：[版本号]
- 基础库版本：[版本号]
- 操作系统：[Windows/Mac/Linux]

## 验证结果

### 编译检查

- [✅/❌] 无编译错误
- [✅/❌] 无 WXML 语法错误
- [✅/❌] 无 JS 语法错误

### 启动检查

- [✅/❌] 模拟器正常启动
- [✅/❌] 首页正常显示
- [✅/❌] TabBar 正常显示

### 功能测试

| 功能 | 状态 | 备注 |
|------|------|------|
| TabBar 切换 | ✅/❌ | |
| 页面跳转 | ✅/❌ | |
| 数据加载 | ✅/❌ | |
| 用户交互 | ✅/❌ | |

## 发现的问题

| 问题描述 | 严重程度 | 修复建议 |
|---------|---------|----------|
| | P0/P1/P2 | |

## 验证结论

- [✅/❌] 验证通过
- [✅/❌] 可以提交代码
- [✅/❌] 可以推送 GitHub

## 截图

![首页截图](./screenshots/home.png)
![TabBar 截图](./screenshots/tabbar.png)

---

**下次验证**: [日期]
```

---

## 🔧 自动化验证脚本

### 1. 创建截图脚本 `scripts/screenshot.js`

```javascript
/**
 * 自动截图脚本
 * 用法：node scripts/screenshot.js
 */

const fs = require('fs');
const path = require('path');

// 截图保存目录
const screenshotDir = path.join(__dirname, '../screenshots');

// 创建目录
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

console.log('📸 截图保存至:', screenshotDir);

// 注意：微信开发者工具的自动化 API 需要使用官方工具
// 参考：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html
```

### 2. 创建验证脚本 `scripts/verify-build.sh`

```bash
#!/bin/bash

echo "🔍 开始构建验证..."

cd /home/admin/.openclaw/workspace

# 1. 检查 JSON 文件语法
echo "✅ 检查 JSON 文件语法..."
for json_file in $(find pages/ -name "*.json"); do
  if ! python3 -c "import json; json.load(open('$json_file'))" 2>/dev/null; then
    echo "❌ JSON 语法错误：$json_file"
    exit 1
  fi
done

# 2. 检查 WXML 文件基本语法
echo "✅ 检查 WXML 文件..."
for wxml_file in $(find pages/ -name "*.wxml"); do
  # 检查标签是否成对（简单版本）
  open_tags=$(grep -o "<view" "$wxml_file" | wc -l)
  close_tags=$(grep -o "</view>" "$wxml_file" | wc -l)
  if [ $open_tags -ne $close_tags ]; then
    echo "❌ view 标签不匹配：$wxml_file (开:$open_tags 闭:$close_tags)"
    exit 1
  fi
done

# 3. 检查 JS 文件语法
echo "✅ 检查 JS 文件语法..."
for js_file in $(find pages/ -name "*.js"); do
  if ! node -c "$js_file" 2>/dev/null; then
    # 小程序 JS 可能包含微信 API，node 检查会失败，这里只做基本检查
    if grep -q "process\." "$js_file"; then
      echo "❌ Node.js 代码：$js_file"
      exit 1
    fi
  fi
done

# 4. 统计问题
echo "✅ 统计潜在问题..."
console_log=$(grep -r "console\.log" pages/ --include="*.js" | wc -l)
echo "⚠️  console.log 数量：$console_log"

echo "✅ 构建验证完成！"
```

---

## 📱 真机验证（可选）

### 步骤 1：上传代码

在微信开发者工具中：
1. 点击右上角 **上传**
2. 填写版本号和备注
3. 等待上传完成

### 步骤 2：扫码预览

1. 手机微信扫描开发者工具中的二维码
2. 在真机上测试核心功能
3. 检查性能和兼容性

### 步骤 3：记录问题

- [ ] 性能问题（加载慢、卡顿）
- [ ] 兼容性问题（iOS/Android 差异）
- [ ] 网络问题（请求失败）

---

## 🎯 验证频率

### 日常开发

- **每次提交前**：快速验证（编译 + 启动）
- **每天结束前**：完整验证（核心功能测试）

### 重大重构

- **重构完成后**：完整验证
- **推送 GitHub 后**：团队成员交叉验证

### 发布前

- **版本发布前**：全量验证 + 真机测试

---

## 📊 验证记录

验证记录保存到 `docs/verify-records/` 目录：

```
docs/verify-records/
├── 2026-04-15_verify_report.md
├── 2026-04-16_verify_report.md
└── ...
```

---

## 🔗 相关文档

- [配置审查清单](./CHECKLIST_CONFIG_REVIEW.md)
- [代码审查报告](./CODE_REVIEW_REPORT_V3.md)
- [测试报告](./TEST_REPORT_UNIT_TEST.md)

---

**最后更新**: 2026-04-15  
**版本**: V1.0
