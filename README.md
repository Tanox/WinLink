# WinLink Migrator

## 项目概述

WinLink Migrator 是一个 Windows 实用工具仪表盘，旨在帮助用户将应用程序数据从系统盘（C盘）迁移到其他分区，并通过创建符号链接（Symbolic Links / Junctions）保持原有路径的访问性。

### 核心功能

- **磁盘管理**：扫描系统磁盘和分区，显示空间使用情况
- **应用程序管理**：扫描和管理应用程序，支持排序和过滤
- **AI 安全分析**：使用 Google Gemini AI 评估迁移操作的安全性
- **应用程序迁移**：支持单个或批量迁移应用程序，显示实时进度
- **终端日志**：显示操作过程和系统事件
- **国际化**：支持中文和英文
- **主题管理**：支持浅色、深色和系统主题

### 技术特点

- **现代化技术栈**：React 18 + TypeScript + Tailwind CSS
- **AI 集成**：集成 Google Gemini AI 进行安全分析
- **响应式设计**：适配不同屏幕尺寸
- **原生功能**：目标为 Tauri 环境，实现原生文件操作

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn 或 pnpm 包管理器
- Windows 10 或更高版本

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/winlink-migrator.git
   cd winlink-migrator
   ```

2. **安装依赖**
   ```bash
   # 使用 npm
   npm install
   
   # 或使用 yarn
   yarn install
   
   # 或使用 pnpm
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   # 使用 npm
   npm run dev
   
   # 或使用 yarn
   yarn dev
   
   # 或使用 pnpm
   pnpm dev
   ```

4. **构建项目**
   ```bash
   # 使用 npm
   npm run build
   
   # 或使用 yarn
   yarn build
   
   # 或使用 pnpm
   pnpm build
   ```

5. **运行测试**
   ```bash
   # 使用 npm
   npm run test
   
   # 或使用 yarn
   yarn test
   
   # 或使用 pnpm
   pnpm test
   ```

## 项目文档

详细的项目文档位于 `openspec` 目录，包括：

- **功能规范**：各功能模块的详细规范
- **技术架构**：项目架构设计和技术栈
- **开发规范**：代码风格和最佳实践
- **变更记录**：项目变更历史

## 贡献指南

1. ** Fork 仓库**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'feat: Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **打开 Pull Request**

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

- **项目链接**：https://github.com/your-username/winlink-migrator
- **问题反馈**：https://github.com/your-username/winlink-migrator/issues