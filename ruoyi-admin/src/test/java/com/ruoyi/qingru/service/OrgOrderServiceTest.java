package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrgOrder;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.OrgOrderMapper;
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
 * 机构承接订单服务测试
 */
@ExtendWith(MockitoExtension.class)
class OrgOrderServiceTest {
    
    @Mock
    private OrgOrderMapper orgOrderMapper;
    
    @Mock
    private OrderService orderService;
    
    @Mock
    private OrderProtectMapper orderMapper;
    
    @InjectMocks
    private OrgOrderService orgOrderService;
    
    private OrderProtect testOrder;
    private OrgOrder testOrgOrder;
    
    @BeforeEach
    void setUp() {
        testOrder = new OrderProtect();
        testOrder.setOrderNo("PRO202604040001");
        testOrder.setUserId(1L);
        testOrder.setAmount(new BigDecimal("100.00"));
        testOrder.setStatus(1); // 待承接
        
        testOrgOrder = new OrgOrder();
        testOrgOrder.setOrderNo("PRO202604040001");
        testOrgOrder.setOrgId(100L);
        testOrgOrder.setStatus(2);
        testOrgOrder.setAcceptTime(new Date());
    }
    
    @Test
    void testAcceptOrder_Success() {
        when(orderService.getByOrderNo("PRO202604040001")).thenReturn(testOrder);
        when(orgOrderMapper.insert(any(OrgOrder.class))).thenReturn(1);
        when(orderMapper.update(any(OrderProtect.class))).thenReturn(1);
        doNothing().when(orderService).updateOrderStatus("PRO202604040001", 2);
        
        orgOrderService.acceptOrder("PRO202604040001", 100L);
        
        verify(orgOrderMapper, times(1)).insert(any(OrgOrder.class));
        verify(orderService, times(1)).updateOrderStatus("PRO202604040001", 2);
    }
    
    @Test
    void testAcceptOrder_OrderNotFound() {
        when(orderService.getByOrderNo("NOT_EXIST")).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orgOrderService.acceptOrder("NOT_EXIST", 100L);
        });
        
        assertEquals("订单不存在", exception.getMessage());
    }
    
    @Test
    void testAcceptOrder_WrongStatus() {
        testOrder.setStatus(2); // 已经是待执行状态
        when(orderService.getByOrderNo("PRO202604040001")).thenReturn(testOrder);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orgOrderService.acceptOrder("PRO202604040001", 100L);
        });
        
        assertTrue(exception.getMessage().contains("订单状态不是待承接"));
    }
    
    @Test
    void testGetAvailableOrders() {
        List<OrderProtect> mockList = new ArrayList<>();
        mockList.add(testOrder);
        when(orderMapper.selectAvailableOrders(anyLong(), anyInt(), anyInt())).thenReturn(mockList);
        
        List<OrderProtect> result = orgOrderService.getAvailableOrders(100L, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(orderMapper, times(1)).selectAvailableOrders(100L, 0, 10);
    }
}
