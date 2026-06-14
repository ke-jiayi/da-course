# 数据学院网站重构改进（v2）- 任务分解与实施计划

## [ ] Task 1: 改进 Pyodide 服务层，增加进度事件支持
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 修改 `pyodideService.ts`，在加载过程中暴露进度事件
  - 定义4个加载阶段的枚举：SCRIPT_LOADING → PACKAGES_LOADING → MPL_CONFIG → READY
  - 为 `initPyodide()` 增加进度回调参数
  - 增加 `getPyodideStatus()` 函数，返回当前状态
- **Key Files Modified**:
  - `src/services/pyodideService.ts`
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: `initPyodide()` 函数接受 onProgress 回调参数
  - `programmatic` TR-1.2: onProgress 回调在加载过程中被调用至少3次
  - `programmatic` TR-1.3: 每个回调事件包含 stage（0-4）和 percent（0-100）字段
  - `human-judgement` TR-1.4: 加载完成后代码可正常运行（手动测试）

## [ ] Task 2: 创建 PyodideLoader 通用加载组件
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 新建组件 `src/components/PyodideLoader.tsx`
  - 组件 Props: stage(0-4), percent(0-100), error(string|null), onRetry(function)
  - 包含：动画图标、阶段描述、进度条、已用时间、小贴士
  - 使用 Tailwind CSS，与现有风格一致
  - 使用 CSS 动画实现加载效果
- **Key Files Created**:
  - `src/components/PyodideLoader.tsx` (NEW)
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-2.1: 组件正确渲染不同 stage 的描述文字
  - `programmatic` TR-2.2: 进度条宽度随 percent 变化
  - `human-judgement` TR-2.3: 视觉效果与整体网站风格一致
  - `human-judgement` TR-2.4: 加载动画流畅，无卡顿

## [ ] Task 3: 更新 PythonPlayground 使用 PyodideLoader
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 修改 `PythonPlayground.tsx`
  - 集成 PyodideLoader 替换原有加载提示
  - 正确连接进度回调
  - 测试错误状态的显示
- **Key Files Modified**:
  - `src/components/PythonPlayground.tsx`
- **Acceptance Criteria Addressed**: AC-1, AC-8
- **Test Requirements**:
  - `programmatic` TR-3.1: 加载时显示 PyodideLoader，加载完成后显示编辑器
  - `human-judgement` TR-3.2: 加载过程中的文案准确、易懂
  - `human-judgement` TR-3.3: 代码运行功能正常

## [ ] Task 4: 简化 Header 导航
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 修改 `Header.tsx`
  - 保留导航项：首页、课程、代码编辑器、徽章、登录/用户
  - 删除：练习、测试、排行榜、通知、设置、思维测试
  - 同步更新移动端菜单
- **Key Files Modified**:
  - `src/components/Header.tsx`
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR-4.1: 桌面端导航项数量 ≤ 5
  - `human-judgement` TR-4.2: 移动端菜单同样简化
  - `human-judgement` TR-4.3: 导航样式保持与原风格一致

## [ ] Task 5: 重构首页
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 重写 `Home.tsx`
  - 顶部：大标题"数据学院" + 副标题描述10个实战项目
  - 4个卖点标签：真实数据集、实时运行代码、循序渐进、徽章认证
  - 主体：10个项目卡片网格（2列/5列响应式）
  - 卡片包含：大图标、标题、难度标签、时长、数据集、"开始学习"按钮
  - 删除：最新动态、关于我们板块
- **Key Files Modified**:
  - `src/components/Home.tsx`
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-5.1: 页面首屏即看到项目卡片入口
  - `human-judgement` TR-5.2: 卡片布局响应式（移动端/桌面端正常）
  - `human-judgement` TR-5.3: "开始学习"按钮正确跳转到对应课程
  - `programmatic` TR-5.4: 10个课程卡片全部渲染

## [ ] Task 6: 简化课程列表页面
- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 简化 `Courses.tsx`，使其成为首页项目列表的简化版本
  - 保留搜索和筛选功能（如果有）
  - 作为 `/courses` 路由的备用入口
- **Key Files Modified**:
  - `src/components/Courses.tsx`
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-6.1: 页面风格与首页一致
  - `programmatic` TR-6.2: 课程列表正常渲染

## [ ] Task 7: 增强数据可视化课程内容
- **Priority**: P0
- **Depends On**: Task 2 (需集成PyodideLoader)
- **Description**:
  - 重写 `DataVisualization.tsx`
  - 知识要点重构：为什么重要 / 核心概念 / 常见误区
  - 动手练习重构为3步递进结构
    - Step 1 基础：使用 pandas 读取销售数据，查看基本信息
    - Step 2 进阶：绘制柱状图和折线图，分析各月销售趋势
    - Step 3 挑战：综合分析 - 产品类别对比 + 可视化报告
  - 集成 retail_orders 风格的真实示例数据集
  - 集成 PyodideLoader
  - 页面底部添加"完成课程，获得徽章"按钮
- **Key Files Modified**:
  - `src/components/DataVisualization.tsx`
- **Acceptance Criteria Addressed**: AC-4, AC-7, AC-8
- **Test Requirements**:
  - `human-judgement` TR-7.1: 知识要点有清晰的三部分结构
  - `human-judgement` TR-7.2: 3步练习递进合理，代码可运行
  - `human-judgement` TR-7.3: 代码中使用真实感的数据集
  - `human-judgement` TR-7.4: matplotlib 图表可正常渲染
  - `human-judgement` TR-7.5: 完成按钮功能正常

## [ ] Task 8: 增强机器学习课程内容
- **Priority**: P0
- **Depends On**: Task 7 (参考数据可视化的代码结构)
- **Description**:
  - 重写 `MachineLearning.tsx`
  - 与Task 7相同结构：知识要点增强 + 3步递进练习
  - 使用 customer_features 风格数据集（客户年龄、消费金额、活跃度等）
  - Step 1: 数据探索与特征工程
  - Step 2: K-Means 聚类分析
  - Step 3: 聚类结果可视化与业务解读
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/MachineLearning.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8
- **Test Requirements**:
  - 同 Task 7，验证机器学习特定代码运行

## [ ] Task 9: 增强数据挖掘课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `DataMining.tsx`
  - 使用 market_basket 风格数据集（购物篮商品列表）
  - Step 1: 数据格式转换与频繁项集
  - Step 2: 关联规则挖掘（支持度、置信度）
  - Step 3: 结果分析与商品推荐策略
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/DataMining.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 10: 增强商业分析课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `BusinessAnalysis.tsx`
  - 使用 ab_test 风格数据集（A组/B组转化率数据）
  - Step 1: 业务数据探索与关键指标
  - Step 2: A/B测试结果分析
  - Step 3: 撰写数据驱动的业务建议
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/BusinessAnalysis.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 11: 增强数据清洗实战课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `DataCleaning.tsx`
  - 使用有问题的 retail_orders 数据集（缺失值、重复值、异常值）
  - Step 1: 数据问题诊断
  - Step 2: 缺失值与重复值处理
  - Step 3: 异常值检测与修正
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/DataCleaning.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 12: 增强分组聚合分析课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `GroupAggregation.tsx`
  - 使用 retail_orders 风格订单数据
  - Step 1: 基础 groupby 聚合操作
  - Step 2: 多维度分组与透视表
  - Step 3: 分组聚合后的业务洞察
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/GroupAggregation.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 13: 增强购物篮分析课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `MarketBasket.tsx`
  - 使用 market_basket 风格数据集
  - Step 1: 购物篮数据格式理解
  - Step 2: Apriori 算法实现与应用
  - Step 3: 关联规则业务价值分析
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/MarketBasket.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 14: 增强 A/B 测试分析课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `ABTesting.tsx`
  - 使用 ab_test 风格数据集
  - Step 1: 实验设计与数据理解
  - Step 2: 显著性检验（z-test / t-test）
  - Step 3: 实验结论与业务建议
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/ABTesting.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 15: 增强时间序列分析课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `TimeSeries.tsx`
  - 使用 time_series_sales 风格月度销售数据
  - Step 1: 时间序列数据探索与季节性分析
  - Step 2: 移动平均与趋势分解
  - Step 3: 简单预测模型（线性回归/指数平滑）
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/TimeSeries.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 16: 增强异常值检测课程内容
- **Priority**: P0
- **Depends On**: Task 7
- **Description**:
  - 重写 `AnomalyDetection.tsx`
  - 使用 customer_features 风格数据集
  - Step 1: 统计方法检测（Z-Score / IQR）
  - Step 2: 可视化方法（箱线图/散点图）
  - Step 3: 业务场景中的异常值处理策略
  - 集成 PyodideLoader + 完成按钮
- **Key Files Modified**:
  - `src/components/AnomalyDetection.tsx`
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8

## [ ] Task 17: 完善徽章/成就系统
- **Priority**: P1
- **Depends On**: Tasks 4-16 (需要课程页面能调用完成标记功能)
- **Description**:
  - 修改/重写 `Achievements.tsx`
  - 定义13个徽章（10课程 + 3进阶）
  - 使用 localStorage 存储状态
  - 页面显示：已获得徽章（彩色）+ 未获得徽章（灰色）+ 进度统计
  - 如需创建服务层，创建 `achievementService.ts` 提供统一API
- **Key Files Modified/Created**:
  - `src/components/Achievements.tsx`
  - `src/services/achievementService.ts` (可能需要新建)
- **Acceptance Criteria Addressed**: AC-6, AC-7
- **Test Requirements**:
  - `programmatic` TR-17.1: localStorage 正确读取和写入徽章状态
  - `human-judgement` TR-17.2: 页面展示13个徽章
  - `human-judgement` TR-17.3: 已获得/未获得徽章视觉区分明显
  - `human-judgement` TR-17.4: 进度统计数字正确

## [ ] Task 18: 创建课程完成标记组件
- **Priority**: P1
- **Depends On**: Task 17
- **Description**:
  - 创建 `CourseCompletion.tsx` 组件
  - Props: courseId, courseTitle, badgeIcon, badgeName
  - 显示"我已完成本课程"按钮
  - 点击后显示祝贺动画 + 徽章展示
  - 状态通过 achievementService 持久化
  - 所有课程页面底部集成此组件
- **Key Files Created**:
  - `src/components/CourseCompletion.tsx` (NEW)
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-18.1: 点击按钮有明确反馈
  - `human-judgement` TR-18.2: 状态变更后显示徽章
  - `programmatic` TR-18.3: 刷新页面后状态保持

## [ ] Task 19: 整体功能测试与 bug 修复
- **Priority**: P0
- **Depends On**: All Tasks (1-18)
- **Description**:
  - 运行 `npm run build` 检查编译错误
  - 运行开发服务器进行手动测试
  - 验证：首页 → 课程 → 代码运行 → 完成标记 → 徽章页面 的完整流程
  - 修复发现的 bug
- **Acceptance Criteria Addressed**: 所有 AC
- **Test Requirements**:
  - `programmatic` TR-19.1: `npm run build` 成功无错误
  - `human-judgement` TR-19.2: 手动浏览测试各页面正常
  - `human-judgement` TR-19.3: Pyodide 代码运行正常
  - `human-judgement` TR-19.4: 徽章获取流程正常
