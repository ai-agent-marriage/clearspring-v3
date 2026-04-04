package com.ruoyi.qingru;

import com.ruoyi.qingru.service.StatsService;
import com.ruoyi.qingru.domain.StatsDashboard;
import com.ruoyi.qingru.domain.TrendData;
import com.ruoyi.qingru.domain.PieData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 数据统计服务测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/StatsServiceTest.java
 */
@SpringBootTest
public class StatsServiceTest {
    
    @Autowired
    private StatsService statsService;
    
    @Test
    public void testGetDashboard_Success() {
        // 测试获取仪表盘数据
        StatsDashboard dashboard = statsService.getDashboard(null, null);
        
        // 验证仪表盘对象不为空
        assertNotNull(dashboard);
        // 验证总用户数不为空
        assertNotNull(dashboard.getTotalUsers());
        // 验证总订单数不为空
        assertNotNull(dashboard.getTotalOrders());
        // 验证总金额不为空
        assertNotNull(dashboard.getTotalAmount());
    }
    
    @Test
    public void testGetOrderTrend_Success() {
        // 设置测试日期范围
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        // 获取订单趋势数据
        List<TrendData> trend = statsService.getOrderTrend(startDate, endDate, "day");
        
        // 验证趋势数据不为空
        assertNotNull(trend);
        // 验证趋势数据至少有一条记录
        assertTrue(trend.size() > 0);
    }
    
    @Test
    public void testGetSpeciesDistribution_Success() {
        // 获取物种分布数据
        List<PieData> distribution = statsService.getSpeciesDistribution();
        
        // 验证分布数据不为空
        assertNotNull(distribution);
        // 验证分布数据至少有一条记录
        assertTrue(distribution.size() > 0);
    }
    
    @Test
    public void testGetDashboard_WithDateRange() {
        // 测试带日期范围的仪表盘数据
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        StatsDashboard dashboard = statsService.getDashboard(startDate, endDate);
        
        assertNotNull(dashboard);
        assertTrue(dashboard.getTotalUsers() >= 0);
        assertTrue(dashboard.getTotalOrders() >= 0);
        assertTrue(dashboard.getTotalAmount() >= 0);
    }
    
    @Test
    public void testGetOrderTrend_Weekly() {
        // 测试按周获取趋势数据
        String startDate = "2026-03-01";
        String endDate = "2026-04-07";
        
        List<TrendData> trend = statsService.getOrderTrend(startDate, endDate, "week");
        
        assertNotNull(trend);
        assertTrue(trend.size() > 0);
    }
    
    @Test
    public void testGetOrderTrend_Monthly() {
        // 测试按月获取趋势数据
        String startDate = "2026-01-01";
        String endDate = "2026-04-07";
        
        List<TrendData> trend = statsService.getOrderTrend(startDate, endDate, "month");
        
        assertNotNull(trend);
        assertTrue(trend.size() > 0);
    }
}
