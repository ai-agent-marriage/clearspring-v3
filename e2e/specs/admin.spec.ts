import { test, expect } from '../fixtures/test-fixtures';

test.describe('P1 - 管理端流程', () => {
  test('TC007 - PC 管理后台登录：打开后台 → 输入账号密码 → 登录成功', async ({ page }) => {
    // 打开管理后台
    await page.goto('/admin/login');
    
    // 输入账号
    await page.getByPlaceholder(/账号/i).fill('admin');
    
    // 输入密码
    await page.getByPlaceholder(/密码/i).fill('admin123');
    
    // 点击登录
    await page.getByRole('button', { name: /登录/i }).click();
    
    // 验证登录成功，跳转到管理后台首页
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
  });

  test('TC008 - 订单管理：订单列表 → 筛选订单 → 查看订单详情', async ({ page }) => {
    // 先登录管理后台
    await page.goto('/admin/login');
    await page.getByPlaceholder(/账号/i).fill('admin');
    await page.getByPlaceholder(/密码/i).fill('admin123');
    await page.getByRole('button', { name: /登录/i }).click();
    
    // 进入订单管理
    await page.goto('/admin/orders');
    
    // 验证订单列表可见
    const orderList = page.getByTestId('admin-order-list');
    await orderList.waitFor({ state: 'visible' });
    expect(await orderList.isVisible()).toBe(true);
    
    // 筛选订单（按状态筛选）
    await page.getByRole('combobox', { name: /订单状态/i }).selectOption('pending');
    
    // 等待筛选结果
    await page.waitForTimeout(1000);
    
    // 选择第一个订单查看详情
    const orderItems = page.getByTestId('admin-order-item');
    const firstOrder = orderItems.first();
    await firstOrder.click();
    
    // 验证订单详情可见
    await expect(page.getByTestId('order-detail-modal')).toBeVisible();
  });
});
