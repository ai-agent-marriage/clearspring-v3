package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.service.ExportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.servlet.http.HttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 统计数据导出控制器测试类
 */
class StatsExportControllerTest {
    
    @Mock
    private ExportService exportService;
    
    @Mock
    private HttpServletResponse response;
    
    @InjectMocks
    private StatsExportController statsExportController;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testExportStatsCsv() throws Exception {
        // 准备测试数据
        String csvData = "日期，订单数，金额\n2024-01-01,10,0\n2024-01-02,15,0";
        
        when(exportService.exportStatsCsv("2024-01-01", "2024-01-31", "orders")).thenReturn(csvData);
        
        // 执行测试
        R<String> result = statsExportController.exportStatsCsv("2024-01-01", "2024-01-31", "orders");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertTrue(result.getData().contains("日期"));
        
        // 验证方法调用
        verify(exportService, times(1)).exportStatsCsv("2024-01-01", "2024-01-31", "orders");
    }
    
    @Test
    void testExportStatsCsvVolunteers() throws Exception {
        // 准备测试数据
        String csvData = "排名，姓名，服务时长\n1，张三，100\n2，李四，80";
        
        when(exportService.exportStatsCsv(null, null, "volunteers")).thenReturn(csvData);
        
        // 执行测试
        R<String> result = statsExportController.exportStatsCsv(null, null, "volunteers");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertTrue(result.getData().contains("张三"));
        
        // 验证方法调用
        verify(exportService, times(1)).exportStatsCsv(null, null, "volunteers");
    }
    
    @Test
    void testExportStatsCsvOrgs() throws Exception {
        // 准备测试数据
        String csvData = "排名，机构，订单数\n1，机构 -1,500";
        
        when(exportService.exportStatsCsv(null, null, "orgs")).thenReturn(csvData);
        
        // 执行测试
        R<String> result = statsExportController.exportStatsCsv(null, null, "orgs");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertTrue(result.getData().contains("机构"));
        
        // 验证方法调用
        verify(exportService, times(1)).exportStatsCsv(null, null, "orgs");
    }
    
    @Test
    void testExportStatsCsvWithException() {
        // 准备异常场景
        when(exportService.exportStatsCsv(any(), any(), any())).thenThrow(new RuntimeException("导出失败"));
        
        // 执行测试
        R<String> result = statsExportController.exportStatsCsv("2024-01-01", "2024-01-31", "orders");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(500, result.getCode());
        assertTrue(result.getMsg().contains("导出失败"));
    }
    
    @Test
    void testExportStatsCsvWithDefaultType() throws Exception {
        // 准备测试数据
        String csvData = "日期，订单数，金额\n2024-01-01,10,0";
        
        when(exportService.exportStatsCsv(null, null, "orders")).thenReturn(csvData);
        
        // 执行测试 - 使用默认 type
        R<String> result = statsExportController.exportStatsCsv(null, null, "orders");
        
        // 验证结果
        assertNotNull(result);
        assertEquals(200, result.getCode());
        
        // 验证方法调用
        verify(exportService, times(1)).exportStatsCsv(null, null, "orders");
    }
}
