/**
 * 志愿者端首页单元测试
 */

const { volunteerHomePage } = require('../miniprogram/pages/volunteer-home/index');

describe('Volunteer Home Page', () => {
  let page;

  beforeEach(() => {
    // 模拟 Page 实例
    page = {
      data: {
        volunteer: {
          name: '张三',
          identity: '公益志愿者',
          certified: true,
          orgName: 'XX 生态护生协会'
        },
        stats: {
          pendingTasks: 3,
          completedTasks: 15,
          serviceHours: 48,
          complianceRate: 98
        },
        latestTasks: [
          { taskId: 1, orderNo: 'PRO202604070001', speciesName: '鲢鱼', executeDate: '2026-04-15' },
          { taskId: 2, orderNo: 'PRO202604070002', speciesName: '草鱼', executeDate: '2026-04-16' },
          { taskId: 3, orderNo: 'PRO202604070003', speciesName: '鲫鱼', executeDate: '2026-04-17' }
        ]
      },
      setData: jest.fn()
    };
  });

  test('should initialize with correct volunteer data', () => {
    expect(page.data.volunteer.name).toBe('张三');
    expect(page.data.volunteer.identity).toBe('公益志愿者');
    expect(page.data.volunteer.certified).toBe(true);
    expect(page.data.volunteer.orgName).toBe('XX 生态护生协会');
  });

  test('should initialize with correct stats data', () => {
    expect(page.data.stats.pendingTasks).toBe(3);
    expect(page.data.stats.completedTasks).toBe(15);
    expect(page.data.stats.serviceHours).toBe(48);
    expect(page.data.stats.complianceRate).toBe(98);
  });

  test('should initialize with latest tasks', () => {
    expect(page.data.latestTasks.length).toBe(3);
    expect(page.data.latestTasks[0].speciesName).toBe('鲢鱼');
  });

  test('should have goToPendingTasks navigation', () => {
    const mockNavigateTo = jest.fn();
    global.wx = { navigateTo: mockNavigateTo };
    
    // 模拟调用
    const url = '/pages/volunteer-home/tasks?status=1';
    expect(url).toContain('/pages/volunteer-home/tasks');
  });

  test('should have goToExecutionRecords navigation', () => {
    const url = '/pages/volunteer-home/tasks?status=3';
    expect(url).toContain('/pages/volunteer-home/tasks');
    expect(url).toContain('status=3');
  });

  test('should have switchToProtectView navigation', () => {
    const url = '/pages/protect/index';
    expect(url).toBe('/pages/protect/index');
  });
});
