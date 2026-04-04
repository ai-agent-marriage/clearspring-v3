package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 后台管理服务单元测试
 * 测试后台管理仪表盘、趋势分析等功能
 */
@SpringBootTest
public class AdminServiceTest {

    @Autowired
    private AdminService adminService;

    /**
     * 测试成功获取后台管理仪表盘
     * 验证可以获取后台完整管理信息
     */
    @Test
    public void testGetAdminDashboard_Success() {
        AdminDashboard dashboard = adminService.getAdminDashboard();

        assertNotNull(dashboard, "仪表盘对象不应为空");
        assertNotNull(dashboard.getTotalUsers(), "总用户数不应为空");
        assertNotNull(dashboard.getDailyActiveUsers(), "日活用户数不应为空");
        assertNotNull(dashboard.getTotalOrders(), "总订单数不应为空");
    }

    /**
     * 测试获取趋势数据
     * 验证可以获取指定指标的趋势数据
     */
    @Test
    public void testGetTrend_Success() {
        String metric = "orders";
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        List<TrendData> trend = adminService.getTrend(metric, startDate, endDate);

        assertNotNull(trend, "趋势数据列表不应为空");
        assertTrue(trend.size() > 0, "趋势数据应包含至少一条记录");
    }

    /**
     * 测试获取用户增长趋势
     * 验证用户增长趋势数据正确
     */
    @Test
    public void testGetUserGrowthTrend() {
        String metric = "users";
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        List<TrendData> trend = adminService.getTrend(metric, startDate, endDate);

        assertNotNull(trend, "用户增长趋势数据不应为空");
        // 验证趋势数据结构
        trend.forEach(data -> {
            assertNotNull(data.getDate(), "日期不应为空");
            assertNotNull(data.getValue(), "数值不应为空");
        });
    }

    /**
     * 测试获取订单金额趋势
     * 验证订单金额趋势数据正确
     */
    @Test
    public void testGetOrderAmountTrend() {
        String metric = "amount";
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        List<TrendData> trend = adminService.getTrend(metric, startDate, endDate);

        assertNotNull(trend, "订单金额趋势数据不应为空");
        // 验证金额数据为非负数
        trend.forEach(data -> {
            assertTrue(data.getValue() >= 0, "金额应为非负数");
        });
    }

    /**
     * 测试获取志愿者增长趋势
     * 验证志愿者增长趋势数据正确
     */
    @Test
    public void testGetVolunteerGrowthTrend() {
        String metric = "volunteers";
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        List<TrendData> trend = adminService.getTrend(metric, startDate, endDate);

        assertNotNull(trend, "志愿者增长趋势数据不应为空");
    }

    /**
     * 测试仪表盘数据完整性
     * 验证仪表盘包含所有必要字段
     */
    @Test
    public void testDashboardDataCompleteness() {
        AdminDashboard dashboard = adminService.getAdminDashboard();

        // 验证所有关键字段都存在
        assertNotNull(dashboard.getTotalUsers(), "总用户数不应为空");
        assertNotNull(dashboard.getDailyActiveUsers(), "日活用户数不应为空");
        assertNotNull(dashboard.getTotalOrders(), "总订单数不应为空");
        assertNotNull(dashboard.getTotalOrgs(), "机构总数不应为空");
        assertNotNull(dashboard.getTotalVolunteers(), "志愿者总数不应为空");
        assertNotNull(dashboard.getTotalAmount(), "总金额不应为空");
    }

    /**
     * 测试仪表盘数据合理性
     * 验证仪表盘数据在合理范围内
     */
    @Test
    public void testDashboardDataValidity() {
        AdminDashboard dashboard = adminService.getAdminDashboard();

        // 验证所有数值字段都是非负数
        assertTrue(dashboard.getTotalUsers() >= 0, "总用户数应为非负数");
        assertTrue(dashboard.getDailyActiveUsers() >= 0, "日活用户数应为非负数");
        assertTrue(dashboard.getTotalOrders() >= 0, "总订单数应为非负数");
        assertTrue(dashboard.getTotalOrgs() >= 0, "机构总数应为非负数");
        assertTrue(dashboard.getTotalVolunteers() >= 0, "志愿者总数应为非负数");
        assertTrue(dashboard.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) >= 0, "总金额应为非负数");
    }

    /**
     * 测试获取实时数据
     * 验证实时数据更新正常
     */
    @Test
    public void testGetRealTimeData() {
        AdminDashboard dashboard = adminService.getAdminDashboard();

        // 验证实时数据字段
        assertNotNull(dashboard.getOnlineUsers(), "在线用户数不应为空");
        assertTrue(dashboard.getOnlineUsers() >= 0, "在线用户数应为非负数");
    }

    /**
     * 测试获取告警信息
     * 验证告警信息正常显示
     */
    @Test
    public void testGetAlerts() {
        AdminDashboard dashboard = adminService.getAdminDashboard();

        // 验证告警列表存在（可以为空）
        assertNotNull(dashboard.getAlerts(), "告警列表不应为空");
    }
}
