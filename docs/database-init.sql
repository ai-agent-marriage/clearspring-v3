-- 清如·护生池数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS qingru_app DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qingru_app;

-- ==================== 系统表 ====================

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户 ID',
    `openid` VARCHAR(64) UNIQUE NOT NULL COMMENT '微信 openid',
    `nickname` VARCHAR(64) COMMENT '昵称',
    `avatar` VARCHAR(255) COMMENT '头像 URL',
    `phone` VARCHAR(20) COMMENT '手机号',
    `role_code` VARCHAR(32) DEFAULT 'user' COMMENT '角色代码',
    `org_id` BIGINT COMMENT '组织 ID',
    `merit` INT DEFAULT 0 COMMENT '功德值',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_openid` (`openid`),
    INDEX `idx_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS `sys_role` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '角色 ID',
    `role_code` VARCHAR(32) UNIQUE NOT NULL COMMENT '角色代码',
    `role_name` VARCHAR(64) NOT NULL COMMENT '角色名称',
    `description` VARCHAR(255) COMMENT '描述',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 组织表
CREATE TABLE IF NOT EXISTS `organization` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '组织 ID',
    `name` VARCHAR(128) NOT NULL COMMENT '组织名称',
    `type` VARCHAR(32) COMMENT '组织类型',
    `contact_person` VARCHAR(64) COMMENT '联系人',
    `contact_phone` VARCHAR(20) COMMENT '联系电话',
    `address` VARCHAR(255) COMMENT '地址',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1=启用 0=禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='组织表';

-- ==================== 护生业务表 ====================

-- 物种表
CREATE TABLE IF NOT EXISTS `species` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '物种 ID',
    `name` VARCHAR(64) NOT NULL COMMENT '物种名称',
    `scientific_name` VARCHAR(128) COMMENT '学名',
    `category` VARCHAR(32) COMMENT '分类：鱼/鸟/昆虫/其他',
    `can_release` TINYINT DEFAULT 1 COMMENT '是否可投放 1=可 0=禁止',
    `description` TEXT COMMENT '描述',
    `image_url` VARCHAR(255) COMMENT '图片 URL',
    `release_season` VARCHAR(64) COMMENT '适宜投放季节',
    `release_location` VARCHAR(255) COMMENT '适宜投放地点',
    `merit_value` INT DEFAULT 10 COMMENT '功德值',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1=启用 0=禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_category` (`category`),
    INDEX `idx_can_release` (`can_release`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物种表';

-- 投放记录表
CREATE TABLE IF NOT EXISTS `release_record` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
    `user_id` BIGINT NOT NULL COMMENT '用户 ID',
    `species_id` BIGINT NOT NULL COMMENT '物种 ID',
    `quantity` INT NOT NULL COMMENT '数量',
    `release_date` DATE NOT NULL COMMENT '投放日期',
    `release_time` TIME COMMENT '投放时间',
    `location` VARCHAR(255) COMMENT '投放地点',
    `latitude` DECIMAL(10,8) COMMENT '纬度',
    `longitude` DECIMAL(11,8) COMMENT '经度',
    `image_url` VARCHAR(255) COMMENT '现场图片',
    `merit_earned` INT COMMENT '获得功德值',
    `lunar_date` VARCHAR(32) COMMENT '农历日期',
    `is_suitable` TINYINT DEFAULT 1 COMMENT '是否宜护生',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1=待审核 2=已通过 3=已拒绝',
    `audit_remark` VARCHAR(255) COMMENT '审核备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_species_id` (`species_id`),
    INDEX `idx_release_date` (`release_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投放记录表';

-- 音频表（梵音）
CREATE TABLE IF NOT EXISTS `audio` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '音频 ID',
    `title` VARCHAR(128) NOT NULL COMMENT '标题',
    `audio_url` VARCHAR(255) NOT NULL COMMENT '音频 URL',
    `duration` INT COMMENT '时长 (秒)',
    `category` VARCHAR(32) COMMENT '分类：放生仪轨/佛号/咒语/其他',
    `description` TEXT COMMENT '描述',
    `play_count` INT DEFAULT 0 COMMENT '播放次数',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1=启用 0=禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='音频表';

-- 禅理表
CREATE TABLE IF NOT EXISTS `zen_quote` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '禅理 ID',
    `content` TEXT NOT NULL COMMENT '禅理内容',
    `source` VARCHAR(128) COMMENT '来源',
    `author` VARCHAR(64) COMMENT '作者',
    `category` VARCHAR(32) COMMENT '分类',
    `tags` VARCHAR(255) COMMENT '标签',
    `share_count` INT DEFAULT 0 COMMENT '分享次数',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1=启用 0=禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='禅理表';

-- 功德记录表
CREATE TABLE IF NOT EXISTS `merit_record` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
    `user_id` BIGINT NOT NULL COMMENT '用户 ID',
    `merit_change` INT NOT NULL COMMENT '功德变化值',
    `merit_balance` INT COMMENT '功德余额',
    `source_type` VARCHAR(32) COMMENT '来源类型：release/daily/other',
    `source_id` BIGINT COMMENT '来源记录 ID',
    `remark` VARCHAR(255) COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='功德记录表';

-- 每日签到表
CREATE TABLE IF NOT EXISTS `daily_checkin` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
    `user_id` BIGINT NOT NULL COMMENT '用户 ID',
    `checkin_date` DATE NOT NULL COMMENT '签到日期',
    `merit_reward` INT DEFAULT 1 COMMENT '功德奖励',
    `continuous_days` INT DEFAULT 1 COMMENT '连续签到天数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_user_date` (`user_id`, `checkin_date`),
    INDEX `idx_checkin_date` (`checkin_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日签到表';

-- 通知表
CREATE TABLE IF NOT EXISTS `notification` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '通知 ID',
    `user_id` BIGINT COMMENT '用户 ID (NULL 为系统通知)',
    `title` VARCHAR(128) NOT NULL COMMENT '标题',
    `content` TEXT NOT NULL COMMENT '内容',
    `type` VARCHAR(32) COMMENT '类型：system/activity/reminder',
    `is_read` TINYINT DEFAULT 0 COMMENT '是否已读',
    `read_time` DATETIME COMMENT '阅读时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- ==================== 初始化数据 ====================

-- 插入角色数据
INSERT INTO `sys_role` (`role_code`, `role_name`, `description`) VALUES
('user', '普通用户', '普通用户角色'),
('volunteer', '志愿者', '志愿者角色，可审核投放记录'),
('org', '组织管理员', '组织管理员角色'),
('admin', '超级管理员', '系统管理员角色');

-- 插入物种数据（50+ 物种）
INSERT INTO `species` (`name`, `scientific_name`, `category`, `can_release`, `description`, `merit_value`) VALUES
('鲫鱼', 'Carassius auratus', '鱼', 1, '常见的淡水鱼，适应性强', 10),
('鲤鱼', 'Cyprinus carpio', '鱼', 1, '吉祥如意的象征', 10),
('草鱼', 'Ctenopharyngodon idella', '鱼', 1, '草食性鱼类', 12),
('青鱼', 'Mylopharyngodon piceus', '鱼', 1, '肉食性淡水鱼', 12),
('鲢鱼', 'Hypophthalmichthys molitrix', '鱼', 1, '滤食性鱼类', 10),
('鳙鱼', 'Hypophthalmichthys nobilis', '鱼', 1, '俗称胖头鱼', 10),
('泥鳅', 'Misgurnus anguillicaudatus', '鱼', 1, '生命力顽强', 8),
('黄鳝', 'Monopterus albus', '鱼', 1, '滋补佳品', 15),
('乌龟', 'Chinemys reevesii', '其他', 1, '长寿象征', 20),
('鳖', 'Pelodiscus sinensis', '其他', 1, '俗称甲鱼', 20),
('青蛙', 'Rana nigromaculata', '其他', 1, '农田卫士', 15),
('蟾蜍', 'Bufo gargarizans', '其他', 1, '俗称癞蛤蟆', 10),
('麻雀', 'Passer montanus', '鸟', 0, '三有保护动物，禁止私自放生', 0),
('喜鹊', 'Pica pica', '鸟', 0, '三有保护动物', 0),
('斑鸠', 'Streptopelia chinensis', '鸟', 0, '三有保护动物', 0),
('鸽子', 'Columba livia', '鸟', 0, '需专业机构放生', 0),
('蜗牛', 'Achatina fulica', '昆虫', 0, '外来入侵物种，禁止放生', 0),
('巴西龟', 'Trachemys scripta elegans', '其他', 0, '外来入侵物种，禁止放生', 0),
('鳄雀鳝', 'Atractosteus spatula', '鱼', 0, '外来入侵物种，严禁放生', 0),
('清道夫', 'Pterygoplichthys pardalis', '鱼', 0, '外来入侵物种', 0),
('罗非鱼', 'Oreochromis mossambicus', '鱼', 0, '外来物种，谨慎放生', 0),
('鲶鱼', 'Silurus asotus', '鱼', 1, '肉食性鱼类', 15),
('黑鱼', 'Channa argus', '鱼', 0, '凶猛肉食性，谨慎放生', 0),
('鳜鱼', 'Siniperca chuatsi', '鱼', 1, '名贵淡水鱼', 18),
('鳊鱼', 'Parabramis pekinensis', '鱼', 1, '草食性鱼类', 10),
('鲮鱼', 'Cirrhinus molitorella', '鱼', 1, '南方常见鱼类', 10),
('鳙鲢', 'Aristichthys nobilis', '鱼', 1, '大型淡水鱼', 15),
('河蚌', 'Anodonta woodiana', '其他', 1, '水质净化者', 8),
('螺蛳', 'Bellamya aeruginosa', '其他', 1, '水质指示生物', 5),
('虾', 'Macrobrachium nipponense', '其他', 1, '河虾', 8),
('蟹', 'Eriocheir sinensis', '其他', 1, '中华绒螯蟹', 15),
('黄颡鱼', 'Pelteobagrus fulvidraco', '鱼', 1, '俗称黄辣丁', 12),
('鳑鲏', 'Rhodeus sericeus', '鱼', 1, '小型观赏鱼', 8),
('麦穗鱼', 'Pseudorasbora parva', '鱼', 1, '常见小型鱼', 5),
('餐条鱼', 'Hemiculter leucisculus', '鱼', 1, '上层鱼类', 5),
('马口鱼', 'Opsariichthys bidens', '鱼', 1, '溪流鱼类', 10),
('宽鳍鱲', 'Zacco platypus', '鱼', 1, '色彩艳丽', 10),
('唇鱼', 'Acrossocheilus labiatus', '鱼', 1, '溪流鱼类', 10),
('光唇鱼', 'Acrossocheilus fasciatus', '鱼', 1, '俗称石斑鱼', 12),
('中华鳑鲏', 'Rhodeus sinensis', '鱼', 1, '中国特有种', 10),
('斗鱼', 'Macropodus opercularis', '鱼', 1, '生命力强', 8),
('食蚊鱼', 'Gambusia affinis', '鱼', 0, '外来物种', 0),
('孔雀鱼', 'Poecilia reticulata', '鱼', 0, '观赏鱼，禁止放生', 0),
('锦鲤', 'Cyprinus carpio haematopterus', '鱼', 1, '吉祥鱼', 15),
('金鱼', 'Carassius auratus auratus', '鱼', 0, '观赏鱼，生存能力弱', 0),
('热带鱼', 'Various', '鱼', 0, '不适合本地水域', 0),
('水蛭', 'Hirudo nipponia', '其他', 1, '药用价值', 10),
('蚯蚓', 'Lumbricus terrestris', '其他', 1, '土壤改良者', 5),
('蜻蜓', 'Anax junius', '昆虫', 1, '益虫', 8),
('蝴蝶', 'Papilio xuthus', '昆虫', 1, '美丽昆虫', 8),
('蜜蜂', 'Apis cerana', '昆虫', 1, '重要传粉者', 10),
('螳螂', 'Tenodera sinensis', '昆虫', 1, '捕食性益虫', 8);

-- 插入音频数据（9 首梵音）
INSERT INTO `audio` (`title`, `audio_url`, `duration`, `category`, `description`) VALUES
('放生仪轨', '/audio/fangsheng-yigui.mp3', 600, '放生仪轨', '完整的放生仪轨念诵'),
('南无阿弥陀佛', '/audio/namo-amituofo.mp3', 300, '佛号', '六字洪名'),
('大悲咒', '/audio/dabei-zhou.mp3', 420, '咒语', '观世音菩萨大悲咒'),
('心经', '/audio/xinjing.mp3', 180, '佛经', '般若波罗蜜多心经'),
('往生咒', '/audio/wangsheng-zhou.mp3', 240, '咒语', '拔一切业障根本得生净土陀罗尼'),
('六字大明咒', '/audio/liuzi-damingzhou.mp3', 300, '咒语', '唵嘛呢叭咪吽'),
('药师咒', '/audio/yaoshi-zhou.mp3', 360, '咒语', '药师琉璃光如来咒'),
('地藏菩萨本愿经', '/audio/dizang-jing.mp3', 1800, '佛经', '节选片段'),
('观音菩萨圣号', '/audio/guanyin-shenghao.mp3', 300, '佛号', '南无观世音菩萨');

-- 插入禅理数据（部分示例，实际应 300+ 条）
INSERT INTO `zen_quote` (`content`, `source`, `category`) VALUES
('一切有为法，如梦幻泡影，如露亦如电，应作如是观。', '金刚经', '般若'),
('色不异空，空不异色，色即是空，空即是色。', '心经', '般若'),
('应无所住而生其心。', '金刚经', '修行'),
('菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。', '六祖坛经', '禅宗'),
('诸行无常，诸法无我，涅槃寂静。', '法句经', '三法印'),
('一花一世界，一叶一菩提。', '华严经', '境界'),
('苦海无边，回头是岸。', '禅宗公案', '觉悟'),
('放下屠刀，立地成佛。', '涅槃经', '忏悔'),
('众生皆具如来智慧德相，只因妄想执着而不能证得。', '华严经', '佛性'),
('应生无所住心。', '金刚经', '修行'),
('凡所有相，皆是虚妄。', '金刚经', '般若'),
('知一切法无我，得成于忍。', '金刚经', '修行'),
('过去心不可得，现在心不可得，未来心不可得。', '金刚经', '般若'),
('若以色见我，以音声求我，是人行邪道，不能见如来。', '金刚经', '正见'),
('一切众生皆有如来智慧德相。', '华严经', '佛性'),
('心无挂碍，无挂碍故，无有恐怖。', '心经', '自在'),
('色即是空，使人生起智慧；空即是色，使人生起慈悲。', '心经', '悲智'),
('缘起性空。', '中论', '中观'),
('诸法因缘生，诸法因缘灭。', '阿含经', '缘起'),
('慈悲喜舍。', '阿含经', '四无量心'),
('护生者，护心也。', '高僧开示', '护生'),
('放生放的是慈悲心。', '高僧开示', '护生'),
('救人一命，胜造七级浮屠。', '增广贤文', '功德'),
('勿以善小而不为，勿以恶小而为之。', '三国志', '修行'),
('诸恶莫作，众善奉行。', '法句经', '修行'),
('自净其意，是诸佛教。', '法句经', '修行'),
('一念慈悲，即是菩萨。', '禅宗语录', '慈悲'),
('日日是好日。', '禅宗公案', '心境'),
('平常心是道。', '禅宗语录', '修行'),
('活在当下。', '禅宗语录', '正念');

-- 插入示例组织数据
INSERT INTO `organization` (`name`, `type`, `contact_person`, `contact_phone`, `address`) VALUES
('护生志愿者协会', '志愿者组织', '张师兄', '13800138001', '北京市海淀区'),
('佛教放生团', '宗教团体', '李师兄', '13800138002', '上海市浦东新区'),
('动物保护联盟', '公益组织', '王师兄', '13800138003', '广州市天河区');
