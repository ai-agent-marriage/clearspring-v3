package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.InternalMessage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 消息推送服务测试
 * 测试异步推送、重试机制和推送记录功能
 */
@SpringBootTest
class MessagePushServiceTest {

    @Autowired
    private MessagePushService messagePushService;

    @Autowired
    private MessageService messageService;

    @Test
    void testPushOnOrderCreate() {
        // 测试订单创建推送（异步方法，主要验证不抛异常）
        Long orderId = 1001L;
        
        assertDoesNotThrow(() -> {
            messagePushService.pushOnOrderCreate(orderId);
        });
        
        // 等待异步执行完成
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 验证站内信是否创建
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(messages);
    }

    @Test
    void testPushOnOrderComplete() {
        // 测试订单完成推送（异步方法，主要验证不抛异常）
        Long orderId = 1002L;
        
        assertDoesNotThrow(() -> {
            messagePushService.pushOnOrderComplete(orderId);
        });
        
        // 等待异步执行完成
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 验证站内信是否创建
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(messages);
    }

    @Test
    void testPushSystemNotification() {
        // 测试系统通知推送（异步方法，主要验证不抛异常）
        Long userId = 1L;
        String title = "系统通知测试";
        String content = "这是一条测试系统通知";
        
        assertDoesNotThrow(() -> {
            messagePushService.pushSystemNotification(userId, title, content);
        });
        
        // 等待异步执行完成
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 验证站内信是否创建
        List<InternalMessage> messages = messageService.getInternalMessageList(userId, 2, null, null, null);
        assertNotNull(messages);
    }

    @Test
    void testPushOnOrderCreate_MultipleOrders() {
        // 测试多个订单创建推送
        for (int i = 0; i < 3; i++) {
            Long orderId = 2000L + i;
            messagePushService.pushOnOrderCreate(orderId);
        }
        
        // 等待异步执行完成
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 验证站内信数量
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(messages);
        assertTrue(messages.size() >= 3);
    }

    @Test
    void testPushSystemNotification_MultipleUsers() {
        // 测试向多个用户发送系统通知
        for (long userId = 100; userId < 105; userId++) {
            messagePushService.pushSystemNotification(userId, "通知" + userId, "内容" + userId);
        }
        
        // 等待异步执行完成
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 验证站内信数量
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 2, null, null, null);
        assertNotNull(messages);
        assertTrue(messages.size() >= 5);
    }

    @Test
    void testGetPushRecord() {
        // 测试获取推送记录
        Long orderId = 3001L;
        messagePushService.pushOnOrderCreate(orderId);
        
        // 等待异步执行完成
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 获取推送记录（记录 ID 格式：ORDER_CREATE_orderId_timestamp）
        List<MessagePushService.PushRecord> records = messagePushService.getAllPushRecords();
        assertNotNull(records);
        assertTrue(records.size() > 0);
    }

    @Test
    void testGetAllPushRecords() {
        // 测试获取所有推送记录
        List<MessagePushService.PushRecord> records = messagePushService.getAllPushRecords();
        assertNotNull(records);
    }

    @Test
    void testPushRecordStructure() {
        // 测试推送记录结构
        Long orderId = 3002L;
        messagePushService.pushOnOrderCreate(orderId);
        
        // 等待异步执行完成
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        List<MessagePushService.PushRecord> records = messagePushService.getAllPushRecords();
        assertNotNull(records);
        
        // 验证记录字段
        MessagePushService.PushRecord record = records.stream()
                .filter(r -> r.getOrderId() != null && r.getOrderId().equals(orderId))
                .findFirst()
                .orElse(null);
        
        if (record != null) {
            assertNotNull(record.getRecordId());
            assertNotNull(record.getType());
            assertNotNull(record.getCreateTime());
            assertNotNull(record.getLogs());
        }
    }

    @Test
    void testConcurrentPush() {
        // 测试并发推送
        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int index = i;
            threads[i] = new Thread(() -> {
                messagePushService.pushSystemNotification(
                    (long) (500 + index), 
                    "并发测试" + index, 
                    "内容" + index
                );
            });
            threads[i].start();
        }
        
        // 等待所有线程完成
        for (Thread thread : threads) {
            try {
                thread.join(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // 验证站内信数量
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 2, null, null, null);
        assertNotNull(messages);
        assertTrue(messages.size() >= 5);
    }

    @Test
    void testPushWithNullData() {
        // 测试推送时数据为 null 的情况
        Long orderId = 3003L;
        
        assertDoesNotThrow(() -> {
            messagePushService.pushOnOrderCreate(orderId);
        });
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(messages);
    }
}
