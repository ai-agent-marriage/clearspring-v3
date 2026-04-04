package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.*;
import com.ruoyi.qingru.service.AdminFinanceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 后台财务管理控制器
 */
@RestController
@RequestMapping("/api/admin/finance")
@Slf4j
public class AdminFinanceController {
    
    @Autowired
    private AdminFinanceService adminFinanceService;
    
    /**
     * 获取财务统计
     * @return 财务统计数据
     */
    @GetMapping("/stats")
    public R<FinanceStats> getStats() {
        log.info("获取财务统计");
        try {
            FinanceStats stats = adminFinanceService.getStats();
            return R.ok(stats, "获取财务统计成功");
        } catch (Exception e) {
            log.error("获取财务统计失败", e);
            return R.fail("获取财务统计失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取订单财务列表
     * @param status 订单状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单财务列表
     */
    @GetMapping("/orders")
    public R<List<FinanceOrder>> getOrders(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取订单财务列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<FinanceOrder> orders = adminFinanceService.getOrders(status, pageNum, pageSize);
            return R.ok(orders, "获取订单财务列表成功");
        } catch (Exception e) {
            log.error("获取订单财务列表失败", e);
            return R.fail("获取订单财务列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取结算列表
     * @param status 结算状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 结算列表
     */
    @GetMapping("/settlements")
    public R<List<FinanceSettlement>> getSettlements(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取结算列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<FinanceSettlement> settlements = adminFinanceService.getSettlements(status, pageNum, pageSize);
            return R.ok(settlements, "获取结算列表成功");
        } catch (Exception e) {
            log.error("获取结算列表失败", e);
            return R.fail("获取结算列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 确认结算
     * @param settlementId 结算 ID
     * @return 操作结果
     */
    @PostMapping("/settle")
    public R<String> settle(@RequestParam Long settlementId) {
        log.info("确认结算，settlementId={}", settlementId);
        try {
            adminFinanceService.settle(settlementId);
            return R.ok("确认结算成功");
        } catch (Exception e) {
            log.error("确认结算失败", e);
            return R.fail("确认结算失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取发票列表
     * @param status 发票状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 发票列表
     */
    @GetMapping("/invoices")
    public R<List<Invoice>> getInvoices(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取发票列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<Invoice> invoices = adminFinanceService.getInvoices(status, pageNum, pageSize);
            return R.ok(invoices, "获取发票列表成功");
        } catch (Exception e) {
            log.error("获取发票列表失败", e);
            return R.fail("获取发票列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新发票状态
     * @param id 发票 ID
     * @param status 发票状态
     * @return 操作结果
     */
    @PutMapping("/invoice/{id}")
    public R<String> updateInvoice(@PathVariable Long id, @RequestParam Integer status) {
        log.info("更新发票状态，id={}, status={}", id, status);
        try {
            adminFinanceService.updateInvoice(id, status);
            return R.ok("更新发票状态成功");
        } catch (Exception e) {
            log.error("更新发票状态失败", e);
            return R.fail("更新发票状态失败：" + e.getMessage());
        }
    }
    
    /**
     * 导出财务数据
     * @param type 导出类型 1-Excel 2-CSV
     * @return 导出的文件
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportFinance(@RequestParam(defaultValue = "1") Integer type) {
        log.info("导出财务数据，type={}", type);
        try {
            byte[] data = adminFinanceService.exportFinance(type);
            
            HttpHeaders headers = new HttpHeaders();
            String filename = "finance_" + System.currentTimeMillis() + (type == 1 ? ".xlsx" : ".csv");
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            
            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("导出财务数据失败", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 获取营收数据
     * @return 营收数据
     */
    @GetMapping("/revenue")
    public R<RevenueData> getRevenue() {
        log.info("获取营收数据");
        try {
            RevenueData revenue = adminFinanceService.getRevenue();
            return R.ok(revenue, "获取营收数据成功");
        } catch (Exception e) {
            log.error("获取营收数据失败", e);
            return R.fail("获取营收数据失败：" + e.getMessage());
        }
    }
}
