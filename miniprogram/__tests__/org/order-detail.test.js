/**
 * 机构端 - 订单详情页面测试 V-03
 * @file miniprogram/__tests__/org/order-detail.test.js
 * @description 测试机构订单详情页面的各项功能
 */

describe('机构端 - 订单详情页面 V-03', () => {
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
      makePhoneCall: jest.fn(),
      previewImage: jest.fn(),
      stopPullDownRefresh: jest.fn()
    };
    global.wx = mockWx;

    page = {
      data: {
        orderInfo: {
          orderNo: 'ORD20260412001',
          status: 'assigned',
          statusName: '已分配',
          statusDesc: '志愿者已分配，等待执行',
          updateTime: '2026-04-12 08:30',
          createTime: '2026-04-11 14:20',
          executeDate: '2026-04-13',
          typeName: '委托护生',
          amount: '299.00',
          speciesName: '鲫鱼',
          speciesDesc: '常见淡水鱼类，适合投放于江河湖泊',
          speciesQuantity: '50',
          speciesUnit: '斤',
          speciesImage: '',
          waterArea: '太湖',
          waterAddress: '江苏省苏州市吴中区太湖大道',
          remark: '请选择上午执行，水温适宜',
          assignTime: '2026-04-12 08:30',
          executeTime: '',
          completeTime: '',
          evidence: []
        },
        volunteer: {
          name: '李明',
          avatar: 'https://example.com/avatar.jpg',
          verified: true,
          level: 5,
          serviceDays: 128,
          completedOrders: 56,
          rating: 98
        },
        currentStep: 2,
        showActions: true,
        showBottomBar: true,
        primaryActionText: '确认完成'
      },
      onLoad: function(options) {
        if (options && options.orderId) {
          this.loadOrderDetail(options.orderId);
        } else {
          this.loadMockData();
        }
      },
      onPullDownRefresh: function() {
        this.loadOrderDetail(this.data.orderInfo.orderNo).then(() => {
          mockWx.stopPullDownRefresh();
        });
      },
      loadOrderDetail: function(orderId) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 300);
        });
      },
      loadMockData: function() {
        this.setData({
          orderInfo: {
            ...this.data.orderInfo,
            volunteer: this.data.volunteer
          },
          volunteer: this.data.volunteer
        });
      },
      setData: function(obj) {
        Object.assign(this.data, obj);
      },
      onAssignVolunteer: function() {
        mockWx.navigateTo({
          url: '/pages/org-task-assign/org-task-assign?orderId=' + this.data.orderInfo.orderNo
        });
      },
      onCancelOrder: function() {
        mockWx.showModal({
          title: '取消订单',
          content: '确定要取消这个订单吗？取消后无法恢复。',
          confirmText: '取消',
          confirmColor: '#BA1A1A',
          success: (res) => {
            if (res.confirm) {
              mockWx.showToast({ title: '订单已取消', icon: 'success' });
              setTimeout(() => {
                mockWx.navigateBack();
              }, 1500);
            }
          }
        });
      },
      onConfirmComplete: function() {
        mockWx.showModal({
          title: '确认完成',
          content: '确认订单已完成执行吗？',
          success: (res) => {
            if (res.confirm) {
              mockWx.showToast({ title: '已确认完成', icon: 'success' });
              this.setData({
                'orderInfo.status': 'completed',
                'orderInfo.statusName': '已完成',
                'orderInfo.statusDesc': '订单已圆满执行完成',
                'orderInfo.completeTime': this.formatDate(new Date()),
                currentStep: 4,
                showActions: false
              });
            }
          }
        });
      },
      onViewVolunteer: function() {
        if (this.data.volunteer) {
          mockWx.navigateTo({
            url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=' + this.data.volunteer.id
          });
        }
      },
      onPreviewEvidence: function(e) {
        const index = e.currentTarget.dataset.index;
        const evidence = this.data.orderInfo.evidence;
        mockWx.previewImage({
          current: evidence[index],
          urls: evidence
        });
      },
      onContactVolunteer: function() {
        if (this.data.volunteer && this.data.volunteer.phone) {
          mockWx.makePhoneCall({
            phoneNumber: this.data.volunteer.phone
          });
        } else {
          mockWx.showToast({ title: '暂无联系方式', icon: 'none' });
        }
      },
      onPrimaryAction: function() {
        if (this.data.orderInfo.status === 'completed') {
          this.onConfirmComplete();
        } else {
          mockWx.showToast({ title: '请先确认执行完成', icon: 'none' });
        }
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

  test('页面正常加载 - 无参数模式', () => {
    page.onLoad({});
    expect(page.data.orderInfo.orderNo).toBe('ORD20260412001');
    expect(page.data.orderInfo.status).toBe('assigned');
  });

  test('页面加载 - 带 orderId 参数', () => {
    page.loadOrderDetail = jest.fn();
    page.onLoad({ orderId: 'ORD20260412002' });
    expect(page.loadOrderDetail).toHaveBeenCalledWith('ORD20260412002');
  });

  test('订单状态显示 - 已分配', () => {
    expect(page.data.orderInfo.status).toBe('assigned');
    expect(page.data.orderInfo.statusName).toBe('已分配');
    expect(page.data.orderInfo.statusDesc).toContain('志愿者已分配');
  });

  test('订单基本信息完整', () => {
    expect(page.data.orderInfo.typeName).toBe('委托护生');
    expect(page.data.orderInfo.amount).toBe('299.00');
    expect(page.data.orderInfo.speciesName).toBe('鲫鱼');
    expect(page.data.orderInfo.speciesQuantity).toBe('50');
  });

  test('志愿者信息显示', () => {
    expect(page.data.volunteer.name).toBe('李明');
    expect(page.data.volunteer.verified).toBe(true);
    expect(page.data.volunteer.level).toBe(5);
  });

  test('订单进度步骤', () => {
    expect(page.data.currentStep).toBe(2);
  });

  // ==================== 交互测试 ====================

  test('分配志愿者 - 跳转正确', () => {
    page.onAssignVolunteer();
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/org-task-assign/org-task-assign?orderId=ORD20260412001'
    });
  });

  test('取消订单 - 确认操作', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onCancelOrder();
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '订单已取消', icon: 'success' });
  });

  test('取消订单 - 取消操作', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: false });
      }
    });
    page.onCancelOrder();
    expect(mockWx.navigateBack).not.toHaveBeenCalled();
  });

  test('确认完成 - 确认操作', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onConfirmComplete();
    expect(page.data.orderInfo.status).toBe('completed');
    expect(page.data.orderInfo.statusName).toBe('已完成');
    expect(page.data.currentStep).toBe(4);
    expect(page.data.showActions).toBe(false);
  });

  test('确认完成 - 取消操作', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: false });
      }
    });
    page.onConfirmComplete();
    expect(page.data.orderInfo.status).toBe('assigned');
  });

  test('查看志愿者详情 - 跳转正确', () => {
    page.data.volunteer.id = 'vol_001';
    page.onViewVolunteer();
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=vol_001'
    });
  });

  test('查看志愿者详情 - 无志愿者信息', () => {
    page.data.volunteer = null;
    page.onViewVolunteer();
    expect(mockWx.navigateTo).not.toHaveBeenCalled();
  });

  test('联系志愿者 - 有联系方式', () => {
    page.data.volunteer.phone = '13800138000';
    page.onContactVolunteer();
    expect(mockWx.makePhoneCall).toHaveBeenCalledWith({
      phoneNumber: '13800138000'
    });
  });

  test('联系志愿者 - 无联系方式', () => {
    page.data.volunteer.phone = null;
    page.onContactVolunteer();
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '暂无联系方式', icon: 'none' });
  });

  test('主操作按钮 - 订单未完成', () => {
    page.data.orderInfo.status = 'assigned';
    page.onPrimaryAction();
    expect(mockWx.showToast).toHaveBeenCalledWith({
      title: '请先确认执行完成',
      icon: 'none'
    });
  });

  // ==================== 边界测试 ====================

  test('预览证据 - 有证据图片', () => {
    page.data.orderInfo.evidence = ['img1.jpg', 'img2.jpg'];
    page.onPreviewEvidence({ currentTarget: { dataset: { index: 0 } } });
    expect(mockWx.previewImage).toHaveBeenCalledWith({
      current: 'img1.jpg',
      urls: ['img1.jpg', 'img2.jpg']
    });
  });

  test('预览证据 - 无证据图片', () => {
    page.data.orderInfo.evidence = [];
    expect(() => {
      page.onPreviewEvidence({ currentTarget: { dataset: { index: 0 } } });
    }).not.toThrow();
  });

  test('页面刷新 - onPullDownRefresh', async () => {
    mockWx.stopPullDownRefresh = jest.fn();
    await page.loadOrderDetail('ORD20260412001');
    page.onPullDownRefresh();
    expect(mockWx.stopPullDownRefresh).toHaveBeenCalled();
  });

  test('订单金额格式验证', () => {
    expect(page.data.orderInfo.amount).toMatch(/^\d+\.\d{2}$/);
  });

  test('日期格式化函数', () => {
    const testDate = new Date('2026-04-12 14:30:00');
    const formatted = page.formatDate(testDate);
    expect(formatted).toBe('2026-04-12 14:30');
  });

  test('订单状态流转 - assigned 到 completed', () => {
    expect(page.data.orderInfo.status).toBe('assigned');
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onConfirmComplete();
    expect(page.data.orderInfo.status).toBe('completed');
  });

  test('操作按钮显示逻辑 - 未完成时显示', () => {
    page.data.orderInfo.status = 'assigned';
    expect(page.data.showActions).toBe(true);
  });

  test('操作按钮显示逻辑 - 完成后隐藏', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onConfirmComplete();
    expect(page.data.showActions).toBe(false);
  });

  test('志愿者评级显示', () => {
    expect(page.data.volunteer.rating).toBe(98);
    expect(page.data.volunteer.rating).toBeGreaterThan(0);
    expect(page.data.volunteer.rating).toBeLessThanOrEqual(100);
  });

  test('订单创建时间格式', () => {
    expect(page.data.orderInfo.createTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
});
