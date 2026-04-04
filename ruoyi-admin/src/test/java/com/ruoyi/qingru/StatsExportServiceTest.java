package com.ruoyi.qingru;

import com.ruoyi.qingru.service.ExportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 数据导出服务测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/StatsExportServiceTest.java
 */
@SpringBootTest
public class StatsExportServiceTest {
    
    @Autowired
    private ExportService exportService;
    
    @Test
    public void testExportStatsData_Excel() throws IOException {
        // 设置测试日期范围
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        // 导出 Excel 格式数据
        byte[] data = exportService.exportStatsData(startDate, endDate, "orders");
        
        // 验证导出的数据不为空
        assertNotNull(data);
        // 验证导出的数据长度大于 0
        assertTrue(data.length > 0);
    }
    
    @Test
    public void testExportStatsData_Csv() {
        // 设置测试日期范围
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        // 导出 CSV 格式数据
        String csv = exportService.exportStatsCsv(startDate, endDate, "orders");
        
        // 验证导出的 CSV 数据不为空
        assertNotNull(csv);
        // 验证导出的 CSV 数据长度大于 0
        assertTrue(csv.length() > 0);
    }
    
    @Test
    public void testExportStatsData_Excel_Users() throws IOException {
        // 测试导出用户数据
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        byte[] data = exportService.exportStatsData(startDate, endDate, "users");
        
        assertNotNull(data);
        assertTrue(data.length > 0);
    }
    
    @Test
    public void testExportStatsData_Csv_Volunteers() {
        // 测试导出志愿者数据
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";
        
        String csv = exportService.exportStatsCsv(startDate, endDate, "volunteers");
        
        assertNotNull(csv);
        assertTrue(csv.length() > 0);
        
        // 验证 CSV 格式包含表头
        assertTrue(csv.contains(","));
    }
    
    @Test
    public void testExportStatsData_EmptyDateRange() throws IOException {
        // 测试空日期范围导出
        byte[] data = exportService.exportStatsData(null, null, "orders");
        
        assertNotNull(data);
        assertTrue(data.length > 0);
    }
}
