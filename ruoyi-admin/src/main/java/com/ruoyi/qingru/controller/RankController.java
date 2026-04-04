package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.RankData;
import com.ruoyi.qingru.service.RankService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 排行榜控制器
 */
@RestController
@RequestMapping("/stats/rank")
public class RankController {
    private static final Logger log = LoggerFactory.getLogger(RankController.class);

    
    @Autowired
    private RankService rankService;
    
    /**
     * 获取志愿者排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @GetMapping("/volunteer")
    public R<List<RankData>> getVolunteerRank(
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取志愿者排行榜，limit={}", limit);
        try {
            List<RankData> rankList = rankService.getVolunteerRank(limit);
            return R.ok(rankList, "获取成功");
        } catch (Exception e) {
            log.error("获取志愿者排行榜失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取机构排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @GetMapping("/org")
    public R<List<RankData>> getOrgRank(
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取机构排行榜，limit={}", limit);
        try {
            List<RankData> rankList = rankService.getOrgRank(limit);
            return R.ok(rankList, "获取成功");
        } catch (Exception e) {
            log.error("获取机构排行榜失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
