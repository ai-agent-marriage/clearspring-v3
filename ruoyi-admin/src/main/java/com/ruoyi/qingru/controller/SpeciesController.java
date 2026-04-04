package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.service.SpeciesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 物种查询控制器
 */
@Slf4j
@RestController
@RequestMapping("/species")
public class SpeciesController {
    
    @Autowired
    private SpeciesService speciesService;
    
    /**
     * 获取物种列表
     * @param type 类型（1 鱼类 2 鸟类 3 其他）
     * @param keyword 关键词
     * @return 物种列表
     */
    @GetMapping("/list")
    public R<List<Species>> getList(
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) String keyword) {
        log.info("获取物种列表，type: {}, keyword: {}", type, keyword);
        List<Species> list = speciesService.getSpeciesList(type, keyword);
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
        return R.ok(species);
    }
}
