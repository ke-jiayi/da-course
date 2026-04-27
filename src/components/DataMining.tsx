import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode } from '../services/pyodideService';

const DataMining: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; stdout: string; stderr: string; error?: any; } | null>(null);

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
    }
  };

  const defaultCode = `import pandas as pd
import numpy as np

# 创建示例数据
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
    'age': [25, 30, None, 40, 45, None],
    'salary': [50000, 60000, 70000, None, 90000, 100000],
    'department': ['HR', 'IT', 'IT', 'HR', 'Finance', 'Finance']
}

df = pd.DataFrame(data)

# 1. 查看数据结构
print("=== 数据结构 ===")
print(df.head())
print("\n=== 数据信息 ===")
print(df.info())

# 2. 处理缺失值
print("\n=== 处理缺失值 ===")
# 计算各列缺失值数量
print("缺失值数量:")
print(df.isnull().sum())

# 填充年龄缺失值为平均值
df['age'] = df['age'].fillna(df['age'].mean())

# 填充薪资缺失值为中位数
df['salary'] = df['salary'].fillna(df['salary'].median())

print("\n填充后的数据:")
print(df)

# 3. 处理异常值
print("\n=== 处理异常值 ===")
# 检查薪资是否有异常值（假设薪资范围合理值为40000-120000）
df['salary'] = np.where((df['salary'] < 40000) | (df['salary'] > 120000), 
                         df['salary'].median(), df['salary'])

print("处理异常值后的数据:")
print(df)

# 4. 数据转换
print("\n=== 数据转换 ===")
# 将部门转换为分类变量
df['department'] = df['department'].astype('category')

# 创建薪资等级
 df['salary_level'] = pd.cut(df['salary'], 
                           bins=[0, 60000, 80000, 100000, float('inf')],
                           labels=['Low', 'Medium', 'High', 'Very High'])

print("转换后的数据:")
print(df)

# 5. 数据分析
print("\n=== 数据分析 ===")
# 按部门分组计算平均薪资
print("各部门平均薪资:")
print(df.groupby('department')['salary'].mean())

print("\n练习完成！你已经成功完成了数据清洗与预处理的基本步骤。")`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 数据清洗与数据挖掘</h1>
          
          <div className="mb-10">
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>理解数据清洗的重要性和基本方法</li>
                <li>学习处理缺失值和重复值的策略</li>
                <li>掌握数据探索性分析的基本概念</li>
                <li>了解数据挖掘的常用技术和应用场景</li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-primary">前置知识</h2>
            <div className="bg-yellow rounded-xl p-6">
              <p className="text-text">基础数学知识、简单的逻辑思维能力</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">课程内容</h2>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                <h3 className="text-lg font-semibold text-text">数据清洗基础</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>什么是数据清洗？</strong></p>
                  <p className="mb-3">数据清洗是发现并纠正数据中可识别错误的过程，包括处理缺失值、异常值和重复数据等。</p>
                  <p className="mb-3"><strong>常见的数据问题：</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mb-3">
                    <li>缺失值：数据中缺少某些信息</li>
                    <li>重复值：完全相同的数据出现多次</li>
                    <li>异常值：与大多数数据明显不同的值</li>
                    <li>格式不一致：日期、数字等格式不统一</li>
                  </ul>
                  <p className="mb-3"><strong>数据清洗的基本原则：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>了解数据来源和业务背景</li>
                    <li>不要随意删除数据，理解缺失原因</li>
                    <li>记录所有的数据处理步骤</li>
                    <li>多次检查，确保清洗结果合理</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">处理缺失值和重复值</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>处理缺失值的方法：</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">删除法</h4>
                      <p className="text-sm text-text">
                        当缺失数据较少且随机分布时，可以直接删除包含缺失值的行或列。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">填充法</h4>
                      <p className="text-sm text-text">
                        使用平均值、中位数、众数或业务逻辑来填充缺失值。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">插值法</h4>
                      <p className="text-sm text-text">
                        根据相邻数据点进行估算，适用于时间序列数据。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">预测法</h4>
                      <p className="text-sm text-text">
                        使用机器学习模型预测缺失值，适用于复杂场景。
                      </p>
                    </div>
                  </div>
                  <p className="mb-3"><strong>处理重复值的方法：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>识别重复记录的原因</li>
                    <li>确定保留哪一条记录（通常保留第一条或最新的一条）</li>
                    <li>检查是否有部分重复的情况</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">实战：用户画像与高价值用户识别</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>案例背景：</strong></p>
                  <p className="mb-3">某电商平台想要分析用户数据，识别高价值用户，以便制定更精准的营销策略。</p>
                  <p className="mb-3"><strong>用户数据示例：</strong></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mb-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">用户ID</th>
                          <th className="border border-gray-300 px-4 py-2">总消费</th>
                          <th className="border border-gray-300 px-4 py-2">订单数</th>
                          <th className="border border-gray-300 px-4 py-2">最近购买</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">1</td>
                          <td className="border border-gray-300 px-4 py-2">5000</td>
                          <td className="border border-gray-300 px-4 py-2">15</td>
                          <td className="border border-gray-300 px-4 py-2">2天前</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">2</td>
                          <td className="border border-gray-300 px-4 py-2">300</td>
                          <td className="border border-gray-300 px-4 py-2">2</td>
                          <td className="border border-gray-300 px-4 py-2">30天前</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">3</td>
                          <td className="border border-gray-300 px-4 py-2">8000</td>
                          <td className="border border-gray-300 px-4 py-2">25</td>
                          <td className="border border-gray-300 px-4 py-2">1天前</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">4</td>
                          <td className="border border-gray-300 px-4 py-2">2000</td>
                          <td className="border border-gray-300 px-4 py-2">8</td>
                          <td className="border border-gray-300 px-4 py-2">7天前</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">5</td>
                          <td className="border border-gray-300 px-4 py-2">100</td>
                          <td className="border border-gray-300 px-4 py-2">1</td>
                          <td className="border border-gray-300 px-4 py-2">90天前</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mb-3"><strong>分析要点：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>RFM模型：最近购买(Recency)、购买频率(Frequency)、消费金额(Monetary)</li>
                    <li>高价值用户通常消费金额高、购买频率高、最近购买过</li>
                    <li>可以根据这三个维度给用户评分和分类</li>
                    <li>针对不同用户群体制定不同的营销策略</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">交互式Python练习</h2>
            <p className="text-text mb-4">在这里尝试简单的Python代码，熟悉基础数据处理！</p>
            
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

          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">课后练习</h2>
            <div className="bg-purple rounded-xl p-6">
              <p className="text-text mb-4">请完成以下练习任务：</p>
              <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">任务1：缺失值处理</p>
                  <p className="text-text mb-2">如果你有一份包含10%缺失值的客户数据，你会选择什么方法处理？为什么？</p>
                  <div className="bg-white p-3 rounded mt-2">
                    <p className="text-sm text-gray-600">提示：考虑数据的分布情况、缺失值的性质以及业务需求来选择合适的处理方法。</p>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">任务2：异常值处理</p>
                  <p className="text-text mb-2">假设你发现数据中有一些客户的消费金额异常高（远高于平均水平），你会如何处理这些异常值？</p>
                  <div className="bg-white p-3 rounded mt-2">
                    <p className="text-sm text-gray-600">提示：异常值处理方法包括删除、替换、保留等，需要根据异常值的原因和业务场景来决定。</p>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">任务3：高价值用户识别</p>
                  <p className="text-text mb-2">如果你是一家电商公司的数据分析师，你会从哪些维度定义和识别高价值用户？</p>
                  <div className="bg-white p-3 rounded mt-2">
                    <p className="text-sm text-gray-600">提示：可以考虑RFM模型（最近购买、购买频率、消费金额）以及其他业务相关的维度。</p>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">案例分析：用户数据处理</p>
                  <p className="text-text mb-2">使用提供的示例代码，完成以下数据处理任务：</p>
                  <ul className="list-disc pl-6 space-y-1 text-text">
                    <li>创建包含缺失值的示例数据</li>
                    <li>处理缺失值（填充或删除）</li>
                    <li>识别并处理异常值</li>
                    <li>进行数据转换和分析</li>
                  </ul>
                  <div className="bg-white p-3 rounded mt-2">
                    <p className="text-sm text-gray-600">回复答案：
                      <br />1. 缺失值处理：使用平均值填充年龄，中位数填充薪资，保持数据完整性
                      <br />2. 异常值处理：设置合理的薪资范围，超出范围的值用中位数替换
                      <br />3. 数据转换：将部门转换为分类变量，创建薪资等级
                      <br />4. 数据分析：按部门分组计算平均薪资，了解各部门薪资水平
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMining;