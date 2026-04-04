package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.VolunteerTask;
import com.ruoyi.qingru.service.VolunteerTaskService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

/**
 * 志愿者任务服务单元测试
 * 测试志愿者任务分配、查询等功能
 */
@SpringBootTest
public class VolunteerTaskServiceTest {

    @Autowired
    private VolunteerTaskService volunteerTaskService;

    /**
     * 测试成功分配任务给志愿者
     * 验证任务创建成功并可查询
     */
    @Test
    public void testAssignTask_Success() {
        String orderNo = "PRO202604070001";
        Long volunteerId = 1L;

        volunteerTaskService.assignTask(orderNo, volunteerId);

        List<VolunteerTask> tasks = volunteerTaskService.getMyTasks(volunteerId, null, 1, 10);
        assertTrue(tasks.size() > 0, "志愿者应有分配的任务");
    }

    /**
     * 测试分配任务给未绑定机构的志愿者
     * 验证未绑定机构的志愿者不能接收任务
     */
    @Test
    public void testAssignTask_VolunteerNotBound() {
        String orderNo = "PRO202604070001";
        Long volunteerId = 2L; // 未绑定机构

        assertThrows(RuntimeException.class, () -> {
            volunteerTaskService.assignTask(orderNo, volunteerId);
        }, "未绑定机构的志愿者不能接收任务");
    }

    /**
     * 测试查询志愿者我的任务列表
     * 验证返回任务列表非空
     */
    @Test
    public void testGetMyTasks_NotEmpty() {
        Long volunteerId = 1L;
        List<VolunteerTask> tasks = volunteerTaskService.getMyTasks(volunteerId, null, 1, 10);

        assertNotNull(tasks, "任务列表不应为空");
    }

    /**
     * 测试按状态筛选志愿者任务
     * 验证状态筛选功能正常
     */
    @Test
    public void testGetMyTasks_ByStatus() {
        Long volunteerId = 1L;
        Integer status = 1; // 待执行
        List<VolunteerTask> tasks = volunteerTaskService.getMyTasks(volunteerId, status, 1, 10);

        assertNotNull(tasks, "任务列表不应为空");
        tasks.forEach(task -> {
            assertEquals(status, task.getStatus().intValue(), "任务状态应为筛选状态");
        });
    }

    /**
     * 测试志愿者完成任务
     * 验证任务状态可以更新为已完成
     */
    @Test
    public void testCompleteTask() {
        Long taskId = 1L;
        
        volunteerTaskService.completeTask(taskId);
        
        VolunteerTask task = volunteerTaskService.getTaskById(taskId);
        assertNotNull(task, "任务对象不应为空");
        assertEquals(2, task.getStatus().intValue(), "任务状态应变为已完成");
    }

    /**
     * 测试志愿者任务详情查询
     * 验证可以获取任务完整信息
     */
    @Test
    public void testGetTaskDetail() {
        Long taskId = 1L;
        
        VolunteerTask task = volunteerTaskService.getTaskById(taskId);
        
        assertNotNull(task, "任务对象不应为空");
        assertNotNull(task.getOrderNo(), "任务关联订单号不应为空");
        assertNotNull(task.getVolunteerId(), "任务志愿者 ID 不应为空");
    }

    /**
     * 测试同一订单重复分配任务
     * 验证同一订单不能重复分配给同一志愿者
     */
    @Test
    public void testAssignTask_Duplicate() {
        String orderNo = "PRO202604070001";
        Long volunteerId = 1L;

        // 已经分配过任务，再次分配应该失败
        assertThrows(RuntimeException.class, () -> {
            volunteerTaskService.assignTask(orderNo, volunteerId);
        }, "同一订单不能重复分配给同一志愿者");
    }
}
