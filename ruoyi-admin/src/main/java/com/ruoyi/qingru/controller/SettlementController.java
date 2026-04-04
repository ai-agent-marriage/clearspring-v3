package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Settlement;
import com.ruoyi.qingru.service.SettlementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 结算控制器
 */
@Slf4j
@RestController
@RequestMapping("/settlement")
public class SettlementController {
    
    @Autowired
    private SettlementService settlementService;
    
    /**
     * 创建结算单
     * @param orderNo 订单号
     * @return 结算单
     */
    @PostMapping("/create")
    public R<Settlement> createSettlement(@RequestParam String orderNo) {
        log.info("创建结算单，orderNo={}", orderNo);
        try {
            Settlement settlement = settlementService.createSettlement(orderNo);
            return R.ok(settlement, "结算单创建成功");
        } catch (Exception e) {
            log.error("创建结算单失败", e);
            return R.fail("创建失败：" + e.getMessage());
        }
    }
    
    /**
     * 确认结算
     * @param settlementId 结算单 ID
     * @return 操作结果
     */
    @PostMapping("/confirm/{id}")
    public R<Void> confirmSettlement(@PathVariable Long settlementId) {
        log.info("确认结算，settlementId={}", settlementId);
        try {
            settlementService.confirmSettlement(settlementId);
            return R.ok(null, "结算确认成功");
        } catch (Exception e) {
            log.error("确认结算失败", e);
            return R.fail("确认失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取机构的结算单列表
     * @param orgId 机构 ID
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 结算单列表
     */
    @GetMapping("/list")
    public R<List<Settlement>> getSettlements(
            @RequestParam Long orgId,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取结算单列表，orgId={}, pageNum={}, pageSize={}", orgId, pageNum, pageSize);
        List<Settlement> list = settlementService.getSettlementsByOrgId(orgId, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 获取机构结算列表（带状态过滤）
     * @param orgId 机构 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 结算单列表
     */
    @GetMapping("/org/list")
    public R<List<Settlement>> getOrgSettlements(
            @RequestParam Long orgId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取机构结算列表，orgId={}, status={}, pageNum={}, pageSize={}", 
                orgId, status, pageNum, pageSize);
        List<Settlement> list = settlementService.getOrgSettlements(orgId, status, pageNum, pageSize);
        return R.ok(list, "获取成功");
    }
    
    /**
     * 批量结算
     * @param settlementIds 结算单 ID 列表
     * @return 操作结果
     */
    @PostMapping("/batch-settle")
    public R<Void> batchSettle(@RequestBody List<Long> settlementIds) {
        log.info("批量结算，count={}", settlementIds.size());
        try {
            settlementService.batchSettle(settlementIds);
            return R.ok(null, "批量结算成功");
        } catch (Exception e) {
            log.error("批量结算失败", e);
            return R.fail("批量结算失败：" + e.getMessage());
        }
    }
}
