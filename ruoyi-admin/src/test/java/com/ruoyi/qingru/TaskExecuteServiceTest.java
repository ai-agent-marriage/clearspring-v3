package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.TaskExecute;
import com.ruoyi.qingru.service.TaskExecuteService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.List;

/**
 * 任务执行结果服务单元测试
 * 测试执行结果提交、审核等功能
 */
@SpringBootTest
public class TaskExecuteServiceTest {

    @Autowired
    private TaskExecuteService taskExecuteService;

    /**
     * 测试提交执行结果
     * 验证可以成功提交执行结果
     */
    @Test
    public void testSubmitExecute_Success() {
        TaskExecute execute = new TaskExecute();
        execute.setOrderNo("PRO202604070001");
        execute.setVolunteerId(1L);
        execute.setAddress("测试投放点位");
        execute.setRealQuantity(100);
        execute.setImages("img1.jpg,img2.jpg");
        execute.setRemark("执行顺利");

        taskExecuteService.submitExecute(execute);

        assertNotNull(execute.getId(), "执行记录 ID 不应为空");
        assertEquals(1, execute.getStatus().intValue(), "执行记录状态应为待审核");
    }

    /**
     * 测试获取执行记录详情
     * 验证可以获取执行记录完整信息
     */
    @Test
    public void testGetExecuteDetail() {
        Long executeId = 1L;

        TaskExecute execute = taskExecuteService.getExecuteDetail(executeId);

        assertNotNull(execute, "执行记录对象不应为空");
        assertNotNull(execute.getOrderNo(), "订单号不应为空");
        assertNotNull(execute.getVolunteerId(), "志愿者 ID 不应为空");
    }

    /**
     * 测试获取不存在的执行记录
     * 验证查询不存在的执行记录会抛出异常
     */
    @Test
    public void testGetExecuteDetail_NotFound() {
        Long executeId = 99999L;

        assertThrows(RuntimeException.class, () -> {
            taskExecuteService.getExecuteDetail(executeId);
        }, "不存在的执行记录应抛出异常");
    }

    /**
     * 测试审核通过执行结果
     * 验证审核通过后状态更新正确
     */
    @Test
    public void testAuditExecute_Approve() {
        Long executeId = 1L;

        taskExecuteService.auditExecute(executeId, 2, null);

        TaskExecute execute = taskExecuteService.getExecuteDetail(executeId);
        assertEquals(2, execute.getStatus().intValue(), "执行记录状态应为审核通过");
    }

    /**
     * 测试审核驳回执行结果
     * 验证审核驳回后状态和原因更新正确
     */
    @Test
    public void testAuditExecute_Reject() {
        Long executeId = 1L;
        String reason = "照片不清晰";

        taskExecuteService.auditExecute(executeId, 3, reason);

        TaskExecute execute = taskExecuteService.getExecuteDetail(executeId);
        assertEquals(3, execute.getStatus().intValue(), "执行记录状态应为审核驳回");
        assertEquals(reason, execute.getAuditReason(), "驳回原因应正确记录");
    }

    /**
     * 测试审核不存在的执行记录
     * 验证审核不存在的执行记录会抛出异常
     */
    @Test
    public void testAuditExecute_NotFound() {
        Long executeId = 99999L;

        assertThrows(RuntimeException.class, () -> {
            taskExecuteService.auditExecute(executeId, 2, null);
        }, "审核不存在的执行记录应抛出异常");
    }

    /**
     * 测试获取志愿者执行记录列表
     * 验证可以获取志愿者的执行记录
     */
    @Test
    public void testGetExecutesByVolunteerId() {
        Long volunteerId = 1L;

        List<TaskExecute> list = taskExecuteService.getExecutesByVolunteerId(
                volunteerId, null, 1, 10);

        assertNotNull(list, "执行记录列表不应为空");
    }

    /**
     * 测试按状态筛选执行记录
     * 验证可以按状态筛选执行记录
     */
    @Test
    public void testGetExecutesByStatus() {
        Long volunteerId = 1L;
        Integer status = 2; // 审核通过

        List<TaskExecute> list = taskExecuteService.getExecutesByVolunteerId(
                volunteerId, status, 1, 10);

        assertNotNull(list, "执行记录列表不应为空");
        list.forEach(e -> {
            assertEquals(status, e.getStatus(), "执行记录状态应为筛选状态");
        });
    }
}
