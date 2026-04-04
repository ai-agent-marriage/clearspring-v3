package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Volunteer;
import com.ruoyi.qingru.service.VolunteerService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 志愿者服务单元测试
 * 测试志愿者信息查询、更新等功能
 */
@SpringBootTest
public class VolunteerServiceTest {

    @Autowired
    private VolunteerService volunteerService;

    /**
     * 测试成功获取志愿者详情
     * 验证可以获取志愿者完整信息
     */
    @Test
    public void testGetVolunteerDetail_Success() {
        Long volunteerId = 1L;

        Volunteer volunteer = volunteerService.getVolunteerDetail(volunteerId);

        assertNotNull(volunteer, "志愿者对象不应为空");
        assertNotNull(volunteer.getRealName(), "真实姓名不应为空");
        assertNotNull(volunteer.getTotalTasks(), "总任务数不应为空");
        assertNotNull(volunteer.getServiceHours(), "服务时长不应为空");
        assertNotNull(volunteer.getComplianceRate(), "合规率不应为空");
    }

    /**
     * 测试成功更新志愿者信息
     * 验证志愿者信息可以正常更新
     */
    @Test
    public void testUpdateVolunteer_Success() {
        Long volunteerId = 1L;
        Volunteer volunteer = new Volunteer();
        volunteer.setPhone("139****5678");

        volunteerService.update(volunteerId, volunteer);

        Volunteer updated = volunteerService.getVolunteerDetail(volunteerId);
        assertEquals("139****5678", updated.getPhone(), "手机号应更新成功");
    }

    /**
     * 测试志愿者统计数据计算
     * 验证统计数据计算正确
     */
    @Test
    public void testCalculateVolunteerStats() {
        Long volunteerId = 1L;

        Volunteer volunteer = volunteerService.getVolunteerDetail(volunteerId);

        // 验证统计数据合理性
        assertTrue(volunteer.getTotalTasks() >= 0, "总任务数应为非负数");
        assertTrue(volunteer.getCompletedTasks() >= 0, "完成任务数应为非负数");
        assertTrue(volunteer.getServiceHours() >= 0, "服务时长应为非负数");
        assertTrue(volunteer.getComplianceRate() >= 0 && volunteer.getComplianceRate() <= 100, 
            "合规率应在 0-100 之间");
    }

    /**
     * 测试志愿者信息脱敏
     * 验证敏感信息已正确脱敏
     */
    @Test
    public void testVolunteerInfoMasking() {
        Long volunteerId = 1L;

        Volunteer volunteer = volunteerService.getVolunteerDetail(volunteerId);

        // 验证手机号已脱敏（中间 4 位用*代替）
        if (volunteer.getPhone() != null && volunteer.getPhone().length() == 11) {
            assertTrue(volunteer.getPhone().contains("****"), "手机号应脱敏显示");
        }
    }

    /**
     * 测试志愿者证书信息查询
     * 验证可以获取志愿者证书列表
     */
    @Test
    public void testGetVolunteerCertificates() {
        Long volunteerId = 1L;

        java.util.List<com.ruoyi.qingru.entity.VolunteerCertificate> certificates = 
            volunteerService.getCertificates(volunteerId);

        assertNotNull(certificates, "证书列表不应为空");
    }

    /**
     * 测试志愿者执行记录查询
     * 验证可以获取志愿者执行记录列表
     */
    @Test
    public void testGetVolunteerExecutes() {
        Long volunteerId = 1L;

        java.util.List<com.ruoyi.qingru.entity.TaskExecute> executes = 
            volunteerService.getExecutes(volunteerId, 1, 10);

        assertNotNull(executes, "执行记录列表不应为空");
    }

    /**
     * 测试志愿者任务统计
     * 验证可以获取志愿者各状态任务数量
     */
    @Test
    public void testGetVolunteerTaskStats() {
        Long volunteerId = 1L;

        com.ruoyi.qingru.VolunteerTaskStats stats = volunteerService.getTaskStats(volunteerId);

        assertNotNull(stats, "任务统计对象不应为空");
        assertNotNull(stats.getPendingTasks(), "待接收任务数不应为空");
        assertNotNull(stats.getCompletedTasks(), "已完成任务数不应为空");
        assertNotNull(stats.getTotalTasks(), "总任务数不应为空");
    }

    /**
     * 测试志愿者合规率计算
     * 验证合规率计算逻辑正确
     */
    @Test
    public void testCalculateComplianceRate() {
        Long volunteerId = 1L;

        Volunteer volunteer = volunteerService.getVolunteerDetail(volunteerId);

        // 合规率 = 合规执行次数 / 总执行次数 * 100
        // 验证计算结果在合理范围内
        if (volunteer.getTotalExecutes() != null && volunteer.getTotalExecutes() > 0) {
            assertTrue(volunteer.getComplianceRate() >= 0, "合规率应为非负数");
            assertTrue(volunteer.getComplianceRate() <= 100, "合规率不应超过 100%");
        }
    }

    /**
     * 测试志愿者等级评定
     * 验证可以根据服务时长评定志愿者等级
     */
    @Test
    public void testGetVolunteerLevel() {
        Long volunteerId = 1L;

        Volunteer volunteer = volunteerService.getVolunteerDetail(volunteerId);

        // 验证等级字段存在
        assertNotNull(volunteer.getLevel(), "志愿者等级不应为空");
        
        // 验证等级值在合理范围内（假设 1-5 级）
        if (volunteer.getLevel() != null) {
            assertTrue(volunteer.getLevel() >= 1, "志愿者等级应>=1");
            assertTrue(volunteer.getLevel() <= 5, "志愿者等级应<=5");
        }
    }
}
