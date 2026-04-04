package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.service.SpeciesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 物种管理控制器
 */
@RestController
@RequestMapping("/content/species")
public class SpeciesController {
    private static final Logger log = LoggerFactory.getLogger(SpeciesController.class);

    
    @Autowired
    private SpeciesService speciesService;
    
    /**
     * 获取物种列表（支持筛选和分页）
     * @param type 类型（1 鱼类 2 鸟类 3 哺乳类 4 爬行类 5 两栖类）
     * @param isForbid 是否禁止（0 否 1 是）
     * @param keyword 关键词
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 物种列表
     */
    @GetMapping("/list")
    public R<List<Species>> getList(
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer isForbid,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取物种列表，type: {}, isForbid: {}, keyword: {}, pageNum: {}, pageSize: {}", 
                type, isForbid, keyword, pageNum, pageSize);
        List<Species> list = speciesService.getSpeciesList(type, isForbid, keyword, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 获取物种详情
     * @param id 主键 ID
     * @return 物种信息
     */
    @GetMapping("/detail/{id}")
    public R<Species> getDetail(@PathVariable Long id) {
        log.info("获取物种详情，id: {}", id);
        Species species = speciesService.getSpeciesDetail(id);
        if (species == null) {
            return R.fail("物种不存在");
        }
        return R.ok(species);
    }
    
    /**
     * 新增物种
     * @param species 物种信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public R<Long> add(@RequestBody Species species) {
        log.info("新增物种，name: {}, scientificName: {}", species.getName(), species.getScientificName());
        try {
            Long id = speciesService.addSpecies(species);
            return R.ok(id, "新增成功");
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
    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Species species) {
        log.info("更新物种，id: {}", id);
        try {
            boolean success = speciesService.updateSpecies(id, species);
            if (success) {
                return R.ok();
            } else {
                return R.fail("物种不存在");
            }
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
    @DeleteMapping("/delete/{id}")
    public R<Void> delete(@PathVariable Long id) {
        log.info("删除物种，id: {}", id);
        try {
            boolean success = speciesService.deleteSpecies(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("物种不存在");
            }
        } catch (Exception e) {
            log.error("删除物种失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取物种分类
     * @return 分类列表
     */
    @GetMapping("/categories")
    public R<List<Map<String, Object>>> getCategories() {
        log.info("获取物种分类");
        List<Map<String, Object>> categories = speciesService.getCategories();
        return R.ok(categories);
    }
}
