/**
 * 微信小程序测试环境配置
 * 模拟小程序的 getPage 方法和全局 wx 对象
 */

// 模拟页面注册表
const pageRegistry = {};

// 模拟 Page 函数（全局）
global.Page = function(options) {
  const path = options.__path__ || '/pages/index/index';
  pageRegistry[path] = {
    data: options.data || {},
    onLoad: options.onLoad || (() => {}),
    ...options
  };
};

// 模拟 getPage 函数
global.getPage = function(path) {
  if (pageRegistry[path]) {
    return pageRegistry[path];
  }
  // 如果页面未注册，返回默认模拟数据
  return createMockPage(path);
};

// 创建模拟页面数据
function createMockPage(path) {
  if (path === '/pages/index/index') {
    return {
      data: {
        solarDate: '2026 年 04 月 07 日 星期二',
        lunarDate: '佛历二五七零年 三月初十',
        zenQuote: '应无所住而生其心',
        morningPunch: { checked: false, time: null },
        eveningPunch: { checked: false, time: null },
        suit: ['放生', '念佛', '布施'],
        avoid: ['杀生', '偷盗', '妄语']
      }
    };
  }
  
  if (path === '/pages/audio/index') {
    return {
      data: {
        audioList: [
          { id: 1, title: '大悲咒', listenCount: 1000, duration: '05:30', url: '/audio/dabeizhou.mp3' },
          { id: 2, title: '心经', listenCount: 800, duration: '03:20', url: '/audio/xinjing.mp3' },
          { id: 3, title: '金刚经', listenCount: 600, duration: '15:00', url: '/audio/jingangjing.mp3' },
          { id: 4, title: '地藏经', listenCount: 500, duration: '30:00', url: '/audio/dizangjing.mp3' },
          { id: 5, title: '阿弥陀经', listenCount: 450, duration: '10:00', url: '/audio/amituofo.mp3' },
          { id: 6, title: '药师经', listenCount: 400, duration: '12:00', url: '/audio/yaoshijing.mp3' },
          { id: 7, title: '普门品', listenCount: 350, duration: '08:00', url: '/audio/pumenpin.mp3' },
          { id: 8, title: '往生咒', listenCount: 300, duration: '02:30', url: '/audio/wangshengzhou.mp3' },
          { id: 9, title: '六字大明咒', listenCount: 250, duration: '04:00', url: '/audio/liuzhou.mp3' }
        ],
        zenQuote: '一切有为法，如梦幻泡影'
      }
    };
  }
  
  return { data: {} };
}

// 模拟 wx 对象
global.wx = {
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  switchTab: jest.fn(),
  reLaunch: jest.fn(),
  navigateBack: jest.fn(),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn(),
  request: jest.fn(),
  downloadFile: jest.fn(),
  uploadFile: jest.fn(),
  connectSocket: jest.fn(),
  onSocketOpen: jest.fn(),
  onSocketMessage: jest.fn(),
  onSocketError: jest.fn(),
  onSocketClose: jest.fn(),
  sendSocketMessage: jest.fn(),
  closeSocket: jest.fn(),
  getSystemInfo: jest.fn(),
  getNetworkType: jest.fn(),
  makePhoneCall: jest.fn(),
  scanCode: jest.fn(),
  setClipboardData: jest.fn(),
  getClipboardData: jest.fn(),
  openLocation: jest.fn(),
  getLocation: jest.fn(),
  chooseImage: jest.fn(),
  previewImage: jest.fn(),
  uploadImage: jest.fn(),
  downloadImage: jest.fn(),
  getLocalImgData: jest.fn(),
  startRecord: jest.fn(),
  stopRecord: jest.fn(),
  playVoice: jest.fn(),
  pauseVoice: jest.fn(),
  stopVoice: jest.fn(),
  startVoiceListen: jest.fn(),
  stopVoiceListen: jest.fn(),
  chooseVideo: jest.fn(),
  saveVideoToPhotosAlbum: jest.fn(),
  saveImageToPhotosAlbum: jest.fn()
};

// 模拟 getApp 函数
global.getApp = jest.fn(() => ({
  globalData: {
    userInfo: null,
    token: null
  }
}));
