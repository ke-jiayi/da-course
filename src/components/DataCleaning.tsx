import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const DataCleaning: React.FC = () => {
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

  const defaultCode = `# 数据清洗实战练习
print("欢迎学习数据清洗！")
print("=" * 40)

# 1. 处理缺失值
data = [10, None, 25, None, 30, 45, None, 50]
print(f"原始数据: {data}")

# 统计缺失值数量
missing_count = sum(1 for x in data if x is None)
print(f"缺失值数量: {missing_count}")

# 用平均值填充缺失值
valid_values = [x for x in data if x is not None]
avg = sum(valid_values) / len(valid_values)
cleaned_data = [x if x is not None else round(avg, 1) for x in data]
print(f"平均值: {avg:.1f}")
print(f"填充后数据: {cleaned_data}")

# 2. 处理重复数据
products = ["手机", "电脑", "手机", "平板", "电脑", "耳机"]
unique_products = list(dict.fromkeys(products))
print(f"\n原始产品列表: {products}")
print(f"去重后: {unique_products}")

print("\n✓ 数据清洗完成！")`;

  const projects = [
    {
      id: 1,
      title: '缺失值处理',
      description: '学习识别和处理数据中的缺失值'
    },
    {
      id: 2,
      title: '重复数据处理',
      description: '掌握数据去重的方法和技巧'
    },
    {
      id: 3,
      title: '异常值检测',
      description: '识别和处理数据中的异常值'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 数据清洗实战</h1>
            <p className="text-text">掌握数据清洗的核心技术，处理缺失值、异常值和重复数据</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-green-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-green-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-green-100'
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
                <p className="text-text text-sm">识别数据中的缺失值并选择合适的填充策略</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握数据去重的多种方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会检测和处理异常值</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解数据质量对分析结果的影响</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是缺失值？</h3>
                    <p className="text-text mb-3">缺失值是指数据集中某些字段没有值的情况，可能由数据采集错误、系统故障等原因造成。</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">💡 处理方法</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 删除：直接删除含有缺失值的记录</li>
                        <li>• 填充：用均值、中位数、众数填充</li>
                        <li>• 插值：根据相邻值进行插值估计</li>
                        <li>• 预测：使用机器学习模型预测缺失值</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔄 重复数据处理</h3>
                    <p className="text-text mb-3">重复数据会影响分析结果的准确性，需要识别并处理。</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">常用方法</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 使用 set() 去重（不保留顺序）</li>
                        <li>• 使用 dict.fromkeys() 去重（保留顺序）</li>
                        <li>• Pandas 的 drop_duplicates() 方法</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 异常值检测</h3>
                    <p className="text-text mb-3">异常值是与其他观测值显著不同的数据点，可能是真实异常或数据错误。</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">检测方法</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 箱线图法：超出1.5倍IQR范围的值</li>
                        <li>• Z-score法：|z| &gt; 3 的值</li>
                        <li>• 百分位法：超出1%和99%分位数的值</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验数据清洗的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="data-cleaning-editor"
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

export default DataCleaning;
