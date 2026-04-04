# WxJava 微信小程序 SDK 集成学习笔记

## 1. WxJava 简介

[WxJava](https://github.com/Wechat-Group/WxJava) 是一个综合的微信开发 Java SDK，支持：
- 微信小程序
- 微信支付
- 微信开放平台
- 微信公众号
- 微信企业号

## 2. Maven 依赖配置

### 2.1 父 pom.xml 添加依赖管理

```xml
<dependencyManagement>
    <dependencies>
        <!-- 微信小程序 SDK -->
        <dependency>
            <groupId>com.github.binarywang</groupId>
            <artifactId>weixin-java-miniapp</artifactId>
            <version>4.6.0</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 2.2 模块 pom.xml 添加依赖

```xml
<dependencies>
    <!-- 微信小程序 SDK -->
    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-miniapp</artifactId>
    </dependency>
</dependencies>
```

## 3. 配置文件

### 3.1 application.yml 配置

```yaml
# 微信小程序配置
wx:
  miniapp:
    appid: wxa914ecc15836bda6
    secret: ${WX_MINIAPP_SECRET}  # 使用环境变量，避免硬编码
    config-storage:
      type: Jdbc  # 使用数据库存储 access_token

# 数据源配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/qingru_app?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: ${DB_PASSWORD}
```

## 4. 核心组件

### 4.1 配置类 WxMaConfig

```java
@Configuration
public class WxMaConfig {
    
    @Value("${wx.miniapp.appid}")
    private String appid;
    
    @Value("${wx.miniapp.secret}")
    private String secret;
    
    @Bean
    public WxMaConfig wxMaConfig() {
        WxMaJdbcConfigImpl config = new WxMaJdbcConfigImpl();
        config.setAppid(appid);
        config.setSecret(secret);
        config.setDataSource(dataSource);
        return config;
    }
    
    @Bean
    public WxMaService wxMaService() {
        WxMaService service = new WxMaServiceImpl();
        service.setWxMaConfig(wxMaConfig());
        return service;
    }
}
```

### 4.2 微信登录流程

1. 小程序端调用 `wx.login()` 获取 code
2. 后端使用 code 调用微信接口获取 openid
3. 查询或创建用户
4. 生成 JWT token 返回给小程序

```java
@Service
public class LoginService {
    
    @Autowired
    private WxMaService wxMaService;
    
    public LoginResult login(String code) {
        // 获取 session
        WxMaJscode2SessionResult session = wxMaService.getUserService()
                .getSessionInfo(code);
        
        String openid = session.getOpenid();
        
        // 查询或创建用户
        User user = userMapper.selectByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setRoleCode("user");
            userMapper.insert(user);
        }
        
        // 生成 token
        String token = jwtUtil.generateToken(user.getOpenid());
        
        return new LoginResult(token, user);
    }
}
```

## 5. 内容安全 API

微信小程序要求对用户提交的内容进行审核：

### 5.1 图片审核

```java
public boolean checkImage(String filePath) {
    WxMaSecurityCheckResult result = wxMaService.getSecurityService()
            .imgSecCheck(file);
    return result.getResult() == 0; // 0=通过，1=违规，2=疑似
}
```

### 5.2 文本审核

```java
public boolean checkText(String content) {
    WxMaSecurityCheckResult result = wxMaService.getSecurityService()
            .msgSecCheck(content);
    return result.getResult() == 0;
}
```

## 6. 常见问题

### 6.1 access_token 存储

WxJava 支持多种 access_token 存储方式：
- 内存存储（默认，单机适用）
- Redis 存储（分布式适用）
- Jdbc 存储（数据库存储）

### 6.2 环境变量配置

敏感信息使用环境变量：
```bash
export WX_MINIAPP_SECRET=your_secret_here
export DB_PASSWORD=your_db_password
```

### 6.3 错误处理

微信接口可能返回错误，需要妥善处理：
- network timeout
- invalid code
- appid 不匹配
- secret 错误

## 7. 参考资料

- [WxJava GitHub](https://github.com/Wechat-Group/WxJava)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信内容安全接口](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.imgSecCheck.html)
