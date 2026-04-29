-- ============================================================
-- 清如小程序 V2.0 - 数据库建表脚本
-- ============================================================
-- 数据库版本：MySQL 5.7+ / MySQL 8.0+
-- 字符集：utf8mb4
-- 排序规则：utf8mb4_unicode_ci
-- 创建日期：2026-04-16
-- 设计依据：PRD V2.0.0
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 一、用户体系（5 张表）
-- ============================================================

-- 表 1：user - 用户基础表
-- 【P0-DB-06 敏感数据加密】phone 和 id_card 字段在应用层使用 AES-256-CBC 加密
-- 密钥管理：环境变量 CIPHER_KEY
-- 脱敏展示：138****1234
CREATE TABLE `user` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `open_id` VARCHAR(64) NOT NULL COMMENT '微信 OpenID',
  `union_id` VARCHAR(64) COMMENT '微信 UnionID（跨应用标识）',
  `nickname` VARCHAR(64) COMMENT '用户昵称',
  `avatar_url` VARCHAR(512) COMMENT '头像 URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
  `phone` VARCHAR(20) COMMENT '手机号（AES 加密）',
  `is_prayer` TINYINT DEFAULT 1 COMMENT '是否祈福者（P0-DB-04 多角色支持）',
  `is_volunteer` TINYINT DEFAULT 0 COMMENT '是否志愿者（P0-DB-04 多角色支持）',
  `is_organization` TINYINT DEFAULT 0 COMMENT '是否机构（P0-DB-04 多角色支持）',
  `is_registered` TINYINT DEFAULT 0 COMMENT '是否注册：0-未注册，1-已注册',
  `last_login_at` TIMESTAMP NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) COMMENT '最后登录 IP',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_open_id` (`open_id`),
  INDEX `idx_union_id` (`union_id`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户基础表';

-- 表 2：user_role - 用户角色表
CREATE TABLE `user_role` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `role_type` TINYINT NOT NULL COMMENT '角色类型：1-祈福者，2-公益志愿者，3-合规执行机构，4-平台管理员',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常，2-审核中，3-审核驳回',
  `activated_at` TIMESTAMP NULL COMMENT '角色激活时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_role_type` (`role_type`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色表';

-- 表 3：volunteer - 公益志愿者扩展表
-- 【P0-DB-06 敏感数据加密】id_card 字段在应用层使用 AES-256-CBC 加密
CREATE TABLE `volunteer` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `real_name` VARCHAR(64) NOT NULL COMMENT '真实姓名',
  `id_card` VARCHAR(64) NOT NULL COMMENT '身份证号（AES 加密）',
  `auth_status` TINYINT DEFAULT 0 COMMENT '实名认证状态：0-未认证，1-认证中，2-已认证，3-认证失败',
  `organization_id` BIGINT NULL COMMENT '绑定机构 ID',
  `invite_code` VARCHAR(32) COMMENT '机构邀请码',
  `total_tasks` INT DEFAULT 0 COMMENT '累计执行任务数',
  `compliance_rate` DECIMAL(5,2) DEFAULT 100.00 COMMENT '合规执行率（百分比）',
  `service_hours` DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计公益服务时长（小时）',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_organization_id` (`organization_id`),
  INDEX `idx_auth_status` (`auth_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公益志愿者扩展表';

-- 表 4：organization - 合规执行机构表
CREATE TABLE `organization` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `name` VARCHAR(128) NOT NULL COMMENT '机构名称',
  `unified_social_credit_code` VARCHAR(64) NOT NULL COMMENT '统一社会信用代码',
  `legal_representative` VARCHAR(64) COMMENT '法人代表',
  `contact_phone` VARCHAR(20) COMMENT '联系电话',
  `address` VARCHAR(256) COMMENT '机构地址',
  `auth_status` TINYINT DEFAULT 0 COMMENT '审核状态：0-未提交，1-审核中，2-已通过，3-已驳回',
  `business_scope` VARCHAR(512) COMMENT '业务范围',
  `total_orders` INT DEFAULT 0 COMMENT '累计执行订单数',
  `settlement_ratio` DECIMAL(5,2) DEFAULT 100.00 COMMENT '结算比例（百分比）',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_unified_social_credit_code` (`unified_social_credit_code`),
  INDEX `idx_auth_status` (`auth_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合规执行机构表';

-- 表 5：organization_qualification - 机构资质表
CREATE TABLE `organization_qualification` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `organization_id` BIGINT NOT NULL COMMENT '机构 ID',
  `qualification_type` TINYINT NOT NULL COMMENT '资质类型：1-营业执照，2-水生生物增殖放流资质，3-公益组织资质，4-其他资质',
  `file_url` VARCHAR(512) NOT NULL COMMENT '资质文件 URL',
  `issue_date` DATE NULL COMMENT '发证日期',
  `expiry_date` DATE NULL COMMENT '到期日期',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-已过期，1-有效，2-已驳回',
  `review_remark` VARCHAR(512) COMMENT '审核备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_organization_id` (`organization_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_expiry_date` (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构资质表';

-- ============================================================
-- 二、护生业务（10 张表）
-- ============================================================

-- 表 6：self_record - 自主护生记录表
CREATE TABLE `self_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `record_date` DATE NOT NULL COMMENT '护生日期',
  `water_area_id` BIGINT NULL COMMENT '投放水域 ID',
  `water_area_name` VARCHAR(128) COMMENT '投放水域名称（冗余）',
  `species_id` BIGINT NOT NULL COMMENT '护生物种 ID',
  `species_name` VARCHAR(128) NOT NULL COMMENT '护生物种名称（冗余）',
  `quantity` INT NOT NULL COMMENT '投放数量',
  `unit` VARCHAR(16) DEFAULT '尾' COMMENT '单位：尾/只/棵',
  `photos` JSON NULL COMMENT '现场照片 URL 数组',
  `wish` VARCHAR(512) COMMENT '护生心愿',
  `compliance_promise` TINYINT DEFAULT 1 COMMENT '是否签署合规承诺：0-否，1-是',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-待审核，1-已通过，2-已驳回，3-已隐藏',
  `review_remark` VARCHAR(512) COMMENT '审核备注',
  `is_editable` TINYINT DEFAULT 1 COMMENT '是否可编辑：0-否，1-是（3 天内）',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_record_date` (`record_date`),
  INDEX `idx_species_id` (`species_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='自主护生记录表';

-- 表 7：order - 委托护生订单表
-- 【P0-DB-05】添加增值服务、心愿寄语、支付流水号等字段
CREATE TABLE `order` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `order_no` VARCHAR(64) NOT NULL COMMENT '订单编号（唯一）',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `organization_id` BIGINT NULL COMMENT '承接机构 ID',
  `execution_date` DATE NOT NULL COMMENT '计划执行日期',
  `water_area_id` BIGINT NOT NULL COMMENT '执行水域 ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额（元）',
  `platform_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '平台服务费（元）',
  `settlement_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '机构结算金额（元）',
  `status` TINYINT DEFAULT 1 COMMENT '订单状态：1-待承接，2-待执行，3-执行中，4-待确认，5-已完成，6-已结算，0-已取消',
  `wish_message` VARCHAR(500) COMMENT '护生心愿寄语（P0-DB-05）',
  `value_added_services` JSON NULL COMMENT '增值服务 JSON [{type:"video",name:"全程视频记录",price:50}]（P0-DB-05）',
  `payment_no` VARCHAR(100) COMMENT '微信支付流水号（P0-DB-05）',
  `payment_time` TIMESTAMP NULL COMMENT '支付时间（P0-DB-05）',
  `volunteer_name` VARCHAR(64) COMMENT '执行志愿者姓名',
  `execution_photos` JSON NULL COMMENT '执行照片 URL 数组',
  `execution_video` VARCHAR(512) COMMENT '执行视频 URL',
  `user_confirmed_at` TIMESTAMP NULL COMMENT '用户确认时间',
  `completed_at` TIMESTAMP NULL COMMENT '订单完成时间',
  `cancelled_at` TIMESTAMP NULL COMMENT '订单取消时间',
  `cancel_reason` VARCHAR(512) COMMENT '取消原因',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_order_no` (`order_no`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_organization_id` (`organization_id`),
  INDEX `idx_execution_date` (`execution_date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='委托护生订单表';

-- 表 8：order_item - 订单明细表
CREATE TABLE `order_item` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `order_id` BIGINT NOT NULL COMMENT '订单 ID',
  `species_id` BIGINT NOT NULL COMMENT '物种 ID',
  `species_name` VARCHAR(128) NOT NULL COMMENT '物种名称',
  `specification` VARCHAR(64) COMMENT '物种规格',
  `unit_price` DECIMAL(10,2) NOT NULL COMMENT '单价（元）',
  `quantity` INT NOT NULL COMMENT '数量',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计金额（元）',
  `service_type` TINYINT DEFAULT 1 COMMENT '服务类型：1-基础护生，2-增值服务',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_species_id` (`species_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- 表 9：payment - 支付订单表
CREATE TABLE `payment` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `order_id` BIGINT NOT NULL COMMENT '订单 ID',
  `payment_no` VARCHAR(64) NOT NULL COMMENT '支付流水号',
  `wechat_trade_no` VARCHAR(64) NULL COMMENT '微信支付交易号',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额（元）',
  `payment_method` TINYINT DEFAULT 1 COMMENT '支付方式：1-微信支付',
  `status` TINYINT DEFAULT 1 COMMENT '支付状态：0-未支付，1-支付成功，2-支付失败，3-已退款',
  `paid_at` TIMESTAMP NULL COMMENT '支付成功时间',
  `refund_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退款金额（元）',
  `refunded_at` TIMESTAMP NULL COMMENT '退款时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_payment_no` (`payment_no`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_wechat_trade_no` (`wechat_trade_no`),
  INDEX `idx_status` (`status`),
  INDEX `idx_paid_at` (`paid_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付订单表';

-- 表 10：execution_task - 执行任务表
CREATE TABLE `execution_task` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `order_id` BIGINT NOT NULL COMMENT '订单 ID',
  `volunteer_id` BIGINT NULL COMMENT '执行志愿者 ID',
  `organization_id` BIGINT NOT NULL COMMENT '机构 ID',
  `task_status` TINYINT DEFAULT 1 COMMENT '任务状态：1-待接收，2-待执行，3-执行中，4-已完成，5-已驳回',
  `assigned_at` TIMESTAMP NULL COMMENT '任务分配时间',
  `accepted_at` TIMESTAMP NULL COMMENT '志愿者接收时间',
  `started_at` TIMESTAMP NULL COMMENT '开始执行时间',
  `completed_at` TIMESTAMP NULL COMMENT '任务完成时间',
  `feedback_content` TEXT NULL COMMENT '执行反馈内容',
  `feedback_photos` JSON NULL COMMENT '反馈照片 URL 数组',
  `feedback_video` VARCHAR(512) NULL COMMENT '反馈视频 URL',
  `compliance_promise` TINYINT DEFAULT 0 COMMENT '是否签署合规承诺：0-否，1-是',
  `review_status` TINYINT DEFAULT 0 COMMENT '审核状态：0-待审核，1-已通过，2-已驳回',
  `review_remark` VARCHAR(512) NULL COMMENT '审核备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_volunteer_id` (`volunteer_id`),
  INDEX `idx_organization_id` (`organization_id`),
  INDEX `idx_task_status` (`task_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='执行任务表';

-- 表 11：task_feedback - 任务执行反馈表
CREATE TABLE `task_feedback` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `task_id` BIGINT NOT NULL COMMENT '任务 ID',
  `feedback_type` TINYINT NOT NULL COMMENT '反馈类型：1-进度反馈，2-完成反馈，3-异常反馈',
  `content` TEXT NOT NULL COMMENT '反馈内容',
  `photos` JSON NULL COMMENT '照片 URL 数组',
  `video` VARCHAR(512) NULL COMMENT '视频 URL',
  `location` VARCHAR(256) NULL COMMENT '执行地点',
  `latitude` DECIMAL(10,8) NULL COMMENT '纬度',
  `longitude` DECIMAL(11,8) NULL COMMENT '经度',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_task_id` (`task_id`),
  INDEX `idx_feedback_type` (`feedback_type`),
  INDEX `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务执行反馈表';

-- 表 12：species - 护生物种表
CREATE TABLE `species` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `category_id` BIGINT NOT NULL COMMENT '分类 ID',
  `name` VARCHAR(128) NOT NULL COMMENT '物种名称',
  `scientific_name` VARCHAR(128) NULL COMMENT '学名',
  `alias` VARCHAR(256) NULL COMMENT '俗称/别名',
  `is_releasable` TINYINT DEFAULT 1 COMMENT '是否可投放：0-禁止投放，1-可合规投放',
  `protection_level` VARCHAR(64) NULL COMMENT '保护级别',
  `ecological_attribute` VARCHAR(512) NULL COMMENT '生态属性',
  `unit` VARCHAR(16) DEFAULT '尾' COMMENT '单位',
  `base_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '基础单价（元）',
  `description` TEXT NULL COMMENT '物种描述',
  `images` JSON NULL COMMENT '物种图片 URL 数组',
  `compliance_tip` VARCHAR(512) NULL COMMENT '合规提示',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_is_releasable` (`is_releasable`),
  INDEX `idx_status` (`status`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='护生物种表';

-- 表 13：species_category - 物种分类表
CREATE TABLE `species_category` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `name` VARCHAR(64) NOT NULL COMMENT '分类名称',
  `parent_id` BIGINT DEFAULT 0 COMMENT '父分类 ID',
  `icon` VARCHAR(512) NULL COMMENT '分类图标 URL',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_parent_id` (`parent_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物种分类表';

-- 表 14：water_area - 合规水域表
CREATE TABLE `water_area` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `name` VARCHAR(128) NOT NULL COMMENT '水域名称',
  `province` VARCHAR(64) NULL COMMENT '省份',
  `city` VARCHAR(64) NULL COMMENT '城市',
  `district` VARCHAR(64) NULL COMMENT '区县',
  `address` VARCHAR(256) NULL COMMENT '详细地址',
  `latitude` DECIMAL(10,8) NULL COMMENT '纬度',
  `longitude` DECIMAL(11,8) NULL COMMENT '经度',
  `water_type` TINYINT NULL COMMENT '水域类型：1-河流，2-湖泊，3-水库，4-海域',
  `description` TEXT NULL COMMENT '水域描述',
  `compliance_info` VARCHAR(512) NULL COMMENT '合规信息',
  `images` JSON NULL COMMENT '水域图片 URL 数组',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_province` (`province`),
  INDEX `idx_city` (`city`),
  INDEX `idx_status` (`status`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合规水域表';

-- 表 15：water_area_organization - 水域 - 机构关联表
CREATE TABLE `water_area_organization` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `water_area_id` BIGINT NOT NULL COMMENT '水域 ID',
  `organization_id` BIGINT NOT NULL COMMENT '机构 ID',
  `is_primary` TINYINT DEFAULT 0 COMMENT '是否主要合作机构：0-否，1-是',
  `cooperation_start` DATE NULL COMMENT '合作开始日期',
  `cooperation_end` DATE NULL COMMENT '合作结束日期',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-已终止，1-合作中',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_area_org` (`water_area_id`, `organization_id`),
  INDEX `idx_organization_id` (`organization_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='水域 - 机构关联表';

-- ============================================================
-- 三、内容体系（7 张表）
-- ============================================================

-- 表 16：audio - 梵音音频表
CREATE TABLE `audio` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `title` VARCHAR(128) NOT NULL COMMENT '音频标题',
  `category` VARCHAR(64) NOT NULL COMMENT '音频分类（9 首固定）',
  `audio_url` VARCHAR(512) NOT NULL COMMENT '音频文件 URL',
  `cover_image` VARCHAR(512) NULL COMMENT '封面图片 URL',
  `duration` INT NOT NULL COMMENT '时长（秒）',
  `description` VARCHAR(512) NULL COMMENT '音频描述',
  `play_count` BIGINT DEFAULT 0 COMMENT '累计播放次数',
  `effective_listen_count` BIGINT DEFAULT 0 COMMENT '有效收听次数',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='梵音音频表';

-- 表 17：audio_record - 音频收听记录表
-- 【P0-DB-01】支持统计有效收听次数、生成里程碑证书
CREATE TABLE `audio_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `audio_id` BIGINT NOT NULL COMMENT '音频 ID',
  `duration` INT NOT NULL COMMENT '收听时长（秒）',
  `is_valid` TINYINT DEFAULT 0 COMMENT '是否有效收听（≥80%）',
  `start_time` DATETIME NULL COMMENT '开始播放时间',
  `end_time` DATETIME NULL COMMENT '结束播放时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_audio_id` (`audio_id`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音频收听记录表（P0-DB-01）';

-- 表 18：zen_content - 禅理内容表
CREATE TABLE `zen_content` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `content` VARCHAR(512) NOT NULL COMMENT '禅理内容',
  `author` VARCHAR(64) NULL COMMENT '作者/出处',
  `category` TINYINT NULL COMMENT '分类：1-正念修身，2-生态护生，3-国学经典，4-生活智慧',
  `tags` JSON NULL COMMENT '标签数组',
  `is_featured` TINYINT DEFAULT 0 COMMENT '是否精选：0-否，1-是',
  `favorite_count` INT DEFAULT 0 COMMENT '收藏次数',
  `share_count` INT DEFAULT 0 COMMENT '分享次数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_category` (`category`),
  INDEX `idx_is_featured` (`is_featured`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='禅理内容表';

-- 表 19：daily_zen - 每日一禅表
CREATE TABLE `daily_zen` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `zen_date` DATE NOT NULL COMMENT '日期',
  `zen_content_id` BIGINT NOT NULL COMMENT '禅理内容 ID',
  `background_image` VARCHAR(512) NULL COMMENT '背景图片 URL',
  `is_published` TINYINT DEFAULT 0 COMMENT '是否已发布：0-未发布，1-已发布',
  `published_at` TIMESTAMP NULL COMMENT '发布时间',
  `view_count` INT DEFAULT 0 COMMENT '浏览次数',
  `share_count` INT DEFAULT 0 COMMENT '分享次数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_zen_date` (`zen_date`),
  INDEX `idx_zen_content_id` (`zen_content_id`),
  INDEX `idx_is_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日一禅表';

-- 表 20：zen_favorite - 禅理收藏表
CREATE TABLE `zen_favorite` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `zen_content_id` BIGINT NOT NULL COMMENT '禅理内容 ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_user_zen` (`user_id`, `zen_content_id`),
  INDEX `idx_zen_content_id` (`zen_content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='禅理收藏表';

-- 表 21：buddhist_calendar - 佛历吉日表
CREATE TABLE `buddhist_calendar` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `calendar_date` DATE NOT NULL COMMENT '日期',
  `gregorian_date` VARCHAR(64) NULL COMMENT '公历日期',
  `buddhist_date` VARCHAR(64) NULL COMMENT '佛历日期',
  `lunar_date` VARCHAR(64) NULL COMMENT '农历日期',
  `ganzhi` VARCHAR(64) NULL COMMENT '干支',
  `suit` JSON NULL COMMENT '宜事项数组',
  `avoid` JSON NULL COMMENT '忌事项数组',
  `zen_content` VARCHAR(512) NULL COMMENT '当日专属禅理',
  `is_auspicious` TINYINT DEFAULT 0 COMMENT '是否吉日：0-否，1-是',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_calendar_date` (`calendar_date`),
  INDEX `idx_is_auspicious` (`is_auspicious`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='佛历吉日表';

-- 表 22：checkin_record - 打卡记录表
-- 【P0-DB-02】支持晨起/晚间打卡功能
CREATE TABLE `checkin_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `checkin_type` TINYINT NOT NULL COMMENT '打卡类型 1 晨起 2 晚间',
  `checkin_date` DATE NOT NULL COMMENT '打卡日期',
  `audio_id` BIGINT NULL COMMENT '关联音频 ID（可选）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_date_type` (`user_id`, `checkin_date`, `checkin_type`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_checkin_date` (`checkin_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='打卡记录表（P0-DB-02）';

-- ============================================================
-- 四、证书体系（3 张表）
-- ============================================================

-- 表 23：certificate_template - 证书模板表
CREATE TABLE `certificate_template` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `template_name` VARCHAR(128) NOT NULL COMMENT '模板名称',
  `template_type` TINYINT NOT NULL COMMENT '模板类型：1-护生圆满证书，2-收听里程碑证书，3-修行打卡证书，4-公益执行证书',
  `background_image` VARCHAR(512) NOT NULL COMMENT '背景图片 URL',
  `template_config` JSON NULL COMMENT '模板配置（字段位置、字体等）',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认模板：0-否，1-是',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_template_type` (`template_type`),
  INDEX `idx_is_default` (`is_default`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='证书模板表';

-- 表 24：certificate - 证书表
CREATE TABLE `certificate` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `certificate_no` VARCHAR(64) NOT NULL COMMENT '证书编号（唯一）',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `template_id` BIGINT NOT NULL COMMENT '模板 ID',
  `certificate_type` TINYINT NOT NULL COMMENT '证书类型：1-护生圆满证书，2-收听里程碑证书，3-修行打卡证书，4-公益执行证书',
  `title` VARCHAR(256) NOT NULL COMMENT '证书标题',
  `content` JSON NOT NULL COMMENT '证书内容（动态字段）',
  `issue_date` DATE NOT NULL COMMENT '颁发日期',
  `image_url` VARCHAR(512) NULL COMMENT '证书图片 URL',
  `share_count` INT DEFAULT 0 COMMENT '分享次数',
  `view_count` INT DEFAULT 0 COMMENT '浏览次数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_certificate_no` (`certificate_no`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_certificate_type` (`certificate_type`),
  INDEX `idx_issue_date` (`issue_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='证书表';

-- 表 25：milestone_certificate - 里程碑证书表
CREATE TABLE `milestone_certificate` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `milestone_type` TINYINT NOT NULL COMMENT '里程碑类型：1-梵音收听，2-护生行动，3-修行打卡',
  `milestone_level` INT NOT NULL COMMENT '里程碑等级（10/100/1000 等）',
  `audio_id` BIGINT NULL COMMENT '关联音频 ID（收听里程碑）',
  `target_count` INT NOT NULL COMMENT '目标次数',
  `current_count` INT NOT NULL COMMENT '当前次数',
  `certificate_id` BIGINT NULL COMMENT '生成的证书 ID',
  `achieved_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '达成时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_milestone_type` (`milestone_type`),
  INDEX `idx_achieved_at` (`achieved_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='里程碑证书表';

-- ============================================================
-- 五、财务结算（5 张表）
-- ============================================================

-- 表 26：settlement - 机构结算单表
CREATE TABLE `settlement` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `settlement_no` VARCHAR(64) NOT NULL COMMENT '结算单编号（唯一）',
  `organization_id` BIGINT NOT NULL COMMENT '机构 ID',
  `settlement_period_start` DATE NOT NULL COMMENT '结算周期开始日期',
  `settlement_period_end` DATE NOT NULL COMMENT '结算周期结束日期',
  `total_orders` INT NOT NULL COMMENT '订单总数',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '结算总金额（元）',
  `platform_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '平台服务费（元）',
  `actual_amount` DECIMAL(10,2) NOT NULL COMMENT '实际结算金额（元）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-待结算，2-已结算，3-已驳回',
  `transfer_voucher` VARCHAR(512) NULL COMMENT '转账凭证 URL',
  `settled_at` TIMESTAMP NULL COMMENT '结算时间',
  `remark` VARCHAR(512) NULL COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_settlement_no` (`settlement_no`),
  INDEX `idx_organization_id` (`organization_id`),
  INDEX `idx_settlement_period_start` (`settlement_period_start`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构结算单表';

-- 表 27：platform_fee - 平台服务费表
CREATE TABLE `platform_fee` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `order_id` BIGINT NOT NULL COMMENT '订单 ID',
  `order_amount` DECIMAL(10,2) NOT NULL COMMENT '订单金额（元）',
  `fee_ratio` DECIMAL(5,2) NOT NULL COMMENT '服务费比例（百分比）',
  `fee_amount` DECIMAL(10,2) NOT NULL COMMENT '服务费金额（元）',
  `settlement_id` BIGINT NULL COMMENT '关联结算单 ID',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-待结算，2-已结算',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_settlement_id` (`settlement_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='平台服务费表';

-- 表 28：invoice - 发票管理表
CREATE TABLE `invoice` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `invoice_no` VARCHAR(64) NOT NULL COMMENT '发票编号',
  `order_id` BIGINT NULL COMMENT '关联订单 ID',
  `settlement_id` BIGINT NULL COMMENT '关联结算单 ID',
  `invoice_type` TINYINT NOT NULL COMMENT '发票类型：1-个人普票，2-企业普票，3-企业专票',
  `invoice_title` VARCHAR(256) NOT NULL COMMENT '发票抬头',
  `taxpayer_id` VARCHAR(64) NULL COMMENT '纳税人识别号',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '开票金额（元）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-待审核，2-已开票，3-已寄出，4-已驳回',
  `invoice_image` VARCHAR(512) NULL COMMENT '发票图片 URL',
  `express_no` VARCHAR(64) NULL COMMENT '快递单号',
  `remark` VARCHAR(512) NULL COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_invoice_no` (`invoice_no`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_settlement_id` (`settlement_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='发票管理表';

-- 表 29：financial_record - 财务记录表
CREATE TABLE `financial_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `record_type` TINYINT NOT NULL COMMENT '记录类型：1-收入，2-支出，3-退款',
  `order_id` BIGINT NULL COMMENT '关联订单 ID',
  `payment_id` BIGINT NULL COMMENT '关联支付 ID',
  `settlement_id` BIGINT NULL COMMENT '关联结算单 ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额（元）',
  `balance_after` DECIMAL(10,2) NULL COMMENT '操作后余额（元）',
  `remark` VARCHAR(512) NULL COMMENT '备注',
  `operator_id` BIGINT NULL COMMENT '操作人 ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_record_type` (`record_type`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='财务记录表';

-- 表 30：refund - 退款记录表
CREATE TABLE `refund` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `refund_no` VARCHAR(64) NOT NULL COMMENT '退款编号（唯一）',
  `order_id` BIGINT NOT NULL COMMENT '订单 ID',
  `payment_id` BIGINT NOT NULL COMMENT '支付 ID',
  `refund_amount` DECIMAL(10,2) NOT NULL COMMENT '退款金额（元）',
  `refund_reason` VARCHAR(512) NOT NULL COMMENT '退款原因',
  `refund_type` TINYINT DEFAULT 1 COMMENT '退款类型：1-自动取消，2-用户申请，3-平台驳回',
  `wechat_refund_no` VARCHAR(64) NULL COMMENT '微信退款单号',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-处理中，2-已退款，3-已驳回',
  `refunded_at` TIMESTAMP NULL COMMENT '退款成功时间',
  `remark` VARCHAR(512) NULL COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  UNIQUE INDEX `uk_refund_no` (`refund_no`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_payment_id` (`payment_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='退款记录表';

-- ============================================================
-- 【P0-DB-03】操作日志表 - 合规数据留存≥3 年、操作留痕审计
-- ============================================================
CREATE TABLE `operation_log` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志 ID',
  `user_id` BIGINT NULL COMMENT '用户 ID',
  `action` VARCHAR(100) NOT NULL COMMENT '操作类型',
  `module` VARCHAR(50) NULL COMMENT '模块名称',
  `request_params` TEXT NULL COMMENT '请求参数',
  `response_code` INT NULL COMMENT '响应状态码',
  `ip_address` VARCHAR(50) NULL COMMENT 'IP 地址',
  `user_agent` VARCHAR(500) NULL COMMENT '用户代理',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_create_time` (`create_time`),
  INDEX `idx_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表（P0-DB-03）';

-- ============================================================
-- 【P0-DB-04】用户角色关联表 - 支持用户同时拥有多个角色
-- ============================================================
CREATE TABLE `user_role_relation` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `role_id` BIGINT NOT NULL COMMENT '角色 ID',
  `role_type` VARCHAR(50) NOT NULL COMMENT 'role 类型：prayer/volunteer/organization',
  `status` TINYINT DEFAULT 1 COMMENT '状态 1 启用 0 禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_role` (`user_id`, `role_type`),
  KEY `idx_role_type` (`role_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表（P0-DB-04）';

-- ============================================================
-- 【P0-DB-07】数据归档策略 - 归档表
-- ============================================================
-- 归档规则：
-- 1. 护生记录、订单记录：3 年后归档到 history 表
-- 2. 操作日志：1 年后归档到 history 表
-- 3. 音频记录：6 个月后归档到 history 表

-- 护生记录归档表
CREATE TABLE `self_record_history` LIKE `self_record`;

-- 订单记录归档表
CREATE TABLE `order_history` LIKE `order`;

-- 操作日志归档表
CREATE TABLE `operation_log_history` LIKE `operation_log`;

-- 音频记录归档表
CREATE TABLE `audio_record_history` LIKE `audio_record`;

-- ============================================================
-- 【P0-DB-07】归档存储过程（每年执行）
-- ============================================================
DELIMITER $$
CREATE PROCEDURE archive_old_data()
BEGIN
  -- 归档 3 年前的护生记录
  INSERT INTO self_record_history 
  SELECT * FROM self_record 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 3 YEAR);
  
  DELETE FROM self_record 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 3 YEAR);
  
  -- 归档 3 年前的订单记录
  INSERT INTO `order`_history 
  SELECT * FROM `order` 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 3 YEAR);
  
  DELETE FROM `order` 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 3 YEAR);
  
  -- 归档 1 年前的操作日志
  INSERT INTO operation_log_history 
  SELECT * FROM operation_log 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);
  
  DELETE FROM operation_log 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);
  
  -- 归档 6 个月前的音频记录
  INSERT INTO audio_record_history 
  SELECT * FROM audio_record 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 6 MONTH);
  
  DELETE FROM audio_record 
  WHERE create_time < DATE_SUB(NOW(), INTERVAL 6 MONTH);
END$$
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 数据库建表脚本完成
-- ============================================================
-- 总计：38 张表（原 30 张 + 新增 4 张 + 归档 4 张）
-- - 用户体系：5 张 + user_role_relation（多角色支持）
-- - 护生业务：10 张
-- - 内容体系：7 张（audio_record 已修复，checkin_record 已修复）
-- - 证书体系：3 张
-- - 财务结算：5 张
-- - 操作日志：1 张（operation_log）
-- - 归档表：4 张（self_record_history, order_history, operation_log_history, audio_record_history）
-- ============================================================
