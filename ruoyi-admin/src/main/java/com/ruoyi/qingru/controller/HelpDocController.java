package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.HelpDoc;
import com.ruoyi.qingru.service.HelpDocService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 帮助文档管理控制器
 */
@RestController
@RequestMapping("/content/help")
public class HelpDocController {
    private static final Logger log = LoggerFactory.getLogger(HelpDocController.class);

    
    @Autowired
    private HelpDocService helpDocService;
    
    /**
     * 获取帮助文档列表（支持筛选和分页）
     * @param category 分类
     * @param keyword 关键词
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 帮助文档列表
     */
    @GetMapping("/list")
    public R<List<HelpDoc>> getList(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取帮助文档列表，category: {}, keyword: {}, pageNum: {}, pageSize: {}", 
                category, keyword, pageNum, pageSize);
        List<HelpDoc> list = helpDocService.getHelpDocList(category, keyword, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 获取帮助文档详情
     * @param id 文档 ID
     * @return 帮助文档信息
     */
    @GetMapping("/detail/{id}")
    public R<HelpDoc> getDetail(@PathVariable Long id) {
        log.info("获取帮助文档详情，id: {}", id);
        HelpDoc helpDoc = helpDocService.getHelpDocDetail(id);
        if (helpDoc == null) {
            return R.fail("文档不存在");
        }
        return R.ok(helpDoc);
    }
    
    /**
     * 新增帮助文档
     * @param helpDoc 帮助文档信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public R<Long> add(@RequestBody HelpDoc helpDoc) {
        log.info("新增帮助文档，title: {}", helpDoc.getTitle());
        try {
            Long id = helpDocService.addHelpDoc(helpDoc);
            return R.ok(id, "新增成功");
        } catch (Exception e) {
            log.error("新增帮助文档失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新帮助文档
     * @param id 文档 ID
     * @param helpDoc 帮助文档信息
     * @return 操作结果
     */
    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody HelpDoc helpDoc) {
        log.info("更新帮助文档，id: {}", id);
        try {
            boolean success = helpDocService.updateHelpDoc(id, helpDoc);
            if (success) {
                return R.ok();
            } else {
                return R.fail("文档不存在");
            }
        } catch (Exception e) {
            log.error("更新帮助文档失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除帮助文档
     * @param id 文档 ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public R<Void> delete(@PathVariable Long id) {
        log.info("删除帮助文档，id: {}", id);
        try {
            boolean success = helpDocService.deleteHelpDoc(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("文档不存在");
            }
        } catch (Exception e) {
            log.error("删除帮助文档失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取文档分类列表
     * @return 分类列表
     */
    @GetMapping("/categories")
    public R<List<String>> getCategories() {
        log.info("获取帮助文档分类");
        List<String> categories = helpDocService.getCategories();
        return R.ok(categories);
    }
}
