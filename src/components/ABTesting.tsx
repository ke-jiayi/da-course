import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

// ============ Step 1: 基础练习 - 参考答案 ============
const step1Answer = `# Step 1: 读取 A/B 测试数据，计算基础转化率与统计指标
import math

csv_data = """group,impressions,clicks,conversions,revenue
control,12500,3200,480,18240.50
treatment,12800,3580,596,23256.80
"""

lines = csv_data.strip().split("\\n")
header = lines[0].split(",")
data = []
for line in lines[1:]:
    vals = line.split(",")
    row = dict(zip(header, vals))
    row["impressions"] = int(row["impressions"])
    row["clicks"] = int(row["clicks"])
    row["conversions"] = int(row["conversions"])
    row["revenue"] = float(row["revenue"])
    data.append(row)

print("=" * 60)
print("【 Step 1 · 基础指标计算 】")
print("=" * 60)

results = {}
for row in data:
    g = row["group"]
    imp = row["impressions"]
    clicks = row["clicks"]
    conv = row["conversions"]
    rev = row["revenue"]

    ctr = clicks / imp
    cvr = conv / clicks
    overall_conv = conv / imp
    arpconv = rev / conv
    rpm = rev / imp

    se_ctr = math.sqrt(ctr * (1 - ctr) / imp)
    se_cvr = math.sqrt(cvr * (1 - cvr) / clicks)

    results[g] = {
        "impressions": imp,
        "clicks": clicks,
        "conversions": conv,
        "revenue": rev,
        "ctr": ctr,
        "cvr": cvr,
        "overall_conv": overall_conv,
        "arpconv": arpconv,
        "rpm": rpm,
        "se_ctr": se_ctr,
        "se_cvr": se_cvr,
    }

for g, r in results.items():
    print(f"\\n  {g.upper()} 组")
    print(f"  曝光量:      {r['impressions']:,}")
    print(f"  点击量:      {r['clicks']:,}")
    print(f"  转化数:      {r['conversions']:,}")
    print(f"  总收益:      ¥ {r['revenue']:,.2f}")
    print(f"  点击率(CTR): {r['ctr']*100:.2f}%  ±{r['se_ctr']*100:.2f}%")
    print(f"  转化率(CVR): {r['cvr']*100:.2f}%  ±{r['se_cvr']*100:.2f}%")
    print(f"  总转化率:    {r['overall_conv']*100:.2f}%")
    print(f"  单客收益:    ¥ {r['arpconv']:.2f}")
    print(f"  RPM:         ¥ {r['rpm']:.2f} / 千次曝光")

print("\\n" + "=" * 60)
print("【 差异对比 (Treatment vs Control) 】")
print("=" * 60)

ctrl = results["control"]
trt = results["treatment"]

diff_ctr = trt["ctr"] - ctrl["ctr"]
diff_cvr = trt["cvr"] - ctrl["cvr"]
lift_ctr = diff_ctr / ctrl["ctr"] * 100
lift_cvr = diff_cvr / ctrl["cvr"] * 100

print(f"\\n  CTR 绝对差: {diff_ctr*100:+.2f}%    相对提升: {lift_ctr:+.2f}%")
print(f"  CVR 绝对差: {diff_cvr*100:+.2f}%    相对提升: {lift_cvr:+.2f}%")
print(f"  收益差:     ¥{trt['revenue']-ctrl['revenue']:+,.2f}")
print(f"  RPM 提升:   {(trt['rpm']-ctrl['rpm']):+.2f} / 千次曝光")

print("\\n✅ Step 1 完成：已读取并计算基础统计指标")
`;

// ============ Step 2: 进阶练习 - 参考答案 ============
const step2Answer = `# Step 2: 使用 Python 实现比例 z-test (双样本)
import math

def two_proportion_z_test(conv_a, n_a, conv_b, n_b, alpha=0.05):
    """双样本比例 z 检验
    返回: (z_score, p_value, pooled_SE, ci_lower, ci_upper)
    """
    p_a = conv_a / n_a
    p_b = conv_b / n_b
    p_pooled = (conv_a + conv_b) / (n_a + n_b)
    se_pooled = math.sqrt(p_pooled * (1 - p_pooled) * (1.0 / n_a + 1.0 / n_b))

    diff = p_b - p_a
    z_score = diff / se_pooled

    # 使用级数近似计算标准正态分布的双尾 p-value (避免 scipy 依赖)
    def norm_sf(x):
        """生存函数 P(Z > x), x >= 0"""
        # Abramowitz & Stegun 7.1.26
        t = 1.0 / (1.0 + 0.2316419 * x)
        d = 0.3989422804014327 * math.exp(-x * x / 2.0)
        p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
        return p

    abs_z = abs(z_score)
    p_value = 2.0 * norm_sf(abs_z)
    if z_score == 0:
        p_value = 1.0

    # 95% 置信区间：使用非合并方差
    se_unpooled = math.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b)
    z_crit = 1.96  # 对应 alpha=0.05 双尾
    ci_lower = diff - z_crit * se_unpooled
    ci_upper = diff + z_crit * se_unpooled

    return z_score, p_value, se_pooled, ci_lower, ci_upper, se_unpooled, p_a, p_b


csv_data = """group,impressions,clicks,conversions,revenue
control,12500,3200,480,18240.50
treatment,12800,3580,596,23256.80
"""

lines = csv_data.strip().split("\\n")[1:]
data = {}
for line in lines:
    parts = line.split(",")
    g = parts[0]
    data[g] = {
        "impressions": int(parts[1]),
        "clicks": int(parts[2]),
        "conversions": int(parts[3]),
        "revenue": float(parts[4]),
    }

print("=" * 60)
print("【 Step 2 · 双样本 z 检验 】")
print("=" * 60)
print("\\n  H0 (原假设):      p_treatment == p_control")
print("  H1 (备择假设):    p_treatment != p_control")
print("  显著性水平 α:     0.05")
print("  检验类型:         双尾检验")

print("\\n" + "-" * 60)
print("【 检验 1 · 点击率 CTR 】(clicks / impressions)")
print("-" * 60)

c = data["control"]
t = data["treatment"]

z, p, se_pooled, ci_lo, ci_up, se_un, p_a, p_b = two_proportion_z_test(
    c["clicks"], c["impressions"], t["clicks"], t["impressions"]
)

print(f"  Control:   {c['clicks']:>6} / {c['impressions']:>6} = {p_a*100:.3f}%")
print(f"  Treatment: {t['clicks']:>6} / {t['impressions']:>6} = {p_b*100:.3f}%")
print(f"  差异 (B-A):      {(p_b-p_a)*100:+.4f}%")
print(f"  z 分数:          {z:+.4f}")
print(f"  p-value:         {p:.8f}")
print(f"  95% 置信区间:    [{ci_lo*100:+.4f}%, {ci_up*100:+.4f}%]")
print(f"  判断:            {'✅ 统计显著 (p < 0.05)' if p < 0.05 else '❌ 不显著 (p >= 0.05)'}")

print("\\n" + "-" * 60)
print("【 检验 2 · 转化率 CVR 】(conversions / clicks)")
print("-" * 60)

z2, p2, se2, ci_lo2, ci_up2, se_un2, pa2, pb2 = two_proportion_z_test(
    c["conversions"], c["clicks"], t["conversions"], t["clicks"]
)

print(f"  Control:   {c['conversions']:>6} / {c['clicks']:>6} = {pa2*100:.3f}%")
print(f"  Treatment: {t['conversions']:>6} / {t['clicks']:>6} = {pb2*100:.3f}%")
print(f"  差异 (B-A):      {(pb2-pa2)*100:+.4f}%")
print(f"  z 分数:          {z2:+.4f}")
print(f"  p-value:         {p2:.8f}")
print(f"  95% 置信区间:    [{ci_lo2*100:+.4f}%, {ci_up2*100:+.4f}%]")
print(f"  判断:            {'✅ 统计显著 (p < 0.05)' if p2 < 0.05 else '❌ 不显著 (p >= 0.05)'}")

print("\\n" + "-" * 60)
print("【 检验 3 · 总转化率 】(conversions / impressions)")
print("-" * 60)

z3, p3, se3, ci_lo3, ci_up3, se_un3, pa3, pb3 = two_proportion_z_test(
    c["conversions"], c["impressions"], t["conversions"], t["impressions"]
)

print(f"  Control:   {c['conversions']:>6} / {c['impressions']:>6} = {pa3*100:.3f}%")
print(f"  Treatment: {t['conversions']:>6} / {t['impressions']:>6} = {pb3*100:.3f}%")
print(f"  差异 (B-A):      {(pb3-pa3)*100:+.4f}%")
print(f"  z 分数:          {z3:+.4f}")
print(f"  p-value:         {p3:.8f}")
print(f"  95% 置信区间:    [{ci_lo3*100:+.4f}%, {ci_up3*100:+.4f}%]")
print(f"  判断:            {'✅ 统计显著 (p < 0.05)' if p3 < 0.05 else '❌ 不显著 (p >= 0.05)'}")

print("\\n" + "=" * 60)
print("【 小知识 · 第一类 / 第二类错误 】")
print("=" * 60)
print("  第一类错误 (Type I, α):  错误地拒绝真的 H0  (假阳性)")
print("  第二类错误 (Type II, β): 错误地接受假的 H0  (假阴性)")
print("  检验效能 Power = 1 - β")
print("  α 越小，β 越大 → 需要更大样本量才能达到同样 Power")

print("\\n✅ Step 2 完成：已实现比例 z-test，输出 p-value 与置信区间")
`;

// ============ Step 3: 挑战练习 - 参考答案 ============
const step3Answer = `# Step 3: 综合决策分析 —— 结合显著性、效果幅度、收益潜力
import math

# ---------- 0. 复用的 z-test ----------
def two_prop_z(conv_a, n_a, conv_b, n_b):
    p_a = conv_a / n_a
    p_b = conv_b / n_b
    p_pool = (conv_a + conv_b) / (n_a + n_b)
    se_pool = math.sqrt(p_pool * (1 - p_pool) * (1.0 / n_a + 1.0 / n_b))
    diff = p_b - p_a
    z = diff / se_pool

    def norm_sf(x):
        t = 1.0 / (1.0 + 0.2316419 * x)
        d = 0.3989422804014327 * math.exp(-x * x / 2.0)
        return d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
    p = 2.0 * norm_sf(abs(z))
    se_u = math.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b)
    return z, p, diff, se_u, p_a, p_b


# ---------- 1. 数据 ----------
csv_data = """group,impressions,clicks,conversions,revenue
control,12500,3200,480,18240.50
treatment,12800,3580,596,23256.80
"""
lines = csv_data.strip().split("\\n")[1:]
data = {}
for line in lines:
    p = line.split(",")
    data[p[0]] = {
        "impressions": int(p[1]),
        "clicks": int(p[2]),
        "conversions": int(p[3]),
        "revenue": float(p[4]),
    }
c, t = data["control"], data["treatment"]


# ---------- 2. 三个维度的检验 ----------
z_ctr, p_ctr, diff_ctr, se_ctr, pa_ctr, pb_ctr = two_prop_z(c["clicks"], c["impressions"], t["clicks"], t["impressions"])
z_cvr, p_cvr, diff_cvr, se_cvr, pa_cvr, pb_cvr = two_prop_z(c["conversions"], c["clicks"], t["conversions"], t["clicks"])
z_total, p_total, diff_total, se_total, pa_total, pb_total = two_prop_z(c["conversions"], c["impressions"], t["conversions"], t["impressions"])

# 单客收益（ARPU / 每转化）
arpu_conv_ctrl = c["revenue"] / c["conversions"]
arpu_conv_trt = t["revenue"] / t["conversions"]
rpm_ctrl = c["revenue"] / c["impressions"] * 1000
rpm_trt = t["revenue"] / t["impressions"] * 1000

lift_ctr = diff_ctr / pa_ctr * 100
lift_cvr = diff_cvr / pa_cvr * 100
lift_total = diff_total / pa_total * 100
lift_rpm = (rpm_trt - rpm_ctrl) / rpm_ctrl * 100

# 95% 置信区间上/下限
ci_ctr = (diff_ctr - 1.96 * se_ctr, diff_ctr + 1.96 * se_ctr)
ci_cvr = (diff_cvr - 1.96 * se_cvr, diff_cvr + 1.96 * se_cvr)
ci_total = (diff_total - 1.96 * se_total, diff_total + 1.96 * se_total)


# ---------- 3. 效应量 (Cohen's h) ----------
def cohens_h(p1, p2):
    return 2.0 * (math.asin(math.sqrt(max(0.0, min(1.0, p2)))) -
                   math.asin(math.sqrt(max(0.0, min(1.0, p1)))))

h_total = cohens_h(pa_total, pb_total)


# ---------- 4. 业务预测 ----------
monthly_impressions = 1_000_000   # 预估月度曝光
base_revenue_monthly = monthly_impressions * pa_total * arpu_conv_ctrl
new_revenue_monthly = monthly_impressions * pb_total * arpu_conv_trt
extra_revenue_monthly = new_revenue_monthly - base_revenue_monthly
extra_revenue_yearly = extra_revenue_monthly * 12


# ---------- 5. 输出 ----------
def box(title):
    print("\\n" + "=" * 60)
    print(f"【 {title} 】")
    print("=" * 60)

box("Step 3 · 综合决策分析")

print("\\n  📊 一、统计显著性 (α = 0.05)")
print("  " + "-" * 58)
print(f"  指标       p-value      z      显著?    95% CI(%)")
print(f"  CTR        {p_ctr:.6f}   {z_ctr:+.2f}    {'✅ 是' if p_ctr < 0.05 else '❌ 否'}    [{ci_ctr[0]*100:+.3f}, {ci_ctr[1]*100:+.3f}]")
print(f"  CVR        {p_cvr:.6f}   {z_cvr:+.2f}    {'✅ 是' if p_cvr < 0.05 else '❌ 否'}    [{ci_cvr[0]*100:+.3f}, {ci_cvr[1]*100:+.3f}]")
print(f"  总转化     {p_total:.6f}   {z_total:+.2f}    {'✅ 是' if p_total < 0.05 else '❌ 否'}    [{ci_total[0]*100:+.3f}, {ci_total[1]*100:+.3f}]")

print("\\n  🎯 二、效果幅度 (Effect Size)")
print("  " + "-" * 58)
print(f"  CTR 相对提升:     {lift_ctr:+.2f}%      ({'大' if abs(lift_ctr) >= 10 else '中' if abs(lift_ctr) >= 5 else '小'}效应)")
print(f"  CVR 相对提升:     {lift_cvr:+.2f}%      ({'大' if abs(lift_cvr) >= 10 else '中' if abs(lift_cvr) >= 5 else '小'}效应)")
print(f"  总转化相对提升:   {lift_total:+.2f}%    ({'大' if abs(lift_total) >= 10 else '中' if abs(lift_total) >= 5 else '小'}效应)")
print(f"  Cohen's h =       {abs(h_total):.4f}    (小≈0.2, 中≈0.5, 大≈0.8)")

print("\\n  💰 三、收益增长潜力")
print("  " + "-" * 58)
print(f"  对照组 RPM:       ¥{rpm_ctrl:.2f} / 千次")
print(f"  实验组 RPM:       ¥{rpm_trt:.2f} / 千次")
print(f"  RPM 相对提升:     {lift_rpm:+.2f}%")
print(f"  单客收益:         对照组 ¥{arpu_conv_ctrl:.2f} → 实验组 ¥{arpu_conv_trt:.2f}")
print(f"  预估月度曝光:     {monthly_impressions:,} 次")
print(f"  预估月度额外收益: ¥{extra_revenue_monthly:+,.2f}")
print(f"  预估年度额外收益: ¥{extra_revenue_yearly:+,.2f}")

print("\\n  ⚖️  四、风险评估")
print("  " + "-" * 58)
all_significant = (p_ctr < 0.05) and (p_cvr < 0.05) and (p_total < 0.05)
ci_all_positive = (ci_ctr[0] > 0) and (ci_cvr[0] > 0) and (ci_total[0] > 0)

print(f"  全部指标显著?       {'✅ 是' if all_significant else '⚠️ 否 (存在不显著指标)'}")
print(f"  CI 下限均 > 0?      {'✅ 是' if ci_all_positive else '⚠️ 否 (存在跨 0 的 CI)'}")
print(f"  Cohen's h 绝对值:   {abs(h_total):.4f}   ({'小效应' if abs(h_total) < 0.2 else '中等效应' if abs(h_total) < 0.5 else '大效应'})")

print("\\n  📝 五、最终决策结论")
print("  " + "-" * 58)

if all_significant and ci_all_positive and lift_total > 0:
    conclusion = "✅ 推荐上线实验组版本：所有核心指标统计显著，且置信区间全为正，业务提升稳健。"
elif p_total < 0.05 and ci_total[0] > 0 and (p_ctr < 0.05 or p_cvr < 0.05):
    conclusion = "🟢 建议上线，配合持续监测：主指标(总转化)显著为正，虽局部指标可能波动，但总体正向。"
elif p_total < 0.05 and abs(lift_total) < 5:
    conclusion = "🟡 谨慎决策：统计显著但业务提升幅度小，需评估上线成本 vs 收益 (约 ¥{:,.0f}/月)。".format(extra_revenue_monthly)
elif p_total >= 0.05 and ci_total[0] < 0 < ci_total[1]:
    conclusion = "🟠 暂不上线，需扩大样本：p-value ≥ 0.05，置信区间跨 0，当前数据不足以判断优劣。"
else:
    conclusion = "🔴 不推荐上线：实验组未展现显著优势，或存在显著负向影响。"

print(f"  {conclusion}")

print("\\n" + "=" * 60)
print("  决策者摘要 (Executive Summary)")
print("=" * 60)
print(f"  • CTR:  {pa_ctr*100:.2f}% → {pb_ctr*100:.2f}%   (相对{lift_ctr:+.2f}%, p={p_ctr:.4f})")
print(f"  • CVR:  {pa_cvr*100:.2f}% → {pb_cvr*100:.2f}%   (相对{lift_cvr:+.2f}%, p={p_cvr:.4f})")
print(f"  • RPM:  ¥{rpm_ctrl:.2f} → ¥{rpm_trt:.2f}   (相对{lift_rpm:+.2f}%)")
print(f"  • 年度收益增量潜力: ¥{extra_revenue_yearly:+,.0f}")
print(f"  • 结论: {conclusion}")

print("\\n✅ Step 3 完成：综合统计显著性 × 效果幅度 × 收益潜力，已输出业务决策")
`;

// ============ 模板代码 ============
const step1Starter = `# Step 1: 读取 A/B 测试数据，计算基础转化率与统计指标
# 数据格式: group, impressions, clicks, conversions, revenue

csv_data = """group,impressions,clicks,conversions,revenue
control,12500,3200,480,18240.50
treatment,12800,3580,596,23256.80
"""

# TODO: 在这里解析 CSV，计算两组的
#  - CTR = clicks / impressions
#  - CVR = conversions / clicks
#  - 总转化率 = conversions / impressions
#  - 单客收益 = revenue / conversions
#  - RPM = revenue / impressions * 1000

print("请完成 Step 1 的代码...")
`;

const step2Starter = `# Step 2: 实现双样本比例 z-test
# 参考公式：
#   p_pool = (conv_a + conv_b) / (n_a + n_b)
#   SE = sqrt(p_pool * (1-p_pool) * (1/n_a + 1/n_b))
#   z = (p_b - p_a) / SE
#   95% CI = (p_b - p_a) ± 1.96 * SE_unpooled

csv_data = """group,impressions,clicks,conversions,revenue
control,12500,3200,480,18240.50
treatment,12800,3580,596,23256.80
"""

# TODO: 实现 two_proportion_z_test 函数并对 3 个指标做检验

print("请完成 Step 2 的代码...")
`;

const step3Starter = `# Step 3: 综合决策分析
# 需要结合：
#   1) 统计显著性 (p-value < 0.05)
#   2) 效果幅度 (相对提升%, Cohen's h)
#   3) 收益增长潜力 (月度/年度额外收益)
# 并给出业务决策结论

csv_data = """group,impressions,clicks,conversions,revenue
control,12500,3200,480,18240.50
treatment,12800,3580,596,23256.80
"""

# TODO: 综合上述三个维度输出结论

print("请完成 Step 3 的代码...")
`;

const ABTesting: React.FC = () => {
  const [pyodideReady, setPyodideReady] = useState<boolean>(isPyodideReady());
  const [pyodideStage, setPyodideStage] = useState<number>(0);
  const [pyodidePercent, setPyodidePercent] = useState<number>(0);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [pyodideSeconds, setPyodideSeconds] = useState<number>(0);

  const [step1Code, setStep1Code] = useState(step1Starter);
  const [step1Output, setStep1Output] = useState<string>('');
  const [step1Error, setStep1Error] = useState<string>('');
  const [step1ShowAnswer, setStep1ShowAnswer] = useState(false);
  const [step1Running, setStep1Running] = useState(false);

  const [step2Code, setStep2Code] = useState(step2Starter);
  const [step2Output, setStep2Output] = useState<string>('');
  const [step2Error, setStep2Error] = useState<string>('');
  const [step2ShowAnswer, setStep2ShowAnswer] = useState(false);
  const [step2Running, setStep2Running] = useState(false);

  const [step3Code, setStep3Code] = useState(step3Starter);
  const [step3Output, setStep3Output] = useState<string>('');
  const [step3Error, setStep3Error] = useState<string>('');
  const [step3ShowAnswer, setStep3ShowAnswer] = useState(false);
  const [step3Running, setStep3Running] = useState(false);

  useEffect(() => {
    if (pyodideReady) return;

    let mounted = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      if (mounted) setPyodideSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    initPyodide((p: PyodideProgress) => {
      if (mounted) {
        setPyodideStage(p.stage);
        setPyodidePercent(p.percent);
      }
    })
      .then(() => {
        if (mounted) {
          setPyodideReady(true);
          setPyodideStage(4);
          setPyodidePercent(100);
        }
      })
      .catch((err: Error) => {
        if (mounted) setPyodideError(err.message || 'Pyodide 初始化失败');
      });

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [pyodideReady]);

  const runStep = async (
    code: string,
    setOutput: (s: string) => void,
    setError: (s: string) => void,
    setRunning: (b: boolean) => void
  ) => {
    setError('');
    setOutput('');
    if (!code.trim()) {
      setError('请先输入代码再运行');
      return;
    }
    setRunning(true);
    try {
      const res = await runPythonCode(code);
      if (res.success) {
        setOutput(res.output || res.stdout || '代码执行成功（无输出）');
      } else {
        const errMsg =
          `[${res.error?.type || 'Error'}] ${res.error?.message || ''}` +
          (res.stdout ? `\n\nstdout:\n${res.stdout}` : '') +
          (res.stderr ? `\n\nstderr:\n${res.stderr}` : '');
        setError(errMsg);
        if (res.stdout) setOutput(res.stdout);
      }
    } catch (err: any) {
      setError(`执行异常: ${err?.message || String(err)}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* ================= Hero 区域 ================= */}
        <header className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-10 border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full opacity-30 blur-3xl -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="text-7xl md:text-8xl select-none">🧪</div>
              <div className="flex-1">
                <p className="text-indigo-500 font-semibold text-sm md:text-base mb-2 tracking-wider uppercase">
                  A/B TESTING · 数据分析实战
                </p>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                  A/B 测试分析 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">数据驱动决策</span>
                </h1>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  从零开始掌握 A/B 测试核心原理 —— 假设检验、p-value、显著性水平、第一/二类错误，
                  并用 Python 实现双样本比例 z-test，结合业务收益给出可落地的决策结论。
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">📘 统计假设检验</span>
                  <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">🐍 Python 实战</span>
                  <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">💼 业务决策</span>
                  <span className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold">🎯 3 步递进</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ================= Pyodide 加载器 ================= */}
        {!pyodideReady && (
          <div className="mb-10">
            <PyodideLoader
              stage={pyodideStage as 0 | 1 | 2 | 3 | 4}
              percent={pyodidePercent}
              error={pyodideError}
              elapsedSeconds={pyodideSeconds}
            />
          </div>
        )}

        {/* ================= 核心概念板块 ================= */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">核心概念</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 卡片 1: 设计原则 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🎯</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">A/B 测试设计原则</h3>
                  <ul className="text-gray-600 text-sm space-y-1.5 leading-relaxed">
                    <li>• <b>单一变量</b>：每次只改变一个核心变量</li>
                    <li>• <b>随机分流</b>：保证两组用户同质可比</li>
                    <li>• <b>样本量先验</b>：实验前计算所需最小样本量</li>
                    <li>• <b>指标先行</b>：确定主指标 / 辅助指标 / 护栏指标</li>
                    <li>• <b>等时长</b>：两组必须在完全相同的时间窗口运行</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 卡片 2: 原假设/备择假设 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">⚖️</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">原假设 vs 备择假设</h3>
                  <div className="text-gray-600 text-sm space-y-2 leading-relaxed">
                    <p>
                      <b className="text-rose-600">H₀ (原假设)</b>：实验组与对照组之间<b>没有差异</b>。这是我们默认的立场，直到有足够证据推翻它。
                    </p>
                    <p>
                      <b className="text-emerald-600">H₁ (备择假设)</b>：实验组与对照组之间<b>存在显著差异</b>。我们希望通过数据证明 H₁ 成立。
                    </p>
                    <p className="text-xs text-gray-500 italic mt-2">例: H₀: p_treatment = p_control; H₁: p_treatment ≠ p_control (双尾检验)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 卡片 3: p-value & 显著性水平 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">p-value & 显著性水平 α</h3>
                  <div className="text-gray-600 text-sm space-y-2 leading-relaxed">
                    <p>
                      <b>p-value</b>：在 H₀ 为真的前提下，观察到当前或更极端结果的概率。p 越小，说明 "巧合" 的可能性越低。
                    </p>
                    <p>
                      <b>显著性水平 α</b>：人为设定的阈值，通常取 <b className="text-indigo-600">0.05</b>。若 p &lt; α，则"拒绝原假设"。
                    </p>
                    <div className="bg-indigo-50 rounded-lg px-3 py-2 mt-2 font-mono text-xs text-indigo-700">
                      p &lt; 0.05 → 差异显著 ✅ &nbsp;&nbsp; p ≥ 0.05 → 不显著 ❌
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 卡片 4: 第一/二类错误 */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">第一类错误 & 第二类错误</h3>
                  <div className="text-gray-600 text-sm space-y-2 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs font-bold flex-shrink-0 mt-0.5">Type I · α</span>
                      <span><b>假阳性</b>：H₀ 为真却被拒绝。上线了一个"无效"的版本。降低 α 可减少此错误。</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold flex-shrink-0 mt-0.5">Type II · β</span>
                      <span><b>假阴性</b>：H₀ 为假却被保留。漏掉了真正有效的版本。样本量越小，β 越大。</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold flex-shrink-0 mt-0.5">Power = 1−β</span>
                      <span><b>检验效能</b>：当差异真实存在时能检测到它的概率。通常目标 ≥ 80%。</span>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-1">α 与 β 呈此消彼长：减小 α 会增大 β。平衡两者需要更大样本量。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 三步递进练习 ================= */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">动手练习 · 三步递进</h2>
          </div>
          <p className="text-gray-600 mb-4 -mt-2 pl-4">
            从基础数据读取 → 统计检验实现 → 综合业务决策，一步一步掌握 A/B 测试完整分析流程。
          </p>

          {/* ---------- Step 1 ---------- */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 md:px-8 py-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">1</span>
                  <div>
                    <h3 className="text-xl font-bold">Step 1 · 基础：读取数据 & 计算基础指标</h3>
                    <p className="text-indigo-100 text-sm">CTR / CVR / 总转化率 / 单客收益 / RPM</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">📘 基础</span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={step1Code}
                  onChange={(v) => setStep1Code(v)}
                  name="ab-step1-editor"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{ showLineNumbers: true, tabSize: 4 }}
                  style={{ height: '280px', width: '100%', fontSize: '13px' }}
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => runStep(step1Code, setStep1Output, setStep1Error, setStep1Running)}
                  disabled={step1Running || !pyodideReady}
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step1Running ? '⏳ 运行中...' : '▶ 运行代码'}
                </button>
                <button
                  onClick={() => {
                    setStep1ShowAnswer((prev) => !prev);
                    if (!step1ShowAnswer) setStep1Code(step1Answer);
                  }}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
                >
                  {step1ShowAnswer ? '🔄 隐藏参考答案' : '💡 显示参考答案'}
                </button>
                <button
                  onClick={() => {
                    setStep1Code(step1Starter);
                    setStep1Output('');
                    setStep1Error('');
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
                >
                  ♻ 重置
                </button>
              </div>

              {step1Error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 whitespace-pre-wrap font-mono text-sm mb-3">
                  {step1Error}
                </div>
              )}
              {step1Output && (
                <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
                  {step1Output}
                </div>
              )}
            </div>
          </div>

          {/* ---------- Step 2 ---------- */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 md:px-8 py-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">2</span>
                  <div>
                    <h3 className="text-xl font-bold">Step 2 · 进阶：双样本比例 z-test</h3>
                    <p className="text-emerald-100 text-sm">实现 z-test · 计算 p-value · 95% 置信区间</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">⚡ 进阶</span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={step2Code}
                  onChange={(v) => setStep2Code(v)}
                  name="ab-step2-editor"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{ showLineNumbers: true, tabSize: 4 }}
                  style={{ height: '320px', width: '100%', fontSize: '13px' }}
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => runStep(step2Code, setStep2Output, setStep2Error, setStep2Running)}
                  disabled={step2Running || !pyodideReady}
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step2Running ? '⏳ 运行中...' : '▶ 运行代码'}
                </button>
                <button
                  onClick={() => {
                    setStep2ShowAnswer((prev) => !prev);
                    if (!step2ShowAnswer) setStep2Code(step2Answer);
                  }}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
                >
                  {step2ShowAnswer ? '🔄 隐藏参考答案' : '💡 显示参考答案'}
                </button>
                <button
                  onClick={() => {
                    setStep2Code(step2Starter);
                    setStep2Output('');
                    setStep2Error('');
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
                >
                  ♻ 重置
                </button>
              </div>

              {step2Error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 whitespace-pre-wrap font-mono text-sm mb-3">
                  {step2Error}
                </div>
              )}
              {step2Output && (
                <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
                  {step2Output}
                </div>
              )}
            </div>
          </div>

          {/* ---------- Step 3 ---------- */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 px-6 md:px-8 py-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">3</span>
                  <div>
                    <h3 className="text-xl font-bold">Step 3 · 挑战：综合决策分析</h3>
                    <p className="text-rose-100 text-sm">p-value × 效果幅度 × 收益潜力 → 业务结论</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">🔥 挑战</span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={step3Code}
                  onChange={(v) => setStep3Code(v)}
                  name="ab-step3-editor"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{ showLineNumbers: true, tabSize: 4 }}
                  style={{ height: '340px', width: '100%', fontSize: '13px' }}
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => runStep(step3Code, setStep3Output, setStep3Error, setStep3Running)}
                  disabled={step3Running || !pyodideReady}
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step3Running ? '⏳ 运行中...' : '▶ 运行代码'}
                </button>
                <button
                  onClick={() => {
                    setStep3ShowAnswer((prev) => !prev);
                    if (!step3ShowAnswer) setStep3Code(step3Answer);
                  }}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
                >
                  {step3ShowAnswer ? '🔄 隐藏参考答案' : '💡 显示参考答案'}
                </button>
                <button
                  onClick={() => {
                    setStep3Code(step3Starter);
                    setStep3Output('');
                    setStep3Error('');
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
                >
                  ♻ 重置
                </button>
              </div>

              {step3Error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 whitespace-pre-wrap font-mono text-sm mb-3">
                  {step3Error}
                </div>
              )}
              {step3Output && (
                <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
                  {step3Output}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= 学习小结 ================= */}
        <section className="mt-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl shadow-2xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-10 translate-y-10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-4xl">🎓</div>
              <h2 className="text-2xl md:text-3xl font-bold">你学到了什么？</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-2xl mb-2">①</div>
                <p className="font-semibold text-lg mb-1">看懂数据</p>
                <p className="text-sm text-white/80 leading-relaxed">
                  从 CSV 中提取两组指标，计算 CTR、CVR、RPM 等关键业务指标。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-2xl mb-2">②</div>
                <p className="font-semibold text-lg mb-1">做统计检验</p>
                <p className="text-sm text-white/80 leading-relaxed">
                  用双样本 z-test 计算 p-value 与置信区间，判断差异是否"显著"。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-2xl mb-2">③</div>
                <p className="font-semibold text-lg mb-1">写业务结论</p>
                <p className="text-sm text-white/80 leading-relaxed">
                  综合显著性 × 效果幅度 × 收益潜力，给出可落地的决策建议。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= Course Completion ================= */}
        <div className="mt-10">
          <CourseCompletion
            courseId="ab-testing"
            courseTitle="A/B测试分析"
            badgeIcon="🧪"
            badgeName="A/B测试高手"
          />
        </div>

        <footer className="text-center text-gray-400 text-xs mt-10 pb-4">
          © A/B Testing Interactive Course · Powered by Python + React
        </footer>
      </div>
    </div>
  );
};

export default ABTesting;
