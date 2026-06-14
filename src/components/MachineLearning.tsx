import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

const step1Placeholder = `# Step 1：使用 pandas 读取客户特征数据并进行探索性分析
# 数据包含：年龄(age)、月消费金额(spend)、购买频次(frequency)

import pandas as pd
import io

csv_data = """age,spend,frequency
23,850,12
35,2300,28
45,5600,45
28,1200,18
52,7800,52
31,1800,22
40,4200,38
25,950,15
38,3200,30
48,6500,48
29,1500,20
42,4800,42
33,2100,25
55,8200,55
27,1100,16
"""

# 在这里编写你的代码：
# 1. 使用 pd.read_csv 读取 CSV 字符串
# 2. 打印数据基本信息（info, describe）
# 3. 打印前几行数据 head()

`;

const step1Answer = `# Step 1：使用 pandas 读取客户特征数据并进行探索性分析
import pandas as pd
import io

csv_data = """age,spend,frequency
23,850,12
35,2300,28
45,5600,45
28,1200,18
52,7800,52
31,1800,22
40,4200,38
25,950,15
38,3200,30
48,6500,48
29,1500,20
42,4800,42
33,2100,25
55,8200,55
27,1100,16
"""

# 读取 CSV 数据
df = pd.read_csv(io.StringIO(csv_data))

print("=" * 50)
print("📊 客户特征数据探索性分析")
print("=" * 50)

print("\n【1】数据前 5 行 (head):")
print(df.head())

print("\n【2】数据形状 (shape):", df.shape)
print("    行数:", len(df), "行")
print("    列数:", len(df.columns), "列")

print("\n【3】数据基本信息 (info):")
print(df.info())

print("\n【4】描述性统计 (describe):")
print(df.describe())

print("\n【5】各列均值:")
print("  平均年龄: {:.1f} 岁".format(df['age'].mean()))
print("  平均月消费: {:.1f} 元".format(df['spend'].mean()))
print("  平均购买频次: {:.1f} 次".format(df['frequency'].mean()))

print("\n【6】年龄范围: {} ~ {} 岁".format(df['age'].min(), df['age'].max()))
print("【7】消费金额范围: {} ~ {} 元".format(df['spend'].min(), df['spend'].max()))
print("\n✅ 数据探索完成！接下来可以进行聚类分析。")
`;

const step2Placeholder = `# Step 2：使用 K-Means 聚类算法对客户进行分群
# 使用 sklearn.cluster.KMeans 和 sklearn.preprocessing.StandardScaler

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd
import io
import numpy as np

csv_data = """age,spend,frequency
23,850,12
35,2300,28
45,5600,45
28,1200,18
52,7800,52
31,1800,22
40,4200,38
25,950,15
38,3200,30
48,6500,48
29,1500,20
42,4800,42
33,2100,25
55,8200,55
27,1100,16
"""

df = pd.read_csv(io.StringIO(csv_data))

# 在这里编写你的代码：
# 1. 使用 StandardScaler 对数据进行标准化
# 2. 使用 KMeans(n_clusters=3, random_state=42) 进行聚类
# 3. 将聚类结果添加到原始 DataFrame 中
# 4. 打印每个群体的统计信息

`;

const step2Answer = `# Step 2：使用 K-Means 聚类算法对客户进行分群
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd
import io
import numpy as np

csv_data = """age,spend,frequency
23,850,12
35,2300,28
45,5600,45
28,1200,18
52,7800,52
31,1800,22
40,4200,38
25,950,15
38,3200,30
48,6500,48
29,1500,20
42,4800,42
33,2100,25
55,8200,55
27,1100,16
"""

df = pd.read_csv(io.StringIO(csv_data))

print("=" * 50)
print("🎯 K-Means 客户分群分析")
print("=" * 50)

# 选择用于聚类的特征
features = ['age', 'spend', 'frequency']
X = df[features].values

print("\n【1】数据标准化 (StandardScaler)")
print("    标准化前 - 各列均值:", np.mean(X, axis=0).round(2))
print("    标准化前 - 各列标准差:", np.std(X, axis=0).round(2))

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("    标准化后 - 各列均值:", np.mean(X_scaled, axis=0).round(4))
print("    标准化后 - 各列标准差:", np.std(X_scaled, axis=0).round(4))

print("\n【2】执行 K-Means 聚类 (n_clusters=3, random_state=42)")
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)

df['cluster'] = labels

print("\n【3】各群体客户数量:")
cluster_counts = df['cluster'].value_counts().sort_index()
for cluster_id, count in cluster_counts.items():
    print(f"    群体 {cluster_id}: {count} 位客户")

print("\n【4】各群体特征统计:")
for cluster_id in sorted(df['cluster'].unique()):
    cluster_data = df[df['cluster'] == cluster_id]
    avg_age = cluster_data['age'].mean()
    avg_spend = cluster_data['spend'].mean()
    avg_freq = cluster_data['frequency'].mean()

    # 根据消费水平命名群体
    if avg_spend > 6000:
        group_name = "👑 VIP高价值客户"
    elif avg_spend > 3000:
        group_name = "💎 活跃中产客户"
    else:
        group_name = "💰 普通新兴客户"

    print(f"\n    【群体 {cluster_id}】{group_name}")
    print(f"      客户数量: {len(cluster_data)} 位")
    print(f"      平均年龄: {avg_age:.1f} 岁")
    print(f"      平均月消费: {avg_spend:.0f} 元")
    print(f"      平均购买频次: {avg_freq:.1f} 次")

print("\n【5】聚类中心 (标准化后):")
for i, center in enumerate(kmeans.cluster_centers_):
    print(f"    群体 {i}: {center.round(4)}")

print("\n【6】聚类中心 (原始特征):")
original_centers = scaler.inverse_transform(kmeans.cluster_centers_)
for i, center in enumerate(original_centers):
    print(f"    群体 {i}: 年龄={center[0]:.1f}, 消费={center[1]:.0f}, 频次={center[2]:.1f}")

print(f"\n【7】模型评估 - Inertia: {kmeans.inertia_:.2f}")
print("    (Inertia 越小，样本越靠近各自的聚类中心)")

print("\n✅ 聚类完成！下一步进行可视化分析。")
`;

const step3Placeholder = `# Step 3：聚类结果可视化与业务解读
# 使用 matplotlib 绘制散点图，展示客户分群结果

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import io
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

csv_data = """age,spend,frequency
23,850,12
35,2300,28
45,5600,45
28,1200,18
52,7800,52
31,1800,22
40,4200,38
25,950,15
38,3200,30
48,6500,48
29,1500,20
42,4800,42
33,2100,25
55,8200,55
27,1100,16
"""

df = pd.read_csv(io.StringIO(csv_data))

# 在这里编写你的代码：
# 1. 对数据进行标准化并执行 K-Means 聚类
# 2. 使用 plt.scatter() 绘制消费金额 vs 购买频次的散点图
# 3. 用不同颜色区分不同聚类
# 4. 添加标题、坐标轴标签和图例
# 5. 调用 plt.show() 显示图表

`;

const step3Answer = `# Step 3：聚类结果可视化与业务解读
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import io
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

csv_data = """age,spend,frequency
23,850,12
35,2300,28
45,5600,45
28,1200,18
52,7800,52
31,1800,22
40,4200,38
25,950,15
38,3200,30
48,6500,48
29,1500,20
42,4800,42
33,2100,25
55,8200,55
27,1100,16
"""

df = pd.read_csv(io.StringIO(csv_data))

print("=" * 50)
print("📈 聚类结果可视化分析")
print("=" * 50)

# 标准化与聚类
features = ['age', 'spend', 'frequency']
X = df[features].values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)
df['cluster'] = labels

print("\n【聚类结果概览】")
for cluster_id in sorted(df['cluster'].unique()):
    cluster_data = df[df['cluster'] == cluster_id]
    avg_spend = cluster_data['spend'].mean()
    if avg_spend > 6000:
        group_name = "👑 VIP高价值客户"
    elif avg_spend > 3000:
        group_name = "💎 活跃中产客户"
    else:
        group_name = "💰 普通新兴客户"
    print(f"  群体 {cluster_id}: {group_name}, {len(cluster_data)} 位客户")

print("\n【业务解读】")
print("  → 群体分析已完成，下方图表展示各群体的分布情况")
print("  → 建议针对不同群体制定差异化营销策略")

# ========== 绘制散点图: 消费金额 vs 购买频次 ==========
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

colors = ['#FF6B6B', '#4ECDC4', '#FFE66D']
markers = ['o', 's', '^']

# 图1: 消费金额 vs 购买频次
for cluster_id in sorted(df['cluster'].unique()):
    cluster_data = df[df['cluster'] == cluster_id]
    axes[0].scatter(
        cluster_data['spend'],
        cluster_data['frequency'],
        c=colors[cluster_id],
        marker=markers[cluster_id],
        s=150,
        alpha=0.8,
        edgecolors='black',
        linewidths=1.5,
        label=f'Cluster {cluster_id}'
    )

axes[0].set_xlabel('Spending Amount (CNY)', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Purchase Frequency', fontsize=12, fontweight='bold')
axes[0].set_title('Customer Segmentation: Spending vs Frequency', fontsize=13, fontweight='bold', pad=12)
axes[0].legend(loc='upper left', fontsize=10, framealpha=0.9)
axes[0].grid(True, alpha=0.3, linestyle='--')
axes[0].spines['top'].set_visible(False)
axes[0].spines['right'].set_visible(False)

# 图2: 年龄 vs 消费金额
for cluster_id in sorted(df['cluster'].unique()):
    cluster_data = df[df['cluster'] == cluster_id]
    axes[1].scatter(
        cluster_data['age'],
        cluster_data['spend'],
        c=colors[cluster_id],
        marker=markers[cluster_id],
        s=150,
        alpha=0.8,
        edgecolors='black',
        linewidths=1.5,
        label=f'Cluster {cluster_id}'
    )

axes[1].set_xlabel('Age (years)', fontsize=12, fontweight='bold')
axes[1].set_ylabel('Spending Amount (CNY)', fontsize=12, fontweight='bold')
axes[1].set_title('Customer Segmentation: Age vs Spending', fontsize=13, fontweight='bold', pad=12)
axes[1].legend(loc='upper left', fontsize=10, framealpha=0.9)
axes[1].grid(True, alpha=0.3, linestyle='--')
axes[1].spines['top'].set_visible(False)
axes[1].spines['right'].set_visible(False)

plt.tight_layout()
plt.show()

print("\n【营销策略建议】")
print("  🎯 VIP客户: 提供专属权益、优先服务、个性化推荐")
print("  🎯 活跃客户: 推出会员计划、增加互动、提升复购")
print("  🎯 普通客户: 开展促销活动、降低首购门槛、引导成长")
`;

interface StepState {
  code: string;
  output: string;
  error: string;
  showAnswer: boolean;
  isRunning: boolean;
  showImage: boolean;
}

const MachineLearning: React.FC = () => {
  const [stage, setStage] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const [step1, setStep1] = useState<StepState>({
    code: step1Placeholder,
    output: '',
    error: '',
    showAnswer: false,
    isRunning: false,
    showImage: false,
  });

  const [step2, setStep2] = useState<StepState>({
    code: step2Placeholder,
    output: '',
    error: '',
    showAnswer: false,
    isRunning: false,
    showImage: false,
  });

  const [step3, setStep3] = useState<StepState>({
    code: step3Placeholder,
    output: '',
    error: '',
    showAnswer: false,
    isRunning: false,
    showImage: false,
  });

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    if (!isPyodideReady()) {
      initPyodide((p: PyodideProgress) => {
        setStage(p.stage);
        setPercent(p.percent);
        if (p.stage === 4 && p.percent >= 100) {
          setIsReady(true);
        }
      }).catch((err: Error) => {
        setLoadError(err.message);
      });
    } else {
      setStage(4);
      setPercent(100);
      setIsReady(true);
    }

    return () => clearInterval(timer);
  }, []);

  const handleRun = async (_stepKey: 'step1' | 'step2' | 'step3', setState: React.Dispatch<React.SetStateAction<StepState>>, code: string) => {
    setState(prev => ({ ...prev, isRunning: true, output: '', error: '', showImage: false }));
    try {
      const result = await runPythonCode(code);
      if (result.success) {
        const hasImg = !!(result.output && result.output.includes('<img'));
        setState(prev => ({
          ...prev,
          isRunning: false,
          output: result.output || '',
          error: '',
          showImage: hasImg,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isRunning: false,
          output: '',
          error: result.error ? `${result.error.type}: ${result.error.message}` : '未知错误',
          showImage: false,
        }));
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        output: '',
        error: `执行异常: ${err.message}`,
        showImage: false,
      }));
    }
  };

  const handleToggleAnswer = (setState: React.Dispatch<React.SetStateAction<StepState>>, current: StepState, answerCode: string, placeholderCode: string) => {
    if (!current.showAnswer) {
      setState(prev => ({ ...prev, code: answerCode, showAnswer: true }));
    } else {
      setState(prev => ({ ...prev, code: placeholderCode, showAnswer: false }));
    }
  };

  const handleReset = (setState: React.Dispatch<React.SetStateAction<StepState>>, placeholderCode: string) => {
    setState({
      code: placeholderCode,
      output: '',
      error: '',
      showAnswer: false,
      isRunning: false,
      showImage: false,
    });
  };

  const renderStep = (
    stepNumber: number,
    title: string,
    description: string,
    state: StepState,
    setState: React.Dispatch<React.SetStateAction<StepState>>,
    placeholder: string,
    answer: string
  ) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-blue-100">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {stepNumber}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      <div className="mb-4">
        <AceEditor
          mode="python"
          theme="monokai"
          value={state.code}
          onChange={(newCode) => setState(prev => ({ ...prev, code: newCode }))}
          name={`ml-editor-step${stepNumber}`}
          editorProps={{ $blockScrolling: true }}
          className="rounded-lg shadow-lg border border-gray-300"
          style={{ height: '380px', width: '100%', fontSize: '14px' }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4,
          }}
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => handleRun(`step${stepNumber}` as any, setState, state.code)}
          disabled={state.isRunning || !isReady}
          className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isRunning ? '⏳ 运行中...' : '▶ 运行代码'}
        </button>
        <button
          onClick={() => handleToggleAnswer(setState, state, answer, placeholder)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
        >
          {state.showAnswer ? '📝 恢复练习代码' : '💡 查看参考答案'}
        </button>
        <button
          onClick={() => handleReset(setState, placeholder)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
        >
          🔄 重置
        </button>
      </div>

      {state.error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 mb-4 whitespace-pre-wrap font-mono text-sm">
          ❌ {state.error}
        </div>
      )}

      {state.output && !state.showImage && (
        <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg">
          {state.output}
        </div>
      )}

      {state.output && state.showImage && (
        <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
          <div dangerouslySetInnerHTML={{ __html: state.output }} />
        </div>
      )}
    </div>
  );

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <PyodideLoader
            stage={stage as any}
            percent={percent}
            error={loadError}
            elapsedSeconds={elapsedSeconds}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero 区域 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 bg-gradient-to-br from-white via-blue-50 to-purple-50 border border-blue-100">
          <div className="text-center">
            <div className="text-7xl md:text-8xl mb-6 inline-block animate-bounce-slow">🤖</div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              机器学习实战课程
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              通过真实客户数据，从数据探索到 K-Means 聚类，再到可视化业务解读，
              三步带你掌握机器学习核心流程，亲手构建完整的客户分群分析系统。
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="px-5 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm md:text-base">
                🐍 Python
              </div>
              <div className="px-5 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm md:text-base">
                📊 Pandas
              </div>
              <div className="px-5 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold text-sm md:text-base">
                🎯 Scikit-learn
              </div>
              <div className="px-5 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm md:text-base">
                📈 Matplotlib
              </div>
            </div>
          </div>
        </div>

        {/* 核心概念板块 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8 border border-purple-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📚</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">核心概念入门</h2>
            <p className="text-gray-600">在动手实践前，先了解机器学习的基础思想和常见陷阱</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 什么是机器学习 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">什么是机器学习？</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                机器学习是让计算机从<strong>数据</strong>中自动学习规律，并用这些规律来做预测或决策的技术。
                不同于传统编程（写死规则），机器学习让程序<strong>自己从数据中发现模式</strong>。
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg text-xs text-gray-600 border border-blue-100">
                <strong className="text-blue-700">经典例子：</strong><br />
                垃圾邮件分类 → 机器从大量邮件中自动识别"垃圾邮件"的特征模式
              </div>
            </div>

            {/* 为什么重要 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-xl font-bold text-purple-900 mb-3">为什么它很重要？</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                在海量数据时代，人工分析和规则编写已无法应对复杂业务场景。
                机器学习能<strong>自动发现隐藏模式</strong>、<strong>处理大规模数据</strong>、
                <strong>随时间持续优化</strong>，是数据驱动决策的核心引擎。
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg text-xs text-gray-600 border border-purple-100">
                <strong className="text-purple-700">典型应用：</strong><br />
                客户分群 · 推荐系统 · 风险评估 · 图像识别 · 自然语言处理
              </div>
            </div>

            {/* 常见误区 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl p-6 border border-red-200 hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-red-900 mb-3">常见误区与陷阱</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong className="text-red-700">过拟合 (Overfitting):</strong>{' '}
                  模型在训练数据上表现极好，但在新数据上完全失灵——把"噪音"当成了"规律"。
                </p>
                <p>
                  <strong className="text-red-700">数据泄露 (Data Leakage):</strong>{' '}
                  训练时使用了未来才会有的信息，导致模型在实际中失效。
                </p>
                <p>
                  <strong className="text-red-700">特征缩放:</strong>{' '}
                  不同特征量纲差异大（如消费金额 vs 频次），会导致算法权重失衡——必须标准化！
                </p>
              </div>
            </div>
          </div>

          {/* 流程图 */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-center text-lg font-bold text-gray-800 mb-5">🔄 机器学习典型工作流</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {['📂 数据收集', '🔍 数据探索', '⚙️ 特征工程', '🧪 模型训练', '📊 结果评估', '💼 业务应用'].map((item, idx, arr) => (
                <React.Fragment key={item}>
                  <div className="px-4 py-3 bg-white rounded-xl shadow-md text-sm md:text-base font-semibold text-gray-700 border border-gray-200">
                    {item}
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="text-2xl text-gray-400 font-bold hidden md:block">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {renderStep(1, 'Step 1：数据读取与探索性分析', '使用 pandas 读取客户特征数据（年龄、消费、频次），探索数据分布、统计特征', step1, setStep1, step1Placeholder, step1Answer)}

        {/* Step 2 */}
        {renderStep(2, 'Step 2：K-Means 聚类算法实现', '使用 sklearn 中的 K-Means 算法对客户进行分群，学习数据标准化和聚类中心解读', step2, setStep2, step2Placeholder, step2Answer)}

        {/* Step 3 */}
        {renderStep(3, 'Step 3：聚类可视化与业务解读', '使用 matplotlib 绘制散点图展示聚类结果，结合业务场景解读客户群体特征并提出营销建议', step3, setStep3, step3Placeholder, step3Answer)}

        {/* 课程完成组件 */}
        <CourseCompletion
          courseId="machine-learning"
          courseTitle="机器学习"
          badgeIcon="🤖"
          badgeName="机器学习新星"
        />
      </div>
    </div>
  );
};

export default MachineLearning;
