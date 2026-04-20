import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPython, runPythonCode } from '../services/pyodideService';

const DataVisualization: React.FC = () => {
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
  const codeExample1 = `import matplotlib.pyplot as plt
x = [1,2,3,4,5]
y = [10,20,30,25,15]
plt.plot(x,y)
plt.show()`;

  const codeExample2 = `import matplotlib.pyplot as plt

categories = ['A', 'B', 'C', 'D', 'E']
values = [10, 15, 7, 12, 9]

plt.bar(categories, values)
plt.title('柱状图示例')
plt.xlabel('类别')
plt.ylabel('值')
plt.show()`;

  const codeExample3 = `import matplotlib.pyplot as plt

labels = ['苹果', '香蕉', '橙子', '梨']
sizes = [30, 25, 20, 25]

plt.pie(sizes, labels=labels, autopct='%1.1f%%')
plt.title('水果分布')
plt.show()`;

  const codeExample4 = `import matplotlib.pyplot as plt

months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [12000, 15000, 18000, 16000, 20000, 22000]

plt.plot(months, sales, marker='o')
plt.title('月度销售额')
plt.xlabel('月份')
plt.ylabel('销售额 (元)')
plt.grid(True, alpha=0.3)
plt.show()`;

  const defaultCode = `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 20, 30, 25, 15]

plt.plot(x, y)
plt.title('折线图示例')
plt.xlabel('X轴')
plt.ylabel('Y轴')
plt.show()`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 数据可视化实战</h1>
          
          <div className="mb-10">
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>学会用 Python 导入 matplotlib</li>
                <li>能绘制折线图/柱状图/饼图</li>
                <li>能完成销售数据可视化实战</li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-primary">前置知识</h2>
            <div className="bg-yellow rounded-xl p-6">
              <p className="text-text">Python 基础变量/列表</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">分步教学</h2>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                <h3 className="text-lg font-semibold text-text">库导入</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">知识点：import matplotlib.pyplot as plt</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-visualization-1">{codeExample1}</pre>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-text">运行结果示意：弹出一张折线图</p>
                  <button
                    onClick={() => runPython(document.getElementById('code-visualization-1')?.textContent || '', 'output-visualization-1')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-visualization-1" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">柱状图/饼图</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-medium text-text mb-3">柱状图</h4>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-visualization-2">{codeExample2}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-visualization-2')?.textContent || '', 'output-visualization-2')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-visualization-2" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
                
                <h4 className="font-medium text-text mb-3">饼图</h4>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-visualization-3">{codeExample3}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-visualization-3')?.textContent || '', 'output-visualization-3')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-visualization-3" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">实战：电商销售数据可视化</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-visualization-4">{codeExample4}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-visualization-4')?.textContent || '', 'output-visualization-4')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-visualization-4" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
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
                name="data-visualization-editor"
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
              <p className="text-text">用月度数据画图：</p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4 font-mono text-sm">
                <pre>{`months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [12000, 15000, 18000, 16000, 20000, 22000]
# 请用上面的数据画一张月度销售额的折线图`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
