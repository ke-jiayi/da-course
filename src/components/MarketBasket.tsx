import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress, PyodideStage } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

const TRANSACTION_CSV = `面包,牛奶,鸡蛋
面包,牛奶,黄油,果酱
鸡蛋,牛奶,酸奶
面包,鸡蛋,牛奶,黄油
牛奶,面包,饼干
鸡蛋,面包,牛奶
黄油,面包,果酱
牛奶,鸡蛋,酸奶,饼干
面包,牛奶,黄油
鸡蛋,牛奶,面包
饼干,牛奶,面包
牛奶,鸡蛋,黄油
面包,果酱,黄油
牛奶,鸡蛋,面包,饼干
鸡蛋,牛奶,酸奶
面包,牛奶,黄油,果酱
牛奶,鸡蛋,饼干
面包,黄油,鸡蛋
牛奶,面包,黄油,鸡蛋
饼干,牛奶,面包,鸡蛋`;

const STEP1_TEMPLATE = `# Step 1：读取交易数据，理解数据格式
# 任务：
# 1) 将 CSV 字符串按行/逗号拆分为 transactions 列表
# 2) 统计 交易数量、商品频次、平均每单商品数
# 3) 打印统计结果

csv_data = """${TRANSACTION_CSV}"""

# ==== 在这里写代码 ====



`;

const STEP1_SOLUTION = `# Step 1：参考答案
from collections import Counter

csv_data = """${TRANSACTION_CSV}"""

lines = [line.strip() for line in csv_data.strip().split("\\n") if line.strip()]
transactions = [[item.strip() for item in line.split(",") if item.strip()] for line in lines]

n_trans = len(transactions)
item_counter = Counter()
total_items = 0
for t in transactions:
    for item in t:
        item_counter[item] += 1
        total_items += 1
avg_items = total_items / n_trans if n_trans else 0

print("=" * 50)
print("📊 交易数据概览")
print("=" * 50)
print(f"交易总数: {n_trans}")
print(f"商品种类数: {len(item_counter)}")
print(f"商品总件数: {total_items}")
print(f"平均每单商品数: {avg_items:.2f}")
print()
print("🔁 商品频次（降序）:")
for item, cnt in item_counter.most_common():
    print(f"  {item}: {cnt} 次  (支持度 {cnt / n_trans:.2%})")
`;

const STEP2_TEMPLATE = `# Step 2：简化版 Apriori
# 任务：
# 1) 基于上一步的 transactions，计算 1-项集支持度
# 2) 计算所有 2-项集（商品对）支持度
# 3) 生成 1→1 关联规则，计算置信度
# 提示：可对商品排序后用组合方式遍历，避免重复

csv_data = """${TRANSACTION_CSV}"""

lines = [line.strip() for line in csv_data.strip().split("\\n") if line.strip()]
transactions = [[item.strip() for item in line.split(",") if item.strip()] for line in lines]
n_trans = len(transactions)

# ==== 在这里写代码 ====



`;

const STEP2_SOLUTION = `# Step 2：参考答案 —— 简化版 Apriori（1-项集、2-项集、1→1 规则）
from itertools import combinations
from collections import Counter

csv_data = """${TRANSACTION_CSV}"""

lines = [line.strip() for line in csv_data.strip().split("\\n") if line.strip()]
transactions = [[item.strip() for item in line.split(",") if item.strip()] for line in lines]
n_trans = len(transactions)

# 1-项集支持度
one_count = Counter()
for t in transactions:
    for item in set(t):
        one_count[item] += 1
one_support = {item: c / n_trans for item, c in one_count.items()}

# 2-项集支持度
pair_count = Counter()
for t in transactions:
    unique = sorted(set(t))
    for a, b in combinations(unique, 2):
        pair_count[(a, b)] += 1
two_support = {pair: c / n_trans for pair, c in pair_count.items()}

print("=" * 60)
print("📦 1-项集支持度")
print("=" * 60)
for item, sup in sorted(one_support.items(), key=lambda x: -x[1]):
    print(f"  {{{item}}}: {sup:.2%}")

print()
print("=" * 60)
print("📦 2-项集支持度 (Top 10)")
print("=" * 60)
sorted_pairs = sorted(two_support.items(), key=lambda x: -x[1])
for (a, b), sup in sorted_pairs[:10]:
    print(f"  {{{a}, {b}}}: {sup:.2%}")

print()
print("=" * 60)
print("🔗 1→1 关联规则（置信度 Top 10）")
print("=" * 60)
rules = []
for (a, b), sup_ab in two_support.items():
    conf_a_b = sup_ab / one_support[a] if one_support[a] > 0 else 0
    conf_b_a = sup_ab / one_support[b] if one_support[b] > 0 else 0
    rules.append((f"{a} → {b}", sup_ab, conf_a_b))
    rules.append((f"{b} → {a}", sup_ab, conf_b_a))

rules.sort(key=lambda r: -r[2])
for name, sup, conf in rules[:10]:
    print(f"  {name:<14}  支持度={sup:.2%}  置信度={conf:.2%}")
`;

const STEP3_TEMPLATE = `# Step 3：完整规则表 + 业务解读
# 任务：
# 1) 对所有 1→1 规则计算 支持度 / 置信度 / 提升度
# 2) 以 min_support=0.20, min_confidence=0.50, min_lift=1.0 筛选
# 3) 按 (提升度, 置信度, 支持度) 降序排列，输出完整规则表
# 4) 对 Top 3 高价值规则做一段业务解读文字

csv_data = """${TRANSACTION_CSV}"""

lines = [line.strip() for line in csv_data.strip().split("\\n") if line.strip()]
transactions = [[item.strip() for item in line.split(",") if item.strip()] for line in lines]
n_trans = len(transactions)

# ==== 在这里写代码 ====



`;

const STEP3_SOLUTION = `# Step 3：参考答案 —— 完整规则表（支持度/置信度/提升度）
from itertools import combinations
from collections import Counter

csv_data = """${TRANSACTION_CSV}"""

lines = [line.strip() for line in csv_data.strip().split("\\n") if line.strip()]
transactions = [[item.strip() for item in line.split(",") if item.strip()] for line in lines]
n_trans = len(transactions)

# 1-项集
one_count = Counter()
for t in transactions:
    for item in set(t):
        one_count[item] += 1
one_support = {item: c / n_trans for item, c in one_count.items()}

# 2-项集
pair_count = Counter()
for t in transactions:
    unique = sorted(set(t))
    for a, b in combinations(unique, 2):
        pair_count[(a, b)] += 1
two_support = {pair: c / n_trans for pair, c in pair_count.items()}

# 生成规则
MIN_SUP = 0.20
MIN_CONF = 0.50
MIN_LIFT = 1.0

rules = []
for (a, b), sup_ab in two_support.items():
    if sup_ab < MIN_SUP:
        continue
    conf_a_b = sup_ab / one_support[a] if one_support[a] > 0 else 0
    conf_b_a = sup_ab / one_support[b] if one_support[b] > 0 else 0
    lift_a_b = conf_a_b / one_support[b] if one_support[b] > 0 else 0
    lift_b_a = conf_b_a / one_support[a] if one_support[a] > 0 else 0
    if conf_a_b >= MIN_CONF and lift_a_b >= MIN_LIFT:
        rules.append((a, b, sup_ab, conf_a_b, lift_a_b))
    if conf_b_a >= MIN_CONF and lift_b_a >= MIN_LIFT:
        rules.append((b, a, sup_ab, conf_b_a, lift_b_a))

rules.sort(key=lambda r: (-r[4], -r[3], -r[2]))

print("=" * 80)
print(f"📋 关联规则完整表 (共 {len(rules)} 条, 阈值 sup≥{MIN_SUP:.0%}, conf≥{MIN_CONF:.0%}, lift≥{MIN_LIFT})")
print("=" * 80)
print(f"{'#':<3} {'规则':<16} {'支持度':<10} {'置信度':<10} {'提升度':<10}")
print("-" * 80)
for i, (a, b, s, c, l) in enumerate(rules, 1):
    print(f"{i:<3} {a} → {b:<10} {s:>7.2%}   {c:>7.2%}   {l:>7.2f}")

print()
print("=" * 80)
print("💡 Top 3 高价值规则 · 业务解读")
print("=" * 80)
for i, (a, b, s, c, l) in enumerate(rules[:3], 1):
    print()
    print(f"【规则 {i}】 {a} → {b}")
    print(f"   支持度={s:.2%}  置信度={c:.2%}  提升度={l:.2f}")
    if l >= 1.5:
        tone = "强正相关，极具推荐价值"
    elif l > 1.0:
        tone = "正相关，值得关注"
    else:
        tone = "关联性一般"
    print(f"   解读：购买「{a}」的顾客再购买「{b}」的概率是随机购买的 {l:.2f} 倍（{tone}）。")
    print(f"   建议：可将「{a}」与「{b}」相邻陈列，或设计 '{a}+{b}' 组合套餐 / 加购推荐，提升客单价与连带率。")
`;

type ExecResult = { success: boolean; output?: string; stdout: string; stderr: string; error?: { type: string; message: string } };

interface StepState {
  code: string;
  result: ExecResult | null;
  showAnswer: boolean;
  isLoading: boolean;
}

const MarketBasket: React.FC = () => {
  const [pyodideStatus, setPyodideStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [loaderStage, setLoaderStage] = useState<PyodideStage>(0);
  const [loaderPercent, setLoaderPercent] = useState(0);
  const [loaderError, setLoaderError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [step1, setStep1] = useState<StepState>({ code: STEP1_TEMPLATE, result: null, showAnswer: false, isLoading: false });
  const [step2, setStep2] = useState<StepState>({ code: STEP2_TEMPLATE, result: null, showAnswer: false, isLoading: false });
  const [step3, setStep3] = useState<StepState>({ code: STEP3_TEMPLATE, result: null, showAnswer: false, isLoading: false });

  useEffect(() => {
    if (isPyodideReady()) {
      setPyodideStatus('ready');
      setLoaderStage(4);
      setLoaderPercent(100);
      return;
    }

    setPyodideStatus('loading');
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    initPyodide((p: PyodideProgress) => {
      setLoaderStage(p.stage);
      setLoaderPercent(p.percent);
    })
      .then(() => {
        setPyodideStatus('ready');
        setLoaderStage(4);
        setLoaderPercent(100);
      })
      .catch((err: Error) => {
        setPyodideStatus('error');
        setLoaderError(err.message || 'Pyodide 初始化失败');
      })
      .finally(() => clearInterval(timer));
  }, []);

  const handleRetry = () => {
    setLoaderError(null);
    setPyodideStatus('loading');
    initPyodide((p: PyodideProgress) => {
      setLoaderStage(p.stage);
      setLoaderPercent(p.percent);
    })
      .then(() => {
        setPyodideStatus('ready');
        setLoaderStage(4);
        setLoaderPercent(100);
      })
      .catch((err: Error) => {
        setPyodideStatus('error');
        setLoaderError(err.message || 'Pyodide 初始化失败');
      });
  };

  const runCode = async (setter: React.Dispatch<React.SetStateAction<StepState>>, current: StepState) => {
    if (pyodideStatus !== 'ready' || current.isLoading) return;
    setter({ ...current, isLoading: true, result: null });
    try {
      const res = await runPythonCode(current.code);
      const result: ExecResult = {
        success: res.success,
        output: res.output,
        stdout: res.stdout,
        stderr: res.stderr,
        error: res.error ? { type: res.error.type, message: res.error.message } : undefined,
      };
      setter((prev) => ({ ...prev, isLoading: false, result }));
    } catch (err: any) {
      setter((prev) => ({
        ...prev,
        isLoading: false,
        result: { success: false, stdout: '', stderr: '', error: { type: 'ExecutionError', message: err?.message || '执行出错' } },
      }));
    }
  };

  const toggleAnswer = (setter: React.Dispatch<React.SetStateAction<StepState>>, current: StepState, answer: string, template: string) => {
    if (!current.showAnswer) {
      setter({ ...current, code: answer, showAnswer: true, result: null });
    } else {
      setter({ ...current, code: template, showAnswer: false, result: null });
    }
  };

  const resetCode = (setter: React.Dispatch<React.SetStateAction<StepState>>, template: string) => {
    setter({ code: template, result: null, showAnswer: false, isLoading: false });
  };

  const renderOutput = (result: ExecResult | null) => {
    if (!result) {
      return (
        <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-gray-500 rounded-lg">
          ⌨️ 点击「▶ 运行代码」查看输出结果
        </div>
      );
    }
    if (!result.success) {
      return (
        <div className="space-y-3">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100">
            <div className="flex items-start">
              <div className="text-xl mr-3">⚠️</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{result.error?.type || '执行错误'}</h4>
                <p className="text-sm">{result.error?.message}</p>
              </div>
            </div>
          </div>
          {result.stderr && (
            <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-red-300 rounded-lg">{result.stderr}</pre>
          )}
        </div>
      );
    }
    const content = result.output || result.stdout || '代码执行成功（无输出）';
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg">{content}</pre>
    );
  };

  const renderStep = (
    idx: number,
    title: string,
    subtitle: string,
    state: StepState,
    setState: React.Dispatch<React.SetStateAction<StepState>>,
    solution: string,
    template: string,
    editorKey: string
  ) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold text-lg mr-3 shadow">
            {idx}
          </div>
          <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-orange-50 text-sm md:text-base">{subtitle}</p>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="rounded-lg overflow-hidden border border-gray-800 shadow-inner">
          <AceEditor
            mode="python"
            theme="monokai"
            value={state.code}
            onChange={(v) => setState({ ...state, code: v, result: null })}
            name={editorKey}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ fontSize: 13, showLineNumbers: true }}
            style={{ height: '380px', width: '100%' }}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => runCode(setState, state)}
            disabled={state.isLoading || pyodideStatus !== 'ready'}
            className={`px-6 py-2 rounded-full font-bold shadow-button transition-all ${
              state.isLoading || pyodideStatus !== 'ready'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-primary text-white hover:shadow-button-hover hover:-translate-y-0.5'
            }`}
          >
            {state.isLoading ? (
              <span className="inline-flex items-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                运行中...
              </span>
            ) : (
              '▶ 运行代码'
            )}
          </button>
          <button
            onClick={() => toggleAnswer(setState, state, solution, template)}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
          >
            {state.showAnswer ? '✍ 恢复练习模板' : '💡 显示参考答案'}
          </button>
          <button
            onClick={() => resetCode(setState, template)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
          >
            ↺ 重置
          </button>
        </div>

        <div>{renderOutput(state.result)}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Hero 区域 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-10 text-center border border-orange-100 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 text-9xl opacity-10">🛒</div>
          <div className="absolute -bottom-8 -left-8 text-8xl opacity-10">📊</div>
          <div className="relative">
            <div className="text-7xl md:text-8xl mb-4 inline-block animate-bounce-slow">🛒</div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">
              购物篮分析 <span className="text-orange-600">实战课程</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              从 CSV 交易数据出发，亲手实现简化版 Apriori 算法，计算支持度、置信度、提升度，
              挖掘商品之间的隐藏关联，为零售运营提供数据驱动的决策建议。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">🐍 Python 代码实战</span>
              <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">📈 Apriori 算法</span>
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">💼 业务解读</span>
            </div>
          </div>
        </div>

        {/* Pyodide 加载器 */}
        {pyodideStatus !== 'ready' && (
          <div className="mb-10">
            <PyodideLoader
              stage={loaderStage}
              percent={loaderPercent}
              error={loaderError}
              elapsedSeconds={elapsedSeconds}
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* 核心概念板块 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 mb-10 border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="mr-3">🧠</span> 核心概念
          </h2>
          <p className="text-gray-600 mb-8">掌握购物篮分析的三大基石：问题定义、核心算法、指标应用。</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-5xl mb-3">🛍️</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">什么是购物篮分析</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                购物篮分析（Market Basket Analysis）是一种数据挖掘技术，通过分析顾客在一次交易中
                同时购买的商品组合，揭示商品之间的<strong>关联关系</strong>。经典案例：
                <em>"啤酒与尿布"</em>——年轻父亲在购买尿布时常同时购买啤酒。
              </p>
              <div className="mt-4 bg-white rounded-lg p-3 text-xs font-mono text-blue-900">
                输入：交易记录（每行 = 一次购物）<br />
                输出：{'{A → B}'} 形式的关联规则
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="text-5xl mb-3">🧮</div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Apriori 算法简介</h3>
              <p className="text-sm text-green-700 leading-relaxed">
                Apriori 利用"先验性质"：<strong>若一个项集频繁，则其所有子集也必须频繁</strong>。
                通过迭代地从 k-项集生成 (k+1)-项集，并按最小支持度剪枝，从而高效挖掘频繁项集。
              </p>
              <div className="mt-4 bg-white rounded-lg p-3 text-xs font-mono text-green-900">
                1-项集 → 2-项集 → 3-项集 → ...<br />
                直至无新频繁项集生成
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="text-5xl mb-3">📏</div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">关联规则三大指标</h3>
              <p className="text-sm text-purple-700 leading-relaxed mb-3">
                每条规则 A → B 用三个指标衡量其价值：
              </p>
              <ul className="text-xs space-y-1 text-purple-800 font-mono bg-white rounded-lg p-3">
                <li>• <strong>支持度</strong> = P(A,B)</li>
                <li>• <strong>置信度</strong> = P(B|A) = sup(A,B)/sup(A)</li>
                <li>• <strong>提升度</strong> = conf(A→B)/P(B)</li>
              </ul>
              <p className="mt-3 text-xs text-purple-700">
                提升度 {'>'} 1 表示规则有效；提升度越大，关联越强。
              </p>
            </div>
          </div>
        </div>

        {/* 3 步递进练习 */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <span className="mr-3">💻</span> 3 步递进练习
          </h2>
          <p className="text-gray-600">从数据读取到规则挖掘，再到业务洞察，循序渐进，亲手实现每一步。</p>
        </div>

        <div className="space-y-8">
          {renderStep(
            1,
            'Step 1 · 数据读取与概览',
            '解析 CSV 交易数据，统计交易数量、商品频次与平均每单商品数。',
            step1,
            setStep1,
            STEP1_SOLUTION,
            STEP1_TEMPLATE,
            'mb-step1'
          )}

          {renderStep(
            2,
            'Step 2 · 简化版 Apriori',
            '计算 1-项集 / 2-项集支持度，并生成 1→1 关联规则与置信度。',
            step2,
            setStep2,
            STEP2_SOLUTION,
            STEP2_TEMPLATE,
            'mb-step2'
          )}

          {renderStep(
            3,
            'Step 3 · 完整规则表与业务解读',
            '对所有规则计算支持度/置信度/提升度，筛选高价值规则并给出零售业务建议。',
            step3,
            setStep3,
            STEP3_SOLUTION,
            STEP3_TEMPLATE,
            'mb-step3'
          )}
        </div>

        {/* 课程完成 */}
        <div className="mt-12">
          <CourseCompletion
            courseId="market-basket"
            courseTitle="购物篮分析"
            badgeIcon="🛒"
            badgeName="购物篮分析师"
          />
        </div>

        <div className="text-center text-gray-400 text-sm mt-8 pb-4">
          ——— 本课程由 Python 实战驱动 · 继续加油，解锁更多数据技能 ———
        </div>
      </div>
    </div>
  );
};

export default MarketBasket;
