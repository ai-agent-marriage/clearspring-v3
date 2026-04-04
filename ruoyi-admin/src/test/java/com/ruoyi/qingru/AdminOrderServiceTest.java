package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.OrderStats;
import com.ruoyi.qingru.service.AdminOrderService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 管理后台订单服务单元测试
 */
@SpringBootTest
public class AdminOrderServiceTest {

    @Autowired
    private AdminOrderService adminOrderService;

    /**
     * 测试获取订单列表成功
     * 验证返回的订单列表非空
     */
    @Test
    public void testGetList_Success() {
        List<OrderProtect> list = adminOrderService.getList(null, 1, 10);
        assertNotNull(list, "订单列表不应为空");
    }

    /**
     * 测试按状态筛选订单
     * 验证筛选结果正确
     */
    @Test
    public void testGetList_ByStatus() {
        List<OrderProtect> list = adminOrderService.getList(1, 1, 10);
        assertNotNull(list, "订单列表不应为空");
        list.forEach(order -> assertEquals(1, order.getStatus().intValue(), 
            "筛选结果应该都是待承接状态"));
    }

    /**
     * 测试分页获取订单
     * 验证分页参数生效
     */
    @Test
    public void testGetList_WithPagination() {
        List<OrderProtect> page1 = adminOrderService.getList(null, 1, 5);
        List<OrderProtect> page2 = adminOrderService.getList(null, 2, 5);
        
        assertNotNull(page1, "第一页不应为空");
        assertNotNull(page2, "第二页不应为空");
        assertTrue(page1.size() <= 5, "第一页数量不应超过 5");
    }

    /**
     * 测试获取订单详情成功
     * 验证返回的订单信息完整
     */
    @Test
    public void testGetDetail_Success() {
        List<OrderProtect> list = adminOrderService.getList(null, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = adminOrderService.getDetail(list.get(0).getId());
            assertNotNull(order, "订单对象不应为空");
            assertNotNull(order.getOrderNo(), "订单号不应为空");
        }
    }

    /**
     * 测试获取不存在的订单详情
     * 验证抛出异常
     */
    @Test
    public void testGetDetail_NotFound() {
        assertThrows(RuntimeException.class, () -> {
            adminOrderService.getDetail(999999L);
        }, "查询不存在的订单应抛出异常");
    }

    /**
     * 测试更新订单状态成功
     * 验证状态更新正确
     */
    @Test
    public void testUpdateStatus_Success() {
        List<OrderProtect> list = adminOrderService.getList(1, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            adminOrderService.updateStatus(order.getId(), 2);
            
            OrderProtect updated = adminOrderService.getDetail(order.getId());
            assertEquals(2, updated.getStatus().intValue(), "状态应更新为 2");
            
            // 恢复状态
            adminOrderService.updateStatus(order.getId(), 1);
        }
    }

    /**
     * 测试更新订单状态-非法流转
     * 验证抛出异常
     */
    @Test
    public void testUpdateStatus_InvalidTransition() {
        List<OrderProtect> list = adminOrderService.getList(1, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            assertThrows(RuntimeException.class, () -> {
                adminOrderService.updateStatus(order.getId(), 5); // 从 1 直接到 5 不合法
            }, "非法状态流转应抛出异常");
        }
    }

    /**
     * 测试删除订单成功
     * 验证订单被删除
     */
    @Test
    public void testDelete_Success() {
        // 先创建一个已取消的订单用于删除测试
        List<OrderProtect> list = adminOrderService.getList(6, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            adminOrderService.delete(order.getId());
            
            // 验证删除后查询不到
            assertThrows(RuntimeException.class, () -> {
                adminOrderService.getDetail(order.getId());
            }, "删除后查询应抛出异常");
        }
    }

    /**
     * 测试删除非已取消订单
     * 验证抛出异常
     */
    @Test
    public void testDelete_NotCancelled() {
        List<OrderProtect> list = adminOrderService.getList(1, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            assertThrows(RuntimeException.class, () -> {
                adminOrderService.delete(order.getId());
            }, "删除非已取消订单应抛出异常");
        }
    }

    /**
     * 测试导出订单数据
     * 验证返回字节数组
     */
    @Test
    public void testExportOrders_Success() {
        byte[] data = adminOrderService.exportOrders(null);
        assertNotNull(data, "导出数据不应为空");
        assertTrue(data.length > 0, "导出数据应有内容");
    }

    /**
     * 测试按状态导出订单
     * 验证筛选生效
     */
    @Test
    public void testExportOrders_ByStatus() {
        byte[] data = adminOrderService.exportOrders(1);
        assertNotNull(data, "导出数据不应为空");
        String content = new String(data);
        assertTrue(content.contains("订单号"), "CSV 应包含表头");
    }

    /**
     * 测试分配订单成功
     * 验证订单被分配
     */
    @Test
    public void testAssignOrder_Success() {
        List<OrderProtect> list = adminOrderService.getList(2, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            adminOrderService.assignOrder(order.getId(), 1L);
            
            OrderProtect updated = adminOrderService.getDetail(order.getId());
            assertEquals(3, updated.getStatus().intValue(), "状态应更新为执行中");
            assertEquals(1L, updated.getVolunteerId().longValue(), "志愿者 ID 应被设置");
            
            // 恢复状态
            adminOrderService.updateStatus(order.getId(), 2);
            updated = adminOrderService.getDetail(order.getId());
            updated.setVolunteerId(null);
        }
    }

    /**
     * 测试分配非待执行订单
     * 验证抛出异常
     */
    @Test
    public void testAssignOrder_InvalidStatus() {
        List<OrderProtect> list = adminOrderService.getList(1, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            assertThrows(RuntimeException.class, () -> {
                adminOrderService.assignOrder(order.getId(), 1L);
            }, "分配非待执行订单应抛出异常");
        }
    }

    /**
     * 测试获取订单统计
     * 验证统计数据完整
     */
    @Test
    public void testGetStats_Success() {
        OrderStats stats = adminOrderService.getStats();
        assertNotNull(stats, "统计数据不应为空");
        assertNotNull(stats.getTotalOrders(), "总订单数不应为空");
        assertTrue(stats.getTotalOrders() >= 0, "总订单数应大于等于 0");
    }

    /**
     * 测试订单统计-各状态数量
     * 验证各状态数量正确
     */
    @Test
    public void testGetStats_StatusCounts() {
        OrderStats stats = adminOrderService.getStats();
        
        assertNotNull(stats.getPendingOrders(), "待承接订单数不应为空");
        assertNotNull(stats.getWaitingOrders(), "待执行订单数不应为空");
        assertNotNull(stats.getExecutingOrders(), "执行中订单数不应为空");
        assertNotNull(stats.getCompletedOrders(), "已完成订单数不应为空");
    }

    /**
     * 测试订单统计-金额
     * 验证金额统计正确
     */
    @Test
    public void testGetStats_Amount() {
        OrderStats stats = adminOrderService.getStats();
        
        assertNotNull(stats.getTotalAmount(), "总金额不应为空");
        assertNotNull(stats.getCompletedAmount(), "已完成金额不应为空");
    }

    /**
     * 测试订单复核-通过
     * 验证复核通过
     */
    @Test
    public void testReviewOrder_Pass() {
        List<OrderProtect> list = adminOrderService.getList(4, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            adminOrderService.reviewOrder(order.getId(), "pass");
            
            OrderProtect updated = adminOrderService.getDetail(order.getId());
            assertEquals(5, updated.getStatus().intValue(), "状态应更新为已完成");
            
            // 恢复状态
            adminOrderService.updateStatus(order.getId(), 4);
        }
    }

    /**
     * 测试订单复核-拒绝
     * 验证复核拒绝
     */
    @Test
    public void testReviewOrder_Reject() {
        List<OrderProtect> list = adminOrderService.getList(4, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            adminOrderService.reviewOrder(order.getId(), "reject");
            
            OrderProtect updated = adminOrderService.getDetail(order.getId());
            assertEquals(2, updated.getStatus().intValue(), "状态应更新为待执行");
            
            // 恢复状态
            adminOrderService.updateStatus(order.getId(), 4);
        }
    }

    /**
     * 测试订单复核-无效结果
     * 验证抛出异常
     */
    @Test
    public void testReviewOrder_InvalidResult() {
        List<OrderProtect> list = adminOrderService.getList(4, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            assertThrows(RuntimeException.class, () -> {
                adminOrderService.reviewOrder(order.getId(), "invalid");
            }, "无效复核结果应抛出异常");
        }
    }

    /**
     * 测试订单对象结构完整
     * 验证所有必要字段都存在
     */
    @Test
    public void testOrderStructure_Complete() {
        List<OrderProtect> list = adminOrderService.getList(null, 1, 1);
        if (!list.isEmpty()) {
            OrderProtect order = list.get(0);
            
            assertNotNull(order.getId(), "订单 ID 不应为空");
            assertNotNull(order.getOrderNo(), "订单号不应为空");
            assertNotNull(order.getUserId(), "用户 ID 不应为空");
            assertNotNull(order.getStatus(), "状态不应为空");
            assertNotNull(order.getCreateTime(), "创建时间不应为空");
        }
    }
}
