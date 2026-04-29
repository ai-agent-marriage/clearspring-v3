# 生产环境配置指南

**创建时间**: 2026-04-05  
**更新时间**: 2026-04-05 18:17  
**状态**: ✅ 核心配置已完成

---

## 📋 生产环境配置清单

### 1. 域名配置

#### ✅ 已配置信息
- **主域名**: `springs.dexoconnect.com`
- **API 域名**: `https://springs.dexoconnect.com`
- **服务器 IP**: `101.96.192.63`（火山云）

#### HTTPS 证书状态 ✅

| 项目 | 状态 | 详情 |
|------|------|------|
| Certbot 安装 | ✅ | 已安装 |
| SSL 证书 | ✅ | 有效期至 2026-06-28（84 天） |
| Nginx HTTPS | ✅ | HTTP/2 200 响应正常 |
| HTTP→HTTPS 跳转 | ✅ | 301 重定向配置正确 |
| SSL 安全配置 | ✅ | TLSv1.2 + TLSv1.3 |
| 证书自动续期 | ✅ | 每日 2 点自动执行 |

#### 后续可选域名

| 用途 | 域名 | 状态 |
|------|------|------|
| 管理后台 | `admin.springs.dexoconnect.com` | ⏳ 可选配置 |
| 文件存储 | `cdn.springs.dexoconnect.com` | ⏳ 可选配置 |

---

### 2. HTTPS 证书配置

#### 方案 A：Let's Encrypt（免费，推荐）

**优点**:
- ✅ 免费
- ✅ 自动续期（90 天）
- ✅ 广泛支持

**配置步骤**:

```bash
# 1. 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# 2. 获取证书
sudo certbot --nginx -d api.clearspring.org

# 3. 自动续期测试
sudo certbot renew --dry-run
```

#### 方案 B：火山云证书（付费）

**优点**:
- ✅ 一年有效
- ✅ 火山云自动管理
- ✅ 支持通配符证书

**价格**: 约 ¥1000/年

---

### 3. Nginx 配置

#### API 服务器配置

```nginx
server {
    listen 443 ssl http2;
    server_name api.clearspring.org;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/api.clearspring.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.clearspring.org/privkey.pem;
    
    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # 反向代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 日志
    access_log /var/log/nginx/api.clearspring.org.access.log;
    error_log /var/log/nginx/api.clearspring.org.error.log;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name api.clearspring.org;
    return 301 https://$server_name$request_uri;
}
```

---

### 4. 防火墙配置

#### 火山云安全组

| 端口 | 协议 | 用途 | 允许访问 |
|------|------|------|---------|
| 443 | TCP | HTTPS | 0.0.0.0/0 |
| 80 | TCP | HTTP（重定向） | 0.0.0.0/0 |
| 22 | TCP | SSH | 仅信任 IP |
| 3000 | TCP | Node.js（内网） | 127.0.0.1 |

#### 配置命令

```bash
# 开放 443 端口
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp

# 限制 SSH（替换为你的 IP）
sudo ufw allow from YOUR_IP to any port 22

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

### 5. PM2 生产配置

#### ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'clearspring-api',
    script: 'app.js',
    instances: 'max',  // 使用所有 CPU 核心
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      LOG_LEVEL: 'info'
    },
    error_file: '/var/log/pm2/clearspring-api-error.log',
    out_file: '/var/log/pm2/clearspring-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

---

### 6. 环境变量配置

#### .env.production

```bash
# 服务器配置
NODE_ENV=production
PORT=3000

# 域名配置
API_DOMAIN=https://api.clearspring.org
ADMIN_DOMAIN=https://admin.clearspring.org

# 微信小程序
WX_APP_ID=wxa914ecc15836bda6
WX_APP_SECRET=your_secret_here

# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clearspring_v3
DB_USER=clearspring
DB_PASSWORD=your_password_here

# 火山云
VOLCANO_ACCESS_KEY=your_access_key
VOLCANO_SECRET_KEY=your_secret_key
VOLCANO_BUCKET=clearspring-assets

# 日志
LOG_LEVEL=info
LOG_FILE=/var/log/clearspring/api.log
```

---

### 7. 监控配置

#### PM2 监控

```bash
# 安装 pm2-logrotate
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

#### 系统监控

```bash
# 安装 htop
sudo apt install htop

# 安装 nmon
sudo apt install nmon

# 查看实时日志
pm2 logs clearspring-api --lines 100
```

---

### 8. 备份策略

#### 数据库备份

```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh

BACKUP_DIR="/var/backups/clearspring"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="clearspring_v3"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u clearspring -p'password' $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/db_$DATE.sql

# 删除 7 天前的备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

#### 定时任务

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 3 点备份
0 3 * * * /usr/local/bin/backup-db.sh >> /var/log/clearspring/backup.log 2>&1
```

---

### 9. 小程序域名配置

#### 微信公众平台配置

1. 登录 https://mp.weixin.qq.com
2. 开发 → 开发管理 → 开发设置
3. 服务器域名配置：
   - **request 合法域名**: `https://api.clearspring.org`
   - **uploadFile 合法域名**: `https://api.clearspring.org`
   - **downloadFile 合法域名**: `https://api.clearspring.org`
   - **socket 合法域名**: `wss://api.clearspring.org`

---

### 10. 验证清单

- [ ] 域名 DNS 解析正确
- [ ] HTTPS 证书安装成功
- [ ] Nginx 配置正确
- [ ] 防火墙规则生效
- [ ] PM2 进程正常运行
- [ ] 环境变量配置正确
- [ ] 数据库备份正常
- [ ] 监控告警配置
- [ ] 小程序域名白名单
- [ ] 健康检查通过

---

## 🚀 快速配置脚本

```bash
#!/bin/bash
# production-setup.sh

set -e

echo "🚀 开始生产环境配置..."

# 1. 安装 Nginx
sudo apt update
sudo apt install nginx -y

# 2. 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 3. 创建 PM2 日志目录
sudo mkdir -p /var/log/pm2
sudo chown clearspring-bot:clearspring-bot /var/log/pm2

# 4. 创建备份目录
sudo mkdir -p /var/backups/clearspring

# 5. 配置防火墙
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp

# 6. 重启服务
sudo systemctl restart nginx
pm2 restart clearspring-api

echo "✅ 生产环境配置完成！"
```

---

## 📞 问题排查

### 常见问题

**问题 1**: HTTPS 证书无效

**解决**:
```bash
sudo certbot renew
sudo systemctl restart nginx
```

**问题 2**: Nginx 无法启动

**解决**:
```bash
sudo nginx -t  # 检查配置
sudo systemctl status nginx
sudo journalctl -xe
```

**问题 3**: 端口被占用

**解决**:
```bash
sudo lsof -i:3000
sudo kill -9 <PID>
```

---

**最后更新**: 2026-04-05  
**维护者**: ClearSpring V3 Team
