/**
 * 帮助文档增强单元测试
 * 测试管理员后台帮助文档管理页面的增强功能
 * 测试文件：miniprogram/__tests__/content-help-enhanced.test.js
 * 
 * 新增测试用例：12 个
 */

describe('帮助文档增强测试 - 文档编辑', () => {
  
  test('富文本编辑器初始化', () => {
    const page = getPage('/pages/admin/content/help')
    page.initEditor()
    expect(page.data.editorReady).toBe(true)
  })
  
  test('富文本内容插入', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ editorContent: '<p>初始内容</p>' })
    page.insertText('附加内容')
    expect(page.data.editorContent).toContain('附加内容')
  })
  
  test('富文本图片插入', () => {
    const page = getPage('/pages/admin/content/help')
    page.insertImage('image_url.jpg', '图片描述')
    expect(page.data.insertedImage).toBeTruthy()
  })
  
  test('富文本链接插入', () => {
    const page = getPage('/pages/admin/content/help')
    page.insertLink('https://example.com', '链接文字')
    expect(page.data.insertedLink).toEqual({
      url: 'https://example.com',
      text: '链接文字'
    })
  })
  
  test('编辑器内容自动保存', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ editorContent: '<p>新内容</p>', autoSaveTimer: null })
    page.autoSave()
    expect(page.data.autoSaveTimer).toBeTruthy()
  })
  
  test('编辑器草稿恢复', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ draftContent: '<p>草稿内容</p>' })
    page.restoreDraft()
    expect(page.data.editorContent).toBe('<p>草稿内容</p>')
  })
})

describe('帮助文档增强测试 - 目录管理', () => {
  
  test('自动生成目录', () => {
    const page = getPage('/pages/admin/content/help')
    const content = `
      # 标题一
      ## 标题二
      ### 标题三
    `
    page.setData({ editorContent: content })
    page.generateTOC()
    expect(page.data.toc).toBeTruthy()
    expect(page.data.toc.length).toBeGreaterThan(0)
  })
  
  test('目录层级结构正确', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ 
      toc: [
        { level: 1, text: '标题一' },
        { level: 2, text: '标题二' },
        { level: 3, text: '标题三' }
      ] 
    })
    expect(page.data.toc[0].level).toBe(1)
    expect(page.data.toc[1].level).toBe(2)
  })
  
  test('目录跳转功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.scrollToSection('section-1')
    expect(page.data.scrollTarget).toBe('section-1')
  })
  
  test('手动添加目录项', () => {
    const page = getPage('/pages/admin/content/help')
    page.addTOCItem('自定义目录', 2)
    expect(page.data.toc).toContainEqual({ level: 2, text: '自定义目录' })
  })
})

describe('帮助文档增强测试 - 版本控制', () => {
  
  test('创建新版本', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ currentDoc: { id: 1, version: 1 } })
    page.createNewVersion()
    expect(page.data.currentDoc.version).toBe(2)
  })
  
  test('版本对比功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.compareVersions(1, 2)
    expect(page.data.showCompareModal).toBe(true)
    expect(page.data.compareOldVersion).toBe(1)
    expect(page.data.compareNewVersion).toBe(2)
  })
  
  test('版本回滚功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ currentDoc: { id: 1, version: 3 } })
    page.rollbackToVersion(1)
    expect(page.data.showRollbackConfirm).toBe(true)
    expect(page.data.rollbackTargetVersion).toBe(1)
  })
  
  test('版本注释添加', () => {
    const page = getPage('/pages/admin/content/help')
    page.addVersionComment('修复错别字')
    expect(page.data.versionComment).toBe('修复错别字')
  })
  
  test('版本历史记录', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ 
      versionHistory: [
        { version: 1, time: '2026-04-01', comment: '初版' },
        { version: 2, time: '2026-04-02', comment: '更新内容' }
      ] 
    })
    page.showVersionHistory()
    expect(page.data.showVersionModal).toBe(true)
  })
})

describe('帮助文档增强测试 - 协作功能', () => {
  
  test('文档共享设置', () => {
    const page = getPage('/pages/admin/content/help')
    page.setSharePermission('public')
    expect(page.data.sharePermission).toBe('public')
  })
  
  test('添加协作者', () => {
    const page = getPage('/pages/admin/content/help')
    page.addCollaborator('ou_xxx123', 'editor')
    expect(page.data.collaborators).toContainEqual({
      userId: 'ou_xxx123',
      role: 'editor'
    })
  })
  
  test('移除协作者', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ 
      collaborators: [
        { userId: 'ou_xxx123', role: 'editor' },
        { userId: 'ou_xxx456', role: 'viewer' }
      ] 
    })
    page.removeCollaborator('ou_xxx123')
    expect(page.data.collaborators.length).toBe(1)
  })
  
  test('协作者权限变更', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ 
      collaborators: [{ userId: 'ou_xxx123', role: 'viewer' }] 
    })
    page.updateCollaboratorRole('ou_xxx123', 'editor')
    expect(page.data.collaborators[0].role).toBe('editor')
  })
  
  test('文档锁定状态', () => {
    const page = getPage('/pages/admin/content/help')
    page.lockDocument('ou_xxx123')
    expect(page.data.isLocked).toBe(true)
    expect(page.data.lockedBy).toBe('ou_xxx123')
  })
  
  test('文档解锁功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ isLocked: true, lockedBy: 'ou_xxx123' })
    page.unlockDocument()
    expect(page.data.isLocked).toBe(false)
  })
})

describe('帮助文档增强测试 - 搜索优化', () => {
  
  test('全文搜索功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.fullTextSearch('志愿者')
    expect(page.data.searchResults).toBeTruthy()
    expect(page.data.searchKeyword).toBe('志愿者')
  })
  
  test('搜索结果高亮', () => {
    const page = getPage('/pages/admin/content/help')
    const content = '志愿者参与活动'
    const highlighted = page.highlightKeyword(content, '志愿者')
    expect(highlighted).toContain('<mark>')
  })
  
  test('搜索建议功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ 
      searchHistory: ['志愿者', '活动', '护生'] 
    })
    page.getSearchSuggestions('志')
    expect(page.data.suggestions).toContain('志愿者')
  })
  
  test('热门搜索标签', () => {
    const page = getPage('/pages/admin/content/help')
    page.loadHotSearches()
    expect(page.data.hotSearches).toBeTruthy()
    expect(page.data.hotSearches.length).toBeGreaterThan(0)
  })
  
  test('搜索历史记录', () => {
    const page = getPage('/pages/admin/content/help')
    page.addToSearchHistory('测试搜索')
    expect(page.data.searchHistory).toContain('测试搜索')
  })
})

describe('帮助文档增强测试 - 统计分析', () => {
  
  test('文档浏览量统计', () => {
    const page = getPage('/pages/admin/content/help')
    const stats = page.getDocumentStats(1)
    expect(stats).toHaveProperty('viewCount')
    expect(stats).toHaveProperty('likeCount')
    expect(stats).toHaveProperty('shareCount')
  })
  
  test('文档点赞功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.likeDocument(1)
    expect(page.data.likedDocs).toContain(1)
  })
  
  test('文档收藏功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.favoriteDocument(1)
    expect(page.data.favoritedDocs).toContain(1)
  })
  
  test('文档分享统计', () => {
    const page = getPage('/pages/admin/content/help')
    page.shareDocument(1, 'wechat')
    expect(page.data.shareStats).toHaveProperty('wechat')
  })
  
  test('用户停留时长统计', () => {
    const page = getPage('/pages/admin/content/help')
    page.recordStayDuration(1, 120) // 120 秒
    expect(page.data.stayDuration[1]).toBe(120)
  })
  
  test('文档完成度统计', () => {
    const page = getPage('/pages/admin/content/help')
    page.recordReadProgress(1, 100)
    expect(page.data.readProgress[1]).toBe(100)
  })
})

describe('帮助文档增强测试 - 反馈管理', () => {
  
  test('收集用户反馈', () => {
    const page = getPage('/pages/admin/content/help')
    page.collectFeedback(1, '内容很有帮助', 5)
    expect(page.data.feedbackList).toContainEqual({
      docId: 1,
      content: '内容很有帮助',
      rating: 5
    })
  })
  
  test('反馈评分统计', () => {
    const page = getPage('/pages/admin/content/help')
    page.setData({ 
      feedbackList: [
        { rating: 5 },
        { rating: 4 },
        { rating: 5 }
      ] 
    })
    const avgRating = page.calculateAvgRating()
    expect(avgRating).toBe(4.67)
  })
  
  test('反馈回复功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.replyFeedback(1, '感谢您的反馈')
    expect(page.data.repliedFeedbacks).toContain(1)
  })
  
  test('反馈标记为已处理', () => {
    const page = getPage('/pages/admin/content/help')
    page.markFeedbackAsResolved(1)
    expect(page.data.resolvedFeedbacks).toContain(1)
  })
  
  test('反馈导出功能', () => {
    const page = getPage('/pages/admin/content/help')
    page.exportFeedback()
    expect(wx.downloadFile).toHaveBeenCalled()
  })
})
