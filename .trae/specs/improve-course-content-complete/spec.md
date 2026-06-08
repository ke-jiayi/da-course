# 完善课程内容显示 - 产品需求文档

## Why
用户反馈课程页面内容显示为空，需要按照参考网站 `https://data-c.pages.dev/` 的风格完善课程内容展示，同时更新学习时间（从30秒改为30分钟、45分钟、60分钟等合理时间）。

## What Changes
- 更新首页课程卡片，添加数据集名称显示
- 更新课程学习时间为合理时长（30分钟、45分钟、60分钟）
- 确保所有课程页面有完整的学习内容
- 添加"开始学习"按钮

## Impact
- 受影响的规格：首页、课程页面
- 受影响的代码：Home.tsx、各课程组件

## ADDED Requirements

### Requirement: 课程卡片数据集显示
每个课程卡片应显示相关的数据集名称。

#### Scenario: 查看课程数据集
- **WHEN** 用户浏览课程列表
- **THEN** 每个课程卡片应显示相关数据集名称

### Requirement: 合理学习时间
课程学习时间应设置为合理时长：
- 入门课程：30分钟
- 进阶课程：45分钟
- 高级课程：60分钟

#### Scenario: 查看课程时间
- **WHEN** 用户浏览课程列表
- **THEN** 每个课程卡片显示合理的学习时间

## MODIFIED Requirements

### Requirement: 课程内容完整性
所有10个课程页面应包含完整内容：
1. 课程标题和简介
2. 学习目标
3. 知识要点（分模块展示）
4. 动手练习（代码编辑器）
5. 参考答案
6. 课后思考

## 课程列表（参考参考网站）

| 课程 | 难度 | 时间 | 数据集 |
|------|------|------|--------|
| 数据清洗实战 | 入门 | 30分钟 | retail_orders.csv |
| 分组聚合分析 | 入门 | 30分钟 | retail_orders.csv |
| 购物篮分析 | 进阶 | 45分钟 | market_basket.csv |
| 客户聚类分析 | 进阶 | 45分钟 | customer_features.csv |
| 数据可视化 | 进阶 | 45分钟 | retail_orders.csv |
| A/B测试分析 | 进阶 | 45分钟 | ab_test.csv |
| 时间序列分析 | 进阶 | 45分钟 | time_series_sales.csv |
| 特征工程 | 高级 | 60分钟 | customer_features.csv |
| 异常值检测 | 高级 | 45分钟 | customer_features.csv |
| 多数据集合并 | 进阶 | 45分钟 | retail_orders.csv |