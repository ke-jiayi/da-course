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
    if (id === '5') {
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
