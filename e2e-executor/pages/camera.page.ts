import { Page, Locator } from '@playwright/test';

/**
 * 相机页面（原生拍摄）
 * 流程：调用相机 → 拍照/录像 → 确认
 */
export class CameraPage {
  readonly page: Page;
  
  // 相机控制
  readonly cameraView: Locator;
  readonly switchCameraButton: Locator;
  readonly flashButton: Locator;
  readonly timerButton: Locator;
  
  // 拍摄模式
  readonly photoMode: Locator;
  readonly videoMode: Locator;
  
  // 拍摄按钮
  readonly captureButton: Locator;
  readonly recordButton: Locator;
  
  // 预览元素
  readonly previewContainer: Locator;
  readonly thumbnail: Locator;
  readonly confirmButton: Locator;
  readonly retakeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 相机视图
    this.cameraView = page.locator('.camera-view, video');
    this.switchCameraButton = page.getByRole('button', { name: /切换 | 翻转 | 前后/i });
    this.flashButton = page.getByRole('button', { name: /闪光灯 | 闪/i });
    this.timerButton = page.getByRole('button', { name: /定时器 | 延时/i });
    
    // 模式切换
    this.photoMode = page.getByRole('button', { name: /照片 | 拍照/i });
    this.videoMode = page.getByRole('button', { name: /视频 | 录像/i });
    
    // 拍摄按钮
    this.captureButton = page.locator('.capture-button, .shutter-button');
    this.recordButton = page.locator('.record-button');
    
    // 预览
    this.previewContainer = page.locator('.preview-container, .media-preview');
    this.thumbnail = page.locator('.thumbnail, .preview-thumb');
    this.confirmButton = page.getByRole('button', { name: /确认 | 使用 | 确定/i });
    this.retakeButton = page.getByRole('button', { name: /重拍 | 取消/i });
  }

  /**
   * 等待相机就绪
   */
  async waitForCameraReady() {
    await this.cameraView.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * 切换到视频模式
   */
  async switchToVideoMode() {
    await this.videoMode.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * 拍照
   */
  async takePhoto() {
    await this.captureButton.click();
    // 等待照片处理
    await this.page.waitForTimeout(1000);
  }

  /**
   * 开始录像
   */
  async startRecording() {
    await this.recordButton.click();
  }

  /**
   * 停止录像
   */
  async stopRecording() {
    await this.recordButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 确认使用拍摄内容
   */
  async confirm() {
    await this.confirmButton.click();
  }

  /**
   * 重拍
   */
  async retake() {
    await this.retakeButton.click();
  }

  /**
   * 等待预览出现
   */
  async waitForPreview() {
    await this.previewContainer.waitFor({ state: 'visible', timeout: 3000 });
  }
}
