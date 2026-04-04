package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.ProtectRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 护生记录 Mapper 接口
 */
@Mapper
public interface ProtectRecordMapper {
    
    /**
     * 插入护生记录
     * @param record 护生记录
     * @return 影响行数
     */
    int insert(ProtectRecord record);
    
    /**
     * 根据 ID 查询护生记录
     * @param id 主键 ID
     * @return 护生记录
     */
    ProtectRecord selectById(@Param("id") Long id);
    
    /**
     * 根据 openid 查询护生记录列表
     * @param openid 用户 openid
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 护生记录列表
     */
    List<ProtectRecord> selectByOpenid(@Param("openid") String openid, 
                                       @Param("offset") Integer offset, 
                                       @Param("limit") Integer limit);
    
    /**
     * 更新护生记录
     * @param record 护生记录
     * @return 影响行数
     */
    int update(ProtectRecord record);
    
    /**
     * 根据 openid 统计护生记录数量
     * @param openid 用户 openid
     * @return 记录数量
     */
    int countByOpenid(@Param("openid") String openid);
}
