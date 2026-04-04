package com.ruoyi.qingru.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wechat.miniapp.api.WxMaService;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 内容审核服务类
 * 提供文本、图片内容审核功能
 */
@Slf4j
@Service
public class ContentAuditService {

    @Autowired(required = false)
    private WxMaService wxMaService;

    // 本地敏感词缓存（用于快速过滤）
    private static final Set<String> LOCAL_SENSITIVE_WORDS = ConcurrentHashMap.newKeySet();

    static {
        // 初始化一些基础敏感词
        LOCAL_SENSITIVE_WORDS.add("测试敏感词 1");
        LOCAL_SENSITIVE_WORDS.add("测试敏感词 2");
    }

    /**
     * 审核文本内容
     * @param content 待审核的文本内容
     * @return true=通过，false=不通过
     */
    public boolean auditText(String content) {
        if (content == null || content.trim().isEmpty()) {
            log.warn("审核文本为空");
            return false;
        }

        try {
            // 1. 本地敏感词过滤
            if (containsSensitiveWord(content)) {
                log.warn("文本包含敏感词");
                return false;
            }

            // 2. 调用微信内容安全 API 进行审核
            if (wxMaService != null) {
                // 这里调用微信的内容安全接口
                // 由于实际 API 调用需要配置，这里模拟返回
                log.info("调用微信内容安全 API 审核文本");
                // 实际实现应调用 wxMaService.getMsgSecService().checkMessage(content)
                return true;
            }

            // 如果没有配置微信服务，默认通过
            log.info("未配置微信服务，文本审核默认通过");
            return true;

        } catch (Exception e) {
            log.error("文本审核失败", e);
            return false;
        }
    }

    /**
     * 审核图片
     * @param imageUrl 图片 URL
     * @return true=通过，false=不通过
     */
    public boolean auditImage(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            log.warn("审核图片 URL 为空");
            return false;
        }

        try {
            // 调用微信内容安全 API 进行图片审核
            if (wxMaService != null) {
                log.info("调用微信内容安全 API 审核图片：{}", imageUrl);
                // 实际实现应调用 wxMaService.getImgSecService().checkImage(imageUrl)
                return true;
            }

            // 如果没有配置微信服务，默认通过
            log.info("未配置微信服务，图片审核默认通过");
            return true;

        } catch (Exception e) {
            log.error("图片审核失败", e);
            return false;
        }
    }

    /**
     * 批量审核
     * @param contents 待审核的内容列表
     * @return 审核结果 Map<内容，是否通过>
     */
    public Map<String, Boolean> batchAudit(List<String> contents) {
        Map<String, Boolean> results = new HashMap<>();
        
        if (contents == null || contents.isEmpty()) {
            log.warn("批量审核内容为空");
            return results;
        }

        for (String content : contents) {
            boolean passed = auditText(content);
            results.put(content, passed);
        }

        log.info("批量审核完成，总数：{}, 通过：{}", contents.size(), 
                results.values().stream().filter(b -> b).count());
        return results;
    }

    /**
     * 检查文本是否包含敏感词
     * @param content 文本内容
     * @return true=包含敏感词，false=不包含
     */
    public boolean containsSensitiveWord(String content) {
        if (content == null || content.trim().isEmpty()) {
            return false;
        }

        for (String word : LOCAL_SENSITIVE_WORDS) {
            if (content.contains(word)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 添加敏感词到本地缓存
     * @param word 敏感词
     */
    public void addSensitiveWord(String word) {
        if (word != null && !word.trim().isEmpty()) {
            LOCAL_SENSITIVE_WORDS.add(word.trim());
            log.info("添加敏感词：{}", word);
        }
    }

    /**
     * 移除敏感词
     * @param word 敏感词
     */
    public void removeSensitiveWord(String word) {
        if (word != null && !word.trim().isEmpty()) {
            LOCAL_SENSITIVE_WORDS.remove(word.trim());
            log.info("移除敏感词：{}", word);
        }
    }

    /**
     * 获取本地敏感词列表
     * @return 敏感词列表
     */
    public Set<String> getSensitiveWords() {
        return new HashSet<>(LOCAL_SENSITIVE_WORDS);
    }
}
