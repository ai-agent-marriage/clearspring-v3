import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import DOMPurify from 'dompurify'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000 // 请求超时时间
})

// Token 刷新标志位，防止并发刷新
let isRefreshing = false
// 刷新 Token 时的请求队列
let refreshSubscribers = []

/**
 * 获取 CSRF Token（从 Cookie 或 localStorage）
 * @returns {string|null} CSRF Token
 */
function getCsrfToken() {
  // 优先从 Cookie 获取
  const csrfCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie)
  }
  
  // 其次从 localStorage 获取
  return localStorage.getItem('csrf_token')
}

/**
 * XSS 防护：转义用户输入
 * @param {string} input - 用户输入
 * @returns {string} 转义后的字符串
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // 不允许任何 HTML 标签
    ALLOWED_ATTR: []  // 不允许任何属性
  })
}

/**
 * XSS 防护：转义对象中的所有字符串字段
 * @param {Object|Array} data - 数据对象或数组
 * @returns {Object|Array} 转义后的数据
 */
export function sanitizeObject(data) {
  if (Array.isArray(data)) {
    return data.map(item => sanitizeObject(item))
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized = {}
    for (const key in data) {
      if (typeof data[key] === 'string') {
        sanitized[key] = sanitizeInput(data[key])
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        sanitized[key] = sanitizeObject(data[key])
      } else {
        sanitized[key] = data[key]
      }
    }
    return sanitized
  }
  return data
}

/**
 * 添加请求到刷新队列
 * @param {Function} callback - 请求成功后的回调
 */
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback)
}

/**
 * 执行刷新队列中的所有请求
 * @param {string} newToken - 新的 Token
 */
function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach(callback => callback(newToken))
  refreshSubscribers = []
}

/**
 * 清除刷新队列（刷新失败时调用）
 */
function clearRefreshQueue() {
  refreshSubscribers = []
}

/**
 * 刷新 Token
 * @returns {Promise<string>} 新的 Token
 */
async function refreshToken() {
  const refreshTokenData = localStorage.getItem('admin_refresh_token')
  if (!refreshTokenData) {
    throw new Error('无刷新 Token')
  }
  
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/refresh`,
    { refreshToken: refreshTokenData }
  )
  
  if (response.data.code === 200 && response.data.data.token) {
    const newToken = response.data.data.token
    localStorage.setItem('admin_token', newToken)
    if (response.data.data.refreshToken) {
      localStorage.setItem('admin_refresh_token', response.data.data.refreshToken)
    }
    return newToken
  } else {
    throw new Error('Token 刷新失败')
  }
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加 Token
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 添加 CSRF Token（如果存在）
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }
    
    // XSS 防护：对 POST/PUT/PATCH 请求的数据进行转义
    if (config.data && ['POST', 'PUT', 'PATCH'].includes(config.method?.toUpperCase())) {
      config.data = sanitizeObject(config.data)
    }
    
    // 添加请求时间戳（可选，防止缓存）
    // config.params = {
    //   ...config.params,
    //   _t: Date.now()
    // }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理 Token 过期和自动刷新
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果返回的状态码不是 200，说明接口有错误
    if (res.code !== 200) {
      // Token 过期或无效
      if (res.code === 401) {
        ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_refresh_token')
          router.push('/login')
        })
      } else {
        ElMessage.error(res.message || '请求失败')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  async error => {
    console.error('响应错误:', error)
    
    // 处理 HTTP 401 错误 - Token 过期，尝试自动刷新
    if (error.response?.status === 401) {
      // 如果不是刷新 Token 的请求本身失败
      if (!error.config?.url?.includes('/auth/refresh')) {
        // 如果当前没有在刷新 Token，则开始刷新
        if (!isRefreshing) {
          isRefreshing = true
          
          try {
            const newToken = await refreshToken()
            onTokenRefreshed(newToken)
            // 重试原请求
            error.config.headers['Authorization'] = `Bearer ${newToken}`
            return request(error.config)
          } catch (refreshError) {
            // 刷新失败，清除队列并跳转登录
            console.error('Token 刷新失败:', refreshError)
            clearRefreshQueue()
            ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
              showCancelButton: true,
              closeOnClickModal: false
            }).then(() => {
              localStorage.removeItem('admin_token')
              localStorage.removeItem('admin_refresh_token')
              router.push('/login')
            })
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        } else {
          // 如果正在刷新 Token，将请求加入队列
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              error.config.headers['Authorization'] = `Bearer ${newToken}`
              resolve(request(error.config))
            })
          })
        }
      }
    }
    
    // 处理其他 HTTP 错误状态
    if (error.response) {
      switch (error.response.status) {
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

export default request
