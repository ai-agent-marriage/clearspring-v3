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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 订单服务测试
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
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
        testOrder.setStatus(1);
        testOrder.setAddress("测试地点");
    }
    
    @Test
    void testCreateOrder() {
        when(orderMapper.insert(any(OrderProtect.class))).thenReturn(1);
        
        OrderProtect result = orderService.createOrder(testOrder);
        
        assertNotNull(result);
        assertNotNull(result.getOrderNo());
        assertTrue(result.getOrderNo().startsWith("PRO"));
        assertEquals(1, result.getStatus());
        verify(orderMapper, times(1)).insert(any(OrderProtect.class));
    }
    
    @Test
    void testGetMyOrders() {
        List<OrderProtect> mockList = new ArrayList<>();
        mockList.add(testOrder);
        when(orderMapper.selectByUserId(anyLong(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        List<OrderProtect> result = orderService.getMyOrders(1L, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(orderMapper, times(1)).selectByUserId(1L, null, 0, 10);
    }
    
    @Test
    void testConfirmOrder() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        when(orderMapper.update(any(OrderProtect.class))).thenReturn(1);
        
        orderService.confirmOrder("PRO202604040001", 5, "很好的服务");
        
        verify(orderMapper, times(1)).update(any(OrderProtect.class));
        verify(certificateService, times(1)).generatePaidCertificate(any(OrderProtect.class));
    }
    
    @Test
    void testConfirmOrder_OrderNotFound() {
        when(orderMapper.selectByOrderNo("NOT_EXIST")).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.confirmOrder("NOT_EXIST", 5, "评论");
        });
        
        assertEquals("订单不存在", exception.getMessage());
    }
}
