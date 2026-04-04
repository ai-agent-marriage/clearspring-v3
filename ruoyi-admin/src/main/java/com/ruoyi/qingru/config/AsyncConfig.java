package com.ruoyi.qingru.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 异步任务配置
 * 提供多个线程池以支持不同的异步场景
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {

    /**
     * 统计任务线程池
     * 用于统计数据计算等耗时操作
     */
    @Bean("statsExecutor")
    public Executor statsExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("stats-async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }

    /**
     * 消息推送线程池
     * 用于微信订阅消息、站内信等推送任务
     * 配置说明：
     * - corePoolSize: 核心线程数，保持基础推送能力
     * - maxPoolSize: 最大线程数，应对推送高峰
     * - queueCapacity: 队列容量，缓冲突发推送请求
     * - keepAliveSeconds: 线程空闲超时时间
     */
    @Bean("messagePushExecutor")
    public Executor messagePushExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);           // 核心线程数增加到 10，支持并发推送
        executor.setMaxPoolSize(30);            // 最大线程数增加到 30，应对推送高峰
        executor.setQueueCapacity(500);         // 队列容量增加到 500，缓冲更多请求
        executor.setThreadNamePrefix("message-push-");
        executor.setKeepAliveSeconds(60);       // 线程空闲 60 秒后回收
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy()); // 拒绝策略：调用者运行
        executor.setWaitForTasksToCompleteOnShutdown(true); // 关闭时等待任务完成
        executor.setAwaitTerminationSeconds(120); // 最多等待 120 秒
        executor.initialize();
        return executor;
    }

    /**
     * 通用异步线程池
     * 用于其他未指定线程池的异步任务
     */
    @Bean("taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(15);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("async-task-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }
}
