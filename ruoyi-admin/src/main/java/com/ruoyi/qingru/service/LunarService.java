package com.ruoyi.qingru.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 佛历服务类
 * 提供农历日期查询和宜忌信息
 */
@Service
public class LunarService {

    /**
     * 获取今日农历信息
     * @return 农历信息对象
     */
    public LunarInfo getTodayLunar() {
        Calendar calendar = Calendar.getInstance();
        LunarInfo info = new LunarInfo();
        
        // 阳历日期
        info.setSolarDate(formatDate(calendar.getTime()));
        
        // 农历日期（简化实现）
        info.setLunarDate("三月初十");
        
        // 干支纪年
        info.setGanzhi("癸卯年 丙辰月 乙巳日");
        
        // 宜忌
        info.setSuit(Arrays.asList("放生", "念佛", "布施", "诵经"));
        info.setAvoid(Arrays.asList("杀生", "偷盗", "妄语", "饮酒"));
        
        return info;
    }

    /**
     * 判断某日是否适合护生
     * @param date 日期
     * @return true=适合，false=不适合
     */
    public boolean isSuitableForProtect(Date date) {
        // 简化实现：默认都适合
        // 实际项目中应根据农历日期判断（避开初一、十五等）
        return true;
    }

    /**
     * 格式化日期
     */
    private String formatDate(Date date) {
        return String.format("%tY 年%<tm 月%<td 日", date);
    }
}
