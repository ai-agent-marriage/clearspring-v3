import { Page, Locator } from '@playwright/test';

/**
 * 收入管理页面
 * 流程：收入管理 → 查看收入统计 → 查看收入明细 → 申请提现
 */
export class IncomePage {
  readonly page: Page;
  
  // 收入概览
  readonly incomeSummary: Locator;
  readonly totalIncome: Locator;
  readonly monthIncome: Locator;
  readonly pendingIncome: Locator;
  readonly withdrawnIncome: Locator;
  
  // 收入明细
  readonly incomeRecords: Locator;
  readonly incomeRecord: Locator;
  readonly recordAmount: Locator;
  readonly recordStatus: Locator;
  readonly recordDate: Locator;
  readonly recordOrder: Locator;
  
  // 筛选排序
  readonly dateFilter: Locator;
  readonly statusFilter: Locator;
  readonly sortByDate: Locator;
  readonly sortByAmount: Locator;
  
  // 提现功能
  readonly withdrawButton: Locator;
  readonly withdrawAmountInput: Locator;
  readonly withdrawMethod: Locator;
  readonly withdrawAccount: Locator;
  readonly confirmWithdrawButton: Locator;
  readonly withdrawSuccessToast: Locator;
  
  // 提现记录
  readonly withdrawRecords: Locator;
  readonly withdrawRecord: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 收入概览
    this.incomeSummary = page.locator('.income-summary');
    this.totalIncome = page.getByText(/总收入 | 累计收入/i);
    this.monthIncome = page.getByText(/本月收入 | 月收入/i);
    this.pendingIncome = page.getByText(/待结算 | 可提现/i);
    this.withdrawnIncome = page.getByText(/已提现 | 累计提现/i);
    
    // 收入明细
    this.incomeRecords = page.locator('.income-records, .record-list');
    this.incomeRecord = page.locator('.income-record, .record-item');
    this.recordAmount = page.locator('.record-amount, .amount');
    this.recordStatus = page.locator('.record-status, .status');
    this.recordDate = page.locator('.record-date, .date');
    this.recordOrder = page.locator('.record-order, .order-id');
    
    // 筛选排序
    this.dateFilter = page.getByRole('button', { name: /日期 | 时间/i });
    this.statusFilter = page.getByRole('button', { name: /状态 | 类型/i });
    this.sortByDate = page.getByRole('button', { name: /按日期/i });
    this.sortByAmount = page.getByRole('button', { name: /按金额/i });
    
    // 提现功能
    this.withdrawButton = page.getByRole('button', { name: /提现 | 申请提现/i });
    this.withdrawAmountInput = page.getByLabel(/提现金额/).or(page.getByPlaceholder(/请输入金额/));
    this.withdrawMethod = page.locator('.withdraw-method, .payment-method');
    this.withdrawAccount = page.getByLabel(/账号 | 账户/).or(page.getByPlaceholder(/请输入账号/));
    this.confirmWithdrawButton = page.getByRole('button', { name: /确认提现 | 确定/i });
    this.withdrawSuccessToast = page.locator('.toast, .success-message').filter({ hasText: /提现成功 | 申请已提交/i });
    
    // 提现记录
    this.withdrawRecords = page.locator('.withdraw-records, .withdraw-list');
    this.withdrawRecord = page.locator('.withdraw-record, .withdraw-item');
  }

  /**
   * 访问收入管理页
   */
  async goto() {
    await this.page.goto('/executor/income');
  }

  /**
   * 获取收入概览数据
   */
  async getIncomeSummary() {
    await this.incomeSummary.waitFor({ state: 'visible', timeout: 5000 });
    return {
      total: await this.totalIncome.textContent(),
      month: await this.monthIncome.textContent(),
      pending: await this.pendingIncome.textContent(),
      withdrawn: await this.withdrawnIncome.textContent(),
    };
  }

  /**
   * 获取收入明细列表
   */
  async getIncomeRecords() {
    await this.incomeRecords.waitFor({ state: 'visible', timeout: 5000 });
    return this.incomeRecord.all();
  }

  /**
   * 筛选收入记录
   */
  async filterByStatus(status: string) {
    await this.statusFilter.click();
    await this.page.getByText(status).click();
  }

  /**
   * 点击提现
   */
  async clickWithdraw() {
    await this.withdrawButton.click();
  }

  /**
   * 填写提现金额
   */
  async fillWithdrawAmount(amount: string) {
    await this.withdrawAmountInput.fill(amount);
  }

  /**
   * 选择提现方式
   */
  async selectWithdrawMethod(method: string) {
    await this.withdrawMethod.getByText(method).click();
  }

  /**
   * 填写提现账号
   */
  async fillWithdrawAccount(account: string) {
    await this.withdrawAccount.fill(account);
  }

  /**
   * 确认提现
   */
  async confirmWithdraw() {
    await this.confirmWithdrawButton.click();
  }

  /**
   * 等待提现成功
   */
  async waitForWithdrawSuccess() {
    await this.withdrawSuccessToast.waitFor({ state: 'visible', timeout: 10000 });
    return await this.withdrawSuccessToast.isVisible();
  }

  /**
   * 获取提现成功消息
   */
  async getWithdrawSuccessMessage() {
    await this.withdrawSuccessToast.waitFor({ state: 'visible', timeout: 10000 });
    return await this.withdrawSuccessToast.textContent();
  }
}
