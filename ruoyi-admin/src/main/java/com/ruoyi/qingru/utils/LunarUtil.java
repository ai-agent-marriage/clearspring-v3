package com.ruoyi.qingru.utils;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Date;

/**
 * 佛历工具类
 * 通过调用 Node.js lunar-javascript 库获取佛历信息
 */
@Slf4j
@Component
public class LunarUtil {
    
    @Value("${lunar.script.path:scripts/lunar.js}")
    private String scriptPath;
    
    private static String SCRIPT_PATH;
    private static final Logger staticLog = LoggerFactory.getLogger(LunarUtil.class);
    
    @PostConstruct
    public void init() {
        SCRIPT_PATH = scriptPath;
        staticLog.info("LunarUtil 初始化，脚本路径：{}", SCRIPT_PATH);
    }
    
    private static final Logger log = staticLog;
    
    /**
     * 获取今日佛历信息
     * @return 佛历信息
     */
    public static LunarInfo getTodayLunar() {
        return executeLunarScript("today");
    }
    
    /**
     * 获取指定日期的佛历信息
     * @param date 日期
     * @return 佛历信息
     */
    public static LunarInfo getLunarByDate(Date date) {
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(date);
        int year = cal.get(java.util.Calendar.YEAR);
        int month = cal.get(java.util.Calendar.MONTH) + 1;
        int day = cal.get(java.util.Calendar.DAY_OF_MONTH);
        return getLunarByDate(year, month, day);
    }
    
    /**
     * 获取指定日期的佛历信息
     * @param year 年
     * @param month 月
     * @param day 日
     * @return 佛历信息
     */
    public static LunarInfo getLunarByDate(int year, int month, int day) {
        return executeLunarScript("date", String.valueOf(year), String.valueOf(month), String.valueOf(day));
    }
    
    /**
     * 判断日期是否宜护生
     * @param date 日期
     * @return 是否宜护生
     */
    public static boolean isSuitableForProtect(Date date) {
        LunarInfo info = getLunarByDate(date);
        return info != null && info.isSuitableForProtect();
    }
    
    /**
     * 判断今日是否宜护生
     * @return 是否宜护生
     */
    public static boolean isSuitableForProtectToday() {
        LunarInfo info = getTodayLunar();
        return info != null && info.isSuitableForProtect();
    }
    
    /**
     * 执行 lunar 脚本
     * @param args 参数
     * @return 佛历信息
     */
    private static LunarInfo executeLunarScript(String... args) {
        try {
            // 构建命令
            String[] command = new String[args.length + 2];
            command[0] = "node";
            command[1] = SCRIPT_PATH;
            System.arraycopy(args, 0, command, 2, args.length);
            
            staticLog.debug("执行 lunar 脚本：{}", Arrays.toString(command));
            
            // 执行脚本
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File(System.getProperty("user.dir")));
            Process process = pb.start();
            
            // 读取输出
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                }
            }
            
            // 等待进程结束
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                staticLog.error("lunar 脚本执行失败，exitCode={}", exitCode);
                return null;
            }
            
            // 解析 JSON 结果
            String json = output.toString();
            staticLog.debug("lunar 脚本输出：{}", json);
            
            JSONObject jsonObject = JSON.parseObject(json);
            LunarInfo info = new LunarInfo();
            
            // 解析公历
            JSONObject solar = jsonObject.getJSONObject("solar");
            if (solar != null) {
                if (solar.containsKey("year")) {
                    info.setSolarYear(solar.getInteger("year"));
                    info.setSolarMonth(solar.getInteger("month"));
                    info.setSolarDay(solar.getInteger("day"));
                } else if (solar.containsKey("year")) {
                    // 字符串格式
                    String[] parts = solar.getString("solar").split("-");
                    if (parts.length == 3) {
                        info.setSolarYear(Integer.parseInt(parts[0]));
                        info.setSolarMonth(Integer.parseInt(parts[1]));
                        info.setSolarDay(Integer.parseInt(parts[2]));
                    }
                }
            }
            
            // 解析农历
            JSONObject lunar = jsonObject.getJSONObject("lunar");
            if (lunar != null) {
                info.setLunarYear(lunar.getInteger("year"));
                info.setLunarMonth(lunar.getInteger("month"));
                info.setLunarDay(lunar.getInteger("day"));
                info.setYearGanZhi(lunar.getString("yearInGanZhi"));
                info.setMonthGanZhi(lunar.getString("monthInGanZhi"));
                info.setDayGanZhi(lunar.getString("dayInGanZhi"));
                info.setDayChinese(lunar.getString("dayInChinese"));
            }
            
            // 解析佛历
            JSONObject buddhist = jsonObject.getJSONObject("buddhist");
            if (buddhist != null) {
                info.setBuddhistYear(buddhist.getInteger("year"));
                info.setJieQi(buddhist.getString("term"));
            }
            
            // 解析宜忌
            JSONObject yiji = jsonObject.getJSONObject("yiji");
            if (yiji != null) {
                info.setYi(yiji.getString("yi"));
                info.setJi(yiji.getString("ji"));
                info.setSuitableForProtect(yiji.getBooleanValue("suitableForProtect"));
            }
            
            return info;
            
        } catch (IOException e) {
            staticLog.error("执行 lunar 脚本 IO 异常", e);
            return null;
        } catch (InterruptedException e) {
            staticLog.error("执行 lunar 脚本被中断", e);
            Thread.currentThread().interrupt();
            return null;
        } catch (Exception e) {
            staticLog.error("执行 lunar 脚本异常", e);
            return null;
        }
    }
    
    /**
     * 佛历信息
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LunarInfo {
        // 公历
        private Integer solarYear;
        private Integer solarMonth;
        private Integer solarDay;
        
        // 农历
        private Integer lunarYear;
        private Integer lunarMonth;
        private Integer lunarDay;
        private String yearGanZhi;
        private String monthGanZhi;
        private String dayGanZhi;
        private String dayChinese;
        
        // 佛历
        private Integer buddhistYear;
        private String jieQi;
        
        // 宜忌
        private String yi;
        private String ji;
        private Boolean suitableForProtect;
        
        public String getYi() { return yi; }
        public void setYi(String yi) { this.yi = yi; }
        public String getJi() { return ji; }
        public void setJi(String ji) { this.ji = ji; }
        public Boolean isSuitableForProtect() {
            return suitableForProtect != null && suitableForProtect;
        }
        public void setSuitableForProtect(Boolean suitableForProtect) {
            this.suitableForProtect = suitableForProtect;
        }
        
        /**
         * 获取完整的佛历描述
         */
        public String getDescription() {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("公历 %d年%d月%d日 ", solarYear, solarMonth, solarDay));
            sb.append(String.format("农历 %s年%s月%s ", yearGanZhi, 
                    lunarMonth != null ? getMonthChinese(lunarMonth) : "", dayChinese));
            if (buddhistYear != null) {
                sb.append(String.format("佛历 %d年 ", buddhistYear));
            }
            if (jieQi != null && !"无".equals(jieQi)) {
                sb.append(String.format("节气：%s ", jieQi));
            }
            return sb.toString();
        }
        
        private String getMonthChinese(int month) {
            String[] months = {"正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"};
            return months[month - 1];
        }
    }
}
