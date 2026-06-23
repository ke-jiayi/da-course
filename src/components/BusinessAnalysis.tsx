import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

interface StepState {
  code: string;
  output: { success: boolean; stdout: string; stderr: string; output?: string; error?: { type: string; message: string; lineNumber?: number } } | null;
  showAnswer: boolean;
  isLoading: boolean;
}

const BusinessAnalysis: React.FC = () => {
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pyodideProgress, setPyodideProgress] = useState<{ stage: number; percent: number }>({ stage: 0, percent: 0 });
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const initialCodeStep1 = `# Step 1: 基础统计 - 读取 A/B 测试数据
# 我们将分析控制组(Group A) vs 实验组(Group B)的关键指标

data_csv = """group,users,conversions,revenue
Control,10000,520,125000
Treatment,10000,610,148500
"""

print("=" * 50)
print("A/B 测试数据分析")
print("=" * 50)

# TODO: 解析 CSV 数据
# 提示: 使用 split('\\n') 分割行，使用 split(',') 分割列
lines = data_csv.strip().split('\\n')
headers = lines[0].split(',')
rows = []

# 在这里编写代码：


# TODO: 计算基础指标
print("\\n基础统计对比:")
print("-" * 50)

# 在这里编写代码：


# TODO: 对比分析
print("\\n" + "=" * 50)
print("提升效果 (实验组 vs 控制组)")
print("=" * 50)

# 在这里编写代码：

`;

const answerCodeStep1 = `# Step 1: 基础统计 - 读取 A/B 测试数据
# 参考答案

data_csv = """group,users,conversions,revenue
Control,10000,520,125000
Treatment,10000,610,148500
"""

print("=" * 50)
print("A/B 测试数据分析")
print("=" * 50)

# 解析 CSV 数据
lines = data_csv.strip().split('\\n')
headers = lines[0].split(',')
rows = []
for line in lines[1:]:
    values = line.split(',')
    row = {}
    for i, h in enumerate(headers):
        row[h] = values[i]
    rows.append(row)

# 计算基础指标
print("\\n基础统计对比:")
print("-" * 50)

for row in rows:
    users = int(row['users'])
    conversions = int(row['conversions'])
    revenue = float(row['revenue'])
    cr = conversions / users * 100
    aov = revenue / conversions if conversions > 0 else 0
    arpu = revenue / users

    print(f"\\n【{row['group']}组】")
    print(f"  总用户数:      {users:,}")
    print(f"  转化用户数:    {conversions:,}")
    print(f"  总收入:       ¥{revenue:,.0f}")
    print(f"  转化率 (CR):   {cr:.2f}%")
    print(f"  平均客单价 (AOV): ¥{aov:.2f}")
    print(f"  每用户收入 (ARPU): ¥{arpu:.2f}")

# 对比分析
control = rows[0]
treatment = rows[1]

control_cr = int(control['conversions']) / int(control['users'])
treatment_cr = int(treatment['conversions']) / int(treatment['users'])
cr_lift = (treatment_cr - control_cr) / control_cr * 100

control_rev = float(control['revenue']) / int(control['users'])
treatment_rev = float(treatment['revenue']) / int(treatment['users'])
rev_lift = (treatment_rev - control_rev) / control_rev * 100

print("\\n" + "=" * 50)
print("提升效果 (实验组 vs 控制组)")
print("=" * 50)
print(f"  转化率提升: {cr_lift:+.2f}%")
print(f"  每用户收入提升: {rev_lift:+.2f}%")

if cr_lift > 0:
    print(f"\\n实验组转化率表现更优")
else:
    print(f"\\n实验组转化率未优于控制组")
`;

const initialCodeStep2 = `# Step 2: 统计显著性检验 - z-test 和 p-value
# 验证转化率提升是否是统计显著的（非偶然）

import math

print("=" * 60)
print("统计显著性检验 (Z-test for Conversion Rates)")
print("=" * 60)

# A/B 测试数据
n_control = 10000     # 控制组样本量
conv_control = 520    # 控制组转化数
n_treatment = 10000   # 实验组样本量
conv_treatment = 610  # 实验组转化数

# TODO: 计算转化率
p_control = None
p_treatment = None

print(f"\\n输入参数:")
print(f"  控制组: {conv_control}/{n_control}")
print(f"  实验组: {conv_treatment}/{n_treatment}")

# TODO: 计算联合转化率（pooled proportion）
p_pooled = None

# TODO: 计算标准误差
se = None

# TODO: 计算 Z 统计量
z_score = None

print(f"\\n计算过程:")
print(f"  联合转化率: {p_pooled}")
print(f"  标准误差: {se}")
print(f"  Z 统计量: {z_score}")

# TODO: 判断结论
alpha = 0.05

print(f"\\n{'=' * 60}")
print("结论")
print(f"{'=' * 60}")

# 在这里编写代码判断统计显著性：

`;

const answerCodeStep2 = `# Step 2: 统计显著性检验 - z-test 和 p-value
# 参考答案

import math

print("=" * 60)
print("统计显著性检验 (Z-test for Conversion Rates)")
print("=" * 60)

# A/B 测试数据
n_control = 10000     # 控制组样本量
conv_control = 520    # 控制组转化数
n_treatment = 10000   # 实验组样本量
conv_treatment = 610  # 实验组转化数

# 计算转化率
p_control = conv_control / n_control
p_treatment = conv_treatment / n_treatment

print(f"\\n输入参数:")
print(f"  控制组: {conv_control}/{n_control} = {p_control:.4%}")
print(f"  实验组: {conv_treatment}/{n_treatment} = {p_treatment:.4%}")
print(f"  绝对差异: {(p_treatment - p_control):.4%}")
print(f"  相对提升: {((p_treatment - p_control) / p_control * 100):+.2f}%")

# 计算联合转化率（pooled proportion）
p_pooled = (conv_control + conv_treatment) / (n_control + n_treatment)

# 标准误差（Standard Error）
se = math.sqrt(p_pooled * (1 - p_pooled) * (1/n_control + 1/n_treatment))

# Z 统计量
z_score = (p_treatment - p_control) / se

print(f"\\n计算过程:")
print(f"  联合转化率 (p_pooled): {p_pooled:.6f}")
print(f"  标准误差 (SE):         {se:.6f}")
print(f"  Z 统计量:              {z_score:.4f}")

# 手动计算 p-value（使用正态分布近似）
def erf_approx(x):
    a1 =  0.254829592
    a2 = -0.284496736
    a3 =  1.421413741
    a4 = -1.453152027
    a5 =  1.061405429
    p  =  0.3275911
    sign = 1 if x >= 0 else -1
    x = abs(x)
    t = 1.0 / (1.0 + p * x)
    y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * math.exp(-x * x)
    return sign * y

def normal_cdf(z):
    return 0.5 * (1 + erf_approx(z / math.sqrt(2)))

# 双尾检验 p-value
p_value = 2 * (1 - normal_cdf(abs(z_score)))

print(f"\\n检验结果:")
print(f"  p-value: {p_value:.6f}")
print(f"  显著性水平 (α): 0.05")

# 判断结论
print(f"\\n{'=' * 60}")
print("结论")
print(f"{'=' * 60}")

alpha = 0.05
if p_value < alpha:
    print(f"  p-value ({p_value:.6f}) < α ({alpha})")
    print(f"  → 拒绝原假设 (H0)")
    print(f"  → 两组转化率差异具有统计显著性")
    print(f"  → 实验方案确实有效！")
else:
    print(f"  p-value ({p_value:.6f}) >= α ({alpha})")
    print(f"  → 无法拒绝原假设")
    print(f"  → 差异可能是随机波动")
    print(f"  → 需要更大样本量来验证")

# 置信区间（95%）
ci_margin = 1.96 * se
diff = p_treatment - p_control
ci_lower = diff - ci_margin
ci_upper = diff + ci_margin

print(f"\\n95% 置信区间 (差异):")
print(f"  [{ci_lower:.4%}, {ci_upper:.4%}]")
print(f"  区间不包含 0 → 差异显著" if ci_lower > 0 else "  区间包含 0 → 差异不显著")
`;

const initialCodeStep3 = `# Step 3: 综合业务决策分析
# 结合转化率、收益、置信区间和商业因素进行综合决策

import math

print("=" * 60)
print("数据驱动的业务决策分析")
print("=" * 60)

# 实验数据
data = [
    {"group": "控制组 (旧算法)", "users": 10000, "conversions": 520, "revenue": 125000},
    {"group": "实验组 (新算法)", "users": 10000, "conversions": 610, "revenue": 148500}
]

print("\\n实验概览:")
print("-" * 60)

# TODO: 计算关键指标
metrics = []

# 在这里编写代码计算转化率、客单价、ARPU：


# TODO: 计算指标提升


# TODO: 统计检验


# TODO: 业务影响评估


# TODO: 综合决策报告


print(f"\\n{'=' * 60}")
print("最终建议")
print(f"{'=' * 60}")
# 根据分析给出建议

`;

const answerCodeStep3 = `# Step 3: 综合业务决策分析
# 参考答案

import math

print("=" * 60)
print("数据驱动的业务决策分析")
print("=" * 60)

# 实验数据
data = [
    {"group": "控制组 (旧算法)", "users": 10000, "conversions": 520, "revenue": 125000},
    {"group": "实验组 (新算法)", "users": 10000, "conversions": 610, "revenue": 148500}
]

print("\\n实验概览:")
print("-" * 60)

# 计算关键指标
metrics = []
for d in data:
    cr = d['conversions'] / d['users'] * 100
    aov = d['revenue'] / d['conversions'] if d['conversions'] > 0 else 0
    arpu = d['revenue'] / d['users']
    metrics.append({"cr": cr, "aov": aov, "arpu": arpu, **d})
    print(f"\\n  {d['group']}:")
    print(f"    转化率 CR:    {cr:.2f}%")
    print(f"    平均客单价:   ¥{aov:.2f}")
    print(f"    每用户收入:   ¥{arpu:.2f}")

# 指标提升
ctrl = metrics[0]
treat = metrics[1]

cr_lift = (treat['cr'] - ctrl['cr']) / ctrl['cr'] * 100
aov_lift = (treat['aov'] - ctrl['aov']) / ctrl['aov'] * 100
arpu_lift = (treat['arpu'] - ctrl['arpu']) / ctrl['arpu'] * 100

print(f"\\n相对提升:")
print(f"  转化率: {cr_lift:+.2f}%")
print(f"  客单价: {aov_lift:+.2f}%")
print(f"  ARPU:   {arpu_lift:+.2f}%")

# 统计检验
print(f"\\n{'=' * 60}")
print("统计检验")
print(f"{'=' * 60}")

p_ctrl = ctrl['conversions'] / ctrl['users']
p_treat = treat['conversions'] / treat['users']
n_ctrl = ctrl['users']
n_treat = treat['users']

p_pooled = (ctrl['conversions'] + treat['conversions']) / (n_ctrl + n_treat)
se = math.sqrt(p_pooled * (1 - p_pooled) * (1/n_ctrl + 1/n_treat))
z = (p_treat - p_ctrl) / se

def erf_approx(x):
    a1, a2, a3, a4, a5 = 0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429
    p = 0.3275911
    sign = 1 if x >= 0 else -1
    x = abs(x)
    t = 1.0 / (1.0 + p * x)
    y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * math.exp(-x * x)
    return sign * y

def normal_cdf(z):
    return 0.5 * (1 + erf_approx(z / math.sqrt(2)))

p_value = 2 * (1 - normal_cdf(abs(z)))

# 置信区间
ci_diff = p_treat - p_ctrl
ci_low = (ci_diff - 1.96 * se) * 100
ci_high = (ci_diff + 1.96 * se) * 100

print(f"  Z统计量: {z:.4f}")
print(f"  p-value: {p_value:.6f}")
print(f"  95% CI:  [{ci_low:.2f}%, {ci_high:.2f}%]")

# 业务影响评估
print(f"\\n{'=' * 60}")
print("业务影响评估 (假设全量上线)")
print(f"{'=' * 60}")

monthly_visitors = 500000
arpu_diff = treat['arpu'] - ctrl['arpu']
additional_revenue_monthly = arpu_diff * monthly_visitors
additional_revenue_yearly = additional_revenue_monthly * 12

print(f"\\n  假设月活用户数: {monthly_visitors:,}")
print(f"  ARPU 增量:       ¥{arpu_diff:.2f}/用户")
print(f"  月度增量收入:    ¥{additional_revenue_monthly:,.0f}")
print(f"  年度增量收入:    ¥{additional_revenue_yearly:,.0f}")

# 综合决策报告
print(f"\\n{'=' * 60}")
print("综合决策报告")
print(f"{'=' * 60}")

print("\\n【评估维度】")
print("-" * 40)

stat_sig = p_value < 0.05
print(f"\\n1. 统计显著性:")
print(f"   p-value = {p_value:.6f}")
print(f"   通过 (p < 0.05)" if stat_sig else "   未通过")

has_value = arpu_lift > 0
print(f"\\n2. 业务价值:")
print(f"   ARPU 提升: {arpu_lift:+.2f}%")
print(f"   年度增量收入预测: ¥{additional_revenue_yearly:,.0f}")
print(f"   具有正收益" if has_value else "   收益不明显")

ci_reliable = ci_low > 0
print(f"\\n3. 置信区间可靠性:")
print(f"   转化率差异 95% CI: [{ci_low:.2f}%, {ci_high:.2f}%]")
print(f"   区间下限 > 0, 可靠" if ci_reliable else "   区间包含 0, 需谨慎")

magnitude = "显著提升" if cr_lift > 10 else ("中等提升" if cr_lift > 5 else "小幅提升" if cr_lift > 0 else "无提升")
print(f"\\n4. 效果幅度: {magnitude} ({cr_lift:+.2f}%)")

# 最终建议
print(f"\\n{'=' * 60}")
print("最终建议")
print(f"{'=' * 60}")

if stat_sig and has_value and ci_reliable:
    recommendation = "建议全量上线新算法"
    reasons = [
        "1. 统计检验显示差异显著 (p < 0.05)",
        "2. 实验组在转化率和收入上均优于控制组",
        "3. 置信区间不包含零，结果可靠",
        "4. 预计年度可增加显著收入"
    ]
elif not stat_sig:
    recommendation = "建议暂缓上线，继续验证"
    reasons = [
        "1. 差异未达到统计显著性",
        "2. 当前效果可能来自随机波动",
        "3. 建议扩大样本量继续实验"
    ]
else:
    recommendation = "需要更多数据进行综合评估"
    reasons = ["建议收集更多维度数据后重新分析"]

print(f"\\n  {recommendation}")
print(f"\\n  理由:")
for r in reasons:
    print(f"  {r}")

print(f"\\n{'=' * 60}")
print("关键指标汇总")
print(f"{'=' * 60}")
print(f"  {'指标':<15} {'控制组':>12} {'实验组':>12} {'变化':>10}")
print("-" * 55)
print(f"  {'转化率':<15} {ctrl['cr']:>10.2f}% {treat['cr']:>10.2f}% {cr_lift:>+8.2f}%")
print(f"  {'平均客单价':<15} ¥{ctrl['aov']:>10.2f} ¥{treat['aov']:>10.2f} {aov_lift:>+8.2f}%")
print(f"  {'ARPU':<15} ¥{ctrl['arpu']:>10.2f} ¥{treat['arpu']:>10.2f} {arpu_lift:>+8.2f}%")
`;

  const [step1, setStep1] = useState<StepState>({ code: initialCodeStep1, output: null, showAnswer: false, isLoading: false });
  const [step2, setStep2] = useState<StepState>({ code: initialCodeStep2, output: null, showAnswer: false, isLoading: false });
  const [step3, setStep3] = useState<StepState>({ code: initialCodeStep3, output: null, showAnswer: false, isLoading: false });

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const checkPyodide = async () => {
      if (isPyodideReady()) {
        setPyodideStatus('ready');
        setPyodideProgress({ stage: 4, percent: 100 });
        clearInterval(timer);
        return;
      }

      try {
        await initPyodide((p: PyodideProgress) => {
          setPyodideProgress({ stage: p.stage, percent: p.percent });
        });
        setPyodideStatus('ready');
      } catch (error: any) {
        console.error('Pyodide 初始化失败:', error);
        setPyodideStatus('error');
        setPyodideError(error instanceof Error ? error.message : String(error));
      } finally {
        clearInterval(timer);
      }
    };

    checkPyodide();

    return () => clearInterval(timer);
  }, []);

  const handleRunCode = async (stepKey: 'step1' | 'step2' | 'step3') => {
    const setState = stepKey === 'step1' ? setStep1 : stepKey === 'step2' ? setStep2 : setStep3;
    const currentState = stepKey === 'step1' ? step1 : stepKey === 'step2' ? step2 : step3;

    setState({ ...currentState, isLoading: true, output: null });

    try {
      const result = await runPythonCode(currentState.code);
      setState({
        ...currentState,
        isLoading: false,
        output: {
          success: result.success,
          stdout: result.stdout,
          stderr: result.stderr,
          output: result.output,
          error: result.error ? { type: result.error.type, message: result.error.message, lineNumber: result.error.lineNumber } : undefined
        }
      });
    } catch (err: any) {
      setState({
        ...currentState,
        isLoading: false,
        output: {
          success: false,
          stdout: '',
          stderr: '',
          output: '',
          error: { type: 'ExecutionError', message: '执行出错: ' + (err as Error).message }
        }
      });
    }
  };

  const handleReset = (stepKey: 'step1' | 'step2' | 'step3') => {
    const initialCode = stepKey === 'step1' ? initialCodeStep1 : stepKey === 'step2' ? initialCodeStep2 : initialCodeStep3;
    if (stepKey === 'step1') setStep1({ code: initialCode, output: null, showAnswer: false, isLoading: false });
    if (stepKey === 'step2') setStep2({ code: initialCode, output: null, showAnswer: false, isLoading: false });
    if (stepKey === 'step3') setStep3({ code: initialCode, output: null, showAnswer: false, isLoading: false });
  };

  const handleShowAnswer = (stepKey: 'step1' | 'step2' | 'step3') => {
    const answerCode = stepKey === 'step1' ? answerCodeStep1 : stepKey === 'step2' ? answerCodeStep2 : answerCodeStep3;
    if (stepKey === 'step1') setStep1({ ...step1, code: answerCode, showAnswer: true });
    if (stepKey === 'step2') setStep2({ ...step2, code: answerCode, showAnswer: true });
    if (stepKey === 'step3') setStep3({ ...step3, code: answerCode, showAnswer: true });
  };

  const handleCodeChange = (stepKey: 'step1' | 'step2' | 'step3', newCode: string) => {
    if (stepKey === 'step1') setStep1({ ...step1, code: newCode, output: null });
    if (stepKey === 'step2') setStep2({ ...step2, code: newCode, output: null });
    if (stepKey === 'step3') setStep3({ ...step3, code: newCode, output: null });
  };

  const renderOutput = (state: StepState) => {
    if (state.isLoading) {
      return (
        <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-yellow-300 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-300 mr-3"></div>
          代码执行中，请稍候...
        </div>
      );
    }

    if (!state.output) {
      return (
        <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-gray-500 rounded-lg">
          ⌨️ 点击"▶ 运行代码"查看输出结果
        </div>
      );
    }

    if (!state.output.success && state.output.error) {
      return (
        <>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 mb-3">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h4 className="font-bold text-red-300 mb-1">{state.output.error.type}</h4>
                <p className="text-sm">{state.output.error.message}</p>
                {state.output.error.lineNumber && <p className="text-xs mt-2 text-red-300">📍 错误位置: 第 {state.output.error.lineNumber} 行</p>}
              </div>
            </div>
          </div>
          {state.output.stdout && (
            <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg">{state.output.stdout}</pre>
          )}
        </>
      );
    }

    return (
      <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg">
        {state.output.output || state.output.stdout || '代码执行完成（无输出）'}
      </pre>
    );
  };

  const renderCodeSection = (
    stepKey: 'step1' | 'step2' | 'step3',
    title: string,
    description: string,
    state: StepState
  ) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <AceEditor
            mode="python"
            theme="monokai"
            value={state.code}
            onChange={(newCode) => handleCodeChange(stepKey, newCode)}
            name={`business-analysis-editor-${stepKey}`}
            editorProps={{ $blockScrolling: true }}
            className="rounded-lg shadow-md border border-gray-300"
            style={{ height: '450px', width: '100%', borderRadius: '0.5rem' }}
            fontSize={13}
            showPrintMargin={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              tabSize: 4,
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => handleRunCode(stepKey)}
            disabled={state.isLoading || pyodideStatus !== 'ready'}
            className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none flex items-center"
          >
            {state.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                运行中...
              </>
            ) : (
              <>▶ 运行代码</>
            )}
          </button>

          <button
            onClick={() => handleShowAnswer(stepKey)}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
          >
            📖 查看参考答案
          </button>

          <button
            onClick={() => handleReset(stepKey)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
          >
            🔄 重置代码
          </button>

          {pyodideStatus !== 'ready' && (
            <span className="text-sm text-orange-600 font-medium">
              ⏳ Python 环境正在初始化...
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">📤 输出结果:</p>
          {renderOutput(state)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Hero 区域 */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="text-8xl md:text-9xl mb-4 md:mb-0 flex-shrink-0 animate-bounce-slow">
              💼
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                商业分析与 A/B 测试
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-2 font-medium">
                数据驱动决策 · 统计检验 · 业务价值评估
              </p>
              <p className="text-base md:text-lg text-blue-200 max-w-3xl leading-relaxed">
                通过真实的 A/B 测试场景，学习如何读取实验数据、进行统计显著性检验、并基于转化率、收益和置信区间给出综合业务建议。掌握数据分析师的核心技能！
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white border-opacity-20">
            {[
              { icon: '📊', title: '数据读取', desc: 'CSV 解析' },
              { icon: '🔬', title: '统计检验', desc: 'Z-test & p-value' },
              { icon: '📈', title: '置信区间', desc: '95% CI 计算' },
              { icon: '💡', title: '业务决策', desc: '综合建议输出' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm hover:bg-opacity-20 transition-all">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-blue-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pyodide 加载状态 */}
        {pyodideStatus === 'loading' && (
          <div className="mb-10">
            <PyodideLoader
              stage={pyodideProgress.stage as any}
              percent={pyodideProgress.percent}
              elapsedSeconds={elapsed}
            />
          </div>
        )}

        {pyodideStatus === 'error' && (
          <div className="mb-10">
            <PyodideLoader
              stage={0}
              percent={0}
              error={pyodideError || 'Pyodide 初始化失败，请刷新页面重试'}
            />
          </div>
        )}

        {/* 核心概念板块 */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              📚 核心概念
            </h2>
            <p className="text-gray-600 text-lg">
              掌握商业分析与 A/B 测试的基本原理
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 什么是商业分析 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">什么是商业分析？</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                商业分析是通过<strong className="text-blue-600">数据、统计分析和建模</strong>来帮助企业做出更好业务决策的过程。
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">🎯 核心目标:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 从海量数据中提取洞察</li>
                  <li>• 评估业务决策的效果</li>
                  <li>• 发现增长机会和风险</li>
                  <li>• 支持数据驱动决策</li>
                </ul>
              </div>
            </div>

            {/* 为什么重要 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">为什么数据驱动重要？</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong className="text-green-600">凭直觉决策</strong>风险高，而<strong className="text-green-600">数据驱动决策</strong>能显著提高成功率。
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">🌟 数据驱动的优势:</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 降低决策风险 30-50%</li>
                  <li>• 可量化评估效果</li>
                  <li>• 可复制的决策过程</li>
                  <li>• 消除认知偏见影响</li>
                </ul>
              </div>
            </div>

            {/* A/B 测试基础 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">🧪</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">A/B 测试基础</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                将用户<strong className="text-purple-600">随机分成两组</strong>，测试不同方案效果的对比实验。
              </p>
              <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <span className="bg-purple-200 text-purple-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 flex-shrink-0">A</span>
                  <div>
                    <p className="font-bold text-purple-800 text-sm">控制组 (Control)</p>
                    <p className="text-xs text-purple-700">维持现有方案</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 flex-shrink-0">B</span>
                  <div>
                    <p className="font-bold text-purple-800 text-sm">实验组 (Treatment)</p>
                    <p className="text-xs text-purple-700">应用新方案</p>
                  </div>
                </div>
                <div className="border-t border-purple-200 pt-2">
                  <p className="text-xs text-purple-700 font-medium">
                    <strong>H₀ 原假设:</strong> 两组无显著差异<br/>
                    <strong>H₁ 备择假设:</strong> 两组存在显著差异
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 统计检验流程图 */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔄 A/B 测试分析流程</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { num: '1', title: '收集数据', desc: '用户数、转化、收入', icon: '📥' },
                { num: '2', title: '计算指标', desc: 'CR、AOV、ARPU', icon: '🧮' },
                { num: '3', title: '统计检验', desc: 'Z-test / t-test', icon: '🔬' },
                { num: '4', title: '计算 p-value', desc: '判断显著性', icon: '📐' },
                { num: '5', title: '业务决策', desc: '上线 or 放弃', icon: '🎯' }
              ].map((step, idx) => (
                <div key={idx} className="text-center relative">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg">
                    {step.icon}
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-sm font-bold text-gray-800">Step {step.num}</p>
                    <p className="text-xs font-semibold text-blue-600">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 三步递进练习 */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              💻 实战练习
            </h2>
            <p className="text-gray-600 text-lg">
              通过三个逐步深入的练习，掌握商业分析的完整流程
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            {renderCodeSection(
              'step1',
              'Step 1️⃣ 基础: 数据读取与基础统计对比',
              '学习从 CSV 数据中读取 A/B 测试结果，计算控制组和实验组的核心指标（转化率、客单价、ARPU），并进行基础对比分析',
              step1
            )}

            {/* Step 2 */}
            {renderCodeSection(
              'step2',
              'Step 2️⃣ 进阶: 统计显著性检验 (Z-test & p-value)',
              '深入学习如何使用 Python 进行 Z-test 统计检验，计算 p-value 和置信区间，判断实验效果是否具有统计显著性',
              step2
            )}

            {/* Step 3 */}
            {renderCodeSection(
              'step3',
              'Step 3️⃣ 挑战: 数据驱动的业务决策报告',
              '综合运用前面的分析方法，结合转化率、收益、统计显著性和置信区间，输出一份完整的数据驱动业务决策报告，给出明确的上线建议',
              step3
            )}
          </div>
        </div>

        {/* 关键公式速查 */}
        <div className="mb-10 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📐 关键公式速查</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">📈 转化率 (CR)</h4>
              <p className="font-mono text-sm bg-white p-3 rounded-lg text-gray-700 mb-2">
                CR = 转化用户数 / 总用户数 × 100%
              </p>
              <p className="text-xs text-blue-700">衡量用户转化的比例</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">💰 平均客单价 (AOV)</h4>
              <p className="font-mono text-sm bg-white p-3 rounded-lg text-gray-700 mb-2">
                AOV = 总收入 / 转化用户数
              </p>
              <p className="text-xs text-green-700">衡量付费用户的平均消费</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">💎 每用户平均收入 (ARPU)</h4>
              <p className="font-mono text-sm bg-white p-3 rounded-lg text-gray-700 mb-2">
                ARPU = 总收入 / 总用户数
              </p>
              <p className="text-xs text-purple-700">衡量每个用户带来的价值</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-2">🔬 Z 统计量</h4>
              <p className="font-mono text-sm bg-white p-3 rounded-lg text-gray-700 mb-2">
                Z = (p₂ - p₁) / √(p(1-p)(1/n₁+1/n₂))
              </p>
              <p className="text-xs text-orange-700">用于检验两组比例差异的显著性</p>
            </div>
          </div>
        </div>

        {/* 课程完成 */}
        <div className="mb-10">
          <CourseCompletion
            courseId="business-analysis"
            courseTitle="商业分析"
            badgeIcon="💼"
            badgeName="商业分析达人"
          />
        </div>

        {/* 页脚 */}
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>🎓 完成所有练习后，点击上方按钮领取你的「商业分析达人」徽章！</p>
        </div>

      </div>
    </div>
  );
};

export default BusinessAnalysis;
