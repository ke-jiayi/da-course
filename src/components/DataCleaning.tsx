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

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '缺失值处理、重复值处理、数据类型转换'
    },
    {
      id: 2,
      title: '实战案例：电商数据清洗',
      description: '使用Python处理真实电商数据'
    },
    {
      id: 3,
      title: '高级技巧',
      description: '异常值处理与数据标准化'
    }
  ];

  const placeholderCode = `# 在这里编写你的代码
# 点击"显示参考答案"按钮可以查看示例代码

# 提示：
# 1. 可以尝试检测和处理缺失值
# 2. 可以识别和处理重复数据
# 3. 可以检测和处理异常值

`;

  const answerCode = `# 数据清洗实战练习
print("=" * 50)
print("       欢迎学习数据清洗！")
print("=" * 50)

# ===== 1. 处理缺失值 =====
print("\\n【第1步】处理缺失值")
print("-" * 40)

data = [10, None, 25, None, 30, 45, None, 50]
print(f"原始数据: {data}")

missing_count = sum(1 for x in data if x is None)
print(f"缺失值数量: {missing_count}")

valid_values = [x for x in data if x is not None]
avg = sum(valid_values) / len(valid_values)
cleaned_data = [x if x is not None else round(avg, 1) for x in data]
print(f"平均值: {avg:.1f}")
print(f"填充后数据: {cleaned_data}")

# ===== 2. 处理重复数据 =====
print("\\n【第2步】处理重复数据")
print("-" * 40)

products = ["手机", "电脑", "手机", "平板", "电脑", "耳机"]
print(f"原始产品列表: {products}")
unique_products = list(dict.fromkeys(products))
print(f"去重后产品: {unique_products}")
print(f"重复数量: {len(products) - len(unique_products)}")

# ===== 3. 处理异常值 =====
print("\\n【第3步】处理异常值")
print("-" * 40)

sales = [100, 120, 115, 90, 95, 200, 110, 105, 98, 102]
print(f"原始销售额: {sales}")

mean_val = sum(sales) / len(sales)
variance = sum((x - mean_val) ** 2 for x in sales) / len(sales)
std_val = variance ** 0.5

print(f"平均值: {mean_val:.2f}")
print(f"标准差: {std_val:.2f}")

outliers = [x for x in sales if abs(x - mean_val) > 2 * std_val]
print(f"异常值 (2倍标准差外): {outliers}")

cleaned_sales = [x for x in sales if abs(x - mean_val) <= 2 * std_val]
print(f"清洗后销售额: {cleaned_sales}")

print("\\n" + "=" * 50)
print("✓ 数据清洗完成！")
print("=" * 50)`;

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
                    <h3 className="font-semibold text-lg mb-2">什么是数据清洗？</h3>
                    <p className="text-text mb-3">数据清洗是数据分析前的重要步骤，用于处理数据中的不完整、不一致和错误数据。</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">💡 数据清洗的重要性</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 原始数据往往存在各种质量问题</li>
                        <li>• 脏数据会导致分析结果不准确</li>
                        <li>• 数据清洗占整个数据分析70%的时间</li>
                        <li>• 高质量数据是可靠分析的基础</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">📊 缺失值处理示例</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">订单号</th>
                            <th className="border border-gray-300 px-4 py-2">客户姓名</th>
                            <th className="border border-gray-300 px-4 py-2">购买数量</th>
                            <th className="border border-gray-300 px-4 py-2">联系电话</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">1001</td>
                            <td className="border border-gray-300 px-4 py-2">张三</td>
                            <td className="border border-gray-300 px-4 py-2">2</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">NULL</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">1002</td>
                            <td className="border border-gray-300 px-4 py-2">李四</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">NULL</td>
                            <td className="border border-gray-300 px-4 py-2">138****1234</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">1003</td>
                            <td className="border border-gray-300 px-4 py-2">王五</td>
                            <td className="border border-gray-300 px-4 py-2">5</td>
                            <td className="border border-gray-300 px-4 py-2">139****5678</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 mt-3">
                      <p className="text-sm font-medium text-yellow-800 mb-2">💡 缺失值处理方法</p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 删除法：删除含有缺失值的行（数据量充足时）</li>
                        <li>• 均值填充：用该列均值填充数值型缺失</li>
                        <li>• 众数填充：用出现最多的值填充分类型缺失</li>
                        <li>• 前后填充：用相邻值填充（时间序列数据）</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">📊 重复值处理示例</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">产品名称</th>
                            <th className="border border-gray-300 px-4 py-2">出现次数</th>
                            <th className="border border-gray-300 px-4 py-2">是否为重复</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">手机</td>
                            <td className="border border-gray-300 px-4 py-2">2</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">是</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">电脑</td>
                            <td className="border border-gray-300 px-4 py-2">2</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">是</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">平板</td>
                            <td className="border border-gray-300 px-4 py-2">1</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-500">否</td>
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
                    <h3 className="font-semibold text-lg mb-2">🛒 电商数据清洗实战</h3>
                    <p className="text-text mb-3">让我们分析一个电商订单数据集，学习如何处理真实世界的数据问题。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">订单ID</th>
                            <th className="border border-gray-300 px-4 py-2">商品</th>
                            <th className="border border-gray-300 px-4 py-2">数量</th>
                            <th className="border border-gray-300 px-4 py-2">单价</th>
                            <th className="border border-gray-300 px-4 py-2">备注</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">10001</td>
                            <td className="border border-gray-300 px-4 py-2">iPhone</td>
                            <td className="border border-gray-300 px-4 py-2">1</td>
                            <td className="border border-gray-300 px-4 py-2">8999</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-400">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">10002</td>
                            <td className="border border-gray-300 px-4 py-2">MacBook</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">NULL</td>
                            <td className="border border-gray-300 px-4 py-2">12999</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">数据异常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">10003</td>
                            <td className="border border-gray-300 px-4 py-2">AirPods</td>
                            <td className="border border-gray-300 px-4 py-2">2</td>
                            <td className="border border-gray-300 px-4 py-2">1599</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-400">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">10004</td>
                            <td className="border border-gray-300 px-4 py-2">MacBook</td>
                            <td className="border border-gray-300 px-4 py-2">1</td>
                            <td className="border border-gray-300 px-4 py-2">12999</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">重复订单</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">💡 数据问题分析</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 缺失值：MacBook订单缺少数量信息</li>
                        <li>• 重复订单：10002和10004疑似重复</li>
                        <li>• 异常检测：数量和价格需要验证一致性</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-3">Python代码示例：电商数据清洗</h4>
                    <pre className="text-xs text-gray-700 overflow-x-auto">
{`# 模拟电商订单数据清洗
orders = [
    {"id": "10001", "product": "iPhone", "qty": 1, "price": 8999},
    {"id": "10002", "product": "MacBook", "qty": None, "price": 12999},
    {"id": "10003", "product": "AirPods", "qty": 2, "price": 1599},
    {"id": "10004", "product": "MacBook", "qty": 1, "price": 12999},
]

# 1. 检测缺失值
for order in orders:
    if order["qty"] is None:
        print(f"订单 {order['id']} 缺少数量信息")

# 2. 检测重复订单（基于商品和价格）
seen = {}
duplicates = []
for order in orders:
    key = (order["product"], order["price"])
    if key in seen:
        duplicates.append(order["id"])
    else:
        seen[key] = order["id"]

print(f"重复订单: {duplicates}")`}
                    </pre>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 异常值检测与处理</h3>
                    <p className="text-text mb-3">异常值是与其他观测值显著不同的数据点，可能是真实异常或数据错误。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">客户ID</th>
                            <th className="border border-gray-300 px-4 py-2">月消费金额</th>
                            <th className="border border-gray-300 px-4 py-2">Z-Score</th>
                            <th className="border border-gray-300 px-4 py-2">是否为异常</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">C001</td>
                            <td className="border border-gray-300 px-4 py-2">1200</td>
                            <td className="border border-gray-300 px-4 py-2">-0.45</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-500">正常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">C002</td>
                            <td className="border border-gray-300 px-4 py-2">850</td>
                            <td className="border border-gray-300 px-4 py-2">-0.89</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-500">正常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">C003</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500 font-bold">15000</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">3.52</td>
                            <td className="border border-gray-300 px-4 py-2 text-red-500">异常</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">C004</td>
                            <td className="border border-gray-300 px-4 py-2">980</td>
                            <td className="border border-gray-300 px-4 py-2">-0.72</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-500">正常</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">💡 异常值检测方法</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 箱线图法：超出1.5倍IQR范围的值视为异常</li>
                        <li>• Z-Score法：|z| {'>'} 3 的值视为异常</li>
                        <li>• 百分位法：超出1%和99%分位数的值</li>
                        <li>• 业务规则：根据业务逻辑定义合理范围</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">📊 数据标准化</h3>
                    <p className="text-text mb-3">不同量纲的数据需要进行标准化处理，以便于比较和分析。</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">学生</th>
                            <th className="border border-gray-300 px-4 py-2">数学成绩</th>
                            <th className="border border-gray-300 px-4 py-2">英语成绩</th>
                            <th className="border border-gray-300 px-4 py-2">数学标准化</th>
                            <th className="border border-gray-300 px-4 py-2">英语标准化</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">小明</td>
                            <td className="border border-gray-300 px-4 py-2">85</td>
                            <td className="border border-gray-300 px-4 py-2">92</td>
                            <td className="border border-gray-300 px-4 py-2">0.25</td>
                            <td className="border border-gray-300 px-4 py-2">0.45</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">小红</td>
                            <td className="border border-gray-300 px-4 py-2">78</td>
                            <td className="border border-gray-300 px-4 py-2">88</td>
                            <td className="border border-gray-300 px-4 py-2">-0.15</td>
                            <td className="border border-gray-300 px-4 py-2">0.25</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">小刚</td>
                            <td className="border border-gray-300 px-4 py-2">92</td>
                            <td className="border border-gray-300 px-4 py-2">95</td>
                            <td className="border border-gray-300 px-4 py-2">0.65</td>
                            <td className="border border-gray-300 px-4 py-2">0.65</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-3">Python代码示例：异常值处理</h4>
                    <pre className="text-xs text-gray-700 overflow-x-auto">
{`import statistics

# 消费数据
consumption = [1200, 850, 15000, 980, 1100, 920, 1050]

# 计算统计量
mean_val = statistics.mean(consumption)
stdev_val = statistics.stdev(consumption)

# Z-Score 方法检测异常值
outliers = []
for i, value in enumerate(consumption):
    z_score = (value - mean_val) / stdev_val
    if abs(z_score) > 2:
        outliers.append((i, value, z_score))

print(f"异常值: {outliers}")

# 箱线图方法
sorted_data = sorted(consumption)
q1 = sorted_data[len(sorted_data)//4]
q3 = sorted_data[3*len(sorted_data)//4]
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

print(f"正常范围: [{lower_bound}, {upper_bound}]")`}
                    </pre>
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
                  value={code || placeholderCode}
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
                    setCode(answerCode);
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
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
                <p className="font-medium mb-2">1. 在什么情况下应该删除缺失值而不是填充？</p>
                <p className="text-sm text-gray-600">提示：考虑缺失比例、数据重要性和数据量大小</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 异常值一定是错误数据吗？应该如何区分？</p>
                <p className="text-sm text-gray-600">提示：有些异常值可能代表真实的极端情况</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">3. 如何选择合适的数据标准化方法？</p>
                <p className="text-sm text-gray-600">提示：考虑数据分布特点和使用场景</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;
