package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Settlement;
import com.ruoyi.qingru.service.SettlementService;
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
 * 结算控制器测试
 */
@ExtendWith(MockitoExtension.class)
class SettlementControllerTest {
    
    @Mock
    private SettlementService settlementService;
    
    @InjectMocks
    private SettlementController settlementController;
    
    private Settlement testSettlement;
    
    @BeforeEach
    void setUp() {
        testSettlement = new Settlement();
        testSettlement.setId(1L);
        testSettlement.setOrderNo("PRO202604040001");
        testSettlement.setAmount(new BigDecimal("90.00"));
        testSettlement.setPlatformFee(new BigDecimal("10.00"));
        testSettlement.setStatus(1);
    }
    
    @Test
    void testCreateSettlement() {
        when(settlementService.createSettlement("PRO202604040001")).thenReturn(testSettlement);
        
        R<Settlement> result = settlementController.createSettlement("PRO202604040001");
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals("PRO202604040001", result.getData().getOrderNo());
    }
    
    @Test
    void testCreateSettlement_Failure() {
        when(settlementService.createSettlement("PRO202604040001"))
            .thenThrow(new RuntimeException("订单未完成"));
        
        R<Settlement> result = settlementController.createSettlement("PRO202604040001");
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("创建失败"));
    }
    
    @Test
    void testConfirmSettlement() {
        doNothing().when(settlementService).confirmSettlement(1L);
        
        R<Void> result = settlementController.confirmSettlement(1L);
        
        assertEquals(200, result.getCode());
        verify(settlementService, times(1)).confirmSettlement(1L);
    }
    
    @Test
    void testGetSettlements() {
        List<Settlement> mockList = new ArrayList<>();
        mockList.add(testSettlement);
        when(settlementService.getSettlementsByOrgId(100L, 1, 10)).thenReturn(mockList);
        
        R<List<Settlement>> result = settlementController.getSettlements(100L, 1, 10);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
}
