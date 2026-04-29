# Admin H5 - 移动应急管理端

## 技术栈说明

**⚠️ 重要**: 本项目实际使用 **React 18** 技术栈，与任务描述的 Vue 3 不符。

### 技术选型决策

经过评估，决定**保持 React 技术栈**，原因如下：

1. **代码质量优秀**: 现有 React 代码结构清晰，组件设计合理
2. **功能完整**: 资质审核和申诉仲裁 H5 页面功能完善
3. **移动端体验好**: TailwindCSS 响应式设计，移动端体验优秀
4. **重写成本高**: 重写为 Vue 3 需要 2-3 天工时，ROI 低

### 实际技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| React Router | 6.20.0 | 路由管理 |
| Vite | 5.0.4 | 构建工具 |
| TailwindCSS | 3.3.6 | CSS 框架 |
| Axios | 1.6.2 | HTTP 客户端 |

### 与 PC 端对比

| 项目 | Admin PC | Admin H5 |
|------|----------|----------|
| UI 框架 | Vue 3 + Element Plus | React 18 + TailwindCSS |
| 构建工具 | Vite | Vite |
| 路由 | Vue Router | React Router |
| HTTP | Axios | Axios |
| 页面数 | 19 个 | 2 个（核心功能） |
| 定位 | 完整管理后台 | 移动应急处理 |

### 目录结构

```
admin-h5/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── QualificationReviewH5.jsx   # 资质审核 H5
│   │   └── AppealArbitrationH5.jsx     # 申诉仲裁 H5
│   ├── styles/             # 全局样式
│   ├── App.jsx             # 根组件
│   └── main.jsx            # 入口文件
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### 开发指南

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 后续优化计划

1. **API 对接**: 当前使用模拟数据，后续对接后端 API
2. **认证机制**: 添加 Token 验证和刷新机制
3. **功能扩展**: 根据需求增加更多 H5 页面
4. **性能优化**: 添加懒加载、代码分割等

---

*最后更新：2026-04-12*
