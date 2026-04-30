import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, isPyodideReady, isPyodideLoading } from '../services/pyodideService';

const projects = [
  {
    id: 1,
    title: '项目一：房价预测',
    description: '使用线性回归预测房价',
    code: `# 线性回归预测房价
import numpy as np

# 模拟数据：房屋面积（平方米）
X = np.array([50, 60, 70, 80, 90, 100, 110, 120])
# 对应价格（万元）
y = np.array([150, 180, 210, 240, 270, 300, 330, 360])

# 计算均值
X_mean = np.mean(X)
y_mean = np.mean(y)

# 计算斜率 w 和截距 b
numerator = np.sum((X - X_mean) * (y - y_mean))
denominator = np.sum((X - X_mean) ** 2)
w = numerator / denominator
b = y_mean - w * X_mean

print("=" * 40)
print("线性回归模型训练完成！")
print("=" * 40)
print(f"\\n模型参数:")
print(f"  斜率 (w): {w:.2f}")
print(f"  截距 (b): {b:.2f}")
print(f"\\n预测公式: y = {w:.2f}x + {b:.2f}")
print("=" * 40)

# 测试预测
test_area = 85  # 85平米的房子
predicted_price = w * test_area + b
print(f"\\n🏠 预测结果:")
print(f"   面积: {test_area} 平方米")
print(f"   预测价格: {predicted_price:.2f} 万元")

# 计算R²分数
y_pred = w * X + b
ss_res = np.sum((y - y_pred) ** 2)
ss_tot = np.sum((y - y_mean) ** 2)
r2 = 1 - (ss_res / ss_tot)
print(f"\\n📊 模型评估:")
print(f"   R² 分数: {r2:.4f}")
print(f"   (越接近1越好)")
`
  },
  {
    id: 2,
    title: '项目二：水果分类',
    description: '使用KNN算法分类水果',
    code: `# KNN 水果分类器
import numpy as np

# 水果特征数据 [重量(克), 直径(厘米)]
X_train = np.array([
    [120, 6.5],   # 苹果
    [130, 7.0],   # 苹果
    [115, 6.2],   # 苹果
    [180, 8.5],   # 橙子
    [190, 9.0],   # 橙子
    [175, 8.2],   # 橙子
    [140, 7.5],   # 葡萄柚
    [160, 8.0],   # 葡萄柚
])
y_train = ['苹果', '苹果', '苹果', '橙子', '橙子', '橙子', '葡萄柚', '葡萄柚']

def euclidean_distance(point1, point2):
    """计算欧几里得距离"""
    return np.sqrt(np.sum((point1 - point2) ** 2))

def knn_predict(X_train, y_train, test_point, k=3):
    """KNN预测"""
    distances = []
    for i, train_point in enumerate(X_train):
        dist = euclidean_distance(train_point, test_point)
        distances.append((dist, y_train[i]))
    
    # 按距离排序
    distances.sort(key=lambda x: x[0])
    
    # 取最近的k个邻居
    k_nearest = distances[:k]
    
    # 投票
    votes = {}
    for _, label in k_nearest:
        votes[label] = votes.get(label, 0) + 1
    
    return max(votes, key=votes.get)

print("=" * 40)
print("🍎🍊 KNN 水果分类器")
print("=" * 40)

# 测试样本
test_samples = [
    [125, 6.8],  # 接近苹果
    [185, 8.8],  # 接近橙子
    [150, 7.7],  # 中间地带
]

k = 3
print(f"\\n使用 K={k} 近邻算法\\n")

for i, sample in enumerate(test_samples, 1):
    prediction = knn_predict(X_train, y_train, np.array(sample), k)
    print(f"测试样本 {i}:")
    print(f"  特征: 重量={sample[0]}g, 直径={sample[1]}cm")
    print(f"  预测结果: {prediction}")
    print()

print("=" * 40)
print("✅ 分类完成！")
`
  },
  {
    id: 3,
    title: '项目三：客户分群',
    description: '使用K-Means聚类分析客户',
    code: `# K-Means 客户分群
import numpy as np

# 客户数据 [月消费, 月登录次数]
X = np.array([
    [500, 25], [550, 28], [480, 22], [600, 30],
    [1500, 15], [1600, 18], [1400, 12], [1700, 20],
    [3000, 8], [3200, 10], [2800, 7], [3500, 12],
])

def euclidean_distance(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def kmeans(X, k=3, max_iter=100):
    """K-Means 聚类算法"""
    n_samples = len(X)
    
    # 随机选择k个初始中心
    np.random.seed(42)
    indices = np.random.choice(n_samples, k, replace=False)
    centroids = X[indices].copy()
    
    for iteration in range(max_iter):
        # 分配样本到最近的中心
        clusters = [[] for _ in range(k)]
        for i, sample in enumerate(X):
            distances = [euclidean_distance(sample, c) for c in centroids]
            cluster = np.argmin(distances)
            clusters[cluster].append(i)
        
        # 更新中心点
        new_centroids = np.zeros_like(centroids)
        for i, cluster in enumerate(clusters):
            if len(cluster) > 0:
                new_centroids[i] = np.mean(X[cluster], axis=0)
            else:
                new_centroids[i] = centroids[i]
        
        # 检查收敛
        if np.allclose(centroids, new_centroids):
            print(f"✓ 在第 {iteration + 1} 次迭代后收敛")
            break
        
        centroids = new_centroids
    
    return centroids, clusters

print("=" * 50)
print("📊 客户分群分析")
print("=" * 50)

# 执行聚类
k = 3
centroids, clusters = kmeans(X, k)

print(f"\\n发现 {k} 个客户群体:\\n")

labels = ['💰 普通客户', '💎 活跃客户', '👑 VIP客户']
for i, (centroid, cluster) in enumerate(zip(centroids, clusters)):
    avg_spend = np.mean(X[cluster][:, 0])
    avg_login = np.mean(X[cluster][:, 1])
    
    # 根据消费水平确定客户类型
    if avg_spend > 2500:
        label = '👑 VIP客户'
    elif avg_spend > 1000:
        label = '💎 活跃客户'
    else:
        label = '💰 普通客户'
    
    print(f"群体 {i + 1}: {label}")
    print(f"  客户数量: {len(cluster)}")
    print(f"  平均月消费: {avg_spend:.0f} 元")
    print(f"  平均月登录: {avg_login:.1f} 次")
    print()

print("=" * 50)
print("✅ 客户分群完成！")
`
  }
];

const MachineLearning: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const [code, setCode] = useState(projects[0].code);
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pyodideReady, setPyodideReady] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    const checkPyodideStatus = () => {
      const ready = isPyodideReady();
      const loading = isPyodideLoading();
      
      if (ready) {
        setLoadingMessage('✓ Pyodide 已就绪');
        setPyodideReady(true);
      } else if (loading) {
        setLoadingMessage('正在加载 Python 环境...');
      }
    };

    checkPyodideStatus();
    const interval = setInterval(checkPyodideStatus, 500);
    return () => clearInterval(interval);
  }, []);

  const handleProjectSelect = (index: number) => {
    setSelectedProject(index);
    setCode(projects[index].code);
    setResult(null);
    setErrorDetails(null);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setResult(null);
    setErrorDetails(null);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setErrorDetails({
        type: 'InputError',
        message: '请输入代码后再运行'
      });
      return;
    }

    setIsRunning(true);
    setResult(null);
    setErrorDetails(null);

    try {
      const executionResult = await runPythonCode(code);
      setResult(executionResult);
      
      if (!executionResult.success && executionResult.error) {
        setErrorDetails(executionResult.error);
      }
    } catch (err) {
      setErrorDetails({
        type: 'ExecutionError',
        message: '执行过程中发生错误: ' + (err as Error).message
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Python 机器学习实战
              </h1>
              <p className="text-gray-500 mt-2">边学边做，掌握核心算法</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${pyodideReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
              <span className="text-sm text-gray-600">{loadingMessage || '检查环境...'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => handleProjectSelect(index)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedProject === index
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    selectedProject === index ? 'bg-purple-500' : 'bg-gray-400'
                  }`}>
                    {project.id}
                  </div>
                  <h3 className="font-semibold text-gray-800">{project.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{project.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {projects[selectedProject].title}
            </h2>
            <p className="text-gray-600">
              {projects[selectedProject].description} - 点击下方代码编辑器中的代码，然后点击运行按钮开始
            </p>
          </div>

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
              className="rounded-lg shadow-lg"
              style={{ height: '400px', width: '100%' }}
              setOptions={{
                fontSize: 14,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
              }}
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl transform hover:-translate-y-1'
              } text-white`}
            >
              {isRunning ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  运行中...
                </span>
              ) : (
                '▶ 运行代码'
              )}
            </button>
          </div>

          {errorDetails && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-700 mb-2">
                    {errorDetails.type === 'InputError' ? '输入错误' : 
                     errorDetails.type === 'SyntaxError' ? '语法错误' :
                     errorDetails.type === 'InitializationError' ? '环境错误' : '执行错误'}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-red-600 font-medium">{errorDetails.message}</p>
                    {errorDetails.lineNumber && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>错误位置: 第 {errorDetails.lineNumber} 行</span>
                      </div>
                    )}
                    {errorDetails.details && (
                      <p className="text-gray-600 text-sm mt-2">{errorDetails.details}</p>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600">
                      💡 <strong>提示:</strong> 检查代码中的语法、变量名拼写，或确保所有引号和括号都已正确闭合
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && result.success && (
            <div className="bg-gray-900 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-400">运行成功!</h3>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 overflow-auto max-h-96">
                {result.output && (
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {result.output.includes('<img') ? (
                      <div dangerouslySetInnerHTML={{ __html: result.output }} />
                    ) : (
                      result.output
                    )}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📚 学习要点</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl">
              <h3 className="font-bold text-blue-700 mb-2">监督学习</h3>
              <p className="text-sm text-gray-600">使用有标签的数据进行训练，预测已知类别或连续值</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl">
              <h3 className="font-bold text-purple-700 mb-2">KNN 算法</h3>
              <p className="text-sm text-gray-600">根据最近邻居的投票来决定分类，简单直观</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl">
              <h3 className="font-bold text-green-700 mb-2">K-Means 聚类</h3>
              <p className="text-sm text-gray-600">无监督学习，自动发现数据中的群体结构</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineLearning;
