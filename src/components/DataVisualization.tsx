import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const DataVisualization: React.FC = () => {
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

  const defaultCode = `# 数据可视化基础练习
print("欢迎学习数据可视化！")
print("=" * 40)

# 1. 基础计算
numbers = [10, 25, 30, 45, 50]
total = sum(numbers)
average = total / len(numbers)
print(f"数字列表: {numbers}")
print(f"总和: {total}")
print(f"平均值: {average}")

# 2. 简单的数据处理
products = ["手机", "电脑", "平板", "耳机"]
prices = [2999, 5999, 2499, 599]

print("\n产品列表:")
for i, (product, price) in enumerate(zip(products, prices), 1):
    print(f"  {i}. {product}: ¥{price}")

# 3. 计算增长率
sales_2023 = 120000
sales_2024 = 156000
growth_rate = (sales_2024 - sales_2023) / sales_2023 * 100
print(f"\n销售额增长率: {growth_rate:.1f}%")

print("\n✓ 练习完成！尝试修改代码看看效果")`;

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '学习数据可视化的基本概念和常见图表类型'
    },
    {
      id: 2,
      title: '项目实战：销售数据分析',
      description: '使用Python进行电商销售数据的分析与可视化'
    },
    {
      id: 3,
      title: '图表类型详解',
      description: '深入了解折线图、柱状图、饼图和散点图的应用场景'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 数据可视化实战</h1>
            <p className="text-text">学习使用Python进行数据可视化，掌握常见图表的创建方法</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-blue-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-blue-600">首次加载需要下载必要的库，请耐心等待</p>
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
                  onClick={() => setActiveProject(project.id - 1)}
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
                      ? 'text-blue-100'
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
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解数据可视化的重要性和最佳实践</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握常见图表类型的特点和适用场景</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会使用Python处理和展示数据</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够根据数据特点选择合适的可视化方式</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是数据可视化？</h3>
                    <p className="text-text mb-3">数据可视化是将数据转换为图形或图表的过程，目的是使数据更容易理解和解释。</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">💡 为什么重要？</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• 人眼对视觉信息的处理速度比文字快得多</li>
                        <li>• 帮助发现数据中的模式和趋势</li>
                        <li>• 让复杂数据变得直观易懂</li>
                        <li>• 有效支持商业决策和沟通</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 电商销售数据分析案例</h3>
                    <p className="text-text mb-3">让我们分析一个月的销售数据，了解业务表现。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">产品</th>
                            <th className="border border-gray-300 px-4 py-2">销量</th>
                            <th className="border border-gray-300 px-4 py-2">单价</th>
                            <th className="border border-gray-300 px-4 py-2">销售额</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">手机</td>
                            <td className="border border-gray-300 px-4 py-2">120</td>
                            <td className="border border-gray-300 px-4 py-2">¥2999</td>
                            <td className="border border-gray-300 px-4 py-2">¥359,880</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">电脑</td>
                            <td className="border border-gray-300 px-4 py-2">85</td>
                            <td className="border border-gray-300 px-4 py-2">¥5999</td>
                            <td className="border border-gray-300 px-4 py-2">¥509,915</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">平板</td>
                            <td className="border border-gray-300 px-4 py-2">156</td>
                            <td className="border border-gray-300 px-4 py-2">¥2499</td>
                            <td className="border border-gray-300 px-4 py-2">¥389,844</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📈 常见图表类型</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">折线图</h4>
                        <p className="text-sm text-text mb-2">展示数据随时间的变化趋势</p>
                        <p className="text-xs text-gray-600">适用：销售趋势、温度变化、股票走势</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">柱状图</h4>
                        <p className="text-sm text-text mb-2">比较不同类别的数据大小</p>
                        <p className="text-xs text-gray-600">适用：销量排行、地区对比、占比比较</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">饼图</h4>
                        <p className="text-sm text-text mb-2">显示各部分占整体的比例</p>
                        <p className="text-xs text-gray-600">适用：市场份额、预算分配、分类统计</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">散点图</h4>
                        <p className="text-sm text-text mb-2">展示两个变量之间的关系</p>
                        <p className="text-xs text-gray-600">适用：广告投入vs销量、身高vs体重</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验数据处理的乐趣！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="data-visualization-editor"
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="rounded-lg shadow-md"
                  style={{ height: '350px', width: '100%' }}
                />
              </div>
              
              <div className="flex items-center gap-4">
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
                    setCode(defaultCode);
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
                <p className="font-medium mb-2">1. 如何选择合适的图表类型？</p>
                <p className="text-sm text-gray-600">提示：考虑数据的特点（类别、时间、关系）和你想传达的信息</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 数据可视化有哪些常见误区？</p>
                <p className="text-sm text-gray-600">提示：避免截断坐标轴、选择合适的比例、使用误导性的颜色</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
