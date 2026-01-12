# 项目上下文

## 项目目的
WinLink Migrator 是一个 Windows 实用工具仪表盘，旨在帮助用户将应用程序数据从系统盘（C盘）迁移到其他分区，并通过创建符号链接（Symbolic Links / Junctions）保持原有路径的访问性。项目集成 Google Gemini AI，用于评估迁移操作的安全性。

## 技术栈
- 前端: React 18, TypeScript, Tailwind CSS
- 构建工具: Vite 5.2.0
- 测试框架: Vitest, @testing-library/react
- 代码质量: ESLint, Prettier
- 样式: Tailwind CSS 3.4.3, PostCSS, Autoprefixer
- AI 服务: Google GenAI SDK (@google/genai - Gemini 1.5)
- 构建/运行环境: 浏览器 (当前), 目标为 Tauri

## 项目约定

### 代码风格
- TypeScript 严格类型检查
- ESLint 和 Prettier 代码格式化
- 生成代码的函数级注释
- 文件头部注释包含文件名、版本和更新日期

### 架构模式
- React 组件化架构
- 外部集成的服务导向设计
- 使用 Context API 进行状态管理（可扩展到 Zustand/Redux）
- 基于功能的模块化目录结构

### 测试策略
- 核心功能的单元测试
- 迁移工作流的集成测试
- 关键用户旅程的端到端测试
- 测试覆盖率目标: 80%

### Git 工作流
- 主分支用于稳定发布
- 开发分支用于持续开发
- 特性分支用于新功能
- 修复分支用于 bug 修复
- 语义化提交消息: <类型>: <描述>

## 领域上下文
- Windows 文件系统操作 (robocopy, mklink)
- 符号链接和 Junction
- 磁盘空间管理
- AI 辅助安全分析
- 应用程序数据迁移

## 重要约束
- 创建 Junction 需要管理员权限
- 受限于 Windows 文件系统权限
- AI 分析需要网络连接
- 大型文件迁移的性能考虑

## 外部依赖
- Google Gemini AI API 用于安全分析
- Windows 命令提示符用于文件操作
- Tauri 用于原生功能

## 项目结构

### 目录结构
```
WinLink/
├── src/
│   ├── components/          # React 组件
│   │   ├── AppCard.tsx      # 应用卡片组件
│   │   └── TerminalLog.tsx  # 终端日志组件
│   ├── constants/           # 常量定义
│   ├── services/            # 服务层
│   │   ├── analysisHistoryService.ts  # 分析历史服务
│   │   ├── diskScanService.ts         # 磁盘扫描服务
│   │   ├── diskService.ts             # 磁盘服务
│   │   ├── geminiService.ts           # Gemini AI 服务
│   │   ├── logService.ts              # 日志服务
│   │   ├── migrationService.ts        # 迁移服务
│   │   └── themeService.ts            # 主题服务
│   ├── styles/              # 样式文件
│   ├── translations/        # 国际化文件
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 主应用组件
│   ├── index.tsx            # 应用入口
│   └── translations.ts      # 国际化配置
├── openspec/                # 项目规范/文档
├── public/                  # 静态资源
├── tests/                   # 测试文件
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── tailwind.config.js       # Tailwind 配置
```

## 核心功能

### 1. 磁盘管理
- 扫描系统中的磁盘和分区
- 显示磁盘空间使用情况
- 选择源磁盘和目标磁盘

### 2. 应用程序管理
- 扫描选定磁盘上的应用程序
- 显示应用程序名称、大小、路径等信息
- 按名称、大小、状态、路径排序应用程序
- 搜索和过滤应用程序

### 3. 安全分析
- 集成 Google Gemini AI 分析应用程序安全性
- 评估迁移操作的风险级别
- 生成安全评分和建议

### 4. 应用程序迁移
- 支持单个或批量迁移应用程序
- 配置迁移选项（覆盖现有文件、创建备份、验证移动后的数据、并行执行）
- 显示迁移进度和状态
- 支持取消和回滚迁移操作

### 5. 用户界面
- 支持中文和英文国际化
- 支持浅色、深色和系统主题
- 响应式设计，适配不同屏幕尺寸
- 终端日志显示操作过程

### 6. 服务层
- diskService: 磁盘和应用程序扫描
- geminiService: AI 安全分析
- migrationService: 应用程序迁移
- themeService: 主题管理
- logService: 日志记录
- analysisHistoryService: 分析历史管理

## 技术实现

### 状态管理
- 使用 React useState 和 useEffect 钩子管理组件状态
- 服务层采用单例模式管理全局状态

### 国际化
- 实现了基于 JSON 文件的国际化系统
- 支持动态切换语言

### 主题管理
- 实现了主题服务，支持浅色、深色和系统主题
- 使用 CSS 变量和 Tailwind 类实现主题切换

### 安全分析
- 集成 Google Gemini AI API
- 分析应用程序文件夹的安全性
- 生成风险评估和建议

### 迁移实现
- 使用 Windows 命令行工具进行文件操作
- 创建符号链接保持原有路径访问性
- 支持增量迁移和验证

## 未来规划
- 迁移到 Tauri 实现原生功能
- 增加更多高级迁移选项
- 改进 AI 分析能力
- 增加应用程序备份和恢复功能
- 支持更多语言的国际化