package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.InternalMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 消息推送服务类
 * 提供异步消息推送功能
 */
@Slf4j
@Service
public class MessagePushService {

    @Autowired
    private MessageService messageService;

    /**
     * 订单创建推送
     * @param orderId 订单 ID
     */
    @Async
    public void pushOnOrderCreate(Long orderId) {
        log.info("开始推送订单创建通知，orderId: {}", orderId);
        try {
            // TODO: 根据 orderId 获取用户信息和订单信息
            // 这里仅做示例，实际需要从数据库获取
            Long userId = 1L; // 示例用户 ID
            String openid = "openid_xxx"; // 示例 openid
            String orderNo = "ORDER_" + orderId;

            // 1. 发送微信订阅消息
            Map<String, String> wxData = new HashMap<>();
            wxData.put("orderId", orderNo);
            try {
                messageService.sendSubscribeMessage(openid, "order_create", wxData);
                log.info("订单创建微信消息推送成功，orderId: {}", orderId);
            } catch (Exception e) {
                log.error("订单创建微信消息推送失败，orderId: {}, error: {}", orderId, e.getMessage());
            }

            // 2. 发送站内信
            InternalMessage internalMessage = new InternalMessage();
            internalMessage.setUserId(userId);
            internalMessage.setTitle("订单创建通知");
            internalMessage.setContent("您的订单 " + orderNo + " 已创建成功，我们会尽快处理。");
            internalMessage.setType(1); // 订单通知
            messageService.addInternalMessage(internalMessage);
            log.info("订单创建站内信推送成功，orderId: {}", orderId);

        } catch (Exception e) {
            log.error("订单创建推送失败，orderId: {}", orderId, e);
        }
    }

    /**
     * 订单完成推送
     * @param orderId 订单 ID
     */
    @Async
    public void pushOnOrderComplete(Long orderId) {
        log.info("开始推送订单完成通知，orderId: {}", orderId);
        try {
            // TODO: 根据 orderId 获取用户信息和订单信息
            // 这里仅做示例，实际需要从数据库获取
            Long userId = 1L; // 示例用户 ID
            String openid = "openid_xxx"; // 示例 openid
            String orderNo = "ORDER_" + orderId;

            // 1. 发送微信订阅消息
            Map<String, String> wxData = new HashMap<>();
            wxData.put("orderId", orderNo);
            try {
                messageService.sendSubscribeMessage(openid, "order_complete", wxData);
                log.info("订单完成微信消息推送成功，orderId: {}", orderId);
            } catch (Exception e) {
                log.error("订单完成微信消息推送失败，orderId: {}, error: {}", orderId, e.getMessage());
            }

            // 2. 发送站内信
            InternalMessage internalMessage = new InternalMessage();
            internalMessage.setUserId(userId);
            internalMessage.setTitle("订单完成通知");
            internalMessage.setContent("您的订单 " + orderNo + " 已完成，感谢您的使用！");
            internalMessage.setType(1); // 订单通知
            messageService.addInternalMessage(internalMessage);
            log.info("订单完成站内信推送成功，orderId: {}", orderId);

        } catch (Exception e) {
            log.error("订单完成推送失败，orderId: {}", orderId, e);
        }
    }

    /**
     * 系统通知推送
     * @param userId 用户 ID
     * @param title 通知标题
     * @param content 通知内容
     */
    @Async
    public void pushSystemNotification(Long userId, String title, String content) {
        log.info("开始推送系统通知，userId: {}, title: {}", userId, title);
        try {
            // TODO: 根据 userId 获取用户 openid
            // 这里仅做示例，实际需要从数据库获取
            String openid = "openid_xxx"; // 示例 openid

            // 1. 发送微信订阅消息
            Map<String, String> wxData = new HashMap<>();
            wxData.put("content", content);
            try {
                messageService.sendSubscribeMessage(openid, "system_notice", wxData);
                log.info("系统通知微信消息推送成功，userId: {}, title: {}", userId, title);
            } catch (Exception e) {
                log.error("系统通知微信消息推送失败，userId: {}, error: {}", userId, e.getMessage());
            }

            // 2. 发送站内信
            InternalMessage internalMessage = new InternalMessage();
            internalMessage.setUserId(userId);
            internalMessage.setTitle(title);
            internalMessage.setContent(content);
            internalMessage.setType(2); // 系统通知
            messageService.addInternalMessage(internalMessage);
            log.info("系统通知站内信推送成功，userId: {}, title: {}", userId, title);

        } catch (Exception e) {
            log.error("系统通知推送失败，userId: {}, title: {}", userId, title, e);
        }
    }
}
