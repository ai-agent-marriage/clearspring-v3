package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.*;
import com.ruoyi.qingru.service.AdminFinanceService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import java.math.BigDecimal;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 后台财务管理服务单元测试
 * 测试财务管理、结算、发票等功能
 */
@SpringBootTest
public class AdminFinanceServiceTest {

    @Autowired
    private AdminFinanceService adminFinanceService;

    /**
     * 测试成功获取财务统计
     * 验证可以获取完整的财务统计数据
     */
    @Test
    public void testGetStats_Success() {
        FinanceStats stats = adminFinanceService.getStats();

        assertNotNull(stats, "财务统计对象不应为空");
        assertNotNull(stats.getTotalRevenue(), "总营收不应为空");
        assertTrue(stats.getTotalRevenue().compareTo(BigDecimal.ZERO) >= 0, "总营收应为非负数");
    }

    /**
     * 测试财务统计数据完整性
     * 验证财务统计包含所有必要字段
     */
    @Test
    public void testFinanceStatsCompleteness() {
        FinanceStats stats = adminFinanceService.getStats();

        assertNotNull(stats.getTotalRevenue(), "总营收不应为空");
        assertNotNull(stats.getPendingSettlement(), "待结算金额不应为空");
        assertNotNull(stats.getSettledAmount(), "已结算金额不应为空");
        assertNotNull(stats.getPendingInvoice(), "待开票金额不应为空");
        assertNotNull(stats.getInvoicedAmount(), "已开票金额不应为空");
        assertNotNull(stats.getTotalOrders(), "订单总数不应为空");
        assertNotNull(stats.getRefundAmount(), "退款金额不应为空");
        assertNotNull(stats.getRefundRate(), "退款率不应为空");
        assertNotNull(stats.getProfitMargin(), "毛利率不应为空");
    }

    /**
     * 测试财务统计数据合理性
     * 验证财务统计数据在合理范围内
     */
    @Test
    public void testFinanceStatsValidity() {
        FinanceStats stats = adminFinanceService.getStats();

        assertTrue(stats.getTotalRevenue().compareTo(BigDecimal.ZERO) >= 0, "总营收应为非负数");
        assertTrue(stats.getPendingSettlement().compareTo(BigDecimal.ZERO) >= 0, "待结算金额应为非负数");
        assertTrue(stats.getSettledAmount().compareTo(BigDecimal.ZERO) >= 0, "已结算金额应为非负数");
        assertTrue(stats.getTotalOrders() >= 0, "订单总数应为非负数");
        assertTrue(stats.getRefundRate() >= 0 && stats.getRefundRate() <= 100, "退款率应在 0-100 之间");
        assertTrue(stats.getProfitMargin() >= 0 && stats.getProfitMargin() <= 100, "毛利率应在 0-100 之间");
    }

    /**
     * 测试获取订单财务列表
     * 验证可以获取订单财务列表
     */
    @Test
    public void testGetOrders_Success() {
        List<FinanceOrder> orders = adminFinanceService.getOrders(null, 1, 10);

        assertNotNull(orders, "订单财务列表不应为空");
        assertTrue(orders.size() > 0, "订单财务列表应包含至少一条记录");
    }

    /**
     * 测试按状态获取订单财务列表
     * 验证可以按状态筛选订单
     */
    @Test
    public void testGetOrdersByStatus() {
        List<FinanceOrder> orders = adminFinanceService.getOrders(1, 1, 10);

        assertNotNull(orders, "订单财务列表不应为空");
        // 验证返回的订单状态都是 1
        orders.forEach(order -> {
            assertNotNull(order.getOrderId(), "订单 ID 不应为空");
            assertNotNull(order.getOrderNo(), "订单号不应为空");
            assertNotNull(order.getAmount(), "订单金额不应为空");
        });
    }

    /**
     * 测试订单财务列表分页
     * 验证分页功能正常
     */
    @Test
    public void testGetOrdersPagination() {
        List<FinanceOrder> page1 = adminFinanceService.getOrders(null, 1, 10);
        List<FinanceOrder> page2 = adminFinanceService.getOrders(null, 2, 10);

        assertNotNull(page1, "第一页数据不应为空");
        assertNotNull(page2, "第二页数据不应为空");
        assertEquals(10, page1.size(), "第一页应有 10 条记录");
        assertEquals(10, page2.size(), "第二页应有 10 条记录");
    }

    /**
     * 测试订单财务数据结构
     * 验证订单财务数据包含所有必要字段
     */
    @Test
    public void testFinanceOrderStructure() {
        List<FinanceOrder> orders = adminFinanceService.getOrders(null, 1, 5);

        orders.forEach(order -> {
            assertNotNull(order.getOrderId(), "订单 ID 不应为空");
            assertNotNull(order.getOrderNo(), "订单号不应为空");
            assertNotNull(order.getUserId(), "用户 ID 不应为空");
            assertNotNull(order.getUserName(), "用户姓名不应为空");
            assertNotNull(order.getAmount(), "订单金额不应为空");
            assertNotNull(order.getPayAmount(), "支付金额不应为空");
            assertNotNull(order.getRevenue(), "实际收入不应为空");
            assertNotNull(order.getStatus(), "订单状态不应为空");
            assertNotNull(order.getSettlementStatus(), "结算状态不应为空");
            assertNotNull(order.getInvoiceStatus(), "发票状态不应为空");
        });
    }

    /**
     * 测试获取结算列表
     * 验证可以获取结算列表
     */
    @Test
    public void testGetSettlements_Success() {
        List<Settlement> settlements = adminFinanceService.getSettlements(null, 1, 10);

        assertNotNull(settlements, "结算列表不应为空");
        assertTrue(settlements.size() > 0, "结算列表应包含至少一条记录");
    }

    /**
     * 测试按状态获取结算列表
     * 验证可以按状态筛选结算
     */
    @Test
    public void testGetSettlementsByStatus() {
        List<Settlement> settlements = adminFinanceService.getSettlements(1, 1, 10);

        assertNotNull(settlements, "结算列表不应为空");
        settlements.forEach(settlement -> {
            assertNotNull(settlement.getSettlementId(), "结算 ID 不应为空");
            assertNotNull(settlement.getSettlementNo(), "结算单号不应为空");
            assertNotNull(settlement.getAmount(), "结算金额不应为空");
        });
    }

    /**
     * 测试结算列表分页
     * 验证分页功能正常
     */
    @Test
    public void testGetSettlementsPagination() {
        List<Settlement> page1 = adminFinanceService.getSettlements(null, 1, 10);
        List<Settlement> page2 = adminFinanceService.getSettlements(null, 2, 10);

        assertNotNull(page1, "第一页数据不应为空");
        assertNotNull(page2, "第二页数据不应为空");
        assertEquals(10, page1.size(), "第一页应有 10 条记录");
        assertEquals(10, page2.size(), "第二页应有 10 条记录");
    }

    /**
     * 测试结算数据结构
     * 验证结算数据包含所有必要字段
     */
    @Test
    public void testSettlementStructure() {
        List<Settlement> settlements = adminFinanceService.getSettlements(null, 1, 5);

        settlements.forEach(settlement -> {
            assertNotNull(settlement.getSettlementId(), "结算 ID 不应为空");
            assertNotNull(settlement.getSettlementNo(), "结算单号不应为空");
            assertNotNull(settlement.getSettlementType(), "结算类型不应为空");
            assertNotNull(settlement.getTargetId(), "结算对象 ID 不应为空");
            assertNotNull(settlement.getTargetName(), "结算对象名称不应为空");
            assertNotNull(settlement.getAmount(), "结算金额不应为空");
            assertNotNull(settlement.getFee(), "手续费不应为空");
            assertNotNull(settlement.getActualAmount(), "实际到账不应为空");
            assertNotNull(settlement.getStatus(), "结算状态不应为空");
        });
    }

    /**
     * 测试确认结算
     * 验证可以确认结算
     */
    @Test
    public void testSettle_Success() {
        assertDoesNotThrow(() -> {
            adminFinanceService.settle(5001L);
        }, "确认结算不应抛出异常");
    }

    /**
     * 测试确认结算 - 无效 ID
     * 验证无效结算 ID 会抛出异常
     */
    @Test
    public void testSettle_InvalidId() {
        assertThrows(RuntimeException.class, () -> {
            adminFinanceService.settle(-1L);
        }, "无效结算 ID 应抛出异常");
    }

    /**
     * 测试获取发票列表
     * 验证可以获取发票列表
     */
    @Test
    public void testGetInvoices_Success() {
        List<Invoice> invoices = adminFinanceService.getInvoices(null, 1, 10);

        assertNotNull(invoices, "发票列表不应为空");
        assertTrue(invoices.size() > 0, "发票列表应包含至少一条记录");
    }

    /**
     * 测试按状态获取发票列表
     * 验证可以按状态筛选发票
     */
    @Test
    public void testGetInvoicesByStatus() {
        List<Invoice> invoices = adminFinanceService.getInvoices(1, 1, 10);

        assertNotNull(invoices, "发票列表不应为空");
        invoices.forEach(invoice -> {
            assertNotNull(invoice.getId(), "发票 ID 不应为空");
            assertNotNull(invoice.getInvoiceNo(), "发票号不应为空");
            assertNotNull(invoice.getAmount(), "发票金额不应为空");
        });
    }

    /**
     * 测试发票列表分页
     * 验证分页功能正常
     */
    @Test
    public void testGetInvoicesPagination() {
        List<Invoice> page1 = adminFinanceService.getInvoices(null, 1, 10);
        List<Invoice> page2 = adminFinanceService.getInvoices(null, 2, 10);

        assertNotNull(page1, "第一页数据不应为空");
        assertNotNull(page2, "第二页数据不应为空");
        assertEquals(10, page1.size(), "第一页应有 10 条记录");
        assertEquals(10, page2.size(), "第二页应有 10 条记录");
    }

    /**
     * 测试发票数据结构
     * 验证发票数据包含所有必要字段
     */
    @Test
    public void testInvoiceStructure() {
        List<Invoice> invoices = adminFinanceService.getInvoices(null, 1, 5);

        invoices.forEach(invoice -> {
            assertNotNull(invoice.getId(), "发票 ID 不应为空");
            assertNotNull(invoice.getInvoiceNo(), "发票号不应为空");
            assertNotNull(invoice.getOrderId(), "订单 ID 不应为空");
            assertNotNull(invoice.getOrderNo(), "订单号不应为空");
            assertNotNull(invoice.getUserId(), "用户 ID 不应为空");
            assertNotNull(invoice.getUserName(), "用户姓名不应为空");
            assertNotNull(invoice.getTitle(), "发票抬头不应为空");
            assertNotNull(invoice.getAmount(), "发票金额不应为空");
            assertNotNull(invoice.getStatus(), "发票状态不应为空");
        });
    }

    /**
     * 测试更新发票状态
     * 验证可以更新发票状态
     */
    @Test
    public void testUpdateInvoice_Success() {
        assertDoesNotThrow(() -> {
            adminFinanceService.updateInvoice(8001L, 1);
        }, "更新发票状态不应抛出异常");
    }

    /**
     * 测试更新发票状态 - 无效 ID
     * 验证无效发票 ID 会抛出异常
     */
    @Test
    public void testUpdateInvoice_InvalidId() {
        assertThrows(RuntimeException.class, () -> {
            adminFinanceService.updateInvoice(-1L, 1);
        }, "无效发票 ID 应抛出异常");
    }

    /**
     * 测试更新发票状态 - 无效状态
     * 验证无效状态会抛出异常
     */
    @Test
    public void testUpdateInvoice_InvalidStatus() {
        assertThrows(RuntimeException.class, () -> {
            adminFinanceService.updateInvoice(8001L, 10);
        }, "无效发票状态应抛出异常");
    }

    /**
     * 测试导出财务数据 - Excel
     * 验证可以导出 Excel 格式财务数据
     */
    @Test
    public void testExportFinance_Excel() {
        byte[] data = adminFinanceService.exportFinance(1);

        assertNotNull(data, "导出的 Excel 数据不应为空");
        assertTrue(data.length > 0, "导出的 Excel 数据应包含内容");
    }

    /**
     * 测试导出财务数据 - CSV
     * 验证可以导出 CSV 格式财务数据
     */
    @Test
    public void testExportFinance_CSV() {
        byte[] data = adminFinanceService.exportFinance(2);

        assertNotNull(data, "导出的 CSV 数据不应为空");
        assertTrue(data.length > 0, "导出的 CSV 数据应包含内容");
    }

    /**
     * 测试导出财务数据 - 无效类型
     * 验证无效导出类型会抛出异常
     */
    @Test
    public void testExportFinance_InvalidType() {
        assertThrows(RuntimeException.class, () -> {
            adminFinanceService.exportFinance(5);
        }, "无效导出类型应抛出异常");
    }

    /**
     * 测试获取营收数据
     * 验证可以获取营收数据
     */
    @Test
    public void testGetRevenue_Success() {
        RevenueData revenue = adminFinanceService.getRevenue();

        assertNotNull(revenue, "营收数据对象不应为空");
        assertNotNull(revenue.getTotalRevenue(), "总营收不应为空");
        assertTrue(revenue.getTotalRevenue().compareTo(BigDecimal.ZERO) >= 0, "总营收应为非负数");
    }

    /**
     * 测试营收数据完整性
     * 验证营收数据包含所有必要字段
     */
    @Test
    public void testRevenueDataCompleteness() {
        RevenueData revenue = adminFinanceService.getRevenue();

        assertNotNull(revenue.getTotalRevenue(), "总营收不应为空");
        assertNotNull(revenue.getTodayRevenue(), "今日营收不应为空");
        assertNotNull(revenue.getYesterdayRevenue(), "昨日营收不应为空");
        assertNotNull(revenue.getGrowthRate(), "环比增长率不应为空");
        assertNotNull(revenue.getMonthRevenue(), "本月营收不应为空");
        assertNotNull(revenue.getLastMonthRevenue(), "上月营收不应为空");
        assertNotNull(revenue.getMonthGrowthRate(), "本月同比增长不应为空");
        assertNotNull(revenue.getCategoryList(), "分类营收列表不应为空");
    }

    /**
     * 测试营收数据合理性
     * 验证营收数据在合理范围内
     */
    @Test
    public void testRevenueDataValidity() {
        RevenueData revenue = adminFinanceService.getRevenue();

        assertTrue(revenue.getTotalRevenue().compareTo(BigDecimal.ZERO) >= 0, "总营收应为非负数");
        assertTrue(revenue.getTodayRevenue().compareTo(BigDecimal.ZERO) >= 0, "今日营收应为非负数");
        assertTrue(revenue.getYesterdayRevenue().compareTo(BigDecimal.ZERO) >= 0, "昨日营收应为非负数");
        assertTrue(revenue.getMonthRevenue().compareTo(BigDecimal.ZERO) >= 0, "本月营收应为非负数");
        assertTrue(revenue.getLastMonthRevenue().compareTo(BigDecimal.ZERO) >= 0, "上月营收应为非负数");
    }

    /**
     * 测试分类营收数据
     * 验证分类营收数据正确
     */
    @Test
    public void testCategoryRevenue() {
        RevenueData revenue = adminFinanceService.getRevenue();

        assertNotNull(revenue.getCategoryList(), "分类营收列表不应为空");
        assertTrue(revenue.getCategoryList().size() > 0, "分类营收列表应包含至少一条记录");

        revenue.getCategoryList().forEach(category -> {
            assertNotNull(category.getCategoryName(), "分类名称不应为空");
            assertNotNull(category.getAmount(), "分类营收不应为空");
            assertNotNull(category.getPercentage(), "占比不应为空");
            assertTrue(category.getPercentage() >= 0 && category.getPercentage() <= 100, "占比应在 0-100 之间");
        });
    }

    /**
     * 测试营收增长率计算
     * 验证增长率计算正确
     */
    @Test
    public void testRevenueGrowthRate() {
        RevenueData revenue = adminFinanceService.getRevenue();

        assertNotNull(revenue.getGrowthRate(), "环比增长率不应为空");
        assertNotNull(revenue.getMonthGrowthRate(), "本月同比增长不应为空");
    }
}
