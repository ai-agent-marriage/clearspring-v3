-- ============================================
-- 数据库索引优化脚本
-- 生成日期：2026-04-04
-- 说明：为常用查询字段添加索引，提升查询性能
-- ============================================

-- 使用数据库
USE `ry-vue`;

-- ============================================
-- 1. order_protect 表索引优化
-- ============================================

-- 索引 1: 订单状态 + 创建时间索引
-- 用途：订单列表查询、状态筛选、自动取消任务
-- 影响查询：selectByUserId, selectUnclaimedOrders, autoCancelUnclaimedOrders
CREATE INDEX IF NOT EXISTS idx_order_status ON order_protect(status, create_time);

-- 索引 2: 机构 ID + 状态索引
-- 用途：机构订单查询、可承接订单查询
-- 影响查询：selectAvailableOrders, countPendingOrders, countTodayTasks
CREATE INDEX IF NOT EXISTS idx_org_status ON order_protect(org_id, status);

-- 索引 3: 用户 ID + 创建时间索引
-- 用途：用户订单列表查询
-- 影响查询：selectByUserId
CREATE INDEX IF NOT EXISTS idx_user_create ON order_protect(user_id, create_time DESC);

-- ============================================
-- 2. volunteer 表索引优化
-- ============================================

-- 索引 4: 机构 ID + 状态索引
-- 用途：机构志愿者列表查询、活跃志愿者统计
-- 影响查询：selectByOrgId, countByOrgId, countActiveByOrgId
CREATE INDEX IF NOT EXISTS idx_volunteer_org ON volunteer(org_id, status);

-- 索引 5: 用户 ID 索引
-- 用途：根据用户 ID 查询志愿者
-- 影响查询：selectByUserId
CREATE INDEX IF NOT EXISTS idx_volunteer_user ON volunteer(user_id);

-- ============================================
-- 3. settlement 表索引优化
-- ============================================

-- 索引 6: 状态 + 机构 ID 索引
-- 用途：结算单列表查询、待结算统计
-- 影响查询：selectByOrgIdAndStatus, countPendingSettle
CREATE INDEX IF NOT EXISTS idx_settlement_status ON settlement(status, org_id);

-- 索引 7: 订单号索引
-- 用途：根据订单号查询结算单
-- 影响查询：selectByOrderNo
CREATE INDEX IF NOT EXISTS idx_settlement_order ON settlement(order_no);

-- ============================================
-- 4. task_execute 表索引优化
-- ============================================

-- 索引 8: 志愿者 ID + 状态索引
-- 用途：志愿者执行记录查询
-- 影响查询：selectByVolunteerId, countByVolunteerId
CREATE INDEX IF NOT EXISTS idx_task_volunteer ON task_execute(volunteer_id, status);

-- 索引 9: 订单号索引
-- 用途：根据订单号查询执行记录
-- 影响查询：selectByOrderNo
CREATE INDEX IF NOT EXISTS idx_task_order ON task_execute(order_no);

-- ============================================
-- 5. protect_record 表索引优化
-- ============================================

-- 索引 10: 用户 openid + 创建时间索引
-- 用途：用户护生记录列表查询
-- 影响查询：getMyRecords
CREATE INDEX IF NOT EXISTS idx_record_user ON protect_record(user_openid, create_time DESC);

-- ============================================
-- 6. org_order 表索引优化
-- ============================================

-- 索引 11: 订单号索引
-- 用途：根据订单号查询承接记录
-- 影响查询：selectByOrderNo
CREATE INDEX IF NOT EXISTS idx_org_order_no ON org_order(order_no);

-- 索引 12: 机构 ID + 状态索引
-- 用途：机构承接订单列表查询
-- 影响查询：selectByOrgId
CREATE INDEX IF NOT EXISTS idx_org_order_org ON org_order(org_id, status);

-- ============================================
-- 7. certificate 表索引优化
-- ============================================

-- 索引 13: 订单号索引
-- 用途：根据订单号查询证书
-- 影响查询：selectByOrderNo
CREATE INDEX IF NOT EXISTS idx_cert_order ON certificate(order_no);

-- 索引 14: 用户 ID 索引
-- 用途：用户证书列表查询
-- 影响查询：selectByUserId
CREATE INDEX IF NOT EXISTS idx_cert_user ON certificate(user_id);

-- ============================================
-- 8. species 表索引优化
-- ============================================

-- 索引 15: 状态索引
-- 用途：物种列表查询
-- 影响查询：selectList
CREATE INDEX IF NOT EXISTS idx_species_status ON species(status);

-- ============================================
-- 验证索引创建结果
-- ============================================

-- 查看 order_protect 表索引
SHOW INDEX FROM order_protect;

-- 查看 volunteer 表索引
SHOW INDEX FROM volunteer;

-- 查看 settlement 表索引
SHOW INDEX FROM settlement;

-- 查看 task_execute 表索引
SHOW INDEX FROM task_execute;

-- ============================================
-- 性能对比测试（可选）
-- ============================================

-- 测试前：查看执行计划
EXPLAIN SELECT * FROM order_protect WHERE status = 1 ORDER BY create_time DESC;

-- 测试后：查看执行计划（应该显示使用索引）
EXPLAIN SELECT * FROM order_protect WHERE status = 1 ORDER BY create_time DESC;

-- ============================================
-- 索引维护建议
-- ============================================

-- 1. 定期分析表，优化索引
-- ANALYZE TABLE order_protect;
-- ANALYZE TABLE volunteer;
-- ANALYZE TABLE settlement;

-- 2. 监控慢查询日志，根据需要调整索引
-- 查看慢查询：SELECT * FROM mysql.slow_log;

-- 3. 定期删除未使用的索引（通过 performance_schema 监控）

-- ============================================
-- 回滚脚本（如需删除索引）
-- ============================================

-- DROP INDEX IF EXISTS idx_order_status ON order_protect;
-- DROP INDEX IF EXISTS idx_org_status ON order_protect;
-- DROP INDEX IF EXISTS idx_user_create ON order_protect;
-- DROP INDEX IF EXISTS idx_volunteer_org ON volunteer;
-- DROP INDEX IF EXISTS idx_volunteer_user ON volunteer;
-- DROP INDEX IF EXISTS idx_settlement_status ON settlement;
-- DROP INDEX IF EXISTS idx_settlement_order ON settlement;
-- DROP INDEX IF EXISTS idx_task_volunteer ON task_execute;
-- DROP INDEX IF EXISTS idx_task_order ON task_execute;
-- DROP INDEX IF EXISTS idx_record_user ON protect_record;
-- DROP INDEX IF EXISTS idx_org_order_no ON org_order;
-- DROP INDEX IF EXISTS idx_org_order_org ON org_order;
-- DROP INDEX IF EXISTS idx_cert_order ON certificate;
-- DROP INDEX IF EXISTS idx_cert_user ON certificate;
-- DROP INDEX IF EXISTS idx_species_status ON species;

-- ============================================
-- 脚本执行完成
-- ============================================
