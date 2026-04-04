package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.TrendData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 后台管理控制器测试
 */
@SpringBootTest
public class AdminControllerTest {
    
    @Autowired
    private AdminController adminController;
    
    @Test
    public void testGetDashboard() {
        // 测试获取管理仪表盘
        R<AdminDashboard> result = adminController.getDashboard();
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertNotNull(result.getData().getTotalUsers());
    }
    
    @Test
    public void testGetTrend() {
        // 测试获取数据趋势
        R<List<TrendData>> result = adminController.getTrend("users", "2026-04-01", "2026-04-30");
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertTrue(result.getData().size() > 0);
    }
    
    @Test
    public void testTrendDataStructure() {
        // 测试趋势数据结构
        R<List<TrendData>> result = adminController.getTrend("orders", "2026-04-01", "2026-04-30");
        
        List<TrendData> trend = result.getData();
        assertNotNull(trend);
        
        TrendData first = trend.get(0);
        assertNotNull(first.getDate());
        assertNotNull(first.getValue());
        assertNotNull(first.getMetric());
    }
}
