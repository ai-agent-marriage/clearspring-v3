/**
 * 错误处理工具类
 * 提供统一的错误分类、提示和日志上报功能
 */

const ErrorHandler = {
  /**
   * 错误类型枚举
   */
  ErrorType: {
    NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    SERVER_ERROR: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    UNKNOWN: 'UNKNOWN'
  },

  /**
   * 错误类型对应的用户提示
   */
  ErrorMessages: {
    NETWORK_TIMEOUT: '请求超时，请检查网络',
    NETWORK_ERROR: '网络连接失败',
    UNAUTHORIZED: '请先登录',
    FORBIDDEN: '无权限访问',
    SERVER_ERROR: '服务器错误，请稍后重试',
    NOT_FOUND: '请求的资源不存在',
    BAD_REQUEST: '请求参数错误',
    UNKNOWN: '网络请求失败'
  },

  /**
   * 分类错误类型
   * @param {Error} error - 错误对象
   * @returns {string} 错误类型
   */
  classifyError(error) {
    // 检查是否是 wx.request 错误
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        return this.ErrorType.NETWORK_TIMEOUT;
      }
      if (error.errMsg.includes('fail')) {
        return this.ErrorType.NETWORK_ERROR;
      }
    }

    // 检查 HTTP 状态码
    if (error.statusCode) {
      switch (error.statusCode) {
        case 401:
          return this.ErrorType.UNAUTHORIZED;
        case 403:
          return this.ErrorType.FORBIDDEN;
        case 404:
          return this.ErrorType.NOT_FOUND;
        case 500:
        case 502:
        case 503:
          return this.ErrorType.SERVER_ERROR;
        case 400:
          return this.ErrorType.BAD_REQUEST;
        default:
          return this.ErrorType.UNKNOWN;
      }
    }

    // 检查业务错误码
    if (error.code) {
      if (error.code === 401 || error.code === '401') {
        return this.ErrorType.UNAUTHORIZED;
      }
      if (error.code === 403 || error.code === '403') {
        return this.ErrorType.FORBIDDEN;
      }
    }

    return this.ErrorType.UNKNOWN;
  },

  /**
   * 获取用户友好的错误提示
   * @param {Error} error - 错误对象
   * @param {string} customMessage - 自定义提示（可选）
   * @returns {string} 错误提示
   */
  getErrorMessage(error, customMessage) {
    if (customMessage) {
      return customMessage;
    }

    const errorType = this.classifyError(error);
    return this.ErrorMessages[errorType] || this.ErrorMessages.UNKNOWN;
  },

  /**
   * 显示错误提示 Toast
   * @param {Error} error - 错误对象
   * @param {Object} options - 配置选项
   * @param {string} options.customMessage - 自定义提示
   * @param {number} options.duration - 显示时长（毫秒）
   * @param {boolean} options.showToast - 是否显示 Toast（默认 true）
   */
  showToast(error, options = {}) {
    const {
      customMessage,
      duration = 2000,
      showToast = true
    } = options;

    if (!showToast) {
      return;
    }

    const message = this.getErrorMessage(error, customMessage);
    wx.showToast({
      title: message,
      icon: 'none',
      duration
    });
  },

  /**
   * 显示错误 Modal（用于严重错误）
   * @param {Error} error - 错误对象
   * @param {Object} options - 配置选项
   * @param {string} options.title - 标题
   * @param {string} options.customMessage - 自定义提示
   * @param {Function} options.onConfirm - 确认回调
   */
  showModal(error, options = {}) {
    const {
      title = '提示',
      customMessage,
      onConfirm
    } = options;

    const message = this.getErrorMessage(error, customMessage);
    wx.showModal({
      title,
      content: message,
      showCancel: false,
      success: (res) => {
        if (res.confirm && onConfirm) {
          onConfirm();
        }
      }
    });
  },

  /**
   * 上报错误日志到云函数
   * @param {Error} error - 错误对象
   * @param {Object} context - 错误上下文信息
   * @param {string} context.page - 页面路径
   * @param {string} context.action - 操作名称
   * @param {Object} context.extra - 其他额外信息
   */
  logError(error, context = {}) {
    const {
      page = '',
      action = '',
      extra = {}
    } = context;

    // 获取系统信息
    let systemInfo = {};
    try {
      systemInfo = wx.getSystemInfoSync();
    } catch (e) {
      console.error('获取系统信息失败:', e);
    }

    // 构建错误日志数据
    const errorData = {
      error: {
        message: error.message || String(error),
        stack: error.stack || '',
        errMsg: error.errMsg || '',
        statusCode: error.statusCode,
        code: error.code
      },
      context: {
        page,
        action,
        timestamp: Date.now(),
        userAgent: systemInfo.SDKVersion || '',
        platform: systemInfo.platform || '',
        model: systemInfo.model || '',
        system: systemInfo.system || ''
      },
      extra
    };

    // 调用云函数上报错误日志
    wx.cloud.callFunction({
      name: 'log-error',
      data: errorData,
      success: (res) => {
        // [CLEANED] console.log('错误日志上报成功:', res);
      },
      fail: (failError) => {
        console.error('错误日志上报失败:', failError);
        // 本地记录错误日志（降级处理）
        this.logErrorLocal(errorData);
      }
    }).catch(cloudError => {
      console.error('云函数调用失败:', cloudError);
      // 本地记录错误日志（降级处理）
      this.logErrorLocal(errorData);
    });
  },

  /**
   * 本地记录错误日志（降级处理）
   * @param {Object} errorData - 错误数据
   */
  logErrorLocal(errorData) {
    try {
      const logs = wx.getStorageSync('error_logs') || [];
      logs.push({
        ...errorData,
        local: true,
        savedAt: Date.now()
      });
      // 只保留最近 100 条错误日志
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      wx.setStorageSync('error_logs', logs);
      // [CLEANED] console.log('错误日志本地保存成功');
    } catch (e) {
      console.error('本地保存错误日志失败:', e);
    }
  },

  /**
   * 处理网络请求错误（统一错误处理）
   * @param {Error} error - 错误对象
   * @param {Object} options - 配置选项
   * @param {string} options.page - 页面路径
   * @param {string} options.action - 操作名称
   * @param {boolean} options.showToast - 是否显示提示
   * @param {string} options.customMessage - 自定义提示
   * @param {boolean} options.logError - 是否记录日志（默认 true）
   * @param {Function} options.onRetry - 重试回调
   */
  handleRequestError(error, options = {}) {
    const {
      page = '',
      action = '',
      showToast = true,
      customMessage,
      logError = true,
      onRetry
    } = options;

    // 记录错误日志
    if (logError) {
      this.logError(error, { page, action });
    }

    // 显示错误提示
    if (showToast) {
      this.showToast(error, { customMessage });
    }

    // 特殊错误处理
    const errorType = this.classifyError(error);
    if (errorType === this.ErrorType.UNAUTHORIZED) {
      // 未登录，跳转到登录页
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/index'
        });
      }, 1500);
    }

    return errorType;
  },

  /**
   * 创建带错误处理的 wx.request 封装
   * @param {Object} config - wx.request 配置
   * @param {Object} options - 错误处理选项
   * @returns {Promise} 请求结果
   */
  async request(config, options = {}) {
    const {
      page = '',
      action = config.url || '',
      showToast = true,
      timeout = 10000
    } = options;

    try {
      const res = await wx.request({
        ...config,
        timeout
      });

      // 检查业务错误码
      if (res.data && res.data.code !== 0 && res.data.code !== 200) {
        const businessError = new Error(res.data.msg || '请求失败');
        businessError.statusCode = res.statusCode;
        businessError.code = res.data.code;
        throw businessError;
      }

      return res;
    } catch (error) {
      this.handleRequestError(error, {
        page,
        action,
        showToast
      });
      throw error;
    }
  },

  /**
   * 显示加载状态
   * @param {string} title - 加载提示
   */
  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  /**
   * 隐藏加载状态
   */
  hideLoading() {
    wx.hideLoading();
  }
};

module.exports = ErrorHandler;
