/**
 * 订阅消息配置页单元测试
 * @pages/admin/message/subscribe
 */

describe('Message Subscribe Page', () => {
  let page = null;

  beforeEach(() => {
    page = getCurrentPages()[0];
  });

  test('页面数据初始化正确', () => {
    expect(page.data.templates).toBeDefined();
    expect(page.data.templates).toHaveLength(2);
  });

  test('模板数据配置正确', () => {
    const template1 = page.data.templates[0];
    expect(template1.name).toBe('订单创建通知');
    expect(template1.templateId).toBe('ORDER_CREATE');
    expect(template1.enabled).toBe(true);
    expect(template1.trigger).toBe('order_create');
    expect(template1.content).toContain('{{orderNo}}');
  });

  test('触发条件选项配置正确', () => {
    expect(page.data.triggerOptions).toHaveLength(4);
    expect(page.data.triggerOptions[0].value).toBe('order_create');
    expect(page.data.triggerOptions[1].value).toBe('order_complete');
  });

  test('弹窗状态初始化', () => {
    expect(page.data.showEditDialog).toBe(false);
    expect(page.data.editingTemplate).toBeNull();
  });

  test('loadTemplates 方法存在', () => {
    expect(typeof page.loadTemplates).toBe('function');
  });

  test('toggleEnable 方法存在', () => {
    expect(typeof page.toggleEnable).toBe('function');
  });

  test('editTemplate 方法存在', () => {
    expect(typeof page.editTemplate).toBe('function');
  });

  test('deleteTemplate 方法存在', () => {
    expect(typeof page.deleteTemplate).toBe('function');
  });

  test('testSend 方法存在', () => {
    expect(typeof page.testSend).toBe('function');
  });

  test('addTemplate 方法存在', () => {
    expect(typeof page.addTemplate).toBe('function');
  });

  test('saveTemplate 方法存在', () => {
    expect(typeof page.saveTemplate).toBe('function');
  });

  test('cancelEdit 方法存在', () => {
    expect(typeof page.cancelEdit).toBe('function');
  });

  test('onInputChange 方法存在', () => {
    expect(typeof page.onInputChange).toBe('function');
  });

  test('onTriggerChange 方法存在', () => {
    expect(typeof page.onTriggerChange).toBe('function');
  });
});
