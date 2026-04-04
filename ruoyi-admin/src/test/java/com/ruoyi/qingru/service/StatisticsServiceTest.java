package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.PlatformStatistics;
import com.ruoyi.qingru.entity.Statistics;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 统计服务测试
 */
@SpringBootTest
public class StatisticsServiceTest {
    
    @Autowired
    private StatisticsService statisticsService;
    
    @Test
    public void testGetOrgStatistics() {
        // 测试获取机构统计数据
        Statistics stats = statisticsService.getOrgStatistics(1L, "2026-04-01", "2026-04-30");
        
        assertNotNull(stats);
        assertEquals(1L, stats.getOrgId());
        assertNotNull(stats.getTotalOrders());
        assertNotNull(stats.getTotalAmount());
        assertNotNull(stats.getTotalVolunteers());
        assertNotNull(stats.getActiveVolunteers());
        assertNotNull(stats.getComplianceRate());
        assertNotNull(stats.getStatisticsDate());
    }
    
    @Test
    public void testGetPlatformStatistics() {
        // 测试获取平台统计数据
        PlatformStatistics stats = statisticsService.getPlatformStatistics("2026-04-01", "2026-04-30");
        
        assertNotNull(stats);
        assertNotNull(stats.getTotalUsers());
        assertNotNull(stats.getDailyActiveUsers());
        assertNotNull(stats.getTotalOrders());
        assertNotNull(stats.getTotalRevenue());
        assertNotNull(stats.getOrderCompletionRate());
        assertNotNull(stats.getContentAuditRate());
        assertNotNull(stats.getStatisticsDate());
    }
    
    @Test
    public void testComplianceRateRange() {
        // 测试合规率在合理范围内
        Statistics stats = statisticsService.getOrgStatistics(1L, null, null);
        BigDecimal rate = stats.getComplianceRate();
        
        assertTrue(rate.compareTo(BigDecimal.ZERO) >= 0, "合规率不应小于 0");
        assertTrue(rate.compareTo(new BigDecimal("100")) <= 100, "合规率不应大于 100");
    }
    
    @Test
    public void testStatisticsWithNullDateRange() {
        // 测试空日期范围
        Statistics stats = statisticsService.getOrgStatistics(1L, null, null);
        
        assertNotNull(stats);
        assertNotNull(stats.getTotalOrders());
    }
}
