import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const ABTesting: React.FC = () => {
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

  const defaultCode = `# A/B测试分析练习
import math

print("欢迎学习A/B测试分析！")
print("=" * 40)

# 1. 实验数据
control_visitors = 1000
control_conversions = 100

treatment_visitors = 1000
treatment_conversions = 120

# 2. 计算转化率
control_rate = control_conversions / control_visitors
treatment_rate = treatment_conversions / treatment_visitors

print(f"对照组:")
print(f"  访问量: {control_visitors}")
print(f"  转化数: {control_conversions}")
print(f"  转化率: {control_rate*100:.2f}%")

print(f"\n实验组:")
print(f"  访问量: {treatment_visitors}")
print(f"  转化数: {treatment_conversions}")
print(f"  转化率: {treatment_rate*100:.2f}%")

# 3. 计算提升率
lift = (treatment_rate - control_rate) / control_rate * 100
print(f"\n相对提升: {lift:.1f}%")

# 4. 计算标准误差
def standard_error(p, n):
    return math.sqrt(p * (1 - p) / n)

se_control = standard_error(control_rate, control_visitors)
se_treatment = standard_error(treatment_rate, treatment_visitors)

# 5. Z检验
se_diff = math.sqrt(se_control**2 + se_treatment**2)
z_score = (treatment_rate - control_rate) / se_diff

print(f"\n统计检验:")
print(f"  Z分数: {z_score:.3f}")
print(f"  结论: {'显著' if abs(z_score) > 1.96 else '不显著'} (95%置信水平)")

print("\n✓ A/B测试分析完成！")`;

  const projects = [
    {
      id: 1,
      title: 'A/B测试基础',
      description: '学习A/B测试的基本概念和流程'
    },
    {
      id: 2,
      title: '统计显著性',
      description: '掌握统计检验和显著性判断'
    },
    {
      id: 3,
      title: '实验设计',
      description: '学习如何设计有效的A/B测试'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-sky-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 A/B测试分析</h1>
            <p className="text-text">掌握A/B测试的设计与分析方法，做出数据驱动的决策</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-cyan-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-cyan-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-cyan-100'
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
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解A/B测试的基本原理和流程</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握统计显著性的判断方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会设计有效的实验方案</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够解读和应用测试结果</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是A/B测试？</h3>
                    <p className="text-text mb-3">A/B测试是一种对比实验方法，通过比较两个版本的效果来做出数据驱动的决策。</p>
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-cyan-800 mb-2">💡 核心要素</p>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• 对照组(A)：当前版本</li>
                        <li>• 实验组(B)：新版本</li>
                        <li>• 随机分流：确保公平性</li>
                        <li>• 指标衡量：评估效果</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 统计显著性</h3>
                    <p className="text-text mb-3">统计显著性帮助我们判断观察到的差异是否由随机因素造成。</p>
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-cyan-800 mb-2">关键概念</p>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• P值：结果由随机造成的概率</li>
                        <li>• 置信水平：通常使用95%</li>
                        <li>• Z检验：比较两组比例差异</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔬 实验设计</h3>
                    <p className="text-text mb-3">良好的实验设计是获得可靠结论的基础。</p>
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-cyan-800 mb-2">设计要点</p>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• 明确假设和指标</li>
                        <li>• 计算所需样本量</li>
                        <li>• 确保随机分配</li>
                        <li>• 控制外部变量</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验A/B测试分析的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="ab-testing-editor"
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

export default ABTesting;
