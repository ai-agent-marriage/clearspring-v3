package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.ReviewRequest;
import com.ruoyi.qingru.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 订单控制器测试
 */
@ExtendWith(MockitoExtension.class)
class OrderControllerTest {
    
    @Mock
    private OrderService orderService;
    
    @InjectMocks
    private OrderController orderController;
    
    private OrderProtect testOrder;
    
    @BeforeEach
    void setUp() {
        testOrder = new OrderProtect();
        testOrder.setOrderNo("PRO202604040001");
        testOrder.setUserId(1L);
        testOrder.setAmount(new BigDecimal("100.00"));
        testOrder.setStatus(1);
    }
    
    @Test
    void testCancelOrder() {
        doNothing().when(orderService).updateOrderStatus("PRO202604040001", 6);
        
        R<Void> result = orderController.cancelOrder("PRO202604040001");
        
        assertEquals(200, result.getCode());
        verify(orderService, times(1)).updateOrderStatus("PRO202604040001", 6);
    }
    
    @Test
    void testCancelOrder_Failure() {
        doThrow(new RuntimeException("订单不存在")).when(orderService).updateOrderStatus("NOT_EXIST", 6);
        
        R<Void> result = orderController.cancelOrder("NOT_EXIST");
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("取消失败"));
    }
    
    @Test
    void testApplyReview() {
        ReviewRequest request = new ReviewRequest();
        request.setReason("订单信息有误");
        doNothing().when(orderService).applyReview("PRO202604040001", "订单信息有误");
        
        R<Void> result = orderController.applyReview("PRO202604040001", request);
        
        assertEquals(200, result.getCode());
        verify(orderService, times(1)).applyReview("PRO202604040001", "订单信息有误");
    }
}
