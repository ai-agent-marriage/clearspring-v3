// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 验证用户登录
    if (!wxContext.OPENID) {
      return {
        success: false,
        message: '用户未登录'
      }
    }

    const { type, content, contact, images } = event
    
    // 验证必填字段
    if (!type || !content) {
      return {
        success: false,
        message: '请填写完整反馈信息'
      }
    }

    // 内容长度验证
    if (content.length > 500) {
      return {
        success: false,
        message: '反馈内容不能超过 500 字'
      }
    }

    // 上传图片到云存储
    let imageUrls = []
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (filePath, index) => {
        const uploadResult = await cloud.uploadFile({
          cloudPath: `feedback/${wxContext.OPENID}/${Date.now()}_${index}.jpg`,
          fileContent: filePath
        })
        return uploadResult.fileID
      })
      imageUrls = await Promise.all(uploadPromises)
    }

    // 获取用户信息
    let userInfo = {}
    try {
      const userResult = await db.collection('users').where({
        openId: wxContext.OPENID
      }).get()
      
      if (userResult.data.length > 0) {
        userInfo = userResult.data[0]
      }
    } catch (e) {
      console.error('获取用户信息失败:', e)
    }

    // 保存到数据库
    const feedbackData = {
      type,
      content,
      contact: contact || '',
      images: imageUrls,
      userInfo: {
        openId: wxContext.OPENID,
        nickName: userInfo.nickName || '匿名用户',
        avatarUrl: userInfo.avatarUrl || ''
      },
      timestamp: Date.now(),
      createTime: db.serverDate(),
      status: 'pending',
      processedBy: '',
      processedAt: null,
      reply: ''
    }

    const result = await db.collection('feedback').add({
      data: feedbackData
    })

    // 触发飞书通知
    try {
      await cloud.callFunction({
        name: 'notifyFeishu',
        data: {
          type: 'feedback',
          feedbackId: result._id,
          feedbackData: feedbackData
        }
      })
    } catch (e) {
      console.error('发送飞书通知失败:', e)
    }

    return {
      success: true,
      message: '提交成功',
      feedbackId: result._id
    }

  } catch (err) {
    console.error('提交反馈失败:', err)
    return {
      success: false,
      message: '提交失败，请稍后重试',
      error: err.message
    }
  }
}
