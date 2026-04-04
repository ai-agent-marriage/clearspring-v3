package com.ruoyi.qingru.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类
 */
@Component
public class JwtUtil {
    
    @Value("${token.secret:abcdefghijklmnopqrstuvwxyz}")
    private String secret;
    
    @Value("${token.expireTime:30}")
    private Long expireTime;
    
    /**
     * 生成 token
     * @param openid 用户 openid
     * @return token
     */
    public String generateToken(String openid) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("openid", openid);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(openid)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expireTime * 60 * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
    
    /**
     * 解析 token
     * @param token token
     * @return claims
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * 从 token 中获取 openid
     * @param token token
     * @return openid
     */
    public String getOpenidFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("openid", String.class);
    }
    
    /**
     * 验证 token 是否有效
     * @param token token
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = parseToken(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
