package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Settlement;
import com.ruoyi.qingru.service.SettlementService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 结算服务单元测试
 * 测试结算单创建、确认等功能
 */
@SpringBootTest
public class SettlementServiceTest {

    @Autowired
    private SettlementService settlementService;

    /**
     * 测试成功创建结算单
     * 验证结算单创建成功且状态为待结算
     */
    @Test
    public void testCreateSettlement_Success() {
        String orderNo = "PRO202604070001";

        Settlement settlement = settlementService.createSettlement(orderNo);

        assertNotNull(settlement, "结算单对象不应为空");
        assertNotNull(settlement.getId(), "结算单 ID 不应为空");
        assertEquals(1, settlement.getStatus().intValue(), "结算单状态应为待结算");
    }

    /**
     * 测试为未完成的订单创建结算单
     * 验证未完成的订单不能创建结算单
     */
    @Test
    public void testCreateSettlement_OrderNotCompleted() {
        String orderNo = "PRO202604070002"; // 订单未完成

        assertThrows(RuntimeException.class, () -> {
            settlementService.createSettlement(orderNo);
        }, "未完成的订单不能创建结算单");
    }

    /**
     * 测试确认结算单
     * 验证结算单状态可以更新为已结算
     */
    @Test
    public void testConfirmSettlement() {
        Long settlementId = 1L;

        settlementService.confirmSettlement(settlementId);

        Settlement settlement = settlementService.getById(settlementId);
        assertEquals(2, settlement.getStatus().intValue(), "结算单状态应为已结算");
    }

    /**
     * 测试结算单详情查询
     * 验证可以获取结算单完整信息
     */
    @Test
    public void testGetSettlementDetail() {
        Long settlementId = 1L;

        Settlement settlement = settlementService.getById(settlementId);

        assertNotNull(settlement, "结算单对象不应为空");
        assertNotNull(settlement.getOrderNo(), "结算单关联订单号不应为空");
        assertNotNull(settlement.getAmount(), "结算金额不应为空");
    }

    /**
     * 测试重复创建结算单
     * 验证同一订单不能重复创建结算单
     */
    @Test
    public void testCreateSettlement_Duplicate() {
        String orderNo = "PRO202604070001";

        // 已经创建过结算单，再次创建应该失败
        assertThrows(RuntimeException.class, () -> {
            settlementService.createSettlement(orderNo);
        }, "同一订单不能重复创建结算单");
    }

    /**
     * 测试查询机构待结算列表
     * 验证返回机构的待结算订单列表
     */
    @Test
    public void testGetPendingSettlements() {
        Long orgId = 1L;

        java.util.List<Settlement> settlements = settlementService.getPendingSettlements(orgId, 1, 10);

        assertNotNull(settlements, "待结算列表不应为空");
        settlements.forEach(s -> {
            assertEquals(1, s.getStatus().intValue(), "结算单状态应为待结算");
            assertEquals(orgId, s.getOrgId(), "结算单应属于该机构");
        });
    }

    /**
     * 测试查询机构已结算列表
     * 验证返回机构的已结算订单列表
     */
    @Test
    public void testGetCompletedSettlements() {
        Long orgId = 1L;

        java.util.List<Settlement> settlements = settlementService.getCompletedSettlements(orgId, 1, 10);

        assertNotNull(settlements, "已结算列表不应为空");
        settlements.forEach(s -> {
            assertEquals(2, s.getStatus().intValue(), "结算单状态应为已结算");
            assertEquals(orgId, s.getOrgId(), "结算单应属于该机构");
        });
    }

    /**
     * 测试批量结算
     * 验证可以批量更新结算单状态
     */
    @Test
    public void testBatchSettle() {
        java.util.List<Long> settlementIds = java.util.Arrays.asList(1L, 2L);

        settlementService.batchSettle(settlementIds);

        settlementIds.forEach(id -> {
            Settlement settlement = settlementService.getById(id);
            assertEquals(2, settlement.getStatus().intValue(), "结算单状态应为已结算");
            assertNotNull(settlement.getSettlementTime(), "结算时间不应为空");
        });
    }

    /**
     * 测试获取机构结算列表（带状态过滤）
     * 验证可以按状态筛选结算单
     */
    @Test
    public void testGetOrgSettlements() {
        Long orgId = 1L;
        Integer status = 1; // 待结算

        java.util.List<Settlement> settlements = settlementService.getOrgSettlements(
                orgId, status, 1, 10);

        assertNotNull(settlements, "结算列表不应为空");
        settlements.forEach(s -> {
            assertEquals(status, s.getStatus(), "结算单状态应为筛选状态");
            assertEquals(orgId, s.getOrgId(), "结算单应属于该机构");
        });
    }
}
