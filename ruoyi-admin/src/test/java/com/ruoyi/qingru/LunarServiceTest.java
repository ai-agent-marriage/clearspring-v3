package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.LunarInfo;
import com.ruoyi.qingru.service.LunarService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

/**
 * 佛历服务单元测试
 * 测试农历日期查询和宜忌功能
 */
@SpringBootTest
public class LunarServiceTest {

    @Autowired
    private LunarService lunarService;

    /**
     * 测试获取今日农历信息成功
     * 验证返回的农历信息包含所有必要字段
     */
    @Test
    public void testGetTodayLunar_Success() {
        LunarInfo info = lunarService.getTodayLunar();
        
        assertNotNull(info, "农历信息不应为空");
        assertNotNull(info.getSolarDate(), "阳历日期不应为空");
        assertNotNull(info.getLunarDate(), "农历日期不应为空");
        assertNotNull(info.getGanzhi(), "干支纪年不应为空");
        assertTrue(info.getSuit().size() > 0, "宜忌列表应包含内容");
        assertTrue(info.getAvoid().size() > 0, "忌列表应包含内容");
    }

    /**
     * 测试判断是否适合护生 - 今日适合
     * 验证今日默认适合护生
     */
    @Test
    public void testIsSuitableForProtect_True() {
        Date suitableDate = new Date(); // 今日
        boolean suitable = lunarService.isSuitableForProtect(suitableDate);
        assertTrue(suitable, "今日应该适合护生");
    }

    /**
     * 测试农历信息格式正确
     * 验证日期格式符合预期
     */
    @Test
    public void testLunarInfoFormat_Correct() {
        LunarInfo info = lunarService.getTodayLunar();
        
        assertTrue(info.getSolarDate().contains("年"), "阳历日期应包含'年'");
        assertTrue(info.getSolarDate().contains("月"), "阳历日期应包含'月'");
        assertTrue(info.getSolarDate().contains("日"), "阳历日期应包含'日'");
    }

    /**
     * 测试宜忌列表内容非空
     * 验证宜忌列表包含有效内容
     */
    @Test
    public void testSuitAvoidList_NotEmpty() {
        LunarInfo info = lunarService.getTodayLunar();
        
        assertFalse(info.getSuit().isEmpty(), "宜列表不应为空");
        assertFalse(info.getAvoid().isEmpty(), "忌列表不应为空");
        
        // 验证宜忌内容为字符串
        info.getSuit().forEach(item -> {
            assertNotNull(item, "宜的内容不应为空");
            assertFalse(item.trim().isEmpty(), "宜的内容不应为空字符串");
        });
        
        info.getAvoid().forEach(item -> {
            assertNotNull(item, "忌的内容不应为空");
            assertFalse(item.trim().isEmpty(), "忌的内容不应为空字符串");
        });
    }
}
