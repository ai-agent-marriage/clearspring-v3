package com.ruoyi.qingru.controller;

import com.ruoyi.qingru.service.ExportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 报表导出控制器
 */
@Slf4j
@RestController
@RequestMapping("/export")
public class ExportController {
    
    @Autowired
    private ExportService exportService;
    
    /**
     * 导出订单报表
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param response HTTP 响应
     * @throws IOException IO 异常
     */
    @GetMapping("/orders")
    public void exportOrders(
            @RequestParam(required = false) Long orgId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) throws IOException {
        
        log.info("导出订单报表，orgId={}, startDate={}, endDate={}", orgId, startDate, endDate);
        
        try {
            byte[] data = exportService.exportOrderReport(orgId, startDate, endDate);
            
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=订单报表.xlsx");
            response.setContentLength(data.length);
            response.getOutputStream().write(data);
            response.getOutputStream().flush();
            
            log.info("导出订单报表成功");
        } catch (Exception e) {
            log.error("导出订单报表失败", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "导出失败：" + e.getMessage());
        }
    }
}
