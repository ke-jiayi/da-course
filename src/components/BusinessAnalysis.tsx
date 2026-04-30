import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const BusinessAnalysis: React.FC = () => {
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

  const defaultCode = `# 商业数据分析基础练习
print("欢迎学习商业数据分析！")
print("=" * 40)

# 1. 基础商业指标计算
sales = [120, 150, 180, 160, 200, 220]
orders = [600, 750, 900, 800, 1000, 1100]

total_sales = sum(sales)
total_orders = sum(orders)
avg_order_value = total_sales / total_orders

print(f"总销售额: ¥{total_sales}万")
print(f"总订单数: {total_orders}")
print(f"平均订单价值: ¥{avg_order_value:.2f}")

# 2. 月度增长率计算
print("\\n月度增长率:")
for i in range(1, len(sales)):
    growth = (sales[i] - sales[i-1]) / sales[i-1] * 100
    month = f"{i+1}月"
    print(f"  {month}: {growth:+.1f}%")

# 3. 产品分类统计
products = {
    "手机": 299900,
    "电脑": 509900,
    "平板": 389844
}

print("\\n产品销售额排名:")
for product, amount in sorted(products.items(), key=lambda x: x[1], reverse=True):
    print(f"  {product}: ¥{amount:,}")

print("\\n✓ 练习完成！尝试修改数据进行分析")`;

  const projects = [
    {
      id: 1,
      title: '核心KPI指标',
      description: '学习销售额、订单量、转化率等关键商业指标'
    },
    {
      id: 2,
      title: '项目实战：经营分析',
      description: '进行月度经营数据分析，制定优化策略'
    },
    {
      id: 3,
      title: '多维度分析',
      description: '从时间、渠道、产品等维度进行深度分析'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 商业数据计算与分析</h1>
            <p className="text-text">学习核心商业指标计算，掌握数据驱动的决策方法</p>
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
                <p className="text-text text-sm">理解核心商业指标的含义和计算方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握多维度数据分析的基本思路</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会使用Python进行商业数据计算</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够将数据转化为商业决策建议</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是KPI（关键绩效指标）？</h3>
                    <p className="text-text mb-3">KPI是衡量业务绩效的可量化指标，帮助企业跟踪目标完成情况。</p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">💡 常见的商业指标</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded">
                          <p className="font-medium text-purple-700">销售额 (GMR)</p>
                          <p className="text-xs text-gray-600">总销售收入</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="font-medium text-purple-700">平均订单价值 (AOV)</p>
                          <p className="text-xs text-gray-600">销售额 / 订单数</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="font-medium text-purple-700">转化率 (CR)</p>
                          <p className="text-xs text-gray-600">访客中完成购买的比例</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="font-medium text-purple-700">复购率 (RR)</p>
                          <p className="text-xs text-gray-600">重复购买的客户比例</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 月度经营分析案例</h3>
                    <p className="text-text mb-3">通过数据分析了解业务表现，制定优化策略。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">月份</th>
                            <th className="border border-gray-300 px-4 py-2">销售额(万)</th>
                            <th className="border border-gray-300 px-4 py-2">订单数</th>
                            <th className="border border-gray-300 px-4 py-2">毛利率</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Q1</td>
                            <td className="border border-gray-300 px-4 py-2">450</td>
                            <td className="border border-gray-300 px-4 py-2">22,500</td>
                            <td className="border border-gray-300 px-4 py-2">41%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Q2</td>
                            <td className="border border-gray-300 px-4 py-2">580</td>
                            <td className="border border-gray-300 px-4 py-2">29,000</td>
                            <td className="border border-gray-300 px-4 py-2">44%</td>
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
                    <h3 className="font-semibold text-lg mb-2">🔍 多维度分析方法</h3>
                    <p className="text-text mb-3">单一维度只能告诉我们"发生了什么"，多维度分析才能告诉我们"为什么"。</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">时间维度</h4>
                        <p className="text-sm text-text mb-2">日、周、月、季度、年</p>
                        <p className="text-xs text-gray-600">分析趋势和季节性规律</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">渠道维度</h4>
                        <p className="text-sm text-text mb-2">线上、线下、不同平台</p>
                        <p className="text-xs text-gray-600">评估渠道效率和ROI</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">产品维度</h4>
                        <p className="text-sm text-text mb-2">类别、品牌、价格区间</p>
                        <p className="text-xs text-gray-600">识别爆款和滞销品</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">客户维度</h4>
                        <p className="text-sm text-text mb-2">新/老客户、地区、年龄段</p>
                        <p className="text-xs text-gray-600">细分市场精准营销</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验商业数据分析！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="business-analysis-editor"
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
                <p className="font-medium mb-2">1. 如何选择关键KPI来衡量业务健康度？</p>
                <p className="text-sm text-gray-600">提示：考虑业务目标、行业特点、数据的可获取性</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 数据分析结果如何转化为行动建议？</p>
                <p className="text-sm text-gray-600">提示：从数据洞察→问题诊断→解决方案→执行计划</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalysis;
