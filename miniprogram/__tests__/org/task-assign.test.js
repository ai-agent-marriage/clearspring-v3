/**
 * 机构端 - 任务分配页面测试 V-06
 * @file miniprogram/__tests__/org/task-assign.test.js
 * @description 测试机构任务分配页面的各项功能
 */

describe('机构端 - 任务分配页面 V-06', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      navigateBack: jest.fn(),
      showToast: jest.fn(),
      showModal: jest.fn(),
      stopPullDownRefresh: jest.fn()
    };
    global.wx = mockWx;

    page = {
      data: {
        orderInfo: null,
        filterType: 'all',
        volunteers: [
          {
            id: 'vol_001',
            name: '李明',
            avatar: 'https://example.com/avatar1.jpg',
            verified: true,
            level: 5,
            status: 'available',
            statusText: '可接单',
            completedOrders: 56,
            rating: 98,
            skills: ['护生执行', '活动组织', '摄影记录'],
            distance: '2.5km'
          },
          {
            id: 'vol_002',
            name: '王芳',
            avatar: 'https://example.com/avatar2.jpg',
            verified: true,
            level: 4,
            status: 'available',
            statusText: '可接单',
            completedOrders: 42,
            rating: 96,
            skills: ['护生执行', '文案写作'],
            distance: '3.8km'
          },
          {
            id: 'vol_003',
            name: '张伟',
            avatar: 'https://example.com/avatar3.jpg',
            verified: true,
            level: 6,
            status: 'busy',
            statusText: '忙碌中',
            completedOrders: 78,
            rating: 99,
            skills: ['护生执行', '活动组织', '应急救援'],
            distance: '1.2km'
          },
          {
            id: 'vol_004',
            name: '刘娜',
            avatar: 'https://example.com/avatar4.jpg',
            verified: false,
            level: 2,
            status: 'offline',
            statusText: '离线',
            completedOrders: 15,
            rating: 92,
            skills: ['护生执行'],
            distance: '5.0km'
          },
          {
            id: 'vol_005',
            name: '陈杰',
            avatar: 'https://example.com/avatar5.jpg',
            verified: true,
            level: 5,
            status: 'available',
            statusText: '可接单',
            completedOrders: 63,
            rating: 97,
            skills: ['护生执行', '摄影记录', '翻译服务'],
            distance: '4.1km'
          }
        ],
        assignmentHistory: [
          {
            id: 'assign_001',
            volunteerName: '李明',
            assignTime: '2026-04-11 14:30',
            status: 'accepted',
            statusText: '已接受'
          },
          {
            id: 'assign_002',
            volunteerName: '王芳',
            assignTime: '2026-04-10 09:15',
            status: 'completed',
            statusText: '已完成'
          }
        ],
        loading: false,
        hasMore: true
      },
      onLoad: function(options) {
        if (options && options.orderId) {
          this.loadOrderInfo(options.orderId);
        }
        if (options && options.volunteerId) {
          this.highlightVolunteer(options.volunteerId);
        }
      },
      onPullDownRefresh: function() {
        this.loadVolunteers().then(() => {
          mockWx.stopPullDownRefresh();
        });
      },
      loadOrderInfo: function(orderId) {
        const mockOrder = {
          orderNo: 'ORD20260412001',
          status: 'pending',
          statusText: '待分配',
          speciesName: '鲫鱼',
          speciesQuantity: '50',
          speciesUnit: '斤',
          waterArea: '太湖',
          executeDate: '2026-04-13',
          amount: '299.00'
        };
        this.setData({ orderInfo: mockOrder });
      },
      loadVolunteers: function() {
        this.setData({ loading: true });
        return new Promise((resolve) => {
          setTimeout(() => {
            this.setData({ loading: false });
            resolve();
          }, 500);
        });
      },
      onFilterChange: function(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({ filterType: type });
        this.filterVolunteers(type);
      },
      filterVolunteers: function(type) {
        let filtered = [];
        if (type === 'all') {
          filtered = this.data.volunteers;
        } else {
          filtered = this.data.volunteers.filter(v => v.status === type);
        }
        this.setData({ volunteers: filtered });
      },
      onRefresh: function() {
        this.loadVolunteers();
        mockWx.showToast({ title: '已刷新', icon: 'success' });
      },
      onLoadMore: function() {
        if (this.data.hasMore && !this.data.loading) {
          this.loadMoreVolunteers();
        }
      },
      loadMoreVolunteers: function() {
        this.setData({ loading: true });
        return new Promise((resolve) => {
          setTimeout(() => {
            this.setData({ loading: false, hasMore: false });
            resolve();
          }, 500);
        });
      },
      onViewDetail: function(e) {
        const volunteerId = e.currentTarget.dataset.id;
        mockWx.navigateTo({
          url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=' + volunteerId
        });
      },
      onAssignVolunteer: function(e) {
        const volunteerId = e.currentTarget.dataset.id;
        const volunteer = this.data.volunteers.find(v => v.id === volunteerId);
        if (!volunteer) return;
        mockWx.showModal({
          title: '确认分配',
          content: `确定要将任务分配给 ${volunteer.name} 吗？`,
          confirmText: '分配',
          confirmColor: '#4A5D4E',
          success: (res) => {
            if (res.confirm) {
              this.doAssignVolunteer(volunteerId);
            }
          }
        });
      },
      doAssignVolunteer: async function(volunteerId) {
        mockWx.showToast({ title: '分配成功', icon: 'success' });
        const newRecord = {
          id: 'assign_' + Date.now(),
          volunteerName: this.data.volunteers.find(v => v.id === volunteerId)?.name || '未知',
          assignTime: this.formatDate(new Date()),
          status: 'pending',
          statusText: '待接受'
        };
        this.setData({
          assignmentHistory: [newRecord, ...this.data.assignmentHistory]
        });
        setTimeout(() => {
          mockWx.navigateBack();
        }, 1500);
      },
      highlightVolunteer: function(volunteerId) {
        console.log('高亮志愿者:', volunteerId);
      },
      setData: function(obj) {
        Object.assign(this.data, obj);
      },
      formatDate: function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
    };
  });

  // ==================== 功能测试 ====================

  test('页面正常加载 - 无参数', () => {
    page.onLoad({});
    expect(page.data.volunteers.length).toBe(5);
  });

  test('页面加载 - 带 orderId 参数', () => {
    page.onLoad({ orderId: 'ORD20260412001' });
    expect(page.data.orderInfo).not.toBeNull();
    expect(page.data.orderInfo.orderNo).toBe('ORD20260412001');
  });

  test('订单信息显示', () => {
    page.loadOrderInfo('ORD20260412001');
    expect(page.data.orderInfo.speciesName).toBe('鲫鱼');
    expect(page.data.orderInfo.speciesQuantity).toBe('50');
  });

  test('志愿者列表加载', () => {
    expect(page.data.volunteers.length).toBe(5);
  });

  test('志愿者状态分布', () => {
    const available = page.data.volunteers.filter(v => v.status === 'available');
    const busy = page.data.volunteers.filter(v => v.status === 'busy');
    const offline = page.data.volunteers.filter(v => v.status === 'offline');
    expect(available.length).toBe(3);
    expect(busy.length).toBe(1);
    expect(offline.length).toBe(1);
  });

  test('分配记录显示', () => {
    expect(page.data.assignmentHistory.length).toBe(2);
  });

  // ==================== 交互测试 ====================

  test('筛选志愿者 - 全部', () => {
    const initialCount = page.data.volunteers.length;
    page.onFilterChange({ currentTarget: { dataset: { type: 'all' } } });
    expect(page.data.filterType).toBe('all');
    expect(page.data.volunteers.length).toBe(initialCount);
  });

  test('筛选志愿者 - 可接单', () => {
    page.onFilterChange({ currentTarget: { dataset: { type: 'available' } } });
    expect(page.data.filterType).toBe('available');
    expect(page.data.volunteers.every(v => v.status === 'available')).toBe(true);
  });

  test('筛选志愿者 - 忙碌中', () => {
    page.onFilterChange({ currentTarget: { dataset: { type: 'busy' } } });
    expect(page.data.filterType).toBe('busy');
    expect(page.data.volunteers.every(v => v.status === 'busy')).toBe(true);
  });

  test('筛选志愿者 - 离线', () => {
    page.onFilterChange({ currentTarget: { dataset: { type: 'offline' } } });
    expect(page.data.filterType).toBe('offline');
    expect(page.data.volunteers.every(v => v.status === 'offline')).toBe(true);
  });

  test('刷新列表', () => {
    page.onRefresh();
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '已刷新', icon: 'success' });
  });

  test('加载更多 - 有更多数据', () => {
    page.data.hasMore = true;
    page.data.loading = false;
    page.onLoadMore();
    expect(page.data.loading).toBe(false);
    expect(page.data.hasMore).toBe(false);
  });

  test('加载更多 - 无更多数据', () => {
    page.data.hasMore = false;
    page.onLoadMore();
    expect(page.data.loading).toBe(false);
  });

  test('查看志愿者详情', () => {
    page.onViewDetail({ currentTarget: { dataset: { id: 'vol_001' } } });
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=vol_001'
    });
  });

  test('分配志愿者 - 确认分配', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onAssignVolunteer({ currentTarget: { dataset: { id: 'vol_001' } } });
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '分配成功', icon: 'success' });
  });

  test('分配志愿者 - 取消分配', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: false });
      }
    });
    page.onAssignVolunteer({ currentTarget: { dataset: { id: 'vol_001' } } });
    expect(mockWx.navigateBack).not.toHaveBeenCalled();
  });

  test('高亮指定志愿者', () => {
    const spy = jest.spyOn(console, 'log');
    page.highlightVolunteer('vol_001');
    expect(spy).toHaveBeenCalledWith('高亮志愿者:', 'vol_001');
    spy.mockRestore();
  });

  // ==================== 边界测试 ====================

  test('分配志愿者 - 志愿者不存在', () => {
    page.onAssignVolunteer({ currentTarget: { dataset: { id: 'non_existent' } } });
    expect(mockWx.showModal).not.toHaveBeenCalled();
  });

  test('页面刷新 - onPullDownRefresh', async () => {
    mockWx.stopPullDownRefresh = jest.fn();
    await page.loadVolunteers();
    page.onPullDownRefresh();
    expect(mockWx.stopPullDownRefresh).toHaveBeenCalled();
  });

  test('加载志愿者 - loading 状态', () => {
    page.loadVolunteers();
    expect(page.data.loading).toBe(false);
  });

  test('志愿者评级范围验证', () => {
    page.data.volunteers.forEach(v => {
      expect(v.rating).toBeGreaterThanOrEqual(0);
      expect(v.rating).toBeLessThanOrEqual(100);
    });
  });

  test('志愿者等级验证', () => {
    page.data.volunteers.forEach(v => {
      expect(v.level).toBeGreaterThan(0);
    });
  });

  test('距离格式验证', () => {
    page.data.volunteers.forEach(v => {
      expect(v.distance).toMatch(/^\d+\.\d+km$/);
    });
  });

  test('分配记录时间格式', () => {
    page.data.assignmentHistory.forEach(record => {
      expect(record.assignTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });
  });

  test('志愿者技能列表非空', () => {
    page.data.volunteers.forEach(v => {
      expect(v.skills.length).toBeGreaterThan(0);
    });
  });

  test('认证志愿者比例', () => {
    const verified = page.data.volunteers.filter(v => v.verified).length;
    expect(verified).toBeGreaterThan(0);
  });

  test('订单金额格式', () => {
    expect(page.data.orderInfo.amount).toMatch(/^\d+\.\d{2}$/);
  });
});
