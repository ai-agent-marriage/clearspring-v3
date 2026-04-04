package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.TaskExecute;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 任务执行结果 Mapper 接口
 */
@Mapper
public interface TaskExecuteMapper {
    
    /**
     * 插入执行记录
     * @param execute 执行记录
     * @return 影响行数
     */
    int insert(TaskExecute execute);
    
    /**
     * 根据 ID 查询执行记录
     * @param id 执行记录 ID
     * @return 执行记录
     */
    TaskExecute selectById(@Param("id") Long id);
    
    /**
     * 根据订单号查询执行记录
     * @param orderNo 订单号
     * @return 执行记录
     */
    TaskExecute selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据志愿者 ID 查询执行记录列表
     * @param volunteerId 志愿者 ID
     * @param status 状态（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 执行记录列表
     */
    List<TaskExecute> selectByVolunteerId(@Param("volunteerId") Long volunteerId,
                                           @Param("status") Integer status,
                                           @Param("offset") Integer offset,
                                           @Param("limit") Integer limit);
    
    /**
     * 更新执行记录
     * @param execute 执行记录
     * @return 影响行数
     */
    int update(TaskExecute execute);
    
    /**
     * 统计志愿者完成任务数
     * @param volunteerId 志愿者 ID
     * @return 任务数
     */
    int countByVolunteerId(@Param("volunteerId") Long volunteerId);
    
    /**
     * 统计志愿者服务时长
     * @param volunteerId 志愿者 ID
     * @return 服务时长
     */
    int sumServiceHours(@Param("volunteerId") Long volunteerId);
    
    /**
     * 统计志愿者合规任务数
     * @param volunteerId 志愿者 ID
     * @return 合规任务数
     */
    int countCompliantTasks(@Param("volunteerId") Long volunteerId);
}
