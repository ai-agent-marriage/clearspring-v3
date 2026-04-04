package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.VolunteerTask;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 志愿者任务 Mapper 接口
 */
@Mapper
public interface VolunteerTaskMapper {
    
    /**
     * 插入志愿者任务
     * @param task 志愿者任务
     * @return 影响行数
     */
    int insert(VolunteerTask task);
    
    /**
     * 根据志愿者 ID 查询任务列表
     * @param volunteerId 志愿者 ID
     * @param status 状态（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 任务列表
     */
    List<VolunteerTask> selectByVolunteerId(@Param("volunteerId") Long volunteerId,
                                             @Param("status") Integer status,
                                             @Param("offset") Integer offset,
                                             @Param("limit") Integer limit);
    
    /**
     * 根据订单号查询任务
     * @param orderNo 订单号
     * @return 志愿者任务
     */
    VolunteerTask selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 更新志愿者任务
     * @param task 志愿者任务
     * @return 影响行数
     */
    int update(VolunteerTask task);
}
