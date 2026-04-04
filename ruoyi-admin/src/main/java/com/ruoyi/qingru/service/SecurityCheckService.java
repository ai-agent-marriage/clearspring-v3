package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSecurityCheckResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;

/**
 * 内容安全服务
 */
@Slf4j
@Service
public class SecurityCheckService {
    
    @Autowired
    private WxMaService wxMaService;
    
    /**
     * 图片审核
     * @param filePath 图片文件路径
     * @return 是否通过审核
     */
    public boolean checkImage(String filePath) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                log.error("图片文件不存在：{}", filePath);
                return false;
            }
            
            WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                    .imgSecCheck(file);
            
            // 0=通过，1=违规，2=疑似
            boolean passed = result.getResult() == 0;
            log.info("图片审核结果：filePath={}, result={}, passed={}", 
                    filePath, result.getResult(), passed);
            
            return passed;
            
        } catch (Exception e) {
            log.error("图片审核失败", e);
            return false;
        }
    }
    
    /**
     * 图片审核（字节数组）
     * @param content 图片字节数组
     * @return 是否通过审核
     */
    public boolean checkImage(byte[] content) {
        try {
            WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                    .imgSecCheck(content);
            
            boolean passed = result.getResult() == 0;
            log.info("图片审核结果：result={}, passed={}", result.getResult(), passed);
            
            return passed;
            
        } catch (Exception e) {
            log.error("图片审核失败", e);
            return false;
        }
    }
    
    /**
     * 文本审核
     * @param content 文本内容
     * @return 是否通过审核
     */
    public boolean checkText(String content) {
        try {
            WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                    .msgSecCheck(content);
            
            // 0=通过，1=违规，2=疑似
            boolean passed = result.getResult() == 0;
            log.info("文本审核结果：contentLength={}, result={}, passed={}", 
                    content != null ? content.length() : 0, 
                    result.getResult(), passed);
            
            return passed;
            
        } catch (Exception e) {
            log.error("文本审核失败", e);
            return false;
        }
    }
}
