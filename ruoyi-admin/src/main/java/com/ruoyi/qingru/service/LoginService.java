package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import com.ruoyi.qingru.entity.LoginResult;
import com.ruoyi.qingru.entity.User;
import com.ruoyi.qingru.mapper.UserMapper;
import com.ruoyi.qingru.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 登录服务
 */
@Slf4j
@Service
public class LoginService {
    
    @Autowired
    private WxMaService wxMaService;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 微信登录
     * @param code 微信登录 code
     * @return 登录结果
     */
    public LoginResult login(String code) {
        try {
            // 获取 session
            WxMaJscode2SessionResult session = wxMaService.getUserService()
                    .getSessionInfo(code);
            
            if (session == null || session.getOpenid() == null) {
                throw new RuntimeException("微信登录失败，无法获取 openid");
            }
            
            String openid = session.getOpenid();
            log.info("微信登录成功，openid: {}", openid);
            
            // 查询或创建用户
            User user = userMapper.selectByOpenid(openid);
            if (user == null) {
                user = new User();
                user.setOpenid(openid);
                user.setRoleCode("user");
                user.setMerit(0);
                userMapper.insert(user);
                log.info("新用户创建成功，openid: {}", openid);
            }
            
            // 生成 token
            String token = jwtUtil.generateToken(user.getOpenid());
            
            return new LoginResult(token, user);
            
        } catch (Exception e) {
            log.error("微信登录失败", e);
            throw new RuntimeException("登录失败：" + e.getMessage());
        }
    }
}
