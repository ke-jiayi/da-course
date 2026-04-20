import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPython, runPythonCode } from '../services/pyodideService';

const BusinessAnalysis: React.FC = () => {
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
  const codeExample1 = `daily_sales = [10000, 12000, 11000, 15000, 13000, 14000, 16000]
orders = [50, 60, 55, 75, 65, 70, 80]
visitors = [500, 600, 550, 750, 650, 700, 800]
repeat_customers = [10, 15, 12, 20, 18, 19, 25]

gmv = sum(daily_sales)
print('GMV:', gmv, '元')

average_order_value = gmv / sum(orders)
print('平均订单价值:', average_order_value)

conversion_rate = (sum(orders) / sum(visitors)) * 100
print('转化率:', conversion_rate, '%')

total_customers = sum(orders)
repeat_rate = (sum(repeat_customers) / total_customers) * 100
print('复购率:', repeat_rate, '%')`;

  const codeExample2 = `import pandas as pd

data = {
    'date': ['2026-01-01', '2026-01-01', '2026-01-02', '2026-01-02', '2026-01-03', '2026-01-03'],
    'store': ['门店A', '门店B', '门店A', '门店B', '门店A', '门店B'],
    'channel': ['线上', '线下', '线上', '线下', '线上', '线下'],
    'sales': [5000, 3000, 5500, 3200, 4800, 2900],
    'orders': [25, 15, 28, 16, 24, 14]
}

df = pd.DataFrame(data)
print('原始数据:')
print(df)

store_analysis = df.groupby('store').agg({'sales': 'sum', 'orders': 'sum'})
print('\n按门店分析:')
print(store_analysis)

channel_analysis = df.groupby('channel').agg({'sales': 'sum', 'orders': 'sum'})
print('\n按渠道分析:')
print(channel_analysis)`;

  const codeExample3 = `import pandas as pd

data = {
    '月份': ['1月', '2月', '3月', '4月', '5月', '6月'],
    'GMV': [1200000, 1500000, 1800000, 1600000, 2000000, 2200000],
    '订单数': [6000, 7500, 9000, 8000, 10000, 11000],
    '复购率': [20, 22, 25, 28, 30, 32],
    '毛利率': [40, 41, 42, 43, 44, 45]
}

df = pd.DataFrame(data)
print('电商月度经营数据:')
print(df)

df['GMV同比增长'] = df['GMV'].pct_change() * 100

print('\n关键发现:')
print('- GMV从1月的120万增长到6月的220万')
print('- 复购率从1月的20%提高到6月的32%')
print('- 毛利率从1月的40%提高到6月的45%')`;

  const defaultCode = `# 示例：计算商业指标
sales = [1000, 1500, 1200, 1800, 2000]
costs = [600, 900, 720, 1080, 1200]

gmv = sum(sales)
total_cost = sum(costs)
profit = gmv - total_cost
profit_margin = (profit / gmv) * 100

print('GMV:', gmv)
print('总成本:', total_cost)
print('利润:', profit)
print('利润率:', profit_margin)`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 商业数据计算与分析</h1>
          
          <div className="mb-10">
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>学会用 Python 完成商业指标计算</li>
                <li>能计算 GMV、复购率、转化率等核心指标</li>
                <li>能完成电商月度经营分析实战</li>
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
                <h3 className="text-lg font-semibold text-text">核心商业指标计算</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">知识点：GMV / 复购率 / 转化率计算</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-business-1">{codeExample1}</pre>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-text">运行结果：显示 GMV、平均订单价值、转化率、复购率等指标</p>
                  <button
                    onClick={() => runPython(document.getElementById('code-business-1')?.textContent || '', 'output-business-1')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-business-1" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">多维度分析：门店/渠道/时间</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-business-2">{codeExample2}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-business-2')?.textContent || '', 'output-business-2')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-business-2" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">实战：电商月度经营分析</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-business-3">{codeExample3}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-business-3')?.textContent || '', 'output-business-3')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-business-3" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
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
                name="business-analysis-editor"
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
              <p className="text-text">用提供的门店数据完成经营分析：</p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4 font-mono text-sm">
                <pre>{`import pandas as pd

data = {
    '门店': ['门店A', '门店B', '门店C', '门店D', '门店E'],
    '销售额': [500000, 600000, 450000, 700000, 550000],
    '成本': [300000, 360000, 270000, 420000, 330000]
}
df = pd.DataFrame(data)

# 请计算每个门店的利润和利润率`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalysis;