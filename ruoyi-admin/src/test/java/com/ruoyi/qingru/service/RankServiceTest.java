package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.RankData;
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
 * 排行榜服务测试类
 */
class RankServiceTest {
    
    @Mock
    private VolunteerMapper volunteerMapper;
    
    @Mock
    private OrderProtectMapper orderMapper;
    
    @InjectMocks
    private RankService rankService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testGetVolunteerRank() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "张三", 100, 0));
        rankData.add(new RankData(2L, "李四", 80, 0));
        rankData.add(new RankData(3L, "王五", 60, 0));
        
        when(volunteerMapper.selectRank(10)).thenReturn(rankData);
        
        // 执行测试
        List<RankData> result = rankService.getVolunteerRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(1, result.get(0).getRank());
        assertEquals(2, result.get(1).getRank());
        assertEquals(3, result.get(2).getRank());
        assertEquals("张三", result.get(0).getName());
        assertEquals(100, result.get(0).getValue().intValue());
        
        // 验证方法调用
        verify(volunteerMapper, times(1)).selectRank(10);
    }
    
    @Test
    void testGetOrgRank() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "机构 -1", 500, 0));
        rankData.add(new RankData(2L, "机构 -2", 400, 0));
        rankData.add(new RankData(3L, "机构 -3", 300, 0));
        
        when(orderMapper.selectOrgRank(10)).thenReturn(rankData);
        
        // 执行测试
        List<RankData> result = rankService.getOrgRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(1, result.get(0).getRank());
        assertEquals(2, result.get(1).getRank());
        assertEquals(3, result.get(2).getRank());
        assertEquals("机构 -1", result.get(0).getName());
        assertEquals(500, result.get(0).getValue().intValue());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectOrgRank(10);
    }
    
    @Test
    void testGetVolunteerRankWithDifferentLimit() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "张三", 100, 0));
        
        when(volunteerMapper.selectRank(5)).thenReturn(rankData);
        
        // 执行测试
        List<RankData> result = rankService.getVolunteerRank(5);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getRank());
        
        // 验证方法调用
        verify(volunteerMapper, times(1)).selectRank(5);
    }
    
    @Test
    void testGetOrgRankWithDefaultLimit() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        
        when(orderMapper.selectOrgRank(10)).thenReturn(rankData);
        
        // 执行测试
        List<RankData> result = rankService.getOrgRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.isEmpty());
        
        // 验证方法调用
        verify(orderMapper, times(1)).selectOrgRank(10);
    }
    
    @Test
    void testGetVolunteerRankEmpty() {
        // 准备测试数据
        when(volunteerMapper.selectRank(10)).thenReturn(new ArrayList<>());
        
        // 执行测试
        List<RankData> result = rankService.getVolunteerRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
