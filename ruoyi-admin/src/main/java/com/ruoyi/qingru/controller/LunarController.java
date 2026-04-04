package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.LunarInfo;
import com.ruoyi.qingru.service.LunarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.util.Date;

/**
 * 佛历数据控制器
 */
@Slf4j
@RestController
@RequestMapping("/lunar")
public class LunarController {
    
    @Autowired
    private LunarService lunarService;
    
    /**
     * 获取今日佛历信息
     * @return 佛历信息
     */
    @GetMapping("/today")
    public R<LunarInfo> getTodayLunar() {
        log.info("获取今日佛历信息");
        LunarInfo info = lunarService.getTodayLunar();
        return R.ok(info);
    }
    
    /**
     * 判断日期是否宜护生
     * @param date 日期
     * @return true-宜护生，false-不宜护生
     */
    @GetMapping("/suit")
    public R<Boolean> isSuitableForProtect(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        log.info("判断日期是否宜护生，date: {}", date);
        boolean suitable = lunarService.isSuitableForProtect(date);
        return R.ok(suitable);
    }
}
