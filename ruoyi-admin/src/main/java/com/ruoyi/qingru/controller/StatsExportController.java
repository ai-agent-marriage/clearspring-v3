package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.service.ExportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 统计数据导出控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/stats/export")
public class StatsExportController {
    
    @Autowired
    private ExportService exportService;
    
    /**
     * 导出统计数据（Excel）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param type 导出类型 (orders/volunteers/orgs)
     * @param response HTTP 响应
     * @throws IOException IO 异常
     */
    @GetMapping
    public void exportStatsExcel(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "orders") String type,
            HttpServletResponse response) throws IOException {
        
        log.info("导出统计数据 Excel，startDate={}, endDate={}, type={}", startDate, endDate, type);
        
        try {
            byte[] data = exportService.exportStatsData(startDate, endDate, type);
            
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=统计数据_" + type + ".xlsx");
            response.setContentLength(data.length);
            response.getOutputStream().write(data);
            response.getOutputStream().flush();
            
            log.info("导出统计数据 Excel 成功");
        } catch (Exception e) {
            log.error("导出统计数据 Excel 失败", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "导出失败：" + e.getMessage());
        }
    }
    
    /**
     * 导出仪表盘数据（Excel）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param response HTTP 响应
     * @throws IOException IO 异常
     */
    @GetMapping("/dashboard")
    public void exportDashboardExcel(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) throws IOException {
        
        log.info("导出仪表盘数据 Excel，startDate={}, endDate={}", startDate, endDate);
        
        try {
            byte[] data = exportService.exportStatsData(startDate, endDate, "dashboard");
            
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=仪表盘数据.xlsx");
            response.setContentLength(data.length);
            response.getOutputStream().write(data);
            response.getOutputStream().flush();
            
            log.info("导出仪表盘数据 Excel 成功");
        } catch (Exception e) {
            log.error("导出仪表盘数据 Excel 失败", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "导出失败：" + e.getMessage());
        }
    }
    
    /**
     * 导出趋势数据（Excel）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param groupBy 分组方式 (day/week/month)
     * @param response HTTP 响应
     * @throws IOException IO 异常
     */
    @GetMapping("/trend")
    public void exportTrendExcel(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "day") String groupBy,
            HttpServletResponse response) throws IOException {
        
        log.info("导出趋势数据 Excel，startDate={}, endDate={}, groupBy={}", startDate, endDate, groupBy);
        
        try {
            byte[] data = exportService.exportTrendData(startDate, endDate, groupBy);
            
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=趋势数据.xlsx");
            response.setContentLength(data.length);
            response.getOutputStream().write(data);
            response.getOutputStream().flush();
            
            log.info("导出趋势数据 Excel 成功");
        } catch (Exception e) {
            log.error("导出趋势数据 Excel 失败", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "导出失败：" + e.getMessage());
        }
    }
    
    /**
     * 导出统计数据（CSV）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param type 导出类型 (orders/volunteers/orgs)
     * @return CSV 字符串
     */
    @GetMapping("/csv")
    public R<String> exportStatsCsv(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "orders") String type) {
        
        log.info("导出统计数据 CSV，startDate={}, endDate={}, type={}", startDate, endDate, type);
        
        try {
            String csv = exportService.exportStatsCsv(startDate, endDate, type);
            return R.ok(csv, "导出成功");
        } catch (Exception e) {
            log.error("导出统计数据 CSV 失败", e);
            return R.fail("导出失败：" + e.getMessage());
        }
    }
}
