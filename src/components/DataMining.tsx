import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPython, runPythonCode } from '../services/pyodideService';

const DataMining: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setOutput('');
    setError('');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('请输入代码后再运行');
      setOutput('');
      return;
    }

    try {
      const result = await runPythonCode(code);
      if (result.success) {
        setOutput(result.output);
        setError('');
      } else {
        setError('代码执行错误: ' + result.error);
        setOutput('');
      }
    } catch (err) {
      setError('执行错误: ' + (err as Error).message);
      setOutput('');
    }
  };

  // Python 代码示例
  const codeExample1 = `import pandas as pd

data = {'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
        'age': [25, 30, 35, None, 45],
        'city': ['New York', 'London', 'Paris', 'Tokyo', 'Sydney']}
df = pd.DataFrame(data)

print('数据基本信息:')
print(df.info())

print('\n前5行数据:')
print(df.head())`;

  const codeExample2 = `import pandas as pd

data = {'name': ['Alice', 'Bob', 'Alice', 'David', 'Bob'],
        'age': [25, 30, 25, 35, 30],
        'city': ['New York', 'London', 'New York', 'Tokyo', 'London']}
df = pd.DataFrame(data)

print('原始数据:')
print(df)

df_clean = df.drop_duplicates()
print('\n去重后的数据:')
print(df_clean)

data2 = {'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
         'age': [25, None, 35, 40, None],
         'city': ['New York', 'London', None, 'Tokyo', 'Sydney']}
df2 = pd.DataFrame(data2)

print('\n原始数据2:')
print(df2)

df2['age'].fillna(df2['age'].mean(), inplace=True)
df2['city'].fillna(df2['city'].mode()[0], inplace=True)

print('\n处理后的数据2:')
print(df2)`;

  const codeExample3 = `import pandas as pd

data = {
    'user_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'purchase_amount': [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
    'purchase_frequency': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
df = pd.DataFrame(data)

df['value_score'] = df['purchase_amount'] * 0.7 + df['purchase_frequency'] * 300

print('用户数据:')
print(df)

high_value_users = df[df['value_score'] > 5000]
print('\n高价值用户:')
print(high_value_users)`;

  const defaultCode = `import pandas as pd

data = {'name': ['Alice', 'Bob', 'Charlie'], 'age': [25, None, 30], 'city': ['New York', 'London', 'Paris']}
df = pd.DataFrame(data)

print('原始数据:')
print(df)

df['age'].fillna(df['age'].mean(), inplace=True)

print('\n处理后的数据:')
print(df)`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 数据清洗与数据挖掘</h1>
          
          <div className="mb-10">
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>学会用 Pandas 读取和查看数据</li>
                <li>能处理缺失值和重复值</li>
                <li>能完成用户画像和高价值用户筛选</li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-primary">前置知识</h2>
            <div className="bg-yellow rounded-xl p-6">
              <p className="text-text">Python 基础、Pandas 基础</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">分步教学</h2>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                <h3 className="text-lg font-semibold text-text">数据读取与概览</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">知识点：info() / head() 方法</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-mining-1">{codeExample1}</pre>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-text">运行结果：显示数据的基本信息和前几行数据</p>
                  <button
                    onClick={() => runPython(document.getElementById('code-mining-1')?.textContent || '', 'output-mining-1')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-mining-1" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">重复值/缺失值处理</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-mining-2">{codeExample2}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-mining-2')?.textContent || '', 'output-mining-2')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-mining-2" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">实战：用户画像与高价值用户筛选</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-mining-3">{codeExample3}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-mining-3')?.textContent || '', 'output-mining-3')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-mining-3" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">交互式Python编辑器</h2>
            <p className="text-text mb-4">默认预填示例代码，用户可修改运行</p>
            
            <div className="mb-6">
              <AceEditor
                mode="python"
                theme="monokai"
                value={code}
                onChange={handleCodeChange}
                name="data-mining-editor"
                editorProps={{
                  $blockScrolling: true
                }}
                placeholder={defaultCode}
                className="rounded-lg shadow-sm"
                style={{ height: '300px', width: '100%' }}
              />
            </div>
            
            <div className="mb-6">
              <button
                onClick={handleRunCode}
                className="bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5"
              >
                运行代码
              </button>
            </div>
            
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              {error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div>{output || '运行结果将显示在这里'}</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">课后练习</h2>
            <div className="bg-purple rounded-xl p-6">
              <p className="text-text">用脏数据集完成清洗：</p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4 font-mono text-sm">
                <pre>{`import pandas as pd

data = {'name': ['Alice', 'Bob', 'Alice', 'David', 'Bob'],
        'age': [25, None, 25, 35, 30],
        'city': ['New York', 'London', 'New York', 'Tokyo', None]}
df = pd.DataFrame(data)

# 请完成去重和缺失值处理`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMining;