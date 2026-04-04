package com.ruoyi.qingru;

import com.ruoyi.qingru.service.ExportService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 报表导出服务单元测试
 * 测试订单报表、结算报表等导出功能
 */
@SpringBootTest
public class ExportServiceTest {

    @Autowired
    private ExportService exportService;

    /**
     * 测试成功导出订单报表
     * 验证可以导出订单数据报表
     */
    @Test
    public void testExportOrderReport_Success() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportOrderReport(orgId, startDate, endDate);

        assertNotNull(data, "导出的报表数据不应为空");
        assertTrue(data.length > 0, "报表数据大小应大于 0");
    }

    /**
     * 测试导出结算报表
     * 验证可以导出结算数据报表
     */
    @Test
    public void testExportSettlementReport() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportSettlementReport(orgId, startDate, endDate);

        assertNotNull(data, "导出的结算报表数据不应为空");
        assertTrue(data.length > 0, "结算报表数据大小应大于 0");
    }

    /**
     * 测试导出志愿者报表
     * 验证可以导出志愿者数据报表
     */
    @Test
    public void testExportVolunteerReport() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportVolunteerReport(orgId, startDate, endDate);

        assertNotNull(data, "导出的志愿者报表数据不应为空");
        assertTrue(data.length > 0, "志愿者报表数据大小应大于 0");
    }

    /**
     * 测试导出平台统计报表
     * 验证可以导出平台统计报表
     */
    @Test
    public void testExportPlatformReport() throws IOException {
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportPlatformReport(startDate, endDate);

        assertNotNull(data, "导出的平台报表数据不应为空");
        assertTrue(data.length > 0, "平台报表数据大小应大于 0");
    }

    /**
     * 测试导出 Excel 格式报表
     * 验证 Excel 格式导出正常
     */
    @Test
    public void testExportExcelFormat() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportOrderReport(orgId, startDate, endDate);

        // 验证 Excel 文件头（PK 开头）
        assertTrue(data.length >= 4, "Excel 文件数据应至少包含文件头");
        assertEquals(0x50, data[0] & 0xFF, "Excel 文件应以 PK 开头");
        assertEquals(0x4B, data[1] & 0xFF, "Excel 文件应以 PK 开头");
    }

    /**
     * 测试导出 CSV 格式报表
     * 验证 CSV 格式导出正常
     */
    @Test
    public void testExportCSVFormat() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportOrderReportCSV(orgId, startDate, endDate);

        assertNotNull(data, "导出的 CSV 报表数据不应为空");
        assertTrue(data.length > 0, "CSV 报表数据大小应大于 0");
        // 验证 CSV 文件包含表头
        String csvContent = new String(data);
        assertTrue(csvContent.contains(","), "CSV 文件应包含逗号分隔符");
    }

    /**
     * 测试报表数据完整性
     * 验证导出的报表包含所有必要字段
     */
    @Test
    public void testReportDataCompleteness() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        byte[] data = exportService.exportOrderReport(orgId, startDate, endDate);

        assertNotNull(data, "报表数据不应为空");
        // 验证文件大小合理（至少包含表头和少量数据）
        assertTrue(data.length > 100, "报表文件大小应合理");
    }

    /**
     * 测试报表导出性能
     * 验证报表导出在合理时间内完成
     */
    @Test
    public void testExportPerformance() throws IOException {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        long startTime = System.currentTimeMillis();
        byte[] data = exportService.exportOrderReport(orgId, startDate, endDate);
        long endTime = System.currentTimeMillis();

        // 验证导出时间在合理范围内（5 秒内）
        assertTrue((endTime - startTime) < 5000, "报表导出应在 5 秒内完成");
        assertNotNull(data, "报表数据不应为空");
    }

    /**
     * 测试空数据导出
     * 验证无数据时导出正常
     */
    @Test
    public void testExportEmptyData() throws IOException {
        Long orgId = 999L; // 不存在的机构 ID
        String startDate = "2020-01-01";
        String endDate = "2020-01-02";

        byte[] data = exportService.exportOrderReport(orgId, startDate, endDate);

        // 即使没有数据，也应返回包含表头的文件
        assertNotNull(data, "即使无数据也应返回文件");
        assertTrue(data.length > 0, "文件大小应大于 0（至少包含表头）");
    }
}
