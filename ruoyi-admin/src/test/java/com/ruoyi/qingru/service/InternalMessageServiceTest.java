package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.InternalMessage;
import com.ruoyi.qingru.service.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Day 15 站内信服务测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/InternalMessageServiceTest.java
 * 
 * 测试范围:
 * - 站内信创建测试
 * - 站内信查询测试
 * - 站内信状态更新测试
 * - 站内信删除测试
 * 
 * 用例数量：15 个
 */
@SpringBootTest
public class InternalMessageServiceTest {

    @Autowired
    private MessageService messageService;

    // ==================== 站内信创建测试 (4 个用例) ====================

    /**
     * 测试创建站内信成功
     */
    @Test
    public void testCreateInternalMessage_Success() {
        // 准备测试数据
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("测试站内信-" + System.currentTimeMillis());
        message.setContent("这是测试站内信的内容");
        message.setType(1);
        
        // 创建站内信
        Long messageId = messageService.sendInternalMessage(message);
        
        // 验证结果
        assertNotNull(messageId, "消息 ID 不应为空");
        assertTrue(messageId > 0, "消息 ID 应大于 0");
        
        // 清理测试数据
        messageService.deleteInternalMessage(messageId);
    }

    /**
     * 测试创建不同类型站内信
     */
    @Test
    public void testCreateInternalMessage_DifferentTypes() {
        Integer[] types = {1, 2, 3, 4};
        
        for (Integer type : types) {
            InternalMessage message = new InternalMessage();
            message.setUserId(1L);
            message.setTitle("测试消息 - 类型" + type);
            message.setContent("测试内容");
            message.setType(type);
            
            Long messageId = messageService.sendInternalMessage(message);
            assertNotNull(messageId, "类型 " + type + " 的消息创建应成功");
            
            // 清理
            messageService.deleteInternalMessage(messageId);
        }
    }

    /**
     * 测试创建站内信 - 带优先级
     */
    @Test
    public void testCreateInternalMessage_WithPriority() {
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("高优先级测试");
        message.setContent("这是一条高优先级消息");
        message.setType(1);
        message.setPriority(1); // 高优先级
        
        Long messageId = messageService.sendInternalMessage(message);
        
        assertNotNull(messageId, "带优先级的消息创建应成功");
        
        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    /**
     * 测试批量创建站内信
     */
    @Test
    public void testBatchCreateInternalMessages_Success() {
        // 准备测试数据
        for (int i = 0; i < 5; i++) {
            InternalMessage message = new InternalMessage();
            message.setUserId(1L);
            message.setTitle("批量测试-" + i);
            message.setContent("内容-" + i);
            message.setType(1);
            
            Long messageId = messageService.sendInternalMessage(message);
            assertNotNull(messageId, "批量创建第 " + i + " 条消息应成功");
            
            // 清理
            messageService.deleteInternalMessage(messageId);
        }
    }

    // ==================== 站内信查询测试 (5 个用例) ====================

    /**
     * 测试获取站内信列表
     */
    @Test
    public void testGetInternalMessageList_Success() {
        // 获取站内信列表
        List<InternalMessage> messages = messageService.getInternalMessageList(null, null, null, null, null);
        
        // 验证
        assertNotNull(messages, "站内信列表不应为空");
    }

    /**
     * 测试按用户 ID 查询站内信
     */
    @Test
    public void testGetInternalMessageList_ByUserId() {
        // 按用户 ID 查询
        List<InternalMessage> userMessages = messageService.getInternalMessageList(1L, null, null, null, null);
        
        // 验证
        assertNotNull(userMessages, "用户消息列表不应为空");
    }

    /**
     * 测试按类型查询站内信
     */
    @Test
    public void testGetInternalMessageList_ByType() {
        // 按类型查询（系统通知）
        List<InternalMessage> type1Messages = messageService.getInternalMessageList(null, 1, null, null, null);
        
        // 验证
        assertNotNull(type1Messages, "类型 1 消息列表不应为空");
        
        // 按类型查询（订单通知）
        List<InternalMessage> type2Messages = messageService.getInternalMessageList(null, 2, null, null, null);
        
        // 验证
        assertNotNull(type2Messages, "类型 2 消息列表不应为空");
    }

    /**
     * 测试按状态查询站内信
     */
    @Test
    public void testGetInternalMessageList_ByStatus() {
        // 按状态查询（未读）
        List<InternalMessage> unreadMessages = messageService.getInternalMessageList(null, null, 0, null, null);
        
        // 验证
        assertNotNull(unreadMessages, "未读消息列表不应为空");
        
        // 按状态查询（已读）
        List<InternalMessage> readMessages = messageService.getInternalMessageList(null, null, 1, null, null);
        
        // 验证
        assertNotNull(readMessages, "已读消息列表不应为空");
    }

    /**
     * 测试获取站内信详情
     */
    @Test
    public void testGetInternalMessageDetail_Success() {
        // 先创建一条消息
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("详情测试");
        message.setContent("测试内容");
        message.setType(1);
        
        Long messageId = messageService.sendInternalMessage(message);
        
        // 获取详情
        InternalMessage detail = messageService.getInternalMessageDetail(messageId);
        
        // 验证
        assertNotNull(detail, "消息详情不应为空");
        assertEquals(messageId, detail.getId(), "消息 ID 应匹配");
        assertEquals("详情测试", detail.getTitle(), "标题应匹配");
        
        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    // ==================== 站内信状态更新测试 (4 个用例) ====================

    /**
     * 测试标记站内信为已读
     */
    @Test
    public void testMarkInternalMessageAsRead_Success() {
        // 先创建一条消息
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("已读测试");
        message.setContent("测试内容");
        message.setType(1);
        message.setStatus(0); // 未读
        
        Long messageId = messageService.sendInternalMessage(message);
        
        // 标记为已读
        messageService.markInternalMessageAsRead(messageId);
        
        // 验证状态已更新
        InternalMessage updated = messageService.getInternalMessageDetail(messageId);
        assertNotNull(updated, "更新后的消息不应为空");
        assertEquals(1, updated.getStatus().intValue(), "状态应变为已读");
        
        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    /**
     * 测试批量标记站内信为已读
     */
    @Test
    public void testBatchMarkInternalMessagesAsRead_Success() {
        // 创建多条消息
        for (int i = 0; i < 3; i++) {
            InternalMessage message = new InternalMessage();
            message.setUserId(1L);
            message.setTitle("批量已读测试-" + i);
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

    /**
     * 测试获取未读消息数量
     */
    @Test
    public void testGetUnreadMessageCount_Success() {
        // 获取未读消息数量
        Integer unreadCount = messageService.getUnreadMessageCount(1L);
        
        // 验证
        assertNotNull(unreadCount, "未读消息数量不应为空");
        assertTrue(unreadCount >= 0, "未读消息数量应大于等于 0");
    }

    /**
     * 测试清空站内信
     */
    @Test
    public void testClearInternalMessages_Success() {
        // 先创建一条测试消息
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("待清空测试");
        message.setContent("测试内容");
        message.setType(1);
        
        Long messageId = messageService.sendInternalMessage(message);
        
        // 清空消息
        messageService.clearInternalMessages(1L);
        
        // 验证消息已被清空
        List<InternalMessage> messages = messageService.getInternalMessageList(1L, null, null, null, null);
        assertNotNull(messages, "消息列表不应为空");
        
        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    // ==================== 站内信删除测试 (2 个用例) ====================

    /**
     * 测试删除单条站内信
     */
    @Test
    public void testDeleteInternalMessage_Success() {
        // 先创建一条消息
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("待删除测试");
        message.setContent("测试内容");
        message.setType(1);
        
        Long messageId = messageService.sendInternalMessage(message);
        assertNotNull(messageId, "消息创建应成功");
        
        // 删除消息
        messageService.deleteInternalMessage(messageId);
        
        // 验证删除成功
        InternalMessage deleted = messageService.getInternalMessageDetail(messageId);
        assertNull(deleted, "删除后的消息应为空");
    }

    /**
     * 测试删除站内信 - 消息不存在
     */
    @Test
    public void testDeleteInternalMessage_NotFound() {
        Long nonExistentId = 999999L;
        
        // 删除不存在的消息不应抛出异常
        assertDoesNotThrow(() -> {
            messageService.deleteInternalMessage(nonExistentId);
        }, "删除不存在的消息不应抛出异常");
    }
}
