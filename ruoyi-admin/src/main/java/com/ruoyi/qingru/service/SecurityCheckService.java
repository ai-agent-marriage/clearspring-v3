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
     * @param filePath 图片文件路径或 URL
     * @return 是否通过审核
     */
    public boolean checkImage(String filePath) {
        try {
            // 如果是 URL，先下载到本地
            File file;
            if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
                // TODO: 下载网络图片到本地临时文件
                log.info("检测到网络图片 URL，需要下载到本地：{}", filePath);
                file = new File(filePath);
            } else {
                file = new File(filePath);
            }
            
            if (!file.exists()) {
                log.error("图片文件不存在：{}", filePath);
                return false;
            }
            
            WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                    .imgSecCheck(file);
            
            int resultCode = result.getResult();
            if (resultCode == 0) {
                log.info("图片审核通过：{}", filePath);
                return true;
            } else if (resultCode == 1) {
                log.warn("图片违规：{}", filePath);
                return false;
            } else {
                log.warn("图片疑似违规，按违规处理：{}", filePath);
                return false;
            }
            
        } catch (Exception e) {
            log.error("图片审核失败：{}", filePath, e);
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
        if (content == null || content.trim().isEmpty()) {
            return true; // 空文本直接通过
        }
        
        try {
            WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                    .msgSecCheck(content);
            
            int resultCode = result.getResult();
            if (resultCode == 0) {
                log.info("文本审核通过：contentLength={}", content.length());
                return true;
            } else if (resultCode == 1) {
                log.warn("文本违规：contentLength={}", content.length());
                return false;
            } else {
                log.warn("文本疑似违规，按违规处理：contentLength={}", content.length());
                return false;
            }
            
        } catch (Exception e) {
            log.error("文本审核失败：contentLength={}", 
                    content != null ? content.length() : 0, e);
            return false;
        }
    }
}
