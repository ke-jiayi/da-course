# 改进 Python 错误显示功能

## Overview

- **Summary**: 改进网站中交互式 Python 编辑器的错误显示功能，使其像普通 Python 开发环境一样，显示详细的错误信息，包括错误类型、错误消息、行号和堆栈追踪。
- **Purpose**: 解决用户反馈的问题 - 目前编辑器执行错误时只显示简单的 "代码执行错误"，缺乏具体的诊断信息，不利于学习和调试。
- **Target Users**: 使用该平台学习 Python 编程和数据分析的用户。

## Goals

- 改进 `pyodideService.ts` 中的错误处理逻辑，捕获更完整的错误信息
- 更新相关组件，确保错误信息能够清晰、详细地显示
- 保持输出信息（stdout）的完整显示
- 改进用户体验，让错误信息更容易阅读和理解

## Non-Goals

- 不改变 Pyodide 的核心执行逻辑
- 不添加新的课程内容或功能
- 不改变网站的整体架构

## Background & Context

- 项目使用 React + TypeScript + Vite 构建
- Python 代码执行通过 Pyodide 在浏览器端完成
- 相关代码位于：
  - `/workspace/src/services/pyodideService.ts` - 核心服务
  - `/workspace/src/components/PyodideTest.tsx` - 测试页面
  - `/workspace/src/components/DataVisualization.tsx` 等课程页面 - 包含编辑器
- 目前的错误处理比较简单，只捕获基本的异常信息

## Functional Requirements

- **FR-1**: 捕获并显示完整的 Python 错误堆栈信息
- **FR-2**: 错误信息包含错误类型、消息和行号
- **FR-3**: 同时正确显示正常的标准输出（stdout）
- **FR-4**: 错误信息以易于阅读的格式显示

## Non-Functional Requirements

- **NFR-1**: 性能保持不变，不影响代码执行速度
- **NFR-2**: 界面友好，错误信息有适当的颜色区分
- **NFR-3**: 向后兼容，不破坏现有功能

## Constraints

- 技术: 只能修改现有代码，不引入新的外部依赖
- 实现: 必须保持与 Pyodide 版本 v0.29.3 兼容

## Assumptions

- Pyodide 的错误处理 API 可以提供完整的错误堆栈
- 用户熟悉标准 Python 错误显示格式
- 现有的代码结构可以容纳这些改动

## Acceptance Criteria

### AC-1: 改进错误捕获
- **Given**: 用户在编辑器中输入包含错误的 Python 代码
- **When**: 用户点击"运行代码"按钮
- **Then**: 系统捕获完整的错误信息，包括错误类型、消息和行号
- **Verification**: human-judgment

### AC-2: 详细错误显示
- **Given**: 代码执行发生错误
- **When**: 显示错误信息时
- **Then**: 错误信息以类似标准 Python 控制台的格式显示，包含堆栈追踪
- **Verification**: human-judgment

### AC-3: 正常输出保持
- **Given**: 代码执行成功，有标准输出
- **When**: 显示执行结果时
- **Then**: 标准输出完整显示，不受影响
- **Verification**: human-judgment

### AC-4: 界面一致性
- **Given**: 所有包含 Python 编辑器的组件
- **When**: 用户使用这些组件
- **Then**: 所有组件的输出和错误显示方式保持一致
- **Verification**: human-judgment

## Open Questions
- 无
