# 清如 ClearSpring V2.0 - 开发环境配置指南

**文档版本**: V1.0  
**创建时间**: 2026-04-16  
**适用系统**: Windows / macOS / Linux

---

## 🖥️ 系统要求

### 最低配置
- **操作系统**: Windows 10 / macOS 10.15 / Ubuntu 18.04
- **CPU**: 4 核心
- **内存**: 8 GB
- **磁盘**: 20 GB 可用空间
- **网络**: 稳定互联网连接

### 推荐配置
- **操作系统**: Windows 11 / macOS 12+ / Ubuntu 20.04+
- **CPU**: 8 核心
- **内存**: 16 GB
- **磁盘**: 50 GB SSD
- **网络**: 高速互联网连接

---

## 📦 必需软件

### 1. Node.js

**版本要求**: Node.js 18.x LTS（推荐 18.20.0+）

**安装步骤**:

#### Windows/macOS
```bash
# 下载安装包
https://nodejs.org/dist/v18.20.0/node-v18.20.0-x64.msi  # Windows
https://nodejs.org/dist/v18.20.0/node-v18.20.0.pkg      # macOS

# 验证安装
node -v  # 应输出 v18.20.0
npm -v   # 应输出 10.x
```

#### Linux (Ubuntu/Debian)
```bash
# 使用 NVM 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 验证安装
node -v
npm -v
```

**npm 配置**（中国大陆用户）:
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
```

---

### 2. 微信开发者工具

**版本要求**: Stable Build 1.06.2308310+

**安装步骤**:

#### Windows
```bash
# 下载
https://developers.weixin.qq.com/miniprogram/dev/devtools/stable-build.html

# 安装后配置
1. 打开微信开发者工具
2. 设置 → 安全 → 开启"服务端口"
3. 设置 → 通用设置 → 小程序项目 → 数据目录（建议 SSD）
```

#### macOS
```bash
# 下载 DMG 安装包
# 拖拽到 Applications 文件夹
# 首次启动需授权辅助功能权限
```

#### Linux
```bash
# 官方未提供 Linux 版本，可使用以下替代方案：
# 方案 1: Wine（不推荐，兼容性差）
# 方案 2: 虚拟机（推荐）
# 方案 3: 使用 VSCode + 小程序插件（仅开发，无法真机调试）
```

**IDE 设置**:
```
1. 编辑 → 设置 → 文件类型关联
   - 添加 .wxss 为 CSS 类型
   - 添加 .wxml 为 HTML 类型

2. 编辑 → 设置 → 代码保护
   - 关闭"上传时自动压缩代码"（开发阶段）

3. 终端 → 本地服务端口
   - 确保端口 56751 未被占用
```

---

### 3. Git

**版本要求**: Git 2.30+

**安装步骤**:

#### Windows
```bash
# 下载
https://git-scm.com/download/win

# 安装时选择：
- 使用 Git Bash
- 使用 VSCode 作为 Git 编辑器
- Git 包含在 PATH 中
```

#### macOS
```bash
# 使用 Homebrew
brew install git

# 或使用 Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

**Git 配置**:
```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置 SSH Key
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub  # 复制到 GitHub

# 配置 GitHub
# Settings → SSH and GPG keys → New SSH key
```

---

### 4. VSCode（推荐 IDE）

**版本要求**: VSCode 1.80+

**安装步骤**:
```bash
# 下载
https://code.visualstudio.com/download

# 必需插件：
1. ESLint（dbaeumer.vscode-eslint）
2. Prettier（esbenp.prettier-vscode）
3. Vetur（pineapples.vetur）- Vue 2 支持
4. Volar（Vue.volar）- Vue 3 支持
5. WXML（qiu8310.minapp-vscode）- 小程序支持
6. GitLens（eamodio.gitlens）- Git 增强
7. Path Intellisense（christian-kohler.path-intellisense）
```

**VSCode 设置**（settings.json）:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.encoding": "utf8",
  "files.eol": "\n",
  "eslint.validate": [
    "javascript",
    "vue",
    "typescript"
  ],
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[wxml]": {
    "editor.defaultFormatter": "qiu8310.minapp-vscode"
  }
}
```

---

## 🔧 项目初始化

### 1. 克隆项目

```bash
# 克隆仓库
git clone git@github.com:ai-agent-marriage/clearspring-v3.git
cd clearspring-v3

# 查看分支
git branch -a

# 切换到开发分支
git checkout dev
```

---

### 2. 小程序端配置

```bash
# 进入小程序目录
cd miniprogram

# 安装依赖（小程序端通常无需 npm  install）
# 如需使用 npm 包：
npm install

# 配置项目信息
# 1. 打开微信开发者工具
# 2. 导入项目（选择 miniprogram 目录）
# 3. 修改 project.config.json 中的 AppID

# 修改配置
# file: project.config.json
{
  "appid": "wxa914ecc15836bda6",  // 替换为你的 AppID
  "projectname": "clearspring-v3",
  "setting": {
    "es6": true,
    "minified": false,
    "postcss": true
  }
}
```

**导入小程序项目**:
```
1. 打开微信开发者工具
2. 项目 → 导入项目
3. 选择 miniprogram 目录
4. 填入 AppID（测试账号可用测试号）
5. 点击导入
```

---

### 3. WEB 管理后台配置

```bash
# 进入后台目录
cd admin-vue3

# 安装依赖
npm install

# 配置环境变量
# file: .env
VITE_APP_TITLE=清如管理后台
VITE_APP_BASE_API=https://api.clearspring.example.com
VITE_APP_WECHAT_API=https://api.weixin.qq.com

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

**常见问题**:
```bash
# 问题 1: npm install 失败
解决方案：删除 node_modules 和 package-lock.json，重新安装
rm -rf node_modules package-lock.json
npm install

# 问题 2: 端口被占用
解决方案：修改 vite.config.js 中的 port
# vite.config.js
server: {
  port: 5174  // 改为其他端口
}

# 问题 3: 热更新不生效
解决方案：检查 Vite 配置，确保 include 正确
```

---

### 4. 后端 API 配置

```bash
# 进入 API 目录
cd api

# 安装依赖
npm install

# 配置环境变量
# file: .env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clearspring_v3
JWT_SECRET=your_jwt_secret
WECHAT_APPID=wxa914ecc15836bda6
WECHAT_SECRET=your_wechat_secret

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000/api/health
```

**数据库初始化**:
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE clearspring_v3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入表结构
mysql -u root -p clearspring_v3 < database/migrations/001_initial_schema.sql

# 导入种子数据
mysql -u root -p clearspring_v3 < database/seeds/species.sql
```

---

### 5. 云函数配置

```bash
# 进入云函数目录
cd cloudfunctions/generateCertificate

# 安装依赖
npm install

# 配置云开发环境
# 1. 打开微信开发者工具
# 2. 云开发 → 环境选择
# 3. 选择 cloud1-7ga68ls3ccebbe5b

# 上传云函数
# 右键云函数目录 → 上传并部署：云端安装依赖
```

---

## 🧪 测试环境配置

### 1. E2E 测试（Playwright）

```bash
# 安装 Playwright
npm install -D @playwright/test

# 安装浏览器
npx playwright install

# 运行测试
npm run test:e2e

# 调试模式
npm run test:e2e:debug

# 生成报告
npm run test:e2e:report
```

**配置文件**（playwright.config.js）:
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'mobile-chrome',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5'],
      },
    },
  ],
});
```

---

### 2. 单元测试（Vitest）

```bash
# 安装 Vitest
npm install -D vitest @vitest/coverage-v8

# 运行测试
npm run test:unit

# 带覆盖率
npm run test:unit:coverage
```

---

## 🚀 部署环境配置

### 1. 服务器要求

**火山云服务器**:
- IP: 101.96.192.63
- 系统: Ubuntu 20.04 LTS
- Node.js: 18.x
- PM2: latest
- Nginx: latest
- MySQL: 8.0

**SSH 配置**:
```bash
# 生成 SSH Key
ssh-keygen -t ed25519

# 配置 SSH config
# file: ~/.ssh/config
Host clearspring
  HostName 101.96.192.63
  User admin
  IdentityFile ~/.ssh/id_ed25519
  Port 22

# 测试连接
ssh clearspring
```

---

### 2. PM2 配置

```bash
# 全局安装 PM2
npm install -g pm2

# 配置 PM2
# file: deploy/pm2/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'clearspring-api',
    script: './api/src/app.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};

# 启动应用
pm2 start deploy/pm2/ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs clearspring-api

# 重启
pm2 restart clearspring-api

# 开机自启
pm2 startup
pm2 save
```

---

### 3. Nginx 配置

```nginx
# file: deploy/nginx/production.conf
server {
    listen 80;
    server_name api.clearspring.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SSL 配置（生产环境）
    # listen 443 ssl;
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;
}
```

---

## 🐛 常见问题

### 问题 1: 小程序编译报错

**错误信息**:
```
app.json 中缺少 pages 声明
```

**解决方案**:
```json
// file: app.json
{
  "pages": [
    "pages/index/index",
    "pages/audio-player/audio-player",
    // ... 所有页面路径
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#4A5D4E",
    "navigationBarTitleText": "清如",
    "navigationBarTextStyle": "white"
  }
}
```

---

### 问题 2: npm install 卡住

**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install

# 如仍失败，尝试 yarn
npm install -g yarn
yarn install
```

---

### 问题 3: Git 提交失败

**错误信息**:
```
Permission denied (publickey)
```

**解决方案**:
```bash
# 检查 SSH Key
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub
# Settings → SSH and GPG keys → New SSH key

# 测试连接
ssh -T git@github.com
```

---

### 问题 4: 数据库连接失败

**错误信息**:
```
ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

**解决方案**:
```bash
# 检查 MySQL 服务
sudo systemctl status mysql

# 重置 root 密码
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;

# 检查.env 配置
# 确保 DB_PASSWORD 正确
```

---

## 📞 获取帮助

### 官方文档
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Playwright 文档](https://playwright.dev/)

### 项目文档
- PRD: `docs/PRD_V2.0.0_COMPLETE.md`
- 技术选型: `docs/TECH_STACK.md`
- 项目结构: `docs/PROJECT_STRUCTURE.md`
- 代码规范: `docs/CODING_STANDARD.md`

### 联系方式
- GitHub Issues: https://github.com/ai-agent-marriage/clearspring-v3/issues
- 项目群：飞书群「清如 ClearSpring 开发组」

---

## ✅ 环境检查清单

开发环境配置完成后，请逐项检查：

- [ ] Node.js 版本 ≥ 18.20.0
- [ ] npm 版本 ≥ 10.x
- [ ] 微信开发者工具已安装并开启服务端口
- [ ] Git 已安装并配置 SSH Key
- [ ] VSCode 已安装必需插件
- [ ] 小程序项目已导入微信开发者工具
- [ ] WEB 后台可正常启动（http://localhost:5173）
- [ ] 后端 API 可正常启动（http://localhost:3000）
- [ ] 数据库已初始化
- [ ] 云函数已上传并部署
- [ ] E2E 测试可正常运行

---

*文档创建时间*: 2026-04-16 10:55 UTC  
*最后更新*: 2026-04-16 10:55 UTC
