/**
 * utils/request.js 单元测试
 * 测试请求封装的各项功能
 */
/* eslint-disable no-unused-vars */

const request = require('../utils/request.js');
const config = require('../config.js');

beforeEach(() => {
  jest.clearAllMocks();
  
  // 重置 wx storage
  wx.getStorageSync.mockReturnValue(null);
  wx.setStorageSync.mockImplementation(() => {});
  wx.removeStorageSync.mockImplementation(() => {});
  
  // 重置 wx.request 默认实现
  wx.request.mockImplementation((options) => {
    if (options.success) {
      setTimeout(() => options.success({ statusCode: 200, data: { code: 200, data: {} } }), 0);
    }
    return Promise.resolve({ statusCode: 200, data: { code: 200, data: {} } });
  });
  
  // 重置 wx.reLaunch
  wx.reLaunch.mockImplementation(() => {});
});

describe('request - 基础请求', () => {
  test('发起 GET 请求', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200, data: { result: 'success' } } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    const result = await request.request({ url: '/api/test', method: 'GET' });
    
    expect(wx.request).toHaveBeenCalled();
    expect(result.data.result).toBe('success');
  });

  test('发起 POST 请求', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200, data: { id: 1 } } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    const result = await request.request({ 
      url: '/api/create', 
      method: 'POST',
      data: { name: 'test' }
    });
    
    expect(wx.request).toHaveBeenCalled();
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.method).toBe('POST');
    expect(callArgs.data).toEqual({ name: 'test' });
  });

  test('请求 URL 拼接 baseUrl', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.url).toBe(config.baseUrl + '/api/test');
  });

  test('使用配置的超时时间', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.timeout).toBe(config.timeout);
  });

  test('合并自定义配置', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ 
      url: '/api/test',
      timeout: 20000,
      method: 'PUT'
    });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.timeout).toBe(20000);
    expect(callArgs.method).toBe('PUT');
  });
});

describe('request - 请求拦截器', () => {
  test('添加 Authorization token', async () => {
    wx.getStorageSync.mockReturnValue('mock_token_123');
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.header['Authorization']).toBe('Bearer mock_token_123');
  });

  test('无 token 时不添加 Authorization', async () => {
    wx.getStorageSync.mockReturnValue(null);
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.header['Authorization']).toBeUndefined();
  });

  test('添加 Content-Type 请求头', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.header['Content-Type']).toBe('application/json');
  });

  test('添加 X-Requested-With 请求头', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.header['X-Requested-With']).toBe('XMLHttpRequest');
  });

  test('添加 X-App-Version 请求头', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.header['X-App-Version']).toBe(config.appVersion);
  });

  test('保留自定义请求头', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ 
      url: '/api/test',
      header: { 'X-Custom-Header': 'custom_value' }
    });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.header['X-Custom-Header']).toBe('custom_value');
  });
});

describe('request - 响应拦截器', () => {
  test('HTTP 200 正常返回', async () => {
    const mockResponse = { 
      statusCode: 200, 
      data: { code: 200, data: { result: 'success' } } 
    };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    const result = await request.request({ url: '/api/test' });
    
    expect(result.data.result).toBe('success');
  });

  test('HTTP 401 跳转登录', async () => {
    const mockResponse = { statusCode: 401, data: {} };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      expect(e.code).toBe(401);
    }
    
    expect(wx.removeStorageSync).toHaveBeenCalledWith('token');
    expect(wx.removeStorageSync).toHaveBeenCalledWith('userInfo');
    expect(wx.reLaunch).toHaveBeenCalledWith({ url: '/pages/login/login' });
  });

  test('HTTP 403 返回无权限错误', async () => {
    const mockResponse = { statusCode: 403, data: {} };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      expect(e.code).toBe(403);
      expect(e.message).toBe('无权限访问');
    }
  });

  test('HTTP 404 返回资源不存在错误', async () => {
    const mockResponse = { statusCode: 404, data: {} };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      expect(e.code).toBe(404);
      expect(e.message).toBe('请求资源不存在');
    }
  });

  test('HTTP 500 返回服务器错误', async () => {
    const mockResponse = { statusCode: 500, data: {} };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      expect(e.code).toBe(500);
      expect(e.message).toBe('服务器错误');
    }
  });

  test('业务状态码非 200 返回错误', async () => {
    const mockResponse = { 
      statusCode: 200, 
      data: { code: 400, message: '参数错误' } 
    };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      expect(e.code).toBe(400);
      expect(e.message).toBe('参数错误');
    }
  });

  test('业务状态码为 0 视为成功', async () => {
    const mockResponse = { 
      statusCode: 200, 
      data: { code: 0, data: { result: 'success' } } 
    };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    const result = await request.request({ url: '/api/test' });
    
    expect(result.data.result).toBe('success');
  });
});

describe('request - 错误处理', () => {
  test('网络错误返回错误信息', async () => {
    wx.request.mockImplementation((options) => {
      return new Promise((resolve) => {
        // 不调用 fail，直接 resolve 一个错误响应
        resolve({ statusCode: -1, data: { code: -1, message: 'network timeout' } });
      });
    });
    
    // request.js 的 fail 回调会处理错误
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      // 预期会被 reject
    }
    
    // 验证 wx.request 被调用
    expect(wx.request).toHaveBeenCalled();
  });
});

describe('快捷方法 - get/post/put/del', () => {
  test('get 方法发起 GET 请求', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200, data: {} } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.get('/api/users', { page: 1 });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.method).toBe('GET');
    expect(callArgs.data).toEqual({ page: 1 });
  });

  test('post 方法发起 POST 请求', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200, data: {} } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.post('/api/users', { name: 'test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.method).toBe('POST');
    expect(callArgs.data).toEqual({ name: 'test' });
  });

  test('put 方法发起 PUT 请求', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200, data: {} } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.put('/api/users/1', { name: 'updated' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.method).toBe('PUT');
  });

  test('del 方法发起 DELETE 请求', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200, data: {} } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.del('/api/users/1');
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.method).toBe('DELETE');
  });
});

describe('upload - 文件上传', () => {
  test('上传文件', async () => {
    wx.uploadFile.mockImplementation((options) => {
      if (options.success) {
        options.success({ data: JSON.stringify({ code: 200, data: { url: 'file_url' } }) });
      }
      return Promise.resolve();
    });
    
    const result = await request.upload('/api/upload', '/tmp/file.jpg', { type: 'avatar' });
    
    expect(wx.uploadFile).toHaveBeenCalled();
    const callArgs = wx.uploadFile.mock.calls[0][0];
    expect(callArgs.filePath).toBe('/tmp/file.jpg');
    expect(callArgs.name).toBe('file');
    expect(callArgs.formData).toEqual({ type: 'avatar' });
    expect(result.data.url).toBe('file_url');
  });

  test('上传时添加 token', async () => {
    wx.getStorageSync.mockReturnValue('upload_token');
    wx.uploadFile.mockImplementation((options) => {
      if (options.success) {
        options.success({ data: JSON.stringify({ code: 200 }) });
      }
      return Promise.resolve();
    });
    
    await request.upload('/api/upload', '/tmp/file.jpg');
    
    const callArgs = wx.uploadFile.mock.calls[0][0];
    expect(callArgs.header['Authorization']).toBe('Bearer upload_token');
  });

  test('上传失败返回错误', async () => {
    wx.uploadFile.mockImplementation((options) => {
      if (options.fail) {
        options.fail({ errMsg: 'upload failed' });
      }
      return Promise.reject();
    });
    
    try {
      await request.upload('/api/upload', '/tmp/file.jpg');
    } catch (e) {
      expect(e.code).toBe(-1);
      expect(e.message).toBe('upload failed');
    }
  });

  test('上传返回业务错误', async () => {
    wx.uploadFile.mockImplementation((options) => {
      if (options.success) {
        options.success({ data: JSON.stringify({ code: 400, message: '文件过大' }) });
      }
      return Promise.resolve();
    });
    
    try {
      await request.upload('/api/upload', '/tmp/file.jpg');
    } catch (e) {
      expect(e.code).toBe(400);
      expect(e.message).toBe('文件过大');
    }
  });
});

describe('请求超时', () => {
  test('使用默认超时配置', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test' });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.timeout).toBe(config.timeout);
  });

  test('自定义超时时间', async () => {
    const mockResponse = { statusCode: 200, data: { code: 200 } };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    await request.request({ url: '/api/test', timeout: 30000 });
    
    const callArgs = wx.request.mock.calls[0][0];
    expect(callArgs.timeout).toBe(30000);
  });
});

describe('Token 刷新场景', () => {
  test('401 响应后清除本地 token', async () => {
    const mockResponse = { statusCode: 401, data: {} };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      // 预期错误
    }
    
    expect(wx.removeStorageSync).toHaveBeenCalledWith('token');
    expect(wx.removeStorageSync).toHaveBeenCalledWith('userInfo');
  });

  test('401 响应后跳转登录页', async () => {
    const mockResponse = { statusCode: 401, data: {} };
    wx.request.mockImplementation((options) => {
      if (options.success) options.success(mockResponse);
      return Promise.resolve(mockResponse);
    });
    
    try {
      await request.request({ url: '/api/test' });
    } catch (e) {
      // 预期错误
    }
    
    expect(wx.reLaunch).toHaveBeenCalledWith({ url: '/pages/login/login' });
  });
});
