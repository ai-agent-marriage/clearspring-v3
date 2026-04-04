package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.OrderStats;
import com.ruoyi.qingru.service.AdminOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理后台订单控制器
 */
@RestController
@RequestMapping("/api/admin/orders")
@Slf4j
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminOrderController.class);

    /**
     * 获取订单列表
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单列表
     */
    @GetMapping("/list")
    public R<List<OrderProtect>> getList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取订单列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        try {
            List<OrderProtect> list = adminOrderService.getList(status, pageNum, pageSize);
            return R.ok(list, "获取成功");
        } catch (Exception e) {
            log.error("获取订单列表失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 获取订单详情
     * @param id 订单 ID
     * @return 订单详情
     */
    @GetMapping("/detail/{id}")
    public R<OrderProtect> getDetail(@PathVariable Long id) {
        log.info("获取订单详情，id={}", id);
        try {
            OrderProtect order = adminOrderService.getDetail(id);
            return R.ok(order, "获取成功");
        } catch (Exception e) {
            log.error("获取订单详情失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 更新订单状态
     * @param id 订单 ID
     * @param status 新状态
     * @return 操作结果
     */
    @PutMapping("/status/{id}")
    public R<String> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        log.info("更新订单状态，id={}, status={}", id, status);
        try {
            adminOrderService.updateStatus(id, status);
            return R.ok("更新成功");
        } catch (Exception e) {
            log.error("更新订单状态失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }

    /**
     * 删除订单
     * @param id 订单 ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public R<String> delete(@PathVariable Long id) {
        log.info("删除订单，id={}", id);
        try {
            adminOrderService.delete(id);
            return R.ok(null, "删除成功");
        } catch (Exception e) {
            log.error("删除订单失败", e);
            return R.fail(null, "删除失败：" + e.getMessage());
        }
    }

    /**
     * 导出订单数据
     * @param status 状态（可选）
     * @return Excel 文件
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportOrders(@RequestParam(required = false) Integer status) {
        log.info("导出订单数据，status={}", status);
        try {
            byte[] data = adminOrderService.exportOrders(status);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "orders_" + System.currentTimeMillis() + ".csv");
            
            return new ResponseEntity<>(data, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            log.error("导出订单数据失败", e);
            return new ResponseEntity<>(e.getMessage().getBytes(), org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 分配订单
     * @param id 订单 ID
     * @param volunteerId 志愿者 ID
     * @return 操作结果
     */
    @PutMapping("/assign/{id}")
    public R<String> assignOrder(@PathVariable Long id, @RequestParam Long volunteerId) {
        log.info("分配订单，id={}, volunteerId={}", id, volunteerId);
        try {
            adminOrderService.assignOrder(id, volunteerId);
            return R.ok(null, "分配成功");
        } catch (Exception e) {
            log.error("分配订单失败", e);
            return R.fail(null, "分配失败：" + e.getMessage());
        }
    }

    /**
     * 获取订单统计
     * @return 订单统计数据
     */
    @GetMapping("/stats")
    public R<OrderStats> getStats() {
        log.info("获取订单统计");
        try {
            OrderStats stats = adminOrderService.getStats();
            return R.ok(stats, "获取成功");
        } catch (Exception e) {
            log.error("获取订单统计失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 订单复核
     * @param id 订单 ID
     * @param reviewResult 复核结果（pass/reject）
     * @return 操作结果
     */
    @PutMapping("/review/{id}")
    public R<String> reviewOrder(@PathVariable Long id, @RequestParam String reviewResult) {
        log.info("订单复核，id={}, reviewResult={}", id, reviewResult);
        try {
            adminOrderService.reviewOrder(id, reviewResult);
            return R.ok("复核成功");
        } catch (Exception e) {
            log.error("订单复核失败", e);
            return R.fail("复核失败：" + e.getMessage());
        }
    }
}
