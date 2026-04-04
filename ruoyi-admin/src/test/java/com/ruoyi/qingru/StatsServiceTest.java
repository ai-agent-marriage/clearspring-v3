package com.ruoyi.qingru;

import com.ruoyi.qingru.service.StatsService;
import com.ruoyi.qingru.domain.StatsDashboard;
import com.ruoyi.qingru.domain.TrendData;
import com.ruoyi.qingru.domain.PieData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 数据统计服务测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/StatsServiceTest.java
 * 
 * 测试范围:
 * - 仪表盘数据统计测试
 * - 订单趋势数据测试
 * - 物种分布数据测试
 * 
 * 用例数量：15 个
 */
@SpringBootTest
public class StatsServiceTest {
    
    @Autowired
    private StatsService statsService;
    
    // ==================== 仪表盘数据测试 (5 个用例) ====================
    
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
    public void testGetDashboard_ActiveVolunteers() {
        // 测试活跃志愿者数
        StatsDashboard dashboard = statsService.getDashboard(null, null);
        
        assertNotNull(dashboard);
        assertNotNull(dashboard.getActiveVolunteers());
        assertTrue(dashboard.getActiveVolunteers() >= 0);
    }
    
    @Test
    public void testGetDashboard_TotalOrgs() {
        // 测试总机构数
        StatsDashboard dashboard = statsService.getDashboard(null, null);
        
        assertNotNull(dashboard);
        assertNotNull(dashboard.getTotalOrgs());
        assertTrue(dashboard.getTotalOrgs() >= 0);
    }
    
    @Test
    public void testGetDashboard_TotalSpecies() {
        // 测试总物种数
        StatsDashboard dashboard = statsService.getDashboard(null, null);
        
        assertNotNull(dashboard);
        assertNotNull(dashboard.getTotalSpecies());
        assertTrue(dashboard.getTotalSpecies() >= 0);
    }
    
    // ==================== 订单趋势数据测试 (5 个用例) ====================
    
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
    
    @Test
    public void testGetOrderTrend_DataFields() {
        // 测试趋势数据字段完整性
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        List<TrendData> trend = statsService.getOrderTrend(startDate, endDate, "day");
        
        assertNotNull(trend);
        if (!trend.isEmpty()) {
            TrendData first = trend.get(0);
            assertNotNull(first.getDate());
            assertNotNull(first.getOrders());
            assertNotNull(first.getAmount());
        }
    }
    
    @Test
    public void testGetOrderTrend_ChronologicalOrder() {
        // 测试趋势数据按时间顺序排列
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        List<TrendData> trend = statsService.getOrderTrend(startDate, endDate, "day");
        
        assertNotNull(trend);
        if (trend.size() > 1) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            for (int i = 1; i < trend.size(); i++) {
                LocalDate prevDate = LocalDate.parse(trend.get(i - 1).getDate(), formatter);
                LocalDate currDate = LocalDate.parse(trend.get(i).getDate(), formatter);
                assertTrue(!prevDate.isAfter(currDate), "趋势数据应按时间顺序排列");
            }
        }
    }
    
    // ==================== 物种分布数据测试 (5 个用例) ====================
    
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
    public void testGetSpeciesDistribution_DataFields() {
        // 测试分布数据字段完整性
        List<PieData> distribution = statsService.getSpeciesDistribution();
        
        assertNotNull(distribution);
        if (!distribution.isEmpty()) {
            PieData first = distribution.get(0);
            assertNotNull(first.getName());
            assertNotNull(first.getValue());
        }
    }
    
    @Test
    public void testGetSpeciesDistribution_PercentageCalculation() {
        // 测试百分比计算
        List<PieData> distribution = statsService.getSpeciesDistribution();
        
        assertNotNull(distribution);
        if (!distribution.isEmpty()) {
            for (PieData item : distribution) {
                assertTrue(item.getPercentage() >= 0);
                assertTrue(item.getPercentage() <= 100);
            }
        }
    }
    
    @Test
    public void testGetSpeciesDistribution_DescendingOrder() {
        // 测试分布数据按数量降序排列
        List<PieData> distribution = statsService.getSpeciesDistribution();
        
        assertNotNull(distribution);
        if (distribution.size() > 1) {
            for (int i = 1; i < distribution.size(); i++) {
                assertTrue(
                    distribution.get(i - 1).getValue() >= distribution.get(i).getValue(),
                    "物种分布数据应按数量降序排列"
                );
            }
        }
    }
    
    @Test
    public void testGetSpeciesDistribution_TotalPercentage() {
        // 测试百分比总和约为 100%
        List<PieData> distribution = statsService.getSpeciesDistribution();
        
        assertNotNull(distribution);
        if (!distribution.isEmpty()) {
            double totalPercentage = distribution.stream()
                .mapToDouble(PieData::getPercentage)
                .sum();
            
            assertTrue(totalPercentage >= 99.0 && totalPercentage <= 101.0, 
                "百分比总和应在 99%-101% 范围内");
        }
    }
}
