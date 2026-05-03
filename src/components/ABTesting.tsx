import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, initPyodide } from '../services/pyodideService';

const ABTesting: React.FC = () => {
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

  const placeholderCode = `# 在这里编写你的A/B测试代码
# 点击"显示参考答案"按钮可以查看示例代码

# 提示：
# 1. 定义对照组和实验组的数据
# 2. 计算转化率
# 3. 进行统计检验
# 4. 输出分析结论

`;

  const answerCodeProject1 = `# A/B测试基础概念练习
import math

print("=" * 50)
print("A/B测试基础概念")
print("=" * 50)

# 1. 假设检验基础
print("\\n【1. 假设检验】")
print("原假设(H0): 实验组与对照组没有显著差异")
print("备择假设(H1): 实验组与对照组存在显著差异")

# 2. 实验数据
print("\\n【2. 实验数据】")
control_visitors = 5000
control_conversions = 150
treatment_visitors = 5000
treatment_conversions = 180

print(f"对照组: {control_visitors} 访问, {control_conversions} 转化")
print(f"实验组: {treatment_visitors} 访问, {treatment_conversions} 转化")

# 3. 计算转化率
print("\\n【3. 转化率计算】")
control_rate = control_conversions / control_visitors
treatment_rate = treatment_conversions / treatment_visitors

print(f"对照组转化率: {control_rate*100:.2f}%")
print(f"实验组转化率: {treatment_rate*100:.2f}%")

# 4. 显著性水平与P值
print("\\n【4. 显著性检验】")
print("显著性水平(α): 通常设为 0.05 (5%)")
print("置信水平: 1 - α = 0.95 (95%)")

# 5. 计算Z分数
se_control = math.sqrt(control_rate * (1 - control_rate) / control_visitors)
se_treatment = math.sqrt(treatment_rate * (1 - treatment_rate) / treatment_visitors)
se_diff = math.sqrt(se_control**2 + se_treatment**2)
z_score = (treatment_rate - control_rate) / se_diff

print(f"Z分数: {z_score:.4f}")
print(f"判断: |Z| = {abs(z_score):.4f} {'>' if abs(z_score) > 1.96 else '<'} 1.96")
print(f"结论: 差异{'统计显著' if abs(z_score) > 1.96 else '不显著'}")

print("\\n✓ 基础概念练习完成！")`;

  const answerCodeProject2 = `# A/B测试实战案例：网站改版
import math

print("=" * 50)
print("网站改版测试实战案例")
print("=" * 50)

# 1. 实验背景
print("\\n【实验背景】")
print("目标: 测试新的"立即购买"按钮颜色是否能提高转化率")
print("指标: 点击"立即购买"按钮的用户比例")

# 2. 数据收集
print("\\n【实验数据】")
data = {
    "A组(原版-红色按钮)": {"visitors": 10000, "conversions": 320},
    "B组(新版-绿色按钮)": {"visitors": 10000, "conversions": 385}
}

for group, stats in data.items():
    print(f"{group}:")
    print(f"  访问量: {stats['visitors']}")
    print(f"  转化数: {stats['conversions']}")

# 3. 计算转化率
print("\\n【转化率分析】")
a_visitors = data["A组(原版-红色按钮)"]["visitors"]
a_conversions = data["A组(原版-红色按钮)"]["conversions"]
b_visitors = data["B组(新版-绿色按钮)"]["visitors"]
b_conversions = data["B组(新版-绿色按钮)"]["conversions"]

a_rate = a_conversions / a_visitors
b_rate = b_conversions / b_visitors

print(f"A组转化率: {a_rate*100:.2f}%")
print(f"B组转化率: {b_rate*100:.2f}%")

# 4. 计算提升
print("\\n【效果评估】")
absolute_diff = b_rate - a_rate
relative_lift = (b_rate - a_rate) / a_rate * 100
print(f"绝对提升: {absolute_diff*100:.2f}%")
print(f"相对提升: {relative_lift:.1f}%")

# 5. 统计检验
print("\\n【统计显著性检验】")
se_a = math.sqrt(a_rate * (1 - a_rate) / a_visitors)
se_b = math.sqrt(b_rate * (1 - b_rate) / b_visitors)
se_diff = math.sqrt(se_a**2 + se_b**2)
z_score = (b_rate - a_rate) / se_diff

# 计算95%置信区间
margin_of_error = 1.96 * se_diff
ci_lower = (b_rate - a_rate) - margin_of_error
ci_upper = (b_rate - a_rate) + margin_of_error

print(f"Z分数: {z_score:.4f}")
print(f"95%置信区间: [{ci_lower*100:.2f}%, {ci_upper*100:.2f}%]")
print(f"显著性判断: {'显著' if abs(z_score) > 1.96 else '不显著'}")

# 6. 结论
print("\\n【最终结论】")
if z_score > 1.96 and ci_lower > 0:
    print("✓ 推荐上线绿色按钮版本")
    print("  理由: 转化率显著提升，效果可落地")
elif z_score < -1.96:
    print("✗ 保持原版红色按钮")
    print("  理由: 新版本转化率反而下降")
else:
    print("? 需要更多数据再做判断")
    print("  理由: 当前差异不具统计显著性")

print("\\n✓ 实战案例分析完成！")`;

  const answerCodeProject3 = `# A/B测试高级技巧：样本量与功效分析
import math
from scipy import stats

print("=" * 50)
print("高级技巧：样本量计算与功效分析")
print("=" * 50)

# 1. 功效分析基础
print("\\n【1. 功效分析概念】")
print("统计功效(Power): 当真实存在差异时，正确检测到的概率")
print("通常设定: Power = 0.8 (80%)")
print("显著性水平: α = 0.05 (5%)")

# 2. 样本量计算
print("\\n【2. 样本量计算】")
baseline_rate = 0.03
minimum_detectable_effect = 0.20
alpha = 0.05
power = 0.80

p1 = baseline_rate
p2 = baseline_rate * (1 + minimum_detectable_effect)

p_avg = (p1 + p2) / 2
z_alpha = stats.norm.ppf(1 - alpha / 2)
z_beta = stats.norm.ppf(power)

se_pooled = math.sqrt(2 * p_avg * (1 - p_avg))
se_diff = math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))

delta = abs(p2 - p1)

n_per_group = ((z_alpha * se_pooled + z_beta * se_diff) / delta) ** 2

print(f"基准转化率: {baseline_rate*100:.1f}%")
print(f"最小可检测提升: {minimum_detectable_effect*100:.0f}%")
print(f"目标转化率: {p2*100:.1f}%")
print(f"每组所需样本量: {int(n_per_group):,}")

# 3. 置信区间详解
print("\\n【3. 置信区间解读】")
sample_size = 10000
observed_rate_a = 0.032
observed_rate_b = 0.038

se_a = math.sqrt(observed_rate_a * (1 - observed_rate_a) / sample_size)
se_b = math.sqrt(observed_rate_b * (1 - observed_rate_b) / sample_size)

diff = observed_rate_b - observed_rate_a
se_diff = math.sqrt(se_a**2 + se_b**2)

ci_95_lower = diff - 1.96 * se_diff
ci_95_upper = diff + 1.96 * se_diff

ci_99_lower = diff - 2.576 * se_diff
ci_99_upper = diff + 2.576 * se_diff

print(f"转化率差异: {diff*100:.2f}%")
print(f"95%置信区间: [{ci_95_lower*100:.2f}%, {ci_95_upper*100:.2f}%]")
print(f"99%置信区间: [{ci_99_lower*100:.2f}%, {ci_99_upper*100:.2f}%]")

# 4. 多重比较校正
print("\\n【4. 多重比较问题】")
n_comparisons = 5
bonferroni_alpha = alpha / n_comparisons
print(f"比较次数: {n_comparisons}")
print(f"Bonferroni校正后α: {bonferroni_alpha:.4f}")
print(f"原始α: {alpha:.2f}")
print("注意: 比较次数越多，出现假阳性的概率越大")

# 5. 效应量
print("\\n【5. 效应量(Cohen's h)】")
import numpy as np
def cohens_h(p1, p2):
    return 2 * (np.arcsin(np.sqrt(p2)) - np.arcsin(np.sqrt(p1)))

effect_size = cohens_h(observed_rate_a, observed_rate_b)
print(f"效应量: {effect_size:.4f}")
print("解读: 小效应(0.2) | 中等效应(0.5) | 大效应(0.8)")

print("\\n✓ 高级技巧练习完成！")`;

  const projects = [
    {
      id: 1,
      title: '基础概念',
      description: '学习假设检验、显著性水平、P值等核心概念'
    },
    {
      id: 2,
      title: '实战案例：网站改版测试',
      description: '通过真实案例学习A/B测试的完整分析流程'
    },
    {
      id: 3,
      title: '高级技巧',
      description: '掌握样本量计算、功效分析和多重比较校正'
    }
  ];

  const getAnswerCode = () => {
    switch (activeProject) {
      case 0: return answerCodeProject1;
      case 1: return answerCodeProject2;
      case 2: return answerCodeProject3;
      default: return answerCodeProject1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-sky-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary">Python编程 A/B测试分析</h1>
            <p className="text-text">掌握A/B测试的设计与分析方法，做出数据驱动的决策</p>
          </div>

          {pyodideStatus === 'loading' && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                <div>
                  <p className="font-semibold text-cyan-800">正在初始化 Python 环境...</p>
                  <p className="text-sm text-cyan-600">首次加载需要下载必要的库，请耐心等待</p>
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
                      ? 'text-cyan-100'
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
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">理解A/B测试的基本原理和流程</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">掌握统计显著性的判断方法</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">学会计算置信区间和功效分析</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text text-sm">能够解读和应用测试结果</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">💡 知识要点</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {activeProject === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 假设检验基础</h3>
                    <p className="text-text mb-3">假设检验是A/B测试的统计基础，通过样本数据判断两个版本是否存在显著差异。</p>
                    
                    <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-cyan-800 mb-2">💡 核心概念</p>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• <strong>原假设(H₀)</strong>：实验组与对照组无差异</li>
                        <li>• <strong>备择假设(H₁)</strong>：实验组与对照组存在差异</li>
                        <li>• <strong>显著性水平(α)</strong>：通常设为0.05（5%）</li>
                        <li>• <strong>P值</strong>：假设H₀为真时，观察到当前结果的概率</li>
                      </ul>
                    </div>

                    <div className="overflow-x-auto">
                      <p className="text-sm font-medium text-gray-700 mb-2">示例数据：按钮颜色测试</p>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">组别</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">样本量</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">转化数</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">转化率</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">A组(红色按钮)</td>
                            <td className="border border-gray-300 px-4 py-2">5,000</td>
                            <td className="border border-gray-300 px-4 py-2">150</td>
                            <td className="border border-gray-300 px-4 py-2">3.00%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">B组(蓝色按钮)</td>
                            <td className="border border-gray-300 px-4 py-2">5,000</td>
                            <td className="border border-gray-300 px-4 py-2">180</td>
                            <td className="border border-gray-300 px-4 py-2">3.60%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">✅ 判断标准</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• P值 &lt; 0.05：拒绝原假设，差异显著</li>
                        <li>• P值 ≥ 0.05：无法拒绝原假设，差异不显著</li>
                        <li>• Z分数绝对值 &gt; 1.96 等价于 P值 &lt; 0.05</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📊 网站改版测试实战</h3>
                    <p className="text-text mb-3">通过一个完整的网站改版案例，学习A/B测试的完整分析流程和结果解读。</p>
                    
                    <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-cyan-800 mb-2">💡 案例背景</p>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• <strong>业务场景</strong>：电商网站测试新的"立即购买"按钮</li>
                        <li>• <strong>实验设计</strong>：A组(红色) vs B组(绿色)，各10,000访客</li>
                        <li>• <strong>评估指标</strong>：点击"立即购买"按钮的用户比例</li>
                      </ul>
                    </div>

                    <div className="overflow-x-auto">
                      <p className="text-sm font-medium text-gray-700 mb-2">实验数据汇总</p>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">指标</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">A组(对照组)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">B组(实验组)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">差异</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">访问量</td>
                            <td className="border border-gray-300 px-4 py-2">10,000</td>
                            <td className="border border-gray-300 px-4 py-2">10,000</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">转化数</td>
                            <td className="border border-gray-300 px-4 py-2">320</td>
                            <td className="border border-gray-300 px-4 py-2">385</td>
                            <td className="border border-gray-300 px-4 py-2">+65</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">转化率</td>
                            <td className="border border-gray-300 px-4 py-2">3.20%</td>
                            <td className="border border-gray-300 px-4 py-2">3.85%</td>
                            <td className="border border-gray-300 px-4 py-2">+0.65%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Z分数</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2">2.21</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">95%置信区间</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2">[0.11%, 1.19%]</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">显著性</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2">-</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">✓ 显著</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">✅ 分析结论</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 绿色按钮版本的转化率提升20.3%</li>
                        <li>• Z分数(2.21) &gt; 1.96，差异具有统计显著性</li>
                        <li>• 95%置信区间不包含0，说明效果真实可靠</li>
                        <li>• <strong>建议：</strong>上线绿色按钮版本</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeProject === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🔬 高级技巧：样本量与功效分析</h3>
                    <p className="text-text mb-3">在实验开始前计算所需的样本量，确保实验能够检测到有意义的差异。</p>
                    
                    <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-cyan-800 mb-2">💡 核心概念</p>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• <strong>统计功效(Power)</strong>：真实存在差异时正确检测到的概率，通常设为80%</li>
                        <li>• <strong>最小可检测效应(MDE)</strong>：实验设计要求能检测到的最小差异</li>
                        <li>• <strong>多重比较校正</strong>：进行多次检验时需要校正显著性水平</li>
                      </ul>
                    </div>

                    <div className="overflow-x-auto">
                      <p className="text-sm font-medium text-gray-700 mb-2">样本量计算参数说明</p>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">参数</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">符号</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">常用值</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">说明</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">显著性水平</td>
                            <td className="border border-gray-300 px-4 py-2">α</td>
                            <td className="border border-gray-300 px-4 py-2">0.05</td>
                            <td className="border border-gray-300 px-4 py-2">Type I error rate</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">统计功效</td>
                            <td className="border border-gray-300 px-4 py-2">1-β</td>
                            <td className="border border-gray-300 px-4 py-2">0.80</td>
                            <td className="border border-gray-300 px-4 py-2">Power = 1 - Type II error</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">基准转化率</td>
                            <td className="border border-gray-300 px-4 py-2">p₁</td>
                            <td className="border border-gray-300 px-4 py-2">3%</td>
                            <td className="border border-gray-300 px-4 py-2">当前版本的转化率</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">最小提升</td>
                            <td className="border border-gray-300 px-4 py-2">MDE</td>
                            <td className="border border-gray-300 px-4 py-2">20%</td>
                            <td className="border border-gray-300 px-4 py-2">相对基准的最小提升</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-2">✅ 效应量解读 (Cohen's h)</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 小效应：h = 0.2（需要较大样本量才能检测）</li>
                        <li>• 中等效应：h = 0.5</li>
                        <li>• 大效应：h = 0.8（较小样本量即可检测）</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-primary">💻 动手练习</h2>
            <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-6">
              <p className="text-text mb-4">在下方编辑器中尝试修改代码，体验A/B测试分析的过程！</p>
              
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code || placeholderCode}
                  onChange={handleCodeChange}
                  name="ab-testing-editor"
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="rounded-lg shadow-md"
                  style={{ height: '350px', width: '100%' }}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
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
                    setCode(getAnswerCode());
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-full font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-all"
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

          <div className="mb-8 bg-purple rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">📊 结果展示区域</h2>
            <div className="bg-white rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-cyan-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-cyan-600 mb-1">对照组转化率</p>
                  <p className="text-2xl font-bold text-cyan-700">3.20%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 mb-1">实验组转化率</p>
                  <p className="text-2xl font-bold text-green-700">3.85%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-600 mb-1">相对提升</p>
                  <p className="text-2xl font-bold text-purple-700">+20.3%</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">统计显著性</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ 显著</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">95%置信区间</span>
                  <span className="text-sm text-gray-600">[+0.11%, +1.19%]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">📝 课后思考</h2>
            <div className="space-y-3">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">1. A/B测试中为什么要设置显著性水平为0.05？</p>
                <p className="text-sm text-gray-600">提示：考虑假阳性率(Type I Error)与商业成本之间的平衡</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">2. 如果实验结果显示统计显著但实际提升很小，应该如何决策？</p>
                <p className="text-sm text-gray-600">提示：考虑实施成本、边际收益和长期价值</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium mb-2">3. 什么时候需要使用多重比较校正？有哪些常用的校正方法？</p>
                <p className="text-sm text-gray-600">提示：同时测试多个指标或多个版本时需要考虑</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTesting;
