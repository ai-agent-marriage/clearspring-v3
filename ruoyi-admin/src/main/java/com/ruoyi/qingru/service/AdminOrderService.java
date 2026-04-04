package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.OrderStats;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

/**
 * 管理后台订单服务类
 * 
 * @author qingru
 * @version 1.0
 * @since 2026-04-04
 */
@Service
@Slf4j
public class AdminOrderService {

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
        
        log.info("获取订单列表，status={}, pageNum={}, pageSize={}", status, pageNum, pageSize);
        return orderMapper.selectByStatus(status, offset, pageSize);
    }

    /**
     * 获取订单详情
     * @param id 订单 ID（orderNo）
     * @return 订单详情
     */
    public OrderProtect getDetail(Long id) {
        log.info("获取订单详情，id={}", id);
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
        log.info("更新订单状态，id={}, status={}", id, status);
        
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
        
        log.info("订单状态更新成功，id={}, oldStatus={}, newStatus={}", id, order.getStatus(), status);
    }

    /**
     * 删除订单
     * @param id 订单 ID
     */
    @Transactional
    public void delete(Long id) {
        log.info("删除订单，id={}", id);
        
        OrderProtect order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在，id=" + id);
        }
        
        // 只有已取消的订单才能删除
        if (order.getStatus() != 6) {
            throw new RuntimeException("只能删除已取消的订单，当前状态=" + order.getStatus());
        }
        
        orderMapper.delete(id);
        log.info("订单删除成功，id={}", id);
    }

    /**
     * 导出订单数据（性能优化：限制最大导出数量，防止 OOM）
     * @param status 状态（可选）
     * @return Excel 文件字节数组
     */
    public byte[] exportOrders(Integer status) {
        log.info("导出订单数据，status={}", status);
        
        // 性能优化：限制最大导出数量为 5000 条，防止内存溢出
        final int MAX_EXPORT_COUNT = 5000;
        List<OrderProtect> orders = orderMapper.selectForExportWithLimit(status, MAX_EXPORT_COUNT);
        
        log.info("实际导出订单数：{}/{}", orders.size(), MAX_EXPORT_COUNT);
        
        // 生成 CSV 格式数据（简化实现，实际项目应使用 POI 生成 Excel）
        StringBuilder sb = new StringBuilder(orders.size() * 100); // 预分配容量
        sb.append("订单号，用户 ID，机构 ID，志愿者 ID，物种 ID，数量，金额，状态，地址，创建时间\n");
        
        for (OrderProtect order : orders) {
            sb.append(order.getOrderNo()).append(",")
              .append(order.getUserId()).append(",")
              .append(order.getOrgId() != null ? order.getOrgId() : "").append(",")
              .append(order.getVolunteerId() != null ? order.getVolunteerId() : "").append(",")
              .append(order.getSpeciesId()).append(",")
              .append(order.getQuantity()).append(",")
              .append(order.getAmount()).append(",")
              .append(order.getStatus()).append(",")
              .append(order.getAddress() != null ? order.getAddress() : "").append(",")
              .append(order.getCreateTime() != null ? order.getCreateTime() : "").append("\n");
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
        log.info("分配订单，id={}, volunteerId={}", id, volunteerId);
        
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
        
        log.info("订单分配成功，id={}, volunteerId={}", id, volunteerId);
    }

    /**
     * 获取订单统计（性能优化：使用 SQL 聚合查询替代内存统计）
     * @return 订单统计数据
     */
    @Cacheable(value = "order:stats", key = "'global'", unless = "#result == null", cacheManager = "cacheManager")
    public OrderStats getStats() {
        log.info("获取订单统计（SQL 聚合优化）");
        
        OrderStats stats = new OrderStats();
        
        // 使用 SQL 聚合查询，避免加载大量数据到内存
        stats.setTotalOrders(orderMapper.countByStatus(null));
        stats.setPendingOrders(orderMapper.countByStatus(1));
        stats.setWaitingOrders(orderMapper.countByStatus(2));
        stats.setExecutingOrders(orderMapper.countByStatus(3));
        stats.setConfirmingOrders(orderMapper.countByStatus(4));
        stats.setCompletedOrders(orderMapper.countByStatus(5));
        stats.setCancelledOrders(orderMapper.countByStatus(6));
        
        // 使用 SQL 聚合查询金额
        stats.setTotalAmount(orderMapper.sumAmountByStatus(null));
        stats.setCompletedAmount(orderMapper.sumAmountByStatus(5));
        
        log.info("订单统计完成，总订单数：{}", stats.getTotalOrders());
        return stats;
    }

    /**
     * 订单复核
     * @param id 订单 ID
     * @param reviewResult 复核结果
     */
    @Transactional
    public void reviewOrder(Long id, String reviewResult) {
        log.info("订单复核，id={}, reviewResult={}", id, reviewResult);
        
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
        
        log.info("订单复核完成，id={}, result={}", id, reviewResult);
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
