package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.service.OrgOrderService;
import com.ruoyi.qingru.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

/**
 * 机构订单服务单元测试
 * 测试机构承接订单、查询可承接订单等功能
 */
@SpringBootTest
public class OrgOrderServiceTest {

    @Autowired
    private OrgOrderService orgOrderService;

    @Autowired
    private OrderService orderService;

    /**
     * 测试机构成功承接订单
     * 验证订单状态变为待执行，并绑定机构 ID
     */
    @Test
    public void testAcceptOrder_Success() {
        String orderNo = "PRO202604070001";
        Long orgId = 1L;

        orgOrderService.acceptOrder(orderNo, orgId);

        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(2, order.getStatus().intValue(), "订单状态应变为待执行");
        assertEquals(orgId, order.getOrgId(), "订单应绑定承接机构");
    }

    /**
     * 测试承接状态错误的订单
     * 验证非待承接状态的订单不能被承接
     */
    @Test
    public void testAcceptOrder_WrongStatus() {
        String orderNo = "PRO202604070002"; // 状态不是待承接
        Long orgId = 1L;

        assertThrows(RuntimeException.class, () -> {
            orgOrderService.acceptOrder(orderNo, orgId);
        }, "非待承接状态的订单不能被承接");
    }

    /**
     * 测试获取可承接订单列表
     * 验证返回的订单都是待承接状态
     */
    @Test
    public void testGetAvailableOrders() {
        Long orgId = 1L;
        List<OrderProtect> orders = orgOrderService.getAvailableOrders(orgId, 1, 10);

        assertNotNull(orders, "订单列表不应为空");
        orders.forEach(order -> {
            assertEquals(1, order.getStatus().intValue(), "可承接订单状态应为待承接");
        });
    }

    /**
     * 测试分页查询可承接订单
     * 验证分页参数生效
     */
    @Test
    public void testGetAvailableOrders_WithPagination() {
        Long orgId = 1L;
        int pageNum = 1;
        int pageSize = 5;

        List<OrderProtect> orders = orgOrderService.getAvailableOrders(orgId, pageNum, pageSize);

        assertNotNull(orders, "订单列表不应为空");
        assertTrue(orders.size() <= pageSize, "返回数量不应超过页大小");
    }

    /**
     * 测试机构重复承接同一订单
     * 验证已承接的订单不能再次被承接
     */
    @Test
    public void testAcceptOrder_AlreadyAccepted() {
        String orderNo = "PRO202604070001";
        Long orgId = 2L;

        // 订单已被承接，再次承接应该失败
        assertThrows(RuntimeException.class, () -> {
            orgOrderService.acceptOrder(orderNo, orgId);
        }, "已承接的订单不能再次被承接");
    }

    /**
     * 测试机构查询我的订单列表
     * 验证返回该机构承接的所有订单
     */
    @Test
    public void testGetMyOrders() {
        Long orgId = 1L;
        List<OrderProtect> orders = orgOrderService.getMyOrders(orgId, 1, 10);

        assertNotNull(orders, "订单列表不应为空");
        orders.forEach(order -> {
            assertEquals(orgId, order.getOrgId(), "订单应属于该机构");
        });
    }

    /**
     * 测试机构按状态筛选订单
     * 验证状态筛选功能正常
     */
    @Test
    public void testGetMyOrders_ByStatus() {
        Long orgId = 1L;
        Integer status = 2; // 待执行
        List<OrderProtect> orders = orgOrderService.getMyOrdersByStatus(orgId, status, 1, 10);

        assertNotNull(orders, "订单列表不应为空");
        orders.forEach(order -> {
            assertEquals(status, order.getStatus().intValue(), "订单状态应为筛选状态");
            assertEquals(orgId, order.getOrgId(), "订单应属于该机构");
        });
    }
}
