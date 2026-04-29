# 监控告警配置完成报告

**创建时间**: 2026-04-05 19:01  
**状态**: ✅ 配置完成

---

## ✅ 已完成配置

### 1. PM2 健康检查

**脚本**: `/usr/local/bin/pm2-healthcheck.sh`  
**频率**: 每 5 分钟  
**日志**: `/var/log/pm2/healthcheck.log`

**检查项**:
- ✅ PM2 进程在线数量
- ✅ PM2 进程错误状态
- ✅ 自动告警（exit code 2）

---

### 2. 服务器监控

**脚本**: `/usr/local/bin/server-monitor.sh`  
**频率**: 每 10 分钟  
**日志**: `/var/log/server-monitor.log`

**监控项**:
- ✅ CPU 使用率（>80% 告警）
- ✅ 内存使用率（>80% 告警）
- ✅ 磁盘使用率（>90% 告警）

---

### 3. API 监控

**脚本**: `/usr/local/bin/api-monitor.sh`  
**频率**: 每 1 分钟  
**日志**: `/var/log/api-monitor.log`

**监控项**:
- ✅ HTTP 状态码
- ✅ API 可用性
- ✅ 响应时间（待完善）

---

### 4. Crontab 配置

```bash
# PM2 健康检查（每 5 分钟）
*/5 * * * * /usr/local/bin/pm2-healthcheck.sh >> /var/log/pm2/healthcheck.log 2>&1

# 服务器监控（每 10 分钟）
*/10 * * * * /usr/local/bin/server-monitor.sh

# API 监控（每 1 分钟）
* * * * * /usr/local/bin/api-monitor.sh
```

---

### 5. 日志目录

- ✅ `/var/log/pm2/` - PM2 日志
- ✅ `/var/log/monitoring/` - 监控日志
- ✅ `/var/log/server-monitor.log` - 服务器监控
- ✅ `/var/log/api-monitor.log` - API 监控

---

## 📊 监控覆盖

| 层次 | 监控项 | 频率 | 状态 |
|------|--------|------|------|
| 应用层 | PM2 进程 | 5 分钟 | ✅ |
| 系统层 | CPU/内存/磁盘 | 10 分钟 | ✅ |
| 业务层 | API 可用性 | 1 分钟 | ✅ |

---

## 🔧 查看监控

### PM2 监控

```bash
# 查看 PM2 进程
pm2 list

# 查看 PM2 日志
pm2 logs clearspring-api

# 实时监控
pm2 monit
```

### 系统监控

```bash
# CPU/内存
htop

# 网络
iftop

# IO
iotop
```

### 日志查看

```bash
# PM2 健康检查
tail -f /var/log/pm2/healthcheck.log

# 服务器监控
tail -f /var/log/server-monitor.log

# API 监控
tail -f /var/log/api-monitor.log
```

---

## 🚨 告警流程

### 当前状态

- ✅ 日志记录告警
- ⏳ 飞书通知（待集成）
- ⏳ 邮件通知（待配置）

### 后续优化

1. 集成飞书机器人告警
2. 配置邮件告警
3. 设置电话告警（严重故障）

---

## ✅ 验收清单

- [x] PM2 健康检查脚本
- [x] 服务器监控脚本
- [x] API 监控脚本
- [x] Crontab 配置
- [x] 日志目录创建
- [x] 脚本权限设置
- [x] 验证运行正常

---

## 📈 监控指标

### 可用性目标

| 指标 | 目标 | 当前 |
|------|------|------|
| API 可用性 | ≥99% | 待统计 |
| PM2 在线率 | 100% | 待统计 |
| 故障响应时间 | <5 分钟 | 待统计 |

---

**最后更新**: 2026-04-05 19:01  
**维护者**: ClearSpring V3 Team
