package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.ZenQuote;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 禅理内容 Mapper 接口
 */
@Mapper
public interface ZenQuoteMapper {
    
    /**
     * 随机获取禅理
     * @return 禅理内容
     */
    ZenQuote selectRandom();
    
    /**
     * 根据 ID 查询禅理
     * @param id 主键 ID
     * @return 禅理内容
     */
    ZenQuote selectById(@Param("id") Long id);
    
    /**
     * 查询禅理列表
     * @return 禅理列表
     */
    List<ZenQuote> selectList();
}
