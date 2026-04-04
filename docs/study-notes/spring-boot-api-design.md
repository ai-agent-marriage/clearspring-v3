# Spring Boot API 设计学习笔记

## 一、分层架构

### 1.1 标准分层

```
Controller 层  →  接收 HTTP 请求，参数校验，调用 Service
     ↓
Service 层    →  业务逻辑处理，事务管理，调用 Mapper
     ↓
Mapper 层     →  数据访问，SQL 执行
     ↓
Entity 层     →  数据模型，POJO 对象
```

### 1.2 各层职责

#### Controller 层
- 接收 HTTP 请求
- 参数校验和绑定
- 调用 Service 层
- 统一响应格式
- 异常处理

```java
@RestController
@RequestMapping("/lunar")
public class LunarController {
    
    @Autowired
    private LunarService lunarService;
    
    @GetMapping("/today")
    public R<LunarInfo> getTodayLunar() {
        LunarInfo info = lunarService.getTodayLunar();
        return R.ok(info);
    }
}
```

#### Service 层
- 业务逻辑实现
- 事务控制（@Transactional）
- 调用多个 Mapper
- 数据转换和组装

```java
@Service
public class LunarService {
    
    @Autowired
    private WxMaService wxMaService;
    
    public LunarInfo getTodayLunar() {
        // 业务逻辑
        LunarInfo info = new LunarInfo();
        info.setSolarDate("2026 年 4 月 7 日 星期一");
        return info;
    }
}
```

#### Mapper 层
- 数据库操作
- SQL 语句映射
- 结果集映射

```java
@Mapper
public interface ZenQuoteMapper {
    ZenQuote selectRandom();
    ZenQuote selectById(@Param("id") Long id);
}
```

#### Entity 层
- 数据模型定义
- Getter/Setter（Lombok @Data）
- 字段注解

```java
@Data
public class ZenQuote {
    private Long id;
    private String content;
    private String author;
    private Integer status;
    private Date createTime;
}
```

---

## 二、统一响应格式

### 2.1 响应类设计

```java
public class R<T> implements Serializable {
    private int code;      // 响应码
    private String msg;    // 响应消息
    private T data;        // 响应数据
    
    public static <T> R<T> ok(T data) {
        return restResult(data, SUCCESS, "操作成功");
    }
    
    public static <T> R<T> fail(String msg) {
        return restResult(null, FAIL, msg);
    }
}
```

### 2.2 使用示例

```java
// 成功响应
return R.ok(data);
return R.ok(data, "自定义成功消息");

// 失败响应
return R.fail("错误消息");
return R.fail(500, "自定义错误码");
```

---

## 三、RESTful API 设计规范

### 3.1 URL 设计原则

- 使用名词复数：`/species`, `/users`
- 使用小写字母：`/lunar/today`
- 使用连字符分隔：`/daily-zen`
- 避免动词：用 HTTP 方法表达操作

### 3.2 HTTP 方法

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 查询 | GET /species/list |
| POST | 创建 | POST /poster/daily-zen |
| PUT | 更新（全量） | PUT /species/1 |
| PATCH | 更新（部分） | PATCH /species/1 |
| DELETE | 删除 | DELETE /species/1 |

### 3.3 参数传递

#### 路径参数（@PathVariable）
```java
@GetMapping("/detail/{id}")
public R<Species> getDetail(@PathVariable Long id) {
    return R.ok(speciesService.getSpeciesDetail(id));
}
```

#### 查询参数（@RequestParam）
```java
@GetMapping("/list")
public R<List<Species>> getList(
    @RequestParam(required = false) Integer type,
    @RequestParam(required = false) String keyword) {
    return R.ok(speciesService.getSpeciesList(type, keyword));
}
```

#### 请求体（@RequestBody）
```java
@PostMapping("/daily-zen")
public R<String> generatePoster(@RequestBody PosterRequest request) {
    return R.ok(posterService.generate(request));
}
```

---

## 四、MyBatis 映射

### 4.1 注解方式

```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE openid = #{openid}")
    User selectByOpenid(@Param("openid") String openid);
    
    @Insert("INSERT INTO user (openid, nickname) VALUES (#{openid}, #{nickname})")
    int insert(User user);
}
```

### 4.2 XML 方式

```xml
<mapper namespace="com.ruoyi.qingru.mapper.ZenQuoteMapper">
    
    <resultMap type="ZenQuote" id="ZenQuoteResult">
        <result property="id" column="id"/>
        <result property="content" column="content"/>
    </resultMap>
    
    <select id="selectRandom" resultMap="ZenQuoteResult">
        SELECT id, content, author
        FROM zen_quote
        WHERE status = 1
        ORDER BY RAND()
        LIMIT 1
    </select>
    
</mapper>
```

### 4.3 动态 SQL

```xml
<select id="selectList" resultMap="SpeciesResult">
    SELECT * FROM species
    WHERE 1=1
    <if test="type != null">
        AND type = #{type}
    </if>
    <if test="keyword != null and keyword != ''">
        AND name LIKE CONCAT('%', #{keyword}, '%')
    </if>
    ORDER BY sort ASC
</select>
```

---

## 五、日志处理

### 5.1 使用 Lombok @Slf4j

```java
@Slf4j
@Service
public class LunarService {
    
    public LunarInfo getTodayLunar() {
        log.info("获取今日佛历信息");
        
        try {
            // 业务逻辑
            return info;
        } catch (Exception e) {
            log.error("获取佛历失败", e);
            throw new RuntimeException("获取失败");
        }
    }
}
```

### 5.2 日志级别

- `log.trace()`: 最详细日志
- `log.debug()`: 调试信息
- `log.info()`: 一般信息
- `log.warn()`: 警告信息
- `log.error()`: 错误信息

---

## 六、异常处理

### 6.1 全局异常处理器

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public R<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return R.fail("系统繁忙，请稍后再试");
    }
    
    @ExceptionHandler(BusinessException.class)
    public R<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常：{}", e.getMessage());
        return R.fail(e.getMessage());
    }
}
```

### 6.2 自定义异常

```java
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

---

## 七、单元测试

### 7.1 测试类结构

```java
@SpringBootTest
public class LunarServiceTest {
    
    @Autowired
    private LunarService lunarService;
    
    @Test
    public void testGetTodayLunar() {
        LunarInfo info = lunarService.getTodayLunar();
        
        assertNotNull(info);
        assertNotNull(info.getSolarDate());
        System.out.println("今日佛历：" + info.getSolarDate());
    }
}
```

### 7.2 常用断言

```java
assertEquals(expected, actual);          // 相等
assertNotNull(object);                   // 非空
assertTrue(condition);                   // 为真
assertFalse(condition);                  // 为假
assertThrows(Exception.class, () -> {}); // 抛出异常
```

---

## 八、最佳实践

### 8.1 代码规范

1. **命名规范**
   - 类名：大驼峰 `LunarService`
   - 方法名：小驼峰 `getTodayLunar`
   - 常量：全大写 `SUCCESS`

2. **注释规范**
   - 类注释：说明类的用途
   - 方法注释：说明参数、返回值、异常
   - 复杂逻辑：行内注释

3. **事务管理**
   ```java
   @Transactional(rollbackFor = Exception.class)
   public void createOrder(Order order) {
       // 多步数据库操作
   }
   ```

### 8.2 性能优化

1. **避免 N+1 查询**
2. **合理使用缓存**
3. **分页查询大数据**
4. **异步处理耗时操作**

### 8.3 安全考虑

1. **参数校验**：使用 `@Valid`
2. **SQL 注入**：使用预编译
3. **XSS 防护**：输入过滤
4. **权限控制**：接口鉴权

---

## 九、本次实践总结

### 9.1 完成的接口

1. 佛历数据接口（2 个）
2. 禅理内容接口（3 个）
3. 物种查询接口（2 个）
4. 海报生成接口（1 个）

### 9.2 技术要点

- 使用 R<T>统一响应格式
- MyBatis XML 映射动态 SQL
- Lombok 简化代码
- Slf4j 日志记录
- JUnit5 单元测试

### 9.3 待优化项

1. 佛历计算集成 lunar-javascript
2. 海报生成使用专业库
3. 添加 Redis 缓存
4. 完善异常处理

---

**创建时间**: 2026-04-07  
**作者**: 后端开发-Agent
