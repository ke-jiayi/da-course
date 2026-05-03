# 修复课程图片显示问题 - Product Requirement Document

## Overview
- **Summary**: 修复首页课程分类中6个新课程的图片显示问题，使用渐变背景替代AI生成图片
- **Purpose**: 确保所有10个课程的图片都能正常显示，避免"图片生成中"的占位符文字
- **Target Users**: 访问首页的所有用户

## Why
目前6个新课程的图片使用AI图片生成API，导致显示"the image is generating... please refresh page to preview"等占位符文字，影响用户体验。

## What Changes
- 将6个新课程的图片替换为渐变背景
- 保持原有的图标emoji显示不变
- 确保所有课程卡片视觉风格一致

## Impact
- Affected specs: 首页课程分类展示
- Affected code: `/workspace/src/components/Home.tsx`

## ADDED Requirements
### Requirement: 课程卡片图片显示
所有10个课程的卡片图片必须能够立即显示，不显示任何加载提示或占位符文字。

#### Scenario: 图片正常显示
- **WHEN** 用户打开首页
- **THEN** 所有课程卡片显示背景图片或渐变色，不显示任何加载提示

## MODIFIED Requirements
### Requirement: 课程卡片样式
原有4个课程继续使用AI生成图片，新6个课程使用渐变背景+彩色图标。

## Acceptance Criteria
- [ ] 数据清洗实战课程卡片显示渐变背景
- [ ] 分组聚合分析课程卡片显示渐变背景
- [ ] 购物篮分析课程卡片显示渐变背景
- [ ] A/B测试分析课程卡片显示渐变背景
- [ ] 时间序列分析课程卡片显示渐变背景
- [ ] 异常值检测课程卡片显示渐变背景
- [ ] 所有课程卡片不显示任何加载提示文字
