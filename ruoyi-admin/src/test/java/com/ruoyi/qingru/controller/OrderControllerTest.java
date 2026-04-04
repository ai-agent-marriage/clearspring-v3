package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        testOrder.setSpeciesId(1L);
        testOrder.setQuantity(10);
        testOrder.setAmount(new BigDecimal("100.00"));
    }
    
    @Test
    void testCreateOrder() {
        when(orderService.createOrder(any(OrderProtect.class))).thenReturn(testOrder);
        
        R<OrderProtect> result = orderController.createOrder(testOrder);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        verify(orderService, times(1)).createOrder(any(OrderProtect.class));
    }
    
    @Test
    void testPayOrder() {
        Map<String, String> payParams = new HashMap<>();
        payParams.put("appId", "wx123456");
        payParams.put("timeStamp", "1234567890");
        
        when(orderService.payOrder(anyString(), anyString())).thenReturn(payParams);
        
        OrderController.PayRequest request = new OrderController.PayRequest();
        request.setOrderNo("PRO202604040001");
        request.setOpenid("test_openid");
        
        R<Map<String, String>> result = orderController.payOrder(request);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
    
    @Test
    void testGetMyOrders() {
        List<OrderProtect> mockList = new ArrayList<>();
        mockList.add(testOrder);
        when(orderService.getMyOrders(anyLong(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        R<List<OrderProtect>> result = orderController.getMyOrders(1L, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testConfirmOrder() {
        doNothing().when(orderService).confirmOrder(anyString(), anyInt(), anyString());
        
        OrderController.ConfirmRequest request = new OrderController.ConfirmRequest();
        request.setScore(5);
        request.setComment("很好的服务");
        
        R<Void> result = orderController.confirmOrder("PRO202604040001", request);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }
}
