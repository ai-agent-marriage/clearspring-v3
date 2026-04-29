# lunar-javascript 佛历库学习笔记

## 1. 项目概览

**项目名称**: lunar-javascript  
**GitHub 地址**: https://github.com/6tail/lunar-javascript  
**开源协议**: MIT  
**Stars**: 3000+  
**作者**: 6tail  
**官网**: https://6tail.cn/calendar/api.html

### 核心功能

lunar 是一款**无第三方依赖**的日历工具库，支持：

1. **公历 (阳历)**: Solar 类，支持日期计算、星座、节气等
2. **农历 (阴历/老黄历)**: Lunar 类，支持干支、生肖、宜忌等
3. **佛历**: Fo 类，支持佛历日期、斋期、佛诞等
4. **道历**: Dao 类，支持道历日期、道教节日等

### 特色功能

- **完整宜忌数据**: 每日宜忌、彭祖百忌、吉神凶煞
- **八字算命**: 五行、十神、纳音、星宿
- **节假日**: 支持中国法定节假日、调休
- **无依赖**: 纯 JavaScript 实现，可在浏览器/Node.js 使用
- **高性能**: 优化算法，支持大范围日期计算

### 应用场景

- 日历应用展示
- 黄历查询
- 佛历/道历计算
- 八字排盘
- 节日提醒
- 择吉选日

---

## 2. 安装配置步骤

### 2.1 npm 安装

```bash
# 创建项目
mkdir lunar-demo
cd lunar-demo

# 初始化
npm init -y

# 安装 lunar-javascript
npm install lunar-javascript
```

### 2.2 使用方式

#### Node.js 环境

```javascript
// 方式 1: CommonJS
const { Solar, Lunar, Fo, HolidayUtil } = require('lunar-javascript');

// 方式 2: ES Module
import { Solar, Lunar, Fo, HolidayUtil } from 'lunar-javascript';
```

#### 浏览器环境

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lunar Demo</title>
</head>
<body>
  <script src="lunar.js"></script>
  <script>
    var solar = Solar.fromYmd(1986, 5, 29);
    console.log(solar.toFullString());
    console.log(solar.getLunar().toFullString());
  </script>
</body>
</html>
```

#### CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js"></script>
```

### 2.3 项目结构示例

```
lunar-demo/
├── app.js                 # Node.js 入口
├── browser/
│   └── index.html        # 浏览器示例
├── utils/
│   └── lunarUtil.js      # 日历工具函数
└── package.json
```

---

## 3. 核心 API 使用

### 3.1 Solar (公历) API

```javascript
const { Solar, Lunar } = require('lunar-javascript');

/**
 * Solar 公历基本使用
 */
function solarBasic() {
  // 从年月日创建
  const solar = Solar.fromYmd(2026, 4, 4);
  console.log('日期:', solar.toYmd());           // 2026-04-04
  console.log('完整信息:', solar.toFullString()); // 2026-04-04 00:00:00 星期六 白羊座
  
  // 从 Date 对象创建
  const solarFromDate = Solar.fromDate(new Date());
  console.log('今天:', solarFromDate.toYmd());
  
  // 从时间戳创建 (毫秒)
  const solarFromTs = Solar.fromTimestamp(Date.now());
  console.log('时间戳:', solarFromTs.toYmd());
  
  // 获取基本信息
  console.log('年:', solar.getYear());           // 2026
  console.log('月:', solar.getMonth());          // 4
  console.log('日:', solar.getDay());            // 4
  console.log('星期:', solar.getWeekInChinese()); // 星期六
  console.log('星座:', solar.getXingZuo());       // 白羊座
  
  // 日期计算
  const nextDay = solar.next(1);                 // 后一天
  console.log('明天:', nextDay.toYmd());         // 2026-04-05
  
  const prevDay = solar.next(-1);                // 前一天
  console.log('昨天:', prevDay.toYmd());         // 2026-04-03
  
  const nextMonth = solar.nextMonths(1);         // 下个月
  console.log('下月:', nextMonth.toYmd());       // 2026-05-04
  
  const nextYear = solar.nextYears(1);           // 明年
  console.log('明年:', nextYear.toYmd());        // 2027-04-04
  
  // 转换为农历
  const lunar = solar.getLunar();
  console.log('农历:', lunar.toFullString());
}

/**
 * Solar 高级功能
 */
function solarAdvanced() {
  const solar = Solar.fromYmd(2026, 4, 4);
  
  // 获取节气
  console.log('节气:', solar.getJieQi());         // 清明 (如果在节气当天)
  
  // 判断是否闰年
  console.log('闰年:', solar.isLeapYear());       // false
  
  // 获取一年中的第几天
  console.log('第几天:', solar.getDayOfYear());   // 94
  
  // 获取一周中的第几天 (0=周日)
  console.log('周几:', solar.getWeek());          // 6
  
  // 计算两个日期相差天数
  const solar2 = Solar.fromYmd(2026, 5, 1);
  const days = solar.subtract(solar2);
  console.log('相差天数:', days);                 // -27
  
  // 获取季度
  console.log('季度:', solar.getQuarter());       // 2
  
  // 获取周数 (一年中的第几周)
  console.log('第几周:', solar.getWeekOfYear());  // 14
}

/**
 * 节假日查询
 */
function checkHoliday() {
  const { HolidayUtil } = require('lunar-javascript');
  
  // 获取某年节假日安排
  const holidays = HolidayUtil.getHolidays(2026);
  console.log('2026 年节假日:', holidays);
  
  // 判断某天是否节假日
  const solar = Solar.fromYmd(2026, 5, 1);
  const holiday = HolidayUtil.getHoliday(solar.getYear(), solar.getMonth(), solar.getDay());
  
  if (holiday) {
    console.log('节假日:', holiday.getName());     // 劳动节
    console.log('休息:', holiday.getRest());       // 1 (休息)
    console.log('调休:', holiday.getWork());       // 0 (不调休)
  }
}

solarBasic();
solarAdvanced();
checkHoliday();
```

### 3.2 Lunar (农历) API

```javascript
const { Solar, Lunar } = require('lunar-javascript');

/**
 * Lunar 农历基本使用
 */
function lunarBasic() {
  // 从农历日期创建
  const lunar = Lunar.fromYmd(1986, 4, 21);
  console.log('农历:', lunar.toYmd());            // 一九八六年四月廿一
  
  // 从公历转换
  const solar = Solar.fromYmd(1986, 5, 29);
  const lunarFromSolar = solar.getLunar();
  console.log('转换:', lunarFromSolar.toFullString());
  
  // 获取基本信息
  console.log('农历年:', lunar.getYearInGanZhi());  // 丙寅
  console.log('生肖:', lunar.getYearShengXiao());   // 虎
  console.log'月:', lunar.getMonthInChinese());     // 四
  console.log'日:', lunar.getDayInChinese());       // 廿一
  
  // 干支纪年
  console.log('年柱:', lunar.getYearGan());         // 丙
  console.log('年支:', lunar.getYearZhi());         // 寅
  
  // 获取公历
  const solar2 = lunar.getSolar();
  console.log('公历:', solar2.toYmd());            // 1986-05-29
}

/**
 * 宜忌数据
 */
function lunarYiJi() {
  const lunar = Lunar.fromYmd(2026, 3, 7);  // 2026-04-04 的农历
  
  // 每日宜忌
  console.log('宜:', lunar.getYi());          // ['祭祀', '祈福', ...]
  console.log('忌:', lunar.getJi());          // ['开光', '出行', ...]
  
  // 彭祖百忌
  console.log('彭祖百忌:', lunar.getPengZuGan());  // 癸不词讼理弱敌强
  console.log('彭祖百忌:', lunar.getPengZuZhi());  // 酉不会客醉坐颠狂
  
  // 吉神宜趋
  console.log('吉神:', lunar.getJiShen());    // ['天德', '月德', ...]
  
  // 凶煞宜忌
  console.log('凶煞:', lunar.getXiongSha());  // ['朱雀', '白虎', ...]
  
  // 吉神方位
  console.log('喜神方位:', lunar.getXiShen());   // 东南
  console.log('福神方位:', lunar.getFuShen());   // 正西
  console.log('财神方位:', lunar.getCaiShen());  // 正南
  console.log'阳贵神:', lunar.getYangGuiShen(); // 东南
  console.log'阴贵神:', lunar.getYinGuiShen()); // 正东
  
  // 冲煞
  console.log('冲:', lunar.getChong());       // (丁卯)兔
  console.log('煞:', lunar.getSha());         // 东
  
  // 胎神方位
  console.log('胎神:', lunar.getTaiShen());   // 门床外正南
  
  // 纳音
  console.log('年纳音:', lunar.getYearNaYin());   // 炉中火
  console.log('月纳音:', lunar.getMonthNaYin());  // 长流水
  console.log('日纳音:', lunar.getDayNaYin());    // 剑锋金
  
  // 星宿
  console.log('星宿:', lunar.getXiu());         // 斗
  console.log('星宿吉凶:', lunar.getXiuLuck());   // 吉
  console.log'星宿动物:', lunar.getXiuAnimal()); // 獬
  
  // 建除十二值星
  console.log('建除:', lunar.getJianChu());     // 建
  
  // 十二神
  console.log('十二神:', lunar.getShiErShen());  // 青龙
}

/**
 * 八字排盘
 */
function lunarBaZi() {
  const lunar = Lunar.fromYmd(2026, 3, 7);
  
  // 八字
  console.log('八字:', lunar.getBaZi());
  // 丙寅 壬辰 癸酉 壬子 (需要指定时辰)
  
  // 五行
  console.log('年五行:', lunar.getYearWuXing());   // 火木
  console.log'月五行:', lunar.getMonthWuXing());  // 水土
  console.log'日五行:', lunar.getDayWuXing());    // 水金
  
  // 十神
  console.log'年十神:', lunar.getYearShiShen());  // ['正财', '伤官']
  console.log'月十神:', lunar.getMonthShiShen()); // ['正官', '正印']
  console.log'日十神:', lunar.getDayShiShen());   // ['日主', '偏印']
  
  // 获取特定时辰的八字
  const lunarWithTime = Lunar.fromYmdHms(2026, 3, 7, 12, 0, 0);
  console.log'完整八字:', lunarWithTime.getBaZi());
}

/**
 * 农历日期计算
 */
function lunarCalc() {
  const lunar = Lunar.fromYmd(2026, 3, 7);
  
  // 下一天
  const nextDay = lunar.next(1);
  console.log'明天:', nextDay.toYmd());
  
  // 上一天
  const prevDay = lunar.next(-1);
  console.log'昨天:', prevDay.toYmd());
  
  // 下个月
  const nextMonth = lunar.nextMonths(1);
  console.log'下月:', nextMonth.toYmd());
  
  // 获取闰月信息
  console.log'是否闰月:', lunar.isLeap());
  
  // 获取月天数
  console.log'月天数:', lunar.getMonthInDays());
  
  // 获取年天数
  console.log'年天数:', lunar.getYearInDays());
}

lunarBasic();
lunarYiJi();
lunarBaZi();
lunarCalc();
```

### 3.3 Fo (佛历) API

```javascript
const { Fo, Solar } = require('lunar-javascript');

/**
 * Fo 佛历基本使用
 */
function foBasic() {
  // 从公历创建
  const solar = Solar.fromYmd(2026, 4, 4);
  const fo = Fo.fromSolar(solar);
  
  console.log('佛历年:', fo.getYear());           // 2569
  console.log'佛历月:', fo.getMonth());          // 5
  console.log'佛历日:', fo.getDay());            // 17
  
  console.log'完整佛历:', fo.toFullString());
  // 佛历 2569 年 五月 十七 星期六
  
  // 获取农历
  const lunar = fo.getLunar();
  console.log('农历:', lunar.toYmd());
  
  // 获取公历
  const solar2 = fo.getSolar();
  console.log('公历:', solar2.toYmd());
}

/**
 * 佛历斋期
 */
function foZhaiQi() {
  const fo = Fo.fromSolar(Solar.fromYmd(2026, 4, 4));
  
  // 获取斋期
  const zhaiQi = fo.getZhaiQi();
  console.log('斋期:', zhaiQi);
  // ['月斋', '日斋'] 或其他斋期
  
  // 判断是否佛诞日
  const isFoDan = fo.isFoDan();
  console.log('是否佛诞:', isFoDan);
  
  // 获取佛历节日
  const festivals = fo.getFestivals();
  console.log('佛历节日:', festivals);
}

/**
 * 佛历节日查询
 */
function foFestivals() {
  // 查询某年的佛历节日
  const year = 2026;
  
  // 佛诞日 (农历四月初八)
  const foDan = Fo.fromLunar(Lunar.fromYmd(year, 4, 8));
  console.log('佛诞日:', foDan.getSolar().toYmd());
  
  // 成道日 (农历腊月初八)
  const chengDao = Fo.fromLunar(Lunar.fromYmd(year, 12, 8));
  console.log('成道日:', chengDao.getSolar().toYmd());
  
  // 涅槃日 (农历二月十五)
  const niePan = Fo.fromLunar(Lunar.fromYmd(year, 2, 15));
  console.log('涅槃日:', niePan.getSolar().toYmd());
}

foBasic();
foZhaiQi();
foFestivals();
```

### 3.4 综合应用示例

```javascript
const { Solar, Lunar, Fo, HolidayUtil } = require('lunar-javascript');

/**
 * 日历信息综合展示
 */
function showCalendarInfo(dateStr) {
  // 解析日期
  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const fo = Fo.fromSolar(solar);
  
  console.log('='.repeat(50));
  console.log(`日期：${dateStr}`);
  console.log('='.repeat(50));
  
  // 公历信息
  console.log('\n【公历信息】');
  console.log(`日期：${solar.toYmd()} ${solar.getWeekInChinese()}`);
  console.log(`星座：${solar.getXingZuo()}`);
  console.log(`节气：${solar.getJieQi() || '无'}`);
  
  // 节假日
  const holiday = HolidayUtil.getHoliday(year, month, day);
  if (holiday) {
    console.log(`节假日：${holiday.getName()} (${holiday.getRest() ? '休息' : '工作日'})`);
  }
  
  // 农历信息
  console.log('\n【农历信息】');
  console.log(`日期：${lunar.toYmd()}`);
  console.log(`年柱：${lunar.getYearInGanZhi()} [${lunar.getYearShengXiao()}]`);
  console.log(`月柱：${lunar.getMonthInGanZhi()}`);
  console.log(`日柱：${lunar.getDayInGanZhi()}`);
  
  // 宜忌
  console.log('\n【每日宜忌】');
  console.log(`宜：${lunar.getYi().join('、') || '无'}`);
  console.log(`忌：${lunar.getJi().join('、') || '无'}`);
  console.log(`彭祖百忌：${lunar.getPengZuGan()} ${lunar.getPengZuZhi()}`);
  
  // 吉神凶煞
  console.log('\n【吉神凶煞】');
  console.log(`吉神：${lunar.getJiShen().join('、') || '无'}`);
  console.log(`凶煞：${lunar.getXiongSha().join('、') || '无'}`);
  console.log(`喜神方位：${lunar.getXiShen()}`);
  console.log(`财神方位：${lunar.getCaiShen()}`);
  console.log(`冲煞：冲${lunar.getChong()} 煞${lunar.getSha()}`);
  
  // 佛历信息
  console.log('\n【佛历信息】');
  console.log(`佛历：${fo.getYear()}年 ${fo.getMonth()}月 ${fo.getDay()}日`);
  console.log(`斋期：${fo.getZhaiQi().join('、') || '无'}`);
  console.log(`节日：${fo.getFestivals().join('、') || '无'}`);
  
  console.log('\n' + '='.repeat(50));
}

// 测试
showCalendarInfo('2026-04-04');
showCalendarInfo('2026-01-01');  // 元旦
showCalendarInfo('2026-05-26');  // 端午节
```

---

## 4. 性能优化

### 4.1 批量计算优化

```javascript
/**
 * 批量生成日历数据 (优化版)
 */
function generateCalendarData(year, month) {
  const daysInMonth = Solar.fromYmd(year, month, 1).getMonthInDays();
  const calendarData = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    
    calendarData.push({
      solar: solar.toYmd(),
      lunar: lunar.toYmd(),
      week: solar.getWeekInChinese(),
      jieqi: solar.getJieQi(),
      yi: lunar.getYi(),
      ji: lunar.getJi(),
    });
  }
  
  return calendarData;
}

// 使用示例
const april2026 = generateCalendarData(2026, 4);
console.log('2026 年 4 月日历:', april2026);
```

### 4.2 缓存优化

```javascript
/**
 * 带缓存的日历查询
 */
class CalendarCache {
  constructor() {
    this.cache = new Map();
  }
  
  getCalendarInfo(dateStr) {
    // 检查缓存
    if (this.cache.has(dateStr)) {
      return this.cache.get(dateStr);
    }
    
    // 计算
    const [year, month, day] = dateStr.split('-').map(Number);
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    
    const info = {
      solar: solar.toYmd(),
      lunar: lunar.toYmd(),
      week: solar.getWeekInChinese(),
      jieqi: solar.getJieQi(),
      yi: lunar.getYi(),
      ji: lunar.getJi(),
    };
    
    // 缓存结果
    this.cache.set(dateStr, info);
    
    return info;
  }
  
  // 清空缓存
  clear() {
    this.cache.clear();
  }
  
  // 预加载日期范围
  preload(startDate, endDate) {
    const start = Solar.fromYmd(...startDate.split('-').map(Number));
    const end = Solar.fromYmd(...endDate.split('-').map(Number));
    
    let current = start;
    while (current <= end) {
      const dateStr = current.toYmd();
      this.getCalendarInfo(dateStr);
      current = current.next(1);
    }
  }
}

// 使用示例
const cache = new CalendarCache();
cache.preload('2026-01-01', '2026-12-31');  // 预加载全年
console.log(cache.getCalendarInfo('2026-04-04'));  // 直接从缓存获取
```

### 4.3 Web Worker 优化 (浏览器端)

```javascript
// worker.js - Web Worker 脚本
importScripts('lunar.js');

self.onmessage = function(e) {
  const { year, month } = e.data;
  const daysInMonth = Solar.fromYmd(year, month, 1).getMonthInDays();
  const result = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    
    result.push({
      day,
      solar: solar.toYmd(),
      lunar: lunar.toYmd(),
      jieqi: solar.getJieQi(),
      yi: lunar.getYi(),
      ji: lunar.getJi(),
    });
  }
  
  self.postMessage(result);
};

// 主线程使用
const worker = new Worker('worker.js');
worker.postMessage({ year: 2026, month: 4 });
worker.onmessage = function(e) {
  console.log('日历数据:', e.data);
};
```

---

## 5. 可复用代码片段

### 5.1 日历工具类

```javascript
// utils/lunarUtil.js
const { Solar, Lunar, Fo, HolidayUtil } = require('lunar-javascript');

class LunarUtil {
  /**
   * 获取日期详细信息
   */
  static getDetailInfo(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const fo = Fo.fromSolar(solar);
    const holiday = HolidayUtil.getHoliday(year, month, day);
    
    return {
      solar: {
        date: solar.toYmd(),
        week: solar.getWeekInChinese(),
        weekNum: solar.getWeek(),
        constellation: solar.getXingZuo(),
        jieqi: solar.getJieQi(),
        dayOfYear: solar.getDayOfYear(),
        weekOfYear: solar.getWeekOfYear(),
        isLeapYear: solar.isLeapYear(),
      },
      lunar: {
        date: lunar.toYmd(),
        yearGanZhi: lunar.getYearInGanZhi(),
        monthGanZhi: lunar.getMonthInGanZhi(),
        dayGanZhi: lunar.getDayInGanZhi(),
        shengxiao: lunar.getYearShengXiao(),
        yi: lunar.getYi(),
        ji: lunar.getJi(),
        pengZu: {
          gan: lunar.getPengZuGan(),
          zhi: lunar.getPengZuZhi(),
        },
        jiShen: lunar.getJiShen(),
        xiongSha: lunar.getXiongSha(),
        fangWei: {
          xiShen: lunar.getXiShen(),
          fuShen: lunar.getFuShen(),
          caiShen: lunar.getCaiShen(),
        },
        chong: lunar.getChong(),
        sha: lunar.getSha(),
      },
      fo: {
        year: fo.getYear(),
        month: fo.getMonth(),
        day: fo.getDay(),
        zhaiQi: fo.getZhaiQi(),
        festivals: fo.getFestivals(),
      },
      holiday: holiday ? {
        name: holiday.getName(),
        rest: holiday.getRest(),
        work: holiday.getWork(),
      } : null,
    };
  }
  
  /**
   * 判断某天是否适合某事
   */
  static isSuitableFor(dateStr, activity) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const lunar = Solar.fromYmd(year, month, day).getLunar();
    const yi = lunar.getYi();
    
    return yi.includes(activity);
  }
  
  /**
   * 获取某月所有宜嫁娶的日子
   */
  static getMarriageDays(year, month) {
    const daysInMonth = Solar.fromYmd(year, month, 1).getMonthInDays();
    const suitableDays = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const lunar = Solar.fromYmd(year, month, day).getLunar();
      if (lunar.getYi().includes('嫁娶')) {
        suitableDays.push({
          solar: Solar.fromYmd(year, month, day).toYmd(),
          lunar: lunar.toYmd(),
        });
      }
    }
    
    return suitableDays;
  }
  
  /**
   * 获取节气日期
   */
  static getJieQiDates(year) {
    const jieQiDates = [];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    months.forEach(month => {
      for (let day = 1; day <= 31; day++) {
        try {
          const solar = Solar.fromYmd(year, month, day);
          const jieqi = solar.getJieQi();
          if (jieqi) {
            jieQiDates.push({
              date: solar.toYmd(),
              name: jieqi,
            });
          }
        } catch (e) {
          // 日期无效，跳过
        }
      }
    });
    
    return jieQiDates;
  }
  
  /**
   * 八字排盘
   */
  static getBaZi(dateStr, hour) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const lunar = Lunar.fromYmdHms(year, month, day, hour, 0, 0);
    
    return {
      baZi: lunar.getBaZi(),
      wuXing: {
        year: lunar.getYearWuXing(),
        month: lunar.getMonthWuXing(),
        day: lunar.getDayWuXing(),
        time: lunar.getTimeWuXing(),
      },
      shiShen: {
        year: lunar.getYearShiShen(),
        month: lunar.getMonthShiShen(),
        day: lunar.getDayShiShen(),
        time: lunar.getTimeShiShen(),
      },
      naYin: {
        year: lunar.getYearNaYin(),
        month: lunar.getMonthNaYin(),
        day: lunar.getDayNaYin(),
        time: lunar.getTimeNaYin(),
      },
    };
  }
}

module.exports = LunarUtil;
```

### 5.2 黄历查询 API

```javascript
// routes/huangli.js
const express = require('express');
const router = express.Router();
const LunarUtil = require('../utils/lunarUtil');

/**
 * 获取单日黄历
 */
router.get('/daily', (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const info = LunarUtil.getDetailInfo(targetDate);
    
    res.json({
      code: 0,
      data: info,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
});

/**
 * 获取某月黄历
 */
router.get('/monthly', (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    
    const daysInMonth = Solar.fromYmd(targetYear, targetMonth, 1).getMonthInDays();
    const calendar = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const info = LunarUtil.getDetailInfo(dateStr);
      calendar.push(info);
    }
    
    res.json({
      code: 0,
      data: {
        year: targetYear,
        month: targetMonth,
        calendar,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
});

/**
 * 查询宜某事的日子
 */
router.get('/suitable', (req, res) => {
  try {
    const { activity, year, month } = req.query;
    
    if (!activity) {
      return res.status(400).json({
        code: 400,
        message: '缺少 activity 参数',
      });
    }
    
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const daysInMonth = Solar.fromYmd(targetYear, targetMonth, 1).getMonthInDays();
    
    const suitableDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const lunar = Solar.fromYmd(targetYear, targetMonth, day).getLunar();
      if (lunar.getYi().includes(activity)) {
        suitableDays.push({
          solar: Solar.fromYmd(targetYear, targetMonth, day).toYmd(),
          lunar: lunar.toYmd(),
        });
      }
    }
    
    res.json({
      code: 0,
      data: {
        activity,
        year: targetYear,
        month: targetMonth,
        days: suitableDays,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
});

module.exports = router;
```

---

## 6. 踩坑记录

### 6.1 常见问题及解决方案

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 农历日期转换错误 | 农历闰月处理 | 使用 `isLeap()` 判断是否闰月 |
| 节气计算偏差 | 节气交接时间 | 节气以实际交接时间为准，可能跨天 |
| 八字时辰错误 | 时辰计算方式 | 使用 `fromYmdHms` 指定准确时间 |
| 节假日数据缺失 | 国务院未公布 | 节假日数据每年更新，需及时升级库 |
| 性能问题 | 大量日期计算 | 使用缓存或 Web Worker |

### 6.2 注意事项

1. **农历闰月**: 农历闰月需要特殊处理，`isLeap()` 判断
2. **节气时间**: 节气有精确的交接时间，可能不在 0 点
3. **节假日**: 每年国务院发布的节假日安排可能不同
4. **八字时辰**: 子时需要区分早子时 (0-1 点) 和晚子时 (23-24 点)
5. **时区**: 默认使用东八区时间，其他地区需要调整

---

## 7. 清如项目复用建议

### 7.1 推荐复用场景

1. **日历展示**: 在清如后台添加农历显示
2. **黄历查询**: 提供用户查询每日宜忌
3. **节日提醒**: 传统节日、佛诞日提醒
4. **八字排盘**: 如有命理相关功能
5. **择吉功能**: 活动日期选择参考宜忌

### 7.2 集成步骤

1. 安装 lunar-javascript: `npm install lunar-javascript`
2. 复制 LunarUtil 工具类到清如项目
3. 在日历组件中集成农历显示
4. 添加黄历查询 API 接口
5. 在用户发布内容时参考宜忌 (可选)

### 7.3 代码示例

```javascript
// 清如后台 - 日历组件增强
import { Solar, Lunar } from 'lunar-javascript';

function getCalendarData(year, month) {
  const daysInMonth = Solar.fromYmd(year, month, 1).getMonthInDays();
  const firstDayWeek = Solar.fromYmd(year, month, 1).getWeek();
  
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const solar = Solar.fromYmd(year, month, d);
    const lunar = solar.getLunar();
    
    days.push({
      day: d,
      solar: d,
      lunar: lunar.getDayInChinese(),
      jieqi: solar.getJieQi(),
      isToday: d === new Date().getDate(),
      isRest: lunar.getJi().includes('出行') ? false : true,
    });
  }
  
  return {
    year,
    month,
    firstDayWeek,
    days,
  };
}
```

---

## 参考资源

- **官方文档**: https://6tail.cn/calendar/api.html
- **GitHub**: https://github.com/6tail/lunar-javascript
- **在线演示**: https://6tail.cn/calendar/

---

*笔记创建时间：2026-04-04*  
*lunar-javascript 版本：latest*
