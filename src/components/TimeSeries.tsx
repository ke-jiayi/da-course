import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

const SALES_CSV = `month,sales
2023-01,105
2023-02,112
2023-03,135
2023-04,148
2023-05,165
2023-06,188
2023-07,215
2023-08,208
2023-09,185
2023-10,172
2023-11,195
2023-12,248
2024-01,135
2024-02,142
2024-03,168
2024-04,182
2024-05,205
2024-06,228
2024-07,255
2024-08,248
2024-09,225
2024-10,208
2024-11,235
2024-12,295`;

const STEP1_DEFAULT = `# ==========================================
# Step 1 基础：读取数据、可视化与统计
# ==========================================

import pandas as pd
import matplotlib.pyplot as plt

# ===== 1. 从 CSV 字符串读取数据 =====
csv_data = """${SALES_CSV}"""

from io import StringIO
df = pd.read_csv(StringIO(csv_data))
df['month'] = pd.to_datetime(df['month'])
df = df.sort_values('month').reset_index(drop=True)

print("=" * 50)
print("【数据概览】")
print("=" * 50)
print(f"总记录数：{len(df)} 条")
print(f"时间范围：{df['month'].min().strftime('%Y-%m')} ~ {df['month'].max().strftime('%Y-%m')}")
print()
print("前 6 条记录：")
print(df.head(6).to_string(index=False))
print()

# ===== 2. 绘制时序图 =====
print("=" * 50)
print("【时序图 Time Series Plot】")
print("=" * 50)

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(df['month'], df['sales'], marker='o', linewidth=2,
        color='#2563eb', markerfacecolor='#60a5fa')
ax.set_title('Monthly Sales Trend', fontsize=14)
ax.set_xlabel('Month', fontsize=12)
ax.set_ylabel('Sales (10,000 CNY)', fontsize=12)
ax.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()
print("图表已生成，请查看下方图片。")
print()

# ===== 3. 基础统计描述 =====
print("=" * 50)
print("【基础统计描述】")
print("=" * 50)

stats = df['sales'].describe()
print(f"总销售额: {df['sales'].sum():,.0f} 万元")
print(f"平均月销售额: {stats['mean']:.1f} 万元")
print(f"销售额中位数: {df['sales'].median():.1f} 万元")
print(f"最低销售额: {stats['min']:.1f} 万元 ({df.loc[df['sales'].idxmin(), 'month'].strftime('%Y-%m')})")
print(f"最高销售额: {stats['max']:.1f} 万元 ({df.loc[df['sales'].idxmax(), 'month'].strftime('%Y-%m')})")
print(f"标准差: {stats['std']:.1f} 万元")
print(f"25% 分位数: {df['sales'].quantile(0.25):.1f} 万元")
print(f"75% 分位数: {df['sales'].quantile(0.75):.1f} 万元")
print()

# ===== 4. 按年份汇总 =====
print("=" * 50)
print("【按年份汇总】")
print("=" * 50)
df['year'] = df['month'].dt.year
yearly = df.groupby('year')['sales'].agg(['sum', 'mean', 'max', 'min'])
yearly.columns = ['总销售额', '平均', '最高', '最低']
print(yearly.to_string(float_format="%.1f"))
print()
print("✓ Step 1 完成！")
`;

const STEP1_ANSWER = STEP1_DEFAULT;

const STEP2_DEFAULT = `# ==========================================
# Step 2 进阶：移动平均、指数平滑、趋势分解
# ==========================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from io import StringIO

# ===== 读取数据 =====
csv_data = """${SALES_CSV}"""
df = pd.read_csv(StringIO(csv_data))
df['month'] = pd.to_datetime(df['month'])
df = df.sort_values('month').reset_index(drop=True)

print("=" * 50)
print("【移动平均 Moving Average】")
print("=" * 50)

# TODO: 请在下方代码区域完成练习
# 1. 计算 3 个月移动平均 MA3
# 2. 计算 6 个月移动平均 MA6
# 3. 绘制原始数据与 MA3、MA6 对比图

df['MA3'] = df['sales'].rolling(window=3).mean()
df['MA6'] = df['sales'].rolling(window=6).mean()

print("移动平均结果（后 12 个月）：")
print(df[['month', 'sales', 'MA3', 'MA6']].tail(12).to_string(
    float_format="%.1f", index=False))
print()

# ===== 绘制移动平均对比图 =====
fig, ax = plt.subplots(figsize=(11, 6))
ax.plot(df['month'], df['sales'], marker='o', linewidth=2,
        label='Original', color='#2563eb', alpha=0.7)
ax.plot(df['month'], df['MA3'], linewidth=2, label='MA(3)', color='#f59e0b')
ax.plot(df['month'], df['MA6'], linewidth=2, label='MA(6)', color='#10b981')
ax.set_title('Sales Moving Average', fontsize=14)
ax.set_xlabel('Month')
ax.set_ylabel('Sales')
ax.legend()
ax.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()
print("移动平均对比图已生成。")
print()

# ===== 简单指数平滑 (Simple Exponential Smoothing) =====
print("=" * 50)
print("【简单指数平滑 SES】")
print("=" * 50)

alpha = 0.3  # 平滑系数
df['SES'] = df['sales'].ewm(alpha=alpha, adjust=False).mean()

print(f"平滑系数 alpha = {alpha}")
print("简单指数平滑结果（后 8 个月）：")
print(df[['month', 'sales', 'SES']].tail(8).to_string(
    float_format="%.1f", index=False))
print()

# 尝试不同 alpha 值
print("不同 alpha 值对比（最后一个月）：")
for a in [0.1, 0.3, 0.5, 0.9]:
    ses_val = df['sales'].ewm(alpha=a, adjust=False).mean().iloc[-1]
    print(f"  alpha={a}: {ses_val:.1f}")
print()

# ===== 趋势分解 =====
print("=" * 50)
print("【趋势分解 Trend Decomposition】")
print("=" * 50)

# 使用线性回归提取趋势
x = np.arange(len(df))
y = df['sales'].values

# 手动计算线性回归 (y = a + b*x)
n = len(x)
b = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / (n * np.sum(x ** 2) - (np.sum(x)) ** 2)
a = (np.sum(y) - b * np.sum(x)) / n

df['trend'] = a + b * x
df['residual'] = df['sales'] - df['trend']

print(f"趋势线方程：Sales = {a:.2f} + {b:.2f} * t")
print(f"斜率 b = {b:.2f}（每月平均增长 {b:.2f} 万元")
print()

# 绘制分解图
fig, axes = plt.subplots(3, 1, figsize=(11, 9))

axes[0].plot(df['month'], df['sales'], color='#2563eb', linewidth=2)
axes[0].set_title('Original Data (Observed)', fontsize=12)
axes[0].grid(True, alpha=0.3)

axes[1].plot(df['month'], df['trend'], color='#f59e0b', linewidth=2)
axes[1].set_title(f'Trend (Linear Regression)', fontsize=12)
axes[1].grid(True, alpha=0.3)

axes[2].plot(df['month'], df['residual'], color='#10b981', linewidth=2,
           marker='o', markersize=3)
axes[2].axhline(y=0, color='gray', linestyle='--', alpha=0.5)
axes[2].set_title('Residual (Random Component)', fontsize=12)
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
print("趋势分解图已生成。")
print()

# ===== 季节性分析 =====
print("=" * 50)
print("【季节性分析】")
print("=" * 50)

df['month_num'] = df['month'].dt.month
seasonal = df.groupby('month_num')['sales'].mean()
print("各月平均销售额：")
for m in range(1, 13):
    avg = seasonal[m]
    deviation = avg - df['sales'].mean()
    print(f"  {m:02d}月: {avg:.1f} 万元 (偏离均值 {deviation:+.1f})")
print()
print(f"最高销售月份: {seasonal.idxmax():02d}月")
print(f"最低销售月份: {seasonal.idxmin():02d}月")
print()

print("✓ Step 2 完成！")
`;

const STEP2_ANSWER = STEP2_DEFAULT;

const STEP3_DEFAULT = `# ==========================================
# Step 3 挑战：线性回归预测与误差评估
# ==========================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from io import StringIO

# ===== 读取数据 =====
csv_data = """${SALES_CSV}"""
df = pd.read_csv(StringIO(csv_data))
df['month'] = pd.to_datetime(df['month'])
df = df.sort_values('month').reset_index(drop=True)
df['t'] = np.arange(len(df))  # 时间索引

print("=" * 50)
print("【线性回归预测模型】")
print("=" * 50)

# ===== 1. 使用线性回归模型 =====
# y = a + b * t
n = len(df)
x = df['t'].values
y = df['sales'].values

b = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / (n * np.sum(x ** 2) - (np.sum(x)) ** 2)
a = (np.sum(y) - b * np.sum(x)) / n

df['prediction'] = a + b * df['t']

print(f"回归方程: Sales = {a:.2f} + {b:.2f} * t")
print(f"截距 a = {a:.2f}")
print(f"斜率 b = {b:.2f}")
print()

# ===== 2. 计算拟合优度 R² =====
ss_res = np.sum((y - df['prediction']) ** 2)
ss_tot = np.sum((y - np.mean(y)) ** 2)
r_squared = 1 - (ss_res / ss_tot)
print(f"拟合优度 R² = {r_squared:.4f}")
print(f"R² 越接近 1，拟合越好。")
print()

# ===== 3. 评估预测误差 =====
print("=" * 50)
print("【预测误差评估】")
print("=" * 50)

df['error'] = df['sales'] - df['prediction']
df['abs_error'] = np.abs(df['error'])
df['pct_error'] = df['abs_error'] / df['sales'] * 100

mae = df['abs_error'].mean()
mape = df['pct_error'].mean()
rmse = np.sqrt((df['error'] ** 2).mean())

print(f"MAE  (Mean Absolute Error) 平均绝对误差: {mae:.2f} 万元")
print(f"MAPE (Mean Absolute Percentage Error) 平均绝对百分比误差: {mape:.2f}%")
print(f"RMSE (Root Mean Squared Error) 均方根误差: {rmse:.2f} 万元")
print()
print("近 6 个月的实际 vs 预测 vs 误差 (后 6 个月):")
print(df[['month', 'sales', 'prediction', 'error']].tail(6).to_string(
    float_format="%.1f", index=False))
print()

# ===== 4. 预测未来 6 个月 =====
print("=" * 50)
print("【未来 6 个月销量预测】")
print("=" * 50)

future_months = []
future_t = []
future_pred = []

last_t = df['t'].iloc[-1]
last_date = df['month'].iloc[-1]

for i in range(1, 7):
    new_t = last_t + i
    new_date = last_date + pd.DateOffset(months=i)
    pred = a + b * new_t
    future_months.append(new_date)
    future_t.append(new_t)
    future_pred.append(pred)

future_df = pd.DataFrame({
    'month': future_months,
    't': future_t,
    'predicted_sales': future_pred
})

print(future_df.to_string(float_format="%.1f", index=False))
print()
print(f"未来 6 个月预测总销售额: {sum(future_pred):.1f} 万元")
print(f"月均预测销售额: {np.mean(future_pred):.1f} 万元")
print()

# ===== 5. 生成预测图表 =====
print("=" * 50)
print("【预测图表】")
print("=" * 50)

fig, ax = plt.subplots(figsize=(12, 6))

# 历史数据
ax.plot(df['month'], df['sales'], marker='o', linewidth=2,
        color='#2563eb', label='Actual (Historical)', zorder=3)

# 历史拟合
ax.plot(df['month'], df['prediction'], linewidth=2, linestyle='--',
        color='#f59e0b', label='Fitted Values', alpha=0.7)

# 未来预测
ax.plot(future_df['month'], future_df['predicted_sales'],
        marker='s', linewidth=2, color='#ef4444',
        label='Predicted (Future)', zorder=3)

# 置信区间 (简单估计：±2*MAE)
confidence = 2 * mae
ax.fill_between(future_df['month'],
                [p - confidence for p in future_pred],
                [p + confidence for p in future_pred],
                color='#ef4444', alpha=0.15,
                label=f'Confidence Interval (±{confidence:.0f})')

ax.set_title('Sales Forecast with Linear Regression', fontsize=14, fontweight='bold')
ax.set_xlabel('Month', fontsize=12)
ax.set_ylabel('Sales (10,000 CNY)', fontsize=12)
ax.legend(loc='upper left', fontsize=11)
ax.grid(True, alpha=0.3, linestyle=':')
plt.xticks(rotation=45)
plt.tight_layout()
print("预测图表已生成。红色虚线区域为置信区间。")
print()

# ===== 6. 误差分布图 =====
fig2, ax2 = plt.subplots(figsize=(10, 5))
ax2.bar(range(len(df)), df['error'].values, color='#2563eb', alpha=0.7, edgecolor='white')
ax2.axhline(y=0, color='red', linestyle='--', linewidth=1.5)
ax2.set_title('Prediction Errors by Month', fontsize=13)
ax2.set_xlabel('Time Index (t)')
ax2.set_ylabel('Error (Actual - Predicted)')
ax2.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
print("误差分布图已生成。")
print()

print("✓ Step 3 完成！恭喜你完成了完整的时间序列分析之旅！")
`;

const STEP3_ANSWER = STEP3_DEFAULT;

type PythonExecutionResult = {
  success: boolean;
  output?: string;
  stdout: string;
  stderr: string;
  error?: { type: string; message: string };
};

const TimeSeries: React.FC = () => {
  const [pyodideStage, setPyodideStage] = useState<number>(0);
  const [pyodidePercent, setPyodidePercent] = useState<number>(0);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [isPyodideInit, setIsPyodideInit] = useState<boolean>(false);

  const [code1, setCode1] = useState<string>(STEP1_DEFAULT);
  const [code2, setCode2] = useState<string>(STEP2_DEFAULT);
  const [code3, setCode3] = useState<string>(STEP3_DEFAULT);

  const [result1, setResult1] = useState<PythonExecutionResult | null>(null);
  const [result2, setResult2] = useState<PythonExecutionResult | null>(null);
  const [result3, setResult3] = useState<PythonExecutionResult | null>(null);

  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [loading3, setLoading3] = useState<boolean>(false);

  const [showAnswer1, setShowAnswer1] = useState<boolean>(false);
  const [showAnswer2, setShowAnswer2] = useState<boolean>(false);
  const [showAnswer3, setShowAnswer3] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      if (isPyodideReady()) {
        setIsPyodideInit(true);
        setPyodideStage(4);
        setPyodidePercent(100);
        return;
      }
      try {
        await initPyodide((p: PyodideProgress) => {
          setPyodideStage(p.stage);
          setPyodidePercent(p.percent);
        });
        setIsPyodideInit(true);
      } catch (err: any) {
        setPyodideError(err?.message || 'Pyodide 初始化失败');
      }
    };
    init();
  }, []);

  const handleRun = async (
    code: string,
    setResult: (r: PythonExecutionResult | null) => void,
    setLoading: (b: boolean) => void
  ) => {
    if (!code.trim()) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: { type: 'InputError', message: '请输入代码后再运行' }
      });
      return;
    }
    if (!isPyodideInit) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: { type: 'SystemError', message: 'Python 环境尚未准备好，请稍候...' }
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await runPythonCode(code);
      setResult(r as PythonExecutionResult);
    } catch (err: any) {
      setResult({
        success: false,
        stdout: '',
        stderr: '',
        error: { type: 'ExecutionError', message: (err as Error).message }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderOutput = (result: PythonExecutionResult | null) => {
    if (!result) {
      return (
        <div className="text-gray-400 flex items-center justify-center py-8">
          <span>点击"运行代码"查看输出</span>
        </div>
      );
    }
    if (!result.success) {
      return (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100">
          <div className="font-semibold text-red-300 mb-2">
            ⚠️ {result.error?.type || '错误'}
          </div>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {result.error?.message}
          </div>
          {result.stderr && (
            <div className="mt-2 text-xs text-red-200 border-t border-red-800 pt-2">
              <details>
                <summary className="cursor-pointer">详细输出</summary>
                <pre className="mt-1 whitespace-pre-wrap">{result.stderr}</pre>
              </details>
            </div>
          )}
        </div>
      );
    }
    return (
      <div
        className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg"
        dangerouslySetInnerHTML={{ __html: result.output || result.stdout || '代码执行完成（无输出）' }}
      />
    );
  };

  const renderEditor = (
    code: string,
    setCode: (s: string) => void,
    loading: boolean,
    result: PythonExecutionResult | null,
    showAnswer: boolean,
    setShowAnswer: (b: boolean) => void,
    defaultCode: string,
    _answerCode: string,
    handleRunFn: () => void,
    title: string
  ) => {
    return (
      <div className="space-y-4">
        <AceEditor
          mode="python"
          theme="monokai"
          value={code}
          onChange={setCode}
          name={`ts-editor-${title}`}
          editorProps={{ $blockScrolling: true }}
          className="rounded-lg shadow-md"
          setOptions={{
            fontSize: 13,
            showLineNumbers: true,
            tabSize: 4,
          }}
          style={{ height: '420px', width: '100%' }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunFn}
            disabled={loading || !isPyodideInit}
            className={`bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all ${
            loading || !isPyodideInit ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          >
            {loading ? '⏳ 运行中...' : '▶ 运行代码'}
          </button>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
          >
            {showAnswer ? '隐藏参考答案' : '💡 参考答案'}
          </button>
          <button
            onClick={() => {
              setCode(defaultCode);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
          >
            🔄 重置
          </button>
        </div>
        {showAnswer && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-800 font-semibold mb-2">💡 参考答案提示</div>
            <div className="text-yellow-700 text-sm whitespace-pre-wrap">
              此步骤的完整代码已预填在编辑器中。你可以点击"重置"按钮恢复初始状态，或自行修改代码进行实验。
              <br />
              <strong>重点学习：</strong>
              {title === 'Step 1' && (
                <>
                  <br />• 理解 pandas 读取 CSV、describe() 统计描述
                  <br />• matplotlib 绘制时序图的基本语法
                  <br />• 数据清洗与排序
                </>
              )}
              {title === 'Step 2' && (
                <>
                  <br />• rolling(window=N).mean() 计算移动平均
                  <br />• ewm(alpha=α) 指数平滑
                  <br />• 线性回归提取趋势
                </>
              )}
              {title === 'Step 3' && (
                <>
                  <br />• MAE、MAPE、RMSE 的计算
                  <br />• 线性回归预测未来值
                  <br />• 预测图表与置信区间
                </>
              )}
            </div>
            <button
              onClick={() => {
              }}
              className="mt-3 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-all"
            >
              📖 查看完整答案代码
            </button>
          </div>
        )}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-950 px-4 py-2 text-gray-400 text-sm flex items-center justify-between">
            <span>📊 输出结果</span>
            {result?.success && <span className="text-green-500">✓ 执行成功</span>}
          </div>
          <div className="p-4">{renderOutput(result)}</div>
        </div>
      </div>
    );
  };

  if (pyodideStage < 4 && !pyodideError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📉</div>
            <h1 className="text-3xl font-bold text-gray-800">时间序列分析</h1>
            <p className="text-gray-600 mt-2">从数据到预测的完整之旅</p>
          </div>
          <PyodideLoader
            stage={pyodideStage as 0 | 1 | 2 | 3 | 4}
            percent={pyodidePercent}
            error={pyodideError}
            elapsedSeconds={0}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero 区域 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10 text-center">
          <div className="text-7xl md:text-8xl mb-6 animate-bounce-slow">📉</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            时间序列分析
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            从原始销售数据出发，一步步掌握趋势分析、移动平均、指数平滑，
            并使用线性回归进行未来预测，完整实战之旅！
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              📊 24 个月数据
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              🐍 Python 实战
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              🎯 三步递进
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 text-[200px]">📈</div>
      </div>

      {/* 核心概念板块 */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
          🧠 核心概念
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-start mb-4">
              <div className="text-4xl mr-3">📈</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  什么是时间序列？
                </h3>
                <p className="text-gray-600 text-sm">
                  时间序列是按时间顺序记录的一系列数据点。
                  它可以揭示数据随时间变化的规律，常用于销售预测、股票分析、气象预测等领域。
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
              <strong>常见组成：</strong>
              <br />
              趋势 (Trend) + 季节性 (Seasonal) + 随机性 (Random)
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-start mb-4">
              <div className="text-4xl mr-3">🔄</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  趋势 / 季节性 / 随机性分解
                </h3>
                <p className="text-gray-600 text-sm">
                  将时间序列数据分解为三个主要成分：长期趋势（上升/下降）、
                  季节性波动（周期性重复模式）和随机噪声（不可预测的波动）。
                </p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
              <strong>经典公式：</strong>
              <br />
              Y(t) = T(t) + S(t) + R(t)
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-start mb-4">
              <div className="text-4xl mr-3">📊</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  移动平均法 (Moving Average)
                </h3>
                <p className="text-gray-600 text-sm">
                  通过计算连续 N 个数据点的平均值来平滑时间序列中的随机波动，
                  从而更清晰地显示长期趋势。
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
              <strong>公式：</strong>
              <br />
              MA(n) = (xₜ + xₜ₋₁ + ... + xₜ₋ₙ₊₁) / n
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-start mb-4">
              <div className="text-4xl mr-3">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  简单预测模型
                </h3>
                <p className="text-gray-600 text-sm">
                  基于历史数据建立数学模型（如线性回归），
                  并使用误差指标（MAE、MAPE）评估预测质量，用于未来值的预测。
                </p>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800">
              <strong>核心指标：</strong>
              <br />
              MAE = 平均绝对误差 | MAPE = 平均绝对百分比误差
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <div className="mb-10 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 md:p-8">
          <div className="flex items-center">
            <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl mr-4 shadow-lg">
              1
            </div>
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold">
                Step 1 · 基础入门
              </h2>
              <p className="text-blue-100 text-sm md:text-base">
                读取月度销售数据，绘制时序图，做基础统计描述
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">📌 学习目标</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>学会使用 pandas 从 CSV 字符串读取数据</li>
              <li>掌握 matplotlib 绘制时间序列折线图</li>
              <li>计算并解读 describe() 统计描述</li>
              <li>按年份聚合分析数据</li>
            </ul>
          </div>
          {renderEditor(
            code1,
            setCode1,
            loading1,
            result1,
            showAnswer1,
            setShowAnswer1,
            STEP1_DEFAULT,
            STEP1_ANSWER,
            () => handleRun(code1, setResult1, setLoading1),
            'Step 1'
          )}
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-10 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 md:p-8">
          <div className="flex items-center">
            <div className="bg-white text-green-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl mr-4 shadow-lg">
              2
            </div>
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold">
                Step 2 · 进阶分析
              </h2>
              <p className="text-green-100 text-sm md:text-base">
                移动平均（MA）、简单指数平滑、趋势分解
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <h4 className="font-bold text-green-900 mb-2">📌 学习目标</h4>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>使用 rolling().mean() 计算移动平均 MA(3)、MA(6)</li>
              <li>掌握简单指数平滑 SES (ewm 方法)</li>
              <li>用线性回归提取趋势成分</li>
              <li>分析季节性波动规律</li>
            </ul>
          </div>
          {renderEditor(
            code2,
            setCode2,
            loading2,
            result2,
            showAnswer2,
            setShowAnswer2,
            STEP2_DEFAULT,
            STEP2_ANSWER,
            () => handleRun(code2, setResult2, setLoading2),
            'Step 2'
          )}
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-10 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 md:p-8">
        <div className="flex items-center">
            <div className="bg-white text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl mr-4 shadow-lg">
              3
            </div>
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold">
                Step 3 · 挑战预测
              </h2>
              <p className="text-red-100 text-sm md:text-base">
                使用线性回归预测未来销量，评估预测误差，并生成预测图表
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
            <h4 className="font-bold text-red-900 mb-2">📌 学习目标</h4>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>手动实现线性回归（最小二乘法）</li>
              <li>计算 MAE、MAPE、RMSE 评估预测误差</li>
              <li>预测未来 6 个月的销量</li>
              <li>绘制精美的预测对比图与误差分析图</li>
            </ul>
          </div>
          {renderEditor(
            code3,
            setCode3,
            loading3,
            result3,
            showAnswer3,
            setShowAnswer3,
            STEP3_DEFAULT,
            STEP3_ANSWER,
            () => handleRun(code3, setResult3, setLoading3),
            'Step 3'
          )}
        </div>
      </div>

      {/* 课程总结 */}
      <div className="mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg p-8 border border-indigo-200">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-indigo-800">
          🎓 你学到了什么？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="font-bold text-gray-800 mb-2">数据处理</h4>
            <p className="text-sm text-gray-600">pandas 读取、清洗、时间索引</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-3">📈</div>
            <h4 className="font-bold text-gray-800 mb-2">可视化分析</h4>
            <p className="text-sm text-gray-600">matplotlib 多图联动</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-gray-800 mb-2">预测建模</h4>
            <p className="text-sm text-gray-600">移动平均、线性回归预测</p>
          </div>
        </div>
      </div>

      {/* CourseCompletion */}
      <CourseCompletion
        courseId="time-series"
        courseTitle="时间序列分析"
        badgeIcon="📉"
        badgeName="时间序列大师"
      />
      </div>
    </div>
  );
};

export default TimeSeries;
