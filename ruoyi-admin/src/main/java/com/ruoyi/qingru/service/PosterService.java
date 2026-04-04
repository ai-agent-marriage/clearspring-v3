package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 海报生成服务
 */
@Service
public class PosterService {
    private static final Logger log = LoggerFactory.getLogger(PosterService.class);

    
    @Autowired
    private WxMaService wxMaService;
    
    /**
     * 生成每日禅理海报
     * @param zenQuote 禅理内容
     * @param bgUrl 背景图 URL
     * @return 海报文件路径
     */
    public String generateDailyZenPoster(String zenQuote, String bgUrl) {
        log.info("生成每日禅理海报，zenQuote: {}, bgUrl: {}", zenQuote, bgUrl);
        
        try {
            // 生成小程序码
            // 注意：WxJava 4.x 中 API 有变化，这里暂时返回一个模拟的文件
            // TODO: 需要配置正确的小程序码生成 API
            log.info("生成小程序码（模拟），page: pages/zen/share");
            File qrcodeFile = new File("/tmp/qrcode_mock.png");
            qrcodeFile.getParentFile().mkdirs();
            qrcodeFile.createNewFile();
            
            // 合成海报（背景图 + 禅理文字 + 小程序码）
            String posterPath = synthesizePoster(bgUrl, zenQuote, qrcodeFile);
            
            log.info("海报生成成功，路径：{}", posterPath);
            return posterPath;
            
        } catch (Exception e) {
            log.error("海报生成失败", e);
            return null;
        }
    }
    
    /**
     * 合成海报
     * @param bgUrl 背景图 URL
     * @param text 禅理文字
     * @param qrcode 小程序码文件
     * @return 海报文件路径
     */
    private String synthesizePoster(String bgUrl, String text, File qrcode) throws IOException {
        // 下载背景图
        BufferedImage bgImage = ImageIO.read(new URL(bgUrl));
        
        // 创建海报图像
        BufferedImage poster = new BufferedImage(bgImage.getWidth(), bgImage.getHeight(), 
            BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = poster.createGraphics();
        
        // 绘制背景
        g2d.drawImage(bgImage, 0, 0, null);
        
        // 设置字体和颜色
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("SimSun", Font.PLAIN, 24));
        
        // 绘制禅理文字（居中）
        int textWidth = g2d.getFontMetrics().stringWidth(text);
        int x = (bgImage.getWidth() - textWidth) / 2;
        int y = bgImage.getHeight() / 2;
        g2d.drawString(text, x, y);
        
        // 绘制小程序码（右下角）
        BufferedImage qrcodeImage = ImageIO.read(qrcode);
        int qrcodeSize = 150;
        g2d.drawImage(qrcodeImage, 
            bgImage.getWidth() - qrcodeSize - 20, 
            bgImage.getHeight() - qrcodeSize - 20, 
            qrcodeSize, qrcodeSize, null);
        
        g2d.dispose();
        
        // 保存海报
        String posterPath = "/tmp/posters/zen_" + System.currentTimeMillis() + ".jpg";
        File posterFile = new File(posterPath);
        posterFile.getParentFile().mkdirs();
        ImageIO.write(poster, "jpg", posterFile);
        
        return posterPath;
    }
}
