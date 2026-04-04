package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

/**
 * 用户 Mapper 接口
 */
@Mapper
public interface UserMapper {
    
    /**
     * 根据 openid 查询用户
     * @param openid 微信 openid
     * @return 用户信息
     */
    @Select("SELECT * FROM user WHERE openid = #{openid}")
    User selectByOpenid(@Param("openid") String openid);
    
    /**
     * 插入用户
     * @param user 用户信息
     * @return 影响行数
     */
    @Insert("INSERT INTO user (openid, nickname, avatar, phone, role_code, org_id, merit) " +
            "VALUES (#{openid}, #{nickname}, #{avatar}, #{phone}, #{roleCode}, #{orgId}, #{merit})")
    int insert(User user);
    
    /**
     * 更新用户
     * @param user 用户信息
     * @return 影响行数
     */
    @Update("UPDATE user SET nickname=#{nickname}, avatar=#{avatar}, phone=#{phone}, " +
            "role_code=#{roleCode}, org_id=#{orgId}, merit=#{merit} WHERE id=#{id}")
    int update(User user);
    
    /**
     * 统计累计注册用户数
     * @return 用户数量
     */
    @Select("SELECT COUNT(*) FROM user")
    int countTotalUsers();
    
    /**
     * 统计今日日活用户数
     * @return 用户数量
     */
    @Select("SELECT COUNT(DISTINCT id) FROM user WHERE DATE(create_time) = CURDATE()")
    int countDailyActiveUsers();
    
    /**
     * 统计累计委托订单数
     * @return 订单数量
     */
    @Select("SELECT COUNT(*) FROM order_protect")
    int countTotalOrders();
    
    /**
     * 统计累计用户总数
     * @return 用户数量
     */
    @Select("SELECT COUNT(*) FROM user")
    int countTotal();
    
    /**
     * 统计今日新增用户数
     * @return 用户数量
     */
    @Select("SELECT COUNT(*) FROM user WHERE DATE(create_time) = CURDATE()")
    int countTodayNewUsers();
    
    /**
     * 根据 ID 查询用户
     * @param id 用户 ID
     * @return 用户信息
     */
    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(@Param("id") Long id);
    
    /**
     * 根据条件查询用户列表
     * @param role 角色（可选）
     * @param status 状态（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 用户列表
     */
    List<User> selectByCondition(@Param("role") Integer role,
                                  @Param("status") Integer status,
                                  @Param("offset") Integer offset,
                                  @Param("limit") Integer limit);
    
    /**
     * 删除用户
     * @param id 用户 ID
     * @return 影响行数
     */
    @org.apache.ibatis.annotations.Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
