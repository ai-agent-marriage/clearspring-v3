package com.ruoyi.qingru.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 禅语服务类
 * 提供禅理短句查询
 */
@Service
public class ZenQuoteService {

    private static final List<ZenQuote> QUOTES = Arrays.asList(
        new ZenQuote("应无所住而生其心", "《金刚经》"),
        new ZenQuote("一切有为法，如梦幻泡影", "《金刚经》"),
        new ZenQuote("色即是空，空即是色", "《心经》"),
        new ZenQuote("心无挂碍，无挂碍故", "《心经》"),
        new ZenQuote("菩提本无树，明镜亦非台", "慧能"),
        new ZenQuote("本来无一物，何处惹尘埃", "慧能"),
        new ZenQuote("苦海无边，回头是岸", "佛教谚语"),
        new ZenQuote("放下屠刀，立地成佛", "佛教谚语"),
        new ZenQuote("诸行无常，诸法无我", "《法句经》"),
        new ZenQuote("涅槃寂静", "《法句经》")
    );

    private final Random random = new Random();

    /**
     * 获取随机禅语
     * @return 禅语对象
     */
    public ZenQuote getRandomQuote() {
        int index = random.nextInt(QUOTES.size());
        return QUOTES.get(index);
    }

    /**
     * 获取每日禅语（根据日期固定）
     * @return 禅语对象
     */
    public ZenQuote getDailyQuote() {
        Calendar calendar = Calendar.getInstance();
        int dayOfYear = calendar.get(Calendar.DAY_OF_YEAR);
        int index = dayOfYear % QUOTES.size();
        return QUOTES.get(index);
    }

    /**
     * 获取所有禅语
     * @return 禅语列表
     */
    public List<ZenQuote> getAllQuotes() {
        return new ArrayList<>(QUOTES);
    }
}
