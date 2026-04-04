/**
 * 物种管理单元测试
 * 测试管理员后台物种管理页面的功能
 * 测试文件：miniprogram/__tests__/content-species.test.js
 */

describe('物种管理页面测试', () => {
  
  test('页面加载正常', () => {
    const page = getPage('/pages/admin/content/species')
    expect(page.data.speciesList).toBeInstanceOf(Array)
  })
  
  test('搜索功能正常', () => {
    const page = getPage('/pages/admin/content/species')
    page.search('鲢鱼')
    expect(page.data.speciesList.length).toBeGreaterThan(0)
  })
  
  test('筛选功能正常', () => {
    const page = getPage('/pages/admin/content/species')
    page.setData({ filterType: 1 }) // 鱼类
    page.filter()
    page.data.speciesList.forEach(item => {
      expect(item.type).toBe(1)
    })
  })
  
  test('投放状态标签显示正确', () => {
    const page = getPage('/pages/admin/content/species')
    const forbidSpecies = page.data.speciesList.find(s => s.isForbid === 1)
    expect(forbidSpecies.statusName).toBe('禁止投放')
  })
  
  test('操作按钮显示正常', () => {
    const page = getPage('/pages/admin/content/species')
    const species = page.data.speciesList[0]
    expect(species.actions).toContain('编辑')
    expect(species.actions).toContain('删除')
  })
  
  test('允许投放物种状态显示正确', () => {
    const page = getPage('/pages/admin/content/species')
    const allowSpecies = page.data.speciesList.find(s => s.isForbid === 0)
    expect(allowSpecies).toBeTruthy()
    expect(allowSpecies.statusName).toBe('允许投放')
  })
  
  test('新增物种弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/species')
    page.showAddModal()
    expect(page.data.showAddModal).toBe(true)
    expect(page.data.newSpecies).toEqual({
      name: '',
      scientificName: '',
      type: 1,
      isForbid: 0,
      description: '',
      habitat: '',
      distribution: ''
    })
  })
  
  test('编辑物种弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/species')
    const species = page.data.speciesList[0]
    page.editSpecies(species)
    expect(page.data.showEditModal).toBe(true)
    expect(page.data.editingSpecies).toEqual(species)
  })
  
  test('删除确认弹窗显示正常', () => {
    const page = getPage('/pages/admin/content/species')
    const species = page.data.speciesList[0]
    page.deleteSpecies(species)
    expect(page.data.showDeleteConfirm).toBe(true)
    expect(page.data.deletingSpecies).toEqual(species)
  })
  
  test('分页功能正常', () => {
    const page = getPage('/pages/admin/content/species')
    expect(page.data.currentPage).toBe(1)
    expect(page.data.pageSize).toBe(20)
    page.setData({ currentPage: 2 })
    expect(page.data.currentPage).toBe(2)
  })
  
  test('批量删除功能正常', () => {
    const page = getPage('/pages/admin/content/species')
    page.setData({ selectedIds: [1, 2, 3] })
    page.batchDelete()
    expect(page.data.showBatchDeleteConfirm).toBe(true)
    expect(page.data.selectedIds.length).toBe(3)
  })
  
  test('导出功能正常', () => {
    const page = getPage('/pages/admin/content/species')
    page.exportSpecies()
    expect(wx.downloadFile).toHaveBeenCalled()
  })
})

describe('物种管理接口测试', () => {
  
  test('获取物种列表成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: [], msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/list',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('新增物种成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: { id: 100 }, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/add',
      method: 'POST',
      data: {
        name: '测试物种',
        scientificName: 'Test Species',
        type: 1,
        isForbid: 0
      }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('更新物种成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/update/1',
      method: 'PUT',
      data: {
        name: '更新后的物种名称',
        remark: '更新备注'
      }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('删除物种成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/delete/1',
      method: 'DELETE'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('批量删除物种成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: 'success' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/batchDelete',
      method: 'POST',
      data: { ids: [1, 2, 3] }
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })
  
  test('获取物种详情成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: { 
          id: 1, 
          name: '鲢鱼',
          scientificName: 'Hypophthalmichthys molitrix'
        } 
      }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/1',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.name).toBe('鲢鱼')
  })
  
  test('获取物种类型字典成功', async () => {
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { 
        code: 200, 
        data: [
          { value: 1, label: '鱼类' },
          { value: 2, label: '鸟类' },
          { value: 3, label: '哺乳类' }
        ] 
      }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/types',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.length).toBeGreaterThan(0)
  })
  
  test('接口错误处理', async () => {
    wx.request.mockResolvedValue({
      statusCode: 500,
      data: { code: 500, msg: '服务器错误' }
    })
    
    const res = await wx.request({
      url: 'http://localhost:8080/api/content/species/list',
      method: 'GET'
    })
    
    expect(res.statusCode).toBe(500)
    expect(res.data.code).toBe(500)
  })
})
