import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { TaskAssistantPage } from '../pages/task-assistant.page';

/**
 * 任务执行流程测试
 * 用例 ID: E2E-EXEC-003
 * 优先级：P0
 * 
 * 流程：任务助手 → 查看任务详情 → 导航到地点 → 开始任务
 */
test.describe('任务执行流程', () => {
  let homePage: ExecutorHomePage;
  let taskPage: TaskAssistantPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    taskPage = new TaskAssistantPage(page);
    
    // 前置条件：已登录且有进行中任务
    await page.goto('/executor/home');
    await homePage.waitForLoad();
  });

  test('E2E-EXEC-003-01: 查看任务列表', async ({ page }) => {
    // 1. 进入任务助手
    await homePage.goToTaskAssistant();
    await taskPage.goto();
    
    // 2. 验证任务列表加载
    const tasks = await taskPage.getTaskCards();
    expect(tasks.length).toBeGreaterThan(0);
  });

  test('E2E-EXEC-003-02: 查看任务详情', async ({ page }) => {
    // 1. 进入任务助手
    await taskPage.goto();
    
    // 2. 查看第一个任务详情
    await taskPage.viewTaskDetail(0);
    
    // 3. 验证详情内容
    await expect(taskPage.taskDetailContent).toBeVisible();
    
    // 4. 关闭详情
    await taskPage.closeDetail();
  });

  test('E2E-EXEC-003-03: 查看进行中的任务', async ({ page }) => {
    // 1. 进入任务助手
    await taskPage.goto();
    
    // 2. 获取进行中的任务
    const activeTask = await taskPage.getActiveTask();
    expect(activeTask).toBeTruthy();
  });

  test('E2E-EXEC-003-04: 点击导航到任务地点', async ({ page }) => {
    // 1. 进入任务助手
    await taskPage.goto();
    
    // 2. 点击导航按钮
    await taskPage.navigateToLocation();
    
    // 3. 验证地图或导航应用打开
    // 由于导航会跳转到外部应用，这里只验证点击成功
    await expect(taskPage.navigateButton).toBeVisible();
  });

  test('E2E-EXEC-003-05: 开始任务', async ({ page }) => {
    // 1. 进入任务助手
    await taskPage.goto();
    
    // 2. 开始任务
    await taskPage.startTask();
    
    // 3. 等待任务开始成功
    await taskPage.waitForTaskStarted();
    
    // 4. 验证任务状态变更
    const taskStarted = await page.locator('.task-status').filter({ hasText: /进行中/i }).isVisible();
    expect(taskStarted).toBeTruthy();
  });

  test('E2E-EXEC-003-06: 开始任务后前往提交证据', async ({ page }) => {
    // 1. 进入任务助手
    await taskPage.goto();
    
    // 2. 开始任务
    await taskPage.startTask();
    await taskPage.waitForTaskStarted();
    
    // 3. 点击提交证据
    await taskPage.goToSubmitEvidence();
    
    // 4. 验证跳转到证据提交页
    await expect(page).toHaveURL(/.*evidence.*/);
  });

  test('E2E-EXEC-003-07: 完成任务', async ({ page }) => {
    // 1. 进入任务助手
    await taskPage.goto();
    
    // 2. 完成任务（需要先开始）
    await taskPage.startTask();
    await taskPage.waitForTaskStarted();
    
    // 3. 点击完成任务
    await taskPage.completeTaskButton.click();
    
    // 4. 等待确认弹窗并确认
    const confirmButton = page.getByRole('button', { name: /确认完成 | 确定/i });
    await confirmButton.click();
    
    // 5. 验证任务完成提示
    const successToast = page.locator('.toast').filter({ hasText: /任务已完成/i });
    await successToast.waitFor({ state: 'visible', timeout: 5000 });
  });
});
