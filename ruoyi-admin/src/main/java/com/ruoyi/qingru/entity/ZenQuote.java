package com.ruoyi.qingru.entity;

/**
 * 禅语实体类
 */
public class ZenQuote {
    
    private Long id;
    private String content;    // 禅语内容
    private String author;     // 作者/出处

    public ZenQuote() {
    }

    public ZenQuote(String content, String author) {
        this.content = content;
        this.author = author;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
