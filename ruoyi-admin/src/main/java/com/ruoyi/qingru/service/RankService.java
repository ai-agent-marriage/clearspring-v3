package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.RankData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 排行榜服务类
 */
@Service
public class RankService {
    private static final Logger log = LoggerFactory.getLogger(RankService.class);

    
    @Autowired
    private StatsService statsService;
    
    /**
     * 获取志愿者排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @Cacheable(value = "stats:rank:volunteer", key = "#limit", unless = "#result == null")
    public List<RankData> getVolunteerRank(Integer limit) {
        log.info("获取志愿者排行榜，limit={}", limit);
        return statsService.getVolunteerRank(limit);
    }
    
    /**
     * 获取机构排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @Cacheable(value = "stats:rank:org", key = "#limit", unless = "#result == null")
    public List<RankData> getOrgRank(Integer limit) {
        log.info("获取机构排行榜，limit={}", limit);
        return statsService.getOrgRank(limit);
    }
}
