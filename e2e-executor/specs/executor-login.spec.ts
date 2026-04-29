import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorLoginPage } from '../pages/executor-login.page';
import { ExecutorHomePage } from '../pages/executor-home.page';

/**
 * 执行者登录流程测试
 * 用例 ID: E2E-EXEC-001
 * 优先级：P0
 * 
 * 流程：打开小程序 → 授权登录 → 资质验证 → 进入执行者首页
 */
test.describe('执行者登录流程', () => {
  let loginPage: ExecutorLoginPage;
  let homePage: ExecutorHomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new ExecutorLoginPage(page);
    homePage = new ExecutorHomePage(page);
  });

  test('E2E-EXEC-001-01: 微信授权登录成功', async ({ page, executorId }) => {
    // 1. 访问登录页
    await loginPage.goto();
    
    // 2. 点击微信授权
    await loginPage.authorizeWithWeChat();
    
    // 3. 等待资质验证
    const qualificationVerified = await loginPage.verifyQualificationStatus();
    expect(qualificationVerified).toBeTruthy();
    
    // 4. 等待跳转到首页
    await loginPage.waitForLoginSuccess();
    
    // 5. 验证首页加载
    await homePage.waitForLoad();
    await expect(homePage.incomeSummary).toBeVisible();
  });

  test('E2E-EXEC-001-02: 手机号验证码登录成功', async ({ page }) => {
    const testPhone = '13800138001';
    const testCode = '123456';
    
    // 1. 访问登录页
    await loginPage.goto();
    
    // 2. 输入手机号和验证码
    await loginPage.loginWithPhone(testPhone, testCode);
    
    // 3. 等待登录成功
    await loginPage.waitForLoginSuccess();
    
    // 4. 验证首页加载
    await homePage.waitForLoad();
    await expect(homePage.orderHallTab).toBeVisible();
  });

  test('E2E-EXEC-001-03: 登录失败 - 手机号格式错误', async ({ page }) => {
    const invalidPhone = '1380013800'; // 少一位
    const testCode = '123456';
    
    // 1. 访问登录页
    await loginPage.goto();
    
    // 2. 输入错误格式的手机号
    await loginPage.phoneNumberInput.fill(invalidPhone);
    await loginPage.sendCodeButton.click();
    
    // 3. 验证错误提示
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('手机号格式错误');
  });

  test('E2E-EXEC-001-04: 登录失败 - 验证码错误', async ({ page }) => {
    const testPhone = '13800138001';
    const wrongCode = '000000';
    
    // 1. 访问登录页
    await loginPage.goto();
    
    // 2. 输入手机号和错误验证码
    await loginPage.phoneNumberInput.fill(testPhone);
    await loginPage.sendCodeButton.click();
    await loginPage.verificationCodeInput.fill(wrongCode);
    await loginPage.loginButton.click();
    
    // 3. 验证错误提示
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('验证码错误');
  });

  test('E2E-EXEC-001-05: 资质验证失败 - 未通过审核', async ({ page }) => {
    // 1. 使用未认证账号登录
    await loginPage.goto();
    await loginPage.loginWithPhone('13800138002', '123456');
    
    // 2. 验证资质验证提示
    await loginPage.verifyQualificationStatus();
    
    // 3. 应该停留在资质验证页或显示待审核提示
    const statusText = await loginPage.qualificationStatus.textContent();
    expect(statusText).toMatch(/审核中 | 待认证 | 未通过/i);
  });
});
