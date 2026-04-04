package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.*;
import com.ruoyi.qingru.mapper.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 机构管理服务类
 */
@Slf4j
@Service
public class OrgManageService {
    
    @Autowired
    private OrgManageMapper orgManageMapper;
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    @Autowired
    private TaskExecuteMapper taskExecuteMapper;
    
    @Autowired
    private SettlementMapper settlementMapper;
    
    /**
     * 获取机构详情
     * @param orgId 机构 ID
     * @return 机构信息
     */
    public OrgManage getOrgDetail(Long orgId) {
        log.info("获取机构详情，orgId={}", orgId);
        
        OrgManage org = orgManageMapper.selectById(orgId);
        if (org == null) {
            throw new RuntimeException("机构不存在");
        }
        
        // 统计订单数
        int totalOrders = orderMapper.countByOrgId(orgId);
        org.setTotalOrders(totalOrders);
        
        log.info("获取机构详情成功，orgId={}, totalOrders={}", orgId, totalOrders);
        
        return org;
    }
    
    /**
     * 更新机构信息
     * @param orgId 机构 ID
     * @param org 机构信息
     */
    @Transactional
    public void updateOrg(Long orgId, OrgManage org) {
        log.info("更新机构信息，orgId={}", orgId);
        
        OrgManage existing = orgManageMapper.selectById(orgId);
        if (existing == null) {
            throw new RuntimeException("机构不存在");
        }
        
        // 更新允许修改的字段
        if (org.getOrgName() != null) {
            existing.setOrgName(org.getOrgName());
        }
        if (org.getAddress() != null) {
            existing.setAddress(org.getAddress());
        }
        if (org.getContactName() != null) {
            existing.setContactName(org.getContactName());
        }
        if (org.getContactPhone() != null) {
            existing.setContactPhone(org.getContactPhone());
        }
        if (org.getStatus() != null) {
            existing.setStatus(org.getStatus());
        }
        
        orgManageMapper.update(existing);
        log.info("机构信息更新成功，orgId={}", orgId);
    }
    
    /**
     * 获取机构列表
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 机构列表
     */
    public List<OrgManage> getOrgList(Integer status, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取机构列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        return orgManageMapper.selectList(status, offset, pageSize);
    }
    
    /**
     * 获取机构工作台数据
     * @param orgId 机构 ID
     * @return 工作台数据
     */
    public OrgDashboard getOrgDashboard(Long orgId) {
        log.info("获取机构工作台数据，orgId={}", orgId);
        
        OrgDashboard dashboard = new OrgDashboard();
        
        // 统计待承接订单数
        dashboard.setPendingOrders(orderMapper.countPendingOrders(orgId));
        
        // 统计今日待执行订单数
        dashboard.setTodayTasks(orderMapper.countTodayTasks(orgId));
        
        // 统计待用户确认订单数
        dashboard.setPendingConfirm(orderMapper.countPendingConfirm(orgId));
        
        // 统计累计圆满执行订单数
        dashboard.setCompletedOrders(orderMapper.countCompletedOrders(orgId));
        
        // 统计待办事项
        dashboard.setTodos(getOrgTodos(orgId));
        
        log.info("获取机构工作台数据成功，orgId={}", orgId);
        return dashboard;
    }
    
    /**
     * 获取机构待办事项
     * @param orgId 机构 ID
     * @return 待办事项列表
     */
    private List<OrgTodo> getOrgTodos(Long orgId) {
        List<OrgTodo> todos = new ArrayList<>();
        
        // 待审核执行材料
        int pendingAudit = taskExecuteMapper.countPendingAudit(orgId);
        if (pendingAudit > 0) {
            todos.add(new OrgTodo("audit", "待审核执行材料", pendingAudit));
        }
        
        // 待结算订单
        int pendingSettle = settlementMapper.countPendingSettle(orgId);
        if (pendingSettle > 0) {
            todos.add(new OrgTodo("settle", "待结算订单", pendingSettle));
        }
        
        // 待处理用户异议
        int pendingDispute = orderMapper.countPendingDispute(orgId);
        if (pendingDispute > 0) {
            todos.add(new OrgTodo("dispute", "待处理用户异议", pendingDispute));
        }
        
        return todos;
    }
    
    /**
     * 生成志愿者邀请码
     * @param orgId 机构 ID
     * @return 邀请码
     */
    @Transactional
    public String generateInviteCode(Long orgId) {
        log.info("生成志愿者邀请码，orgId={}", orgId);
        
        OrgManage org = orgManageMapper.selectById(orgId);
        if (org == null) {
            throw new RuntimeException("机构不存在");
        }
        
        // 生成邀请码：INV + 机构 ID + 时间戳后 6 位 + 随机 4 位
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(5);
        String random = String.valueOf((int)(Math.random() * 10000));
        String inviteCode = "INV" + orgId + timestamp + random;
        
        log.info("生成志愿者邀请码成功，orgId={}, inviteCode={}", orgId, inviteCode);
        return inviteCode;
    }
}
