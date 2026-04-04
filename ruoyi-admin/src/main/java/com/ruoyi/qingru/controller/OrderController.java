package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.ReviewRequest;
import com.ruoyi.qingru.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/order")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    
    @Autowired
    private OrderService orderService;
    
    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建后的订单
     */
    @PostMapping("/create")
    public R<OrderProtect> createOrder(@RequestBody OrderProtect order) {
        log.info("创建订单，userId={}, speciesId={}", order.getUserId(), order.getSpeciesId());
        try {
            OrderProtect created = orderService.createOrder(order);
            return R.ok(created, "订单创建成功");
        } catch (Exception e) {
            log.error("创建订单失败", e);
            return R.fail("创建失败：" + e.getMessage());
        }
    }
    
    /**
     * 支付订单
     * @param request 支付请求
     * @return 支付参数
     */
    @PostMapping("/pay")
    public R<Map<String, String>> payOrder(@RequestBody PayRequest request) {
        log.info("支付订单，orderNo={}, openid={}", request.getOrderNo(), request.getOpenid());
        try {
            Map<String, String> payParams = orderService.payOrder(
                request.getOrderNo(), 
                request.getOpenid()
            );
            return R.ok(payParams, "支付下单成功");
        } catch (Exception e) {
            log.error("支付订单失败", e);
            return R.fail("支付失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取我的订单列表
     * @param userId 用户 ID
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单列表
     */
    @GetMapping("/my")
    public R<List<OrderProtect>> getMyOrders(
            @RequestParam Long userId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取订单列表，userId={}, status={}, pageNum={}, pageSize={}", 
                userId, status, pageNum, pageSize);
        List<OrderProtect> list = orderService.getMyOrders(userId, status, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 确认订单
     * @param orderNo 订单号
     * @param request 确认请求
     * @return 操作结果
     */
    @PutMapping("/confirm/{orderNo}")
    public R<Void> confirmOrder(
            @PathVariable String orderNo,
            @RequestBody ConfirmRequest request) {
        log.info("确认订单，orderNo={}, score={}", orderNo, request.getScore());
        try {
            orderService.confirmOrder(orderNo, request.getScore(), request.getComment());
            return R.ok(null, "确认成功");
        } catch (Exception e) {
            log.error("确认订单失败", e);
            return R.fail("确认失败：" + e.getMessage());
        }
    }
    
    /**
     * 支付请求
     */
    public static class PayRequest {
        private String orderNo;
        private String openid;
        
        public String getOrderNo() { return orderNo; }
        public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
        public String getOpenid() { return openid; }
        public void setOpenid(String openid) { this.openid = openid; }
    }
    
    /**
     * 确认请求
     */
    public static class ConfirmRequest {
        private Integer score;
        private String comment;
        
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
    
    /**
     * 取消订单
     * @param orderNo 订单号
     * @return 操作结果
     */
    @PutMapping("/cancel/{orderNo}")
    public R<Void> cancelOrder(@PathVariable String orderNo) {
        log.info("取消订单，orderNo={}", orderNo);
        try {
            orderService.updateOrderStatus(orderNo, 6);
            return R.ok(null, "订单取消成功");
        } catch (Exception e) {
            log.error("取消订单失败", e);
            return R.fail("取消失败：" + e.getMessage());
        }
    }
    
    /**
     * 申请复核
     * @param orderNo 订单号
     * @param request 复核请求
     * @return 操作结果
     */
    @PostMapping("/review/{orderNo}")
    public R<Void> applyReview(
            @PathVariable String orderNo,
            @RequestBody ReviewRequest request) {
        log.info("申请复核，orderNo={}, reason={}", orderNo, request.getReason());
        try {
            orderService.applyReview(orderNo, request.getReason());
            return R.ok(null, "复核申请已提交");
        } catch (Exception e) {
            log.error("申请复核失败", e);
            return R.fail("复核申请失败：" + e.getMessage());
        }
    }
}
