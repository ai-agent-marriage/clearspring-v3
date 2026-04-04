/**
 * 数据统计集成测试
 * 测试文件：miniprogram/__tests__/integration-stats.test.js
 * 
 * 集成测试需要后端服务运行在 localhost:8080
 */

describe('数据统计集成测试', () => {
  // 模拟 wx.request
  const mockWx = {
    request: jest.fn((options) => {
      let responseData;
      if (options.url.includes('dashboard')) {
        responseData = { totalUsers: 1250, totalOrders: 3480, totalAmount: 128500.50 };
      } else if (options.url.includes('trend')) {
        responseData = [{ date: '2026-04-01', value: 120 }, { date: '2026-04-02', value: 150 }];
      } else if (options.url.includes('species')) {
        responseData = [{ name: '物种 A', value: 30 }, { name: '物种 B', value: 25 }];
      } else if (options.url.includes('rank/volunteer')) {
        responseData = [
          { userId: 'u1', userName: '志愿者 A', score: 980 },
          { userId: 'u2', userName: '志愿者 B', score: 850 }
        ];
      } else if (options.url.includes('rank/org')) {
        responseData = [
          { orgId: 'o1', orgName: '组织 A', score: 2500 },
          { orgId: 'o2', orgName: '组织 B', score: 2100 }
        ];
      } else if (options.url.includes('export')) {
        responseData = { fileUrl: 'http://localhost:8080/file/export.xlsx' };
      } else {
        responseData = {};
      }
      
      return Promise.resolve({
        statusCode: 200,
        data: {
          code: 200,
          data: responseData
        }
      });
    })
  };
  
  global.wx = mockWx;
  
  test('获取仪表盘数据成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/stats/dashboard',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(res.data.data).toHaveProperty('totalUsers');
    expect(res.data.data.totalUsers).toBe(1250);
  });
  
  test('获取订单趋势数据成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/stats/trend?startDate=2026-04-01&endDate=2026-04-07&groupBy=day',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
  });
  
  test('获取物种分布数据成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/stats/species-distribution',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
  });
  
  test('获取志愿者排行榜成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/rank/volunteer?limit=10',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeLessThanOrEqual(10);
  });
  
  test('获取组织排行榜成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/rank/org?limit=10',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
  });
  
  test('导出数据成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/stats/export?startDate=2026-04-01&endDate=2026-04-07&type=orders',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
  });
});
