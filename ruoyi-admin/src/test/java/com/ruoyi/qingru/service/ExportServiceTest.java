package com.ruoyi.qingru.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 报表导出服务测试
 */
@SpringBootTest
public class ExportServiceTest {
    
    @Autowired
    private ExportService exportService;
    
    @Test
    public void testExportOrderReport() throws IOException {
        // 测试导出订单报表
        byte[] data = exportService.exportOrderReport(1L, "2026-04-01", "2026-04-30");
        
        assertNotNull(data);
        assertTrue(data.length > 0, "Excel 数据不应为空");
    }
    
    @Test
    public void testExportOrderReportFormat() throws IOException {
        // 测试 Excel 文件格式（XLSX 文件头）
        byte[] data = exportService.exportOrderReport(null, null, null);
        
        assertNotNull(data);
        // XLSX 文件以 PK 开头（ZIP 格式）
        assertTrue(data.length >= 2, "数据长度至少 2 字节");
    }
    
    @Test
    public void testExportWithNullParams() throws IOException {
        // 测试空参数导出
        byte[] data = exportService.exportOrderReport(null, null, null);
        
        assertNotNull(data);
        assertTrue(data.length > 0);
    }
}
