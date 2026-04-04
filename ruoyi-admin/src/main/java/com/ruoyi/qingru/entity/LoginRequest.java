package com.ruoyi.qingru.entity;

import lombok.Data;

/**
 * 登录请求
 */
@Data
public class LoginRequest {
    /**
     * 微信登录 code
     */
    private String code;
}
