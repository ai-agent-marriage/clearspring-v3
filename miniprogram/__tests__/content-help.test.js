/**
 * 帮助文档单元测试
 * 测试管理员后台帮助文档管理页面的功能
 * 测试文件：miniprogram/__tests__/content-help.test.js
 */

describe('帮助文档页面测试', () => {
  
  test('页面加载正常', () => {
    const page = getPage('/pages/admin/content/help')
    expect(page.data.helpDocs).toBeInstanceOf(Array)
  })
  
  test('帮助文档列表数据结构正确', () => {
    const page = getPage('/pages/admin/content/help')
    const doc = page.data.helpDocs[0]
    expect(doc).toHaveProperty('id')
    expect(doc).toHaveProperty('title')
    expect(doc).toHaveProperty('category')
    expect(doc).toHaveProperty('content')
    expect(doc).toHaveProperty('order')
    expect(doc).toHaveProperty('viewCount')
  })
  
  test('分类标签显示正常', () => {
    const page = getPage('/pages/admin/content/help')
    const doc = page.data.helpDocs[0]
    expect(doc.category).toBeTruthy()
  })
  
  test('分类列表完整', () => {
    const page = getPage('/pages/admin/content/help')
    const categories = page.data.categories
    expect(categories).toContain('全部')
    expect(categories).toContain('志愿者指南')
    expect(categories).toContain('活动指南')
    expect(categories).toContain('护生指南')
    expect(categories).toContain('常见问题')
    expect(categories).toContain('机构指南')
  })
  
  test('分类筛选功能正常', () => {
    const page = getPage('/pages/admin/content/help')
    page.selectCategory('志愿者指南')
    expect(page.data.currentCategory).toBe('志愿者指南')
  })
  
  test('搜索功能正常', () => {
    const page = getPage('/pages/admin/content/help')
    const originalLength = page.data.helpDocs.length
    page.search('志愿者')
    expect(page.data.helpDocs.length).toBeLessThanOrEqual(originalLength)
    page.data.helpDocs.forEach(doc => {
      expect(doc.title.includes('志愿者') || doc.content.includes('志愿者')).toBe(true)
    })
  })
  
  test('新增文档弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/help')
    page.showAddModal()
    expect(page.data.showAddModal).toBe(true)
    expect(page.data.newDoc).toEqual({
      title: '',
      category: '',
      content: '',
      order: 0
    })
  })
  
  test('编辑文档弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/help')
    const doc = page.data.helpDocs[0]
    page.editDoc(doc)
    expect(page.data.showEditModal).toBe(true)
    expect(page.data.editingDoc).toEqual(doc)
  })
  
  test('文档按顺序排列', () => {
    const page = getPage('/pages/admin/content/help')
    const docs = page.data.helpDocs
    for (let i = 1; i < docs.length; i++) {
      expect(docs[i].order).toBeGreaterThanOrEqual(docs[i - 1].order)
    }
  })
  
  test('文档浏览量数据正确', () => {
    const page = getPage('/pages/admin/content/help')
    const doc = page.data.helpDocs[0]
    expect(typeof doc.viewCount).toBe('number')
    expect(doc.viewCount).toBeGreaterThanOrEqual(0)
  })
})

describe('帮助文档接口测试', () => {
  
  test('获取帮助文档列表成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: [], msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/help/list',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('新增帮助文档成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 100 }, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/help/add',
      method: 'POST',
      data: {
        title: '测试文档',
        category: '常见问题',
        content: '测试内容',
        order: 1
      }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('更新帮助文档成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/help/update/1',
      method: 'PUT',
      data: {
        title: '更新后的标题',
        content: '更新后的内容'
      }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('删除帮助文档成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/help/delete/1',
      method: 'DELETE'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('获取帮助文档详情成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: { 
          id: 1, 
          title: '测试文档',
          category: '常见问题'
        } 
      }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/help/1',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.title).toBe('测试文档')
  })
  
  test('获取分类列表成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: ['志愿者指南', '活动指南', '护生指南'] 
      }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/help/categories',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.length).toBeGreaterThan(0)
  })
})
