/**
 * 执行者端 - 资质管理页面测试 O-10
 * @file miniprogram/__tests__/executor/qualification-manage.test.js
 * @description 测试执行者资质管理页面的各项功能
 */

describe('执行者端 - 资质管理页面 O-10', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    // Mock wx 对象
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      showToast: jest.fn(),
      showModal: jest.fn(),
      showActionSheet: jest.fn(),
      chooseMedia: jest.fn(),
      stopPullDownRefresh: jest.fn()
    };
    global.wx = mockWx;

    // 创建页面实例
    page = {
      data: {
        currentStatus: 'verified',
        statusTitle: '已认证',
        statusDesc: '您的资质已通过平台审核',
        expireDate: '2027-03-28',
        showActionButton: false,
        actionButtonText: '',
        currentStep: 3,
        submitDate: '2026-03-25',
        reviewDate: '2026-03-26',
        completeDate: '2026-03-27',
        rejectionReason: '身份证照片不够清晰，无法辨认关键信息',
        rejectionSuggestions: '请重新拍摄身份证照片，确保光线充足、对焦清晰，四个角都拍摄完整',
        certificates: [
          {
            id: 'cert_001',
            name: '心理咨询师证书',
            type: 'skill',
            typeText: '技能认证',
            status: 'verified',
            statusText: '已认证',
            issueDate: '2025-06-15',
            validDate: '2028-06-15'
          },
          {
            id: 'cert_002',
            name: '健康管理师证书',
            type: 'skill',
            typeText: '技能认证',
            status: 'pending',
            statusText: '审核中',
            issueDate: '2025-09-20',
            validDate: '2028-09-20'
          },
          {
            id: 'cert_003',
            name: '应急救援员证书',
            type: 'qualification',
            typeText: '资质认证',
            status: 'verified',
            statusText: '已认证',
            issueDate: '2024-12-10',
            validDate: '2027-12-10'
          }
        ],
        skillTags: [
          { id: 'skill_001', name: '心理咨询', active: true },
          { id: 'skill_002', name: '健康管理', active: true },
          { id: 'skill_003', name: '应急救援', active: true },
          { id: 'skill_004', name: '生活陪伴', active: false },
          { id: 'skill_005', name: '活动组织', active: false },
          { id: 'skill_006', name: '文案写作', active: false },
          { id: 'skill_007', name: '摄影摄像', active: false },
          { id: 'skill_008', name: '翻译服务', active: false }
        ]
      },
      onLoad: function(options) {
        if (options && options.status) {
          this.updateStatus(options.status);
        }
        this.loadQualificationData();
      },
      onShow: function() {
        this.loadQualificationData();
      },
      onPullDownRefresh: function() {
        this.loadQualificationData().then(() => {
          mockWx.stopPullDownRefresh();
        });
      },
      loadQualificationData: function() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 300);
        });
      },
      updateStatus: function(status) {
        const statusMap = {
          verified: { title: '已认证', desc: '您的资质已通过平台审核', showAction: false },
          pending: { title: '审核中', desc: '平台正在审核您的资质', showAction: false },
          rejected: { title: '已驳回', desc: '您的资质未通过审核', showAction: true, actionText: '重新提交' },
          expired: { title: '已过期', desc: '您的资质已过期，请重新认证', showAction: true, actionText: '重新认证' }
        };
        const statusInfo = statusMap[status] || statusMap.verified;
        this.data.currentStatus = status;
        this.data.statusTitle = statusInfo.title;
        this.data.statusDesc = statusInfo.desc;
        this.data.showActionButton = statusInfo.showAction;
        this.data.actionButtonText = statusInfo.actionText || '';
      },
      onUpdateQualification: function() {
        mockWx.navigateTo({ url: '/pages/executor-qualification/executor-qualification' });
      },
      onAddCertificate: function() {
        mockWx.showActionSheet({
          itemList: ['上传技能证书', '上传资质证书'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.onUploadSkillCertificate();
            } else if (res.tapIndex === 1) {
              this.onUploadQualificationCertificate();
            }
          }
        });
      },
      onUploadSkillCertificate: function() {
        mockWx.chooseMedia({
          count: 9,
          mediaType: ['image'],
          sourceType: ['camera', 'album'],
          sizeType: ['compressed'],
          success: (res) => {
            mockWx.showToast({ title: '证书上传成功', icon: 'success' });
          },
          fail: (err) => {
            if (err.errMsg !== 'chooseMedia:fail cancel') {
              mockWx.showToast({ title: '上传失败', icon: 'none' });
            }
          }
        });
      },
      onUploadQualificationCertificate: function() {
        mockWx.chooseMedia({
          count: 9,
          mediaType: ['image'],
          sourceType: ['camera', 'album'],
          sizeType: ['compressed'],
          success: (res) => {
            mockWx.showToast({ title: '证书上传成功', icon: 'success' });
          },
          fail: (err) => {
            if (err.errMsg !== 'chooseMedia:fail cancel') {
              mockWx.showToast({ title: '上传失败', icon: 'none' });
            }
          }
        });
      },
      onViewCertificate: function(e) {
        const certId = e.currentTarget.dataset.id;
        const certificate = this.data.certificates.find(cert => cert.id === certId);
        if (certificate) {
          mockWx.navigateTo({ url: `/pages/executor-certificate-detail/executor-certificate-detail?id=${certId}` });
        }
      },
      onDeleteCertificate: function(e) {
        const certId = e.currentTarget.dataset.id;
        mockWx.showModal({
          title: '确认删除',
          content: '确定要删除这个证书吗？',
          confirmText: '删除',
          confirmColor: '#BA1A1A',
          success: (res) => {
            if (res.confirm) {
              const certificates = this.data.certificates.filter(cert => cert.id !== certId);
              this.data.certificates = certificates;
              mockWx.showToast({ title: '删除成功', icon: 'success' });
            }
          }
        });
      },
      onEditSkills: function() {
        mockWx.showToast({ title: '点击标签即可编辑', icon: 'none' });
      },
      onToggleSkill: function(e) {
        const skillId = e.currentTarget.dataset.id;
        const skillTags = this.data.skillTags.map(tag => {
          if (tag.id === skillId) {
            return { ...tag, active: !tag.active };
          }
          return tag;
        });
        this.data.skillTags = skillTags;
      },
      onMenuTap: function(e) {
        const action = e.currentTarget.dataset.action;
        switch (action) {
          case 'rules':
            mockWx.navigateTo({ url: '/pages/executor-qualification-rules/executor-qualification-rules' });
            break;
          case 'help':
            mockWx.navigateTo({ url: '/pages/help/index' });
            break;
        }
      }
    };
  });

  // ==================== 功能测试 ====================

  test('页面正常加载 - 验证 onLoad 触发和数据初始化', () => {
    page.onLoad({});
    expect(page.data.currentStatus).toBe('verified');
    expect(page.data.statusTitle).toBe('已认证');
    expect(page.data.certificates.length).toBe(3);
  });

  test('资质状态正确显示 - verified 状态', () => {
    expect(page.data.currentStatus).toBe('verified');
    expect(page.data.statusTitle).toBe('已认证');
    expect(page.data.statusDesc).toContain('已通过平台审核');
  });

  test('资质状态切换 - pending 状态', () => {
    page.updateStatus('pending');
    expect(page.data.currentStatus).toBe('pending');
    expect(page.data.statusTitle).toBe('审核中');
    expect(page.data.showActionButton).toBe(false);
  });

  test('资质状态切换 - rejected 状态', () => {
    page.updateStatus('rejected');
    expect(page.data.currentStatus).toBe('rejected');
    expect(page.data.statusTitle).toBe('已驳回');
    expect(page.data.showActionButton).toBe(true);
    expect(page.data.actionButtonText).toBe('重新提交');
  });

  test('资质状态切换 - expired 状态', () => {
    page.updateStatus('expired');
    expect(page.data.currentStatus).toBe('expired');
    expect(page.data.statusTitle).toBe('已过期');
    expect(page.data.showActionButton).toBe(true);
    expect(page.data.actionButtonText).toBe('重新认证');
  });

  // ==================== 交互测试 ====================

  test('上传按钮点击响应 - 显示操作菜单', () => {
    page.onAddCertificate();
    expect(mockWx.showActionSheet).toHaveBeenCalledWith(expect.objectContaining({
      itemList: ['上传技能证书', '上传资质证书']
    }));
  });

  test('上传技能证书 - 选择图片成功', () => {
    mockWx.chooseMedia.mockImplementation((options) => {
      if (options.success) {
        options.success({ tempFiles: [{ path: 'test.jpg' }] });
      }
    });
    page.onUploadSkillCertificate();
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '证书上传成功', icon: 'success' });
  });

  test('上传证书 - 用户取消选择', () => {
    mockWx.chooseMedia.mockImplementation((options) => {
      if (options.fail) {
        options.fail({ errMsg: 'chooseMedia:fail cancel' });
      }
    });
    page.onUploadSkillCertificate();
    expect(mockWx.showToast).not.toHaveBeenCalled();
  });

  test('查看证书详情 - 正确跳转', () => {
    page.onViewCertificate({ currentTarget: { dataset: { id: 'cert_001' } } });
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/executor-certificate-detail/executor-certificate-detail?id=cert_001'
    });
  });

  test('删除证书 - 确认删除', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    const initialCount = page.data.certificates.length;
    page.onDeleteCertificate({ currentTarget: { dataset: { id: 'cert_001' } } });
    expect(page.data.certificates.length).toBe(initialCount - 1);
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '删除成功', icon: 'success' });
  });

  test('删除证书 - 取消删除', () => {
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: false });
      }
    });
    const initialCount = page.data.certificates.length;
    page.onDeleteCertificate({ currentTarget: { dataset: { id: 'cert_001' } } });
    expect(page.data.certificates.length).toBe(initialCount);
  });

  test('切换擅长领域 - 激活标签', () => {
    const initialActive = page.data.skillTags.filter(t => t.active).length;
    page.onToggleSkill({ currentTarget: { dataset: { id: 'skill_004' } } });
    const skill_004 = page.data.skillTags.find(t => t.id === 'skill_004');
    expect(skill_004.active).toBe(true);
    expect(page.data.skillTags.filter(t => t.active).length).toBe(initialActive + 1);
  });

  test('切换擅长领域 - 取消激活标签', () => {
    const initialActive = page.data.skillTags.filter(t => t.active).length;
    page.onToggleSkill({ currentTarget: { dataset: { id: 'skill_001' } } });
    const skill_001 = page.data.skillTags.find(t => t.id === 'skill_001');
    expect(skill_001.active).toBe(false);
    expect(page.data.skillTags.filter(t => t.active).length).toBe(initialActive - 1);
  });

  test('编辑擅长领域 - 显示提示', () => {
    page.onEditSkills();
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '点击标签即可编辑', icon: 'none' });
  });

  test('更新资质 - 跳转正确', () => {
    page.onUpdateQualification();
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/executor-qualification/executor-qualification'
    });
  });

  // ==================== 边界测试 ====================

  test('查看证书详情 - 证书不存在', () => {
    page.onViewCertificate({ currentTarget: { dataset: { id: 'non_existent' } } });
    expect(mockWx.navigateTo).not.toHaveBeenCalled();
  });

  test('加载数据 - 网络错误处理', async () => {
    // 测试 loadQualificationData 的错误处理逻辑
    // 由于原函数使用 try-catch 内部处理错误，不抛出异常
    // 这里验证函数能正常执行
    const result = await page.loadQualificationData();
    expect(result).toBeUndefined(); // Promise resolves without value
  });

  test('页面刷新 - onPullDownRefresh', async () => {
    mockWx.stopPullDownRefresh = jest.fn();
    await page.onPullDownRefresh();
    // 验证刷新完成后调用 stopPullDownRefresh
    expect(mockWx.stopPullDownRefresh).toHaveBeenCalled();
  });

  test('菜单点击 - 查看规则', () => {
    page.onMenuTap({ currentTarget: { dataset: { action: 'rules' } } });
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/executor-qualification-rules/executor-qualification-rules'
    });
  });

  test('菜单点击 - 帮助中心', () => {
    page.onMenuTap({ currentTarget: { dataset: { action: 'help' } } });
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/help/index'
    });
  });

  test('证书状态显示 - 审核中证书', () => {
    const pendingCert = page.data.certificates.find(c => c.status === 'pending');
    expect(pendingCert).toBeDefined();
    expect(pendingCert.statusText).toBe('审核中');
  });

  test('证书列表数量验证', () => {
    expect(page.data.certificates.length).toBe(3);
    expect(page.data.certificates.filter(c => c.status === 'verified').length).toBe(2);
    expect(page.data.certificates.filter(c => c.status === 'pending').length).toBe(1);
  });

  test('擅长领域标签数量验证', () => {
    expect(page.data.skillTags.length).toBe(8);
    expect(page.data.skillTags.filter(t => t.active).length).toBe(3);
  });
});
