/**
 * 反馈提交页面单元测试
 * @pages/admin/feedback/submit
 */

describe('Feedback Submit Page', () => {
  let page = null

  beforeEach(() => {
    page = getCurrentPages()[0]
  })

  test('页面表单数据初始化正确', () => {
    expect(page.data.form).toBeDefined()
    expect(page.data.form.type).toBe('')
    expect(page.data.form.title).toBe('')
    expect(page.data.form.content).toBe('')
    expect(page.data.form.images).toEqual([])
    expect(page.data.form.contact).toBe('')
  })

  test('反馈类型列表配置正确', () => {
    expect(page.data.feedbackTypes).toHaveLength(3)
    expect(page.data.feedbackTypes[0].value).toBe('suggestion')
    expect(page.data.feedbackTypes[0].label).toBe('功能建议')
    expect(page.data.feedbackTypes[1].value).toBe('bug')
    expect(page.data.feedbackTypes[1].label).toBe('Bug 反馈')
    expect(page.data.feedbackTypes[2].value).toBe('other')
    expect(page.data.feedbackTypes[2].label).toBe('其他')
  })

  test('onSelectType 方法存在', () => {
    expect(typeof page.onSelectType).toBe('function')
  })

  test('onUploadImage 方法存在', () => {
    expect(typeof page.onUploadImage).toBe('function')
  })

  test('onDeleteImage 方法存在', () => {
    expect(typeof page.onDeleteImage).toBe('function')
  })

  test('onSubmit 方法存在', () => {
    expect(typeof page.onSubmit).toBe('function')
  })

  test('图片上传数量限制', () => {
    const mockShowToast = jest.fn()
    wx.showToast = mockShowToast
    
    page.setData({
      'form.images': ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg']
    })
    
    page.onUploadImage()
    
    expect(mockShowToast).toHaveBeenCalledWith({
      title: '最多上传 6 张图片',
      icon: 'none'
    })
  })

  test('删除图片功能', () => {
    page.setData({
      'form.images': ['img1.jpg', 'img2.jpg', 'img3.jpg']
    })
    
    page.onDeleteImage({
      currentTarget: {
        dataset: { index: 1 }
      }
    })
    
    expect(page.data.form.images).toHaveLength(2)
    expect(page.data.form.images).toEqual(['img1.jpg', 'img3.jpg'])
  })
})
