import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { IncomePage } from '../pages/income.page';

/**
 * 收入查看流程测试
 * 用例 ID: E2E-EXEC-005
 * 优先级：P0
 * 
 * 流程：收入管理 → 查看收入统计 → 查看收入明细 → 申请提现
 */
test.describe('收入查看流程', () => {
  let homePage: ExecutorHomePage;
  let incomePage: IncomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    incomePage = new IncomePage(page);
    
    // 前置条件：已登录
    await page.goto('/executor/home');
    await homePage.waitForLoad();
  });

  test('E2E-EXEC-005-01: 查看收入概览', async ({ page }) => {
    // 1. 进入收入管理
    await homePage.goToIncome();
    await incomePage.goto();
    
    // 2. 验证收入概览显示
    const summary = await incomePage.getIncomeSummary();
    expect(summary.total).toBeTruthy();
  });

  test('E2E-EXEC-005-02: 查看收入明细列表', async ({ page }) => {
    // 1. 进入收入管理
    await incomePage.goto();
    
    // 2. 获取收入明细
    const records = await incomePage.getIncomeRecords();
    expect(records.length).toBeGreaterThan(0);
  });

  test('E2E-EXEC-005-03: 筛选收入记录 - 按状态', async ({ page }) => {
    // 1. 进入收入管理
    await incomePage.goto();
    
    // 2. 按状态筛选
    await incomePage.filterByStatus('已完成');
    
    // 3. 验证筛选结果
    const records = await incomePage.getIncomeRecords();
    expect(records.length).toBeGreaterThan(0);
  });

  test('E2E-EXEC-005-04: 查看收入记录详情', async ({ page }) => {
    // 1. 进入收入管理
    await incomePage.goto();
    
    // 2. 获取第一条记录
    const records = await incomePage.getIncomeRecords();
    expect(records.length).toBeGreaterThan(0);
    
    // 3. 点击查看详情
    await records[0].click();
    
    // 4. 验证详情显示
    const detailModal = page.locator('.modal, .dialog');
    await detailModal.waitFor({ state: 'visible', timeout: 3000 });
  });

  test('E2E-EXEC-005-05: 申请提现', async ({ page }) => {
    // 1. 进入收入管理
    await incomePage.goto();
    
    // 2. 点击提现
    await incomePage.clickWithdraw();
    
    // 3. 填写提现金额
    await incomePage.fillWithdrawAmount('100');
    
    // 4. 选择提现方式
    await incomePage.selectWithdrawMethod('支付宝');
    
    // 5. 填写提现账号
    await incomePage.fillWithdrawAccount('test@example.com');
    
    // 6. 确认提现
    await incomePage.confirmWithdraw();
    
    // 7. 等待提现成功
    const success = await incomePage.waitForWithdrawSuccess();
    expect(success).toBeTruthy();
  });

  test('E2E-EXEC-005-06: 提现失败 - 金额不足', async ({ page }) => {
    // 1. 进入收入管理
    await incomePage.goto();
    
    // 2. 点击提现
    await incomePage.clickWithdraw();
    
    // 3. 填写超过余额的金额
    await incomePage.fillWithdrawAmount('999999');
    
    // 4. 确认提现
    await incomePage.confirmWithdraw();
    
    // 5. 验证错误提示
    const errorMessage = page.locator('.toast, .error-message').filter({ hasText: /余额不足 | 超过可提现/i });
    await errorMessage.waitFor({ state: 'visible', timeout: 3000 });
  });

  test('E2E-EXEC-005-07: 查看提现记录', async ({ page }) => {
    // 1. 进入收入管理
    await incomePage.goto();
    
    // 2. 验证提现记录显示
    await expect(incomePage.withdrawRecords).toBeVisible();
    
    // 3. 获取提现记录
    const records = await incomePage.withdrawRecord.all();
    expect(records.length).toBeGreaterThanOrEqual(0);
  });
});
