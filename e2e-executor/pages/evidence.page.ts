import { Page, Locator } from '@playwright/test';

/**
 * 证据提交页面
 * 流程：选择证据 → 添加水印 → 上传证据 → 提交成功
 */
export class EvidencePage {
  readonly page: Page;
  
  // 证据类型选择
  readonly photoEvidenceTab: Locator;
  readonly videoEvidenceTab: Locator;
  readonly addPhotoButton: Locator;
  readonly addVideoButton: Locator;
  
  // 证据列表
  readonly evidenceList: Locator;
  readonly evidenceItem: Locator;
  readonly evidencePreview: Locator;
  readonly evidenceCount: Locator;
  
  // 水印选项
  readonly watermarkToggle: Locator;
  readonly watermarkPreview: Locator;
  readonly watermarkText: Locator;
  
  // 描述输入
  readonly descriptionInput: Locator;
  readonly locationInput: Locator;
  readonly timeInput: Locator;
  
  // 上传状态
  readonly uploadProgress: Locator;
  readonly uploadStatus: Locator;
  
  // 提交操作
  readonly submitButton: Locator;
  readonly submitSuccessToast: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 证据类型
    this.photoEvidenceTab = page.getByRole('tab', { name: /照片 | 图片/i });
    this.videoEvidenceTab = page.getByRole('tab', { name: /视频/i });
    this.addPhotoButton = page.getByRole('button', { name: /添加照片 | 拍照/i });
    this.addVideoButton = page.getByRole('button', { name: /添加视频 | 录像/i });
    
    // 证据列表
    this.evidenceList = page.locator('.evidence-list, .media-list');
    this.evidenceItem = page.locator('.evidence-item, .media-item');
    this.evidencePreview = page.locator('.evidence-preview, img, video');
    this.evidenceCount = page.getByText(/\d+\/\d+/);
    
    // 水印选项
    this.watermarkToggle = page.locator('.watermark-toggle, input[type="checkbox"]').filter({ hasText: /水印/i });
    this.watermarkPreview = page.locator('.watermark-preview');
    this.watermarkText = page.locator('.watermark-text');
    
    // 描述输入
    this.descriptionInput = page.getByLabel(/描述 | 说明/).or(page.getByPlaceholder(/请输入描述/));
    this.locationInput = page.getByLabel(/位置 | 地点/).or(page.getByPlaceholder(/位置信息/));
    this.timeInput = page.getByLabel(/时间/).or(page.getByPlaceholder(/拍摄时间/));
    
    // 上传状态
    this.uploadProgress = page.locator('.upload-progress, .progress-bar');
    this.uploadStatus = page.locator('.upload-status');
    
    // 提交按钮
    this.submitButton = page.getByRole('button', { name: /提交 | 确认提交/i });
    this.submitSuccessToast = page.locator('.toast, .success-message').filter({ hasText: /提交成功 | 上传成功/i });
  }

  /**
   * 访问证据提交页
   */
  async goto(taskId?: string) {
    const url = taskId ? `/executor/evidence/${taskId}` : '/executor/evidence';
    await this.page.goto(url);
  }

  /**
   * 添加照片证据
   */
  async addPhoto() {
    await this.addPhotoButton.click();
  }

  /**
   * 添加视频证据
   */
  async addVideo() {
    await this.addVideoButton.click();
  }

  /**
   * 获取证据数量
   */
  async getEvidenceCount() {
    const count = await this.evidenceCount.textContent();
    return count ? parseInt(count.split('/')[0]) : 0;
  }

  /**
   * 开关水印
   */
  async toggleWatermark(enable: boolean) {
    const isChecked = await this.watermarkToggle.isChecked();
    if (enable !== isChecked) {
      await this.watermarkToggle.click();
    }
  }

  /**
   * 验证水印
   */
  async verifyWatermark() {
    await this.watermarkPreview.waitFor({ state: 'visible', timeout: 3000 });
    return await this.watermarkPreview.isVisible();
  }

  /**
   * 填写描述
   */
  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  /**
   * 等待上传完成
   */
  async waitForUploadComplete() {
    await this.uploadProgress.waitFor({ state: 'hidden', timeout: 30000 });
  }

  /**
   * 提交证据
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
   * 获取提交成功消息
   */
  async getSuccessMessage() {
    await this.submitSuccessToast.waitFor({ state: 'visible', timeout: 10000 });
    return await this.submitSuccessToast.textContent();
  }
}
