# 添加6个新课程 - Product Requirement Document

## Overview
- **Summary**: 在现有4个课程基础上，添加6个新的商务数据与分析课程，总共10个课程
- **Purpose**: 提供更丰富的学习内容，覆盖更多数据分析实战场景
- **Target Users**: 学习数据分析的用户

## Goals
- 添加6个新课程组件
- 更新路由配置
- 更新课程列表页面
- 实现参考答案独立显示功能

## Non-Goals (Out of Scope)
- 不修改现有4个课程的核心内容
- 不改变现有路由结构

## Background & Context
参考网站 `https://data-c.pages.dev/` 的课程设计：
1. 数据清洗实战
2. 分组聚合分析
3. 购物篮分析
4. 客户聚类分析
5. 数据可视化（已有）
6. A/B测试分析
7. 时间序列分析
8. 特征工程
9. 异常值检测
10. 多数据集合并

现有课程：
- 数据可视化
- 机器学习
- 数据挖掘
- 商业分析

新增课程（6个）：
1. 数据清洗实战
2. 分组聚合分析
3. 购物篮分析
4. A/B测试分析
5. 时间序列分析
6. 异常值检测

## Functional Requirements

### FR-1: 新增6个课程组件
每个课程包含：
- 课程介绍
- 学习目标
- 动手练习（不直接显示答案）
- 参考答案选项（独立显示）
- 知识要点总结

### FR-2: 参考答案独立显示
- 默认隐藏答案
- 点击"显示参考答案"按钮后显示
- 答案包含代码和解释

### FR-3: 更新路由配置
- 添加6个新路由

### FR-4: 更新课程列表
- 在 Courses.tsx 中添加新课程卡片

## Acceptance Criteria

### AC-1: 6个新课程页面可访问
- Given: 用户访问新课程路由
- When: 页面加载完成
- Then: 显示课程内容
- Verification: programmatic

### AC-2: 参考答案默认隐藏
- Given: 用户查看动手练习
- When: 页面加载完成
- Then: 答案默认隐藏
- Verification: human-judgment

### AC-3: 点击按钮显示答案
- Given: 用户点击"显示参考答案"按钮
- When: 点击完成
- Then: 显示参考答案
- Verification: human-judgment

### AC-4: 课程列表显示10个课程
- Given: 用户访问课程列表页面
- When: 页面加载完成
- Then: 显示10个课程卡片
- Verification: human-judgment
