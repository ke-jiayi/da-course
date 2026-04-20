#!/usr/bin/env python3
"""
测试 TRCE 网站代码案例的运行情况
"""

import sys
import subprocess
import tempfile
import os

# 代码案例列表 - 使用转义字符串来避免语法错误
code_examples = [
    # 数据分析基础
    r"""
import pandas as pd
import numpy as np

# 示例数据分析代码
data = {
    "name": ["Alice", "Bob", "Charlie", "David"],
    "age": [25, 30, 35, 40],
    "salary": [50000, 60000, 70000, 80000]
}

df = pd.DataFrame(data)
print(df)
print("\n平均薪资:", df['salary'].mean())
print("最高薪资:", df['salary'].max())
print("最低薪资:", df['salary'].min())
print("薪资标准差:", df['salary'].std())
""",
    
    # 数据收集与预处理
    r"""
import pandas as pd

# 数据清洗示例
data = {
    "name": ["Alice", "Bob", None, "David"],
    "age": [25, None, 35, 40],
    "salary": [50000, 60000, 70000, None],
    "department": ["IT", "HR", "IT", "Finance"]
}

df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 填充缺失值
df['age'].fillna(df['age'].mean(), inplace=True)
df['salary'].fillna(df['salary'].mean(), inplace=True)
df['name'].fillna('Unknown', inplace=True)

# 数据转换
df['salary_category'] = pd.cut(df['salary'], bins=[0, 55000, 65000, 100000], labels=['低', '中', '高'])

print("\n清洗后的数据:")
print(df)

# 按部门分组统计
department_stats = df.groupby('department').agg({
    'salary': ['mean', 'count'],
    'age': 'mean'
})
print("\n部门统计:")
print(department_stats)
""",
    
    # 数据可视化基础
    r"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 示例数据
data = {
    "month": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    "sales": [12000, 15000, 18000, 16000, 20000, 22000],
    "profit": [2400, 3000, 3600, 3200, 4000, 4400]
}

df = pd.DataFrame(data)

# 创建折线图
plt.figure(figsize=(10, 6))
plt.plot(df['month'], df['sales'], marker='o', label='销售额')
plt.plot(df['month'], df['profit'], marker='s', label='利润')
plt.title('月度销售和利润')
plt.xlabel('月份')
plt.ylabel('金额')
plt.legend()
plt.grid(True)
plt.close()  # 关闭图表，避免显示

# 创建柱状图
plt.figure(figsize=(10, 6))
sns.barplot(x='month', y='sales', data=df)
plt.title('月度销售额')
plt.xlabel('月份')
plt.ylabel('销售额')
plt.close()  # 关闭图表，避免显示

print("图表创建成功")
""",
    
    # Python基础回顾
    r"""
# Python基础语法示例

# 变量和数据类型
name = "Alice"
age = 30
salary = 50000.50
is_employed = True

# 列表
fruits = ["apple", "banana", "cherry"]

# 字典
person = {
    "name": name,
    "age": age,
    "salary": salary,
    "is_employed": is_employed
}

# 循环
for fruit in fruits:
    print(f"I like {fruit}")

# 函数
def calculate_bonus(salary, rate=0.1):
    return salary * rate

print(f"Bonus: {calculate_bonus(salary)}")

# 列表推导式
squares = [x**2 for x in range(10)]
print("平方数:", squares)

#  lambda函数
double = lambda x: x * 2
print("Double 5:", double(5))
""",
    
    # NumPy数组操作
    r"""
import numpy as np

# 创建数组
a = np.array([1, 2, 3, 4, 5])
b = np.array([[1, 2, 3], [4, 5, 6]])

# 数组属性
print(f"a shape: {a.shape}")
print(f"b shape: {b.shape}")
print(f"a dtype: {a.dtype}")

# 数组操作
c = a + 1
d = a * 2
e = np.dot(a, a)

print(f"c: {c}")
print(f"d: {d}")
print(f"e: {e}")

# 数组索引和切片
f = b[:, 1:]  # 所有行，从第二列开始
g = b[0, :]  # 第一行所有列

print(f"f: {f}")
print(f"g: {g}")

# 数学函数
h = np.sin(a)
i = np.exp(a)

print(f"sin(a): {h}")
print(f"exp(a): {i}")
""",
    
    # Pandas数据处理
    r"""
import pandas as pd
import numpy as np

# 创建DataFrame
data = {
    "name": ["Alice", "Bob", "Charlie", "David", "Eve"],
    "age": [25, 30, 35, 40, 28],
    "department": ["IT", "HR", "IT", "Finance", "HR"],
    "salary": [50000, 60000, 70000, 80000, 55000]
}

df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 数据选择
print("\n选择name和salary列:")
print(df[["name", "salary"]])

# 条件筛选
print("\n工资大于60000的员工:")
print(df[df["salary"] > 60000])

# 分组统计
print("\n按部门分组统计平均工资:")
department_avg = df.groupby("department").agg({"salary": "mean"})
print(department_avg)

# 添加新列
df["salary_increase"] = df["salary"] * 0.1
df["new_salary"] = df["salary"] + df["salary_increase"]
print("\n添加新列后:")
print(df)

# 排序
sorted_df = df.sort_values(by="salary", ascending=False)
print("\n按工资降序排序:")
print(sorted_df)
""",
    
    # 机器学习基础概念
    r"""
# 机器学习基础概念示例
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# 生成示例数据
np.random.seed(42)
x = np.linspace(0, 10, 100)
y = 2 * x + 1 + np.random.normal(0, 1, 100)

# 重塑数据
x = x.reshape(-1, 1)

# 创建并训练模型
model = LinearRegression()
model.fit(x, y)

# 预测
y_pred = model.predict(x)

# 可视化结果
plt.figure(figsize=(10, 6))
plt.scatter(x, y, label="实际数据")
plt.plot(x, y_pred, color="red", label="预测线")
plt.title("线性回归示例")
plt.xlabel("X")
plt.ylabel("Y")
plt.legend()
plt.close()  # 关闭图表，避免显示

# 模型参数
print(f"斜率: {model.coef_[0]:.2f}")
print(f"截距: {model.intercept_:.2f}")
print(f"R² score: {model.score(x, y):.2f}")
""",
    
    # Python编程基础
    r"""
# Python编程基础示例
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Numpy基础操作
print("=== Numpy基础操作 ===")
# 创建数组
a = np.array([1, 2, 3, 4, 5])
b = np.array([[1, 2, 3], [4, 5, 6]])
print(f"一维数组: {a}")
print(f"二维数组:\n{b}")
print(f"数组形状: {b.shape}")

# 数组运算
c = a + 1
d = a * 2
print(f"a + 1: {c}")
print(f"a * 2: {d}")

# Pandas数据预处理
print("\n=== Pandas数据预处理 ===")
# 创建DataFrame
data = {
    "age": [25, 30, None, 40, 45],
    "gender": ["M", "F", "M", "F", "M"],
    "income": [50000, 60000, 70000, None, 90000],
    "purchase": [1, 0, 1, 1, 0]
}

df = pd.DataFrame(data)
print("原始数据:\n", df)

# 处理缺失值
df['age'].fillna(df['age'].mean(), inplace=True)
df['income'].fillna(df['income'].median(), inplace=True)
print("\n处理缺失值后:\n", df)

# 标签编码
label_encoder = LabelEncoder()
df['gender'] = label_encoder.fit_transform(df['gender'])
print("\n标签编码后:\n", df)

# 特征缩放
scaler = StandardScaler()
df[['age', 'income']] = scaler.fit_transform(df[['age', 'income']])
print("\n特征缩放后:\n", df)

# Scikit-learn基础
print("\n=== Scikit-learn基础 ===")
print("数据预处理完成，可用于机器学习模型训练")
""",
    
    # 核心知识点
    r"""
# 核心知识点示例
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score

# 线性回归
print("=== 线性回归 ===")
np.random.seed(42)
x = np.linspace(0, 10, 100).reshape(-1, 1)
y = 2 * x + 1 + np.random.normal(0, 1, 100).reshape(-1, 1)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

linear_model = LinearRegression()
linear_model.fit(x_train, y_train)
y_pred = linear_model.predict(x_test)
print(f"线性回归R² score: {r2_score(y_test, y_pred):.2f}")

# 逻辑回归
print("\n=== 逻辑回归 ===")
# 生成二分类数据
x = np.random.randn(100, 2)
y = (x[:, 0] + x[:, 1] > 0).astype(int)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

logistic_model = LogisticRegression()
logistic_model.fit(x_train, y_train)
y_pred = logistic_model.predict(x_test)
print(f"逻辑回归准确率: {accuracy_score(y_test, y_pred):.2f}")

# KNN分类
print("\n=== KNN分类 ===")
knn_model = KNeighborsClassifier(n_neighbors=3)
knn_model.fit(x_train, y_train)
y_pred = knn_model.predict(x_test)
print(f"KNN准确率: {accuracy_score(y_test, y_pred):.2f}")

# K-means聚类
print("\n=== K-means聚类 ===")
# 生成聚类数据
x = np.random.randn(100, 2)
kmeans = KMeans(n_clusters=3, random_state=42)
y_pred = kmeans.fit_predict(x)
print(f"聚类结果形状: {y_pred.shape}")
print(f"聚类中心:\n{kmeans.cluster_centers_}")

# 可视化聚类结果
plt.figure(figsize=(8, 6))
plt.scatter(x[:, 0], x[:, 1], c=y_pred, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c='red', marker='*')
plt.title('K-means聚类结果')
plt.close()  # 关闭图表，避免显示
""",
    
    # 广告投入与销量数据分析案例
    r"""
# 广告投入与销量数据分析案例
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

# 生成模拟数据
np.random.seed(42)
data_size = 100

# 特征：电视、广播、报纸广告投入
tv = np.random.rand(data_size) * 300
radio = np.random.rand(data_size) * 50
newspaper = np.random.rand(data_size) * 100

# 目标：销量（假设与广告投入正相关）
sales = 10 + 0.045 * tv + 0.18 * radio + 0.002 * newspaper + np.random.normal(0, 1, data_size)

# 创建DataFrame
df = pd.DataFrame({
    "TV": tv,
    "Radio": radio,
    "Newspaper": newspaper,
    "Sales": sales
})

print("数据前5行:\n", df.head())

# 数据可视化
plt.figure(figsize=(12, 4))

plt.subplot(131)
plt.scatter(df["TV"], df["Sales"])
plt.title("TV vs Sales")
plt.xlabel("TV广告投入")
plt.ylabel("销量")

plt.subplot(132)
plt.scatter(df["Radio"], df["Sales"])
plt.title("Radio vs Sales")
plt.xlabel("广播广告投入")
plt.ylabel("销量")

plt.subplot(133)
plt.scatter(df["Newspaper"], df["Sales"])
plt.title("Newspaper vs Sales")
plt.xlabel("报纸广告投入")
plt.ylabel("销量")

plt.tight_layout()
plt.close()  # 关闭图表，避免显示

# 准备特征和目标变量
x = df[["TV", "Radio", "Newspaper"]]
y = df["Sales"]

# 分割数据
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# 创建并训练模型
model = LinearRegression()
model.fit(x_train, y_train)

# 预测
y_pred = model.predict(x_test)

# 模型评估
r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

print(f"\n模型评估:")
print(f"R² score: {r2:.4f}")
print(f"均方误差 (MSE): {mse:.4f}")
print(f"均方根误差 (RMSE): {rmse:.4f}")

# 模型系数
print(f"\n模型系数:")
print(f"截距: {model.intercept_:.4f}")
print(f"TV系数: {model.coef_[0]:.4f}")
print(f"Radio系数: {model.coef_[1]:.4f}")
print(f"Newspaper系数: {model.coef_[2]:.4f}")
""",
    
    # 行业应用
    r"""
# 行业应用示例
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

print("=== 1. 用户流失预测 ===")
# 生成模拟数据
np.random.seed(42)
data_size = 1000

# 特征
age = np.random.randint(18, 70, data_size)
tenure = np.random.randint(1, 72, data_size)  # 月
monthly_charges = np.random.uniform(20, 100, data_size)
contract_type = np.random.choice(["Month-to-month", "One year", "Two year"], data_size)

# 目标变量：是否流失（0=未流失，1=流失）
# 构建流失概率模型
churn_prob = 1 / (1 + np.exp(-(0.02 * age + 0.05 * tenure - 0.01 * monthly_charges + \
                             (contract_type == "Month-to-month") * 1 + \
                             (contract_type == "One year") * 0.5 - 3)))
churn = np.random.binomial(1, churn_prob)

# 创建DataFrame
churn_df = pd.DataFrame({
    "age": age,
    "tenure": tenure,
    "monthly_charges": monthly_charges,
    "contract_type": contract_type,
    "churn": churn
})

# 数据预处理
label_encoder = LabelEncoder()
churn_df["contract_type"] = label_encoder.fit_transform(churn_df["contract_type"])

# 特征和目标
x_churn = churn_df.drop("churn", axis=1)
y_churn = churn_df["churn"]

# 分割数据
x_train, x_test, y_train, y_test = train_test_split(x_churn, y_churn, test_size=0.2, random_state=42)

# 特征缩放
scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_test_scaled = scaler.transform(x_test)

# 训练模型
churn_model = LogisticRegression()
churn_model.fit(x_train_scaled, y_train)

# 预测
y_pred = churn_model.predict(x_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"用户流失预测准确率: {accuracy:.4f}")

print("\n=== 2. 商品销量预估 ===")
# 生成模拟数据
data_size = 200

# 特征
price = np.random.uniform(10, 100, data_size)
promotion = np.random.choice([0, 1], data_size)  # 0=无促销，1=有促销
season = np.random.choice([0, 1, 2, 3], data_size)  # 0=春,1=夏,2=秋,3=冬
competitor_price = np.random.uniform(8, 110, data_size)

# 目标变量：销量
sales = 100 - 0.5 * price + 20 * promotion + \
        (season == 1) * 15 + (season == 3) * 10 + \
        0.3 * competitor_price + np.random.normal(0, 5, data_size)

# 确保销量为正
sales = np.maximum(sales, 10)

# 创建DataFrame
sales_df = pd.DataFrame({
    "price": price,
    "promotion": promotion,
    "season": season,
    "competitor_price": competitor_price,
    "sales": sales
})

# 特征和目标
x_sales = sales_df.drop("sales", axis=1)
y_sales = sales_df["sales"]

# 分割数据
x_train, x_test, y_train, y_test = train_test_split(x_sales, y_sales, test_size=0.2, random_state=42)

# 训练模型
sales_model = LinearRegression()
sales_model.fit(x_train, y_train)

# 预测
y_pred = sales_model.predict(x_test)
r2 = r2_score(y_test, y_pred)
print(f"商品销量预估R² score: {r2:.4f}")

# 模型系数
print("\n销量预估模型系数:")
print(f"截距: {sales_model.intercept_:.4f}")
print(f"价格系数: {sales_model.coef_[0]:.4f}")
print(f"促销系数: {sales_model.coef_[1]:.4f}")
print(f"季节系数: {sales_model.coef_[2]:.4f}")
print(f"竞争对手价格系数: {sales_model.coef_[3]:.4f}")
"""
]

# 测试代码案例
def test_code_examples():
    print("开始测试 TRCE 网站代码案例...\n")
    
    # 安装必要的依赖
    print("安装必要的依赖...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn"], 
                      check=True, capture_output=True, text=True)
        print("依赖安装成功！\n")
    except subprocess.CalledProcessError as e:
        print(f"依赖安装失败: {e.stderr}")
        return
    
    # 测试每个代码案例
    for i, code in enumerate(code_examples, 1):
        print(f"测试代码案例 {i}...")
        
        # 创建临时文件
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            # 运行代码
            result = subprocess.run([sys.executable, temp_file], 
                                   capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✓ 代码案例 {i} 运行成功！")
                print(f"  输出: {result.stdout[:100]}..." if result.stdout else "  无输出")
            else:
                print(f"✗ 代码案例 {i} 运行失败！")
                print(f"  错误: {result.stderr}")
        except subprocess.TimeoutExpired:
            print(f"✗ 代码案例 {i} 运行超时！")
        except Exception as e:
            print(f"✗ 代码案例 {i} 运行出错: {str(e)}")
        finally:
            # 删除临时文件
            os.unlink(temp_file)
        
        print()
    
    print("测试完成！")

if __name__ == "__main__":
    test_code_examples()
