# 迁移规范

## 描述
迁移功能负责将应用程序数据从系统盘移动到其他分区，并创建 junction 链接以保持路径访问性。它处理整个迁移过程，包括目录创建、文件复制和 junction 链接创建。
## 需求
### 需求：迁移过程
系统应执行一系列步骤来迁移应用程序数据并创建 junction 链接。
#### 场景：迁移启动
- **WHEN** 用户启动迁移过程
- **THEN** 系统应将应用程序状态更新为 "移动" (Moving)
- **AND** 开始执行迁移步骤
#### 场景：目录创建
- **WHEN** 迁移过程开始
- **THEN** 系统应在目标位置不存在时创建目录
- **AND** 将迁移步骤更新为 "MKDIR"

#### 场景：文件复制
- **WHEN** 目录创建完成
- **THEN** 系统应使用 robocopy 复制文件数据
- **AND** 将迁移步骤更新为 "机器复制" (Robocopy)

#### 场景：Junction 创建
- **WHEN** 文件复制完成
- **THEN** 系统应使用 mklink 创建 junction 链接
- **AND** 将迁移步骤更新为 "MKLINK"

#### 场景：迁移完成
- **WHEN** 所有步骤完成
- **THEN** 系统应将应用程序状态更新为 "已移动" (Moved)
- **AND** 将迁移步骤更新为 "完成" (Completed)

### 需求：命令执行
系统应执行每个迁移步骤的相应 Windows 命令。
#### 场景：MkDir 命令
- **WHEN** 创建目标目录
- **THEN** 系统应执行 `mkdir "Target\Path"`
- **AND** 在终端中记录命令

#### 场景：Robocopy 命令
- **WHEN** 复制文件
- **THEN** 系统应执行 `robocopy "源" "目标" /E /COPYALL /MOVE`
- **AND** 在终端中记录命令

#### 场景：MkLink 命令
- **WHEN** 创建 junction 链接
- **THEN** 系统应执行 `mklink /J "源" "目标"`
- **AND** 在终端中记录命令

### 需求：增强迁移功能
系统应提供增强的迁移功能，以提高用户体验和可靠性。
#### 场景：恢复迁移
- **WHEN** 迁移过程中断
- **THEN** 系统应支持从中断点继续迁移
- **AND** 显示当前进度

#### 场景：并行迁移
- **WHEN** 选择多个应用程序
- **THEN** 系统应支持同时迁移多个应用程序
- **AND** 显示每个应用程序的进度
#### 场景：迁移回滚
- **WHEN** 迁移过程中发生错误
- **THEN** 系统应自动回滚到初始状态
- **AND** 显示错误消息

#### 场景：迁移前检查
- **WHEN** 用户启动迁移
- **THEN** 系统应检查目标目录空间和权限
- **AND** 如果检查失败则中止并显示错误
#### 场景：迁移计划
- **WHEN** 用户配置迁移设置
- **THEN** 系统应支持创建和保存迁移计划
- **AND** 后续执行

#### 场景：增量迁移
- **WHEN** 迁移之前已迁移的应用程序
- **THEN** 系统应只迁移更改的文件
- **AND** 跳过未更改的文件

## 数据结构

### MigrationConfig
```typescript
interface MigrationConfig {
  targetDrive: string;
  targetPath: string;
  createJunction: boolean;
  preservePermissions: boolean;
  moveMethod: 'robocopy' | 'powershell';
}
```

### MigrationStep
```typescript
type MigrationStep = 'Idle' | 'MKDIR' | 'Robocopy' | 'MKLINK' | 'Completed';
```

## 实现注意事项

### 命令执行
- 系统应使用子进程执行 Windows 命令
- 实现命令执行的错误处理，以捕获和显示错误
- 确保命令执行的安全性，防止命令注入

### 进度跟踪
- 实现详细的进度跟踪，以显示当前步骤和完成百分比
- 考虑使用事件系统来通知 UI 组件有关进度更改
- 确保进度数据的实时更新，以提供良好的用户体验

### 错误处理
- 实现全面的错误处理，以应对各种迁移失败场景
- 提供清晰的错误消息，帮助用户理解问题
- 考虑实现自动错误恢复机制，以提高迁移成功率