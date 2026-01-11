# WinLink Migrator 项目开发规范文档

## 1. 项目概况
WinLink 迁移器是一个 Windows 实用工具仪表盘，旨在帮助用户将应用程序数据从系统盘（C盘）迁移到其他分区，并通过创建符号链接（Symbolic Links / Junctions）保持原有路径的访问性。项目集成 Google Gemini AI，用于评估迁移操作的安全性。

目前版本为 Web POC (概念验证)，旨在展示 UI 交互、状态流转及 AI 集成，实际文件操作需要在 Electron 或 Tauri 环境下运行。

## 2. 技术栈架构
- 前端框架: React 19（react, react-dom）
- 开发语言: TypeScript
- 样式方案: Tailwind CSS (通过 CDN 引入)
- 图标库: Lucide React
- AI 服务: Google GenAI SDK（@google/genai - Gemini 1.5 闪光灯/专业版）
- 构建/运行环境: 浏览器(当前), 目标为 Electron/Tauri

## 3. 核心数据模型(Type Definitions)
所有核心类型定义位于 types.ts。

### 3.1 应用状态流转 (AppStatus)
应用在迁移过程中经历以下状态：
- 准备好: 就绪，等待操作
- 分析: 正在进行 AI 安全分析
- 移动: 正在执行迁移流程（包含细分步骤）
- 已移动: 迁移及链接创建成功
- 错误: 操作失败

### 3.2 迁移细分步骤 (MoveStep)
当状态为移动时，UI 需展示具体的底层操作进度：
- 闲置的: 未开始
- MKDIR: 创建目标目录
- 机器人复制: 复制文件数据
- MKLINK: 创建 Junction 链接
- 完毕: 完成

### 3.3 应用数据结构 (AppFolder)

```typescript
interface AppFolder {
  id: string;
  name: string;
  sourcePath: string; // 原路径
  size: string;       // 占用空间
  status: AppStatus;
  moveStep?: MoveStep;
  safetyScore?: number; // AI 评分 (0-100)
  aiAnalysis?: string;  // AI 分析建议
}
```

## 4. 功能模块规范

### 4.1 磁盘与应用扫描
- 数据源: 目前使用 constants.ts 中的模拟应用程序和源驱动器模拟
- 交互: 切换源磁盘（Source Drive）时触发扫描动画，重置选中状态

### 4.2 AI 安全分析 (geminiService.ts)
- 触发条件: 用户点击 "Analyze Safety"
- Prompt 策略: 询问 AI 该文件夹是否包含硬编码路径、是否为系统服务、是否适合做 Junction 链接
- 输出格式: 强制 JSON Schema 输出，包含风险等级（低/中/高）和建议采取的行动
- 容错: 如果 API Key 缺失或请求失败，返回默认的 "Medium Risk" 本地兜底建议

### 4.3 迁移流程模拟
由于是 Web 环境，实际的 Windows 命令通过设置超时模拟延迟，并在终端日志中显示拟真命令：
- MkDir：`mkdir "Target\Path"`
- 机器人复制：`robocopy "源" "目标" /E /COPYALL /MOVE`
- MkLink：`mklink /J "源" "目标"`

### 4.4 终端日志 (TerminalLog)
- 结构: 包含 ID、时间戳、消息内容、消息类型（info/success/warning/error/command）
- 用户界面: 自动滚动到底部，命令类型显示为蓝色并带 $ 前缀

## 5. UI/UX 设计规范

### 5.1 视觉风格
- 主题: 深色模式 (Dark Mode)，背景色 bg-slate-950
- 主色调: 蓝色 (蓝色-500/蓝色-600) 用于强调和动作按钮
- 字体: 无衬线字体，代码/路径/日志使用等宽字体 (font-mono)

### 5.2 窗口模拟
- 标题栏: 自定义实现的 Windows 风格标题栏 (标题栏组件)，包含模拟的拖拽区域 (WebkitAppRegion: 'drag') 和窗口控制按钮
- 滚动条: 自定义 CSS Webkit 滚动条，以匹配深色应用风格

### 5.3 国际化 (i18n)
- 支持语言：英语（en）、中文 (zh)
- 实现方式：translations.ts 字典对象，通过 App.tsx 中的状态进行切换
- 覆盖范围: 界面文本、状态标签、模态框内容

### 5.4 交互反馈
- 卡片状态：AppCard 根据状态改变边框颜色（绿=完成，蓝=进行中，紫=分析中）
- 进度细化: 操作面板显示具体的 Checkbox 进度条（创建目录 -> 复制 -> 链接）

## 6. 文件目录结构

```
/
├── index.html          # 入口 HTML，包含 Tailwind CDN 和 importmap
├── index.tsx           # React 入口
├── App.tsx             # 主应用逻辑、布局、状态管理
├── types.ts            # TypeScript 类型定义
├── constants.ts        # 模拟数据 (Mock Data) 和配置
├── translations.ts     # 国际化资源文件
├── metadata.json       # 应用元数据
├── services/
│   └── geminiService.ts # Google Gemini API 集成逻辑
└── components/
    ├── AppCard.tsx      # 应用列表卡片组件
    └── TerminalLog.tsx  # 底部日志终端组件
```

## 7. 生产环境适配指南 (致原生开发者)

若将本项目打包为 EXE 文件，需进行以下修改：

### 文件系统访问
- 替换 constants.ts 中的 Mock 数据，使用 Node.js fs 模块或 Tauri Rust 后端扫描真实磁盘

### 命令执行
- 在 App.tsx 的处理移动函数中，移除设置超时
- 使用 child_process.spawn (Electron) 或命令 (Tauri) 执行真实的 robocopy 和 mklink
- 需要处理 UAC (管理员权限)，因为创建符号链接通常需要提权

### API 密钥
- 生产环境中 API Key 不应硬编码，应通过后端代理请求或让用户在设置中输入