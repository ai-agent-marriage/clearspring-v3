package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.RankData;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 导出服务测试类
 */
class ExportServiceTest {
    
    @Mock
    private OrderProtectMapper orderMapper;
    
    @Mock
    private VolunteerMapper volunteerMapper;
    
    @InjectMocks
    private ExportService exportService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testExportStatsDataOrders() throws Exception {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        trendData.add(new TrendData("2024-01-01", 10, "orders"));
        trendData.add(new TrendData("2024-01-02", 15, "orders"));
        
        when(orderMapper.selectTrend("2024-01-01", "2024-01-31", "day")).thenReturn(trendData);
        
        // 执行测试
        byte[] result = exportService.exportStatsData("2024-01-01", "2024-01-31", "orders");
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.length > 0);
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectTrend("2024-01-01", "2024-01-31", "day");
    }
    
    @Test
    void testExportStatsDataVolunteers() throws Exception {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "张三", 100, 1));
        rankData.add(new RankData(2L, "李四", 80, 2));
        
        when(volunteerMapper.selectRank(100)).thenReturn(rankData);
        
        // 执行测试
        byte[] result = exportService.exportStatsData("2024-01-01", "2024-01-31", "volunteers");
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.length > 0);
        
        // 验证方法调用
        verify(volunteerMapper, times(1)).selectRank(100);
    }
    
    @Test
    void testExportStatsDataOrgs() throws Exception {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "机构 -1", 500, 1));
        rankData.add(new RankData(2L, "机构 -2", 400, 2));
        
        when(orderMapper.selectOrgRank(100)).thenReturn(rankData);
        
        // 执行测试
        byte[] result = exportService.exportStatsData("2024-01-01", "2024-01-31", "orgs");
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.length > 0);
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectOrgRank(100);
    }
    
    @Test
    void testExportStatsCsvOrders() {
        // 准备测试数据
        List<TrendData> trendData = new ArrayList<>();
        trendData.add(new TrendData("2024-01-01", 10, "orders"));
        trendData.add(new TrendData("2024-01-02", 15, "orders"));
        
        when(orderMapper.selectTrend("2024-01-01", "2024-01-31", "day")).thenReturn(trendData);
        
        // 执行测试
        String result = exportService.exportStatsCsv("2024-01-01", "2024-01-31", "orders");
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.contains("日期，订单数，金额"));
        assertTrue(result.contains("2024-01-01"));
        assertTrue(result.contains("2024-01-02"));
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectTrend("2024-01-01", "2024-01-31", "day");
    }
    
    @Test
    void testExportStatsCsvVolunteers() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "张三", 100, 1));
        rankData.add(new RankData(2L, "李四", 80, 2));
        
        when(volunteerMapper.selectRank(100)).thenReturn(rankData);
        
        // 执行测试
        String result = exportService.exportStatsCsv("2024-01-01", "2024-01-31", "volunteers");
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.contains("排名，姓名，服务时长"));
        assertTrue(result.contains("张三"));
        assertTrue(result.contains("李四"));
        
        // 验证方法调用
        verify(volunteerMapper, times(1)).selectRank(100);
    }
    
    @Test
    void testExportStatsCsvOrgs() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "机构 -1", 500, 1));
        
        when(orderMapper.selectOrgRank(100)).thenReturn(rankData);
        
        // 执行测试
        String result = exportService.exportStatsCsv("2024-01-01", "2024-01-31", "orgs");
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.contains("排名，机构，订单数"));
        assertTrue(result.contains("机构 -1"));
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectOrgRank(100);
    }
    
    @Test
    void testExportStatsDataWithInvalidType() throws Exception {
        // 执行测试 - 传入无效类型
        byte[] result = exportService.exportStatsData("2024-01-01", "2024-01-31", "invalid");
        
        // 验证结果 - 应该返回空的工作簿
        assertNotNull(result);
    }
}
