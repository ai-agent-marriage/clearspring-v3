package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.PosterRequest;
import com.ruoyi.qingru.service.PosterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 海报生成控制器
 */
@RestController
@RequestMapping("/poster")
public class PosterController {
    private static final Logger log = LoggerFactory.getLogger(PosterController.class);

    
    @Autowired
    private PosterService posterService;
    
    /**
     * 生成每日禅理海报
     * @param request 海报生成请求
     * @return 海报文件路径
     */
    @PostMapping("/daily-zen")
    public R<String> generateDailyZenPoster(@RequestBody PosterRequest request) {
        log.info("生成每日禅理海报，zenQuote: {}, bgUrl: {}", 
            request.getZenQuote(), request.getBgUrl());
        
        String posterPath = posterService.generateDailyZenPoster(
            request.getZenQuote(), 
            request.getBgUrl()
        );
        
        if (posterPath == null) {
            return R.fail("海报生成失败");
        }
        
        return R.ok(posterPath, "海报生成成功");
    }
}
