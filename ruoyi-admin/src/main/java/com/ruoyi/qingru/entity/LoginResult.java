package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录结果
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResult {
    /**
     * 访问令牌
     */
    private String token;
    
    /**
     * 用户信息
     */
    private User user;
}
