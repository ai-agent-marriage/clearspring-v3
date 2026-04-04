/**
 * 物种管理增强单元测试
 * 测试管理员后台物种管理页面的增强功能
 * 测试文件：miniprogram/__tests__/content-species-enhanced.test.js
 * 
 * 新增测试用例：15 个
 */

describe('物种管理增强测试 - 数据验证', () => {
  
  test('物种名称不能为空', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ newSpecies: { name: '', scientificName: 'Test Species', type: 1 } });
    const result = page.validateSpecies();
    expect(result.valid).toBe(false);
    expect(result.message).toContain('名称');
  });
  
  test('物种学名格式验证', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ newSpecies: { name: '测试物种', scientificName: 'Invalid Format', type: 1 } });
    const result = page.validateSpecies();
    expect(result.valid).toBe(false);
    expect(result.message).toContain('学名格式');
  });
  
  test('物种类型必须选择', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ newSpecies: { name: '测试物种', scientificName: 'Test Species', type: null } });
    const result = page.validateSpecies();
    expect(result.valid).toBe(false);
  });
  
  test('物种描述长度限制验证', () => {
    const page = getPage('/pages/admin/content/species');
    const longDesc = 'A'.repeat(1001);
    page.setData({ newSpecies: { name: '测试物种', description: longDesc } });
    const result = page.validateSpecies();
    expect(result.valid).toBe(false);
    expect(result.message).toContain('长度');
  });
  
  test('有效物种数据验证通过', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ 
      newSpecies: { 
        name: '鲢鱼', 
        scientificName: 'Hypophthalmichthys molitrix',
        type: 1,
        isForbid: 0,
        description: '常见的淡水鱼类',
        habitat: '江河湖泊',
        distribution: '全国各地'
      } 
    });
    const result = page.validateSpecies();
    expect(result.valid).toBe(true);
  });
});

describe('物种管理增强测试 - 搜索与筛选', () => {
  
  test('模糊搜索功能正常', () => {
    const page = getPage('/pages/admin/content/species');
    page.search('鱼');
    expect(page.data.searchKeyword).toBe('鱼');
    expect(page.data.speciesList.length).toBeGreaterThan(0);
  });
  
  test('搜索关键词清空功能', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ searchKeyword: '测试' });
    page.clearSearch();
    expect(page.data.searchKeyword).toBe('');
    expect(page.data.currentPage).toBe(1);
  });
  
  test('多条件组合筛选', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ 
      filterType: 1, // 鱼类
      filterStatus: 0 // 允许投放
    });
    page.filter();
    page.data.speciesList.forEach(item => {
      expect(item.type).toBe(1);
      expect(item.isForbid).toBe(0);
    });
  });
  
  test('筛选条件重置功能', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ filterType: 1, filterStatus: 1 });
    page.resetFilter();
    expect(page.data.filterType).toBeNull();
    expect(page.data.filterStatus).toBeNull();
  });
  
  test('搜索结果高亮显示', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ searchKeyword: '鲢鱼' });
    page.highlightSearch();
    const highlighted = page.data.highlightedSpecies;
    expect(highlighted).toBeTruthy();
  });
});

describe('物种管理增强测试 - 批量操作', () => {
  
  test('全选功能正常', () => {
    const page = getPage('/pages/admin/content/species');
    page.selectAll();
    expect(page.data.selectedIds.length).toBe(page.data.speciesList.length);
    expect(page.data.isAllSelected).toBe(true);
  });
  
  test('取消全选功能正常', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ isAllSelected: true, selectedIds: [1, 2, 3] });
    page.deselectAll();
    expect(page.data.selectedIds.length).toBe(0);
    expect(page.data.isAllSelected).toBe(false);
  });
  
  test('单个选择切换功能', () => {
    const page = getPage('/pages/admin/content/species');
    page.toggleSelect(1);
    expect(page.data.selectedIds).toContain(1);
    page.toggleSelect(1);
    expect(page.data.selectedIds).not.toContain(1);
  });
  
  test('批量修改投放状态', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ selectedIds: [1, 2, 3] });
    page.batchUpdateStatus(1); // 设置为禁止投放
    expect(page.data.showBatchStatusConfirm).toBe(true);
    expect(page.data.batchStatus).toBe(1);
  });
  
  test('批量导出选中物种', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ selectedIds: [1, 2, 3] });
    page.exportSelected();
    expect(wx.downloadFile).toHaveBeenCalled();
    expect(wx.downloadFile.mock.calls[0][0].data.ids).toEqual([1, 2, 3]);
  });
});

describe('物种管理增强测试 - 导入功能', () => {
  
  test('导入文件选择弹窗显示', () => {
    const page = getPage('/pages/admin/content/species');
    page.showImportModal();
    expect(page.data.showImportModal).toBe(true);
  });
  
  test('导入文件格式验证 - Excel', () => {
    const page = getPage('/pages/admin/content/species');
    const result = page.validateImportFile('species.xlsx');
    expect(result.valid).toBe(true);
  });
  
  test('导入文件格式验证 - CSV', () => {
    const page = getPage('/pages/admin/content/species');
    const result = page.validateImportFile('species.csv');
    expect(result.valid).toBe(true);
  });
  
  test('导入文件格式验证 - 不支持的格式', () => {
    const page = getPage('/pages/admin/content/species');
    const result = page.validateImportFile('species.txt');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('格式');
  });
  
  test('导入文件大小验证', () => {
    const page = getPage('/pages/admin/content/species');
    const result = page.validateImportFileSize(11 * 1024 * 1024); // 11MB
    expect(result.valid).toBe(false);
    expect(result.message).toContain('大小');
  });
  
  test('导入预览功能', () => {
    const page = getPage('/pages/admin/content/species');
    const mockData = [
      { name: '物种 1', scientificName: 'Species 1', type: 1 },
      { name: '物种 2', scientificName: 'Species 2', type: 2 }
    ];
    page.previewImport(mockData);
    expect(page.data.importPreview).toEqual(mockData);
    expect(page.data.showImportPreview).toBe(true);
  });
  
  test('导入进度更新', () => {
    const page = getPage('/pages/admin/content/species');
    page.updateImportProgress(50, 100);
    expect(page.data.importProgress).toBe(50);
    expect(page.data.importTotal).toBe(100);
    expect(page.data.importing).toBe(true);
  });
  
  test('导入完成回调', () => {
    const page = getPage('/pages/admin/content/species');
    page.onImportComplete({ success: 95, failed: 5 });
    expect(page.data.importing).toBe(false);
    expect(page.data.importResult).toEqual({ success: 95, failed: 5 });
    expect(page.data.showImportResult).toBe(true);
  });
});

describe('物种管理增强测试 - 权限控制', () => {
  
  test('管理员可见编辑按钮', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ userRole: 'admin' });
    page.checkPermissions();
    expect(page.data.canEdit).toBe(true);
    expect(page.data.canDelete).toBe(true);
  });
  
  test('普通用户不可见编辑按钮', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ userRole: 'user' });
    page.checkPermissions();
    expect(page.data.canEdit).toBe(false);
    expect(page.data.canDelete).toBe(false);
  });
  
  test('删除操作二次确认', () => {
    const page = getPage('/pages/admin/content/species');
    const species = page.data.speciesList[0];
    page.deleteSpecies(species);
    expect(page.data.showDeleteConfirm).toBe(true);
    expect(page.data.deleteConfirmTitle).toContain('确认');
  });
  
  test('操作日志记录', () => {
    const page = getPage('/pages/admin/content/species');
    const mockAction = { type: 'edit', target: '物种 1', time: new Date() };
    page.logAction(mockAction);
    expect(page.data.actionLogs).toContainEqual(mockAction);
  });
  
  test('最近操作记录显示', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ 
      actionLogs: [
        { type: 'add', target: '物种 A', time: new Date('2026-04-04 10:00:00') },
        { type: 'edit', target: '物种 B', time: new Date('2026-04-04 11:00:00') }
      ] 
    });
    page.showRecentLogs();
    expect(page.data.showLogsModal).toBe(true);
    expect(page.data.recentLogs.length).toBeGreaterThan(0);
  });
});

describe('物种管理增强测试 - 性能优化', () => {
  
  test('列表数据缓存命中', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ cacheTime: Date.now(), cachedList: [{ id: 1, name: '缓存物种' }] });
    page.loadSpeciesList();
    expect(page.data.useCache).toBe(true);
  });
  
  test('列表数据缓存过期刷新', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ cacheTime: Date.now() - 300000, cachedList: [] }); // 5 分钟前
    page.loadSpeciesList();
    expect(page.data.useCache).toBe(false);
  });
  
  test('分页数据预加载', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ currentPage: 1, totalPages: 5 });
    page.preloadNextPage();
    expect(page.data.preloading).toBe(true);
  });
  
  test('图片懒加载功能', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ speciesList: [{ id: 1, image: 'species1.jpg' }] });
    page.lazyLoadImage(1);
    expect(page.data.loadingImages).toContain(1);
  });
  
  test('防抖搜索功能', () => {
    const page = getPage('/pages/admin/content/species');
    page.setData({ searchTimer: null });
    page.debounceSearch('测试');
    expect(page.data.searchTimer).toBeTruthy();
  });
});
