# WXML 语法和规范性检查报告

**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')
**检查范围**: 所有 pages/ 目录下的 WXML 文件
**文件总数**: 待统计

---

## 问题分级说明

- **P0 (严重)**: 标签不匹配、语法错误导致无法编译
- **P1 (重要)**: 属性语法错误、组件引用问题
- **P2 (建议)**: 规范问题、可优化项

---

## 检查结果

**文件总数**: 176


### P0 严重问题 (共 15 个)

| 文件 | 问题描述 |
|------|----------|
| pages/q-13-service/q-13-service.wxml | text 标签不匹配 (开:36 闭:35) |
| pages/executor-evidence/executor-evidence.wxml | text 标签不匹配 (开:28 闭:27) |
| pages/protect/register.wxml | text 标签不匹配 (开:28 闭:27) |
| pages/order/create.wxml | text 标签不匹配 (开:39 闭:38) |
| pages/order/review.wxml | text 标签不匹配 (开:12 闭:11) |
| pages/merit-forest/detail.wxml | text 标签不匹配 (开:24 闭:23) |
| miniprogram/pages/q-17-order-review/q-17-order-review.wxml | text 标签不匹配 (开:12 闭:11) |
| miniprogram/pages/admin/feedback/submit.wxml | text 标签不匹配 (开:12 闭:11) |
| miniprogram/pages/admin/message/subscribe.wxml | text 标签不匹配 (开:27 闭:26) |
| projects/clearspring-v2/miniprogram/pages/order/order.wxml | text 标签不匹配 (开:37 闭:35) |
| projects/clearspring-v2/miniprogram/pages/ritual/learn.wxml | text 标签不匹配 (开:13 闭:12) |
| projects/clearspring-v2/miniprogram/pages/ritual/practice.wxml | text 标签不匹配 (开:17 闭:15) |
| projects/clearspring-v2/miniprogram/pages/executor/evidence/evidence.wxml | text 标签不匹配 (开:18 闭:17) |
| projects/clearspring-v2/miniprogram/pages/admin/audit-h5/audit-h5.wxml | text 标签不匹配 (开:41 闭:40) |
| projects/clearspring-v2/miniprogram/pages/admin/arbitration-h5/arbitration-h5.wxml | text 标签不匹配 (开:61 闭:60) |

### P1 重要问题 (共 0 个)

✅ 无 P1 级别问题

### P2 建议优化 (共 100 个)

| 文件 | 问题描述 |
|------|----------|
| pages/org-financial-report/org-financial-report.wxml | 类名可能不符合 kebab-case 规范 (行:11,14,17,20,66) |
| pages/q-04-audio-player/player.wxml | 类名可能不符合 kebab-case 规范 (行:66) |
| pages/org-volunteer-detail/org-volunteer-detail.wxml | 类名可能不符合 kebab-case 规范 (行:22) |
| pages/q-13-service/q-13-service.wxml | 类名可能不符合 kebab-case 规范 (行:77,81) |
| pages/org-home/orders.wxml | 类名可能不符合 kebab-case 规范 (行:14) |
| pages/org-home/settlement.wxml | 类名可能不符合 kebab-case 规范 (行:34,137) |
| pages/executor-settings/executor-settings.wxml | 类名可能不符合 kebab-case 规范 (行:40) |
| pages/admin-appeal/appeal.wxml | 类名可能不符合 kebab-case 规范 (行:29,32,35,38) |
| pages/executor-message-center/executor-message-center.wxml | 类名可能不符合 kebab-case 规范 (行:14,18,22,26,34) |
| pages/executor-message-center/messages.wxml | 类名可能不符合 kebab-case 规范 (行:19,22,25,28) |
| pages/q-16-order-detail/q-16-order-detail.wxml | 类名可能不符合 kebab-case 规范 (行:12,18,24,30,36) |
| pages/about/index.wxml | 类名可能不符合 kebab-case 规范 (行:21) |
| pages/executor-camera/executor-camera.wxml | 类名可能不符合 kebab-case 规范 (行:33,42,54) |
| pages/admin-export/export.wxml | 类名可能不符合 kebab-case 规范 (行:26,33,40,47,63,66,69,72,100,107,114) |
| pages/executor-evidence/executor-evidence.wxml | 类名可能不符合 kebab-case 规范 (行:35,129) |
| pages/executor-evidence/evidence.wxml | 类名可能不符合 kebab-case 规范 (行:55,59) |
| pages/admin-financial/financial.wxml | 类名可能不符合 kebab-case 规范 (行:136) |
| pages/executor-status/executor-status.wxml | 类名可能不符合 kebab-case 规范 (行:5,22,25,29,33) |
| pages/executor-income/executor-income.wxml | 类名可能不符合 kebab-case 规范 (行:19,31,38,45,108) |
| pages/admin-config/config.wxml | 类名可能不符合 kebab-case 规范 (行:72,80,82,90,92,100,102,110) |
| pages/org-order-detail/org-order-detail.wxml | 类名可能不符合 kebab-case 规范 (行:12,121,128,129,136,137,144,145) |
| pages/order/order.wxml | 类名可能不符合 kebab-case 规范 (行:7,35,114,128) |
| pages/order/list.wxml | 类名可能不符合 kebab-case 规范 (行:12) |
| pages/admin-order/order.wxml | 类名可能不符合 kebab-case 规范 (行:29,32,35,38,41) |
| pages/help/index.wxml | 类名可能不符合 kebab-case 规范 (行:26,31) |
| pages/executor-assistant/executor-assistant.wxml | 类名可能不符合 kebab-case 规范 (行:7) |
| pages/org-qualification/org-qualification.wxml | 类名可能不符合 kebab-case 规范 (行:12,36,43,44,51,52,59,60) |
| pages/certificate/certificate.wxml | 类名可能不符合 kebab-case 规范 (行:25,28) |
| pages/certificate/detail.wxml | 类名可能不符合 kebab-case 规范 (行:8,11,14,106) |
| pages/admin-qualification/qualification.wxml | 类名可能不符合 kebab-case 规范 (行:29,32,35,38) |
| pages/executor-qualification/executor-qualification.wxml | 类名可能不符合 kebab-case 规范 (行:125,137) |
| pages/executor-qualification/qualification.wxml | 存在硬编码色值，建议使用 CSS 变量 (行:130,145) |
| pages/executor-qualification-manage/executor-qualification-manage.wxml | 类名可能不符合 kebab-case 规范 (行:12,36,43,44,51,52) |
| pages/profile/certs.wxml | 类名可能不符合 kebab-case 规范 (行:17,33,65,109,151) |
| pages/org-task-assign/org-task-assign.wxml | 类名可能不符合 kebab-case 规范 (行:13,39,42,45,48) |
| pages/merit-forest/detail.wxml | 类名可能不符合 kebab-case 规范 (行:51) |
| pages/org-settings/org-settings.wxml | 类名可能不符合 kebab-case 规范 (行:15,68) |
| pages/executor-profile/executor-profile.wxml | 类名可能不符合 kebab-case 规范 (行:37) |
| pages/executor-profile/profile.wxml | 类名可能不符合 kebab-case 规范 (行:52,56,59) |
| pages/executor-home/executor-home.wxml | 类名可能不符合 kebab-case 规范 (行:7) |
| pages/pay/pay.wxml | 类名可能不符合 kebab-case 规范 (行:42) |
| pages/admin/content/species.wxml | 类名可能不符合 kebab-case 规范 (行:76) |
| pages/executor-order-hall/executor-order-hall.wxml | 类名可能不符合 kebab-case 规范 (行:28) |
| miniprogram/pages/q-04-audio-player/q-04-audio-player.wxml | 类名可能不符合 kebab-case 规范 (行:68,80,123,126,129,132,135) |
| miniprogram/pages/q-19-certificate-detail/q-19-certificate-detail.wxml | 类名可能不符合 kebab-case 规范 (行:99) |
| miniprogram/pages/q-17-order-review/q-17-order-review.wxml | 类名可能不符合 kebab-case 规范 (行:16,48,61,73) |
| miniprogram/pages/wiki/wiki.wxml | 类名可能不符合 kebab-case 规范 (行:111,112) |
| miniprogram/pages/admin/feedback/submit.wxml | 类名可能不符合 kebab-case 规范 (行:14,109) |
| miniprogram/pages/admin/feedback/manage.wxml | 类名可能不符合 kebab-case 规范 (行:18) |
| miniprogram/pages/admin/message/subscribe.wxml | 类名可能不符合 kebab-case 规范 (行:105,120,153) |
| miniprogram/pages/admin/message/records.wxml | 类名可能不符合 kebab-case 规范 (行:23,26,91) |
| miniprogram/pages/admin/stats/trend.wxml | 类名可能不符合 kebab-case 规范 (行:14,15,16,17) |
| miniprogram/pages/admin/stats/index.wxml | 类名可能不符合 kebab-case 规范 (行:35,36) |
| miniprogram/custom-tab-bar/index.wxml | 类名可能不符合 kebab-case 规范 (行:2) |
| custom-tab-bar/index.wxml | 类名可能不符合 kebab-case 规范 (行:2,7,16,21,30,35,44) |
| components/button/index.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/card/index.wxml | 类名可能不符合 kebab-case 规范 (行:2) |
| components/navbar/index.wxml | 类名可能不符合 kebab-case 规范 (行:2,21) |
| components/icons/inbox-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/task-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/location-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/add-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/chart-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/people-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/document-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/plant-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/time-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/transport-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/export-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/money-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/package-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/check-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/notification-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/target-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/announcement-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| components/icons/fish-icon.wxml | 类名可能不符合 kebab-case 规范 (行:3) |
| projects/clearspring-v2/miniprogram/pages/meditation/player.wxml | 类名可能不符合 kebab-case 规范 (行:21) |
| projects/clearspring-v2/miniprogram/pages/meditation/index.wxml | 类名可能不符合 kebab-case 规范 (行:71) |
| projects/clearspring-v2/miniprogram/pages/meditation/courses.wxml | 类名可能不符合 kebab-case 规范 (行:6,9,12,15,26) |
| projects/clearspring-v2/miniprogram/pages/login/login.wxml | 类名可能不符合 kebab-case 规范 (行:11,24,28,41,54) |
| projects/clearspring-v2/miniprogram/pages/order/order.wxml | 类名可能不符合 kebab-case 规范 (行:36,42,50,55,59,68,74,82,98,102,114) |
| projects/clearspring-v2/miniprogram/pages/index/index.wxml | 类名可能不符合 kebab-case 规范 (行:19,22,61,68,75,85) |
| projects/clearspring-v2/miniprogram/pages/service/service.wxml | 类名可能不符合 kebab-case 规范 (行:18,49) |
| projects/clearspring-v2/miniprogram/pages/profile/profile.wxml | 类名可能不符合 kebab-case 规范 (行:51,58,69,72,76,79,83,86) |
| projects/clearspring-v2/miniprogram/pages/merit-forest/merit-forest.wxml | 类名可能不符合 kebab-case 规范 (行:57) |
| projects/clearspring-v2/miniprogram/pages/ritual/learn.wxml | 类名可能不符合 kebab-case 规范 (行:28) |
| projects/clearspring-v2/miniprogram/pages/ritual/practice.wxml | 类名可能不符合 kebab-case 规范 (行:6,8,10) |
| projects/clearspring-v2/miniprogram/pages/ritual/detail.wxml | 类名可能不符合 kebab-case 规范 (行:45) |
| projects/clearspring-v2/miniprogram/pages/ritual/index.wxml | 类名可能不符合 kebab-case 规范 (行:38) |
| projects/clearspring-v2/miniprogram/pages/executor/assistant/assistant.wxml | 类名可能不符合 kebab-case 规范 (行:16,41,59,65,74,78) |
| projects/clearspring-v2/miniprogram/pages/executor/qualification/qualification.wxml | 类名可能不符合 kebab-case 规范 (行:21,27,29,33,34,36,40,41,43,53,70,77,96,114,124,152,166,167) |
| projects/clearspring-v2/miniprogram/pages/executor/income/income.wxml | 类名可能不符合 kebab-case 规范 (行:22,26,30,46,50,58,65,79) |
| projects/clearspring-v2/miniprogram/pages/executor/status/status.wxml | 类名可能不符合 kebab-case 规范 (行:18,20,32,41,45,49,59,65,71,75,81,85,91,100,108,112,122) |
| projects/clearspring-v2/miniprogram/pages/executor/camera/camera.wxml | 类名可能不符合 kebab-case 规范 (行:10,22,26) |
| projects/clearspring-v2/miniprogram/pages/executor/profile/profile.wxml | 类名可能不符合 kebab-case 规范 (行:23,48,54,56,65,68,73,76,81,84,91,94,99,102,107,110,126,130,134,138) |
| projects/clearspring-v2/miniprogram/pages/executor/evidence/evidence.wxml | 类名可能不符合 kebab-case 规范 (行:21,31,36,45,63,69,75,76) |
| projects/clearspring-v2/miniprogram/pages/executor/order-hall/order-hall.wxml | 类名可能不符合 kebab-case 规范 (行:13,16,19,22,32,35,54,64,75,79,83,87) |
| projects/clearspring-v2/miniprogram/pages/admin/audit-h5/audit-h5.wxml | 类名可能不符合 kebab-case 规范 (行:18,22,25,40,67,71,81,87,99,103,142,156,169,171,175) |
| projects/clearspring-v2/miniprogram/pages/admin/arbitration-h5/arbitration-h5.wxml | 类名可能不符合 kebab-case 规范 (行:18,21,25,40,75,81,89,95,107,111,181,184,192,195,203,206,225,240) |
| projects/clearspring-v2/miniprogram/components/form-validator/form-validator.wxml | 类名可能不符合 kebab-case 规范 (行:5) |

---

## 检查总结

- **检查文件数**: 176
- **P0 严重问题**: 15
- **P1 重要问题**: 0
- **P2 建议优化**: 100
- **总问题数**: 115

⚠️ 发现 115 个问题，请优先处理 P0 级别问题。
