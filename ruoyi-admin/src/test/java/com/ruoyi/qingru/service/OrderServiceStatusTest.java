package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 订单服务状态流转测试
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceStatusTest {
    
    @Mock
    private OrderProtectMapper orderMapper;
    
    @Mock
    private CertificateService certificateService;
    
    @InjectMocks
    private OrderService orderService;
    
    private OrderProtect testOrder;
    
    @BeforeEach
    void setUp() {
        testOrder = new OrderProtect();
        testOrder.setOrderNo("PRO202604040001");
        testOrder.setUserId(1L);
        testOrder.setSpeciesId(1L);
        testOrder.setQuantity(10);
        testOrder.setAmount(new BigDecimal("100.00"));
        testOrder.setStatus(1); // 待承接
        testOrder.setCreateTime(new Date());
    }
    
    @Test
    void testUpdateOrderStatus_ValidTransition() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        when(orderMapper.update(any(OrderProtect.class))).thenReturn(1);
        
        orderService.updateOrderStatus("PRO202604040001", 2);
        
        assertEquals(2, testOrder.getStatus());
        verify(orderMapper, times(1)).update(any(OrderProtect.class));
    }
    
    @Test
    void testUpdateOrderStatus_InvalidTransition() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus("PRO202604040001", 5); // 从 1 直接到 5 不合法
        });
        
        assertTrue(exception.getMessage().contains("订单状态流转不合法"));
    }
    
    @Test
    void testUpdateOrderStatus_OrderNotFound() {
        when(orderMapper.selectByOrderNo("NOT_EXIST")).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus("NOT_EXIST", 2);
        });
        
        assertEquals("订单不存在", exception.getMessage());
    }
    
    @Test
    void testUpdateOrderStatus_CompleteOrder_SetsCompleteTime() {
        testOrder.setStatus(4); // 待确认
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        when(orderMapper.update(any(OrderProtect.class))).thenReturn(1);
        
        orderService.updateOrderStatus("PRO202604040001", 5); // 已完成
        
        assertNotNull(testOrder.getCompleteTime());
        assertEquals(5, testOrder.getStatus());
    }
    
    @Test
    void testGetByOrderNo() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        
        OrderProtect result = orderService.getByOrderNo("PRO202604040001");
        
        assertNotNull(result);
        assertEquals("PRO202604040001", result.getOrderNo());
    }
    
    @Test
    void testApplyReview() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        
        orderService.applyReview("PRO202604040001", "订单信息有误");
        
        verify(orderMapper, times(1)).selectByOrderNo("PRO202604040001");
    }
}
