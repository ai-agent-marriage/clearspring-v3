# RuoYi-Vue 管理后台框架学习笔记

## 1. 项目概览

**项目名称**: RuoYi-Vue (若依管理系统)  
**GitHub 地址**: https://github.com/yangzongzhuan/RuoYi-Vue  
**Gitee 地址**: https://gitee.com/y_project/RuoYi-Vue  
**开源协议**: MIT  
**Stars**: 30000+ (超热门开源项目)  
**官方文档**: http://doc.ruoyi.vip  
**演示地址**: http://vue.ruoyi.vip

### 技术栈

**后端**:
- Spring Boot 2.x/3.x/4.x (多版本支持)
- Spring Security (安全框架)
- JWT (Token 认证)
- Redis (缓存)
- MyBatis / MyBatis-Plus (ORM)
- MySQL / PostgreSQL (数据库)
- Druid (数据库连接池)

**前端**:
- Vue 2.x / Vue 3.x (多版本支持)
- Element UI / Element Plus
- Vuex / Pinia (状态管理)
- Vue Router (路由)
- Axios (HTTP 请求)

### 核心功能模块

| 模块 | 功能说明 |
|-----|---------|
| 用户管理 | 系统用户配置、账号管理 |
| 部门管理 | 组织机构树形结构、数据权限 |
| 岗位管理 | 用户所属职务配置 |
| 菜单管理 | 系统菜单、操作权限、按钮权限 |
| 角色管理 | 角色权限分配、数据范围权限 |
| 字典管理 | 系统常用固定数据维护 |
| 参数管理 | 系统动态配置参数 |
| 通知公告 | 系统通知公告发布维护 |
| 操作日志 | 系统操作日志记录查询 |
| 登录日志 | 登录日志记录查询 |
| 在线用户 | 活跃用户状态监控 |
| 定时任务 | 任务调度、执行结果日志 |
| 代码生成 | 前后端代码一键生成 |
| 系统接口 | 自动生成 API 接口文档 |
| 服务监控 | CPU、内存、磁盘、JVM 监控 |
| 缓存监控 | 缓存信息查询、命令统计 |

### 项目版本

| 分支 | Spring Boot 版本 | JDK 要求 | 说明 |
|-----|----------------|---------|------|
| master | 4.x | JDK 17+ | 默认分支，最新 |
| springboot3 | 3.x | JDK 17+ | 稳定版本 |
| springboot2 | 2.x | JDK 8+ | 经典版本 |

---

## 2. 安装配置步骤

### 2.1 环境准备

```bash
# 必需环境
- JDK 17+ (master 分支) 或 JDK 8+ (springboot2 分支)
- Maven 3.6+
- MySQL 5.7+ / 8.0+
- Redis 6.0+
- Node.js 14+ (前端)
```

### 2.2 后端项目克隆与配置

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue.git
cd RuoYi-Vue

# 查看项目结构
ruoyi/
├── ruoyi-admin          # 启动入口
├── ruoyi-common         # 通用模块
├── ruoyi-framework      # 框架核心
├── ruoyi-system         # 系统模块
└── pom.xml              # 父 POM
```

### 2.3 数据库配置

```sql
-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS ry DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2. 导入表结构
-- 执行 ry_20260404.sql (表结构)
-- 执行 ry_vx_xxx.sql (业务表，如有)

-- 3. 导入初始数据
-- 包含默认管理员账号：admin/admin123
```

### 2.4 后端配置文件 (application-druid.yml)

```yaml
# 数据源配置
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driverClassName: com.mysql.cj.jdbc.Driver
    druid:
      # 主库数据源
      master:
        url: jdbc:mysql://localhost:3306/ry?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
        username: root
        password: your-password
      # 从库数据源 (可选)
      slave:
        enabled: false
        url: jdbc:mysql://localhost:3306/ry_slave?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
        username: root
        password: your-password
      
      # 初始连接数
      initialSize: 5
      # 最小连接池数量
      minIdle: 10
      # 最大连接池数量
      maxActive: 20
      # 配置获取连接等待超时的时间
      maxWait: 60000
      # 配置连接超时时间
      connectTimeout: 10000
      # 配置网络超时时间
      socketTimeout: 60000
      # 配置间隔多久才进行一次检测
      timeBetweenEvictionRunsMillis: 60000
      # 配置一个连接在池中最小生存的时间
      minEvictableIdleTimeMillis: 300000
      # 配置一个连接在池中最大生存的时间
      maxEvictableIdleTimeMillis: 900000
      # 配置检测连接是否有效
      validationQuery: SELECT 1
      testWhileIdle: true
      testOnBorrow: false
      testOnReturn: false
      
      # 开启 P6Spy 输出 SQL (开发环境)
      p6spy: true
      
      # Web 监控
      webStatFilter:
        enabled: true
        urlPatterns: /*
        exclusions: "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*"
      
      # Stat 监控
      statViewServlet:
        enabled: true
        urlPattern: /druid/*
        loginUsername: admin
        loginPassword: admin123
        allow: 127.0.0.1
        deny:
      
      # Wall 防火墙
      wall:
        enabled: true
        config:
          dropTableAllow: false
          multiStatementAllow: true

# Redis 配置
spring:
  redis:
    host: localhost
    port: 6379
    password: your-redis-password
    database: 0
    timeout: 10s
    lettuce:
      pool:
        min-idle: 0
        max-idle: 8
        max-active: 8
        max-wait: -1ms

# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /

# 日志配置
logging:
  level:
    com.ruoyi: debug
    org.springframework: warn
  pattern:
    console: '%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n'
```

### 2.5 前端项目配置

```bash
# 进入前端目录
cd ruoyi-ui

# 安装依赖
npm install --registry=https://registry.npmmirror.com

# 启动开发服务器
npm run dev

# 访问 http://localhost:80
```

### 2.6 前端环境变量 (.env.development)

```bash
# 开发环境
NODE_ENV = development

# 开发服务器端口
VUE_APP_PORT = 80

# 后端 API 地址
VUE_APP_BASE_API = 'http://localhost:8080'

# URL 前缀
VUE_APP_BASE_API_PATH = '/dev-api'

# 代理配置 (vue.config.js)
proxy: {
  '/dev-api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/dev-api': ''
    }
  }
}
```

---

## 3. 项目结构解析

### 3.1 后端目录结构

```
ruoyi/
├── ruoyi-admin                 # 启动入口
│   └── src/main/java
│       └── com/ruoyi
│           └── RuoYiApplication.java
│
├── ruoyi-common                # 通用模块
│   └── src/main/java
│       └── com/ruoyi/common
│           ├── annotation/     # 自定义注解
│           ├── config/         # 全局配置
│           ├── constant/       # 常量定义
│           ├── core/           # 核心类
│           ├── enums/          # 枚举
│           ├── exception/      # 异常处理
│           ├── text/           # 文本处理
│           └── utils/          # 工具类
│
├── ruoyi-framework             # 框架核心
│   └── src/main/java
│       └── com/ruoyi/framework
│           ├── aspectj/        # AOP 切面
│           ├── config/         # 框架配置
│           ├── datasource/     # 多数据源
│           ├── interceptor/    # 拦截器
│           ├── manager/        # 异步管理器
│           ├── security/       # 安全认证
│           └── web/            # Web 配置
│
├── ruoyi-system                # 系统模块
│   └── src/main/java
│       └── com/ruoyi/system
│           ├── domain/         # 实体类
│           ├── mapper/         # DAO 层
│           ├── service/        # 业务层
│           └── controller/     # 控制器
│
└── pom.xml                     # 父 POM
```

### 3.2 前端目录结构

```
ruoyi-ui/
├── public/                     # 静态资源
├── src/
│   ├── api/                    # API 接口
│   │   ├── system/            # 系统模块 API
│   │   └── tools/             # 工具模块 API
│   │
│   ├── assets/                 # 静态资源
│   │   ├── images/
│   │   ├── styles/
│   │   └── svg/
│   │
│   ├── components/             # 公共组件
│   │   ├── Breadcrumb/        # 面包屑
│   │   ├── Crumb/             # 自定义面包屑
│   │   ├── Dict/              # 字典组件
│   │   ├── Editor/            # 富文本编辑器
│   │   ├── FileUpload/        # 文件上传
│   │   ├── Hamburger/         # 侧边栏折叠
│   │   ├── HeaderSearch/      # 头部搜索
│   │   ├── IconSelect/        # 图标选择
│   │   ├── ImagePreview/      # 图片预览
│   │   ├── ImageUpload/       # 图片上传
│   │   ├── Pagination/        # 分页组件
│   │   ├── RightPanel/        # 右侧面板
│   │   ├── RightToolbar/      # 右侧工具栏
│   │   ├── RuoYi/             # 若依组件
│   │   ├── Screenfull/        # 全屏
│   │   ├── SizeSelect/        # 尺寸选择
│   │   ├── SvgIcon/           # SVG 图标
│   │   └── TopNav/            # 顶部导航
│   │
│   ├── directive/              # 自定义指令
│   │   ├── common/            # 通用指令
│   │   └── permission/        # 权限指令
│   │
│   ├── layout/                 # 布局组件
│   │   ├── components/        # 布局子组件
│   │   └── index.vue          # 布局入口
│   │
│   ├── plugins/                # 插件
│   │   ├── auth.js            # 认证插件
│   │   ├── cache.js           # 缓存插件
│   │   ├── download.js        # 下载插件
│   │   ├── modal.js           # 消息提示
│   │   └── tab.js             # 标签页
│   │
│   ├── router/                 # 路由配置
│   │   ├── index.js           # 路由入口
│   │   └── constant.js        # 常量路由
│   │
│   ├── store/                  # 状态管理
│   │   ├── modules/           # 模块
│   │   │   ├── app.js         # 应用配置
│   │   │   ├── dict.js        # 字典
│   │   │   ├── permission.js  # 权限
│   │   │   ├── settings.js    # 设置
│   │   │   ├── tagsView.js    # 标签页
│   │   │   └── user.js        # 用户
│   │   └── index.js           # Store 入口
│   │
│   ├── utils/                  # 工具函数
│   │   ├── auth.js            # 认证工具
│   │   ├── dict.js            # 字典工具
│   │   ├── dynamicTitle.js    # 动态标题
│   │   ├── errorCode.js       # 错误码
│   │   ├── index.js           # 通用工具
│   │   ├── jsencrypt.js       # RSA 加密
│   │   ├── permission.js      # 权限工具
│   │   ├── request.js         # Axios 封装
│   │   ├── ruoyi.js           # 若依工具
│   │   ├── scroll-to.js       # 滚动
│   │   └── validate.js        # 验证
│   │
│   ├── views/                  # 页面组件
│   │   ├── system/            # 系统管理页面
│   │   ├── tool/              # 系统工具页面
│   │   ├── redirect/          # 重定向
│   │   ├── error/             # 错误页面
│   │   └── login.vue          # 登录页
│   │
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 入口文件
│   └── permission.js           # 路由守卫
│
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── vue.config.js               # Vue 配置
└── package.json
```

---

## 4. RBAC 权限配置

### 4.1 权限模型

RuoYi 采用 **RBAC (Role-Based Access Control)** 权限模型：

```
用户 (User) → 角色 (Role) → 菜单/权限 (Menu/Permission)
```

### 4.2 数据库表结构

```sql
-- 用户表
sys_user (
  user_id,        -- 用户 ID
  dept_id,        -- 部门 ID
  user_name,      -- 用户名
  nick_name,      -- 昵称
  user_type,      -- 用户类型 (00=系统用户)
  email,          -- 邮箱
  phonenumber,    -- 手机号
  sex,            -- 性别
  avatar,         -- 头像
  password,       -- 密码
  status,         -- 状态 (0=正常，1=停用)
  del_flag,       -- 删除标志 (0=正常，1=删除)
  login_ip,       -- 最后登录 IP
  login_date,     -- 最后登录时间
  create_by,      -- 创建者
  create_time,    -- 创建时间
  update_by,      -- 更新者
  update_time     -- 更新时间
)

-- 角色表
sys_role (
  role_id,        -- 角色 ID
  role_name,      -- 角色名称
  role_key,       -- 角色权限字符串
  role_sort,      -- 显示顺序
  data_scope,     -- 数据范围 (1=全部，2=自定义，3=本部门，4=本部门及以下，5=仅本人)
  status,         -- 角色状态
  del_flag,       -- 删除标志
  create_by,      -- 创建者
  create_time,    -- 创建时间
  update_by,      -- 更新者
  update_time     -- 更新时间
)

-- 菜单表
sys_menu (
  menu_id,        -- 菜单 ID
  menu_name,      -- 菜单名称
  parent_id,      -- 父菜单 ID
  order_num,      -- 显示顺序
  path,           -- 路由地址
  component,      -- 组件路径
  query,          -- 路由参数
  is_frame,       -- 是否外链 (1=是，0=否)
  is_cache,       -- 是否缓存 (1=缓存，0=不缓存)
  menu_type,      -- 菜单类型 (M=目录，C=菜单，F=按钮)
  visible,        -- 显示状态 (0=显示，1=隐藏)
  status,         -- 菜单状态 (0=正常，1=停用)
  perms,          -- 权限标识 (如 system:user:list)
  icon,           -- 菜单图标
  create_by,      -- 创建者
  create_time,    -- 创建时间
  update_by,      -- 更新者
  update_time     -- 更新时间
)

-- 用户角色关联表
sys_user_role (
  user_id,
  role_id
)

-- 角色菜单关联表
sys_role_menu (
  role_id,
  menu_id
)

-- 部门表
sys_dept (
  dept_id,        -- 部门 ID
  parent_id,      -- 父部门 ID
  ancestors,      -- 祖级列表
  dept_name,      -- 部门名称
  order_num,      -- 显示顺序
  leader,         -- 负责人
  phone,          -- 联系电话
  email,          -- 邮箱
  status,         -- 部门状态
  del_flag,       -- 删除标志
  create_by,      -- 创建者
  create_time,    -- 创建时间
  update_by,      -- 更新者
  update_time     -- 更新时间
)
```

### 4.3 权限注解使用

```java
// 系统模块 Controller 示例
@RestController
@RequestMapping("/system/user")
public class SysUserController extends BaseController {
    
    @Autowired
    private ISysUserService userService;
    
    /**
     * 查询用户列表
     * 权限标识：system:user:list
     */
    @PreAuthorize("@ss.hasPermi('system:user:list')")
    @GetMapping("/list")
    public TableDataInfo list(SysUser user) {
        startPage();
        List<SysUser> list = userService.selectUserList(user);
        return getDataTable(list);
    }
    
    /**
     * 查询用户详情
     * 权限标识：system:user:query
     */
    @PreAuthorize("@ss.hasPermi('system:user:query')")
    @GetMapping(value = "/{userId}")
    public AjaxResult getInfo(@PathVariable Long userId) {
        return AjaxResult.success(userService.selectUserById(userId));
    }
    
    /**
     * 新增用户
     * 权限标识：system:user:add
     */
    @PreAuthorize("@ss.hasPermi('system:user:add')")
    @PostMapping
    public AjaxResult add(@Validated @RequestBody SysUser user) {
        if (UserConstants.NOT_UNIQUE.equals(userService.checkUserNameUnique(user.getUserName()))) {
            return AjaxResult.error("新增用户'" + user.getUserName() + "'失败，账号已存在");
        }
        user.setCreateBy(getUsername());
        user.setPassword(SecurityUtils.encryptPassword(user.getPassword()));
        return toAjax(userService.insertUser(user));
    }
    
    /**
     * 修改用户
     * 权限标识：system:user:edit
     */
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody SysUser user) {
        userService.checkUserAllowed(user);
        userService.checkUserDataScope(user.getUserId());
        
        if (UserConstants.NOT_UNIQUE.equals(userService.checkUserNameUnique(user))) {
            return AjaxResult.error("修改用户'" + user.getUserName() + "'失败，账号已存在");
        }
        
        user.setUpdateBy(getUsername());
        return toAjax(userService.updateUser(user));
    }
    
    /**
     * 删除用户
     * 权限标识：system:user:remove
     */
    @PreAuthorize("@ss.hasPermi('system:user:remove')")
    @DeleteMapping("/{userIds}")
    public AjaxResult remove(@PathVariable Long[] userIds) {
        if (Arrays.asList(userIds).contains(getUserId())) {
            return AjaxResult.error("当前用户不能删除");
        }
        return toAjax(userService.deleteUserByIds(userIds));
    }
    
    /**
     * 重置密码
     * 权限标识：system:user:resetPwd
     */
    @PreAuthorize("@ss.hasPermi('system:user:resetPwd')")
    @PutMapping("/resetPwd")
    public AjaxResult resetPwd(@RequestBody SysUser user) {
        userService.checkUserAllowed(user);
        user.setPassword(SecurityUtils.encryptPassword(user.getPassword()));
        return toAjax(userService.resetUserPwd(user));
    }
}
```

### 4.4 数据权限配置

```java
// 数据权限注解
@DataSource(DataSourceType.MASTER)
@Component
public class DeptMapper {
    
    /**
     * 查询部门列表 (带数据权限)
     * @param dept 部门信息
     * @param params 数据权限参数
     * @return 部门列表
     */
    List<SysDept> selectDeptList(SysDept dept, @Param("params") Map<String, Object> params);
}
```

```xml
<!-- MyBatis XML 配置 -->
<mapper namespace="com.ruoyi.system.mapper.DeptMapper">
    
    <select id="selectDeptList" resultMap="SysDeptResult">
        select d.*
        from sys_dept d
        left join sys_role r on r.role_id = #{params.roleId}
        where d.del_flag = '0'
        <!-- 数据权限过滤 -->
        <if test="params.dataScope != null and params.dataScope != ''">
            and ${params.dataScope}
        </if>
        order by d.parent_id, d.order_num
    </select>
    
</mapper>
```

```java
// 数据权限处理工具类
public class DataScope {
    
    // 数据范围
    private String scopeName;
    
    // 部门别名
    private String deptAlias;
    
    // 用户别名
    private String userAlias;
    
    public DataScope() {
        this.scopeName = "";
        this.deptAlias = "d";
        this.userAlias = "u";
    }
    
    public DataScope(String scopeName) {
        this.scopeName = scopeName;
        this.deptAlias = "d";
        this.userAlias = "u";
    }
    
    public DataScope(String deptAlias, String userAlias) {
        this.scopeName = "";
        this.deptAlias = deptAlias;
        this.userAlias = userAlias;
    }
    
    // Getters and Setters...
}
```

### 4.5 前端权限控制

```javascript
// 权限指令 (v-hasPermi)
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const allPermission = '*:*:*'
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      const hasPermissions = permissions.some(permission => {
        return allPermission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('请设置操作权限标签值')
    }
  }
}

// 使用示例
<template>
  <div>
    <!-- 按钮权限 -->
    <el-button
      v-hasPermi="['system:user:add']"
      @click="handleAdd"
    >新增</el-button>
    
    <el-button
      v-hasPermi="['system:user:edit']"
      @click="handleUpdate"
    >修改</el-button>
    
    <el-button
      v-hasPermi="['system:user:remove']"
      @click="handleDelete"
    >删除</el-button>
    
    <!-- 多个权限满足一个即可 -->
    <el-button
      v-hasPermiOr="['system:user:add', 'system:user:edit']"
      @click="handleAddOrEdit"
    >新增或修改</el-button>
  </div>
</template>
```

---

## 5. 代码生成器使用

### 5.1 使用步骤

1. **导入数据库表**
   - 系统工具 → 代码生成 → 导入
   - 选择数据库中的表

2. **编辑生成配置**
   - 基本信息：生成包路径、作者、模块名等
   - 字段信息：设置字段类型、是否必填、是否显示等

3. **生成代码**
   - 选择生成模板 (单表、树表、主子表)
   - 下载生成的代码

4. **导入项目**
   - 解压代码到对应目录
   - 重新编译运行

### 5.2 生成配置示例

```yaml
# 生成配置
packageName: com.ruoyi               # 包名
moduleName: business                 # 模块名
businessName: order                  # 业务名
functionName: 订单管理               # 功能名
functionAuthor: 张三                 # 作者
genType: 1                          # 生成类型 (1=zip, 2=自定义路径)
genPath: /tmp                       # 生成路径

# 表信息
tableName: business_order           # 表名
tableComment: 订单表                # 表注释
className: BusinessOrder            # 类名
tplCategory: crud                   # 模板类型 (crud=增删改查，tree=树，sub=主子表)
tplWebType: element-ui              # 前端类型 (element-ui=Element UI, element-plus=Element Plus)

# 字段配置
columns:
  - columnName: order_id
    columnComment: 订单 ID
    columnType: bigint
    javaType: Long
    javaField: orderId
    isPk: true
    isIncrement: true
    isRequired: false
    isInsert: false
    isEdit: false
    isList: false
    isQuery: false
    
  - columnName: order_no
    columnComment: 订单编号
    columnType: varchar
    javaType: String
    javaField: orderNo
    isPk: false
    isIncrement: false
    isRequired: true
    isInsert: true
    isEdit: false
    isList: true
    isQuery: true
    queryType: EQ
    
  - columnName: user_id
    columnComment: 用户 ID
    columnType: bigint
    javaType: Long
    javaField: userId
    isPk: false
    isIncrement: false
    isRequired: true
    isInsert: true
    isEdit: true
    isList: true
    isQuery: false
    
  - columnName: amount
    columnComment: 订单金额
    columnType: decimal
    javaType: BigDecimal
    javaField: amount
    isPk: false
    isIncrement: false
    isRequired: true
    isInsert: true
    isEdit: true
    isList: true
    isQuery: false
    
  - columnName: status
    columnComment: 订单状态
    columnType: char
    javaType: String
    javaField: status
    isPk: false
    isIncrement: false
    isRequired: true
    isInsert: true
    isEdit: true
    isList: true
    isQuery: true
    queryType: EQ
    dictType: order_status
```

### 5.3 生成代码示例

```java
// 生成的 Entity
package com.ruoyi.business.domain;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.framework.aspectj.lang.annotation.Excel;
import com.ruoyi.framework.web.domain.BaseEntity;

/**
 * 订单对象 business_order
 * 
 * @author 张三
 * @date 2026-04-04
 */
public class BusinessOrder extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 订单 ID */
    private Long orderId;

    /** 订单编号 */
    @Excel(name = "订单编号")
    private String orderNo;

    /** 用户 ID */
    @Excel(name = "用户 ID")
    private Long userId;

    /** 订单金额 */
    @Excel(name = "订单金额")
    private BigDecimal amount;

    /** 订单状态 */
    @Excel(name = "订单状态")
    private String status;

    // Getters and Setters...
    
    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("orderId", getOrderId())
            .append("orderNo", getOrderNo())
            .append("userId", getUserId())
            .append("amount", getAmount())
            .append("status", getStatus())
            .toString();
    }
}
```

```java
// 生成的 Mapper
package com.ruoyi.business.mapper;

import java.util.List;
import com.ruoyi.business.domain.BusinessOrder;

/**
 * 订单 Mapper 接口
 * 
 * @author 张三
 * @date 2026-04-04
 */
public interface BusinessOrderMapper {
    /**
     * 查询订单
     * @param orderId 订单 ID
     * @return 订单
     */
    public BusinessOrder selectBusinessOrderById(Long orderId);

    /**
     * 查询订单列表
     * @param businessOrder 订单
     * @return 订单集合
     */
    public List<BusinessOrder> selectBusinessOrderList(BusinessOrder businessOrder);

    /**
     * 新增订单
     * @param businessOrder 订单
     * @return 结果
     */
    public int insertBusinessOrder(BusinessOrder businessOrder);

    /**
     * 修改订单
     * @param businessOrder 订单
     * @return 结果
     */
    public int updateBusinessOrder(BusinessOrder businessOrder);

    /**
     * 删除订单
     * @param orderId 订单 ID
     * @return 结果
     */
    public int deleteBusinessOrderById(Long orderId);

    /**
     * 批量删除订单
     * @param orderIds 需要删除的数据 ID
     * @return 结果
     */
    public int deleteBusinessOrderByIds(Long[] orderIds);
}
```

```java
// 生成的 Controller
package com.ruoyi.business.controller;

import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.framework.aspectj.lang.annotation.Log;
import com.ruoyi.framework.aspectj.lang.enums.BusinessType;
import com.ruoyi.business.domain.BusinessOrder;
import com.ruoyi.business.service.IBusinessOrderService;
import com.ruoyi.framework.web.controller.BaseController;
import com.ruoyi.framework.web.domain.AjaxResult;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.framework.web.page.TableDataInfo;

/**
 * 订单 Controller
 * 
 * @author 张三
 * @date 2026-04-04
 */
@RestController
@RequestMapping("/business/order")
public class BusinessOrderController extends BaseController {
    @Autowired
    private IBusinessOrderService businessOrderService;

    /**
     * 查询订单列表
     */
    @PreAuthorize("@ss.hasPermi('business:order:list')")
    @GetMapping("/list")
    public TableDataInfo list(BusinessOrder businessOrder) {
        startPage();
        List<BusinessOrder> list = businessOrderService.selectBusinessOrderList(businessOrder);
        return getDataTable(list);
    }

    /**
     * 导出订单列表
     */
    @PreAuthorize("@ss.hasPermi('business:order:export')")
    @Log(title = "订单", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, BusinessOrder businessOrder) {
        List<BusinessOrder> list = businessOrderService.selectBusinessOrderList(businessOrder);
        ExcelUtil<BusinessOrder> util = new ExcelUtil<BusinessOrder>(BusinessOrder.class);
        util.exportExcel(response, list, "订单数据");
    }

    /**
     * 获取订单详细信息
     */
    @PreAuthorize("@ss.hasPermi('business:order:query')")
    @GetMapping(value = "/{orderId}")
    public AjaxResult getInfo(@PathVariable("orderId") Long orderId) {
        return AjaxResult.success(businessOrderService.selectBusinessOrderById(orderId));
    }

    /**
     * 新增订单
     */
    @PreAuthorize("@ss.hasPermi('business:order:add')")
    @Log(title = "订单", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody BusinessOrder businessOrder) {
        return toAjax(businessOrderService.insertBusinessOrder(businessOrder));
    }

    /**
     * 修改订单
     */
    @PreAuthorize("@ss.hasPermi('business:order:edit')")
    @Log(title = "订单", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody BusinessOrder businessOrder) {
        return toAjax(businessOrderService.updateBusinessOrder(businessOrder));
    }

    /**
     * 删除订单
     */
    @PreAuthorize("@ss.hasPermi('business:order:remove')")
    @Log(title = "订单", businessType = BusinessType.DELETE)
	@DeleteMapping("/{orderIds}")
    public AjaxResult remove(@PathVariable Long[] orderIds) {
        return toAjax(businessOrderService.deleteBusinessOrderByIds(orderIds));
    }
}
```

---

## 6. 业务模块扩展方式

### 6.1 新增业务模块

```bash
# 1. 创建模块目录
mkdir -p ruoyi-business/src/main/java/com/ruoyi/business
cd ruoyi-business

# 2. 创建 pom.xml
```

```xml
<!-- ruoyi-business/pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ruoyi</artifactId>
        <groupId>com.ruoyi</groupId>
        <version>4.8.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>ruoyi-business</artifactId>

    <description>业务模块</description>

    <dependencies>
        <!-- 核心模块 -->
        <dependency>
            <groupId>com.ruoyi</groupId>
            <artifactId>ruoyi-core</artifactId>
        </dependency>
        
        <!-- 系统模块 -->
        <dependency>
            <groupId>com.ruoyi</groupId>
            <artifactId>ruoyi-system</artifactId>
        </dependency>
    </dependencies>
</project>
```

### 6.2 父 POM 添加模块

```xml
<!-- ruoyi/pom.xml -->
<modules>
    <module>ruoyi-admin</module>
    <module>ruoyi-common</module>
    <module>ruoyi-framework</module>
    <module>ruoyi-system</module>
    <!-- 新增业务模块 -->
    <module>ruoyi-business</module>
</modules>
```

### 6.3 启动类添加扫描

```java
// RuoYiApplication.java
@SpringBootApplication
public class RuoYiApplication {
    public static void main(String[] args) {
        SpringApplication.run(RuoYiApplication.class, args);
        System.out.println("(♥◠‿◠) ノ  若依管理系统启动成功   ლ(´ڡ`ლ)");
    }
}
```

---

## 7. 清如后台模块设计

### 7.1 推荐复用模块

1. **系统管理模块**: 直接使用用户、角色、菜单、部门管理
2. **代码生成器**: 快速生成业务模块代码
3. **定时任务**: 后台任务调度
4. **系统监控**: 服务监控、缓存监控、日志查询
5. **字典管理**: 系统参数配置

### 7.2 清如业务模块建议

```
ruoyi-qingru/                    # 清如业务模块
├── domain/                      # 实体类
│   ├── QingruUser.java         # 清如用户
│   ├── QingruContent.java      # 内容管理
│   ├── QingruComment.java      # 评论管理
│   └── QingruAudit.java        # 审核管理
│
├── mapper/                      # DAO 层
│   ├── QingruUserMapper.java
│   ├── QingruContentMapper.java
│   └── ...
│
├── service/                     # 业务层
│   ├── impl/
│   │   ├── QingruUserServiceImpl.java
│   │   └── ...
│   └── IQingruUserService.java
│
└── controller/                  # 控制器
    ├── QingruUserController.java
    └── ...
```

### 7.3 集成步骤

1. 克隆 RuoYi-Vue 项目
2. 修改数据库配置连接清如数据库
3. 使用代码生成器生成清如业务表代码
4. 根据需求修改生成的代码
5. 前端复制 ruoyi-ui 并修改配置
6. 添加清如业务菜单和权限

---

## 8. 踩坑记录

### 8.1 常见问题及解决方案

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 登录 401 | Token 过期或无效 | 清除浏览器缓存，重新登录 |
| 菜单不显示 | 权限未配置 | 检查角色菜单关联，刷新权限 |
| 代码生成报错 | 表注释或字段注释缺失 | 补充表注释和字段注释 |
| 多数据源切换失败 | 注解未生效 | 检查@DataSource 注解位置 |
| 文件上传失败 | 路径权限问题 | 检查上传目录权限配置 |
| Redis 连接失败 | 配置错误 | 检查 Redis 地址、密码、端口 |
| 跨域问题 | 前端代理配置错误 | 检查 vue.config.js 代理配置 |

### 8.2 性能优化建议

1. **Redis 缓存**: 字典、配置等数据使用 Redis 缓存
2. **SQL 优化**: 使用@DataSource 读写分离
3. **异步处理**: 日志记录使用异步
4. **分页查询**: 列表查询必须分页
5. **前端优化**: 开启 Gzip，使用 CDN

---

## 参考资源

- **官方文档**: http://doc.ruoyi.vip
- **演示地址**: http://vue.ruoyi.vip (admin/admin123)
- **GitHub**: https://github.com/yangzongzhuan/RuoYi-Vue
- **Gitee**: https://gitee.com/y_project/RuoYi-Vue
- **技术社区**: http://ruoyi.vip

---

*笔记创建时间：2026-04-04*  
*RuoYi-Vue 版本：4.8.0*
