package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrgOrder;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.OrgOrderMapper;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;

/**
 * 机构承接订单服务类
 */
@Slf4j
@Service
public class OrgOrderService {
    
    @Autowired
    private OrgOrderMapper orgOrderMapper;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    /**
     * 机构承接订单
     * @param orderNo 订单号
     * @param orgId 机构 ID
     */
    @Transactional
    public void acceptOrder(String orderNo, Long orgId) {
        log.info("机构承接订单，orderNo={}, orgId={}", orderNo, orgId);
        
        // 验证订单状态
        OrderProtect order = orderService.getByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (order.getStatus() != 1) {
            throw new RuntimeException("订单状态不是待承接，当前状态：" + order.getStatus());
        }
        
        // 创建承接记录
        OrgOrder orgOrder = new OrgOrder();
        orgOrder.setOrderNo(orderNo);
        orgOrder.setOrgId(orgId);
        orgOrder.setStatus(2); // 已承接
        orgOrder.setAcceptTime(new Date());
        
        orgOrderMapper.insert(orgOrder);
        log.info("承接记录创建成功，orderNo={}, orgId={}", orderNo, orgId);
        
        // 更新订单状态为待执行
        orderService.updateOrderStatus(orderNo, 2);
        
        // 更新订单的机构 ID
        order.setOrgId(orgId);
        orderMapper.update(order);
        
        log.info("订单承接完成，orderNo={}, orgId={}", orderNo, orgId);
    }
    
    /**
     * 获取可承接订单列表
     * @param orgId 机构 ID
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 可承接订单列表
     */
    public List<OrderProtect> getAvailableOrders(Long orgId, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取可承接订单列表，orgId={}, pageNum={}, pageSize={}", orgId, pageNum, pageSize);
        return orderMapper.selectAvailableOrders(orgId, offset, pageSize);
    }
    
    /**
     * 根据订单号查询承接记录
     * @param orderNo 订单号
     * @return 承接记录
     */
    public OrgOrder getOrgOrderByOrderNo(String orderNo) {
        return orgOrderMapper.selectByOrderNo(orderNo);
    }
}
