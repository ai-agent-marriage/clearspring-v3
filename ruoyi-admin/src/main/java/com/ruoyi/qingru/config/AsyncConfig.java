package com.ruoyi.qingru.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 异步任务配置
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {

    // 使用 Spring 默认的异步执行器
    // 如需自定义线程池，可添加 @Bean 方法配置 TaskExecutor
}
