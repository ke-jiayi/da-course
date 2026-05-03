# 为6个新课程添加练习题 - Product Requirement Document

## Overview
- **Summary**: 为数据挖掘、商业分析、分组聚合分析、购物篮分析、A/B测试分析、异常值检测这6个新课程添加选择题形式的练习题
- **Purpose**: 让用户通过选择题练习巩固各课程的核心知识点
- **Target Users**: 学习数据分析课程的用户

## Why
目前编程练习只有4个课程的练习题，需要为新增的6个课程添加相应的练习题，保持与其他4个课程相同的选择题形式。

## What Changes
- 在 Practice.tsx 中添加6个新的练习项
- 在 PracticeDetail.tsx 中添加6组新的选择题数据
- 每组练习题包含7-8道选择题，涵盖该课程的核心知识点

## Impact
- Affected specs: 编程练习模块
- Affected code: 
  - `/workspace/src/components/Practice.tsx` - 添加新练习项
  - `/workspace/src/components/PracticeDetail.tsx` - 添加选择题数据

## ADDED Requirements
### Requirement: 新增6个课程的练习题
为以下6个课程添加选择题练习：
1. 数据挖掘 - 关联规则、聚类分析、分类算法等
2. 商业分析 - 商业指标、ROI分析、决策分析等
3. 分组聚合分析 - GROUP BY、聚合函数、透视表等
4. 购物篮分析 - Apriori算法、支持度、置信度、提升度等
5. A/B测试分析 - 假设检验、显著性水平、置信区间等
6. 异常值检测 - Z-Score、IQR方法、孤立森林等

#### Scenario: 用户练习新课程
- **WHEN** 用户进入编程练习页面
- **THEN** 可以看到10个课程的练习题
- **WHEN** 用户点击新课程的练习
- **THEN** 可以进行选择题答题并获得评分和解析

## Acceptance Criteria
- [ ] Practice.tsx 中有10个练习项
- [ ] 数据挖掘练习题包含7-8道选择题
- [ ] 商业分析练习题包含7-8道选择题
- [ ] 分组聚合分析练习题包含7-8道选择题
- [ ] 购物篮分析练习题包含7-8道选择题
- [ ] A/B测试分析练习题包含7-8道选择题
- [ ] 异常值检测练习题包含7-8道选择题
- [ ] 所有练习题可以正常答题和评分
