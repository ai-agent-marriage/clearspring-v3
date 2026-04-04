package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.LoginRequest;
import com.ruoyi.qingru.entity.LoginResult;
import com.ruoyi.qingru.service.LoginService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 登录控制器
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class LoginController {
    
    @Autowired
    private LoginService loginService;
    
    /**
     * 微信登录
     * @param request 登录请求
     * @return 登录结果
     */
    @PostMapping("/login")
    public R<LoginResult> login(@RequestBody LoginRequest request) {
        log.info("收到登录请求，code: {}", request.getCode());
        
        try {
            LoginResult result = loginService.login(request.getCode());
            return R.ok(result);
        } catch (Exception e) {
            log.error("登录失败", e);
            return R.fail("登录失败：" + e.getMessage());
        }
    }
}
