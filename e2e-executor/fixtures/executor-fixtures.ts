import { test as base, expect } from '@playwright/test';

/**
 * 执行者端测试数据 fixtures
 * 与 Agent A 共享测试数据格式
 */

// 执行者测试账号
export const EXECUTOR_ACCOUNTS = {
  valid: {
    phone: '13800138001',
    code: '123456', // 模拟验证码
    name: '测试执行者',
    id: 'executor_001',
    status: 'verified', // 已认证
    qualificationStatus: 'active', // 资质正常
  },
  unverified: {
    phone: '13800138002',
    code: '123456',
    name: '未认证执行者',
    id: 'executor_002',
    status: 'pending', // 待认证
    qualificationStatus: 'pending', // 资质审核中
  },
  suspended: {
    phone: '13800138003',
    code: '123456',
    name: '已冻结执行者',
    id: 'executor_003',
    status: 'suspended', // 已冻结
    qualificationStatus: 'inactive', // 资质失效
  },
};

// 订单测试数据
export const ORDER_DATA = {
  available: {
    orderId: 'ORD-20260412-001',
    title: '祈福服务订单',
    location: '北京市朝阳区某某路 1 号',
    price: 299,
    distance: '2.5km',
    status: 'available',
    createdAt: '2026-04-12T10:00:00+08:00',
  },
  grabbed: {
    orderId: 'ORD-20260412-002',
    title: '祈福服务订单',
    location: '北京市海淀区某某路 2 号',
    price: 399,
    distance: '5.0km',
    status: 'grabbed',
    grabbedAt: '2026-04-12T11:00:00+08:00',
  },
};

// 任务测试数据
export const TASK_DATA = {
  active: {
    taskId: 'TASK-20260412-001',
    orderId: 'ORD-20260412-001',
    title: '祈福仪式执行',
    location: {
      address: '北京市朝阳区某某路 1 号',
      latitude: 39.9042,
      longitude: 116.4074,
    },
    status: 'in_progress',
    startedAt: '2026-04-12T12:00:00+08:00',
  },
  completed: {
    taskId: 'TASK-20260412-002',
    orderId: 'ORD-20260412-002',
    title: '祈福仪式执行',
    location: {
      address: '北京市海淀区某某路 2 号',
      latitude: 39.9087,
      longitude: 116.3975,
    },
    status: 'completed',
    evidenceSubmitted: true,
  },
};

// 证据测试数据
export const EVIDENCE_DATA = {
  photo: {
    type: 'photo',
    count: 3,
    watermark: true,
    uploaded: true,
  },
  video: {
    type: 'video',
    duration: 30, // 秒
    watermark: true,
    uploaded: true,
  },
};

// 收入测试数据
export const INCOME_DATA = {
  summary: {
    totalIncome: 5680,
    monthIncome: 1200,
    pendingWithdrawal: 800,
    withdrawn: 4480,
  },
  records: [
    {
      id: 'INC-001',
      orderId: 'ORD-20260410-001',
      amount: 299,
      status: 'completed',
      date: '2026-04-10',
    },
    {
      id: 'INC-002',
      orderId: 'ORD-20260411-001',
      amount: 399,
      status: 'completed',
      date: '2026-04-11',
    },
    {
      id: 'INC-003',
      orderId: 'ORD-20260412-001',
      amount: 502,
      status: 'pending',
      date: '2026-04-12',
    },
  ],
};

// 资质测试数据
export const QUALIFICATION_DATA = {
  active: {
    status: 'active',
    level: 'advanced',
    expiresAt: '2027-04-12',
    certificates: ['certificate_001', 'certificate_002'],
  },
  expiring: {
    status: 'expiring',
    level: 'basic',
    expiresAt: '2026-05-12',
    certificates: ['certificate_001'],
  },
  expired: {
    status: 'expired',
    level: 'none',
    expiresAt: '2026-01-12',
    certificates: [],
  },
};

// 消息测试数据
export const MESSAGE_DATA = {
  notifications: [
    {
      id: 'MSG-001',
      type: 'order',
      title: '新订单提醒',
      content: '您有一个新的祈福订单待抢',
      read: false,
      createdAt: '2026-04-12T10:00:00+08:00',
    },
    {
      id: 'MSG-002',
      type: 'system',
      title: '系统通知',
      content: '您的资质即将到期，请及时更新',
      read: false,
      createdAt: '2026-04-12T09:00:00+08:00',
    },
  ],
};

// 设置测试数据
export const SETTINGS_DATA = {
  privacy: {
    showPhone: false,
    showLocation: true,
    allowNotifications: true,
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
  },
  notifications: {
    orderAlert: true,
    systemAlert: true,
    marketingAlert: false,
  },
};

// 定义测试上下文类型
export interface TestContext {
  executorId: string;
  authToken: string;
  orderId?: string;
  taskId?: string;
}

// 扩展 Playwright test
export const test = base.extend<TestContext>({
  executorId: async ({}, use) => {
    await use(EXECUTOR_ACCOUNTS.valid.id);
  },
  authToken: async ({}, use) => {
    // 模拟认证 token
    await use('mock_auth_token_' + Date.now());
  },
});

export { expect };
