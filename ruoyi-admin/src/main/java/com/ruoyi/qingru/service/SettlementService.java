package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Settlement;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.SettlementMapper;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 结算服务类
 */
@Slf4j
@Service
public class SettlementService {
    
    @Autowired
    private SettlementMapper settlementMapper;
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    /**
     * 创建结算单（订单完成后 T+7 自动创建）
     * @param orderNo 订单号
     * @return 结算单
     */
    @Transactional
    public Settlement createSettlement(String orderNo) {
        log.info("创建结算单，orderNo={}", orderNo);
        
        OrderProtect order = orderMapper.selectByOrderNo(orderNo);
        
        // 验证订单是否已完成
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (order.getStatus() != 5) {
            throw new RuntimeException("订单未完成，无法结算，当前状态：" + order.getStatus());
        }
        
        // 验证是否已结算
        Settlement existing = settlementMapper.selectByOrderNo(orderNo);
        if (existing != null) {
            throw new RuntimeException("订单已结算");
        }
        
        // 计算结算金额
        BigDecimal totalAmount = order.getAmount();
        BigDecimal platformFee = totalAmount.multiply(new BigDecimal("0.1")); // 平台服务费 10%
        BigDecimal settlementAmount = totalAmount.subtract(platformFee);
        
        // 创建结算单
        Settlement settlement = new Settlement();
        settlement.setOrderNo(orderNo);
        settlement.setOrgId(order.getOrgId());
        settlement.setAmount(settlementAmount);
        settlement.setPlatformFee(platformFee);
        settlement.setStatus(1); // 待结算
        
        settlementMapper.insert(settlement);
        log.info("结算单创建成功，orderNo={}, amount={}, platformFee={}", 
                orderNo, settlementAmount, platformFee);
        
        return settlement;
    }
    
    /**
     * 确认结算
     * @param settlementId 结算单 ID
     */
    @Transactional
    public void confirmSettlement(Long settlementId) {
        log.info("确认结算，settlementId={}", settlementId);
        
        Settlement settlement = settlementMapper.selectById(settlementId);
        if (settlement == null) {
            throw new RuntimeException("结算单不存在");
        }
        
        settlement.setStatus(2); // 已结算
        settlement.setSettlementTime(new Date());
        
        settlementMapper.update(settlement);
        
        // 更新订单状态为已结算
        orderMapper.updateStatus(settlement.getOrderNo(), 6);
        
        log.info("结算确认成功，settlementId={}, orderNo={}", settlementId, settlement.getOrderNo());
    }
    
    /**
     * 获取机构的结算单列表
     * @param orgId 机构 ID
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 结算单列表
     */
    public List<Settlement> getSettlementsByOrgId(Long orgId, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取机构结算单列表，orgId={}, pageNum={}, pageSize={}", orgId, pageNum, pageSize);
        return settlementMapper.selectByOrgId(orgId, offset, pageSize);
    }
    
    /**
     * 根据订单号查询结算单
     * @param orderNo 订单号
     * @return 结算单
     */
    public Settlement getSettlementByOrderNo(String orderNo) {
        return settlementMapper.selectByOrderNo(orderNo);
    }
    
    /**
     * 获取机构结算列表（带状态过滤）
     * @param orgId 机构 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 结算单列表
     */
    public List<Settlement> getOrgSettlements(Long orgId, Integer status, 
                                               Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取机构结算列表，orgId={}, status={}, pageNum={}, pageSize={}", 
                orgId, status, pageNum, pageSize);
        return settlementMapper.selectByOrgIdAndStatus(orgId, status, offset, pageSize);
    }
    
    /**
     * 批量结算
     * @param settlementIds 结算单 ID 列表
     */
    @Transactional
    public void batchSettle(List<Long> settlementIds) {
        log.info("批量结算，settlementIds count={}", settlementIds.size());
        
        for (Long settlementId : settlementIds) {
            Settlement settlement = settlementMapper.selectById(settlementId);
            if (settlement == null) {
                log.warn("结算单不存在，settlementId={}", settlementId);
                continue;
            }
            
            if (settlement.getStatus() != 1) {
                log.warn("结算单状态不是待结算，settlementId={}, status={}", settlementId, settlement.getStatus());
                continue;
            }
            
            settlement.setStatus(2); // 已结算
            settlement.setSettlementTime(new Date());
            
            settlementMapper.update(settlement);
            
            // 更新订单状态为已结算
            orderMapper.updateStatus(settlement.getOrderNo(), 6);
            
            log.info("结算单处理完成，settlementId={}, orderNo={}", settlementId, settlement.getOrderNo());
        }
        
        log.info("批量结算完成，处理数量={}", settlementIds.size());
    }
}
