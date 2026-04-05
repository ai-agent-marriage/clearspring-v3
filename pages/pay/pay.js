/**
 * 支付页面 - 支付调用示例
 * 路径：pages/pay/pay.js
 */

const payment = require('../../utils/pay/payment');

Page({
  data: {
    orderNo: '',
    amount: 0,
    status: 'pending',
    statusText: '待支付',
    countdown: 900, // 15 分钟倒计时（秒）
    isPaying: false,
    showResult: false,
    resultTitle: '',
    resultMessage: ''
  },

  countdownTimer: null,

  onLoad(options) {
    const { orderNo, amount } = options;
    
    if (!orderNo || !amount) {
      wx.showToast({
        title: '订单信息不完整',
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      
      return;
    }
    
    this.setData({
      orderNo,
      amount: parseFloat(amount)
    });
    
    // 启动倒计时
    this.startCountdown();
  },

  onUnload() {
    // 清理倒计时
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },

  /**
   * 启动倒计时
   */
  startCountdown() {
    this.countdownTimer = setInterval(() => {
      const countdown = this.data.countdown - 1;
      
      if (countdown <= 0) {
        clearInterval(this.countdownTimer);
        this.handleTimeout();
        return;
      }
      
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;
      
      this.setData({
        countdown,
        countdownText: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      });
    }, 1000);
  },

  /**
   * 处理支付超时
   */
  handleTimeout() {
    this.setData({
      status: 'timeout',
      statusText: '支付超时',
      showResult: true,
      resultTitle: '支付超时',
      resultMessage: '订单已超时，请重新下单'
    });
    
    wx.showToast({
      title: '支付超时',
      icon: 'none'
    });
  },

  /**
   * 发起支付
   */
  async handlePay() {
    if (this.data.isPaying) {
      return;
    }

    this.setData({ isPaying: true });

    try {
      // 调用完整支付流程
      const result = await payment.completePayFlow({
        orderNo: this.data.orderNo,
        amount: this.data.amount,
        body: '清如 ClearSpring - 订单支付',
        onStatusChange: (status, data) => {
          console.log('支付状态变化:', status, data);
          
          // 更新 UI 状态
          this.updateStatus(status, data);
        }
      });

      if (result.success) {
        this.handlePaySuccess(result);
      } else {
        this.handlePayFailed(result);
      }

    } catch (error) {
      console.error('支付异常:', error);
      
      this.setData({
        showResult: true,
        resultTitle: '支付异常',
        resultMessage: '支付过程中出现异常，请稍后重试'
      });
      
      wx.showToast({
        title: '支付异常',
        icon: 'none'
      });
    } finally {
      this.setData({ isPaying: false });
    }
  },

  /**
   * 更新支付状态
   */
  updateStatus(status, data) {
    const statusText = payment.getStatusText(status);
    
    this.setData({
      status,
      statusText
    });

    // 根据状态显示不同 UI
    if (status === payment.PAY_STATUS.SUCCESS) {
      this.handlePaySuccess({ data });
    } else if (status === payment.PAY_STATUS.FAILED || 
               status === payment.PAY_STATUS.CANCELLED ||
               status === payment.PAY_STATUS.TIMEOUT) {
      this.handlePayFailed({ status, message: statusText });
    }
  },

  /**
   * 处理支付成功
   */
  handlePaySuccess(result) {
    // 停止倒计时
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    this.setData({
      status: 'success',
      statusText: '支付成功',
      showResult: true,
      resultTitle: '支付成功',
      resultMessage: `支付金额：¥${this.data.amount.toFixed(2)}`
    });

    // 显示成功提示
    wx.showModal({
      title: '支付成功',
      content: '订单已支付成功',
      showCancel: false,
      success: () => {
        // 跳转到订单详情页
        wx.redirectTo({
          url: `/pages/order/detail?orderNo=${this.data.orderNo}`
        });
      }
    });
  },

  /**
   * 处理支付失败
   */
  handlePayFailed(result) {
    this.setData({
      showResult: true,
      resultTitle: '支付失败',
      resultMessage: result.message || '支付失败，请稍后重试'
    });

    wx.showToast({
      title: result.message || '支付失败',
      icon: 'none'
    });
  },

  /**
   * 重新支付
   */
  handleRetry() {
    this.setData({
      showResult: false,
      status: 'pending',
      statusText: '待支付',
      countdown: 900
    });
    
    // 重新启动倒计时
    this.startCountdown();
  },

  /**
   * 取消支付
   */
  handleCancel() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消支付吗？',
      success: (res) => {
        if (res.confirm) {
          // 停止倒计时
          if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
          }

          // 返回上一页
          wx.navigateBack();
        }
      }
    });
  }
});
