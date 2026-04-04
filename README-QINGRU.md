# 清如·护生池 - 后端服务

## 项目简介

清如·护生池是一个基于佛教护生理念的微信小程序后端服务，提供：
- 微信登录认证
- 护生物种查询
- 投放记录管理
- 功德系统
- 佛历查询
- 内容安全审核

## 技术栈

- **框架**: RuoYi-Vue 3.9.2
- **JDK**: 17
- **Spring Boot**: 4.0.3
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **微信 SDK**: WxJava 4.6.0
- **佛历库**: lunar-javascript

## 快速开始

### 1. 环境准备

```bash
# 安装 JDK 17
# 安装 MySQL 8.0
# 安装 Redis
# 安装 Node.js (用于佛历查询)
```

### 2. 配置环境变量

```bash
export WX_MINIAPP_SECRET=your_wechat_secret
export DB_PASSWORD=your_db_password
```

### 3. 数据库初始化

```bash
mysql -u root -p < docs/database-init.sql
```

### 4. 修改配置

编辑 `ruoyi-admin/src/main/resources/application.yml`:
- 修改数据库连接信息
- 修改 Redis 配置
- 修改微信小程序 appid 和 secret

### 5. 启动服务

```bash
cd ruoyi-admin
mvn spring-boot:run
```

### 6. 安装 Node.js 依赖

```bash
npm install
```

## 项目结构

```
backend/
├── ruoyi-admin/              # 主应用模块
│   └── src/main/java/com/ruoyi/
│       └── qingru/           # 清如业务模块
│           ├── config/       # 配置类
│           ├── controller/   # 控制器
│           ├── entity/       # 实体类
│           ├── mapper/       # 数据访问层
│           ├── service/      # 业务逻辑层
│           └── utils/        # 工具类
├── scripts/                  # Node.js 脚本
│   └── lunar.js             # 佛历查询脚本
├── docs/                     # 文档
│   ├── database-init.sql    # 数据库初始化脚本
│   ├── study-notes/         # 学习笔记
│   └── progress/            # 进度报告
└── pom.xml                   # Maven 配置
```

## API 接口

### 用户登录
```http
POST /user/login
Content-Type: application/json

{
  "code": "wx_login_code"
}
```

### 内容安全审核
```java
@Autowired
private SecurityCheckService securityCheckService;

// 图片审核
boolean passed = securityCheckService.checkImage(filePath);

// 文本审核
boolean passed = securityCheckService.checkText(content);
```

### 佛历查询
```java
// 获取今日佛历
LunarInfo today = LunarUtil.getTodayLunar();

// 判断是否宜护生
boolean suitable = LunarUtil.isSuitableForProtectToday();
```

## 数据库表

| 表名 | 说明 |
|------|------|
| user | 用户表 |
| sys_role | 角色表 |
| organization | 组织表 |
| species | 物种表 |
| release_record | 投放记录表 |
| audio | 音频表 |
| zen_quote | 禅理表 |
| merit_record | 功德记录表 |
| daily_checkin | 每日签到表 |
| notification | 通知表 |

## 开发规范

1. 所有业务代码放在 `com.ruoyi.qingru` 包下
2. 遵循 RuoYi 框架的代码规范
3. 使用 Lombok 简化代码
4. 统一使用 `R<T>` 作为返回结果
5. 敏感信息使用环境变量配置

## 参考资料

- [RuoYi-Vue 官方文档](http://doc.ruoyi.vip/ruoyi-vue/)
- [WxJava GitHub](https://github.com/Wechat-Group/WxJava)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## License

MIT License
