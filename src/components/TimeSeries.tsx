import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const TimeSeries: React.FC = () => {
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

  const defaultCode = `# 时间序列分析练习
print("欢迎学习时间序列分析！")
print("=" * 40)

# 1. 模拟销售数据（12个月）
months = ["1月", "2月", "3月", "4月", "5月", "6月", 
          "7月", "8月", "9月", "10月", "11月", "12月"]
sales = [120, 135, 150, 145, 160, 175, 180, 190, 185, 200, 210, 230]

print("月度销售数据:")
for m, s in zip(months, sales):
    print(f"  {m}: {s}万元")

# 2. 计算基本统计量
avg_sales = sum(sales) / len(sales)
max_sales = max(sales)
min_sales = min(sales)

print(f"\\n基本统计:")
print(f"  平均销售额: {avg_sales:.1f}万元")
print(f"  最高销售额: {max_sales}万元 ({months[sales.index(max_sales)]})")
print(f"  最低销售额: {min_sales}万元 ({months[sales.index(min_sales)]})")

# 3. 计算环比增长率
print("\\n环比增长率:")
growth_rates = []
for i in range(1, len(sales)):
    rate = (sales[i] - sales[i-1]) / sales[i-1] * 100
    growth_rates.append(rate)
    print(f"  {months[i]}: {rate:+.1f}%")

# 4. 计算移动平均（3个月）
print("\\n3个月移动平均:")
ma_3 = []
for i in range(2, len(sales)):
    ma = (sales[i-2] + sales[i-1] + sales[i]) / 3
    ma_3.append(ma)
    print(f"  {months[i]}: {ma:.1f}万元")

# 5. 简单趋势预测（线性增长）
avg_growth = sum(growth_rates) / len(growth_rates)
next_month = sales[-1] * (1 + avg_growth/100)
print(f"\\n预测下月销售额: {next_month:.1f}万元")

print("\\n✓ 时间序列分析完成！")`;

  const answerCode = `# 移动平均计算示例
print("移动平均法 - 平滑时间序列")
print("=" * 40)

# 模拟某公司近12个月的销售数据（单位：万元）
sales_data = [42, 48, 55, 51, 58, 65, 70, 68, 75, 82, 88, 95]
months = ["1月", "2月", "3月", "4月", "5月", "6月",
          "7月", "8月", "9月", "10月", "11月", "12月"]

print("原始销售数据:")
for m, s in zip(months, sales_data):
    print(f"  {m}: {s}万元")

# 1. 计算简单移动平均（SMA）- 3个月窗口
print("\\n【3个月简单移动平均】")
sma_3 = []
for i in range(len(sales_data) - 2):
    ma = sum(sales_data[i:i+3]) / 3
    sma_3.append(ma)
    print(f"  {months[i+2]}: {ma:.2f}万元")

# 2. 计算加权移动平均（WMA）- 3个月窗口，权重[1,2,3]
print("\\n【3个月加权移动平均】")
weights = [1, 2, 3]
wma_3 = []
for i in range(len(sales_data) - 2):
    weighted_sum = sum(sales_data[i:i+3][j] * weights[j] for j in range(3))
    ma = weighted_sum / sum(weights)
    wma_3.append(ma)
    print(f"  {months[i+2]}: {ma:.2f}万元")

# 3. 简单趋势分析 - 计算增长率
print("\\n【月环比增长率分析】")
growth_rates = []
for i in range(1, len(sales_data)):
    rate = (sales_data[i] - sales_data[i-1]) / sales_data[i-1] * 100
    growth_rates.append(rate)
    trend = "↑" if rate > 0 else "↓"
    print(f"  {months[i]}: {rate:+.2f}% {trend}")

# 4. 简单预测 - 基于平均增长率
avg_growth = sum(growth_rates) / len(growth_rates)
next_month_prediction = sales_data[-1] * (1 + avg_growth/100)
print(f"\\n【预测下月销售额】")
print(f"  基于历史增长率预测: {next_month_prediction:.2f}万元")
print(f"  平均月增长率: {avg_growth:.2f}%")

# 5. 季节性分析示例
print("\\n【季节性因素分析】")
# 假设Q4是销售旺季
quarters = {
    "Q1": [42, 48, 55],
    "Q2": [51, 58, 65],
    "Q3": [70, 68, 75],
    "Q4": [82, 88, 95]
}
for q, values in quarters.items():
    avg = sum(values) / len(values)
    print(f"  {q}平均: {avg:.2f}万元")

print("\\n✓ 完整的时间序列分析完成！")
print("提示：尝试修改数据，观察分析结果的变化！")`;

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '趋势、季节性、周期性和随机性'
    },
    {
      id: 2,
      title: '实战案例：销售预测',
      description: '使用移动平均法进行销售预测'
    },
    {
      id: 3,
      title: '高级技巧',
      description: '指数平滑与趋势分析方法'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 时间序列分析</h1>
            <p className="text-text">学习时间序列数据的分析方法，掌握预测和趋势分析技术</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-indigo-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-indigo-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-indigo-100'
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
                <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解时间序列数据的组成要素</p>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握趋势和季节性分析方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会使用移动平均等技术</p>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够进行简单的时间序列预测</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">时间序列的四大组成要素</h3>
                    <p className="text-text mb-3">时间序列数据通常由趋势、季节性、周期性和随机性四个部分组成，理解这些要素是进行时间序列分析的基础。</p>
                    <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-indigo-800 mb-2">💡 核心概念</p>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• 趋势(Trend, T)：长期上升或下降的方向，反映整体发展态势</li>
                        <li>• 季节性(Seasonal, S)：周期性的重复模式，如春夏秋冬、节假日</li>
                        <li>• 周期性(Cyclical, C)：非固定周期的波动，通常与经济周期相关</li>
                        <li>• 随机性(Residual, R)：不可预测的随机波动，又称残差或噪声</li>
                      </ul>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">要素</th>
                            <th className="border border-gray-300 px-4 py-2">周期</th>
                            <th className="border border-gray-300 px-4 py-2">示例</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-medium">趋势</td>
                            <td className="border border-gray-300 px-4 py-2">长期（数年以上）</td>
                            <td className="border border-gray-300 px-4 py-2">公司营收持续增长</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-medium">季节性</td>
                            <td className="border border-gray-300 px-4 py-2">固定周期（年/月/周）</td>
                            <td className="border border-gray-300 px-4 py-2">空调夏季销量上升</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-medium">周期性</td>
                            <td className="border border-gray-300 px-4 py-2">不固定（数年）</td>
                            <td className="border border-gray-300 px-4 py-2">经济危机周期</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-medium">随机性</td>
                            <td className="border border-gray-300 px-4 py-2">无规律</td>
                            <td className="border border-gray-300 px-4 py-2">突发事件影响</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 销售预测实战案例</h3>
                    <p className="text-text mb-3">某电商公司2023年月度销售额数据，让我们用移动平均法进行预测分析。</p>
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">月份</th>
                            <th className="border border-gray-300 px-4 py-2">销售额(万元)</th>
                            <th className="border border-gray-300 px-4 py-2">环比增长</th>
                            <th className="border border-gray-300 px-4 py-2">3月移动平均</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">1月</td>
                            <td className="border border-gray-300 px-4 py-2">120</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">2月</td>
                            <td className="border border-gray-300 px-4 py-2">135</td>
                            <td className="border border-gray-300 px-4 py-2">+12.5%</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">3月</td>
                            <td className="border border-gray-300 px-4 py-2">150</td>
                            <td className="border border-gray-300 px-4 py-2">+11.1%</td>
                            <td className="border border-gray-300 px-4 py-2">135.0</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">4月</td>
                            <td className="border border-gray-300 px-4 py-2">145</td>
                            <td className="border border-gray-300 px-4 py-2">-3.3%</td>
                            <td className="border border-gray-300 px-4 py-2">143.3</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">...</td>
                            <td className="border border-gray-300 px-4 py-2">...</td>
                            <td className="border border-gray-300 px-4 py-2">...</td>
                            <td className="border border-gray-300 px-4 py-2">...</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">12月</td>
                            <td className="border border-gray-300 px-4 py-2">230</td>
                            <td className="border border-gray-300 px-4 py-2">+9.5%</td>
                            <td className="border border-gray-300 px-4 py-2">208.3</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-indigo-800 mb-2">💡 移动平均法公式</p>
                      <p className="text-sm text-indigo-700 mb-2">
                        <strong>简单移动平均(SMA)：</strong>MAₙ = (X₁ + X₂ + ... + Xₙ) / n
                      </p>
                      <p className="text-sm text-indigo-700">
                        <strong>加权移动平均(WMA)：</strong>WMA = Σ(Xᵢ × Wᵢ) / ΣWᵢ
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔮 高级预测方法</h3>
                    <p className="text-text mb-3">掌握更精确的时间序列预测技术，提升预测准确性。</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">指数平滑法</h4>
                        <p className="text-sm text-text mb-2">给予近期数据更高权重</p>
                        <div className="bg-white p-3 rounded border">
                          <code className="text-xs text-gray-700">
                            Sₜ = α·Xₜ₋₁ + (1-α)·Sₜ₋₁
                          </code>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">α: 平滑系数 (0-1)</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">趋势分析</h4>
                        <p className="text-sm text-text mb-2">线性回归拟合趋势线</p>
                        <div className="bg-white p-3 rounded border">
                          <code className="text-xs text-gray-700">
                            ŷ = β₀ + β₁·t
                          </code>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">β₀: 截距, β₁: 斜率</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-indigo-800 mb-2">💡 方法选择建议</p>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• 数据波动小 → 简单移动平均</li>
                        <li>• 数据趋势明显 → 指数平滑或趋势分析</li>
                        <li>• 数据有季节性 → 季节性分解或SARIMA</li>
                        <li>• 复杂模式 → ARIMA、Prophet、深度学习模型</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验时间序列分析的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="time-series-editor"
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
                    setCode(answerCode);
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  💡 显示参考答案
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
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-purple rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">📝 课后思考</h2>
            <div className="space-y-3">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">1. 为什么移动平均能够平滑时间序列中的波动？</p>
                <p className="text-sm text-gray-600">提示：考虑多个数据点的平均如何减少随机因素的影响</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 如何选择合适的移动平均窗口大小？</p>
                <p className="text-sm text-gray-600">提示：考虑数据的周期性和对平滑程度的要求</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">3. 简单预测方法有哪些局限性？</p>
                <p className="text-sm text-gray-600">提示：考虑数据模式变化、季节性因素和长期预测</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSeries;
