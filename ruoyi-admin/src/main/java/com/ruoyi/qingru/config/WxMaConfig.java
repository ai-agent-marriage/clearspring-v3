package com.ruoyi.qingru.config;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.api.impl.WxMaServiceImpl;
import cn.binarywang.wx.miniapp.config.WxMaConfig;
import cn.binarywang.wx.miniapp.config.impl.WxMaJdbcConfigImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * 微信小程序配置
 */
@Slf4j
@Configuration
public class WxMaConfig {
    
    @Value("${wx.miniapp.appid}")
    private String appid;
    
    @Value("${wx.miniapp.secret}")
    private String secret;
    
    @Autowired
    private DataSource dataSource;
    
    /**
     * 微信小程序配置
     */
    @Bean
    public WxMaConfig wxMaConfig() {
        WxMaJdbcConfigImpl config = new WxMaJdbcConfigImpl();
        config.setAppid(appid);
        config.setSecret(secret);
        config.setDataSource(dataSource);
        
        // 如果没有数据源，使用内存配置
        if (dataSource == null) {
            log.warn("数据源未配置，使用内存配置模式");
        }
        
        return config;
    }
    
    /**
     * 微信小程序服务
     */
    @Bean
    public WxMaService wxMaService() {
        WxMaService service = new WxMaServiceImpl();
        service.setWxMaConfig(wxMaConfig());
        return service;
    }
}
