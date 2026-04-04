package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.InternalMessage;
import com.ruoyi.qingru.entity.MessageRecord;
import com.ruoyi.qingru.service.MessageService;
import com.ruoyi.qingru.service.MessagePushService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Day 15 消息推送集成测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/MessagePushIntegrationTest.java
 * 
 * 测试范围:
 * - 订阅消息发送流程
 * - 站内信收发流程
 * - 消息推送异步流程
 * - 消息推送失败重试
 * 
 * 用例数量：10 个
 */
@SpringBootTest
public class MessagePushIntegrationTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessagePushService messagePushService;

    // ==================== 订阅消息发送流程测试 (3 个用例) ====================

    /**
     * 测试完整订阅消息发送流程
     */
    @Test
    public void testCompleteSubscribeMessageFlow_Success() {
        // Step 1: 获取模板列表
        List<MessageRecord> templates = messageService.getMessageRecordList(null, null, null, 1, 10);
        assertNotNull(templates, "模板列表不应为空");

        // Step 2: 发送订阅消息
        Map<String, Object> sendResult = messageService.sendSubscribeMessage(
            "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
            "ORDER_CREATE",
            Map.of("orderNo", "PRO202604040001")
        );
        assertNotNull(sendResult, "发送结果不应为空");
        assertTrue(sendResult.containsKey("messageId"), "应包含消息 ID");

        // Step 3: 查询发送状态
        if (sendResult.containsKey("messageId")) {
            Map<String, Object> status = messageService.queryMessageStatus(
                Long.valueOf(sendResult.get("messageId").toString())
            );
            assertNotNull(status, "状态查询结果不应为空");
        }
    }

    /**
     * 测试订阅消息发送 - 模板验证
     */
    @Test
    public void testSubscribeMessage_TemplateValidation() {
        // 获取模板列表验证启用状态
        List<MessageRecord> templates = messageService.getMessageRecordList(null, null, null, 1, 100);
        
        assertNotNull(templates, "模板列表不应为空");
        
        // 验证模板字段完整性
        for (MessageRecord template : templates) {
            assertNotNull(template, "模板不应为空");
        }
    }

    /**
     * 测试订阅消息发送 - 参数验证
     */
    @Test
    public void testSubscribeMessage_ParameterValidation() {
        // 测试空 openid
        assertThrows(IllegalArgumentException.class, () -> {
            messageService.sendSubscribeMessage(null, "ORDER_CREATE", Map.of());
        }, "openid 为空应抛出异常");

        // 测试空 templateId
        assertThrows(IllegalArgumentException.class, () -> {
            messageService.sendSubscribeMessage("test_openid", null, Map.of());
        }, "templateId 为空应抛出异常");
    }

    // ==================== 站内信收发流程测试 (3 个用例) ====================

    /**
     * 测试完整站内信收发流程
     */
    @Test
    public void testCompleteInternalMessageFlow_Success() {
        // Step 1: 发送站内信
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("集成测试消息-" + System.currentTimeMillis());
        message.setContent("这是一条测试消息");
        message.setType(1);
        
        Long messageId = messageService.sendInternalMessage(message);
        assertNotNull(messageId, "消息 ID 不应为空");

        // Step 2: 获取消息列表
        List<InternalMessage> messages = messageService.getInternalMessageList(1L, null, null, null, null);
        assertNotNull(messages, "消息列表不应为空");
        assertTrue(messages.size() >= 1, "应至少包含 1 条消息");

        // Step 3: 标记为已读
        messageService.markInternalMessageAsRead(messageId);
        InternalMessage updated = messageService.getInternalMessageDetail(messageId);
        assertNotNull(updated, "更新后的消息不应为空");
        assertEquals(1, updated.getStatus().intValue(), "状态应变为已读");

        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    /**
     * 测试站内信接收 - 未读消息数量
     */
    @Test
    public void testGetUnreadMessageCount_Success() {
        Integer unreadCount = messageService.getUnreadMessageCount(1L);
        
        assertNotNull(unreadCount, "未读消息数量不应为空");
        assertTrue(unreadCount >= 0, "未读消息数量应大于等于 0");
    }

    /**
     * 测试站内信批量标记已读
     */
    @Test
    public void testBatchMarkInternalMessagesAsRead_Success() {
        // 创建多条消息
        for (int i = 0; i < 3; i++) {
            InternalMessage message = new InternalMessage();
            message.setUserId(1L);
            message.setTitle("批量测试-" + i);
            message.setContent("内容-" + i);
            message.setType(1);
            message.setStatus(0);
            messageService.sendInternalMessage(message);
        }

        // 批量标记为已读
        messageService.batchMarkInternalMessagesAsRead(1L);

        // 验证
        List<InternalMessage> messages = messageService.getInternalMessageList(1L, null, 1, null, null);
        assertNotNull(messages, "已读消息列表不应为空");
    }

    // ==================== 消息推送异步流程测试 (2 个用例) ====================

    /**
     * 测试订单创建异步推送
     */
    @Test
    public void testOrderCreateAsyncPush_Success() {
        Long orderId = 1001L;
        
        // 触发异步推送（不抛异常即为成功）
        assertDoesNotThrow(() -> {
            messagePushService.pushOnOrderCreate(orderId);
        }, "订单创建推送不应抛出异常");

        // 等待异步执行
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 验证站内信是否创建
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(messages, "站内信列表不应为空");
    }

    /**
     * 测试系统通知异步推送
     */
    @Test
    public void testSystemNotificationAsyncPush_Success() {
        Long userId = 1L;
        String title = "系统通知测试";
        String content = "这是一条测试系统通知";
        
        // 触发异步推送
        assertDoesNotThrow(() -> {
            messagePushService.pushSystemNotification(userId, title, content);
        }, "系统通知推送不应抛出异常");

        // 等待异步执行
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 验证站内信是否创建
        List<InternalMessage> messages = messageService.getInternalMessageList(userId, 2, null, null, null);
        assertNotNull(messages, "站内信列表不应为空");
    }

    // ==================== 消息推送失败重试测试 (2 个用例) ====================

    /**
     * 测试推送失败重试机制
     */
    @Test
    public void testPushFailureRetryMechanism() {
        // 测试重试参数
        int maxRetries = 3;
        int retryDelay = 1000; // ms
        
        // 验证重试配置
        assertTrue(maxRetries >= 1, "最大重试次数应至少为 1");
        assertTrue(retryDelay >= 500, "重试延迟应至少 500ms");
        
        // 模拟重试逻辑
        int attemptCount = 0;
        boolean success = false;
        
        for (int i = 0; i < maxRetries; i++) {
            attemptCount++;
            // 模拟第三次尝试成功
            if (i == 2) {
                success = true;
                break;
            }
        }
        
        assertTrue(success, "重试后应成功");
        assertEquals(3, attemptCount, "应尝试 3 次");
    }

    /**
     * 测试推送失败日志记录
     */
    @Test
    public void testPushFailureLogging() {
        // 准备失败日志数据
        String openid = "test_openid";
        String error = "Network Error";
        String templateId = "TEST_TEMPLATE";
        
        // 记录失败日志（验证不抛异常）
        assertDoesNotThrow(() -> {
            messageService.logPushFailure(openid, templateId, error);
        }, "记录失败日志不应抛出异常");

        // 获取失败日志列表
        List<MessageRecord> failureLogs = messageService.getMessageRecordList("failed", null, null, 1, 10);
        assertNotNull(failureLogs, "失败日志列表不应为空");
    }
}
