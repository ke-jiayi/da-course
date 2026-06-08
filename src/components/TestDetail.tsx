import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'judgment' | 'essay';
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  score: number;
}

interface TestDetail {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  type: string;
}

interface TestHistory {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalScore: number;
  completedAt: string;
}

const TestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [activeTab, setActiveTab] = useState('test'); // 'test', 'result', 'history'

  useEffect(() => {
    // 模拟获取测试详情数据
    const fetchTestDetail = async () => {
      // 实际项目中，这里应该调用API获取数据
      // 根据不同测试ID返回不同的题目
      const testQuestions: Record<string, Question[]> = {
        '1': [ // 第一章 数据基础测试
          {
            id: '1',
            type: 'single',
            content: '在Python中，以下哪个函数用于获取列表的长度？',
            options: ['len()', 'length()', 'size()', 'count()'],
            correctAnswer: 'len()',
            score: 10
          },
          {
            id: '2',
            type: 'single',
            content: 'Pandas中用于读取CSV文件的函数是？',
            options: ['read_csv()', 'read_json()', 'read_excel()', 'read_table()'],
            correctAnswer: 'read_csv()',
            score: 10
          },
          {
            id: '3',
            type: 'multiple',
            content: '以下哪些是Python中常用的数据结构？',
            options: ['列表（List）', '字典（Dict）', '集合（Set）', '树（Tree）'],
            correctAnswer: ['列表（List）', '字典（Dict）', '集合（Set）'],
            score: 15
          },
          {
            id: '4',
            type: 'judgment',
            content: 'DataFrame是Pandas中的一维数据结构。',
            correctAnswer: 'false',
            score: 5
          },
          {
            id: '5',
            type: 'single',
            content: 'NumPy中用于创建全零数组的函数是？',
            options: ['np.zeros()', 'np.ones()', 'np.empty()', 'np.arange()'],
            correctAnswer: 'np.zeros()',
            score: 10
          },
          {
            id: '6',
            type: 'single',
            content: 'Python中用于条件判断的关键字是？',
            options: ['if', 'for', 'while', 'def'],
            correctAnswer: 'if',
            score: 10
          },
          {
            id: '7',
            type: 'multiple',
            content: '以下哪些是数据清洗的主要步骤？',
            options: ['处理缺失值', '处理重复值', '数据可视化', '异常值检测'],
            correctAnswer: ['处理缺失值', '处理重复值', '异常值检测'],
            score: 15
          },
          {
            id: '8',
            type: 'judgment',
            content: '在Pandas中，loc和iloc都可以用于按标签和位置进行数据选择。',
            correctAnswer: 'true',
            score: 5
          },
          {
            id: '9',
            type: 'single',
            content: 'Matplotlib中用于创建折线图的函数是？',
            options: ['plt.plot()', 'plt.bar()', 'plt.scatter()', 'plt.hist()'],
            correctAnswer: 'plt.plot()',
            score: 10
          },
          {
            id: '10',
            type: 'essay',
            content: '请简述Pandas中Series和DataFrame的区别。',
            correctAnswer: 'Series是一维数据结构，类似于列表或数组；DataFrame是二维表格数据结构，类似于Excel表格或SQL表，由多个Series组成。Series只有一列数据，而DataFrame可以有多列数据。',
            score: 20
          }
        ],
        '2': [ // 第二章 数据分析测试
          {
            id: '1',
            type: 'single',
            content: '分组聚合操作使用哪个方法？',
            options: ['groupby()', 'filter()', 'apply()', 'aggregate()'],
            correctAnswer: 'groupby()',
            score: 10
          },
          {
            id: '2',
            type: 'single',
            content: '计算两个列之间的相关系数使用哪个函数？',
            options: ['corr()', 'cov()', 'var()', 'std()'],
            correctAnswer: 'corr()',
            score: 10
          },
          {
            id: '3',
            type: 'multiple',
            content: '数据可视化的常用图表类型包括？',
            options: ['折线图', '饼图', '词云图', '桑基图'],
            correctAnswer: ['折线图', '饼图'],
            score: 15
          },
          {
            id: '4',
            type: 'judgment',
            content: 'merge()函数用于纵向合并DataFrame。',
            correctAnswer: 'false',
            score: 5
          },
          {
            id: '5',
            type: 'single',
            content: 'Apriori算法用于哪种分析方法？',
            options: ['关联规则挖掘', '聚类分析', '分类预测', '降维分析'],
            correctAnswer: '关联规则挖掘',
            score: 10
          },
          {
            id: '6',
            type: 'single',
            content: 'K-Means算法属于哪种机器学习方法？',
            options: ['聚类', '分类', '回归', '降维'],
            correctAnswer: '聚类',
            score: 10
          },
          {
            id: '7',
            type: 'multiple',
            content: '支持度（Support）的计算公式涉及哪些参数？',
            options: ['包含项集的事务数', '总事务数', '置信度', '提升度'],
            correctAnswer: ['包含项集的事务数', '总事务数'],
            score: 15
          },
          {
            id: '8',
            type: 'judgment',
            content: 'A/B测试中，实验组和对照组的样本量应该相同。',
            correctAnswer: 'true',
            score: 5
          },
          {
            id: '9',
            type: 'single',
            content: '时间序列分析中，用于去除季节性波动的操作称为？',
            options: ['季节性调整', '趋势提取', '平滑处理', '差分'],
            correctAnswer: '季节性调整',
            score: 10
          },
          {
            id: '10',
            type: 'essay',
            content: '请解释什么是购物篮分析中的提升度（Lift）。',
            correctAnswer: '提升度表示在包含商品A的条件下商品B出现的概率，与商品B单独出现的概率的比值。提升度大于1表示A和B之间存在正相关，提升度小于1表示负相关，等于1表示无关联。',
            score: 20
          },
          {
            id: '11',
            type: 'single',
            content: 'Z-Score标准化公式中，分子是什么？',
            options: ['(x - 均值)', '(x - 标准差)', '(均值 - x)', '(x / 均值)'],
            correctAnswer: '(x - 均值)',
            score: 10
          },
          {
            id: '12',
            type: 'single',
            content: 'Matplotlib中设置图表标题的函数是？',
            options: ['plt.title()', 'plt.xlabel()', 'plt.legend()', 'plt.grid()'],
            correctAnswer: 'plt.title()',
            score: 10
          },
          {
            id: '13',
            type: 'multiple',
            content: '异常值检测的常用方法包括？',
            options: ['Z-Score方法', 'IQR方法', 'Isolation Forest', '线性回归'],
            correctAnswer: ['Z-Score方法', 'IQR方法', 'Isolation Forest'],
            score: 15
          },
          {
            id: '14',
            type: 'judgment',
            content: 'concat()函数只能用于合并两个DataFrame。',
            correctAnswer: 'false',
            score: 5
          },
          {
            id: '15',
            type: 'essay',
            content: '请简述数据预处理在机器学习中的重要性。',
            correctAnswer: '数据预处理是机器学习中的关键步骤，主要包括：1）处理缺失值和异常值，保证数据质量；2）特征编码和标准化，使不同量纲的特征可比较；3）特征选择和降维，提高模型效率和泛化能力；4）数据不平衡处理，避免模型偏向多数类。良好的预处理能显著提升模型性能。',
            score: 20
          }
        ],
        '3': [ // 综合测评 - 基础篇
          {
            id: '1',
            type: 'single',
            content: '哪个Pandas方法用于查看数据的基本统计信息？',
            options: ['describe()', 'info()', 'head()', 'tail()'],
            correctAnswer: 'describe()',
            score: 5
          },
          {
            id: '2',
            type: 'single',
            content: '处理缺失值的Pandas方法是？',
            options: ['fillna()', 'dropna()', 'isna()', 'replace()'],
            correctAnswer: 'fillna()',
            score: 5
          },
          {
            id: '3',
            type: 'multiple',
            content: '以下哪些是数据可视化的最佳实践？',
            options: ['选择合适的图表类型', '添加清晰的标题和标签', '使用过多的颜色', '标注数据来源'],
            correctAnswer: ['选择合适的图表类型', '添加清晰的标题和标签', '标注数据来源'],
            score: 8
          },
          {
            id: '4',
            type: 'judgment',
            content: 'iloc用于基于标签进行数据选择。',
            correctAnswer: 'false',
            score: 4
          },
          {
            id: '5',
            type: 'single',
            content: 'NumPy数组的shape属性返回什么？',
            options: ['数组的维度', '数组的元素个数', '数组的数据类型', '数组的内存大小'],
            correctAnswer: '数组的维度',
            score: 5
          },
          {
            id: '6',
            type: 'single',
            content: 'value_counts()方法用于统计什么？',
            options: ['值的出现次数', '值的总和', '值的平均值', '值的最大值'],
            correctAnswer: '值的出现次数',
            score: 5
          },
          {
            id: '7',
            type: 'multiple',
            content: '创建DataFrame的方式包括？',
            options: ['从字典创建', '从列表创建', '从数据库创建', '只能从CSV创建'],
            correctAnswer: ['从字典创建', '从列表创建', '从数据库创建'],
            score: 8
          },
          {
            id: '8',
            type: 'judgment',
            content: 'Python中的列表是可变数据类型。',
            correctAnswer: 'true',
            score: 4
          },
          {
            id: '9',
            type: 'single',
            content: 'drop_duplicates()方法的作用是？',
            options: ['删除重复行', '删除缺失值', '删除指定列', '删除异常值'],
            correctAnswer: '删除重复行',
            score: 5
          },
          {
            id: '10',
            type: 'single',
            content: 'sort_values()方法的默认排序是？',
            options: ['升序', '降序', '随机', '按索引排序'],
            correctAnswer: '升序',
            score: 5
          },
          {
            id: '11',
            type: 'multiple',
            content: 'Matplotlib中可以设置的图表属性包括？',
            options: ['标题', '坐标轴标签', '图例', '只能设置颜色'],
            correctAnswer: ['标题', '坐标轴标签', '图例'],
            score: 8
          },
          {
            id: '12',
            type: 'judgment',
            content: 'loc[]可以同时选择行和列。',
            correctAnswer: 'true',
            score: 4
          },
          {
            id: '13',
            type: 'single',
            content: '哪个函数用于计算平均值？',
            options: ['mean()', 'sum()', 'max()', 'min()'],
            correctAnswer: 'mean()',
            score: 5
          },
          {
            id: '14',
            type: 'single',
            content: 'astype()方法用于什么操作？',
            options: ['数据类型转换', '数据排序', '数据筛选', '数据合并'],
            correctAnswer: '数据类型转换',
            score: 5
          },
          {
            id: '15',
            type: 'multiple',
            content: '以下哪些是Pandas的读取函数？',
            options: ['read_csv()', 'read_excel()', 'read_json()', 'read_html()'],
            correctAnswer: ['read_csv()', 'read_excel()', 'read_json()', 'read_html()'],
            score: 8
          },
          {
            id: '16',
            type: 'judgment',
            content: 'DataFrame的列名必须是字符串类型。',
            correctAnswer: 'false',
            score: 4
          },
          {
            id: '17',
            type: 'single',
            content: 'Python中用于定义函数的关键词是？',
            options: ['def', 'function', 'func', 'define'],
            correctAnswer: 'def',
            score: 5
          },
          {
            id: '18',
            type: 'single',
            content: '哪个方法用于添加新的列到DataFrame？',
            options: ['直接赋值', '只能通过concat', '只能通过merge', '只能通过join'],
            correctAnswer: '直接赋值',
            score: 5
          },
          {
            id: '19',
            type: 'multiple',
            content: 'NumPy数组的优势包括？',
            options: ['支持向量化操作', '占用内存少', '只能存储数字', '执行速度快'],
            correctAnswer: ['支持向量化操作', '占用内存少', '执行速度快'],
            score: 8
          },
          {
            id: '20',
            type: 'essay',
            content: '请简述数据分析的基本流程。',
            correctAnswer: '数据分析的基本流程包括：1）问题定义：明确分析目标和问题；2）数据收集：从各种来源获取数据；3）数据清洗：处理缺失值、异常值和重复值；4）数据探索：使用统计方法和可视化了解数据特征；5）数据建模：应用机器学习或统计分析方法；6）结果验证：评估模型效果；7）结果呈现：用可视化方式展示发现和结论。',
            score: 20
          }
        ],
        '4': [ // 综合测评 - 进阶篇
          {
            id: '1',
            type: 'single',
            content: 'merge()函数的默认连接方式是？',
            options: ['inner', 'left', 'right', 'outer'],
            correctAnswer: 'inner',
            score: 5
          },
          {
            id: '2',
            type: 'single',
            content: '时间序列数据重采样的方法是？',
            options: ['resample()', 'reindex()', 'reshape()', 'rescale()'],
            correctAnswer: 'resample()',
            score: 5
          },
          {
            id: '3',
            type: 'multiple',
            content: '购物篮分析的度量指标包括？',
            options: ['支持度', '置信度', '提升度', '准确率'],
            correctAnswer: ['支持度', '置信度', '提升度'],
            score: 8
          },
          {
            id: '4',
            type: 'judgment',
            content: 'K-Means算法需要预先指定簇的数量。',
            correctAnswer: 'true',
            score: 4
          },
          {
            id: '5',
            type: 'single',
            content: 'Z-Score中，标准化后的数据均值为？',
            options: ['0', '1', '标准差', '方差'],
            correctAnswer: '0',
            score: 5
          },
          {
            id: '6',
            type: 'single',
            content: 'A/B测试中，统计显著性的常用阈值是？',
            options: ['0.05', '0.5', '0.01', '0.95'],
            correctAnswer: '0.05',
            score: 5
          },
          {
            id: '7',
            type: 'multiple',
            content: '特征工程的常见方法包括？',
            options: ['特征缩放', '特征编码', '特征选择', '特征创造'],
            correctAnswer: ['特征缩放', '特征编码', '特征选择', '特征创造'],
            score: 8
          },
          {
            id: '8',
            type: 'judgment',
            content: '梯度下降法只能用于线性回归。',
            correctAnswer: 'false',
            score: 4
          },
          {
            id: '9',
            type: 'single',
            content: 'Matplotlib中用于创建子图的函数是？',
            options: ['subplot()', 'figure()', 'axis()', 'grid()'],
            correctAnswer: 'subplot()',
            score: 5
          },
          {
            id: '10',
            type: 'single',
            content: 'pivot_table()函数用于什么操作？',
            options: ['创建透视表', '合并数据', '分割数据', '转置数据'],
            correctAnswer: '创建透视表',
            score: 5
          },
          {
            id: '11',
            type: 'multiple',
            content: '时间序列的组成部分包括？',
            options: ['趋势', '季节性', '周期性', '随机性'],
            correctAnswer: ['趋势', '季节性', '周期性', '随机性'],
            score: 8
          },
          {
            id: '12',
            type: 'judgment',
            content: 'Isolation Forest是一种基于聚类的异常检测方法。',
            correctAnswer: 'false',
            score: 4
          },
          {
            id: '13',
            type: 'single',
            content: '哪个指标衡量分类模型的准确度？',
            options: ['准确率', '均方误差', 'R方值', '轮廓系数'],
            correctAnswer: '准确率',
            score: 5
          },
          {
            id: '14',
            type: 'single',
            content: 'corr()函数计算的相关系数范围是？',
            options: ['[-1, 1]', '[0, 1]', '[-∞, ∞]', '[0, 100]'],
            correctAnswer: '[-1, 1]',
            score: 5
          },
          {
            id: '15',
            type: 'multiple',
            content: '交叉验证的目的是什么？',
            options: ['评估模型性能', '防止过拟合', '增加训练数据', '特征选择'],
            correctAnswer: ['评估模型性能', '防止过拟合'],
            score: 8
          },
          {
            id: '16',
            type: 'judgment',
            content: '决策树可以处理连续型和离散型特征。',
            correctAnswer: 'true',
            score: 4
          },
          {
            id: '17',
            type: 'single',
            content: 'Random Forest使用什么技术提高模型性能？',
            options: ['集成学习', '特征缩放', '数据增强', '正则化'],
            correctAnswer: '集成学习',
            score: 5
          },
          {
            id: '18',
            type: 'single',
            content: '移动平均法用于什么目的？',
            options: ['平滑数据', '增加数据', '删除数据', '转换数据'],
            correctAnswer: '平滑数据',
            score: 5
          },
          {
            id: '19',
            type: 'multiple',
            content: '模型评估的常用指标包括？',
            options: ['精确率', '召回率', 'F1分数', '准确率'],
            correctAnswer: ['精确率', '召回率', 'F1分数', '准确率'],
            score: 8
          },
          {
            id: '20',
            type: 'essay',
            content: '请解释什么是过拟合，以及如何避免过拟合。',
            correctAnswer: '过拟合是指模型在训练数据上表现良好，但在新数据（测试数据）上表现较差的现象。这表明模型学习了训练数据中的噪声和细节，而不是数据的一般规律。避免过拟合的方法包括：1）增加训练数据量；2）使用交叉验证；3）简化模型复杂度；4）应用正则化技术（L1、L2）；5）使用集成方法；6）进行特征选择，减少冗余特征；7）使用Dropout等技术在训练过程中随机丢弃部分神经元。',
            score: 20
          },
          {
            id: '21',
            type: 'single',
            content: 'Matplotlib中用于显示中文字体的设置是？',
            options: ['font.sans-serif', 'font.serif', 'font.cursive', 'font.fantasy'],
            correctAnswer: 'font.sans-serif',
            score: 5
          },
          {
            id: '22',
            type: 'single',
            content: 'Python中，元组（Tuple）和列表（List）的主要区别是？',
            options: ['元组不可变，列表可变', '列表不可变，元组可变', '两者完全相同', '元组性能更差'],
            correctAnswer: '元组不可变，列表可变',
            score: 5
          },
          {
            id: '23',
            type: 'multiple',
            content: '数据标准化的方法包括？',
            options: ['Min-Max标准化', 'Z-Score标准化', '对数转换', '二值化'],
            correctAnswer: ['Min-Max标准化', 'Z-Score标准化', '对数转换', '二值化'],
            score: 8
          },
          {
            id: '24',
            type: 'judgment',
            content: 'apply()函数可以对DataFrame的每一行或每一列应用自定义函数。',
            correctAnswer: 'true',
            score: 4
          },
          {
            id: '25',
            type: 'essay',
            content: '请解释什么是A/B测试，并说明其实验设计的关键要素。',
            correctAnswer: 'A/B测试是一种统计方法，用于比较两个或多个版本（通常称为A和B）的效果差异，以确定哪个版本更优。关键要素包括：1）明确测试目标，如提高转化率、点击率等；2）随机分组，确保实验组和对照组的样本具有可比性；3）确定样本量和测试时长，确保结果的统计显著性；4）控制变量，只改变需要测试的单一因素；5）设置评估指标，如转化率、用户留存等；6）进行统计显著性检验，判断结果是否具有代表性；7）避免新奇效应和学习效应。',
            score: 20
          }
        ],
        '5': [ // 综合测评 - 高级篇
          {
            id: '1',
            type: 'single',
            content: '贝叶斯定理描述的是？',
            options: ['先验概率和后验概率的关系', '两个变量的相关性', '数据的分布形态', '数据的集中趋势'],
            correctAnswer: '先验概率和后验概率的关系',
            score: 4
          },
          {
            id: '2',
            type: 'single',
            content: '主成分分析（PCA）的目标是？',
            options: ['降维同时保留信息', '增加数据维度', '分类数据', '聚类数据'],
            correctAnswer: '降维同时保留信息',
            score: 4
          },
          {
            id: '3',
            type: 'multiple',
            content: '深度学习中防止过拟合的方法包括？',
            options: ['Dropout', 'Early Stopping', '数据增强', '增加神经元数量'],
            correctAnswer: ['Dropout', 'Early Stopping', '数据增强'],
            score: 6
          },
          {
            id: '4',
            type: 'judgment',
            content: 'LSTM是一种用于处理序列数据的循环神经网络变体。',
            correctAnswer: 'true',
            score: 3
          },
          {
            id: '5',
            type: 'single',
            content: '集成学习中，Bagging和Boosting的主要区别是？',
            options: ['Bagging是并行，Boosting是串行', 'Bagging是串行，Boosting是并行', '两者完全相同', '无区别'],
            correctAnswer: 'Bagging是并行，Boosting是串行',
            score: 4
          },
          {
            id: '6',
            type: 'single',
            content: 'L1正则化产生什么效果？',
            options: ['特征稀疏化', '特征增加', '模型变复杂', '训练变快'],
            correctAnswer: '特征稀疏化',
            score: 4
          },
          {
            id: '7',
            type: 'multiple',
            content: '时间序列预测的方法包括？',
            options: ['ARIMA', 'Prophet', 'LSTM', '线性回归'],
            correctAnswer: ['ARIMA', 'Prophet', 'LSTM'],
            score: 6
          },
          {
            id: '8',
            type: 'judgment',
            content: 'ROC曲线的AUC值越大，模型性能越好。',
            correctAnswer: 'true',
            score: 3
          },
          {
            id: '9',
            type: 'single',
            content: '协同过滤算法主要用于什么场景？',
            options: ['推荐系统', '图像识别', '语音识别', '自然语言处理'],
            correctAnswer: '推荐系统',
            score: 4
          },
          {
            id: '10',
            type: 'single',
            content: 'L2正则化在损失函数中添加的是什么项？',
            options: ['参数平方和', '参数绝对值和', '参数乘积', '参数商'],
            correctAnswer: '参数平方和',
            score: 4
          },
          {
            id: '11',
            type: 'multiple',
            content: '大数据处理框架包括？',
            options: ['Spark', 'Hadoop', 'TensorFlow', 'Kafka'],
            correctAnswer: ['Spark', 'Hadoop', 'Kafka'],
            score: 6
          },
          {
            id: '12',
            type: 'judgment',
            content: '支持向量机（SVM）只能处理线性可分的数据。',
            correctAnswer: 'false',
            score: 3
          },
          {
            id: '13',
            type: 'single',
            content: '在特征重要性分析中，哪个算法提供特征重要性得分？',
            options: ['Random Forest', 'K-Means', 'PCA', 'Apriori'],
            correctAnswer: 'Random Forest',
            score: 4
          },
          {
            id: '14',
            type: 'single',
            content: 'EM算法主要用于什么场景？',
            options: ['处理缺失数据', '增加数据量', '数据可视化', '特征选择'],
            correctAnswer: '处理缺失数据',
            score: 4
          },
          {
            id: '15',
            type: 'multiple',
            content: '自然语言处理中的词嵌入方法包括？',
            options: ['Word2Vec', 'GloVe', 'BERT', 'One-Hot'],
            correctAnswer: ['Word2Vec', 'GloVe', 'BERT'],
            score: 6
          },
          {
            id: '16',
            type: 'judgment',
            content: '卷积神经网络（CNN）只能用于图像处理。',
            correctAnswer: 'false',
            score: 3
          },
          {
            id: '17',
            type: 'single',
            content: '在不平衡数据集上，哪个指标更能反映模型性能？',
            options: ['F1分数', '准确率', '均方误差', 'R方值'],
            correctAnswer: 'F1分数',
            score: 4
          },
          {
            id: '18',
            type: 'single',
            content: 'XGBoost中的"X"代表什么？',
            options: ['Extreme', 'Extended', 'Expert', 'Extra'],
            correctAnswer: 'Extreme',
            score: 4
          },
          {
            id: '19',
            type: 'multiple',
            content: '数据管道的常见组件包括？',
            options: ['数据提取', '数据转换', '数据加载', '数据可视化'],
            correctAnswer: ['数据提取', '数据转换', '数据加载'],
            score: 6
          },
          {
            id: '20',
            type: 'judgment',
            content: '交叉熵损失函数主要用于分类问题。',
            correctAnswer: 'true',
            score: 3
          },
          {
            id: '21',
            type: 'single',
            content: '聚类评估中，轮廓系数的范围是？',
            options: ['[-1, 1]', '[0, 1]', '[-1, 0]', '[0, 2]'],
            correctAnswer: '[-1, 1]',
            score: 4
          },
          {
            id: '22',
            type: 'single',
            content: '注意力机制（Attention）主要用于解决什么问题？',
            options: ['长距离依赖问题', '过拟合问题', '数据缺失问题', '类别不平衡问题'],
            correctAnswer: '长距离依赖问题',
            score: 4
          },
          {
            id: '23',
            type: 'multiple',
            content: '模型部署的常见方式包括？',
            options: ['REST API', '批处理', '实时预测', '边缘计算'],
            correctAnswer: ['REST API', '批处理', '实时预测', '边缘计算'],
            score: 6
          },
          {
            id: '24',
            type: 'judgment',
            content: 'SHAP值只能用于解释树模型。',
            correctAnswer: 'false',
            score: 3
          },
          {
            id: '25',
            type: 'single',
            content: '迁移学习的核心思想是？',
            options: ['将在一个任务上学到的知识应用到另一个任务', '将数据从一个领域迁移到另一个领域', '将模型从一个服务器迁移到另一个服务器', '将特征从一个数据集迁移到另一个数据集'],
            correctAnswer: '将在一个任务上学到的知识应用到另一个任务',
            score: 4
          },
          {
            id: '26',
            type: 'single',
            content: '自编码器（Autoencoder）是一种？',
            options: ['无监督学习算法', '监督学习算法', '强化学习算法', '半监督学习算法'],
            correctAnswer: '无监督学习算法',
            score: 4
          },
          {
            id: '27',
            type: 'multiple',
            content: '模型监控的关键指标包括？',
            options: ['数据漂移', '概念漂移', '模型性能下降', '服务器负载'],
            correctAnswer: ['数据漂移', '概念漂移', '模型性能下降'],
            score: 6
          },
          {
            id: '28',
            type: 'judgment',
            content: 'GAN（生成对抗网络）由两个神经网络组成：生成器和判别器。',
            correctAnswer: 'true',
            score: 3
          },
          {
            id: '29',
            type: 'single',
            content: '在推荐系统中，协同过滤与内容过滤的主要区别是？',
            options: ['协同过滤基于用户行为，内容过滤基于物品特征', '两者完全相同', '协同过滤更简单', '内容过滤不需要数据'],
            correctAnswer: '协同过滤基于用户行为，内容过滤基于物品特征',
            score: 4
          },
          {
            id: '30',
            type: 'essay',
            content: '请设计一个完整的数据科学项目流程，包括从问题定义到模型部署的各个阶段，并说明每个阶段的关键任务和注意事项。',
            correctAnswer: '完整的数据科学项目流程包括：1）问题定义：明确业务问题和成功标准，确定关键绩效指标（KPI）；2）数据收集：获取相关数据，确保数据质量和合法性；3）数据探索：分析数据特征、分布、相关性，发现潜在模式；4）数据预处理：清洗数据、处理缺失值和异常值、特征工程；5）模型开发：选择合适的算法，进行模型训练和调参；6）模型评估：使用交叉验证和多种评估指标验证模型性能；7）模型解释：解释模型决策，确保业务可理解性；8）模型优化：根据反馈持续改进；9）模型部署：将模型集成到生产环境；10）监控维护：持续监控模型性能，处理数据漂移和概念漂移。每个阶段都需要文档记录和版本控制，确保项目的可重复性和可追溯性。',
            score: 25
          }
        ]
      };
      
      const testTitles: Record<string, { title: string; description: string; type: string; duration: number }> = {
        '1': { title: '第一章 数据基础测试', description: '测试你对数据基础概念的理解', type: '章节测试', duration: 30 },
        '2': { title: '第二章 数据分析测试', description: '测试你对数据分析方法的掌握', type: '章节测试', duration: 45 },
        '3': { title: '综合测评 - 基础篇', description: '全面评估你的数据分析基础能力', type: '综合测评', duration: 60 },
        '4': { title: '综合测评 - 进阶篇', description: '全面评估你的数据分析进阶能力', type: '综合测评', duration: 75 },
        '5': { title: '综合测评 - 高级篇', description: '全面评估你的数据分析高级能力', type: '综合测评', duration: 90 }
      };
      
      const mockTest: TestDetail = {
        id: id || '1',
        ...testTitles[id || '1'],
        questions: testQuestions[id || '1'] || testQuestions['1']
      };
      
      // 模拟历史记录
      const mockHistory: TestHistory[] = [
        {
          id: '1',
          testId: '1',
          testTitle: '第一章 数据基础测试',
          score: 85,
          totalScore: 100,
          completedAt: '2024-01-15 14:30:00'
        },
        {
          id: '2',
          testId: '1',
          testTitle: '第一章 数据基础测试',
          score: 92,
          totalScore: 100,
          completedAt: '2024-01-20 10:15:00'
        }
      ];
      
      setTimeout(() => {
        setTest(mockTest);
        setHistory(mockHistory);
        setTotalScore(mockTest.questions.reduce((sum, q) => sum + q.score, 0));
        setLoading(false);
      }, 500);
    };

    fetchTestDetail();
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const handleStartTest = () => {
    setIsStarted(true);
    setTimeLeft((test?.duration || 0) * 60); // 将分钟转换为秒
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!test) return;
    
    let calculatedScore = 0;
    test.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
      
      if (question.type === 'single' || question.type === 'judgment') {
        if (userAnswer === question.correctAnswer) {
          calculatedScore += question.score;
        }
      } else if (question.type === 'multiple') {
        const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        
        const isCorrect = correctAnswers.length === userAnswers.length && 
          correctAnswers.every(answer => userAnswers.includes(answer));
        
        if (isCorrect) {
          calculatedScore += question.score;
        }
      } else if (question.type === 'essay') {
        // 简单的非空检查，实际项目中可能需要更复杂的评分逻辑
        if (userAnswer.toString().trim().length > 0) {
          calculatedScore += question.score * 0.8; // 假设 essay 题得 80% 的分数
        }
      }
    });
    
    setScore(calculatedScore);
    setIsSubmitted(true);
    setActiveTab('result');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  if (!test) {
    return <div className="flex items-center justify-center h-screen">测试不存在</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/test')}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          ← 返回测试列表
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{test.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-6">{test.description}</p>

        <div className="border-b border-gray-200 mb-4">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('test')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'test' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                开始测试
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('result')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'result' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                测试结果
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('history')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                历史记录
              </button>
            </li>
          </ul>
        </div>

        {activeTab === 'test' && (
          <div className="space-y-6">
            {!isStarted ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">准备开始测试</h2>
                <p className="text-gray-600 mb-8">测试将在你点击开始后计时，请确保有足够的时间完成所有题目。</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleStartTest}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    开始测试
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-lg font-medium text-gray-800">
                    剩余时间: <span className="text-red-600 font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="text-lg font-medium text-gray-800">
                    题目进度: {Object.keys(answers).length}/{test.questions.length}
                  </div>
                </div>

                <div className="space-y-8">
                  {test.questions.map((question, index) => (
                    <div key={question.id} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        第 {index + 1} 题 ({question.score}分)
                      </h3>
                      <p className="text-gray-700 mb-4">{question.content}</p>
                      
                      {question.type === 'single' && (
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`q${question.id}_opt${optIndex}`}
                                name={`q${question.id}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="mr-2"
                              />
                              <label htmlFor={`q${question.id}_opt${optIndex}`} className="text-gray-700">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'multiple' && (
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`q${question.id}_opt${optIndex}`}
                                name={`q${question.id}`}
                                value={option}
                                checked={Array.isArray(answers[question.id]) && answers[question.id].includes(option)}
                                onChange={(e) => {
                                  const currentAnswers = Array.isArray(answers[question.id]) ? [...answers[question.id]] : [];
                                  if (e.target.checked) {
                                    currentAnswers.push(option);
                                  } else {
                                    const index = currentAnswers.indexOf(option);
                                    if (index > -1) {
                                      currentAnswers.splice(index, 1);
                                    }
                                  }
                                  handleAnswerChange(question.id, currentAnswers);
                                }}
                                className="mr-2"
                              />
                              <label htmlFor={`q${question.id}_opt${optIndex}`} className="text-gray-700">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'judgment' && (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`q${question.id}_true`}
                              name={`q${question.id}`}
                              value="true"
                              checked={answers[question.id] === 'true'}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="mr-2"
                            />
                            <label htmlFor={`q${question.id}_true`} className="text-gray-700">
                              正确
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`q${question.id}_false`}
                              name={`q${question.id}`}
                              value="false"
                              checked={answers[question.id] === 'false'}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="mr-2"
                            />
                            <label htmlFor={`q${question.id}_false`} className="text-gray-700">
                              错误
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'essay' && (
                        <div>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={5}
                            placeholder="请输入你的答案..."
                            value={answers[question.id] as string || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    提交测试
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'result' && (
          <div className="space-y-6">
            {isSubmitted ? (
              <>
                <div className="text-center py-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">测试结果</h2>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score}/{totalScore}
                  </div>
                  <div className="text-lg text-gray-600">
                    {score >= totalScore * 0.8 ? '优秀' : score >= totalScore * 0.6 ? '及格' : '不及格'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">答题详情</h3>
                  <div className="space-y-4">
                    {test.questions.map((question, index) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = question.type === 'single' || question.type === 'judgment' 
                        ? userAnswer === question.correctAnswer
                        : question.type === 'multiple'
                          ? Array.isArray(userAnswer) && 
                            Array.isArray(question.correctAnswer) &&
                            userAnswer.length === question.correctAnswer.length &&
                            userAnswer.every(ans => question.correctAnswer.includes(ans))
                          : true; // 简答题暂不判断正确性
                      
                      return (
                        <div key={question.id} className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-800">第 {index + 1} 题</h4>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {isCorrect ? '正确' : '错误'}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2 mb-3">{question.content}</p>
                          <div className="text-sm">
                            <div className="mb-2">
                              <span className="font-medium text-gray-700">你的答案: </span>
                              <span className="text-gray-600">
                                {userAnswer ? (Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer) : '未作答'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">正确答案: </span>
                              <span className="text-gray-600">
                                {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/test')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    返回测试列表
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setAnswers({});
                      setIsStarted(false);
                      setActiveTab('test');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    重新测试
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">还未完成测试</h2>
                <p className="text-gray-600 mb-8">请先完成测试并提交答案。</p>
                <button
                  onClick={() => setActiveTab('test')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  开始测试
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">测试历史记录</h2>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">测试名称</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">得分</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">完成时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b text-sm text-gray-800">{record.testTitle}</td>
                        <td className="py-3 px-4 border-b text-sm text-gray-800">{record.score}/{record.totalScore}</td>
                        <td className="py-3 px-4 border-b text-sm text-gray-800">{record.completedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">暂无测试历史记录</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetail;