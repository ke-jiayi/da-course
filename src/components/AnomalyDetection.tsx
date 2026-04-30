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

  const defaultCode = `# 异常值检测练习
import math

print("欢迎学习异常值检测！")
print("=" * 40)

# 1. 模拟交易数据
transactions = [120, 135, 128, 142, 138, 125, 130, 145, 132, 128,
                135, 140, 500, 138, 142, 125, 130, 135, 140, 128]

print("交易数据:")
print(f"  数据量: {len(transactions)}")
print(f"  数据: {transactions}")

# 2. 计算基本统计量
mean = sum(transactions) / len(transactions)
variance = sum((x - mean) ** 2 for x in transactions) / len(transactions)
std_dev = math.sqrt(variance)

print(f"\n基本统计:")
print(f"  均值: {mean:.1f}")
print(f"  标准差: {std_dev:.1f}")

# 3. Z-score方法检测异常值
print("\nZ-score方法 (|z| > 3 为异常):")
anomalies_zscore = []
for i, value in enumerate(transactions):
    z_score = (value - mean) / std_dev
    if abs(z_score) > 3:
        anomalies_zscore.append((i, value, z_score))
        print(f"  异常值 #{i}: {value} (z={z_score:.2f})")

if not anomalies_zscore:
    print("  未检测到异常值")

# 4. IQR方法检测异常值
sorted_data = sorted(transactions)
n = len(sorted_data)
q1 = sorted_data[n // 4]
q3 = sorted_data[3 * n // 4]
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

print(f"\nIQR方法:")
print(f"  Q1: {q1}, Q3: {q3}")
print(f"  IQR: {iqr}")
print(f"  正常范围: [{lower_bound:.1f}, {upper_bound:.1f}]")

anomalies_iqr = [(i, v) for i, v in enumerate(transactions) 
                  if v < lower_bound or v > upper_bound]
print(f"  检测到异常值: {len(anomalies_iqr)}个")
for idx, val in anomalies_iqr:
    print(f"    #{idx}: {val}")

print("\n✓ 异常值检测完成！")`;

  const projects = [
    {
      id: 1,
      title: '异常检测基础',
      description: '学习异常值的概念和类型'
    },
    {
      id: 2,
      title: '统计方法',
      description: '掌握基于统计的异常检测方法'
    },
    {
      id: 3,
      title: '机器学习方法',
      description: '了解基于机器学习的异常检测'
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
                <div className="bg-rose-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解异常值的定义和类型</p>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握Z-score和IQR检测方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">了解机器学习异常检测方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够应用于实际业务场景</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是异常值？</h3>
                    <p className="text-text mb-3">异常值是指与大多数数据显著不同的观测值，可能是数据错误或真实异常。</p>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-rose-800 mb-2">💡 异常类型</p>
                      <ul className="text-sm text-rose-700 space-y-1">
                        <li>• 点异常：单个数据点偏离正常范围</li>
                        <li>• 上下文异常：在特定情境下异常</li>
                        <li>• 集体异常：一组数据点共同异常</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 统计检测方法</h3>
                    <p className="text-text mb-3">基于统计分布的方法是最常用的异常检测技术。</p>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-rose-800 mb-2">常用方法</p>
                      <ul className="text-sm text-rose-700 space-y-1">
                        <li>• Z-score：|z| &gt; 3 通常视为异常</li>
                        <li>• IQR：超出1.5倍IQR范围的值</li>
                        <li>• 百分位法：超出1%和99%分位数</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🤖 机器学习方法</h3>
                    <p className="text-text mb-3">机器学习方法可以处理更复杂的异常检测场景。</p>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-rose-800 mb-2">常用算法</p>
                      <ul className="text-sm text-rose-700 space-y-1">
                        <li>• Isolation Forest：隔离森林</li>
                        <li>• One-Class SVM：单类支持向量机</li>
                        <li>• DBSCAN：基于密度的聚类</li>
                      </ul>
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
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="anomaly-detection-editor"
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
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;
