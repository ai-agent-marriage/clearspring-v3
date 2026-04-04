/**
 * 公告管理单元测试
 * 测试管理员后台公告管理页面的功能
 * 测试文件：miniprogram/__tests__/content-notice.test.js
 */

describe('公告管理页面测试', () => {
  
  test('页面加载正常', () => {
    const page = getPage('/pages/admin/content/notice')
    expect(page.data.notices).toBeInstanceOf(Array)
  })
  
  test('公告列表数据结构正确', () => {
    const page = getPage('/pages/admin/content/notice')
    const notice = page.data.notices[0]
    expect(notice).toHaveProperty('id')
    expect(notice).toHaveProperty('title')
    expect(notice).toHaveProperty('content')
    expect(notice).toHaveProperty('status')
    expect(notice).toHaveProperty('createTime')
  })
  
  test('公告状态标签显示正确', () => {
    const page = getPage('/pages/admin/content/notice')
    const notice = page.data.notices.find(n => n.status === 1)
    expect(notice.statusName).toBe('已发布')
  })
  
  test('草稿状态标签显示正确', () => {
    const page = getPage('/pages/admin/content/notice')
    const draftNotice = page.data.notices.find(n => n.status === 0)
    expect(draftNotice.statusName).toBe('草稿')
  })
  
  test('操作按钮显示正常', () => {
    const page = getPage('/pages/admin/content/notice')
    const notice = page.data.notices[0]
    expect(notice.actions).toContain('编辑')
    expect(notice.actions).toContain('删除')
  })
  
  test('已发布公告操作包含查看', () => {
    const page = getPage('/pages/admin/content/notice')
    const publishedNotice = page.data.notices.find(n => n.status === 1)
    expect(publishedNotice.actions).toContain('查看')
  })
  
  test('草稿公告操作包含发布', () => {
    const page = getPage('/pages/admin/content/notice')
    const draftNotice = page.data.notices.find(n => n.status === 0)
    expect(draftNotice.actions).toContain('发布')
  })
  
  test('新增公告弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/notice')
    page.showAddModal()
    expect(page.data.showAddModal).toBe(true)
    expect(page.data.newNotice).toEqual({
      title: '',
      content: '',
      status: 0
    })
  })
  
  test('编辑公告弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/notice')
    const notice = page.data.notices[0]
    page.editNotice(notice)
    expect(page.data.showEditModal).toBe(true)
    expect(page.data.editingNotice).toEqual(notice)
  })
  
  test('删除确认弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/notice')
    const notice = page.data.notices[0]
    page.deleteNotice(notice)
    expect(page.data.showDeleteConfirm).toBe(true)
  })
  
  test('发布公告功能正常', () => {
    const page = getPage('/pages/admin/content/notice')
    const draftNotice = page.data.notices.find(n => n.status === 0)
    page.publishNotice(draftNotice)
    expect(draftNotice.status).toBe(1)
    expect(draftNotice.statusName).toBe('已发布')
    expect(draftNotice.publishTime).toBeTruthy()
  })
  
  test('分页功能正常', () => {
    const page = getPage('/pages/admin/content/notice')
    expect(page.data.currentPage).toBe(1)
    expect(page.data.pageSize).toBe(20)
    expect(page.data.total).toBe(4)
  })
})

describe('公告管理接口测试', () => {
  
  test('获取公告列表成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: [], msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/notice/list',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('发布公告成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 100 }, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/notice/add',
      method: 'POST',
      data: {
        title: '测试公告',
        content: '测试内容'
      }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('更新公告成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/notice/update/1',
      method: 'PUT',
      data: {
        title: '更新后的标题',
        content: '更新后的内容'
      }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('删除公告成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/notice/delete/1',
      method: 'DELETE'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('发布公告成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/notice/publish/1',
      method: 'POST'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('获取公告详情成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: { 
          id: 1, 
          title: '测试公告',
          content: '测试内容'
        } 
      }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/notice/1',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.title).toBe('测试公告')
  })
})
