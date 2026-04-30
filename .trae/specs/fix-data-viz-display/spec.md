# 数据可视化图表显示修复 - Product Requirement Document

## Overview
- **Summary**: 修复数据可视化实验室中的图表显示问题，将 plt.show() 替换为 plt.savefig()，并在浏览器中正确展示生成的图片。
- **Purpose**: 解决在 Pyodide 浏览器环境中 plt.show() 无法显示图表的问题，让用户能够看到可视化结果。
- **Target Users**: 使用数据可视化实验室的学习者

## Goals
- [x] 修改所有练习的示例代码，使用 matplotlib 的 Agg 后端和 plt.savefig()
- [x] 更新前端代码，能够捕获并显示生成的图片
- [x] 确保所有10个练习都能正常显示图表

## Non-Goals (Out of Scope)
- 修改练习的其他功能
- 重新设计UI界面

## Background & Context
- 原代码使用 plt.show()，这在 Pyodide 浏览器环境中无法工作，因为它尝试打开交互式图形窗口
- 需要使用非交互式后端（Agg）和 plt.savefig() 将图表保存为图片，然后在浏览器中显示
- Pyodide 支持将图片转换为 base64 编码在浏览器中展示

## Functional Requirements
- **FR-1**: 修改所有示例代码，添加 matplotlib.use('Agg') 设置
- **FR-2**: 将 plt.show() 替换为 plt.savefig() 保存图片
- **FR-3**: 在前端代码中添加图片显示功能，支持展示生成的图表

## Non-Functional Requirements
- **NFR-1**: 保持代码的用户友好性，修改后的代码易于理解
- **NFR-2**: 确保修改后的功能稳定运行

## Constraints
- **Technical**: 必须在纯前端环境中运行，使用 Pyodide
- **Dependencies**: matplotlib、numpy

## Assumptions
- Pyodide 可以正确处理 base64 编码的图片数据
- 浏览器可以正确显示 base64 图片

## Acceptance Criteria

### AC-1: 图表能在浏览器中显示
- **Given**: 用户在任意一个练习中运行正确的代码
- **When**: 代码执行完毕
- **Then**: 图表图片会在输出区域下方显示
- **Verification**: `human-judgment`
- **Notes**: 验证所有10个练习都能正常显示图表

### AC-2: 使用正确的 matplotlib 后端
- **Given**: 查看所有示例代码
- **When**: 检查代码开头
- **Then**: 所有代码都包含 matplotlib.use('Agg') 配置
- **Verification**: `programmatic`

### AC-3: 使用 plt.savefig() 代替 plt.show()
- **Given**: 查看所有示例代码
- **When**: 检查代码结尾
- **Then**: 所有代码都使用 plt.savefig() 代替 plt.show()
- **Verification**: `programmatic`
