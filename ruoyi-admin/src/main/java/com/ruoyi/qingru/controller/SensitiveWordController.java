package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.SensitiveWord;
import com.ruoyi.qingru.service.SensitiveWordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 敏感词管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/content/sensitive-word")
public class SensitiveWordController {
    
    @Autowired
    private SensitiveWordService sensitiveWordService;
    
    /**
     * 获取敏感词列表（支持筛选和分页）
     * @param level 敏感级别（1 低 2 中 3 高）
     * @param status 状态（0 禁用 1 启用）
     * @param keyword 关键词
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 敏感词列表
     */
    @GetMapping("/list")
    public R<List<SensitiveWord>> getList(
            @RequestParam(required = false) Integer level,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取敏感词列表，level: {}, status: {}, keyword: {}, pageNum: {}, pageSize: {}", 
                level, status, keyword, pageNum, pageSize);
        List<SensitiveWord> list = sensitiveWordService.getSensitiveWordList(level, status, keyword, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 新增敏感词
     * @param sensitiveWord 敏感词信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public R<Long> add(@RequestBody SensitiveWord sensitiveWord) {
        log.info("新增敏感词，word: {}", sensitiveWord.getWord());
        try {
            if (sensitiveWord.getWord() == null || sensitiveWord.getWord().trim().isEmpty()) {
                return R.fail("敏感词不能为空");
            }
            Long id = sensitiveWordService.addSensitiveWord(sensitiveWord);
            return R.ok(id, "新增成功");
        } catch (Exception e) {
            log.error("新增敏感词失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除敏感词
     * @param id 敏感词 ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public R<Void> delete(@PathVariable Long id) {
        log.info("删除敏感词，id: {}", id);
        try {
            boolean success = sensitiveWordService.deleteSensitiveWord(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("敏感词不存在");
            }
        } catch (Exception e) {
            log.error("删除敏感词失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 批量删除敏感词
     * @param ids 敏感词 ID 列表
     * @return 操作结果
     */
    @PostMapping("/batch-delete")
    public R<Integer> batchDelete(@RequestBody List<Long> ids) {
        log.info("批量删除敏感词，ids: {}", ids);
        try {
            if (ids == null || ids.isEmpty()) {
                return R.fail("ID 列表不能为空");
            }
            int count = sensitiveWordService.batchDeleteSensitiveWord(ids);
            return R.ok(count, "删除成功");
        } catch (Exception e) {
            log.error("批量删除敏感词失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 批量导入敏感词
     * @param params 参数：words-敏感词列表，level-敏感级别
     * @return 操作结果
     */
    @PostMapping("/batch-import")
    public R<Integer> batchImport(@RequestBody Map<String, Object> params) {
        log.info("批量导入敏感词");
        try {
            @SuppressWarnings("unchecked")
            List<String> words = (List<String>) params.get("words");
            Integer level = (Integer) params.get("level");
            
            if (words == null || words.isEmpty()) {
                return R.fail("敏感词列表不能为空");
            }
            
            int count = sensitiveWordService.batchImportSensitiveWord(words, level);
            return R.ok(count, "导入成功，共导入 " + count + " 条");
        } catch (Exception e) {
            log.error("批量导入敏感词失败", e);
            return R.fail("导入失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新敏感词状态
     * @param id 敏感词 ID
     * @param status 状态（0 禁用 1 启用）
     * @return 操作结果
     */
    @PutMapping("/status/{id}")
    public R<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        log.info("更新敏感词状态，id: {}, status: {}", id, status);
        try {
            boolean success = sensitiveWordService.updateSensitiveWordStatus(id, status);
            if (success) {
                return R.ok();
            } else {
                return R.fail("敏感词不存在");
            }
        } catch (Exception e) {
            log.error("更新敏感词状态失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取所有启用的敏感词
     * @return 敏感词列表
     */
    @GetMapping("/enabled")
    public R<List<String>> getEnabled() {
        log.info("获取所有启用的敏感词");
        List<String> words = sensitiveWordService.getEnabledSensitiveWords();
        return R.ok(words);
    }
}
