import { defineConfig, devices } from '@playwright/test';

/**
 * ClearSpring V3 小程序 E2E 测试配置
 */
export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false, // 顺序执行，避免状态冲突
  retries: 2,
  workers: 1, // 单 worker 保证测试顺序
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: process.env.HEADED !== 'true',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 }, // 手机屏幕尺寸
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
  outputDir: 'test-results/',
  preserveOutput: 'failures-only',
});
