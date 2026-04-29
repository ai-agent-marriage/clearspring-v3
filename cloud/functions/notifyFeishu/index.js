// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 飞书 Webhook URL (从云环境变量获取)
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL || ''

exports.main = async (event, context) => {
  try {
    const { type, feedbackId, feedbackData } = event

    if (type !== 'feedback' || !feedbackData) {
      return {
        success: false,
        message: '参数错误'
      }
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    }

    // 构建飞书消息卡片
    const messageCard = {
      msg_type: 'interactive',
      card: {
        header: {
          title: {
            tag: 'plain_text',
            content: '📝 新用户反馈'
          },
          template: 'blue'
        },
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**反馈类型**: ${feedbackData.type}\n**反馈内容**: ${feedbackData.content}\n**用户**: ${feedbackData.userInfo.nickName}\n**时间**: ${formatTime(feedbackData.timestamp)}`
            }
          },
          {
            tag: 'hr'
          },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**联系方式**: ${feedbackData.contact || '未提供'}\n**图片数量**: ${feedbackData.images ? feedbackData.images.length : 0} 张`
            }
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: {
                  tag: 'plain_text',
                  content: '查看详情'
                },
                url: `https://console.cloud.tencent.com/devops/database/collection/feedback/detail/${feedbackId}`,
                type: 'default'
              }
            ]
          }
        ]
      }
    }

    // 发送飞书通知
    if (FEISHU_WEBHOOK_URL) {
      const response = await axios.post(FEISHU_WEBHOOK_URL, messageCard, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      })

      if (response.data.StatusCode !== 0 && response.data.code !== 0) {
        console.error('飞书通知发送失败:', response.data)
        return {
          success: false,
          message: '飞书通知发送失败'
        }
      }
    } else {
      console.warn('未配置飞书 Webhook URL')
    }

    return {
      success: true,
      message: '通知发送成功'
    }

  } catch (err) {
    console.error('发送飞书通知失败:', err)
    return {
      success: false,
      message: '通知发送失败',
      error: err.message
    }
  }
}
