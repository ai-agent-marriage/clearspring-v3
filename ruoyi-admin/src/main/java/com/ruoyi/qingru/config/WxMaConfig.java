package com.ruoyi.qingru.config;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.api.impl.WxMaServiceImpl;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 微信小程序配置
 * 注意：WxJava 4.x 中使用 WxMaDefaultConfigImpl 替代 WxMaJdbcConfigImpl
 */
@Slf4j
@Configuration
public class WxMaConfig {
    private static final Logger log = LoggerFactory.getLogger(WxMaConfig.class);
    
    @Value("${wx.miniapp.appid:}")
    private String appid;
    
    @Value("${wx.miniapp.secret:}")
    private String secret;
    
    /**
     * 微信小程序配置
     */
    @Bean
    public WxMaDefaultConfigImpl wxMaConfig() {
        WxMaDefaultConfigImpl config = new WxMaDefaultConfigImpl();
        config.setAppid(appid);
        config.setSecret(secret);
        
        log.info("微信小程序配置加载成功，appid={}", appid);
        
        return config;
    }
    
    /**
     * 微信小程序服务
     */
    @Bean
    public WxMaService wxMaService(WxMaDefaultConfigImpl wxMaConfig) {
        WxMaService service = new WxMaServiceImpl();
        service.setWxMaConfig(wxMaConfig);
        return service;
    }
}
