import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode } from '../services/pyodideService';

const DataVisualization: React.FC = () => {
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

  const defaultCode = `# 简单的Python示例
print("欢迎学习数据可视化！")
print("\n在这个课程中，你将学习：")
print("1. 基础Python语法")
print("2. 数据可视化概念")
print("3. 常用图表类型")

# 简单计算
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"\n数字总和: {total}")
print(f"数字列表: {numbers}")`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 数据可视化实战</h1>
          
          <div className="mb-10">
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>学习基础Python语法和数据结构</li>
                <li>了解常见的数据可视化图表类型</li>
                <li>掌握数据可视化的基本概念和最佳实践</li>
                <li>能够理解和分析数据可视化结果</li>
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
                <h3 className="text-lg font-semibold text-text">数据可视化基础</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>什么是数据可视化？</strong></p>
                  <p className="mb-3">数据可视化是将数据转换为图形或图表的过程，目的是使数据更容易理解和解释。</p>
                  <p className="mb-3"><strong>常见的图表类型：</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mb-3">
                    <li>折线图：显示数据随时间的变化趋势</li>
                    <li>柱状图：比较不同类别的数据</li>
                    <li>饼图：显示各部分占整体的比例</li>
                    <li>散点图：显示两个变量之间的关系</li>
                  </ul>
                  <p className="mb-3"><strong>数据可视化的最佳实践：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>选择合适的图表类型</li>
                    <li>保持简洁，避免过度装饰</li>
                    <li>使用清晰的标签和标题</li>
                    <li>确保数据准确无误</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">常用图表详解</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-text mb-2">折线图</h4>
                    <p className="text-sm text-text mb-2">
                      适用于显示数据随时间的变化趋势。
                      <br />例如：每日销售额、月度温度变化
                    </p>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Python代码示例：</p>
                      <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
{`# 折线图示例 - 展示月度销售额趋势
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 示例数据
months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [120, 150, 180, 160, 200, 220]

# 创建折线图
plt.figure(figsize=(8, 4))
plt.plot(months, sales, marker='o', linestyle='-', color='b')
plt.title('月度销售额趋势')
plt.xlabel('月份')
plt.ylabel('销售额（万元）')
plt.grid(True)
plt.tight_layout()

# 保存图表
plt.savefig('monthly_sales_trend.png', dpi=150, bbox_inches='tight')
print("图表已保存为 monthly_sales_trend.png")`}
                      </pre>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-text mb-2">柱状图</h4>
                    <p className="text-sm text-text mb-2">
                      适用于比较不同类别的数据。
                      <br />例如：各地区销售对比、产品销量排行
                    </p>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Python代码示例：</p>
                      <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
{`# 柱状图示例 - 比较各地区销售额
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 示例数据
regions = ['华东', '华北', '华南', '西南', '西北']
sales = [250, 180, 220, 150, 100]

# 创建柱状图
plt.figure(figsize=(8, 4))
plt.bar(regions, sales, color='g')
plt.title('各地区销售额对比')
plt.xlabel('地区')
plt.ylabel('销售额（万元）')
plt.tight_layout()

# 保存图表
plt.savefig('region_sales_comparison.png', dpi=150, bbox_inches='tight')
print("图表已保存为 region_sales_comparison.png")`}
                      </pre>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-text mb-2">饼图</h4>
                    <p className="text-sm text-text mb-2">
                      适用于显示各部分占整体的比例。
                      <br />例如：市场份额、产品分类占比
                    </p>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Python代码示例：</p>
                      <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
{`# 饼图示例 - 展示产品分类占比
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 示例数据
categories = ['电子产品', '服装', '食品', '图书', '其他']
market_share = [35, 25, 20, 15, 5]

# 创建饼图
plt.figure(figsize=(6, 6))
plt.pie(market_share, labels=categories, autopct='%1.1f%%')
plt.title('产品分类市场占比')
plt.tight_layout()

# 保存图表
plt.savefig('product_market_share.png', dpi=150, bbox_inches='tight')
print("图表已保存为 product_market_share.png")`}
                      </pre>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-text mb-2">散点图</h4>
                    <p className="text-sm text-text mb-2">
                      适用于显示两个变量之间的关系。
                      <br />例如：广告投入与销量、年龄与收入
                    </p>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Python代码示例：</p>
                      <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
{`# 散点图示例 - 展示广告投入与销量的关系
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# 生成示例数据
np.random.seed(42)
advertising = np.linspace(10, 100, 50)
sales = 20 + 0.5 * advertising + np.random.normal(0, 10, 50)

# 创建散点图
plt.figure(figsize=(8, 4))
plt.scatter(advertising, sales, alpha=0.6)
plt.title('广告投入与销量关系')
plt.xlabel('广告投入（万元）')
plt.ylabel('销量（万元）')
plt.grid(True)
plt.tight_layout()

# 保存图表
plt.savefig('ad_sales_scatter.png', dpi=150, bbox_inches='tight')
print("图表已保存为 ad_sales_scatter.png")`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">实战：电商销售数据可视化</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>案例背景：</strong></p>
                  <p className="mb-3">某电商平台想要分析过去6个月的销售数据，以便制定更好的营销策略。</p>
                  <p className="mb-3"><strong>数据示例：</strong></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mb-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">月份</th>
                          <th className="border border-gray-300 px-4 py-2">销售额（万元）</th>
                          <th className="border border-gray-300 px-4 py-2">订单数</th>
                          <th className="border border-gray-300 px-4 py-2">用户数</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">1月</td>
                          <td className="border border-gray-300 px-4 py-2">120</td>
                          <td className="border border-gray-300 px-4 py-2">6000</td>
                          <td className="border border-gray-300 px-4 py-2">3000</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">2月</td>
                          <td className="border border-gray-300 px-4 py-2">150</td>
                          <td className="border border-gray-300 px-4 py-2">7500</td>
                          <td className="border border-gray-300 px-4 py-2">3800</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">3月</td>
                          <td className="border border-gray-300 px-4 py-2">180</td>
                          <td className="border border-gray-300 px-4 py-2">9000</td>
                          <td className="border border-gray-300 px-4 py-2">4500</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">4月</td>
                          <td className="border border-gray-300 px-4 py-2">160</td>
                          <td className="border border-gray-300 px-4 py-2">8000</td>
                          <td className="border border-gray-300 px-4 py-2">4000</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">5月</td>
                          <td className="border border-gray-300 px-4 py-2">200</td>
                          <td className="border border-gray-300 px-4 py-2">10000</td>
                          <td className="border border-gray-300 px-4 py-2">5200</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">6月</td>
                          <td className="border border-gray-300 px-4 py-2">220</td>
                          <td className="border border-gray-300 px-4 py-2">11000</td>
                          <td className="border border-gray-300 px-4 py-2">5800</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mb-3"><strong>分析建议：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>使用折线图显示月度销售额趋势</li>
                    <li>使用柱状图比较各月订单数</li>
                    <li>观察用户增长与销售额的关系</li>
                    <li>分析哪些月份是销售旺季</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">交互式Python练习</h2>
            <p className="text-text mb-4">在这里尝试简单的Python代码，熟悉基础语法！</p>
            
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
              <p className="text-text mb-4">思考以下问题：</p>
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">1. 如果你有一组学生的考试成绩数据，你会选择什么图表来展示？为什么？</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">2. 假设你要展示公司过去一年的月度收入变化，你会使用哪种图表？请简要说明你的选择理由。</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">3. 如果你要比较不同产品类别的销售额占比，哪种图表最合适？</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;