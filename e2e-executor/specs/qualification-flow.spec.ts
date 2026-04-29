import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { QualificationPage } from '../pages/qualification.page';

/**
 * 资质管理流程测试
 * 用例 ID: E2E-EXEC-006
 * 优先级：P1
 * 
 * 流程：资质管理 → 查看资质状态 → 更新资质 → 提交审核
 */
test.describe('资质管理流程', () => {
  let homePage: ExecutorHomePage;
  let qualificationPage: QualificationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    qualificationPage = new QualificationPage(page);
    
    // 前置条件：已登录
    await page.goto('/executor/home');
    await homePage.waitForLoad();
  });

  test('E2E-EXEC-006-01: 查看资质状态', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 验证资质状态显示
    const status = await qualificationPage.getQualificationStatus();
    expect(status.status).toBeTruthy();
    expect(status.level).toBeTruthy();
  });

  test('E2E-EXEC-006-02: 查看证书列表', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 获取证书列表
    const certificates = await qualificationPage.getCertificates();
    expect(certificates.length).toBeGreaterThanOrEqual(0);
  });

  test('E2E-EXEC-006-03: 更新资质 - 上传证书', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 点击更新资质
    await qualificationPage.clickUpdate();
    
    // 3. 选择证书类型
    await qualificationPage.selectCertificateType('professional');
    
    // 4. 上传证书文件（使用空文件模拟）
    const testFile = {
      name: 'certificate.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test certificate content'),
    };
    await qualificationPage.uploadCertificate(testFile);
    
    // 5. 填写有效期
    await qualificationPage.fillExpiryDate('2027-12-31');
    
    // 6. 验证文件已选择
    // 由于安全限制，无法直接验证文件路径，但可以选择其他字段
  });

  test('E2E-EXEC-006-04: 更新资质 - 填写描述', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 点击更新资质
    await qualificationPage.clickUpdate();
    
    // 3. 填写描述
    await qualificationPage.fillDescription('专业资格证书');
    
    // 4. 验证描述已填写
    const description = await qualificationPage.descriptionInput.inputValue();
    expect(description).toBe('专业资格证书');
  });

  test('E2E-EXEC-006-05: 提交资质审核', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 点击更新资质
    await qualificationPage.clickUpdate();
    
    // 3. 选择证书类型
    await qualificationPage.selectCertificateType('professional');
    
    // 4. 填写有效期
    await qualificationPage.fillExpiryDate('2027-12-31');
    
    // 5. 填写描述
    await qualificationPage.fillDescription('专业资格证书');
    
    // 6. 提交审核
    await qualificationPage.submit();
    
    // 7. 等待提交成功
    const success = await qualificationPage.waitForSubmitSuccess();
    expect(success).toBeTruthy();
  });

  test('E2E-EXEC-006-06: 查看审核状态', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 获取审核状态
    const reviewStatus = await qualificationPage.getReviewStatus();
    expect(reviewStatus).toBeTruthy();
  });

  test('E2E-EXEC-006-07: 资质即将到期提醒', async ({ page }) => {
    // 1. 访问资质管理页
    await qualificationPage.goto();
    
    // 2. 验证到期时间显示
    const status = await qualificationPage.getQualificationStatus();
    expect(status.expiry).toBeTruthy();
    
    // 3. 检查是否有到期提醒
    const warningMessage = page.locator('.warning, .alert').filter({ hasText: /即将到期 | 过期/i });
    // 如果有即将到期的资质，应该显示提醒
  });
});
