package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaOrderRequest;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
}
