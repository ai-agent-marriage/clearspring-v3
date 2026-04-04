package com.ruoyi.qingru.entity;

import lombok.Data;

/**
 * 复核请求实体类
 */
public class ReviewRequest {
    /**
     * 复核原因
     */
    private String reason;


    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
}
