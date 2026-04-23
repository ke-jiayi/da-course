# 改进 Python 错误显示功能 - 任务计划

## [ ] Task 1: 改进 pyodideService.ts 中的错误处理

- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 改进 `runPythonCode` 函数的错误处理
  - 利用 Pyodide 的错误捕获功能，获取完整的错误堆栈信息
  - 确保即使在发生错误时，也能正确获取标准输出（stdout）
  - 返回结构化的结果，包含 success、output、error、stdout、stderr 等字段
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `human-judgment`: 测试简单错误（如语法错误），确认捕获到完整错误信息
  - `human-judgment`: 测试有部分输出后出错的代码，确认 stdout 正确显示
- **Notes**: Pyodide 的异常对象可能包含特殊属性，需要仔细处理

## [ ] Task 2: 更新 PyodideTest.tsx 组件

- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 更新组件的状态管理，同时跟踪 stdout 和 stderr
  - 改进显示逻辑，在同一区域内同时显示输出和错误
  - 使用适当的颜色区分正常输出和错误信息
  - 保持代码执行成功时的友好显示
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `human-judgment`: 测试代码执行成功时，输出正确显示
  - `human-judgment`: 测试代码执行错误时，详细的错误信息清晰可见
- **Notes**: 确保界面美观，同时信息易读

## [ ] Task 3: 更新其他包含编辑器的组件

- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 更新 `DataVisualization.tsx` 等课程页面中的编辑器组件
  - 确保所有组件的显示方式一致
  - 统一错误和输出的显示样式
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment`: 检查各个课程页面，显示方式保持一致
- **Notes**: 检查所有使用交互式编辑器的组件

## [ ] Task 4: 全面测试

- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 测试各种错误场景（语法错误、运行时错误等）
  - 验证正常代码的输出和返回值正确显示
  - 测试包含打印输出后出错的场景
  - 确保性能没有显著下降
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment`: 全面测试各种场景
- **Notes**: 可以使用一些常见的错误模式进行测试

## [ ] Task 5: 构建和部署

- **Priority**: P1
- **Depends On**: Task 4
- **Description**: 
  - 运行 `npm run build` 确保没有编译错误
  - 推送到 GitHub 仓库
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic`: 构建成功，无 TypeScript 错误
- **Notes**: 使用用户提供的 token 进行推送
