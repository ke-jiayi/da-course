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

  const defaultCode = `# 分组聚合分析练习
print("欢迎学习分组聚合分析！")
print("=" * 40)

# 1. 销售数据分组统计
sales_data = [
    {"region": "华东", "product": "手机", "amount": 15000},
    {"region": "华东", "product": "电脑", "amount": 25000},
    {"region": "华北", "product": "手机", "amount": 12000},
    {"region": "华北", "product": "电脑", "amount": 18000},
    {"region": "华东", "product": "平板", "amount": 8000},
    {"region": "华北", "product": "平板", "amount": 6000},
]

# 按地区分组统计销售额
region_sales = {}
for item in sales_data:
    region = item["region"]
    if region not in region_sales:
        region_sales[region] = 0
    region_sales[region] += item["amount"]

print("各地区销售额统计:")
for region, total in region_sales.items():
    print(f"  {region}: ¥{total:,}")

# 2. 计算平均值和总数
total_sales = sum(item["amount"] for item in sales_data)
avg_sales = total_sales / len(sales_data)
print(f"\n总销售额: ¥{total_sales:,}")
print(f"平均销售额: ¥{avg_sales:,.1f}")

# 3. 找出最高销售额
max_sale = max(sales_data, key=lambda x: x["amount"])
print(f"\n最高单笔销售: {max_sale['product']} - ¥{max_sale['amount']:,}")

print("\n✓ 分组聚合分析完成！")`;

  const projects = [
    {
      id: 1,
      title: '基础聚合函数',
      description: '学习SUM、AVG、COUNT等基础聚合函数'
    },
    {
      id: 2,
      title: 'GROUP BY操作',
      description: '掌握数据分组的核心技巧'
    },
    {
      id: 3,
      title: '多维度分析',
      description: '进行多维度数据聚合分析'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 分组聚合分析</h1>
            <p className="text-text">学习数据分组和聚合操作，掌握SQL和Pandas中的聚合技巧</p>
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
                <p className="text-text text-sm">理解聚合函数的概念和应用场景</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握GROUP BY分组操作</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会多维度数据分析</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够编写复杂的聚合查询</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">常用聚合函数</h3>
                    <p className="text-text mb-3">聚合函数对一组值进行计算，返回单个值。</p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">💡 常用函数</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• SUM() - 求和</li>
                        <li>• AVG() - 平均值</li>
                        <li>• COUNT() - 计数</li>
                        <li>• MAX() / MIN() - 最大/最小值</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔄 GROUP BY 分组</h3>
                    <p className="text-text mb-3">GROUP BY 用于将数据按一个或多个列进行分组。</p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">分组场景</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• 按地区统计销售额</li>
                        <li>• 按产品类别统计数量</li>
                        <li>• 按时间维度统计趋势</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 多维度分析</h3>
                    <p className="text-text mb-3">多维度分析允许从不同角度观察数据。</p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-purple-800 mb-2">分析技巧</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• 使用多个分组字段</li>
                        <li>• 结合HAVING子句过滤</li>
                        <li>• 使用ROLLUP/CUBE进行小计</li>
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
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验分组聚合的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || defaultCode}
                  onChange={handleCodeChange}
                  name="group-aggregation-editor"
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

export default GroupAggregation;
