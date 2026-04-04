package com.ruoyi.qingru.entity;

import java.util.List;

/**
 * 农历信息实体类
 */
public class LunarInfo {
    
    private String solarDate;      // 阳历日期
    private String lunarDate;      // 农历日期
    private String ganzhi;         // 干支纪年
    private List<String> suit;     // 宜
    private List<String> avoid;    // 忌

    public String getSolarDate() {
        return solarDate;
    }

    public void setSolarDate(String solarDate) {
        this.solarDate = solarDate;
    }

    public String getLunarDate() {
        return lunarDate;
    }

    public void setLunarDate(String lunarDate) {
        this.lunarDate = lunarDate;
    }

    public String getGanzhi() {
        return ganzhi;
    }

    public void setGanzhi(String ganzhi) {
        this.ganzhi = ganzhi;
    }

    public List<String> getSuit() {
        return suit;
    }

    public void setSuit(List<String> suit) {
        this.suit = suit;
    }

    public List<String> getAvoid() {
        return avoid;
    }

    public void setAvoid(List<String> avoid) {
        this.avoid = avoid;
    }
}
