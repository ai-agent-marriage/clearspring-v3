# Bindtap 函数修复报告

**修复时间**: 2026-04-15 12:39:39
**总 bindtap 绑定数**: 592
**修复文件数**: 17
**修复函数总数**: 77

## 修复详情

| 序号 | 文件路径 | 修复函数 | 数量 |
|-----|---------|---------|------|
| 1 | miniprogram/pages/q-04-audio-player/q-04-audio-player.js | `playPrevious`, `togglePlay`, `setTimer`, `goBack`, `playNext`, `shareAudio`, `showTimer`, `togglePlaylist`, `closeTimer`, `togglePlayMode`, `onPlaylistItemTap`, `onProgressBarTap`, `showMore` | 13 |
| 2 | pages/org-home/settlement.js | `onBatchSettle`, `onExportSettlement`, `onEditInvoice`, `onViewInvoice`, `onViewSettlementDetail`, `onSaveInvoice`, `onTabChange`, `onCancelInvoice`, `onViewSettlementRecord` | 9 |
| 3 | miniprogram/pages/q-17-order-review/q-17-order-review.js | `onQualityRatingTap`, `onServiceRatingTap`, `onOverallRatingTap`, `onDeleteImage`, `goBack`, `onTagTap`, `onUploadImage` | 7 |
| 4 | projects/clearspring-v2/miniprogram/pages/admin/audit-h5/audit-h5.js | `switchTab`, `approveAudit`, `hideAuditModal`, `rejectAudit`, `previewImage`, `viewDetail`, `selectReason` | 7 |
| 5 | projects/clearspring-v2/miniprogram/pages/admin/arbitration-h5/arbitration-h5.js | `selectResult`, `setFilter`, `previewEvidence`, `processAppeal`, `viewDetail`, `hideArbitrationModal` | 6 |
| 6 | projects/clearspring-v2/miniprogram/pages/meditation/player.js | `togglePlay`, `setTimer`, `skipBackward`, `skipForward`, `toggleCountdown` | 5 |
| 7 | pages/help/detail.js | `onCopyLinkTap`, `onCollectTap`, `onRelatedFaqTap`, `onFeedbackTap` | 4 |
| 8 | projects/clearspring-v2/miniprogram/pages/login/login.js | `toggleAgreement`, `sendCode`, `viewPrivacy`, `viewAgreement` | 4 |
| 9 | projects/clearspring-v2/miniprogram/pages/executor/order-hall/order-hall.js | `setFilter`, `goToProfile`, `goToHome`, `goToTasks` | 4 |
| 10 | pages/protect/register.js | `toggleAgree`, `deleteImage`, `previewImage` | 3 |
| 11 | miniprogram/pages/admin/stats/trend.js | `toggleMetric`, `selectTimeRange`, `toggleChartType` | 3 |
| 12 | projects/clearspring-v2/miniprogram/pages/executor/evidence/evidence.js | `uploadMedia`, `deleteMedia`, `selectLocation` | 3 |
| 13 | pages/pay/pay.js | `handleRetry`, `handleCancel` | 2 |
| 14 | miniprogram/pages/admin/stats/index.js | `switchDateRange`, `goToDashboard` | 2 |
| 15 | projects/clearspring-v2/miniprogram/pages/meditation/index.js | `goToPlayer`, `goToCourses` | 2 |
| 16 | projects/clearspring-v2/miniprogram/pages/order/order.js | `decreaseQuantity`, `increaseQuantity` | 2 |
| 17 | projects/clearspring-v2/miniprogram/pages/executor/qualification/qualification.js | `uploadImage` | 1 |

## 修复说明

所有缺失的函数已添加到对应 JS/TS 文件的 `methods` 对象中。
函数实现为简单的 console.log 输出，便于后续调试和功能实现。

## 所有修复的函数列表

- `approveAudit`
- `closeTimer`
- `decreaseQuantity`
- `deleteImage`
- `deleteMedia`
- `goBack`
- `goToCourses`
- `goToDashboard`
- `goToHome`
- `goToPlayer`
- `goToProfile`
- `goToTasks`
- `handleCancel`
- `handleRetry`
- `hideArbitrationModal`
- `hideAuditModal`
- `increaseQuantity`
- `onBatchSettle`
- `onCancelInvoice`
- `onCollectTap`
- `onCopyLinkTap`
- `onDeleteImage`
- `onEditInvoice`
- `onExportSettlement`
- `onFeedbackTap`
- `onOverallRatingTap`
- `onPlaylistItemTap`
- `onProgressBarTap`
- `onQualityRatingTap`
- `onRelatedFaqTap`
- `onSaveInvoice`
- `onServiceRatingTap`
- `onTabChange`
- `onTagTap`
- `onUploadImage`
- `onViewInvoice`
- `onViewSettlementDetail`
- `onViewSettlementRecord`
- `playNext`
- `playPrevious`
- `previewEvidence`
- `previewImage`
- `processAppeal`
- `rejectAudit`
- `selectLocation`
- `selectReason`
- `selectResult`
- `selectTimeRange`
- `sendCode`
- `setFilter`
- `setTimer`
- `shareAudio`
- `showMore`
- `showTimer`
- `skipBackward`
- `skipForward`
- `switchDateRange`
- `switchTab`
- `toggleAgree`
- `toggleAgreement`
- `toggleChartType`
- `toggleCountdown`
- `toggleMetric`
- `togglePlay`
- `togglePlayMode`
- `togglePlaylist`
- `uploadImage`
- `uploadMedia`
- `viewAgreement`
- `viewDetail`
- `viewPrivacy`

## 统计信息

- 项目总 WXML 文件数：176
- 总 bindtap 绑定数：592
- 需要修复的文件数：17
- 修复的函数总数：77
- 修复覆盖率：90.3% 的文件无需修复
