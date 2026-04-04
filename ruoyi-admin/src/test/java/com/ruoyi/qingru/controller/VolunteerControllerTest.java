package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Volunteer;
import com.ruoyi.qingru.service.VolunteerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 志愿者控制器测试
 */
@ExtendWith(MockitoExtension.class)
class VolunteerControllerTest {
    
    @Mock
    private VolunteerService volunteerService;
    
    @InjectMocks
    private VolunteerController volunteerController;
    
    private Volunteer testVolunteer;
    
    @BeforeEach
    void setUp() {
        testVolunteer = new Volunteer();
        testVolunteer.setId(1L);
        testVolunteer.setRealName("张三");
        testVolunteer.setPhone("13800138000");
        testVolunteer.setOrgId(100L);
        testVolunteer.setStatus(1);
        testVolunteer.setTotalTasks(10);
        testVolunteer.setServiceHours(20);
        testVolunteer.setComplianceRate(new BigDecimal("95.00"));
        testVolunteer.setCreateTime(new Date());
    }
    
    @Test
    void testGetDetail() {
        when(volunteerService.getVolunteerDetail(1L)).thenReturn(testVolunteer);
        
        R<Volunteer> result = volunteerController.getDetail(1L);
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals("张三", result.getData().getRealName());
        assertEquals(10, result.getData().getTotalTasks().intValue());
    }
    
    @Test
    void testGetDetail_NotFound() {
        when(volunteerService.getVolunteerDetail(999L))
            .thenThrow(new RuntimeException("志愿者不存在"));
        
        R<Volunteer> result = volunteerController.getDetail(999L);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("获取失败"));
    }
    
    @Test
    void testUpdate() {
        doNothing().when(volunteerService).updateVolunteer(eq(1L), any(Volunteer.class));
        
        R<Void> result = volunteerController.update(1L, testVolunteer);
        
        assertEquals(200, result.getCode());
        verify(volunteerService, times(1)).updateVolunteer(eq(1L), any(Volunteer.class));
    }
    
    @Test
    void testUpdate_Failure() {
        doThrow(new RuntimeException("更新失败"))
            .when(volunteerService).updateVolunteer(eq(1L), any(Volunteer.class));
        
        R<Void> result = volunteerController.update(1L, testVolunteer);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("更新失败"));
    }
}
