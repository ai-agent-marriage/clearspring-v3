package com.ruoyi.qingru;

import com.ruoyi.qingru.domain.OrderProtect;
import com.ruoyi.qingru.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 订单接口单元测试
 * 测试订单创建、支付、查询、确认等功能
 */
@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testCreateOrder_Success() {
        OrderProtect order = new OrderProtect();
        order.setUserId(1L);
        order.setSpeciesId(1L);
        order.setQuantity(10);
        order.setAmount(new BigDecimal("299.00"));
        order.setAddress("珠江广州段");

        OrderProtect created = orderService.createOrder(order);

        assertNotNull(created);
        assertNotNull(created.getOrderNo());
        assertEquals(1, created.getStatus().intValue()); // 待承接
        assertEquals(1L, created.getUserId());
        assertEquals(10, created.getQuantity().intValue());
    }

    @Test
    public void testCreateOrder_OrderNoFormat() {
        OrderProtect order = new OrderProtect();
        order.setUserId(1L);
        order.setSpeciesId(1L);
        order.setQuantity(5);

        OrderProtect created = orderService.createOrder(order);

        assertTrue(created.getOrderNo().startsWith("PRO"));
        assertEquals(17, created.getOrderNo().length()); // PRO + yyyyMMdd + 4 位随机数
        
        // 验证订单号格式：PRO + 8 位日期 + 4 位随机数
        String orderNo = created.getOrderNo();
        assertTrue(orderNo.matches("PRO\\d{12}"));
    }

    @Test
    public void testCreateOrder_WithAllFields() {
        OrderProtect order = new OrderProtect();
        order.setUserId(1L);
        order.setSpeciesId(1L);
        order.setQuantity(20);
        order.setAmount(new BigDecimal("599.00"));
        order.setAddress("珠江广州段");
        order.setRemark("功德回向给家人");

        OrderProtect created = orderService.createOrder(order);

        assertNotNull(created);
        assertEquals(1L, created.getUserId());
        assertEquals(20, created.getQuantity().intValue());
        assertEquals(new BigDecimal("599.00"), created.getAmount());
        assertEquals("珠江广州段", created.getAddress());
    }

    @Test
    public void testPayOrder_Success() {
        String orderNo = "PRO202604070001";
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";

        Map<String, String> payParams = orderService.payOrder(orderNo, openid);

        assertNotNull(payParams);
        assertTrue(payParams.containsKey("appId"));
        assertTrue(payParams.containsKey("timeStamp"));
        assertTrue(payParams.containsKey("paySign"));
        assertTrue(payParams.containsKey("nonceStr"));
        assertTrue(payParams.containsKey("package"));
        assertTrue(payParams.containsKey("signType"));
    }

    @Test
    public void testPayOrder_InvalidOrderNo() {
        String orderNo = "INVALID_ORDER";
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";

        assertThrows(RuntimeException.class, () -> {
            orderService.payOrder(orderNo, openid);
        });
    }

    @Test
    public void testGetMyOrders_Success() {
        Long userId = 1L;
        List<OrderProtect> orders = orderService.getMyOrders(userId, null, 1, 10);

        assertNotNull(orders);
        assertTrue(orders instanceof List);
    }

    @Test
    public void testGetMyOrders_WithStatusFilter() {
        Long userId = 1L;
        Integer status = 1; // 待承接
        List<OrderProtect> orders = orderService.getMyOrders(userId, status, 1, 10);

        assertNotNull(orders);
        // 验证所有订单状态都是待承接
        for (OrderProtect order : orders) {
            assertEquals(status, order.getStatus());
        }
    }

    @Test
    public void testGetMyOrders_Pagination() {
        Long userId = 1L;
        List<OrderProtect> ordersPage1 = orderService.getMyOrders(userId, null, 1, 5);
        List<OrderProtect> ordersPage2 = orderService.getMyOrders(userId, null, 2, 5);

        assertNotNull(ordersPage1);
        assertNotNull(ordersPage2);
        // 验证分页正常
        assertTrue(ordersPage1.size() <= 5);
    }

    @Test
    public void testConfirmOrder_Success() {
        String orderNo = "PRO202604070001";
        Integer score = 5;
        String comment = "非常满意";

        orderService.confirmOrder(orderNo, score, comment);

        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(5, order.getStatus().intValue()); // 已完成
        assertEquals(5, order.getScore().intValue());
        assertEquals("非常满意", order.getComment());
    }

    @Test
    public void testConfirmOrder_InvalidScore() {
        String orderNo = "PRO202604070001";
        Integer score = 6; // 评分超过最大值
        String comment = "测试";

        assertThrows(RuntimeException.class, () -> {
            orderService.confirmOrder(orderNo, score, comment);
        });
    }

    @Test
    public void testGetByOrderNo_Success() {
        String orderNo = "PRO202604070001";

        OrderProtect order = orderService.getByOrderNo(orderNo);

        assertNotNull(order);
        assertEquals(orderNo, order.getOrderNo());
    }

    @Test
    public void testGetByOrderNo_NotFound() {
        String orderNo = "PRO_NOT_EXIST";

        OrderProtect order = orderService.getByOrderNo(orderNo);

        assertNull(order);
    }

    @Test
    public void testCancelOrder_Success() {
        String orderNo = "PRO202604070002";

        orderService.cancelOrder(orderNo);

        OrderProtect order = orderService.getByOrderNo(orderNo);
        assertEquals(-1, order.getStatus().intValue()); // 已取消
    }

    @Test
    public void testCancelOrder_AlreadyPaid() {
        String orderNo = "PRO202604070001"; // 假设已支付

        assertThrows(RuntimeException.class, () -> {
            orderService.cancelOrder(orderNo);
        });
    }
}
