package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.PieData;
import com.ruoyi.qingru.entity.StatsDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.service.StatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 数据统计控制器测试类
 */
class StatsControllerTest {
    
    @Mock
    private StatsService statsService;
    
    @InjectMocks
    private StatsController statsController;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testGetDashboard() {
        // 准备测试数据
        StatsDashboard dashboard = new StatsDashboard();
        dashboard.setTotalUsers(1000L);
        dashboard.setTotalOrders(5000L);
        dashboard.setTotalAmount(new BigDecimal("500000.00"));
        
        when(statsService.getDashboard("2024-01-01", "2024-01-31")).thenReturn(dashboard);
        
        // 执行测试
        R<StatsDashboard> result = statsController.getDashboard("2024-01-01", "2024-01-31");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("获取成功", result.getMsg());
        assertNotNull(result.getData());
        assertEquals(1000L, result.getData().getTotalUsers());
        
        // 验证方法调用
        verify(statsService, times(1)).getDashboard("2024-01-01", "2024-01-31");
    }
    
    @Test
    void testGetDashboardWithNullDates() {
        // 准备测试数据
        StatsDashboard dashboard = new StatsDashboard();
        dashboard.setTotalUsers(500L);
        
        when(statsService.getDashboard(null, null)).thenReturn(dashboard);
        
        // 执行测试
        R<StatsDashboard> result = statsController.getDashboard(null, null);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
    
    @Test
    void testGetTrend() {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        trendData.add(new TrendData("2024-01-01", 10, "orders"));
        trendData.add(new TrendData("2024-01-02", 15, "orders"));
        
        when(statsService.getOrderTrend("2024-01-01", "2024-01-31", "day")).thenReturn(trendData);
        
        // 执行测试
        R<List<TrendData>> result = statsController.getTrend("2024-01-01", "2024-01-31", "day");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(2, result.getData().size());
        
        // 验证方法调用
        verify(statsService, times(1)).getOrderTrend("2024-01-01", "2024-01-31", "day");
    }
    
    @Test
    void testGetTrendWithDefaultGroupBy() {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        
        when(statsService.getOrderTrend("2024-01-01", "2024-01-31", "day")).thenReturn(trendData);
        
        // 执行测试 - 使用默认 groupBy
        R<List<TrendData>> result = statsController.getTrend("2024-01-01", "2024-01-31", "day");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testGetSpeciesDistribution() {
        // 准备测试数据
        List<PieData> pieData = new ArrayList<>();
        pieData.add(new PieData("物种 A", 100));
        pieData.add(new PieData("物种 B", 80));
        
        when(statsService.getSpeciesDistribution()).thenReturn(pieData);
        
        // 执行测试
        R<List<PieData>> result = statsController.getSpeciesDistribution();
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("获取成功", result.getMsg());
        assertNotNull(result.getData());
        assertEquals(2, result.getData().size());
        assertEquals("物种 A", result.getData().get(0).getName());
        
        // 验证方法调用
        verify(statsService, times(1)).getSpeciesDistribution();
    }
    
    @Test
    void testGetDashboardError() {
        // 准备测试数据 - 模拟异常
        when(statsService.getDashboard(null, null)).thenThrow(new RuntimeException("测试异常"));
        
        // 执行测试
        R<StatsDashboard> result = statsController.getDashboard(null, null);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(500, result.getCode());
        assertTrue(result.getMsg().contains("获取失败"));
    }
}
