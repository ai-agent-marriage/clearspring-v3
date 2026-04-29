import { Page, Locator } from '@playwright/test';

/**
 * 执行者登录页面
 * 流程：打开小程序 → 授权登录 → 资质验证 → 进入执行者首页
 */
export class ExecutorLoginPage {
  readonly page: Page;
  
  // 元素定位器
  readonly authorizeButton: Locator;
  readonly phoneNumberInput: Locator;
  readonly verificationCodeInput: Locator;
  readonly sendCodeButton: Locator;
  readonly loginButton: Locator;
  readonly agreementCheckbox: Locator;
  readonly qualificationStatus: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 授权登录元素
    this.authorizeButton = page.getByRole('button', { name: /授权登录 | 微信授权 | 一键登录/i });
    
    // 手机号登录元素
    this.phoneNumberInput = page.getByLabel(/手机号 | 手机号码/).or(page.getByPlaceholder(/请输入手机号/));
    this.verificationCodeInput = page.getByLabel(/验证码 | 短信验证码/).or(page.getByPlaceholder(/请输入验证码/));
    this.sendCodeButton = page.getByRole('button', { name: /获取验证码 | 发送验证码/i });
    this.loginButton = page.getByRole('button', { name: /登录 | 登录\/注册/i });
    
    // 协议勾选
    this.agreementCheckbox = page.getByRole('checkbox').or(page.locator('input[type="checkbox"]'));
    
    // 资质验证状态
    this.qualificationStatus = page.getByText(/资质 | 认证 | 审核/i);
    
    // 错误提示
    this.errorMessage = page.locator('.error-message, .toast, .alert').or(page.getByRole('alert'));
  }

  /**
   * 访问登录页
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * 微信授权登录
   */
  async authorizeWithWeChat() {
    await this.authorizeButton.click();
    // 等待微信授权弹窗
    await this.page.waitForTimeout(1000);
  }

  /**
   * 手机号验证码登录
   */
  async loginWithPhone(phone: string, code: string) {
    await this.phoneNumberInput.fill(phone);
    await this.sendCodeButton.click();
    // 等待验证码发送
    await this.page.waitForTimeout(1000);
    await this.verificationCodeInput.fill(code);
    await this.agreementCheckbox?.check();
    await this.loginButton.click();
  }

  /**
   * 验证资质状态
   */
  async verifyQualificationStatus() {
    await this.qualificationStatus.waitFor({ state: 'visible', timeout: 5000 });
    return await this.qualificationStatus.isVisible();
  }

  /**
   * 获取错误信息
   */
  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.errorMessage.textContent();
  }

  /**
   * 等待登录成功跳转
   */
  async waitForLoginSuccess() {
    // 等待跳转到首页
    await this.page.waitForURL(/\/home|\/executor|\/index/);
  }
}
