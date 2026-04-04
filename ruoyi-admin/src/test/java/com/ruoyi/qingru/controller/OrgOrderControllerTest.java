package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.service.OrgOrderService;
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
 * 机构承接订单控制器测试
 */
@ExtendWith(MockitoExtension.class)
class OrgOrderControllerTest {
    
    @Mock
    private OrgOrderService orgOrderService;
    
    @InjectMocks
    private OrgOrderController orgOrderController;
    
    private OrderProtect testOrder;
    
    @BeforeEach
    void setUp() {
        testOrder = new OrderProtect();
        testOrder.setOrderNo("PRO202604040001");
        testOrder.setAmount(new BigDecimal("100.00"));
        testOrder.setStatus(1);
    }
    
    @Test
    void testGetAvailableOrders() {
        List<OrderProtect> mockList = new ArrayList<>();
        mockList.add(testOrder);
        when(orgOrderService.getAvailableOrders(100L, 1, 10)).thenReturn(mockList);
        
        R<List<OrderProtect>> result = orgOrderController.getAvailableOrders(100L, 1, 10);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testAcceptOrder() {
        doNothing().when(orgOrderService).acceptOrder("PRO202604040001", 100L);
        
        R<Void> result = orgOrderController.acceptOrder("PRO202604040001", 100L);
        
        assertEquals(200, result.getCode());
        verify(orgOrderService, times(1)).acceptOrder("PRO202604040001", 100L);
    }
    
    @Test
    void testAcceptOrder_Failure() {
        doThrow(new RuntimeException("订单状态不是待承接")).when(orgOrderService).acceptOrder("PRO202604040001", 100L);
        
        R<Void> result = orgOrderController.acceptOrder("PRO202604040001", 100L);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("承接失败"));
    }
}
