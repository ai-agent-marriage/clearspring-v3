/**
 * Executor Home 执行者首页页面单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Executor Home 执行者首页页面测试', () => {
  let page;

  beforeEach(() => {
    vi.clearAllMocks();
    page = null;
  });

  describe('页面数据', () => {
    it('应该初始化 metrics 数据', () => {
      page = getExecutorHomePage();
      expect(page.data.metrics).toBeDefined();
      expect(page.data.metrics).toHaveProperty('pendingTasks');
      expect(page.data.metrics).toHaveProperty('todayAppointments');
      expect(page.data.metrics).toHaveProperty('pendingPayments');
      expect(page.data.metrics).toHaveProperty('totalCompleted');
    });

    it('应该初始化 todos 数据', () => {
      page = getExecutorHomePage();
      expect(page.data.todos).toBeDefined();
      expect(page.data.todos.length).toBeGreaterThan(0);
    });

    it('todo 应该包含 id、title、time、type 字段', () => {
      page = getExecutorHomePage();
      const todo = page.data.todos[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('time');
      expect(todo).toHaveProperty('type');
    });

    it('todo type 应该是有效值', () => {
      page = getExecutorHomePage();
      const validTypes = ['urgent', 'normal', 'low'];
      page.data.todos.forEach(todo => {
        expect(validTypes).toContain(todo.type);
      });
    });
  });

  describe('页面生命周期', () => {
    it('应该定义 onLoad 方法', () => {
      page = getExecutorHomePage();
      expect(page.onLoad).toBeDefined();
      expect(typeof page.onLoad).toBe('function');
    });

    it('应该定义 onShow 方法', () => {
      page = getExecutorHomePage();
      expect(page.onShow).toBeDefined();
      expect(typeof page.onShow).toBe('function');
    });
  });

  describe('页面导航事件', () => {
    it('onOrderManage 应该跳转到订单大厅', () => {
      page = getExecutorHomePage();
      page.onOrderManage();
      
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/executor-order-hall/hall'
      });
    });

    it('onQualification 应该跳转到资质审核', () => {
      page = getExecutorHomePage();
      page.onQualification();
      
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/executor-qualification/qualification'
      });
    });
  });

  describe('功能按钮事件', () => {
    it('onFinance 应该显示开发中提示', () => {
      page = getExecutorHomePage();
      page.onFinance();
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '功能开发中',
        icon: 'none'
      });
    });

    it('onCompliance 应该显示开发中提示', () => {
      page = getExecutorHomePage();
      page.onCompliance();
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '功能开发中',
        icon: 'none'
      });
    });

    it('onViewAll 应该显示提示', () => {
      page = getExecutorHomePage();
      page.onViewAll();
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '查看全部',
        icon: 'none'
      });
    });

    it('onViewAsBeliever 应该显示切换视角提示', () => {
      page = getExecutorHomePage();
      page.onViewAsBeliever();
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '切换视角',
        icon: 'none'
      });
    });
  });

  describe('待办处理', () => {
    it('onHandleTodo 应该显示待办标题', () => {
      page = getExecutorHomePage();
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      };
      
      page.onHandleTodo(mockEvent);
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '处理：法会场地确认',
        icon: 'none'
      });
    });

    it('onHandleTodo 应该能处理不同索引的待办', () => {
      page = getExecutorHomePage();
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 1
          }
        }
      };
      
      page.onHandleTodo(mockEvent);
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '处理：义工审核 (8 名)',
        icon: 'none'
      });
    });
  });

  describe('下拉刷新', () => {
    it('onPullDownRefresh 应该停止刷新', () => {
      page = getExecutorHomePage();
      page.onPullDownRefresh();
      
      expect(wx.stopPullDownRefresh).toHaveBeenCalled();
    });
  });
});

function getExecutorHomePage() {
  let capturedConfig = null;
  
  const originalPage = global.Page;
  global.Page = vi.fn((config) => {
    capturedConfig = config;
    return config;
  });
  
  delete require.cache[require.resolve('../../pages/executor-home/home.js')];
  require('../../pages/executor-home/home.js');
  
  global.Page = originalPage;
  
  return capturedConfig;
}
