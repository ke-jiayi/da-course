import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

const AnomalyDetection: React.FC = () => {
  // ============ Pyodide 状态 ============
  const [pyodideStage, setPyodideStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [pyodidePercent, setPyodidePercent] = useState(0);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (isPyodideReady()) {
      setPyodideReady(true);
      setPyodideStage(4);
      setPyodidePercent(100);
      return;
    }

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    initPyodide((p: PyodideProgress) => {
      setPyodideStage(p.stage);
      setPyodidePercent(p.percent);
      if (p.stage === 4 && p.percent >= 100) {
        setPyodideReady(true);
        clearInterval(timer);
      }
    }).catch((err: Error) => {
      setPyodideError(err.message);
      clearInterval(timer);
    });

    return () => clearInterval(timer);
  }, []);

  // ============ Step 1 状态 ============
  const [code1, setCode1] = useState('');
  const [result1, setResult1] = useState<any>(null);
  const [loading1, setLoading1] = useState(false);
  const [showAnswer1, setShowAnswer1] = useState(false);

  // ============ Step 2 状态 ============
  const [code2, setCode2] = useState('');
  const [result2, setResult2] = useState<any>(null);
  const [loading2, setLoading2] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);

  // ============ Step 3 状态 ============
  const [code3, setCode3] = useState('');
  const [result3, setResult3] = useState<any>(null);
  const [loading3, setLoading3] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  // ============ 占位代码 / 参考答案 ============
  const placeholder1 = `# ===========================================
# Step 1 基础练习：数据探索与直方图
# ===========================================
# 任务：
# 1. 读取下方 CSV 数据（客户交易数据）
# 2. 使用 describe() 查看描述性统计
# 3. 绘制交易金额直方图，观察是否存在异常值
#
# 提示：使用 pd.read_csv(io.StringIO(csv_text)) 读取
#       使用 plt.hist() 绘制直方图
#       最后调用 show_plot() 显示图像

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io

# ======= 客户交易数据（故意混入若干异常大金额） =======
csv_data = """交易ID,客户ID,交易金额,交易类型,交易时段
T0001,C1001,256.50,消费,白天
T0002,C1002,189.00,消费,白天
T0003,C1003,320.80,消费,白天
T0004,C1004,156.00,消费,白天
T0005,C1005,420.00,消费,白天
T0006,C1006,289.50,消费,白天
T0007,C1007,178.00,消费,白天
T0008,C1008,312.60,消费,白天
T0009,C1009,245.00,消费,白天
T0010,C1010,198.80,消费,白天
T0011,C1011,267.00,消费,白天
T0012,C1012,356.20,消费,白天
T0013,C1013,189.50,消费,白天
T0014,C1014,298.00,消费,白天
T0015,C1015,220.60,消费,白天
T0016,C1016,310.00,消费,白天
T0017,C1017,278.50,消费,白天
T0018,C1018,165.00,消费,白天
T0019,C1019,345.80,消费,白天
T0020,C1020,235.00,消费,白天
T0021,C1021,8800.00,消费,凌晨
T0022,C1022,298.50,消费,白天
T0023,C1023,189.00,消费,白天
T0024,C1024,267.80,消费,白天
T0025,C1025,345.00,消费,白天
T0026,C1026,210.50,消费,白天
T0027,C1027,298.00,消费,白天
T0028,C1028,378.50,消费,白天
T0029,C1029,256.00,消费,白天
T0030,C1030,12500.00,消费,凌晨
T0031,C1031,289.50,消费,白天
T0032,C1032,320.00,消费,白天
T0033,C1033,178.60,消费,白天
T0034,C1034,245.00,消费,白天
T0035,C1035,312.80,消费,白天
T0036,C1036,267.00,消费,白天
T0037,C1037,356.50,消费,白天
T0038,C1038,198.00,消费,白天
T0039,C1039,289.60,消费,白天
T0040,C1040,6500.00,转账,凌晨
T0041,C1041,235.50,消费,白天
T0042,C1042,310.00,消费,白天
T0043,C1043,278.80,消费,白天
T0044,C1044,165.00,消费,白天
T0045,C1045,345.00,消费,白天
T0046,C1046,210.60,消费,白天
T0047,C1047,298.50,消费,白天
T0048,C1048,378.00,消费,白天
T0049,C1049,256.80,消费,白天
T0050,C1050,15000.00,转账,凌晨
"""

# === 在这里编写你的代码 ===


`;

  const answer1 = `# ===========================================
# Step 1 参考答案：数据探索与直方图
# ===========================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io

csv_data = """交易ID,客户ID,交易金额,交易类型,交易时段
T0001,C1001,256.50,消费,白天
T0002,C1002,189.00,消费,白天
T0003,C1003,320.80,消费,白天
T0004,C1004,156.00,消费,白天
T0005,C1005,420.00,消费,白天
T0006,C1006,289.50,消费,白天
T0007,C1007,178.00,消费,白天
T0008,C1008,312.60,消费,白天
T0009,C1009,245.00,消费,白天
T0010,C1010,198.80,消费,白天
T0011,C1011,267.00,消费,白天
T0012,C1012,356.20,消费,白天
T0013,C1013,189.50,消费,白天
T0014,C1014,298.00,消费,白天
T0015,C1015,220.60,消费,白天
T0016,C1016,310.00,消费,白天
T0017,C1017,278.50,消费,白天
T0018,C1018,165.00,消费,白天
T0019,C1019,345.80,消费,白天
T0020,C1020,235.00,消费,白天
T0021,C1021,8800.00,消费,凌晨
T0022,C1022,298.50,消费,白天
T0023,C1023,189.00,消费,白天
T0024,C1024,267.80,消费,白天
T0025,C1025,345.00,消费,白天
T0026,C1026,210.50,消费,白天
T0027,C1027,298.00,消费,白天
T0028,C1028,378.50,消费,白天
T0029,C1029,256.00,消费,白天
T0030,C1030,12500.00,消费,凌晨
T0031,C1031,289.50,消费,白天
T0032,C1032,320.00,消费,白天
T0033,C1033,178.60,消费,白天
T0034,C1034,245.00,消费,白天
T0035,C1035,312.80,消费,白天
T0036,C1036,267.00,消费,白天
T0037,C1037,356.50,消费,白天
T0038,C1038,198.00,消费,白天
T0039,C1039,289.60,消费,白天
T0040,C1040,6500.00,转账,凌晨
T0041,C1041,235.50,消费,白天
T0042,C1042,310.00,消费,白天
T0043,C1043,278.80,消费,白天
T0044,C1044,165.00,消费,白天
T0045,C1045,345.00,消费,白天
T0046,C1046,210.60,消费,白天
T0047,C1047,298.50,消费,白天
T0048,C1048,378.00,消费,白天
T0049,C1049,256.80,消费,白天
T0050,C1050,15000.00,转账,凌晨
"""

# ============ 1. 读取数据 ============
df = pd.read_csv(io.StringIO(csv_data))
print("=" * 60)
print("【数据概览】")
print("=" * 60)
print(f"总行数: {len(df)}, 总列数: {len(df.columns)}")
print()
print("前 5 行数据:")
print(df.head())
print()
print("后 5 行数据（看看异常数据在哪）:")
print(df.tail())

# ============ 2. 描述性统计 ============
print()
print("=" * 60)
print("【交易金额 描述性统计】")
print("=" * 60)
amount = df['交易金额']
stats = amount.describe()
print(stats)
print()
print(f"均值 (Mean):     {amount.mean():.2f}")
print(f"中位数 (Median): {amount.median():.2f}")
print(f"标准差 (Std):    {amount.std():.2f}")
print(f"最小值 (Min):    {amount.min():.2f}")
print(f"最大值 (Max):    {amount.max():.2f}")
print(f"极差 (Range):    {amount.max() - amount.min():.2f}")

# ============ 3. 观察潜在异常 ============
print()
print("=" * 60)
print("【观察：大于 1000 元的交易】")
print("=" * 60)
suspicious = df[df['交易金额'] > 1000]
print(suspicious.to_string(index=False))
print()
print(f"共发现 {len(suspicious)} 笔可疑大额交易")

# ============ 4. 绘制直方图 ============
print()
print("正在绘制直方图...")
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 左图：全量直方图
axes[0].hist(amount, bins=20, edgecolor='black', color='#60a5fa', alpha=0.8)
axes[0].set_title('交易金额分布（全量）', fontsize=12)
axes[0].set_xlabel('交易金额（元）')
axes[0].set_ylabel('频次')
axes[0].axvline(amount.mean(), color='red', linestyle='--', linewidth=1, label=f'均值={amount.mean():.0f}')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# 右图：只看正常范围（< 1000）的直方图
normal = amount[amount < 1000]
axes[1].hist(normal, bins=15, edgecolor='black', color='#34d399', alpha=0.8)
axes[1].set_title('交易金额分布（< 1000 元）', fontsize=12)
axes[1].set_xlabel('交易金额（元）')
axes[1].set_ylabel('频次')
axes[1].axvline(normal.mean(), color='red', linestyle='--', linewidth=1, label=f'均值={normal.mean():.0f}')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
print(show_plot())

print()
print("=" * 60)
print("【观察结论】")
print("=" * 60)
print(f"• 大部分交易集中在 {normal.min():.0f} ~ {normal.max():.0f} 元之间")
print(f"• 存在 {len(suspicious)} 笔远超正常范围的大额交易")
print(f"• 最大值 {amount.max():.0f} 元是均值的 {amount.max()/amount.mean():.1f} 倍")
print("• 这些大额交易均发生在 '凌晨' 时段，需要进一步排查")
`;

  const placeholder2 = `# ===========================================
# Step 2 进阶：Z-Score 与 IQR 异常检测
# ===========================================
# 任务：
# 1. 使用 Z-Score 方法（|Z| > 3 视为异常）
# 2. 使用 IQR 箱线图法（超出 [Q1-1.5*IQR, Q3+1.5*IQR] 视为异常）
# 3. 对比两种方法的检测结果，分析差异
#
# 提示：
#   Z = (x - mean) / std
#   IQR = Q3 - Q1
#   lower = Q1 - 1.5 * IQR
#   upper = Q3 + 1.5 * IQR

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io

csv_data = """交易ID,客户ID,交易金额,交易类型,交易时段
T0001,C1001,256.50,消费,白天
T0002,C1002,189.00,消费,白天
T0003,C1003,320.80,消费,白天
T0004,C1004,156.00,消费,白天
T0005,C1005,420.00,消费,白天
T0006,C1006,289.50,消费,白天
T0007,C1007,178.00,消费,白天
T0008,C1008,312.60,消费,白天
T0009,C1009,245.00,消费,白天
T0010,C1010,198.80,消费,白天
T0011,C1011,267.00,消费,白天
T0012,C1012,356.20,消费,白天
T0013,C1013,189.50,消费,白天
T0014,C1014,298.00,消费,白天
T0015,C1015,220.60,消费,白天
T0016,C1016,310.00,消费,白天
T0017,C1017,278.50,消费,白天
T0018,C1018,165.00,消费,白天
T0019,C1019,345.80,消费,白天
T0020,C1020,235.00,消费,白天
T0021,C1021,8800.00,消费,凌晨
T0022,C1022,298.50,消费,白天
T0023,C1023,189.00,消费,白天
T0024,C1024,267.80,消费,白天
T0025,C1025,345.00,消费,白天
T0026,C1026,210.50,消费,白天
T0027,C1027,298.00,消费,白天
T0028,C1028,378.50,消费,白天
T0029,C1029,256.00,消费,白天
T0030,C1030,12500.00,消费,凌晨
T0031,C1031,289.50,消费,白天
T0032,C1032,320.00,消费,白天
T0033,C1033,178.60,消费,白天
T0034,C1034,245.00,消费,白天
T0035,C1035,312.80,消费,白天
T0036,C1036,267.00,消费,白天
T0037,C1037,356.50,消费,白天
T0038,C1038,198.00,消费,白天
T0039,C1039,289.60,消费,白天
T0040,C1040,6500.00,转账,凌晨
T0041,C1041,235.50,消费,白天
T0042,C1042,310.00,消费,白天
T0043,C1043,278.80,消费,白天
T0044,C1044,165.00,消费,白天
T0045,C1045,345.00,消费,白天
T0046,C1046,210.60,消费,白天
T0047,C1047,298.50,消费,白天
T0048,C1048,378.00,消费,白天
T0049,C1049,256.80,消费,白天
T0050,C1050,15000.00,转账,凌晨
"""

# === 在这里编写你的代码 ===


`;

  const answer2 = `# ===========================================
# Step 2 参考答案：Z-Score 与 IQR 异常检测
# ===========================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io

csv_data = """交易ID,客户ID,交易金额,交易类型,交易时段
T0001,C1001,256.50,消费,白天
T0002,C1002,189.00,消费,白天
T0003,C1003,320.80,消费,白天
T0004,C1004,156.00,消费,白天
T0005,C1005,420.00,消费,白天
T0006,C1006,289.50,消费,白天
T0007,C1007,178.00,消费,白天
T0008,C1008,312.60,消费,白天
T0009,C1009,245.00,消费,白天
T0010,C1010,198.80,消费,白天
T0011,C1011,267.00,消费,白天
T0012,C1012,356.20,消费,白天
T0013,C1013,189.50,消费,白天
T0014,C1014,298.00,消费,白天
T0015,C1015,220.60,消费,白天
T0016,C1016,310.00,消费,白天
T0017,C1017,278.50,消费,白天
T0018,C1018,165.00,消费,白天
T0019,C1019,345.80,消费,白天
T0020,C1020,235.00,消费,白天
T0021,C1021,8800.00,消费,凌晨
T0022,C1022,298.50,消费,白天
T0023,C1023,189.00,消费,白天
T0024,C1024,267.80,消费,白天
T0025,C1025,345.00,消费,白天
T0026,C1026,210.50,消费,白天
T0027,C1027,298.00,消费,白天
T0028,C1028,378.50,消费,白天
T0029,C1029,256.00,消费,白天
T0030,C1030,12500.00,消费,凌晨
T0031,C1031,289.50,消费,白天
T0032,C1032,320.00,消费,白天
T0033,C1033,178.60,消费,白天
T0034,C1034,245.00,消费,白天
T0035,C1035,312.80,消费,白天
T0036,C1036,267.00,消费,白天
T0037,C1037,356.50,消费,白天
T0038,C1038,198.00,消费,白天
T0039,C1039,289.60,消费,白天
T0040,C1040,6500.00,转账,凌晨
T0041,C1041,235.50,消费,白天
T0042,C1042,310.00,消费,白天
T0043,C1043,278.80,消费,白天
T0044,C1044,165.00,消费,白天
T0045,C1045,345.00,消费,白天
T0046,C1046,210.60,消费,白天
T0047,C1047,298.50,消费,白天
T0048,C1048,378.00,消费,白天
T0049,C1049,256.80,消费,白天
T0050,C1050,15000.00,转账,凌晨
"""

df = pd.read_csv(io.StringIO(csv_data))
amount = df['交易金额'].values

# ============ 方法一：Z-Score ============
print("=" * 60)
print("【方法一：Z-Score 检测（阈值 |Z| > 3）】")
print("=" * 60)

mean = np.mean(amount)
std = np.std(amount, ddof=1)
z_scores = (amount - mean) / std

print(f"均值 = {mean:.2f}")
print(f"标准差 = {std:.2f}")
print()

# 标记异常
df['Z-Score'] = z_scores
df['Z-异常'] = np.abs(z_scores) > 3
z_anomalies = df[df['Z-异常']]

print("Z-Score 异常检测结果:")
print(z_anomalies[['交易ID', '客户ID', '交易金额', '交易类型', '交易时段', 'Z-Score']].to_string(index=False))
print()
print(f"Z-Score 方法共发现 {len(z_anomalies)} 个异常值")

# ============ 方法二：IQR 箱线图法 ============
print()
print("=" * 60)
print("【方法二：IQR 箱线图法（1.5 × IQR 规则）】")
print("=" * 60)

Q1 = np.percentile(amount, 25)
Q3 = np.percentile(amount, 75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

print(f"Q1 (25% 分位) = {Q1:.2f}")
print(f"Q3 (75% 分位) = {Q3:.2f}")
print(f"IQR = {IQR:.2f}")
print(f"下界 = {lower_bound:.2f}")
print(f"上界 = {upper_bound:.2f}")
print(f"正常范围: [{lower_bound:.2f}, {upper_bound:.2f}]")
print()

df['IQR-异常'] = (amount < lower_bound) | (amount > upper_bound)
iqr_anomalies = df[df['IQR-异常']]

print("IQR 异常检测结果:")
print(iqr_anomalies[['交易ID', '客户ID', '交易金额', '交易类型', '交易时段']].to_string(index=False))
print()
print(f"IQR 方法共发现 {len(iqr_anomalies)} 个异常值")

# ============ 对比分析 ============
print()
print("=" * 60)
print("【两种方法对比】")
print("=" * 60)

z_ids = set(z_anomalies['交易ID'])
iqr_ids = set(iqr_anomalies['交易ID'])

print(f"Z-Score 方法异常数: {len(z_ids)}")
print(f"IQR 方法异常数:     {len(iqr_ids)}")
print(f"两种方法都识别为异常: {len(z_ids & iqr_ids)}")
print(f"仅 Z-Score 识别:     {len(z_ids - iqr_ids)}")
print(f"仅 IQR 识别:         {len(iqr_ids - z_ids)}")
print()
print("共同识别的异常交易:")
common = df[df['交易ID'].isin(z_ids & iqr_ids)]
print(common[['交易ID', '客户ID', '交易金额', '交易时段']].to_string(index=False))

# ============ 3σ 原则可视化 ============
print()
print("正在绘制 Z-Score 与 IQR 对比图...")
fig, axes = plt.subplots(2, 1, figsize=(12, 8))

# 上图：Z-Score 可视化
x_vals = np.arange(len(amount))
colors_z = ['#ef4444' if abs(z) > 3 else '#3b82f6' for z in z_scores]
axes[0].scatter(x_vals, z_scores, c=colors_z, s=50, alpha=0.8, edgecolors='white')
axes[0].axhline(y=3, color='red', linestyle='--', linewidth=1.5, label='+3σ 阈值')
axes[0].axhline(y=-3, color='red', linestyle='--', linewidth=1.5, label='-3σ 阈值')
axes[0].axhline(y=0, color='gray', linestyle='-', linewidth=0.8)
axes[0].set_title('Z-Score 异常检测（红色点为异常）', fontsize=13)
axes[0].set_xlabel('交易序号')
axes[0].set_ylabel('Z-Score')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# 下图：IQR 可视化（箱线图 + 散点）
box_data = [amount]
bp = axes[1].boxplot(box_data, vert=True, patch_artist=True, labels=['交易金额'])
for patch in bp['boxes']:
    patch.set_facecolor('#34d399')
for whisker in bp['whiskers']:
    whisker.set(color='#047857', linewidth=1.5)
for median in bp['medians']:
    median.set(color='#dc2626', linewidth=2)

# 叠加散点
axes[1].scatter(np.ones_like(amount), amount, c=colors_z, s=40, alpha=0.6, edgecolors='white')
axes[1].axhline(y=upper_bound, color='orange', linestyle='--', linewidth=1, label=f'上界={upper_bound:.0f}')
axes[1].axhline(y=lower_bound, color='orange', linestyle='--', linewidth=1, label=f'下界={lower_bound:.0f}')
axes[1].set_title('IQR 箱线图法（红色点为 Z-Score 异常）', fontsize=13)
axes[1].set_ylabel('交易金额（元）')
axes[1].legend()
axes[1].grid(True, alpha=0.3, axis='y')

plt.tight_layout()
print(show_plot())

print()
print("=" * 60)
print("【方法对比总结】")
print("=" * 60)
print("• Z-Score 方法：基于均值和标准差，对极端异常敏感")
print("  优点：计算简单、结果直观（有明确的统计意义）")
print("  缺点：异常值本身会拉高均值和标准差，可能导致检测失真")
print()
print("• IQR 方法：基于中位数思想，对异常值鲁棒性更强")
print("  优点：不受极端值影响，是更稳健的检测方法")
print("  缺点：可能漏检轻微异常（阈值相对更严格或更宽松取决于分布）")
print()
print("• 实战建议：两种方法结合使用，并结合业务知识人工复核")
`;

  const placeholder3 = `# ===========================================
# Step 3 挑战：综合分析与异常报告
# ===========================================
# 任务：
# 1. 绘制箱线图展示检测结果（按交易时段分组对比）
# 2. 生成完整异常报告：
#    - 异常总数量、异常占比（百分比）
#    - 异常总金额
#    - 最高/平均异常金额
# 3. 结合业务场景给出处理建议
#
# 提示：使用 df.groupby() 分组统计
#       使用 plt.boxplot() 绘制分组箱线图
#       用 print 格式化输出报告

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io

csv_data = """交易ID,客户ID,交易金额,交易类型,交易时段
T0001,C1001,256.50,消费,白天
T0002,C1002,189.00,消费,白天
T0003,C1003,320.80,消费,白天
T0004,C1004,156.00,消费,白天
T0005,C1005,420.00,消费,白天
T0006,C1006,289.50,消费,白天
T0007,C1007,178.00,消费,白天
T0008,C1008,312.60,消费,白天
T0009,C1009,245.00,消费,白天
T0010,C1010,198.80,消费,白天
T0011,C1011,267.00,消费,白天
T0012,C1012,356.20,消费,白天
T0013,C1013,189.50,消费,白天
T0014,C1014,298.00,消费,白天
T0015,C1015,220.60,消费,白天
T0016,C1016,310.00,消费,白天
T0017,C1017,278.50,消费,白天
T0018,C1018,165.00,消费,白天
T0019,C1019,345.80,消费,白天
T0020,C1020,235.00,消费,白天
T0021,C1021,8800.00,消费,凌晨
T0022,C1022,298.50,消费,白天
T0023,C1023,189.00,消费,白天
T0024,C1024,267.80,消费,白天
T0025,C1025,345.00,消费,白天
T0026,C1026,210.50,消费,白天
T0027,C1027,298.00,消费,白天
T0028,C1028,378.50,消费,白天
T0029,C1029,256.00,消费,白天
T0030,C1030,12500.00,消费,凌晨
T0031,C1031,289.50,消费,白天
T0032,C1032,320.00,消费,白天
T0033,C1033,178.60,消费,白天
T0034,C1034,245.00,消费,白天
T0035,C1035,312.80,消费,白天
T0036,C1036,267.00,消费,白天
T0037,C1037,356.50,消费,白天
T0038,C1038,198.00,消费,白天
T0039,C1039,289.60,消费,白天
T0040,C1040,6500.00,转账,凌晨
T0041,C1041,235.50,消费,白天
T0042,C1042,310.00,消费,白天
T0043,C1043,278.80,消费,白天
T0044,C1044,165.00,消费,白天
T0045,C1045,345.00,消费,白天
T0046,C1046,210.60,消费,白天
T0047,C1047,298.50,消费,白天
T0048,C1048,378.00,消费,白天
T0049,C1049,256.80,消费,白天
T0050,C1050,15000.00,转账,凌晨
"""

# === 在这里编写你的代码 ===


`;

  const answer3 = `# ===========================================
# Step 3 参考答案：综合分析与异常报告
# ===========================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io

csv_data = """交易ID,客户ID,交易金额,交易类型,交易时段
T0001,C1001,256.50,消费,白天
T0002,C1002,189.00,消费,白天
T0003,C1003,320.80,消费,白天
T0004,C1004,156.00,消费,白天
T0005,C1005,420.00,消费,白天
T0006,C1006,289.50,消费,白天
T0007,C1007,178.00,消费,白天
T0008,C1008,312.60,消费,白天
T0009,C1009,245.00,消费,白天
T0010,C1010,198.80,消费,白天
T0011,C1011,267.00,消费,白天
T0012,C1012,356.20,消费,白天
T0013,C1013,189.50,消费,白天
T0014,C1014,298.00,消费,白天
T0015,C1015,220.60,消费,白天
T0016,C1016,310.00,消费,白天
T0017,C1017,278.50,消费,白天
T0018,C1018,165.00,消费,白天
T0019,C1019,345.80,消费,白天
T0020,C1020,235.00,消费,白天
T0021,C1021,8800.00,消费,凌晨
T0022,C1022,298.50,消费,白天
T0023,C1023,189.00,消费,白天
T0024,C1024,267.80,消费,白天
T0025,C1025,345.00,消费,白天
T0026,C1026,210.50,消费,白天
T0027,C1027,298.00,消费,白天
T0028,C1028,378.50,消费,白天
T0029,C1029,256.00,消费,白天
T0030,C1030,12500.00,消费,凌晨
T0031,C1031,289.50,消费,白天
T0032,C1032,320.00,消费,白天
T0033,C1033,178.60,消费,白天
T0034,C1034,245.00,消费,白天
T0035,C1035,312.80,消费,白天
T0036,C1036,267.00,消费,白天
T0037,C1037,356.50,消费,白天
T0038,C1038,198.00,消费,白天
T0039,C1039,289.60,消费,白天
T0040,C1040,6500.00,转账,凌晨
T0041,C1041,235.50,消费,白天
T0042,C1042,310.00,消费,白天
T0043,C1043,278.80,消费,白天
T0044,C1044,165.00,消费,白天
T0045,C1045,345.00,消费,白天
T0046,C1046,210.60,消费,白天
T0047,C1047,298.50,消费,白天
T0048,C1048,378.00,消费,白天
T0049,C1049,256.80,消费,白天
T0050,C1050,15000.00,转账,凌晨
"""

df = pd.read_csv(io.StringIO(csv_data))
amount = df['交易金额'].values

# ============ 异常检测（采用更鲁棒的 IQR 方法） ============
Q1 = np.percentile(amount, 25)
Q3 = np.percentile(amount, 75)
IQR = Q3 - Q1
upper_bound = Q3 + 1.5 * IQR
lower_bound = Q1 - 1.5 * IQR

df['is_anomaly'] = (amount < lower_bound) | (amount > upper_bound)
anomalies = df[df['is_anomaly']]
normal = df[~df['is_anomaly']]

# ============ 1. 绘制分组箱线图 ============
print("正在绘制综合分析可视化...")
fig = plt.figure(figsize=(14, 8))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.25)

# (0,0) 总体箱线图
ax1 = fig.add_subplot(gs[0, 0])
bp1 = ax1.boxplot(amount, vert=True, patch_artist=True, labels=['总体'])
for patch in bp1['boxes']:
    patch.set_facecolor('#60a5fa')
for median in bp1['medians']:
    median.set(color='#dc2626', linewidth=2)

# 标注异常点
ax1.scatter(np.ones(len(anomalies)), anomalies['交易金额'],
            c='#ef4444', s=80, marker='o', edgecolors='white', zorder=5, label='异常交易')
ax1.set_title('总体交易金额箱线图', fontsize=12)
ax1.set_ylabel('交易金额（元）')
ax1.legend()
ax1.grid(True, alpha=0.3, axis='y')

# (0,1) 按交易时段分组
daytime_data = df[df['交易时段'] == '白天']['交易金额'].values
night_data = df[df['交易时段'] == '凌晨']['交易金额'].values
ax2 = fig.add_subplot(gs[0, 1])
bp2 = ax2.boxplot([daytime_data, night_data], vert=True, patch_artist=True,
                  labels=['白天交易', '凌晨交易'])
colors = ['#34d399', '#f59e0b']
for i, patch in enumerate(bp2['boxes']):
    patch.set_facecolor(colors[i])
for median in bp2['medians']:
    median.set(color='#dc2626', linewidth=2)

ax2.set_title('按交易时段分组箱线图', fontsize=12)
ax2.set_ylabel('交易金额（元）')
ax2.grid(True, alpha=0.3, axis='y')

# (1,0) 异常 vs 正常对比
ax3 = fig.add_subplot(gs[1, 0])
bp3 = ax3.boxplot([normal['交易金额'].values, anomalies['交易金额'].values],
                  vert=True, patch_artist=True, labels=['正常交易', '异常交易'])
colors2 = ['#3b82f6', '#ef4444']
for i, patch in enumerate(bp3['boxes']):
    patch.set_facecolor(colors2[i])
for median in bp3['medians']:
    median.set(color='#1f2937', linewidth=2)

ax3.set_title('正常 vs 异常交易金额对比', fontsize=12)
ax3.set_ylabel('交易金额（元，对数刻度）')
ax3.set_yscale('log')
ax3.grid(True, alpha=0.3, axis='y')

# (1,1) 异常交易分布图（条形图）
ax4 = fig.add_subplot(gs[1, 1])
anomalies_sorted = anomalies.sort_values('交易金额', ascending=True)
bars = ax4.barh(anomalies_sorted['交易ID'], anomalies_sorted['交易金额'],
                color='#ef4444', alpha=0.8, edgecolor='white')
ax4.set_title('异常交易金额明细', fontsize=12)
ax4.set_xlabel('交易金额（元）')
for bar in bars:
    width = bar.get_width()
    ax4.text(width + 50, bar.get_y() + bar.get_height()/2,
             f'{width:.0f}', va='center', fontsize=9)
ax4.grid(True, alpha=0.3, axis='x')

print(show_plot())

# ============ 2. 异常报告 ============
print()
print("╔" + "=" * 58 + "╗")
print("║" + " " * 15 + "📊 客户交易异常检测报告" + " " * 20 + "║")
print("╚" + "=" * 58 + "╝")

total_trans = len(df)
total_anomaly = len(anomalies)
anomaly_ratio = total_anomaly / total_trans * 100
total_amount = df['交易金额'].sum()
anomaly_amount = anomalies['交易金额'].sum()
anomaly_amount_ratio = anomaly_amount / total_amount * 100
normal_amount = normal['交易金额'].sum()

print()
print("━" * 60)
print("【总体概览】")
print("━" * 60)
print(f"  交易总笔数:          {total_trans} 笔")
print(f"  交易总金额:          ¥ {total_amount:,.2f}")
print(f"  正常交易笔数:        {len(normal)} 笔")
print(f"  正常交易总金额:      ¥ {normal_amount:,.2f}")
print(f"  异常交易笔数:        {total_anomaly} 笔")
print(f"  异常交易总金额:      ¥ {anomaly_amount:,.2f}")
print(f"  异常笔数占比:        {anomaly_ratio:.2f}%")
print(f"  异常金额占比:        {anomaly_amount_ratio:.2f}%")

print()
print("━" * 60)
print("【异常金额分析】")
print("━" * 60)
print(f"  最高异常交易金额:    ¥ {anomalies['交易金额'].max():,.2f}")
print(f"  最低异常交易金额:    ¥ {anomalies['交易金额'].min():,.2f}")
print(f"  异常交易平均金额:    ¥ {anomalies['交易金额'].mean():,.2f}")
print(f"  异常交易金额中位数:  ¥ {anomalies['交易金额'].median():,.2f}")
print(f"  正常交易平均金额:    ¥ {normal['交易金额'].mean():,.2f}")
print(f"  异常/正常平均比值:   {anomalies['交易金额'].mean()/normal['交易金额'].mean():.2f} 倍")

print()
print("━" * 60)
print("【按交易时段分析】")
print("━" * 60)
by_time = df.groupby('交易时段').agg(
    总笔数=('交易ID', 'count'),
    总金额=('交易金额', 'sum'),
    异常笔数=('is_anomaly', 'sum'),
    异常金额=('交易金额', lambda x: x[df.loc[x.index, 'is_anomaly']].sum())
).reset_index()

for _, row in by_time.iterrows():
    ratio = row['异常笔数'] / row['总笔数'] * 100
    print(f"  [{row['交易时段']}]")
    print(f"    交易笔数: {row['总笔数']:>4} 笔, 总金额: ¥ {row['总金额']:>10,.2f}")
    print(f"    异常笔数: {int(row['异常笔数']):>4} 笔, 异常金额: ¥ {row['异常金额']:>10,.2f}")
    print(f"    异常笔数占比: {ratio:.2f}%")
    print()

print("━" * 60)
print("【异常交易明细清单】")
print("━" * 60)
print(f"  {'交易ID':<8} {'客户ID':<8} {'金额(元)':>10} {'类型':<6} {'时段':<6}")
print("  " + "-" * 52)
for _, row in anomalies.sort_values('交易金额', ascending=False).iterrows():
    print(f"  {row['交易ID']:<8} {row['客户ID']:<8} {row['交易金额']:>10,.2f} {row['交易类型']:<6} {row['交易时段']:<6}")

# ============ 3. 业务处理建议 ============
print()
print("━" * 60)
print("【🔍 业务处理建议】")
print("━" * 60)
print()
print("  🚨 高风险提示:")
print(f"   • 共发现 {total_anomaly} 笔异常交易，金额合计 ¥ {anomaly_amount:,.2f}")
print(f"   • 虽然只占总笔数的 {anomaly_ratio:.2f}%，但金额占比高达 {anomaly_amount_ratio:.2f}%")
print(f"   • 所有 {total_anomaly} 笔异常交易均发生在【凌晨】时段，需高度警惕")
print()
print("  💡 风控建议:")
print("   1. 【立即冻结】上述异常交易，等待人工审核")
print("   2. 【人工复核】联系相关客户（" + ", ".join(anomalies['客户ID'].unique()) + "）核实交易真实性")
print("   3. 【加强监控】凌晨时段的大额交易自动触发二次验证（短信/人脸/OTP）")
print("   4. 【规则引擎】为凌晨时段设置更低的异常阈值，例如单笔 > ¥5,000 即报警")
print("   5. 【客户画像】对频繁出现大额异常交易的客户标记为高风险等级")
print("   6. 【模型升级】后续引入机器学习模型（Isolation Forest、One-Class SVM）")
print("      自动学习客户行为模式，提升检测精度")
print()
print("  📈 数据运营建议:")
print(f"   • 正常交易平均金额约 ¥ {normal['交易金额'].mean():,.2f}，可作为基准")
print(f"   • 建议设定动态阈值：单笔金额 > {upper_bound:.0f} 元自动进入人工审核")
print("   • 定期（如每日/每周）重新计算统计量，适应业务季节变化")
print()
print("═" * 60)
print("📝 报告生成完成。异常检测核心思想：用数据说话，结合业务决策。")
print("═" * 60)
`;

  // ============ 通用运行函数 ============
  const handleRun = async (
    code: string,
    setResult: (r: any) => void,
    setLoading: (v: boolean) => void,
    answer: string,
    _setCode: (c: string) => void,
    showAnswer: boolean
  ) => {
    const codeToRun = showAnswer ? answer : code;
    if (!codeToRun.trim()) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: { type: 'InputError', message: '请先编写代码或显示参考答案后再运行' }
      });
      return;
    }
    if (!pyodideReady) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: { type: 'SystemError', message: 'Python 环境正在初始化，请稍候...' }
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await runPythonCode(codeToRun);
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: { type: 'ExecutionError', message: '执行出错: ' + (err.message || String(err)) }
      });
    } finally {
      setLoading(false);
    }
  };

  // ============ 渲染函数：代码编辑器 + 按钮 + 输出 ============
  const renderCodeBlock = (
    key: string,
    code: string,
    setCode: (c: string) => void,
    result: any,
    setResult: (r: any) => void,
    loading: boolean,
    showAnswer: boolean,
    setShowAnswer: (v: boolean) => void,
    answer: string,
    placeholder: string,
    run: () => void
  ) => (
    <div className="space-y-4">
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <AceEditor
          mode="python"
          theme="monokai"
          value={showAnswer ? answer : (code || placeholder)}
          onChange={setCode}
          name={`anomaly-editor-${key}`}
          editorProps={{ $blockScrolling: true }}
          className="w-full"
          style={{ height: '500px', width: '100%', fontSize: '14px' }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: false,
            tabSize: 4,
            useSoftTabs: true,
            fontSize: 14,
            showGutter: true,
            showLineNumbers: true
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={run}
          disabled={loading || !pyodideReady}
          className={`px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all ${
            loading || !pyodideReady
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-primary text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              运行中...
            </span>
          ) : (
            '▶ 运行代码'
          )}
        </button>

        <button
          onClick={() => {
            setShowAnswer(!showAnswer);
            setResult(null);
          }}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
        >
          {showAnswer ? '📝 返回我的代码' : '💡 显示参考答案'}
        </button>

        <button
          onClick={() => {
            setCode('');
            setResult(null);
            setShowAnswer(false);
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
        >
          🔄 重置
        </button>
      </div>

      {/* 输出区 */}
      {result && !result.success && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100">
          <div className="font-bold mb-2">⚠️ {result.error?.type || '错误'}</div>
          <div className="text-sm">{result.error?.message}</div>
          {result.stderr && (
            <pre className="mt-3 text-xs text-red-300 whitespace-pre-wrap bg-black/30 p-3 rounded">{result.stderr}</pre>
          )}
        </div>
      )}

      {result && result.success && (
        <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg">
          {result.output && (
            <div dangerouslySetInnerHTML={{ __html: result.output.replace(/\n/g, '<br/>') }} />
          )}
          {!result.output && result.stdout && <pre className="whitespace-pre-wrap">{result.stdout}</pre>}
          {!result.output && !result.stdout && <span className="text-green-300">✓ 代码执行成功（无输出）</span>}
        </div>
      )}
    </div>
  );

  // ============ 主渲染 ============
  if (!pyodideReady && !pyodideError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <PyodideLoader
            stage={pyodideStage}
            percent={pyodidePercent}
            elapsedSeconds={elapsedSeconds}
          />
        </div>
      </div>
    );
  }

  if (pyodideError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <PyodideLoader
            stage={pyodideStage}
            percent={pyodidePercent}
            error={pyodideError}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">

        {/* ============ Hero 区域 ============ */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-7xl md:text-8xl drop-shadow-lg animate-pulse">🔍</div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">异常值检测</h1>
                <p className="text-lg md:text-2xl font-light opacity-95 mb-4">
                  Outlier Detection | 从数据中识别"鹤立鸡群"的那些点
                </p>
                <p className="text-sm md:text-base opacity-90 max-w-3xl leading-relaxed">
                  在真实业务数据中，异常值往往隐藏着关键信息——可能是欺诈交易、设备故障、
                  数据录入错误，也可能是突破性的商业机会。本课程将带你系统性掌握 <strong>3σ 原则</strong>、
                  <strong>IQR 箱线图法</strong> 和 <strong>Z-Score</strong> 三大经典方法，
                  并通过一个客户交易数据集，从零开始完成一次完整的异常检测实战。
                </p>
                <div className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">📊 描述性统计</span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">🎯 Z-Score</span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">📦 IQR 箱线图</span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">💼 风控实战</span>
                </div>
              </div>
            </div>
          </div>

          {/* 学习路径 */}
          <div className="p-6 md:p-10 bg-gradient-to-b from-white to-indigo-50/30">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🗺️</span> 本课学习路径
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { step: '01', title: '数据探索', desc: '读取交易数据，通过描述性统计和直方图识别数据分布特征', icon: '📊' },
                { step: '02', title: '异常检测', desc: '实现 Z-Score 和 IQR 两种经典方法，对比检测结果的差异', icon: '🎯' },
                { step: '03', title: '综合分析', desc: '绘制箱线图、生成异常报告，结合业务场景给出处理建议', icon: '💼' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 shadow-md border border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{item.icon}</span>
                    <span className="text-sm font-bold text-indigo-400">Step {item.step}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ 核心概念板块 ============ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-indigo-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="mr-3">📚</span> 核心概念
          </h2>
          <p className="text-gray-600 mb-8">在开始实战之前，让我们先理清异常检测的核心思想和三大经典方法</p>

          {/* 概念 1：什么是异常值 */}
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">❓</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">① 什么是异常值（Outlier）？</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>异常值</strong>是指在数据集中与大多数观测值显著不同的数据点。用统计学家 Grubbs 的话说：
                  <em>"一个看起来偏离样本其余部分的观测值"</em>。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl mb-1">💳</div>
                    <div className="font-semibold text-gray-800 mb-1">欺诈交易</div>
                    <p className="text-xs text-gray-600">信用卡突然出现大额境外消费</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl mb-1">⚙️</div>
                    <div className="font-semibold text-gray-800 mb-1">设备故障</div>
                    <p className="text-xs text-gray-600">传感器读数突然飙升或归零</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl mb-1">⚠️</div>
                    <div className="font-semibold text-gray-800 mb-1">数据错误</div>
                    <p className="text-xs text-gray-600">录入错误、单位混淆、系统 Bug</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 概念 2：3σ 原则 */}
          <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">📏</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-3">② 3σ 原则（Three-Sigma Rule）</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  如果数据服从<strong>正态分布</strong>，则约 <strong>68%</strong> 的数据位于 μ ± σ 内，
                  约 <strong>95%</strong> 位于 μ ± 2σ 内，约 <strong>99.7%</strong> 位于 μ ± 3σ 内。
                  因此，超出 <code className="bg-white px-2 py-0.5 rounded text-green-800">μ ± 3σ</code> 范围的数据点可以视为异常值。
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-800 border border-green-200">
                  <div className="text-green-700 mb-1">📐 公式：</div>
                  <div>阈值下界 = μ − 3 × σ</div>
                  <div>阈值上界 = μ + 3 × σ</div>
                  <div className="mt-2 text-gray-500 text-xs">其中 μ 为均值，σ 为标准差</div>
                </div>
                <p className="text-sm text-orange-700 mt-3 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  ⚠️ <strong>注意：</strong>3σ 原则仅适用于近似正态分布的数据；当数据本身有严重偏态时，该方法不可靠。
                </p>
              </div>
            </div>
          </div>

          {/* 概念 3：IQR 箱线图法 */}
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">📦</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 mb-3">③ IQR 箱线图法（Interquartile Range）</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  IQR 即四分位距，是 <strong>Q3（75% 分位）</strong> 与 <strong>Q1（25% 分位）</strong> 之差，
                  代表中间 50% 数据的跨度。它比均值/标准差更<strong>鲁棒</strong>（不受极端值影响）。
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-800 border border-purple-200 mb-3">
                  <div className="text-purple-700 mb-1">📐 公式（由统计学家 Tukey 提出）：</div>
                  <div>IQR = Q3 − Q1</div>
                  <div>下界 = Q1 − 1.5 × IQR</div>
                  <div>上界 = Q3 + 1.5 × IQR</div>
                  <div className="mt-2 text-gray-500 text-xs">超出 [下界, 上界] 范围的数据被标记为异常值</div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full">📊 箱线图可视化</span>
                  <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full">🎯 无需正态假设</span>
                  <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full">🛡️ 对极端值鲁棒</span>
                </div>
              </div>
            </div>
          </div>

          {/* 概念 4：Z-Score */}
          <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">🎯</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-3">④ Z-Score（标准分数）</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Z-Score 衡量一个数据点<strong>距离均值有多少个标准差</strong>。它把原始数据转换为"相对于均值的标准化距离"。
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-800 border border-amber-200">
                  <div className="text-amber-700 mb-1">📐 公式：</div>
                  <div>Z = (x − μ) / σ</div>
                  <div className="mt-2 text-gray-500 text-xs">x 是单个数据点；通常 {'|Z| > 3'} 视为异常</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white rounded-xl p-3 border border-amber-200 text-center">
                    <div className="text-2xl font-bold text-green-600">{'|Z| ≤ 2'}</div>
                    <div className="text-xs text-gray-600 mt-1">正常范围</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-amber-200 text-center">
                    <div className="text-2xl font-bold text-amber-600">{'2 < |Z| ≤ 3'}</div>
                    <div className="text-xs text-gray-600 mt-1">疑似异常（关注）</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-amber-200 text-center">
                    <div className="text-2xl font-bold text-red-600">{'|Z| > 3'}</div>
                    <div className="text-xs text-gray-600 mt-1">确定异常（报警）</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 概念 5：业务场景 */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6 border border-rose-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">💼</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-rose-900 mb-3">⑤ 业务场景中的异常：为什么值得花时间检测？</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-xl p-4 border border-rose-100">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">💰</span>
                      <span className="font-semibold text-gray-800">金融风控</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">识别信用卡盗刷、洗钱交易、虚假退款。据统计，欺诈交易金额虽只占总量 0.1%，但单笔金额往往是正常交易的 50~100 倍。</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-rose-100">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🏭</span>
                      <span className="font-semibold text-gray-800">工业运维</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">通过传感器数据异常提前发现设备故障、生产异常，避免大规模停机造成的经济损失。</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-rose-100">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🛡️</span>
                      <span className="font-semibold text-gray-800">信息安全</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">检测异常登录、暴力破解、数据泄露前兆。凌晨大量登录失败请求往往意味着攻击正在发生。</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-rose-100">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📈</span>
                      <span className="font-semibold text-gray-800">数据清洗</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">在建立机器学习模型前剔除异常值，防止模型参数被极端值"带偏"，提升模型稳定性与准确性。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Step 1 ============ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-blue-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl font-bold w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">1</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Step 1 · 数据探索</h2>
              <p className="text-gray-600 text-sm">读取客户交易数据，使用描述性统计和直方图识别潜在异常</p>
            </div>
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-blue-900 mb-1">🎯 练习目标</div>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>从 CSV 字符串中读取客户交易数据（50 条交易，故意混入若干异常大额交易）</li>
              <li>用 <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 text-xs">describe()</code>、均值、中位数、标准差、最值认识数据</li>
              <li>绘制直方图，从视觉上判断"长尾"——哪些交易可能是异常值？</li>
            </ul>
          </div>

          {renderCodeBlock(
            'step1',
            code1,
            setCode1,
            result1,
            setResult1,
            loading1,
            showAnswer1,
            setShowAnswer1,
            answer1,
            placeholder1,
            () => handleRun(code1, setResult1, setLoading1, answer1, setCode1, showAnswer1)
          )}
        </div>

        {/* ============ Step 2 ============ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-purple-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">2</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Step 2 · 异常检测算法</h2>
              <p className="text-gray-600 text-sm">实现 Z-Score 和 IQR 两种方法进行异常值检测，并对比结果</p>
            </div>
          </div>

          <div className="mt-5 bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-purple-900 mb-1">🎯 练习目标</div>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>Z-Score</strong>：计算每个数据点的标准分数，当 |Z| {'>'} 3 时标记为异常</li>
              <li><strong>IQR</strong>：计算 Q1/Q3，使用 Tukey 1.5×IQR 规则确定正常范围</li>
              <li>对比两种方法的差异：它们识别出的异常是否一致？哪个更保守？</li>
              <li>绘制散点图 + 箱线图，可视化地展示异常点</li>
            </ul>
          </div>

          {renderCodeBlock(
            'step2',
            code2,
            setCode2,
            result2,
            setResult2,
            loading2,
            showAnswer2,
            setShowAnswer2,
            answer2,
            placeholder2,
            () => handleRun(code2, setResult2, setLoading2, answer2, setCode2, showAnswer2)
          )}
        </div>

        {/* ============ Step 3 ============ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-orange-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-2xl font-bold w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">3</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Step 3 · 综合分析与业务报告</h2>
              <p className="text-gray-600 text-sm">绘制箱线图展示检测结果，生成异常报告（异常数量、占比、总异常金额），给出业务处理建议</p>
            </div>
          </div>

          <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-orange-900 mb-1">🎯 练习目标</div>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>绘制多视角的箱线图：总体 / 按交易时段分组 / 正常 vs 异常对比</li>
              <li>计算异常交易的关键指标：数量、占比、金额占比、最高/平均异常金额</li>
              <li>输出完整的异常报告：包含异常明细清单</li>
              <li>最重要的一步：<strong>把统计数字翻译成业务可执行的建议</strong></li>
            </ul>
          </div>

          {renderCodeBlock(
            'step3',
            code3,
            setCode3,
            result3,
            setResult3,
            loading3,
            showAnswer3,
            setShowAnswer3,
            answer3,
            placeholder3,
            () => handleRun(code3, setResult3, setLoading3, answer3, setCode3, showAnswer3)
          )}
        </div>

        {/* ============ 课程总结卡片 ============ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-green-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5 flex items-center">
            <span className="mr-3">🎓</span> 本课要点总结
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-green-900 mb-2">你学到的方法</div>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                <li>描述性统计 + 直方图：快速识别数据分布</li>
                <li>3σ 原则：正态分布下的经验阈值</li>
                <li>Z-Score：标准化的异常程度度量</li>
                <li>IQR + 箱线图：鲁棒、可视化的经典方法</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-200">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-bold text-indigo-900 mb-2">下一步扩展方向</div>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                <li>Isolation Forest：高维数据中的孤立森林</li>
                <li>One-Class SVM：单类别支持向量机</li>
                <li>DBSCAN：基于密度的聚类识别异常</li>
                <li>时间序列异常检测（STL + 残差分析）</li>
                <li>AutoEncoder：深度学习异常检测</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============ 课程完成组件 ============ */}
        <div className="mb-8">
          <CourseCompletion
            courseId="anomaly-detection"
            courseTitle="异常值检测"
            badgeIcon="🔍"
            badgeName="异常值侦探"
          />
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;