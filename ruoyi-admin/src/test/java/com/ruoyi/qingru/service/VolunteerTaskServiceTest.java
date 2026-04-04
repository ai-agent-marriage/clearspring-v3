package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Volunteer;
import com.ruoyi.qingru.entity.VolunteerTask;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import com.ruoyi.qingru.mapper.VolunteerTaskMapper;
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
 * 志愿者任务服务测试
 */
@ExtendWith(MockitoExtension.class)
class VolunteerTaskServiceTest {
    
    @Mock
    private VolunteerTaskMapper volunteerTaskMapper;
    
    @Mock
    private VolunteerMapper volunteerMapper;
    
    @InjectMocks
    private VolunteerTaskService volunteerTaskService;
    
    private Volunteer testVolunteer;
    private VolunteerTask testTask;
    
    @BeforeEach
    void setUp() {
        testVolunteer = new Volunteer();
        testVolunteer.setId(1L);
        testVolunteer.setUserId(100L);
        testVolunteer.setOrgId(50L); // 已绑定机构
        testVolunteer.setName("测试志愿者");
        
        testTask = new VolunteerTask();
        testTask.setOrderNo("PRO202604040001");
        testTask.setVolunteerId(1L);
        testTask.setStatus(1);
        testTask.setAssignTime(new Date());
    }
    
    @Test
    void testAssignTask_Success() {
        when(volunteerMapper.selectById(1L)).thenReturn(testVolunteer);
        when(volunteerTaskMapper.insert(any(VolunteerTask.class))).thenReturn(1);
        
        volunteerTaskService.assignTask("PRO202604040001", 1L);
        
        verify(volunteerTaskMapper, times(1)).insert(any(VolunteerTask.class));
    }
    
    @Test
    void testAssignTask_VolunteerNotFound() {
        when(volunteerMapper.selectById(1L)).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            volunteerTaskService.assignTask("PRO202604040001", 1L);
        });
        
        assertEquals("志愿者不存在", exception.getMessage());
    }
    
    @Test
    void testAssignTask_VolunteerNotBoundToOrg() {
        testVolunteer.setOrgId(null); // 未绑定机构
        when(volunteerMapper.selectById(1L)).thenReturn(testVolunteer);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            volunteerTaskService.assignTask("PRO202604040001", 1L);
        });
        
        assertTrue(exception.getMessage().contains("志愿者未绑定机构"));
    }
    
    @Test
    void testGetMyTasks() {
        List<VolunteerTask> mockList = new ArrayList<>();
        mockList.add(testTask);
        when(volunteerTaskMapper.selectByVolunteerId(anyLong(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        List<VolunteerTask> result = volunteerTaskService.getMyTasks(1L, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(volunteerTaskMapper, times(1)).selectByVolunteerId(1L, null, 0, 10);
    }
}
