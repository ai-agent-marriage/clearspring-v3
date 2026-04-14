// 微信小程序 API 完整 Mock
// 用于 Jest 测试环境

const mockWx = {
  // 网络请求
  request: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'request:ok',
      statusCode: 200,
      data: options.data || {}
    });
  }),
  
  // 提示框
  showToast: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'showToast:ok' });
  }),
  
  hideToast: jest.fn(() => {
    return Promise.resolve({ errMsg: 'hideToast:ok' });
  }),
  
  showLoading: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'showLoading:ok' });
  }),
  
  hideLoading: jest.fn(() => {
    return Promise.resolve({ errMsg: 'hideLoading:ok' });
  }),
  
  showModal: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'showModal:ok',
      confirm: true,
      cancel: false
    });
  }),
  
  // 导航
  navigateTo: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'navigateTo:ok' });
  }),
  
  navigateBack: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'navigateBack:ok' });
  }),
  
  redirectTo: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'redirectTo:ok' });
  }),
  
  reLaunch: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'reLaunch:ok' });
  }),
  
  switchTab: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'switchTab:ok' });
  }),
  
  // 存储
  setStorage: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'setStorage:ok' });
  }),
  
  getStorage: jest.fn((options) => {
    const key = options.key;
    const value = global.mockStorage ? global.mockStorage[key] : null;
    return Promise.resolve({
      errMsg: 'getStorage:ok',
      data: value
    });
  }),
  
  removeStorage: jest.fn((options) => {
    if (global.mockStorage && global.mockStorage[options.key]) {
      delete global.mockStorage[options.key];
    }
    return Promise.resolve({ errMsg: 'removeStorage:ok' });
  }),
  
  clearStorage: jest.fn(() => {
    global.mockStorage = {};
    return Promise.resolve({ errMsg: 'clearStorage:ok' });
  }),
  
  // 登录
  login: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'login:ok',
      code: 'mock_code_' + Date.now()
    });
  }),
  
  // 用户信息
  getUserProfile: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'getUserProfile:ok',
      userInfo: {
        nickName: '测试用户',
        avatarUrl: 'https://example.com/avatar.png',
        gender: 1
      }
    });
  }),
  
  // 选择图片
  chooseImage: jest.fn((options) => {
    const count = options.count || 9;
    const tempFilePaths = [];
    for (let i = 0; i < count; i++) {
      tempFilePaths.push(`mock_image_${Date.now()}_${i}.jpg`);
    }
    return Promise.resolve({
      errMsg: 'chooseImage:ok',
      tempFilePaths,
      tempFiles: tempFilePaths.map(path => ({
        path,
        size: 102400
      }))
    });
  }),
  
  // 上传图片
  uploadFile: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'uploadFile:ok',
      statusCode: 200,
      data: JSON.stringify({
        code: 0,
        message: '上传成功',
        url: 'https://example.com/uploaded.jpg'
      })
    });
  }),
  
  // 下载文件
  downloadFile: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'downloadFile:ok',
      tempFilePath: `mock_download_${Date.now()}.tmp`,
      statusCode: 200
    });
  }),
  
  // 保存图片
  saveImageToPhotosAlbum: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'saveImageToPhotosAlbum:ok' });
  }),
  
  // 预览图片
  previewImage: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'previewImage:ok' });
  }),
  
  // 获取系统信息
  getSystemInfo: jest.fn((options) => {
    const success = options.success;
    const info = {
      brand: 'mock',
      model: 'mock',
      pixelRatio: 2,
      screenWidth: 375,
      screenHeight: 667,
      windowWidth: 375,
      windowHeight: 667,
      statusBarHeight: 20,
      language: 'zh_CN',
      version: '8.0.0',
      SDKVersion: '2.19.4'
    };
    if (success) success(info);
    return Promise.resolve(info);
  }),
  
  getSystemInfoSync: jest.fn(() => {
    return {
      brand: 'mock',
      model: 'mock',
      pixelRatio: 2,
      screenWidth: 375,
      screenHeight: 667,
      windowWidth: 375,
      windowHeight: 667,
      statusBarHeight: 20,
      language: 'zh_CN',
      version: '8.0.0',
      SDKVersion: '2.19.4'
    };
  }),
  
  // 获取网络状态
  getNetworkType: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'getNetworkType:ok',
      networkType: 'wifi'
    });
  }),
  
  onNetworkStatusChange: jest.fn((callback) => {
    // 模拟网络状态变化
  }),
  
  // 获取位置
  getLocation: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'getLocation:ok',
      latitude: 23.1234,
      longitude: 113.5678,
      speed: 0,
      accuracy: 10
    });
  }),
  
  chooseLocation: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'chooseLocation:ok',
      name: '测试地点',
      address: '测试地址',
      latitude: 23.1234,
      longitude: 113.5678
    });
  }),
  
  openLocation: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'openLocation:ok' });
  }),
  
  // 扫码
  scanCode: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'scanCode:ok',
      result: 'mock_scan_result',
      scanType: ['qrCode']
    });
  }),
  
  // 剪切板
  setClipboardData: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'setClipboardData:ok' });
  }),
  
  getClipboardData: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'getClipboardData:ok',
      data: 'mock_clipboard_data'
    });
  }),
  
  // 拨打电话
  makePhoneCall: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'makePhoneCall:ok' });
  }),
  
  // 添加联系人
  addPhoneContact: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'addPhoneContact:ok' });
  }),
  
  // 震动
  vibrateShort: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'vibrateShort:ok' });
  }),
  
  vibrateLong: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'vibrateLong:ok' });
  }),
  
  // 蓝牙
  openBluetoothAdapter: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'openBluetoothAdapter:ok' });
  }),
  
  closeBluetoothAdapter: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'closeBluetoothAdapter:ok' });
  }),
  
  // 文件
  getFileSystemManager: jest.fn(() => {
    return {
      writeFile: jest.fn((options) => {
        return Promise.resolve({ errMsg: 'writeFile:ok' });
      }),
      readFile: jest.fn((options) => {
        return Promise.resolve({
          errMsg: 'readFile:ok',
          data: 'mock_file_content'
        });
      }),
      unlink: jest.fn((options) => {
        return Promise.resolve({ errMsg: 'unlink:ok' });
      }),
      mkdir: jest.fn((options) => {
        return Promise.resolve({ errMsg: 'mkdir:ok' });
      }),
      readdir: jest.fn((options) => {
        return Promise.resolve({
          errMsg: 'readdir:ok',
          files: ['file1.txt', 'file2.txt']
        });
      }),
      stat: jest.fn((options) => {
        return Promise.resolve({
          errMsg: 'stat:ok',
          stats: {
            isFile: () => true,
            isDirectory: () => false,
            size: 1024
          }
        });
      })
    };
  }),
  
  // 分享
  showShareMenu: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'showShareMenu:ok' });
  }),
  
  hideShareMenu: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'hideShareMenu:ok' });
  }),
  
  // 订阅消息
  requestSubscribeMessage: jest.fn((options) => {
    const result = {};
    options.tmplIds.forEach(id => {
      result[id] = 'accept';
    });
    return Promise.resolve(result);
  }),
  
  // 云开发
  cloud: {
    init: jest.fn((options) => {
      return Promise.resolve({ errMsg: 'cloud.init:ok' });
    }),
    CloudID: jest.fn((cloudID) => {
      return { cloudID };
    }),
    callFunction: jest.fn((options) => {
      return Promise.resolve({
        result: options.data || {},
        errMsg: 'cloud.callFunction:ok'
      });
    })
  },
  
  // 性能
  reportAnalytics: jest.fn((event, data) => {
    // 模拟上报
  }),
  
  // 其他工具
  createSelectorQuery: jest.fn(() => {
    return {
      select: jest.fn(() => ({
        boundingClientRect: jest.fn((callback) => {
          callback({
            left: 0,
            top: 0,
            right: 375,
            bottom: 100,
            width: 375,
            height: 100
          });
          return { exec: jest.fn() };
        })
      })),
      selectViewport: jest.fn(() => ({
        boundingClientRect: jest.fn((callback) => {
          callback({
            left: 0,
            top: 0,
            right: 375,
            bottom: 667,
            width: 375,
            height: 667
          });
          return { exec: jest.fn() };
        })
      })),
      exec: jest.fn()
    };
  }),
  
  createIntersectionObserver: jest.fn((options) => {
    return {
      observe: jest.fn((selector, callback) => {
        callback({
          boundingClientRect: { left: 0, top: 0, right: 100, bottom: 100 },
          intersectionRect: { left: 0, top: 0, right: 50, bottom: 50 },
          intersectionRatio: 0.25
        });
      }),
      disconnect: jest.fn()
    };
  }),
  
  // 动画
  createAnimation: jest.fn((options) => {
    return {
      step: jest.fn(() => ({
        step: jest.fn(() => ({
          step: jest.fn()
        }))
      })),
      export: jest.fn(() => ({
        actions: []
      }))
    };
  }),
  
  // 画布
  createCanvasContext: jest.fn((canvasId) => {
    return {
      draw: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillText: jest.fn(),
      strokeText: jest.fn(),
      drawImage: jest.fn(),
      beginPath: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn()
    };
  }),
  
  // 录音
  getRecorderManager: jest.fn(() => {
    return {
      start: jest.fn(),
      stop: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      onStart: jest.fn(),
      onStop: jest.fn(),
      onPause: jest.fn(),
      onResume: jest.fn(),
      onFrameRecorded: jest.fn(),
      onError: jest.fn()
    };
  }),
  
  // 背景音频
  getBackgroundAudioManager: jest.fn(() => {
    return {
      play: jest.fn(),
      pause: jest.fn(),
      seek: jest.fn(),
      stop: jest.fn(),
      onPlay: jest.fn(),
      onPause: jest.fn(),
      onEnded: jest.fn(),
      onStop: jest.fn()
    };
  }),
  
  // 视频
  createVideoContext: jest.fn((videoId) => {
    return {
      play: jest.fn(),
      pause: jest.fn(),
      stop: jest.fn(),
      seek: jest.fn(),
      sendDanmu: jest.fn()
    };
  }),
  
  // 地图
  createMapContext: jest.fn((mapId) => {
    return {
      getCenterLocation: jest.fn(),
      moveToLocation: jest.fn(),
      translateMarker: jest.fn(),
      includePoints: jest.fn()
    };
  }),
  
  // Worker
  createWorker: jest.fn((scriptPath) => {
    return {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onMessage: jest.fn()
    };
  }),
  
  // 更新
  updateManager: {
    onCheckForUpdate: jest.fn(),
    onUpdateReady: jest.fn(),
    onUpdateFailed: jest.fn()
  },
  
  // 日志
  getLogManager: jest.fn(() => {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };
  }),
  
  // 设置
  openSetting: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'openSetting:ok',
      authSetting: {}
    });
  }),
  
  getSetting: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'getSetting:ok',
      authSetting: {}
    });
  }),
  
  authorize: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'authorize:ok' });
  }),
  
  // 卡券
  addCard: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'addCard:ok',
      cardList: []
    });
  }),
  
  openCard: jest.fn((options) => {
    return Promise.resolve({ errMsg: 'openCard:ok' });
  }),
  
  // 发票
  chooseInvoiceTitle: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'chooseInvoiceTitle:ok',
      type: '个人',
      title: '测试抬头'
    });
  }),
  
  // 支付
  requestPayment: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'requestPayment:ok',
      errCode: 0
    });
  }),
  
  // 人脸识别
  startFacialRecognitionVerify: jest.fn((options) => {
    return Promise.resolve({
      errMsg: 'startFacialRecognitionVerify:ok',
      verifyResult: 'mock_result'
    });
  })
};

// 初始化 mock 存储
global.mockStorage = {};

// 导出 mock 对象
module.exports = mockWx;

// 全局注册
if (typeof global !== 'undefined') {
  global.wx = mockWx;
}
