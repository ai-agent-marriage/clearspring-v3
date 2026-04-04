package com.ruoyi.qingru.entity;

import lombok.Data;

/**
 * 登录请求
 */
public class LoginRequest {
    /**
     * 微信登录 code
     */
    private String code;


    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
}
