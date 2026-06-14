import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide, PythonExecutionResult, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';

const PythonPlayground: React.FC = () => {
  const [code, setCode] = useState(`# Python代码编辑器
# 在这里编写并运行你的Python代码

# 示例1：打印输出
print("Hello, World!")
print("欢迎使用数据学院 Python 在线编辑器")

# 示例2：基础计算
a = 10
b = 20
print(f"a + b = {a + b}")
print(f"a * b = {a * b}")

# 示例3：列表操作
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
print("水果列表:", fruits)
print("第一个水果:", fruits[0])

# 示例4：循环
print("\\n数字1到5:")
for i in range(1, 6):
    print(i)`);
  const [result, setResult] = useState<PythonExecutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<{ stage: number; percent: number; isReady: boolean }>({ stage: 0, percent: 0, isReady: isPyodideReady() });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (pyodideStatus.isReady) return;
    let secondsTimer: ReturnType<typeof setInterval> | null = null;
    let isCancelled = false;

    const init = async () => {
      secondsTimer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      try {
        await initPyodide((p: PyodideProgress) => {
          if (!isCancelled) {
            setPyodideStatus({ stage: p.stage, percent: p.percent, isReady: p.stage === 4 });
          }
        });
        if (!isCancelled) setPyodideStatus({ stage: 4, percent: 100, isReady: true });
      } catch (err: any) {
        if (!isCancelled) setLoadError(err?.message || '初始化失败，请检查网络连接');
      } finally {
        if (secondsTimer) clearInterval(secondsTimer);
      }
    };

    init();

    return () => {
      isCancelled = true;
    };
  }, [pyodideStatus.isReady]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (pyodideStatus.isReady && !isLoading) {
          handleRunCode();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pyodideStatus.isReady, isLoading]);

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

    if (!pyodideStatus.isReady) {
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

  const handleClear = () => {
    setCode('');
    setResult(null);
  };

  const handleReset = () => {
    setCode(`# Python代码编辑器
# 在这里编写并运行你的Python代码

# 示例1：打印输出
print("Hello, World!")
print("欢迎使用数据学院 Python 在线编辑器")

# 示例2：基础计算
a = 10
b = 20
print(f"a + b = {a + b}")
print(f"a * b = {a * b}")

# 示例3：列表操作
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
print("水果列表:", fruits)
print("第一个水果:", fruits[0])

# 示例4：循环
print("\\n数字1到5:")
for i in range(1, 6):
    print(i)`);
    setResult(null);
  };

  const handleLoadExample = (example: string) => {
    let exampleCode = '';
    
    switch (example) {
      case 'print':
        exampleCode = `# 打印输出示例
print("Hello, World!")
print(1)
print(3.14)
print(True)
print("你好，世界！")`;
        break;
      case 'calculator':
        exampleCode = `# 计算器示例
# 基础运算
a = 100
b = 25

print(f"a = {a}, b = {b}")
print(f"加法: {a} + {b} = {a + b}")
print(f"减法: {a} - {b} = {a - b}")
print(f"乘法: {a} * {b} = {a * b}")
print(f"除法: {a} / {b} = {a / b}")
print(f"整除: {a} // {b} = {a // b}")
print(f"取余: {a} % {b} = {a % b}")
print(f"幂运算: {a} ** 2 = {a ** 2}")`;
        break;
      case 'dataframe':
        exampleCode = `# DataFrame操作示例
import pandas as pd
import numpy as np

# 创建DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 28, 35],
    '工资': [8000, 12000, 9500, 15000]
}
df = pd.DataFrame(data)

print("原始数据:")
print(df)

print("\\n数据描述:")
print(df.describe())

print("\\n平均工资:", df['工资'].mean())`;
        break;
      case 'matplotlib':
        exampleCode = `# 图表绘制示例
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# 生成数据
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# 创建图表
plt.figure(figsize=(10, 6))
plt.plot(x, y1, label='sin(x)', color='blue', linewidth=2)
plt.plot(x, y2, label='cos(x)', color='red', linewidth=2)

# 添加标题和标签
plt.title('Sine and Cosine Functions', fontsize=14)
plt.xlabel('X axis', fontsize=12)
plt.ylabel('Y axis', fontsize=12)
plt.legend()
plt.grid(True, alpha=0.3)

# 显示图表（自动渲染为图片）
show_plot()`;
        break;
      case 'statistics':
        exampleCode = `# 统计分析示例
import numpy as np

# 生成随机数据
np.random.seed(42)
data = np.random.normal(100, 15, 50)

print("数据统计分析:")
print(f"数据个数: {len(data)}")
print(f"平均值: {np.mean(data):.2f}")
print(f"中位数: {np.median(data):.2f}")
print(f"标准差: {np.std(data):.2f}")
print(f"最小值: {np.min(data):.2f}")
print(f"最大值: {np.max(data):.2f}")
print(f"方差: {np.var(data):.2f}")`;
        break;
      default:
        exampleCode = code;
    }
    
    setCode(exampleCode);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* 标题区域 */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">🐍 Python 在线代码编辑器</h1>
            <p className="text-text">在这里编写和运行你的 Python 代码，支持 pandas、numpy、matplotlib 等常用库</p>
          </div>

          {/* 加载状态 */}
          {!pyodideStatus.isReady && (
            <div className="mb-8">
              <PyodideLoader
                stage={pyodideStatus.stage as 0 | 1 | 2 | 3 | 4}
                percent={pyodideStatus.percent}
                error={loadError}
                elapsedSeconds={elapsedSeconds}
                onRetry={() => {
                  setLoadError(null);
                  setElapsedSeconds(0);
                  setPyodideStatus({ stage: 0, percent: 0, isReady: false });
                }}
              />
            </div>
          )}

          {/* 示例代码选择 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">📁 快速示例</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLoadExample('print')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-all"
              >
                打印输出
              </button>
              <button
                onClick={() => handleLoadExample('calculator')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-all"
              >
                计算器
              </button>
              <button
                onClick={() => handleLoadExample('dataframe')}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-all"
              >
                DataFrame
              </button>
              <button
                onClick={() => handleLoadExample('matplotlib')}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-all"
              >
                图表绘制
              </button>
              <button
                onClick={() => handleLoadExample('statistics')}
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200 transition-all"
              >
                统计分析
              </button>
            </div>
          </div>

          {/* 代码编辑器 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">💻 代码编辑器</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-all"
                >
                  重置
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-all"
                >
                  清空
                </button>
              </div>
            </div>
            <AceEditor
              mode="python"
              theme="monokai"
              value={code}
              onChange={handleCodeChange}
              name="python-playground-editor"
              ref={editorRef}
              editorProps={{
                $blockScrolling: true
              }}
              className="rounded-lg shadow-md"
              style={{ height: '400px', width: '100%' }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                fontSize: 14,
                wordWrap: 'on',
                minLines: 15,
                maxLines: 50,
                placeholder: '在此输入 Python 代码...',
              }}
            />
          </div>

          {/* 运行按钮 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handleRunCode}
                disabled={isLoading || !pyodideStatus.isReady}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  isLoading || !pyodideStatus.isReady
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    运行中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">▶</span>
                    运行代码
                  </span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              💡 快捷键：<kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Enter</kbd>
            </p>
          </div>

          {/* 运行结果 */}
          <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="ml-4 text-sm text-gray-400">运行结果</span>
            </div>
            
            {!result ? (
              <div className="text-gray-400 flex items-center justify-center py-12">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">⌨️</span>
                  <span>编写代码后点击"运行代码"查看输出</span>
                  <p className="text-sm mt-2 text-gray-500">支持: print(), pandas, numpy, matplotlib, sklearn</p>
                </div>
              </div>
            ) : result.success ? (
              <div className="space-y-4">
                {result.output && (
                  <div>
                    <div
                      className="text-green-400 whitespace-pre-wrap font-mono text-sm"
                      dangerouslySetInnerHTML={{ __html: result.output.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                )}
                {!result.output && !result.stdout && !result.stderr && (
                  <div className="text-green-400 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    代码执行成功！
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
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
                {result.stderr && (
                  <div className="text-yellow-400 text-sm">
                    <p className="font-semibold mb-1">标准错误:</p>
                    <pre className="whitespace-pre-wrap">{result.stderr}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 使用说明 */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">📖 使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <span className="text-blue-600">1️⃣</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">编写代码</h4>
                  <p className="text-sm text-blue-700">在编辑器中输入你的 Python 代码</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <span className="text-blue-600">2️⃣</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">点击运行</h4>
                  <p className="text-sm text-blue-700">点击"运行代码"按钮执行代码</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <span className="text-blue-600">3️⃣</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">查看结果</h4>
                  <p className="text-sm text-blue-700">在下方查看代码执行结果和错误信息</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <span className="text-blue-600">4️⃣</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">使用示例</h4>
                  <p className="text-sm text-blue-700">点击上方快速示例按钮加载预设代码</p>
                </div>
              </div>
            </div>
          </div>

          {/* 支持的库 */}
          <div className="mt-6 bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">📦 已安装的库</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">pandas</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">numpy</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">matplotlib</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">scikit-learn</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">base64</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">io</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonPlayground;