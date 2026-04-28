import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { FaCheck, FaTimes, FaLightbulb, FaBook, FaCode, FaChartBar } from 'react-icons/fa';
import { runPythonCode } from '../services/pyodideService';

interface Task {
  id: string;
  title: string;
  description: string;
  data?: string;
  analysis?: string[];
  answers?: string[];
}

interface TestCase {
  input: string;
  expected: string;
  passed?: boolean;
  actual?: string;
  error?: string;
}

interface CodeAnalysis {
  codeQuality: number;
  performance: number;
  style: number;
  suggestions: string[];
}

interface LearningResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course';
  url: string;
  description: string;
}

interface ExerciseDetail {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  testCases: TestCase[];
}

const PracticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis | null>(null);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [activeTab, setActiveTab] = useState('task'); // 'task', 'code', 'analysis', 'feedback'
  const [showAnswers, setShowAnswers] = useState(false);
  const [result, setResult] = useState<{ success: boolean; stdout: string; stderr: string; error?: any } | null>(null);
  const [runningCode, setRunningCode] = useState(false);

  useEffect(() => {
    // 检查是否是思维测试练习
    if (id === '5') {
      // 重定向到思维测试页面
      navigate('/data-analysis-test');
      return;
    }

    // 模拟获取练习详情数据
    const fetchExerciseDetail = async () => {
      // 实际项目中，这里应该调用API获取数据
      let mockExercise: ExerciseDetail;
      let defaultCode: string;

      // 根据练习ID返回不同的内容
      switch (id) {
        case '1':
          // 数据清洗与预处理
          mockExercise = {
            id: '1',
            title: '数据清洗与预处理',
            description: '在这个练习中，你将学习如何清洗和预处理数据，包括处理缺失值、异常值等。你将使用一个真实的数据集来实践这些技能。',
            tasks: [
              {
                id: '1',
                title: '加载数据',
                description: '加载提供的数据集，并查看前几行数据以了解数据结构。',
                data: '数据集包含了电商平台的用户购买记录，包括用户ID、购买时间、商品类别、购买金额等信息。',
                analysis: [
                  '数据集中有多少行和列？',
                  '数据的基本统计信息是什么？',
                  '数据中是否存在缺失值？'
                ],
                answers: [
                  '数据集有10行和5列',
                  '可以使用df.describe()查看基本统计信息',
                  '使用df.isnull().sum()可以查看各列缺失值数量'
                ]
              },
              {
                id: '2',
                title: '处理缺失值',
                description: '识别并处理数据中的缺失值。',
                analysis: [
                  '哪些列存在缺失值？',
                  '缺失值的比例是多少？',
                  '你会如何处理这些缺失值？'
                ],
                answers: [
                  'age和salary列存在缺失值',
                  'age列缺失约20%，salary列缺失约10%',
                  'age可以用平均值填充，salary可以用中位数填充'
                ]
              },
              {
                id: '3',
                title: '处理异常值',
                description: '识别并处理数据中的异常值。',
                analysis: [
                  '如何识别异常值？',
                  '数据中存在哪些异常值？',
                  '你会如何处理这些异常值？'
                ],
                answers: [
                  '可以使用IQR方法或Z-score方法识别异常值',
                  'salary列有一些异常高的值（如200000）',
                  '可以删除异常值或用中位数替换'
                ]
              },
              {
                id: '4',
                title: '数据转换',
                description: '对数据进行必要的转换，以便后续分析。',
                analysis: [
                  '需要进行哪些数据转换？',
                  '转换后的数据结构是什么样的？',
                  '转换后的数据是否满足分析需求？'
                ],
                answers: [
                  '将department列转换为分类变量，创建salary_level等级',
                  '转换后的数据更适合分析',
                  '是的，转换后的数据可以进行更深入的分析'
                ]
              }
            ],
            testCases: [
              { input: '加载数据并显示前5行', expected: '成功加载数据并显示前5行' },
              { input: '处理缺失值', expected: '成功处理所有缺失值' },
              { input: '处理异常值', expected: '成功处理所有异常值' },
              { input: '数据转换', expected: '成功完成数据转换' }
            ]
          };
          defaultCode = `import pandas as pd
import numpy as np

data = {
    'user_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'age': [25, 30, None, 40, 45, None, 35, 28, 50, 42],
    'salary': [50000, 60000, 70000, None, 90000, 100000, 55000, 65000, 200000, 80000],
    'department': ['HR', 'IT', 'IT', 'HR', 'Finance', 'Finance', 'IT', 'HR', 'CEO', 'Finance'],
    'join_date': ['2023-01-15', '2022-06-20', '2023-03-10', '2021-09-05', '2022-11-30', '2020-08-12', '2023-05-22', '2022-04-18', '2019-12-01', '2023-02-14']
}

df = pd.DataFrame(data)

print("=== Data Loading ===")
print(f"\n1. Data structure:")
print(df.head())
print(f"\nData shape: {df.shape}")

print("\n2. Handling missing values:")
print("Missing value counts:")
print(df.isnull().sum())

df['age'] = df['age'].fillna(df['age'].mean())
df['salary'] = df['salary'].fillna(df['salary'].median())

print("\nData after filling missing values:")
print(df)

print("\n3. Handling outliers:")
Q1 = df['salary'].quantile(0.25)
Q3 = df['salary'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
print(f"Salary normal range: {lower_bound:.0f} - {upper_bound:.0f}")

df['salary'] = np.where((df['salary'] < lower_bound) | (df['salary'] > upper_bound), 
                        df['salary'].median(), df['salary'])

print("\nData after handling outliers:")
print(df)

print("\n4. Data transformation:")
df['department'] = df['department'].astype('category')
df['join_date'] = pd.to_datetime(df['join_date'])
df['join_year'] = df['join_date'].dt.year

df['salary_level'] = pd.cut(df['salary'], 
                           bins=[0, 60000, 80000, 100000, float('inf')],
                           labels=['Low', 'Medium', 'High', 'Very High'])

print("\nData after transformation:")
print(df)
print("\nData cleaning done!")
`;
          break;

        case '2':
          // 数据可视化
          mockExercise = {
            id: '2',
            title: '数据可视化',
            description: '在这个练习中，你将学习如何使用Matplotlib创建各种数据可视化图表，包括折线图、柱状图、饼图和散点图。',
            tasks: [
              {
                id: '1',
                title: '创建折线图',
                description: '创建一个展示月度销售额趋势的折线图。',
                data: '数据集包含12个月的销售额数据。',
                analysis: [
                  '如何设置图表标题和坐标轴标签？',
                  '如何添加数据点标记？',
                  '如何设置图表大小？'
                ],
                answers: [
                  '使用plt.title()、plt.xlabel()和plt.ylabel()设置',
                  '使用marker参数添加数据点标记',
                  '使用plt.figure(figsize=(width, height))设置'
                ]
              },
              {
                id: '2',
                title: '创建柱状图',
                description: '创建一个展示各部门销售额对比的柱状图。',
                analysis: [
                  '如何设置柱状图的颜色？',
                  '如何添加数据标签？',
                  '如何旋转x轴标签？'
                ],
                answers: [
                  '使用color参数设置柱状图颜色',
                  '使用plt.text()添加数据标签',
                  '使用plt.xticks(rotation=角度)旋转标签'
                ]
              },
              {
                id: '3',
                title: '创建饼图',
                description: '创建一个展示各产品类别销售占比的饼图。',
                analysis: [
                  '如何设置饼图的百分比显示？',
                  '如何突出显示某个扇区？',
                  '如何添加图例？'
                ],
                answers: [
                  '使用autopct参数设置百分比显示',
                  '使用explode参数突出显示',
                  '使用plt.legend()添加图例'
                ]
              },
              {
                id: '4',
                title: '创建散点图',
                description: '创建一个展示广告投入与销售额关系的散点图。',
                analysis: [
                  '如何设置点的大小和颜色？',
                  '如何添加趋势线？',
                  '如何调整点的透明度？'
                ],
                answers: [
                  '使用s和c参数设置点的大小和颜色',
                  '使用np.polyfit()和np.polyval()添加趋势线',
                  '使用alpha参数调整透明度'
                ]
              }
            ],
            testCases: [
              { input: '创建折线图', expected: '成功创建折线图' },
              { input: '创建柱状图', expected: '成功创建柱状图' },
              { input: '创建饼图', expected: '成功创建饼图' },
              { input: '创建散点图', expected: '成功创建散点图' }
            ]
          };
          defaultCode = `import matplotlib.pyplot as plt
import numpy as np

print("=== Data Visualization ===")

# Example data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales = [120, 150, 180, 160, 200, 220]

# 1. Line plot
plt.figure(figsize=(8, 4))
plt.plot(months, sales, marker='o', linestyle='-', color='b')
plt.title('Monthly Sales')
plt.xlabel('Month')
plt.ylabel('Sales (K)')
plt.grid(True)
plt.tight_layout()
plt.savefig('/tmp/line_plot.png')
print("Line plot created!")

# 2. Bar plot
departments = ['HR', 'IT', 'Finance', 'Sales']
dept_sales = [80, 120, 95, 150]
plt.figure(figsize=(8, 4))
plt.bar(departments, dept_sales, color=['red', 'green', 'blue', 'orange'])
plt.title('Department Sales')
plt.xlabel('Department')
plt.ylabel('Sales (K)')
plt.tight_layout()
plt.savefig('/tmp/bar_plot.png')
print("Bar plot created!")

# 3. Pie plot
categories = ['Electronics', 'Clothing', 'Food', 'Daily']
category_sales = [35, 25, 20, 20]
plt.figure(figsize=(6, 6))
plt.pie(category_sales, labels=categories, autopct='%1.1f%%', explode=[0.1, 0, 0, 0])
plt.title('Category Sales')
plt.tight_layout()
plt.savefig('/tmp/pie_plot.png')
print("Pie plot created!")

# 4. Scatter plot
ad_spend = [5, 8, 10, 12, 15, 18, 20]
revenue = [50, 75, 90, 100, 120, 140, 150]
plt.figure(figsize=(8, 4))
plt.scatter(ad_spend, revenue, s=100, c='purple', alpha=0.7)
z = np.polyfit(ad_spend, revenue, 1)
p = np.poly1d(z)
plt.plot(ad_spend, p(ad_spend), "r--")
plt.title('Ad Spend vs Revenue')
plt.xlabel('Ad Spend (K)')
plt.ylabel('Revenue (K)')
plt.tight_layout()
plt.savefig('/tmp/scatter_plot.png')
print("Scatter plot created!")

print("\nAll plots done!")
`;
          break;

        case '3':
          // 机器学习模型训练
          mockExercise = {
            id: '3',
            title: '机器学习模型训练',
            description: '在这个练习中，你将学习如何使用Scikit-learn训练一个分类模型，并评估其性能。',
            tasks: [
              {
                id: '1',
                title: '数据准备',
                description: '加载数据集并进行必要的预处理。',
                data: '使用鸢尾花数据集进行分类任务。',
                analysis: [
                  '如何加载鸢尾花数据集？',
                  '如何划分训练集和测试集？',
                  '为什么需要标准化数据？'
                ],
                answers: [
                  '使用sklearn.datasets.load_iris()加载',
                  '使用sklearn.model_selection.train_test_split()划分',
                  '标准化可以提高模型收敛速度和性能'
                ]
              },
              {
                id: '2',
                title: '训练模型',
                description: '使用逻辑回归算法训练分类模型。',
                analysis: [
                  '如何创建逻辑回归模型？',
                  '如何训练模型？',
                  '模型的主要参数有哪些？'
                ],
                answers: [
                  '使用LogisticRegression()创建模型',
                  '使用model.fit(X_train, y_train)训练',
                  '主要参数包括penalty、C、max_iter等'
                ]
              },
              {
                id: '3',
                title: '模型评估',
                description: '评估模型的性能指标。',
                analysis: [
                  '如何计算准确率？',
                  '什么是混淆矩阵？',
                  '如何计算精确率和召回率？'
                ],
                answers: [
                  '使用accuracy_score()计算准确率',
                  '混淆矩阵展示了预测结果与真实结果的对比',
                  '使用precision_score()和recall_score()计算'
                ]
              },
              {
                id: '4',
                title: '模型调优',
                description: '使用交叉验证进行模型调优。',
                analysis: [
                  '什么是交叉验证？',
                  '如何使用网格搜索进行参数调优？',
                  '如何选择最佳参数？'
                ],
                answers: [
                  '交叉验证将数据分成k份，轮流作为训练集和测试集',
                  '使用GridSearchCV进行网格搜索',
                  '选择交叉验证得分最高的参数组合'
                ]
              }
            ],
            testCases: [
              { input: '加载并预处理数据', expected: '成功加载并预处理数据' },
              { input: '训练逻辑回归模型', expected: '成功训练模型' },
              { input: '评估模型性能', expected: '成功评估模型' },
              { input: '参数调优', expected: '成功进行参数调优' }
            ]
          };
          defaultCode = `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

print("=== Machine Learning ===")

print("\n1. Loading data")
iris = load_iris()
X, y = iris.data, iris.target

print(f"Features shape: {X.shape}")
print(f"Labels shape: {y.shape}")
print(f"Feature names: {iris.feature_names}")
print(f"Class names: {iris.target_names}")

print("\n2. Splitting train/test set")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Train size: {X_train.shape[0]}")
print(f"Test size: {X_test.shape[0]}")

print("\n3. Data normalization")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print("Normalization done!")

print("\n4. Training model")
model = LogisticRegression(max_iter=200)
model.fit(X_train_scaled, y_train)
print("Model trained!")

print("\n5. Evaluating model")
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")
print("\nClassification report:")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

print("\n6. Cross validation")
cv_scores = cross_val_score(model, X, y, cv=5)
print(f"CV scores: {cv_scores}")
print(f"Mean score: {cv_scores.mean():.4f}")

print("\nML training done!")
`;
          break;

        case '4':
          // 时间序列分析
          mockExercise = {
            id: '4',
            title: '时间序列分析',
            description: '在这个练习中，你将学习如何分析时间序列数据，包括数据可视化、平稳性检验和预测。',
            tasks: [
              {
                id: '1',
                title: '加载时间序列数据',
                description: '加载时间序列数据并设置时间索引。',
                data: '数据集包含月度销售数据。',
                analysis: [
                  '如何设置时间索引？',
                  '如何将字符串转换为日期格式？',
                  '如何查看时间序列的频率？'
                ],
                answers: [
                  '使用df.set_index()设置时间索引',
                  '使用pd.to_datetime()转换日期格式',
                  '使用df.index.freq查看频率'
                ]
              },
              {
                id: '2',
                title: '时间序列可视化',
                description: '创建时间序列的可视化图表。',
                analysis: [
                  '如何绘制时间序列折线图？',
                  '如何添加滚动平均值？',
                  '如何进行季节性分解？'
                ],
                answers: [
                  '直接使用plt.plot()绘制',
                  '使用df.rolling(window).mean()计算滚动平均',
                  '使用statsmodels进行季节性分解'
                ]
              },
              {
                id: '3',
                title: '平稳性检验',
                description: '检验时间序列的平稳性。',
                analysis: [
                  '什么是平稳时间序列？',
                  '如何进行ADF检验？',
                  '非平稳序列如何处理？'
                ],
                answers: [
                  '平稳序列的统计特性不随时间变化',
                  '使用adfuller()进行ADF检验',
                  '可以使用差分法使序列平稳'
                ]
              },
              {
                id: '4',
                title: '时间序列预测',
                description: '使用ARIMA模型进行时间序列预测。',
                analysis: [
                  'ARIMA模型的参数含义是什么？',
                  '如何选择ARIMA的阶数？',
                  '如何评估预测结果？'
                ],
                answers: [
                  'ARIMA(p,d,q)：p是自回归阶数，d是差分阶数，q是移动平均阶数',
                  '可以使用ACF和PACF图选择阶数',
                  '使用RMSE、MAE等指标评估'
                ]
              }
            ],
            testCases: [
              { input: '加载时间序列数据', expected: '成功加载数据' },
              { input: '时间序列可视化', expected: '成功创建可视化图表' },
              { input: '平稳性检验', expected: '成功检验平稳性' },
              { input: '时间序列预测', expected: '成功进行预测' }
            ]
          };
          defaultCode = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

print("=== Time Series Analysis ===")

print("\n1. Creating time series data")
dates = pd.date_range(start='2023-01-01', periods=24, freq='M')
np.random.seed(42)
sales = np.random.normal(100, 10, 24) + np.linspace(0, 20, 24) + np.sin(np.linspace(0, 4*np.pi, 24)) * 5

df = pd.DataFrame({'sales': sales}, index=dates)
print(f"Data shape: {df.shape}")
print("\nData preview:")
print(df.head())

print("\n2. Time series visualization")
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['sales'], label='Original data')
plt.plot(df.index, df['sales'].rolling(window=3).mean(), label='3-month moving avg', color='orange')
plt.plot(df.index, df['sales'].rolling(window=6).mean(), label='6-month moving avg', color='green')
plt.title('Monthly Sales Trend')
plt.xlabel('Date')
plt.ylabel('Sales')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('/tmp/ts_plot.png')
print("Time series plot created!")

print("\n3. Calculating statistics")
print(f"Mean: {df['sales'].mean():.2f}")
print(f"Standard deviation: {df['sales'].std():.2f}")
print(f"Minimum: {df['sales'].min():.2f}")
print(f"Maximum: {df['sales'].max():.2f}")

print("\n4. Differencing")
df['diff_1'] = df['sales'].diff()
df['diff_2'] = df['sales'].diff().diff()

plt.figure(figsize=(12, 8))
plt.subplot(3, 1, 1)
plt.plot(df['sales'])
plt.title('Original series')

plt.subplot(3, 1, 2)
plt.plot(df['diff_1'])
plt.title('First difference')

plt.subplot(3, 1, 3)
plt.plot(df['diff_2'])
plt.title('Second difference')

plt.tight_layout()
plt.savefig('/tmp/ts_diff.png')
print("Difference plot created!")

print("\n5. Simple forecasting")
last_value = df['sales'].iloc[-1]
print(f"Last value: {last_value:.2f}")
print(f"Next period forecast (simple): {last_value:.2f}")

mean_value = df['sales'].mean()
print(f"Historical mean: {mean_value:.2f}")
print(f"Next period forecast (mean): {mean_value:.2f}")

rolling_mean = df['sales'].rolling(window=3).mean().iloc[-1]
print(f"3-month moving avg: {rolling_mean:.2f}")
print(f"Next period forecast (moving avg): {rolling_mean:.2f}")

print("\nTime series analysis done!")
`;
          break;

        default:
          // 默认使用数据清洗与预处理
          mockExercise = {
            id: id || '1',
            title: '数据清洗与预处理',
            description: '在这个练习中，你将学习如何清洗和预处理数据。',
            tasks: [
              {
                id: '1',
                title: '加载数据',
                description: '加载数据集。',
                analysis: ['数据集中有多少行和列？'],
                answers: ['数据集有10行和5列']
              }
            ],
            testCases: [{ input: '加载数据', expected: '成功加载数据' }]
          };
          defaultCode = 'print("欢迎来到数据清洗练习！")';
      }

      setTimeout(() => {
        setExercise(mockExercise);
        setLoading(false);
        setCode(defaultCode);
      }, 500);
    };

    fetchExerciseDetail();
  }, [id, navigate]);

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

    setRunningCode(true);
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
      setRunningCode(false);
    }
  };

  const handleSubmit = () => {
    // 模拟提交和评分
    setSubmitted(true);
    setScore(85);
    setFeedback('你的代码基本正确，但在处理异常值方面还有改进空间。建议使用IQR方法来识别异常值。');
    
    // 模拟测试用例结果
    setTestResults([
      {
        input: '加载数据并显示前5行',
        expected: '成功加载数据并显示前5行',
        actual: '成功加载数据并显示前5行',
        passed: true
      },
      {
        input: '处理缺失值',
        expected: '成功处理所有缺失值',
        actual: '成功处理所有缺失值',
        passed: true
      },
      {
        input: '处理异常值',
        expected: '成功处理所有异常值',
        actual: '部分异常值未处理',
        passed: false,
        error: '建议使用IQR方法来识别异常值'
      },
      {
        input: '数据转换',
        expected: '成功完成数据转换',
        actual: '成功完成数据转换',
        passed: true
      }
    ]);
    
    // 模拟代码分析
    setCodeAnalysis({
      codeQuality: 85,
      performance: 75,
      style: 90,
      suggestions: [
        '建议添加注释以提高代码可读性',
        '考虑使用更高效的数据处理方法',
        '变量命名可以更清晰',
        '异常处理可以更加完善'
      ]
    });
    
    // 模拟学习资源推荐
    setLearningResources([
      {
        id: '1',
        title: 'Python数据清洗最佳实践',
        type: 'article',
        url: '#',
        description: '学习如何高效地清洗和预处理数据'
      },
      {
        id: '2',
        title: '异常值检测与处理',
        type: 'video',
        url: '#',
        description: '详细讲解各种异常值检测方法'
      },
      {
        id: '3',
        title: '数据分析实战课程',
        type: 'course',
        url: '#',
        description: '通过实际项目学习数据分析技能'
      }
    ]);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  if (!exercise) {
    return <div className="flex items-center justify-center h-screen">练习不存在</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/practice')}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          ← 返回练习列表
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{exercise.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">{exercise.description}</p>

        <div className="border-b border-gray-200 mb-4">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('task')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'task' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                任务描述
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'code' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                代码编辑器
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                案例分析
              </button>
            </li>
            {submitted && (
              <li>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'feedback' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                >
                  详细反馈
                </button>
              </li>
            )}
          </ul>
        </div>

        {activeTab === 'task' && (
          <div className="space-y-6">
            {exercise.tasks.map((task) => (
              <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">任务 {task.id}: {task.title}</h3>
                <p className="text-gray-700 mb-3">{task.description}</p>
                {task.data && (
                  <div className="bg-white p-3 rounded-md border border-gray-200 mb-3">
                    <h4 className="font-medium text-gray-700 mb-1">数据集信息:</h4>
                    <p className="text-gray-600">{task.data}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="h-96">
              <AceEditor
                mode="python"
                theme="monokai"
                onChange={setCode}
                value={code}
                name="code-editor"
                editorProps={{
                  $blockScrolling: true
                }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 4
                }}
                className="w-full h-full"
              />
            </div>
            
            {/* 代码运行结果 */}
            {result && (
              <div className="bg-gray-800 text-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">运行结果：</h4>
                {result.success ? (
                  <div className="space-y-2">
                    {result.stdout && (
                      <div>
                        <pre className="text-green-300 whitespace-pre-wrap">{result.stdout}</pre>
                      </div>
                    )}
                    {result.stderr && (
                      <div>
                        <h5 className="text-yellow-400 font-medium mb-1">警告：</h5>
                        <pre className="text-gray-300 whitespace-pre-wrap">{result.stderr}</pre>
                      </div>
                    )}
                    {!result.stdout && !result.stderr && (
                      <div className="text-green-400">代码执行成功！</div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {result.stdout && (
                      <div>
                        <pre className="text-green-300 whitespace-pre-wrap">{result.stdout}</pre>
                      </div>
                    )}
                    {result.stderr && (
                      <div>
                        <h5 className="text-yellow-400 font-medium mb-1">警告：</h5>
                        <pre className="text-gray-300 whitespace-pre-wrap">{result.stderr}</pre>
                      </div>
                    )}
                    {result.error && (
                      <div className="text-red-400">
                        <h5 className="font-medium mb-1">错误：</h5>
                        <pre className="whitespace-pre-wrap">
                          类型：{result.error.type}
                          消息：{result.error.message}
                          {result.error.lineNumber !== undefined && `\n行号：${result.error.lineNumber}`}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleRunCode}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                disabled={runningCode}
              >
                {runningCode ? '运行中...' : '运行代码'}
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                提交练习
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                {showAnswers ? '隐藏参考答案' : '显示参考答案'}
              </button>
            </div>
            {exercise.tasks.map((task) => (
              <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">任务 {task.id}: {task.title}</h3>
                {task.analysis && task.analysis.map((question, qIndex) => (
                  <div key={qIndex} className="mb-5">
                    <p className="text-gray-700 mb-2 font-medium">{qIndex + 1}. {question}</p>
                    <div className="bg-white p-3 rounded-md border border-gray-200 mb-2">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="请输入你的分析..."
                      />
                    </div>
                    {showAnswers && task.answers && (
                      <div className="bg-green-50 p-3 rounded-md border border-green-200">
                        <p className="text-green-800 font-medium mb-1">参考答案：</p>
                        <p className="text-green-700">{task.answers[qIndex]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            {/* 总体评分 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {score}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">总体评分</h3>
                  <p className="text-gray-600">{score >= 90 ? '优秀' : score >= 70 ? '良好' : score >= 60 ? '及格' : '需要改进'}</p>
                </div>
              </div>
              <p className="text-gray-700">{feedback}</p>
            </div>

            {/* 测试用例结果 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaCode className="mr-2 text-blue-600" />
                测试用例结果
              </h3>
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${test.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">测试 {index + 1}: {test.input}</h4>
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-600">期望结果:</span>
                            <p className="text-gray-700">{test.expected}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">实际结果:</span>
                            <p className={`${test.passed ? 'text-green-600' : 'text-red-600'}`}>{test.actual}</p>
                          </div>
                          {!test.passed && test.error && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">错误信息:</span>
                              <p className="text-red-600">{test.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {test.passed ? <FaCheck /> : <FaTimes />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 代码分析 */}
            {codeAnalysis && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaChartBar className="mr-2 text-purple-600" />
                  代码分析
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">代码质量</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${codeAnalysis.codeQuality}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{codeAnalysis.codeQuality}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">性能</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${codeAnalysis.performance}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{codeAnalysis.performance}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">代码风格</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${codeAnalysis.style}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{codeAnalysis.style}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <FaLightbulb className="mr-2 text-yellow-500" />
                    改进建议
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {codeAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 案例分析答案对比 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaLightbulb className="mr-2 text-yellow-600" />
                案例分析答案对比
              </h3>
              <div className="space-y-6">
                {exercise.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">任务 {task.id}: {task.title}</h4>
                    {task.analysis?.map((question, qIndex) => (
                      <div key={qIndex} className="mb-4">
                        <p className="text-gray-700 font-medium mb-2">{qIndex + 1}. {question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-md border border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">参考答案：</p>
                            <p className="text-green-700">{task.answers?.[qIndex] || '暂无答案'}</p>
                          </div>
                          <div className="bg-white p-3 rounded-md border border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">你的答案（请自行填写）：</p>
                            <p className="text-gray-500 italic">（根据你在案例分析中的填写内容进行对比）</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 学习资源推荐 */}
            {learningResources.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBook className="mr-2 text-green-600" />
                  推荐学习资源
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {learningResources.map((resource) => (
                    <div key={resource.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${resource.type === 'article' ? 'bg-blue-100 text-blue-800' : resource.type === 'video' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {resource.type === 'article' ? '文章' : resource.type === 'video' ? '视频' : '课程'}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <a href={resource.url} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        查看资源
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default PracticeDetail;