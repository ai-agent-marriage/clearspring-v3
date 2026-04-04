package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.OrgManage;
import com.ruoyi.qingru.service.OrgManageService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 机构管理服务单元测试
 * 测试机构信息查询、更新等功能
 */
@SpringBootTest
public class OrgManageServiceTest {

    @Autowired
    private OrgManageService orgManageService;

    /**
     * 测试成功获取机构详情
     * 验证可以获取机构完整信息
     */
    @Test
    public void testGetOrgDetail_Success() {
        Long orgId = 1L;

        OrgManage org = orgManageService.getOrgDetail(orgId);

        assertNotNull(org, "机构对象不应为空");
        assertNotNull(org.getOrgName(), "机构名称不应为空");
        assertNotNull(org.getTotalOrders(), "总订单数不应为空");
    }

    /**
     * 测试成功更新机构信息
     * 验证机构信息可以正常更新
     */
    @Test
    public void testUpdateOrg_Success() {
        Long orgId = 1L;
        OrgManage org = new OrgManage();
        org.setContactPhone("138****9999");

        orgManageService.updateOrg(orgId, org);

        OrgManage updated = orgManageService.getOrgDetail(orgId);
        assertEquals("138****9999", updated.getContactPhone(), "联系电话应更新成功");
    }

    /**
     * 测试机构统计数据计算
     * 验证统计数据计算正确
     */
    @Test
    public void testCalculateOrgStats() {
        Long orgId = 1L;

        OrgManage org = orgManageService.getOrgDetail(orgId);

        // 验证统计数据合理性
        assertTrue(org.getTotalOrders() >= 0, "总订单数应为非负数");
        assertTrue(org.getCompletedOrders() >= 0, "已完成订单数应为非负数");
        assertTrue(org.getTotalAmount() != null && org.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) >= 0, 
            "总金额应为非负数");
    }

    /**
     * 测试机构信息脱敏
     * 验证敏感信息已正确脱敏
     */
    @Test
    public void testOrgInfoMasking() {
        Long orgId = 1L;

        OrgManage org = orgManageService.getOrgDetail(orgId);

        // 验证联系人手机号已脱敏（中间 4 位用*代替）
        if (org.getContactPhone() != null && org.getContactPhone().length() == 11) {
            assertTrue(org.getContactPhone().contains("****"), "联系电话应脱敏显示");
        }
    }

    /**
     * 测试机构订单列表查询
     * 验证可以获取机构订单列表
     */
    @Test
    public void testGetOrgOrders() {
        Long orgId = 1L;

        java.util.List<com.ruoyi.qingru.entity.ProcurementOrder> orders = 
            orgManageService.getOrders(orgId, null, 1, 10);

        assertNotNull(orders, "订单列表不应为空");
    }

    /**
     * 测试机构结算单列表查询
     * 验证可以获取机构结算单列表
     */
    @Test
    public void testGetOrgSettlements() {
        Long orgId = 1L;

        java.util.List<com.ruoyi.qingru.entity.Settlement> settlements = 
            orgManageService.getSettlements(orgId, null, 1, 10);

        assertNotNull(settlements, "结算单列表不应为空");
    }

    /**
     * 测试机构待审核执行结果列表查询
     * 验证可以获取待审核执行结果列表
     */
    @Test
    public void testGetPendingExecutes() {
        Long orgId = 1L;

        java.util.List<com.ruoyi.qingru.entity.TaskExecute> executes = 
            orgManageService.getPendingExecutes(orgId, 1, 10);

        assertNotNull(executes, "待审核执行结果列表不应为空");
    }

    /**
     * 测试机构执行结果审核
     * 验证机构可以审核志愿者提交的执行结果
     */
    @Test
    public void testAuditExecute() {
        Long orgId = 1L;
        Long executeId = 1L;

        // 审核通过
        orgManageService.auditExecute(orgId, executeId, 2, "审核通过");

        com.ruoyi.qingru.entity.TaskExecute execute = 
            orgManageService.getExecuteDetail(executeId);

        assertNotNull(execute, "执行结果对象不应为空");
        assertEquals(2, execute.getStatus().intValue(), "执行结果状态应为已通过");
    }

    /**
     * 测试机构资质验证
     * 验证机构资质信息完整
     */
    @Test
    public void testOrgQualification() {
        Long orgId = 1L;

        OrgManage org = orgManageService.getOrgDetail(orgId);

        // 验证资质字段存在
        assertNotNull(org.getLicenseNo(), "营业执照号不应为空");
        assertNotNull(org.getOrgType(), "机构类型不应为空");
    }

    /**
     * 测试机构信用评分
     * 验证可以获取机构信用评分
     */
    @Test
    public void testOrgCreditScore() {
        Long orgId = 1L;

        OrgManage org = orgManageService.getOrgDetail(orgId);

        // 验证信用评分在合理范围内（假设 0-100 分）
        if (org.getCreditScore() != null) {
            assertTrue(org.getCreditScore() >= 0, "信用评分应为非负数");
            assertTrue(org.getCreditScore() <= 100, "信用评分不应超过 100 分");
        }
    }
}
