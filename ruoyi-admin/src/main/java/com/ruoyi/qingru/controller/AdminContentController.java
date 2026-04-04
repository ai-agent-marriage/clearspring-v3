package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.entity.ZenQuote;
import com.ruoyi.qingru.service.AdminContentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理后台内容控制器
 */
@RestController
@RequestMapping("/api/admin/content")
@Slf4j
public class AdminContentController {

    @Autowired
    private AdminContentService adminContentService;

    /**
     * 获取物种列表
     * @param type 类型（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 物种列表
     */
    @GetMapping("/species/list")
    public R<List<Species>> getSpeciesList(
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取物种列表，type={}, pageNum={}, pageSize={}", type, pageNum, pageSize);
        try {
            List<Species> list = adminContentService.getSpeciesList(type, pageNum, pageSize);
            return R.ok(list, "获取成功");
        } catch (Exception e) {
            log.error("获取物种列表失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 新增物种
     * @param species 物种信息
     * @return 操作结果
     */
    @PostMapping("/species/add")
    public R<String> addSpecies(@RequestBody Species species) {
        log.info("新增物种，name={}", species.getName());
        try {
            adminContentService.addSpecies(species);
            return R.ok("新增成功");
        } catch (Exception e) {
            log.error("新增物种失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }

    /**
     * 更新物种
     * @param id 物种 ID
     * @param species 物种信息
     * @return 操作结果
     */
    @PutMapping("/species/update/{id}")
    public R<String> updateSpecies(@PathVariable Long id, @RequestBody Species species) {
        log.info("更新物种，id={}", id);
        try {
            adminContentService.updateSpecies(id, species);
            return R.ok("更新成功");
        } catch (Exception e) {
            log.error("更新物种失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }

    /**
     * 删除物种
     * @param id 物种 ID
     * @return 操作结果
     */
    @DeleteMapping("/species/delete/{id}")
    public R<String> deleteSpecies(@PathVariable Long id) {
        log.info("删除物种，id={}", id);
        try {
            adminContentService.deleteSpecies(id);
            return R.ok("删除成功");
        } catch (Exception e) {
            log.error("删除物种失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }

    /**
     * 获取禅理列表
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 禅理列表
     */
    @GetMapping("/zen/list")
    public R<List<ZenQuote>> getZenList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取禅理列表，pageNum={}, pageSize={}", pageNum, pageSize);
        try {
            List<ZenQuote> list = adminContentService.getZenList(pageNum, pageSize);
            return R.ok(list, "获取成功");
        } catch (Exception e) {
            log.error("获取禅理列表失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 新增禅理
     * @param zenQuote 禅理信息
     * @return 操作结果
     */
    @PostMapping("/zen/add")
    public R<String> addZenQuote(@RequestBody ZenQuote zenQuote) {
        log.info("新增禅理，content={}", zenQuote.getContent());
        try {
            adminContentService.addZenQuote(zenQuote);
            return R.ok("新增成功");
        } catch (Exception e) {
            log.error("新增禅理失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }
}
