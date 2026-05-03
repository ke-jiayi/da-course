import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const AnomalyDetection: React.FC = () => {
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

  const placeholderCode = `# 在这里编写你的代码
# 点击"显示参考答案"按钮可以查看示例代码

# 提示：
# 1. 尝试修改数据值，观察异常检测结果的变化
# 2. 调整Z-Score或IQR的阈值参数
# 3. 添加更多数据点进行测试

`;

  const answerCode = `# 异常值检测 - 参考答案
import math

print("=" * 50)
print("异常值检测实战练习")
print("=" * 50)

# ==================== Z-Score 方法 ====================
print("\\n【方法一：Z-Score 检测异常值】")
print("-" * 40)

data_zscore = [120, 135, 128, 142, 138, 125, 130, 145, 132, 128,
               135, 140, 500, 138, 142, 125, 130, 135, 140, 128]

n = len(data_zscore)
mean = sum(data_zscore) / n
variance = sum((x - mean) ** 2 for x in data_zscore) / n
std_dev = math.sqrt(variance)

print(f"数据集: {data_zscore}")
print(f"数据量: {n}")
print(f"均值: {mean:.2f}")
print(f"标准差: {std_dev:.2f}")
print(f"\\nZ-Score 阈值: 2.5")
print("\\n检测结果:")

anomalies = []
for i, value in enumerate(data_zscore):
    z_score = (value - mean) / std_dev
    status = "⚠️ 异常" if abs(z_score) > 2.5 else "✓ 正常"
    print(f"  #{i:2d}: 值={value:4d}, Z={z_score:7.2f} {status}")
    if abs(z_score) > 2.5:
        anomalies.append((i, value, z_score))

print(f"\\n共检测到 {len(anomalies)} 个异常值")

# ==================== IQR 方法 ====================
print("\\n【方法二：IQR 四分位距检测异常值】")
print("-" * 40)

data_iqr = [120, 135, 128, 142, 138, 125, 130, 145, 132, 128,
            135, 140, 500, 138, 142, 125, 130, 135, 140, 128]

sorted_data = sorted(data_iqr)
n = len(sorted_data)

q1_index = n // 4
q3_index = 3 * n // 4
q1 = sorted_data[q1_index]
q3 = sorted_data[q3_index]
iqr = q3 - q1

lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

print(f"数据排序后: {sorted_data}")
print(f"Q1 (25%分位): {q1}")
print(f"Q3 (75%分位): {q3}")
print(f"IQR (四分位距): {iqr}")
print(f"正常范围: [{lower_bound:.2f}, {upper_bound:.2f}]")
print("\\n检测结果:")

iqr_anomalies = []
for i, value in enumerate(data_iqr):
    if value < lower_bound or value > upper_bound:
        iqr_anomalies.append((i, value))
        print(f"  #{i:2d}: 值={value:4d} ⚠️ 异常")
    else:
        print(f"  #{i:2d}: 值={value:4d} ✓ 正常")

print(f"\\n共检测到 {len(iqr_anomalies)} 个异常值")

# ==================== 统计汇总 ====================
print("\\n【统计汇总】")
print("-" * 40)
print(f"Z-Score 方法异常数: {len(anomalies)}")
print(f"IQR 方法异常数: {len(iqr_anomalies)}")

print("\\n✓ 异常值检测完成！")
print("提示: 尝试调整阈值参数，观察检测结果的变化")`;

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '学习Z-Score和IQR方法的核心原理'
    },
    {
      id: 2,
      title: '实战案例：交易异常检测',
      description: '使用异常检测识别金融交易中的可疑行为'
    },
    {
      id: 3,
      title: '高级技巧：多维异常检测',
      description: '掌握多特征异常检测和数据可视化'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 异常值检测</h1>
            <p className="text-text">学习异常检测算法，识别数据中的异常模式和离群点</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-rose-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-rose-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-rose-100'
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
                <p className="text-text text-sm">理解异常值的定义、类型及其业务意义</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握Z-Score和IQR两种核心检测方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够处理交易数据中的异常检测实战问题</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">了解多维异常检测的可视化分析方法</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是异常值？</h3>
                    <p className="text-text mb-3">异常值是指与数据集中大多数观测值显著不同的数据点，可能是数据录入错误、设备故障或真实的异常事件。</p>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-rose-800 mb-2">异常类型</p>
                      <ul className="text-sm text-rose-700 space-y-1">
                        <li>• <strong>点异常</strong>：单个数据点偏离正常范围（如信用卡突然大额消费）</li>
                        <li>• <strong>上下文异常</strong>：在特定情境下异常（如凌晨的购物行为）</li>
                        <li>• <strong>集体异常</strong>：一组数据点共同构成异常（如连续多次失败交易）</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Z-Score 方法</h3>
                    <p className="text-text mb-3">Z-Score（标准分数）表示数据点偏离均值的标准差倍数。</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">公式</p>
                      <code className="text-blue-900 font-mono text-sm">Z = (x - μ) / σ</code>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• x：数据点的值</li>
                        <li>• μ：数据集的均值</li>
                        <li>• σ：数据集的标准差</li>
                        <li>• 通常 |Z| {'>'} 3 视为异常</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">IQR 方法</h3>
                    <p className="text-text mb-3">IQR（四分位距）基于数据的分布特征识别异常值。</p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">公式</p>
                      <code className="text-purple-900 font-mono text-sm">IQR = Q3 - Q1</code>
                      <p className="text-sm text-purple-700 mt-1">正常范围：[Q1 - 1.5×IQR, Q3 + 1.5×IQR]</p>
                      <div className="overflow-x-auto mt-3">
                        <table className="w-full border-collapse border border-purple-300 text-sm">
                          <thead>
                            <tr className="bg-purple-100">
                              <th className="border border-purple-300 px-3 py-2 text-left">参数</th>
                              <th className="border border-purple-300 px-3 py-2 text-left">说明</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-purple-300 px-3 py-2">Q1 (25%分位)</td>
                              <td className="border border-purple-300 px-3 py-2">数据排序后25%位置的数值</td>
                            </tr>
                            <tr>
                              <td className="border border-purple-300 px-3 py-2">Q3 (75%分位)</td>
                              <td className="border border-purple-300 px-3 py-2">数据排序后75%位置的数值</td>
                            </tr>
                            <tr>
                              <td className="border border-purple-300 px-3 py-2">IQR</td>
                              <td className="border border-purple-300 px-3 py-2">四分位距，反映数据中间50%的跨度</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 交易异常检测实战</h3>
                    <p className="text-text mb-3">在金融风控场景中，异常检测用于识别欺诈交易、洗钱行为等可疑活动。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">交易ID</th>
                            <th className="border border-gray-300 px-4 py-2">金额(元)</th>
                            <th className="border border-gray-300 px-4 py-2">时间</th>
                            <th className="border border-gray-300 px-4 py-2">Z-Score</th>
                            <th className="border border-gray-300 px-4 py-2">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">TX001</td>
                            <td className="border border-gray-300 px-4 py-2">120</td>
                            <td className="border border-gray-300 px-4 py-2">09:15</td>
                            <td className="border border-gray-300 px-4 py-2">-1.23</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">正常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">TX002</td>
                            <td className="border border-gray-300 px-4 py-2">135</td>
                            <td className="border border-gray-300 px-4 py-2">10:30</td>
                            <td className="border border-gray-300 px-4 py-2">-0.56</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">正常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">TX003</td>
                            <td className="border border-gray-300 px-4 py-2">128</td>
                            <td className="border border-gray-300 px-4 py-2">11:45</td>
                            <td className="border border-gray-300 px-4 py-2">-0.89</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">正常</td>
                          </tr>
                          <tr className="bg-rose-50">
                            <td className="border border-gray-300 px-4 py-2">TX004</td>
                            <td className="border border-gray-300 px-4 py-2 font-bold text-rose-600">500</td>
                            <td className="border border-gray-300 px-4 py-2">14:20</td>
                            <td className="border border-gray-300 px-4 py-2 text-rose-600 font-bold">3.85</td>
                            <td className="border border-gray-300 px-4 py-2 text-rose-600 font-bold">异常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">TX005</td>
                            <td className="border border-gray-300 px-4 py-2">142</td>
                            <td className="border border-gray-300 px-4 py-2">15:00</td>
                            <td className="border border-gray-300 px-4 py-2">0.21</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">正常</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-amber-800 mb-2">💡 检测结果分析</p>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• TX004 交易金额500元显著偏离正常范围</li>
                        <li>• Z-Score = 3.85，远超阈值3</li>
                        <li>• 建议：触发人工审核流程</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🤖 多维异常检测</h3>
                    <p className="text-text mb-3">单变量检测只考虑一个特征，多维检测综合考虑多个特征的组合异常。</p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-800 mb-3">多维异常检测示例数据</p>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-3 py-2">用户ID</th>
                              <th className="border border-gray-300 px-3 py-2">消费金额</th>
                              <th className="border border-gray-300 px-3 py-2">交易次数</th>
                              <th className="border border-gray-300 px-3 py-2">登录时段</th>
                              <th className="border border-gray-300 px-3 py-2">风险评分</th>
                              <th className="border border-gray-300 px-3 py-2">状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">U001</td>
                              <td className="border border-gray-300 px-3 py-2">2500</td>
                              <td className="border border-gray-300 px-3 py-2">15</td>
                              <td className="border border-gray-300 px-3 py-2">白天</td>
                              <td className="border border-gray-300 px-3 py-2">低</td>
                              <td className="border border-gray-300 px-3 py-2 text-green-600">正常</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">U002</td>
                              <td className="border border-gray-300 px-3 py-2">2800</td>
                              <td className="border border-gray-300 px-3 py-2">18</td>
                              <td className="border border-gray-300 px-3 py-2">白天</td>
                              <td className="border border-gray-300 px-3 py-2">低</td>
                              <td className="border border-gray-300 px-3 py-2 text-green-600">正常</td>
                            </tr>
                            <tr className="bg-rose-50">
                              <td className="border border-gray-300 px-3 py-2">U003</td>
                              <td className="border border-gray-300 px-3 py-2 font-bold text-rose-600">15000</td>
                              <td className="border border-gray-300 px-3 py-2 font-bold text-rose-600">50</td>
                              <td className="border border-gray-300 px-3 py-2">凌晨</td>
                              <td className="border border-gray-300 px-3 py-2 text-rose-600 font-bold">高</td>
                              <td className="border border-gray-300 px-3 py-2 text-rose-600 font-bold">异常</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-800 mb-2">Isolation Forest</h4>
                        <p className="text-sm text-purple-700">通过随机分割数据来隔离异常点，异常点更容易被隔离出来</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">DBSCAN</h4>
                        <p className="text-sm text-blue-700">基于密度的聚类，不属于任何密集区域的数据点被视为异常</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验异常值检测的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || placeholderCode}
                  onChange={handleCodeChange}
                  name="anomaly-detection-editor"
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="rounded-lg shadow-md"
                  style={{ height: '400px', width: '100%' }}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
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
                  className="px-6 py-3 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg"
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
          </div>

          <div className="mb-8 bg-gray-900 text-white rounded-xl p-6 shadow-lg">
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
                {result.stdout && (
                  <div>
                    <pre className="text-green-400 whitespace-pre-wrap font-mono text-sm">{result.stdout}</pre>
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

          <div className="bg-purple-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">📝 课后思考</h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium mb-2">1. Z-Score 和 IQR 方法各有优缺点，实际应用中如何选择？</p>
                <p className="text-sm text-gray-600">提示：考虑数据分布特征、异常检测的敏感性、计算效率等因素</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium mb-2">2. 在交易风控场景中，除了统计方法，还有哪些异常检测策略？</p>
                <p className="text-sm text-gray-600">提示：考虑规则引擎、机器学习模型、行为分析等方法的组合应用</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium mb-2">3. 如何处理异常检测中的误报和漏报问题？</p>
                <p className="text-sm text-gray-600">提示：考虑阈值调整、人工审核机制、模型持续优化等方案</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;
