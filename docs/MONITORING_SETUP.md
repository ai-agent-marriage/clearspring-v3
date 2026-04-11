# 监控告警配置指南

**创建时间**: 2026-04-05  
**状态**: 配置中

---

## 📊 监控体系

### 监控层次

```
┌─────────────────────────────────────────┐
│          应用层监控（PM2）               │
│  - 进程状态                             │
│  - 内存使用                             │
│  - CPU 使用                              │
│  - 错误日志                             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          系统层监控（服务器）             │
│  - CPU/内存/磁盘                        │
│  - 网络流量                             │
│  - 端口状态                             │
│  - 进程数                               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          业务层监控（小程序）             │
│  - API 响应时间                          │
│  - 错误率                               │
│  - 用户活跃度                           │
│  - 订单量                               │
└─────────────────────────────────────────┘
```

---

## 🔧 PM2 监控配置

### 1. PM2 Logrotate（日志轮转）

```bash
# 安装日志轮转插件
pm2 install pm2-logrotate

# 配置日志大小限制（10MB）
pm2 set pm2-logrotate:max_size 10000000

# 配置保留文件数（7 个）
pm2 set pm2-logrotate:retain 7

# 启用压缩
pm2 set pm2-logrotate:compress true

# 查看配置
pm2 get pm2-logrotate
```

### 2. PM2 监控面板

```bash
# 安装 PM2 Plus（免费）
pm2 plus

# 或使用本地监控
pm2 monit
```

### 3. PM2 健康检查

**创建健康检查脚本** `/usr/local/bin/pm2-healthcheck.sh`:

```bash
#!/bin/bash

# PM2 进程健康检查
HEALTH=$(pm2 list | grep -c "online")
ERROR=$(pm2 list | grep -c "errored")

if [ $ERROR -gt 0 ]; then
  echo "CRITICAL: $ERROR PM2 process(es) in errored state"
  exit 2
elif [ $HEALTH -eq 0 ]; then
  echo "CRITICAL: No PM2 processes running"
  exit 2
else
  echo "OK: $HEALTH PM2 process(es) running"
  exit 0
fi
```

**添加到 crontab**（每 5 分钟检查）:

```bash
crontab -e

# 添加：
*/5 * * * * /usr/local/bin/pm2-healthcheck.sh >> /var/log/pm2/healthcheck.log 2>&1
```

---

## 🖥️ 服务器监控配置

### 1. 安装监控工具

```bash
# 安装 htop（实时系统监控）
sudo apt install htop -y

# 安装 nmon（性能监控）
sudo apt install nmon -y

# 安装 iotop（IO 监控）
sudo apt install iotop -y

# 安装 iftop（网络监控）
sudo apt install iftop -y
```

### 2. 配置系统监控脚本

**创建监控脚本** `/usr/local/bin/server-monitor.sh`:

```bash
#!/bin/bash

DATE=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="/var/log/server-monitor.log"

# CPU 使用率
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')

# 内存使用率
MEM=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')

# 磁盘使用率
DISK=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')

# 检查阈值
CPU_ALERT=80
MEM_ALERT=80
DISK_ALERT=90

# 记录日志
echo "[$DATE] CPU: ${CPU}% | MEM: ${MEM}% | DISK: ${DISK}%" >> $LOG_FILE

# 告警检查
if (( $(echo "$CPU > $CPU_ALERT" | bc -l) )); then
  echo "[$DATE] ALERT: CPU usage is ${CPU}%" >> $LOG_FILE
  # 发送告警通知（可以集成飞书/邮件）
fi

if (( $(echo "$MEM > $MEM_ALERT" | bc -l) )); then
  echo "[$DATE] ALERT: Memory usage is ${MEM}%" >> $LOG_FILE
fi

if (( $(echo "$DISK > $DISK_ALERT" | bc -l) )); then
  echo "[$DATE] ALERT: Disk usage is ${DISK}%" >> $LOG_FILE
fi
```

**添加到 crontab**（每 10 分钟检查）:

```bash
crontab -e

# 添加：
*/10 * * * * /usr/local/bin/server-monitor.sh
```

### 3. 端口监控

**创建端口监控脚本** `/usr/local/bin/port-monitor.sh`:

```bash
#!/bin/bash

PORTS=(80 443 22 3000)
LOG_FILE="/var/log/port-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

for PORT in "${PORTS[@]}"; do
  if netstat -tuln | grep -q ":$PORT "; then
    echo "[$DATE] PORT $PORT: OK" >> $LOG_FILE
  else
    echo "[$DATE] PORT $PORT: DOWN" >> $LOG_FILE
    # 发送告警
  fi
done
```

---

## 📱 业务监控配置

### 1. API 响应时间监控

**创建监控脚本** `/usr/local/bin/api-monitor.sh`:

```bash
#!/bin/bash

API_URL="https://springs.dexoconnect.com/health"
LOG_FILE="/var/log/api-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# 测试 API 响应时间
START=$(date +%s%N)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -k "$API_URL")
END=$(date +%s%N)

# 计算响应时间（毫秒）
RESPONSE_TIME=$(( (END - START) / 1000000 ))

# 记录日志
echo "[$DATE] HTTP: $HTTP_CODE | Response: ${RESPONSE_TIME}ms" >> $LOG_FILE

# 告警检查
if [ "$HTTP_CODE" != "200" ]; then
  echo "[$DATE] CRITICAL: API returned $HTTP_CODE" >> $LOG_FILE
  # 发送告警
fi

if [ $RESPONSE_TIME -gt 5000 ]; then
  echo "[$DATE] WARNING: API response time ${RESPONSE_TIME}ms > 5000ms" >> $LOG_FILE
fi
```

**添加到 crontab**（每 1 分钟检查）:

```bash
crontab -e

# 添加：
* * * * * /usr/local/bin/api-monitor.sh
```

---

## 🚨 告警通知配置

### 1. 飞书告警机器人

**创建告警脚本** `/usr/local/bin/send-alert.sh`:

```bash
#!/bin/bash

WEBHOOK_URL="YOUR_FEISHU_WEBHOOK_URL"
MESSAGE="$1"

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"msg_type\": \"text\",
    \"content\": {
      \"text\": \"🚨 ClearSpring 告警\n\n$MESSAGE\n\n时间：$(date '+%Y-%m-%d %H:%M:%S')\n服务器：$(hostname)\"
    }
  }"
```

**使用示例**:

```bash
# CPU 告警
/usr/local/bin/send-alert "CPU 使用率超过 80%：${CPU}%"

# PM2 进程异常
/usr/local/bin/send-alert "PM2 进程异常：$ERROR 个进程处于 errored 状态"

# API 不可用
/usr/local/bin/send-alert "API 不可用：HTTP $HTTP_CODE"
```

### 2. 邮件告警（可选）

**配置邮件发送** `/usr/local/bin/send-email-alert.sh`:

```bash
#!/bin/bash

TO="admin@clearspring.org"
SUBJECT="$1"
BODY="$2"

echo "$BODY" | mail -s "$SUBJECT" "$TO"
```

---

## 📊 监控面板

### 1. PM2 实时监控

```bash
# 查看实时日志
pm2 logs clearspring-api --lines 100

# 查看进程状态
pm2 list

# 查看监控面板
pm2 monit
```

### 2. 系统实时监控

```bash
# CPU/内存监控
htop

# 网络监控
iftop

# IO 监控
iotop

# 综合监控
nmon
```

### 3. 日志查看

```bash
# PM2 日志
tail -f /var/log/pm2/clearspring-api-error.log

# Nginx 日志
tail -f /var/log/nginx/springs.dexoconnect.com.error.log

# 系统日志
tail -f /var/log/syslog
```

---

## 📋 监控清单

### 每日检查

- [ ] PM2 进程状态
- [ ] API 响应时间
- [ ] 错误日志数量
- [ ] 磁盘使用率
- [ ] 备份是否执行

### 每周检查

- [ ] 系统更新
- [ ] 日志清理
- [ ] 性能分析
- [ ] 安全审计

### 每月检查

- [ ] SSL 证书有效期
- [ ] 备份恢复测试
- [ ] 监控规则优化
- [ ] 容量规划

---

## 🔧 故障排查流程

### 1. 服务不可用

```bash
# 1. 检查 PM2 进程
pm2 list

# 2. 查看错误日志
pm2 logs clearspring-api --err

# 3. 检查端口
netstat -tuln | grep 3000

# 4. 重启服务
pm2 restart clearspring-api

# 5. 检查 Nginx
systemctl status nginx
```

### 2. 性能问题

```bash
# 1. 检查 CPU/内存
htop

# 2. 检查磁盘 IO
iotop

# 3. 检查网络
iftop

# 4. 查看慢查询
pm2 logs --lines 1000 | grep "slow"
```

### 3. 磁盘空间不足

```bash
# 1. 查看磁盘使用
df -h

# 2. 查找大文件
find / -type f -size +100M

# 3. 清理日志
journalctl --vacuum-time=7d

# 4. 清理临时文件
rm -rf /tmp/*
```

---

## ✅ 验收标准

- [ ] PM2 日志轮转正常
- [ ] 健康检查脚本运行正常
- [ ] 监控脚本每 5 分钟执行
- [ ] 告警通知测试成功
- [ ] 监控面板可访问
- [ ] 故障排查流程文档化

---

## 📞 联系方式

**告警接收人**:
- 技术负责人：杨金霖
- 备用联系人：（待添加）

**升级流程**:
1. 自动告警（飞书机器人）
2. 电话通知（5 分钟未响应）
3. 邮件通知（15 分钟未响应）

---

**最后更新**: 2026-04-05  
**维护者**: ClearSpring V3 Team
