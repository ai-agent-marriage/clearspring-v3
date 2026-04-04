package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.service.OrgOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 机构承接订单控制器
 */
@Slf4j
@RestController
@RequestMapping("/org/order")
public class OrgOrderController {
    
    @Autowired
    private OrgOrderService orgOrderService;
    
    /**
     * 获取可承接订单列表
     * @param orgId 机构 ID
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 可承接订单列表
     */
    @GetMapping("/available")
    public R<List<OrderProtect>> getAvailableOrders(
            @RequestParam Long orgId,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取可承接订单列表，orgId={}, pageNum={}, pageSize={}", orgId, pageNum, pageSize);
        List<OrderProtect> list = orgOrderService.getAvailableOrders(orgId, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 承接订单
     * @param orderNo 订单号
     * @param orgId 机构 ID
     * @return 操作结果
     */
    @PostMapping("/accept/{orderNo}")
    public R<Void> acceptOrder(
            @PathVariable String orderNo,
            @RequestParam Long orgId) {
        log.info("承接订单，orderNo={}, orgId={}", orderNo, orgId);
        try {
            orgOrderService.acceptOrder(orderNo, orgId);
            return R.ok(null, "承接成功");
        } catch (Exception e) {
            log.error("承接订单失败", e);
            return R.fail("承接失败：" + e.getMessage());
        }
    }
}
