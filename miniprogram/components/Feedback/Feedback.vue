<!-- 用户反馈组件 -->
<template>
  <view class="feedback-container">
    <button class="feedback-btn" @click="showFeedback">反馈建议</button>
    
    <!-- 反馈弹窗 -->
    <view v-if="showModal" class="feedback-modal" @click="hideFeedback">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">反馈建议</text>
          <text class="modal-close" @click="hideFeedback">×</text>
        </view>
        
        <view class="modal-body">
          <view class="form-item">
            <text class="label">反馈类型</text>
            <picker :range="feedbackTypes" @change="onTypeChange">
              <view class="picker">{{ feedbackTypes[feedbackTypeIndex] }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="label">反馈内容</text>
            <textarea 
              v-model="feedbackContent" 
              placeholder="请详细描述您的问题或建议"
              maxlength="500"
              class="feedback-textarea"
            />
          </view>
          
          <view class="form-item">
            <text class="label">联系方式（可选）</text>
            <input 
              v-model="contactInfo" 
              placeholder="手机号或邮箱，方便我们联系您"
              class="contact-input"
            />
          </view>
          
          <view class="form-item">
            <text class="label">上传截图</text>
            <button class="upload-btn" @click="uploadImage">上传图片</button>
            <view v-if="imageList.length > 0" class="image-preview">
              <image 
                v-for="(img, index) in imageList" 
                :key="index" 
                :src="img" 
                mode="aspectFill"
                @click="previewImage(index)"
              />
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="hideFeedback">取消</button>
          <button class="submit-btn" @click="submitFeedback" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '提交' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Feedback',
  data() {
    return {
      showModal: false,
      isSubmitting: false,
      feedbackTypes: ['功能建议', '问题反馈', '体验优化', '其他'],
      feedbackTypeIndex: 0,
      feedbackContent: '',
      contactInfo: '',
      imageList: []
    }
  },
  methods: {
    showFeedback() {
      this.showModal = true
    },
    hideFeedback() {
      this.showModal = false
      this.resetForm()
    },
    onTypeChange(e) {
      this.feedbackTypeIndex = e.detail.value
    },
    uploadImage() {
      const that = this
      wx.chooseImage({
        count: 3,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          that.imageList = [...that.imageList, ...res.tempFilePaths]
        }
      })
    },
    previewImage(index) {
      wx.previewImage({
        current: this.imageList[index],
        urls: this.imageList
      })
    },
    async submitFeedback() {
      if (!this.feedbackContent.trim()) {
        wx.showToast({
          title: '请填写反馈内容',
          icon: 'none'
        })
        return
      }

      this.isSubmitting = true
      
      try {
        // 调用云函数提交反馈
        const feedbackData = {
          type: this.feedbackTypes[this.feedbackTypeIndex],
          content: this.feedbackContent,
          contact: this.contactInfo,
          images: this.imageList,
          timestamp: Date.now(),
          userInfo: await this.getUserInfo()
        }

        await wx.cloud.callFunction({
          name: 'submitFeedback',
          data: feedbackData
        })

        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })

        this.hideFeedback()
        
        // 发送到飞书群通知
        this.notifyToFeishu(feedbackData)
        
      } catch (error) {
        console.error('提交反馈失败:', error)
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
      }
    },
    async getUserInfo() {
      // 获取用户信息
      try {
        const res = await wx.getUserProfile({
          desc: '用于完善反馈信息'
        })
        return res.userInfo
      } catch (e) {
        return {}
      }
    },
    notifyToFeishu(data) {
      // 通过云函数发送到飞书群
      wx.cloud.callFunction({
        name: 'notifyFeishu',
        data: {
          type: 'feedback',
          content: `新反馈：${data.type}\n${data.content}`
        }
      })
    },
    resetForm() {
      this.feedbackContent = ''
      this.contactInfo = ''
      this.imageList = []
      this.feedbackTypeIndex = 0
    }
  }
}
</script>

<style scoped>
.feedback-container {
  padding: 20rpx;
}

.feedback-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 20rpx 40rpx;
}

.feedback-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 0 10rpx;
}

.modal-body {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.picker,
.contact-input {
  background: #f5f5f5;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.feedback-textarea {
  background: #f5f5f5;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  min-height: 200rpx;
  width: 100%;
}

.upload-btn {
  background: #f5f5f5;
  font-size: 28rpx;
  padding: 15rpx 30rpx;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15rpx;
}

.image-preview image {
  width: 150rpx;
  height: 150rpx;
  margin-right: 15rpx;
  margin-bottom: 15rpx;
  border-radius: 8rpx;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  margin: 0 15rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.submit-btn[disabled] {
  opacity: 0.6;
}
</style>
