import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const MarketBasket: React.FC = () => {
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

  const defaultCode = `# 购物篮分析练习
print("欢迎学习购物篮分析！")
print("=" * 40)

# 1. 模拟交易数据
transactions = [
    ["牛奶", "面包", "黄油"],
    ["牛奶", "面包"],
    ["面包", "黄油", "果酱"],
    ["牛奶", "面包", "黄油", "果酱"],
    ["牛奶", "面包"],
    ["面包", "黄油"],
]

# 2. 计算商品出现频率
item_count = {}
for trans in transactions:
    for item in trans:
        item_count[item] = item_count.get(item, 0) + 1

print("商品出现频率:")
for item, count in sorted(item_count.items(), key=lambda x: -x[1]):
    print(f"  {item}: {count}次 ({count/len(transactions)*100:.1f}%)")

# 3. 计算商品组合频率
from itertools import combinations

pair_count = {}
for trans in transactions:
    for pair in combinations(sorted(trans), 2):
        pair_count[pair] = pair_count.get(pair, 0) + 1

print("\n商品组合频率 (Top 5):")
sorted_pairs = sorted(pair_count.items(), key=lambda x: -x[1])[:5]
for pair, count in sorted_pairs:
    support = count / len(transactions) * 100
    print(f"  {pair[0]} + {pair[1]}: {count}次 (支持度: {support:.1f}%)")

# 4. 计算置信度
print("\n关联规则示例:")
total_milk = item_count["牛奶"]
milk_bread_count = pair_count.get(("牛奶", "面包"), 0)
confidence = milk_bread_count / total_milk * 100
print(f"  买牛奶 → 买面包 的置信度: {confidence:.1f}%")

print("\n✓ 购物篮分析完成！")`;

  const projects = [
    {
      id: 1,
      title: '关联规则基础',
      description: '学习关联规则的基本概念'
    },
    {
      id: 2,
      title: '支持度与置信度',
      description: '掌握关联规则的核心指标'
    },
    {
      id: 3,
      title: 'Apriori算法',
      description: '了解经典的频繁项集挖掘算法'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 购物篮分析</h1>
            <p className="text-text">学习关联规则挖掘，发现商品之间的关联关系</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-orange-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-orange-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-orange-100'
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
                <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解关联规则的基本概念</p>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握支持度、置信度的计算</p>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">了解Apriori算法原理</p>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够应用于实际商业场景</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">什么是关联规则？</h3>
                    <p className="text-text mb-3">关联规则是数据挖掘中的一种技术，用于发现数据项之间的关联关系。</p>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-orange-800 mb-2">💡 经典案例</p>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• "啤酒与尿布" - 经典的购物篮分析案例</li>
                        <li>• 发现商品之间的购买关联</li>
                        <li>• 用于商品推荐和货架布局优化</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 支持度与置信度</h3>
                    <p className="text-text mb-3">支持度和置信度是衡量关联规则强度的两个重要指标。</p>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-orange-800 mb-2">核心指标</p>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• 支持度：项集出现的频率</li>
                        <li>• 置信度：规则的可信程度</li>
                        <li>• 提升度：规则的有效性</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔧 Apriori算法</h3>
                    <p className="text-text mb-3">Apriori是最经典的频繁项集挖掘算法。</p>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-orange-800 mb-2">算法特点</p>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• 基于逐层搜索的迭代方法</li>
                        <li>• 利用先验性质剪枝</li>
                        <li>• 时间复杂度较高但易于理解</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验购物篮分析的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="market-basket-editor"
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

export default MarketBasket;
