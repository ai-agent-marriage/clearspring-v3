# WxJava 微信 SDK 学习笔记

## 1. 项目概览

**项目名称**: WxJava (微信开发 Java SDK)  
**GitHub 地址**: https://github.com/binarywang/WxJava  
**Gitee 地址**: https://gitee.com/binary/weixin-java-tools  
**开源协议**: Apache-2.0  
**Stars**: 20000+ (热门开源项目)  
**最新版本**: 4.8.0 (2026-01-03 发布)  
**JDK 要求**: JDK 8+ (JDK 7 可使用 3.8.0 及以前版本)

### 核心功能模块

| 业务场景 | 模块简称 | ArtifactId |
|---------|---------|------------|
| 微信公众号开发 | MP | weixin-java-mp |
| 微信小程序开发 | MiniApp | weixin-java-miniapp |
| 微信支付 | Pay | weixin-java-pay |
| 企业微信 | CP | weixin-java-cp |
| 微信开放平台（第三方平台） | Open | weixin-java-open |
| 视频号/微信小店 | Channel | weixin-java-channel |

### 项目特点

1. **全模块覆盖**: 支持微信公众号、小程序、微信支付、企业微信、开放平台、视频号等全场景
2. **持续维护**: 每半年发布正式版，重大问题及时修复
3. **社区活跃**: 拥有大量贡献者和应用案例
4. **文档完善**: 提供详细的 Wiki 文档和 Javadoc
5. **易于集成**: Maven/Gradle 一键引入，最小示例仅需几行代码

---

## 2. 安装配置步骤

### 2.1 Maven 依赖配置

根据业务需求选择对应模块，在 `pom.xml` 中添加依赖：

```xml
<dependencies>
    <!-- 微信小程序 -->
    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-miniapp</artifactId>
        <version>4.8.0</version>
    </dependency>
    
    <!-- 微信公众号 -->
    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-mp</artifactId>
        <version>4.8.0</version>
    </dependency>
    
    <!-- 微信支付 -->
    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-pay</artifactId>
        <version>4.8.0</version>
    </dependency>
    
    <!-- 企业微信 -->
    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-cp</artifactId>
        <version>4.8.0</version>
    </dependency>
</dependencies>
```

### 2.2 Spring Boot 配置 (application.yml)

```yaml
wx:
  miniapp:
    appid: wx8888888888888888          # 小程序 AppID
    secret: your-app-secret            # 小程序 AppSecret
    msg-data-format: XML              # 消息数据格式 (XML/JSON)
    
  mp:
    appid: wx9999999999999999         # 公众号 AppID
    secret: your-mp-secret            # 公众号 AppSecret
    token: your-token                 # 服务器配置 Token
    aes-key: your-aes-key             # 消息加密 AES Key (可选)
    
  pay:
    app-id: wx8888888888888888        # 应用 AppID
    mch-id: 1234567890                # 商户号
    mch-key: your-mch-key             # 商户密钥
    key-path: classpath:apiclient_cert.p12  # 证书路径
    api-v3-key: your-api-v3-key       # API V3 密钥
    private-key-path: classpath:apiclient_key.pem  # 商户私钥
    cert-serial-no: your-cert-serial-no  # 商户证书序列号
```

### 2.3 配置类示例

```java
@Configuration
public class WxConfig {
    
    @Value("${wx.miniapp.appid}")
    private String appId;
    
    @Value("${wx.miniapp.secret}")
    private String secret;
    
    @Bean
    public WxMaService wxMaService() {
        WxMaDefaultConfigImpl config = new WxMaDefaultConfigImpl();
        config.setAppid(appId);
        config.setSecret(secret);
        config.setMsgDataFormat(WxMaConstants.DataFormat.JSON);
        
        WxMaService wxMaService = new WxMaServiceImpl();
        wxMaService.setWxMaConfig(config);
        return wxMaService;
    }
    
    @Bean
    public WxMpService wxMpService() {
        WxMpDefaultConfigImpl config = new WxMpDefaultConfigImpl();
        config.setAppId(appId);
        config.setSecret(secret);
        config.setToken(token);
        config.setAesKey(aesKey);
        
        WxMpService wxMpService = new WxMpServiceImpl();
        wxMpService.setWxMpConfigStorage(config);
        return wxMpService;
    }
    
    @Bean
    public WxPayService wxPayService() throws Exception {
        WxPayConfig payConfig = new WxPayConfig();
        payConfig.setAppId(appId);
        payConfig.setMchId(mchId);
        payConfig.setMchKey(mchKey);
        payConfig.setApiV3Key(apiV3Key);
        payConfig.setPrivateKeyPath(privateKeyPath);
        payConfig.setPrivateCertPath(certPath);
        payConfig.setCertSerialNo(certSerialNo);
        
        WxPayService wxPayService = new WxPayServiceImpl();
        wxPayService.setConfig(payConfig);
        return wxPayService;
    }
}
```

---

## 3. 核心 API 使用

### 3.1 微信登录流程 (code → session → token)

#### 小程序登录完整示例

```java
@Service
public class WxLoginService {
    
    @Autowired
    private WxMaService wxMaService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    /**
     * 小程序登录 - code2Session
     * @param code 小程序端通过 wx.login() 获取的 code
     * @return 登录结果 (包含 openid, session_key, token)
     */
    public WxLoginResult login(String code) {
        try {
            // 1. 调用 code2Session 接口
            WxMaJscode2SessionResult sessionResult = 
                wxMaService.getUserService().getSessionInfo(code);
            
            String openid = sessionResult.getOpenid();
            String sessionKey = sessionResult.getSessionKey();
            String unionid = sessionResult.getUnionid();
            
            // 2. 查询或创建用户
            User user = userService.findByOpenid(openid);
            if (user == null) {
                user = new User();
                user.setOpenid(openid);
                user.setUnionid(unionid);
                user.setCreateTime(LocalDateTime.now());
                userService.save(user);
            }
            
            // 3. 生成 JWT Token
            String token = jwtTokenProvider.generateToken(user.getId(), openid);
            
            // 4. 缓存 session_key (用于后续解密用户数据)
            redisTemplate.opsForValue().set(
                "wx:session:" + openid, 
                sessionKey, 
                2, TimeUnit.HOURS
            );
            
            return WxLoginResult.builder()
                .openid(openid)
                .unionid(unionid)
                .token(token)
                .build();
                
        } catch (WxErrorException e) {
            throw new BusinessException("微信登录失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取用户手机号 (需要用户授权)
     * @param encryptedData 加密数据
     * @param iv 向量
     * @param openid 用户 openid
     * @return 手机号
     */
    public String getPhoneNumber(String encryptedData, String iv, String openid) {
        try {
            // 从缓存获取 session_key
            String sessionKey = redisTemplate.opsForValue()
                .get("wx:session:" + openid);
            
            if (sessionKey == null) {
                throw new BusinessException("登录已过期，请重新登录");
            }
            
            // 解密手机号
            WxMaPhoneNumberInfo phoneInfo = wxMaService.getUserService()
                .getPhoneNoInfo(sessionKey, encryptedData, iv);
            
            return phoneInfo.getPhoneNumber();
            
        } catch (WxErrorException e) {
            throw new BusinessException("获取手机号失败：" + e.getMessage());
        }
    }
}

// 登录结果 DTO
@Data
@Builder
public class WxLoginResult {
    private String openid;
    private String unionid;
    private String token;
}
```

#### 公众号网页授权登录

```java
@Controller
@RequestMapping("/wx/mp")
public class WxMpOAuthController {
    
    @Autowired
    private WxMpService wxMpService;
    
    /**
     * 第一步：构建授权 URL，引导用户跳转
     */
    @GetMapping("/authorize")
    public String authorize() {
        String redirectUri = "https://yourdomain.com/wx/mp/callback";
        String scope = WxMpOAuth2Scope.SNSAPI_USERINFO; // 或 SNSAPI_BASE
        
        String authorizeUrl = wxMpService.oauth2buildAuthorizationUrl(
            redirectUri, scope, "state123"
        );
        
        return "redirect:" + authorizeUrl;
    }
    
    /**
     * 第二步：处理回调，获取用户信息
     */
    @GetMapping("/callback")
    @ResponseBody
    public Result callback(String code, String state) {
        try {
            // 1. 通过 code 获取网页授权 access_token 和 openid
            WxMpOAuth2AccessToken accessToken = 
                wxMpService.oauth2getAccessToken(code);
            
            String openid = accessToken.getOpenId();
            
            // 2. 获取用户详细信息
            WxMpUser wxMpUser = wxMpService.getUserService()
                .userInfo(accessToken.getAccessToken(), openid);
            
            // 3. 查询或创建用户
            User user = userService.findByOpenid(openid);
            if (user == null) {
                user = new User();
                user.setOpenid(openid);
                user.setNickname(wxMpUser.getNickname());
                user.setAvatar(wxMpUser.getHeadImgUrl());
                user.setSex(wxMpUser.getSex());
                userService.save(user);
            }
            
            // 4. 生成登录 token
            String token = jwtTokenProvider.generateToken(user.getId(), openid);
            
            return Result.success(WxMpLoginResult.builder()
                .user(user)
                .token(token)
                .build());
                
        } catch (WxErrorException e) {
            return Result.error("授权失败：" + e.getMessage());
        }
    }
}
```

### 3.2 内容安全 API (imgSecCheck/msgSecCheck)

```java
@Service
public class WxSecurityService {
    
    @Autowired
    private WxMaService wxMaService;
    
    private static final Logger log = LoggerFactory.getLogger(WxSecurityService.class);
    
    /**
     * 图片内容安全检测
     * @param imagePath 本地图片路径
     * @param openid 用户 openid
     * @return 检测结果
     */
    public SecurityCheckResult checkImage(String imagePath, String openid) {
        try {
            // 准备图片文件
            File imageFile = new File(imagePath);
            
            // 调用图片检测接口
            WxMaSecurityCheckResult result = wxMaService.getSecCheckService()
                .checkImage(imageFile, "1", openid);
            
            SecurityCheckResult checkResult = new SecurityCheckResult();
            checkResult.setPass(result.getResult() == 0);
            checkResult.setLabel(result.getLabel());
            
            // 记录检测日志
            logSecurityLog("IMAGE", openid, imagePath, result.getResult());
            
            return checkResult;
            
        } catch (WxErrorException | IOException e) {
            log.error("图片检测失败", e);
            throw new BusinessException("图片检测失败：" + e.getMessage());
        }
    }
    
    /**
     * 文本内容安全检测
     * @param content 待检测文本
     * @param openid 用户 openid
     * @return 检测结果
     */
    public SecurityCheckResult checkText(String content, String openid) {
        try {
            // 调用文本检测接口
            WxMaSecurityCheckResult result = wxMaService.getSecCheckService()
                .checkMsg(content, "1", openid);
            
            SecurityCheckResult checkResult = new SecurityCheckResult();
            checkResult.setPass(result.getResult() == 0);
            checkResult.setLabel(result.getLabel());
            
            // 如果不通过，记录详细信息
            if (!checkResult.isPass()) {
                log.warn("文本检测未通过，openid={}, content={}", openid, content);
            }
            
            // 记录检测日志
            logSecurityLog("TEXT", openid, content, result.getResult());
            
            return checkResult;
            
        } catch (WxErrorException e) {
            log.error("文本检测失败", e);
            throw new BusinessException("文本检测失败：" + e.getMessage());
        }
    }
    
    /**
     * 异步检测 (推荐用于高并发场景)
     */
    @Async
    public void asyncCheckImage(String imagePath, String openid, String businessId) {
        SecurityCheckResult result = checkImage(imagePath, openid);
        
        // 更新业务数据状态
        if (result.isPass()) {
            businessService.updateStatus(businessId, BusinessStatus.APPROVED);
        } else {
            businessService.updateStatus(businessId, BusinessStatus.REJECTED);
            // 发送通知
            notificationService.sendSecurityAlert(openid, businessId, result.getLabel());
        }
    }
    
    /**
     * 记录安全检测日志
     */
    private void logSecurityLog(String type, String openid, String content, int result) {
        SecurityLog log = new SecurityLog();
        log.setType(type);
        log.setOpenid(openid);
        log.setContent(content.substring(0, Math.min(content.length(), 500)));
        log.setResult(result);
        log.setCheckTime(LocalDateTime.now());
        securityLogMapper.insert(log);
    }
}

@Data
public class SecurityCheckResult {
    private boolean pass;      // 是否通过
    private String label;      // 违规标签
    private Integer result;    // 0: 通过，1: 违规，2: 疑似违规
}
```

### 3.3 微信支付 V3 流程

```java
@Service
public class WxPayService {
    
    @Autowired
    private com.github.binarywang.wxpay.service.WxPayService wxPayService;
    
    @Autowired
    private OrderService orderService;
    
    /**
     * 创建 JSAPI 支付订单 (小程序/公众号)
     */
    public PayOrderResult createJsapiOrder(WxPayOrderRequest request) {
        try {
            // 1. 创建业务订单
            Order order = orderService.createOrder(request);
            
            // 2. 构建微信支付请求
            WxPayUnifiedOrderV3Request payRequest = new WxPayUnifiedOrderV3Request();
            payRequest.setAppid(wxPayService.getConfig().getAppId());
            payRequest.setMchid(wxPayService.getConfig().getMchId());
            payRequest.setDescription("订单支付-" + order.getOrderNo());
            payRequest.setOutTradeNo(order.getOrderNo());
            payRequest.setNotifyUrl("https://yourdomain.com/api/wx/pay/notify");
            
            // 金额设置 (单位：分)
            WxPayUnifiedOrderV3Request.Amount amount = 
                new WxPayUnifiedOrderV3Request.Amount();
            amount.setTotal(request.getAmount());
            amount.setCurrency("CNY");
            payRequest.setAmount(amount);
            
            // 支付者信息 (JSAPI 支付需要)
            WxPayUnifiedOrderV3Request.Payer payer = 
                new WxPayUnifiedOrderV3Request.Payer();
            payer.setOpenid(request.getOpenid());
            payRequest.setPayer(payer);
            
            // 3. 调用统一下单接口
            WxPayUnifiedOrderV3Result.JsapiResult jsapiResult = 
                wxPayService.createOrderV3(
                    TradeType.JSAPI, 
                    payRequest
                );
            
            // 4. 生成前端调起支付的参数
            String paySign = wxPayService.createPaySignV3(
                jsapiResult.getAppid(),
                jsapiResult.getTimeStamp(),
                jsapiResult.getNonceStr(),
                jsapiResult.getPackageVal(),
                TradeType.JSAPI
            );
            
            // 5. 返回支付参数给前端
            return PayOrderResult.builder()
                .orderNo(order.getOrderNo())
                .appId(jsapiResult.getAppid())
                .timeStamp(jsapiResult.getTimeStamp())
                .nonceStr(jsapiResult.getNonceStr())
                .packageVal(jsapiResult.getPackageVal())
                .signType("RSA")
                .paySign(paySign)
                .build();
                
        } catch (WxPayException e) {
            log.error("创建支付订单失败", e);
            throw new BusinessException("创建支付订单失败：" + e.getMessage());
        }
    }
    
    /**
     * 支付回调处理
     */
    @PostMapping("/notify")
    public String payNotify(HttpServletRequest request) {
        try {
            // 1. 解析回调结果
            WxPayOrderNotifyV3Result notifyResult = wxPayService
                .parseOrderNotifyV3Result(request, null);
            
            WxPayOrderNotifyV3Result.Result result = notifyResult.getResult();
            String outTradeNo = result.getOutTradeNo();
            String transactionId = result.getTransactionId();
            String tradeState = result.getTradeState();
            
            // 2. 验证签名 (SDK 已自动处理)
            
            // 3. 处理订单状态
            if ("SUCCESS".equals(tradeState)) {
                orderService.paySuccess(outTradeNo, transactionId);
            } else if ("NOTPAY".equals(tradeState)) {
                log.warn("订单未支付：{}", outTradeNo);
            }
            
            // 4. 返回成功响应
            return WxPayOrderNotifyV3Result.success();
            
        } catch (WxPayException e) {
            log.error("支付回调处理失败", e);
            return WxPayOrderNotifyV3Result.fail("处理失败");
        }
    }
    
    /**
     * 查询订单状态
     */
    public OrderStatus queryOrderStatus(String orderNo) {
        try {
            WxPayOrderQueryV3Request request = new WxPayOrderQueryV3Request();
            request.setOutTradeNo(orderNo);
            
            WxPayOrderQueryV3Result result = wxPayService.queryOrderV3(request);
            
            return OrderStatus.builder()
                .orderNo(orderNo)
                .transactionId(result.getTransactionId())
                .tradeState(result.getTradeState())
                .successTime(result.getSuccessTime())
                .build();
                
        } catch (WxPayException e) {
            throw new BusinessException("查询订单失败：" + e.getMessage());
        }
    }
    
    /**
     * 申请退款
     */
    public RefundResult refund(RefundRequest request) {
        try {
            WxPayRefundV3Request refundRequest = new WxPayRefundV3Request();
            refundRequest.setOutTradeNo(request.getOrderNo());
            refundRequest.setOutRefundNo(request.getRefundNo());
            refundRequest.setReason(request.getReason());
            
            WxPayRefundV3Request.Amount amount = 
                new WxPayRefundV3Request.Amount();
            amount.setRefund(request.getRefundAmount());
            amount.setTotal(request.getTotalAmount());
            amount.setCurrency("CNY");
            refundRequest.setAmount(amount);
            
            WxPayRefundV3Result result = wxPayService.refundV3(refundRequest);
            
            return RefundResult.builder()
                .refundId(result.getRefundId())
                .status(result.getStatus())
                .build();
                
        } catch (WxPayException e) {
            throw new BusinessException("退款失败：" + e.getMessage());
        }
    }
}
```

### 3.4 订阅消息推送

```java
@Service
public class WxSubscribeMsgService {
    
    @Autowired
    private WxMaService wxMaService;
    
    /**
     * 发送订阅消息
     */
    public void sendSubscribeMsg(SubscribeMsgRequest request) {
        try {
            // 构建消息数据
            WxMaSubscribeMessage msg = new WxMaSubscribeMessage();
            msg.setToUser(request.getOpenid());
            msg.setTemplateId(request.getTemplateId());
            msg.setPage(request.getPage());
            
            // 设置模板数据
            List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();
            request.getDataMap().forEach((key, value) -> {
                WxMaSubscribeMessage.MsgData msgData = 
                    new WxMaSubscribeMessage.MsgData();
                msgData.setName(key);
                msgData.setValue(value);
                data.add(msgData);
            });
            msg.setData(data);
            
            // 发送消息
            wxMaService.getSubscribeService().sendSubscribeMsg(msg);
            
            // 记录发送日志
            log.info("订阅消息发送成功：openid={}, templateId={}", 
                request.getOpenid(), request.getTemplateId());
                
        } catch (WxErrorException e) {
            log.error("订阅消息发送失败", e);
            throw new BusinessException("发送订阅消息失败：" + e.getMessage());
        }
    }
    
    /**
     * 批量发送订阅消息
     */
    @Async
    public void batchSendSubscribeMsg(List<SubscribeMsgRequest> requests) {
        for (SubscribeMsgRequest request : requests) {
            try {
                sendSubscribeMsg(request);
                Thread.sleep(100); // 避免频率限制
            } catch (Exception e) {
                log.error("批量发送失败：openid={}", request.getOpenid(), e);
            }
        }
    }
    
    /**
     * 发送支付成功通知
     */
    public void sendPaymentSuccessMsg(String openid, Order order) {
        SubscribeMsgRequest request = new SubscribeMsgRequest();
        request.setOpenid(openid);
        request.setTemplateId("支付成功模板 ID");
        request.setPage("/pages/order/detail?id=" + order.getId());
        
        Map<String, String> data = new HashMap<>();
        data.put("thing1", "订单支付成功");
        data.put("thing2", order.getOrderNo());
        data.put("thing3", order.getProductName());
        data.put("amount4", "¥" + order.getAmount());
        data.put("time5", LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        request.setDataMap(data);
        
        sendSubscribeMsg(request);
    }
    
    /**
     * 发送发货通知
     */
    public void sendDeliveryMsg(String openid, Order order, String trackingNo) {
        SubscribeMsgRequest request = new SubscribeMsgRequest();
        request.setOpenid(openid);
        request.setTemplateId("发货通知模板 ID");
        request.setPage("/pages/order/logistics?id=" + order.getId());
        
        Map<String, String> data = new HashMap<>();
        data.put("thing1", order.getProductName());
        data.put("character_string2", trackingNo);
        data.put("thing3", "顺丰速运");
        data.put("time4", LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        request.setDataMap(data);
        
        sendSubscribeMsg(request);
    }
}
```

---

## 4. 可复用代码片段

### 4.1 微信工具类

```java
@Component
public class WxUtil {
    
    /**
     * 生成随机字符串
     */
    public static String generateNonceStr() {
        return UUID.randomUUID().toString().replace("-", "");
    }
    
    /**
     * 获取当前时间戳 (秒)
     */
    public static String getCurrentTimestamp() {
        return String.valueOf(System.currentTimeMillis() / 1000);
    }
    
    /**
     * 小程序码生成
     */
    public static byte[] generateQrCode(WxMaService wxMaService, String page, String scene) {
        try {
            WxMaQrcodeConfig config = new WxMaQrcodeConfig();
            config.setPage(page);
            config.setScene(scene);
            config.setWidth(430);
            config.setAutoColor(false);
            
            return wxMaService.getQrcodeService()
                .createQrcodeBytes(config);
        } catch (WxErrorException e) {
            throw new BusinessException("生成小程序码失败：" + e.getMessage());
        }
    }
    
    /**
     * 验证微信签名
     */
    public static boolean verifySignature(String signature, String timestamp, 
                                          String nonce, String token) {
        String[] arr = new String[]{token, timestamp, nonce};
        Arrays.sort(arr);
        
        StringBuilder content = new StringBuilder();
        for (String s : arr) {
            content.append(s);
        }
        
        String tmpStr = DigestUtils.sha1Hex(content.toString());
        return tmpStr.equals(signature);
    }
}
```

### 4.2 统一响应处理

```java
@RestControllerAdvice
public class WxExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    @ResponseBody
    public Result handleBusinessException(BusinessException e) {
        return Result.error(e.getMessage());
    }
    
    @ExceptionHandler(WxErrorException.class)
    @ResponseBody
    public Result handleWxErrorException(WxErrorException e) {
        WxError error = e.getError();
        return Result.error("微信接口错误 [" + error.getErrorCode() + "]: " + error.getErrorMsg());
    }
}
```

---

## 5. 踩坑记录

### 5.1 常见问题及解决方案

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| invalid appid | AppID 配置错误 | 检查公众号/小程序后台的 AppID 是否正确 |
| invalid code | code 已过期或被使用 | code 有效期 5 分钟，且只能使用一次 |
| access_token 频繁获取 | 未缓存 access_token | SDK 已自动缓存，不要手动调用 getAccessToken |
| 支付签名失败 | API V3 密钥配置错误 | 确保在微信商户平台正确设置 API V3 密钥 |
| 证书加载失败 | 证书路径错误 | 使用 classpath:前缀，确保证书文件在 resources 目录 |
| 内容审核失败 | 图片/文本格式不支持 | 图片支持 jpg/png/bmp，大小不超过 5MB |
| 订阅消息发送失败 | 用户未订阅或模板 ID 错误 | 确保用户已订阅，模板 ID 与小程序后台一致 |

### 5.2 性能优化建议

1. **Access Token 缓存**: SDK 已自动处理，无需手动缓存
2. **异步处理**: 内容审核、消息推送等使用@Async 异步处理
3. **批量操作**: 订阅消息支持批量发送，减少 API 调用次数
4. **限流处理**: 微信接口有调用频率限制，建议增加重试机制

---

## 6. 清如项目复用建议

### 6.1 推荐复用模块

1. **微信登录模块**: 直接复用 WxLoginService，支持小程序和公众号登录
2. **内容安全模块**: 用户生成内容 (UGC) 必须经过审核，可直接复用 SecurityService
3. **支付模块**: 如有付费功能，复用 WxPayService 的支付和退款流程
4. **消息推送**: 订单状态变更、活动通知等使用订阅消息推送

### 6.2 集成步骤

1. 在清如项目 pom.xml 添加 WxJava 依赖
2. 复制 WxConfig 配置类，修改为清如的 AppID/Secret
3. 根据需求选择复用 LoginService、SecurityService、PayService
4. 在微信后台配置服务器地址、业务域名等

### 6.3 注意事项

- 生产环境使用正式的 AppID/Secret，不要使用测试账号
- 支付功能需要完成微信商户认证
- 内容安全 API 需要小程序已开通相关权限
- 订阅消息模板需要在小程序后台创建并获取模板 ID

---

## 参考资源

- **官方文档**: https://github.com/binarywang/WxJava/wiki
- **Demo 项目**: https://github.com/binarywang/WxJava/blob/develop/demo.md
- **Javadoc**: http://binary.ac.cn/weixin-java-miniapp-javadoc/
- **技术交流群**: 微信搜索 weixin-java-tools 或 WxJava 关注公众号获取入群方式

---

*笔记创建时间：2026-04-04*  
*WxJava 版本：4.8.0*
