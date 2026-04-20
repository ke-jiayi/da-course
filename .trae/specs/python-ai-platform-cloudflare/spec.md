# Python数据分析AI训练平台（Cloudflare免费版）- 产品需求文档

## 概述
- **摘要**：基于Cloudflare免费资源，实现"3步认知+10个梯度项目+AI错题倒逼"的Python数据分析实操训练平台，零成本、零运维、无传统后端，打开浏览器即可使用。
- **目的**：为用户提供一个完全免费、无需配置、可直接在浏览器中运行Python代码的数据分析学习平台，结合AI陪练功能，提升学习效果。
- **目标用户**：Python数据分析初学者、数据分析师、对数据分析感兴趣的学习者。

## 目标
- 实现完全基于Cloudflare免费套餐的数据分析训练平台
- 提供10个梯度项目实操练习
- 集成AI陪练功能，提供思路点拨和代码纠错
- 实现浏览器端Python运行环境，无需后端服务器
- 提供学习进度保存功能

## 非目标（范围外）
- 不使用任何付费服务或传统后端服务器
- 不支持大型数据集处理（超出浏览器性能限制）
- 不提供多设备学习进度同步（MVP阶段）
- 不支持团队协作功能

## 背景与上下文
- 传统数据分析学习平台通常需要后端服务器支持，成本较高
- Cloudflare提供免费的边缘计算资源，可替代传统后端
- Pyodide技术使得在浏览器中运行Python成为可能
- AI技术的发展为个性化学习提供了新的可能性

## 功能需求
- **FR-1**：前端应用部署在Cloudflare Pages，包含首页、学习引导、项目列表、项目详情页等
- **FR-2**：实现在线代码编辑器（Monaco Editor），支持语法高亮和自动补全
- **FR-3**：集成Pyodide，在浏览器端运行Python代码，支持pandas、numpy、matplotlib等库
- **FR-4**：实现AI API代理服务（Cloudflare Workers），隐藏API Key并处理AI请求
- **FR-5**：使用Workers KV存储项目内容、AI提示词等静态数据
- **FR-6**：使用LocalStorage存储用户学习进度、代码草稿、AI聊天记录
- **FR-7**：实现10个梯度项目实操，包含数据集生成、代码运行、AI陪练功能
- **FR-8**：实现第一天底层认知模块，包含思维模型、行业争议、辨析题
- **FR-9**：实现图表渲染功能，支持Python生成的图表在前端展示

## 非功能需求
- **NFR-1**：性能优化，首屏加载时间<2秒，代码运行响应时间<3秒
- **NFR-2**：安全保障，AI API Key不暴露在前端
- **NFR-3**：用户体验，界面美观、操作流畅、错误提示友好
- **NFR-4**：兼容性，优先适配Chrome、Edge等现代浏览器
- **NFR-5**：可扩展性，支持后续功能迭代和项目扩展

## 约束
- **技术**：基于React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **资源**：完全使用Cloudflare免费套餐，不超出免费额度
- **时间**：3周开发周期，快速实现MVP
- **依赖**：依赖Pyodide、Cloudflare Workers、AI Gateway等服务

## 假设
- 浏览器支持WebAssembly（Pyodide运行条件）
- Cloudflare免费额度足够支撑MVP阶段的使用需求
- 用户设备具备基本的浏览器性能（能够运行Pyodide）

## 验收标准

### AC-1：无后端依赖
- **Given**：平台部署完成
- **When**：用户访问平台
- **Then**：所有功能正常运行，不依赖传统后端服务器
- **Verification**：`programmatic`

### AC-2：免费资源可用
- **Given**：平台运行中
- **When**：用户使用各项功能
- **Then**：所有功能使用Cloudflare免费套餐，不超出免费额度
- **Verification**：`programmatic`

### AC-3：核心功能可用
- **Given**：用户进入项目详情页
- **When**：用户编写和运行Python代码
- **Then**：代码能在浏览器端执行，图表正常渲染
- **Verification**：`programmatic`

### AC-4：AI陪练正常
- **Given**：用户遇到问题
- **When**：用户请求AI思路点拨或代码纠错
- **Then**：AI能正常响应，不暴露API Key
- **Verification**：`programmatic`

### AC-5：进度保存正常
- **Given**：用户完成部分学习
- **When**：用户刷新页面或重新访问
- **Then**：学习进度、代码草稿、聊天记录保持不变
- **Verification**：`programmatic`

### AC-6：访问流畅
- **Given**：用户访问平台
- **When**：用户操作各项功能
- **Then**：首屏加载时间<2秒，代码运行响应时间<3秒
- **Verification**：`programmatic`

### AC-7：部署简单
- **Given**：开发完成
- **When**：按照部署步骤操作
- **Then**：能快速部署成功，无需复杂配置
- **Verification**：`human-judgment`

## 开放问题
- [ ] 具体的10个梯度项目内容需要进一步细化
- [ ] AI模型的具体选择（gpt-4o-mini vs 豆包轻量版）需要根据实际使用情况评估
- [ ] Pyodide的性能优化策略需要进一步验证
