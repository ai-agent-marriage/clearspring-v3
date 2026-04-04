package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.SensitiveWord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 敏感词服务类
 * 提供敏感词管理
 */
@Service
public class SensitiveWordService {
    private static final Logger log = LoggerFactory.getLogger(SensitiveWordService.class);


    // 使用 ConcurrentHashMap 模拟数据库存储
    private static final Map<Long, SensitiveWord> SENSITIVE_WORD_MAP = new ConcurrentHashMap<>();
    private static Long nextId = 1L;

    static {
        // 初始化示例数据
        Date now = new Date();
        SENSITIVE_WORD_MAP.put(1L, new SensitiveWord(1L, "测试敏感词 1", 2, 1, now));
        SENSITIVE_WORD_MAP.put(2L, new SensitiveWord(2L, "测试敏感词 2", 2, 1, now));
        SENSITIVE_WORD_MAP.put(3L, new SensitiveWord(3L, "测试敏感词 3", 3, 0, now));
    }

    /**
     * 获取敏感词列表（支持筛选）
     * @param level 敏感级别（可选）
     * @param status 状态（可选）
     * @param keyword 关键词（可选）
     * @param pageNum 页码（可选）
     * @param pageSize 每页数量（可选）
     * @return 敏感词列表
     */
    public List<SensitiveWord> getSensitiveWordList(Integer level, Integer status, String keyword, 
                                                     Integer pageNum, Integer pageSize) {
        List<SensitiveWord> result = new ArrayList<>(SENSITIVE_WORD_MAP.values());
        
        // 按敏感级别筛选
        if (level != null && level > 0) {
            result = result.stream()
                .filter(w -> w.getLevel().equals(level))
                .collect(Collectors.toList());
        }
        
        // 按状态筛选
        if (status != null) {
            result = result.stream()
                .filter(w -> w.getStatus().equals(status))
                .collect(Collectors.toList());
        }
        
        // 按关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            result = result.stream()
                .filter(w -> w.getWord().contains(kw))
                .collect(Collectors.toList());
        }
        
        // 按创建时间倒序排序
        result.sort((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()));
        
        // 分页
        if (pageNum != null && pageNum > 0 && pageSize != null && pageSize > 0) {
            int fromIndex = (pageNum - 1) * pageSize;
            int toIndex = Math.min(fromIndex + pageSize, result.size());
            if (fromIndex < result.size()) {
                result = result.subList(fromIndex, toIndex);
            } else {
                result = new ArrayList<>();
            }
        }
        
        return result;
    }

    /**
     * 新增敏感词
     * @param sensitiveWord 敏感词信息
     * @return 新增的敏感词 ID
     */
    @Transactional
    public Long addSensitiveWord(SensitiveWord sensitiveWord) {
        Long id = nextId++;
        sensitiveWord.setId(id);
        sensitiveWord.setCreateTime(new Date());
        if (sensitiveWord.getLevel() == null) {
            sensitiveWord.setLevel(2); // 默认为中级
        }
        if (sensitiveWord.getStatus() == null) {
            sensitiveWord.setStatus(1); // 默认为启用
        }
        SENSITIVE_WORD_MAP.put(id, sensitiveWord);
        log.info("新增敏感词成功，id: {}, word: {}", id, sensitiveWord.getWord());
        return id;
    }

    /**
     * 删除敏感词
     * @param id 敏感词 ID
     * @return 是否删除成功
     */
    @Transactional
    public boolean deleteSensitiveWord(Long id) {
        SensitiveWord removed = SENSITIVE_WORD_MAP.remove(id);
        if (removed != null) {
            log.info("删除敏感词成功，id: {}, word: {}", id, removed.getWord());
            return true;
        }
        log.warn("删除敏感词失败，敏感词不存在，id: {}", id);
        return false;
    }

    /**
     * 批量删除敏感词
     * @param ids 敏感词 ID 列表
     * @return 删除成功的数量
     */
    @Transactional
    public int batchDeleteSensitiveWord(List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            if (SENSITIVE_WORD_MAP.remove(id) != null) {
                count++;
            }
        }
        log.info("批量删除敏感词完成，删除数量：{}", count);
        return count;
    }

    /**
     * 批量导入敏感词
     * @param words 敏感词列表
     * @param level 敏感级别
     * @return 导入成功的数量
     */
    @Transactional
    public int batchImportSensitiveWord(List<String> words, Integer level) {
        if (words == null || words.isEmpty()) {
            return 0;
        }

        int count = 0;
        Date now = new Date();
        if (level == null) {
            level = 2; // 默认为中级
        }

        for (String word : words) {
            if (word != null && !word.trim().isEmpty()) {
                String trimmedWord = word.trim();
                // 检查是否已存在
                boolean exists = SENSITIVE_WORD_MAP.values().stream()
                    .anyMatch(w -> w.getWord().equals(trimmedWord));
                
                if (!exists) {
                    Long id = nextId++;
                    SensitiveWord sensitiveWord = new SensitiveWord(id, trimmedWord, level, 1, now);
                    SENSITIVE_WORD_MAP.put(id, sensitiveWord);
                    count++;
                }
            }
        }

        log.info("批量导入敏感词完成，导入数量：{}", count);
        return count;
    }

    /**
     * 更新敏感词状态
     * @param id 敏感词 ID
     * @param status 状态
     * @return 是否更新成功
     */
    @Transactional
    public boolean updateSensitiveWordStatus(Long id, Integer status) {
        SensitiveWord existing = SENSITIVE_WORD_MAP.get(id);
        if (existing == null) {
            log.warn("更新敏感词状态失败，敏感词不存在，id: {}", id);
            return false;
        }
        existing.setStatus(status);
        log.info("更新敏感词状态成功，id: {}, status: {}", id, status);
        return true;
    }

    /**
     * 获取所有启用的敏感词
     * @return 敏感词列表
     */
    public List<String> getEnabledSensitiveWords() {
        return SENSITIVE_WORD_MAP.values().stream()
            .filter(w -> w.getStatus() == 1)
            .map(SensitiveWord::getWord)
            .collect(Collectors.toList());
    }
}
