package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.PieData;
import com.ruoyi.qingru.entity.RankData;
import com.ruoyi.qingru.entity.StatsDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.UserMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
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
 * 数据统计服务测试类
 */
class StatsServiceTest {
    
    @Mock
    private UserMapper userMapper;
    
    @Mock
    private OrderProtectMapper orderMapper;
    
    @Mock
    private VolunteerMapper volunteerMapper;
    
    @InjectMocks
    private StatsService statsService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testGetDashboard() {
        // 准备测试数据
        when(userMapper.countTotal()).thenReturn(1000);
        when(orderMapper.countTotal()).thenReturn(5000);
        when(orderMapper.sumTotalAmount()).thenReturn(new BigDecimal("500000.00"));
        when(volunteerMapper.countActive()).thenReturn(200);
        when(orderMapper.countToday()).thenReturn(50);
        when(orderMapper.sumTodayAmount()).thenReturn(new BigDecimal("5000.00"));
        
        // 执行测试
        StatsDashboard dashboard = statsService.getDashboard("2024-01-01", "2024-01-31");
        
        // 验证结果
        assertNotNull(dashboard);
        assertEquals(1000L, dashboard.getTotalUsers());
        assertEquals(5000L, dashboard.getTotalOrders());
        assertEquals(new BigDecimal("500000.00"), dashboard.getTotalAmount());
        assertEquals(200L, dashboard.getActiveVolunteers());
        assertEquals(50L, dashboard.getTodayOrders());
        assertEquals(new BigDecimal("5000.00"), dashboard.getTodayAmount());
        
        // 验证方法调用
        verify(userMapper, times(1)).countTotal();
        verify(orderMapper, times(1)).countTotal();
        verify(orderMapper, times(1)).sumTotalAmount();
        verify(volunteerMapper, times(1)).countActive();
        verify(orderMapper, times(1)).countToday();
        verify(orderMapper, times(1)).sumTodayAmount();
    }
    
    @Test
    void testGetOrderTrend() {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        trendData.add(new TrendData("2024-01-01", 10, "orders"));
        trendData.add(new TrendData("2024-01-02", 15, "orders"));
        trendData.add(new TrendData("2024-01-03", 12, "orders"));
        
        when(orderMapper.selectTrend("2024-01-01", "2024-01-31", "day")).thenReturn(trendData);
        
        // 执行测试
        List<TrendData> result = statsService.getOrderTrend("2024-01-01", "2024-01-31", "day");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("2024-01-01", result.get(0).getDate());
        assertEquals(10, result.get(0).getValue().intValue());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectTrend("2024-01-01", "2024-01-31", "day");
    }
    
    @Test
    void testGetSpeciesDistribution() {
        // 准备测试数据
        List<PieData> pieData = new ArrayList<>();
        pieData.add(new PieData("物种 A", 100));
        pieData.add(new PieData("物种 B", 80));
        pieData.add(new PieData("物种 C", 60));
        
        when(orderMapper.selectSpeciesDistribution()).thenReturn(pieData);
        
        // 执行测试
        List<PieData> result = statsService.getSpeciesDistribution();
        
        // 验证结果
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("物种 A", result.get(0).getName());
        assertEquals(100, result.get(0).getValue().intValue());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectSpeciesDistribution();
    }
    
    @Test
    void testGetDashboardWithNullDates() {
        // 准备测试数据
        when(userMapper.countTotal()).thenReturn(500);
        when(orderMapper.countTotal()).thenReturn(2500);
        when(orderMapper.sumTotalAmount()).thenReturn(BigDecimal.ZERO);
        when(volunteerMapper.countActive()).thenReturn(100);
        when(orderMapper.countToday()).thenReturn(25);
        when(orderMapper.sumTodayAmount()).thenReturn(BigDecimal.ZERO);
        
        // 执行测试 - 传入 null 日期
        StatsDashboard dashboard = statsService.getDashboard(null, null);
        
        // 验证结果
        assertNotNull(dashboard);
        assertEquals(500L, dashboard.getTotalUsers());
        assertEquals(2500L, dashboard.getTotalOrders());
    }
    
    @Test
    void testGetOrderTrendWeekly() {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        trendData.add(new TrendData("2024-01", 50, "orders"));
        
        when(orderMapper.selectTrend("2024-01-01", "2024-01-31", "week")).thenReturn(trendData);
        
        // 执行测试
        List<TrendData> result = statsService.getTrend("2024-01-01", "2024-01-31", "week");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectTrend("2024-01-01", "2024-01-31", "week");
    }
    
    @Test
    void testGetVolunteerRank() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "志愿者 A", 100, 0));
        rankData.add(new RankData(2L, "志愿者 B", 80, 0));
        rankData.add(new RankData(3L, "志愿者 C", 60, 0));
        
        when(volunteerMapper.selectRank(10)).thenReturn(rankData);
        
        // 执行测试
        List<RankData> result = statsService.getVolunteerRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(1, result.get(0).getRank());
        assertEquals(2, result.get(1).getRank());
        assertEquals(3, result.get(2).getRank());
        
        // 验证方法调用
        verify(volunteerMapper, times(1)).selectRank(10);
    }
    
    @Test
    void testGetOrgRank() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "机构 A", 200, 0));
        rankData.add(new RankData(2L, "机构 B", 150, 0));
        
        when(orderMapper.selectOrgRank(10)).thenReturn(rankData);
        
        // 执行测试
        List<RankData> result = statsService.getOrgRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getRank());
        assertEquals(2, result.get(1).getRank());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectOrgRank(10);
    }
    
    @Test
    void testGetTrendMonthly() {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        trendData.add(new TrendData("2024-01", 100, "orders"));
        trendData.add(new TrendData("2024-02", 120, "orders"));
        
        when(orderMapper.selectTrend("2024-01-01", "2024-03-31", "month")).thenReturn(trendData);
        
        // 执行测试
        List<TrendData> result = statsService.getTrend("2024-01-01", "2024-03-31", "month");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("2024-01", result.get(0).getDate());
        assertEquals(100, result.get(0).getValue().intValue());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectTrend("2024-01-01", "2024-03-31", "month");
    }
    
    @Test
    void testGetVolunteerRankWithDifferentLimits() {
        // 准备测试数据
        List<RankData> rankData5 = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            rankData5.add(new RankData((long) i, "志愿者" + i, 100 - i * 10, 0));
        }
        
        when(volunteerMapper.selectRank(5)).thenReturn(rankData5);
        
        // 执行测试
        List<RankData> result = statsService.getVolunteerRank(5);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(5, result.size());
        assertEquals(1, result.get(0).getRank());
        assertEquals(5, result.get(4).getRank());
        
        // 验证方法调用
        verify(volunteerMapper, times(1)).selectRank(5);
    }
    
    @Test
    void testGetOrgRankWithDifferentLimits() {
        // 准备测试数据
        List<RankData> rankData20 = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            rankData20.add(new RankData((long) i, "机构" + i, 500 - i * 20, 0));
        }
        
        when(orderMapper.selectOrgRank(20)).thenReturn(rankData20);
        
        // 执行测试
        List<RankData> result = statsService.getOrgRank(20);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(20, result.size());
        assertEquals(1, result.get(0).getRank());
        assertEquals(20, result.get(19).getRank());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectOrgRank(20);
    }
}
