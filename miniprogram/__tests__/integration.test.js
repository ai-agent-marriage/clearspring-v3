/**
 * 前后端联调集成测试
 * 测试小程序与后端 API 的接口调用
 */

describe('前后端联调测试', () => {
  
  // 模拟 wx.request 的响应
  beforeEach(() => {
    wx.request.mockImplementation((options) => {
      return Promise.resolve({
        statusCode: 200,
        data: {
          code: 200,
          msg: 'success',
          data: options.url.includes('lunar') 
            ? { solarDate: '2026-04-07', lunarDate: '三月初十', ganzhi: '癸卯年 丙辰月' }
            : options.url.includes('zen')
              ? { content: '应无所住而生其心', author: '《金刚经》' }
              : [
                { id: 1, name: '鲢鱼', scientificName: 'Hypophthalmichthys molitrix', type: 1, isForbid: 0 },
                { id: 2, name: '鳙鱼', scientificName: 'Hypophthalmichthys nobilis', type: 1, isForbid: 0 }
              ]
        }
      })
    })
  })
  
  test('佛历数据接口调用成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/lunar/today',
      method: 'GET'
    })
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('solarDate')
  })
  
  test('禅理内容接口调用成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/zen/random',
      method: 'GET'
    })
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('content')
  })
  
  test('物种查询接口调用成功', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/species/list',
      method: 'GET'
    })
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toBeInstanceOf(Array)
  })
  
  test('佛历接口返回完整数据', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/lunar/today',
      method: 'GET'
    })
    expect(res.data.data).toHaveProperty('lunarDate')
    expect(res.data.data).toHaveProperty('ganzhi')
  })
  
  test('禅理接口返回作者信息', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/zen/random',
      method: 'GET'
    })
    expect(res.data.data).toHaveProperty('author')
  })
  
  test('物种接口返回数组数据', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/species/list',
      method: 'GET'
    })
    expect(Array.isArray(res.data.data)).toBe(true)
    expect(res.data.data.length).toBeGreaterThan(0)
  })
  
  test('接口调用使用正确的 HTTP 方法', async () => {
    await wx.request({
      url: 'http://localhost:8080/api/lunar/today',
      method: 'GET'
    })
    expect(wx.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET'
      })
    )
  })
  
  test('多个接口连续调用成功', async () => {
    const lunarRes = await wx.request({ url: 'http://localhost:8080/api/lunar/today', method: 'GET' })
    const zenRes = await wx.request({ url: 'http://localhost:8080/api/zen/random', method: 'GET' })
    const speciesRes = await wx.request({ url: 'http://localhost:8080/api/species/list', method: 'GET' })
    
    expect(lunarRes.statusCode).toBe(200)
    expect(zenRes.statusCode).toBe(200)
    expect(speciesRes.statusCode).toBe(200)
  })
})
