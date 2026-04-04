package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.PlatformStatistics;
import com.ruoyi.qingru.entity.Statistics;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 统计控制器测试
 */
@SpringBootTest
public class StatisticsControllerTest {
    
    @Autowired
    private StatisticsController statisticsController;
    
    @Test
    public void testGetOrgStatistics() {
        // 测试获取机构统计数据
        R<Statistics> result = statisticsController.getOrgStatistics(1L, "2026-04-01", "2026-04-30");
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(1L, result.getData().getOrgId());
    }
    
    @Test
    public void testGetPlatformStatistics() {
        // 测试获取平台统计数据
        R<PlatformStatistics> result = statisticsController.getPlatformStatistics("2026-04-01", "2026-04-30");
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertNotNull(result.getData().getTotalUsers());
    }
    
    @Test
    public void testOrgStatisticsWithNullDates() {
        // 测试空日期范围
        R<Statistics> result = statisticsController.getOrgStatistics(1L, null, null);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
}
