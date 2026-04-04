package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.InternalMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

/**
 * 消息推送服务类
 * 提供异步消息推送功能，支持重试机制和推送记录持久化
 */
@Slf4j
@Service
public class MessagePushService {

    @Autowired
    private MessageService messageService;

    // 推送记录存储（模拟数据库）
    private static final Map<String, PushRecord> PUSH_RECORD_MAP = new ConcurrentHashMap<>();
    private static final Map<String, Integer> RETRY_COUNT_MAP = new ConcurrentHashMap<>();
    private static final int MAX_RETRY_COUNT = 3;
    private static final long RETRY_DELAY_MS = 5000; // 5 秒重试间隔

    // 自定义线程池用于推送重试
    private final ExecutorService retryExecutor = new ThreadPoolExecutor(
            3, 10, 60L, TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(100),
            new ThreadFactory() {
                private final AtomicInteger threadNumber = new AtomicInteger(1);
                @Override
                public Thread newThread(Runnable r) {
                    return new Thread(r, "message-retry-" + threadNumber.getAndIncrement());
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy()
    );

    /**
     * 订单创建推送
     * @param orderId 订单 ID
     */
    @Async("messagePushExecutor")
    public void pushOnOrderCreate(Long orderId) {
        String recordId = "ORDER_CREATE_" + orderId + "_" + System.currentTimeMillis();
        log.info("开始推送订单创建通知，recordId: {}, orderId: {}", recordId, orderId);
        
        PushRecord record = new PushRecord(recordId, "ORDER_CREATE", orderId, null, new Date());
        savePushRecord(record);
        
        try {
            // TODO: 根据 orderId 获取用户信息和订单信息
            // 这里仅做示例，实际需要从数据库获取
            Long userId = 1L; // 示例用户 ID
            String openid = "openid_xxx"; // 示例 openid
            String orderNo = "ORDER_" + orderId;

            // 1. 发送微信订阅消息
            Map<String, String> wxData = new HashMap<>();
            wxData.put("orderId", orderNo);
            boolean wxSuccess = sendWithRetry(recordId, openid, "order_create", wxData, "微信订阅消息");
            
            // 2. 发送站内信
            boolean internalSuccess = sendInternalMessage(recordId, userId, "订单创建通知", 
                    "您的订单 " + orderNo + " 已创建成功，我们会尽快处理。", 1);
            
            // 更新推送记录状态
            updatePushRecordStatus(recordId, wxSuccess && internalSuccess, 
                    "微信推送：" + (wxSuccess ? "成功" : "失败") + ", 站内信：" + (internalSuccess ? "成功" : "失败"));
            
            log.info("订单创建推送完成，recordId: {}, orderId: {}, 状态：{}", recordId, orderId, 
                    wxSuccess && internalSuccess ? "成功" : "部分成功");

        } catch (Exception e) {
            log.error("订单创建推送失败，recordId: {}, orderId: {}", recordId, orderId, e);
            updatePushRecordStatus(recordId, false, "推送异常：" + e.getMessage());
        }
    }

    /**
     * 订单完成推送
     * @param orderId 订单 ID
     */
    @Async("messagePushExecutor")
    public void pushOnOrderComplete(Long orderId) {
        String recordId = "ORDER_COMPLETE_" + orderId + "_" + System.currentTimeMillis();
        log.info("开始推送订单完成通知，recordId: {}, orderId: {}", recordId, orderId);
        
        PushRecord record = new PushRecord(recordId, "ORDER_COMPLETE", orderId, null, new Date());
        savePushRecord(record);
        
        try {
            // TODO: 根据 orderId 获取用户信息和订单信息
            Long userId = 1L;
            String openid = "openid_xxx";
            String orderNo = "ORDER_" + orderId;

            // 1. 发送微信订阅消息
            Map<String, String> wxData = new HashMap<>();
            wxData.put("orderId", orderNo);
            boolean wxSuccess = sendWithRetry(recordId, openid, "order_complete", wxData, "微信订阅消息");
            
            // 2. 发送站内信
            boolean internalSuccess = sendInternalMessage(recordId, userId, "订单完成通知",
                    "您的订单 " + orderNo + " 已完成，感谢您的使用！", 1);
            
            updatePushRecordStatus(recordId, wxSuccess && internalSuccess,
                    "微信推送：" + (wxSuccess ? "成功" : "失败") + ", 站内信：" + (internalSuccess ? "成功" : "失败"));
            
            log.info("订单完成推送完成，recordId: {}, orderId: {}, 状态：{}", recordId, orderId,
                    wxSuccess && internalSuccess ? "成功" : "部分成功");

        } catch (Exception e) {
            log.error("订单完成推送失败，recordId: {}, orderId: {}", recordId, orderId, e);
            updatePushRecordStatus(recordId, false, "推送异常：" + e.getMessage());
        }
    }

    /**
     * 系统通知推送
     * @param userId 用户 ID
     * @param title 通知标题
     * @param content 通知内容
     */
    @Async("messagePushExecutor")
    public void pushSystemNotification(Long userId, String title, String content) {
        String recordId = "SYSTEM_" + userId + "_" + System.currentTimeMillis();
        log.info("开始推送系统通知，recordId: {}, userId: {}, title: {}", recordId, userId, title);
        
        PushRecord record = new PushRecord(recordId, "SYSTEM_NOTIFICATION", null, userId, new Date());
        savePushRecord(record);
        
        try {
            // TODO: 根据 userId 获取用户 openid
            String openid = "openid_xxx";

            // 1. 发送微信订阅消息
            Map<String, String> wxData = new HashMap<>();
            wxData.put("content", content);
            boolean wxSuccess = sendWithRetry(recordId, openid, "system_notice", wxData, "微信订阅消息");
            
            // 2. 发送站内信
            boolean internalSuccess = sendInternalMessage(recordId, userId, title, content, 2);
            
            updatePushRecordStatus(recordId, wxSuccess && internalSuccess,
                    "微信推送：" + (wxSuccess ? "成功" : "失败") + ", 站内信：" + (internalSuccess ? "成功" : "失败"));
            
            log.info("系统通知推送完成，recordId: {}, userId: {}, 状态：{}", recordId, userId,
                    wxSuccess && internalSuccess ? "成功" : "部分成功");

        } catch (Exception e) {
            log.error("系统通知推送失败，recordId: {}, userId: {}, title: {}", recordId, userId, title, e);
            updatePushRecordStatus(recordId, false, "推送异常：" + e.getMessage());
        }
    }

    /**
     * 带重试机制的消息发送
     * @param recordId 推送记录 ID
     * @param openid 用户 openid
     * @param templateId 模板 ID
     * @param data 消息数据
     * @param messageType 消息类型描述
     * @return 是否发送成功
     */
    private boolean sendWithRetry(String recordId, String openid, String templateId, 
                                   Map<String, String> data, String messageType) {
        String retryKey = recordId + "_" + messageType;
        int retryCount = RETRY_COUNT_MAP.getOrDefault(retryKey, 0);
        
        try {
            messageService.sendSubscribeMessage(openid, templateId, data);
            log.info("{}推送成功，recordId: {}, openid: {}, templateId: {}", 
                    messageType, recordId, openid, templateId);
            RETRY_COUNT_MAP.remove(retryKey); // 成功后清除重试计数
            return true;
            
        } catch (Exception e) {
            log.error("{}推送失败，recordId: {}, 重试次数：{}/{}", 
                    messageType, recordId, retryCount, MAX_RETRY_COUNT, e);
            
            if (retryCount < MAX_RETRY_COUNT) {
                // 异步重试
                RETRY_COUNT_MAP.put(retryKey, retryCount + 1);
                retryExecutor.submit(() -> {
                    try {
                        Thread.sleep(RETRY_DELAY_MS * (retryCount + 1)); // 递增延迟
                        log.info("开始第 {} 次重试推送，recordId: {}, messageType: {}", 
                                retryCount + 1, recordId, messageType);
                        sendWithRetry(recordId, openid, templateId, data, messageType);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.error("重试推送被中断，recordId: {}", recordId, ie);
                    }
                });
            } else {
                log.error("{}推送达到最大重试次数，recordId: {}", messageType, recordId);
                addPushRecordLog(recordId, messageType + "推送失败，已达到最大重试次数：" + e.getMessage());
            }
            return false;
        }
    }

    /**
     * 发送站内信
     * @param recordId 推送记录 ID
     * @param userId 用户 ID
     * @param title 标题
     * @param content 内容
     * @param type 类型
     * @return 是否发送成功
     */
    private boolean sendInternalMessage(String recordId, Long userId, String title, 
                                         String content, Integer type) {
        try {
            InternalMessage message = new InternalMessage();
            message.setUserId(userId);
            message.setTitle(title);
            message.setContent(content);
            message.setType(type);
            message.setStatus(1); // 未读
            messageService.addInternalMessage(message);
            log.info("站内信推送成功，recordId: {}, userId: {}, title: {}", recordId, userId, title);
            return true;
        } catch (Exception e) {
            log.error("站内信推送失败，recordId: {}, userId: {}", recordId, userId, e);
            addPushRecordLog(recordId, "站内信推送失败：" + e.getMessage());
            return false;
        }
    }

    /**
     * 保存推送记录
     * @param record 推送记录
     */
    private void savePushRecord(PushRecord record) {
        PUSH_RECORD_MAP.put(record.getRecordId(), record);
        log.debug("保存推送记录，recordId: {}, type: {}", record.getRecordId(), record.getType());
    }

    /**
     * 更新推送记录状态
     * @param recordId 推送记录 ID
     * @param success 是否成功
     * @param result 结果描述
     */
    private void updatePushRecordStatus(String recordId, boolean success, String result) {
        PushRecord record = PUSH_RECORD_MAP.get(recordId);
        if (record != null) {
            record.setSuccess(success);
            record.setResult(result);
            record.setUpdateTime(new Date());
            log.debug("更新推送记录状态，recordId: {}, success: {}, result: {}", recordId, success, result);
        }
    }

    /**
     * 添加推送记录日志
     * @param recordId 推送记录 ID
     * @param log 日志内容
     */
    private void addPushRecordLog(String recordId, String log) {
        PushRecord record = PUSH_RECORD_MAP.get(recordId);
        if (record != null) {
            record.getLogs().add(new Date() + ": " + log);
        }
    }

    /**
     * 获取推送记录
     * @param recordId 推送记录 ID
     * @return 推送记录
     */
    public PushRecord getPushRecord(String recordId) {
        return PUSH_RECORD_MAP.get(recordId);
    }

    /**
     * 获取所有推送记录
     * @return 推送记录列表
     */
    public List<PushRecord> getAllPushRecords() {
        return new ArrayList<>(PUSH_RECORD_MAP.values());
    }

    /**
     * 推送记录实体
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class PushRecord {
        private String recordId;          // 记录 ID
        private String type;              // 推送类型
        private Long orderId;             // 订单 ID（可选）
        private Long userId;              // 用户 ID（可选）
        private Date createTime;          // 创建时间
        private Date updateTime;          // 更新时间
        private Boolean success;          // 是否成功
        private String result;            // 结果描述
        private List<String> logs;        // 推送日志

        public PushRecord(String recordId, String type, Long orderId, Long userId, Date createTime) {
            this.recordId = recordId;
            this.type = type;
            this.orderId = orderId;
            this.userId = userId;
            this.createTime = createTime;
            this.logs = new ArrayList<>();
        }
    }
}
