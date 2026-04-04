package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.OrderStats;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 管理后台订单服务类
 */
@Service
@Slf4j
public class AdminOrderService {
    private static final Logger logger = LoggerFactory.getLogger(AdminOrderService.class);

    @Autowired
    private OrderProtectMapper orderMapper;

    /**
     * 获取订单列表（支持状态筛选和分页）
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单列表
     */
    public List<OrderProtect> getList(Integer status, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 20;
        }
        int offset = (pageNum - 1) * pageSize;
        
        logger.info("获取订单列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        return orderMapper.selectByStatus(status, offset, pageSize);
    }

    /**
     * 获取订单详情
     * @param id 订单 ID（orderNo）
     * @return 订单详情
     */
    public OrderProtect getDetail(Long id) {
        logger.info("获取订单详情，id={}", id);
        OrderProtect order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在，id=" + id);
        }
        return order;
    }

    /**
     * 更新订单状态
     * @param id 订单 ID
     * @param status 新状态
     */
    @Transactional
    public void updateStatus(Long id, Integer status) {
        logger.info("更新订单状态，id={}, status={}", id, status);
        
        OrderProtect order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在，id=" + id);
        }
        
        // 验证状态流转是否合法
        if (!isValidStatusTransition(order.getStatus(), status)) {
            throw new RuntimeException("订单状态流转不合法，从状态 " + order.getStatus() + " 不能流转到状态 " + status);
        }
        
        order.setStatus(status);
        order.setUpdateTime(new Date());
        orderMapper.update(order);
        
        logger.info("订单状态更新成功，id={}, oldStatus={}, newStatus={}", id, order.getStatus(), status);
    }

    /**
     * 删除订单
     * @param id 订单 ID
     */
    @Transactional
    public void delete(Long id) {
        logger.info("删除订单，id={}", id);
        
        OrderProtect order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在，id=" + id);
        }
        
        // 只有已取消的订单才能删除
        if (order.getStatus() != 6) {
            throw new RuntimeException("只能删除已取消的订单，当前状态=" + order.getStatus());
        }
        
        orderMapper.delete(id);
        logger.info("订单删除成功，id={}", id);
    }

    /**
     * 导出订单数据
     * @param status 状态（可选）
     * @return Excel 文件字节数组
     */
    public byte[] exportOrders(Integer status) {
        logger.info("导出订单数据，status={}", status);
        
        List<OrderProtect> orders = orderMapper.selectByStatus(status, 0, 1000);
        
        // 生成 CSV 格式数据（简化实现，实际项目应使用 POI 生成 Excel）
        StringBuilder sb = new StringBuilder();
        sb.append("订单号，用户 ID，机构 ID，志愿者 ID，物种 ID，数量，金额，状态，地址，创建时间\n");
        
        for (OrderProtect order : orders) {
            sb.append(order.getOrderNo()).append(",");
            sb.append(order.getUserId()).append(",");
            sb.append(order.getOrgId() != null ? order.getOrgId() : "").append(",");
            sb.append(order.getVolunteerId() != null ? order.getVolunteerId() : "").append(",");
            sb.append(order.getSpeciesId()).append(",");
            sb.append(order.getQuantity()).append(",");
            sb.append(order.getAmount()).append(",");
            sb.append(order.getStatus()).append(",");
            sb.append(order.getAddress() != null ? order.getAddress() : "").append(",");
            sb.append(order.getCreateTime() != null ? order.getCreateTime() : "").append("\n");
        }
        
        return sb.toString().getBytes();
    }

    /**
     * 分配订单
     * @param id 订单 ID
     * @param volunteerId 志愿者 ID
     */
    @Transactional
    public void assignOrder(Long id, Long volunteerId) {
        logger.info("分配订单，id={}, volunteerId={}", id, volunteerId);
        
        OrderProtect order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在，id=" + id);
        }
        
        if (order.getStatus() != 2) {
            throw new RuntimeException("只能分配待执行状态的订单，当前状态=" + order.getStatus());
        }
        
        order.setVolunteerId(volunteerId);
        order.setStatus(3); // 执行中
        order.setUpdateTime(new Date());
        orderMapper.update(order);
        
        logger.info("订单分配成功，id={}, volunteerId={}", id, volunteerId);
    }

    /**
     * 获取订单统计
     * @return 订单统计数据
     */
    public OrderStats getStats() {
        logger.info("获取订单统计");
        
        List<OrderProtect> allOrders = orderMapper.selectByStatus(null, 0, 10000);
        
        OrderStats stats = new OrderStats();
        stats.setTotalOrders(allOrders.size());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal completedAmount = BigDecimal.ZERO;
        
        for (OrderProtect order : allOrders) {
            if (order.getAmount() != null) {
                totalAmount = totalAmount.add(order.getAmount());
            }
            
            Integer status = order.getStatus();
            if (status != null) {
                switch (status) {
                    case 1:
                        stats.setPendingOrders(stats.getPendingOrders() == null ? 1 : stats.getPendingOrders() + 1);
                        break;
                    case 2:
                        stats.setWaitingOrders(stats.getWaitingOrders() == null ? 1 : stats.getWaitingOrders() + 1);
                        break;
                    case 3:
                        stats.setExecutingOrders(stats.getExecutingOrders() == null ? 1 : stats.getExecutingOrders() + 1);
                        break;
                    case 4:
                        stats.setConfirmingOrders(stats.getConfirmingOrders() == null ? 1 : stats.getConfirmingOrders() + 1);
                        break;
                    case 5:
                        stats.setCompletedOrders(stats.getCompletedOrders() == null ? 1 : stats.getCompletedOrders() + 1);
                        if (order.getAmount() != null) {
                            completedAmount = completedAmount.add(order.getAmount());
                        }
                        break;
                    case 6:
                        stats.setCancelledOrders(stats.getCancelledOrders() == null ? 1 : stats.getCancelledOrders() + 1);
                        break;
                }
            }
        }
        
        stats.setTotalAmount(totalAmount);
        stats.setCompletedAmount(completedAmount);
        
        return stats;
    }

    /**
     * 订单复核
     * @param id 订单 ID
     * @param reviewResult 复核结果
     */
    @Transactional
    public void reviewOrder(Long id, String reviewResult) {
        logger.info("订单复核，id={}, reviewResult={}", id, reviewResult);
        
        OrderProtect order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在，id=" + id);
        }
        
        // 复核通过，更新订单状态为已完成
        if ("pass".equals(reviewResult)) {
            order.setStatus(5);
            order.setCompleteTime(new Date());
        } else if ("reject".equals(reviewResult)) {
            // 复核不通过，返回待执行状态
            order.setStatus(2);
        } else {
            throw new RuntimeException("无效的复核结果：" + reviewResult);
        }
        
        order.setUpdateTime(new Date());
        orderMapper.update(order);
        
        logger.info("订单复核完成，id={}, result={}", id, reviewResult);
    }

    /**
     * 验证状态流转是否合法
     * @param fromStatus 原状态
     * @param toStatus 目标状态
     * @return 是否合法
     */
    private boolean isValidStatusTransition(Integer fromStatus, Integer toStatus) {
        Map<Integer, List<Integer>> validTransitions = new HashMap<>();
        validTransitions.put(1, Arrays.asList(2, 6));       // 待承接 → 待执行/已取消
        validTransitions.put(2, Arrays.asList(3, 6));       // 待执行 → 执行中/已取消
        validTransitions.put(3, Arrays.asList(4));          // 执行中 → 待确认
        validTransitions.put(4, Arrays.asList(5));          // 待确认 → 已完成
        validTransitions.put(5, Arrays.asList(6));          // 已完成 → 已取消
        
        return validTransitions.getOrDefault(fromStatus, new ArrayList<>()).contains(toStatus);
    }
}
