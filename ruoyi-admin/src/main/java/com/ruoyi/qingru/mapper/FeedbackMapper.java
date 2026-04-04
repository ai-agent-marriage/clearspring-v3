package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.Feedback;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 用户反馈 Mapper 接口
 */
@Mapper
public interface FeedbackMapper {
    
    /**
     * 插入反馈
     * @param feedback 反馈
     * @return 影响行数
     */
    int insert(Feedback feedback);
    
    /**
     * 根据 ID 查询反馈
     * @param id 主键 ID
     * @return 反馈
     */
    Feedback selectById(@Param("id") Long id);
    
    /**
     * 获取反馈列表（支持筛选）
     * @param type 反馈类型
     * @param status 状态
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 反馈列表
     */
    List<Feedback> selectByCondition(@Param("type") String type,
                                     @Param("status") Integer status,
                                     @Param("offset") Integer offset,
                                     @Param("limit") Integer limit);
    
    /**
     * 统计反馈数量
     * @param type 反馈类型
     * @param status 状态
     * @return 反馈数量
     */
    int countByCondition(@Param("type") String type, @Param("status") Integer status);
    
    /**
     * 更新反馈（处理反馈）
     * @param feedback 反馈
     * @return 影响行数
     */
    int update(Feedback feedback);
    
    /**
     * 删除反馈
     * @param id 主键 ID
     * @return 影响行数
     */
    int deleteById(@Param("id") Long id);
    
    /**
     * 统计待处理反馈数
     * @return 反馈数量
     */
    @org.apache.ibatis.annotations.Select("SELECT COUNT(*) FROM feedback WHERE status = 0")
    int countPendingFeedback();
}
