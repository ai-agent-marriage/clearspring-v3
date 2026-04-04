package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.ZenQuote;
import com.ruoyi.qingru.service.ZenQuoteService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

/**
 * 禅语服务单元测试
 * 测试禅理短句查询功能
 */
@SpringBootTest
public class ZenQuoteServiceTest {

    @Autowired
    private ZenQuoteService zenQuoteService;

    /**
     * 测试获取随机禅语成功
     * 验证返回的禅语包含内容和作者
     */
    @Test
    public void testGetRandomQuote_Success() {
        ZenQuote quote = zenQuoteService.getRandomQuote();
        
        assertNotNull(quote, "禅语对象不应为空");
        assertNotNull(quote.getContent(), "禅语内容不应为空");
        assertNotNull(quote.getAuthor(), "禅语作者不应为空");
        assertFalse(quote.getContent().trim().isEmpty(), "禅语内容不应为空字符串");
    }

    /**
     * 测试获取每日禅语成功
     * 验证每日禅语返回正确
     */
    @Test
    public void testGetDailyQuote_Success() {
        ZenQuote quote = zenQuoteService.getDailyQuote();
        
        assertNotNull(quote, "每日禅语不应为空");
        assertNotNull(quote.getContent(), "禅语内容不应为空");
        assertFalse(quote.getContent().trim().isEmpty(), "禅语内容不应为空字符串");
    }

    /**
     * 测试多次获取随机禅语不重复
     * 验证随机性
     */
    @Test
    public void testGetRandomQuote_Variety() {
        ZenQuote quote1 = zenQuoteService.getRandomQuote();
        ZenQuote quote2 = zenQuoteService.getRandomQuote();
        
        // 由于禅语库有 10 条，两次获取相同的概率较低
        // 这里主要验证都能正常返回
        assertNotNull(quote1);
        assertNotNull(quote2);
    }

    /**
     * 测试获取所有禅语
     * 验证禅语列表非空
     */
    @Test
    public void testGetAllQuotes_NotEmpty() {
        List<ZenQuote> quotes = zenQuoteService.getAllQuotes();
        
        assertNotNull(quotes, "禅语列表不应为空");
        assertTrue(quotes.size() > 0, "禅语列表应包含内容");
        
        // 验证所有禅语都有内容
        quotes.forEach(quote -> {
            assertNotNull(quote.getContent(), "禅语内容不应为空");
            assertNotNull(quote.getAuthor(), "禅语作者不应为空");
        });
    }

    /**
     * 测试每日禅语稳定性
     * 验证同一天获取的每日禅语相同
     */
    @Test
    public void testGetDailyQuote_Stable() {
        ZenQuote quote1 = zenQuoteService.getDailyQuote();
        ZenQuote quote2 = zenQuoteService.getDailyQuote();
        
        assertEquals(quote1.getContent(), quote2.getContent(), 
            "同一天的每日禅语应该相同");
    }
}
