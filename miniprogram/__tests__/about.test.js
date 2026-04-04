/**
 * 关于我们页面单元测试
 * @pages/about/index
 */

describe('About Page', () => {
  let page = null;

  beforeEach(() => {
    page = getPage('/pages/about/index');
  });

  // 1. 版本信息初始化
  test('版本信息初始化正确', () => {
    expect(page.data.version).toBeDefined();
    expect(page.data.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  // 2. 版本号格式验证
  test('版本号格式验证', () => {
    expect(page.data.version).toBe('1.2.0');
  });

  // 3. 构建代码存在
  test('构建代码存在', () => {
    expect(page.data.versionCode).toBeDefined();
    expect(page.data.versionCode).toMatch(/^\d{8}$/);
  });

  // 4. 构建日期存在
  test('构建日期存在', () => {
    expect(page.data.buildDate).toBeDefined();
    expect(page.data.buildDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  // 5. 更新日志初始化
  test('更新日志初始化正确', () => {
    expect(page.data.updateLogs).toBeDefined();
    expect(page.data.updateLogs.length).toBeGreaterThanOrEqual(1);
  });

  // 6. 更新日志数据结构验证
  test('更新日志数据结构验证', () => {
    const log = page.data.updateLogs[0];
    expect(log.version).toBeDefined();
    expect(log.date).toBeDefined();
    expect(log.changes).toBeDefined();
    expect(Array.isArray(log.changes)).toBe(true);
  });

  // 7. 团队成员初始化
  test('团队成员初始化正确', () => {
    expect(page.data.teamMembers).toBeDefined();
    expect(page.data.teamMembers.length).toBeGreaterThanOrEqual(1);
  });

  // 8. 团队成员数据结构验证
  test('团队成员数据结构验证', () => {
    const member = page.data.teamMembers[0];
    expect(member.name).toBeDefined();
    expect(member.role).toBeDefined();
    expect(member.avatar).toBeDefined();
    expect(member.desc).toBeDefined();
  });

  // 9. 联系方式初始化
  test('联系方式初始化正确', () => {
    expect(page.data.contactInfo).toBeDefined();
    expect(page.data.contactInfo.wechat).toBeDefined();
    expect(page.data.contactInfo.email).toBeDefined();
    expect(page.data.contactInfo.phone).toBeDefined();
  });

  // 10. 公司信息初始化
  test('公司信息初始化正确', () => {
    expect(page.data.companyInfo).toBeDefined();
    expect(page.data.companyInfo.name).toBeDefined();
    expect(page.data.companyInfo.license).toBeDefined();
  });

  // 11. onLoad 方法存在
  test('onLoad 方法存在', () => {
    expect(typeof page.onLoad).toBe('function');
  });

  // 12. 展开日志方法存在
  test('onLogTap 方法存在', () => {
    expect(typeof page.onLogTap).toBe('function');
  });

  // 13. 展开日志功能测试
  test('展开日志功能测试', () => {
    const mockEvent = {
      currentTarget: {
        dataset: {
          index: 0
        }
      }
    };
    page.onLogTap(mockEvent);
    expect(page.data.expandedLogIndex).toBe(0);
  });

  // 14. 收起日志功能测试
  test('收起日志功能测试', () => {
    page.setData({ expandedLogIndex: 0 });
    const mockEvent = {
      currentTarget: {
        dataset: {
          index: 0
        }
      }
    };
    page.onLogTap(mockEvent);
    expect(page.data.expandedLogIndex).toBe(null);
  });

  // 15. 用户协议方法存在
  test('onUserAgreementTap 方法存在', () => {
    expect(typeof page.onUserAgreementTap).toBe('function');
  });

  // 16. 隐私政策方法存在
  test('onPrivacyPolicyTap 方法存在', () => {
    expect(typeof page.onPrivacyPolicyTap).toBe('function');
  });

  // 17. 联系客服方法存在
  test('onContactTap 方法存在', () => {
    expect(typeof page.onContactTap).toBe('function');
  });

  // 18. 检查更新方法存在
  test('onCheckUpdate 方法存在', () => {
    expect(typeof page.onCheckUpdate).toBe('function');
  });

  // 19. 分享方法存在
  test('onShareAppMessage 方法存在', () => {
    expect(typeof page.onShareAppMessage).toBe('function');
  });

  // 20. 分享返回值验证
  test('分享返回值验证', () => {
    const shareResult = page.onShareAppMessage();
    expect(shareResult.title).toContain('清如');
    expect(shareResult.path).toContain('/pages/about/index');
  });
});
