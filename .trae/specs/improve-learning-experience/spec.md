# 改进数据分析课程网站 - Product Requirement Document

## Overview
- **Summary**: 参考 data-c.pages.dev 网站的优秀设计，改进现有数据分析课程网站的 Python 交互体验和教学内容
- **Purpose**: 解决当前网站 Python 代码运行不稳定、错误提示不友好的问题，提供更优质的学习体验
- **Target Users**: 学习数据分析的用户

## Goals
- 改进 Pyodide 集成方式，确保 Python 代码能稳定运行
- 提供更好的错误提示功能，帮助用户学习和调试
- 简化学习内容，改为项目式学习
- 内置真实数据集供练习使用
- 添加学习进度追踪和激励机制

## Non-Goals (Out of Scope)
- 不重新设计整个网站架构
- 不添加后端服务
- 不改变现有路由结构

## Background & Context
参考网站 `https://data-c.pages.dev/` 特点：
- 10个精选实战项目
- 完全在浏览器中运行代码
- 循序渐进的学习路径
- 徽章认证系统
- 内置真实数据集

当前网站问题：
- Python 代码运行时好时坏
- 错误提示不友好
- 学习路径不够清晰
- 缺乏激励机制

## Functional Requirements

### FR-1: 改进 Pyodide 集成
- 使用动态脚本加载方式（script tag）
- 预加载必要的 Python 包
- 设置 matplotlib 使用 Agg 后端
- 处理加载失败的情况

### FR-2: 改进错误处理
- 捕获 Python 语法错误
- 捕获运行时错误
- 显示行号信息
- 提供友好的错误提示

### FR-3: 项目式学习内容
- 数据清洗实战
- 分组聚合分析
- 数据可视化
- 异常值检测
- 时间序列分析

### FR-4: 内置数据集
- retail_orders.csv - 零售订单数据
- 提供数据集预览功能
- 预加载数据集到 Pyodide

### FR-5: 学习进度追踪
- LocalStorage 保存进度
- 显示完成百分比
- 简单的徽章系统

## Acceptance Criteria

### AC-1: Python 代码能稳定运行
- Given: 用户访问机器学习课程页面
- When: 点击运行代码按钮
- Then: 代码能正常执行并显示结果
- Verification: programmatic

### AC-2: 错误提示友好
- Given: 用户输入有错误的代码
- When: 点击运行按钮
- Then: 显示清晰的错误信息，包括行号和错误原因
- Verification: human-judgment

### AC-3: 学习内容清晰
- Given: 用户访问课程页面
- When: 查看课程内容
- Then: 能清楚知道要学习什么，完成什么任务
- Verification: human-judgment

### AC-4: 图表能正确显示
- Given: 用户运行包含 matplotlib 的代码
- When: 代码执行完毕
- Then: 图表能正确显示在页面上
- Verification: human-judgment
