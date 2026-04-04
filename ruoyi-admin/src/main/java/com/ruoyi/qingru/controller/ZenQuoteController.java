package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.ZenQuote;
import com.ruoyi.qingru.service.ZenQuoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 禅理内容控制器
 */
@RestController
@RequestMapping("/zen")
public class ZenQuoteController {
    private static final Logger log = LoggerFactory.getLogger(ZenQuoteController.class);

    
    @Autowired
    private ZenQuoteService zenQuoteService;
    
    /**
     * 随机获取禅理
     * @return 禅理内容
     */
    @GetMapping("/random")
    public R<ZenQuote> getRandom() {
        log.info("随机获取禅理");
        ZenQuote quote = zenQuoteService.getRandomQuote();
        return R.ok(quote);
    }
    
    /**
     * 获取当日每日一禅
     * @param date 日期（可选，默认今天）
     * @return 禅理内容
     */
    @GetMapping("/daily")
    public R<ZenQuote> getDaily(@RequestParam(required = false) String date) {
        log.info("获取当日每日一禅，date: {}", date);
        ZenQuote quote = zenQuoteService.getDailyQuote(date);
        return R.ok(quote);
    }
    
    /**
     * 根据 ID 获取禅理
     * @param id 主键 ID
     * @return 禅理内容
     */
    @GetMapping("/{id}")
    public R<ZenQuote> getById(@PathVariable Long id) {
        log.info("根据 ID 获取禅理，id: {}", id);
        ZenQuote quote = zenQuoteService.getQuoteById(id);
        return R.ok(quote);
    }
}
