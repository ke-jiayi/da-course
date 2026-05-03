import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface ChoiceQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExerciseData {
  id: string;
  title: string;
  description: string;
  questions: ChoiceQuestion[];
}

const dataCleaningQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '在Pandas中，以下哪个方法可以用来检测DataFrame中的缺失值？',
    options: ['df.isnull()', 'df.missing()', 'df.isnan()', 'df.empty()'],
    correctAnswer: 0,
    explanation: 'df.isnull() 方法返回一个布尔DataFrame，标识每个元素是否为缺失值。df.isna() 是其别名，功能相同。'
  },
  {
    id: 2,
    question: '使用均值填充缺失值时，以下哪种情况可能导致问题？',
    options: [
      '数据量较大时',
      '数据存在极端异常值时',
      '数据为数值类型时',
      '数据分布均匀时'
    ],
    correctAnswer: 1,
    explanation: '当数据存在极端异常值时，均值会受到异常值的影响而偏离中心位置，此时使用均值填充可能不够准确。建议使用中位数或截尾均值。'
  },
  {
    id: 3,
    question: '关于IQR方法识别异常值，以下说法正确的是？',
    options: [
      'IQR = Q3 - Q1，异常值定义为小于Q1-1.5*IQR或大于Q3+1.5*IQR的值',
      'IQR方法只适用于正态分布数据',
      'IQR = 最大值 - 最小值',
      'IQR方法无法识别极端异常值'
    ],
    correctAnswer: 0,
    explanation: 'IQR（四分位距）= Q3 - Q1，异常值通常定义为小于Q1-1.5*IQR或大于Q3+1.5*IQR的值。这是一种基于分位数的稳健方法，不依赖于数据的分布假设。'
  },
  {
    id: 4,
    question: '在数据预处理中，为什么要进行数据标准化（Normalization）？',
    options: [
      '为了使数据更美观',
      '为了消除不同特征量纲差异的影响，使模型训练更稳定',
      '为了减少数据量',
      '为了增加数据的复杂性'
    ],
    correctAnswer: 1,
    explanation: '数据标准化可以消除不同特征之间的量纲差异，使各特征处于同一数量级，这对于基于距离的算法（如KNN、SVM）和梯度下降优化非常重要。'
  },
  {
    id: 5,
    question: '以下哪种方法不适合处理分类变量的缺失值？',
    options: [
      '使用众数填充',
      '使用"Unknown"作为新类别填充',
      '使用均值填充',
      '使用预测模型预测缺失值'
    ],
    correctAnswer: 2,
    explanation: '均值是数值型变量的统计量，不能用于分类变量。分类变量的缺失值通常使用众数填充、创建新类别或使用分类预测模型进行填充。'
  },
  {
    id: 6,
    question: '在Pandas中，df.dropna()方法的默认行为是？',
    options: [
      '删除所有包含缺失值的列',
      '删除所有包含缺失值的行',
      '将缺失值替换为0',
      '将缺失值替换为均值'
    ],
    correctAnswer: 1,
    explanation: 'df.dropna() 默认删除包含任何缺失值的行（axis=0）。可以通过设置参数改变行为，如axis=1删除列，how="all"只删除全为缺失值的行。'
  },
  {
    id: 7,
    question: 'Z-score方法识别异常值的标准通常是？',
    options: [
      'Z-score > 1',
      'Z-score > 2 或 Z-score < -2',
      'Z-score = 0',
      'Z-score > 3 或 Z-score < -3',
    ],
    correctAnswer: 3,
    explanation: 'Z-score方法通常将|Z-score| > 3的数据点视为异常值。Z-score表示数据点距离均值的标准差倍数，3倍标准差之外的数据较为罕见。'
  }
];

const dataVisualizationQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '以下哪种图表最适合展示数据随时间变化的趋势？',
    options: ['饼图', '柱状图', '折线图', '散点图'],
    correctAnswer: 2,
    explanation: '折线图最适合展示数据随时间变化的趋势，因为它能清晰地显示数据的连续变化和走势，便于观察上升、下降或周期性变化。'
  },
  {
    id: 2,
    question: '在Matplotlib中，如何设置图表的标题？',
    options: ['plt.name()', 'plt.title()', 'plt.label()', 'plt.heading()'],
    correctAnswer: 1,
    explanation: 'plt.title() 用于设置图表的标题。例如：plt.title("销售趋势图")。这是Matplotlib中最常用的标题设置方法。'
  },
  {
    id: 3,
    question: '关于饼图的使用，以下说法错误的是？',
    options: [
      '适合展示各部分占整体的比例',
      '当类别过多时（超过7个），饼图可读性会下降',
      '饼图可以很好地展示精确的数值比较',
      '可以通过explode参数突出显示某个扇区'
    ],
    correctAnswer: 2,
    explanation: '饼图不适合展示精确的数值比较，人眼对角度的判断不如对长度敏感。当需要精确比较数值时，柱状图是更好的选择。'
  },
  {
    id: 4,
    question: '散点图主要用于展示什么关系？',
    options: [
      '数据的分布情况',
      '两个变量之间的相关关系',
      '数据的时间序列变化',
      '各类别的数量对比'
    ],
    correctAnswer: 1,
    explanation: '散点图主要用于展示两个连续变量之间的关系，可以观察变量之间的相关性（正相关、负相关或无相关），以及数据的分布模式。'
  },
  {
    id: 5,
    question: '在Matplotlib中，plt.figure(figsize=(10, 6))的作用是？',
    options: [
      '设置图表的分辨率',
      '设置图表的大小为10英寸宽、6英寸高',
      '设置图表的边框',
      '设置图表的背景颜色'
    ],
    correctAnswer: 1,
    explanation: 'figsize参数用于设置图表的尺寸，单位为英寸。figsize=(10, 6)表示图表宽度为10英寸，高度为6英寸。'
  },
  {
    id: 6,
    question: '以下关于柱状图和直方图的区别，正确的是？',
    options: [
      '柱状图和直方图完全相同',
      '柱状图用于分类数据，直方图用于连续数据的分布',
      '直方图的柱子之间有间隔',
      '柱状图只能横向显示'
    ],
    correctAnswer: 1,
    explanation: '柱状图用于展示分类数据的数量或频率，柱子之间有间隔；直方图用于展示连续数据的分布，柱子之间没有间隔，表示数据的连续性。'
  },
  {
    id: 7,
    question: '在Matplotlib中，如何添加图例？',
    options: [
      'plt.name()',
      'plt.legend()',
      'plt.caption()',
      'plt.note()'
    ],
    correctAnswer: 1,
    explanation: 'plt.legend() 用于添加图例。在使用时，需要先在绑图函数中设置label参数，然后调用plt.legend()显示图例。'
  }
];

const machineLearningQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '在机器学习中，将数据集划分为训练集和测试集的主要目的是？',
    options: [
      '增加数据量',
      '评估模型在未见过的数据上的泛化能力',
      '减少训练时间',
      '提高模型复杂度'
    ],
    correctAnswer: 1,
    explanation: '划分训练集和测试集是为了评估模型的泛化能力。训练集用于训练模型，测试集用于评估模型在未见过的数据上的表现，防止过拟合。'
  },
  {
    id: 2,
    question: '以下关于交叉验证（Cross-Validation）的说法，正确的是？',
    options: [
      '交叉验证会增加训练时间，所以应该避免使用',
      'K折交叉验证将数据分成K份，每次用K-1份训练，1份验证',
      '交叉验证只能用于分类问题',
      '交叉验证会减少可用的训练数据'
    ],
    correctAnswer: 1,
    explanation: 'K折交叉验证将数据分成K份，每次用K-1份训练，1份验证，重复K次后取平均。这样可以更充分地利用数据，得到更稳定的模型评估结果。'
  },
  {
    id: 3,
    question: '混淆矩阵中，True Positive（TP）表示？',
    options: [
      '预测为负类，实际为负类',
      '预测为正类，实际为负类',
      '预测为正类，实际为正类',
      '预测为负类，实际为正类'
    ],
    correctAnswer: 2,
    explanation: 'True Positive（TP）表示模型正确预测为正类的样本数量，即预测为正类且实际也为正类的样本。这是评估分类模型性能的重要指标。'
  },
  {
    id: 4,
    question: '精确率（Precision）和召回率（Recall）的计算公式分别是？',
    options: [
      'Precision = TP/(TP+FP), Recall = TP/(TP+FN)',
      'Precision = TP/(TP+FN), Recall = TP/(TP+FP)',
      'Precision = (TP+TN)/总样本, Recall = TP/(TP+FP)',
      'Precision = TP/总样本, Recall = FP/总样本'
    ],
    correctAnswer: 0,
    explanation: '精确率 = TP/(TP+FP)，表示预测为正类的样本中真正为正类的比例；召回率 = TP/(TP+FN)，表示实际为正类的样本中被正确预测的比例。'
  },
  {
    id: 5,
    question: 'GridSearchCV的主要作用是？',
    options: [
      '自动生成训练数据',
      '通过网格搜索寻找最佳超参数组合',
      '可视化模型性能',
      '加速模型训练'
    ],
    correctAnswer: 1,
    explanation: 'GridSearchCV是一种超参数调优方法，它通过遍历给定的参数网格，使用交叉验证评估每组参数的性能，最终选择最优的参数组合。'
  },
  {
    id: 6,
    question: '以下哪种情况表示模型过拟合（Overfitting）？',
    options: [
      '训练集准确率高，测试集准确率也高',
      '训练集准确率低，测试集准确率高',
      '训练集准确率高，测试集准确率低',
      '训练集准确率低，测试集准确率也低'
    ],
    correctAnswer: 2,
    explanation: '过拟合是指模型在训练数据上表现很好，但在测试数据上表现较差。这说明模型过度学习了训练数据的噪声和细节，泛化能力不足。'
  },
  {
    id: 7,
    question: '在Scikit-learn中，StandardScaler的作用是？',
    options: [
      '将数据转换为0-1范围',
      '将数据标准化为均值为0，标准差为1的分布',
      '删除异常值',
      '填充缺失值'
    ],
    correctAnswer: 1,
    explanation: 'StandardScaler将数据标准化，使每个特征的均值为0，标准差为1。公式为：(x - mean) / std。这有助于特征处于同一尺度，提高模型训练效果。'
  },
  {
    id: 8,
    question: '逻辑回归（Logistic Regression）主要用于解决什么类型的问题？',
    options: [
      '回归问题',
      '二分类问题',
      '聚类问题',
      '降维问题'
    ],
    correctAnswer: 1,
    explanation: '尽管名字中包含"回归"，逻辑回归实际上是一种分类算法，主要用于二分类问题。它通过sigmoid函数将线性组合映射到0-1之间，表示属于正类的概率。'
  }
];

const timeSeriesQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '时间序列数据最重要的特征是？',
    options: [
      '数据量很大',
      '数据按时间顺序排列，具有时间依赖性',
      '数据都是数值型',
      '数据没有缺失值'
    ],
    correctAnswer: 1,
    explanation: '时间序列数据的核心特征是数据按时间顺序排列，相邻时间点的数据之间存在依赖关系。这种时间依赖性是时间序列分析的基础。'
  },
  {
    id: 2,
    question: '平稳时间序列的定义是？',
    options: [
      '数据没有波动',
      '均值、方差不随时间变化，自协方差只与时间间隔有关',
      '数据呈线性增长',
      '数据没有季节性'
    ],
    correctAnswer: 1,
    explanation: '平稳时间序列的统计特性（均值、方差）不随时间变化，且自协方差只与时间间隔有关，与时间点无关。平稳性是许多时间序列模型的基本假设。'
  },
  {
    id: 3,
    question: 'ADF检验（Augmented Dickey-Fuller Test）用于检验什么？',
    options: [
      '数据是否正态分布',
      '时间序列是否存在单位根（是否平稳）',
      '数据是否有缺失值',
      '数据是否有异常值'
    ],
    correctAnswer: 1,
    explanation: 'ADF检验用于检验时间序列是否存在单位根。如果p值小于显著性水平（如0.05），则拒绝原假设，认为序列是平稳的；否则认为序列非平稳。'
  },
  {
    id: 4,
    question: 'ARIMA模型中的参数(p,d,q)分别代表什么？',
    options: [
      'p=周期，d=差分次数，q=季节性',
      'p=自回归阶数，d=差分阶数，q=移动平均阶数',
      'p=预测步数，d=数据量，q=准确率',
      'p=平滑系数，d=延迟，q=权重'
    ],
    correctAnswer: 1,
    explanation: 'ARIMA(p,d,q)中，p是自回归项数（AR），d是差分次数（使序列平稳），q是移动平均项数（MA）。这三个参数决定了模型的结构。'
  },
  {
    id: 5,
    question: '移动平均（Moving Average）在时间序列分析中的作用是？',
    options: [
      '预测未来值',
      '平滑数据，消除短期波动，显示长期趋势',
      '检测异常值',
      '填充缺失值'
    ],
    correctAnswer: 1,
    explanation: '移动平均通过计算一定窗口内数据的平均值来平滑时间序列，可以消除短期波动和噪声，更好地显示数据的长期趋势和周期性。'
  },
  {
    id: 6,
    question: '以下哪种方法可以使非平稳时间序列变为平稳？',
    options: [
      '标准化',
      '差分',
      '归一化',
      '对数变换'
    ],
    correctAnswer: 1,
    explanation: '差分是使时间序列平稳的常用方法，即用当前值减去前一个值。一阶差分可以消除线性趋势，二阶差分可以消除二次趋势。差分次数对应ARIMA中的d参数。'
  },
  {
    id: 7,
    question: 'ACF（自相关函数）和PACF（偏自相关函数）图的主要用途是？',
    options: [
      '检测异常值',
      '帮助确定ARIMA模型的阶数',
      '计算预测准确率',
      '可视化时间序列'
    ],
    correctAnswer: 1,
    explanation: 'ACF和PACF图是确定ARIMA模型阶数的重要工具。ACF的截尾或拖尾特征可以帮助确定MA阶数q，PACF可以帮助确定AR阶数p。'
  },
  {
    id: 8,
    question: '时间序列分解（Time Series Decomposition）可以将序列分解为哪些成分？',
    options: [
      '均值和方差',
      '趋势项、季节项和残差项',
      '训练集和测试集',
      '信号和噪声'
    ],
    correctAnswer: 1,
    explanation: '时间序列分解将序列分解为趋势项（Trend，长期变化趋势）、季节项（Seasonal，周期性变化）和残差项（Residual，随机波动），便于分析各成分的特征。'
  }
];

const dataMiningQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '关联规则挖掘中，支持度（Support）的含义是？',
    options: [
      '规则在所有交易中出现的频率',
      '规则正确的概率',
      '规则提升度的倒数',
      '规则置信度的平方'
    ],
    correctAnswer: 0,
    explanation: '支持度表示项集在所有交易中出现的频率。例如，如果1000笔交易中有100笔同时包含A和B，则{A,B}的支持度为10%。支持度用于衡量规则的普遍性。'
  },
  {
    id: 2,
    question: 'K-Means聚类算法中，K值代表什么？',
    options: [
      '迭代次数',
      '聚类的数量',
      '数据点的数量',
      '特征的数量'
    ],
    correctAnswer: 1,
    explanation: 'K-Means中的K表示要将数据分成的聚类数量。算法通过迭代优化，将数据点分配到K个簇中，使得簇内距离最小化。K值的选择通常使用肘部法则或轮廓系数。'
  },
  {
    id: 3,
    question: '决策树算法中，信息增益的计算基于什么概念？',
    options: [
      '方差',
      '熵（Entropy）',
      '标准差',
      '均值'
    ],
    correctAnswer: 1,
    explanation: '信息增益基于熵的概念。熵衡量数据的不确定性或混乱程度。信息增益表示按照某个特征分割数据后，熵的减少量。选择信息增益最大的特征作为分裂节点。'
  },
  {
    id: 4,
    question: 'Apriori算法的核心思想是？',
    options: [
      '频繁项集的子集也必须是频繁的',
      '频繁项集的超集也必须是频繁的',
      '所有项集的支持度相等',
      '频繁项集与支持度无关'
    ],
    correctAnswer: 0,
    explanation: 'Apriori算法基于先验原理：如果一个项集是频繁的，那么它的所有子集也必须是频繁的。反之，如果一个项集是不频繁的，那么它的所有超集也一定是不频繁的。'
  },
  {
    id: 5,
    question: 'DBSCAN聚类算法相比K-Means的主要优势是？',
    options: [
      '计算速度更快',
      '可以发现任意形状的簇并能识别噪声点',
      '不需要设置任何参数',
      '只适用于低维数据'
    ],
    correctAnswer: 1,
    explanation: 'DBSCAN是基于密度的聚类算法，可以发现任意形状的簇，而K-Means只能发现球形的簇。此外，DBSCAN能够识别噪声点（异常值），不需要预先指定聚类数量。'
  },
  {
    id: 6,
    question: '在分类问题中，混淆矩阵的"假正例"（False Positive）是指？',
    options: [
      '正确预测为正类的样本',
      '正确预测为负类的样本',
      '实际为负类但预测为正类的样本',
      '实际为正类但预测为负类的样本'
    ],
    correctAnswer: 2,
    explanation: '假正例（FP）是指实际为负类但被模型错误预测为正类的样本。例如，健康人被诊断为患病就是假正例。FP也称为第一类错误。'
  },
  {
    id: 7,
    question: '随机森林相比单一决策树的优势是？',
    options: [
      '训练速度更快',
      '通过集成多个决策树减少过拟合，提高泛化能力',
      '不需要特征选择',
      '只能用于分类问题'
    ],
    correctAnswer: 1,
    explanation: '随机森林通过集成多个决策树（bagging方法）并引入随机特征选择，有效减少了单一决策树的过拟合问题，提高了模型的泛化能力和稳定性。'
  }
];

const businessAnalysisQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: 'ROI（投资回报率）的计算公式是？',
    options: [
      'ROI = 收益 / 成本',
      'ROI = (收益 - 成本) / 成本 × 100%',
      'ROI = 成本 / 收益',
      'ROI = 收益 × 成本'
    ],
    correctAnswer: 1,
    explanation: 'ROI = (收益 - 成本) / 成本 × 100%，表示投资带来的净收益相对于投资成本的百分比。例如，投资100元获得150元收益，ROI = (150-100)/100 × 100% = 50%。'
  },
  {
    id: 2,
    question: '以下哪个指标最适合衡量电商平台的用户留存情况？',
    options: [
      '日活跃用户数（DAU）',
      '留存率',
      '页面浏览量（PV）',
      '转化率'
    ],
    correctAnswer: 1,
    explanation: '留存率是衡量用户在一段时间后是否继续使用产品的关键指标。常见的有次日留存、7日留存、30日留存等，直接反映产品的用户粘性和忠诚度。'
  },
  {
    id: 3,
    question: 'GMV（商品交易总额）与实际收入的区别是？',
    options: [
      'GMV包含未支付订单，实际收入只包含已完成交易',
      'GMV小于实际收入',
      '两者完全相同',
      'GMV只计算退货订单'
    ],
    correctAnswer: 0,
    explanation: 'GMV（Gross Merchandise Volume）是平台上所有订单的总金额，包括未支付、已取消和退货的订单。实际收入则是扣除退货、取消订单后的净收入，更能反映真实业绩。'
  },
  {
    id: 4,
    question: '漏斗分析的主要目的是？',
    options: [
      '计算总收入',
      '分析用户在转化路径各阶段的流失情况',
      '预测未来销量',
      '统计用户画像'
    ],
    correctAnswer: 1,
    explanation: '漏斗分析用于分析用户在转化路径（如浏览→加购→下单→支付）中各阶段的转化率和流失率，帮助发现转化瓶颈，优化用户体验，提高整体转化率。'
  },
  {
    id: 5,
    question: 'CLV（客户终身价值）的意义是？',
    options: [
      '客户单次购买金额',
      '客户从获取到流失期间为企业带来的总利润',
      '客户的年龄',
      '客户的购买频率'
    ],
    correctAnswer: 1,
    explanation: 'CLV（Customer Lifetime Value）预测一个客户在与企业整个关系期间可能带来的净利润总和。它帮助企业决定客户获取成本的合理范围，优化营销投入。'
  },
  {
    id: 6,
    question: 'AARRR模型中的"A"代表什么？',
    options: [
      'Acquisition（获取用户）',
      'Activation（激活用户）',
      'Analysis（分析）',
      'A和B都对'
    ],
    correctAnswer: 3,
    explanation: 'AARRR模型包含五个阶段：Acquisition（获取用户）、Activation（激活用户）、Retention（提高留存）、Revenue（增加收入）、Referral（自传播）。前两个A分别代表获取和激活。'
  },
  {
    id: 7,
    question: '同比和环比的区别是？',
    options: [
      '同比是与去年同期比较，环比是与上一周期比较',
      '同比是与上月比较，环比是与去年比较',
      '两者含义相同',
      '同比用于增长，环比用于下降'
    ],
    correctAnswer: 0,
    explanation: '同比（Year-over-Year）是与去年同期数据比较，消除季节性因素影响；环比（Month-over-Month或Quarter-over-Quarter）是与上一周期比较，反映短期趋势变化。'
  }
];

const groupAggregationQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '在SQL中，GROUP BY子句的作用是？',
    options: [
      '对数据进行排序',
      '将数据按照一个或多个列进行分组',
      '过滤数据',
      '连接多个表'
    ],
    correctAnswer: 1,
    explanation: 'GROUP BY子句用于将数据按照一个或多个列的值进行分组，相同值的行会被分到同一组。分组后通常配合聚合函数（如COUNT、SUM、AVG等）进行统计计算。'
  },
  {
    id: 2,
    question: '以下哪个不是SQL中的聚合函数？',
    options: [
      'COUNT()',
      'SUM()',
      'GROUP_CONCAT()',
      'WHERE()'
    ],
    correctAnswer: 3,
    explanation: 'WHERE不是聚合函数，而是用于过滤数据的子句。COUNT、SUM、AVG、MAX、MIN、GROUP_CONCAT等都是SQL中常用的聚合函数，用于对一组值进行计算并返回单个值。'
  },
  {
    id: 3,
    question: '在Pandas中，df.groupby("category")["value"].mean()的作用是？',
    options: [
      '计算所有value的平均值',
      '按category分组后计算每组的value平均值',
      '计算category的平均值',
      '筛选value大于mean的行'
    ],
    correctAnswer: 1,
    explanation: '该代码首先按category列对DataFrame进行分组，然后对每组中的value列计算平均值。结果是每个category对应的value平均值。'
  },
  {
    id: 4,
    question: 'HAVING子句与WHERE子句的主要区别是？',
    options: [
      'HAVING用于排序，WHERE用于过滤',
      'WHERE过滤行，HAVING过滤分组后的结果',
      '两者功能完全相同',
      'HAVING只能用于数值类型'
    ],
    correctAnswer: 1,
    explanation: 'WHERE在分组前过滤行，不能使用聚合函数；HAVING在分组后过滤分组结果，可以使用聚合函数。例如：HAVING COUNT(*) > 10 筛选出记录数大于10的分组。'
  },
  {
    id: 5,
    question: 'Pandas中pivot_table()函数的作用是？',
    options: [
      '创建数据可视化图表',
      '创建数据透视表，按多个维度进行聚合分析',
      '旋转DataFrame的行列',
      '删除重复数据'
    ],
    correctAnswer: 1,
    explanation: 'pivot_table()用于创建数据透视表，可以按多个维度（index、columns）对数据进行分组聚合，支持多种聚合函数，是进行多维度数据分析的强大工具。'
  },
  {
    id: 6,
    question: '在SQL中，如何计算每个部门的员工数量？',
    options: [
      'SELECT department, COUNT(*) FROM employees',
      'SELECT department, COUNT(*) FROM employees GROUP BY department',
      'SELECT COUNT(department) FROM employees',
      'SELECT department, SUM(*) FROM employees'
    ],
    correctAnswer: 1,
    explanation: '要计算每个部门的员工数量，需要使用GROUP BY department对数据按部门分组，然后使用COUNT(*)计算每组的记录数。如果不使用GROUP BY，COUNT(*)会返回总记录数。'
  },
  {
    id: 7,
    question: 'Pandas中agg()方法的优势是？',
    options: [
      '只能计算平均值',
      '可以同时应用多个聚合函数',
      '只能用于数值列',
      '不需要分组就能使用'
    ],
    correctAnswer: 1,
    explanation: 'agg()方法可以同时应用多个聚合函数，如df.groupby("category").agg({"price": ["mean", "max", "min"], "quantity": "sum"})，可以一次性计算多个统计量，非常灵活。'
  }
];

const marketBasketQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '购物篮分析的主要目的是？',
    options: [
      '计算商品的总销售额',
      '发现商品之间的关联关系，找出经常一起购买的商品组合',
      '分析购物篮的物理属性',
      '统计每个顾客的购买次数'
    ],
    correctAnswer: 1,
    explanation: '购物篮分析通过挖掘交易数据中的关联规则，发现商品之间的关联关系，找出经常一起购买的商品组合，用于商品推荐、货架布局优化、促销策略制定等。'
  },
  {
    id: 2,
    question: '置信度（Confidence）的计算公式是？',
    options: [
      'P(A∩B)',
      'P(B|A) = P(A∩B) / P(A)',
      'P(A|B) = P(A∩B) / P(B)',
      'P(A) × P(B)'
    ],
    correctAnswer: 1,
    explanation: '置信度表示在购买A的条件下购买B的概率，公式为P(B|A) = P(A∩B) / P(A)。例如，购买面包的人中有60%也购买牛奶，则规则"面包→牛奶"的置信度为60%。'
  },
  {
    id: 3,
    question: '提升度（Lift）大于1表示什么？',
    options: [
      'A和B是独立的',
      'A和B负相关',
      'A和B正相关，购买A会增加购买B的可能性',
      'A和B互斥'
    ],
    correctAnswer: 2,
    explanation: '提升度 = 置信度 / 支持度(B)，衡量A和B的相关性。Lift > 1表示正相关，购买A会增加购买B的可能性；Lift = 1表示独立；Lift < 1表示负相关。'
  },
  {
    id: 4,
    question: 'Apriori算法的缺点是？',
    options: [
      '无法处理大数据集',
      '需要多次扫描数据库，计算效率较低',
      '只能发现两个商品的关联',
      '不支持数值型数据'
    ],
    correctAnswer: 1,
    explanation: 'Apriori算法需要多次扫描数据库来生成频繁项集，当数据量大或最小支持度较低时，会产生大量候选项集，导致计算效率较低。FP-Growth算法是其改进版本。'
  },
  {
    id: 5,
    question: '在关联规则 {牛奶, 面包} → {鸡蛋} 中，{牛奶, 面包} 称为？',
    options: [
      '后件（Consequent）',
      '前件（Antecedent）',
      '支持集',
      '置信集'
    ],
    correctAnswer: 1,
    explanation: '在关联规则 X → Y 中，X称为前件（Antecedent或Left-hand side），Y称为后件（Consequent或Right-hand side）。规则表示购买X的顾客倾向于购买Y。'
  },
  {
    id: 6,
    question: '如果规则 {A} → {B} 的支持度是5%，置信度是80%，提升度是1.6，以下说法正确的是？',
    options: [
      '该规则没有实际意义',
      '5%的交易同时包含A和B，购买A的顾客80%会购买B，A和B正相关',
      'A和B是独立的',
      '该规则只适用于5%的顾客'
    ],
    correctAnswer: 1,
    explanation: '支持度5%表示5%的交易同时包含A和B；置信度80%表示购买A的人中80%也购买B；提升度1.6大于1，表示A和B正相关。这是一个有价值的关联规则。'
  },
  {
    id: 7,
    question: '购物篮分析在实际业务中的应用不包括？',
    options: [
      '商品推荐系统',
      '货架布局优化',
      '预测商品价格',
      '促销组合设计'
    ],
    correctAnswer: 2,
    explanation: '购物篮分析用于发现商品关联关系，可应用于商品推荐、货架布局、促销设计等。但预测商品价格需要考虑成本、市场、竞争等因素，不是购物篮分析的主要应用。'
  }
];

const abTestingQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: 'A/B测试的基本原理是？',
    options: [
      '比较两个版本的差异，通过随机对照实验判断哪个版本更好',
      '随机选择用户进行调查',
      '分析历史数据找出规律',
      '预测未来趋势'
    ],
    correctAnswer: 0,
    explanation: 'A/B测试是一种随机对照实验，将用户随机分配到A组（对照组）和B组（实验组），比较两组的表现指标，通过统计检验判断差异是否显著，从而做出数据驱动的决策。'
  },
  {
    id: 2,
    question: '在假设检验中，p值小于0.05意味着？',
    options: [
      '结果不重要',
      '在显著性水平0.05下，拒绝原假设，认为差异是显著的',
      '实验失败了',
      '需要更多数据'
    ],
    correctAnswer: 1,
    explanation: 'p值表示在原假设为真的情况下，观察到当前结果或更极端结果的概率。p < 0.05意味着这种概率小于5%，我们有足够的证据拒绝原假设，认为差异具有统计显著性。'
  },
  {
    id: 3,
    question: '第一类错误（Type I Error）是指？',
    options: [
      '原假设为假时接受原假设',
      '原假设为真时拒绝原假设（假阳性）',
      '实验设计错误',
      '数据收集错误'
    ],
    correctAnswer: 1,
    explanation: '第一类错误也称为假阳性，即原假设为真时错误地拒绝了原假设。例如，实际上没有差异，但检验结果显示有显著差异。显著性水平α就是犯第一类错误的概率上限。'
  },
  {
    id: 4,
    question: 'A/B测试中，样本量过小会导致什么问题？',
    options: [
      '计算速度太慢',
      '统计功效不足，可能检测不到真实存在的差异',
      '数据存储问题',
      '用户投诉'
    ],
    correctAnswer: 1,
    explanation: '样本量过小会导致统计功效（Power）不足，即即使真实存在差异，也可能因为样本量不足而无法检测到。这会增加第二类错误（假阴性）的风险。'
  },
  {
    id: 5,
    question: '95%置信区间的含义是？',
    options: [
      '95%的数据落在这个区间内',
      '如果重复实验多次，约95%的置信区间会包含真实参数值',
      '真实值有95%的概率在这个区间内',
      '区间宽度是95%'
    ],
    correctAnswer: 1,
    explanation: '95%置信区间表示如果重复进行相同的实验很多次，约95%的置信区间会包含真实的参数值。它反映了估计的不确定性程度，区间越窄，估计越精确。'
  },
  {
    id: 6,
    question: '同时进行多个A/B测试时，需要注意什么问题？',
    options: [
      '服务器负载问题',
      '多重比较问题，会增加犯第一类错误的概率',
      '用户隐私问题',
      '数据存储问题'
    ],
    correctAnswer: 1,
    explanation: '同时进行多个测试（多重比较）会增加整体犯第一类错误的概率。例如，进行20次独立的显著性水平0.05的检验，至少出现一次假阳性的概率约为64%。需要进行Bonferroni校正等调整。'
  },
  {
    id: 7,
    question: 'A/B测试的SRM（样本比率偏差）问题是指？',
    options: [
      '样本量不足',
      '用户分配到A/B组的比例与预期不符',
      '实验时间太长',
      '指标选择错误'
    ],
    correctAnswer: 1,
    explanation: 'SRM（Sample Ratio Mismatch）是指实际分配到A/B组的用户比例与预期比例不一致。例如，预期50:50分配，实际却是55:45。这通常表明实验设置或随机化过程存在问题。'
  }
];

const anomalyDetectionQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: 'Z-Score方法识别异常值的标准通常是？',
    options: [
      '|Z-Score| > 1',
      '|Z-Score| > 2',
      '|Z-Score| > 3',
      'Z-Score = 0'
    ],
    correctAnswer: 2,
    explanation: 'Z-Score方法通常将|Z-Score| > 3的数据点视为异常值。Z-Score表示数据点距离均值的标准差倍数，3倍标准差之外的数据较为罕见（在正态分布中约占0.3%）。'
  },
  {
    id: 2,
    question: 'IQR方法识别异常值的公式是？',
    options: [
      '异常值 < Q1 或 异常值 > Q3',
      '异常值 < Q1 - 1.5×IQR 或 异常值 > Q3 + 1.5×IQR',
      '异常值 < 均值 - 标准差',
      '异常值 > 均值 + 标准差'
    ],
    correctAnswer: 1,
    explanation: 'IQR（四分位距）= Q3 - Q1。异常值定义为小于Q1 - 1.5×IQR或大于Q3 + 1.5×IQR的值。这种方法不依赖于数据的分布假设，对极端值较为稳健。'
  },
  {
    id: 3,
    question: '孤立森林（Isolation Forest）算法的原理是？',
    options: [
      '计算数据点之间的距离',
      '通过随机分割隔离异常点，异常点更容易被孤立',
      '使用神经网络检测异常',
      '聚类后找出离群点'
    ],
    correctAnswer: 1,
    explanation: '孤立森林通过随机选择特征和分割点来构建树，异常点由于其稀有性和特殊性，更容易被早期分割出来（路径更短）。正常点需要更多分割才能被隔离（路径更长）。'
  },
  {
    id: 4,
    question: '局部异常因子（LOF）算法的优势是？',
    options: [
      '计算速度最快',
      '可以检测局部异常，适应不同密度的区域',
      '不需要设置参数',
      '只能检测全局异常'
    ],
    correctAnswer: 1,
    explanation: 'LOF算法通过比较数据点与其邻居的局部密度来识别异常。它可以检测局部异常点，即在其局部邻域中密度显著低于邻居的点，适应不同密度区域的数据分布。'
  },
  {
    id: 5,
    question: '以下哪种情况更适合使用Z-Score而不是IQR方法？',
    options: [
      '数据存在极端异常值',
      '数据近似正态分布',
      '数据分布未知',
      '数据有多个峰值'
    ],
    correctAnswer: 1,
    explanation: 'Z-Score方法假设数据近似正态分布，在这种情况下效果较好。如果数据存在极端异常值或分布未知，IQR方法更稳健，因为它基于分位数，不受极端值影响。'
  },
  {
    id: 6,
    question: 'DBSCAN算法可以用于异常检测的原因是？',
    options: [
      '它能自动确定聚类数量',
      '它能识别噪声点（不属于任何簇的点）',
      '它计算速度快',
      '它只能处理二维数据'
    ],
    correctAnswer: 1,
    explanation: 'DBSCAN是基于密度的聚类算法，它将稀疏区域的点标记为噪声点（标签为-1），这些噪声点可以被视为异常值。这种方法特别适合检测局部异常。'
  },
  {
    id: 7,
    question: '时间序列异常检测与普通异常检测的主要区别是？',
    options: [
      '时间序列数据量更大',
      '需要考虑时间依赖性和上下文信息',
      '时间序列只有数值型数据',
      '时间序列不需要标签'
    ],
    correctAnswer: 1,
    explanation: '时间序列异常检测需要考虑数据的时间依赖性。一个值在某个时间点可能是正常的，但在另一个时间点可能是异常的（如季节性波动中的异常）。需要结合时间上下文判断。'
  }
];

const exerciseDataMap: Record<string, ExerciseData> = {
  '1': {
    id: '1',
    title: '数据清洗与预处理',
    description: '通过选择题学习数据清洗与预处理的核心知识点，包括缺失值处理、异常值检测、数据转换等内容。',
    questions: dataCleaningQuestions
  },
  '2': {
    id: '2',
    title: '数据可视化',
    description: '通过选择题学习数据可视化的核心知识点，包括折线图、柱状图、饼图、散点图等图表类型的使用场景和Matplotlib绑图方法。',
    questions: dataVisualizationQuestions
  },
  '3': {
    id: '3',
    title: '机器学习模型训练',
    description: '通过选择题学习机器学习模型训练的核心知识点，包括数据准备、模型训练、模型评估、参数调优等内容。',
    questions: machineLearningQuestions
  },
  '4': {
    id: '4',
    title: '时间序列分析',
    description: '通过选择题学习时间序列分析的核心知识点，包括时间序列数据特征、可视化、平稳性检验、预测模型等内容。',
    questions: timeSeriesQuestions
  },
  '5': {
    id: '5',
    title: '数据挖掘',
    description: '通过选择题学习数据挖掘的核心知识点，包括关联规则挖掘、聚类分析、分类算法等内容。',
    questions: dataMiningQuestions
  },
  '6': {
    id: '6',
    title: '商业分析',
    description: '通过选择题学习商业分析的核心知识点，包括商业指标分析、ROI计算、漏斗分析、客户终身价值等内容。',
    questions: businessAnalysisQuestions
  },
  '7': {
    id: '7',
    title: '分组聚合分析',
    description: '通过选择题学习分组聚合分析的核心知识点，包括GROUP BY子句、聚合函数、HAVING子句、数据透视表等内容。',
    questions: groupAggregationQuestions
  },
  '8': {
    id: '8',
    title: '购物篮分析',
    description: '通过选择题学习购物篮分析的核心知识点，包括支持度、置信度、提升度、Apriori算法等内容。',
    questions: marketBasketQuestions
  },
  '9': {
    id: '9',
    title: 'A/B测试分析',
    description: '通过选择题学习A/B测试分析的核心知识点，包括假设检验、显著性检验、置信区间、样本量计算等内容。',
    questions: abTestingQuestions
  },
  '10': {
    id: '10',
    title: '异常值检测',
    description: '通过选择题学习异常值检测的核心知识点，包括Z-Score方法、IQR方法、孤立森林、LOF算法等内容。',
    questions: anomalyDetectionQuestions
  }
};

interface UserAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
}

const PracticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (id === '11') {
      navigate('/data-analysis-test');
      return;
    }

    const fetchExercise = async () => {
      const data = exerciseDataMap[id || '1'];
      if (data) {
        setExercise(data);
        const initialAnswers: Record<number, UserAnswer> = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = {
            questionId: q.id,
            selectedAnswer: null,
            isCorrect: null
          };
        });
        setUserAnswers(initialAnswers);
      }
      setLoading(false);
    };

    setTimeout(() => {
      fetchExercise();
    }, 300);
  }, [id, navigate]);

  const handleSelectAnswer = (questionId: number, answerIndex: number) => {
    if (submitted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedAnswer: answerIndex
      }
    }));
  };

  const handleSubmit = () => {
    if (!exercise) return;

    let correctCount = 0;
    const newAnswers = { ...userAnswers };

    exercise.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer.selectedAnswer !== null) {
        const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
        newAnswers[question.id] = {
          ...userAnswer,
          isCorrect
        };
        if (isCorrect) correctCount++;
      }
    });

    setUserAnswers(newAnswers);
    setScore(Math.round((correctCount / exercise.questions.length) * 100));
    setSubmitted(true);
  };

  const handleRetry = () => {
    if (!exercise) return;

    const initialAnswers: Record<number, UserAnswer> = {};
    exercise.questions.forEach(q => {
      initialAnswers[q.id] = {
        questionId: q.id,
        selectedAnswer: null,
        isCorrect: null
      };
    });
    setUserAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">练习不存在</div>
      </div>
    );
  }

  const answeredCount = Object.values(userAnswers).filter(a => a.selectedAnswer !== null).length;
  const allAnswered = answeredCount === exercise.questions.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <p className="text-gray-700 mb-6">{exercise.description}</p>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-blue-800">
              已答题目：{answeredCount} / {exercise.questions.length}
            </span>
            {submitted && (
              <span className={`text-lg font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                得分：{score}分
              </span>
            )}
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / exercise.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {exercise.questions.map((question, qIndex) => {
            const userAnswer = userAnswers[question.id];
            const isSelected = userAnswer?.selectedAnswer !== null;
            const showResult = submitted && isSelected;

            return (
              <div 
                key={question.id} 
                className={`p-6 rounded-lg border-2 transition-all ${
                  showResult 
                    ? userAnswer.isCorrect 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start mb-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                    showResult 
                      ? userAnswer.isCorrect 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                      : 'bg-blue-500'
                  }`}>
                    {qIndex + 1}
                  </span>
                  <h3 className="text-lg font-medium text-gray-800 flex-1">
                    {question.question}
                  </h3>
                </div>

                <div className="space-y-3 ml-11">
                  {question.options.map((option, oIndex) => {
                    const isSelectedOption = userAnswer?.selectedAnswer === oIndex;
                    const isCorrectOption = question.correctAnswer === oIndex;
                    
                    let optionClass = 'border-gray-300 bg-white hover:bg-gray-100';
                    if (submitted) {
                      if (isCorrectOption) {
                        optionClass = 'border-green-500 bg-green-100';
                      } else if (isSelectedOption && !isCorrectOption) {
                        optionClass = 'border-red-500 bg-red-100';
                      }
                    } else if (isSelectedOption) {
                      optionClass = 'border-blue-500 bg-blue-100';
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectAnswer(question.id, oIndex)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionClass} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 font-medium">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {submitted && isCorrectOption && (
                            <FaCheck className="text-green-600 ml-2" />
                          )}
                          {submitted && isSelectedOption && !isCorrectOption && (
                            <FaTimes className="text-red-600 ml-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`mt-4 ml-11 p-4 rounded-lg ${
                    userAnswer.isCorrect ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <p className="font-medium text-gray-800 mb-1">
                      {userAnswer.isCorrect ? '✓ 回答正确！' : '✗ 回答错误'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">解析：</span>{question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
                allAnswered 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="px-8 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all"
            >
              重新答题
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{
                color: score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
              }}>
                {score}分
              </div>
              <p className="text-gray-600 mb-4">
                {score >= 80 ? '优秀！你已经很好地掌握了这部分知识！' : 
                 score >= 60 ? '良好！继续努力，争取更好的成绩！' : 
                 '需要加油！建议重新学习相关知识点后再来答题。'}
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-600">
                <span>
                  正确：{Object.values(userAnswers).filter(a => a.isCorrect).length}题
                </span>
                <span>
                  错误：{Object.values(userAnswers).filter(a => a.isCorrect === false).length}题
                </span>
                <span>
                  未答：{Object.values(userAnswers).filter(a => a.selectedAnswer === null).length}题
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeDetail;
