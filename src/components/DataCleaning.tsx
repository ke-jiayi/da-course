import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

type PyodideStage = 0 | 1 | 2 | 3 | 4;

const DataCleaning: React.FC = () => {
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pyodideStage, setPyodideStage] = useState<PyodideStage>(0);
  const [pyodidePercent, setPyodidePercent] = useState(0);
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
        setPyodideStage(4);
        setPyodidePercent(100);
        clearInterval(timer);
        return;
      }

      try {
        await initPyodide((p: PyodideProgress) => {
          setPyodideStage(p.stage);
          setPyodidePercent(p.percent);
        });
        setPyodideStatus('ready');
      } catch (error) {
        console.error('Pyodide 初始化失败:', error);
        setPyodideStatus('error');
        setPyodideError(error instanceof Error ? error.message : String(error));
      } finally {
        clearInterval(timer);
      }
    };

    checkPyodide();
    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    setPyodideStatus('loading');
    setPyodideError(null);
    setPyodideStage(0);
    setPyodidePercent(0);
    setElapsedSeconds(0);
    const checkPyodide = async () => {
      try {
        await initPyodide((p: PyodideProgress) => {
          setPyodideStage(p.stage);
          setPyodidePercent(p.percent);
        });
        setPyodideStatus('ready');
      } catch (error) {
        setPyodideStatus('error');
        setPyodideError(error instanceof Error ? error.message : String(error));
      }
    };
    checkPyodide();
  };

  // ====================== Step 1 ======================
  const step1Placeholder = `# Step 1: 数据诊断
# 任务：读取订单 CSV 数据，统计缺失值、重复值、异常值
#
# 数据集包含以下字段：
#   order_id, product, quantity, price, region, date
#
# 提示：
#   1. 使用 csv 模块或手动解析 data 字符串
#   2. 统计每列 None / 空字符串的数量
#   3. 检查重复行（完全相同的记录）
#   4. 检查 quantity 和 price 是否存在异常值（如负数或极端大值）
#   5. 输出一份清洗前的数据质量报告

data = """下面参考答案中包含完整的脏数据集，
你也可以先尝试自己写一个简单的诊断脚本。"""

print("请编写你的诊断脚本...")
`;

  const step1Answer = `# ============================================================
# Step 1: 数据诊断 —— 清洗前质量报告
# ============================================================
import csv
from io import StringIO
from collections import Counter

# ---------------------- 1. 脏数据（CSV 字符串） ----------------------
csv_data = """order_id,product,quantity,price,region,date
1001,iPhone,2,5999,北京,2024-01-15
1002,MacBook,1,12999,上海,2024-01-16
1003,AirPods,,1299,北京,2024-01-17
1004,iPad,3,,广州,2024-01-18
1005,iPhone,2,5999,北京,2024-01-15
1006,MacBook,1,99999,深圳,2024-01-19
1007,Watch,-2,2199,上海,2024-01-20
1008,,1,899,北京,2024-01-21
1009,iPhone,2,5999,beijing,2024/01/15
1010,MacBook,1,12999,上海,2024-01-16
1011,iPad,5,3499,杭州,2024-01-22
1012,AirPods,2,1299,,
1013,Watch,1,2199,上海,2024-01-23
1014,iPhone,-1,5999,北京,2024-01-24
1015,MacBook,1,12999,上海,2024-01-16
1016,iPad,0,3499,南京,2024-01-25
1017,AirPods,3,12999,北京,2024-01-26
1018,Watch,1,,上海,2024-01-27
1019,iPhone,2,5999,北京,2024-01-15
1020,MacBook,100,12999,上海,2024-01-28
"""

# ---------------------- 2. 解析 CSV ----------------------
reader = csv.DictReader(StringIO(csv_data))
rows = list(reader)
fields = reader.fieldnames

print("=" * 60)
print("            📊 数据清洗前质量诊断报告")
print("=" * 60)
print(f"总记录数: {len(rows)} 行")
print(f"字段数:   {len(fields)} 列")
print(f"字段名:   {', '.join(fields)}")

# ---------------------- 3. 缺失值统计 ----------------------
print("\\n" + "-" * 60)
print(" 🔍 1) 缺失值统计 (空字符串或 NaN)")
print("-" * 60)

missing_by_col = Counter()
missing_rows = 0
for row in rows:
    has_missing = False
    for col in fields:
        val = (row[col] or "").strip()
        if val == "" or val.lower() == "nan":
            missing_by_col[col] += 1
            has_missing = True
    if has_missing:
        missing_rows += 1

for col in fields:
    count = missing_by_col.get(col, 0)
    pct = count / len(rows) * 100
    bar = "█" * int(pct / 2) + "·" * (50 - int(pct / 2))
    print(f"  {col:<12} [{bar}] {count:>3} 条  ({pct:>5.1f}%)")

print(f"\\n  ⚠️  含有缺失值的行: {missing_rows} 行 ({missing_rows/len(rows)*100:.1f}%)")

# ---------------------- 4. 重复值统计 ----------------------
print("\\n" + "-" * 60)
print(" 🔁 2) 重复行统计 (按所有字段完全匹配)")
print("-" * 60)

row_strings = [tuple(r[f] for f in fields) for r in rows]
counter = Counter(row_strings)
dup_groups = [(k, v) for k, v in counter.items() if v > 1]

if dup_groups:
    total_dup = sum(v - 1 for _, v in dup_groups)
    print(f"  发现 {len(dup_groups)} 组重复记录,共 {total_dup} 条多余行")
    for i, (key, cnt) in enumerate(dup_groups[:5], 1):
        print(f"    #{i}: {dict(zip(fields, key))} → 出现 {cnt} 次")
    if len(dup_groups) > 5:
        print(f"    ... 以及其他 {len(dup_groups) - 5} 组重复")
else:
    print("  ✅ 未发现重复记录")

# ---------------------- 5. 异常值统计 ----------------------
print("\\n" + "-" * 60)
print(" ⚠️  3) 数值字段异常值检测 (quantity, price)")
print("-" * 60)

def safe_float(v):
    try:
        return float(v)
    except (ValueError, TypeError):
        return None

for num_col in ["quantity", "price"]:
    vals = [safe_float(r[num_col]) for r in rows if safe_float(r[num_col]) is not None]
    if not vals:
        continue
    n = len(vals)
    mean_v = sum(vals) / n
    sorted_v = sorted(vals)
    q1 = sorted_v[n // 4]
    q3 = sorted_v[3 * n // 4]
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr

    neg_vals = [(i + 1, v) for i, r in enumerate(rows)
                for vv in [safe_float(r[num_col])] if vv is not None and vv < 0]
    zero_vals = [(i + 1, v) for i, r in enumerate(rows)
                 for vv in [safe_float(r[num_col])] if vv is not None and vv == 0]
    outlier_vals = [(i + 1, v) for i, r in enumerate(rows)
                    for vv in [safe_float(r[num_col])] if vv is not None and (vv < lower or vv > upper)]

    print(f"\\n  【{num_col}】")
    print(f"    有效值: {n} | 均值: {mean_v:.1f} | Q1: {q1} | Q3: {q3} | IQR: {iqr}")
    print(f"    正常范围 (IQR 法): [{lower:.1f}, {upper:.1f}]")
    print(f"    负数异常: {len(neg_vals)} 条 → {neg_vals[:3]}{'...' if len(neg_vals) > 3 else ''}")
    print(f"    零值异常: {len(zero_vals)} 条 → {zero_vals[:3]}{'...' if len(zero_vals) > 3 else ''}")
    print(f"    极端值(IQR外): {len(outlier_vals)} 条 → {outlier_vals[:3]}{'...' if len(outlier_vals) > 3 else ''}")

# ---------------------- 6. 格式不一致 ----------------------
print("\\n" + "-" * 60)
print(" 🔤 4) 文本字段格式不一致")
print("-" * 60)

for txt_col in ["region", "date"]:
    unique_vals = sorted(set(r[txt_col].strip() for r in rows if r[txt_col].strip()))
    print(f"\\n  【{txt_col}】共有 {len(unique_vals)} 种取值:")
    for v in unique_vals:
        print(f"    - '{v}'")

# ---------------------- 7. 汇总 ----------------------
print("\\n" + "=" * 60)
print("                  📝 诊断报告汇总")
print("=" * 60)
issues_total = missing_rows + sum(v - 1 for _, v in counter.items() if v > 1) + 0
print(f"  ✅ 总记录数:       {len(rows)}")
print(f"  ⚠️  含缺失值的行:  {missing_rows}")
print(f"  🔁 重复记录数:     {sum(v - 1 for _, v in counter.items() if v > 1)}")
print(f"  ❌ 异常值需关注:   quantity={sum(1 for r in rows if safe_float(r['quantity']) is not None and (safe_float(r['quantity']) <= 0))} 条")
print(f"  🔤 需统一格式:     region(中英文混杂), date(分隔符不一致)")
print("\\n  👉 建议处理顺序: 缺失值 → 去重 → 格式化 → 异常值修正")
print("=" * 60)
`;

  const [step1Code, setStep1Code] = useState(step1Placeholder);
  const [step1Result, setStep1Result] = useState<any>(null);
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1ShowAnswer, setStep1ShowAnswer] = useState(false);

  // ====================== Step 2 ======================
  const step2Placeholder = `# Step 2: 缺失值处理 + 去重 + 格式标准化
# 任务：在 Step 1 的基础上，将脏数据变成干净数据
#
# 建议步骤：
#   1. 处理缺失值：
#      - quantity: 用中位数填充
#      - price: 用同 product 的均值填充
#      - region/date/product: 用众数或标记为"未知"
#   2. 删除重复行（保留第一条）
#   3. 格式化：
#      - region 统一英文小写或中文（如 "beijing" → "北京"）
#      - date 统一为 YYYY-MM-DD
#   4. 输出清洗后的记录数 + 前 5 行预览
`;

  const step2Answer = `# ============================================================
# Step 2: 缺失值处理 + 去重 + 格式标准化
# ============================================================
import csv
from io import StringIO
from collections import Counter

# ---------------------- 1. 脏数据（CSV 字符串） ----------------------
csv_data = """order_id,product,quantity,price,region,date
1001,iPhone,2,5999,北京,2024-01-15
1002,MacBook,1,12999,上海,2024-01-16
1003,AirPods,,1299,北京,2024-01-17
1004,iPad,3,,广州,2024-01-18
1005,iPhone,2,5999,北京,2024-01-15
1006,MacBook,1,99999,深圳,2024-01-19
1007,Watch,-2,2199,上海,2024-01-20
1008,,1,899,北京,2024-01-21
1009,iPhone,2,5999,beijing,2024/01/15
1010,MacBook,1,12999,上海,2024-01-16
1011,iPad,5,3499,杭州,2024-01-22
1012,AirPods,2,1299,,
1013,Watch,1,2199,上海,2024-01-23
1014,iPhone,-1,5999,北京,2024-01-24
1015,MacBook,1,12999,上海,2024-01-16
1016,iPad,0,3499,南京,2024-01-25
1017,AirPods,3,12999,北京,2024-01-26
1018,Watch,1,,上海,2024-01-27
1019,iPhone,2,5999,北京,2024-01-15
1020,MacBook,100,12999,上海,2024-01-28
"""

# ---------------------- 2. 解析 CSV ----------------------
reader = csv.DictReader(StringIO(csv_data))
rows = list(reader)
fields = reader.fieldnames

print("=" * 60)
print("          🧹 Step 2: 数据清洗（缺失值 + 去重 + 格式标准化）")
print("=" * 60)
print(f"\\n📊 原始数据: {len(rows)} 行")

# ---------------------- 3. 缺失值填充 ----------------------
print("\\n" + "-" * 60)
print(" 【1】缺失值处理")
print("-" * 60)

# 3.1 quantity 用中位数填充
quantities = [float(r['quantity']) for r in rows if r['quantity'].strip()]
quantities_sorted = sorted(quantities)
n = len(quantities_sorted)
median_qty = quantities_sorted[n // 2] if n % 2 == 1 else (quantities_sorted[n // 2 - 1] + quantities_sorted[n // 2]) / 2

# 3.2 price 用同 product 均值填充
product_prices = {}
for r in rows:
    p = r['product'].strip()
    if r['price'].strip():
        product_prices.setdefault(p, []).append(float(r['price']))
product_avg_price = {p: sum(v) / len(v) for p, v in product_prices.items()}

# 3.3 region 用众数填充，date 用默认值
regions = [r['region'].strip() for r in rows if r['region'].strip()]
region_counter = Counter(regions)
mode_region = region_counter.most_common(1)[0][0] if region_counter else "未知"

# 填充
filled_count = 0
for r in rows:
    if not r['quantity'].strip():
        r['quantity'] = str(int(median_qty))
        filled_count += 1
    if not r['price'].strip():
        r['price'] = str(int(product_avg_price.get(r['product'].strip(), 0)))
        filled_count += 1
    if not r['region'].strip():
        r['region'] = mode_region
        filled_count += 1
    if not r['date'].strip():
        r['date'] = "2024-01-01"
        filled_count += 1
    if not r['product'].strip():
        r['product'] = "未知商品"

print(f"  ✅ quantity 缺失 → 用中位数 {int(median_qty)} 填充")
print(f"  ✅ price 缺失 → 用同产品均值填充")
print(f"  ✅ region 缺失 → 用众数 '{mode_region}' 填充")
print(f"  ✅ date 缺失 → 用 '2024-01-01' 填充")
print(f"  共处理 {filled_count} 个缺失值")

# ---------------------- 4. 去重 ----------------------
print("\\n" + "-" * 60)
print(" 【2】删除重复行（保留第一条）")
print("-" * 60)

row_strings = [tuple(r[f] for f in fields) for r in rows]
counter = Counter(row_strings)
dup_count = sum(v - 1 for _, v in counter.items() if v > 1)

seen = set()
unique_rows = []
dup_removed = 0
for r in rows:
    key = tuple(r[f] for f in fields)
    if key not in seen:
        seen.add(key)
        unique_rows.append(r)
    else:
        dup_removed += 1

rows[:] = unique_rows
print(f"  ✅ 删除重复行: {dup_removed} 行")
print(f"  去重后数据: {len(rows)} 行")

# ---------------------- 5. 格式标准化 ----------------------
print("\\n" + "-" * 60)
print(" 【3】格式标准化")
print("-" * 60)

# region 统一为中文（首字母大写）
region_map = {
    'beijing': '北京', 'shanghai': '上海', 'guangzhou': '广州',
    'shenzhen': '深圳', 'hangzhou': '杭州', 'nanjing': '南京'
}
region_fixed = 0
for r in rows:
    original = r['region']
    r['region'] = region_map.get(r['region'].lower().strip(), r['region'].strip())
    if original.lower().strip() in region_map:
        region_fixed += 1

# date 统一为 YYYY-MM-DD
import re
date_fixed = 0
for r in rows:
    d = r['date'].strip()
    # 转换 2024/01/15 → 2024-01-15
    if '/' in d:
        parts = d.split('/')
        if len(parts) == 3:
            r['date'] = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
            date_fixed += 1

# quantity 和 price 转为数值
for r in rows:
    try:
        r['quantity'] = str(int(float(r['quantity'])))
    except:
        r['quantity'] = '0'
    try:
        r['price'] = str(int(float(r['price'])))
    except:
        r['price'] = '0'

print(f"  ✅ region 格式统一: 修正 {region_fixed} 条")
print(f"  ✅ date 格式统一: 修正 {date_fixed} 条 (转换为 YYYY-MM-DD)")

# ---------------------- 6. 清洗后数据预览 ----------------------
print("\\n" + "=" * 60)
print("          📋 清洗后数据预览（前 5 行）")
print("=" * 60)

# 打印表头
print("  " + " | ".join([f"{f:>12}" for f in fields]))
print("  " + "-" * (15 * len(fields)))

for i, r in enumerate(rows[:5], 1):
    print("  " + " | ".join([f"{r[f]:>12}" for f in fields]))

print(f"\\n  ... 共 {len(rows)} 行")

# ---------------------- 7. 汇总 ----------------------
print("\\n" + "=" * 60)
print("                  📝 Step 2 清洗报告汇总")
print("=" * 60)
print(f"  ✅ 原始数据:     20 行")
print(f"  ✅ 清洗后数据:   {len(rows)} 行")
print(f"  ✅ 删除重复:     {dup_removed} 行")
print(f"  ✅ 填充缺失:     {filled_count} 处")
print(f"  ✅ 格式统一:     {region_fixed + date_fixed} 处")
print("=" * 60)
print("\\n  👉 建议下一步: 进行异常值检测与修正（Step 3）")
`;

  const [step2Code, setStep2Code] = useState(step2Placeholder);
  const [step2Result, setStep2Result] = useState<any>(null);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2ShowAnswer, setStep2ShowAnswer] = useState(false);

  // ====================== Step 3 ======================
  const step3Placeholder = `# Step 3: 异常值检测与修正
# 任务：
#   1. 使用 IQR 方法检测 quantity / price 的异常值
#   2. 用描述性统计（均值/中位数/合理边界）修正异常
#   3. 对比清洗前后数据集（行数、均值、中位数、极值）
#   4. 输出修正报告
`;

  const step3Answer = `# ============================================================
# Step 3: 异常值检测与修正（IQR 法 + 描述性统计）
# ============================================================
import csv
from io import StringIO
from collections import Counter

# ---------------------- 1. 清洗后的数据（来自 Step 2） ----------------------
csv_data = """order_id,product,quantity,price,region,date
1001,iPhone,2,5999,北京,2024-01-15
1002,MacBook,1,12999,上海,2024-01-16
1003,AirPods,2,1299,北京,2024-01-17
1004,iPad,3,3499,广州,2024-01-18
1005,iPhone,2,5999,北京,2024-01-15
1006,MacBook,1,99999,深圳,2024-01-19
1007,Watch,2,2199,上海,2024-01-20
1008,iPhone,1,899,北京,2024-01-21
1009,iPhone,2,5999,北京,2024-01-15
1010,MacBook,1,12999,上海,2024-01-16
1011,iPad,5,3499,杭州,2024-01-22
1012,AirPods,2,1299,上海,2024-01-23
1013,Watch,1,2199,上海,2024-01-24
1014,iPhone,1,5999,北京,2024-01-25
1015,MacBook,1,12999,上海,2024-01-26
1016,iPad,1,3499,南京,2024-01-27
1017,AirPods,3,1299,北京,2024-01-28
1018,Watch,1,2199,上海,2024-01-29
1019,iPhone,2,5999,北京,2024-01-30
1020,MacBook,100,12999,上海,2024-01-31
"""

# ---------------------- 2. 解析 CSV ----------------------
reader = csv.DictReader(StringIO(csv_data))
rows = list(reader)
fields = reader.fieldnames

def safe_float(v):
    try:
        return float(v)
    except:
        return None

print("=" * 60)
print("          📊 Step 3: 异常值检测与修正")
print("=" * 60)

# ==================== IQR 法检测 ====================
def detect_iqr_outliers(values, field_name):
    """IQR 法检测异常值"""
    n = len(values)
    if n < 4:
        return [], [], []
    sorted_v = sorted(values)
    q1 = sorted_v[n // 4]
    q3 = sorted_v[3 * n // 4]
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return lower, upper, [(i + 1, v) for i, v in enumerate(values) if v < lower or v > upper]

# ==================== 检测 quantity ====================
print("\\n" + "-" * 60)
print(" 【1】quantity 异常值检测 (IQR 法)")
print("-" * 60)

qty_values = [safe_float(r['quantity']) for r in rows if safe_float(r['quantity']) is not None]
qty_before = qty_values.copy()

lower_q, upper_q, qty_outliers = detect_iqr_outliers(qty_values, 'quantity')

print(f"  有效值数量: {len(qty_values)}")
print(f"  Q1 = {qty_values[len(qty_values)//4]}, Q3 = {qty_values[3*len(qty_values)//4]}")
print(f"  IQR = Q3 - Q1")
print(f"  正常范围: [{lower_q:.1f}, {upper_q:.1f}]")
print(f"  发现异常值: {len(qty_outliers)} 条")
for row_idx, val in qty_outliers:
    print(f"    行 {row_idx}: quantity = {val}")

# ==================== 检测 price ====================
print("\\n" + "-" * 60)
print(" 【2】price 异常值检测 (IQR 法)")
print("-" * 60)

price_values = [safe_float(r['price']) for r in rows if safe_float(r['price']) is not None]
price_before = price_values.copy()

lower_p, upper_p, price_outliers = detect_iqr_outliers(price_values, 'price')

print(f"  有效值数量: {len(price_values)}")
print(f"  Q1 = {price_values[len(price_values)//4]}, Q3 = {price_values[3*len(price_values)//4]}")
print(f"  正常范围: [{lower_p:.1f}, {upper_p:.1f}]")
print(f"  发现异常值: {len(price_outliers)} 条")
for row_idx, val in price_outliers:
    print(f"    行 {row_idx}: price = {val}")

# ==================== 修正异常值 ====================
print("\\n" + "-" * 60)
print(" 【3】异常值修正策略")
print("-" * 60)

# quantity: 用中位数替换异常值
qty_median = sorted(qty_values)[len(qty_values) // 2]
qty_fixed = 0
for r in rows:
    v = safe_float(r['quantity'])
    if v is not None and (v < lower_q or v > upper_q):
        r['quantity'] = str(int(qty_median))
        qty_fixed += 1

# price: 用同 product 均值替换异常值（排除异常后计算）
product_prices_clean = {}
for r in rows:
    p = r['product'].strip()
    v = safe_float(r['price'])
    if v is not None and lower_p <= v <= upper_p:
        product_prices_clean.setdefault(p, []).append(v)
product_avg_clean = {p: sum(v) / len(v) for p, v in product_prices_clean.items()}

price_fixed = 0
for r in rows:
    v = safe_float(r['price'])
    if v is not None and (v < lower_p or v > upper_p):
        r['price'] = str(int(product_avg_clean.get(r['product'].strip(), 0)))
        price_fixed += 1

print(f"  ✅ quantity 异常修正: {qty_fixed} 条 → 用中位数 {int(qty_median)} 替换")
print(f"  ✅ price 异常修正: {price_fixed} 条 → 用同产品均值替换")

# ==================== 修正后统计 ====================
print("\\n" + "-" * 60)
print(" 【4】修正后数据统计")
print("-" * 60)

qty_after = [safe_float(r['quantity']) for r in rows if safe_float(r['quantity']) is not None]
price_after = [safe_float(r['price']) for r in rows if safe_float(r['price']) is not None]

def stats(vals):
    n = len(vals)
    s = sorted(vals)
    return {
        'count': n,
        'mean': sum(vals) / n,
        'median': s[n // 2],
        'min': s[0],
        'max': s[-1],
        'std': (sum((x - sum(vals)/n)**2 for x in vals) / n) ** 0.5
    }

qty_s = stats(qty_after)
price_s = stats(price_after)

print(f"\\n  【quantity 修正前后对比】")
print(f"    修正前: 均值={sum(qty_before)/len(qty_before):.1f}, 中位数={sorted(qty_before)[len(qty_before)//2]:.1f}")
print(f"    修正后: 均值={qty_s['mean']:.1f}, 中位数={qty_s['median']:.1f}, 范围=[{qty_s['min']:.0f}, {qty_s['max']:.0f}]")

print(f"\\n  【price 修正前后对比】")
print(f"    修正前: 均值={sum(price_before)/len(price_before):.1f}, 中位数={sorted(price_before)[len(price_before)//2]:.1f}")
print(f"    修正后: 均值={price_s['mean']:.1f}, 中位数={price_s['median']:.1f}, 范围=[{price_s['min']:.0f}, {price_s['max']:.0f}]")

# ==================== 最终数据预览 ====================
print("\\n" + "=" * 60)
print("          📋 Step 3 修正后完整数据")
print("=" * 60)

print("  " + " | ".join([f"{f:>12}" for f in fields]))
print("  " + "-" * (15 * len(fields)))

for r in rows:
    print("  " + " | ".join([f"{r[f]:>12}" for f in fields]))

# ==================== 汇总 ====================
print("\\n" + "=" * 60)
print("                  📝 Step 3 修正报告汇总")
print("=" * 60)
print(f"  ✅ 原始记录数:         {len(rows)} 行")
print(f"  ✅ quantity 异常修正:  {qty_fixed} 条")
print(f"  ✅ price 异常修正:      {price_fixed} 条")
print(f"  ✅ 修正后 quantity 均值: {qty_s['mean']:.1f} (合理范围)")
print(f"  ✅ 修正后 price 均值:   {price_s['mean']:.1f} (合理范围)")
print("=" * 60)
print("\\n  🎉 数据清洗全流程完成！")
print("  👉 建议下一步: 导出清洗后的数据，进行后续分析（如可视化、建模等）")
`;

  const [step3Code, setStep3Code] = useState(step3Placeholder);
  const [step3Result, setStep3Result] = useState<any>(null);
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3ShowAnswer, setStep3ShowAnswer] = useState(false);

  // ====================== 通用运行函数 ======================
  const runCode = async (
    code: string,
    setResult: (r: any) => void,
    setLoading: (b: boolean) => void
  ) => {
    if (!code.trim()) return;
    if (pyodideStatus !== 'ready') return;
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
        error: { type: 'ExecutionError', message: '执行出错: ' + (err as Error).message }
      });
    } finally {
      setLoading(false);
    }
  };

  // ====================== 渲染代码编辑器 + 输出 ======================
  const renderCodeBlock = (
    title: string,
    codeValue: string,
    onChange: (c: string) => void,
    result: any,
    loading: boolean,
    showAnswer: boolean,
    setShowAnswer: (b: boolean) => void,
    resetCode: () => void,
    runFn: () => void,
    answerCode: string,
    placeholderCode: string
  ) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">
        <AceEditor
          mode="python"
          theme="monokai"
          value={codeValue}
          onChange={onChange}
          name={`editor-${title}`}
          editorProps={{ $blockScrolling: true }}
          className="rounded-lg"
          style={{ height: '320px', width: '100%', fontSize: '13px' }}
          setOptions={{
            fontSize: '13px',
            showLineNumbers: true,
            tabSize: 4,
          }}
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            onClick={runFn}
            disabled={loading || pyodideStatus !== 'ready'}
            className={`px-6 py-2 rounded-full font-bold shadow-button transition-all ${
              loading || pyodideStatus !== 'ready'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-primary text-white hover:shadow-button-hover hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin inline-block w-4 h-4 border-b-2 border-white mr-2 rounded-full"></span>
                运行中...
              </span>
            ) : (
              '▶ 运行代码'
            )}
          </button>

          <button
            onClick={() => {
              if (!showAnswer) {
                onChange(answerCode);
                setShowAnswer(true);
              } else {
                onChange(placeholderCode);
                setShowAnswer(false);
              }
            }}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
          >
            {showAnswer ? '隐藏参考答案' : '💡 查看参考答案'}
          </button>

          <button
            onClick={resetCode}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
          >
            🔄 重置
          </button>
        </div>

        {result && !result.success && result.error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100 mt-4">
            <div className="font-bold mb-2">❌ {result.error.type}</div>
            <div className="text-sm whitespace-pre-wrap">{result.error.message}</div>
            {result.error.details && (
              <div className="text-xs mt-2 whitespace-pre-wrap opacity-80">{result.error.details}</div>
            )}
          </div>
        )}

        {result && (result.stdout || result.output) && (
          <div className="mt-4">
            <div className="flex items-center mb-2 text-sm text-gray-600">
              <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span>
              <span>运行结果</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
              {result.output || result.stdout || '(无输出)'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );

  // ====================== 主渲染 ======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* ==================== Hero 区域 ==================== */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-10 md:p-14 text-center text-white">
            <div className="text-7xl md:text-8xl mb-4 inline-block animate-bounce-slow">🧹</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">数据清洗实战</h1>
            <p className="text-lg md:text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
              掌握数据分析的第一步基本功——从脏数据中提取高质量信息。<br />
              通过 3 步递进练习，你将学会诊断、清理、修正一份真实的订单数据集。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-10">
            {[
              { icon: '🔍', title: '问题诊断', desc: '发现缺失值、重复值、异常值' },
              { icon: '🧼', title: '清洗处理', desc: '填充、去重、格式标准化' },
              { icon: '✅', title: '修正对比', desc: 'IQR 法检测 + 前后对比' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-lg font-bold text-gray-800 mb-1">Step {i + 1}: {item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== Pyodide 加载 ==================== */}
        {pyodideStatus !== 'ready' && (
          <div className="mb-10">
            <PyodideLoader
              stage={pyodideStage}
              percent={pyodidePercent}
              error={pyodideError}
              elapsedSeconds={elapsedSeconds}
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* ==================== 核心概念板块 ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
            📖 核心概念
          </h2>
          <p className="text-center text-gray-600 mb-8">在动手之前，先了解数据清洗的"为什么"和"是什么"</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">什么是脏数据？</h3>
              <p className="text-orange-800 leading-relaxed">
                脏数据是指<strong>不完整、不准确、不一致或格式混乱</strong>的数据。
                它会导致分析结果失真，严重时会让模型做出完全错误的决策。
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">为什么要清洗？—— GIGO 原则</h3>
              <p className="text-red-800 leading-relaxed">
                <strong>Garbage In, Garbage Out</strong>（垃圾进，垃圾出）。
                再先进的算法也救不了劣质数据。据统计，数据分析师花在数据清洗上的时间
                占整个工作的 <strong>60%–80%</strong>。
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4">🔖 常见的脏数据类型</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🔲', title: '缺失值 (Missing Values)', color: 'from-blue-50 to-blue-100 border-blue-200',
                desc: '字段为空或 NaN。可能由录入遗漏、系统错误或用户未填写造成。',
                example: 'price: "" 或 quantity: NaN' },
              { icon: '📊', title: '异常值 (Outliers)', color: 'from-purple-50 to-purple-100 border-purple-200',
                desc: '与整体分布显著偏离的值，可能是录入错误（如多写了一个 9），也可能是真实极端情况。',
                example: 'price: 99999, quantity: -2' },
              { icon: '🔁', title: '重复值 (Duplicates)', color: 'from-green-50 to-green-100 border-green-200',
                desc: '同一记录出现多次，通常由系统重复提交或数据合并不当造成。',
                example: '订单 1001 出现了 3 次' },
              { icon: '🔤', title: '格式不一致 (Inconsistent Format)', color: 'from-amber-50 to-amber-100 border-amber-200',
                desc: '同一含义的数据有不同写法，导致相同值被误认为不同。',
                example: '"北京" vs "beijing"  vs "2024/01/15" vs "2024-01-15"' },
            ].map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.color} border rounded-2xl p-5`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{card.icon}</div>
                  <div>
                    <div className="font-bold text-gray-800 mb-1">{card.title}</div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">{card.desc}</p>
                    <div className="text-xs font-mono bg-white/60 rounded-lg px-3 py-2 text-gray-700">
                      例：{card.example}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== Step 1 ==================== */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-xl p-6 md:p-8 text-white mb-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl md:text-6xl font-bold opacity-30">1</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Step 1 · 基础</div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">问题诊断</h2>
                <p className="text-blue-50 leading-relaxed">
                  读取订单数据 → 统计缺失值、重复值、异常值 → 输出一份数据质量诊断报告。
                  这一步的目标是：<strong>看清数据到底有多脏</strong>。
                </p>
              </div>
            </div>
          </div>

          {step1ShowAnswer && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>参考答案已载入编辑器</strong>。点击"▶ 运行代码"查看诊断报告。
                你也可以在编辑器基础上自由修改/添加自己的诊断逻辑。
              </p>
            </div>
          )}

          {renderCodeBlock(
            'Step 1 代码编辑器',
            step1Code,
            setStep1Code,
            step1Result,
            step1Loading,
            step1ShowAnswer,
            setStep1ShowAnswer,
            () => { setStep1Code(step1Placeholder); setStep1Result(null); },
            () => runCode(step1Code, setStep1Result, setStep1Loading),
            step1Answer,
            step1Placeholder
          )}

          {step1ShowAnswer && step1Code !== step1Answer && (
            <div className="mt-4"></div>
          )}
        </div>

        {/* ==================== Step 2 ==================== */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-xl p-6 md:p-8 text-white mb-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl md:text-6xl font-bold opacity-30">2</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-emerald-100 uppercase tracking-wider">Step 2 · 进阶</div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">缺失值处理与去重</h2>
                <p className="text-emerald-50 leading-relaxed">
                  填充缺失值（中位数 / 同产品均值 / 众数）→ 删除重复行 → 统一字段格式。
                  这一步的目标是：<strong>让数据完整且一致</strong>。
                </p>
              </div>
            </div>
          </div>

          {step2ShowAnswer && (
            <div className="mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
              <p className="text-sm text-emerald-800">
                💡 <strong>参考答案已载入编辑器</strong>。点击"▶ 运行代码"查看清洗后的数据。
                观察从原始行数到去重后行数的变化，以及缺失字段被合理值填充的过程。
              </p>
            </div>
          )}

          {renderCodeBlock(
            'Step 2 代码编辑器',
            step2Code,
            setStep2Code,
            step2Result,
            step2Loading,
            step2ShowAnswer,
            setStep2ShowAnswer,
            () => { setStep2Code(step2Placeholder); setStep2Result(null); },
            () => runCode(step2Code, setStep2Result, setStep2Loading),
            step2Answer,
            step2Placeholder
          )}
        </div>

        {/* ==================== Step 3 ==================== */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-3xl shadow-xl p-6 md:p-8 text-white mb-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl md:text-6xl font-bold opacity-30">3</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-fuchsia-100 uppercase tracking-wider">Step 3 · 挑战</div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">异常值检测与修正</h2>
                <p className="text-fuchsia-50 leading-relaxed">
                  使用 <strong>IQR 四分位距法</strong> + <strong>描述性统计</strong> 识别异常，
                  用合理值替换异常字段，并最终输出<strong>清洗前后对比表</strong>。
                </p>
              </div>
            </div>
          </div>

          {step3ShowAnswer && (
            <div className="mb-4 p-4 bg-fuchsia-50 border-l-4 border-fuchsia-500 rounded-lg">
              <p className="text-sm text-fuchsia-800">
                💡 <strong>参考答案已载入编辑器</strong>。注意观察对比表中 min / max / mean 的变化——
                这是判断"清洗是否有效"的核心证据。
              </p>
            </div>
          )}

          {renderCodeBlock(
            'Step 3 代码编辑器',
            step3Code,
            setStep3Code,
            step3Result,
            step3Loading,
            step3ShowAnswer,
            setStep3ShowAnswer,
            () => { setStep3Code(step3Placeholder); setStep3Result(null); },
            () => runCode(step3Code, setStep3Result, setStep3Loading),
            step3Answer,
            step3Placeholder
          )}
        </div>

        {/* ==================== 关键知识点小卡片 ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎯 清洗策略速记</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-5">
              <h4 className="font-bold text-blue-900 mb-2">缺失值处理策略</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li><strong>数值型：</strong>中位数/同组均值</li>
                <li><strong>分类型：</strong>众数（最常见的值）</li>
                <li><strong>时间型：</strong>前向填充 (ffill)</li>
                <li><strong>缺失率 &gt; 50%：</strong>直接删除该列</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-5">
              <h4 className="font-bold text-purple-900 mb-2">IQR 法公式</h4>
              <pre className="text-sm font-mono text-purple-800 bg-white/60 rounded p-3 mt-2">
{`IQR = Q3 − Q1
下界 = Q1 − 1.5 × IQR
上界 = Q3 + 1.5 × IQR
超出 [下界, 上界] → 视为异常`}
              </pre>
            </div>
            <div className="border-l-4 border-green-500 bg-green-50 rounded-lg p-5">
              <h4 className="font-bold text-green-900 mb-2">去重原则</h4>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>按业务主键（如 order_id）去重</li>
                <li>保留第一条 / 最新一条</li>
                <li>删除前务必先统计数量</li>
              </ul>
            </div>
            <div className="border-l-4 border-amber-500 bg-amber-50 rounded-lg p-5">
              <h4 className="font-bold text-amber-900 mb-2">格式标准化清单</h4>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>日期：YYYY-MM-DD</li>
                <li>地区：统一中文 / 英文</li>
                <li>金额：保留 2 位小数</li>
                <li>字符串：去除首尾空格</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ==================== CourseCompletion ==================== */}
        <div className="mb-6">
          <CourseCompletion
            courseId="data-cleaning"
            courseTitle="数据清洗实战"
            badgeIcon="🧹"
            badgeName="数据清洁师"
          />
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;
