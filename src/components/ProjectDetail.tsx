import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode } from '../services/pyodideService';
import { saveProjectProgress, getProjectProgress, saveChatHistory, getChatHistory } from '../services/storageService';
import { getCodeCorrection, getHint } from '../services/aiService';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id || '1';
  
  // 项目数据
  const projects = {
    '1': {
      title: '项目1：基础数据处理',
      description: '学习使用pandas进行基本的数据处理和分析',
      difficulty: '初级',
      estimatedTime: '30分钟',
      objectives: [
        '学习使用pandas读取和查看数据',
        '学习基本的数据清洗操作',
        '学习数据统计和分析'
      ],
      prerequisites: 'Python基础语法',
      dataset: `import pandas as pd
import numpy as np

# 创建示例数据集
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, 30, 35, 40, 45],
    'city': ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'],
    'salary': [50000, 60000, 70000, 80000, 90000]
}

df = pd.DataFrame(data)
print('原始数据:')
print(df)`,
      tasks: [
        {
          id: 1,
          title: '查看数据基本信息',
          description: '使用info()和head()方法查看数据的基本信息',
          code: `import pandas as pd
import numpy as np

# 创建示例数据集
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, 30, 35, 40, 45],
    'city': ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'],
    'salary': [50000, 60000, 70000, 80000, 90000]
}

df = pd.DataFrame(data)

print('数据基本信息:')
print(df.info())

print('\n前5行数据:')
print(df.head())`
        },
        {
          id: 2,
          title: '数据统计分析',
          description: '计算数据的基本统计信息',
          code: `import pandas as pd
import numpy as np

# 创建示例数据集
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, 30, 35, 40, 45],
    'city': ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'],
    'salary': [50000, 60000, 70000, 80000, 90000]
}

df = pd.DataFrame(data)

print('数据统计信息:')
print(df.describe())

print('\n平均工资:')
print(df['salary'].mean())

print('\n最大年龄:')
print(df['age'].max())`
        },
        {
          id: 3,
          title: '数据筛选和排序',
          description: '根据条件筛选数据并排序',
          code: `import pandas as pd
import numpy as np

# 创建示例数据集
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, 30, 35, 40, 45],
    'city': ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'],
    'salary': [50000, 60000, 70000, 80000, 90000]
}

df = pd.DataFrame(data)

# 筛选年龄大于30的员工
print('年龄大于30的员工:')
print(df[df['age'] > 30])

# 按工资降序排序
print('\n按工资降序排序:')
print(df.sort_values('salary', ascending=False))`
        }
      ],
      practice: `import pandas as pd
import numpy as np

# 创建练习数据集
data = {
    'product': ['A', 'B', 'C', 'D', 'E'],
    'price': [100, 200, 150, 300, 250],
    'sales': [10, 20, 15, 25, 30],
    'profit': [20, 40, 30, 60, 50]
}

df = pd.DataFrame(data)

# 练习1：计算每个产品的销售额（price * sales）
# 练习2：计算总销售额和总利润
# 练习3：按利润降序排序
# 练习4：筛选销售额大于200的产品`
    },
    '2': {
      title: '项目2：数据可视化',
      description: '学习使用matplotlib和seaborn创建各种图表',
      difficulty: '初级',
      estimatedTime: '45分钟',
      objectives: [
        '学习使用matplotlib创建基本图表',
        '学习使用seaborn创建更美观的图表',
        '学习自定义图表样式'
      ],
      prerequisites: 'Python基础语法和pandas基础',
      dataset: `import pandas as pd
import numpy as np

# 创建示例数据集
data = {
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'sales': [1000, 1500, 1200, 1800, 2000, 2500],
    'profit': [200, 300, 240, 360, 400, 500]
}

df = pd.DataFrame(data)`,
      tasks: [
        {
          id: 1,
          title: '创建折线图',
          description: '使用matplotlib创建销售额和利润的折线图',
          code: `import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 创建示例数据集
data = {
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'sales': [1000, 1500, 1200, 1800, 2000, 2500],
    'profit': [200, 300, 240, 360, 400, 500]
}

df = pd.DataFrame(data)

plt.figure(figsize=(10, 6))
plt.plot(df['month'], df['sales'], label='销售额', marker='o')
plt.plot(df['month'], df['profit'], label='利润', marker='s')
plt.title('月度销售额和利润')
plt.xlabel('月份')
plt.ylabel('金额')
plt.legend()
plt.grid(True)
plt.savefig('monthly_sales_profit.png', dpi=150, bbox_inches='tight')
print("图表已保存为 monthly_sales_profit.png")`
        },
        {
          id: 2,
          title: '创建柱状图',
          description: '使用matplotlib创建销售额的柱状图',
          code: `import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 创建示例数据集
data = {
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'sales': [1000, 1500, 1200, 1800, 2000, 2500],
    'profit': [200, 300, 240, 360, 400, 500]
}

df = pd.DataFrame(data)

plt.figure(figsize=(10, 6))
plt.bar(df['month'], df['sales'], color='blue')
plt.title('月度销售额')
plt.xlabel('月份')
plt.ylabel('销售额')
plt.grid(axis='y')
plt.savefig('monthly_sales_bar.png', dpi=150, bbox_inches='tight')
print("图表已保存为 monthly_sales_bar.png")`
        },
        {
          id: 3,
          title: '创建饼图',
          description: '使用matplotlib创建销售额的饼图',
          code: `import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 创建示例数据集
data = {
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'sales': [1000, 1500, 1200, 1800, 2000, 2500],
    'profit': [200, 300, 240, 360, 400, 500]
}

df = pd.DataFrame(data)

plt.figure(figsize=(8, 8))
plt.pie(df['sales'], labels=df['month'], autopct='%1.1f%%')
plt.title('月度销售额占比')
plt.savefig('monthly_sales_pie.png', dpi=150, bbox_inches='tight')
print("图表已保存为 monthly_sales_pie.png")`
        }
      ],
      practice: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 创建练习数据集
data = {
    'category': ['电子产品', '服装', '食品', '图书', '化妆品'],
    'sales': [5000, 3000, 2000, 1500, 2500],
    'profit': [1000, 600, 400, 300, 500]
}

df = pd.DataFrame(data)

# 练习1：使用seaborn创建销售额的柱状图
# 练习2：创建销售额和利润的双轴图表
# 练习3：创建利润占比的饼图
# 练习4：自定义图表样式，添加标题和标签`
    },
    '3': {
      title: '项目3：统计分析',
      description: '学习使用numpy和scipy进行基本的统计分析',
      difficulty: '中级',
      estimatedTime: '60分钟',
      objectives: [
        '学习基本的统计概念',
        '学习使用numpy进行统计计算',
        '学习使用scipy进行假设检验'
      ],
      prerequisites: 'Python基础语法、pandas基础和基本的数学知识',
      dataset: `import numpy as np
import pandas as pd

# 创建示例数据集
np.random.seed(42)
data = {
    'height': np.random.normal(170, 10, 100),  # 正态分布的身高数据
    'weight': np.random.normal(65, 10, 100),   # 正态分布的体重数据
    'score': np.random.normal(80, 15, 100)     # 正态分布的分数数据
}

df = pd.DataFrame(data)`,
      tasks: [
        {
          id: 1,
          title: '基本统计量计算',
          description: '计算数据的基本统计量',
          code: `import numpy as np
import pandas as pd

# 创建示例数据集
np.random.seed(42)
data = {
    'height': np.random.normal(170, 10, 100),  # 正态分布的身高数据
    'weight': np.random.normal(65, 10, 100),   # 正态分布的体重数据
    'score': np.random.normal(80, 15, 100)     # 正态分布的分数数据
}

df = pd.DataFrame(data)

print('身高统计量:')
print('均值:', df['height'].mean())
print('标准差:', df['height'].std())
print('最小值:', df['height'].min())
print('最大值:', df['height'].max())
print('中位数:', df['height'].median())

print('\n体重统计量:')
print('均值:', df['weight'].mean())
print('标准差:', df['weight'].std())

print('\n分数统计量:')
print('均值:', df['score'].mean())
print('标准差:', df['score'].std())`
        },
        {
          id: 2,
          title: '相关性分析',
          description: '分析变量之间的相关性',
          code: `import numpy as np
import pandas as pd

# 创建示例数据集
np.random.seed(42)
data = {
    'height': np.random.normal(170, 10, 100),  # 正态分布的身高数据
    'weight': np.random.normal(65, 10, 100),   # 正态分布的体重数据
    'score': np.random.normal(80, 15, 100)     # 正态分布的分数数据
}

df = pd.DataFrame(data)

print('相关性矩阵:')
print(df.corr())

print('\n身高和体重的相关系数:', df['height'].corr(df['weight']))
print('身高和分数的相关系数:', df['height'].corr(df['score']))
print('体重和分数的相关系数:', df['weight'].corr(df['score']))`
        },
        {
          id: 3,
          title: '假设检验',
          description: '使用t检验分析两组数据的差异',
          code: `import numpy as np
import pandas as pd
from scipy import stats

# 创建示例数据集
np.random.seed(42)
group1 = np.random.normal(80, 10, 50)  # 第一组数据
group2 = np.random.normal(85, 10, 50)  # 第二组数据

print('第一组均值:', group1.mean())
print('第二组均值:', group2.mean())

# 独立样本t检验
statistic, p_value = stats.ttest_ind(group1, group2)
print('\nt检验结果:')
print('统计量:', statistic)
print('p值:', p_value)

if p_value < 0.05:
    print('差异显著')
else:
    print('差异不显著')`
        }
      ],
      practice: `import numpy as np
import pandas as pd
from scipy import stats

# 创建练习数据集
np.random.seed(42)
data = {
    'group_a': np.random.normal(75, 10, 30),  # A组数据
    'group_b': np.random.normal(80, 10, 30),  # B组数据
    'group_c': np.random.normal(85, 10, 30)   # C组数据
}

df = pd.DataFrame(data)

# 练习1：计算每组数据的基本统计量
# 练习2：分析三组数据之间的相关性
# 练习3：使用ANOVA分析三组数据的差异
# 练习4：使用t检验分析A组和B组的差异`
    },
    '4': {
      title: '项目4：数据挖掘',
      description: '学习使用scikit-learn进行数据挖掘',
      difficulty: '中级',
      estimatedTime: '90分钟',
      objectives: [
        '学习数据挖掘的基本概念',
        '学习使用scikit-learn进行特征工程',
        '学习使用scikit-learn进行数据挖掘算法应用'
      ],
      prerequisites: 'Python基础语法、pandas基础和统计分析基础',
      dataset: `import pandas as pd
import numpy as np
from sklearn.datasets import load_iris

# 加载鸢尾花数据集
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['target'] = iris.target
print('数据集基本信息:')
print(df.head())
print('\n目标变量分布:')
print(df['target'].value_counts())`,
      tasks: [
        {
          id: 1,
          title: '数据预处理',
          description: '对数据进行预处理，包括缺失值处理和特征标准化',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler

# 加载鸢尾花数据集
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['target'] = iris.target

# 检查缺失值
print('缺失值情况:')
print(df.isnull().sum())

# 特征标准化
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df.iloc[:, :-1])

print('\n标准化后的特征:')
print(pd.DataFrame(scaled_features, columns=iris.feature_names).head())`
        },
        {
          id: 2,
          title: '特征选择',
          description: '使用相关系数进行特征选择',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_iris

# 加载鸢尾花数据集
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['target'] = iris.target

# 计算特征与目标变量的相关系数
correlations = df.corr()['target'].abs().sort_values(ascending=False)
print('特征与目标变量的相关系数:')
print(correlations)

# 选择相关性最高的前2个特征
selected_features = correlations.index[1:3].tolist()
print('\n选择的特征:', selected_features)`
        },
        {
          id: 3,
          title: '聚类分析',
          description: '使用K-means算法进行聚类分析',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# 加载鸢尾花数据集
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)

# 使用K-means进行聚类
kmeans = KMeans(n_clusters=3, random_state=42)
df['cluster'] = kmeans.fit_predict(df)

# 计算轮廓系数
silhouette_avg = silhouette_score(df.iloc[:, :-1], df['cluster'])
print('轮廓系数:', silhouette_avg)

print('\n聚类结果:')
print(df['cluster'].value_counts())`
        }
      ],
      practice: `import pandas as pd
import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# 加载葡萄酒数据集
wine = load_wine()
df = pd.DataFrame(data=wine.data, columns=wine.feature_names)
df['target'] = wine.target

# 练习1：对数据进行预处理和标准化
# 练习2：使用相关系数进行特征选择
# 练习3：使用K-means算法进行聚类分析
# 练习4：计算聚类结果的评估指标`
    },
    '5': {
      title: '项目5：机器学习基础',
      description: '学习机器学习的基本概念和算法',
      difficulty: '中级',
      estimatedTime: '120分钟',
      objectives: [
        '学习机器学习的基本概念',
        '学习监督学习和无监督学习的区别',
        '学习使用scikit-learn实现基本的机器学习算法'
      ],
      prerequisites: 'Python基础语法、pandas基础和统计分析基础',
      dataset: `import pandas as pd
import numpy as np
from sklearn.datasets import load_diabetes

# 加载糖尿病数据集
diabetes = load_diabetes()
df = pd.DataFrame(data=diabetes.data, columns=diabetes.feature_names)
df['target'] = diabetes.target
print('数据集基本信息:')
print(df.head())
print('\n目标变量描述:')
print(df['target'].describe())`,
      tasks: [
        {
          id: 1,
          title: '数据集划分',
          description: '将数据集划分为训练集和测试集',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

# 加载糖尿病数据集
diabetes = load_diabetes()
df = pd.DataFrame(data=diabetes.data, columns=diabetes.feature_names)
df['target'] = diabetes.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print('训练集大小:', X_train.shape)
print('测试集大小:', X_test.shape)`
        },
        {
          id: 2,
          title: '线性回归模型',
          description: '使用线性回归模型进行预测',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 加载糖尿病数据集
diabetes = load_diabetes()
df = pd.DataFrame(data=diabetes.data, columns=diabetes.feature_names)
df['target'] = diabetes.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练线性回归模型
model = LinearRegression()
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print('均方误差:', mse)
print('R²评分:', r2)`
        },
        {
          id: 3,
          title: '决策树模型',
          description: '使用决策树模型进行预测',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 加载糖尿病数据集
diabetes = load_diabetes()
df = pd.DataFrame(data=diabetes.data, columns=diabetes.feature_names)
df['target'] = diabetes.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练决策树模型
model = DecisionTreeRegressor(max_depth=5, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print('均方误差:', mse)
print('R²评分:', r2)`
        }
      ],
      practice: `import pandas as pd
import numpy as np
from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 注意：load_boston已被弃用，这里仅作为练习
# 实际使用时可使用其他数据集

# 练习1：加载数据集并进行基本分析
# 练习2：将数据集划分为训练集和测试集
# 练习3：使用线性回归模型进行预测并评估
# 练习4：使用决策树模型进行预测并评估`
    },
    '6': {
      title: '项目6：分类算法',
      description: '学习使用分类算法解决实际问题',
      difficulty: '中级',
      estimatedTime: '120分钟',
      objectives: [
        '学习分类算法的基本概念',
        '学习使用scikit-learn实现常见的分类算法',
        '学习分类模型的评估方法'
      ],
      prerequisites: 'Python基础语法、pandas基础和机器学习基础',
      dataset: `import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer

# 加载乳腺癌数据集
cancer = load_breast_cancer()
df = pd.DataFrame(data=cancer.data, columns=cancer.feature_names)
df['target'] = cancer.target
print('数据集基本信息:')
print(df.head())
print('\n目标变量分布:')
print(df['target'].value_counts())`,
      tasks: [
        {
          id: 1,
          title: '逻辑回归模型',
          description: '使用逻辑回归模型进行分类',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 加载乳腺癌数据集
cancer = load_breast_cancer()
df = pd.DataFrame(data=cancer.data, columns=cancer.feature_names)
df['target'] = cancer.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练逻辑回归模型
model = LogisticRegression(max_iter=10000, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

print('准确率:', accuracy)
print('\n混淆矩阵:')
print(conf_matrix)
print('\n分类报告:')
print(class_report)`
        },
        {
          id: 2,
          title: '支持向量机模型',
          description: '使用支持向量机模型进行分类',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 加载乳腺癌数据集
cancer = load_breast_cancer()
df = pd.DataFrame(data=cancer.data, columns=cancer.feature_names)
df['target'] = cancer.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练支持向量机模型
model = SVC(kernel='rbf', random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

print('准确率:', accuracy)
print('\n混淆矩阵:')
print(conf_matrix)
print('\n分类报告:')
print(class_report)`
        },
        {
          id: 3,
          title: '随机森林模型',
          description: '使用随机森林模型进行分类',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 加载乳腺癌数据集
cancer = load_breast_cancer()
df = pd.DataFrame(data=cancer.data, columns=cancer.feature_names)
df['target'] = cancer.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练随机森林模型
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

print('准确率:', accuracy)
print('\n混淆矩阵:')
print(conf_matrix)
print('\n分类报告:')
print(class_report)`
        }
      ],
      practice: `import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 加载鸢尾花数据集
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['target'] = iris.target

# 练习1：将数据集划分为训练集和测试集
# 练习2：使用逻辑回归模型进行分类并评估
# 练习3：使用支持向量机模型进行分类并评估
# 练习4：使用随机森林模型进行分类并评估`
    },
    '7': {
      title: '项目7：回归分析',
      description: '学习使用回归算法进行预测',
      difficulty: '高级',
      estimatedTime: '150分钟',
      objectives: [
        '学习回归分析的基本概念',
        '学习使用scikit-learn实现各种回归算法',
        '学习回归模型的评估和优化'
      ],
      prerequisites: 'Python基础语法、pandas基础和机器学习基础',
      dataset: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing

# 加载加州房价数据集
housing = fetch_california_housing()
df = pd.DataFrame(data=housing.data, columns=housing.feature_names)
df['MedHouseVal'] = housing.target
print('数据集基本信息:')
print(df.head())
print('\n目标变量描述:')
print(df['MedHouseVal'].describe())`,
      tasks: [
        {
          id: 1,
          title: '多元线性回归',
          description: '使用多元线性回归模型进行预测',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 加载加州房价数据集
housing = fetch_california_housing()
df = pd.DataFrame(data=housing.data, columns=housing.feature_names)
df['MedHouseVal'] = housing.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['MedHouseVal']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练多元线性回归模型
model = LinearRegression()
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print('均方误差:', mse)
print('R²评分:', r2)

# 查看特征重要性
print('\n特征系数:')
for feature, coef in zip(housing.feature_names, model.coef_):
    print(f'{feature}: {coef}')`
        },
        {
          id: 2,
          title: '岭回归',
          description: '使用岭回归模型进行预测',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, r2_score

# 加载加州房价数据集
housing = fetch_california_housing()
df = pd.DataFrame(data=housing.data, columns=housing.feature_names)
df['MedHouseVal'] = housing.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['MedHouseVal']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练岭回归模型
model = Ridge(alpha=1.0, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print('均方误差:', mse)
print('R²评分:', r2)`
        },
        {
          id: 3,
          title: '梯度提升回归',
          description: '使用梯度提升回归模型进行预测',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 加载加州房价数据集
housing = fetch_california_housing()
df = pd.DataFrame(data=housing.data, columns=housing.feature_names)
df['MedHouseVal'] = housing.target

# 划分数据集
X = df.iloc[:, :-1]
y = df['MedHouseVal']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练梯度提升回归模型
model = GradientBoostingRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print('均方误差:', mse)
print('R²评分:', r2)

# 查看特征重要性
print('\n特征重要性:')
for feature, importance in zip(housing.feature_names, model.feature_importances_):
    print(f'{feature}: {importance}')`
        }
      ],
      practice: `import pandas as pd
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 加载糖尿病数据集
diabetes = load_diabetes()
df = pd.DataFrame(data=diabetes.data, columns=diabetes.feature_names)
df['target'] = diabetes.target

# 练习1：将数据集划分为训练集和测试集
# 练习2：使用多元线性回归模型进行预测并评估
# 练习3：使用岭回归模型进行预测并评估
# 练习4：使用梯度提升回归模型进行预测并评估`
    },
    '8': {
      title: '项目8：聚类分析',
      description: '学习使用聚类算法分析数据',
      difficulty: '高级',
      estimatedTime: '150分钟',
      objectives: [
        '学习聚类分析的基本概念',
        '学习使用scikit-learn实现各种聚类算法',
        '学习聚类结果的评估方法'
      ],
      prerequisites: 'Python基础语法、pandas基础和机器学习基础',
      dataset: `import pandas as pd
import numpy as np
from sklearn.datasets import load_wine

# 加载葡萄酒数据集
wine = load_wine()
df = pd.DataFrame(data=wine.data, columns=wine.feature_names)
df['target'] = wine.target
print('数据集基本信息:')
print(df.head())
print('\n目标变量分布:')
print(df['target'].value_counts())`,
      tasks: [
        {
          id: 1,
          title: 'K-means聚类',
          description: '使用K-means算法进行聚类分析',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score

# 加载葡萄酒数据集
wine = load_wine()
df = pd.DataFrame(data=wine.data, columns=wine.feature_names)
true_labels = wine.target

# 数据标准化
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df)

# 使用K-means进行聚类
kmeans = KMeans(n_clusters=3, random_state=42)
predicted_labels = kmeans.fit_predict(scaled_data)

# 评估聚类结果
silhouette_avg = silhouette_score(scaled_data, predicted_labels)
arand_score = adjusted_rand_score(true_labels, predicted_labels)

print('轮廓系数:', silhouette_avg)
print('调整兰德指数:', arand_score)
print('\n聚类结果分布:')
print(pd.Series(predicted_labels).value_counts())`
        },
        {
          id: 2,
          title: '层次聚类',
          description: '使用层次聚类算法进行分析',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score, adjusted_rand_score

# 加载葡萄酒数据集
wine = load_wine()
df = pd.DataFrame(data=wine.data, columns=wine.feature_names)
true_labels = wine.target

# 数据标准化
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df)

# 使用层次聚类
agg_clustering = AgglomerativeClustering(n_clusters=3)
predicted_labels = agg_clustering.fit_predict(scaled_data)

# 评估聚类结果
silhouette_avg = silhouette_score(scaled_data, predicted_labels)
arand_score = adjusted_rand_score(true_labels, predicted_labels)

print('轮廓系数:', silhouette_avg)
print('调整兰德指数:', arand_score)
print('\n聚类结果分布:')
print(pd.Series(predicted_labels).value_counts())`
        },
        {
          id: 3,
          title: 'DBSCAN聚类',
          description: '使用DBSCAN算法进行聚类分析',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.metrics import silhouette_score, adjusted_rand_score

# 加载葡萄酒数据集
wine = load_wine()
df = pd.DataFrame(data=wine.data, columns=wine.feature_names)
true_labels = wine.target

# 数据标准化
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df)

# 使用DBSCAN进行聚类
dbscan = DBSCAN(eps=1.2, min_samples=5)
predicted_labels = dbscan.fit_predict(scaled_data)

# 评估聚类结果
# 排除噪声点（标签为-1）
valid_indices = predicted_labels != -1
if len(valid_indices) > 1:
    silhouette_avg = silhouette_score(scaled_data[valid_indices], predicted_labels[valid_indices])
    print('轮廓系数:', silhouette_avg)

print('\n聚类结果分布:')
print(pd.Series(predicted_labels).value_counts())`
        }
      ],
      practice: `import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, adjusted_rand_score

# 加载鸢尾花数据集
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
true_labels = iris.target

# 练习1：对数据进行标准化处理
# 练习2：使用K-means算法进行聚类并评估
# 练习3：使用层次聚类算法进行聚类并评估
# 练习4：使用DBSCAN算法进行聚类并评估`
    },
    '9': {
      title: '项目9：时间序列分析',
      description: '学习分析和预测时间序列数据',
      difficulty: '高级',
      estimatedTime: '180分钟',
      objectives: [
        '学习时间序列分析的基本概念',
        '学习使用Python进行时间序列数据处理',
        '学习时间序列预测方法'
      ],
      prerequisites: 'Python基础语法、pandas基础和统计分析基础',
      dataset: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建示例时间序列数据
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=100, freq='D')
values = np.random.randn(100) + np.arange(100) * 0.1  # 带有趋势的随机数据
df = pd.DataFrame({'date': dates, 'value': values})
df.set_index('date', inplace=True)
print('数据集基本信息:')
print(df.head())
print('\n数据集描述:')
print(df.describe())`,
      tasks: [
        {
          id: 1,
          title: '时间序列可视化',
          description: '对时间序列数据进行可视化分析',
          code: `import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 创建示例时间序列数据
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=100, freq='D')
values = np.random.randn(100) + np.arange(100) * 0.1  # 带有趋势的随机数据
df = pd.DataFrame({'date': dates, 'value': values})
df.set_index('date', inplace=True)

# 绘制时间序列图
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['value'])
plt.title('时间序列数据')
plt.xlabel('日期')
plt.ylabel('值')
plt.grid(True)
plt.savefig('time_series.png', dpi=150, bbox_inches='tight')
print("图表已保存为 time_series.png")`
        },
        {
          id: 2,
          title: '时间序列分解',
          description: '对时间序列数据进行分解，提取趋势、季节和残差',
          code: `import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose

# 创建示例时间序列数据
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=100, freq='D')
values = np.random.randn(100) + np.arange(100) * 0.1  # 带有趋势的随机数据
df = pd.DataFrame({'date': dates, 'value': values})
df.set_index('date', inplace=True)

# 时间序列分解
decomposition = seasonal_decompose(df['value'], model='additive', period=7)  # 假设7天周期

print('趋势成分:')
print(decomposition.trend.head())
print('\n季节成分:')
print(decomposition.seasonal.head())
print('\n残差成分:')
print(decomposition.resid.head())`
        },
        {
          id: 3,
          title: '时间序列预测',
          description: '使用ARIMA模型进行时间序列预测',
          code: `import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA

# 创建示例时间序列数据
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=100, freq='D')
values = np.random.randn(100) + np.arange(100) * 0.1  # 带有趋势的随机数据
df = pd.DataFrame({'date': dates, 'value': values})
df.set_index('date', inplace=True)

# 拟合ARIMA模型
model = ARIMA(df['value'], order=(1, 1, 1))
model_fit = model.fit()

# 预测
forecast = model_fit.forecast(steps=10)
print('预测结果:')
print(forecast)`
        }
      ],
      practice: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA

# 创建练习时间序列数据
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=150, freq='D')
# 创建带有趋势和季节性的时间序列
values = np.random.randn(150) + np.arange(150) * 0.05 + np.sin(np.arange(150) * 2 * np.pi / 7) * 2
df = pd.DataFrame({'date': dates, 'value': values})
df.set_index('date', inplace=True)

# 练习1：绘制时间序列图并分析趋势
# 练习2：对时间序列进行分解
# 练习3：使用ARIMA模型进行预测
# 练习4：评估预测结果的准确性`
    },
    '10': {
      title: '项目10：商业分析实战',
      description: '综合运用所学技能进行商业分析',
      difficulty: '高级',
      estimatedTime: '240分钟',
      objectives: [
        '学习商业分析的基本流程',
        '综合运用所学的数据分析和机器学习技能',
        '学习如何将分析结果转化为商业洞察'
      ],
      prerequisites: 'Python基础语法、pandas基础、统计分析基础和机器学习基础',
      dataset: `import pandas as pd
import numpy as np

# 创建示例商业数据集
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=365, freq='D')
products = ['A', 'B', 'C', 'D', 'E']
data = []

for date in dates:
    for product in products:
        sales = np.random.poisson(100) + np.random.normal(0, 10)
        price = np.random.uniform(10, 100)
        cost = price * np.random.uniform(0.6, 0.8)
        profit = sales * (price - cost)
        region = np.random.choice(['North', 'South', 'East', 'West'])
        data.append([date, product, sales, price, cost, profit, region])

df = pd.DataFrame(data, columns=['date', 'product', 'sales', 'price', 'cost', 'profit', 'region'])
print('数据集基本信息:')
print(df.head())
print('\n数据集描述:')
print(df.describe())`,
      tasks: [
        {
          id: 1,
          title: '数据探索和可视化',
          description: '对商业数据进行探索性分析和可视化',
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 创建示例商业数据集
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=365, freq='D')
products = ['A', 'B', 'C', 'D', 'E']
data = []

for date in dates:
    for product in products:
        sales = np.random.poisson(100) + np.random.normal(0, 10)
        price = np.random.uniform(10, 100)
        cost = price * np.random.uniform(0.6, 0.8)
        profit = sales * (price - cost)
        region = np.random.choice(['North', 'South', 'East', 'West'])
        data.append([date, product, sales, price, cost, profit, region])

df = pd.DataFrame(data, columns=['date', 'product', 'sales', 'price', 'cost', 'profit', 'region'])

# 按产品汇总销售和利润
product_summary = df.groupby('product').agg({'sales': 'sum', 'profit': 'sum'}).reset_index()
print('产品销售和利润汇总:')
print(product_summary)

# 按地区汇总销售和利润
region_summary = df.groupby('region').agg({'sales': 'sum', 'profit': 'sum'}).reset_index()
print('\n地区销售和利润汇总:')
print(region_summary)

# 时间序列分析
monthly_data = df.resample('M', on='date').agg({'sales': 'sum', 'profit': 'sum'}).reset_index()
print('\n月度销售和利润:')
print(monthly_data.head())`
        },
        {
          id: 2,
          title: '销售预测模型',
          description: '使用机器学习模型预测产品销售',
          code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 创建示例商业数据集
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=365, freq='D')
products = ['A', 'B', 'C', 'D', 'E']
data = []

for date in dates:
    for product in products:
        sales = np.random.poisson(100) + np.random.normal(0, 10)
        price = np.random.uniform(10, 100)
        cost = price * np.random.uniform(0.6, 0.8)
        profit = sales * (price - cost)
        region = np.random.choice(['North', 'South', 'East', 'West'])
        data.append([date, product, sales, price, cost, profit, region])

df = pd.DataFrame(data, columns=['date', 'product', 'sales', 'price', 'cost', 'profit', 'region'])

# 特征工程
df['day_of_week'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month

# 独热编码
df = pd.get_dummies(df, columns=['product', 'region'])

# 准备特征和目标变量
X = df.drop(['date', 'sales', 'profit'], axis=1)
y = df['sales']

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练随机森林回归模型
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print('均方误差:', mse)
print('R²评分:', r2)

# 查看特征重要性
feature_importance = pd.DataFrame({'feature': X.columns, 'importance': model.feature_importances_})
feature_importance = feature_importance.sort_values('importance', ascending=False)
print('\n特征重要性:')
print(feature_importance.head())`
        },
        {
          id: 3,
          title: '商业洞察和建议',
          description: '基于分析结果提供商业洞察和建议',
          code: `import pandas as pd
import numpy as np

# 创建示例商业数据集
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=365, freq='D')
products = ['A', 'B', 'C', 'D', 'E']
data = []

for date in dates:
    for product in products:
        sales = np.random.poisson(100) + np.random.normal(0, 10)
        price = np.random.uniform(10, 100)
        cost = price * np.random.uniform(0.6, 0.8)
        profit = sales * (price - cost)
        region = np.random.choice(['North', 'South', 'East', 'West'])
        data.append([date, product, sales, price, cost, profit, region])

df = pd.DataFrame(data, columns=['date', 'product', 'sales', 'price', 'cost', 'profit', 'region'])

# 计算产品利润率
df['profit_margin'] = (df['profit'] / (df['sales'] * df['price'])) * 100

# 产品分析
product_analysis = df.groupby('product').agg({
    'sales': 'sum',
    'profit': 'sum',
    'profit_margin': 'mean'
}).reset_index()

# 地区分析
region_analysis = df.groupby('region').agg({
    'sales': 'sum',
    'profit': 'sum',
    'profit_margin': 'mean'
}).reset_index()

print('产品分析:')
print(product_analysis.sort_values('profit', ascending=False))
print('\n地区分析:')
print(region_analysis.sort_values('profit', ascending=False))

# 提供商业建议
print('\n商业洞察和建议:')
print('1. 产品', product_analysis.loc[product_analysis['profit'].idxmax(), 'product'], '是最 profitable的产品，应重点推广')
print('2. 地区', region_analysis.loc[region_analysis['profit'].idxmax(), 'region'], '表现最佳，应加大投入')
print('3. 产品', product_analysis.loc[product_analysis['profit_margin'].idxmin(), 'product'], '利润率最低，需要优化成本结构')
print('4. 地区', region_analysis.loc[region_analysis['sales'].idxmin(), 'region'], '销售额最低，需要制定针对性营销策略')`
        }
      ],
      practice: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 创建练习商业数据集
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=365, freq='D')
products = ['X', 'Y', 'Z']
data = []

for date in dates:
    for product in products:
        # 不同产品有不同的销售模式
        if product == 'X':
            sales = np.random.poisson(150) + np.random.normal(0, 15)
        elif product == 'Y':
            sales = np.random.poisson(100) + np.random.normal(0, 10)
        else:
            sales = np.random.poisson(50) + np.random.normal(0, 5)
        
        price = np.random.uniform(20, 150)
        cost = price * np.random.uniform(0.5, 0.8)
        profit = sales * (price - cost)
        region = np.random.choice(['North', 'South', 'East', 'West'])
        data.append([date, product, sales, price, cost, profit, region])

df = pd.DataFrame(data, columns=['date', 'product', 'sales', 'price', 'cost', 'profit', 'region'])

# 练习1：对数据进行探索性分析和可视化
# 练习2：进行特征工程并构建销售预测模型
# 练习3：分析产品和地区表现
# 练习4：基于分析结果提供商业洞察和建议`
    }
  };

  const project = projects[projectId as keyof typeof projects] || projects['1'];
  const [code, setCode] = useState(project.tasks[0].code);
  const [result, setResult] = useState<{ success: boolean; stdout: string; stderr: string; error?: any; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>(getChatHistory(projectId));
  const [userMessage, setUserMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // 加载保存的进度
  React.useEffect(() => {
    const savedProgress = getProjectProgress(projectId);
    if (savedProgress.code) {
      setCode(savedProgress.code);
    }
  }, [projectId]);

  const handleRunCode = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleTaskChange = (index: number) => {
    setActiveTask(index);
    setCode(project.tasks[index].code);
  };

  const handleSaveProgress = () => {
    saveProjectProgress(projectId, { code, completed: true });
    alert('进度已保存！');
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    const newMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setUserMessage('');
    setAiLoading(true);
    
    try {
      const aiResponse = await getHint(userMessage);
      const aiMessage = { 
        role: 'assistant', 
        content: aiResponse.choices[0].message.content 
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setChatMessages(finalMessages);
      saveChatHistory(projectId, finalMessages);
    } catch (err) {
      console.error('AI请求错误:', err);
      const errorMessage = { 
        role: 'assistant', 
        content: '抱歉，AI服务暂时不可用，请稍后再试。' 
      };
      setChatMessages([...updatedMessages, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCodeCorrection = async () => {
    if (!code.trim()) return;
    
    const errorMessage = result?.error ? `${result.error.type}: ${result.error.message}` : '代码可能存在问题';
    const newMessage = { 
      role: 'user', 
      content: `我的代码可能有问题，请帮我分析：\n\n${code}\n\n错误信息：${errorMessage}` 
    };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setAiLoading(true);
    
    try {
      const aiResponse = await getCodeCorrection(code, errorMessage);
      const aiMessage = { 
        role: 'assistant', 
        content: aiResponse.choices[0].message.content 
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setChatMessages(finalMessages);
      saveChatHistory(projectId, finalMessages);
    } catch (err) {
      console.error('AI请求错误:', err);
      const errorMessage = { 
        role: 'assistant', 
        content: '抱歉，AI服务暂时不可用，请稍后再试。' 
      };
      setChatMessages([...updatedMessages, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{project.title}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧项目信息 */}
            <div className="lg:col-span-1">
              <div className="bg-yellow rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">项目信息</h2>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-text">难度：</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.difficulty === '初级' ? 'bg-green text-white' : project.difficulty === '中级' ? 'bg-blue text-white' : 'bg-red text-white'}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-text">预计时间：</span>
                    <span className="text-text">{project.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="font-medium text-text">学习目标：</span>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-text">
                      {project.objectives.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-text">前置知识：</span>
                    <p className="mt-2 text-text">{project.prerequisites}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">数据集</h2>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto max-h-40">
                  <pre>{project.dataset}</pre>
                </div>
              </div>
            </div>
            
            {/* 右侧代码编辑和运行 */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">任务列表</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tasks.map((task, index) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskChange(index)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTask === index ? 'bg-primary text-white' : 'bg-gray-200 text-text hover:bg-gray-300'}`}
                    >
                      任务 {task.id}: {task.title}
                    </button>
                  ))}
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-text">{project.tasks[activeTask].title}</h3>
                  <p className="text-text mb-4">{project.tasks[activeTask].description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">代码编辑器</h2>
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={code}
                  onChange={setCode}
                  name={`project-${projectId}-editor`}
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="rounded-lg shadow-sm"
                  style={{ height: '400px', width: '100%' }}
                />
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={handleRunCode}
                  disabled={loading}
                  className="bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? '运行中...' : '运行代码'}
                </button>
                <button
                  onClick={handleSaveProgress}
                  className="bg-secondary text-white py-3 px-8 rounded-full font-bold hover:bg-primary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5"
                >
                  保存进度
                </button>
                <button
                  onClick={handleCodeCorrection}
                  disabled={aiLoading}
                  className="bg-purple text-white py-3 px-8 rounded-full font-bold hover:bg-primary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {aiLoading ? '分析中...' : '代码纠错'}
                </button>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">运行结果</h2>
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
                <h2 className="text-xl font-semibold mb-4 text-primary">AI陪练</h2>
                <div className="bg-gray-100 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white text-text'}`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="text-left mb-4">
                      <div className="inline-block p-3 rounded-lg bg-white text-text">
                        AI正在思考...
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="输入你的问题..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={aiLoading || !userMessage.trim()}
                    className="bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6 text-primary">课后练习</h2>
            <div className="bg-purple rounded-xl p-6">
              <p className="text-text mb-4">请完成以下练习：</p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                <pre>{project.practice}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
