import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode } from '../services/pyodideService';

const MachineLearning: React.FC = () => {
  const [code, setCode] = useState(defaultCode);
  const [result, setResult] = useState<{ success: boolean; stdout: string; stderr: string; error?: any; } | null>(null);

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
          message: '执行错误: ' + (err as Error).message
        }
      });
    }
  };

  const defaultCode = `# 机器学习基础示例
print("欢迎学习机器学习！")
print("\n在这个课程中，你将学习：")
print("1. 机器学习基本概念")
print("2. 监督与非监督学习")
print("3. 模型评估方法")

# 简单的数值计算示例
X = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

print("特征值 X:", X)
print("目标值 y:", y)

# 计算简单的关系
print("\n观察发现，y 是 x 的 2 倍！")
print("这是一个简单的线性关系")`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Python编程 机器学习算法练习</h1>
          
          <div className="mb-10">
            <div className="bg-green-100 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>理解机器学习的基本概念和原理</li>
                <li>掌握监督学习和无监督学习的区别</li>
                <li>了解常见的机器学习算法类型</li>
                <li>学习模型评估和改进的基本方法</li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">前置知识</h2>
            <div className="bg-yellow-100 rounded-xl p-6">
              <p className="text-gray-700">基础数学知识（代数、统计）、基础编程思维</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">课程内容</h2>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-pink-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                <h3 className="text-lg font-semibold text-gray-800">机器学习基础概念</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-gray-700 mb-4">
                  <p className="mb-3"><strong>什么是机器学习？</strong></p>
                  <p className="mb-3">机器学习是人工智能的一个分支，它使计算机系统能够通过经验自动改进，而无需明确编程。</p>
                  <p className="mb-3"><strong>机器学习的类型：</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">监督学习</h4>
                      <p className="text-sm text-gray-700">
                        使用标记数据进行训练，学习输入与输出之间的映射关系。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">无监督学习</h4>
                      <p className="text-sm text-gray-700">
                        使用未标记数据，发现数据中的隐藏模式和结构。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">强化学习</h4>
                      <p className="text-sm text-gray-700">
                        通过奖励和惩罚机制，让智能体学习最优决策策略。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">深度学习</h4>
                      <p className="text-sm text-gray-700">
                        使用多层神经网络，自动学习复杂的特征表示。
                      </p>
                    </div>
                  </div>
                  <p className="mb-3"><strong>机器学习流程：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>数据收集和预处理</li>
                    <li>特征工程</li>
                    <li>模型选择和训练</li>
                    <li>模型评估</li>
                    <li>模型部署和优化</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-pink-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-gray-800">线性回归实战</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-gray-700 mb-4">
                  <p className="mb-3"><strong>什么是线性回归？</strong></p>
                  <p className="mb-3">线性回归是最基础的监督学习算法，用于预测连续值。</p>
                  <p className="mb-3"><strong>工作原理：</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>找到一条最拟合数据的直线</li>
                    <li>最小化预测值与实际值的差距</li>
                    <li>数学表示：y = wx + b</li>
                  </ul>
                  <p className="mb-3"><strong>常见应用：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>房价预测</li>
                    <li>销售预测</li>
                    <li>学生成绩预测</li>
                    <li>医疗费用估计</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-pink-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-gray-800">分类算法入门</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-gray-700 mb-4">
                  <p className="mb-3"><strong>什么是分类？</strong></p>
                  <p className="mb-3">分类用于预测离散标签，如"是/否"、"类别A/B/C"等。</p>
                  <p className="mb-3"><strong>常用分类算法：</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">逻辑回归</h4>
                      <p className="text-sm text-gray-700">
                        虽然名字叫回归，但实际用于分类，特别是二分类问题。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">K-近邻(KNN)</h4>
                      <p className="text-sm text-gray-700">
                        基于相似度的简单算法，不需要训练过程。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">决策树</h4>
                      <p className="text-sm text-gray-700">
                        树形结构，直观易理解，可处理分类和回归任务。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">随机森林</h4>
                      <p className="text-sm text-gray-700">
                        集成多个决策树，性能更稳定，防止过拟合。
                      </p>
                    </div>
                  </div>
                  <p className="mb-3"><strong>评估指标：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>准确率(Accuracy)</li>
                    <li>精确率(Precision)和召回率(Recall)</li>
                    <li>F1分数(F1-Score)</li>
                    <li>ROC-AUC曲线</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-pink-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</div>
                <h3 className="text-lg font-semibold text-gray-800">模型优化方法</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-gray-700 mb-4">
                  <p className="mb-3"><strong>过拟合和欠拟合：</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>过拟合：在训练集表现好，在测试集表现差</li>
                    <li>欠拟合：训练集和测试集表现都不好</li>
                  </ul>
                  <p className="mb-3"><strong>防止过拟合的方法：</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">增加数据</h4>
                      <p className="text-sm text-gray-700">
                        更多数据能帮助模型学习更通用的规律。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">简化模型</h4>
                      <p className="text-sm text-gray-700">
                        减少模型复杂度，避免记住噪音。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">正则化</h4>
                      <p className="text-sm text-gray-700">
                        加入惩罚项，约束模型复杂度。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">集成学习</h4>
                      <p className="text-sm text-gray-700">
                        结合多个模型的预测结果，提高稳定性。
                      </p>
                    </div>
                  </div>
                  <p className="mb-3"><strong>交叉验证：</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>将数据分成多个部分</li>
                    <li>轮流用一部分做测试，其余做训练</li>
                    <li>更稳健的模型评估方法</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">交互式Python练习</h2>
            <p className="text-gray-700 mb-4">在这里尝试简单的Python代码，熟悉基础计算！</p>
            
            <div className="mb-6">
              <AceEditor
                mode="python"
                theme="monokai"
                value={code}
                onChange={handleCodeChange}
                name="machine-learning-editor"
                editorProps={{
                  $blockScrolling: true
                }}
                className="rounded-lg shadow-sm"
                style={{ height: '300px', width: '100%' }}
              />
            </div>
            
            <div className="mb-6">
              <button
                onClick={handleRunCode}
                className="bg-pink-400 text-white py-3 px-8 rounded-full font-bold hover:bg-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                运行代码
              </button>
            </div>
            
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              {!result ? (
                <div className="text-gray-400">运行结果将显示在这里</div>
              ) : result.success ? (
                <div className="space-y-3">
                  {result.stdout && (
                    <div>
                      <h3 className="text-green-400 font-semibold mb-1">标准输出:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}
                  {result.stderr && (
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-1">标准错误:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stderr}</pre>
                    </div>
                  )}
                  {!result.stdout && !result.stderr && (
                    <div className="text-green-400">代码执行成功！</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {result.stdout && (
                    <div>
                      <h3 className="text-green-400 font-semibold mb-1">标准输出:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}
                  {result.stderr && (
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-1">标准错误:</h3>
                      <pre className="text-gray-100 whitespace-pre-wrap">{result.stderr}</pre>
                    </div>
                  )}
                  {result.error && (
                    <div className="text-red-400">
                      <h3 className="font-semibold mb-1">错误信息:</h3>
                      <pre className="whitespace-pre-wrap">
                        类型: {result.error.type}
                        消息: {result.error.message}
                        {result.error.lineNumber !== undefined && `\n行号: ${result.error.lineNumber}`}
                        {result.error.stack && `\n\n堆栈跟踪:\n${result.error.stack}`}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">课后练习</h2>
            <div className="bg-purple-100 rounded-xl p-6">
              <p className="text-gray-700 mb-4">思考以下问题：</p>
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">1. 假设你要预测房价，你会收集哪些特征？为什么？</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">2. 如果你要识别垃圾邮件，这是回归问题还是分类问题？为什么？</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">3. 如果你要分析用户评论是正面还是负面，这是一个什么类型的机器学习任务？</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineLearning;
