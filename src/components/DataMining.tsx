import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress, PyodideStage } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

interface StepState {
  code: string;
  output: string;
  error: string;
  isLoading: boolean;
  showAnswer: boolean;
}

const shoppingBasketCSV = `面包,牛奶,鸡蛋
面包,尿布,啤酒,鸡蛋
牛奶,尿布,啤酒,可乐
面包,牛奶,尿布,啤酒
面包,牛奶,尿布,可乐
鸡蛋,牛奶,面包
尿布,啤酒,可乐
面包,牛奶,鸡蛋,黄油
尿布,啤酒,鸡蛋,牛奶
可乐,面包,牛奶
啤酒,尿布,鸡蛋
面包,黄油,牛奶
尿布,啤酒,可乐,鸡蛋
牛奶,面包,鸡蛋
可乐,啤酒,尿布
面包,牛奶,黄油,鸡蛋
尿布,啤酒,牛奶,面包
鸡蛋,牛奶,可乐
面包,尿布,啤酒
牛奶,鸡蛋,黄油`;

const step1Placeholder = `# Step 1 基础练习：读取购物篮数据并统计商品频率
# 任务：
# 1. 解析 CSV 格式的购物篮数据（每行为一笔交易，逗号分隔商品）
# 2. 统计每个商品出现的次数（即频率）
# 3. 按频率从高到低排序，输出 Top 10 商品

# 数据已嵌入 csv_data 变量，每行是一笔交易
# 你的代码从这里开始...

`;

const step1Answer = `# Step 1 参考答案：商品频率统计
csv_data = """${shoppingBasketCSV}"""

# 解析 CSV 数据，每笔交易是一个商品列表
transactions = []
for line in csv_data.strip().split('\\n'):
    items = [item.strip() for item in line.split(',') if item.strip()]
    if items:
        transactions.append(items)

print('=' * 50)
print('📊 购物篮数据概览')
print('=' * 50)
print(f'总交易笔数: {len(transactions)}')

# 展示前 5 笔交易，理解数据格式
print('\\n前 5 笔交易示例:')
for i, t in enumerate(transactions[:5], 1):
    print(f'  交易{i}: {t}')

# 统计所有商品的频率
item_counts = {}
for t in transactions:
    for item in t:
        item_counts[item] = item_counts.get(item, 0) + 1

# 按频率排序
sorted_items = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)
total_items = sum(item_counts.values())
unique_items = len(item_counts)

print(f'\\n商品总出现次数: {total_items}')
print(f'商品种类数: {unique_items}')

# 输出 Top 10 商品频率
print('\\n' + '=' * 50)
print('🏆 Top 10 商品频率')
print('=' * 50)
print(f'{"排名":<6}{"商品":<10}{"次数":<8}{"频率":<10}')
print('-' * 50)
for idx, (item, count) in enumerate(sorted_items[:10], 1):
    freq = count / len(transactions)
    bar = '█' * int(freq * 40)
    print(f'{idx:<6}{item:<10}{count:<8}{freq:.2%}  {bar}')

# 长尾商品
if len(sorted_items) > 10:
    print('\\n其它商品:')
    for item, count in sorted_items[10:]:
        print(f'  {item}: {count}次 ({count / len(transactions):.2%})')
`;

const step2Placeholder = `# Step 2 进阶练习：Apriori 算法实现频繁项集与关联规则
# 任务：
# 1. 理解 Apriori 原理：频繁项集的所有子集也必须是频繁的
# 2. 实现 1-项集、2-项集、3-项集 的支持度计算
# 3. 基于频繁项集生成关联规则，并计算置信度 (Confidence)
# 4. 设置最小支持度 min_support = 0.3，最小置信度 min_conf = 0.5

# 提示：可以使用 itertools.combinations 生成项集组合

`;

const step2Answer = `# Step 2 参考答案：Apriori 算法 & 关联规则
from itertools import combinations

csv_data = """${shoppingBasketCSV}"""

# 解析交易数据
transactions = []
for line in csv_data.strip().split('\\n'):
    items = sorted([item.strip() for item in line.split(',') if item.strip()])
    if items:
        transactions.append(items)

N = len(transactions)
min_support = 0.3
min_conf = 0.5

print('=' * 60)
print('🔍 Apriori 算法：频繁项集与关联规则')
print('=' * 60)
print(f'总交易数 N = {N}')
print(f'最小支持度 min_support = {min_support}')
print(f'最小置信度 min_conf = {min_conf}')

# 获取所有唯一商品
all_items = sorted(set(item for t in transactions for item in t))
print(f'\\n商品集合: {all_items}')

# 辅助函数：计算一个项集的支持度
def get_support(itemset):
    itemset = set(itemset)
    count = 0
    for t in transactions:
        if itemset.issubset(set(t)):
            count += 1
    return count, count / N

# ===== Step 1: 找出 1-项集（单个商品的频率）=====
print('\\n' + '=' * 60)
print('1️⃣  频繁 1-项集 (k=1)')
print('=' * 60)
freq_1 = {}
for item in all_items:
    count, sup = get_support([item])
    if sup >= min_support:
        freq_1[(item,)] = sup
        print(f'  {{{item}}}: 支持度 = {sup:.4f} ({count}/{N})  ✅')
    else:
        print(f'  {{{item}}}: 支持度 = {sup:.4f} ({count}/{N})  ❌ (低于阈值)')

# ===== Step 2: 找出 2-项集 =====
print('\\n' + '=' * 60)
print('2️⃣  频繁 2-项集 (k=2)')
print('=' * 60)
freq_items_1 = [list(k)[0] for k in freq_1.keys()]
freq_2 = {}
for pair in combinations(sorted(freq_items_1), 2):
    count, sup = get_support(pair)
    if sup >= min_support:
        freq_2[tuple(sorted(pair))] = sup
        print(f'  {{{pair[0]}, {pair[1]}}}: 支持度 = {sup:.4f} ({count}/{N})  ✅')
    else:
        print(f'  {{{pair[0]}, {pair[1]}}}: 支持度 = {sup:.4f} ({count}/{N})  ❌ (低于阈值)')

# ===== Step 3: 找出 3-项集 =====
print('\\n' + '=' * 60)
print('3️⃣  频繁 3-项集 (k=3)')
print('=' * 60)
freq_3 = {}
if len(freq_items_1) >= 3:
    for trio in combinations(sorted(freq_items_1), 3):
        # Apriori 剪枝：先检查该 3-项集的所有 2-项子集是否都频繁
        all_subsets_frequent = True
        for pair in combinations(trio, 2):
            if tuple(sorted(pair)) not in freq_2:
                all_subsets_frequent = False
                break

        count, sup = get_support(trio)
        status = ''
        if not all_subsets_frequent:
            status = '🔪 (已剪枝：存在非频繁子集)'
        elif sup >= min_support:
            status = '✅'
            freq_3[tuple(sorted(trio))] = sup
        else:
            status = '❌ (低于阈值)'
        print(f'  {{{", ".join(trio)}}}: 支持度 = {sup:.4f} ({count}/{N})  {status}')
else:
    print('  频繁 1-项集不足 3 个，跳过 3-项集')

# ===== Step 4: 生成关联规则 & 计算置信度 =====
print('\\n' + '=' * 60)
print('📐 关联规则 (置信度 Confidence)')
print('=' * 60)
print('公式: Confidence(A → B) = Support(A ∪ B) / Support(A)')
print('解读: 在购买了 A 的交易中，同时购买 B 的概率')
print()

rules = []

# 从 2-项集生成 1→1 规则
for itemset, sup in freq_2.items():
    a, b = itemset
    conf_ab = sup / freq_1[(a,)]
    conf_ba = sup / freq_1[(b,)]
    rules.append((a, b, sup, conf_ab))
    rules.append((b, a, sup, conf_ba))
    print(f'  {{{a}}} → {{{b}}}: 支持度={sup:.4f}, 置信度={conf_ab:.4f} ({conf_ab:.2%}) {"✅" if conf_ab >= min_conf else "❌"}')
    print(f'  {{{b}}} → {{{a}}}: 支持度={sup:.4f}, 置信度={conf_ba:.4f} ({conf_ba:.2%}) {"✅" if conf_ba >= min_conf else "❌"}')

# 从 3-项集生成 2→1 规则
for itemset, sup in freq_3.items():
    for i in range(len(itemset)):
        a = tuple(sorted([itemset[j] for j in range(len(itemset)) if j != i]))
        b = itemset[i]
        sup_a = freq_2.get(a, freq_1.get(a, 0))
        if sup_a > 0:
            conf = sup / sup_a
            rules.append((a, b, sup, conf))
            a_str = ', '.join(a) if isinstance(a, tuple) else a
            flag = '✅' if conf >= min_conf else '❌'
            print(f'  {{{a_str}}} → {{{b}}}: 支持度={sup:.4f}, 置信度={conf:.4f} ({conf:.2%}) {flag}')

# 筛选强规则（置信度 ≥ min_conf）
print('\\n' + '=' * 60)
print('💎 强关联规则 (置信度 >= {:.0%})'.format(min_conf))
print('=' * 60)
strong_rules = [r for r in rules if r[3] >= min_conf]
strong_rules.sort(key=lambda x: x[3], reverse=True)

if strong_rules:
    for idx, (a, b, sup, conf) in enumerate(strong_rules, 1):
        a_str = ', '.join(a) if isinstance(a, tuple) else a
        print(f'  {idx}. {{{a_str}}} → {{{b}}}: 置信度 = {conf:.2%}, 支持度 = {sup:.4f}')
else:
    print('  没有满足条件的强规则')

print('\\n✅ Apriori 算法运行完成！')
`;

const step3Placeholder = `# Step 3 挑战练习：结果分析与商业建议
# 任务：
# 1. 基于 Step 2 的频繁项集，计算每条强规则的提升度 (Lift)
#    公式: Lift(A → B) = Confidence(A → B) / Support(B)
#          = Support(A ∪ B) / (Support(A) * Support(B))
# 2. 解读：Lift > 1 表示正相关（A 的出现提升了 B 的购买概率）
#          Lift = 1 表示独立
#          Lift < 1 表示负相关
# 3. 根据计算结果提出货架摆放、交叉销售、捆绑定价等商业建议

# 提示：结合 step2 的结果，给出 3-5 条具体建议

`;

const step3Answer = `# Step 3 参考答案：结果分析与商业建议
from itertools import combinations

csv_data = """${shoppingBasketCSV}"""

# 解析交易数据
transactions = []
for line in csv_data.strip().split('\\n'):
    items = sorted([item.strip() for item in line.split(',') if item.strip()])
    if items:
        transactions.append(items)

N = len(transactions)
min_support = 0.3
min_conf = 0.5
min_lift = 1.0

# 获取所有唯一商品及支持度
all_items = sorted(set(item for t in transactions for item in t))
item_support = {}
for item in all_items:
    count = sum(1 for t in transactions if item in t)
    item_support[item] = count / N

# 计算项集支持度
def get_support(itemset):
    itemset = set(itemset)
    count = sum(1 for t in transactions if itemset.issubset(set(t)))
    return count / N

# ===== 先重新生成所有规则 =====
print('=' * 70)
print('🎯 Step 3：结果综合分析与商业建议')
print('=' * 70)

# 1-项集
freq_1 = {}
for item in all_items:
    sup = get_support([item])
    if sup >= min_support:
        freq_1[(item,)] = sup

freq_items_1 = [k[0] for k in freq_1.keys()]

# 2-项集
freq_2 = {}
for pair in combinations(sorted(freq_items_1), 2):
    sup = get_support(pair)
    if sup >= min_support:
        freq_2[tuple(sorted(pair))] = sup

# 3-项集
freq_3 = {}
for trio in combinations(sorted(freq_items_1), 3):
    all_subsets_frequent = all(tuple(sorted(p)) in freq_2 for p in combinations(trio, 2))
    sup = get_support(trio)
    if all_subsets_frequent and sup >= min_support:
        freq_3[tuple(sorted(trio))] = sup

print(f'\\n📊 统计摘要:')
print(f'  总交易笔数: {N}')
print(f'  商品种类: {len(all_items)} ({", ".join(all_items)})')
print(f'  频繁 1-项集数量: {len(freq_1)}')
print(f'  频繁 2-项集数量: {len(freq_2)}')
print(f'  频繁 3-项集数量: {len(freq_3)}')

# ===== 完整规则分析 =====
print('\\n' + '=' * 70)
print('📐 完整关联规则分析 (支持度 + 置信度 + 提升度)')
print('=' * 70)
print('''
核心指标解读：
  • 支持度(Support)  = P(A ∪ B)  —— 规则在全部交易中的出现概率（普遍性）
  • 置信度(Confidence) = P(B|A)    —— 买 A 的人中有多少也买了 B（规则可靠性）
  • 提升度(Lift)      = P(B|A)/P(B) —— A 的出现对 B 购买概率的提升倍数
      Lift > 1  → 正相关，A 促进 B 购买  ✅
      Lift = 1  → 独立，A 与 B 无关联     ⚪
      Lift < 1  → 负相关，A 抑制 B 购买  ❌
''')

# 收集所有规则
all_rules = []

# 1→1 规则
for itemset, sup in freq_2.items():
    a, b = itemset
    conf_ab = sup / freq_1[(a,)]
    conf_ba = sup / freq_1[(b,)]
    lift_ab = conf_ab / item_support[b]
    lift_ba = conf_ba / item_support[a]
    all_rules.append({
        'antecedent': (a,), 'consequent': (b,),
        'support': sup, 'confidence': conf_ab, 'lift': lift_ab
    })
    all_rules.append({
        'antecedent': (b,), 'consequent': (a,),
        'support': sup, 'confidence': conf_ba, 'lift': lift_ba
    })

# 2→1 规则
for itemset, sup in freq_3.items():
    for i in range(len(itemset)):
        ante = tuple(sorted([itemset[j] for j in range(len(itemset)) if j != i]))
        conse = (itemset[i],)
        sup_ante = freq_2.get(ante, freq_1.get(ante, 0))
        if sup_ante > 0:
            conf = sup / sup_ante
            sup_conse = item_support[conse[0]]
            lift = conf / sup_conse
            all_rules.append({
                'antecedent': ante, 'consequent': conse,
                'support': sup, 'confidence': conf, 'lift': lift
            })

# 排序：优先提升度高、置信度高的规则
all_rules.sort(key=lambda r: (-r['lift'], -r['confidence']))

# 表格输出
print(f'{"规则":<30}{"支持度":<10}{"置信度":<10}{"提升度":<10}{"评级"}')
print('-' * 75)

for r in all_rules:
    a_str = ', '.join(r['antecedent'])
    c_str = ', '.join(r['consequent'])
    rule_str = f'{{{a_str}}} → {{{c_str}}}'
    lift = r['lift']
    rating = '⭐⭐⭐ 强正相关' if lift >= 1.5 else ('⭐⭐ 正相关' if lift >= 1.1 else ('⭐ 弱相关' if lift >= 1.0 else '❌ 负相关'))
    print(f'{rule_str:<30}{r["support"]:<10.4f}{r["confidence"]:<10.4f}{lift:<10.4f}{rating}')

# ===== 商业建议 =====
print('\\n' + '=' * 70)
print('💡 商业建议与营销策略')
print('=' * 70)

# 筛选有价值的规则（提升度 > 1.2，置信度 > 0.5）
valuable_rules = [r for r in all_rules if r['lift'] > 1.2 and r['confidence'] > 0.5]
valuable_rules.sort(key=lambda r: -r['lift'])

if not valuable_rules:
    valuable_rules = all_rules[:5]

print('\\n🏪 建议 1：货架布局优化（关联陈列）')
print('基于提升度最高的规则，将关联商品相邻摆放：')
for r in valuable_rules[:3]:
    a = ', '.join(r['antecedent'])
    c = ', '.join(r['consequent'])
    print(f'  → 将「{a}」与「{c}」相邻摆放 (提升度 {r["lift"]:.2f}x, 置信度 {r["confidence"]:.0%})')

print('\\n💰 建议 2：交叉销售与捆绑销售')
print('对置信度高的规则，可做组合套餐：')
high_conf = sorted([r for r in all_rules if r['confidence'] > 0.6], key=lambda r: -r['confidence'])[:3]
for r in high_conf:
    a = ', '.join(r['antecedent'])
    c = ', '.join(r['consequent'])
    print(f'  → 「{a} + {c}」捆绑包 (置信度 {r["confidence"]:.0%}, 支持度 {r["support"]:.2%})')
    print(f'     购买 {a} 的顾客中有 {r["confidence"]:.0%} 同时购买 {c}，适合做推荐搭配')

print('\\n🎯 建议 3：精准营销与推荐系统')
print('对支持度高但未同时购买的顾客，定向推送：')
high_sup = sorted(freq_2.items(), key=lambda x: -x[1])[:3]
for itemset, sup in high_sup:
    print(f'  → {itemset[0]} 购买者推送 {itemset[1]} 的优惠券 (支持度 {sup:.2%})')
    print(f'  → {itemset[1]} 购买者推送 {itemset[0]} 的优惠券 (提升度 {next((r["lift"] for r in all_rules if set(r["antecedent"]) == {itemset[0]} and r["consequent"] == (itemset[1],)), 1.0):.2f}x)')

print('\\n📈 建议 4：库存管理与补货策略')
print('高频商品与关联商品联动补货：')
top_items = sorted(item_support.items(), key=lambda x: -x[1])[:3]
for item, sup in top_items:
    # 找与该商品关联最高的其它商品
    related = [(r, r['lift']) for r in all_rules if r['antecedent'] == (item,) or r['consequent'] == (item,)]
    related.sort(key=lambda x: -x[1])
    if related:
        best_r = related[0][0]
        other = best_r['consequent'][0] if best_r['antecedent'] == (item,) else best_r['antecedent'][0]
        print(f'  → 「{item}」(支持度 {sup:.2%}) 与「{other}」联动补货')

print('\\n⚠️ 建议 5：避免的陷阱')
print('  • 仅看支持度不够：高支持度但低提升度的规则是「伪关联」')
print('  • 仅看置信度不够：高置信度但低支持度的规则样本太少')
print('  • 三项指标需综合评估：高支持度 + 高置信度 + 高提升度才是真黄金规则')

# ===== 黄金规则 =====
print('\\n' + '=' * 70)
print('🏆 黄金规则（综合三项指标 Top 3）')
print('=' * 70)
# 综合评分：support * confidence * lift
scored = [(r, r['support'] * r['confidence'] * r['lift']) for r in all_rules if r['lift'] >= 1.0]
scored.sort(key=lambda x: -x[1])
for r, _ in scored[:3]:
    a = ', '.join(r['antecedent'])
    c = ', '.join(r['consequent'])
    print(f'  🥇 {{{a}}} → {{{c}}}: 支持度={r["support"]:.2%}, 置信度={r["confidence"]:.0%}, 提升度={r["lift"]:.2f}x')

print('\\n✅ 数据分析与商业策略生成完成！')
`;

const DataMining: React.FC = () => {
  const [pyodideState, setPyodideState] = useState<{
    status: 'loading' | 'ready' | 'error';
    stage: PyodideStage;
    percent: number;
    error: string | null;
    elapsedSeconds: number;
  }>({
    status: 'loading',
    stage: 0,
    percent: 0,
    error: null,
    elapsedSeconds: 0,
  });

  const [activeStep, setActiveStep] = useState(0);

  const [step1, setStep1] = useState<StepState>({
    code: step1Placeholder,
    output: '',
    error: '',
    isLoading: false,
    showAnswer: false,
  });

  const [step2, setStep2] = useState<StepState>({
    code: step2Placeholder,
    output: '',
    error: '',
    isLoading: false,
    showAnswer: false,
  });

  const [step3, setStep3] = useState<StepState>({
    code: step3Placeholder,
    output: '',
    error: '',
    isLoading: false,
    showAnswer: false,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    let startTime = Date.now();

    const onProgress = (p: PyodideProgress) => {
      setPyodideState((prev) => ({
        ...prev,
        stage: p.stage,
        percent: p.percent,
        elapsedSeconds: Math.floor((Date.now() - startTime) / 1000),
      }));
    };

    if (isPyodideReady()) {
      setPyodideState({ status: 'ready', stage: 4, percent: 100, error: null, elapsedSeconds: 0 });
      return;
    }

    timer = setInterval(() => {
      setPyodideState((prev) => ({
        ...prev,
        elapsedSeconds: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    initPyodide(onProgress)
      .then(() => {
        setPyodideState({ status: 'ready', stage: 4, percent: 100, error: null, elapsedSeconds: 0 });
      })
      .catch((err: Error) => {
        setPyodideState({
          status: 'error',
          stage: 0,
          percent: 0,
          error: err.message,
          elapsedSeconds: Math.floor((Date.now() - startTime) / 1000),
        });
      });

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const runStep = async (step: number) => {
    const setState = step === 1 ? setStep1 : step === 2 ? setStep2 : setStep3;
    const state = step === 1 ? step1 : step === 2 ? step2 : step3;

    if (!state.code.trim()) {
      setState((prev) => ({ ...prev, output: '', error: '请输入代码后再运行' }));
      return;
    }

    if (pyodideState.status !== 'ready') {
      setState((prev) => ({ ...prev, output: '', error: 'Python 环境正在初始化，请稍候...' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, output: '', error: '' }));

    try {
      const executionResult = await runPythonCode(state.code);
      if (executionResult.success) {
        setState((prev) => ({ ...prev, isLoading: false, output: executionResult.output || '代码执行完成（无输出）', error: '' }));
      } else {
        const errMsg =
          (executionResult.error?.type || '执行错误') +
          ': ' +
          (executionResult.error?.message || '未知错误') +
          (executionResult.error?.lineNumber ? ` (第 ${executionResult.error.lineNumber} 行)` : '') +
          (executionResult.stdout ? `\n\n标准输出:\n${executionResult.stdout}` : '') +
          (executionResult.stderr ? `\n\n标准错误:\n${executionResult.stderr}` : '');
        setState((prev) => ({ ...prev, isLoading: false, output: executionResult.stdout, error: errMsg }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        output: '',
        error: '执行出错: ' + (err instanceof Error ? err.message : String(err)),
      }));
    }
  };

  const resetStep = (step: number) => {
    const setState = step === 1 ? setStep1 : step === 2 ? setStep2 : setStep3;
    const placeholder = step === 1 ? step1Placeholder : step === 2 ? step2Placeholder : step3Placeholder;
    setState({ code: placeholder, output: '', error: '', isLoading: false, showAnswer: false });
  };

  const showAnswer = (step: number) => {
    const setState = step === 1 ? setStep1 : step === 2 ? setStep2 : setStep3;
    const answer = step === 1 ? step1Answer : step === 2 ? step2Answer : step3Answer;
    setState((prev) => ({ ...prev, code: answer, showAnswer: true, output: '', error: '' }));
  };

  const renderStepEditor = (stepIndex: number, state: StepState, title: string, description: string) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
      <div className="flex items-start mb-6">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {stepIndex}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>

      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <AceEditor
          mode="python"
          theme="monokai"
          value={state.code}
          onChange={(newCode) => {
            if (stepIndex === 1) setStep1((prev) => ({ ...prev, code: newCode, output: '', error: '' }));
            if (stepIndex === 2) setStep2((prev) => ({ ...prev, code: newCode, output: '', error: '' }));
            if (stepIndex === 3) setStep3((prev) => ({ ...prev, code: newCode, output: '', error: '' }));
          }}
          name={`data-mining-editor-${stepIndex}`}
          editorProps={{ $blockScrolling: true }}
          className="w-full"
          style={{ height: '420px', width: '100%', fontSize: '13px' }}
          setOptions={{
            showPrintMargin: false,
            tabSize: 4,
            useSoftTabs: false,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => runStep(stepIndex)}
          disabled={state.isLoading || pyodideState.status !== 'ready'}
          className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
        >
          {state.isLoading ? (
            <span className="flex items-center">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              运行中...
            </span>
          ) : (
            '▶ 运行代码'
          )}
        </button>
        <button
          onClick={() => showAnswer(stepIndex)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
        >
          💡 显示参考答案
        </button>
        <button
          onClick={() => resetStep(stepIndex)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
        >
          🔄 重置
        </button>
      </div>

      {state.error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 mb-4 whitespace-pre-wrap font-mono text-sm">
          {state.error}
        </div>
      )}

      {state.output && (
        <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
          {state.output}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero 区域 */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-20 -translate-x-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="text-8xl md:text-9xl mb-6 md:mb-0 md:mr-8 animate-bounce-slow">⛏️</div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">数据挖掘实战</h1>
              <p className="text-lg md:text-xl text-emerald-100 leading-relaxed max-w-2xl">
                从购物篮数据中挖掘隐藏的关联关系，掌握 Apriori 算法思想，
                理解<strong className="text-white"> 支持度、置信度、提升度 </strong>三大核心指标，
                并将分析结果转化为可落地的商业决策建议。
              </p>
            </div>
          </div>
        </div>

        {/* Pyodide 加载状态 */}
        {pyodideState.status === 'loading' && (
          <div className="mb-8">
            <PyodideLoader
              stage={pyodideState.stage}
              percent={pyodideState.percent}
              error={null}
              elapsedSeconds={pyodideState.elapsedSeconds}
            />
          </div>
        )}

        {pyodideState.status === 'error' && (
          <div className="mb-8">
            <PyodideLoader stage={0} percent={0} error={pyodideState.error} />
          </div>
        )}

        {/* 核心概念板块 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-3">📚</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">核心概念</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">🔍</div>
                <h3 className="text-xl font-bold text-emerald-800">什么是数据挖掘？</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                数据挖掘 (Data Mining) 是从<strong>海量、不完全、有噪声、模糊、随机</strong>的实际数据中，
                提取隐含在其中的、人们事先不知道的、但又是<strong>潜在有用</strong>的信息和知识的过程。
              </p>
              <div className="mt-4 bg-white rounded-lg p-3 border border-emerald-200">
                <p className="text-xs text-emerald-700 font-medium mb-2">常见应用场景:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 🏪 超市购物篮分析 — 发现商品购买关联</li>
                  <li>• 📱 推荐系统 — 个性化商品 / 内容推荐</li>
                  <li>• 🏦 风险控制 — 异常交易 / 欺诈检测</li>
                  <li>• 👥 客户分群 — RFM 模型、聚类分析</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6 border border-cyan-100">
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">🔗</div>
                <h3 className="text-xl font-bold text-cyan-800">关联规则 (Association Rules)</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                关联规则挖掘用于发现数据项之间的<strong>有趣关系</strong>。
                经典案例：「啤酒与尿布」—— 美国沃尔玛发现购买尿布的顾客常同时购买啤酒。
              </p>
              <div className="mt-4 bg-white rounded-lg p-3 border border-cyan-200">
                <p className="text-xs text-cyan-700 font-medium mb-2">规则表示形式:</p>
                <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm text-center">
                  A → B &nbsp;&nbsp;<span className="text-gray-400">(前件 → 后件)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  解读：购买了 A 的顾客，很可能也会购买 B
                </p>
              </div>
            </div>
          </div>

          {/* 三大指标 */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📐</span>
              三大核心指标
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">📊</div>
                <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Support
                </div>
              </div>
              <h4 className="text-lg font-bold text-yellow-800 mb-2">支持度</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 mb-3 text-center">
                P(A ∪ B) = count(A,B) / N
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                项集 A 和 B 在<strong>所有交易</strong>中出现的概率。衡量规则的<strong>普遍性</strong>——
                支持度太低的规则是偶然现象，不具有商业价值。
              </p>
              <p className="text-xs text-yellow-700 mt-3 italic">
                📝 例：100 笔交易中有 10 笔同时买了 A 和 B，支持度 = 10%
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">🎯</div>
                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Confidence
                </div>
              </div>
              <h4 className="text-lg font-bold text-orange-800 mb-2">置信度</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 mb-3 text-center">
                P(B|A) = Support(A,B) / Support(A)
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                在<strong>已购买 A</strong> 的交易中，同时购买 B 的概率。
                衡量规则的<strong>可靠性</strong>——置信度越高，规则越可信。
              </p>
              <p className="text-xs text-orange-700 mt-3 italic">
                📝 例：买 A 的 20 人中 10 人也买了 B，置信度 = 50%
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">🚀</div>
                <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Lift
                </div>
              </div>
              <h4 className="text-lg font-bold text-purple-800 mb-2">提升度</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 mb-3 text-center">
                Confidence(A→B) / P(B)
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                A 的出现对 B 购买概率的<strong>提升倍数</strong>。衡量规则的<strong>价值</strong>——
                Lift {'>'} 1 才是真正有用的正相关规则。
              </p>
              <p className="text-xs text-purple-700 mt-3 italic">
                📝 例：Lift = 2.5 表示买 A 的顾客买 B 的概率是普通顾客的 2.5 倍
              </p>
            </div>
          </div>

          {/* 指标组合解读 */}
          <div className="mt-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
            <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🎯</span>如何综合评估一条规则？
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-medium text-gray-700 mb-1">📊 高支持度 + 低置信度</div>
                <div className="text-xs text-gray-600">商品组合常见，但关联性弱——可能只是两个热销商品的偶然同时出现</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-medium text-gray-700 mb-1">🎯 低支持度 + 高置信度</div>
                <div className="text-xs text-gray-600">规则可信但样本太少——小众商品组合，商业价值有限</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-medium text-gray-700 mb-1">🏆 三高 = 黄金规则</div>
                <div className="text-xs text-gray-600">高支持度 + 高置信度 + 高提升度——真正值得采取行动的规则</div>
              </div>
            </div>
          </div>
        </div>

        {/* 步骤导航 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">💻</span>三步渐进实战练习
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            {[
              { idx: 1, title: '数据探索', desc: '解析购物篮 & 商品频率 Top 10', color: 'emerald' },
              { idx: 2, title: 'Apriori 算法', desc: '手动实现频繁项集与关联规则', color: 'cyan' },
              { idx: 3, title: '结果分析', desc: '计算提升度 & 提出商业建议', color: 'purple' },
            ].map((s) => (
              <button
                key={s.idx}
                onClick={() => setActiveStep(s.idx - 1)}
                className={`text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                  activeStep === s.idx - 1
                    ? 'bg-gradient-to-br from-primary to-secondary text-white border-primary shadow-lg transform scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 border-transparent text-gray-700'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                      activeStep === s.idx - 1 ? 'bg-white text-primary' : 'bg-primary text-white'
                    }`}
                  >
                    {s.idx}
                  </div>
                  <span className="font-bold">{s.title}</span>
                </div>
                <div className={`text-sm ${activeStep === s.idx - 1 ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        <div className={`mb-8 ${activeStep === 0 ? 'block' : 'hidden md:block'}`}>
          {renderStepEditor(
            1,
            step1,
            'Step 1 · 基础：探索购物篮数据',
            '解析 CSV 格式的交易数据，理解数据结构，统计每个商品的出现频率并输出 Top 10。'
          )}
        </div>

        {/* Step 2 */}
        <div className={`mb-8 ${activeStep === 1 ? 'block' : 'hidden md:block'}`}>
          {renderStepEditor(
            2,
            step2,
            'Step 2 · 进阶：Apriori 算法与关联规则',
            '手动实现 Apriori 算法思想：从 1-项集、2-项集到 3-项集逐层计算支持度，基于频繁项集生成关联规则并计算置信度。'
          )}
        </div>

        {/* Step 3 */}
        <div className={`mb-8 ${activeStep === 2 ? 'block' : 'hidden md:block'}`}>
          {renderStepEditor(
            3,
            step3,
            'Step 3 · 挑战：结果分析与商业建议',
            '计算每条关联规则的提升度 (Lift)，综合评估规则价值，并提出货架布局、交叉销售、捆绑定价、精准推荐等商业策略建议。'
          )}
        </div>

        {/* 学习总结 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-3">🎓</div>
            <h2 className="text-2xl font-bold text-gray-800">你学到了什么？</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="font-bold text-emerald-800 mb-1">数据预处理能力</div>
                <p className="text-sm text-gray-600">解析 CSV、清洗数据、汇总统计、频率排序</p>
              </div>
            </div>
            <div className="flex items-start bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-4 border border-cyan-100">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="font-bold text-cyan-800 mb-1">Apriori 算法思想</div>
                <p className="text-sm text-gray-600">逐层搜索、频繁项集剪枝、关联规则生成</p>
              </div>
            </div>
            <div className="flex items-start bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="font-bold text-purple-800 mb-1">三大指标综合运用</div>
                <p className="text-sm text-gray-600">支持度、置信度、提升度的计算与解读</p>
              </div>
            </div>
            <div className="flex items-start bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="font-bold text-orange-800 mb-1">数据驱动商业决策</div>
                <p className="text-sm text-gray-600">货架布局、交叉销售、捆绑定价、精准推荐</p>
              </div>
            </div>
          </div>
        </div>

        {/* 课程完成 */}
        <CourseCompletion
          courseId="data-mining"
          courseTitle="数据挖掘"
          badgeIcon="⛏️"
          badgeName="数据挖掘探索者"
        />
      </div>
    </div>
  );
};

export default DataMining;
