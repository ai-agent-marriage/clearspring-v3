import { Page, Locator } from '@playwright/test';

/**
 * 资质管理页面
 * 流程：资质管理 → 查看资质状态 → 更新资质 → 提交审核
 */
export class QualificationPage {
  readonly page: Page;
  
  // 资质状态
  readonly qualificationStatus: Locator;
  readonly qualificationLevel: Locator;
  readonly qualificationExpiry: Locator;
  readonly statusBadge: Locator;
  
  // 证书列表
  readonly certificatesList: Locator;
  readonly certificateItem: Locator;
  readonly certificateName: Locator;
  readonly certificateStatus: Locator;
  
  // 资质更新
  readonly updateButton: Locator;
  readonly uploadCertificateButton: Locator;
  readonly certificateType: Locator;
  readonly certificateFile: Locator;
  readonly certificateExpiryDate: Locator;
  
  // 表单元素
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  
  // 审核状态
  readonly reviewStatus: Locator;
  readonly reviewProgress: Locator;
  readonly submitSuccessToast: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 资质状态
    this.qualificationStatus = page.locator('.qualification-status, .status');
    this.qualificationLevel = page.locator('.qualification-level, .level');
    this.qualificationExpiry = page.locator('.qualification-expiry, .expiry-date');
    this.statusBadge = page.locator('.badge, .status-badge');
    
    // 证书列表
    this.certificatesList = page.locator('.certificates-list, .certificate-container');
    this.certificateItem = page.locator('.certificate-item, .cert-item');
    this.certificateName = page.locator('.certificate-name, .cert-name');
    this.certificateStatus = page.locator('.certificate-status, .cert-status');
    
    // 资质更新
    this.updateButton = page.getByRole('button', { name: /更新资质 | 添加证书/i });
    this.uploadCertificateButton = page.getByRole('button', { name: /上传 | 选择文件/i });
    this.certificateType = page.getByLabel(/证书类型/).or(page.locator('select').first());
    this.certificateFile = page.locator('input[type="file"]');
    this.certificateExpiryDate = page.getByLabel(/有效期至 | 到期时间/i);
    
    // 表单
    this.descriptionInput = page.getByLabel(/描述 | 备注/).or(page.getByPlaceholder(/请输入描述/));
    this.submitButton = page.getByRole('button', { name: /提交 | 提交审核/i });
    
    // 审核状态
    this.reviewStatus = page.locator('.review-status, .audit-status');
    this.reviewProgress = page.locator('.review-progress, .progress-bar');
    this.submitSuccessToast = page.locator('.toast, .success-message').filter({ hasText: /提交成功 | 已提交审核/i });
  }

  /**
   * 访问资质管理页
   */
  async goto() {
    await this.page.goto('/executor/qualification');
  }

  /**
   * 获取资质状态
   */
  async getQualificationStatus() {
    await this.qualificationStatus.waitFor({ state: 'visible', timeout: 5000 });
    return {
      status: await this.qualificationStatus.textContent(),
      level: await this.qualificationLevel.textContent(),
      expiry: await this.qualificationExpiry.textContent(),
    };
  }

  /**
   * 获取证书列表
   */
  async getCertificates() {
    await this.certificatesList.waitFor({ state: 'visible', timeout: 5000 });
    return this.certificateItem.all();
  }

  /**
   * 点击更新资质
   */
  async clickUpdate() {
    await this.updateButton.click();
  }

  /**
   * 上传证书文件
   */
  async uploadCertificate(filePath: string) {
    await this.certificateFile.setInputFiles(filePath);
  }

  /**
   * 选择证书类型
   */
  async selectCertificateType(type: string) {
    await this.certificateType.selectOption(type);
  }

  /**
   * 填写证书有效期
   */
  async fillExpiryDate(date: string) {
    await this.certificateExpiryDate.fill(date);
  }

  /**
   * 填写描述
   */
  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  /**
   * 提交审核
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * 等待提交成功
   */
  async waitForSubmitSuccess() {
    await this.submitSuccessToast.waitFor({ state: 'visible', timeout: 10000 });
    return await this.submitSuccessToast.isVisible();
  }

  /**
   * 获取审核状态
   */
  async getReviewStatus() {
    await this.reviewStatus.waitFor({ state: 'visible', timeout: 5000 });
    return await this.reviewStatus.textContent();
  }
}
