package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.VolunteerTask;
import com.ruoyi.qingru.service.VolunteerTaskService;
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
 * 志愿者任务控制器测试
 */
@ExtendWith(MockitoExtension.class)
class VolunteerTaskControllerTest {
    
    @Mock
    private VolunteerTaskService volunteerTaskService;
    
    @InjectMocks
    private VolunteerTaskController volunteerTaskController;
    
    private VolunteerTask testTask;
    
    @BeforeEach
    void setUp() {
        testTask = new VolunteerTask();
        testTask.setOrderNo("PRO202604040001");
        testTask.setVolunteerId(1L);
        testTask.setStatus(1);
        testTask.setAssignTime(new Date());
    }
    
    @Test
    void testAssignTask() {
        doNothing().when(volunteerTaskService).assignTask("PRO202604040001", 1L);
        
        R<Void> result = volunteerTaskController.assignTask("PRO202604040001", 1L);
        
        assertEquals(200, result.getCode());
        verify(volunteerTaskService, times(1)).assignTask("PRO202604040001", 1L);
    }
    
    @Test
    void testAssignTask_Failure() {
        doThrow(new RuntimeException("志愿者未绑定机构")).when(volunteerTaskService).assignTask("PRO202604040001", 1L);
        
        R<Void> result = volunteerTaskController.assignTask("PRO202604040001", 1L);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("分配失败"));
    }
    
    @Test
    void testGetMyTasks() {
        List<VolunteerTask> mockList = new ArrayList<>();
        mockList.add(testTask);
        when(volunteerTaskService.getMyTasks(1L, null, 1, 10)).thenReturn(mockList);
        
        R<List<VolunteerTask>> result = volunteerTaskController.getMyTasks(1L, null, 1, 10);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
}
