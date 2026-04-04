package com.ruoyi.qingru.config;

import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * 缓存配置类
 * 配置不同缓存的 TTL 策略
 */
@Configuration
public class CacheConfig {

    /**
     * 配置缓存管理器
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // 默认配置：5 分钟 TTL
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        // 自定义不同缓存的 TTL
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // 仪表盘统计：5 分钟
        cacheConfigurations.put("stats:dashboard", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // 趋势数据：10 分钟
        cacheConfigurations.put("stats:trend", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // 物种分布：30 分钟
        cacheConfigurations.put("stats:species", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // 志愿者排行榜：15 分钟
        cacheConfigurations.put("stats:rank:volunteer", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // 机构排行榜：15 分钟
        cacheConfigurations.put("stats:rank:org", defaultConfig.entryTtl(Duration.ofMinutes(15)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }
}
