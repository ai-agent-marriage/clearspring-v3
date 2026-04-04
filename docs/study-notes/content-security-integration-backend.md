# 内容安全 API 集成学习笔记

## 概述

本文档记录了在护生放生小程序后端项目中集成微信内容安全 API 的过程和最佳实践。

## 集成背景

护生放生小程序允许用户上传图片和文本内容，为确保内容合规，需要集成微信内容安全接口进行自动审核。

## 技术方案

### 1. 使用 wx-java 库

项目使用 `weixin-java-miniapp`（wx-java）库来调用微信内容安全 API。

**Maven 依赖**:
```xml
<dependency>
    <groupId>com.github.binarywang</groupId>
    <artifactId>weixin-java-miniapp</artifactId>
    <version>4.5.0</version>
</dependency>
```

### 2. 核心接口

#### 图片审核（imgSecCheck）

```java
public boolean checkImage(String filePath) {
    try {
        File file = new File(filePath);
        if (!file.exists()) {
            log.error("图片文件不存在：{}", filePath);
            return false;
        }
        
        WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                .imgSecCheck(file);
        
        int resultCode = result.getResult();
        if (resultCode == 0) {
            return true;  // 通过
        } else if (resultCode == 1) {
            log.warn("图片违规：{}", filePath);
            return false; // 违规
        } else {
            log.warn("图片疑似违规：{}", filePath);
            return false; // 疑似，按违规处理
        }
    } catch (Exception e) {
        log.error("图片审核失败", e);
        return false;
    }
}
```

#### 文本审核（msgSecCheck）

```java
public boolean checkText(String content) {
    if (content == null || content.trim().isEmpty()) {
        return true; // 空文本直接通过
    }
    
    try {
        WxMaSecurityCheckResult result = wxMaService.getSecurityService()
                .msgSecCheck(content);
        
        int resultCode = result.getResult();
        if (resultCode == 0) {
            return true;  // 通过
        } else if (resultCode == 1) {
            log.warn("文本违规");
            return false; // 违规
        } else {
            log.warn("文本疑似违规");
            return false; // 疑似，按违规处理
        }
    } catch (Exception e) {
        log.error("文本审核失败", e);
        return false;
    }
}
```

### 3. 审核结果码

| 结果码 | 说明 | 处理方式 |
|--------|------|----------|
| 0 | 审核通过 | 允许发布 |
| 1 | 审核违规 | 拒绝发布，提示用户 |
| 2 | 审核疑似 | 按违规处理，拒绝发布 |

## 集成实践

### 1. 护生记录创建流程

```java
public ProtectRecord createRecord(ProtectRecord record) {
    // 1. 内容安全审核（图片）
    if (record.getImages() != null && !record.getImages().trim().isEmpty()) {
        String[] images = record.getImages().split(",");
        for (String image : images) {
            if (!securityCheckService.checkImage(image.trim())) {
                throw new RuntimeException("图片包含违规内容");
            }
        }
    }
    
    // 2. 内容安全审核（文本）
    if (record.getRemark() != null && !record.getRemark().trim().isEmpty()) {
        if (!securityCheckService.checkText(record.getRemark())) {
            throw new RuntimeException("文本包含违规内容");
        }
    }
    
    // 3. 插入记录
    record.setStatus(1);
    protectRecordMapper.insert(record);
    
    // 4. 生成证书
    certificateService.generateCertificate(record);
    
    return record;
}
```

### 2. 错误处理策略

- **审核失败**: 抛出 RuntimeException，返回友好的错误提示
- **审核异常**: 记录日志，返回 false，按违规处理
- **网络图片**: 需要先下载到本地临时文件再审核

### 3. 性能优化建议

1. **异步审核**: 对于大量图片，可以考虑异步审核
2. **缓存机制**: 对已审核通过的图片和文本可以缓存结果
3. **批量审核**: 微信支持批量审核接口，可以减少 API 调用次数

## 注意事项

### 1. 调用频率限制

微信内容安全 API 有调用频率限制，需要注意：
- 单个小程序每日调用次数有限制
- 建议实现本地缓存，避免重复审核相同内容

### 2. 文件大小限制

- 图片大小：不超过 1MB
- 文本长度：不超过 500KB

### 3. 网络图片处理

对于网络图片 URL，需要先下载到本地：
```java
if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    // 下载到本地临时文件
    File tempFile = downloadToTempFile(filePath);
    return checkImage(tempFile.getAbsolutePath());
}
```

### 4. 日志记录

所有审核结果都应该记录日志，便于后续审计和问题排查：
```java
log.info("图片审核结果：filePath={}, result={}, passed={}", 
        filePath, result.getResult(), passed);
```

## 测试用例

### 单元测试示例

```java
@Test
void testCheckText_EmptyContent() {
    boolean result = securityCheckService.checkText(null);
    assertTrue(result); // 空文本应该通过
    
    result = securityCheckService.checkText("");
    assertTrue(result);
}

@Test
void testCheckImage_NullPath() {
    boolean result = securityCheckService.checkImage(null);
    assertFalse(result); // 空路径应该失败
}
```

## 参考资料

- [微信内容安全接口文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.imgSecCheck.html)
- [wx-java GitHub](https://github.com/Wechat-Group/WxJava)
- [微信内容安全最佳实践](https://developers.weixin.qq.com/community/develop/doc/000c6c6e6f8d70f7d229713f556c00)

## 总结

通过本次集成，我们实现了：
1. ✅ 图片内容自动审核
2. ✅ 文本内容自动审核
3. ✅ 审核结果统一处理
4. ✅ 完善的错误处理和日志记录
5. ✅ 与业务流程无缝集成

内容安全是小程序合规运营的基础，必须严格把关。
