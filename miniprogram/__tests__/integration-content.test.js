/**
 * 内容管理集成测试
 * 测试内容管理模块的完整流程
 * 测试文件：miniprogram/__tests__/integration-content.test.js
 */

describe('内容管理集成测试', () => {
  
  test('物种管理完整流程', async () => {
    // 1. 新增物种
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 100 }, msg: 'success' }
    });
    
    const res1 = await wx.request({
      url: 'http://localhost:8080/api/content/species/add',
      method: 'POST',
      data: {
        name: '测试物种',
        scientificName: 'Test Species',
        type: 1,
        isForbid: 0
      }
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.data.code).toBe(200);
    
    // 2. 获取物种列表
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: [
          { id: 100, name: '测试物种', scientificName: 'Test Species', type: 1, isForbid: 0 }
        ],
        msg: 'success' 
      }
    });
    
    const res2 = await wx.request({
      url: 'http://localhost:8080/api/content/species/list',
      method: 'GET'
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.data.code).toBe(200);
    expect(res2.data.data.length).toBeGreaterThan(0);
    
    // 3. 更新物种
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    });
    
    const res3 = await wx.request({
      url: 'http://localhost:8080/api/content/species/update/100',
      method: 'PUT',
      data: { remark: '更新备注' }
    });
    expect(res3.statusCode).toBe(200);
    expect(res3.data.code).toBe(200);
  });
  
  test('公告管理完整流程', async () => {
    // 1. 新增公告
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 200 }, msg: 'success' }
    });
    
    const res1 = await wx.request({
      url: 'http://localhost:8080/api/content/notice/add',
      method: 'POST',
      data: {
        title: '测试公告',
        content: '测试内容'
      }
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.data.code).toBe(200);
    
    // 2. 发布公告
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    });
    
    const res2 = await wx.request({
      url: 'http://localhost:8080/api/content/notice/publish/200',
      method: 'POST'
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.data.code).toBe(200);
    
    // 3. 获取公告列表验证状态
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: [
          { id: 200, title: '测试公告', status: 1, statusName: '已发布' }
        ],
        msg: 'success' 
      }
    });
    
    const res3 = await wx.request({
      url: 'http://localhost:8080/api/content/notice/list',
      method: 'GET'
    });
    expect(res3.statusCode).toBe(200);
    expect(res3.data.code).toBe(200);
    expect(res3.data.data[0].status).toBe(1);
  });
  
  test('帮助文档管理完整流程', async () => {
    // 1. 新增帮助文档
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 300 }, msg: 'success' }
    });
    
    const res1 = await wx.request({
      url: 'http://localhost:8080/api/content/help/add',
      method: 'POST',
      data: {
        title: '测试帮助文档',
        category: '常见问题',
        content: '测试内容',
        order: 1
      }
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.data.code).toBe(200);
    
    // 2. 获取帮助文档列表
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: [
          { id: 300, title: '测试帮助文档', category: '常见问题' }
        ],
        msg: 'success' 
      }
    });
    
    const res2 = await wx.request({
      url: 'http://localhost:8080/api/content/help/list',
      method: 'GET'
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.data.code).toBe(200);
    
    // 3. 更新帮助文档
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    });
    
    const res3 = await wx.request({
      url: 'http://localhost:8080/api/content/help/update/300',
      method: 'PUT',
      data: { title: '更新后的帮助文档' }
    });
    expect(res3.statusCode).toBe(200);
    expect(res3.data.code).toBe(200);
  });
  
  test('内容审核完整流程', async () => {
    // 1. 提交内容审核
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { auditId: 'AUDIT001', result: 'pass' }, msg: 'success' }
    });
    
    const res1 = await wx.request({
      url: 'http://localhost:8080/api/content/audit/submit',
      method: 'POST',
      data: {
        contentType: 'text',
        content: '正常的内容'
      }
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.data.code).toBe(200);
    expect(res1.data.data.result).toBe('pass');
    
    // 2. 查询审核结果
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: { 
          auditId: 'AUDIT001', 
          result: 'pass',
          auditTime: '2026-04-04 15:00:00'
        },
        msg: 'success' 
      }
    });
    
    const res2 = await wx.request({
      url: 'http://localhost:8080/api/content/audit/result/AUDIT001',
      method: 'GET'
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.data.code).toBe(200);
    expect(res2.data.data.result).toBe('pass');
  });
  
  test('敏感词管理完整流程', async () => {
    // 1. 添加敏感词
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 400 }, msg: 'success' }
    });
    
    const res1 = await wx.request({
      url: 'http://localhost:8080/api/content/sensitiveWord/add',
      method: 'POST',
      data: {
        word: '测试敏感词',
        level: 2,
        type: 1
      }
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.data.code).toBe(200);
    
    // 2. 获取敏感词列表
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: [
          { id: 400, word: '测试敏感词', level: 2 }
        ],
        total: 1,
        msg: 'success' 
      }
    });
    
    const res2 = await wx.request({
      url: 'http://localhost:8080/api/content/sensitiveWord/list',
      method: 'GET',
      data: { pageNum: 1, pageSize: 10 }
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.data.code).toBe(200);
    expect(res2.data.data.length).toBe(1);
    
    // 3. 更新敏感词
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    });
    
    const res3 = await wx.request({
      url: 'http://localhost:8080/api/content/sensitiveWord/update/400',
      method: 'PUT',
      data: { level: 3 }
    });
    expect(res3.statusCode).toBe(200);
    expect(res3.data.code).toBe(200);
  });
  
  test('内容管理权限验证', async () => {
    // 未登录用户访问管理接口
    wx.request.mockResolvedValue({
      statusCode: 401,
      data: { code: 401, msg: '未登录' }
    });
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/list',
      method: 'GET',
      header: {} // 无 token
    });
    expect(res.statusCode).toBe(401);
    expect(res.data.code).toBe(401);
  });
});
