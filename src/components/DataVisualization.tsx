import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

interface StepState {
  code: string;
  output: string | null;
  images: string[];
  isError: boolean;
  errorMessage: string;
  showAnswer: boolean;
  isLoading: boolean;
}

const starterCodeStep1 = `# ========================================
# Step 1: 使用 pandas 读取订单数据
# 目标: 加载数据并查看基本信息 (head/describe)
# ========================================

import pandas as pd
from io import StringIO

# 模拟从 CSV 文件读取订单数据
csv_data = """订单ID,产品名称,类别,销售数量,单价,销售额,订单日期
ORD001,无线耳机,电子产品,15,299,4485,2024-01-05
ORD002,智能手表,电子产品,8,1299,10392,2024-01-08
ORD003,运动T恤,服装,42,159,6678,2024-01-10
ORD004,保温杯,家居,28,89,2492,2024-01-12
ORD005,蓝牙音箱,电子产品,22,399,8778,2024-01-15
ORD006,运动鞋,服装,19,459,8721,2024-01-18
ORD007,台灯,家居,35,129,4515,2024-01-20
ORD008,机械键盘,电子产品,12,599,7188,2024-01-22
ORD009,牛仔裤,服装,31,299,9269,2024-01-25
ORD010,抱枕,家居,25,79,1975,2024-01-28
ORD011,数据线,电子产品,65,29,1885,2024-02-02
ORD012,羽绒服,服装,14,799,11186,2024-02-05
ORD013,香薰机,家居,18,199,3582,2024-02-08
ORD014,笔记本,文具,55,15,825,2024-02-10
ORD015,钢笔,文具,38,89,3382,2024-02-12
ORD016,笔记本电脑,电子产品,5,6999,34995,2024-02-15
ORD017,卫衣,服装,27,259,6993,2024-02-18
ORD018,收纳盒,家居,45,49,2205,2024-02-20
ORD019,充电宝,电子产品,33,149,4917,2024-02-22
ORD020,中性笔,文具,120,5,600,2024-02-25
"""

# TODO: 使用 pd.read_csv 读取 csv_data
# 提示: df = pd.read_csv(StringIO(csv_data))
df = None

# TODO: 打印数据集基本信息（形状shape）
print("数据集基本信息:")
# print(f"行数: {df.shape[0]}, 列数: {df.shape[1]}")

# TODO: 使用 head() 查看前 5 行
print("\\n前 5 行数据:")
# print(df.head())

# TODO: 使用 describe() 查看数值列的统计摘要
print("\\n统计摘要:")
# print(df.describe())

print("\\n✓ Step 1 完成！")
`;

const answerCodeStep1 = `# ========================================
# Step 1 参考答案
# ========================================

import pandas as pd
from io import StringIO

csv_data = """订单ID,产品名称,类别,销售数量,单价,销售额,订单日期
ORD001,无线耳机,电子产品,15,299,4485,2024-01-05
ORD002,智能手表,电子产品,8,1299,10392,2024-01-08
ORD003,运动T恤,服装,42,159,6678,2024-01-10
ORD004,保温杯,家居,28,89,2492,2024-01-12
ORD005,蓝牙音箱,电子产品,22,399,8778,2024-01-15
ORD006,运动鞋,服装,19,459,8721,2024-01-18
ORD007,台灯,家居,35,129,4515,2024-01-20
ORD008,机械键盘,电子产品,12,599,7188,2024-01-22
ORD009,牛仔裤,服装,31,299,9269,2024-01-25
ORD010,抱枕,家居,25,79,1975,2024-01-28
ORD011,数据线,电子产品,65,29,1885,2024-02-02
ORD012,羽绒服,服装,14,799,11186,2024-02-05
ORD013,香薰机,家居,18,199,3582,2024-02-08
ORD014,笔记本,文具,55,15,825,2024-02-10
ORD015,钢笔,文具,38,89,3382,2024-02-12
ORD016,笔记本电脑,电子产品,5,6999,34995,2024-02-15
ORD017,卫衣,服装,27,259,6993,2024-02-18
ORD018,收纳盒,家居,45,49,2205,2024-02-20
ORD019,充电宝,电子产品,33,149,4917,2024-02-22
ORD020,中性笔,文具,120,5,600,2024-02-25
"""

df = pd.read_csv(StringIO(csv_data))

print("=" * 50)
print("📊 Step 1: 数据加载与探索")
print("=" * 50)

print("\\n【1】数据集基本信息 (shape):")
print(f"  行数: {df.shape[0]} 条订单")
print(f"  列数: {df.shape[1]} 个字段")

print("\\n【2】字段名称 (columns):")
for col in df.columns:
    print(f"  - {col}")

print("\\n【3】前 5 行数据 (head()):")
print(df.head().to_string())

print("\\n【4】后 5 行数据 (tail()):")
print(df.tail().to_string())

print("\\n【5】数据类型 (dtypes):")
print(df.dtypes)

print("\\n【6】统计摘要 (describe()):")
print(df.describe().round(2).to_string())

print("\\n【7】各产品类别数量:")
print(df['类别'].value_counts().to_string())

print("\\n✓ Step 1 完成！已成功加载订单数据")
`;

const starterCodeStep2 = `# ========================================
# Step 2: 绘制柱状图和折线图
# 目标: 分析月度销售趋势与各类别销量
# ========================================

import pandas as pd
import matplotlib.pyplot as plt
from io import StringIO

csv_data = """订单ID,产品名称,类别,销售数量,单价,销售额,订单日期
ORD001,无线耳机,电子产品,15,299,4485,2024-01-05
ORD002,智能手表,电子产品,8,1299,10392,2024-01-08
ORD003,运动T恤,服装,42,159,6678,2024-01-10
ORD004,保温杯,家居,28,89,2492,2024-01-12
ORD005,蓝牙音箱,电子产品,22,399,8778,2024-01-15
ORD006,运动鞋,服装,19,459,8721,2024-01-18
ORD007,台灯,家居,35,129,4515,2024-01-20
ORD008,机械键盘,电子产品,12,599,7188,2024-01-22
ORD009,牛仔裤,服装,31,299,9269,2024-01-25
ORD010,抱枕,家居,25,79,1975,2024-01-28
ORD011,数据线,电子产品,65,29,1885,2024-02-02
ORD012,羽绒服,服装,14,799,11186,2024-02-05
ORD013,香薰机,家居,18,199,3582,2024-02-08
ORD014,笔记本,文具,55,15,825,2024-02-10
ORD015,钢笔,文具,38,89,3382,2024-02-12
ORD016,笔记本电脑,电子产品,5,6999,34995,2024-02-15
ORD017,卫衣,服装,27,259,6993,2024-02-18
ORD018,收纳盒,家居,45,49,2205,2024-02-20
ORD019,充电宝,电子产品,33,149,4917,2024-02-22
ORD020,中性笔,文具,120,5,600,2024-02-25
"""

df = pd.read_csv(StringIO(csv_data))
df['订单日期'] = pd.to_datetime(df['订单日期'])
df['月份'] = df['订单日期'].dt.to_period('M')

# TODO: 按月份汇总销售额，绘制折线图
monthly_sales = df.groupby('月份')['销售额'].sum()
print("月度销售额汇总:")
print(monthly_sales.to_string())

# TODO: 创建折线图
# plt.figure(figsize=(10, 6))
# plt.plot(monthly_sales.index.astype(str), monthly_sales.values, marker='o', linewidth=2)
# plt.title('月度销售趋势')
# plt.xlabel('月份')
# plt.ylabel('销售额 (元)')
# plt.grid(True, alpha=0.3)
# plt.show()

# TODO: 按类别汇总销售数量，绘制柱状图
category_qty = df.groupby('类别')['销售数量'].sum().sort_values(ascending=False)
print("\\n各类别销售数量:")
print(category_qty.to_string())

# TODO: 创建柱状图
# plt.figure(figsize=(10, 6))
# category_qty.plot(kind='bar', color=['#4F81BD', '#C0504D', '#9BBB59', '#8064A2'])
# plt.title('各类别销量对比')
# plt.xlabel('产品类别')
# plt.ylabel('销售数量')
# plt.xticks(rotation=0)
# plt.tight_layout()
# plt.show()

print("\\n✓ Step 2 完成！已绘制趋势和对比图表")
`;

const answerCodeStep2 = `# ========================================
# Step 2 参考答案
# ========================================

import pandas as pd
import matplotlib.pyplot as plt
from io import StringIO

csv_data = """订单ID,产品名称,类别,销售数量,单价,销售额,订单日期
ORD001,无线耳机,电子产品,15,299,4485,2024-01-05
ORD002,智能手表,电子产品,8,1299,10392,2024-01-08
ORD003,运动T恤,服装,42,159,6678,2024-01-10
ORD004,保温杯,家居,28,89,2492,2024-01-12
ORD005,蓝牙音箱,电子产品,22,399,8778,2024-01-15
ORD006,运动鞋,服装,19,459,8721,2024-01-18
ORD007,台灯,家居,35,129,4515,2024-01-20
ORD008,机械键盘,电子产品,12,599,7188,2024-01-22
ORD009,牛仔裤,服装,31,299,9269,2024-01-25
ORD010,抱枕,家居,25,79,1975,2024-01-28
ORD011,数据线,电子产品,65,29,1885,2024-02-02
ORD012,羽绒服,服装,14,799,11186,2024-02-05
ORD013,香薰机,家居,18,199,3582,2024-02-08
ORD014,笔记本,文具,55,15,825,2024-02-10
ORD015,钢笔,文具,38,89,3382,2024-02-12
ORD016,笔记本电脑,电子产品,5,6999,34995,2024-02-15
ORD017,卫衣,服装,27,259,6993,2024-02-18
ORD018,收纳盒,家居,45,49,2205,2024-02-20
ORD019,充电宝,电子产品,33,149,4917,2024-02-22
ORD020,中性笔,文具,120,5,600,2024-02-25
"""

df = pd.read_csv(StringIO(csv_data))
df['订单日期'] = pd.to_datetime(df['订单日期'])
df['月份'] = df['订单日期'].dt.to_period('M')

print("=" * 50)
print("📈 Step 2: 柱状图与折线图分析")
print("=" * 50)

# ===== 折线图: 月度销售趋势 =====
monthly_sales = df.groupby('月份')['销售额'].sum()
print("\\n【1】月度销售额汇总:")
for month, sales in monthly_sales.items():
    print(f"  {month}: ¥{sales:,.0f}")

print(f"\\n  总销售额: ¥{monthly_sales.sum():,.0f}")
print(f"  月均销售额: ¥{monthly_sales.mean():,.0f}")

plt.figure(figsize=(11, 6))
plt.plot(monthly_sales.index.astype(str), monthly_sales.values,
         marker='o', linewidth=3, markersize=10,
         color='#2563eb', linestyle='-')
plt.fill_between(monthly_sales.index.astype(str), monthly_sales.values,
                 alpha=0.15, color='#2563eb')
plt.title('Monthly Sales Trend', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Month', fontsize=12)
plt.ylabel('Sales Amount (¥)', fontsize=12)
plt.grid(True, alpha=0.3, linestyle='--')
for x, y in zip(monthly_sales.index.astype(str), monthly_sales.values):
    plt.annotate(f'¥{y:,.0f}', (x, y), textcoords="offset points",
                 xytext=(0, 15), ha='center', fontsize=10, fontweight='bold',
                 color='#1d4ed8')
plt.tight_layout()
plt.show()

# ===== 柱状图: 各类别销量 =====
category_qty = df.groupby('类别')['销售数量'].sum().sort_values(ascending=False)
print("\\n【2】各类别销售数量:")
for cat, qty in category_qty.items():
    print(f"  {cat}: {qty} 件")

plt.figure(figsize=(11, 6))
colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
bars = plt.bar(category_qty.index, category_qty.values, color=colors,
               edgecolor='white', linewidth=2, width=0.65)
plt.title('Sales Volume by Category', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Product Category', fontsize=12)
plt.ylabel('Quantity Sold', fontsize=12)
plt.xticks(rotation=0, fontsize=11)
for bar, qty in zip(bars, category_qty.values):
    plt.text(bar.get_x() + bar.get_width() / 2., bar.get_height() + 3,
             f'{qty}', ha='center', va='bottom', fontsize=11, fontweight='bold')
plt.ylim(0, max(category_qty.values) * 1.15)
plt.tight_layout()
plt.show()

# ===== 组合柱状图: 类别销售额 vs 销售数量 =====
category_stats = df.groupby('类别').agg({
    '销售额': 'sum',
    '销售数量': 'sum'
}).sort_values('销售额', ascending=False)

fig, ax1 = plt.subplots(figsize=(11, 6))
x = range(len(category_stats))
bar_width = 0.4
ax1.bar([i - bar_width/2 for i in x], category_stats['销售额'],
        width=bar_width, color='#6366f1', label='Sales Amount', edgecolor='white')
ax1.set_xlabel('Product Category', fontsize=12)
ax1.set_ylabel('Sales Amount (¥)', fontsize=12, color='#6366f1')
ax1.tick_params(axis='y', labelcolor='#6366f1')
ax1.set_xticks(list(x))
ax1.set_xticklabels(category_stats.index)

ax2 = ax1.twinx()
ax2.bar([i + bar_width/2 for i in x], category_stats['销售数量'],
        width=bar_width, color='#ec4899', label='Quantity', edgecolor='white', alpha=0.7)
ax2.set_ylabel('Quantity Sold', fontsize=12, color='#ec4899')
ax2.tick_params(axis='y', labelcolor='#ec4899')

plt.title('Sales Amount vs Quantity by Category', fontsize=16, fontweight='bold', pad=15)
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
plt.legend(lines1 + lines2, labels1 + labels2, loc='upper right')
plt.tight_layout()
plt.show()

print("\\n✓ Step 2 完成！已生成 3 张可视化图表")
`;

const starterCodeStep3 = `# ========================================
# Step 3: 综合分析 - 饼图和散点图
# 目标: 分析类别占比、单价与销量关系
# ========================================

import pandas as pd
import matplotlib.pyplot as plt
from io import StringIO

csv_data = """订单ID,产品名称,类别,销售数量,单价,销售额,订单日期
ORD001,无线耳机,电子产品,15,299,4485,2024-01-05
ORD002,智能手表,电子产品,8,1299,10392,2024-01-08
ORD003,运动T恤,服装,42,159,6678,2024-01-10
ORD004,保温杯,家居,28,89,2492,2024-01-12
ORD005,蓝牙音箱,电子产品,22,399,8778,2024-01-15
ORD006,运动鞋,服装,19,459,8721,2024-01-18
ORD007,台灯,家居,35,129,4515,2024-01-20
ORD008,机械键盘,电子产品,12,599,7188,2024-01-22
ORD009,牛仔裤,服装,31,299,9269,2024-01-25
ORD010,抱枕,家居,25,79,1975,2024-01-28
ORD011,数据线,电子产品,65,29,1885,2024-02-02
ORD012,羽绒服,服装,14,799,11186,2024-02-05
ORD013,香薰机,家居,18,199,3582,2024-02-08
ORD014,笔记本,文具,55,15,825,2024-02-10
ORD015,钢笔,文具,38,89,3382,2024-02-12
ORD016,笔记本电脑,电子产品,5,6999,34995,2024-02-15
ORD017,卫衣,服装,27,259,6993,2024-02-18
ORD018,收纳盒,家居,45,49,2205,2024-02-20
ORD019,充电宝,电子产品,33,149,4917,2024-02-22
ORD020,中性笔,文具,120,5,600,2024-02-25
"""

df = pd.read_csv(StringIO(csv_data))

# TODO: 按类别统计销售额占比，绘制饼图
category_sales = df.groupby('类别')['销售额'].sum().sort_values(ascending=False)
print("各类别销售额占比:")
for cat, val in category_sales.items():
    pct = val / category_sales.sum() * 100
    print(f"  {cat}: ¥{val:,.0f} ({pct:.1f}%)")

# TODO: 创建饼图
# plt.figure(figsize=(10, 8))
# category_sales.plot(kind='pie', autopct='%1.1f%%', startangle=90)
# plt.title('各类别销售额占比')
# plt.ylabel('')
# plt.show()

# TODO: 绘制散点图 - 单价 vs 销售数量
print("\\n单价与销售数量关系:")
print(f"  单价范围: ¥{df['单价'].min()} - ¥{df['单价'].max()}")
print(f"  销售数量范围: {df['销售数量'].min()} - {df['销售数量'].max()}")

# TODO: 创建散点图
# plt.figure(figsize=(10, 6))
# plt.scatter(df['单价'], df['销售数量'], s=df['销售额']/100, alpha=0.7)
# plt.title('单价 vs 销售数量散点图')
# plt.xlabel('单价 (元)')
# plt.ylabel('销售数量')
# plt.grid(True, alpha=0.3)
# plt.show()

print("\\n✓ Step 3 完成！综合数据分析结束")
`;

const answerCodeStep3 = `# ========================================
# Step 3 参考答案
# ========================================

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from io import StringIO

csv_data = """订单ID,产品名称,类别,销售数量,单价,销售额,订单日期
ORD001,无线耳机,电子产品,15,299,4485,2024-01-05
ORD002,智能手表,电子产品,8,1299,10392,2024-01-08
ORD003,运动T恤,服装,42,159,6678,2024-01-10
ORD004,保温杯,家居,28,89,2492,2024-01-12
ORD005,蓝牙音箱,电子产品,22,399,8778,2024-01-15
ORD006,运动鞋,服装,19,459,8721,2024-01-18
ORD007,台灯,家居,35,129,4515,2024-01-20
ORD008,机械键盘,电子产品,12,599,7188,2024-01-22
ORD009,牛仔裤,服装,31,299,9269,2024-01-25
ORD010,抱枕,家居,25,79,1975,2024-01-28
ORD011,数据线,电子产品,65,29,1885,2024-02-02
ORD012,羽绒服,服装,14,799,11186,2024-02-05
ORD013,香薰机,家居,18,199,3582,2024-02-08
ORD014,笔记本,文具,55,15,825,2024-02-10
ORD015,钢笔,文具,38,89,3382,2024-02-12
ORD016,笔记本电脑,电子产品,5,6999,34995,2024-02-15
ORD017,卫衣,服装,27,259,6993,2024-02-18
ORD018,收纳盒,家居,45,49,2205,2024-02-20
ORD019,充电宝,电子产品,33,149,4917,2024-02-22
ORD020,中性笔,文具,120,5,600,2024-02-25
"""

df = pd.read_csv(StringIO(csv_data))

print("=" * 50)
print("🎯 Step 3: 综合分析 - 饼图与散点图")
print("=" * 50)

# ===== 饼图: 各类别销售额占比 =====
category_sales = df.groupby('类别')['销售额'].sum().sort_values(ascending=False)
total_sales = category_sales.sum()

print("\\n【1】各类别销售额占比:")
for cat, val in category_sales.items():
    pct = val / total_sales * 100
    print(f"  {cat}: ¥{val:,.0f} ({pct:.1f}%)")

plt.figure(figsize=(11, 9))
colors_pie = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
explode = [0.05] * len(category_sales)
wedges, texts, autotexts = plt.pie(
    category_sales.values,
    labels=category_sales.index,
    autopct='%1.1f%%',
    startangle=90,
    colors=colors_pie,
    explode=explode,
    shadow=False,
    pctdistance=0.8,
    wedgeprops=dict(edgecolor='white', linewidth=3)
)
for t in texts:
    t.set_fontsize(11)
    t.set_fontweight('bold')
for a in autotexts:
    a.set_fontsize(11)
    a.set_fontweight('bold')
    a.set_color('white')
plt.title('Sales Distribution by Category', fontsize=16, fontweight='bold', pad=20)
plt.axis('equal')
plt.tight_layout()
plt.show()

# ===== 散点图: 单价 vs 销售数量 (气泡大小 = 销售额) =====
print("\\n【2】单价与销售数量关系:")
print(f"  单价范围: ¥{df['单价'].min():,.0f} - ¥{df['单价'].max():,.0f}")
print(f"  销售数量范围: {df['销售数量'].min()} - {df['销售数量'].max()}")
corr = df['单价'].corr(df['销售数量'])
print(f"  相关系数: {corr:.3f}")
print(f"  解读: {'负相关' if corr < 0 else '正相关'} (绝对值{abs(corr):.2f})")

plt.figure(figsize=(12, 7))
category_colors = {'电子产品': '#3b82f6', '服装': '#ef4444',
                   '家居': '#10b981', '文具': '#f59e0b'}
for cat in df['类别'].unique():
    subset = df[df['类别'] == cat]
    plt.scatter(subset['单价'], subset['销售数量'],
                s=subset['销售额']/30, alpha=0.75,
                c=category_colors[cat], label=cat,
                edgecolors='white', linewidth=1.5, zorder=3)

plt.title('Price vs Quantity (bubble size = Sales)', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Unit Price (¥)', fontsize=12)
plt.ylabel('Quantity Sold', fontsize=12)
plt.legend(loc='upper right', fontsize=11, framealpha=0.95)
plt.grid(True, alpha=0.3, linestyle='--', zorder=0)

for i, row in df.nlargest(3, '销售额').iterrows():
    plt.annotate(row['产品名称'], (row['单价'], row['销售数量']),
                 textcoords="offset points", xytext=(8, 8),
                 fontsize=9, fontweight='bold', alpha=0.85)
plt.tight_layout()
plt.show()

# ===== TOP 热销产品横向条形图 =====
top_products = df.groupby('产品名称')['销售额'].sum().sort_values(ascending=False).head(8)
print("\\n【3】TOP 8 热销产品:")
for i, (prod, val) in enumerate(top_products.items(), 1):
    print(f"  {i}. {prod}: ¥{val:,.0f}")

plt.figure(figsize=(12, 7))
y_pos = np.arange(len(top_products))
plt.barh(y_pos, top_products.values,
         color=plt.cm.viridis(np.linspace(0.2, 0.8, len(top_products))),
         edgecolor='white', linewidth=2, height=0.65)
plt.yticks(y_pos, top_products.index, fontsize=11)
plt.gca().invert_yaxis()
for i, v in enumerate(top_products.values):
    plt.text(v + max(top_products.values)*0.01, i, f'¥{v:,.0f}',
             va='center', fontsize=10, fontweight='bold')
plt.title('Top 8 Best-Selling Products', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Sales Amount (¥)', fontsize=12)
plt.xlim(0, max(top_products.values) * 1.25)
plt.tight_layout()
plt.show()

# ===== 综合洞察 =====
print("\\n" + "=" * 50)
print("📊 综合洞察总结:")
print("=" * 50)
print(f"  总订单数: {len(df)} 条")
print(f"  总销售额: ¥{df['销售额'].sum():,.0f}")
print(f"  总销量: {df['销售数量'].sum()} 件")
print(f"  最高单价产品: {df.loc[df['单价'].idxmax(), '产品名称']} (¥{df['单价'].max():,.0f})")
print(f"  销量最高产品: {df.loc[df['销售数量'].idxmax(), '产品名称']} ({df['销售数量'].max()} 件)")
print(f"  销售额最高产品: {df.loc[df['销售额'].idxmax(), '产品名称']} (¥{df['销售额'].max():,.0f})")
print(f"  平均单价: ¥{df['单价'].mean():,.0f}")
print(f"  最大类别销售额占比: {category_sales.max()/total_sales*100:.1f}%")
print("\\n✓ Step 3 完成！数据可视化学习到此结束")
`;

const initialSteps: StepState[] = [
  { code: starterCodeStep1, output: null, images: [], isError: false, errorMessage: '', showAnswer: false, isLoading: false },
  { code: starterCodeStep2, output: null, images: [], isError: false, errorMessage: '', showAnswer: false, isLoading: false },
  { code: starterCodeStep3, output: null, images: [], isError: false, errorMessage: '', showAnswer: false, isLoading: false },
];

const answerCodes = [answerCodeStep1, answerCodeStep2, answerCodeStep3];
const starterCodes = [starterCodeStep1, starterCodeStep2, starterCodeStep3];

const DataVisualization: React.FC = () => {
  const [steps, setSteps] = useState<StepState[]>(initialSteps);
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pyodideProgress, setPyodideProgress] = useState<{ stage: any; percent: number }>({ stage: 0, percent: 0 });
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const checkPyodide = async () => {
      if (isPyodideReady()) {
        setPyodideStatus('ready');
        setPyodideProgress({ stage: 4, percent: 100 });
        clearInterval(timer);
        return;
      }

      try {
        await initPyodide((p: PyodideProgress) => {
          setPyodideProgress({ stage: p.stage, percent: p.percent });
        });
        setPyodideStatus('ready');
        clearInterval(timer);
      } catch (error) {
        console.error('Pyodide 初始化失败:', error);
        setPyodideStatus('error');
        setPyodideError(error instanceof Error ? error.message : String(error));
        clearInterval(timer);
      }
    };

    checkPyodide();

    return () => clearInterval(timer);
  }, []);

  const updateStep = (index: number, updates: Partial<StepState>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  };

  const parseOutput = (output: string): { text: string; images: string[] } => {
    const imgRegex = /<img[^>]*src="data:image\/[^"]+"[^>]*>/gi;
    const images = output.match(imgRegex) || [];
    const text = output.replace(imgRegex, '').trim();
    return { text, images };
  };

  const handleRunCode = async (index: number) => {
    if (pyodideStatus !== 'ready') {
      updateStep(index, {
        output: null,
        isError: true,
        errorMessage: 'Python 环境正在初始化，请稍候再试...',
        images: []
      });
      return;
    }

    updateStep(index, { isLoading: true, isError: false, errorMessage: '' });

    try {
      const result = await runPythonCode(steps[index].code);
      if (result.success) {
        const { text, images } = parseOutput(result.output || '');
        updateStep(index, {
          output: text || '代码执行成功（无文本输出）',
          images,
          isError: false,
          errorMessage: '',
          isLoading: false
        });
      } else {
        const errMsg = result.error
          ? `${result.error.type}: ${result.error.message}${result.error.details ? '\n\n详细信息:\n' + result.error.details : ''}`
          : '执行出错';
        updateStep(index, {
          output: null,
          isError: true,
          errorMessage: errMsg,
          images: [],
          isLoading: false
        });
      }
    } catch (err) {
      updateStep(index, {
        output: null,
        isError: true,
        errorMessage: '执行出错: ' + (err instanceof Error ? err.message : String(err)),
        images: [],
        isLoading: false
      });
    }
  };

  const handleShowAnswer = (index: number) => {
    updateStep(index, {
      code: answerCodes[index],
      showAnswer: true
    });
  };

  const handleReset = (index: number) => {
    updateStep(index, {
      code: starterCodes[index],
      output: null,
      images: [],
      isError: false,
      errorMessage: '',
      showAnswer: false
    });
  };

  const renderStep = (index: number, title: string, description: string, icon: string, difficulty: string) => {
    const step = steps[index];
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 mr-4 text-3xl">
                {icon}
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">{title}</h3>
                <p className="text-blue-100 text-sm mt-1">{description}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2 text-white text-sm font-semibold">
              {difficulty}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <AceEditor
              mode="python"
              theme="monokai"
              value={step.code}
              onChange={(newCode) => updateStep(index, { code: newCode })}
              name={`editor-step-${index}`}
              editorProps={{ $blockScrolling: true }}
              className="rounded-lg shadow-md border border-gray-200"
              style={{ height: '420px', width: '100%', fontSize: '14px' }}
              setOptions={{
                fontSize: '14px',
                showPrintMargin: false,
                tabSize: 4,
                useSoftTabs: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: false
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleRunCode(index)}
              disabled={step.isLoading || pyodideStatus !== 'ready'}
              className={`px-6 py-2 rounded-full font-bold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all ${
                step.isLoading || pyodideStatus !== 'ready'
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-primary text-white'
              }`}
            >
              {step.isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin inline-block h-4 w-4 border-b-2 border-white mr-2 rounded-full"></span>
                  运行中...
                </span>
              ) : (
                '▶ 运行代码'
              )}
            </button>

            <button
              onClick={() => handleShowAnswer(index)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
            >
              💡 显示参考答案
            </button>

            <button
              onClick={() => handleReset(index)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
            >
              🔄 重置代码
            </button>

            {step.showAnswer && (
              <span className="text-sm text-blue-600 font-medium">✓ 已显示参考答案</span>
            )}
          </div>

          {step.isError && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 mb-4 whitespace-pre-wrap font-mono text-sm">
              {step.errorMessage}
            </div>
          )}

          {step.output && !step.isError && (
            <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg mb-4 border border-gray-700">
              {step.output}
            </div>
          )}

          {step.images.length > 0 && (
            <div className="space-y-4">
              {step.images.map((img, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-center">
                  <div dangerouslySetInnerHTML={{ __html: img }} />
                </div>
              ))}
            </div>
          )}

          {!step.output && !step.isError && !step.isLoading && (
            <div className="text-center text-gray-400 py-6 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              📝 点击上方「运行代码」按钮查看执行结果和图表
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero 区域 */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-6 mb-8 shadow-2xl">
              <span className="text-7xl md:text-8xl">📊</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              数据可视化实战
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6 font-light">
              用 Python 讲述数据的故事
            </p>
            <p className="text-base md:text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              通过三步递进式练习，掌握 pandas 数据处理与 matplotlib 图表绘制，
              从柱状图到散点图，从零开始构建属于你的数据可视化作品。
            </p>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-blue-200 mt-1">练习步骤</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-blue-200 mt-1">可视化图表</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">20</div>
                <div className="text-sm text-blue-200 mt-1">条订单数据</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-200 mt-1">浏览器运行</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Pyodide 加载状态 */}
          {pyodideStatus === 'loading' && (
            <div className="mb-10">
              <PyodideLoader
                stage={pyodideProgress.stage}
                percent={pyodideProgress.percent}
                error={null}
                elapsedSeconds={elapsedSeconds}
              />
            </div>
          )}

          {pyodideStatus === 'error' && (
            <div className="mb-10">
              <PyodideLoader
                stage={pyodideProgress.stage}
                percent={pyodideProgress.percent}
                error={pyodideError}
                elapsedSeconds={elapsedSeconds}
              />
            </div>
          )}

          {/* 核心概念板块 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl px-4 py-3 mr-4 text-3xl shadow-md">
                💡
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">核心概念</h2>
                <p className="text-gray-500 mt-1">理解数据可视化的本质与常见陷阱</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🧭</span>
                  <h3 className="text-lg font-bold text-blue-800">什么是数据可视化</h3>
                </div>
                <p className="text-blue-900 text-sm leading-relaxed">
                  将抽象数字转化为直观图形的过程。通过图表、图形和色彩等视觉元素，
                  让复杂数据变得易于理解、易于发现规律。
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🎯</span>
                  <h3 className="text-lg font-bold text-green-800">为什么重要</h3>
                </div>
                <p className="text-green-900 text-sm leading-relaxed">
                  人类大脑处理视觉信息比文字快 <span className="font-bold">60,000 倍</span>。
                  可视化帮助发现趋势、异常值与相关性，支撑关键业务决策。
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">⚠️</span>
                  <h3 className="text-lg font-bold text-red-800">常见误区</h3>
                </div>
                <ul className="text-red-900 text-sm leading-relaxed space-y-1 list-none">
                  <li>• Y 轴不从零开始，夸大差异</li>
                  <li>• 饼图类别超过 5 个导致混乱</li>
                  <li>• 选择 3D 图遮蔽数据真相</li>
                  <li>• 色彩冲突降低可读性</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
              <h4 className="text-base font-bold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">📈</span>四种基础图表适用场景
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-blue-600 font-bold mb-1">📊 柱状图</div>
                  <div className="text-gray-600 text-xs">不同类别的数值比较</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-green-600 font-bold mb-1">📈 折线图</div>
                  <div className="text-gray-600 text-xs">随时间变化的趋势</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-amber-600 font-bold mb-1">🥧 饼图</div>
                  <div className="text-gray-600 text-xs">部分占整体的比例</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-purple-600 font-bold mb-1">💫 散点图</div>
                  <div className="text-gray-600 text-xs">变量间的相关关系</div>
                </div>
              </div>
            </div>
          </div>

          {/* 三步递进练习 */}
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-3">🚀</span>三步递进练习
            </h2>
            <p className="text-gray-500 mb-6">
              从基础数据读取到高级可视化分析，循序渐进掌握数据可视化技能
            </p>
          </div>

          {renderStep(
            0,
            'Step 1 · 基础: 数据加载与探索',
            '使用 pandas 读取订单数据，查看 head/describe 基本信息',
            '📦',
            '⭐ 入门级'
          )}

          {renderStep(
            1,
            'Step 2 · 进阶: 柱状图与折线图',
            '绘制月度销售趋势折线图、各类别销量柱状图',
            '📊',
            '⭐⭐ 进阶级'
          )}

          {renderStep(
            2,
            'Step 3 · 挑战: 饼图与散点图',
            '综合分析类别销售额占比、单价与销量关系气泡图',
            '🎯',
            '⭐⭐⭐ 挑战级'
          )}

          {/* 课程完成组件 */}
          <CourseCompletion
            courseId="data-visualization"
            courseTitle="数据可视化"
            badgeIcon="📊"
            badgeName="数据可视化艺术家"
          />
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
