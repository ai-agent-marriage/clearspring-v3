-- ============================================
-- Week 2 数据库索引优化脚本
-- 生成日期：2026-04-04
-- 说明：为 Week 2 新增表和优化现有表索引
-- ============================================

-- 使用数据库
USE `ry-vue`;

-- ============================================
-- 1. feedback 表索引优化（Week 2 新增）
-- ============================================

-- 索引 1: 状态 + 类型复合索引
-- 用途：反馈列表查询（按状态和类型筛选）
-- 影响查询：FeedbackMapper.selectByCondition
CREATE INDEX IF NOT EXISTS idx_feedback_status_type ON feedback(status, type);

-- 索引 2: 创建时间索引
-- 用途：反馈列表按时间排序
-- 影响查询：FeedbackMapper.selectByCondition (ORDER BY create_time DESC)
CREATE INDEX IF NOT EXISTS idx_feedback_create_time ON feedback(create_time DESC);

-- 索引 3: 用户 ID + 创建时间索引
-- 用途：用户历史反馈查询（待补充功能）
-- 影响查询：未来可能的用户反馈列表查询
CREATE INDEX IF NOT EXISTS idx_feedback_user_time ON feedback(user_id, create_time DESC);

-- ============================================
-- 2. help_doc 表索引（HelpDocService 使用内存存储，预留）
-- ============================================

-- 说明：当前 HelpDocService 使用 ConcurrentHashMap 内存存储
-- 如改为数据库存储，需要创建以下索引：

-- 预留脚本（启用时取消注释）
/*
CREATE TABLE IF NOT EXISTS `help_doc` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '文档 ID',
  `title` varchar(200) NOT NULL COMMENT '文档标题',
  `content` text COMMENT '文档内容',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `view_count` int(11) DEFAULT '0' COMMENT '浏览次数',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帮助文档表';

CREATE INDEX IF NOT EXISTS idx_help_doc_category ON help_doc(category);
CREATE INDEX IF NOT EXISTS idx_help_doc_sort ON help_doc(sort);
CREATE FULLTEXT INDEX IF NOT EXISTS idx_help_doc_content ON help_doc(title, content);
*/

-- ============================================
-- 3. message_template 表索引（预留）
-- ============================================

-- 说明：当前 MessageService 使用 ConcurrentHashMap 内存存储
-- 如改为数据库存储，需要创建以下索引：

/*
CREATE TABLE IF NOT EXISTS `message_template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '模板 ID',
  `name` varchar(100) NOT NULL COMMENT '模板名称',
  `template_id` varchar(100) DEFAULT NULL COMMENT '微信模板 ID',
  `trigger` varchar(200) DEFAULT NULL COMMENT '触发场景',
  `content` text COMMENT '模板内容',
  `enabled` tinyint(1) DEFAULT '1' COMMENT '是否启用',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息模板表';

CREATE INDEX IF NOT EXISTS idx_message_template_enabled ON message_template(enabled);
*/

-- ============================================
-- 4. internal_message 表索引（预留）
-- ============================================

-- 说明：当前 MessageService 使用 ConcurrentHashMap 内存存储
-- 如改为数据库存储，需要创建以下索引：

/*
CREATE TABLE IF NOT EXISTS `internal_message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '消息 ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户 ID',
  `type` tinyint(4) DEFAULT '1' COMMENT '消息类型：1 订单通知 2 系统通知',
  `title` varchar(200) NOT NULL COMMENT '消息标题',
  `content` text COMMENT '消息内容',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1 未读 2 已读',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站内信表';

CREATE INDEX IF NOT EXISTS idx_internal_message_user_status ON internal_message(user_id, status);
CREATE INDEX IF NOT EXISTS idx_internal_message_create_time ON internal_message(create_time DESC);
*/

-- ============================================
-- 5. order_protect 表索引优化（Week 2 增强）
-- ============================================

-- 索引 4: 状态 + 机构 ID + 创建时间复合索引
-- 用途：机构工作台待承接订单统计
-- 影响查询：OrderProtectMapper.countPendingOrders
CREATE INDEX IF NOT EXISTS idx_order_org_status_time ON order_protect(org_id, status, create_time);

-- 索引 5: 执行日期索引
-- 用途：今日待执行订单统计
-- 影响查询：OrderProtectMapper.countTodayTasks
CREATE INDEX IF NOT EXISTS idx_order_execute_date ON order_protect(execute_date);

-- 索引 6: 用户确认状态索引
-- 用途：待用户确认订单统计
-- 影响查询：OrderProtectMapper.countPendingConfirm
CREATE INDEX IF NOT EXISTS idx_order_user_confirm ON order_protect(user_confirm_status);

-- ============================================
-- 6. volunteer 表索引优化（Week 2 增强）
-- ============================================

-- 索引 7: 机构 ID + 状态 + 创建时间
-- 用途：机构志愿者统计
-- 影响查询：VolunteerMapper.countByOrgId, countActiveByOrgId
CREATE INDEX IF NOT EXISTS idx_volunteer_org_status_time ON volunteer(org_id, status, create_time);

-- ============================================
-- 7. task_execute 表索引优化（Week 2 增强）
-- ============================================

-- 索引 8: 机构 ID + 审核状态
-- 用途：待审核执行材料统计
-- 影响查询：TaskExecuteMapper.countPendingAudit
CREATE INDEX IF NOT EXISTS idx_task_org_audit ON task_execute(org_id, audit_status);

-- 索引 9: 执行日期 + 状态
-- 用途：执行任务查询
-- 影响查询：TaskExecuteMapper.selectByDate
CREATE INDEX IF NOT EXISTS idx_task_date_status ON task_execute(execute_date, status);

-- ============================================
-- 8. settlement 表索引优化（Week 2 增强）
-- ============================================

-- 索引 10: 机构 ID + 状态 + 创建时间
-- 用途：待结算订单统计
-- 影响查询：SettlementMapper.countPendingSettle
CREATE INDEX IF NOT EXISTS idx_settlement_org_status_time ON settlement(org_id, status, create_time);

-- ============================================
-- 9. 复合查询优化索引
-- ============================================

-- 索引 11: 订单状态统计索引（用于仪表盘）
-- 用途：快速获取各状态订单数量
CREATE INDEX IF NOT EXISTS idx_order_status_count ON order_protect(status, org_id, create_time);

-- ============================================
-- 10. 敏感词表索引（如使用数据库存储）
-- ============================================

/*
CREATE TABLE IF NOT EXISTS `sensitive_word` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `word` varchar(100) NOT NULL COMMENT '敏感词',
  `level` tinyint(4) DEFAULT '1' COMMENT '敏感级别：1 低 2 中 3 高',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0 禁用 1 启用',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_word` (`word`),
  KEY `idx_level` (`level`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='敏感词表';

CREATE INDEX IF NOT EXISTS idx_sensitive_word_status ON sensitive_word(status);
CREATE INDEX IF NOT EXISTS idx_sensitive_word_level ON sensitive_word(level, status);
*/

-- ============================================
-- 11. 物种表索引优化
-- ============================================

-- 索引 12: 类型 + 状态索引
-- 用途：物种列表筛选查询
-- 影响查询：SpeciesMapper.selectList
CREATE INDEX IF NOT EXISTS idx_species_type_status ON species(type, status);

-- 索引 13: 禁止状态索引
-- 用途：禁止物种查询
-- 影响查询：SpeciesMapper.selectList (isForbid 参数)
CREATE INDEX IF NOT EXISTS idx_species_is_forbid ON species(is_forbid);

-- ============================================
-- 12. 公告表索引优化
-- ============================================

/*
CREATE TABLE IF NOT EXISTS `notice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '公告 ID',
  `title` varchar(200) NOT NULL COMMENT '公告标题',
  `content` text COMMENT '公告内容',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态：1 已发布 2 草稿 3 已下架',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

CREATE INDEX IF NOT EXISTS idx_notice_status_publish ON notice(status, publish_time DESC);
*/

-- ============================================
-- 验证索引创建结果
-- ============================================

-- 查看 feedback 表索引
SHOW INDEX FROM feedback;

-- 查看 order_protect 表索引（增强后）
SHOW INDEX FROM order_protect;

-- 查看 volunteer 表索引（增强后）
SHOW INDEX FROM volunteer;

-- 查看 task_execute 表索引（增强后）
SHOW INDEX FROM task_execute;

-- 查看 settlement 表索引（增强后）
SHOW INDEX FROM settlement;

-- ============================================
-- 性能对比测试
-- ============================================

-- 测试 feedback 表查询性能
EXPLAIN SELECT * FROM feedback WHERE status = 1 AND type = '功能建议' ORDER BY create_time DESC LIMIT 10;

-- 测试 order_protect 表统计查询性能
EXPLAIN SELECT COUNT(*) FROM order_protect WHERE org_id = 1 AND status = 1;

-- 测试 task_execute 表审核统计查询性能
EXPLAIN SELECT COUNT(*) FROM task_execute WHERE org_id = 1 AND audit_status = 0;

-- ============================================
-- 索引维护建议
-- ============================================

-- 1. 定期分析表，优化索引统计信息
ANALYZE TABLE feedback;
ANALYZE TABLE order_protect;
ANALYZE TABLE volunteer;
ANALYZE TABLE task_execute;
ANALYZE TABLE settlement;

-- 2. 监控索引使用情况（MySQL 5.6+）
-- SELECT * FROM sys.schema_unused_indexes;

-- 3. 监控慢查询，根据实际查询优化索引
-- 查看慢查询日志：SELECT * FROM mysql.slow_log LIMIT 10;

-- ============================================
-- 回滚脚本（如需删除 Week 2 新增索引）
-- ============================================

-- feedback 表
-- DROP INDEX IF EXISTS idx_feedback_status_type ON feedback;
-- DROP INDEX IF EXISTS idx_feedback_create_time ON feedback;
-- DROP INDEX IF EXISTS idx_feedback_user_time ON feedback;

-- order_protect 表
-- DROP INDEX IF EXISTS idx_order_org_status_time ON order_protect;
-- DROP INDEX IF EXISTS idx_order_execute_date ON order_protect;
-- DROP INDEX IF EXISTS idx_order_user_confirm ON order_protect;
-- DROP INDEX IF EXISTS idx_order_status_count ON order_protect;

-- volunteer 表
-- DROP INDEX IF EXISTS idx_volunteer_org_status_time ON volunteer;

-- task_execute 表
-- DROP INDEX IF EXISTS idx_task_org_audit ON task_execute;
-- DROP INDEX IF EXISTS idx_task_date_status ON task_execute;

-- settlement 表
-- DROP INDEX IF EXISTS idx_settlement_org_status_time ON settlement;

-- species 表
-- DROP INDEX IF EXISTS idx_species_type_status ON species;
-- DROP INDEX IF EXISTS idx_species_is_forbid ON species;

-- ============================================
-- 脚本执行完成
-- ============================================
