package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.service.OrderService;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

/**
 * 订单状态流转单元测试
 * 测试订单状态变更、自动取消等功能
 */
@SpringBootTest
public class OrderStatusTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderProtectMapper orderMapper;

    /**
     * 测试有效的订单状态流转
     * 验证 1 待承接 → 2 待执行 的流转
     */
    @Test
    public void testUpdateOrderStatus_ValidTransition() {
        String orderNo = "PRO202604070001";
        
        // 1 待承接 → 2 待执行
        orderService.updateOrderStatus(orderNo, 2);
        
        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(2, order.getStatus().intValue(), "订单状态应变为待执行");
    }

    /**
     * 测试非法的订单状态流转
     * 验证 1 待承接 → 5 已完成 的非法流转会被阻止
     */
    @Test
    public void testUpdateOrderStatus_InvalidTransition() {
        String orderNo = "PRO202604070001";
        
        // 1 待承接 → 5 已完成（非法流转）
        assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus(orderNo, 5);
        }, "非法状态流转应抛出异常");
    }

    /**
     * 测试取消订单
     * 验证订单可以正常取消
     */
    @Test
    public void testCancelOrder() {
        String orderNo = "PRO202604070001";
        
        orderService.updateOrderStatus(orderNo, 6);
        
        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(6, order.getStatus().intValue(), "订单状态应变为已取消");
    }

    /**
     * 测试自动取消未承接订单
     * 验证超过 48 小时未承接的订单会被自动取消
     */
    @Test
    public void testAutoCancelUnclaimedOrders() {
        // 创建 48 小时前的订单
        OrderProtect order = new OrderProtect();
        order.setOrderNo("PRO202604050001");
        order.setCreateTime(new Date(System.currentTimeMillis() - 49 * 60 * 60 * 1000));
        order.setStatus(1); // 待承接
        orderMapper.insert(order);

        // 执行自动取消
        orderService.autoCancelUnclaimedOrders();

        OrderProtect updated = orderService.getByOrderNo("PRO202604050001");
        assertEquals(6, updated.getStatus().intValue(), "超时未承接订单应被自动取消");
    }

    /**
     * 测试订单状态流转：待执行 → 执行中
     * 验证正常业务流程
     */
    @Test
    public void testUpdateOrderStatus_ToExecuting() {
        String orderNo = "PRO202604070001";
        
        // 先设置为待执行
        orderService.updateOrderStatus(orderNo, 2);
        
        // 待执行 → 执行中
        orderService.updateOrderStatus(orderNo, 3);
        
        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(3, order.getStatus().intValue(), "订单状态应变为执行中");
    }

    /**
     * 测试订单状态流转：执行中 → 待确认
     * 验证正常业务流程
     */
    @Test
    public void testUpdateOrderStatus_ToPendingConfirm() {
        String orderNo = "PRO202604070001";
        
        // 设置为执行中
        orderService.updateOrderStatus(orderNo, 3);
        
        // 执行中 → 待确认
        orderService.updateOrderStatus(orderNo, 4);
        
        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(4, order.getStatus().intValue(), "订单状态应变为待确认");
    }

    /**
     * 测试订单状态流转：待确认 → 已完成
     * 验证正常业务流程
     */
    @Test
    public void testUpdateOrderStatus_ToCompleted() {
        String orderNo = "PRO202604070001";
        
        // 设置为待确认
        orderService.updateOrderStatus(orderNo, 4);
        
        // 待确认 → 已完成
        orderService.updateOrderStatus(orderNo, 5);
        
        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(5, order.getStatus().intValue(), "订单状态应变为已完成");
    }

    /**
     * 测试非法状态流转：已取消 → 任何状态
     * 验证已取消订单不能再次流转
     */
    @Test
    public void testUpdateOrderStatus_CancelledOrder() {
        String orderNo = "PRO202604070001";
        
        // 先取消订单
        orderService.updateOrderStatus(orderNo, 6);
        
        // 已取消 → 任何状态都应该失败
        assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus(orderNo, 2);
        }, "已取消订单不能再次流转");
    }

    /**
     * 测试订单状态查询
     * 验证可以正确获取订单当前状态
     */
    @Test
    public void testGetOrderStatus() {
        String orderNo = "PRO202604070001";
        
        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertNotNull(order, "订单对象不应为空");
        assertNotNull(order.getStatus(), "订单状态不应为空");
        assertTrue(order.getStatus() >= 1 && order.getStatus() <= 6, 
            "订单状态应在有效范围内");
    }
}
