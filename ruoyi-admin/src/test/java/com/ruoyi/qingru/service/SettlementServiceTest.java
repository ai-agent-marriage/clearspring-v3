package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.Settlement;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.SettlementMapper;
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
 * 结算服务测试
 */
@ExtendWith(MockitoExtension.class)
class SettlementServiceTest {
    
    @Mock
    private SettlementMapper settlementMapper;
    
    @Mock
    private OrderProtectMapper orderMapper;
    
    @InjectMocks
    private SettlementService settlementService;
    
    private OrderProtect testOrder;
    private Settlement testSettlement;
    
    @BeforeEach
    void setUp() {
        testOrder = new OrderProtect();
        testOrder.setOrderNo("PRO202604040001");
        testOrder.setOrgId(100L);
        testOrder.setAmount(new BigDecimal("100.00"));
        testOrder.setStatus(5); // 已完成
        
        testSettlement = new Settlement();
        testSettlement.setId(1L);
        testSettlement.setOrderNo("PRO202604040001");
        testSettlement.setOrgId(100L);
        testSettlement.setAmount(new BigDecimal("90.00"));
        testSettlement.setPlatformFee(new BigDecimal("10.00"));
        testSettlement.setStatus(1);
    }
    
    @Test
    void testCreateSettlement_Success() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        when(settlementMapper.selectByOrderNo("PRO202604040001")).thenReturn(null);
        when(settlementMapper.insert(any(Settlement.class))).thenReturn(1);
        
        Settlement result = settlementService.createSettlement("PRO202604040001");
        
        assertNotNull(result);
        assertEquals(new BigDecimal("90.00"), result.getAmount());
        assertEquals(new BigDecimal("10.00"), result.getPlatformFee());
        verify(settlementMapper, times(1)).insert(any(Settlement.class));
    }
    
    @Test
    void testCreateSettlement_OrderNotComplete() {
        testOrder.setStatus(3); // 执行中，未完成
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            settlementService.createSettlement("PRO202604040001");
        });
        
        assertTrue(exception.getMessage().contains("订单未完成"));
    }
    
    @Test
    void testCreateSettlement_AlreadySettled() {
        when(orderMapper.selectByOrderNo("PRO202604040001")).thenReturn(testOrder);
        when(settlementMapper.selectByOrderNo("PRO202604040001")).thenReturn(testSettlement);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            settlementService.createSettlement("PRO202604040001");
        });
        
        assertTrue(exception.getMessage().contains("订单已结算"));
    }
    
    @Test
    void testConfirmSettlement() {
        when(settlementMapper.selectById(1L)).thenReturn(testSettlement);
        when(settlementMapper.update(any(Settlement.class))).thenReturn(1);
        when(orderMapper.updateStatus("PRO202604040001", 6)).thenReturn(1);
        
        settlementService.confirmSettlement(1L);
        
        assertEquals(2, testSettlement.getStatus());
        assertNotNull(testSettlement.getSettlementTime());
        verify(settlementMapper, times(1)).update(any(Settlement.class));
        verify(orderMapper, times(1)).updateStatus("PRO202604040001", 6);
    }
    
    @Test
    void testConfirmSettlement_SettlementNotFound() {
        when(settlementMapper.selectById(999L)).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            settlementService.confirmSettlement(999L);
        });
        
        assertEquals("结算单不存在", exception.getMessage());
    }
    
    @Test
    void testGetSettlementsByOrgId() {
        List<Settlement> mockList = new ArrayList<>();
        mockList.add(testSettlement);
        when(settlementMapper.selectByOrgId(anyLong(), anyInt(), anyInt())).thenReturn(mockList);
        
        List<Settlement> result = settlementService.getSettlementsByOrgId(100L, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(settlementMapper, times(1)).selectByOrgId(100L, 0, 10);
    }
}
