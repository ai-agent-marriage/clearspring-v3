# 小程序 Lint 工具配置

**用途**：自动化检查小程序代码质量和配置问题

**工具选择**：微信小程序官方工具 + ESLint 插件

---

## 🛠️ 工具安装

### 1. 安装微信小程序模拟器

```bash
# 全局安装
npm install -g miniprogram-simulate

# 验证安装
miniprogram-simulate --version
```

### 2. 安装 ESLint 插件

```bash
cd /home/admin/.openclaw/workspace

# 安装 ESLint
npm install --save-dev eslint

# 安装微信小程序 ESLint 插件
npm install --save-dev eslint-plugin-miniprogram

# 安装小程序专用解析器
npm install --save-dev @typescript-eslint/parser
```

### 3. 初始化 ESLint 配置

```bash
cd /home/admin/.openclaw/workspace
npx eslint --init
```

---

## 📋 ESLint 配置

创建 `.eslintrc.js`：

```javascript
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: false,
  },
  plugins: [
    'miniprogram',
  ],
  extends: [
    'eslint:recommended',
    'plugin:miniprogram/recommended',
  ],
  rules: {
    // 小程序专用规则
    'miniprogram/no-global': 'error',          // 禁止使用 global
    'miniprogram/no-process': 'error',         // 禁止使用 process
    'miniprogram/no-require': 'warn',          // 限制使用 require
    'miniprogram/no-console': 'warn',          // 限制使用 console
    
    // 代码质量规则
    'no-unused-vars': 'warn',                  // 未使用的变量
    'no-undef': 'error',                       // 未定义的变量
    'eqeqeq': 'error',                         // 使用 === 和 !==
    'curly': 'error',                          // 强制使用大括号
    
    // 小程序 API 规则
    'miniprogram/no-async-in-loop': 'warn',    // 循环中避免异步
    'miniprogram/no-timer-in-loop': 'error',   // 循环中禁止定时器
  },
  globals: {
    // 微信小程序全局变量
    'wx': 'readonly',
    'App': 'readonly',
    'Page': 'readonly',
    'Component': 'readonly',
    'getApp': 'readonly',
    'getCurrentPages': 'readonly',
  },
};
```

---

## 🔧 检查脚本

### 1. 创建 `package.json` scripts

```json
{
  "scripts": {
    "lint": "eslint pages/ app.js --ext .js",
    "lint:fix": "eslint pages/ app.js --ext .js --fix",
    "check:config": "bash scripts/check-config.sh",
    "check:wxml": "bash scripts/check-wxml.sh",
    "verify": "npm run lint && npm run check:config && npm run check:wxml"
  }
}
```

### 2. 创建配置检查脚本 `scripts/check-config.sh`

```bash
#!/bin/bash

echo "🔍 开始配置检查..."

cd /home/admin/.openclaw/workspace
errors=0

# 1. 检查 app.json pages 路径
echo "✅ 检查 app.json pages 路径..."
while IFS= read -r path; do
  path=$(echo $path | tr -d '", ')
  if [[ $path == pages/* ]]; then
    if [ ! -d "$path" ]; then
      echo "❌ 页面目录不存在：$path"
      ((errors++))
    fi
  fi
done < <(grep -o '"pages/[^"]*"' app.json)

# 2. 检查 navigationBarTextStyle
echo "✅ 检查 navigationBarTextStyle..."
while IFS= read -r line; do
  file=$(echo $line | cut -d: -f1)
  value=$(echo $line | cut -d: -f2)
  if [[ $value == *"dark"* ]]; then
    echo "❌ navigationBarTextStyle 不能为 dark: $file"
    ((errors++))
  fi
done < <(grep -r "navigationBarTextStyle" pages/ --include="*.json")

# 3. 检查 Node.js 代码
echo "✅ 检查 Node.js 代码..."
while IFS= read -r line; do
  file=$(echo $line | cut -d: -f1)
  echo "❌ 发现 Node.js 代码：$file"
  ((errors++))
done < <(grep -r "process\." pages/ app.js --include="*.js" 2>/dev/null)

# 4. 统计 console.log
console_count=$(grep -r "console\.log" pages/ --include="*.js" | wc -l)
if [ $console_count -gt 0 ]; then
  echo "⚠️  发现 $console_count 处 console.log（建议清理）"
fi

# 5. 检查组件路径
echo "✅ 检查组件路径..."
while IFS= read -r line; do
  file=$(echo $line | cut -d: -f1)
  if [[ $line == *"/components/"*"/navbar"* ]] && [[ $line != *"/index"* ]]; then
    echo "⚠️  组件路径可能错误（应该是 index）: $file"
  fi
done < <(grep -r "usingComponents" pages/ --include="*.json" -A 3)

echo ""
if [ $errors -gt 0 ]; then
  echo "❌ 发现 $errors 个错误"
  exit 1
else
  echo "✅ 配置检查通过！"
  exit 0
fi
```

### 3. 创建 WXML 检查脚本 `scripts/check-wxml.sh`

```bash
#!/bin/bash

echo "🔍 开始 WXML 检查..."

cd /home/admin/.openclaw/workspace
errors=0

# 1. 检查 view 标签匹配
echo "✅ 检查 view 标签匹配..."
for wxml_file in $(find pages/ -name "*.wxml"); do
  open_count=$(grep -o "<view" "$wxml_file" | wc -l)
  close_count=$(grep -o "</view>" "$wxml_file" | wc -l)
  if [ $open_count -ne $close_count ]; then
    echo "❌ view 标签不匹配：$wxml_file (开:$open_count 闭:$close_count)"
    ((errors++))
  fi
done

# 2. 检查 text 标签匹配
echo "✅ 检查 text 标签匹配..."
for wxml_file in $(find pages/ -name "*.wxml"); do
  open_count=$(grep -o "<text" "$wxml_file" | wc -l)
  close_count=$(grep -o "</text>" "$wxml_file" | wc -l)
  if [ $open_count -ne $close_count ]; then
    echo "❌ text 标签不匹配：$wxml_file (开:$open_count 闭:$close_count)"
    ((errors++))
  fi
done

# 3. 检查 data 属性语法
echo "✅ 检查 data 属性语法..."
while IFS= read -r line; do
  file=$(echo $line | cut -d: -f1)
  line_num=$(echo $line | cut -d: -f2)
  if [[ $line == *"data-"*"{{{"* ]]; then
    echo "⚠️  data 属性使用对象字面量：$file:$line_num"
  fi
done < <(grep -rn "data-" pages/ --include="*.wxml" | grep "{{{")

echo ""
if [ $errors -gt 0 ]; then
  echo "❌ 发现 $errors 个错误"
  exit 1
else
  echo "✅ WXML 检查通过！"
  exit 0
fi
```

---

## 🚀 使用方法

### 日常开发

```bash
# 运行所有检查
npm run verify

# 只运行 ESLint
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 只检查配置文件
npm run check:config

# 只检查 WXML 文件
npm run check:wxml
```

### CI/CD 集成

在 GitHub Actions 中添加检查步骤：

```yaml
name: Code Quality Check

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run linter
        run: npm run verify
```

---

## 📊 检查报告

运行检查后生成报告：

```bash
npm run verify > verify-report.txt 2>&1
```

报告内容示例：

```
🔍 开始配置检查...
✅ 检查 app.json pages 路径...
✅ 检查 navigationBarTextStyle...
✅ 检查 Node.js 代码...
⚠️  发现 278 处 console.log（建议清理）
✅ 检查组件路径...

✅ 配置检查通过！

🔍 开始 WXML 检查...
✅ 检查 view 标签匹配...
✅ 检查 text 标签匹配...
✅ 检查 data 属性语法...

✅ WXML 检查通过！

📊 检查完成！
- 配置检查：✅ 通过
- WXML 检查：✅ 通过
- ESLint: ⚠️  37 个警告
```

---

## 🎯 检查规则说明

### P0 错误（必须修复）

| 规则 | 说明 | 示例 |
|------|------|------|
| no-process | 禁止 Node.js process | `process.env.NODE_ENV` ❌ |
| no-global | 禁止 global 对象 | `global.xxx` ❌ |
| 标签匹配 | WXML 标签必须成对 | `<view></text>` ❌ |
| 配置路径 | 引用的目录必须存在 | `pages/xxx` 不存在 ❌ |

### P1 警告（建议修复）

| 规则 | 说明 | 示例 |
|------|------|------|
| no-console | 限制 console.log | `console.log()` ⚠️ |
| no-unused-vars | 未使用的变量 | `let x = 1` 未使用 ⚠️ |
| data 属性 | 避免对象字面量 | `data-item="{{{...}}}"` ⚠️ |

### P2 建议（可选优化）

| 规则 | 说明 | 示例 |
|------|------|------|
| eqeqeq | 使用严格相等 | `==` → `===` 💡 |
| curly | 强制大括号 | `if(x) return` → `if(x){return}` 💡 |

---

## 🔗 相关文档

- [配置审查清单](./CHECKLIST_CONFIG_REVIEW.md)
- [模拟器验证流程](./WORKFLOW_SIMULATOR_VERIFY.md)
- [ESLint 官方文档](https://eslint.org/docs/user-guide/getting-started)
- [微信小程序 ESLint 插件](https://github.com/wechat-miniprogram/eslint-plugin-miniprogram)

---

**最后更新**: 2026-04-15  
**版本**: V1.0
