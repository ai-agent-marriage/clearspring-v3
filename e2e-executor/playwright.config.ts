import { defineConfig, devices } from '@playwright/test';

/**
 * 执行者端 E2E 测试配置
 * 与 Agent A（祈福者视角）共享相同的配置结构
 */
export default defineConfig({
  testDir: './specs',
  
  // 超时设置
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // 失败重试
  retries: process.env.CI ? 2 : 0,
  
  // 并行执行
  workers: process.env.CI ? 1 : undefined,
  
  // 报告配置
  reporter: [
    ['html', { outputFolder: '../playwright-report-executor' }],
    ['list']
  ],
  
  // 共享配置
  use: {
    // 基础 URL（小程序测试环境）
    baseURL: process.env.BASE_URL || 'https://wx.qq.com',
    
    // 浏览器上下文选项
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // 模拟微信开发者工具环境
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    
    // 用户代理（模拟微信内置浏览器）
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0'
  },
  
  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        ...devices['iPhone 12']
      },
    },
    
    // 生产环境测试
    {
      name: 'production',
      use: { 
        ...devices['iPhone 12'],
        baseURL: 'https://wx.qq.com'
      },
    },
  ],
  
  // Web 服务器配置（本地开发时使用）
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
