package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrgManage;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.OrgManageMapper;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

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
}
