import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const DataMining: React.FC = () => {
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

  const defaultCode = `# 数据清洗与预处理练习
print("欢迎学习数据清洗！")
print("=" * 40)

# 1. 简单数据处理
data = [10, 25, 30, 45, 50, None, 70, 85]

# 计算统计信息
valid_data = [x for x in data if x is not None]
total = sum(valid_data)
count = len(valid_data)
average = total / count

print(f"原始数据: {data}")
print(f"有效数据: {valid_data}")
print(f"数据总和: {total}")
print(f"数据个数: {count}")
print(f"平均值: {average:.2f}")

# 2. 数据分类
categories = ["电子产品", "服装", "食品", "图书"]
prices = [2999, 599, 89, 45]

print("\\n产品分类:")
for cat, price in zip(categories, prices):
    level = "高" if price > 1000 else "中" if price > 100 else "低"
    print(f"  {cat}: ¥{price} ({level}价位)")

# 3. 数据筛选
high_value = [p for p in prices if p > 100]
print(f"\\n高价位产品数: {len(high_value)}")

print("\\n✓ 练习完成！尝试修改数据看看效果")`;

  const projects = [
    {
      id: 1,
      title: '数据清洗基础',
      description: '学习处理缺失值、异常值和重复数据的方法'
    },
    {
      id: 2,
      title: '项目实战：用户分析',
      description: '进行用户数据清洗，构建用户画像'
    },
    {
      id: 3,
      title: '数据预处理',
      description: '学习数据转换、标准化和特征工程基础'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 数据清洗与数据挖掘</h1>
            <p className="text-text">学习数据预处理技术，掌握数据清洗的基本方法</p>
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
                <p className="text-text text-sm">理解数据清洗的重要性和基本原则</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握处理缺失值和异常值的策略</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会识别和处理重复数据</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">了解数据预处理在数据分析中的角色</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是数据清洗？</h3>
                    <p className="text-text mb-3">数据清洗是发现并纠正数据中可识别错误的过程，是数据分析前至关重要的一步。</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">💡 常见的数据问题</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• <strong>缺失值</strong>：数据中缺少某些信息</li>
                        <li>• <strong>重复值</strong>：完全相同的数据出现多次</li>
                        <li>• <strong>异常值</strong>：与大多数数据明显不同的值</li>
                        <li>• <strong>格式不一致</strong>：日期、数字等格式不统一</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 用户画像分析案例</h3>
                    <p className="text-text mb-3">通过数据清洗构建用户画像，识别高价值用户。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">用户ID</th>
                            <th className="border border-gray-300 px-4 py-2">消费金额</th>
                            <th className="border border-gray-300 px-4 py-2">订单数</th>
                            <th className="border border-gray-300 px-4 py-2">用户等级</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">U001</td>
                            <td className="border border-gray-300 px-4 py-2">¥5,000</td>
                            <td className="border border-gray-300 px-4 py-2">15</td>
                            <td className="border border-gray-300 px-4 py-2">⭐⭐⭐</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">U002</td>
                            <td className="border border-gray-300 px-4 py-2">¥300</td>
                            <td className="border border-gray-300 px-4 py-2">2</td>
                            <td className="border border-gray-300 px-4 py-2">⭐</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">U003</td>
                            <td className="border border-gray-300 px-4 py-2">¥8,000</td>
                            <td className="border border-gray-300 px-4 py-2">25</td>
                            <td className="border border-gray-300 px-4 py-2">⭐⭐⭐⭐</td>
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
                    <h3 className="font-semibold text-lg mb-2">🔧 数据预处理技术</h3>
                    <p className="text-text mb-3">数据预处理为后续分析做好准备，包括数据转换、标准化等。</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">数据清洗</h4>
                        <p className="text-sm text-text mb-2">处理缺失值、异常值、重复值</p>
                        <p className="text-xs text-gray-600">确保数据质量可靠</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">数据转换</h4>
                        <p className="text-sm text-text mb-2">类型转换、编码、归一化</p>
                        <p className="text-xs text-gray-600">统一数据格式</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">特征工程</h4>
                        <p className="text-sm text-text mb-2">特征选择、特征构造</p>
                        <p className="text-xs text-gray-600">提升模型效果</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">数据集成</h4>
                        <p className="text-sm text-text mb-2">合并多个数据源</p>
                        <p className="text-xs text-gray-600">构建完整数据集</p>
                      </div>
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
                  name="data-mining-editor"
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
                <p className="font-medium mb-2">1. 如何选择缺失值的处理方法？</p>
                <p className="text-sm text-gray-600">提示：考虑缺失原因（随机缺失还是系统性缺失）、缺失比例和数据分布</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 异常值一定要删除吗？</p>
                <p className="text-sm text-gray-600">提示：有时异常值本身包含重要信息，需要根据业务场景判断</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMining;
