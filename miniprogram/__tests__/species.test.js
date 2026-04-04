/**
 * 物种查询单元测试
 * 测试物种列表和详情页的功能
 */

describe('物种查询测试', () => {
  
  test('物种列表数据正确', () => {
    const page = getPage('/pages/zen/species-list');
    expect(page.data.speciesList).toBeInstanceOf(Array);
    expect(page.data.categories).toBeInstanceOf(Array);
  });
  
  test('物种对象结构正确', () => {
    const page = getPage('/pages/zen/species-list');
    const species = page.data.speciesList[0];
    expect(species).toHaveProperty('id');
    expect(species).toHaveProperty('name');
    expect(species).toHaveProperty('scientificName');
    expect(species).toHaveProperty('isForbid');
  });
  
  test('分类筛选功能正常', () => {
    const page = getPage('/pages/zen/species-list');
    page.selectCategory('鱼类');
    const filteredList = page.data.speciesList;
    filteredList.forEach(item => {
      expect(item.type).toBe(1); // 鱼类 type=1
    });
  });
  
  test('搜索功能正常', () => {
    const page = getPage('/pages/zen/species-list');
    page.search('鲢鱼');
    expect(page.data.speciesList.length).toBeGreaterThan(0);
  });
  
  test('禁止投放物种红标显示', () => {
    const page = getPage('/pages/zen/species-list');
    const forbidSpecies = page.data.speciesList.find(s => s.isForbid === 1);
    expect(forbidSpecies).toBeTruthy();
  });
  
  test('物种详情页数据正确', () => {
    const page = getPage('/pages/zen/species-detail');
    expect(page.data.species).toBeTruthy();
    expect(page.data.species.name).toBeTruthy();
    expect(page.data.species.scientificName).toBeTruthy();
  });
  
  test('禁止投放物种警示栏显示', () => {
    const page = getPage('/pages/zen/species-detail');
    page.data.species.isForbid = 1;
    page.onLoad();
    expect(page.data.showForbidWarning).toBe(true);
  });
  
  test('可投放物种「去护生」按钮显示', () => {
    const page = getPage('/pages/zen/species-detail');
    page.data.species.isForbid = 0;
    page.onLoad();
    expect(page.data.showProtectButton).toBe(true);
  });
  
  test('物种列表包含多个分类', () => {
    const page = getPage('/pages/zen/species-list');
    const categories = page.data.categories;
    expect(categories.length).toBeGreaterThan(1);
    expect(categories.map(c => c.name)).toContain('全部');
    expect(categories.map(c => c.name)).toContain('鱼类');
  });
  
  test('物种类型字段正确', () => {
    const page = getPage('/pages/zen/species-list');
    const species = page.data.speciesList[0];
    expect(typeof species.type).toBe('number');
    expect(species.type).toBeGreaterThanOrEqual(0);
  });
  
  test('搜索空关键词不改变列表', () => {
    const page = getPage('/pages/zen/species-list');
    const originalLength = page.data.speciesList.length;
    page.search('');
    expect(page.data.speciesList.length).toBe(originalLength);
  });
  
  test('搜索不存在的关键字返回空列表', () => {
    const page = getPage('/pages/zen/species-list');
    page.search('不存在的物种名称 xyz');
    expect(page.data.speciesList.length).toBe(0);
  });
  
  test('物种详情页包含完整信息', () => {
    const page = getPage('/pages/zen/species-detail');
    const species = page.data.species;
    expect(species).toHaveProperty('description');
    expect(species).toHaveProperty('habitat');
    expect(species).toHaveProperty('distribution');
  });
  
  test('分类筛选后数量正确', () => {
    const page = getPage('/pages/zen/species-list');
    const originalLength = page.data.speciesList.length;
    page.selectCategory('鱼类');
    const filteredLength = page.data.speciesList.length;
    expect(filteredLength).toBeLessThanOrEqual(originalLength);
    expect(filteredLength).toBeGreaterThan(0);
  });
});
