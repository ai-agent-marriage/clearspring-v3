package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.RankData;
import com.ruoyi.qingru.service.RankService;
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
 * 排行榜控制器测试类
 */
class RankControllerTest {
    
    @Mock
    private RankService rankService;
    
    @InjectMocks
    private RankController rankController;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testGetVolunteerRank() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "张三", 100, 1));
        rankData.add(new RankData(2L, "李四", 80, 2));
        
        when(rankService.getVolunteerRank(10)).thenReturn(rankData);
        
        // 执行测试
        R<List<RankData>> result = rankController.getVolunteerRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("获取成功", result.getMsg());
        assertNotNull(result.getData());
        assertEquals(2, result.getData().size());
        assertEquals("张三", result.getData().get(0).getName());
        assertEquals(1, result.getData().get(0).getRank().intValue());
        
        // 验证方法调用
        verify(rankService, times(1)).getVolunteerRank(10);
    }
    
    @Test
    void testGetVolunteerRankWithDefaultLimit() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        
        when(rankService.getVolunteerRank(10)).thenReturn(rankData);
        
        // 执行测试 - 使用默认 limit
        R<List<RankData>> result = rankController.getVolunteerRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testGetOrgRank() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        rankData.add(new RankData(1L, "机构 -1", 500, 1));
        rankData.add(new RankData(2L, "机构 -2", 400, 2));
        rankData.add(new RankData(3L, "机构 -3", 300, 3));
        
        when(rankService.getOrgRank(10)).thenReturn(rankData);
        
        // 执行测试
        R<List<RankData>> result = rankController.getOrgRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("获取成功", result.getMsg());
        assertNotNull(result.getData());
        assertEquals(3, result.getData().size());
        assertEquals("机构 -1", result.getData().get(0).getName());
        assertEquals(500, result.getData().get(0).getValue().intValue());
        
        // 验证方法调用
        verify(rankService, times(1)).getOrgRank(10);
    }
    
    @Test
    void testGetOrgRankWithDifferentLimit() {
        // 准备测试数据
        List<RankData> rankData = new ArrayList<>();
        
        when(rankService.getOrgRank(5)).thenReturn(rankData);
        
        // 执行测试
        R<List<RankData>> result = rankController.getOrgRank(5);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        
        // 验证方法调用
        verify(rankService, times(1)).getOrgRank(5);
    }
    
    @Test
    void testGetVolunteerRankEmpty() {
        // 准备测试数据
        when(rankService.getVolunteerRank(10)).thenReturn(new ArrayList<>());
        
        // 执行测试
        R<List<RankData>> result = rankController.getVolunteerRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertTrue(result.getData().isEmpty());
    }
    
    @Test
    void testGetOrgRankError() {
        // 准备测试数据 - 模拟异常
        when(rankService.getOrgRank(10)).thenThrow(new RuntimeException("测试异常"));
        
        // 执行测试
        R<List<RankData>> result = rankController.getOrgRank(10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(500, result.getCode());
        assertTrue(result.getMsg().contains("获取失败"));
    }
}
