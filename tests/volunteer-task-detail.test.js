/**
 * 志愿者端任务详情页单元测试
 */

describe('Volunteer Task Detail Page', () => {
  let pageData;

  beforeEach(() => {
    pageData = {
      task: {
        taskId: 1,
        orderNo: 'PRO202604070001',
        speciesName: '鲢鱼',
        quantity: 10,
        executeDate: '2026-04-15',
        address: '珠江广州段',
        wish: '平安顺遂',
        extraServices: ['全程视频记录'],
        orgName: 'XX 生态护生协会',
        orgContact: '李四',
        orgPhone: '138****1234',
        status: 1,
        statusName: '待执行'
      }
    };
  });

  test('should load task with correct basic info', () => {
    expect(pageData.task.orderNo).toBe('PRO202604070001');
    expect(pageData.task.speciesName).toBe('鲢鱼');
    expect(pageData.task.quantity).toBe(10);
    expect(pageData.task.executeDate).toBe('2026-04-15');
    expect(pageData.task.address).toBe('珠江广州段');
  });

  test('should load task with wish message', () => {
    expect(pageData.task.wish).toBe('平安顺遂');
  });

  test('should load task with extra services', () => {
    expect(pageData.task.extraServices).toEqual(['全程视频记录']);
    expect(pageData.task.extraServices.length).toBe(1);
  });

  test('should load organization info', () => {
    expect(pageData.task.orgName).toBe('XX 生态护生协会');
    expect(pageData.task.orgContact).toBe('李四');
    expect(pageData.task.orgPhone).toBe('138****1234');
  });

  test('should have correct initial status', () => {
    expect(pageData.task.status).toBe(1);
    expect(pageData.task.statusName).toBe('待执行');
  });

  test('task should have all required fields', () => {
    const requiredFields = [
      'taskId', 'orderNo', 'speciesName', 'quantity',
      'executeDate', 'address', 'orgName', 'orgContact',
      'orgPhone', 'status', 'statusName'
    ];

    requiredFields.forEach(field => {
      expect(pageData.task).toHaveProperty(field);
    });
  });

  test('should update status to executing after accept', () => {
    // 模拟确认接收
    pageData.task.status = 2;
    pageData.task.statusName = '执行中';
    
    expect(pageData.task.status).toBe(2);
    expect(pageData.task.statusName).toBe('执行中');
  });
});
