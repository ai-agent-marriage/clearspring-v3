package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrderExportDTO;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * 报表导出服务类
 */
@Slf4j
@Service
public class ExportService {
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    /**
     * 导出订单报表（Excel）
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return Excel 文件字节数组
     * @throws IOException IO 异常
     */
    public byte[] exportOrderReport(Long orgId, String startDate, String endDate) throws IOException {
        log.info("导出订单报表，orgId={}, startDate={}, endDate={}", orgId, startDate, endDate);
        
        List<OrderExportDTO> orders = orderMapper.selectForExport(orgId, startDate, endDate);
        
        // 使用 Apache POI 生成 Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("订单报表");
        
        // 创建表头
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("订单号");
        header.createCell(1).setCellValue("下单时间");
        header.createCell(2).setCellValue("护生物种");
        header.createCell(3).setCellValue("数量");
        header.createCell(4).setCellValue("金额");
        header.createCell(5).setCellValue("状态");
        
        // 设置表头样式
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        
        for (int i = 0; i < 6; i++) {
            header.getCell(i).setCellStyle(headerStyle);
        }
        
        // 填充数据
        int rowNum = 1;
        for (OrderExportDTO order : orders) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(order.getOrderNo());
            row.createCell(1).setCellValue(order.getCreateTime() != null ? 
                    order.getCreateTime().toString() : "");
            row.createCell(2).setCellValue(order.getSpeciesName());
            row.createCell(3).setCellValue(order.getQuantity());
            row.createCell(4).setCellValue(order.getAmount() != null ? 
                    order.getAmount().doubleValue() : 0);
            row.createCell(5).setCellValue(order.getStatusName());
        }
        
        // 自动调整列宽
        for (int i = 0; i < 6; i++) {
            sheet.autoSizeColumn(i);
        }
        
        // 输出为字节数组
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        workbook.write(baos);
        workbook.close();
        
        log.info("导出订单报表成功，orderCount={}", orders.size());
        return baos.toByteArray();
    }
}
