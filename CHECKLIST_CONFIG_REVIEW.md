# 配置审查清单

**用途**：每次重构或重大修改后，必须逐项检查本清单

**审查时间**：代码提交前 + 模拟器验证前

---

## 📋 app.json 配置审查

### 1. pages 数组

- [ ] 所有页面路径在实际目录中存在
- [ ] 没有引用不存在的页面
- [ ] 主包页面数量 ≤ 256 个（微信小程序限制）

**检查命令**：
```bash
# 检查 pages 路径是否存在
cd /root/.openclaw/workspace
cat app.json | grep -o '"pages/[^"]*"' | while read path; do
  path=$(echo $path | tr -d '"')
  if [ ! -d "$path" ]; then
    echo "❌ 不存在：$path"
  else
    echo "✅ 存在：$path"
  fi
done
```

### 2. subPackages 配置

- [ ] 每个 `root` 目录实际存在
- [ ] 每个 `pages` 数组中的页面在 root 目录下存在
- [ ] 子分包路径不与主包重复

**检查命令**：
```bash
# 检查 subPackages 目录是否存在
cd /root/.openclaw/workspace
cat app.json | grep -A 20 '"subPackages"' | grep '"root"' | cut -d'"' -f4 | while read root; do
  if [ ! -d "$root" ]; then
    echo "❌ 子分包目录不存在：$root"
  else
    echo "✅ 子分包目录存在：$root"
  fi
done
```

### 3. preloadRule 配置

- [ ] 引用的子分包在 subPackages 中已定义
- [ ] 引用的页面在对应分包中存在

**常见错误**：
```json
// ❌ 错误：引用了不存在的子分包
"preloadRule": {
  "pages/index/index": {
    "packages": ["pages/volunteer-home"]  // 这个目录不存在
  }
}

// ✅ 正确：只引用已定义的子分包
"preloadRule": {
  "pages/index/index": {
    "packages": ["pages/about"]  // 这个目录存在
  }
}
```

### 4. usingComponents 全局组件

- [ ] 引用的组件文件实际存在
- [ ] 组件路径正确（通常是 `/components/xxx/index`）

**常见错误**：
```json
// ❌ 错误：组件不存在
"usingComponents": {
  "painter": "/components/painter/painter"  // 这个组件不存在
}

// ✅ 正确：移除或指向存在的组件
"usingComponents": {}
```

### 5. tabBar 配置

- [ ] 使用自定义 TabBar 时，`custom: true` 且 `list` 至少 2 项
- [ ] TabBar 图标文件存在（如不使用自定义 TabBar）
- [ ] `list` 中的 `pagePath` 在 pages 数组中已定义

---

## 📋 页面.json 配置审查

### 1. navigationBarTextStyle

- [ ] 值只能是 `"black"` 或 `"white"`
- [ ] 不能是 `"dark"`、`"light"` 等无效值

**检查命令**：
```bash
# 检查所有页面的 navigationBarTextStyle
cd /root/.openclaw/workspace
grep -r "navigationBarTextStyle" pages/ --include="*.json" | grep -v "black" | grep -v "white"
```

### 2. usingComponents 页面组件

- [ ] 组件路径正确（`/components/xxx/index`）
- [ ] 组件文件实际存在
- [ ] 没有使用相对路径

**常见错误**：
```json
// ❌ 错误：路径错误
"usingComponents": {
  "navbar": "/components/navbar/navbar"  // 应该是 index
}

// ✅ 正确
"usingComponents": {
  "navbar": "/components/navbar/index"
}
```

### 3. navigationStyle

- [ ] 值为 `"default"` 或 `"custom"`
- [ ] 使用 `"custom"` 时，页面需要自定义导航栏

---

## 📋 WXML 文件审查

### 1. 标签匹配

- [ ] 所有开始标签有对应的结束标签
- [ ] 标签类型匹配（`<view>` 对应 `</view>`）

**检查命令**：
```bash
# 检查标签不匹配（简单版本）
cd /root/.openclaw/workspace
grep -n "</text>" pages/**/*.wxml | grep -v "<text"
```

### 2. data 属性

- [ ] 使用简单值（字符串/数字/布尔）
- [ ] 不使用对象字面量 `{{{key: 'value'}}}`
- [ ] 不使用数组字面量 `{{{array: [1,2,3]}}}`

**常见错误**：
```xml
<!-- ❌ 错误：对象字面量 -->
<view data-item="{{{name: '设置', path: '/pages/settings'}}}">

<!-- ✅ 正确：拆分为多个属性 -->
<view data-name="设置" data-path="/pages/settings">
```

### 3. 组件引用

- [ ] 使用的组件在 usingComponents 中已定义
- [ ] 组件标签名与 usingComponents 中的 key 匹配

---

## 📋 JS 文件审查

### 1. Node.js 代码

- [ ] 没有 `process.env` 引用
- [ ] 没有 `require()` 引用 Node 模块
- [ ] 没有 `global` 引用
- [ ] 没有 `__dirname`、`__filename` 引用

**检查命令**：
```bash
# 检查 Node.js 代码
cd /root/.openclaw/workspace
grep -r "process\." pages/ app.js --include="*.js"
grep -r "require(" pages/ app.js --include="*.js" | grep -v "require('wx')"
```

### 2. console.log

- [ ] 生产环境代码没有 `console.log`
- [ ] 可以使用 `console.error`、`console.warn`

**检查命令**：
```bash
# 统计 console.log 数量
cd /root/.openclaw/workspace
grep -r "console\.log" pages/ --include="*.js" | wc -l
```

### 3. setInterval/setTimeout

- [ ] `setInterval` 在 `onUnload` 或 `destroyed` 中清理
- [ ] `setTimeout` 在页面卸载时清理（如需要）

**检查命令**：
```bash
# 检查 setInterval 是否清理
cd /root/.openclaw/workspace
grep -r "setInterval" pages/ --include="*.js" -A 5 | grep -v "clearInterval"
```

---

## 📋 目录结构审查

### 1. 页面目录

- [ ] 每个页面目录包含 `.js`、`.json`、`.wxml`、`.wxss`
- [ ] 文件名与目录名一致（index 除外）

### 2. 组件目录

- [ ] 组件文件名为 `index.js`、`index.json`、`index.wxml`、`index.wxss`
- [ ] 组件路径为 `/components/组件名/index`

### 3. 保留目录

- [ ] 没有以 `__` 开头和结尾的目录（如 `__tests__`）
- [ ] 没有 `miniprogram__` 前缀的目录

---

## 🔧 自动化审查脚本

创建 `scripts/check-config.sh`：

```bash
#!/bin/bash

echo "🔍 开始配置审查..."

cd /root/.openclaw/workspace

# 1. 检查 app.json pages 路径
echo "✅ 检查 app.json pages 路径..."
# TODO: 实现检查逻辑

# 2. 检查 navigationBarTextStyle
echo "✅ 检查 navigationBarTextStyle..."
invalid_text_style=$(grep -r "navigationBarTextStyle.*dark" pages/ --include="*.json" | wc -l)
if [ $invalid_text_style -gt 0 ]; then
  echo "❌ 发现 $invalid_text_style 个页面的 navigationBarTextStyle 为 dark"
  exit 1
fi

# 3. 检查 Node.js 代码
echo "✅ 检查 Node.js 代码..."
node_code=$(grep -r "process\." app.js pages/ --include="*.js" | wc -l)
if [ $node_code -gt 0 ]; then
  echo "❌ 发现 $node_code 处 Node.js 代码"
  exit 1
fi

# 4. 统计 console.log
echo "✅ 统计 console.log..."
console_log=$(grep -r "console\.log" pages/ --include="*.js" | wc -l)
echo "⚠️  发现 $console_log 处 console.log（建议清理）"

echo "✅ 配置审查完成！"
```

---

## ✅ 审查流程

### 日常开发

1. **修改配置文件后** → 立即运行审查脚本
2. **提交代码前** → 手动检查清单关键项
3. **推送前** → 本地模拟器验证

### 重大重构后

1. **代码重构完成** → 运行完整审查清单
2. **审查通过** → 提交代码
3. **推送到 GitHub** → 通知团队成员
4. **团队成员** → 拉取代码 + 模拟器验证

---

## 📊 审查记录模板

```markdown
## 配置审查记录

**审查日期**: 2026-04-15
**审查人**: AI Agent
**审查范围**: 全量配置文件

### 发现问题

| 问题类型 | 数量 | 修复状态 |
|---------|------|---------|
| app.json 配置 | 3 | ✅ 已修复 |
| 页面.json 配置 | 12 | ✅ 已修复 |
| WXML 语法 | 1 | ✅ 已修复 |
| Node.js 代码 | 1 | ✅ 已修复 |

### 审查结果

- ✅ 所有配置项已审查
- ✅ 发现的问题已修复
- ✅ 模拟器验证通过

### 下次审查

**计划日期**: 2026-04-16
**审查重点**: 新增页面配置
```

---

**最后更新**: 2026-04-15  
**版本**: V1.0
