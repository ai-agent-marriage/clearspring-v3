/**
 * 清如 ClearSpring - 认证工具模块
 * 提供登录状态检查、权限验证等功能
 */

/**
 * 检查用户登录状态（小程序端）
 * @returns {boolean} - 是否已登录
 */
function checkLoginStatus() {
  try {
    const openid = wx.getStorageSync('openid');
    const token = wx.getStorageSync('token');
    
    if (!openid || !token) {
      return false;
    }
    
    // 验证 token 是否过期（可选）
    const tokenExpiry = wx.getStorageSync('token_expiry');
    if (tokenExpiry && Date.now() > tokenExpiry) {
      // Token 已过期，清除本地存储
      wx.removeStorageSync('openid');
      wx.removeStorageSync('token');
      wx.removeStorageSync('token_expiry');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('检查登录状态失败:', error);
    return false;
  }
}

/**
 * 检查管理员登录状态（管理端）
 * @returns {boolean} - 是否已登录
 */
function checkAdminLoginStatus() {
  try {
    const token = wx.getStorageSync('admin_token');
    
    if (!token) {
      return false;
    }
    
    // 验证 token 是否过期（可选）
    const tokenExpiry = wx.getStorageSync('admin_token_expiry');
    if (tokenExpiry && Date.now() > tokenExpiry) {
      wx.removeStorageSync('admin_token');
      wx.removeStorageSync('admin_token_expiry');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('检查管理员登录状态失败:', error);
    return false;
  }
}

/**
 * 跳转到登录页
 * @param {string} type - 登录类型：'user' 或 'admin'
 */
function redirectToLogin(type = 'user') {
  wx.showModal({
    title: '未登录',
    content: '请先登录后再访问此页面',
    showCancel: false,
    success: () => {
      if (type === 'admin') {
        // 管理端跳转到管理登录页
        wx.reLaunch({
          url: '/pages/admin-login/login'
        });
      } else {
        // 用户端跳转到用户登录页
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  });
}

/**
 * 管理端页面登录验证中间件（在页面 onLoad 时调用）
 * @param {object} pageContext - 页面上下文
 */
function requireAdminAuth(pageContext) {
  if (!checkAdminLoginStatus()) {
    redirectToLogin('admin');
    return false;
  }
  return true;
}

/**
 * 用户端页面登录验证中间件（在页面 onLoad 时调用）
 * @param {object} pageContext - 页面上下文
 */
function requireUserAuth(pageContext) {
  if (!checkLoginStatus()) {
    redirectToLogin('user');
    return false;
  }
  return true;
}

/**
 * 获取当前用户 OpenID
 * @returns {string|null} - 用户 OpenID
 */
function getCurrentOpenId() {
  try {
    return wx.getStorageSync('openid') || null;
  } catch (error) {
    console.error('获取 OpenID 失败:', error);
    return null;
  }
}

/**
 * 获取当前管理员 Token
 * @returns {string|null} - 管理员 Token
 */
function getCurrentAdminToken() {
  try {
    return wx.getStorageSync('admin_token') || null;
  } catch (error) {
    console.error('获取管理员 Token 失败:', error);
    return null;
  }
}

module.exports = {
  checkLoginStatus,
  checkAdminLoginStatus,
  redirectToLogin,
  requireAdminAuth,
  requireUserAuth,
  getCurrentOpenId,
  getCurrentAdminToken
};
