package com.ruoyi.qingru.service.impl;

import com.ruoyi.qingru.entity.*;
import com.ruoyi.qingru.service.AdminFinanceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * 后台财务管理服务实现
 */
@Slf4j
@Service
public class AdminFinanceServiceImpl implements AdminFinanceService {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminFinanceServiceImpl.class);
    private final Random random = new Random();
    
    @Override
    public FinanceStats getStats() {
        log.info("获取财务统计数据");
        try {
            FinanceStats stats = new FinanceStats();
            
            // 模拟财务统计数据
            BigDecimal totalRevenue = new BigDecimal("1258000.00");
            BigDecimal pendingSettlement = new BigDecimal("85600.00");
            BigDecimal settledAmount = new BigDecimal("980000.00");
            BigDecimal pendingInvoice = new BigDecimal("45000.00");
            BigDecimal invoicedAmount = new BigDecimal("890000.00");
            Integer totalOrders = 3580;
            BigDecimal refundAmount = new BigDecimal("32400.00");
            
            stats.setTotalRevenue(totalRevenue);
            stats.setPendingSettlement(pendingSettlement);
            stats.setSettledAmount(settledAmount);
            stats.setPendingInvoice(pendingInvoice);
            stats.setInvoicedAmount(invoicedAmount);
            stats.setTotalOrders(totalOrders);
            stats.setRefundAmount(refundAmount);
            
            // 计算退款率
            Double refundRate = refundAmount.divide(totalRevenue, 4, RoundingMode.HALF_UP).doubleValue() * 100;
            stats.setRefundRate(refundRate);
            
            // 计算毛利率 (模拟 35%)
            stats.setProfitMargin(35.0);
            
            log.info("获取财务统计数据成功，总营收：{}", totalRevenue);
            return stats;
        } catch (Exception e) {
            log.error("获取财务统计数据失败", e);
            throw new RuntimeException("获取财务统计数据失败：" + e.getMessage());
        }
    }
    
    @Override
    public List<FinanceOrder> getOrders(Integer status, Integer pageNum, Integer pageSize) {
        log.info("获取订单财务列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<FinanceOrder> orders = new ArrayList<>();
            int start = (pageNum - 1) * pageSize;
            int count = pageSize;
            
            for (int i = start; i < start + count; i++) {
                FinanceOrder order = new FinanceOrder();
                order.setOrderId(10000L + i);
                order.setOrderNo("ORD" + System.currentTimeMillis() + i);
                order.setUserId(1000L + i % 100);
                order.setUserName("用户" + (i % 100));
                
                BigDecimal amount = new BigDecimal(String.valueOf(100 + random.nextInt(900)));
                order.setAmount(amount);
                order.setPayAmount(amount);
                order.setRefundAmount(BigDecimal.ZERO);
                order.setRevenue(amount.multiply(new BigDecimal("0.85")));
                
                order.setStatus(status != null ? status : (i % 5));
                order.setSettlementStatus(i % 2);
                order.setInvoiceStatus(i % 3);
                
                order.setPayTime(LocalDateTime.now().minusDays(i % 30));
                order.setSettlementTime(LocalDateTime.now().minusDays(i % 15));
                order.setCreateTime(LocalDateTime.now().minusDays(i % 60));
                
                orders.add(order);
            }
            
            log.info("获取订单财务列表成功，共{}条", orders.size());
            return orders;
        } catch (Exception e) {
            log.error("获取订单财务列表失败", e);
            throw new RuntimeException("获取订单财务列表失败：" + e.getMessage());
        }
    }
    
    @Override
    public List<Settlement> getSettlements(Integer status, Integer pageNum, Integer pageSize) {
        log.info("获取结算列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<Settlement> settlements = new ArrayList<>();
            int start = (pageNum - 1) * pageSize;
            
            for (int i = start; i < start + pageSize; i++) {
                Settlement settlement = new Settlement();
                settlement.setSettlementId(5000L + i);
                settlement.setSettlementNo("SET" + System.currentTimeMillis() + i);
                settlement.setSettlementType((i % 3) + 1);
                settlement.setTargetId(2000L + i % 50);
                settlement.setTargetName("结算对象" + (i % 50));
                
                BigDecimal amount = new BigDecimal(String.valueOf(5000 + random.nextInt(45000)));
                settlement.setAmount(amount);
                
                BigDecimal fee = amount.multiply(new BigDecimal("0.02"));
                settlement.setFee(fee);
                settlement.setActualAmount(amount.subtract(fee));
                
                settlement.setStatus(status != null ? status : (i % 4));
                settlement.setPeriodStart(LocalDateTime.now().minusDays(30 + (i % 10)));
                settlement.setPeriodEnd(LocalDateTime.now().minusDays(i % 10));
                settlement.setConfirmTime(LocalDateTime.now().minusDays(i % 20));
                settlement.setCreateTime(LocalDateTime.now().minusDays(i % 40));
                
                settlements.add(settlement);
            }
            
            log.info("获取结算列表成功，共{}条", settlements.size());
            return settlements;
        } catch (Exception e) {
            log.error("获取结算列表失败", e);
            throw new RuntimeException("获取结算列表失败：" + e.getMessage());
        }
    }
    
    @Override
    public void settle(Long settlementId) {
        log.info("确认结算，settlementId={}", settlementId);
        try {
            // 模拟结算确认逻辑
            if (settlementId == null || settlementId <= 0) {
                throw new IllegalArgumentException("结算 ID 无效");
            }
            
            // 这里应该查询结算记录并更新状态
            log.info("结算确认成功，settlementId={}", settlementId);
        } catch (Exception e) {
            log.error("确认结算失败", e);
            throw new RuntimeException("确认结算失败：" + e.getMessage());
        }
    }
    
    @Override
    public List<Invoice> getInvoices(Integer status, Integer pageNum, Integer pageSize) {
        log.info("获取发票列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<Invoice> invoices = new ArrayList<>();
            int start = (pageNum - 1) * pageSize;
            
            for (int i = start; i < start + pageSize; i++) {
                Invoice invoice = new Invoice();
                invoice.setId(8000L + i);
                invoice.setInvoiceNo("INV" + System.currentTimeMillis() + i);
                invoice.setOrderId(10000L + i);
                invoice.setOrderNo("ORD" + System.currentTimeMillis() + i);
                invoice.setUserId(1000L + i % 100);
                invoice.setUserName("用户" + (i % 100));
                
                invoice.setTitle("公司抬头" + (i % 10));
                invoice.setTaxNo("TAX" + System.currentTimeMillis() % 1000000);
                invoice.setType((i % 2) + 1);
                invoice.setAmount(new BigDecimal(String.valueOf(100 + random.nextInt(900))));
                invoice.setContent("服务费");
                
                invoice.setStatus(status != null ? status : (i % 5));
                invoice.setExpressNo("EXP" + System.currentTimeMillis() % 1000000);
                invoice.setExpressCompany("顺丰速运");
                
                invoice.setIssueTime(LocalDateTime.now().minusDays(i % 30));
                invoice.setSendTime(LocalDateTime.now().minusDays(i % 20));
                invoice.setCreateTime(LocalDateTime.now().minusDays(i % 45));
                
                invoices.add(invoice);
            }
            
            log.info("获取发票列表成功，共{}条", invoices.size());
            return invoices;
        } catch (Exception e) {
            log.error("获取发票列表失败", e);
            throw new RuntimeException("获取发票列表失败：" + e.getMessage());
        }
    }
    
    @Override
    public void updateInvoice(Long id, Integer status) {
        log.info("更新发票状态，id={}, status={}", id, status);
        try {
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("发票 ID 无效");
            }
            if (status == null || status < 0 || status > 4) {
                throw new IllegalArgumentException("发票状态无效");
            }
            
            // 这里应该更新发票记录的状态
            log.info("发票状态更新成功，id={}, status={}", id, status);
        } catch (Exception e) {
            log.error("更新发票状态失败", e);
            throw new RuntimeException("更新发票状态失败：" + e.getMessage());
        }
    }
    
    @Override
    public byte[] exportFinance(Integer type) {
        log.info("导出财务数据，type={}", type);
        try {
            if (type == null || (type != 1 && type != 2)) {
                throw new IllegalArgumentException("导出类型无效，1-Excel 2-CSV");
            }
            
            // 模拟导出文件内容
            String content = "订单号，金额，支付时间，结算状态，发票状态\n";
            for (int i = 0; i < 100; i++) {
                content += String.format("ORD%d,%.2f,%s,%d,%d\n", 
                    10000 + i, 
                    100 + random.nextDouble() * 900,
                    LocalDateTime.now().minusDays(i % 30),
                    i % 2,
                    i % 3);
            }
            
            log.info("导出财务数据成功，类型：{}", type == 1 ? "Excel" : "CSV");
            return content.getBytes();
        } catch (Exception e) {
            log.error("导出财务数据失败", e);
            throw new RuntimeException("导出财务数据失败：" + e.getMessage());
        }
    }
    
    @Override
    public RevenueData getRevenue() {
        log.info("获取营收数据");
        try {
            RevenueData revenueData = new RevenueData();
            
            BigDecimal totalRevenue = new BigDecimal("1258000.00");
            BigDecimal todayRevenue = new BigDecimal("45800.00");
            BigDecimal yesterdayRevenue = new BigDecimal("42300.00");
            BigDecimal monthRevenue = new BigDecimal("385000.00");
            BigDecimal lastMonthRevenue = new BigDecimal("356000.00");
            
            revenueData.setTotalRevenue(totalRevenue);
            revenueData.setTodayRevenue(todayRevenue);
            revenueData.setYesterdayRevenue(yesterdayRevenue);
            revenueData.setMonthRevenue(monthRevenue);
            revenueData.setLastMonthRevenue(lastMonthRevenue);
            
            // 计算环比增长率
            Double growthRate = todayRevenue.subtract(yesterdayRevenue)
                .divide(yesterdayRevenue, 4, RoundingMode.HALF_UP).doubleValue() * 100;
            revenueData.setGrowthRate(growthRate);
            
            // 计算同比增长
            Double monthGrowthRate = monthRevenue.subtract(lastMonthRevenue)
                .divide(lastMonthRevenue, 4, RoundingMode.HALF_UP).doubleValue() * 100;
            revenueData.setMonthGrowthRate(monthGrowthRate);
            
            // 构建分类营收列表
            List<RevenueData.CategoryRevenue> categoryList = new ArrayList<>();
            String[] categories = {"产品服务", "会员服务", "广告服务", "其他收入"};
            BigDecimal[] amounts = {
                new BigDecimal("650000.00"),
                new BigDecimal("380000.00"),
                new BigDecimal("150000.00"),
                new BigDecimal("78000.00")
            };
            
            for (int i = 0; i < categories.length; i++) {
                RevenueData.CategoryRevenue cr = new RevenueData.CategoryRevenue();
                cr.setCategoryName(categories[i]);
                cr.setAmount(amounts[i]);
                
                Double percentage = amounts[i].divide(totalRevenue, 4, RoundingMode.HALF_UP).doubleValue() * 100;
                cr.setPercentage(percentage);
                
                categoryList.add(cr);
            }
            
            revenueData.setCategoryList(categoryList);
            
            log.info("获取营收数据成功，总营收：{}", totalRevenue);
            return revenueData;
        } catch (Exception e) {
            log.error("获取营收数据失败", e);
            throw new RuntimeException("获取营收数据失败：" + e.getMessage());
        }
    }
}
