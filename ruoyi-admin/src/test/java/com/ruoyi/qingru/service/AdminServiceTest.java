package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.TrendData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 后台管理服务测试
 */
@SpringBootTest
public class AdminServiceTest {
    
    @Autowired
    private AdminService adminService;
    
    @Test
    public void testGetAdminDashboard() {
        // 测试获取管理仪表盘数据
        AdminDashboard dashboard = adminService.getAdminDashboard();
        
        assertNotNull(dashboard);
        assertNotNull(dashboard.getTotalUsers());
        assertNotNull(dashboard.getDailyActiveUsers());
        assertNotNull(dashboard.getTotalOrders());
        assertNotNull(dashboard.getTotalRevenue());
        assertNotNull(dashboard.getOrderCompletionRate());
        assertNotNull(dashboard.getContentAuditRate());
    }
    
    @Test
    public void testGetTrend() {
        // 测试获取数据趋势
        List<TrendData> trend = adminService.getTrend("users", "2026-04-01", "2026-04-30");
        
        assertNotNull(trend);
        assertTrue(trend.size() > 0, "趋势数据不应为空");
        
        TrendData first = trend.get(0);
        assertNotNull(first.getDate());
        assertNotNull(first.getValue());
        assertEquals("users", first.getMetric());
    }
    
    @Test
    public void testTrendDataValueRange() {
        // 测试趋势数据值在合理范围
        List<TrendData> trend = adminService.getTrend("orders", "2026-04-01", "2026-04-30");
        
        for (TrendData data : trend) {
            assertNotNull(data.getValue());
            if (data.getValue() instanceof BigDecimal) {
                assertTrue(((BigDecimal) data.getValue()).compareTo(BigDecimal.ZERO) >= 0);
            } else if (data.getValue() instanceof Integer) {
                assertTrue((Integer) data.getValue() >= 0);
            }
        }
    }
}
