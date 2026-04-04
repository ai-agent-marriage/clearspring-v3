package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.RankData;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 排行榜服务类
 */
@Slf4j
@Service
public class RankService {
    
    @Autowired
    private VolunteerMapper volunteerMapper;
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    /**
     * 获取志愿者排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    public List<RankData> getVolunteerRank(Integer limit) {
        log.info("获取志愿者排行榜，limit={}", limit);
        List<RankData> rankList = volunteerMapper.selectRank(limit);
        
        // 设置排名
        for (int i = 0; i < rankList.size(); i++) {
            rankList.get(i).setRank(i + 1);
        }
        
        return rankList;
    }
    
    /**
     * 获取机构排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    public List<RankData> getOrgRank(Integer limit) {
        log.info("获取机构排行榜，limit={}", limit);
        List<RankData> rankList = orderMapper.selectOrgRank(limit);
        
        // 设置排名
        for (int i = 0; i < rankList.size(); i++) {
            rankList.get(i).setRank(i + 1);
        }
        
        return rankList;
    }
}
