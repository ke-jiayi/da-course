import React, { useState } from 'react';
import { runPythonCode, PythonExecutionResult } from '../services/pyodideService';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const PyodideTest: React.FC = () => {
  const [code, setCode] = useState(`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建示例数据
data = {
    'x': np.arange(10),
    'y': np.random.randn(10)
}
df = pd.DataFrame(data)

print('DataFrame:')
print(df)

print('\\nDescriptive statistics:')
print(df.describe())

# 绘制简单图表
plt.figure(figsize=(10, 6))
plt.plot(df['x'], df['y'])
plt.title('Sample Plot')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)
plt.show()`);
  const [result, setResult] = useState<PythonExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Pyodide测试页面</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Python代码编辑器</h2>
            <AceEditor
              mode="python"
              theme="monokai"
              value={code}
              onChange={setCode}
              name="pyodide-test-editor"
              editorProps={{
                $blockScrolling: true
              }}
              className="rounded-lg shadow-sm"
              style={{ height: '400px', width: '100%' }}
            />
          </div>
          
          <div className="mb-6">
            <button
              onClick={handleRunCode}
              disabled={loading}
              className="bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? '运行中...' : '运行代码'}
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">运行结果</h2>
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              {!result ? (
                <div className="text-gray-400">运行结果将显示在这里</div>
              ) : result.success ? (
                <div className="space-y-3">
                  {result.stdout && (
                    <div>
                      <h3 className="text-green-400 font-semibold mb-1">标准输出:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}
                  {result.stderr && (
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-1">标准错误:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stderr}</pre>
                    </div>
                  )}
                  {!result.stdout && !result.stderr && (
                    <div className="text-green-400">代码执行成功！</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {result.stdout && (
                    <div>
                      <h3 className="text-green-400 font-semibold mb-1">标准输出:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}
                  {result.stderr && (
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-1">标准错误:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stderr}</pre>
                    </div>
                  )}
                  {result.error && (
                    <div className="text-red-400">
                      <h3 className="font-semibold mb-1">错误信息:</h3>
                      <pre className="whitespace-pre-wrap">
                        类型: {result.error.type}
                        消息: {result.error.message}
                        {result.error.lineNumber !== undefined && `\n行号: ${result.error.lineNumber}`}
                        {result.error.stack && `\n\n堆栈跟踪:\n${result.error.stack}`}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyodideTest;
