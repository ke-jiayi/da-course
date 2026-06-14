import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { runPythonCode, initPyodide, isPyodideReady, PyodideProgress, PyodideStage } from '../services/pyodideService';
import PyodideLoader from './PyodideLoader';
import CourseCompletion from './CourseCompletion';

const DATA_CSV = `订单ID,日期,类别,地区,销量,单价,销售额
ORD001,2024-01-05,电子产品,华东,12,3299,39588
ORD002,2024-01-08,服装,华北,28,299,8372
ORD003,2024-01-12,食品,华南,156,15,2340
ORD004,2024-01-15,电子产品,华东,8,5999,47992
ORD005,2024-01-18,家居,西南,5,1899,9495
ORD006,2024-01-22,服装,华东,42,199,8358
ORD007,2024-01-25,食品,华北,234,25,5850
ORD008,2024-01-28,电子产品,华南,15,4299,64485
ORD009,2024-02-02,家居,华东,12,2599,31188
ORD010,2024-02-05,服装,西南,35,399,13965
ORD011,2024-02-08,食品,华东,178,18,3204
ORD012,2024-02-12,电子产品,华北,9,6999,62991
ORD013,2024-02-15,家居,华南,8,3299,26392
ORD014,2024-02-18,服装,华东,56,259,14504
ORD015,2024-02-22,食品,西南,89,22,1958
ORD016,2024-02-25,电子产品,华东,18,3599,64782
ORD017,2024-03-02,家居,华北,14,1599,22386
ORD018,2024-03-05,服装,华南,48,329,15792
ORD019,2024-03-08,食品,华东,267,12,3204
ORD020,2024-03-12,电子产品,西南,7,7999,55993
ORD021,2024-03-15,家居,华东,11,2899,31889
ORD022,2024-03-18,服装,华北,62,179,11098
ORD023,2024-03-22,食品,华南,145,28,4060
ORD024,2024-03-25,电子产品,华东,22,2999,65978
ORD025,2024-03-28,家居,西南,6,4599,27594
ORD026,2024-04-02,服装,华东,38,459,17442
ORD027,2024-04-05,食品,华北,198,16,3168
ORD028,2024-04-08,电子产品,华南,13,4899,63687
ORD029,2024-04-12,家居,华东,9,3899,35091
ORD030,2024-04-15,服装,西南,29,289,8381`;

const step1Answer = `import pandas as pd
from io import StringIO

csv_data = """${DATA_CSV}"""
df = pd.read_csv(StringIO(csv_data))

print("=== 数据集预览 ===")
print(df.head())
print()

print("=== 1. 按类别统计销售额 ===")
category_sales = df.groupby('类别')['销售额'].sum().sort_values(ascending=False)
print(category_sales)
print()

print("=== 2. 按地区统计销量 ===")
region_qty = df.groupby('地区')['销量'].sum().sort_values(ascending=False)
print(region_qty)
print()

print("=== 3. 按类别统计订单数 ===")
category_count = df.groupby('类别')['订单ID'].count()
print(category_count)
print()

print("=== 4. 综合统计：各地区的销售额、销量、订单数 ===")
region_summary = df.groupby('地区').agg(
    总销售额=('销售额', 'sum'),
    总销量=('销量', 'sum'),
    订单数=('订单ID', 'count'),
    平均单价=('单价', 'mean')
).round(2).sort_values('总销售额', ascending=False)
print(region_summary)`;

const step2Answer = `import pandas as pd
from io import StringIO

csv_data = """${DATA_CSV}"""
df = pd.read_csv(StringIO(csv_data))

df['月份'] = df['日期'].str.slice(0, 7)

print("=== 1. 多维分组：类别 + 地区 ===")
multi_group = df.groupby(['类别', '地区']).agg(
    总销售额=('销售额', 'sum'),
    总销量=('销量', 'sum'),
    订单数=('订单ID', 'count'),
    平均单价=('单价', 'mean')
).round(2)
print(multi_group)
print()

print("=== 2. 多维分组：地区 + 月份 ===")
region_month = df.groupby(['地区', '月份']).agg(
    总销售额=('销售额', 'sum'),
    总销量=('销量', 'sum')
).round(2).sort_values(['地区', '总销售额'], ascending=[True, False])
print(region_month)
print()

print("=== 3. 使用多重聚合函数 ===")
agg_multi = df.groupby('类别').agg({
    '销售额': ['sum', 'mean', 'min', 'max', 'count'],
    '销量': ['sum', 'mean', 'median'],
    '单价': ['mean', 'max']
}).round(2)
print(agg_multi)
print()

print("=== 4. TOP3 销售额地区 ===")
top_regions = df.groupby('地区')['销售额'].sum().sort_values(ascending=False).head(3)
print(top_regions)
print()

print("=== 5. 筛选销售额超过 100000 的类别 ===")
category_total = df.groupby('类别')['销售额'].sum()
high_value = category_total[category_total > 100000].sort_values(ascending=False)
print(high_value)`;

const step3Answer = `import pandas as pd
from io import StringIO

csv_data = """${DATA_CSV}"""
df = pd.read_csv(StringIO(csv_data))

df['月份'] = df['日期'].str.slice(0, 7)

print("=== 1. 基础透视表：各地区各类别的销售额 ===")
pivot1 = pd.pivot_table(
    df,
    values='销售额',
    index='地区',
    columns='类别',
    aggfunc='sum',
    fill_value=0
).round(2)
print(pivot1)
print()

print("=== 2. 透视表：各月各类别的销量 ===")
pivot2 = pd.pivot_table(
    df,
    values='销量',
    index='月份',
    columns='类别',
    aggfunc='sum',
    fill_value=0,
    margins=True,
    margins_name='合计'
)
print(pivot2)
print()

print("=== 3. 多层索引聚合分析 ===")
multi_index = df.groupby(['地区', '类别']).agg({
    '销售额': ['sum', 'mean'],
    '销量': ['sum', 'median']
}).round(2)
print(multi_index)
print()

print("=== 4. 聚合后排序：找出各地区销量最高的类别 ===")
region_category = df.groupby(['地区', '类别'])['销售额'].sum().reset_index()
for region in region_category['地区'].unique():
    region_data = region_category[region_category['地区'] == region]
    top = region_data.sort_values('销售额', ascending=False).head(1)
    print(f"{region}: {top['类别'].values[0]} - {top['销售额'].values[0]} 元")
print()

print("=== 5. 业务洞察：交叉分析 ===")
insight = pd.pivot_table(
    df,
    values='销售额',
    index='地区',
    columns='类别',
    aggfunc='sum',
    fill_value=0
).round(2)

print("各地区销售贡献表（单位：元）：")
print(insight)
print()

print("销售最强地区排名：")
print(insight.sum(axis=1).sort_values(ascending=False))
print()

print("销售最强类别排名：")
print(insight.sum(axis=0).sort_values(ascending=False))`;

const placeholder1 = `# Step 1：单维度分组聚合练习
# 任务：使用 pandas groupby 按类别/地区汇总销售数据
#
# 提示：
# 1. 数据已通过 CSV 字符串提供，使用 pd.read_csv 读取
# 2. 使用 df.groupby('列名')['汇总列'].sum() 进行分组汇总
# 3. 可以使用 .sort_values() 对结果进行排序
# 4. 使用 .agg() 同时进行多项聚合

import pandas as pd
from io import StringIO

csv_data = """在此粘贴 CSV 数据，或点击"显示参考答案"查看完整实现"""

# 在这里编写你的代码...
`;

const placeholder2 = `# Step 2：多维分组与筛选练习
# 任务：使用双重 groupby + 多列聚合 + 排序筛选
#
# 提示：
# 1. df.groupby(['列1', '列2']) 进行多维分组
# 2. .agg({列: [函数1, 函数2]}) 进行多函数聚合
# 3. .head(3) 筛选前 3 名
# 4. 使用 df['日期'].str.slice(0, 7) 提取月份

import pandas as pd
from io import StringIO

# 在这里编写你的代码...
`;

const placeholder3 = `# Step 3：透视表与多层索引分析
# 任务：使用 pivot_table 创建交叉表并进行业务洞察
#
# 提示：
# 1. pd.pivot_table(df, values=..., index=..., columns=..., aggfunc=...)
# 2. margins=True 添加合计行/列
# 3. fill_value=0 处理缺失值
# 4. .reset_index() 将多层索引转为普通列

import pandas as pd
from io import StringIO

# 在这里编写你的代码...
`;

interface StepState {
  code: string;
  result: { success: boolean; output?: string; stdout: string; stderr: string; error?: any } | null;
  isLoading: boolean;
  showAnswer: boolean;
}

const GroupAggregation: React.FC = () => {
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pyodideStage, setPyodideStage] = useState<PyodideStage>(0);
  const [pyodidePercent, setPyodidePercent] = useState(0);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [step1, setStep1] = useState<StepState>({ code: placeholder1, result: null, isLoading: false, showAnswer: false });
  const [step2, setStep2] = useState<StepState>({ code: placeholder2, result: null, isLoading: false, showAnswer: false });
  const [step3, setStep3] = useState<StepState>({ code: placeholder3, result: null, isLoading: false, showAnswer: false });

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const checkPyodide = async () => {
      if (isPyodideReady()) {
        setPyodideStatus('ready');
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

  const handleRunCode = async (
    _stepNum: 1 | 2 | 3,
    setState: React.Dispatch<React.SetStateAction<StepState>>,
    currentState: StepState
  ) => {
    if (!currentState.code.trim()) {
      setState({
        ...currentState,
        result: {
          success: false,
          stdout: '',
          stderr: '',
          error: { type: 'InputError', message: '请输入代码后再运行' }
        }
      });
      return;
    }

    if (pyodideStatus !== 'ready') {
      setState({
        ...currentState,
        result: {
          success: false,
          stdout: '',
          stderr: '',
          error: { type: 'SystemError', message: 'Python 环境正在初始化，请稍候...' }
        }
      });
      return;
    }

    setState({ ...currentState, isLoading: true, result: null });

    try {
      const executionResult = await runPythonCode(currentState.code);
      setState({ ...currentState, isLoading: false, result: executionResult });
    } catch (err) {
      setState({
        ...currentState,
        isLoading: false,
        result: {
          success: false,
          stdout: '',
          stderr: '',
          error: { type: 'ExecutionError', message: '执行出错: ' + (err as Error).message }
        }
      });
    }
  };

  const handleShowAnswer = (
    setState: React.Dispatch<React.SetStateAction<StepState>>,
    currentState: StepState,
    answer: string
  ) => {
    setState({ ...currentState, code: answer, showAnswer: true, result: null });
  };

  const handleReset = (
    setState: React.Dispatch<React.SetStateAction<StepState>>,
    currentState: StepState,
    placeholder: string
  ) => {
    setState({ ...currentState, code: placeholder, result: null, showAnswer: false });
  };

  const renderCodeEditor = (
    stepNum: 1 | 2 | 3,
    state: StepState,
    setState: React.Dispatch<React.SetStateAction<StepState>>,
    answer: string,
    placeholder: string
  ) => (
    <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
      <div className="mb-4">
        <AceEditor
          mode="python"
          theme="monokai"
          value={state.code}
          onChange={(newCode: string) => setState({ ...state, code: newCode, result: null })}
          name={`group-aggregation-editor-${stepNum}`}
          editorProps={{ $blockScrolling: true }}
          className="rounded-lg shadow-md border-2 border-slate-700"
          style={{ height: '400px', width: '100%' }}
          fontSize={14}
          showPrintMargin={false}
          highlightActiveLine={true}
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => handleRunCode(stepNum, setState, state)}
          disabled={state.isLoading || pyodideStatus !== 'ready'}
          className={`px-6 py-2 rounded-full font-bold transition-all shadow-button hover:shadow-button-hover hover:-translate-y-0.5 ${
            state.isLoading || pyodideStatus !== 'ready'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-primary text-white'
          }`}
        >
          {state.isLoading ? '⏳ 运行中...' : '▶ 运行代码'}
        </button>

        <button
          onClick={() => handleShowAnswer(setState, state, answer)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all"
        >
          💡 显示参考答案
        </button>

        <button
          onClick={() => handleReset(setState, state, placeholder)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all"
        >
          🔄 重置
        </button>
      </div>

      {state.result && (
        <div className="mt-6">
          {!state.result.success && state.result.error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-100">
              <div className="font-semibold text-red-300 mb-2">⚠️ {state.result.error.type}</div>
              <div className="text-sm whitespace-pre-wrap">{state.result.error.message}</div>
              {state.result.stdout && (
                <div className="mt-3 pt-3 border-t border-red-700/50">
                  <div className="text-red-200 text-xs mb-1">标准输出:</div>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-red-100">{state.result.stdout}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-400">{state.result.output || state.result.stdout || '代码执行成功！'}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (pyodideStatus === 'loading' || pyodideStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <PyodideLoader
            stage={pyodideStage}
            percent={pyodidePercent}
            error={pyodideError}
            elapsedSeconds={elapsedSeconds}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero 区域 */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="text-8xl md:text-9xl flex-shrink-0 animate-pulse">📊</div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">分组聚合分析</h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
                掌握 pandas 的 groupby、聚合函数与透视表，从海量数据中提取业务洞察。
                通过 3 个递进式练习，学会按维度拆分数据、计算统计指标、生成交叉分析报告。
              </p>
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">🐍 Python / Pandas</span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">📈 GROUP BY</span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">🔍 数据洞察</span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">⏱️ 约 45 分钟</span>
              </div>
            </div>
          </div>
        </div>

        {/* 核心概念板块 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-12 border border-purple-100">
          <h2 className="text-3xl font-bold mb-8 text-slate-800 flex items-center gap-3">
            <span className="text-4xl">📚</span>
            核心概念
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="text-5xl mb-4">🔀</div>
              <h3 className="text-xl font-bold mb-3 text-blue-900">什么是分组聚合？</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                分组聚合（Group By）是数据分析中的核心操作：将数据按照一个或多个<span className="font-semibold text-blue-700">维度字段</span>拆分成分组，然后对每个分组执行<span className="font-semibold text-blue-700">聚合计算</span>（求和、平均、计数等），最终得到汇总后的洞察力。
              </p>
              <div className="bg-white/80 rounded-lg p-3 text-sm font-mono text-slate-600">
                <div className="text-blue-600 font-semibold mb-1"># 语法结构</div>
                <div>df.groupby('类别')['销售额'].sum()</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-green-900">GROUP BY 应用场景</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-slate-700"><span className="font-semibold text-green-700">销售分析：</span>按地区/类别/月份汇总业绩</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-slate-700"><span className="font-semibold text-green-700">用户分析：</span>按渠道/等级统计用户行为</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-slate-700"><span className="font-semibold text-green-700">库存分析：</span>按仓库/品类计算库存量</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-slate-700"><span className="font-semibold text-green-700">财务分析：</span>按部门/季度汇总支出</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="text-5xl mb-4">🧮</div>
              <h3 className="text-xl font-bold mb-3 text-orange-900">聚合函数</h3>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="font-bold text-orange-700">sum()</div>
                  <div className="text-sm text-slate-600">求和</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="font-bold text-orange-700">mean()</div>
                  <div className="text-sm text-slate-600">平均值</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="font-bold text-orange-700">count()</div>
                  <div className="text-sm text-slate-600">计数</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="font-bold text-orange-700">median()</div>
                  <div className="text-sm text-slate-600">中位数</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="font-bold text-orange-700">min()</div>
                  <div className="text-sm text-slate-600">最小值</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="font-bold text-orange-700">max()</div>
                  <div className="text-sm text-slate-600">最大值</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
              <div className="text-5xl mb-4">🔲</div>
              <h3 className="text-xl font-bold mb-3 text-pink-900">透视表 (Pivot Table)</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                透视表是一种强大的<span className="font-semibold text-pink-700">交叉分析工具</span>，它将两个维度分别作为行和列，在交叉单元格中显示聚合值，便于发现数据中的模式和异常。
              </p>
              <div className="bg-white/80 rounded-lg p-3 text-sm font-mono text-slate-600">
                <div className="text-pink-600 font-semibold mb-1"># 透视表语法</div>
                <div>pd.pivot_table(df, values='销售额',</div>
                <div className="ml-8">index='地区', columns='类别',</div>
                <div className="ml-8">aggfunc='sum')</div>
              </div>
            </div>
          </div>
        </div>

        {/* 数据集说明 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-12 border border-purple-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            练习数据集：电商销售记录
          </h2>
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-blue-600">30</div>
                <div className="text-sm text-slate-600 mt-1">订单总数</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-purple-600">4</div>
                <div className="text-sm text-slate-600 mt-1">产品类别</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-pink-600">4</div>
                <div className="text-sm text-slate-600 mt-1">销售地区</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">订单ID</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">日期</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">类别</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">地区</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">销量</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">单价</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">销售额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-slate-600">ORD001</td>
                    <td className="px-3 py-2 text-slate-600">2024-01-05</td>
                    <td className="px-3 py-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">电子产品</span></td>
                    <td className="px-3 py-2 text-slate-600">华东</td>
                    <td className="px-3 py-2 text-right text-slate-600">12</td>
                    <td className="px-3 py-2 text-right text-slate-600">3,299</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-700">39,588</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-slate-600">ORD002</td>
                    <td className="px-3 py-2 text-slate-600">2024-01-08</td>
                    <td className="px-3 py-2"><span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">服装</span></td>
                    <td className="px-3 py-2 text-slate-600">华北</td>
                    <td className="px-3 py-2 text-right text-slate-600">28</td>
                    <td className="px-3 py-2 text-right text-slate-600">299</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-700">8,372</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-slate-600">ORD003</td>
                    <td className="px-3 py-2 text-slate-600">2024-01-12</td>
                    <td className="px-3 py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">食品</span></td>
                    <td className="px-3 py-2 text-slate-600">华南</td>
                    <td className="px-3 py-2 text-right text-slate-600">156</td>
                    <td className="px-3 py-2 text-right text-slate-600">15</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-700">2,340</td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="px-3 py-2 text-center text-slate-500 text-xs italic">... 共 30 条记录（完整数据在代码中嵌入）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Step 1 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-purple-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Step 1：基础 · 单维度分组聚合</h2>
              <p className="text-slate-600 leading-relaxed">
                学习最基础的 groupby 用法：按单个字段（类别/地区）对数据进行分组，然后使用 sum、count、mean 等聚合函数进行汇总统计。
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <div className="font-semibold text-blue-900 mb-2">🎯 练习任务</div>
            <ol className="text-blue-800 space-y-1 text-sm list-decimal list-inside">
              <li>读取 CSV 销售数据并预览前几行</li>
              <li>按【类别】统计各产品类别的总销售额，并按降序排列</li>
              <li>按【地区】统计各地区的总销量</li>
              <li>按【类别】统计订单数量</li>
              <li>综合：按【地区】计算总销售额、总销量、订单数、平均单价</li>
            </ol>
          </div>

          {renderCodeEditor(1, step1, setStep1, step1Answer, placeholder1)}
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-purple-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Step 2：进阶 · 多维分组与筛选</h2>
              <p className="text-slate-600 leading-relaxed">
                学习使用多个字段进行分组（如类别+地区、地区+月份），对同一列应用多种聚合函数（sum/mean/median/min/max），并对结果进行排序和筛选 TOP N。
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
            <div className="font-semibold text-purple-900 mb-2">🎯 练习任务</div>
            <ol className="text-purple-800 space-y-1 text-sm list-decimal list-inside">
              <li>按【类别 + 地区】进行多维分组，计算总销售额、总销量、订单数、平均单价</li>
              <li>从日期中提取月份，按【地区 + 月份】分组分析销售趋势</li>
              <li>使用 .agg() 对销售额、销量、单价分别应用多种聚合函数</li>
              <li>筛选出销售额 TOP3 的地区</li>
              <li>筛选出总销售额超过 100,000 的产品类别</li>
            </ol>
          </div>

          {renderCodeEditor(2, step2, setStep2, step2Answer, placeholder2)}
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-purple-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Step 3：挑战 · 透视表与多层索引</h2>
              <p className="text-slate-600 leading-relaxed">
                学习使用 pivot_table 创建交叉分析表，理解多层索引结构，对聚合结果进行二次排序和筛选，最终从数据中提取出有价值的业务洞察。
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
            <div className="font-semibold text-orange-900 mb-2">🎯 练习任务</div>
            <ol className="text-orange-800 space-y-1 text-sm list-decimal list-inside">
              <li>创建透视表：各地区（行）× 各产品类别（列）的总销售额矩阵</li>
              <li>创建月度透视表：各月份 × 各类别的销量表（含合计行/列）</li>
              <li>使用多层索引进行聚合，同时计算销售额和销量的多种指标</li>
              <li>对聚合结果进行二次筛选，找出各地区销售额最高的类别</li>
              <li>综合业务洞察：输出各地区、各类别的销售排名，分析市场表现</li>
            </ol>
          </div>

          {renderCodeEditor(3, step3, setStep3, step3Answer, placeholder3)}
        </div>

        {/* 课程完成 */}
        <CourseCompletion
          courseId="group-aggregation"
          courseTitle="分组聚合分析"
          badgeIcon="📈"
          badgeName="分组分析专家"
        />
      </div>
    </div>
  );
};

export default GroupAggregation;
