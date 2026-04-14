import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

test.describe('P0 - 用户登录流程', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test('TC001 - 用户打开小程序并授权登录', async ({ page }) => {
    // 打开小程序
    await loginPage.goto();
    
    // 点击登录按钮
    await loginPage.loginButton.click();
    
    // 授权登录
    await loginPage.authButton.click();
    
    // 验证用户信息显示，表示登录成功
    await expect(loginPage.userInfo).toBeVisible();
    
    // 验证进入首页
    await expect(homePage.serviceList).toBeVisible();
  });

  test('TC002 - 获取用户信息并进入首页', async ({ page, testUser }) => {
    await loginPage.goto();
    await loginPage.login();
    
    // 验证登录状态
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
    
    // 验证首页服务列表可见
    await homePage.viewServiceList();
  });
});
