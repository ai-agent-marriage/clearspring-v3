import { test, expect } from '../fixtures/test-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { ExecutorQualificationPage } from '../pages/executor-qualification.page';
import { ExecutorIncomePage } from '../pages/executor-income.page';

/**
 * P0 - 执行者端资质审核与收入管理流程
 * 测试用例：TC005
 * 流程：资质审核 → 审核状态 → 收入管理
 */
test.describe('P0 - 执行者端资质与收入', () => {
  let homePage: ExecutorHomePage;
  let qualificationPage: ExecutorQualificationPage;
  let incomePage: ExecutorIncomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    qualificationPage = new ExecutorQualificationPage(page);
    incomePage = new ExecutorIncomePage(page);
  });

  test('TC005 - 资质审核 → 审核状态 → 收入管理', async ({ page }) => {
    // 步骤 1: 执行者登录并进入首页
    test.step('执行者登录', async () => {
      await homePage.goto();
      await homePage.verifyHomePageLoaded();
      await page.screenshot({ path: 'test-results/tc005-executor-home.png' });
    });

    // 步骤 2: 进入资质管理页面
    test.step('进入资质管理', async () => {
      await homePage.goToQualification();
      await qualificationPage.viewQualificationStatus();
      await page.screenshot({ path: 'test-results/tc005-qualification.png' });
    });

    // 步骤 3: 查看审核状态
    test.step('查看审核状态', async () => {
      const status = await qualificationPage.viewAuditStatus();
      // [CLEANED] console.log('当前审核状态:', status);
      await page.screenshot({ path: 'test-results/tc005-audit-status.png' });
    });

    // 步骤 4: 进入收入管理页面
    test.step('进入收入管理', async () => {
      await homePage.goto();
      await homePage.goToIncome();
      await incomePage.viewIncomeSummary();
      await page.screenshot({ path: 'test-results/tc005-income.png' });
    });

    // 步骤 5: 验证收入数据
    test.step('验证收入数据', async () => {
      await incomePage.verifyIncomeData();
      await expect(incomePage.totalIncome).toBeVisible();
      await expect(incomePage.monthIncome).toBeVisible();
    });
  });

  test('TC005-ALT - 收入列表验证', async ({ page }) => {
    await homePage.goto();
    await homePage.goToIncome();
    
    // 验证收入列表
    const listVisible = await incomePage.viewIncomeList();
    expect(listVisible).toBe(true);
    
    // 验证收入项包含必要信息
    await expect(incomePage.incomeAmount).toBeVisible();
    await expect(incomePage.incomeDate).toBeVisible();
    await expect(incomePage.incomeStatus).toBeVisible();
    
    await page.screenshot({ path: 'test-results/tc005-alt-income-list.png' });
  });
});
