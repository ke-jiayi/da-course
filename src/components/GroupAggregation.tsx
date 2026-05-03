import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const GroupAggregation: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; output?: string; stdout: string; stderr: string; error?: any; } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const checkPyodide = async () => {
      if (isPyodideReady()) {
        setPyodideStatus('ready');
        return;
      }

      try {
        await initPyodide();
        setPyodideStatus('ready');
      } catch (error) {
        console.error('Pyodide 初始化失败:', error);
        setPyodideStatus('error');
      }
    };

    checkPyodide();
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setResult(null);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: {
          type: 'InputError',
          message: '请输入代码后再运行'
        }
      });
      return;
    }

    if (pyodideStatus !== 'ready') {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: {
          type: 'SystemError',
          message: 'Python 环境正在初始化，请稍候...'
        }
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const executionResult = await runPythonCode(code);
      setResult(executionResult);
    } catch (err) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: {
          type: 'ExecutionError',
          message: '执行出错: ' + (err as Error).message
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultCodes = [
    `# 分组聚合分析练习 - 基础概念
print("欢迎学习分组聚合分析！")
print("=" * 50)

# 1. 使用 pandas 进行分组聚合
import pandas as pd

# 创建示例数据
data = {
    '地区': ['华东', '华东', '华北', '华北', '华南', '华南'],
    '产品': ['手机', '电脑', '手机', '电脑', '平板', '平板'],
    '销售额': [15000, 25000, 12000, 18000, 8000, 6000],
    '数量': [15, 8, 12, 6, 20, 15]
}
df = pd.DataFrame(data)

print("原始数据:")
print(df)
print()

# 2. 使用 groupby 进行分组统计
print("按地区分组统计:")
region_stats = df.groupby('地区').agg({
    '销售额': 'sum',
    '数量': 'sum'
})
print(region_stats)
print()

# 3. 使用 agg 进行多聚合操作
print("按产品分组，多指标统计:")
product_stats = df.groupby('产品').agg({
    '销售额': ['sum', 'mean'],
    '数量': ['sum', 'max', 'min']
})
print(product_stats)

print("\\n✓ 基础分组聚合练习完成！")`,

    `# 分组聚合分析 - 实战案例
print("销售数据分析实战")
print("=" * 50)

import pandas as pd

# 创建销售数据集
sales_data = {
    '日期': ['2024-01-01', '2024-01-01', '2024-01-02', '2024-01-02', '2024-01-03', '2024-01-03'],
    '地区': ['华东', '华北', '华东', '华南', '华北', '华南'],
    '产品类别': ['电子产品', '电子产品', '服装', '服装', '电子产品', '服装'],
    '销售额': [15000, 12000, 8000, 9500, 11000, 7500],
    '成本': [10000, 8000, 5000, 6000, 7000, 4500]
}
df = pd.DataFrame(sales_data)

print("销售数据:")
print(df)
print()

# 按地区统计
print("按地区统计:")
region_summary = df.groupby('地区').agg({
    '销售额': 'sum',
    '成本': 'sum'
}).round(2)
region_summary['利润率'] = ((region_summary['销售额'] - region_summary['成本']) / region_summary['销售额'] * 100).round(2)
print(region_summary)
print()

# 按产品类别统计
print("按产品类别统计:")
category_summary = df.groupby('产品类别').agg({
    '销售额': 'sum',
    '成本': 'sum'
}).round(2)
category_summary['利润率'] = ((category_summary['销售额'] - category_summary['成本']) / category_summary['销售额'] * 100).round(2)
print(category_summary)
print()

# 按日期统计
print("按日期统计每日销售总额:")
daily_sales = df.groupby('日期')['销售额'].sum()
print(daily_sales)

print("\\n✓ 销售数据分析完成！")`,

    `# 分组聚合分析 - 高级技巧
print("分组聚合高级技巧")
print("=" * 50)

import pandas as pd

# 创建复杂数据集
data = {
    '部门': ['销售部', '销售部', '技术部', '技术部', '销售部', '技术部'],
    '员工': ['张三', '李四', '王五', '赵六', '孙七', '周八'],
    '月份': ['1月', '1月', '1月', '2月', '2月', '2月'],
    '销售额': [50000, 60000, 0, 0, 55000, 0],
    '项目数': [3, 5, 8, 10, 4, 12]
}
df = pd.DataFrame(data)

print("员工工作数据:")
print(df)
print()

# 1. 多维度分组聚合
print("按部门和月份分组:")
multi_stats = df.groupby(['部门', '月份']).agg({
    '销售额': 'sum',
    '项目数': 'mean'
}).round(2)
print(multi_stats)
print()

# 2. 数据透视表
print("数据透视表 - 各部门各月销售额:")
pivot_sales = pd.pivot_table(
    df, 
    values='销售额', 
    index='部门', 
    columns='月份', 
    aggfunc='sum',
    fill_value=0
)
print(pivot_sales)
print()

print("数据透视表 - 各部门各月项目数:")
pivot_projects = pd.pivot_table(
    df, 
    values='项目数', 
    index='部门', 
    columns='月份', 
    aggfunc='mean',
    fill_value=0
).round(2)
print(pivot_projects)
print()

# 3. 使用 agg 自定义聚合函数
def range_stats(x):
    return x.max() - x.min()

print("自定义聚合 - 销售额范围:")
custom_stats = df.groupby('部门')['销售额'].agg(['sum', 'mean', 'max', 'min', range_stats])
custom_stats.columns = ['总和', '平均值', '最大值', '最小值', '极差']
print(custom_stats.round(2))

print("\\n✓ 高级分组聚合练习完成！")`
  ];

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '学习 groupby、agg 等基础聚合函数的使用方法'
    },
    {
      id: 2,
      title: '实战案例：销售数据分析',
      description: '使用分组聚合进行真实的电商销售数据分析'
    },
    {
      id: 3,
      title: '高级技巧',
      description: '掌握多维度聚合、数据透视表等高级分析技术'
    }
  ];

  const placeholderCode = `# 在这里编写你的代码
# 点击"显示参考答案"按钮可以查看示例代码

# 提示：
# 1. 可以尝试使用 groupby() 进行数据分组
# 2. 可以使用 agg() 进行多种聚合操作
# 3. 可以使用 pivot_table() 创建数据透视表

`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 分组聚合分析</h1>
            <p className="text-text">学习数据分组和聚合操作，掌握 Pandas 中的 groupby 和 agg 技巧</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-purple-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-purple-600">首次加载需要下载必要的库，请耐心等待</p>
                </div>
              </div>
            </div>
          )}

          {pyodideStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">环境加载失败</h3>
                  <p className="mt-1 text-sm text-red-600">请检查网络连接后刷新页面重试</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">📚 学习路径</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProject(project.id - 1);
                    setCode('');
                    setResult(null);
                  }}
                  className={`p-4 rounded-xl text-left transition-all ${
                    activeProject === project.id - 1
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      activeProject === project.id - 1
                        ? 'bg-white text-primary'
                        : 'bg-primary text-white'
                    }`}>
                      {project.id}
                    </span>
                    <h3 className="font-semibold">{project.title}</h3>
                  </div>
                  <p className={`text-sm ${
                    activeProject === project.id - 1
                      ? 'text-purple-100'
                      : 'text-gray-600'
                  }`}>
                    {project.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 bg-accent rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">🎯 学习目标</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握 groupby() 分组操作的核心用法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">熟练使用 agg() 进行多种聚合操作</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够进行多维度数据分析和透视表操作</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">应用于实际业务场景的数据分析</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是分组聚合？</h3>
                    <p className="text-text mb-3">分组聚合是将数据按照某个或某些字段分组，然后对每个组进行统计计算的过程。</p>
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">💡 核心方法</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• groupby() - 按指定列分组</li>
                        <li>• agg() - 使用聚合函数（sum, mean, count, max, min 等）</li>
                        <li>• transform() - 分组后返回与原数据相同长度的结果</li>
                      </ul>
                    </div>
                    <div className="overflow-x-auto">
                      <p className="font-medium text-purple-700 mb-2">示例数据表：销售记录</p>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-purple-100">
                            <th className="border border-gray-300 px-4 py-2">地区</th>
                            <th className="border border-gray-300 px-4 py-2">产品</th>
                            <th className="border border-gray-300 px-4 py-2">销售额</th>
                            <th className="border border-gray-300 px-4 py-2">数量</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">华东</td>
                            <td className="border border-gray-300 px-4 py-2">手机</td>
                            <td className="border border-gray-300 px-4 py-2">15000</td>
                            <td className="border border-gray-300 px-4 py-2">15</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">华东</td>
                            <td className="border border-gray-300 px-4 py-2">电脑</td>
                            <td className="border border-gray-300 px-4 py-2">25000</td>
                            <td className="border border-gray-300 px-4 py-2">8</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">华北</td>
                            <td className="border border-gray-300 px-4 py-2">手机</td>
                            <td className="border border-gray-300 px-4 py-2">12000</td>
                            <td className="border border-gray-300 px-4 py-2">12</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">华北</td>
                            <td className="border border-gray-300 px-4 py-2">电脑</td>
                            <td className="border border-gray-300 px-4 py-2">18000</td>
                            <td className="border border-gray-300 px-4 py-2">6</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-sm text-gray-600">按"地区"分组后，可计算各地区的销售总额和总数量</p>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 销售数据分析实战</h3>
                    <p className="text-text mb-3">通过实际业务场景，学习如何运用分组聚合进行销售数据分析。</p>
                    <div className="overflow-x-auto">
                      <p className="font-medium text-purple-700 mb-2">电商销售数据集</p>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-purple-100">
                            <th className="border border-gray-300 px-4 py-2">日期</th>
                            <th className="border border-gray-300 px-4 py-2">地区</th>
                            <th className="border border-gray-300 px-4 py-2">产品类别</th>
                            <th className="border border-gray-300 px-4 py-2">销售额</th>
                            <th className="border border-gray-300 px-4 py-2">成本</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">2024-01-01</td>
                            <td className="border border-gray-300 px-4 py-2">华东</td>
                            <td className="border border-gray-300 px-4 py-2">电子产品</td>
                            <td className="border border-gray-300 px-4 py-2">¥15000</td>
                            <td className="border border-gray-300 px-4 py-2">¥10000</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">2024-01-01</td>
                            <td className="border border-gray-300 px-4 py-2">华北</td>
                            <td className="border border-gray-300 px-4 py-2">电子产品</td>
                            <td className="border border-gray-300 px-4 py-2">¥12000</td>
                            <td className="border border-gray-300 px-4 py-2">¥8000</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">2024-01-02</td>
                            <td className="border border-gray-300 px-4 py-2">华东</td>
                            <td className="border border-gray-300 px-4 py-2">服装</td>
                            <td className="border border-gray-300 px-4 py-2">¥8000</td>
                            <td className="border border-gray-300 px-4 py-2">¥5000</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">2024-01-02</td>
                            <td className="border border-gray-300 px-4 py-2">华南</td>
                            <td className="border border-gray-300 px-4 py-2">服装</td>
                            <td className="border border-gray-300 px-4 py-2">¥9500</td>
                            <td className="border border-gray-300 px-4 py-2">¥6000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">💡 分析思路</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• 按地区统计：了解各区域销售表现</li>
                        <li>• 按产品类别统计：分析产品结构</li>
                        <li>• 计算利润率：评估盈利能力</li>
                        <li>• 按时间统计：发现销售趋势</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📈 分组聚合高级技巧</h3>
                    <p className="text-text mb-3">掌握多维度分组和数据透视表，实现复杂数据分析需求。</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-700 mb-2">多维度分组</h4>
                        <p className="text-sm text-gray-600 mb-2">使用多个字段进行分组：</p>
                        <code className="text-xs bg-purple-100 px-2 py-1 rounded">
                          df.groupby(['部门', '月份'])
                        </code>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-700 mb-2">数据透视表</h4>
                        <p className="text-sm text-gray-600 mb-2">创建交叉分析表：</p>
                        <code className="text-xs bg-purple-100 px-2 py-1 rounded">
                          pd.pivot_table(df, values='销售额', index='部门', columns='月份')
                        </code>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <p className="font-medium text-purple-700 mb-2">多维度数据透视表示例</p>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-purple-100">
                            <th className="border border-gray-300 px-4 py-2" rowSpan={2}>部门</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan={2}>1月</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan={2}>2月</th>
                          </tr>
                          <tr className="bg-purple-50">
                            <th className="border border-gray-300 px-4 py-2">销售额</th>
                            <th className="border border-gray-300 px-4 py-2">项目数</th>
                            <th className="border border-gray-300 px-4 py-2">销售额</th>
                            <th className="border border-gray-300 px-4 py-2">项目数</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-medium">销售部</td>
                            <td className="border border-gray-300 px-4 py-2">110000</td>
                            <td className="border border-gray-300 px-4 py-2">8</td>
                            <td className="border border-gray-300 px-4 py-2">55000</td>
                            <td className="border border-gray-300 px-4 py-2">4</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-medium">技术部</td>
                            <td className="border border-gray-300 px-4 py-2">0</td>
                            <td className="border border-gray-300 px-4 py-2">8</td>
                            <td className="border border-gray-300 px-4 py-2">0</td>
                            <td className="border border-gray-300 px-4 py-2">10</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">💡 高级技巧</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• 使用自定义聚合函数处理特殊需求</li>
                        <li>• 结合 fill_value 处理缺失值</li>
                        <li>• 使用 agg 和 lambda 表达式实现复杂逻辑</li>
                        <li>• 利用 namedAgg 给聚合列命名</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验分组聚合的威力！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || placeholderCode}
                  onChange={handleCodeChange}
                  name="group-aggregation-editor"
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="rounded-lg shadow-md"
                  style={{ height: '350px', width: '100%' }}
                />
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleRunCode}
                  disabled={isLoading || pyodideStatus !== 'ready'}
                  className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${
                    isLoading || pyodideStatus !== 'ready'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-secondary hover:shadow-button-hover transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      运行中...
                    </span>
                  ) : (
                    '▶ 运行代码'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setCode(defaultCodes[activeProject]);
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  💡 显示参考答案
                </button>
                
                <button
                  onClick={() => {
                    setCode(placeholderCode);
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-full font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  重置代码
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-900 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-sm text-gray-400">运行结果</span>
              </div>
              
              {!result ? (
                <div className="text-gray-400 flex items-center justify-center py-8">
                  <span className="text-2xl mr-2">⌨️</span>
                  <span>点击"运行代码"查看输出结果</span>
                </div>
              ) : result.success ? (
                <div className="space-y-3">
                  {result.output && (
                    <div>
                      <pre className="text-green-400 whitespace-pre-wrap font-mono text-sm">{result.output}</pre>
                    </div>
                  )}
                  {!result.output && !result.stdout && (
                    <div className="text-green-400 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      代码执行成功！
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-red-400 font-semibold mb-1">
                          {result.error?.type || '执行错误'}
                        </h4>
                        <p className="text-red-300 text-sm">{result.error?.message}</p>
                        {result.error?.lineNumber && (
                          <p className="text-red-400 text-xs mt-2">📍 错误位置: 第 {result.error.lineNumber} 行</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {result.stdout && (
                    <div className="text-gray-400 text-sm">
                      <p className="font-semibold mb-1">标准输出:</p>
                      <pre className="text-gray-300 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-purple rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">📝 课后思考</h2>
            <div className="space-y-3">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">1. GROUP BY 和 GROUPING SETS 有什么区别？</p>
                <p className="text-sm text-gray-600">提示：考虑灵活性、性能和使用场景</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 如何处理分组聚合中的空值（NULL）？</p>
                <p className="text-sm text-gray-600">提示：思考 coalesce、fillna 等方法的应用</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">3. 在实际项目中，如何选择聚合的粒度？</p>
                <p className="text-sm text-gray-600">提示：考虑数据量、查询性能和业务需求</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">4. 数据透视表和普通 groupby 有什么优势？</p>
                <p className="text-sm text-gray-600">提示：关注数据展示的直观性和易读性</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAggregation;
