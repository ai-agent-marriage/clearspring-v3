package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.TaskExecute;
import com.ruoyi.qingru.service.TaskExecuteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 任务执行结果控制器测试
 */
@ExtendWith(MockitoExtension.class)
class TaskExecuteControllerTest {
    
    @Mock
    private TaskExecuteService taskExecuteService;
    
    @InjectMocks
    private TaskExecuteController taskExecuteController;
    
    private TaskExecute testExecute;
    
    @BeforeEach
    void setUp() {
        testExecute = new TaskExecute();
        testExecute.setId(1L);
        testExecute.setOrderNo("PRO202604070001");
        testExecute.setVolunteerId(1L);
        testExecute.setAddress("测试点位");
        testExecute.setRealQuantity(100);
        testExecute.setStatus(1);
        testExecute.setCreateTime(new Date());
    }
    
    @Test
    void testSubmit() {
        doNothing().when(taskExecuteService).submitExecute(any(TaskExecute.class));
        
        R<Void> result = taskExecuteController.submit(testExecute);
        
        assertEquals(200, result.getCode());
        verify(taskExecuteService, times(1)).submitExecute(any(TaskExecute.class));
    }
    
    @Test
    void testSubmit_Failure() {
        doThrow(new RuntimeException("图片包含违规内容"))
            .when(taskExecuteService).submitExecute(any(TaskExecute.class));
        
        R<Void> result = taskExecuteController.submit(testExecute);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("提交失败"));
    }
    
    @Test
    void testAudit() {
        doNothing().when(taskExecuteService).auditExecute(eq(1L), eq(2), isNull());
        
        R<Void> result = taskExecuteController.audit(1L, 2, null);
        
        assertEquals(200, result.getCode());
        verify(taskExecuteService, times(1)).auditExecute(eq(1L), eq(2), isNull());
    }
    
    @Test
    void testAudit_WithReason() {
        doNothing().when(taskExecuteService).auditExecute(eq(1L), eq(3), eq("照片不清晰"));
        
        R<Void> result = taskExecuteController.audit(1L, 3, "照片不清晰");
        
        assertEquals(200, result.getCode());
        verify(taskExecuteService, times(1)).auditExecute(eq(1L), eq(3), eq("照片不清晰"));
    }
    
    @Test
    void testGetDetail() {
        when(taskExecuteService.getExecuteDetail(1L)).thenReturn(testExecute);
        
        R<TaskExecute> result = taskExecuteController.getDetail(1L);
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals("PRO202604070001", result.getData().getOrderNo());
    }
    
    @Test
    void testGetList() {
        List<TaskExecute> mockList = new ArrayList<>();
        mockList.add(testExecute);
        when(taskExecuteService.getExecutesByVolunteerId(eq(1L), isNull(), eq(1), eq(10)))
            .thenReturn(mockList);
        
        R<List<TaskExecute>> result = taskExecuteController.getList(1L, null, 1, 10);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
}
