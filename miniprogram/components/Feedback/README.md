# 用户反馈组件

## 功能说明

提供小程序内用户反馈入口，支持：
- 反馈类型选择（功能建议、问题反馈、体验优化、其他）
- 文字描述（最多 500 字）
- 联系方式（可选）
- 图片上传（最多 3 张）
- 自动发送到飞书反馈群

## 使用方式

### 1. 在页面中引入

```vue
<template>
  <view>
    <!-- 其他内容 -->
    <Feedback />
  </view>
</template>

<script>
import Feedback from '@/components/Feedback/Feedback.vue'

export default {
  components: {
    Feedback
  }
}
</script>
```

### 2. 全局引入（可选）

在 `main.js` 中全局注册：

```javascript
import Feedback from '@/components/Feedback/Feedback.vue'

Vue.component('Feedback', Feedback)
```

## 云函数配置

需要部署以下云函数：

### submitFeedback
- **功能**: 提交用户反馈到数据库
- **触发方式**: 小程序调用
- **权限**: 所有登录用户

### notifyFeishu
- **功能**: 发送飞书群通知
- **触发方式**: 小程序调用或定时触发
- **权限**: 仅管理员

## 数据表结构

### feedback 集合

```json
{
  "_id": "自动生成",
  "type": "反馈类型",
  "content": "反馈内容",
  "contact": "联系方式",
  "images": ["图片 URL 数组"],
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "用户头像"
  },
  "timestamp": 1234567890,
  "status": "pending", // pending, processing, resolved
  "processedBy": "", // 处理人
  "processedAt": null, // 处理时间
  "reply": "" // 回复内容
}
```

## 飞书集成

### 配置飞书机器人

1. 在飞书群中添加自定义机器人
2. 获取 Webhook URL
3. 在云函数中配置 Webhook

### 通知格式

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "📝 新用户反馈"
      },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "**类型**: 功能建议\n**内容**: 希望增加 xxx 功能\n**用户**: 张三\n**时间**: 2024-01-01 12:00"
        }
      }
    ]
  }
}
```

## 监控指标

- 反馈提交成功率
- 平均响应时间
- 用户满意度

## 注意事项

1. 图片上传需要配置 CDN
2. 飞书通知需要配置网络白名单
3. 用户隐私数据需要脱敏处理
4. 敏感词过滤建议接入第三方服务
