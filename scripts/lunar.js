// lunar.js - 佛历查询脚本
const { Solar, Lunar } = require('lunar-javascript');

// 获取今日佛历信息
function getTodayLunar() {
    const solar = Solar.fromDate(new Date());
    const lunar = solar.getLunar();
    
    // 计算佛历年（佛历 = 公历年 + 543）
    const buddhistYear = solar.getYear() + 543;
    
    return {
        solar: {
            year: solar.getYear(),
            month: solar.getMonth(),
            day: solar.getDay(),
            week: solar.getWeekInChinese()
        },
        lunar: {
            year: lunar.getYear(),
            month: lunar.getMonth(),
            day: lunar.getDay(),
            yearInGanZhi: lunar.getYearInGanZhi(),
            monthInGanZhi: lunar.getMonthInGanZhi(),
            dayInGanZhi: lunar.getDayInGanZhi(),
            dayInChinese: lunar.getDayInChinese()
        },
        buddhist: {
            year: buddhistYear,
            term: lunar.getJieQi() || '无'
        },
        yiji: {
            yi: lunar.getDayYi().join(','),
            ji: lunar.getDayJi().join(','),
            suitableForProtect: isSuitableForProtect(lunar)
        }
    };
}

// 判断日期是否宜护生（放生）
function isSuitableForProtect(lunar) {
    const yi = lunar.getDayYi();
    const ji = lunar.getDayJi();
    
    // 宜护生的条件：
    // 1. 宜"祭祀"、"祈福"、"沐浴"
    // 2. 不宜"杀生"相关
    const suitableKeywords = ['祭祀', '祈福', '沐浴', '斋醮', '塑绘', '求嗣', '开光'];
    const unsuitableKeywords = ['捕捉', '畋猎'];
    
    // 检查是否有不宜的事项
    for (const keyword of unsuitableKeywords) {
        if (ji.includes(keyword)) {
            return false;
        }
    }
    
    // 检查是否有宜的事项
    for (const keyword of suitableKeywords) {
        if (yi.includes(keyword)) {
            return true;
        }
    }
    
    // 佛日、朔日、望日等通常适合
    const lunarDay = lunar.getDayInChinese();
    const suitableDays = ['初一', '十五', '初八', '十四', '十八', '二十三', '二十四', '二十八', '二十九', '三十'];
    if (suitableDays.includes(lunarDay)) {
        return true;
    }
    
    // 默认适合
    return true;
}

// 根据日期获取佛历
function getLunarByDate(year, month, day) {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const buddhistYear = year + 543;
    
    return {
        solar: `${year}-${month}-${day}`,
        lunar: lunar.toString(),
        ganZhi: lunar.getYearInGanZhi() + '年 ' + lunar.getMonthInGanZhi() + '月 ' + lunar.getDayInGanZhi() + '日',
        buddhistYear: buddhistYear,
        suitableForProtect: isSuitableForProtect(lunar)
    };
}

// 主函数
const args = process.argv.slice(2);
const command = args[0] || 'today';

if (command === 'today') {
    console.log(JSON.stringify(getTodayLunar()));
} else if (command === 'date' && args.length >= 4) {
    const year = parseInt(args[1]);
    const month = parseInt(args[2]);
    const day = parseInt(args[3]);
    console.log(JSON.stringify(getLunarByDate(year, month, day)));
} else {
    console.error('Usage: node scripts/lunar.js [today|date year month day]');
    process.exit(1);
}
