import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPython, runPythonCode } from '../services/pyodideService';

const MachineLearning: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setOutput('');
    setError('');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('请输入代码后再运行');
      setOutput('');
      return;
    }

    try {
      const result = await runPythonCode(code);
      if (result.success) {
        setOutput(result.output || '');
        setError('');
      } else {
        setError('代码执行错误: ' + result.error);
        setOutput('');
      }
    } catch (err) {
      setError('执行错误: ' + (err as Error).message);
      setOutput('');
    }
  };

  // Python 代码示例
  const codeExample1 = `from sklearn.model_selection import train_test_split
import numpy as np

# 准备数据
X = np.array([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
y = np.array([2, 4, 6, 8, 10, 12, 14, 16, 18, 20])

# 分割数据为训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print('训练集大小:', X_train.shape[0])
print('测试集大小:', X_test.shape[0])`;

  const codeExample2 = `from sklearn.linear_model import LinearRegression
import numpy as np

# 准备数据：广告投入与销量
# X: 广告投入（万元）
# y: 销量（千件）
X = np.array([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
y = np.array([1.2, 2.1, 2.9, 4.1, 4.8, 5.9, 6.8, 7.9, 8.7, 9.8])

# 创建线性回归模型
model = LinearRegression()

# 训练模型
model.fit(X, y)

# 打印模型参数
print('斜率:', model.coef_[0])
print('截距:', model.intercept_)

# 预测新数据：广告投入11万元时的销量
prediction = model.predict([[11]])
print('预测销量:', prediction[0], '千件')

# 计算模型在训练集上的R²评分
r2_score = model.score(X, y)
print('R²评分:', r2_score)`;

  const codeExample3 = `from sklearn.neighbors import KNeighborsClassifier
import numpy as np

# 准备数据：特征和标签
# 特征：[花瓣长度, 花瓣宽度]
# 标签：0=山鸢尾, 1=变色鸢尾, 2=维吉尼亚鸢尾
X = np.array([[1.4, 0.2], [1.3, 0.2], [1.5, 0.2], [4.5, 1.5], [4.6, 1.5], [4.7, 1.6], [6.0, 2.5], [6.1, 2.6], [6.2, 2.7]])
y = np.array([0, 0, 0, 1, 1, 1, 2, 2, 2])

# 创建KNN分类器，k=3
knn = KNeighborsClassifier(n_neighbors=3)

# 训练模型
knn.fit(X, y)

# 预测新数据
new_data = np.array([[1.6, 0.3], [4.8, 1.7], [6.3, 2.8]])
predictions = knn.predict(new_data)

print('预测结果:', predictions)`;

  const codeExample4 = `from sklearn.linear_model import LogisticRegression
import numpy as np

# 准备数据：考试成绩和是否录取
# 特征：[数学成绩, 英语成绩]
# 标签：0=未录取, 1=录取
X = np.array([[70, 65], [80, 75], [60, 55], [50, 45], [90, 85], [85, 90], [65, 60], [45, 40]])
y = np.array([1, 1, 0, 0, 1, 1, 0, 0])

# 创建逻辑回归模型
log_reg = LogisticRegression()

# 训练模型
log_reg.fit(X, y)

# 预测新数据
new_students = np.array([[75, 70], [55, 50]])
predictions = log_reg.predict(new_students)

print('预测结果:', predictions)

# 预测概率
probabilities = log_reg.predict_proba(new_students)
print('预测概率:', probabilities)`;

  const codeExample5 = `from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import numpy as np

# 准备数据
X = np.array([[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]])
y = np.array([3, 5, 7, 9, 11, 13, 15, 17, 19, 21])

# 数据标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 创建模型
model = LinearRegression()

# 交叉验证
scores = cross_val_score(model, X_scaled, y, cv=5)
print('交叉验证评分:', scores)
print('平均评分:', scores.mean())

# 训练模型
model.fit(X_scaled, y)

# 预测新数据
new_data = np.array([[11, 12]])
new_data_scaled = scaler.transform(new_data)
prediction = model.predict(new_data_scaled)
print('预测结果:', prediction)`;

  const placeholder = `# 示例：使用sklearn进行简单线性回归
from sklearn.linear_model import LinearRegression
import numpy as np

# 准备数据
x = np.array([[1], [2], [3], [4], [5]])  # 特征数据
y = np.array([2, 4, 6, 8, 10])  # 目标数据

# 创建模型实例
model = LinearRegression()

# 训练模型
model.fit(x, y)

# 预测新数据
prediction = model.predict([[6]])

# 打印预测结果
print('预测结果:', prediction)`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          {/* 课程标题和学习目标 */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Python编程 机器学习算法练习</h1>
            <div className="bg-accent rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">学习目标</h2>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>掌握 Python Sklearn 基础库的使用</li>
                <li>能够完成简单的回归模型训练和预测</li>
                <li>了解分类算法的基本原理和应用</li>
                <li>学习模型优化的基本方法，提高模型精度</li>
              </ul>
            </div>
          </div>

          {/* 前置知识说明 */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-primary">前置知识</h2>
            <div className="bg-yellow rounded-xl p-6">
              <p className="text-text mb-4">本课程为零基础友好，但建议具备以下基础：</p>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>Python 基础语法（变量、函数、循环等）</li>
                <li>Pandas 数据预处理基础</li>
                <li>基本的数学知识（如线性代数、概率统计）</li>
              </ul>
              <p className="text-text mt-4">需要安装的库：</p>
              <div className="bg-gray-100 p-4 rounded-lg mt-2 font-mono text-sm">
                pip install scikit-learn numpy pandas matplotlib
              </div>
            </div>
          </div>

          {/* 分步教学模块 */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">分步教学</h2>
            
            {/* 1. 机器学习基础概念 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                <h3 className="text-lg font-semibold text-text">机器学习基础概念：训练集 / 测试集、模型评估</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">在开始机器学习之前，我们需要了解一些基础概念：</p>
                <ul className="list-disc pl-6 space-y-2 text-text mb-4">
                  <li><strong>训练集</strong>：用于训练模型的数据集合</li>
                  <li><strong>测试集</strong>：用于评估模型性能的数据集合</li>
                  <li><strong>特征</strong>：用于预测的输入变量</li>
                  <li><strong>目标</strong>：我们要预测的输出变量</li>
                  <li><strong>模型评估指标</strong>：用于衡量模型性能的指标，如准确率、均方误差等</li>
                </ul>
                <p className="text-text">下面是一个将数据分为训练集和测试集的示例：</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-ml-1">{codeExample1}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-ml-1')?.textContent || '', 'output-ml-1')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-ml-1" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            {/* 2. 线性回归实战 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                <h3 className="text-lg font-semibold text-text">线性回归实战：代码逐行讲解 + 销量预测案例</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">线性回归是最基础的机器学习算法之一，用于预测连续值。下面我们通过一个销量预测案例来学习线性回归。</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-ml-2">{codeExample2}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-ml-2')?.textContent || '', 'output-ml-2')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-ml-2" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
                <p className="text-text">线性回归模型通过拟合一条直线来预测数据，R²评分越接近1，说明模型拟合效果越好。</p>
              </div>
            </div>

            {/* 3. 分类算法入门 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                <h3 className="text-lg font-semibold text-text">分类算法入门：KNN / 逻辑回归</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">分类算法用于预测离散值，如判断邮件是否为垃圾邮件、图像识别等。下面我们学习两种常用的分类算法：KNN和逻辑回归。</p>
                
                <h4 className="font-medium text-text mb-3">KNN（K-最近邻）算法</h4>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-ml-3">{codeExample3}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-ml-3')?.textContent || '', 'output-ml-3')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-ml-3" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
                
                <h4 className="font-medium text-text mb-3">逻辑回归算法</h4>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-ml-4">{codeExample4}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-ml-4')?.textContent || '', 'output-ml-4')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-ml-4" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
              </div>
            </div>

            {/* 4. 模型优化 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</div>
                <h3 className="text-lg font-semibold text-text">模型优化：参数调整、精度提升方法</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-text mb-4">模型优化是提高机器学习模型性能的重要步骤，下面我们学习一些常用的模型优化方法。</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre id="code-ml-5">{codeExample5}</pre>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => runPython(document.getElementById('code-ml-5')?.textContent || '', 'output-ml-5')}
                    className="bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-secondary transition-all duration-300"
                  >
                    运行
                  </button>
                </div>
                <div id="output-ml-5" className="bg-gray-800 text-white p-4 rounded-lg mb-4"></div>
                <p className="text-text">数据标准化和交叉验证是常用的模型优化方法，可以提高模型的泛化能力和预测精度。</p>
              </div>
            </div>
          </div>

          {/* 交互式Python编辑器 */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6 text-primary">交互式Python编辑器</h2>
            <p className="text-text mb-4">在下方编辑器中，你可以输入代码并运行，查看结果。默认加载了线性回归的示例代码，你可以修改它来练习其他算法。</p>
            
            {/* 代码编辑器 */}
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
                placeholder={placeholder}
                className="rounded-lg shadow-sm"
                style={{ height: '300px', width: '100%' }}
              />
            </div>
            
            {/* 运行按钮 */}
            <div className="mb-6">
              <button
                onClick={handleRunCode}
                className="bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5"
              >
                运行代码
              </button>
            </div>
            
            {/* 结果/错误输出 */}
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              {error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div>{output || '运行结果将显示在这里'}</div>
              )}
            </div>
          </div>

          {/* 课后练习和拓展任务 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">课后练习</h2>
            <div className="bg-purple rounded-xl p-6">
              <p className="text-text mb-4">请使用以下数据集，完成相应的机器学习任务：</p>
              <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                # 房价预测数据
                import numpy as np
                <br/>
                <br/>
                # 特征：[面积(平方米), 卧室数量, 浴室数量]
                X = np.array([[100, 2, 1], [150, 3, 2], [120, 2, 1], [180, 4, 2], [90, 2, 1], [200, 4, 3], [130, 3, 2], [160, 3, 2]])
                # 目标：房价(万元)
                y = np.array([50, 75, 60, 90, 45, 100, 65, 80])
              </div>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>使用线性回归模型预测房价</li>
                <li>将数据分为训练集和测试集（测试集占25%）</li>
                <li>计算模型在测试集上的R²评分</li>
                <li>预测一套面积为140平方米、3个卧室、2个浴室的房子的价格</li>
              </ul>
            </div>
          </div>

          {/* 拓展任务 */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">拓展任务</h2>
            <div className="bg-secondary rounded-xl p-6">
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>学习使用决策树和随机森林算法</li>
                <li>尝试使用网格搜索（GridSearchCV）进行参数调优</li>
                <li>学习特征工程的基本方法，提高模型性能</li>
                <li>探索深度学习在分类问题中的应用</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineLearning;