/**
 * Vitest 测试配置文件
 * 模拟微信小程序全局 API
 */

// 模拟微信小程序全局对象
const mockWx = {
  // 导航相关
  navigateTo: vi.fn(),
  switchTab: vi.fn(),
  navigateBack: vi.fn(),
  
  // UI 相关
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  showToast: vi.fn(),
  showModal: vi.fn(),
  showActionSheet: vi.fn(),
  
  // 系统信息
  getSystemInfoSync: vi.fn(() => ({
    statusBarHeight: 20,
    screenWidth: 375,
    screenHeight: 667,
    platform: 'ios'
  })),
  
  // 存储相关
  setStorage: vi.fn(),
  getStorage: vi.fn(),
  removeStorage: vi.fn(),
  
  // 网络相关
  request: vi.fn(),
  
  // 页面相关
  stopPullDownRefresh: vi.fn(),
  startPullDownRefresh: vi.fn()
};

// 将 wx 对象挂载到全局
Object.assign(global, {
  wx: mockWx,
  Component: vi.fn((config) => config),
  Page: vi.fn((config) => config),
  getApp: vi.fn(() => ({
    globalData: {}
  }))
});

// 导出 mock 对象供测试使用
export const wx = mockWx;

// 重置所有 mock
beforeEach(() => {
  vi.clearAllMocks();
});
