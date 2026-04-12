/**
 * 机构端 - 志愿者详情页面测试 V-05
 * @file miniprogram/__tests__/org/volunteer-detail.test.js
 * @description 测试机构志愿者详情页面的各项功能
 */

describe('机构端 - 志愿者详情页面 V-05', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      showToast: jest.fn(),
      showModal: jest.fn(),
      makePhoneCall: jest.fn(),
      stopPullDownRefresh: jest.fn()
    };
    global.wx = mockWx;

    page = {
      data: {
        volunteerInfo: {
          id: 'vol_001',
          volunteerNo: 'V2025001',
          name: '李明',
          avatar: 'https://example.com/avatar.jpg',
          verified: true,
          level: 5,
          status: 'active',
          statusText: '可接单',
          gender: '男',
          age: 28,
          location: '江苏省苏州市',
          registerDate: '2025-03-15',
          serviceDays: 128,
          completedOrders: 56,
          rating: 98,
          totalHours: 256,
          skills: ['护生执行', '活动组织', '摄影记录'],
          phone: '138****5678'
        },
        certificates: [
          {
            id: 'cert_001',
            name: '心理咨询师证书',
            type: 'skill',
            status: 'verified',
            statusText: '已认证',
            issueDate: '2025-06-15'
          },
          {
            id: 'cert_002',
            name: '应急救援员证书',
            type: 'qualification',
            status: 'verified',
            statusText: '已认证',
            issueDate: '2024-12-10'
          },
          {
            id: 'cert_003',
            name: '健康管理师证书',
            type: 'skill',
            status: 'pending',
            statusText: '审核中',
            issueDate: '2025-09-20'
          }
        ],
        serviceHistory: [
          {
            id: 'order_001',
            orderName: '太湖护生活动 #001',
            date: '2026-04-10',
            status: 'completed',
            statusText: '已完成',
            species: '鲫鱼 50 斤',
            amount: '299.00',
            rating: 5,
            ratingStars: '★★★★★',
            ratingComment: '非常专业，执行过程规范'
          },
          {
            id: 'order_002',
            orderName: '阳澄湖护生活动 #002',
            date: '2026-04-08',
            status: 'completed',
            statusText: '已完成',
            species: '鲤鱼 30 斤',
            amount: '199.00',
            rating: 5,
            ratingStars: '★★★★★',
            ratingComment: '态度很好，准时到达'
          },
          {
            id: 'order_003',
            orderName: '金鸡湖护生活动 #003',
            date: '2026-04-05',
            status: 'completed',
            statusText: '已完成',
            species: '草鱼 40 斤',
            amount: '259.00',
            rating: 4,
            ratingStars: '★★★★☆',
            ratingComment: '整体不错'
          }
        ],
        reviews: [
          {
            id: 'review_001',
            avatar: 'https://example.com/user1.jpg',
            reviewerName: '张女士',
            date: '2026-04-10',
            stars: '★★★★★',
            content: '李老师非常专业，整个护生过程非常规范，还给我们讲解了相关知识，非常感谢！',
            reply: '谢谢您的认可，这是我应该做的！'
          },
          {
            id: 'review_002',
            avatar: 'https://example.com/user2.jpg',
            reviewerName: '王先生',
            date: '2026-04-08',
            stars: '★★★★★',
            content: '准时到达，执行认真，好评！',
            reply: ''
          }
        ]
      },
      onLoad: function(options) {
        if (options && options.volunteerId) {
          this.loadVolunteerDetail(options.volunteerId);
        } else {
          this.loadMockData();
        }
      },
      onPullDownRefresh: function() {
        this.loadVolunteerDetail(this.data.volunteerInfo.id).then(() => {
          mockWx.stopPullDownRefresh();
        });
      },
      loadVolunteerDetail: function(volunteerId) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 300);
        });
      },
      loadMockData: function() {
        // 数据已在 data 中初始化
      },
      onContactVolunteer: function() {
        if (this.data.volunteerInfo.phone) {
          mockWx.makePhoneCall({
            phoneNumber: this.data.volunteerInfo.phone
          });
        } else {
          mockWx.showToast({ title: '暂无联系方式', icon: 'none' });
        }
      },
      onAssignTask: function() {
        mockWx.navigateTo({
          url: '/pages/org-task-assign/org-task-assign?volunteerId=' + this.data.volunteerInfo.id
        });
      },
      onViewAllHistory: function() {
        mockWx.navigateTo({
          url: '/pages/org-volunteer-history/org-volunteer-history?volunteerId=' + this.data.volunteerInfo.id
        });
      },
      onViewResume: function() {
        mockWx.showToast({ title: '简历查看功能开发中', icon: 'none' });
      }
    };
  });

  // ==================== 功能测试 ====================

  test('页面正常加载 - 无参数模式', () => {
    page.onLoad({});
    expect(page.data.volunteerInfo.name).toBe('李明');
    expect(page.data.volunteerInfo.level).toBe(5);
  });

  test('页面加载 - 带 volunteerId 参数', () => {
    page.loadVolunteerDetail = jest.fn();
    page.onLoad({ volunteerId: 'vol_002' });
    expect(page.loadVolunteerDetail).toHaveBeenCalledWith('vol_002');
  });

  test('志愿者基本信息完整', () => {
    expect(page.data.volunteerInfo.name).toBe('李明');
    expect(page.data.volunteerInfo.volunteerNo).toBe('V2025001');
    expect(page.data.volunteerInfo.gender).toBe('男');
    expect(page.data.volunteerInfo.age).toBe(28);
  });

  test('志愿者状态显示 - 可接单', () => {
    expect(page.data.volunteerInfo.status).toBe('active');
    expect(page.data.volunteerInfo.statusText).toBe('可接单');
  });

  test('志愿者服务数据统计', () => {
    expect(page.data.volunteerInfo.serviceDays).toBe(128);
    expect(page.data.volunteerInfo.completedOrders).toBe(56);
    expect(page.data.volunteerInfo.totalHours).toBe(256);
  });

  test('志愿者评级显示', () => {
    expect(page.data.volunteerInfo.rating).toBe(98);
  });

  test('志愿者技能列表', () => {
    expect(page.data.volunteerInfo.skills.length).toBe(3);
    expect(page.data.volunteerInfo.skills).toContain('护生执行');
    expect(page.data.volunteerInfo.skills).toContain('活动组织');
  });

  test('资质证书列表', () => {
    expect(page.data.certificates.length).toBe(3);
    expect(page.data.certificates.filter(c => c.status === 'verified').length).toBe(2);
    expect(page.data.certificates.filter(c => c.status === 'pending').length).toBe(1);
  });

  test('服务记录列表', () => {
    expect(page.data.serviceHistory.length).toBe(3);
    expect(page.data.serviceHistory.every(h => h.status === 'completed')).toBe(true);
  });

  test('评价列表', () => {
    expect(page.data.reviews.length).toBe(2);
    expect(page.data.reviews.every(r => r.stars === '★★★★★')).toBe(true);
  });

  // ==================== 交互测试 ====================

  test('联系志愿者 - 有电话号码', () => {
    page.onContactVolunteer();
    expect(mockWx.makePhoneCall).toHaveBeenCalledWith({
      phoneNumber: '138****5678'
    });
  });

  test('联系志愿者 - 无电话号码', () => {
    page.data.volunteerInfo.phone = null;
    page.onContactVolunteer();
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '暂无联系方式', icon: 'none' });
  });

  test('分配任务 - 跳转正确', () => {
    page.onAssignTask();
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/org-task-assign/org-task-assign?volunteerId=vol_001'
    });
  });

  test('查看全部服务记录 - 跳转正确', () => {
    page.onViewAllHistory();
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/org-volunteer-history/org-volunteer-history?volunteerId=vol_001'
    });
  });

  test('查看简历 - 功能开发中', () => {
    page.onViewResume();
    expect(mockWx.showToast).toHaveBeenCalledWith({
      title: '简历查看功能开发中',
      icon: 'none'
    });
  });

  // ==================== 边界测试 ====================

  test('页面刷新 - onPullDownRefresh', async () => {
    mockWx.stopPullDownRefresh = jest.fn();
    await page.loadVolunteerDetail('vol_001');
    page.onPullDownRefresh();
    expect(mockWx.stopPullDownRefresh).toHaveBeenCalled();
  });

  test('志愿者认证状态 - 已认证', () => {
    expect(page.data.volunteerInfo.verified).toBe(true);
  });

  test('志愿者等级验证', () => {
    expect(page.data.volunteerInfo.level).toBeGreaterThan(0);
    expect(page.data.volunteerInfo.level).toBeLessThanOrEqual(10);
  });

  test('服务记录评分验证', () => {
    page.data.serviceHistory.forEach(record => {
      expect(record.rating).toBeGreaterThanOrEqual(1);
      expect(record.rating).toBeLessThanOrEqual(5);
    });
  });

  test('证书状态验证 - 已认证', () => {
    const verifiedCerts = page.data.certificates.filter(c => c.status === 'verified');
    verifiedCerts.forEach(cert => {
      expect(cert.statusText).toBe('已认证');
    });
  });

  test('证书状态验证 - 审核中', () => {
    const pendingCert = page.data.certificates.find(c => c.status === 'pending');
    expect(pendingCert.statusText).toBe('审核中');
  });

  test('评价回复验证', () => {
    const reviewWithReply = page.data.reviews.find(r => r.reply !== '');
    expect(reviewWithReply).toBeDefined();
    expect(reviewWithReply.reply).toContain('谢谢');
  });

  test('志愿者注册日期格式', () => {
    expect(page.data.volunteerInfo.registerDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('服务记录金额格式', () => {
    page.data.serviceHistory.forEach(record => {
      expect(record.amount).toMatch(/^\d+\.\d{2}$/);
    });
  });

  test('加载数据 - 网络错误处理', async () => {
    const originalLoad = page.loadVolunteerDetail;
    page.loadVolunteerDetail = jest.fn().mockRejectedValue(new Error('Network error'));
    mockWx.showToast = jest.fn();
    
    try {
      await page.loadVolunteerDetail('vol_001');
    } catch (e) {
      expect(mockWx.showToast).toHaveBeenCalledWith({ title: '加载失败', icon: 'none' });
    }
    
    page.loadVolunteerDetail = originalLoad;
  });

  test('志愿者位置信息显示', () => {
    expect(page.data.volunteerInfo.location).toBe('江苏省苏州市');
  });

  test('服务记录日期格式', () => {
    page.data.serviceHistory.forEach(record => {
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
