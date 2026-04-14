import { test, expect } from '../fixtures/executor-fixtures';
import { TaskAssistantPage } from '../pages/task-assistant.page';
import { EvidencePage } from '../pages/evidence.page';
import { CameraPage } from '../pages/camera.page';

/**
 * 证据提交流程测试
 * 用例 ID: E2E-EXEC-004
 * 优先级：P0
 * 
 * 流程：原生拍摄 → 拍照/录像 → 添加水印 → 上传证据 → 提交成功
 */
test.describe('证据提交流程', () => {
  let taskPage: TaskAssistantPage;
  let evidencePage: EvidencePage;
  let cameraPage: CameraPage;

  test.beforeEach(async ({ page }) => {
    taskPage = new TaskAssistantPage(page);
    evidencePage = new EvidencePage(page);
    cameraPage = new CameraPage(page);
  });

  test('E2E-EXEC-004-01: 拍照上传证据', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 添加照片
    await evidencePage.addPhoto();
    
    // 3. 等待相机打开
    await cameraPage.waitForCameraReady();
    
    // 4. 拍照
    await cameraPage.takePhoto();
    
    // 5. 确认使用照片
    await cameraPage.confirm();
    
    // 6. 验证照片已添加
    const count = await evidencePage.getEvidenceCount();
    expect(count).toBeGreaterThan(0);
  });

  test('E2E-EXEC-004-02: 录像上传证据', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 添加视频
    await evidencePage.addVideo();
    
    // 3. 等待相机打开
    await cameraPage.waitForCameraReady();
    
    // 4. 切换到视频模式
    await cameraPage.switchToVideoMode();
    
    // 5. 开始录像
    await cameraPage.startRecording();
    
    // 6. 录像 2 秒
    await page.waitForTimeout(2000);
    
    // 7. 停止录像
    await cameraPage.stopRecording();
    
    // 8. 确认使用视频
    await cameraPage.confirm();
    
    // 9. 验证视频已添加
    const count = await evidencePage.getEvidenceCount();
    expect(count).toBeGreaterThan(0);
  });

  test('E2E-EXEC-004-03: 添加水印', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 添加照片
    await evidencePage.addPhoto();
    await cameraPage.waitForCameraReady();
    await cameraPage.takePhoto();
    await cameraPage.confirm();
    
    // 3. 开启水印
    await evidencePage.toggleWatermark(true);
    
    // 4. 验证水印预览
    const hasWatermark = await evidencePage.verifyWatermark();
    expect(hasWatermark).toBeTruthy();
  });

  test('E2E-EXEC-004-04: 填写证据描述', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 添加照片
    await evidencePage.addPhoto();
    await cameraPage.waitForCameraReady();
    await cameraPage.takePhoto();
    await cameraPage.confirm();
    
    // 3. 填写描述
    await evidencePage.fillDescription('任务执行现场照片');
    
    // 4. 验证描述已填写
    const description = await evidencePage.descriptionInput.inputValue();
    expect(description).toBe('任务执行现场照片');
  });

  test('E2E-EXEC-004-05: 提交证据成功', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 添加照片
    await evidencePage.addPhoto();
    await cameraPage.waitForCameraReady();
    await cameraPage.takePhoto();
    await cameraPage.confirm();
    
    // 3. 开启水印
    await evidencePage.toggleWatermark(true);
    
    // 4. 填写描述
    await evidencePage.fillDescription('任务执行现场照片');
    
    // 5. 等待上传完成
    await evidencePage.waitForUploadComplete();
    
    // 6. 提交证据
    await evidencePage.submit();
    
    // 7. 等待提交成功
    const success = await evidencePage.waitForSubmitSuccess();
    expect(success).toBeTruthy();
    
    // 8. 验证成功消息
    const message = await evidencePage.getSuccessMessage();
    expect(message).toContain('提交成功');
  });

  test('E2E-EXEC-004-06: 提交证据失败 - 未添加证据', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 不添加证据直接提交
    await evidencePage.submit();
    
    // 3. 验证错误提示
    const errorMessage = page.locator('.toast, .error-message').filter({ hasText: /请添加证据 | 至少上传/i });
    await errorMessage.waitFor({ state: 'visible', timeout: 3000 });
  });

  test('E2E-EXEC-004-07: 提交证据失败 - 未开启水印', async ({ page }) => {
    // 1. 进入证据提交页
    await evidencePage.goto('TASK-001');
    
    // 2. 添加照片但不添加水印
    await evidencePage.addPhoto();
    await cameraPage.waitForCameraReady();
    await cameraPage.takePhoto();
    await cameraPage.confirm();
    
    // 3. 关闭水印
    await evidencePage.toggleWatermark(false);
    
    // 4. 提交（应该失败或提示）
    await evidencePage.submit();
    
    // 5. 验证水印要求提示
    const warningMessage = page.locator('.toast, .warning-message').filter({ hasText: /需要水印 | 请开启/i });
    await warningMessage.waitFor({ state: 'visible', timeout: 3000 });
  });
});
