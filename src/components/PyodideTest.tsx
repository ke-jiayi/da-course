import React, { useState } from 'react';
import { runPythonCode } from '../services/pyodideService';
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

print('\nDescriptive statistics:')
print(df.describe())

# 绘制简单图表
plt.figure(figsize=(10, 6))
plt.plot(df['x'], df['y'])
plt.title('Sample Plot')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)
plt.show()`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    
    try {
      const result = await runPythonCode(code);
      if (result.success) {
        setOutput('代码执行成功！');
      } else {
        setError(result.error || '未知错误');
      }
    } catch (err) {
      setError('执行出错: ' + (err as Error).message);
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
              {error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div>{output || '运行结果将显示在这里'}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyodideTest;
