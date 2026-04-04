package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.StatsOverview;
import com.ruoyi.qingru.entity.TodoItem;
import com.ruoyi.qingru.service.AdminDashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 管理后台仪表盘服务单元测试
 * 测试仪表盘数据、概览统计、待办事项等功能
 */
@SpringBootTest
public class AdminDashboardServiceTest {

    @Autowired
    private AdminDashboardService adminDashboardService;

    /**
     * 测试成功获取仪表盘数据
     * 验证可以获取完整的仪表盘信息
     */
    @Test
    public void testGetDashboard_Success() {
        AdminDashboard dashboard = adminDashboardService.getDashboard();

        assertNotNull(dashboard, "仪表盘对象不应为空");
        assertNotNull(dashboard.getTotalUsers(), "总用户数不应为空");
        assertNotNull(dashboard.getDailyActiveUsers(), "日活用户数不应为空");
        assertNotNull(dashboard.getTotalOrders(), "总订单数不应为空");
    }

    /**
     * 测试仪表盘数据完整性
     * 验证仪表盘包含所有必要字段
     */
    @Test
    public void testDashboardDataCompleteness() {
        AdminDashboard dashboard = adminDashboardService.getDashboard();

        assertNotNull(dashboard.getTotalUsers(), "总用户数不应为空");
        assertNotNull(dashboard.getDailyActiveUsers(), "日活用户数不应为空");
        assertNotNull(dashboard.getTotalOrders(), "总订单数不应为空");
        assertNotNull(dashboard.getTotalRevenue(), "总营收不应为空");
        assertNotNull(dashboard.getOrderCompletionRate(), "订单完成率不应为空");
        assertNotNull(dashboard.getContentAuditRate(), "内容审核通过率不应为空");
    }

    /**
     * 测试仪表盘数据合理性
     * 验证仪表盘数据在合理范围内
     */
    @Test
    public void testDashboardDataValidity() {
        AdminDashboard dashboard = adminDashboardService.getDashboard();

        assertTrue(dashboard.getTotalUsers() >= 0, "总用户数应为非负数");
        assertTrue(dashboard.getDailyActiveUsers() >= 0, "日活用户数应为非负数");
        assertTrue(dashboard.getTotalOrders() >= 0, "总订单数应为非负数");
        assertTrue(dashboard.getTotalRevenue().compareTo(java.math.BigDecimal.ZERO) >= 0, "总营收应为非负数");
        assertTrue(dashboard.getOrderCompletionRate().compareTo(java.math.BigDecimal.ZERO) >= 0, "订单完成率应为非负数");
        assertTrue(dashboard.getContentAuditRate().compareTo(java.math.BigDecimal.ZERO) >= 0, "内容审核通过率应为非负数");
    }

    /**
     * 测试成功获取概览统计
     * 验证可以获取完整的概览信息
     */
    @Test
    public void testGetOverview_Success() {
        StatsOverview overview = adminDashboardService.getOverview();

        assertNotNull(overview, "概览对象不应为空");
        assertNotNull(overview.getTotalUsers(), "总用户数不应为空");
        assertNotNull(overview.getTotalOrders(), "总订单数不应为空");
    }

    /**
     * 测试概览统计数据完整性
     * 验证概览包含所有必要字段
     */
    @Test
    public void testOverviewDataCompleteness() {
        StatsOverview overview = adminDashboardService.getOverview();

        assertNotNull(overview.getTotalUsers(), "总用户数不应为空");
        assertNotNull(overview.getTotalOrders(), "总订单数不应为空");
        assertNotNull(overview.getTotalRevenue(), "总营收不应为空");
        assertNotNull(overview.getTodayNewUsers(), "今日新增用户不应为空");
        assertNotNull(overview.getTodayOrders(), "今日订单数不应为空");
        assertNotNull(overview.getTodayRevenue(), "今日营收不应为空");
        assertNotNull(overview.getActiveVolunteers(), "活跃志愿者数不应为空");
        assertNotNull(overview.getPendingTodos(), "待处理事项数不应为空");
    }

    /**
     * 测试概览统计数据合理性
     * 验证概览数据在合理范围内
     */
    @Test
    public void testOverviewDataValidity() {
        StatsOverview overview = adminDashboardService.getOverview();

        assertTrue(overview.getTotalUsers() >= 0, "总用户数应为非负数");
        assertTrue(overview.getTotalOrders() >= 0, "总订单数应为非负数");
        assertTrue(overview.getTotalRevenue().compareTo(java.math.BigDecimal.ZERO) >= 0, "总营收应为非负数");
        assertTrue(overview.getTodayNewUsers() >= 0, "今日新增用户应为非负数");
        assertTrue(overview.getTodayOrders() >= 0, "今日订单数应为非负数");
        assertTrue(overview.getTodayRevenue().compareTo(java.math.BigDecimal.ZERO) >= 0, "今日营收应为非负数");
        assertTrue(overview.getActiveVolunteers() >= 0, "活跃志愿者数应为非负数");
        assertTrue(overview.getPendingTodos() >= 0, "待处理事项数应为非负数");
    }

    /**
     * 测试成功获取待办事项列表
     * 验证可以获取待办事项
     */
    @Test
    public void testGetTodos_Success() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        assertNotNull(todos, "待办事项列表不应为空");
    }

    /**
     * 测试待办事项数据结构
     * 验证待办事项包含必要字段
     */
    @Test
    public void testTodoItemStructure() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        if (!todos.isEmpty()) {
            TodoItem todo = todos.get(0);
            assertNotNull(todo.getId(), "待办 ID 不应为空");
            assertNotNull(todo.getTitle(), "待办标题不应为空");
            assertNotNull(todo.getType(), "待办类型不应为空");
            assertNotNull(todo.getStatus(), "待办状态不应为空");
        }
    }

    /**
     * 测试待办事项类型
     * 验证待办事项类型在有效范围内
     */
    @Test
    public void testTodoItemTypes() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        for (TodoItem todo : todos) {
            assertTrue(todo.getType() >= 1 && todo.getType() <= 4, 
                "待办类型应在 1-4 范围内：1-用户反馈 2-内容审核 3-订单处理 4-系统通知");
        }
    }

    /**
     * 测试待办事项优先级
     * 验证待办事项优先级在有效范围内
     */
    @Test
    public void testTodoItemPriority() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        for (TodoItem todo : todos) {
            assertTrue(todo.getPriority() >= 1 && todo.getPriority() <= 3, 
                "待办优先级应在 1-3 范围内：1-低 2-中 3-高");
        }
    }

    /**
     * 测试待办事项状态
     * 验证待办事项状态在有效范围内
     */
    @Test
    public void testTodoItemStatus() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        for (TodoItem todo : todos) {
            assertTrue(todo.getStatus() >= 0 && todo.getStatus() <= 2, 
                "待办状态应在 0-2 范围内：0-待处理 1-处理中 2-已完成");
        }
    }

    /**
     * 测试仪表盘和概览数据一致性
     * 验证两个接口的总用户数一致
     */
    @Test
    public void testDashboardAndOverviewConsistency() {
        AdminDashboard dashboard = adminDashboardService.getDashboard();
        StatsOverview overview = adminDashboardService.getOverview();

        assertEquals(dashboard.getTotalUsers().longValue(), overview.getTotalUsers(), 
            "仪表盘和概览的总用户数应一致");
    }

    /**
     * 测试获取待办事项数量
     * 验证待办事项数量合理
     */
    @Test
    public void testTodosCount() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        assertTrue(todos.size() >= 0, "待办事项数量应为非负数");
        assertTrue(todos.size() <= 100, "待办事项数量不应超过 100");
    }

    /**
     * 测试待办事项创建时间
     * 验证待办事项创建时间有效
     */
    @Test
    public void testTodoCreateTime() {
        List<TodoItem> todos = adminDashboardService.getTodos();

        for (TodoItem todo : todos) {
            assertNotNull(todo.getCreateTime(), "待办创建时间不应为空");
        }
    }
}
