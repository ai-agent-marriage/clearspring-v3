/**
 * 消息推送模块单元测试
 * 测试消息推送首页、订阅消息配置页、消息记录页面
 */

describe('消息推送首页测试', () => {
  test('数据概览卡片显示正常', () => {
    const page = getPage('/pages/admin/message/index');
    expect(page.data.stats).toBeTruthy();
    expect(page.data.stats.totalMessages).toBeDefined();
  });
  
  test('功能入口显示正常', () => {
    const page = getPage('/pages/admin/message/index');
    expect(page.data.menus).toBeInstanceOf(Array);
    expect(page.data.menus.length).toBe(4);
  });
});

describe('订阅消息配置页测试', () => {
  test('模板列表显示正常', () => {
    const page = getPage('/pages/admin/message/subscribe');
    expect(page.data.templates).toBeInstanceOf(Array);
  });
  
  test('启用开关功能正常', () => {
    const page = getPage('/pages/admin/message/subscribe');
    const originalEnabled = page.data.templates[0].enabled;
    page.toggleTemplate(1);
    expect(page.data.templates[0].enabled).toBe(originalEnabled === 1 ? 0 : 1);
  });
  
  test('模板详情弹窗显示正常', () => {
    const page = getPage('/pages/admin/message/subscribe');
    page.editTemplate(1);
    expect(page.data.showEditModal).toBe(true);
  });
});

describe('消息记录页面测试', () => {
  test('筛选栏显示正常', () => {
    const page = getPage('/pages/admin/message/records');
    expect(page.data.filterDateRanges).toBeInstanceOf(Array);
  });
  
  test('消息列表显示正常', () => {
    const page = getPage('/pages/admin/message/records');
    expect(page.data.records).toBeInstanceOf(Array);
  });
  
  test('导出功能正常', () => {
    const page = getPage('/pages/admin/message/records');
    page.exportRecords();
    expect(wx.downloadFile).toHaveBeenCalled();
  });
});
