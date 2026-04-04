package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.Species;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 物种信息 Mapper 接口
 */
@Mapper
public interface SpeciesMapper {
    
    /**
     * 查询物种列表
     * @param type 类型（1 鱼类 2 鸟类 3 其他）
     * @param keyword 关键词
     * @return 物种列表
     */
    List<Species> selectList(@Param("type") Integer type, @Param("keyword") String keyword);
    
    /**
     * 根据 ID 查询物种详情
     * @param id 主键 ID
     * @return 物种信息
     */
    Species selectById(@Param("id") Long id);
}
