// utils/request.js - 请求封装 (拦截器/token 管理)
const config = require('../config.js')

// 请求拦截器
const requestInterceptor = (options) => {
  // 添加 token
  const token = wx.getStorageSync('token')
  if (token) {
    options.header = options.header || {}
    options.header['Authorization'] = `Bearer ${token}`
  }
  
  // 添加通用请求头
  options.header = {
    ...options.header,
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  
  // 添加版本号
  options.header['X-App-Version'] = config.appVersion
  
  return options
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  
  // HTTP 状态码处理
  if (statusCode === 401) {
    // token 过期，清除本地 token 并跳转登录
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.reLaunch({
      url: '/pages/login/login'
    })
    return Promise.reject({ code: 401, message: '登录已过期' })
  }
  
  if (statusCode === 403) {
    return Promise.reject({ code: 403, message: '无权限访问' })
  }
  
  if (statusCode === 404) {
    return Promise.reject({ code: 404, message: '请求资源不存在' })
  }
  
  if (statusCode === 500) {
    return Promise.reject({ code: 500, message: '服务器错误' })
  }
  
  // 业务状态码处理
  if (data && data.code !== 200 && data.code !== 0) {
    return Promise.reject({
      code: data.code,
      message: data.message || '请求失败'
    })
  }
  
  return Promise.resolve(data)
}

// 请求封装
const request = (options) => {
  // 合并默认配置
  const opts = {
    method: 'GET',
    timeout: config.timeout,
    ...options,
    url: config.baseUrl + options.url
  }
  
  // 请求拦截
  const interceptedOpts = requestInterceptor(opts)
  
  // 发送请求
  return new Promise((resolve, reject) => {
    wx.request({
      ...interceptedOpts,
      success: (res) => {
        responseInterceptor(res)
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        if (config.debug) {
          console.error('请求失败:', err)
        }
        reject({
          code: -1,
          message: err.errMsg || '网络请求失败'
        })
      }
    })
  })
}

// 快捷方法
const get = (url, data) => request({ url, data, method: 'GET' })
const post = (url, data) => request({ url, data, method: 'POST' })
const put = (url, data) => request({ url, data, method: 'PUT' })
const del = (url, data) => request({ url, data, method: 'DELETE' })

// 文件上传
const upload = (url, filePath, formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    wx.uploadFile({
      url: config.baseUrl + url,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 200 || data.code === 0) {
          resolve(data)
        } else {
          reject(data)
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: err.errMsg || '上传失败'
        })
      }
    })
  })
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  upload
}
