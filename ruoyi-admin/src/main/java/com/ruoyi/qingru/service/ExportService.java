package com.ruoyi.qingru.service;

import com.opencsv.CSVWriter;
import com.ruoyi.qingru.entity.OrderExportDTO;
import com.ruoyi.qingru.entity.PieData;
import com.ruoyi.qingru.entity.RankData;
import com.ruoyi.qingru.entity.StatsDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.UserMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 报表导出服务类
 */
@Service
public class ExportService {
    private static final Logger log = LoggerFactory.getLogger(ExportService.class);

    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private VolunteerMapper volunteerMapper;
    
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
    
    /**
     * 导出统计数据（Excel）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param type 导出类型 (orders/volunteers/orgs/dashboard)
     * @return Excel 文件字节数组
     * @throws IOException IO 异常
     */
    public byte[] exportStatsData(String startDate, String endDate, String type) throws IOException {
        log.info("导出统计数据，startDate={}, endDate={}, type={}", startDate, endDate, type);
        
        Workbook workbook = new XSSFWorkbook();
        
        if ("orders".equals(type)) {
            exportOrdersSheet(workbook, startDate, endDate);
        } else if ("volunteers".equals(type)) {
            exportVolunteersSheet(workbook, startDate, endDate);
        } else if ("orgs".equals(type)) {
            exportOrgsSheet(workbook, startDate, endDate);
        } else if ("dashboard".equals(type)) {
            exportDashboardSheet(workbook, startDate, endDate);
        }
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        workbook.write(baos);
        workbook.close();
        
        return baos.toByteArray();
    }
    
    /**
     * 导出趋势数据（Excel）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param groupBy 分组方式
     * @return Excel 文件字节数组
     * @throws IOException IO 异常
     */
    public byte[] exportTrendData(String startDate, String endDate, String groupBy) throws IOException {
        log.info("导出趋势数据，startDate={}, endDate={}, groupBy={}", startDate, endDate, groupBy);
        
        Workbook workbook = new XSSFWorkbook();
        exportTrendSheet(workbook, startDate, endDate, groupBy);
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        workbook.write(baos);
        workbook.close();
        
        return baos.toByteArray();
    }
    
    /**
     * 导出统计数据（CSV）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param type 导出类型 (orders/volunteers/orgs)
     * @return CSV 字符串
     */
    public String exportStatsCsv(String startDate, String endDate, String type) {
        log.info("导出 CSV 统计数据，startDate={}, endDate={}, type={}", startDate, endDate, type);
        
        StringBuilder csv = new StringBuilder();
        
        if ("orders".equals(type)) {
            csv.append("日期，订单数，金额\n");
            List<TrendData> trendData = orderMapper.selectTrend(startDate, endDate, "day");
            for (TrendData data : trendData) {
                csv.append(data.getDate()).append(",")
                   .append(data.getValue()).append(",0\n");
            }
        } else if ("volunteers".equals(type)) {
            csv.append("排名，姓名，服务时长\n");
            List<RankData> rankData = volunteerMapper.selectRank(100);
            for (int i = 0; i < rankData.size(); i++) {
                RankData r = rankData.get(i);
                csv.append(i + 1).append(",")
                   .append(r.getName()).append(",")
                   .append(r.getValue()).append("\n");
            }
        } else if ("orgs".equals(type)) {
            csv.append("排名，机构，订单数\n");
            List<RankData> rankData = orderMapper.selectOrgRank(100);
            for (int i = 0; i < rankData.size(); i++) {
                RankData r = rankData.get(i);
                csv.append(i + 1).append(",")
                   .append(r.getName()).append(",")
                   .append(r.getValue()).append("\n");
            }
        }
        
        return csv.toString();
    }
    
    /**
     * 导出订单数据表
     */
    private void exportOrdersSheet(Workbook workbook, String startDate, String endDate) throws IOException {
        Sheet sheet = workbook.createSheet("订单统计");
        
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("日期");
        header.createCell(1).setCellValue("订单数");
        header.createCell(2).setCellValue("金额");
        
        List<TrendData> trendData = orderMapper.selectTrend(startDate, endDate, "day");
        int rowNum = 1;
        for (TrendData data : trendData) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(data.getDate());
            row.createCell(1).setCellValue(data.getValue().intValue());
            row.createCell(2).setCellValue(0);
        }
        
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    /**
     * 导出志愿者数据表
     */
    private void exportVolunteersSheet(Workbook workbook, String startDate, String endDate) throws IOException {
        Sheet sheet = workbook.createSheet("志愿者统计");
        
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("排名");
        header.createCell(1).setCellValue("姓名");
        header.createCell(2).setCellValue("服务时长");
        
        List<RankData> rankData = volunteerMapper.selectRank(100);
        int rowNum = 1;
        for (int i = 0; i < rankData.size(); i++) {
            RankData r = rankData.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(r.getName());
            row.createCell(2).setCellValue(r.getValue());
        }
        
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    /**
     * 导出机构数据表
     */
    private void exportOrgsSheet(Workbook workbook, String startDate, String endDate) throws IOException {
        Sheet sheet = workbook.createSheet("机构统计");
        
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("排名");
        header.createCell(1).setCellValue("机构");
        header.createCell(2).setCellValue("订单数");
        
        List<RankData> rankData = orderMapper.selectOrgRank(100);
        int rowNum = 1;
        for (int i = 0; i < rankData.size(); i++) {
            RankData r = rankData.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(r.getName());
            row.createCell(2).setCellValue(r.getValue());
        }
        
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    /**
     * 导出仪表盘数据表
     */
    private void exportDashboardSheet(Workbook workbook, String startDate, String endDate) throws IOException {
        Sheet sheet = workbook.createSheet("仪表盘统计");
        
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("指标");
        header.createCell(1).setCellValue("数值");
        
        // 获取仪表盘数据
        StatsDashboard dashboard = new StatsDashboard();
        dashboard.setTotalUsers((long) userMapper.countTotal());
        dashboard.setTotalOrders((long) orderMapper.countTotal());
        dashboard.setTotalAmount(orderMapper.sumTotalAmount());
        dashboard.setActiveVolunteers((long) volunteerMapper.countActive());
        dashboard.setTodayOrders((long) orderMapper.countToday());
        dashboard.setTodayAmount(orderMapper.sumTodayAmount());
        
        int rowNum = 1;
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("累计用户数");
        row.createCell(1).setCellValue(dashboard.getTotalUsers() != null ? dashboard.getTotalUsers() : 0);
        
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("累计订单数");
        row.createCell(1).setCellValue(dashboard.getTotalOrders() != null ? dashboard.getTotalOrders() : 0);
        
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("累计成交金额");
        row.createCell(1).setCellValue(dashboard.getTotalAmount() != null ? dashboard.getTotalAmount().doubleValue() : 0);
        
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("活跃志愿者数");
        row.createCell(1).setCellValue(dashboard.getActiveVolunteers() != null ? dashboard.getActiveVolunteers() : 0);
        
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("今日订单数");
        row.createCell(1).setCellValue(dashboard.getTodayOrders() != null ? dashboard.getTodayOrders() : 0);
        
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("今日成交金额");
        row.createCell(1).setCellValue(dashboard.getTodayAmount() != null ? dashboard.getTodayAmount().doubleValue() : 0);
        
        for (int i = 0; i < 2; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    /**
     * 导出趋势数据表
     */
    private void exportTrendSheet(Workbook workbook, String startDate, String endDate, String groupBy) throws IOException {
        Sheet sheet = workbook.createSheet("趋势统计");
        
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("日期");
        header.createCell(1).setCellValue("订单数");
        header.createCell(2).setCellValue("指标");
        
        List<TrendData> trendData = orderMapper.selectTrend(startDate, endDate, groupBy);
        int rowNum = 1;
        for (TrendData data : trendData) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(data.getDate());
            row.createCell(1).setCellValue(data.getValue().intValue());
            row.createCell(2).setCellValue(data.getMetric() != null ? data.getMetric() : "orders");
        }
        
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
