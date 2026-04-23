import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode } from '../services/pyodideService';

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
        setOutput(result.output || '');
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

  const defaultCode = `# 商业分析基础示例
print("欢迎学习商业数据分析！")
print("\n在这个课程中，你将学习：")
print("1. 关键商业指标")
print("2. 数据分析方法")
print("3. 商业决策支持")

# 简单的商业计算示例
sales = [10000, 12000, 15000, 14000, 18000]
orders = [50, 60, 75, 70, 90]

total_sales = sum(sales)
total_orders = sum(orders)
avg_order_value = total_sales / total_orders

print(f"总销售额: {total_sales}")
print(f"总订单数: {total_orders}")
print(f"平均订单金额: {avg_order_value:.2f}")`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 商业数据计算与分析</h1>
          
          <div className="mb-10">
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>理解核心商业指标的含义和计算方法</li>
                <li>学习多维度数据分析的基本思路</li>
                <li>掌握商业数据分析的常用工具和技术</li>
                <li>能够将数据分析结果转化为商业决策</li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-primary">前置知识</h2>
            <div className="bg-yellow rounded-xl p-6">
              <p className="text-text">基础数学知识、对商业运营的基本理解</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">课程内容</h2>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                <h3 className="text-lg font-semibold text-text">核心商业指标计算</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>什么是关键绩效指标(KPI)？</strong></p>
                  <p className="mb-3">KPI是衡量组织或业务绩效的可量化指标，帮助企业跟踪目标完成情况。</p>
                  <p className="mb-3"><strong>常见的商业指标：</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">销售额(GMR)</h4>
                      <p className="text-sm text-text">
                        一定时期内的总销售收入，是衡量业务规模的基础指标。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">平均订单价值(AOV)</h4>
                      <p className="text-sm text-text">
                        总销售额除以订单数，反映客户单次购买的平均金额。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">转化率(CR)</h4>
                      <p className="text-sm text-text">
                        访客中完成购买的比例，衡量营销和用户体验效果。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-text mb-2">复购率(RR)</h4>
                      <p className="text-sm text-text">
                        重复购买的客户比例，反映客户忠诚度和产品质量。
                      </p>
                    </div>
                  </div>
                  <p className="mb-3"><strong>指标计算的注意事项：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>明确定义每个指标的计算方式</li>
                    <li>确保数据来源和统计口径一致</li>
                    <li>关注趋势变化而非单一数值</li>
                    <li>将指标与业务目标结合分析</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">多维度分析：门店、渠道、时间</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>为什么需要多维度分析？</strong></p>
                  <p className="mb-3">单一维度的数据只能告诉我们"发生了什么"，多维度分析才能告诉我们"为什么发生"。</p>
                  <p className="mb-3"><strong>常见的分析维度：</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>时间维度：日、周、月、季度、年</li>
                    <li>产品维度：类别、品牌、价格区间</li>
                    <li>客户维度：新老客户、年龄段、地区</li>
                    <li>渠道维度：线上、线下、不同平台</li>
                    <li>区域维度：城市、地区、国家</li>
                  </ul>
                  <p className="mb-3"><strong>多维度分析的方法：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>对比分析：不同时间段或群体的指标对比</li>
                    <li>趋势分析：观察指标随时间的变化</li>
                    <li>占比分析：各部分在整体中的比重</li>
                    <li>关联分析：不同指标之间的关系</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">实战：电商月度经营分析</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-text mb-4">
                  <p className="mb-3"><strong>案例背景：</strong></p>
                  <p className="mb-3">某电商平台需要进行月度经营分析，了解业务表现并制定下月策略。</p>
                  <p className="mb-3"><strong>经营数据示例：</strong></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mb-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">月份</th>
                          <th className="border border-gray-300 px-4 py-2">销售额(万)</th>
                          <th className="border border-gray-300 px-4 py-2">订单数</th>
                          <th className="border border-gray-300 px-4 py-2">用户数</th>
                          <th className="border border-gray-300 px-4 py-2">毛利率(%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">1月</td>
                          <td className="border border-gray-300 px-4 py-2">120</td>
                          <td className="border border-gray-300 px-4 py-2">6000</td>
                          <td className="border border-gray-300 px-4 py-2">3000</td>
                          <td className="border border-gray-300 px-4 py-2">40</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">2月</td>
                          <td className="border border-gray-300 px-4 py-2">150</td>
                          <td className="border border-gray-300 px-4 py-2">7500</td>
                          <td className="border border-gray-300 px-4 py-2">3800</td>
                          <td className="border border-gray-300 px-4 py-2">41</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">3月</td>
                          <td className="border border-gray-300 px-4 py-2">180</td>
                          <td className="border border-gray-300 px-4 py-2">9000</td>
                          <td className="border border-gray-300 px-4 py-2">4500</td>
                          <td className="border border-gray-300 px-4 py-2">42</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">4月</td>
                          <td className="border border-gray-300 px-4 py-2">160</td>
                          <td className="border border-gray-300 px-4 py-2">8000</td>
                          <td className="border border-gray-300 px-4 py-2">4000</td>
                          <td className="border border-gray-300 px-4 py-2">43</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">5月</td>
                          <td className="border border-gray-300 px-4 py-2">200</td>
                          <td className="border border-gray-300 px-4 py-2">10000</td>
                          <td className="border border-gray-300 px-4 py-2">5200</td>
                          <td className="border border-gray-300 px-4 py-2">44</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">6月</td>
                          <td className="border border-gray-300 px-4 py-2">220</td>
                          <td className="border border-gray-300 px-4 py-2">11000</td>
                          <td className="border border-gray-300 px-4 py-2">5800</td>
                          <td className="border border-gray-300 px-4 py-2">45</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mb-3"><strong>分析重点：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>销售额和用户数的增长趋势</li>
                    <li>平均订单金额的变化</li>
                    <li>毛利率的提升空间</li>
                    <li>各指标之间的关联关系</li>
                    <li>下月业务目标的设定依据</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">交互式Python练习</h2>
            <p className="text-text mb-4">在这里尝试简单的Python代码，熟悉商业数据计算！</p>
            
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
              <p className="text-text mb-4">思考以下问题：</p>
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">1. 如果你是一家零售企业的数据分析员，你会重点关注哪些KPI？为什么？</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">2. 假设你发现某产品的销售额在下降，但毛利率在上升，你会如何分析这种情况？</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">3. 如果你需要向管理层汇报月度经营情况，你会如何组织你的分析报告？</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalysis;