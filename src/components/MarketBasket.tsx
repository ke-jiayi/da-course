import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const MarketBasket: React.FC = () => {
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

  const placeholderCode = `# 购物篮分析练习
# 点击"显示参考答案"按钮查看示例代码

# 提示：
# 1. 尝试统计商品出现频率
# 2. 计算商品组合的支持度
# 3. 挖掘频繁项集

`;

  const defaultCode = `# 购物篮分析 - 支持度、置信度、提升度计算
from itertools import combinations

print("=" * 50)
print("购物篮分析 - 关联规则挖掘")
print("=" * 50)

transactions = [
    ["牛奶", "面包", "黄油"],
    ["牛奶", "面包"],
    ["面包", "黄油", "果酱"],
    ["牛奶", "面包", "黄油", "果酱"],
    ["牛奶", "面包"],
    ["面包", "黄油"],
    ["牛奶", "果酱"],
    ["面包", "牛奶", "果酱"],
]

n_transactions = len(transactions)
print(f"\\n总交易数: {n_transactions}")

print("\\n" + "=" * 50)
print("【第一步】计算单个商品的支持度")
print("=" * 50)

item_count = {}
for trans in transactions:
    for item in trans:
        item_count[item] = item_count.get(item, 0) + 1

print("\\n商品支持度:")
for item, count in sorted(item_count.items(), key=lambda x: -x[1]):
    support = count / n_transactions
    print(f"  {item}: {count}次, 支持度 = {support:.2%}")

print("\\n" + "=" * 50)
print("【第二步】计算商品对的联合支持度")
print("=" * 50)

pair_count = {}
for trans in transactions:
    for pair in combinations(sorted(trans), 2):
        pair_count[pair] = pair_count.get(pair, 0) + 1

print("\\n商品对联合支持度:")
for pair, count in sorted(pair_count.items(), key=lambda x: -x[1]):
    support = count / n_transactions
    print(f"  {pair[0]} + {pair[1]}: {count}次, 支持度 = {support:.2%}")

print("\\n" + "=" * 50)
print("【第三步】计算关联规则的置信度和提升度")
print("=" * 50)

def calculate_lift(confidence, item_support, consequent_support):
    return confidence / consequent_support if consequent_support > 0 else 0

print("\\n关联规则示例:")
rules = [
    (("牛奶",), ("面包",)),
    (("面包",), ("黄油",)),
    (("牛奶",), ("果酱",)),
]

for antecedent, consequent in rules:
    ant_count = item_count.get(antecedent[0], 0)
    cons_count = item_count.get(consequent[0], 0)
    combined = pair_count.get((antecedent[0], consequent[0]), 0) or \
               pair_count.get((consequent[0], antecedent[0]), 0)
    
    ant_support = ant_count / n_transactions
    cons_support = cons_count / n_transactions
    combined_support = combined / n_transactions
    confidence = combined_support / ant_support if ant_support > 0 else 0
    lift = calculate_lift(confidence, ant_support, cons_support)
    
    print(f"\\n  {antecedent[0]} → {consequent[0]}:")
    print(f"    支持度: {combined_support:.2%}")
    print(f"    置信度: {confidence:.2%}")
    print(f"    提升度: {lift:.2f}")

print("\\n" + "=" * 50)
print("【第四步】使用Apriori算法挖掘频繁项集")
print("=" * 50)

def apriori(transactions, min_support=0.2):
    itemsets = {}
    freq_itemsets = []
    
    item_count = {}
    for trans in transactions:
        for item in trans:
            item_count[item] = item_count.get(item, 0) + 1
    
    n = len(transactions)
    for item, count in item_count.items():
        if count / n >= min_support:
            itemsets[frozenset([item])] = count / n
            freq_itemsets.append((frozenset([item]), count / n))
    
    k = 2
    current_itemsets = list(itemsets.keys())
    
    while current_itemsets:
        new_itemsets = {}
        for i in range(len(current_itemsets)):
            for j in range(i + 1, len(current_itemsets)):
                union = current_itemsets[i] | current_itemsets[j]
                if len(union) == k:
                    count = sum(1 for t in transactions if union.issubset(t))
                    support = count / n
                    if support >= min_support and union not in itemsets:
                        itemsets[union] = support
                        freq_itemsets.append((union, support))
        
        current_itemsets = list(new_itemsets.keys())
        k += 1
    
    return sorted(freq_itemsets, key=lambda x: -x[1])

print(f"\\n最小支持度阈值: 20%")
print("\\n频繁项集:")
for itemset, support in apriori(transactions, 0.2):
    items_str = ", ".join(sorted(itemset))
    print(f"  {{{items_str}}}: 支持度 = {support:.2%}")

print("\\n" + "=" * 50)
print("✓ 购物篮分析完成！")
print("=" * 50)`;

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '关联规则、支持度、置信度、提升度'
    },
    {
      id: 2,
      title: '实战案例',
      description: '零售商品关联分析'
    },
    {
      id: 3,
      title: '高级应用',
      description: '商品推荐、货架优化'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 购物篮分析</h1>
            <p className="text-text">学习关联规则挖掘，发现商品之间的关联关系</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-orange-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-orange-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-orange-100'
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
                <p className="text-text text-sm">理解关联规则的基本概念和核心指标</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握支持度、置信度、提升度的计算方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会使用Apriori算法挖掘频繁项集</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够应用于商品推荐和货架优化场景</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">关联规则基础概念</h3>
                    <p className="text-text mb-3">关联规则是数据挖掘中的一种技术，用于发现数据项之间的关联关系。最经典的案例是"啤酒与尿布"。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📊 支持度 (Support)</h4>
                      <p className="text-sm text-blue-700 mb-2">项集在所有交易中出现的频率</p>
                      <div className="bg-white p-2 rounded text-xs font-mono">
                        Support(A) = P(A) = count(A) / 总交易数
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">📈 置信度 (Confidence)</h4>
                      <p className="text-sm text-green-700 mb-2">规则的可靠程度</p>
                      <div className="bg-white p-2 rounded text-xs font-mono">
                        Conf(A→B) = P(B|A) = P(A,B) / P(A)
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">🎯 提升度 (Lift)</h4>
                      <p className="text-sm text-purple-700 mb-2">规则的有效性指标</p>
                      <div className="bg-white p-2 rounded text-xs font-mono">
                        Lift(A→B) = Conf(A→B) / P(B)
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-800 mb-2">💡 指标解读</p>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• <strong>支持度 &gt; 阈值</strong>：规则具有普遍性（通常设 1%-5%）</li>
                      <li>• <strong>置信度 &gt; 阈值</strong>：规则可信（通常设 50%-80%）</li>
                      <li>• <strong>提升度 &gt; 1</strong>：正相关；= 1 无关；&lt; 1 负相关</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📋 示例：超市交易数据</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">交易ID</th>
                            <th className="border border-gray-300 px-4 py-2">购买的商品</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">T1</td>
                            <td className="border border-gray-300 px-4 py-2">牛奶, 面包, 黄油</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">T2</td>
                            <td className="border border-gray-300 px-4 py-2">牛奶, 面包</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">T3</td>
                            <td className="border border-gray-300 px-4 py-2">面包, 黄油, 果酱</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">T4</td>
                            <td className="border border-gray-300 px-4 py-2">牛奶, 面包, 黄油, 果酱</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📊 指标计算示例</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">规则</th>
                            <th className="border border-gray-300 px-4 py-2">支持度</th>
                            <th className="border border-gray-300 px-4 py-2">置信度</th>
                            <th className="border border-gray-300 px-4 py-2">提升度</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">牛奶 → 面包</td>
                            <td className="border border-gray-300 px-4 py-2">75% (3/4)</td>
                            <td className="border border-gray-300 px-4 py-2">100% (3/3)</td>
                            <td className="border border-gray-300 px-4 py-2">1.33</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">面包 → 牛奶</td>
                            <td className="border border-gray-300 px-4 py-2">75% (3/4)</td>
                            <td className="border border-gray-300 px-4 py-2">75% (3/4)</td>
                            <td className="border border-gray-300 px-4 py-2">1.33</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">黄油 → 面包</td>
                            <td className="border border-gray-300 px-4 py-2">75% (3/4)</td>
                            <td className="border border-gray-300 px-4 py-2">100% (3/3)</td>
                            <td className="border border-gray-300 px-4 py-2">1.33</td>
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
                    <h3 className="font-semibold text-lg mb-2">📊 零售商品关联分析实战</h3>
                    <p className="text-text mb-3">在实际零售场景中，通过购物篮分析可以发现商品之间的购买关联规律。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">🏪 应用场景</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• 超市货架布局优化</li>
                        <li>• 商品捆绑销售策略</li>
                        <li>• 促销活动设计</li>
                        <li>• 会员精准营销</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">💰 商业价值</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 增加客单价 15%-30%</li>
                        <li>• 提升商品曝光率</li>
                        <li>• 减少库存积压</li>
                        <li>• 优化采购计划</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📋 零售交易数据集</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">交易ID</th>
                            <th className="border border-gray-300 px-4 py-2">牛奶</th>
                            <th className="border border-gray-300 px-4 py-2">面包</th>
                            <th className="border border-gray-300 px-4 py-2">黄油</th>
                            <th className="border border-gray-300 px-4 py-2">果酱</th>
                            <th className="border border-gray-300 px-4 py-2">鸡蛋</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">2</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">4</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">5</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-800 mb-2">💡 分析结论</p>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• <strong>牛奶 + 面包</strong>：最常见的组合，支持度高达 60%，可放在相邻货架</li>
                      <li>• <strong>面包 → 黄油</strong>：置信度 100%，买面包的顾客都会买黄油</li>
                      <li>• <strong>套餐推荐</strong>：可将牛奶+面包+黄油打包成"早餐套餐"促销</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔧 高级应用场景</h3>
                    <p className="text-text mb-3">关联规则在电商和零售领域有众多高级应用场景。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">🛒 商品推荐系统</h4>
                      <p className="text-sm text-blue-700 mb-2">基于用户的购买历史，推荐相关商品</p>
                      <div className="bg-white p-3 rounded text-xs font-mono">
                        用户买了A → 推荐B (Lift {'>'}= 2)
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">🏪 货架优化</h4>
                      <p className="text-sm text-green-700 mb-2">将关联商品放置在相邻位置</p>
                      <div className="bg-white p-3 rounded text-xs font-mono">
                        A与B强关联 → 货架相邻摆放
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">🎁 促销设计</h4>
                      <p className="text-sm text-purple-700 mb-2">设计捆绑套餐和买赠活动</p>
                      <div className="bg-white p-3 rounded text-xs font-mono">
                        A+B高置信度 → 捆绑降价销售
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">📢 目录设计</h4>
                      <p className="text-sm text-orange-700 mb-2">优化商品目录和网页布局</p>
                      <div className="bg-white p-3 rounded text-xs font-mono">
                        关联规则 → 交叉销售位置
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📊 Apriori算法步骤</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-start">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
                        <p className="text-sm text-text"><strong>扫描数据集</strong>：统计每个单项的出现次数，计算支持度</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
                        <p className="text-sm text-text"><strong>设定阈值</strong>：设定最小支持度阈值，筛选频繁1-项集</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
                        <p className="text-sm text-text"><strong>连接与剪枝</strong>：生成候选项集，利用先验性质剪枝</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
                        <p className="text-sm text-text"><strong>迭代</strong>：重复上述步骤，直到没有新的频繁项集</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">5</span>
                        <p className="text-sm text-text"><strong>生成规则</strong>：从频繁项集中生成关联规则，计算置信度和提升度</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-800 mb-2">💡 注意事项</p>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• 支持度过高可能导致规则价值低（普遍现象）</li>
                      <li>• 提升度过低说明规则实际意义不大</li>
                      <li>• 数据量越大，挖掘结果越可靠</li>
                      <li>• 需要结合业务理解选择有价值的规则</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验购物篮分析的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || placeholderCode}
                  onChange={handleCodeChange}
                  name="market-basket-editor"
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="rounded-lg shadow-md"
                  style={{ height: '350px', width: '100%' }}
                />
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
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
                    setCode(defaultCode);
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
                <p className="font-medium mb-2">1. 为什么"啤酒与尿布"的关联规则在现实中需要谨慎对待？</p>
                <p className="text-sm text-gray-600">提示：考虑相关性不等于因果关系，以及虚假相关性的问题</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 如何在实际项目中选择合适的最小支持度和置信度阈值？</p>
                <p className="text-sm text-gray-600">提示：需要平衡规则的数量和质量，考虑业务场景和计算成本</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">3. 除了Apriori算法，还有哪些频繁项集挖掘算法？各有何优缺点？</p>
                <p className="text-sm text-gray-600">提示：考虑FP-Growth、Eclat等算法，以及它们的时间和空间复杂度</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketBasket;
