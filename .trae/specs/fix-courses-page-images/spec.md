# 修复课程中心图片显示问题 - Product Requirement Document

## Overview
- **Summary**: 修复课程中心页面中6个新课程的图片显示问题，使用渐变背景替代AI生成图片
- **Purpose**: 确保课程中心所有10个课程的图片都能正常显示，避免"图片生成中"的占位符文字
- **Target Users**: 访问课程中心页面的所有用户

## Why
目前课程中心6个新课程的图片使用AI图片生成API，导致显示"the image is generating... please refresh page to preview"等占位符文字，影响用户体验。

## What Changes
- 将课程中心6个新课程的图片替换为渐变背景
- 为课程卡片添加图标emoji展示
- 确保课程中心与首页课程卡片视觉风格一致

## Impact
- Affected specs: 课程中心页面展示
- Affected code: `/workspace/src/components/Courses.tsx`

## ADDED Requirements
### Requirement: 课程中心课程卡片显示
课程中心所有10个课程的卡片必须能够立即显示图片，不显示任何加载提示或占位符文字。

#### Scenario: 图片正常显示
- **WHEN** 用户打开课程中心页面
- **THEN** 所有课程卡片显示渐变背景和图标，不显示任何加载提示

## MODIFIED Requirements
### Requirement: 课程中心卡片样式
- 移除AI生成图片URL
- 添加渐变背景配置
- 添加图标emoji配置
- 修改卡片布局以展示渐变背景和图标

## Acceptance Criteria
- [ ] 数据清洗实战课程卡片显示渐变背景和图标
- [ ] 分组聚合分析课程卡片显示渐变背景和图标
- [ ] 购物篮分析课程卡片显示渐变背景和图标
- [ ] A/B测试分析课程卡片显示渐变背景和图标
- [ ] 时间序列分析课程卡片显示渐变背景和图标
- [ ] 异常值检测课程卡片显示渐变背景和图标
- [ ] 所有课程卡片不显示任何加载提示文字
- [ ] 课程中心与首页视觉风格一致
