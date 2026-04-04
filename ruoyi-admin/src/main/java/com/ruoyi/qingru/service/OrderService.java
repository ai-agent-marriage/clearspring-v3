package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaOrderRequest;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 订单服务类
 */
@Slf4j
@Service
public class OrderService {
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    @Autowired
    private WxMaService wxMaService;
    
    @Autowired
    private CertificateService certificateService;
    
    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建后的订单
     */
    public OrderProtect createOrder(OrderProtect order) {
        log.info("创建订单，userId={}, speciesId={}, quantity={}, amount={}", 
                order.getUserId(), order.getSpeciesId(), 
                order.getQuantity(), order.getAmount());
        
        // 生成订单号
        order.setOrderNo(generateOrderNo());
        order.setStatus(1); // 1=待承接
        
        // 插入订单
        orderMapper.insert(order);
        log.info("订单创建成功，orderNo={}", order.getOrderNo());
        
        return order;
    }
    
    /**
     * 支付订单
     * @param orderNo 订单号
     * @param openid 用户 openid
     * @return 支付参数
     */
    public Map<String, String> payOrder(String orderNo, String openid) {
        log.info("支付订单，orderNo={}, openid={}", orderNo, openid);
        
        // 查询订单
        OrderProtect order = orderMapper.selectByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        
        // 调用微信支付统一下单
        try {
            WxMaOrderRequest request = new WxMaOrderRequest();
            request.setOutTradeNo(orderNo);
            request.setTotalAmount(order.getAmount().multiply(new java.math.BigDecimal("100")).intValue());
            request.setBody("护生订单-" + orderNo);
            request.setOpenid(openid);
            
            Map<String, String> payParams = wxMaService.createOrder(request);
            log.info("微信支付下单成功，orderNo={}", orderNo);
            
            // 更新订单支付时间
            order.setPayTime(new Date());
            orderMapper.update(order);
            
            return payParams;
        } catch (Exception e) {
            log.error("微信支付下单失败", e);
            throw new RuntimeException("支付下单失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取我的订单列表
     * @param userId 用户 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单列表
     */
    public List<OrderProtect> getMyOrders(Long userId, Integer status, 
                                          Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取订单列表，userId={}, status={}, pageNum={}, pageSize={}", 
                userId, status, pageNum, pageSize);
        return orderMapper.selectByUserId(userId, status, offset, pageSize);
    }
    
    /**
     * 确认订单
     * @param orderNo 订单号
     * @param score 评分
     * @param comment 评价
     */
    public void confirmOrder(String orderNo, Integer score, String comment) {
        log.info("确认订单，orderNo={}, score={}, comment={}", orderNo, score, comment);
        
        OrderProtect order = orderMapper.selectByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        
        // 更新订单状态为已完成
        order.setStatus(5); // 5=已完成
        order.setCompleteTime(new Date());
        orderMapper.update(order);
        
        // 生成付费证书
        try {
            certificateService.generatePaidCertificate(order);
            log.info("付费证书生成成功，orderNo={}", orderNo);
        } catch (Exception e) {
            log.error("付费证书生成失败", e);
        }
    }
    
    /**
     * 生成订单号
     * @return 订单号
     */
    private String generateOrderNo() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "PRO" + date + random;
    }
    
    /**
     * 根据订单号查询订单
     * @param orderNo 订单号
     * @return 订单
     */
    public OrderProtect getByOrderNo(String orderNo) {
        return orderMapper.selectByOrderNo(orderNo);
    }
    
    /**
     * 订单状态流转
     * 1 待承接 → 2 待执行 → 3 执行中 → 4 待确认 → 5 已完成 → 6 已结算
     * @param orderNo 订单号
     * @param newStatus 新状态
     */
    public void updateOrderStatus(String orderNo, Integer newStatus) {
        log.info("订单状态流转，orderNo={}, newStatus={}", orderNo, newStatus);
        
        OrderProtect order = orderMapper.selectByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        
        // 验证状态流转是否合法
        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
            throw new RuntimeException("订单状态流转不合法，从状态 " + order.getStatus() + " 不能流转到状态 " + newStatus);
        }
        
        order.setStatus(newStatus);
        if (newStatus == 5) { // 已完成
            order.setCompleteTime(new Date());
        }
        
        orderMapper.update(order);
        log.info("订单状态更新成功，orderNo={}, oldStatus={}, newStatus={}", 
                orderNo, order.getStatus(), newStatus);
    }
    
    /**
     * 验证状态流转是否合法
     * @param fromStatus 原状态
     * @param toStatus 目标状态
     * @return 是否合法
     */
    private boolean isValidStatusTransition(Integer fromStatus, Integer toStatus) {
        // 定义合法的状态流转
        Map<Integer, List<Integer>> validTransitions = new HashMap<>();
        validTransitions.put(1, Arrays.asList(2, 6));       // 待承接 → 待执行/已取消
        validTransitions.put(2, Arrays.asList(3, 6));       // 待执行 → 执行中/已取消
        validTransitions.put(3, Arrays.asList(4));          // 执行中 → 待确认
        validTransitions.put(4, Arrays.asList(5));          // 待确认 → 已完成
        validTransitions.put(5, Arrays.asList(6));          // 已完成 → 已结算
        
        return validTransitions.getOrDefault(fromStatus, new ArrayList<>()).contains(toStatus);
    }
    
    /**
     * 48 小时无机构承接自动取消
     */
    @Scheduled(cron = "0 0 * * * ?") // 每小时执行一次
    public void autoCancelUnclaimedOrders() {
        log.info("开始执行自动取消未承接订单任务");
        
        List<OrderProtect> orders = orderMapper.selectUnclaimedOrders();
        int cancelledCount = 0;
        
        for (OrderProtect order : orders) {
            long hoursSinceCreate = (System.currentTimeMillis() - order.getCreateTime().getTime()) / (1000 * 60 * 60);
            if (hoursSinceCreate > 48) {
                try {
                    // 自动取消订单
                    updateOrderStatus(order.getOrderNo(), 6);
                    // 触发退款
                    refundOrder(order.getOrderNo());
                    cancelledCount++;
                    log.info("自动取消订单成功，orderNo={}, 创建时间={}", order.getOrderNo(), order.getCreateTime());
                } catch (Exception e) {
                    log.error("自动取消订单失败，orderNo={}", order.getOrderNo(), e);
                }
            }
        }
        
        log.info("自动取消未承接订单任务完成，共取消 {} 个订单", cancelledCount);
    }
    
    /**
     * 退款订单
     * @param orderNo 订单号
     */
    private void refundOrder(String orderNo) {
        log.info("执行订单退款，orderNo={}", orderNo);
        // TODO: 调用微信支付退款接口
        // 这里预留退款逻辑，实际项目中需要调用微信支付退款 API
    }
    
    /**
     * 申请复核
     * @param orderNo 订单号
     * @param reason 复核原因
     */
    public void applyReview(String orderNo, String reason) {
        log.info("申请复核，orderNo={}, reason={}", orderNo, reason);
        
        OrderProtect order = orderMapper.selectByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        
        // TODO: 创建复核记录，通知管理员
        log.info("复核申请已提交，orderNo={}, reason={}", orderNo, reason);
    }
    
    /**
     * 更新订单
     * @param order 订单
     */
    public void update(OrderProtect order) {
        orderMapper.update(order);
    }
}
