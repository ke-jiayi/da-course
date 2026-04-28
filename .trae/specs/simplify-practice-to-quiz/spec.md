# 练习页面简化为选择题 Spec

## Why
当前练习页面的Python编辑器使用Pyodide运行Python代码，但存在运行错误或无法运行的问题。用户希望简化这些页面，删除所有无法正常工作的互动功能，改为纯选择题形式。

## What Changes
- 删除数据清洗与预处理练习中的Python代码编辑器
- 删除数据可视化练习中的Python代码编辑器
- 删除机器学习模型训练练习中的Python代码编辑器
- 删除时间序列分析练习中的Python代码编辑器
- 将所有练习改为选择题形式
- 保留案例分析部分作为选择题的题目

## Impact
- Affected specs: 练习模块功能
- Affected code: `/workspace/src/components/PracticeDetail.tsx`

## ADDED Requirements

### Requirement: 选择题练习模式
系统应为每个练习类型提供选择题形式的测试，而不是代码编辑器。

#### Scenario: 用户进入练习页面
- **WHEN** 用户点击数据清洗与预处理、数据可视化、机器学习模型训练或时间序列分析练习
- **THEN** 系统显示选择题形式的练习内容，不显示代码编辑器

#### Scenario: 用户回答选择题
- **WHEN** 用户选择答案并提交
- **THEN** 系统显示正确答案和详细解释

## MODIFIED Requirements

### Requirement: 练习页面内容
将原有的Python代码编辑器和案例分析改为选择题形式，每个练习包含5-10道选择题。

## REMOVED Requirements

### Requirement: Python代码编辑器
**Reason**: Pyodide运行不稳定，无法正常执行代码
**Migration**: 改用选择题形式测试知识点
